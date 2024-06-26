const express = require('express')
const Booking = require('../Controllers/bookingController.js')
const verifyUser = require('../Utils/verifyToken.js')

const router = express.Router()

router.post('/booknow', Booking.createBooking, verifyUser.verifyUser)
router.get('/:id', Booking.getBooking, verifyUser.verifyUser)
router.get('/', Booking.getAllBooking, verifyUser.verifyAdmin)
router.get('/email/:email', Booking.getBookingsByEmail, verifyUser.verifyUser); 
router.delete('/:id', Booking.deleteBooking, verifyUser.verifyAdmin)
router.get('/:id', Booking.getAllBooking, verifyUser.verifyAdmin)

module.exports = router;