import Event from "./../models/eventModel.js";
import Reservation from "../models/ReservationModel.js";

export const bookSeat = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId, seats } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res
        .status(404)
        .json({ message: "Event not found" });
    }

    const seatsToBook = seats.map((seat) => {
      const [row, col] = seat;
      if (event.seats[row][col] === 0) {
        event.seats[row][col] = 1;
        return seat;
      }
    });

    if (seatsToBook.length === 0) {
      return res
        .status(400)
        .json({ message: "Seats are not available" });
    }

    const total = seatsToBook.length * event.price;

    const updatedEvent = await event.save();

    const reservation = new Reservation({
      event: updatedEvent.id,
      user: userId, // User's ID
      seats,
      price,
      total: total,
    });
    await reservation.save();
    return res.status(200).json({
      message: "Seats booked successfully",
      total,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error" });
  }
};
