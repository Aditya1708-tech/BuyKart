import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import LoginModal from "./LoginModal";
import { categories } from "../data/products";
import { searchProducts } from "../data/products";
import type { Product } from "../types";

export default function Navbar() {
  const { state, dispatch, cartCount, showToast } = useApp();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSugg, setShowSugg] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [location, setLocation] = useState("Mumbai, 400001");
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSugg(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (q = query) => {
    if (!q.trim()) return;
    setShowSugg(false);
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (val.length > 1) {
      const results = searchProducts(val).slice(0, 6);
      setSuggestions(results);
      setShowSugg(results.length > 0);
    } else {
      setShowSugg(false);
    }
  };

  const wishlistCount = state.wishlist.length;

  return (
    <>
      <header className="sticky top-0 z-40 bg-bk-blue shadow-md">
        <div className="max-w-350 mx-auto px-4">
          <div className="flex items-center gap-3 py-2.5">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-1.5 shrink-0">
              <div className="bg-bk-yellow rounded-lg w-8 h-8 flex items-center justify-center">
                <span className="text-bk-blue font-black text-sm font-['Nunito']">BK</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-white font-black text-xl font-['Nunito'] tracking-tight">Buy</span>
                <span className="text-bk-yellow font-black text-xl font-['Nunito'] tracking-tight">Kart</span>
                <div className="text-[10px] text-blue-200 leading-none italic -mt-0.5">India ka Apna Store</div>
              </div>
            </Link>

            {/* Location */}
            <button
              className="hidden lg:flex flex-col items-start text-white hover:text-bk-yellow transition-colors shrink-0 ml-2"
              onClick={() => {
                const l = prompt("Enter your delivery location (city, pincode):", location);
                if (l) setLocation(l);
              }}
            >
              <span className="text-[10px] text-blue-200">Deliver to</span>
              <div className="flex items-center gap-1 text-xs font-semibold">
                <span>📍</span>
                <span className="max-w-[120px] truncate">{location}</span>
                <span className="text-[10px]">▼</span>
              </div>
            </button>

            {/* Search */}
            <div ref={searchRef} className="flex-1 relative mx-2">
              <div className="flex items-center bg-white rounded-lg overflow-hidden shadow-sm">
                <input
                  className="flex-1 px-4 py-2 text-sm text-gray-800 outline-none placeholder-gray-400"
                  placeholder="Search for products, brands and more"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  onFocus={() => query.length > 1 && setShowSugg(suggestions.length > 0)}
                />
                <button
                  onClick={() => handleSearch()}
                  className="bg-bk-yellow hover:bg-bk-yellow-dark px-4 py-2.5 transition-colors"
                >
                  <svg className="w-4 h-4 text-bk-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
              {showSugg && (
                <div className="absolute top-full left-0 right-0 bg-white rounded-b-lg shadow-2xl border border-gray-100 z-50 max-h-72 overflow-y-auto">
                  {suggestions.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer"
                      onClick={() => { setQuery(p.name); setShowSugg(false); navigate(`/product/${p.id}`); }}
                    >
                      <img src={p.image} alt={p.name} className="w-8 h-8 object-cover rounded" />
                      <div>
                        <p className="text-sm text-gray-800 line-clamp-1">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.category}</p>
                      </div>
                      <span className="ml-auto text-sm font-semibold text-gray-700">₹{p.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Login/Account */}
              <div className="relative">
                <button
                  className="flex flex-col items-center text-white hover:text-bk-yellow transition-colors px-2 py-1"
                  onClick={() => state.user ? setShowAccount(!showAccount) : setShowLogin(true)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-[10px] hidden sm:block">{state.user ? state.user.name.split(" ")[0] : "Login"}</span>
                </button>
                {showAccount && state.user && (
                  <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-2xl w-52 z-50 overflow-hidden">
                    <div className="bg-bk-blue px-4 py-3 text-white">
                      <p className="font-semibold text-sm">{state.user.name}</p>
                      <p className="text-xs text-blue-200">{state.user.email}</p>
                    </div>
                    {[
                      { label: "My Account", path: "/account" },
                      { label: "My Orders", path: "/orders" },
                      { label: "Wishlist", path: "/wishlist" },
                    ].map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-50 last:border-0"
                        onClick={() => setShowAccount(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                    <button
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                      onClick={() => { dispatch({ type: "SET_USER", user: null }); setShowAccount(false); showToast("Logged out successfully", "info"); }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <Link to="/wishlist" className="relative flex flex-col items-center text-white hover:text-bk-yellow transition-colors px-2 py-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-[10px] hidden sm:block">Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-bk-yellow text-bk-blue text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link to="/cart" className="relative flex flex-col items-center text-white hover:text-bk-yellow transition-colors px-2 py-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-[10px] hidden sm:block">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-bk-yellow text-bk-blue text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile menu toggle */}
              <button
                className="lg:hidden text-white px-2 py-1"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Category menu */}
          <nav className="hidden lg:flex items-center gap-1 pb-2 overflow-x-auto scrollbar-none">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/category/${encodeURIComponent(cat.name)}`}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-white hover:bg-white/20 text-xs font-medium whitespace-nowrap transition-colors"
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="lg:hidden bg-[#1a3f7f] px-4 py-3">
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  to={`/category/${encodeURIComponent(cat.name)}`}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span className="text-center leading-tight">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}
