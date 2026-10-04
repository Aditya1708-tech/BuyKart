import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductsByCategory, products as allProducts } from "../data/products";
import ProductCard from "../components/ProductCard";
import type { Product } from "../types";

type SortKey = "popularity" | "price_asc" | "price_desc" | "rating" | "discount";

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const decoded = decodeURIComponent(category ?? "");

  const base = useMemo(() => {
    const direct = getProductsByCategory(decoded);
    if (direct.length > 0) return direct;
    return allProducts;
  }, [decoded]);

  const brands = useMemo(() => [...new Set(base.map((p) => p.brand))], [base]);
  const maxPrice = useMemo(() => Math.max(...base.map((p) => p.originalPrice)), [base]);

  const [sort, setSort] = useState<SortKey>("popularity");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [minDiscount, setMinDiscount] = useState(0);

  const toggleBrand = (b: string) =>
    setSelectedBrands((prev) => prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]);

  const filtered = useMemo(() => {
    let list = [...base];
    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (selectedBrands.length > 0) list = list.filter((p) => selectedBrands.includes(p.brand));
    if (minRating > 0) list = list.filter((p) => p.rating >= minRating);
    if (minDiscount > 0) list = list.filter((p) => p.discount >= minDiscount);
    switch (sort) {
      case "price_asc": list.sort((a, b) => a.price - b.price); break;
      case "price_desc": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      case "discount": list.sort((a, b) => b.discount - a.discount); break;
    }
    return list;
  }, [base, sort, priceRange, selectedBrands, minRating, minDiscount]);

  return (
    <div className="min-h-screen bg-bk-bg">
      <div className="max-w-350 mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-bk-blue">Home</Link>
          <span>›</span>
          <span className="text-gray-800 font-medium">{decoded}</span>
          <span className="text-gray-400 ml-2">({filtered.length} products)</span>
        </div>

        <div className="flex gap-4">
          {/* Filters sidebar */}
          <aside className="hidden md:block w-56 shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-4 space-y-5 sticky top-20">
              <h3 className="font-bold text-gray-800 border-b pb-2">Filters</h3>

              {/* Sort */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Sort By</p>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-bk-blue"
                >
                  <option value="popularity">Popularity</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Rating</option>
                  <option value="discount">Discount</option>
                </select>
              </div>

              {/* Price */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Price Range</p>
                <div className="flex gap-2 text-xs text-gray-500 mb-2">
                  <span>₹{priceRange[0].toLocaleString()}</span>
                  <span className="ml-auto">₹{priceRange[1].toLocaleString()}</span>
                </div>
                <input
                  type="range" min={0} max={maxPrice} step={500}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                  className="w-full accent-bk-blue"
                />
              </div>

              {/* Rating */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Customer Rating</p>
                {[4, 3, 2].map((r) => (
                  <label key={r} className="flex items-center gap-2 py-1 cursor-pointer">
                    <input type="radio" name="rating" checked={minRating === r} onChange={() => setMinRating(r === minRating ? 0 : r)} className="accent-bk-blue" />
                    <span className="text-sm text-gray-600">{r}★ & above</span>
                  </label>
                ))}
              </div>

              {/* Discount */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Discount</p>
                {[10, 20, 30, 40, 50].map((d) => (
                  <label key={d} className="flex items-center gap-2 py-1 cursor-pointer">
                    <input type="radio" name="discount" checked={minDiscount === d} onChange={() => setMinDiscount(d === minDiscount ? 0 : d)} className="accent-bk-blue" />
                    <span className="text-sm text-gray-600">{d}% or more</span>
                  </label>
                ))}
              </div>

              {/* Brand */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Brand</p>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {brands.map((b) => (
                    <label key={b} className="flex items-center gap-2 py-0.5 cursor-pointer">
                      <input type="checkbox" checked={selectedBrands.includes(b)} onChange={() => toggleBrand(b)} className="accent-bk-blue" />
                      <span className="text-sm text-gray-600">{b}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={() => { setPriceRange([0, maxPrice]); setSelectedBrands([]); setMinRating(0); setMinDiscount(0); setSort("popularity"); }}
                className="w-full py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">
            {/* Mobile sort bar */}
            <div className="md:hidden flex items-center gap-2 mb-4 bg-white rounded-xl p-3 shadow-sm">
              <span className="text-sm text-gray-600">Sort:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none"
              >
                <option value="popularity">Popularity</option>
                <option value="price_asc">Price ↑</option>
                <option value="price_desc">Price ↓</option>
                <option value="rating">Rating</option>
                <option value="discount">Discount</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="bg-white rounded-xl p-16 text-center">
                <p className="text-5xl mb-4">🔍</p>
                <h3 className="text-xl font-bold text-gray-700 font-['Nunito']">No products found</h3>
                <p className="text-gray-400 mt-2">Try adjusting your filters</p>
                <button
                  onClick={() => { setPriceRange([0, maxPrice]); setSelectedBrands([]); setMinRating(0); setMinDiscount(0); }}
                  className="mt-4 bg-bk-blue text-white px-6 py-2 rounded-lg text-sm hover:bg-bk-blue-dark transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
