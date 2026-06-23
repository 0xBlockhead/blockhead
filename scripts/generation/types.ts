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
	| 'view-file'
	| 'view-reference'
	| 'route-file'
	| 'route-reference'
	| 'source-file'
	| 'source-reference'
	| 'resolver-file'
	| 'resolver-coverage'
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
	| 'rename'
	| 'hand-owned'
	| 'reject-obsolete-generated'
	| 'reference-only'
	| 'defer-schema'
	| 'defer-runtime'
	| 'defer-artifact'

export type DecisionRow = {
	decision: Decision
	identity: string
	factKind: string
	sourceFile: string
	sourceRole: SourceRole
	reason: string
}
