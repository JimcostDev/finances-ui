function AddEntryButton({ section, onClick }) {
  const isIngreso = section === "ingresos";
  const base =
    "flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors";
  const colors = isIngreso
    ? "bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
    : "bg-red-50   text-red-700   hover:bg-red-100   hover:text-red-800";

  return (
    <button type="button" onClick={onClick} className={`${base} ${colors}`}>
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
      Agregar {isIngreso ? "ingreso" : "gasto"}
    </button>
  );
}

export default AddEntryButton;
