import express from "express";
import { bookSeat } from "./../controllers/eventController.js";
const router = express.Router();

router.post("/:eventId", bookSeat);

export default router;
