
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  CarFront,
  UserRound,
  ArrowRight,
  ChevronRight,
  Gavel,
  LogOut,
} from "lucide-react";

const navLinks = [
  { path: "/", label: "Home", end: true },
  { path: "/auctions", label: "Live Auctions" },
  { path: "/vehicles", label: "Browse Vehicles" },
  { path: "/about", label: "About Us" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();

  async function handleLogout() {
    try {
      await signOut();
      closeMenu();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Could not log out. Please try again.");
    }
  }

  const closeMenu = () => setOpen(false);



  const handleHowItWorks = () => {
    closeMenu();

    if (location.pathname === "/") {
      document.getElementById("how-it-works")?.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md">

      {/* COMPANY TOP BAR */}
      <div className="border-b border-slate-800 bg-[#101827]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-2 md:px-8">

          <div className="flex min-w-0 items-center gap-2">
            <Gavel size={13} className="shrink-0 text-red-500" />
            <span className="truncate text-[10px] font-semibold tracking-wide text-slate-300 sm:text-xs">
              Schokman &amp; Samerawickreme
            </span>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            <span className="text-[11px] font-medium text-slate-300">
              Vehicle Auction &amp; Bidding Platform
            </span>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav className="mx-auto flex h-[78px] max-w-7xl items-center justify-between gap-5 px-5 md:px-8">

        {/* LOGO / BRAND */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex min-w-0 shrink-0 items-center gap-3"
        >
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm">
            <CarFront size={27} strokeWidth={2.2} />

            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#101827]">
              <Gavel size={10} />
            </span>
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-[17px] font-black italic tracking-tight text-slate-900 sm:text-lg">
              VEHICLE
              <span className="text-red-600">AUCTION</span>
            </span>

            <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.17em] text-slate-500">
              S&amp;S Auction Platform
            </span>
          </div>
        </Link>
        {/* DESKTOP ACTIONS */}
        <div className="hidden shrink-0 items-center gap-3 xl:flex">
          {!loading && (
            user ? (
              <>
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5">
                  <UserRound size={17} className="text-red-600" />
                  <div className="max-w-[130px]">
                    <p className="truncate text-sm font-bold text-slate-800">
                      {user.fullName}
                    </p>
                    <p className="text-[10px] font-medium text-slate-500">
                      {user.role}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  <UserRound size={17} />
                  Login
                </Link>

                <Link
                  to="/register"
                  className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 hover:shadow-md"
                >
                  Register
                  <ArrowRight size={16} />
                </Link>
              </>
            )
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-800 transition hover:bg-slate-100 xl:hidden"
        >
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </nav>

      {/* MOBILE NAVIGATION */}
      {open && (
        <div
          id="mobile-navigation"
          className="border-t border-slate-200 bg-white px-5 pb-6 pt-4 shadow-lg xl:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">

            {/* MOBILE BRAND HEADING */}
            <div className="mb-3 rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-bold text-slate-900">
                Schokman &amp; Samerawickreme
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                Vehicle Auction &amp; Bidding Platform
              </p>
            </div>

            {/* MOBILE LINKS */}
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.end}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold transition ${isActive
                    ? "bg-red-50 text-red-600"
                    : "text-slate-700 hover:bg-slate-50"
                  }`
                }
              >
                {link.label}
                <ChevronRight size={16} />
              </NavLink>
            ))}

            {/* HOW IT WORKS */}
            <Link
              to="/#how-it-works"
              onClick={handleHowItWorks}
              className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              How It Works
              <ChevronRight size={16} />
            </Link>

            <div className="my-3 border-t border-slate-200" />


            {!loading && (
              user ? (
                <>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2">
                      <UserRound size={19} className="text-red-600" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {user.fullName}
                        </p>
                        <p className="text-xs text-slate-500">{user.role}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-3 text-sm font-bold text-slate-800 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
                  >
                    <UserRound size={17} />
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                  >
                    Register Now
                    <ArrowRight size={17} />
                  </Link>
                </>
              )
            )}


          </div>
        </div>
      )}
    </header>
  );
}
