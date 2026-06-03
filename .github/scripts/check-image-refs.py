#!/usr/bin/env python3
"""Validate that every image referenced in the docs resolves to a real file.

Scans .mdx / .md content for image references and fails (exit 1) if any
referenced image file does not exist under the repo, or if the malformed
`[!](...)` syntax (a transposed `![](...)`) is found.

Mintlify serves files in the repo-root `images/` directory at the `/images/`
URL path, so an absolute reference like `/images/docs/foo/bar.png` maps to the
file `images/docs/foo/bar.png`.

Internal *page* links are intentionally not checked here; `mint broken-links`
handles those using Mintlify's own resolver (which understands OpenAPI-
generated reference pages).
"""

import os
import re
import sys
from urllib.parse import unquote

# Directories and root-level files that contain page content.
CONTENT_DIRS = ["docs", "reference", "snippets"]
ROOT_FILES = ["changelog.mdx", "help.mdx", "index.mdx"]

MD_IMAGE = re.compile(r"!\[[^\]]*\]\(\s*([^)]+?)\s*\)")        # ![alt](path)
BAD_IMAGE = re.compile(r"\[!\]\(\s*([^)]+?)\s*\)")             # [!](path)  <- transposed
HTML_IMAGE = re.compile(r"<img\b[^>]*?\ssrc\s*=\s*[\"']([^\"']+)[\"']", re.I)
IMAGE_EXT = re.compile(r"\.(png|jpe?g|gif|svg|webp|avif)$", re.I)


def content_files():
    for root in CONTENT_DIRS:
        for dirpath, _, filenames in os.walk(root):
            for name in filenames:
                if name.endswith((".mdx", ".md")):
                    yield os.path.join(dirpath, name)
    for name in ROOT_FILES:
        if os.path.isfile(name):
            yield name


def is_external(path):
    return path.startswith(("http://", "https://", "//", "data:", "mailto:"))


def resolve(path, source_file):
    path = unquote(path.split("#")[0].split("?")[0])
    if path.startswith("/"):
        return path.lstrip("/")               # repo-root relative (Mintlify /images -> images/)
    return os.path.normpath(os.path.join(os.path.dirname(source_file), path))


def main():
    problems = []
    for path in content_files():
        with open(path, encoding="utf-8") as handle:
            for lineno, line in enumerate(handle, 1):
                for match in BAD_IMAGE.finditer(line):
                    problems.append((path, lineno, match.group(1),
                                     "malformed image syntax '[!](...)' -- should be '![](...)'"))
                for regex in (MD_IMAGE, HTML_IMAGE):
                    for match in regex.finditer(line):
                        ref = match.group(1).strip()
                        if is_external(ref) or not IMAGE_EXT.search(ref):
                            continue
                        if not os.path.isfile(resolve(ref, path)):
                            problems.append((path, lineno, ref, "image file not found"))

    if problems:
        print(f"Found {len(problems)} broken image reference(s):\n")
        for path, lineno, ref, reason in sorted(problems):
            location = f"{path}:{lineno}".replace("\\", "/")
            print(f"  {location}")
            print(f"    ref:    {ref}")
            print(f"    reason: {reason}\n")
        return 1

    print("OK: all image references resolve to existing files.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
