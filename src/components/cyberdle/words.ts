// Cyberdle answer pool. Every word is exactly 5 letters and security-relevant.
// `clue` is the "intel" shown once the puzzle is finished - keeps the game educational.

export interface CyberWord {
	word: string;
	clue: string;
}

export const WORD_LENGTH = 5;
export const MAX_GUESSES = 6;

export const WORDS: readonly CyberWord[] = [
	{ word: 'NONCE', clue: 'Number used once - added before hashing/encryption to defeat replay attacks.' },
	{ word: 'PROXY', clue: 'An intermediary that forwards traffic; forward and reverse proxies sit between client and server.' },
	{ word: 'TOKEN', clue: 'A credential (JWT, session, or hardware OTP) that proves identity or access.' },
	{ word: 'VIRUS', clue: 'Malware that attaches to files and self-replicates when the host program runs.' },
	{ word: 'SPOOF', clue: 'Faking an identity - IP, email, ARP, or caller-ID - to impersonate a trusted source.' },
	{ word: 'PHISH', clue: 'A social-engineering email or site that lures victims into leaking credentials.' },
	{ word: 'CRACK', clue: 'Recovering passwords or keys via brute force, dictionary, or rainbow tables.' },
	{ word: 'VAULT', clue: 'A hardened store for secrets, keys, and credentials (e.g., HashiCorp Vault).' },
	{ word: 'PATCH', clue: 'A software update that closes a known vulnerability.' },
	{ word: 'SHELL', clue: 'Command-line access to a host; a reverse shell is a classic post-exploitation goal.' },
	{ word: 'CACHE', clue: 'Stored copies kept for speed - poisoning it can serve malicious content.' },
	{ word: 'STACK', clue: 'Memory region for function calls; the classic target of buffer-overflow exploits.' },
	{ word: 'AUDIT', clue: 'A systematic review of controls, configs, and logs against a standard.' },
	{ word: 'TRUST', clue: 'Confidence in an identity or device - "never trust, always verify" in Zero Trust.' },
	{ word: 'ASSET', clue: 'Anything of value worth protecting - data, systems, or people.' },
	{ word: 'GRANT', clue: 'To assign a permission or privilege to a principal.' },
	{ word: 'BLOCK', clue: 'A firewall/ACL action that drops traffic which is not allowed.' },
	{ word: 'ALLOW', clue: 'A firewall/ACL action that permits matching traffic through.' },
	{ word: 'CYBER', clue: 'The prefix for the domain of computer and network security.' },
	{ word: 'BYTES', clue: 'Eight-bit units of data - the currency of payloads and shellcode.' },
	{ word: 'LOGIN', clue: 'The authentication step where a user presents credentials.' },
	{ word: 'ADMIN', clue: 'A privileged account - the prime target for privilege escalation.' },
	{ word: 'FLAGS', clue: 'Hidden tokens you capture to score in a CTF challenge.' },
	{ word: 'PORTS', clue: 'Numbered service endpoints (0–65535) that scanners enumerate.' },
	{ word: 'SCANS', clue: 'Probing hosts and ports to map the attack surface (e.g., with Nmap).' },
	{ word: 'ZONES', clue: 'Network segments separated by trust level - DMZ, internal, and so on.' },
	{ word: 'DEBUG', clue: 'Inspecting a running program - essential for reversing and exploit development.' },
	{ word: 'FRAME', clue: 'An embedded page; abused in clickjacking via invisible overlays.' },
	{ word: 'HONEY', clue: 'As in honeypot - a decoy system that lures and studies attackers.' },
	{ word: 'WORMS', clue: 'Self-propagating malware that spreads across networks without a host file.' },
	{ word: 'SNORT', clue: 'A classic open-source network intrusion detection system (IDS).' },
	{ word: 'SALTS', clue: 'Random data added to passwords before hashing to defeat rainbow tables.' },
	{ word: 'CERTS', clue: 'Digital certificates that bind identities to public keys (X.509 / TLS).' },
	{ word: 'CISCO', clue: 'The networking giant whose IOS devices anchor many enterprise perimeters.' },
	{ word: 'CLOUD', clue: 'Shared-responsibility computing; you and the provider split the security duties.' },
	{ word: 'LAYER', clue: 'A tier of the stack; attacks and defenses exist at every OSI layer.' },
	{ word: 'DEPTH', clue: 'Defense in depth: overlapping controls so one breach does not sink you.' },
	{ word: 'LEAST', clue: 'Least privilege - grant only the access a task truly needs.' },
	{ word: 'MODEL', clue: 'Threat modeling maps assets, threats, and mitigations before you build.' },
	{ word: 'RISKS', clue: 'Likelihood times impact - the heart of risk management.' },
	{ word: 'ALERT', clue: 'A SIEM or IDS signal that something suspicious just happened.' },
	{ word: 'RULES', clue: 'Firewall and detection rules decide what gets blocked or flagged.' },
	{ word: 'ROLES', clue: 'In RBAC, roles bundle permissions and are assigned by job function.' },
	{ word: 'SCOPE', clue: 'In OAuth, the exact set of permissions a token is allowed to use.' },
	{ word: 'CLAIM', clue: 'A piece of identity data (id, role, expiry) carried inside a JWT.' },
	{ word: 'OAUTH', clue: 'The delegated-authorization standard behind "Sign in with…" buttons.' },
	{ word: 'CREDS', clue: 'Slang for credentials: usernames, passwords, keys, and tokens.' },
	{ word: 'ROUND', clue: 'One mixing iteration of a block cipher; AES uses 10 to 14 of them.' },
	{ word: 'PRIME', clue: 'Large primes underpin RSA and Diffie-Hellman key exchange.' },
	{ word: 'CRYPT', clue: 'Short for encryption - turning plaintext into ciphertext.' },
	{ word: 'ASCII', clue: 'The character encoding attackers lean on when crafting payloads.' },
	{ word: 'REGEX', clue: 'Regular expressions drive detection signatures (and ReDoS attacks).' },
	{ word: 'CHMOD', clue: 'The Unix command that sets a file permission bits.' },
	{ word: 'UMASK', clue: 'The mask that decides default permissions on newly created files.' },
	{ word: 'GROUP', clue: 'A set of users that shares one bundle of permissions.' },
	{ word: 'USERS', clue: 'Accounts on a system; every one is a potential way in.' },
	{ word: 'LINUX', clue: 'The dominant server OS; hardening it is core blue-team work.' },
	{ word: 'VLANS', clue: 'Virtual LANs slice one switch into isolated broadcast domains.' },
	{ word: 'ROUTE', clue: 'A routing-table entry; tampering with it redirects traffic.' },
	{ word: 'RELAY', clue: 'A forwarding hop, abused in NTLM-relay and open-mail-relay attacks.' },
	{ word: 'ONION', clue: 'Onion routing wraps traffic in layers of encryption - the basis of Tor.' },
	{ word: 'NODES', clue: 'Endpoints on a network or cluster; each one needs defending.' },
	{ word: 'HOSTS', clue: 'The hosts file maps names to IPs; malware poisons it to hijack domains.' },
	{ word: 'PINGS', clue: 'ICMP echo requests used to find live hosts - a ping sweep.' },
	{ word: 'TRACE', clue: 'Traceroute maps network hops; a stack trace maps code paths.' },
	{ word: 'IPSEC', clue: 'A protocol suite that encrypts and authenticates IP traffic (VPNs).' },
	{ word: 'HTTPS', clue: 'HTTP wrapped in TLS: encrypted, authenticated web traffic.' },
	{ word: 'FLOOD', clue: 'Drowning a target in traffic, as in a SYN or UDP flood (DoS).' },
	{ word: 'SPRAY', clue: 'Password spraying tries one common password across many accounts.' },
	{ word: 'SNIFF', clue: 'Capturing packets off the wire to read or steal their contents.' },
	{ word: 'SMASH', clue: '"Smashing the stack" - the classic buffer-overflow technique.' },
	{ word: 'HOOKS', clue: 'Intercepting function or API calls; used by rootkits and EDR alike.' },
	{ word: 'WIPER', clue: 'Destructive malware that erases data instead of ransoming it.' },
	{ word: 'MINER', clue: 'Cryptojacking malware that mines coins using the host CPU and GPU.' },
	{ word: 'MACRO', clue: 'Document scripts such as VBA, abused to deliver malware.' },
	{ word: 'LOGIC', clue: 'A logic bomb is malicious code that fires when a condition is met.' },
	{ word: 'RECON', clue: 'Reconnaissance: gathering target intel before striking.' },
	{ word: 'PROBE', clue: 'Actively poking a service to learn its version or behavior.' },
	{ word: 'HYDRA', clue: 'THC-Hydra, a fast tool for brute-forcing network logins.' },
	{ word: 'INPUT', clue: 'Unvalidated input is the root cause of most injection bugs.' },
	{ word: 'QUERY', clue: 'A database request; a crafted one enables SQL injection.' },
	{ word: 'CLICK', clue: 'Clickjacking tricks users into clicking hidden, attacker-owned UI.' },
	{ word: 'SCAMS', clue: 'Fraud schemes that con victims out of money or data.' },
	{ word: 'FRAUD', clue: 'Deception for gain - a core driver of cybercrime.' },
	{ word: 'THEFT', clue: 'Stealing data, identities, or credentials.' },
	{ word: 'LEAKS', clue: 'Unintended exposure of sensitive information.' },
	{ word: 'SPAMS', clue: 'Bulk unsolicited messages, often carrying phishing or malware.' },
	{ word: 'FLAWS', clue: 'Weaknesses in design or code that attackers exploit.' },
	{ word: 'IMAGE', clue: 'A byte-for-byte forensic disk image - or a container image.' },
	{ word: 'CHAIN', clue: 'Chain of custody in forensics; the kill chain in attack modeling.' },
	{ word: 'CARVE', clue: 'File carving rebuilds files from raw data using their signatures.' },
	{ word: 'WIPED', clue: 'Securely erased data - the goal of decommissioning and anti-forensics.' },
	{ word: 'DECOY', clue: 'A fake asset planted to detect and mislead intruders.' },
	{ word: 'BADGE', clue: 'A physical access card; cloning one defeats door security.' },
	{ word: 'ECDSA', clue: 'Elliptic-curve digital signatures used in TLS and crypto wallets.' },
	{ word: 'BLAKE', clue: 'The BLAKE2 and BLAKE3 family of fast cryptographic hash functions.' },
	{ word: 'ENTRY', clue: 'A log line - or the initial foothold of an intrusion.' },
	{ word: 'GUARD', clue: 'A control that watches over and protects an asset.' },
	{ word: 'ARMOR', clue: 'Hardening that shields systems; AppArmor confines Linux apps by profile.' },
	{ word: 'AGENT', clue: 'Endpoint software (EDR/AV) - or the threat actor behind an attack.' },
	{ word: 'ACTOR', clue: 'A threat actor: the person or group behind an attack.' },
	{ word: 'WHITE', clue: 'As in white-hat: an ethical hacker who breaks in with permission.' },
	{ word: 'BLACK', clue: 'As in black-hat: an attacker acting illegally for personal gain.' },
	{ word: 'RANGE', clue: 'A cyber range: a safe, simulated arena to practice attack and defense.' },
	{ word: 'TABLE', clue: 'As in rainbow table: precomputed hashes used to reverse passwords.' },
	{ word: 'SHIMS', clue: 'Compatibility shims, abused by malware for stealthy persistence.' },
	{ word: 'TASKS', clue: 'Scheduled tasks - a favourite Windows persistence mechanism.' },
	{ word: 'EVENT', clue: 'Any observable system occurrence; correlated events become alerts.' },
	{ word: 'NOISE', clue: 'Benign activity and false positives that hide real attacks.' },
	{ word: 'PIVOT', clue: 'Using a compromised host to reach deeper into the network.' },
	{ word: 'CREEP', clue: 'Privilege creep: access that piles up over time and is never revoked.' },
	{ word: 'PERMS', clue: 'Slang for permissions; misconfigured perms cause many cloud breaches.' },
	{ word: 'CROWN', clue: 'As in crown jewels: the most critical, must-protect assets of an org.' },
	{ word: 'BLAST', clue: 'Blast radius: how far damage spreads from one compromise.' },
	{ word: 'TRAPS', clue: 'Decoys and tarpits that detect or slow down intruders.' },
	{ word: 'BRICK', clue: 'To render a device permanently unusable, e.g., via bad firmware.' },
	{ word: 'CLONE', clue: 'Duplicating a token, card, or system - like cloning an access badge.' },
	{ word: 'FORGE', clue: 'Crafting a fake token, cookie, or request to impersonate a user.' },
	{ word: 'THUMB', clue: 'A thumb drive; dropped USBs are a classic social-engineering trick.' },
	{ word: 'DRIVE', clue: 'A drive-by download infects you just by visiting a page.' },
	{ word: 'WATER', clue: 'A watering-hole attack poisons a site the victims already trust.' },
	{ word: 'WHALE', clue: 'Whaling: spear phishing aimed at executives and other big targets.' },
	{ word: 'VOICE', clue: 'As in vishing: phishing carried out over a voice call.' },
	{ word: 'SMISH', clue: 'Smishing: phishing delivered through SMS text messages.' },
	{ word: 'LURES', clue: 'The hooks - urgency, rewards, fear - that make phishing work.' },
	{ word: 'HUMAN', clue: 'Often the weakest link; social engineering targets people, not code.' },
	{ word: 'ROTOR', clue: 'The spinning wheels of cipher machines like Enigma that scrambled text.' },
	{ word: 'SHIFT', clue: 'A shift (Caesar) cipher rotates each letter by a fixed amount.' },
	{ word: 'PLAIN', clue: 'As in plaintext: the message before encryption, or after it is cracked.' },
	{ word: 'SEEDS', clue: 'Values that seed random generators; predictable ones break crypto.' },
	{ word: 'LOGON', clue: 'The Windows sign-in process, whose tokens are prime theft targets.' },
	{ word: 'RESET', clue: 'Password-reset flows are a frequent route to account takeover.' },
	{ word: 'EMAIL', clue: 'The number-one delivery channel for phishing and malware.' },
	{ word: 'SOCKS', clue: 'A proxy protocol attackers use to tunnel and pivot traffic.' },
	{ word: 'BINDS', clue: 'A bind shell opens a port on the victim for the attacker to dial in.' },
	{ word: 'PCAPS', clue: 'Packet-capture files analysts dissect to investigate traffic.' },
	{ word: 'PWNED', clue: 'Hacker slang for compromised - as in "Have I Been Pwned".' },
	{ word: 'CRASH', clue: 'A crash often signals an exploitable memory-corruption bug.' },
	{ word: 'HEAPS', clue: 'The heap: dynamic memory targeted by heap-overflow exploits.' },
	{ word: 'SLEDS', clue: 'As in NOP sled: padding that slides execution into shellcode.' },
	{ word: 'BUILD', clue: 'The build pipeline; poisoning it is a classic supply-chain attack.' },
	{ word: 'CISSP', clue: 'A flagship security certification spanning eight knowledge domains.' },
	{ word: 'MUTEX', clue: 'A lock object; malware sets one to avoid reinfecting a host.' },
	{ word: 'HUNTS', clue: 'Threat hunting proactively searches for adversaries already inside.' },
	{ word: 'PARSE', clue: 'Turning raw logs into structured fields a SIEM can search.' },
	{ word: 'STATE', clue: 'The OAuth "state" value that ties a callback to its request (anti-CSRF).' },
	{ word: 'QUBIT', clue: 'The quantum bit; enough of them could break modern RSA and ECC.' },
	{ word: 'GUEST', clue: 'Default guest accounts are easy footholds if left enabled.' },
	{ word: 'SHARE', clue: 'Network file shares; open ones leak data and spread ransomware.' },
	{ word: 'ABUSE', clue: 'Abuse cases: how a feature can be misused - the flip side of use cases.' }
];

// Deterministic "puzzle of the day" so every visitor sees the same word.
// The day rolls over at midnight IST (UTC+05:30), regardless of the viewer's
// own timezone, so the daily word is consistent for an Indian audience.
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000; // +05:30
const EPOCH_IST = Date.UTC(2026, 0, 1); // 2026-01-01 00:00 IST baseline
const DAY_MS = 86_400_000;

export function getDayNumber(now: Date = new Date()): number {
	const istMs = now.getTime() + IST_OFFSET_MS;
	return Math.floor((istMs - EPOCH_IST) / DAY_MS);
}

export function getDailyPuzzle(now: Date = new Date()): { puzzleNumber: number; answer: CyberWord } {
	const dayNumber = getDayNumber(now);
	const index = ((dayNumber % WORDS.length) + WORDS.length) % WORDS.length;
	return { puzzleNumber: dayNumber + 1, answer: WORDS[index]! };
}

// Milliseconds until the next puzzle (next midnight IST).
export function msUntilNextPuzzle(now: Date = new Date()): number {
	const istMs = now.getTime() + IST_OFFSET_MS;
	const nextIstMidnight = (getDayNumber(now) + 1) * DAY_MS + EPOCH_IST;
	return nextIstMidnight - istMs;
}
