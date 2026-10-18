#!/usr/bin/env python3
"""Create a read-only review gallery from Playwright JSON and screenshot artifacts.

Never touches committed screenshot goldens. No approval or update-snapshots mode.
Output contains a manifest and comparative HTML, with copied screenshots under
an explicitly selected temporary output directory.
"""
import argparse
import hashlib
import html
import json
import shutil
import struct
from collections import Counter
from pathlib import Path


def category(title):
    name = title.lower()
    if 'about' in name or 'contact' in name:
        return 'About / Contact'
    if 'article' in name or 'author ' in name:
        return 'Article / Author'
    if 'editor' in name or 'profile' in name or 'authenticated header' in name:
        return 'Editor / Profile'
    if 'admin' in name:
        return 'Admin'
    if 'bookmark' in name:
        return 'Bookmarks'
    if 'knowledge' in name:
        return 'Knowledge'
    if any(term in name for term in ('login', 'register', 'forgot', 'reset', 'callback', 'not-found', 'error recovery')):
        return 'Auth / Error'
    return 'Home / Discovery'


def png_dims(path):
    with path.open('rb') as fh:
        header = fh.read(24)
    if header[:8] != b'\x89PNG\r\n\x1a\n' or header[12:16] != b'IHDR':
        raise ValueError(f'Invalid PNG header: {path}')
    return list(struct.unpack('>II', header[16:24]))


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def locate(path, fallback_index):
    original = Path(path)
    if original.is_file():
        return original
    found = fallback_index.get(original.name, [])
    if len(found) != 1:
        raise FileNotFoundError(f'Expected exactly one artifact for {original.name}, found {len(found)}')
    return found[0]


def all_specs(data):
    for suite in data.get('suites', []):
        for spec in suite.get('specs', []):
            yield spec


