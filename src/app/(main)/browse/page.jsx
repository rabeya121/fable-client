"use client";
import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import EbookCard from "@/components/ebook/EbookCard";
import {
  RiSearchLine,
  RiFilterLine,
  RiBookOpenLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiCloseLine,
} from "react-icons/ri";

const genres = [
  "All",
  "Fiction",
  "Mystery",
  "Romance",
  "Fantasy",
  "Horror",
  "Thriller",
  "Sci-Fi",
  "Biography",
  "Self-Help",
];

const sortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Most Popular", value: "popular" },
];

const ITEMS_PER_PAGE = 9;

function BrowsePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [ebooks, setEbooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [activeGenre, setActiveGenre] = useState(
    searchParams.get("genre") || "All",
  );
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const updateURL = useCallback(
    (newParams) => {
      const params = new URLSearchParams();
      if (newParams.search) params.set("search", newParams.search);
      if (newParams.genre && newParams.genre !== "All")
        params.set("genre", newParams.genre);
      if (newParams.sort && newParams.sort !== "newest")
        params.set("sort", newParams.sort);
      if (newParams.page && newParams.page !== 1)
        params.set("page", newParams.page);
      router.replace(`/browse?${params.toString()}`, { scroll: false });
    },
    [router],
  );

  useEffect(() => {
    const fetchEbooks = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (activeGenre !== "All") params.set("genre", activeGenre);
        params.set("sort", sort);
        params.set("page", page);
        params.set("limit", ITEMS_PER_PAGE);

        const res = await fetch(
          `http://localhost:8000/api/ebooks?${params.toString()}`,
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          setEbooks(data);
          setTotal(data.length);
        } else {
          setEbooks(data.ebooks || []);
          setTotal(data.total || 0);
        }
      } catch (error) {
        console.error("Failed to fetch ebooks:", error);
        setEbooks([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchEbooks();
    updateURL({ search, genre: activeGenre, sort, page });
  }, [search, activeGenre, sort, page]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };
  const handleGenre = (genre) => {
    setActiveGenre(genre);
    setPage(1);
  };
  const handleSort = (e) => {
    setSort(e.target.value);
    setPage(1);
  };
  const clearSearch = () => {
    setSearch("");
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-[#0f172a] pt-8 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">Browse Ebooks</h1>
          <p className="text-gray-400">
            Explore our full collection — filter by genre, search by title, or
            sort to find your next read.
          </p>
        </div>

        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search by title or author…"
              className="w-full bg-[#1e293b] border border-white/5 text-white placeholder-gray-500 rounded-xl pl-11 pr-10 py-3 text-sm focus:outline-none focus:border-[#6366f1]/50 transition-colors"
            />
            {search && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                <RiCloseLine className="text-lg" />
              </button>
            )}
          </div>
          <div className="relative">
            <RiFilterLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
            <select
              value={sort}
              onChange={handleSort}
              className="bg-[#1e293b] border border-white/5 text-gray-300 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-[#6366f1]/50 transition-colors appearance-none cursor-pointer min-w-[180px]"
            >
              {sortOptions.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  className="bg-[#1e293b]"
                >
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Genre Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => handleGenre(genre)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeGenre === genre
                  ? "bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/20"
                  : "bg-[#1e293b] text-gray-400 border border-white/5 hover:border-[#6366f1]/40 hover:text-white"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Results Count */}
        {!loading && (
          <p className="text-gray-500 text-sm mb-6">
            {total === 0
              ? "No ebooks found"
              : `Showing ${(page - 1) * ITEMS_PER_PAGE + 1}–${Math.min(page * ITEMS_PER_PAGE, total)} of ${total} ebook${total !== 1 ? "s" : ""}`}
            {activeGenre !== "All" && (
              <span className="text-[#6366f1]"> in {activeGenre}</span>
            )}
            {search && <span className="text-[#6366f1]"> for "{search}"</span>}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
              <div
                key={i}
                className="bg-[#1e293b] rounded-xl overflow-hidden animate-pulse"
              >
                <div className="h-56 bg-[#0f172a]" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-[#0f172a] rounded w-3/4" />
                  <div className="h-3 bg-[#0f172a] rounded w-1/2" />
                  <div className="h-9 bg-[#0f172a] rounded-lg mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : ebooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-20 h-20 rounded-2xl bg-[#1e293b] flex items-center justify-center mb-5">
              <RiBookOpenLine className="text-4xl text-[#6366f1]/40" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">
              No ebooks found
            </h3>
            <p className="text-gray-500 text-sm max-w-xs mb-6">
              Try adjusting your search or filters.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setActiveGenre("All");
                setSort("newest");
                setPage(1);
              }}
              className="bg-[#6366f1] hover:bg-[#4f46e5] text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ebooks.map((ebook) => (
              <EbookCard key={ebook._id} ebook={ebook} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1e293b] border border-white/5 text-gray-400 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#6366f1]/40 hover:text-white transition-all"
            >
              <RiArrowLeftLine /> Prev
            </button>
            <div className="flex gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
                )
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === "..." ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-3 py-2 text-gray-600 text-sm"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setPage(item)}
                      className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                        page === item
                          ? "bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/20"
                          : "bg-[#1e293b] border border-white/5 text-gray-400 hover:border-[#6366f1]/40 hover:text-white"
                      }`}
                    >
                      {item}
                    </button>
                  ),
                )}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1e293b] border border-white/5 text-gray-400 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#6366f1]/40 hover:text-white transition-all"
            >
              Next <RiArrowRightLine />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f172a]" />}>
      <BrowsePageContent />
    </Suspense>
  );
}
