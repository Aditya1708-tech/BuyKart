import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { products, categories } from "../data/products";
import { useApp } from "../context/AppContext";
import ProductCard from "../components/ProductCard";

const banners = [
  {
    id: 1,
    title: "Mega Electronics Sale",
    subtitle: "Up to 70% off on Mobiles & Laptops",
    cta: "Shop Now",
    category: "Electronics",
    bg: "from-[#1a3f7f] to-[#2557a7]",
    img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=300&fit=crop&auto=format",
    badge: "MEGA SALE",
  },
  {
    id: 2,
    title: "Fashion Fiesta",
    subtitle: "Trendy styles at unbeatable prices",
    cta: "Explore Fashion",
    category: "Fashion",
    bg: "from-[#7B1EA2] to-[#AB47BC]",
    img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=300&fit=crop&auto=format",
    badge: "NEW ARRIVALS",
  },
  {
    id: 3,
    title: "Home Makeover Sale",
    subtitle: "Transform your space with amazing deals",
    cta: "Shop Home",
    category: "Home & Furniture",
    bg: "from-[#E65100] to-[#FF8F00]",
    img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=300&fit=crop&auto=format",
    badge: "UP TO 60% OFF",
  },
  {
    id: 4,
    title: "Beauty Bonanza",
    subtitle: "Premium skincare & makeup for less",
    cta: "Shop Beauty",
    category: "Beauty",
    bg: "from-[#880E4F] to-[#E91E63]",
    img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=300&fit=crop&auto=format",
    badge: "BESTSELLERS",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { state } = useApp();
  const [bannerIdx, setBannerIdx] = useState(0);

  const next = useCallback(() => setBannerIdx((i) => (i + 1) % banners.length), []);
  const prev = () => setBannerIdx((i) => (i - 1 + banners.length) % banners.length);

  useEffect(() => {
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [next]);

  const bestSellers = products.filter((p) => p.badge === "Best Seller").slice(0, 8);
  const deals = products.filter((p) => p.discount >= 35).slice(0, 8);
  const trending = products.filter((p) => p.badge === "Trending").slice(0, 8);
  const newArrivals = products.filter((p) => p.badge === "New").slice(0, 8);
  const recentlyViewed = state.recentlyViewed;

  return (
    <div className="min-h-screen bg-bk-bg">
      {/* Banner Carousel */}
      <section className="relative overflow-hidden bg-bk-blue shadow-lg">
        <div className="relative h-52 sm:h-64 md:h-72">
          {banners.map((b, i) => (
            <div
              key={b.id}
              className={`absolute inset-0 transition-opacity duration-700 ${i === bannerIdx ? "opacity-100" : "opacity-0"}`}
            >
              <div className={`w-full h-full bg-linear-to-r ${b.bg} flex items-center`}>
                <div className="absolute inset-0">
                  <img src={b.img} alt={b.title} className="w-full h-full object-cover opacity-30" />
                </div>
                <div className="relative z-10 max-w-350 mx-auto px-6 sm:px-10 flex flex-col gap-3">
                  <span className="inline-block bg-bk-yellow text-gray-900 text-[10px] font-bold px-3 py-1 rounded-full w-fit">
                    {b.badge}
                  </span>
                  <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-black font-['Nunito'] leading-tight">
                    {b.title}
                  </h1>
                  <p className="text-blue-100 text-sm sm:text-base">{b.subtitle}</p>
                  <button
                    onClick={() => navigate(`/category/${encodeURIComponent(b.category)}`)}
                    className="bg-bk-yellow hover:bg-white text-gray-900 font-bold px-6 py-2 rounded-lg w-fit text-sm transition-colors"
                  >
                    {b.cta} →
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center text-gray-700 shadow transition-colors">‹</button>
          <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center text-gray-700 shadow transition-colors">›</button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {banners.map((_, i) => (
              <button key={i} onClick={() => setBannerIdx(i)} className={`rounded-full transition-all ${i === bannerIdx ? "bg-white w-5 h-2" : "bg-white/50 w-2 h-2"}`} />
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-350 mx-auto px-4 py-6 space-y-8">
        {/* Shop by Category */}
        <section className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-lg font-bold font-['Nunito'] text-gray-800 mb-5">Shop by Category</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-13 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/category/${encodeURIComponent(cat.name)}`}
                className="flex flex-col items-center gap-2 group"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-sm"
                  style={{ backgroundColor: cat.bg }}
                >
                  {cat.icon}
                </div>
                <span className="text-[11px] text-gray-600 font-medium text-center leading-tight">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Deals of the Day */}
        <section className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold font-['Nunito'] text-gray-800">Deals of the Day</h2>
              <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-full px-3 py-1">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <CountdownTimer hours={10} minutes={30} seconds={0} />
              </div>
            </div>
            <Link to="/category/Electronics" className="text-sm text-bk-blue font-semibold hover:underline">View All →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-4">
            {deals.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        {/* Promo strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: "📱", title: "Mobiles Under ₹15,000", sub: "Budget smartphones", cat: "Mobiles", color: "from-blue-500 to-blue-700" },
            { icon: "👗", title: "Fashion Up to 70% Off", sub: "Trending styles", cat: "Fashion", color: "from-pink-500 to-purple-600" },
            { icon: "🏠", title: "Home Must-Haves", sub: "Upgrade your space", cat: "Home & Furniture", color: "from-orange-400 to-red-500" },
          ].map((p) => (
            <Link
              key={p.title}
              to={`/category/${encodeURIComponent(p.cat)}`}
              className={`bg-linear-to-r ${p.color} rounded-xl p-5 flex items-center gap-4 text-white hover:shadow-lg transition-shadow`}
            >
              <span className="text-4xl">{p.icon}</span>
              <div>
                <p className="font-bold font-['Nunito'] text-base">{p.title}</p>
                <p className="text-sm text-white/80">{p.sub}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Best Sellers */}
        <section className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold font-['Nunito'] text-gray-800">🏆 Best Sellers</h2>
            <Link to="/search?q=best" className="text-sm text-bk-blue font-semibold hover:underline">View All →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-4">
            {bestSellers.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        {/* Trending */}
        <section className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold font-['Nunito'] text-gray-800">🔥 Trending Now</h2>
            <Link to="/search?q=trending" className="text-sm text-bk-blue font-semibold hover:underline">View All →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-4">
            {trending.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        {/* New Arrivals */}
        <section className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold font-['Nunito'] text-gray-800">✨ New Arrivals</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-4">
            {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <section className="bg-white rounded-xl shadow-sm p-5">
            <h2 className="text-lg font-bold font-['Nunito'] text-gray-800 mb-5">Recently Viewed</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-4">
              {recentlyViewed.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {/* Bottom banner */}
        <section className="bg-linear-to-r from-bk-yellow to-[#ff8c00] rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black font-['Nunito'] text-gray-900">Download BuyKart App</h3>
            <p className="text-gray-700 text-sm">Get exclusive app-only deals and track orders easily</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors">
              🍎 App Store
            </button>
            <button className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors">
              🤖 Google Play
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function CountdownTimer({ hours, minutes, seconds }: { hours: number; minutes: number; seconds: number }) {
  const [time, setTime] = useState(hours * 3600 + minutes * 60 + seconds);
  useEffect(() => {
    const t = setInterval(() => setTime((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(time / 3600).toString().padStart(2, "0");
  const m = Math.floor((time % 3600) / 60).toString().padStart(2, "0");
  const s = (time % 60).toString().padStart(2, "0");
  return (
    <span className="text-red-600 text-xs font-bold font-mono">
      {h}:{m}:{s} left
    </span>
  );
}
