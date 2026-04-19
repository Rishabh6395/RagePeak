"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Product = { id: string; name: string; slug: string; category: string; price: number };
type Brand = { id: string; name: string; slug: string };
type Results = { products: Product[]; brands: Brand[] };

const RECENT_KEY = "rp_recent_searches";
const MAX_RECENT = 5;

function highlight(text: string, query: string) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-white/20 text-white rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Results>({ products: [], brands: [] });
  const [recent, setRecent] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_KEY);
    if (stored) setRecent(JSON.parse(stored));
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const saveRecent = useCallback((term: string) => {
    setRecent((prev) => {
      const next = [term, ...prev.filter((r) => r !== term)].slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    setOpen(true);
    clearTimeout(timerRef.current);
    if (!value.trim()) {
      setResults({ products: [], brands: [] });
      return;
    }
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
      const data = await res.json();
      setResults(data);
      setLoading(false);
    }, 300); // 300ms debounce
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    saveRecent(query.trim());
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleSelect = (term: string) => {
    saveRecent(term);
    setOpen(false);
    setQuery("");
  };

  const clearRecent = () => {
    setRecent([]);
    localStorage.removeItem(RECENT_KEY);
  };

  const hasResults = results.products.length > 0 || results.brands.length > 0;
  const showDropdown = open && (hasResults || (!query && recent.length > 0) || loading);

  return (
    <div ref={ref} className="relative">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search products, brands..."
            className="h-9 w-60 text-sm text-white bg-zinc-800 rounded-2xl pl-9 pr-4 outline-none focus:ring-1 focus:ring-zinc-500 placeholder:text-zinc-500"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setOpen(true)}
          />
        </div>
      </form>

      {showDropdown && (
        <div className="absolute top-11 right-0 w-80 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden z-50">
          {loading && (
            <p className="text-xs text-zinc-400 px-4 py-3">Searching...</p>
          )}

          {/* Recent searches — shown when input is empty */}
          {!query && recent.length > 0 && (
            <div>
              <div className="flex items-center justify-between px-4 pt-3 pb-1">
                <span className="text-xs text-zinc-500 uppercase tracking-wider">Recent</span>
                <button onClick={clearRecent} className="text-xs text-zinc-500 hover:text-white">Clear</button>
              </div>
              {recent.map((term) => (
                <button
                  key={term}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 text-left"
                  onClick={() => { setQuery(term); handleChange(term); }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 text-zinc-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  {term}
                </button>
              ))}
            </div>
          )}

          {/* Brands */}
          {results.brands.length > 0 && (
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider px-4 pt-3 pb-1">Brands</p>
              {results.brands.map((b) => (
                <Link
                  key={b.id}
                  href={`/brands/${b.slug}`}
                  onClick={() => handleSelect(b.name)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  {highlight(b.name, query)}
                </Link>
              ))}
            </div>
          )}

          {/* Products grouped by category */}
          {results.products.length > 0 && (
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider px-4 pt-3 pb-1">Products</p>
              {results.products.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  onClick={() => handleSelect(p.name)}
                  className="flex items-center justify-between px-4 py-2 hover:bg-zinc-800 group"
                >
                  <div>
                    <p className="text-sm text-white">{highlight(p.name, query)}</p>
                    <p className="text-xs text-zinc-500">{p.category}</p>
                  </div>
                  <span className="text-xs text-zinc-400 group-hover:text-white">₹{p.price}</span>
                </Link>
              ))}
            </div>
          )}

          {/* No results */}
          {query && !loading && !hasResults && (
            <p className="text-sm text-zinc-500 px-4 py-4 text-center">No results for "{query}"</p>
          )}

          {/* View all */}
          {hasResults && (
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              onClick={() => { saveRecent(query); setOpen(false); }}
              className="block text-center text-xs text-zinc-400 hover:text-white py-3 border-t border-zinc-800"
            >
              View all results →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
