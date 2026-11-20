
import { Routes, Route } from "react-router-dom";

import VehicleListPage from "../pages/VehicleListPage";
import AddVehiclePage from "../pages/AddVehiclePage";
import VehicleDetailsPage from "../pages/VehicleDetailsPage";
import BrowseVehiclesPage from "../pages/BrowseVehiclesPage";

export default function VehicleRoutes() {
  return (
    <Routes>
      {/* Public Vehicle Browsing */}
      <Route index element={<BrowseVehiclesPage />} />

      {/* Vehicle Management - Railway MySQL Data */}
      <Route path="manage" element={<VehicleListPage />} />

      {/* Keep Existing List URL Working */}
      <Route path="list" element={<VehicleListPage />} />

      {/* Add New Vehicle */}
      <Route path="add" element={<AddVehiclePage />} />

      {/* Vehicle Details */}
      <Route path=":id" element={<VehicleDetailsPage />} />

      {/* Browse Vehicle Brands */}
      <Route path="browse" element={<BrowseVehiclesPage />} />
    </Routes>
  );
}
