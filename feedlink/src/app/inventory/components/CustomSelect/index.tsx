import React, { useState, useRef, useEffect } from 'react';

interface SelectOption {
  value: string;
  label: string;
}
interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
}
const CustomSelect = ({
  value,
  onChange,
  options,
  placeholder = ""
}: CustomSelectProps) => {
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

export default CustomSelect;