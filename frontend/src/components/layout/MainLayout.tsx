
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f8fa] text-slate-900">
      {/* Global Navigation */}
      <Navbar />

      {/* Main Page Content */}
      <main className="w-full flex-1">
        <Outlet />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
