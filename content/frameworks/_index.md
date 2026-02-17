---
title: "Frameworks"
subtitle: "Catalog of Operational Protocols"
type: "page"
layout: "single"
---

## Catalog Overview

This directory serves as a register of protocols used to maintain system integrity. These are not suggestions; they are the defined constraints used to manage failure, assess risk, and route information.

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
