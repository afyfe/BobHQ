# Bob Memory Model

## Purpose

Bob stores operational memory, not just chat history.

## Memory Types

### Operational Facts
Known operational truths.

### Inferred Knowledge
Knowledge Bob believes is likely true.

### Confirmed Knowledge
Human-confirmed operational truth.

### Rejected Knowledge
Information rejected by users.

## Provenance

Every memory item should track:

- source system
- source document
- timestamp
- confidence
- confirmation status
- user feedback

## Feedback Loop

Users should be able to:

- confirm findings
- reject findings
- mark stale information
- provide corrections

## Principle

Bob should never pretend certainty.
