const eventModel = require("../models/event.model");
const bookingModel = require("../models/booking.model");


//--------------Create Booking----------------------

const createBooking = async (req, res) => {
  const eventid = req.params.id;
  const userid = req.user.id;

  const findEvent = await eventModel.findOne({ _id: eventid });
  if (!findEvent) {
    return json({ message: "Event ID not found" });
  } else {
    await bookingModel.create({
      userId: userid,
      eventId: eventid,
    });

    res.status(200).json({ message: "New booking created successfully" });
  }
};

//--------------Delete Booking----------------------

const deleteBooking = async (req,res) =>{
      const bookingId = req.params.id;
      const findBooking = await bookingModel.findOne({_id : bookingId})
      if(!findBooking){
        res.status(404).json({ message: "Booking not found!!!" });
      } else {
         await bookingModel.findByIdAndDelete(bookingId)
         res.status(200).json({ message: "Booking deleted" });
      }
}

module.exports = { createBooking,deleteBooking };
