import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/global.css';

const Reserva = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedGuests, setSelectedGuests] = useState(1);
  const [availableTables, setAvailableTables] = useState(true);
  
  const [reservationData, setReservationData] = useState({
    name: '',
    lastname: '',
    phone: '',
    email: '',
    guests: 1,
    date: '',
    time: '',
    notes: ''
  });
  
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Horarios disponibles
  const availableTimes = [
    '14:30',
    '15:30',
    '21:00'
  ];

  // Generar calendario del mes actual
  const generateCalendar = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const calendar = [];
    let week = [];
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === currentMonth;
      const isToday = date.toDateString() === today.toDateString();
      const isPast = date < today && !isToday;
      
      week.push({
        date: date.getDate(),
        fullDate: date.toISOString().split('T')[0],
        isCurrentMonth,
        isToday,
        isPast,
        isSelectable: isCurrentMonth && !isPast
      });
      
      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }
    
    return calendar;
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const storedUsername = localStorage.getItem('username') || '';
    setIsLoggedIn(loggedIn);
    setUsername(storedUsername);
  }, []);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    setShowDropdown(false);
    window.location.reload();
  };

  const handleDropdownItemClick = (action) => {
    setShowDropdown(false);
    console.log(`Navegando a: ${action}`);
  };

  const handleDateSelect = (date) => {
    if (date.isSelectable) {
      setSelectedDate(date.fullDate);
      setReservationData(prev => ({
        ...prev,
        date: date.fullDate
      }));
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setReservationData(prev => ({
      ...prev,
      time: time
    }));
  };

  const handleGuestsChange = (guests) => {
    setSelectedGuests(guests);
    setReservationData(prev => ({
      ...prev,
      guests: guests
    }));
  };

  const handleInputChange = (field, value) => {
    setReservationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitReservation = () => {
    console.log('Reserva enviada:', reservationData);
    alert('¡Reserva confirmada con éxito! Te contactaremos pronto para confirmar los detalles.');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const calendar = generateCalendar();

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark navbar-custom fixed-top">
        <div className="container">
          <a className="navbar-brand" href="#home" onClick={() => navigate('/')}>
            <img 
              src="/images/Logo_Book_Bite.png" 
              alt="Logo" 
              style={{ height: '100px' }}
            />
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
            }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a className="nav-link" onClick={() => navigate('/')}>
                  Inicio
                </a>
              </li>  
              <li className="nav-item">
                <a className="nav-link" onClick={(e) => { e.preventDefault(); navigate('/carta'); }}>
                  Carta
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" onClick={(e) => { e.preventDefault(); navigate('/pedidos'); }}>
                  Pedidos
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" onClick={(e) => { e.preventDefault(); navigate('/reservas'); }}>
                  Reservas
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" onClick={(e) => { e.preventDefault(); navigate('/novedades'); }}>
                  Novedades
                </a>
              </li>
            </ul>
            
            <div className="d-flex flex-column flex-lg-row gap-2">
              {isLoggedIn ? (
                <div className="position-relative" ref={dropdownRef}>
                   <div className="d-flex align-items-center user-profile-container" style={{ cursor: 'pointer' }} onClick={() => setShowDropdown(!showDropdown)}>
                    <span className="me-2 text-light">{username}</span>
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
                      <div className="dropdown-item" onClick={() => handleDropdownItemClick('mis-reservas')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar-check" viewBox="0 0 16 16">
                          <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                          <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                        </svg>
                        Reservas
                      </div>
                      <div className="dropdown-item" onClick={() => handleDropdownItemClick('mis-pedidos')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bag-check" viewBox="0 0 16 16">
                          <path fillRule="evenodd" d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                          <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/>
                        </svg>
                        Pedidos
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

      {/* Main Content */}
      <div className="container" style={{ paddingTop: '140px', paddingBottom: '60px' }}>
        
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-4 mb-3" style={{ color: 'var(--gold)' }}>Reserva de mesa</h1>
          <p className="lead text-muted">Reserva tu mesa y disfruta de una experiencia gastronómica única</p>
        </div>

        {/* Progress Steps */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="d-flex justify-content-center align-items-center">
              <div className="step-container d-flex align-items-center">
                <div className={`step-circle ${currentStep >= 1 ? 'active' : ''}`}>
                  <span>1</span>
                </div>
                <div className="step-label">Mesa</div>
                <div className={`step-line ${currentStep >= 2 ? 'active' : ''}`}></div>
                
                <div className={`step-circle ${currentStep >= 2 ? 'active' : ''}`}>
                  <span>2</span>
                </div>
                <div className="step-label">Confirmación</div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 1: Reservation Details */}
        {currentStep === 1 && (
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card">
                <div className="card-header" style={{ backgroundColor: 'var(--gold)', color: 'white' }}>
                  <h5 className="mb-0">Haz tu reserva</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    {/* Formulario de datos */}
                    <div className="col-lg-6">
                      <form>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label htmlFor="name" className="form-label">Nombre *</label>
                            <input
                              type="text"
                              className="form-control"
                              id="name"
                              value={reservationData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              required
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label htmlFor="lastname" className="form-label">Apellidos *</label>
                            <input
                              type="text"
                              className="form-control"
                              id="lastname"
                              value={reservationData.lastname}
                              onChange={(e) => handleInputChange('lastname', e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label htmlFor="phone" className="form-label">Móvil *</label>
                            <input
                              type="tel"
                              className="form-control"
                              id="phone"
                              value={reservationData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              required
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label htmlFor="email" className="form-label">Correo electrónico *</label>
                            <input
                              type="email"
                              className="form-control"
                              id="email"
                              value={reservationData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="form-label">¿Para cuántos?</label>
                          <div className="guest-selector">
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => selectedGuests > 1 && handleGuestsChange(selectedGuests - 1)}
                              disabled={selectedGuests <= 1}
                            >
                              -
                            </button>
                            <span className="mx-3 fs-5">{selectedGuests}</span>
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => selectedGuests < 12 && handleGuestsChange(selectedGuests + 1)}
                              disabled={selectedGuests >= 12}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="mb-3">
                          <label htmlFor="notes" className="form-label">Nota para el gerente:</label>
                          <textarea
                            className="form-control"
                            id="notes"
                            rows="3"
                            value={reservationData.notes}
                            onChange={(e) => handleInputChange('notes', e.target.value)}
                            placeholder="Solicitudes especiales, alergias, celebraciones..."
                          ></textarea>
                        </div>
                      </form>
                    </div>

                    {/* Calendario y horarios */}
                    <div className="col-lg-6">
                      <div className="mb-4">
                        <h6 className="mb-3">Selecciona fecha:</h6>
                        <div className="calendar-widget">
                          <div className="calendar-header d-flex justify-content-between align-items-center mb-2">
                            <h6 className="mb-0">
                              {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                            </h6>
                          </div>
                          <div className="calendar-grid">
                            <div className="calendar-weekdays">
                              {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(day => (
                                <div key={day} className="calendar-weekday">{day}</div>
                              ))}
                            </div>
                            <div className="calendar-days">
                              {calendar.flat().map((date, index) => (
                                <div
                                  key={index}
                                  className={`calendar-day ${
                                    !date.isCurrentMonth ? 'other-month' :
                                    date.isPast ? 'past-date' :
                                    date.isToday ? 'today' :
                                    selectedDate === date.fullDate ? 'selected' :
                                    date.isSelectable ? 'selectable' : ''
                                  }`}
                                  onClick={() => handleDateSelect(date)}
                                >
                                  {date.date}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h6 className="mb-3">Horarios disponibles:</h6>
                        <div className="time-slots">
                          {availableTimes.map(time => (
                            <button
                              key={time}
                              type="button"
                              className={`btn time-slot ${selectedTime === time ? 'btn-primary-custom' : 'btn-outline-secondary'}`}
                              onClick={() => handleTimeSelect(time)}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>

                      {availableTables && selectedDate && selectedTime && (
                        <div className="alert alert-success">
                          <div className="d-flex align-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle me-2" viewBox="0 0 16 16">
                              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                              <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                            </svg>
                            <span><strong>Mesas disponibles:</strong> ✓</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-end mt-4">
                    <button
                      className="btn btn-primary-custom btn-lg"
                      onClick={nextStep}
                      disabled={!reservationData.name || !reservationData.lastname || !reservationData.phone || !reservationData.email || !selectedDate || !selectedTime}
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Confirmation */}
        {currentStep === 2 && (
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card">
                <div className="card-header" style={{ backgroundColor: 'var(--gold)', color: 'white' }}>
                  <h5 className="mb-0">Confirmar reserva</h5>
                </div>
                <div className="card-body">
                  {/* Reservation Summary */}
                  <div className="mb-4">
                    <h6>Datos de la reserva:</h6>
                    <div className="reservation-summary p-3 bg-light rounded">
                      <div className="row">
                        <div className="col-md-6">
                          <p className="mb-2"><strong>Nombre:</strong> {reservationData.name} {reservationData.lastname}</p>
                          <p className="mb-2"><strong>Teléfono:</strong> {reservationData.phone}</p>
                          <p className="mb-2"><strong>Email:</strong> {reservationData.email}</p>
                        </div>
                        <div className="col-md-6">
                          <p className="mb-2"><strong>Comensales:</strong> {reservationData.guests}</p>
                          <p className="mb-2"><strong>Fecha y hora:</strong> {formatDate(selectedDate)} {selectedTime}</p>
                          {reservationData.notes && (
                            <p className="mb-2"><strong>Observaciones:</strong> {reservationData.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Important Information */}
                  <div className="alert alert-info mb-4">
                    <h6 className="alert-heading">Información importante:</h6>
                    <ul className="mb-0">
                      <li>Te contactaremos por teléfono para confirmar tu reserva</li>
                      <li>Las reservas se mantienen por 15 minutos después de la hora programada</li>
                      <li>Puedes cancelar o modificar tu reserva llamando al restaurante</li>
                    </ul>
                  </div>

                  <div className="d-flex justify-content-between">
                    <button className="btn btn-secondary" onClick={prevStep}>
                      Volver atrás
                    </button>
                    <button
                      className="btn btn-primary-custom btn-lg"
                      onClick={handleSubmitReservation}
                    >
                      Confirmar reserva
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .guest-selector {
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        
        .calendar-widget {
          border: 1px solid #dee2e6;
          border-radius: 0.375rem;
          padding: 1rem;
        }
        
        .calendar-grid {
          width: 100%;
        }
        
        .calendar-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
          margin-bottom: 0.5rem;
        }
        
        .calendar-weekday {
          text-align: center;
          font-weight: bold;
          padding: 0.5rem;
          color: var(--gold);
        }
        
        .calendar-days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
        }
        
        .calendar-day {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.25rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .calendar-day.selectable:hover {
          background-color: var(--gold);
          color: white;
        }
        
        .calendar-day.selected {
          background-color: var(--gold);
          color: white;
          font-weight: bold;
        }
        
        .calendar-day.today {
          background-color: #e3f2fd;
          font-weight: bold;
        }
        
        .calendar-day.past-date {
          color: #ccc;
          cursor: not-allowed;
        }
        
        .calendar-day.other-month {
          color: #999;
        }
        
        .time-slots {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .time-slot {
          width: 100%;
          text-align: center;
        }
        
        .reservation-summary {
          border-left: 4px solid var(--gold);
        }
      `}</style>
    </>
  );
};

export default Reserva;