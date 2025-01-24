import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import '../estilos/carta.css';

const etiquetasPredefinidas = [
  "Apto para celíacos",
  "Apto para diabéticos",
  "Vegano",
  "Libre de gluten",
];

const AdminCarta = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [etiquetas, setEtiquetas] = useState([]);
  const [imagen, setImagen] = useState(null);
  const [platos, setPlatos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoPlato, setEditandoPlato] = useState(null);

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

  const onDrop = (acceptedFiles) => {
    setImagen(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('precio', precio);
    formData.append('etiquetas', JSON.stringify(etiquetas));
    if (imagen) {
      formData.append('imagen', imagen);
    }

    try {
      if (editandoPlato) {
        // Actualizar plato existente
        await axios.put(`http://localhost:3000/update-option/${editandoPlato._id}`, formData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        setEditandoPlato(null);
      } else {
        // Crear nuevo plato
        await axios.post('http://localhost:3000/add-option', formData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      setNombre('');
      setDescripcion('');
      setPrecio('');
      setEtiquetas([]);
      setImagen(null);
      obtenerPlatos();
      setMostrarFormulario(false);
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setEtiquetas([...etiquetas, value]);
    } else {
      setEtiquetas(etiquetas.filter(tag => tag !== value));
    }
  };

  const handleMostrarFormulario = () => {
    setMostrarFormulario(true);
    setEditandoPlato(null);
  };

  const handleCerrarFormulario = () => {
    setMostrarFormulario(false);
  };

  const handleEditarPlato = (plato) => {
    setNombre(plato.nombre);
    setDescripcion(plato.descripcion);
    setPrecio(plato.precio);
    setEtiquetas(plato.etiquetas);
    setImagen(null);
    setEditandoPlato(plato);
    setMostrarFormulario(true);
  };

  const handleEliminarPlato = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/delete-option/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      obtenerPlatos();
    } catch (error) {
      console.error('Error al eliminar el plato:', error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={`formulario ${mostrarFormulario ? 'mostrar' : ''}`}>
        <button type="button" className="cerrar-formulario" onClick={handleCerrarFormulario}>Cerrar</button>
        <label className="label-form">
          Nombre del plato:
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </label>
        <label className="label-form">
          Descripción:
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
        </label>
        <label className="label-form">
          Precio:
          <input type="text" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
        </label>
        <label className="label-form">
          Etiquetas:
          {etiquetasPredefinidas.map((etiqueta, index) => (
            <div key={index} className='etiquetass'>
              <input
                type="checkbox"
                value={etiqueta}
                checked={etiquetas.includes(etiqueta)}
                onChange={handleCheckboxChange}
              />
              <label>{etiqueta}</label>
            </div>
          ))}
        </label>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <p className="dropzone-text">Suelta la imagen aquí, o haz clic para seleccionar una</p>
        </div>
        {imagen && <p>Imagen seleccionada: {imagen.name}</p>}
        <button type="submit">{editandoPlato ? 'Actualizar Plato' : 'Agregar Plato'}</button>
      </form>
      <div className='titulo'>
        <h1 style={{marginTop:'100px'}}>PLATOS</h1>
      </div>
      {!mostrarFormulario && (
        <button onClick={handleMostrarFormulario} style={{marginLeft: '80%'}}>Mostrar Formulario</button>
      )}
      <div className="platos-container">
        {platos.map((plato) => (
          <div key={plato._id} className="plato-card">
            <h2>{plato.nombre}</h2>
            <p>{plato.descripcion}</p>
            <b><p><u>Precio</u>: {plato.precio}</p></b>
            <b><p><u>Etiquetas</u>:</p></b>
            <div className='etiqueta3'>
              {plato.etiquetas.map((etiqueta, index) => (
                <span key={index} className="etiqueta">{etiqueta}</span>
              ))}
            </div>
            {plato.imagen && <img src={`http://localhost:3000/uploads/${plato.imagen}`} alt={plato.nombre} />}
            <button onClick={() => handleEditarPlato(plato)}>Editar</button>
            <button onClick={() => handleEliminarPlato(plato._id)}>Eliminar</button>
          </div>
        ))}
      </div>
    </>
  );
};

export default AdminCarta;
