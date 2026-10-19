import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { exportPublicRouteShells, PUBLIC_ROUTE_SHELLS } from '../export-public-route-shells.mjs';

const fixture = '<!doctype html><html lang="tr"><head>' +
  '<meta name="description" content="Home page" />' +
  '<title>Postify — Uygulanabilir Bilgi</title>' +
  '</head><body><div id="root"></div>' +
  '<script type="module" src="/assets/index-fixture123.js"></script></body></html>';

test('dedicated public shells share hashed Vite entrypoint and route canonical metadata', async () => {
  const temp = await mkdtemp(join(tmpdir(), 'postify-public-route-'));
  try {
    await mkdir(join(temp, 'assets'));
    await writeFile(join(temp, 'index.html'), fixture);
    await writeFile(join(temp, 'assets', 'index-fixture123.js'), 'console.log(1)');
    await exportPublicRouteShells(temp);
    assert.deepEqual(Object.keys(PUBLIC_ROUTE_SHELLS), ['about', 'contact']);

    for (const route of Object.keys(PUBLIC_ROUTE_SHELLS)) {
      const html = await readFile(join(temp, route, 'index.html'), 'utf8');
      assert.match(html, /<div id="root"><\/div>/);
      assert.match(html, /src="\/assets\/index-fixture123\.js"/);
      assert.match(html, new RegExp('rel="canonical" href="https://postify.zekiakgul.dev/' + route + '"'));
      assert.match(html, /name="description" content="[^"]+"/);
      assert.doesNotMatch(html, /<title>Postify — Uygulanabilir Bilgi<\/title>/);
    }
    await assert.rejects(stat(join(temp, 'login', 'index.html')), { code: 'ENOENT' });
    await assert.rejects(stat(join(temp, 'posts', 'index.html')), { code: 'ENOENT' });
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});

test('rejects incomplete HTML instead of creating broken public route shells', async () => {
  const temp = await mkdtemp(join(tmpdir(), 'postify-invalid-route-'));
  try {
    await writeFile(join(temp, 'index.html'), '<html><head><title>Postify</title></head></html>');
    await assert.rejects(exportPublicRouteShells(temp), /complete built Vite index/);
    await assert.rejects(stat(join(temp, 'about', 'index.html')), { code: 'ENOENT' });
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
