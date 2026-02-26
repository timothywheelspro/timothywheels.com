---
title: "Frameworks"
subtitle: "Catalog of Operational Protocols"
type: "page"
layout: "single"
hideMeta: true
---

## Catalog Overview

This directory serves as a register of protocols used to maintain system integrity. These are not suggestions; they are the defined constraints used to manage failure, assess risk, and route information.

---

## Layer 0: Survival Economics

**The foundation protocol.** Before optimization, you must survive long enough to iterate.

Layer 0 teaches how to calculate your actual survival floor, prescribe VLAN resource allocation, and engineer forcing functions that survive motivation failing.

**Resources**:
- **[Read: Layer 0 Clarity (Episode 01)](/awareness-in-action/ep01-layer0-clarity/)** — The framework breakdown
- **[Download: Layer 0 Budget Tracker (Free)](/tracker/)** — The implementation tool

**Key concepts**: Survival floor calculation, VLAN segmentation, prescribed economics, forcing functions

---

## Primary Protocols

### [Failure Mode Runbook](./failure-mode-runbook.md)
**Objective:** Deterministic recovery during operational collapse.
**Logic:** A recursive diagnostic loop designed to stabilize state before attempting remediation.

### [Threat Model Analysis](./threat-model-analysis.md)
**Objective:** Identification and mitigation of system vulnerabilities.
**Logic:** A structured assessment of attack vectors across technical, operational, and reputational domains.

### [Decision Protocols](./decision-protocols.md)
**Protocol Purpose:** To standardize the weight and velocity of decision-making. By categorizing choices by their cost-of-change, the system prevents analysis paralysis on low-stakes routing.

### [RME Translation Packet](./rme-translation-packet.md)
**Logic:** Treat communication as packet delivery. This framework ensures that high-context internal data is translated into low-context external formats without signal loss.

---

## Topology

The topology of these frameworks is designed for interoperability. A failure detected by the **Runbook** triggers a reassessment in the **Threat Model**, which informs the next **Decision Protocol**.
