import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { products } from "../data/products";
import { useApp } from "../context/AppContext";
import ProductCard from "../components/ProductCard";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { dispatch, showToast, isInCart, isInWishlist } = useApp();

  const product = products.find((p) => p.id === id);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews">("desc");
  const [pincode, setPincode] = useState("400001");
  const [deliveryInfo, setDeliveryInfo] = useState("");

  const imgs = product ? [product.image, ...(product.images?.slice(1) ?? [])] : [];

  useEffect(() => {
    if (product) {
      dispatch({ type: "ADD_RECENTLY_VIEWED", product });
      window.scrollTo(0, 0);
    }
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bk-bg">
        <div className="text-center">
          <p className="text-5xl mb-4">😕</p>
          <h2 className="text-xl font-bold text-gray-700">Product not found</h2>
          <Link to="/" className="mt-4 inline-block text-bk-blue hover:underline">Go to Home</Link>
        </div>
      </div>
    );
  }

  const savings = product.originalPrice - product.price;
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 6);

  const addToCart = () => {
    for (let i = 0; i < qty; i++) dispatch({ type: "ADD_TO_CART", product });
    showToast(`${product.name.split(" ").slice(0, 3).join(" ")} added to cart!`);
  };

  const buyNow = () => {
    for (let i = 0; i < qty; i++) dispatch({ type: "ADD_TO_CART", product });
    navigate("/checkout");
  };

  const checkDelivery = () => {
    if (pincode.length === 6) {
      const days = product.deliveryDays;
      const date = new Date();
      date.setDate(date.getDate() + days);
      setDeliveryInfo(`Delivery by ${date.toDateString().split(" ").slice(0, 3).join(" ")} for orders placed before 4 PM`);
    }
  };

  const mockReviews = [
    { name: "Rahul S.", rating: 5, comment: "Excellent product! Exactly as described. Very happy with the purchase.", date: "2 weeks ago" },
    { name: "Priya M.", rating: 4, comment: "Good quality and fast delivery. Packaging was secure.", date: "1 month ago" },
    { name: "Amit K.", rating: 4, comment: "Value for money. Recommended for anyone looking for this product.", date: "3 weeks ago" },
    { name: "Sneha R.", rating: 5, comment: "Amazing product! Loved it. Will buy again from BuyKart.", date: "5 days ago" },
  ];

  return (
    <div className="min-h-screen bg-bk-bg">
      <div className="max-w-350 mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 flex-wrap">
          <Link to="/" className="hover:text-bk-blue">Home</Link>
          <span>›</span>
          <Link to={`/category/${encodeURIComponent(product.category)}`} className="hover:text-bk-blue">{product.category}</Link>
          <span>›</span>
          <span className="text-gray-800 line-clamp-1">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Image column */}
          <div className="bg-white rounded-xl shadow-sm p-5 sticky top-20 h-fit">
            <div className="relative bg-gray-50 rounded-xl overflow-hidden mb-4 aspect-square">
              <img src={imgs[activeImg]} alt={product.name} className="w-full h-full object-contain" />
              {product.badge && (
                <span className="absolute top-3 left-3 bg-bk-yellow text-gray-900 text-xs font-bold px-2 py-1 rounded-full">
                  {product.badge}
                </span>
              )}
            </div>
            {imgs.length > 1 && (
              <div className="flex gap-2 mb-4">
                {imgs.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors ${i === activeImg ? "border-bk-blue" : "border-gray-200"}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={addToCart}
                className={`flex-1 py-3 rounded-xl font-bold transition-colors ${isInCart(product.id) ? "bg-blue-50 border-2 border-bk-blue text-bk-blue" : "bg-bk-blue text-white hover:bg-bk-blue-dark"}`}
              >
                {isInCart(product.id) ? "✓ Added to Cart" : "🛒 Add to Cart"}
              </button>
              <button
                onClick={buyNow}
                className="flex-1 py-3 rounded-xl font-bold bg-bk-yellow hover:bg-bk-yellow-dark text-gray-900 transition-colors"
              >
                ⚡ Buy Now
              </button>
            </div>
            <button
              onClick={() => { dispatch({ type: "TOGGLE_WISHLIST", product }); showToast(isInWishlist(product.id) ? "Removed from wishlist" : "Added to wishlist!", isInWishlist(product.id) ? "info" : "success"); }}
              className={`mt-3 w-full py-2.5 rounded-xl font-semibold border-2 transition-colors flex items-center justify-center gap-2 ${isInWishlist(product.id) ? "bg-red-50 border-red-300 text-red-500" : "border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-500"}`}
            >
              <svg className="w-4 h-4" fill={isInWishlist(product.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {isInWishlist(product.id) ? "Saved to Wishlist" : "Add to Wishlist"}
            </button>
          </div>

          {/* Details column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <p className="text-sm text-gray-400 font-medium uppercase tracking-wide">{product.brand}</p>
              <h1 className="text-xl font-bold font-['Nunito'] text-gray-800 mt-1 leading-tight">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mt-3">
                <span className="bg-green-600 text-white text-sm font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  {product.rating} ★
                </span>
                <span className="text-sm text-gray-500">{product.reviews.toLocaleString()} ratings</span>
                <span className="text-gray-300">|</span>
                <span className="text-sm text-green-600 font-semibold">In Stock</span>
              </div>

              <hr className="my-4" />

              {/* Price */}
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-black text-gray-900 font-['Nunito']">₹{product.price.toLocaleString()}</span>
                <span className="text-lg text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                <span className="text-lg font-bold text-green-600">{product.discount}% off</span>
              </div>
              <p className="text-sm text-green-700 mt-1 font-medium">You save ₹{savings.toLocaleString()}</p>

              {/* Offers */}
              {(product.offers?.length ?? 0) > 0 && (
                <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                  <p className="text-sm font-bold text-gray-700 mb-2">Available Offers</p>
                  <ul className="space-y-1.5">
                    {product.offers!.map((o, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-green-500 mt-0.5">🏷️</span>
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-3 mt-5">
                <span className="text-sm font-semibold text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2 hover:bg-gray-50 text-gray-600 font-bold transition-colors">−</button>
                  <span className="px-4 py-2 border-x border-gray-200 text-sm font-semibold min-w-10 text-center">{qty}</span>
                  <button onClick={() => setQty(Math.min(10, qty + 1))} className="px-4 py-2 hover:bg-gray-50 text-gray-600 font-bold transition-colors">+</button>
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-bold text-gray-800 mb-3">📦 Delivery & Services</h3>
              <div className="flex gap-2">
                <input
                  value={pincode}
                  onChange={(e) => { setPincode(e.target.value); setDeliveryInfo(""); }}
                  maxLength={6}
                  placeholder="Enter pincode"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-bk-blue"
                />
                <button onClick={checkDelivery} className="bg-bk-blue text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-bk-blue-dark transition-colors">
                  Check
                </button>
              </div>
              {deliveryInfo && (
                <p className="mt-2 text-sm text-green-600 font-medium flex items-center gap-1">
                  ✓ {deliveryInfo}
                </p>
              )}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { icon: "🚚", title: "Free Delivery", sub: `In ${product.deliveryDays} days` },
                  { icon: "↩️", title: "7-Day Returns", sub: "Easy returns" },
                  { icon: "✅", title: "Genuine Product", sub: "100% authentic" },
                ].map((s) => (
                  <div key={s.title} className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-xl">{s.icon}</p>
                    <p className="text-xs font-semibold text-gray-700 mt-1">{s.title}</p>
                    <p className="text-[10px] text-gray-400">{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="flex border-b border-gray-100">
                {(["desc", "specs", "reviews"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${activeTab === tab ? "text-bk-blue border-b-2 border-bk-blue" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    {tab === "desc" ? "Description" : tab === "specs" ? "Specifications" : "Reviews"}
                  </button>
                ))}
              </div>
              <div className="p-5">
                {activeTab === "desc" && (
                  <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                )}
                {activeTab === "specs" && (
                  <div className="divide-y divide-gray-50">
                    {Object.entries(product.specifications).map(([k, v]) => (
                      <div key={k} className="flex py-3 gap-4">
                        <span className="text-sm text-gray-500 w-36 shrink-0 capitalize">{k.replace(/_/g, " ")}</span>
                        <span className="text-sm text-gray-800 font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === "reviews" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 pb-4 border-b">
                      <div className="text-center">
                        <p className="text-4xl font-black text-gray-800">{product.rating}</p>
                        <div className="flex gap-0.5 justify-center mt-1">
                          {[1,2,3,4,5].map((s) => (
                            <span key={s} className={`text-sm ${s <= Math.floor(product.rating) ? "text-bk-yellow" : "text-gray-300"}`}>★</span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{product.reviews.toLocaleString()} ratings</p>
                      </div>
                      <div className="flex-1 space-y-1.5">
                        {[5,4,3,2,1].map((s) => (
                          <div key={s} className="flex items-center gap-2 text-xs">
                            <span className="text-gray-500 w-3">{s}</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${[60,25,8,4,3][5-s]}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {mockReviews.map((r, i) => (
                      <div key={i} className="border-b border-gray-50 pb-4 last:border-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-green-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">{r.rating} ★</span>
                          <span className="text-sm font-semibold text-gray-700">{r.name}</span>
                          <span className="text-xs text-gray-400 ml-auto">{r.date}</span>
                        </div>
                        <p className="text-sm text-gray-600">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-8 bg-white rounded-xl shadow-sm p-5">
            <h2 className="text-lg font-bold font-['Nunito'] text-gray-800 mb-5">Similar Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
