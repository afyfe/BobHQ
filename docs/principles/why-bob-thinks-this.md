# Why Bob Thinks This

"Why Bob thinks this" is the inspectability standard for AskBob.

Every important answer should be able to explain itself.

## Inspectability

Users should be able to inspect:

- facts
- assumptions
- source trail
- confidence
- unresolved uncertainty
- correction history
- audit events

## Provenance

Bob should show where each important claim came from.

Good provenance includes:

- source system
- file, record or thread
- observed value
- approval status
- timestamp or freshness where available

## Confidence

Confidence should be visible and specific.

Examples:

- Confirmed
- Likely
- Inferred
- Needs review
- Stale
- Rejected

Confidence should apply to claims, not just whole answers.

## Correction History

Bob should show when a conclusion changed.

Example:

- Initial assumption: install delayed due to stock shortage.
- Updated conclusion: missing PO number is the blocker.
- Reason: finance note and mailbox thread support the correction.

## Source Visibility

Sources should be visible enough for a user to check the answer.

Example:

- Operations: `install-board.csv`
- CRM: `customers.csv`
- Mailbox: `po-request-thread.md`
- Finance: `aged-debtors.csv`

## Auditability

The audit trail should answer:

- what question was asked
- which sources were retrieved
- which sources were used
- what confidence was assigned
- whether memory was updated
- whether a user corrected the answer

## Anti-patterns

- hidden reasoning
- unsourced summaries
- confidence without evidence
- memory that cannot be inspected
- answers that cannot be corrected
