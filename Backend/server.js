const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')

// const bodyParser = require('body-parser');
// const axios = require('axios'); 
// const { v4: uuidv4 } = require('uuid');

const tourRoute = require('./Routes/tours.js')
const userRoute = require('./Routes/user.js')
const authRouter = require('./Routes/auth.js')
const reviewRouter = require('./Routes/reviews.js')
const bookingRouter = require('./Routes/bookings.js')

dotenv.config()
const app = express()
const port = process.env.PORT || 8000
const corsOption = {
    origin : true,
    credentials : true
}

const connect = async()=>{
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/Tours",{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // debug: true
        })
        console.log("MongoDB Database Connected");
    } catch (error) {
        console.log("MongoDB databace connection failed");
    }
}

app.use(express.json())
app.use(cors(corsOption))
app.use(cookieParser())
app.use(cors({
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}))

app.use('/tours',tourRoute)
app.use('/user',userRoute)
app.use('/admin',authRouter)
app.use('/review',reviewRouter)
app.use('/booking',bookingRouter)
app.use('/uploads', express.static('uploads'));


// app.post('/api/processPayment', async (req, res) => {
//     const { paymentData, bookingDetails } = req.body;
  
//     // Simulated backend processing of Google Pay payment
//     try {
//       const transactionId = uuidv4(); // Generate a unique transaction ID
//       // Simulate processing time
//       await new Promise(resolve => setTimeout(resolve, 2000));
  
//       // Here, you would integrate with a real payment gateway or API
//       // For demo purposes, we'll just log the payment data
//       console.log('Payment processed successfully:', paymentData);
  
//       // Return a response indicating success
//       res.status(200).json({ success: true, transactionId });
//     } catch (error) {
//       console.error('Error processing payment:', error);
//       res.status(500).json({ success: false, error: 'Payment processing failed' });
//     }
//   });

  

app.listen(port, ()=>{
    connect()
    console.log('Server listening on port', port);
})