const express = require("express");
const { registerController, loginController, currentUserController }= require("../controller/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

//Register || POST
router.post("/register",registerController);

//Login || POST
router.post("/login", loginController);

//Get Current-User
router.get("/current-user",authMiddleware, currentUserController);

module.exports = router;