"use client";

import Sidebar from "../shared-components/Sidebar";
import MetricCard from "./components/Cards";
import Chart from "./components/Impacts";
import Badges from "./components/Badges";
import { useOrders } from "../hooks/useFetchOrders";
import { useWasteClaims } from "../hooks/useFetchClaims";
import { useListings } from "../hooks/useFetchListings";

export default function Dashboard() {
  const { orders, loading: ordersLoading } = useOrders();
  const { wasteClaims, loading: wasteClaimsLoading } = useWasteClaims();
  const { listings, loading: listingsLoading } = useListings();

  const loading = ordersLoading || wasteClaimsLoading || listingsLoading;

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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-[var(--primary-color)] mb-2">Dashboard Overview</h1>
        <p className="text-gray-600 mb-8">Welcome Back !!!</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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