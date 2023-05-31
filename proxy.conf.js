const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:7047` :
  env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:7047';

const PROXY_CONFIG = [
  {
    context: [
      "/weatherforecast",
      "/api/rol",
      "/api/usuario",
      "/api/categoria",
      "/api/producto",
      "/api/venta",
      "/api/dashboard",
   ],
    target: target,
    secure: false
  }
]

module.exports = PROXY_CONFIG;
