const mongoose = require ('mongoose')

const userSchema = new mongoose.Schema(
    {
        UserName : {
            type: String,
            required: true,
        },
        Email : {
            type: String,
            required: true,
            unique: true
            
        },
        Password : {
            type: String,
            required: true,
        },
        ConfirmPassword : {
            type: String,
            required: true
        },
        // Photo : {
        //     type: String,
        //     required: false,
        // },
        ToursBooked: [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking'
        }
    ],
    }
)

module.exports = mongoose.model("User",userSchema)