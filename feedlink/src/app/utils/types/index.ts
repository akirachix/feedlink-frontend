export interface Order {
  order_id: number;
  items: Item[];
  user: number;
  order_date: string;
  total_amount: string;
  created_at: string;
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

export interface Listing {
  listing_id: number;
  title: string;
  quantity: string;
  unit: string;
  
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