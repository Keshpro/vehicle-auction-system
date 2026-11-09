
import { Route, Routes } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import Home from "../pages/Home";
import Placeholder from "../pages/Placeholder";
import VehicleRoutes from "./VehicleRoutes";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />

        <Route path="auctions" element={<Placeholder />} />
        <Route path="auctions/:id" element={<Placeholder />} />

        <Route path="vehicles/*" element={<VehicleRoutes />} />

        <Route path="login" element={<Placeholder />} />
        <Route path="register" element={<Placeholder />} />
        <Route path="about" element={<Placeholder />} />

        <Route path="*" element={<Placeholder />} />
      </Route>
    </Routes>
  );
}
