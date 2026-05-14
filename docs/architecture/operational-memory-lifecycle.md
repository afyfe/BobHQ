# AskBob Operational Memory Lifecycle

## Purpose

Operational memory is how AskBob keeps track of useful business context over time. It is not a hidden store of everything Bob has seen. It is a controlled, inspectable record of operational facts, relationships, decisions, corrections and history.

Bob must remember operational history, not just current state. A useful answer often depends on what was believed first, what changed, who corrected it and what was finally resolved.

Example:

- Initial blocker: ABC Ltd install looked delayed because the install board was incomplete.
- Later correction: approved mailbox and finance notes showed the missing PO was the blocker.
- Final resolution: once the PO is supplied and finance releases the account, Bob should remember both the resolution and the path that led there.

## Principles

- **Modular**: memory entries should separate facts, relationships, events, corrections and metadata.
- **Opinionated**: Bob should prefer sourced, approved and current memory over inferred or stale memory.
- **Role-based**: approval and correction rights should match operational ownership.
- **Simple**: memory should explain what matters, not store every observed detail.
- **Explainable**: every memory entry should show provenance, confidence and state.

AskBob follows NAIB: no vague memory claims, no hidden conclusions, no pretending certainty. Memory should make operations clearer.

## Memory Types

### Operational Facts

Specific facts from approved sources.

Example: `operations/install-board.csv` says ABC Ltd install `INS-2401` is blocked.

### Relationships

Links between operational records, sources or events.

Example: `ABC Limited` may relate to `ABC Ltd` because both CRM records share town, account manager and renewal date.

### Historical Events

Important things that happened over time.

Example: Finance applied a hold to ABC Ltd until a PO reference was supplied.

### User Corrections

Human changes to Bob's understanding.

Example: A finance user confirms the install was blocked by a missing PO, not stock availability.

### Workflow Observations

Patterns about how work is actually moving.

Example: owner fields are often blank on the install board, causing unclear install responsibility.

### Source Metadata

Information about a source rather than its full content.

Example: `sharepoint/onboarding-process.md` was last reviewed on 2025-09-18 and is marked stale.

### Inferred Knowledge

Suggested conclusions that are not yet confirmed.

Example: `pricing-sheet-USE-THIS-ONE.xlsx` may be the current pricing sheet, but file names alone are not enough.

### Human-approved Knowledge

Facts, relationships or corrections a person has reviewed and approved.

Example: Operations confirms Ravi Singh owns the ABC Ltd install once finance releases the hold.

## Memory Lifecycle Stages

### Discovered

Bob has found a source, record, relationship or candidate memory.

Example: Bob discovers `crm/customers.csv` contains both `ABC Ltd` and `ABC Limited`.

### Indexed

Bob has recorded approved metadata or content within the agreed boundary.

Example: Bob indexes customer names, towns and renewal dates from an approved CRM export.

### Inferred

Bob has suggested a relationship or conclusion.

Example: Bob infers that `ABC Limited` may be a duplicate of `ABC Ltd`.

### Used In Answer

Bob has used the memory entry in a user-facing answer.

This should be recorded so people can inspect which memory influenced an answer.

### Human Confirmed

A person confirms the memory entry.

Example: Finance confirms invoice `INV-9104` is blocked because the PO is missing.

### Corrected

A person or stronger approved source changes the memory entry.

Example: Bob initially links an install delay to stock shortage, then the mailbox thread corrects the blocker to missing PO.

### Superseded

A newer memory entry replaces an older one.

Example: `pricing-sheet-FINAL.xlsx` is superseded by a human-approved current pricing sheet.

### Stale

The memory may no longer reflect current operations.

Example: `sharepoint/onboarding-process.md` is stale because it says finance checks happen after install scheduling, while current notes say finance holds must be cleared first.

### Archived

The memory is retained for operational history but should not be used as current state.

Example: an old invoice dispute is archived after resolution, but kept to explain why a renewal was delayed.

### Removed

The memory is deleted or excluded due to policy, correction, expiry, privacy boundary or human decision.

Removed memory should not be used in answers.

## Confidence Evolution

Confidence should move as evidence changes.

Example path:

| Stage | Memory | Confidence |
| --- | --- | --- |
| Discovered | ABC Ltd has a blocked install row | Needs review |
| Indexed | Install row shows `No PO; finance hold` | Likely |
| Confirmed | Mailbox and finance notes support missing PO | Confirmed |
| Human Confirmed | Finance confirms the PO is still missing | Human approved |
| Superseded | PO arrives and finance releases the account | Superseded as current blocker |

Bob should not hide uncertainty during this evolution. A user should be able to see when an answer changed and why.

## Corrections And Superseding

Corrections are preferred over concealment. If Bob was wrong or incomplete, the old entry should be corrected, superseded or removed with a reason.

A correction should record:

- old memory entry
- corrected memory entry
- source or person responsible for the correction
- date of correction
- affected answers or workflows where practical
- whether the old memory is archived, superseded or removed

Example:

- Old memory: ABC Ltd install delayed due to stock shortage.
- Correction: ABC Ltd install blocked due to missing PO.
- Supporting sources: `mailbox/po-request-thread.md`, `finance/invoice-disputes.md`, `operations/install-board.csv`.
- Result: old memory becomes `Superseded`; corrected memory becomes `Human Confirmed` if reviewed by finance.

## Staleness

Memory becomes stale when it may no longer represent current operations.

Staleness signals:

