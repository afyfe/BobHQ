# AskBob V1 Vision

## Purpose

AskBob V1 is designed to help SMEs rediscover operational knowledge across fragmented systems.

The first version should make messy operational context visible, explainable and useful. It should help people answer practical questions like why an install is blocked, which source is current, who owns an issue, or why finance is holding an invoice.

V1 should be small enough to trust.

## What AskBob Is

AskBob is an operational assistant for businesses whose knowledge is spread across CRM exports, finance tools, SharePoint folders, shared mailboxes, spreadsheets and process notes.

Bob helps by:

- discovering operational sources
- showing where information came from
- separating facts from assumptions
- explaining confidence
- preserving human approval
- remembering operational history
- suggesting practical next actions

AskBob is not trying to be impressive. It is trying to be useful.

## What AskBob Is Not

AskBob is not:

- a generic AI chatbot
- a replacement for operational staff
- a system that makes hidden business decisions
- a tool that ingests everything automatically
- a product that hides uncertainty
- a way to bypass approval, ownership or source boundaries
- a public-launch growth experiment

Bob should be calm, inspectable and bounded.

## The Operational Problem

SMEs often run on a mixture of systems and habits:

- CRM contains customer names, but not the latest context.
- Finance knows why an invoice is blocked, but the install board does not.
- SharePoint contains several versions of the same pricing sheet.
- Mailbox threads contain decisions that never made it into CRM.
- Process documents are stale.
- Ownership is often known by people rather than systems.

This creates operational drag. People spend time asking around, checking files, reconciling records and rebuilding context from memory.

AskBob V1 should reduce that drag by reconnecting fragmented operational knowledge.

## Discovery Mode

Discovery Mode is the first product motion.

Bob discovers before indexing. A connector or source being visible does not mean Bob is approved to learn from it.

Discovery Mode should:

- start with one controlled source where possible
- identify candidate sources
- classify what each source appears to contain
- show freshness, ownership and likely usefulness
- flag conflicts and duplicates
- ask for human approval before using source content

The first value of Discovery Mode is not automation. It is helping a business understand what operational knowledge it already has.

## Operational Memory

Operational memory is Bob's controlled record of useful operational context over time.

It should contain:

- operational facts
- inferred relationships
- historical events
- user corrections
- workflow observations
- source metadata
- human-approved knowledge

Operational memory must remember history, not just current state.

Example:

- initial state: ABC Ltd install is blocked
- later explanation: missing PO is the likely blocker
- human confirmation: finance confirms the PO is still missing
- final resolution: PO arrives and finance releases the account

Bob should preserve the path, not just the final answer.

## Provenance And Trust

Provenance is mandatory.

Every important answer should show:

- source system
- file, record or thread
- observed value
- confidence
- approval state where useful
- whether the claim is fact, inference or human-approved conclusion

Trust should be earned through source visibility, correction history and careful language. Bob must never present inferred knowledge as fact.

## Human Approval

Humans remain in control of what Bob learns from and what Bob treats as trusted.

Human approval should apply to:

- source use
- source boundaries
- inferred relationships
- conflict resolution
- corrections
- operational memory entries

Approval should be specific. "Use everything" is not a V1 pattern.

## Why Bob Thinks This

"Why Bob thinks this" is the inspectability standard for AskBob.

For important answers, Bob should show:

- facts used
- assumptions made
- confidence labels
- source trail
- unresolved uncertainty
- correction history
- suggested next checks

If Bob cannot explain why it thinks something, the answer should not be treated as trusted.

## Example BLLB LTD Workflows

### Install Blocker Investigation

Question:

> Why hasn't ABC Ltd been installed?

Bob uses approved sources such as:

- `operations/install-board.csv`
- `crm/install-status.csv`
- `mailbox/po-request-thread.md`
- `finance/aged-debtors.csv`
- `finance/invoice-disputes.md`

Bob explains that the install appears blocked because the PO number has not been supplied. It also notes that duplicate CRM records may need review.

