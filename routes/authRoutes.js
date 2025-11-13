const express = require('express');
const controller  = require('../controllers/authController')
const auth = require('../middlewares/auth');
const validateId = require('../middlewares/validateIdAuth');

const router = express.Router()
router.post('/register', controller.register)
router.post('/login', controller.login)
router.get('/profile/:id', auth, validateId, controller.getProfile)
router.patch('/update/:id', auth, validateId, controller.updateUser)
router.delete('/delete/:id', auth, validateId, controller.deleteUser)

module.exports = router