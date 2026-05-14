# AskBob Provenance And Trust Model

## Purpose

The Provenance and Trust Model explains how Bob decides whether information can be trusted, how that trust is shown to users, and what happens when sources disagree.

Bob should help people understand operational reality. That means every useful answer needs visible sources, confidence labels, clear separation between facts and assumptions, and a route for human correction.

## Core Principles

- **Provenance first**: every claim should point back to a source.
- **Facts and assumptions stay separate**: Bob must never present inferred knowledge as fact.
- **Human approval matters**: important operational conclusions should be approved before they become trusted memory.
- **Trust can change**: new information can confirm, reject or supersede earlier conclusions.
- **Staleness is visible**: old documents and records should not be treated as current without review.
- **Conflicts are useful signals**: source disagreement should be surfaced, not smoothed away.

## Source Provenance

Source provenance is the record of where information came from and why Bob used it.

For each claim, Bob should retain:

- source system
- source path, file name, thread name or record identifier
- observed value
- last seen or last modified date where available
- approval state
- confidence level
- whether the claim is a fact, inference, human decision or correction

Example:

| Claim | Source | Provenance note |
| --- | --- | --- |
| ABC Ltd install is blocked | `demo-data/bllb-ltd/operations/install-board.csv` | Install row `INS-2401` has status `Blocked` |
| ABC Ltd PO is missing | `demo-data/bllb-ltd/mailbox/po-request-thread.md` | Finance says the account cannot be released without a PO |
| ABC Limited may duplicate ABC Ltd | `demo-data/bllb-ltd/crm/customers.csv` | Similar name, same town, same account manager and renewal date |
| Onboarding process is stale | `demo-data/bllb-ltd/sharepoint/onboarding-process.md` | Document says finance checks occur after scheduling, but notes say the process changed |

## Confidence Levels

Confidence levels describe how strongly Bob should rely on a claim.

| Level | Meaning | User-facing behaviour |
| --- | --- | --- |
| Confirmed | Supported by an approved source or human decision | Can be stated as a fact with source shown |
| Likely | Supported by multiple signals, but not fully confirmed | Should be phrased carefully and marked as likely |
| Inferred | Suggested by patterns or related records | Must not be presented as fact |
| Needs review | Useful but unresolved, conflicting or incomplete | Should ask for human review |
| Rejected | Reviewed and marked incorrect or out of scope | Should not be used in answers except as history |
| Stale | Source may be outdated | Should be flagged before use |

## Knowledge States

Knowledge states describe where a piece of information is in its lifecycle.

| State | Meaning |
| --- | --- |
| Discovered | Bob has found the source or claim but has not used it as knowledge |
| Inferred | Bob has suggested a relationship or conclusion that needs support |
| Confirmed | The claim is supported by a trusted source |
| Human approved | A person has explicitly approved the claim, source or relationship |
| Rejected | A person or stronger source has rejected the claim |
| Superseded | A newer source or correction has replaced the earlier claim |

Knowledge state and confidence are related but not identical. A claim can be discovered with no confidence, inferred with medium confidence, or confirmed but stale.

## Human Approval

Human approval is required when Bob would otherwise turn uncertain operational information into trusted memory.

Approval should be recorded for:

- source use
- field or folder boundaries
- inferred relationships
- conflict resolution
- corrections
- sensitive operational conclusions

Example:

Bob may infer that `ABC Ltd` and `ABC Limited` are duplicates. That inference should stay in `Needs review` until someone confirms whether the records should be merged, linked or kept separate.

## Conflict Handling

Bob should surface conflicts instead of hiding them.

Conflict types:

- **Record conflict**: two systems disagree about status, owner, date or amount.
- **Document conflict**: two documents claim to be current.
- **Process conflict**: written process differs from how the team now works.
- **Source conflict**: one source says an issue is resolved while another still shows it open.
- **Identity conflict**: two records may refer to the same customer, supplier or site.

Conflict handling steps:

1. Show the conflicting sources.
2. State what each source says.
3. Identify which source is approved, newer or more specific.
4. Mark the conclusion as `Needs review` if the conflict cannot be resolved safely.
5. Record the human decision when reviewed.

## Corrections

Corrections are part of trust. Bob should make it easy to correct an answer and preserve the reason for the correction.

A correction should record:

- original claim
- corrected claim
- correcting user or approved source
- date of correction
- reason for change
- affected memory entries

Example:

