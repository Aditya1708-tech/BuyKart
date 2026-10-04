import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Wishlist() {
  const { state, dispatch, showToast } = useApp();
  const navigate = useNavigate();
  const { wishlist } = state;

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-bk-bg flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm p-16 text-center max-w-md mx-4">
          <div className="text-7xl mb-4">💝</div>
          <h2 className="text-2xl font-black font-['Nunito'] text-gray-800 mb-2">Your wishlist is empty!</h2>
          <p className="text-gray-400 mb-8">Save your favourite items for later</p>
          <Link to="/" className="bg-bk-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-bk-blue-dark transition-colors inline-block">
            Continue Shopping
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
          <span className="text-gray-800 font-medium">Wishlist ({wishlist.length} items)</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {wishlist.map(({ product }) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden group border border-gray-100">
              <div
                className="relative bg-gray-50 aspect-square cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <button
                  onClick={(e) => { e.stopPropagation(); dispatch({ type: "TOGGLE_WISHLIST", product }); showToast("Removed from wishlist", "info"); }}
                  className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow text-red-500 hover:bg-red-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-400 uppercase">{product.brand}</p>
                <p className="text-sm font-medium text-gray-800 line-clamp-2 mt-0.5">{product.name}</p>
                <div className="flex items-baseline gap-1.5 mt-2">
                  <span className="font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                  <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => { dispatch({ type: "MOVE_TO_CART", productId: product.id }); showToast(`${product.name.split(" ").slice(0, 3).join(" ")} moved to cart!`); }}
                  className="w-full mt-3 py-2 bg-bk-blue hover:bg-bk-blue-dark text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Move to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
