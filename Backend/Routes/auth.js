const express = require('express')
const authController = require('../Controllers/authController.js')
const {verifyAdmin} = require('../Utils/verifyToken.js')

const router = express.Router()

router.post('/adminlogin', authController.adminLogin)
router.get('/booked-tours', verifyAdmin, authController.viewBookedTours);
router.put('/update-tour/:id', verifyAdmin, authController.updateTour);
router.delete('/delete-tour/:id', verifyAdmin, authController.deleteTour);
// router.delete('/users', authController.getAllUser)

module.exports = router;