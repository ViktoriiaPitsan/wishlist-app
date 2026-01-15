export interface Wish {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  createdAt: string;
}

export type WishFormData = Omit<Wish, "id" | "createdAt">;

export type SortOrder = "newest" | "oldest" | "priceHigh" | "priceLow";
