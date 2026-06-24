import { existsSync } from 'node:fs'

import { APP } from '../../APP.ts'
import { extract } from './extract.ts'
import { factsToSelectorRouteMappings } from './assemble-app.ts'
import { readText, writeJsonl, writeText } from './files.ts'
import { inventoryWitnesses, roleCounts } from './inventory.ts'
import {
	conceptRowsFromFacts,
	decisionRowsFromApp,
	patternRowsFromApp,
} from './normalize.ts'
import { generatedOwnership, ownershipSummary, staleGeneratedFiles } from './ownership.ts'
import type { GeneratedOwnership } from './ownership.ts'
import type { EvidenceFact } from './types.ts'

type SchemaSelectorFact = EvidenceFact & {
	value: {
		entity: string
		fields: string[]
		member?: string
		value?: string
	}
}

type RouteSelectorMappingFact = EvidenceFact & {
	value: {
		entity: string
		selector: string
		fields: string[]
		parentFields: string[]
		localFields: string[]
		path: string
		visiblePath: string
		unresolved: string[]
	}
}

type SelectorRouteMapping = ReturnType<typeof factsToSelectorRouteMappings>[number]

type RouteLoaderSelectorTransformFact = EvidenceFact & {
	value: {
		entity: string
		routePath: string
		visiblePath: string
		params: string[]
		selectorFields: string[]
		importedSymbols: string[]
		selectorExpression: string
		simpleDirectParamShape: boolean
	}
}

const readJsonl = <_Row>(path: string): _Row[] => {
	if (!existsSync(path))
		return []

	return readText(path)
		.split('\n')
		.filter(Boolean)
		.map((line) => JSON.parse(line) as _Row)
}

const schemaSelectorKey = (selector: SchemaSelectorFact) => `${selector.value.entity}:${selector.value.fields.join('+')}`

const routeSelectorKey = (mapping: SelectorRouteMapping) => `${mapping.entity}:${mapping.fields.join('+')}`

const routeFamilyForSelectorMapping = (mapping: SelectorRouteMapping) => (
	mapping.outcome === 'unresolved' || mapping.unresolved.length > 0 ?
		'unresolved'
	: mapping.visiblePath?.includes('/by/$') || mapping.visiblePath?.includes('/by/by-') ?
		'raw-selector-fallback'
	: mapping.visiblePath !== undefined && /\/by\/[^/]+-[2-9](\/|$)/.test(mapping.visiblePath) ?
		'numeric-collision-fallback'
	: mapping.outcome === 'hub-backed' ?
		'hub-backed'
	: mapping.outcome === 'observation' ?
		'observation'
	: mapping.outcome === 'nested' ?
		'nested'
	: mapping.outcome === 'internal-only' ?
		'internal-only'
	: mapping.outcome === 'alias' ?
		'alias'
	:
		'canonical'
)

const appRuntimeBoundaryViolations = () => [
	...readJsonl<{ path: string }>('.generated/extracted/files.jsonl')
		.filter((file) => file.path.startsWith('src/'))
		.filter((file) => file.path.endsWith('.ts') || file.path.endsWith('.svelte') || file.path.endsWith('.js'))
		.flatMap((file) => readText(file.path).split('\n').flatMap((line, lineIndex) => {
			if (!/^\s*(import|export)\s/.test(line))
				return []

			if (!line.includes('APP.ts') && !line.includes('scripts/') && !line.includes('.generated') && !line.includes('src/schema_') && !line.includes('src/views_') && !line.includes('src/routes_') && !line.includes('src/sources_') && !line.includes('src/resolvers_'))
				return []

			return {
				path: file.path,
				line: lineIndex + 1,
				text: line.trim(),
			}
		})),
]

const appDefinitionBoundaryViolations = () => {
	if (!existsSync('APP.ts'))
		return [
			{
				path: 'APP.ts',
				line: 0,
				text: 'missing APP.ts',
			},
		]

	return readText('APP.ts').split('\n').flatMap((line, lineIndex) => {
		if (!/^\s*import\s/.test(line) && !/^\s*export\s.+\sfrom\s/.test(line))
			return []

		return {
			path: 'APP.ts',
			line: lineIndex + 1,
			text: line.trim(),
		}
	})
}

