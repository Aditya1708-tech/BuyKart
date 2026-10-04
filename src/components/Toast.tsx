import { useApp } from "../context/AppContext";

export default function ToastContainer() {
  const { state } = useApp();
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {state.toasts.map((toast) => (
        <div
          key={toast.id}
          className={`animate-slide-in flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl text-white text-sm font-medium min-w-[240px] pointer-events-auto ${
            toast.type === "success" ? "bg-green-600" : toast.type === "error" ? "bg-red-600" : "bg-blue-600"
          }`}
        >
          <span className="text-lg">
            {toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "ℹ"}
          </span>
          {toast.message}
        </div>
      ))}
    </div>
  );
}
