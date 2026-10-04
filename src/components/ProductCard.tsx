import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import type { Product } from "../types";

interface Props {
  product: Product;
}

const badgeColors: Record<string, string> = {
  "Best Seller": "bg-bk-yellow text-gray-900",
  New: "bg-green-500 text-white",
  Trending: "bg-orange-500 text-white",
  Limited: "bg-red-500 text-white",
};

export default function ProductCard({ product }: Props) {
  const navigate = useNavigate();
  const { dispatch, showToast, isInCart, isInWishlist } = useApp();

  const addToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: "ADD_TO_CART", product });
    showToast(`${product.name.split(" ").slice(0, 3).join(" ")} added to cart!`);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: "TOGGLE_WISHLIST", product });
    showToast(
      isInWishlist(product.id) ? "Removed from wishlist" : "Added to wishlist!",
      isInWishlist(product.id) ? "info" : "success"
    );
  };

  const buyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: "ADD_TO_CART", product });
    navigate("/checkout");
  };

  return (
    <div
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group overflow-hidden border border-gray-100 flex flex-col"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Image */}
      <div className="relative bg-gray-50 aspect-square overflow-hidden">
        {product.badge && (
          <span className={`absolute top-2 left-2 z-10 text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColors[product.badge] ?? "bg-gray-200"}`}>
            {product.badge}
          </span>
        )}
        {product.discount >= 30 && (
          <span className="absolute top-2 right-2 z-10 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">
            {product.discount}% OFF
          </span>
        )}
        <button
          onClick={toggleWishlist}
          className={`absolute bottom-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-sm ${
            isInWishlist(product.id) ? "bg-red-500 text-white" : "bg-white text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100"
          }`}
        >
          <svg className="w-4 h-4" fill={isInWishlist(product.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">{product.brand}</p>
        <p className="text-sm text-gray-800 font-medium mt-0.5 line-clamp-2 leading-tight">{product.name}</p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
            {product.rating} ★
          </span>
          <span className="text-[10px] text-gray-400">({product.reviews.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-base font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
          <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
          <span className="text-xs font-semibold text-green-600">{product.discount}% off</span>
        </div>

        <p className="text-[10px] text-gray-400 mt-1">
          Free delivery in {product.deliveryDays} {product.deliveryDays === 1 ? "day" : "days"}
        </p>

        {/* Buttons */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={addToCart}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
              isInCart(product.id)
                ? "border-bk-blue text-bk-blue bg-blue-50"
                : "border-bk-blue text-bk-blue hover:bg-bk-blue hover:text-white"
            }`}
          >
            {isInCart(product.id) ? "In Cart ✓" : "Add to Cart"}
          </button>
          <button
            onClick={buyNow}
            className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-bk-yellow hover:bg-bk-yellow-dark text-gray-900 transition-colors"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
