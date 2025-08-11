// IMPORTAR EXPRESS
const express = require('express');
// CREAR INSTANCIA DE EXPRESS
const app = express();
// DEFINIR PUERTO
const PORT = process.env.PORT || 3000;

// CARGAR VARIABLES DESDE '.ENV'
require('dotenv').config();

// MIDDLEWARES
app.use(express.json());

// RUTAS
app.get('/', (req, res) => {
  res.send('Servidor backend funcionando');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
