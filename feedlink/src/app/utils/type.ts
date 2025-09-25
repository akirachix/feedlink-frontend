export interface OrderItemType {
  id: number;
  quantity: number;
  price: string;
  listing: number; 
}

export interface OrderType {
  order_id: number;
  user: number;
  total_amount: string;
  order_date: string;
  order_status: "pending" | "picked";
  items: OrderItemType[]; 
}

export interface UserType {
  id: number;
  first_name: string;
  last_name: string;
}

export interface ListingType {
  listing_id: number;
  category: string;
  quantity: string;
}

export interface WasteClaimType {
  waste_id: number;
  user: number;
  listing_id: number;
  claim_time: string;
  claim_status: "pending" | "collected";
}

export interface CalendarProperties {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}