def generate(report, artifacts, out, source_sha):
    if out.exists() and any(out.iterdir()):
        raise ValueError(f'Output exists and is not empty: {out}')
    fallback_index = {}
    for file in artifacts.rglob('*.png'):
        fallback_index.setdefault(file.name, []).append(file)
    data = json.loads(report.read_text())
    failures = []
    for spec in all_specs(data):
        for result in spec.get('tests', []):
            if result.get('status') != 'unexpected':
                continue
            run = result.get('results', [{}])[0]
            att = run.get('attachments', [])
            paths = {}
            for kind in ('expected', 'actual', 'diff'):
                item = next((entry.get('path') for entry in att if entry.get('name', '').endswith('-' + kind + '.png')), None)
                if not item:
                    raise ValueError(f'No {kind} comparison for {spec["title"]}; not a screenshot-only failure')
                paths[kind] = locate(item, fallback_index)
            dims = {kind: png_dims(path) for kind, path in paths.items()}
            mode = 'dimensions' if dims['expected'] != dims['actual'] else 'pixels'
            title = spec['title']
            failures.append(dict(
                id=f'VR-{len(failures) + 1:03}', title=title, category=category(title),
                theme='dark' if title.lower().startswith('dark theme') else 'light',
                viewport='mobile' if 'mobile' in title.lower() else 'desktop' if 'desktop' in title.lower() else 'other',
                mode=mode, expected=dims['expected'], actual=dims['actual'],
                deltaHeight=dims['actual'][1] - dims['expected'][1],
                decision='PENDING_OWNER', attachments={}, sha256={},
            ))
            failures[-1]['_source'] = paths
    stats = data.get('stats', {})
    if stats.get('unexpected') != len(failures):
        raise ValueError(f'Stats unexpected mismatch: {stats.get("unexpected")} vs {len(failures)}')
    out.mkdir(parents=True, exist_ok=True)
    for item in failures:
        files = item.pop('_source')
        for kind, path in files.items():
            target = out / 'images' / f'{item["id"]}-{kind}.png'
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(path, target)
            item['attachments'][kind] = f'images/{target.name}'
            item['sha256'][kind] = digest(target)
    manifest = dict(source=source_sha, reportSource=str(report), runStats=stats,
        count=len(failures), geometry=Counter(f['mode'] for f in failures),
        groups=Counter(f['category'] for f in failures), items=failures,
        note='PENDING_OWNER is not approval. This generator does not update test goldens.')
    (out / 'manifest.json').write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + '\n')
    cards = []
    for item in failures:
        title=html.escape(item['title']);g=html.escape(item['category']);mode=item['mode']
        images=''.join(f'<figure><a href="{item["attachments"][kind]}" target="_blank"><img loading="lazy" alt="{kind} view for {title}" src="{item["attachments"][kind]}"></a><figcaption>{kind.upper()}</figcaption></figure>' for kind in ('expected','actual','diff'))
        cards.append(f'<section data-group="{g}" data-mode="{mode}" data-title="{title.lower()}"><h2>{item["id"]} · {title}</h2><p>{g} · {item["theme"]} · {item["viewport"]} · {mode} · expected {item["expected"][0]}×{item["expected"][1]} / actual {item["actual"][0]}×{item["actual"][1]} · ΔH {item["deltaHeight"]:+}px · <strong>OWNER APPROVAL PENDING</strong></p><div class="triptych">{images}</div></section>')
    options=''.join(f'<option>{html.escape(name)}</option>' for name in sorted(manifest['groups']))
    index=f'''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Postify visual owner review · {source_sha}</title>
<style>:root{{font:15px/1.5 system-ui;color-scheme:dark;background:#161719;color:#f5f3ec}}body{{max-width:1420px;margin:0 auto;padding:22px}}h1{{font-size:1.8rem}}header{{position:sticky;top:0;background:#161719ef;z-index:4;padding:10px 0;border-bottom:1px solid #555}}input,select{{background:#292b2d;color:inherit;border:1px solid #696969;padding:9px;margin:4px;max-width:100%}}section{{border:1px solid #414348;padding:18px;margin:25px 0;background:#212325;border-radius:8px}}section h2{{margin:0;font-size:1.25rem}}section p{{color:#d8d0bd}}strong{{color:#fbbd7d}}.triptych{{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:13px}}figure{{min-width:0;margin:0;background:#34383c;padding:5px}}figure img{{display:block;width:100%;max-height:390px;object-fit:contain;object-position:top center}}figcaption{{font-size:.8rem;text-align:center;letter-spacing:.1em;padding:4px}}@media(max-width:650px){{.triptych{{grid-template-columns:1fr}}}}</style>
<header><h1>Postify · owner visual review</h1><p>Source {html.escape(source_sha)} · {stats.get('expected',0)} pass / {stats.get('unexpected',0)} screenshot differences · No snapshots changed · <strong>No approval recorded</strong></p><label>Search <input id="q" placeholder="route, screen, theme" autocomplete="off"></label><label>Area <select id="g"><option value="">All screens</option>{options}</select></label><label>Diff <select id="m"><option value="">All</option><option value="dimensions">Dimensions</option><option value="pixels">Pixels</option></select></label> <span id="n"></span></header>
<main>{''.join(cards)}</main>
<script>const cards=[...document.querySelectorAll('main>section')],q=document.querySelector('#q'),g=document.querySelector('#g'),m=document.querySelector('#m'),n=document.querySelector('#n');function filter(){{let count=0;cards.forEach(c=>{{let show=c.dataset.title.includes(q.value.toLowerCase())&&(!g.value||c.dataset.group===g.value)&&(!m.value||c.dataset.mode===m.value);c.hidden=!show;if(show)count++}});n.textContent=count+' scenarios';}}q.oninput=filter;g.onchange=filter;m.onchange=filter;filter();</script></html>'''
    (out / 'index.html').write_text(index)
    print(json.dumps({k: v for k, v in manifest.items() if k not in ('items',)}, ensure_ascii=False, default=dict))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--report', type=Path, required=True)
    parser.add_argument('--artifacts', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--source', required=True)
    arguments = parser.parse_args()
    generate(arguments.report, arguments.artifacts, arguments.output, arguments.source)
