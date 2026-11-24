
import { Routes, Route } from "react-router-dom";

import VehicleListPage from "../pages/VehicleListPage";
import AddVehiclePage from "../pages/AddVehiclePage";
import EditVehiclePage from "../pages/EditVehiclePage";
import VehicleDetailsPage from "../pages/VehicleDetailsPage";
import BrowseVehiclesPage from "../pages/BrowseVehiclesPage";
import BrandVehiclesPage from "../pages/BrandVehiclesPage";

export default function VehicleRoutes() {
  return (
    <Routes>
      {/* Browse All Vehicle Brands */}
      <Route
        index
        element={<BrowseVehiclesPage />}
      />

      {/* Brand-Specific Vehicle Listings */}
      <Route
        path="brand/:brand"
        element={<BrandVehiclesPage />}
      />

      {/* Vehicle Management */}
      <Route
        path="manage"
        element={<VehicleListPage />}
      />

      {/* Existing Vehicle List URL */}
      <Route
        path="list"
        element={<VehicleListPage />}
      />

      {/* Add New Vehicle */}
      <Route
        path="add"
        element={<AddVehiclePage />}
      />

      {/* Browse Brands Alternative URL */}
      <Route
        path="browse"
        element={<BrowseVehiclesPage />}
      />

      {/* Edit Existing Vehicle */}
      <Route
        path=":id/edit"
        element={<EditVehiclePage />}
      />

      {/* Vehicle Details */}
      <Route
        path=":id"
        element={<VehicleDetailsPage />}
      />
    </Routes>
  );
}
