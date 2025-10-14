#!/usr/bin/env python3
"""
Script to generate MDX files from sitemap.xml
Reads each URL from sitemap.xml, fetches markdown content by adding .md to URL,
and creates corresponding MDX files
"""

import xml.etree.ElementTree as ET
import os
from pathlib import Path
import requests
import time
import re
from urllib.parse import urlparse


def parse_sitemap(sitemap_path):
    """Parse sitemap.xml and extract all URLs"""
    # Read the file and skip any preamble text
    with open(sitemap_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the start of actual XML content
    xml_start = content.find("<urlset")
    if xml_start != -1:
        content = content[xml_start:]

    # Parse the cleaned XML content
    root = ET.fromstring(content)

    # Define the namespace
    namespace = {"ns": "http://www.sitemaps.org/schemas/sitemap/0.9"}

    # Extract all loc elements
    urls = []
    for url in root.findall("ns:url/ns:loc", namespace):
        urls.append(url.text)

    return urls


def extract_slug(url):
    """Extract the slug from the URL
    Example: https://developerhub.nayax.com/docs/cortina-auth -> cortina-auth
    """
    # Remove the base URL and extract the slug
    if "/docs/" in url:
        slug = url.split("/docs/")[-1]
        return slug
    return None


def fetch_markdown_content(url):
    """Fetch markdown content by adding .md to the URL"""
    md_url = f"{url}.md"

    try:
        response = requests.get(md_url, timeout=10)
        response.raise_for_status()
        return response.text, None
    except requests.exceptions.RequestException as e:
        return None, str(e)


def extract_h1_and_content(markdown_content):
    """Extract H1 header from markdown content and return title and remaining content"""
    lines = markdown_content.split("\n")
    title = None
    content_start_idx = 0

    # Look for the first H1 header (# Header)
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith("# ") and not stripped.startswith("## "):
            # Extract the title (remove the leading '# ')
            title = stripped[2:].strip()
            # Mark this line for removal
            content_start_idx = i + 1
            break

    # If H1 found, remove it from content
    if title:
        remaining_content = "\n".join(lines[content_start_idx:]).lstrip("\n")
        return title, remaining_content

    # No H1 found, return None and original content
    return None, markdown_content


def convert_callouts(markdown_content):
    """Convert blockquote callouts with emojis to MDX callout components"""

    # Mapping of emojis to callout types
    emoji_to_callout = {
        "🚧": "Warning",
        "📘": "Note",
        "⚠️": "Warning",
        "💡": "Tip",
        "❗": "Note",
        "✅": "Check",
        "❌": "Danger",
        "📝": "Note",
        "🔔": "Info",
        "ℹ️": "Info",
    }

    lines = markdown_content.split("\n")
    result_lines = []
    i = 0

    while i < len(lines):
        line = lines[i]

        # Check if this line starts a blockquote callout
        if line.strip().startswith(">"):
            # Look for emoji in the first line
            first_line_content = line.strip()[1:].strip()  # Remove '>' and whitespace

            # Check if first character is an emoji
            emoji = None
            callout_type = None
            title = None

            for potential_emoji, callout in emoji_to_callout.items():
                if first_line_content.startswith(potential_emoji):
                    emoji = potential_emoji
                    callout_type = callout
                    # Extract title (remove emoji and whitespace)
                    title = first_line_content[len(emoji) :].strip()
                    break

            # If we found an emoji callout, collect the entire blockquote
            if emoji and callout_type:
                callout_content_lines = []

                # Skip the first line (emoji + title) and empty line if present
                i += 1

                # Skip empty blockquote line if present (> followed by nothing)
                if i < len(lines) and lines[i].strip() in [">", "> "]:
                    i += 1

                # Collect the rest of the blockquote content
                while i < len(lines) and lines[i].strip().startswith(">"):
                    content = (
                        lines[i].strip()[1:].strip()
                    )  # Remove '>' and leading whitespace
                    callout_content_lines.append(content)
                    i += 1

                # Build the MDX callout component
                callout_content = "\n".join(callout_content_lines)

                mdx_callout = f"<{callout_type}>\n"
                if title:
                    mdx_callout += f"**{title}**\n\n"
                mdx_callout += f"{callout_content}\n"
                mdx_callout += f"</{callout_type}>"

                result_lines.append(mdx_callout)
                continue

        # Not a callout blockquote, add line as-is
        result_lines.append(line)
        i += 1

    return "\n".join(result_lines)


def download_image(url, output_path):
    """Download an image from a URL and save it to the specified path"""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()

        # Create parent directory if it doesn't exist
        os.makedirs(os.path.dirname(output_path), exist_ok=True)

        # Write the image content
        with open(output_path, "wb") as f:
            f.write(response.content)

        return True, None
    except requests.exceptions.RequestException as e:
        return False, str(e)


def process_images(markdown_content, slug, base_output_dir="images/docs"):
    """Find images in markdown, download them, and update their paths"""

    # Pattern to match markdown images: ![alt text](url)
    image_pattern = re.compile(r"!\[([^\]]*)\]\(([^)]+)\)")

    # Find all images in the content
    matches = list(image_pattern.finditer(markdown_content))

    if not matches:
        return markdown_content, []

    # Create the image directory for this slug
    slug_image_dir = os.path.join(base_output_dir, slug)

    # Track downloaded images
    downloaded_images = []
    image_counter = 1

    # Process each image
    new_content = markdown_content
    for match in matches:
        alt_text = match.group(1)
        original_url = match.group(2)

        # Skip if it's already a local path
        if not original_url.startswith("http"):
            continue

        # Determine file extension from URL
        parsed_url = urlparse(original_url)
        path_parts = parsed_url.path.split(".")
        if len(path_parts) > 1:
            extension = path_parts[-1].lower()
            # Handle common image extensions
            if extension not in ["png", "jpg", "jpeg", "gif", "svg", "webp"]:
                extension = "png"  # Default to png if unknown
        else:
            extension = "png"

        # Create new filename
        new_filename = f"images{image_counter}.{extension}"
        image_counter += 1

        # Create full path for saving
        local_image_path = os.path.join(slug_image_dir, new_filename)

        # Download the image
        success, error = download_image(original_url, local_image_path)

        if success:
            # Create the new markdown path (relative to docs/)
            new_image_url = f"/images/docs/{slug}/{new_filename}"

            # Create the new markdown with Frame wrapper
            old_markdown = match.group(0)
            new_markdown = f"<Frame>![{alt_text}]({new_image_url})</Frame>"

            # Replace in content
            new_content = new_content.replace(old_markdown, new_markdown)

            downloaded_images.append(
                {
                    "original_url": original_url,
                    "local_path": local_image_path,
                    "new_url": new_image_url,
                    "alt_text": alt_text,
                    "success": True,
                }
            )
        else:
            downloaded_images.append(
                {"original_url": original_url, "error": error, "success": False}
            )

    return new_content, downloaded_images


def create_mdx_file(slug, url, output_dir="docs"):
    """Create an MDX file for the given slug by fetching content from URL"""
    # Create output directory if it doesn't exist
    Path(output_dir).mkdir(parents=True, exist_ok=True)

    # Create the file path
    file_path = os.path.join(output_dir, f"{slug}.mdx")

    # Fetch markdown content
    content, error = fetch_markdown_content(url)

    if content:
        # Extract H1 header and convert to frontmatter
        title, remaining_content = extract_h1_and_content(content)

        # Convert blockquote callouts to MDX callouts
        remaining_content = convert_callouts(remaining_content)

        # Process images: download and update paths
        remaining_content, downloaded_images = process_images(remaining_content, slug)

        # Build the MDX content with frontmatter
        if title:
            mdx_content = f"""---
title: "{title}"
---

{remaining_content}"""
        else:
            # No H1 found, use slug as title and keep original content
            mdx_content = f"""---
title: "{slug.replace('-', ' ').title()}"
---

{content}"""

        # Write the processed content
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(mdx_content)
        return file_path, True, None, downloaded_images
    else:
        # Create a placeholder file if fetch failed
        mdx_content = f"""---
title: "{slug.replace('-', ' ').title()}"
---

# {slug.replace('-', ' ').title()}

Error fetching content: {error}
"""
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(mdx_content)
        return file_path, False, error, []


def main():
    """Main function to process sitemap and generate MDX files"""
    sitemap_path = "sitemap.xml"
    output_dir = "docs"

    print(f"Reading sitemap from: {sitemap_path}")

    # Parse sitemap
    urls = parse_sitemap(sitemap_path)
    print(f"Found {len(urls)} URLs in sitemap")

    # Process each URL
    created_files = []
    skipped_urls = []
    failed_fetches = []
    total_images_downloaded = 0
    failed_image_downloads = 0

    for i, url in enumerate(urls, 1):
        slug = extract_slug(url)
        if slug:
            print(f"[{i}/{len(urls)}] Processing: {slug}")
            file_path, success, error, downloaded_images = create_mdx_file(
                slug, url, output_dir
            )
            created_files.append(file_path)

            if success:
                print(f"  ✓ Fetched and created: {file_path}")
                # Track image downloads
                if downloaded_images:
                    successful_downloads = sum(
                        1 for img in downloaded_images if img.get("success")
                    )
                    failed_downloads = len(downloaded_images) - successful_downloads
                    total_images_downloaded += successful_downloads
                    failed_image_downloads += failed_downloads
                    print(f"    Downloaded {successful_downloads} image(s)")
                    if failed_downloads > 0:
                        print(f"    Failed to download {failed_downloads} image(s)")
            else:
                failed_fetches.append((slug, error))
                print(f"  ✗ Failed to fetch content: {error}")

            # Add a small delay to avoid overwhelming the server
            time.sleep(0.1)
        else:
            skipped_urls.append(url)
            print(f"Skipped (no valid slug): {url}")

    # Summary
    print("\n" + "=" * 60)
    print("Summary:")
    print(f"  Total URLs processed: {len(urls)}")
    print(f"  MDX files created: {len(created_files)}")
    print(f"  Successfully fetched: {len(created_files) - len(failed_fetches)}")
    print(f"  Failed to fetch: {len(failed_fetches)}")
    print(f"  URLs skipped: {len(skipped_urls)}")
    print(f"  Images downloaded: {total_images_downloaded}")
    if failed_image_downloads > 0:
        print(f"  Failed image downloads: {failed_image_downloads}")
    print("=" * 60)

    if failed_fetches:
        print("\nFailed fetches:")
        for slug, error in failed_fetches[:10]:  # Show first 10
            print(f"  - {slug}: {error}")
        if len(failed_fetches) > 10:
            print(f"  ... and {len(failed_fetches) - 10} more")

    if created_files:
        print(f"\nAll MDX files created in: {output_dir}/")


if __name__ == "__main__":
    main()
