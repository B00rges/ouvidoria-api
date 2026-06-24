const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

async function classificarManifestacao(descricao) {
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

 const prompt = `
Você é um assistente de uma Ouvidoria Municipal. Analise o texto de uma manifestação de cidadão e responda APENAS com um JSON válido, sem nenhum texto antes ou depois, no formato:

{
  "categoria": "uma categoria curta e objetiva, ex: Limpeza Urbana, Buraco na via, Falta de medicamento",
  "secretaria": "uma das seguintes: Saúde, Mobilidade, Meio Ambiente, Educação, Administração, Finanças",
  "prioridade": "ALTO, MEDIO ou BAIXO, dependendo da urgência e risco descrito",
  "descricaoFormal": "o relato reescrito em linguagem formal e institucional, seguindo EXATAMENTE esta estrutura: comece com 'Cidadã(o) entrou em contato para relatar [o que aconteceu, com local e detalhes relevantes]. [Uma frase complementar sobre o impacto ou contexto].' e termine sempre com 'Diante do exposto, solicita providências.'"
}

Texto do cidadão: "${descricao}"
`

  const resultado = await model.generateContent(prompt)
  const textoResposta = resultado.response.text()

  const jsonLimpo = textoResposta.replace(/```json|```/g, '').trim()

  return JSON.parse(jsonLimpo)
}

module.exports = { classificarManifestacao }