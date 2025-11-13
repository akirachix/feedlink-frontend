import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Pagination from "./index";

jest.mock("lucide-react", () => ({
  ChevronLeft: ({ size }: { size?: number }) => (
    <svg data-testid="chevron-left" width={size} />
  ),
  ChevronRight: ({ size }: { size?: number }) => (
    <svg data-testid="chevron-right" width={size} />
  ),
}));

describe("Pagination Component", () => {
  const onPageChange = jest.fn();

  beforeEach(() => {
    onPageChange.mockClear();
  });

  test("does not render for totalPages <= 1", () => {
    const { container } = render(<Pagination currentPage={1} totalPages={1} onPageChange={onPageChange} />);
    expect(container.firstChild).toBeNull();

    const { container: container2 } = render(<Pagination currentPage={1} totalPages={0} onPageChange={onPageChange} />);
    expect(container2.firstChild).toBeNull();
  });

  test("renders correct number of page buttons", () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />);
    expect(screen.getAllByRole("button")).toHaveLength(4); 
    expect(screen.getByText("2")).toHaveClass("bg-[var(--primary-color)]");
  });

  test("calls onPageChange with correct page number and on navigation button clicks", () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByText("1"));
    expect(onPageChange).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByLabelText("Next page"));
    expect(onPageChange).toHaveBeenCalledWith(3);

    fireEvent.click(screen.getByLabelText("Previous page"));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  test("previous button is disabled on first page", () => {
    render(<Pagination currentPage={1} totalPages={3} onPageChange={onPageChange} />);
    const prevButton = screen.getByLabelText("Previous page");
    expect(prevButton).toBeDisabled();
    fireEvent.click(prevButton);
    expect(onPageChange).not.toHaveBeenCalled();
  });

  test("next button is disabled on last page", () => {
    render(<Pagination currentPage={3} totalPages={3} onPageChange={onPageChange} />);
    const nextButton = screen.getByLabelText("Next page");
    expect(nextButton).toBeDisabled();
    fireEvent.click(nextButton);
    expect(onPageChange).not.toHaveBeenCalled();
  });

  test("previous and next buttons work on middle page", () => {
    render(<Pagination currentPage={2} totalPages={3} onPageChange={onPageChange} />);
    const prevButton = screen.getByLabelText("Previous page");
    fireEvent.click(prevButton);
    expect(onPageChange).toHaveBeenCalledWith(1);

    const nextButton = screen.getByLabelText("Next page");
    fireEvent.click(nextButton);
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  test("renders chevron icons", () => {
    render(<Pagination currentPage={2} totalPages={3} onPageChange={onPageChange} />);
    expect(screen.getByTestId("chevron-left")).toBeInTheDocument();
    expect(screen.getByTestId("chevron-right")).toBeInTheDocument();
  });
});