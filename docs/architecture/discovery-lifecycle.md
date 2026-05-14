# AskBob Discovery Lifecycle

## Purpose

The Discovery Lifecycle describes how AskBob finds operational sources, explains what it has found, and waits for human approval before those sources become part of Bob's operational memory.

Discovery Mode is designed for real businesses with messy systems: shared folders, spreadsheets, mailboxes, CRM exports, finance tools and process notes. The goal is not to make hidden decisions. The goal is to make operational context visible, traceable and useful.

## Principles

- **Modular**: connectors, source records, relationship checks and memory entries are separate concerns.
- **Opinionated**: Bob should prefer clear source trails, explicit approval and conservative confidence labels.
- **Role-based**: different people can approve different sources, such as finance, operations or customer success.
- **Simple**: discovery starts with one controlled source where possible.
- **Explainable**: every useful answer must show sources, facts, assumptions and confidence.

AskBob follows NAIB: no vague promises, no hidden reasoning, no theatrical automation. Discovery should feel like a careful operations analyst showing their working.

## Discovery Phases

### 1. Connector Installed

A user connects a controlled source, such as a Microsoft 365 folder, SharePoint site, Sage export, CRM export or shared mailbox.

At this stage Bob records only connector metadata and access boundaries. A connector being installed does not mean all data is approved for learning.

### 2. Environment Scanned

Bob inspects the shape of the connected environment. For example, it may see folder names, file types, mailbox thread subjects, CSV headers or system export names.

This is discovery before indexing. Bob is finding what exists before deciding whether it should be used.

### 3. Sources Discovered

Bob creates a list of candidate sources. Each source receives an initial classification and status.

Example from synthetic BLLB LTD data:

- `crm/customers.csv` - customer records
- `operations/install-board.csv` - installation status
- `mailbox/po-request-thread.md` - customer and finance correspondence
- `finance/aged-debtors.csv` - finance status
- `sharepoint/pricing-sheet-USE-THIS-ONE.xlsx` - possible current pricing file

### 4. Metadata Indexed

Approved metadata can be indexed so Bob can describe sources without ingesting their full contents. Metadata may include:

- source name
- source system
- owner or likely owner
- last updated date
- file type
- record count or thread count
- approval status
- confidence label

Content indexing is a separate approval step.

### 5. Relationships Inferred

Bob may suggest relationships between discovered sources. These are labelled as inferred until reviewed or supported by stronger evidence.

Example:

> `ABC Limited` may match `ABC Ltd` based on the same town, renewal date and account manager in `crm/customers.csv`.

This is an inference, not a fact. Bob should say why the link was suggested and what evidence is missing.

### 6. Human Review

A person reviews discovered sources and inferred relationships. They can approve, ignore, correct or restrict each item.

Review should answer:

- Is this source allowed?
- Who owns it?
- Is it current?
- Should Bob use metadata only, full content, or neither?
- Is the inferred relationship valid?

### 7. Approved Sources

Approved sources become available to Bob within the agreed boundary. Approval should be explicit and recorded.

Examples:

- Operations approves `install-board.csv` for install status.
- Finance approves `aged-debtors.csv` for debtor status, but not for unrestricted customer profiling.
- Customer success approves `customers.csv` after reviewing duplicate records.

### 8. Operational Memory Built

Bob builds operational memory from approved sources and human-reviewed conclusions.

Memory entries should separate:

- facts from approved sources
- assumptions or inferred links
- human decisions
- corrections over time

Example memory:

> Fact: ABC Ltd install is blocked in `operations/install-board.csv`.
>
> Fact: The PO number is missing in `mailbox/po-request-thread.md`.
>
> Inference: `ABC Limited` may be a duplicate CRM record.
>
> Human review needed: confirm whether `ABC Ltd` and `ABC Limited` should be merged or kept separate.

### 9. Ongoing Monitoring

Bob can continue to monitor approved sources for relevant changes. Monitoring should remain bounded by the same approvals and trust boundaries.

Examples:

- A new email arrives with the missing PO number.
- The install board owner changes from blank to a named operations owner.
- A pricing spreadsheet is replaced by a newer approved file.
- An invoice dispute is marked resolved.

Monitoring does not mean Bob can act without approval. It means Bob can surface changed context with provenance.

## Human Approval Model

Humans remain in control of what Bob learns from.

Approval should be recorded per source and per use where needed. A source can be visible during discovery but still not approved for indexing or operational memory.

Suggested approval states:

- **Discovered**: Bob found the source but has not used it.
- **Needs approval**: Bob believes the source may be useful, but a person must decide.
- **Approved for metadata**: Bob can describe the source but not use full content.
- **Approved for content**: Bob can use the source content within the agreed purpose.
- **Ignored**: Bob should not use the source.
- **Restricted**: Bob may use only selected fields, folders, records or dates.

## Provenance

Provenance is mandatory. Bob should be able to show where each answer came from.

For each claim, Bob should retain:

- source system
- source path or record reference
- observed value
- timestamp or last modified date where available
- confidence label
- approval state
- whether the claim is a fact, inference or human decision

Example:

