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
	sourceText: string
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
	sourceText: string
	sourceFile: string
}

type AppRouteSectionShell = AppRoutePageShell

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
				sourceText: generatedEntityViewShellSource(
					entityByName[value.entity],
					value.sourceText
				),
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

	return {
		routePath: value.routePath,
		visiblePath: value.visiblePath,
		routeGroupPath: value.routeGroupPath,
		components: value.components,
		usesDataSelector: value.usesDataSelector,
		usesParams: value.usesParams,
		usesSelect: value.usesSelect,
		sourceText: value.sourceText,
		sourceFile: fact.sourceFile,
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

const quote = (value: string) => (
	`'${value.replace(/\\/g, '\\\\').replace(/'/g, '\\\'')}'`
)

const fieldLabel = (
	field: AppEntity['fields'][number]
) => (
	field.label
	?? field.name
		.replace(/^\$\$?/, '')
		.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
		.replace(/[_-]+/g, ' ')
		.toLowerCase()
)

const generatedEntityViewShellSource = (
	entity: AppEntity | undefined,
	sourceText: string
) => {
	if (
		entity === undefined
		|| !sourceText.includes('const view =')
		|| !sourceText.includes('<EntityView2')
		|| sourceText.includes('ResourceBoundary')
		|| sourceText.includes('{#snippet')
		|| sourceText.includes('Render:')
		|| sourceText.includes('Content:')
		|| sourceText.includes('import { select }')
	)
		return sourceText

	const closedFields = (
		entity.selectors[0]?.fields.filter((fieldName) => entity.fields.some((field) => field.name === fieldName && !field.type.startsWith('$:')))
		?? []
	)
	const contentFields = entity.fields
		.filter((field) => field.cardinality !== 'Zero' && !field.type.startsWith('$:'))
		.map((field) => field.name)
	const detailFields = entity.fields
		.filter((field) => field.name.startsWith('$$') || (field.cardinality === 'Many' && field.type.startsWith('$:')))

	return `<script lang="ts">
\t// Types/constants
\timport type { ComponentProps } from 'svelte'
\timport type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
\timport type { WithRest } from '$/typescript/WithRest.ts'
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { schema } from '$/schema/index.ts'


\t// State
\tconst view = {
\t\tclosed: ${serializeGeneratedViewFieldArray(closedFields)},
\t\tcontent: {
\t\t\tdl: [
\t\t\t\t${serializeGeneratedViewFieldArray(contentFields, '\t\t\t\t')},
\t\t\t],
\t\t},
${detailFields.length === 0 ? '' : `\t\tdetails: {
\t\t\ttabs: [
${detailFields.map((field) => `\t\t\t\t{
\t\t\t\t\tlabel: ${quote(field.labelPlural ?? fieldLabel(field))},
\t\t\t\t\twhen: 'open',
\t\t\t\t\titems: [
\t\t\t\t\t\t${quote(field.name)},
\t\t\t\t\t],
\t\t\t\t},`).join('\n')}
\t\t\t],
\t\t},
`}\t} satisfies ComponentProps<typeof EntityView2>['view']

\tlet {
\t\tselection,
\t\topen = $bindable(true),
\t\t...EntityViewProps
\t}: WithRest<
\t\t{
\t\t\tselection: EntityProxyResource<typeof schema, EntityType.${entity.name}>
\t\t\topen?: boolean
\t\t},
\t\tPick<
\t\t\tComponentProps<typeof EntityView2>,
\t\t\t| 'layout'
\t\t\t| 'showTypeAnnotation'
\t\t>
\t> = $props()


\t// Components
\timport EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
\t{selection}
\tentityType={EntityType.${entity.name}}
\tentitySelector={selection.entitySelector}
\tbind:open
\t{...EntityViewProps}
\t{view}
/>
`
}

const serializeGeneratedViewFieldArray = (
	fields: readonly string[],
	indent = '\t\t'
) => {
	if (fields.length === 0)
		return '[]'

	return [
		'[',
		...fields.map((field) => `${indent}\t${quote(field)},`),
		`${indent}]`,
	].join('\n')
}

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
		'\t\t\t\tselectors: [',
		...entity.selectors.flatMap((selector) => [
			'\t\t\t\t\t{',
			`\t\t\t\t\t\tname: ${quote(selector.name)},`,
			`\t\t\t\t\t\tfields: ${serializeStringArray(selector.fields, '\t\t\t\t\t\t')},`,
			...(selector.member === undefined ? [] : [
				`\t\t\t\t\t\tmember: ${quote(selector.member)},`,
			]),
			...(selector.value === undefined ? [] : [
				`\t\t\t\t\t\tvalue: ${quote(selector.value)},`,
			]),
			'\t\t\t\t\t},',
		]),
		'\t\t\t\t],',
		'\t\t\t\tfields: [',
		...entity.fields.flatMap((field) => [
			'\t\t\t\t\t{',
			`\t\t\t\t\t\tname: ${quote(field.name)},`,
			`\t\t\t\t\t\ttype: ${quote(field.type)},`,
			`\t\t\t\t\t\tcardinality: ${quote(field.cardinality)},`,
			...(field.label === undefined ? [] : [
				`\t\t\t\t\t\tlabel: ${quote(field.label)},`,
			]),
			...(field.labelPlural === undefined ? [] : [
				`\t\t\t\t\t\tlabelPlural: ${quote(field.labelPlural)},`,
			]),
			...(field.description === undefined ? [] : [
				`\t\t\t\t\t\tdescription: ${quote(field.description)},`,
			]),
			'\t\t\t\t\t},',
		]),
		'\t\t\t\t],',
		`\t\t\t\tsourceBindings: ${serializeStringArray(entity.sourceBindings, '\t\t\t\t')},`,
		...(entity.view === undefined ? [] : [
			`\t\t\t\tview: ${quote(entity.view)},`,
		]),
		'\t\t\t},',
	]),
	'\t\t]',
].join('\n')

