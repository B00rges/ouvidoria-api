const express = require('express')
const router = express.Router()
const manifestacaoController = require('../controllers/manifestacao.controller')
const verificarToken = require('../middlewares/auth.middleware')

router.post('/', manifestacaoController.criar)
router.get('/', manifestacaoController.listar)
router.get('/:id', manifestacaoController.buscarPorId)
router.put('/:id/status', verificarToken, manifestacaoController.atualizarStatus)
router.get('/:id/historico', verificarToken, manifestacaoController.buscarHistorico)

module.exports = router