# AskBob Query And Answer Lifecycle

## Purpose

The Query and Answer Lifecycle describes how AskBob receives an operational question, gathers relevant evidence, evaluates confidence, and produces an answer that people can inspect.

The goal is not to make Bob sound certain. The goal is to help a person understand what the business currently knows, what is still uncertain, and what should happen next.

## Principles

- **Modular**: query handling, source retrieval, relationship checks, confidence scoring and memory updates are separate concerns.
- **Opinionated**: Bob should prefer approved sources, visible provenance and conservative language.
- **Role-based**: answers should respect the user's role and the source approval boundary.
- **Simple**: answer only the operational question asked, with the minimum evidence needed to support it.
- **Explainable**: every important answer should show facts, assumptions, confidence, provenance and unresolved uncertainty.

AskBob follows NAIB: no vague claims, no unsourced certainty and no theatrical decision-making. A useful answer is one a busy operations team can check.

## Query Lifecycle Stages

### 1. Query Received

Bob receives a user's question.

Example:

> Why hasn't ABC Ltd been installed?

The query is recorded with timestamp, user context and permitted source boundary.

### 2. Intent Identified

Bob identifies the operational intent of the question.

Example intents:

- install blocker
- customer duplicate
- pricing conflict
- invoice dispute
- owner lookup
- renewal process question

Intent identification should stay practical. Bob is not trying to infer a grand strategy; it is deciding which operational sources are relevant.

### 3. Sources Retrieved

Bob retrieves candidate sources that are approved for the user's role and the question purpose.

For an install blocker question, sources may include:

- `operations/install-board.csv`
- `crm/install-status.csv`
- `crm/customers.csv`
- `mailbox/po-request-thread.md`
- `finance/aged-debtors.csv`
- `finance/invoice-disputes.md`

Unapproved sources can be mentioned as discovered but should not be used as evidence.

### 4. Relationships Evaluated

Bob checks whether records from different sources refer to the same customer, issue, invoice, install or workflow.

Example:

- `ABC Ltd` in the install board appears to match `ABC Ltd` in CRM.
- `ABC Limited` may be a duplicate CRM record, but this remains uncertain.
- Invoice `INV-9104` appears related to the missing PO because finance notes and the mailbox thread mention the same blocker.

Relationships should be labelled with confidence and shown to the user when they materially affect the answer.

### 5. Evidence Compared

Bob compares evidence across sources.

Comparison asks:

- Do the sources agree?
- Which source is approved for this type of fact?
- Which source is newer?
- Is there a conflict?
- Is there a missing approval or missing field?
- Does the evidence support the answer or only suggest it?

### 6. Confidence Assigned

Bob assigns confidence to the answer and to important claims inside the answer.

Example labels:

- **Confirmed**: supported by approved source or human confirmation.
- **Likely**: supported by multiple signals, but not fully confirmed.
- **Inferred**: suggested by relationships or patterns.
- **Needs review**: unresolved, conflicting or incomplete.
- **Stale**: based on older source material.

Bob must never present inferred knowledge as fact.

### 7. Answer Generated

Bob generates a calm operational answer.

Bob answers should contain:

- facts
- assumptions
- confidence
- provenance
- unresolved uncertainty

The answer should avoid filler, speculation and public-launch style language. It should help a person decide what to check next.

### 8. Provenance Attached

Bob attaches the source trail.

Provenance should include:

- source system
- file, record or thread reference
- observed value
- confidence
- approval state where useful

If provenance cannot be shown, the claim should not be presented as trusted.

### 9. Suggested Actions Produced

Bob suggests practical next steps when the evidence supports them.

Examples:

- chase the missing PO number
- review duplicate CRM record
- confirm install owner
- approve the current pricing sheet
- ask finance to resolve invoice dispute

Suggested actions should remain suggestions. They do not replace human judgement.

### 10. Audit Event Recorded

Bob records an audit event for the answer.

The event should capture:

- question asked
- sources used
- important relationships evaluated
- confidence assigned
- answer summary
- suggested actions
- memory entries created or updated
- user correction if one was made

### 11. Memory Updated

