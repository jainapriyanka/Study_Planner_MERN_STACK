const User = require('../models/userModel');
const { body, validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {sendEmail} =require("../controllers/mailController")

// Generate JWT
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
// };


exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Password hash
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Send Welcome Email
    const subject = "Welcome to Our Platform!";
    const text = `Hi ${name},\n\nThank you for registering on our platform. We're excited to have you on board!\n\nBest regards,\nTeam`;
    try {
      await sendEmail(email, subject, text);
      console.log("Welcome email sent successfully");
    } catch (emailError) {
      console.error("Error sending email:", emailError.message);
    }

    res.status(201).json({
      _id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      success: true,
      message: "User registered successfully",
      // No token generated here
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};



exports.loginUser = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send("User not found");
    }

    // Compare the password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token (using user ID and secret)
    const payload = {
      user: {
        id: user.id,
      },
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {algorithm: 'HS512', expiresIn: '30d' });  // Token expires in 30 days

    // Return user data with token
    res.status(200).json({
      success: true,
      userData: {
        id: user.id,
        name: user.name,
        email: user.email,
        token: token, // Send token back in response
      },
    });

  } catch (error) {
    console.error("Error occurred while login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