- old source review date
- unresolved issue with no recent update
- newer conflicting source
- human correction not yet applied
- ownership change
- workflow change
- file replaced by a newer approved file

Stale memory can still be useful as history, but Bob should not present it as current fact.

## Expiry And Retention

Not all memory should last forever.

Retention should depend on:

- business purpose
- source approval
- sensitivity
- operational value
- legal or contractual requirements
- whether the entry is current state or historical context

Suggested retention behaviours:

- current operational facts stay while the source remains approved and current
- resolved issues can move to archived history
- rejected inferences should be kept only long enough to avoid repeating the same mistake
- sensitive or unnecessary memory should be removed
- stale memory should require review before use

## Human Approval

Human approval decides which memory becomes trusted.

Approval may apply to:

- source metadata
- source content
- inferred relationships
- corrections
- conflict resolution
- final operational conclusions

Example:

Bob can discover duplicate customer records, but a human should approve whether they are duplicates before Bob treats them as one customer.

## Relationship Retention

Relationships should have their own lifecycle. A relationship is not permanently true just because it was once useful.

Relationship memory should record:

- linked entities
- why Bob linked them
- source evidence
- confidence
- approval state
- last reviewed date
- whether the relationship is current, stale, superseded or rejected

Example:

`ABC Ltd` and invoice `INV-9104` are linked while the missing PO dispute is active. After the dispute is resolved, the relationship may remain as operational history but should not imply the account is still blocked.

## Operational History

Bob must remember operational history, not just current state.

Operational history helps answer questions such as:

- Why was this install delayed?
- Who changed the owner?
- Which pricing sheet was used at the time?
- Why did finance hold the account?
- What changed after the customer complained?

History should show a sequence:

1. what was known at the time
2. what Bob inferred
3. what a person confirmed or corrected
4. what changed later
5. what the current state is now

## Auditability

Operational memory must be inspectable.

For a memory entry, Bob should be able to show:

- source provenance
- lifecycle state
- confidence
- approval state
- creation date
- last updated date
- correction history
- whether it has been used in an answer
- expiry or review date where applicable

This keeps memory useful for operations and review, not mysterious.

## Privacy Boundaries

Operational memory should respect privacy and source boundaries.

Boundaries:

- do not retain more than the approved purpose needs
- do not store unapproved source content
- do not infer sensitive personal attributes
- do not expose memory to users without the right role
- do not retain rejected or removed memory in user-facing answers
- do not treat demo data as production data

## Example BLLB LTD Scenarios

### Missing PO

Sources:

- `operations/install-board.csv`
- `mailbox/po-request-thread.md`
- `finance/invoice-disputes.md`

Lifecycle:

1. Discovered: Bob finds ABC Ltd in the install board.
2. Indexed: Bob records approved install metadata.
3. Inferred: Bob links the blocked install to the missing PO thread.
4. Used In Answer: Bob explains why ABC Ltd has not been installed.
5. Human Confirmed: finance confirms the PO is still missing.
6. Superseded: once the PO arrives, missing PO stops being the current blocker.
7. Archived: the missing PO remains as history explaining the delay.

### Duplicate Customer Record

Source:

- `crm/customers.csv`

Lifecycle:

1. Discovered: Bob finds `ABC Ltd` and `ABC Limited`.
2. Inferred: Bob suggests they may be duplicates.
3. Used In Answer: Bob warns that CRM cleanup may be needed before install proceeds.
4. Human Confirmed or Rejected: a user decides whether the records match.
5. Corrected: Bob updates memory based on the human decision.

### Outdated Pricing Sheet

Sources:

- `sharepoint/pricing-sheet-FINAL.xlsx`
- `sharepoint/pricing-sheet-FINAL-v2.xlsx`
- `sharepoint/pricing-sheet-USE-THIS-ONE.xlsx`

Lifecycle:

1. Discovered: Bob finds conflicting pricing sheets.
2. Inferred: Bob suggests one file may be current based on naming or metadata.
3. Needs review: Bob avoids treating any file as current without approval.
4. Human Confirmed: sales or finance approves the current sheet.
5. Superseded: older pricing sheets remain as history but are no longer current.

### Engineer Reassignment

Sources:

- `operations/install-board.csv`
- `operations/engineer-notes.md`
- `operations/service-issues.csv`

Lifecycle:

1. Discovered: Bob finds Silver Birch Nursery Ltd has ownership confusion.
2. Inferred: Bob links service issue `ISS-502` to unclear ownership notes.
3. Used In Answer: Bob says ownership is disputed between sales and operations.
4. Human Confirmed: a manager confirms the owner.
5. Corrected: Bob records the confirmed owner and keeps the old confusion as history.

### Invoice Dispute Resolution

Sources:

- `finance/invoice-disputes.md`
- `crm/customers.csv`
- referenced mailbox thread if approved

Lifecycle:

1. Discovered: Bob finds Pembroke Print Services Ltd has an unresolved dispute.
2. Inferred: Bob links the dispute to a possible pricing exception.
3. Used In Answer: Bob says renewal should wait for sales and finance review.
4. Human Confirmed: finance confirms the correct monthly rate.
5. Superseded: the disputed amount is replaced by the resolved amount.
6. Archived: Bob keeps the dispute history to explain renewal timing.

## Non-goals

Operational memory is not:

- permanent memory of everything
- hidden memory
- unverifiable memory
- pretending certainty
- a raw copy of connected systems
- a replacement for source systems
- a way around human approval
- a store of unapproved sensitive information

Bob's memory is useful when it is sourced, inspectable, correctable and bounded.
