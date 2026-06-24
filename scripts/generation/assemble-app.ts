import { existsSync } from 'node:fs'

import { extract } from './extract.ts'
import { readText, writeText } from './files.ts'

type SchemaFactValue =
	| {
		name: string
	}
	| {
		entity: string
		name: string
		fields: string[]
	}
	| {
		entity: string
		name: string
		cardinality: string
		typeText: string
	}
	| {
		entity: string
		sourceBinding: string
	}
	| {
		entity: string
		view: string
	}
	| {
		name: string
		value: string
	}
	| {
		source: string
		status: string
	}
	| {
		source: string
		entity: string
		status: string
	}
	| {
		entity: string
		label: string
	}
	| {
		entity: string
		labelPlural: string
	}
	| {
		entity: string
		description: string
	}
	| {
		entity: string
		notes: string
	}
	| {
		entity: string
		field: string
		label?: string
		labelPlural?: string
		description?: string
	}
	| {
		entity: string
		fields: string[]
		member: string
		value: string
	}
	| {
		entity: string
		name: string
		members: {
			name: string
			value: string
		}[]
	}
	| {
		path: string
		suite: 'route' | 'boundary' | 'cors'
	}

type SchemaFact = {
	kind: string
	value: SchemaFactValue
	sourceFile: string
	sourceRole: string
	sourceLine?: number
}

type AppEntity = {
	name: string
	label?: string
	labelPlural?: string
	description?: string
	notes?: string
	enums?: {
		name: string
		members: {
			name: string
			value: string
		}[]
	}[]
	selectors: {
		name: string
		fields: string[]
		member?: string
		value?: string
	}[]
	fields: {
		name: string
		type: string
		cardinality: string
		label?: string
		labelPlural?: string
		description?: string
	}[]
	sourceBindings: string[]
	view?: string
}

type AppSourceProvider = {
	id: string
	label: string
}

type AppSource = {
	id: string
	provider: string
	label: string
}

type AppSourceBinding = {
	id: string
	source: string
	target: string
}

type AppRuntimeSourceBinding = {
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
}

type AppRuntimeSourceArtifact = {
	source: string
	kind: string
	path: string
	generated: boolean
}

type AppProbe = {
	path: string
}

type AppEntityView = {
	entity: string
	kind: 'singular' | 'plural'
	file: string
	ownership: 'generated' | 'hand-owned'
}

type AppEntityViewShell = {
	entity: string
	viewName: string
	file: string
	capabilities: string[]
	sourceText?: string
	sourceFile: string
}

type AppRouteSection = {
	id: string
	path: string
}

type AppRoutePage = {
	id: string
	path: string
	ownership: 'generated' | 'hand-owned'
}

type AppSelectorRouteMapping = {
	entity: string
	selector: string
	fields: string[]
	outcome:
		| 'canonical'
		| 'alias'
		| 'nested'
		| 'observation'
		| 'hub-backed'
		| 'internal-only'
		| 'collision-disambiguated'
		| 'unresolved'
	path?: string
	visiblePath?: string
	emitPage?: boolean
	parentFields: string[]
	localFields: string[]
	params: {
		field: string
		name: string
		matcher?: string
	}[]
	unresolved: string[]
	reason?: string
}

type AppHubCollectionRoute = {
	entity: string
	hub: string
	path: string
	view: string
	unresolved: string[]
}

type AppRouteLoaderTransform = {
	entity: string
	routePath: string
	visiblePath: string
	params: string[]
	selectorFields: string[]
	importedSymbols: string[]
	selectorExpression: string
	simpleDirectParamShape: boolean
	sourceFile: string
}

type AppRoutePageShell = {
	routePath: string
	visiblePath: string
	routeGroupPath: string
	components: string[]
	usesDataSelector: boolean
	usesParams: boolean
	usesSelect: boolean
	kind: 'global-collection' | 'global-source-collection' | 'data-selector-detail' | 'data-selector-simple-detail' | 'data-selector-child-collection' | 'param-id-detail' | 'param-selector-detail' | 'scope-detail' | 'direct-selector-detail' | 'derived-selector-detail' | 'linked-view' | 'simple-view' | 'catalog-param-detail' | 'global-hub-tabs' | 'eip155-network-collection' | 'evm-protocol-collection' | 'youtube-parent-collection' | 'social-network-child-collection' | 'decoded-parent-child-collection' | 'decoded-param-detail' | 'lens-account-detail' | 'proposal-selector-detail' | 'placeholder' | 'param-heading' | 'static-page' | 'custom'
	viewComponent?: string
	viewFile?: string
	entityType?: string
	paramName?: string
	selectorExpression?: string
	selectorImportStyle?: 'sectioned'
	selectorDeclaration?: string
	routeImports?: string[]
	functionImports?: string[]
	selectorGuard?: string
	invalidText?: string
	invalidOutsidePage?: boolean
	viewProps?: string[]
	derivedConstants?: {
		name: string
		expression: string
	}[]
	importEntitySelectorType?: boolean
	importEip155NetworkSelectorFromCaip2?: boolean
	importZeroExHex?: boolean
	zeroExHexImportSymbols?: string
	zeroExHexImportWithSchemaImports?: boolean
	importWith0xHex?: boolean
	with0xHexImportSection?: 'types' | 'functions'
	typeConstantsAfterSchemaImports?: boolean
	paramsMultiline?: boolean
	componentIndentExtra?: boolean
	explicitClosingTag?: boolean
	scope?: string
	hrefExpression?: string
	childField?: string
	collectionEntityType?: string
	globalScope?: string
	globalField?: string
	globalSourceField?: string
	globalSourceSources?: string[]
	globalSourceIndentExtra?: boolean
	globalSourceOmitContextSection?: boolean
	id?: string
	limit?: number
	title?: string
	titleExpression?: string
	headTitle?: string
	sortMode?: string
	catalogImports?: string[]
	catalogParamType?: string
	catalogRowsName?: string
	catalogRowName?: string
	catalogLookupName?: string
	catalogLookupField?: string
	catalogRouteKey?: string
	catalogTitleExpression?: string
	catalogNotFoundCondition?: string
	catalogMissingText?: string
	catalogUnknownText?: string
	catalogNotFoundId?: string
	catalogDetailId?: string
	hubKey?: string
	hubScope?: string
	hubTitleExpression?: string
	hubHref?: string
	hubSections?: {
		id: string
		label: string
		viewComponent?: string
		href?: string
		globalField?: string
		viewId?: string
		placeholderText?: string
	}[]
	networkCollectionField?: string
	networkCollectionSources?: string[]
	networkCollectionCount?: boolean
	networkCollectionInlineSources?: boolean
	networkCollectionHrefAfterSelection?: boolean
	networkCollectionTightContextState?: boolean
	protocolCollectionField?: string
	parentSelectorField?: string
	parentSelectorParam?: string
	parentSelectorTransform?: 'lowercase' | 'number'
	networkScope?: string
	placeholderText?: string
	placeholderMultiline?: boolean
	staticWrapper?: 'section-column' | 'main-card'
	staticTitle?: string
	staticLinks?: {
		label: string
		route: string
	}[]
	proposalLevel?: 'realm' | 'kind' | 'proposal'
	collapsible?: boolean
	open?: boolean
	viewImportBeforePage?: boolean
	stateComment?: string
	blankLineBeforeComponents?: boolean
	blankLineBeforePageClose?: boolean
	sources?: string[]
	sourceText?: string
	sourceFile: string
}

type AppRouteSectionShell = Omit<
	AppRoutePageShell,
	| 'kind'
	| 'viewComponent'
	| 'selectorExpression'
	| 'importEntitySelectorType'
	| 'typeConstantsAfterSchemaImports'
	| 'hrefExpression'
	| 'globalScope'
	| 'globalField'
	| 'id'
	| 'limit'
	| 'title'
	| 'collapsible'
	| 'open'
	| 'sources'
	| 'sourceText'
> & {
	kind: 'parent-collapsible' | 'nested-parent-collapsible' | 'page-param-parent-collapsible' | 'param-summary-collapsible' | 'keyed-param-summary-collapsible' | 'scope-summary-collapsible' | 'page-param-summary-collapsible' | 'proposal-parent-collapsible' | 'passthrough' | 'custom'
	viewComponent?: string
	entityType?: string
	scope?: string
	derivedConstants?: {
		name: string
		expression: string
	}[]
	selectorExpression?: string
	title?: string
	viewTitle?: string
	titleExpression?: string
	hrefExpression?: string
	hrefWrapped?: boolean
	idExpression?: string
	keyExpression?: string
	nestedParents?: {
		title: string
		hrefExpression: string
		idExpression: string
	}[]
	childrenName?: string
	usesEip155NetworkSelectorFromCaip2?: boolean
	usesStringify?: boolean
	sourceText?: string
}

type AppResolverCoverage = {
	entity: string
	source: string
	status:
		| 'implemented'
		| 'no resolver'
		| 'deferred-schema'
		| 'deferred-runtime'
		| 'deferred-artifact'
}

type AppResolverCoverageLedgerRow = {
	source: string
	status: AppResolverCoverage['status']
	providerBinding: string
	resolverFile: string
	sourceRuntimeArtifacts: string
	schemaEntitiesTouched: string
	actionValidationRisk: string
}

const cardinalityBySchemaSuffix = new Map([
	['!', 'One'],
	['?', 'ZeroOrOne'],
	['*', 'Many'],
	['0', 'Zero'],
	['One', 'One'],
	['ZeroOrMany', 'ZeroOrMany'],
	['unknown', 'unknown'],
])

const readJsonl = <_Row>(path: string): _Row[] => {
	if (!existsSync(path))
		return []

	return readText(path)
		.split('\n')
		.filter(Boolean)
		.map((line) => JSON.parse(line) as _Row)
}

export const schemaFactsToEntities = (facts: readonly SchemaFact[]) => {
	const entityByName = new Map<string, AppEntity>()

	for (const fact of facts) {
		if (fact.sourceFile !== 'SCHEMA.md')
			continue

		if (fact.kind === 'schema.entity') {
			const { name } = fact.value as { name: string }

			entityByName.set(name, {
				name,
				enums: [],
				selectors: [],
				fields: [],
				sourceBindings: [],
			})
		}
	}

	for (const fact of facts) {
		if (fact.kind === 'schema.enum') {
			const value = fact.value as {
				entity: string
				name: string
				members: {
					name: string
					value: string
				}[]
			}

			if (fact.sourceFile === `src/schema/${value.entity}.ts`)
				(entityByName.get(value.entity)?.enums ?? []).push({
					name: value.name,
					members: value.members,
				})

			continue
		}

		if (fact.sourceFile !== 'SCHEMA.md')
			continue

		if (fact.kind === 'schema.selector') {
			const value = fact.value as {
				entity: string
				name: string
				fields: string[]
			}
			const memberFact = facts.find((candidate) => {
				if (candidate.kind !== 'schema.selector-member')
					return false

				const candidateValue = candidate.value as {
					entity: string
					fields: string[]
				}

				return (
					candidateValue.entity === value.entity
					&& candidateValue.fields.join('+') === value.fields.join('+')
					&& candidate.sourceFile === `src/schema/${value.entity}.ts`
				)
			})?.value as {
				member?: string
				value?: string
			} | undefined

			entityByName.get(value.entity)?.selectors.push({
				name: value.name,
				fields: value.fields,
				...(memberFact?.member === undefined ? {} : {
					member: memberFact.member,
				}),
				...(memberFact?.value === undefined ? {} : {
					value: memberFact.value,
				}),
			})
		}
		else if (fact.kind === 'schema.label') {
			const value = fact.value as {
				entity: string
				label: string
			}
			const entity = entityByName.get(value.entity)

			if (entity)
				entity.label = value.label
		}
		else if (fact.kind === 'schema.label-plural') {
			const value = fact.value as {
				entity: string
				labelPlural: string
			}
			const entity = entityByName.get(value.entity)

			if (entity)
				entity.labelPlural = value.labelPlural
		}
		else if (fact.kind === 'schema.description') {
			const value = fact.value as {
				entity: string
				description: string
			}
			const entity = entityByName.get(value.entity)

			if (entity)
				entity.description = value.description
		}
		else if (fact.kind === 'schema.notes') {
			const value = fact.value as {
				entity: string
				notes: string
			}
			const entity = entityByName.get(value.entity)

			if (entity)
				entity.notes = value.notes
		}
		else if (fact.kind === 'schema.field') {
			const value = fact.value as {
				entity: string
				name: string
				cardinality: string
				typeText: string
			}
			entityByName.get(value.entity)?.fields.push({
				name: value.name,
				type: value.typeText,
				cardinality: cardinalityBySchemaSuffix.get(value.cardinality) ?? value.cardinality,
			})
		}
		else if (fact.kind === 'schema.field-metadata') {
			const value = fact.value as {
				entity: string
				field: string
				label?: string
				labelPlural?: string
				description?: string
			}
			const field = entityByName.get(value.entity)?.fields.find((field) => field.name === value.field)

			if (field) {
				field.label = value.label
				field.labelPlural = value.labelPlural
				field.description = value.description
			}
		}
		else if (fact.kind === 'schema.source-binding') {
			const value = fact.value as {
				entity: string
				sourceBinding: string
			}
			entityByName.get(value.entity)?.sourceBindings.push(value.sourceBinding)
		}
		else if (fact.kind === 'schema.view-row') {
			const value = fact.value as {
				entity: string
				view: string
			}
			const entity = entityByName.get(value.entity)

			if (entity)
				entity.view = value.view
		}
	}

	return [...entityByName.values()].map((entity) => ({
		name: entity.name,
		...(entity.label === undefined ? {} : {
			label: entity.label,
		}),
		...(entity.labelPlural === undefined ? {} : {
			labelPlural: entity.labelPlural,
		}),
		...(entity.description === undefined ? {} : {
			description: entity.description,
		}),
		...(entity.notes === undefined ? {} : {
			notes: entity.notes,
		}),
		...((entity.enums ?? []).length === 0 ? {} : {
			enums: entity.enums,
		}),
		selectors: entity.selectors.map((selector) => ({
			name: selector.name,
			fields: selector.fields,
			...(selector.member === undefined ? {} : {
				member: selector.member,
			}),
			...(selector.value === undefined ? {} : {
				value: selector.value,
			}),
		})),
		fields: entity.fields.map((field) => ({
			name: field.name,
			type: field.type,
			cardinality: field.cardinality,
			...(field.label === undefined ? {} : {
				label: field.label,
			}),
			...(field.labelPlural === undefined ? {} : {
				labelPlural: field.labelPlural,
			}),
			...(field.description === undefined ? {} : {
				description: field.description,
			}),
		})),
		sourceBindings: entity.sourceBindings,
		...(entity.view === undefined ? {} : {
			view: entity.view,
		}),
	}))
}

export const factsToSourceProviders = (facts: readonly SchemaFact[]): AppSourceProvider[] => (
	facts
		.filter((fact) => fact.kind === 'source.enum-member')
		.filter((fact) => fact.sourceFile === 'src/sources/SourceProvider.ts')
		.map((fact) => {
			const value = fact.value as {
				value: string
			}

			return {
				id: value.value,
				label: value.value,
			}
		})
)

export const factsToSources = (facts: readonly SchemaFact[]): AppSource[] => (
	facts
		.filter((fact) => fact.kind === 'source.enum-member')
		.filter((fact) => fact.sourceFile === 'src/sources/Source.ts')
		.map((fact) => {
			const value = fact.value as {
				value: string
			}

			return {
				id: value.value,
				provider: value.value.split('_')[0],
				label: value.value,
			}
		})
)

export const factsToProbes = (
	facts: readonly SchemaFact[],
	suite: 'route' | 'boundary' | 'cors'
): AppProbe[] => (
	[
		...new Set(
			facts
				.filter((fact) => fact.kind === 'test.probe-path')
				.map((fact) => fact.value as {
					path: string
					suite: 'route' | 'boundary' | 'cors'
				})
				.filter((probe) => probe.suite === suite)
				.map((probe) => probe.path)
		),
	].sort().map((path) => ({
		path,
	}))
)

export const schemaFactsToSourceBindings = (facts: readonly SchemaFact[]): AppSourceBinding[] => (
	[...facts
		.filter((fact) => fact.kind === 'schema.source-binding')
		.reduce((bindingByIdAndTarget, fact) => {
			const value = fact.value as {
				entity: string
				sourceBinding: string
			}
			const key = `${value.sourceBinding}:${value.entity}`

			bindingByIdAndTarget.set(key, {
				id: value.sourceBinding,
				source: value.sourceBinding,
				target: value.entity,
			})

			return bindingByIdAndTarget
		}, new Map<string, AppSourceBinding>())
		.values()]
)

export const factsToRuntimeSourceBindings = (facts: readonly SchemaFact[]): AppRuntimeSourceBinding[] => (
	facts
		.filter((fact) => fact.kind === 'source.binding-row')
		.map((fact) => {
			const value = fact.value as {
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
			}

			return value
		})
)

export const factsToRuntimeSourceArtifacts = (facts: readonly SchemaFact[]): AppRuntimeSourceArtifact[] => (
	facts
		.filter((fact) => fact.kind === 'source.binding-artifact')
		.map((fact) => {
			const value = fact.value as {
				source: string
				kind: string
				path: string
				generated: boolean
			}

			return value
		})
)

export const factsToEntityViews = (facts: readonly SchemaFact[]): AppEntityView[] => (
	[...facts
		.filter((fact) => fact.kind === 'schema.entity')
		.filter((fact) => fact.sourceFile === 'SCHEMA.md')
		.reduce((entityNames, fact) => {
			const value = fact.value as {
				name: string
			}

			entityNames.add(value.name)

			return entityNames
		}, new Set<string>())]
		.flatMap((entityName) => (
			facts
				.filter((fact) => fact.kind === 'view.svelte-file')
				.filter((fact) => fact.sourceFile === `src/views/${entityName}View.svelte`)
				.map((fact) => ({
					entity: entityName,
					kind: 'singular',
					file: fact.sourceFile,
					ownership: fact.sourceRole === 'active-generated' ? 'generated' : 'hand-owned',
				}))
		))
)

