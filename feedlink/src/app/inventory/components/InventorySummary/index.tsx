import React from "react";

interface Props {
  totalItems: number;
  expiringSoonCount: number;
  expiredCount: number;
}

const InventorySummary = ({ totalItems, expiringSoonCount, expiredCount }: Props) => {
  return (
    <div className="flex gap-9 mb-10">
      <div
        className="p-5 rounded shadow flex-1 text-center bg-[#9FB68E]"
        
      >
        <div className="text-3xl font-semibold ">Total items</div>
        <div className="text-4xl font-bold text-[var(--primary-color)] mt-2">{totalItems}</div>
        <div className="text-2xl font-semibold ">Across all categories</div>
      </div>
      <div
        className="font-nunito p-5 rounded shadow flex-1 text-center bg-[#9FB68E]"
        
      >
        <div className="text-3xl font-semibold ">Expiring soon</div>
        <div className="text-4xl font-bold text-[var(--primary-color)] mt-2">{expiringSoonCount}</div>
        <div className="text-2xl font-semibold ">Expiring within 3 days</div>
      </div>
      <div
        className="font-nunito p-5 rounded shadow flex-1 text-center bg-[#9FB68E]"
       
      >
        <div className="text-3xl font-semibold ">Expired items</div>
        <div className="text-4xl font-bold text-[var(--primary-color)] mt-2">{expiredCount}</div>
        <div className="text-2xl font-semibold ">Recycled</div>
      </div>
    </div>
  );
};

export default InventorySummary;