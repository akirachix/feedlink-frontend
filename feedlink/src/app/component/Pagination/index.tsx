"use client";

import { PaginationProps } from "@/app/utils/type";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const canGoBack = currentPage > 1;
  const canGoForward = currentPage < totalPages;

  let startPage = Math.max(1, currentPage - 1); 
  let endPage = Math.min(totalPages, startPage + 1); 

  if (endPage - startPage < 1 && totalPages > 1) {

     startPage = Math.max(1, totalPages - 1);
     endPage = totalPages;
  }

  const pagesToShow = [];
  for (let i = startPage; i <= endPage; i++) {
    pagesToShow.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoBack}
        className={`p-2 rounded text-[var(--primary-color)] font-bold ${
          !canGoBack
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-[#F0F5EB] hover:bg-opacity-50"
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft size={30} strokeWidth={3.5} />
      </button>

      {pagesToShow.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded border font-bold ${
            page === currentPage
              ? "bg-[var(--primary-color)] text-white"
              : "border-[var(--primary-color)] text-gray-700 hover:bg-[#F0F5EB]"
          }`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoForward}
        className={`p-2 rounded text-[var(--primary-color)] font-bold ${
          !canGoForward
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