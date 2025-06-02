import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Pedidos = () => {
  const location = useLocation();
  const selectedDish = location.state?.selectedDish;
  const [activeStep, setActiveStep] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [deliveryData, setDeliveryData] = useState({
    address: '',
    phone: '',
    notes: ''
  });
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Productos disponibles
const [productos, setProductos] = useState({      
  '🍽️ ENTRANTES': [{
        id: 1,
        name: 'Jamón ibérico de bellota con pan de cristal y tomate',
        price: '16,90',
        allergens: '🌾',
        allergenText: 'GLUTEN',
        description: 'Delicioso jamón ibérico de bellota cortado a cuchillo, acompañado de pan de cristal tostado y tomate natural rayado. Una combinación perfecta de sabores tradicionales.',
        image: '/images/1.jpeg'
      },
      {
        id: 2,
        name: 'Croquetas caseras de cocido (6 uds.)',
        price: '9,50',
        allergens: '🌾🥚🥛',
        allergenText: 'GLUTEN - HUEVO - LECHE',
        description: 'Croquetas artesanales elaboradas con cocido tradicional, empanadas y fritas al momento. Cremosas por dentro y crujientes por fuera.',
        image: '/images/2.jpeg'
      },
      {
        id: 3,
        name: 'Gazpacho andaluz con virutas de jamón',
        price: '7,50',
        allergens: '🌿',
        allergenText: 'VEGETARIANO',
        description: 'Refrescante gazpacho andaluz elaborado con tomates maduros, pepino, pimiento y aceite de oliva virgen extra, coronado con virutas de jamón ibérico.',
        image: '/images/3.jpeg'
      }
    ],
    '🍢 APERITIVOS': [
      {
        id: 4,
        name: 'Patatas bravas con alioli de ajo negro',
        price: '6,90',
        allergens: '🌿🥚',
        allergenText: 'VEGETARIANO - HUEVO',
        description: 'Patatas cortadas y fritas, acompañadas de salsa brava picante y alioli de ajo negro casero. Un clásico reinventado.',
        image: '/images/4.jpeg'
      },
      {
        id: 5,
        name: 'Tartar de atún rojo con aguacate',
        price: '14,50',
        allergens: '🐟',
        allergenText: 'PESCADO',
        description: 'Atún rojo fresco cortado a cuchillo, marinado con lima y aceite de sésamo, acompañado de aguacate cremoso y brotes tiernos.',
        image: '/images/5.jpeg'
      },
      {
        id: 6,
        name: 'Mejillones al vapor con limón',
        price: '8,90',
        allergens: '🦐',
        allergenText: 'MARISCO',
        description: 'Mejillones frescos cocidos al vapor con vino blanco, ajo, perejil y un toque de limón. Servidos en su propio jugo.',
        image: '/images/6.jpeg'
      }
    ],
    '🥗 ENSALADAS': [
      {
        id: 7,
        name: 'Ensalada caprese con pesto de albahaca',
        price: '9,90',
        allergens: '🌿🥛🥜',
        allergenText: 'LECHE - FRUTOS SECOS',
        description: 'Tomate maduro, mozzarella fresca y albahaca, aliñada con pesto casero de albahaca, piñones y aceite de oliva virgen extra.',
        image: '/images/7.jpeg'
      },
      {
        id: 8,
        name: 'Ensalada César con pollo y lascas de parmesano',
        price: '11,50',
        allergens: '🌾🥛🥚',
        allergenText: 'GLUTEN - HUEVO - LECHE',
        description: 'Lechuga romana, pollo a la plancha, crutones caseros, lascas de parmesano y salsa César tradicional.',
        image: '/images/8.jpeg'
      },
      {
        id: 9,
        name: 'Ensalada de quinoa con hummus y vinagreta cítrica',
        price: '10,50',
        allergens: '🌿',
        allergenText: 'VEGETARIANO',
        description: 'Quinoa cocida con verduras frescas de temporada, hummus de garbanzos casero y vinagreta cítrica con hierbas aromáticas.',
        image: '/images/9.jpeg'
      }
    ],
    '🍣 SUSHI': [
      {
        id: 10,
        name: 'Nigiri de anguila glaseada (4 uds.)',
        price: '9,90',
        allergens: '🐟🌾',
        allergenText: 'PESCADO - GLUTEN',
        description: 'Nigiri de anguila glaseada con salsa teriyaki sobre arroz sushi. Una delicia japonesa con sabor dulce y ahumado.',
        image: '/images/10.jpeg'
      },
      {
        id: 11,
        name: 'Uramaki tempurizado de langostino y mayonesa picante',
        price: '11,90',
        allergens: '🦐🌾🥚🌶',
        allergenText: 'MARISCO - GLUTEN - HUEVO - PICANTE',
        description: 'Uramaki tempurizado relleno de langostino y pepino, acompañado de mayonesa picante y salsa teriyaki.',
        image: '/images/11.jpeg'
      },
      {
        id: 12,
        name: 'Combo sushi del chef (16 piezas variadas)',
        price: '19,90',
        allergens: '🐟🦐🌾🥚',
        allergenText: 'PESCADO - MARISCO - GLUTEN - HUEVO',
        description: 'Selección especial del chef con 16 piezas variadas: nigiri, maki y uramaki con los mejores pescados y mariscos frescos.',
        image: '/images/12.jpeg'
      }
    ],
    '🍝 PASTAS': [
      {
        id: 13,
        name: 'Tagliatelle a la carbonara tradicional',
        price: '12,90',
        allergens: '🌾🥛🥚',
        allergenText: 'GLUTEN - HUEVO - LECHE',
        description: 'Tagliatelle caseros con salsa carbonara tradicional italiana: huevo, panceta, pecorino romano y pimienta negra.',
        image: '/images/13.jpeg'
      },
      {
        id: 14,
        name: 'Lasaña de verduras gratinada',
        price: '11,90',
        allergens: '🌿🌾🥛',
        allergenText: 'VEGETARIANO - GLUTEN - LECHE',
        description: 'Lasaña casera con capas de verduras de temporada, salsa bechamel y queso gratinado al horno.',
        image: '/images/14.jpeg'
      },
      {
        id: 15,
        name: 'Espaguetis con mariscos al ajillo',
        price: '14,90',
        allergens: '🌾🦐',
        allergenText: 'MARISCO - GLUTEN',
        description: 'Espaguetis al dente con una selección de mariscos frescos salteados al ajillo con aceite de oliva y perejil.',
        image: '/images/15.jpeg'
      }
    ],
    '🥩 CARNES': [
      {
        id: 16,
        name: 'Solomillo de ternera con salsa de foie',
        price: '19,90',
        allergens: '🥛',
        allergenText: 'LECHE',
        description: 'Solomillo de ternera a la plancha en su punto, acompañado de salsa de foie cremosa y guarnición de verduras salteadas.',
        image: '/images/16.jpeg'
      },
      {
        id: 17,
        name: 'Pechuga de pollo rellena de espinacas y queso',
        price: '13,90',
        allergens: '🥛',
        allergenText: 'LECHE',
        description: 'Pechuga de pollo jugosa rellena de espinacas frescas y queso cremoso, servida con patatas confitadas.',
        image: '/images/17.jpeg'
      },
      {
        id: 18,
        name: 'Costillas de cerdo a baja temperatura BBQ',
        price: '15,90',
        allergens: '🌶',
        allergenText: 'PICANTE',
        description: 'Costillas de cerdo cocidas a baja temperatura con salsa BBQ casera picante y guarnición de ensalada coleslaw.',
        image: '/images/18.jpeg'
      }
    ],
    '🐟 PESCADOS': [
      {
        id: 19,
        name: 'Lomo de bacalao al pil-pil',
        price: '17,50',
        allergens: '🐟🥛',
        allergenText: 'PESCADO - LECHE',
        description: 'Lomo de bacalao confitado en aceite de oliva con ajo y guindilla, acompañado de salsa pil-pil tradicional.',
        image: '/images/19.jpeg'
      },
      {
        id: 20,
        name: 'Dorada a la sal con aceite de romero',
        price: '16,90',
        allergens: '🐟',
        allergenText: 'PESCADO',
        description: 'Dorada fresca cocinada a la sal con hierbas aromáticas, servida con aceite de romero y limón.',
        image: '/images/20.jpeg'
      },
      {
        id: 21,
        name: 'Tataki de atún rojo con sésamo',
        price: '18,00',
        allergens: '🐟🥜',
        allergenText: 'PESCADO - FRUTOS SECOS',
        description: 'Atún rojo sellado por fuera y crudo por dentro, rebozado en sésamo y servido con salsa de soja y wasabi.',
        image: '/images/21.jpeg'
      }
    ],
    '🦐 MARISCOS': [
      {
        id: 22,
        name: 'Gambas al ajillo con guindilla',
        price: '14,90',
        allergens: '🦐🌶',
        allergenText: 'MARISCO - PICANTE',
        description: 'Gambas frescas salteadas en aceite de oliva con ajo laminado y guindilla picante. Un clásico de la cocina española.',
        image: '/images/22.jpeg'
      },
      {
        id: 23,
        name: 'Zamburiñas gratinadas al horno',
        price: '13,50',
        allergens: '🦐🥛',
        allergenText: 'MARISCO - LECHE',
        description: 'Zamburiñas frescas gratinadas con ajo, perejil y un toque de mantequilla, servidas en su concha.',
        image: '/images/23.jpeg'
      },
      {
        id: 24,
        name: 'Langostinos a la plancha',
        price: '16,90',
        allergens: '🦐',
        allergenText: 'MARISCO',
        description: 'Langostinos frescos a la plancha con ajo, perejil y aceite de oliva virgen extra. Sencillo y delicioso.',
        image: '/images/24.jpeg'
      }
    ],
    '🍰 POSTRES': [
      {
        id: 25,
        name: 'Tarta de queso al horno con frutos rojos',
        price: '6,90',
        allergens: '🌾🥛🥚',
        allergenText: 'GLUTEN - LECHE - HUEVO',
        description: 'Tarta de queso cremosa horneada lentamente, acompañada de coulis de frutos rojos y frutas frescas.',
        image: '/images/25.jpeg'
      },
      {
        id: 26,
        name: 'Coulant de chocolate con helado de vainilla',
        price: '7,20',
        allergens: '🌾🥛🥚',
        allergenText: 'GLUTEN - LECHE - HUEVO',
        description: 'Coulant de chocolate caliente con centro fundido, acompañado de helado artesanal de vainilla.',
        image: '/images/26.jpeg'
      },
      {
        id: 27,
        name: 'Fruta fresca de temporada',
        price: '5,00',
        allergens: '🌿',
        allergenText: 'VEGETARIANO',
        description: 'Selección de frutas frescas de temporada cortadas y presentadas de forma elegante.',
        image: '/images/27.jpeg'
      }
    ],
    '🥤 BEBIDAS': [
      {
        id: 28,
        name: 'Refrescos (cola, limón, naranja, tónica)',
        price: '2,50',
        allergens: '',
        allergenText: '',
        description: 'Selección de refrescos variados: cola, limón, naranja y tónica. Servidos bien fríos.',
        image: '/images/28.jpeg'
      },
      {
        id: 29,
        name: 'Agua mineral 0.5L',
        price: '1,80',
        allergens: '',
        allergenText: '',
        description: 'Agua mineral natural de manantial, disponible con gas o sin gas.',
        image: '/images/32.jpeg'
      },
      {
        id: 30,
        name: 'Cervezas nacionales',
        price: '2,70',
        allergens: '',
        allergenText: '',
        description: 'Selección de cervezas nacionales de barril y botella. Perfectas para acompañar cualquier plato.',
        image: '/images/33.jpeg'
      },
      {
        id: 31,
        name: 'Zumos naturales',
        price: '3,50',
        allergens: '',
        allergenText: '',
        description: 'Zumos naturales recién exprimidos de naranja, limón, pomelo y frutas de temporada.',
        image: '/images/34.jpeg'
      }
    ],
    '🍷 VINOS': [
      {
        id: 32,
        name: 'Vino tinto Rioja crianza (botella)',
        price: '16,00',
        allergens: '',
        allergenText: '',
        description: 'Vino tinto de La Rioja con crianza en barrica, de cuerpo medio y taninos suaves. Perfecto para carnes.',
        image: '/images/35.jpeg'
      },
      {
        id: 33,
        name: 'Vino blanco Albariño (botella)',
        price: '17,50',
        allergens: '',
        allergenText: '',
        description: 'Vino blanco Albariño de las Rías Baixas, fresco y afrutado. Ideal para pescados y mariscos.',
        image: '/images/36.jpeg'
      }
    ],
    '☕ CAFÉS E INFUSIONES': [
      {
        id: 34,
        name: 'Café solo / con leche / cortado',
        price: '1,80',
        allergens: '🥛',
        allergenText: '',
        description: 'Café recién molido, disponible solo, con leche o cortado. Perfecto para acompañar cualquier momento del día.',
        image: '/images/39.jpeg'
      },
      {
        id: 35,
        name: 'Infusiones (menta, té verde, manzanilla)',
        price: '2,00',
        allergens: '',
        allergenText: '',
        description: 'Selección de infusiones naturales: menta, té verde y manzanilla. Relajantes y saludables.',
        image: '/images/40.jpeg'
      },
    ],
});

  const productosArray = Object.values(productos).flat();

  const botonEstilo = {
    padding: '0.25rem 0.75rem',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#D4AF37',
    color: '#000',
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const storedUsername = localStorage.getItem('username') || '';
    setIsLoggedIn(loggedIn);
    setUsername(storedUsername);
  }, []);
  
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
  
  useEffect(() => {
    if (selectedDish?.nombre) {
      const productToAdd = productosArray.find(p => p.name.toLowerCase() === selectedDish.nombre.toLowerCase());
    if (productToAdd) {
      const mergedProduct = {
        ...productToAdd,
        description: selectedDish.descripcion || productToAdd.description,
        allergens: selectedDish.allergens || productToAdd.allergens,
        allergenText: selectedDish.allergenText || productToAdd.allergenText,
        image: selectedDish.image || productToAdd.image
      };
        setCartItems(prev => {
          const existingItem = prev.find(item => item.id === mergedProduct.id);
          if (existingItem) {
            return prev.map(item =>
              item.id === productToAdd.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            return [...prev, { ...mergedProduct, quantity: 1 }];
          }
      });
    } else {
      console.warn('Producto no encontrado en la carta:', selectedDish.nombre);
    }
  }
}, [selectedDish, productosArray]);

  const addToCart = () => {
    if (!selectedProduct) return;
    
    const product = productosArray.find(p => p.id === parseInt(selectedProduct));
    if (!product) return;

    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    } 
    setSelectedProduct('');
  };

  const updateQuantity = (id, change) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

