import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getFallbackPosts } from '../src/content/fallbackPosts.js';

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

/**
 * Only checked-in, explicitly published editorial fallback posts are
 * prerendered as HTML entry shells. User posts, unknown slugs, auth, editing,
 * admin and profile routes stay behind the existing SPA fallback.
 * This is NOT publishing permission; it is a locally tested release candidate.
 */
export const PUBLIC_ARTICLE_SHELLS = Object.freeze(Object.fromEntries(
  getFallbackPosts('tr')
    .filter((post) => post.isPublished && post.source === 'local-fallback')
    .map((post) => [post.slug, Object.freeze({ title: post.title, description: post.excerpt })]),
));

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const metadataForRoute = (route, metadata, homepage) => homepage
  .replace(/\s*<link rel="preload" as="image"[^>]+>/, '')
  .replace(/<title>[^<]+<\/title>/, `<title>${escapeHtml(metadata.title)}</title>`)
  .replace(/<meta name="description" content="[^"]+"/, `<meta name="description" content="${escapeHtml(metadata.description)}"`)
  .replace('</head>', `  <link rel="canonical" href="https://postify.zekiakgul.dev/${route}" />\n  </head>`);

export async function exportPublicRouteShells(outputDir) {
  const root = resolve(outputDir);
  const homepage = await readFile(resolve(root, 'index.html'), 'utf8');
  if (!homepage.includes('<div id="root"></div>') ||
      !/<script[^>]+src="\/assets\/index-[^"]+\.js"/.test(homepage) ||
      !/<title>[^<]+<\/title>/.test(homepage) ||
      !/<meta name="description" content="[^"]+"/.test(homepage)) {
    throw new Error('Public route shells require a complete built Vite index.html');
  }

  const routeShells = [
    ...Object.entries(PUBLIC_ROUTE_SHELLS),
    ...Object.entries(PUBLIC_ARTICLE_SHELLS).map(([slug, metadata]) => {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        throw new Error(`Unsafe public article slug: ${slug}`);
      }
      return [`posts/${slug}`, metadata];
    }),
  ];
  for (const [route, metadata] of routeShells) {
    const directory = resolve(root, route);
    await mkdir(directory, { recursive: true });
    await writeFile(resolve(directory, 'index.html'), metadataForRoute(route, metadata, homepage));
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await exportPublicRouteShells('docs');
}
