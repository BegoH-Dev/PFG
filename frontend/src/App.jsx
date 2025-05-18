import { Routes, Route } from 'react-router-dom';

import Navbar from './components/navbar';
import Home from './components/Home';
import Menu from './components/Menu';
import OrderForm from './components/OrderForm';
import ReservationForm from './components/ReservationForm';
import Registro from './components/registro';
import InicioSesion from './components/inicioSesion';

function App() {
  return (
    <>
      <div className="fixed top-0 left-0 w-screen h-screen bg-[#064e3b] -z-10" />

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/order" element={<OrderForm />} />
        <Route path="/reserve" element={<ReservationForm />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/inicioSesion" element={<InicioSesion />} /> {/* sin guion */}
      </Routes>
    </>
  );
}

export default App;
