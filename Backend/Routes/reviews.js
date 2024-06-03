const express = require('express')
const reviewController = require('../Controllers/reviewController.js')
const verifyUser = require('../Utils/verifyToken.js')

const router = express.Router()

router.post('/:tourId', reviewController.createReview, verifyUser.verifyUser)


module.exports = router;