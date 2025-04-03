const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () =>{
    try{
       await mongoose.connect(process.env.MONGO_URL);
       console.log(`Connected to mongoose database ${mongoose.connection.host}`);

    }
    catch(error){
       console.log(`Mongoose database Error ${error}`.bgRed.white)
    }
}
module.exports = connectDB ;