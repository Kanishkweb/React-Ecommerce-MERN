const { request } = require("http");
const Product = require("../models/productModel")
const ErrorHander = require("../utils/errorHandler")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
// Create Product -- Admin

exports.createProduct =catchAsyncErrors(
    async (req, res, next) => {

        const product = await Product.create(req.body);
    
        res.status(201).json({
            success: true,
            product
        })
    }
)


// Get All Product
exports.getAllProducts =catchAsyncErrors(
    async (req, res) => {
        const products = await Product.find();
        res.status(200).json({
            products,
            success: true
        })
    }
    
)

// Get Product Details

exports.getProductDetail = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return next(new ErrorHander("Product Not Found", 404))
        }


        return res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while pulling the detail of the product"
        });
    }
}
// Update Product -- Admin

exports.updateProduct = catchAsyncErrors(
    async (req, res, next) => {

        let product = Product.findById(req.params.id);
    
        if (!product) {
            return next(new ErrorHander("Product Not Found", 404))
        }
    
        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true, useFindAndModify: false,
        })
        res.status(200).json({
            success: true,
            product
        })
    }
)

// Delete Product 

exports.deleteProduct = catchAsyncErrors(
    async (req, res, next) => {

        try {
            const product = await Product.findById(req.params.id);
    
            if (!product) {
                return next(new ErrorHander("Product Not Found", 404))
            }
    
            await Product.deleteOne({ _id: req.params.id });
    
            return res.status(200).json({
                success: true,
                message: "Product deleted successfully"
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "An error occurred while deleting the product"
            });
        }
    }

)