import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  CarFront,
  CheckCircle2,
  Eye,
  EyeOff,
  Gavel,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import { registerBidder, type RegisterData } from "../services/authService";

const initialForm: RegisterData = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  address: "",
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition duration-200 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10";

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterData>(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (form.password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const result = await registerBidder(form);
      setSuccess(
        `${result.message || "Registration successful!"} Your bidder account is ${result.approvalStatus || "Pending"} approval.`
      );
      setForm(initialForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-[#f7f8fa] px-4 py-10 text-slate-900 sm:px-6 lg:py-16">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_80px_-35px_rgba(15,23,42,0.25)] lg:grid-cols-[0.88fr_1.12fr]">
        <aside className="relative isolate hidden min-h-[730px] overflow-hidden bg-[#101827] text-white lg:flex lg:flex-col lg:justify-between">
          <div
            className="absolute inset-0 -z-20 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1400&q=85')" }}
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#101827]/90 via-[#101827]/75 to-[#101827]/95" />
          <div className="p-10">
            <Link to="/" className="inline-flex items-center gap-3 text-white">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 shadow-lg shadow-red-950/30">
                <CarFront size={25} />
              </span>
              <span className="text-sm font-extrabold leading-tight tracking-tight">
                Schokman <span className="text-red-400">&amp;</span><br />Samerawickreme
              </span>
            </Link>
          </div>
          <div className="px-10 pb-11">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold tracking-wider text-white/90 backdrop-blur-sm">
              <Gavel size={15} className="text-red-400" /> S&amp;S AUCTION PLATFORM
            </div>
            <h2 className="max-w-sm text-4xl font-black leading-[1.15] tracking-tight">
              Your next vehicle starts <span className="text-red-400">here.</span>
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-200">
              Create a bidder account to explore vehicle auctions and prepare for your next opportunity.
            </p>
            <div className="mt-9 space-y-5 border-t border-white/20 pt-7">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-100"><ShieldCheck size={20} className="text-red-400" /> Secure account registration</div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-100"><UsersRound size={20} className="text-red-400" /> Bidder verification and approval</div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-100"><BadgeCheck size={20} className="text-red-400" /> Trusted auction experience</div>
            </div>
          </div>
        </aside>

        <div className="px-6 py-9 sm:px-10 sm:py-11 lg:px-14 lg:py-14">
          <div className="mb-7 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-red-600">
              <UserRound size={14} /> Bidder registration
            </span>
            <Link to="/" className="text-xs font-semibold text-slate-500 transition hover:text-red-600">← Back to home</Link>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[#101827] sm:text-[36px]">Create your account</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Join the S&amp;S vehicle auction platform. It only takes a moment.</p>

          {success && (
            <div role="status" className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800">
              <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
              <div><p>{success}</p><Link to="/login" className="mt-1 inline-flex items-center gap-1 font-bold underline underline-offset-2">Go to login <ArrowRight size={14} /></Link></div>
            </div>
          )}
          {error && <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{error}</div>}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="register-fullName" className="mb-2 block text-sm font-semibold text-slate-700">Full name <span className="text-red-500">*</span></label>
              <div className="relative"><UserRound size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input className={`${inputClass} pl-11`} id="register-fullName" name="fullName" type="text" autoComplete="name" placeholder="Enter your full name" value={form.fullName} onChange={handleChange} maxLength={100} required /></div>
            </div>
            <div>
              <label htmlFor="register-email" className="mb-2 block text-sm font-semibold text-slate-700">Email address <span className="text-red-500">*</span></label>
              <div className="relative"><Mail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input className={`${inputClass} pl-11`} id="register-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={handleChange} maxLength={255} required /></div>
            </div>
            <div>
              <label htmlFor="register-password" className="mb-2 block text-sm font-semibold text-slate-700">Password <span className="text-red-500">*</span></label>
              <div className="relative"><LockKeyhole size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input className={`${inputClass} pl-11 pr-12`} id="register-password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Minimum 8 characters" value={form.password} onChange={handleChange} minLength={8} required /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-600">{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button></div>
              <p className="mt-2 text-xs text-slate-400">Use at least 8 characters.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div><label htmlFor="register-phone" className="mb-2 block text-sm font-semibold text-slate-700">Phone number</label><div className="relative"><Phone size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input className={`${inputClass} pl-11`} id="register-phone" name="phone" type="tel" autoComplete="tel" placeholder="07XXXXXXXX" value={form.phone} onChange={handleChange} maxLength={20} /></div></div>
              <div><label htmlFor="register-address" className="mb-2 block text-sm font-semibold text-slate-700">City / address</label><div className="relative"><MapPin size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input className={`${inputClass} pl-11`} id="register-address" name="address" type="text" autoComplete="street-address" placeholder="e.g. Colombo" value={form.address} onChange={handleChange} maxLength={255} /></div></div>
            </div>
            <div className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500"><ShieldCheck size={19} className="mt-0.5 shrink-0 text-red-600" /><span>New bidder accounts are marked <strong className="text-slate-700">Pending</strong> until an administrator approves them.</span></div>
            <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Creating account..." : "Create bidder account"} {!loading && <ArrowRight size={18} />}
            </button>
          </form>
          <p className="mt-7 text-center text-sm text-slate-500">Already have an account? <Link to="/login" className="font-bold text-red-600 hover:text-red-700">Sign in</Link></p>
        </div>
      </div>
    </section>
  );
}
