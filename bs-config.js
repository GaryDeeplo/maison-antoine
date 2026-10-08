// Config lite-server (browser-sync).
// HTML : jamais mis en cache (no-store) -> on ne revoit plus d'anciennes versions.
// Assets (images, css, js, polices) : mis en cache mais revalidés (no-cache) ->
//   le navigateur renvoie un 304 minuscule et réutilise le fichier en cache
//   (chargement quasi instantané en re-visite, sans risque de version périmée).
module.exports = {
  server: {
    baseDir: './dist',
    middleware: [
      function cacheHeaders(req, res, next) {
        var path = req.url.split('?')[0];
        var isHTML = path === '/' || path.endsWith('/') || path.endsWith('.html');
        if (isHTML) {
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
        } else {
          res.setHeader('Cache-Control', 'no-cache'); // cache + revalidation (304)
        }
        next();
      }
    ]
  }
};
