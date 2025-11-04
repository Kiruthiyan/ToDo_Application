export default function Button({ children, type = "button" }) {
  return (
    <button
      type={type}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
    >
      {children}
    </button>
  );
}
