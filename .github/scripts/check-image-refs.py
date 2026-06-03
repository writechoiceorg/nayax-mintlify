#!/usr/bin/env python3
"""Validate that images referenced in the docs will actually render.

Scans .mdx / .md content for image references and fails (exit 1) on:
  1. A referenced image file that does not exist under the repo.
  2. The malformed `[!](...)` syntax (a transposed `![](...)`).
  3. A Markdown image `![](...)` whose path contains unescaped spaces. Such
     paths exist on disk but never render: CommonMark ends the URL at the
     first space, so no <img> tag is produced. The HTML `<img src="...">`
     form does not have this problem (the browser encodes the spaces), which
     is why some pages with spaced filenames render and others do not.

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


TITLE_SUFFIX = re.compile(r'^(.*?)\s+(".*"|\'.*\'|\(.*\))$')


def markdown_destination_url(destination):
    """Return the URL part of a Markdown image destination.

    Handles angle-bracketed `<...>` destinations and an optional
    `url "title"` / `url 'title'` / `url (title)` suffix.
    """
    dest = destination.strip()
    if dest.startswith("<") and dest.endswith(">"):
        return dest[1:-1].strip()
    match = TITLE_SUFFIX.match(dest)
    return match.group(1).strip() if match else dest


def main():
    problems = []
    for path in content_files():
        with open(path, encoding="utf-8") as handle:
            for lineno, line in enumerate(handle, 1):
                for match in BAD_IMAGE.finditer(line):
                    problems.append((path, lineno, match.group(1),
                                     "malformed image syntax '[!](...)' -- should be '![](...)'"))
                # Markdown images: an unescaped space in the URL breaks rendering.
                for match in MD_IMAGE.finditer(line):
                    dest = match.group(1).strip()
                    if not dest.startswith("<") and " " in markdown_destination_url(dest):
                        problems.append((path, lineno, dest,
                                         "Markdown image path has unescaped spaces -- will not "
                                         "render; use <img src=\"...\" /> or %20-encode the spaces"))
                # File-existence: applies to both Markdown and HTML images.
                for regex in (MD_IMAGE, HTML_IMAGE):
                    for match in regex.finditer(line):
                        ref = (markdown_destination_url(match.group(1))
                               if regex is MD_IMAGE else match.group(1).strip())
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
