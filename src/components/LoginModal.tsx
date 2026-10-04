import { useState } from "react";
import { useApp } from "../context/AppContext";

interface Props {
  onClose: () => void;
}

export default function LoginModal({ onClose }: Props) {
  const { dispatch, showToast } = useApp();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (mode === "signup" && !form.name.trim()) e.name = "Name is required";
    if (!form.email.includes("@") && form.phone.length < 10) e.contact = "Enter valid email or phone";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch({
      type: "SET_USER",
      user: { name: form.name || "User", email: form.email || `${form.phone}@buykart.com`, phone: form.phone },
    });
    showToast(mode === "login" ? "Welcome back! Logged in successfully." : "Account created successfully!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Blue header */}
        <div className="bg-bk-blue px-8 py-10 text-white">
          <h2 className="text-2xl font-bold font-['Nunito']">
            {mode === "login" ? "Login" : "Create Account"}
          </h2>
          <p className="text-blue-200 text-sm mt-1">
            {mode === "login" ? "Get access to your Orders, Wishlist and Recommendations" : "Sign up to enjoy exclusive deals and offers"}
          </p>
        </div>

        <form onSubmit={handle} className="px-8 py-6 space-y-4">
          {mode === "signup" && (
            <div>
              <input
                className="w-full border-b-2 border-gray-200 focus:border-bk-blue outline-none py-2 text-sm transition-colors"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
          )}
          <div>
            <input
              className="w-full border-b-2 border-gray-200 focus:border-bk-blue outline-none py-2 text-sm transition-colors"
              placeholder="Email or Mobile Number"
              value={form.email || form.phone}
              onChange={(e) => {
                const v = e.target.value;
                if (/^\d+$/.test(v)) setForm({ ...form, phone: v, email: "" });
                else setForm({ ...form, email: v, phone: "" });
              }}
            />
            {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
          </div>
          <div>
            <input
              type="password"
              className="w-full border-b-2 border-gray-200 focus:border-bk-blue outline-none py-2 text-sm transition-colors"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <p className="text-xs text-gray-500">
            By continuing, you agree to BuyKart's{" "}
            <span className="text-bk-blue cursor-pointer">Terms of Use</span> and{" "}
            <span className="text-bk-blue cursor-pointer">Privacy Policy</span>.
          </p>

          <button
            type="submit"
            className="w-full bg-bk-yellow hover:bg-bk-yellow-dark text-gray-900 font-bold py-3 rounded-lg transition-colors font-['Nunito'] text-base"
          >
            {mode === "login" ? "Login" : "Create Account"}
          </button>

          {mode === "login" && (
            <p className="text-center text-xs text-bk-blue cursor-pointer hover:underline">
              Forgot Password?
            </p>
          )}

          <div className="border-t pt-4 text-center">
            <p className="text-sm text-gray-600">
              {mode === "login" ? "New to BuyKart? " : "Already have an account? "}
              <span
                className="text-bk-blue font-semibold cursor-pointer hover:underline"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
              >
                {mode === "login" ? "Create an account" : "Login"}
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
