export const formatCurrency = (value: string | number | bigint): string => {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
  const valueNumber = Number(value)

  if (Number.isNaN(valueNumber))
    return formatter.format(0).replace(/\s/g, ' ')

  return formatter.format(valueNumber).replace(/\s/g, ' ')
}
