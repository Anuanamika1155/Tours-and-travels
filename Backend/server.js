const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')


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
  

app.listen(port, ()=>{
    connect()
    console.log('Server listening on port', port);
})