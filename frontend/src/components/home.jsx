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
    <section id="home" className="relative w-full h-[400px] overflow-hidden">
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
  );
};

export default Home;

