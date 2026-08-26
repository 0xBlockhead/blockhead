# Blockhead architecture

This directory is the canonical, reviewable architecture visualization for the current Blockhead repository.

- `index.html` owns the architecture data, view definitions, rendering behavior, source paths, and Codex thread references.
- `vendor/msagl-1.1.26.bundle.js` is the pinned offline MSAGL.js SVG layout runtime used by the artifact.
- The graph distinguishes build-time authority, the browser application, server processes, browser persistence, upstream systems, verification, and contested successor lineages.
- Cross-process relationships are routed through visualization-only gateways. Gateways clarify boundaries and do not represent domain entities.

Open `index.html` directly in a browser. The Codex visualization-directory copy is a disposable viewing output; this repository directory is the source of truth.

Run `node docs/architecture/blockhead/check.cjs` from the repository root to verify semantic IDs, gateway pairs, one visible label per relationship, unambiguous routed segments, and MSAGL DOT parsing.

## Provenance

The architecture was assembled and challenged across Codex threads including:

- `01a03928-8492-7d30-b84a-04a781d0a7e0` — rendered architecture artifact and layout evaluation
- `01a039a1-2f47-7572-b8e7-9b1978772f46` — graph-layout evidence and continuation handoff
- `01a03268-367e-7f42-aa40-15f16968d198` — generated model, resolver, observation, and presentation architecture
- `01a02174-d7ab-7761-8700-3a8968db97ab` — browser persistence and OPFS architecture
- `01a034fb-a8d1-7d02-a040-476141b385bd` — local authority and action-model candidate architecture

Node-level references in `index.html` remain the more precise provenance for individual claims.
