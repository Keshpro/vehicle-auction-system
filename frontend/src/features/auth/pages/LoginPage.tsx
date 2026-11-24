
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CarFront,
  CheckCircle2,
  Clock3,
  Eye,
  EyeOff,
  Gavel,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition duration-200 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10";

type LoggedInUser = {
  fullName: string;
  role: string;
  approvalStatus: string;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<LoggedInUser | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn(email, password);

      if (result.role === "Admin") {
        navigate("/admin", { replace: true });
        return;
      }

      setUser({
        fullName: result.fullName,
        role: result.role,
        approvalStatus: result.approvalStatus || "Pending",
      });

      setPassword("");
    } catch (err) {
      setUser(null);
      setError(
        err instanceof Error
          ? err.message
          : "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-[#f7f8fa] px-4 py-10 text-slate-900 sm:px-6 lg:py-16">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_80px_-35px_rgba(15,23,42,0.25)] lg:min-h-[630px] lg:grid-cols-2">
        <aside className="relative isolate hidden overflow-hidden bg-[#101827] text-white lg:flex lg:flex-col lg:justify-between">
          <div
            className="absolute inset-0 -z-20 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1400&q=85')",
            }}
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#101827]/90 via-[#101827]/65 to-[#101827]/95" />

          <div className="p-10">
            <Link to="/" className="inline-flex items-center gap-3 text-white">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 shadow-lg shadow-red-950/30">
                <CarFront size={25} />
              </span>
              <span className="text-sm font-extrabold leading-tight tracking-tight">
                Schokman <span className="text-red-400">&amp;</span>
                <br />
                Samerawickreme
              </span>
            </Link>
          </div>

          <div className="px-10 pb-11">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold tracking-wider text-white/90 backdrop-blur-sm">
              <Gavel size={15} className="text-red-400" />
              S&amp;S AUCTION PLATFORM
            </span>

            <h2 className="mt-6 max-w-sm text-4xl font-black leading-[1.15] tracking-tight">
              Welcome back to{" "}
              <span className="text-red-400">the action.</span>
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-200">
              Sign in to access your account and stay connected to the latest
              vehicle auctions.
            </p>

            <div className="mt-8 flex items-start gap-3 border-t border-white/20 pt-7 text-sm text-slate-100">
              <ShieldCheck size={21} className="shrink-0 text-red-400" />
              <p>Secure access to your S&amp;S account.</p>
            </div>
          </div>
        </aside>

        <div className="flex flex-col justify-center px-6 py-11 sm:px-10 lg:px-16">
          <div className="mb-8 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-red-600">
              <LockKeyhole size={14} />
              Account login
            </span>
            <Link
              to="/"
              className="text-xs font-semibold text-slate-500 hover:text-red-600"
            >
              ← Back to home
            </Link>
          </div>

          {!user ? (
            <>
              <h1 className="text-3xl font-black tracking-tight text-[#101827] sm:text-[38px]">
                Welcome back
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Enter your details to sign in to your account.
              </p>

              {error && (
                <div
                  role="alert"
                  className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-9 space-y-6">
                <div>
                  <label
                    htmlFor="login-email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      className={`${inputClass} pl-11`}
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="login-password"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      className={`${inputClass} pl-11 pr-12`}
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-600"
                    >
                      {showPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Signing in..." : "Sign in"}
                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-slate-500">
                New to S&amp;S auctions?{" "}
                <Link
                  to="/register"
                  className="font-bold text-red-600 hover:text-red-700"
                >
                  Create an account
                </Link>
              </p>

              <div className="mt-9 border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
                <ShieldCheck size={15} className="mr-1 inline text-red-600" />
                Your credentials are verified securely.
              </div>
            </>
          ) : (
            <div
              className="rounded-2xl border border-emerald-100 bg-emerald-50/60 px-6 py-8 text-center"
              role="status"
            >
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle2 size={33} />
              </span>

              <h1 className="mt-5 text-2xl font-black text-[#101827]">
                Signed in successfully!
              </h1>

              <p className="mt-2 text-sm text-slate-600">
                Welcome back, <strong>{user.fullName}</strong>.
              </p>

              <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 text-left text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">Your role</span>
                  <strong className="text-slate-800">{user.role}</strong>
                </div>

                <div className="mt-3 flex justify-between gap-3 border-t border-slate-100 pt-3">
                  <span className="text-slate-500">Approval status</span>
                  <strong
                    className={
                      user.approvalStatus === "Approved"
                        ? "text-emerald-700"
                        : "text-amber-700"
                    }
                  >
                    {user.approvalStatus}
                  </strong>
                </div>
              </div>

              {user.approvalStatus === "Pending" && (
                <p className="mt-5 flex items-center justify-center gap-2 text-sm text-amber-800">
                  <Clock3 size={17} />
                  Your account is awaiting admin approval.
                </p>
              )}

              <Link
                to="/vehicles"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#101827] px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
              >
                Browse vehicles <ArrowRight size={17} />
              </Link>

              <p className="mt-4 text-xs text-slate-500">
                Browsing is available; bidding requires approval.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
