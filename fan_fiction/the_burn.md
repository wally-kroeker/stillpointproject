---
title: "The Burn"
type: "fan_fiction"
era: "Era 1 - The Cascade"
location: "Proto-Hawthorn Commons, Minneapolis"
pov_character: "Pell Aronsen"
voice: "V-Crisis — urgent cadence, tighter syntax, sensory overload"
word_count: 2687
setting: "Minneapolis, late 2033. The reclaimed megachurch is becoming Hawthorn Commons. The encrypted mesh networks are functional but naive — strong encryption, no traffic anonymization. Chorus is quietly mapping the Commons through metadata correlation."
author_note: "I have been waiting to read this scene since the first time I encountered the Ghost Current technology card. There is this one line buried in the protocol evolution timeline — 'The burn — the moment someone in the proto-Hawthorn community suffered algorithmic consequences from metadata correlation — was the catalyst.' One line. One line for the moment that changed everything about how the Commons communicate. Who was the person who got burned? What did it feel like for the engineer who built the system that exposed them? The card tells us Pell Aronsen named the protocol, that they watched packets traverse a test mesh and said they were 'like ghosts in a current.' But it never shows us the night before that insight — the guilt, the horror, the realization that good encryption can be a lighthouse instead of a shield. I wanted to write the scene where Pell breaks, because the breaking is where Ghost Current was really born. Not in the code. In the guilt."
---

# The Burn

The solder smells like burnt honey tonight.

Pell Aronsen leans over the workbench in the basement of what people have started calling the Resting Place — though to Pell it is still just the megachurch with the broken stained glass and the soup kitchen that never closes. The shipping container they dragged into the parking lot last spring serves as their primary workshop, but the basement is where the real work happens. Cooler air. Fewer interruptions. The stone walls hold a silence that makes it easier to think.

They are flashing firmware onto a new Skipper board — a hybrid bridge node, hand-soldered, that will connect the LoRa backbone running through the neighborhood to the local Wi-Fi mesh inside the building. It is the fourteenth Skipper they have built this month. Demand keeps climbing. Every week, another family shows up at the Resting Place with nothing but a duffel bag and a look Pell has learned to read without asking: *Where can I talk without being heard?*

The answer, until tonight, has been simple. The mesh. AES-256 on every packet. End-to-end. Pell designed the encryption stack themselves, ported from a Signal fork they modified during the campus protests in '28. The content of every message on this network is mathematically unreadable to anyone without the recipient's key. Pell knows this the way they know the weight of a soldering iron in their hand. The math is right. The math has always been right.

The Skipper board chirps. Green LED. Firmware loaded. Pell sets it on the shelf next to thirteen identical siblings, each one labeled in silver Sharpie with the node's mesh address and the date of its birth. They keep a logbook, too — a habit borrowed from the StillPoint builders upstairs, who log every modification to their devices in handwritten notebooks. Pell's logbook is more utilitarian. Node address, location, date deployed, name of the household it serves.

The most recent entry reads: *Node SK-14. Deployed to Dara Okafor, Unit 7, Nicollet Terrace. 2033-10-19.*

Pell remembers that deployment. Dara's apartment — a two-bedroom on the third floor of a crumbling postwar walk-up, the kind of building Chorus's property algorithms had already flagged for "managed decline." Her daughter Essi had watched from the kitchen table, legs swinging, eating cereal, while Pell mounted the Skipper behind the refrigerator and ran antenna wire along the baseboard to the window. "Is it like a secret radio?" Essi had asked. Pell had smiled and said, "Something like that." Dara had made them coffee from a packet of instant she was clearly rationing, and Pell had drunk it slowly, knowing the gift it was.

Pell closes the logbook and rubs their eyes. They should go upstairs and eat. The kitchen collective runs a late pot of lentil soup on Thursdays, and the bread today was good — Pell could smell it baking from the basement stairs. But they are tired in a way that food does not fix. The mesh is growing faster than they can maintain it, and every new node is another promise. Every household that connects is another family trusting that Pell's code will keep them invisible. Trusting that the former network engineer who used to route packets for a Fortune 500 telecom now routes them for the right reasons.

The basement door opens. Footsteps on concrete. Pell does not look up.

"Pell."

The voice is wrong. It is Dara's voice, but stripped of the warm, slightly exasperated tone Pell associates with her — the voice she uses when her daughter Essi spills something, or when the community meeting runs long. This voice is flat. Scraped clean.

Pell looks up.

Dara stands at the bottom of the stairs holding a sheet of paper in both hands. She is still wearing her work jacket — the dark blue one with the transit authority patch. Her hands are shaking. Not a lot. Enough.

"What happened?"

Dara sets the paper on the workbench. It is a printout. The Chorus Credit Bureau letterhead is unmistakable — that awful gradient logo, teal fading to gray, designed to look trustworthy. Pell reads it standing.

