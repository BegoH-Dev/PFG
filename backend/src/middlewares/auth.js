// IMPORTAR LIBRERÍA PARA JSON WEB TOKENS
const jwt = require('jsonwebtoken');
// OBTENER CLAVE SECRETA PARA VERIFICAR TOKENS
const JWT_SECRET = process.env.JWT_SECRET;

// MIDDLEWARE PARA VERIFICAR SI EL USUARIO AUTENTICADO TIENE ROL DE ADMINISTRADOR
function verificarAdmin(req, res, next) {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ mensaje: 'Acceso restringido a administradores' });
  }
  next();
}

// MIDDLEWARE PARA VALIDAR JWT EN RUTAS PROTEGIDAS
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

// EXPORTAR MIDDLEWARES PARA LAS RUTAS
module.exports = { verificarAdmin, verificarToken };
