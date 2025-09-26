import React, { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

interface Props {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  categoryFilter: string;
  setCategoryFilter: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  uploadDateFilter: string;
  setUploadDateFilter: (val: string) => void;
  categoryOptions: string[];
  onUploadClick: () => void;
}
interface SelectOption {
  value: string;
  label: string;
}
const CustomSelect: React.FC<{
  value: string; 
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
}> = ({ value, onChange, options, placeholder = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  
  const currentLabel = options.find(opt => opt.value === value)?.label || placeholder;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="font-nunito border border-gray-300 rounded px-3 py-1 cursor-pointer flex items-center justify-between min-w-[120px]"
      >
        <span>{currentLabel}</span>
        <span className="text-gray-500 text-xs">▼</span>
      </div>

      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 border border-gray-300 rounded bg-white max-h-48 overflow-y-auto">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="px-3 py-1 cursor-pointer hover:bg-[#234B06] hover:text-white"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const InventoryFilters = ({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  uploadDateFilter,
  setUploadDateFilter,
  categoryOptions,
  onUploadClick,
}: Props) => {
  
  const statusOptions: SelectOption[] = [
    { value: "All", label: "All status" },
    { value: "available", label: "Available" },
    { value: "expired", label: "Expired" },
  ];
  
  const capitalizeWords = (str: string): string => {
    return str.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };
  
  const categorySelectOptions: SelectOption[] = categoryOptions.map(cat => ({
    value: cat,
    label: capitalizeWords(cat),
  }));
  return (
    <div className="font-nunito flex flex-wrap items-center gap-6 mb-8">
      {}
      <div className="relative flex items-center flex-grow max-w-xs">
        <input
          type="search"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded pl-10 pr-3 py-1 focus:outline-none focus:ring-1 focus:ring-[#234B06]"
        />
        <FaSearch className="absolute left-3 text-gray-400 pointer-events-none" />
      </div>

      {}
      <CustomSelect
        value={categoryFilter}
        onChange={setCategoryFilter}
        options={categorySelectOptions}
        placeholder="Select category"
      />

      {}
      <CustomSelect
        value={statusFilter}
        onChange={setStatusFilter}
        options={statusOptions}
        placeholder="All status"
      />

      {}
      <input
        type="date"
        value={uploadDateFilter}
        onChange={(e) => setUploadDateFilter(e.target.value)}
        className="font-nunito border border-gray-300 rounded px-3 py-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#234B06]"
        title="Filter by upload date"
      />
      {}
      <button
        onClick={onUploadClick}
        className="cursor-pointer ml-auto px-4 py-2 rounded text-white bg-[#234B06]"
      >
        Upload
      </button>
    </div>
  );
};

export default InventoryFilters;