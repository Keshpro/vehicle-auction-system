import { Link } from "react-router-dom";
import {
  CarFront,
  Mail,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Gavel,
  ChevronRight,
  Phone,
  Globe,
  ExternalLink,
  Building2,
  Clock3,
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

const company = {
  name: "Schokman & Samerawickreme",
  established: "1892",
  website: "https://sandslanka.com/",
  email: "info@sandslanka.com",
  cityOffice: {
    address: "6A, Fairfield Gardens, Colombo 08, Sri Lanka",
    phone: "+94 11 267 1467",
    phoneLink: "+94112671467",
  },
  vehicleFacility: {
    address: "41/15, Nagahamulla Road, Pelawatte, Battaramulla, Sri Lanka",
  },
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#101827] text-slate-300">
      {/* MAIN FOOTER */}
      <div className="mx-auto max-w-7xl px-5 pb-14 pt-16 md:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* BRAND SECTION */}
          <div>
            <Link to="/" className="inline-flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/20">
                <CarFront size={30} strokeWidth={2.3} />
              </div>

              <div className="flex flex-col leading-tight">
                <span className="text-[18px] font-black italic tracking-tight text-white sm:text-[20px]">
                  Schokman{" "}
                  <span className="text-red-500">&amp;</span>
                </span>

                <span className="text-[18px] font-black italic tracking-tight text-red-500 sm:text-[20px]">
                  Samerawickreme
                </span>

                <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.28em] text-slate-400">
                  S&amp;S AUCTION PLATFORM
                </span>
              </div>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-slate-400">
              A Sri Lankan auctioneering and valuation company established
              in 1892, providing professional auction services including
              motor vehicle auctions.
            </p>

            {/* COMPANY HIGHLIGHTS */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <ShieldCheck size={17} className="shrink-0 text-red-500" />
                Established in 1892
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <Gavel size={17} className="shrink-0 text-red-500" />
                Professional Auctioneering Services
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <Building2 size={17} className="shrink-0 text-red-500" />
                Auctioneers &amp; Consultant Valuers
              </div>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-base font-bold text-white">Quick Links</h3>

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
                      className="shrink-0 text-red-500 transition group-hover:translate-x-1"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <h4 className="text-sm font-bold text-white">
                Official Website
              </h4>

              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-red-400"
              >
                <Globe size={16} className="text-red-500" />
                sandslanka.com
                <ExternalLink size={12} />
              </a>
            </div>
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
                      className="shrink-0 text-red-500 transition group-hover:translate-x-1"
                    />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2">
                <Gavel size={17} className="text-red-500" />
                <p className="text-sm font-semibold text-white">
                  Vehicle Auctions
                </p>
              </div>

              <p className="mt-3 text-xs leading-6 text-slate-400">
                Explore vehicle auction listings and bidding opportunities
                through our proposed digital platform.
              </p>

              <Link
                to="/auctions"
                className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-red-400 transition hover:text-red-300"
              >
                Explore Auctions
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* CONTACT INFORMATION */}
          <div>
            <h3 className="text-base font-bold text-white">
              Contact Information
            </h3>

            <div className="mt-3 h-1 w-10 rounded bg-red-600" />

            <div className="mt-6 space-y-6">
              <div className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-red-500"
                />
                <div>
                  <p className="text-sm font-semibold text-white">
                    Colombo City Office
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    {company.cityOffice.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CarFront
                  size={18}
                  className="mt-0.5 shrink-0 text-red-500"
                />
                <div>
                  <p className="text-sm font-semibold text-white">
                    Vehicle Auction Facility
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    {company.vehicleFacility.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone
                  size={18}
                  className="mt-0.5 shrink-0 text-red-500"
                />
                <div>
                  <p className="text-sm font-semibold text-white">
                    Telephone
                  </p>
                  <a
                    href={`tel:${company.cityOffice.phoneLink}`}
                    className="mt-1 block text-sm text-slate-400 transition hover:text-red-400"
                  >
                    {company.cityOffice.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail
                  size={18}
                  className="mt-0.5 shrink-0 text-red-500"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">Email</p>
                  <a
                    href={`mailto:${company.email}`}
                    className="mt-1 block break-all text-sm text-slate-400 transition hover:text-red-400"
                  >
                    {company.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock3
                  size={18}
                  className="mt-0.5 shrink-0 text-red-500"
                />
                <div>
                  <p className="text-sm font-semibold text-white">
                    Auction Schedule
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    According to announced auction dates
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* EXTRA LINKS */}
        <div className="mt-14 border-t border-white/10 pt-7">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-red-400">
                Schokman &amp; Samerawickreme
              </p>
              <p className="mt-2 text-sm font-medium text-slate-300">
                One Country. One Auctioneer.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-slate-400 transition hover:text-red-400"
              >
                Official Website
              </a>

              <Link
                to="/about"
                className="text-xs font-medium text-slate-400 transition hover:text-red-400"
              >
                About This Platform
              </Link>

              <Link
                to="/register"
                className="text-xs font-medium text-slate-400 transition hover:text-red-400"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM FOOTER */}
      <div className="border-t border-white/10 bg-[#0b1220]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 text-center md:flex-row md:px-8 md:text-left">
          <p className="text-xs text-slate-400">
            © {currentYear} Vehicle Auction Management System.
          </p>

          <p className="text-xs text-slate-500">
            University Advanced Database Project — Proposed for
            Schokman &amp; Samerawickreme
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