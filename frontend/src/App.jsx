import { Routes, Route } from 'react-router-dom';

import Navbar from './components/navbar';
import Footer from './components/footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import OrderForm from './pages/OrderForm';
import ReservationForm from './pages/reservationForm';
import Registro from './pages/Registro';
import InicioSesion from './pages/InicioSesion';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/order" element={<OrderForm />} />
          <Route path="/reserve" element={<ReservationForm />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/inicioSesion" element={<InicioSesion />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;