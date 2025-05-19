import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-red-600 text-white p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo a la izquierda */}
        <div className="flex-shrink-0">
          <img src="/images/logo.jpg" alt="logo" className="w-1/4 h-auto mx-auto" />
        </div>

        {/* Menú centrado (en desktop) */}
        <div className="hidden md:flex space-x-6 flex-1 justify-center">
          <Link to="/" className="hover:text-red-200 transition duration-300">Inicio</Link>
          <Link to="/menu" className="hover:text-red-200 transition duration-300">Menú</Link>
          <Link to="/order" className="hover:text-red-200 transition duration-300">Pedidos</Link>
          <Link to="/reserve" className="hover:text-red-200 transition duration-300">Reservas</Link>
        </div>

        {/* Botones a la derecha (desktop) */}
        <div className="hidden md:flex space-x-2">
          <Link to="/registro">
            <button className="bg-white text-red-600 px-3 py-1 rounded hover:bg-gray-100 transition duration-300">
              Registrarse
            </button>
          </Link>
          <Link to="/inicioSesion">
            <button className="bg-white text-red-600 px-3 py-1 rounded hover:bg-gray-100 transition duration-300">
              Iniciar sesión
            </button>
          </Link>
        </div>

        {/* Botón menú móvil */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="focus:outline-none">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-red-400 w-full text-center">
          <div className="flex flex-col space-y-4">
            <Link to="/" className="block" onClick={() => setMobileMenuOpen(false)}>Inicio</Link>
            <Link to="/menu" className="block" onClick={() => setMobileMenuOpen(false)}>Menú</Link>
            <Link to="/order" className="block" onClick={() => setMobileMenuOpen(false)}>Pedidos</Link>
            <Link to="/reserve" className="block" onClick={() => setMobileMenuOpen(false)}>Reservas</Link>

            <div className="flex justify-center space-x-2 pt-2">
              <Link to="/registro" onClick={() => setMobileMenuOpen(false)}>
                <button className="bg-white text-red-600 px-3 py-1 rounded">Registrarse</button>
              </Link>
              <Link to="/inicioSesion" onClick={() => setMobileMenuOpen(false)}>
                <button className="bg-white text-red-600 px-3 py-1 rounded">Iniciar sesión</button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
