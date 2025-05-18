import Navbar from './components/navbar';
import Home from './components/Home';
import Menu from './components/Menu';
import OrderForm from './components/OrderForm';
import ReservationForm from './components/ReservationForm';

function App() {
  return (
    <div>
      <Navbar />
      <Home />
      <Menu />
      <OrderForm />
      <ReservationForm />
    </div>
  );
}

export default App;
