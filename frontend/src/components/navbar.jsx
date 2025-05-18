import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="bg-red-600 text-white p-4 flex justify-between items-center">
    <img src="/images/logo.jpg" alt="logo" className="h-10" />

    <div className="space-x-4">
      <Link to="/">Inicio</Link>
      <Link to="/menu">Menú</Link>
      <Link to="/order">Pedidos</Link>
      <Link to="/reserve">Reservas</Link>
    </div>

    <div className="space-x-2">
      <Link to="/registro">
        <button className="bg-white text-red-600 px-3 py-1 rounded hover:bg-gray-100">Registrarse</button>
      </Link>
      <Link to="/inicioSesion">
        <button className="bg-white text-red-600 px-3 py-1 rounded hover:bg-gray-100">Iniciar sesión</button>
      </Link>
    </div>
  </nav>
);

export default Navbar;
