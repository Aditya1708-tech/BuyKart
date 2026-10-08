import { createServer } from "node:http";
import { randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { MongoClient } from "mongodb";

const port = Number(process.env.PORT || process.env.API_PORT || 8787);
const mongoUri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB_NAME || "buykart";
const clientUrl = process.env.CLIENT_URL;
const sessions = new Map();

const seedProducts = [
  { id: "p1", name: "Samsung Galaxy S24 Ultra 5G", category: "Mobiles", brand: "Samsung", price: 109999, originalPrice: 134999, stock: 12, image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop&auto=format" },
  { id: "p2", name: "iPhone 15 Pro Max 256GB", category: "Mobiles", brand: "Apple", price: 134900, originalPrice: 159900, stock: 8, image: "https://images.unsplash.com/photo-1697561598020-ce7fdd62e6f5?w=400&h=400&fit=crop&auto=format" },
  { id: "p5", name: "Sony WH-1000XM5 Headphones", category: "Electronics", brand: "Sony", price: 24990, originalPrice: 34990, stock: 20, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format" },
  { id: "p6", name: "MacBook Air M3 13-inch", category: "Electronics", brand: "Apple", price: 114900, originalPrice: 134900, stock: 6, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&auto=format" },
  { id: "p11", name: "Allen Solly Men's Slim Fit Shirt", category: "Fashion", brand: "Allen Solly", price: 849, originalPrice: 1799, stock: 40, image: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=400&h=400&fit=crop&auto=format" },
];

let client;
let database;

function getAllowedOrigin(origin) {
  if (!origin) return clientUrl || "*";

  if (clientUrl) {
    const allowedList = clientUrl.split(",").map((s) => s.trim().replace(/\/+$/, ""));
    const normalizedOrigin = origin.replace(/\/+$/, "");
    if (allowedList.includes("*") || allowedList.includes(normalizedOrigin)) {
      return origin;
    }
  }

  const isLocalOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  if (isLocalOrigin) {
    return origin;
  }

  if (!clientUrl) {
    return origin || "*";
  }

  return clientUrl.split(",")[0].trim();
}

function getCorsHeaders(origin) {
  const allowed = getAllowedOrigin(origin);
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Vary": "Origin",
  };
}

function json(res, status, body, req) {
  const origin = req?.headers?.origin || res?.req?.headers?.origin;
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    ...getCorsHeaders(origin),
  });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => { body += chunk; if (body.length > 1e6) reject(new Error("Payload too large")); });
    req.on("end", () => { try { resolve(body ? JSON.parse(body) : {}); } catch { reject(new Error("Invalid JSON")); } });
    req.on("error", reject);
  });
}

function hashPassword(password, salt = randomUUID()) {
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

function validPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  const actual = scryptSync(password, salt, 64);
  return timingSafeEqual(actual, Buffer.from(hash, "hex"));
}

async function getUser(req) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const userId = token && sessions.get(token);
  return userId ? database.collection("users").findOne({ id: userId }) : null;
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, phone: user.phone };
}

async function requireUser(req, res) {
  const user = await getUser(req);
  if (!user) json(res, 401, { error: "Authentication required" });
  return user;
}

async function initializeDatabase() {
  if (!mongoUri) throw new Error("MONGODB_URI is not set. Add it to a .env file or your shell environment.");
  client = new MongoClient(mongoUri);
  await client.connect();
  database = client.db(databaseName);

  await database.collection("users").createIndex({ email: 1 }, { unique: true });
  await database.collection("orders").createIndex({ userId: 1, createdAt: -1 });
  await database.collection("carts").createIndex({ userId: 1 }, { unique: true });

  const productCount = await database.collection("products").countDocuments();
  if (productCount === 0) await database.collection("products").insertMany(seedProducts);
  console.log(`Connected to MongoDB database "${databaseName}"`);
}

