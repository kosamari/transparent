var CACHE_NAME = 'transparent_v1'
var PORT = location.port ? ':' + location.port : ''
var ROOT_URL = location.protocol + '//' + location.hostname + PORT
var FILES = [
  ROOT_URL + '/',
  ROOT_URL + '/worker.js',
]
var FILE_HASH_TABLE = {}
FILES.forEach(function (filepath) { FILE_HASH_TABLE[filepath] = true })

self.addEventListener('fetch', function (e) {
  if (!FILE_HASH_TABLE[e.request.url]) {
    return
  }
  e.respondWith(
    caches.match(e.request, {cacheName: CACHE_NAME})
  )
})

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return Promise.all(FILES.map(function (url) {
        return fetch(new Request(url)).then(function (response) {
          if (response.ok) {
            return cache.put(response.url, response)
          }
          return Promise.reject(
              'Invalid response.  URL:' + response.url +' Status: ' + response.status
            )
        })
      }))
    })
  )
})

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      var promises = []
      keys.forEach(function (cacheName) {
        if (cacheName !== CACHE_NAME) {
          promises.push(caches.delete(cacheName))
        }
      })
      return Promise.all(promises)
    })
  )
})
