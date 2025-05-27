import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../styles/navbar.css';

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar shadow-md font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-4">
        <div className="flex justify-center h-16">
          <div className="flex items-center gap-4">
            {/* LOGO */}
            <img src="/images/logo.jpg" alt="Logo" style={{ height: '120px', width: 'auto' }}/>
            {/* ENLACES */}
            <Link to="/carta" className="nav-link nav-link-margin">
              Carta
            </Link>
            <Link to="/novedades" className="nav-link">
              Novedades
            </Link>
            {/* BOTONES */}
            <button
              onClick={() => navigate('/inicioSesion')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => navigate('/registro')}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Registrarse
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;