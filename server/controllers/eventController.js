import Event from "./../models/eventModel.js";
import Reservation from "../models/reservationModel.js";

export const bookSeat = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { seats } = req.body;
    const userId = req.user.id;
    const event = await Event.findById(eventId);

    if (!event) {
      return res
        .status(404)
        .json({ message: "Event not found" });
    }

    const bookedSeats = [];

    seats.forEach((seat) => {
      const [row, col] = seat;
      if (event.seats[row][col] === 0) {
        event.seats[row][col] = 1;
      } else {
        bookedSeats.push(seat);
      }
    });

    if (bookedSeats.length > 0) {
      return res.status(400).json({
        message:
          "Some of the selected seats are already booked",
        bookedSeats,
      });
    }
    event.availableSeats =
      event.availableSeats - seats.length;
    event.bookedSeats = event.bookedSeats + seats.length;

    const total = seats.length * event.price;

    const updatedEvent = await event.save();

    let reservation = await Reservation.findOne({
      user: userId,
      event: eventId,
    });
    if (reservation) {
      reservation.seats.push(...seats);
      reservation.total =
        reservation.seats.length * event.price;
    } else {
      reservation = new Reservation({
        event: updatedEvent.id,
        user: userId, // User's ID
        seats: seats,
        price: event.price,
        total: total,
      });
    }

    const newReservation = await reservation.save();

    return res.status(200).json({
      message: "Seats booked successfully",
      updatedEvent,
      newReservation,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error" });
  }
};

export const createEvent = async (req, res) => {
  try {
    const { name, price, location, seatLayout } = req.body;
    const seats = seatLayout.map((count) =>
      new Array(count).fill(0)
    );
    const countSeats = seats.reduce(
      (currentCount, row) => {
        row.forEach((seatStatus) => {
          if (seatStatus === 0) {
            currentCount.availableSeats++;
          } else if (seatStatus === 1) {
            currentCount.bookedSeats++;
          }
        });
        return currentCount;
      },
      { availableSeats: 0, bookedSeats: 0 }
    );
    const event = await Event.create({
      name,
      price,
      location,
      seats,
      availableSeats: countSeats.availableSeats,
      bookedSeats: countSeats.bookSeats,
    });
    res
      .status(201)
      .json({ status: "success", data: event });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const { location } = req.params;
    if (location) {
      const events = await Event.find(
        { location: location },
        { seats: 0 }
      );
      if (!events)
        return res.status(404).json({
          status: "fail",
          message: "No event fount with that location!",
        });
      res
        .status(200)
        .json({ status: "success", data: events });
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const getAllEventsLocation = async (req, res) => {
  try {
    if (req.body) {
      const { location } = req.body;
      const events = await Event.distinct("location");
      if (!events)
        return res.status(404).json({
          status: "fail",
          message: "No event found with that location!",
        });
      res
        .status(200)
        .json({ status: "success", data: events });
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const getSeatsMap = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);

    if (!event)
      return res.status(404).json({
        status: "fail",
        message: "No event found",
      });
    res
      .status(200)
      .json({ status: "success", data: event });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
