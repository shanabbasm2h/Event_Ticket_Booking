const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.ObjectId,
    ref: "Event",
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  seats: [[Number]],
  price: Number,
  total: Number,
});

eventSchema.pre(/^find/, function (next) {
  this.populate({
    path: "event",
    select: "eventName",
  });
  next();
});

const Reservation = mongoose.model(
  "Reservation",
  reservationSchema
);

module.exports = Reservation;
