const Booking = require('../Models/Booking.js')

//create booking
const createBooking = async(req,res)=>{
    const newBooking = new Booking(req.body)
    try {
        const savedBooking = await newBooking.save()
        res.status(200).json({success: true, message: "Your tour booked succesfully", data: savedBooking})
    } catch (error) {
        res.status(500).json({success: false, message: "Internal server error"})
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

module.exports = {createBooking, getBooking, getAllBooking}