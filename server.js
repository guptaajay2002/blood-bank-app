const express = require('express');
const app = express();
const dotenv = require('dotenv');
const colors = require('colors');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const path = require('path');
//.env
dotenv.config();

// connect to db
connectDB();

//middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

//router
//Route 1
app.use("/api/v1/test",require("./routes/testRoute"));
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/inventory", require("./routes/inventoryRoutes"));
app.use("/api/v1/analytics", require("./routes/analyticsRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));

//STATIC FOLDER
app.use(express.static(path.join(__dirname,'./client/build')))

//STATIC ROUTE
app.get('*',function(req,res){
    res.sendFile(path.join(__dirname,'./client/build/index.html'))
})

//Port
const PORT = process.env.PORT || 8080;

//listen
app.listen(PORT, () =>{
    console.log(`Node server is running in ${process.env.DEV_MODE} mode on port ${process.env.PORT}`.bgBlue.white);
})