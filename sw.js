self.addEventListener('install', e => {
    console.log('Service worker installed');
});

self.addEventListener('fetch', e => {
    console.log('Fetching:', e.request.url);
});