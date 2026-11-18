
import { Routes, Route } from "react-router-dom";

import VehicleListPage from "../pages/VehicleListPage";
import AddVehiclePage from "../pages/AddVehiclePage";
import VehicleDetailsPage from "../pages/VehicleDetailsPage";
import BrowseVehiclesPage from "../pages/BrowseVehiclesPage";

export default function VehicleRoutes() {
  return (
    <Routes>
      {/* Browse Vehicle Brands */}
      <Route index element={<BrowseVehiclesPage />} />

      {/* Vehicle Listings */}
      <Route path="list" element={<VehicleListPage />} />

      {/* Add New Vehicle */}
      <Route path="add" element={<AddVehiclePage />} />

      {/* Vehicle Details */}
      <Route path=":id" element={<VehicleDetailsPage />} />

      {/* Optional Browse URL */}
      <Route path="browse" element={<BrowseVehiclesPage />} />
    </Routes>
  );
}
