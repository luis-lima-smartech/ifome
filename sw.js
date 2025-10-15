const CACHE_NAME = 'ai-fome-cache-v1';
// --- INÍCIO DA ÁREA DE REVISÃO ---
// Revise a lista de arquivos abaixo para garantir que todos os caminhos e nomes
// correspondem exatamente aos arquivos do seu projeto.
const FILES_TO_CACHE = [
  './',
  'index.html',
  'tracker.html',
  'admin.html',
  'manifest.json',
  'background.png',
  'logo.png',
  // --- Ícones do App (você precisa criar estes arquivos) ---
  'images/icon-192.png',
  'images/icon-512.png',
  // --- Imagens dos Hambúrgueres ---
  'images/aifome 01.jpeg',
  'images/aifome 02.jpeg',
  'images/aifome 03.jpeg',
  'images/aifome 04.jpeg',
  'images/aifome 05.jpeg',
  'images/aifome 06.jpeg',
  'images/aifome 08.jpeg',
  'images/aifome 09.jpeg',
  'images/aifome 10.jpeg',
  'images/aifome 11.jpeg',
  'images/aifome 12.jpeg',
  'images/aifome 13.jpeg',
  'images/aifome 14.jpeg',
  // --- Imagens das Bebidas ---
  'images/beb-01.png',
  'images/beb-02.png',
  'images/beb-03.png',
  'images/beb-04.png',
  'images/beb-05.png',
  // --- Imagens das Porções ---
  'images/por-01.jpeg',
  'images/por-02.jpeg',
  'images/ane.ceb.png',
  'images/car.fri.jpeg',
  'images/cal.fri.png',
  // --- Imagens das Promoções ---
  'images/promo04.png',
  'images/promo06.png',
  'images/promo07.png',
  'images/promo08.png'
];
// --- FIM DA ÁREA DE REVISÃO ---

// Instala o Service Worker e armazena os arquivos em cache
self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pré-cache de arquivos offline');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativa o Service Worker e limpa caches antigos
self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removendo cache antigo', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// Intercepta as requisições e serve os arquivos do cache quando offline
self.addEventListener('fetch', (evt) => {
  // Apenas para navegação, serve o index.html do cache se estiver offline
  if (evt.request.mode === 'navigate') {
    evt.respondWith(
      fetch(evt.request).catch(() => {
        return caches.open(CACHE_NAME).then((cache) => {
          return cache.match('index.html');
        });
      })
    );
  } else {
    // Para todos os outros pedidos (imagens, css, etc.), serve do cache primeiro
    evt.respondWith(
      caches.match(evt.request).then((response) => {
        return response || fetch(evt.request);
      })
    );
  }
});

