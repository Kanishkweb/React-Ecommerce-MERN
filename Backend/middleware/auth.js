const ErrorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/userModel"); // Import the User model

dotenv.config({ path: "Backend/config/config.env" });

exports.isAuthenticatedUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return next(
        new ErrorHandler("Please Login to access this resource", 401)
      );
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id);
    next();
  } catch (error) {
    next(
      new ErrorHandler("Unauthorized,Please Login to Acces the Resource", 401)
    ); // Pass the error to the error handling middleware
  }
};

exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return next(new ErrorHandler(`Unauthorized role: ${req.user.role}`, 403));
    }

    next();
  };
};
