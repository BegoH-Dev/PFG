import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function InicioSesion() {
  const location = useLocation();
  const navigate = useNavigate();
  const wasRegistered = new URLSearchParams(location.search).get('registered') === 'true';
  
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Implementar llamada al API de login
      console.log('Iniciando sesión con:', form);
      
      // Simulando redirección tras login exitoso
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('/images/fondo3cuadros.png')" }}></div>
      
      <div className="relative z-10 w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <a href="/">
            <img src="/images/logo-light.png" alt="logo" className="mx-auto w-24" />
          </a>
          <h2 className="text-xl font-bold mt-4">Iniciar Sesión</h2>
        </div>
        
        {wasRegistered && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-4">
            Usuario registrado correctamente. Por favor inicia sesión.
          </div>
        )}
        
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            required 
            value={form.email} 
            onChange={handleChange} 
            className="w-full p-2 border rounded" 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Contraseña" 
            required 
            value={form.password} 
            onChange={handleChange} 
            className="w-full p-2 border rounded" 
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <label className="text-sm text-gray-600">Recordarme</label>
            </div>
            <a href="#" className="text-sm text-blue-600">¿Olvidaste tu contraseña?</a>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        
        <div className="text-center text-sm mt-4">
          ¿No tienes cuenta? <a href="/registro" className="text-blue-600 font-semibold">Regístrate</a>
        </div>
      </div>
    </section>
  );
}
