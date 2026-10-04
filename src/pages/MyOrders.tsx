import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const statusColors: Record<string, string> = {
  Ordered: "bg-blue-100 text-blue-700",
  Packed: "bg-yellow-100 text-yellow-700",
  Shipped: "bg-purple-100 text-purple-700",
  "Out for Delivery": "bg-orange-100 text-orange-700",
  Delivered: "bg-green-100 text-green-700",
};

const trackingSteps = ["Ordered", "Packed", "Shipped", "Out for Delivery", "Delivered"];

export default function MyOrders() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [tracking, setTracking] = useState<string | null>(null);

  if (state.orders.length === 0) {
    return (
      <div className="min-h-screen bg-bk-bg flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm p-16 text-center max-w-md mx-4">
          <div className="text-7xl mb-4">📦</div>
          <h2 className="text-2xl font-black font-['Nunito'] text-gray-800 mb-2">No orders yet</h2>
          <p className="text-gray-400 mb-8">Start shopping to see your orders here</p>
          <Link to="/" className="bg-bk-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-bk-blue-dark transition-colors inline-block">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bk-bg">
      <div className="max-w-[900px] mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-bk-blue">Home</Link>
          <span>›</span>
          <Link to="/account" className="hover:text-bk-blue">My Account</Link>
          <span>›</span>
          <span className="text-gray-800">My Orders</span>
        </div>

        <h1 className="text-xl font-black font-['Nunito'] text-gray-800 mb-4">My Orders</h1>

        <div className="space-y-4">
          {state.orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Order header */}
              <div className="bg-gray-50 px-5 py-3 flex flex-wrap items-center justify-between gap-3 border-b">
                <div className="flex flex-wrap gap-6 text-xs text-gray-500">
                  <div>
                    <p className="font-bold text-gray-700 text-sm">ORDER ID</p>
                    <p className="font-mono">{order.id}</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-700 text-sm">DATE</p>
                    <p>{new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-700 text-sm">TOTAL</p>
                    <p className="font-semibold text-gray-800">₹{order.total.toLocaleString()}</p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColors[order.status]}`}>
                  {order.status}
                </span>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-50">
                {order.items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-4 px-5 py-4">
                    <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-xl object-cover bg-gray-50 cursor-pointer hover:opacity-80" onClick={() => navigate(`/product/${item.product.id}`)} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.product.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity} · ₹{item.product.price.toLocaleString()} each</p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <span className="font-bold text-sm text-gray-800">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                      <button
                        onClick={() => setTracking(tracking === order.id ? null : order.id)}
                        className="text-xs text-bk-blue hover:underline font-semibold"
                      >
                        Track Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tracking */}
              {tracking === order.id && (
                <div className="bg-blue-50 px-5 py-4 border-t border-blue-100">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-4">Order Tracking</p>
                  <div className="flex items-center justify-between">
                    {trackingSteps.map((s, i) => {
                      const currentIdx = trackingSteps.indexOf(order.status);
                      const done = i <= currentIdx;
                      const active = i === currentIdx;
                      return (
                        <div key={s} className="flex-1 flex flex-col items-center relative">
                          {i < trackingSteps.length - 1 && (
                            <div className={`absolute top-3.5 left-1/2 w-full h-0.5 ${done && i < currentIdx ? "bg-green-400" : "bg-gray-300"}`} />
                          )}
                          <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${active ? "bg-bk-blue text-white scale-110" : done ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"}`}>
                            {done ? "✓" : i + 1}
                          </div>
                          <span className={`text-[10px] mt-2 text-center leading-tight ${active ? "text-bk-blue font-bold" : done ? "text-green-600 font-medium" : "text-gray-400"}`}>{s}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