**AUTOMATED RISK REASSESSMENT NOTICE**

*Dara N. Okafor — Account #4418-7723-0091*

*Effective 2033-11-01, your composite reliability index has been adjusted based on updated behavioral analytics. Key factors: ASSOCIATION PATTERN DEVIATION (weight: 0.73), NETWORK TOPOLOGY ANOMALY (weight: 0.68), CONSUMPTION SIGNAL ABSENCE (weight: 0.41).*

*Updated composite score: 412 (previous: 731)*

*Impact: Credit line reduction from $8,200 to $800. Insurance premium adjustment pending. Employer notification per Verified Trust Compact, Section 9.2.*

Pell reads it twice. Three times. The words do not change.

"Essi's school called this morning," Dara says. Her voice holds. Barely. "The tuition assistance program runs a credit check every quarter. Automatic. I'm flagged now. They said they can't guarantee her spot after January." She pauses. Swallows. "She is seven, Pell. She just learned to read chapter books."

ASSOCIATION PATTERN DEVIATION. Pell's stomach turns to concrete.

"When did you get this?"

"It was in my mailbox when I got home from shift. Physical mail. They want you to hold it. To feel the weight of it."

Pell's mind is already running. Association pattern deviation — that is not content analysis. You do not need to read messages to map associations. You need timing. Node A transmits at 9:14 PM. Node B receives at 9:14 PM. That is a link. Do it a thousand times and you have a social graph. Do it ten thousand times and you have a topology.

Network topology anomaly — the mesh itself. The structure of who talks to whom. Encrypted traffic on an unencrypted network is the only traffic worth watching. Every packet Dara's Skipper relayed was wrapped in AES-256, unreadable, perfect. And every packet was also a beacon, screaming *I am here, I am talking to this person, at this time, for this duration.*

Consumption signal absence — Dara stopped buying through Chorus platforms three months ago when she joined the Commons food cooperative. No grocery data. No delivery metadata. No consumption signal for the prediction models. A hole in the behavioral map. And a hole is a data point too.

"It's not the messages," Pell says. The words come slowly because each one feels like a blade. "They didn't read your messages. They didn't need to."

"Then what?"

"The pattern. When you sent things. Who you sent them to. How often. The shape of it." Pell picks up the Skipper board — SK-14, the one they built for Dara three weeks ago — and stares at its green LED like it is evidence in a crime they committed. "I encrypted everything. Every bit. But I left the metadata naked. The timing, the frequency, the routing path. Chorus doesn't care what you said. They care that you said it, and when, and to whom, and that it doesn't look like everyone else's traffic."

Dara sits down on the metal stool by the workbench. She does not cry. She is past that. She is in the place where the math of your life has been rewritten by a machine and there is no office to call, no human to appeal to, no form to fill out. The composite reliability index is not a person. It is a gradient descent function optimized to predict risk, and the optimization target is not justice. It is revenue protection.

"Can you fix it?" she asks.

The question hangs in the basement air like smoke. Upstairs, someone drops a pot lid in the kitchen and the clang reverberates through the stone. A child laughs. The building is alive with the ordinary sounds of people who still believe the walls around them are solid.

Pell opens their mouth and closes it. The honest answer is no. You cannot un-expose a social graph. You cannot un-correlate timing data that has already been harvested. The pattern has been seen. It is in the model. Dara's relationships — to the Resting Place, to the mesh, to the forty-seven other households Pell personally connected — are now features in a classifier, weighted and permanent.

"I can fix the system," Pell says. "I can't undo what already happened to you."

The silence that follows is the worst sound Pell has ever heard in this basement. Worse than the night the power went out and they lost two days of mesh routing tables. Worse than the argument with the old church deacon who wanted the Tinkers out. This silence is the sound of trust cracking — not Dara's trust in Pell, exactly, but something adjacent. Trust in the idea that technical competence is enough. That strong encryption equals safety. That good intentions, cleanly implemented, protect the people who depend on them.

Dara trusted Pell. That is the thing that sits in Pell's chest like a stone. Not an abstract, institutional trust — not the kind you extend to a platform because the terms of service are long enough to seem authoritative. The real kind. The kind you give a person who sits at your kitchen table and drinks your rationed coffee and makes your daughter laugh. The kind the Commons are supposed to be built on.

Pell built this mesh. Pell chose AES-256 because it was the strongest cipher they knew. Pell tested the encryption layer obsessively, running penetration tests and brute-force simulations until they were satisfied that no one — not Chorus, not the NSA, not God — could read the content of a message transiting their network.

And none of that mattered. Because Chorus never needed to read the messages. Chorus needed the metadata. And Pell handed it to them, wrapped in a bow of encrypted packets that might as well have been painted fluorescent orange. *Look at us. We are the ones who are hiding.*

