// Importa librería para manejar JSON Web Tokens
const jwt = require('jsonwebtoken');
// Obtiene la clave secreta para firmar/verificar tokens desde variables de entorno
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware para verificar si el usuario autenticado tiene rol de administrador
function verificarAdmin(req, res, next) {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ mensaje: 'Acceso restringido a administradores' });
  }
  next();
}

// Middleware para validar JWT en rutas protegidas
function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ mensaje: 'Requiere token' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ mensaje: 'Token inválido o expirado' });
    }
    req.user = user;
    next();
  });
}

// Exporta ambos middlewares para usar en las rutas
module.exports = { verificarAdmin, verificarToken };