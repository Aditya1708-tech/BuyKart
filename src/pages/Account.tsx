import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Account() {
  const { state, dispatch, showToast } = useApp();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: state.user?.name ?? "", email: state.user?.email ?? "", phone: state.user?.phone ?? "" });

  if (!state.user) {
    return (
      <div className="min-h-screen bg-bk-bg flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center max-w-sm mx-4">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-xl font-black font-['Nunito'] text-gray-800 mb-3">Please Login</h2>
          <p className="text-gray-400 mb-6 text-sm">Login to view your account details</p>
          <Link to="/" className="bg-bk-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-bk-blue-dark transition-colors inline-block">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: "profile", icon: "👤", label: "Profile Information" },
    { id: "orders", icon: "📦", label: "My Orders", path: "/orders" },
    { id: "wishlist", icon: "💝", label: "Wishlist", path: "/wishlist" },
    { id: "addresses", icon: "📍", label: "Saved Addresses" },
    { id: "payments", icon: "💳", label: "Payment Methods" },
    { id: "notifications", icon: "🔔", label: "Notifications" },
  ];

  const handleNav = (item: typeof menuItems[0]) => {
    if (item.path) navigate(item.path);
    else setActiveSection(item.id);
  };

  const saveProfile = () => {
    dispatch({ type: "SET_USER", user: { ...state.user!, ...profileForm } });
    showToast("Profile updated successfully!");
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-bk-bg">
      <div className="max-w-[1100px] mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-bk-blue p-5 text-white flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-bk-yellow flex items-center justify-center text-bk-blue font-black text-lg">
                  {state.user.name[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-bold">{state.user.name}</p>
                  <p className="text-xs text-blue-200 truncate max-w-[140px]">{state.user.email}</p>
                </div>
              </div>
              <nav className="divide-y divide-gray-50">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left ${activeSection === item.id ? "bg-blue-50 text-bk-blue" : "text-gray-700 hover:bg-gray-50"}`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                    {item.id === "orders" && state.orders.length > 0 && (
                      <span className="ml-auto bg-bk-blue text-white text-[10px] rounded-full px-2 py-0.5">{state.orders.length}</span>
                    )}
                  </button>
                ))}
                <button
                  onClick={() => { dispatch({ type: "SET_USER", user: null }); showToast("Logged out successfully", "info"); navigate("/"); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  <span>🚪</span>
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="md:col-span-3">
            {activeSection === "profile" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold font-['Nunito'] text-gray-800">Personal Information</h2>
                  {!editing && (
                    <button onClick={() => setEditing(true)} className="text-sm text-bk-blue font-semibold hover:underline">
                      Edit
                    </button>
                  )}
                </div>
                {editing ? (
                  <div className="space-y-4">
                    {[
                      { label: "Full Name", key: "name" },
                      { label: "Email Address", key: "email" },
                      { label: "Mobile Number", key: "phone" },
                    ].map(({ label, key }) => (
                      <div key={key}>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
                        <input
                          value={profileForm[key as keyof typeof profileForm]}
                          onChange={(e) => setProfileForm({ ...profileForm, [key]: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-bk-blue"
                        />
                      </div>
                    ))}
                    <div className="flex gap-3 pt-2">
                      <button onClick={saveProfile} className="bg-bk-blue text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-bk-blue-dark transition-colors">Save</button>
                      <button onClick={() => setEditing(false)} className="border border-gray-200 px-6 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Full Name", value: state.user.name },
                      { label: "Email Address", value: state.user.email },
                      { label: "Mobile Number", value: state.user.phone || "Not set" },
                      { label: "Member Since", value: "2024" },
                    ].map(({ label, value }) => (
                      <div key={label} className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{label}</p>
                        <p className="text-sm font-medium text-gray-800 mt-1">{value}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {[
                    { label: "Orders", value: state.orders.length, icon: "📦", path: "/orders" },
                    { label: "Wishlist", value: state.wishlist.length, icon: "💝", path: "/wishlist" },
                    { label: "Cart Items", value: state.cart.reduce((s, i) => s + i.quantity, 0), icon: "🛒", path: "/cart" },
                  ].map(({ label, value, icon, path }) => (
                    <Link key={label} to={path} className="p-4 bg-blue-50 rounded-xl text-center hover:bg-blue-100 transition-colors">
                      <p className="text-2xl">{icon}</p>
                      <p className="text-xl font-black text-bk-blue mt-1">{value}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "addresses" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold font-['Nunito'] text-gray-800 mb-4">Saved Addresses</h2>
                <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-xl">
                  <p className="text-3xl mb-2">📍</p>
                  <p className="text-gray-500">No saved addresses yet</p>
                  <p className="text-sm text-gray-400 mt-1">Addresses will be saved during checkout</p>
                </div>
              </div>
            )}

            {activeSection === "payments" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold font-['Nunito'] text-gray-800 mb-4">Payment Methods</h2>
                <div className="space-y-3">
                  {[
                    { icon: "📱", label: "UPI", desc: "Linked to your account", badge: "Default" },
                    { icon: "💳", label: "HDFC Credit Card", desc: "****  ****  ****  4242", badge: "" },
                  ].map((p) => (
                    <div key={p.label} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
                      <span className="text-2xl">{p.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">{p.label}</p>
                        <p className="text-xs text-gray-400">{p.desc}</p>
                      </div>
                      {p.badge && <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">{p.badge}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "notifications" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold font-['Nunito'] text-gray-800 mb-4">Notification Preferences</h2>
                <div className="space-y-3">
                  {["Order Updates", "Offers & Promotions", "Price Drop Alerts", "New Arrivals"].map((n) => (
                    <div key={n} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                      <span className="text-sm font-medium text-gray-700">{n}</span>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bk-blue" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
