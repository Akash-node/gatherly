const Razorpay = require("razorpay");
const crypto = require("crypto");
const bookingModel = require("../models/booking.model");
const eventModel = require("../models/event.model");
const userModel = require('../models/user.model')
const { sendTicketMail } = require("../middleware/ticketgenarator");

//--------------Create Booking----------------------
// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Step 1: Create Razorpay Order
const createBooking = async (req, res) => {
  try {
    const eventid = req.params.id;
    const userid = req.user.id;
    const userMail = req.user.email;
    const userName = req.user.name;

    // Check if user already booked
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
    const findEvent = await eventModel.findById(eventid);
    if (!findEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Amount in paise (Razorpay works with smallest unit)
    const amount = findEvent.price * 100;

    // Create Razorpay Order
    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);

    // Create booking with pending payment
    const booking = await bookingModel.create({
      userId: userid,
      eventId: eventid,
      amount: findEvent.price,
      orderId: order.id,
      status: "pending",
      paymentStatus: "unpaid",
    });

    res.status(200).json({
      success: true,
      order,
      bookingId: booking._id,
      key: process.env.RAZORPAY_KEY_ID, // frontend needs this
    });
  } catch (error) {
    console.error("❌ Error creating booking:", error.message);
    res
      .status(500)
      .json({ message: "Something went wrong while creating booking" });
  }
};

// Step 2: Verify Payment after success
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Update booking
    const booking = await bookingModel.findByIdAndUpdate(
      bookingId,
      {
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        paymentStatus: "paid",
        status: "confirmed",
      },
      { new: true }
    );

    // Send ticket mail 🎟️
    const event = await eventModel.findById(booking.eventId);
    const user = req.user; // assuming middleware provides user info
    sendTicketMail(
      user.email,
      user.name,
      booking.userId,
      booking.eventId,
      event.title,
      event.date,
      event.time,
      event.venue
    );

    res
      .status(200)
      .json({ success: true, message: "Payment verified & booking confirmed" });
  } catch (error) {
    console.error("❌ Error verifying payment:", error.message);
    res
      .status(500)
      .json({ message: "Something went wrong while verifying payment" });
  }
};

//--------------Check If user is already register or not----------------------

const userAlreadyRegisterOrNot = async (req, res) => {
  const userId = req.user.id;
  const eventId = req.params.id;

  const Registered = await bookingModel.findOne({
    userId,
    eventId,
    status: "confirmed",
    paymentStatus: "paid",
  });

  res.json({ registered: !!Registered });
};

//--------------Update User attendence---------------------

const upadteUserAttendence = async (req, res) => {
  try {
    const { userId, eventId } = req.body;

    const alreadyAttended = await bookingModel.find(
      {
        userId,
        eventId,
        attend: true,
      } 
    );

    if (alreadyAttended) {
      return res
        .status(404)
        .json({ message: "User Already attend this event" });
    }

    const booking = await bookingModel.findOneAndUpdate(
      { userId, eventId }, // filter
      { $set: { attend: true } }, // update
      { new: true } // return updated document
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json({ message: "Attendance updated", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

//--------------Retreive Attended Users---------------------

const attendedUsers = async (req, res) => {
  const {eventId} = req.body;

  const userList = await bookingModel.find({
    eventId,
    status: "confirmed",
    paymentStatus: "paid",
    attend: true,
  });

  if (!userList) {
    return res.status(404).json({
      message: "No User Found",
    });
  }
  const userIds = userList.map((b) => b.userId);

  const userDetails = await userModel
    .find({ _id: { $in: userIds } })
    .select("-password");

  return res.status(200).json({
    total: userList.length,
    userDetails,
  });
};

module.exports = {
  createBooking,
  verifyPayment,
  userAlreadyRegisterOrNot,
  upadteUserAttendence,
  attendedUsers,
};
