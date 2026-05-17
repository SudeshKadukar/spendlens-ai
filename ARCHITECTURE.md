# SpendLens AI System Architecture

This document outlines the technical architecture, data flows, technology choices, and scaling strategies for the **SpendLens AI** platform.

---

## System Diagram

The following Mermaid diagram illustrates the end-to-end component interaction, from user input to result generation, lead capture, and viral sharing loop.

```mermaid
graph TD
    %% User/Client layer
    User([Cold Visitor]) -->|1. Fills form / clicks Audit| ClientUI[Client Browser: SpendForm]
    
    %% Next.js Application Server
    subgraph Next.js App Router (Vercel)
        ClientUI -->|2. Send input payload| AuditAPI[POST /api/audit]
        AuditAPI -->|3. Calculate deterministic savings| Engine[Deterministic Audit Engine]
        Engine -->|4. Reference retail rates| Pricing[Pricing Reference Library]
        
        AuditAPI -->|5. Save raw audit| DBWrite
        
        ClientUI -->|7. Request AI summary| SummaryAPI[POST /api/summary]
        ClientUI -->|9. Submit Lead | LeadAPI[POST /api/lead]
    end

    %% External Infrastructure
    subgraph Managed Cloud Databases
        DBWrite[(Supabase Database)]
        DBWrite -->|6. Return public_slug| AuditAPI
        LeadAPI -->|10. Store contact info| DBWrite
    end

    subgraph External APIs
        SummaryAPI -->|8. Generate narrative| Anthropic[Anthropic/OpenAI API]
        LeadAPI -->|11. Send transaction email| Resend[Resend Email API]
    end
    
    %% Share Loop
    PublicUser([Viral Loop Visitor]) -->|12. Access share link| PublicPage[Public Audit Page: /audit/id]
    PublicPage -->|13. Fetch sanitized audit| DBWrite
```

---

## Data Flow: Input to Savings Results

1. **Input Collection**: The user lands on the page and provides their developer stack, plan names, seat counts, monthly spend, team size, and primary use case. This form state is tracked via React state and automatically persisted in the browser's `localStorage` to handle reloads seamlessly.
2. **Audit Request**: On submission, a `POST` request is dispatched to `/api/audit` containing the consolidated `AuditInput` payload.
3. **Deterministic Math**: The `/api/audit` handler runs the deterministic TypeScript **Audit Engine** (`src/lib/auditEngine.ts`), validating inputs against the latest verified vendor prices in `src/lib/pricing.ts`. It flags plan overpayments, seat redundancy (e.g. overkill team plans for small groups), API direct optimization opportunities, and coding tool duplicates.
4. **Database Archival**: The result is serialized and stored in Supabase under the `audits` table, assigning it a unique `public_slug` / `public_id`.
5. **AI Narrative Synthesis**: The client captures the results, then invokes `/api/summary` to generate a personalized ~100-word context paragraph. This narrative explains *why* the savings exist and links the solution to the **Credex** discounted credit service for high-savings users. If the LLM API fails, a deterministic, numbers-accurate fallback summary is cleanly presented.
6. **Lead & Transactional Loops**: If a user submits their email to capture the report, it calls `/api/lead`, storing the lead details (referencing the parent audit) in Supabase. A transactional notification is immediately dispatched via **Resend** confirming the audit details.
7. **Viral Share Action**: When sharing their results, users can send their public audit link. This page pulls data from Supabase but completely strips any private fields (email, company name) to maintain strict user anonymity while still displaying the savings breakdown and dynamic Open Graph images.

---

## Technology Stack Justification

| Layer | Technology | Decision Rationale |
| :--- | :--- | :--- |
| **Meta-Framework** | **Next.js 15+ (App Router)** | Essential for rapid full-stack iteration. Allows us to host static landing pages, dynamic form elements, secure serverless API endpoints, and server-rendered public pages in a single repository. |
| **Language** | **TypeScript** | Crucial for safety. The audit engine relies on strict type definitions for vendor models, plan lists, and recommendation shapes, completely eliminating runtime calculation crashes. |
| **Styling** | **Tailwind CSS** | Provides a modern utility-first workflow to construct a beautiful, dark-themed, glassmorphic visual aesthetic with sleek transitions. |
| **Database** | **Supabase** | Offers a fully-managed PostgreSQL database with immediate REST endpoints, highly reliable schema control, and rapid prototyping capabilities. |
| **Email Gateway** | **Resend** | Superior developer experience compared to AWS SES. Native React-Email integration allows us to build beautiful, responsive HTML confirmation notifications. |
| **Testing** | **Vitest** | Blazing fast, developer-friendly runner that integrates perfectly with TypeScript and allows rapid unit testing of the audit logic. |

---

## 10,000 Audits / Day Scaling Strategy

If SpendLens AI goes viral on Product Hunt/Hacker News and hits **10,000 audits per day**, the following architectural changes would be introduced:

1. **Distributed Rate Limiting**: Shift the local memory rate-limiter in Next.js API routes to a distributed Redis store (e.g., Upstash) to safely enforce abuse limits across serverless compute instances.
2. **Read Replication & Database Indexing**: Add explicit composite indices on Supabase on `public_slug` and `created_at` fields, and utilize read replicas for the public share page to keep database latency under 15ms.
3. **Queue-Based Email & AI Summaries**: Offload Resend API calls and Anthropic LLM generations to a background message queue (e.g., Inngest or BullMQ) to protect users from waiting for downstream API latency during submission.
4. **Vercel Edge Caching**: Cache the public sanitised pages (`/audit/[id]`) using Vercel's Edge Network, invalidating the cache only if an audit is updated, dropping the origin server load close to zero.
