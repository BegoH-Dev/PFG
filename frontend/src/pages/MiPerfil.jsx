import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/global.css';

const MiPerfil = () => {
    const [activeSection, setActiveSection] = useState('home');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const [usuario, setUsuario] = useState({
        nombre: '',
        email: '',
        telefono: '',
        direccion: ''
    });
    const [pedidosHistorial, setPedidosHistorial] = useState([]);
    const [reservasHistorial, setReservasHistorial] = useState([]);
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

    // Función para desplazarse a una sección específica
    const scrollToSection = (sectionId) => {
        setActiveSection(sectionId);
        const element = document.getElementById(sectionId);
        if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
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

        const handleEditProfile = () => {
            console.log('Editar perfil');
        };

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
      case 'confirmado':
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

  const calcularTotalPedido = (productos) => {
    if (!productos || !Array.isArray(productos)) return '0.00';
    return productos.reduce((total, producto) => {
      return total + (producto.precio * producto.cantidad);
    }, 0).toFixed(2);
  };

    return (
       <>      
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark navbar-custom fixed-top">
        <div className="container">
          <a className="navbar-brand" href="#home">
            <img src="/images/Logo_Book_Bite.png" alt="Logo" style={{ height: '100px' }}/>
          </a>
          
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => {
              const navbarNav = document.getElementById('navbarNav');
              if (navbarNav.classList.contains('show')) {
                navbarNav.classList.remove('show');
              } else {
                navbarNav.classList.add('show');
              }
            }}>
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
                   <div className="d-flex align-items-center user-profile-container" style={{ cursor: 'pointer' }} onClick={() => setShowDropdown(!showDropdown)}>
                    <span className="me-2 text-light">{usuario.nombre}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16" style={{ cursor: 'pointer' }}>
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                      <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 1.613A7 7 0 0 0 8 1z" />
                    </svg>
                </div>

                {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="user-dropdown">
                      <div className="dropdown-item" onClick={() => handleDropdownItemClick('perfil')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
                        </svg>
                        Mi perfil
                      </div>
                      <div className="dropdown-item" onClick={() => handleDropdownItemClick('reservas')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar-check" viewBox="0 0 16 16">
                          <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                          <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                        </svg>
                        Mis reservas
                      </div>
                      <div className="dropdown-item" onClick={() => handleDropdownItemClick('pedidos')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bag-check" viewBox="0 0 16 16">
                          <path fillRule="evenodd" d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                          <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/>
                        </svg>
                        Mis pedidos
                      </div>
                      <div className="dropdown-divider"></div>
                      <div className="dropdown-item logout-item" onClick={handleLogout}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                          <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                          <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                        </svg>
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


    <div className="container mt-5 pt-5">
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
                <button 
                  className={`list-group-item list-group-item-action ${activeTab === 'perfil' ? 'active' : ''}`}
                  onClick={() => setActiveTab('perfil')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person me-2" viewBox="0 0 16 16">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
                  </svg>
                  Mi Perfil
                </button>
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
                <button className="btn btn-outline-primary btn-sm" onClick={handleEditProfile}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil me-1" viewBox="0 0 16 16">
                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708L5.707 14.707a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                  </svg>
                  Editar
                </button>
              </div>
              <div className="card-body">
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
              </div>
            </div>
          )}

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
                            
                            {pedido.productos && pedido.productos.length > 0 && (
                              <div className="mb-3">
                                <h6 className="mb-2">Productos:</h6>
                                {pedido.productos.map((producto, idx) => (
                                  <div key={idx} className="d-flex justify-content-between align-items-center py-1 border-bottom">
                                    <div>
                                      <span className="fw-medium">{producto.nombre}</span>
                                      <small className="text-muted"> x{producto.cantidad}</small>
                                    </div>
                                    <span>{(producto.precio * producto.cantidad).toFixed(2)}€</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                {pedido.direccion && (
                                  <small className="text-muted">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt me-1" viewBox="0 0 16 16">
                                      <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z"/>
                                      <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                                    </svg>
                                    {pedido.direccion}
                                  </small>
                                )}
                              </div>
                              <div className="text-end">
                                <strong className="h5 mb-0">
                                  {pedido.total || calcularTotalPedido(pedido.productos)}€
                                </strong>
                              </div>
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
                    {reservasHistorial.map((reserva, index) => (
                      <div key={index} className="col-md-6">
                        <div className="card border">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h6 className="card-title mb-0">Reserva #{reserva.id || index + 1}</h6>
                              <span className={`badge bg-${getEstadoColor(reserva.estado)}`}>
                                {reserva.estado || 'Confirmada'}
                              </span>
                            </div>
                            <p className="text-muted mb-2">{formatearFecha(reserva.fecha)}</p>
                            <div className="small">
                              <div><strong>Personas:</strong> {reserva.personas}</div>
                              <div><strong>Mesa:</strong> {reserva.mesa || 'Asignación automática'}</div>
                              {reserva.observaciones && (
                                <div><strong>Observaciones:</strong> {reserva.observaciones}</div>
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
    </>
  );
};


export default MiPerfil;