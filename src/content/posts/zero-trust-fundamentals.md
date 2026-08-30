---
title: "Zero Trust: Why the Perimeter Model Is Dead"
pubDate: 2025-04-27
updatedDate: 2026-08-30
description: "What Zero Trust changes, where to start, and how to replace broad network access without breaking the business."
author: "Sudhir"
isPinned: false
excerpt: "What Zero Trust changes, where to start, and how to replace broad network access without breaking the business."
tags: ["Security architecture", "Network security"]
---

A valid VPN login often gives a user more network access than the job requires. If an attacker steals that user's session, the same convenience becomes a path to internal applications.

Zero Trust changes the question. Instead of asking whether a connection came from the trusted network, it asks who is requesting access, which device they are using, what resource they need, and whether the request still looks safe.

It is an architecture, not a product. Buying ZTNA licenses does not fix weak identity, permanent admin rights, or an application estate nobody has mapped.

## What changes under Zero Trust

Traditional perimeter security grants broad trust after a user or device crosses a boundary. Zero Trust makes a narrower decision for each resource.

Three principles guide that decision:

- Verify the user, device, and relevant context.
- Grant only the access required for the task.
- Design as if an attacker already has a foothold.

These principles affect identity, network design, application access, endpoint management, logging, and incident response. They also expose old assumptions. A shared administrator account or an application that cannot identify its users will block progress long before the team chooses a ZTNA platform.

## What it looks like in practice

Consider an engineer who needs a production console. A perimeter model may allow the engineer's laptop onto a large internal network through VPN. A Zero Trust design can require a managed device, phishing-resistant MFA, an approved role, and a time-limited session to that console alone.

The application does not become safe because the access path changed. It still needs authorization, logging, secure sessions, and protection against its own vulnerabilities. Zero Trust narrows exposure. It does not replace application security.

The same reasoning applies to devices that cannot run an agent. A hospital may isolate an infusion pump, allow it to reach only the services it requires, and monitor deviations from that pattern. The device remains difficult to secure, but compromising it no longer gives an attacker a useful route to patient records.

## Start with one access path

A company-wide Zero Trust programme can take years. The first project should be small enough to measure and important enough to matter.

Privileged remote access is a good candidate. It has clear users, sensitive resources, and an obvious reason to remove broad VPN access.

An illustrative migration might begin with an administrator whose VPN group can route to the entire `10.0.0.0/8` estate for a 12-hour session. The administrator only needs the payroll console and monitoring dashboard.

The replacement policy exposes those two applications, requires a managed device and phishing-resistant MFA, and grants access for one approved hour. A test should show that the same session cannot discover the database subnet or open an unrelated admin console. The team should also time how long it takes to revoke the session and confirm that both application and policy logs identify the administrator.

Those are sample conditions, not field results. A real project should record its own reachable resources, session lifetime, revocation time, authentication failures, and support tickets before migration.

For that path:

1. Identify the users, devices, applications, and service dependencies.
2. Record the access that people use, not only what the policy says they need.
3. Remove unused access and assign owners to the remaining permissions.
4. Require strong authentication and managed device checks.
5. Give users access to the application instead of the surrounding network.
6. Log policy decisions and test how the team revokes access during an incident.

Measure the result. Useful measures include the number of reachable resources before and after the change, standing privileged accounts removed, failed device checks, support tickets, and time required to revoke a session.

## The controls that carry the first year

Identity is the starting point. Central authentication, MFA, lifecycle management, and clean role definitions support everything that follows. If terminated users keep active accounts or service accounts have unknown owners, a new access proxy will inherit the problem.

Endpoint state comes next. The policy needs reliable signals about device ownership, encryption, patch level, and security tooling. Decide what happens when those signals are missing. Blocking every unknown device may be correct for administration and impossible for a public customer service.

ZTNA can replace broad remote network access with application-specific access. Network segmentation limits movement for traffic that remains inside the estate. SIEM and endpoint detection help the team investigate the decisions and activity around a session.

Each control needs an owner. "Continuous verification" means little if nobody maintains the policy or responds to the signal.

## Where implementations get stuck

Legacy applications are the usual obstacle. Some depend on fixed IP addresses, shared credentials, old protocols, or broad network discovery. Hiding those requirements behind a new product creates exceptions that may become permanent.

User friction is another real cost. Repeated prompts, broken applications, and slow access drive people toward workarounds. Apply stronger checks when the risk changes instead of interrupting every low-risk action.

Finally, do not migrate a messy access model unchanged. Reproducing hundreds of broad VPN groups in a ZTNA portal gives the old design a new interface.

## My test for progress

I would not measure Zero Trust progress by licenses purchased or users enrolled. I would ask:

- Can a compromised user reach fewer systems than before?
- Does privileged access expire without manual cleanup?
- Can the team explain why a session was allowed?
- Can responders revoke access quickly?
- Are exceptions visible, owned, and reviewed?

If those answers improve, the architecture is moving in the right direction. If the dashboard looks modern but access remains broad and permanent, it is still the perimeter model underneath.

## References

- [NIST SP 800-207: Zero Trust Architecture](https://csrc.nist.gov/publications/detail/sp/800-207/final)
- [CISA Zero Trust Maturity Model](https://www.cisa.gov/resources-tools/resources/zero-trust-maturity-model)
