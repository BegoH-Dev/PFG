import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

import slide1 from '/public/images/pedido.png';
import slide2 from '/public/images/reserva.png';
import slide3 from '/public/images/registro.png';

const slides = [
  {
    title: 'Disfruta de nuestros platos desde casa',
    description: 'La mejor comida, con el sabor de siempre, directo a tu mesa.',
    image: slide1,
    buttonText: 'Haz tu pedido',
    buttonLink: '/pedido',    
  },
  {
    title: 'Ven a conocernos',
    description: 'Disfruta de un ambiente perfecto para cualquier ocasión.',
    image: slide2,
    buttonText: 'Haz tu reserva',
    buttonLink: '/reserva',
  },
  {
    title: 'Únete a la comunidad Biter',
    description: 'Comparte tu pasión por la gastronomía, descubre novedades y sé parte de algo delicioso.',
    image: slide3,
    buttonText: 'Resgístrate ahora',
    buttonLink: '/registro',
  },
];

const Home = () => {
  const navigate = useNavigate();

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
        {/* SECCIÓN DE DIAPOSITIVAS */}
        <div
          className="w-full h-full bg-cover bg-center transition-all duration-700 ease-in-out relative flex items-center justify-center"
          style={{ backgroundImage: `url(${slides[current].image})` }}
        >

        {/* Overlay oscuro */}
        <div className="image-overlay"></div>

        {/* CONTENIDO DE LAS DIAPOSITIVAS */}
          <div className="bg-black bg-opacity-50 p-6 rounded flex flex-col items-center justify-center text-center relative z-20">
            <h2 className="text-3xl font-bold mb-2 slide-text">{slides[current].title}</h2>
            <p className="text-lg slide-text mb-4">{slides[current].description}</p>
            {slides[current].buttonText && (
            <button
              className="btn bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition duration-300"
              onClick={() => navigate(slides[current].buttonLink)}
            >
              {slides[current].buttonText}
            </button>
          )}
          </div>
        </div>

        {/* Botón izquierdo */}
        <button
          className="slider-button slider-button-left"
          onClick={prevSlide}
          aria-label="Anterior"
        >
          <FaChevronLeft size={20} />
        </button>

        {/* Botón derecho */}
        <button
          className="slider-button slider-button-right"
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