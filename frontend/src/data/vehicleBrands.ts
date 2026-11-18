
export interface VehicleBrand {
  id: number;
  name: string;
  country: string;
  category: string;
  logo: string;
  image: string;
}

type BrandInput = [
  name: string,
  country: string,
  category: string,
  imageId: string
];

const photos = {
  suv: "photo-1519641471654-76ce0107ad1b",
  sedan: "photo-1555215695-3004980ad54e",
  sports: "photo-1503376780353-7e6692767b70",
  luxury: "photo-1618843479313-40f8afb4b4d8",
  compact: "photo-1549317661-bd32c8ce0db2",
  car: "photo-1492144534655-ae79c964c9d7",
  hybrid: "photo-1621007947382-bb3c3994e3fb",
  pickup: "photo-1533473359331-0135ef1b58bf",
};

const brandData: BrandInput[] = [
  ["Toyota", "Japan", "Japanese", photos.suv],
  ["Honda", "Japan", "Japanese", photos.compact],
  ["Nissan", "Japan", "Japanese", photos.sedan],
  ["Mazda", "Japan", "Japanese", photos.sports],
  ["Mitsubishi", "Japan", "Japanese", photos.suv],
  ["Subaru", "Japan", "Japanese", photos.suv],
  ["Suzuki", "Japan", "Japanese", photos.compact],
  ["Isuzu", "Japan", "Japanese", photos.pickup],
  ["Lexus", "Japan", "Luxury", photos.luxury],
  ["Daihatsu", "Japan", "Japanese", photos.compact],
  ["Hino", "Japan", "Japanese", photos.pickup],
  ["Acura", "Japan", "Luxury", photos.sedan],
  ["Infiniti", "Japan", "Luxury", photos.luxury],
  ["Mitsuoka", "Japan", "Japanese", photos.car],

  ["Mercedes-Benz", "Germany", "Luxury", photos.luxury],
  ["BMW", "Germany", "Luxury", photos.sedan],
  ["Audi", "Germany", "Luxury", photos.luxury],
  ["Porsche", "Germany", "Luxury", photos.sports],
  ["Volkswagen", "Germany", "European", photos.compact],
  ["Opel", "Germany", "European", photos.car],
  ["Smart", "Germany", "European", photos.compact],
  ["Maybach", "Germany", "Luxury", photos.luxury],

  ["Volvo", "Sweden", "European", photos.suv],
  ["Polestar", "Sweden", "European", photos.sedan],
  ["Saab", "Sweden", "European", photos.car],

  ["Peugeot", "France", "European", photos.compact],
  ["Renault", "France", "European", photos.compact],
  ["Citroen", "France", "European", photos.car],
  ["Bugatti", "France", "Luxury", photos.sports],

  ["Fiat", "Italy", "European", photos.compact],
  ["Alfa Romeo", "Italy", "Luxury", photos.sports],
  ["Ferrari", "Italy", "Luxury", photos.sports],
  ["Lamborghini", "Italy", "Luxury", photos.sports],
  ["Maserati", "Italy", "Luxury", photos.luxury],
  ["Lancia", "Italy", "European", photos.car],

  ["Bentley", "United Kingdom", "Luxury", photos.luxury],
  ["Rolls-Royce", "United Kingdom", "Luxury", photos.luxury],
  ["Jaguar", "United Kingdom", "Luxury", photos.sedan],
  ["Land Rover", "United Kingdom", "Luxury", photos.suv],
  ["Mini", "United Kingdom", "European", photos.compact],
  ["Aston Martin", "United Kingdom", "Luxury", photos.sports],
  ["McLaren", "United Kingdom", "Luxury", photos.sports],
  ["Lotus", "United Kingdom", "Luxury", photos.sports],
  ["MG", "United Kingdom", "European", photos.car],

  ["Ford", "USA", "American", photos.pickup],
  ["Chevrolet", "USA", "American", photos.car],
  ["Tesla", "USA", "American", photos.sedan],
  ["Jeep", "USA", "American", photos.suv],
  ["Dodge", "USA", "American", photos.sports],
  ["Chrysler", "USA", "American", photos.sedan],
  ["Cadillac", "USA", "Luxury", photos.luxury],
  ["Lincoln", "USA", "Luxury", photos.luxury],
  ["GMC", "USA", "American", photos.pickup],
  ["Buick", "USA", "American", photos.suv],
  ["RAM", "USA", "American", photos.pickup],

  ["Hyundai", "South Korea", "Korean", photos.suv],
  ["Kia", "South Korea", "Korean", photos.compact],
  ["Genesis", "South Korea", "Luxury", photos.luxury],
  ["SsangYong", "South Korea", "Korean", photos.suv],
  ["Daewoo", "South Korea", "Korean", photos.car],

  ["BYD", "China", "Chinese", photos.hybrid],
  ["Geely", "China", "Chinese", photos.suv],
  ["Chery", "China", "Chinese", photos.suv],
  ["Great Wall", "China", "Chinese", photos.pickup],
  ["Haval", "China", "Chinese", photos.suv],
  ["Changan", "China", "Chinese", photos.car],
  ["NIO", "China", "Chinese", photos.sedan],
  ["XPeng", "China", "Chinese", photos.sedan],
  ["Zeekr", "China", "Chinese", photos.luxury],
  ["Hongqi", "China", "Chinese", photos.luxury],

  ["Tata", "India", "Indian", photos.suv],
  ["Mahindra", "India", "Indian", photos.suv],
  ["Maruti Suzuki", "India", "Indian", photos.compact],
  ["Force Motors", "India", "Indian", photos.pickup],

  ["Proton", "Malaysia", "Others", photos.sedan],
  ["Perodua", "Malaysia", "Others", photos.compact],
  ["VinFast", "Vietnam", "Others", photos.suv],
  ["Holden", "Australia", "Others", photos.car],
];

export const vehicleBrands: VehicleBrand[] = brandData.map(
  ([name, country, category, imageId], index) => ({
    id: index + 1,
    name,
    country,
    category,
    logo: "",
    image:
      `https://images.unsplash.com/${imageId}` +
      "?auto=format&fit=crop&w=650&q=85",
  })
);

export const vehicleCategories = [
  "All",
  "Japanese",
  "Luxury",
  "European",
  "American",
  "Korean",
  "Chinese",
  "Indian",
  "Others",
];
