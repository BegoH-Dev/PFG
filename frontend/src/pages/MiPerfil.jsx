import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/global.css';

const MiPerfil = () => {
    const [username, setUsername] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [usuario, setUsuario] = useState({ nombre: '', email: '', telefono: '', direccion: '' });
    const [pedidosHistorial, setPedidosHistorial] = useState([]);
    const [reservasHistorial, setReservasHistorial] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(usuario);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [updateError, setUpdateError] = useState('');
    const [activeTab, setActiveTab] = useState('perfil');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userPhone');
        localStorage.removeItem('userAddress');
        setShowDropdown(false);
        setIsLoggedIn(false);
        navigate('/InicioSesion');
    };

    const handleDropdownItemClick = (action) => {
        console.log('Dropdown clicked:', action);
        setShowDropdown(false);
        if (action === 'perfil') setActiveTab('perfil');
        if (action === 'pedidos') setActiveTab('pedidos');
        if (action === 'reservas') setActiveTab('reservas');
    }

  // Función para manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

// Función para guardar los cambios
  const handleSaveChanges = async () => {
    try {
      // Validación básica
      if (!formData.nombre || !formData.email) {
        setUpdateError('Nombre y email son obligatorios');
        return;
      }

      const token = localStorage.getItem('token');

      // Actualizar en la base de datos
      const response = await fetch('http://localhost:5000/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar los datos');
      }

      // Actualizar estado local y localStorage
      setUsuario(formData);
      localStorage.setItem('username', formData.nombre);
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('userPhone', formData.telefono);
      localStorage.setItem('userAddress', formData.direccion);

      setUpdateSuccess(true);
      setUpdateError('');
      setIsEditing(false);
    } catch (error) {
      console.error('Error:', error);
      setUpdateError('No se pudieron guardar los cambios. Inténtalo de nuevo.');
    }
  };

    // Función segura para parsear JSON desde localStorage
    const safeJSONParse = (key) => {
      try {
          return JSON.parse(localStorage.getItem(key) || '[]');
      } catch {
          return [];
      }
    };

    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const storedUsername = localStorage.getItem('username') || '';
        setIsLoggedIn(loggedIn);
        setUsername(storedUsername);

            // Verificar si el usuario está logueado
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            if (!isLoggedIn) {
                navigate('/InicioSesion');
                return;
            }
        
            // Cargar datos del usuario
            const username = localStorage.getItem('username') || '';
            const userEmail = localStorage.getItem('userEmail') || '';
            const userPhone = localStorage.getItem('userPhone') || '';
            const userAddress = localStorage.getItem('userAddress') || '';
            
            setUsuario({
                nombre: username,
                email: userEmail,
                telefono: userPhone,
                direccion: userAddress
            });

            // Cargar historial de pedidos desde localStorage
            const pedidosGuardados = safeJSONParse('historialPedidos');
            setPedidosHistorial(pedidosGuardados);

            // Cargar historial de reservas desde localStorage
            const reservasGuardadas = safeJSONParse('historialReservas');
            setReservasHistorial(reservasGuardadas);

            setIsLoading(false);
        }, [navigate]);

  const getEstadoColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'completado':
      case 'entregado':
        return 'success';
      case 'en preparación':
      case 'preparando':
        return 'warning';
      case 'cancelado':
        return 'danger';
      case 'pendiente':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'Fecha no disponible';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

// Función para formatear el método de pago
const formatearMetodoPago = (metodoPago) => {
  switch (metodoPago) {
    case 'cash':
      return 'Efectivo';
    case 'paypal':
      return 'PayPal';
    case 'card':
      return 'Tarjeta de crédito';
    default:
      return metodoPago || 'No especificado';
  }
};

