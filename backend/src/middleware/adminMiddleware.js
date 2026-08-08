function somenteAdmin(req, res, next) {
  if (!req.usuario) {
    return res.status(401).json({
      message: 'Usuário não autenticado.'
    });
  }

  if (req.usuario.perfil !== 'ADMIN') {
    return res.status(403).json({
      message: 'Acesso permitido somente para administradores.'
    });
  }

  next();
}

module.exports = somenteAdmin;