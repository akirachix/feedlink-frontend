import React from "react";
import { Listing } from "../../../utils/types";
import { capitalizeFirstLetter } from "../../../utils/utils";

interface Props {
  loading: boolean;
  listings: Listing[];
  openDetailModal: (item: Listing) => void;
  error: string | null;
}

const InventoryTable = ({ loading, error, listings, openDetailModal }: Props) => {
  
  const sortedListings = React.useMemo(() => {
    if (!listings || listings.length === 0) return [];
    return [...listings].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA; 
    });
  }, [listings]);

  return (
    <div className="font-nunito overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead style={{ backgroundColor: "#FF8614", color: "white" }}>
          <tr>
            <th className="px-4 py-2 text-left text-lg font-semibold border-r border-gray-300">Item</th>
            <th className="px-4 py-2 text-left text-lg font-semibold border-r border-gray-300">Quantity</th>
            <th className="px-4 py-2 text-left text-lg font-semibold border-r border-gray-300">Category</th>
            <th className="px-4 py-2 text-left text-lg font-semibold border-r border-gray-300">Expiry</th>
            <th className="px-4 py-2 text-left text-lg font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {loading && (
            <tr>
              <td colSpan={5} className="text-center py-6 text-gray-500">
                Loading...
              </td>
            </tr>
          )}
          {error && (
            <tr>
              <td colSpan={5} className="text-center py-6 text-red-600">
                Failed to load listings.
              </td>
            </tr>
          )}
          {!loading && !error && sortedListings.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-6 text-gray-500">
                No items found.
              </td>
            </tr>
          )}
          {!loading &&
            !error &&
            sortedListings.map((item) => (
              <tr
                key={item.listing_id}
                className="hover:bg-[#f0f5eb] border-b border-gray-200 cursor-pointer"
                onClick={() => openDetailModal(item)}
              >
                <td className="px-4 py-2 border-r border-gray-200">
                  {capitalizeFirstLetter(item.product_type)}
                </td>
                <td className="px-4 py-2 border-r border-gray-200">{item.quantity}</td>
                <td className="px-4 py-2 border-r border-gray-200">
                  {capitalizeFirstLetter(item.category)}
                </td>
                <td className="px-4 py-2 border-r border-gray-200">
                  {item.expiry_date && !isNaN(new Date(item.expiry_date).getTime())
                    ? new Date(item.expiry_date).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      item.status === "available"
                        ? "bg-[#234B06] text-white"
                        : "bg-[#FF8614] text-white"
                    }`}
                  >
                    {item.status ? capitalizeFirstLetter(item.status) : ""}
                  </span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;