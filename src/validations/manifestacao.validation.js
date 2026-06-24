const { z } = require('zod')

const criarManifestacaoSchema = z.object({
  tipo: z.enum(['RECLAMACAO', 'DENUNCIA', 'SUGESTAO', 'SOLICITACAO', 'DUVIDA', 'ELOGIO'], {
    errorMap: () => ({ message: 'Tipo inválido. Use: RECLAMACAO, DENUNCIA, SUGESTAO, SOLICITACAO, DUVIDA ou ELOGIO' })
  }),
  secretaria: z.string().min(1, 'Secretaria é obrigatória'),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  descricao: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  nomeCidadao: z.string().optional(),
  telefone: z.string().optional(),
  anonimo: z.boolean().optional(),
  rua: z.string().optional(),
  bairro: z.string().optional(),
  prioridade: z.enum(['ALTO', 'MEDIO', 'BAIXO']).optional(),
  prazoDias: z.number().optional()
})

const atualizarStatusSchema = z.object({
  status: z.enum(['EM_ANDAMENTO', 'ATENDIDO', 'ARQUIVADO', 'ATRASADO'], {
    errorMap: () => ({ message: 'Status inválido. Use: EM_ANDAMENTO, ATENDIDO, ARQUIVADO ou ATRASADO' })
  })
})

module.exports = { criarManifestacaoSchema, atualizarStatusSchema }