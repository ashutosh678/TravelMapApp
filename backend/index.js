const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const pinRoute = require("./routes/pins");
const userRoute = require("./routes/users");
const cookieParser = require('cookie-parser');
const cors = require("cors");


const app = express();

// app.use(cors());
app.use(cors({
    origin:['http://localhost:3000'],
    optionSuccessStatus:200,
    credentials:true,
    exposedHeaders: 'Authorization'
}));

dotenv.config();

// app.use(cookieParser('your-secret-key', {
//     sameSite: 'none',
//     secure: true
// }));
  

app.use(express.json())

mongoose 
 .connect(process.env.MONGO_URL, {
        useNewUrlParser: true })   
 .then(() => console.log("MongoDB connected!"))
 .catch(err => console.log(err));

app.use("/api/pins", pinRoute)
app.use("/api/users", userRoute)

app.listen(8800 ,()=>{
    console.log("Backend is running on port 8800");
})