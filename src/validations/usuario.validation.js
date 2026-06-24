const usuarioService = require('../services/usuario.service')
const { criarUsuarioSchema } = require('../validations/usuario.validation')

const { z } = require('zod')

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),

  senha: z
    .string()
    .min(1, 'Senha é obrigatória')
})

module.exports = { criarUsuarioSchema, loginSchema }