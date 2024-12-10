import { http, HttpResponse } from "msw";

export const handlers = [
  http.post(
    "https://h5jbtjv6if.execute-api.eu-north-1.amazonaws.com",
    async ({ request }) => {
      const booking = await request.json();

      const price =
        parseInt(booking.people) * 120 + parseInt(booking.lanes) * 100;

      const confirmation = {
        id: "012345",
        when: booking.when,
        time: booking.time,
        lanes: booking.lanes,
        people: booking.people,
        shoes: booking.shoes,
        price: price,
        active: true,
      };

      sessionStorage.setItem("confirmation", JSON.stringify(confirmation));
      return HttpResponse.json(confirmation);
    }
  ),

  http.get(
    "https://h5jbtjv6if.execute-api.eu-north-1.amazonaws.com/confirmation",
    () => {
      const storedConfirmation = sessionStorage.getItem("confirmation");
      return HttpResponse.json(JSON.parse(storedConfirmation));
    }
  ),
];
