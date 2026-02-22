export const calcularTotal = (estatisticasEstados, filters, estadoId = null) => {
  if (estadoId) {
    const stats = estatisticasEstados[estadoId] || []
    return stats.reduce((sum, stat) => {
      if (stat.ano !== filters.ano) return sum
      switch (filters.tipoRegistro) {
        case 'nascimentos':
          return sum + (stat.total_nascimento || 0)
        case 'obitos':
          return sum + (stat.total_morte || 0)
        case 'casamentos':
          return sum + (stat.total_casamento || 0)
        case 'todos':
          return sum + (stat.total_nascimento || 0) + (stat.total_morte || 0) + (stat.total_casamento || 0)
        default:
          return sum
      }
    }, 0)
  } else {
    return Object.values(estatisticasEstados).reduce((totalEstados, stats) => {
      return totalEstados + stats.reduce((sum, stat) => {
        if (stat.ano !== filters.ano) return sum
        switch (filters.tipoRegistro) {
          case 'nascimentos':
            return sum + (stat.total_nascimento || 0)
          case 'obitos':
            return sum + (stat.total_morte || 0)
          case 'casamentos':
            return sum + (stat.total_casamento || 0)
          case 'todos':
            return sum + (stat.total_nascimento || 0) + (stat.total_morte || 0) + (stat.total_casamento || 0)
          default:
            return sum
        }
      }, 0)
    }, 0)
  }
}
