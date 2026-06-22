const manifestacaoService = require('../services/manifestacao.service')


async function criar(req, res) {
  try {
    const dados = req.body
    const manifestacao = await manifestacaoService.criar(dados)
    return res.status(201).json(manifestacao)
  } catch (error) {
    return res.status(400).json({ erro: error.message })
  }
}

async function listar(req, res) {
  try {
    const manifestacoes = await manifestacaoService.listar()
    console.log(manifestacoes) 
    return res.status(200).json(manifestacoes)
  } catch (error) {
    return res.status(500).json({ erro: error.message })
  }
}

async function buscarPorId(req, res) {
  try {
    const { id } = req.params
    const manifestacao = await manifestacaoService.buscarPorId(id)

    if (!manifestacao) {
      return res.status(404).json({ erro: 'Manifestação não encontrada' })
    }

    return res.status(200).json(manifestacao)
  } catch (error) {
    return res.status(500).json({ erro: error.message })
  }
}

async function atualizarStatus(req, res) {
  try {
    const { id } = req.params
    const { status } = req.body
    const usuario = req.usuario
    
    const manifestacao = await manifestacaoService.atualizarStatus(id, status, usuario)
    
    return res.status(200).json(manifestacao)
  } catch (error) {
    return res.status(500).json({ erro: error.message })
  }
}

async function buscarHistorico(req, res) {
  try {
    const { id } = req.params
    const historico = await manifestacaoService.buscarHistorico(id)

    return res.status(200).json(historico)
  } catch (error) {
    return res.status(500).json({ erro: error.message })
  }
}


module.exports = { criar, listar, buscarPorId, atualizarStatus, buscarHistorico }
