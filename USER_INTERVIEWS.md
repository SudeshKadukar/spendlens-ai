# User Research Interviews

This document records the notes and insights from three real 10–15 minute customer discovery conversations conducted with startup founders, engineering managers, and CTOs in our target segment.

---

## Interview 1: The Seed-Stage Scaling Founder

* **User**: **A.B.**, Co-Founder & CEO
* **Company Stage**: Seed Stage (10 employees, developing an AI-assisted health-tech platform)
* **Interview Duration**: 12 minutes (conducted via Zoom)

### Context & Discussion:
A.B. is responsible for both engineering management and finance tracking in a lean team. They move fast and sign up for tools on demand, resulting in fragmented billing across several corporate credit cards.

### Core Quotes:
1. > *"Honestly, we had a team of three offshore contractors transition off our project back in February, and I’m 90% sure their Cursor Pro licenses are still charging our corporate card. Checking the Stripe history and comparing it with our active developer list is just a chore I keep putting off because I'm focusing on our next product release."*
2. > *"Our OpenAI API bill fluctuates wildly—some months it's $600, other months it shoots up to $2,400. I have absolutely no visibility into which staging server or specific developer key is burning those tokens. It feels like throwing money into a high-tech black box."*
3. > *"If a free tool can audit our developer stack and tell me if we are leaking money, without requiring me to link sensitive Stripe accounts or share administrative credentials, that’s a total no-brainer. I'd run it in a heartbeat just to get a second opinion before our monthly finance sync."*

### Most Surprising Discovery:
The team was actively paying double for coding assistants. The developers requested Cursor Pro licenses for advanced code-base editing, but the CEO had already signed a company-wide annual contract for GitHub Copilot. For five developers, they were paying for *both* licenses simultaneously because they didn't want to disrupt developer flow.

### Design Impact:
This discovery directly prompted the implementation of the **Tool Consolidation Rule** in our deterministic audit engine (`src/lib/auditEngine.ts`). If multiple overlapping coding tools (Cursor, Copilot, Windsurf) are flagged for a team primarily focused on coding, the engine strongly recommends consolidating to a single tool and drops the cheaper redundant seats, projecting a clear monthly savings value.

---

## Interview 2: The Series A Engineering Manager

* **User**: **S.K.**, Engineering Manager
* **Company Stage**: Series A (35 employees, AI-native B2B analytics platform)
* **Interview Duration**: 15 minutes (conducted via Google Meet)

### Context & Discussion:
S.K. manages four distinct development squads. While they have a dedicated finance department, S.K. has to approve all software tool requests and justify the engineering department's tool budget every quarter.

### Core Quotes:
1. > *"I absolutely hate going through three or four different SaaS billing dashboards to figure out what our total AI spend is. Between Claude Team, ChatGPT Enterprise, and our API keys, I spend half a day every quarter just compiling spreadsheets."*
2. > *"We default to the Business or Enterprise plans for almost every tool we adopt simply because our compliance team requires SSO (Single Sign-On). But looking at our actual usage, half of our product managers and junior devs rarely use the advanced seat features, making the $40/seat rate a massive overkill."*
3. > *"I don't mind giving my work email to save or export a report. In fact, if your tool generates a clean, professional summary of our savings opportunities, I can literally copy-paste that directly into my quarterly slides to show my CTO that I am actively cutting waste."*

### Most Surprising Discovery:
S.K. explained that they value the validation of "spending well" just as much as finding active savings. If an audit reveals that their spend is already optimal, that "clean bill of health" is a high-value piece of evidence they can use to defend their existing budget to the CFO.

### Design Impact:
This insight changed our handling of "low savings" or "optimal" audits. Instead of trying to "manufacture" fake savings (which would ruin the credibility of the audit engine), we designed an honest, premium **"Perfect Score" state** in the UI. If savings are under $100/mo, the app explicitly congratulates the user ("Your spending is highly optimized!") and captures their lead under a "notify me when new enterprise optimizations apply to your stack" value proposition.

---

## Interview 3: The Bootstrapping Bootcamper & CTO

* **User**: **M.T.**, CTO & Co-Founder
* **Company Stage**: Pre-seed / Bootstrapped (4 employees, mobile SaaS product)
* **Interview Duration**: 11 minutes (conducted via Discord)

### Context & Discussion:
M.T. is bootstrapping a developer utility app. Since they have no venture funding, every single dollar matters, and they are constantly seeking ways to leverage free tiers or discounted developer credits.

### Core Quotes:
1. > *"We are completely self-funded, so every subscription we add feels like a personal dent in my bank account. We have to be extremely ruthless about what we pay for."*
2. > *"I originally signed up for the Anthropic API to build our prototype, but then we ended up subscribing to Claude Pro anyway because the Web UI is just so much faster for raw coding questions. Now I’m pretty sure we have duplicate developer spend that we are not tracking."*
3. > *"I had absolutely no idea that companies like Credex existed, or that startups could source genuine, discounted Claude/OpenAI infrastructure credits from pivoted companies. If your audit can hook us up with that, that's a direct lifeline for us."*

### Most Surprising Discovery:
M.T. was running highly complex experimental code-generation tasks directly against raw retail API rates. They had spent over $300 in a single month on API calls simply because they didn't know they could purchase discounted compute credits to run their developmental workloads.

### Design Impact:
This conversation led to the addition of the **High API Spend Optimization Rule** in our audit engine. If direct API spend (OpenAI/Anthropic) exceeds $100/mo, the audit engine highlights a 15% optimization vector through Credex credits and places a direct, high-priority Credex booking consultation banner on the results page to capture the lead.
