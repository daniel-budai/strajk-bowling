import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Booking from "../views/Booking";

test("renders booking component", () => {
  render(
    <BrowserRouter>
      <Booking />
    </BrowserRouter>
  );
});
