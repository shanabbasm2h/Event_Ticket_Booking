import {
  getUserReservations,
  cancelBookedSeats,
} from "../controllers/reservationController.js";
import { verifyToken } from "../controllers/authController.js";
import express from "express";

const router = express.Router();

router.get("/", verifyToken, getUserReservations);
router.patch(
  "/cancelBookedSeats/:reservationId",
  verifyToken,
  cancelBookedSeats
);

export default router;
