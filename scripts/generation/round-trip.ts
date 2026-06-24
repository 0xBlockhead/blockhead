import { readText, walkFiles, writeJsonl, writeText } from './files.ts'
import { type GeneratedOwnership, ownershipDiff } from './ownership.ts'

type RoundTripViolation = {
	path: string
	kind: string
	detail: string
}

type EvidenceRow = {
	kind: string
	value: Record<string, unknown>
	sourceFile: string
}

type ExpectedApp = {
	schema: {
		entities: {
			name: string
			selectors: {
				name: string
				fields: string[]
				member?: string
				value?: string
			}[]
		}[]
	}
	sources: {
		providers: {
			id: string
		}[]
		sources: {
			id: string
		}[]
		runtimeBindings: {
			provider: string
			source: string
			targetKind: string
			targetKey: string
			endpointCount: number
			wireProtocol: string
			apiFamily: string
			operationGroups: string[]
			delivery: string
			artifactCount: number
		}[]
		runtimeArtifacts: {
			source: string
			kind: string
			path: string
			generated: boolean
		}[]
	}
	resolvers: {
		coverage: {
			entity: string
			source: string
			status: string
		}[]
	}
	views: {
		entityViewShells: {
			entity: string
			viewName: string
			file: string
			capabilities: string[]
			sourceText: string
			sourceFile: string
		}[]
	}
	routes: {
		hubCollections: {
			entity: string
			hub: string
			path: string
			view: string
			unresolved: string[]
		}[]
		loaderTransforms: {
			entity: string
			routePath: string
			visiblePath: string
			params: string[]
			selectorFields: string[]
			importedSymbols: string[]
			selectorExpression: string
			simpleDirectParamShape: boolean
			sourceFile: string
		}[]
		selectorMappings: {
			entity: string
			selector: string
			fields: string[]
			outcome: string
			path?: string
			visiblePath?: string
			emitPage?: boolean
			parentFields: string[]
			localFields: string[]
			params?: {
				field: string
				name: string
				matcher?: string
			}[]
			unresolved: string[]
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
}

const readJson = <_Value>(path: string): _Value => (
	JSON.parse(readText(path)) as _Value
)

const readJsonl = <_Value>(path: string): _Value[] => (
	readText(path)
		.split('\n')
		.filter(Boolean)
		.map((line) => JSON.parse(line) as _Value)
)

const stableJson = (
	value: unknown
) => (
	JSON.stringify(value, (_key, child) => (
		child !== null
		&& typeof child === 'object'
		&& !Array.isArray(child) ?
			Object.fromEntries(Object.entries(child).sort(([left], [right]) => left.localeCompare(right)))
		:
			child
	))
)

const semanticRowViolations = <_Row>({
	expectedRows,
	kind,
	ledgerRows,
	path,
	rowKey,
}: {
	expectedRows: readonly _Row[]
	kind: string
	ledgerRows: readonly _Row[]
	path: string
	rowKey: (row: _Row) => string
}): RoundTripViolation[] => {
	const ledgerRowsByKey = Map.groupBy(ledgerRows, rowKey)

	return expectedRows.flatMap((expectedRow) => {
		const key = rowKey(expectedRow)
		const matchingLedgerRows = ledgerRowsByKey.get(key) ?? []

		if (matchingLedgerRows.length === 0)
			return [{
				path,
				kind: `${kind}-missing-ledger-row`,
				detail: key,
			}]

		if (!matchingLedgerRows.some((ledgerRow) => stableJson(ledgerRow) === stableJson(expectedRow)))
			return [{
				path,
				kind: `${kind}-ledger-mismatch`,
				detail: key,
			}]

		return []
	})
}

const expectedSourceFile = (
	path: string
) => (
	path.endsWith('.ts')
	|| path.endsWith('.svelte')
	|| path.endsWith('.js')
	|| path.endsWith('.mjs')
)

const hasRejectedRouteShape = (
	path: string
) => (
	path.includes('/by/$')
	|| path.includes('/by/by-')
	|| path.includes('/by/evm-coin-instance-evm-coin-instance-tool-key/')
	|| /\/by\/[^/]+-[2-9](\/|$)/.test(path)
	|| path.includes('/network/[caip2=networkCaip2]')
	|| path.includes('/data/data/')
	|| path.includes('/global/global/')
)

const hasThingThingRouteShape = (
	path: string
) => (
	/\/([^/]+)s\/\1(\/|$)/.test(path)
)

const importBoundaryViolations = (
	path: string
) => (
	readText(path)
		.split('\n')
		.flatMap((line, index) => {
			if (!/^\s*(import|export)\s/.test(line))
				return []

			if (line.includes('APP.ts'))
				return [{
					path,
					kind: 'expected-imports-app',
					detail: `line ${index + 1}`,
				}]

			if (line.includes('scripts/'))
				return [{
					path,
					kind: 'expected-imports-generator',
					detail: `line ${index + 1}`,
				}]

			if (line.includes('.generated/'))
				return [{
					path,
					kind: 'expected-imports-generated-tree',
					detail: `line ${index + 1}`,
				}]

			if (/src\/(schema_|views_|views__|routes_|sources_|resolvers_)/.test(line))
				return [{
					path,
					kind: 'expected-imports-reference-root',
					detail: `line ${index + 1}`,
				}]

			if (line.includes('$/views-new'))
				return [{
					path,
					kind: 'expected-imports-obsolete-views-new',
					detail: `line ${index + 1}`,
				}]

			if (line.includes('$/routes-new'))
				return [{
					path,
					kind: 'expected-imports-obsolete-routes-new',
					detail: `line ${index + 1}`,
				}]

			return []
		})
)

const semanticRoundTrip = () => {
	const app = readJson<ExpectedApp>('.generated/expected/APP.snapshot.json')
	const schemaRows = readJsonl<EvidenceRow>('.generated/ledgers/schema.jsonl')
	const routeSelectorRows = readJsonl<ExpectedApp['routes']['selectorMappings'][number]>('.generated/ledgers/selector-route-mappings.jsonl')
	const routeRows = readJsonl<EvidenceRow>('.generated/ledgers/routes.jsonl')
	const resolverRows = readJsonl<EvidenceRow>('.generated/ledgers/resolvers.jsonl')
	const sourceRows = readJsonl<EvidenceRow>('.generated/ledgers/sources.jsonl')
	const testRows = readJsonl<EvidenceRow>('.generated/ledgers/probes.jsonl')
	const viewRows = readJsonl<EvidenceRow>('.generated/ledgers/views.jsonl')
	const expectedSchemaSelectors = app.schema.entities.flatMap((entity) => (
		entity.selectors.map((selector) => ({
			entity: entity.name,
			fields: selector.fields,
			member: selector.member,
			value: selector.value,
		}))
	))
	const ledgerSchemaSelectors = schemaRows
		.filter((row) => row.kind === 'schema.selector-member' && row.sourceFile.startsWith('src/schema/'))
		.map((row) => ({
			entity: row.value.entity as string,
			fields: row.value.fields as string[],
			member: row.value.member as string | undefined,
			value: row.value.value as string | undefined,
		}))
	const expectedLoaderTransforms = app.routes.loaderTransforms
	const ledgerLoaderTransforms = routeRows
		.filter((row) => row.kind === 'route.loader-selector-transform')
		.map((row) => ({
			entity: row.value.entity as string,
			routePath: row.value.routePath as string,
			visiblePath: row.value.visiblePath as string,
			params: row.value.params as string[],
			selectorFields: row.value.selectorFields as string[],
			importedSymbols: row.value.importedSymbols as string[],
			selectorExpression: row.value.selectorExpression as string,
			simpleDirectParamShape: row.value.simpleDirectParamShape as boolean,
			sourceFile: row.sourceFile,
		}))
	const ledgerHubCollections = routeRows
		.filter((row) => row.kind === 'route.hub-collection')
		.map((row) => ({
			entity: row.value.entity as string,
			hub: row.value.hub as string,
			path: row.value.path as string,
			view: row.value.view as string,
			unresolved: row.value.unresolved as string[],
		}))
	const ledgerViewShells = viewRows
		.filter((row) => row.kind === 'view.entity-shell')
		.map((row) => ({
			entity: row.value.entity as string,
			viewName: row.value.viewName as string,
			file: row.value.file as string,
			capabilities: [...(row.value.capabilities as string[])].sort(),
			sourceFile: row.sourceFile,
		}))
	const expectedViewShells = app.views.entityViewShells.map((row) => ({
		entity: row.entity,
		viewName: row.viewName,
		file: row.file,
		capabilities: [...row.capabilities].sort(),
		sourceFile: row.sourceFile,
	}))
	const sourceEnumRows = sourceRows.filter((row) => row.kind === 'source.enum-member')
	const ledgerProviderRows = sourceEnumRows
		.filter((row) => row.sourceFile === 'src/sources/SourceProvider.ts')
		.map((row) => ({
			id: row.value.value as string,
		}))
	const ledgerSourceRows = sourceEnumRows
		.filter((row) => row.sourceFile === 'src/sources/Source.ts')
		.map((row) => ({
			id: row.value.value as string,
		}))
	const ledgerRuntimeSourceBindings = sourceRows
		.filter((row) => row.kind === 'source.binding-row')
		.map((row) => ({
			provider: row.value.provider as string,
			source: row.value.source as string,
			targetKind: row.value.targetKind as string,
			targetKey: row.value.targetKey as string,
			endpointCount: row.value.endpointCount as number,
			wireProtocol: row.value.wireProtocol as string,
			apiFamily: row.value.apiFamily as string,
			operationGroups: row.value.operationGroups as string[],
			delivery: row.value.delivery as string,
			artifactCount: row.value.artifactCount as number,
		}))
	const ledgerRuntimeSourceArtifacts = sourceRows
		.filter((row) => row.kind === 'source.binding-artifact')
		.map((row) => ({
			source: row.value.source as string,
			kind: row.value.kind as string,
			path: row.value.path as string,
			generated: row.value.generated as boolean,
		}))
	const resolverCoverageBySource = Map.groupBy(app.resolvers.coverage, (row) => row.source)
	const expectedResolverCoverage = app.sources.sources.map((source) => ({
		source: source.id,
		status: (
			resolverCoverageBySource.get(source.id)?.find((row) => row.entity === '*')?.status
			?? [
				...new Set((resolverCoverageBySource.get(source.id) ?? []).map((row) => row.status)),
			][0]
		),
	}))
	const ledgerResolverCoverage = resolverRows
		.filter((row) => row.kind === 'resolver.coverage-row')
		.map((row) => ({
			source: row.value.source as string,
			status: row.value.status as string,
		}))
	const ledgerProbeRows = testRows
		.filter((row) => row.kind === 'test.probe-path')
		.map((row) => ({
			path: row.value.path as string,
			suite: row.value.suite as string,
		}))

	const checks = [
		expectedSchemaSelectors.length,
		app.routes.selectorMappings.length,
		expectedLoaderTransforms.length,
		app.routes.hubCollections.length,
		app.views.entityViewShells.length,
		app.sources.providers.length,
		app.sources.sources.length,
		app.sources.runtimeBindings.length,
		app.sources.runtimeArtifacts.length,
		expectedResolverCoverage.length,
		app.probes.routes.length,
		app.probes.boundaries.length,
		app.probes.cors.length,
	].reduce((total, count) => total + count, 0)
	const violations = [
		...semanticRowViolations({
			expectedRows: expectedSchemaSelectors,
			ledgerRows: ledgerSchemaSelectors,
			kind: 'semantic-schema-selector',
			path: '.generated/ledgers/schema.jsonl',
			rowKey: (row) => `${row.entity}:${row.fields.join('+')}:${row.member ?? ''}:${row.value ?? ''}`,
		}),
		...semanticRowViolations({
			expectedRows: app.routes.selectorMappings,
			ledgerRows: routeSelectorRows,
			kind: 'semantic-selector-route-mapping',
			path: '.generated/ledgers/selector-route-mappings.jsonl',
			rowKey: (row) => `${row.entity}:${row.selector}:${row.fields.join('+')}`,
		}),
		...semanticRowViolations({
			expectedRows: expectedLoaderTransforms,
			ledgerRows: ledgerLoaderTransforms,
			kind: 'semantic-route-loader-transform',
			path: '.generated/ledgers/routes.jsonl',
			rowKey: (row) => `${row.routePath}:${row.entity}`,
		}),
		...semanticRowViolations({
			expectedRows: app.routes.hubCollections,
			ledgerRows: ledgerHubCollections,
			kind: 'semantic-route-hub-collection',
			path: '.generated/ledgers/routes.jsonl',
			rowKey: (row) => `${row.entity}:${row.hub}:${row.path}`,
		}),
		...semanticRowViolations({
			expectedRows: expectedViewShells,
			ledgerRows: ledgerViewShells,
			kind: 'semantic-view-shell',
			path: '.generated/ledgers/views.jsonl',
			rowKey: (row) => row.file,
		}),
		...semanticRowViolations({
			expectedRows: app.sources.providers.map((provider) => ({
				id: provider.id,
			})),
			ledgerRows: ledgerProviderRows,
			kind: 'semantic-source-provider',
			path: '.generated/ledgers/sources.jsonl',
			rowKey: (row) => row.id,
		}),
		...semanticRowViolations({
			expectedRows: app.sources.sources.map((source) => ({
				id: source.id,
			})),
			ledgerRows: ledgerSourceRows,
			kind: 'semantic-source',
			path: '.generated/ledgers/sources.jsonl',
			rowKey: (row) => row.id,
		}),
		...semanticRowViolations({
			expectedRows: app.sources.runtimeBindings,
			ledgerRows: ledgerRuntimeSourceBindings,
			kind: 'semantic-runtime-source-binding',
			path: '.generated/ledgers/sources.jsonl',
			rowKey: (row) => `${row.source}:${row.targetKind}:${row.targetKey}:${row.wireProtocol}:${row.apiFamily}:${row.delivery}:${row.operationGroups.join('+')}`,
		}),
		...semanticRowViolations({
			expectedRows: app.sources.runtimeArtifacts,
			ledgerRows: ledgerRuntimeSourceArtifacts,
			kind: 'semantic-runtime-source-artifact',
			path: '.generated/ledgers/sources.jsonl',
			rowKey: (row) => `${row.source}:${row.kind}:${row.path}`,
		}),
		...semanticRowViolations({
			expectedRows: expectedResolverCoverage,
			ledgerRows: ledgerResolverCoverage,
			kind: 'semantic-resolver-coverage',
			path: '.generated/ledgers/resolvers.jsonl',
			rowKey: (row) => row.source,
		}),
		...semanticRowViolations({
			expectedRows: app.probes.routes.map((probe) => ({
				...probe,
				suite: 'route',
			})),
			ledgerRows: ledgerProbeRows,
			kind: 'semantic-route-probe',
			path: '.generated/ledgers/probes.jsonl',
			rowKey: (row) => `${row.suite}:${row.path}`,
		}),
		...semanticRowViolations({
			expectedRows: app.probes.boundaries.map((probe) => ({
				...probe,
				suite: 'boundary',
			})),
			ledgerRows: ledgerProbeRows,
			kind: 'semantic-boundary-probe',
			path: '.generated/ledgers/probes.jsonl',
			rowKey: (row) => `${row.suite}:${row.path}`,
		}),
		...semanticRowViolations({
			expectedRows: app.probes.cors.map((probe) => ({
				...probe,
				suite: 'cors',
			})),
			ledgerRows: ledgerProbeRows,
			kind: 'semantic-cors-probe',
			path: '.generated/ledgers/probes.jsonl',
			rowKey: (row) => `${row.suite}:${row.path}`,
		}),
	]

	return {
		checks,
		violations,
	}
}

export const validateRoundTrip = () => {
	const ownershipRows = readJson<GeneratedOwnership[]>('.generated/expected/ownership.json')
	const diff = ownershipDiff(ownershipRows)
	const expectedFiles = walkFiles('.generated/expected')
	const semantic = semanticRoundTrip()
	const violations: RoundTripViolation[] = [
		...diff.flatMap((row) => {
			if (row.ownership === 'hand-owned')
				return [{
					path: row.activePath,
					kind: 'hand-owned-generated-surface',
					detail: row.kind,
				}]

			if (!row.expectedExists)
				return [{
					path: row.expectedPath,
					kind: 'missing-expected-generated-file',
					detail: row.activePath,
				}]

			if (!row.activeExists)
				return [{
					path: row.activePath,
					kind: 'missing-active-generated-file',
					detail: row.expectedPath,
				}]

			if (!row.matches)
				return [{
					path: row.activePath,
					kind: 'active-expected-drift',
					detail: row.expectedPath,
				}]

			return []
		}),
		...expectedFiles
			.filter((path) => path.startsWith('.generated/expected/src/routes/'))
			.flatMap((path) => [
				...(hasRejectedRouteShape(path) ? [{
					path,
					kind: 'rejected-route-shape',
					detail: 'raw selector, duplicated selector, numeric collision suffix, protocol-incompatible generic network descendant, or duplicated hub root',
				}] : []),
				...(hasThingThingRouteShape(path) ? [{
					path,
					kind: 'things-thing-route-shape',
					detail: 'plural root followed by singular duplicate segment',
				}] : []),
			]),
		...expectedFiles
			.filter(expectedSourceFile)
			.flatMap(importBoundaryViolations),
		...semantic.violations,
	]

	writeJsonl('.generated/ledgers/round-trip-violations.jsonl', violations)
	writeText('.generated/reports/round-trip.md', [
		'# Round Trip',
		'',
		`Ownership rows: ${ownershipRows.length}`,
		`Expected files: ${expectedFiles.length}`,
		`Semantic expected rows checked: ${semantic.checks}`,
		`Violations: ${violations.length}`,
		'',
		'## Violations',
		'',
		...(violations.length === 0 ? ['None'] : violations.slice(0, 500).map((violation) => `- ${violation.kind}: ${violation.path} (${violation.detail})`)),
	].join('\n'))

	if (violations.length > 0)
		throw new Error(`Expected output round-trip failed: ${violations.length} violations`)

	console.log(`Round-trip validation passed: ${ownershipRows.length} ownership rows, ${expectedFiles.length} expected files`)
}
