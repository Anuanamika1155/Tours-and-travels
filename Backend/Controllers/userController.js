const User = require ("../Models/User.js")
const Tour = require("../Models/Tour.js")
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');


//Create User
// const createUser = async (req,res)=>{
//     console.log('Request body:', req.body);

//     try {
//         const newUser = new User(req.body);
//         const savedUser = await newUser.save();
//         res.status(200).json({ success: true, message: 'User created successfully', data: savedUser });
//     } catch (error) {
//         console.error('Error creating user:', error);
//         res.status(500).json({ success: false, message: 'Failed to create User', error: error.message });
//     }
// }

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
const userRegister = async(req,res)=>{
    const { UserName, Email, Password, ConfirmPassword } = req.body;
     try {

        if (!UserName || !Email || !Password || !ConfirmPassword) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const existingUser = await User.findOne({ Email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists." });
        }

        if (Password !== ConfirmPassword) {
            return res.status(400).json({ message: "Passwords do not match." });
        }


        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.Password, salt);
        
        const newUser = new User({
            UserName : req.body.UserName,
            Email : req.body.Email,
            Password : hashedPassword,
            ConfirmPassword : req.body.ConfirmPassword,
            Photo : req.body.Photo
        })
        await newUser.save();
        res.status(200).json({success: true, message: 'Successfully created'})
     } catch (error) {
        res.status(500).json({success: false, message: 'Failed to create'})
     }
}

//Update User
const updateUser = async(req,res)=>{
    const id = req.params.id
    try {
       const updatedUser = await User.findByIdAndUpdate(id,{
        $set: req.body
       },{new: true}) 
       res.status(200).json({ success: true, message: 'User updated successfully', data: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: 'failed to update'});
    }
}

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
const getCurrentUser = async (req, res) => {
    try {  
        const userEmail = req.params.email; // Assuming the email is passed as a parameter
        const user = await User.findOne({ Email: userEmail })
            .populate('ToursBooked')
            .select('-ConfirmPassword -Password');
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        console.log('User with populated ToursBooked:', user);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve user details', error: error.message });
    }
}



module.exports = { updateUser, deleteUser, getSingleUser, getAllUser, getUserBySearch, UserLogin, userRegister, getCurrentUser}
