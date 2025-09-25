"use client";
import { useState } from "react";
import useFetchUsers from "../hooks/useFetchUsers";
import useFetchListings from "../hooks/useFetchListing";
import Sidebar from "../shared-components/Sidebar";
import { FiSearch } from "react-icons/fi";
import Pagination from "../component/Pagination";
import Calendar from "../component/Calendar";
import useFetchOrders from "../hooks/useFetchOrders";

export default function Orders() {
  const { orders, loading: ordersLoading, error: ordersError } = useFetchOrders();
  const { users, loading: usersLoading, error: usersError } = useFetchUsers();
  const { listings, loading: listingsLoading, error: listingsError } = useFetchListings();

  const loading = ordersLoading || usersLoading || listingsLoading;
  const error = ordersError || usersError || listingsError;

  const [selectedStatus, setSelectedStatus] = useState<"all" | "pending" | "picked">("all");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const totalCustomers = new Set(orders.map((order) => order.user)).size;
  const totalOrders = orders.length;

  const filteredOrders = orders.filter((order) => {
    const statusMatch = selectedStatus === "all" ? true : order.order_status === selectedStatus;
    const dateMatch = selectedDate ? new Date(order.order_date).toDateString() === selectedDate.toDateString(): true;
    const searchMatch = searchTerm === "" ? true : (users[order.user] ?? "").toLowerCase().includes(searchTerm.toLowerCase());

    return statusMatch && dateMatch && searchMatch;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-3xl font-bold text-[var(--primary-color)] mb-4">
          Orders
        </h1>
        <p className="mb-6 text-[15px]">Track the orders made</p>

        <div className="flex gap-18 mb-10">
          <div className="bg-[#9FB68E] p-3 rounded-lg shadow-sm w-73 flex flex-col justify-between h-28">
            <h3 className="text-3xl font-semibold">Total customers</h3>
            <p className="text-3xl font-bold text-[var(--primary-color)]">
              {totalCustomers}
            </p>
          </div>
          <div className="bg-[#9FB68E] p-3 rounded-lg shadow-sm w-73 flex flex-col justify-between h-28">
            <h3 className="text-3xl font-semibold">Total orders</h3>
            <p className="text-3xl font-bold text-[var(--primary-color)]">
              {totalOrders}
            </p>
          </div>
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-24 ">
            {["all", "pending", "picked"].map((status) => (
              <label key={status} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value={status}
                  checked={selectedStatus === status}
                  onChange={() => setSelectedStatus(status as any)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-colors ${
                    selectedStatus === status
                      ? "bg-[var(--primary-color)] border-[var(--primary-color)]"
                      : "border-[var(--primary-color)]"
                  }`} >
                </div>
                <span className="ml-2 capitalize text-[var(--primary-color)] font-bold text-xl">
                  {status}
                </span>
              </label>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-xs">
              <input
                type="text"
                placeholder="Search by user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              />
              <FiSearch className="h-5 w-5 text-[#7a8f70] absolute left-3 top-2.5" />
            </div>

            <Calendar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-sm border border-[var(--primary-color)]">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xl font-bold text-[var(--primary-color)] border-r border-gray-400">
                  Buyer
                </th>
                <th className="px-4 py-3 text-left text-xl font-bold text-[var(--primary-color)] border-r border-gray-400">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xl font-bold text-[var(--primary-color)] border-r border-gray-400">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xl font-bold text-[var(--primary-color)] border-r border-gray-400">
                  Order date
                </th>
                <th className="px-4 py-3 text-left text-xl font-bold text-[var(--primary-color)]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => (
                  <tr key={order.order_id} className="border-t border-gray-400">
                    <td className="px-4 py-4 border-r border-gray-400">
                      {users[order.user]}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-400">
                      {order.items?.[0]?.listing
                        ? listings[order.items[0].listing]?.category
                        : "No Item"}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-400">
                      {order.total_amount} KSH
                    </td>
                    <td className="px-4 py-4 border-r border-gray-400">
                      {new Date(order.order_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-md capitalize ${
                          order.order_status === "picked"
                            ? "bg-[var(--primary-color)] text-white"
                            : "bg-[var(--secondary-color)] text-white"
                        }`} >
                        {order.order_status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>
    </div>
  );
}