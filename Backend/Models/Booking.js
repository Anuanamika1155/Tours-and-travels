const mongoose = require('mongoose');

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

const bookingSchema = new mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true
    },
    UserName: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
    },
    TourName: {
        type: String,
        required: true,
    },
    Number_Of_Passengers: {
        type: Number,
        required: true,
    },
    Phone: {
        type: Number,
        required: true,
    },
    Departure_Date: {
        type: Date,
        required: true,
        validate: {
            validator: function(v) {
                return v <= this.Return_Date;
            },
            message: 'Departure date must be before return date.'
        }
    },
    Return_Date: {
        type: Date,
        required: true,
        validate: {
            validator: function(v) {
                const minGap = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
                return v - this.Departure_Date >= minGap;
            },
            message: 'Return date must be at least 3 days after the departure date.'
        }
    },
    Passengers: {
        type: [passengerSchema],
        validate: {
            validator: function(v) {
                return v.length > 0;
            },
            message: 'A booking must have at least one passenger.'
        },
        required: true
    }
});

module.exports = mongoose.model("Booking", bookingSchema);
