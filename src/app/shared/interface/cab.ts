import { gallery } from "./restaurant";

export interface cab{
  cab: cabs[];
  cabImages: gallery[];
  cabDetails: cabDetail[];
  cabDrivers: cabDrivers[];
}

export interface cabs{
  id: number;
  carName: string;
  image: string;
  carType: string;
  badgeColor: string;
  fare: number
}

export interface cabDetail{
  title: string;
  details: data[]
}

export interface data{
  data: string;
}

export interface cabDrivers{
    id: number;
    name: string;
    image: string;
    gender: string;
    fromLocation: string;
    toLocation: string;
    phone: string;
}
