const express = require('express')
const app = express()

const manifestacaoRoutes = require('./routes/manifestacao.routes')
const usuarioRoutes = require('./routes/usuario.routes')

app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok', mensagem: 'Ouvidoria API funcionando!' })
})

app.use('/manifestacoes', manifestacaoRoutes)
app.use('/usuarios', usuarioRoutes)

module.exports = app