import express from "express";
import { changeBookingStatus, checkAvailabilityofCars, createBooking, getOwnerBookings, getUserBookings } from "../controllers/bookingController.js";
import{ protect} from "../middleware/auth.js";
const bookingRoute = express.Router();
bookingRoute.post('/check-availability',checkAvailabilityofCars);
bookingRoute.post('/create',protect,createBooking);
bookingRoute.get('/user',protect,getUserBookings);
bookingRoute.get('/owner',protect,getOwnerBookings);
bookingRoute.post('/change-status',protect,changeBookingStatus);

export default bookingRoute;