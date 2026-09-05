# BuildPilot — Hackathon Pitch Material
### AI-Powered Project Intelligence • Build Better. Defend Smarter.

---

## A. 30-Second Elevator Pitch
"Every year, millions of computer science students struggle to pick a final-year project that is realistic, technically rigorous, and defendable in front of viva examiners. Most end up choosing overdone clone apps or wildly unfeasible ideas that fail midway. **BuildPilot** solves this in seconds: it analyzes a student's exact skills, interests, duration, and budget to generate three tailored, production-grade project blueprints—complete with 5-tier system architectures, week-by-week roadmaps, interactive checklists, and a real-time contextual AI technical mentor that coaches them through code, DB schema design, and viva defense."

---

## B. 1-Minute Pitch
"Good morning, judges. Final-year capstone projects make or break a graduating engineer's portfolio and university grade. Yet the project ideation process is completely broken: students either pick cookie-cutter projects that examiners instantly dismiss, or ambitious ideas with unmanageable tech stacks that lead to project failure.

**BuildPilot** bridges this critical gap. Rather than acting as a generic idea generator, it functions as an intelligent technical project intelligence platform. A student inputs their actual stack—such as Next.js, Python, or IoT edge constraints—and our platform uses OpenRouter with Gemini 2.5 Flash to synthesize three distinct project blueprints scored across Skill Match, Feasibility, and Innovation.

Once an option is selected, the student enters a dedicated **BuildPilot Project Workspace** featuring interactive architecture flows, sprint roadmaps, implementation checklists, and a context-aware AI Technical Mentor that knows the exact project parameters to review code, troubleshoot errors, and simulate tough viva examiner questions. It turns final-year panic into structured, defendable engineering."

---

## C. 2-Minute Detailed Pitch
"Distinguished judges, final-year engineering projects represent the bridge between academic theory and industry engineering. However, over 70% of students face three fatal bottlenecks:
1. **Decision Paralysis & Mismatched Scopes:** Choosing stacks they don't know within unreasonable timeframes or budgets.
2. **Lack of Architectural Guidance:** Knowing *what* to build, but having no idea how to structure the database, API layers, or background pipelines.
3. **Viva Defense Anxiety:** Inability to articulate *why* technical trade-offs were made when external examiners cross-examine them.

We built **BuildPilot** to solve this end-to-end.

Here is how it works:
1. **Intelligent Onboarding:** The student inputs their language proficiencies, target domains, team size, duration, and budget limits (even zero-budget open-source setups).
2. **AI Recommendation Engine:** Powered by OpenRouter and Gemini 2.5 Flash, our server validates constraints with Zod and returns three fully-developed blueprints ranked by feasibility and skill alignment.
3. **Interactive Project Workspace:** When a project is selected, the student unlocks an interactive workspace with:
   - Visual 5-tier architecture topology (Client, API Gateway, Services, Data Stores, DevOps).
   - Phased execution roadmap with clear milestone deliverables.
   - Interactive progress checklist with batch selection and completion metrics.
   - Viva defense prep containing rigorous examiner questions and tactical defense strategies.
4. **Context-Aware BuildPilot AI Mentor:** A dedicated technical mentor initialized with the project's full technical schema. The student can ask custom questions or trigger 1-click prompts like *'Explain Architecture'*, *'Design Database'*, or *'Prepare My Viva'*. The mentor responds with structured architectural breakdowns, actionable next steps, clean copyable code snippets, and scope warnings.
5. **Blueprint & Chat Export:** Students can export comprehensive Markdown blueprints and JSON chat logs for offline documentation and submission reports.

BuildPilot doesn't just suggest an idea—it guides students from Day 1 ideation to final viva defense."

---

## D. Problem Statement
- Students pick generic, duplicated projects (e.g., simple e-commerce or basic todo apps) that fail academic evaluation standards.
- Misaligned tech stack difficulty leads to missed submission deadlines and unfinished features.
- Students lack immediate access to senior software architects who can guide system design and database planning.
- Viva examiners evaluate technical depth, trade-offs, and security, areas where students are typically underprepared.

---

