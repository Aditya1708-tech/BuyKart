import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { searchProducts } from "../data/products";
import ProductCard from "../components/ProductCard";

type SortKey = "popularity" | "price_asc" | "price_desc" | "rating" | "discount";

export default function SearchResults() {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const [sort, setSort] = useState<SortKey>("popularity");

  const results = useMemo(() => {
    const list = searchProducts(q);
    switch (sort) {
      case "price_asc": return [...list].sort((a, b) => a.price - b.price);
      case "price_desc": return [...list].sort((a, b) => b.price - a.price);
      case "rating": return [...list].sort((a, b) => b.rating - a.rating);
      case "discount": return [...list].sort((a, b) => b.discount - a.discount);
      default: return list;
    }
  }, [q, sort]);

  return (
    <div className="min-h-screen bg-bk-bg">
      <div className="max-w-350 mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-bk-blue">Home</Link>
          <span>›</span>
          <span className="text-gray-800 font-medium">Search: "{q}"</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-600 text-sm">
            {results.length > 0 ? (
              <><span className="font-semibold text-gray-800">{results.length}</span> results for "<span className="font-semibold">{q}</span>"</>
            ) : (
              <>No results found for "<span className="font-semibold">{q}</span>"</>
            )}
          </p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-bk-blue bg-white"
          >
            <option value="popularity">Sort: Popularity</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Rating</option>
            <option value="discount">Discount</option>
          </select>
        </div>

        {results.length === 0 ? (
          <div className="bg-white rounded-xl p-20 text-center">
            <p className="text-6xl mb-4">🔍</p>
            <h2 className="text-2xl font-bold text-gray-700 font-['Nunito'] mb-2">No products found</h2>
            <p className="text-gray-400 mb-6">We couldn't find anything matching "{q}"</p>
            <p className="text-sm text-gray-500 mb-2">Suggestions:</p>
            <ul className="text-sm text-gray-500 list-disc list-inside text-left inline-block">
              <li>Check your spelling</li>
              <li>Try more general keywords</li>
              <li>Try searching for categories like "mobiles", "fashion", "electronics"</li>
            </ul>
            <div className="mt-6">
              <Link to="/" className="bg-bk-blue text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-bk-blue-dark transition-colors inline-block">
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {results.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
