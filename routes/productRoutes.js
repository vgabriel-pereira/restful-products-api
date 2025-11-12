const express = require('express');
const productController = require('../controllers/productController');
const auth = require('../middlewares/auth');
const router = express.Router();
const validateId = require('../middlewares/validateId');

router.post('/', auth, productController.createProduct);

router.get('/', productController.getProducts);

router.get('/:id', validateId, productController.getProductById);

router.put('/:id', auth, validateId, productController.updateProduct);

router.delete('/:id', auth, validateId, productController.deleteProduct);

module.exports = router;