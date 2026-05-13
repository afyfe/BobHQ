# Connector Model

## Philosophy

Connectors should be:

- lightweight
- outbound-only where possible
- operationally safe
- explainable
- easy to deploy

## Connector Responsibilities

- Discover systems
- Extract metadata
- Index approved content
- Sync operational knowledge
- Report health and status

## Early Connector Targets

- SharePoint
- File shares
- Sage exports
- SQL databases
- CRM systems
- Microsoft 365

## Security Principles

- No inbound VPN requirement
- Encrypted communication
- Principle of least privilege
- Tenant isolation
- Customer approval model

## Discovery Flow

1. Connector installed
2. Bob performs discovery scan
3. Customer reviews findings
4. Customer enables approved sources
5. Bob begins indexing

## NAIB Reminder

Connectors exist to surface operational clarity, not create complexity.
