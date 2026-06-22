const usuarioService = require('../services/usuario.service')
const { criarUsuarioSchema } = require('../validations/usuario.validation')

async function criar(req, res) {
  try {
    const dadosValidados = criarUsuarioSchema.parse(req.body)
    const usuario = await usuarioService.criar(dadosValidados)
    return res.status(201).json(usuario)
  } catch (error) {
    if (error.name === 'ZodError') {
  return res.status(400).json({ erro: 'Dados inválidos', detalhes: error.issues })
}
    return res.status(400).json({ erro: error.message })
  }
}

async function login (req, res) {
  try {
    const { email, senha } = req.body
    const resultado = await usuarioService.login(email, senha)
    
    return res.status(200).json(resultado)
  } catch (error) {
    return res.status(400).json({ erro: error.message })
  }
}

async function listar(req, res) {
  try {
    const usuario = await usuarioService.listar()
    return res.status(200).json(usuario)
  } catch (error) {
    return res.status(500).json({ erro: error.message })
  }
}

module.exports = { criar, login, listar }