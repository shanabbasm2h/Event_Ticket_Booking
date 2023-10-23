import express from "express";
import {
  bookSeat,
  createEvent,
  getEvents,
  getAllEventsLocation,
  getSeatsMap,
} from "./../controllers/eventController.js";
import { verifyToken } from "../controllers/authController.js";
const router = express.Router();

router.post("/", createEvent);
router.get("/location", getAllEventsLocation);
router.get("/location/:location", getEvents);
router.get("/:eventId", getSeatsMap);

router.patch("/:eventId", verifyToken, bookSeat);

export default router;
