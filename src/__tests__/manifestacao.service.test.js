const { calcularDataLimite } = require('../services/manifestacao.service')

describe('calcularDataLimite', () => {
  test('deve somar 20 dias por padrão quando prazoDias não for informado', () => {
    const dataRegistro = new Date('2026-06-01')
    const resultado = calcularDataLimite(dataRegistro)

    const esperado = new Date('2026-06-21')
    expect(resultado).toEqual(esperado)
  })

  test('deve somar exatamente 30 dias quando prazoDias for informado', () => {
    const dataRegistro = new Date('2026-06-01')
    const resultado = calcularDataLimite(dataRegistro, 30)

    const esperado = new Date('2026-07-01')
    expect(resultado).toEqual(esperado)
  })
})