export const factsToEntityViewShells = (
	facts: readonly SchemaFact[],
	entityViews: readonly AppEntityView[],
	entities: readonly AppEntity[]
): AppEntityViewShell[] => {
	const entityViewFiles = new Set(entityViews.map((view) => view.file))
	const entityByName = Object.fromEntries(entities.map((entity) => [
		entity.name,
		entity,
	]))

	return facts
		.filter((fact) => fact.kind === 'view.entity-shell')
		.filter((fact) => entityViewFiles.has(fact.sourceFile))
		.map((fact) => {
			const value = fact.value as Omit<AppEntityViewShell, 'sourceFile'>

			return {
				entity: value.entity,
				viewName: value.viewName,
				file: value.file,
				capabilities: value.capabilities,
				...(isGeneratedEntityViewShell(entityByName[value.entity], value.sourceText) ? {} : {
					sourceText: value.sourceText,
				}),
				sourceFile: fact.sourceFile,
			}
		})
}

export const factsToRouteSections = (facts: readonly SchemaFact[]): AppRouteSection[] => (
	facts
		.filter((fact) => fact.kind === 'route.file')
		.filter((fact) => fact.sourceFile.startsWith('src/routes/'))
		.filter((fact) => fact.sourceFile.endsWith('/+layout.svelte'))
		.map((fact) => {
			const path = fact.sourceFile.replace(/^src\/routes\//, '').replace(/(?:^|\/)\+layout\.svelte$/, '')

			return {
				id: path || 'root',
				path,
			}
		})
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

const isGeneratedEntityViewShell = (
	entity: AppEntity | undefined,
	sourceText: string
) => (
	entity !== undefined
	&& sourceText.includes('const view =')
	&& sourceText.includes('<EntityView2')
	&& !sourceText.includes('ResourceBoundary')
	&& !sourceText.includes('{#snippet')
	&& !sourceText.includes('Render:')
	&& !sourceText.includes('Content:')
	&& !sourceText.includes('import { select }')
)

const routeParamNames = (
	path: string
) => [
	...path.matchAll(/\[([^=\]]+)(?:=[^\]]+)?\]/g),
].map((match) => match[1] ?? '')

const selectorRouteMappingEmitsPage = (
	mapping: AppSelectorRouteMapping
) => (
	mapping.path !== undefined
	&& !hasRejectedRouteShape(mapping.path)
	&& routeParamNames(mapping.path).every((paramName) => mapping.params.some((param) => param.name === paramName))
	&& (mapping.emitPage ?? (mapping.outcome === 'canonical' || mapping.outcome === 'nested' || mapping.outcome === 'observation'))
)

