import React from "react";
import { Listing } from "../../../utils/types";

interface Props {
  selectedItem: Listing;
  editError: string | null;
  editLoading: boolean;
  handleDetailChange: <K extends keyof Listing>(field: K, value: Listing[K]) => void;
  handleUpdate: () => Promise<void>;
  openDeleteConfirmModal: () => void;
  closeDetailModal: () => void;
}

const InventoryDetailForm = ({
  selectedItem,
  editError,
  editLoading,
  handleDetailChange,
  handleUpdate,
  openDeleteConfirmModal,
  closeDetailModal,
}: Props) => {
  return (
    <div className="p-6 bg-white rounded shadow-lg max-w-lg mx-auto ">
      <h2 className="text-2xl font-bold mb-4 text-234B06">
        Edit Item Details
      </h2>

      {editError && (
        <p className="text-red-600 mb-4 border border-red-600 p-2 rounded">{editError}</p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate();
        }}
        className="space-y-4"
      >
        <div>
          <label className="block font-semibold text-[#234B06] mb-1">Product Type</label>
          <select
            value={selectedItem.product_type}
            onChange={(e) => handleDetailChange("product_type", e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 cursor-pointer"
            required
          >
            <option value="edible">Edible</option>
            <option value="inedible">Inedible</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-[#234B06] mb-1">Quantity</label>
          <input
            type="number"
            min="0"
            value={selectedItem.quantity}
            onChange={(e) => handleDetailChange("quantity", e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-[#234B06] mb-1">Category</label>
          <input
            type="text"
            value={selectedItem.category}
            onChange={(e) => handleDetailChange("category", e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold text-[#234B06] mb-1">Expiry Date</label>
          <p className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 select-none cursor-not-allowed">
            {selectedItem.expiry_date
              ? new Date(selectedItem.expiry_date).toLocaleDateString()
              : "—"}
          </p>
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={closeDetailModal}
            className="cursor-pointer bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            disabled={editLoading}
          >
            Cancel
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={openDeleteConfirmModal}
              className="cursor-pointer bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              disabled={editLoading}
            >
              Delete
            </button>
            <button
              type="submit"
              className="cursor-pointer bg-[#234B06] text-white px-4 py-2 rounded hover:bg-[#1f4105]"
              disabled={editLoading}
            >
              {editLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InventoryDetailForm;