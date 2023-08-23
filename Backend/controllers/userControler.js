const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const ErrorHander = require("../utils/errorHandler");
const sendToken = require("../utils/jsonToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// Register a User
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if a user with the given email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // User already exists, return an error response
      return res.status(400).json({ error: "User already exists" });
    }

    // If user doesn't exist, create a new user
    const newUser = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: "This is a sample id",
        url: "profilepicURL",
      },
    });

    sendToken(newUser, 201, res);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
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
        httpOnly: true,
      };
    res.status(200).json({
      success: true,
      message: "Logged Out Succesfully",
    });
  } catch (error) {
    console.log(error);
  }
};

// Forgot Password
const forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHander("User not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset Token is -: \n\n${resetPasswordUrl} \n\n If you have not requested Email then Please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHander(error.message, 500));
  }
};

// Reset Password

const resetPassword = async (req, res, next) => {
  try {
    // Creating token hash
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(
        new ErrorHander(
          "Reset Password Token is invalid or has been expired",
          400
        )
      );
    }

    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHander("Password Does't match", 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
  } catch (error) {
    console.log(error);
  }
};

// Get User Detail

const getUserDetails = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
};

// Get All USer (admin)

const getAllUser = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);
  }
};
// Get single User (admin)

const getSingleUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
        new ErrorHander(`User Doesn't exist with ID: ${req.params.id}`)
      );
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};
// Update User Detail

const updateUserPassword = async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatch = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatch) {
    return next(new ErrorHander("Old Password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHander("password does not match", 400));
  }

  if (req.body.newPassword === req.body.confirmPassword) {
    await user.save();
    sendToken(user, 200, res);
  }
};

// Update User Role by - (admin)
const updateProfile = async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindandModify: false,
  });

  res.status(200).json({
    success: true,
  });
};

// Delete User Role by - (admin)
const deleteProfile = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHander(`User not found with ${req.params.id}`));
  }

  await User.deleteOne({ _id: req.params.id });
  res.status(200).json({
    success: true,
  });
};

module.exports = {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updateUserPassword,
  getAllUser,
  getSingleUser,
  deleteProfile,
  updateProfile,
};
