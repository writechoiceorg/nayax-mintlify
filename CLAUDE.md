# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Nayax Developer Portal** — a documentation site built with [Mintlify](https://mintlify.com). There is no traditional build system, package manager, or test framework. Mintlify reads the repository directly and renders the site automatically on push to `main`.

## Previewing Locally

To preview the docs locally, install the Mintlify CLI globally and run it from the repo root:

```bash
npm install -g mintlify
mintlify dev
```

## Repository Structure

```
nayax-mintlify/
├── docs.json           # Master Mintlify config: navigation, colors, logos, redirects, OpenAPI refs
├── index.mdx           # Homepage
├── style.css           # Custom CSS (dark/light mode overrides)
├── localize-init.js    # Localize.com localization script
├── docs/               # All guide/concept documentation (.mdx files)
│   ├── cortina/        # Cortina prepaid card & QR payment API
│   ├── ecom-sdk/       # E-commerce SDK (Android, iOS, Web, Apple Pay, Google Pay)
│   ├── get-started/    # Platform overview and integration onboarding
│   ├── integrate-pos-device/
│   │   ├── marshall/       # Marshall SDK (C#, Java, C) – primary POS integration
│   │   ├── marshall-pro/   # Marshall Pro for fuel/forecourt environments
│   │   ├── emv-core/       # EMV card payment processing
│   │   ├── spark/          # Spark API-based POS integration
│   │   └── tweezercomm/    # TweezerComm device protocol (Global + Israel variants)
│   └── manage-data-operations/
│       ├── lynx-api/       # Lynx business management API
│       └── amazon-sqs/     # AWS SQS integration with Nayax Core
├── reference/          # Auto-generated API reference pages (sourced from openapi/)
├── openapi/            # OpenAPI 3.0 YAML specs (source of truth for API reference)
│   ├── cortina.yaml
│   ├── ecom.yaml
│   ├── e-receipt.yaml
│   ├── lynx.yaml       # Largest spec (~14k lines)
│   └── spark.yaml
├── snippets/           # Reusable React/JSX components embedded in .mdx pages
│   ├── Header.jsx, IntegratePOS.jsx, ManageData.jsx, AcceptPayments.jsx, etc.
│   └── EndpointCard.jsx, PostmanButton.jsx, TerminalBlock.jsx
└── images/             # All image assets (~43 MB); organized under home/, docs/, reference/
```

## Key Configuration: docs.json

`docs.json` is the central config file. Modifying navigation, adding new pages, changing tabs, or adding redirects all happen here. Key sections:

- **`navigation.tabs`** — defines the top-level tabs (Integrate POS Device, Accept Payments, Manage Data, Get Started) and the nested menu/group/pages hierarchy
- **`navigation.global.anchors`** — persistent sidebar links (changelog, help)
- **`api.playground`** — currently set to `display: none` (API playground disabled)
- **`redirects`** — maps old URLs to new ones; add entries here when renaming/moving pages

When adding a new `.mdx` page, you must also add it to the `navigation` in `docs.json` for it to appear in the sidebar.

## Content Authoring

- All content pages are `.mdx` files — standard Markdown with JSX component support
- Mintlify-specific components (`<Card>`, `<Tabs>`, `<CodeGroup>`, `<Note>`, `<Warning>`, etc.) are available globally without imports
- Custom reusable components live in `snippets/` and are imported at the top of `.mdx` files with relative paths
- Page frontmatter controls title, description, and icon:
  ```yaml
  ---
  title: "Page Title"
  description: "Short description"
  icon: "icon-name"
  ---
  ```

## API Reference

The `reference/` directory is auto-generated from the OpenAPI specs in `openapi/`. To update API reference content, edit the corresponding `.yaml` file in `openapi/`, not the files in `reference/`.

## MCP Integration

A Mintlify MCP server is configured in `.vscode/mcp.json`, enabling Mintlify-aware assistance directly in VS Code.
