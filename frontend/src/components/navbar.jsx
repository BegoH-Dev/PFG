import React from 'react';

const Navbar = () => (
  <nav className="bg-red-600 text-white p-4 flex justify-between">
    <div className="text-lg font-bold">Restaurante FESAC</div>
    <div className="space-x-4">
      <a href="#home" className="hover:underline">Inicio</a>
      <a href="#menu" className="hover:underline">Menú</a>
      <a href="#order" className="hover:underline">Pedidos</a>
      <a href="#reserve" className="hover:underline">Reservas</a>
    </div>
  </nav>
);

export default Navbar;