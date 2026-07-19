import { createReadStream } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const port = Number(process.env.PORT || 8765);
const mime = {
  '.css': 'text/css; charset=utf-8',
  '.data': 'application/octet-stream',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.wasm': 'application/wasm',
};

createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  const relative = pathname.endsWith('/') ? `${pathname}index.html` : pathname;
  const safePath = normalize(relative).replace(/^(\.\.[/\\])+/, '');
  const file = join(root, safePath);

  response.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  response.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  response.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com",
  );
  response.setHeader('Content-Type', mime[extname(file)] || 'application/octet-stream');

  const stream = createReadStream(file);
  stream.on('error', () => {
    response.statusCode = 404;
    response.end('Not found');
  });
  stream.pipe(response);
}).listen(port, () => {
  console.log(`Xiangqi dev server: http://127.0.0.1:${port}/minigames/xiangqi/`);
});
