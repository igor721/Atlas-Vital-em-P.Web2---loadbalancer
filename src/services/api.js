const API_BASE_URL = 'http://localhost:5000'

class ApiService {
  async fetchData(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error)
      throw error
    }
  }

  // ------------------------
  //  CARTÓRIOS (CRUD)
  // ------------------------

  // Criar cartório
  async createCartorio(data) {
    return this.fetchData('/cartorios', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
  }

  // Listar todos os cartórios
  async getCartorios() {
    return this.fetchData('/cartorios')
  }

  // Buscar cartório por ID
  async getCartorioById(id) {
    return this.fetchData(`/cartorios/${id}`)
  }

  // Atualizar cartório
  async updateCartorio(id, data) {
    return this.fetchData(`/cartorios/${id}`, {
      method: 'PUT',
      headers: { "Content-Type": "application/json" }, // ✅ importante
      body: JSON.stringify(data),
    })
  }

  // Deletar cartório
  async deleteCartorio(id) {
    return this.fetchData(`/cartorios/${id}`, {
      method: 'DELETE',
      headers: { "Content-Type": "application/json" }
    })
  }

  // ------------------------
  //  REGIÕES / ESTADOS / MUNICÍPIOS
  // ------------------------
  
  async getRegioes() {
    return this.fetchData('/regioes')
  }

  async getEstados(regiaoId) {
    let endpoint = '/ufs'
    if (regiaoId && regiaoId !== 'todas') {
      endpoint += `?regiao_id=${regiaoId}`
    }
    return this.fetchData(endpoint)
  }

  async getMesorregioes() {
    return this.fetchData('/mesorregioes')
  }

  async getMicrorregioes() {
    return this.fetchData('/microrregioes')
  }

  async getMunicipios() {
    return this.fetchData('/municipios')
  }

  async getEstatisticasUf(ufId, ano) {
    return this.fetchData(`/ufs/${ufId}/${ano}/estatisticas`)
  }

  async getEstatisticasMunicipiosPorEstado(ufId, ano) {
    return this.fetchData(`/ufs/${ufId}/${ano}/municipios/estatisticas`)
  }

  async getMunicipiosByUf(ufId) {
    const municipios = await this.getMunicipios()
    return municipios.filter(municipio => municipio.cod_uf === ufId)
  }

  calculateTotals(estatisticas, tipoRegistro, ano = null) {
    if (!estatisticas || estatisticas.length === 0) return 0
    
    let filteredStats = estatisticas
    if (ano) {
      filteredStats = estatisticas.filter(stat => stat.ano === ano)
    }

    return filteredStats.reduce((total, stat) => {
      switch (tipoRegistro) {
        case 'nascimentos':
          return total + (stat.total_nascimento || 0)
        case 'obitos':
          return total + (stat.total_morte || 0)
        case 'casamentos':
          return total + (stat.total_casamento || 0)
        case 'todos':
          return total + (stat.total_nascimento || 0) + (stat.total_morte || 0) + (stat.total_casamento || 0)
        default:
          return total
      }
    }, 0)
  }
}

export default new ApiService()
