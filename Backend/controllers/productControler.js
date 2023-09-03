const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorHandler");
const ApiFeatures = require("../utils/apiFeatures");

// Create Product -- Admin
const createProduct = async (req, res, next) => {
  try {
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the product",
    });
  }
};

// Get All Products
const getAllProducts = async (req, res) => {
  try {
    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();

    const apiFeatures = new ApiFeatures(Product.find(), req.query)
      .search()
      .filter()
      .pagination(resultPerPage);
    const products = await apiFeatures.query;

    res.status(200).json({
      products,
      success: true,
      productsCount,
      resultPerPage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the products",
    });
  }
};

// Get Product Details
const getProductDetail = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHander("Product Not Found", 404));
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while pulling the detail of the product",
    });
  }
};

// Update Product -- Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHander("Product Not Found", 404));
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false, // for more mordern update operation
      }
    );

    res.status(200).json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the product",
    });
  }
};

// Delete Product
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHander("Product Not Found", 404));
    }

    await Product.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the product",
    });
  }
};

// Create New Review or Update the review
const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment, productId } = req.body;

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    let avg = 0;

    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      error: error,
    });
  }
};

// Get All Reviews of a Product
const getProductReviews = async (req, res, next) => {
  try {
    const product = await Product.findById(req.query.id);

    if (!product) {
      return next(new ErrorHander("Product not Found", 404));
    }

    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the product reviews",
    });
  }
};

// Delete Review
const deleteReview = async (req, res, next) => {
  try {
    const product = await Product.findById(req.query.productId);

    if (!product) {
      return next(new ErrorHander("Product Not Found", 404));
    }

    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id
    );

    let avg = 0;
    reviews.forEach((rev) => {
      avg += rev.rating;
    });

    const rating = avg / reviews.length;

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        rating,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the review",
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductDetail,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteReview,
};
