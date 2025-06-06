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
  const [subscriptionEmail, setSubscriptionEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
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

  // Función para manejar la suscripción
    const handleSubscription = async (e) => {
      e.preventDefault();
      
      if (!subscriptionEmail) {
        setSubscriptionStatus('Por favor, introduce tu email');
        return;
      }

      if (!subscriptionEmail.includes('@')) {
        setSubscriptionStatus('Por favor, introduce un email válido');
        return;
      }

      setIsSubscribing(true);
      setSubscriptionStatus('');

      try {
      // PASO 1: Guardar en la base de datos
      console.log('Iniciando suscripción para:', subscriptionEmail);
      
      const backendResponse = await fetch('http://localhost:5000/api/suscripciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: subscriptionEmail
        })
      });

      console.log('Respuesta del backend:', backendResponse.status);

      // Verificar si la respuesta es válida
      if (!backendResponse.ok) {
        console.log('Error del backend:', backendData);

        if (backendResponse.status === 409) {
          setSubscriptionStatus('Este email ya está suscrito a nuestro newsletter.');
          return;
        }

        if (backendResponse.status === 400) {
          setSubscriptionStatus(backendData.message || 'Datos inválidos');
          return;
        }

        if (backendResponse.status === 500) {
          setSubscriptionStatus(backendData.message || 'Error del servidor. Por favor, inténtalo más tarde.');
          return;
        }

        throw new Error(backendData.message || `Error del servidor: ${backendResponse.status}`);
      }

      let backendData = {};
      try {
        backendData = await backendResponse.json();
      } catch (err) {
        console.warn('No se pudo parsear JSON del backend', err);
      }

      console.log('Datos del backend:', backendData);

      // PASO 2: Enviar email de confirmación con EmailJS
      const SERVICE_ID = 'service_kx4rh4b'; // Service ID
      const TEMPLATE_ID = 'template_bubou3k'; // Template ID  
      const PUBLIC_KEY = 'hXOVhDS7tdDuCAPoD'; // Public Key (User ID)

      // Cargar EmailJS si no está disponible
      if (!window.emailjs) {
        console.log('Cargando EmailJS...');
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        document.head.appendChild(script);
        
        // Esperar a que se cargue
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          setTimeout(reject, 10000); // Timeout después de 10 segundos
        });
        
        // Inicializar EmailJS
        window.emailjs.init(PUBLIC_KEY);
      }

      // Enviar email usando EmailJS
      console.log('Enviando email...');
      const emailResult  = await window.emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        to_email: subscriptionEmail,
        user_email: subscriptionEmail,
        from_name: 'Book & Bite',
        reply_to: subscriptionEmail,
      });

      console.log('Resultado del email:', emailResult);

      if (emailResult.status === 200) {
        setSubscriptionStatus('¡Suscripción exitosa! Revisa tu email.');
        setSubscriptionEmail('');
        console.log('Suscripción completada exitosamente'); 
      } else {
        setSubscriptionStatus('Suscripción guardada, pero hubo un problema enviando el email de confirmación.');
        setSubscriptionEmail('');
      }
    } catch (error) {
      console.error('Error completo en la suscripción:', error);
      
      // Manejo específico de errores
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setSubscriptionStatus('No se pudo conectar con el servidor. Verifica tu conexión.');
      } else if (error.message.includes('suscrito')) {
        setSubscriptionStatus(error.message);
      } else if (error.message.includes('EmailJS')) {
        setSubscriptionStatus('Suscripción guardada, pero hubo un problema con el email de confirmación.');
        setSubscriptionEmail('');
      } else {
        setSubscriptionStatus('Error al procesar la suscripción. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setIsSubscribing(false);
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

      {/* SECCIÓN DE SUSCRIPCIÓN */}
      <section className="subscription-section" style={{ backgroundColor: '#f8f9fa', padding: '60px 0' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              <div className="text-center mb-4">
                <h2 className="section-title" style={{ color: '#333', marginBottom: '20px' }}>
                  Suscríbete a Nuestra Newsletter
                </h2>
                <p style={{ color: '#666', fontSize: '18px', marginBottom: '30px' }}>
                  Únete a nuestra comunidad gastronómica y recibe las últimas novedades, 
                  ofertas especiales y recetas exclusivas directamente en tu email.
                </p>
              </div>
              
              <form onSubmit={handleSubscription} className="subscription-form">
                <div className="row justify-content-center">
                  <div className="col-md-8">
                    <div className="input-group mb-3">
                      <span className="input-group-text" style={{ backgroundColor: '#fff', border: '2px solid #ddd' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-envelope" viewBox="0 0 16 16">
                          <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
                        </svg>
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Introduce tu email"
                        value={subscriptionEmail}
                        onChange={(e) => setSubscriptionEmail(e.target.value)}
                        disabled={isSubscribing}
                        style={{ border: '2px solid #ddd', borderLeft: 'none', fontSize: '16px', padding: '12px 15px' }}
                      />
                      <button
                        type="submit"
                        className="btn btn-primary-custom"
                        disabled={isSubscribing}
                        style={{ border: '2px solid var(--gold)', borderLeft: 'none', padding: '12px 25px', fontSize: '16px', fontWeight: 'bold' }} >
                        {isSubscribing ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Enviando...
                          </>
                        ) : (
                          'Suscribirse'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                {subscriptionStatus && (
                  <div className="row justify-content-center">
                    <div className="col-md-8">
                      <div className={`alert ${subscriptionStatus.includes('exitosa') ? 'alert-success' : 'alert-warning'} text-center`}>
                        {subscriptionStatus}
                      </div>
                    </div>
                  </div>
                )}
              </form>
              
              <div className="text-center mt-4">
                <p style={{ color: '#888', fontSize: '14px' }}>
                  Al suscribirte, aceptas recibir emails promocionales. 
                  Puedes darte de baja en cualquier momento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </>
  );
};

export default Home;