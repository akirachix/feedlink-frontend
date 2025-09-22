"use client";
import { useState } from "react";
import useFetchOrders, { OrderType } from "../hooks/useFetchOrders";
import useFetchUsers from "../hooks/useFetchUsers";
import useFetchListings from "../hooks/useFetchListing";

export default function Orders() {
  const {
    orders,
    loading: ordersLoading,
    error: ordersError,
  } = useFetchOrders();
  const { users, loading: usersLoading, error: usersError } = useFetchUsers();
  const {
    listings,
    loading: listingsLoading,
    error: listingsError,
  } = useFetchListings();

  const loading = ordersLoading || usersLoading || listingsLoading;
  const error = ordersError || usersError || listingsError;

  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "pending" | "picked"
  >("all");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const totalCustomers = new Set(orders.map((order) => order.user)).size;
  const totalOrders = orders.length;

  const filteredOrders = orders.filter((order) => {
    const statusMatch =
      selectedStatus === "all" ? true : order.order_status === selectedStatus;

    const dateMatch = selectedDate
      ? order.order_date.startsWith(selectedDate)
      : true;

    const searchMatch =
      searchTerm === ""
        ? true
        : (users[order.user] ?? "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.order_id.toString().includes(searchTerm);

    return statusMatch && dateMatch && searchMatch;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">


      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Orders</h1>
        <p className="text-gray-600 mb-6">Track the orders made</p>

        <div className="flex gap-2 mb-6">
          <div className="bg-green-200 p-3 rounded-lg shadow-sm w-48 flex flex-col justify-between h-32">
            <h3 className="text-lg font-semibold text-green-800">
              Total customers
            </h3>
            <p className="text-2xl font-bold text-green-700">
              {totalCustomers}
            </p>
            <p className="text-xs text-gray-600">this month</p>
          </div>
          <div className="bg-green-200 p-3 rounded-lg shadow-sm w-48 flex flex-col justify-between h-32">
            <h3 className="text-lg font-semibold text-green-800">
              Total orders
            </h3>
            <p className="text-2xl font-bold text-green-700">{totalOrders}</p>
            <p className="text-xs text-gray-600">this month</p>
          </div>
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex items-center gap-6">
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
                      ? "bg-green-600 border-green-600"
                      : "border-gray-400"
                  }`}
                >
                  {selectedStatus === status && (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="ml-2 capitalize text-green-700 font-medium">
                  {status}
                </span>
              </label>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-xs">
              <input
                type="text"
                placeholder="Search by user or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500 absolute left-3 top-2.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-green-300">
          <table className="w-full table-auto">
            <thead className="bg-green-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-green-700 border-r border-gray-200">
                  Buyer
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-green-700 border-r border-gray-200">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-green-700 border-r border-gray-200">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-green-700 border-r border-gray-200">
                  Order date
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-green-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-4 text-center text-red-500"
                  >
                    {error}
                  </td>
                </tr>
              ) : paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => (
                  <tr key={order.order_id} className="border-t border-gray-200">
                    <td className="px-4 py-3 border-r border-gray-200">
                      {users[order.user] ?? `User ${order.user}`}
                    </td>
                    <td className="px-4 py-3 border-r border-gray-200">
                      {order.items?.[0]?.listing
                        ? listings[order.items[0].listing] || "Unknown"
                        : "No Item"}
                    </td>
                    <td className="px-4 py-3 border-r border-gray-200">
                      {order.total_amount}
                    </td>
                    <td className="px-4 py-3 border-r border-gray-200">
                      {new Date(order.order_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-md ${
                          order.order_status === "picked"
                            ? "bg-green-600 text-white"
                            : "bg-orange-500 text-white"
                        }`}
                      >
                        {order.order_status.charAt(0).toUpperCase() +
                          order.order_status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            ></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            ></button>
          </div>
        )}
      </main>
    </div>
  );
}
