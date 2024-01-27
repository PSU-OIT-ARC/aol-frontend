import {setCacheNameDetails} from 'workbox-core';
import {precacheAndRoute,cleanupOutdatedCaches,createHandlerBoundToURL} from 'workbox-precaching';
import {registerRoute,NavigationRoute} from 'workbox-routing';
import {initialize as initializeGoogleAnalytics} from 'workbox-google-analytics';
import {CacheFirst} from 'workbox-strategies';
import {CacheableResponsePlugin} from 'workbox-cacheable-response';
import {ExpirationPlugin} from 'workbox-expiration';


/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 */

setCacheNameDetails({prefix: "aol_frontend"});

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
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();


/**
 * Utilize offline analytics capabilities
 *
 */
initializeGoogleAnalytics({});


/**
 * Handle navigation routes for SPA
 *
 */
const handler = createHandlerBoundToURL('/index.html');
const navigationRoute = new NavigationRoute(handler);
registerRoute(navigationRoute);


/**
 * Cache backend API data requests
 *
 * In order to avoid bursting the application cache
 * quota, all media assets are excluded.
 *
 */
registerRoute(
  /* ({url, event}) => { */
  ({url}) => {
      // futher hacking must be done in order that process
      // environment variables are available within the service
      // worker scope. as a result, the production backend is
      // hardcoded here.
      let isData = url.pathname.endsWith('json') || url.search.endsWith('json');
      return url.host === 'aol-backend.cloud.wdt.pdx.edu' && isData;
  },
  new CacheFirst({
    cacheName: 'backend-api-requests',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60,
      }),
    ],
  }),
);
