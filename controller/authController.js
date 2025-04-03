const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');


const registerController = async (req,res) => {
     try{
        const existingUser = await userModel.findOne({email: req.body.email});
        //Validation
        if(existingUser){
            return res.status(200).send({
                success: false,
                message: "User already exist.",
                existingUser,
            });
        }
        //password hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hashSync(req.body.password, salt);
        req.body.password = hashedPassword;
        console.log(hashedPassword);
        //rest data
        const user = new userModel(req.body);
        await user.save();
        return res.status(201).send({
            success: true,
            message: "User registered successfully",
            user
        });
     }catch(error){
        console.log("Error in Register API");
        res.status(500).send({
            success: false,
            error
        });
     }
};

const loginController = async (req , res) => {
    try{
         const user = await userModel.findOne({email : req.body.email});
         if(!user){
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
         }
         //Check the role of user
         if(user.role !== req.body.role){
            console.log(user.role);
            return res.status(500).send({
                success: false,
                messsage: "role does not match",
            });
         }
         //Compare password
         const comparePassword = await bcrypt.compare(req.body.password, user.password);
         if(!comparePassword){
            return res.status(500).send({
                success: false,
                message: "Invalid Credential.",
            });
         }
         const userId = user._id.toString();
         const token = jwt.sign({ userId: userId},"sdtfeegaddfsdf",{expiresIn : '2d'});
         return res.status(202).send({
            success: true,
            message: "Login Successfully",
            token,
            user,
         });
         
    }catch(error){
         console.log(error);
         res.status(500).send({
            success: false,
            message : "Error in login API",
         });
    }
   
};

const currentUserController = async (req,res) => {
    try{
        const user = await userModel.findOne({_id : req.body.userId});
        return res.status(200).send({
            success: true,
            message: "User fetched successfully",
            user,
        });
    }catch(error){
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Current user not found",
            error,
        });
    }
       

};

module.exports = {registerController,loginController,currentUserController};