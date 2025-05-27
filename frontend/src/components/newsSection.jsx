function NewsSection() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            <span className="block">Novedades</span>
            <span className="block text-red-600">Lo último en nuestro restaurante</span>
          </h2>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* News Card 1 */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <img 
              src="https://via.placeholder.com/400x250" 
              alt="Novedad 1" 
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900">Nuevo Menú de Temporada</h3>
              <p className="mt-2 text-gray-600">Descubre nuestros platos estacionales elaborados con ingredientes locales frescos.</p>
            </div>
          </div>

          {/* News Card 2 */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <img 
              src="https://via.placeholder.com/400x250" 
              alt="Novedad 2" 
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900">Catering para Eventos</h3>
              <p className="mt-2 text-gray-600">Servicio de catering personalizado para bodas, cumpleaños y eventos corporativos.</p>
            </div>
          </div>

          {/* News Card 3 */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <img 
              src="https://via.placeholder.com/400x250" 
              alt="Novedad 3" 
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900">Horario Extendido</h3>
              <p className="mt-2 text-gray-600">Ahora estamos abiertos hasta las 11 PM los viernes y sábados.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NewsSection;