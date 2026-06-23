import type {
	ConceptRow,
	DecisionRow,
	EvidenceFact,
	PatternFamily,
	PatternRow,
} from './types.ts'

const patternFamilyByFactKind = (factKind: string): PatternFamily => {
	if (factKind === 'schema.file')
		return 'schema-entity'

	if (factKind.startsWith('schema.'))
		return 'schema-selector-or-fields'

	if (factKind === 'view.svelte-file' || factKind === 'view.typescript-file')
		return 'view-file'

	if (factKind.startsWith('view.'))
		return 'view-reference'

	if (factKind === 'route.file')
		return 'route-file'

	if (factKind.startsWith('route.'))
		return 'route-reference'

	if (factKind === 'source.file')
		return 'source-file'

	if (factKind.startsWith('source.'))
		return 'source-reference'

	if (factKind === 'resolver.file')
		return 'resolver-file'

	if (factKind.startsWith('resolver.'))
		return 'resolver-coverage'

	if (factKind.startsWith('invariant.'))
		return 'invariant'

	return 'unique'
}

const conceptName = (fact: EvidenceFact, family: PatternFamily) => {
	if (family === 'schema-entity')
		return fact.sourceFile.split('/').at(-1)?.replace(/\.ts$/, '') ?? fact.sourceFile

	if (family === 'view-file' || family === 'route-file' || family === 'source-file' || family === 'resolver-file')
		return fact.sourceFile

	return fact.identity.replace(/:\d+$/, '')
}

const decisionForFact = (fact: EvidenceFact): DecisionRow => {
	if (fact.sourceRole === 'reference-generated' || fact.sourceRole === 'reference-hand-owned')
		return {
			decision: 'reference-only',
			identity: fact.identity,
			factKind: fact.kind,
			sourceFile: fact.sourceFile,
			sourceRole: fact.sourceRole,
			reason: 'fact comes from a read-only reference root',
		}

	if (fact.sourceRole === 'active-generated')
		return {
			decision: 'adopt',
			identity: fact.identity,
			factKind: fact.kind,
			sourceFile: fact.sourceFile,
			sourceRole: fact.sourceRole,
			reason: 'active generated fact should be reproducible from APP.ts',
		}

	if (fact.sourceRole === 'active-hand-owned')
		return {
			decision: 'hand-owned',
			identity: fact.identity,
			factKind: fact.kind,
			sourceFile: fact.sourceFile,
			sourceRole: fact.sourceRole,
			reason: 'active hand-owned fact must be preserved or represented as hand-owned',
		}

	return {
		decision: 'adopt',
		identity: fact.identity,
		factKind: fact.kind,
		sourceFile: fact.sourceFile,
		sourceRole: fact.sourceRole,
		reason: 'documentation, tests, scripts, and definitions are migration evidence',
	}
}

export const patternRowsFromFacts = (facts: readonly EvidenceFact[]): PatternRow[] => (
	facts.map((fact) => ({
		family: patternFamilyByFactKind(fact.kind),
		identity: fact.identity,
		factKind: fact.kind,
		sourceFile: fact.sourceFile,
		sourceRole: fact.sourceRole,
	}))
)

export const conceptRowsFromFacts = (facts: readonly EvidenceFact[]): ConceptRow[] => (
	Object.values(
		facts.reduce<Record<string, {
			concept: string
			family: PatternFamily
			sourceFiles: Set<string>
			factCount: number
		}>>((conceptByKey, fact) => {
			const family = patternFamilyByFactKind(fact.kind)
			const concept = conceptName(fact, family)
			const key = `${family}:${concept}`

			conceptByKey[key] ??= {
				concept,
				family,
				sourceFiles: new Set(),
				factCount: 0,
			}
			conceptByKey[key].sourceFiles.add(fact.sourceFile)
			conceptByKey[key].factCount += 1

			return conceptByKey
		}, {})
	).map((concept) => ({
		concept: concept.concept,
		family: concept.family,
		sourceFiles: [...concept.sourceFiles].sort(),
		factCount: concept.factCount,
	})).sort((left, right) => (
		left.family.localeCompare(right.family)
		|| left.concept.localeCompare(right.concept)
	))
)

export const decisionRowsFromFacts = (facts: readonly EvidenceFact[]) => (
	facts.map(decisionForFact)
)
