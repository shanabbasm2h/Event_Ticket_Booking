import dotenv from "dotenv";
import Stripe from "stripe";

import Reservation from "../models/reservationModel.js";
import Event from "../models/eventModel.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getUserReservations = async (req, res) => {
  try {
    const { id } = req.user;
    const reservation = await Reservation.find({
      user: id,
    });
    if (!reservation)
      return res.status(404).json({
        status: "fail",
        message: "No booked Seats",
      });
    res.status(200).json({
      reservation,
      //   userName: reservation.user.name,
    });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const getOneReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const reservation = await Reservation.findById(
      reservationId
    );
    if (!reservation)
      return res.status(404).json({
        status: "fail",
        message: "No reservation found",
      });

    res
      .status(200)
      .json({ status: "success", reservation });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const cancelBookedSeats = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const { seat } = req.body;
    const reservation = await Reservation.findById(
      reservationId
    );
    if (!reservation)
      return res.status(404).json({
        status: "fail",
        message: "No reservation found",
      });
    const event = await Event.findById(
      reservation.event.id
    );
    if (!event)
      return res.status(404).json({
        status: "fail",
        message: "No event found",
      });

    const seatToBeCanceled = reservation.seats.filter(
      (existingSeat) => {
        const [row, col] = existingSeat;
        if (
          seat[0] === row &&
          seat[1] === col &&
          event.seats[row][col] === 1
        ) {
          event.seats[row][col] = 0;

          return false;
        }
        return true;
      }
    );
    if (
      seatToBeCanceled.length === reservation.seats.length
    )
      return res.status(404).json({
        status: "fail",
        message: "Unable to cancel booked seats",
      });
    event.availableSeats = event.availableSeats + 1;
    event.bookedSeats = event.bookedSeats - 1;
    await event.save();
    reservation.seats = seatToBeCanceled;
    reservation.total =
      reservation.seats.length * event.price;

    if (reservation.seats.length === 0) {
      await Reservation.findByIdAndRemove(reservationId);
      return res.status(200).json({
        message: "Reservation canceled and deleted",
      });
    }
    await reservation.save();

    return res.status(200).json({
      message: "Seats canceled from reservation",
      reservation,
    });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const bookSeat = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { seats } = req.body;
    const userId = req.user.id;
    const event = await Event.findById(eventId);
    console.log("hello this is type", typeof seats);
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

export const getCheckoutSession = async (req, res) => {
  try {
    const reservation = await Reservation.findById(
      req.params.reservationId
    );
    console.log(reservation.total);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${req.protocol}://${req.get(
        "host"
      )}/reservation/reservationPayment/${reservation.id}`,
      // success_url: "http://localhost:5173/home",
      // cancel_url: `${req.protocol}://${req.get(
      //   "host"
      // )}/event/${reservation.event.id}`,
      cancel_url: "http://localhost:5173/reservations",
      customer_email: req.user.email,
      client_reference_id: req.params.reservationId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: reservation.price * 100,
            product_data: {
              name: reservation.event.name,
              description: `${reservation.event.name} in our country now!`,
              images: [
                `${req.protocol}://${req.get(
                  "host"
                )}/assets/${reservation.event.image}`,
              ],
            },
          },
          quantity: reservation.seats.length,
        },
      ],
    });
    res.status(200).json({
      status: "success",
      session,
      image: `${req.protocol}://${req.get("host")}/assets/${
        reservation.event.image
      }`,
    });
  } catch (err) {
    res
      .status(404)
      .json({ status: "fail", error: err.message });
  }
};

export const paymentSuccess = async (req, res) => {
  try {
    if (req.params.reservationId) {
      const reservation =
        await Reservation.findByIdAndUpdate(
          req.params.reservationId,
          { $set: { paid: true } },
          { new: true }
        );
    }

    res.redirect(`http://localhost:5173/reservations`);
  } catch (err) {
    res
      .status(404)
      .json({ status: "fail", error: err.message });
  }
};
