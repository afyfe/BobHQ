# Bob HQ

Bob HQ is the cloud-hosted control plane for AskBob.

## Responsibilities

- Tenant management
- User authentication and authorisation
- Chat orchestration
- Knowledge search
- Operational memory
- Audit logging
- Connector registration
- Source approval workflow
- Reminder and notification orchestration

## Design Principles

- Cloud-hosted, customer-data aware, but source-controlled
- Tenant-isolated from day one
- Source-aware answers only
- No direct inbound access to customer networks
- Built around MORSE and NAIB

## Early Phase 1 Shape

- .NET 8 API
- React/Vite web UI
- SQL database for truth and audit
- Vector store for semantic retrieval
- Background worker for ingestion and reminders

## Not Now

- Enterprise HA architecture
- Multi-region deployment
- Full billing platform
- Autonomous remediation
