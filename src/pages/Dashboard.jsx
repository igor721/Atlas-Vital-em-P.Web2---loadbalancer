import React, { useState, useEffect, useMemo } from 'react'
import { ArrowLeft } from 'lucide-react'

import FilterSection from '../components/FilterSection'
import MapaBrasil from '../components/MapaBrasil'
import ResultadosHeader from '../components/ResultadosHeader'
import TabelaResultados from '../components/TabelaResultados'

import { useEstados } from '../hooks/useEstados'
import { useMunicipios } from '../hooks/useMunicipios'
import apiService from '../services/api'
import { calcularTotal } from '../utils/utils'

const Dashboard = () => {
  const [filters, setFilters] = useState({
    tipoRegistro: 'todos',
    ano: 2025,
    mes: 'todos',
    regiao: 'todas',
    estado: 'todos'
  })

  const [regioes, setRegioes] = useState([])
  const [estadoSelecionado, setEstadoSelecionado] = useState(null)
  const [loading, setLoading] = useState(false)

  const {
    estados,
    estatisticasEstados,
    loading: loadingEstados,
    getTotalByEstado,
    getEstadoById
  } = useEstados(filters.ano, filters.regiao)
  
  const { municipios, loading: loadingMunicipios, getTotalByMunicipio } =
    useMunicipios(estadoSelecionado, filters.ano)

 
  useEffect(() => {
    const fetchRegioes = async () => {
      try {
        const regioesData = await apiService.getRegioes()
        setRegioes(regioesData)
      } catch (error) {
        console.error('Erro ao carregar regiões', error)
      }
    }
    fetchRegioes()
  }, [])


  useEffect(() => {
    setEstadoSelecionado(null)
  }, [filters.regiao, filters.ano])

  const dadosProcessados = useMemo(() => {
    if (estadoSelecionado) {
      return municipios.map(municipio => ({
        ...municipio,
        totalRegistros: getTotalByMunicipio(municipio.id, filters.tipoRegistro, filters.ano)
      }))
    } else {
      return estados.map(estado => ({
        ...estado,
        totalRegistros: getTotalByEstado(estado.id, filters.tipoRegistro, filters.ano)
      }))
    }
  }, [estados, municipios, estadoSelecionado, filters, getTotalByEstado, getTotalByMunicipio])

  const totalRegistros = useMemo(() => {
    return calcularTotal(estatisticasEstados, filters, estadoSelecionado)
  }, [estatisticasEstados, filters, estadoSelecionado])

  const handleFiltersChange = (newFilters) => setFilters(newFilters)

  const handleSearch = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }

  const handleEstadoClick = (estadoId) => {
    const estado = getEstadoById(parseInt(estadoId))
    if (estado) {
      setEstadoSelecionado(parseInt(estadoId))
    }
  }

  const handleVoltarEstados = () => setEstadoSelecionado(null)
  const estadoAtual = estadoSelecionado ? getEstadoById(estadoSelecionado) : null

  return (
    <div className="p-6"> 
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Estatísticas Vitais do Brasil
        </h1>
        <p className="text-gray-600">
          Dados de nascimentos, óbitos e casamentos por estado e município
        </p>
      </div>

      <div className="mb-6">
        <FilterSection
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onSearch={handleSearch}
          regioes={regioes}
          loading={loading || loadingEstados}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <MapaBrasil
            onEstadoClick={handleEstadoClick}
            estadoSelecionado={estadoSelecionado?.toString()}
            estatisticasEstados={estatisticasEstados}
            filters={filters}
          />
        </div>

        <div className="space-y-0">
          <ResultadosHeader
            filters={filters}
            totalRegistros={totalRegistros}
            estadoSelecionado={estadoSelecionado}
            nomeEstado={estadoAtual?.nome}
            estatisticasEstados={estatisticasEstados}
          />

          {estadoSelecionado && (
            <div className="bg-white px-4 py-2 border-b">
              <button
                onClick={handleVoltarEstados}
                className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                <ArrowLeft size={16} className="mr-1" />
                Voltar para Estados
              </button>
            </div>
          )}

          <TabelaResultados
            dados={dadosProcessados}
            filters={filters}
            tipoVisao={estadoSelecionado ? 'municipios' : 'estados'}
            onItemClick={estadoSelecionado ? null : (estado) => handleEstadoClick(estado.id)}
          />

          {(loadingEstados || loadingMunicipios || loading) && (
            <div className="bg-white p-8 rounded-b-lg text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Carregando dados...</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 text-center text-gray-500 text-sm">
        <p></p>
        <p className="mt-1"></p>
      </div>
    </div>
  )
}

export default Dashboard