const serializeSourceProviders = (providers: readonly AppSourceProvider[]) => [
	'[',
	...providers.flatMap((provider) => [
		'\t\t\t{',
		`\t\t\t\tid: ${quote(provider.id)},`,
		`\t\t\t\tlabel: ${quote(provider.label)},`,
		'\t\t\t},',
	]),
	'\t\t]',
].join('\n')

const serializeSources = (sources: readonly AppSource[]) => [
	'[',
	...sources.flatMap((source) => [
		'\t\t\t{',
		`\t\t\t\tid: ${quote(source.id)},`,
		`\t\t\t\tprovider: ${quote(source.provider)},`,
		`\t\t\t\tlabel: ${quote(source.label)},`,
		'\t\t\t},',
	]),
	'\t\t]',
].join('\n')

const serializeSourceBindings = (bindings: readonly AppSourceBinding[]) => [
	'[',
	...bindings.flatMap((binding) => [
		'\t\t\t{',
		`\t\t\t\tid: ${quote(binding.id)},`,
		`\t\t\t\tsource: ${quote(binding.source)},`,
		`\t\t\t\ttarget: ${quote(binding.target)},`,
		'\t\t\t},',
	]),
	'\t\t]',
].join('\n')

const serializeRuntimeSourceBindings = (bindings: readonly AppRuntimeSourceBinding[]) => [
	'[',
	...bindings.flatMap((binding) => [
		'\t\t\t{',
		`\t\t\t\tprovider: ${quote(binding.provider)},`,
		`\t\t\t\tsource: ${quote(binding.source)},`,
		`\t\t\t\ttargetKind: ${quote(binding.targetKind)},`,
		`\t\t\t\ttargetKey: ${quote(binding.targetKey)},`,
		`\t\t\t\tendpointCount: ${binding.endpointCount},`,
		`\t\t\t\twireProtocol: ${quote(binding.wireProtocol)},`,
		`\t\t\t\tapiFamily: ${quote(binding.apiFamily)},`,
		`\t\t\t\toperationGroups: ${serializeStringArray(binding.operationGroups, '\t\t\t\t')},`,
		`\t\t\t\tdelivery: ${quote(binding.delivery)},`,
		`\t\t\t\tartifactCount: ${binding.artifactCount},`,
		'\t\t\t},',
	]),
	'\t\t]',
].join('\n')

const serializeRuntimeSourceArtifacts = (artifacts: readonly AppRuntimeSourceArtifact[]) => [
	'[',
	...artifacts.flatMap((artifact) => [
		'\t\t\t{',
		`\t\t\t\tsource: ${quote(artifact.source)},`,
		`\t\t\t\tkind: ${quote(artifact.kind)},`,
		`\t\t\t\tpath: ${quote(artifact.path)},`,
		`\t\t\t\tgenerated: ${artifact.generated ? 'true' : 'false'},`,
		'\t\t\t},',
	]),
	'\t\t]',
].join('\n')

