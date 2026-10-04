import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Cart() {
  const { state, dispatch, showToast, cartTotal } = useApp();
  const navigate = useNavigate();
  const { cart } = state;

  const delivery = cartTotal > 500 ? 0 : 40;
  const discount = cart.reduce((s, i) => s + (i.product.originalPrice - i.product.price) * i.quantity, 0);
  const total = cartTotal + delivery;

  const remove = (id: string) => {
    dispatch({ type: "REMOVE_FROM_CART", productId: id });
    showToast("Item removed from cart", "info");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-bk-bg flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm p-16 text-center max-w-md mx-4">
          <div className="text-7xl mb-4">🛒</div>
          <h2 className="text-2xl font-black font-['Nunito'] text-gray-800 mb-2">Your cart is empty!</h2>
          <p className="text-gray-400 mb-8">Add items to it now</p>
          <Link
            to="/"
            className="bg-bk-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-bk-blue-dark transition-colors inline-block"
          >
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bk-bg">
      <div className="max-w-350 mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-bk-blue">Home</Link>
          <span>›</span>
          <span className="text-gray-800 font-medium">Cart ({cart.length} items)</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-3">
            {cart.map((item) => (
              <div key={item.product.id} className="bg-white rounded-xl shadow-sm p-4 flex gap-4">
                <div
                  className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 shrink-0 cursor-pointer"
                  onClick={() => navigate(`/product/${item.product.id}`)}
                >
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium text-gray-800 line-clamp-2 cursor-pointer hover:text-bk-blue"
                    onClick={() => navigate(`/product/${item.product.id}`)}
                  >
                    {item.product.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.product.brand}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-base font-bold text-gray-900">₹{item.product.price.toLocaleString()}</span>
                    <span className="text-xs text-gray-400 line-through">₹{item.product.originalPrice.toLocaleString()}</span>
                    <span className="text-xs text-green-600 font-semibold">{item.product.discount}% off</span>
                  </div>
                  <p className="text-xs text-green-600 mt-0.5">
                    Free delivery in {item.product.deliveryDays} days
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => item.quantity === 1 ? remove(item.product.id) : dispatch({ type: "UPDATE_QUANTITY", productId: item.product.id, quantity: item.quantity - 1 })}
                        className="px-3 py-1 hover:bg-gray-50 text-gray-600 font-bold"
                      >−</button>
                      <span className="px-3 py-1 border-x border-gray-200 text-sm font-semibold min-w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => dispatch({ type: "UPDATE_QUANTITY", productId: item.product.id, quantity: Math.min(10, item.quantity + 1) })}
                        className="px-3 py-1 hover:bg-gray-50 text-gray-600 font-bold"
                      >+</button>
                    </div>
                    <button onClick={() => remove(item.product.id)} className="text-sm text-red-500 hover:text-red-700 font-medium">Remove</button>
                    <button
                      onClick={() => { dispatch({ type: "ADD_TO_WISHLIST", product: item.product }); showToast("Saved to wishlist"); remove(item.product.id); }}
                      className="text-sm text-bk-blue hover:underline font-medium"
                    >
                      Save for later
                    </button>
                  </div>
                </div>
                <div className="text-right shrink-0 hidden sm:block">
                  <p className="font-bold text-gray-800">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                  {item.quantity > 1 && (
                    <p className="text-xs text-gray-400">₹{item.product.price.toLocaleString()} each</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-5 sticky top-20">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Price Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>Price ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>₹{cart.reduce((s, i) => s + i.product.originalPrice * i.quantity, 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>− ₹{discount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery Charges</span>
                  <span className={delivery === 0 ? "text-green-600 font-medium" : ""}>{delivery === 0 ? "FREE" : `₹${delivery}`}</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold text-gray-800 text-base">
                  <span>Total Amount</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>
              <p className="text-green-600 text-sm font-semibold mt-3">
                You will save ₹{discount.toLocaleString()} on this order
              </p>
              <button
                onClick={() => navigate("/checkout")}
                className="w-full mt-4 bg-bk-yellow hover:bg-bk-yellow-dark text-gray-900 font-bold py-3 rounded-xl transition-colors"
              >
                Place Order
              </button>
              <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-400">
                <span>🔒</span>
                <span>Safe and Secure Payments</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
