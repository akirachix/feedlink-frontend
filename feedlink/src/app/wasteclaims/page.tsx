"use client";
import { useState, useRef, useEffect } from "react";
import useFetchWasteclaims from "../hooks/useFetchWasteclaims";
import useFetchUsers from "../hooks/useFetchUsers";
import Sidebar from "../shared-components/Sidebar";
import useFetchListings from "../hooks/useFetchListing";
import { FiSearch, FiX} from "react-icons/fi";
import Pagination from "../component/Pagination";
import Calendar from "../component/Calendar";
import { WasteClaimType } from "../utils/type"; 

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
    if (status === "collected") {
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
                option.value === "collected" 
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

const WasteClaims = () => {
  const { wasteClaims, loading: wasteLoading, error: wasteError, updateClaimStatus } = useFetchWasteclaims(); 
  const { users, loading: usersLoading, error: usersError } = useFetchUsers();
  const { listings, loading: listingsLoading, error: listingsError } = useFetchListings();

  const loading = wasteLoading || usersLoading || listingsLoading;
  const error = wasteError || usersError || listingsError;

  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClaim, setSelectedClaim] = useState<WasteClaimType | null>(null); 
  const [isPopupOpen, setIsPopupOpen] = useState(false); 

  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const sortedWasteClaims = [...wasteClaims].sort((a, b) => 
    new Date(b.claim_time).getTime() - new Date(a.claim_time).getTime()
  );

  const totalRecyclers = new Set(sortedWasteClaims.map((claim) => claim.user)).size;

  function getQuantity(qty: string): number {
    if (!qty) return 0;
    const cleaned = qty.replace(/[^\d.]/g, "");
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }

  const totalClaimedKg = sortedWasteClaims.reduce((sum, claim) => {
    const qty = listings[claim.listing_id]?.quantity;
    return sum + getQuantity(qty);
  }, 0);

  const filteredClaims = sortedWasteClaims.filter((claim) => {
    const statusMatch =
      selectedStatus === "all" ? true : claim.claim_status === selectedStatus;
    const dateMatch = selectedDate
      ? new Date(claim.claim_time).toDateString() ===
        selectedDate.toDateString()
      : true;
    const searchMatch =
      searchTerm === ""
        ? true
        : users[claim.user]?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
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

  const handleStatusChange = async (wasteId: number, newStatus: "pending" | "collected") => {
    try {
      await updateClaimStatus(wasteId, newStatus);
    } catch (err) {
      console.error("Failed to update claim status:", err);
      alert("Failed to update status: " + (err as Error).message);
    }
  };

  const openDetailsPopup = (claim: WasteClaimType) => {
    setSelectedClaim(claim);
    setIsPopupOpen(true);
  };

  const closeDetailsPopup = () => {
    setIsPopupOpen(false);
    setSelectedClaim(null);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />

      <main className="flex-1 h-full p-6 overflow-auto">
        <h1 className="text-3xl font-bold text-[var(--primary-color)] mb-4">
          Waste Claims
        </h1>
        <p className="mb-6 text-[15px]">Track food waste claimed by recyclers</p>

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
                  Pin
                </th>
                <th className="px-4 py-4 text-left text-xl font-bold text-[var(--primary-color)] border-r border-gray-400">
                  Quantity
                </th>
                <th className="px-4 py-4 text-left text-xl font-bold text-[var(--primary-color)] border-r border-gray-400">
                  Claim date
                </th>
                <th className="px-4 py-4 text-left text-xl font-bold text-[var(--primary-color)] border-r border-gray-400">
                  Status
                </th>
                <th className="px-4 py-4 text-left text-xl font-bold text-[var(--primary-color)]">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-4 py-4 text-center text-red-500">
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
                      {claim.pin || "N/A"} 
                    </td>
                    <td className="px-4 py-4 border-r border-gray-400">
                      {listings[claim.listing_id]?.quantity || "Unknown"} Kgs
                    </td>
                    <td className="px-4 py-4 border-r border-gray-400">
                      {new Date(claim.claim_time).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-400">
                      <CustomSelect
                        value={claim.claim_status}
                        onChange={(newValue) => handleStatusChange(claim.waste_id, newValue as "pending" | "collected")}
                        options={[
                          { value: "pending", label: "Pending" },
                          { value: "collected", label: "Collected" }
                        ]}
                        status={claim.claim_status}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => openDetailsPopup(claim)}
                        className="px-3 py-1 bg-[var(--primary-color)] text-white text-xs font-semibold rounded-md"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
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

      {isPopupOpen && selectedClaim && (
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
                Claim Details - #{selectedClaim.waste_id}
              </h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="font-semibold">Recycler:</p>
                  <p>{users[selectedClaim.user]}</p>
                </div>
                <div>
                  <p className="font-semibold">Pin:</p>
                  <p>{selectedClaim.pin || "N/A"}</p>
                </div>
                <div>
                  <p className="font-semibold">Listing ID:</p>
                  <p>{selectedClaim.listing_id}</p>
                </div>
                <div>
                  <p className="font-semibold">Claim Date:</p>
                  <p>{new Date(selectedClaim.claim_time).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-semibold">Status:</p>
                  <p className="capitalize">{selectedClaim.claim_status}</p>
                </div>
                <div>
                  <p className="font-semibold">Quantity:</p>
                  <p>{listings[selectedClaim.listing_id]?.quantity || "Unknown"} Kgs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WasteClaims;