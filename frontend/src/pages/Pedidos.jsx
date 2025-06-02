import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
      <Navbar isLoggedIn={isLoggedIn} username={username} showDropdown={showDropdown}
      setShowDropdown={setShowDropdown} onLogout={handleLogout} onDropdownItemClick={handleDropdownItemClick} navigate={navigate}/>
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
    <Footer />
  </div>
  );
};

export default Pedidos;