export const formatISODate = (value: string): string => {
  if (!value)
    return 'n/d'
  let result = value
  if (value.length === 10)
    result += 'T00:00:00.000'

  else if (value.length === 24)
    result = result.substring(0, result.length - 1)

  const date = new Date(result)

  if (!Number.isNaN(date.getTime()))
    return date.toLocaleDateString('pt-BR')

  return 'n/d'
}
