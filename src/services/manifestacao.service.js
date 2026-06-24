const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


function calcularDataLimite(dataRegistro, prazoDias = 20) {
  const dataLimite = new Date(dataRegistro)
  dataLimite.setDate(dataLimite.getDate() + prazoDias)
  return dataLimite
}

async function criar(dados) {
  const dataRegistro = new Date()
  const dataLimite = calcularDataLimite(dataRegistro, dados.prazoDias)

  const manifestacao = await prisma.manifestacao.create({
    data: {
      tipo: dados.tipo,
      secretaria: dados.secretaria,
      categoria: dados.categoria,
      descricao: dados.descricao,
      nomeCidadao: dados.nomeCidadao || null,
      telefone: dados.telefone || null,
      anonimo: dados.anonimo || false,
      rua: dados.rua || null,
      bairro: dados.bairro || null,
      dataLimite,
      prioridade: dados.prioridade || 'MEDIO',
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

  // Verificação nova: se não mudou nada, para aqui
  if (manifestacaoAtual.status === novoStatus) {
    return manifestacaoAtual
  }

  // Só chega aqui se o status realmente mudou
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


module.exports = { criar, listar, buscarPorId, atualizarStatus, buscarHistorico, calcularDataLimite }
