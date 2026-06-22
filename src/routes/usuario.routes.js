const express = require('express')
const router = express.Router()
const usuarioController = require('../controllers/usuario.controller')
const verificarToken = require('../middlewares/auth.middleware')

router.post('/', usuarioController.criar)
router.post('/login', usuarioController.login)
router.get('/', verificarToken, usuarioController.listar)

module.exports = router