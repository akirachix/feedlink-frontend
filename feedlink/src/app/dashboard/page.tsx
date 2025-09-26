"use client";

import { useState, useEffect } from 'react';
import Sidebar from "../shared-components/Sidebar";
import MetricCard from "./components/Cards";
import Chart from "./components/Impacts";
import Badges from "./components/Badges";
import { useOrders } from "../hooks/useFetchOrders";
import { useWasteClaims } from "../hooks/useFetchClaims";
import { useListings } from "../hooks/useFetchListings";
import { User } from "../utils/type";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const { orders, loading: ordersLoading } = useOrders();
  const { wasteClaims, loading: wasteClaimsLoading } = useWasteClaims();
  const { listings, loading: listingsLoading } = useListings();
  const loading = ordersLoading || wasteClaimsLoading || listingsLoading;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser) as User;
          if (parsedUser.email && parsedUser.role) {
            setUser(parsedUser);
          }
        } catch (e) {
          console.error("Failed to parse user from localStorage:", e);
        }
      }
    }
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }
  if (!orders || !wasteClaims || !listings) {
    return null;
  }
  const displayName = user?.first_name
    ? `${user.first_name} ${user.last_name || ''}`.trim()
    : "there";

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto
                       px-4 py-6
                       md:px-8 md:py-8
                       lg:px-12 lg:py-10
                       xl:px-16 xl:py-12 max-w-full">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--primary-color)] mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 mb-8 text-base md:text-lg">
          Welcome back, <span className="font-semibold">{displayName}</span>!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-10 max-w-full">
          <MetricCard
            title="Total food diverted (KGS)"
            orders={orders}
            wasteClaims={wasteClaims}
            listings={listings}
            trend="Every kg feeds hope"
            isFirst={true}
          />
          <MetricCard
            title="Revenue recovered (KSH)"
            orders={orders}
            wasteClaims={wasteClaims}
            listings={listings}
            trend="Funding sustainability"
            isFirst={false}
          />
          <MetricCard
            title="Carbon emissions saved (T)"
            orders={orders}
            wasteClaims={wasteClaims}
            listings={listings}
            trend="Cooling the planet"
            isFirst={false}
          />
          <MetricCard
            title="Recycling partners"
            orders={orders}
            wasteClaims={wasteClaims}
            listings={listings}
            trend="Growing green network"
            isFirst={false}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 max-w-full">
          <div className="mt-5">
            <Chart orders={orders} />
          </div>
          <div className="mt-5">
            <Badges
              orders={orders}
              wasteClaims={wasteClaims}
              listings={listings}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
