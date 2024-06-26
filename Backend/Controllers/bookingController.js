const Booking = require('../Models/Booking.js')

//create booking
const createBooking = async(req,res)=>{
    
  if (!req.body.Passengers || req.body.Passengers.length === 0) {
    return res.status(400).json({
        success: false,
        message: "A booking must have at least one passenger."
    });
}

const newBooking = new Booking(req.body);
    try {
        const savedBooking = await newBooking.save();
        res.status(200).json({
          success: true,
          message: "Your tour booked successfully",
          data: savedBooking
        });
      } catch (error) {
        console.error('Error creating booking:', error); // Enhanced error logging
        res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error.message // Optional: Include the error message in the response
        });
      }
}

//getSingle booking
const getBooking = async(req,res)=>{
    const id = req.params.id
    try {
        const book = await Booking.findById(id)
        res.status(200).json({success: true, message: "Successful", data: book})
    } catch (error) {
        res.status(404).json({success: false, message: "Not found"})   
    }
}

//getAll booking
const getAllBooking = async(req,res)=>{
    try {
        const books = await Booking.find()
        res.status(200).json({success: true, message: "Successful", data: books})
    } catch (error) {
        res.status(500).json({success: false, message: "Internal server error"})   
    }
}

//delete booking
const deleteBooking = async (req, res) => {
  const id = req.params.id;
  try {
    const deleteTour = await Booking.findByIdAndDelete(id); 
    if (!deleteTour) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.status(200).json({ success: true, message: 'BookedTour Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete' });
  }
}

//getBookingBy Email
const getBookingsByEmail = async (req, res) => {
  const email = req.params.email;
  console.log(`Fetching bookings for email: ${email}`);

  try {
    const bookings = await Booking.find({ Email: email });
    if (bookings.length === 0) {
        console.log('No bookings found');
        res.status(404).json({ success: false, message: "Not found" });
    } else {
        console.log(`Found bookings: ${bookings}`);
        res.status(200).json({ success: true, message: "Successful", data: bookings });
    }
} catch (error) {
    console.error(`Error fetching bookings: ${error}`);
    res.status(404).json({ success: false, message: "Not found222" });
}
};

module.exports = {createBooking, getBooking, getAllBooking, deleteBooking,getBookingsByEmail}