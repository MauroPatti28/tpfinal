import React, { useState, useEffect } from "react";
import axios from "axios";
import '../estilos/estilos.css';
import '../estilos/login.css';
import Persona from '../imagenes/Persona.png';
import Footer from './Footer';

const Reseñas = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [mail, setMail] = useState('');
  const [reseñas, setReseñas] = useState('');
  const [reviewsList, setReviewsList] = useState([]);
  const [showReviews, setShowReviews] = useState(false);

  // Función para obtener las reseñas
  const fetchReviews = async () => {
    try {
      const response = await axios.get('http://localhost:3000/reviews');
      setReviewsList(response.data);
      setShowReviews(true);
    } catch (error) {
      console.error('Error al obtener las reseñas:', error);
      alert('Error al obtener las reseñas');
    }
  };

  // Función para eliminar una reseña
  const handleDeleteReview = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/delete-review/${id}`);
      alert('Reseña eliminada correctamente');
      // Actualizar la lista de reseñas después de eliminar
      const updatedReviews = reviewsList.filter(review => review._id !== id);
      setReviewsList(updatedReviews);
    } catch (error) {
      console.error('Error al eliminar la reseña:', error);
      alert('Error al eliminar la reseña');
    }
  };

  useEffect(() => {
    // Al montar el componente, obtiene las reseñas existentes
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/register', { nombre, apellido, mail, reseñas });
      alert('Datos Registrados con Éxito');
      // Después de registrar, volver a cargar las reseñas
      fetchReviews();
    } catch (error) {
      console.error(error);
      alert('Error al Guardar los Datos');
    }
  };

  const hideReviews = () => {
    setShowReviews(false);
  };

  return (
    <>
      <div className="container">
        <div className="titulo">
          <h1>CARTA DE RESEÑAS</h1>
        </div>
        <div className="login">
          <form onSubmit={handleSubmit}>
            <h3>
              <input type="text" placeholder="Nombre" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
              <input type="text" placeholder="Apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} />
              <input type="email" placeholder="Mail" value={mail} onChange={(e) => setMail(e.target.value)} />
              <input type="text" placeholder="Tu reseña/queja" value={reseñas} onChange={(e) => setReseñas(e.target.value)} />
            </h3>
            <button>GUARDAR</button>
          </form>
        </div>
      </div>

      {showReviews && (
        <div>
          <h2 className="titulo">Reseñas Guardadas</h2>
          <ul className="reseñas">
            {reviewsList.map((review) => (
              <div className="reseña" key={review._id}>
                <li>
                  <img src={Persona} alt="" /><p>{review.nombre} {review.apellido}:<br/><br/>{review.reseñas}</p>
                  <button onClick={() => handleDeleteReview(review._id)}>Eliminar</button>
                </li>
              </div>
            ))}
          </ul>
          <div className="ocultar">
            <button onClick={hideReviews}>Ocultar Reseñas</button>
          </div>
        </div>
      )}

      {!showReviews && (
        <div className="mostrar">
          <button onClick={fetchReviews}>Mostrar Reseñas</button>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Reseñas;
