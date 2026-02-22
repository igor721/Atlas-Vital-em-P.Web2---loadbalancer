import { useState, useEffect, useCallback } from 'react'
import apiService from '../services/api'

export const useEstados = (anoSelecionado, regiaoSelecionada) => {
  const [estados, setEstados] = useState([])
  const [estatisticasEstados, setEstatisticasEstados] = useState({})
  const [loading, setLoading] = useState(true)

  const loadEstados = useCallback(async () => {
    try {
      setLoading(true)

    
      const cacheKey = `estadosCache_${anoSelecionado}_${regiaoSelecionada}`
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        const parsed = JSON.parse(cached)
        setEstados(parsed.estados || [])
        setEstatisticasEstados(parsed.estatisticas || {})
        setLoading(false)
        return
      }

     
      const estadosData = await apiService.getEstados(regiaoSelecionada)

      setEstados(estadosData)

     
      const estatisticasPromises = estadosData.map(async (estado) => {
        try {
          const estatisticas = await apiService.getEstatisticasUf(estado.id, anoSelecionado)
          return { estadoId: estado.id, estatisticas }
        } catch (error) {
          console.error(`Erro ao carregar estatísticas do estado ${estado.id}:`, error)
          return { estadoId: estado.id, estatisticas: [] }
        }
      })

      const estatisticasResults = await Promise.all(estatisticasPromises)
      const estatisticasMap = {}
      estatisticasResults.forEach(({ estadoId, estatisticas }) => {
        estatisticasMap[estadoId] = estatisticas
      })

      setEstatisticasEstados(estatisticasMap)

     
      localStorage.setItem(cacheKey, JSON.stringify({
        estados: estadosData,
        estatisticas: estatisticasMap
      }))
    } catch (error) {
      console.error('Erro ao carregar estados:', error)
      setEstados([])
      setEstatisticasEstados({})
    } finally {
      setLoading(false)
    }
  }, [anoSelecionado, regiaoSelecionada])

  useEffect(() => {
    loadEstados()
  }, [loadEstados])

  const getTotalByEstado = useCallback((estadoId, tipoRegistro, ano) => {
    const estatisticas = estatisticasEstados[estadoId] || []
    return apiService.calculateTotals(estatisticas, tipoRegistro, ano)
  }, [estatisticasEstados])

  const getEstadoById = useCallback((estadoId) => {
    return estados.find(estado => estado.id === estadoId)
  }, [estados])

  return {
    estados,
    estatisticasEstados,
    loading,
    getTotalByEstado,
    getEstadoById,
    reloadEstados: loadEstados
  }
}
