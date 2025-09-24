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

      const quantity = parseFloat(listing.quantity);
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
    <div className="border rounded-lg p-9 w-178">
      <div className="mb-10">
        <h2 className="text-3xl font-bold mb-4 text-[#006400]">Sustainability badges</h2>
        <h5 className="text-xl">Food diverted and impact</h5>
      </div>

      <div className="grid grid-cols-2 gap-7">
        {badges.map((badge, index) => {
          const achieved = badge.value >= badge.goal;
          const progress = Math.min((badge.value / badge.goal) * 100, 100);

          return (
            <div
              key={index}
              className={`p-5 rounded-lg ${badge.color} flex items-start space-x-3 hover:shadow-md transition-shadow duration-300`}
            >
              <div
                data-testid="check-icon"
                className={`w-12 h-12 flex items-center justify-center rounded-full shadow-md transition-transform duration-300 ${achieved
                    ? `${badge.tickColor} text-white scale-110 animate-pulse`
                    : "bg-gray-200 text-gray-400"
                  }`}
              >
                <Check className="w-7 h-7" />
              </div>

              <div className="flex-1">
                <p className="font-medium text-2xl">{badge.title}</p>
                <p className="text-sm text-gray-600 mb-2">{badge.desc}</p>

                <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                  <div
                    className={`h-2 rounded-full ${badge.progressColor} transition-all duration-500`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>


                <p className="text-xs text-gray-600">
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