import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ isLoggedIn, username, setIsLoggedIn, setUsername }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    setShowDropdown(false);
    navigate('/');
  };

  const handleDropdownItemClick = (action) => {
    setShowDropdown(false);
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

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom fixed-top">
      <div className="container">
        <a className="navbar-brand" href="#home">
          <img src="/images/Logo_Book_Bite.png" alt="Logo" style={{ height: '100px' }} />
        </a>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => {
            const navbarNav = document.getElementById('navbarNav');
            navbarNav.classList.toggle('show');
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
                <div
                  className="d-flex align-items-center user-profile-container"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <span className="me-2 text-light">{username}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    fill="currentColor"
                    className="bi bi-person-circle"
                    viewBox="0 0 16 16"
                    style={{ cursor: 'pointer' }}
                  >
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                    <path
                      fillRule="evenodd"
                      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 1.613A7 7 0 0 0 8 1z"
                    />
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
  );
};

export default Navbar;
