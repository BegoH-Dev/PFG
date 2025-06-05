import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Navbar from './components/Navbar';

import Home from './pages/Home';
import Carta from './pages/Carta';
import Novedades from './pages/Novedades';
import Pedidos from './pages/Pedidos';
import Registro from './pages/Registro';
import InicioSesion from './pages/InicioSesion';
import MiPerfil from './pages/MiPerfil';
import Reservas from './pages/Reservas';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
    const storedUsername = localStorage.getItem('username');

    setIsLoggedIn(loginStatus);
    setUsername(storedUsername || '');
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar
        isLoggedIn={isLoggedIn}
        username={username}
        setIsLoggedIn={setIsLoggedIn}
        setUsername={setUsername}
      />      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/carta" element={<Carta />} />
          <Route path="/novedades" element={<Novedades />} />
          <Route path="/Registro" element={<Registro />} />
          <Route path="/Pedidos" element={<Pedidos />} />
          <Route path="/Reservas" element={<Reservas />} />
          <Route
            path="/InicioSesion"
            element={
              <InicioSesion
                onLogin={(user) => {
                  setIsLoggedIn(true);
                  setUsername(user.nombre_usuario);
                }}
              />
            }
          />          
          <Route path="/mi-perfil" element={<MiPerfil />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;