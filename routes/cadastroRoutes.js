const express = require('express')
const controller  = require('../controllers/cadastroController')

const router = express.Router()

router.post('/', controller.cadastro)

module.exports = router