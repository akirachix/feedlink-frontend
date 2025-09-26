'use client'
import React, { useState } from "react";
import { useProducers } from "../../../hooks/useFetchProducers";
import { useAddListing } from "../../../hooks/useFetchAddListings";

interface AddItemProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddItem = ({ onSuccess, onCancel }: AddItemProps) => {
  const [productType, setProductType] = useState<string>("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [originalPrice, setOriginalPrice] = useState<string>("");
  const [discountedPrice, setDiscountedPrice] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [unit, setUnit] = useState<string>("");
  const [uploadMethod, setUploadMethod] = useState<string>("");
  const [pickupWindowDuration, setPickupWindowDuration] = useState<string>("");

  const { producers, loadingProducers, producerError } = useProducers();
  const { addListing, loading, error } = useAddListing();
  const [producer, setProducer] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    } else {
      setImage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    if (!productType) {
      alert("Please select the praoduct type.");
      return;
    }
    if (!producer) {
      alert("Please select the producer.");
      return;
    }
    if (quantity === "" || quantity <= 0) {
      alert("Quantity must be greater than zero.");
      return;
    }
    if (!unit) {
      alert("Please select a unit.");
      return;
    }
    if (!uploadMethod) {
      alert("Please select an upload method.");
      return;
    }
    if (!pickupWindowDuration) {
      alert("Please select a pickup window duration.");
      return;
    }
    if (expiryDate && isNaN(new Date(expiryDate).getTime())) {
      alert("Please enter a valid expiry date.");
      return;
    }

    if (originalPrice !== "" && isNaN(Number(originalPrice))) {
      alert("Original price must be a valid number.");
      return;
    }
    if (discountedPrice !== "" && isNaN(Number(discountedPrice))) {
      alert("Discounted price must be a valid number.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("product_type", productType);
      formData.append("producer", producer);
      formData.append("quantity", quantity.toString());
      formData.append("unit", unit);
      formData.append("upload_method", uploadMethod);
      formData.append("pickup_window_duration", new Date(pickupWindowDuration).toISOString());

      if (category) formData.append("category", category);
      if (description) formData.append("description", description);


      if (originalPrice !== "") {
        formData.append("original_price", originalPrice);
      }
      if (discountedPrice !== "") {
        formData.append("discounted_price", discountedPrice);
      }

      if (expiryDate) formData.append("expiry_date", new Date(expiryDate).toISOString());
      if (image) formData.append("image", image);

      await addListing(formData);
      onSuccess();
    } catch (err) {

    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg h-[85vh] flex flex-col">
      <form
        onSubmit={handleSubmit}
        className="flex-grow overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-[#FF8614] scrollbar-track-[#234B06]"
        style={{ scrollbarWidth: "thin" }}
      >
        {error && (
          <p className="text-[#FF8614] mb-6 bg-[#234B06] bg-opacity-20 p-3 rounded border border-[#FF8614]">
            {error}
          </p>
        )}

        <div className="mb-5">
          <label className="block mb-2 font-semibold text-[#234B06]">
            Product Type <span className="text-[#FF8614]">*</span>
          </label>
          <select
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            className="w-full border border-[#234B06] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8614] transition"
          >
            <option value="">Select product type</option>
            <option value="edible">Edible</option>
            <option value="inedible">Inedible</option>
          </select>
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-semibold text-[#234B06]">
            Producer <span className="text-[#FF8614]">*</span>
          </label>
          {loadingProducers ? (
            <p>Loading producers...</p>
          ) : producerError ? (
            <p className="text-red-600">{producerError}</p>
          ) : (
            <select
              value={producer}
              onChange={(e) => setProducer(e.target.value)}
              className="w-full border border-[#234B06] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8614] transition"
            >
              <option value="">Select Producer</option>
              {producers.map((user) => (
                <option key={user.id} value={user.id.toString()}>
                  {user.first_name && user.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : user.email}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-semibold text-[#234B06]">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            className="w-full border border-[#234B06] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8614] transition"
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-semibold text-[#234B06]">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={3}
            className="w-full border border-[#234B06] rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#FF8614] transition"
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-semibold text-[#234B06]">
            Quantity <span className="text-[#FF8614]">*</span>
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={quantity}
            onChange={(e) =>
              setQuantity(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="w-full border border-[#234B06] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8614] transition"
            required
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-semibold text-[#234B06]">
            Unit <span className="text-[#FF8614]">*</span>
          </label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full border border-[#234B06] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8614] transition"
          >
            <option value="">Select unit</option>
            <option value="kg">Kg (weight)</option>
            <option value="L">L (volume)</option>
            <option value="unit">Unit (count)</option>
          </select>
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-semibold text-[#234B06]">Original Price</label>
          <input
            type="number"
            min="0"
            step="any"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="Original price"
            className="w-full border border-[#234B06] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8614] transition"
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-semibold text-[#234B06]">Discounted Price</label>
          <input
            type="number"
            min="0"
            step="any"
            value={discountedPrice}
            onChange={(e) => setDiscountedPrice(e.target.value)}
            placeholder="Discounted price"
            className="w-full border border-[#234B06] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8614] transition"
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-semibold text-[#234B06]">Expiry Date</label>
          <input
            type="datetime-local"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full border border-[#234B06] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8614] transition"
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-semibold text-[#234B06]">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-semibold text-[#234B06]">
            Upload Method <span className="text-[#FF8614]">*</span>
          </label>
          <select
            value={uploadMethod}
            onChange={(e) => setUploadMethod(e.target.value)}
            className="w-full border border-[#234B06] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8614] transition"
          >
            <option value="">Select upload method</option>
            <option value="manual">Manual</option>
            <option value="csv">CSV</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-semibold text-[#234B06]">
            Pickup Window Duration <span className="text-[#FF8614]">*</span>
          </label>
          <input
            type="datetime-local"
            value={pickupWindowDuration}
            onChange={(e) => setPickupWindowDuration(e.target.value)}
            className="w-full border border-[#234B06] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8614] transition"
          />
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#234B06]">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="cursor-pointer bg-[#FF8614] text-[#234B06] font-semibold px-6 py-2 rounded-md hover:bg-[#e4760f] transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer bg-[#234B06] text-white px-6 py-2 rounded-md hover:bg-[#1f3e05] transition disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Item"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItem;