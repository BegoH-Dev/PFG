import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
      <Navbar isLoggedIn={isLoggedIn} username={username} showDropdown={showDropdown}
      setShowDropdown={setShowDropdown} onLogout={handleLogout} onDropdownItemClick={handleDropdownItemClick} navigate={navigate}/>      
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
      <Footer />
    </>
  );
};

export default Carta;