- Original claim: ABC Ltd install may be delayed due to stock shortage.
- Correction: ABC Ltd install is blocked because the PO number has not been supplied.
- Sources: `po-request-thread.md`, `install-board.csv`, `invoice-disputes.md`.
- State change: original claim becomes `Superseded`; corrected claim becomes `Confirmed` if approved.

## Audit Trail

The audit trail should make Bob's operational memory inspectable.

For important claims, the audit trail should show:

- when the source was discovered
- when metadata was indexed
- who approved the source
- what Bob inferred
- what was confirmed or rejected
- when the claim was last used in an answer
- whether a later correction changed it

The audit trail does not need to be complex. It needs to be complete enough that a user can ask: "Why does Bob think this?" and get a clear answer.

## Expiry And Staleness

Operational knowledge can go stale. Bob should treat older or time-sensitive sources with care.

Staleness signals include:

- old review date
- replaced file name
- newer conflicting source
- unresolved status with no recent update
- process note contradicting current operational behaviour
- owner no longer active or no longer responsible

BLLB LTD example:

`sharepoint/onboarding-process.md` was last reviewed on 2025-09-18 and says finance checks happen after install scheduling. The note also says operations now expects finance holds to be cleared first. Bob should mark the process note as `Stale` and avoid treating it as current without review.

## Examples Using BLLB LTD

### ABC Ltd And ABC Limited Duplicate

Sources:

- `crm/customers.csv`

Observed facts:

- `ABC Ltd` and `ABC Limited` are both active customer records.
- Both records use Leeds, Maya Patel and the same renewal date.

Trust treatment:

- Customer records are `Discovered`.
- The duplicate relationship is `Inferred`.
- Confidence is `Needs review` until a person confirms the match.

Bob should say:

> ABC Limited may be a duplicate of ABC Ltd based on matching town, account manager and renewal date. This is not confirmed.

Bob should not say:

> ABC Limited is definitely the same customer as ABC Ltd.

### Missing PO Install Blocker

Sources:

- `operations/install-board.csv`
- `mailbox/po-request-thread.md`
- `finance/invoice-disputes.md`

Observed facts:

- Install `INS-2401` for ABC Ltd is marked `Blocked`.
- The install board says `No PO; finance hold`.
- The mailbox thread says finance cannot release the account until a PO reference is supplied.
- The invoice dispute note says invoice `INV-9104` is unresolved and finance hold is applied in Sage until the PO reference is supplied.

Trust treatment:

- Install status is `Confirmed` if the operations board is approved.
- Missing PO is `Confirmed` if the mailbox thread is approved.
- The conclusion that the PO is the active blocker is `Likely` until finance confirms there has been no later update.

### Conflicting Pricing Sheets

Sources:

- `sharepoint/pricing-sheet-FINAL.xlsx`
- `sharepoint/pricing-sheet-FINAL-v2.xlsx`
- `sharepoint/pricing-sheet-USE-THIS-ONE.xlsx`

Observed facts:

- Multiple pricing files appear to claim final or current status.
- File names alone are not enough to prove which sheet is approved.

Trust treatment:

- Pricing files are `Discovered`.
- Current pricing sheet is `Needs review`.
- Once a person approves one sheet, the others may become `Superseded` for that use.

Bob should show the conflict and ask for approval before using one file as the trusted pricing source.

### Disputed Invoice Source Conflict

Sources:

- `finance/invoice-disputes.md`
- `crm/customers.csv`
- mailbox or Outlook thread referenced by finance notes

Observed facts:

- Pembroke Print Services Ltd has an unresolved invoice dispute.
- Finance notes say the customer disputes the monthly rate.
- CRM shows standard price band B.
- The finance note says an Outlook thread suggests a one-off discount was offered.
- The discount is not visible in the current pricing sheet.

Trust treatment:

- Invoice dispute is `Confirmed` if finance notes are approved.
- Discount claim is `Likely` or `Needs review` until the referenced Outlook thread is approved.
- Pricing source is in conflict and should not be treated as settled.

Bob should explain:

> Finance shows an unresolved dispute. CRM and pricing records do not currently show the discount mentioned in the finance note, so the pricing exception needs review by sales and finance.

## Non-goals

The Provenance and Trust Model is not designed for:

- hidden reasoning
- unsourced answers
- pretending certainty
- replacing human approval
- automatic ingestion of every discovered source
- treating file names as proof of truth
- hiding conflict to make answers look cleaner
- permanent memory with no expiry or correction route

Bob is useful when people can inspect how an answer was formed, decide whether it is trusted, and correct it when the operational picture changes.
