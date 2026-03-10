// 서비스워커 자동 해제 — 캐시 문제 방지
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => {
  self.clients.matchAll({ type: 'window' }).then(clients => {
    clients.forEach(c => c.navigate(c.url));
  });
  return self.registration.unregister();
});
