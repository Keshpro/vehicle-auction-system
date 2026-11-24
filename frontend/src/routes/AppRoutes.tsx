import { Route, Routes } from "react-router-dom";
import RegisterPage from "../features/auth/pages/RegisterPage";
import MainLayout from "../components/layout/MainLayout";
import Home from "../pages/Home";
import Placeholder from "../pages/Placeholder";
import VehicleRoutes from "./VehicleRoutes";
import LiveAuctionPage from "../pages/LiveAuctionPage";
import UserManagement from "../UserManagement";
import BidderApproval from "../BidderApproval";
import AdminDashboard from "../pages/AdminDashboard";
import AdminRoutes from "./AdminRoutes";
import LoginPage from "../features/auth/pages/LoginPage";
import BidAuctionPage from "../features/bidding/pages/BidAuctionPage";
export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="admin" element={<AdminRoutes />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="bidders" element={<BidderApproval />} />
        </Route>

        {/* Live Auction Page */}
        <Route path="auctions" element={<LiveAuctionPage />} />
        <Route
          path="auctions/:id"
          element={<BidAuctionPage />}
        />

        {/* Existing Vehicle Module */}
        <Route path="vehicles/*" element={<VehicleRoutes />} />

        {/* Authentication */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        <Route path="about" element={<Placeholder />} />
        <Route path="*" element={<Placeholder />} />
      </Route>
    </Routes>
  );
}