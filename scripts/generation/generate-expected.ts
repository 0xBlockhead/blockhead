import { rmSync } from 'node:fs'

import { loadApp } from './load-app.ts'
import { generatedOwnership, ownershipSummary } from './ownership.ts'
import { readText, writeText } from './files.ts'

type ExpectedApp = {
	schema: {
		entities: {
			name: string
			label?: string
			labelPlural?: string
			description?: string
			enums?: {
				name: string
				members: {
					name: string
					value: string
				}[]
			}[]
			selectors: {
				name: string
				fields: readonly string[]
				member?: string
				value?: string
			}[]
			fields: {
				name: string
				cardinality: string
				type: string
				label?: string
				labelPlural?: string
				description?: string
			}[]
			sourceBindings: readonly string[]
			view?: string
		}[]
	}
	sources: {
		providers: {
			id: string
			label: string
		}[]
		sources: {
			id: string
			provider: string
			label: string
		}[]
		bindings: {
			id: string
			source: string
			target: string
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
			source: string
			entity: string
			status: string
		}[]
		ledger: {
			source: string
			status: string
			providerBinding: string
			resolverFile: string
			sourceRuntimeArtifacts: string
			schemaEntitiesTouched: string
			actionValidationRisk: string
		}[]
	}
	views: {
		entityViews: {
			entity: string
			kind: 'singular' | 'plural'
			file: string
			ownership: string
		}[]
		entityViewShells: {
			entity: string
			viewName: string
			file: string
			capabilities: string[]
			sourceText?: string
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
		}[]
		pageShells: {
			routePath: string
			kind: 'global-collection' | 'global-source-collection' | 'data-selector-detail' | 'data-selector-simple-detail' | 'data-selector-child-collection' | 'param-id-detail' | 'param-selector-detail' | 'scope-detail' | 'direct-selector-detail' | 'derived-selector-detail' | 'linked-view' | 'simple-view' | 'catalog-param-detail' | 'global-hub-tabs' | 'eip155-network-collection' | 'evm-protocol-collection' | 'youtube-parent-collection' | 'social-network-child-collection' | 'decoded-parent-child-collection' | 'decoded-param-detail' | 'lens-account-detail' | 'proposal-selector-detail' | 'placeholder' | 'param-heading' | 'static-page' | 'query-resource-adapter-getters' | 'query-resource-adapter-promise' | 'collection-cache-debug' | 'resource-boundary-fixture' | 'evm-calldata-decoder-tool' | 'erc20-allowance-detail' | 'erc20-allowances-overview' | 'atproto-actor-detail' | 'atproto-actor-posts' | 'x-user-detail' | 'activitypub-notes' | 'activitypub-note-thread' | 'rss-feeds' | 'rss-feed-items' | 'youtube-video-comments' | 'xmtp-account-detail' | 'atproto-post-thread' | 'farcaster-cast-by-fname-hash' | 'farcaster-cast-by-fid-hash' | 'farcaster-trending-feed' | 'farcaster-open-cast' | 'nostr-profiles' | 'nostr-reactions' | 'evm-contracts-index' | 'services-hub' | 'market-detail' | 'coin-prices' | 'farcaster-channel-detail' | 'farcaster-user-detail' | 'leverage-explainer' | 'virtual-list-demo' | 'list-view-transitions-demo' | 'assets-hub' | 'explore-hub' | 'social-hub' | 'networks-architecture-hub' | 'network-slug-lightning-collection' | 'network-slug-lightning-channel-detail' | 'network-slug-cosmos-governance' | 'network-slug-blocks' | 'network-slug-block-detail' | 'network-slug-transactions' | 'network-slug-transaction-detail' | 'eip155-network-upgrade-detail' | 'network-slug-address-detail' | 'network-slug-node-detail' | 'custom'
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
			networkArchitectureSections?: {
				id: string
				label: string
				snippet: string
				slug: string
			}[]
			socialProtocolGroups?: {
				label: string
				hubRoute: string
				lists: {
					label: string
					route: string
				}[]
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
			stateComment?: string
			blankLineBeforeComponents?: boolean
			blankLineBeforePageClose?: boolean
			viewImportBeforePage?: boolean
			sources?: string[]
			sourceText?: string
		}[]
		sectionShells: {
			routePath: string
			visiblePath: string
			routeGroupPath: string
			components: string[]
			usesDataSelector: boolean
			usesParams: boolean
			usesSelect: boolean
			kind: 'app-shell' | 'parent-collapsible' | 'nested-parent-collapsible' | 'page-param-parent-collapsible' | 'param-summary-collapsible' | 'keyed-param-summary-collapsible' | 'scope-summary-collapsible' | 'page-param-summary-collapsible' | 'proposal-parent-collapsible' | 'atproto-actor-parent-collapsible' | 'lens-account-parent-collapsible' | 'eip155-network-upgrade-parent-collapsible' | 'passthrough' | 'custom'
			viewComponent?: string
			viewFile?: string
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
			proposalLevel?: 'realm' | 'kind' | 'proposal'
			sourceText?: string
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
		pages: unknown[]
	}
	probes: {
		routes: unknown[]
		boundaries: unknown[]
		cors: unknown[]
	}
}

const schemaFieldSuffixByCardinality: Record<string, string> = {
	One: '!',
	ZeroOrOne: '?',
	Many: '*',
	ZeroOrMany: '*?',
	Zero: '0',
}

const json = (value: unknown) => JSON.stringify(value, null, '\t')

const quote = (value: string) => (
	`'${value.replace(/\\/g, '\\\\').replace(/'/g, '\\\'')}'`
)

const tsLiteral = (
	value: unknown,
	indent = '\t'
): string => {
	if (value === null)
		return 'null'

	if (typeof value === 'string')
		return quote(value)

	if (typeof value === 'number' || typeof value === 'boolean')
		return String(value)

	if (Array.isArray(value)) {
		if (value.length === 0)
			return '[]'

		return [
			'[',
			...value.map((item) => `${indent}${tsLiteral(item, `${indent}\t`)},`),
			`${indent.slice(1)}]`,
		].join('\n')
	}

	if (typeof value === 'object') {
		const entries = Object.entries(value)
		if (entries.length === 0)
			return '{}'

		return [
			'{',
			...entries.map(([key, item]) => `${indent}${/^[A-Za-z_$][\w$]*$/.test(key) ? key : quote(key)}: ${tsLiteral(item, `${indent}\t`)},`),
			`${indent.slice(1)}}`,
		].join('\n')
	}

	return 'undefined'
}

const splitTopLevel = (text: string, delimiter: string) => {
	const parts: string[] = []
	let depth = 0
	let quote: string | undefined
	let start = 0

	for (let index = 0; index < text.length; index += 1) {
		const character = text[index]
		const previous = text[index - 1]

		if (quote) {
			if (character === quote && previous !== '\\')
				quote = undefined

			continue
		}

		if (character === '\'' || character === '"' || character === '`') {
			quote = character
			continue
		}

		if (character === '(' || character === '[' || character === '{' || character === '<')
			depth += 1
		else if (character === ')' || character === ']' || character === '}' || character === '>')
			depth -= 1
		else if (character === delimiter && depth === 0) {
			parts.push(text.slice(start, index).trim())
			start = index + 1
		}
	}

	parts.push(text.slice(start).trim())

	return parts.filter(Boolean)
}

const primitiveTypeKeyword = (primitive: string): string => {
	if ([
		'bytes',
		'caip2',
		'enum',
		'evmAddress',
		'hex',
		'hex4',
		'hex32',
		'str',
		'url',
		'zeroExHex',
		'zeroExHex4',
		'zeroExHex32',
	].includes(primitive))
		return 'string'

	if (primitive === 'num' || primitive === 'int')
		return 'number'

	if (primitive === 'bigint')
		return 'bigint'

	if (primitive === 'bool')
		return 'boolean'

	if (primitive === 'null')
		return 'null'

	return 'unknown'
}

const primitiveTypeSyntax = (primitive: string): string => (
	splitTopLevel(primitive, '|').length > 1 ?
		splitTopLevel(primitive, '|')
			.map((part) => primitiveTypeSyntax(part))
			.join(' | ')
	: primitive.endsWith('[]') ?
		`${primitiveTypeSyntax(primitive.slice(0, -2))}[]`
	: primitive.startsWith('\'') && primitive.endsWith('\'') ?
		primitive
	: primitive.startsWith('{') && primitive.endsWith('}') ?
		'object'
	:
		primitiveTypeKeyword(primitive)
)

const primitiveObjectExpression = (primitive: string) => `{${
	splitTopLevel(primitive.slice(1, -1), ',')
		.map((part) => {
			const separatorIndex = part.indexOf(':')

			return `${JSON.stringify(part.slice(0, separatorIndex).trim())}: ${JSON.stringify(primitiveTypeSyntax(part.slice(separatorIndex + 1).trim()))}`
		})
		.join(', ')
}}`

const primitiveTypeExpression = (typeText: string) => {
	const primitive = typeText.replace(/^p:/, '').replace(/ when .+$/, '')

	if (primitive === 'marketAsset')
		return 'marketAsset'

	if (primitive === 'evmAddress')
		return 'EvmAddress'

	if (primitive === 'zeroExHex' || primitive === 'zeroExHex4' || primitive === 'zeroExHex32')
		return 'ZeroExHex'

	if (primitive.endsWith('[]')) {
		const itemPrimitive = primitive.slice(0, -2)

		if (itemPrimitive.startsWith('{') && itemPrimitive.endsWith('}'))
			return `type(${primitiveObjectExpression(itemPrimitive)}).array()`

		if (itemPrimitive === 'evmAddress')
			return 'EvmAddress.array()'

		if (itemPrimitive === 'zeroExHex' || itemPrimitive === 'zeroExHex4' || itemPrimitive === 'zeroExHex32')
			return 'ZeroExHex.array()'

		return `type(${JSON.stringify(`${primitiveTypeSyntax(itemPrimitive)}[]`)})`
	}

	if (primitive.startsWith('{') && primitive.endsWith('}'))
		return `type(${primitiveObjectExpression(primitive)})`

	return `type(${JSON.stringify(primitiveTypeSyntax(primitive))})`
}

const fieldPrimitiveTypeExpression = (field: ExpectedApp['schema']['entities'][number]['fields'][number]) => {
	if (field.name === 'coinId' && field.type === 'p:enum')
		return 'type.valueOf(CoinId)'

	if (field.name === 'marketKind' && field.type === 'p:enum')
		return 'type.valueOf(MarketKind)'

	if (field.name === '$marketVenue' && field.type === 'p:{marketVenueId:enum}')
		return 'type({ marketVenueId: type.valueOf(MarketVenueId) })'

	return primitiveTypeExpression(field.type)
}

const fieldType = (field: ExpectedApp['schema']['entities'][number]['fields'][number]) => (
	field.type.startsWith('p:') ?
		'Primitive'
	: field.name.startsWith('$$') ?
		'EntitiesReference'
	: field.name.startsWith('$') ?
		'EntityReference'
	:
		'Primitive'
)

const fieldEntityType = (typeText: string) => (
	typeText.startsWith('$:') ?
		typeText.slice(2).replace(/ when .+$/, '')
	:
		undefined
)

const fieldLabel = (fieldName: string) => (
	fieldName === 'lastTx' ?
		'last transaction'
	: fieldName === 'txId' ?
		'transaction ID'
	: fieldName === 'did' ?
		'DID'
	: fieldName === 'pubkey' ?
		'public key'
	:
	(fieldName
		.replace(/^\$\$?/, '')
		.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
		.toLowerCase()
		.replace(/\babi\b/g, 'ABI')
		.replace(/\bactivitypub\b/g, 'ActivityPub')
		.replace(/\bat\b/g, 'AT')
		.replace(/\bcaip\b/g, 'CAIP')
		.replace(/\bcid\b/g, 'CID')
		.replace(/\bcosmos\b/g, 'Cosmos')
		.replace(/\bcors\b/g, 'CORS')
		.replace(/\bdht\b/g, 'DHT')
		.replace(/\beip\b/g, 'EIP')
		.replace(/\bens\b/g, 'ENS')
		.replace(/\bevm\b/g, 'EVM')
		.replace(/\bxmtp\b/g, 'XMTP')
		.replace(/\bai\b/g, 'AI')
		.replace(/\bapi\b/g, 'API')
		.replace(/\bbitcoin\b/g, 'Bitcoin')
		.replace(/\bjson\b/g, 'JSON')
		.replace(/\bdid\b/g, 'DID')
		.replace(/\brpc\b/g, 'RPC')
		.replace(/\bnft\b/g, 'NFT')
		.replace(/\bohlc\b/g, 'OHLC')
		.replace(/\bid\b/g, 'ID')
		.replace(/\buri\b/g, 'URI')
		.replace(/\bfid\b/g, 'FID')
		.replace(/\buid\b/g, 'UID')
		.replace(/\bgraphql\b/g, 'GraphQL')
		.replace(/\bhtml\b/g, 'HTML')
		.replace(/\bhttp\b/g, 'HTTP')
		.replace(/\bip\b/g, 'IP')
		.replace(/\bipfs\b/g, 'IPFS')
		.replace(/\bipns\b/g, 'IPNS')
		.replace(/\bfarcaster\b/g, 'Farcaster')
		.replace(/\bfedimint\b/g, 'Fedimint')
		.replace(/\bgit\b/g, 'Git')
		.replace(/\blightning\b/g, 'Lightning')
		.replace(/\bmsat\b/g, 'msat')
		.replace(/\bmweb\b/g, 'MWEB')
		.replace(/\bpubkey\b/g, 'public key')
		.replace(/\bsdk\b/g, 'SDK')
		.replace(/\btx\b/g, 'transaction')
		.replace(/\butxo\b/g, 'UTXO')
		.replace(/\brest\b/g, 'REST')
		.replace(/\bfproof\b/g, 'f proof')
		.replace(/\bwasm\b/g, 'Wasm')
		.replace(/\bweb\b/g, 'Web')
		.replace(/\bzero g/g, 'zero g ')
		.replace(/ url$/, ' URL')
		.replace(/\s+/g, ' ')
		.trim()
	)
)

const selectorMemberName = (selectorName: string) => (
	selectorName
		.split(/[^A-Za-z0-9]+/)
		.filter(Boolean)
		.map((part) => `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}`)
		.join('') || 'Default'
)

const selectorMemberNameFromFields = (fields: readonly string[]) => (
	fields
		.map((field) => field.replace(/^\$+/, ''))
		.map((field) => `${field[0]?.toUpperCase() ?? ''}${field.slice(1)}`)
		.join('')
		.replace(/[^A-Za-z0-9]/g, '')
)

const selectorMember = (selector: ExpectedApp['schema']['entities'][number]['selectors'][number]) => (
	selector.member ?? (selectorMemberNameFromFields(selector.fields) || selectorMemberName(selector.name))
)

const legacySelectorMember = (selector: ExpectedApp['schema']['entities'][number]['selectors'][number]) => {
	const lastField = selector.fields.at(-1)

	if (!selector.name.startsWith('instanceOrigin+') || selector.fields.length < 2 || lastField === undefined)
		return undefined

	return {
		member: selectorMemberName(lastField),
		value: lastField,
	}
}

const selectorEnumMembers = (entity: ExpectedApp['schema']['entities'][number]) => (
	[
		...entity.selectors.flatMap((selector) => [
			...(selector.member !== undefined ? [] : legacySelectorMember(selector) === undefined ? [] : [legacySelectorMember(selector)]),
			{
				member: selectorMember(selector),
				value: selector.value ?? selector.name,
			},
			...(selector.value !== undefined && selector.value !== selector.name ? [
				{
					member: selectorMemberNameFromFields(selector.fields) || selectorMemberName(selector.name),
					value: selector.name,
				},
			] : []),
		]),
	]
		.filter((member): member is {
			member: string
			value: string
		} => member !== undefined)
		.filter((member, index, members) => (
			members.findIndex((candidate) => candidate.member === member.member) === index
		))
)

const selectorReferenceMember = (selector: ExpectedApp['schema']['entities'][number]['selectors'][number]) => (
	selectorMember(selector)
)

const generatedEntitySchemaFile = (entity: ExpectedApp['schema']['entities'][number]) => [
	'import { type } from \'arktype\'',
	'import {',
	'\tEntityFieldCardinality,',
	'\tEntityFieldType,',
	'\ttype EntityDefinition,',
	'} from \'$/schema/$schema.ts\'',
	'import { EntityType } from \'$/schema/EntityType.ts\'',
	...(entity.fields.some((field) => field.name === 'coinId' && field.type === 'p:enum') ? [
		'import { CoinId } from \'$/constants/Coin.ts\'',
	] : []),
	...(entity.fields.some((field) => field.name === 'marketKind' && field.type === 'p:enum') ? [
		'import { MarketKind } from \'$/constants/Market.ts\'',
	] : []),
	...(entity.fields.some((field) => field.name === '$marketVenue' && field.type === 'p:{marketVenueId:enum}') ? [
		'import { MarketVenueId } from \'$/constants/MarketVenue.ts\'',
	] : []),
	...(entity.fields.some((field) => field.type === 'p:marketAsset') ? [
		'import { marketAsset } from \'$/schema/MarketAsset.ts\'',
	] : []),
	...(entity.fields.some((field) => field.type.includes('p:evmAddress')) ? [
		'import { EvmAddress } from \'$/schema/ZeroExHex.ts\'',
	] : []),
	...(entity.fields.some((field) => field.type.includes('p:zeroExHex')) ? [
		'import { ZeroExHex } from \'$/schema/ZeroExHex.ts\'',
	] : []),
	...(entity.enums ?? []).flatMap((enumeration, index, enumerations) => [
		[
			`export enum ${enumeration.name} {`,
			...enumeration.members.map((member) => `\t${member.name} = '${member.value}',`),
			'}',
		].join('\n'),
		...(index === enumerations.length - 1 ? [] : [
			'',
		]),
	]),
	`export enum ${entity.name}Selector {`,
	...selectorEnumMembers(entity).map((selector) => `\t${selector.member} = '${selector.value}',`),
	'}',
	'export default {',
	`\tentityType: EntityType.${entity.name},`,
	`\tlabel: '${entity.label ?? entity.name}',`,
	`\tlabelPlural: '${entity.labelPlural ?? `${entity.name}s`}',`,
	...(entity.description === undefined ? [] : [
		`\tdescription: '${entity.description.replace(/\\/g, '\\\\').replace(/'/g, '\\\'')}',`,
	]),
	'\tselectors: [',
	...entity.selectors.flatMap((selector) => [
		'\t\t{',
			`\t\t\tname: ${entity.name}Selector.${selectorReferenceMember(selector)},`,
		'\t\t\tfields: [',
		...selector.fields.map((field) => `\t\t\t\t'${field}',`),
		'\t\t\t],',
		'\t\t},',
	]),
	'\t],',
	'\tfields: [',
	...entity.fields.flatMap((field) => [
		'\t\t{',
		`\t\t\tname: '${field.name}',`,
		`\t\t\tlabel: '${(field.label ?? fieldLabel(field.name)).replace(/\\/g, '\\\\').replace(/'/g, '\\\'')}',`,
		...(field.description === undefined ? [] : [
			`\t\t\tdescription: '${field.description.replace(/\\/g, '\\\\').replace(/'/g, '\\\'')}',`,
		]),
		...(field.labelPlural === undefined ? [] : [
			`\t\t\tlabelPlural: '${field.labelPlural.replace(/\\/g, '\\\\').replace(/'/g, '\\\'')}',`,
		]),
		`\t\t\ttype: EntityFieldType.${fieldType(field)},`,
		...(fieldType(field) === 'Primitive' ? [
			`\t\t\tprimitiveType: ${fieldPrimitiveTypeExpression(field)},`,
		] : [
			`\t\t\tentityType: EntityType.${fieldEntityType(field.type) ?? 'Unknown'},`,
		]),
		`\t\t\tcardinality: EntityFieldCardinality.${field.cardinality},`,
		'\t\t},',
	]),
	'\t],',
	'} as const satisfies EntityDefinition',
].join('\n')

const generatedEntityTypeFile = (app: ExpectedApp) => [
	'export enum EntityType {',
	...app.schema.entities.map((entity) => `\t${entity.name} = '${entity.name}',`),
	'}',
].join('\n')

const chunksOf = <_Value>(values: readonly _Value[], size: number) => (
	Array.from({
		length: Math.ceil(values.length / size),
	}, (_, index) => values.slice(index * size, index * size + size))
)

const generatedSchemaIndexFile = (app: ExpectedApp) => [
	'import {',
	'\tindexSchema,',
	'\ttype EntityDefinition,',
	'\ttype EntityFieldDefinitions,',
	'\ttype Schema,',
	'} from \'$/schema/$schema.ts\'',
	'',
	...app.schema.entities.map((entity) => `import ${entity.name}Schema from '$/schema/${entity.name}.ts'`),
	'',
	...chunksOf(app.schema.entities, 50).flatMap((entities, index) => [
		`const schemaChunk${index} = [`,
		...entities.map((entity) => `\t${entity.name}Schema,`),
		'] as const satisfies Schema',
		'',
	]),
	'type SchemaRegistry = readonly (',
	...chunksOf(app.schema.entities, 50).map((_, index) => `\t| (typeof schemaChunk${index})[number]`),
	')[]',
	'',
	'const schemaEntries: EntityDefinition[] = []',
	...chunksOf(app.schema.entities, 50).map((_, index) => `schemaEntries.push(...schemaChunk${index})`),
	'',
	'// oxlint-disable-next-line typescript/no-restricted-types -- generated schema registry cast bridges chunked entity definition tuple construction',
	'export const schema = schemaEntries as unknown as SchemaRegistry',
	'',
	'export const schemaMeta = indexSchema(schema)',
	'export const entityDefinitionByType = schemaMeta.entityDefinitionByType',
	'export const entityFieldDefinitionByEntityTypeAndName = schemaMeta.entityFieldDefinitionByEntityTypeAndName',
	'export const entitySelectorDefinitionByEntityTypeAndName = schemaMeta.entitySelectorDefinitionByEntityTypeAndName',
	'',
	'export type SchemaEntityDefinition = typeof schema[number]',
	'',
	'export type SchemaEntityFieldDefinitions<_EntityDefinition extends SchemaEntityDefinition> = EntityFieldDefinitions<_EntityDefinition>',
].join('\n')

const generatedViewsIndexFile = (app: ExpectedApp) => [
	'// Types/constants',
	'import type { Component } from \'svelte\'',
	'import { EntityType } from \'$/schema/EntityType.ts\'',
	'',
	...app.views.entityViews
		.map((view) => `import ${view.entity}View from '$/views/${view.file.split('/').at(-1)}'`),
	'',
	'',
	'// Constants',
	'export type EntityViewComponent = Component',
	'',
	'export const entityViewByEntityType = {',
	...app.views.entityViews
		.map((view) => `\t[EntityType.${view.entity}]: ${view.entity}View,`),
	'} as const satisfies Partial<Record<EntityType, EntityViewComponent>>',
].join('\n')

const appEntityNotes = () => new Map(
	[...readText('APP.ts').matchAll(/(?<comments>(?:\t\t\t\/\/ .+\n)+)\t\t\t\{\n\t\t\t\tname: '(?<name>[^']+)',/g)]
		.map((match) => [
			match.groups?.name ?? '',
			(match.groups?.comments ?? '')
				.split('\n')
				.filter(Boolean)
				.map((line) => line.replace(/^\t\t\t\/\/ ?/, ''))
				.join(' '),
		])
)

const schemaMarkdown = (app: ExpectedApp) => {
	const notesByEntity = appEntityNotes()

	return [
	'# Blockhead Schema',
	'',
	'Schema Language v1. `APP.ts` is the schema design source of truth. Run `pnpm run app:sync` after editing it, and run `pnpm run app:check` in review to verify generated schema output.',
	'',
	'Each entity block starts with `Entity Name`, then `Selectors :: selectorName: field+field` and `Fields :: field! p:type, field? p:type, field* $:Entity`. Field suffixes mean required (`!`), optional (`?`), many (`*`), or impossible (`0`). `$field` references one entity and `$$field` references many entities. `Field name :: ...` lines hold user-facing language only; modeling notes stay in `Notes ::`.',
	'',
	'```text',
	'SchemaVersion 1',
	'',
	...app.schema.entities.flatMap((entity) => [
		`  Entity ${entity.name}`,
		`    Selectors :: ${entity.selectors.map((selector) => `${selector.name}: ${selector.fields.join('+')}`).join(', ')}`,
		`    Fields :: ${entity.fields.map((field) => `${field.name}${schemaFieldSuffixByCardinality[field.cardinality] ?? ''} ${field.type}`).join(', ')}`,
		...(entity.label === undefined ? [] : [
			`    Label :: ${entity.label}`,
		]),
		...(entity.labelPlural === undefined ? [] : [
			`    LabelPlural :: ${entity.labelPlural}`,
		]),
		...(entity.description === undefined ? [] : [
			`    Description :: ${entity.description}`,
		]),
		...entity.fields.flatMap((field) => {
			const metadata = [
				...(field.label === undefined ? [] : [
					`Label :: ${field.label}`,
				]),
				...(field.labelPlural === undefined ? [] : [
					`LabelPlural :: ${field.labelPlural}`,
				]),
				...(field.description === undefined ? [] : [
					`Description :: ${field.description}`,
				]),
			]

			return metadata.length === 0 ? [] : [
				`    Field ${field.name} :: ${metadata.join(' ; ')}`,
			]
		}),
		...(entity.sourceBindings.length === 0 ? [] : [
			'    Sources ::',
			...entity.sourceBindings.map((sourceBinding) => `      - SourceBinding.${sourceBinding}`),
		]),
		...(entity.view === undefined ? [] : [
			`    View :: ${entity.view}`,
		]),
		...(notesByEntity.get(entity.name) === undefined ? [] : [
			`    Notes :: ${notesByEntity.get(entity.name)}`,
		]),
		'',
	]),
	'```',
].join('\n')
}

const resolverCoverageMarkdown = (app: ExpectedApp) => [
	'# Resolver Coverage',
	'',
	'This ledger records the current resolver state for every `Source` row during the sources-v2 resolver migration. Keep it in sync when adding, migrating, deferring, or removing resolver facets.',
	'',
	'State meanings:',
	'',
	'- `implemented`: `src/resolvers/index.ts` imports a resolver file whose source row validates against the current schema.',
	'- `no resolver`: the source is a capability, catalog, wallet, local artifact, or runtime transport row with no schema resolver facet expected yet.',
	'- `deferred-schema`: the source may eventually back resolver facets, but current schema/product rows or field contracts are absent or intentionally inactive.',
	'- `deferred-runtime`: the source binding exists, but checked-in runtime endpoint materialization, source query code, client code, or hand-written wire types are absent.',
	'- `deferred-artifact`: the source needs generated OpenAPI, GraphQL, proto, Candid, ABI, or other checked-in artifacts before resolver facets would be accurate.',
	'',
	`Current generated counts: ${[
		'implemented',
		'no resolver',
		'deferred-schema',
		'deferred-runtime',
		'deferred-artifact',
	].map((status) => `${status} ${app.resolvers.ledger.filter((row) => row.status === status).length}`).join('; ')}.`,
	'',
	'| Source | State | Provider binding | Resolver file | Source runtime/artifacts | Schema entities touched | Action / validation risk |',
	'|---|---|---|---|---|---|---|',
	...app.resolvers.ledger.map((row) => `| \`${row.source}\` | ${row.status} | ${row.providerBinding} | ${row.resolverFile} | ${row.sourceRuntimeArtifacts} | ${row.schemaEntitiesTouched} | ${row.actionValidationRisk} |`),
].join('\n')

const sourcesMarkdown = (app: ExpectedApp) => [
	'# Blockhead Sources',
	'',
	'This file is generated from `APP.ts` source provider, source, binding, runtime binding, and artifact rows.',
	'',
	'## Source Bindings',
	'',
	'```ts',
	'export enum SourceBinding {',
	...[...new Set(app.sources.bindings.map((binding) => binding.id))].map((binding) => `\t${binding} = ${quote(binding)},`),
	'}',
	'```',
	'',
	'| Binding | Source | Target |',
	'|---|---|---|',
	...app.sources.bindings.map((binding) => `| \`${binding.id}\` | \`${binding.source}\` | ${binding.target} |`),
	'',
	'## Providers',
	'',
	'| Provider | Label |',
	'|---|---|',
	...app.sources.providers.map((provider) => `| \`${provider.id}\` | ${provider.label} |`),
	'',
	'## Sources',
	'',
	'| Source | Provider | Label |',
	'|---|---|---|',
	...app.sources.sources.map((source) => `| \`${source.id}\` | \`${source.provider}\` | ${source.label} |`),
	'',
	'## Runtime Bindings',
	'',
	'| Source | Provider | Target | Wire | API | Delivery | Operations | Artifacts | Endpoints |',
	'|---|---|---|---|---|---|---|---|---|',
	...app.sources.runtimeBindings.map((binding) => `| \`${binding.source}\` | \`${binding.provider}\` | ${binding.targetKind}:${binding.targetKey} | ${binding.wireProtocol} | ${binding.apiFamily} | ${binding.delivery} | ${binding.operationGroups.join(', ')} | ${binding.artifactCount} | ${binding.endpointCount} |`),
	'',
	'## Runtime Artifacts',
	'',
	'| Source | Kind | Path | Generated |',
	'|---|---|---|---|',
	...app.sources.runtimeArtifacts.map((artifact) => `| \`${artifact.source}\` | ${artifact.kind} | \`${artifact.path}\` | ${artifact.generated ? 'yes' : 'no'} |`),
].join('\n')

const entityFieldLabel = (
	field: ExpectedApp['schema']['entities'][number]['fields'][number]
) => (
	field.label
	?? field.name
		.replace(/^\$\$?/, '')
		.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
		.replace(/[_-]+/g, ' ')
		.toLowerCase()
)

const generatedViewFieldArray = (
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

const generatedEntityViewDeclaration = (
	entity: ExpectedApp['schema']['entities'][number]
) => {
	if (entity.view === undefined)
		return undefined

	const {
		list: _list,
		...view
	} = JSON.parse(entity.view) as Record<string, unknown>

	return view
}

const generatedNetworkViewShellSource = () => `<script lang="ts">
	// Types/constants
	import {
		NetworkNamespace,
		networkByCaip2,
		networkEnvironmentByEnvironment,
	} from '$/constants/Network.ts'

	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'

	type NetworkResource = EntityProxyResource<typeof schema, EntityType.Network>


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
	}: {
		selection: NetworkResource
		href?: string
		layout?: EntityLayout
		open?: boolean
	} = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BittensorNetworkView from '$/views/BittensorNetworkView.svelte'
	import CosmosNetworkView from '$/views/CosmosNetworkView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
	import FilecoinNetworkView from '$/views/FilecoinNetworkView.svelte'
	import HyperliquidNetworkView from '$/views/HyperliquidNetworkView.svelte'
	import LightningNetworkView from '$/views/LightningNetworkView.svelte'
	import LogosNetworkView from '$/views/LogosNetworkView.svelte'
	import MoneroNetworkView from '$/views/MoneroNetworkView.svelte'
	import NearNetworkView from '$/views/NearNetworkView.svelte'
	import PolkadotNetworkView from '$/views/PolkadotNetworkView.svelte'
	import QuilibriumNetworkView from '$/views/QuilibriumNetworkView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import SolanaNetworkView from '$/views/SolanaNetworkView.svelte'
	import TronNetworkView from '$/views/TronNetworkView.svelte'
	import UtxoNetworkView from '$/views/UtxoNetworkView.svelte'
	import ZeroGNetworkView from '$/views/ZeroGNetworkView.svelte'
</script>


<ResourceBoundary
	resource={selection}
>
	{#snippet children(row)}
		{@const networkCaip2 = row.caip2 ?? (
			'caip2' in selection.entitySelector ?
				selection.entitySelector.caip2
			:
				undefined
		)}
		{@const networkSlug = row.slug ?? (
			'slug' in selection.entitySelector ?
				selection.entitySelector.slug
			:
				undefined
		)}
		{@const networkHref = href ?? (
			networkCaip2 == null ?
				networkSlug == null ?
					undefined
				:
					resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
						networkSlug,
					})
				:
					resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
						caip2: \`\${networkCaip2.namespace}:\${networkCaip2.reference}\`,
					})
		)}
		{@const networkSelector = selection.entitySelector}
		{@const networkNamespace = row.namespace ?? (
			networkCaip2 == null ?
				undefined
			:
				networkByCaip2[\`\${networkCaip2.namespace}:\${networkCaip2.reference}\`]?.namespace
		)}
		{#if networkNamespace === NetworkNamespace.Evm && networkCaip2 != null}
			<EvmNetworkView
				selection={select(EntityType.EvmNetwork, {
					caip2: {
						namespace: 'eip155',
						reference: networkCaip2.reference,
					},
				})}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Bitcoin || networkNamespace === NetworkNamespace.BitcoinCash || networkNamespace === NetworkNamespace.Litecoin || networkNamespace === NetworkNamespace.Dogecoin || networkNamespace === NetworkNamespace.Zcash}
			<UtxoNetworkView
				selection={select(EntityType.UtxoNetwork, { $network: networkSelector })}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Solana && networkCaip2 != null}
			<SolanaNetworkView
				selection={select(EntityType.SolanaNetwork, {
					caip2: {
						namespace: 'solana',
						reference: networkCaip2.reference,
					},
				})}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Cosmos}
			<CosmosNetworkView
				selection={select(EntityType.CosmosNetwork, { $network: networkSelector })}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Filecoin}
			<FilecoinNetworkView
				selection={select(EntityType.FilecoinNetwork, { $network: networkSelector })}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Polkadot}
			<PolkadotNetworkView
				selection={select(EntityType.PolkadotNetwork, { $network: networkSelector })}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Monero}
			<MoneroNetworkView
				selection={select(EntityType.MoneroNetwork, { $network: networkSelector })}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Near}
			<NearNetworkView
				selection={select(EntityType.NearNetwork, { slug: 'near' })}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Tron}
			<TronNetworkView
				selection={select(EntityType.TronNetwork, { $network: networkSelector })}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Hyperliquid}
			<HyperliquidNetworkView
				selection={select(EntityType.HyperliquidNetwork, { $network: networkSelector })}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Bittensor}
			<BittensorNetworkView
				selection={select(EntityType.BittensorNetwork, { $network: networkSelector })}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Lightning}
			<LightningNetworkView
				selection={select(EntityType.LightningNetwork, {
					$network: networkSelector,
				})}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.ZeroG}
			<ZeroGNetworkView
				selection={select(EntityType.Network, networkSelector)}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Logos}
			<LogosNetworkView
				selection={select(EntityType.Network, networkSelector)}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else if networkNamespace === NetworkNamespace.Quilibrium}
			<QuilibriumNetworkView
				selection={select(EntityType.Network, networkSelector)}
				href={networkHref}
				bind:open
				{layout}
			/>
		{:else}
			<EntityView2
				{selection}
				entityType={EntityType.Network}
				entitySelector={networkSelector}
				href={networkHref}
				bind:open
				{layout}
				view={{
					closed: [
						'caip2',
						'environment',
					],
					content: {
						dl: [
							[
								'caip2',
								'environment',
								{
									label: 'stack classification',
								},
								'executionEnvironments',
								'consensusMechanisms',
							],
							[
								{
									label: 'native asset count',
								},
								{
									label: 'explorer/faucet URL counts',
								},
							],
						],
					},
					details: {
						tabs: [
							{
								label: 'Namespace-specific state',
								items: [
									{
										label: 'EVM',
									},
									{
										label: 'UTXO',
									},
									{
										label: 'Solana',
									},
									{
										label: 'Cosmos',
									},
									{
										label: 'Celestia',
									},
									{
										label: 'Avail',
									},
									{
										label: 'Filecoin',
									},
									{
										label: 'Polkadot',
									},
									{
										label: 'Monero',
									},
									{
										label: 'NEAR',
									},
									{
										label: 'TRON',
									},
									{
										label: 'Hyperliquid',
									},
									{
										label: 'Bittensor',
									},
									{
										label: 'Lightning',
									},
									{
										label: 'Arweave',
									},
									{
										label: '0G',
									},
									{
										label: 'Quilibrium',
									},
								],
							},
							{
								label: 'Catalog refs',
								items: [
									'$$nativeAssets',
									'$$blockExplorerUrls',
									'$$faucetUrls',
									{
										label: 'secondary identifiers',
									},
								],
							},
							{
								label: 'Observations',
								items: [
									{
										label: 'Network_Timestamp fallback rows',
									},
									{
										label: 'endpoint observations',
									},
								],
							},
						],
					},
				}}
			>
				{#snippet Title()}
					{row.name}
				{/snippet}

				{#snippet Content()}
					<dl>
						{#if row.caip2 != null}
							<div>
								<dt>CAIP-2</dt>
								<dd>
									{row.caip2.namespace}:{row.caip2.reference}
								</dd>
							</div>
						{/if}

						{#if row.environment !== undefined}
							<div>
								<dt>Environment</dt>
								<dd>{networkEnvironmentByEnvironment[row.environment].label}</dd>
							</div>
						{/if}
					</dl>
				{/snippet}
			</EntityView2>
		{/if}
	{/snippet}
</ResourceBoundary>
`

const generatedEntityViewShellSource = (
	entity: ExpectedApp['schema']['entities'][number],
	shell: ExpectedApp['views']['entityViewShells'][number]
) => {
	if (entity.name === 'Network')
		return generatedNetworkViewShellSource()

	if (
		shell.capabilities.includes('entities-list')
		&& shell.capabilities.includes('entity-select')
	)
		return `<script lang="ts">
\t// Types/constants
\timport type { ComponentProps } from 'svelte'
\timport type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
\timport { ListOrientation } from '$/components/ListOrientation.ts'
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { schema } from '$/schema/index.ts'
\timport type { WithRest } from '$/typescript/WithRest.ts'
\timport { stringify } from 'devalue'


\t// Context
\timport { select } from '$/routes/+layout.svelte'


\t// State
\tconst listView = {
\t\tentityType: EntityType.${entity.name},
\t\titem: 'summary',
\t\torientation: 'column',
\t} as const

\tlet {
\t\tselection,
\t\ttitle,
\t\topen = $bindable(true),
\t\tid = '${entity.name}',
\t\thref = '',
\t\t...EntitiesListProps
\t}: WithRest<
\t\t{
\t\t\tselection: EntityProxyEntitiesResource<typeof schema, EntityType.${entity.name}>
\t\t\ttitle?: string
\t\t\topen?: boolean
\t\t\tid?: string
\t\t\thref?: string
\t\t},
\t\tPick<ComponentProps<typeof EntitiesList>, 'CollapsibleProps'>
\t> = $props()


\t// Components
\timport EntitiesList from '$/components/EntitiesList.svelte'
\timport { EntityLayout } from '$/components/EntityView.svelte'
\timport ${entity.name}View from '$/views/${entity.name}View.svelte'
</script>


<EntitiesList
\tentityType={listView.entityType}
\t{title}
\tbind:open
\t{id}
\thref={href}
\tresource={selection}
\tgetKey={(entity) => stringify(entity.entitySelector)}
\tUnorderedListProps={{ orientation: ListOrientation.Column }}
\t{...EntitiesListProps}
>
\t{#snippet Item({ item })}
\t\t<${entity.name}View
\t\t\tselection={select(EntityType.${entity.name}, item.entitySelector)}
\t\t\tlayout={EntityLayout.Summary}
\t\t/>
\t{/snippet}
</EntitiesList>
`

	const closedFields = (
		entity.selectors[0]?.fields.filter((fieldName) => entity.fields.some((field) => field.name === fieldName && !field.type.startsWith('$:')))
		?? []
	)
	const contentFields = entity.fields
		.filter((field) => field.cardinality !== 'Zero' && !field.type.startsWith('$:'))
		.map((field) => field.name)
	const detailFields = entity.fields
		.filter((field) => field.name.startsWith('$$') || (field.cardinality === 'Many' && field.type.startsWith('$:')))
	const viewDeclaration = generatedEntityViewDeclaration(entity)

	return `<script lang="ts">
\t// Types/constants
\timport type { ComponentProps } from 'svelte'
\timport type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
\timport type { WithRest } from '$/typescript/WithRest.ts'
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { schema } from '$/schema/index.ts'


\t// State
\tconst view = ${viewDeclaration === undefined ? `{
\t\tclosed: ${generatedViewFieldArray(closedFields)},
\t\tcontent: {
\t\t\tdl: [
\t\t\t\t${generatedViewFieldArray(contentFields, '\t\t\t\t')},
\t\t\t],
\t\t},
${detailFields.length === 0 ? '' : `\t\tdetails: {
\t\t\ttabs: [
${detailFields.map((field) => `\t\t\t\t{
\t\t\t\t\tlabel: ${quote(field.labelPlural ?? entityFieldLabel(field))},
\t\t\t\t\twhen: 'open',
\t\t\t\t\titems: [
\t\t\t\t\t\t${quote(field.name)},
\t\t\t\t\t],
\t\t\t\t},`).join('\n')}
\t\t\t],
\t\t},
`}\t}` : tsLiteral(viewDeclaration, '\t')} satisfies ComponentProps<typeof EntityView2>['view']

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

const generatedSelectorRouteLeavesFile = (app: ExpectedApp) => [
	'export const entitySelectorRouteLeaves = [',
	...app.routes.selectorMappings
		.filter((mapping) => mapping.path !== undefined)
		.flatMap((mapping) => [
			'\t{',
			`\t\tentity: ${JSON.stringify(mapping.entity)},`,
			`\t\tselector: ${JSON.stringify(mapping.selector)},`,
			'\t\tfields: [',
			...mapping.fields.map((field) => `\t\t\t${JSON.stringify(field)},`),
			'\t\t],',
			'\t\tparentFields: [',
			...mapping.parentFields.map((field) => `\t\t\t${JSON.stringify(field)},`),
			'\t\t],',
			'\t\tlocalFields: [',
			...mapping.localFields.map((field) => `\t\t\t${JSON.stringify(field)},`),
			'\t\t],',
			'\t\tparams: [',
			...(mapping.params ?? []).flatMap((param) => [
				'\t\t\t{',
				`\t\t\t\tfield: ${JSON.stringify(param.field)},`,
				`\t\t\t\tname: ${JSON.stringify(param.name)},`,
				...(param.matcher === undefined ? [] : [
					`\t\t\t\tmatcher: ${JSON.stringify(param.matcher)},`,
				]),
				'\t\t\t},',
			]),
			'\t\t],',
			`\t\tpath: ${JSON.stringify(mapping.path)},`,
			`\t\temitPage: ${(mapping.emitPage ?? (mapping.outcome === 'canonical' || mapping.outcome === 'nested' || mapping.outcome === 'observation')) ? 'true' : 'false'},`,
			'\t\tunresolved: [',
			...mapping.unresolved.map((issue) => `\t\t\t${JSON.stringify(issue)},`),
			'\t\t],',
			'\t},',
		]),
	'] as const',
	'',
].join('\n')

const generatedHubCollectionRoutesFile = (app: ExpectedApp) => [
	'export const entityHubCollectionRoutes = [',
	...app.routes.hubCollections.flatMap((route) => [
		'\t{',
		`\t\tentity: ${JSON.stringify(route.entity)},`,
		`\t\thub: ${JSON.stringify(route.hub)},`,
		`\t\tpath: ${JSON.stringify(route.path)},`,
		`\t\tview: ${JSON.stringify(route.view)},`,
		'\t\tunresolved: [',
		...route.unresolved.map((issue) => `\t\t\t${JSON.stringify(issue)},`),
		'\t\t],',
		'\t},',
	]),
	'] as const',
	'',
].join('\n')

const routeParamNames = (
	path: string
) => [
	...path.matchAll(/\[([^=\]]+)(?:=[^\]]+)?\]/g),
].map((match) => match[1] ?? '')

const hasMappedRouteParams = (
	mapping: ExpectedApp['routes']['selectorMappings'][number]
) => (
	mapping.path !== undefined
	&& routeParamNames(mapping.path).every((paramName) => (mapping.params ?? []).some((param) => param.name === paramName))
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

const emittedSelectorRouteMappings = (app: ExpectedApp) => (
	app.routes.selectorMappings.filter((mapping) => (
		mapping.path !== undefined
		&& !hasRejectedRouteShape(mapping.path)
		&& hasMappedRouteParams(mapping)
		&& (mapping.emitPage ?? (mapping.outcome === 'canonical' || mapping.outcome === 'nested' || mapping.outcome === 'observation'))
	))
)

const generatedRoutePageModule = (
	transform: ExpectedApp['routes']['loaderTransforms'][number]
) => {
	const importsBySource = Object.groupBy(
		transform.importedSymbols.map((importedSymbol) => {
			const [symbol = '', source = ''] = importedSymbol.split(':')

			return {
				symbol,
				source,
			}
		}),
		(importedSymbol) => importedSymbol.source
	)

	return `import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
${Object.entries(importsBySource)
	.filter(([source]) => source !== '')
	.map(([source, imports]) => `import { ${(imports ?? []).map((importedSymbol) => importedSymbol.symbol).join(', ')} } from '${source}'`)
	.join('\n')}${Object.keys(importsBySource).some((source) => source !== '') ? '\n' : ''}import EntitySchema from '$/schema/${transform.entity}.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		${transform.selectorExpression}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid ${transform.entity} selector')

	return { selector }
}
`
}

const generatedRoutePage = (
	app: ExpectedApp,
	mapping: ReturnType<typeof emittedSelectorRouteMappings>[number]
) => {
	const view = app.views.entityViews.find((entityView) => entityView.entity === mapping.entity && entityView.kind === 'singular')

	if (view === undefined)
		return `<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	// Components
	import EntityView from '$/components/EntityView.svelte'
	import Page from '$/components/Page.svelte'
</script>


<Page>
	<EntityView
		entityType={EntityType.${mapping.entity}}
		entitySelector={data.selector}
		layout={EntityLayout.SummaryDetails}
	/>
</Page>
`

	const componentName = view.file.match(/\/([^/]+)\.svelte$/)?.[1] ?? `${mapping.entity}View`

	return `<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import ${componentName.startsWith('_') ? componentName.slice(1) : componentName} from '$/${view.file.replace(/^src\//, '')}'
</script>


<Page>
	<${componentName.startsWith('_') ? componentName.slice(1) : componentName}
		selection={select(EntityType.${mapping.entity}, data.selector)}
	/>
</Page>
`
}

const generatedGlobalCollectionPageShell = (
	shell: ExpectedApp['routes']['pageShells'][number]
) => {
	if (
		shell.viewComponent === undefined
		|| shell.collectionEntityType === undefined
		|| shell.globalScope === undefined
		|| shell.globalField === undefined
	)
		throw new Error(`Missing global collection page data for ${shell.routePath}`)

	const viewFile = shell.viewFile ?? `${shell.viewComponent}.svelte`

	return `<script lang="ts">
\timport { select } from '$/routes/+layout.svelte'
\t// Types/constants
\timport { EntityType } from '$/schema/EntityType.ts'
${shell.sources === undefined ? '' : `\timport { Source } from '$/sources/Source.ts'
`}${shell.hrefExpression === undefined ? '' : `

\t// Context
\timport { resolve } from '$app/paths'
`}

\t// Components
${shell.viewImportBeforePage ? `\timport ${shell.viewComponent} from '$/views/${viewFile}'
\timport Page from '$/components/Page.svelte'` : `\timport Page from '$/components/Page.svelte'
\timport ${shell.viewComponent} from '$/views/${viewFile}'`}
</script>${shell.headTitle === undefined ? '' : `


<svelte:head>
\t<title>${shell.headTitle}</title>
</svelte:head>`}


<Page>
\t<${shell.viewComponent}
${shell.hrefExpression === undefined ? '' : `\t\thref={${shell.hrefExpression}}
`}${shell.collapsible === undefined ? '' : `\t\tcollapsible={${shell.collapsible ? 'true' : 'false'}}
`}\t\tselection={select(
\t\t\tEntityType.${shell.collectionEntityType},
\t\t\t{ scope: ${quote(shell.globalScope)} }
\t\t).${shell.globalField}}
${shell.sources === undefined ? '' : shell.sources.length === 1 ? `\t\tsources={[Source.${shell.sources[0]}]}
` : `\t\tsources={[
${shell.sources.map((source) => `\t\t\tSource.${source},`).join('\n')}
\t\t]}
`}${shell.id === undefined ? '' : `\t\tid=${JSON.stringify(shell.id)}
`}${shell.limit === undefined ? '' : `\t\tlimit={${shell.limit}}
`}${shell.title === undefined ? '' : `\t\ttitle=${JSON.stringify(shell.title)}
`}${shell.open === undefined ? '' : '\t\topen\n'}\t/>
</Page>
`
}

const generatedParamSelectorPageHeader = (
	shell: ExpectedApp['routes']['pageShells'][number]
) => [
	'<script lang="ts">',
	...(shell.typeConstantsAfterSchemaImports ? [
		"\timport { EntityType } from '$/schema/EntityType.ts'",
		...(shell.zeroExHexImportWithSchemaImports === true && shell.zeroExHexImportSymbols !== undefined ? [
			`\timport { ${shell.zeroExHexImportSymbols} } from '$/schema/ZeroExHex.ts'`,
		] : []),
		"\timport { select } from '$/routes/+layout.svelte'",
		...(shell.importEip155NetworkSelectorFromCaip2 ? [
			"\timport { eip155NetworkSelectorFromCaip2 } from '$/lib/caip2.ts'",
		] : []),
	] : [
		'\t// Types/constants',
		"\timport { EntityType } from '$/schema/EntityType.ts'",
		"\timport { select } from '$/routes/+layout.svelte'",
	]),
	...(shell.importEntitySelectorType ? [
		'\t// Types/constants',
		"\timport type { EntitySelector } from '$/schema/$schema.ts'",
	] : []),
	...((shell.zeroExHexImportSymbols !== undefined && shell.zeroExHexImportWithSchemaImports !== true) || shell.with0xHexImportSection === 'types' ? [
		'\t// Types/constants',
		...(shell.zeroExHexImportSymbols === undefined || shell.zeroExHexImportWithSchemaImports === true ? [] : [
			`\timport { ${shell.zeroExHexImportSymbols} } from '$/schema/ZeroExHex.ts'`,
		]),
		...(shell.with0xHexImportSection === 'types' ? [
			"\timport { with0xHex } from '$/lib/hexLowerOfByteSize.ts'",
		] : []),
	] : []),
	...(shell.with0xHexImportSection === 'functions' ? [
		'\t// Functions',
		"\timport { with0xHex } from '$/lib/hexLowerOfByteSize.ts'",
	] : []),
	...(
		shell.importEntitySelectorType
		|| (shell.zeroExHexImportSymbols !== undefined && shell.zeroExHexImportWithSchemaImports !== true)
		|| shell.importWith0xHex
		|| !shell.typeConstantsAfterSchemaImports ? [
			'',
			'',
		] : []
	),
	'\t// State',
].join('\n')

const generatedGlobalSourceCollectionPageShell = (
	shell: ExpectedApp['routes']['pageShells'][number],
	viewFile: string
) => {
	if (
		shell.viewComponent === undefined
		|| shell.globalSourceField === undefined
		|| shell.globalSourceSources === undefined
		|| shell.id === undefined
	)
		throw new Error(`Missing global source collection page data for ${shell.routePath}`)

	return `<script lang="ts">
${shell.viewImportBeforePage ? '' : "\timport { select } from '$/routes/+layout.svelte'\n"}\t// Types/constants
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { Source } from '$/sources/Source.ts'


${shell.globalSourceOmitContextSection ? '\t// Components' : `\t// Context
${shell.viewImportBeforePage ? "\timport { select } from '$/routes/+layout.svelte'\n" : ''}${shell.networkCollectionTightContextState ? '' : '\n'}\t// Components`}
${shell.viewImportBeforePage ? `\timport ${shell.viewComponent} from '$/views/${viewFile}'
\timport Page from '$/components/Page.svelte'` : `\timport Page from '$/components/Page.svelte'
\timport ${shell.viewComponent} from '$/views/${viewFile}'`}
</script>


<Page>
\t<${shell.viewComponent}
${shell.globalSourceIndentExtra ? '\t' : ''}\t\tselection={select(
${shell.globalSourceIndentExtra ? '\t' : ''}\t\t\tEntityType._Global,
${shell.globalSourceIndentExtra ? '\t' : ''}\t\t\t{ scope: '${shell.globalSourceField}' }
${shell.globalSourceIndentExtra ? '\t' : ''}\t\t).${shell.globalSourceField}({
${shell.globalSourceIndentExtra ? '\t' : ''}\t\t\tsources: [
${shell.globalSourceSources.map((source) => `${shell.globalSourceIndentExtra ? '\t' : ''}\t\t\t\tSource.${source},`).join('\n')}
${shell.globalSourceIndentExtra ? '\t' : ''}\t\t\t],
${shell.limit === undefined ? '' : `${shell.globalSourceIndentExtra ? '\t' : ''}\t\t\tlimit: ${shell.limit},
`}${shell.globalSourceIndentExtra ? '\t' : ''}\t\t})}
${shell.globalSourceIndentExtra ? '\t' : ''}\t\tid="${shell.id}"
${shell.title === undefined ? '' : `${shell.globalSourceIndentExtra ? '\t' : ''}\t\ttitle="${shell.title}"
`}${shell.globalSourceIndentExtra ? '\t' : ''}\t/>
</Page>
`
}

const queryResourceAdapterButtons = `<button
\t\tdata-testid="adapter-ready-button"
\t\tonclick={() => applyQuery({
\t\t\tdata: 'Ready value',
\t\t\tisLoading: false,
\t\t\tisError: false,
\t\t\tisReady: true,
\t\t\tstatus: 'ready',
\t\t})}
\t>
\t\tAdapter ready
\t</button>

\t<button
\t\tdata-testid="adapter-refresh-loading-button"
\t\tonclick={() => applyQuery({
\t\t\tdata: 'Ready value',
\t\t\tisLoading: true,
\t\t\tisError: false,
\t\t\tisReady: false,
\t\t\tstatus: 'loading',
\t\t})}
\t>
\t\tAdapter refresh loading
\t</button>

\t<button
\t\tdata-testid="adapter-refreshed-ready-button"
\t\tonclick={() => applyQuery({
\t\t\tdata: 'Refreshed value',
\t\t\tisLoading: false,
\t\t\tisError: false,
\t\t\tisReady: true,
\t\t\tstatus: 'ready',
\t\t})}
\t>
\t\tAdapter refreshed ready
\t</button>

\t<button
\t\tdata-testid="adapter-error-button"
\t\tonclick={() => applyQuery({
\t\t\tdata: '',
\t\t\tisLoading: false,
\t\t\tisError: true,
\t\t\tisReady: false,
\t\t\terror: 'Adapter failure',
\t\t\tstatus: 'error',
\t\t})}
\t>
\t\tAdapter error
\t</button>

\t<button
\t\tdata-testid="adapter-recover-loading-button"
\t\tonclick={() => applyQuery({
\t\t\tdata: '',
\t\t\tisLoading: true,
\t\t\tisError: false,
\t\t\tisReady: false,
\t\t\tstatus: 'loading',
\t\t})}
\t>
\t\tAdapter recover loading
\t</button>

\t<button
\t\tdata-testid="adapter-recovered-ready-button"
\t\tonclick={() => applyQuery({
\t\t\tdata: 'Recovered value',
\t\t\tisLoading: false,
\t\t\tisError: false,
\t\t\tisReady: true,
\t\t\tstatus: 'ready',
\t\t})}
\t>
\t\tAdapter recovered ready
\t</button>`

const generatedQueryResourceAdapterPageShell = (
	mode: 'getters' | 'promise'
) => `<script lang="ts">
\t// Types/constants
\timport {
\t\ttype TanStackLiveQuerySnapshot,
\t\tTanStackLiveQueryResource,
\t} from '$/lib/db/queryResource.svelte.ts'


\tconst initialQuery = {
\t\tdata: '',
\t\tisLoading: true,
\t\tisError: false,
\t\tisReady: false,
\t\tstatus: 'loading',
\t} satisfies TanStackLiveQuerySnapshot<string>
\tlet query = $state<TanStackLiveQuerySnapshot<string>>(initialQuery)
\tconst queryListeners = new Set<() => void>()
\tconst resource = new TanStackLiveQueryResource(
\t\t() => query,
\t\t(update) => {
\t\t\tqueryListeners.add(update)
\t\t\treturn () => {
\t\t\t\tqueryListeners.delete(update)
\t\t\t}
\t\t},
\t)
${mode === 'getters' ? `\tlet resolveInitializedResource: (() => void) | undefined
\tlet initializedQuery = $state<TanStackLiveQuerySnapshot<string>>({
\t\tdata: 'Premature value',
\t\tisLoading: false,
\t\tisError: false,
\t\tisReady: true,
\t\tstatus: 'ready',
\t})
\tconst initializedQueryListeners = new Set<() => void>()
\tconst initializedResource = new TanStackLiveQueryResource(
\t\t() => initializedQuery,
\t\t(update) => {
\t\t\tinitializedQueryListeners.add(update)
\t\t\treturn () => {
\t\t\t\tinitializedQueryListeners.delete(update)
\t\t\t}
\t\t},
\t\t() => new Promise<void>((resolve) => {
\t\t\tresolveInitializedResource = resolve
\t\t})
\t)
` : `\tlet promiseState = $state('pending')
\tlet secondPromiseState = $state('pending')
\tlet catchState = $state('')
\tlet finallyCount = $state(0)
`}
\tconst applyQuery = (
\t\tnextQuery: TanStackLiveQuerySnapshot<string>,
\t) => {
\t\tquery.data = nextQuery.data
\t\tquery.isLoading = nextQuery.isLoading
\t\tquery.isError = nextQuery.isError
\t\tquery.isReady = nextQuery.isReady
\t\tquery.error = nextQuery.error
\t\tquery.status = nextQuery.status
${mode === 'promise' ? `\t\tpromiseState = 'pending'
\t\tsecondPromiseState = 'pending'
\t\tcatchState = ''
` : ''}\t\tfor (const listener of queryListeners)
\t\t\tlistener()
${mode === 'promise' ? `\t\tvoid resource.then(
\t\t\t(value) => {
\t\t\t\tpromiseState = value
\t\t\t},
\t\t\t(error) => {
\t\t\t\tpromiseState = String(error)
\t\t\t},
\t\t)
\t\tvoid resource.then(
\t\t\t(value) => {
\t\t\t\tsecondPromiseState = value
\t\t\t},
\t\t\t(error) => {
\t\t\t\tsecondPromiseState = String(error)
\t\t\t},
\t\t)
\t\tvoid resource.catch((error) => {
\t\t\tcatchState = String(error)
\t\t})
\t\tvoid resource.finally(() => {
\t\t\tfinallyCount += 1
\t\t}).catch(() => {})
` : ''}\t}
${mode === 'getters' ? `
\tconst resolveInitialized = () => {
\t\tinitializedQuery = {
\t\t\tdata: 'Initialized value',
\t\t\tisLoading: false,
\t\t\tisError: false,
\t\t\tisReady: true,
\t\t\tstatus: 'ready',
\t\t}
\t\tresolveInitializedResource?.()
\t\tfor (const listener of initializedQueryListeners)
\t\t\tlistener()
\t}
` : ''}</script>


<h1>Query resource adapter ${mode === 'getters' ? 'getter' : 'promise'} test route</h1>

<section>
\t<h2>TanStack adapter ${mode === 'getters' ? 'getter' : 'promise'} state machine</h2>

\t${queryResourceAdapterButtons}
${mode === 'getters' ? `
\t<button
\t\tdata-testid="adapter-disabled-ready-button"
\t\tonclick={() => applyQuery({
\t\t\tdata: 'Disabled value',
\t\t\tisLoading: false,
\t\t\tisError: false,
\t\t\tisReady: true,
\t\t\tstatus: 'ready',
\t\t})}
\t>
\t\tAdapter disabled ready
\t</button>

\t<dl>
\t\t<dt>current</dt>
\t\t<dd data-testid="adapter-current">{resource.current ?? ''}</dd>

\t\t<dt>loading</dt>
\t\t<dd data-testid="adapter-loading">{String(resource.loading)}</dd>

\t\t<dt>ready</dt>
\t\t<dd data-testid="adapter-ready">{String(resource.ready)}</dd>

\t\t<dt>error</dt>
\t\t<dd data-testid="adapter-error">{resource.error === undefined ? '' : String(resource.error)}</dd>
\t</dl>
</section>

<section>
\t<h2>Initialized resource</h2>

\t<button
\t\tdata-testid="initialized-resource-resolve"
\t\tonclick={resolveInitialized}
\t>
\t\tResolve initialized resource
\t</button>

\t<dl>
\t\t<dt>current</dt>
\t\t<dd data-testid="initialized-resource-current">{initializedResource.current ?? ''}</dd>

\t\t<dt>loading</dt>
\t\t<dd data-testid="initialized-resource-loading">{String(initializedResource.loading)}</dd>

\t\t<dt>ready</dt>
\t\t<dd data-testid="initialized-resource-ready">{String(initializedResource.ready)}</dd>
\t</dl>
</section>
` : `
\t<p data-testid="adapter-awaited">{promiseState}</p>
\t<p data-testid="adapter-awaited-second">{secondPromiseState}</p>
\t<p data-testid="adapter-catch">{catchState}</p>
\t<p data-testid="adapter-finally-count">{finallyCount}</p>
</section>
`}`

const generatedCollectionCacheDebugPageShell = () => `<script lang="ts">
\t// Types/constants
\timport { EntityMetaKey, entityFieldDefinitions } from '$/schema/$schema.ts'
\timport { schema } from '$/schema/index.ts'
\timport { Source } from '$/sources/Source.ts'
\timport { enabledSources } from '$/sources/index.ts'
\timport { appClient } from '$/routes/+layout.svelte'
\timport { useCollectionCache } from './collectionCache.svelte.ts'


\tconst collectionEntityDefinitions = schema.map((entityDefinition) => ({
\t\tentityType: entityDefinition.entityType,
\t\tlabel: entityDefinition.label,
\t\tfields: entityFieldDefinitions(entityDefinition).map((field) => ({
\t\t\tcacheKey: \`\${entityDefinition.entityType}\\0\${field.name}\`,
\t\t\tname: field.name,
\t\t})),
\t}))

\tconst entityCaches = Object.fromEntries(
\t\tschema.map((entityDefinition) => [
\t\t\tentityDefinition.entityType,
\t\t\tuseCollectionCache(appClient.entityCollections[entityDefinition.entityType]),
\t\t]),
\t)

\tconst fieldCaches = Object.fromEntries(
\t\tschema.flatMap((entityDefinition) => (
\t\t\tentityFieldDefinitions(entityDefinition).map((field) => [
\t\t\t\t\`\${entityDefinition.entityType}\\0\${field.name}\`,
\t\t\t\tuseCollectionCache(
\t\t\t\t\tappClient.entityFieldCollections[entityDefinition.entityType][field.name],
\t\t\t\t),
\t\t\t])
\t\t)),
\t)


\t// Components
\timport NumberValue from '$/views/NumberValue.svelte'
</script>


<main data-column>
\t<section data-card>
\t\t<h2>Resolver sources</h2>
\t\t<p class="collection-overview-lead">
\t\t\tWhich <code>Source</code> values are currently enabled (env gates satisfied in
\t\t\t<code>src/sources/index.ts</code>). Off means that resolver module is not registered.
\t\t</p>
\t\t<ul>
\t\t\t{#each [...Object.values(Source)].sort((a, b) => a.localeCompare(b)) as source (source)}
\t\t\t\t<li>
\t\t\t\t\t<code>{source}</code> · {enabledSources.has(source) ? 'on' : 'off'}
\t\t\t\t</li>
\t\t\t{/each}
\t\t</ul>
\t</section>
\t<section data-card>
\t\t<h2>Collection cache (TanStack DB)</h2>
\t\t<p class="collection-overview-lead">
\t\t\tRows already loaded in this session (not a full refetch). Expand a type to see items and
\t\t\teach related field group.
\t\t</p>

\t\t{#each collectionEntityDefinitions as entityDefinition (entityDefinition.entityType)}
\t\t\t{@const entityCache = entityCaches[entityDefinition.entityType]}

\t\t\t<details
\t\t\t\tdata-card
\t\t\t\tclass="collection-domain"
\t\t\t>
\t\t\t\t<summary>
\t\t\t\t\t<h2>
\t\t\t\t\t\t<code>{entityDefinition.entityType}</code>
\t\t\t\t\t</h2>

\t\t\t\t\t{entityDefinition.label}
\t\t\t\t</summary>

\t\t\t\t<div data-column>
\t\t\t\t\t<details
\t\t\t\t\t\tdata-card
\t\t\t\t\t\tclass="collection-domain"
\t\t\t\t\t>
\t\t\t\t\t\t<summary>
\t\t\t\t\t\t\t<h3>
\t\t\t\t\t\t\t\tItems
\t\t\t\t\t\t\t\t(<NumberValue
\t\t\t\t\t\t\t\t\tvalue={entityCache.rows.length}
\t\t\t\t\t\t\t\t\toptions={{ maximumFractionDigits: 0 }}
\t\t\t\t\t\t\t\t/>)
\t\t\t\t\t\t\t\t·
\t\t\t\t\t\t\t\t<code>{entityCache.status}</code>
\t\t\t\t\t\t\t</h3>
\t\t\t\t\t\t</summary>

\t\t\t\t\t\t{#if entityCache.status === 'error'}
\t\t\t\t\t\t\t<p>Error</p>
\t\t\t\t\t\t{:else if entityCache.rows.length}
\t\t\t\t\t\t\t<ul class="collection-entities">
\t\t\t\t\t\t\t\t{#each entityCache.rows as row, index (
\t\t\t\t\t\t\t\t\t[
\t\t\t\t\t\t\t\t\t\tString(row[EntityMetaKey.Source] ?? ''),
\t\t\t\t\t\t\t\t\t\tString(row[EntityMetaKey.SelectorKey] ?? ''),
\t\t\t\t\t\t\t\t\t].join('\\0')
\t\t\t\t\t\t\t\t)}
\t\t\t\t\t\t\t\t\t<li>
\t\t\t\t\t\t\t\t\t\t<pre data-card>{JSON.stringify(
\t\t\t\t\t\t\t\t\t\t\trow,
\t\t\t\t\t\t\t\t\t\t\t(_key, inner) => (typeof inner === 'bigint' ?
\t\t\t\t\t\t\t\t\t\t\t\tinner.toString()
\t\t\t\t\t\t\t\t\t\t\t:
\t\t\t\t\t\t\t\t\t\t\t\tinner),
\t\t\t\t\t\t\t\t\t\t\t2,
\t\t\t\t\t\t\t\t\t\t)}</pre>
\t\t\t\t\t\t\t\t\t</li>
\t\t\t\t\t\t\t\t{/each}
\t\t\t\t\t\t\t</ul>
\t\t\t\t\t\t{:else}
\t\t\t\t\t\t\t<p>No cached rows</p>
\t\t\t\t\t\t{/if}
\t\t\t\t\t</details>

\t\t\t\t\t{#each entityDefinition.fields as field, fieldIndex (
\t\t\t\t\t\t[
\t\t\t\t\t\t\tString(entityDefinition.entityType),
\t\t\t\t\t\t\tString(field.name),
\t\t\t\t\t\t\tString(fieldIndex),
\t\t\t\t\t\t].join('\\0')
\t\t\t\t\t)}
\t\t\t\t\t\t{@const fieldCache = fieldCaches[field.cacheKey]}

\t\t\t\t\t\t<details
\t\t\t\t\t\t\tdata-card
\t\t\t\t\t\t\tclass="collection-field"
\t\t\t\t\t\t>
\t\t\t\t\t\t\t<summary>
\t\t\t\t\t\t\t\t<h4>
\t\t\t\t\t\t\t\t\t<code>{field.name}</code>
\t\t\t\t\t\t\t\t\t(<NumberValue
\t\t\t\t\t\t\t\t\t\tvalue={fieldCache.rows.length}
\t\t\t\t\t\t\t\t\t\toptions={{ maximumFractionDigits: 0 }}
\t\t\t\t\t\t\t\t\t/>)
\t\t\t\t\t\t\t\t\t·
\t\t\t\t\t\t\t\t\t<code>{fieldCache.status}</code>
\t\t\t\t\t\t\t\t</h4>
\t\t\t\t\t\t\t</summary>

\t\t\t\t\t\t\t<div data-column>
\t\t\t\t\t\t\t\t{#if fieldCache.status === 'error'}
\t\t\t\t\t\t\t\t\t<p>Error</p>
\t\t\t\t\t\t\t\t{:else if fieldCache.rows.length}
\t\t\t\t\t\t\t\t\t<ul class="collection-entity-fields">
\t\t\t\t\t\t\t\t\t\t{#each fieldCache.rows as row, index (
\t\t\t\t\t\t\t\t\t\t\t[
\t\t\t\t\t\t\t\t\t\t\t\tString(entityDefinition.entityType),
\t\t\t\t\t\t\t\t\t\t\t\tString(field.name),
\t\t\t\t\t\t\t\t\t\t\t\tString(row[EntityMetaKey.Source] ?? ''),
\t\t\t\t\t\t\t\t\t\t\t\tString(row[EntityMetaKey.ParentSelectorKey] ?? ''),
\t\t\t\t\t\t\t\t\t\t\t\tString(index),
\t\t\t\t\t\t\t\t\t\t\t].join('\\0')
\t\t\t\t\t\t\t\t\t\t)}
\t\t\t\t\t\t\t\t\t\t\t<li>
\t\t\t\t\t\t\t\t\t\t\t\t<pre data-card>{JSON.stringify(
\t\t\t\t\t\t\t\t\t\t\t\t\trow,
\t\t\t\t\t\t\t\t\t\t\t\t\t(_key, inner) => (typeof inner === 'bigint' ?
\t\t\t\t\t\t\t\t\t\t\t\t\t\tinner.toString()
\t\t\t\t\t\t\t\t\t\t\t\t\t:
\t\t\t\t\t\t\t\t\t\t\t\t\t\tinner),
\t\t\t\t\t\t\t\t\t\t\t\t\t2,
\t\t\t\t\t\t\t\t\t\t\t\t)}</pre>
\t\t\t\t\t\t\t\t\t\t\t</li>
\t\t\t\t\t\t\t\t\t\t{/each}
\t\t\t\t\t\t\t\t\t</ul>
\t\t\t\t\t\t\t\t{:else}
\t\t\t\t\t\t\t\t\t<p>No cached rows</p>
\t\t\t\t\t\t\t\t{/if}
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</details>
\t\t\t\t\t{/each}
\t\t\t\t</div>
\t\t\t</details>
\t\t{/each}
\t</section>
</main>


<style>
\tpre {
\t\toverflow-x: auto;
\t\tfont-size: 0.8rem;
\t\tline-height: 1.35;
\t\tmax-height: 80vh;
\t}
</style>
`

const generatedEvmCalldataDecoderToolPageShell = () => `<script lang="ts">
	// Types/constants
	import type { CalldataExample } from '$/constants/calldata-examples.ts'
	import { calldataExamples } from '$/constants/calldata-examples.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'
	import { resolve } from '$app/paths'
	import { untrack } from 'svelte'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { afterNavigate, goto } from '$app/navigation'
	import { page } from '$app/state'


	const hexFromParam = (value: string | null): string => {
		if (!value) return ''
		const s = value.trim().replace(/^0x/i, '').replace(/\\s/g, '')
		if (!/^[0-9a-fA-F]*$/.test(s)) return ''
		const even = s.length % 2 === 0 ?
			s
		:
			s.slice(0, -1)
		return even ?
			\`0x\${even}\`
		:
			''
	}


	import {
		decodeCalldataWithSignature,
		decodeEventDataWithSignature,
		formatDecodedParamValue,
	} from '$/lib/calldata-decode.ts'

	import { normalizeEvmSelectorHex, normalizeEvmTopicHex } from '$/lib/signature-paths.ts'

	const EMPTY_SIGNATURES: readonly string[] = []

	const IDLE_SELECTOR_HEX: \`0x\${string}\` = '0xffffffff'

	const IDLE_TOPIC_HEX = ZeroExHex.assert(\`0x\${'f'.repeat(64)}\`)

	const TRUNCATE_PARAM_LENGTH = 28

	let inputRaw = $state(
		hexFromParam(page.url.searchParams.get('data')),
	)

	let selectedExample = $state<CalldataExample | undefined>(undefined)

	let selectedSigIndex = $state(0)

	let selectedEventSigIndex = $state(0)

	afterNavigate(({ to }) => {
		if (!to) return
		const fromUrl = hexFromParam(to.url.searchParams.get('data'))
		if (fromUrl === inputRaw) return
		inputRaw = fromUrl
	})

	$effect(() => {
		const hex = hexNormalized.length > 0 ? \`0x\${hexNormalized}\` : ''
		const curData = untrack(() =>
			hexFromParam(page.url.searchParams.get('data')),
		)
		if (hex === curData) return
		const pathname = untrack(() => page.url.pathname)
		const url = hex
			? \`\${pathname}?data=\${encodeURIComponent(hex)}\`
			:
				pathname
		void goto(url, { replaceState: true })
	})

	$effect(() => {
		const example = selectedExample
		if (!example) return
		inputRaw = example.hex
		selectedExample = undefined
	})

	// (Derived)
	const hexWithPrefix = $derived(
		inputRaw.startsWith('0x') ?
			inputRaw
		:
			inputRaw ?
				\`0x\${inputRaw}\`
			:
				'',
	)

	const hexNormalized = $derived(
		hexWithPrefix.slice(2).toLowerCase(),
	)

	const selector = $derived(
		hexNormalized.length >= 8 ?
			ZeroExHex.assert(\`0x\${hexNormalized.slice(0, 8).toLowerCase()}\`)
		:
			null,
	)

	const topic = $derived(
		hexNormalized.length >= 64 ?
			ZeroExHex.assert(\`0x\${hexNormalized.slice(0, 64).toLowerCase()}\`)
		:
			null,
	)

	const normalizedSelector = $derived(
		selector ? normalizeEvmSelectorHex(selector) : null,
	)

	const normalizedTopic = $derived(
		topic ? normalizeEvmTopicHex(topic) : null,
	)


	const selectorEntity = $derived(select(
		EntityType.EvmSelector,
		(selector ?
			{ hex: normalizedSelector ?? selector }
		:
			{ hex: IDLE_SELECTOR_HEX }
		),
		{ sources: [
				Source.Openchain_Rest,
			], fields: { signatures: true } }
	))

	const topicEntity = $derived(select(
		EntityType.EvmTopic,
		(topic ?
			{ hex: normalizedTopic ?? topic }
		:
			{ hex: IDLE_TOPIC_HEX }
		),
		{ sources: [
				Source.Openchain_Rest,
			], fields: { signatures: true } }
	))


	const functionSignatures = $derived(
		selector ?
			(selectorEntity.current?.signatures ?? EMPTY_SIGNATURES)
		:
			EMPTY_SIGNATURES,
	)

	const eventSignatures = $derived(
		topic ?
			(topicEntity.current?.signatures ?? EMPTY_SIGNATURES)
		:
			EMPTY_SIGNATURES,
	)

	const signatureForDecode = $derived(
		functionSignatures.length > 0
			? functionSignatures[
					Math.min(selectedSigIndex, functionSignatures.length - 1)
				]
			:
				null,
	)

	const decodedCall = $derived(
		hexWithPrefix && selector && signatureForDecode
			? decodeCalldataWithSignature(
					signatureForDecode,
					ZeroExHex.assert(hexWithPrefix),
				)
			:
				null,
	)

	const eventSignatureForDecode = $derived(
		eventSignatures.length > 0
			? eventSignatures[
					Math.min(selectedEventSigIndex, eventSignatures.length - 1)
				]
			:
				null,
	)

	const decodedEvent = $derived(
		hexWithPrefix
			&& hexNormalized.length >= 64
			&& eventSignatureForDecode
			? decodeEventDataWithSignature(
					eventSignatureForDecode,
					ZeroExHex.assert(hexWithPrefix),
				)
			:
				null,
	)


	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import Heading from '$/components/Heading.svelte'
	import Icon from '$/components/Icon.svelte'
	import Page from '$/components/Page.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Select from '$/components/Select.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
</script>


<svelte:head>
	<title>Calldata decoder</title>
</svelte:head>


<Page>
	<section
		class="calldata-decoder"
		data-column
	>
		<header data-column="gap-1">
			<Heading>Calldata decoder</Heading>
			<p>
				Paste transaction input or event data (hex) to resolve the function selector (4 bytes) and/or event topic (32 bytes) to human-readable signature(s). Use <code>?data=0x…</code> in the URL to open with hex pre-filled (shareable link).
			</p>
		</header>

		<form
			class="calldata-decoder-form"
			data-card
			data-column
		>
			<Select
				items={[...calldataExamples]}
				bind:value={
					() => selectedExample,
					(_value) => {
						selectedExample = _value
					}
				}
				allowDeselect={true}
				getItemId={(example) => example.id}
				getItemLabel={(example) => example.label}
				placeholder="Load example…"
				ariaLabel="Load example calldata"
			/>

			<label
				class="calldata-decoder-field"
				data-column
			>
				<span>Calldata (hex)</span>
				<textarea
					bind:value={inputRaw}
					placeholder="0xa9059cbb000000000000000000000000..."
					rows={4}
					spellcheck={false}
					autocapitalize="off"
					autocomplete="off"
				></textarea>
			</label>
		</form>

		{#if hexWithPrefix}
			<Collapsible>
				{#snippet Summary({ open: _open })}
					<Heading>Result</Heading>
				{/snippet}

				{#snippet children({ open })}
					<ul
						data-column="gap-4"
						class="calldata-result"
					>
						{#if selector && normalizedSelector}
							<li>
									<EntityView
										entityType={EntityType.EvmSelector}
										entitySelector={{ hex: normalizedSelector }}
										href={resolve('/(explore)/(evm)/evm/(selectors)/selector/[hex]', {
											hex: normalizedSelector,
										})}
									>
									{#snippet Icon()}
										<Icon
											icon="🔖"
											label="EVM selector"
											size="1.75rem"
										/>
									{/snippet}

									{#snippet Title()}
										<ResourceBoundary
											resource={selectorEntity}
											placeholderText="Loading function signature…"
										>
												{#snippet children(row)}
													<Heading>
														<a href={resolve('/(explore)/(evm)/evm/(selectors)/selector/[hex]', {
															hex: normalizedSelector,
														})}>
															{signatureForDecode ?? row.signatures?.[0] ?? normalizedSelector}
														</a>
													</Heading>
											{/snippet}
										</ResourceBoundary>
									{/snippet}

									{#snippet Value()}
										<span data-text="muted">Selector: {selector}</span>
									{/snippet}

									{#snippet Content()}
										{#if functionSignatures.length > 0}
											<dl data-definition-list="vertical">
												<div>
													<dt>Signature</dt>
													<dd>
														{#if functionSignatures.length > 1}
															<select
																bind:value={selectedSigIndex}
																aria-label="Choose function signature for decoding"
																class="calldata-result-select"
															>
																{#each functionSignatures as signature, index}
																	<option value={index}>{signature}</option>
																{/each}
															</select>
														{:else}
															<code>{functionSignatures[0]}</code>
														{/if}
													</dd>
												</div>

												{#if decodedCall}
													<div>
														<dt>Arguments</dt>
														<dd>
															<ol
																class="calldata-result-args"
															>
																{#each decodedCall.params as param, index}
																	<div class="calldata-result-arg">
																		<li>
																			<span>{index}</span>
																			{#if param.type === 'address' && typeof param.value === 'string'}
																				<EvmAccountView
																					selection={select(EntityType.EvmAccount, { address: EvmAddress.assert(param.value) })}
																					layout={EntityLayout.Value}
																				/>
																			{:else}
																				{@const displayValue = formatDecodedParamValue(param.type, param.value)}

																				{#if displayValue.length > TRUNCATE_PARAM_LENGTH}
																					<TruncatedValue
																						value={displayValue}
																						startLength={10}
																						endLength={8}
																					/>
																				{:else}
																					<span class="calldata-result-arg-value">{displayValue}</span>
																				{/if}
																			{/if}
																		</li>
																	</div>
																{/each}
															</ol>
														</dd>
													</div>
												{/if}
											</dl>
										{/if}
									{/snippet}
								</EntityView>
							</li>
						{/if}

						{#if topic && normalizedTopic}
							<li>
									<EntityView
										entityType={EntityType.EvmTopic}
										entitySelector={{ hex: normalizedTopic }}
										href={resolve('/(explore)/(evm)/evm/(topics)/topic/[hex]', {
											hex: normalizedTopic,
										})}
									>
									{#snippet Icon()}
										<Icon
											icon="📋"
											label="EVM topic"
											size="1.75rem"
										/>
									{/snippet}

									{#snippet Title()}
										<ResourceBoundary
											resource={topicEntity}
											placeholderText="Loading event signature…"
										>
												{#snippet children(row)}
													<Heading>
														<a href={resolve('/(explore)/(evm)/evm/(topics)/topic/[hex]', {
															hex: normalizedTopic,
														})}>
															{eventSignatureForDecode ?? row.signatures?.[0] ?? normalizedTopic}
														</a>
													</Heading>
											{/snippet}
										</ResourceBoundary>
									{/snippet}

									{#snippet Value()}
										<span data-text="muted">Topic: {topic}</span>
									{/snippet}

									{#snippet Content()}
										{#if eventSignatures.length > 0}
											<dl data-definition-list="vertical">
												<div>
													<dt>Signature</dt>
													<dd>
														{#if eventSignatures.length > 1}
															<select
																bind:value={selectedEventSigIndex}
																aria-label="Choose event signature for decoding"
																class="calldata-result-select"
															>
																{#each eventSignatures as signature, index}
																	<option value={index}>{signature}</option>
																{/each}
															</select>
														{:else}
															<code>{eventSignatures[0]}</code>
														{/if}
													</dd>
												</div>

												{#if decodedEvent}
													<div>
														<dt>Arguments</dt>
														<dd>
															<ol
																class="calldata-result-args"
															>
																{#each decodedEvent.params as param, index}
																	<div class="calldata-result-arg">
																		<li>
																			<span>{index}</span>
																			{#if param.type === 'address' && typeof param.value === 'string'}
																				<EvmAccountView
																					selection={select(EntityType.EvmAccount, { address: EvmAddress.assert(param.value) })}
																					layout={EntityLayout.Value}
																				/>
																			{:else}
																				{@const displayValue = formatDecodedParamValue(param.type, param.value)}

																				{#if displayValue.length > TRUNCATE_PARAM_LENGTH}
																					<TruncatedValue
																						value={displayValue}
																						startLength={10}
																						endLength={8}
																					/>
																				{:else}
																					<span class="calldata-result-arg-value">{displayValue}</span>
																				{/if}
																			{/if}
																		</li>
																	</div>
																{/each}
															</ol>
														</dd>
													</div>
												{/if}
											</dl>
										{/if}
									{/snippet}
								</EntityView>
							</li>
						{/if}

						<li>
							<dl data-definition-list="vertical">
								<div>
									<dt>Bytes</dt>
									<dd>{hexNormalized ? Math.floor(hexNormalized.length / 2) : 0}</dd>
								</div>
							</dl>
						</li>
					</ul>
				{/snippet}
			</Collapsible>
		{:else if inputRaw.trim().length > 0}
			<p>
				Enter valid hex (optional <code>0x</code>). Odd-length input is trimmed to even length.
			</p>
		{/if}
	</section>
</Page>


<style>
	.calldata-decoder {
		gap: 1rem;
	}

	.calldata-decoder-form {
		gap: 1rem;
		padding: 1rem;
	}

	.calldata-decoder-field {
		gap: 0.5rem;
	}

	.calldata-decoder-field textarea {
		font-family: var(--fontFamily-monospace);
		min-block-size: 6rem;
	}

	.calldata-result {
		list-style: none;
		padding-inline-start: 0;
	}

	.calldata-result-select {
		font-family: var(--fontFamily-monospace);
		max-width: 100%;
	}

	.calldata-result-args {
		margin: 0;
	}

	.calldata-result-arg dt {
		font-family: var(--fontFamily-monospace);
		min-inline-size: 1.5em;
	}

	.calldata-result-arg-value {
		font-family: var(--fontFamily-monospace);
		word-break: break-all;
	}
</style>
`

const generatedResourceBoundaryFixturePageShell = () => `<script lang="ts">
	// Types/constants
	import { writeLocalBlockheadSessionName } from '$/collections/localMutations.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import { SpecificationRealm } from '$/constants/SpecificationProposal.ts'
	import {
		type TanStackLiveQuerySnapshot,
		type SvelteKitResource,
		TanStackLiveQueryResource,
	} from '$/lib/db/queryResource.svelte.ts'
	import {
		appClient,
		select,
	} from '$/routes/+layout.svelte'


	let cachedBoundaryOpen = $state(
		true
	)

	const cachedQuery = {
		data: 'Cached value',
		isLoading: false,
		isError: false,
		isReady: true,
		status: 'ready',
	} satisfies TanStackLiveQuerySnapshot<string>
	const cachedResource = new TanStackLiveQueryResource(() => cachedQuery)

	const initialLiveQuery = {
		data: '',
		isLoading: true,
		isError: false,
		isReady: false,
		status: 'loading',
	} satisfies TanStackLiveQuerySnapshot<string>
	let liveQuery = $state<TanStackLiveQuerySnapshot<string>>(initialLiveQuery)
	const liveQueryListeners = new Set<() => void>()
	const selectedResource = new TanStackLiveQueryResource(
		() => liveQuery,
		(update) => {
			liveQueryListeners.add(update)
			return () => {
				liveQueryListeners.delete(update)
			}
		},
	)

	const initialFailableQuery = {
		data: '',
		isLoading: true,
		isError: false,
		isReady: false,
		status: 'loading',
	} satisfies TanStackLiveQuerySnapshot<string>
	let failableQuery = $state<TanStackLiveQuerySnapshot<string>>(initialFailableQuery)
	const failableQueryListeners = new Set<() => void>()
	const failableResource = new TanStackLiveQueryResource(
		() => failableQuery,
		(update) => {
			failableQueryListeners.add(update)
			return () => {
				failableQueryListeners.delete(update)
			}
		},
	)

	let remoteValue = $state('')
	let remoteReady = $state(false)
	let queryTaggedValue = $state('')
	let queryTaggedReady = $state(false)
	let showFailedResource = $state(false)
	let showRealSelectedScalarResource = $state(false)
	let showRealSelectedResource = $state(false)
	let showRealSelectedCountResource = $state(false)
	let resolveRemotePromise: (value: string) => void = () => {}
	let resolveQueryTaggedPromise: (value: string) => void = () => {}
	const remotePromise = new Promise<string>((resolve) => {
		resolveRemotePromise = resolve
	})
	const remoteResource = {
		then: remotePromise.then.bind(remotePromise),
		catch: remotePromise.catch.bind(remotePromise),
		finally: remotePromise.finally.bind(remotePromise),
		get current() {
			return remoteReady ? remoteValue : undefined
		},
		get error() {
			return undefined
		},
		get ready() {
			return remoteReady
		},
		get loading() {
			return !remoteReady
		},
		[Symbol.toStringTag]: 'RemoteResource',
	}
	const queryTaggedPromise = new Promise<string>((resolve) => {
		resolveQueryTaggedPromise = resolve
	})
	const queryTaggedResource = {
		then: queryTaggedPromise.then.bind(queryTaggedPromise),
		catch: queryTaggedPromise.catch.bind(queryTaggedPromise),
		finally: queryTaggedPromise.finally.bind(queryTaggedPromise),
		get current() {
			return queryTaggedReady ? queryTaggedValue : undefined
		},
		get error() {
			return undefined
		},
		get ready() {
			return queryTaggedReady
		},
		get loading() {
			return !queryTaggedReady
		},
		[Symbol.toStringTag]: 'Query',
	}
	const failedPromise = Promise.reject<string>(new Error('Boundary failure'))
	const failedResource = {
		then: failedPromise.then.bind(failedPromise),
		catch: failedPromise.catch.bind(failedPromise),
		finally: failedPromise.finally.bind(failedPromise),
		get current() {
			return undefined
		},
		get error() {
			return 'Boundary failure'
		},
		get ready() {
			return false
		},
		get loading() {
			return false
		},
		[Symbol.toStringTag]: 'Query',
	} satisfies SvelteKitResource<string>
	const realSelectedScalarResource = select(
		EntityType.BlockheadSession,
		{
			id: 'e2e-probe-session',
		},
		{
			sources: [
				Source.Local_Internal,
			],
			fields: {
				name: true,
				status: true,
			},
		},
	)
	const realSelectedBoundaryOnlyResource = select(
		EntityType.BlockheadSession,
		{
			id: 'e2e-probe-session',
		},
		{
			sources: [
				Source.Local_Internal,
			],
			fields: {
				name: true,
				status: true,
			},
		},
	)
	const realSelectedDirectOnlyResource = select(
		EntityType.BlockheadSession,
		{
			id: 'e2e-probe-direct-session',
		},
		{
			sources: [
				Source.Local_Internal,
			],
			fields: {
				name: true,
				status: true,
			},
		},
	)
	let realSelectedScalar = $derived(
		realSelectedScalarResource.current
	)
	let realSelectedDirectOnly = $derived(
		realSelectedDirectOnlyResource.current
	)
	const applySelectedValue = (
		value: string,
	) => {
		liveQuery.data = value
		liveQuery.isLoading = false
		liveQuery.isError = false
		liveQuery.isReady = true
		liveQuery.error = undefined
		liveQuery.status = 'ready'
		for (const listener of liveQueryListeners)
			listener()
	}

	const applySelectedLoading = () => {
		liveQuery.isLoading = true
		liveQuery.isError = false
		liveQuery.isReady = false
		liveQuery.error = undefined
		liveQuery.status = 'loading'
		for (const listener of liveQueryListeners)
			listener()
	}

	const applyFailableValue = (
		value: string,
	) => {
		failableQuery.data = value
		failableQuery.isLoading = false
		failableQuery.isError = false
		failableQuery.isReady = true
		failableQuery.error = undefined
		failableQuery.status = 'ready'
		for (const listener of failableQueryListeners)
			listener()
	}

	const applyFailableError = () => {
		failableQuery.data = ''
		failableQuery.isLoading = false
		failableQuery.isError = true
		failableQuery.isReady = false
		failableQuery.error = 'Failable boundary failure'
		failableQuery.status = 'error'
		for (const listener of failableQueryListeners)
			listener()
	}

	const applyRemoteValue = (
		value: string,
	) => {
		remoteValue = value
		remoteReady = true
		resolveRemotePromise(value)
	}

	const applyQueryTaggedValue = (
		value: string,
	) => {
		queryTaggedValue = value
		queryTaggedReady = true
		resolveQueryTaggedPromise(value)
	}

	const applyRealSelectedLabelValue = (
		value: string,
	) => {
		writeLocalBlockheadSessionName(appClient, {
			id: 'e2e-probe-session',
		}, value)
	}

	const applyRealSelectedBoundaryOnlyLabelValue = (
		value: string,
	) => {
		writeLocalBlockheadSessionName(appClient, {
			id: 'e2e-probe-session',
		}, value)
	}

	const applyRealSelectedDirectOnlyLabelValue = (
		value: string,
	) => {
		writeLocalBlockheadSessionName(appClient, {
			id: 'e2e-probe-direct-session',
		}, value)
	}

	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<h1>Resource boundary test route</h1>

<Collapsible
	bind:open={cachedBoundaryOpen}
>
	{#snippet Summary()}
		<span>Cached boundary</span>
	{/snippet}

	<ResourceBoundary
		resource={cachedResource}
		placeholderText="Loading cached value"
	>
		{#snippet children(value)}
			<p data-testid="cached-boundary-value">{value}</p>
		{/snippet}
	</ResourceBoundary>
</Collapsible>

<section data-testid="selected-boundary-section">
	<h2>Selected boundary</h2>

	<button
		data-testid="resolve-selected-boundary"
		onclick={() => applySelectedValue('Selected value')}
	>
		Resolve selected boundary
	</button>

	<button
		data-testid="refresh-selected-boundary"
		onclick={applySelectedLoading}
	>
		Refresh selected boundary
	</button>

	<button
		data-testid="update-selected-boundary"
		onclick={() => applySelectedValue('Updated selected value')}
	>
		Update selected boundary
	</button>

	<p data-testid="selected-direct-current">{selectedResource.current ?? ''}</p>

	<ResourceBoundary
		resource={selectedResource}
		placeholderText="Loading selected value"
	>
		{#snippet children(value)}
			<p data-testid="selected-boundary-value">{value}</p>
		{/snippet}
	</ResourceBoundary>

	<ResourceBoundary
		resource={selectedResource}
		placeholderText="Loading selected duplicate value"
	>
		{#snippet children(value)}
			<p data-testid="selected-boundary-value-secondary">{value}</p>
		{/snippet}
	</ResourceBoundary>

	<svelte:boundary>
		<p data-testid="selected-awaited-value">{await selectedResource}</p>

		{#snippet pending()}
			<p data-testid="selected-awaited-value">pending</p>
		{/snippet}
	</svelte:boundary>
</section>

<section data-testid="failable-boundary-section">
	<h2>Failable TanStack resource boundary</h2>

	<button onclick={() => applyFailableValue('Failable value')}>
		Resolve failable boundary
	</button>

	<button
		data-testid="fail-failable-boundary"
		onclick={applyFailableError}
	>
		Fail failable boundary
	</button>

	<button
		data-testid="recover-failable-boundary"
		onclick={() => applyFailableValue('Recovered failable value')}
	>
		Recover failable boundary
	</button>

	<ResourceBoundary
		resource={failableResource}
		placeholderText="Loading failable value"
	>
		{#snippet children(value)}
			<p data-testid="failable-boundary-value">{value}</p>
		{/snippet}

		{#snippet Failed(error, retry)}
			<p data-testid="failable-boundary-error">{String(error)}</p>

			<button
				data-testid="failable-boundary-retry"
				onclick={retry}
			>
				Retry failable boundary
			</button>
		{/snippet}
	</ResourceBoundary>
</section>

<section data-testid="real-selection-boundary-section">
	<h2>Real selection boundary</h2>

	<button
		data-testid="show-real-selection-scalar-boundary"
		onclick={() => showRealSelectedScalarResource = true}
	>
		Show real selection scalar boundary
	</button>

	<button
		data-testid="show-real-selection-rows-boundary"
		onclick={() => showRealSelectedResource = true}
	>
		Show real selection rows boundary
	</button>

	<button
		data-testid="show-real-selection-count-boundary"
		onclick={() => showRealSelectedCountResource = true}
	>
		Show real selection count boundary
	</button>

	<button onclick={() => applyRealSelectedLabelValue('Boundary Session')}>
		Seed real selection scalar field
	</button>

	<button
		data-testid="update-real-selection-scalar-field"
		onclick={() => applyRealSelectedLabelValue('Updated Boundary Session')}
	>
		Update real selection scalar field
	</button>

	<button onclick={() => applyRealSelectedBoundaryOnlyLabelValue('Boundary Only Session')}>
		Seed boundary-only live subscription field
	</button>

	<button
		data-testid="update-boundary-only-live-subscription-field"
		onclick={() => applyRealSelectedBoundaryOnlyLabelValue('Updated Boundary Only Session')}
	>
		Update boundary-only live subscription field
	</button>

	<button
		data-testid="update-direct-only-live-subscription-field"
		onclick={() => applyRealSelectedDirectOnlyLabelValue('Updated Direct Only Session')}
	>
		Update direct-only live subscription field
	</button>

	{#if showRealSelectedScalarResource}
		<p data-testid="real-resource-direct-scalars">
			{realSelectedScalar?.name ?? ''}:{realSelectedScalar?.status ?? ''}
		</p>

		<svelte:boundary>
			{@const value = await realSelectedScalarResource}

			<p data-testid="real-resource-awaited-scalars">{value.name}:{value.status}</p>

			{#snippet pending()}
				<p data-testid="real-resource-awaited-scalars">pending</p>
			{/snippet}
		</svelte:boundary>

		<ResourceBoundary
			resource={realSelectedScalarResource}
			placeholderText="Loading real selection scalar value"
		>
			{#snippet children(value)}
				<p data-testid="real-resource-boundary-scalars">{value.name}:{value.status}</p>
			{/snippet}
		</ResourceBoundary>
	{/if}

	<ResourceBoundary
		resource={realSelectedBoundaryOnlyResource}
		placeholderText="Loading real selection boundary-only resource"
	>
		{#snippet children(value)}
			<p data-testid="real-resource-boundary-only-scalars">{value.name}:{value.status}</p>
		{/snippet}
	</ResourceBoundary>

	<p data-testid="real-resource-direct-only-current">
		{realSelectedDirectOnly?.name ?? ''}:{realSelectedDirectOnly?.status ?? ''}
	</p>

	<p data-testid="real-resource-direct-only-loading">
		{String(realSelectedDirectOnlyResource.loading)}
	</p>

	<p data-testid="real-resource-direct-only-ready">
		{String(realSelectedDirectOnlyResource.ready)}
	</p>

	<p data-testid="real-resource-direct-only-error">
		{realSelectedDirectOnlyResource.error == null ? '' : String(realSelectedDirectOnlyResource.error)}
	</p>

	{#if showRealSelectedResource}
		<ResourceBoundary
			resource={select(
				EntityType.SpecificationRealm,
				{
					realm: SpecificationRealm.Ethereum,
				},
				{
					sources: [
						Source.Constants_Internal,
					],
					fields: {
						$$proposalKinds: true,
					},
				}
			)}
			placeholderText="Loading real selection value"
		>
			{#snippet children(value)}
				<p data-testid="real-resource-boundary-rows">{value.$$proposalKinds?.values.length ?? 0}</p>
			{/snippet}
		</ResourceBoundary>
	{/if}

	{#if showRealSelectedCountResource}
		<ResourceBoundary
			resource={select(
				EntityType.SpecificationRealm,
				{
					realm: SpecificationRealm.Ethereum,
				},
				{
					sources: [
						Source.Constants_Internal,
					],
					fields: {
						$$proposalKinds: {
							count: true,
						},
					},
				}
			)}
			placeholderText="Loading real selection count"
		>
			{#snippet children(value)}
				<p data-testid="real-resource-boundary-count">
					{value.$$proposalKinds?.values.length ?? 0}:{value.$$proposalKinds?.totalCount ?? ''}
				</p>
			{/snippet}
		</ResourceBoundary>
	{/if}
</section>

<section data-testid="query-resource-boundary-section">
	<h2>SvelteKit query resource boundary</h2>

	<button
		data-testid="resolve-query-resource-boundary"
		onclick={() => applyQueryTaggedValue('Query tagged value')}
	>
		Resolve query resource boundary
	</button>

	<button onclick={() => applyQueryTaggedValue('Updated query tagged value')}>
		Update query resource boundary
	</button>

	<ResourceBoundary
		resource={queryTaggedResource}
		placeholderText="Loading query resource value"
	>
		{#snippet children(value)}
			<p data-testid="query-tagged-boundary-value">{value}</p>
		{/snippet}
	</ResourceBoundary>
</section>

<section data-testid="failed-resource-boundary-section">
	<h2>Failed resource boundary</h2>

	<button
		data-testid="show-failed-resource"
		onclick={() => showFailedResource = true}
	>
		Show failed resource
	</button>

	{#if showFailedResource}
		<ResourceBoundary
			resource={failedResource}
			placeholderText="Loading failed value"
		>
			{#snippet children(value)}
				<p>{value}</p>
			{/snippet}

			{#snippet Failed(error)}
				<p data-testid="failed-resource-message">{error instanceof Error ? error.message : String(error)}</p>
			{/snippet}
		</ResourceBoundary>
	{/if}
</section>

<section data-testid="remote-resource-boundary-section">
	<h2>Remote resource boundary</h2>

	<button
		data-testid="resolve-remote-boundary"
		onclick={() => applyRemoteValue('Remote selected value')}
	>
		Resolve remote boundary
	</button>

	<button onclick={() => applyRemoteValue('Updated remote value')}>
		Update remote boundary
	</button>

	<ResourceBoundary
		resource={remoteResource}
		placeholderText="Loading remote value"
	>
		{#snippet children(value)}
			<p data-testid="remote-boundary-value">{value}</p>
		{/snippet}
	</ResourceBoundary>
</section>
`

const generatedRoutePageShell = (
	shell: ExpectedApp['routes']['pageShells'][number]
) => {
	const viewFile = shell.viewFile ?? `${shell.viewComponent}.svelte`

	if (shell.kind === 'erc20-allowance-detail')
		return `<script lang="ts">
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { toEvmActorCoinAllowanceEntitySelector } from '$/schema/EvmActorCoinAllowance.ts'
\timport { select } from '$/routes/+layout.svelte'
\t// Functions
\timport { with0xHex } from '$/lib/hexLowerOfByteSize.ts'


\t// State
\tlet {
\t\tparams,
\t} = $props()


\t// Components
\timport Page from '$/components/Page.svelte'
\timport EvmActorCoinAllowanceView from '$/views/EvmActorCoinAllowanceView.svelte'
</script>


<Page>
\t<EvmActorCoinAllowanceView
\t\tselection={select(EntityType.EvmActorCoinAllowance, toEvmActorCoinAllowanceEntitySelector(
\t\t\tNumber(params.chainId),
\t\t\twith0xHex(params.owner),
\t\t\twith0xHex(params.coin),
\t\t\twith0xHex(params.spender),
\t\t))}
\t/>
</Page>
`

	if (shell.kind === 'erc20-allowances-overview')
		return `<script lang="ts">
\t// Types/constants


\t// Components
\timport Page from '$/components/Page.svelte'
\timport HeadingComponent from '$/components/Heading.svelte'
</script>


<Page>
\t<HeadingComponent>
\t\tERC-20 Allowances
\t</HeadingComponent>

\t<p data-text="muted">
\t\tERC-20 token allowances give a spender permission to transfer tokens on the owner's behalf.
\t\tBlock explorers do not index every historical <code>Approval</code> event, so allowances cannot be
\t\tlisted globally. Check individual token-spender pairs on a network account page.
\t</p>

\t<p>
\t\tPer-network accounts make it possible to check the current allowance for known
\t\ttoken and spender combinations via on-chain execution RPC.
\t</p>
</Page>
`

	if (shell.kind === 'query-resource-adapter-getters')
		return generatedQueryResourceAdapterPageShell('getters')

	if (shell.kind === 'query-resource-adapter-promise')
		return generatedQueryResourceAdapterPageShell('promise')

	if (shell.kind === 'collection-cache-debug')
		return generatedCollectionCacheDebugPageShell()

	if (shell.kind === 'resource-boundary-fixture')
		return generatedResourceBoundaryFixturePageShell()

	if (shell.kind === 'evm-calldata-decoder-tool')
		return generatedEvmCalldataDecoderToolPageShell()

	if (shell.kind === 'atproto-actor-detail')
		return `<script lang="ts">
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { select } from '$/routes/+layout.svelte'
\t// State
\tlet {
\t\tparams,
\t} = $props()


\t// Components
\timport Page from '$/components/Page.svelte'
\timport AtprotoActorView from '$/views/AtprotoActorView.svelte'
</script>


<Page>
\t\t<AtprotoActorView
\t\t\tselection={select(EntityType.AtprotoActor, decodeURIComponent(params.did).startsWith('did:') ?
\t\t\t\t\t{ did: decodeURIComponent(params.did) }
\t\t\t\t:
\t\t\t\t\t{ handle: decodeURIComponent(params.did) })}
\t\t/>
\t</Page>
`

	if (shell.kind === 'atproto-actor-posts')
		return `\t<script lang="ts">
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { select } from '$/routes/+layout.svelte'
\t\t// State
\t\tlet {
\t\t\tparams,
\t\t} = $props()

\t\tconst selector = $derived(
\t\t\tdecodeURIComponent(params.did).startsWith('did:') ?
\t\t\t\t{ did: decodeURIComponent(params.did) }
\t\t\t:
\t\t\t\t{ handle: decodeURIComponent(params.did) },
\t\t)


\t\t// Components
\t\timport Page from '$/components/Page.svelte'
\t\timport AtprotoActorView from '$/views/AtprotoActorView.svelte'
\t</script>


<Page>
\t\t<AtprotoActorView
\t\t\tselection={select(EntityType.AtprotoActor, selector)}
\t\t/>
\t</Page>
`

	if (shell.kind === 'x-user-detail')
		return `<script lang="ts">
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { select } from '$/routes/+layout.svelte'
\t// State
\tlet {
\t\tparams,
\t} = $props()


\t// Components
\timport Page from '$/components/Page.svelte'
\timport XUserView from '$/views/XUserView.svelte'
</script>


<Page>
\t<XUserView
\t\tselection={select(EntityType.XUser, /^\\d+$/.test(decodeURIComponent(params.userId)) ?
\t\t\t\t{
\t\t\t\t\tid: decodeURIComponent(params.userId),
\t\t\t\t}
\t\t\t:
\t\t\t\t{
\t\t\t\t\tusername: decodeURIComponent(params.userId).replace(/^@/, ''),
\t\t\t\t})}
\t>
\t</XUserView>
</Page>
`

	if (shell.kind === 'activitypub-notes')
		return `<script lang="ts">
\timport { select } from '$/routes/+layout.svelte'
\t// Types/constants
\timport { EntityType } from '$/schema/EntityType.ts'


\t// Context
\timport { resolve } from '$app/paths'


\t// Components
\timport Page from '$/components/Page.svelte'
\timport ActivityPubNotesView from '$/views/ActivityPubNotesView.svelte'
</script>


<Page>
\t<ActivityPubNotesView
\t\thref={resolve('/(social)/(activitypub)/activitypub/notes')}
\t\tselection={select(
\t\t\tEntityType.ActivityPubNetwork,
\t\t\t{ scope: 'ActivityPubNetwork' }
\t\t).$$activityPubNotes}
\t\tid="activitypub-notes"
\t\torderByCreatedAt="desc"
\t\tplaceholderText="Loading Mastodon public timeline…"
\t\ttitle="Notes"
\t/>
</Page>
`

	if (shell.kind === 'activitypub-note-thread')
		return `<script lang="ts">
\timport { select } from '$/routes/+layout.svelte'
\t// Context
\timport { resolve } from '$app/paths'


\t// State
\tlet {
\t\tparams,
\t} = $props()


\t// Components
\timport ActivityPubNotesView from '$/views/ActivityPubNotesView.svelte'
\timport Page from '$/components/Page.svelte'
\timport { EntityType } from '$/schema/EntityType.ts'
</script>


<Page>
\t<ActivityPubNotesView
\t\thref={resolve('/activitypub/notes')}
\t\tselection={select(
\t\t\tEntityType.ActivityPubNote,
\t\t\t{
\t\t\t\tinstanceOrigin: decodeURIComponent(params.instanceOrigin),
\t\t\t\tlocalStatusId: decodeURIComponent(params.localStatusId),
\t\t\t}
\t\t).$$thread}
\t\tid="activitypub-note-thread"
\t\torderByCreatedAt="asc"
\t\tplaceholderText="Loading thread…"
\t\ttitle="Thread"
\t/>
</Page>
`

	if (shell.kind === 'rss-feeds')
		return `<script lang="ts">
\t// Types/constants
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { Source } from '$/sources/Source.ts'


\t// Context
\timport { resolve } from '$app/paths'
\timport { select } from '$/routes/+layout.svelte'


\t// Components
\timport Page from '$/components/Page.svelte'
\timport RssFeedsView from '$/views/RssFeedsView.svelte'
</script>


<Page>
\t<RssFeedsView
\t\thref={resolve('/rss/feeds')}
\t\tselection={select(
\t\t\tEntityType.RssNetwork,
\t\t\t{ scope: 'RssNetwork' },
\t\t\t{
\t\t\t\tsources: [Source.Constants_Internal],
\t\t\t}
\t\t).$$rssFeeds({
\t\t\tsources: [Source.Constants_Internal],
\t\t})}
\t\tid="rss-feeds"
\t/>
</Page>
`

	if (shell.kind === 'rss-feed-items')
		return `<script lang="ts">
\timport { select } from '$/routes/+layout.svelte'
\t// Types/constants
\timport { EntityType } from '$/schema/EntityType.ts'


\t// Context
\timport { resolve } from '$app/paths'
\timport { page } from '$app/state'


\t// (Derived)


\t// Components
\timport Page from '$/components/Page.svelte'
\timport RssItemsView from '$/views/RssItemsView.svelte'
</script>


<Page>
\t<RssItemsView
\t\thref={resolve('/rss/items')}
\t\tselection={select(
\t\t\tEntityType.RssFeed,
\t\t\t{
\t\t\t\tfeedUrl: decodeURIComponent(page.params.feedKey ?? ''),
\t\t\t}
\t\t).$$items}
\t\tid="rss-feed-items"
\t/>
</Page>
`

	if (shell.kind === 'youtube-video-comments')
		return `<script lang="ts">
\timport { select } from '$/routes/+layout.svelte'
\t// Types/constants
\timport { EntityType } from '$/schema/EntityType.ts'


\t// Context
\timport { resolve } from '$app/paths'


\t// State
\tlet {
\t\tparams,
\t} = $props()

\tconst selector = $derived(
\t\t{ videoId: decodeURIComponent(params.videoId) },
\t)


\t// Components
\timport Page from '$/components/Page.svelte'
\timport YouTubeCommentsView from '$/views/YouTubeCommentsView.svelte'
</script>


<Page>
\t<YouTubeCommentsView
\t\thref={resolve(
\t\t\t'/(social)/(youtube)/youtube/video/[videoId]/(video)/comments',
\t\t\t{ videoId: encodeURIComponent(selector.videoId) },
\t\t)}
\t\tselection={select(
\t\t\tEntityType.YouTubeVideo,
\t\t\tselector
\t\t).$$comments}
\t\tid="youtube-video-comments"
\t/>
</Page>
`

	if (shell.kind === 'xmtp-account-detail')
		return `<script lang="ts">
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { select } from '$/routes/+layout.svelte'
\t// Types/constants
\timport { type as arktype } from 'arktype'
\timport { EvmAddress } from '$/schema/ZeroExHex.ts'


\t// State
\tlet {
\t\tparams,
\t} = $props()
\tconst selector = $derived(
\t\t((address) => (
\t\t\taddress instanceof arktype.errors ?
\t\t\t\tundefined
\t\t\t:
\t\t\t\t{ address }
\t\t))(EvmAddress(params.accountId)),
\t)

\t// Components
\timport Page from '$/components/Page.svelte'
\timport EvmAccountView from '$/views/EvmAccountView.svelte'
</script>


<Page>
\t{#if selector}
\t\t<EvmAccountView
\t\t\tselection={select(EntityType.EvmAccount, selector)}
\t\t/>
\t{/if}
</Page>
`

	if (shell.kind === 'atproto-post-thread')
		return `<script lang="ts">
\timport { select } from '$/routes/+layout.svelte'
\t// State
\tlet {
\t\tparams,
\t} = $props()


\t// Components
\timport AtprotoPostThreadView from '$/views/AtprotoPostThreadView.svelte'
\timport Page from '$/components/Page.svelte'
\timport { EntityType } from '$/schema/EntityType.ts'
</script>


<Page>
\t<AtprotoPostThreadView
\t\tselection={select(
\t\t\tEntityType.AtprotoPost,
\t\t\t{
\t\t\t\turi: decodeURIComponent(params.uri),
\t\t\t}
\t\t).$$thread}
\t\tid="atproto-post-thread"
\t\ttitle="Thread"
\t/>
</Page>
`

	if (shell.kind === 'farcaster-cast-by-fname-hash')
		return `<script lang="ts">
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { select } from '$/routes/+layout.svelte'
\t// Types/constants
\timport { type as arktype } from 'arktype'
\timport { ZeroExHex } from '$/schema/ZeroExHex.ts'


\t// State
\tlet {
\t\tparams,
\t} = $props()
\tconst selector = $derived(
\t\t((hashPrefix) => (
\t\t\thashPrefix instanceof arktype.errors ?
\t\t\t\tundefined
\t\t\t:
\t\t\t\t{
\t\t\t\t\tusername: params.fname,
\t\t\t\t\thashPrefix,
\t\t\t\t}
\t\t))(ZeroExHex(params.hash)),
\t)

\t// Components
\timport Page from '$/components/Page.svelte'
\timport FarcasterCastView from '$/views/FarcasterCastView.svelte'
</script>


<Page>
\t{#if selector}
\t\t<FarcasterCastView
\t\t\tvariant="feed"
\t\t\tselection={select(EntityType.FarcasterCast, selector)}
\t\t/>
\t{/if}
</Page>
`

	if (shell.kind === 'farcaster-cast-by-fid-hash')
		return `<script lang="ts">
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { select } from '$/routes/+layout.svelte'
\t// Types/constants
\timport { type as arktype } from 'arktype'
\timport { ZeroExHex } from '$/schema/ZeroExHex.ts'


\t// State
\tlet {
\t\tparams,
\t} = $props()
\tconst selector = $derived(
\t\t((hash) => (
\t\t\thash instanceof arktype.errors ?
\t\t\t\tundefined
\t\t\t:
\t\t\t\t{
\t\t\t\t\tfid: Number(params.fid),
\t\t\t\t\thash,
\t\t\t\t}
\t\t))(ZeroExHex(params.hash)),
\t)

\t// Components
\timport Page from '$/components/Page.svelte'
\timport FarcasterCastView from '$/views/FarcasterCastView.svelte'
</script>


<Page>
\t{#if selector}
\t\t<FarcasterCastView
\t\t\tvariant="feed"
\t\t\tselection={select(EntityType.FarcasterCast, selector)}
\t\t/>
\t{/if}
</Page>
`

	if (shell.kind === 'farcaster-trending-feed')
		return `<script lang="ts">
\timport { select } from '$/routes/+layout.svelte'
\t// Types/constants
\timport type { EntitySelector } from '$/schema/$schema.ts'
\timport { schema } from '$/schema/index.ts'
\timport { EntityType } from '$/schema/EntityType.ts'


\t// Functions
\tconst selector: EntitySelector<typeof schema, EntityType.FarcasterFeed> = {
\t\tvariant: 'trending',
\t}


\t// Components
\timport Page from '$/components/Page.svelte'
\timport FarcasterFeedView from '$/views/FarcasterFeedView.svelte'
</script>


<Page>
\t<FarcasterFeedView
\t\tselection={select(EntityType.FarcasterFeed, selector)}
\t\tlimit={50}
\t/>
</Page>
`

	if (shell.kind === 'farcaster-open-cast')
		return `<script lang="ts">
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { select } from '$/routes/+layout.svelte'
\t// Types/constants
\timport { type as arktype } from 'arktype'
\timport { UrlString } from '$/schema/UrlString.ts'


\t// Context
\timport { page } from '$app/state'


\t// State
\tconst selector = $derived(
\t\t((clientUrl) => (
\t\t\tclientUrl instanceof arktype.errors ?
\t\t\t\tundefined
\t\t\t:
\t\t\t\t{
\t\t\t\t\tclientUrl,
\t\t\t\t}
\t\t))(UrlString(page.url.searchParams.get('url') ?? page.url.searchParams.get('u') ?? '')),
\t)

\t// Components
\timport Page from '$/components/Page.svelte'
\timport FarcasterCastView from '$/views/FarcasterCastView.svelte'
</script>


<Page>
\t{#if selector}
\t\t<FarcasterCastView
\t\t\tvariant="feed"
\t\t\tselection={select(EntityType.FarcasterCast, selector)}
\t\t/>
\t{/if}
</Page>
`

	if (shell.kind === 'nostr-profiles')
		return `<script lang="ts">
\timport { select } from '$/routes/+layout.svelte'
\t// Types/constants
\timport { EntityType } from '$/schema/EntityType.ts'


\t// Context
\timport { resolve } from '$app/paths'


\t// Components
\timport Page from '$/components/Page.svelte'
\timport NostrProfilesView from '$/views/NostrProfilesView.svelte'
</script>


<Page>
\t<NostrProfilesView
\t\thref={resolve('/nostr/profiles')}
\t\tselection={select(
\t\t\tEntityType.NostrNetwork,
\t\t\t{ scope: 'NostrNetwork' }
\t\t)}
\t\tid="nostr-profiles"
\t/>
</Page>
`

	if (shell.kind === 'nostr-reactions')
		return `<script lang="ts">
\timport { select } from '$/routes/+layout.svelte'
\t// Types/constants
\timport type { PageProps } from './$types.ts'
\timport { EntityType } from '$/schema/EntityType.ts'


\t// Context
\timport { resolve } from '$app/paths'


\tlet { data }: PageProps = $props()


\t// Components
\timport Page from '$/components/Page.svelte'
\timport NostrReactionsView from '$/views/NostrReactionsView.svelte'
</script>


<Page>
\t{#if data.noteEntitySelector}
\t\t<NostrReactionsView
\t\t\thref={resolve('/nostr/reactions')}
\t\t\tselection={select(
\t\t\tEntityType.NostrNote,
\t\t\tdata.noteEntitySelector
\t\t).$$reactions}
\t\t\tid="nostr-reactions"
\t\t\ttitle="Reactions"
\t\t/>
\t{:else}
\t\t<p data-text="muted">
\t\t\tOpen reactions for a specific note with
\t\t\t<code>?note=</code>
\t\t\tfollowed by the 64-character kind-1 event id, or navigate from a note’s reactions carousel.
\t\t</p>
\t{/if}
</Page>
`

	if (shell.kind === 'evm-contracts-index')
		return `<script lang="ts">
\t// Types/constants
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { Source } from '$/sources/Source.ts'


\t// Context
\timport { select } from '$/routes/+layout.svelte'
\timport { resolve } from '$app/paths'


\t// Components
\timport Page from '$/components/Page.svelte'
\timport EvmContractsView from '$/views/EvmContractsView.svelte'
</script>


<Page>
\t<EvmContractsView
\t\thref={resolve(
\t\t\t'/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/contracts',
\t\t\t{
\t\t\t\tcaip2: \`eip155:\`,
\t\t\t}
\t\t)}
\t\tselection={select(
\t\t\tEntityType.EvmNetwork,
\t\t\t{
\t\t\t\tcaip2: {
\t\t\t\t\tnamespace: 'eip155',
\t\t\t\t\treference: String(1),
\t\t\t\t},
\t\t\t}
\t\t).$$contracts({
\t\t\tsources: [
\t\t\t\tSource.Blockscout_Rest,
\t\t\t],
\t\t\tlimit: 16,
\t\t})}
\t\tid="contracts"
\t/>
</Page>
`

	if (shell.kind === 'services-hub')
		return `<script lang="ts">
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { select } from '$/routes/+layout.svelte'
\t// Context
\timport { resolve } from '$app/paths'


\t// Components
\timport Page from '$/components/Page.svelte'
\timport GlobalView from '$/views/GlobalView.svelte'
\timport ServicesView from '$/views/ServicesView.svelte'
</script>


<Page>
\t<GlobalView
\t\tselection={select(EntityType._Global, { scope: 'Services' })}
\t\ttitle={'Services'}
\t\thref={resolve('/services')}
\t>
\t\t{#snippet children({
\t\t\topen: hubOpen,
\t\t} = {})}
\t\t\t<ServicesView
\t\t\t\t{hubOpen}
\t\t\t/>
\t\t{/snippet}
\t</GlobalView>
</Page>
`

	if (shell.kind === 'market-detail')
		return `<script lang="ts">
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { select } from '$/routes/+layout.svelte'
\t// Types/constants
\timport { type as arktype } from 'arktype'
\timport { parse } from 'devalue'

\timport { parseEntitySelector } from '$/schema/$schema.ts'
\timport MarketSchema from '$/schema/Market.ts'
\timport { schema } from '$/schema/index.ts'


\t// State
\tlet {
\t\tparams,
\t} = $props()

\tconst route = $derived.by(() => {
\t\tconst raw = params.marketKey ?? ''
\t\tif (raw.length === 0)
\t\t\treturn {
\t\t\t\tmarketId: null,
\t\t\t\terror: 'Missing market id' as const,
\t\t\t}

\t\ttry {
\t\t\tconst marketId = parseEntitySelector(
\t\t\t\tschema,
\t\t\t\tMarketSchema,
\t\t\t\tparse(decodeURIComponent(raw)),
\t\t\t)
\t\t\tif (!(marketId instanceof arktype.errors))
\t\t\t\treturn { marketId, error: null }
\t\t} catch {
\t\t\t// fall through
\t\t}
\t\treturn {
\t\t\tmarketId: null,
\t\t\terror: 'Invalid or unsupported market id' as const,
\t\t}
\t})


\t// Components
\timport Page from '$/components/Page.svelte'
\timport MarketView from '$/views/MarketView.svelte'

</script>


<svelte:head>
\t<title>
\t\t{route.marketId != null ? \`Market\` : 'Market · not found'}
\t</title>
</svelte:head>


<Page>
\t{#if route.error != null || route.marketId == null}
\t\t<h1>
\t\t\tNot found
\t\t</h1>
\t\t<p>
\t\t\t{route.error}
\t\t</p>
\t{:else}
\t\t<MarketView
\t\t\tselection={select(EntityType.Market, route.marketId)}
\t\t/>
\t{/if}
</Page>
`

	if (shell.kind === 'coin-prices')
		return `<script lang="ts">
\timport { select } from '$/routes/+layout.svelte'
\t// Types/constants
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { Source } from '$/sources/Source.ts'


\t// Context
\timport { resolve } from '$app/paths'


\t// Components
\timport Page from '$/components/Page.svelte'
\timport MarketPricesView from '$/views/MarketPricesView.svelte'
</script>


<svelte:head>
\t<title>Spot quote index · Coins</title>
</svelte:head>


<Page>
\t<p data-text="muted">
\t\tPoint-in-time spot and index readings for catalog markets—not venue order books.
\t\tEach row opens the market pair for quote history and OHLC ranges.
\t</p>

\t<MarketPricesView
\t\thref={resolve('/markets')}
\t\tcollapsible={false}
\t\tselection={select(
\t\t\tEntityType._Global,
\t\t\t{ scope: '$$marketPrices' }
\t\t).$$marketPrices}
\t\tid="coin-prices-page"
\t\tlimit={96}
\t\tsources={[
\t\t\tSource.Constants_Internal,
\t\t\tSource.Coingecko_Rest,
\t\t\tSource.Coingecko_OpenApi,
\t\t\tSource.CoinMarketCap_Rest,
\t\t\tSource.Coinpaprika_OpenApi,
\t\t\tSource.Defillama_OpenApi,
\t\t]}
\t\ttitle="Spot quote index"
\t/>
</Page>
`

	if (shell.kind === 'farcaster-channel-detail')
		return `<script lang="ts">
\timport { select } from '$/routes/+layout.svelte'
\t// Types/constants
\timport type { EntitySelector } from '$/schema/$schema.ts'
\timport { EntityType } from '$/schema/EntityType.ts'


\t// Context
\timport { resolve } from '$app/paths'


\t// State
\tlet { params } = $props()


\t// Components
\timport Page from '$/components/Page.svelte'
\timport FarcasterCastsView from '$/views/FarcasterCastsView.svelte'
\timport FarcasterChannelView from '$/views/FarcasterChannelView.svelte'
</script>


<Page>
\t<FarcasterChannelView
\t\tselection={select(EntityType.FarcasterChannel, { id: params.channelId })}
\t/>

\t<section>
\t\t<FarcasterCastsView
\t\t\thref={resolve(
\t\t\t\t\`/farcaster/feed/channel/\${encodeURIComponent(params.channelId)}\`,
\t\t\t)}
\t\t\tselection={select(
\t\t\tEntityType.FarcasterFeed,
\t\t\t{
\t\t\t\t\tvariant: 'byChannel',
\t\t\t\t\tchannelId: params.channelId,
\t\t\t\t}
\t\t).$$entries}
\t\t\tid="casts"
\t\t\ttitle="Feed"
\t\t\tlimit={50}
\t\t/>
\t</section>
</Page>
`

	if (shell.kind === 'farcaster-user-detail')
		return `<script lang="ts">
\timport { select } from '$/routes/+layout.svelte'
\t// Types/constants
\timport type { EntitySelector } from '$/schema/$schema.ts'
\timport { EntityType } from '$/schema/EntityType.ts'


\t// Context
\timport { resolve } from '$app/paths'


\t// State
\tlet { params } = $props()


\t// Components
\timport Page from '$/components/Page.svelte'
\timport FarcasterCastsView from '$/views/FarcasterCastsView.svelte'
\timport FarcasterUserView from '$/views/FarcasterUserView.svelte'
</script>


<Page>
\t<FarcasterUserView
\t\tselection={select(EntityType.FarcasterUser, { fid: Number(params.userId) })}
\t/>

\t<section>
\t\t<FarcasterCastsView
\t\t\thref={resolve(\`/farcaster/feed/user/\${params.userId}\`)}
\t\t\tselection={select(
\t\t\tEntityType.FarcasterFeed,
\t\t\t{
\t\t\t\t\tvariant: 'byUser',
\t\t\t\t\tfid: Number(params.userId),
\t\t\t\t}
\t\t).$$entries}
\t\t\tid="casts"
\t\t\ttitle="Feed"
\t\t\tlimit={50}
\t\t/>
\t</section>
</Page>
`

	if (shell.kind === 'leverage-explainer')
		return `<script lang="ts">
\t// Context
\timport { resolve } from '$app/paths'


\t// Components
\timport Page from '$/components/Page.svelte'
\timport Tooltip from '$/components/Tooltip.svelte'
</script>


<Page>
\t<section data-column="gap-4">
\t\t<p>
\t\t\tLeverage rows model concentrated-liquidity LP position accounting on Uniswap v3-style pools—tick range, in-range liquidity, uncollected fees, and optional ERC-721 token ids.
\t\t</p>

\t\t<div data-row="wrap align-center gap-2">
\t\t\t<p data-text="muted">
\t\t\t\tNot CEX margin, borrow APR, liquidation price, or perpetual funding. No position indexer is wired yet; detail routes accept position ids when a resolver maps them.
\t\t\t</p>
\t\t\t<Tooltip contentProps={{ side: 'top' }}>
\t\t\t\t{#snippet Content()}
\t\t\t\t\t<p>
\t\t\t\t\t\tThis label “Leverage” follows the schema’s concentrated-liquidity position shape—the same fields as liquidity positions under accounts.
\t\t\t\t\t</p>
\t\t\t\t\t<p>
\t\t\t\t\t\tPool pair market stats live under liquidity pools (Dexscreener); on-chain LP NFT state requires an execution RPC or subgraph.
\t\t\t\t\t</p>
\t\t\t\t{/snippet}
\t\t\t\t<abbr
\t\t\t\t\tclass="entity-heading-tip"
\t\t\t\t\taria-label="About leverage rows"
\t\t\t\t>ⓘ</abbr>
\t\t\t</Tooltip>
\t\t</div>

\t\t<p>
\t\t\t<a href={resolve('/~/accounts/positions')}>Browse LP positions</a>
\t\t\t<span data-text="muted"> (catalog empty until indexed)</span>
\t\t</p>
\t</section>
</Page>
`

	if (shell.kind === 'virtual-list-demo')
		return `<script lang="ts">
\t// Types/constants
\ttype Row = {
\t\tid: string
\t\ttext: string
\t}


\t// Components
\timport VirtualList from '$/components/VirtualList.svelte'
</script>


<section
\tclass="virtual-list-demo"
\tdata-card
>
\t<h2>
\t\tVirtualList + Pretext
\t</h2>

\t<p data-text="annotation">
\t\t<code>@chenglou/pretext</code>
\t\t<code>prepare</code>
\t\t/
\t\t<code>layout</code>
\t\tfor row heights; official variable-height demos:
\t\t<a href="https://chenglou.me/pretext/">chenglou.me/pretext</a>
\t</p>

\t<VirtualList
\t\tclass="virtual-list-demo-viewport"
\t\titems={Array.from(
\t\t\t{
\t\t\t\tlength: 400,
\t\t\t},
\t\t\t(_, i) => (
\t\t\t\t{
\t\t\t\t\tid: String(i),
\t\t\t\t\ttext: \`Row \${i}: \${'Lorem ipsum dolor sit amet. '.repeat(2 + (i % 5))}\`,
\t\t\t\t} satisfies Row
\t\t\t),
\t\t)}
\t\tfont="16px Ubuntu, system-ui, sans-serif"
\t\tgetKey={(row) => row.id}
\t\tgetMeasureText={(row) => row.text}
\t\tlineHeight={22}
\t\titemGap={8}
\t\trowInsetBlock={4}
\t>
\t\t{#snippet Item({
\t\t\titem,
\t\t\tindex,
\t\t})}
\t\t\t<p class="virtual-list-demo-line">
\t\t\t\t<span data-text="annotation">
\t\t\t\t\t{String(index)}
\t\t\t\t</span>
\t\t\t\t{item.text}
\t\t\t</p>
\t\t{/snippet}
\t</VirtualList>
</section>


<style>
\t.virtual-list-demo {
\t\tdisplay: flex;
\t\tflex-direction: column;
\t\tgap: 1rem;
\t\tmin-height: 0;
\t}

\t:global(.virtual-list-demo-viewport) {
\t\tflex: 1;
\t\tmin-height: 50vh;
\t\tmax-height: 70vh;
\t\tborder: 1px solid color-mix(in oklab, CanvasText 12%, transparent);
\t}

\t.virtual-list-demo-line {
\t\tmargin: 0;
\t\tfont: 16px/22px Ubuntu, system-ui, sans-serif;
\t\toverflow: hidden;
\t}
</style>
`

	if (shell.kind === 'list-view-transitions-demo')
		return `<script lang="ts">
\t// Types/constants
\ttype Row = { id: string, label: string }


\tconst items: Row[] = [
\t\t{ id: 'a', label: 'Alpha' },
\t\t{ id: 'b', label: 'Bravo' },
\t\t{ id: 'c', label: 'Candle' },
\t]

\tconst sortOptions: Sort<Row, 'asc' | 'desc'>[] = [
\t\t{
\t\t\tid: 'asc',
\t\t\tlabel: 'A–Z',
\t\t\tcompare: (x, y) => x.label.localeCompare(y.label),
\t\t},
\t\t{
\t\t\tid: 'desc',
\t\t\tlabel: 'Z–A',
\t\t\tcompare: (x, y) => y.label.localeCompare(x.label),
\t\t},
\t]


\t// Components
\timport type { Sort } from '$/components/RefinableList.svelte'
\timport RefinableList from '$/components/RefinableList.svelte'
</script>


<main
\tdata-testid="list-vt-demo"
\tdata-column
>
\t<h1>List view transitions (demo${shell.routePath === 'demo/list-view-transitions-novt' ? ', disabled' : ''})</h1>

\t<RefinableList
\t\t{items}
\t\tgetKey={(row) => row.id}
\t\tgetSearchText={(row) => row.label}
\t\t{sortOptions}
\t\tdefaultSortId="asc"
\t\tsearchPlaceholder="Filter"${shell.routePath === 'demo/list-view-transitions-novt' ? '\n\t\tlistViewTransition={false}' : ''}
\t>
\t\t{#snippet ItemPlaceholder()}
\t\t\t<span>…</span>
\t\t{/snippet}

\t\t{#snippet Item({ item })}
\t\t\t<span data-testid="row-label">{item.label}</span>
\t\t{/snippet}
\t</RefinableList>
</main>
`

	if (shell.kind === 'assets-hub')
		return `<script lang="ts">
\timport { select } from '$/routes/+layout.svelte'
\t// Types/constants
\timport { EntityType } from '$/schema/EntityType.ts'


\t// Context
\timport { resolve } from '$app/paths'


\tconst hubKey = 'assets'


\t// Components
\timport CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
\timport HeadingComponent from '$/components/Heading.svelte'
\timport Page from '$/components/Page.svelte'
\timport CoinsView from '$/views/CoinsView.svelte'
\timport CurrenciesView from '$/views/CurrenciesView.svelte'
\timport GlobalView from '$/views/GlobalView.svelte'
\timport LiquidityPoolsView from '$/views/LiquidityPoolsView.svelte'
</script>


<Page>
\t<GlobalView
\t\tselection={select(EntityType._Global, { scope: 'Assets' })}
\t\ttitle="Assets"
\t\thref={resolve('/assets')}
\t\topen
\t>
\t\t{#snippet children({ open: hubOpen,
\t\t})}
\t\t\t<CollapsibleTabs
\t\t\t\tid={\`\${hubKey}:hub\`}
\t\t\t\tsectionIdPrefix={hubKey}
\t\t\t\tsections={[
\t\t\t\t\t{ id: 'coins', label: 'Coins' },
\t\t\t\t\t{ id: 'currencies', label: 'Currencies' },
\t\t\t\t\t{ id: 'pools', label: 'Pools' },
\t\t\t\t]}
\t\t\t\tdata-card
\t\t\t\tscrollContainerProps={{
\t\t\t\t\t'data-row': 'start align-start',
\t\t\t\t\tstyle: '--carousel-basis: 40ch',
\t\t\t\t}}
\t\t\t>
\t\t\t\t{#snippet Summary({ open: _summaryOpen })}
\t\t\t\t\t<header
\t\t\t\t\t\tdata-row-item="flexible"
\t\t\t\t\t\tdata-row="wrap gap-4"
\t\t\t\t\t>
\t\t\t\t\t\t<HeadingComponent>
\t\t\t\t\t\t\tAssets
\t\t\t\t\t\t</HeadingComponent>
\t\t\t\t\t</header>
\t\t\t\t{/snippet}

\t\t\t\t{#snippet SectionCoins({ id, label })}
\t\t\t\t\t<CoinsView
\t\t\t\t\t\thref={resolve('/coins')}
\t\t\t\t\t\tselection={select(
\t\t\tEntityType._Global,
\t\t\t{ scope: '$$coins' }
\t\t).$$coins}
\t\t\t\t\t\tid="coins"
\t\t\t\t\t\tlimit={120}
\t\t\t\t\t\topen={hubOpen}
\t\t\t\t\t/>
\t\t\t\t{/snippet}

\t\t\t\t{#snippet SectionCurrencies({ id, label })}
\t\t\t\t\t<CurrenciesView
\t\t\t\t\t\thref={resolve('/currencies')}
\t\t\t\t\t\tselection={select(
\t\t\tEntityType._Global,
\t\t\t{ scope: '$$currencies' }
\t\t).$$currencies}
\t\t\t\t\t\topen={hubOpen}
\t\t\t\t\t/>
\t\t\t\t{/snippet}

\t\t\t\t{#snippet SectionPools({ id, label })}
\t\t\t\t\t<LiquidityPoolsView
\t\t\t\t\t\thref={resolve('/pools')}
\t\t\t\t\t\tselection={select(
\t\t\tEntityType._Global,
\t\t\t{ scope: '$$liquidityPools' }
\t\t).$$liquidityPools}
\t\t\t\t\t\tid="pools"
\t\t\t\t\t\topen={false}
\t\t\t\t\t/>
\t\t\t\t{/snippet}
\t\t</CollapsibleTabs>
\t\t{/snippet}
\t</GlobalView>
</Page>
`

	if (shell.kind === 'explore-hub')
		return `<script lang="ts">
\t// Types/constants
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { Source } from '$/sources/Source.ts'


\t// Context
\timport { select } from '$/routes/+layout.svelte'
\timport { resolve } from '$app/paths'


\tconst hubKey = 'explore'


\t// Components
\timport CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
\timport HeadingComponent from '$/components/Heading.svelte'
\timport Page from '$/components/Page.svelte'
\timport GlobalView from '$/views/GlobalView.svelte'
\timport NetworksView from '$/views/NetworksView.svelte'
\timport EthereumNetworkUpgradesView from '$/views/EthereumNetworkUpgradesView.svelte'
\timport SpecificationRealmsView from '$/views/SpecificationRealmsView.svelte'
</script>


<Page>
\t<GlobalView
\t\tselection={select(EntityType._Global, { scope: 'Explore' })}
\t\ttitle="Explore"
\t\thref={resolve('/explore')}
\t>
\t\t{#snippet children({ open: hubOpen,
\t\t})}
\t\t\t<CollapsibleTabs
\t\t\t\tid={\`\${hubKey}:hub\`}
\t\t\t\tsectionIdPrefix={hubKey}
\t\t\t\tsections={[
\t\t\t\t\t{ id: 'networks', label: 'Networks' },
\t\t\t\t\t{ id: 'upgrades', label: 'Upgrades' },
\t\t\t\t\t{ id: 'ipfs', label: 'IPFS' },
\t\t\t\t\t{ id: 'swarm', label: 'Swarm' },
\t\t\t\t\t{ id: 'proposals', label: 'Proposals' },
\t\t\t\t]}
\t\t\t\tdata-card
\t\t\t\tscrollContainerProps={{
\t\t\t\t\t'data-row': 'start align-start',
\t\t\t\t\tstyle: '--carousel-basis: 40ch',
\t\t\t\t}}
\t\t\t>
\t\t\t\t{#snippet Summary({ open: _summaryOpen })}
\t\t\t\t\t<header
\t\t\t\t\t\tdata-row-item="flexible"
\t\t\t\t\t\tdata-row="wrap gap-4"
\t\t\t\t\t>
\t\t\t\t\t\t<HeadingComponent>
\t\t\t\t\t\t\tExplore
\t\t\t\t\t\t</HeadingComponent>
\t\t\t\t\t</header>
\t\t\t\t{/snippet}

\t\t\t\t{#snippet SectionNetworks({ id, label })}
\t\t\t\t\t<NetworksView
\t\t\t\t\t\thref={resolve('/networks')}
\t\t\t\t\t\tselection={select(
\t\t\tEntityType._Global,
\t\t\t{ scope: '$$networks' }
\t\t).$$networks}
\t\t\t\t\t\tid="networks"
\t\t\t\t\t\topen={hubOpen}
\t\t\t\t\t/>
\t\t\t\t{/snippet}

\t\t\t\t{#snippet SectionUpgrades({ id, label })}
\t\t\t\t\t<EthereumNetworkUpgradesView
\t\t\t\t\t\tselection={select(
\t\t\t\t\t\t\tEntityType._Global,
\t\t\t\t\t\t\t{ scope: '$$networkUpgrades' }
\t\t\t\t\t\t).$$networkUpgrades({
\t\t\t\t\t\t\tsources: [
\t\t\t\t\t\t\t\tSource.Constants_Internal,
\t\t\t\t\t\t\t],
\t\t\t\t\t\t\tlimit: 512,
\t\t\t\t\t\t})}
\t\t\t\t\t\tid="upgrades"
\t\t\t\t\t\topen={hubOpen}
\t\t\t\t\t/>
\t\t\t\t{/snippet}

\t\t\t\t{#snippet SectionIpfs({ id, label })}
\t\t\t\t\t<h2>
\t\t\t\t\t\t<a href={resolve('/ipfs')}>IPFS</a>
\t\t\t\t\t</h2>

\t\t\t\t\t<p data-text="muted">
\t\t\t\t\tOpen resolver-backed IPFS and IPNS resource pages from raw CIDs, protocol URIs, or public gateway URLs.
\t\t\t\t</p>
\t\t\t{/snippet}

\t\t\t{#snippet SectionSwarm({ id, label })}
\t\t\t\t<h2>
\t\t\t\t\t<a href={resolve('/swarm')}>Swarm</a>
\t\t\t\t</h2>

\t\t\t\t<p data-text="muted">
\t\t\t\t\tOpen resolver-backed Swarm BZZ resource pages from raw references, \`bzz://\` URIs, or public gateway URLs.
\t\t\t\t</p>
\t\t\t{/snippet}

\t\t\t{#snippet SectionProposals({ id, label })}
\t\t\t\t\t<SpecificationRealmsView
\t\t\t\t\t\tselection={select(
\t\t\t\tEntityType._Global,
\t\t\t\t{ scope: '$$specificationRealms' }
\t\t\t).$$specificationRealms({
\t\t\t\tsources: [
\t\t\t\t\tSource.Constants_Internal,
\t\t\t\t],
\t\t\t})}
\t\t\t\t\t\tid="proposal-realms"
\t\t\t\t\t\topen={hubOpen}
\t\t\t\t\t\ttitle="Proposals"
\t\t\t\t/>
\t\t\t{/snippet}
\t\t</CollapsibleTabs>
\t\t{/snippet}
\t</GlobalView>
</Page>
`

	if (shell.kind === 'social-hub') {
		if (shell.socialProtocolGroups === undefined)
			throw new Error(`Missing social protocol groups for ${shell.routePath}`)

		return `<script lang="ts">
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { select } from '$/routes/+layout.svelte'
\t// Context
\timport { resolve } from '$app/paths'


\tconst hubKey = 'social'

\tconst socialProtocolGroups = [
${shell.socialProtocolGroups.map((group) => `\t\t{
\t\t\tlabel: '${group.label}',
\t\t\thubRoute: '${group.hubRoute}',
\t\t\tlists: [
${group.lists.map((list) => `\t\t\t\t{ label: '${list.label}', route: '${list.route}' },`).join('\n')}
\t\t\t],
\t\t},`).join('\n')}
\t] as const satisfies readonly {
\t\tlabel: string
\t\thubRoute: string
\t\tlists: readonly {
\t\t\tlabel: string
\t\t\troute: string
\t\t}[]
\t}[]


\t// Components
\timport CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
\timport HeadingComponent from '$/components/Heading.svelte'
\timport Page from '$/components/Page.svelte'
\timport FarcasterView from '$/views/FarcasterView.svelte'
\timport GlobalView from '$/views/GlobalView.svelte'
</script>


<Page>
\t<GlobalView
\t\tselection={select(EntityType._Global, { scope: 'Social' })}
\t\ttitle="Social"
\t\thref={resolve('/social')}
\t>
\t\t{#snippet children({ open: hubOpen,
\t\t})}
\t\t\t<CollapsibleTabs
\t\t\t\tid={\`\${hubKey}:hub\`}
\t\t\t\tsectionIdPrefix={hubKey}
\t\t\t\tsections={[
\t\t\t\t\t{ id: 'protocols', label: 'Protocols' },
\t\t\t\t\t{ id: 'farcaster', label: 'Farcaster' },
\t\t\t\t]}
\t\t\t\tdata-card
\t\t\t\tscrollContainerProps={{
\t\t\t\t\t'data-row': 'start align-start',
\t\t\t\t\tstyle: '--carousel-basis: 40ch',
\t\t\t\t}}
\t\t\t>
\t\t\t\t{#snippet Summary({ open: _summaryOpen })}
\t\t\t\t\t<header
\t\t\t\t\t\tdata-row-item="flexible"
\t\t\t\t\t\tdata-row="wrap gap-4"
\t\t\t\t\t>
\t\t\t\t\t\t<HeadingComponent>
\t\t\t\t\t\t\tSocial
\t\t\t\t\t\t</HeadingComponent>
\t\t\t\t\t</header>
\t\t\t\t{/snippet}

\t\t\t\t{#snippet SectionProtocols({ id, label })}
\t\t\t\t\t<h2>Protocols & networks</h2>
\t\t\t\t\t<ul class="social-protocol-groups">
\t\t\t\t\t\t{#each socialProtocolGroups as { label, hubRoute, lists } (hubRoute)}
\t\t\t\t\t\t\t<li>
\t\t\t\t\t\t\t\t<a href={resolve(hubRoute)}>{label}</a>
\t\t\t\t\t\t\t\t<ul>
\t\t\t\t\t\t\t\t\t{#each lists as { label: listLabel, route } (route)}
\t\t\t\t\t\t\t\t\t\t<li>
\t\t\t\t\t\t\t\t\t\t\t<a href={resolve(route)}>{listLabel}</a>
\t\t\t\t\t\t\t\t\t\t</li>
\t\t\t\t\t\t\t\t\t{/each}
\t\t\t\t\t\t\t\t</ul>
\t\t\t\t\t\t\t</li>
\t\t\t\t\t\t{/each}
\t\t\t\t\t\t<li>
\t\t\t\t\t\t\t<a href={resolve('/(social)/(farcaster)/farcaster')}>Farcaster (feed / hub)</a>
\t\t\t\t\t\t\t<ul>
\t\t\t\t\t\t\t\t<li>
\t\t\t\t\t\t\t\t\t<a href={resolve('/farcaster/accounts')}>Accounts</a>
\t\t\t\t\t\t\t\t</li>
\t\t\t\t\t\t\t\t<li>
\t\t\t\t\t\t\t\t\t<a href={resolve('/farcaster/feed')}>Feed</a>
\t\t\t\t\t\t\t\t</li>
\t\t\t\t\t\t\t\t<li>
\t\t\t\t\t\t\t\t\t<a href={resolve('/farcaster/channels')}>Channels</a>
\t\t\t\t\t\t\t\t</li>
\t\t\t\t\t\t\t\t<li>
\t\t\t\t\t\t\t\t\t<a href={resolve('/farcaster/users')}>Users</a>
\t\t\t\t\t\t\t\t</li>
\t\t\t\t\t\t\t</ul>
\t\t\t\t\t\t</li>
\t\t\t\t\t</ul>
\t\t\t\t{/snippet}

\t\t\t\t{#snippet SectionFarcaster({ id, label })}
\t\t\t\t\t<FarcasterView
\t\t\t\t\t\tselection={select(EntityType.FarcasterNetwork, {
\t\t\t\t\t\t\tscope: 'FarcasterNetwork',
\t\t\t\t\t\t})}
\t\t\t\t\t\topen={hubOpen}
\t\t\t\t\t/>
\t\t\t\t{/snippet}
\t\t\t</CollapsibleTabs>
\t\t{/snippet}
\t</GlobalView>
</Page>


<style>
\t.social-protocol-groups {
\t\t> li {
\t\t\t> ul {
\t\t\t\tmargin-block: 0.25em 0.75em;
\t\t\t\tpadding-inline-start: 1.25em;
\t\t\t}
\t\t}
\t}
</style>
`
	}

	if (shell.kind === 'networks-architecture-hub') {
		if (shell.networkArchitectureSections === undefined)
			throw new Error(`Missing network architecture sections for ${shell.routePath}`)

		return `<script lang="ts">
\timport { select } from '$/routes/+layout.svelte'
\t// Types/constants
\timport { EntityType } from '$/schema/EntityType.ts'


\t// Context
\timport { resolve } from '$app/paths'


\t// Components
\timport CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
\timport EvmNetworksView from '$/views/EvmNetworksView.svelte'
\timport Page from '$/components/Page.svelte'
\timport NetworksView from '$/views/NetworksView.svelte'
</script>


<Page>
\t<CollapsibleTabs
\t\topen
\t\tsectionIdPrefix="network-architecture"
\t\tsections={collapsibleTabsSections([
\t\t\t{ id: 'evm', label: 'EVM' },
${shell.networkArchitectureSections.map((section) => `\t\t\t{ id: '${section.id}', label: '${section.label}' },`).join('\n')}
\t\t])}
\t\tdata-card
\t\tscrollContainerProps={{
\t\t\t'data-scroll-container': 'block',
\t\t}}
\t>
\t\t{#snippet Summary({ open: _summaryOpen })}
\t\t\t<header
\t\t\t\tdata-row-item="flexible"
\t\t\t\tdata-row="wrap gap-4"
\t\t\t>
\t\t\t\t<h1>
\t\t\t\t\t<a href={resolve('/networks')}>Networks</a>
\t\t\t\t</h1>
\t\t\t</header>
\t\t{/snippet}

\t\t{#snippet Annotation({ open: _annotationOpen })}
\t\t\t<span data-text="annotation">Architectures</span>
\t\t{/snippet}

\t\t{#snippet SectionEvm({ id: _id, label: _label })}
\t\t\t<EvmNetworksView
\t\t\t\thref={resolve('/networks')}
\t\t\t\tselection={select(
\t\t\tEntityType._Global,
\t\t\t{ scope: '$$networks' }
\t\t).$$evmNetworks}
\t\t\t\tid="networks:evm"
\t\t\t\topen
\t\t\t/>
\t\t{/snippet}
${shell.networkArchitectureSections.map((section, index) => `${index === 0 ? '' : '\n'}
\t\t{#snippet ${section.snippet}({ id: _id, label: label })}
\t\t\t<NetworksView
\t\t\t\thref={resolve('/networks')}
\t\t\t\tselection={select(
\t\t\tEntityType._Global,
\t\t\t{ scope: '$$networks' }
\t\t).$$networks}
\t\t\t\tid="networks:${section.id}"
\t\t\t\tnetworkSelectors={[{ slug: '${section.slug}' }]}
\t\t\t\topen
\t\t\t\ttitle={label}
\t\t\t/>
\t\t{/snippet}`).join('')}
\t</CollapsibleTabs>
</Page>
`
	}

	if (shell.kind === 'network-slug-lightning-collection') {
		const routeName = shell.routePath.split('/').at(-1) ?? ''
		const config = (
			routeName === 'channels' ? {
				viewComponent: 'LightningChannelsView',
				field: '$$channels',
				sources: [
					'LightningMempoolSpace_Rest',
					'LightningLnd_Rest',
				],
				article: 'a',
				blankBeforeState: false,
			}
			: routeName === 'invoices' ? {
				viewComponent: 'BlockheadLightningInvoicesView',
				field: '$$invoices',
				sources: [
					'LightningLnd_Rest',
				],
				article: 'an',
				blankBeforeState: true,
			}
			: routeName === 'nodes' ? {
				viewComponent: 'LightningNodesView',
				field: '$$nodes',
				sources: [
					'LightningMempoolSpace_Rest',
					'LightningLnd_Rest',
				],
				article: 'a',
				blankBeforeState: false,
			}
			: {
				viewComponent: 'BlockheadLightningPaymentsView',
				field: '$$payments',
				sources: [
					'LightningLnd_Rest',
				],
				article: 'a',
				blankBeforeState: false,
			}
		)

		return `<script lang="ts">
\t// Types/constants
\timport type { PageProps } from './$types'
\timport { NetworkNamespace } from '$/constants/Network.ts'
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { Source } from '$/sources/Source.ts'


\t// Context
\timport { resolve } from '$app/paths'
\timport { select } from '$/routes/+layout.svelte'
${config.blankBeforeState ? '\n\n' : ''}\t// State
\tlet {
\t\tparams,
\t}: PageProps = $props()
${config.blankBeforeState ? '\n' : ''}
\tconst network = $derived(select(EntityType.Network,
\t\t{
\t\t\tslug: params.networkSlug,
\t\t},
\t\t({ sources: [
\t\t\t\tSource.Constants_Internal,
\t\t\t], fields: { namespace: true, slug: true } }),
\t))


\t// Components
\timport Page from '$/components/Page.svelte'
\timport ResourceBoundary from '$/components/ResourceBoundary.svelte'
\timport ${config.viewComponent} from '$/views/${config.viewComponent}.svelte'
</script>


<Page>
\t<ResourceBoundary resource={network}>
\t\t{#snippet children(network)}
\t\t\t{#if network.namespace === NetworkNamespace.Lightning}
\t\t\t\t<${config.viewComponent}
\t\t\t\t\tselection={select(
\t\t\t\t\t\tEntityType.LightningNetwork,
\t\t\t\t\t\t{
\t\t\t\t\t\t\t$network: {
\t\t\t\t\t\t\t\tslug: params.networkSlug,
\t\t\t\t\t\t\t},
\t\t\t\t\t\t}
\t\t\t\t\t).${config.field}({
\t\t\t\t\t\tsources: [
${config.sources.map((source) => `\t\t\t\t\t\t\tSource.${source},`).join('\n')}
\t\t\t\t\t\t],
\t\t\t\t\t\tlimit: 32,
\t\t\t\t\t})}
\t\t\t\t\thref={resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/${routeName}', {
\t\t\t\t\t\tnetworkSlug: params.networkSlug,
\t\t\t\t\t})}
\t\t\t\t\tid="${routeName}"
\t\t\t\t/>
\t\t\t{:else}
\t\t\t\t<p data-text="muted">This network does not expose ${config.article} ${routeName} route yet.</p>
\t\t\t{/if}
\t\t{/snippet}
\t</ResourceBoundary>
</Page>
`
	}

	if (shell.kind === 'network-slug-lightning-channel-detail')
		return `<script lang="ts">
\t// Types/constants
\timport type { PageProps } from './$types'
\timport { NetworkNamespace } from '$/constants/Network.ts'
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { Source } from '$/sources/Source.ts'


\t// Context
\timport { select } from '$/routes/+layout.svelte'


\t// State
\tlet {
\t\tparams,
\t}: PageProps = $props()

\tconst network = $derived(select(EntityType.Network,
\t\t{
\t\t\tslug: params.networkSlug,
\t\t},
\t\t({ sources: [
\t\t\t\tSource.Constants_Internal,
\t\t\t], fields: { namespace: true, slug: true } }),
\t))


\t// Components
\timport Page from '$/components/Page.svelte'
\timport ResourceBoundary from '$/components/ResourceBoundary.svelte'
\timport LightningChannelView from '$/views/LightningChannelView.svelte'
</script>


<Page>
\t<ResourceBoundary resource={network}>
\t\t{#snippet children(network)}
\t\t\t{#if network.namespace === NetworkNamespace.Lightning}
\t\t\t\t<LightningChannelView
\t\t\t\t\tselection={select(EntityType.LightningChannel, {
\t\t\t\t\t\t$network: { slug: params.networkSlug },
\t\t\t\t\t\tchannelId: params.channelId,
\t\t\t\t\t})}
\t\t\t\t/>
\t\t\t{:else}
\t\t\t\t<p data-text="muted">This network does not expose a channel detail route yet.</p>
\t\t\t{/if}
\t\t{/snippet}
\t</ResourceBoundary>
</Page>
`

	if (shell.kind === 'network-slug-cosmos-governance')
		return `<script lang="ts">
\t// Types/constants
\timport type { PageProps } from './$types'
\timport { NetworkNamespace } from '$/constants/Network.ts'
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { Source } from '$/sources/Source.ts'


\t// Context
\timport { resolve } from '$app/paths'
\timport { select } from '$/routes/+layout.svelte'
\t// State
\tlet {
\t\tparams,
\t}: PageProps = $props()

\tconst network = $derived(select(EntityType.Network,
\t\t{
\t\t\tslug: params.networkSlug,
\t\t},
\t\t({ sources: [
\t\t\t\tSource.Constants_Internal,
\t\t\t], fields: { namespace: true, slug: true } }),
\t))


\t// Components
\timport Page from '$/components/Page.svelte'
\timport ResourceBoundary from '$/components/ResourceBoundary.svelte'
\timport CosmosGovernanceProposalsView from '$/views/CosmosGovernanceProposalsView.svelte'
</script>


<Page>
\t<ResourceBoundary resource={network}>
\t\t{#snippet children(network)}
\t\t\t{#if network.namespace === NetworkNamespace.Cosmos}
\t\t\t\t<CosmosGovernanceProposalsView
\t\t\t\t\tselection={select(
\t\t\t\t\t\tEntityType.CosmosNetwork,
\t\t\t\t\t\t{
\t\t\t\t\t\t\t$network: {
\t\t\t\t\t\t\t\tslug: params.networkSlug,
\t\t\t\t\t\t\t},
\t\t\t\t\t\t}
\t\t\t\t\t).$$governanceProposals({
\t\t\t\t\t\tsources: [
\t\t\t\t\t\t\tSource.CosmosSdk_Rest,
\t\t\t\t\t\t],
\t\t\t\t\t\tlimit: 32,
\t\t\t\t\t})}
\t\t\t\t\thref={resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/governance', {
\t\t\t\t\t\tnetworkSlug: params.networkSlug,
\t\t\t\t\t})}
\t\t\t\t\tid="governance"
\t\t\t\t\ttitle="Governance"
\t\t\t\t/>
\t\t\t{:else}
\t\t\t\t<p data-text="muted">This network does not expose a governance route yet.</p>
\t\t\t{/if}
\t\t{/snippet}
\t</ResourceBoundary>
</Page>
`

	if (shell.kind === 'network-slug-blocks')
		return `<script lang="ts">
\t// Types/constants
\timport type { PageProps } from './$types'
\timport { NetworkNamespace } from '$/constants/Network.ts'
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { Source } from '$/sources/Source.ts'


\t// Context
\timport { resolve } from '$app/paths'
\timport { select } from '$/routes/+layout.svelte'
\t// State
\tlet {
\t\tparams,
\t}: PageProps = $props()

\tconst network = $derived(select(EntityType.Network,
\t\t{
\t\t\tslug: params.networkSlug,
\t\t},
\t\t({ sources: [
\t\t\t\tSource.Constants_Internal,
\t\t\t], fields: { caip2: true, namespace: true, slug: true } }),
\t))


\t// Components
\timport Page from '$/components/Page.svelte'
\timport ResourceBoundary from '$/components/ResourceBoundary.svelte'
\timport BittensorBlocksView from '$/views/BittensorBlocksView.svelte'
\timport CosmosBlocksView from '$/views/CosmosBlocksView.svelte'
\timport FilecoinTipsetsView from '$/views/FilecoinTipsetsView.svelte'
\timport HyperliquidBlocksView from '$/views/HyperliquidBlocksView.svelte'
\timport MoneroBlocksView from '$/views/MoneroBlocksView.svelte'
\timport NearBlocksView from '$/views/NearBlocksView.svelte'
\timport PolkadotBlocksView from '$/views/PolkadotBlocksView.svelte'
\timport SolanaBlocksView from '$/views/SolanaBlocksView.svelte'
\timport TronBlocksView from '$/views/TronBlocksView.svelte'
\timport UtxoBlocksView from '$/views/UtxoBlocksView.svelte'
\timport ZeroGBlocksView from '$/views/ZeroGBlocksView.svelte'
</script>


<Page>
\t<ResourceBoundary resource={network}>
\t\t{#snippet children(network)}
\t\t\t{@const href = resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/blocks', {
\t\t\t\tnetworkSlug: params.networkSlug,
\t\t\t})}
\t\t\t{#if network.namespace === NetworkNamespace.Bitcoin || network.namespace === NetworkNamespace.BitcoinCash || network.namespace === NetworkNamespace.Litecoin || network.namespace === NetworkNamespace.Dogecoin || network.namespace === NetworkNamespace.Zcash}
\t\t\t\t<UtxoBlocksView
\t\t\t\t\tselection={select(
\t\t\t\t\t\tEntityType.UtxoNetwork,
\t\t\t\t\t\t{
\t\t\t\t\t\t\t$network: network.caip2 == null ?
\t\t\t\t\t\t\t\t{ slug: params.networkSlug }
\t\t\t\t\t\t\t:
\t\t\t\t\t\t\t\t{ caip2: network.caip2 },
\t\t\t\t\t\t}
\t\t\t\t\t).$$blocks({
\t\t\t\t\t\tlimit: 16,
\t\t\t\t\t})}
\t\t\t\t\t{href}
\t\t\t\t\tid="blocks"
\t\t\t\t/>
\t\t\t{:else if network.namespace === NetworkNamespace.Solana && network.caip2 != null}
\t\t\t\t<SolanaBlocksView
\t\t\t\t\tselection={select(
\t\t\t\t\t\tEntityType.SolanaNetwork,
\t\t\t\t\t\t{
\t\t\t\t\t\t\tcaip2: {
\t\t\t\t\t\t\t\tnamespace: 'solana',
\t\t\t\t\t\t\t\treference: network.caip2.reference,
\t\t\t\t\t\t\t},
\t\t\t\t\t\t}
\t\t\t\t\t).$$blocks({
\t\t\t\t\t\tlimit: 16,
\t\t\t\t\t})}
\t\t\t\t\t{href}
\t\t\t\t\tid="blocks"
\t\t\t\t/>
\t\t\t{:else if network.namespace === NetworkNamespace.Cosmos}
\t\t\t\t<CosmosBlocksView
\t\t\t\t\tselection={select(
\t\t\t\t\t\tEntityType.CosmosNetwork,
\t\t\t\t\t\t{
\t\t\t\t\t\t\t$network: network.caip2 == null ?
\t\t\t\t\t\t\t\t{ slug: params.networkSlug }
\t\t\t\t\t\t\t:
\t\t\t\t\t\t\t\t{ caip2: network.caip2 },
\t\t\t\t\t\t}
\t\t\t\t\t).$$blocks({
\t\t\t\t\t\tlimit: 16,
\t\t\t\t\t})}
\t\t\t\t\t{href}
\t\t\t\t\tid="blocks"
\t\t\t\t/>
\t\t\t{:else if network.namespace === NetworkNamespace.Filecoin}
\t\t\t\t<FilecoinTipsetsView
\t\t\t\t\tselection={select(
\t\t\t\t\t\tEntityType.FilecoinNetwork,
\t\t\t\t\t\t{
\t\t\t\t\t\t\t$network: network.caip2 == null ?
\t\t\t\t\t\t\t\t{ slug: params.networkSlug }
\t\t\t\t\t\t\t:
\t\t\t\t\t\t\t\t{ caip2: network.caip2 },
\t\t\t\t\t\t}
\t\t\t\t\t).$$tipsets({
\t\t\t\t\t\tlimit: 16,
\t\t\t\t\t})}
\t\t\t\t\t{href}
\t\t\t\t\tid="blocks"
\t\t\t\t\ttitle="Tipsets"
\t\t\t\t/>
\t\t\t{:else if network.namespace === NetworkNamespace.Polkadot}
\t\t\t\t<PolkadotBlocksView
\t\t\t\t\tselection={select(
\t\t\t\t\t\tEntityType.PolkadotNetwork,
\t\t\t\t\t\t{
\t\t\t\t\t\t\t$network: network.caip2 == null ?
\t\t\t\t\t\t\t\t{ slug: params.networkSlug }
\t\t\t\t\t\t\t:
\t\t\t\t\t\t\t\t{ caip2: network.caip2 },
\t\t\t\t\t\t}
\t\t\t\t\t).$$blocks({
\t\t\t\t\t\tlimit: 16,
\t\t\t\t\t})}
\t\t\t\t\t{href}
\t\t\t\t\tid="blocks"
\t\t\t\t/>
\t\t\t{:else if network.namespace === NetworkNamespace.Near}
\t\t\t\t<NearBlocksView
\t\t\t\t\tselection={select(
\t\t\t\t\t\tEntityType.NearNetwork,
\t\t\t\t\t\t{ slug: 'near' }
\t\t\t\t\t).$$blocks({
\t\t\t\t\t\tlimit: 16,
\t\t\t\t\t})}
\t\t\t\t\t{href}
\t\t\t\t\tid="blocks"
\t\t\t\t/>
\t\t\t{:else if network.namespace === NetworkNamespace.Tron}
\t\t\t\t<TronBlocksView
\t\t\t\t\tselection={select(
\t\t\t\t\t\tEntityType.TronNetwork,
\t\t\t\t\t\t{
\t\t\t\t\t\t\t$network: network.caip2 == null ?
\t\t\t\t\t\t\t\t{ slug: params.networkSlug }
\t\t\t\t\t\t\t:
\t\t\t\t\t\t\t\t{ caip2: network.caip2 },
\t\t\t\t\t\t}
\t\t\t\t\t).$$blocks({
\t\t\t\t\t\tlimit: 16,
\t\t\t\t\t})}
\t\t\t\t\t{href}
\t\t\t\t\tid="blocks"
\t\t\t\t/>
\t\t\t{:else if network.namespace === NetworkNamespace.Monero}
\t\t\t\t<MoneroBlocksView
\t\t\t\t\tselection={select(
\t\t\t\t\t\tEntityType.MoneroNetwork,
\t\t\t\t\t\t{
\t\t\t\t\t\t\t$network: network.caip2 == null ?
\t\t\t\t\t\t\t\t{ slug: params.networkSlug }
\t\t\t\t\t\t\t:
\t\t\t\t\t\t\t\t{ caip2: network.caip2 },
\t\t\t\t\t\t}
\t\t\t\t\t).$$blocks({
\t\t\t\t\t\tlimit: 16,
\t\t\t\t\t})}
\t\t\t\t\t{href}
\t\t\t\t\tid="blocks"
\t\t\t\t/>
\t\t\t{:else if network.namespace === NetworkNamespace.Hyperliquid}
\t\t\t\t<HyperliquidBlocksView
\t\t\t\t\tselection={select(
\t\t\t\t\t\tEntityType.HyperliquidNetwork,
\t\t\t\t\t\t{
\t\t\t\t\t\t\t$network: network.caip2 == null ?
\t\t\t\t\t\t\t\t{ slug: params.networkSlug }
\t\t\t\t\t\t\t:
\t\t\t\t\t\t\t\t{ caip2: network.caip2 },
\t\t\t\t\t\t}
\t\t\t\t\t).$$blocks({
\t\t\t\t\t\tlimit: 16,
\t\t\t\t\t})}
\t\t\t\t\t{href}
\t\t\t\t\tid="blocks"
\t\t\t\t/>
\t\t\t{:else if network.namespace === NetworkNamespace.Bittensor}
\t\t\t\t<BittensorBlocksView
\t\t\t\t\tselection={select(
\t\t\t\t\t\tEntityType.BittensorNetwork,
\t\t\t\t\t\t{
\t\t\t\t\t\t\t$network: network.caip2 == null ?
\t\t\t\t\t\t\t\t{ slug: params.networkSlug }
\t\t\t\t\t\t\t:
\t\t\t\t\t\t\t\t{ caip2: network.caip2 },
\t\t\t\t\t\t}
\t\t\t\t\t).$$blocks({
\t\t\t\t\t\tlimit: 16,
\t\t\t\t\t})}
\t\t\t\t\t{href}
\t\t\t\t\tid="blocks"
\t\t\t\t/>
\t\t\t{:else if network.namespace === NetworkNamespace.ZeroG}
\t\t\t\t<ZeroGBlocksView
\t\t\t\t\tselection={select(
\t\t\t\t\t\tEntityType.ZeroGNetwork,
\t\t\t\t\t\t{ slug: '0g' }
\t\t\t\t\t).$$blocks({
\t\t\t\t\t\tlimit: 16,
\t\t\t\t\t})}
\t\t\t\t\t{href}
\t\t\t\t\tid="blocks"
\t\t\t\t/>
\t\t\t{:else}
\t\t\t\t<p data-text="muted">This network does not expose a block list route yet.</p>
\t\t\t{/if}
\t\t{/snippet}
\t</ResourceBoundary>
</Page>
`

	if (shell.kind === 'network-slug-block-detail')
		return `<script lang="ts">
\t// Types/constants
\timport type { PageProps } from './$types'
\timport { NetworkNamespace } from '$/constants/Network.ts'
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { Source } from '$/sources/Source.ts'


\t// Context
\timport { select } from '$/routes/+layout.svelte'
\t// State
\tlet {
\t\tparams,
\t}: PageProps = $props()

\tconst network = $derived(select(EntityType.Network,
\t\t{ slug: params.networkSlug },
\t\t({ sources: [Source.Constants_Internal], fields: { namespace: true, slug: true } }),
\t))


\t// Components
\timport Page from '$/components/Page.svelte'
\timport ResourceBoundary from '$/components/ResourceBoundary.svelte'
\timport CosmosBlockView from '$/views/CosmosBlockView.svelte'
\timport PolkadotBlockView from '$/views/PolkadotBlockView.svelte'
\timport SolanaBlockView from '$/views/SolanaBlockView.svelte'
\timport UtxoBlockView from '$/views/UtxoBlockView.svelte'
</script>


<Page>
\t<ResourceBoundary resource={network}>
\t\t{#snippet children(network)}
\t\t\t{@const selector = { slug: params.networkSlug }}
\t\t\t{#if network.namespace === NetworkNamespace.Bitcoin || network.namespace === NetworkNamespace.BitcoinCash || network.namespace === NetworkNamespace.Litecoin || network.namespace === NetworkNamespace.Dogecoin || network.namespace === NetworkNamespace.Zcash}
\t\t\t\t<UtxoBlockView selection={select(EntityType.UtxoBlock, { $network: selector, height: BigInt(params.height) })} />
\t\t\t{:else if network.namespace === NetworkNamespace.Cosmos}
\t\t\t\t<CosmosBlockView selection={select(EntityType.CosmosBlock, { $network: selector, height: BigInt(params.height) })} />
\t\t\t{:else if network.namespace === NetworkNamespace.Solana}
\t\t\t\t<SolanaBlockView selection={select(EntityType.SolanaBlock, { $network: selector, slot: BigInt(params.height) })} />
\t\t\t{:else if network.namespace === NetworkNamespace.Polkadot}
\t\t\t\t<PolkadotBlockView selection={select(EntityType.PolkadotBlock, { $network: selector, blockNumber: BigInt(params.height) })} />
\t\t\t{:else}
\t\t\t\t<p data-text="muted">Block detail not available for this network type yet.</p>
\t\t\t{/if}
\t\t{/snippet}
\t</ResourceBoundary>
</Page>
`

	if (shell.kind === 'network-slug-transactions')
		return `<script lang="ts">
\t// Types/constants
\timport type { PageProps } from './$types'
\timport { NetworkNamespace } from '$/constants/Network.ts'
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { Source } from '$/sources/Source.ts'


\t// Context
\timport { resolve } from '$app/paths'
\timport { select } from '$/routes/+layout.svelte'
\t// State
\tlet {
\t\tparams,
\t}: PageProps = $props()

\tconst network = $derived(select(EntityType.Network,
\t\t{
\t\t\tslug: params.networkSlug,
\t\t},
\t\t({ sources: [
\t\t\t\tSource.Constants_Internal,
\t\t\t], fields: { caip2: true, namespace: true, slug: true } }),
\t))


\t// Components
\timport Page from '$/components/Page.svelte'
\timport ResourceBoundary from '$/components/ResourceBoundary.svelte'
\timport HyperliquidTransactionsView from '$/views/HyperliquidTransactionsView.svelte'
\timport SolanaTransactionsView from '$/views/SolanaTransactionsView.svelte'
\timport UtxoTransactionsView from '$/views/UtxoTransactionsView.svelte'
</script>


<Page>
\t<ResourceBoundary resource={network}>
\t\t{#snippet children(network)}
\t\t\t{@const selector = network.caip2 == null ?
\t\t\t\t{ slug: params.networkSlug }
\t\t\t:
\t\t\t\t{ caip2: network.caip2 }}
\t\t\t{@const href = resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/transactions', {
\t\t\t\tnetworkSlug: params.networkSlug,
\t\t\t})}
\t\t\t{#if network.namespace === NetworkNamespace.Bitcoin || network.namespace === NetworkNamespace.BitcoinCash || network.namespace === NetworkNamespace.Litecoin || network.namespace === NetworkNamespace.Dogecoin || network.namespace === NetworkNamespace.Zcash}
\t\t\t\t<UtxoTransactionsView
\t\t\t\t\tselection={select(
\t\t\t\t\t\tEntityType.UtxoNetwork,
\t\t\t\t\t\t{ $network: selector }
\t\t\t\t\t).$$transactions({
\t\t\t\t\t\tlimit: 16,
\t\t\t\t\t})}
\t\t\t\t\t{href}
\t\t\t\t\tid="transactions"
\t\t\t\t/>
\t\t\t{:else if network.namespace === NetworkNamespace.Solana && network.caip2 != null}
\t\t\t\t<SolanaTransactionsView
\t\t\t\t\tselection={select(
\t\t\t\t\t\tEntityType.SolanaNetwork,
\t\t\t\t\t\t{
\t\t\t\t\t\t\tcaip2: {
\t\t\t\t\t\t\t\tnamespace: 'solana',
\t\t\t\t\t\t\t\treference: network.caip2.reference,
\t\t\t\t\t\t\t},
\t\t\t\t\t\t}
\t\t\t\t\t).$$transactions({
\t\t\t\t\t\tlimit: 16,
\t\t\t\t\t})}
\t\t\t\t\t{href}
\t\t\t\t\tid="transactions"
\t\t\t\t/>
\t\t\t{:else if network.namespace === NetworkNamespace.Hyperliquid}
\t\t\t\t<HyperliquidTransactionsView
\t\t\t\t\tselection={select(
\t\t\t\t\t\tEntityType.HyperliquidNetwork,
\t\t\t\t\t\t{ $network: selector }
\t\t\t\t\t).$$transactions({
\t\t\t\t\t\tlimit: 16,
\t\t\t\t\t})}
\t\t\t\t\t{href}
\t\t\t\t\tid="transactions"
\t\t\t\t/>
\t\t\t{:else}
\t\t\t\t<p data-text="muted">This network does not expose a network-level transactions route yet.</p>
\t\t\t{/if}
\t\t{/snippet}
\t</ResourceBoundary>
</Page>
`

	if (shell.kind === 'network-slug-transaction-detail')
		return `<script lang="ts">
\timport type { PageProps } from './$types'
\timport { NetworkNamespace } from '$/constants/Network.ts'
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { ZeroExHex } from '$/schema/ZeroExHex.ts'
\timport { Source } from '$/sources/Source.ts'
\timport { select } from '$/routes/+layout.svelte'
\t// State
\tlet {
\t\tparams,
\t}: PageProps = $props()

\tconst network = $derived(select(EntityType.Network,
\t\t{
\t\t\tslug: params.networkSlug,
\t\t},
\t\t({ sources: [
\t\t\t\tSource.Constants_Internal,
\t\t\t], fields: { namespace: true } }),
\t))


\t// Components
\timport Page from '$/components/Page.svelte'
\timport ResourceBoundary from '$/components/ResourceBoundary.svelte'
\timport EvmTransactionView from '$/views/EvmTransactionView.svelte'
\timport UtxoTransactionView from '$/views/UtxoTransactionView.svelte'
</script>


<Page>
\t<ResourceBoundary resource={network}>
\t\t{#snippet children(network)}
\t\t\t{#if network.namespace === NetworkNamespace.Bitcoin || network.namespace === NetworkNamespace.BitcoinCash || network.namespace === NetworkNamespace.Litecoin || network.namespace === NetworkNamespace.Dogecoin || network.namespace === NetworkNamespace.Zcash}
\t\t\t\t\t<UtxoTransactionView
\t\t\t\t\t\tselection={select(EntityType.UtxoTransaction, {
\t\t\t\t\t\t\t$network: { slug: params.networkSlug },
\t\t\t\t\t\t\ttxId: params.txId,
\t\t\t\t\t\t})}
\t\t\t\t\t/>
\t\t\t{:else if network.namespace === NetworkNamespace.ZeroG}
\t\t\t\t<EvmTransactionView
\t\t\t\t\tselection={select(EntityType.EvmTransaction, {
\t\t\t\t\t\t$network: {
\t\t\t\t\t\t\tcaip2: {
\t\t\t\t\t\t\t\tnamespace: 'eip155',
\t\t\t\t\t\t\t\treference: '16661',
\t\t\t\t\t\t\t},
\t\t\t\t\t\t},
\t\t\t\t\t\ttxHash: ZeroExHex.assert(params.txId),
\t\t\t\t\t})}
\t\t\t\t/>
\t\t\t{:else}
\t\t\t\t<p data-text="muted">This network does not expose a transaction detail route yet.</p>
\t\t\t{/if}
\t\t{/snippet}
\t</ResourceBoundary>
</Page>
`

	if (shell.kind === 'eip155-network-upgrade-detail')
		return `<script lang="ts">
\timport { eip155NetworkSelectorFromCaip2 } from '$/lib/caip2.ts'
\t// Types/constants
\timport {
\t\tethereumMainnetNetworkUpgradeSlugAliasBySegmentSlug,
\t\tnetworkUpgrades,
\t} from '$/constants/EthereumNetworkUpgrades.ts'
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { select } from '$/routes/+layout.svelte'

\t// State
\tlet {
\t\tparams,
\t} = $props()

\timport { evmChainIdFromCaip2 } from '$/lib/caip.ts'

\tconst chainId = $derived(evmChainIdFromCaip2(params.caip2))


\t// Components
\timport Page from '$/components/Page.svelte'
\timport NetworkUpgradeView from '$/views/EthereumNetworkUpgradeView.svelte'
</script>


<Page>
\t<NetworkUpgradeView
\t\tselection={select(EntityType.EthereumNetworkUpgrade, {
\t\t\t$network: eip155NetworkSelectorFromCaip2(params.caip2),
\t\t\tupgradeId: ((() => {
\t\t\t\tconst segment = params.upgradeSlug
\t\t\t\tconst direct = networkUpgrades.find((networkUpgrade) => {
\t\t\t\t\tif (networkUpgrade.chainId !== chainId) return false
\t\t\t\t\tconst slug = (
\t\t\t\t\t\tnetworkUpgrade.slug.length > 0 ?
\t\t\t\t\t\t\tnetworkUpgrade.slug
\t\t\t\t\t\t:
\t\t\t\t\t\t\tString(networkUpgrade.upgradeId).toLowerCase().replace(/\\s+/g, '-')
\t\t\t\t\t)
\t\t\t\t\tconst { upgradeId } = networkUpgrade
\t\t\t\t\tconst segmentSlug = String(segment).toLowerCase().replace(/\\s+/g, '-')
\t\t\t\t\tconst slugSegment = String(slug).toLowerCase().replace(/\\s+/g, '-')
\t\t\t\t\tconst upgradeIdSegment = String(upgradeId).toLowerCase().replace(/\\s+/g, '-')
\t\t\t\t\treturn (
\t\t\t\t\t\tsegment === upgradeId
\t\t\t\t\t\t|| segment === slug
\t\t\t\t\t\t|| segment.toLowerCase() === upgradeId.toLowerCase()
\t\t\t\t\t\t|| segment.toLowerCase() === slug.toLowerCase()
\t\t\t\t\t\t|| segmentSlug === slugSegment
\t\t\t\t\t\t|| segmentSlug === upgradeIdSegment
\t\t\t\t\t)
\t\t\t\t})?.upgradeId

\t\t\t\tif (direct != null) {
\t\t\t\t\treturn direct
\t\t\t\t}

\t\t\t\tif (
\t\t\t\t\tchainId === 1
\t\t\t\t\t|| chainId === 11_155_111
\t\t\t\t\t|| chainId === 17_000
\t\t\t\t) {
\t\t\t\t\tconst aliasRow = ethereumMainnetNetworkUpgradeSlugAliasBySegmentSlug[
\t\t\t\t\t\tString(segment).toLowerCase().replace(/\\s+/g, '-')
\t\t\t\t\t]
\t\t\t\t\tif (aliasRow != null) {
\t\t\t\t\t\treturn (
\t\t\t\t\t\t\tnetworkUpgrades.find((networkUpgrade) => (
\t\t\t\t\t\t\t\tnetworkUpgrade.chainId === chainId
\t\t\t\t\t\t\t\t&& networkUpgrade.upgradeId === aliasRow.umbrellaUpgradeId
\t\t\t\t\t\t\t))
\t\t\t\t\t\t\t?.upgradeId
\t\t\t\t\t\t)
\t\t\t\t\t}
\t\t\t\t}

\t\t\t\treturn undefined
\t\t\t})() ?? params.upgradeSlug)
\t\t})}
\t/>
</Page>
`

	if (shell.kind === 'network-slug-address-detail')
		return `<script lang="ts">
\t// Types/constants
\timport type { PageProps } from './$types'
\timport { NetworkNamespace } from '$/constants/Network.ts'
\timport { with0xHex } from '$/lib/hexLowerOfByteSize.ts'
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { Source } from '$/sources/Source.ts'


\t// Context
\timport { select } from '$/routes/+layout.svelte'
\t// State
\tlet {
\t\tparams,
\t}: PageProps = $props()

\tconst network = $derived(select(EntityType.Network,
\t\t{ slug: params.networkSlug },
\t\t({ sources: [Source.Constants_Internal], fields: { namespace: true, slug: true } }),
\t))


\t// Components
\timport Page from '$/components/Page.svelte'
\timport ResourceBoundary from '$/components/ResourceBoundary.svelte'
\timport TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
\timport UtxoAddressView from '$/views/UtxoAddressView.svelte'
</script>


<Page>
\t<ResourceBoundary resource={network}>
\t\t{#snippet children(network)}
\t\t\t{@const selector = { slug: params.networkSlug }}
\t\t\t{#if network.namespace === NetworkNamespace.Bitcoin || network.namespace === NetworkNamespace.BitcoinCash || network.namespace === NetworkNamespace.Litecoin || network.namespace === NetworkNamespace.Dogecoin || network.namespace === NetworkNamespace.Zcash}
\t\t\t\t<UtxoAddressView
\t\t\t\t\tselection={select(EntityType.UtxoAddress, { $network: selector, address: params.address })}
\t\t\t\t/>
\t\t\t{:else if network.namespace === NetworkNamespace.ZeroG}
\t\t\t\t{@const account = select(EntityType.EvmNetworkAccount, {
\t\t\t\t\t$network: {
\t\t\t\t\t\tcaip2: {
\t\t\t\t\t\t\tnamespace: 'eip155',
\t\t\t\t\t\t\treference: '16661',
\t\t\t\t\t\t},
\t\t\t\t\t},
\t\t\t\t\t$actor: { address: with0xHex(params.address) },
\t\t\t\t}, {
\t\t\t\t\tsources: [Source.ZeroGChain_JsonRpc],
\t\t\t\t\tfields: { isContract: true },
\t\t\t\t})}
\t\t\t\t<section data-column>
\t\t\t\t\t<h1>
\t\t\t\t\t\t<TruncatedValue
\t\t\t\t\t\t\tformat={TruncatedValueFormat.Visual}
\t\t\t\t\t\t\tvalue={params.address}
\t\t\t\t\t\t/>
\t\t\t\t\t</h1>

\t\t\t\t\t<dl data-column-item="center">
\t\t\t\t\t\t<div>
\t\t\t\t\t\t\t<dt>Network</dt>
\t\t\t\t\t\t\t<dd>0G</dd>
\t\t\t\t\t\t</div>

\t\t\t\t\t\t<div>
\t\t\t\t\t\t\t<dt>CAIP-2</dt>
\t\t\t\t\t\t\t<dd>
\t\t\t\t\t\t\t\t<code>eip155:16661</code>
\t\t\t\t\t\t\t</dd>
\t\t\t\t\t\t</div>

\t\t\t\t\t\t<div>
\t\t\t\t\t\t\t<dt>Contract</dt>
\t\t\t\t\t\t\t<dd>
\t\t\t\t\t\t\t\t<ResourceBoundary
\t\t\t\t\t\t\t\t\tresource={account}
\t\t\t\t\t\t\t\t\tplaceholderText="Loading network activity…"
\t\t\t\t\t\t\t\t>
\t\t\t\t\t\t\t\t\t{#snippet children(account)}
\t\t\t\t\t\t\t\t\t\t{account.isContract ? 'Yes' : 'No'}
\t\t\t\t\t\t\t\t\t{/snippet}
\t\t\t\t\t\t\t\t</ResourceBoundary>
\t\t\t\t\t\t\t</dd>
\t\t\t\t\t\t</div>
\t\t\t\t\t</dl>
\t\t\t\t</section>
\t\t\t{:else}
\t\t\t\t<p data-text="muted">Address detail not available for this network type yet.</p>
\t\t\t{/if}
\t\t{/snippet}
\t</ResourceBoundary>
</Page>
`

	if (shell.kind === 'network-slug-node-detail')
		return `<script lang="ts">
\timport type { PageProps } from './$types'
\timport { NetworkNamespace } from '$/constants/Network.ts'
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { EvmAddress } from '$/schema/ZeroExHex.ts'
\timport { Source } from '$/sources/Source.ts'
\timport { select } from '$/routes/+layout.svelte'
\t// State
\tlet {
\t\tparams,
\t}: PageProps = $props()

\tconst network = $derived(select(EntityType.Network,
\t\t{
\t\t\tslug: params.networkSlug,
\t\t},
\t\t({ sources: [
\t\t\t\tSource.Constants_Internal,
\t\t\t], fields: { namespace: true } }),
\t))


\t// Components
\timport Page from '$/components/Page.svelte'
\timport ResourceBoundary from '$/components/ResourceBoundary.svelte'
\timport LightningNodeView from '$/views/LightningNodeView.svelte'
\timport ZeroGStorageNodeView from '$/views/ZeroGStorageNodeView.svelte'
</script>


<Page>
\t<ResourceBoundary resource={network}>
\t\t\t{#snippet children(network)}
\t\t\t\t{#if network.namespace === NetworkNamespace.Lightning}
\t\t\t\t\t<LightningNodeView
\t\t\t\t\t\tselection={select(EntityType.LightningNode, {
\t\t\t\t\t\t\t$network: { slug: params.networkSlug },
\t\t\t\t\t\t\tpublicKey: params.pubkey,
\t\t\t\t\t\t})}
\t\t\t\t\t/>
\t\t\t\t{:else if network.namespace === NetworkNamespace.ZeroG}
\t\t\t\t\t<ZeroGStorageNodeView
\t\t\t\t\t\tselection={select(EntityType.ZeroGStorageNode, {
\t\t\t\t\t\t\t$network: { slug: params.networkSlug },
\t\t\t\t\t\t\tnodeId: EvmAddress.assert(params.pubkey),
\t\t\t\t\t\t})}
\t\t\t\t\t/>
\t\t\t{:else}
\t\t\t\t<p data-text="muted">This network does not expose a node detail route yet.</p>
\t\t\t{/if}
\t\t{/snippet}
\t</ResourceBoundary>
</Page>
`

	if (shell.kind === 'custom') {
		if (shell.sourceText === undefined)
			throw new Error(`Missing custom route page source for ${shell.routePath}`)

		return shell.sourceText
	}

	if (shell.kind === 'global-collection')
		return generatedGlobalCollectionPageShell(shell)

	if (shell.kind === 'global-source-collection')
		return generatedGlobalSourceCollectionPageShell(shell, viewFile)

	if (shell.kind === 'proposal-selector-detail') {
		if (
			shell.viewComponent === undefined
			|| shell.entityType === undefined
			|| shell.proposalLevel === undefined
			|| shell.invalidText === undefined
		)
			throw new Error(`Missing proposal selector detail page data for ${shell.routePath}`)

		const constantsImport = shell.proposalLevel === 'realm' ? `\timport { specificationRealmBySlug } from '$/constants/SpecificationProposal.ts'` : `\timport {
\t\tproposalCategoryBySlug,
\t\tproposalKindAllowedInRealmByKey,
\t\tspecificationRealmBySlug,
\t} from '$/constants/SpecificationProposal.ts'`

		const selectorSource = shell.proposalLevel === 'realm' ? `\tconst selector = $derived(
\t\tparams.specificationRealmSlug in specificationRealmBySlug ?
\t\t\t{
\t\t\t\trealm: specificationRealmBySlug[params.specificationRealmSlug]!.id,
\t\t\t}
\t\t:
\t\t\tundefined,
\t)` : shell.proposalLevel === 'kind' ? `\tconst realm = $derived(
\t\tspecificationRealmBySlug[params.specificationRealmSlug]?.id,
\t)

\tconst category = $derived(
\t\tproposalCategoryBySlug[params.proposalKindSlug]?.id,
\t)

\tconst selector = $derived(
\t\trealm != null && category != null && proposalKindAllowedInRealmByKey[\`\${realm}:\${category}\`] != null ?
\t\t\t{
\t\t\t\trealm,
\t\t\t\tcategory,
\t\t\t}
\t\t:
\t\t\tundefined,
\t)` : `\tconst realm = $derived(
\t\tspecificationRealmBySlug[params.specificationRealmSlug]?.id,
\t)

\tconst category = $derived(
\t\tproposalCategoryBySlug[params.proposalKindSlug]?.id,
\t)

\tconst proposalNumber = $derived(
\t\t(() => {
\t\t\tconst raw = params.proposalRef.slice(params.proposalRef.lastIndexOf('-') + 1)
\t\t\treturn /^\\d+$/.test(raw) ? Number(raw) : undefined
\t\t})(),
\t)

\tconst proposalCategory = $derived(
\t\t(() => {
\t\t\tconst raw = params.proposalRef.slice(0, params.proposalRef.lastIndexOf('-')).toLowerCase()
\t\t\treturn proposalCategoryBySlug[raw]?.id ?? undefined
\t\t})(),
\t)

\tconst selector = $derived(
\t\trealm != null && category != null && proposalCategory != null
\t\t&& proposalNumber != null
\t\t&& category === proposalCategory
\t\t&& proposalKindAllowedInRealmByKey[\`\${realm}:\${category}\`] != null ?
\t\t\t{
\t\t\t\trealm,
\t\t\t\tcategory,
\t\t\t\tnumber: proposalNumber,
\t\t\t}
\t\t:
\t\t\tundefined,
\t)`

		return `<script lang="ts">
${shell.proposalLevel === 'realm' ? `\timport { EntityType } from '$/schema/EntityType.ts'
\timport { select } from '$/routes/+layout.svelte'
\t// Types/constants
${constantsImport}
` : `\t// Types/constants
${constantsImport}
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { select } from '$/routes/+layout.svelte'
${shell.proposalLevel === 'proposal' ? '\n' : ''}`}
\t// State
\tlet {
\t\tparams,
\t} = $props()

${selectorSource}


\t// Components
\timport Page from '$/components/Page.svelte'
\timport ${shell.viewComponent} from '$/views/${viewFile}'
</script>


<Page>
\t{#if selector !== undefined}
\t\t<${shell.viewComponent}
\t\t\tselection={select(EntityType.${shell.entityType}, selector)}
\t\t\topen
\t\t/>
\t{:else}
\t\t<p role="alert">
\t\t\t${shell.invalidText}
\t\t</p>
\t{/if}
</Page>
`
	}

	if (shell.kind === 'placeholder') {
		if (shell.placeholderText === undefined)
			throw new Error(`Missing placeholder page text for ${shell.routePath}`)

		return `<script lang="ts">
\t// Components
\timport Page from '$/components/Page.svelte'
</script>


<Page>
${shell.placeholderMultiline ? `\t<p data-text="muted">
\t\t${shell.placeholderText}
\t</p>` : `\t<p data-text="muted">${shell.placeholderText}</p>`}
</Page>
`
	}

	if (shell.kind === 'static-page') {
		if (
			shell.staticWrapper === undefined
			|| shell.staticTitle === undefined
		)
			throw new Error(`Missing static page data for ${shell.routePath}`)

		if (shell.staticWrapper === 'section-column')
			return `<section data-column>
\t<h1>${shell.staticTitle}</h1>
</section>
`

		const link = shell.staticLinks?.[0]

		if (link === undefined)
			throw new Error(`Missing static page link for ${shell.routePath}`)

		return `<script lang="ts">
\t// Context
\timport { resolve } from '$app/paths'
</script>


<main data-column>
\t<section data-card>
\t\t<h1>${shell.staticTitle}</h1>

\t\t<a href={resolve('${link.route}')}>${link.label}</a>
\t</section>
</main>
`
	}

	if (shell.kind === 'derived-selector-detail') {
		if (
			shell.viewComponent === undefined
			|| shell.entityType === undefined
			|| shell.selectorDeclaration === undefined
			|| shell.selectorGuard === undefined
			|| shell.invalidText === undefined
		)
			throw new Error(`Missing derived selector detail page data for ${shell.routePath}`)

		return `<script lang="ts">
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { select } from '$/routes/+layout.svelte'
\t// State
\tlet {
\t\tparams,
\t} = $props()

${shell.functionImports === undefined ? '' : `${shell.functionImports.map((importLine) => `\t${importLine}`).join('\n')}

`}${shell.selectorDeclaration.split('\n').map((line) => `\t${line}`).join('\n')}


\t// Components
\timport Page from '$/components/Page.svelte'
\timport ${shell.viewComponent} from '$/views/${viewFile}'
</script>


{#if ${shell.selectorGuard}}
\t<Page>
\t\t<${shell.viewComponent}
\t\t\tselection={select(EntityType.${shell.entityType}, selector)}
${shell.viewProps === undefined ? '' : `${shell.viewProps.map((prop) => `\t\t\t${prop}`).join('\n')}
`}\t\t/>
\t</Page>
{:else}
\t<p role="alert">
\t\t${shell.invalidText}
\t</p>
{/if}
`
	}

	if (shell.kind === 'data-selector-simple-detail') {
		if (
			shell.viewComponent === undefined
			|| shell.entityType === undefined
		)
			throw new Error(`Missing simple data selector detail page data for ${shell.routePath}`)

		return `<script lang="ts">
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { select } from '$/routes/+layout.svelte'
\t// State
\tlet {
\t\tdata,
\t} = $props()


\t// Components
\timport Page from '$/components/Page.svelte'
\timport ${shell.viewComponent} from '$/views/${viewFile}'
</script>


<Page>
\t<${shell.viewComponent}
\t\tselection={select(EntityType.${shell.entityType}, data.selector)}
\t/>
</Page>
`
	}

	if (shell.kind === 'direct-selector-detail') {
		if (
			shell.viewComponent === undefined
			|| shell.entityType === undefined
			|| shell.selectorExpression === undefined
		)
			throw new Error(`Missing direct selector detail page data for ${shell.routePath}`)

		return shell.selectorImportStyle === 'sectioned' ? `<script lang="ts">
\t// Types/constants
\timport { EntityType } from '$/schema/EntityType.ts'

\t// Context
\timport { select } from '$/routes/+layout.svelte'


${shell.paramsMultiline === undefined ? '' : `\t// State
\tlet {
\t\tparams,
\t} = $props()
${shell.blankLineBeforeComponents === false ? '\n' : '\n\n'}`}\t// Components
\timport Page from '$/components/Page.svelte'
\timport ${shell.viewComponent} from '$/views/${viewFile}'
</script>


<Page>
\t<${shell.viewComponent}
\t\tselection={select(EntityType.${shell.entityType}, ${shell.selectorExpression})}
${shell.viewProps === undefined ? '' : `${shell.viewProps.map((prop) => `\t\t${prop}`).join('\n')}
`}${shell.explicitClosingTag ? `\t>
\t</${shell.viewComponent}>` : '\t/>'}
</Page>
` : `<script lang="ts">
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { select } from '$/routes/+layout.svelte'
${shell.paramsMultiline === undefined ? '' : `\t// State
\tlet {
\t\tparams,
\t} = $props()
${shell.blankLineBeforeComponents === false ? '\n' : '\n\n'}`}\t// Components
\timport Page from '$/components/Page.svelte'
\timport ${shell.viewComponent} from '$/views/${viewFile}'
</script>


<Page>
\t<${shell.viewComponent}
\t\tselection={select(EntityType.${shell.entityType}, ${shell.selectorExpression})}
${shell.viewProps === undefined ? '' : `${shell.viewProps.map((prop) => `\t\t${prop}`).join('\n')}
`}${shell.explicitClosingTag ? `\t>
\t</${shell.viewComponent}>` : '\t/>'}
</Page>
`
	}

	if (shell.kind === 'linked-view') {
		if (
			shell.viewComponent === undefined
			|| shell.hrefExpression === undefined
			|| shell.id === undefined
		)
			throw new Error(`Missing linked view page data for ${shell.routePath}`)

		return `<script lang="ts">
\t// Context
\timport { resolve } from '$app/paths'


\t// Components
\timport Page from '$/components/Page.svelte'
\timport ${shell.viewComponent} from '$/views/${viewFile}'
</script>


<Page>
\t<${shell.viewComponent}
\t\thref={${shell.hrefExpression}}
\t\tid="${shell.id}"
${shell.titleExpression === undefined ? '' : `\t\ttitle={${shell.titleExpression}}
`}\t/>
</Page>
`
	}

	if (shell.kind === 'simple-view') {
		if (shell.viewComponent === undefined)
			throw new Error(`Missing simple view page data for ${shell.routePath}`)

		return `<script lang="ts">
${shell.paramsMultiline === undefined ? '' : `\t// State
\tlet {
\t\tparams,
\t} = $props()


`}\t// Components
${shell.viewImportBeforePage ? `\timport ${shell.viewComponent} from '$/views/${viewFile}'
\timport Page from '$/components/Page.svelte'` : `\timport Page from '$/components/Page.svelte'
\timport ${shell.viewComponent} from '$/views/${viewFile}'`}
</script>


<Page>
\t<${shell.viewComponent}${shell.viewProps === undefined ? ' />' : `
${shell.viewProps.map((prop) => `\t\t${prop}`).join('\n')}
\t/>`}
</Page>
`
	}

	if (shell.kind === 'catalog-param-detail') {
		if (
			shell.viewComponent === undefined
			|| shell.entityType === undefined
			|| shell.paramName === undefined
			|| shell.catalogImports === undefined
			|| shell.catalogParamType === undefined
			|| shell.catalogRowsName === undefined
			|| shell.catalogRowName === undefined
			|| shell.catalogLookupField === undefined
			|| shell.catalogRouteKey === undefined
			|| shell.catalogTitleExpression === undefined
			|| shell.catalogNotFoundCondition === undefined
			|| shell.catalogUnknownText === undefined
		)
			throw new Error(`Missing catalog param detail page data for ${shell.routePath}`)

		const missingOrUnknown = shell.catalogMissingText === undefined ? `\t\t<h1>
\t\t\tNot found
\t\t</h1>
\t\t<p>
\t\t\t${shell.catalogUnknownText}
\t\t</p>` : `\t\t<h1>
\t\t\tNot found
\t\t</h1>
\t\t<p>
\t\t\t{route.param ?
\t\t\t\t\`${shell.catalogUnknownText}\`
\t\t\t:
\t\t\t\t'${shell.catalogMissingText}'}
\t\t</p>`

		const detail = shell.catalogDetailId === undefined ? `<${shell.viewComponent}
\t\t\tselection={select(EntityType.${shell.entityType}, { ${shell.catalogRouteKey}: route.${shell.catalogRouteKey} })}
${shell.open ? '\t\t\topen\n' : ''}\t\t/>` : `<${shell.viewComponent}
\t\t\t\tselection={select(EntityType.${shell.entityType}, {
\t\t\t\t\t${shell.catalogRouteKey}: route.${shell.catalogRouteKey},
\t\t\t\t})}
${shell.open ? '\t\t\t\topen\n' : ''}\t\t\t/>`

		return `<script lang="ts">
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { select } from '$/routes/+layout.svelte'
\t// Types/constants
${shell.catalogImports.map((catalogImport) => `\t${catalogImport}`).join('\n')}


\t// State
\tlet {
\t\tparams,
\t} = $props()

\tconst route = $derived.by(() => {
\t\tconst param = params.${shell.paramName} ?? ''
\t\tconst ${shell.catalogRouteKey} = ${shell.catalogRouteKey}FromParam(param)
\t\treturn { param, ${shell.catalogRouteKey} }
\t})


\t// Components
\timport Page from '$/components/Page.svelte'
\timport ${shell.viewComponent} from '$/views/${viewFile}'


\t// Functions
\tconst ${shell.catalogRouteKey}FromParam = (param: string): ${shell.catalogParamType} | null => (
\t\t${shell.catalogRowsName}.find((${shell.catalogRowName}) => ${shell.catalogRowName}.${shell.catalogLookupField} === param)?.${shell.catalogLookupField} ?? null
\t)
</script>


<svelte:head>
\t<title>
\t\t${shell.catalogTitleExpression}
\t</title>
</svelte:head>


<Page>
\t{#if ${shell.catalogNotFoundCondition}}
${shell.catalogNotFoundId === undefined ? missingOrUnknown : `\t\t<div id="${shell.catalogNotFoundId}">
${missingOrUnknown}
\t\t</div>`}
\t{:else}
${shell.catalogDetailId === undefined ? `\t\t${detail}` : `\t\t<div id="${shell.catalogDetailId}">
\t\t\t${detail}
\t\t</div>`}
\t{/if}
</Page>
`
	}

	if (shell.kind === 'global-hub-tabs') {
		if (
			shell.hubKey === undefined
			|| shell.hubScope === undefined
			|| shell.hubTitleExpression === undefined
			|| shell.hubHref === undefined
			|| shell.hubSections === undefined
		)
			throw new Error(`Missing global hub tabs page data for ${shell.routePath}`)

		const viewImports = shell.hubSections
			.filter((section) => section.viewComponent !== undefined)
			.toReversed()
			.map((section) => `\timport ${section.viewComponent} from '$/views/${section.viewComponent}.svelte'`)
			.join('\n')

		return `<script lang="ts">
\timport { select } from '$/routes/+layout.svelte'
\t// Types/constants
\timport { EntityType } from '$/schema/EntityType.ts'


\t// Context
\timport { resolve } from '$app/paths'


\tconst hubKey = '${shell.hubKey}'


\t// Components
${viewImports}
\timport CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
\timport HeadingComponent from '$/components/Heading.svelte'
\timport Page from '$/components/Page.svelte'
\timport GlobalView from '$/views/GlobalView.svelte'
</script>


<Page>
\t<GlobalView
\t\tselection={select(EntityType._Global, { scope: '${shell.hubScope}' })}
\t\ttitle=${shell.hubTitleExpression}
\t\thref={resolve('${shell.hubHref}')}
\t>
\t\t{#snippet children({ open: hubOpen,
\t\t})}
\t\t\t<CollapsibleTabs
\t\t\t\tid={\`\${hubKey}:hub\`}
\t\t\t\tsectionIdPrefix={hubKey}
\t\t\t\tsections={[
${shell.hubSections.map((section) => `\t\t\t\t\t{ id: '${section.id}', label: '${section.label}' },`).join('\n')}
\t\t\t\t]}
\t\t\t\tdata-card
\t\t\t\tscrollContainerProps={{
\t\t\t\t\t'data-row': 'start align-start',
\t\t\t\t\tstyle: '--carousel-basis: 40ch',
\t\t\t\t}}
\t\t\t>
\t\t\t\t{#snippet Summary({ open: _summaryOpen })}
\t\t\t\t\t<header
\t\t\t\t\t\tdata-row-item="flexible"
\t\t\t\t\t\tdata-row="wrap gap-4"
\t\t\t\t\t>
\t\t\t\t\t\t<HeadingComponent>
\t\t\t\t\t\t\t${shell.hubScope}
\t\t\t\t\t\t</HeadingComponent>
\t\t\t\t\t</header>
\t\t\t\t{/snippet}

${shell.hubSections.map((section) => `\t\t\t\t{#snippet Section${section.id.split('-').map((part) => `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}`).join('')}({ id, label })}
${section.placeholderText === undefined ? `\t\t\t\t\t<${section.viewComponent}
${section.href === undefined ? '' : `\t\t\t\t\t\thref={resolve('${section.href}')}
`}${section.globalField === undefined ? '' : `\t\t\t\t\t\tselection={select(
\t\t\tEntityType._Global,
\t\t\t{ scope: '${section.globalField}' }
\t\t).${section.globalField}}
`}\t\t\t\t\t\tid="${section.viewId}"
\t\t\t\t\t\topen={hubOpen}
\t\t\t\t\t/>` : `\t\t\t\t\t<p data-text="muted">
\t\t\t\t\t\t${section.placeholderText}
\t\t\t\t\t</p>`}
\t\t\t\t{/snippet}`).join('\n\n')}
\t\t</CollapsibleTabs>
\t\t{/snippet}
\t</GlobalView>
</Page>
`
	}

	if (shell.kind === 'eip155-network-collection') {
		if (
			shell.viewComponent === undefined
			|| shell.networkCollectionField === undefined
			|| shell.networkCollectionSources === undefined
			|| shell.id === undefined
		)
			throw new Error(`Missing EIP-155 network collection page data for ${shell.routePath}`)

		const hrefProp = shell.hrefExpression === undefined ? '' : `\t\thref={resolve(
\t\t\t${shell.hrefExpression},
\t\t\t{
\t\t\t\tcaip2: params.caip2,
\t\t\t}
\t\t)}
`
		const selectionProp = `\t\tselection={select(
\t\t\tEntityType.EvmNetwork,
\t\t\teip155NetworkSelectorFromCaip2(params.caip2)
\t\t).${shell.networkCollectionField}({
${shell.networkCollectionInlineSources ? `\t\t\tsources: [Source.${shell.networkCollectionSources[0]}],
` : `\t\t\tsources: [
${shell.networkCollectionSources.map((source) => `\t\t\t\tSource.${source},`).join('\n')}
\t\t\t],
`}${shell.limit === undefined ? '' : `\t\t\tlimit: ${shell.limit},
`}${shell.networkCollectionCount ? `\t\t\tcount: true,
` : ''}\t\t})}
`

		return `<script lang="ts">
\timport { eip155NetworkSelectorFromCaip2 } from '$/lib/caip2.ts'
\t// Types/constants
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { Source } from '$/sources/Source.ts'


\t// Context
\timport { select } from '$/routes/+layout.svelte'
${shell.hrefExpression === undefined ? '' : "\timport { resolve } from '$app/paths'\n"}${shell.networkCollectionTightContextState ? '' : '\n'}
\t// State
\tlet {
\t\tparams,
\t} = $props()
${shell.blankLineBeforeComponents === false ? '' : '\n'}
\t// Components
${shell.viewImportBeforePage ? `\timport ${shell.viewComponent} from '$/views/${viewFile}'
\timport Page from '$/components/Page.svelte'` : `\timport Page from '$/components/Page.svelte'
\timport ${shell.viewComponent} from '$/views/${viewFile}'`}
</script>


<Page>
\t<${shell.viewComponent}
${shell.networkCollectionHrefAfterSelection ? `${selectionProp}${hrefProp}` : `${hrefProp}${selectionProp}`}\t\tid="${shell.id}"
\t/>
</Page>
`
	}

	if (shell.kind === 'evm-protocol-collection') {
		if (
			shell.viewComponent === undefined
			|| shell.hrefExpression === undefined
			|| shell.protocolCollectionField === undefined
			|| shell.id === undefined
		)
			throw new Error(`Missing EVM protocol collection page data for ${shell.routePath}`)

		return `<script lang="ts">
\timport { select } from '$/routes/+layout.svelte'
\t// Types/constants
\timport { EntityType } from '$/schema/EntityType.ts'


\t// Context
\timport { resolve } from '$app/paths'


\t// Components
\timport Page from '$/components/Page.svelte'
\timport ${shell.viewComponent} from '$/views/${viewFile}'
</script>


<Page>
\t<${shell.viewComponent}
\t\thref={resolve(${shell.hrefExpression})}
\t\tselection={select(
\t\t\tEntityType.EvmProtocol,
\t\t\t{
\t\t\t\tscope: 'EvmProtocol',
\t\t\t}
\t\t).${shell.protocolCollectionField}}
\t\tid="${shell.id}"
\t/>
</Page>
`
	}

	if (shell.kind === 'youtube-parent-collection') {
		if (
			shell.viewComponent === undefined
			|| shell.entityType === undefined
			|| shell.parentSelectorField === undefined
			|| shell.parentSelectorParam === undefined
			|| shell.childField === undefined
			|| shell.hrefExpression === undefined
			|| shell.id === undefined
		)
			throw new Error(`Missing YouTube parent collection page data for ${shell.routePath}`)

		return `<script lang="ts">
\timport { select } from '$/routes/+layout.svelte'
\t// Types/constants
\timport { EntityType } from '$/schema/EntityType.ts'


\t// Context
\timport { resolve } from '$app/paths'


\t// State
\tlet {
\t\tparams,
\t} = $props()
${shell.blankLineBeforeComponents === false ? '' : '\n'}
\t// Components
\timport Page from '$/components/Page.svelte'
\timport ${shell.viewComponent} from '$/views/${viewFile}'
</script>


<Page>
\t<${shell.viewComponent}
\t\thref={resolve(${shell.hrefExpression})}
\t\tselection={select(
\t\t\tEntityType.${shell.entityType},
\t\t\t{
\t\t\t\t${shell.parentSelectorField}: decodeURIComponent(params.${shell.parentSelectorParam}),
\t\t\t}
\t\t).${shell.childField}}
\t\tid="${shell.id}"
${shell.title === undefined ? '' : `\t\ttitle="${shell.title}"
`}\t/>
</Page>
`
	}

	if (shell.kind === 'social-network-child-collection') {
		if (
			shell.viewComponent === undefined
			|| shell.entityType === undefined
			|| shell.networkScope === undefined
			|| shell.childField === undefined
			|| shell.id === undefined
			|| shell.title === undefined
		)
			throw new Error(`Missing social network child collection page data for ${shell.routePath}`)

		return `<script lang="ts">
\timport { select } from '$/routes/+layout.svelte'
\t// Types/constants
\timport { EntityType } from '$/schema/EntityType.ts'

\t// Components
\timport Page from '$/components/Page.svelte'
\timport ${shell.viewComponent} from '$/views/${viewFile}'
</script>


<Page>
\t<${shell.viewComponent}
\t\tselection={select(
\t\t\tEntityType.${shell.entityType},
\t\t\t{ scope: '${shell.networkScope}' }
\t\t).${shell.childField}}
\t\tid="${shell.id}"
\t\ttitle="${shell.title}"
\t/>
</Page>
`
	}

	if (shell.kind === 'decoded-parent-child-collection') {
		if (
			shell.viewComponent === undefined
			|| shell.entityType === undefined
			|| shell.parentSelectorField === undefined
			|| shell.parentSelectorParam === undefined
			|| shell.childField === undefined
			|| shell.hrefExpression === undefined
			|| shell.id === undefined
		)
			throw new Error(`Missing decoded parent child collection page data for ${shell.routePath}`)

		const optionalProps = [
			...(shell.sortMode === undefined ? [] : [
				`\t\tsortMode="${shell.sortMode}"`,
			]),
			...(shell.title === undefined ? [] : [
				`\t\ttitle="${shell.title}"`,
			]),
		].join('\n')

		return `<script lang="ts">
\timport { select } from '$/routes/+layout.svelte'
\t// Context
\timport { resolve } from '$app/paths'


\t// State
\tlet {
\t\tparams,
\t} = $props()


\t// Components
\timport Page from '$/components/Page.svelte'
\timport { EntityType } from '$/schema/EntityType.ts'
\timport ${shell.viewComponent} from '$/views/${viewFile}'
</script>


<Page>
\t<${shell.viewComponent}
\t\thref={resolve(${shell.hrefExpression})}
\t\tselection={select(
\t\t\tEntityType.${shell.entityType},
\t\t\t{
\t\t\t\t${shell.parentSelectorField}: decodeURIComponent(params.${shell.parentSelectorParam})${shell.parentSelectorTransform === 'lowercase' ? '.toLowerCase()' : ''},
\t\t\t}
\t\t).${shell.childField}}
\t\tid="${shell.id}"
${optionalProps === '' ? '' : `${optionalProps}
`}\t/>
</Page>
`
	}

	if (shell.kind === 'decoded-param-detail') {
		if (
			shell.viewComponent === undefined
			|| shell.entityType === undefined
			|| shell.parentSelectorField === undefined
			|| shell.parentSelectorParam === undefined
		)
			throw new Error(`Missing decoded param detail page data for ${shell.routePath}`)

		const selectorValueExpression = (
			shell.parentSelectorTransform === 'number' ?
				`Number(params.${shell.parentSelectorParam})`
			:
				`decodeURIComponent(params.${shell.parentSelectorParam})${shell.parentSelectorTransform === 'lowercase' ? '.toLowerCase()' : ''}`
		)

		return `<script lang="ts">
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { select } from '$/routes/+layout.svelte'
\t// State
\tlet {
\t\tparams,
\t} = $props()
${shell.blankLineBeforeComponents === false ? '' : '\n'}
\t// Components
\timport Page from '$/components/Page.svelte'
\timport ${shell.viewComponent} from '$/views/${viewFile}'
</script>


<Page>
\t<${shell.viewComponent}
\t\tselection={select(EntityType.${shell.entityType}, { ${shell.parentSelectorField}: ${selectorValueExpression} })}
\t${shell.title === undefined ? '' : `\ttitle={'${shell.title}'}
`}${shell.explicitClosingTag === false ? '\t/>' : `>
\t</${shell.viewComponent}>`}
</Page>
`
	}

	if (shell.kind === 'lens-account-detail') {
		if (
			shell.viewComponent === undefined
			|| shell.entityType === undefined
			|| shell.paramName === undefined
		)
			throw new Error(`Missing Lens account detail page data for ${shell.routePath}`)

		return `<script lang="ts">
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { select } from '$/routes/+layout.svelte'
\t// State
\tlet {
\t\tparams,
\t} = $props()

\tconst selector = $derived.by(() => {
\t\tconst raw = decodeURIComponent(params.${shell.paramName})
\t\tif (raw.startsWith('legacy:'))
\t\t\treturn { legacyProfileId: raw.slice('legacy:'.length) }

\t\tconst with0x = raw.startsWith('0x') ? raw : \`0x\${raw}\`
\t\tconst address = (
\t\t\thexLowerOfByteSize(with0x, 20)
\t\t\t?? (
\t\t\t\t/^0x[a-fA-F0-9]{40}$/i.test(with0x) ?
\t\t\t\t\thexLowerOfByteSize(\`0x\${with0x.slice(2).toLowerCase()}\`, 20)
\t\t\t\t:
\t\t\t\t\tundefined
\t\t\t)
\t\t)
\t\treturn address === undefined ? { localName: raw.replace(/^@/, '') } : { address }
\t})


\t// Functions
\timport { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'


\t// Components
\timport Page from '$/components/Page.svelte'
\timport ${shell.viewComponent} from '$/views/${viewFile}'
</script>


<Page>
\t<${shell.viewComponent}
\t\tselection={select(EntityType.${shell.entityType}, selector)}
\t/>
</Page>
`
	}

	if (shell.kind === 'param-heading') {
		if (shell.paramName === undefined)
			throw new Error(`Missing param heading page param for ${shell.routePath}`)

		return `<script lang="ts">
\t// State
\tlet {
\t\tparams,
\t} = $props()


\t// Components
\timport Page from '$/components/Page.svelte'
</script>


<Page>
\t<h1>{params.${shell.paramName}}</h1>
</Page>
`
	}

	if (shell.kind === 'data-selector-child-collection') {
		if (
			shell.viewComponent === undefined
			|| shell.entityType === undefined
			|| shell.childField === undefined
		)
			throw new Error(`Missing data selector child collection page data for ${shell.routePath}`)

		return `<script lang="ts">
\timport { select } from '$/routes/+layout.svelte'
\t// Types/constants
\timport type { PageProps } from './$types.ts'
\timport { EntityType } from '$/schema/EntityType.ts'
${shell.hrefExpression === undefined ? '' : `

\t// Context
\timport { resolve } from '$app/paths'

`
}
\tlet { data }: PageProps = $props()


\t// Components
\timport Page from '$/components/Page.svelte'
\timport ${shell.viewComponent} from '$/views/${shell.viewComponent}.svelte'
</script>


<Page>
\t<${shell.viewComponent}
${shell.hrefExpression === undefined ? '' : `\t\thref={${shell.hrefExpression}}
`}\t\tselection={select(
\t\t\tEntityType.${shell.entityType},
\t\t\tdata.selector
\t\t).${shell.childField}}
${shell.id === undefined ? '' : `\t\tid=${JSON.stringify(shell.id)}
`}${shell.title === undefined ? '' : `\t\ttitle=${JSON.stringify(shell.title)}
`}\t/>
</Page>
`
	}

	if (shell.kind === 'param-id-detail') {
		if (
			shell.viewComponent === undefined
			|| shell.entityType === undefined
			|| shell.paramName === undefined
		)
			throw new Error(`Missing param id detail page data for ${shell.routePath}`)

		return `<script lang="ts">
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { select } from '$/routes/+layout.svelte'
\t// ${shell.stateComment ?? 'State'}
\tlet {
\t\tparams,
\t} = $props()
${shell.blankLineBeforeComponents ? '\n' : ''}
\t// Components
${shell.viewImportBeforePage ? `\timport ${shell.viewComponent} from '$/views/${viewFile}'
\timport Page from '$/components/Page.svelte'` : `\timport Page from '$/components/Page.svelte'
\timport ${shell.viewComponent} from '$/views/${viewFile}'`}
</script>


<Page>
\t<${shell.viewComponent}
\t\tselection={select(EntityType.${shell.entityType}, { id: params.${shell.paramName} })}
\t/>
</Page>
`
	}

	if (shell.kind === 'param-selector-detail') {
		if (
			shell.viewComponent === undefined
			|| shell.entityType === undefined
			|| shell.selectorExpression === undefined
		)
			throw new Error(`Missing param selector detail page data for ${shell.routePath}`)

		return `${generatedParamSelectorPageHeader(shell)}
${shell.paramsMultiline ? `\tlet {
\t\tparams,
\t} = $props()` : '\tlet { params } = $props()'}
${shell.derivedConstants === undefined ? '' : `
${shell.derivedConstants.map((derivedConstant) => `\tconst ${derivedConstant.name} = $derived(${derivedConstant.expression})`).join('\n\n')}
`}

\t// Components
${shell.viewImportBeforePage ? `\timport ${shell.viewComponent} from '$/views/${viewFile}'
\timport Page from '$/components/Page.svelte'` : `\timport Page from '$/components/Page.svelte'
\timport ${shell.viewComponent} from '$/views/${viewFile}'`}
</script>


<Page>
${shell.componentIndentExtra ? '\t\t' : '\t'}<${shell.viewComponent}
${shell.componentIndentExtra ? '\t\t\t' : '\t\t'}selection={select(EntityType.${shell.entityType}, {
${shell.selectorExpression}
\t\t})}
${shell.limit === undefined ? '' : `${shell.componentIndentExtra ? '\t\t\t' : '\t\t'}limit={${shell.limit}}
`}${shell.explicitClosingTag ? `\t>
\t</${shell.viewComponent}>` : '\t/>'}
</Page>
`
	}

	if (shell.kind === 'scope-detail') {
		if (
			shell.viewComponent === undefined
			|| shell.entityType === undefined
			|| shell.scope === undefined
		)
			throw new Error(`Missing scope detail page data for ${shell.routePath}`)

		return `<script lang="ts">
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { select } from '$/routes/+layout.svelte'
\t// Components
\timport Page from '$/components/Page.svelte'
\timport ${shell.viewComponent} from '$/views/${viewFile}'
</script>


<Page>
\t<${shell.viewComponent}
\t\tselection={select(EntityType.${shell.entityType}, {
\t\t\tscope: ${quote(shell.scope)},
\t\t})}
\t/>
${shell.blankLineBeforePageClose ? '\n' : ''}</Page>
`
	}

	if (
		shell.viewComponent === undefined
		|| shell.entityType === undefined
	)
		throw new Error(`Missing data selector page data for ${shell.routePath}`)

	if (shell.viewFile !== undefined)
		return `<script lang="ts">
\t// Types/constants
\timport type { PageProps } from './$types.ts'
\timport { EntityType } from '$/schema/EntityType.ts'


\t// Context
\timport { select } from '$/routes/+layout.svelte'


\t// State
\tlet {
\t\tdata,
\t}: PageProps = $props()


\t// Components
\timport Page from '$/components/Page.svelte'
\timport ${shell.viewComponent} from '$/views/${viewFile}'
</script>


<Page>
\t<${shell.viewComponent}
\t\tselection={select(EntityType.${shell.entityType}, data.selector)}
\t/>
</Page>
`

	return `<script lang="ts">
\t// Types/constants
\timport type { PageProps } from './$types.ts'
\timport { EntityType } from '$/schema/EntityType.ts'


\t// State
\tlet {
\t\tdata,
\t}: PageProps = $props()


\t// Functions
\timport { select } from '$/routes/+layout.svelte'


\t// Components
\timport Page from '$/components/Page.svelte'
\timport ${shell.viewComponent} from '$/views/${shell.viewComponent}.svelte'
</script>


<Page>
\t<${shell.viewComponent}
\t\tselection={
\t\t\tselect(
\t\t\t\tEntityType.${shell.entityType},
\t\t\t\tdata.selector
\t\t\t)
\t\t}
\t/>
</Page>
`
}

const generatedAppShell = () => `<script module lang="ts">
\t// Polyfills
\timport '$/polyfills.ts'

\timport { QueryClient } from '@tanstack/query-core'
\timport {
\t\tcreateBrowserWASQLitePersistence,
\t\topenBrowserWASQLiteOPFSDatabase,
\t} from '@tanstack/browser-db-sqlite-persistence'
\timport { env } from '$env/dynamic/public'

\timport {
\t\tclient,
\t} from '$/client/$client.svelte.ts'
\timport {
\t\tcreateE2EClientInstrumentation,
\t\te2eDatabaseName,
\t\te2eSchemaVersion,
\t\tinstallAppClientProbe,
\t} from '$/client/$e2eProbe.ts'
\timport {
\t\tBLOCKHEAD_PERSISTED_COLLECTION_SCHEMA_VERSION,
\t\tBLOCKHEAD_WA_SQLITE_DATABASE_NAME,
\t} from '$/constants/Persistence.ts'
\timport { resolvers } from '$/resolvers/index.ts'
\timport { schema } from '$/schema/index.ts'
\timport { sourceProviders } from '$/sources/index.ts'

\tconst basePersistence = createBrowserWASQLitePersistence({
\t\tdatabase: await openBrowserWASQLiteOPFSDatabase({
\t\t\tdatabaseName: e2eDatabaseName(BLOCKHEAD_WA_SQLITE_DATABASE_NAME),
\t\t}),
\t\tschemaMismatchPolicy: 'reset',
\t})
\tconst e2eInstrumentation = createE2EClientInstrumentation(basePersistence)

\texport const appClient = client(
\t\t{
\t\t\tschema,
\t\t\tsourceProviders,
\t\t}
\t)(
\t\t{
\t\t\tresolvers,
\t\t\tenv,
\t\t}
\t)(
\t\t{
\t\t\tqueryClient: new QueryClient({
\t\t\t\tdefaultOptions: {
\t\t\t\t\tqueries: {
\t\t\t\t\t\tgcTime: 0,
\t\t\t\t\t},
\t\t\t\t},
\t\t\t}),
\t\t\tpersistence: e2eInstrumentation.persistence,
\t\t\tschemaVersion: e2eSchemaVersion(BLOCKHEAD_PERSISTED_COLLECTION_SCHEMA_VERSION),
\t\t\twaitForPersistence: e2eInstrumentation.waitForPersistence,
\t\t}
\t)

\texport const select = appClient.select
</script>


<script lang="ts">
\t// Types/constants
\timport '$/styles/fonts.css'
\timport '$/styles/colors.css'
\timport '$/styles/reset.css'
\timport '$/styles/components.css'


\t// View transitions


\t// Context
\timport {
\t\tmountWalletConnectionRuntime,
\t} from '$/state/wallets/walletConnectionRuntime.svelte.ts'
\timport { useNavigationItems } from './navigationItems.svelte.ts'


\t// State
\tlet {
\t\tchildren,
\t} = $props()

\tinstallAppClientProbe(appClient)

\t$effect(() => (
\t\tmountWalletConnectionRuntime(appClient)
\t\t\t.destroy
\t))

\t// Components
\timport Navigation from './Navigation.svelte'


\t// Functions
\timport { asset } from '$app/paths'
</script>


<svelte:head>
\t<link
\t\trel="icon"
\t\thref={asset('/favicon.svg')}
\t/>
</svelte:head>


<div
\tid="layout"
\tdata-scroll-container="layout-inline-panes snap-inline"
\tdata-sticky-container
>
\t<a
\t\thref="#main"
\t\tclass="skip-link"
\t>
\t\tSkip to main content
\t</a>

\t<Navigation
\t\tnavigationItems={useNavigationItems().navigationItems}
\t/>

\t<div
\t\tid="main"
\t\ttabindex="-1"
\t\tdata-scroll-item="pane-flexible"
\t\tdata-sticky-container
\t\tdata-column
\t>
\t\t<div
\t\t\tclass="layout-main"
\t\t\tdata-column-item="flexible"
\t\t\tdata-column
\t\t>
\t\t\t{@render children()}
\t\t</div>
\t</div>
</div>


<style>
\t#layout {
\t\t--navigation-desktop-inlineSize: 16rem;
\t\t--navigation-mobile-blockSize: 4rem;

\t\tinline-size: 100dvw;
\t\tblock-size: 100dvh;
\t\tpadding: var(--safeArea-insetTop) var(--safeArea-insetRight) var(--safeArea-insetBottom) var(--safeArea-insetLeft);
\t\talign-items: start;
\t\tgap: var(--separator-width);

\t\t&[data-scroll-container] {
\t\t\t--sticky-paddingBlockStart: var(--safeArea-insetTop);
\t\t\t--sticky-paddingBlockEnd: var(--safeArea-insetBottom);
\t\t\t--sticky-paddingInlineStart: var(--safeArea-insetLeft);
\t\t\t--sticky-paddingInlineEnd: var(--safeArea-insetRight);
\t\t}

\t\t@media (width >= 60rem) {
\t\t\t&[data-scroll-container~='layout-inline-panes'] {
\t\t\t\t--scrollPanes-paneStatic-inlineSize: var(--navigation-desktop-inlineSize);
\t\t\t}
\t\t}

\t\t> :global(.layout-nav) {
\t\t\tbox-shadow: 0 0 0 var(--separator-width) var(--border-color);
\t\t}

\t\t> #main {
\t\t\t--sticky-paddingInlineStart: clamp(1rem, 6cqi, 2rem);
\t\t\t--sticky-paddingInlineEnd: clamp(1rem, 6cqi, 2rem);
\t\t\t--sticky-paddingBlockStart: 1.5rem;
\t\t\t--sticky-paddingBlockEnd: 1.5rem;

\t\t\talign-self: stretch;
\t\t\tpadding: 1.5rem;

\t\t\t> .layout-main {
\t\t\t\tview-transition-name: Main;

\t\t\t\tmin-height: calc(100% - 3rem);

\t\t\t\t> :global([data-scroll-container]:only-child) {
\t\t\t\t\t--scrollContainer-sizeBlock: calc(100cqb - 3rem);
\t\t\t\t}
\t\t\t}
\t\t}
\t}


\t.skip-link {
\t\tposition: absolute;
\t\ttop: -100%;
\t\tleft: 0;
\t\tpadding: 0.5em 1em;
\t\tbackground: var(--color-bg-page);
\t\tz-index: 1000;
\t\tcolor: var(--color-fg);

\t\t&:focus {
\t\t\ttop: 0;
\t\t}
\t}

\t::view-transition-old(Main) {
\t\tanimation: 0.2s var(--transition-easeOutExpo) both MainTransitionOut;
\t}
\t::view-transition-new(Main) {
\t\tanimation: 0.2s var(--transition-easeOutExpo) both MainTransitionIn;
\t}
\t@keyframes MainTransitionIn {
\t\tfrom {
\t\t\topacity: 0;
\t\t\tscale: 0.95;
\t\t\tfilter: blur(2px);
\t\t}
\t}
\t@keyframes MainTransitionOut {
\t\tto {
\t\t\topacity: 0;
\t\t\tscale: 0.95;
\t\t\tfilter: blur(2px);
\t\t}
\t}
</style>
`

const generatedRouteSectionShell = (
	shell: ExpectedApp['routes']['sectionShells'][number]
) => {
	if (shell.kind === 'app-shell')
		return generatedAppShell()

	if (shell.kind === 'custom') {
		if (shell.sourceText === undefined)
			throw new Error(`Missing custom route section source for ${shell.routePath}`)

		return shell.sourceText
	}

	if (shell.kind === 'passthrough')
		return `<script lang="ts">
\t// State
\tlet { children } = $props()
</script>


{@render children()}
`

	if (shell.kind === 'page-param-parent-collapsible') {
		if (
			shell.hrefExpression === undefined
			|| shell.idExpression === undefined
		)
			throw new Error(`Missing page-param parent collapsible data for ${shell.routePath}`)

		return `<script lang="ts">
\t// Context
\timport { resolve } from '$app/paths'
\timport { page } from '$app/state'


\t// State
\tlet {
\t\tchildren,
\t} = $props()


\t// Components
\timport ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
${shell.titleExpression === undefined ? shell.title === undefined ? '' : `\ttitle=${JSON.stringify(shell.title)}
` : `\ttitle={${shell.titleExpression}}
`}\thref={${shell.hrefExpression}}
\tid={${shell.idExpression}}
>
\t{@render children()}
</ParentPageCollapsible>
`
	}

	if (shell.kind === 'nested-parent-collapsible') {
		if (
			shell.nestedParents === undefined
			|| shell.nestedParents.length !== 2
			|| shell.childrenName === undefined
		)
			throw new Error(`Missing nested parent collapsible data for ${shell.routePath}`)

		return `<script lang="ts">
\timport { eip155NetworkSelectorFromCaip2 } from '$/lib/caip2.ts'
\t// Types/constants
\timport type { Snippet } from 'svelte'
\timport { stringify } from 'devalue'


\t// Context
\timport { resolve } from '$app/paths'


\t// State
\tlet {
\t\tchildren: ${shell.childrenName},
\t\tparams,
\t}: {
\t\tchildren: Snippet
\t\tparams: {
\t\t\tcaip2: \`eip155:\${string}\`
\t\t\ttransactionId?: string
\t\t}
\t} = $props()


\t// Components
\timport ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
\ttitle="${shell.nestedParents[0].title}"
\thref={${shell.nestedParents[0].hrefExpression}}
\tid={${shell.nestedParents[0].idExpression}}
>
\t<ParentPageCollapsible
\t\ttitle="${shell.nestedParents[1].title}"
\t\thref={${shell.nestedParents[1].hrefExpression}}
\t\tid={${shell.nestedParents[1].idExpression}}
\t>
\t\t{@render ${shell.childrenName}()}
\t</ParentPageCollapsible>
</ParentPageCollapsible>
`
	}

	if (shell.kind === 'proposal-parent-collapsible') {
		if (
			shell.viewComponent === undefined
			|| shell.entityType === undefined
			|| shell.proposalLevel === undefined
			|| shell.hrefExpression === undefined
			|| shell.idExpression === undefined
		)
			throw new Error(`Missing proposal parent section data for ${shell.routePath}`)

		const viewFile = shell.viewFile ?? `${shell.viewComponent}.svelte`
		const constantsImport = shell.proposalLevel === 'realm' ? `\timport { specificationRealmBySlug } from '$/constants/SpecificationProposal.ts'` : `\timport {
\t\tproposalCategoryBySlug,
\t\tproposalKindAllowedInRealmByKey,
\t\tspecificationRealmBySlug,
\t} from '$/constants/SpecificationProposal.ts'`
		const selectorSource = shell.proposalLevel === 'realm' ? `\tconst selector = $derived(
\t\tparams.specificationRealmSlug in specificationRealmBySlug ?
\t\t\t{
\t\t\t\trealm: specificationRealmBySlug[params.specificationRealmSlug]!.id,
\t\t\t}
\t\t:
\t\t\tundefined,
\t)` : `\tconst realm = $derived(
\t\tspecificationRealmBySlug[params.specificationRealmSlug]?.id,
\t)

\tconst category = $derived(
\t\tproposalCategoryBySlug[params.proposalKindSlug]?.id,
\t)

\tconst selector = $derived(
\t\trealm != null && category != null && proposalKindAllowedInRealmByKey[\`\${realm}:\${category}\`] != null ?
\t\t\t{
\t\t\t\trealm,
\t\t\t\tcategory,
\t\t\t}
\t\t:
\t\t\tundefined,
\t)`

		return `<script lang="ts">
${shell.proposalLevel === 'realm' ? `\timport { EntityType } from '$/schema/EntityType.ts'
\timport { select } from '$/routes/+layout.svelte'
\t// Types/constants
${constantsImport}
\timport { stringify } from 'devalue'` : `\t// Types/constants
${constantsImport}
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { select } from '$/routes/+layout.svelte'

\timport { stringify } from 'devalue'`}


\t// Context
\timport { resolve } from '$app/paths'


\t// State
\tlet {
\t\tchildren,
\t\tparams,
\t} = $props()

${selectorSource}


\t// Components
\timport { EntityLayout } from '$/components/EntityView.svelte'
\timport ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
\timport ${shell.viewComponent} from '$/views/${viewFile}'
</script>


{#if selector !== undefined}
\t<ParentPageCollapsible
\t\thref={${shell.hrefExpression}}
\t\tid={${shell.idExpression}}
\t>
\t\t{#snippet Summary({ open: _open })}
\t\t\t<${shell.viewComponent}
\t\t\t\tselection={select(EntityType.${shell.entityType}, selector)}
\t\t\t\tlayout={EntityLayout.SummaryInline}
\t\t\t/>
\t\t{/snippet}

\t\t{@render children()}
\t</ParentPageCollapsible>
{:else}
\t{@render children()}
{/if}
`
	}

	if (shell.kind === 'atproto-actor-parent-collapsible')
		return `<script lang="ts">
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { select } from '$/routes/+layout.svelte'
\t// Context
\timport { resolve } from '$app/paths'
\timport { page } from '$app/state'


\t// State
\tlet { children } = $props()

\tconst did = $derived(
\t\tpage.params.did ?? '',
\t)


\t// Components
\timport { EntityLayout } from '$/components/EntityView.svelte'
\timport AtprotoActorView from '$/views/AtprotoActorView.svelte'
\timport ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
\thref={resolve('/(social)/(atproto)/atproto/actor/[did]', {
\t\tdid: encodeURIComponent(did),
\t})}
\tid={did}
>
\t\t{#snippet Summary({ open: _open })}
\t\t\t<AtprotoActorView
\t\t\t\tselection={select(EntityType.AtprotoActor, decodeURIComponent(did).startsWith('did:') ?
\t\t\t\t\t\t{ did: decodeURIComponent(did) }
\t\t\t\t\t:
\t\t\t\t\t\t{ handle: decodeURIComponent(did) })}
\t\t\t\tlayout={EntityLayout.SummaryInline}
\t\t\t/>
\t{/snippet}

\t{@render children()}
</ParentPageCollapsible>
`

	if (shell.kind === 'lens-account-parent-collapsible')
		return `<script lang="ts">
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { select } from '$/routes/+layout.svelte'
\t// Context
\timport { resolve } from '$app/paths'
\timport { page } from '$app/state'


\t// State
\tlet { children } = $props()

\tconst address = $derived(
\t\tpage.params.address ?? '',
\t)
\tconst selector = $derived.by(() => {
\t\tconst raw = decodeURIComponent(address)
\t\tif (raw.startsWith('legacy:'))
\t\t\treturn { legacyProfileId: raw.slice('legacy:'.length) }

\t\tconst with0x = raw.startsWith('0x') ? raw : \`0x\${raw}\`
\t\tconst parsedAddress = (
\t\t\thexLowerOfByteSize(with0x, 20)
\t\t\t?? (
\t\t\t\t/^0x[a-fA-F0-9]{40}$/i.test(with0x) ?
\t\t\t\t\thexLowerOfByteSize(\`0x\${with0x.slice(2).toLowerCase()}\`, 20)
\t\t\t\t:
\t\t\t\t\tundefined
\t\t\t)
\t\t)
\t\treturn parsedAddress === undefined ?
\t\t\t{ localName: raw.replace(/^@/, '') }
\t\t:
\t\t\t{ address: parsedAddress }
\t})


\t// Functions
\timport { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'


\t// Components
\timport { EntityLayout } from '$/components/EntityView.svelte'
\timport LensAccountView from '$/views/LensAccountView.svelte'
\timport ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
\thref={resolve('/(social)/(lens)/lens/account/[address=evmAddress]', {
\t\taddress: encodeURIComponent(address),
\t})}
\tid={address}
>
\t{#snippet Summary({ open: _open })}
\t\t<LensAccountView
\t\t\tselection={select(EntityType.LensAccount, selector)}
\t\t\tlayout={EntityLayout.SummaryInline}
\t\t/>
\t{/snippet}

\t{@render children()}
</ParentPageCollapsible>
`

	if (shell.kind === 'eip155-network-upgrade-parent-collapsible')
		return `<script lang="ts">
\timport { eip155NetworkSelectorFromCaip2 } from '$/lib/caip2.ts'
\t// Types/constants
\timport {
\t\tethereumMainnetNetworkUpgradeSlugAliasBySegmentSlug,
\t\tnetworkUpgrades,
\t} from '$/constants/EthereumNetworkUpgrades.ts'
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { select } from '$/routes/+layout.svelte'

\timport { stringify } from 'devalue'


\t// Context
\timport { resolve } from '$app/paths'


\t// State
\tlet {
\t\tchildren,
\t\tparams,
\t} = $props()

\timport { evmChainIdFromCaip2 } from '$/lib/caip.ts'

\tconst chainId = $derived(evmChainIdFromCaip2(params.caip2))

\tconst resolvedUpgradeId = $derived(
\t\t(() => {
\t\t\tconst segment = params.upgradeSlug
\t\t\tconst direct = networkUpgrades.find((networkUpgrade) => {
\t\t\t\tif (networkUpgrade.chainId !== chainId) return false
\t\t\t\tconst slug = (
\t\t\t\t\tnetworkUpgrade.slug.length > 0 ?
\t\t\t\t\t\tnetworkUpgrade.slug
\t\t\t\t\t:
\t\t\t\t\t\tString(networkUpgrade.upgradeId).toLowerCase().replace(/\\s+/g, '-')
\t\t\t\t)
\t\t\t\tconst { upgradeId } = networkUpgrade
\t\t\t\tconst segmentSlug = String(segment).toLowerCase().replace(/\\s+/g, '-')
\t\t\t\tconst slugSegment = String(slug).toLowerCase().replace(/\\s+/g, '-')
\t\t\t\tconst upgradeIdSegment = String(upgradeId).toLowerCase().replace(/\\s+/g, '-')
\t\t\t\treturn (
\t\t\t\t\tsegment === upgradeId
\t\t\t\t\t|| segment === slug
\t\t\t\t\t|| segment.toLowerCase() === upgradeId.toLowerCase()
\t\t\t\t\t|| segment.toLowerCase() === slug.toLowerCase()
\t\t\t\t\t|| segmentSlug === slugSegment
\t\t\t\t\t|| segmentSlug === upgradeIdSegment
\t\t\t\t)
\t\t\t})?.upgradeId

\t\t\tif (direct != null) {
\t\t\t\treturn direct
\t\t\t}

\t\t\tif (
\t\t\t\tchainId === 1
\t\t\t\t|| chainId === 11_155_111
\t\t\t\t|| chainId === 17_000
\t\t\t) {
\t\t\t\tconst aliasRow = ethereumMainnetNetworkUpgradeSlugAliasBySegmentSlug[
\t\t\t\t\tString(segment).toLowerCase().replace(/\\s+/g, '-')
\t\t\t\t]
\t\t\t\tif (aliasRow != null) {
\t\t\t\t\treturn (
\t\t\t\t\t\tnetworkUpgrades.find((networkUpgrade) => (
\t\t\t\t\t\t\tnetworkUpgrade.chainId === chainId
\t\t\t\t\t\t\t&& networkUpgrade.upgradeId === aliasRow.umbrellaUpgradeId
\t\t\t\t\t\t))
\t\t\t\t\t\t?.upgradeId
\t\t\t\t\t)
\t\t\t\t}
\t\t\t}

\t\t\treturn undefined
\t\t})() ?? params.upgradeSlug,
\t)


\t// Components
\timport ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
\timport NetworkUpgradeView from '$/views/EthereumNetworkUpgradeView.svelte'


\t// Components
\timport { EntityLayout } from '$/components/EntityView.svelte'
</script>


<ParentPageCollapsible
\thref={resolve(
\t\t\t'/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(upgrades)/upgrade/[upgradeSlug]',
\t\t{
\t\t\tcaip2: params.caip2,
\t\t\tupgradeSlug: params.upgradeSlug,
\t\t},
\t)}
\tid={stringify({
\t\t$network: eip155NetworkSelectorFromCaip2(params.caip2),
\t\tupgradeId: resolvedUpgradeId,
\t})}
>
\t{#snippet Summary({ open: _open })}
\t\t<NetworkUpgradeView
\t\t\tselection={select(EntityType.EthereumNetworkUpgrade, {
\t\t\t\t$network: eip155NetworkSelectorFromCaip2(params.caip2),
\t\t\t\tupgradeId: resolvedUpgradeId,
\t\t\t})}
\t\t\tlayout={EntityLayout.SummaryInline}
\t\t/>
\t{/snippet}

\t{@render children()}
</ParentPageCollapsible>
`

	if (shell.kind === 'scope-summary-collapsible') {
		if (
			shell.viewComponent === undefined
			|| shell.entityType === undefined
			|| shell.scope === undefined
			|| shell.hrefExpression === undefined
			|| shell.idExpression === undefined
		)
			throw new Error(`Missing scope summary section data for ${shell.routePath}`)

		return `<script lang="ts">
\t// Types/constants
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { stringify } from 'devalue'


\t// Context
\timport { resolve } from '$app/paths'


\t// State
\tlet { children } = $props()


\t// Functions
\timport { select } from '$/routes/+layout.svelte'


\t// Components
\timport { EntityLayout } from '$/components/EntityView.svelte'
\timport ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
\timport ${shell.viewComponent} from '$/views/${shell.viewComponent}.svelte'
</script>


<ParentPageCollapsible
\thref={${shell.hrefExpression}}
\tid={${shell.idExpression}}
>
\t{#snippet Summary({ open: _open })}
\t\t<${shell.viewComponent}
\t\t\tselection={
\t\t\t\tselect(
\t\t\t\t\tEntityType.${shell.entityType},
\t\t\t\t\t{
\t\t\t\t\t\tscope: ${quote(shell.scope)},
\t\t\t\t\t}
\t\t\t\t)
\t\t\t}
\t\t\tlayout={EntityLayout.SummaryInline}
\t\t/>
\t{/snippet}

\t{@render children()}
</ParentPageCollapsible>
`
	}

	if (shell.kind === 'param-summary-collapsible') {
		if (
			shell.viewComponent === undefined
			|| shell.selectorExpression === undefined
			|| shell.hrefExpression === undefined
			|| shell.idExpression === undefined
		)
			throw new Error(`Missing param summary section data for ${shell.routePath}`)

		return `<script lang="ts">
\t// Types/constants
\timport { EntityType } from '$/schema/EntityType.ts'
${shell.usesStringify ? "\timport { stringify } from 'devalue'" : ''}


\t// Context
\timport { resolve } from '$app/paths'


\t// State
\tlet {
\t\tchildren,
\t\tparams,
\t} = $props()
${shell.derivedConstants === undefined ? '' : `
${shell.derivedConstants.map((derivedConstant) => `\tconst ${derivedConstant.name} = $derived(
\t\t${derivedConstant.expression},
\t)`).join('\n\n')}
`}

\t// Functions
${shell.usesEip155NetworkSelectorFromCaip2 ? "\timport { eip155NetworkSelectorFromCaip2 } from '$/lib/caip2.ts'\n" : ''}\timport { select } from '$/routes/+layout.svelte'


\t// Components
\timport { EntityLayout } from '$/components/EntityView.svelte'
\timport ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
\timport ${shell.viewComponent} from '$/views/${shell.viewComponent}.svelte'
</script>


<ParentPageCollapsible
${shell.hrefWrapped === true ? `\thref={
\t\t${shell.hrefExpression}
\t}` : `\thref={${shell.hrefExpression}}`}
\tid={${shell.idExpression}}
>
\t{#snippet Summary({ open: _open })}
\t\t<${shell.viewComponent}
\t\t\tselection={
\t\t\t\tselect(
${shell.selectorExpression}
\t\t\t\t)
\t\t\t}
\t\t\tlayout={EntityLayout.SummaryInline}
\t\t/>
\t{/snippet}

\t{@render children()}
</ParentPageCollapsible>
`
	}

	if (shell.kind === 'keyed-param-summary-collapsible') {
		if (
			shell.viewComponent === undefined
			|| shell.selectorExpression === undefined
			|| shell.hrefExpression === undefined
			|| shell.idExpression === undefined
			|| shell.keyExpression === undefined
		)
			throw new Error(`Missing keyed param summary section data for ${shell.routePath}`)

		return `<script lang="ts">
\t// Types/constants
\timport { EntityType } from '$/schema/EntityType.ts'
\timport { stringify } from 'devalue'
${shell.usesEip155NetworkSelectorFromCaip2 ? "\timport { eip155NetworkSelectorFromCaip2 } from '$/lib/caip2.ts'\n" : ''}

\t// Context
\timport { resolve } from '$app/paths'


\t// State
\tlet {
\t\tchildren,
\t\tparams,
\t} = $props()


\t// Functions
\timport { select } from '$/routes/+layout.svelte'


\t// Components
\timport { EntityLayout } from '$/components/EntityView.svelte'
\timport ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
\timport ${shell.viewComponent} from '$/views/${shell.viewComponent}.svelte'
</script>


{#key ${shell.keyExpression}}
\t<ParentPageCollapsible
\t\thref={${shell.hrefExpression}}
\t\tid={${shell.idExpression}}
\t>
\t\t{#snippet Summary({ open: _open })}
\t\t\t<${shell.viewComponent}
\t\t\t\tselection={
\t\t\t\t\tselect(
${shell.selectorExpression}
\t\t\t\t\t)
\t\t\t\t}
\t\t\t\tlayout={EntityLayout.SummaryInline}
\t\t\t/>
\t\t{/snippet}

\t\t{@render children()}
\t</ParentPageCollapsible>
{/key}
`
	}

	if (shell.kind === 'page-param-summary-collapsible') {
		if (
			shell.viewComponent === undefined
			|| shell.derivedConstants === undefined
			|| shell.selectorExpression === undefined
			|| shell.hrefExpression === undefined
			|| shell.idExpression === undefined
		)
			throw new Error(`Missing page-param summary section data for ${shell.routePath}`)

		return `<script lang="ts">
\t// Types/constants
\timport { EntityType } from '$/schema/EntityType.ts'


\t// Context
\timport { resolve } from '$app/paths'
\timport { page } from '$app/state'


\t// State
\tlet { children } = $props()

${shell.derivedConstants.map((derivedConstant) => `\tconst ${derivedConstant.name} = $derived(
\t\t${derivedConstant.expression},
\t)`).join('\n\n')}


\t// Functions
\timport { select } from '$/routes/+layout.svelte'


\t// Components
\timport { EntityLayout } from '$/components/EntityView.svelte'
\timport ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
\timport ${shell.viewComponent} from '$/views/${shell.viewComponent}.svelte'
</script>


<ParentPageCollapsible
\thref={${shell.hrefExpression}}
\tid={${shell.idExpression}}
>
\t{#snippet Summary({ open: _open })}
\t\t<${shell.viewComponent}
\t\t\tselection={
\t\t\t\tselect(
${shell.selectorExpression}
\t\t\t\t)
\t\t\t}
\t\t\tlayout={EntityLayout.SummaryInline}
${shell.viewTitle === undefined ? '\t\t/>' : `\t\t\ttitle="${shell.viewTitle}"
\t\t/>`}
\t{/snippet}

\t{@render children()}
</ParentPageCollapsible>
`
	}

	if (shell.hrefExpression === undefined)
		throw new Error(`Missing parent collapsible href for ${shell.routePath}`)

	return `<script lang="ts">${shell.usesEip155NetworkSelectorFromCaip2 ? `
\timport { eip155NetworkSelectorFromCaip2 } from '$/lib/caip2.ts'` : ''}${shell.usesStringify ? `
\t// Types/constants
\timport { stringify } from 'devalue'

` : ''}
\t// Context
\timport { resolve } from '$app/paths'


\t// State
\tlet {${shell.usesParams ? `
\t\tchildren,
\t\tparams,
\t}` : ' children }'} = $props()


\t// Components
\timport ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
${shell.titleExpression === undefined ? shell.title === undefined ? '' : `\ttitle=${JSON.stringify(shell.title)}
` : `\ttitle={${shell.titleExpression}}
`}\thref={${shell.hrefExpression}}
${shell.idExpression === undefined ? '' : `\tid=${shell.idExpression.startsWith('\'') || shell.idExpression.startsWith('"') ? JSON.stringify(shell.idExpression.slice(1, -1)) : `{${shell.idExpression}}`}
`}>\n\t{@render children()}
</ParentPageCollapsible>
`
}

export const generateExpected = async () => {
	const app: ExpectedApp = loadApp()
	const ownershipRows = generatedOwnership()
	const summary = ownershipSummary(ownershipRows)
	const emittedRouteMappings = emittedSelectorRouteMappings(app)

	rmSync('.generated/expected', {
		force: true,
		recursive: true,
	})

	writeText('.generated/expected/APP.snapshot.json', json(app))
	writeText('.generated/expected/SCHEMA.md', schemaMarkdown(app))
	writeText('.generated/expected/RESOLVER-COVERAGE.md', resolverCoverageMarkdown(app))
	writeText('.generated/expected/SOURCES.md', sourcesMarkdown(app))
	writeText('.generated/expected/src/schema/schema.json', json(app.schema))
	writeText('.generated/expected/src/schema/EntityType.ts', generatedEntityTypeFile(app))
	writeText('.generated/expected/src/schema/index.ts', generatedSchemaIndexFile(app))
	for (const entity of app.schema.entities)
		writeText(`.generated/expected/src/schema/${entity.name}.ts`, generatedEntitySchemaFile(entity))
	writeText('.generated/expected/src/views/index.ts', generatedViewsIndexFile(app))
	for (const shell of app.views.entityViewShells) {
		const entity = app.schema.entities.find((candidate) => candidate.name === shell.entity)

		if (entity === undefined)
			throw new Error(`Missing schema entity for view shell ${shell.entity}`)

		writeText(`.generated/expected/${shell.file}`, shell.sourceText ?? generatedEntityViewShellSource(entity, shell))
	}
	writeText('.generated/expected/src/sources/sources.json', json(app.sources))
	writeText('.generated/expected/src/resolvers/resolvers.json', json(app.resolvers))
	writeText('.generated/expected/src/views/views.json', json(app.views))
	writeText('.generated/expected/src/routes/routes.json', json(app.routes))
	writeText('.generated/expected/src/routes/entity-selector-route-leaves.ts', generatedSelectorRouteLeavesFile(app))
	writeText('.generated/expected/src/routes/entity-hub-collection-routes.ts', generatedHubCollectionRoutesFile(app))
	for (const transform of app.routes.loaderTransforms)
		writeText(`.generated/expected/src/routes/${transform.routePath}/+page.ts`, generatedRoutePageModule(transform))
	for (const shell of app.routes.pageShells)
		writeText(`.generated/expected/src/routes/${shell.routePath}/+page.svelte`, generatedRoutePageShell(shell))
	for (const shell of app.routes.sectionShells)
		writeText(`.generated/expected/src/routes/${shell.routePath}/+layout.svelte`, generatedRouteSectionShell(shell))
	for (const mapping of emittedRouteMappings) {
		writeText(`.generated/expected/src/routes/${mapping.path}/+page.svelte`, generatedRoutePage(app, mapping))
	}
	writeText('.generated/expected/tests/probes.json', json(app.probes))
	writeText('.generated/expected/ownership.json', json(ownershipRows))
	writeText('.generated/expected/ownership-summary.json', json(summary))
	writeText('.generated/expected/README.md', [
		'# Generated Expected Output',
		'',
		'This directory is generated from APP.ts.',
		'It is intentionally outside src/** so generation stays separate from app runtime code.',
		'',
		`Schema entities: ${app.schema.entities.length}`,
		`Source providers: ${app.sources.providers.length}`,
		`Source bindings: ${app.sources.bindings.length}`,
		`Resolver coverage rows: ${app.resolvers.coverage.length}`,
		`Entity views: ${app.views.entityViews.length}`,
		`Route pages: ${app.routes.pages.length}`,
		`Expected emitted route leaf pages: ${emittedRouteMappings.length}`,
		`Ownership rows: ${ownershipRows.length}`,
		`Generated-owned rows: ${summary.generated}`,
		`Hand-owned rows preserved: ${summary.handOwned}`,
		`Hand-owned entity views remaining: ${summary.remainingHandOwnedGeneratedSurface.views}`,
		`Hand-owned route pages remaining: ${summary.remainingHandOwnedGeneratedSurface.routes}`,
		`Hand-owned route sections remaining: ${summary.remainingHandOwnedGeneratedSurface.routeSections}`,
	].join('\n'))

	console.log('Generated .generated/expected from APP.ts')
}
