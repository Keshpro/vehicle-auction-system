
import { Routes, Route } from "react-router-dom";

import VehicleListPage from "../pages/VehicleListPage";
import AddVehiclePage from "../pages/AddVehiclePage";
import VehicleDetailsPage from "../pages/VehicleDetailsPage";

export default function VehicleRoutes() {
  return (
    <Routes>
      <Route index element={<VehicleListPage />} />
      <Route path="add" element={<AddVehiclePage />} />
      <Route path=":id" element={<VehicleDetailsPage />} />
    </Routes>
  );
}
