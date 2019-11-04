/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 */

workbox.core.setCacheNameDetails({prefix: "aol_frontend"});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
workbox.precaching.cleanupOutdatedCaches();


/**
 * Utilize offline analytics capabilities
 *
 */
workbox.googleAnalytics.initialize({});


/**
 * Handle navigation routes for SPA
 *
 */
workbox.routing.registerNavigationRoute(
  // Assuming '/index.html' has been precached,
  // look up its corresponding cache key.
  workbox.precaching.getCacheKeyForURL('/index.html')
);


/**
 * Cache backend API data requests
 *
 * In order to avoid bursting the application cache
 * quota, all media assets are excluded.
 *
 */
workbox.routing.registerRoute(
  ({url, event}) => {
      // futher hacking must be done in order that process
      // environment variables are available within the service
      // worker scope. as a result, the production backend is
      // hardcoded here.
      let isData = url.pathname.endsWith('json') || url.search.endsWith('json');
      return url.host === 'aol-backend.wdt.pdx.edu' && isData;
  },
  new workbox.strategies.CacheFirst({
    cacheName: 'backend-api-requests',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60,
      }),
    ],
  }),
);
