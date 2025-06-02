import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Carta = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedDish, setExpandedDish] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
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
    console.log(`Navegando a: ${action}`);
  };

  const toggleCategory = (categoryIndex) => {
    setExpandedCategory(expandedCategory === categoryIndex ? null : categoryIndex);
    setExpandedDish(null); // Cerrar cualquier plato expandido
  };

  const toggleDish = (dishIndex) => {
    setExpandedDish(expandedDish === dishIndex ? null : dishIndex);
  };

  // Datos de la carta
  const menuData = {
    '🍽️ ENTRANTES': [
      {
        name: 'Jamón ibérico de bellota con pan de cristal y tomate',
        price: '16,90€',
        allergens: '🌾',
        allergenText: 'GLUTEN',
        description: 'Delicioso jamón ibérico de bellota cortado a cuchillo, acompañado de pan de cristal tostado y tomate natural rayado. Una combinación perfecta de sabores tradicionales.',
        image: '/images/1.jpeg'
      },
      {
        name: 'Croquetas caseras de cocido (6 uds.)',
        price: '9,50€',
        allergens: '🌾🥚🥛',
        allergenText: 'GLUTEN - HUEVO - LECHE',
        description: 'Croquetas artesanales elaboradas con cocido tradicional, empanadas y fritas al momento. Cremosas por dentro y crujientes por fuera.',
        image: '/images/2.jpeg'
      },
      {
        name: 'Gazpacho andaluz con virutas de jamón',
        price: '7,50€',
        allergens: '🌿',
        allergenText: 'VEGETARIANO',
        description: 'Refrescante gazpacho andaluz elaborado con tomates maduros, pepino, pimiento y aceite de oliva virgen extra, coronado con virutas de jamón ibérico.',
        image: '/images/3.jpeg'
      }
    ],
    '🍢 APERITIVOS': [
      {
        name: 'Patatas bravas con alioli de ajo negro',
        price: '6,90€',
        allergens: '🌿🥚',
        allergenText: 'VEGETARIANO - HUEVO',
        description: 'Patatas cortadas y fritas, acompañadas de salsa brava picante y alioli de ajo negro casero. Un clásico reinventado.',
        image: '/images/4.jpeg'
      },
      {
        name: 'Tartar de atún rojo con aguacate',
        price: '14,50€',
        allergens: '🐟',
        allergenText: 'PESCADO',
        description: 'Atún rojo fresco cortado a cuchillo, marinado con lima y aceite de sésamo, acompañado de aguacate cremoso y brotes tiernos.',
        image: '/images/5.jpeg'
      },
      {
        name: 'Mejillones al vapor con limón',
        price: '8,90€',
        allergens: '🦐',
        allergenText: 'MARISCO',
        description: 'Mejillones frescos cocidos al vapor con vino blanco, ajo, perejil y un toque de limón. Servidos en su propio jugo.',
        image: '/images/6.jpeg'
      }
    ],
    '🥗 ENSALADAS': [
      {
        name: 'Ensalada caprese con pesto de albahaca',
        price: '9,90€',
        allergens: '🌿🥛🥜',
        allergenText: 'LECHE - FRUTOS SECOS',
        description: 'Tomate maduro, mozzarella fresca y albahaca, aliñada con pesto casero de albahaca, piñones y aceite de oliva virgen extra.',
        image: '/images/7.jpeg'
      },
      {
        name: 'Ensalada César con pollo y lascas de parmesano',
        price: '11,50€',
        allergens: '🌾🥛🥚',
        allergenText: 'GLUTEN - HUEVO - LECHE',
        description: 'Lechuga romana, pollo a la plancha, crutones caseros, lascas de parmesano y salsa César tradicional.',
        image: '/images/8.jpeg'
      },
      {
        name: 'Ensalada de quinoa con hummus y vinagreta cítrica',
        price: '10,50€',
        allergens: '🌿',
        allergenText: 'VEGETARIANO',
        description: 'Quinoa cocida con verduras frescas de temporada, hummus de garbanzos casero y vinagreta cítrica con hierbas aromáticas.',
        image: '/images/9.jpeg'
      }
    ],
    '🍣 SUSHI': [
      {
        name: 'Nigiri de anguila glaseada (4 uds.)',
        price: '9,90€',
        allergens: '🐟🌾',
        allergenText: 'PESCADO - GLUTEN',
        description: 'Nigiri de anguila glaseada con salsa teriyaki sobre arroz sushi. Una delicia japonesa con sabor dulce y ahumado.',
        image: '/images/10.jpeg'
      },
      {
        name: 'Uramaki tempurizado de langostino y mayonesa picante',
        price: '11,90€',
        allergens: '🦐🌾🥚🌶',
        allergenText: 'MARISCO - GLUTEN - HUEVO - PICANTE',
        description: 'Uramaki tempurizado relleno de langostino y pepino, acompañado de mayonesa picante y salsa teriyaki.',
        image: '/images/11.jpeg'
      },
      {
        name: 'Combo sushi del chef (16 piezas variadas)',
        price: '19,90€',
        allergens: '🐟🦐🌾🥚',
        allergenText: 'PESCADO - MARISCO - GLUTEN - HUEVO',
        description: 'Selección especial del chef con 16 piezas variadas: nigiri, maki y uramaki con los mejores pescados y mariscos frescos.',
        image: '/images/12.jpeg'
      }
    ],
    '🍝 PASTAS': [
      {
        name: 'Tagliatelle a la carbonara tradicional',
        price: '12,90€',
        allergens: '🌾🥛🥚',
        allergenText: 'GLUTEN - HUEVO - LECHE',
        description: 'Tagliatelle caseros con salsa carbonara tradicional italiana: huevo, panceta, pecorino romano y pimienta negra.',
        image: '/images/13.jpeg'
      },
      {
        name: 'Lasaña de verduras gratinada',
        price: '11,90€',
        allergens: '🌿🌾🥛',
        allergenText: 'VEGETARIANO - GLUTEN - LECHE',
        description: 'Lasaña casera con capas de verduras de temporada, salsa bechamel y queso gratinado al horno.',
        image: '/images/14.jpeg'
      },
      {
        name: 'Espaguetis con mariscos al ajillo',
        price: '14,90€',
        allergens: '🌾🦐',
        allergenText: 'MARISCO - GLUTEN',
        description: 'Espaguetis al dente con una selección de mariscos frescos salteados al ajillo con aceite de oliva y perejil.',
        image: '/images/15.jpeg'
      }
    ],
    '🥩 CARNES': [
      {
        name: 'Solomillo de ternera con salsa de foie',
        price: '19,90€',
        allergens: '🥛',
        allergenText: 'LECHE',
        description: 'Solomillo de ternera a la plancha en su punto, acompañado de salsa de foie cremosa y guarnición de verduras salteadas.',
        image: '/images/16.jpeg'
      },
      {
        name: 'Pechuga de pollo rellena de espinacas y queso',
        price: '13,90€',
        allergens: '🥛',
        allergenText: 'LECHE',
        description: 'Pechuga de pollo jugosa rellena de espinacas frescas y queso cremoso, servida con patatas confitadas.',
        image: '/images/17.jpeg'
      },
      {
        name: 'Costillas de cerdo a baja temperatura BBQ',
        price: '15,90€',
        allergens: '🌶',
        allergenText: 'PICANTE',
        description: 'Costillas de cerdo cocidas a baja temperatura con salsa BBQ casera picante y guarnición de ensalada coleslaw.',
        image: '/images/18.jpeg'
      }
    ],
    '🐟 PESCADOS': [
      {
        name: 'Lomo de bacalao al pil-pil',
        price: '17,50€',
        allergens: '🐟🥛',
        allergenText: 'PESCADO - LECHE',
        description: 'Lomo de bacalao confitado en aceite de oliva con ajo y guindilla, acompañado de salsa pil-pil tradicional.',
        image: '/images/19.jpeg'
      },
      {
        name: 'Dorada a la sal con aceite de romero',
        price: '16,90€',
        allergens: '🐟',
        allergenText: 'PESCADO',
        description: 'Dorada fresca cocinada a la sal con hierbas aromáticas, servida con aceite de romero y limón.',
        image: '/images/20.jpeg'
      },
      {
        name: 'Tataki de atún rojo con sésamo',
        price: '18,00€',
        allergens: '🐟🥜',
        allergenText: 'PESCADO - FRUTOS SECOS',
        description: 'Atún rojo sellado por fuera y crudo por dentro, rebozado en sésamo y servido con salsa de soja y wasabi.',
        image: '/images/21.jpeg'
      }
    ],
    '🦐 MARISCOS': [
      {
        name: 'Gambas al ajillo con guindilla',
        price: '14,90€',
        allergens: '🦐🌶',
        allergenText: 'MARISCO - PICANTE',
        description: 'Gambas frescas salteadas en aceite de oliva con ajo laminado y guindilla picante. Un clásico de la cocina española.',
        image: '/images/22.jpeg'
      },
      {
        name: 'Zamburiñas gratinadas al horno',
        price: '13,50€',
        allergens: '🦐🥛',
        allergenText: 'MARISCO - LECHE',
        description: 'Zamburiñas frescas gratinadas con ajo, perejil y un toque de mantequilla, servidas en su concha.',
        image: '/images/23.jpeg'
      },
      {
        name: 'Langostinos a la plancha',
        price: '16,90€',
        allergens: '🦐',
        allergenText: 'MARISCO',
        description: 'Langostinos frescos a la plancha con ajo, perejil y aceite de oliva virgen extra. Sencillo y delicioso.',
        image: '/images/24.jpeg'
      }
    ],
    '🍰 POSTRES': [
      {
        name: 'Tarta de queso al horno con frutos rojos',
        price: '6,90€',
        allergens: '🌾🥛🥚',
        allergenText: 'GLUTEN - LECHE - HUEVO',
        description: 'Tarta de queso cremosa horneada lentamente, acompañada de coulis de frutos rojos y frutas frescas.',
        image: '/images/25.jpeg'
      },
      {
        name: 'Coulant de chocolate con helado de vainilla',
        price: '7,20€',
        allergens: '🌾🥛🥚',
        allergenText: 'GLUTEN - LECHE - HUEVO',
        description: 'Coulant de chocolate caliente con centro fundido, acompañado de helado artesanal de vainilla.',
        image: '/images/26.jpeg'
      },
      {
        name: 'Fruta fresca de temporada',
        price: '5,00€',
        allergens: '🌿',
        allergenText: 'VEGETARIANO',
        description: 'Selección de frutas frescas de temporada cortadas y presentadas de forma elegante.',
        image: '/images/27.jpeg'
      }
    ],
    '🥤 BEBIDAS': [
      {
        name: 'Refrescos (cola, limón, naranja, tónica)',
        price: '2,50€',
        allergens: '',
        allergenText: '',
        description: 'Selección de refrescos variados: cola, limón, naranja y tónica. Servidos bien fríos.',
        image: '/images/28.jpeg'
      },
      {
        name: 'Agua mineral 0.5L',
        price: '1,80€',
        allergens: '',
        allergenText: '',
        description: 'Agua mineral natural de manantial, disponible con gas o sin gas.',
        image: '/images/32.jpeg'
      },
      {
        name: 'Cervezas nacionales',
        price: 'desde 2,70€',
        allergens: '',
        allergenText: '',
        description: 'Selección de cervezas nacionales de barril y botella. Perfectas para acompañar cualquier plato.',
        image: '/images/33.jpeg'
      },
      {
        name: 'Zumos naturales',
        price: '3,50€',
        allergens: '',
        allergenText: '',
        description: 'Zumos naturales recién exprimidos de naranja, limón, pomelo y frutas de temporada.',
        image: '/images/34.jpeg'
      }
    ],
    '🍷 VINOS': [
      {
        name: 'Vino tinto Rioja crianza (botella)',
        price: '16,00€',
        allergens: '',
        allergenText: '',
        description: 'Vino tinto de La Rioja con crianza en barrica, de cuerpo medio y taninos suaves. Perfecto para carnes.',
        image: '/images/35.jpeg'
      },
      {
        name: 'Vino blanco Albariño (botella)',
        price: '17,50€',
        allergens: '',
        allergenText: '',
        description: 'Vino blanco Albariño de las Rías Baixas, fresco y afrutado. Ideal para pescados y mariscos.',
        image: '/images/36.jpeg'
      }
    ],
    '☕ CAFÉS E INFUSIONES': [
      {
        name: 'Café solo / con leche / cortado',
        price: '1,80€',
        allergens: '🥛',
        allergenText: '',
        description: 'Café recién molido, disponible solo, con leche o cortado. Perfecto para acompañar cualquier momento del día.',
        image: '/images/39.jpeg'
      },
      {
        name: 'Infusiones (menta, té verde, manzanilla)',
        price: '2,00€',
        allergens: '',
        allergenText: '',
        description: 'Selección de infusiones naturales: menta, té verde y manzanilla. Relajantes y saludables.',
        image: '/images/40.jpeg'
      }
    ]
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'ENTRANTES': '🍽️',
      'APERITIVOS': '🍢',
      'ENSALADAS': '🥗',
      'SUSHI': '🍣',
      'PASTAS': '🍝',
      'CARNES': '🥩',
      'PESCADOS': '🐟',
      'MARISCOS': '🦐',
      'POSTRES': '🍰',
      'BEBIDAS': '🥤',
      'VINOS': '🍷',
      'CAFÉS E INFUSIONES': '☕',
    };
    return icons[category];
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark navbar-custom fixed-top">
        <div className="container">
          <a className="navbar-brand" href="#home" onClick={() => navigate('/')}>
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
                <button className="nav-link btn btn-link" onClick={() => navigate('/')}>
                  Inicio
                </button>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={() => navigate('/reservas')}>
                Reservas
                </button>
              </li> 
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={() => navigate('/pedidos')}>
                Pedidos
                </button>
              </li>   
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={() => navigate('/carta')}>
                Carta
                </button>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={() => navigate('/novedades')}>
                Novedades
                </button>
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

      {/* Hero Section */}
      <section className="hero-section" style={{ 
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', 
        paddingTop: '120px', 
        paddingBottom: '80px'
      }}>
        <div className="container" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%' 
        }}>          
          <div className="text-center">
            <h1 className="display-4 fw-bold text-light mb-4">Nuestra Carta</h1>
            <p className="lead text-light mb-5">
              Descubre una experiencia gastronómica única con platos elaborados con ingredientes frescos y técnicas tradicionales
            </p>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="menu-section py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          {/* Información de alérgenos */}
          <div className="alert alert-info mb-5 text-center d-flex flex-column align-items-center">
            <h5 className="alert-heading">🏷️ Información de Alérgenos:</h5>
            <p className="mb-2">
              <strong style={{ fontSize: '1.5rem' }}>🌿</strong> Vegetariano | 
              <strong style={{ fontSize: '1.5rem' }}>🌾</strong> Gluten | 
              <strong style={{ fontSize: '1.5rem' }}>🥛</strong> Lácteos | 
              <strong style={{ fontSize: '1.5rem' }}>🥚</strong> Huevo | 
              <strong style={{ fontSize: '1.5rem' }}>🐟</strong> Pescado | 
              <strong style={{ fontSize: '1.5rem' }}>🦐</strong> Marisco | 
              <strong style={{ fontSize: '1.5rem' }}>🥜</strong> Frutos secos | 
              <strong style={{ fontSize: '1.5rem' }}>🌶</strong> Picante
            </p>
            <p className="mb-0">
              <small>ℹ️ Para cualquier intolerancia o requerimiento dietético, por favor consúltanos. 
              Todos nuestros platos pueden ser adaptados siempre que sea posible.</small>
            </p>
          </div>
          {/* Categorías del menú */}
          <div className="row">
            <div className="col-12">
              {Object.keys(menuData).map((category, categoryIndex) => (
                <div key={categoryIndex} className="menu-category mb-4">
                  <div 
                    className="category-header p-3 mb-3"
                    style={{
                      backgroundColor: '#2c3e50',
                      color: 'white',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => toggleCategory(categoryIndex)}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        {getCategoryIcon(category)}
                        <h3 className="mb-0 fs-4">{category}</h3>
                      </div>                      
                      <span className="fs-5">
                        {expandedCategory === categoryIndex ? '▼' : '▶'}
                      </span>
                    </div>
                  </div>

                  {expandedCategory === categoryIndex && (
                    <div className="category-dishes">
                      {menuData[category].map((dish, dishIndex) => {
                        const globalDishIndex = categoryIndex * 1000 + dishIndex;
                        return (
                          <div key={dishIndex} className="dish-item mb-3">
                            <div 
                              className="dish-header p-3"
                              style={{
                                backgroundColor: 'white',
                                border: '1px solid #dee2e6',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                              }}
                              onClick={() => toggleDish(globalDishIndex)}
                            >
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <h5 className="mb-1 text-dark">{dish.name}</h5>
                                  <div className="d-flex align-items-center gap-3">
                                    <span className="fw-bold text-primary fs-5">{dish.price}</span>
                                    <p>
                                      {dish.allergens && (
                                        <small style={{ fontSize: '1.2rem' }}>
                                          {dish.allergens}
                                        </small>
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <span className="text-muted">
                                  {expandedDish === globalDishIndex ? '▲' : '▼'}
                                </span>
                              </div>
                            </div>

                            {expandedDish === globalDishIndex && (
                              <div 
                                className="dish-details mt-3 p-4"
                                style={{
                                  backgroundColor: '#f8f9fa',
                                  border: '1px solid #dee2e6',
                                  borderTop: 'none',
                                  borderRadius: '0 0 8px 8px'
                                }}
                              >
                                <div className="row">
                                  <div className="col-md-8">
                                    <p className="text-muted mb-3">{dish.description}</p>
                                    <div className="d-flex flex-wrap gap-2">
                                      <button className="btn btn-primary btn-sm">
                                        🛒 Añadir al pedido
                                      </button>
                                      <button className="btn btn-outline-secondary btn-sm">
                                        ❤️ Añadir a favoritos
                                      </button>
                                    </div>
                                  </div>
                                  <div className="col-md-4">
                                    <img 
                                      src={dish.image} 
                                      alt={dish.name}
                                      className="img-fluid rounded"
                                      style={{ 
                                        width: '100%', 
                                        height: '200px', 
                                        objectFit: 'cover',
                                        backgroundColor: '#e9ecef'
                                      }}
                                      onError={(e) => {
                                        e.target.style.display = 'flex';
                                        e.target.style.alignItems = 'center';
                                        e.target.style.justifyContent = 'center';
                                        e.target.innerHTML = '🍽️';
                                        e.target.style.fontSize = '3rem';
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
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
                <li>
                  <a href="#" className="footer-link">
                    Inicio
                  </a>
                </li>
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

export default Carta;