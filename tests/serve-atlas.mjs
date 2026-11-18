import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';

const mime = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.geojson': 'application/geo+json',
  '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.ico':'image/x-icon',
  '.gz': 'application/gzip', '.bin': 'application/octet-stream',
};

// Both the source and built entries can be tested without a separate HTTP service.
export async function serveAtlas(rootUrl, failOnce = new Set()) {
  const server = createServer(async (request, response) => {
    const url = new URL(request.url, 'http://localhost');
    const pathname = url.pathname;
    if (failOnce.delete(pathname)) {
      response.writeHead(503,{'Cache-Control':'no-store'}).end();
      return;
    }
    const type = mime[path.extname(pathname)];
    if (!type || !(pathname === '/favicon.ico' || /^\/index(?:-local)?\.html$/.test(pathname) || /^\/(?:atlas|assets)\/(?:[\w-]+\/)*[\w.-]+$/.test(pathname))) {
      response.writeHead(404).end();
      return;
    }
    try {
      const content = await readFile(new URL('.' + pathname, rootUrl));
      const headers = { 'Content-Type': type, 'Cache-Control':'no-store' };
      if (url.searchParams.has('offline-test')) headers['Content-Security-Policy'] = "img-src 'self' data:; connect-src 'self'";
      response.writeHead(200, headers);
      response.end(content);
    } catch {
      response.writeHead(404).end();
    }
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  return server;
}
