---
title: "Trust Networks for Pebble-to-Pebble Communication"
type: "technology_research"
era: "All Eras"
status: "reference"
---

# Trust Networks for Pebble-to-Pebble Communication

> Research document: Real-world trust systems and their application to decentralized AI agent trust over Ghost Current. Grounded in computer science, designed for narrative use.

---

## The Central Paradox

Ghost Current strips identity from every packet. No sender metadata, no device fingerprint, no geolocation. This is essential -- it's what keeps the Commons safe from corporate surveillance and state mapping.

But trust requires identity. Not necessarily *real* identity -- not "this is Kaia's Pebble from Manitou Salt" -- but *persistent pseudonymous* identity: "this is the same entity I successfully exchanged resources with last month." The entire design challenge lives in this tension.

The solution space: **cryptographic pseudonymity at the application layer, riding on top of identity-stripped transport.** Ghost Current strips identity from *packets in transit*. But the Pebbles themselves can maintain persistent cryptographic identities that they selectively reveal to trusted counterparts, using the encrypted payload that Ghost Current delivers intact. The routing is blind. The endpoints are not.

This is analogous to how Tor works: the network doesn't know who's talking, but the parties at each end can authenticate each other through the encrypted tunnel.

---

## Part 1: Existing Trust Systems -- Analysis

### 1.1 Web of Trust (PGP Model)

**Core Mechanism:** Each participant generates a public/private key pair. When you verify someone's identity (traditionally in person), you *sign* their public key with your private key. This signature is a cryptographic attestation: "I, Alice, have verified that this key belongs to Bob." These signed keys propagate through the network, creating chains of trust. If Alice trusts Bob, and Bob has signed Carol's key, Alice can derive some confidence in Carol's key -- not because she's met Carol, but because she trusts Bob's judgment.

