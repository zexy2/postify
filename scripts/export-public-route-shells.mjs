import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * GitHub Pages serves /route/index.html with HTTP 200, rather than
 * falling through its 404.html SPA redirect. Only approved public routes
 * receive entrypoints; unknown/private routes retain the existing fallback.
 */
export const PUBLIC_ROUTE_SHELLS = Object.freeze({
  about: {
    title: 'Hakkımızda — Postify',
    description: 'Postify hakkında: uygulanabilir bilgi, yayın ilkelerimiz ve şeffaflık.',
  },
  contact: {
    title: 'İletişim — Postify',
    description: 'Postify ile iletişime geçin: yayın ve geri bildirim kanalları.',
  },
});

export async function exportPublicRouteShells(outputDir) {
  const root = resolve(outputDir);
  const homepage = await readFile(resolve(root, 'index.html'), 'utf8');
  if (!homepage.includes('<div id="root"></div>') ||
      !/<script[^>]+src="\/assets\/index-[^"]+\.js"/.test(homepage) ||
      !/<title>[^<]+<\/title>/.test(homepage) ||
      !/<meta name="description" content="[^"]+"/.test(homepage)) {
    throw new Error('Public route shells require a complete built Vite index.html');
  }

  for (const [route, metadata] of Object.entries(PUBLIC_ROUTE_SHELLS)) {
    const html = homepage
      // The homepage cover preload is not relevant on About/Contact routes.
      .replace(/\s*<link rel="preload" as="image"[^>]+>/, '')
      .replace(/<title>[^<]+<\/title>/, '<title>' + metadata.title + '</title>')
      .replace(/<meta name="description" content="[^"]+"/, '<meta name="description" content="' + metadata.description + '"')
      .replace('</head>', '  <link rel="canonical" href="https://postify.zekiakgul.dev/' + route + '" />\n  </head>');
    const directory = resolve(root, route);
    await mkdir(directory, { recursive: true });
    await writeFile(resolve(directory, 'index.html'), html);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await exportPublicRouteShells('docs');
}
