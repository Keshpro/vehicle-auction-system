import { Route, Routes } from "react-router-dom";
import RegisterPage from "../features/auth/pages/RegisterPage";
import MainLayout from "../components/layout/MainLayout";
import Home from "../pages/Home";
import Placeholder from "../pages/Placeholder";
import VehicleRoutes from "./VehicleRoutes";
import LiveAuctionPage from "../pages/LiveAuctionPage";
import AuctionListPage from "../features/auctions/pages/AuctionListPage";
import UserManagement from "../UserManagement";
import BidderApproval from "../BidderApproval";
import AdminDashboard from "../pages/AdminDashboard";
import AdminRoutes from "./AdminRoutes";
import LoginPage from "../features/auth/pages/LoginPage";
import BidAuctionPage from "../features/bidding/pages/BidAuctionPage";
import CreateAuctionPage from "../features/auctions/pages/CreateAuctionPage";
export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="admin" element={<AdminRoutes />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="bidders" element={<BidderApproval />} />
          <Route path="auctions" element={<AuctionListPage />} />
          <Route path="auctions/new" element={<CreateAuctionPage />} />
        </Route>

        {/* Real Auction Listing and Bid Management */}
        <Route path="auctions" element={<AuctionListPage />} />
        <Route path="auctions/:id" element={<BidAuctionPage />} />

        {/* Original Demo Auction - Preserved */}
        <Route path="auctions/demo" element={<LiveAuctionPage />} />

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