export const factsToRoutePages = (facts: readonly SchemaFact[]): AppRoutePage[] => (
	facts
		.filter((fact) => fact.kind === 'route.file')
		.filter((fact) => fact.sourceFile.startsWith('src/routes/'))
		.filter((fact) => fact.sourceFile.endsWith('/+page.svelte'))
		.filter((fact) => !hasRejectedRouteShape(fact.sourceFile))
		.map((fact) => {
			const path = fact.sourceFile.replace(/^src\/routes\//, '').replace(/(?:^|\/)\+page\.svelte$/, '')

			return {
				id: path || 'root',
				path,
				ownership: fact.sourceRole === 'active-generated' ? 'generated' : 'hand-owned',
			}
		})
)

const selectorRouteMappingOutcome = (mapping: Omit<AppSelectorRouteMapping, 'outcome'>): AppSelectorRouteMapping['outcome'] => (
	mapping.unresolved.length > 0 && mapping.unresolved.every((issue) => issue.startsWith('path-conflict:')) ?
		'collision-disambiguated'
	: mapping.unresolved.length > 0 ?
		'unresolved'
	: mapping.emitPage === false ?
		'hub-backed'
	: mapping.visiblePath?.includes('/by/$') || mapping.visiblePath?.includes('/by/by-') ?
		'unresolved'
	: mapping.visiblePath !== undefined && /\/by\/[^/]+-[2-9](\/|$)/.test(mapping.visiblePath) ?
		'unresolved'
	: mapping.entity.startsWith('_Global') ?
		'hub-backed'
	: mapping.entity.endsWith('_Timestamp') || mapping.fields.includes('timestampMs') || mapping.fields.includes('source') ?
		'observation'
	: mapping.parentFields.length > 0 ?
		'nested'
	:
		'canonical'
)

const explicitSelectorRouteMappings = [
	{
		entity: 'BlockheadBridgeTransaction',
		selector: '$account+$sourceTx+createdAt',
		fields: [
			'$account',
			'$sourceTx',
			'createdAt',
		],
		outcome: 'canonical',
		path: '~/(accounts)/accounts/(transactions)/transaction/[chainId=eip155ChainId]/[address=evmAddress]/[sourceTxHash]/[createdAt]',
		visiblePath: '~/accounts/transaction/[chainId=eip155ChainId]/[address=evmAddress]/[sourceTxHash]/[createdAt]',
		parentFields: [
			'$account',
			'$sourceTx',
		],
		localFields: [
			'createdAt',
		],
		params: [],
		unresolved: [],
		reason: 'existing hand-owned account transaction route selects BlockheadBridgeTransaction',
	},
	{
		entity: 'EvmActorCoinAllowance',
		selector: 'evmAccountEvmContractSpenderInteropAddress',
		fields: [
			'$actor',
			'$contract',
			'$spender',
			'interopAddress',
		],
		outcome: 'canonical',
		path: '~/(accounts)/accounts/(allowances)/allowance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]/[spender=evmAddress]',
		visiblePath: '~/accounts/allowance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]/[spender=evmAddress]',
		parentFields: [
			'$actor',
			'$contract',
			'$spender',
		],
		localFields: [
			'interopAddress',
		],
		params: [],
		unresolved: [],
		reason: 'existing hand-owned account allowance route selects EvmActorCoinAllowance',
	},
	{
		entity: 'EvmNetworkActorCoinBalance',
		selector: 'evmAccountErc20CoinInstance',
		fields: [
			'$actor',
			'$contract',
		],
		outcome: 'canonical',
		path: '~/(accounts)/accounts/(balances)/balance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]',
		visiblePath: '~/accounts/balance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]',
		parentFields: [
			'$actor',
			'$contract',
		],
		localFields: [],
		params: [],
		unresolved: [],
		reason: 'existing hand-owned account balance route selects EvmNetworkActorCoinBalance',
	},
	{
		entity: 'BlockheadLightningChannelState',
		selector: '$localNodeState+$channel',
		fields: [
			'$localNodeState',
			'$channel',
		],
		outcome: 'hub-backed',
		path: '(explore)/(services)/services/blockhead-lightning-channel-states',
		visiblePath: 'services/blockhead-lightning-channel-states',
		emitPage: false,
		parentFields: [
			'$localNodeState',
			'$channel',
		],
		localFields: [],
		params: [],
		unresolved: [],
		reason: 'local Lightning channel state is exposed through the services hub collection; no active or reference detail route precedent exists',
	},
	{
		entity: 'BlockheadLightningChannelState_Timestamp',
		selector: '$channelState+timestampMs+source',
		fields: [
			'$channelState',
			'timestampMs',
			'source',
		],
		outcome: 'hub-backed',
		path: '(explore)/(services)/services/blockhead-lightning-channel-state-timestamps',
		visiblePath: 'services/blockhead-lightning-channel-state-timestamps',
		emitPage: false,
		parentFields: [
			'$channelState',
		],
		localFields: [
			'timestampMs',
			'source',
		],
		params: [],
		unresolved: [],
		reason: 'local Lightning channel state observations are exposed through the services hub collection; no active or reference detail route precedent exists',
	},
	{
		entity: 'BlockheadLightningHtlc',
		selector: '$channelState+htlcIndex',
		fields: [
			'$channelState',
			'htlcIndex',
		],
		outcome: 'hub-backed',
		path: '(explore)/(services)/services/blockhead-lightning-htlcs',
		visiblePath: 'services/blockhead-lightning-htlcs',
		emitPage: false,
		parentFields: [
			'$channelState',
		],
		localFields: [
			'htlcIndex',
		],
		params: [],
		unresolved: [],
		reason: 'local Lightning HTLC rows are exposed through the services hub collection; no active or reference detail route precedent exists',
	},
	{
		entity: 'EvmActorCoinAllowance_Block',
		selector: '$allowance+blockNumber+source',
		fields: [
			'$allowance',
			'blockNumber',
			'source',
		],
		outcome: 'hub-backed',
		path: '(explore)/(evm)/evm/evm-actor-coin-allowance-blocks',
		visiblePath: 'evm/evm-actor-coin-allowance-blocks',
		emitPage: false,
		parentFields: [
			'$allowance',
		],
		localFields: [
			'blockNumber',
			'source',
		],
		params: [],
		unresolved: [],
		reason: 'allowance block observations are exposed through the EVM hub collection; no active or reference detail route precedent exists',
	},
] as const satisfies AppSelectorRouteMapping[]

export const factsToSelectorRouteMappings = (facts: readonly SchemaFact[]): AppSelectorRouteMapping[] => (
	[
		...facts
		.filter((fact) => fact.kind === 'route.selector-mapping')
		.map((fact) => {
			const value = fact.value as {
				entity: string
				selector: string
				fields: string[]
				parentFields: string[]
				localFields: string[]
				path: string
				visiblePath: string
				emitPage?: boolean
				params: {
					field: string
					name: string
					matcher?: string
				}[]
				unresolved: string[]
			}
			const mapping = {
				entity: value.entity,
				selector: value.selector,
				fields: value.fields,
				path: value.path,
				visiblePath: value.visiblePath,
				emitPage: value.emitPage,
				parentFields: value.parentFields,
				localFields: value.localFields,
				params: value.params,
				unresolved: value.unresolved,
			}

			return {
				entity: mapping.entity,
				selector: mapping.selector,
				fields: mapping.fields,
				outcome: selectorRouteMappingOutcome(mapping),
				path: mapping.path,
				visiblePath: mapping.visiblePath,
				emitPage: mapping.path !== undefined && hasRejectedRouteShape(mapping.path) ? false : mapping.emitPage,
				parentFields: mapping.parentFields,
				localFields: mapping.localFields,
				params: mapping.params,
				unresolved: mapping.unresolved,
			}
		})
		.filter((mapping, _index, mappings) => !(
			mapping.path !== undefined
			&& mapping.path.includes('network/[caip2=networkCaip2]')
			&& mappings.some((candidate) => (
				candidate.entity === mapping.entity
				&& candidate.selector === mapping.selector
				&& candidate.fields.join('+') === mapping.fields.join('+')
				&& candidate.path?.includes('/network/[networkSlug=networkSlug]/')
			))
		)),
		...explicitSelectorRouteMappings.filter((explicitMapping) => !facts.some((fact) => {
			if (fact.kind !== 'route.selector-mapping')
				return false

			const value = fact.value as {
				entity: string
				fields: string[]
			}

			return value.entity === explicitMapping.entity && value.fields.join('+') === explicitMapping.fields.join('+')
		})),
	]
)

export const factsToHubCollectionRoutes = (facts: readonly SchemaFact[]): AppHubCollectionRoute[] => (
	facts
		.filter((fact) => fact.kind === 'route.hub-collection')
		.map((fact) => {
			const value = fact.value as AppHubCollectionRoute

			return {
				entity: value.entity,
				hub: value.hub,
				path: value.path,
				view: value.view,
				unresolved: value.unresolved,
			}
		})
)

export const factsToRouteLoaderTransforms = (facts: readonly SchemaFact[]): AppRouteLoaderTransform[] => (
	facts
		.filter((fact) => fact.kind === 'route.loader-selector-transform')
		.filter((fact) => fact.sourceFile.startsWith('src/routes/'))
		.filter((fact) => !hasRejectedRouteShape(fact.sourceFile))
		.map((fact) => {
			const value = fact.value as Omit<AppRouteLoaderTransform, 'sourceFile'>

			return {
				entity: value.entity,
				routePath: value.routePath,
				visiblePath: value.visiblePath,
				params: value.params,
				selectorFields: value.selectorFields,
				importedSymbols: value.importedSymbols,
				selectorExpression: value.selectorExpression,
				simpleDirectParamShape: value.simpleDirectParamShape,
				sourceFile: fact.sourceFile,
			}
		})
)

const factToRouteSvelteShell = (
	fact: SchemaFact
): AppRoutePageShell => {
	const value = fact.value as Omit<AppRoutePageShell, 'sourceFile'>
	const sourceText = value.sourceText ?? ''
	const catalogParamDetail = (
		value.routePath === '(assets)/(coins)/coin/[coinId]' ? {
			viewComponent: 'CoinView',
			entityType: 'Coin',
			paramName: 'coinId',
			catalogImports: [
				"import type { CoinId } from '$/constants/Coin.ts'",
				"import { coinById, coins } from '$/constants/Coin.ts'",
			],
			catalogParamType: 'CoinId',
			catalogRowsName: 'coins',
			catalogRowName: 'c',
			catalogLookupField: 'id',
			catalogRouteKey: 'coinId',
			catalogTitleExpression: "{route.coinId ? coinById[route.coinId]?.symbol ?? route.coinId : route.param || 'Coin'} – Coin",
			catalogNotFoundCondition: '!route.coinId',
			catalogUnknownText: 'Unsupported coin: ${route.param}',
			catalogMissingText: 'Coin required',
			catalogNotFoundId: 'coin-not-found',
			catalogDetailId: 'coin-detail-page',
			open: true,
		}
		: value.routePath === '(assets)/(currencies)/currency/[iso4217=iso4217]' ? {
			viewComponent: 'CurrencyView',
			entityType: 'Currency',
			paramName: 'iso4217',
			catalogImports: [
				"import {",
				"\tcurrencies,",
				"\tcurrencyByIso4217,",
				"\ttype Iso4217,",
				"} from '$/constants/Currency.ts'",
			],
			catalogParamType: 'Iso4217',
			catalogRowsName: 'currencies',
			catalogRowName: 'currency',
			catalogLookupField: 'iso4217',
			catalogRouteKey: 'iso4217',
			catalogTitleExpression: "{route.iso4217 ? currencyByIso4217[route.iso4217].name : route.param || 'Currency'}",
			catalogNotFoundCondition: 'route.iso4217 == null',
			catalogUnknownText: 'Unknown ISO&nbsp;4217 code.',
		}
		: value.routePath === '(assets)/(marketVenues)/market-venue/[marketVenueId=marketVenueId]' ? {
			viewComponent: 'MarketVenueView',
			entityType: 'MarketVenue',
			paramName: 'marketVenueId',
			catalogImports: [
				"import {",
				"\tmarketVenueById,",
				"\tmarketVenues,",
				"\ttype MarketVenueId,",
				"} from '$/constants/MarketVenue.ts'",
			],
			catalogParamType: 'MarketVenueId',
			catalogRowsName: 'marketVenues',
			catalogRowName: 'marketVenue',
			catalogLookupField: 'id',
			catalogRouteKey: 'marketVenueId',
			catalogTitleExpression: "{route.marketVenueId ? marketVenueById[route.marketVenueId].label : route.param || 'Market venue'}",
			catalogNotFoundCondition: 'route.marketVenueId == null',
			catalogUnknownText: 'Unknown market venue.',
		}
		: undefined
	)
	const globalHubTabs = (
		value.routePath === '~/accounts' ? {
			hubKey: 'accounts',
			hubScope: 'Accounts',
			hubTitleExpression: '"Accounts"',
			hubHref: '/~/accounts',
			hubSections: [
				{ id: 'connections', label: 'Connections', viewComponent: 'BlockheadWalletConnectionsView', viewId: 'wallet-connections' },
				{ id: 'watched-accounts', label: 'Watched accounts', viewComponent: 'EvmAccountsView', href: '/~/accounts/watched-accounts', globalField: '$$actors', viewId: 'accounts' },
				{ id: 'balances', label: 'Balances', viewComponent: 'EvmNetworkActorCoinBalancesView', href: '/~/accounts/balances', globalField: '$$actorCoins', viewId: 'balances' },
			],
		}
		: value.routePath === '~/manage' ? {
			hubKey: 'manage',
			hubScope: 'Manage',
			hubTitleExpression: '"Manage"',
			hubHref: '/~/manage',
			hubSections: [
				{ id: 'profiles', label: 'Profiles', placeholderText: 'Profiles are not wired yet.' },
				{ id: 'sources', label: 'Sources', viewComponent: 'BlockheadSourcesView', href: '/~/manage/sources', globalField: '$$blockheadSources', viewId: 'sources' },
			],
		}
		: value.routePath === '~/multiplayer' ? {
			hubKey: 'multiplayer',
			hubScope: 'Multiplayer',
			hubTitleExpression: "{'Multiplayer'}",
			hubHref: '/~/multiplayer',
			hubSections: [
				{ id: 'rooms', label: 'Rooms', viewComponent: 'BlockheadRoomsView', href: '/~/multiplayer/rooms', globalField: '$$blockheadRooms', viewId: 'rooms' },
				{ id: 'contacts', label: 'Contacts', viewComponent: 'BlockheadRoomPeersView', href: '/~/multiplayer/contacts', globalField: '$$blockheadRoomPeers', viewId: 'contacts' },
			],
		}
		: undefined
	)
	const eip155NetworkCollection = new Map<string, Partial<AppRoutePageShell>>([
		['(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/beacon-epochs', {
			viewComponent: 'BeaconEpochsView',
			networkCollectionField: '$$beaconEpochs',
			id: 'beacon-epochs',
			networkCollectionSources: ['Beacon_Rest'],
		}],
		['(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/beacon-slots', {
			viewComponent: 'BeaconSlotsView',
			networkCollectionField: '$$beaconSlots',
			id: 'beacon-slots',
			networkCollectionSources: ['Beacon_Rest'],
		}],
		['(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/blobs', {
			viewComponent: 'EvmBlobsView',
			networkCollectionField: '$$blobs',
			id: 'blobs',
			networkCollectionSources: ['Voltaire_JsonRpc'],
			limit: 8,
			hrefExpression: "'/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/blobs'",
			networkCollectionHrefAfterSelection: true,
		}],
		['(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/blocks', {
			viewComponent: 'EvmBlocksView',
			networkCollectionField: '$$blocks',
			id: 'blocks',
			networkCollectionSources: ['Voltaire_JsonRpc'],
			limit: 16,
			networkCollectionCount: true,
			hrefExpression: "'/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/blocks'",
		}],
		['(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/contracts', {
			viewComponent: 'EvmContractsView',
			networkCollectionField: '$$contracts',
			id: 'contracts',
			networkCollectionSources: ['Blockscout_Rest'],
			limit: 16,
			hrefExpression: "'/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/contracts'",
		}],
		['(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/precompiles', {
			viewComponent: 'EvmPrecompilesView',
			networkCollectionField: '$$precompiles',
			id: 'precompiles',
			networkCollectionSources: ['Constants_Internal'],
			limit: 64,
		}],
		['(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/transactions', {
			viewComponent: 'EvmTransactionsView',
			networkCollectionField: '$$transactions',
			id: 'transactions',
			networkCollectionSources: ['Blockscout_Rest'],
			limit: 8,
			hrefExpression: "'/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/transactions'",
			networkCollectionInlineSources: true,
		}],
		['(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/upgrades', {
			viewComponent: 'EthereumNetworkUpgradesView',
			networkCollectionField: '$$upgrades',
			id: 'upgrades',
			networkCollectionSources: ['Constants_Internal'],
			limit: 512,
			viewImportBeforePage: true,
			networkCollectionTightContextState: true,
		}],
	]).get(value.routePath)
	const evmProtocolCollection = new Map<string, Partial<AppRoutePageShell>>([
		['(explore)/(evm)/evm/errors', {
			viewComponent: 'EvmErrorsView',
			hrefExpression: "'/evm/errors'",
			protocolCollectionField: '$$evmErrors',
			id: 'errors',
		}],
		['(explore)/(evm)/evm/selectors', {
			viewComponent: 'EvmSelectorsView',
			hrefExpression: "'/evm/selectors'",
			protocolCollectionField: '$$evmSelectors',
			id: 'selectors',
		}],
		['(explore)/(evm)/evm/topics', {
			viewComponent: 'EvmTopicsView',
			hrefExpression: "'/evm/topics'",
			protocolCollectionField: '$$evmTopics',
			id: 'topics',
		}],
	]).get(value.routePath)
	const globalSourceCollection = new Map<string, Partial<AppRoutePageShell>>([
		['(explore)/proposals', {
			viewComponent: 'SpecificationRealmsView',
			globalSourceField: '$$specificationRealms',
			globalSourceSources: ['Constants_Internal'],
			id: 'proposal-realms',
			title: 'Proposals',
			globalSourceIndentExtra: true,
			globalSourceOmitContextSection: true,
		}],
		['(explore)/upgrades', {
			viewComponent: 'EthereumNetworkUpgradesView',
			globalSourceField: '$$networkUpgrades',
			globalSourceSources: ['Constants_Internal'],
			id: 'upgrades',
			limit: 512,
			viewImportBeforePage: true,
		}],
	]).get(value.routePath)
	const youtubeParentCollection = new Map<string, Partial<AppRoutePageShell>>([
		['(social)/(youtube)/youtube/channel/[channelId]/(channel)/videos', {
			viewComponent: 'YouTubeVideosView',
			entityType: 'YouTubeChannel',
			parentSelectorField: 'channelId',
			parentSelectorParam: 'channelId',
			childField: '$$videos',
			hrefExpression: "'/youtube/videos'",
			id: 'youtube-channel-videos',
		}],
		['(social)/(youtube)/youtube/channel/[channelId]/(channel)/playlists', {
			viewComponent: 'YouTubePlaylistsView',
			entityType: 'YouTubeChannel',
			parentSelectorField: 'channelId',
			parentSelectorParam: 'channelId',
			childField: '$$playlists',
			hrefExpression: "'/youtube/playlists'",
			id: 'youtube-channel-playlists',
		}],
		['(social)/(youtube)/youtube/playlist/[playlistId]/(playlist)/videos', {
			viewComponent: 'YouTubeVideosView',
			entityType: 'YouTubePlaylist',
			parentSelectorField: 'playlistId',
			parentSelectorParam: 'playlistId',
			childField: '$$videos',
			hrefExpression: "'/youtube/videos'",
			id: 'youtube-playlist-videos',
			title: 'Playlist videos',
		}],
	]).get(value.routePath)
	const socialNetworkChildCollection = new Map<string, Partial<AppRoutePageShell>>([
		['(social)/(nostr)/nostr/articles', {
			viewComponent: 'NostrArticlesView',
			entityType: 'NostrNetwork',
			networkScope: 'NostrNetwork',
			childField: '$$nostrArticles',
			id: 'nostr-articles',
			title: 'Articles',
		}],
		['(social)/(nostr)/nostr/reposts', {
			viewComponent: 'NostrRepostsView',
			entityType: 'NostrNetwork',
			networkScope: 'NostrNetwork',
			childField: '$$nostrReposts',
			id: 'nostr-reposts',
			title: 'Reposts',
		}],
	]).get(value.routePath)
	const dataSelectorSimpleDetail = new Map<string, Partial<AppRoutePageShell>>([
		['(social)/(rss)/rss/feed/[feedKey]', {
			viewComponent: 'RssFeedView',
			entityType: 'RssFeed',
		}],
		['(social)/(rss)/rss/item/[feedKey]/[guid]', {
			viewComponent: 'RssItemView',
			entityType: 'RssItem',
		}],
	]).get(value.routePath)
	const decodedParentChildCollection = new Map<string, Partial<AppRoutePageShell>>([
		['(social)/(lens)/lens/post/[postId]/(post)/comments', {
			viewComponent: 'LensCommentsView',
			entityType: 'LensPost',
			parentSelectorField: 'id',
			parentSelectorParam: 'postId',
			childField: '$$comments',
			hrefExpression: "'/lens'",
			id: 'lens-post-comments',
		}],
		['(social)/(reddit)/reddit/link/[fullname]/(link)/comments', {
			viewComponent: 'RedditCommentsView',
			entityType: 'RedditLink',
			parentSelectorField: 'fullname',
			parentSelectorParam: 'fullname',
			childField: '$$comments',
			hrefExpression: "'/reddit/comments'",
			id: 'reddit-link-comments',
		}],
		['(social)/(reddit)/reddit/comment/[fullname]/(comment)/replies', {
			viewComponent: 'RedditCommentsView',
			entityType: 'RedditComment',
			parentSelectorField: 'fullname',
			parentSelectorParam: 'fullname',
			childField: '$$replies',
			hrefExpression: "'/reddit/comments'",
			id: 'reddit-comment-replies',
			sortMode: 'createdAtAsc',
			title: 'Replies',
		}],
		['(social)/(reddit)/reddit/r/[name]/(subreddit)/links', {
			viewComponent: 'RedditLinksView',
			entityType: 'RedditSubreddit',
			parentSelectorField: 'name',
			parentSelectorParam: 'name',
			parentSelectorTransform: 'lowercase',
			childField: '$$links',
			hrefExpression: "'/reddit/links'",
			id: 'reddit-subreddit-links',
		}],
	]).get(value.routePath)
	const decodedParamDetail = new Map<string, Partial<AppRoutePageShell>>([
		['(social)/(atproto)/atproto/post/[...uri]', {
			viewComponent: 'AtprotoPostView',
			entityType: 'AtprotoPost',
			parentSelectorField: 'uri',
			parentSelectorParam: 'uri',
		}],
		['(social)/(farcaster)/farcaster/(accounts)/account/[accountId]', {
			viewComponent: 'BlockheadFarcasterAccountConnectionView',
			entityType: 'BlockheadFarcasterAccountConnection',
			parentSelectorField: 'fid',
			parentSelectorParam: 'accountId',
			parentSelectorTransform: 'number',
			title: 'Account',
			explicitClosingTag: false,
			blankLineBeforeComponents: false,
		}],
		['(social)/(lens)/lens/post/[postId]', {
			viewComponent: 'LensPostView',
			entityType: 'LensPost',
			parentSelectorField: 'id',
			parentSelectorParam: 'postId',
		}],
		['(social)/(reddit)/reddit/comment/[fullname]', {
			viewComponent: 'RedditCommentView',
			entityType: 'RedditComment',
			parentSelectorField: 'fullname',
			parentSelectorParam: 'fullname',
		}],
		['(social)/(reddit)/reddit/link/[fullname]', {
			viewComponent: 'RedditLinkView',
			entityType: 'RedditLink',
			parentSelectorField: 'fullname',
			parentSelectorParam: 'fullname',
		}],
		['(social)/(reddit)/reddit/r/[name]', {
			viewComponent: 'RedditSubredditView',
			entityType: 'RedditSubreddit',
			parentSelectorField: 'name',
			parentSelectorParam: 'name',
			parentSelectorTransform: 'lowercase',
		}],
		['(social)/(x)/x/post/[postId]', {
			viewComponent: 'XPostView',
			entityType: 'XPost',
			parentSelectorField: 'id',
			parentSelectorParam: 'postId',
		}],
	]).get(value.routePath)
	const proposalSelectorDetail = new Map<string, Partial<AppRoutePageShell>>([
		['(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]', {
			viewComponent: 'SpecificationRealmView',
			entityType: 'SpecificationRealm',
			proposalLevel: 'realm',
			invalidText: 'Unknown specification realm.',
		}],
		['(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]', {
			viewComponent: 'ProposalKindView',
			viewFile: 'SpecificationProposalKindView.svelte',
			entityType: 'SpecificationProposalKind',
			proposalLevel: 'kind',
			invalidText: 'Unknown proposal kind in this realm.',
		}],
		['(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]/(proposalKind)/[proposalRef=proposalRef]', {
			viewComponent: 'ProposalView',
			viewFile: 'SpecificationProposalView.svelte',
			entityType: 'SpecificationProposal',
			proposalLevel: 'proposal',
			invalidText: 'Invalid proposal id in URL.',
		}],
	]).get(value.routePath)
	const isLensAccountDetailRoute = (
		value.routePath === '(social)/(lens)/lens/account/[address=evmAddress]'
		|| value.routePath === '(social)/(lens)/lens/account/[address=evmAddress]/(account)/posts'
	)
	const globalCollectionMatch = sourceText.match(/EntityType\.([A-Za-z0-9_]+),\s*\{ scope: '([^']+)' \}\s*\)\.(\$\$[A-Za-z0-9_]+)/)
	const hrefExpression = sourceText.match(/\n\t\thref=\{([^]*?)\}\n/)?.[1]?.trim()
	const id = sourceText.match(/\n\t\tid="([^"]+)"/)?.[1]
	const limit = sourceText.match(/\n\t\tlimit=\{([0-9]+)\}/)?.[1]
	const title = sourceText.match(/\n\t\ttitle="([^"]+)"/)?.[1]
	const headTitle = sourceText.match(/<svelte:head>\n\t<title>([^<]+)<\/title>\n<\/svelte:head>/)?.[1]
	const collapsible = sourceText.match(/\n\t\tcollapsible=\{(true|false)\}/)?.[1]
	const open = sourceText.includes('\n\t\topen\n')
	const sources = [
		...sourceText.matchAll(/Source\.([A-Za-z0-9_]+)/g),
	].map((match) => match[1] ?? '')
		.filter((source) => source !== '' && source !== 'ts')
	const viewImport = value.components[1] === undefined ? undefined : `import ${value.components[1]} from '$/views/${value.components[1]}.svelte'`
	const importedViewFile = sourceText.match(/import [A-Za-z0-9_]+ from '\$\/views\/([^']+\.svelte)'/)?.[1]
	const pageImport = "import Page from '$/components/Page.svelte'"
	const dataSelectorDetailMatch = sourceText.match(/selection=\{\s*select\(\s*EntityType\.([A-Za-z0-9_]+),\s*data\.selector\s*\)\s*\}/)
	const dataSelectorChildCollectionMatch = sourceText.match(/selection=\{select\(\s*EntityType\.([A-Za-z0-9_]+),\s*data\.selector\s*\)\.(\$\$[A-Za-z0-9_]+)\}/)
	const paramIdDetailMatch = sourceText.match(/selection=\{select\(EntityType\.([A-Za-z0-9_]+), \{ id: params\.([A-Za-z0-9_]+) \}\)\}/)
	const paramSelectorDetailMatch = sourceText.match(/selection=\{select\(EntityType\.([A-Za-z0-9_]+), \{\n([^]*?)\n\t\t\}\)\}/)
	const scopeDetailMatch = sourceText.match(/selection=\{select\(EntityType\.([A-Za-z0-9_]+), \{\n\t\t\tscope: '([^']+)',\n\t\t\}\)\}/)
	const directSelectorInlinePageMatch = sourceText.match(/^<script lang="ts">\n\timport \{ EntityType \} from '\$\/schema\/EntityType\.ts'\n\timport \{ select \} from '\$\/routes\/\+layout\.svelte'\n(?<stateBlock>\t\/\/ State\n\tlet \{\n\t\tparams,\n\t\} = \$props\(\)\n\n(?<blankLineBeforeComponents>\n)?)?\t\/\/ Components\n\timport Page from '\$\/components\/Page\.svelte'\n\timport (?<viewComponent>[A-Za-z0-9_]+) from '\$\/views\/(?<viewFile>[^']+\.svelte)'\n<\/script>\n\n\n<Page>\n\t<\k<viewComponent>\n\t\tselection=\{select\(EntityType\.(?<entityType>[A-Za-z0-9_]+), (?<selectorExpression>[^\n]+)\)\}\n(?<viewProps>(?:\t\t[^\n]+\n)*)(?<closing>\t\/>|>\n\t<\/\k<viewComponent>>)\n<\/Page>\n$/)
	const directSelectorSectionedPageMatch = sourceText.match(/^<script lang="ts">\n\t\/\/ Types\/constants\n\timport \{ EntityType \} from '\$\/schema\/EntityType\.ts'\n\n\t\/\/ Context\n\timport \{ select \} from '\$\/routes\/\+layout\.svelte'\n\n\n(?<stateBlock>\t\/\/ State\n\tlet \{\n\t\tparams,\n\t\} = \$props\(\)\n\n(?<blankLineBeforeComponents>\n)?)?\t\/\/ Components\n\timport Page from '\$\/components\/Page\.svelte'\n\timport (?<viewComponent>[A-Za-z0-9_]+) from '\$\/views\/(?<viewFile>[^']+\.svelte)'\n<\/script>\n\n\n<Page>\n\t<\k<viewComponent>\n\t\tselection=\{select\(EntityType\.(?<entityType>[A-Za-z0-9_]+), (?<selectorExpression>[^\n]+)\)\}\n\t\/>\n<\/Page>\n$/)
	const directSelectorPageMatch = directSelectorInlinePageMatch ?? directSelectorSectionedPageMatch
	const simpleDerivedSelectorPageMatch = sourceText.match(/^<script lang="ts">\n\timport \{ EntityType \} from '\$\/schema\/EntityType\.ts'\n\timport \{ select \} from '\$\/routes\/\+layout\.svelte'\n\t\/\/ State\n\tlet \{\n\t\tparams,\n\t\} = \$props\(\)\n\n(?<functionImports>(?:\timport [^\n]+\n\n)?)\tconst selector = \$derived\(\n(?<selectorExpression>[^]*?)\n\t\)\n\n\n\t\/\/ Components\n\timport Page from '\$\/components\/Page\.svelte'\n\timport (?<viewComponent>[A-Za-z0-9_]+) from '\$\/views\/(?<viewFile>[^']+\.svelte)'\n<\/script>\n\n\n\{#if (?<selectorGuard>[^}]+)\}\n\t<Page>\n\t\t<\k<viewComponent>\n\t\t\tselection=\{select\(EntityType\.(?<entityType>[A-Za-z0-9_]+), selector\)\}\n(?<viewProps>(?:\t\t\t[A-Za-z0-9_]+\n)?)\t\t\/>\n\t<\/Page>\n\{:else\}\n\t<p role="alert">\n\t\t(?<invalidText>[^<\n]+)\n\t<\/p>\n\{\/if\}\n$/)
	const linkedViewPageMatch = sourceText.match(/^<script lang="ts">\n\t\/\/ Context\n\timport \{ resolve \} from '\$app\/paths'\n\n\n\t\/\/ Components\n\timport Page from '\$\/components\/Page\.svelte'\n\timport (?<viewComponent>[A-Za-z0-9_]+) from '\$\/views\/(?<viewFile>[^']+\.svelte)'\n<\/script>\n\n\n<Page>\n\t<\k<viewComponent>\n\t\thref=\{(?<hrefExpression>[^}]+)\}\n\t\tid="(?<id>[^"]+)"\n(?<titleLine>\t\ttitle=\{(?<titleExpression>[^}]+)\}\n)?\t\/>\n<\/Page>\n$/)
	const simpleViewPageMatch = sourceText.match(/^<script lang="ts">\n(?<stateBlock>\t\/\/ State\n\tlet \{\n\t\tparams,\n\t\} = \$props\(\)\n\n\n)?\t\/\/ Components\n(?<componentImports>\timport [^\n]+\n\timport [^\n]+\n)<\/script>\n\n\n<Page>\n\t<(?<viewComponent>[A-Za-z0-9_]+)(?<selfClosing> \/>|\n(?<viewProps>(?:\t\t[^\n]+\n)+)\t\/>)\n<\/Page>\n$/)
	const oneLinePlaceholderMatch = sourceText.match(/^<script lang="ts">\n\t\/\/ Components\n\timport Page from '\$\/components\/Page\.svelte'\n<\/script>\n\n\n<Page>\n\t<p data-text="muted">([^\n<]+)<\/p>\n<\/Page>\n$/)
	const multilinePlaceholderMatch = sourceText.match(/^<script lang="ts">\n\t\/\/ Components\n\timport Page from '\$\/components\/Page\.svelte'\n<\/script>\n\n\n<Page>\n\t<p data-text="muted">\n\t\t([^\n<]+)\n\t<\/p>\n<\/Page>\n$/)
	const paramHeadingMatch = sourceText.match(/^<script lang="ts">\n\t\/\/ State\n\tlet \{\n\t\tparams,\n\t\} = \$props\(\)\n\n\n\t\/\/ Components\n\timport Page from '\$\/components\/Page\.svelte'\n<\/script>\n\n\n<Page>\n\t<h1>\{params\.([A-Za-z0-9_]+)\}<\/h1>\n<\/Page>\n$/)
	const staticSectionHeadingMatch = sourceText.match(/^<section data-column>\n\t<h1>([^<]+)<\/h1>\n<\/section>\n$/)
	const staticMainCardLinkMatch = sourceText.match(/^<script lang="ts">\n\t\/\/ Context\n\timport \{ resolve \} from '\$app\/paths'\n<\/script>\n\n\n<main data-column>\n\t<section data-card>\n\t\t<h1>([^<]+)<\/h1>\n\n\t\t<a href=\{resolve\('([^']+)'\)\}>([^<]+)<\/a>\n\t<\/section>\n<\/main>\n$/)
	const derivedConstantMatches = [...sourceText.matchAll(/\n\tconst ([A-Za-z0-9_]+) = \$derived\(([^]*?)\)\n/g)]
	const zeroExHexImportSymbols = sourceText.match(/import \{ ([^}]+) \} from '\$\/schema\/ZeroExHex\.ts'/)?.[1]
	const stateComment = sourceText.match(/\n\t\/\/ (State|Props)\n\tlet \{/)?.[1]
	const matchingViewImport = value.components[1] === undefined ? undefined : `import ${value.components[1]} from '$/views/${value.components[1]}.svelte'`
	const importsMatchingViewComponent = (
		matchingViewImport !== undefined
		&& (
			sourceText.includes(matchingViewImport)
			|| sourceText.includes(`import ${value.components[1]} from '$/views/${importedViewFile ?? ''}'`)
				&& importedViewFile === `_${value.components[1]}.svelte`
		)
	)
	const multilineHrefExpression = sourceText.match(/\n\t\thref=\{([^]*?)\}\n\t\tselection=/)?.[1]?.trim()
	const isGlobalCollectionPage = (
		value.components.length === 2
		&& value.components[0] === 'Page'
		&& value.usesSelect
		&& !value.usesParams
		&& !value.usesDataSelector
		&& globalCollectionMatch !== null
		&& hrefExpression !== undefined
		&& (
			!sourceText.includes('<svelte:head>')
			|| headTitle !== undefined
		)
		&& !sourceText.includes('<p ')
		&& !sourceText.includes(`).${globalCollectionMatch?.[3] ?? ''}({`)
		&& !sourceText.includes('\n\t\torderByCreatedAt=')
		&& !sourceText.includes('\n\t\tplaceholderText=')
	)
	const isDataSelectorDetailPage = (
		value.components.length === 2
		&& value.components[0] === 'Page'
		&& value.usesSelect
		&& value.usesDataSelector
		&& !value.usesParams
		&& dataSelectorDetailMatch !== null
		&& !sourceText.includes('<svelte:head>')
		&& !sourceText.includes('<p ')
		&& !sourceText.includes('ResourceBoundary')
		&& !sourceText.includes('{#if')
		&& sourceText.includes('import type { PageProps }')
		&& sourceText.includes('}: PageProps = $props()')
		&& importsMatchingViewComponent
	)
	const isDataSelectorChildCollectionPage = (
		value.components.length === 2
		&& value.components[0] === 'Page'
		&& value.usesSelect
		&& value.usesDataSelector
		&& !value.usesParams
		&& dataSelectorChildCollectionMatch !== null
		&& importsMatchingViewComponent
		&& sourceText.includes('import type { PageProps }')
		&& sourceText.includes('let { data }: PageProps = $props()')
		&& !sourceText.includes('<svelte:head>')
		&& !sourceText.includes('<p ')
	)
	const isParamIdDetailPage = (
		value.components.length === 2
		&& value.components[0] === 'Page'
		&& value.usesSelect
		&& value.usesParams
		&& !value.usesDataSelector
		&& paramIdDetailMatch !== null
		&& importsMatchingViewComponent
		&& value.routePath !== '(social)/farcaster'
		&& !sourceText.includes('<svelte:head>')
		&& !sourceText.includes('<p ')
		&& !sourceText.includes('\t/>\n\n</Page>')
	)
	const isScopeDetailPage = (
		value.components.length === 2
		&& value.components[0] === 'Page'
		&& value.usesSelect
		&& !value.usesParams
		&& !value.usesDataSelector
		&& scopeDetailMatch !== null
		&& importsMatchingViewComponent
		&& !sourceText.includes('<svelte:head>')
		&& !sourceText.includes('<p ')
	)
	const isParamSelectorDetailPage = (
		value.components.length === 2
		&& value.components[0] === 'Page'
		&& value.usesSelect
		&& value.usesParams
		&& !value.usesDataSelector
		&& paramSelectorDetailMatch !== null
		&& importsMatchingViewComponent
		&& (
			sourceText.includes('let { params } = $props()')
			|| sourceText.includes(`let {
		params,
	} = $props()`)
		)
		&& !sourceText.includes('<svelte:head>')
		&& !sourceText.includes('<p ')
		&& !sourceText.includes('ResourceBoundary')
		&& !sourceText.includes('{#if')
	)
	const isPlaceholderPage = (
		value.components.length === 1
		&& value.components[0] === 'Page'
		&& !value.usesSelect
		&& !value.usesParams
		&& !value.usesDataSelector
		&& (
			oneLinePlaceholderMatch !== null
			|| multilinePlaceholderMatch !== null
		)
	)
	const isParamHeadingPage = (
		value.components.length === 1
		&& value.components[0] === 'Page'
		&& !value.usesSelect
		&& value.usesParams
		&& !value.usesDataSelector
		&& paramHeadingMatch !== null
	)
	const isStaticPage = (
		!value.usesSelect
		&& !value.usesParams
		&& !value.usesDataSelector
		&& (
			staticSectionHeadingMatch !== null
			|| staticMainCardLinkMatch !== null
		)
	)
	const isSimpleDerivedSelectorPage = (
		value.components.length === 2
		&& value.components[0] === 'Page'
		&& value.usesSelect
		&& value.usesParams
		&& !value.usesDataSelector
		&& simpleDerivedSelectorPageMatch !== null
		&& simpleDerivedSelectorPageMatch.groups?.viewComponent === value.components[1]
	)
	const isDirectSelectorPage = (
		value.components.length === 2
		&& value.components[0] === 'Page'
		&& value.usesSelect
		&& !value.usesDataSelector
		&& directSelectorPageMatch !== null
		&& directSelectorPageMatch.groups?.viewComponent === value.components[1]
	)
	const isLinkedViewPage = (
		value.components.length === 2
		&& value.components[0] === 'Page'
		&& !value.usesSelect
		&& !value.usesParams
		&& !value.usesDataSelector
		&& linkedViewPageMatch !== null
		&& linkedViewPageMatch.groups?.viewComponent === value.components[1]
	)
	const simpleViewImportLine = simpleViewPageMatch?.groups?.componentImports
		.split('\n')
		.find((line) => line.includes(`import ${simpleViewPageMatch.groups?.viewComponent ?? ''} from '$/views/`))
	const simpleViewFile = simpleViewImportLine?.match(/from '\$\/views\/([^']+\.svelte)'/)?.[1]
	const isSimpleViewPage = (
		value.components.length === 2
		&& value.components[0] === 'Page'
		&& !value.usesSelect
		&& !value.usesDataSelector
		&& simpleViewPageMatch !== null
		&& simpleViewPageMatch.groups?.viewComponent === value.components[1]
		&& simpleViewFile !== undefined
	)
	const isCatalogParamDetailPage = (
		value.components.length === 2
		&& value.components[0] === 'Page'
		&& value.usesSelect
		&& value.usesParams
		&& !value.usesDataSelector
		&& catalogParamDetail !== undefined
		&& catalogParamDetail.viewComponent === value.components[1]
	)
	const isGlobalHubTabsPage = (
		value.components.includes('Page')
		&& value.components.includes('GlobalView')
		&& value.components.includes('CollapsibleTabs')
		&& globalHubTabs !== undefined
	)
	const isEip155NetworkCollectionPage = (
		value.components.includes('Page')
		&& value.usesSelect
		&& value.usesParams
		&& !value.usesDataSelector
		&& eip155NetworkCollection !== undefined
	)
	const isEvmProtocolCollectionPage = (
		value.components.includes('Page')
		&& value.usesSelect
		&& !value.usesParams
		&& !value.usesDataSelector
		&& evmProtocolCollection !== undefined
	)
	const isGlobalSourceCollectionPage = (
		value.components.includes('Page')
		&& value.usesSelect
		&& !value.usesParams
		&& !value.usesDataSelector
		&& globalSourceCollection !== undefined
	)
	const isYoutubeParentCollectionPage = (
		value.components.includes('Page')
		&& value.usesSelect
		&& value.usesParams
		&& !value.usesDataSelector
		&& youtubeParentCollection !== undefined
	)
	const isSocialNetworkChildCollectionPage = (
		value.components.includes('Page')
		&& value.usesSelect
		&& !value.usesParams
		&& !value.usesDataSelector
		&& socialNetworkChildCollection !== undefined
	)
	const isDataSelectorSimpleDetailPage = (
		value.components.includes('Page')
		&& value.usesSelect
		&& value.usesDataSelector
		&& !value.usesParams
		&& dataSelectorSimpleDetail !== undefined
	)
	const isDecodedParentChildCollectionPage = (
		value.components.includes('Page')
		&& value.usesSelect
		&& value.usesParams
		&& !value.usesDataSelector
		&& decodedParentChildCollection !== undefined
	)
	const isDecodedParamDetailPage = (
		value.components.includes('Page')
		&& value.usesSelect
		&& value.usesParams
		&& !value.usesDataSelector
		&& decodedParamDetail !== undefined
	)
	const isLensAccountDetailPage = (
		value.components.includes('Page')
		&& value.components.includes('LensAccountView')
		&& value.usesSelect
		&& value.usesParams
		&& !value.usesDataSelector
		&& isLensAccountDetailRoute
	)
	const isProposalSelectorDetailPage = (
		value.components.includes('Page')
		&& value.usesSelect
		&& value.usesParams
		&& !value.usesDataSelector
		&& proposalSelectorDetail !== undefined
	)

	return {
		routePath: value.routePath,
		visiblePath: value.visiblePath,
		routeGroupPath: value.routeGroupPath,
		components: value.components,
		usesDataSelector: value.usesDataSelector,
		usesParams: value.usesParams,
		usesSelect: value.usesSelect,
		kind: (
			isGlobalCollectionPage ? 'global-collection'
			: isGlobalSourceCollectionPage ? 'global-source-collection'
			: isDataSelectorDetailPage ? 'data-selector-detail'
			: isDataSelectorSimpleDetailPage ? 'data-selector-simple-detail'
			: isDataSelectorChildCollectionPage ? 'data-selector-child-collection'
			: isParamIdDetailPage ? 'param-id-detail'
			: isParamSelectorDetailPage ? 'param-selector-detail'
			: isScopeDetailPage ? 'scope-detail'
			: isDirectSelectorPage ? 'direct-selector-detail'
			: isSimpleDerivedSelectorPage ? 'derived-selector-detail'
			: isLinkedViewPage ? 'linked-view'
			: isSimpleViewPage ? 'simple-view'
			: isCatalogParamDetailPage ? 'catalog-param-detail'
			: isGlobalHubTabsPage ? 'global-hub-tabs'
			: isEip155NetworkCollectionPage ? 'eip155-network-collection'
			: isEvmProtocolCollectionPage ? 'evm-protocol-collection'
			: isYoutubeParentCollectionPage ? 'youtube-parent-collection'
			: isSocialNetworkChildCollectionPage ? 'social-network-child-collection'
			: isDecodedParentChildCollectionPage ? 'decoded-parent-child-collection'
			: isDecodedParamDetailPage ? 'decoded-param-detail'
			: isLensAccountDetailPage ? 'lens-account-detail'
			: isProposalSelectorDetailPage ? 'proposal-selector-detail'
			: isPlaceholderPage ? 'placeholder'
			: isParamHeadingPage ? 'param-heading'
			: isStaticPage ? 'static-page'
			:
				'custom'
		),
		...(isGlobalCollectionPage ? {
			viewComponent: value.components[1],
			...(hrefExpression === undefined ? {} : { hrefExpression }),
			collectionEntityType: globalCollectionMatch[1],
			globalScope: globalCollectionMatch[2],
			globalField: globalCollectionMatch[3],
			...(id === undefined ? {} : { id }),
			...(limit === undefined ? {} : { limit: Number(limit) }),
			...(title === undefined ? {} : { title }),
			...(headTitle === undefined ? {} : { headTitle }),
			...(collapsible === undefined ? {} : { collapsible: collapsible === 'true' }),
			...(open ? { open: true } : {}),
			...(viewImport !== undefined && sourceText.indexOf(viewImport) < sourceText.indexOf(pageImport) ? { viewImportBeforePage: true } : {}),
			...(sources.length === 0 ? {} : { sources }),
		} : isGlobalSourceCollectionPage ? {
			...globalSourceCollection,
		} : isDataSelectorDetailPage ? {
			viewComponent: value.components[1],
			...(importedViewFile === undefined || importedViewFile === `${value.components[1]}.svelte` ? {} : { viewFile: importedViewFile }),
			entityType: dataSelectorDetailMatch[1],
		} : isDataSelectorSimpleDetailPage ? {
			...dataSelectorSimpleDetail,
		} : isDataSelectorChildCollectionPage ? {
			viewComponent: value.components[1],
			...(importedViewFile === undefined || importedViewFile === `${value.components[1]}.svelte` ? {} : { viewFile: importedViewFile }),
			entityType: dataSelectorChildCollectionMatch[1],
			childField: dataSelectorChildCollectionMatch[2],
			...(multilineHrefExpression === undefined ? {} : { hrefExpression: multilineHrefExpression }),
			...(id === undefined ? {} : { id }),
			...(title === undefined ? {} : { title }),
		} : isParamIdDetailPage ? {
			viewComponent: value.components[1],
			...(importedViewFile === undefined || importedViewFile === `${value.components[1]}.svelte` ? {} : { viewFile: importedViewFile }),
			entityType: paramIdDetailMatch[1],
			paramName: paramIdDetailMatch[2],
			...(stateComment === undefined || stateComment === 'State' ? {} : { stateComment }),
			...(sourceText.includes('} = $props()\n\n\n\t// Components') ? { blankLineBeforeComponents: true } : {}),
			...(viewImport !== undefined && sourceText.indexOf(viewImport) < sourceText.indexOf(pageImport) ? { viewImportBeforePage: true } : {}),
		} : isParamSelectorDetailPage ? {
			viewComponent: value.components[1],
			...(importedViewFile === undefined || importedViewFile === `${value.components[1]}.svelte` ? {} : { viewFile: importedViewFile }),
			entityType: paramSelectorDetailMatch[1],
			selectorExpression: paramSelectorDetailMatch[2],
			...(derivedConstantMatches.length === 0 ? {} : {
				derivedConstants: derivedConstantMatches.map((match) => ({
					name: match[1],
					expression: match[2],
				})),
			}),
			...(limit === undefined ? {} : { limit: Number(limit) }),
			...(sourceText.includes("import type { EntitySelector } from '$/schema/$schema.ts'") ? { importEntitySelectorType: true } : {}),
			...(sourceText.includes("import { eip155NetworkSelectorFromCaip2 } from '$/lib/caip2.ts'") ? { importEip155NetworkSelectorFromCaip2: true } : {}),
			...(sourceText.includes("import { ZeroExHex } from '$/schema/ZeroExHex.ts'") ? { importZeroExHex: true } : {}),
			...(zeroExHexImportSymbols === undefined ? {} : { zeroExHexImportSymbols }),
			...(zeroExHexImportSymbols !== undefined && sourceText.indexOf("$/schema/ZeroExHex.ts") < sourceText.indexOf("$/routes/+layout.svelte") ? { zeroExHexImportWithSchemaImports: true } : {}),
			...(sourceText.includes("import { with0xHex } from '$/lib/hexLowerOfByteSize.ts'") ? {
				importWith0xHex: true,
				with0xHexImportSection: sourceText.includes("// Functions\n\timport { with0xHex }") ? 'functions' : 'types',
			} : {}),
			...(sourceText.startsWith(`<script lang="ts">
	import { EntityType }`) ? { typeConstantsAfterSchemaImports: true } : {}),
			...(sourceText.includes(`let {
		params,
	} = $props()`) ? { paramsMultiline: true } : {}),
			...(sourceText.includes(`\n\t\t<${value.components[1]}`) ? { componentIndentExtra: true } : {}),
			...(sourceText.includes(`\n\t<${value.components[1]}`) && sourceText.includes(`>\n\t</${value.components[1]}>`) ? { explicitClosingTag: true } : {}),
			...(viewImport !== undefined && sourceText.indexOf(viewImport) < sourceText.indexOf(pageImport) ? { viewImportBeforePage: true } : {}),
		} : isScopeDetailPage ? {
			viewComponent: value.components[1],
			...(importedViewFile === undefined || importedViewFile === `${value.components[1]}.svelte` ? {} : { viewFile: importedViewFile }),
			entityType: scopeDetailMatch[1],
			scope: scopeDetailMatch[2],
			...(sourceText.includes('\t/>\n\n</Page>') ? { blankLineBeforePageClose: true } : {}),
		} : isDirectSelectorPage ? {
			viewComponent: directSelectorPageMatch.groups?.viewComponent,
			...(directSelectorPageMatch.groups?.viewFile === `${directSelectorPageMatch.groups?.viewComponent}.svelte` ? {} : { viewFile: directSelectorPageMatch.groups?.viewFile }),
			entityType: directSelectorPageMatch.groups?.entityType,
			selectorExpression: directSelectorPageMatch.groups?.selectorExpression,
			...(directSelectorSectionedPageMatch === null ? {} : { selectorImportStyle: 'sectioned' }),
			...(directSelectorPageMatch.groups?.stateBlock === undefined ? {} : { paramsMultiline: true }),
			...(directSelectorPageMatch.groups?.stateBlock === undefined || directSelectorPageMatch.groups.blankLineBeforeComponents !== undefined ? {} : { blankLineBeforeComponents: false }),
			...(directSelectorPageMatch.groups?.closing === undefined || directSelectorPageMatch.groups.closing.trim() === '/>' ? {} : { explicitClosingTag: true }),
			...((directSelectorPageMatch.groups?.viewProps ?? '').trim() === '' ? {} : {
				viewProps: (directSelectorPageMatch.groups?.viewProps ?? '')
					.trim()
					.split('\n')
					.filter((line) => line !== '')
					.map((line) => line.trim()),
			}),
		} : isSimpleDerivedSelectorPage ? {
			viewComponent: simpleDerivedSelectorPageMatch.groups?.viewComponent,
			...(simpleDerivedSelectorPageMatch.groups?.viewFile === `${simpleDerivedSelectorPageMatch.groups?.viewComponent}.svelte` ? {} : { viewFile: simpleDerivedSelectorPageMatch.groups?.viewFile }),
			entityType: simpleDerivedSelectorPageMatch.groups?.entityType,
			...((simpleDerivedSelectorPageMatch.groups?.functionImports ?? '').trim() === '' ? {} : {
				functionImports: (simpleDerivedSelectorPageMatch.groups?.functionImports ?? '')
				.trim()
				.split('\n')
				.filter((line) => line !== '')
				.map((line) => line.trim()),
			}),
			selectorDeclaration: `const selector = $derived(\n${(simpleDerivedSelectorPageMatch.groups?.selectorExpression ?? '').replace(/^\t/gm, '')}\n)`,
			selectorGuard: simpleDerivedSelectorPageMatch.groups?.selectorGuard,
			invalidText: simpleDerivedSelectorPageMatch.groups?.invalidText,
			invalidOutsidePage: true,
			...((simpleDerivedSelectorPageMatch.groups?.viewProps ?? '').trim() === '' ? {} : {
				viewProps: (simpleDerivedSelectorPageMatch.groups?.viewProps ?? '')
					.trim()
					.split('\n')
					.filter((line) => line !== '')
					.map((line) => line.trim()),
			}),
		} : isLinkedViewPage ? {
			viewComponent: linkedViewPageMatch.groups?.viewComponent,
			...(linkedViewPageMatch.groups?.viewFile === `${linkedViewPageMatch.groups?.viewComponent}.svelte` ? {} : { viewFile: linkedViewPageMatch.groups?.viewFile }),
			hrefExpression: linkedViewPageMatch.groups?.hrefExpression,
			id: linkedViewPageMatch.groups?.id,
			...(linkedViewPageMatch.groups?.titleExpression === undefined ? {} : { titleExpression: linkedViewPageMatch.groups.titleExpression }),
		} : isSimpleViewPage ? {
			viewComponent: simpleViewPageMatch.groups?.viewComponent,
			...(simpleViewFile === `${simpleViewPageMatch.groups?.viewComponent}.svelte` ? {} : { viewFile: simpleViewFile }),
			...(simpleViewPageMatch.groups?.stateBlock === undefined ? {} : { paramsMultiline: true }),
			...(simpleViewPageMatch.groups?.componentImports.startsWith(`\timport ${simpleViewPageMatch.groups?.viewComponent}`) ? { viewImportBeforePage: true } : {}),
			...((simpleViewPageMatch.groups?.viewProps ?? '').trim() === '' ? {} : {
				viewProps: (simpleViewPageMatch.groups?.viewProps ?? '')
					.trim()
					.split('\n')
					.filter((line) => line !== '')
					.map((line) => line.trim()),
			}),
		} : isCatalogParamDetailPage ? {
			...catalogParamDetail,
		} : isGlobalHubTabsPage ? {
			...globalHubTabs,
		} : isEip155NetworkCollectionPage ? {
			...eip155NetworkCollection,
		} : isEvmProtocolCollectionPage ? {
			...evmProtocolCollection,
		} : isYoutubeParentCollectionPage ? {
			...youtubeParentCollection,
		} : isSocialNetworkChildCollectionPage ? {
			...socialNetworkChildCollection,
		} : isDecodedParentChildCollectionPage ? {
			...decodedParentChildCollection,
		} : isDecodedParamDetailPage ? {
			...decodedParamDetail,
		} : isLensAccountDetailPage ? {
			viewComponent: 'LensAccountView',
			entityType: 'LensAccount',
			paramName: 'address',
		} : isProposalSelectorDetailPage ? {
			...proposalSelectorDetail,
		} : isPlaceholderPage ? {
			placeholderText: (oneLinePlaceholderMatch ?? multilinePlaceholderMatch)?.[1]?.trim(),
			...(multilinePlaceholderMatch === null ? {} : { placeholderMultiline: true }),
		} : isParamHeadingPage ? {
			paramName: paramHeadingMatch[1],
		} : isStaticPage ? {
			staticWrapper: staticMainCardLinkMatch === null ? 'section-column' : 'main-card',
			staticTitle: (staticSectionHeadingMatch ?? staticMainCardLinkMatch)?.[1],
			...(staticMainCardLinkMatch === null ? {} : {
				staticLinks: [
					{
						route: staticMainCardLinkMatch[2],
						label: staticMainCardLinkMatch[3],
					},
				],
			}),
		} : {
			sourceText,
		}),
		sourceFile: fact.sourceFile,
	}
}

