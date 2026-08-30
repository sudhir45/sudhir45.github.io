---
title: "Is Zscaler the Right Move for a Large IT Company?"
pubDate: 2025-04-26
updatedDate: 2026-08-30
description: "A buyer's guide to evaluating Zscaler for a large Indian IT company, including rollout work, costs, failure cases, and proof-of-concept tests."
author: "Sudhir"
isPinned: false
excerpt: "A buyer's guide to evaluating Zscaler for a large Indian IT company, including rollout work, costs, failure cases, and proof-of-concept tests."
tags: ["Network security"]
---

Zscaler is often introduced as a replacement for VPNs, secure web gateways, and parts of the on-premises security stack. That description is directionally correct and still too simple for a purchasing decision.

For a large Indian IT company, the hard part is not routing a pilot group through the service. It is migrating thousands of users, inspecting traffic without breaking client applications, mapping private applications, handling data requirements, and supporting people across offices and home networks.

The right question is not whether Zscaler has the required feature. Ask whether it improves a defined access path at an acceptable cost and whether your team can operate it.

This is a buyer's evaluation framework, not a production review of my own Zscaler deployment. Product capability statements should be checked against the current contract, documentation, and proof of concept.

## What the main products do

Zscaler Internet Access routes user internet traffic through Zscaler's cloud service. Depending on the license and policy, it can provide secure web gateway, firewall, sandboxing, data loss prevention, cloud application control, and TLS inspection.

Zscaler Private Access connects an authenticated user to an authorized private application. It avoids placing the user on the wider network in the way a traditional remote-access VPN often does. App Connectors create outbound connections near private applications, which reduces the need to expose inbound services.

Zscaler Digital Experience measures parts of the path between a user's device and an application. It can help separate endpoint, local network, provider, and application problems during support investigations.

These products share policy and telemetry, but they solve different problems. A company that needs internet filtering does not automatically need to replace every VPN connection with ZPA.

## Where the business case can work

The strongest case is a large, distributed workforce using SaaS and private applications from many locations. Backhauling all traffic through a data centre can add latency and force the company to maintain more network capacity.

ZIA can move internet inspection closer to users. ZPA can reduce the number of private resources visible to a remote user. Central policy may also replace several regional gateways and their maintenance work.

Those benefits need measurement. Compare application latency, help-desk volume, security coverage, appliance and circuit costs, operational effort, and the number of resources reachable from a user session. Do not build the case from license consolidation alone.

## What the rollout requires

Start with identity and application inventory. ZPA policy depends on knowing who needs each application, how the application identifies traffic, and which supporting services it uses. Old applications may depend on IP addresses, shared services, or broad network discovery.

For endpoint traffic, most remote-user deployments rely on Zscaler Client Connector. Plan distribution, upgrades, diagnostics, tamper protection, and coexistence with endpoint security software. Decide what happens when the client cannot connect to the service.

TLS inspection deserves its own workstream. Certificate pinning, custom trust stores, mutual TLS, privacy requirements, and poorly implemented applications can all create exceptions. Every bypass reduces inspection coverage, so record an owner and review date rather than letting the exclusion list grow silently.

A phased rollout should move a representative pilot first. Include developers, administrators, call-centre users, users with poor home connectivity, and teams that handle client data. A pilot made only of cooperative security staff will miss the problems that dominate a large deployment.

## The India-specific questions

Large Indian IT companies often support global clients, operate from several Indian cities, and employ a mix of office, remote, and travelling users. Test the service from the locations and providers your staff use. A nearby service edge does not guarantee a fast path to every application.

Data handling also needs legal and contractual review. Identify which logs and content the service processes, where the relevant data is stored, who can access it, and how retention works. Map those answers to client contracts and applicable law, including the Digital Personal Data Protection Act where relevant.

Some Indian firms also deliver managed security services to clients. Keep the internal deployment decision separate from the commercial partnership. Being able to resell or implement a product does not prove it is the best fit for your own workforce.

