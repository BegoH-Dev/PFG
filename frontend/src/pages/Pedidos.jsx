import React from 'react';
import { useLocation } from 'react-router-dom';

const Pedidos = () => {
  const location = useLocation();
  const selectedDish = location.state?.selectedDish;

  return (
    <div>
        <h1>Pedidos</h1>
        {selectedDish && (
            <div>
            <h3>{selectedDish.nombre}</h3>
            <p>{selectedDish.descripcion}</p>
            {/* Añade campos para cantidad, dirección, etc. */}
            </div>
        )}
    </div>
  );
};

export default Pedidos; // 👈 Asegúrate de usar `export default`