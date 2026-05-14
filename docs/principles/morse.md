# MORSE

MORSE is the working product standard for AskBob:

- Modular
- Opinionated
- Role-based
- Simple
- Explainable

It is not a slogan. It is a filter for product decisions, architecture decisions and demo design.

## Modular

### What It Means

AskBob should be built from clear parts with clear responsibilities.

Examples:

- discovery is separate from indexing
- provenance is separate from answer wording
- operational memory is separate from raw source data
- relationship inference is separate from human approval

### Why It Matters

Operational systems are messy. Modular design lets Bob handle one part of the mess without turning the whole product into a tangle.

It also keeps demos honest. A static demo can explain Discovery Mode without pretending the full platform exists.

### Anti-patterns

- one large component doing discovery, retrieval, memory and answer generation
- unclear boundaries between source data and approved memory
- treating every feature as part of one generic assistant
- adding frameworks or backend services before a real need exists

## Opinionated

### What It Means

Bob should make conservative product choices by default.

Examples:

- provenance is mandatory
- inferred knowledge is never presented as fact
- unapproved sources are not used as trusted evidence
- uncertainty is shown instead of hidden
- human approval is required for important operational conclusions

### Why It Matters

Operations teams need useful answers, not confident guesses. Opinionated defaults protect trust.

### Anti-patterns

- answering without sources
- smoothing over conflicts
- treating file names as proof
- assuming the newest source is always right
- using vague confidence language that cannot be inspected

## Role-based

### What It Means

Different people can see, approve and correct different things.

Examples:

- finance can approve invoice and debtor sources
- operations can approve install board conclusions
- customer success can review CRM duplicate records
- managers can resolve ownership disputes

### Why It Matters

Operational truth often belongs to a role, not to a system. Bob should respect who is allowed to decide.

### Anti-patterns

- one global approval for all data
- showing finance detail to users who should not see it
- allowing any user to confirm sensitive conclusions
- ignoring ownership when resolving conflicts

## Simple

### What It Means

AskBob should solve the smallest real operational problem first.

Examples:

- start Discovery Mode with one controlled data source
- prefer static demos before platform complexity
- use plain documents for principles and architecture
- avoid extra build tooling when static HTML is enough

### Why It Matters

Simple systems are easier to inspect, correct and trust. Complexity should earn its place.

### Anti-patterns

- building infrastructure before the workflow is understood
- adding dashboards for everything
- turning every answer into a workflow engine
- introducing a database or service for static storytelling

## Explainable

### What It Means

Bob should be able to show why it thinks something.

Every important answer should include:

- facts
- assumptions
- confidence
- provenance
- unresolved uncertainty
- correction history where relevant

### Why It Matters

People trust operational answers when they can inspect them. Explainability is not decoration; it is the product.

### Anti-patterns

- hidden reasoning
- unsourced answers
- unexplained memory
- confidence without evidence
- answers that cannot be corrected

## Alignment With Architecture

MORSE aligns with:

- Discovery Lifecycle: discovery before indexing, approval before learning
- Provenance and Trust Model: sourced claims, confidence states and corrections
- Operational Memory Lifecycle: inspectable memory with history and expiry
- Query and Answer Lifecycle: answers with evidence, confidence and audit trail
