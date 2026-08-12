/** Bee SwarmOnlyReference: 64-hex content address or 128-hex encrypted reference. */
export const swarmOnlyReferencePattern = /^[A-Fa-f0-9]{64}(?:[A-Fa-f0-9]{64})?$/

/** Stable public root from Swarm docs (Bee landing page); used in browse samples and e2e probes. */
export const swarmDocsLandingReference = (
	'8b6ca499eb6f3f7e5ee242f08f1de2e7e6bb1728d7f4ee5ec22091b048f34ff1'
) as const

/** Bee manifest paths are relative gateway paths, never absolute URLs. */
export const swarmManifestPathPattern = /^(?!\/)(?!.*(?:^|\/)\.\.?(?:\/|$))(?:[^/]+(?:\/[^/]+)*)?$/