## E. Solution
BuildPilot is an AI-powered project intelligence platform that transforms student profiles into personalized, end-to-end executable capstone blueprints with live contextual AI technical mentorship, interactive checklists, architecture visualization, and viva exam coaching.

---

## F. Key Innovation
- **Profile-Constrained Synthesis:** Generates solutions strictly bound to student constraints (budget ₹0–₹15k+, duration, team size, and skill level).
- **Structured Architectural Depth:** Provides a complete engineering blueprint (5-tier system design, phased roadmap, viva Q&A) instead of one-line summaries.
- **Persistent Contextual Mentor:** AI Technical Mentor that inherits the selected project’s exact tech stack, roadmap, and student constraints to provide non-generic, high-signal engineering advice.
- **Viva Defense Simulator:** Built-in examiner Q&A with model defense reasoning to help students articulate architectural trade-offs.

---

## G. AI Usage
- **Model:** `google/gemini-2.5-flash` accessed via `OpenRouter`.
- **Structured Schema Generation:** Enforces strict JSON schemas for blueprints and mentor responses using `response_format: { type: 'json_object' }`.
- **System Prompt Engineering:** Specialized prompts acting as an Academic Project Advisor & Senior Software Architect.
- **Normalization & Fallback Resilience:** Server-side sanitization ensuring type safety, score boundary enforcement (0–100), and robust markdown fence stripping.

---

## H. Technical Architecture
- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Glassmorphic UI design.
- **Backend:** Next.js Server Route Handlers (`/api/plan`, `/api/mentor`).
- **Validation:** Zod schemas with sanitization, boundary checks, and 30-second AbortController timeout protection.
- **AI Gateway:** OpenRouter API with Gemini 2.5 Flash.
- **Security:** Complete server-side API key isolation (`process.env.OPENROUTER_API_KEY`).

---

## I. User Journey
1. **Profile Configuration:** Student inputs skills or clicks a Quick Demo Profile.
2. **AI Recommendation Generation:** Generates 3 personalized project blueprints in real-time.
3. **Comparison & Selection:** Compares radar metrics (Skill Match, Feasibility, Innovation) and selects an option.
4. **Workspace Exploration:** Explores problem/solution, tech stack, 5-tier architecture, and roadmap.
5. **Interactive Implementation:** Manages development tasks with the checklist.
6. **Technical Mentorship:** Consults BuildPilot AI Mentor for architecture, DB schemas, code samples, and viva prep.
7. **Viva Preparation & Export:** Reviews examiner defense strategies and exports the blueprint to Markdown.

---

## J. Why This Is Useful for Students
- Eliminates weeks of aimless ideation and scoping confusion.
- Ensures project feasibility within college submission deadlines.
- Gives students industry-standard architecture blueprints they can proudly defend.
- Provides 24/7 technical advisory for code and architectural roadblocks.

---

## K. What Makes It Different From a Generic AI Chatbot
| Feature | Generic Chatbot (ChatGPT/Claude) | BuildPilot |
| :--- | :--- | :--- |
| **Project Scoping** | Open-ended, often unfeasible ideas | Hard-bounded by skills, team size, timeline, and budget |
| **Output Structure** | Unstructured markdown prose | Formal 5-tier architecture, tech stack, roadmap, checklist & viva prep |
| **Workflow State** | Disjointed chat thread | Dedicated interactive Project Workspace with checklist tracking |
| **Mentorship Context** | Loses context unless re-prompted | Stateful mentor with injected blueprint context and history |
| **Viva Exam Prep** | Generic questions | Targeted examiner questions tailored to specific stack trade-offs |
| **Portability** | Copy-pasting text chunks | 1-click Markdown Blueprint and JSON Chat export |

---

## L. Future Scope
- **GitHub Repository Generator:** 1-click scaffolding of starter code repositories with CI/CD actions.
- **University LMS Integration:** Direct submission of project progress reports for faculty review.
- **Automated Code Reviewer:** Upload student Git commits to check progress against the roadmap checklist.
- **Multi-Agent Viva Simulator:** Audio-based viva simulation with AI examiners grilling students in real-time.

---

## M. Possible Judge Questions & N. Strong Defensible Answers
*(See [JUDGE_QA.md](file:///c:/Project/projectmentor-ai/JUDGE_QA.md) for full breakdown)*
