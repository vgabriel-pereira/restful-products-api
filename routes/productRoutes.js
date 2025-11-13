const express = require('express');
const productController = require('../controllers/productController');
const auth = require('../middlewares/auth');
const router = express.Router();
const validateId = require('../middlewares/validateIdProduct');
const roleAuth = require('../middlewares/roleAuthProduct');

router.post('/', auth, productController.createProduct);

router.get('/', productController.getProducts);

router.get('/:id', validateId, productController.getProductById);

router.put('/:id', auth, validateId, roleAuth, productController.updateProduct);

router.delete('/:id', auth, validateId, roleAuth, productController.deleteProduct);

module.exports = router;