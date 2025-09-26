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
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 px-1 py-2 sm:px-2 sm:py-3 md:px-4 md:py-5 lg:px-8 lg:py-8 xl:px-10 xl:py-10 2xl:px-20 2xl:py-16 overflow-y-auto">
        <h1 className="text-base sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-[var(--primary-color)] mb-1 sm:mb-2">Dashboard Overview</h1>
        <p className="text-gray-600 mb-3 sm:mb-5 md:mb-6 lg:mb-8 text-xs sm:text-sm md:text-base xl:text-lg">Welcome Back !!!</p>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-gray-600">Loading dashboard...</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 lg:gap-7 xl:gap-8 2xl:gap-10 mb-3 sm:mb-6 lg:mb-10">
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
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-5 lg:gap-7 xl:gap-8">
              <div>
                <Chart orders={orders} />
              </div>
              <div>
                <Badges
                  orders={orders}
                  wasteClaims={wasteClaims}
                  listings={listings}
                />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}





