import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    nombre_usuario: '',
    email: '',
    fecha_nacimiento: '',
    contraseña: '',
    acepta_terminos: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.acepta_terminos) {
      alert('Debes aceptar los términos y condiciones');
      return;
    }
      try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
        if (response.ok) {
          alert(data.message);
          setFormData({
            nombre: '',
            apellidos: '',
            nombre_usuario: '',
            email: '',
            fecha_nacimiento: '',
            contraseña: '',
            acepta_terminos: false
          });
        } else {
          alert(data.error || data.message || 'Error al registrar el usuario');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
      }
  };

  return (
    <div style={{ 
      backgroundColor: 'white', fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column', 
      justifyContent: 'flex-start', alignItems: 'center', padding: '20px 20px'
    }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <img src="/images/Logo_Book_Bite.png" alt="Book & Bite Logo" style={{ height: '120px', maxWidth: '100%' }}/>
      </div>

      {/* Formulario de Registro */}
      <div style={{ maxWidth: '500px', width:'100%', padding: '0 20px', paddingBottom: '40px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
          Registra tu cuenta
        </h2>

        <form onSubmit={handleSubmit} 
          style={{ backgroundColor: '#f8f9fa', padding: '40px',
          borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          {/* Nombre */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '600' }}>
              Nombre *
            </label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px',
                fontSize: '16px', boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Apellidos */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '600' }}>
              Apellidos *
            </label>
            <input type="text" name="apellidos" value={formData.apellidos} onChange={handleInputChange} required
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px',
                fontSize: '16px', boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Nombre de usuario */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '600' }}>
              Nombre de usuario *
            </label>
            <input type="text" name="nombre_usuario" value={formData.nombre_usuario} onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px',
                fontSize: '16px', boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '600' }}>
              Email *
            </label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} required
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px',
                fontSize: '16px', boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Fecha de nacimiento */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '600' }}>
              Fecha de nacimiento (dd/mm/aa) *
            </label>
            <input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px',
                fontSize: '16px', boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Contraseña */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '600' }}>
              Contraseña *
            </label>
            <input type="password" name="contraseña" value={formData.contraseña} onChange={handleInputChange} required
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px',
                fontSize: '16px', boxSizing: 'border-box' 
              }}
            />
          </div>

          {/* Términos y condiciones */}
          <div style={{ marginBottom: '25px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <input type="checkbox" name="acepta_terminos" checked={formData.acepta_terminos} onChange={handleInputChange}
              style={{ marginTop: '3px', width: '16px', height: '16px' }}
            />
            <label style={{ color: '#333', fontSize: '14px', lineHeight: '1.4' }}>
              Acepto términos y condiciones
            </label>
          </div>

          {/* Botón Registrarse */}
          <button
            type="submit"
            style={{ width: '100%', padding: '14px', backgroundColor: '#d4af37', color: 'white', border: 'none',
              borderRadius: '6px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '20px',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#b8941f'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#d4af37'}
          >
            Registrarse
          </button>

          {/* Link a iniciar sesión */}
          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#666', fontSize: '14px' }}>
              ¿Tienes ya una cuenta?{' '}
              <Link
                to="/InicioSesion"
                style={{ background: 'none', border: 'none', color: '#d4af37', textDecoration: 'underline',
                  cursor: 'pointer', fontSize: '14px', fontWeight: '600'
                }}
                onMouseOver={(e) => e.target.style.color = '#b8941f'}
                onMouseOut={(e) => e.target.style.color = '#d4af37'}
              >
                Iniciar sesión
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registro;