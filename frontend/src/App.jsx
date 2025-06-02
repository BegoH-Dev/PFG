import { Routes, Route } from 'react-router-dom';

// Importación de páginas
import Home from './pages/Home';
import Carta from './pages/Carta';
import Novedades from './pages/Novedades';
import Pedidos from './pages/Pedidos';
import OrderForm from './pages/OrderForm';
import ReservationForm from './pages/ReservationForm';
import Registro from './pages/Registro';
import InicioSesion from './pages/InicioSesion';
import MiPerfil from './pages/MiPerfil';
import Reserva from './pages/Reserva';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/carta" element={<Carta />} />
          <Route path="/novedades" element={<Novedades />} />
          <Route path="/order" element={<OrderForm />} />
          <Route path="/reserve" element={<ReservationForm />} />
          <Route path="/Registro" element={<Registro />} />
          <Route path="/Pedidos" element={<Pedidos />} />
          <Route path="/Reserva" element={<Reserva />} />
          <Route path="/InicioSesion" element={<InicioSesion />} />
          <Route path="/mi-perfil" element={<MiPerfil />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;