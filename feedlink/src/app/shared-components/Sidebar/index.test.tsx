import { render, screen } from "@testing-library/react";
import Sidebar from "./index";
import { usePathname } from "next/navigation";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

describe("Sidebar Component", () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReset();
  });

  it("renders logo with correct alt text", () => {
    render(<Sidebar />);
    const logo = screen.getByAltText("FeedLink Logo");
    expect(logo).toBeInTheDocument();
  });

  it("renders all navigation links", () => {
    render(<Sidebar />);
    const links = screen.getAllByRole("link");
    expect(links.length).toBe(5); 
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Inventory")).toBeInTheDocument();
    expect(screen.getByText("Waste Claims")).toBeInTheDocument();
    expect(screen.getByText("Orders")).toBeInTheDocument();
    expect(screen.getByText("Log Out")).toBeInTheDocument();
  });

  it("applies active styles to Dashboard when on /dashboard or subpath", () => {
    (usePathname as jest.Mock).mockReturnValue("/dashboard");

    render(<Sidebar />);
    const dashboardLink = screen.getByText("Dashboard").closest("a");

    expect(dashboardLink).toHaveClass("bg-white");
    expect(dashboardLink).toHaveClass("text-[var(--secondary-color)]");
    expect(dashboardLink).toHaveClass("font-semibold");
  });

  it("applies hover styles on non-active links (class names exist)", () => {
    (usePathname as jest.Mock).mockReturnValue("/inventory");

    render(<Sidebar />);
    const dashboardLink = screen.getByText("Dashboard").closest("a");

    expect(dashboardLink).not.toHaveClass("bg-white");
    expect(dashboardLink).not.toHaveClass("text-[var(--secondary-color)]");
    expect(dashboardLink).toHaveClass("hover:bg-white");
    expect(dashboardLink).toHaveClass("hover:text-[var(--secondary-color)]");
  });

  it("matches snapshot", () => {
    (usePathname as jest.Mock).mockReturnValue("/");

    const { asFragment } = render(<Sidebar />);
    expect(asFragment()).toMatchSnapshot();
  });
});