Bob updates operational memory only within approved boundaries.

Memory updates may include:

- a confirmed fact
- a rejected inference
- a corrected blocker
- a relationship that needs review
- a resolved issue moved to operational history

Memory should preserve history where useful, not just overwrite the current state.

## Source Retrieval

Source retrieval should start from approved sources and the user's permitted boundary.

Retrieval inputs:

- query intent
- customer or issue names
- known aliases or possible duplicates
- approved source classifications
- operational memory
- source freshness
- user role

Retrieval outputs:

- candidate evidence
- source gaps
- conflict signals
- unapproved but discovered sources that may need review

Bob should not search every connected source by default. It should retrieve the sources that are relevant, approved and explainable for the question.

## Relationship Analysis

Relationship analysis connects records that may describe the same operational issue.

Relationship checks can use:

- exact customer name
- known duplicate names
- invoice numbers
- install IDs
- dates
- towns or postcodes
- owner names
- mailbox subjects
- shared notes

Relationship outputs should state why the link was made.

Example:

> Bob linked ABC Ltd to invoice INV-9104 because `finance/aged-debtors.csv` lists ABC Ltd with that invoice and `mailbox/po-request-thread.md` says the rejected invoice needs a PO.

## Confidence Evaluation

Confidence is assigned at claim level and answer level.

Claim-level confidence:

- "The install board says ABC Ltd is blocked" can be confirmed if the install board source is approved.
- "The PO is the current blocker" may be likely if no later finance update has been reviewed.
- "ABC Limited is the same customer" should remain needs review until confirmed.

Answer-level confidence should reflect the weakest important unresolved point. If the answer depends on an unconfirmed duplicate record, Bob should say so.

## Provenance Generation

Provenance should be visible, short and useful.

For each important claim, Bob should show:

- source name
- source type
- relevant record or thread
- confidence
- why the source matters

Example provenance cards:

- CRM: `customers.csv` - ABC Ltd active customer, possible duplicate ABC Limited.
- Operations: `install-board.csv` - install `INS-2401` blocked.
- Mailbox: `po-request-thread.md` - finance requested PO before release.
- Finance: `aged-debtors.csv` - invoice `INV-9104` on hold.

## Human Approval Interactions

Human approval is needed when an answer would otherwise rely on uncertain or sensitive information.

Approval interactions include:

- approve source for this answer type
- confirm duplicate record
- mark a source as stale
- confirm the current pricing sheet
- reject a relationship
- correct the answer

Bob should make the requested approval specific. "Approve all data" is too broad for Discovery Mode.

## Suggested Actions

Suggested actions should be concrete and tied to evidence.

Good suggested actions:

- Review duplicate customer record.
- Chase PO number.
- Confirm install owner.
- Update CRM notes.
- Mark old pricing sheet as superseded.

Poor suggested actions:

- broadly optimise operations
- automate customer follow-up without review
- make a finance decision without approval

## Corrections

Users must be able to correct Bob.

Correction flow:

1. User challenges or edits an answer.
2. Bob records the correction and source if provided.
3. Bob updates the relevant confidence or knowledge state.
4. Bob marks older memory as corrected, rejected or superseded.
5. Future answers use the corrected memory within the approved boundary.

Corrections should be visible in audit history. Concealing a correction makes future trust weaker.

## Audit Trail

The audit trail answers:

> Why did Bob answer that way?

For important answers, record:

- question
- user or role
- timestamp
- sources retrieved
- sources used
- sources ignored and why where useful
- relationships evaluated
- confidence level
- final answer
- suggested actions
- memory updates
- corrections

The audit trail should be inspectable without needing to understand implementation internals.

## Operational Memory Updates

Answers can update operational memory, but only when allowed.

Examples:

- "ABC Ltd install blocked by missing PO" becomes confirmed memory after finance approval.
- "ABC Limited may duplicate ABC Ltd" remains inferred memory until reviewed.
- "Pricing sheet FINAL was current" becomes superseded after finance approves `pricing-sheet-USE-THIS-ONE.xlsx`.
- "Silver Birch owner unclear" becomes corrected after a manager confirms ownership.

