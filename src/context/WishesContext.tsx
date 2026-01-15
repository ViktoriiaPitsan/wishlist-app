import { createContext, useContext, useState, type ReactNode, useCallback } from 'react';
import type { Wish } from '../types/wish';
import { useApi } from '../hooks/useApi';

type NotifyType = 'success' | 'error';
type SortBy = 'createdAt' | 'price';
type Order = 'asc' | 'desc';

interface GetWishesParams {
  sort?: SortBy;
  order?: Order;
  page?: number;
  limit?: number;
  append?: boolean;
}

interface WishesContextType {
  wishes: Wish[];
  loading: boolean;
  notification: { msg: string; type: NotifyType } | null;

  getWishes: (params?: GetWishesParams) => Promise<number>;

  addWish: (data: Omit<Wish, 'id' | 'createdAt'>) => Promise<void>;
  updateWish: (id: string, data: Partial<Omit<Wish, 'id' | 'createdAt'>>) => Promise<void>;
  deleteWish: (id: string) => Promise<void>;
}

const WishesContext = createContext<WishesContextType | undefined>(undefined);

export const WishesProvider = ({ children }: { children: ReactNode }) => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [notification, setNotification] = useState<{ msg: string; type: NotifyType } | null>(null);
  const { request, loading } = useApi();

  const showNotify = useCallback((msg: string, type: NotifyType) => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const getWishes = useCallback(
    async (params: GetWishesParams = {}) => {
      const {
        sort = 'createdAt',
        order = 'desc',
        page = 1,
        limit = 4,
        append = false,
      } = params;

      try {
        const data: Wish[] = await request(
          `/wishes?_sort=${sort}&_order=${order}&_page=${page}&_limit=${limit}`,
        );

        setWishes((prev) => {
          if (!append) return data;

          const seen = new Set(prev.map((w) => w.id));
          const next = data.filter((w) => !seen.has(w.id));
          return [...prev, ...next];
        });

        return data.length;
      } catch {
        showNotify('Failed to fetch wishes', 'error');
        return 0;
      }
    },
    [request, showNotify],
  );

  const addWish = async (newWish: Omit<Wish, 'id' | 'createdAt'>) => {
    try {
      const created: Wish = await request('/wishes', {
        method: 'POST',
        body: JSON.stringify({ ...newWish, createdAt: new Date().toISOString() }),
      });

      setWishes((prev) => {
        const isDuplicate = prev.some((w) => w.id === created.id);
        return isDuplicate ? prev : [created, ...prev];
      });

      showNotify('Wish added successfully!', 'success');
    } catch {
      showNotify('Failed to add wish', 'error');
    }
  };

  const updateWish = async (id: string, data: Partial<Omit<Wish, 'id' | 'createdAt'>>) => {
    try {
      const updated: Wish = await request(`/wishes/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });

      setWishes((prev) => prev.map((w) => (w.id === id ? updated : w)));
      showNotify('Wish updated!', 'success');
    } catch {
      showNotify('Update failed', 'error');
    }
  };

  const deleteWish = async (id: string) => {
    try {
      await request(`/wishes/${id}`, { method: 'DELETE' });
      setWishes((prev) => prev.filter((w) => w.id !== id));
      showNotify('Wish deleted', 'success');
    } catch {
      showNotify('Delete failed', 'error');
    }
  };

  return (
    <WishesContext.Provider value={{ wishes, loading, notification, getWishes, addWish, updateWish, deleteWish }}>
      {children}
    </WishesContext.Provider>
  );
};

export const useWishes = () => {
  const context = useContext(WishesContext);
  if (!context) throw new Error('useWishes must be used within WishesProvider');
  return context;
};
