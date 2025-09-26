"use client";
import { useState} from "react";
import useFetchWasteclaims from "../hooks/useFetchWasteclaims";
import useFetchUsers from "../hooks/useFetchUsers";
import Sidebar from "../shared-components/Sidebar";
import useFetchListings from "../hooks/useFetchListing";
import { FiSearch } from "react-icons/fi";
import Pagination from "../component/Pagination";
import Calendar from "../component/Calendar";

export default function WasteClaims() {
  const { wasteClaims, loading: wasteLoading, error: wasteError,} = useFetchWasteclaims();
  const { users, loading: usersLoading, error: usersError } = useFetchUsers();
  const {listings,loading: listingsLoading, error: listingsError,} = useFetchListings();

  const loading = wasteLoading || usersLoading || listingsLoading;
  const error = wasteError || usersError || listingsError;

  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const totalRecyclers = new Set(wasteClaims.map((claim) => claim.user)).size;

  function getQuantity(qty: string): number {
    if (!qty) return 0;
    const cleaned = qty.replace(/[^\d.]/g, "");
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }

  const totalClaimedKg = wasteClaims.reduce((sum, claim) => {
    const qty = listings[claim.listing_id]?.quantity;
    return sum + getQuantity(qty);
  }, 0);

  const filteredClaims = wasteClaims.filter((claim) => {
    const statusMatch =
      selectedStatus === "all" ? true : claim.claim_status === selectedStatus;
    const dateMatch = selectedDate
      ? new Date(claim.claim_time).toDateString() ===
        selectedDate.toDateString()
      : true;
    const searchMatch =
      searchTerm === ""
        ? true
        : users[claim.user].toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && dateMatch && searchMatch;
  });

  const totalPages = Math.ceil(filteredClaims.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClaims = filteredClaims.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-3xl font-bold text-[var(--primary-color)] mb-4">
          Waste Claims
        </h1>
        <p className="mb-6 text-[15px]" >Track food waste claimed by recyclers</p>

        <div className="flex gap-18 mb-10">
          <div className="bg-[#9FB68E] p-3 rounded-lg shadow-sm w-73 flex flex-col justify-between h-28">
            <h3 className="text-3xl font-semibold">Total claimed</h3>
            <p className="text-3xl font-bold text-[var(--primary-color)]">
              {totalClaimedKg.toFixed(1)} kg
            </p>
          </div>
          <div className="bg-[#9FB68E] p-3 rounded-lg shadow-sm w-73 flex flex-col justify-between h-28">
            <h3 className="text-3xl font-semibold">Total recyclers</h3>
            <p className="text-3xl font-bold text-[var(--primary-color)]">
              {totalRecyclers}
            </p>
          </div>
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-24">
            {["all", "pending", "collected"].map((status) => (
              <label key={status} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value={status}
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
                ></div>
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
                placeholder="Search..."
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

        <div className="overflow-x-auto rounded-lg shadow-sm border border-[var(--primary-color)]">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-4 text-left text-xl font-bold text-[var(--primary-color)] border-r border-gray-400">
                  Recycler
                </th>
                <th className="px-4 py-4 text-left text-xl font-bold text-[var(--primary-color)] border-r border-gray-400">
                  Quantity
                </th>
                <th className="px-4 py-4 text-left text-xl font-bold text-[var(--primary-color)] border-r border-gray-400">
                  Claim date
                </th>
                <th className="px-4 py-4 text-left text-xl font-bold text-[var(--primary-color)]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-4 text-center text-red-500"
                  >
                    {error}
                  </td>
                </tr>
              ) : paginatedClaims.length > 0 ? (
                paginatedClaims.map((claim) => (
                  <tr key={claim.waste_id} className="border-t border-gray-400">
                    <td className="px-4 py-4 border-r border-gray-400">
                      {users[claim.user]}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-400">
                      {listings[claim.listing_id]?.quantity || "Unknown"} Kgs
                    </td>
                    <td className="px-4 py-4 border-r border-gray-400">
                      {new Date(claim.claim_time).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-md capitalize ${
                          claim.claim_status === "collected"
                            ? "bg-[var(--primary-color)] text-white"
                            : "bg-[var(--secondary-color)] text-white"
                        }`}
                      >
                        {claim.claim_status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    No waste claims found
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
