export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: [
    // Ajouter Bootstrap CSS
    'bootstrap/dist/css/bootstrap.min.css',
    // Ajouter Leaflet CSS
    'leaflet/dist/leaflet.css',
  ],
});
