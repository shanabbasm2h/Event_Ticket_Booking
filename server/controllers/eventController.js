import Event from "./../models/eventModel.js";
import Reservation from "../models/reservationModel.js";

export const createEvent = async (req, res) => {
  try {
    const { name, price, location, image, seatLayout } =
      req.body;
    const seats = seatLayout
      .split(",")
      .map((count) => new Array(parseInt(count)).fill(0));

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
      image,
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
    // const events = await Event.distinct("location");

    const events = await Event.aggregate([
      {
        $group: {
          _id: "$location",
          image: { $first: "$image" },
        },
      },
      {
        $project: {
          location: "$_id",
          image: 1,
          _id: 0,
        },
      },
    ]);
    if (!events)
      return res.status(404).json({
        status: "fail",
        message: "No event found with that location!",
      });
    res
      .status(200)
      .json({ status: "success", data: events });
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

export const updateEvent = async (req, res) => {
  try {
    if (req.body.seatLayout) {
      const seats = req.body.seatLayout
        .split(",")
        .map((count) => new Array(parseInt(count)).fill(0));

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
      req.body.seats = seats;
      req.body.availableSeats = countSeats.availableSeats;
      req.body.bookedSeats = countSeats.bookSeats || 0;
      delete req.body.seatLayout;
    }
    const event = await Event.findOneAndUpdate(
      { _id: req.params.eventId },
      req.body,
      {
        new: true,
      }
    );

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

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({});
    if (!events)
      return res.status(404).json({
        status: "fail",
        message: "No event found",
      });
    res
      .status(200)
      .json({ status: "success", data: events });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const deleteEvent = async (req, res) => {
  const event = await Event.findByIdAndDelete(
    req.params.eventId
  );

  if (!event) {
    return next(
      new AppError("No document found with that ID", 404)
    );
  }
  const events = await Event.find({});

  res.status(200).json({
    status: "success",
    data: events,
  });
};
