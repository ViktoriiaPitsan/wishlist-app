import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useWishes } from "../../context/WishesContext";
import { Modal } from "../../components/Modal/Modal";
import { WishForm } from "../../components/WishForm/WishForm";

export const WishPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { wishes, deleteWish, updateWish, loading } = useWishes();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const wish = wishes.find((w) => w.id === id);
  useEffect(() => {
    if (wish) {
      document.title = `${wish.title} | My Wishlist`;
    }

    return () => {
      document.title = "My Wishlist";
    };
  }, [wish]);

  if (loading && !wish)
    return <div className="p-10 text-center text-gray-500">Loading...</div>;
  if (!wish)
    return (
      <div className="p-10 text-center">
        Wish not found!{" "}
        <Link to="/" className="text-blue-500 underline">
          Go back
        </Link>
      </div>
    );

  const confirmDelete = async () => {
    await deleteWish(wish.id);
    setIsDeleteModalOpen(false);
    navigate("/"); 
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link
        to="/"
        className="inline-flex items-center text-blue-600 mb-8 font-medium hover:translate-x-[-4px] transition-transform"
      >
        Back to dashboard
      </Link>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        <div className="md:w-1/2 h-[400px] lg:h-[500px]">
          <img
            src={wish.imageUrl}
            alt={wish.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="md:w-1/2 p-10 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-4">
              {wish.title}
            </h1>
            <p className="text-3xl font-bold text-blue-600 mb-6">
              Price: ${wish.price}
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              {wish.description}
            </p>
          </div>

          <div className="flex gap-4 mt-10">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex-1 py-3 bg-gray-100 rounded-xl font-bold hover:bg-gray-200 transition active:scale-95"
            >
              Update
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition active:scale-95"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Wish"
      >
        <WishForm
          initialData={wish}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={(data) => {
            updateWish(wish.id, data);
            setIsEditModalOpen(false);
          }}
        />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Are you sure?"
      >
        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            Do you really want to delete{" "}
            <span className="font-semibold text-gray-800">"{wish.title}"</span>?
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 py-3 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
