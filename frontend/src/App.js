import React, { useState } from 'react';
import './styles/global.css';

const RestaurantApp = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [currentSlide, setCurrentSlide] = useState(0);

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

  const novedades = [
    {
      id: 1,
      titulo: "Nuevo Menú de Temporada",
      descripcion: "Descubre nuestros platos especiales preparados con ingredientes frescos de la temporada.",
      imagen: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=250&fit=crop"
    },
    {
      id: 2,
      titulo: "Reservas Online Disponibles",
      descripcion: "Ahora puedes hacer tus reservas de manera fácil y rápida a través de nuestra plataforma.",
      imagen: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop"
    },
    {
      id: 3,
      titulo: "Delivery 24/7",
      descripcion: "Servicio de entrega a domicilio disponible las 24 horas para que disfrutes en casa.",
      imagen: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=400&h=250&fit=crop"
    },
    {
      id: 4,
      titulo: "Promoción Fin de Semana",
      descripcion: "Descuentos especiales en todos nuestros platos principales durante los fines de semana.",
      imagen: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=250&fit=crop"
    }
  ];


  return (
    <>      
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark navbar-custom fixed-top">
        <div className="container">
          <a className="navbar-brand" href="#home">
            <img 
              src="/images/Logo_Book_Bite.png" 
              alt="Logo de Sabor Gourmet" 
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
                <a className="nav-link" href="#menu">
                  Menú
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#novedades" onClick={() => scrollToSection('novedades')}>
                  Novedades
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contacto">
                  Contacto
                </a>
              </li>
            </ul>
            
            <div className="d-flex flex-column flex-lg-row gap-2">
              <button className="btn btn-secondary-custom">
                Hacer Reserva
              </button>
              <button className="btn btn-primary-custom">
                Pedir Ahora
              </button>
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
                  // Aquí puedes manejar las acciones específicas
                  console.log(`Acción: ${slide.buttonAction}`);
                }}
              >
                {slide.buttonText}
              </button>
            </div>
          </div>
        ))}

        {/* Botones de navegación */}
        <button
          className="slider-button slider-button-left"
          onClick={prevSlide}
          aria-label="Anterior"
        >
          ‹
        </button>

        <button
          className="slider-button slider-button-right"
          onClick={nextSlide}
          aria-label="Siguiente"
        >
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

      {/* Featured Section */}
      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">Nuestras Especialidades</h2>
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="featured-card">
                <h3>Platos del Día</h3>
                <p>Descubre nuestras creaciones especiales preparadas diariamente por nuestros chefs.</p>
                <button className="btn btn-primary-custom">Ver Menú</button>
              </div>
            </div>
            
            <div className="col-lg-4 col-md-6">
              <div className="featured-card">
                <h3>Promociones</h3>
                <p>Aprovecha nuestras ofertas especiales y descuentos exclusivos para clientes.</p>
                <button className="btn btn-primary-custom">Ver Promociones</button>
              </div>
            </div>
            
            <div className="col-lg-4 col-md-6">
              <div className="featured-card">
                <h3>Reservaciones</h3>
                <p>Reserva una mesa para tu ocasión especial y disfruta de una experiencia única.</p>
                <button className="btn btn-primary-custom">Reservar Ahora</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Novedades Section */}
      <section id="novedades" className="novedades-section">
        <div className="container">
          <h2 className="section-title">Últimas Novedades</h2>
          <div className="row g-4">
            {novedades.map((novedad) => (
              <div key={novedad.id} className="col-lg-3 col-md-6 col-sm-12">
                <div className="card card-novedad">
                  <img
                    src={novedad.imagen}
                    className="card-img-top"
                    alt={novedad.titulo}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{novedad.titulo}</h5>
                    <p className="card-text">{novedad.descripcion}</p>
                    <button className="btn btn-primary-custom btn-sm">
                      Leer más
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-custom">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6 mb-4">
              <h5 className="footer-title">Sabor Gourmet</h5>
              <p className="text-light">
                Tu restaurante de confianza para momentos especiales.
                Comida deliciosa, servicio excepcional.
              </p>
              <div className="social-icons">
                <a href="#" className="text-decoration-none">📘</a>
                <a href="#" className="text-decoration-none">📷</a>
                <a href="#" className="text-decoration-none">🐦</a>
              </div>
            </div>
            
            <div className="col-lg-2 col-md-6 mb-4">
              <h6 className="footer-title">Enlaces</h6>
              <ul className="list-unstyled">
                <li><a href="#" className="footer-link">Inicio</a></li>
                <li><a href="#" className="footer-link">Menú</a></li>
                <li><a href="#" className="footer-link">Reservas</a></li>
                <li><a href="#" className="footer-link">Contacto</a></li>
              </ul>
            </div>
            
            <div className="col-lg-3 col-md-6 mb-4">
              <h6 className="footer-title">Servicios</h6>
              <ul className="list-unstyled">
                <li><a href="#" className="footer-link">Delivery</a></li>
                <li><a href="#" className="footer-link">Catering</a></li>
                <li><a href="#" className="footer-link">Eventos</a></li>
                <li><a href="#" className="footer-link">Take Away</a></li>
              </ul>
            </div>
            
            <div className="col-lg-3 col-md-6 mb-4">
              <h6 className="footer-title">Contacto</h6>
              <p className="text-light mb-1">📍 Calle Principal 123</p>
              <p className="text-light mb-1">📞 +34 123 456 789</p>
              <p className="text-light mb-1">✉️ info@saborgourmet.com</p>
              <p className="text-light">🕒 Lun-Dom: 12:00-24:00</p>
            </div>
          </div>
          
          <hr className="my-4" style={{borderColor: 'var(--gold)'}} />
          
          <div className="row">
            <div className="col-12 text-center">
              <p className="mb-0 text-light">
                © 2025 Sabor Gourmet. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default RestaurantApp;