const thingsThingPatternViolations = () => (
	readJsonl<{ path: string }>('.generated/extracted/files.jsonl')
		.filter((file) => file.path.startsWith('src/routes/'))
		.filter((file) => /\/([a-z][a-z-]+)s\/\1(\/|$)/.test(file.path))
		.map((file) => ({
			path: file.path,
			line: 0,
			text: 'adjacent plural/singular route path segment',
		}))
)

const rawSelectorRouteViolations = () => (
	readJsonl<{ path: string }>('.generated/extracted/files.jsonl')
		.filter((file) => file.path.startsWith('src/routes/'))
		.filter((file) => (
			file.path.includes('/by/$')
			|| file.path.includes('/by/by-')
			|| file.path.includes('/by/evm-coin-instance-evm-coin-instance-tool-key/')
			|| /\/by\/[^/]+-[2-9](\/|$)/.test(file.path)
		))
		.map((file) => ({
			path: file.path,
			line: 0,
			text: 'raw selector discriminator route path',
		}))
)

const protocolIncompatibleNetworkRouteViolations = () => (
	readJsonl<{ path: string }>('.generated/extracted/files.jsonl')
		.filter((file) => file.path.startsWith('src/routes/'))
		.filter((file) => file.path.includes('/network/[caip2=networkCaip2]'))
		.map((file) => ({
			path: file.path,
			line: 0,
			text: 'protocol-incompatible generic network CAIP-2 route',
		}))
)

const duplicatedHubRootRouteViolations = () => (
	readJsonl<{ path: string }>('.generated/extracted/files.jsonl')
		.filter((file) => file.path.startsWith('src/routes/'))
		.filter((file) => (
			file.path.includes('/data/data/')
			|| file.path.includes('/global/global/')
			|| file.path.includes('/data/data.')
			|| file.path.includes('/global/global.')
		))
		.map((file) => ({
			path: file.path,
			line: 0,
			text: 'duplicated hub root route path',
		}))
)

const selectorMappingRoutePatternViolations = (
	mappings: readonly SelectorRouteMapping[]
) => (
	mappings.flatMap((mapping) => {
		const path = mapping.path ?? ''
		const visiblePath = mapping.visiblePath ?? ''
		return [
			...(
				/(^|\/)([a-z][a-z-]+)s\/\2(\/|$)/.test(path) || /(^|\/)([a-z][a-z-]+)s\/\2(\/|$)/.test(visiblePath) ?
					[{
						path: mapping.path ?? mapping.visiblePath ?? `${mapping.entity}:${mapping.selector}`,
						line: 0,
						text: 'selector mapping has adjacent plural/singular route path segment',
					}]
				:
					[]
			),
			...(
				path.includes('/by/$')
				|| path.includes('/by/by-')
				|| path.includes('/by/evm-coin-instance-evm-coin-instance-tool-key/')
				|| /\/by\/[^/]+-[2-9](\/|$)/.test(path)
				|| visiblePath.includes('/by/$')
				|| visiblePath.includes('/by/by-')
				|| visiblePath.includes('/by/evm-coin-instance-evm-coin-instance-tool-key/')
				|| /\/by\/[^/]+-[2-9](\/|$)/.test(visiblePath) ?
					[{
						path: mapping.path ?? mapping.visiblePath ?? `${mapping.entity}:${mapping.selector}`,
						line: 0,
						text: 'selector mapping has raw selector discriminator route path',
					}]
				:
					[]
			),
			...(
				mapping.entity !== 'Network' && (
					path.includes('[caip2=networkCaip2]')
					|| visiblePath.includes('[caip2=networkCaip2]')
				) ?
					[{
						path: mapping.path ?? mapping.visiblePath ?? `${mapping.entity}:${mapping.selector}`,
						line: 0,
						text: 'selector mapping uses generic network CAIP-2 matcher for protocol-specific entity',
					}]
				:
					[]
			),
			...(
				path.includes('/data/data/')
				|| path.includes('/global/global/')
				|| path.includes('/data/data.')
				|| path.includes('/global/global.')
				|| visiblePath.includes('/data/data/')
				|| visiblePath.includes('/global/global/')
				|| visiblePath.includes('/data/data.')
				|| visiblePath.includes('/global/global.') ?
					[{
						path: mapping.path ?? mapping.visiblePath ?? `${mapping.entity}:${mapping.selector}`,
						line: 0,
						text: 'selector mapping has duplicated hub root route path',
					}]
				:
					[]
			),
			...mapping.unresolved
				.filter((issue) => issue.startsWith('path-conflict:'))
				.map((issue) => ({
					path: mapping.path ?? mapping.visiblePath ?? `${mapping.entity}:${mapping.selector}`,
					line: 0,
					text: `selector mapping has unresolved ${issue}`,
				})),
		]
	})
)

