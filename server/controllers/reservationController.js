import Reservation from "../models/reservationModel.js";
import Event from "../models/eventModel.js";
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

export const cancelBookedSeats = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const { seats } = req.body;
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

    reservation.seats = reservation.seats.filter(
      (existingSeat) => {
        const [row, col] = existingSeat;
        if (event.seats[row][col] === 1) {
          event.seats[row][col] = 0;
          return false;
        }
        return true;
      }
    );
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
