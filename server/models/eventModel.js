import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  eventName: String,
  price: Number,
  seatsAvailable: Number,
  location: String,
  seats: {
    type: [[Number]],
    default: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
  },
  reservations: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
      seats: [[Number]],
      price: Number,
      total: Number,
    },
  ],
});

eventSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name",
  });
  next();
});

const Event = mongoose.model("Event", movieSchema);
