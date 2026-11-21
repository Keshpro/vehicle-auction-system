import { useEffect, useState } from "react";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../features/auth/services/authService";

type AdminSession =
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "forbidden" }
  | { status: "error" }
  | { status: "admin"; fullName: string };

export default function AdminRoutes() {
  const navigate = useNavigate();
  const [session, setSession] = useState<AdminSession>({ status: "loading" });
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function checkSession() {
      try {
        const response = await fetch("http://localhost:5000/api/admin/users/session", {
          credentials: "include",
          signal: controller.signal,
        });

        if (response.status === 401) {
          setSession({ status: "signed-out" });
        } else if (response.status === 403) {
          setSession({ status: "forbidden" });
        } else if (response.ok) {
          const { fullName } = await response.json();
          setSession({ status: "admin", fullName });
        } else {
          setSession({ status: "error" });
        }
      } catch {
        if (!controller.signal.aborted) setSession({ status: "error" });
      }
    }

    void checkSession();
    return () => controller.abort();
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    setLogoutError("");
    try {
      await logout();
      setSession({ status: "signed-out" });
      navigate("/login", { replace: true });
    } catch {
      setLogoutError("Could not log out. Try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  if (session.status === "signed-out") return <Navigate to="/login" replace />;
  if (session.status === "loading") return <p className="p-6" role="status">Checking admin access…</p>;
  if (session.status === "forbidden") return <p className="p-6" role="alert">This page requires an admin account.</p>;
  if (session.status === "error") return <p className="p-6" role="alert">Could not check your session. Refresh to try again.</p>;

  return (
    <>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-5 pt-6 md:px-8">
        <Link to="/admin" className="mr-auto font-semibold text-red-700 hover:underline">
          Admin Dashboard
        </Link>
        <p className="text-sm text-slate-700">Signed in as {session.fullName} (Admin)</p>
        <button
          type="button"
          disabled={loggingOut}
          onClick={() => void handleLogout()}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
        >
          {loggingOut ? "Logging out…" : "Log out"}
        </button>
        {logoutError && <p role="alert" className="w-full text-sm text-red-700">{logoutError}</p>}
      </div>
      <Outlet />
    </>
  );
}
