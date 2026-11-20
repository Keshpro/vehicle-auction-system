import { Route, Routes } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import Home from "../pages/Home";
import Placeholder from "../pages/Placeholder";
import VehicleRoutes from "./VehicleRoutes";
import LiveAuctionPage from "../pages/LiveAuctionPage";
import UserManagement from "../UserManagement";
import BidderApproval from "../BidderApproval";
import AdminDashboard from "../pages/AdminDashboard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="admin/users" element={<UserManagement />} />
        <Route path="admin/bidders" element={<BidderApproval />} />
        {import.meta.env.DEV && (
        <Route path="admin" element={<AdminDashboard />} />
        )}

        {/* Live Auction Page */}
        <Route path="auctions" element={<LiveAuctionPage />} />
        <Route path="auctions/:id" element={<Placeholder />} />

        {/* Existing Vehicle Module */}
        <Route path="vehicles/*" element={<VehicleRoutes />} />

        {/* Authentication */}
        <Route path="login" element={<Placeholder />} />
        <Route path="register" element={<Placeholder />} />

        <Route path="about" element={<Placeholder />} />
        <Route path="*" element={<Placeholder />} />
      </Route>
    </Routes>
  );
}