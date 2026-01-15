import { useEffect, useMemo, useRef, useState } from "react";
import { useWishes } from "../../context/WishesContext";
import { ArticleCard } from "../../components/ArticleCard/ArticleCard";
import { Modal } from "../../components/Modal/Modal";
import { WishForm } from "../../components/WishForm/WishForm";
import { Snackbar } from "../../components/Snackbar/Snackbar";

export const HomePage = () => {
  const { wishes, loading, notification, getWishes, addWish } = useWishes();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [sortBy, setSortBy] = useState<"createdAt" | "price">("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [priceOrder, setPriceOrder] = useState<"asc" | "desc">("desc");

  const ITEMS_PER_PAGE = 4;

  const [pagesLoaded, setPagesLoaded] = useState(1);

  const [hasMore, setHasMore] = useState(true);

  const requestIdRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const myRequestId = ++requestIdRef.current;

    (async () => {
      const firstCount = await getWishes({
        sort: sortBy,
        order,
        page: 1,
        limit: ITEMS_PER_PAGE,
        append: false,
      });

      if (cancelled || requestIdRef.current !== myRequestId) return;

      for (let p = 2; p <= pagesLoaded; p += 1) {
        const count = await getWishes({
          sort: sortBy,
          order,
          page: p,
          limit: ITEMS_PER_PAGE,
          append: true,
        });

        if (cancelled || requestIdRef.current !== myRequestId) return;

        if (count < ITEMS_PER_PAGE) break;
      }
      if (firstCount < ITEMS_PER_PAGE) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sortBy, order, pagesLoaded, getWishes]);

  const handleLoadMore = () => {
    if (loading || !hasMore) return;
    setPagesLoaded((p) => p + 1);
  };

  const visibleWishes = useMemo(() => {
    const map = new Map<string, (typeof wishes)[number]>();
    wishes.forEach((w) => map.set(w.id, w));
    return Array.from(map.values());
  }, [wishes]);

  useEffect(() => {
    const expectedMax = pagesLoaded * ITEMS_PER_PAGE;
    if (visibleWishes.length < expectedMax) {
      setHasMore(false);
    }
  }, [visibleWishes.length, pagesLoaded]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight m-0">
          My Wishlist
        </h1>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95"
        >
          Add New Wish
        </button>
      </header>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500">
            Sort by Date:
          </span>
          <select
            value={sortBy === "createdAt" ? order : ""}
            className="bg-gray-50 border-none rounded-lg text-sm p-2 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            onChange={(e) => {
              setSortBy("createdAt");
              setOrder(e.target.value as "asc" | "desc");
            }}
          >
            <option value="desc">Newest</option>
            <option value="asc">Oldest</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500">Price:</span>
          <select
            value={priceOrder}
            className="bg-gray-50 border-none rounded-lg text-sm p-2 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            onChange={(e) => {
              const value = e.target.value as "asc" | "desc";
              setPriceOrder(value);
              setSortBy("price");
              setOrder(value);
            }}
          >
            <option value="desc">High to Low</option>
            <option value="asc">Low to High</option>
          </select>
        </div>
      </div>

      {loading && wishes.length === 0 ? (
        <div className="flex justify-center py-20">
          <div className="text-gray-400 font-medium animate-pulse uppercase tracking-widest">
            Loading wishes...
          </div>
        </div>
      ) : wishes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <h2 className="text-2xl font-bold text-gray-900">No wishes yet</h2>
          <p className="mt-2 text-gray-500 max-w-md">
            Add your first wish to see it in the list.
          </p>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-8 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95"
          >
            <span className="text-xl leading-none">+</span>
            Add New Wish
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleWishes.map((wish) => (
              <ArticleCard key={wish.id} wish={wish} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-12 flex justify-center min-h-[72px]">
              <button
                onClick={handleLoadMore}
                className="px-10 py-4 bg-white border-2 border-blue-600 text-blue-600 font-bold rounded-2xl hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-md shadow-blue-50"
                disabled={loading}
              >
                {loading ? "Loading…" : "Load More Wishes"}
              </button>
            </div>
          )}
        </>
      )}

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="New Wish"
      >
        <WishForm
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={(data) => {
            addWish(data);
            setIsAddModalOpen(false);
          }}
        />
      </Modal>

      {notification && (
        <Snackbar message={notification.msg} type={notification.type} />
      )}
    </div>
  );
};
