import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar shadow-md font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-4">
        <div className="flex justify-center h-16">
          <div className="flex items-center gap-4">
            {/* LOGO */}
            <img src="/images/Logo_Book_Bite.png" alt="Logo" style={{ height: '120px', width: 'auto' }}/>
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
              className="nav-button nav-button-primary"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => navigate('/registro')}
              className="nav-button nav-button-secondary"
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