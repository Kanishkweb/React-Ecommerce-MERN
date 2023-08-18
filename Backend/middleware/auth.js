const ErrorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const User = require('../models/userModel'); // Import the User model

dotenv.config({ path: "Backend/config/config.env" });

exports.isAuthenticatedUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return next(new ErrorHandler("Please Login to access this resource", 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id);
    next();
  } catch (error) {
    next(new ErrorHandler("Unauthorized", 401)); // Pass the error to the error handling middleware
  }
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`Role ${req.user.role} is not allowed to access this resource`, 403)
      );
    }

    next();
  };
};
