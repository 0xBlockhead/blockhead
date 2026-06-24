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

const unique = (values: readonly string[]) => [...new Set(values)].sort()

const sourceFileEvidenceRows = (
	facts: readonly EvidenceFact[]
): DecisionRow[] => (
	Object.values(
		facts.reduce<Record<string, {
			decision: DecisionRow['decision']
			sourceFile: string
			sourceRole: EvidenceFact['sourceRole']
			factKinds: Set<string>
		}>>((rowByFile, fact) => {
			if (fact.sourceRole !== 'reference-generated' && fact.sourceRole !== 'reference-hand-owned' && fact.sourceRole !== 'active-hand-owned')
				return rowByFile

			rowByFile[fact.sourceFile] ??= {
				decision: fact.sourceRole === 'active-hand-owned' ? 'hand-owned' : 'reference-only',
				sourceFile: fact.sourceFile,
				sourceRole: fact.sourceRole,
				factKinds: new Set(),
			}
			rowByFile[fact.sourceFile].factKinds.add(fact.kind)

			return rowByFile
		}, {})
	).map((row) => ({
		decision: row.decision,
		area: 'evidence',
		identity: row.sourceFile,
		rowKind: row.sourceRole,
		evidence: [row.sourceFile],
		reason: `${row.sourceRole} evidence file with ${row.factKinds.size} extracted fact kinds`,
	}))
)

const productDecision = (
	area: string,
	rowKind: string,
	identity: string,
	reason: string,
	evidence: readonly string[] = ['APP.ts'],
	decision: DecisionRow['decision'] = 'adopt'
): DecisionRow => ({
	decision,
	area,
	identity,
	rowKind,
	evidence: unique([...evidence]),
	reason,
})

export const decisionRowsFromApp = (
	app: {
		schema: {
			entities: {
				name: string
				sourceBindings?: string[]
			}[]
		}
		views: {
			entityViews: {
				entity: string
				file: string
				ownership: string
			}[]
			entityViewShells: {
				entity: string
				file: string
			}[]
		}
		routes: {
			pageShells: {
				routePath: string
				kind: string
			}[]
			sectionShells: {
				routePath: string
				kind: string
			}[]
			selectorMappings: {
				entity: string
				selector: string
				outcome: string
				path?: string
				unresolved: string[]
			}[]
			hubCollections: {
				entity: string
				hub: string
				path: string
			}[]
			loaderTransforms: {
				entity: string
				routePath: string
			}[]
		}
		sources: {
			providers: {
				id: string
			}[]
			sources: {
				id: string
				provider: string
			}[]
			runtimeBindings: {
				source: string
				target: string
			}[]
			runtimeArtifacts: {
				source: string
				path: string
			}[]
		}
		resolvers: {
			coverage: {
				entity: string
				source: string
				status: string
			}[]
		}
		probes: {
			routes: {
				path: string
			}[]
			boundaries: {
				path: string
			}[]
			cors: {
				path: string
			}[]
		}
	},
	facts: readonly EvidenceFact[]
): DecisionRow[] => [
	...app.schema.entities.map((entity) => productDecision(
		'schema',
		'entity',
		entity.name,
		'canonical schema entity emitted from APP.ts',
		[
			'APP.ts',
			'SCHEMA.md',
			`src/schema/${entity.name}.ts`,
		]
	)),
	...app.schema.entities.flatMap((entity) => (entity.sourceBindings ?? []).map((sourceBinding) => productDecision(
		'schema',
		'schema-source-binding',
		`${entity.name}:${sourceBinding}`,
		'entity/source binding is canonical APP schema provenance',
		[
			'APP.ts',
			'SCHEMA.md',
		]
	))),
	...app.views.entityViews.map((view) => productDecision(
		'views',
		'entity-view',
		view.entity,
		view.ownership === 'hand-owned' ? 'active hand-owned view is preserved as product surface' : 'entity view is generated from APP view capability rows',
		[
			'APP.ts',
			view.file,
		],
		view.ownership === 'hand-owned' ? 'hand-owned' : 'adopt'
	)),
	...app.views.entityViewShells.map((view) => productDecision(
		'views',
		'entity-view-shell',
		view.entity,
		'entity view shell behavior is emitted from APP capabilities',
		[
			'APP.ts',
			view.file,
		]
	)),
	...app.routes.pageShells.map((route) => productDecision(
		'routes',
		'page-shell',
		route.routePath,
		`route page uses named APP route kind ${route.kind}`,
		[
			'APP.ts',
			`src/routes/${route.routePath}/+page.svelte`,
		]
	)),
	...app.routes.sectionShells.map((route) => productDecision(
		'routes',
		'section-shell',
		route.routePath || 'root',
		`route section uses named APP route kind ${route.kind}`,
		[
			'APP.ts',
			`src/routes/${route.routePath}/+layout.svelte`,
		]
	)),
	...app.routes.selectorMappings.map((mapping) => productDecision(
		'routes',
		'selector-mapping',
		`${mapping.entity}:${mapping.selector}`,
		mapping.unresolved.length === 0 ?
			`selector route outcome is ${mapping.outcome}`
		:
			`selector route outcome is ${mapping.outcome}: ${mapping.unresolved.join(', ')}`,
		[
			'APP.ts',
			...(mapping.path === undefined ? [] : [`src/routes/${mapping.path}`]),
		],
		mapping.outcome === 'alias' ?
			'alias'
		: mapping.unresolved.length > 0 || mapping.outcome === 'unresolved' || mapping.outcome === 'internal-only' ?
			'deferred'
		:
			'adopt'
	)),
	...app.routes.hubCollections.map((route) => productDecision(
		'routes',
		'hub-collection',
		`${route.hub}:${route.entity}:${route.path}`,
		'hub collection route emitted from APP hub collection rows'
	)),
	...app.routes.loaderTransforms.map((route) => productDecision(
		'routes',
		'loader-transform',
		`${route.entity}:${route.routePath}`,
		'route loader selector transform emitted from APP'
	)),
	...app.sources.providers.map((provider) => productDecision(
		'sources',
		'provider',
		provider.id,
		'source provider definition is canonical APP source data',
		[
			'APP.ts',
			'src/sources/SourceProvider.ts',
		]
	)),
	...app.sources.sources.map((source) => productDecision(
		'sources',
		'source',
		source.id,
		`source belongs to provider ${source.provider}`,
		[
			'APP.ts',
			'src/sources/Source.ts',
		]
	)),
	...app.sources.runtimeBindings.map((binding) => productDecision(
		'sources',
		'runtime-binding',
		`${binding.source}:${binding.target}`,
		'source runtime binding emitted from APP source binding rows'
	)),
	...app.sources.runtimeArtifacts.map((artifact) => productDecision(
		'sources',
		'runtime-artifact',
		`${artifact.source}:${artifact.path}`,
		'source artifact declaration emitted from APP source data'
	)),
	...app.resolvers.coverage.map((coverage) => productDecision(
		'resolvers',
		'coverage',
		`${coverage.entity}:${coverage.source}`,
		`resolver coverage status is ${coverage.status}`,
		[
			'APP.ts',
			'RESOLVER-COVERAGE.md',
		],
		coverage.status === 'implemented' ?
			'adopt'
		: coverage.status === 'no resolver' || coverage.status.startsWith('deferred') ?
			'deferred'
		:
			'adopt'
	)),
	...app.probes.routes.map((probe) => productDecision(
		'probes',
		'route-probe',
		probe.path,
		'route product probe emitted from APP'
	)),
	...app.probes.boundaries.map((probe) => productDecision(
		'probes',
		'boundary-probe',
		probe.path,
		'boundary product probe emitted from APP'
	)),
	...app.probes.cors.map((probe) => productDecision(
		'probes',
		'cors-probe',
		probe.path,
		'CORS product probe emitted from APP'
	)),
	...sourceFileEvidenceRows(facts),
]

