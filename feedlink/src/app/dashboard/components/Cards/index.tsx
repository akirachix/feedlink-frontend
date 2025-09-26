"use client";

import { Order, WasteClaim, Listing, MetricCardProps } from '../../../utils/types/index';


export default function MetricCard({
  title,
  orders,
  wasteClaims,
  listings,
  trend,
  isFirst = false,
}: MetricCardProps) {


  const listingMap = new Map<number, Listing>();
  for (const listing of listings) {
    listingMap.set(listing.listing_id, listing);
  }

 
  const calculateFoodFromOrders = (orders: Order[]): number => {
    let total = 0;
    for (const order of orders) {
      if (!Array.isArray(order.items)) continue;
      for (const item of order.items) {
        total += item.quantity;
      }
    }
    return total;
  };


  const calculateFoodFromWasteClaims = (claims: WasteClaim[], listingMap: Map<number, Listing>): number => {
    let total = 0;
    for (const claim of claims) {
      const listing = listingMap.get(claim.listing_id);
      if (!listing) continue;

      const quantity = parseFloat(listing.quantity);

      total += quantity;
    }
    return total;
  };


  const calculateRevenue = (orders: Order[]): number => {
    let total = 0;
    for (const order of orders) {
      total += parseFloat(order.total_amount) || 0;
    }
    return total;
  };


  const calculateCarbonSavedFromWaste = (claims: WasteClaim[], listingMap: Map<number, Listing>): number => {
    const CO2_PER_KG = 2.5;
    const totalWeight = calculateFoodFromWasteClaims(claims, listingMap);
    return totalWeight * CO2_PER_KG;
  };


  const countRecyclingPartners = (claims: WasteClaim[]): number => {
    const userIds = new Set<number>();
    for (const claim of claims) {
      userIds.add(claim.user);
    }
    return userIds.size;
  };


  const foodFromOrders = calculateFoodFromOrders(orders);
  const foodFromWaste = calculateFoodFromWasteClaims(wasteClaims, listingMap);
  const foodDiverted = foodFromOrders + foodFromWaste;
  const revenueRecovered = calculateRevenue(orders);
  const carbonSaved = calculateCarbonSavedFromWaste(wasteClaims, listingMap);
  const recyclingPartners = countRecyclingPartners(wasteClaims);


  let value: string | number = 0;
  if (title === "Total food diverted (KGS)") {
    value = foodDiverted.toLocaleString();
  } else if (title === "Revenue recovered (KSH)") {
    value = revenueRecovered.toLocaleString();
  } else if (title === "Carbon emissions saved (T)") {
    value = (carbonSaved / 1000).toFixed(1); 
  } else if (title === "Recycling partners") {
    value = recyclingPartners.toLocaleString();
  }


  if (isFirst) {
    return (
      <div className="bg-[var(--primary-color)] text-white p-4 rounded-lg shadow-md flex flex-col justify-center items-center h-44 md:h-32 xl:h-56 w-full max-w-xs md:max-w-sm lg:max-w-md">
        <p className="text-xl font-medium">{title}</p>
        <p className="text-7xl font-bold mt-1">{value}</p>
        {trend && <p className="text-lg mt-1">{trend}</p>}
      </div>
    );
  }

  return (
    <div className="bg-[#006400]/60 p-6 rounded-lg shadow-md flex flex-col justify-center items-center h-44 md:h-32 xl:h-56 w-full max-w-xs md:max-w-sm lg:max-w-md">
      <p className="text-base md:text-lg font-medium text-black text-center">{title}</p>
      <p className="text-7xl font-bold mt-1 text-[var(--primary-color)]">{value}</p>
      {trend && <p className="text-lg text-black mt-1">{trend}</p>}
    </div>
  );
}