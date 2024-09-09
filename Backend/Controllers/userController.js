const User = require ("../Models/User.js")
const Tour = require("../Models/Tour.js")
const Booking = require("../Models/Booking.js")
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');



//User Login
const UserLogin = async (req, res) => {
    const { Email, Password } = req.body;

    try {
        if (!Email || !Password) {
            return res.status(400).json({ message: "All fields are required." });
        }
       
        const user = await User.findOne({ Email });

        if (!user) {
            return res.status(500).send("User not found. Please Register");
        }

        // Check if the provided password matches the hashed password in the database
        const isPasswordValid = await bcrypt.compare(Password, user.Password);

        if (!isPasswordValid) {
            return res.status(500).send("Invalid email or password");
        }

        // If the email and password are valid, generate a JWT token
        const token = jwt.sign({ Email: user.Email }, process.env.JWT_SECRET_KEY, {
            expiresIn: "1hr",
        });

        // Set the token in cookies and headers for future requests
        res.cookie("token", token, {
            httpOnly : true,
            secure : true,
            maxAge : 1000 * 60 * 60,
        });
        res.setHeader("Authorization", `Bearer ${token}`);

        // Send a success response with the token
        res.status(200).json({ message: "Welcome User", token });
    } catch(error) {
        // Handle any errors that occur during the login process
        res.status(500).json({ message: "Error", error: error.message });
        console.log("error", error);
    }
};


//User Register
const userRegister = async (req, res) => {
    const { UserName, Email, Password, ConfirmPassword, Photo } = req.body;
    try {
        if (!UserName || !Email || !Password || !ConfirmPassword) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(Email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

        const existingUser = await User.findOne({ Email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists." });
        }

        if (Password !== ConfirmPassword) {
            return res.status(400).json({ message: "Passwords do not match." });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(Password, salt);

        const newUser = new User({
            UserName,
            Email,
            Password: hashedPassword,
            ConfirmPassword: hashedPassword,
            // Photo: Photo || '', // Default to empty string if not provided
        });

        await newUser.save();
        res.status(200).json({ success: true, message: 'Successfully created' });
    } catch (error) {
        console.error('Error in userRegister:', error);
        res.status(500).json({ success: false, message: 'Failed to create', error: error.message });
    }
};
  

//Update User
const updateUser = async (req, res) => {
    const id = req.params.id;
    try {
      const updatedUser = await User.findByIdAndUpdate(id, {
        $set: req.body
      }, { new: true });
  
      if (!updatedUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      // Fetch tours by user email after updating user info
      const userTours = await Booking.find({ UserEmail: updatedUser.Email });
  
      res.status(200).json({ success: true, message: 'User updated successfully', data: updatedUser, tours: userTours });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update user', error: error.message });
    }
  };
  

//Delete User
const deleteUser = async(req,res)=>{
    const id = req.params.id
    try {
       const deleteUser = await User.findByIdAndDelete(id) 
       res.status(200).json({ success: true, message: 'User Deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'failed to delete'});
    }
}

//Single User
const getSingleUser = async(req,res)=>{
    const id = req.params.id
    try {
    //    const user = await User.findById(id)
    const user = await User.findById(id).populate('ToursBooked'); 
    console.log(user);
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'Got requested User package', data: user });
} catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
}
}

//All Users
const getAllUser = async(req,res)=>{

    console.log("Page query parameter:", req.query.page);   
    try {
        const user = await User.find({})
        res.status(200).json({success: true, message: "Got all tour packages", data:user});
    } catch (error) {
        res.status(404).json({success:false, message:"Not found"})
    }
}

//Search User
const getUserBySearch = async(req,res)=>{

    const City = new RegExp(req.query.City, 'i')
    const Distance = parseInt(req.query.Distance)
    const MaxGroupSize = parseInt(req.query.MaxGroupSize)
    try {
        const User = await User.find({City, Distance:{$gte:Distance},MaxGroupSize:{$gte:MaxGroupSize}})
        res.status(200).json({success: true, message: "Successful", data:User})
    } catch (error) {
        res.status(404).json({success:false, message:"Not found"})
    }
}

//user Profile
// const getCurrentUser = async (req, res) => {
//     try {
//         const userEmail = req.params.email; // Assuming the email is passed as a parameter
//         console.log(`Fetching user with email: ${userEmail}`);
        
//         // Fetch user from the database, populating the 'ToursBooked' field
//         const user = await User.findOne({ Email: userEmail })
//             .populate('ToursBooked') // Ensure 'ToursBooked' matches the field in your User schema
//             .select('-ConfirmPassword -Password'); // Exclude sensitive fields
        
//         if (!user) {
//             // If user is not found, respond with a 404 status
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }
        
//         console.log('User with populated ToursBooked:', user);
//         // Respond with user data if found
//         res.status(200).json({ success: true, data: user });
//     } catch (error) {
//         // Log and respond with error if database query fails
//         console.error('Error fetching user:', error);
//         res.status(500).json({ success: false, message: 'Failed to retrieve user details', error: error.message });
//     }
// };

const getCurrentUser = async (req, res) => {
    try {
        const userEmail = req.params.email;
        console.log(`Fetching user with email: ${userEmail}`);
        
        // Fetch user from the database
        const user = await User.findOne({ Email: userEmail })
            .select('-ConfirmPassword -Password'); // Exclude sensitive fields
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Fetch bookings separately with passenger details
        const bookings = await Booking.find({ Email: userEmail }).select({
            TourName: 1,
            BookOn: 1,
            Number_Of_Passengers: 1,
            Passengers: 1
        });

        // Create a new object with user data and bookings
        const userWithBookings = {
            ...user.toObject(),
            ToursBooked: bookings.map(booking => ({
                TourName: booking.TourName,
                BookOn: booking.BookOn,
                Number_Of_Passengers: booking.Number_Of_Passengers,
                Passengers: booking.Passengers
            }))
        };
        
        console.log('User with fetched bookings:', userWithBookings);
        res.status(200).json({ success: true, data: userWithBookings });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve user details', error: error.message });
    }
};



module.exports = { updateUser, deleteUser, getSingleUser, getAllUser, getUserBySearch, UserLogin, userRegister, getCurrentUser}
