
import { Link } from "react-router-dom";
import {
  CarFront,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Gavel,
  ChevronRight,
} from "lucide-react";

const quickLinks = [
  { label: "Home", path: "/" },
  { label: "Browse Vehicles", path: "/vehicles" },
  { label: "Live Auctions", path: "/auctions" },
  { label: "About Us", path: "/about" },
];

const vehicleCategories = [
  { label: "Cars", category: "Car" },
  { label: "SUVs", category: "SUV" },
  { label: "Luxury Vehicles", category: "Luxury" },
  { label: "Hybrid Vehicles", category: "Hybrid" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#101827] text-slate-300">
      {/* TOP FOOTER */}
      <div className="mx-auto max-w-7xl px-5 pb-12 pt-16 md:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* BRAND SECTION */}
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-white">
                <CarFront size={26} strokeWidth={2.3} />
              </div>

              <div className="flex flex-col leading-tight">
                <span className="text-lg font-black italic tracking-tight text-white">
                  VEHICLE
                  <span className="text-red-500">AUCTION</span>
                </span>

                <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400">
                  Bidding Platform
                </span>
              </div>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-slate-400">
              A modern vehicle auction platform designed to
              connect buyers and sellers through a simple,
              transparent and efficient bidding experience.
            </p>

            {/* PLATFORM FEATURES */}
            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck size={16} className="text-red-500" />
                Vehicle Verification Workflow
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Gavel size={16} className="text-red-500" />
                Online Auction Management
              </div>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-base font-bold text-white">
              Quick Links
            </h3>

            <div className="mt-3 h-1 w-10 rounded bg-red-600" />

            <ul className="mt-6 space-y-4">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="group flex items-center gap-2 text-sm text-slate-400 transition hover:text-red-400"
                  >
                    <ChevronRight
                      size={15}
                      className="text-red-500 transition group-hover:translate-x-1"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* VEHICLE CATEGORIES */}
          <div>
            <h3 className="text-base font-bold text-white">
              Vehicle Categories
            </h3>

            <div className="mt-3 h-1 w-10 rounded bg-red-600" />

            <ul className="mt-6 space-y-4">
              {vehicleCategories.map((item) => (
                <li key={item.category}>
                  <Link
                    to={`/vehicles?category=${encodeURIComponent(
                      item.category
                    )}`}
                    className="group flex items-center gap-2 text-sm text-slate-400 transition hover:text-red-400"
                  >
                    <ChevronRight
                      size={15}
                      className="text-red-500 transition group-hover:translate-x-1"
                    />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT & SUPPORT */}
          <div>
            <h3 className="text-base font-bold text-white">
              Contact & Support
            </h3>

            <div className="mt-3 h-1 w-10 rounded bg-red-600" />

            <div className="mt-6 space-y-5">
              <div className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-red-500"
                />
                <div>
                  <p className="text-sm font-semibold text-white">
                    Project Location
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Sri Lanka
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail
                  size={18}
                  className="mt-0.5 shrink-0 text-red-500"
                />
                <div>
                  <p className="text-sm font-semibold text-white">
                    Support
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Contact details coming soon
                  </p>
                </div>
              </div>
            </div>

            {/* SOCIAL MEDIA PLACEHOLDERS */}
            <div className="mt-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Social Media
              </p>

              <div className="flex gap-3">
                {[
                  { name: "Facebook", icon: Facebook },
                  { name: "Instagram", icon: Instagram },
                  { name: "LinkedIn", icon: Linkedin },
                ].map(({ name, icon: Icon }) => (
                  <span
                    key={name}
                    title={`${name} link coming soon`}
                    aria-label={`${name} link coming soon`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400"
                  >
                    <Icon size={17} />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM FOOTER */}
      <div className="border-t border-white/10 bg-[#0b1220]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 text-center md:flex-row md:px-8 md:text-left">
          <p className="text-xs text-slate-400">
            © {currentYear} VehicleAuction. All rights reserved.
          </p>

          <p className="text-xs text-slate-500">
            Advanced Database Management System — University Project
          </p>

          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 transition hover:text-red-400"
          >
            Back to Home
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
