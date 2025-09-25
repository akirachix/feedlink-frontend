export interface Order {
  order_id: number;
  items: Item[];
  user: number;
  order_date: string;
  total_amount: string;
  created_at: string;
  order_status: string;
}

export interface Item {
  quantity: number;
  price: string;
  listing: number;
}

export interface WasteClaim {
  waste_id: number;
  user: number;
  listing_id: number;
  claim_status: string;
  pin: string;
  created_at: string;
  updated_at: string;
  claim_time: string;
}

export interface DashboardMetrics {
  foodDiverted: number;
  hungerMetric: number;
  revenueRecovered: number;
  carbonSaved: number;
  totalCarbonSaved: number;
  recyclingPartners: number;
}


export interface MonthlyData {
  month: string;
  weight: number;
  revenue: number;
}


export interface MetricCardProps {
  title: string;
  orders: Order[];
  wasteClaims: WasteClaim[];
  listings: Listing[];
  trend: string;
  isFirst?: boolean;
}

export interface Badge {
  title: string;
  desc: string;
  goal: number;
  value: number;
  color: string;
  progressColor: string;
  tickColor: string;
}

export interface BadgeProps {
  orders: Order[];
  wasteClaims: WasteClaim[];
  listings: Listing[];
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  profile_picture: string;
  address: string;
  till_number: string;
  latitude: number | null;
  longitude: number | null;
}


export type Listing = {
  listing_id: number;
  product_type: string;
  quantity: string | number;
  category: string;
  description: string;
  original_price: string | null;
  expiry_date: string | null;
  discounted_price: string | null;
  image: string | null;
  image_url: string;
  status: string;
  created_at: string;
  updated_at: string;
  upload_method: string;
  pickup_window_duration: string;
  unit: string;
  producer: number;
};
export interface Listing {
  listing_id: number;
  title: string;
  quantity: string;
  unit: string;
  
}

interface Props {
  totalItems: number;
  expiringSoonCount: number;
  expiredCount: number;
}