const serializeEntityViews = (views: readonly AppEntityView[]) => [
	'[',
	...views.flatMap((view) => [
		'\t\t\t{',
		`\t\t\t\tentity: ${quote(view.entity)},`,
		`\t\t\t\tkind: ${quote(view.kind)},`,
		`\t\t\t\tfile: ${quote(view.file)},`,
		`\t\t\t\townership: ${quote(view.ownership)},`,
		'\t\t\t},',
	]),
	'\t\t]',
].join('\n')

const serializeEntityViewShells = (shells: readonly AppEntityViewShell[]) => [
	'[',
	...shells.flatMap((shell) => [
		'\t\t\t{',
		`\t\t\t\tentity: ${quote(shell.entity)},`,
		`\t\t\t\tviewName: ${quote(shell.viewName)},`,
		`\t\t\t\tfile: ${quote(shell.file)},`,
		`\t\t\t\tcapabilities: ${serializeStringArray(shell.capabilities, '\t\t\t\t')},`,
		`\t\t\t\tsourceText: ${serializeText(shell.sourceText)},`,
		`\t\t\t\tsourceFile: ${quote(shell.sourceFile)},`,
		'\t\t\t},',
	]),
	'\t\t]',
].join('\n')

const serializeRouteSections = (sections: readonly AppRouteSection[]) => [
	'[',
	...sections.flatMap((section) => [
		'\t\t\t{',
		`\t\t\t\tid: ${quote(section.id)},`,
		`\t\t\t\tpath: ${quote(section.path)},`,
		'\t\t\t},',
	]),
	'\t\t]',
].join('\n')

const serializeRoutePages = (pages: readonly AppRoutePage[]) => [
	'[',
	...pages.flatMap((page) => [
		'\t\t\t{',
		`\t\t\t\tid: ${quote(page.id)},`,
		`\t\t\t\tpath: ${quote(page.path)},`,
		`\t\t\t\townership: ${quote(page.ownership)},`,
		'\t\t\t},',
	]),
	'\t\t]',
].join('\n')

const serializeSelectorRouteMappings = (mappings: readonly AppSelectorRouteMapping[]) => [
	'[',
	...mappings.flatMap((mapping) => [
		'\t\t\t{',
		`\t\t\t\tentity: ${quote(mapping.entity)},`,
		`\t\t\t\tselector: ${quote(mapping.selector)},`,
		`\t\t\t\tfields: ${serializeStringArray(mapping.fields, '\t\t\t\t')},`,
		`\t\t\t\toutcome: ${quote(mapping.outcome)},`,
		...(mapping.path === undefined ? [] : [
			`\t\t\t\tpath: ${quote(mapping.path)},`,
		]),
		...(mapping.visiblePath === undefined ? [] : [
			`\t\t\t\tvisiblePath: ${quote(mapping.visiblePath)},`,
		]),
		...(mapping.emitPage === undefined ? [] : [
			`\t\t\t\temitPage: ${mapping.emitPage ? 'true' : 'false'},`,
		]),
		`\t\t\t\tparentFields: ${serializeStringArray(mapping.parentFields, '\t\t\t\t')},`,
		`\t\t\t\tlocalFields: ${serializeStringArray(mapping.localFields, '\t\t\t\t')},`,
		'\t\t\t\tparams: [',
		...mapping.params.flatMap((param) => [
			'\t\t\t\t\t{',
			`\t\t\t\t\t\tfield: ${quote(param.field)},`,
			`\t\t\t\t\t\tname: ${quote(param.name)},`,
			...(param.matcher === undefined ? [] : [
				`\t\t\t\t\t\tmatcher: ${quote(param.matcher)},`,
			]),
			'\t\t\t\t\t},',
		]),
		'\t\t\t\t],',
		`\t\t\t\tunresolved: ${serializeStringArray(mapping.unresolved, '\t\t\t\t')},`,
		...(mapping.reason === undefined ? [] : [
			`\t\t\t\treason: ${quote(mapping.reason)},`,
		]),
		'\t\t\t},',
	]),
	'\t\t]',
].join('\n')

const serializeHubCollectionRoutes = (routes: readonly AppHubCollectionRoute[]) => [
	'[',
	...routes.flatMap((route) => [
		'\t\t\t{',
		`\t\t\t\tentity: ${quote(route.entity)},`,
		`\t\t\t\thub: ${quote(route.hub)},`,
		`\t\t\t\tpath: ${quote(route.path)},`,
		`\t\t\t\tview: ${quote(route.view)},`,
		`\t\t\t\tunresolved: ${serializeStringArray(route.unresolved, '\t\t\t\t')},`,
		'\t\t\t},',
	]),
	'\t\t]',
].join('\n')

