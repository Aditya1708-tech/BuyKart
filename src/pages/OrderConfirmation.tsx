import { useParams, Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useEffect, useState } from "react";

export default function OrderConfirmation() {
  const { id } = useParams<{ id: string }>();
  const { state } = useApp();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const order = state.orders.find((o) => o.id === id);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(t);
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bk-bg">
        <div className="text-center">
          <p className="text-5xl mb-4">😕</p>
          <h2 className="text-xl font-bold text-gray-700">Order not found</h2>
          <Link to="/" className="mt-4 inline-block text-bk-blue hover:underline">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bk-bg">
      <div className="max-w-175 mx-auto px-4 py-10">
        {/* Success banner */}
        <div className={`bg-white rounded-2xl shadow-sm p-8 text-center mb-6 transition-all duration-700 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-black font-['Nunito'] text-gray-800">Order Placed Successfully! 🎉</h1>
          <p className="text-gray-500 mt-2">Your order has been confirmed and is being processed</p>
          <div className="mt-4 inline-block bg-green-50 border border-green-200 rounded-xl px-6 py-3">
            <p className="text-xs text-gray-500">Order ID</p>
            <p className="font-bold text-green-700 font-mono text-sm">{order.id}</p>
          </div>
        </div>

        {/* Delivery info */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded-xl">
              <p className="text-2xl">📦</p>
              <p className="text-xs font-semibold text-gray-700 mt-1">Estimated Delivery</p>
              <p className="text-xs text-bk-blue font-bold mt-0.5">{order.estimatedDelivery}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-xl">
              <p className="text-2xl">💳</p>
              <p className="text-xs font-semibold text-gray-700 mt-1">Payment</p>
              <p className="text-xs text-gray-600 mt-0.5 capitalize">{order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod.toUpperCase()}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <p className="text-2xl">✅</p>
              <p className="text-xs font-semibold text-gray-700 mt-1">Total Amount</p>
              <p className="text-xs text-green-700 font-bold mt-0.5">₹{order.total.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Order tracking */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <h3 className="font-bold text-gray-800 font-['Nunito'] mb-5">Order Tracking</h3>
          {["Ordered", "Packed", "Shipped", "Out for Delivery", "Delivered"].map((status, i) => {
            const isActive = i === 0;
            return (
              <div key={status} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isActive ? "bg-bk-blue text-white" : "bg-gray-100 text-gray-400"}`}>
                    {isActive ? "✓" : i + 1}
                  </div>
                  {i < 4 && <div className={`w-0.5 h-8 ${isActive ? "bg-bk-blue" : "bg-gray-200"}`} />}
                </div>
                <div className={`pb-6 pt-1 ${isActive ? "text-gray-800" : "text-gray-400"}`}>
                  <p className={`text-sm font-semibold ${isActive ? "text-bk-blue" : ""}`}>{status}</p>
                  {isActive && <p className="text-xs text-gray-400 mt-0.5">Just now</p>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Ordered items */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h3 className="font-bold text-gray-800 font-['Nunito'] mb-4">Ordered Items</h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.product.id} className="flex gap-4 border-b pb-4 last:border-0">
                <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-xl object-cover bg-gray-50" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.product.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                  <p className="text-sm font-bold text-gray-800 mt-1">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            to="/"
            className="flex-1 bg-bk-blue text-white py-3 rounded-xl font-bold text-center hover:bg-bk-blue-dark transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            to="/orders"
            className="flex-1 bg-white border-2 border-bk-blue text-bk-blue py-3 rounded-xl font-bold text-center hover:bg-blue-50 transition-colors"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