type ViewQualityIssue = {
	entity: string
	kind:
		| 'flat-dl'
		| 'label-only-content'
		| 'missing-summary'
		| 'missing-list-contract'
		| 'hand-owned-parity-target'
	severity: 'high' | 'medium' | 'low'
	detail: string
}

type AppViewDeclaration = {
	summary?: unknown
	media?: unknown
	list?: unknown
	lists?: unknown[]
	latest?: unknown[]
	metrics?: unknown[]
	panels?: unknown[]
	renderers?: unknown[]
	content?: {
		dl?: unknown[][]
	}
	details?: {
		tabs?: {
			label: string
			items?: unknown[]
		}[]
	}
}

const viewQualityIssues = (
	ownershipRows: readonly GeneratedOwnership[]
): ViewQualityIssue[] => (
	APP.schema.entities.flatMap((entity) => {
		const view = JSON.parse(entity.view ?? '{}') as AppViewDeclaration
		const dlGroups = view.content?.dl ?? []
		const flatDlGroups = dlGroups.filter((group) => group.length >= 8)
		const labelOnlyItems = dlGroups
			.flat()
			.filter((item) => (
				item !== null
				&& typeof item === 'object'
				&& 'label' in item
				&& !('field' in item)
			))
		const hasCuratedCapability = (
			view.summary !== undefined
			|| view.media !== undefined
			|| view.latest !== undefined
			|| view.metrics !== undefined
			|| view.panels !== undefined
			|| view.renderers !== undefined
		)
		const hasListRefField = entity.fields.some((field) => field.name.startsWith('$$'))
		const hasListContract = view.list !== undefined || (view.lists?.length ?? 0) > 0
		const entityView = APP.views.entityViews.find((viewRow) => viewRow.entity === entity.name && viewRow.kind === 'singular')
		const generatedView = (
			entityView !== undefined
			&& ownershipRows.some((row) => row.kind === 'view' && row.activePath === entityView.file && row.ownership === 'generated')
		)

		return [
			...flatDlGroups.map((group) => ({
				entity: entity.name,
				kind: 'flat-dl' as const,
				severity: hasCuratedCapability ? 'high' as const : 'medium' as const,
				detail: `single projected dl group has ${group.length} items`,
			})),
			...(
				labelOnlyItems.length >= Math.max(4, dlGroups.flat().length / 2) ?
					[{
						entity: entity.name,
						kind: 'label-only-content' as const,
						severity: 'medium' as const,
						detail: `${labelOnlyItems.length} content items are labels without executable field bindings`,
					}]
				:
					[]
			),
			...(
				hasCuratedCapability && view.summary === undefined && view.media === undefined ?
					[{
						entity: entity.name,
						kind: 'missing-summary' as const,
						severity: 'medium' as const,
						detail: 'view declares richer capabilities but no summary/media title contract',
					}]
				:
					[]
			),
			...(
				hasListRefField && !hasListContract ?
					[{
						entity: entity.name,
						kind: 'missing-list-contract' as const,
						severity: 'low' as const,
						detail: 'entity has many-reference fields but no APP list contract',
					}]
				:
					[]
			),
			...(
				entityView !== undefined && !generatedView ?
					[{
						entity: entity.name,
						kind: 'hand-owned-parity-target' as const,
						severity: 'high' as const,
						detail: 'hand-owned view needs an explicit APP parity target before generation can subsume it',
					}]
				:
					[]
			),
		]
	})
)

