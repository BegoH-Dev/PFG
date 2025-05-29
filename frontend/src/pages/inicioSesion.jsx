import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    contraseña: '',
    recordarme: false
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.nombre_usuario || !formData.contraseña) {
      alert('Por favor completa todos los campos');
      return;
    }
    
    const payload = {
      nombre_usuario: formData.nombre_usuario,
      contraseña: formData.contraseña
    };

    console.log('Datos de login:', payload);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', formData.nombre_usuario);
        navigate('/');
      } else {
        alert(data.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error de red:', error.message);
      alert('Error al conectar con el servidor');
    }
  };

  const handleRegistrarse = () => {
    console.log('Redirigir a página de registro');
  };

  const handleOlvidoContraseña = () => {
    console.log('Redirigir a recuperar contraseña');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Logo */}
      <div style={{
        textAlign: 'center',
        paddingTop: '40px',
        paddingBottom: '30px'
      }}>
        <img 
          src="/images/Logo_Book_Bite.png" 
          alt="Book & Bite Logo" 
          style={{ 
            height: '120px',
            maxWidth: '100%'
          }}
        />
      </div>

      {/* Formulario de Login */}
      <div style={{
        maxWidth: '450px',
        margin: '0 auto',
        padding: '0 20px',
        paddingBottom: '40px'
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '30px',
          color: '#333',
          fontSize: '28px',
          fontWeight: 'bold'
        }}>
          Iniciar sesión
        </h2>

        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          {/* Nombre de usuario */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontWeight: '600'
            }}>
              Nombre de usuario *
            </label>
            <input
              type="text"
              name="nombre_usuario"
              value={formData.nombre_usuario}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Contraseña */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontWeight: '600'
            }}>
              Contraseña *
            </label>
            <input
              type="password"
              name="contraseña"
              value={formData.contraseña}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Recordarme y Olvidar contraseña */}
          <div style={{ 
            marginBottom: '25px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <input
                type="checkbox"
                name="recordarme"
                checked={formData.recordarme}
                onChange={handleInputChange}
                style={{
                  width: '16px',
                  height: '16px'
                }}
              />
              <label style={{
                color: '#333',
                fontSize: '14px'
              }}>
                Recordarme
              </label>
            </div>
            
            <button
              type="button"
              onClick={handleOlvidoContraseña}
              style={{
                background: 'none',
                border: 'none',
                color: '#d4af37',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
              onMouseOver={(e) => e.target.style.color = '#b8941f'}
              onMouseOut={(e) => e.target.style.color = '#d4af37'}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* Botón Iniciar sesión */}
          <button
            type="button"
            onClick={handleSubmit}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#d4af37',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginBottom: '20px',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#b8941f'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#d4af37'}
          >
            Iniciar sesión
          </button>

          {/* Link a registro */}
          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#666', fontSize: '14px' }}>
              ¿No tienes una cuenta?{' '}
              <button
                type="button"
                onClick={handleRegistrarse}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#d4af37',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
                onMouseOver={(e) => e.target.style.color = '#b8941f'}
                onMouseOut={(e) => e.target.style.color = '#d4af37'}
              >
                Registrarse
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;