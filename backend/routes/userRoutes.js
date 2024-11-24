const router = require("express").Router();

const {
    registerUser,
    loginUser,
} = require("../controllers/authController");
const {
    resetPassword,
    otpGenerate,
    verifyOTP
} = require("../controllers/userController");

/************************ Auth Routes ************************/
router.post("/register", registerUser); // User signup
router.post("/login", loginUser);     // User login

/************************ User Routes ************************/
router.put("/reset-password", resetPassword); 
router.post("/generate-otp", otpGenerate);     
router.post("/verify-otp", verifyOTP); 

module.exports = router;
