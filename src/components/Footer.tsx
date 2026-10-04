import { Link } from "react-router-dom";

export default function Footer() {
  const sections = [
    {
      title: "ABOUT",
      links: ["About Us", "Careers", "Press", "BuyKart Stories", "Corporate Information"],
    },
    {
      title: "HELP",
      links: ["Payments", "Shipping", "Cancellation & Returns", "FAQ", "Report Infringement"],
    },
    {
      title: "CONSUMER POLICY",
      links: ["Return Policy", "Terms of Use", "Security", "Privacy", "Sitemap", "EPR Compliance"],
    },
    {
      title: "SOCIAL",
      links: ["Facebook", "Twitter", "YouTube", "Instagram"],
    },
  ];

  return (
    <footer className="bg-[#172337] text-gray-300 mt-8">
      <div className="max-w-350 mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-gray-700">
          {sections.map((s) => (
            <div key={s.title}>
              <h4 className="text-[11px] font-bold text-gray-400 tracking-widest mb-4">{s.title}</h4>
              <ul className="space-y-2">
                {s.links.map((l) => (
                  <li key={l}>
                    <span className="text-xs text-gray-400 hover:text-white cursor-pointer transition-colors">{l}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          <div className="flex items-center gap-2">
            <div className="bg-bk-yellow rounded-lg w-8 h-8 flex items-center justify-center">
              <span className="text-bk-blue font-black text-sm font-['Nunito']">BK</span>
            </div>
            <div>
              <span className="text-white font-black font-['Nunito'] text-lg">Buy</span>
              <span className="text-bk-yellow font-black font-['Nunito'] text-lg">Kart</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
            <span>© 2024 BuyKart Private Limited</span>
            <span>·</span>
            <span>CIN: U51109MH2012PTC234591</span>
            <span>·</span>
            <span>Made with ❤️ in India</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <span>🔒</span>
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center gap-1">
              <span>✈️</span>
              <span>Fast Delivery</span>
            </div>
            <div className="flex items-center gap-1">
              <span>↩️</span>
              <span>Easy Returns</span>
            </div>
          </div>
        </div>

        {/* Payment icons row */}
        <div className="flex flex-wrap justify-center gap-3 mt-6 text-[10px] text-gray-600">
          {["VISA", "Mastercard", "UPI", "Net Banking", "PayTM", "Amazon Pay", "Cash on Delivery"].map((m) => (
            <span key={m} className="bg-gray-800 px-3 py-1 rounded border border-gray-700">{m}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}
