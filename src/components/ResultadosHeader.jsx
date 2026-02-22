import React, { useMemo } from 'react'
import { calcularTotal } from '../utils/utils'

const ResultadosHeader = ({ filters, estadoSelecionado, nomeEstado, estatisticasEstados }) => {
  const getTipoLabel = (tipo) => {
    switch (tipo) {
      case 'nascimentos': return 'Nascimentos'
      case 'obitos': return 'Óbitos'
      case 'casamentos': return 'Casamentos'
      case 'todos': return 'Todos os Registros'
      default: return 'Registros'
    }
  }

  const formatNumber = new Intl.NumberFormat('pt-BR')

  const totalRegistros = useMemo(() => {
    return calcularTotal(estatisticasEstados, filters, estadoSelecionado)
  }, [estatisticasEstados, filters, estadoSelecionado])

  return (
    <div className="bg-white px-6 py-4 border-b rounded-t-lg">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {estadoSelecionado ? `Municípios - ${nomeEstado}` : 'Estados do Brasil'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {getTipoLabel(filters.tipoRegistro)} • Ano {filters.ano}
            {filters.mes !== 'todos' && ` • Mês ${filters.mes}`}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">
            {formatNumber.format(totalRegistros)}
          </div>
          <div className="text-sm text-gray-500">
            Total de Registros
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultadosHeader
