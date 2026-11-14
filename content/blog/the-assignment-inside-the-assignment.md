---
title: "The Assignment Inside the Assignment"
author: "Timothy Wheels | Awareness In Action"
slug: "the-assignment-inside-the-assignment"
description: "Two technical writing assignments connect a Cloudflare Pages setup and an onboarding memo to five ways to verify a handoff."
summary: "What did the prompt ask for? What did the employee receive? Two Technical Writing assignments led me to five questions about handoffs and accountability."
date: 2026-11-14
draft: false
series: ["Awareness In Action"]
cover:
  image: "/images/blog/the-assignment-inside-the-assignment.jpg"
  alt: "Two outlined documents labeled “Documented” and “Received” sit on opposite sides of a broken connection. The cover reads “The Assignment Inside the Assignment.”"
  relative: false
---

*What two weeks of technical writing taught me about asking for an outcome and verifying a handoff*

**By Timothy Wheels | Awareness In Action**

In October, I tried to share an application I’d built and ran into a problem. LinkedIn was blocking the Cloudflare Pages address that came with the project. I wanted people to be able to open the app through my own domain, so I worked through Cloudflare’s documentation, configured DNS, and tested the new subdomain.

A few weeks later, my Technical Writing course at DeVry University asked us to choose a process we knew, have generative AI explain it, and compare the answer with an authoritative source. I already had a process I could test against firsthand experience.

## What I asked the AI to do

I asked ChatGPT how to connect a custom subdomain to a Cloudflare Pages project. Its answer was largely accurate. It covered adding the subdomain to the Pages project and configuring DNS. It even flagged a problem that can occur when a DNS record points to Pages before the subdomain has been associated with the project. [Cloudflare’s custom domain guide](https://developers.cloudflare.com/pages/configuration/custom-domains/)

My prompt stopped at getting the new address to work. The old address raised a separate question. If someone opened the original `pages.dev` link, did I want them to land on the new address? Cloudflare documents a separate redirect for that outcome. Adding a custom subdomain can leave the original address accessible. [Cloudflare’s guide to redirecting the original address](https://developers.cloudflare.com/pages/how-to/redirect-to-custom-domain/)

I hadn’t asked what should happen to the old address. I knew to check because the original URL was what sent me looking for a solution in the first place. If I wanted instructions that covered both outcomes, I could have asked for both.

I organized the assessment around what the answer got right and what my broader use case still left to decide. I earned 60 out of 60. My instructor wrote, “Nice breakdown.”

## What happens after you send the instructions

In Week 3, we turned to document design. In our class discussion, we examined a director’s message about onboarding and employee performance. The tone needed work, and team leads needed clearer direction about what they were expected to do.

I kept thinking about what would happen after a better version of that memo went out. Suppose a lead assigns an experienced employee to train a new hire on Monday. The responsibility is entered in the system. The employee receives the instructions Tuesday and still has a full workload.

On Friday, a supervisor looking at the record can see who was assigned to train the new hire. To understand why the training fell behind, the supervisor would also need to know when the employee got the instructions, what time they had to train, and who could adjust their workload.

Those are different facts. A well-written memo can explain what the job requires. The handoff is where the team finds out whether the person can do it.

## Check one handoff

Pick one recurring task that depends on somebody passing information to somebody else. Take the most recent instance and see what you can verify.

1. **Accuracy.** Did the instructions describe the work and the expected result?
2. **Ownership.** Did the person know what they owned and who could make decisions outside their authority?
3. **Timing.** When did they receive the instructions, and how much time did they have to act?
4. **Support.** Did they have the access, tools, training, and time the work required?
5. **Evidence.** If the work fell through, what tells you where the process broke down?

Try the check before the next handoff, too. Ask the person taking over to confirm the outcome and flag anything that would keep them from delivering it. That gives both of you time to act while the work can still be done.

This is how you Control Your World.

*Academic context: DeVry University, ENGL216 Technical Writing, Weeks 2–3, Fall 2026. The reflections are my own.*

*Timothy Wheels is a U.S. Air Force veteran, founder of Contruil LLC, and author of* Get Rich or Get Free. *He builds Control Your World — a human-led architecture for routing your own attention, energy, and decisions instead of leasing them out.*
