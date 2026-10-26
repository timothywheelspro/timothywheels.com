"""Regression checks for the mismatch boundary and allowlisted output."""
import importlib.util
import io
import json
import os
from pathlib import Path
import tempfile
import unittest
from contextlib import redirect_stdout, redirect_stderr
from unittest.mock import patch

spec = importlib.util.spec_from_file_location("preflight", Path(__file__).with_name("build-preflight.py"))
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class PreflightTest(unittest.TestCase):
    def run_check(self, version, env, extra=None):
        output = io.StringIO()
        with patch.dict(os.environ, env, clear=True), patch("sys.argv", ["preflight", *(extra or [])]), patch.object(module.subprocess, "check_output", return_value=version), redirect_stdout(output), redirect_stderr(io.StringIO()):
            status = module.main()
        self.assertNotIn("private-test-sentinel", output.getvalue())
        return status, json.loads(output.getvalue())

    def test_preview_and_production(self):
        for branch, expected in [("essay/demo", "preview"), ("main", "production")]:
            status, facts = self.run_check("hugo v0.158.0+extended linux/amd64", {"CF_PAGES": "1", "CF_PAGES_BRANCH": branch, "CF_PAGES_COMMIT_SHA": "a" * 40, "CREDENTIAL": "private-test-sentinel"})
            self.assertEqual(status, 0)
            self.assertEqual(facts["environment"], expected)
            self.assertEqual(facts["branch"], branch)
            self.assertEqual(set(facts), {"intended_hugo", "installed_hugo_extended", "environment", "branch", "commit"})

    def test_wrong_or_non_extended_compiler_stops(self):
        for version in ["hugo v0.155.0+extended linux/amd64", "hugo v0.158.0 linux/amd64"]:
            status, _ = self.run_check(version, {"GITHUB_REF_NAME": "demo", "GITHUB_SHA": "a" * 40})
            self.assertEqual(status, 1)

    def test_detection_log_is_required_to_match_when_supplied(self):
        with tempfile.TemporaryDirectory() as directory:
            log = Path(directory) / "build.log"
            for detected, status in [("0.155.0", 1), ("0.158.0", 0), (None, 1)]:
                log.write_text("private-test-sentinel\n" + ("Detected the following tools from environment: hugo@extended_" + detected if detected else "No installer evidence"))
                actual, _ = self.run_check("hugo v0.158.0+extended linux/amd64", {"GITHUB_REF_NAME": "demo", "GITHUB_SHA": "a" * 40}, ["--cloudflare-log", str(log)])
                self.assertEqual(actual, status)


if __name__ == "__main__":
    unittest.main()
