import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Calendar from "./index";

jest.mock("react-datepicker/dist/react-datepicker.css", () => {});

jest.mock("lucide-react", () => ({
  Calendar1: ({ size, className }: { size?: number; className?: string }) => (
    <svg data-testid="calendar-icon" width={size} className={className} />
  ),
}));

describe("Calendar Component", () => {
  let selectedDate: Date | null;
  let setSelectedDate: jest.Mock;

  beforeEach(() => {
    selectedDate = new Date("2025-09-23T00:00:00Z");
    setSelectedDate = jest.fn();
  });

  test("renders Calendar with selected date", () => {
    render(<Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />);
    expect(screen.getByTestId("calendar-icon")).toBeInTheDocument();
    expect(screen.getByText("23/09/2025")).toBeInTheDocument();
  });

  test("renders Calendar without selected date", () => {
    render(<Calendar selectedDate={null} setSelectedDate={setSelectedDate} />);
    expect(screen.getByTestId("calendar-icon")).toBeInTheDocument();
    expect(screen.queryByText(/^\d{2}\/\d{2}\/\d{4}$/)).toBeNull();
  });

  test("clicking the calendar icon does not call setSelectedDate", () => {
    render(<Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />);
    fireEvent.click(screen.getByTestId("calendar-icon"));
    expect(setSelectedDate).not.toHaveBeenCalled();
  });

  test("calendar icon has correct size and classes", () => {
    render(<Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />);
    const icon = screen.getByTestId("calendar-icon");
    expect(icon).toHaveAttribute("width", "30");
    expect(icon).toHaveClass("text-black");
  });
});