const CACHE_NAME = 'sara-adv-v1';

// Arquivos fundamentais que serão armazenados no dispositivo do usuário
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js',
  'https://unpkg.com/@pdf-lib/fontkit@1.1.1/dist/fontkit.umd.js'
];

// Instalação do Service Worker e armazenamento do esqueleto do app
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Armazenando arquivos estruturais em cache...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativação e limpeza de caches antigos se você atualizar o app no futuro
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estratégia de Cache: Network First (Tenta a internet pelos PDFs/Fontes novos, se falhar ou estiver offline, usa o cache)
self.addEventListener('fetch', (event) => {
  // Ignorar requisições feitas por extensões do navegador ou esquemas não suportados (ex: chrome-extension)
  if (!event.request.url.startsWith(self.location.origin) && !event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Se a resposta for válida, guarda uma cópia atualizada no cache
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Se a internet falhar (tiver offline), busca imediatamente no cache interno
        return caches.match(event.request);
      })
  );
});