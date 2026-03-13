const CACHE_NAME = "coord-check-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Pass-through strategy. Since this is just to trigger the Add-To-Homescreen dialog,
  // we do not aggressively cache JS/CSS which could break the live deployments.
  // The app will function offline natively using Dexie and SolidStart hydration once loaded once.
  event.respondWith(
    fetch(event.request).catch(async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }
    })
  );
});
