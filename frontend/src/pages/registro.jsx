import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Registro() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialRole = queryParams.get('role') === 'artist' ? 'artist' : 'user';

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    birthday: '',
    firstName: '',
    lastName: '',
    role: initialRole,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role) => {
    setForm({ ...form, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al registrar');
      }

      setSuccess('Usuario registrado con éxito');
      setForm({
        username: '',
        email: '',
        password: '',
        birthday: '',
        firstName: '',
        lastName: '',
        role: 'user',
      });

      setTimeout(() => {
        navigate('/inicioSesion?registered=true');
      }, 1000);
    } catch (err) {
      setError(err.message);
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
          <h2 className="text-xl font-bold mt-4">Registra tu cuenta</h2>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-2 rounded mb-4">{success}</div>}

        {/* Rol */}
        <div className="flex justify-center gap-2 mb-4">
          <button
            type="button"
            className={`px-4 py-2 rounded ${form.role === 'user' ? 'bg-blue-600 text-white' : 'border border-blue-600 text-blue-600'}`}
            onClick={() => handleRoleSelect('user')}
          >
            Usuario
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded ${form.role === 'artist' ? 'bg-blue-600 text-white' : 'border border-blue-600 text-blue-600'}`}
            onClick={() => handleRoleSelect('artist')}
          >
            Artista
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" name="firstName" placeholder="Nombre" required value={form.firstName} onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="text" name="lastName" placeholder="Apellido" required value={form.lastName} onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="text" name="username" placeholder="Nombre de usuario" required value={form.username} onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="email" name="email" placeholder="Email" required value={form.email} onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="date" name="birthday" required value={form.birthday} onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="password" name="password" placeholder="Contraseña" required value={form.password} onChange={handleChange} className="w-full p-2 border rounded" />

          <div className="flex items-center mb-3">
            <input type="checkbox" required className="mr-2" />
            <label className="text-sm text-gray-600">
              Acepto <a href="#" className="text-blue-600">Términos y Condiciones</a>
            </label>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>

        <div className="text-center text-sm mt-4">
          ¿Ya tienes cuenta? <a href="/inicioSesion" className="text-blue-600 font-semibold">Inicia sesión</a>
        </div>
      </div>
    </section>
  );
}