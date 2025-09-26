"use client";

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar1 } from "lucide-react";
import { CalendarProperties } from "@/app/utils/type";

const Calendar = ({ selectedDate, setSelectedDate }: CalendarProperties) => {
  const [isOpen, setIsOpen] = useState(false);

  const DatePickerButton = ({ onClick }: { onClick?: () => void }) => (

    <div className="flex items-center cursor-pointer" onClick={onClick}>
      <Calendar1 size={30} className="text-black" />

      {selectedDate && (
        <span className="ml-2 text-sm font-medium text-black whitespace-nowrap">
          {selectedDate.toLocaleDateString('en-GB')}
        </span>
      )}
    </div>
  );

  return (
    <div className="relative">
      <DatePicker
        selected={selectedDate}
        onChange={(date: Date | null) => {
          setSelectedDate(date);
          setIsOpen(false);
        }}
        
        dateFormat="dd-MM-yyyy"
        customInput={<DatePickerButton />}
        open={isOpen}
        onClickOutside={() => setIsOpen(false)}
        onCalendarOpen={() => setIsOpen(true)}
        onCalendarClose={() => setIsOpen(false)}
      />
    </div>
  );
};
export default Calendar;