
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export interface Vehicle {
  vehicleId: number;
  consignorId: number;
  yardLocationId: number;
  registrationNumber: string | null;
  chassisNumber: string;
  make: string;
  model: string;
  manufactureYear: number;
  colour: string | null;
  mileageKm: number | null;
  fuelType: string | null;
  transmission: string | null;
  description: string | null;
  createdAt: string;
}

export interface VehicleRequest {
  consignorId: number;
  yardLocationId: number;
  registrationNumber: string | null;
  chassisNumber: string;
  make: string;
  model: string;
  manufactureYear: number;
  colour: string | null;
  mileageKm: number | null;
  fuelType: string | null;
  transmission: string | null;
  description: string | null;
}

interface ApiMessage {
  message: string;
}

interface CreateVehicleResponse extends ApiMessage {
  vehicleId: number;
}

// Handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `Request failed (${response.status})`;

    try {
      const errorData = await response.json();

      errorMessage =
        errorData.message ||
        errorData.title ||
        errorMessage;
    } catch {
      // Handle non-JSON error responses
    }

    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}

// GET ALL VEHICLES
export async function getVehicles(): Promise<Vehicle[]> {
  const response = await fetch(`${API_BASE_URL}/api/vehicles`);

  return handleResponse<Vehicle[]>(response);
}

// GET VEHICLE BY ID
export async function getVehicleById(
  id: number
): Promise<Vehicle> {
  const response = await fetch(
    `${API_BASE_URL}/api/vehicles/${id}`
  );

  return handleResponse<Vehicle>(response);
}

// CREATE VEHICLE
export async function createVehicle(
  vehicle: VehicleRequest
): Promise<CreateVehicleResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/vehicles`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vehicle),
    }
  );

  return handleResponse<CreateVehicleResponse>(response);
}

// UPDATE VEHICLE
export async function updateVehicle(
  id: number,
  vehicle: VehicleRequest
): Promise<ApiMessage> {
  const response = await fetch(
    `${API_BASE_URL}/api/vehicles/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vehicle),
    }
  );

  return handleResponse<ApiMessage>(response);
}

// DELETE VEHICLE
export async function deleteVehicle(
  id: number
): Promise<ApiMessage> {
  const response = await fetch(
    `${API_BASE_URL}/api/vehicles/${id}`,
    {
      method: "DELETE",
    }
  );

  return handleResponse<ApiMessage>(response);
}
