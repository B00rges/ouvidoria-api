const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function criar(dados) {
  const senhaHash = await bcrypt.hash(dados.senha, 10)

  const usuario = await prisma.usuario.create({
    data: {
      nome: dados.nome,
      email: dados.email,
      senha: senhaHash,
      cargo: dados.cargo || null
    }
  })

  // Nunca retorna a senha, nem o hash, para o cliente
  const { senha, ...usuarioSemSenha } = usuario
  return usuarioSemSenha
}

const jwt = require('jsonwebtoken')

async function login(email, senha) {
  const usuario = await prisma.usuario.findUnique({
    where: { email }
  })

  if (!usuario) {
    throw new Error('Email ou senha inválidos')
  }

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha)

  if (!senhaCorreta) {
    throw new Error('Email ou senha inválidos')
  }

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  )

  return { token }
}

async function listar() {
  const usuarios = await prisma.usuario.findMany({
    select: {
      id: true,
      nome: true,
      email: true,
      cargo: true,
      createdAt: true
    }
  })

  return usuarios
}

module.exports = { criar, login, listar }
