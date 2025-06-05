import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Paso1Carro from '../components/Paso1Carro';
import Paso2DatosEnvio from '../components/Paso2DatosEnvio';
import Paso3Confirmacion from '../components/Paso3Confirmacion';

import '../styles/global.css';

import productos from './data/productos';

const Pedidos = () => {
  const [activeStep, setActiveStep] = useState(1);
  const location = useLocation();
  const selectedDish = location.state?.selectedDish;
  const [step, setStep] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [deliveryData, setDeliveryData] = useState({
    firstName: '', lastName: '', address: '', phone: '', email: '', notes: '', paymentMethod: '', cardName: '', cardNumber: '', cardExpiry: '', cardCVV: ''
  });
  const [userData, setUserData] = useState(null);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const botonEstilo = {
      padding: '0.25rem 0.75rem',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      backgroundColor: '#D4AF37',
      color: '#000',
  };

  // Ref para evitar múltiples ejecuciones
  const hasAddedDish = useRef(false);

  // Convertir el objeto de productos en un array para facilitar su uso
  const productosArray = useMemo(() => Object.values(productos).flat(), []);

  // Cargar estado de login y username de localStorage
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const storedUsername = localStorage.getItem('username') || '';
    setIsLoggedIn(loggedIn);
    setUsername(storedUsername);
  }, []);
  
  // Manejo click fuera dropdown
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
  
  // Añadir plato seleccionado al carrito solo una vez
  useEffect(() => {
    if (selectedDish?.nombre && !hasAddedDish.current) {
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
              item.id === mergedProduct.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            return [...prev, { ...mergedProduct, quantity: 1 }];
          }
      });
      hasAddedDish.current = true;
      navigate('/pedidos', { replace: true, state: {} });  
    } else {
      console.warn('Producto no encontrado en la carta:', selectedDish.nombre);
    }
  }
}, [selectedDish, productosArray, navigate]);

  // Añadir producto seleccionado al carrito
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

  const limpiarCarrito = () => setCartItems([]);

  const irPasoInicial = () => {
    setStep(1);
    setActiveStep(1);
  };

  // Cargar userData desde localStorage
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

  // Autocompletar datos entrega si hay userData y campos vacíos
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

  const handleDeliveryChange = (field, value) => {
    setDeliveryData(prevData => ({ 
      ...prevData, 
      [field]: value 
    }));
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

  const handleFinalizeOrder = async () => {
    const pedido = {
      usuario_id: userData?.id,
      productos: cartItems.map(item => ({
        id: item.id,
        cantidad: item.quantity,
        precio: parseFloat(item.price?.toString().replace(',', '.')) || 0
      })),
      total: getTotalPrice().toFixed(2),
      direccion: deliveryData.address,
      metodoPago: deliveryData.paymentMethod,
      notas: deliveryData.notes || '',
      datosEntrega: {
        firstName: deliveryData.firstName,
        lastName: deliveryData.lastName,
        phone: deliveryData.phone,
        email: deliveryData.email
      }
    };

    try {
      console.log('Pedido a enviar:', pedido);
      const response = await fetch('/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido)
      });

      if (response.ok) {
        alert('¡Pedido realizado con éxito! Te llegará en 30-45 minutos.');
        setCartItems([]);
        setActiveStep(1);
        clearDeliveryData();
      } else {
        const error = await response.json();
        console.error(error);
        alert('Error al realizar el pedido: ' + error?.error);
      }
    } catch (err) {
      console.error('Error de red:', err);
      alert('Error de red al enviar el pedido');
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price?.toString().replace(',', '.')) || 0;
      const quantity = item.quantity || 1;
      return total + price * quantity;
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
    setStep(prev => {
      const next = Math.min(prev + 1, 3);
      setActiveStep(next);
      return next;
    });
  };

  const prevStep = () => {
    setStep(prev => {
      const back = Math.max(prev - 1, 1);
      setActiveStep(back);
      return back;
    });
  };

// Pasa la función para que Paso3Confirmacion al confirmar llame a esto
const handleOrderConfirmed = () => {
  limpiarCarrito();
  irPasoInicial();
};


  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* NAVBAR */}
      <Navbar
        isLoggedIn={isLoggedIn}
        username={username}
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
        onLogout={handleLogout}
        onDropdownItemClick={handleDropdownItemClick}
        navigate={navigate}
      />
      
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
        {step === 1 && (
          <Paso1Carro
            cartItems={cartItems}
            setCartItems={setCartItems}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            productosArray={productosArray}
            addToCart={addToCart}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            getTotalPrice={getTotalPrice}
            selectedDish={selectedDish}
            botonEstilo={botonEstilo}
            nextStep={nextStep}
          />
        )}
        {step === 2 && (
          <Paso2DatosEnvio
            deliveryData={deliveryData}
            setDeliveryData={setDeliveryData}
            handleDeliveryChange={handleDeliveryChange}
            isLoggedIn={isLoggedIn}
            clearDeliveryData={clearDeliveryData}
            prevStep={prevStep}
            nextStep={nextStep}
            isPaymentValid={isPaymentValid}
            isFormValid={isFormValid}
          />
        )}
        {step === 3 && (
          <Paso3Confirmacion
            cartItems={cartItems}
            deliveryData={deliveryData}
            usuarioId={userData?.id}
            getTotalPrice={getTotalPrice}
            prevStep={prevStep}
            onOrderConfirmed={handleOrderConfirmed}
            onFinalizeOrder={handleFinalizeOrder}
          />
        )}
      </div>
    {/* FOOTER */}
    <Footer />
  </div>
  );
};

export default Pedidos;