| Claim | Type | Source | Confidence |
| --- | --- | --- | --- |
| ABC Ltd install is blocked | Fact | `operations/install-board.csv` | Confirmed |
| PO reference is missing | Fact | `mailbox/po-request-thread.md` | Confirmed |
| Finance hold is related to rejected invoice INV-9104 | Inference | `finance/aged-debtors.csv`, `mailbox/po-request-thread.md` | Likely |
| ABC Ltd and ABC Limited are duplicates | Inference | `crm/customers.csv` | Needs review |

## Trust Boundaries

Trust boundaries define what Bob can see, describe, index and remember.

Important boundaries:

- connector boundary: which system or folder is connected
- source boundary: which files, tables or mailboxes are in scope
- field boundary: which fields can be used
- purpose boundary: what Bob is allowed to use the data for
- retention boundary: how long operational memory should keep conclusions
- role boundary: who can approve, correct or restrict sources

Bob should not silently expand a boundary. If a new folder, mailbox or export appears, it should be treated as a discovered source that needs review.

## Source Classification

Discovered sources should be classified so humans can make quick decisions.

Example classes:

- **Customer records**: CRM exports, account lists, onboarding records
- **Finance records**: aged debtors, invoice disputes, Sage exports
- **Operational boards**: installs, service issues, engineer notes
- **Documents**: process notes, templates, agreements
- **Mail threads**: shared mailbox conversations and customer threads
- **Spreadsheets**: pricing sheets, renewal trackers, exception lists
- **Knowledge notes**: informal process notes and known-workaround documents

Classification can be inferred initially, but it should remain editable.

## Operational Memory

Operational memory is the reviewed history Bob can use to answer future questions.

It should not be a raw dump of every connected source. It should be a controlled set of useful operational facts, decisions, corrections and approved relationships.

BLLB LTD examples:

- ABC Ltd install delayed due to missing PO.
- Pricing exception approved by Maya Patel, but not reflected in CRM.
- Duplicate customer record suspected for ABC Ltd and ABC Limited.
- Renewal process notes may be stale after a finance dispute.
- Engineer reassignment caused install ownership confusion for Silver Birch Nursery Ltd.

Bob should be able to correct memory when better evidence appears.

Example correction:

- Initial assumption: install delayed due to stock shortage.
- Updated conclusion after email review: install is blocked because the PO number has not been supplied.

## Relationship Inference

Relationship inference connects disconnected operational information. It must be explainable and conservative.

Bob should show:

- what was linked
- why it was linked
- which sources were involved
- the confidence level
- what would confirm or disprove the link

BLLB LTD examples:

- `ABC Ltd` in `install-board.csv` links to `ABC Ltd` in `customers.csv` because the customer name matches and the CRM note mentions a missing PO.
- `po-request-thread.md` links to the blocked install because the thread subject names ABC Ltd and says the PO is needed before install.
- `aged-debtors.csv` may link to the install block if it references the rejected invoice mentioned in the mailbox thread.
- `pricing-sheet-USE-THIS-ONE.xlsx` may supersede `pricing-sheet-FINAL.xlsx`, but this requires human approval because file names conflict.
- `ABC Limited` may match `ABC Ltd` based on similar name, same town and same renewal date, but this remains uncertain until reviewed.

## Safety And Privacy Boundaries

Discovery Mode should reduce risk by making source use explicit.

Boundaries:

- use synthetic or approved demo data for demos
- do not ingest production data without explicit approval
- do not use unapproved sources for operational memory
- do not expose sensitive fields unless approved for the user's role
- do not infer personal or sensitive attributes
- do not make business decisions without a person
- do not hide uncertainty
- do not preserve stale conclusions after a correction is approved

## Example Workflows

### Blocked Install

Question: "Why hasn't ABC Ltd been installed?"

Workflow:

1. Bob finds `ABC Ltd` in `operations/install-board.csv` with status `Blocked`.
2. Bob finds a CRM note in `crm/customers.csv` saying the PO reference is missing.
3. Bob finds `mailbox/po-request-thread.md`, where finance says ABC Ltd cannot be released until a PO is provided.
4. Bob checks whether finance data supports the hold.
5. Bob returns a sourced answer separating facts from assumptions.
6. A human reviews the duplicate `ABC Limited` record before CRM cleanup.

Conclusion:

> The install appears blocked because the PO number has not been supplied. There may also be a duplicate CRM record that should be reviewed before proceeding.

### Conflicting Pricing Sheets

Question: "Which pricing sheet is current?"

Workflow:

1. Bob discovers three SharePoint pricing files with conflicting names.
2. Bob classifies them as spreadsheets and marks the current source as unclear.
3. Bob checks metadata such as modified date and owner if available.
4. Bob asks for human approval before treating one spreadsheet as current.
5. Once approved, Bob records the chosen file and the approval trail.

### Ownership Confusion

Question: "Who owns this issue?"

Workflow:

1. Bob finds a blocked install in the operations board.
2. Bob finds notes showing one person says customer success owns the customer and another says operations owns the install.
3. Bob labels ownership as unresolved.
4. A manager confirms the owner.
5. Bob records the decision as human approved memory.

## Non-goals

AskBob Discovery Lifecycle is not trying to provide:

- fully autonomous business decisions
- hidden reasoning
- replacement of operational staff
- uncontrolled ingestion
- broad data scraping without approval
- a general data lake
- a complex workflow engine
- public launch growth mechanics
- theatrical AI behaviour

The useful version of Bob is the one that can explain what it found, where it found it, what it thinks it means, and what still needs a human decision.
