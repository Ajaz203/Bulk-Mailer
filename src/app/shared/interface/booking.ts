export interface booking{
  booking: bookingDetails[];
}

export interface bookingDetails{
  id: number;
  bookingTitle: string;
  bookingType: string;
  price: number;
  date: string;
  status: string;
  badgeColor: string;
}
