"use client";
import React, { useState } from "react";
import { uploadCsvFile } from "../../../utils/fetchCsvUpload";

type CsvProps = {
  onSuccess: () => void;
  onCancel: () => void;
};

const Csv = ({ onSuccess, onCancel }: CsvProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a CSV file to upload.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await uploadCsvFile(file);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to upload CSV file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4 text-left">
      <h2 className="text-xl font-semibold mb-4">Upload CSV File</h2>

      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

      <input
        type="file"
        accept=".csv,text/csv"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-700 file:text-white hover:file:bg-green-800 cursor-pointer"
      />

      <div className="flex justify-end gap-4 mt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="cursor-pointer px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer px-4 py-2 rounded bg-green-700 text-white hover:bg-green-800 disabled:opacity-70"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </form>
  );
};

export default Csv;