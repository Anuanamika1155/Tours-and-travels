const mongoose = require ('mongoose')

const tourSchema = new mongoose.Schema(
    {
        UserId : {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }, 
        Title : {
            type: String,
            required: true,
        },
        City : {
            type: String,
            required: true
        },
        Address : {
            type: String,
            required: true
        },
        Distance : {
            type: String,
            required: true
        },
        Photo : {
            type: String,
            required: true
        },
        Description : {
            type: String,
            required: false
        },
        Price : {
            type: Number,
            required: true
        },
        MaxGroupSize :{
            type: Number,
            required: true
        },
        Reviews : [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
            required: false
        }],
        Featured : {
            type: Boolean,
            default: false
        },

    },
    {timeseries : true}
)
module.exports = mongoose.model("Tour",tourSchema)

