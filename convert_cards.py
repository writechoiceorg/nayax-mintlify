#!/usr/bin/env python3
"""
Script to convert HTML card containers to Mintlify card components
Finds <HTMLBlock> sections containing card_container divs and converts them
to Mintlify <CardGroup> with <Card> components
"""

import re
from pathlib import Path
from html.parser import HTMLParser


class CardHTMLParser(HTMLParser):
    """Parse HTML to extract card information"""

    def __init__(self):
        super().__init__()
        self.cards = []
        self.current_card = None
        self.in_h3 = False
        self.in_p = False
        self.in_card = False

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)

        if tag == "a" and attrs_dict.get("class") == "card":
            self.in_card = True
            self.current_card = {
                "href": attrs_dict.get("href", ""),
                "title": "",
                "description": "",
            }
        elif tag == "h3" and self.in_card:
            self.in_h3 = True
        elif tag == "p" and self.in_card:
            self.in_p = True

    def handle_endtag(self, tag):
        if tag == "a" and self.in_card:
            self.in_card = False
            if self.current_card:
                self.cards.append(self.current_card)
                self.current_card = None
        elif tag == "h3":
            self.in_h3 = False
        elif tag == "p":
            self.in_p = False

    def handle_data(self, data):
        if self.in_h3 and self.current_card is not None:
            self.current_card["title"] += data.strip()
        elif self.in_p and self.current_card is not None:
            self.current_card["description"] += data.strip()


def extract_cards_from_html(html_content):
    """Extract card information from HTML content"""
    # Find the card_container div
    card_container_match = re.search(
        r'<div class="card_container">(.*?)</div>', html_content, re.DOTALL
    )

    if not card_container_match:
        return None

    container_html = card_container_match.group(1)

    # Parse the HTML to extract card data
    parser = CardHTMLParser()
    parser.feed(container_html)

    return parser.cards


def convert_htmlblock_to_cards(content):
    """Convert HTMLBlock with card_container to Mintlify CardGroup"""

    # Pattern to match HTMLBlock sections
    htmlblock_pattern = re.compile(r"<HTMLBlock>\{`\n(.*?)\n`\}</HTMLBlock>", re.DOTALL)

    def replace_htmlblock(match):
        html_content = match.group(1)

        # Check if this HTMLBlock contains a card_container
        if 'class="card_container"' not in html_content:
            # Return as-is if no card_container
            return match.group(0)

        # Extract cards from the HTML
        cards = extract_cards_from_html(html_content)

        if not cards:
            # Return as-is if no cards found
            return match.group(0)

        # Count the number of cards to determine cols
        num_cards = len(cards)
        cols = min(num_cards, 3)  # Default to 3 columns max

        # Build the Mintlify CardGroup
        mintlify_cards = f"<CardGroup cols={{{cols}}}>\n"

        for card in cards:
            title = card["title"]
            href = card["href"]
            description = card["description"]

            # Build the Card component
            mintlify_cards += (
                f'  <Card title="{title}" href="{href}" icon="arrow-up-right"'
            )

            if description:
                mintlify_cards += ">\n"
                mintlify_cards += f"    {description}\n"
                mintlify_cards += "  </Card>\n"
            else:
                mintlify_cards += " />\n"

        mintlify_cards += "</CardGroup>"

        return mintlify_cards

    # Replace all HTMLBlocks
    new_content = htmlblock_pattern.sub(replace_htmlblock, content)

    return new_content


def process_mdx_file(file_path):
    """Process a single MDX file and convert HTMLBlocks to CardGroups"""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Check if file contains HTMLBlock with card_container
        if "<HTMLBlock>" not in content or 'class="card_container"' not in content:
            return False, "No card_container HTMLBlocks found"

        # Convert HTMLBlocks to CardGroups
        new_content = convert_htmlblock_to_cards(content)

        # Check if any changes were made
        if new_content == content:
            return False, "No changes made"

        # Write the updated content
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)

        return True, "Successfully converted"

    except Exception as e:
        return False, str(e)


def main():
    """Main function to process all MDX files in docs directory"""
    docs_dir = "docs"

    print(f"Scanning for MDX files in: {docs_dir}/")

    # Find all MDX files
    mdx_files = list(Path(docs_dir).glob("*.mdx"))
    print(f"Found {len(mdx_files)} MDX files")

    # Process each file
    converted_files = []
    skipped_files = []
    failed_files = []

    for file_path in mdx_files:
        print(f"\nProcessing: {file_path.name}")
        success, message = process_mdx_file(file_path)

        if success:
            converted_files.append(file_path.name)
            print(f"  ✓ {message}")
        elif "No card_container" in message:
            skipped_files.append(file_path.name)
            print(f"  - Skipped: {message}")
        else:
            failed_files.append((file_path.name, message))
            print(f"  ✗ Failed: {message}")

    # Summary
    print("\n" + "=" * 60)
    print("Summary:")
    print(f"  Total MDX files: {len(mdx_files)}")
    print(f"  Converted: {len(converted_files)}")
    print(f"  Skipped: {len(skipped_files)}")
    print(f"  Failed: {len(failed_files)}")
    print("=" * 60)

    if converted_files:
        print(f"\nConverted files ({len(converted_files)}):")
        for filename in converted_files:
            print(f"  - {filename}")

    if failed_files:
        print(f"\nFailed files ({len(failed_files)}):")
        for filename, error in failed_files:
            print(f"  - {filename}: {error}")


if __name__ == "__main__":
    main()
