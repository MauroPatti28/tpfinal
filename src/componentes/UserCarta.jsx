import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import '../estilos/carta.css';
import Footer from './Footer';

const UserCarta = () => {
  const [platos, setPlatos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState([]);

  const etiquetaColors = {
    "Apto para celíacos": "rgb(116, 116, 0)", // Amarillo oscuro
    "Apto para diabéticos": "#0000FF", // Azul
    "Vegano": "#006400", // Verde oscuro
    "Libre de gluten": "#FFA500" // Naranja
  };

  useEffect(() => {
    obtenerPlatos();
  }, []);

  const obtenerPlatos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/platos');
      setPlatos(response.data);
    } catch (error) {
      console.error('Error al obtener los platos:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    const { value, checked } = event.target;
    if (checked && !filters.includes(value)) {
      setFilters([...filters, value]);
    } else {
      setFilters(filters.filter((filter) => filter !== value));
    }
  };

  const filterPlatos = (plato) => {
    if (filters.length === 0) return true;
    return filters.every((filter) => plato.etiquetas.includes(filter));
  };

  const searchAndFilterPlatos = (plato) => {
    if (!searchTerm) return true;
    const lowerCaseSearch = searchTerm.toLowerCase();
    return (
      plato.nombre.toLowerCase().includes(lowerCaseSearch) ||
      plato.descripcion.toLowerCase().includes(lowerCaseSearch) ||
      plato.etiquetas.some((etiqueta) => etiqueta.toLowerCase().includes(lowerCaseSearch))
    );
  };

  return (
    <div className="user-carta-container">
      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Buscar por nombre, descripción o etiqueta..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div className="filters">
          <label className='etiquetafilter'>
            <input
              className='etiquetafilter'
              type="checkbox"
              value="Apto para celíacos"
              checked={filters.includes('Apto para celíacos')}
              onChange={handleFilterChange}
            />{' '}
            Apto para celíacos
          </label>
          <label className='etiquetafilter'>
            <input
             className='etiquetafilter'
              type="checkbox"
              value="Apto para diabéticos"
              checked={filters.includes('Apto para diabéticos')}
              onChange={handleFilterChange}
            />{' '}
            Apto para diabéticos
          </label>
          <label className='etiquetafilter'>
            <input
              type="checkbox"
              value="Vegano"
              checked={filters.includes('Vegano')}
              onChange={handleFilterChange}
            />{' '}
            Vegano
          </label>
          <label className='etiquetafilter'>
            <input
              type="checkbox"
              value="Libre de gluten"
              checked={filters.includes('Libre de gluten')}
              onChange={handleFilterChange}
            />{' '}
            Libre de gluten
          </label>
        </div>
      </div>
      <TransitionGroup className="platos-container">
        {platos.filter(filterPlatos).filter(searchAndFilterPlatos).map((plato) => (
          <CSSTransition
            key={plato._id}
            timeout={500}
            classNames="plato"
          >
            <div className="plato-card" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <h2>{plato.nombre}</h2>
              <p>{plato.descripcion}</p>
              <b>
                <p>
                  <u>Precio</u>: {plato.precio}
                </p>
              </b>
              <b>
                <p>
                  <u>Etiquetas</u>:
                </p>
              </b>
              <div className="etiqueta3">
                {plato.etiquetas.map((etiqueta, index) => (
                  <span 
                    key={index} 
                    className="etiqueta" 
                    style={{ backgroundColor: etiquetaColors[etiqueta], color: '#F5F5F5' }}
                  >
                    {etiqueta}
                  </span>
                ))}
              </div>
              {plato.imagen && <img src={`http://localhost:3000/uploads/${plato.imagen}`} alt={plato.nombre} />}
            </div>
          </CSSTransition>
        ))}
      </TransitionGroup>
      <Footer/>
    </div>
  );
};

export default UserCarta;
