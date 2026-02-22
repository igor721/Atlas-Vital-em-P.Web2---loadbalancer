
import React, { useState, useMemo } from 'react'
import { Search, ChevronUp, ChevronDown } from 'lucide-react'

const TabelaResultados = ({ dados, filters, tipoVisao, onItemClick }) => {
  const [busca, setBusca] = useState('')
  const [ordenacao, setOrdenacao] = useState({ campo: 'nome', direcao: 'asc' })
  const [paginaAtual, setPaginaAtual] = useState(1)
  const itensPorPagina = 10

  const formatNumber = new Intl.NumberFormat('pt-BR')

  
  const dadosFiltrados = useMemo(() => {
    if (!busca.trim()) return dados
    return dados.filter(item => 
      item.nome?.toLowerCase().includes(busca.toLowerCase())
    )
  }, [dados, busca])

 
  const dadosOrdenados = useMemo(() => {
    return [...dadosFiltrados].sort((a, b) => {
      let valorA = a[ordenacao.campo]
      let valorB = b[ordenacao.campo]

      if (ordenacao.campo === 'totalRegistros') {
        valorA = valorA || 0
        valorB = valorB || 0
        return ordenacao.direcao === 'asc' ? valorA - valorB : valorB - valorA
      }

    
      if (typeof valorA === 'string') {
        valorA = valorA.toLowerCase()
        valorB = valorB.toLowerCase()
      }

      if (valorA < valorB) return ordenacao.direcao === 'asc' ? -1 : 1
      if (valorA > valorB) return ordenacao.direcao === 'asc' ? 1 : -1
      return 0
    })
  }, [dadosFiltrados, ordenacao])


  const totalPaginas = Math.ceil(dadosOrdenados.length / itensPorPagina)
  const indiceInicio = (paginaAtual - 1) * itensPorPagina
  const dadosPaginados = dadosOrdenados.slice(indiceInicio, indiceInicio + itensPorPagina)

  const handleOrdenacao = (campo) => {
    setOrdenacao(prev => ({
      campo,
      direcao: prev.campo === campo && prev.direcao === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handlePaginacao = (pagina) => {
    setPaginaAtual(Math.max(1, Math.min(pagina, totalPaginas)))
  }

  const getTipoLabel = (tipo) => {
    switch (tipo) {
      case 'nascimentos': return 'Nascimentos'
      case 'obitos': return 'Óbitos'
      case 'casamentos': return 'Casamentos'
      case 'todos': return 'Registros'
      default: return 'Registros'
    }
  }

  return (
    <div className="bg-white rounded-b-lg shadow-sm border border-t-0">
     
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={`Buscar ${tipoVisao === 'municipios' ? 'município' : 'estado'}...`}
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

    
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleOrdenacao('nome')}
              >
                <div className="flex items-center">
                  {tipoVisao === 'municipios' ? 'Município' : 'Estado'}
                  {ordenacao.campo === 'nome' && (
                    ordenacao.direcao === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleOrdenacao('totalRegistros')}
              >
                <div className="flex items-center justify-end">
                  {getTipoLabel(filters.tipoRegistro)}
                  {ordenacao.campo === 'totalRegistros' && (
                    ordenacao.direcao === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dadosPaginados.length === 0 ? (
              <tr>
                <td colSpan="2" className="px-6 py-8 text-center text-gray-500">
                  Nenhum resultado encontrado
                </td>
              </tr>
            ) : (
              dadosPaginados.map((item) => (
                <tr 
                  key={item.id}
                  className={`hover:bg-gray-50 ${onItemClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onItemClick && onItemClick(item)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.nome}
                    </div>
                    {item.sigla && (
                      <div className="text-sm text-gray-500">
                        {item.sigla}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatNumber.format(item.totalRegistros || 0)}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      
      {totalPaginas > 1 && (
        <div className="px-6 py-3 border-t bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando {indiceInicio + 1} a {Math.min(indiceInicio + itensPorPagina, dadosOrdenados.length)} de {dadosOrdenados.length} resultados
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => handlePaginacao(paginaAtual - 1)}
              disabled={paginaAtual === 1}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Anterior
            </button>
            {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
              const pagina = i + 1
              return (
                <button
                  key={pagina}
                  onClick={() => handlePaginacao(pagina)}
                  className={`px-3 py-1 text-sm border rounded ${
                    paginaAtual === pagina 
                      ? 'bg-green-600 text-white border-green-600' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {pagina}
                </button>
              )
            })}
            <button
              onClick={() => handlePaginacao(paginaAtual + 1)}
              disabled={paginaAtual === totalPaginas}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Próximo
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TabelaResultados
