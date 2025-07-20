export interface review{
  review: reviewDetails[];
}

export interface reviewDetails{
  id: number;
  name: string;
  image: string;
  totalReview: number;
  time: string;
  rating: number;
  review: string;
}
