// ============================================================
// 💞 SERVICE WORKER — "À DEUX"
// Permet d'installer l'application et d'utiliser un cache local
// ============================================================

const CACHE_NAME = "adeux-cache-v1";
const URLS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./favicon.png",
  "./icon192.png",
  "./icon512.png",
  "./logo.png"
];

// 📦 Installation du cache (premier lancement)
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log("💖 Mise en cache initiale...");
        return cache.addAll(URLS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// 🧭 Activation du service worker (nettoyage ancien cache)
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log("🧹 Suppression de l'ancien cache :", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// ⚡ Gestion des requêtes : sert depuis le cache si possible
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retourne la version en cache ou fait la requête
        return response || fetch(event.request);
      })
      .catch(() => caches.match("./index.html")) // fallback
  );
});
