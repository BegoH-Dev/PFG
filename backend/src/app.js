// Importa el framework Express para crear el servidor web
const express = require('express');
// Crea una instancia de la aplicación Express
const app = express();
// Define el puerto del servidor
const PORT = process.env.PORT || 3000;

// Carga las variables de entorno desde el archivo .env
require('dotenv').config();

/* MIDDLEWARES */
app.use(express.json());

/* RUTAS */
app.get('/', (req, res) => {
  res.send('Servidor backend funcionando');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});