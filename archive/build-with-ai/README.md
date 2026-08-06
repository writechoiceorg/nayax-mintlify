# Archived: Nayax Agent Skills (DevZone)

Moshe asked us to take the **Nayax agent skills** off the DevZone without deleting them, so we
can add them back later. This folder preserves the removed page and documents every edit made
elsewhere, so restoring is copy-paste.

**What was removed:** only the agent skills. The MCP server page and the "Build with AI" tab are
still live. The landing page and the shared promo banner were trimmed to MCP-only wording.

- Removed on branch `remove-agent-skills` (from `main`), 2026-07-14.
- The Chinese side was missed in that pass and removed on branch
  `fix/emv-core-release-notes-nav`, 2026-08-06. The English nav entry was also resurrected by the
  `Staging (#157)` merge and removed again in the same branch.
- The skill *source* files (`SKILL.md`) live in a separate repo, `writechoiceorg/nayax-ai`, and
  were never in this repo — this only covers the DevZone docs.

---

## Preserved pages

- `archive/build-with-ai/agent-skills.mdx.txt` — the full "Use Nayax Agent Skills" page body,
  exactly as it was. Note its frontmatter still has `hidden: true` (added earlier during the
  partial rollback). Remove that line when restoring if you want it visible.
- `archive/build-with-ai/agent-skills.zh.mdx.txt` — the Chinese translation of the same page.
  `hidden: true` was added on archiving; remove it when restoring.

Both files carry a `.txt` suffix on purpose. While the English one was a plain `.mdx`, Mintlify
kept serving it at `devzone.nayax.com/archive/build-with-ai/agent-skills` (HTTP 200): `hidden: true`
removes a page from the navigation and search, not from routing. The extra extension is what
actually takes it off the site. Keep it until you restore the pages.

---

## To restore

1. **Move the pages back, dropping the `.txt` suffix:**
   `git mv archive/build-with-ai/agent-skills.mdx.txt docs/get-started/agent-skills.mdx`
   `git mv archive/build-with-ai/agent-skills.zh.mdx.txt docs/zh/get-started/agent-skills.mdx`
   Then remove `hidden: true` from both frontmatters.
2. **Re-add the nav entries** in `docs.json`, English and Chinese (see snippet 1 below).
3. **Remove the redirects** added for the old URLs, English and Chinese (see snippet 2 below).
4. **Restore the landing pages** `docs/get-started/build-with-ai.mdx` and
   `docs/zh/get-started/build-with-ai.mdx` (see snippet 3).
5. **Restore the Lynx overview Card** in `docs/manage-data-operations/lynx-api/lynx-overview.mdx`
   and `docs/zh/manage-data-operations/lynx-api/lynx-overview.mdx` (see snippet 4).
6. **Restore the promo banner copy** `snippets/McpPromo.jsx` (see snippet 5).

---

## Exact snippets that were removed / changed

### 1. `docs.json` — nav entry (under the "Build with AI" tab)

Both `pages` arrays should read (skills line restored):

```json
"root": "docs/get-started/build-with-ai",
"pages": [
  "docs/get-started/mcp-setup",
  "docs/get-started/agent-skills"
]
```

```json
"root": "docs/zh/get-started/build-with-ai",
"pages": [
  "docs/zh/get-started/mcp-setup",
  "docs/zh/get-started/agent-skills"
]
```

### 2. `docs.json` — redirects added on removal (delete these on restore)

Added as the first three entries in the `redirects` array:

```json
{ "source": "/docs/get-started/agent-skills", "destination": "/docs/get-started/build-with-ai" },
{ "source": "/docs/zh/get-started/agent-skills", "destination": "/docs/zh/get-started/build-with-ai" },
{ "source": "/archive/build-with-ai/agent-skills", "destination": "/docs/get-started/build-with-ai" }
```

The third one covers the archive URL that was publicly reachable between 2026-07-14 and 2026-08-06.

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

Chinese original of `docs/zh/get-started/build-with-ai.mdx`:

```mdx
---
title: 在 Nayax 上使用 AI 进行构建
description: 通过 MCP server 实现实时文档访问,并借助 agent skills 获得引导式 API 工作流程,将 AI 助手引入您的 Nayax 集成中。
---

Nayax DevZone 为您的 AI 助手提供了两种协助构建的方式:
MCP server 和 agent skills。您可以单独使用其中一种,或
将两者结合以获得最佳效果。

## 两者对比

这两种方式都能提升您的 AI 助手在 Nayax 相关问题上的准确性,但
其工作方式有所不同:

| 工具           | 作用                           | 适用场景                               |
| ------------ | ---------------------------- | ---------------------------------- |
| MCP server   | 让您的助手能够实时搜索和阅读完整的开发者门户       | 您希望获得关于任意 Nayax API、SDK 或集成流程的准确答案 |
| Agent skills | 为某一 API 领域打包精选的工作流程知识,包括已知问题 | 您希望代理为该领域编写正确的集成代码                 |

## 快速开始

选择一份设置指南来连接您的工具:

<CardGroup cols={2}>
  <Card title="连接到 Nayax MCP 服务器" icon="robot" href="/docs/get-started/mcp-setup">
    让您的 AI 助手实时搜索访问完整的开发者门户。
  </Card>

  <Card title="使用 Nayax 代理技能" icon="wand-magic-sparkles" href="/docs/get-started/agent-skills">
    安装 skills,引导您的代理完成 Nayax API 集成。
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

Chinese original in `docs/zh/manage-data-operations/lynx-api/lynx-overview.mdx`:

```mdx
<Columns cols={2}>
  <McpNote />

  <Card title="使用 Nayax 代理技能" icon="wand-magic-sparkles" href="/docs/get-started/agent-skills">
    安装用于库存、预付卡、退款和报告的 Lynx 技能(skills),指导您的 AI 代理完成集成。
  </Card>
</Columns>
```

### 5. `snippets/McpPromo.jsx` — original banner copy

The paragraph on (old) line 23 originally read:

```
Connect your AI assistant to Nayax documentation with our MCP server, or install agent skills that guide it through Nayax API integrations.
```
