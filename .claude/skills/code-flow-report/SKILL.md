---
name: code-flow-report
description: 웹 애플리케이션의 소스 코드를 분석하고, 런타임 플로우를 시각화하여 인터랙티브 웹 리포트를 생성합니다.(routes → controllers → services → DB) 코드를 처음보는 사람이 이해하기 쉽게 요약과 클릭 가능한 다이어그램을 사용합니다.
tags: [analyze, flow, report]
---

# Skill purpose

This Skill analyzes a web application's source code (front-end + back-end), extracts structural and data-flow information, and produces a standalone interactive HTML report. The report includes: a navigable flow diagram (routes → controllers → services → database), expandable code previews, tooltips, and a plain-language summary targeted to beginners.

# Step-by-step instructions (what must do)

1. Validate inputs

   - Confirm the user provided a repository or archive (zip, tar) or a list of files with content.
   - Ask for the repository root, primary languages/frameworks, and the app entry points (e.g., server.js, app.py, src/index.ts) if not provided.

2. Static analysis: parse project structure

   - Recursively scan the codebase from the repo root.
   - Identify routing entry points (framework-specific: Express/Koa routes, Flask/Django urls, FastAPI, Rails routes, Next.js pages, React Router, etc.).
   - Identify controller/handler functions, service modules, and database access layers (ORM models, raw SQL calls, database clients).
   - Extract function/method names, file paths, exported symbols, and call edges (direct calls, imports, common patterns).
   - Gather comments and docstrings for summaries and parameter descriptions.

3. Build an intermediate graph model

   - Create nodes of types: route, controller/handler, service/module, database/model, frontend component (optional), external API.
   - Create directed edges representing call/data flow (route → controller → service → DB, or frontend → API route → backend flow).
   - Attach metadata to nodes/edges: file path, line range, brief signature, sample code excerpt, documented purpose (if available), inferred HTTP methods/paths.

4. Simplify & group

   - Group closely related nodes (e.g., all small helper functions in a module) under collapsible clusters to keep the diagram readable.
   - Allow configurable granularity (detailed vs. high-level). Default to high-level grouping and include an option to expand.

5. Generate natural-language summaries

   - For each major route/feature, generate a short beginner-friendly explanation (2–4 sentences) of what the route does and how data flows through the app.
   - Produce a one-paragraph overall architecture summary describing components, primary data flow, and external dependencies.

6. Produce an interactive HTML report

   - Use a client-side visualization library (e.g., D3, Cytoscape.js, or mermaid.js for simple diagrams) to render an interactive directed graph with zoom/pan, node click, and hover tooltips.
   - On node click, show a side panel with: file path, code excerpt with syntax highlighting, signature, documentation/comment excerpt, and links (anchor) to open the file at the exact lines (or include copy/download link if files bundled).
   - Include a left or top navigation with: overall summary, feature-by-feature summaries, toggle for granularity, search box, and a download/export button (zip of report + code pointers or deployable static folder).

7. Output format

   - Produce a single static directory (index.html, assets/) that can be served as a static site, or a zip file of that directory.
   - Also produce a machine-readable graph file (JSON) representing the graph model for further tooling.

8. Provide usage instructions and next steps

   - Add a README in the report explaining how to host it locally and how to regenerate it with updated code.

9. Error handling & limitations
   - If analysis is incomplete (dynamic route registration, runtime reflection, heavy metaprogramming), clearly annotate nodes/edges as "inferred" or "unknown" and list files/methods that need manual review.
   - Warn about unsupported or partially supported frameworks and ask the user for guidance (entry points, route maps).

# Implementation notes Claude should follow when producing the report

- Prefer static analysis; where static analysis cannot resolve call edges, mark them as "inferred" and provide the best-effort explanation.
- Support multiple languages but prioritize JavaScript/TypeScript (Node/Express/Next/React), Python (Flask/Django/FastAPI), and common patterns for database access. If other languages are present, attempt generic parsing by file extensions and symbol scanning.
- Extract route paths and HTTP methods whenever possible and surface them prominently in route nodes.
- Keep the beginner summary concise and avoid technical jargon; include a short glossary for unavoidable terms.
- Ensure the generated HTML and assets are static (no server required to view) and performant for medium-sized codebases (~1000 files).

# Usage examples

Example 1: Basic prompt to start analysis

- "Analyze this repository at /workspace/my-app and produce an interactive web report. Entry points: backend/src/server.js, frontend/src/index.tsx. Focus on API routes and DB usage."

Example 2: Ask for higher granularity

- "Generate the same report but with full granularity (show helper functions and all call edges)."

Example 3: Limited language guidance

- "Repo contains Node/Express backend and React frontend. I want routes and controller flows highlighted; skip third-party node_modules."

# Best practices

- Provide the repo root or a zip of the project to get the most accurate results.
- Tell the Skill the primary language/framework(s) and entry points if the repo uses dynamic registration or uncommon project structure.
- Exclude large directories (node_modules, vendor) unless you want third-party code analyzed.
- Use the granularity toggle to get a high-level overview first, then regenerate with more detail when focusing on specific features.
- Review "inferred" edges manually; they indicate where static analysis could not prove a connection.

# When to ask clarifying questions

- If no entry point or route files are found, ask the user to provide them.
- If multiple frameworks are present or dynamic routing is used, request guidance about which subsystem to prioritize.
- If the repo is private or contains sensitive data, remind the user not to share secrets and offer to run the analysis locally with an exported archive.

# Related scripts and files

- The Skill can optionally produce helper scripts in the report directory:
  - scripts/analyze.sh — example command to run a local analyzer (placeholder)
  - assets/graph.json — the exported graph model (JSON)
  - .claude/skills/code-flow-report/assets/template.html (html)

(These are generated as part of the report output when requested.)
