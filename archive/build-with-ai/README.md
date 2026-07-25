# Archived: Nayax Agent Skills (DevZone)

Moshe asked us to take the **Nayax agent skills** off the DevZone without deleting them, so we
can add them back later. This folder preserves the removed page and documents every edit made
elsewhere, so restoring is copy-paste.

**What was removed:** only the agent skills. The MCP server page and the "Build with AI" tab are
still live. The landing page and the shared promo banner were trimmed to MCP-only wording.

- Removed on branch `remove-agent-skills` (from `main`), 2026-07-14.
- The skill *source* files (`SKILL.md`) live in a separate repo, `writechoiceorg/nayax-ai`, and
  were never in this repo — this only covers the DevZone docs.

---

## Preserved page

- `archive/build-with-ai/agent-skills.mdx` — the full "Use Nayax Agent Skills" page body,
  exactly as it was. Note its frontmatter still has `hidden: true` (added earlier during the
  partial rollback). Remove that line when restoring if you want it visible.

---

## To restore

1. **Move the page back:**
   `git mv archive/build-with-ai/agent-skills.mdx docs/get-started/agent-skills.mdx`
   Then remove `hidden: true` from its frontmatter.
2. **Re-add the nav entry** in `docs.json` (see snippet 1 below).
3. **Remove the redirect** added for the old URL (see snippet 2 below).
4. **Restore the landing page** `docs/get-started/build-with-ai.mdx` (see snippet 3).
5. **Restore the Lynx overview Card** `docs/manage-data-operations/lynx-api/lynx-overview.mdx`
   (see snippet 4).
6. **Restore the promo banner copy** `snippets/McpPromo.jsx` (see snippet 5).

---

## Exact snippets that were removed / changed

### 1. `docs.json` — nav entry (under the "Build with AI" tab)

The `pages` array should read (skills line restored):

```json
"root": "docs/get-started/build-with-ai",
"pages": [
  "docs/get-started/mcp-setup",
  "docs/get-started/agent-skills"
]
```

### 2. `docs.json` — redirect added on removal (delete this on restore)

Added as the first entry in the `redirects` array:

```json
{ "source": "/docs/get-started/agent-skills", "destination": "/docs/get-started/build-with-ai" }
```

### 3. `docs/get-started/build-with-ai.mdx` — original (MCP + skills)

The page was rewritten to MCP-only. Original content:

```mdx
---
title: "Build with AI on Nayax"
description: "Bring AI assistants into your Nayax integration with the MCP server for live documentation access and agent skills for guided API workflows."
---

The Nayax DevZone gives your AI assistant two ways to help you build: the
MCP server and agent skills. Use either on its own, or combine them for the
best results.

## How they compare

Both options make your AI assistant more accurate about Nayax, but they
work differently:

| Tool | What it does | Best when |
|------|--------------|-----------|
| MCP server | Lets your assistant search and read the full developer portal in real time | You want accurate answers about any Nayax API, SDK, or integration flow |
| Agent skills | Packages curated workflow knowledge for one API area, including known pitfalls | You want your agent to write correct integration code for that area |

## Get started

Pick a setup guide to connect your tools:

<CardGroup cols={2}>
  <Card title="Connect to the Nayax MCP Server" icon="robot" href="/docs/get-started/mcp-setup">
    Give your AI assistant live search access to the full developer portal.
  </Card>
  <Card title="Use Nayax Agent Skills" icon="wand-magic-sparkles" href="/docs/get-started/agent-skills">
    Install skills that guide your agent through Nayax API integrations.
  </Card>
</CardGroup>
```

### 4. `docs/manage-data-operations/lynx-api/lynx-overview.mdx` — original block

The `<McpNote />` was left in place; the skills Card and the `<Columns>` wrapper around it were
removed. Original:

```mdx
<Columns cols={2}>
<McpNote />
<Card title="Use Nayax Agent Skills" icon="wand-magic-sparkles" href="/docs/get-started/agent-skills">
  Install Lynx skills for inventory, prepaid cards, refunds, and reports to guide your AI agent through integrations.
</Card>
</Columns>
```

### 5. `snippets/McpPromo.jsx` — original banner copy

The paragraph on (old) line 23 originally read:

```
Connect your AI assistant to Nayax documentation with our MCP server, or install agent skills that guide it through Nayax API integrations.
```
