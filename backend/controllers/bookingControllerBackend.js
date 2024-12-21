import mongoose from "mongoose";
import Bookings from "../models/bookingModelBackend.js";
import Movie from "../models/movieModelBackend.js";
import User from "../models/userModelBackend.js";

export const newBooking = async (req, res, next) => {
  const { movie, date, seatNumber, user } = req.body;

  try {
    const existingMovie = await Movie.findById(movie);
    const existingUser = await User.findById(user);

    if (!existingMovie) {
      return res.status(404).json({ message: "Movie not found with the given ID" });
    }
    if (!existingUser) {
      return res.status(404).json({ message: "User not found with the given ID" });
    }

    const booking = new Bookings({
      movie,
      date: new Date(date),
      seatNumber,
      user,
    });

    const session = await mongoose.startSession();
    session.startTransaction();
    existingUser.bookings.push(booking);
    existingMovie.bookings.push(booking);
    await existingUser.save({ session });
    await existingMovie.save({ session });
    await booking.save({ session });
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({ booking });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message || "Failed to create a booking" });
  }
};

export const getBookingById = async (req, res, next) => {
  const id = req.params.id;

  try {
    const booking = await Bookings.findById(id).populate("movie user");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json({ booking });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message || "Failed to fetch booking" });
  }
};

export const deleteBooking = async (req, res, next) => {
  const id = req.params.id;

  try {
    const booking = await Bookings.findByIdAndRemove(id).populate("user movie");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    booking.user.bookings.pull(booking);
    booking.movie.bookings.pull(booking);
    await booking.user.save({ session });
    await booking.movie.save({ session });
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ message: "Successfully deleted booking" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message || "Failed to delete booking" });
  }
};
