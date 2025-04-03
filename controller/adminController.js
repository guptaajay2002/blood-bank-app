const userModel = require("../models/userModel");

//GET DONAR LIST
const getDonorListController = async (req, res) => {
  try {
    const donorData = await userModel
      .find({ role: "donor" })
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      Toatlcount: donorData.length,
      message: "Donor List Fetched Successfully",
      donorData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Donor List API",
      error,
    });
  }
};

//GET HOSPITAL LIST
const getHospitalListController = async (req, res) => {
    try {
      const hospitalData = await userModel
        .find({ role: "hospital" })
        .sort({ createdAt: -1 });
  
      return res.status(200).send({
        success: true,
        Toatlcount: hospitalData.length,
        message: "HOSPITAL List Fetched Successfully",
        hospitalData,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Error In Hospital List API",
        error,
      });
    }
  };
  //GET ORG LIST
  const getOrgListController = async (req, res) => {
    try {
      const orgData = await userModel
        .find({ role: "organisation" })
        .sort({ createdAt: -1 });
  
      return res.status(200).send({
        success: true,
        Toatlcount: orgData.length,
        message: "ORG List Fetched Successfully",
        orgData,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Error In ORG List API",
        error,
      });
    }
  };

  /// Delete Donor Data
  const deleteDonorController = async (req,res) => {
    try{
        console.log(req.params.id);
        await userModel.findByIdAndDelete(req.params.id);
        return res.status(200).send({
            success: true,
            message: "Successfully deleted the data",
        })

    }catch(error){
        return res.status(500).send({
            success: false,
            message: "Error while deleting data",
            error,
        })
    }
  };

module.exports = {getDonorListController,getHospitalListController,getOrgListController,deleteDonorController}