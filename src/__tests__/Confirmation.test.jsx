import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Confirmation from "../views/Confirmation";

describe("Confirmation Component", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("renders no booking message when no confirmation details are available", () => {
    render(
      <MemoryRouter>
        <Confirmation />
      </MemoryRouter>
    );

    expect(screen.getByText("Inga bokning gjord!")).toBeInTheDocument();
  });

  it("renders confirmation details when they are available", () => {
    const mockBooking = {
      when: "2024-12-12T12:00",
      people: 5,
      lanes: 2,
      price: 800,
      id: "012345-xyz-abc",
    };
    sessionStorage.setItem("confirmation", JSON.stringify(mockBooking));

    render(
      <MemoryRouter>
        <Confirmation />
      </MemoryRouter>
    );

    expect(screen.getByText("See you soon!")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2024-12-12 12:00")).toBeInTheDocument();
    expect(screen.getByDisplayValue("5")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2")).toBeInTheDocument();
    expect(screen.getByDisplayValue("012345-xyz-abc")).toBeInTheDocument();
    expect(screen.getByText("800 sek")).toBeInTheDocument();
  });

  it("displays correct price calculation", () => {
    const mockBooking = {
      when: "2024-12-12T12:00",
      people: 2,
      lanes: 1,
      price: 340,
      id: "012345-xyz-abc",
    };
    sessionStorage.setItem("confirmation", JSON.stringify(mockBooking));

    render(
      <MemoryRouter>
        <Confirmation />
      </MemoryRouter>
    );

    expect(screen.getByText("340 sek")).toBeInTheDocument();
  });
});