export const patternRowsFromApp = (
	app: Parameters<typeof decisionRowsFromApp>[0]
): PatternRow[] => [
	...app.schema.entities.map((entity) => ({
		family: 'schema-product' as const,
		identity: entity.name,
		factKind: 'app.schema.entity',
		sourceFile: 'APP.ts',
		sourceRole: 'definition' as const,
	})),
	...app.views.entityViewShells.map((view) => ({
		family: 'view-product' as const,
		identity: view.entity,
		factKind: 'app.view.entity-shell',
		sourceFile: 'APP.ts',
		sourceRole: 'definition' as const,
	})),
	...app.routes.pageShells.map((route) => ({
		family: 'route-family' as const,
		identity: route.kind,
		factKind: 'app.route.page-shell',
		sourceFile: 'APP.ts',
		sourceRole: 'definition' as const,
	})),
	...app.routes.sectionShells.map((route) => ({
		family: 'route-family' as const,
		identity: route.kind,
		factKind: 'app.route.section-shell',
		sourceFile: 'APP.ts',
		sourceRole: 'definition' as const,
	})),
	...app.routes.selectorMappings.map((mapping) => ({
		family: 'route-product' as const,
		identity: mapping.outcome,
		factKind: 'app.route.selector-mapping',
		sourceFile: 'APP.ts',
		sourceRole: 'definition' as const,
	})),
	...app.sources.runtimeBindings.map((binding) => ({
		family: 'source-product' as const,
		identity: binding.source,
		factKind: 'app.source.runtime-binding',
		sourceFile: 'APP.ts',
		sourceRole: 'definition' as const,
	})),
	...app.resolvers.coverage.map((coverage) => ({
		family: 'resolver-product' as const,
		identity: coverage.status,
		factKind: 'app.resolver.coverage',
		sourceFile: 'APP.ts',
		sourceRole: 'definition' as const,
	})),
	...app.probes.routes.map((probe) => ({
		family: 'probe-product' as const,
		identity: probe.path,
		factKind: 'app.probe.route',
		sourceFile: 'APP.ts',
		sourceRole: 'definition' as const,
	})),
]

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
