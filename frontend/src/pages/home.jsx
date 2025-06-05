import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/global.css';

const Home = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

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

  // Configuración de las diapositivas
  const slides = [
    {
      title: 'Disfruta de nuestros platos desde casa',
      description: 'La mejor comida, con el sabor de siempre, directo a tu mesa.',
      image: '/images/pedido.png',
      buttonText: 'Haz tu pedido',
      buttonAction: 'pedidos',    
    },
    {
      title: 'Ven a conocernos',
      description: 'Disfruta de un ambiente perfecto para cualquier ocasión.',
      image: '/images/reserva.png',
      buttonText: 'Haz tu reserva',
      buttonAction: 'reservas',
    },
    {
      title: 'Únete a la comunidad Sabor Gourmet',
      description: 'Comparte tu pasión por la gastronomía, descubre novedades y sé parte de algo delicioso.',
      image: '/images/registro.png',
      buttonText: 'Regístrate ahora',
      buttonAction: 'registro',
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Función para desplazarse a una sección específica
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    setShowDropdown(false);
    window.location.reload();
  };

const handleDropdownItemClick = (action) => {
  console.log('Dropdown clicked:', action);
  setShowDropdown(false);
  
  switch (action) {
    case 'perfil':
      navigate('/mi-perfil');
      break;
    case 'mis-reservas':
      navigate('/mis-reservas');
      break;
    case 'mis-pedidos':
      navigate('/mis-pedidos');
      break;
    default:
      console.log(`Navegando a: ${action}`);
      break;
  }
};

  const mensajes = [
    {
      id: 1,
      titulo: "Entrega rápida",
      descripcion: "El hambre no espera, y nosotros tampoco: preparamos y entregamos tu pedido rápido y con el mismo cuidado que en el restaurante.",
      imagen: "/images/entrega-rapida.jpeg"
    },
    {
      id: 2,
      titulo: "Menú variado",
      descripcion: "Cada opción en nuestro menú está diseñada para sorprenderte y hacerte volver por más. ¡Descubre algo nuevo cada día!",
      imagen: "/images/menu-variado.jpeg"
    },
    {
      id: 3,
      titulo: "Cocinando con pasión",
      descripcion: "Cocinamos con ingredientes frescos, técnicas auténticas y mucho amor, porque para nosotros cada plato crea un momento especial.",
      imagen: "/images/cocinamos-con-pasion.jpeg"
    },
  ];


  return (
    <>      
      {/* Navbar */}
      <Navbar isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} onDropdownItemClick={handleDropdownItemClick}/>

      {/* Hero Slider Section */}
      <section id="home" className="hero-slider">
        {slides.map((slide, index) => (
          <div 
            key={index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="slide-overlay"></div>
            <div className="slide-content">
              <h1 className="slide-title">{slide.title}</h1>
              <p className="slide-description">{slide.description}</p>
              <button className="btn btn-primary-custom btn-lg" onClick={() => navigate(`/${slide.buttonAction}`)}>
                {slide.buttonText}
              </button>
            </div>
          </div>
        ))}

        {/* Botones de navegación */}
        <button className="slider-button slider-button-left" onClick={prevSlide} aria-label="Anterior">
          ‹
        </button>

        <button className="slider-button slider-button-right" onClick={nextSlide} aria-label="Siguiente">
          ›
        </button>

        {/* Indicadores */}
        <div className="slide-indicators">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            ></div>
          ))}
        </div>
      </section>

      {/* SECCIÓN "NOVEDADES" */}
      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">Explora Nuestros Platos Estrella</h2>
          <div className="row g-4">
            {[
              {
                title: 'Ensalada de quinoa con hummus y vinagreta cítrica',
                image: '/images/9.jpeg',
                rating: 4.8,
                orders: 89,
              },
              {
                title: 'Uramaki tempurizado de langostino y mayonesa picante',
                image: '/images/11.jpeg',
                rating: 4.9,
                orders: 156,
              },
              {
                title: 'Pechuga de pollo rellena de espinacas y queso',
                image: '/images/17.jpeg',
                rating: 4.7,
                orders: 203,
              },
              {
                title: 'Zamburiñas gratinadas al horno',
                image: '/images/23.jpeg',
                rating: 4.6,
                orders: 142,
              },
            ].map((card, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="featured-card">
                  <div className="card-image" style={{ backgroundImage: `url(${card.image})` }}></div>
                  <div className="card-content">
                    <h3>{card.title}</h3>
                    <p>⭐ {card.rating}</p>
                    <p>Pedidos: {card.orders}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Botón "Ver más" */}
          <div className="text-center mt-4">
            <button 
              className="btn btn-primary-custom btn-ver-mas" 
              onClick={() => navigate('/novedades')}
            >
              Ver más
            </button>
          </div>
        </div>
      </section>

      {/* SECCIÓN MENSAJES */}
      <section id="mensajes" className="mensajes-section" style={{ backgroundColor: '#000' }}>
        <div className="container">
          <div className="row g-4 justify-content-center">
            {mensajes.slice(0, 3).map((mensajes) => (
              <div key={mensajes.id} className="col-lg-4 col-md-6">
                <div className="card card-novedad text-center">
                  <img src={mensajes.imagen} className="card-img-top" alt={mensajes.titulo} style={{ height: '200px', objectFit: 'cover' }} />
                  <div className="card-body">
                    <h5 className="card-title text-light">{mensajes.titulo}</h5>
                    <p className="card-text text-light">{mensajes.descripcion}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </>
  );
};

export default Home;