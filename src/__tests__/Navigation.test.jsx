import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Navigation from "../components/Navigation/Navigation";
import Booking from "../views/Booking";
import Confirmation from "../views/Confirmation";

describe("Navigation Component", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("navigates between booking and confirmation views", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Navigation />
        <Routes>
          <Route path="/" element={<Booking />} />
          <Route path="/confirmation" element={<Confirmation />} />
        </Routes>
      </MemoryRouter>
    );

    // Verify we start at booking view
    expect(screen.getByText("When, WHAT & Who")).toBeInTheDocument();

    // Navigate to confirmation
    const menuButtons = screen.getAllByAltText("navigation icon");
    fireEvent.click(menuButtons[0]);
    const confirmationLink = screen.getAllByText(/confirmation/i)[0];
    fireEvent.click(confirmationLink);

    // Verify we reached confirmation view
    expect(screen.getByText("See you soon!")).toBeInTheDocument();
  });

  it("displays 'Inga bokning gjord' when no booking exists", () => {
    render(
      <MemoryRouter initialEntries={["/confirmation"]}>
        <Routes>
          <Route path="/confirmation" element={<Confirmation />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Inga bokning gjord!")).toBeInTheDocument();
  });
});
