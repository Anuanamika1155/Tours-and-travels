const mongoose = require('mongoose')

const passengerSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Age: {
        type: Number,
        required: true
    },
    Gender: {
        type: String,
        required: true
    }
});

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
        },
        Passengers: {
            type: [passengerSchema],
            validate: {
                validator: function (v) {
                    return v.length > 0;
                },
                message: 'A booking must have at least one passenger.'
            },
            required: true
        }
    }
)

module.exports = mongoose.model("Booking",bookingSchema)