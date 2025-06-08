import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import '../styles/global.css';

// Componente Navbar principal para el restaurante Book & Bite
// Props: isLoggedIn, username (estado de autenticación), setIsLoggedIn, setUsername (funciones para actualizar estado)
const Navbar = ({ isLoggedIn, username, setIsLoggedIn, setUsername }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  
  const dropdownRef = useRef(null);
  
  const navigate = useNavigate();

  // Effect para cerrar el dropdown cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    
    setIsLoggedIn(false);
    setUsername('');
    
    setShowDropdown(false);
    navigate('/');
  };

  // Función para manejar clics en elementos del dropdown del usuario
  const handleDropdownItemClick = (action) => {
    setShowDropdown(false); // Cerrar dropdown
    
    switch (action) {
      case 'perfil':
        navigate('/mi-perfil');
        break;
      case 'reservas':
        navigate('/mis-reservas');
        break;
      case 'pedidos':
        navigate('/mis-pedidos');
        break;
      default:
        break;
    }
  };

  // Función para cerrar el navbar móvil manualmente
  const closeNavbar = () => {
    const navbarNav = document.getElementById('navbarNav');
    if (navbarNav && navbarNav.classList.contains('show')) {
      navbarNav.classList.remove('show');
    }
    setIsNavbarOpen(false);
  };

  // Función para manejar navegación con cierre automático del navbar móvil
  const handleNavigation = (path) => {
    navigate(path);
    closeNavbar();
  };

  // Función para alternar la visibilidad del navbar móvil
  const toggleNavbar = () => {
    const navbarNav = document.getElementById('navbarNav');
    navbarNav.classList.toggle('show');
    setIsNavbarOpen(!isNavbarOpen);
  };

  return (
    // Navbar principal con Bootstrap, fijo en la parte superior
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom fixed-top">
      <div className="container">
        {/* Logo del restaurante - enlace al inicio */}
        <a className="navbar-brand" href="#home">
          <img src="/images/Logo_Book_Bite.png" alt="Logo" style={{ height: '100px' }} />
        </a>

        {/* Botón hamburguesa para dispositivos móviles */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenido colapsable del navbar */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={() => handleNavigation('/')}>
                Inicio
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={() => handleNavigation('/reservas')}>
                Reservas
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={() => handleNavigation('/pedidos')}>
                Pedidos
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={() => handleNavigation('/carta')}>
                Carta
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={() => handleNavigation('/novedades')}>
                Novedades
              </button>
            </li>
          </ul>

          {/* Sección de autenticación - botones o perfil de usuario */}
          <div className="d-flex flex-column flex-lg-row gap-2">
            {isLoggedIn ? (
              <div className="position-relative" ref={dropdownRef}>
                <div
                  className="d-flex align-items-center user-profile-container"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <span className="me-2 text-light">{username}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16" style={{ cursor: 'pointer' }}>
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                    <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 1.613A7 7 0 0 0 8 1z"/>
                  </svg>
                </div>

                {showDropdown && (
                  <div className="user-dropdown">
                    <div className="dropdown-item" onClick={() => handleDropdownItemClick('perfil')}>
                      Mi perfil
                    </div>
                    <div className="dropdown-item" onClick={() => handleDropdownItemClick('reservas')}>
                      Mis reservas
                    </div>
                    <div className="dropdown-item" onClick={() => handleDropdownItemClick('pedidos')}>
                      Mis pedidos
                    </div>
                    <div className="dropdown-divider"></div>
                    <div className="dropdown-item logout-item" onClick={handleLogout}>
                      Cerrar sesión
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button className="btn btn-secondary-custom" onClick={() => handleNavigation('/InicioSesion')}>
                  Iniciar Sesión
                </button>
                <button className="btn btn-primary-custom" onClick={() => handleNavigation('/registro')}>
                  Registrarse
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;