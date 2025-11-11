const express = require('express');
const productController = require('../controllers/productController');
const auth = require('../middlewares/auth');
const router = express.Router();

router.post('/', auth, productController.createProduct);

router.get('/', productController.getProducts);

router.get('/:id', productController.getProductById);

module.exports = router;