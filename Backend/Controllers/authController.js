const admin = require('../Models/Admin.js')
const Tour = require ('../Models/Tour.js')
const Booking = require ('../Models/Booking.js')
const jwt = require('jsonwebtoken')


//Admin Login
const adminLogin = async(req, res)=>{
    try{
     const Email = req.body.Email;
     const Password = req.body.Password;
 
 
     console.log(Email,Password);
 
     if(Email !== "admin@gmail.com" || Password !== "Admin12"){
         throw new Error("Invalid Email or Password")
     }
             const token = jwt.sign({Email: admin.Email}, process.env.JWT_SECRET_KEY, {
                 expiresIn : "1hr",
             })
             res.cookie("token", token,{
                 httpOnly : true,
                 secure : true,
                 maxAge : 1000 * 60 * 60,
             })
             res.setHeader("Authorization", token)
                     console.log(token, "requeted token");
         
                     res.status(200).json({message: "Welcome Admin", token})
    } 
 
    
 catch (error){
     console.log(error);
     res.status(500).send("login failed")
 }
 }

 // View booked tours
const viewBookedTours = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('tour'); // Adjust the query based on your schema
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch booked tours' });
    }
};

// Update tour
const updateTour = async (req, res) => {
    try {
        const tourId = req.params.id;
        const updatedData = req.body;
        const updatedTour = await Tour.findByIdAndUpdate(tourId, updatedData, { new: true });
        if (!updatedTour) {
            return res.status(404).json({ error: 'Tour not found' });
        }
        res.status(200).json(updatedTour);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update tour' });
    }
};

// Delete tour
const deleteTour = async (req, res) => {
    try {
        const tourId = req.params.id;
        const deletedTour = await Tour.findByIdAndDelete(tourId);
        if (!deletedTour) {
            return res.status(404).json({ error: 'Tour not found' });
        }
        res.status(200).json({ message: 'Tour deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete tour' });
    }
};

module.exports = {adminLogin, viewBookedTours, updateTour, deleteTour}