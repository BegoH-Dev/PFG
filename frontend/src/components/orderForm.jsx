import { useState } from 'react';

const OrderForm = () => {
  const [order, setOrder] = useState({ name: '', item: '', address: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Pedido realizado por ${order.name}`);
  };

  return (
    <section id="order" className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Hacer un Pedido</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        <input className="w-full p-2 border rounded" placeholder="Nombre" onChange={e => setOrder({ ...order, name: e.target.value })} required />
        <input className="w-full p-2 border rounded" placeholder="Plato a pedir" onChange={e => setOrder({ ...order, item: e.target.value })} required />
        <input className="w-full p-2 border rounded" placeholder="Dirección de entrega" onChange={e => setOrder({ ...order, address: e.target.value })} required />
        <button className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700">Enviar Pedido</button>
      </form>
    </section>
  );
};

export default OrderForm;
