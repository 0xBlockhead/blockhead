export type SourceRole =
	| 'active-generated'
	| 'active-hand-owned'
	| 'reference-generated'
	| 'reference-hand-owned'
	| 'documentation'
	| 'test-invariant'
	| 'script-invariant'
	| 'definition'
	| 'unknown'

export type Confidence =
	| 'exact'
	| 'derived'
	| 'heuristic'

export type EvidenceFact = {
	kind: string
	identity: string
	value: unknown
	sourceFile: string
	sourceLine?: number
	sourceRole: SourceRole
	parser: string
	confidence: Confidence
}

export type WitnessFile = {
	path: string
	role: SourceRole
	reason: string
}

export type PatternFamily =
	| 'schema-entity'
	| 'schema-selector-or-fields'
	| 'schema-product'
	| 'view-file'
	| 'view-reference'
	| 'view-product'
	| 'route-file'
	| 'route-reference'
	| 'route-family'
	| 'route-product'
	| 'source-file'
	| 'source-reference'
	| 'source-product'
	| 'resolver-file'
	| 'resolver-coverage'
	| 'resolver-product'
	| 'probe-product'
	| 'invariant'
	| 'unique'

export type PatternRow = {
	family: PatternFamily
	identity: string
	factKind: string
	sourceFile: string
	sourceRole: SourceRole
}

export type ConceptRow = {
	concept: string
	family: PatternFamily
	sourceFiles: string[]
	factCount: number
}

export type Decision =
	| 'adopt'
	| 'merge'
	| 'alias'
	| 'hand-owned'
	| 'obsolete'
	| 'reference-only'
	| 'deferred'

export type DecisionRow = {
	decision: Decision
	area: string
	identity: string
	rowKind: string
	evidence: string[]
	reason: string
}
