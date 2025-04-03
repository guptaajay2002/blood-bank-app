const  mongoose  = require("mongoose");
const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");

const createInventoryController = async (req,res) => {
      try{
        const { email } = req.body;
        const user = await userModel.findOne({email});
        //Validation
        if(!user){
             throw new Error("User not found");
        }
     //    if(inventoryType === 'in' && user.role !== 'donor'){
     //         throw new Error("Not a donor account");
     //    }
     //    if(inventoryType === 'out' && user.role !== 'hospital'){
     //         throw new Error("Not a hospital");
     //    }
         if(req.body.inventoryType == 'out'){
             const requestedBloodGroup = req.body.bloodGroup;
             const requestedQuantityOfBlood = req.body.quantity;
             const organisation = new mongoose.Types.ObjectId(req.body.userId);

             //calculate IN blood quantity
             const totalInOfRequestedBlood = await inventoryModel.aggregate([
               {$match:{
                    organisation,
                    inventoryType:'in',
                    bloodGroup: requestedBloodGroup
               }},{
                    $group:{
                         _id:'$bloodGroup',
                         total:{$sum: '$quantity'}
                    }
               }
             ]);
             const totalIn = totalInOfRequestedBlood[0]?.total || 0;
             //calculate OUT blood quantity
             const totalOutOfRequestedBlood = await inventoryModel.aggregate([
               {$match:{
                    organisation,
                    inventoryType:'out',
                    bloodGroup: requestedBloodGroup
               }},{
                    $group:{
                         _id:'$bloodGroup',
                         total:{$sum: '$quantity'}
                    }
               }
             ]);
             const totalOut = totalOutOfRequestedBlood[0]?.total || 0;
             const availableQuantityOfBlood = totalIn - totalOut;

             //Quantity Validation
             if(availableQuantityOfBlood < requestedQuantityOfBlood){
               return res.status(500).send({
                    success : false,
                    message : `Only ${availableQuantityOfBlood}ML of ${requestedBloodGroup.toUpperCase()} is available.`
               })
             }
             req.body.hospital = user?._id;
         }
         else{
          req.body.donor = user?._id;
         }
        const inventory = new inventoryModel(req.body);
        await inventory.save();
        return res.status(201).send({
            success: true,
            message: "New blood record added",
        });

      }catch(error){
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in create inventory api",
            error,
        });
      }
};

//Get blood records
const getInventoryController = async (req,res) => {
          try{
             const inventory = await inventoryModel.find({organisation: req.body.userId})
               .populate("donor").populate("hospital").sort({createdAt : -1});
             return res.status(200).send({
               success: true,
               message: "get all records successfully",
               inventory,
             });

          }catch(error){
               console.log(error);
               return res.status(500).send({
                    success: false,
                    message: "Error in get inventory",
                    error,
               });
          }
};

//Get Hospital blood records
const getInventoryHospitalController = async (req,res) => {
     try{
        const inventory = await inventoryModel.find(req.body.filters)
          .populate("donor").populate("hospital").populate("organisation").sort({createdAt : -1});
        return res.status(200).send({
          success: true,
          message: "get hospital blood records successfully",
          inventory,
        });

     }catch(error){
          console.log(error);
          return res.status(500).send({
               success: false,
               message: "Error in get inventory",
               error,
          });
     }
};

// GET BLOOD RECORD OF 3
const getRecentInventoryController = async (req, res) => {
     try {
       const inventory = await inventoryModel
         .find({
           organisation: req.body.userId,
         })
         .limit(3)
         .sort({ createdAt: -1 });
       return res.status(200).send({
         success: true,
         message: "recent Invenotry Data",
         inventory,
       });
     } catch (error) {
       console.log(error);
       return res.status(500).send({
         success: false,
         message: "Error In Recent Inventory API",
         error,
       });
     }
   };

// GET DONOR RECORD
const getDonorController = async(req,res) => {
     try{
        const organisation = req.body.userId;
        //find donor
        const donorId = await inventoryModel.distinct("donor",{organisation});
        
        const donors = await userModel.find({_id: {$in: donorId}});
        return res.status(200).send({
          success: true,
          message: "Donor Record fetched successfully",
          donors,
        })
     }catch(error){
          console.log(error);
          return res.status(500).send({
               success: false,
               message: "Error in donor records"
          });
     }
};

// Get hospital record
const getHospitalController = async (req,res) => {
     try{
          const organisation = req.body.userId;
          console.log(organisation);
          //Get hopsital ID
          const hospitalId = await inventoryModel.distinct("hospital",{organisation})
          console.log(hospitalId);
          //Find Hospital 
          const hospitals = await userModel.find({_id: {$in : hospitalId}});
          return res.status(200).send({
               success: true,
               message: "Hospital Data Fetched Successfully",
               hospitals
          });
     }catch(error){
          console.log(error);
          return res.status(500).send({
               success: false,
               message: "Error in Hopital API",
               error
          })
     }
};

const getOrganisationController = async (req,res) => {
     try{
          const donor = req.body.userId;
          console.log(donor);
          //Get Organisation ID
          const orgId = await inventoryModel.distinct("organisation", {donor});
          console.log(orgId);
          //Find Organisation
          const organisations = await userModel.find({_id: {$in : orgId}});
          return res.status(200).send({
               success: true,
               message: "Organisation Data Fetched Successfully",
               organisations
          });
     }catch(error){
          console.log(error);
          return res.status(500).send({
               success: false,
               message: "Error in Organisation API",
               error
          })
     }
};

const getOrganisationForHospitalController = async (req,res) => {
     try{
          const hospital = req.body.userId;
          console.log(hospital);
          //Get Organisation ID
          const orgId = await inventoryModel.distinct("organisation", {hospital});
          console.log(orgId);
          //Find Organisation
          const organisations = await userModel.find({_id: {$in : orgId}});
          console.log(organisations);
          return res.status(200).send({
               success: true,
               message: " Hospital Organisation Data Fetched Successfully",
               organisations
          });
     }catch(error){
          console.log(error);
          return res.status(500).send({
               success: false,
               message: "Error in Organisation Hospital API",
               error
          })
     }
};
module.exports = { createInventoryController, getInventoryController, 
     getDonorController,getHospitalController,getOrganisationController,
     getOrganisationForHospitalController,getInventoryHospitalController, getRecentInventoryController};