const serializeRouteLoaderTransforms = (transforms: readonly AppRouteLoaderTransform[]) => [
	'[',
	...transforms.flatMap((transform) => [
		'\t\t\t{',
		`\t\t\t\tentity: ${quote(transform.entity)},`,
		`\t\t\t\troutePath: ${quote(transform.routePath)},`,
		`\t\t\t\tvisiblePath: ${quote(transform.visiblePath)},`,
		`\t\t\t\tparams: ${serializeStringArray(transform.params, '\t\t\t\t')},`,
		`\t\t\t\tselectorFields: ${serializeStringArray(transform.selectorFields, '\t\t\t\t')},`,
		`\t\t\t\timportedSymbols: ${serializeStringArray(transform.importedSymbols, '\t\t\t\t')},`,
		`\t\t\t\tselectorExpression: ${serializeText(transform.selectorExpression)},`,
		`\t\t\t\tsimpleDirectParamShape: ${transform.simpleDirectParamShape ? 'true' : 'false'},`,
		`\t\t\t\tsourceFile: ${quote(transform.sourceFile)},`,
		'\t\t\t},',
	]),
	'\t\t]',
].join('\n')

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
		`\t\t\t\tsourceText: ${serializeText(shell.sourceText)},`,
		`\t\t\t\tsourceFile: ${quote(shell.sourceFile)},`,
		'\t\t\t},',
	]),
	'\t\t]',
].join('\n')

const serializeResolverCoverage = (coverageRows: readonly AppResolverCoverage[]) => [
	'[',
	...coverageRows.flatMap((coverage) => [
		'\t\t\t{',
		`\t\t\t\tentity: ${quote(coverage.entity)},`,
		`\t\t\t\tsource: ${quote(coverage.source)},`,
		`\t\t\t\tstatus: ${quote(coverage.status)},`,
		'\t\t\t},',
	]),
	'\t\t]',
].join('\n')

const serializeProbes = (probes: readonly AppProbe[]) => [
	'[',
	...probes.flatMap((probe) => [
		'\t\t\t{',
		`\t\t\t\tpath: ${quote(probe.path)},`,
		'\t\t\t},',
	]),
	'\t\t]',
].join('\n')

const appTypesSource = `
export type App = {
\tdocs: {
\t\tresolverCoverageMarkdown: string
\t\tsourcesMarkdown: string
\t}
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
\t}
\tviews: {
\t\trenderers: AppViewRenderer[]
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
\t\taliases: AppRouteAlias[]
\t}
\tprobes: {
\t\troutes: AppRouteProbe[]
\t\tboundaries: AppBoundaryProbe[]
\t\tcors: AppCorsProbe[]
\t}
}

type AppSchemaEntity = {
\tname: string
\tlabel?: string
\tlabelPlural?: string
\tdescription?: string
\tnotes?: string
\tenums?: AppSchemaEnum[]
\tselectors: AppSchemaSelector[]
\tfields: AppSchemaField[]
\tsourceBindings: string[]
\tview?: string
}

type AppSchemaEnum = {
\tname: string
\tmembers: {
\t\tname: string
\t\tvalue: string
\t}[]
}

type AppSchemaSelector = {
\tname: string
\tfields: string[]
\tmember?: string
\tvalue?: string
}

type AppSchemaField = {
\tname: string
\ttype: string
\tcardinality: string
\tlabel?: string
\tlabelPlural?: string
\tdescription?: string
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

type AppViewRenderer = {
\tid: string
\ttarget: string
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
\tsourceText: string
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
\tsourceText: string
\tsourceFile: string
}

type AppRouteSectionShell = AppRoutePageShell

type AppRouteAlias = {
\tfrom: string
\tto: string
}

type AppRouteProbe = {
\tpath: string
}

type AppBoundaryProbe = {
\tpath: string
}

type AppCorsProbe = {
\tpath: string
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
	const routeProbes = factsToProbes(facts, 'route')
	const boundaryProbes = factsToProbes(facts, 'boundary')
	const corsProbes = factsToProbes(facts, 'cors')

	writeText('APP.ts', [
		'export const APP = {',
		'\tdocs: {',
		`\t\tresolverCoverageMarkdown: ${serializeText(readText('RESOLVER-COVERAGE.md'))},`,
		`\t\tsourcesMarkdown: ${serializeText(readText('SOURCES.md'))},`,
		'\t},',
		'',
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
		`\t\tsectionShells: ${serializeRouteSvelteShells(routeSectionShells)},`,
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