const getTotalPrice = () => {
  return cartItems.reduce((total, item) => {
    const price = parseFloat(item.price?.toString().replace(',', '.')) || 0;
    return total + (price * item.quantity);
  }, 0);
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

  const nextStep = () => {
    if (activeStep < 3) {
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleFinalizeOrder = () => {
    alert('¡Pedido realizado con éxito! Te llegará en 30-45 minutos.');
    setCartItems([]);
    setActiveStep(1);
    setDeliveryData({ address: '', phone: '', notes: '' });
  };
  
// Rellenar automáticamente si el usuario está logueado
const [userData, setUserData] = useState(null);

useEffect(() => {
  if (userData && !deliveryData.firstName && !deliveryData.lastName) {
    setDeliveryData(prev => ({
      ...prev,
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      address: userData.address || '',
      phone: userData.phone || '',
      email: userData.email || ''
    }));
  }
}, [userData]);

useEffect(() => {
  const storedUserData = localStorage.getItem('userData');
  if (storedUserData) {
    try {
      setUserData(JSON.parse(storedUserData));
    } catch (e) {
      console.error('Error parsing userData from localStorage:', e);
    }
  }
}, []);

const handleDeliveryChange = (field, value) => {
  setDeliveryData(prev => ({ ...prev, [field]: value }));
};

const clearDeliveryData = () => {
  setDeliveryData({
    firstName: '',
    lastName: '',
    address: '',
    phone: '',
    email: '',
    notes: '',
    paymentMethod: '',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: ''
  });
};

//VALIDACIÓN EN EL BOTÓN "CONTINUAR"
const isPaymentValid = () => {
  if (deliveryData.paymentMethod === 'card') {
    return (
      deliveryData.cardName &&
      deliveryData.cardNumber &&
      deliveryData.cardExpiry &&
      deliveryData.cardCVV
    );
  }
  return deliveryData.paymentMethod !== '';
};

const isFormValid = () =>
  deliveryData.firstName &&
  deliveryData.lastName &&
  deliveryData.email &&
  deliveryData.address &&
  deliveryData.phone &&
  isPaymentValid();


  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
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

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 style={{ textAlign: 'center', margin: '2rem', color: '#333' }}>Pedido a domicilio</h1>

        {/* Steps Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: activeStep >= 1 ? '#D4AF37' : '#ddd',
                color: activeStep >= 1 ? '#000' : '#666',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>1</div>
              <span style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: activeStep === 1 ? '#D4AF37' : '#666' }}>Carta</span>
            </div>
            
            <div style={{ width: '50px', height: '2px', backgroundColor: activeStep >= 2 ? '#D4AF37' : '#ddd' }}></div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: activeStep >= 2 ? '#D4AF37' : '#ddd',
                color: activeStep >= 2 ? '#000' : '#666',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>2</div>
              <span style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: activeStep === 2 ? '#D4AF37' : '#666' }}>Datos de entrega</span>
            </div>
            
            <div style={{ width: '50px', height: '2px', backgroundColor: activeStep >= 3 ? '#D4AF37' : '#ddd' }}></div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: activeStep >= 3 ? '#D4AF37' : '#ddd', color: activeStep >= 3 ? '#000' : '#666', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
              }}>3</div>
              <span style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: activeStep === 3 ? '#D4AF37' : '#666' }}>Confirmación</span>
            </div>
          </div>
        </div>

        {/* Step 1: Cart */}
        {activeStep === 1 && (
          <div style={{ 
            backgroundColor: '#fff', 
            borderRadius: '12px', 
            padding: '2rem', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: '1px solid #e0e0e0'
          }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>Lista de pedidos</h3>
            
            {/* Display selected dish from navigation */}
            {selectedDish && (
              <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#e9ecef', borderRadius: '8px' }}>
                <h4 style={{ margin: 0 }}>{selectedDish.nombre}</h4>
                <p style={{ margin: 0, color: '#555' }}>{selectedDish.descripcion}</p>
                <p style={{ margin: 0, color: '#888' }}>{selectedDish.allergenText}</p>
                    <img src={selectedDish.image} alt={selectedDish.nombre} style={{ maxWidth: '100%', height: 'auto', marginTop: '0.5rem' }} />
              </div>
            )}

            {/* Add Product Section */}
            <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'end', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Producto</label>
                  <select 
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem', 
                      border: '1px solid #ddd', 
                      borderRadius: '4px',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="">Seleccionar producto...</option>
                      {productosArray.map(producto => (
                        <option key={producto.id} value={producto.id}>
                          {producto.name} - {parseFloat(producto.price.replace(',', '.')).toFixed(2)} €
                        </option>
                        ))}
                  </select>
                </div>
                <button onClick={addToCart} disabled={!selectedProduct} style={botonEstilo}>
                  Añadir producto
                </button>
              </div>
            </div>

            {/* Cart Items */}
            {cartItems.length > 0 ? (
              <div style={{ marginBottom: '2rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #ddd' }}>Producto</th>
                      <th style={{ padding: '1rem', textAlign: 'center', border: '1px solid #ddd' }}>Cantidad</th>
                      <th style={{ padding: '1rem', textAlign: 'right', border: '1px solid #ddd' }}>Suma</th>
                      <th style={{ padding: '1rem', textAlign: 'center', border: '1px solid #ddd' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map(item => {
                      const priceNum = parseFloat(item.price.replace(',', '.')) || 0;
                      const totalPrice = (priceNum * item.quantity).toFixed(2);
                      return (
                        <tr key={item.id}>
                          <td style={{ padding: '1rem', border: '1px solid #ddd' }}>
                            <div>
                              <strong>{item.name}</strong>
                              <p style={{ fontSize: '0.9rem', color: '#555' }}>{item.description}</p>
                              <p style={{ fontSize: '0.8rem', color: '#888' }}>{item.allergenText}</p>
                            </div>
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'center', border: '1px solid #ddd' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                disabled={item.quantity <= 1}
                                style={{
                                  padding: '0.25rem 0.75rem',
                                  borderRadius: '4px',
                                  border: 'none',
                                  cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                                  backgroundColor: '#D4AF37',
                                  color: '#000',
                                }}
                                aria-label={`Disminuir cantidad de ${item.name}`}
                              >
                                -
                              </button>
                              <span>{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                style={{
                                  padding: '0.25rem 0.75rem',
                                  borderRadius: '4px',
                                  border: 'none',
                                  cursor: 'pointer',
                                  backgroundColor: '#D4AF37',
                                  color: '#000',
                                }}
                                aria-label={`Aumentar cantidad de ${item.name}`}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'right', border: '1px solid #ddd' }}>
                            {totalPrice} €
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'center', border: '1px solid #ddd' }}>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              style={{
                                padding: '0.25rem 0.75rem',
                                borderRadius: '4px',
                                border: 'none',
                                cursor: 'pointer',
                                backgroundColor: '#D4AF37',
                                color: '#000',
                              }}
                              aria-label={`Eliminar ${item.name} del carrito`}
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #D4AF37' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Total</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#D4AF37' }}>{getTotalPrice().toFixed(2)}€</span>
                </div>
                
                <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
                  <button 
                    onClick={nextStep}
                    disabled={cartItems.length === 0}
                    style={{ 
                      backgroundColor: '#D4AF37', 
                      color: '#000', 
                      border: 'none', 
                      padding: '0.75rem 2rem', 
                      borderRadius: '4px', 
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '500'
                    }}
                  >
                    Continuar
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                <p>Tu carrito está vacío. ¡Añade algunos productos para continuar!</p>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Delivery Data */}
        {activeStep === 2 && (
          <div style={{ 
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: '1px solid #e0e0e0',
            display: 'flex',
            gap: '2rem'
          }}>

          {/* Sección Datos de Entrega */}
            <div style={{ flex: 1, minWidth: '300px' }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>Datos de entrega</h3>
            
            <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '600px' }}>
              <div>
                <label>Nombre *</label>
                <input
                  type="text"
                  value={deliveryData.firstName}
                  onChange={(e) => handleDeliveryChange('firstName', e.target.value)}
                  placeholder="Ej: Juan"
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div>
                <label>Apellidos *</label>
                <input
                  type="text"
                  value={deliveryData.lastName}
                  onChange={(e) => handleDeliveryChange('lastName', e.target.value)}
                  placeholder="Ej: Pérez Gómez"
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}/>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Dirección de entrega *
                </label>
                <input
                  type="text"
                  value={deliveryData.address}
                  onChange={(e) => handleDeliveryChange('address', e.target.value)}
                  placeholder="Ej: Calle Mayor 123, 2º B"
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Teléfono de contacto *
                </label>
                <input
                  type="tel"
                  value={deliveryData.phone}
                  onChange={(e) => handleDeliveryChange('phone', e.target.value)}
                  placeholder="Ej: +34 123 456 789"
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div>
                <label>Correo electrónico *</label>
                <input
                  type="email"
                  value={deliveryData.email}
                  onChange={(e) => handleDeliveryChange('email', e.target.value)}
                  placeholder="Ej: juan@email.com"
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Notas adicionales (opcional)
                </label>
                <textarea
                  value={deliveryData.notes}
                  onChange={(e) => handleDeliveryChange('notes', e.target.value)}
                  placeholder="Ej: 2º piso, portero automático, sin cebolla..."
                  rows={4}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>
              {isLoggedIn && (
                <button onClick={clearDeliveryData}>
                  Cambiar datos
                </button>
              )}              
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
              <button 
                onClick={prevStep}
                style={{ 
                  backgroundColor: '#6c757d', 
                  color: '#fff', 
                  border: 'none', 
                  padding: '0.75rem 2rem', 
                  borderRadius: '4px', 
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Volver
              </button>
              <button 
                onClick={nextStep}
                disabled={!deliveryData.firstName || !deliveryData.lastName || !deliveryData.email || !deliveryData.address || !deliveryData.phone || !isPaymentValid() || !isFormValid()}
                style={{ 
                  backgroundColor: deliveryData.address && deliveryData.phone && isFormValid() ? '#D4AF37' : '#ccc', 
                  color: deliveryData.address && deliveryData.phone && isFormValid() ? '#000' : '#666',
                  border: 'none', 
                  padding: '0.75rem 2rem', 
                  borderRadius: '4px', 
                  cursor: deliveryData.address && deliveryData.phone && isFormValid() ? 'pointer' : 'not-allowed',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}
              >
                Continuar
              </button>
            </div>
          </div>
        
      {/* Línea divisoria */}
      <div style={{ width: '1px', backgroundColor: '#ddd' }} />

      {/* Sección Método de Pago (la añadimos luego) */}
      <div style={{ flex: 1 }}>
        <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>Método de pago</h3>

        <div style={{ display: 'grid', gap: '1rem', maxWidth: '600px' }}>
          <div>
            <label style={{ fontWeight: '500', marginBottom: '0.5rem', display: 'block' }}>
              Selecciona un método *
            </label>
            <select
              value={deliveryData.paymentMethod}
              onChange={(e) => handleDeliveryChange('paymentMethod', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            >
              <option value="">Selecciona una opción</option>
              <option value="cash">Efectivo</option>
              <option value="card">Tarjeta</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>

          {deliveryData.paymentMethod === 'card' && (
            <>
              <div>
                <label>Titular de la tarjeta *</label>
                <input
                  type="text"
                  value={deliveryData.cardName}
                  onChange={(e) => handleDeliveryChange('cardName', e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div>
                <label>Número de tarjeta *</label>
                <input
                  type="text"
                  value={deliveryData.cardNumber}
                  onChange={(e) => handleDeliveryChange('cardNumber', e.target.value)}
                  placeholder="Ej: 1234 5678 9012 3456"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label>Fecha de vencimiento *</label>
                  <input
                    type="text"
                    value={deliveryData.cardExpiry}
                    onChange={(e) => handleDeliveryChange('cardExpiry', e.target.value)}
                    placeholder="MM/AA"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1rem'
                    }}/>
                </div>
                <div style={{ flex: 1 }}>
                  <label>CVV *</label>
                  <input
                    type="text"
                    value={deliveryData.cardCVV}
                    onChange={(e) => handleDeliveryChange('cardCVV', e.target.value)}
                    placeholder="123"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1rem'
                    }}/>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )}

  {/* PASO 3: CONFIRMACIÓN */}
  {activeStep === 3 && (
    <div style={{ 
      backgroundColor: '#fff', 
      borderRadius: '12px', 
      padding: '2rem', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: '1px solid #e0e0e0'
    }}>
      <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>Confirmación del pedido</h3>
      
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Order Summary */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h5 style={{ marginBottom: '1rem', color: '#D4AF37' }}>Resumen del pedido</h5>
          {cartItems.map(item => (
            <div key={item.id} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '0.5rem', 
              padding: '0.5rem 0'
            }}>
              <span>{item.name} x{item.quantity}</span>
              <span>{(parseFloat(item.price.toString().replace(',', '.')) * item.quantity).toFixed(2)}€</span>
            </div>
          ))}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginTop: '1rem', 
            borderTop: '2px solid #D4AF37', 
            paddingTop: '1rem'
          }}>
            <strong>Total</strong>
            <strong style={{ color: '#D4AF37' }}>{getTotalPrice().toFixed(2)}€</strong>
          </div>
        </div>

        {/* DETALLES DE ENVÍO */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h5 style={{ marginBottom: '1rem', color: '#D4AF37' }}>Datos de entrega</h5>
          <p><strong>Nombre:</strong> {deliveryData.firstName} {deliveryData.lastName}</p>
          <p><strong>Email:</strong> {deliveryData.email}</p>
          <p><strong>Teléfono:</strong> {deliveryData.phone}</p>
          <p><strong>Dirección:</strong> {deliveryData.address}</p>
          <p><strong>Teléfono:</strong> {deliveryData.phone}</p>
          {deliveryData.notes && <p><strong>Notas:</strong> {deliveryData.notes}</p>}
          <p><strong>Método de pago:</strong> {
            deliveryData.paymentMethod === 'cash' ? 'Efectivo' :
            deliveryData.paymentMethod === 'paypal' ? 'PayPal' :
            'Tarjeta de crédito'
          }</p>
          {deliveryData.paymentMethod === 'card' && (
            <>
              <p><strong>Titular:</strong> {deliveryData.cardName}</p>
              <p><strong>Número:</strong> **** **** **** {deliveryData.cardNumber?.slice(-4)}</p>
              <p><strong>Expira:</strong> {deliveryData.cardExpiry}</p>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
        <button 
          onClick={prevStep}
          style={{ 
            backgroundColor: '#6c757d', 
            color: '#fff', 
            border: 'none', 
            padding: '0.75rem 2rem', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Volver
        </button>
        <button 
          onClick={handleFinalizeOrder}
          style={{ 
            backgroundColor: '#D4AF37', 
            color: '#000', 
            border: 'none', 
            padding: '0.75rem 2rem', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          Confirmar pedido
        </button>
      </div>
    </div>
  )}
  </div>

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
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-meta" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8.217 5.243C9.145 3.988 10.171 3 11.483 3 13.96 3 16 6.153 16.001 9.907c0 2.29-.986 3.725-2.757 3.725-1.543 0-2.395-.866-3.924-3.424l-.667-1.123-.118-.197a55 55 0 0 0-.53-.877l-1.178 2.08c-1.673 2.925-2.615 3.541-3.923 3.541C1.086 13.632 0 12.217 0 9.973 0 6.388 1.995 3 4.598 3q.477-.001.924.122c.31.086.611.22.913.407.577.359 1.154.915 1.782 1.714m1.516 2.224q-.378-.615-.727-1.133L9 6.326c.845-1.305 1.543-1.954 2.372-1.954 1.723 0 3.102 2.537 3.102 5.653 0 1.188-.39 1.877-1.195 1.877-.773 0-1.142-.51-2.61-2.87zM4.846 4.756c.725.1 1.385.634 2.34 2.001A212 212 0 0 0 5.551 9.3c-1.357 2.126-1.826 2.603-2.581 2.603-.777 0-1.24-.682-1.24-1.9 0-2.602 1.298-5.264 2.846-5.264q.137 0 .27.018"/>
              </svg>
            </a>
            <a href="#" className="text-decoration-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-instagram" viewBox="0 0 16 16">
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
              </svg>
            </a>
            <a href="#" className="text-decoration-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-twitter-x" viewBox="0 0 16 16">
                <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
              </svg>             
            </a>
          </div>
        </div>
        
        <div className="col-lg-2 col-md-6 mb-4">
          <h6 className="footer-title">Enlaces</h6>
          <ul className="list-unstyled">
            <li><a href="#" className="footer-link">Inicio</a></li>
            <li><a href="#" className="footer-link">Carta</a></li>
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
  </div>
  );
};

export default Pedidos;