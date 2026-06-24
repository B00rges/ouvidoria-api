require('dotenv').config()
const { classificarManifestacao } = require('./src/services/ia.service')

async function testar() {
  const resultado = await classificarManifestacao(
    'Tem um monte de lixo acumulado perto da escola do bairro e ninguém faz nada.'
  )
  console.log(resultado)
}

testar()