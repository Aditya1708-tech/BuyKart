import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import type { Address, Order } from "../types";

type Step = 1 | 2 | 3 | 4;

const steps = ["Login", "Delivery Address", "Order Summary", "Payment"];

export default function Checkout() {
  const { state, dispatch, showToast, cartTotal } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(state.user ? 2 : 1);
  const [address, setAddress] = useState<Address>({
    id: "a1", name: state.user?.name ?? "", phone: state.user?.phone ?? "",
    pincode: "400001", city: "Mumbai", state: "Maharashtra",
    addressLine: "", type: "Home",
  });
  const [payMethod, setPayMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");

  const { cart } = state;
  const delivery = cartTotal > 500 ? 0 : 40;
  const discount = cart.reduce((s, i) => s + (i.product.originalPrice - i.product.price) * i.quantity, 0);
  const total = cartTotal + delivery;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-bk-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🛒</p>
          <h2 className="text-xl font-bold text-gray-700">Your cart is empty</h2>
          <Link to="/" className="mt-4 inline-block bg-bk-blue text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-bk-blue-dark transition-colors">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  const placeOrder = () => {
    const orderId = "OD" + Date.now().toString().slice(-10);
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);
    const order: Order = {
      id: orderId,
      items: cart,
      total,
      date: new Date().toISOString(),
      status: "Ordered",
      address,
      paymentMethod: payMethod,
      estimatedDelivery: deliveryDate.toDateString(),
    };
    dispatch({ type: "ADD_ORDER", order });
    dispatch({ type: "CLEAR_CART" });
    navigate(`/order-confirmation/${orderId}`);
  };

  return (
    <div className="min-h-screen bg-bk-bg">
      <div className="max-w-[900px] mx-auto px-4 py-4">
        {/* Stepper */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => {
              const n = (i + 1) as Step;
              const active = step === n;
              const done = step > n;
              return (
                <div key={s} className="flex-1 flex items-center">
                  <div className={`flex flex-col items-center ${i < steps.length - 1 ? "w-full" : ""}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${done ? "bg-green-500 text-white" : active ? "bg-bk-blue text-white" : "bg-gray-100 text-gray-400"}`}>
                      {done ? "✓" : n}
                    </div>
                    <span className={`text-[10px] mt-1 font-medium text-center ${active ? "text-bk-blue" : done ? "text-green-600" : "text-gray-400"}`}>{s}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 mb-4 ${step > n ? "bg-green-400" : "bg-gray-200"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            {/* Step 1: Login */}
            {step === 1 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold font-['Nunito'] text-gray-800 mb-4">Login or Sign Up</h2>
                {state.user ? (
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                    <span className="text-2xl">✅</span>
                    <div>
                      <p className="font-semibold text-gray-800">{state.user.name}</p>
                      <p className="text-sm text-gray-500">{state.user.email}</p>
                    </div>
                    <button onClick={() => setStep(2)} className="ml-auto bg-bk-blue text-white px-4 py-2 rounded-lg text-sm font-semibold">Continue →</button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Please login to continue</p>
                    <button
                      onClick={() => { dispatch({ type: "SET_USER", user: { name: "Guest User", email: "guest@buykart.com", phone: "9999999999" } }); setStep(2); showToast("Logged in as Guest"); }}
                      className="bg-bk-blue text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-bk-blue-dark transition-colors"
                    >
                      Continue as Guest
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Address */}
            {step === 2 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold font-['Nunito'] text-gray-800 mb-4">Delivery Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Full Name", key: "name", col: "col-span-1" },
                    { label: "Phone Number", key: "phone", col: "col-span-1" },
                    { label: "Address Line", key: "addressLine", col: "col-span-2" },
                    { label: "Pincode", key: "pincode", col: "col-span-1" },
                    { label: "City", key: "city", col: "col-span-1" },
                    { label: "State", key: "state", col: "col-span-1" },
                  ].map(({ label, key, col }) => (
                    <div key={key} className={col}>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
                      <input
                        value={address[key as keyof Address] as string}
                        onChange={(e) => setAddress({ ...address, [key]: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-bk-blue transition-colors"
                        placeholder={label}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Address Type</label>
                    <div className="flex gap-2">
                      {(["Home", "Work", "Other"] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setAddress({ ...address, type: t })}
                          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${address.type === t ? "border-bk-blue bg-blue-50 text-bk-blue" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setStep(3)}
                  disabled={!address.addressLine || !address.name || !address.phone}
                  className="mt-6 w-full bg-bk-blue text-white py-3 rounded-xl font-bold hover:bg-bk-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Deliver Here →
                </button>
              </div>
            )}

            {/* Step 3: Summary */}
            {step === 3 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold font-['Nunito'] text-gray-800 mb-4">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex gap-4 border-b pb-4 last:border-0">
                      <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-lg object-cover bg-gray-50" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.product.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                        <p className="text-sm font-bold text-gray-800 mt-1">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-blue-50 rounded-xl p-3 mb-4">
                  <p className="text-xs font-semibold text-gray-600">Delivering to:</p>
                  <p className="text-sm text-gray-700 mt-0.5">{address.name}, {address.addressLine}, {address.city}, {address.state} - {address.pincode}</p>
                </div>
                <button onClick={() => setStep(4)} className="w-full bg-bk-blue text-white py-3 rounded-xl font-bold hover:bg-bk-blue-dark transition-colors">
                  Proceed to Payment →
                </button>
              </div>
            )}

            {/* Step 4: Payment */}
            {step === 4 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold font-['Nunito'] text-gray-800 mb-4">Payment Options</h2>
                <div className="space-y-3">
                  {[
                    { id: "upi", label: "UPI", icon: "📱", desc: "Google Pay, PhonePe, Paytm, BHIM" },
                    { id: "card", label: "Credit / Debit Card", icon: "💳", desc: "Visa, Mastercard, RuPay" },
                    { id: "netbanking", label: "Net Banking", icon: "🏦", desc: "All major banks" },
                    { id: "cod", label: "Cash on Delivery", icon: "💵", desc: "Pay when delivered" },
                  ].map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setPayMethod(m.id)}
                      className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-colors ${payMethod === m.id ? "border-bk-blue bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payMethod === m.id ? "border-bk-blue" : "border-gray-300"}`}>
                        {payMethod === m.id && <div className="w-2.5 h-2.5 bg-bk-blue rounded-full" />}
                      </div>
                      <span className="text-2xl">{m.icon}</span>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{m.label}</p>
                        <p className="text-xs text-gray-400">{m.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {payMethod === "upi" && (
                  <div className="mt-4">
                    <input
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="Enter UPI ID (e.g. name@paytm)"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-bk-blue"
                    />
                  </div>
                )}

                <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Amount to pay</p>
                    <p className="text-xl font-black text-gray-800 font-['Nunito']">₹{total.toLocaleString()}</p>
                  </div>
                  <button
                    onClick={placeOrder}
                    className="bg-bk-yellow hover:bg-bk-yellow-dark text-gray-900 font-bold px-8 py-3 rounded-xl transition-colors"
                  >
                    Pay & Place Order 🎉
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mini cart summary */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-5 sticky top-20">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Price Summary</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>{cart.reduce((s, i) => s + i.quantity, 0)} items</span>
                  <span>₹{cart.reduce((s, i) => s + i.product.originalPrice * i.quantity, 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>− ₹{discount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className={delivery === 0 ? "text-green-600" : ""}>{delivery === 0 ? "FREE" : `₹${delivery}`}</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold text-gray-800 text-base">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <p className="text-green-600 text-xs font-medium">Saving ₹{discount.toLocaleString()}</p>
              </div>

              {/* Safe payment badge */}
              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400 border-t pt-4">
                <span>🔒</span>
                <span>100% Safe & Secure Payments</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
