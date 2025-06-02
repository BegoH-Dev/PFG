import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Paso1Carro from '../components/Paso1Carro';
import Paso2DatosEnvio from '../components/Paso2DatosEnvio';
import Paso3Confirmacion from '../components/Paso3Confirmacion';

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
const [productos] = useState({      
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
}, [
  userData, deliveryData.firstName, deliveryData.lastName, deliveryData.address, deliveryData.phone, deliveryData.email
]);

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
      {/* NAVBAR */}
      <Navbar isLoggedIn={isLoggedIn} username={username} showDropdown={showDropdown}
      setShowDropdown={setShowDropdown} onLogout={handleLogout} onDropdownItemClick={handleDropdownItemClick} navigate={navigate}/>
      {/* CONTENIDO PRINCIPAL */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 style={{ textAlign: 'center', margin: '2rem', color: '#333' }}>Pedido a domicilio</h1>

        {/* INDICADOR DE PASOS */}
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

        {/* PASO 1: CARRO */}
        {activeStep === 1 && (
          <Paso1Carro cartItems={cartItems} selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct}
            productosArray={productosArray} addToCart={addToCart} updateQuantity={updateQuantity}
            removeFromCart={removeFromCart} getTotalPrice={getTotalPrice} selectedDish={selectedDish}
            botonEstilo={botonEstilo} nextStep={nextStep}
          />
        )}

        {/* PASO 2: DATOS DE ENVÍO */}
        {activeStep === 2 && (
          <Paso2DatosEnvio deliveryData={deliveryData} handleDeliveryChange={handleDeliveryChange}
            isFormValid={isFormValid} isLoggedIn={isLoggedIn} clearDeliveryData={clearDeliveryData}
            prevStep={prevStep} nextStep={nextStep} isPaymentValid={isPaymentValid}
          />
        )}

        {/* PASO 3: CONFIRMACIÓN */}
        {activeStep === 3 && (
        <Paso3Confirmacion cartItems={cartItems} deliveryData={deliveryData} getTotalPrice={getTotalPrice}
          handleFinalizeOrder={handleFinalizeOrder} prevStep={prevStep}
        />
        )}
      </div>
    {/* FOOTER */}
    <Footer />
  </div>
  );
};

export default Pedidos;