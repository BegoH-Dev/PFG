import React from 'react';

const Paso1Carro = ({ 
  cartItems, 
  selectedProduct, 
  setSelectedProduct, 
  productosArray, 
  addToCart, 
  updateQuantity, 
  removeFromCart, 
  getTotalPrice, 
  selectedDish, 
  botonEstilo, 
  nextStep 
}) => {
  return (
    <div style={{ 
      backgroundColor: '#fff', 
      borderRadius: '12px', 
      padding: '2rem', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: '1px solid #e0e0e0'
    }}>
      <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>Lista de pedidos</h3>
      
      {/* PARA SELECCIONAR EL PLATO */}
      {selectedDish && (
        <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#e9ecef', borderRadius: '8px' }}>
          <h4 style={{ margin: 0 }}>{selectedDish.nombre}</h4>
          <p style={{ margin: 0, color: '#555' }}>{selectedDish.descripcion}</p>
          <p style={{ margin: 0, color: '#888' }}>{selectedDish.allergenText}</p>
          <img 
            src={selectedDish.image} 
            alt={selectedDish.nombre} 
            style={{ maxWidth: '100%', height: 'auto', marginTop: '0.5rem' }} 
          />
        </div>
      )}

      {/* AÑADIR PRODUCTO */}
      <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Producto</label>
            <select 
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #ddd', 
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            >
              <option value="">Seleccionar producto...</option>
              {productosArray.map(producto => (
                <option key={producto.id} value={producto.id}>
                  {producto.name} - {parseFloat(producto.price.replace(',', '.')).toFixed(2)} €
                </option>
              ))}
            </select>
          </div>
          <button onClick={addToCart} disabled={!selectedProduct} style={botonEstilo}>
            Añadir producto
          </button>
        </div>
      </div>

      {/* PRODUCTOS DEL CARRITO */}
      {cartItems.length > 0 ? (
        <div style={{ marginBottom: '2rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #ddd' }}>Producto</th>
                <th style={{ padding: '1rem', textAlign: 'center', border: '1px solid #ddd' }}>Cantidad</th>
                <th style={{ padding: '1rem', textAlign: 'right', border: '1px solid #ddd' }}>Suma</th>
                <th style={{ padding: '1rem', textAlign: 'center', border: '1px solid #ddd' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => {
                const priceNum = parseFloat(item.price.replace(',', '.')) || 0;
                const totalPrice = (priceNum * item.quantity).toFixed(2);
                return (
                  <tr key={item.id}>
                    <td style={{ padding: '1rem', border: '1px solid #ddd' }}>
                      <div>
                        <strong>{item.name}</strong>
                        <p style={{ fontSize: '0.9rem', color: '#555' }}>{item.description}</p>
                        <p style={{ fontSize: '0.8rem', color: '#888' }}>{item.allergenText}</p>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', border: '1px solid #ddd' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                          style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '4px',
                            border: 'none',
                            cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                            backgroundColor: '#D4AF37',
                            color: '#000',
                          }}
                          aria-label={`Disminuir cantidad de ${item.name}`}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '4px',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: '#D4AF37',
                            color: '#000',
                          }}
                          aria-label={`Aumentar cantidad de ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right', border: '1px solid #ddd' }}>
                      {totalPrice} €
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', border: '1px solid #ddd' }}>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '4px',
                          border: 'none',
                          cursor: 'pointer',
                          backgroundColor: '#D4AF37',
                          color: '#000',
                        }}
                        aria-label={`Eliminar ${item.name} del carrito`}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #D4AF37' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Total</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#D4AF37' }}>{getTotalPrice().toFixed(2)}€</span>
          </div>
          
          <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
            <button 
              onClick={nextStep}
              disabled={cartItems.length === 0}
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
              Continuar
            </button>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          <p>Tu carrito está vacío. ¡Añade algunos productos para continuar!</p>
        </div>
      )}
    </div>
  );
};

export default Paso1Carro;