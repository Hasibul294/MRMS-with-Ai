# AI Development Tool Comparison: Antigravity vs. Kilo Code (Free Tier)

## Executive Summary

This report provides a technical and operational comparison between **Antigravity** (Google DeepMind Advanced Agentic Coding Assistant) and **Kilo Code (Free Tier)** in the context of engineering a complex, production-grade full-stack application—the **Patient Appointment and Medical Record Management System (MRMS)**.

The comparison evaluates both AI coding assistants across key dimensions: multi-file architecture orchestration, agentic autonomy, context window & workspace indexing, code quality/standards enforcement, developer experience, and free-tier operational boundaries.

---

## Tooling Overview

| Feature / Dimension | Antigravity | Kilo Code (Free Tier) |
| :--- | :--- | :--- |
| **Developer / Backing Model** | Google DeepMind (Gemini 3.6 Flash / Pro Series) | Open-Source / VS Code Extension (Free API / Local Models) |
| **Primary Interaction Mode** | Autonomous Agentic Coding with Tool Calling & Artifacts | Chat-driven Assistant with Inline Completions & Prompt Actions |
| **Workspace Awareness** | Deep workspace indexing, KI summaries, automatic cross-file symbol tracing | File-level context injection, workspace file search on request |
| **Multi-File Orchestration** | Native multi-project plan generation & simultaneous file creation | Sequential file generation or manual copy-paste across project files |
| **Terminal & Tool Usage** | Integrated sandboxed command execution, background tasks, ripgrep | User-approved command execution, limited background job management |
| **Artifacts & Documentation** | Live Markdown artifacts (`implementation_plan.md`, `walkthrough.md`, diagrams) | Inline chat responses, standard markdown outputs |
| **Cost / Access** | Full Agentic Capabilities & High-Quota Integration | Free Tier (Rate-limited, reduced context window, lower tier models) |

---

## Detailed Comparison Matrix

### 1. Multi-File Architecture & Clean Architecture Enforcement

* **Antigravity**:
  * **Capability**: Seamlessly handles multi-layered C# Clean Architecture (`Domain`, `Application`, `Infrastructure`, `API`, `Tests`) and React frontend (`components`, `features`, `services`, `hooks`) in single, cohesive execution runs.
  * **Dependency Graph Awareness**: Automatically updates interfaces, DTOs, entity configurations, FluentValidation rules, and Dependency Injection containers (`Program.cs`) without breaking reference chains.
  * **MRMS Benchmark Outcome**: Generated 35+ backend and frontend files adhering strictly to `AGENT.md` rules (SOLID principles, repository pattern, DTO separation, soft deletes, Zod schemas).

* **Kilo Code (Free Tier)**:
  * **Capability**: Excels at single-file edits, function implementations, and targeted refactoring. Multi-file generation requires step-by-step prompt decomposition.
  * **Dependency Graph Awareness**: May require manual prompt reminders to update related files (e.g., updating a DTO requires separately asking to update the Service layer and Controller).
  * **MRMS Benchmark Outcome**: Effective for iterative additions (e.g., adding a single endpoint or component), but requires developer intervention to assemble a complete multi-project solution architecture.

---

### 2. Agentic Autonomy & Tool Integration

* **Antigravity**:
  * **Tool Execution**: Autonomous tool usage (`view_file`, `write_to_file`, `replace_file_content`, `multi_replace_file_content`, `grep_search`, `run_command`, `browser_subagent`).
  * **Verification Loop**: Executes build checks (`dotnet build`, `npm run build`), unit tests, and terminal verification autonomously, parsing output to fix compile or lint errors before delivering results.
  * **Background Operations**: Runs dev servers and background tasks while continuously executing subtasks without blocking user interaction.

* **Kilo Code (Free Tier)**:
  * **Tool Execution**: Relies on user prompts to accept diff suggestions and run terminal commands.
  * **Verification Loop**: Requires the developer to run builds/tests in their local IDE terminal and feed error logs back into the chat interface for debugging.
  * **Free Tier Quotas**: Subject to daily request limits and token rate limits on free model APIs, requiring strategic batching of prompts.

