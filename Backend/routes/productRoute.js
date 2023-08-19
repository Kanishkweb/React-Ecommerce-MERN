const express = require('express');
const { getAllProducts,createProduct, updateProduct,deleteProduct, getProductDetail } = require('../controllers/productControler');
const { isAuthenticatedUser,authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.route("/products").get(isAuthenticatedUser,authorizeRoles("admin"),getAllProducts);

router.route("/products/new").post(createProduct);

router.route("/products/:id").put(updateProduct).delete(deleteProduct).get(getProductDetail)



module.exports = router;