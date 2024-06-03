const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema(
    {
        UserId : {
            type: String,
        },
        UserName : {
            type: String,
            required: true,
        },
        Email : {
            type: String,
            required: true,
        },
        TourName: {
            type: String,
            required: true,
        },
        Number_Of_Passengers : {
            type: Number,
            required: true,
        },
        Phone: {
            type: Number,
            required: true,
        },
        BookOn  : {
            type: Date,
            required: true,
        }
    }
)

module.exports = mongoose.model("Booking",bookingSchema)