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
        },
        Password : {
            type: String,
            required: true,
        },
        ConfirmPassword : {
            type: String,
            required: true
        },
        Photo : {
            type: String,
            required: false,
        }
    }
)

module.exports = mongoose.model("User",userSchema)