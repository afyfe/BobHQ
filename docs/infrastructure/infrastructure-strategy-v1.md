# AskBob Infrastructure Strategy (V1)

## Overview

AskBob V1 will launch on a dedicated bare-metal server hosted in Telehouse London.

The platform philosophy is:

- predictable infrastructure costs
- operational simplicity
- modern high-performance hardware
- modular deployment
- future scalability
- strong observability and recovery capability

This aligns with the AskBob principle:

> NAIB — Not Another AI Bollocks

The infrastructure should remain grounded, explainable, operationally useful, and financially sensible.

---

# Initial Hardware Platform

## Selected Direction

### Dedicated Bare-Metal Server

Recommended specification:

- AMD Ryzen 9950X / EPYC 4565P
- 16 Cores / 32 Threads
- 128GB ECC DDR5
- 2 × 1.92TB Enterprise NVMe
- Hardware RAID 1
- 1Gbps Unlimited
- Telehouse London datacentre

### Rationale

This platform provides:

- excellent single-thread performance
- strong multi-thread worker capacity
- fast NVMe storage for vector and document workloads
- sufficient RAM for PostgreSQL, Redis, vector search and workers
- operational resilience via hardware RAID
- enough headroom for early production customers

The intention is to avoid:
- underpowered VPS environments
- unpredictable cloud billing
- over-engineered hyperscale infrastructure too early

---

# Base Operating System

## Proxmox VE

The server will run:

- Proxmox VE directly on bare metal

Proxmox acts as the virtualisation layer and management platform.

### Why Proxmox

Benefits include:

- VM isolation
- snapshots before deployments
- clean staging/production separation
- easier disaster recovery
- simplified migration later
- operational flexibility
- future tenant isolation possibilities

---

# Infrastructure Philosophy

## Key Principle

> Proxmox manages machines.
> Docker manages applications.

The Proxmox host should remain clean.

The host should NOT run:
- application code
- databases
- Docker workloads
- customer services

The Proxmox host should ONLY run:
- Proxmox VE
- firewalling
- SSH
- monitoring agents
- backup tooling

---

# Initial VM Layout

## askbob-prod

Purpose:
- production AskBob API
- frontend
- background workers
- production services

Suggested OS:
- Ubuntu Server LTS

Runs:
- Docker
- Docker Compose
- AskBob API
- AskBob UI
- worker containers
- nginx / reverse proxy

---

## askbob-db

Purpose:
- PostgreSQL
- vector storage
- Redis
- persistence layer

Suggested OS:
- Ubuntu Server LTS

Runs:
- PostgreSQL
- pgvector or Qdrant
- Redis

Notes:
- keep DB workloads isolated from application workloads
- allows independent scaling later

---

## askbob-staging

Purpose:
- staging environment
- deployment testing
- feature validation
- connector testing

Suggested OS:
- Ubuntu Server LTS

Runs:
- staging copies of application services

---

## askbob-tools

Purpose:
- operational tooling
- utility jobs
- scheduled scripts
- maintenance services

Potential workloads:
- backup sync tooling
- ingestion experiments
- admin utilities

---

# Container Strategy

## Docker

Applications should run inside Docker containers.

### Benefits

- reproducible deployments
- isolation
- easier rebuilds
- simpler migrations
- future orchestration compatibility
- environment consistency

Initial orchestration:
- Docker Compose

Potential future evolution:
- Kubernetes
- Nomad
- multi-node orchestration

Only when genuinely required.

---

# Storage Strategy

## RAID

The server uses:
- hardware RAID 1

Important principle:

> RAID is resilience.
> Backup is recovery.

RAID is NOT a backup replacement.

---

# Backup Strategy

## Existing Capability

Offsite backup infrastructure already exists:
- UTBackup instance
- 20TB storage
- separate datacentre in Northern Ireland

### Backup Objectives

- nightly VM backups
- database dumps
- configuration backups
- Docker volume backups
- encrypted offsite replication

---

# Monitoring & Observability

## Existing Capability

Monitoring stack already exists:
- Nagios monitoring infrastructure

### Planned Monitoring

Monitor:
- host uptime
- VM uptime
- disk usage
- RAID health
- CPU/RAM
- Docker containers
- PostgreSQL
- SSL expiry
- backup success/failure

---

# Security Baseline

## Initial Security Controls

- SSH keys only
- disable password SSH auth
- firewalling
- fail2ban
- isolated Docker networks
- restricted exposed ports
- least-privilege service accounts
- automatic security updates where appropriate

---

# Networking

## Reverse Proxy

Initial direction:
- nginx or Caddy

Responsibilities:
- TLS termination
- routing
- compression
- security headers
- rate limiting later if required

---

# AI Model Strategy

## Initial Approach

AskBob will initially use:
- OpenAI APIs
- hosted embedding APIs

The platform will NOT initially self-host LLMs.

### Reasoning

This reduces:
- operational complexity
- GPU requirements
- infrastructure costs
- deployment risk

The focus remains:
- operational intelligence
- workflows
- connectors
- retrieval quality
- business usefulness

---

# Scaling Strategy

## Phase 1

Single dedicated Proxmox host.

## Phase 2

Larger dedicated infrastructure or additional nodes.

## Phase 3

Potential clustered infrastructure and orchestration.

Scaling should be driven by:
- real customers
- real workloads
- real operational need

NOT infrastructure enthusiasm.

---

# Final Principle

The goal is to build:

- a reliable operational platform
- not a hyperscaler
- not a vanity cloud environment
- not over-engineered AI theatre

Infrastructure decisions should remain:
- practical
- observable
- maintainable
- cost-aware
- customer-driven