const routeSectionShellFromPageShell = (
	shell: AppRoutePageShell
): AppRouteSectionShell => {
	if (
		shell.routePath === ''
		&& shell.components.join('+') === 'Navigation'
		&& !shell.usesSelect
		&& !shell.usesParams
		&& shell.sourceText.includes('createBrowserWASQLitePersistence')
		&& shell.sourceText.includes('mountWalletConnectionRuntime(appClient)')
		&& shell.sourceText.includes('navigationItems={useNavigationItems().navigationItems}')
	)
		return {
			...shell,
			kind: 'app-shell',
			sourceText: undefined,
		}

	const title = shell.sourceText.match(/\n\ttitle="([^"]+)"/)?.[1]
	const titleExpression = shell.sourceText.match(/\n\ttitle=\{([^]*?)\}\n(?:\thref=|\tid=|\>)/)?.[1]?.trim()
	const hrefExpression = shell.sourceText.match(/\n\thref=\{([^]*?)\}\n(?:\tid=|\>)/)?.[1]?.trim()
	const idExpression = shell.sourceText.match(/\n\tid=\{([^]*?)\}\n\>/)?.[1]?.trim()
		?? (shell.sourceText.match(/\n\tid="([^"]+)"\n\>/)?.[1] === undefined ? undefined : quote(shell.sourceText.match(/\n\tid="([^"]+)"\n\>/)?.[1] ?? ''))
	const keyedHrefExpression = shell.sourceText.match(/\n\t\thref=\{([^]*?)\}\n\t\tid=/)?.[1]?.trim()
	const keyedIdExpression = shell.sourceText.match(/\n\t\tid=\{([^]*?)\}\n\t>/)?.[1]?.trim()
	const parentPageCollapsibleCount = [...shell.sourceText.matchAll(/<ParentPageCollapsible/g)].length
	const nestedParentMatches = [...shell.sourceText.matchAll(/<ParentPageCollapsible\n\ttitle="([^"]+)"\n\thref=\{([^]*?)\}\n\tid=\{([^]*?)\}\n>|<ParentPageCollapsible\n\t\ttitle="([^"]+)"\n\t\thref=\{([^]*?)\}\n\t\tid=\{([^]*?)\}\n\t>/g)]
	const summaryScopeMatch = shell.sourceText.match(/select\(\s*EntityType\.([A-Za-z0-9_]+),\s*\{\s*scope: '([^']+)',?\s*\}\s*\)/)
	const pageParamDerivedMatches = [...shell.sourceText.matchAll(/\n\tconst ([A-Za-z0-9_]+) = \$derived\(\n\t\t([^]*?),\n\t\)\n/g)]
	const summarySelectMatch = shell.sourceText.match(/selection=\{\n\t\t\t\tselect\(\n([^]*?)\n\t\t\t\t\)\n\t\t\t\}/)
	const keyedSummarySelectMatch = shell.sourceText.match(/selection=\{\n\t\t\t\t\tselect\(\n([^]*?)\n\t\t\t\t\t\)\n\t\t\t\t\}/)
	const summaryViewTitle = shell.sourceText.match(/\n\t\t\ttitle="([^"]+)"/)?.[1]
	const keyExpression = shell.sourceText.match(/\{#key ([^}]+)\}/)?.[1]
	const childrenName = shell.sourceText.match(/\{@render ([A-Za-z0-9_]+)\(\)\}/)?.[1]
	const proposalParentCollapsible = new Map<string, Partial<AppRouteSectionShell>>([
		['(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)', {
			viewComponent: 'SpecificationRealmView',
			entityType: 'SpecificationRealm',
			proposalLevel: 'realm',
			hrefExpression: "resolve('/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]', {\n\t\t\tspecificationRealmSlug: params.specificationRealmSlug,\n\t\t})",
			idExpression: 'stringify(selector)',
		}],
		['(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]/(proposalKind)', {
			viewComponent: 'ProposalKindView',
			viewFile: 'SpecificationProposalKindView.svelte',
			entityType: 'SpecificationProposalKind',
			proposalLevel: 'kind',
			hrefExpression: "resolve('/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]', {\n\t\t\tspecificationRealmSlug: params.specificationRealmSlug,\n\t\t\tproposalKindSlug: params.proposalKindSlug,\n\t\t})",
			idExpression: 'stringify(selector)',
		}],
	]).get(shell.routePath)

	if (
		proposalParentCollapsible !== undefined
		&& shell.components.includes('ParentPageCollapsible')
		&& shell.usesSelect
		&& shell.usesParams
		&& shell.sourceText.includes('{#if selector !== undefined}')
	)
		return {
			...shell,
			kind: 'proposal-parent-collapsible',
			...proposalParentCollapsible,
			sourceText: undefined,
		}

	if (
		shell.components.join('+') === 'ParentPageCollapsible'
		&& !shell.usesSelect
		&& shell.usesParams
		&& shell.sourceText.includes("import type { Snippet } from 'svelte'")
		&& shell.sourceText.includes("import { eip155NetworkSelectorFromCaip2 } from '$/lib/caip2.ts'")
		&& shell.sourceText.includes("import { stringify } from 'devalue'")
		&& parentPageCollapsibleCount === 2
		&& nestedParentMatches.length === 2
		&& childrenName !== undefined
	)
		return {
			...shell,
			kind: 'nested-parent-collapsible',
			nestedParents: nestedParentMatches.map((match) => ({
				title: match[1] ?? match[4],
				hrefExpression: (match[2] ?? match[5]).trim(),
				idExpression: (match[3] ?? match[6]).trim(),
			})),
			childrenName,
			usesEip155NetworkSelectorFromCaip2: true,
			usesStringify: true,
			sourceText: undefined,
		}

	if (
		shell.components.join('+') === 'ParentPageCollapsible'
		&& !shell.usesSelect
		&& shell.usesParams
		&& shell.sourceText.includes("import { page } from '$app/state'")
		&& shell.sourceText.includes('{@render children()}')
		&& !shell.sourceText.includes('{#snippet')
		&& hrefExpression !== undefined
		&& idExpression !== undefined
		&& parentPageCollapsibleCount === 1
	)
		return {
			...shell,
			kind: 'page-param-parent-collapsible',
			...(title === undefined ? {} : { title }),
			...(titleExpression === undefined ? {} : { titleExpression }),
			hrefExpression,
			idExpression,
			sourceText: undefined,
		}

	if (
		shell.components.join('+') === 'ParentPageCollapsible'
		&& !shell.usesSelect
		&& (
			!shell.usesParams
			|| (
				shell.sourceText.includes("import { eip155NetworkSelectorFromCaip2 } from '$/lib/caip2.ts'")
				&& shell.sourceText.includes("import { stringify } from 'devalue'")
				&& shell.sourceText.includes(`let {
		children,
		params,
	} = $props()`)
			)
		)
		&& shell.sourceText.includes('{@render children()}')
		&& hrefExpression !== undefined
		&& parentPageCollapsibleCount === 1
	)
		return {
			...shell,
			kind: 'parent-collapsible',
			...(title === undefined ? {} : { title }),
			...(titleExpression === undefined ? {} : { titleExpression }),
			hrefExpression,
			...(idExpression === undefined ? {} : { idExpression }),
			...(shell.sourceText.includes('eip155NetworkSelectorFromCaip2') ? { usesEip155NetworkSelectorFromCaip2: true } : {}),
			...(shell.sourceText.includes('stringify(') ? { usesStringify: true } : {}),
			sourceText: undefined,
		}

	if (
		shell.components.length === 2
		&& shell.components[0] === 'ParentPageCollapsible'
		&& shell.usesSelect
		&& !shell.usesParams
		&& shell.sourceText.includes('{#snippet Summary({ open: _open })}')
		&& shell.sourceText.includes('layout={EntityLayout.SummaryInline}')
		&& hrefExpression !== undefined
		&& idExpression !== undefined
		&& summaryScopeMatch !== null
		&& parentPageCollapsibleCount === 1
	)
		return {
			...shell,
			kind: 'scope-summary-collapsible',
			viewComponent: shell.components[1],
			entityType: summaryScopeMatch[1],
			scope: summaryScopeMatch[2],
			hrefExpression,
			idExpression,
			sourceText: undefined,
		}

	if (
		shell.components.length === 2
		&& shell.components[0] === 'ParentPageCollapsible'
		&& shell.usesSelect
		&& shell.usesParams
		&& !shell.sourceText.includes("import { page } from '$app/state'")
		&& shell.sourceText.includes('{#snippet Summary({ open: _open })}')
		&& shell.sourceText.includes('layout={EntityLayout.SummaryInline}')
		&& shell.sourceText.includes('{#key ')
		&& shell.sourceText.includes(`import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import ${shell.components[1]} from '$/views/${shell.components[1]}.svelte'`)
		&& !shell.sourceText.includes('{#if')
		&& pageParamDerivedMatches.length === 0
		&& keyedHrefExpression !== undefined
		&& keyedIdExpression !== undefined
		&& keyExpression !== undefined
		&& keyedSummarySelectMatch !== null
		&& parentPageCollapsibleCount === 1
	)
		return {
			...shell,
			kind: 'keyed-param-summary-collapsible',
			viewComponent: shell.components[1],
			selectorExpression: keyedSummarySelectMatch[1],
			hrefExpression: keyedHrefExpression,
			idExpression: keyedIdExpression,
			keyExpression,
			...(shell.sourceText.includes('eip155NetworkSelectorFromCaip2') ? { usesEip155NetworkSelectorFromCaip2: true } : {}),
			...(shell.sourceText.includes('stringify') ? { usesStringify: true } : {}),
			sourceText: undefined,
		}

	if (
		shell.components.length === 2
		&& shell.components[0] === 'ParentPageCollapsible'
		&& shell.usesSelect
		&& shell.usesParams
		&& !shell.sourceText.includes("import { page } from '$app/state'")
		&& shell.sourceText.includes('{#snippet Summary({ open: _open })}')
		&& shell.sourceText.includes('layout={EntityLayout.SummaryInline}')
		&& shell.sourceText.includes(`import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import ${shell.components[1]} from '$/views/${shell.components[1]}.svelte'`)
		&& !shell.sourceText.includes('{#if')
		&& !shell.sourceText.includes('{#key')
		&& hrefExpression !== undefined
		&& idExpression !== undefined
		&& summarySelectMatch !== null
		&& parentPageCollapsibleCount === 1
	)
		return {
			...shell,
			kind: 'param-summary-collapsible',
			viewComponent: shell.components[1],
			...(pageParamDerivedMatches.length === 0 ? {} : {
				derivedConstants: pageParamDerivedMatches.map((match) => ({
					name: match[1],
					expression: match[2],
				})),
			}),
			selectorExpression: summarySelectMatch[1],
			hrefExpression,
			...(shell.sourceText.includes('\n\thref={\n') ? { hrefWrapped: true } : {}),
			idExpression,
			...(shell.sourceText.includes('eip155NetworkSelectorFromCaip2') ? { usesEip155NetworkSelectorFromCaip2: true } : {}),
			...(shell.sourceText.includes('stringify') ? { usesStringify: true } : {}),
			sourceText: undefined,
		}

	if (
		shell.components.length === 2
		&& shell.components[0] === 'ParentPageCollapsible'
		&& shell.usesSelect
		&& shell.usesParams
		&& shell.sourceText.includes("import { page } from '$app/state'")
		&& shell.sourceText.includes('{#snippet Summary({ open: _open })}')
		&& shell.sourceText.includes('layout={EntityLayout.SummaryInline}')
		&& shell.sourceText.includes(`import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import ${shell.components[1]} from '$/views/${shell.components[1]}.svelte'`)
		&& !shell.sourceText.includes('{#if')
		&& !shell.sourceText.includes('{#key')
		&& hrefExpression !== undefined
		&& idExpression !== undefined
		&& pageParamDerivedMatches.length > 0
		&& summarySelectMatch !== null
		&& parentPageCollapsibleCount === 1
	)
		return {
			...shell,
			kind: 'page-param-summary-collapsible',
			viewComponent: shell.components[1],
			derivedConstants: pageParamDerivedMatches.map((match) => ({
				name: match[1],
				expression: match[2],
			})),
			selectorExpression: summarySelectMatch[1],
			...(summaryViewTitle === undefined ? {} : { viewTitle: summaryViewTitle }),
			hrefExpression,
			idExpression,
			sourceText: undefined,
		}

	if (
		shell.components.length === 0
		&& !shell.usesSelect
		&& !shell.usesParams
		&& shell.sourceText.trim() === `<script lang="ts">
	// State
	let { children } = $props()
</script>


{@render children()}`
	)
		return {
			...shell,
			kind: 'passthrough',
			sourceText: undefined,
		}

	return {
		...shell,
		kind: 'custom',
	}
}

export const factsToRoutePageShells = (
	facts: readonly SchemaFact[],
	selectorRouteMappings: readonly AppSelectorRouteMapping[]
): AppRoutePageShell[] => {
	const emittedSelectorRoutePagePaths = new Set(
		selectorRouteMappings
			.filter(selectorRouteMappingEmitsPage)
			.flatMap((mapping) => mapping.path === undefined ? [] : [
				mapping.path,
			])
	)

	return facts
		.filter((fact) => fact.kind === 'route.page-shell')
		.filter((fact) => fact.sourceFile.startsWith('src/routes/'))
		.filter((fact) => !hasRejectedRouteShape(fact.sourceFile))
		.map(factToRouteSvelteShell)
		.filter((shell) => !emittedSelectorRoutePagePaths.has(shell.routePath))
}

export const factsToRouteSectionShells = (facts: readonly SchemaFact[]): AppRouteSectionShell[] => (
	facts
		.filter((fact) => fact.kind === 'route.section-shell')
		.filter((fact) => fact.sourceFile.startsWith('src/routes/'))
		.map(factToRouteSvelteShell)
		.map(routeSectionShellFromPageShell)
)

export const factsToResolverCoverage = (facts: readonly SchemaFact[]): AppResolverCoverage[] => {
	const implemented = facts
		.filter((fact) => fact.kind === 'resolver.implemented-facet')
		.map((fact) => {
			const value = fact.value as {
				source: string
				entity: string
			}

			return {
				entity: value.entity,
				source: value.source,
				status: 'implemented',
			} as const
		})
	const implementedSources = new Set(implemented.map((coverage) => coverage.source))
	const explicitNonImplemented = facts
		.filter((fact) => fact.kind === 'resolver.coverage-row')
		.map((fact) => fact.value as {
			source: string
			status: AppResolverCoverage['status']
		})
		.filter((coverage) => coverage.status !== 'implemented' || !implementedSources.has(coverage.source))
		.map((coverage) => ({
			entity: '*',
			source: coverage.source,
			status: coverage.status,
		}))

	return [
		...implemented,
		...explicitNonImplemented,
	]
}

export const factsToResolverCoverageLedger = (facts: readonly SchemaFact[]): AppResolverCoverageLedgerRow[] => (
	facts
		.filter((fact) => fact.kind === 'resolver.coverage-row')
		.map((fact) => fact.value as AppResolverCoverageLedgerRow)
)

const quote = (value: string) => (
	`'${value.replace(/\\/g, '\\\\').replace(/'/g, '\\\'')}'`
)

const serializeText = (value: string) => JSON.stringify(value)

const serializeStringArray = (values: readonly string[], indent: string) => {
	if (values.length === 0)
		return '[]'

	return [
		'[',
		...values.map((value) => `${indent}\t${quote(value)},`),
		`${indent}]`,
	].join('\n')
}

const serializeStringEnum = (
	name: string,
	values: readonly string[]
) => [
	`export enum ${name} {`,
	...[...new Set(values)].map((value) => `\t${value} = ${quote(value)},`),
	'}',
].join('\n')

const serializeTableRows = (
	_typeName: string,
	keys: readonly string[],
	rows: readonly (readonly string[])[],
	indent: string
) => [
	'[',
	...rows.flatMap((row) => [
		`${indent}\t{`,
		...keys.flatMap((key, index) => row[index] === 'undefined' ? [] : [
			`${indent}\t\t${key}: ${row[index]},`,
		]),
		`${indent}\t},`,
	]),
	`${indent}]`,
].join('\n')

const serializeAppEntities = (entities: readonly AppEntity[]) => [
	'[',
	...entities.flatMap((entity) => [
		'\t\t\t{',
		`\t\t\t\tname: ${quote(entity.name)},`,
		...(entity.label === undefined ? [] : [
			`\t\t\t\tlabel: ${quote(entity.label)},`,
		]),
		...(entity.labelPlural === undefined ? [] : [
			`\t\t\t\tlabelPlural: ${quote(entity.labelPlural)},`,
		]),
		...(entity.description === undefined ? [] : [
			`\t\t\t\tdescription: ${quote(entity.description)},`,
		]),
		...(entity.notes === undefined ? [] : [
			`\t\t\t\tnotes: ${quote(entity.notes)},`,
		]),
		...((entity.enums ?? []).length === 0 ? [] : [
			'\t\t\t\tenums: [',
			...(entity.enums ?? []).flatMap((enumeration) => [
				'\t\t\t\t\t{',
				`\t\t\t\t\t\tname: ${quote(enumeration.name)},`,
				'\t\t\t\t\t\tmembers: [',
				...enumeration.members.flatMap((member) => [
					'\t\t\t\t\t\t\t{',
					`\t\t\t\t\t\t\t\tname: ${quote(member.name)},`,
					`\t\t\t\t\t\t\t\tvalue: ${quote(member.value)},`,
					'\t\t\t\t\t\t\t},',
				]),
				'\t\t\t\t\t\t],',
				'\t\t\t\t\t},',
			]),
			'\t\t\t\t],',
		]),
		`\t\t\t\tselectors: ${serializeTableRows(
			'AppSchemaEntity[\'selectors\'][number]',
			[
				'name',
				'fields',
				'member',
				'value',
			],
			entity.selectors.map((selector) => [
				quote(selector.name),
				serializeStringArray(selector.fields, '\t\t\t\t\t'),
				selector.member === undefined ? 'undefined' : quote(selector.member),
				selector.value === undefined ? 'undefined' : quote(selector.value),
			]),
			'\t\t\t\t'
		)},`,
		`\t\t\t\tfields: ${serializeTableRows(
			'AppSchemaEntity[\'fields\'][number]',
			[
				'name',
				'type',
				'cardinality',
				'label',
				'labelPlural',
				'description',
			],
			entity.fields.map((field) => [
				quote(field.name),
				quote(field.type),
				quote(field.cardinality),
				field.label === undefined ? 'undefined' : quote(field.label),
				field.labelPlural === undefined ? 'undefined' : quote(field.labelPlural),
				field.description === undefined ? 'undefined' : quote(field.description),
			]),
			'\t\t\t\t'
		)},`,
		`\t\t\t\tsourceBindings: ${serializeStringArray(entity.sourceBindings, '\t\t\t\t')},`,
		...(entity.view === undefined ? [] : [
			`\t\t\t\tview: ${quote(entity.view)},`,
		]),
		'\t\t\t},',
	]),
	'\t\t]',
].join('\n')

const serializeSourceProviders = (providers: readonly AppSourceProvider[]) => serializeTableRows(
	'AppSourceProvider',
	[
		'id',
		'label',
	],
	providers.map((provider) => [
		quote(provider.id),
		quote(provider.label),
	]),
	'\t\t'
)

const serializeSources = (sources: readonly AppSource[]) => serializeTableRows(
	'AppSource',
	[
		'id',
		'provider',
		'label',
	],
	sources.map((source) => [
		quote(source.id),
		quote(source.provider),
		quote(source.label),
	]),
	'\t\t'
)

const serializeSourceBindings = (bindings: readonly AppSourceBinding[]) => serializeTableRows(
	'AppSourceBinding',
	[
		'id',
		'source',
		'target',
	],
	bindings.map((binding) => [
		quote(binding.id),
		quote(binding.source),
		quote(binding.target),
	]),
	'\t\t'
)

const serializeRuntimeSourceBindings = (bindings: readonly AppRuntimeSourceBinding[]) => serializeTableRows(
	'AppRuntimeSourceBinding',
	[
		'provider',
		'source',
		'targetKind',
		'targetKey',
		'endpointCount',
		'wireProtocol',
		'apiFamily',
		'operationGroups',
		'delivery',
		'artifactCount',
	],
	bindings.map((binding) => [
		quote(binding.provider),
		quote(binding.source),
		quote(binding.targetKind),
		quote(binding.targetKey),
		String(binding.endpointCount),
		quote(binding.wireProtocol),
		quote(binding.apiFamily),
		serializeStringArray(binding.operationGroups, '\t\t\t'),
		quote(binding.delivery),
		String(binding.artifactCount),
	]),
	'\t\t'
)

const serializeRuntimeSourceArtifacts = (artifacts: readonly AppRuntimeSourceArtifact[]) => serializeTableRows(
	'AppRuntimeSourceArtifact',
	[
		'source',
		'kind',
		'path',
		'generated',
	],
	artifacts.map((artifact) => [
		quote(artifact.source),
		quote(artifact.kind),
		quote(artifact.path),
		artifact.generated ? 'true' : 'false',
	]),
	'\t\t'
)

const serializeEntityViews = (views: readonly AppEntityView[]) => serializeTableRows(
	'AppEntityView',
	[
		'entity',
		'kind',
		'file',
		'ownership',
	],
	views.map((view) => [
		quote(view.entity),
		quote(view.kind),
		quote(view.file),
		quote(view.ownership),
	]),
	'\t\t'
)

const serializeEntityViewShells = (shells: readonly AppEntityViewShell[]) => [
	'[',
	...shells.flatMap((shell) => [
		'\t\t\t{',
		`\t\t\t\tentity: ${quote(shell.entity)},`,
		`\t\t\t\tviewName: ${quote(shell.viewName)},`,
		`\t\t\t\tfile: ${quote(shell.file)},`,
		`\t\t\t\tcapabilities: ${serializeStringArray(shell.capabilities, '\t\t\t\t')},`,
		...(shell.sourceText === undefined ? [] : [
			`\t\t\t\tsourceText: ${serializeText(shell.sourceText)},`,
		]),
		`\t\t\t\tsourceFile: ${quote(shell.sourceFile)},`,
		'\t\t\t},',
	]),
	'\t\t]',
].join('\n')

const serializeRouteSections = (sections: readonly AppRouteSection[]) => serializeTableRows(
	'AppRouteSection',
	[
		'id',
		'path',
	],
	sections.map((section) => [
		quote(section.id),
		quote(section.path),
	]),
	'\t\t'
)

const serializeRoutePages = (pages: readonly AppRoutePage[]) => serializeTableRows(
	'AppRoutePage',
	[
		'id',
		'path',
		'ownership',
	],
	pages.map((page) => [
		quote(page.id),
		quote(page.path),
		quote(page.ownership),
	]),
	'\t\t'
)

const serializeSelectorRouteParams = (
	params: readonly AppSelectorRouteMapping['params'][number][],
	indent: string
) => {
	if (params.length === 0)
		return '[]'

	return [
		'[',
		...params.flatMap((param) => [
			`${indent}\t{`,
			`${indent}\t\tfield: ${quote(param.field)},`,
			`${indent}\t\tname: ${quote(param.name)},`,
			...(param.matcher === undefined ? [] : [
				`${indent}\t\tmatcher: ${quote(param.matcher)},`,
			]),
			`${indent}\t},`,
		]),
		`${indent}]`,
	].join('\n')
}

const serializeSelectorRouteMappings = (mappings: readonly AppSelectorRouteMapping[]) => serializeTableRows(
	'AppSelectorRouteMapping',
	[
		'entity',
		'selector',
		'fields',
		'outcome',
		'path',
		'visiblePath',
		'emitPage',
		'parentFields',
		'localFields',
		'params',
		'unresolved',
		'reason',
	],
	mappings.map((mapping) => [
		quote(mapping.entity),
		quote(mapping.selector),
		serializeStringArray(mapping.fields, '\t\t\t'),
		quote(mapping.outcome),
		mapping.path === undefined ? 'undefined' : quote(mapping.path),
		mapping.visiblePath === undefined ? 'undefined' : quote(mapping.visiblePath),
		mapping.emitPage === undefined ? 'undefined' : mapping.emitPage ? 'true' : 'false',
		serializeStringArray(mapping.parentFields, '\t\t\t'),
		serializeStringArray(mapping.localFields, '\t\t\t'),
		serializeSelectorRouteParams(mapping.params, '\t\t\t'),
		serializeStringArray(mapping.unresolved, '\t\t\t'),
		mapping.reason === undefined ? 'undefined' : quote(mapping.reason),
	]),
	'\t\t'
)

const serializeHubCollectionRoutes = (routes: readonly AppHubCollectionRoute[]) => serializeTableRows(
	'AppHubCollectionRoute',
	[
		'entity',
		'hub',
		'path',
		'view',
		'unresolved',
	],
	routes.map((route) => [
		quote(route.entity),
		quote(route.hub),
		quote(route.path),
		quote(route.view),
		serializeStringArray(route.unresolved, '\t\t\t'),
	]),
	'\t\t'
)

const serializeRouteLoaderTransforms = (transforms: readonly AppRouteLoaderTransform[]) => serializeTableRows(
	'AppRouteLoaderTransform',
	[
		'entity',
		'routePath',
		'visiblePath',
		'params',
		'selectorFields',
		'importedSymbols',
		'selectorExpression',
		'simpleDirectParamShape',
		'sourceFile',
	],
	transforms.map((transform) => [
		quote(transform.entity),
		quote(transform.routePath),
		quote(transform.visiblePath),
		serializeStringArray(transform.params, '\t\t\t'),
		serializeStringArray(transform.selectorFields, '\t\t\t'),
		serializeStringArray(transform.importedSymbols, '\t\t\t'),
		serializeText(transform.selectorExpression),
		transform.simpleDirectParamShape ? 'true' : 'false',
		quote(transform.sourceFile),
	]),
	'\t\t'
)

const serializeRouteSvelteShells = (shells: readonly AppRoutePageShell[]) => [
	'[',
	...shells.flatMap((shell) => [
		'\t\t\t{',
		`\t\t\t\troutePath: ${quote(shell.routePath)},`,
		`\t\t\t\tvisiblePath: ${quote(shell.visiblePath)},`,
		`\t\t\t\trouteGroupPath: ${quote(shell.routeGroupPath)},`,
		`\t\t\t\tcomponents: ${serializeStringArray(shell.components, '\t\t\t\t')},`,
		`\t\t\t\tusesDataSelector: ${shell.usesDataSelector ? 'true' : 'false'},`,
		`\t\t\t\tusesParams: ${shell.usesParams ? 'true' : 'false'},`,
		`\t\t\t\tusesSelect: ${shell.usesSelect ? 'true' : 'false'},`,
		`\t\t\t\tkind: ${quote(shell.kind)},`,
		...(shell.viewComponent === undefined ? [] : [
			`\t\t\t\tviewComponent: ${quote(shell.viewComponent)},`,
		]),
		...(shell.viewFile === undefined ? [] : [
			`\t\t\t\tviewFile: ${quote(shell.viewFile)},`,
		]),
		...(shell.entityType === undefined ? [] : [
			`\t\t\t\tentityType: ${quote(shell.entityType)},`,
		]),
		...(shell.paramName === undefined ? [] : [
			`\t\t\t\tparamName: ${quote(shell.paramName)},`,
		]),
		...(shell.selectorExpression === undefined ? [] : [
			`\t\t\t\tselectorExpression: ${serializeText(shell.selectorExpression)},`,
		]),
		...(shell.selectorImportStyle === undefined ? [] : [
			`\t\t\t\tselectorImportStyle: ${quote(shell.selectorImportStyle)},`,
		]),
		...(shell.selectorDeclaration === undefined ? [] : [
			`\t\t\t\tselectorDeclaration: ${serializeText(shell.selectorDeclaration)},`,
		]),
		...(shell.routeImports === undefined ? [] : [
			`\t\t\t\trouteImports: ${serializeStringArray(shell.routeImports, '\t\t\t\t')},`,
		]),
		...(shell.functionImports === undefined ? [] : [
			`\t\t\t\tfunctionImports: ${serializeStringArray(shell.functionImports, '\t\t\t\t')},`,
		]),
		...(shell.selectorGuard === undefined ? [] : [
			`\t\t\t\tselectorGuard: ${quote(shell.selectorGuard)},`,
		]),
		...(shell.invalidText === undefined ? [] : [
			`\t\t\t\tinvalidText: ${quote(shell.invalidText)},`,
		]),
		...(shell.invalidOutsidePage === undefined ? [] : [
			`\t\t\t\tinvalidOutsidePage: ${shell.invalidOutsidePage ? 'true' : 'false'},`,
		]),
		...(shell.viewProps === undefined ? [] : [
			`\t\t\t\tviewProps: ${serializeStringArray(shell.viewProps, '\t\t\t\t')},`,
		]),
		...(shell.derivedConstants === undefined ? [] : [
			`\t\t\t\tderivedConstants: [`,
			...shell.derivedConstants.flatMap((derivedConstant) => [
				`\t\t\t\t\t{`,
				`\t\t\t\t\t\tname: ${quote(derivedConstant.name)},`,
				`\t\t\t\t\t\texpression: ${serializeText(derivedConstant.expression)},`,
				`\t\t\t\t\t},`,
			]),
			`\t\t\t\t],`,
		]),
		...(shell.importEntitySelectorType === undefined ? [] : [
			`\t\t\t\timportEntitySelectorType: ${shell.importEntitySelectorType ? 'true' : 'false'},`,
		]),
		...(shell.importEip155NetworkSelectorFromCaip2 === undefined ? [] : [
			`\t\t\t\timportEip155NetworkSelectorFromCaip2: ${shell.importEip155NetworkSelectorFromCaip2 ? 'true' : 'false'},`,
		]),
		...(shell.importZeroExHex === undefined ? [] : [
			`\t\t\t\timportZeroExHex: ${shell.importZeroExHex ? 'true' : 'false'},`,
		]),
		...(shell.zeroExHexImportSymbols === undefined ? [] : [
			`\t\t\t\tzeroExHexImportSymbols: ${quote(shell.zeroExHexImportSymbols)},`,
		]),
		...(shell.zeroExHexImportWithSchemaImports === undefined ? [] : [
			`\t\t\t\tzeroExHexImportWithSchemaImports: true,`,
		]),
		...(shell.importWith0xHex === undefined ? [] : [
			`\t\t\t\timportWith0xHex: ${shell.importWith0xHex ? 'true' : 'false'},`,
		]),
		...(shell.with0xHexImportSection === undefined ? [] : [
			`\t\t\t\twith0xHexImportSection: ${quote(shell.with0xHexImportSection)},`,
		]),
		...(shell.typeConstantsAfterSchemaImports === undefined ? [] : [
			`\t\t\t\ttypeConstantsAfterSchemaImports: ${shell.typeConstantsAfterSchemaImports ? 'true' : 'false'},`,
		]),
		...(shell.paramsMultiline === undefined ? [] : [
			`\t\t\t\tparamsMultiline: ${shell.paramsMultiline ? 'true' : 'false'},`,
		]),
		...(shell.componentIndentExtra === undefined ? [] : [
			`\t\t\t\tcomponentIndentExtra: ${shell.componentIndentExtra ? 'true' : 'false'},`,
		]),
		...(shell.explicitClosingTag === undefined ? [] : [
			`\t\t\t\texplicitClosingTag: ${shell.explicitClosingTag ? 'true' : 'false'},`,
		]),
		...(shell.scope === undefined ? [] : [
			`\t\t\t\tscope: ${quote(shell.scope)},`,
		]),
		...(shell.hrefExpression === undefined ? [] : [
			`\t\t\t\threfExpression: ${serializeText(shell.hrefExpression)},`,
		]),
		...(shell.childField === undefined ? [] : [
			`\t\t\t\tchildField: ${quote(shell.childField)},`,
		]),
		...(shell.collectionEntityType === undefined ? [] : [
			`\t\t\t\tcollectionEntityType: ${quote(shell.collectionEntityType)},`,
		]),
		...(shell.globalScope === undefined ? [] : [
			`\t\t\t\tglobalScope: ${quote(shell.globalScope)},`,
		]),
		...(shell.globalField === undefined ? [] : [
			`\t\t\t\tglobalField: ${quote(shell.globalField)},`,
		]),
		...(shell.globalSourceField === undefined ? [] : [
			`\t\t\t\tglobalSourceField: ${quote(shell.globalSourceField)},`,
		]),
		...(shell.globalSourceSources === undefined ? [] : [
			`\t\t\t\tglobalSourceSources: ${serializeStringArray(shell.globalSourceSources, '\t\t\t\t')},`,
		]),
		...(shell.globalSourceIndentExtra === undefined ? [] : [
			`\t\t\t\tglobalSourceIndentExtra: true,`,
		]),
		...(shell.globalSourceOmitContextSection === undefined ? [] : [
			`\t\t\t\tglobalSourceOmitContextSection: true,`,
		]),
		...(shell.id === undefined ? [] : [
			`\t\t\t\tid: ${quote(shell.id)},`,
		]),
		...(shell.limit === undefined ? [] : [
			`\t\t\t\tlimit: ${shell.limit},`,
		]),
		...(shell.title === undefined ? [] : [
			`\t\t\t\ttitle: ${quote(shell.title)},`,
		]),
		...(shell.titleExpression === undefined ? [] : [
			`\t\t\t\ttitleExpression: ${serializeText(shell.titleExpression)},`,
		]),
		...(shell.headTitle === undefined ? [] : [
			`\t\t\t\theadTitle: ${quote(shell.headTitle)},`,
		]),
		...(shell.sortMode === undefined ? [] : [
			`\t\t\t\tsortMode: ${quote(shell.sortMode)},`,
		]),
		...(shell.catalogImports === undefined ? [] : [
			`\t\t\t\tcatalogImports: ${serializeStringArray(shell.catalogImports, '\t\t\t\t')},`,
		]),
		...(shell.catalogParamType === undefined ? [] : [
			`\t\t\t\tcatalogParamType: ${quote(shell.catalogParamType)},`,
		]),
		...(shell.catalogRowsName === undefined ? [] : [
			`\t\t\t\tcatalogRowsName: ${quote(shell.catalogRowsName)},`,
		]),
		...(shell.catalogRowName === undefined ? [] : [
			`\t\t\t\tcatalogRowName: ${quote(shell.catalogRowName)},`,
		]),
		...(shell.catalogLookupName === undefined ? [] : [
			`\t\t\t\tcatalogLookupName: ${quote(shell.catalogLookupName)},`,
		]),
		...(shell.catalogLookupField === undefined ? [] : [
			`\t\t\t\tcatalogLookupField: ${quote(shell.catalogLookupField)},`,
		]),
		...(shell.catalogRouteKey === undefined ? [] : [
			`\t\t\t\tcatalogRouteKey: ${quote(shell.catalogRouteKey)},`,
		]),
		...(shell.catalogTitleExpression === undefined ? [] : [
			`\t\t\t\tcatalogTitleExpression: ${serializeText(shell.catalogTitleExpression)},`,
		]),
		...(shell.catalogNotFoundCondition === undefined ? [] : [
			`\t\t\t\tcatalogNotFoundCondition: ${quote(shell.catalogNotFoundCondition)},`,
		]),
		...(shell.catalogMissingText === undefined ? [] : [
			`\t\t\t\tcatalogMissingText: ${quote(shell.catalogMissingText)},`,
		]),
		...(shell.catalogUnknownText === undefined ? [] : [
			`\t\t\t\tcatalogUnknownText: ${quote(shell.catalogUnknownText)},`,
		]),
		...(shell.catalogNotFoundId === undefined ? [] : [
			`\t\t\t\tcatalogNotFoundId: ${quote(shell.catalogNotFoundId)},`,
		]),
		...(shell.catalogDetailId === undefined ? [] : [
			`\t\t\t\tcatalogDetailId: ${quote(shell.catalogDetailId)},`,
		]),
		...(shell.hubKey === undefined ? [] : [
			`\t\t\t\thubKey: ${quote(shell.hubKey)},`,
		]),
		...(shell.hubScope === undefined ? [] : [
			`\t\t\t\thubScope: ${quote(shell.hubScope)},`,
		]),
		...(shell.hubTitleExpression === undefined ? [] : [
			`\t\t\t\thubTitleExpression: ${quote(shell.hubTitleExpression)},`,
		]),
		...(shell.hubHref === undefined ? [] : [
			`\t\t\t\thubHref: ${quote(shell.hubHref)},`,
		]),
		...(shell.hubSections === undefined ? [] : [
			`\t\t\t\thubSections: [`,
			...shell.hubSections.flatMap((section) => [
				`\t\t\t\t\t{`,
				`\t\t\t\t\t\tid: ${quote(section.id)},`,
				`\t\t\t\t\t\tlabel: ${quote(section.label)},`,
				...(section.viewComponent === undefined ? [] : [
					`\t\t\t\t\t\tviewComponent: ${quote(section.viewComponent)},`,
				]),
				...(section.href === undefined ? [] : [
					`\t\t\t\t\t\thref: ${quote(section.href)},`,
				]),
				...(section.globalField === undefined ? [] : [
					`\t\t\t\t\t\tglobalField: ${quote(section.globalField)},`,
				]),
				...(section.viewId === undefined ? [] : [
					`\t\t\t\t\t\tviewId: ${quote(section.viewId)},`,
				]),
				...(section.placeholderText === undefined ? [] : [
					`\t\t\t\t\t\tplaceholderText: ${quote(section.placeholderText)},`,
				]),
				`\t\t\t\t\t},`,
			]),
			`\t\t\t\t],`,
		]),
		...(shell.networkCollectionField === undefined ? [] : [
			`\t\t\t\tnetworkCollectionField: ${quote(shell.networkCollectionField)},`,
		]),
		...(shell.networkCollectionSources === undefined ? [] : [
			`\t\t\t\tnetworkCollectionSources: ${serializeStringArray(shell.networkCollectionSources, '\t\t\t\t')},`,
		]),
		...(shell.networkCollectionCount === undefined ? [] : [
			`\t\t\t\tnetworkCollectionCount: true,`,
		]),
		...(shell.networkCollectionInlineSources === undefined ? [] : [
			`\t\t\t\tnetworkCollectionInlineSources: true,`,
		]),
		...(shell.networkCollectionHrefAfterSelection === undefined ? [] : [
			`\t\t\t\tnetworkCollectionHrefAfterSelection: true,`,
		]),
		...(shell.networkCollectionTightContextState === undefined ? [] : [
			`\t\t\t\tnetworkCollectionTightContextState: true,`,
		]),
		...(shell.protocolCollectionField === undefined ? [] : [
			`\t\t\t\tprotocolCollectionField: ${quote(shell.protocolCollectionField)},`,
		]),
		...(shell.parentSelectorField === undefined ? [] : [
			`\t\t\t\tparentSelectorField: ${quote(shell.parentSelectorField)},`,
		]),
		...(shell.parentSelectorParam === undefined ? [] : [
			`\t\t\t\tparentSelectorParam: ${quote(shell.parentSelectorParam)},`,
		]),
		...(shell.parentSelectorTransform === undefined ? [] : [
			`\t\t\t\tparentSelectorTransform: ${quote(shell.parentSelectorTransform)},`,
		]),
		...(shell.networkScope === undefined ? [] : [
			`\t\t\t\tnetworkScope: ${quote(shell.networkScope)},`,
		]),
		...(shell.placeholderText === undefined ? [] : [
			`\t\t\t\tplaceholderText: ${quote(shell.placeholderText)},`,
		]),
		...(shell.placeholderMultiline === undefined ? [] : [
			`\t\t\t\tplaceholderMultiline: ${shell.placeholderMultiline ? 'true' : 'false'},`,
		]),
		...(shell.staticWrapper === undefined ? [] : [
			`\t\t\t\tstaticWrapper: ${quote(shell.staticWrapper)},`,
		]),
		...(shell.staticTitle === undefined ? [] : [
			`\t\t\t\tstaticTitle: ${quote(shell.staticTitle)},`,
		]),
		...(shell.staticLinks === undefined ? [] : [
			`\t\t\t\tstaticLinks: [`,
			...shell.staticLinks.flatMap((link) => [
				`\t\t\t\t\t{`,
				`\t\t\t\t\t\tlabel: ${quote(link.label)},`,
				`\t\t\t\t\t\troute: ${quote(link.route)},`,
				`\t\t\t\t\t},`,
			]),
			`\t\t\t\t],`,
		]),
		...(shell.proposalLevel === undefined ? [] : [
			`\t\t\t\tproposalLevel: ${quote(shell.proposalLevel)},`,
		]),
		...(shell.collapsible === undefined ? [] : [
			`\t\t\t\tcollapsible: ${shell.collapsible ? 'true' : 'false'},`,
		]),
		...(shell.open === undefined ? [] : [
			`\t\t\t\topen: ${shell.open ? 'true' : 'false'},`,
		]),
		...(shell.stateComment === undefined ? [] : [
			`\t\t\t\tstateComment: ${quote(shell.stateComment)},`,
		]),
		...(shell.blankLineBeforeComponents === undefined ? [] : [
			`\t\t\t\tblankLineBeforeComponents: ${shell.blankLineBeforeComponents ? 'true' : 'false'},`,
		]),
		...(shell.blankLineBeforePageClose === undefined ? [] : [
			`\t\t\t\tblankLineBeforePageClose: ${shell.blankLineBeforePageClose ? 'true' : 'false'},`,
		]),
		...(shell.viewImportBeforePage === undefined ? [] : [
			`\t\t\t\tviewImportBeforePage: ${shell.viewImportBeforePage ? 'true' : 'false'},`,
		]),
		...(shell.sources === undefined ? [] : [
			`\t\t\t\tsources: ${serializeStringArray(shell.sources, '\t\t\t\t')},`,
		]),
		...(shell.sourceText === undefined ? [] : [
			`\t\t\t\tsourceText: ${serializeText(shell.sourceText)},`,
		]),
		`\t\t\t\tsourceFile: ${quote(shell.sourceFile)},`,
		'\t\t\t},',
	]),
	'\t\t]',
].join('\n')

const serializeRouteSectionShells = (shells: readonly AppRouteSectionShell[]) => [
	'[',
	...shells.flatMap((shell) => [
		'\t\t\t{',
		`\t\t\t\troutePath: ${quote(shell.routePath)},`,
		`\t\t\t\tvisiblePath: ${quote(shell.visiblePath)},`,
		`\t\t\t\trouteGroupPath: ${quote(shell.routeGroupPath)},`,
		`\t\t\t\tcomponents: ${serializeStringArray(shell.components, '\t\t\t\t')},`,
		`\t\t\t\tusesDataSelector: ${shell.usesDataSelector ? 'true' : 'false'},`,
		`\t\t\t\tusesParams: ${shell.usesParams ? 'true' : 'false'},`,
		`\t\t\t\tusesSelect: ${shell.usesSelect ? 'true' : 'false'},`,
		`\t\t\t\tkind: ${quote(shell.kind)},`,
		...(shell.viewComponent === undefined ? [] : [
			`\t\t\t\tviewComponent: ${quote(shell.viewComponent)},`,
		]),
		...(shell.viewFile === undefined ? [] : [
			`\t\t\t\tviewFile: ${quote(shell.viewFile)},`,
		]),
		...(shell.entityType === undefined ? [] : [
			`\t\t\t\tentityType: ${quote(shell.entityType)},`,
		]),
		...(shell.scope === undefined ? [] : [
			`\t\t\t\tscope: ${quote(shell.scope)},`,
		]),
		...(shell.derivedConstants === undefined ? [] : [
			`\t\t\t\tderivedConstants: [`,
			...shell.derivedConstants.flatMap((derivedConstant) => [
				`\t\t\t\t\t{`,
				`\t\t\t\t\t\tname: ${quote(derivedConstant.name)},`,
				`\t\t\t\t\t\texpression: ${serializeText(derivedConstant.expression)},`,
				`\t\t\t\t\t},`,
			]),
			`\t\t\t\t],`,
		]),
		...(shell.selectorExpression === undefined ? [] : [
			`\t\t\t\tselectorExpression: ${serializeText(shell.selectorExpression)},`,
		]),
		...(shell.title === undefined ? [] : [
			`\t\t\t\ttitle: ${quote(shell.title)},`,
		]),
		...(shell.viewTitle === undefined ? [] : [
			`\t\t\t\tviewTitle: ${quote(shell.viewTitle)},`,
		]),
		...(shell.titleExpression === undefined ? [] : [
			`\t\t\t\ttitleExpression: ${serializeText(shell.titleExpression)},`,
		]),
		...(shell.hrefExpression === undefined ? [] : [
			`\t\t\t\threfExpression: ${serializeText(shell.hrefExpression)},`,
		]),
		...(shell.hrefWrapped === undefined ? [] : [
			`\t\t\t\threfWrapped: true,`,
		]),
		...(shell.idExpression === undefined ? [] : [
			`\t\t\t\tidExpression: ${serializeText(shell.idExpression)},`,
		]),
		...(shell.keyExpression === undefined ? [] : [
			`\t\t\t\tkeyExpression: ${serializeText(shell.keyExpression)},`,
		]),
		...(shell.nestedParents === undefined ? [] : [
			`\t\t\t\tnestedParents: [`,
			...shell.nestedParents.flatMap((nestedParent) => [
				`\t\t\t\t\t{`,
				`\t\t\t\t\t\ttitle: ${quote(nestedParent.title)},`,
				`\t\t\t\t\t\threfExpression: ${serializeText(nestedParent.hrefExpression)},`,
				`\t\t\t\t\t\tidExpression: ${serializeText(nestedParent.idExpression)},`,
				`\t\t\t\t\t},`,
			]),
			`\t\t\t\t],`,
		]),
		...(shell.childrenName === undefined ? [] : [
			`\t\t\t\tchildrenName: ${quote(shell.childrenName)},`,
		]),
		...(shell.usesEip155NetworkSelectorFromCaip2 === undefined ? [] : [
			`\t\t\t\tusesEip155NetworkSelectorFromCaip2: ${shell.usesEip155NetworkSelectorFromCaip2 ? 'true' : 'false'},`,
		]),
		...(shell.usesStringify === undefined ? [] : [
			`\t\t\t\tusesStringify: ${shell.usesStringify ? 'true' : 'false'},`,
		]),
		...(shell.proposalLevel === undefined ? [] : [
			`\t\t\t\tproposalLevel: ${quote(shell.proposalLevel)},`,
		]),
		...(shell.sourceText === undefined ? [] : [
			`\t\t\t\tsourceText: ${serializeText(shell.sourceText)},`,
		]),
		`\t\t\t\tsourceFile: ${quote(shell.sourceFile)},`,
		'\t\t\t},',
	]),
	'\t\t]',
].join('\n')

const serializeResolverCoverage = (coverageRows: readonly AppResolverCoverage[]) => serializeTableRows(
	'AppResolverCoverage',
	[
		'entity',
		'source',
		'status',
	],
	coverageRows.map((coverage) => [
		quote(coverage.entity),
		quote(coverage.source),
		quote(coverage.status),
	]),
	'\t\t'
)

const serializeResolverCoverageLedger = (coverageRows: readonly AppResolverCoverageLedgerRow[]) => serializeTableRows(
	'AppResolverCoverageLedgerRow',
	[
		'source',
		'status',
		'providerBinding',
		'resolverFile',
		'sourceRuntimeArtifacts',
		'schemaEntitiesTouched',
		'actionValidationRisk',
	],
	coverageRows.map((coverage) => [
		quote(coverage.source),
		quote(coverage.status),
		quote(coverage.providerBinding),
		quote(coverage.resolverFile),
		quote(coverage.sourceRuntimeArtifacts),
		quote(coverage.schemaEntitiesTouched),
		quote(coverage.actionValidationRisk),
	]),
	'\t\t'
)

const serializeProbes = (probes: readonly AppProbe[]) => serializeTableRows(
	'AppProbe',
	[
		'path',
	],
	probes.map((probe) => [
		quote(probe.path),
	]),
	'\t\t'
)

const appTypesSource = `
export type App = {
\tschema: {
\t\tentities: AppSchemaEntity[]
\t}
\tsources: {
\t\tproviders: AppSourceProvider[]
\t\tsources: AppSource[]
\t\tbindings: AppSourceBinding[]
\t\truntimeBindings: AppRuntimeSourceBinding[]
\t\truntimeArtifacts: AppRuntimeSourceArtifact[]
\t}
\tresolvers: {
\t\tcoverage: AppResolverCoverage[]
\t\tledger: AppResolverCoverageLedgerRow[]
\t}
\tviews: {
\t\trenderers: {
\t\t\tid: string
\t\t\ttarget: string
\t\t}[]
\t\tentityViews: AppEntityView[]
\t\tentityViewShells: AppEntityViewShell[]
\t}
\troutes: {
\t\tsections: AppRouteSection[]
\t\tpages: AppRoutePage[]
\t\tselectorMappings: AppSelectorRouteMapping[]
\t\thubCollections: AppHubCollectionRoute[]
\t\tloaderTransforms: AppRouteLoaderTransform[]
\t\tpageShells: AppRoutePageShell[]
\t\tsectionShells: AppRouteSectionShell[]
\t\taliases: {
\t\t\tfrom: string
\t\t\tto: string
\t\t}[]
\t}
\tprobes: {
\t\troutes: AppProbe[]
\t\tboundaries: AppProbe[]
\t\tcors: AppProbe[]
\t}
}

type AppSchemaEntity = {
\tname: string
\tlabel?: string
\tlabelPlural?: string
\tdescription?: string
\tnotes?: string
\tenums?: {
\t\tname: string
\t\tmembers: {
\t\t\tname: string
\t\t\tvalue: string
\t\t}[]
\t}[]
\tselectors: {
\t\tname: string
\t\tfields: string[]
\t\tmember?: string
\t\tvalue?: string
\t}[]
\tfields: {
\t\tname: string
\t\ttype: string
\t\tcardinality: string
\t\tlabel?: string
\t\tlabelPlural?: string
\t\tdescription?: string
\t}[]
\tsourceBindings: string[]
\tview?: string
}

type AppSourceProvider = {
\tid: string
\tlabel: string
}

type AppSource = {
\tid: string
\tprovider: string
\tlabel: string
}

type AppSourceBinding = {
\tid: string
\tsource: string
\ttarget: string
}

type AppRuntimeSourceBinding = {
\tprovider: string
\tsource: string
\ttargetKind: string
\ttargetKey: string
\tendpointCount: number
\twireProtocol: string
\tapiFamily: string
\toperationGroups: string[]
\tdelivery: string
\tartifactCount: number
}

type AppRuntimeSourceArtifact = {
\tsource: string
\tkind: string
\tpath: string
\tgenerated: boolean
}

type AppProbe = {
\tpath: string
}

type AppResolverCoverage = {
\tentity: string
\tsource: string
\tstatus:
\t\t| 'implemented'
\t\t| 'no resolver'
\t\t| 'deferred-schema'
\t\t| 'deferred-runtime'
\t\t| 'deferred-artifact'
}

type AppResolverCoverageLedgerRow = {
\tsource: string
\tstatus: AppResolverCoverage['status']
\tproviderBinding: string
\tresolverFile: string
\tsourceRuntimeArtifacts: string
\tschemaEntitiesTouched: string
\tactionValidationRisk: string
}

type AppEntityView = {
\tentity: string
\tkind: 'singular' | 'plural'
\tfile: string
\townership: 'generated' | 'hand-owned'
}

type AppEntityViewShell = {
\tentity: string
\tviewName: string
\tfile: string
\tcapabilities: string[]
\tsourceText?: string
\tsourceFile: string
}

type AppRouteSection = {
\tid: string
\tpath: string
}

type AppRoutePage = {
\tid: string
\tpath: string
\townership: 'generated' | 'hand-owned'
}

type AppSelectorRouteMapping = {
\tentity: string
\tselector: string
\tfields: string[]
\toutcome:
\t\t| 'canonical'
\t\t| 'alias'
\t\t| 'nested'
\t\t| 'observation'
\t\t| 'hub-backed'
\t\t| 'internal-only'
\t\t| 'collision-disambiguated'
\t\t| 'unresolved'
\tpath?: string
\tvisiblePath?: string
\temitPage?: boolean
\tparentFields: string[]
\tlocalFields: string[]
\tparams?: {
\t\tfield: string
\t\tname: string
\t\tmatcher?: string
\t}[]
\tunresolved: string[]
\treason?: string
}

type AppHubCollectionRoute = {
\tentity: string
\thub: string
\tpath: string
\tview: string
\tunresolved: string[]
}

type AppRouteLoaderTransform = {
\tentity: string
\troutePath: string
\tvisiblePath: string
\tparams: string[]
\tselectorFields: string[]
\timportedSymbols: string[]
\tselectorExpression: string
\tsimpleDirectParamShape: boolean
\tsourceFile: string
}

type AppRoutePageShell = {
\troutePath: string
\tvisiblePath: string
\trouteGroupPath: string
\tcomponents: string[]
\tusesDataSelector: boolean
\tusesParams: boolean
\tusesSelect: boolean
\tkind: 'global-collection' | 'global-source-collection' | 'data-selector-detail' | 'data-selector-simple-detail' | 'data-selector-child-collection' | 'param-id-detail' | 'param-selector-detail' | 'scope-detail' | 'direct-selector-detail' | 'derived-selector-detail' | 'linked-view' | 'simple-view' | 'catalog-param-detail' | 'global-hub-tabs' | 'eip155-network-collection' | 'evm-protocol-collection' | 'youtube-parent-collection' | 'social-network-child-collection' | 'decoded-parent-child-collection' | 'decoded-param-detail' | 'lens-account-detail' | 'proposal-selector-detail' | 'placeholder' | 'param-heading' | 'static-page' | 'custom'
\tviewComponent?: string
\tviewFile?: string
\tentityType?: string
\tparamName?: string
\tselectorExpression?: string
\tselectorImportStyle?: 'sectioned'
\tselectorDeclaration?: string
\trouteImports?: string[]
\tfunctionImports?: string[]
\tselectorGuard?: string
\tinvalidText?: string
\tinvalidOutsidePage?: boolean
\tviewProps?: string[]
\tderivedConstants?: {
\t\tname: string
\t\texpression: string
\t}[]
\timportEntitySelectorType?: boolean
\timportEip155NetworkSelectorFromCaip2?: boolean
\timportZeroExHex?: boolean
\tzeroExHexImportSymbols?: string
\tzeroExHexImportWithSchemaImports?: boolean
\timportWith0xHex?: boolean
\twith0xHexImportSection?: 'types' | 'functions'
\ttypeConstantsAfterSchemaImports?: boolean
\tparamsMultiline?: boolean
\tcomponentIndentExtra?: boolean
\texplicitClosingTag?: boolean
\tscope?: string
\threfExpression?: string
\tchildField?: string
\tcollectionEntityType?: string
\tglobalScope?: string
\tglobalField?: string
\tglobalSourceField?: string
\tglobalSourceSources?: string[]
\tglobalSourceIndentExtra?: boolean
\tglobalSourceOmitContextSection?: boolean
\tid?: string
\tlimit?: number
\ttitle?: string
\ttitleExpression?: string
\theadTitle?: string
\tsortMode?: string
\tcatalogImports?: string[]
\tcatalogParamType?: string
\tcatalogRowsName?: string
\tcatalogRowName?: string
\tcatalogLookupName?: string
\tcatalogLookupField?: string
\tcatalogRouteKey?: string
\tcatalogTitleExpression?: string
\tcatalogNotFoundCondition?: string
\tcatalogMissingText?: string
\tcatalogUnknownText?: string
\tcatalogNotFoundId?: string
\tcatalogDetailId?: string
\thubKey?: string
\thubScope?: string
\thubTitleExpression?: string
\thubHref?: string
\thubSections?: {
\t\tid: string
\t\tlabel: string
\t\tviewComponent?: string
\t\thref?: string
\t\tglobalField?: string
\t\tviewId?: string
\t\tplaceholderText?: string
\t}[]
\tnetworkCollectionField?: string
\tnetworkCollectionSources?: string[]
\tnetworkCollectionCount?: boolean
\tnetworkCollectionInlineSources?: boolean
\tnetworkCollectionHrefAfterSelection?: boolean
\tnetworkCollectionTightContextState?: boolean
\tprotocolCollectionField?: string
\tparentSelectorField?: string
\tparentSelectorParam?: string
\tparentSelectorTransform?: 'lowercase' | 'number'
\tnetworkScope?: string
\tplaceholderText?: string
\tplaceholderMultiline?: boolean
\tstaticWrapper?: 'section-column' | 'main-card'
\tstaticTitle?: string
\tstaticLinks?: {
\t\tlabel: string
\t\troute: string
\t}[]
\tproposalLevel?: 'realm' | 'kind' | 'proposal'
\tcollapsible?: boolean
\topen?: boolean
\tstateComment?: string
\tblankLineBeforeComponents?: boolean
\tblankLineBeforePageClose?: boolean
\tviewImportBeforePage?: boolean
\tsources?: string[]
\tsourceText?: string
\tsourceFile: string
}

type AppRouteSectionShell = Omit<
\tAppRoutePageShell,
\t| 'kind'
\t| 'viewComponent'
\t| 'entityType'
\t| 'paramName'
\t| 'scope'
\t| 'hrefExpression'
\t| 'childField'
\t| 'collectionEntityType'
\t| 'globalScope'
\t| 'globalField'
\t| 'id'
\t| 'limit'
\t| 'title'
\t| 'collapsible'
\t| 'open'
\t| 'stateComment'
\t| 'blankLineBeforeComponents'
\t| 'blankLineBeforePageClose'
\t| 'viewImportBeforePage'
\t| 'sources'
\t| 'sourceText'
> & {
\tkind: 'app-shell' | 'parent-collapsible' | 'nested-parent-collapsible' | 'page-param-parent-collapsible' | 'param-summary-collapsible' | 'keyed-param-summary-collapsible' | 'scope-summary-collapsible' | 'page-param-summary-collapsible' | 'proposal-parent-collapsible' | 'passthrough' | 'custom'
\tviewComponent?: string
\tviewFile?: string
\tentityType?: string
\tscope?: string
\tderivedConstants?: {
\t\tname: string
\t\texpression: string
\t}[]
\tselectorExpression?: string
\ttitle?: string
\tviewTitle?: string
\ttitleExpression?: string
\threfExpression?: string
\threfWrapped?: boolean
\tidExpression?: string
\tkeyExpression?: string
\tnestedParents?: {
\t\ttitle: string
\t\threfExpression: string
\t\tidExpression: string
\t}[]
\tchildrenName?: string
\tusesEip155NetworkSelectorFromCaip2?: boolean
\tusesStringify?: boolean
\tproposalLevel?: 'realm' | 'kind' | 'proposal'
\tsourceText?: string
}
`.trim()

export const assembleApp = async () => {
	await extract()

	const facts = [
		...readJsonl<SchemaFact>('.generated/extracted/schema-facts.jsonl'),
		...readJsonl<SchemaFact>('.generated/extracted/source-facts.jsonl'),
		...readJsonl<SchemaFact>('.generated/extracted/view-facts.jsonl'),
		...readJsonl<SchemaFact>('.generated/extracted/route-facts.jsonl'),
		...readJsonl<SchemaFact>('.generated/extracted/resolver-facts.jsonl'),
		...readJsonl<SchemaFact>('.generated/extracted/test-facts.jsonl'),
	]
	const entities = schemaFactsToEntities(facts)
	const providers = factsToSourceProviders(facts)
	const sources = factsToSources(facts)
	const bindings = schemaFactsToSourceBindings(facts)
	const runtimeBindings = factsToRuntimeSourceBindings(facts)
	const runtimeArtifacts = factsToRuntimeSourceArtifacts(facts)
	const entityViews = factsToEntityViews(facts)
	const entityViewShells = factsToEntityViewShells(
		facts,
		entityViews,
		entities
	)
	const routeSections = factsToRouteSections(facts)
	const routePages = factsToRoutePages(facts)
	const selectorRouteMappings = factsToSelectorRouteMappings(facts)
	const hubCollectionRoutes = factsToHubCollectionRoutes(facts)
	const routeLoaderTransforms = factsToRouteLoaderTransforms(facts)
	const routePageShells = factsToRoutePageShells(facts, selectorRouteMappings)
	const routeSectionShells = factsToRouteSectionShells(facts)
	const resolverCoverage = factsToResolverCoverage(facts)
	const resolverCoverageLedger = factsToResolverCoverageLedger(facts)
	const routeProbes = factsToProbes(facts, 'route')
	const boundaryProbes = factsToProbes(facts, 'boundary')
	const corsProbes = factsToProbes(facts, 'cors')

	writeText('APP.ts', [
		serializeStringEnum('AppEntityType', entities.map((entity) => entity.name)),
		'',
		serializeStringEnum('AppSourceProvider', providers.map((provider) => provider.id)),
		'',
		serializeStringEnum('AppSource', sources.map((source) => source.id)),
		'',
		serializeStringEnum('AppSourceBinding', bindings.map((binding) => binding.id)),
		'',
		'export const APP = {',
		'\tschema: {',
		`\t\tentities: ${serializeAppEntities(entities)},`,
		'\t},',
		'',
	'\tsources: {',
		`\t\tproviders: ${serializeSourceProviders(providers)},`,
		`\t\tsources: ${serializeSources(sources)},`,
		`\t\tbindings: ${serializeSourceBindings(bindings)},`,
		`\t\truntimeBindings: ${serializeRuntimeSourceBindings(runtimeBindings)},`,
		`\t\truntimeArtifacts: ${serializeRuntimeSourceArtifacts(runtimeArtifacts)},`,
		'\t},',
		'',
	'\tresolvers: {',
		`\t\tcoverage: ${serializeResolverCoverage(resolverCoverage)},`,
		`\t\tledger: ${serializeResolverCoverageLedger(resolverCoverageLedger)},`,
		'\t},',
		'',
	'\tviews: {',
	'\t\trenderers: [],',
	`\t\tentityViews: ${serializeEntityViews(entityViews)},`,
	`\t\tentityViewShells: ${serializeEntityViewShells(entityViewShells)},`,
	'\t},',
		'',
		'\troutes: {',
		`\t\tsections: ${serializeRouteSections(routeSections)},`,
		`\t\tpages: ${serializeRoutePages(routePages)},`,
		`\t\tselectorMappings: ${serializeSelectorRouteMappings(selectorRouteMappings)},`,
		`\t\thubCollections: ${serializeHubCollectionRoutes(hubCollectionRoutes)},`,
		`\t\tloaderTransforms: ${serializeRouteLoaderTransforms(routeLoaderTransforms)},`,
		`\t\tpageShells: ${serializeRouteSvelteShells(routePageShells)},`,
		`\t\tsectionShells: ${serializeRouteSectionShells(routeSectionShells)},`,
		'\t\taliases: [],',
		'\t},',
		'',
		'\tprobes: {',
		`\t\troutes: ${serializeProbes(routeProbes)},`,
		`\t\tboundaries: ${serializeProbes(boundaryProbes)},`,
		`\t\tcors: ${serializeProbes(corsProbes)},`,
		'\t},',
		'} as const satisfies App',
		'',
		appTypesSource,
	].join('\n'))

	console.log(`Assembled APP.ts with ${entities.length} schema entities, ${providers.length} source providers, ${sources.length} sources, ${bindings.length} schema source bindings, ${runtimeBindings.length} runtime source bindings, ${runtimeArtifacts.length} runtime source artifacts, ${resolverCoverage.length} resolver coverage rows, ${entityViews.length} entity views, ${entityViewShells.length} entity view shells, ${routePages.length} route pages, ${selectorRouteMappings.length} selector route mappings, ${hubCollectionRoutes.length} hub collection routes, ${routeLoaderTransforms.length} route loader transforms, ${routePageShells.length} route page shells, ${routeSectionShells.length} route section shells, and ${routeProbes.length + boundaryProbes.length + corsProbes.length} probes`)
}
