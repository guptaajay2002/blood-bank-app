const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    role:{
        type : String,
        required : [true,"role is required"],
        enum : ['admin','hospital','organisation','donor']
    },
    name: {
        type: String,
        required: function() {
            if(this.role === 'admin' || this.role === 'donor'){
                return true;
            }
            return false;
        }
    },
    organisationName: {
        type: String,
        required : function() {
            if(this.role === 'organisation'){
                return true;
            }
            return false;
        }
    },
    HospitalName: {
        type: String,
        required : function() {
            if(this.role === 'hospital'){
                return true;
            }
            return false;
        }
    },
    password: {
        type: String,
        required: [true,"password is required"]
    },
    email: {
        type: String,
        unique : true,
        required: [true,"email is required"]
    },
    address:{
        type: String,
        required: [true,"address is required"]
    },
    website:{
        type: String,
    },
    phone:{
        type : String,
        required: [true,"phone number is required"]
    },
}, {timestamps : true}
);

module.exports = mongoose.model('users',userSchema);

