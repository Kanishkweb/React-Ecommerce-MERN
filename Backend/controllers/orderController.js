const Order = require("../models/orderModel");

const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const newOrder = async (req, res, next) => {
  try {
    const { shippingInfo, orderItems, paymentInfo, itemsPrice, shippingPrice } =
      req.body;

    // Validate that required data is present and these are mandatory
    if (
      !shippingInfo ||
      !orderItems ||
      !paymentInfo ||
      !itemsPrice ||
      !shippingPrice
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid data for creating an order",
      });
    }

    // Create the order using the provided data
    const order = new Order({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      shippingPrice,
      paidAt: Date.now(),
      user: req.user._id,
    });

    // Save the order to the database
    const createdOrder = await order.save();

    res.status(201).json({
      success: true,
      order: createdOrder,
    });
  } catch (error) {
    // Handle the error with an appropriate HTTP response
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the order",
    });
  }
};

// Get Single Order

const getSingleOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order)
      return next(new ErrorHander("Order not found with this Id", 404));

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log(error);
  }
};

// Get loggedin User Order

const myOrder = async (req, res, next) => {
  try {
    const orders = await Order.find({user:req.user.id})
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching your orders",
    });
  }
};

// Get all  Order -- Admin

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id });

    let totalAmount = 0;

    orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching your orders",
    });
  }
};
// Update Order Status -- Admin

const updateOrder = async (req, res, next) => {
  try {
    const order = await Order.find(req.params.id);

    if (order.orderStatus == "Delivered") {
      return next("You have already delivered this order", 400);
    }

    order.orderItems.forEach(async (o) => {
      await updateStock(o.Product, o.quantity);
    });

    order.orderStatus = req.body.status;

    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching your orders",
    });
  }
};

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.stock -= quantity;

  await product.save();
}

// Delete Order -- Admin

const deleteOrder = async (req, res, next) => {
  try {
    const orders = await Order.findById(req.params.id);
    if (!orders)
      return next(new ErrorHander("Order not found with this Id", 404));
    await Order.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching your orders",
    });
  }
};

module.exports = {
  newOrder,
  getSingleOrder,
  myOrder,
  deleteOrder,
  updateOrder,
  getAllOrders,
};