Memory updates should keep operational history. If an invoice dispute is resolved, Bob should remember that it was disputed and later resolved.

## Privacy And Security Boundaries

Query answering must respect the same boundaries as discovery and memory.

Boundaries:

- only use approved sources for the user's role
- do not reveal unapproved source content
- do not expose sensitive finance details to users without permission
- do not use discovered-but-unapproved sources as evidence
- do not create memory from private or restricted data without approval
- do not infer personal or sensitive attributes
- do not keep removed memory in user-facing answers

## Why Bob Thinks This

Every important answer should remain inspectable.

"Why Bob thinks this" should show:

- the facts Bob used
- the assumptions Bob made
- the source trail
- the confidence labels
- unresolved uncertainty
- what would change the answer

Example:

> Bob thinks ABC Ltd is blocked by a missing PO because the install board says `No PO; finance hold`, the finance aged-debtors export lists invoice `INV-9104` as on hold, and the mailbox thread says the invoice cannot be released until ABC Ltd supplies a PO. The conclusion is likely until finance confirms there has been no later update.

## Example BLLB LTD Workflows

### Install Blocker

Question:

> Why hasn't ABC Ltd been installed?

Lifecycle:

1. Query Received: user asks about ABC Ltd.
2. Intent Identified: install blocker.
3. Sources Retrieved: install board, CRM install status, mailbox PO thread, finance aged debtors, invoice disputes.
4. Relationships Evaluated: ABC Ltd install links to invoice `INV-9104` and PO thread.
5. Evidence Compared: operations, finance and mailbox all point to missing PO.
6. Confidence Assigned: missing PO blocker is likely or confirmed depending on finance approval.
7. Answer Generated: Bob explains the blocker and notes duplicate CRM uncertainty.
8. Provenance Attached: source cards show operations, mailbox, finance and CRM.
9. Suggested Actions Produced: chase PO, confirm install owner, review duplicate customer.
10. Audit Event Recorded: answer and sources are logged.
11. Memory Updated: missing PO blocker is recorded or updated within approval boundary.

### Duplicate Customer

Question:

> Is ABC Limited the same customer as ABC Ltd?

Answer shape:

- Fact: both records exist in `crm/customers.csv`.
- Fact: both share Leeds, Maya Patel and the same renewal date.
- Assumption: they may be duplicates.
- Confidence: needs review.
- Unresolved uncertainty: no human has confirmed merge or separation.
- Suggested action: review CRM records before proceeding.

### Pricing Conflict

Question:

> Which pricing sheet is current?

Answer shape:

- Fact: three pricing files have conflicting names.
- Assumption: `pricing-sheet-USE-THIS-ONE.xlsx` may be current.
- Confidence: needs review until approved.
- Provenance: SharePoint pricing file names and metadata.
- Suggested action: sales or finance should approve the current pricing sheet and mark older files as superseded.

### Invoice Dispute

Question:

> Why was the invoice rejected?

Answer shape:

- Fact: finance notes show invoice `INV-9104` for ABC Ltd is unresolved.
- Fact: the PO reference is missing.
- Fact: aged debtors shows the invoice is on hold.
- Confidence: confirmed if finance sources are approved.
- Unresolved uncertainty: whether a later Sage update has cleared the hold.
- Suggested action: confirm PO status before resending invoice.

### Engineer Ownership Confusion

Question:

> Who owns the Silver Birch Nursery install?

Answer shape:

- Fact: install board shows Steve as owner.
- Fact: engineer notes say Steve says it was not assigned formally.
- Fact: service issue says ownership is disputed between sales and operations.
- Confidence: needs review.
- Suggested action: manager confirms owner, then Bob records the correction.

## Non-goals

The Query and Answer Lifecycle is not designed for:

- fabricated certainty
- unsourced answers
- hidden reasoning
- autonomous operational decisions
- broad data access without approval
- replacing staff judgement
- hiding conflicts to make an answer look cleaner
- turning every answer into permanent memory

Bob is useful when an answer can be checked, corrected and trusted by the people responsible for the work.
