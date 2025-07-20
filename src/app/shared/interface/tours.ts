export interface tour{
  tours: category[];
  tourDetail: tourDetail[];
  tourPackageDetail: tourPackageDetail[];
}

export interface category{
  id: number;
  categoryTitle: string,
  categoryDescription?: string,
  categoryImage: string,
  price: number,
  discountPrice: number,
  days: number,
  night: number,
  person: number;
  tag: boolean;
  tagTitle?: string;
}

export interface tourDetail{
  highlight: tourHighlight[];
  itinerary: tourItinerary[];
  gallery: tourGallery[];
  accommodation: tourAccommodation[];
  location: tourLocation;
  review: tourReview[];
  policy: tourPolicy[];
}

export interface tourHighlight{
  title?: string;
  description?: string;
  textClass?: string;
  data?: highlightData[];
  image?: string;
  highLightPosition?: string;
}

export interface highlightData{
  title: string;
  details: highlightDetails[]
}

export interface highlightDetails{
  data: string;
}

export interface tourItinerary{
  id: number;
  title: string;
  description: string;
  facility: tourFacility[]
}

export interface tourFacility{
  title: string;
  icon: string;
}

export interface tourGallery{
  id: number;
  url: string;
}

export interface tourAccommodation{
  id: number;
  hotelName: string;
  description: string;
  location: string;
  img: string;
  review: number;
  rating: number;
  hotelFacility: string[];
}

export interface tourLocation{
  url: string;
}

export interface tourReview{
  id: number;
  title: string;
  by: string;
  date: string;
  review: string;
  rating: number;
}

export interface tourPolicy{
  title: string;
  details: highlightDetails[]
}

export interface tourPackageDetail{
  id: number;
  categoryName: string;
  tours: number;
  days: number;
}
