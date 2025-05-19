import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const slides = [
  {
    title: 'Comida deliciosa',
    description: 'Explora nuestros platos caseros preparados con ingredientes frescos.',
    image: 'https://source.unsplash.com/800x400/?food',
  },
  {
    title: 'Ambiente acogedor',
    description: 'Disfruta de un ambiente perfecto para cualquier ocasión.',
    image: 'https://source.unsplash.com/800x400/?restaurant',
  },
  {
    title: 'Pedidos fáciles',
    description: 'Haz tu pedido desde casa con unos pocos clics.',
    image: 'https://source.unsplash.com/800x400/?delivery',
  },
];

const Home = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="pt-4">
      <section id="home" className="relative w-full h-[400px] overflow-hidden mx-auto max-w-6xl">
        {/* Slide */}
        <div
          className="w-full h-full bg-cover bg-center transition-all duration-700 ease-in-out flex items-center justify-center text-white"
          style={{ backgroundImage: `url(${slides[current].image})` }}
        >
          <div className="bg-black bg-opacity-50 p-6 rounded">
            <h2 className="text-3xl font-bold mb-2">{slides[current].title}</h2>
            <p className="text-lg">{slides[current].description}</p>
          </div>
        </div>

        {/* Botón izquierdo */}
        <button
          className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75"
          onClick={prevSlide}
          aria-label="Anterior"
        >
          <FaChevronLeft size={20} />
        </button>

        {/* Botón derecho */}
        <button
          className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75"
          onClick={nextSlide}
          aria-label="Siguiente"
        >
          <FaChevronRight size={20} />
        </button>
      </section>
      
      {/* Added featured content section below the slider */}
      <section className="max-w-6xl mx-auto p-4 mt-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Nuestras Especialidades</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Platos del Día</h3>
            <p className="text-gray-600">Descubre nuestras creaciones especiales preparadas diariamente por nuestros chefs.</p>
            <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Ver Menú</button>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Promociones</h3>
            <p className="text-gray-600">Aprovecha nuestras ofertas especiales y descuentos exclusivos para clientes.</p>
            <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Ver Promociones</button>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Reservaciones</h3>
            <p className="text-gray-600">Reserva una mesa para tu ocasión especial y disfruta de una experiencia única.</p>
            <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Reservar Ahora</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;