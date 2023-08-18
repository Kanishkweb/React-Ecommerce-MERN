const User = require("../models/userModel");
const ErrorHander = require("../utils/errorHandler");
const sendToken = require("../utils/jsonToken");

// Register a User
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if a user with the given email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // User already exists, return an error response
      return res.status(400).json({ error: 'User already exists' });
    }

    // If user doesn't exist, create a new user
    const newUser = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: 'This is a sample id',
        url: 'profilepicURL',
      },
    });

    sendToken(newUser, 201, res);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};





// Login User
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if the user has given both email and password
    if (!email || !password) {
      return next(new ErrorHander("Please Enter Email & Password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHander("Invalid Email or Password"));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return next(new ErrorHander("Invalid Email or Password", 401));
    }

    // If everything is fine, you can generate and send the JWT token here
    sendToken(user, 200, res);
  } catch (error) {
    console.log(error);
  }
};

// Logout User
const logout = async (req, res, next) => {
  try {
    res.cookie("token", null),
      {
        expires: new Date(Date.now()),
        httpOnly:true
      };
    res.status(200).json({
      success: true,
      message: "Logged Out Succesfully",
    });
  } catch (error) {
    console.log(error)
  }
};
module.exports = {
  registerUser,
  loginUser,
  logout,
};
