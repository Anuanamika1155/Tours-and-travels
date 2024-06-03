const Review = require('../Models/Review.js');
const Tour = require('../Models/Tour.js')

//create Tour
const createTour = async (req,res)=>{
    console.log('Request body:', req.body);

    try {
        const newTour = new Tour(req.body);
        const savedTour = await newTour.save();
        res.status(200).json({ success: true, message: 'Tour created successfully', data: savedTour });
    } catch (error) {
        console.error('Error creating tour:', error);
        res.status(500).json({ success: false, message: 'Failed to create tour', error: error.message });
    }
}

//Update Tour
const updateTour = async(req,res)=>{
    const id = req.params.id
    try {
       const updatedTour = await Tour.findByIdAndUpdate(id,{
        $set: req.body
       },{new: true}) 
       res.status(200).json({ success: true, message: 'Tour updated successfully', data: updatedTour });
    } catch (error) {
        res.status(500).json({ success: false, message: 'failed to update'});
    }
}

//Delete Tour
const deleteTour = async(req,res)=>{
    const id = req.params.id
    try {
       const deleteTour = await Tour.findByIdAndDelete(id) 
       res.status(200).json({ success: true, message: 'Tour Deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'failed to delete'});
    }
}

//getSingle Tour
const getSingleTour = async(req,res)=>{
    const id = req.params.id
    try {
       const tour = await Tour.findById(id).populate('Reviews')
       res.status(200).json({ success: true, message: 'Got requested tour package', data: tour });
    } catch (error) {
        res.status(404).json({ success: false, message: 'Not found'});
    }
}

//getAll Tour
const getAllTour = async(req,res)=>{
    console.log("Page query parameter:", req.query.page);
    const page = parseInt(req.query.page)
console.log("Parsed page:",page)  
    try {
         const tours = await Tour.find({}).populate('Reviews')
         console.log("Fetched tours:", tours);
        res.status(200).json({success: true,count: tours.length, message: "Got all tour packages", data:tours});
    } catch (error) {
        console.error("Error fetching tour packages:", error);
        res.status(500).json({ success: false, message: "Failed to fetch tour packages", error: error.message });    }
}
//Search Tour
const getTourBySearch = async(req,res)=>{

    const City = new RegExp(req.query.City, 'i')
    const MaxGroupSize = parseInt(req.query.MaxGroupSize)
    try {
        const tours = await Tour.find({City,MaxGroupSize:{$gte:MaxGroupSize}}).populate('Reviews')
        res.status(200).json({success: true, message: "Successful", data:tours})
    } catch (error) {
        res.status(404).json({success:false, message:"Not found"})
    }
}

//getFeatured Tour
const getFeaturedTour = async(req,res)=>{
    try {
     const tours = await Tour.find({Featured: true}).populate('Reviews')
     res.status(200).json({success: true, message: "Successful", data:tours})
    } catch (error) {
        res.status(404).json({success:false, message:"Not found"}) 
    }
}

//getTourCount
const getTourCount = async(req,res)=>{
    try {
        const tourCount = await Tour.estimatedDocumentCount();
        res.status(200).json({success: true, data: tourCount})
    } catch (error) {
        res.status(500).json({success: false, message: "Failed to fetch"})
    }
}

module.exports = {createTour, updateTour, deleteTour, getSingleTour, getAllTour, getTourBySearch, getFeaturedTour, getTourCount}