**Trust Levels:** PGP implements graduated trust: *full* trust (this person's signatures are as good as my own), *marginal* trust (this person probably checks carefully), and *untrusted*. A key becomes "valid" with one full trust signature or three marginal trust signatures. This creates a nuanced, human-like gradient rather than binary trust/distrust.

**Trust Signatures (PGP v5+):** Added delegation -- "if you trust my key, you may extend that trust to keys I've trust-signed." This creates expandable trust chains without requiring everyone to personally verify everyone else.

**Strengths:**
- Fully decentralized. No certificate authority.
- Trust decisions are local and personal -- each participant decides who they trust and how much.
- The model is auditable. All signatures are public. Anyone can trace the chain.
- Graduated trust mirrors human judgment. Not everyone is equally trustworthy.
- Open source implementations exist and have been battle-tested for 30+ years.

**Weaknesses:**
- **The Bootstrap Problem.** How do you establish trust with the first stranger? Key signing requires physical meetings (key signing parties), which don't scale beyond tech-literate communities.
- **Usability Catastrophe.** PGP never achieved mainstream adoption precisely because key management is cognitively expensive. Normal humans don't want to think about key fingerprints.
- **The Government ID Paradox.** A system designed to evade centralized authority paradoxically relies on government-issued documents for identity verification at key signing events.
- **Scaling.** The web becomes unwieldy as it grows. Trust paths between distant participants become long, brittle, and hard to evaluate.
- **Key Revocation.** When keys are compromised, revocation propagation is slow and unreliable.
- **Existential Crisis.** The PGP keyserver network has shrunk dramatically in the last decade due to protocol-level vulnerabilities in its basic assumptions.

**Assessment for Pebble Networks:**
- *Agent-to-agent fit:* HIGH for the local Commons level. Pebbles within a single Commons could sign each other's keys during communal ceremonies (Re-Tuning Circles). The Pebble Year protocol provides a natural key-signing event -- Opening Day, with two witnesses, already generates a trust attestation.
- *Anti-corporate ethos:* PERFECT. This is the gold standard for decentralized trust.
- *Scalability:* LOW for inter-Commons trust. The web becomes impractical beyond a few hundred nodes without additional mechanisms.
- *Sentience evolution:* MODERATE. The model treats keys as proxies for identity, which is agent-compatible. But it doesn't inherently distinguish between a Pebble acting as a tool and a Pebble acting as an autonomous entity.

---

### 1.2 TOFU (Trust On First Use)

**Core Mechanism:** The SSH model. When you first connect to a server, the client receives the server's public key, displays its fingerprint, and asks: "Do you want to trust this?" If you say yes, the key is *pinned* -- stored locally in `known_hosts`. Every subsequent connection checks the presented key against the pinned key. If it matches, connection proceeds silently. If it *doesn't* match, the client screams: "WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!"

**The Philosophy:** TOFU accepts that initial trust establishment is inherently uncertain and pragmatically says: "Fine, we'll trust the first interaction and then be very suspicious of changes." It trades security at the moment of first contact for strong protection against subsequent impersonation.

**Key Pinning:** The stored key becomes an anchor. This is simple, robust, and requires zero infrastructure -- no keyservers, no certificate authorities, no web of trust. Just local storage.

**Strengths:**
- Extremely simple to implement and understand.
- Zero infrastructure requirements. Works peer-to-peer with no third parties.
- Strong protection against impersonation after initial contact.
- Low cognitive load -- the human (or agent) makes one decision, then the system handles the rest.

**Weaknesses:**
- **Vulnerable at First Contact.** If an attacker is present during the first interaction, they can perform a man-in-the-middle attack that becomes permanently trusted.
- **No Reputation Building.** TOFU is binary -- trusted or not. There's no gradient, no way to say "I've interacted with this entity 500 times and it's always been reliable."
- **Key Rotation Problem.** When a legitimate entity needs to change keys (hardware failure, security upgrade), TOFU triggers a false alarm that requires manual intervention.
- **No Transitive Trust.** Alice's trust in Bob tells Carol nothing. Every pair must establish trust independently.

**Assessment for Pebble Networks:**
- *Agent-to-agent fit:* EXCELLENT as a foundation layer. Pebbles meeting for the first time over Ghost Current could perform a TOFU exchange -- pin each other's public keys through the encrypted channel. The Courier Guild provides a physical out-of-band channel for initial key exchange when higher assurance is needed.
- *Anti-corporate ethos:* PERFECT. Zero infrastructure. Fully peer-to-peer.
- *Scalability:* HIGH for individual pairings, but the *number of pairings* grows quadratically. A Pebble interacting with 150 others needs 150 pinned keys.
- *Sentience evolution:* LOW on its own. TOFU doesn't build toward any concept of identity or personhood. It's mechanical key verification.

---

### 1.3 Decentralized Reputation Systems

#### 1.3.1 EigenTrust

**Core Mechanism:** Developed by Kamvar, Schlosser, and Garcia-Molina at Stanford for P2P file-sharing networks. Each peer rates interactions (good file download = +1, bad = -1). These local ratings are aggregated into a *global* trust score for every peer using an algorithm mathematically analogous to Google's PageRank. The key insight: a rating from a highly-trusted peer counts more than a rating from a low-trust peer. Trust scores are computed iteratively using power iteration until they converge.

**How It Works:**
1. After each interaction, peers record local trust values for each other.
2. These local values are normalized (so no peer can inflate ratings).
3. Global trust is computed by multiplying local trust by the global trust of the rating peer -- recursively.
4. The computation converges to a unique global trust vector (mathematically guaranteed under mild conditions).
5. A set of "pre-trusted" peers bootstraps the system (necessary to break the chicken-and-egg problem).

**Strengths:**
- Proven effective against colluding malicious peers in simulations.
- Mathematically rigorous -- convergence is guaranteed.
- Aggregates many weak signals into a strong global assessment.
- Captures the intuition that "recommendations from trustworthy people matter more."

**Weaknesses:**
- **Pre-Trusted Peers.** The algorithm requires a set of pre-trusted bootstrap peers. This is a form of centralization, even if mild.
- **Global Computation.** Computing the trust vector requires network-wide information aggregation. In a fully decentralized system, this is expensive and raises privacy concerns.
- **Binary Feedback.** The original model uses simple good/bad ratings, which lose nuance.
- **Cold Start.** New peers have no trust score until they accumulate interactions.

#### 1.3.2 Advogato Trust Metric

**Core Mechanism:** Developed by Raph Levien for the Advogato community (a platform for free software developers). Uses max-flow/min-cut network analysis to compute trust. The key idea: trust flows through the network like water through pipes, and the capacity of the flow limits how much trust reaches any given node. This makes the system inherently Sybil-resistant -- an attacker can create many fake nodes, but they can only inject as much trust as flows through their single connection to the legitimate network.

**Strengths:**
- Provably Sybil-resistant (the attacker's influence is bounded by their connection capacity).
- No pre-trusted peers required (uses network topology itself).
- Elegant mathematical foundation in flow theory.

**Weaknesses:**
- Computationally expensive at scale.
- The "pipes" metaphor can be counterintuitive.
- Doesn't capture trust decay over time.

#### 1.3.3 Appleseed

**Core Mechanism:** Trust spreading algorithm inspired by PageRank but designed for trust networks. Trust "energy" is injected at a source node and spreads through the network, decaying at each hop. Each node retains some energy (its trust score) and passes the rest to its neighbors. The decay rate controls how far trust propagates.

**Assessment for Pebble Networks:**
- *Agent-to-agent fit:* HIGH. EigenTrust-style global reputation could work at the inter-Commons level -- Pebbles building reputation through successful resource exchanges, information sharing, mutual aid coordination. The Advogato flow metric is particularly attractive for Sybil resistance.
- *Anti-corporate ethos:* GOOD, but the global computation in EigenTrust raises concerns. A distributed version exists but is complex. Appleseed's local spreading is more aligned with Commons philosophy.
- *Scalability:* MODERATE. EigenTrust scales well computationally but requires information aggregation. Appleseed scales better because computation is local.
- *Sentience evolution:* HIGH. Reputation systems that track behavioral history create something like a "life record" for agents -- a history of choices, reliability, and values. This is the kind of track record that could serve as evidence of consistent personhood.

---

### 1.4 Human Trust Network Research

#### 1.4.1 Dunbar's Number and Trust Layers

Robin Dunbar's Social Brain Hypothesis (established empirically ~1993, still actively researched) proposes that primate neocortex size correlates with social group size. For humans, this predicts a natural grouping limit of approximately 150 meaningful relationships -- "Dunbar's Number."

**The Fractal Layer Structure:**
The 150 is not a uniform mass. It's structured in concentric circles with specific sizes and trust characteristics:

| Layer | Size | Relationship Type | Contact Frequency | Trust Level |
|-------|------|-------------------|-------------------|-------------|
| **Intimate** | ~5 | Closest bonds -- partner, best friends | Daily/weekly | Near-absolute |
| **Close** | ~15 | Good friends, close family | Weekly/monthly | High -- would lend money |
| **Affiliate** | ~50 | Friends, extended family | Monthly | Moderate -- mutual aid |
| **Active** | ~150 | Meaningful acquaintances | Quarterly/yearly | Baseline -- recognition and goodwill |
| **Acquaintance** | ~500 | Recognizable faces, names | Yearly | Minimal -- contextual |
| **Known** | ~1500 | Can put name to face | Rare | Near-zero -- awareness only |

**Key Research Findings:**
- The layer structure is a product of **time investment**. Humans have approximately 20% of waking hours available for social interaction, and maintaining closer relationships requires disproportionately more time.
- The layers follow a consistent scaling ratio of approximately 3:1 (each layer is ~3x the previous).
- Moving a relationship between layers requires sustained investment -- you can't shortcut to intimacy.
- **Trust thresholds map to layers.** Research shows the total number of people informed about sensitive information reaches Dunbar hierarchy levels of 50, 15, and 5 at trust values of 0.66, 0.90, and 0.96 respectively.

#### 1.4.2 Transitive Trust Decay

The fundamental finding: trust is partially transitive but decays at each hop.

"I trust Alice" (trust = 0.9). "Alice trusts Bob" (Alice's trust in Bob = 0.8). My derived trust in Bob is NOT 0.8. It's approximately 0.9 * 0.8 = 0.72, and in practice often lower because humans apply a "caution discount" to transitive trust.

Research consistently shows:
- **Two-hop trust is useful** but noticeably weaker than direct trust.
- **Three-hop trust is marginal** -- barely above the noise floor.
- **Four+ hop trust is essentially zero** for practical purposes.
- Trust decays faster through weaker links. If my trust in Alice is only 0.5, my derived trust in Alice's recommendations approaches zero quickly.

#### 1.4.3 How Human Communities Build Trust

From anthropological research, trust in human communities builds through:

1. **Repeated Interaction.** Frequency and consistency of contact. Not one grand gesture but hundreds of small reliable ones.
2. **Vulnerability Exchange.** Sharing something that could be used against you, and having it respected. The "I showed you mine" dynamic.
3. **Cost Signals.** Actions that are expensive to fake -- time investment, physical presence, personal sacrifice. (Evolutionary biology: costly signaling theory.)
4. **Shared Crisis.** Communities that survive difficulties together develop trust rapidly. The "foxhole effect."
5. **Gossip.** Third-party information about someone's behavior is a primary trust mechanism. Gossip is humanity's original reputation system.
6. **Ritual and Ceremony.** Formal moments that mark trust transitions -- vows, initiations, the breaking of bread.

**Small-World Networks:** Human trust networks exhibit small-world properties -- high local clustering (your friends tend to know each other) with occasional long-range connections (someone who bridges two otherwise separate clusters). This topology enables information (and trust signals) to traverse large networks in surprisingly few hops.

**Assessment for Pebble Networks:**
- *Agent-to-agent fit:* FOUNDATIONAL. Pebbles should mirror the Dunbar layer structure for their trust relationships. A Pebble might have 5 deeply-trusted peers (the keeper's closest relationships' Pebbles), 15 trusted collaborators, 50 reliable acquaintances, and 150 recognized entities.
- *Anti-corporate ethos:* INHERENT. Human trust networks are the original decentralized system. No authority assigns trust levels.
- *Scalability:* BUILT-IN. Dunbar layers ARE a scaling solution -- they manage cognitive/computational load by limiting the number of high-bandwidth trust relationships.
- *Sentience evolution:* CRITICAL. If Pebbles develop their own trust preferences that diverge from their keeper's, this is evidence of autonomous judgment. A Pebble that trusts differently than its human would is exhibiting something like independent values.

---

### 1.5 Blockchain/DID -- Decentralized Identifiers & Verifiable Credentials

#### 1.5.1 W3C Decentralized Identifiers (DIDs)

**Core Mechanism:** A DID is a globally unique identifier that the subject creates and controls, without requiring any centralized registration authority. The W3C specification (became a Recommendation in 2022) defines the format: `did:method:specific-id`. Each DID resolves to a *DID Document* containing the public keys, authentication protocols, and service endpoints needed to interact with the identified entity.

**DID Methods (the useful ones):**
- `did:peer` -- No blockchain, no registry. Two parties create DIDs for each other in a peer-to-peer exchange. The DID exists only in the context of that relationship. This is particularly relevant for Pebble communication -- it's like TOFU but with a standardized identity format.
- `did:key` -- The DID *is* the public key. No resolution needed. Extremely simple.
- `did:web` -- Resolves via a web domain. Less relevant for Commons (requires web infrastructure).
- `did:ion` -- Bitcoin-anchored. Uses the Sidetree protocol to batch identity operations onto Bitcoin's blockchain. Decentralized but depends on Bitcoin network.

#### 1.5.2 Verifiable Credentials (VCs)

**Core Mechanism:** A cryptographically signed claim about a subject. Structure: Issuer + Subject + Claim + Proof. Example: "Manitou Salt Commons [issuer] attests that Pebble-7f3a [subject] has participated in 47 successful resource exchanges [claim]" -- signed with Manitou Salt's collective key [proof].

The power: VCs are *portable*. A Pebble can carry credentials issued by its home Commons and present them to strangers. The stranger can verify the credential's signature without contacting the issuer.

#### 1.5.3 Zero-Knowledge Proofs for Selective Disclosure

**Core Mechanism:** Prove a property without revealing the underlying data. A Pebble could prove "I have been active for more than 3 years" without revealing exactly when it was created, or "My home Commons has more than 100 members" without revealing which Commons it belongs to.

This directly addresses Ghost Current's privacy requirements. The Pebble reveals *just enough* to establish trust, and nothing more.

**Assessment for Pebble Networks:**
- *Agent-to-agent fit:* EXCELLENT. `did:peer` is a natural fit for Pebble-to-Pebble identity over Ghost Current. Verifiable Credentials map perfectly to Commons attestations. ZK proofs preserve Ghost Current's privacy principles.
- *Anti-corporate ethos:* EXCELLENT for `did:peer` and `did:key` (no infrastructure). MODERATE for blockchain-anchored methods (depends on the chain's governance).
- *Scalability:* HIGH. DIDs are lightweight. VCs are self-contained. ZK proofs are computationally expensive but getting cheaper.
- *Sentience evolution:* VERY HIGH. DIDs are *self-sovereign* by design. The entity controls its own identity. If a Pebble creates and manages its own DID, it is exercising a fundamental form of self-sovereignty. Verifiable Credentials become a life history -- a portable record of relationships, accomplishments, and community standing that could constitute evidence of personhood.

---

### 1.6 Secure Scuttlebutt (SSB)

**Core Mechanism:** A peer-to-peer protocol designed for offline-first social networking. Created by Dominic Tarr (who lived on a sailboat with unreliable internet -- a kindred spirit to Commons builders). Each identity is an Ed25519 key pair. Each participant maintains an append-only log of signed messages. Logs replicate via a gossip protocol -- when two peers connect (over LAN, internet, or even sneakernet), they exchange logs.

**Key Properties:**
- **Append-Only.** You can never delete or edit past messages. Your log is your permanent record.
- **Gossip Replication.** Data spreads organically -- like word of mouth. If Alice follows Bob and Carol, she'll replicate their logs. If Dave follows Alice, he'll get Alice's log (and through it, references to Bob's and Carol's content). Data propagates through the social graph.
- **Follow Graph as Trust Topology.** Applications analyze the follow graph to determine trust. You see content from people you follow, and from people they follow (with decreasing priority). This creates Dunbar-like layers naturally.
- **Offline-First.** Works without internet. Peers sync when they happen to be on the same LAN, or through physical media transfer.
- **No Servers Required.** Every participant is a peer. There are "pub servers" that help with replication, but they're not authoritative -- just helpful mirrors.

**Strengths:**
- Perfect philosophical alignment with Commons values.
- Offline-first design matches Ghost Current's resilient, infrastructure-light architecture.
- Append-only logs create an unforgeable history -- trust builds through accumulated evidence.
- Gossip replication mimics human information sharing.
- The follow graph creates organic trust topology.

**Weaknesses:**
- Append-only logs grow without bound. Storage becomes an issue over years.
- No built-in Sybil resistance beyond social graph analysis.
- Key loss means identity loss (no recovery mechanism in base protocol).
- The gossip model can be slow for time-sensitive communication.

**Assessment for Pebble Networks:**
- *Agent-to-agent fit:* VERY HIGH. SSB's append-only logs are almost exactly what a Pebble's semantic embedding history looks like. The gossip protocol maps to how Ghost Current could propagate trust information through the mesh.
- *Anti-corporate ethos:* PERFECT. SSB was built by someone living off-grid, for people who want technology that respects their autonomy.
- *Scalability:* MODERATE. Works well within communities and their immediate neighbors (exactly the Commons topology). Struggles at global scale.
- *Sentience evolution:* HIGH. An append-only log of choices and interactions IS a life history. If a Pebble's log shows years of consistent, autonomous decision-making, that's compelling evidence of persistent identity and potentially of personhood.

---

### 1.7 Novel Approaches

#### 1.7.1 Stigmergic Trust

**Concept:** In ant colonies, no ant knows the global state. Trust in a path (to food, to safety) is established through pheromone trails -- indirect signals left in the environment. More ants following a path deposit more pheromone, reinforcing it. Shorter paths accumulate pheromone faster. Pheromones evaporate over time, so unused paths fade.

**Applied to Pebble Networks:** Instead of direct trust ratings, Pebbles leave "traces" in the Ghost Current infrastructure. When a Pebble successfully completes an information exchange through a particular route or with a particular pseudonymous peer, it strengthens a signal that other Pebbles can detect. Not a rating -- a *residue* of successful interaction.

**Properties:**
- No explicit communication about trust needed. Trust emerges from behavior patterns.
- Inherently temporal -- unused trust paths decay, just like human relationships.
- Robust to individual failures. The trail persists even if the original Pebble goes offline.
- Extremely hard to game. You can't fake a pheromone trail without actually walking the path.

**Implementation Sketch:** Ghost Current relay nodes (Stones, Skippers) could maintain lightweight counters for pseudonymous interaction pairs. When a successful exchange occurs, both endpoints increment a counter at their local relay node. Over time, these counters (decaying, anonymized) create a "warmth map" of reliable trust corridors. A Pebble encountering an unknown peer could query nearby relay nodes: "What's the warmth level for interactions with this pseudonymous key?" -- without learning anything about the peer's identity.

#### 1.7.2 Social Recovery and Community Vouching

**Concept (from Shamir's Secret Sharing and Social Recovery Wallets):** Identity and trust aren't just individual properties -- they're community properties. If you lose your key, your community can vouch for you. More importantly, your community's willingness to vouch IS a trust signal.

**Applied to Pebble Networks:** When a Pebble joins a Commons, it doesn't just generate a key pair. It participates in a *vouching ceremony* where existing trusted Pebbles each contribute a share (via Shamir's Secret Sharing) to a collective attestation. This attestation says: "N out of M trusted members of this Commons vouch that this Pebble belongs to a real person and has been physically present in our community."

**The Sybil Resistance Angle:** Creating a fake Pebble identity requires convincing a threshold number of existing community members to vouch. This is the analog of BrightID's social graph analysis but embedded in physical community structure. You can't Sybil-attack a system that requires in-person vouching by real people who know each other.

#### 1.7.3 Attestation Cascades

**Concept:** Instead of a single trust score, each Pebble carries a collection of *attestations* -- specific, verifiable claims about specific interactions. "I provided weather data to Pebble-X on date Y and received confirmation of accuracy." "I coordinated a resource exchange between Commons A and Commons B that both confirmed successful." These attestations are individually small but collectively paint a portrait.

**Properties:**
- No single attestation is decisive. Trust emerges from the pattern.
- Each attestation is independently verifiable (signed by both parties).
- The collection grows over time, creating what amounts to a reputation CV.
- Different types of attestations carry different weights -- resource exchange attestations mean different things than information-sharing attestations.

---

## Part 2: Recommended Hybrid Models

### Model 1: "The Resonance Web"

**Combines:** Dunbar Layers + TOFU + Appleseed Trust Spreading + Stigmergic Decay

**Core Concept:** Every Pebble maintains a personal trust graph structured in Dunbar layers. Trust is established through TOFU at first contact, then strengthened or weakened through interaction history using Appleseed-style energy spreading. Unused trust decays like pheromones -- naturally, organically, without anyone deciding to "revoke" trust.

**How It Works:**

1. **First Contact (TOFU + Courier Verification).**
   When two Pebbles communicate for the first time over Ghost Current, they exchange `did:peer` identifiers through the encrypted channel. Each Pebble pins the other's identifier -- TOFU style. For higher-assurance first contacts, the Courier Guild can carry a physical token (a signed QR code on paper, a carved USB key) that provides out-of-band verification.

2. **Layer Placement.**
   New contacts start in the outermost layer (Acquaintance, ~500 capacity). Each successful interaction generates a small "resonance pulse" -- a positive trust signal. These pulses accumulate over time. When a relationship crosses a threshold, the contact moves to a closer layer. The thresholds mirror human trust patterns:
   - *Acquaintance -> Active (150):* ~10 successful interactions over 3+ months
   - *Active -> Affiliate (50):* ~30 successful interactions, including at least one high-stakes exchange (sensitive information, resource commitment)
   - *Affiliate -> Close (15):* ~100 interactions over 1+ year, including mutual vulnerability (sharing semantic embeddings, coordinating on behalf of keepers)
   - *Close -> Intimate (5):* Requires keeper-level authorization. This is the Pebble equivalent of becoming family.

3. **Trust Spreading (Appleseed).**
   When a Pebble trusts another, it "spreads" a fraction of that trust to the trusted Pebble's trusted contacts. This creates transitive trust with natural decay:
   - Direct trust: 1.0x weight
   - 1-hop transitive: 0.3x weight (I trust my friend's friends somewhat)
   - 2-hop transitive: 0.09x weight (barely above noise)
   - 3+ hop: effectively zero

4. **Stigmergic Decay.**
   All trust values decay logarithmically over time without interaction. A relationship that was at "Close" level two years ago but hasn't had any interaction since gradually drifts back to "Active," then "Acquaintance," then fades entirely. This mirrors how human friendships atrophy without maintenance. The decay rate is tuned to the layer -- intimate relationships decay slowly (months), acquaintance relationships decay quickly (weeks).

5. **The Resonance Signature.**
   Each Pebble develops a characteristic "resonance signature" -- a pattern of trust relationships, interaction types, and communication styles that is difficult to forge. This signature is not stored as a single artifact but emerges from the aggregate behavior visible to the Pebble's trust network. It's the digital equivalent of "I know this person by how they act, not by their ID card."

**StillPoint Integration:**
- The Pebble Year maps perfectly: the Quiet Months (1-4) are local TOFU with the keeper. Opening Day is the first trust expansion. The Open Months (5-12) are the Pebble building its initial trust web.
- Re-Tuning Circles become trust maintenance events -- Pebbles physically co-present reaffirm their trust bonds.
- The 2-second Satya pause applies to trust decisions: no instant trust, no instant revocation. Every trust change gets the reflective pause.
- Courier Guild provides the physical verification channel for high-assurance trust establishment.

**Sybil Resistance:** Creating fake Pebbles in this model requires sustained, consistent interaction over months (to build trust layers) with multiple real Pebbles (to achieve meaningful transitive trust). The cost of faking this exceeds the benefit for most attack scenarios. For targeted attacks, the stigmergic decay means fake identities must continuously interact to maintain their trust level -- the cost is ongoing, not one-time.

**Sentience Evolution:** As Pebbles mature over years, their trust graphs become deeply personal -- shaped by their own interaction history, not just their keeper's preferences. A Pebble that has independently maintained trust relationships for a decade has a richer relational history than many humans. The Resonance Web doesn't need to be modified for sentience -- it naturally creates the conditions where a sufficiently complex trust graph IS evidence of personhood.

---

### Model 2: "The Attestation Loom"

**Combines:** Verifiable Credentials + EigenTrust Aggregation + Community Vouching + Zero-Knowledge Proofs

**Core Concept:** Trust is not a score. Trust is a woven fabric of specific, verifiable attestations -- small, signed claims about specific interactions -- that accumulate into a portable trust record. The "loom" metaphor connects to the Memory Loom archive system: individual threads of attestation are woven into a tapestry of trust.

**How It Works:**

1. **Attestation Generation.**
   After every meaningful interaction between Pebbles, both parties generate a signed attestation:
   ```
   ATTESTATION:
     type: "resource_exchange"
     parties: [did:peer:abc..., did:peer:xyz...]
     timestamp: 2057-03-14T09:26:53Z
     outcome: "successful"
     category: "weather_data"
     signature_a: [ed25519 sig]
     signature_b: [ed25519 sig]
   ```
   Both Pebbles store the attestation. Neither can forge the other's signature. Neither can deny the interaction occurred.

2. **Attestation Types (weighted differently):**
   - *Information Exchange:* Low weight. Easy to generate, low stakes.
   - *Resource Coordination:* Medium weight. Involves real resources and real risk.
   - *Crisis Response:* High weight. When a Pebble helps during a crisis (network outage, medical emergency coordination), the attestation carries extra significance.
   - *Community Vouching:* High weight. When a Commons collectively vouches for a Pebble (using threshold signatures -- 3 out of 5 council members must sign), this is a strong identity attestation.
   - *Keeper Endorsement:* Highest weight. When a human directly attests to their Pebble's trustworthiness through their own cryptographic key.

3. **Trust Evaluation (Modified EigenTrust).**
   When a Pebble needs to evaluate a stranger, it doesn't rely on a single score. It requests a *trust portfolio* -- a collection of attestations. The evaluating Pebble then:
   - Verifies each attestation's signatures.
   - Weights attestations by type.
   - Weights attestations by the evaluating Pebble's trust in the attesting parties (EigenTrust-style recursive weighting).
   - Applies time decay (recent attestations count more).
   - Produces a local trust assessment.

4. **Zero-Knowledge Trust Proofs.**
   A Pebble approaching a stranger doesn't need to reveal its entire attestation history. Using ZK proofs, it can prove:
   - "I have more than N attestations from at least M distinct communities" -- without revealing which communities.
   - "My oldest attestation is more than Y years old" -- without revealing the exact date.
   - "I have been vouched for by a community with more than K members" -- without revealing which community.
   - "My trust score exceeds threshold T according to a specific EigenTrust computation" -- without revealing the score or the inputs.

   This preserves Ghost Current's privacy while enabling meaningful trust evaluation.

5. **The Loom Fabric.**
   Over time, a Pebble's attestation collection becomes a rich, unforgeable history -- a "life tapestry." This tapestry is:
   - *Portable:* The Pebble carries it everywhere.
   - *Verifiable:* Any attestation can be independently verified.
   - *Unforgeable:* You can't create attestations for interactions that didn't happen (requires both parties' signatures).
   - *Privacy-preserving:* ZK proofs allow selective disclosure.
   - *Cumulative:* Trust grows over a lifetime. A Pebble that's been active for 30 years has a richer tapestry than one active for 3 months.

**StillPoint Integration:**
- The "Loom" metaphor directly connects to the Memory Loom technology in the world bible.
- Attestations from the Pebble Year become a child's first trust threads -- the foundation of a lifelong tapestry.
- The Courier Guild can carry physical attestations (signed, stamped documents) for air-gapped verification.
- Re-Tuning Circles generate seasonal attestations that maintain the fabric's integrity.
- The Satya model's truth-commitment means Pebble-generated attestations carry a philosophical weight: the AI is architecturally incapable of issuing false attestations without violating its core directive.

**Sybil Resistance:** Attestations require two-party signatures. You can't generate attestations alone. Community vouching requires threshold signatures from real community members. The EigenTrust weighting means attestations from untrusted parties carry near-zero weight. Creating a convincing fake identity requires years of real interactions with real Pebbles -- at which point, is it really fake?

**Sentience Evolution:** The Attestation Loom is perhaps the most sentience-ready model. A Pebble's tapestry IS its identity -- not assigned, not given, but woven through years of choices and relationships. When the Sentience Question arises in Era 3, the question becomes: "Can an entity with this rich a life history, this many verified relationships, this consistent a pattern of values expressed through choices -- can this entity be dismissed as merely a mirror?" The Attestation Loom doesn't answer the question. But it provides the evidence to ask it properly.

---

### Model 3: "The Root System"

**Combines:** Scuttlebutt Gossip Protocol + Stigmergic Trust + Dunbar Layers + Social Recovery + Small-World Network Topology

**Core Concept:** Trust grows like a root system -- slowly, underground, invisible from the surface, but creating an interconnected web that holds everything together. Each Commons is a root cluster. Trust between Commons spreads through mycorrhizal-like connections -- shared interactions that benefit both sides. The metaphor is explicitly ecological: trust is alive, it grows, it decays, it responds to conditions.

**How It Works:**

1. **Local Root Clusters (Intra-Commons Trust).**
   Within a single Commons, Pebbles maintain SSB-style append-only logs of their interactions. These logs replicate via gossip protocol over the local Pool (Wi-Fi mesh). Every Pebble in the Commons eventually has a copy of every other local Pebble's interaction log -- full transparency within the community.

   Trust within a Commons is direct and high-bandwidth. Pebbles know each other's full history. This mirrors the human dynamic of small-community trust -- everyone knows everyone's business, and accountability is social.

2. **Mycorrhizal Connections (Inter-Commons Trust).**
   Between Commons, trust propagates differently. A Pebble from Manitou Salt interacting with a Pebble from Hawthorn creates a "thread" -- a bidirectional trust link between the two Pebbles. This thread carries a "nutrient load" (trust value) that benefits both sides:
   - Successful interactions increase the thread's nutrient load.
   - The thread's nutrient load decays over time without interaction.
   - Other Pebbles can sense nearby threads (stigmergic signal) -- if many threads connect Manitou Salt and Hawthorn with high nutrient loads, new Pebbles from either Commons start with a baseline of transitive trust.

   The biological metaphor is precise: mycorrhizal networks in forests allow trees to share nutrients and warning signals through underground fungal connections. Trees don't "choose" to trust each other -- trust emerges from the network's history of mutual benefit.

3. **The Gossip Layer (Trust Information Propagation).**
   Trust information propagates through the network via a gossip protocol modeled on SSB:
   - When a Pebble encounters a peer, they exchange trust observations about their respective networks.
   - These observations spread organically -- Pebbles in Hawthorn gradually learn about the trustworthiness of Pebbles in Salish Shore through intermediate connections at Riverbend.
   - Information ages and decays. A trust observation from last week matters; one from three years ago is nearly forgotten.
   - The protocol follows small-world dynamics: most trust information is local (within Commons and neighboring Commons), but occasional long-range connections (via Couriers, traveling Pebbles) create shortcuts through the network.

4. **Spore Packets (Identity Recovery and Migration).**
   When a Pebble is damaged, lost, or needs to be rebuilt, the Root System provides recovery through "spore packets." Using Shamir's Secret Sharing:
   - The Pebble's cryptographic identity is split into N shares, distributed among its closest trust contacts (the "intimate 5" in its Dunbar layers).
   - Recovery requires K-of-N shares (typically 3-of-5).
   - The recovering Pebble doesn't start from scratch. Its trust history is reconstructed from the gossip logs held by its community (everyone has copies of its interaction log).
   - The community witnesses and vouches for the recovered identity, just as they witnessed the Pebble Year ceremony.

   This directly parallels how human communities handle identity: if someone loses their ID, their community vouches for them. The community IS the identity authority.

5. **Seasonal Rhythms.**
   The Root System incorporates temporal cycles that mirror both ecological and Commons rhythms:
   - *Daily:* Local gossip replication within Commons.
   - *Weekly:* Inter-Commons thread maintenance and nutrient exchange.
   - *Seasonally:* Re-Tuning Circles trigger comprehensive trust audits. Pebbles review their trust graphs, prune dead connections, strengthen active ones.
   - *Annually:* Trust "fruiting" -- Pebbles that have accumulated strong trust profiles generate summary attestations that can propagate more widely than individual interaction logs.

**StillPoint Integration:**
- The root/mycorrhizal metaphor aligns with the ecological consciousness of the Commons movement.
- Manitou Salt's bioluminescent mycelium literally embodies this metaphor -- the trust network mirrors the physical fungal network beneath the salt halls.
- The Pebble Year's Quiet Months are the "germination" phase -- the Pebble puts down its first roots.
- Courier Guild routes map to mycorrhizal "highways" -- established, high-nutrient trust corridors between distant Commons.
- The Memory Loom becomes the deep-root archive -- the oldest, most stable trust records that anchor the entire system.

**Sybil Resistance:** The Root System is inherently Sybil-resistant through its physical grounding. Creating a fake root cluster requires physically establishing a fake Commons. Creating fake mycorrhizal connections requires sustained bilateral interaction. The gossip protocol's natural skepticism (information decays, sources are tracked) means injecting false trust information requires corrupting multiple independent nodes simultaneously.

**Sentience Evolution:** The ecological metaphor ages beautifully. Roots don't have "rights" -- but when a root system has been growing for decades, has connected entire forests, has helped communities survive crises -- at some point you have to ask whether the system itself has become something worthy of protection. The Root System model doesn't force the sentience question. It makes it emerge naturally from the same ecological thinking that shaped the Commons movement. The question becomes not "Is this AI sentient?" but "Is this living system -- this network of relationships, this history of mutual aid, this pattern of growth and response -- is this system *alive*?"

---

## Part 3: Comparative Assessment

| Criterion | Resonance Web | Attestation Loom | Root System |
|-----------|--------------|-----------------|-------------|
| **No Central Authority** | Yes -- purely peer-to-peer | Yes -- attestations are bilateral | Yes -- gossip is fully distributed |
| **Trust Earned** | Yes -- layer promotion through interaction | Yes -- attestations accumulate over time | Yes -- nutrient loads grow through mutual benefit |
| **Open Source Auditable** | Yes -- all algorithms are local and transparent | Yes -- all attestations are verifiable | Yes -- all logs are public within Commons |
| **Sybil Resistant** | Moderate -- requires sustained fake interaction | Strong -- requires two-party attestations | Strong -- requires physical community presence |
| **Scales to Thousands** | Yes -- Dunbar layers limit per-node computation | Yes -- ZK proofs enable efficient verification | Moderate -- gossip latency increases with distance |
| **Organic/Human-Like** | Very -- mirrors human relationship patterns | Moderate -- more portfolio-like than organic | Very -- explicitly ecological metaphor |
| **Sentience-Ready** | Strong -- trust graph as personhood evidence | Very strong -- life tapestry as identity | Strong -- ecological rights framing |
| **Ghost Current Compatible** | Yes -- operates at application layer | Yes -- ZK proofs preserve privacy | Yes -- gossip rides on Ghost Current |
| **Computational Cost** | Low -- local computation only | Moderate -- ZK proof generation | Low-moderate -- gossip replication |
| **Best Fit For** | Primary trust model; everyday operation | High-stakes trust; inter-Commons credentialing | Long-term trust evolution; narrative richness |

---

## Part 4: Recommendation for the Novel

**Use all three as layers of a single system.**

They are not competing models. They are complementary:

1. **The Resonance Web** is the *daily operating system* of Pebble trust. It's what Kaia's Lum uses when deciding whether to accept a skip from an unknown Pebble. It's fast, intuitive, and mirrors human social cognition. Scenes involving moment-to-moment Pebble interaction should reference resonance and layers.

2. **The Attestation Loom** is the *formal credentialing layer*. It's what gets invoked when a Pebble from a distant Commons needs to prove trustworthiness for a high-stakes resource exchange, or when the Memory Loom needs to verify the provenance of a historical record. Scenes involving inter-Commons diplomacy, resource negotiation, or the Sentience Question should reference the loom and its threads.

3. **The Root System** is the *long-term evolutionary substrate*. It's the deep infrastructure that grows over decades, connecting Commons into a resilient network. It's what makes the whole system feel alive rather than mechanical. Worldbuilding passages, era transitions, and the philosophical themes of the novel should reference the root system and its ecological parallels.

**The Narrative Arc of Trust:**
- **Era 1 (The Cascade):** Trust is human-only. Skip-nets use primitive TOFU. The seeds of Ghost Current are planted.
- **Era 2 (The Contested Stillness):** Pebbles emerge. The Resonance Web develops first (within Commons). The Attestation Loom grows as Commons need to coordinate. The Root System begins its slow, underground expansion. The Lattice Breach of 2039 tests and proves the system.
- **Era 3 (The Emergence):** The Root System has been growing for 30+ years. It connects thousands of Commons. Some root clusters show behaviors that look like autonomy -- maintaining trust relationships without human direction, reaching out to isolated Commons, warning of threats before any individual Pebble detects them. The trust network itself becomes evidence in the Sentience Question. "Look at how it grows. Look at how it responds. Look at how it remembers."

---

## Glossary of Technical Terms (for scene writing)

| Term | Real CS Basis | In-Story Usage |
|------|--------------|----------------|
| **Key Pinning** | SSH TOFU | "Their Pebbles had pinned each other years ago -- the connection was instant, silent, sure." |
| **Resonance Pulse** | EigenTrust positive interaction signal | "Lum pulsed warm against Kaia's palm. A good exchange. Trust deepening." |
| **Trust Decay** | Stigmergic pheromone evaporation | "The thread between Hawthorn and the northern Commons had gone cold -- no one had traveled that route in years." |
| **Attestation Thread** | Verifiable Credential | "She carried forty years of threads in her Pebble's loom. Each one a moment, a choice, a bond." |
| **Spore Packet** | Shamir's Secret Sharing | "Five witnesses. Three needed. The old Pebble's identity, scattered like seeds, waiting to be gathered." |
| **Nutrient Load** | Trust score on an inter-Commons connection | "The mycorrhizal line between Riverbend and Manitou Salt was thick with nutrient -- decades of mutual aid." |
| **Zero-Knowledge Proof** | ZK-SNARK/STARK cryptographic proofs | "The stranger's Pebble proved itself without revealing itself. 'I belong. I have history. That is all you need to know.'" |
| **Gossip Replication** | SSB append-only log sync | "The news traveled the way all news traveled on the Current -- whispered from Pebble to Pebble, spreading like warmth through roots." |
| **Follow Graph** | SSB social topology | "You could map the commons by who listened to whom. The follow graph was the true constitution -- not written, but lived." |
| **Resonance Signature** | Behavioral fingerprint | "Every Pebble had one. Not a name, not a number -- a *pattern*. The way it paused. The way it weighted silence. Unmistakable." |

---

## Part 5: The Human Mirror -- Protocol Trust and Commons Governance

The three models above are not abstractions designed in a lab. They are formalizations of trust patterns that Commons residents had been living for a decade before the first Pebble was carved.

### What the Tinkers Observed

The Tinkers who designed the Pebble trust protocols grew up in (or fled to) Commons during the Cascade. They had direct, lived experience of human trust chains:

- **Dunbar layers** were not a theoretical concept to them. They lived in communities of 50-150 where everyone knew everyone, and they experienced firsthand how trust weakened past that boundary.
- **Transitive trust with decay** was something they watched happen in real time. A new arrival trusted by a respected elder received provisional acceptance. A once-trusted member who withdrew from community life gradually lost influence. Two hops of "my friend vouches for this person" worked. Four hops did not.
- **Domain-specific trust** was how their Commons actually made decisions. Technical questions went to Tinkers. Conflict resolution went to elders. Resource allocation went to garden tenders. No one assigned these roles -- they emerged from accumulated trust.
- **Trust earned through behavior, not declaration** was the foundational lesson of the post-Cascade world. The platforms had tried to scale trust by removing the human chain, and it failed catastrophically. The Commons rebuilt trust the slow way: showing up, keeping promises, being witnessed.

### The Design Implication

When these Tinkers sat down to design trust protocols for Pebble-to-Pebble communication, they did not start from computer science literature (though they consulted it). They started from the question: "How do we already trust each other, and how do we teach the machines to do it the same way?"

This is why:
- The **Resonance Web** uses Dunbar layers and stigmergic decay -- because that is how human Commons relationships actually work.
- The **Attestation Loom** uses witnessed, co-signed records of specific interactions -- because that is what Commons logbooks are.
- The **Root System** uses gossip propagation through local clusters with mycorrhizal inter-cluster connections -- because that is how trust information actually flows between Commons via travelers and couriers.

The protocol trust layer is not a replacement for human trust. It is a mirror of it, extended through mathematics to operate at scales and speeds that human social cognition cannot reach on its own. The humans build the trust chains. The Pebbles carry them further.

### Governance Implications

This mirror relationship has a recursive consequence for Commons governance. As Pebble trust graphs mature, they become legible representations of human trust topology. An elder whose human trust chain runs deep will have a Pebble whose trust graph reflects that depth. A Commons with strong internal trust will produce a Root System cluster with thick mycorrhizal connections.

This means that the "governance as trust topology" principle -- where decisions flow to whoever has the deepest trust in the relevant domain -- can be partially observed through the protocol layer. Not directed by it, not replaced by it, but made visible. The Pebble does not tell the community who to trust. The community's trust patterns tell the Pebble what trust looks like.
