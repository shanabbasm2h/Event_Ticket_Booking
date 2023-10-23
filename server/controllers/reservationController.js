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

    //   console.log(seat);
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
    console.log("shan");
    res.status(404).json({ error: err.message });
  }
};
