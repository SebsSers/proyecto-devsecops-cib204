
const { expressjwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const config = require('./config');

// [FIX VULN-4] Verificación segura de JWT mediante JWKS de Keycloak.
// CWE-347 / CWE-287

const verificarJWT = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${config.KEYCLOAK_URL}/realms/${config.KEYCLOAK_REALM}/protocol/openid-connect/certs`
  }),
  issuer: `${config.KEYCLOAK_URL}/realms/${config.KEYCLOAK_REALM}`,
  algorithms: ['RS256']
});

function requiereAuth(req, res, next) {
  // Permite desactivar autenticación únicamente en configuración de laboratorio.
  if (!config.AUTH_ENABLED) {
    return next();
  }

  verificarJWT(req, res, (err) => {
    if (err) {
      return res.status(401).json({
        error: 'No autorizado'
      });
    }

    // express-jwt almacena el payload validado en req.auth.
    req.usuario = req.auth;

    return next();
  });
}

module.exports = { requiereAuth };
