
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Menu,
  X,
  Gavel,
  CarFront,
  UserRound,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

const navLinks = [
  { path: "/", label: "Home", end: true },
  { path: "/auctions", label: "Live Auctions" },
  { path: "/vehicles", label: "Browse Vehicles" },
  { path: "/about", label: "About Us" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative flex items-center text-sm font-semibold transition-colors duration-200 ${
      isActive
        ? "text-red-600"
        : "text-slate-700 hover:text-red-600"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md">
      <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-5 px-5 md:px-8">

        {/* LOGO */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex shrink-0 items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm">
            <CarFront size={26} strokeWidth={2.3} />
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-lg font-black italic tracking-tight text-slate-900">
              VEHICLE<span className="text-red-600">AUCTION</span>
            </span>

            <span className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.28em] text-slate-500">
              Bidding Platform
            </span>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden items-center gap-6 lg:flex xl:gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              className={linkClass}
            >
              {({ isActive }) => (
                <span className="relative flex h-[76px] items-center">
                  {link.label}

                  {isActive && (
                    <span className="absolute bottom-0 left-0 h-[3px] w-full rounded-t bg-red-600" />
                  )}
                </span>
              )}
            </NavLink>
          ))}

          <a
            href="/#how-it-works"
            className="text-sm font-semibold text-slate-700 transition hover:text-red-600"
          >
            How It Works
          </a>
        </div>

        {/* DESKTOP ACTIONS */}
        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <Link
            to="/login"
            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <UserRound size={17} />
            Login
          </Link>

          <Link
            to="/register"
            className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-red-700"
          >
            Register
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-800 transition hover:bg-slate-100 lg:hidden"
        >
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </nav>

      {/* MOBILE NAVIGATION */}
      {open && (
        <div
          id="mobile-navigation"
          className="border-t border-slate-200 bg-white px-5 pb-6 pt-4 shadow-lg lg:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.end}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-red-50 text-red-600"
                      : "text-slate-700 hover:bg-slate-50"
                  }`
                }
              >
                {link.label}
                <ChevronDown size={15} className="-rotate-90" />
              </NavLink>
            ))}

            <Link
              to="/"
              onClick={() => {
                closeMenu();
                window.setTimeout(() => {
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" });
                }, 0);
              }}
              className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              How It Works
              <ChevronDown size={15} className="-rotate-90" />
            </Link>

            <div className="my-3 border-t border-slate-200" />

            <Link
              to="/login"
              onClick={closeMenu}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-3 text-sm font-bold text-slate-800"
            >
              <UserRound size={17} />
              Login
            </Link>

            <Link
              to="/register"
              onClick={closeMenu}
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700"
            >
              Register Now
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
