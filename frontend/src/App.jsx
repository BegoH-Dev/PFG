import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Carta from './pages/Carta';
import Novedades from './pages/Novedades';
import Pedidos from './pages/Pedidos';
import OrderForm from './pages/OrderForm';
import ReservationForm from './pages/ReservationForm';
import Registro from './pages/Registro';
import InicioSesion from './pages/InicioSesion';

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
          <Route path="/InicioSesion" element={<InicioSesion />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;