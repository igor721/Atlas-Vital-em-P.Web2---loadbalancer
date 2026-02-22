import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantile } from 'd3-scale';

const geoUrl =
  "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson";


const estadoMap = {
  'Acre': 12,
  'Alagoas': 17,
  'Amapá': 16,
  'Amazonas': 13,
  'Bahia': 29,
  'Ceará': 23,
  'Distrito Federal': 53,
  'Espírito Santo': 32,
  'Goiás': 52,
  'Maranhão': 21,
  'Mato Grosso': 51,
  'Mato Grosso do Sul': 50,
  'Minas Gerais': 31,
  'Pará': 15,
  'Paraíba': 25,
  'Paraná': 41,
  'Pernambuco': 26,
  'Piauí': 22,
  'Rio de Janeiro': 33,
  'Rio Grande do Norte': 24,
  'Rio Grande do Sul': 43,
  'Rondônia': 11,
  'Roraima': 14,
  'Santa Catarina': 42,
  'São Paulo': 35,
  'Sergipe': 28,
  'Tocantins': 27
};

const MapaBrasil = ({ onEstadoClick, estadoSelecionado, estatisticasEstados, filters }) => {
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

 
  const totais = Object.values(estatisticasEstados).map(stats =>
    stats.reduce((total, stat) => {
      if (filters.tipoRegistro === 'nascimentos') return total + (stat.total_nascimento || 0);
      if (filters.tipoRegistro === 'obitos') return total + (stat.total_morte || 0);
      if (filters.tipoRegistro === 'casamentos') return total + (stat.total_casamento || 0);
      if (filters.tipoRegistro === 'todos') return total + (stat.total_nascimento || 0) + (stat.total_morte || 0) + (stat.total_casamento || 0);
      return total;
    }, 0)
  );

  const escalaCor = scaleQuantile()
    .domain(totais)
    .range(["#d0f0c0", "#a8e6a3", "#7dd87a", "#4caf50", "#2e7d32"]);

  const transparentize = (hex, opacity) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${opacity})`;
  };

  const getCorEstado = (nomeEstado) => {
    const estadoId = estadoMap[nomeEstado];
    if (!estadoId || !estatisticasEstados[estadoId]) return "#eee";

    const stats = estatisticasEstados[estadoId];
    const total = stats.reduce((sum, stat) => {
      if (stat.ano !== filters.ano) return sum;
      if (filters.tipoRegistro === 'nascimentos') return sum + (stat.total_nascimento || 0);
      if (filters.tipoRegistro === 'obitos') return sum + (stat.total_morte || 0);
      if (filters.tipoRegistro === 'casamentos') return sum + (stat.total_casamento || 0);
      if (filters.tipoRegistro === 'todos') return sum + (stat.total_nascimento || 0) + (stat.total_morte || 0) + (stat.total_casamento || 0);
      return sum;
    }, 0);

    const corOriginal = escalaCor(total);

    
    const estadoSelecionadoNum = Number(estadoSelecionado);
    if (!estadoSelecionado) return corOriginal;           
    if (estadoSelecionadoNum === estadoId) return corOriginal; 
    return transparentize(corOriginal, 0.3);              
  };

  const formatNumber = new Intl.NumberFormat("pt-BR");

  const calcTooltipPosition = (x, y) => {
    const padding = 10;
    const tooltipWidth = 160;
    const tooltipHeight = 35;
    const vw = window.innerWidth;

    let newX = x + 15;
    let newY = y - tooltipHeight - 15;

    if (newX + tooltipWidth + padding > vw) newX = x - tooltipWidth - 15;
    if (newY < padding) newY = y + 15;

    return { x: newX, y: newY };
  };

  const handleMouseMove = (evt) => {
    const mapaElement = document.querySelector('.mapa-container');
    if (!mapaElement) return;

    const rect = mapaElement.getBoundingClientRect();
    const relativeX = evt.clientX - rect.left;
    const relativeY = evt.clientY - rect.top;

    setTooltipPos(calcTooltipPosition(relativeX, relativeY));
  };

  const handleMouseEnter = (evt, nomeEstado) => {
    const estadoId = estadoMap[nomeEstado];
    if (!estadoId || !estatisticasEstados[estadoId]) return;

    const stats = estatisticasEstados[estadoId];
    const total = stats.reduce((sum, stat) => {
      if (stat.ano !== filters.ano) return sum;
      if (filters.tipoRegistro === 'nascimentos') return sum + (stat.total_nascimento || 0);
      if (filters.tipoRegistro === 'obitos') return sum + (stat.total_morte || 0);
      if (filters.tipoRegistro === 'casamentos') return sum + (stat.total_casamento || 0);
      if (filters.tipoRegistro === 'todos') return sum + (stat.total_nascimento || 0) + (stat.total_morte || 0) + (stat.total_casamento || 0);
      return sum;
    }, 0);

    setTooltipContent(`${nomeEstado}: ${formatNumber.format(total)}`);
    setShowTooltip(true);
    handleMouseMove(evt);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleEstadoClick = (nomeEstado) => {
    const estadoId = estadoMap[nomeEstado];
    if (!estadoId) return;
    onEstadoClick?.(estadoId);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div
        className="mapa-container w-full h-96 flex items-center justify-center relative"
        onMouseMove={handleMouseMove}
      >
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 700, center: [-54, -14] }}
          width={800}
          height={500}
          style={{ width: '100%', height: '100%' }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const nomeEstado = geo.properties.name;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getCorEstado(nomeEstado)}
                    stroke="#fff"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "#059669", outline: "none" },
                      pressed: { outline: "none" },
                    }}
                    onClick={() => handleEstadoClick(nomeEstado)}
                    onMouseEnter={(e) => handleMouseEnter(e, nomeEstado)}
                    onMouseLeave={handleMouseLeave}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {showTooltip && (
          <div
            style={{
              position: "absolute",
              top: tooltipPos.y,
              left: tooltipPos.x,
              background: "#333",
              color: "#fff",
              padding: "6px 10px",
              borderRadius: "6px",
              fontSize: "14px",
              pointerEvents: "none",
              whiteSpace: "nowrap",
              zIndex: 10,
              boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
              userSelect: "none",
            }}
          >
            {tooltipContent}
          </div>
        )}
      </div>

      {/* Legenda */}
      <div className="mt-4 flex justify-center">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-100 border mr-2"></div>
            <span>Baixo</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-300 border mr-2"></div>
            <span>Médio</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 border mr-2"></div>
            <span>Alto</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-700 border mr-2"></div>
            <span>Selecionado</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapaBrasil;
