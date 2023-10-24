import {
  getUserReservations,
  cancelBookedSeats,
  bookSeat,
  getCheckoutSession,
  paymentSuccess,
} from "../controllers/reservationController.js";
import { verifyToken } from "../controllers/authController.js";
import express from "express";

const router = express.Router();

router.get("/", verifyToken, getUserReservations);
router.get(
  "/reservationPayment/:reservationId",
  paymentSuccess
);
router.patch("/:eventId", verifyToken, bookSeat);
router.patch(
  "/cancelBookedSeats/:reservationId",
  verifyToken,
  cancelBookedSeats
);
router.get(
  "/checkout/:reservationId",
  verifyToken,
  getCheckoutSession
);

export default router;
