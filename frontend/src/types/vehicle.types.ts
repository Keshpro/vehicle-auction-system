
export type VehicleStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "sold";

export interface Vehicle {
  id: number;
  title: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  color: string;
  description: string;
  startingPrice: number;
  status: VehicleStatus;
  images: string[];
  createdAt: string;
}

export type CreateVehicleInput = Omit<
  Vehicle,
  "id" | "status" | "createdAt"
>;

export type UpdateVehicleInput =
  Partial<CreateVehicleInput>;
