import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.ObjectId,
    ref: "Event",
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  paid: {
    type: Boolean,
    default: false,
  },
  seats: [[Number]],
  price: Number,
  total: Number,
});

reservationSchema.pre(/^find/, function (next) {
  this.populate({
    path: "event",
    select: "name image",
  });
  next();
});

const Reservation = mongoose.model(
  "Reservation",
  reservationSchema
);

export default Reservation;
