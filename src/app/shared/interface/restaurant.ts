import { detailsData } from "./hotel";
import { tourLocation, tourReview } from "./tours";

export interface restaurant{
  restaurant: restaurants[];
  restaurantOrders: restaurantOrders[];
  restaurantOverview: restaurantOverview[];
  restaurantGallery: gallery[];
  restaurantLocation: tourLocation;
  restaurantReview: tourReview[];
  addRestaurantDetails: addRestaurantDetails[];
  menuItem: menuItem[];
}

export interface restaurants{
  id: number;
  restaurantName: string;
  location: string;
  image: string;
  restaurantType: string;
  phone: string;
  email: string;
  badgeColor: string;
}

export interface restaurantOrders{
  id: number;
  title: string;
  value: string;
  totalItems?: number;
  items?: OrderItems[];
  children?: restaurantOrders[];
  active?: boolean;
}

export interface OrderItems{
  id: number;
  title: string;
  description: string;
  price: number;
  mealType: string;
  itemsValue: number;
  customized?: boolean;
  active?: boolean;
  cartItem?: boolean;
}

export interface restaurantOverview{
  id: number;
  sectionClass: string;
  items: overviewItems[]
}

export interface gallery{
  id: number;
  image: string;
  imageType: string;
}

export interface overviewItems{
  id: number;
  title: string;
  data?: itemsData[];
}

export interface itemsData{
  item: string;
}

export interface addRestaurantDetails{
  restaurantType: detailsData[];
  country: detailsData[];
  state: detailsData[];
  city: detailsData[];
  restaurantFacility: restaurantFacility[];
}

export interface restaurantFacility{
  data: detailsData[];
}

export interface menuItem{
  id: number;
  itemName: string;
  image: string;
  itemType: string;
  badgeColor: string;
  price: number;
}
