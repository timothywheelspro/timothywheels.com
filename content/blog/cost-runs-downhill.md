---
title: "Cost Runs Downhill"
description: "Every cost a system won't carry finds the lowest ground. The fix isn't nicer hand-me-downs at the bottom. It's changing the grade."
date: 2026-10-16
draft: false
canonicalURL: "https://timothywheels.substack.com/p/cost-runs-downhill"
cover:
  image: "/images/blog/cost-runs-downhill.jpg"
  alt: "Cost drops running down a slope and pooling on the low ground"
  relative: false
---

*Originally published on Substack: [Awareness In Action](https://timothywheels.substack.com/p/cost-runs-downhill).*

**Every cost a system won't carry finds the lowest ground. The fix isn't nicer hand-me-downs at the bottom. It's changing the grade.**

For a while now I've been watching where costs go when nobody wants to pay them.

Live in Hampton Roads long enough and you learn how water moves. It doesn't ask where it's welcome. It runs off the high ground, finds the low ground, and sits there. The water here is rising faster than almost anywhere on the East Coast, and it doesn't rise evenly. It pools in the same neighborhoods every time.

Cost works the same way.

The clearest example is the one in my mailbox. Small towns and local communities end up paying the bill for the construction and upkeep of massive data centers. It hits a lot of us when the Dominion Energy bill shows up.

Northern Virginia is the largest data center market in the world. On paper, the data centers pay their own way. The state's own audit found that Dominion's current rates charge them for what it costs to serve them, and regulators created a separate rate class in 2025 that locks the biggest users into long contracts with minimum payments.

But a data center doesn't just buy power. It needs the grid to grow, and the grid belongs to everybody. That's where the leaks are:

- **The capacity auction.** Virginia sits inside a regional power market that serves about 67 million people. That market's own independent monitor found data centers drove about 40 percent of the cost of its December 2025 capacity auction: $6.5 billion out of $16.4 billion. That cost lands on everyone's bill.
- **The contracts.** Deals between utilities and their biggest customers can be confidential, so the people covering the gap can't see it.
- **The wires.** Transmission costs get spread to ordinary customers.

Researchers at Harvard Law documented the last two.

The direct bill gets paid. The cost of growth runs downhill.

And when a town tries to say no, the pressure doesn't stop. In Michigan, a developer sued Saline Township after it refused to rezone farmland for a data center. In Pennsylvania, a developer sued Upper Merion Township after its proposals were rejected. A town has a planning board and a city attorney. A developer has as many lawyers as it needs.

It isn't just the power bill. A company builds big and the bill shows up somewhere else. A rule gets written without the people it lands on, and the cost gets passed down: to the tenant, the ratepayer, the small contractor, the buyer with the least room to absorb it. Nobody decides this in a meeting. It's just gravity. Whatever the top won't carry runs down to whoever can't step out of the way.

That's not a conspiracy. That's drainage.

And the usual response to it is the part that bothered me most. When the water pools at the bottom, somebody shows up with a better bucket. A program. A discount. A pamphlet about resilience. Kind gestures, most of them. But the grade never changes, so next season the water comes right back to the same low ground.

That's when I thought about it: you can't fix a drainage problem by handing nicer buckets to the people standing in the flood. The goal isn't to dress up the bottom in nicer hand-me-downs. It's to change the conditions so climbing out doesn't cost the people already carrying the most.

You change the grade.

**The hand-me-down trap**

A hand-me-down is something the top has already used up. It arrives late, a little worn, and sized for someone else. Programs built that way feel generous from above and feel like leftovers from below.

The trap is that it works just well enough to keep the slope in place. The cost still runs down. It just gets a softer landing.

Cost runs downhill. A softer landing doesn't change where it lands.

So I asked a different question about my own company. Not "how do we help the people at the bottom?" but "what are we sending downhill, and who's standing there when it arrives?"

**Hold your own water**

The first move is the least glamorous one. Before you talk about anyone else's runoff, stop making your own.

And I'll say the uncomfortable part out loud. Contruil builds with AI, and AI runs in data centers like the ones on that bill. I don't get to complain about the meter and pretend I'm not on it.

Software feels weightless, but it isn't. Every AI request burns electricity on somebody's grid. CYW is built so it never spends more compute than a task actually needs. That's the cheaper choice and the cleaner choice, and it turns out they're the same choice.

The hardware side is where I can see it on my own bench: the ESP32 boards and sensors I build with. A device that can't be repaired becomes trash, and trash runs downhill too. Build things that can be fixed and reused. When something is truly dead, send it through a certified recycler instead of letting it drift down to a lot nobody watches.

Then write it down. I've started a plain log: what I used, what I threw out, where it went, and what I spend on AI each month.

Right now that last line is short. I don't have any automated workflows running, so my AI use is just me at a keyboard. Two plans, $20 a month each: ChatGPT and Claude. No extra tokens. No background jobs burning power while I sleep.

That changes when I turn workflows back on or take on clients. When it does, the log will show it, and I'll see what each new job costs before it turns into a habit.

A record kept now becomes evidence later, when someone asks you to prove what you say about yourself.

Hold your own water. It's the only part of the slope you fully own.

**Change the grade**

The second move is harder, and it's where the real leverage is. The grade gets set in rooms most of us never walk into: rulemakings, permit hearings, comment periods, rate cases, zoning votes. Those rooms are more open than they look.

One of them is open in my own city right now. Suffolk's planning commission just recommended pausing new data centers while the city writes the rules for where they can go. Virginia Beach and Chesapeake are working on their own. This is the moment the grade gets set, before the concrete pours, and residents can speak when it comes before the city council.

Federal rules go up for public comment on regulations.gov. Utility rate cases at the State Corporation Commission take public comment too. A specific, plain-spoken comment from a veteran-founded small business that names who a decision will land on gets read. You don't need a lobbyist. You need to show up with specifics before the concrete sets.

When you get in the room, push for the things that stop cost from running down: tiered compliance, so a corner store isn't held to a refinery's paperwork; small-business relief that doesn't quietly become a loophole for the big players; and protections so the cost of growth can't simply be passed through to renters and ratepayers.

And don't walk in alone, and don't walk in speaking for anyone. The people who live on the low ground have been documenting the water for years. My job is to amplify their data, not replace their voice.

The people standing in the water already know where it pools. Bring them to the room where the grade gets set.

**Build the culvert**

The third move is the one a software company is actually built for. A culvert doesn't stop the rain. It gives the water somewhere to go besides into someone's house.

Most compliance costs are really information costs. A small landlord, a contractor or a town council usually isn't fighting the rule; they're paying a consultant to translate it. Tools that make the rule readable make compliance cheap, and cheap compliance is compliance that doesn't get passed down.

The same goes for exposure. Flood risk, heat, air and water quality are mostly public data, scattered across a dozen agencies in formats nobody reads. Put it in one place, in plain language, for one neighborhood, and it stops being data and starts being protection.

And price it so the slope doesn't come back in through the door. So I wrote the rules down and [published them](https://contruil.com/community-access). Community groups and nonprofits with budgets under $100,000 get a free starting tier. Small businesses under $1 million, nonprofits up to $1 million and small towns pay half price. Everyone else pays full price, and 10 percent of every paid engagement funds the free work. Free spots open only when that fund can cover them, so the promise grows with the company instead of ahead of it.

That's the difference between a hand-me-down and a culvert. One is whatever's left over. The other is built in from the start.

Cost runs downhill. A good culvert decides where it goes.

**The exercise**

Don't try to regrade a city this week. Three small reps:

- **Trace one cost.** Pick one line on a bill you pay, a fee, a rider, a rent increase, and find out where it started. Name who decided it and who it landed on.
- **Hold one drop.** Find one thing you send downhill: an old device, a dead battery, a cost you push onto someone else by default. Route it somewhere better, once.
- **Find one room.** Look up one open comment period or council vote that affects where you live. You don't have to say anything yet. Just read who's already in it and who isn't.

Boring on purpose. You're learning to see the slope, and you can't regrade what you can't see.

**The reframe**

Nobody gets to stop the rain. The weather is bigger than any of us, and so is the economy, and so is the system that decides where cost flows.

Control was never the rain. The rain belongs to the weather, the markets and the people who pour the concrete. Control is the grade: what you refuse to send downhill, whether you show up when the slope gets set, and whether what you build gives the water somewhere to go besides onto the people already standing in it.

Hold your own water. Change the grade. Build the culvert.

This is how you Control Your World.

**References**

1. Joint Legislative Audit and Review Commission, [*Data Centers in Virginia*](https://jlarc.virginia.gov/landing-2024-data-centers-in-virginia.asp) (December 2024).
2. Virginia State Corporation Commission, final order in Dominion Energy Virginia's 2025 biennial review, Case No. PUR-2025-00058 (25 November 2025). Coverage: [Loudoun Now](https://www.loudounnow.com/news/scc-approves-new-data-center-rate-class-for-dominion/article_02d5fa0c-1ed8-4771-b57d-c24765739854.html).
3. Ethan Howland, ["Data centers were 40% of PJM capacity costs in last auction: market monitor"](https://www.utilitydive.com/news/data-centers-pjm-capacity-auction/808951/), Utility Dive (7 January 2026).
4. Eliza Martin and Ari Peskoe, ["Extracting Profits from the Public: How Utility Ratepayers Are Paying for Big Tech's Power"](https://eelp.law.harvard.edu/extracting-profits-from-the-public-how-utility-ratepayers-are-paying-for-big-techs-power/), Harvard Law School Environmental and Energy Law Program (March 2025).
5. ["Saline Township hit with lawsuit after rejecting data center rezoning"](https://planetdetroit.org/2025/09/saline-township-data-center-lawsuit/), Planet Detroit (September 2025).
6. ["Developer sues Upper Merion Township over rejected King of Prussia data center proposals"](https://www.inquirer.com/news/pennsylvania/data-centers-upper-merion-township-lawsuit-20260918.html), *Philadelphia Inquirer* (18 September 2026).
7. NOAA Tides & Currents, [relative sea level trend for Sewells Point, Norfolk (station 8638610)](https://tidesandcurrents.noaa.gov/sltrends/sltrends_station.shtml?stnid=8638610).
8. ["Suffolk is one step closer to temporarily banning data centers"](https://www.whro.org/local-government/2026-09-16/suffolk-is-one-step-closer-to-temporarily-banning-data-centers), WHRO (16 September 2026).

*Timothy Wheels is a U.S. Air Force veteran, founder of Contruil LLC, and author of* Get Rich or Get Free. *He builds Control Your World, a human-led architecture for routing your own attention, energy, and decisions instead of leasing them out.*
