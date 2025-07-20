export interface hotel{
  hotels: hotels[];
  hotelImages: hotelImages[];
  details: hotelDetail[];
  addHotelDetails: addHotelDetails[];
}

export interface hotels{
  id: number;
  hotelName: string;
  image: string;
  location: string;
  phone: string;
  email: string;
}

export interface hotelImages{
  id: number;
  image: string;
}

export interface hotelDetail{
  about: hotelAbout[];
  rooms: hotelRooms[];
  facility: hotelFacility[];
  location: hotelLocation;
  review: hotelReview[];
  policy: hotelPolicy[];
}

export interface hotelAbout{
  title: string;
  description: string
}

export interface hotelRooms{
  id: number;
  roomType: string;
  roomImage: string;
  amenities: string[];
  inclusion: string[];
  guestService: string[];
  price: number;
  discountPrice: number;
}

export interface hotelFacility{
  id: number;
  data: facilityData[];
}

export interface facilityData{
  title: string;
  icon: string;
  details: string[];
  marginClass?: boolean;
}

export interface hotelLocation{
  url: string;
}

export interface hotelReview{
  id: number;
  title: string;
  by: string;
  date: string;
  review: string;
  rating: number;
}

export interface hotelPolicy{
  details: string;
}

export interface addHotelDetails{
  hotelCategory: detailsData[];
  country: detailsData[];
  state: detailsData[];
  city: detailsData[];
  roomCategory: detailsData[];
  roomInclusion: roomInclusion[];
  roomAmenities: roomInclusion[];
}

export interface detailsData{
  id: number;
  title: string;
  value: string;
  checked?: boolean;
}

export interface roomInclusion{
  data: detailsData[];
}
