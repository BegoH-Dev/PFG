import React from 'react';

const Paso2DatosEnvio = ({ 
  deliveryData, 
  handleDeliveryChange, 
  isFormValid, 
  isLoggedIn, 
  clearDeliveryData,
  prevStep,
  nextStep,
  isPaymentValid
}) => {
  return (
    <div style={{ 
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: '1px solid #e0e0e0',
      display: 'flex',
      gap: '2rem'
    }}>

      {/* SECCIÓN DATOS DE ENTREGA */}
      <div style={{ flex: 1, minWidth: '300px' }}>
        <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>Datos de entrega</h3>
        
        <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '600px' }}>
          <div>
            <label>Nombre *</label>
            <input
              type="text"
              value={deliveryData.firstName}
              onChange={(e) => handleDeliveryChange('firstName', e.target.value)}
              placeholder="Ej: Juan"
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #ddd', 
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>
          <div>
            <label>Apellidos *</label>
            <input
              type="text"
              value={deliveryData.lastName}
              onChange={(e) => handleDeliveryChange('lastName', e.target.value)}
              placeholder="Ej: Pérez Gómez"
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #ddd', 
                borderRadius: '4px',
                fontSize: '1rem'
              }}/>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Dirección de entrega *
            </label>
            <input
              type="text"
              value={deliveryData.address}
              onChange={(e) => handleDeliveryChange('address', e.target.value)}
              placeholder="Ej: Calle Mayor 123, 2º B"
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #ddd', 
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Teléfono de contacto *
            </label>
            <input
              type="tel"
              value={deliveryData.phone}
              onChange={(e) => handleDeliveryChange('phone', e.target.value)}
              placeholder="Ej: +34 123 456 789"
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #ddd', 
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>
          <div>
            <label>Correo electrónico *</label>
            <input
              type="email"
              value={deliveryData.email}
              onChange={(e) => handleDeliveryChange('email', e.target.value)}
              placeholder="Ej: juan@email.com"
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #ddd', 
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Notas adicionales (opcional)
            </label>
            <textarea
              value={deliveryData.notes}
              onChange={(e) => handleDeliveryChange('notes', e.target.value)}
              placeholder="Ej: 2º piso, portero automático, sin cebolla..."
              rows={4}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #ddd', 
                borderRadius: '4px',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
          </div>
          {isLoggedIn && (
            <button onClick={clearDeliveryData}>
              Cambiar datos
            </button>
          )}              
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', width: '100%' }}>
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
        </div>
      </div>
    
      {/* LÍNEA DIVISORIA */}
      <div style={{ width: '1px', backgroundColor: '#ddd' }} />

      {/* SECCIÓN MÉTODO DE PAGO */}
      <div style={{ flex: 1 }}>
        <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>Método de pago</h3>

        <div style={{ display: 'grid', gap: '1rem', maxWidth: '600px' }}>
          <div>
            <label style={{ fontWeight: '500', marginBottom: '0.5rem', display: 'block' }}>
              Selecciona un método *
            </label>
            <select
              value={deliveryData.paymentMethod}
              onChange={(e) => handleDeliveryChange('paymentMethod', e.target.value)}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}>
              <option value="">Selecciona una opción</option>
              <option value="cash">Efectivo</option>
              <option value="card">Tarjeta</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>

          {deliveryData.paymentMethod === 'card' && (
            <>
              <div>
                <label>Titular de la tarjeta *</label>
                <input
                  type="text"
                  value={deliveryData.cardName}
                  onChange={(e) => handleDeliveryChange('cardName', e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }} />
              </div>
              <div>
                <label>Número de tarjeta *</label>
                <input
                  type="text"
                  value={deliveryData.cardNumber}
                  onChange={(e) => handleDeliveryChange('cardNumber', e.target.value)}
                  placeholder="Ej: 1234 5678 9012 3456"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label>Fecha de vencimiento *</label>
                  <input
                    type="text"
                    value={deliveryData.cardExpiry}
                    onChange={(e) => handleDeliveryChange('cardExpiry', e.target.value)}
                    placeholder="MM/AA"
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}/>
                </div>
                <div style={{ flex: 1 }}>
                  <label>CVV *</label>
                  <input
                    type="text"
                    value={deliveryData.cardCVV}
                    onChange={(e) => handleDeliveryChange('cardCVV', e.target.value)}
                    placeholder="123"
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}/>
                </div>
              </div>
            </>
          )}
        </div>
      
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
          <button 
              onClick={nextStep}
              disabled={!deliveryData.firstName || !deliveryData.lastName || !deliveryData.email || !deliveryData.address ||
                 !deliveryData.phone || !isPaymentValid() || !isFormValid()}
              style={{ 
                backgroundColor: deliveryData.address && deliveryData.phone && isFormValid() ? '#D4AF37' : '#ccc', 
                color: deliveryData.address && deliveryData.phone && isFormValid() ? '#000' : '#666',
                border: 'none', 
                padding: '0.75rem 2rem', 
                borderRadius: '4px', 
                cursor: deliveryData.address && deliveryData.phone && isFormValid() ? 'pointer' : 'not-allowed',
                fontSize: '1rem',
                fontWeight: '500'
              }}
            >
              Continuar
          </button>
        </div>  
      </div>
    </div>
  );
};

export default Paso2DatosEnvio;