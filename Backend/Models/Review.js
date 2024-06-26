const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema(
    {
        // ProductId : {
        //     type: mongoose.Types.ObjectId,
        //     ref: 'Tour'
        // }, 
        Name : {
            type: String,
            required: true,
        },
        Feedback : {
            type: String,
            required: true,
        },
        Rating : {
            type: Number,
            required: true,
        }
    }
)

module.exports = mongoose.model("Review",reviewSchema)