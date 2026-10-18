"""Read-only gallery generator checks; run: python3 scripts/qa/test_build_visual_review.py."""
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).with_name('build-visual-review.py')
PNG_HEADER = b'\x89PNG\r\n\x1a\n' + b'\x00\x00\x00\rIHDR' + (390).to_bytes(4, 'big') + (844).to_bytes(4, 'big')


class VisualReviewTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='postify-visual-review-test-')
        self.addCleanup(self.temp.cleanup)
        root = Path(self.temp.name)
        self.report = root / 'report.json'
        self.artifacts = root / 'artifacts'
        self.artifacts.mkdir()
        self.out = root / 'review'
        self.actual_paths = []
        for kind in ('expected', 'actual', 'diff'):
            path = self.artifacts / f'about-mobile-{kind}.png'
            path.write_bytes(PNG_HEADER)
            self.actual_paths.append({'name': path.name, 'path': str(path)})
        self.example = {
            'stats': {'expected': 1, 'unexpected': 1, 'skipped': 0, 'flaky': 0},
            'suites': [{'specs': [
                {'title': 'About mobile baseline', 'tests': [{'status': 'unexpected', 'results': [
                    {'attachments': self.actual_paths},
                ]}]},
                {'title': 'Keyboard interaction', 'tests': [{'status': 'expected', 'results': [{}]}]},
            ]}],
        }
        self.report.write_text(json.dumps(self.example))

    def call(self):
        return subprocess.run([sys.executable, str(SCRIPT), '--report', str(self.report),
            '--artifacts', str(self.artifacts), '--output', str(self.out), '--source', 'test-commit'],
            text=True, capture_output=True)

    def test_valid_single_failure_and_exact_assets(self):
        res = self.call()
        self.assertEqual(res.returncode, 0, res.stderr)
        manifest = json.loads((self.out / 'manifest.json').read_text())
        self.assertEqual(manifest['count'], 1)
        self.assertEqual(manifest['items'][0]['category'], 'About / Contact')
        self.assertEqual(manifest['items'][0]['decision'], 'PENDING_OWNER')
        self.assertEqual(manifest['items'][0]['mode'], 'pixels')
        self.assertIn('No approval recorded', (self.out / 'index.html').read_text())
        for attachment in self.actual_paths:
            self.assertEqual(Path(attachment['path']).read_bytes(), PNG_HEADER)
        self.assertEqual(len(list((self.out / 'images').glob('*.png'))), 3)

    def test_requires_current_evidence_and_never_overwrites_gallery(self):
        self.assertEqual(self.call().returncode, 0)
        (self.out / 'owner-note.txt').write_text('do not overwrite')
        res = self.call()
        self.assertNotEqual(res.returncode, 0)
        self.assertEqual((self.out / 'owner-note.txt').read_text(), 'do not overwrite')

    def test_missing_diff_fails_closed(self):
        self.example['suites'][0]['specs'][0]['tests'][0]['results'][0]['attachments'].pop()
        self.report.write_text(json.dumps(self.example))
        res = self.call()
        self.assertNotEqual(res.returncode, 0)
        self.assertFalse((self.out / 'manifest.json').exists())

    def test_report_failure_count_must_match_cases(self):
        self.example['stats']['unexpected'] = 2
        self.report.write_text(json.dumps(self.example))
        res = self.call()
        self.assertNotEqual(res.returncode, 0)
        self.assertFalse((self.out / 'manifest.json').exists())


if __name__ == '__main__':
    unittest.main()