export const audit = async () => {
	await extract()

	const files = inventoryWitnesses()
	const facts = [
		...readJsonl<EvidenceFact>('.generated/extracted/schema-facts.jsonl'),
		...readJsonl<EvidenceFact>('.generated/extracted/view-facts.jsonl'),
		...readJsonl<EvidenceFact>('.generated/extracted/route-facts.jsonl'),
		...readJsonl<EvidenceFact>('.generated/extracted/source-facts.jsonl'),
		...readJsonl<EvidenceFact>('.generated/extracted/resolver-facts.jsonl'),
		...readJsonl<EvidenceFact>('.generated/extracted/invariant-facts.jsonl'),
		...readJsonl<EvidenceFact>('.generated/extracted/test-facts.jsonl'),
	]
	const boundaryViolations = [
		...appDefinitionBoundaryViolations(),
		...appRuntimeBoundaryViolations(),
	]
	const ownershipRows = generatedOwnership()
	const summary = ownershipSummary(ownershipRows)
	const staleGeneratedRows = staleGeneratedFiles()
	const unknownFiles = files.filter((file) => file.role === 'unknown')
	const patternRows = patternRowsFromApp(APP)
	const conceptRows = conceptRowsFromFacts(facts)
	const decisionRows = decisionRowsFromApp(APP, facts)
	const schemaSelectors = facts
		.filter((fact): fact is SchemaSelectorFact => fact.kind === 'schema.selector-member' && fact.sourceFile.startsWith('src/schema/'))
	const routeSelectorMappings = factsToSelectorRouteMappings(facts)
	const routePatternViolations = [
		...thingsThingPatternViolations(),
		...rawSelectorRouteViolations(),
		...protocolIncompatibleNetworkRouteViolations(),
		...duplicatedHubRootRouteViolations(),
		...selectorMappingRoutePatternViolations(routeSelectorMappings),
	]
	const routeSelectorMappingKeys = new Set(routeSelectorMappings.map(routeSelectorKey))
	const unmappedSelectors = schemaSelectors
		.filter((selector) => !routeSelectorMappingKeys.has(schemaSelectorKey(selector)))
		.map((selector) => ({
			entity: selector.value.entity,
			selector: selector.value.value ?? selector.value.member ?? selector.value.fields.join('+'),
			fields: selector.value.fields,
			sourceFile: selector.sourceFile,
		}))
	const routePatternFamilies = routeSelectorMappings.map((mapping) => ({
		family: routeFamilyForSelectorMapping(mapping),
		entity: mapping.entity,
		selector: mapping.selector,
		fields: mapping.fields,
		path: mapping.path,
		visiblePath: mapping.visiblePath,
		parentFields: mapping.parentFields,
		localFields: mapping.localFields,
		unresolved: mapping.unresolved,
		reason: mapping.reason,
	}))
	const unresolvedSelectorMappings = routeSelectorMappings.filter((mapping) => mapping.outcome === 'unresolved')
	const routeLoaderSelectorTransforms = facts
		.filter((fact): fact is RouteLoaderSelectorTransformFact => fact.kind === 'route.loader-selector-transform')
	const routeLoaderTransformFamilies = routeLoaderSelectorTransforms.map((transform) => ({
		family: (
			transform.value.simpleDirectParamShape && transform.value.importedSymbols.length === 0 ?
				'direct-param'
			: transform.value.simpleDirectParamShape ?
				'direct-param-with-import'
			: transform.value.importedSymbols.length > 0 ?
				'custom-transform-with-import'
			:
				'custom-transform'
		),
		entity: transform.value.entity,
		routePath: transform.value.routePath,
		visiblePath: transform.value.visiblePath,
		params: transform.value.params,
		selectorFields: transform.value.selectorFields,
		importedSymbols: transform.value.importedSymbols,
		sourceFile: transform.sourceFile,
	}))
	const viewQualityRows = viewQualityIssues(ownershipRows)

	writeJsonl('.generated/ledgers/schema.jsonl', facts.filter((fact) => fact.kind.startsWith('schema.')))
	writeJsonl('.generated/ledgers/views.jsonl', facts.filter((fact) => fact.kind.startsWith('view.')))
	writeJsonl('.generated/ledgers/routes.jsonl', facts.filter((fact) => fact.kind.startsWith('route.')))
	writeJsonl('.generated/ledgers/selector-route-mappings.jsonl', routeSelectorMappings)
	writeJsonl('.generated/ledgers/route-loader-selector-transforms.jsonl', routeLoaderSelectorTransforms)
	writeJsonl('.generated/ledgers/route-loader-transform-families.jsonl', routeLoaderTransformFamilies)
	writeJsonl('.generated/ledgers/unmapped-selectors.jsonl', unmappedSelectors)
	writeJsonl('.generated/ledgers/route-pattern-families.jsonl', routePatternFamilies)
	writeJsonl('.generated/ledgers/sources.jsonl', facts.filter((fact) => fact.kind.startsWith('source.')))
	writeJsonl('.generated/ledgers/resolvers.jsonl', facts.filter((fact) => fact.kind.startsWith('resolver.')))
	writeJsonl('.generated/ledgers/invariants.jsonl', facts.filter((fact) => fact.kind.startsWith('invariant.')))
	writeJsonl('.generated/ledgers/view-fidelity.jsonl', facts.filter((fact) => fact.kind === 'view.capability' || fact.kind === 'view.reference'))
	writeJsonl('.generated/ledgers/view-quality.jsonl', viewQualityRows)
	writeJsonl('.generated/ledgers/probes.jsonl', facts.filter((fact) => fact.kind.startsWith('test.')))
	writeJsonl('.generated/ledgers/patterns.jsonl', patternRows)
	writeJsonl('.generated/ledgers/concepts.jsonl', conceptRows)
	writeJsonl('.generated/ledgers/decisions.jsonl', decisionRows)
	writeJsonl('.generated/ledgers/boundary-violations.jsonl', boundaryViolations)
	writeJsonl('.generated/ledgers/route-pattern-violations.jsonl', routePatternViolations)
	writeJsonl('.generated/ledgers/ownership.jsonl', ownershipRows)
	writeJsonl('.generated/ledgers/stale-generated-files.jsonl', staleGeneratedRows)
	writeText('.generated/ledgers/ownership-summary.json', JSON.stringify(summary, null, '\t'))

	writeText('.generated/reports/inventory.md', [
		'# Inventory Report',
		'',
		...Object.entries(roleCounts(files)).map(([role, count]) => `- ${role}: ${count}`),
		'',
		'## Unknown Files',
		'',
		...(unknownFiles.length === 0 ? ['None'] : unknownFiles.map((file) => `- ${file.path}`)),
	].join('\n'))

	writeText('.generated/reports/audit.md', [
		'# APP Pipeline Audit',
		'',
		`Witness files: ${files.length}`,
		`Extracted facts: ${facts.length}`,
		`Pattern rows: ${patternRows.length}`,
		`Concept rows: ${conceptRows.length}`,
		`Decision rows: ${decisionRows.length}`,
		`Schema selector rows: ${schemaSelectors.length}`,
		`Selector route mappings: ${routeSelectorMappings.length}`,
		`Unmapped selectors: ${unmappedSelectors.length}`,
		`Unresolved selector mappings: ${unresolvedSelectorMappings.length}`,
		`Route loader selector transforms: ${routeLoaderSelectorTransforms.length}`,
		`Unknown files: ${unknownFiles.length}`,
		`Boundary violations: ${boundaryViolations.length}`,
		`Route pattern violations: ${routePatternViolations.length}`,
		`View quality issues: ${viewQualityRows.length}`,
		`Stale generated files: ${staleGeneratedRows.length}`,
		`Generated-owned rows: ${summary.generated}`,
		`Hand-owned rows preserved: ${summary.handOwned}`,
		`Hand-owned entity views remaining: ${summary.remainingHandOwnedGeneratedSurface.views}`,
		`Hand-owned route pages remaining: ${summary.remainingHandOwnedGeneratedSurface.routes}`,
		`Hand-owned route sections remaining: ${summary.remainingHandOwnedGeneratedSurface.routeSections}`,
		'',
		'## Boundary Violations',
		'',
		...(boundaryViolations.length === 0 ? ['None'] : boundaryViolations.map((violation) => `- ${violation.path}:${violation.line} ${violation.text}`)),
		'',
		'## Route Pattern Violations',
		'',
		...(routePatternViolations.length === 0 ? ['None'] : routePatternViolations.map((violation) => `- ${violation.path}`)),
		'',
		'## View Quality Issues',
		'',
		...(viewQualityRows.length === 0 ? ['None'] : [
			...Object.entries(Object.groupBy(viewQualityRows, (row) => row.kind))
				.sort(([left], [right]) => left.localeCompare(right))
				.map(([kind, rows]) => `- ${kind}: ${rows?.length ?? 0}`),
		]),
		'',
		'## Stale Generated Files',
		'',
		...(staleGeneratedRows.length === 0 ? ['None'] : staleGeneratedRows.map((row) => `- ${row.activePath} — ${row.reason}`)),
		'',
		'## Unmapped Selectors',
		'',
		...(unmappedSelectors.length === 0 ? ['None'] : unmappedSelectors.map((selector) => `- ${selector.entity}:${selector.selector}`)),
		'',
		'## Unresolved Selector Mappings',
		'',
		...(unresolvedSelectorMappings.length === 0 ? ['None'] : unresolvedSelectorMappings.map((mapping) => `- ${mapping.entity}:${mapping.selector}${mapping.reason === undefined ? '' : ` — ${mapping.reason}`}`)),
		'',
		'## Route Loader Transform Families',
		'',
		...Object.entries(Object.groupBy(routeLoaderTransformFamilies, (row) => row.family))
			.sort(([left], [right]) => left.localeCompare(right))
			.map(([family, rows]) => `- ${family}: ${rows?.length ?? 0}`),
	].join('\n'))

	writeText('.generated/reports/view-quality.md', [
		'# View Quality',
		'',
		...Object.entries(Object.groupBy(viewQualityRows, (row) => row.kind))
			.sort(([left], [right]) => left.localeCompare(right))
			.map(([kind, rows]) => `- ${kind}: ${rows?.length ?? 0}`),
		'',
		'## High Severity',
		'',
		...(
			viewQualityRows.filter((row) => row.severity === 'high').length === 0 ?
				['None']
			:
				viewQualityRows
					.filter((row) => row.severity === 'high')
					.slice(0, 200)
					.map((row) => `- ${row.entity}: ${row.kind} — ${row.detail}`)
		),
		'',
		'## Medium Severity Sample',
		'',
		...(
			viewQualityRows.filter((row) => row.severity === 'medium').length === 0 ?
				['None']
			:
				viewQualityRows
					.filter((row) => row.severity === 'medium')
					.slice(0, 200)
					.map((row) => `- ${row.entity}: ${row.kind} — ${row.detail}`)
		),
	].join('\n'))

	writeText('.generated/reports/patterns.md', [
		'# Pattern Families',
		'',
		...Object.entries(Object.groupBy(patternRows, (row) => row.family))
			.sort(([left], [right]) => left.localeCompare(right))
			.map(([family, rows]) => `- ${family}: ${rows?.length ?? 0}`),
		'',
		'## Route Families',
		'',
		...Object.entries(Object.groupBy(routePatternFamilies, (row) => row.family))
			.sort(([left], [right]) => left.localeCompare(right))
			.map(([family, rows]) => `- ${family}: ${rows?.length ?? 0}`),
		'',
		'## Route Loader Transform Families',
		'',
		...Object.entries(Object.groupBy(routeLoaderTransformFamilies, (row) => row.family))
			.sort(([left], [right]) => left.localeCompare(right))
			.map(([family, rows]) => `- ${family}: ${rows?.length ?? 0}`),
	].join('\n'))

	writeText('.generated/reports/concepts.md', [
		'# Concepts',
		'',
		...conceptRows.slice(0, 500).map((concept) => `- ${concept.family}: ${concept.concept} (${concept.factCount} facts, ${concept.sourceFiles.length} files)`),
		...(conceptRows.length > 500 ? [`- ... ${conceptRows.length - 500} more concepts`] : []),
	].join('\n'))

	writeText('.generated/reports/decisions.md', [
		'# Product Decisions',
		'',
		...Object.entries(Object.groupBy(decisionRows, (row) => row.decision))
			.sort(([left], [right]) => left.localeCompare(right))
			.map(([decision, rows]) => `- ${decision}: ${rows?.length ?? 0}`),
		'',
		'## Areas',
		'',
		...Object.entries(Object.groupBy(decisionRows, (row) => row.area))
			.sort(([left], [right]) => left.localeCompare(right))
			.map(([area, rows]) => `- ${area}: ${rows?.length ?? 0}`),
	].join('\n'))

	if (unknownFiles.length > 0 || boundaryViolations.length > 0 || routePatternViolations.length > 0 || unmappedSelectors.length > 0 || unresolvedSelectorMappings.length > 0) {
		console.error(`Audit failed: ${unknownFiles.length} unknown files, ${boundaryViolations.length} boundary violations, ${routePatternViolations.length} route pattern violations, ${unmappedSelectors.length} unmapped selectors, ${unresolvedSelectorMappings.length} unresolved selector mappings`)
		process.exit(1)
	}

	console.log(`Audit passed: ${files.length} witness files, ${facts.length} facts`)
}
