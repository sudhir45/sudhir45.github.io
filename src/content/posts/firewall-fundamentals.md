---
title: "Firewalls: What They Enforce and How to Deploy Them"
pubDate: 2025-04-11
updatedDate: 2026-08-30
description: "A practical guide to firewall types, deployment boundaries, management access, rule design, logging, and maintenance."
author: "Sudhir"
isPinned: false
excerpt: "A practical guide to firewall types, deployment boundaries, management access, rule design, logging, and maintenance."
tags: ["Network security"]
---

A firewall makes a policy decision about traffic. It examines information such as source, destination, protocol, connection state, application, user, or content, then allows, rejects, or records the connection.

That definition sounds simple. The difficult work is deciding where to enforce policy, writing rules that reflect a real business need, and maintaining them after applications and networks change.

## What different firewalls can see

Packet filters evaluate network and transport headers such as IP addresses, protocols, and ports. Stateful firewalls also track connections, which lets them distinguish return traffic from an unsolicited packet.

Proxy firewalls terminate a connection and create another connection to the destination. This allows deeper protocol inspection, but it adds processing and may affect application compatibility.

Next-generation firewalls combine stateful inspection with application identification, intrusion prevention, URL filtering, identity context, and other controls. Those labels do not guarantee equal capability. Test the protocols, encrypted traffic, throughput, and evasions that matter in your environment.

Host firewalls enforce policy on an endpoint or server. Cloud-native firewalls and security groups enforce policy within cloud networks. A mature design often uses several of these controls because no single device sees every path.

## Put enforcement at meaningful boundaries

The internet edge remains an important boundary, but it is not the only one. Public services should sit in a separate zone with limited paths to internal systems. Management networks need stricter access than ordinary user networks. Production, development, and corporate endpoints should not communicate freely.

Segmentation reduces the damage after one system is compromised. The design should answer a concrete question: if this workload is taken over, which systems can it reach next?

A three-legged firewall can separate internet, internal, and DMZ traffic on one appliance or cluster. A design with separate outer and inner firewalls can create another control boundary, but it also adds cost and routing complexity. Two devices do not help much if they use the same broad policy and the same administrative failure path.

In cloud environments, map the traffic before choosing the control. Internet ingress, workload-to-workload traffic, administrator access, and traffic between cloud and on-premises networks may require different enforcement points.

## Design for failure and maintenance

Firewalls are part of the network path, so availability matters. High-availability pairs can reduce downtime from appliance failure or maintenance. Active-passive designs are usually simpler. Active-active designs can use more capacity but make state synchronization and troubleshooting harder.

Test failover under load. Confirm that routing, NAT, VPNs, sessions, and logging behave as expected. A green status icon does not prove that applications survive the transition.

Back up configurations before changes and test restoration. Keep software versions within vendor support and follow security advisories. Expose management only through a restricted path.

## Write rules a future engineer can understand

Start with deny by default, then permit required traffic. A rule should identify a narrow source, destination, service or application, owner, reason, and review date.

Broad outbound access deserves the same scrutiny as inbound access. Malware, stolen credentials, and misconfigured services often need an outbound path to cause harm.

Rule order matters on platforms that evaluate from top to bottom. A broad rule can make a narrower rule unreachable. Duplicate objects and stale address groups can hide the real effect of a policy.

Before adding a rule, check whether an existing rule already permits the flow. After adding it, verify the expected traffic and confirm that unrelated traffic remains blocked.

### A rule that says what it permits

Suppose a payroll application subnet at `10.20.14.0/24` needs PostgreSQL access to `10.40.8.15`.

A weak rule might permit TCP 5432 from any internal source to the entire database subnet. That makes the application work, but it also gives every compromised internal host the same path.

The narrower policy is:

```text
source:      10.20.14.0/24
destination: 10.40.8.15
service:     TCP 5432
action:      allow and log
owner:       Payroll service owner
review:      2026-12-31
```

Test from the application subnet and from a source that should be denied. Then confirm that the log identifies the rule, source, destination, and action. The rule is not finished until both tests match the intended policy.

## Protect the management plane

Use a dedicated management network or controlled administrative path. Disable unused services and insecure protocols. Prefer named accounts, centralized authentication, MFA, and roles that separate viewing, policy changes, and system administration.

Send authentication and configuration events to a central log system. Alert on new administrators, policy installation, disabled logging, failed logins, and changes outside approved windows.

Do not place an HTTP or SSH management interface on the public internet. If emergency remote access is necessary, put it behind an authenticated gateway with logging and a defined expiry.

## Log with a question in mind

Logging every connection can be expensive and noisy. Decide what the logs must answer during operations, detection, and investigation.

At minimum, retain policy changes, administrator activity, system events, threat detections, and traffic at important boundaries. Log denies where they help identify scanning, broken applications, or policy mistakes. Log allows for sensitive services and egress paths.

Make sure timestamps are synchronized and the log record identifies the rule that made the decision. A large archive of events is not useful if an analyst cannot connect traffic to policy.

## Review the policy as the network changes

Quarterly review is common, but high-change environments may need continuous analysis plus scheduled owner confirmation.

Look for:

- Rules with no owner or business reason
- Unused, expired, duplicate, and shadowed rules
- Any-to-any access and oversized address groups
- Temporary access that never expired
- Disabled logging on sensitive rules
- Objects that point to retired systems
- Differences between the approved change and the deployed policy

Traffic counters help, but they are not proof that a rule is unnecessary. Consider seasonal work, disaster recovery, and infrequent batch jobs before removal.

## Where identity-aware controls fit

Zero Trust does not eliminate firewalls. It reduces reliance on network location and adds identity, device state, and resource-specific access decisions. Firewalls still segment networks, inspect traffic, and limit paths that identity-aware controls do not cover.

Firewall as a Service can move enforcement into a provider's network for distributed users and branches. Policy as code can put changes through version control and automated checks. AI-labelled features may help summarize events or suggest policy changes, but they need the same review as any other automation.

## A practical health check

Choose one important application and trace every required flow. For each enforcement point, confirm the rule, owner, logs, and last review. Then test whether an unrelated source can reach the same destination.

That exercise reveals more about firewall health than a feature list. The appliance can be current and fully licensed while the policy remains impossible to explain.

## References

- [NIST SP 800-41 Rev. 1: Guidelines on Firewalls and Firewall Policy](https://csrc.nist.gov/publications/detail/sp/800-41/rev-1/final)
- [NIST SP 800-207: Zero Trust Architecture](https://csrc.nist.gov/publications/detail/sp/800-207/final)
- [PCI DSS document library](https://www.pcisecuritystandards.org/document_library/)
- [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks/)
