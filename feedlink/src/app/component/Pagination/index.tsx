"use client";

import { PaginationProps } from "@/app/utils/type";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded text-[var(--primary-color)] font-bold ${
          currentPage === 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-[#F0F5EB] hover:bg-opacity-50"
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft size={30} strokeWidth={3.5} />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded border font-bold ${
            page === currentPage
              ? "bg-[var(--primary-color)] text-white"
              : "border-[var(--primary-color)] text-gray-700 hover:bg-[#F0F5EB]"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded text-[var(--primary-color)] font-bold ${
          currentPage === totalPages
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-[#F0F5EB] hover:bg-opacity-50"
        }`}
        aria-label="Next page"
      >
        <ChevronRight size={30} strokeWidth={3.5} />
      </button>
    </div>
  );
}