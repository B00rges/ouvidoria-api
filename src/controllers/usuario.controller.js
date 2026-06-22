const usuarioService = require('../services/usuario.service')

async function criar(req, res) {
  try {
    const dados = req.body
    const usuario = await usuarioService.criar(dados)
    return res.status(201).json(usuario)
  } catch (error) {
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