const eventModel = require("../models/event.model");
const bookingModel = require("../models/booking.model");
const { sendTicketMail } = require("../middleware/ticketgenarator");

//--------------Create Booking----------------------

const createBooking = async (req, res) => {
  try {
    const eventid = req.params.id;
    const userid = req.user.id;
    const userMail = req.user.email;
    const userName = req.user.name;

    // Check if User already booked for event
    const bookingAlreadyExist = await bookingModel.findOne({
      eventId: eventid,
      userId: userid,
    });
    if (bookingAlreadyExist) {
      return res
        .status(400)
        .json({ message: "User already booked this event" });
    }

    // Check if event exists
    const findEvent = await eventModel.findOne({ _id: eventid });
    if (!findEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Create new booking
    await bookingModel.create({
      userId: userid,
      eventId: eventid,
    });

    //sending ticket mail with pdf

    // sendTicketMail(
    //   userMail,
    //   userName,
    //   userid,
    //   eventid,
    //   findEvent.title,
    //   findEvent.date,
    //   findEvent.time,
    //   findEvent.venue
    // );

    res.status(200).json({ message: "New booking created successfully" });
  } catch (error) {
    console.error("❌ Error creating booking:", error.message);
    res
      .status(500)
      .json({ message: "Something went wrong while creating booking" });
  }
};

//--------------Delete Booking----------------------

const deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const findBooking = await bookingModel.findOne({ _id: bookingId });
    if (!findBooking) {
      res.status(404).json({ message: "Booking not found!!!" });
    } else {
      await bookingModel.findByIdAndDelete(bookingId);
      res.status(200).json({ message: "Booking deleted" });
    }
  } catch (error) {
    console.error("❌ Error Deleting booking:", error.message);
    res
      .status(500)
      .json({ message: "Something went wrong while Deleting booking" });
  }
};

module.exports = { createBooking, deleteBooking };
