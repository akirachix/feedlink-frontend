
"use client";
import { useState, useRef, useEffect } from "react";
import useFetchUsers from "../hooks/useFetchUsers";
import useFetchListings from "../hooks/useFetchListing";
import Sidebar from "../shared-components/Sidebar";
import { FiSearch, FiX} from "react-icons/fi";
import Pagination from "../component/Pagination";
import Calendar from "../component/Calendar";
import { useOrders } from "../hooks/useFetchOrders";
import {  OrderType } from "../utils/type";

const CustomSelect: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  status?: string;
}> = ({ value, onChange, options, status }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLabel = options.find(opt => opt.value === value)?.label || value;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getStyleClasses = () => {
    if (status === "picked") {
      return "bg-[var(--primary-color)] text-white border-[var(--primary-color)]"; 
    } else if (status === "pending") {
      return "bg-[var(--secondary-color)] text-white border-[var(--secondary-color)]"; 
    }
    return "bg-white text-black border-gray-300"; 
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`font-nunito border rounded px-3 py-1 cursor-pointer flex items-center justify-between min-w-[120px] ${getStyleClasses()}`}
      >
        <span className="capitalize">{currentLabel}</span>
        <span className="text-gray-500 text-xs">▼</span>
      </div>

      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 border border-gray-300 rounded bg-white max-h-48 overflow-y-auto shadow-lg">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`px-3 py-1 cursor-pointer capitalize ${
                option.value === "picked" 
                  ? "hover:bg-[var(--primary-color)] hover:text-white" 
                  : option.value === "pending" 
                    ? "hover:bg-[var(--secondary-color)] hover:text-white" 
                    : "hover:bg-gray-100"
              }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default function Orders() {
  const { orders, loading: ordersLoading, error: ordersError, updateOrderStatus } = useOrders();
  const { users, loading: usersLoading, error: usersError } = useFetchUsers();
  const {loading: listingsLoading, error: listingsError } = useFetchListings();
  const loading = ordersLoading || usersLoading || listingsLoading;
  const error = ordersError || usersError || listingsError;
  const [selectedStatus, setSelectedStatus] = useState<"all" | "pending" | "picked">("all");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const sortedOrders = [...orders].sort((a, b) => 
    new Date(b.order_date).getTime() - new Date(a.order_date).getTime()
  );

  const totalCustomers = new Set(sortedOrders.map((order) => order.user)).size;
  const totalOrders = sortedOrders.length;

  const filteredOrders = sortedOrders.filter((order) => {
    const statusMatch = selectedStatus === "all" ? true : order.order_status === selectedStatus;
    const dateMatch = selectedDate ? new Date(order.order_date).toDateString() === selectedDate.toDateString() : true;
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

  const handleStatusChange = async (orderId: number, newStatus: "pending" | "picked") => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (err) {
      console.error("Failed to update order status:", err);
      alert("Failed to update status: " + (err as Error).message);
    }
  };

  const openDetailsPopup = (order: OrderType) => {
    setSelectedOrder(order);
    setIsPopupOpen(true);
  };

  const closeDetailsPopup = () => {
    setIsPopupOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />
      <main className="flex-1 h-full p-6 overflow-auto">
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
          <div className="flex items-center gap-24">
            {(["all", "pending", "picked"] as const).map((status) => (
              <label key={status} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={selectedStatus === status}
                  onChange={() => setSelectedStatus(status)} 
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-colors ${
                    selectedStatus === status
                      ? "bg-[var(--primary-color)] border-[var(--primary-color)]"
                      : "border-[var(--primary-color)]"
                  }`}
                >
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
              <FiSearch className="h-5 w-5 text-[#7A8F70] absolute left-3 top-2.5" />
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
                  Pin
                </th>
                <th className="px-4 py-3 text-left text-xl font-bold text-[var(--primary-color)] border-r border-gray-400">
                  Order date
                </th>
                <th className="px-4 py-3 text-left text-xl font-bold text-[var(--primary-color)] border-r border-gray-400">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xl font-bold text-[var(--primary-color)]">
                  Details
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
                      {order.pin || "N/A"}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-400">
                      {new Date(order.order_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-400">
                      <CustomSelect
                        value={order.order_status}
                        onChange={(newValue) => handleStatusChange(order.order_id, newValue as "pending" | "picked")}
                        options={[
                          { value: "pending", label: "Pending" },
                          { value: "picked", label: "Picked" }
                        ]}
                        status={order.order_status}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => openDetailsPopup(order)}
                        className="px-3 py-1 bg-[var(--primary-color)] text-white text-xs font-semibold rounded-md"
                      >
                        View
                      </button>
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

      {isPopupOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-2xl max-h-[80vh] overflow-auto relative">
            <button
              onClick={closeDetailsPopup}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-[var(--primary-color)] mb-4">
                Order Details - #{selectedOrder.order_id}
              </h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="font-semibold">Buyer:</p>
                  <p>{users[selectedOrder.user]}</p>
                </div>
                <div>
                  <p className="font-semibold">Pin:</p>
                  <p>{selectedOrder.pin}</p>
                </div>
                <div>
                  <p className="font-semibold">Order Date:</p>
                  <p>{new Date(selectedOrder.order_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-semibold">Total Amount:</p>
                  <p>{selectedOrder.total_amount} KSH</p>
                </div>
                <div>
                  <p className="font-semibold">Status:</p>
                  <p className="capitalize">{selectedOrder.order_status}</p>
                </div>
                <div>
                  <p className="font-semibold">Payment Status:</p>
                  <p className="capitalize">{selectedOrder.payment_status}</p>
                </div>
              </div>

             
            </div>
          </div>
        </div>
      )}
    </div>
  );
}