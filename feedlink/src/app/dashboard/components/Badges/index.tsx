"use client";
import { Check } from "lucide-react";
import { Order, WasteClaim, Listing, Badge } from '../../../utils/types/index';
interface BadgeProps {
  orders: Order[];
  wasteClaims: WasteClaim[];
  listings: Listing[];
}
export default function Badges({ orders, wasteClaims, listings }: BadgeProps) {
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
      const quantity = typeof listing.quantity === "string" ? parseFloat(listing.quantity) : listing.quantity;
      total += quantity;
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
  const hungerMetric = foodFromOrders;
  const carbonSaved = calculateCarbonSavedFromWaste(wasteClaims, listingMap);
  const recyclingPartners = countRecyclingPartners(wasteClaims);
  const getUnit = (title: string): string => {
    if (title === "Planet Hero") {
      return "T";
    } else if (title === "Recycling Hero") {
      return "partners";
    } else {
      return "kg";
    }
  };
  const badges: Badge[] = [
    {
      title: "Landfill Hero",
      desc: "Diverted over 10,000 kgs",
      goal: 10000,
      value: foodDiverted,
      color: "bg-emerald-100 text-emerald-800 border border-emerald-200",
      progressColor: "bg-emerald-500",
      tickColor: "bg-emerald-600",
    },
    {
      title: "Hunger Hero",
      desc: "Donated over 2,500+ kgs",
      goal: 2500,
      value: hungerMetric,
      color: "bg-amber-100 text-amber-800 border border-amber-200",
      progressColor: "bg-amber-500",
      tickColor: "bg-amber-600",
    },
    {
      title: "Planet Hero",
      desc: "Saved over 20+ CO₂ tonnes",
      goal: 20,
      value: carbonSaved / 1000,
      color: "bg-sky-100 text-sky-800 border border-sky-200",
      progressColor: "bg-sky-500",
      tickColor: "bg-sky-600",
    },
    {
      title: "Recycling Hero",
      desc: "Recycled with 20+ partners",
      goal: 20,
      value: recyclingPartners,
      color: "bg-purple-100 text-purple-800 border border-purple-200",
      progressColor: "bg-purple-500",
      tickColor: "bg-purple-600",
    },
  ];
   return (
    <div className="border rounded-lg p-2 sm:p-4 xl:p-8 w-full h-full min-h-[360px] flex flex-col justify-between">
  <div className="mb-2 lg:mb-6 xl:mb-4 2xl:mb-2">
    <h2 className="text-lg sm:text-2xl xl:text-3xl font-bold mb-2 xl:mb-4 text-[var(--primary-color)]">
  Sustainability badges
</h2>
    <h5 className="text-base xl:text-lg">Food diverted and impact</h5>
  </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 lg:gap-6 xl:gap-7">
    {badges.map((badge, index) => {
      const achieved = badge.value >= badge.goal;
      const progress = Math.min((badge.value / badge.goal) * 100, 100);
      return (
        <div
          key={index}
          className={`p-2 sm:p-4 lg:p-5 xl:p-4 2xl:p-4 rounded-lg ${badge.color} flex items-start space-x-2 xl:space-x-2 2xl:space-x-1 hover:shadow-md transition-shadow duration-300`}
        >
          <div
            data-testid="check-icon"
            className={`w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 2xl:w-9 2xl:h-9 flex items-center justify-center rounded-full shadow-md transition-transform duration-300 ${achieved
              ? `${badge.tickColor} text-white scale-110 animate-pulse`
              : "bg-gray-200 text-gray-400"
            }`}
          >
            <Check className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 2xl:w-7 2xl:h-7" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-xs sm:text-base lg:text-lg xl:text-base 2xl:text-sm">{badge.title}</p>
            <p className="text-xs sm:text-sm lg:text-base xl:text-sm 2xl:text-xs text-gray-600 mb-1 xl:mb-2">{badge.desc}</p>
            <div className="w-full bg-gray-200 rounded-full h-1 sm:h-1.5 lg:h-2 xl:h-1.5 2xl:h-1 mb-1">
              <div
                className={`h-1 sm:h-1.5 lg:h-2 xl:h-1.5 2xl:h-1 rounded-full ${badge.progressColor} transition-all duration-500`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs sm:text-sm lg:text-base xl:text-xs text-gray-600">
              {typeof badge.value === 'number' ? badge.value.toLocaleString() : badge.value} / {badge.goal.toLocaleString()} {getUnit(badge.title)}
            </p>
          </div>
        </div>
      );
    })}
  </div>
</div>
   );
}