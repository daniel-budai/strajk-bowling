import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Booking from "../views/Booking";

describe("Booking Component", () => {
  let dateInput, timeInput, peopleInput, lanesInput, bookButton, addShoeButton;

  beforeEach(() => {
    sessionStorage.clear();
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );

    dateInput = screen.getByLabelText("Date");
    timeInput = screen.getByLabelText("Time");
    peopleInput = screen.getByLabelText("Number of awesome bowlers");
    lanesInput = screen.getByLabelText("Number of lanes");
    addShoeButton = screen.getByText("+");
    bookButton = screen.getByText("strIIIIIike!");
  });

  describe("Basic booking functionality", () => {
    it("allows selecting date and time", () => {
      fireEvent.change(dateInput, { target: { value: "2024-12-12" } });
      fireEvent.change(timeInput, { target: { value: "12:00" } });

      expect(dateInput.value).toBe("2024-12-12");
      expect(timeInput.value).toBe("12:00");
    });

    it("allows selecting number of players and lanes", () => {
      fireEvent.change(peopleInput, { target: { value: "2" } });
      fireEvent.change(lanesInput, { target: { value: "1" } });

      expect(peopleInput.value).toBe("2");
      expect(lanesInput.value).toBe("1");
    });

    it("completes booking with valid inputs", async () => {
      fireEvent.change(dateInput, { target: { value: "2024-12-12" } });
      fireEvent.change(timeInput, { target: { value: "12:00" } });
      fireEvent.change(peopleInput, { target: { value: "2" } });
      fireEvent.change(lanesInput, { target: { value: "1" } });

      // Add shoes for both players
      fireEvent.click(addShoeButton);
      fireEvent.click(addShoeButton);

      const shoeSizeInputs = screen.getAllByLabelText(/Shoe size \/ person/);
      fireEvent.change(shoeSizeInputs[0], { target: { value: "42" } });
      fireEvent.change(shoeSizeInputs[1], { target: { value: "41" } });

      fireEvent.click(bookButton);

      await waitFor(() => {
        const savedBooking = JSON.parse(sessionStorage.getItem("confirmation"));
        expect(savedBooking).toBeTruthy();
      });
    });
  });

  describe("Error handling", () => {
    it("shows error when all fields are missing", async () => {
      fireEvent.click(bookButton);
      expect(
        screen.getByText("Alla fälten måste vara ifyllda")
      ).toBeInTheDocument();
    });

    // Second error: Shoe count doesn't match
    it("shows error when shoe count doesn't match player count", async () => {
      fireEvent.change(dateInput, { target: { value: "2024-12-12" } });
      fireEvent.change(timeInput, { target: { value: "12:00" } });
      fireEvent.change(peopleInput, { target: { value: "2" } });
      fireEvent.change(lanesInput, { target: { value: "1" } });

      // Only add one shoe for two players
      fireEvent.click(addShoeButton);
      const shoeInput = screen.getByLabelText(/Shoe size \/ person/);
      fireEvent.change(shoeInput, { target: { value: "42" } });

      fireEvent.click(bookButton);

      expect(
        screen.getByText("Antalet skor måste stämma överens med antal spelare")
      ).toBeInTheDocument();
    });

    // Third error: Empty shoe sizes
    it("shows error when shoe sizes are not filled", async () => {
      fireEvent.change(dateInput, { target: { value: "2024-12-12" } });
      fireEvent.change(timeInput, { target: { value: "12:00" } });
      fireEvent.change(peopleInput, { target: { value: "2" } });
      fireEvent.change(lanesInput, { target: { value: "1" } });

      // Add shoes but don't fill in sizes
      fireEvent.click(addShoeButton);
      fireEvent.click(addShoeButton);

      fireEvent.click(bookButton);

      expect(
        screen.getByText("Alla skor måste vara ifyllda")
      ).toBeInTheDocument();
    });

    it("shows error when too many players per lane", async () => {
      fireEvent.change(dateInput, { target: { value: "2024-12-12" } });
      fireEvent.change(timeInput, { target: { value: "12:00" } });
      fireEvent.change(peopleInput, { target: { value: "5" } });
      fireEvent.change(lanesInput, { target: { value: "1" } });

      // Add shoes for all players
      for (let i = 0; i < 5; i++) {
        fireEvent.click(addShoeButton);
      }
      const shoeSizeInputs = screen.getAllByLabelText(/Shoe size \/ person/);
      shoeSizeInputs.forEach((input) => {
        fireEvent.change(input, { target: { value: "42" } });
      });

      fireEvent.click(bookButton);

      expect(
        screen.getByText("Det får max vara 4 spelare per bana")
      ).toBeInTheDocument();
    });

    it("shows error when only date is filled", () => {
      fireEvent.change(dateInput, { target: { value: "2024-12-12" } });
      fireEvent.click(bookButton);
      expect(
        screen.getByText("Alla fälten måste vara ifyllda")
      ).toBeInTheDocument();
    });

    it("shows error when only time is filled", () => {
      fireEvent.change(timeInput, { target: { value: "12:00" } });
      fireEvent.click(bookButton);
      expect(
        screen.getByText("Alla fälten måste vara ifyllda")
      ).toBeInTheDocument();
    });

    it("shows error when only players is filled", () => {
      fireEvent.change(peopleInput, { target: { value: "2" } });
      fireEvent.click(bookButton);
      expect(
        screen.getByText("Alla fälten måste vara ifyllda")
      ).toBeInTheDocument();
    });
  });

  describe("Shoe size functionality", () => {
    it("allows adding and removing shoe sizes", () => {
      fireEvent.change(peopleInput, { target: { value: "2" } });

      // Add shoes
      fireEvent.click(addShoeButton);
      fireEvent.click(addShoeButton);

      const shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/);
      expect(shoeInputs).toHaveLength(2);

      // Remove one shoe
      const removeButtons = screen.getAllByText("-");
      fireEvent.click(removeButtons[0]);

      const remainingShoeInputs =
        screen.getAllByLabelText(/Shoe size \/ person/);
      expect(remainingShoeInputs).toHaveLength(1);
    });

    it("allows changing shoe sizes", () => {
      fireEvent.click(addShoeButton);
      const shoeInput = screen.getByLabelText(/Shoe size \/ person/);

      fireEvent.change(shoeInput, { target: { value: "42" } });
      expect(shoeInput.value).toBe("42");

      fireEvent.change(shoeInput, { target: { value: "43" } });
      expect(shoeInput.value).toBe("43");
    });
  });

  describe("Price calculation", () => {
    it("calculates correct price for booking", async () => {
      const players = 2;
      const lanes = 1;
      const expectedPrice = players * 120 + lanes * 100; // 340kr

      // Fill booking details
      fireEvent.change(dateInput, { target: { value: "2024-12-12" } });
      fireEvent.change(timeInput, { target: { value: "12:00" } });
      fireEvent.change(peopleInput, { target: { value: String(players) } });
      fireEvent.change(lanesInput, { target: { value: String(lanes) } });

      // Add shoes
      for (let i = 0; i < players; i++) {
        fireEvent.click(addShoeButton);
        const shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/);
        fireEvent.change(shoeInputs[i], { target: { value: "42" } });
      }

      fireEvent.click(bookButton);

      await waitFor(() => {
        const savedBooking = JSON.parse(sessionStorage.getItem("confirmation"));
        expect(savedBooking.price).toBe(expectedPrice);
      });
    });
  });
});
