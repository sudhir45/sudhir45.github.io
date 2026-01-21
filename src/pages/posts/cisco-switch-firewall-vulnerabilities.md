---
layout: ../../layouts/post.astro
title: "Recent Cisco Switch & Firewall Vulnerabilities"
pubDate: 2025-10-04
description: "Critical IOS XE vulnerabilities are being actively exploited, patch immediately. Click to read more"
author: "Sudhir"
isPinned: false
excerpt: "Critical IOS XE vulnerabilities are being actively exploited, patch immediately. Click to read more"
tags: ["Cisco", "Vulnerability", "Switch", "Firewall", "Security"]
---

If you manage Cisco gear like switches, routers, firewalls; this one's serious.
Multiple **critical vulnerabilities** in Cisco IOS XE have been actively exploited, allowing attackers to **gain full admin control** over network devices *without authentication*.

We're not talking about lab PoCs or script-kiddy exploits here. Cisco has confirmed **real-world compromises** where attackers implanted persistent malware directly on production devices.

If you haven't patched or locked down your management interfaces yet, stop reading this on your production network and go check.
Here's exactly what's going on -

---

## De-Jargoning: Key Concepts

Before diving into configs and CVEs, let's understand some things first
- **IOS XE** - Cisco's OS for enterprise switches, routers, and wireless controllers. If you're running Catalyst 9300s, ISR routers, or 9800 WLCs - that's IOS XE.
- **Web UI (HTTP/HTTPS server)** - The graphical interface you use to manage the device from a browser. It's convenient… until someone from the internet logs in as admin without your permission.
- **Privilege escalation** - Attacker starts as "nobody," ends as "god." Enough said.
- **Implant** - A malicious script or process that lives *inside* the system to maintain access and control, even after reboot.

So, what's new? Attackers found a way to **create admin users** and **install custom implants** through the web UI.
No creds. No MFA. Just one HTTP request and boom - full control.

---

## The Attack Explained

Two major vulnerabilities kicked this off:

- **CVE-2023-20198** - Allows attackers to create arbitrary user accounts with privilege level 15 (full admin) on IOS XE systems with the HTTP/HTTPS Server feature enabled.
- **CVE-2023-20273** - Used in conjunction with the above to deploy persistent implants using Lua scripts.

In plain terms:
If your management web interface is reachable from the internet and running an unpatched IOS XE version, attackers can send a crafted HTTP request, create a new admin account, then upload and execute code that lives inside your system.

Here's what Cisco confirmed they found in the wild:

- Rogue user accounts like `cisco_tac_admin`, `cisco_support`, or random usernames
- Custom Lua-based implants that survive reloads
- Unauthorized configuration changes in `running-config`

These implants can run arbitrary commands, intercept traffic, and even hide their presence.
It's a nightmare scenario for network admins.

---

## Am I Vulnerable?

If any of these are true, assume you're vulnerable and act immediately:

1. You're running **IOS XE** (e.g., Catalyst 3650/3850, 9000, ISR 4000, WLC 9800, etc.)
2. You have **HTTP or HTTPS server enabled**
3. That interface is **reachable from outside your LAN** (public IP or NAT)
4. You haven't patched since **Cisco's latest fixed versions (Sept-Oct 2025)**
5. You're unsure which version you're on

---

## Verification & Identification Commands

### 1. Check if the Web UI Is Enabled
```bash
show running-config | include http
```

Look for:

```bash
ip http server
ip http secure-server
```
If either is present, the web UI is active.

To check if it's bound to public interfaces:

```bash
show ip interface brief
```

Compare with NAT or firewall rules - if external users can hit port 80 or 443, you're exposed.

### 2. Check the IOS XE Version

```bash
show version | include Version
```
Compare this against Cisco's [Official advisory](https://tools.cisco.com/security/center/publicationListing.x). Find your exact model and see if your version is affected or fixed.

### 3. Hunt for Rogue Admin Accounts

```bash
show running-config | include username
```
If you see something like:

```bash
username cisco_tac_admin privilege 15 secret <hash>
```
and you didn't create it - you've likely been compromised.

### 4. Look for Implant Indicators

```bash
show running-config | include lua
dir harddisk:/ | include lua
dir flash:/ | include lua
```

Any Lua script references are a red flag. Some confirmed implant filenames:
```bash
/usr/binos/conf/nginx-conf/cisco_service.lua
/usr/binos/scripts/sys_report.lua
```

### 5. Review System Logs

```bash
show logging | include HTTP|user|auth
```
Look for unknown IPs accessing the web UI or creating new users.

### 6. Check for Unexpected Processes

```bash
ps
```
You may see unfamiliar processes tied to Lua or nginx serving custom scripts.

If you spot any of these - isolate the device immediately from the network and escalate.

## Have I Been Hacked?

### 1. Identify unauthorized users

```bash
show running-config | include username
```

Remove any unknown accounts:
```bash
no username cisco_tac_admin
write memory
```

### 2. Inspect startup-config for persistence
```bash
show startup-config | include username
```

If rogue users appear here too, the system was compromised and the implant persisted.

### 3. Check for modified web configs

```bash
dir /all nvram: | include .conf
more system:running-config
```

Look for unusual ip http path or reverse proxy directives.

### 4. Search logs for attacker activity

```bash
show logging | include POST|GET|config
```
External IPs performing config actions are a big warning sign.

### 5. Check file system for implant traces

```bash
dir harddisk:/ | include lua
dir flash:/ | include lua
```

If found:
    - Copy files for forensic review
    - Delete them
    - Reboot into clean image after patching

## Action Plan: What to Do RIGHT NOW

This needs immediate attention, no debates there
Here's the checklist for containment, mitigation, and prevention.

### 1. Disable Web UI
```bash
conf t
no ip http server
no ip http secure-server
end
write memory
```
If you need GUI management, restrict it to a management VLAN or out-of-band network only.

### 2. Patch to Fixed Versions

Check Cisco's official advisory (search for "Cisco IOS XE Web UI privilege escalation vulnerability").
Update to the fixed IOS XE versions for your devices.

```bash
request platform software package install switch all file flash:cat9k_iosxe.BLDVERSION.bin
```

Then reload.

### 3. Remove Rogue Accounts
```bash
conf t
no username <malicious_user>
end
write memory
```

### 4. Rotate Credentials

Reset all local user passwords and any TACACS+/RADIUS secrets:
```bash
conf t
username admin secret <NewStrongPassword>
tacacs-server key <NewKey>
end
write memory
```

### 5. Restrict Management Access

Allow management from trusted hosts only:

```bash
ip access-list standard MGMT_ONLY
 permit 10.0.0.0 0.0.0.255
 deny any
!
ip http access-class MGMT_ONLY
line vty 0 4
 access-class MGMT_ONLY in
 transport input ssh
end
write memory
```

### 6. Audit & Monitor Continuously

Set up Syslog, SNMP traps, and config change alerts:

```bash
logging host <SIEM_IP>
snmp-server enable traps syslog
archive
 log config
 notify syslog
```

And make `show running-config | include username` part of your weekly hygiene routine.

## The Bigger Lesson: Preventing the Next "Big One"

Cisco will patch this. Attackers will pivot. The cycle continues.
But the root cause? Misplaced convenience.

Thing is to Never expose management interfaces directly to the internet.
Period.

Set up out-of-band management networks, or VPN-gated access for admins.
Deploy config compliance checks via Ansible, Cisco DNA Center, or your NMS of choice.

And automate your patch management workflow - waiting for a breach to test upgrades is a bad habit.

## My take:
Every Cisco breach post-mortem has the same line: "HTTP/HTTPS server was accessible from the internet."
