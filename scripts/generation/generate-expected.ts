import { loadApp } from './load-app.ts'
import { generatedOwnership } from './ownership.ts'
import { writeText } from './files.ts'

type ExpectedApp = {
	docs: {
		resolverCoverageMarkdown: string
		sourcesMarkdown: string
	}
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
	}
	resolvers: {
		coverage: {
			source: string
			entity: string
			status: string
		}[]
	}
	views: {
		entityViews: {
			entity: string
			kind: 'singular' | 'plural'
			file: string
			ownership: string
		}[]
	}
	routes: {
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
	'Generated from APP.ts.',
	'',
	'| Source | Entity | State |',
	'|---|---|---|',
	...app.resolvers.coverage.map((coverage) => `| \`${coverage.source}\` | \`${coverage.entity}\` | ${coverage.status} |`),
].join('\n')

const sourceMarkdown = (app: ExpectedApp) => [
	'# Sources',
	'',
	'Generated from APP.ts.',
	'',
	'## Providers',
	'',
	...app.sources.providers.map((provider) => `- \`${provider.id}\``),
	'',
	'## Sources',
	'',
	...app.sources.sources.map((source) => `- \`${source.id}\` (${source.provider})`),
	'',
	'## Schema Source Bindings',
	'',
	...app.sources.bindings.map((binding) => `- \`${binding.id}\` -> \`${binding.target}\``),
].join('\n')

export const generateExpected = async () => {
	const app: ExpectedApp = loadApp()

	writeText('.generated/expected/APP.snapshot.json', json(app))
	writeText('.generated/expected/SCHEMA.md', schemaMarkdown(app))
	writeText('.generated/expected/RESOLVER-COVERAGE.md', app.docs.resolverCoverageMarkdown)
	writeText('.generated/expected/SOURCES.md', app.docs.sourcesMarkdown)
	writeText('.generated/expected/src/schema/schema.json', json(app.schema))
	writeText('.generated/expected/src/schema/EntityType.ts', generatedEntityTypeFile(app))
	writeText('.generated/expected/src/schema/index.ts', generatedSchemaIndexFile(app))
	for (const entity of app.schema.entities)
		writeText(`.generated/expected/src/schema/${entity.name}.ts`, generatedEntitySchemaFile(entity))
	writeText('.generated/expected/src/views/index.ts', generatedViewsIndexFile(app))
	writeText('.generated/expected/src/sources/sources.json', json(app.sources))
	writeText('.generated/expected/src/resolvers/resolvers.json', json(app.resolvers))
	writeText('.generated/expected/src/views/views.json', json(app.views))
	writeText('.generated/expected/src/routes/routes.json', json(app.routes))
	writeText('.generated/expected/tests/probes.json', json(app.probes))
	writeText('.generated/expected/ownership.json', json(generatedOwnership()))
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
		`Ownership rows: ${generatedOwnership().length}`,
	].join('\n'))

	console.log('Generated .generated/expected from APP.ts')
}
