const { z } = require('zod')

const criarUsuarioSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),

  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),

  senha: z
    .string()
    .min(10, 'A senha deve ter pelo menos 10 caracteres'),

  cargo: z.enum(['ADMIN', 'OUVIDOR', 'ATENDENTE'], {
    errorMap: () => ({
      message: 'Cargo inválido. Use: ADMIN, OUVIDOR ou ATENDENTE'
    })
  })
})

module.exports = { criarUsuarioSchema }