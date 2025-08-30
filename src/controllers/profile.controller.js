const bookingModel = require("../models/booking.model");
const eventModel = require("../models/event.model");

//-----------fetchEventByUserId------------

const fetchEventByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const Events = await eventModel.find({ createdBy: userId });
    if (!Events || Events.length === 0) {
      return res.status(200).json({
        message: "This user has not Created any event",
        total: 0,
        Events: [],
      });
    }
    return res.status(200).json({ total: Events.length, Events });
  } catch (error) {
    console.log(error);
  }
};

//-----------fetchTotalEventAUserRegister------------

const fetchTotalEventAUserRegister = async (req, res) => {
  try {
    const userId = req.user.id; // logged-in userId

    // Just count confirmed & paid bookings of this user
    const allEvent = await bookingModel.find({
      userId,
      status: "confirmed",
      paymentStatus: "paid",
    });

    if (!allEvent || allEvent.length === 0) {
      return res.status(200).json({
        message: "This user has not participated in any event",
        total: 0,
        allEvent: [],
      });
    }

    // Extract all eventIds from bookings
    const eventIds = allEvent.map((b) => b.eventId);

    // Fetch all events with those IDs
    const evntDetails = await eventModel.find({ _id: { $in: eventIds } });

    return res.status(200).json({
      total: allEvent.length,
      evntDetails, // list of booking documents
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
};

//-----------deleteEventById------------

const deleteEventById = async (req, res) => {
  try {
    const { eventId } = req.params;
    const findEvent = await eventModel.findOneAndDelete({ _id: eventId });
    res.status(200).json({
      message: "Event deleted successfully!!!!",
      deletedEvent: findEvent,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {fetchEventByUserId, deleteEventById, fetchTotalEventAUserRegister };
