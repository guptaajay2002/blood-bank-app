const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { createInventoryController, getInventoryController, getDonorController, getHospitalController, getOrganisationController, getOrganisationForHospitalController, getInventoryHospitalController, getRecentInventoryController } = require('../controller/inventoryController');

const router = express.Router();

//Post inventory route
router.post("/create-inventory", authMiddleware ,createInventoryController);

//GET inventory data
router.get("/get-inventory", authMiddleware,getInventoryController);

//GET Hospital Blood Record
router.post("/get-inventory-hospital", authMiddleware,getInventoryHospitalController);

//GET Donor Record
router.get("/get-donors", authMiddleware,getDonorController);

//GET RECENT BLOOD RECORDS
router.get(
    "/get-recent-inventory",
    authMiddleware,
    getRecentInventoryController
  );

//GET Hospital Record
router.get("/get-hospitals", authMiddleware,getHospitalController);

//GET Organisation Record
router.get("/get-organisation", authMiddleware,getOrganisationController);

//GET Organisation For Hospital Record
router.get("/get-organisation-for-hospital", authMiddleware,getOrganisationForHospitalController);

module.exports = router;
