import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
      buttonAction: 'pedido',    
    },
    {
      title: 'Ven a conocernos',
      description: 'Disfruta de un ambiente perfecto para cualquier ocasión.',
      image: '/images/reserva.png',
      buttonText: 'Haz tu reserva',
      buttonAction: 'reserva',
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
    setShowDropdown(false);
    // Aquí puedes agregar la navegación según la acción
    console.log(`Navegando a: ${action}`);
    // Ejemplo: navigate(`/${action}`);
  };

  const mensajes = [
    {
      id: 1,
      titulo: "Entrega rápida",
      descripcion: "El hambre no espera, y nosotros tampoco: preparamos y entregamos tu pedido rápido y con el mismo cuidado que en el restaurante.",
      imagen: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=400&h=250&fit=crop"
    },
    {
      id: 2,
      titulo: "Menú variado",
      descripcion: "Cada opción en nuestro menú está diseñada para sorprenderte y hacerte volver por más. ¡Descubre algo nuevo cada día!.",
      imagen: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=250&fit=crop"
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
      <nav className="navbar navbar-expand-lg navbar-dark navbar-custom fixed-top">
        <div className="container">
          <a className="navbar-brand" href="#home">
            <img 
              src="/images/Logo_Book_Bite.png" 
              alt="Logo" 
              style={{ height: '100px' }}
            />
          </a>
          
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => {
              const navbarNav = document.getElementById('navbarNav');
              if (navbarNav.classList.contains('show')) {
                navbarNav.classList.remove('show');
              } else {
                navbarNav.classList.add('show');
              }
            }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a className="nav-link" href="#home" onClick={() => scrollToSection('home')}>
                  Inicio
                </a>
              </li>  
              <li className="nav-item">
                <a className="nav-link" onClick={(e) => { e.preventDefault(); navigate('/carta'); }}>
                  Carta
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" onClick={(e) => { e.preventDefault(); navigate('/novedades'); }}>
                  Novedades
                </a>
              </li>
            </ul>
            
            <div className="d-flex flex-column flex-lg-row gap-2">
              {isLoggedIn ? (
                <div className="position-relative" ref={dropdownRef}>
                   <div className="d-flex align-items-center user-profile-container" style={{ cursor: 'pointer' }} onClick={() => setShowDropdown(!showDropdown)}>
                    <span className="me-2 text-light">{username}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16" style={{ cursor: 'pointer' }}>
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                      <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 1.613A7 7 0 0 0 8 1z" />
                    </svg>
                </div>

                {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="user-dropdown">
                      <div className="dropdown-item" onClick={() => handleDropdownItemClick('perfil')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
                        </svg>
                        Mi perfil
                      </div>
                      <div className="dropdown-item" onClick={() => handleDropdownItemClick('mis-reservas')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar-check" viewBox="0 0 16 16">
                          <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                          <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                        </svg>
                        Reservas
                      </div>
                      <div className="dropdown-item" onClick={() => handleDropdownItemClick('mis-pedidos')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bag-check" viewBox="0 0 16 16">
                          <path fillRule="evenodd" d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                          <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/>
                        </svg>
                        Pedidos
                      </div>
                      <div className="dropdown-divider"></div>
                      <div className="dropdown-item logout-item" onClick={handleLogout}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                          <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                          <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                        </svg>
                        Cerrar sesión
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button className="btn btn-secondary-custom" onClick={() => navigate('/InicioSesion')}>
                    Iniciar Sesión
                  </button>
                  <button className="btn btn-primary-custom" onClick={() => navigate('/registro')}>
                    Registrarse
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

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
              <button 
                className="btn btn-primary-custom btn-lg"
                onClick={() => {
                  console.log(`Acción: ${slide.buttonAction}`);
                }}
              >
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
                title: 'Tartar de atún rojo con aguacate',
                image: '/images/tartar-de-atun-rojo-con-aguacate.jpeg',
                rating: 4.5,
                orders: 120,
              },
              {
                title: 'Ensalada césar con pollo y lascas de parmesano',
                image: '/images/ensalada-cesar-con-pollo-y-lascas-de-parmesano.jpeg',
                rating: 4.7,
                orders: 95,
              },
              {
                title: 'Combo sushi del chef (16 piezas variadas)',
                image: '/images/combo-sushi-del-chef-16-piezas-variadas.jpeg',
                rating: 4.8,
                orders: 110,
              },
              {
                title: 'Espaguetis con mariscos al ajillo',
                image: '/images/espaguetis-con-mariscos-al-ajillo.jpeg',
                rating: 4.9,
                orders: 150,
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
      <footer className="footer-custom">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6 mb-4">
              <h5 className="footer-title">Book & Bite</h5>
              <p className="text-light">
                Tu restaurante de confianza para momentos especiales.
                Comida deliciosa, servicio excepcional.
              </p>
              <div className="social-icons">
                <a href="#" className="text-decoration-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-meta" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M8.217 5.243C9.145 3.988 10.171 3 11.483 3 13.96 3 16 6.153 16.001 9.907c0 2.29-.986 3.725-2.757 3.725-1.543 0-2.395-.866-3.924-3.424l-.667-1.123-.118-.197a55 55 0 0 0-.53-.877l-1.178 2.08c-1.673 2.925-2.615 3.541-3.923 3.541C1.086 13.632 0 12.217 0 9.973 0 6.388 1.995 3 4.598 3q.477-.001.924.122c.31.086.611.22.913.407.577.359 1.154.915 1.782 1.714m1.516 2.224q-.378-.615-.727-1.133L9 6.326c.845-1.305 1.543-1.954 2.372-1.954 1.723 0 3.102 2.537 3.102 5.653 0 1.188-.39 1.877-1.195 1.877-.773 0-1.142-.51-2.61-2.87zM4.846 4.756c.725.1 1.385.634 2.34 2.001A212 212 0 0 0 5.551 9.3c-1.357 2.126-1.826 2.603-2.581 2.603-.777 0-1.24-.682-1.24-1.9 0-2.602 1.298-5.264 2.846-5.264q.137 0 .27.018"/>
                  </svg>
                </a>
                <a href="#" className="text-decoration-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-instagram" viewBox="0 0 16 16">
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
                  </svg>
                </a>
                <a href="#" className="text-decoration-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-twitter-x" viewBox="0 0 16 16">
                    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
                  </svg>             
                </a>
              </div>
            </div>
            
            <div className="col-lg-2 col-md-6 mb-4">
              <h6 className="footer-title">Enlaces</h6>
              <ul className="list-unstyled">
                <li><a href="#" className="footer-link">Inicio</a></li>
                <li><a href="#" className="footer-link">Menú</a></li>
                <li><a href="#" className="footer-link">Reservas</a></li>
                <li><a href="#" className="footer-link">Pedidos</a></li>
              </ul>
            </div>
            
            <div className="col-lg-3 col-md-6 mb-4">
              <h6 className="footer-title">Servicios</h6>
              <ul className="list-unstyled">
                <li><a href="#" className="footer-link">Reparto</a></li>
                <li><a href="#" className="footer-link">Catering</a></li>
                <li><a href="#" className="footer-link">Eventos</a></li>
              </ul>
            </div>
            
            <div className="col-lg-3 col-md-6 mb-4">
              <h6 className="footer-title">Contacto</h6>
              <p className="text-light mb-1">📍 c/ del Marqués 10</p>
              <p className="text-light mb-1">📞 +34 987 654 321</p>
              <p className="text-light mb-1">✉️ info@bookandbite.com</p>
              <p className="text-light">🕒 Lun-Dom: 12:00-24:00</p>
            </div>
          </div>
          
          <hr className="my-4" style={{borderColor: 'var(--gold)'}} />
          
          <div className="row">
            <div className="col-12 text-center">
              <p className="mb-0 text-light">
                © 2025 Book & Bite. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;