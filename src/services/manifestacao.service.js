const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const iaService = require('./ia.service')

function calcularDataLimite(dataRegistro, prazoDias = 20) {
  const dataLimite = new Date(dataRegistro)
  dataLimite.setDate(dataLimite.getDate() + prazoDias)
  return dataLimite
}

function statusMudou(statusAtual, novoStatus) {
  return statusAtual !== novoStatus
}

async function criar(dados) {
  const dataRegistro = new Date()
  const dataLimite = calcularDataLimite(dataRegistro, dados.prazoDias)

  let descricaoFormal = null
  let categoriaSugerida = dados.categoria
  let secretariaSugerida = dados.secretaria
  let prioridadeSugerida = dados.prioridade || 'MEDIO'

  try {
    const classificacao = await iaService.classificarManifestacao(dados.descricao)
    descricaoFormal = classificacao.descricaoFormal
    categoriaSugerida = classificacao.categoria
    secretariaSugerida = classificacao.secretaria
    prioridadeSugerida = classificacao.prioridade
  } catch (error) {
    console.log('IA indisponível, seguindo sem classificação automática:', error.message)
  }

  const manifestacao = await prisma.manifestacao.create({
    data: {
      tipo: dados.tipo,
      secretaria: secretariaSugerida,
      categoria: categoriaSugerida,
      descricao: dados.descricao,
      descricaoFormal,
      nomeCidadao: dados.nomeCidadao || null,
      telefone: dados.telefone || null,
      anonimo: dados.anonimo || false,
      rua: dados.rua || null,
      bairro: dados.bairro || null,
      dataLimite,
      prioridade: prioridadeSugerida,
    }
  })

  return manifestacao
}

async function listar() {
  const manifestacoes = await prisma.manifestacao.findMany({
    orderBy: { dataRegistro: 'desc' }
  })
  return manifestacoes
}

async function buscarPorId(id) {
  return await prisma.manifestacao.findUnique({
    where: { id }
  })
}

async function atualizarStatus(id, novoStatus, usuario) {
  const manifestacaoAtual = await prisma.manifestacao.findUnique({
    where: { id }
  })

  if (!manifestacaoAtual) {
    throw new Error('Manifestação não encontrada')
  }

  if (!statusMudou(manifestacaoAtual.status, novoStatus)) {
    return manifestacaoAtual
  }

  const manifestacaoAtualizada = await prisma.manifestacao.update({
    where: { id },
    data: { status: novoStatus }
  })

  await prisma.historicoStatus.create({
    data: {
      manifestacaoId: id,
      statusAnterior: manifestacaoAtual.status,
      statusNovo: novoStatus,
      usuarioId: usuario.id,
      usuarioNome: usuario.nome || usuario.email
    }
  })

  return manifestacaoAtualizada
}

async function buscarHistorico(manifestacaoId) {
  return await prisma.historicoStatus.findMany({
    where: { manifestacaoId },
    orderBy: { criadoEm: 'desc' }
  })
}

module.exports = { criar, listar, buscarPorId, atualizarStatus, buscarHistorico, calcularDataLimite, statusMudou }