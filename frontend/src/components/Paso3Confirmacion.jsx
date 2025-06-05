import React, { useState } from 'react';

const Paso3Confirmacion = ({ 
  cartItems, 
  deliveryData,
  usuarioId, 
  getTotalPrice, 
  prevStep,
  onOrderConfirmed 
}) => {
  const [fechaPedido, setFechaPedido] = useState(null);

  const handleFinalizeOrder = () => {
    const productosNormalizados = cartItems.map(item => ({
        id: item.id,
        nombre: item.name || item.nombre,
        precio: parseFloat(item.price?.toString().replace(',', '.')) || 0,
        cantidad: item.quantity || item.cantidad || 1,
    }));
  
  const fechaActual = new Date();

  const nuevoPedido = {
    productos: productosNormalizados,
    total: parseFloat(getTotalPrice().toFixed(2)),
    estado: 'pendiente',
    fecha: fechaActual.toISOString(),
    direccion: deliveryData.address,
    metodoPago: deliveryData.paymentMethod,
    notas: deliveryData.notes || '',
    datosEntrega: deliveryData,
  };

  setFechaPedido(fechaActual);

  const pedidosPrevios = JSON.parse(localStorage.getItem('historialPedidos') || '[]');
  pedidosPrevios.push(nuevoPedido);
  localStorage.setItem('historialPedidos', JSON.stringify(pedidosPrevios));

  console.log('Usuario ID desde props:', usuarioId);
  if (!usuarioId) {
    alert('Error: usuario no identificado. Por favor inicia sesión.');
    return;
  }
  fetch(`http://localhost:5000/usuarios/${usuarioId}/pedidos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevoPedido)
  })
  .then(response => {
    if (!response.ok) throw new Error('Error al guardar el pedido');
    return response.json();
  })
  .then(data => {
    console.log('Pedido guardado:', data);
    alert('Pedido confirmado correctamente');
    if(onOrderConfirmed) onOrderConfirmed();
  })
  .catch(error => {
    console.error('Error:', error.message);
    alert('Error al guardar el pedido en el servidor: ' + error.message);
  });

  console.log('Pedidos guardados:', JSON.parse(localStorage.getItem('historialPedidos')));
};

  return (
    <div style={{ 
      backgroundColor: '#fff', 
      borderRadius: '12px', 
      padding: '2rem', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: '1px solid #e0e0e0'
    }}>
      <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>Confirmación del pedido</h3>
      
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* RESUMEN DE PEDIDO */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h5 style={{ marginBottom: '1rem', color: '#D4AF37' }}>Resumen del pedido</h5>
          {cartItems.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', 
              padding: '0.5rem 0'
            }}>
              <span>{item.name || item.nombre} x{item.quantity || item.cantidad}</span>
              <span>{(parseFloat(item.price?.toString().replace(',', '.') || '0') * (item.quantity || item.cantidad || 1)).toFixed(2)}€</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', borderTop: '2px solid #D4AF37', 
            paddingTop: '1rem'
          }}>
            <strong>Total</strong>
            <strong style={{ color: '#D4AF37' }}>{getTotalPrice().toFixed(2)}€</strong>
          </div>
        </div>

        {/* DETALLES DE ENVÍO */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h5 style={{ marginBottom: '1rem', color: '#D4AF37' }}>Datos de entrega</h5>
          <p><strong>Fecha del pedido:</strong> {fechaPedido ? fechaPedido.toLocaleString() : 'No disponible'}</p>
          <p><strong>Nombre:</strong> {deliveryData.firstName} {deliveryData.lastName}</p>
          <p><strong>Email:</strong> {deliveryData.email}</p>
          <p><strong>Teléfono:</strong> {deliveryData.phone}</p>
          <p><strong>Dirección:</strong> {deliveryData.address}</p>
          {deliveryData.notes && <p><strong>Notas:</strong> {deliveryData.notes}</p>}
          <p><strong>Método de pago:</strong> {
            deliveryData.paymentMethod === 'cash' ? 'Efectivo' :
            deliveryData.paymentMethod === 'paypal' ? 'PayPal' :
            'Tarjeta de crédito'
          }</p>
          {deliveryData.paymentMethod === 'card' && (
            <>
              <p><strong>Titular:</strong> {deliveryData.cardName}</p>
              <p><strong>Número:</strong> **** **** **** {deliveryData.cardNumber?.slice(-4)}</p>
              <p><strong>Expira:</strong> {deliveryData.cardExpiry}</p>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
        <button 
          onClick={prevStep}
          style={{ 
            backgroundColor: '#6c757d', color: '#fff', border: 'none', padding: '0.75rem 2rem', 
            borderRadius: '4px', cursor: 'pointer', fontSize: '1rem'
          }}
        >
          Volver
        </button>
        <button 
          onClick={handleFinalizeOrder}
          style={{ 
            backgroundColor: '#D4AF37', 
            color: '#000', 
            border: 'none', 
            padding: '0.75rem 2rem', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          Confirmar pedido
        </button>
      </div>
    </div>
  );
};

export default Paso3Confirmacion;