
export interface FeaturedVehicle {
  id: number;
  name: string;
  year: number;
  category: "Luxury" | "Sports";
  price: number;
  status: "Live" | "Upcoming";
  image: string;
}
