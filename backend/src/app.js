const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

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