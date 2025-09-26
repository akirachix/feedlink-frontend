'use client';
import React, { useState, useEffect, useMemo } from 'react';
import InventorySummary from './components/InventorySummary';
import InventoryFilters from './components/InventoryFilters';
import InventoryTable from './components/InventoryTable';
import InventoryModals from './components/InventoryModals';
import InventoryPagination from './components/InventoryPagination';
import useInventory from '../hooks/useFetchInventory';
import useModal from '../hooks/useFetchModal';
import { Listing } from '../utils/types';
import Sidebar from '../shared-components/Sidebar';
import { isExpired, isExpiringSoon } from '../utils/utils';

const baseUrl = "/api/listings/";

const InventoryPage = () => {
  const { listings, loading, error, refresh } = useInventory();
  const { modalOpen, modalContent, openModal, closeModal, setModalContent } = useModal();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [uploadDateFilter, setUploadDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedItem, setSelectedItem] = useState<Listing | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const listingsWithStatus = useMemo<Listing[]>(() => {
    return listings.map((item) => {
      const expired = item.expiry_date ? isExpired(item.expiry_date) : false;
      return {
        ...item,
        status: expired ? "expired" : "available",
      };
    }).sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA; 
    });
  }, [listings]);

  const filteredListings = useMemo<Listing[]>(() => {
    const lowerSearch = searchTerm.trim().toLowerCase();

    return listingsWithStatus
      .filter((item) => {
        if (categoryFilter === "All") return true;
        return item.category === categoryFilter;
      })
      .filter((item) => {
        if (statusFilter === "All") return true;
        return item.status === statusFilter;
      })
      .filter((item) => {
        if (!lowerSearch) return true;
        return item.product_type.toLowerCase().startsWith(lowerSearch);
      })
      .filter((item) => {
        if (!uploadDateFilter) return true;
        const itemCreatedDate = item.created_at ? item.created_at.substring(0, 10) : "";
        return itemCreatedDate === uploadDateFilter;
      });
  }, [listingsWithStatus, categoryFilter, statusFilter, searchTerm, uploadDateFilter]);

  const pageCount = Math.ceil(filteredListings.length / itemsPerPage);
  const paginatedListings = filteredListings.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const totalItems = listings.length;
  const expiringSoonCount = listingsWithStatus.filter(
    (item) => item.expiry_date && !isExpired(item.expiry_date) && isExpiringSoon(item.expiry_date)
  ).length;
  const expiredCount = listingsWithStatus.filter((item) => item.status === "expired").length;

  const categoryOptions = useMemo(() => {
    const cats = new Set<string>();
    listings.forEach((item) => {
      if (item.category && item.category !== "") {
        cats.add(item.category);
      }
    });
    return ["All", ...Array.from(cats)];
  }, [listings]);

  const handleUploadClick = () => {
    setModalContent("uploadMethod");
    openModal();
  };

  const openDetailModal = (item: Listing) => {
    setSelectedItem(item);
    setEditError(null);
    openModal();
    setModalContent("detail");
  };

  const closeDetailModal = () => {
    setSelectedItem(null);
    setEditError(null);
    closeModal();
  };

  const handleDetailChange = <K extends keyof Listing>(
    field: K,
    value: Listing[K]
  ) => {
    if (!selectedItem) return;
    setSelectedItem({ ...selectedItem, [field]: value });
  };
  const handleUpdate = async () => {
    if (!selectedItem) return;
    setEditLoading(true);
    setEditError(null);

    try {
      const expiryDateISO = selectedItem.expiry_date
        ? new Date(selectedItem.expiry_date).toISOString()
        : null;

      const pickupWindowISO = selectedItem.pickup_window_duration
        ? new Date(selectedItem.pickup_window_duration).toISOString()
        : null;

      const body = {
        id: selectedItem.listing_id,
        product_type: selectedItem.product_type,
        quantity: Number(selectedItem.quantity),
        category: selectedItem.category || "",
        expiry_date: expiryDateISO,
        upload_method: selectedItem.upload_method,
        pickup_window_duration: pickupWindowISO,
        unit: selectedItem.unit,
        image_url: selectedItem.image_url || "https://via.placeholder.com/150",
        producer: selectedItem.producer || null,
      };

      const endpoint = `${baseUrl}${selectedItem.listing_id}/`;

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        let errorMsg = `Update failed with status ${response.status}`;
        try {
          const data = await response.json();
          if (data.detail) {
            errorMsg = data.detail;
          } else if (typeof data === "object") {
            errorMsg = Object.entries(data)
              .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(", ") : val}`)
              .join("; ");
          }
        } catch {}
        setEditError(errorMsg);
        setEditLoading(false);
        return;
      }

      await refresh();
      setSuccessMessage("Product updated successfully!");
      closeDetailModal();
    }  catch (err: unknown) {
      console.error('Delete error:', err);
      const message = err instanceof Error 
        ? err.message 
        : 'Unknown error occurred while deleting item';
      setEditError(message);
    } finally {
      setEditLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedItem) {
      setEditError("No item selected for deletion");
      return;
    }

    setEditLoading(true);
    setEditError(null);

    try {
      const endpoint = `${baseUrl}${selectedItem.listing_id}/`;

      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        let errorMsg = `Delete failed with status ${response.status}`;
        try {
          const data = await response.json();
          if (data.detail) {
            errorMsg = data.detail;
          } else if (typeof data === "object") {
            errorMsg = Object.entries(data)
              .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(", ") : val}`)
              .join("; ");
          }
        } catch (jsonError) {
          console.error('Error parsing JSON:', jsonError);
        }
        throw new Error(errorMsg);
      }

      await refresh();
      setSuccessMessage("Product deleted successfully!");
      closeModal();
    }  catch (err: unknown) {
      console.error('Delete error:', err);
      const message = err instanceof Error 
        ? err.message 
        : 'Unknown error occurred while deleting item';
      setEditError(message);
    } finally {
      setEditLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [categoryFilter, statusFilter, searchTerm, uploadDateFilter]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-y-auto p-2">
        <div className="font-nunito max-w-7xl mx-auto">
          <div
            className={modalOpen ? "pointer-events-none select-none" : ""}
            style={
              modalOpen
                ? {
                    filter: "blur(6px)",
                    transition: "filter 0.3s ease",
                    userSelect: "none",
                  }
                : {}
            }
          >
            <h1 className="text-4xl font-bold mb-8 text-[var(--primary-color)] mt-15">
              Inventory Management
            </h1>

            <InventorySummary
              totalItems={totalItems}
              expiringSoonCount={expiringSoonCount}
              expiredCount={expiredCount}
            />

            <InventoryFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              uploadDateFilter={uploadDateFilter}
              setUploadDateFilter={setUploadDateFilter}
              categoryOptions={categoryOptions}
              onUploadClick={handleUploadClick}
            />

            {}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-100 text-green-800 border border-green-300 rounded-lg shadow-md flex items-center justify-between animate-fade-in">
                <span className="font-medium">{successMessage}</span>
                <button
                  onClick={() => setSuccessMessage(null)}
                  className="text-green-600 hover:text-green-800 font-bold"
                >
                  ×
                </button>
              </div>
            )}

            <InventoryTable
              loading={loading}
              error={error}
              listings={paginatedListings}
              openDetailModal={openDetailModal}
            />

            <InventoryPagination page={page} pageCount={pageCount} setPage={setPage} />
          </div>

          {modalOpen && (
            <div
              onClick={closeModal}
              className="fixed inset-0 flex items-center justify-center z-50"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            >
              <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-2xl mx-auto">
                <InventoryModals
                  modalContent={modalContent}
                  closeModal={closeModal}
                  setModalContent={setModalContent}
                  openModal={openModal}
                  selectedItem={selectedItem}
                  editError={editError}
                  editLoading={editLoading}
                  handleDetailChange={handleDetailChange}
                  handleUpdate={handleUpdate}
                  confirmDelete={confirmDelete}
                  refresh={refresh}
                  onSuccess={(message: string) => {
                    closeModal();
                    setSuccessMessage(message);
                    refresh();
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;