const server = createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, getCorsHeaders(req.headers.origin));
    return res.end();
  }

  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const path = url.pathname;
  const productCollection = database.collection("products");
  const userCollection = database.collection("users");
  const cartCollection = database.collection("carts");
  const orderCollection = database.collection("orders");

  try {
    if (req.method === "GET" && path === "/api/health") {
      return json(res, 200, {
        ok: true,
        status: "healthy",
        service: "buykart-api",
        database: databaseName,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      }, req);
    }

    if (req.method === "GET" && path === "/api/products") {
      const query = (url.searchParams.get("q") || "").trim();
      const category = url.searchParams.get("category");
      const filter = {};
      if (category) filter.category = category;
      if (query) filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ];
      const result = await productCollection.find(filter, { projection: { _id: 0 } }).toArray();
      return json(res, 200, { products: result, total: result.length });
    }

    if (req.method === "GET" && path.startsWith("/api/products/")) {
      const product = await productCollection.findOne({ id: path.split("/").pop() }, { projection: { _id: 0 } });
      return product ? json(res, 200, product) : json(res, 404, { error: "Product not found" });
    }

    if (req.method === "POST" && path === "/api/auth/register") {
      const body = await readBody(req);
      if (!body.email || !body.password || !body.name) return json(res, 400, { error: "Name, email and password are required" });
      const email = body.email.toLowerCase();
      if (await userCollection.findOne({ email })) return json(res, 409, { error: "An account already exists for this email" });
      const user = { id: randomUUID(), name: body.name, email, phone: body.phone || "", password: hashPassword(body.password) };
      await userCollection.insertOne(user);
      const token = randomUUID();
      sessions.set(token, user.id);
      return json(res, 201, { token, user: publicUser(user) });
    }

    if (req.method === "POST" && path === "/api/auth/login") {
      const body = await readBody(req);
      const user = await userCollection.findOne({ email: (body.email || "").toLowerCase() });
      if (!user || !body.password || !validPassword(body.password, user.password)) return json(res, 401, { error: "Invalid email or password" });
      const token = randomUUID();
      sessions.set(token, user.id);
      return json(res, 200, { token, user: publicUser(user) });
    }

    if (req.method === "GET" && path === "/api/me") {
      const user = await requireUser(req, res);
      return user ? json(res, 200, { user: publicUser(user) }) : undefined;
    }

    if (req.method === "GET" && path === "/api/cart") {
      const user = await requireUser(req, res);
      const cart = user && await cartCollection.findOne({ userId: user.id }, { projection: { _id: 0, userId: 0 } });
      return user ? json(res, 200, { items: cart?.items || [] }) : undefined;
    }

    if (req.method === "PUT" && path === "/api/cart") {
      const user = await requireUser(req, res);
      if (!user) return;
      const body = await readBody(req);
      if (!Array.isArray(body.items)) return json(res, 400, { error: "items must be an array" });
      const items = body.items.map(({ productId, quantity }) => ({ productId, quantity: Math.max(1, Math.min(10, Number(quantity))) }));
      await cartCollection.updateOne({ userId: user.id }, { $set: { userId: user.id, items, updatedAt: new Date() } }, { upsert: true });
      return json(res, 200, { items });
    }

    if (req.method === "POST" && path === "/api/orders") {
      const user = await requireUser(req, res);
      if (!user) return;
      const body = await readBody(req);
      if (!Array.isArray(body.items) || body.items.length === 0) return json(res, 400, { error: "A non-empty cart is required" });
      const lineItems = [];
      for (const item of body.items) {
        const product = await productCollection.findOne({ id: item.productId });
        const quantity = Number(item.quantity);
        if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > product.stock) return json(res, 400, { error: `Invalid quantity or product: ${item.productId}` });
        lineItems.push({ productId: product.id, name: product.name, price: product.price, quantity });
      }
      const subtotal = lineItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const order = { id: `OD${Date.now()}`, userId: user.id, items: lineItems, subtotal, delivery: subtotal > 500 ? 0 : 40, total: subtotal + (subtotal > 500 ? 0 : 40), status: "Ordered", createdAt: new Date() };
      await orderCollection.insertOne(order);
      await cartCollection.deleteOne({ userId: user.id });
      return json(res, 201, order);
    }

    if (req.method === "GET" && path === "/api/orders") {
      const user = await requireUser(req, res);
      const orders = user ? await orderCollection.find({ userId: user.id }, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray() : [];
      return user ? json(res, 200, { orders }) : undefined;
    }

    return json(res, 404, { error: "Route not found" });
  } catch (error) {
    console.error(error);
    return json(res, 500, { error: "Request failed" });
  }
});

initializeDatabase()
  .then(() => server.listen(port, "0.0.0.0", () => console.log(`BuyKart API listening on http://localhost:${port}`)))
  .catch((error) => {
    console.error(`Unable to start BuyKart API: ${error.message}`);
    process.exitCode = 1;
  });
