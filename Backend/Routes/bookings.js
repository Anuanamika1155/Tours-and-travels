const express = require('express')
const Booking = require('../Controllers/bookingController.js')
const verifyUser = require('../Utils/verifyToken.js')

const router = express.Router()

router.post('/booknow', Booking.createBooking, verifyUser.verifyUser)
router.get('/:id', Booking.getBooking, verifyUser.verifyUser)
router.get('/', Booking.getAllBooking, verifyUser.verifyAdmin)

module.exports = router;