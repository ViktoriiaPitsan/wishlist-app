export const Snackbar = ({ message, type }: { message: string, type: 'success' | 'error' }) => {
  return (
    <div className={`fixed bottom-5 right-5 px-6 py-3 rounded-lg shadow-2xl text-white animate-bounce ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`}>
      {message}
    </div>
  );
};