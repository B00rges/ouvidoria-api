const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function limpar() {
  await prisma.usuario.deleteMany({})
  console.log('Usuários apagados com sucesso!')
  process.exit(0)
}

limpar().catch((err) => {
  console.error('Erro:', err.message)
  process.exit(1)
})