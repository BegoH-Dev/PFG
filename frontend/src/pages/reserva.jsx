import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/global.css';

const Reserva = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedGuests, setSelectedGuests] = useState(1);
  const [availableTables] = useState(true);
  const [activeStep, setActiveStep] = useState(1);

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(activeStep - 1);
    }
  };

  const [reservationData, setReservationData] = useState({
    name: '', lastname: '', phone: '', email: '', guests: 1, date: '', time: '', notes: ''
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

  const handleSubmitReservation = () => {
    console.log('Reserva enviada:', reservationData);
    alert('¡Reserva confirmada con éxito! Te contactaremos pronto para confirmar los detalles.');
    setActiveStep(1);
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
      {/* NAVBAR */}
      <Navbar isLoggedIn={isLoggedIn} username={username} showDropdown={showDropdown}
      setShowDropdown={setShowDropdown} onLogout={handleLogout} onDropdownItemClick={handleDropdownItemClick} 
      navigate={navigate}/>

       {/* CONTENIDO PRINCIPAL */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 style={{ textAlign: 'center', margin: '2rem', color: '#333' }}>Reserva de mesa</h1>

        {/* INDICADOR DE PASOS */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: activeStep >= 1 ? '#D4AF37' : '#ddd',
                color: activeStep >= 1 ? '#000' : '#666',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>1</div>
              <span style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: activeStep === 1 ? '#D4AF37' : '#666' }}>Carta</span>
            </div>
            
            <div style={{ width: '50px', height: '2px', backgroundColor: activeStep >= 2 ? '#D4AF37' : '#ddd' }}></div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: activeStep >= 3 ? '#D4AF37' : '#ddd', color: activeStep >= 3 ? '#000' : '#666', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
              }}>2</div>
              <span style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: activeStep === 3 ? '#D4AF37' : '#666' }}>Confirmación</span>
            </div>
          </div>
        </div>

        {/* PASO 1: DETALLES DE RESERVA */}
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

        {/* PASO 2: CONFIRMACIÓN */}
        {currentStep === 2 && (
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card">
                <div className="card-header" style={{ backgroundColor: 'var(--gold)', color: 'white' }}>
                  <h5 className="mb-0">Confirmar reserva</h5>
                </div>
                <div className="card-body">
                  {/* RESUMEN DE RESERVA */}
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
      <Footer />
    </>
  );
};

export default Reserva;