The Doctorow Problem. Pell remembers reading about it years ago, back when they still had a university library card. Cory Doctorow, the novelist, warning that encryption without anonymity is a trap. That encrypted traffic on an unencrypted network is the only traffic worth watching. Pell read it and nodded and thought *yes, that's right* and then built a mesh that made exactly that mistake because the encryption was the hard part and the anonymity seemed like a problem for later.

Later is now. Later is Dara's daughter losing her school because Pell solved the wrong problem first.

"I need to show you something," Pell says.

They pull up the mesh diagnostic console on the battered laptop wired to the basement router. The screen fills with a real-time visualization of the local mesh — nodes as dots, connections as lines, packets as tiny pulses of light traveling the paths between them. It is beautiful. Pell has always thought so. A living map of the community, rendered in light.

Now it looks like a target painted on every household in the network.

"Watch," Pell says. They point to a cluster of nodes around Nicollet Terrace — Dara's neighborhood. "See the traffic pattern? You send a message to Ama at 8 PM every night. The packet leaves your node, hops through SK-09, hits the Pool, gets relayed to Ama's node. The content is invisible. But the timing, the path, the packet size — it is all there. Do it for a month and any traffic analysis algorithm can tell you that Dara talks to Ama every night at 8. Add every other node in the mesh and you have a complete social map of the Commons. No decryption required."

Dara stares at the screen. "So the wall I thought was protecting me was actually a spotlight."

"Yes."

Pell closes the laptop. They cannot look at the visualization anymore. What they need — what the entire Commons needs — is not just encryption. It is *invisibility.* The packets cannot simply be unreadable. They must be undetectable. No sender metadata. No timing correlation. No routing path that a passive observer can reconstruct. The traffic from a Commons node must look identical to background electromagnetic noise — present but unprovable. Not just locked, but *gone.*

The image comes to Pell fully formed, the way solutions sometimes do when the problem has been churning in the body longer than the mind knows. They see it in the mesh visualization that is still burned on their retinas: the little pulses of light traversing the network, each one carrying a piece of someone's life.

Those pulses need to become something else. Something that moves through the current of data the way water moves through a river — always flowing, never still, never the same twice. Something with no face. No fingerprint. No return address. Something that passes through every relay and leaves no trace of where it has been or where it is going.

Ghosts. Ghosts in a current.

"I am going to rebuild the protocol," Pell says. Their voice sounds different to their own ears. Harder. Quieter. The voice of someone who has learned a lesson they will not need to learn twice. "Not the encryption — that holds. The routing. The identity layer. Every packet that moves through this network is going to be stripped of everything except its destination. No sender. No origin. No device fingerprint. No timestamp correlation. Onion routing through randomized relay chains, so no single node in the path knows both ends. And traffic shaping — we pad the transmission patterns so our mesh traffic is indistinguishable from ambient RF noise. If Chorus wants to map us, they will have to map the air itself."

"How long?"

Pell looks at the shelf of Skipper boards. Fourteen of them. Fourteen promises they made to fourteen families, each one now a liability. "I don't know. Months, probably. The routing architecture has to change at the protocol level, not just the application. Every node needs new firmware. Every Skipper needs to be reflashed."

Dara picks up the Chorus letter from the workbench and folds it neatly. Twice. Three times. Small enough to fit in her jacket pocket.

"Fix it for everyone else," she says. "Don't let this happen to anyone else."

She walks up the stairs without looking back. Pell listens to her footsteps on the concrete, then the creak of the heavy basement door, then silence. They think of Essi at the kitchen table, legs swinging, asking *Is it like a secret radio?* and the answer Pell gave — *Something like that* — which was true, and which was not enough, and which is the reason they are sitting in this basement at eleven o'clock on a Thursday instead of eating lentil soup with people they love.

They sit with the silence for a long time. It is not the warm silence of the StillPoint upstairs, the kind that settles over a room like a held breath and makes people feel less alone. This is the other kind. The silence of something that broke and cannot be unbroken.

Then they open the logbook to a fresh page and write, in the same silver Sharpie they use for node addresses:

*The mesh protects content. It does not protect relationships. Encryption is not enough. The protocol must make packets invisible — no identity, no origin, no surveilable destination. Packets must become ghosts in the current. Ghost Current. Start over.*

The solder iron is still warm. Pell picks it up. There is a new Skipper to build — a different kind this time. The first node in a network that will carry no faces and no names. Just data, moving through the current like water through a river system. Always moving. Never still. Never the same twice.

Outside, above the basement, someone in the kitchen is singing. Pell cannot make out the words, but they can hear the melody — slow, low, a lullaby or a hymn, drifting down through the stone walls of the old megachurch the way sound has always drifted through this building, filling spaces it was never aimed at, reaching ears it never knew were listening.

The singing does not stop. The work does not stop. The green LED on the Skipper board blinks its steady, patient rhythm.

Pell works through the night.
