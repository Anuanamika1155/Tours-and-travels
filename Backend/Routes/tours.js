const express = require('express')
const tour = require('../Controllers/tourController')
const router = express.Router()
const vrifyAdmin = require('../Utils/verifyToken.js')


router.post('/',tour.createTour, vrifyAdmin.verifyAdmin);
router.put('/:id',tour.updateTour, vrifyAdmin.verifyAdmin);
router.delete('/:id', tour.deleteTour, vrifyAdmin.verifyAdmin)
router.get('/:id', tour.getSingleTour)
router.get('/', tour.getAllTour)
router.get('/search/gettourbysearch',tour.getTourBySearch)
router.get('/search/featuredtour', tour.getFeaturedTour)
router.get('/search/tourcount', tour.getTourCount)

module.exports = router;
