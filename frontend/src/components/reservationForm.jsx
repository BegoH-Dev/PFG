import { useState } from 'react';

const ReservationForm = () => {
  const [form, setForm] = useState({ name: '', date: '', people: 1 });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Reserva hecha por ${form.name} para ${form.people} personas`);
  };

  return (
    <section id="reserve" className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Reservar una Mesa</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        <input className="w-full p-2 border rounded" placeholder="Nombre" onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input type="datetime-local" className="w-full p-2 border rounded" onChange={e => setForm({ ...form, date: e.target.value })} required />
        <input type="number" className="w-full p-2 border rounded" min="1" onChange={e => setForm({ ...form, people: e.target.value })} required />
        <button className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700">Reservar</button>
      </form>
    </section>
  );
};

export default ReservationForm;
