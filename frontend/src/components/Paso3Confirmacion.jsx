import React from 'react';

const Paso3Confirmacion = ({ 
  cartItems, 
  deliveryData, 
  getTotalPrice, 
  handleFinalizeOrder,
  prevStep
}) => {
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
              <span>{item.name} x{item.quantity}</span>
              <span>{(parseFloat(item.price.toString().replace(',', '.')) * item.quantity).toFixed(2)}€</span>
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
            backgroundColor: '#6c757d', 
            color: '#fff', 
            border: 'none', 
            padding: '0.75rem 2rem', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '1rem'
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