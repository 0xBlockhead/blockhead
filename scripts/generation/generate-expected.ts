import { rmSync } from 'node:fs'

import { loadApp } from './load-app.ts'
import { generatedOwnership, ownershipSummary } from './ownership.ts'
import { writeText } from './files.ts'

type ExpectedApp = {
	schema: {
		entities: {
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
		pageShells: {
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
			stateComment?: string
			blankLineBeforeComponents?: boolean
			blankLineBeforePageClose?: boolean
			viewImportBeforePage?: boolean
			sources?: string[]
			sourceText?: string
			sourceFile: string
		}[]
		sectionShells: {
			routePath: string
			visiblePath: string
			routeGroupPath: string
			components: string[]
			usesDataSelector: boolean
			usesParams: boolean
			usesSelect: boolean
			kind: 'app-shell' | 'parent-collapsible' | 'nested-parent-collapsible' | 'page-param-parent-collapsible' | 'param-summary-collapsible' | 'keyed-param-summary-collapsible' | 'scope-summary-collapsible' | 'page-param-summary-collapsible' | 'proposal-parent-collapsible' | 'passthrough' | 'custom'
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

const schemaMarkdown = (app: ExpectedApp) => [
	'# Blockhead Schema',
	'',
	'Schema Language v1. `SCHEMA.md` is the schema design source of truth. Run `pnpm run schema:sync` after editing it, and run `pnpm run schema:check` in review to verify that `SCHEMA.md` and `src/schema/**` agree.',
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
		...(entity.notes === undefined ? [] : [
			`    Notes :: ${entity.notes}`,
		]),
		'',
	]),
	'```',
].join('\n')

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

const generatedEntityViewShellSource = (
	entity: ExpectedApp['schema']['entities'][number]
) => {
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

const generatedRoutePageShell = (
	shell: ExpectedApp['routes']['pageShells'][number]
) => {
	const viewFile = shell.viewFile ?? `${shell.viewComponent}.svelte`

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

		writeText(`.generated/expected/${shell.file}`, shell.sourceText ?? generatedEntityViewShellSource(entity))
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
