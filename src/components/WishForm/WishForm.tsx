import { useState } from 'react';
import type { Wish } from '../../types/wish';

interface WishFormProps {
  initialData?: Wish;
  onSubmit: (data: Omit<Wish, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

type FormState = {
  title: string;
  description: string;
  price: string;
  imageUrl: string;
};

export const WishForm = ({ initialData, onSubmit, onClose }: WishFormProps) => {
  const [formData, setFormData] = useState<FormState>({
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    price: initialData?.price != null ? String(initialData.price) : '',
    imageUrl: initialData?.imageUrl ?? '',
  });

  const [errors, setErrors] = useState<{ price?: string }>({});

  const inputClass =
    "w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition";

  const isValidPriceInput = (value: string) => /^\d*\.?\d*$/.test(value);

  const validatePriceOnSubmit = (value: string): string => {
    if (value.trim() === '') return 'Please write a price';

    if (!isValidPriceInput(value)) return 'You can only enter numbers';

    const num = Number(value);

    if (Number.isNaN(num) || !Number.isFinite(num)) return 'You can only enter numbers';
    if (num < 0) return 'Price cannot be negative';

    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const priceError = validatePriceOnSubmit(formData.price);
    if (priceError) {
      setErrors({ price: priceError });
      return;
    }

    setErrors({});

    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
      imageUrl: formData.imageUrl.trim(),
      price: Number(formData.price),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          required
          className={inputClass}
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          required
          className={inputClass}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
        <input
          type="text"
          inputMode="decimal"
          required
          placeholder="Example: 199"
          className={`${inputClass} ${errors.price ? 'border-red-500 focus:ring-red-500' : ''}`}
          value={formData.price}
          onChange={(e) => {
            const value = e.target.value;

            if (!isValidPriceInput(value)) {
              setErrors({ price: 'you can only enter numbers' });
              return;
            }

            setFormData({ ...formData, price: value });
            if (errors.price) setErrors({});
          }}
          onBlur={() => {
            const msg = validatePriceOnSubmit(formData.price);
            setErrors(msg ? { price: msg } : {});
          }}
        />

        {errors.price && (
          <p className="mt-1 text-sm text-red-600">{errors.price}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
        <input
          type="url"
          required
          className={inputClass}
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
        />
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition"
        >
          {initialData ? 'Update' : 'Add'} Wish
        </button>
      </div>
    </form>
  );
};