## Cost is more than price per user

Zscaler normally sells subscriptions by user and feature bundle. Public list pricing is not a reliable basis for a large purchase, so obtain comparable quotes for the same scope and term.

Model these costs:

- ZIA, ZPA, ZDX, and required add-ons
- Implementation partner and migration work
- Internal application discovery and remediation
- Endpoint deployment and support
- Logging export, SIEM ingestion, and retention
- Parallel operation while old VPNs or proxies remain active
- Training and ongoing policy administration
- Exit work if the company changes provider later

Multi-year discounts can improve the commercial offer while increasing lock-in. Agree on service levels, support escalation, data export, and renewal terms before the migration makes switching expensive.

## When I would not choose it

A smaller company with a manageable firewall and VPN estate may not recover the subscription and migration cost. A lighter SSE or SASE service may cover the required controls.

An application estate full of certificate pinning, fixed-IP assumptions, and unsupported protocols can create so many bypasses that the intended security model never appears. Fixing those applications may still be worthwhile, but it belongs in the programme cost.

Latency-sensitive or non-user traffic also needs separate treatment. Voice, trading, industrial systems, server-to-server flows, and bulk transfers should be tested rather than pushed through a user-access design by default.

Finally, do not select Zscaler without comparing it with the alternatives that match your scope. Netskope, Palo Alto Prisma Access, Cato Networks, and other providers overlap in different ways. Use the same traffic, applications, and success measures for each proof of concept.

## A proof of concept that can fail honestly

Test enough of the real environment to expose weaknesses:

1. Route users from several Indian locations and network providers.
2. Include SaaS, private web applications, thick clients, developer tools, and an application with certificate pinning.
3. Test normal access, loss of connectivity, client upgrade, and policy rollback.
4. Measure latency and support effort before and after the change.
5. Confirm which private resources a compromised user session can discover and reach.
6. Export logs to the production SIEM and investigate a test event.
7. Review every bypass and manual exception created during the pilot.

Define pass and fail thresholds before the vendor demonstrates the product. Otherwise, a polished dashboard can turn every result into a success.

### A sample scorecard

Score the same measures for the current design and every shortlisted provider:

| Measure | Baseline | Pass condition |
| --- | --- | --- |
| Median sign-in to usable private application | Record by location | No material regression at tested locations |
| Private resources reachable by a standard user | Record VPN reachability | Only approved applications are reachable |
| Applications requiring TLS bypass | Record current exclusions | Every bypass has an owner and accepted reason |
| Client failures after upgrade | Record pilot incidents | Below the support threshold agreed before testing |
| Time to revoke a user session | Measure current process | Meets the incident-response target |
| Events available in the SIEM | List required fields | Required identity, policy, device, and action fields arrive |

Replace the qualitative pass conditions with numbers before the pilot. The table should make a weak result visible, not help the project justify a decision already made.

## My decision rule

Zscaler is a strong candidate when broad VPN access and central internet backhaul are measurable problems for a large distributed workforce. It is a poor answer to an undefined goal called "move to Zero Trust."

I would buy only after the proof of concept shows fewer reachable private resources, acceptable application performance, manageable TLS exceptions, usable logs, and a support model the operations team trusts.

## Useful resources

- [Zscaler Internet Access](https://www.zscaler.com/products/zscaler-internet-access)
- [Zscaler Private Access](https://www.zscaler.com/products/zscaler-private-access)
- [Zscaler Digital Experience](https://www.zscaler.com/products/zscaler-digital-experience)
- [Zscaler and Wipro case study](https://www.zscaler.com/customers/wipro)
- [Infosys Zscaler offering](https://www.infosys.com/services/cyber-security/offerings/zscaler-security-solution.html)
- [Persistent Systems and Zscaler partnership](https://www.persistent.com/media/press-releases/persistent-achieves-zenith-tier-partnership-with-zscaler/)
