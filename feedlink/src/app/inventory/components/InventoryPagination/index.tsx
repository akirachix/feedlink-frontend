import React from "react";

interface Props {
  page: number;
  pageCount: number;
  setPage: (page: number) => void;
}


const InventoryPagination = ({ page, pageCount, setPage }: Props) => {
  if (pageCount <= 1) return null;
  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      <button
        disabled={page === 1}
        onClick={() => setPage(Math.max(1, page - 1))}
        className="cursor-pointer px-3 py-1 rounded border border-gray-200 disabled:opacity-50"
      >
        &lt;
      </button>
      {[...Array(pageCount)].map((_, idx) => {
        const pageNum = idx + 1;
        return (
          <button
            key={pageNum}
            onClick={() => setPage(pageNum)}
            className={`cursor-pointer px-3 py-1 rounded border border-gray-300 ${pageNum === page ? "bg-[#234B06] text-white" : "hover:bg-[#f0f5eb]"
              }`}
          >
            {pageNum}
          </button>
        );
      })}
      <button
        disabled={page === pageCount}
        onClick={() => setPage(Math.min(pageCount, page + 1))}
        className="cursor-pointer px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
      >
        &gt;
      </button>
    </div>
  );
};

export default InventoryPagination;