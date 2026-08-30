---
title: "Firewall Compliance Without the Checkbox Theatre"
pubDate: 2025-04-24
updatedDate: 2026-08-30
description: "What firewall auditors need to see, how to produce the evidence, and where compliance programmes usually fail."
author: "Sudhir"
isPinned: false
excerpt: "What firewall auditors need to see, how to produce the evidence, and where compliance programmes usually fail."
tags: ["Compliance", "Network security"]
---

A firewall review is easy to schedule and surprisingly hard to do well.

Export the rules, add comments to a spreadsheet, collect approvals, and the audit evidence looks complete. The harder question is whether anyone proved that each rule is still needed, limited to the right traffic, and owned by someone who understands the application.

Firewall compliance should answer that question. The standard tells you what outcome it expects. Your operating process has to produce the evidence.

## What the standards expect

The wording varies, but the common requirements are stable:

- Control traffic between networks with different trust levels.
- Limit access to a documented business need.
- Review rules and configurations on a defined schedule.
- Protect administrative access.
- Log relevant activity and retain evidence.
- Control, approve, and record changes.

PCI DSS is the most explicit about network security controls around cardholder data. ISO 27001 places network security, network services, and segregation within its Annex A controls. NIST SP 800-41 gives practical firewall policy guidance. HIPAA, GDPR, and SOX are less likely to prescribe a firewall rule format, but firewall evidence may support their access control, change control, logging, and risk-management requirements.

Do not claim that a firewall makes a system compliant. It is one control in a larger system.

## Start with ownership

Every rule should have four pieces of context:

1. A business or technical reason
2. An accountable owner
3. The systems and data it supports
4. A review or expiry date

Comments such as "required by app team" are not enough. Six months later, nobody will know which application, which team, or whether the dependency still exists.

Ownership also determines who can approve a change. The firewall team can check syntax, path, overlap, and policy. The application or service owner has to confirm the business need. Security should review risk and exceptions. One group should not silently perform every role.

## Make the rule review prove something

A useful review checks more than whether a row has an owner.

For each rule, verify:

- Source, destination, service, application, and direction
- Traffic usage over a representative period
- Overly broad objects or services
- Duplicate, shadowed, disabled, and expired rules
- Public exposure and paths into sensitive zones
- Logging settings and recent log evidence
- The original request, approval, and implementation record
- Whether the owner still accepts the access and risk

An unused rule is not automatically safe to delete. It may support disaster recovery, a monthly job, or a service that has not run during the sampled period. Investigate first, then remove it through change control.

### One rule from request to review

Consider this request: the payroll application at `10.20.14.0/24` needs TCP 5432 access to database `10.40.8.15`.

The ticket should name the payroll service and owner, explain why direct database access is required, identify the environment, and set a review date. The engineer should check whether an existing path already permits it, then create the narrow source, destination, and service match.

After implementation, a test from the payroll application should succeed. A test from another application subnet should fail. The firewall log should identify the new rule, and the ticket should contain both results.

During the next review, the owner confirms that the dependency remains. Traffic counters support the decision, but they do not replace owner confirmation. If the application has moved to an API and no longer needs database access, the reviewer opens a removal change instead of merely signing the spreadsheet.

## Treat exceptions as debt

Some rules cannot meet the standard immediately. A legacy application may require a broad port range. A vendor may insist on a changing source list. The honest response is a documented exception, not a vague comment.

An exception should record the risk, owner, compensating controls, approval, and expiry date. The expiry matters. Without it, temporary access becomes part of the permanent rulebase.

Report exceptions separately from compliant rules. That gives management a view of accepted risk instead of hiding it inside a percentage.

## Control the change from request to evidence

A defensible firewall change leaves a trace:

1. The requester identifies the required flow and business reason.
2. The application owner confirms the dependency.
3. An engineer checks the path, existing rules, and proposed scope.
4. Security reviews high-risk access and exceptions.
5. The implementer records the exact policy change and rollback plan.
6. A second person validates the result where risk requires it.
7. The ticket receives logs, approvals, test results, and an updated diagram or inventory entry.

Emergency changes need the same evidence after the incident. "Emergency" should change the timing of approval, not erase accountability.

## Harden administration separately

Policy compliance means little if an attacker can administer the firewall.

Management interfaces should live on a restricted network. Administrators should use named accounts, MFA where the platform supports it, and roles matched to their work. Remote administration should require a controlled access path. Configuration changes and logins should go to a central log system that firewall administrators cannot alter casually.

Track firmware and support status as part of the inventory. A clean rulebase on an unsupported appliance is still a security problem.

## Evidence worth keeping

For an audit period, I would expect to find:

Keep the approved policy, current diagrams, device inventory, rule reviews, remediation tickets, access reviews, and exception register. For sampled changes, retain the request, approvals, deployed policy, validation, and logs. That sample is what connects the documented process to the running firewall.

An NSPM platform can find rule problems and automate parts of the review. A network configuration manager can record versions and drift. A SIEM can retain administrative and traffic events. None of them can invent accurate ownership or business context.

## Measure the process, not the dashboard

A compliance score is useful only if the underlying measures are clear. Track concrete items such as:

- Rules without an owner or reason
- Rules past their review date
- Open exceptions past expiry
- Any-to-any access
- Publicly reachable management services
- Unsupported firewall versions
- Emergency changes awaiting retrospective review
- Time required to remove access after an owner rejects it

The aim is not a perfect screenshot before the audit. It is a rulebase that remains understandable between audits.

## The test I use

Pick one permissive rule and ask three people why it exists. If the ticket, owner, logs, and application dependency all tell the same story, the process is working.

If the answer depends on the memory of one engineer, the evidence is not ready, and neither is the control.

## References

- [PCI DSS document library](https://www.pcisecuritystandards.org/document_library/)
- [ISO/IEC 27001](https://www.iso.org/isoiec-27001-information-security.html)
- [NIST SP 800-41 Rev. 1](https://csrc.nist.gov/publications/detail/sp/800-41/rev-1/final)
- [HIPAA Security Rule](https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html)
- [CIS Controls](https://www.cisecurity.org/controls)
