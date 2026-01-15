import { useState } from "react";
import { Link } from "react-router-dom";
import type { Wish } from "../../types/wish";
import { Modal } from "../Modal/Modal";
import { WishForm } from "../WishForm/WishForm";
import { useWishes } from "../../context/WishesContext";

export const ArticleCard = ({ wish }: { wish: Wish }) => {
  const { deleteWish, updateWish } = useWishes();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="relative h-48 shrink-0">
        <img
          src={wish.imageUrl}
          alt={wish.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-5 flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">
          {wish.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
          {wish.description}
        </p>
        <p className="text-sm font-semibold text-gray-800">
          Price: <span className="text-blue-600">${wish.price}</span>
        </p>
      </div>

      <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex flex-col gap-2">
        <div className="flex gap-2">
          <button
            onClick={() => setIsUpdateModalOpen(true)}
            className="flex-1 py-2 text-xs font-bold uppercase tracking-wider bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Update
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex-1 py-2 text-xs font-bold uppercase tracking-wider text-red-600 bg-white border border-red-100 rounded-lg hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        </div>

        <Link
          to={`/wish/${wish.id}`}
          className="w-full py-2 text-center text-xs font-bold uppercase tracking-wider bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-[0.98]"
        >
          Details
        </Link>
      </div>

      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title="Edit Wish"
      >
        <WishForm
          initialData={wish}
          onClose={() => setIsUpdateModalOpen(false)}
          onSubmit={(data) => {
            updateWish(wish.id, data);
            setIsUpdateModalOpen(false);
          }}
        />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Are you sure?"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Do you really want to delete{" "}
            <span className="font-semibold text-gray-800">"{wish.title}"</span>?
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 py-2 rounded-xl border border-gray-200 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => deleteWish(wish.id)}
              className="flex-1 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
