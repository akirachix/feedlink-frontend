import React from "react";
import AddItem from "../AddItem";
import Csv from "../Csv";
import InventoryDetailForm from "../InventoryDetailForm";
import { Listing } from "../../../utils/types";

interface Props {
  modalContent: string | null;
  closeModal: () => void;
  setModalContent: (content: string | null) => void;
  openModal: () => void; 
  selectedItem: Listing | null;
  editError: string | null;
  editLoading: boolean;
  handleDetailChange: (field: keyof Listing, value: Listing[keyof Listing]) => void;
  handleUpdate: () => Promise<void>;
  confirmDelete: () => Promise<void>; 
  refresh: () => Promise<void>;
  onSuccess?: (message: string) => void;
}

const InventoryModals = ({
  modalContent,
  closeModal,
  setModalContent,
  openModal,
  selectedItem,
  editError,
  editLoading,
  handleDetailChange,
  handleUpdate,
  confirmDelete,
  refresh,
  onSuccess, 
}: Props) => {
  switch (modalContent) {
    case "uploadMethod":
      return (
        <div className="p-6 bg-white rounded shadow-lg max-w-sm mx-auto text-center">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#234B06' }} >
            Choose upload method
          </h2>
          <div className="flex justify-center gap-6">
            <button
              onClick={() => setModalContent("manual")}
              className="cursor-pointer bg-[#234B06] text-white px-4 py-2 rounded hover:bg-[#1f4105]"
            >
              Manually
            </button>
            <button
              onClick={() => setModalContent("csv")}
              className="cursor-pointer bg-[#234B06] text-white px-4 py-2 rounded hover:bg-[#1f4105]"
            >
              CSV file
            </button>
          </div>
          <button
            onClick={closeModal}
            className="cursor-pointer mt-6 text-sm underline "
            style={{ color: '#FF8614' }}
          >
            Cancel
          </button>
        </div>
      );

    case "manual":
      return (
        <div className="p-6 bg-white rounded shadow-lg max-w-lg mx-auto">
          <AddItem
            onSuccess={() => {
              onSuccess?.("Product uploaded successfully!"); 
              closeModal();
              refresh();
            }}
            onCancel={closeModal}
          />
        </div>
      );

    case "csv":
      return (
        <div className="p-6 bg-white rounded shadow-lg max-w-lg mx-auto">
          <Csv
            onSuccess={() => {
              onSuccess?.("Products uploaded successfully via CSV!"); 
              closeModal();
              refresh();
            }}
            onCancel={closeModal}
          />
        </div>
      );

    case "detail":
      if (!selectedItem) return null;
      return (
        <InventoryDetailForm
          selectedItem={selectedItem}
          editError={editError}
          editLoading={editLoading}
          handleDetailChange={handleDetailChange}
          handleUpdate={handleUpdate}
          openDeleteConfirmModal={() => {
            setModalContent("confirmDelete");
            openModal(); 
          }}
          closeDetailModal={closeModal}
        />
      );

      case "confirmDelete":
        return (
          <div className="p-6 bg-white rounded-lg shadow-lg max-w-md">
            <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete &#39;<strong>{selectedItem?.product_type}</strong>&#39;? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete} 
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                disabled={editLoading}
              >
                {editLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        );

    default:
      return null;
  }
};

export default InventoryModals;