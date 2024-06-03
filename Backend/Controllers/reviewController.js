const Tour = require('../Models/Tour.js')
const Review = require('../Models/Review.js')

const createReview = async(req, res)=>{

    const tourId = req.params.tourId;
    const { Name, Feedback, Rating } = req.body;

    try {
        const newReview = new Review({ Name, Feedback, Rating });
        const savedReview = await newReview.save();
        
        await Tour.findByIdAndUpdate(tourId,{
            $push: {Reviews: savedReview._id}
        })
        res.status(200).json({success: true, message: "Review submitted", data:savedReview})
    } catch (error) {
        res.status(500).json({success: false, message: "Failed to submit"})
    }
}

module.exports = {createReview}