const calcularTotalPedido = (productos) => {
  if (!productos || !Array.isArray(productos)) return '0.00';
  return productos.reduce((total, producto) => {
    const precio = parseFloat(producto.precio?.toString().replace(',', '.') || '0');
    const cantidad = producto.cantidad || 1;
    return total + (precio * cantidad);
  }, 0).toFixed(2);
};

    return (
    <>     
      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando tu información...</p>
        </div>
      ) : (
      <>
        {/* Navbar */}
        <Navbar isLoggedIn={isLoggedIn} username={username} showDropdown={showDropdown} 
        setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} setShowDropdown={setShowDropdown} 
        onLogout={handleLogout} onDropdownItemClick={handleDropdownItemClick} navigate={navigate}/>

        <div className="container mt-5 py-5">
          <div className="row">

            {/* Sidebar de navegación */}
            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                <div className="text-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" className="bi bi-person-circle text-muted" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                    <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 1.613A7 7 0 0 0 8 1z"/>
                    </svg>
                    <h5 className="mt-2">{usuario.nombre}</h5>
                </div>
                
                <div className="list-group list-group-flush">
                    {/* Botón: Mi Perfil */}
                    <button 
                    className={`list-group-item list-group-item-action ${activeTab === 'perfil' ? 'active' : ''}`}
                    onClick={() => setActiveTab('perfil')}
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person me-2" viewBox="0 0 16 16">
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
                    </svg>
                    Mi Perfil
                    </button>

                    {/* Botón: Mis Pedidos */}
                    <button 
                    className={`list-group-item list-group-item-action ${activeTab === 'pedidos' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pedidos')}
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bag-check me-2" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                        <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/>
                    </svg>
                    Mis Pedidos ({pedidosHistorial.length})
                    </button>
                    
                    {/* Botón: Mis Reservas */}
                    <button 
                    className={`list-group-item list-group-item-action ${activeTab === 'reservas' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reservas')}
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar-check me-2" viewBox="0 0 16 16">
                        <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                    </svg>
                    Mis Reservas ({reservasHistorial.length})
                    </button>
                    
                    {/* Botón: Mis Favoritos */}
                    <button 
                      className={`list-group-item list-group-item-action ${activeTab === 'favoritos' ? 'active' : ''}`}
                      onClick={() => setActiveTab('favoritos')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart me-2" viewBox="0 0 16 16">
                        <path d="m8 2.748-.717-.737C5.6.281 2.514 3.09 4.016 6.563c.6 1.388 1.894 2.84 3.984 4.385 2.09-1.545 3.383-2.997 3.984-4.385C13.486 3.09 10.4.28 8.717 2.01L8 2.748z"/>
                        <path d="M8 15C-7.333 4.868 3.279-3.04 7.824 1.143 8 1.318 8.176 1.143 8.176 1.143 12.72-3.042 23.333 4.867 8 15z"/>
                      </svg>
                      Mis Favoritos
                    </button>

                    {/* Botón: Cambiar Contraseña */}
                    <button 
                      className={`list-group-item list-group-item-action ${activeTab === 'password' ? 'active' : ''}`} 
                      onClick={() => setActiveTab('password')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-key me-2" viewBox="0 0 16 16">
                        <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8zm4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5z"/>
                        <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                      </svg>
                      Cambiar Contraseña
                    </button>

                    {/* Botón: Eliminar Cuenta */}
                    <button 
                      className={`list-group-item list-group-item-action ${activeTab === 'delete' ? 'active' : ''}`} 
                      onClick={() => setActiveTab('delete')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-x me-2" viewBox="0 0 16 16">
                        <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm.256 7a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Z"/>
                        <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-.646-4.854.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 0 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 .708-.708Z"/>
                      </svg>
                      Eliminar Cuenta
                    </button>
                </div>
                </div>
            </div>
        </div>

        {/* Contenido principal */}
        <div className="col-md-9">
          {activeTab === 'perfil' && (
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Información Personal</h4>
                <button className="btn btn-outline-primary btn-sm" 
                  onClick={() => {
                    setIsEditing(true);
                    setFormData(usuario);
                    setUpdateSuccess(false);
                    setUpdateError('');
                  }}>                  
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil me-1" viewBox="0 0 16 16">
                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708L5.707 14.707a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                  </svg>
                  Editar
                </button>
              </div>
              <div className="card-body">
                {isEditing ? (
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Teléfono</label>
                    <input
                      type="text"
                      className="form-control"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                    />                  
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Dirección</label>
                    <input
                      type="text"
                      className="form-control"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleInputChange}
                    />                  
                  </div>
                  <div className="col-12 mt-3">
                    {updateError && <div className="alert alert-danger">{updateError}</div>}
                    {updateSuccess && <div className="alert alert-success">Datos actualizados correctamente</div>}
                  <div className="d-flex gap-2">
                    <button className="btn btn-primary" onClick={handleSaveChanges}>
                      Guardar cambios
                    </button>
                    <button 
                      className="btn btn-outline-secondary" 
                      onClick={() => setIsEditing(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold">Nombre</label>
                  <p className="form-control-plaintext">{usuario.nombre || 'No especificado'}</p>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Email</label>
                  <p className="form-control-plaintext">{usuario.email || 'No especificado'}</p>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Teléfono</label>
                  <p className="form-control-plaintext">{usuario.telefono || 'No especificado'}</p>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Dirección</label>
                  <p className="form-control-plaintext">{usuario.direccion || 'No especificado'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

          {/* SECCIÓN DE PEDIDOS */}
          {activeTab === 'pedidos' && (
            <div className="card">
              <div className="card-header">
                <h4 className="mb-0">Historial de Pedidos</h4>
              </div>
              <div className="card-body">
                {pedidosHistorial.length === 0 ? (
                  <div className="text-center py-5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-bag text-muted mb-3" viewBox="0 0 16 16">
                      <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/>
                    </svg>
                    <h5 className="text-muted">No hay pedidos realizados</h5>
                    <p className="text-muted">Cuando realices tu primer pedido, aparecerá aquí.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/pedidos')}>
                      Hacer un pedido
                    </button>
                  </div>
                ) : (
                  <div className="row g-3">
                    {pedidosHistorial.map((pedido, index) => (
                      <div key={index} className="col-12">
                        <div className="card border">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div>
                                <h6 className="card-title mb-1">Pedido #{pedido.id || index + 1}</h6>
                                <small className="text-muted">{formatearFecha(pedido.fecha)}</small>
                              </div>
                              <span className={`badge bg-${getEstadoColor(pedido.estado)}`}>
                                {pedido.estado || 'Pendiente'}
                              </span>
                            </div>
                            
                            {/* PRODUCTOS */}
                            {pedido.productos && pedido.productos.length > 0 && (
                              <div className="mb-3">
                                <h6 className="mb-2">Productos:</h6>
                                <div className="table-responsive">
                                  <table className="table table-sm table-borderless">
                                    <thead>
                                      <tr>
                                        <th>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Precio</th>
                                        <th>Subtotal</th>
                                      </tr>
                                    </thead>
                                  <tbody>
                                    {pedido.productos.map((producto, idx) => (
                                      <tr key={idx}>
                                        <td>{producto.nombre}</td>
                                        <td>{producto.cantidad}</td>
                                        <td>{producto.precio}€</td>
                                        <td>{(producto.precio * producto.cantidad).toFixed(2)}€</td>
                                      </tr>
                                    ))}
                              </tbody>
                              <tfoot>
                                <tr>
                                  <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                                  <td><strong className="h5 mb-0">{pedido.total || calcularTotalPedido(pedido.productos)}€</strong></td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Información adicional del pedido */}
                      <div className="row g-2 mt-2">
                        {/* Dirección */}                
                        {pedido.direccion && (
                            <div className="col-md-6">
                              <small className="text-muted d-flex align-items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt me-1" viewBox="0 0 16 16">
                                  <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z"/>
                                  <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                                </svg>
                                <strong>Dirección:</strong>&nbsp;{pedido.direccion}
                              </small>
                            </div>
                            )}

                            {/* Método de pago */}
                            {pedido.metodoPago && (
                              <div className="col-md-6">
                                <small className="text-muted d-flex align-items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-credit-card me-2" viewBox="0 0 16 16">
                                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1H2zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7z"/>
                                    <path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1z"/>
                                  </svg>
                                  <strong>Pago:</strong>&nbsp;{formatearMetodoPago(pedido.metodoPago)}
                                </small>
                              </div>
                            )}

                            {/* Notas adicionales */}
                            {pedido.notas && pedido.notas.trim() !== '' && (
                              <div className="col-12">
                                <small className="text-muted d-flex align-items-start">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-text me-2 mt-1" viewBox="0 0 16 16">
                                    <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
                                    <path d="M4 5.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8zm0 2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z"/>
                                  </svg>
                                  <div>
                                    <strong>Notas:</strong>&nbsp;{pedido.notas}
                                  </div>
                                </small>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

          {activeTab === 'reservas' && (
            <div className="card">
              <div className="card-header">
                <h4 className="mb-0">Historial de Reservas</h4>
              </div>
              <div className="card-body">
                {reservasHistorial.length === 0 ? (
                  <div className="text-center py-5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-calendar text-muted mb-3" viewBox="0 0 16 16">
                      <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                    </svg>
                    <h5 className="text-muted">No hay reservas realizadas</h5>
                    <p className="text-muted">Cuando hagas tu primera reserva, aparecerá aquí.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/reservas')}>
                      Hacer una reserva
                    </button>
                  </div>
                ) : (
                  <div className="row g-3">
                    {reservasHistorial.map((reservas, index) => (
                      <div key={index} className="col-md-6">
                        <div className="card border">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h6 className="card-title mb-0">Reservas #{reservas.id || index + 1}</h6>
                              <span className={`badge bg-${getEstadoColor(reservas.estado)}`}>
                                {reservas.estado || 'Confirmada'}
                              </span>
                            </div>
                            <p className="text-muted mb-2">{formatearFecha(reservas.fecha)}</p>
                            <div className="small">
                              <div><strong>Personas:</strong> {reservas.personas}</div>
                              <div><strong>Mesa:</strong> {reservas.mesa || 'Asignación automática'}</div>
                              {reservas.observaciones && (
                                <div><strong>Observaciones:</strong> {reservas.observaciones}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
        {/* FOOTER */}
        <Footer />
        </>
      )}
    </>
  );
};


export default MiPerfil;