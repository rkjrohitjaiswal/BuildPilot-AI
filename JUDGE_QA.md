# BuildPilot — Judge Q&A Preparation & Defensibility Guide
### AI-Powered Project Intelligence • Build Better. Defend Smarter.

This document prepares the team with precise, technically honest, and defensible answers to challenging questions from hackathon judges.

---

### 1. Why do you need AI here? Couldn't this be done with a rule-based template engine?
**Answer:**
"A template engine can only match static keywords to canned ideas (e.g., 'If React, then Todo App'). Real-world capstone planning requires multi-dimensional synthesis across non-linear constraints: an intermediate 2-person team with ₹0 budget building in 3 months needs a radically different architectural scope than an advanced 4-person team with a 6-month runway and ₹10,000 cloud budget. 

AI synthesizes the intersection of student skills, domain interests, budget constraints, and timeline into custom 5-tier architectures, realistic milestones, and viva defense questions that no static rule system could produce."

---

### 2. Why Gemini 2.5 Flash? Why OpenRouter?
**Answer:**
"We selected **Google Gemini 2.5 Flash** because it offers an optimal balance of sub-second reasoning speed, high token context handling, and exceptional JSON schema compliance at low operational cost. 

We route through **OpenRouter** because it provides a unified, production-ready gateway with built-in retry mechanisms, model switching capabilities without code refactoring, rate-limit visibility, and low-latency global routing."

---

### 3. How is personalization achieved?
**Answer:**
"Personalization is enforced through strict parameter injection in our server-side system prompts:
- The student's primary skills dictate the core tech stack components.
- The experience level and team size determine module granularity and roadmap milestones.
- The budget setting strictly controls infrastructure choices (e.g., free-tier Supabase/Vercel for ₹0 vs. dedicated VPS/AWS for larger budgets).
- The domain and student notes customize the real-world problem statement and viva defense focus."

---

### 4. How do you validate AI output? What happens if the model returns invalid JSON?
**Answer:**
"We use a 3-layer defensive validation architecture:
1. **Model Constraint:** We enforce `response_format: { type: 'json_object' }` on the OpenRouter call.
2. **Parser Sanitization:** We handle both string and structured content part arrays, strip markdown code fences (````json`), and isolate the JSON substring.
3. **Schema Normalization & Zod Validation:** The raw object passes through normalization functions that clamp scores (0–100), ensure non-empty arrays with sensible fallback defaults, and strictly type the payload against `PlanApiResponse` or `MentorApiResponse`."

---

### 5. How do you protect API keys and sensitive credentials?
**Answer:**
"Zero client exposure. All LLM calls occur strictly in Next.js Server Route Handlers (`/api/plan` and `/api/mentor`). The `OPENROUTER_API_KEY` is loaded exclusively from `process.env` on the Node.js server. Git explicitly ignores `.env.local`, and our code contains zero hardcoded tokens. In our security audit, all sensitive authorization headers are isolated server-side."

---

### 6. How do you handle AI provider failures or timeouts?
**Answer:**
"We implement 30-second `AbortController` timeouts on every server fetch to prevent dangling connections. If OpenRouter times out or returns HTTP errors (401, 402, 429, 500+), the route catches the error and returns sanitized JSON error objects with clear status codes (400, 502, 504) and actionable user guidance. On the frontend, loading states disable buttons to prevent double-submits, and users can retry with 1 click without losing their filled profile data or chat history."

---

### 7. Why exactly three recommendations?
**Answer:**
"In decision science, presenting exactly three options strikes the ideal balance between choice diversity and decision paralysis. We provide:
1. A **High-Fit Direct Path** (maximum skill alignment for reliable completion).
2. An **Innovative Frontier Path** (incorporating emerging AI/edge tech for higher academic evaluation).
3. A **Balanced Production-Ready Path** (strong architecture and straightforward viva defense).
This lets students compare trade-offs without feeling overwhelmed."

---

### 8. How are feasibility and skill match scores calculated?
**Answer:**
"The AI evaluates the semantic distance between the student's listed skills, experience level, and the complexity of the generated system architecture, assigning integer scores from 0–100. Our server-side normalizer bounds each score (`Math.min(100, Math.max(0, ...))`) and computes an overall score average to ensure mathematical and presentation consistency across all cards."

---

### 9. How can this application scale? What happens with thousands of concurrent users?
**Answer:**
"The application is stateless and cloud-native:
- The frontend and API routes deploy to serverless platforms (such as Vercel or AWS Lambda), scaling horizontally on demand.
- Heavy computational workload is offloaded to OpenRouter / Gemini infrastructure.
- To scale cost-effectively for thousands of students, we can introduce Redis caching for common domain archetypes, implement token bucket rate limiting per IP/user session, and utilize background queue workers for high-volume exports."

---

### 10. How would you add authentication and persistent projects?
**Answer:**
"Because our project and mentor schemas are already strictly typed with Zod, adding persistence is straightforward:
- Integrate NextAuth.js or Supabase Auth for student authentication.
- Persist profiles, generated recommendations, checklist completion status, and chat messages in a PostgreSQL database using Prisma or Drizzle ORM.
- Expose `/api/projects/[id]` to enable students to resume their workspace across devices."

---

### 11. What is the biggest limitation of the current system?
**Answer:**
"Currently, BuildPilot provides complete architectural blueprints and code guidance, but does not yet directly write or execute full codebases in an automated cloud sandbox. In our roadmap, we plan to integrate automated GitHub repository scaffolding and test execution."

---

### 12. What makes this more than a simple chatbot?
**Answer:**
"A chatbot is a conversational thread where the burden of structuring the project is on the student. BuildPilot is an end-to-end engineering workstation:
1. It validates and scores proposals before the student even begins.
2. It breaks the project down into a 5-tier visual architecture and weekly milestones.
3. It provides an interactive, stateful implementation checklist.
4. It prepares the student with targeted viva defense questions.
5. Its AI Technical Mentor is context-bound to the active blueprint, answering code, database, and system design queries within that specific architecture."
