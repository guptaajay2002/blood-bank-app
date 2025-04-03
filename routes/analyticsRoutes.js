const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { bloodGroupDetailController } = require('../controller/analyticsController');

const router = express.Router();


//GET Blood data
router.get("/bloodGroups-data", authMiddleware,bloodGroupDetailController);

module.exports = router;