### Duplicate Customer Detection

Bob finds both `ABC Ltd` and `ABC Limited` in CRM.

Bob can say the records may be duplicates because they share town, account manager and renewal date. Bob should not say they are definitely the same customer until a person confirms it.

### Invoice Dispute Tracing

Bob traces a rejected or disputed invoice across finance notes, debtor exports and mailbox context.

Example:

Invoice `INV-9104` is on hold because no PO reference has been supplied. Bob should show the finance source and mailbox thread instead of giving an unsupported summary.

### Pricing Sheet Confusion

Bob discovers conflicting pricing files:

- `pricing-sheet-FINAL.xlsx`
- `pricing-sheet-FINAL-v2.xlsx`
- `pricing-sheet-USE-THIS-ONE.xlsx`

Bob should mark the current source as unresolved until sales or finance approves the trusted sheet.

### Renewal Process Discovery

Bob reviews CRM renewal dates, renewal tracker data and process notes.

If the process document is stale, Bob should say so. It should not treat old documentation as the current process without review.

## Early Pilot Customer Profile

The best early pilot customer is a UK SME with:

- practical operational pain
- Microsoft 365 or SharePoint usage
- CRM or spreadsheet-based customer records
- finance data from Sage or similar tools
- shared mailboxes used for customer decisions
- willingness to start with one controlled data source
- staff who value explainability over shortcuts

The ideal pilot is not looking for a dramatic transformation. They want clearer answers to everyday operational questions.

## V1 Capabilities

V1 should support:

- Discovery Mode for controlled sources
- source classification
- visible provenance
- confidence labels
- facts vs assumptions separation
- human approval for source use and important relationships
- static or controlled demos using synthetic BLLB LTD data
- operational memory for reviewed facts, relationships and corrections
- sourced answer patterns for selected operational questions
- clear suggested next actions

V1 should feel useful before it feels broad.

## V1 Non-goals

V1 is not for:

- autonomous business operation
- replacing staff
- hidden reasoning
- pretending certainty
- ingesting everything automatically
- becoming a generic AI chatbot
- broad workflow automation
- uncontrolled production data access
- complex enterprise platform behaviour
- public launch theatre

V1 should stay smaller, clearer and easier to inspect.

## Success Criteria

V1 succeeds when:

- staff trust Bob's answers
- users understand why Bob reached a conclusion
- operational confusion is reduced
- businesses reconnect fragmented knowledge
- facts and assumptions are clearly separated
- provenance is visible
- corrections improve future answers
- human approval remains intact
- Bob becomes useful before becoming clever

## What Success Looks Like

Success looks like an operations person asking:

> Why is this customer blocked?

And Bob answering with:

- the install status
- the finance hold
- the missing PO thread
- the duplicate record warning
- confidence labels
- unresolved uncertainty
- suggested next actions

The person should be able to check the answer, correct it if needed, and understand what Bob will remember next time.

## Long-term Philosophy

AskBob should grow from operational trust, not trend pressure.

The long-term product should remain:

- source-aware
- correction-friendly
- role-conscious
- operationally grounded
- careful with memory
- clear about uncertainty
- useful in real workflows

The product can become more capable over time, but capability should not outrun explainability.

## MORSE And NAIB Alignment

AskBob V1 follows MORSE:

- **Modular**: discovery, provenance, memory and answers remain separate concerns.
- **Opinionated**: Bob favours approved sources, conservative confidence and visible uncertainty.
- **Role-based**: approval and visibility respect operational ownership.
- **Simple**: V1 starts with controlled sources and focused workflows.
- **Explainable**: every important answer should show why Bob thinks it.

AskBob V1 follows NAIB:

- operational usefulness over novelty
- explainability over illusion
- trust over theatrics
- source trails over unsupported answers
- human oversight over hidden decisions

AskBob should remain operationally useful, explainable and trustworthy — even if that means moving slower than trend-driven AI products.
