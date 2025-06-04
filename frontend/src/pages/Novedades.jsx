import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/global.css';

const Novedades = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const storedUsername = localStorage.getItem('username') || '';
    setIsLoggedIn(loggedIn);
    setUsername(storedUsername);
  }, []);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    setShowDropdown(false);
    window.location.reload();
  };

  const handleDropdownItemClick = (action) => {
    setShowDropdown(false);
    console.log(`Navegando a: ${action}`);
  };

  // Datos de las 5 novedades
  const novedades = [
    {
      id: 1,
      nombre: 'Ensalada de quinoa con hummus y vinagreta cítrica',
      imagen: '/images/9.jpeg',
      description: 'Quinoa cocida con verduras frescas de temporada, hummus de garbanzos casero y vinagreta cítrica con hierbas aromáticas.',
      puntuacion: 4.8,
      pedidos: 89,
      precio: '10,50€',
      descripcion: 'Ensalada fresca con quinoa, hummus y vinagreta cítrica.',
      alergenos: [
        { emoji: '🌿', texto: 'VEGETARIANO' }
      ]
    },
    {
      id: 2,
      nombre: 'Uramaki tempurizado de langostino y mayonesa picante',
      imagen: '/images/11.jpeg',
      description: 'Uramaki tempurizado relleno de langostino y pepino, acompañado de mayonesa picante y salsa teriyaki.',
      puntuacion: 4.9,
      pedidos: 156,
      precio: '11,90€',
      descripcion: 'Uramaki crujiente con langostino y mayonesa picante.',
      alergenos: [
        { emoji: '🦐', texto: 'MARISCO' },
        { emoji: '🌾', texto: 'GLUTEN' },
        { emoji: '🥚', texto: 'HUEVO' },
        { emoji: '🌶', texto: 'PICANTE' }
      ]
    },
    {
      id: 3,
      nombre: 'Pechuga de pollo rellena de espinacas y queso',
      imagen: '/images/17.jpeg',
      description: 'Pechuga de pollo jugosa rellena de espinacas frescas y queso cremoso, servida con patatas confitadas.',
      puntuacion: 4.7,
      pedidos: 203,
      precio: '13,90€',
      descripcion: 'Pechuga de pollo rellena con espinacas y queso fundido.',
      alergenos: [
        { emoji: '🥛', texto: 'LÁCTEOS' }
      ]
    },
    {
      id: 4,
      nombre: 'Zamburiñas gratinadas al horno',
      imagen: '/images/23.jpeg',
      description: 'Zamburiñas frescas gratinadas con ajo, perejil y un toque de mantequilla, servidas en su concha.',
      puntuacion: 4.6,
      pedidos: 142,
      precio: '13,50€',
      descripcion: 'Zamburiñas gratinadas con queso y hierbas.',
      alergenos: [
        { emoji: '🦐', texto: 'MARISCO' },
        { emoji: '🥛', texto: 'LÁCTEOS' }
      ]
    },
    {
      id: 5,
      nombre: 'Tarta de queso al horno con frutos rojos',
      imagen: '/images/25.jpeg',
      description: 'Tarta de queso cremosa horneada lentamente, acompañada de coulis de frutos rojos y frutas frescas.',
      puntuacion: 4.8,
      pedidos: 178,
      precio: '6,90€',
      descripcion: 'Tarta de queso cremosa con frutos rojos frescos.',
      alergenos: [
        { emoji: '🌾', texto: 'GLUTEN' },
        { emoji: '🥛', texto: 'LÁCTEOS' },
        { emoji: '🥚', texto: 'HUEVO' }
      ]
    }
  ];

  // Datos de alérgenos
  const alergenos = [
    { emoji: '🌿', significado: 'Vegetariano' },
    { emoji: '🌾', significado: 'Gluten' },
    { emoji: '🥛', significado: 'Lácteos' },
    { emoji: '🥚', significado: 'Huevo' },
    { emoji: '🐟', significado: 'Pescado' },
    { emoji: '🦐', significado: 'Marisco' },
    { emoji: '🥜', significado: 'Frutos secos' },
    { emoji: '🌶️', significado: 'Picante' }
  ];

  return (
    <>
      {/* Navbar */}
      <Navbar isLoggedIn={isLoggedIn} username={username} showDropdown={showDropdown}
      setShowDropdown={setShowDropdown} onLogout={handleLogout} onDropdownItemClick={handleDropdownItemClick} navigate={navigate}/>
      
      {/* Espaciado para el navbar fijo */}
      <div style={{ paddingTop: '90px', backgroundColor: '#000', minHeight: '100vh' }}>
        
        {/* Sección principal de Novedades */}
        <section className="container py-3">
          <h1 className="section-title mb-5 text-white text-center">
            Novedades de la carta
          </h1>
          <p className="lead text-white mb-5">
            Descubre las últimas incorporaciones a nuestra carta, donde la innovación y la tradición se unen para ofrecerte una experiencia gastronómica única. 
          </p>

          {/* Primera fila - 2 tarjetas */}
          <div className="row g-4 mb-4">
            {novedades.slice(0, 4).map((novedad) => (
              <div key={novedad.id} className="col-lg-3 col-md-6 mx-auto">
              <div 
                className="featured-card h-100" 
                onClick={() => {
                  setSelectedDish(novedad);
                  setShowModal(true);
                }}
                style={{ cursor: 'pointer' }}
              >               
              <div className="card-image" style={{ 
                    backgroundImage: `url(${novedad.imagen})`,
                    height: '200px',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}></div>
                  <div className="card-content p-3">
                    <h5 className="text-black mb-2" style={{ fontSize: '1rem', fontWeight: '600' }}>
                      {novedad.nombre}
                    </h5>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-warning">⭐ {novedad.puntuacion}</span>
                      <span className="text-black" style={{ fontSize: '0.9rem' }}>
                        Pedidos: {novedad.pedidos}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Segunda fila - 2 tarjetas */}
          <div className="row g-4 mb-4">
            {novedades.slice(4, 8).map((novedad) => (
              <div key={novedad.id} className="col-lg-3 col-md-6 mx-auto">
                              <div 
                className="featured-card h-100" 
                onClick={() => {
                  setSelectedDish(novedad);
                  setShowModal(true);
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-image" style={{ 
                    backgroundImage: `url(${novedad.imagen})`,
                    height: '200px',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}></div>
                  <div className="card-content p-3">
                    <h5 className="text-black mb-2" style={{ fontSize: '1rem', fontWeight: '600' }}>
                      {novedad.nombre}
                    </h5>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-warning">⭐ {novedad.puntuacion}</span>
                      <span className="text-black" style={{ fontSize: '0.9rem' }}>
                        Pedidos: {novedad.pedidos}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tercera fila - 1 tarjeta centrada */}
          <div className="row g-4 mb-5 justify-content-center">
            {novedades.slice(8, 10).map((novedad) => (
              <div key={novedad.id} className="col-lg-3 col-md-6 mx-auto">
                <div className="featured-card h-100" onClick={() => { setSelectedDish(novedad); setShowModal(true); }} style={{ cursor: 'pointer' }}>                  
                <div className="card-image" style={{ backgroundImage: `url(${novedad.imagen})`, height: '200px', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                  <div className="card-content p-3">
                    <h5 className="text-black mb-2" style={{ fontSize: '1rem', fontWeight: '600' }}>
                      {novedad.nombre}
                    </h5>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-warning">⭐ {novedad.puntuacion}</span>
                      <span className="text-black" style={{ fontSize: '0.9rem' }}>
                        Pedidos: {novedad.pedidos}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Información de alérgenos */}
          <div className="alert alert-info mb-5 text-center d-flex flex-column align-items-center">
            <h5 className="alert-heading">Información de Alérgenos:</h5>
            <p className="mb-2">
              {alergenos.map((alergeno, index) => (
                <React.Fragment key={index}>
                  <strong style={{ fontSize: '1.5rem' }}>{alergeno.emoji}</strong> {alergeno.significado}
                  {index < alergenos.length - 1 && ' | '}
                </React.Fragment>
              ))}
            </p>
            <p className="mb-0">
              <small>Para cualquier intolerancia o requerimiento dietético, por favor consúltanos. Todos nuestros platos pueden ser adaptados siempre que sea posible.</small>
            </p>
          </div>
        </section>
      </div>

      {/* Modal para detalles del plato */}
      {showModal && selectedDish && (
        <div className="modal-overlay" onClick={() => setShowModal(false)} style={{ zIndex: 10000 }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="btn-close" 
              onClick={() => setShowModal(false)}
              style={{ position: 'absolute', top: '10px', right: '10px' }}
            >
              &times;
            </button>
            
            <div className="text-center">
              <img 
                src={selectedDish.imagen} 
                alt={selectedDish.nombre} 
                className="modal-image"
                style={{ 
                  width: '100%', 
                  maxHeight: '300px', 
                  objectFit: 'cover', 
                  borderRadius: '8px' 
                }}
              />
              <h3 className="mt-3 text-white">{selectedDish.nombre}</h3>
              <p className="text-light">{selectedDish.descripcion}</p>
              <p className="text-warning fs-5">{selectedDish.precio}</p>

              {/* Valoración y pedidos */}
              <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
                <span className="text-warning fs-5">
                  ⭐ {selectedDish.puntuacion}
                </span>
                <span className="text-light fs-5">
                  Pedidos: {selectedDish.pedidos}
                </span>
              </div>

              {/* Alérgenos */}
              <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
                {selectedDish.alergenos.map((alergeno, index) => (
                  <span key={index} className="text-light" style={{ fontSize: '1.2rem' }}>
                    {alergeno.emoji} {alergeno.texto}
                  </span>
                ))}
              </div>

              {/* Botón de acción */}
              <button 
                className="btn btn-primary-custom mt-4" 
                onClick={() => {
                  navigate('/pedidos', { state: { selectedDish } });
                }}
              >
                Pídelo a domicilio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <Footer />
    </>
  );
};

export default Novedades;