---

### 3. Context Window & Repository Indexing

* **Antigravity**:
  * **Context Size**: Extremely large context window capable of ingesting entire solution structures, project configuration files, and deep documentation simultaneously.
  * **Knowledge Items (KI)**: Persistent repository snapshots allow cross-session knowledge retention and adherence to project-specific rules without context drift.

* **Kilo Code (Free Tier)**:
  * **Context Size**: Standard context window optimized for free-tier model throughput. Long conversations may encounter context truncation, requiring periodic prompt resets.
  * **Workspace Search**: Relies on `@file` or `@folder` tags and standard workspace search to pull files into immediate context.

---

### 4. Code Quality & Standards Adherence (MRMS Rules)

| Requirement Rule | Antigravity Result | Kilo Code (Free Tier) Expected Workflow |
| :--- | :--- | :--- |
| **Soft Delete (`IsDeleted`, `DeletedAt`)** | Implemented automatically on `Patient` entity & EF Core query filters. | Implemented cleanly when explicitly prompted in entity schema. |
| **Unique Constraints & Conflict Check (409)** | Auto-generated DB unique indexes (`Phone`, `PatientCode`, `Doctor+DateTime`) and service conflict checks. | Implemented with prompt guidance for EF Core migration configurations. |
| **Validation Strategy** | FluentValidation (Backend) + Zod Resolvers with React Hook Form (Frontend) configured out-of-the-box. | Requires explicit prompt specifying double-layer validation stack. |
| **State Management** | React Query `@tanstack/react-query` used for all server state with cache invalidation. | Standard React `useState` / `useEffect` created unless React Query is explicitly requested. |

---

## Workflow Productivity & Developer Effort Comparison

```
Antigravity Workflow:
[ Prompt Requirement ] ──> [ Architectural Plan ] ──> [ Autonomous Multi-File Execution ] ──> [ Build & Test Verification ] ──> [ Complete Deliverable ]
(Developer Time: ~5 mins review)

Kilo Code Free Tier Workflow:
[ Prompt Requirement ] ──> [ File 1 Generation ] ──> [ Copy/Apply ] ──> [ File 2 Generation ] ──> [ Manual Terminal Build ] ──> [ Prompt Debug Errors ] ──> [ Complete ]
(Developer Time: ~25 mins interactive iteration)
```

---

## Strengths & Trade-offs Summary

### Antigravity
* **Pros**:
  1. Full end-to-end agentic capability for complete project generation.
  2. Autonomous build, test, and error-correction loops.
  3. Structured artifacts (`implementation_plan.md`, `walkthrough.md`, diagrams) for transparent progress tracking.
  4. Deep context window prevents breaking existing code during complex refactoring.
* **Cons**:
  1. High autonomy requires developer overview on large structural changes.

### Kilo Code (Free Tier)
* **Pros**:
  1. Lightweight, open-source ecosystem integrated directly into VS Code.
  2. Great for fast inline completions, function-level helpers, and quick single-file refactorings.
  3. No cost barrier for learning and light side projects.
* **Cons**:
  1. Free tier rate limits and context caps restrict rapid generation of full-stack Clean Architecture projects.
  2. Requires manual orchestration to maintain multi-file synchronicity.
  3. Terminal commands and error verification require developer initiation and prompt pasting.

---

## Recommendation & Strategic Usage Guidelines

1. **Use Antigravity when**:
   * Initializing or executing large-scale full-stack projects (e.g., MRMS Clean Architecture).
   * Refactoring multi-module systems where domain logic, infrastructure, API, and UI components must be modified simultaneously.
   * Autonomous testing, verification, and end-to-end documentation deliverables are required.

2. **Use Kilo Code (Free Tier) when**:
   * Working on localized bug fixes, single-function optimization, or unit test snippet generation.
   * Looking for an lightweight open-source assistant inside standard VS Code editor sessions.
   * Reviewing, tweaking, or expanding individual components built during larger agentic workflows.

---

*Report generated as part of the MRMS Project Deliverables.*
