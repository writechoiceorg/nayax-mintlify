# Nayax Monthly Meeting — Summary
**Date:** 2026-05-21  
**Attendees:** Moshe Orenstein (Nayax), Anayse Sardinha (WriteChoice), Marcos Briceno (WriteChoice)  
**Raw transcript:** `resources/files/nayax_monthly_meeting.md`

---

## Key decisions

### Skills to build for Lynx (Moshe's 4 priorities)
Moshe confirmed the four skills Nayax wants, in order of customer relevance:
1. **Prepaid cards** — card creation, credit management, balance tracking
2. **Refunds** — refund request, approval/decline workflow, documentation upload
3. **Product inventory** — product groups, products, machine mapping, pick lists
4. **Transactional reports** — dashboard widgets, last sales, machine statistics

Rationale: customers typically use only one of these feature sets. Skills should be scoped per workflow, not a single monolithic Lynx skill.

### Deadline — urgent
Moshe wants **1–2 skills published by Wednesday EOD (2026-05-28)**. He is presenting to ~150 Chinese developers at a Nayax Developer Day on Thursday–Friday (2026-05-29/30) in China and wants to demo the skills live.

### Focus: finish Lynx before moving to Spark
Moshe explicitly said: finish Lynx, publish the skills, then look at Spark. Do not split effort.

### Smithery.ai publishing approval
Moshe confirmed he has not yet received internal security approval to publish skills on smithery.ai. He will get that approval. Skills should be built and ready; publishing comes after approval.

---

## Action items

| # | Owner | Task |
|---|-------|------|
| 1 | WriteChoice | Build and publish 1–2 Lynx skills by Wednesday 2026-05-28 |
| 2 | WriteChoice | Fix EMV core external settlement diagram: copy steps 21–26 from Spark external settlement PDF; **remove steps 27 and 28** |
| 3 | WriteChoice | Publish the co-extension guide (Moshe approved, no more waiting) |
| 4 | WriteChoice | Publish EMV core authors pages for Android and Linux |
| 5 | WriteChoice | Do NOT publish Fiscal Cortina yet — wait for Mayan's approval |
| 6 | Marcos | Switch Mintlify workflows from daily to monthly to stop burning credits |
| 7 | Marcos | Check Mintlify token usage to estimate how many assistant questions the remaining credits cover |
| 8 | Moshe | Get internal security approval for publishing on smithery.ai |
| 9 | Moshe | Follow up with Ali (covering for Shahar on vacation) to unblock Lynx sandbox permission issues |

---

## Other topics discussed

**Mintlify credit exhaustion:** The broken-link detection workflow was running daily and consumed the full monthly credit allocation in 6 days. Decision: switch to monthly schedule. Workflows and the AI assistant share the same credit pool. Current allocation is 7,500 credits (custom plan).

**Mintlify AI assistant:** Moshe noted the assistant widget had disappeared — caused by credit exhaustion. Will return at next billing cycle.

**Shahar on vacation:** Ali is covering. Anayse to contact Ali directly to resolve Lynx sandbox permission blockers (encryption, scheduling, refunds, etc.).
