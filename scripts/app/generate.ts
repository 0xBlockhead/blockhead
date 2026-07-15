import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { parse as parseSvelte } from 'svelte/compiler'
import ts from 'typescript'

import {
	renderGeneratedFile,
	type GeneratedFile,
	type ImportName,
	type ImportPlan as ImportSpec,
	type SvelteFilePlan as SvelteFileAst,
	type TypeScriptFilePlan as TsFileAst,
} from './render.ts'

import {
	ApiFamily,
	EntityFieldCardinality,
	EntityFieldType,
	EntityType,
	SourceArtifactKind,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	sourceBindingCompatibility,
	_ListEntityRow,
	_ExpressionDecode,
	_ViewItemKind,
	type _AppFacetCondition,
	type _Expression,
	type _FieldReference,
	type _Import,
	type _ListView,
	type _RawSnippet,
	type _RouteParamTransform,
	type _SourceSelection,
	type _ViewItem,
	type _ViewListSection,
	type _ViewQuery,
	type App,
	app,
} from '../../APP.ts'


type Entity = App['schema']['entities'][number]
type EntityField = Entity['fields'][number]
type EntityFacet = NonNullable<Entity['facets']>[number]
type EntityFacetEntry = {
	entityType: string
	facet: EntityFacet
	projectionPath: readonly [string, ...string[]]
}
type EntitySelector = Entity['selectors'][number]
type ValueTypeType = App['schema']['valueTypes'][number]['type']
type SingularView = NonNullable<Entity['views']['singular']>
type EntityLatest = NonNullable<SingularView['latest']>[number]
type EntityCarousel = NonNullable<SingularView['carousels']>[number] & {
	projectionPath?: readonly [string, ...string[]]
}
type EntityCarouselSection = EntityCarousel['sections'][number]
type NamedRelationshipListView = {
	component: string
	entity: Entity
	sourceEntity: Entity
	section: EntityCarouselSection
	field: EntityField
}
enum RouteFileKind {
	Page = 'page',
	Layout = 'layout',
	PageModule = 'page-module',
}
type RoutePage = NonNullable<App['routes']['children'][string]['page']>
type RouteLayout = NonNullable<App['routes']['children'][string]['layout']>
type CollectionRouteMapping = {
	entity: EntityType
	source: {
		entity: EntityType
		selector: _Expression
		field: _FieldReference
	}
	query?: _ViewQuery
	page?: RoutePage
}
type RouteFile = {
	kind: RouteFileKind
	sharedLayout?: true
	layout?: RouteLayout
	detailLayout?: RouteDetailLayoutPlan
	page?: RoutePage
	mappings?: readonly SelectorRouteMapping[]
	collections?: readonly CollectionRouteMapping[]
}
const projectionPathKey = (
	entityType: string,
	path: readonly string[]
) => `${entityType}${path.join('')}`

const entityLabel = (entity: Entity) => entity.labels.singular
const entityLabelPlural = (entity: Entity) => entity.labels.plural
const entitySingularView = (entity: Entity) => entity.views.singular
const singularViewQuery = (singularView: ReturnType<typeof entitySingularView>) => singularView?.query
const singularViewContent = (singularView: ReturnType<typeof entitySingularView>) => singularView?.content
const singularViewDetails = (singularView: ReturnType<typeof entitySingularView>) => singularView?.details
const singularViewLatest = (singularView: ReturnType<typeof entitySingularView>) => singularView?.latest
const entityPluralView = (entity: Entity) => entity.views.plural
const isProjectionFieldReference = (field: unknown): field is Extract<FieldReference, readonly string[]> => (
	Array.isArray(field) && field.length > 1 && field.every((part) => typeof part === 'string')
	&& /^[A-Z]/.test(field[0] ?? '')
)
type RouteRenderEntry = {
	internalPath: string
	routePath: string
	files: RouteFile[]
}
type RouteParam = {
	name: string
	matcher: string
	matchers: readonly string[]
	explicitValueTypes: readonly string[]
	valueTypes: readonly string[]
	decode?: _ExpressionDecode | _RouteParamTransform
}
type SelectorAncestorBinding = {
	field: string
	alternatives: readonly {
		ancestorNodeId: string
		entityType: string
		selectorName: string
		referencePath: readonly string[]
	}[]
}
type SelectorRouteMapping = {
	entityType: string
	selectorName: string
	sourceSelection?: readonly string[] | _SourceSelection
	paramBindings: Readonly<Record<string, readonly string[]>>
	routeParamMatchers: readonly {
		param: string
		matchers: readonly string[]
		valueTypes: readonly string[]
	}[]
	ancestorBindings: readonly SelectorAncestorBinding[]
	probeCases: readonly [{
		id: string
		params: Readonly<Record<string, string>>
	}, ...{
		id: string
		params: Readonly<Record<string, string>>
	}[]]
	boundaryLiveOptional?: true
	href?: {
		entityHref?: false
		conditions?: EntityHref['conditions']
		params: EntityHref['params']
	}
	hrefAlternatives: readonly EntityHref['params'][]
	fields: readonly {
		field: string
		value: _Expression
	}[]
	title?: _Expression
	projection?: {
		entityType: string
		facetPath: readonly string[]
	}
	when?: _AppFacetCondition
	projectionSubject?: {
		entityType: string
		selector: _Expression
		routeParam?: string
	}
	page?: NonNullable<NonNullable<App['routes']['children'][string]['selectors']>[string]>[string]['page']
}
type SelectorRouteVariant = {
	ownerNodeId: string
	mapping: SelectorRouteMapping
}
type RouteNode = {
	internalPath: string
	svelteKitPath: string
	publicPath: string
	params: readonly RouteParam[]
	collectionMappings: readonly {
		entityType: EntityType
		field: FieldReference
		targetEntityType: EntityType
		selector: _Expression
		query?: _ViewQuery
		page?: NonNullable<App['routes']['children'][string]['collections']>[number]['page']
	}[]
	selectorMappings: readonly SelectorRouteMapping[]
	selectorVariant?: SelectorRouteVariant
	detail?: {
		group: string
		mappings: readonly {
			entityType: EntityType
			selectorName: string
			component: string
		}[]
	}
	page?: NonNullable<App['routes']['children'][string]['page']>
	layout?: NonNullable<App['routes']['children'][string]['layout']>
	children: readonly RouteNode[]
}
type RelationshipSection = {
	id?: string
	idExpression?: string
	group?: string
	label?: string
	titleField?: string
	field: FieldReference
	component?: string
	href?: string
	emptyText?: string
	selection?: _ViewQuery
	viewEntry?: _ViewItem
	list?: _ViewListSection
	props?: {
		name: string
		value: _Expression
	}[]
	conditions?: {
		field: string
		equals?: _Literal
		contains?: _Literal
		oneOf?: readonly _Literal[]
	}[]
}
type EntityHref = {
	href: string
	selector: string
	conditions?: {
		field: string
		equals?: _Literal
		notEquals?: _Literal
		contains?: _Literal
		oneOf?: readonly _Literal[]
	}[]
	params: {
		param: string
		value: _Expression
		decode?: _ExpressionDecode
	}[]
}
type CollectionRouteHref = EntityHref
type FieldReference = _FieldReference
type SourceDefinition = App['sources']['sources'][number]
type SourceProviderDefinition = App['sources']['providers'][number]
type SourceBinding = NonNullable<SourceDefinition['binding']>
type SourceBindingEntry = {
	readonly provider: SourceDefinition['provider']
	readonly source: SourceDefinition['source']
	readonly binding: SourceBinding
	readonly bindingIndex: number
}
type SourceArtifactEntry = SourceBindingEntry & {
	readonly artifact: NonNullable<SourceBinding['artifacts']>[number]
	readonly artifactIndex: number
}
type OfficialSourceArtifactEntry = SourceArtifactEntry & {
	readonly officialUrl: string
}
type RouteFixtureMetadata = {
	id: string
	label?: string
	routeKind?: 'detail' | 'hub' | 'collection' | 'projection' | 'facet'
	projectionEntity?: EntityType
	projectionPath?: readonly [string, ...string[]]
	probeCases: readonly {
		id: string
		params: Readonly<Record<string, string>>
	}[]
	boundaryLiveOptional?: true
}
type CompiledEntityViewFacts = {
	entity: Entity
	singularComponent: string
	pluralComponent: string
	namedSourceSelections: readonly _SourceSelection[]
	rawSnippetComponents: readonly string[]
}
type CompiledSourceProviderFacts = {
	provider: SourceProviderDefinition
	sources: readonly SourceDefinition[]
	bindings: readonly SourceBindingEntry[]
	origins: readonly {
		origin: string
		corsEnabled: boolean
	}[]
}
type NamedSourceSelectionPlan = {
	selection: _SourceSelection
	defaultSourcesName: string
	selectionByKeyName: string
}
type CompositeRouteParamPlan = {
	matcher: string
	matchers: readonly string[]
}
type RouteFixturePlan = {
	nodeId: string
	probeOwnerNodeId?: string
	routeId: string
	publicPath: string
	parameterMatchers: Readonly<Record<string, readonly string[]>>
	mappings: readonly RouteFixtureMetadata[]
	boundaryLiveOptional: boolean
}
type CompiledPhysicalRouteFileFacts = {
	path: string
	appRoutePath: string
	semanticNodeId: string
	placement: 'layout' | 'page'
	routeFile: RouteFile
	inheritedMappings: boolean
	projectionOwnedByAncestor: boolean
	pageModuleOwnership: 'layout' | 'page' | 'ancestor' | 'inline' | 'none'
	generatedPageModule?: boolean
}
type CompiledAppFacts = Readonly<{
	entityTypes: readonly string[]
	activeEntities: readonly Entity[]
	entityViewPlans: readonly CompiledEntityViewFacts[]
	entityByType: Readonly<Record<string, Entity>>
	facetEntries: readonly EntityFacetEntry[]
	entityFacetByPath: Readonly<Record<string, EntityFacetEntry>>
	facetAncestorConditionsByPath: Readonly<Record<string, readonly _AppFacetCondition[]>>
	facetDependencyConditionsByPath: Readonly<Record<string, NonNullable<EntityHref['conditions']>>>
	valueTypeById: Readonly<Record<string, App['schema']['valueTypes'][number]>>
	sources: readonly SourceDefinition[]
	sourceProviders: readonly SourceProviderDefinition[]
	sourceProviderPlans: readonly CompiledSourceProviderFacts[]
	sourceBindings: readonly SourceBindingEntry[]
	sourceArtifacts: readonly SourceArtifactEntry[]
	officialSourceArtifacts: readonly OfficialSourceArtifactEntry[]
	sourceById: Readonly<Record<string, SourceDefinition>>
	resolverModules: readonly App['resolvers']['modules'][number][]
	navigationItems: readonly App['navigation']['items'][number][]
	routeNodes: readonly RouteNode[]
	renderEntries: readonly RouteRenderEntry[]
	routeNodeByInternalPath: Readonly<Record<string, RouteNode>>
	routeNodesByPublicPath: Readonly<Record<string, readonly RouteNode[]>>
	routeNodesByPublicShape: Readonly<Record<string, readonly RouteNode[]>>
	routeMappingByEntityTypeAndSelector: Readonly<Record<string, SelectorRouteMapping>>
	routeMappingsByNode: Readonly<Record<string, readonly SelectorRouteMapping[]>>
	routeProbeMappingsByNode: Readonly<Record<string, Readonly<{
		ownerNodeId: string
		mappings: readonly SelectorRouteMapping[]
	}> | undefined>>
	compositeRouteParams: readonly CompositeRouteParamPlan[]
	routeFixturePlans: readonly RouteFixturePlan[]
	physicalRouteFiles: readonly CompiledPhysicalRouteFileFacts[]
	collectionHrefByEntity: Readonly<Record<string, string>>
	collectionHrefBySourceField: Readonly<Record<string, CollectionRouteHref>>
	entityHrefsByType: Readonly<Record<string, readonly EntityHref[]>>
	generatedComponentByName: Readonly<Record<string, true>>
	namedSourceSelections: readonly NamedSourceSelectionPlan[]
	namedRelationshipListViews: readonly NamedRelationshipListView[]
}>

type LoweringIndexes = Readonly<Pick<
	CompiledAppFacts,
	| 'collectionHrefByEntity'
	| 'collectionHrefBySourceField'
	| 'entityByType'
	| 'entityFacetByPath'
	| 'entityHrefsByType'
	| 'facetAncestorConditionsByPath'
	| 'facetDependencyConditionsByPath'
	| 'generatedComponentByName'
	| 'valueTypeById'
>>
type SourcesMarkdownLoweringInput = Readonly<Pick<
	CompiledAppFacts,
	| 'sourceArtifacts'
	| 'sourceBindings'
	| 'sourceProviders'
	| 'sources'
>>
type AppLoweringInput = Readonly<{
	indexes: LoweringIndexes
	entityTypes: readonly string[]
	entityViewPlans: readonly CompiledEntityViewFacts[]
	sourcesMarkdown: SourcesMarkdownLoweringInput
	sourceNames: readonly string[]
	sourceProviderNames: readonly string[]
	sourceProviderPlans: readonly CompiledSourceProviderFacts[]
	sourceBindings: readonly SourceBindingEntry[]
	namedSourceSelections: readonly NamedSourceSelectionPlan[]
	navigationItems: readonly App['navigation']['items'][number][]
	officialSourceArtifacts: readonly OfficialSourceArtifactEntry[]
	resolverModules: readonly App['resolvers']['modules'][number][]
	routeFixturePlans: readonly RouteFixturePlan[]
	namedRelationshipListViews: readonly NamedRelationshipListView[]
	compositeRouteParams: readonly CompositeRouteParamPlan[]
	physicalRouteFiles: readonly CompiledPhysicalRouteFileFacts[]
}>
export type CompiledApp = Readonly<{
	generatedFiles: readonly GeneratedFile[]
}>

const repoRoot = process.cwd()
const generatedOutputRoot = path.resolve(process.env.APP_GENERATED_OUTPUT_ROOT ?? repoRoot)
const generatedRoot = path.join(generatedOutputRoot, 'src')
const routeRoot = path.join(generatedRoot, 'routes')
const protectedRouteFiles = new Set([
	'src/routes/+layout.svelte',
	'src/routes/+layout.ts',
	'src/routes/+page.svelte',
	'src/routes/+page.ts',
])
const protectedSchemaFiles = new Set([
	'src/schema/$schema.ts',
])
const generatedHeader = '// Generated from APP.ts. Do not edit by hand.'
const generatedSvelteHeader = '<!-- Generated from APP.ts. Do not edit by hand. -->'

const unique = <_Value>(values: readonly _Value[]) => [...new Set(values)]

const nullPrototypeRecord = <_Value>(entries: readonly (readonly [string, _Value])[]) => Object.assign(
	Object.create(null),
	Object.fromEntries(entries)
) as Record<string, _Value>

const freezeCompiled = <_Value>(value: _Value): _Value => {
	if (Array.isArray(value))
		return Object.freeze(value.map(freezeCompiled)) as _Value
	if (value == null || typeof value !== 'object')
		return value

	return Object.freeze(Object.assign(
		Object.create(null),
		Object.fromEntries(Object.entries(value).map(([key, nestedValue]) => [
			key,
			freezeCompiled(nestedValue),
		]))
	)) as _Value
}

const importNameKey = (importName: ImportName) => (
	typeof importName === 'string' ?
		importName
	:
		`${importName.name} as ${importName.alias}`
)

const uniqueImportNames = (importNames: readonly ImportName[]) => [
	...new Map(importNames.map((importName) => [
		importNameKey(importName),
		importName,
	])).values(),
].sort((left, right) => importNameKey(left).localeCompare(importNameKey(right)))

export type GeneratedTypeScriptValue =
	| string
	| number
	| bigint
	| boolean
	| null
	| undefined
	| readonly GeneratedTypeScriptValue[]
	| {
			readonly [key: string]: GeneratedTypeScriptValue
		}

export type TypeScriptEmission =
	| string
	| number
	| bigint
	| boolean
	| null
	| {
			kind: 'array'
			values: readonly TypeScriptEmission[]
			multiline?: boolean
		}
	| {
			kind: 'object'
			entries: readonly [string, TypeScriptEmission | undefined][]
			multiline?: boolean
		}
	| {
			kind: 'member'
			members: readonly [string, ...string[]]
		}
	| {
			kind: 'raw'
			source: string
		}
	| {
			kind: 'call'
			callee: TypeScriptEmission
			arguments: readonly TypeScriptEmission[]
		}
	| {
			kind: 'spread'
			value: TypeScriptEmission
		}
	| {
			kind: 'value'
			value: GeneratedTypeScriptValue
		}

const typeScriptPrinter = ts.createPrinter({
	newLine: ts.NewLineKind.LineFeed,
})
const typeScriptPrinterSourceFile = ts.createSourceFile(
	'generated-expression.ts',
	'',
	ts.ScriptTarget.Latest,
	false,
	ts.ScriptKind.TS
)

const typeScriptStringLiteral = (value: string) => {
	const literal = ts.factory.createStringLiteral(value, true)
	ts.setEmitFlags(literal, ts.EmitFlags.NoAsciiEscaping)
	return literal
}

const typeScriptExpression = (
	emission: TypeScriptEmission,
	rawExpressions: string[]
): ts.Expression => {
	if (typeof emission === 'string')
		return typeScriptStringLiteral(emission)
	if (typeof emission === 'number') {
		if (Number.isNaN(emission))
			return ts.factory.createIdentifier('NaN')
		if (emission === Number.POSITIVE_INFINITY)
			return ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier('Number'), 'POSITIVE_INFINITY')
		if (emission === Number.NEGATIVE_INFINITY)
			return ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier('Number'), 'NEGATIVE_INFINITY')
		if (emission < 0 || Object.is(emission, -0))
			return ts.factory.createPrefixUnaryExpression(
				ts.SyntaxKind.MinusToken,
				ts.factory.createNumericLiteral(String(Math.abs(emission)))
			)

		return ts.factory.createNumericLiteral(String(emission))
	}
	if (typeof emission === 'bigint')
		return emission < 0n ?
			ts.factory.createPrefixUnaryExpression(
				ts.SyntaxKind.MinusToken,
				ts.factory.createBigIntLiteral(`${-emission}n`)
			)
		:
			ts.factory.createBigIntLiteral(`${emission}n`)
	if (typeof emission === 'boolean')
		return emission ? ts.factory.createTrue() : ts.factory.createFalse()
	if (emission === null)
		return ts.factory.createNull()
	if (emission.kind === 'raw') {
		rawExpressions.push(emission.source)
		return ts.factory.createIdentifier(`__TYPE_SCRIPT_RAW_${rawExpressions.length - 1}__`)
	}
	if (emission.kind === 'value') {
		if (emission.value === undefined)
			return ts.factory.createIdentifier('undefined')
		if (
			emission.value === null
			|| typeof emission.value === 'string'
			|| typeof emission.value === 'number'
			|| typeof emission.value === 'bigint'
			|| typeof emission.value === 'boolean'
		)
			return typeScriptExpression(emission.value, rawExpressions)
		if (Array.isArray(emission.value))
			return ts.factory.createArrayLiteralExpression(
				ts.factory.createNodeArray(emission.value.map((value) => typeScriptExpression({
					kind: 'value',
					value,
				}, rawExpressions)), emission.value.length > 0),
				emission.value.length > 0
			)
		if (typeof emission.value === 'object')
			return ts.factory.createObjectLiteralExpression(
				ts.factory.createNodeArray(Object.entries(emission.value)
					.filter(([, value]) => value !== undefined)
					.map(([key, value]) => ts.factory.createPropertyAssignment(
						/^[A-Za-z_$][\w$]*$/.test(key) ? ts.factory.createIdentifier(key) : typeScriptStringLiteral(key),
						typeScriptExpression({
							kind: 'value',
							value,
						}, rawExpressions)
					)), Object.values(emission.value).some((value) => value !== undefined)),
				Object.values(emission.value).some((value) => value !== undefined)
			)

		throw new Error(`Unsupported generated TypeScript value: ${String(emission.value)}`)
	}
	if (emission.kind === 'member')
		return emission.members.slice(1).reduce<ts.Expression>(
			(expression, member) => ts.factory.createPropertyAccessExpression(expression, member),
			ts.factory.createIdentifier(emission.members[0])
		)
	if (emission.kind === 'spread')
		return ts.factory.createSpreadElement(typeScriptExpression(emission.value, rawExpressions))
	if (emission.kind === 'call')
		return ts.factory.createCallExpression(
			typeScriptExpression(emission.callee, rawExpressions),
			undefined,
			emission.arguments.map((argument) => typeScriptExpression(argument, rawExpressions))
		)
	if (emission.kind === 'array')
		return ts.factory.createArrayLiteralExpression(
			ts.factory.createNodeArray(emission.values.map((value) => typeScriptExpression(value, rawExpressions)), emission.multiline ?? true),
			emission.multiline ?? true
		)

	return ts.factory.createObjectLiteralExpression(
		ts.factory.createNodeArray(emission.entries
			.filter((entry): entry is [string, TypeScriptEmission] => entry[1] !== undefined)
			.map(([key, value]) => ts.factory.createPropertyAssignment(
				/^[A-Za-z_$][\w$]*$/.test(key) ? ts.factory.createIdentifier(key) : typeScriptStringLiteral(key),
				typeScriptExpression(value, rawExpressions)
			)), emission.multiline ?? true),
		emission.multiline ?? true
	)
}

export const emitTypeScript = (emission: TypeScriptEmission) => {
	const rawExpressions: string[] = []
	return typeScriptPrinter.printNode(
		ts.EmitHint.Expression,
		typeScriptExpression(emission, rawExpressions),
		typeScriptPrinterSourceFile
	)
	.replace(/^(?: {4})+/gm, (indentation) => '\t'.repeat(indentation.length / 4))
	.replace(/__TYPE_SCRIPT_RAW_(\d+)__/g, (placeholder, indexText: string, offset: number, source: string) => {
		const rawExpression = rawExpressions[Number(indexText)]
		if (rawExpression == null)
			throw new Error(`Missing generated TypeScript raw expression for ${placeholder}`)

		return rawExpression.replaceAll('\n', `\n${source.slice(source.lastIndexOf('\n', offset) + 1, offset).match(/^\s*/)?.[0] ?? ''}`)
	})
}

const templateStringText = (value: string) => value
	.replaceAll('\\', '\\\\')
	.replaceAll('`', '\\`')
	.replaceAll('${', '\\${')

const svelteText = (value: string) => value
	.replaceAll('&', '&amp;')
	.replaceAll('<', '&lt;')
	.replaceAll('>', '&gt;')
	.replaceAll('{', '&#123;')

const displayLabel = (value: string) => value
	.replace(/\ba2a\b/gi, 'A2A')
	.replace(/\bacp\b/gi, 'ACP')
	.replace(/\bai\b/gi, 'AI')
	.replace(/\bamm(s?)\b/gi, 'AMM$1')
	.replace(/\bapi\b/gi, 'API')
	.replace(/\batproto\b/gi, 'ATProto')
	.replace(/\bcardano\b/gi, 'Cardano')
	.replace(/\bcaip\b/gi, 'CAIP')
	.replace(/\bd rep(s?)\b/gi, 'DRep$1')
	.replace(/\bevm\b/gi, 'EVM')
	.replace(/\bhbar\b/gi, 'HBAR')
	.replace(/\bicp\b/gi, 'ICP')
	.replace(/\bip\b/gi, 'IP')
	.replace(/\blp\b/gi, 'LP')
	.replace(/\bnft(s?)\b/gi, 'NFT$1')
	.replace(/\bpop\b/gi, 'PoP')
	.replace(/\bsui\b/gi, 'Sui')
	.replace(/\bton\b/gi, 'TON')
	.replace(/\butxo(s?)\b/gi, 'UTXO$1')
	.replace(/\bwasm\b/gi, 'Wasm')
	.replace(/\bxrpl\b/gi, 'XRPL')
	.replace(/\bepoches\b/gi, 'epochs')

const indent = (source: string, level = 1) => source
	.split('\n')
	.map((line) => line === '' ? line : `${'\t'.repeat(level)}${line}`)
	.join('\n')

const reindentLines = (source: string[], level: number) => {
	const sourceLines = source.flatMap((line) => line.split('\n'))
	const indentedLines = sourceLines.filter((line) => line.trim() !== '')
	const indentLevel = indentedLines.length === 0 ? 0 : Math.min(...indentedLines
		.map((line) => line.match(/^\t*/)?.[0].length ?? 0)
	)

	return sourceLines.map((line) => line.trim() === '' ? '' : `${'\t'.repeat(level)}${line.slice(indentLevel)}`)
}

const lines = (source: string) => source.split('\n')

const lowerRawLines = (source: string, level: number) => lines(source)
	.map((line) => line.trim() === '' ? '' : `${'\t'.repeat(level)}${line}`)

const lowerTooltipParagraphs = (paragraphs: readonly string[], level: number) => paragraphs.flatMap((paragraph) => [
	`${'\t'.repeat(level)}<p>`,
	`${'\t'.repeat(level + 1)}${svelteText(paragraph)}`,
	`${'\t'.repeat(level)}</p>`,
])

const lowerSvelteAttribute = (level: number, name: string, expression: string) => {
	const attributeIndent = '\t'.repeat(level)
	if (!expression.includes('\n'))
		return `${attributeIndent}${name}={${expression}}`

	return [
		`${attributeIndent}${name}={`,
		...reindentLines(expression.split('\n'), level + 1),
		`${attributeIndent}}`,
	].join('\n')
}

const lowerSvelteConst = (level: number, name: string, expression: string) => {
	const constIndent = '\t'.repeat(level)
	if (!expression.includes('\n'))
		return `${constIndent}{@const ${name} = ${expression}}`

	const [firstLine, ...restLines] = expression.split('\n')
	const lastLine = restLines[restLines.length - 1] ?? ''
	const bodyLines = restLines.slice(0, -1)
	return [
		`${constIndent}{@const ${name} = ${firstLine}`,
		...reindentLines(bodyLines, level + 1),
		`${constIndent}${lastLine.trimStart()}}`,
	].join('\n')
}

const tsFile = (relativePath: string, ast: TsFileAst): GeneratedFile => ({
	path: relativePath,
	kind: 'ts',
	ast,
})

const svelteFile = (relativePath: string, ast: SvelteFileAst): GeneratedFile => ({
	path: relativePath,
	kind: 'svelte',
	ast,
})

const textFile = (relativePath: string, body: string[]): GeneratedFile => ({
	path: relativePath,
	kind: 'text',
	body,
})

const pascal = (value: string) => value
	.replace(/^_+/, '')
	.split(/[_\-\s]+|(?=[A-Z])/)
	.filter(Boolean)
	.map((part) => `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}`)
	.join('')

const camel = (value: string) => `${pascal(value)[0]?.toLowerCase() ?? ''}${pascal(value).slice(1)}`

const javascriptReservedWords = new Set([
	'await',
	'break',
	'case',
	'catch',
	'class',
	'const',
	'continue',
	'debugger',
	'default',
	'delete',
	'do',
	'else',
	'enum',
	'export',
	'extends',
	'false',
	'finally',
	'for',
	'function',
	'if',
	'import',
	'in',
	'instanceof',
	'new',
	'null',
	'private',
	'return',
	'super',
	'switch',
	'this',
	'throw',
	'true',
	'try',
	'typeof',
	'undefined',
	'var',
	'void',
	'while',
	'with',
	'yield',
])

const svelteKitResourceFieldNames = [
	'catch',
	'current',
	'error',
	'finally',
	'loading',
	'ready',
	'then',
] as const

const entityProxyMetadataFieldNames = [
	'entity',
	'entitySelector',
	'entityType',
	'facetPath',
	'name',
	'sources',
	'value',
] as const

const entityProxyResourceFieldNames = new Set([
	...svelteKitResourceFieldNames,
	...entityProxyMetadataFieldNames,
])

const localIdentifier = (name: string) => {
	const identifier = camel(name)
	return javascriptReservedWords.has(identifier) ? `${identifier}Value` : identifier
}

const appOrderCompare = (left: string, right: string) => left.localeCompare(right, 'en', {
	sensitivity: 'base',
	numeric: true,
})

const singularComponentName = (entityType: string) => `${entityType}View`

const pluralComponentName = (entity: Entity) => {
	if (entityPluralView(entity)?.component == null)
		throw new Error(`${entity.entityType} is missing pluralView.component`)

	return entityPluralView(entity).component
}

const componentIdentifier = (componentName: string) => componentName.replace(/^_+/, '')

const generatedModuleName = (name: string) => name

const schemaModulePath = (entityType: string) => `$/schema/${generatedModuleName(entityType)}.ts`

const viewModulePath = (componentName: string) => `$/views/${generatedModuleName(componentName)}.svelte`

const generatedImportFrom = (from: string) => {
	const schemaMatch = from.match(/^\$\/schema\/([^/]+)\.ts$/)
	if (schemaMatch?.[1] != null)
		return schemaModulePath(schemaMatch[1])

	const viewMatch = from.match(/^\$\/views\/([^/]+)\.svelte$/)
	if (viewMatch?.[1] != null)
		return viewModulePath(viewMatch[1])

	return from
}

const generatedImportSpecFrom = (spec: Pick<
	ImportSpec,
	| 'defaultName'
	| 'from'
	| 'names'
	| 'typeNames'
>) => {
	const schemaMatch = spec.from.match(/^\$\/schema\/([^/]+)\.ts$/)
	if (schemaMatch?.[1] != null && [
		spec.defaultName,
		...(spec.names ?? []).map(importNameKey),
		...(spec.typeNames ?? []).map(importNameKey),
	].some((name) => name?.startsWith(`_${schemaMatch[1]}`)))
		return schemaModulePath(`_${schemaMatch[1]}`)

	return generatedImportFrom(spec.from)
}

const pluralViewName = (entity: Entity) => componentIdentifier(pluralComponentName(entity)).replace(/View$/, '')

const singularComponentIdentifier = (entityType: string) => componentIdentifier(singularComponentName(entityType))

const pluralComponentIdentifier = (entity: Entity) => componentIdentifier(pluralComponentName(entity))

const selectorMemberName = (selector: EntitySelector) => selector.name

const propertyAccess = (property: string) => /^[A-Za-z_$][\w$]*$/.test(property) ? `.${property}` : `[${emitTypeScript(property)}]`

const objectPropertyKey = (property: string) => /^[A-Za-z_$][\w$]*$/.test(property) ? property : emitTypeScript(property)

const fieldExpression = (base: string, field: string) => [
	base,
	...field.split('.'),
]
	.filter(Boolean)
	.reduce((expression, part) => (
		expression === '' ?
			part
		:
			`${expression}${propertyAccess(part)}`
	), '')

const routeParamStringExpression = (expression: string, decode?: _ExpressionDecode) => (
	decode === _ExpressionDecode.DecodeURIComponent ?
		`encodeURIComponent(String(${expression} ?? ''))`
	:
		`String(${expression} ?? '')`
)

const fieldNameForReference = (field: FieldReference) => (
	isProjectionFieldReference(field) ?
		field.at(-1) ?? ''
	:
		field
)

const fieldReferenceKey = (field: FieldReference) => (
	isProjectionFieldReference(field) ?
		field.join('.')
	:
		field
)

const fieldResourceBaseExpression = (base: string, field: FieldReference) => (
	isProjectionFieldReference(field) ?
		field.slice(0, -1).reduce((expression, facetName) => `${expression}${propertyAccess(facetName)}`, base)
	:
		base
)

const lowerProjectionBoundaryLines = (
	field: FieldReference,
	content: string[],
	level: number
) => {
	if (!isProjectionFieldReference(field))
		return content

	const projectionResourceExpression = fieldResourceBaseExpression('selection', field)
	return [
		`${'\t'.repeat(level)}<ProjectionBoundary`,
		lowerSvelteAttribute(level + 1, 'resource', projectionResourceExpression),
		`${'\t'.repeat(level)}>`,
		`${'\t'.repeat(level + 1)}{#snippet Applicable(projection)}`,
		...reindentLines(content.map((line) => line.replaceAll(
			projectionResourceExpression,
			'projection'
		)), level + 2),
		`${'\t'.repeat(level + 1)}{/snippet}`,
		`${'\t'.repeat(level)}</ProjectionBoundary>`,
	]
}

const fieldResourceExpression = (base: string, field: FieldReference, _entityType: string, query?: string, _multiple = true) => {
	const fieldName = fieldNameForReference(field)
	const fieldBase = fieldResourceBaseExpression(base, field)
	if (!entityProxyResourceFieldNames.has(fieldName))
		return fieldProxyResourceExpression(base, field, query)

	if (query == null || query === '{}')
		return `${fieldBase}[EntityProxyField](${emitTypeScript(fieldName)})`

	return `${fieldBase}[EntityProxyField](${emitTypeScript(fieldName)}, ${query})`
}

const fieldProxyResourceExpression = (base: string, field: FieldReference, query?: string) => {
	const expression = `${fieldResourceBaseExpression(base, field)}${propertyAccess(fieldNameForReference(field))}`
	if (query == null || query === '{}')
		return expression

	return `${expression}(${query})`
}

const routeId = (routePath: string) => `/${routePath}`.replaceAll('//', '/')

const publicRouteId = (routePath: string) => `/${routePath
	.split('/')
	.filter((segment) => !/^\(.+\)$/.test(segment))
	.join('/')}`.replaceAll('//', '/')

const routeParamNames = (href: string) => unique(
	Array.from(href.matchAll(/\[(?:\.\.\.)?([^=\]]+)(?:=[^\]]+)?\]/g))
		.map((match) => match[1])
		.filter((param): param is string => param != null)
)

const lowerResolveExpression = (href: string, params: readonly [string, string][] = []) => {
	if (params.length === 0)
		return `resolve(${emitTypeScript(publicRouteId(href))})`

	return `resolve(${emitTypeScript(publicRouteId(href))}, ${lowerObject(params.map(([param, value]) => [param, value]))})`
}

const lowerRouteResolveExpression = (href: string, params: readonly [string, string][] = []) => {
	return lowerResolveExpression(href, params)
}

const lowerRouteParamExpression = (
	expression: _Expression,
	context: {
		params?: string
		fields?: string
		pageSelector?: string
	},
	decode?: _ExpressionDecode
): string => {
	if (typeof expression === 'string')
		return expression
	if ('raw' in expression)
		return expression.raw
	if (expression.kind === 'field')
		return routeParamStringExpression(fieldExpression(context.fields ?? 'selector', expression.name), decode)
	if (expression.kind === 'property')
		return routeParamStringExpression(`${lowerRouteParamValueExpression(expression.value, context.fields ?? 'selector')}${propertyAccess(expression.property)}`, decode)

	if (expression.kind === 'template')
		return `\`${expression.parts.map((part) => (
			typeof part === 'string' ?
				templateStringText(part)
			:
				`\${${routeParamStringExpression(lowerRouteParamValueExpression(part, context.fields ?? 'selector', decode), decode)}}`
		)).join('')}\``

	if (expression.kind === 'case') {
		const valueExpression = lowerAppExpression(expression, context)
		return valueExpression.includes('\n') ?
			[
				'String(',
				indent(valueExpression),
				')',
			].join('\n')
		:
			`String(${valueExpression})`
	}

	const looseExpression = lowerAppExpression(expression, context)
	return routeParamStringExpression(looseExpression, decode)
}

const routeFileName = (kind: RouteFile['kind']) => {
	if (kind === RouteFileKind.Page)
		return '+page.svelte'
	if (kind === RouteFileKind.PageModule)
		return '+page.ts'
	if (kind === RouteFileKind.Layout)
		return '+layout.svelte'

	throw new Error(`Unsupported route file kind: ${kind}`)
}

const lowerImport = (spec: ImportSpec) => {
	const typeOnlyImport = spec.defaultName == null && (spec.names ?? []).length === 0
	const namedImports = [
		...(spec.names ?? []).map((importName) => ({
			name: typeof importName === 'string' ? importName : importName.name,
			alias: typeof importName === 'string' ? undefined : importName.alias,
			isTypeOnly: false,
		})),
		...(spec.typeNames ?? []).map((importName) => ({
			name: typeof importName === 'string' ? importName : importName.name,
			alias: typeof importName === 'string' ? undefined : importName.alias,
			isTypeOnly: !typeOnlyImport,
		})),
	]
	const namedClause = namedImports.length === 0 ? undefined : `{ ${namedImports.map((name) => (
		`${name.isTypeOnly ? 'type ' : ''}${name.name}${name.alias == null ? '' : ` as ${name.alias}`}`
	)).join(', ')} }`
	const importClause = [
		spec.defaultName,
		namedClause,
	].filter((value) => value != null).join(', ')

	return `import ${typeOnlyImport ? 'type ' : ''}${importClause} from ${emitTypeScript(generatedImportSpecFrom(spec))}`
}

const mergeImports = (imports: readonly ImportSpec[]) => {
	const merged = new Map<string, ImportSpec>()
	for (const spec of imports) {
		const from = generatedImportSpecFrom(spec)
		const existing = merged.get(from)
		if (existing == null) {
			merged.set(from, {
				...spec,
				from,
				names: uniqueImportNames(spec.names ?? []),
				typeNames: uniqueImportNames(spec.typeNames ?? []),
			})
			continue
		}

		if (spec.defaultName != null)
			existing.defaultName = spec.defaultName
		existing.names = uniqueImportNames([
			...(existing.names ?? []),
			...(spec.names ?? []),
		])
		existing.typeNames = uniqueImportNames([
			...(existing.typeNames ?? []),
			...(spec.typeNames ?? []),
		])
	}

	return [...merged.values()].sort((left, right) => left.from.localeCompare(right.from))
}

const formatTsExpression = (source: string) => `(${source})`

const lowerFacetCondition = (condition: _AppFacetCondition): string => (
	'all' in condition ?
		lowerObject([
			['all', lowerArray(condition.all.map(lowerFacetCondition))],
		])
	: 'is' in condition ?
		lowerObject([
			['path', lowerArray(condition.path.map((part) => typeof part === 'string' ? emitTypeScript(part) : String(part)))],
			['is', emitTypeScript(condition.is)],
		])
	: 'isOneOf' in condition ?
		lowerObject([
			['path', lowerArray(condition.path.map((part) => typeof part === 'string' ? emitTypeScript(part) : String(part)))],
			['isOneOf', lowerArray(condition.isOneOf.map(emitTypeScript))],
		])
	:
		lowerObject([
			['path', lowerArray(condition.path.map((part) => typeof part === 'string' ? emitTypeScript(part) : String(part)))],
			['includes', emitTypeScript(condition.includes)],
		])
)

const facetConditionField = (condition: _AppFacetCondition) => {
	if ('all' in condition)
		return facetConditionField(condition.all[0])

	const field = [...condition.path].reverse().find((part) => typeof part === 'string')
	if (typeof field !== 'string')
		throw new Error(`Facet condition path must include a field: ${JSON.stringify(condition.path)}`)

	return field
}

const fieldIsManyPrimitive = (field: EntityField) => (
	field.type === EntityFieldType.Primitive
	&& (
		field.cardinality === EntityFieldCardinality.Many
		|| field.cardinality === EntityFieldCardinality.ZeroOrMany
		|| field.primitiveType != null && 'array' in field.primitiveType
	)
)

const facetConditionErrors = (
	entity: Entity,
	condition: _AppFacetCondition,
	entityFacetByPath: Readonly<Record<string, EntityFacetEntry>>
): readonly string[] => {
	if ('all' in condition)
		return condition.all.flatMap((child) => facetConditionErrors(entity, child, entityFacetByPath))

	let fields = entity.fields
	let facetPath: string[] = []
	let field: EntityField | undefined
	let indexed = false
	for (const [
		index,
		segment,
	] of condition.path.entries()) {
		if (typeof segment === 'number') {
			if (field == null)
				return [`${entity.entityType} facet condition path ${JSON.stringify(condition.path)} indexes before a field`]
			if (index !== condition.path.length - 1)
				return [`${entity.entityType} facet condition path ${JSON.stringify(condition.path)} has segments after an indexed item`]
			if (!fieldIsManyPrimitive(field))
				return [`${entity.entityType} facet condition path ${JSON.stringify(condition.path)} indexes non-many primitive field ${field.name}`]

			indexed = true
			continue
		}

		const facet = entityFacetByPath[projectionPathKey(entity.entityType, [
			...facetPath,
			segment,
		])]?.facet
		if (facet != null && index < condition.path.length - 1) {
			facetPath = [
				...facetPath,
				segment,
			]
			fields = [
				...fields,
				...(facet.fields ?? []),
			]
			field = undefined
			continue
		}

		field = fields.find((item) => item.name === segment)
		if (field == null)
			return [`${entity.entityType} facet condition path ${JSON.stringify(condition.path)} references missing field ${segment}`]
		if (index < condition.path.length - 1 && typeof condition.path[index + 1] !== 'number')
			return [`${entity.entityType} facet condition path ${JSON.stringify(condition.path)} has field ${segment} before non-index path segment`]
	}

	if (field == null)
		return [`${entity.entityType} facet condition path ${JSON.stringify(condition.path)} has no target field`]
	if (field.type !== EntityFieldType.Primitive)
		return [`${entity.entityType} facet condition path ${JSON.stringify(condition.path)} targets non-primitive field ${field.name}`]
	if ('includes' in condition && (indexed || !fieldIsManyPrimitive(field)))
		return [`${entity.entityType} facet condition path ${JSON.stringify(condition.path)} uses includes on a non-many primitive field`]
	if (!('includes' in condition) && !indexed && fieldIsManyPrimitive(field))
		return [`${entity.entityType} facet condition path ${JSON.stringify(condition.path)} uses scalar comparison on a many primitive field`]

	return []
}

const lowerStringEnum = (name: string, members: readonly string[]) => [
	`export enum ${name} {`,
	...members.map((member) => `\t${member} = ${emitTypeScript(member)},`),
	'}',
].join('\n')

const enumAccess = (enumName: string, value: string) => emitTypeScript({
	kind: 'member',
	members: [
		enumName,
		value,
	],
})

const lowerArray = (values: readonly string[]) => emitTypeScript({
	kind: 'array',
	values: values.map((source) => ({
		kind: 'raw',
		source,
	})),
	multiline: values.length > 0,
})

const lowerObject = (entries: readonly [string, string | undefined][]) => emitTypeScript({
	kind: 'object',
	entries: entries.map(([key, source]) => [
		key,
		source == null ? undefined : {
			kind: 'raw',
			source,
		},
	]),
	multiline: entries.some(([, value]) => value !== undefined),
})

const lowerQueryFields = (
	fields: readonly FieldReference[],
	openFields: readonly FieldReference[] | undefined,
	openExpression: string | undefined
) => {
	const lowerFieldSelection = (references: readonly FieldReference[]) => {
		const root = new Map<string, Map<string, unknown> | true>()
		for (const reference of references) {
			const path = isProjectionFieldReference(reference) ? reference : [reference]
			let fields = root
			for (const segment of path.slice(0, -1)) {
				const nested = fields.get(segment)
				if (nested === true || nested == null) {
					const next = new Map<string, Map<string, unknown> | true>()
					fields.set(segment, next)
					fields = next
				} else
					fields = nested
			}
			const fieldName = path.at(-1)
			if (fieldName != null)
				fields.set(fieldName, true)
		}

		const lowerEntries = (entries: Map<string, Map<string, unknown> | true>) => lowerObject([...entries].map(([key, value]) => [
			key,
			value === true ? 'true' : lowerObject([['fields', lowerEntries(value)]]),
		]))

		return lowerEntries(root)
	}
	const fieldEntries = lowerFieldSelection(fields)
	if (openExpression == null || openFields == null || openFields.length === 0)
		return fields.length === 0 ? undefined : fieldEntries

	return [
		'{',
		indent(`...${fieldEntries},`),
		indent(`...(${openExpression} && ${lowerFieldSelection(openFields)}),`),
		'}',
	].join('\n')
}

const lowerImportObject = (imports: readonly _Import[] | undefined): ImportSpec[] => (imports ?? [])
	.map((importSpec) => ({
		from: generatedImportSpecFrom({
			from: importSpec.from,
			defaultName: importSpec.default,
			names: importSpec.names,
			typeNames: importSpec.typeNames,
		}),
		defaultName: importSpec.default,
		names: importSpec.names,
		typeNames: importSpec.typeNames,
	}))

const lowerSourceArray = (sources: readonly string[] | undefined) => {
	if (sources == null)
		return undefined
	for (const source of sources)
		if (source == null)
			throw new Error(`Source selection contains undefined: ${sources.join(', ')}`)

	return lowerArray(sources.map((source) => enumAccess('Source', source)))
}

const sourceSelectionName = (selection: _SourceSelection) => selection.name ?? 'anonymousSources'

const defaultSourcesName = (selection: _SourceSelection) => `default${pascal(sourceSelectionName(selection))}Sources`

const sourceSelectionByKeyName = (selection: _SourceSelection) => `${sourceSelectionName(selection)}SourceSelectionByKey`

const lowerSourceSelectionExpression = (selection: readonly string[] | _SourceSelection | undefined) => {
	if (selection == null)
		return undefined
	if (Array.isArray(selection))
		return lowerSourceArray(selection)
	if (selection.name != null)
		return defaultSourcesName(selection)

	return lowerSourceArray(selection.default)
}

const lowerSourceSelectionByKey = (selection: _SourceSelection) => lowerObject((selection.cases ?? []).map((item) => [
	item.when.map((condition) => condition.equals).join(':'),
	lowerSourceArray(item.sources),
]))

const isFieldConditionedSourceSelection = (
	selection: readonly string[] | _SourceSelection | undefined
): selection is _SourceSelection & { cases: NonNullable<_SourceSelection['cases']> } => (
	selection != null
	&& !Array.isArray(selection)
	&& selection.name != null
	&& selection.cases != null
	&& selection.cases.length > 0
)

const lowerFieldConditionedSourceSelectionExpression = (
	selection: readonly string[] | _SourceSelection | undefined,
	entityExpression: string
) => {
	if (!isFieldConditionedSourceSelection(selection))
		return lowerSourceSelectionExpression(selection)

	const fields = selection.cases[0].when.map((condition) => condition.field)
	if (
		fields.some((field) => field == null)
		|| selection.cases.some((item) => (
			item.when.length !== fields.length
			|| item.when.some((condition, index) => condition.field !== fields[index])
		))
	)
		throw new Error(`Field-conditioned source selection ${selection.name} must use the same ordered fields in every case`)

	return `${sourceSelectionByKeyName(selection)}[[${fields.map((field) => `String(${fieldExpression(entityExpression, field ?? '')})`).join(', ')}].join(':')] ?? ${defaultSourcesName(selection)}`
}

const lowerOrderFieldAccessor = (
	entity: Entity | undefined,
	field: string
) => (
	field === 'sourceOrder' ?
		'fieldRow.valueIndex'
	:
	entity != null && entitySelectorFieldNames(entity).has(field) ?
		`fieldRow[EntityMetaKey.Value][EntityMetaKey.Selector]${propertyAccess(field)}`
	:
		`fieldRow[EntityMetaKey.Value]${propertyAccess(field)}`
)

const lowerQuery = (
	query: _ViewQuery | _ListView['query'] | undefined,
	fields?: readonly FieldReference[],
	sourcesExpression?: string,
	openExpression?: string,
	excludedFields?: ReadonlySet<string>,
	orderEntity?: Entity,
	requestCount = false
) => {
	const queryEntries: [string, string | undefined][] = []
	const sources = query == null ? undefined : 'sources' in query ? query.sources : undefined
	const openSources = query == null ? undefined : 'openSources' in query ? query.openSources : undefined
	const openFields = query == null ? undefined : 'openFields' in query ? query.openFields : undefined
	const limit = query == null ? undefined : 'limit' in query ? query.limit : undefined
	const queryFields = unique(
		fields ?? (query != null && 'fields' in query ? query.fields ?? [] : [])
	).filter((field) => !excludedFields?.has(fieldNameForReference(field)))

	queryEntries.push([
		'sources',
		openExpression != null && openSources != null ?
			`${openExpression} ? ${lowerSourceArray(openSources)} : ${sourcesExpression ?? lowerSourceSelectionExpression(sources) ?? 'undefined'}`
		:
			sourcesExpression ?? lowerSourceSelectionExpression(sources),
	])
	queryEntries.push([
		'fields',
		lowerQueryFields(queryFields, openFields, openExpression),
	])
	queryEntries.push([
		'limit',
		typeof limit === 'number' ? String(limit) : limit?.default == null ? undefined : String(limit.default),
	])
	queryEntries.push([
		'count',
		requestCount || query != null && 'count' in query && query.count === true ? 'true' : undefined,
	])
	queryEntries.push([
		'orderBy',
		query != null && 'orderBy' in query && query.orderBy != null ?
			lowerArray(query.orderBy.map((order) => `[({ fieldRow }) => ${lowerOrderFieldAccessor(orderEntity, order.field)} ?? ${order.direction === 'desc' ? 'Number.NEGATIVE_INFINITY' : 'Number.POSITIVE_INFINITY'}, ${emitTypeScript(order.direction)}]`))
		:
			undefined,
	])

	return lowerObject(queryEntries)
}

const fieldQuery = (
	fieldDefinition: EntityField,
	query: _ViewQuery | undefined
) => (
	query?.sources != null || fieldDefinition.defaultSources == null ?
		query
	:
		{
			...query,
			sources: fieldDefinition.defaultSources,
		}
)

const fieldQueryForName = (
	entity: Entity,
	indexes: LoweringIndexes,
	field: FieldReference | undefined,
	query: _ViewQuery | undefined
) => {
	const fieldDefinition = field == null ? undefined : fieldDefinitionByReference(entity, field, indexes)
	return fieldDefinition == null ? query : fieldQuery(fieldDefinition, query)
}

const viewConditionFields = (
	conditions: readonly { field: FieldReference }[] | undefined
) => [...new Map(
	(conditions ?? []).map((condition) => [fieldReferenceKey(condition.field), condition.field])
).values()]

const conditionExpression = (
	conditions: readonly {
		field: FieldReference
		equals?: _Literal
		notEquals?: _Literal
		contains?: _Literal
		oneOf?: readonly _Literal[]
	}[],
	entityExpression: string,
	entity?: Entity,
	indexes?: LoweringIndexes,
	partial = false
) => conditions
	.map((condition) => {
		if (isProjectionFieldReference(condition.field))
			throw new Error(`Projection condition ${condition.field.join('.')} must be lowered inside its ProjectionBoundary`)

		const fieldDefinition = entity == null ? undefined : fieldDefinitionByReference(entity, condition.field, indexes)
		const valueExpression = fieldExpression(entityExpression, condition.field)
		const conditionValueExpression = (
			fieldDefinition != null
			&& (
				fieldDefinition.cardinality === EntityFieldCardinality.Many
				|| fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrMany
			) ?
				`${valueExpression}.values`
			:
				valueExpression
		)
		const expression = [
			!('equals' in condition) ? undefined : `${conditionValueExpression} === ${emitTypeScript(condition.equals)}`,
			!('notEquals' in condition) ? undefined : `${conditionValueExpression} !== ${emitTypeScript(condition.notEquals)}`,
			!('contains' in condition) ? undefined : `${conditionValueExpression}.includes(${emitTypeScript(condition.contains)})`,
			!('oneOf' in condition) ? undefined : `${lowerArray(condition.oneOf.map(emitTypeScript))}.includes(${conditionValueExpression})`,
		].filter(Boolean).join(' && ')
		return partial ? `${valueExpression} !== undefined && ${expression}` : expression
	})
	.join(' && ')

const lowerConditionedEntityLines = (
	entity: Entity,
	indexes: LoweringIndexes,
	conditions: readonly {
		field: FieldReference
		equals?: _Literal
		notEquals?: _Literal
		contains?: _Literal
		oneOf?: readonly _Literal[]
	}[] | undefined,
	level: number,
	bodyLines: readonly string[]
) => {
	if (conditions == null || conditions.length === 0)
		return [...bodyLines]

	const conditionFieldReferences = viewConditionFields(conditions)
	const conditionSources = unique(
		conditionFieldReferences.flatMap((fieldReference) => (
			fieldDefinitionByReference(entity, fieldReference, indexes)?.defaultSources ?? []
		))
	)
	const conditionQuery = lowerQuery(
		conditionSources.length === 0 ? undefined : {
			sources: conditionSources,
		},
		conditionFieldReferences
	)
	const pendingReady = conditionExpression(conditions, 'pendingEntity', entity, indexes, true)
	const pendingGateUndefined = conditionFieldReferences
		.map((fieldReference) => {
			if (isProjectionFieldReference(fieldReference))
				throw new Error(`Projection condition ${fieldReference.join('.')} must be lowered inside its ProjectionBoundary`)

			return `${fieldExpression(pendingEntityExpression, fieldReference)} === undefined`
		})
		.join(' || ')

	return [
		`${'\t'.repeat(level)}{#if ${pendingReady}}`,
		...bodyLines,
		`${'\t'.repeat(level)}{:else if ${pendingGateUndefined}}`,
		`${'\t'.repeat(level + 1)}<ResourceBoundary`,
		lowerSvelteAttribute(level + 2, 'resource', `selection(${conditionQuery})`),
		`${'\t'.repeat(level + 1)}>`,
		`${'\t'.repeat(level + 2)}{#snippet children(entity)}`,
		`${'\t'.repeat(level + 3)}{@const ${resolvedEntityExpression} = ${resolvedEntitySurfaceExpression}}`,
		`${'\t'.repeat(level + 3)}{#if ${conditionExpression(conditions, resolvedEntityExpression, entity, indexes)}}`,
		...bodyLines.map((line) => indent(line, 4)),
		`${'\t'.repeat(level + 3)}{/if}`,
		`${'\t'.repeat(level + 2)}{/snippet}`,
		`${'\t'.repeat(level + 1)}</ResourceBoundary>`,
		`${'\t'.repeat(level)}{/if}`,
	]
}

const lowerProjectionConditionedLines = (
	entity: Entity,
	indexes: LoweringIndexes,
	projectionPath: readonly [string, ...string[]],
	conditions: readonly {
		field: FieldReference
		equals?: _Literal
		notEquals?: _Literal
		contains?: _Literal
		oneOf?: readonly _Literal[]
	}[] | undefined,
	level: number,
	bodyLines: readonly string[]
) => (conditions ?? []).reduceRight<string[]>((lines, condition, conditionIndex) => {
	if (
		!isProjectionFieldReference(condition.field)
		|| condition.field.length !== projectionPath.length + 1
		|| !projectionPath.every((facetName, index) => condition.field[index] === facetName)
	)
		throw new Error(`${entity.entityType} projection ${projectionPath.join('.')} condition must reference a field on that projection`)

	const fieldName = fieldNameForReference(condition.field)
	const fieldDefinition = fieldDefinitionByReference(entity, condition.field, indexes)
	if (fieldDefinition == null)
		throw new Error(`${entity.entityType} projection condition references missing field ${condition.field.join('.')}`)

	const valueName = `projectionConditionValue${conditionIndex}`
	const valueExpression = (
		fieldDefinition.cardinality === EntityFieldCardinality.Many
		|| fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrMany ?
			`${valueName}.values`
		:
			valueName
	)
	const expression = [
		!('equals' in condition) ? undefined : `${valueExpression} === ${emitTypeScript(condition.equals)}`,
		!('notEquals' in condition) ? undefined : `${valueExpression} !== ${emitTypeScript(condition.notEquals)}`,
		!('contains' in condition) ? undefined : `${valueExpression}.includes(${emitTypeScript(condition.contains)})`,
		!('oneOf' in condition) ? undefined : `${lowerArray(condition.oneOf.map(emitTypeScript))}.includes(${valueExpression})`,
	].filter(Boolean).join(' && ')
	return [
		`${'\t'.repeat(level)}<ResourceBoundary resource={projection${propertyAccess(fieldName)}}>`,
		`${'\t'.repeat(level + 1)}{#snippet children(${valueName})}`,
		`${'\t'.repeat(level + 2)}{#if ${expression}}`,
		...reindentLines(lines, level + 3),
		`${'\t'.repeat(level + 2)}{/if}`,
		`${'\t'.repeat(level + 1)}{/snippet}`,
		`${'\t'.repeat(level)}</ResourceBoundary>`,
	]
}, [...bodyLines])

const expressionImports = (expression: _Expression, imports = new Map<string, Set<string>>()) => {
	if (typeof expression === 'string' || 'raw' in expression)
		return imports
	if (expression.kind === 'catalogIndex') {
		const existing = imports.get(expression.from) ?? new Set<string>()
		existing.add(expression.map)
		imports.set(expression.from, existing)
	}
	if (expression.kind === 'call') {
		if (expression.from !== '') {
			const existing = imports.get(expression.from) ?? new Set<string>()
			existing.add(expression.name)
			imports.set(expression.from, existing)
		}
	}

	for (const value of Object.values(expression)) {
		if (Array.isArray(value)) {
			for (const item of value) {
				if (typeof item === 'object' && item != null && 'kind' in item)
					expressionImports(item, imports)
				if (typeof item === 'object' && item != null && 'value' in item && typeof item.value === 'object')
					expressionImports(item.value as _Expression, imports)
			}
			continue
		}

		if (typeof value === 'object' && value != null && 'kind' in value)
			expressionImports(value as _Expression, imports)
	}

	return imports
}

const uniqueFieldPaths = (fieldPaths: string[][]) => [...new Map(
	fieldPaths.map((fieldPath) => [fieldPath.join('\0'), fieldPath])
).values()]

const expressionFieldPaths = (expression: _Expression): string[][] => {
	if (typeof expression === 'string' || 'raw' in expression)
		return []
	if (expression.kind === 'field')
		return [[expression.name]]
	if (expression.kind === 'property')
		return expressionFieldPaths(expression.value).map((fieldPath) => [...fieldPath, expression.property])
	if (expression.kind === 'object')
		return uniqueFieldPaths(expression.fields.flatMap((field) => expressionFieldPaths(field.value)))
	if (expression.kind === 'selector')
		return uniqueFieldPaths(expression.params.flatMap((param) => 'value' in param ? expressionFieldPaths(param.value) : []))
	if (expression.kind === 'catalogIndex')
		return uniqueFieldPaths([
			...(expression.field == null ? [] : [[expression.field]]),
			...(expression.key == null ? [] : expressionFieldPaths(expression.key)),
		])
	if (expression.kind === 'call')
		return uniqueFieldPaths(expression.args.flatMap((argument) => expressionFieldPaths(argument)))
	if (expression.kind === 'template')
		return uniqueFieldPaths(expression.parts.flatMap((part) => typeof part === 'string' ? [] : expressionFieldPaths(part)))
	if (expression.kind === 'case')
		return uniqueFieldPaths([
			...expressionFieldPaths(expression.value),
			...expression.cases.flatMap((item) => expressionFieldPaths(item.value)),
			...expressionFieldPaths(expression.default),
		])

	return []
}

const routeExpressionQueryFields = (expression: _Expression) => (
	unique(expressionFieldPaths(expression).map((fieldPath) => fieldPath[0]).filter((fieldName): fieldName is string => fieldName != null))
)

const routeExpressionConditions = (fieldsExpression: string, expression: _Expression): string[] => {
	if (typeof expression === 'string' || 'raw' in expression)
		return []

	if (expression.kind === 'case') {
		const valueCondition = routeExpressionConditions(fieldsExpression, expression.value).join(' && ')
		const valueExpression = lowerAppExpression(expression.value, {
			fields: fieldsExpression,
		})
		const caseCondition = `(${expression.cases
			.map((item) => `${valueExpression} === ${emitTypeScript(item.equals)} ? ${routeExpressionConditions(fieldsExpression, item.value).join(' && ') || 'true'}`)
			.join(' : ')} : ${routeExpressionConditions(fieldsExpression, expression.default).join(' && ') || 'true'})`

		return [valueCondition === '' ? caseCondition : `(${valueCondition} && ${caseCondition})`]
	}

	return uniqueFieldPaths(expressionFieldPaths(expression).flatMap((fieldPath) => (
		fieldPath.map((_, index) => fieldPath.slice(0, index + 1))
	))).map((fieldPath) => (
		`${fieldExpression(fieldsExpression, fieldPath[0] ?? '')}${fieldPath.slice(1).map(propertyAccess).join('')} !== undefined`
	))
}

const expressionUsesKind = (expression: _Expression | undefined, kind: _Expression['kind']): boolean => {
	if (expression == null)
		return false
	if (typeof expression === 'string' || 'raw' in expression)
		return false
	if (expression.kind === kind)
		return true

	return Object.values(expression).some((value) => (
		Array.isArray(value) ?
			value.some((item) => (
				(
					typeof item === 'object'
					&& item != null
					&& 'kind' in item
					&& expressionUsesKind(item as _Expression, kind)
				)
				|| (
					typeof item === 'object'
					&& item != null
					&& 'value' in item
					&& typeof item.value === 'object'
					&& item.value != null
					&& 'kind' in item.value
					&& expressionUsesKind(item.value as _Expression, kind)
				)
			))
		:
			typeof value === 'object'
			&& value != null
			&& 'kind' in value
			&& expressionUsesKind(value as _Expression, kind)
		))
}

const expressionUsesRouteParams = (expression: _Expression | undefined): boolean => {
	if (expression == null)
		return false
	if (typeof expression === 'string' || 'raw' in expression)
		return false
	if (expression.kind === 'param')
		return true
	if (expression.kind === 'catalogIndex' && expression.param != null)
		return true
	if (expression.kind === 'selector' && expression.params.some((param) => !('value' in param)))
		return true

	return Object.values(expression).some((value) => (
		Array.isArray(value) ?
			value.some((item) => (
				(
					typeof item === 'object'
					&& item != null
					&& 'kind' in item
					&& expressionUsesRouteParams(item as _Expression)
				)
				|| (
					typeof item === 'object'
					&& item != null
					&& 'value' in item
					&& typeof item.value === 'object'
					&& item.value != null
					&& 'kind' in item.value
					&& expressionUsesRouteParams(item.value as _Expression)
				)
			))
		:
			typeof value === 'object'
			&& value != null
			&& 'kind' in value
			&& expressionUsesRouteParams(value as _Expression)
	))
}

const lowerExpression = (
	expression: _Expression,
	context: {
		params?: string
		fields?: string
		pageSelector?: string
	}
): string => {
	if (typeof expression === 'string')
		return expression
	if ('raw' in expression)
		return expression.raw
	if (expression.kind === 'literal')
		return emitTypeScript(expression.value)
	if (expression.kind === 'param') {
		const value = context.params === 'page.params' ?
			`(page.params.${expression.name} ?? '')`
		:
			`${context.params ?? 'params'}.${expression.name}`
		if (expression.decode === 'decodeURIComponent')
			return `decodeURIComponent(${value})`
		if (expression.decode === 'bigint')
			return `BigInt(${value})`
		if (expression.decode === 'number')
			return `Number(${value})`

		return value
	}
	if (expression.kind === 'field')
		return fieldExpression(context.fields ?? 'selector', expression.name)
	if (expression.kind === 'property')
		return `${lowerExpression(expression.value, context)}.${expression.property}`
	if (expression.kind === 'pageSelector')
		return context.pageSelector ?? 'data.selector'
	if (expression.kind === 'object')
		return lowerObject(expression.fields.map((field) => [
			field.name,
			lowerExpression(field.value, context),
		]))
	if (expression.kind === 'selector')
		return lowerObject(expression.params.map((param) => [
			param.field,
			'value' in param ?
				lowerExpression(param.value, context)
			:
				lowerExpression({
					kind: 'param',
					name: param.param,
					decode: param.decode,
				}, context),
		]))
	if (expression.kind === 'catalogIndex') {
		const key = (
			expression.key != null ?
				lowerExpression(expression.key, context)
			: expression.param != null ?
				`${context.params ?? 'params'}.${expression.param}`
			: expression.field != null ?
				fieldExpression(context.fields ?? 'selector', expression.field)
			:
				'undefined'
		)

		return `${expression.map}[${key}]${expression.property == null ? '' : propertyAccess(expression.property)}`
	}
	if (expression.kind === 'call')
		return `${expression.name}(${expression.args.map((argument) => lowerExpression(argument, context)).join(', ')})`
	if (expression.kind === 'template')
		return expression.parts
			.map((part) => typeof part === 'string' ? emitTypeScript(part) : `String(${lowerExpression(part, context)})`)
			.join(' + ')
	if (expression.kind === 'case')
		return [
			'(',
			...expression.cases.map((item) => `${lowerExpression(expression.value, context)} === ${emitTypeScript(item.equals)} ?\n${indent(lowerExpression(item.value, context), 1)}\n:`),
			indent(lowerExpression(expression.default, context), 1),
			')',
		].join('\n')

	throw new Error(`Unsupported expression kind: ${(expression as { kind: string }).kind}`)
}

const lowerAppExpression = (
	expression: _Expression,
	context: {
		params?: string
		fields?: string
		pageSelector?: string
	}
): string => {
	if (expression.kind === 'literal')
		return emitTypeScript(expression.value)
	if (expression.kind === 'param')
		return lowerExpression(expression, context)
	if (expression.kind === 'field')
		return fieldExpression(context.fields ?? 'selection.entitySelector', expression.name)
	if (expression.kind === 'property')
		return `${lowerAppExpression(expression.value, context)}${propertyAccess(expression.property)}`
	if (expression.kind === 'pageSelector')
		return context.pageSelector ?? 'data.selector'
	if (expression.kind === 'catalogIndex') {
		const key = (
			expression.key != null ?
				lowerAppExpression(expression.key, context)
			: expression.param != null ?
				`${context.params ?? 'params'}.${expression.param}`
			: expression.field != null ?
				fieldExpression(context.fields ?? 'selection.entitySelector', expression.field)
			:
				'undefined'
		)

		return `${expression.map}[String(${key})]${expression.property == null ? '' : propertyAccess(expression.property)}`
	}
	if (expression.kind === 'call')
		return `${expression.name}(${expression.args.map((argument) => lowerAppExpression(argument, context)).join(', ')})`
	if (expression.kind === 'template')
		return expression.parts
			.map((part) => typeof part === 'string' ? emitTypeScript(part) : `String(${lowerAppExpression(part, context)})`)
			.join(' + ')
	if (expression.kind === 'case')
	{
		const valueExpression = lowerAppExpression(expression.value, context)
		const caseExpressions = expression.cases.map((item) => ({
			equals: emitTypeScript(item.equals),
			value: lowerAppExpression(item.value, context),
		}))
		const defaultExpression = lowerAppExpression(expression.default, context)
		const inlineExpression = `(${caseExpressions.map((item) => `${valueExpression} === ${item.equals} ? ${item.value}`).join(' : ')} : ${defaultExpression})`
		if (!inlineExpression.includes('\n'))
			return inlineExpression

		return [
			'(',
			...caseExpressions.flatMap((item) => [
				...indent(`${valueExpression} === ${item.equals} ?`).split('\n'),
				...indent(item.value, 2).split('\n'),
				'\t:',
			]),
			indent(defaultExpression, 2),
			')',
		].join('\n')
	}

	return lowerExpression(expression, context)
}

const labelForField = (field: EntityField) => displayLabel(
	field.label
	?? field.name
		.replace(/^\$\$?/, '')
		.replace(/([a-z])([A-Z])/g, '$1 $2')
		.replace(/^./, (letter) => letter.toUpperCase())
)

const sentenceStart = (value: string) => displayLabel(value).replace(/^./, (letter) => letter.toUpperCase())

const rawSnippetSources = (value: unknown, snippets: _RawSnippet[] = []) => {
	if (Array.isArray(value)) {
		for (const item of value)
			rawSnippetSources(item, snippets)
		return snippets
	}
	if (typeof value !== 'object' || value == null)
		return snippets
	if ('raw' in value && typeof value.raw === 'string') {
		snippets.push(value as _RawSnippet)
		return snippets
	}
	for (const nestedValue of Object.values(value))
		rawSnippetSources(nestedValue, snippets)

	return snippets
}

const collectSourceSelections = (value: unknown, selections: _SourceSelection[] = []) => {
	if (Array.isArray(value)) {
		for (const item of value)
			collectSourceSelections(item, selections)
		return selections
	}
	if (typeof value !== 'object' || value == null)
		return selections
	if (('cases' in value || 'default' in value) && 'name' in value && typeof value.name === 'string') {
		if (!('default' in value) || !Array.isArray(value.default))
			throw new Error(`Named source selection ${value.name} must provide a default source array`)

		selections.push(value as _SourceSelection)
		return selections
	}
	for (const nestedValue of Object.values(value))
		collectSourceSelections(nestedValue, selections)

	return selections
}

type RouteDetail = {
	entityType: EntityType
	selectorName: string
	selector: _Expression
	component: string
	href: string
}
type RouteDetailLayoutPlan = {
	details: readonly RouteDetail[]
	components: readonly string[]
	hrefExpression: string
	keyExpression?: string
	detailViewExpression: string
	detailSelectionExpression: string
}

type RouteAncestorSelector = {
	ancestorNodeId: string
	descendantSvelteKitPath: string
	entityType: string
	selectorName: string
	depth: number
	hrefAlternatives: readonly Readonly<Record<string, _Expression>>[]
	params: Extract<_Expression, { kind: 'selector' }>['params']
	mapping: SelectorRouteMapping
}

export const nearestApplicableSelectorAncestors = <_Ancestor>(candidates: readonly {
	ancestor: _Ancestor
	depth: number
	referencePaths: readonly (readonly string[])[]
}[]) => {
	const applicableAncestors = candidates.flatMap((candidate) => candidate.referencePaths.map((referencePath) => ({
		ancestor: candidate.ancestor,
		depth: candidate.depth,
		referencePath,
	})))
	const nearestDepth = Math.max(...applicableAncestors.map(({ depth }) => depth))

	return applicableAncestors.filter(({ depth }) => depth === nearestDepth)
}

export const composeSelectorHrefAlternatives = (
	routeMappingId: string,
	ownHrefParams: Readonly<Record<string, _Expression>>,
	bindingGroups: readonly {
		field: string
		alternatives: readonly Readonly<Record<string, _Expression>>[]
	}[],
	maximumAlternatives = 256
) => {
	const hrefParamsKey = (hrefParams: Readonly<Record<string, _Expression>>) => JSON.stringify(
		Object.entries(hrefParams).toSorted(([leftParam], [rightParam]) => leftParam.localeCompare(rightParam))
	)
	let hrefParamAlternatives = [ownHrefParams]
	for (const bindingGroup of bindingGroups) {
		if (bindingGroup.alternatives.length === 0)
			throw new Error(`${routeMappingId} inherited field ${bindingGroup.field} has no applicable ancestor href alternatives`)

		const bindingHrefAlternatives = [...new Map(bindingGroup.alternatives.map((alternative) => [
			hrefParamsKey(alternative),
			alternative,
		])).values()]
		const composedAlternatives = new Map<string, Readonly<Record<string, _Expression>>>()
		for (const hrefParams of hrefParamAlternatives)
			for (const bindingHrefParams of bindingHrefAlternatives) {
				const conflictingParam = Object.keys(bindingHrefParams).find((param) => (
					hrefParams[param] != null
					&& JSON.stringify(hrefParams[param]) !== JSON.stringify(bindingHrefParams[param])
				))
				if (conflictingParam != null)
					throw new Error(`${routeMappingId} inherited field groups ambiguously bind href parameter ${conflictingParam}`)

				const composedHrefParams = {
					...hrefParams,
					...bindingHrefParams,
				}
				composedAlternatives.set(hrefParamsKey(composedHrefParams), composedHrefParams)
				if (composedAlternatives.size > maximumAlternatives)
					throw new Error(`${routeMappingId} produces more than ${maximumAlternatives} structurally distinct href alternatives`)
			}
		hrefParamAlternatives = [...composedAlternatives.values()]
	}

	return hrefParamAlternatives
}

const entitySelectorReferencePaths = (
	entityByType: ReadonlyMap<string, Entity>,
	currentEntityType: string,
	selectorName: string,
	targetEntityType: string,
	selectorTraversalPath: readonly string[] = [],
	visitedEntityTypes: ReadonlySet<string> = new Set()
): string[][] => {
	if (currentEntityType === targetEntityType)
		return [[...selectorTraversalPath]]
	if (visitedEntityTypes.has(currentEntityType))
		return []

	const currentEntity = entityByType.get(currentEntityType)
	const selector = currentEntity?.selectors.find((candidate) => candidate.name === selectorName)
	if (currentEntity == null || selector == null)
		return []

	const referencePaths = selector.fields.flatMap((fieldName) => {
		const field = currentEntity.fields.find((candidate) => candidate.name === fieldName)
		if (field?.type !== EntityFieldType.EntityReference || field.entityType == null)
			return []

		const referencedEntityType = field.entityType
		const referencedEntity = entityByType.get(referencedEntityType)
		return referencedEntity == null ? [] : referencedEntity.selectors.flatMap((referencedSelector) => entitySelectorReferencePaths(
			entityByType,
			referencedEntityType,
			referencedSelector.name,
			targetEntityType,
			[
				...selectorTraversalPath,
				fieldName,
			],
			new Set([
				...visitedEntityTypes,
				currentEntityType,
			])
		))
	})

	return unique(referencePaths.map((referencePath) => referencePath.join('\0')))
		.map((referencePath) => referencePath.split('\0').filter(Boolean))
}

const routePageSelectorExpression = (
	entityByType: ReadonlyMap<string, Entity>,
	ancestorSelectors: readonly RouteAncestorSelector[],
	entityType: string
): _Expression | undefined => {
	const referencePaths = unique(nearestApplicableSelectorAncestors(ancestorSelectors.map((ancestor) => ({
		ancestor,
		depth: ancestor.depth,
		referencePaths: entitySelectorReferencePaths(
			entityByType,
			ancestor.entityType,
			ancestor.selectorName,
			entityType
		),
	})))
		.map(({ referencePath }) => referencePath.join('\0')))
		.map((referencePathKey) => referencePathKey.split('\0').filter(Boolean))
	if (referencePaths.length === 0)
		return undefined
	if (referencePaths.length > 1)
		throw new Error(`Nearest route selectors expose ${entityType} through ambiguous paths: ${referencePaths.map((candidateReferencePath) => candidateReferencePath.join('.')).join(', ')}`)
	const referencePath = referencePaths[0]
	if (referencePath == null)
		return undefined

	return referencePath.reduce<_Expression>((value, property) => ({
		kind: 'property',
		value,
		property,
	}), {
		kind: 'pageSelector',
	})
}

const resolveRouteParamFieldPath = (
	entityByType: ReadonlyMap<string, Entity>,
	entity: Entity,
	fieldPath: readonly string[]
) => {
	let fieldEntity = entity
	const fields = fieldPath.map((fieldName, index) => {
		const field = fieldEntity.fields.find((candidate) => candidate.name === fieldName)
		if (field == null)
			throw new Error(`${entity.entityType} route parameter path ${fieldPath.join('.')} references missing field ${fieldEntity.entityType}.${fieldName}`)

		if (index < fieldPath.length - 1) {
			if (field.type !== EntityFieldType.EntityReference || field.entityType == null)
				throw new Error(`${entity.entityType} route parameter path ${fieldPath.join('.')} traverses non-reference field ${fieldEntity.entityType}.${fieldName}`)

			const referencedEntity = entityByType.get(field.entityType)
			if (referencedEntity == null)
				throw new Error(`${entity.entityType} route parameter path ${fieldPath.join('.')} references missing entity ${field.entityType}`)

			fieldEntity = referencedEntity
		}

		return field
	})
	const terminalField = fields.at(-1)
	if (terminalField?.type !== EntityFieldType.Primitive || terminalField.valueType == null)
		throw new Error(`${entity.entityType} route parameter path ${fieldPath.join('.')} does not terminate at a primitive schema field`)

	return {
		fields,
		terminalField,
	}
}

const routeExpressionThroughReference = (
	expression: _Expression,
	referenceField: string
): _Expression => {
	if (typeof expression === 'string' || 'raw' in expression)
		return expression
	if (expression.kind === 'field')
		return {
			kind: 'property',
			value: {
				kind: 'field',
				name: referenceField,
			},
			property: expression.name,
		}
	if (expression.kind === 'property')
		return {
			...expression,
			value: routeExpressionThroughReference(expression.value, referenceField),
		}
	if (expression.kind === 'template')
		return {
			...expression,
			parts: expression.parts.map((part) => (
				typeof part === 'string' ? part : routeExpressionThroughReference(part, referenceField)
			)),
		}
	if (expression.kind === 'call')
		return {
			...expression,
			args: expression.args.map((argument) => routeExpressionThroughReference(argument, referenceField)),
		}

	return expression
}

const routeParamHrefValuesFromExpression = (
	expression: _Expression,
	fieldValue: _Expression,
	entityByType: ReadonlyMap<string, Entity>,
	routeParamValueTypes: ReadonlyMap<string, readonly string[]>
): readonly (readonly [string, _Expression])[] => {
	if (typeof expression === 'string' || 'raw' in expression)
		return []
	if (expression.kind === 'param')
		return [[expression.name, fieldValue]]
	if (expression.kind === 'object')
		return expression.fields.flatMap((field) => routeParamHrefValuesFromExpression(field.value, {
			kind: 'property',
			value: fieldValue,
			property: field.name,
		}, entityByType, routeParamValueTypes))
	if (expression.kind === 'selector') {
		const referencedEntity = entityByType.get(expression.entity)
		return expression.params.flatMap((selectorParam) => {
			const selectorFieldValue = {
				kind: 'property' as const,
				value: fieldValue,
				property: selectorParam.field,
			}
			if ('value' in selectorParam) {
				const directValues = routeParamHrefValuesFromExpression(
					selectorParam.value,
					selectorParam.hrefValue ?? selectorFieldValue,
					entityByType,
					routeParamValueTypes
				)
				const directParams = new Set(directValues.map(([param]) => param))
				return [
					...directValues,
					...unique(routeParamNamesFromExpression(selectorParam.value)).flatMap((param) => {
						if (directParams.has(param) || referencedEntity == null)
							return []
						const valueTypes = routeParamValueTypes.get(param) ?? []
						const selectorFieldNames = new Set(referencedEntity.selectors.flatMap((selector) => selector.fields))
						const fields = referencedEntity.fields.filter((field) => (
							selectorFieldNames.has(field.name)
							&&
							field.type === EntityFieldType.Primitive
							&& field.cardinality === EntityFieldCardinality.One
							&& valueTypes.includes(field.valueType)
						))
						return fields.length !== 1 || fields[0] == null ? [] : [[
							param,
							{
								kind: 'property' as const,
								value: fieldValue,
								property: fields[0].name,
							},
						] as const]
					}),
				]
			}

			return [[selectorParam.param, selectorFieldValue]]
		})
	}
	if (expression.kind === 'call') {
		const routeParams = expression.args.flatMap((argument) => routeParamHrefValuesFromExpression(
			argument,
			fieldValue,
			entityByType,
			routeParamValueTypes
		))
		return new Set(routeParams.map(([param]) => param)).size === 1 ? routeParams.slice(0, 1) : []
	}

	return []
}

const routeParamNamesFromExpression = (expression: _Expression): string[] => {
	if (typeof expression === 'string' || 'raw' in expression)
		return []
	if (expression.kind === 'param')
		return [expression.name]
	if (expression.kind === 'object')
		return unique(expression.fields.flatMap((field) => routeParamNamesFromExpression(field.value)))
	if (expression.kind === 'selector')
		return unique(expression.params.flatMap((param) => (
			'value' in param ? routeParamNamesFromExpression(param.value) : [param.param]
		)))
	if (expression.kind === 'catalogIndex')
		return unique([
			...(expression.param == null ? [] : [expression.param]),
			...(expression.key == null ? [] : routeParamNamesFromExpression(expression.key)),
		])
	if (expression.kind === 'call')
		return unique(expression.args.flatMap(routeParamNamesFromExpression))
	if (expression.kind === 'template')
		return unique(expression.parts.flatMap((part) => typeof part === 'string' ? [] : routeParamNamesFromExpression(part)))
	if (expression.kind === 'case')
		return unique([
			...routeParamNamesFromExpression(expression.value),
			...expression.cases.flatMap((item) => routeParamNamesFromExpression(item.value)),
			...routeParamNamesFromExpression(expression.default),
		])

	return []
}

const indexRouteParamValueTypes = (
	nodes: App['routes']['children'],
	entities: readonly Entity[]
) => {
	const entityByType = new Map(entities.map((entity) => [entity.entityType, entity]))
	const valueTypesByOwner = new Map<string, string[]>()
	const visit = (
		children: App['routes']['children'],
		parentPath = '',
		ancestorOwnerByParam: ReadonlyMap<string, string> = new Map()
	) => {
		for (const [segment, node] of Object.entries(children)) {
			const routePath = [parentPath, segment].filter(Boolean).join('/')
			const ownerByParam = new Map(ancestorOwnerByParam)
			for (const param of routeParamNames(segment))
				ownerByParam.set(param, `${routeId(routePath)}\0${param}`)

			for (const [entityType, selectors] of Object.entries(node.selectors ?? {}))
				for (const [selectorName, mapping] of Object.entries(selectors))
					for (const [param, fieldPath] of Object.entries(mapping.params ?? {})) {
						const owner = ownerByParam.get(param)
						if (owner == null)
							throw new Error(`${routeId(routePath)} ${entityType}.${selectorName} binds undeclared route parameter ${param}`)
						const entity = entityByType.get(entityType)
						if (entity == null)
							throw new Error(`${routeId(routePath)} ${entityType}.${selectorName} references missing entity`)
						const { terminalField } = resolveRouteParamFieldPath(entityByType, entity, fieldPath)

						valueTypesByOwner.set(owner, unique([
							...(valueTypesByOwner.get(owner) ?? []),
							terminalField.valueType,
						]))
					}

			visit(
				node.children ?? {},
				routePath,
				ownerByParam
			)
		}
	}

	visit(nodes)

	return valueTypesByOwner
}

const compileRouteTree = (
	nodes: App['routes']['children'],
	entities: readonly Entity[],
	valueTypeById: ReadonlyMap<string | undefined, App['schema']['valueTypes'][number]>,
	routeParamValueTypesByOwner: ReadonlyMap<string, readonly string[]>,
	parentPath = '',
	ancestorSelectors: readonly RouteAncestorSelector[] = [],
	ancestorRouteParams: readonly RouteParam[] = [],
	parentSvelteKitPath = ''
): {
	nodes: RouteNode[]
} => {
	const compiledNodes = Object.entries(nodes).map(([segment, node]) => {
		const routePath = [parentPath, segment].filter(Boolean).join('/')
		const entityByType = new Map(entities.map((entity) => [entity.entityType, entity]))
		const selectorMappings = Object.entries(node.selectors ?? {}).flatMap(([entityType, selectors]) => (
			Object.entries(selectors).map(([selectorName, mapping]) => ({
				entityType,
				selectorName,
				mapping,
			}))
		))
		const routeParams = [
			...ancestorRouteParams,
			...routeParamNames(segment).map((name) => {
				const explicitValueTypes = node.params?.[name] ?? []
				const boundValueTypes = routeParamValueTypesByOwner.get(`${routeId(routePath)}\0${name}`) ?? []
				const valueTypes = unique([
					...explicitValueTypes,
					...boundValueTypes,
				])
				const routeParamDefinitions = valueTypes.flatMap((valueType) => {
					const routeParam = valueTypeById.get(valueType)?.routeParam
					return routeParam == null ? [] : [routeParam]
				})
				if (valueTypes.length === 0 || routeParamDefinitions.length !== valueTypes.length)
					throw new Error(`${routeId(routePath)} parameter ${name} has no schema route parameter type`)
				const matchers = unique(routeParamDefinitions.map((routeParam) => routeParam.matcher))
				const matcher = matchers.length === 1 ? matchers[0] : matchers.map((candidate, index) => (
					index === 0 ? candidate : `Or${candidate[0]?.toUpperCase()}${candidate.slice(1)}`
				)).join('')
				if (matcher == null)
					throw new Error(`${routeId(routePath)} parameter ${name} has no schema matcher`)
				const decodes = [...new Map(routeParamDefinitions.flatMap((routeParam) => routeParam.decode == null ? [] : [[
					JSON.stringify(routeParam.decode),
					routeParam.decode,
				] as const])).values()]
				if (decodes.length > 1)
					throw new Error(`${routeId(routePath)} parameter ${name} has incompatible schema decoders`)

				return {
					name,
					matcher,
					matchers,
					explicitValueTypes,
					valueTypes,
					...(decodes[0] == null ? {} : { decode: decodes[0] }),
				}
			}),
		]
		const ancestorSelectorsAtNode = ancestorSelectors.map((ancestor) => ({
			...ancestor,
			descendantSvelteKitPath: routeId([
				ancestor.descendantSvelteKitPath,
				svelteKitRoutePath(segment, routeParams),
			].filter(Boolean).join('/')),
		}))
		const compiledSelectorMappings = selectorMappings.map(({ entityType, selectorName, mapping }) => {
			const entity = entityByType.get(entityType)
			const selector = entity?.selectors.find((candidate) => candidate.name === selectorName)
			if (entity == null || selector == null)
				throw new Error(`${routeId(routePath)} references missing selector ${entityType}.${selectorName}`)

			const paramBindings = Object.entries(mapping.params ?? {}).map(([param, fieldPath]) => ({
				param,
				fieldPath,
				...resolveRouteParamFieldPath(entityByType, entity, fieldPath),
			}))
			const routeParamValueTypes = new Map(paramBindings.map(({ param, terminalField }) => [
				param,
				[terminalField.valueType],
			]))
			for (const param of unique(Object.values(mapping.derivations ?? {}).flatMap(routeParamNamesFromExpression))) {
				if (routeParamValueTypes.has(param))
					throw new Error(`${routeId(routePath)} ${entityType}.${selectorName} binds route parameter ${param} more than once`)
				if ((mapping.href?.params ?? []).some((hrefParam) => hrefParam.param === param))
					continue
				const valueTypes = routeParams.toReversed().find((routeParam) => routeParam.name === param)?.valueTypes ?? []
				if (valueTypes.length === 0)
					throw new Error(`${routeId(routePath)} ${entityType}.${selectorName} derived parameter ${param} has no schema route parameter type`)

				routeParamValueTypes.set(param, valueTypes)
			}
			const derivationHrefParams = Object.entries(mapping.derivations ?? {}).flatMap(([fieldName, expression]) => (
				routeParamHrefValuesFromExpression(
					expression,
					{
						kind: 'field',
						name: fieldName,
					},
					entityByType,
					new Map(routeParams.map((routeParam) => [
						routeParam.name,
						routeParam.valueTypes,
					]))
				)
			))
			for (const { param } of mapping.href?.params ?? []) {
				if (routeParamValueTypes.has(param) && !derivationHrefParams.some(([derivationParam]) => derivationParam === param))
					throw new Error(`${routeId(routePath)} ${entityType}.${selectorName} binds route parameter ${param} more than once`)
				if (routeParamValueTypes.has(param))
					continue
				const explicitValueTypes = routeParams.toReversed().find((routeParam) => routeParam.name === param)?.explicitValueTypes ?? []
				if (explicitValueTypes.length === 0)
					throw new Error(`${routeId(routePath)} ${entityType}.${selectorName} href parameter ${param} has no explicit schema route parameter type`)

				routeParamValueTypes.set(param, explicitValueTypes)
			}
			const encodeRouteParamField = (field: EntityField, value: _Expression): _Expression => {
				const encode = valueTypeById.get(field.valueType)?.routeParam?.encode
				return encode == null ? value : {
					kind: 'call',
					from: encode.from,
					name: encode.name,
					args: [value],
				}
			}
			const ownHrefParams = {
				...Object.fromEntries(paramBindings.map(({ param, fieldPath, terminalField }) => {
					const fieldName = fieldPath[0]
					if (fieldName == null)
						throw new Error(`${routeId(routePath)} ${entityType}.${selectorName} parameter ${param} has an empty field path`)

					return [
						param,
						encodeRouteParamField(terminalField, fieldPath.slice(1).reduce<_Expression>((value, property) => ({
						kind: 'property',
						value,
						property,
					}), {
						kind: 'field',
						name: fieldName,
					})),
					]
				})),
				...Object.fromEntries(derivationHrefParams),
				...Object.fromEntries((mapping.href?.params ?? []).map(({ param, value }) => [
					param,
					value,
				])),
			}
			const decodedParamValue = (param: string, field: EntityField): _Expression => {
				const routeParam = valueTypeById.get(field.valueType)?.routeParam
				if (routeParam == null)
					throw new Error(`${routeId(routePath)} ${entityType}.${selectorName} parameter ${param} has no schema route parameter field`)

				return typeof routeParam.decode === 'object' ? {
					kind: 'call',
					from: routeParam.decode.from,
					name: routeParam.decode.name,
					args: [{
						kind: 'param',
						name: param,
					}],
				} : {
					kind: 'param',
					name: param,
					...(routeParam.decode == null ? {} : { decode: routeParam.decode }),
				}
			}
			const ancestorBindingValue = (field: EntityField) => {
				if (field.entityType == null)
					return undefined

				const applicableAncestors = ancestorSelectorsAtNode.flatMap((ancestor) => {
					const targetReferencePaths = entitySelectorReferencePaths(
						entityByType,
						ancestor.entityType,
						ancestor.selectorName,
						field.entityType
					)
					if (targetReferencePaths.length === 0)
						return []

					return entitySelectorReferencePaths(
						entityByType,
						entityType,
						selectorName,
						ancestor.entityType
					).filter((referencePath) => (
						referencePath[0] == null
						|| (
							!Object.hasOwn(mapping.derivations ?? {}, referencePath[0])
							&& !paramBindings.some(({ fieldPath }) => referencePath.every((fieldName, index) => fieldPath[index] === fieldName))
						)
					)).flatMap((referencePath) => targetReferencePaths.map((targetReferencePath) => ({
						ancestor,
						referencePath,
						targetReferencePath,
					})))
				})
				const nearestDepth = Math.max(...applicableAncestors.map(({ ancestor }) => ancestor.depth))
				const nearestAncestors = applicableAncestors.filter(({ ancestor }) => ancestor.depth === nearestDepth)
				const targetReferencePaths = unique(nearestAncestors.map(({ targetReferencePath }) => targetReferencePath.join('\0')))
				if (targetReferencePaths.length > 1)
					throw new Error(`${routeId(routePath)} ${entityType}.${selectorName} inherits ${field.name} through ambiguous ancestor paths ${targetReferencePaths.map((referencePath) => referencePath.split('\0').filter(Boolean).join('.')).join(', ')}`)

				const targetReferencePath = targetReferencePaths[0]?.split('\0').filter(Boolean)
				if (targetReferencePath == null)
					return undefined

				return {
					binding: {
						field: field.name,
						alternatives: [...new Map(nearestAncestors.map(({ ancestor, referencePath }) => [
							JSON.stringify([
								ancestor.ancestorNodeId,
								ancestor.entityType,
								ancestor.selectorName,
								referencePath,
							]),
							{
								ancestorNodeId: ancestor.ancestorNodeId,
								entityType: ancestor.entityType,
								selectorName: ancestor.selectorName,
								referencePath,
							},
						])).values()],
					} satisfies SelectorAncestorBinding,
					value: targetReferencePath.reduce<_Expression>((value, property) => ({
						kind: 'property',
						value,
						property,
					}), {
						kind: 'pageSelector',
					}),
				}
			}
			const ancestorBindingByField = new Map<string, SelectorAncestorBinding>()
			const ancestorValue = (field: EntityField, bindingField: string) => {
				if (field.entityType == null)
					return undefined

				const bindingValue = ancestorBindingValue(field)
				if (bindingValue != null) {
					ancestorBindingByField.set(bindingField, {
						...bindingValue.binding,
						field: bindingField,
					})

					return bindingValue.value
				}

				const currentSelectorReferences = selector.fields.flatMap((selectorFieldName) => {
					const selectorField = entity.fields.find((candidate) => candidate.name === selectorFieldName)
					const derivation = mapping.derivations?.[selectorFieldName]
					return selectorField?.entityType === field.entityType && derivation != null ? [derivation] : []
				})
				if (currentSelectorReferences.length > 1)
					throw new Error(`${routeId(routePath)} ${entityType}.${selectorName} has ambiguous current-selector references to ${field.entityType}`)

				return currentSelectorReferences[0]
			}
			const fieldValue = (
				selectorEntity: Entity,
				field: EntityField,
				bindings: readonly {
					param: string
					fieldPath: readonly string[]
					terminalField: EntityField
				}[],
				selectorFieldPath: readonly string[]
			): _Expression => {
				if (field.type === EntityFieldType.Primitive) {
					if (bindings.length !== 1 || bindings[0]?.fieldPath.length !== 1)
						throw new Error(`${routeId(routePath)} ${entityType}.${selectorName} binds primitive selector field ${selectorEntity.entityType}.${field.name} more than once`)

					return decodedParamValue(bindings[0].param, field)
				}
				if (field.type !== EntityFieldType.EntityReference || field.entityType == null)
					throw new Error(`${routeId(routePath)} ${entityType}.${selectorName} route parameter path traverses non-reference selector field ${selectorEntity.entityType}.${field.name}`)

				const referencedEntity = entityByType.get(field.entityType)
				if (referencedEntity == null)
					throw new Error(`${routeId(routePath)} ${selectorEntity.entityType}.${field.name} references missing entity ${field.entityType}`)
				const nestedBindings = bindings.map((binding) => ({
					...binding,
					fieldPath: binding.fieldPath.slice(1),
				}))
				const nestedSelectors = referencedEntity.selectors.filter((candidate) => (
					nestedBindings.every(({ fieldPath }) => fieldPath[0] != null && candidate.fields.includes(fieldPath[0]))
					&& candidate.fields.every((nestedFieldName) => {
						if (nestedBindings.some(({ fieldPath }) => fieldPath[0] === nestedFieldName))
							return true
						const nestedField = referencedEntity.fields.find((referencedField) => referencedField.name === nestedFieldName)
						return nestedField != null && ancestorValue(nestedField, [...selectorFieldPath, nestedFieldName].join('.')) != null
					})
				))
				if (nestedSelectors.length !== 1)
					throw new Error(`${routeId(routePath)} ${entityType}.${selectorName} route parameter path ${field.name}.${nestedBindings[0]?.fieldPath.join('.')} resolves ${nestedSelectors.length} nested ${referencedEntity.entityType} selectors`)
				const nestedSelector = nestedSelectors[0]
				if (nestedSelector == null)
					throw new Error(`${routeId(routePath)} ${entityType}.${selectorName} route parameter path does not resolve a nested selector`)

				return selectorValue(referencedEntity, nestedSelector, nestedBindings, selectorFieldPath)
			}
			const selectorValue = (
				selectorEntity: Entity,
				selectorDefinition: EntitySelector,
				bindings: readonly {
					param: string
					fieldPath: readonly string[]
					terminalField: EntityField
				}[],
				selectorFieldPath: readonly string[]
			): _Expression => ({
				kind: 'object',
				fields: selectorDefinition.fields.map((fieldName) => {
					const field = selectorEntity.fields.find((candidate) => candidate.name === fieldName)
					if (field == null)
						throw new Error(`${routeId(routePath)} ${selectorEntity.entityType}.${selectorDefinition.name} references missing field ${fieldName}`)
					const fieldBindings = bindings.filter(({ fieldPath }) => fieldPath[0] === fieldName)
					if (fieldBindings.length === 0) {
						const value = ancestorValue(field, [...selectorFieldPath, fieldName].join('.'))
						if (value == null)
							throw new Error(`${routeId(routePath)} ${entityType}.${selectorName} does not bind selector field ${selectorEntity.entityType}.${fieldName}`)

						return {
							name: fieldName,
							value,
						}
					}

					return {
						name: fieldName,
						value: fieldValue(selectorEntity, field, fieldBindings, [
							...selectorFieldPath,
							fieldName,
						]),
					}
				}),
			})
			const fields = selector.fields.map((fieldName) => {
				const derivation = mapping.derivations?.[fieldName]
				const bindings = paramBindings.filter(({ fieldPath }) => fieldPath[0] === fieldName)
				if (derivation != null && bindings.length > 0)
					throw new Error(`${routeId(routePath)} ${entityType}.${selectorName} binds selector field ${fieldName} more than once`)
				if (derivation != null)
					return {
						field: fieldName,
						value: derivation,
					}

				const field = entity.fields.find((candidate) => candidate.name === fieldName)
				if (field == null)
					throw new Error(`${routeId(routePath)} ${entityType}.${selectorName} references missing field ${fieldName}`)
				if (bindings.length === 0) {
					const value = ancestorValue(field, fieldName)
					if (value == null)
						throw new Error(`${routeId(routePath)} ${entityType}.${selectorName} does not bind selector field ${fieldName}`)

					return {
						field: fieldName,
						value,
					}
				}

				return {
					field: fieldName,
					value: fieldValue(entity, field, bindings, [fieldName]),
				}
			})
			return {
				mapping,
				ancestorBindings: [...ancestorBindingByField.values()],
				fields,
				routeParamMatchers: [...routeParamValueTypes].map(([param, valueTypes]) => ({
					param,
					valueTypes,
					matchers: unique(valueTypes.map((valueType) => {
						const matcher = valueTypeById.get(valueType)?.routeParam?.matcher
						if (matcher == null)
							throw new Error(`${routeId(routePath)} ${entityType}.${selectorName} parameter ${param} value type ${valueType} has no route matcher`)

						return matcher
					})),
				})),
				title: mapping.title,
				href: mapping.href == null ? undefined : {
					entityHref: mapping.href.entityHref,
					conditions: mapping.href.conditions,
					params: mapping.href.params ?? [],
				},
				ownHrefParams,
				selector: {
					entityType,
					selectorName,
					params: fields.map(({ field, value }) => (
						typeof value !== 'string' && !('raw' in value) && value.kind === 'param' ?
							{
								field,
								param: value.name,
							}
							:
							{
								field,
								value,
							}
					)),
				},
			}
		})
		const collectionMappings = (node.collections ?? []).map((collection) => {
			const sourceEntity = entityByType.get(collection.field[0])
			if (sourceEntity == null)
				throw new Error(`${routeId(routePath)} collection references missing source entity ${collection.field[0]}`)

			const fieldName = fieldNameForReference(collection.field[1])
			const field = entityFields(sourceEntity).find((candidate) => candidate.name === fieldName)
			if (field?.entityType == null)
				throw new Error(`${routeId(routePath)} collection references non-entity field ${sourceEntity.entityType}.${fieldName}`)

			return {
				entity: field.entityType,
				source: {
					entity: sourceEntity.entityType,
					selector: Object.keys(collection.derivations ?? {}).length > 0 ? {
						kind: 'object' as const,
						fields: Object.entries(collection.derivations ?? {}).map(([name, value]) => ({
							name,
							value,
						})),
					} : {
						kind: 'pageSelector' as const,
					},
					field: collection.field[1],
				},
				query: collection.query,
				page: collection.page,
			}
		})
		const ownDetailMappings = compiledSelectorMappings.flatMap(({ mapping, selector }) => (
			selector.params.length > 0
			&& (
				mapping.page != null
				|| selector.entityType === node.page?.view?.entity
			) ?
				[{
					entityType: selector.entityType,
					selectorName: selector.selectorName,
					component: mapping.page?.view?.component ?? node.page?.view?.component ?? singularComponentName(selector.entityType),
				}]
			:
				[]
		))
		const ownDetailGroup = (
			ownDetailMappings.length === 0 ?
				undefined
			: unique(ownDetailMappings.map(({ entityType }) => entityType)).length === 1 ?
				camel(ownDetailMappings[0]?.entityType ?? '')
			:
				'selection'
		)
		const regularSvelteKitPath = routeId([
			parentSvelteKitPath,
			svelteKitRoutePath(segment, routeParams),
		].filter(Boolean).join('/'))
		const normalizedSelectorMappings = compiledSelectorMappings.map(({
			ancestorBindings,
			fields,
			href,
			ownHrefParams,
			routeParamMatchers,
			selector: {
				entityType,
				selectorName,
			},
			mapping,
			title,
		}): SelectorRouteMapping => {
			const normalizedEntity = entityByType.get(entityType)
			const normalizedSelector = normalizedEntity?.selectors.find((selector) => selector.name === selectorName)
			if (normalizedEntity == null || normalizedSelector == null)
				throw new Error(`${routeId(routePath)} references missing normalized selector ${entityType}.${selectorName}`)
			const hrefParamAlternatives = composeSelectorHrefAlternatives(
				`${routeId(routePath)} ${entityType}.${selectorName}`,
				ownHrefParams,
				ancestorBindings.map((binding) => ({
					field: binding.field,
					alternatives: binding.alternatives.flatMap((alternative) => {
						const ancestor = ancestorSelectorsAtNode.find((candidate) => (
							candidate.ancestorNodeId === alternative.ancestorNodeId
							&& candidate.entityType === alternative.entityType
							&& candidate.selectorName === alternative.selectorName
						))
						return ancestor == null ? [] : ancestor.hrefAlternatives.map((ancestorHrefParams) => Object.fromEntries(
							Object.entries(ancestorHrefParams).map(([param, value]) => [
								param,
								alternative.referencePath.reduceRight<_Expression>((expression, referenceField) => (
									routeExpressionThroughReference(expression, referenceField)
								), value),
							])
						))
						}),
					}))
			)

			const projectionSelector = mapping.projection == null ?
				undefined
			: mapping.projection.entityType === entityType ?
				{
					kind: 'object' as const,
					fields: fields.map(({ field, value }) => ({
						name: field,
						value,
					})),
				}
			:
				routePageSelectorExpression(entityByType, ancestorSelectorsAtNode, mapping.projection.entityType)
			if (mapping.projection != null && projectionSelector == null)
				throw new Error(`${routeId(routePath)} ${entityType}.${selectorName} cannot derive projection subject ${mapping.projection.entityType}`)

			const projectionRouteParams = mapping.projection == null ? [] : unique(ancestorSelectorsAtNode
				.filter((ancestor) => ancestor.entityType === mapping.projection?.entityType)
				.flatMap((ancestor) => ancestor.hrefAlternatives.flatMap((hrefParams) => Object.keys(hrefParams)))
				.filter((param) => routeParams.some(({ name }) => name === param)))
			if (projectionRouteParams.length > 1)
				throw new Error(`${routeId(routePath)} ${entityType}.${selectorName} projection subject ${mapping.projection?.entityType} has ambiguous route parameters ${projectionRouteParams.join(', ')}`)
			const sourceSelection = singularViewQuery(entitySingularView(normalizedEntity))?.sources

			return {
				entityType,
				selectorName,
				...(sourceSelection == null ? {} : {
					sourceSelection,
				}),
				paramBindings: mapping.params ?? {},
				routeParamMatchers,
				ancestorBindings,
				probeCases: mapping.probeCases,
				...(mapping.boundaryLiveOptional == null ? {} : { boundaryLiveOptional: mapping.boundaryLiveOptional }),
				...(href == null ? {} : { href }),
				hrefAlternatives: hrefParamAlternatives.map((hrefParams) => Object.entries(hrefParams).map(([param, value]) => ({
					param,
					value,
				}))),
				fields,
				title,
				...(mapping.when == null ? {} : { when: mapping.when }),
				...(mapping.projection == null || projectionSelector == null ? {} : {
					projection: mapping.projection,
					projectionSubject: {
						entityType: mapping.projection.entityType,
						selector: projectionSelector,
						...(projectionRouteParams[0] == null ? {} : { routeParam: projectionRouteParams[0] }),
					},
				}),
				...(mapping.page == null ? {} : { page: mapping.page }),
			}
		})
		const selectorVariant = node.selectorVariant == null ? undefined : (() => {
			const overriddenFieldNames = unique([
				...Object.values(node.selectorVariant.params ?? {}).flatMap((fieldPath) => fieldPath[0] == null ? [] : [fieldPath[0]]),
				...Object.keys(node.selectorVariant.derivations ?? {}),
			])
			if (overriddenFieldNames.length === 0)
				throw new Error(`${routeId(routePath)} selector variant does not override any selector fields`)

			const compatibleAncestors = ancestorSelectorsAtNode.filter((ancestor) => {
				const entity = entityByType.get(ancestor.entityType)
				const selector = entity?.selectors.find((candidate) => candidate.name === ancestor.selectorName)

				return selector != null && overriddenFieldNames.every((fieldName) => selector.fields.includes(fieldName))
			})
			const nearestDepth = Math.max(...compatibleAncestors.map(({ depth }) => depth))
			const owners = compatibleAncestors.filter(({ depth }) => depth === nearestDepth)
			if (owners.length !== 1)
				throw new Error(`${routeId(routePath)} selector variant resolves ${owners.length} nearest ancestor selector owners`)

			const owner = owners[0]
			if (owner == null)
				throw new Error(`${routeId(routePath)} selector variant has no ancestor selector owner`)
			const entity = entityByType.get(owner.entityType)
			const selector = entity?.selectors.find((candidate) => candidate.name === owner.selectorName)
			if (entity == null || selector == null)
				throw new Error(`${routeId(routePath)} selector variant owner ${owner.entityType}.${owner.selectorName} is missing`)

			const paramBindings = Object.entries(node.selectorVariant.params ?? {}).map(([param, fieldPath]) => {
				if (!routeParams.some((routeParam) => routeParam.name === param))
					throw new Error(`${routeId(routePath)} ${owner.entityType}.${owner.selectorName} selector variant binds missing route parameter ${param}`)
				const resolved = resolveRouteParamFieldPath(entityByType, entity, fieldPath)
				if (fieldPath.length !== 1 || !selector.fields.includes(fieldPath[0] ?? ''))
					throw new Error(`${routeId(routePath)} ${owner.entityType}.${owner.selectorName} selector variant parameter ${param} must bind one owned selector field`)

				return {
					param,
					fieldPath,
					...resolved,
				}
			})
			for (const fieldName of Object.keys(node.selectorVariant.derivations ?? {}))
				if (!selector.fields.includes(fieldName))
					throw new Error(`${routeId(routePath)} ${owner.entityType}.${owner.selectorName} selector variant derives unowned field ${fieldName}`)
			for (const fieldName of overriddenFieldNames)
				if (
					Object.hasOwn(node.selectorVariant.derivations ?? {}, fieldName)
					&& paramBindings.some(({ fieldPath }) => fieldPath[0] === fieldName)
				)
					throw new Error(`${routeId(routePath)} ${owner.entityType}.${owner.selectorName} selector variant binds field ${fieldName} more than once`)

			const variantFields = owner.mapping.fields.map(({ field, value }) => {
				const derivation = node.selectorVariant?.derivations?.[field]
				if (derivation != null)
					return {
						field,
						value: derivation,
					}
				const binding = paramBindings.find(({ fieldPath }) => fieldPath[0] === field)
				if (binding == null)
					return {
						field,
						value,
					}
				const decode = valueTypeById.get(binding.terminalField.valueType)?.routeParam?.decode

				return {
					field,
					value: typeof decode === 'object' ? {
						kind: 'call' as const,
						from: decode.from,
						name: decode.name,
						args: [{
							kind: 'param' as const,
							name: binding.param,
						}],
					} : {
						kind: 'param' as const,
						name: binding.param,
						...(decode == null ? {} : { decode }),
					},
				}
			})
			const variantHrefParams = {
				...Object.fromEntries(paramBindings.map(({ param, terminalField, fieldPath }) => {
					const encode = valueTypeById.get(terminalField.valueType)?.routeParam?.encode
					const value = {
						kind: 'field' as const,
						name: fieldPath[0] ?? '',
					}

					return [param, encode == null ? value : {
						kind: 'call' as const,
						from: encode.from,
						name: encode.name,
						args: [value],
					}]
				})),
				...Object.fromEntries(Object.entries(node.selectorVariant.derivations ?? {}).flatMap(([fieldName, expression]) => (
					routeParamHrefValuesFromExpression(
						expression,
						{
							kind: 'field',
							name: fieldName,
						},
						entityByType,
						new Map(routeParams.map((routeParam) => [routeParam.name, routeParam.valueTypes]))
					)
				))),
				...Object.fromEntries((node.selectorVariant.href?.params ?? []).map(({ param, value }) => [param, value])),
			}
			const hrefAlternatives = owner.mapping.hrefAlternatives.map((alternative) => ({
				...Object.fromEntries(alternative.map(({ param, value }) => [param, value])),
				...variantHrefParams,
			}))

			return {
				ownerNodeId: owner.ancestorNodeId,
				svelteKitPath: owner.descendantSvelteKitPath,
				mapping: {
					...owner.mapping,
					paramBindings: {
						...owner.mapping.paramBindings,
						...(node.selectorVariant.params ?? {}),
					},
					routeParamMatchers: [...new Map([
						...owner.mapping.routeParamMatchers,
						...paramBindings.map(({ param, terminalField }) => ({
							param,
							valueTypes: [terminalField.valueType],
							matchers: routeParams.find((routeParam) => routeParam.name === param)?.matchers ?? [],
						})),
					].map((routeParamMatcher) => [routeParamMatcher.param, routeParamMatcher])).values()],
					probeCases: node.selectorVariant.probeCases,
					...(node.selectorVariant.boundaryLiveOptional == null ? {} : { boundaryLiveOptional: node.selectorVariant.boundaryLiveOptional }),
					href: {
						...owner.mapping.href,
						...node.selectorVariant.href,
						params: node.selectorVariant.href?.params ?? [],
					},
					hrefAlternatives: hrefAlternatives.map((alternative) => Object.entries(alternative).map(([param, value]) => ({
						param,
						value,
					}))),
					fields: variantFields,
					page: node.selectorVariant.page ?? {},
				},
			}
		})()
		const svelteKitPath = selectorVariant?.svelteKitPath ?? regularSvelteKitPath
		const descendantSelectors = [
			...ancestorSelectorsAtNode,
			...normalizedSelectorMappings.map((normalizedMapping) => ({
				ancestorNodeId: routeId(routePath),
				descendantSvelteKitPath: regularSvelteKitPath,
				entityType: normalizedMapping.entityType,
				selectorName: normalizedMapping.selectorName,
				params: compiledSelectorMappings.find(({ selector }) => (
					selector.entityType === normalizedMapping.entityType
					&& selector.selectorName === normalizedMapping.selectorName
				))?.selector.params ?? [],
				hrefAlternatives: normalizedMapping.hrefAlternatives.map((alternative) => Object.fromEntries(alternative.map(({ param, value }) => [
					param,
					value,
				]))),
				mapping: normalizedMapping,
				depth: routePath.split('/').length,
			})),
		]
		const children = compileRouteTree(
			node.children ?? {},
			entities,
			valueTypeById,
			routeParamValueTypesByOwner,
			routePath,
			descendantSelectors,
			routeParams,
			ownDetailGroup == null ? svelteKitPath : `${svelteKitPath}/(${ownDetailGroup})`
		)

		return {
			node: {
				internalPath: routeId(routePath),
				svelteKitPath,
				publicPath: publicRouteId(routePath),
				params: routeParams,
				collectionMappings: collectionMappings.map((collection) => ({
					entityType: collection.source.entity,
					field: collection.source.field,
					targetEntityType: collection.entity,
					selector: collection.source.selector,
					query: collection.query,
					page: collection.page,
				})),
				selectorMappings: normalizedSelectorMappings,
				...(selectorVariant == null ? {} : {
					selectorVariant: {
						ownerNodeId: selectorVariant.ownerNodeId,
						mapping: selectorVariant.mapping,
					},
				}),
				...(ownDetailGroup == null ? {} : {
					detail: {
						group: ownDetailGroup,
						mappings: ownDetailMappings,
					},
				}),
				...(node.page == null ? {} : { page: node.page }),
				...(node.layout == null ? {} : { layout: node.layout }),
				children: children.nodes,
			},
		}
	})

	return {
		nodes: compiledNodes.map(({ node }) => node),
	}
}

const viewConditionFromFacetCondition = (
	condition: _AppFacetCondition
): EntityHref['conditions'] => {
	if ('all' in condition)
		return condition.all.flatMap(viewConditionFromFacetCondition)
	const field = facetConditionField(condition)
	if ('is' in condition)
		return [
			{
				field,
				equals: condition.is,
			},
		]
	if ('includes' in condition)
		return [
			{
				field,
				contains: condition.includes,
			},
		]
	if ('isOneOf' in condition)
		return [
			{
				field,
				oneOf: condition.isOneOf,
			},
		]

	throw new Error(`Facet condition cannot be represented as a simple view condition: ${JSON.stringify(condition)}`)
}

const selectorMappingOwnsDetailPage = (
	node: RouteNode,
	mapping: SelectorRouteMapping
) => node.selectorVariant?.mapping === mapping || node.detail?.mappings.some((detail) => (
	detail.entityType === mapping.entityType
	&& detail.selectorName === mapping.selectorName
)) === true

const routeHrefsFromMapping = (
	node: RouteNode,
	mapping: SelectorRouteMapping,
	entityFacetByPath: Readonly<Record<string, EntityFacetEntry>>,
	facetDependencyConditionsByPath: Readonly<Record<string, NonNullable<EntityHref['conditions']>>>
): EntityHref[] => {
	return !selectorMappingOwnsDetailPage(node, mapping) || mapping.href?.entityHref === false ? [] : mapping.hrefAlternatives.map((params) => ({
		href: node.svelteKitPath,
		selector: mapping.selectorName,
		conditions: [
			...mapping.fields.flatMap(({ field, value }) => (
				typeof value !== 'string' && !('raw' in value) && value.kind === 'literal' ?
					[{
						field,
						equals: value.value,
					}]
				:
					[]
			)),
			...(mapping.projection == null ? [] : [mapping.projection]).flatMap((projection) => {
				const facetEntry = entityFacetByPath[projectionPathKey(projection.entityType, projection.facetPath)]
				if (mapping.entityType !== facetEntry?.entityType)
					return []

				return facetDependencyConditionsByPath[projectionPathKey(projection.entityType, projection.facetPath)] ?? []
			}),
			...(mapping.href?.conditions ?? []),
		],
		params: [...params],
	}))
}

const routeParamValueFromSelectorParam = (
	param: Extract<_Expression, { kind: 'selector' }>['params'][number]
): _Expression => (
	'value' in param ?
		param.value
	:
		{
			kind: 'field',
			name: param.field,
		}
)

const routeHrefFromCollection = (
	node: RouteNode,
	collection: RouteNode['collectionMappings'][number]
): CollectionRouteHref | undefined => {
	const href = node.svelteKitPath
	const selector = collection.selector
	if (selector.kind !== 'selector')
		return routeParamNames(href).length === 0 ?
			{
				href,
				params: [],
			}
		:
			undefined

	const params: CollectionRouteHref['params'] = []
	for (const param of routeParamNames(href)) {
		const selectorParam = selector.params.find((item) => item.param === param)
		if (selectorParam == null)
			return undefined

		params.push({
			param,
			value: 'hrefValue' in selectorParam && selectorParam.hrefValue != null ? selectorParam.hrefValue : routeParamValueFromSelectorParam(selectorParam),
			decode: selectorParam.decode,
		})
	}

	return {
		href,
		params,
	}
}

const collectionSourceFieldKey = (sourceEntity: string, sourceField: string, collectionEntity: string) => `${sourceEntity}:${sourceField}:${collectionEntity}`

const svelteKitRoutePath = (
	internalPath: string,
	params: readonly RouteParam[]
) => internalPath.replaceAll(
	/\[(\.\.\.)?([^\]]+)\]/g,
	(_segment, rest: string | undefined, param: string) => `[${rest ?? ''}${param}=${params.find((candidate) => candidate.name === param)?.matcher}]`
)

const publicRouteShape = (publicPath: string) => publicPath
	.split('/')
	.map((segment) => segment.startsWith('[') ? '[]' : segment)
	.join('/')

const selectorRouteMappingKey = (entityType: string, selectorName: string) => `${entityType}.${selectorName}`

type RouteApplicability = {
	allowedScalarsByPath: ReadonlyMap<string, ReadonlySet<string>>
	encodedDomainsByPath: ReadonlyMap<string, readonly EncodedRouteParamDomain[]>
}

type EncodedRouteParamDomain = {
	values?: ReadonlySet<string>
	minimumLength?: number
	maximumLength?: number
	characters?: ReadonlySet<string>
	charactersByIndex?: ReadonlyMap<number, ReadonlySet<string>>
	requiredCharacters?: ReadonlySet<string>
}

const scalarDomainKey = (value: string | number | boolean | null) => JSON.stringify(value)

const asciiCharacters = (characters: string) => new Set(characters)

const encodedRouteParamDomain = (
	valueType: App['schema']['valueTypes'][number],
	enumMembersByName: ReadonlyMap<string, readonly (string | number | boolean | null)[]>
): EncodedRouteParamDomain | undefined => {
	if ('unit' in valueType.type && valueType.routeParam?.encode == null)
		return { values: new Set([String(valueType.type.unit)]) }
	if ('enum' in valueType.type && valueType.routeParam?.encode == null) {
		const members = enumMembersByName.get(valueType.type.enum)
		return members == null ? undefined : { values: new Set(members.map(String)) }
	}
	if (
		'object' in valueType.type
		&& valueType.routeParam?.matcher === 'networkCaip2'
		&& valueType.routeParam?.encode?.name === 'caip2StringFromValue'
		&& valueType.type.object.length === 2
		&& valueType.type.object.every((field) => 'enum' in field.type)
	)
		return { requiredCharacters: asciiCharacters(':') }
	if (
		'primitive' in valueType.type
		&& valueType.type.primitive === 'string'
		&& valueType.type.characters != null
	)
		return {
			...(valueType.type.minimumLength == null ? {} : { minimumLength: valueType.type.minimumLength }),
			...(valueType.type.maximumLength == null ? {} : { maximumLength: valueType.type.maximumLength }),
			characters: asciiCharacters(valueType.type.characters),
		}
	if (
		'raw' in valueType.type
		&& valueType.type.raw === "type('number.integer >= 0')"
		&& valueType.routeParam?.decode === _ExpressionDecode.Number
		&& valueType.routeParam.matcher === 'nonNegativeInteger'
	)
		return {
			minimumLength: 1,
			maximumLength: 16,
			characters: asciiCharacters('0123456789'),
		}
	if (
		'raw' in valueType.type
		&& valueType.type.raw === 'EvmAddress'
		&& valueType.routeParam?.matcher === 'evmAddress'
	)
		return {
			minimumLength: 42,
			maximumLength: 42,
			characters: asciiCharacters('0123456789abcdefABCDEFx'),
			charactersByIndex: new Map([
				[0, asciiCharacters('0')],
				[1, asciiCharacters('x')],
			]),
		}

	switch (valueType.routeParam?.matcher) {
		case 'evmTxHash':
			return {
				minimumLength: 66,
				maximumLength: 66,
				characters: asciiCharacters('0123456789abcdefABCDEFx'),
				charactersByIndex: new Map([
					[0, asciiCharacters('0')],
					[1, asciiCharacters('x')],
				]),
			}
		case 'polkadotAccountId':
			return {
				minimumLength: 47,
				maximumLength: 48,
				characters: asciiCharacters('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'),
			}
		case 'solanaPubkey':
			return {
				minimumLength: 32,
				maximumLength: 44,
				characters: asciiCharacters('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'),
			}
		case 'solanaSignature':
			return {
				minimumLength: 32,
				characters: asciiCharacters('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'),
			}
		case 'utxoTxId':
			return {
				minimumLength: 64,
				maximumLength: 64,
				characters: asciiCharacters('0123456789abcdefABCDEF'),
			}
	}

	return undefined
}

const encodedRouteParamDomainContains = (
	domain: EncodedRouteParamDomain,
	value: string
) => (
	(domain.values == null || domain.values.has(value))
	&& (domain.minimumLength == null || value.length >= domain.minimumLength)
	&& (domain.maximumLength == null || value.length <= domain.maximumLength)
	&& (domain.characters == null || [...value].every((character) => domain.characters?.has(character)))
	&& (domain.charactersByIndex == null || [...domain.charactersByIndex].every(([index, characters]) => characters.has(value[index] ?? '')))
	&& (domain.requiredCharacters == null || [...domain.requiredCharacters].every((character) => value.includes(character)))
)

const encodedRouteParamDomainsAreDisjoint = (
	left: EncodedRouteParamDomain,
	right: EncodedRouteParamDomain
) => {
	if (left.values != null)
		return [...left.values].every((value) => !encodedRouteParamDomainContains(right, value))
	if (right.values != null)
		return [...right.values].every((value) => !encodedRouteParamDomainContains(left, value))
	if (
		(left.maximumLength != null && right.minimumLength != null && left.maximumLength < right.minimumLength)
		|| (right.maximumLength != null && left.minimumLength != null && right.maximumLength < left.minimumLength)
	)
		return true
	if (left.characters != null && right.requiredCharacters != null && [...right.requiredCharacters].some((character) => !left.characters?.has(character)))
		return true
	if (right.characters != null && left.requiredCharacters != null && [...left.requiredCharacters].some((character) => !right.characters?.has(character)))
		return true

	return [...left.charactersByIndex ?? []].some(([index, leftCharacters]) => {
		const rightCharacters = right.charactersByIndex?.get(index) ?? right.characters
		return rightCharacters != null && [...leftCharacters].every((character) => !rightCharacters.has(character))
	}) || [...right.charactersByIndex ?? []].some(([index, rightCharacters]) => {
		const leftCharacters = left.charactersByIndex?.get(index) ?? left.characters
		return leftCharacters != null && [...rightCharacters].every((character) => !leftCharacters.has(character))
	})
}

const routeValueTypeScalarDomain = (
	valueType: App['schema']['valueTypes'][number],
	enumMembersByName: ReadonlyMap<string, readonly (string | number | boolean | null)[]>
): readonly string[] | undefined => {
	if ('unit' in valueType.type)
		return [scalarDomainKey(valueType.type.unit)]
	if ('enum' in valueType.type) {
		const members = enumMembersByName.get(valueType.type.enum)
		return members == null ? undefined : members.map(scalarDomainKey)
	}
	if ('primitive' in valueType.type && valueType.type.primitive === 'boolean')
		return [scalarDomainKey(false), scalarDomainKey(true)]

	return undefined
}

const canonicalFacetScalarConditions = (
	entityType: string,
	conditions: readonly _AppFacetCondition[]
) => {
	const allowedScalarsByPath = new Map<string, Set<string>>()
	const visit = (condition: _AppFacetCondition): void => {
		if ('all' in condition) {
			for (const child of condition.all)
				visit(child)

			return
		}
		if ('includes' in condition)
			return

		const path = `facet:${entityType}:${JSON.stringify(condition.path)}`
		const allowedScalars = new Set(('isOneOf' in condition ? condition.isOneOf : [condition.is]).map(scalarDomainKey))
		const inheritedAllowedScalars = allowedScalarsByPath.get(path)
		allowedScalarsByPath.set(
			path,
			inheritedAllowedScalars == null ? allowedScalars : new Set([...inheritedAllowedScalars].filter((value) => allowedScalars.has(value)))
		)
	}
	for (const condition of conditions)
		visit(condition)

	return allowedScalarsByPath
}

const routeApplicability = (
	node: RouteNode,
	mapping: SelectorRouteMapping | undefined,
	valueTypeById: ReadonlyMap<string | undefined, App['schema']['valueTypes'][number]>,
	enumMembersByName: ReadonlyMap<string, readonly (string | number | boolean | null)[]>,
	entityFacetByPath: Readonly<Record<string, EntityFacetEntry>>,
	facetAncestorConditionsByPath: Readonly<Record<string, readonly _AppFacetCondition[]>>
): RouteApplicability => {
	const allowedScalarsByPath = new Map<string, ReadonlySet<string>>()
	const encodedDomainsByPath = new Map<string, readonly EncodedRouteParamDomain[]>()
	for (const [index, param] of routeParamNames(node.publicPath).entries()) {
		const valueTypes = mapping?.routeParamMatchers.find((routeParam) => routeParam.param === param)?.valueTypes
			?? node.params.find((routeParam) => routeParam.name === param)?.valueTypes
			?? []
		const domains = valueTypes.map((valueType) => {
			const definition = valueTypeById.get(valueType)
			return definition == null ? undefined : routeValueTypeScalarDomain(definition, enumMembersByName)
		})
		if (domains.length > 0 && domains.every((domain) => domain != null))
			allowedScalarsByPath.set(`param:${index}`, new Set(domains.flatMap((domain) => domain ?? [])))
		const encodedDomains = valueTypes.map((valueType) => {
			const definition = valueTypeById.get(valueType)
			return definition == null ? undefined : encodedRouteParamDomain(definition, enumMembersByName)
		})
		if (encodedDomains.length > 0 && encodedDomains.every((domain) => domain != null))
			encodedDomainsByPath.set(`param:${index}`, encodedDomains.flatMap((domain) => domain == null ? [] : [domain]))
	}
	if (mapping != null) {
		const facetKey = mapping.projection == null ? undefined : projectionPathKey(mapping.projection.entityType, mapping.projection.facetPath)
		const facetCondition = facetKey == null ? undefined : entityFacetByPath[facetKey]?.facet.condition
		for (const [path, allowedScalars] of canonicalFacetScalarConditions(
			mapping.projection?.entityType ?? mapping.entityType,
			[
				...(facetKey == null ? [] : facetAncestorConditionsByPath[facetKey] ?? []),
				...(facetCondition == null ? [] : [facetCondition]),
				...(mapping.when == null ? [] : [mapping.when]),
			]
		))
			allowedScalarsByPath.set(path, allowedScalars)
	}

	return {
		allowedScalarsByPath,
		encodedDomainsByPath,
	}
}

const routeApplicabilitiesAreDisjoint = (
	left: RouteApplicability,
	right: RouteApplicability
) => (
	[...left.allowedScalarsByPath.values(), ...right.allowedScalarsByPath.values()].some((allowedScalars) => allowedScalars.size === 0)
	|| [...left.allowedScalarsByPath].some(([path, leftAllowedScalars]) => {
		const rightAllowedScalars = right.allowedScalarsByPath.get(path)
		return rightAllowedScalars != null && [...leftAllowedScalars].every((value) => !rightAllowedScalars.has(value))
	})
	|| [...left.encodedDomainsByPath].some(([path, leftDomains]) => {
		const rightDomains = right.encodedDomainsByPath.get(path)
		return rightDomains != null && leftDomains.every((leftDomain) => rightDomains.every((rightDomain) => (
			encodedRouteParamDomainsAreDisjoint(leftDomain, rightDomain)
		)))
	})
)

const routeApplicabilitySetsOverlap = (
	left: readonly RouteApplicability[],
	right: readonly RouteApplicability[]
) => left.some((leftApplicability) => right.some((rightApplicability) => (
	!routeApplicabilitiesAreDisjoint(leftApplicability, rightApplicability)
)))

const flattenRouteNodes = (nodes: readonly RouteNode[]): RouteNode[] => nodes.flatMap((node) => [
	node,
	...flattenRouteNodes(node.children),
])

const indexRouteProbeMappings = (
	nodes: readonly RouteNode[],
	ancestorEntry?: Readonly<{
		ownerNodeId: string
		mappings: readonly SelectorRouteMapping[]
	}>,
	mappingsByNode = new Map<string, Readonly<{
		ownerNodeId: string
		mappings: readonly SelectorRouteMapping[]
	}> | undefined>()
) => {
	for (const node of nodes) {
		const entry = node.selectorVariant != null ? {
			ownerNodeId: node.selectorVariant.ownerNodeId,
			mappings: [node.selectorVariant.mapping],
		} : node.selectorMappings.length === 0 ? ancestorEntry : {
			ownerNodeId: node.internalPath,
			mappings: node.selectorMappings,
		}
		mappingsByNode.set(node.internalPath, entry)
		indexRouteProbeMappings(node.children, entry, mappingsByNode)
	}

	return mappingsByNode
}

const routeFixtureMetadataFromMapping = (mapping: SelectorRouteMapping): RouteFixtureMetadata => ({
	id: `${mapping.entityType}.${mapping.selectorName}`,
	routeKind: mapping.projection == null ? 'detail' : 'projection',
	projectionEntity: mapping.projection?.entityType,
	projectionPath: mapping.projection?.facetPath,
	probeCases: mapping.probeCases,
	boundaryLiveOptional: mapping.boundaryLiveOptional,
})

const lowerEntriesFromRouteNodes = (
	nodes: readonly RouteNode[],
	routeNodeByInternalPath: ReadonlyMap<string, RouteNode>
): RouteRenderEntry[] => nodes.flatMap((node) => {
	const renderMappings = [
		...node.selectorMappings,
		...(node.selectorVariant == null ? [] : [node.selectorVariant.mapping]),
	]
	const mappingPages = [
		...renderMappings.flatMap((mapping) => mapping.page == null ? [] : [mapping.page]),
		...node.collectionMappings.flatMap((mapping) => mapping.page == null ? [] : [mapping.page]),
	]
	const page = node.page ?? (
		mappingPages.length === 1 ? mappingPages[0]
		: mappingPages.length > 1 ? {}
		: undefined
	)
	const ownDetails = node.detail?.mappings.flatMap((detail) => {
		const mapping = node.selectorMappings.find((candidate) => (
			candidate.entityType === detail.entityType
			&& candidate.selectorName === detail.selectorName
		))
		return mapping == null ? [] : [{
			...detail,
			selector: {
				kind: 'object' as const,
				fields: mapping.fields.map(({ field, value }) => ({
					name: field,
					value,
				})),
			},
			href: node.svelteKitPath,
		} satisfies RouteDetail]
	}) ?? []
	const detailLayout = ownDetails.length === 0 ? undefined : (() => {
		const href = ownDetails[0]?.href
		if (href == null || ownDetails.some((detail) => detail.href !== href))
			throw new Error(`${node.internalPath} detail layout requires one shared href`)

		for (const detailIdentity of unique(ownDetails.map((detail) => detail.entityType))) {
			const entityDetails = ownDetails.filter((detail) => detail.entityType === detailIdentity)
			if (
				unique(entityDetails.map((detail) => detail.component)).length > 1
				|| unique(entityDetails.map((detail) => detail.href)).length > 1
			)
				throw new Error(`${node.internalPath} detail layout assigns ambiguous components or hrefs to ${detailIdentity}`)
		}
		const dispatchDetails = ownDetails.filter((detail, index) => (
			ownDetails.findIndex((candidate) => (
				candidate.entityType === detail.entityType
				&& candidate.selectorName === detail.selectorName
			)) === index
		))

		const hrefParamNames = routeParamNames(href)
		return {
			details: ownDetails,
			components: unique(ownDetails.map((detail) => detail.component)),
			hrefExpression: lowerRouteResolveExpression(href, hrefParamNames.map((param) => [param, `params.${param}`])),
			...(hrefParamNames.length === 0 ? {} : {
				keyExpression: hrefParamNames.length === 1 ?
					`params.${hrefParamNames[0]}`
				:
					`[${hrefParamNames.map((param) => `params.${param}`).join(', ')}].join(':')`,
			}),
			detailViewExpression: dispatchDetails.reduceRight((alternate, detail, index) => (
				index === dispatchDetails.length - 1 ?
					componentIdentifier(detail.component)
				:
					`data.selectorMapping.entityType === EntityType.${detail.entityType} && data.selectorMapping.selectorName === ${emitTypeScript(detail.selectorName)} ? ${componentIdentifier(detail.component)} : ${alternate}`
			), ''),
			detailSelectionExpression: ownDetails.length === 1 ?
				`select(EntityType.${ownDetails[0]?.entityType}, data.selector)`
			:
				'select(data.selectorMapping.entityType, data.selectorMapping.selector)',
		}
	})()
	const collections = node.collectionMappings.map((collection) => ({
		entity: collection.targetEntityType,
		source: {
			entity: collection.entityType,
			selector: collection.selector,
			field: collection.field,
		},
		query: collection.query,
		page: collection.page,
	}))
	const layout = node.layout == null ? undefined : {
		kind: RouteFileKind.Layout,
		layout: {
			...node.layout,
			...(node.layout.href == null ? {} : {
				href: routeNodeByInternalPath.get(routeId(node.layout.href))?.svelteKitPath ?? node.layout.href,
			}),
		},
	} satisfies RouteFile
	const files = [
		...(renderMappings.length === 0 ? [] : [{
			kind: RouteFileKind.PageModule,
			...(node.children.length === 0 ? {} : { sharedLayout: true as const }),
			mappings: renderMappings,
		} satisfies RouteFile]),
		...(page == null ? [] : [{
			kind: RouteFileKind.Page,
			page,
			mappings: renderMappings,
			collections,
		} satisfies RouteFile]),
		...(layout == null ? [] : [layout]),
	]
	return [
		...(files.length === 0 ? [] : [{
			internalPath: node.internalPath,
			routePath: node.svelteKitPath.replace(/^\//, ''),
			files,
		}]),
		...(node.detail == null || ownDetails.length === 0 || node.children.length === 0 ? [] : [{
			internalPath: node.internalPath,
			routePath: `${node.svelteKitPath.replace(/^\//, '')}/(${node.detail.group})`,
			files: [{
				kind: RouteFileKind.Layout,
				detailLayout,
			}],
		}]),
		...lowerEntriesFromRouteNodes(node.children, routeNodeByInternalPath),
	]
})

const validateNormalizedRouteNodes = (indexedNodes: readonly RouteNode[]) => {
	const errors = [
		...indexedNodes.flatMap((node) => (
			node.detail == null
			|| node.detail.mappings.every((detail) => node.selectorMappings.some((mapping) => (
				mapping.entityType === detail.entityType
				&& mapping.selectorName === detail.selectorName
			))) ?
				[]
			:
				[`${node.internalPath} detail mappings do not all reference local selector mappings`]
		)),
		...indexedNodes.flatMap((node) => node.selectorMappings.flatMap((mapping) => [
			...Object.keys(mapping.paramBindings).flatMap((param) => (
				node.params.some(({ name }) => name === param) ?
					[]
				:
					[`${node.internalPath} ${mapping.entityType}.${mapping.selectorName} binds missing route parameter ${param}`]
			)),
			...mapping.ancestorBindings.flatMap((binding) => binding.alternatives.flatMap((alternative) => (
				indexedNodes.some((ancestor) => (
					ancestor.internalPath === alternative.ancestorNodeId
					&& node.internalPath.startsWith(`${ancestor.internalPath}/`)
					&& ancestor.selectorMappings.some((ancestorMapping) => (
						ancestorMapping.entityType === alternative.entityType
						&& ancestorMapping.selectorName === alternative.selectorName
					))
				)) ?
					[]
				:
					[`${node.internalPath} ${mapping.entityType}.${mapping.selectorName} references missing ancestor ${alternative.entityType}.${alternative.selectorName} at ${alternative.ancestorNodeId}`]
			))),
			...(!selectorMappingOwnsDetailPage(node, mapping) || mapping.href?.entityHref === false ? [] : mapping.hrefAlternatives.flatMap((hrefParams) => node.params.flatMap(({ name }) => (
				hrefParams.some(({ param }) => param === name) ?
					[]
				:
					[`${node.internalPath} ${mapping.entityType}.${mapping.selectorName} href is missing route parameter ${name}`]
			)))),
		])),
		...indexedNodes.flatMap((node) => node.selectorVariant == null ? [] : [
			...Object.keys(node.selectorVariant.mapping.paramBindings).flatMap((param) => (
				node.params.some(({ name }) => name === param) ?
					[]
				:
					[`${node.internalPath} ${node.selectorVariant.mapping.entityType}.${node.selectorVariant.mapping.selectorName} selector variant binds missing route parameter ${param}`]
			)),
			...(indexedNodes.some((ancestor) => (
				ancestor.internalPath === node.selectorVariant?.ownerNodeId
				&& node.internalPath.startsWith(`${ancestor.internalPath}/`)
				&& ancestor.selectorMappings.some((mapping) => (
					mapping.entityType === node.selectorVariant?.mapping.entityType
					&& mapping.selectorName === node.selectorVariant.mapping.selectorName
				))
			)) ? [] : [`${node.internalPath} selector variant references missing ancestor owner ${node.selectorVariant.ownerNodeId}`]),
			...node.selectorVariant.mapping.hrefAlternatives.flatMap((hrefParams) => node.params.flatMap(({ name }) => (
				hrefParams.some(({ param }) => param === name) ?
					[]
				:
					[`${node.internalPath} ${node.selectorVariant.mapping.entityType}.${node.selectorVariant.mapping.selectorName} selector variant href is missing route parameter ${name}`]
			))),
		]),
	]
	if (new Set(indexedNodes.map((node) => node.internalPath)).size !== indexedNodes.length)
		errors.push('Normalized route node internal paths are not unique')
	if (errors.length > 0)
		throw new Error(errors.join('\n'))
}

const validateRouteLowering = (
	nodeByInternalPath: ReadonlyMap<string, RouteNode>,
	entries: readonly RouteRenderEntry[]
) => {
	const errors = [
		...entries.flatMap((entry) => {
		const node = nodeByInternalPath.get(entry.internalPath)
		if (node == null)
			return [`${entry.routePath} render entry has no normalized route node`]

		const normalizedMappings = [
			...node.selectorMappings,
			...(node.selectorVariant == null ? [] : [node.selectorVariant.mapping]),
		].map((mapping) => selectorRouteMappingKey(
			mapping.entityType,
			mapping.selectorName
		))
		return entry.files
			.filter((file) => file.mappings != null)
			.every((file) => JSON.stringify(file.mappings?.map((mapping) => selectorRouteMappingKey(
				mapping.entityType,
				mapping.selectorName
			))) === JSON.stringify(normalizedMappings)) ?
			[]
		:
			[`${entry.routePath} rendered selector mappings diverge from the normalized route node`]
		}),
		...[...nodeByInternalPath.values()].flatMap((node) => (
			node.selectorMappings.length === 0
			&& node.selectorVariant == null
			&& node.page == null
			&& node.layout == null ?
				[]
			: entries.some((entry) => entry.internalPath === node.internalPath) ?
				[]
			:
				[`${node.internalPath} normalized route node was not lowered`]
		)),
	]
	if (errors.length > 0)
		throw new Error(errors.join('\n'))
}

const sourceBindings = (source: App['sources']['sources'][number]) => [
	...(source.binding == null ? [] : [source.binding]),
	...(source.bindings ?? []),
]

const routeMappingFixtureMetadataEntries = (metadata: RouteFixtureMetadata) => [
	['id', metadata.id == null ? undefined : emitTypeScript(metadata.id)],
	['label', metadata.label == null ? undefined : emitTypeScript(metadata.label)],
	['routeKind', metadata.routeKind == null ? undefined : emitTypeScript(metadata.routeKind)],
	['projectionEntity', metadata.projectionEntity == null ? undefined : emitTypeScript(metadata.projectionEntity)],
	['probeCases', lowerArray(metadata.probeCases.map((probeCase) => lowerObject([
		['id', emitTypeScript(probeCase.id)],
		['params', lowerObject(Object.entries(probeCase.params).map(([param, atom]) => [param, emitTypeScript(atom)]))],
	])))],
	['projectionPath', metadata.projectionPath == null ? undefined : lowerArray(metadata.projectionPath.map(emitTypeScript))],
	['boundaryLiveOptional', metadata.boundaryLiveOptional == null ? undefined : 'true'],
] as const

const projectionFacetForPath = (
	entity: Entity,
	projectionPath: readonly [string, ...string[]],
	entityFacetByPath: Readonly<Record<string, EntityFacetEntry>>
) => {
	const facet = entityFacetByPath[projectionPathKey(entity.entityType, projectionPath)]?.facet
	if (facet == null)
		throw new Error(`${entity.entityType} references missing projection ${projectionPath.join('.')}`)

	return facet
}

const validateFieldReference = (
	entity: Entity,
	field: FieldReference,
	entityFacetByPath: Readonly<Record<string, EntityFacetEntry>>,
	currentFacetPath: readonly string[],
	validateLocalField = false
) => {
	if (typeof field === 'string') {
		if (!validateLocalField)
			return

		if (
			entity.fields.some((entityField) => entityField.name === field)
			|| currentFacetPath.some((_, index) => entityFacetByPath[
				projectionPathKey(entity.entityType, currentFacetPath.slice(0, index + 1))
			]?.facet.fields?.some((facetField) => facetField.name === field) === true)
		)
			return

		throw new Error(`${entity.entityType} view references missing field ${field}`)
	}

	if (!isProjectionFieldReference(field))
		return

	const facet = projectionFacetForPath(entity, field.slice(0, -1), entityFacetByPath)
	if (!facet.fields?.some((facetField) => facetField.name === field.at(-1)))
		throw new Error(`${entity.entityType} projection ${field.slice(0, -1).join('.')} references missing field ${field.at(-1)}`)
}

const facetFieldReferenceConditions = (
	entity: Entity,
	field: unknown,
	facetDependencyConditionsByPath: Readonly<Record<string, NonNullable<EntityHref['conditions']>>>
) => {
	if (!Array.isArray(field))
		return []

	return facetDependencyConditionsByPath[projectionPathKey(entity.entityType, field.slice(0, -1))] ?? []
}

const fieldReferenceInProjection = (
	entity: Entity,
	field: FieldReference,
	entityFacetByPath: Readonly<Record<string, EntityFacetEntry>>,
	currentFacetPath: readonly string[]
): FieldReference => {
	if (isProjectionFieldReference(field) || currentFacetPath.length === 0)
		return field

	for (let depth = currentFacetPath.length; depth > 0; depth--) {
		const facetPath = currentFacetPath.slice(0, depth)
		if (entityFacetByPath[projectionPathKey(entity.entityType, facetPath)]?.facet.fields?.some((candidate) => candidate.name === field) === true)
			return [
				...facetPath,
				field,
			]
	}

	return field
}

const resolveFieldReferences = (
	entity: Entity,
	value: unknown,
	entityFacetByPath: Readonly<Record<string, EntityFacetEntry>>,
	facetDependencyConditionsByPath: Readonly<Record<string, NonNullable<EntityHref['conditions']>>>,
	currentFacetPath: readonly string[] = [],
	key?: string
): unknown => {
	if (Array.isArray(value)) {
		if (
			isProjectionFieldReference(value)
			&& entityFacetByPath[projectionPathKey(entity.entityType, value.slice(0, -1))] != null
		) {
			validateFieldReference(entity, value, entityFacetByPath, currentFacetPath)

			return value
		}

		if (key === 'fields' || key === 'openFields') {
			return value.map((item) => (
				typeof item === 'string' || isProjectionFieldReference(item as FieldReference) ?
					(
						validateFieldReference(entity, item as FieldReference, entityFacetByPath, currentFacetPath),
						fieldReferenceInProjection(entity, item as FieldReference, entityFacetByPath, currentFacetPath)
					)
				:
					resolveFieldReferences(entity, item, entityFacetByPath, facetDependencyConditionsByPath, currentFacetPath)
			))
		}

		return value.map((item) => {
			if (
				typeof item === 'string'
				&& [
					'HeadingAfter',
					'blocks',
					'closed',
					'dl',
					'icon',
					'items',
					'title',
					'titleFallback',
					'value',
				].includes(key ?? '')
			) {
				const fieldReference = fieldReferenceInProjection(entity, item, entityFacetByPath, currentFacetPath)
				if (
					isProjectionFieldReference(fieldReference)
					|| entity.fields.some((field) => field.name === fieldReference)
				)
					return fieldReference
			}

			return resolveFieldReferences(entity, item, entityFacetByPath, facetDependencyConditionsByPath, currentFacetPath, key)
		})
	}

	if (value == null || typeof value !== 'object')
		return value

	if ('field' in value && (typeof (value as { field?: unknown }).field === 'string' || Array.isArray((value as { field?: unknown }).field))) {
		const field = fieldReferenceInProjection(
			entity,
			(value as { field: FieldReference }).field,
			entityFacetByPath,
			currentFacetPath
		)
		validateFieldReference(entity, field, entityFacetByPath, currentFacetPath)

		const conditions = facetFieldReferenceConditions(entity, field, facetDependencyConditionsByPath)
		return Object.fromEntries(Object.entries({
			...value,
			field,
			conditions: [
				...((value as { conditions?: {
					field: string
					equals?: _Literal
					contains?: _Literal
				}[] }).conditions ?? []),
				...conditions,
			],
		}).map(([entryKey, entryValue]) => [
			entryKey,
				entryKey === 'titleField' ?
					entryValue
				:
					resolveFieldReferences(entity, entryValue, entityFacetByPath, facetDependencyConditionsByPath, currentFacetPath, entryKey),
			]))
	}

	return Object.fromEntries(Object.entries(value).map(([entryKey, entryValue]) => {
		if (
			(entryKey === 'field' || entryKey === 'titleField')
			&& (typeof entryValue === 'string' || isProjectionFieldReference(entryValue as FieldReference))
		)
			return [
				entryKey,
				fieldReferenceInProjection(entity, entryValue as FieldReference, entityFacetByPath, currentFacetPath),
			]

		return [
			entryKey,
			resolveFieldReferences(entity, entryValue, entityFacetByPath, facetDependencyConditionsByPath, currentFacetPath, entryKey),
		]
	}))
}

const combineSingularViewContributions = (
	base: SingularView | undefined,
	facet: Partial<SingularView>
): SingularView => ({
	...(base ?? {}),
	...facet,
	summary: {
		...(base?.summary ?? {}),
		...(facet.summary ?? {}),
		icon: [
			...viewItems(base?.summary?.icon),
			...viewItems(facet.summary?.icon),
		],
		title: [
			...viewItems(base?.summary?.title),
			...viewItems(facet.summary?.title),
		],
		value: [
			...viewItems(base?.summary?.value),
			...viewItems(facet.summary?.value),
		],
		titleFallback: [
			...viewItems(base?.summary?.titleFallback),
			...viewItems(facet.summary?.titleFallback),
		],
		HeadingAfter: [
			...viewItems(base?.summary?.HeadingAfter),
			...viewItems(facet.summary?.HeadingAfter),
		],
	},
	query: base?.query,
	content: {
		...(base?.content ?? {}),
		...(facet.content ?? {}),
		dl: [
			...(base?.content?.dl ?? []),
			...(facet.content?.dl ?? []),
		],
		blocks: [
			...(base?.content?.blocks ?? []),
			...(facet.content?.blocks ?? []),
		],
		lists: [
			...(base?.content?.lists ?? []),
			...(facet.content?.lists ?? []),
		],
	},
	details: {
		...(base?.details ?? {}),
		...(facet.details ?? {}),
		blocks: [
			...(base?.details?.blocks ?? []),
			...(facet.details?.blocks ?? []),
		],
		tabs: [
			...(base?.details?.tabs ?? []),
			...(facet.details?.tabs ?? []),
		],
	},
	closed: [
		...viewItems(base?.closed),
		...viewItems(facet.closed),
	],
	latest: [
		...(base?.latest ?? []),
		...(facet.latest ?? []),
	],
	lists: [
		...(base?.lists ?? []),
		...(facet.lists ?? []),
	],
	carousels: [
		...(base?.carousels ?? []),
		...(facet.carousels ?? []),
	],
})

const normalizeApp = (app: App) => {
	const entities = app.schema.entities.map((entity) => ({
		...entity,
		facets: entity.facets?.map((facet) => ({ ...facet })),
	}))
	const facetEntries: EntityFacetEntry[] = []
	for (const entity of entities) {
		const pendingFacetEntries: EntityFacetEntry[] = (entity.facets ?? []).map((facet) => ({
			entityType: entity.entityType,
			facet,
			projectionPath: [facet.name],
		}))
		for (const facetEntry of pendingFacetEntries) {
			facetEntries.push(facetEntry)
			for (const facet of facetEntry.facet.facets ?? [])
				pendingFacetEntries.push({
					entityType: entity.entityType,
					facet,
					projectionPath: [
						...facetEntry.projectionPath,
						facet.name,
					],
				})
		}
	}
	const entityFacetByPath = nullPrototypeRecord(facetEntries.map((facetEntry) => [
		projectionPathKey(facetEntry.entityType, facetEntry.projectionPath),
		facetEntry,
	]))
	const facetAncestorConditionsByPath = nullPrototypeRecord(facetEntries.map((facetEntry) => [
		projectionPathKey(facetEntry.entityType, facetEntry.projectionPath),
		Object.freeze(facetEntry.projectionPath.slice(0, -1).flatMap((_, index) => {
			const ancestor = entityFacetByPath[projectionPathKey(
				facetEntry.entityType,
				facetEntry.projectionPath.slice(0, index + 1)
			)]

			return ancestor == null ? [] : [ancestor.facet.condition]
		})),
	]))
	const facetDependencyConditionsByPath = nullPrototypeRecord(facetEntries.map((facetEntry) => [
		projectionPathKey(facetEntry.entityType, facetEntry.projectionPath),
		Object.freeze([
			...(facetAncestorConditionsByPath[projectionPathKey(facetEntry.entityType, facetEntry.projectionPath)] ?? []),
			facetEntry.facet.condition,
		].flatMap(viewConditionFromFacetCondition)),
	]))
	const normalizedEntities = entities.map((entity) => {
		for (const field of [
			...(entity.views.singular?.query?.fields ?? []),
			...(entity.views.singular?.query?.openFields ?? []),
		])
			validateFieldReference(entity, field, entityFacetByPath, [], true)

		const normalizedViews = resolveFieldReferences(entity, entity.views, entityFacetByPath, facetDependencyConditionsByPath) as Entity['views']
		const singularView = facetEntries
			.filter((facetEntry) => facetEntry.entityType === entity.entityType)
			.reduce((view, { facet, projectionPath }) => {
				for (const field of [
					...(facet.singularView?.query?.fields ?? []),
					...(facet.singularView?.query?.openFields ?? []),
				])
					validateFieldReference(entity, field, entityFacetByPath, projectionPath, true)

				const resolvedFacetSingularView = resolveFieldReferences(
					entity,
					facet.singularView,
					entityFacetByPath,
					facetDependencyConditionsByPath,
					projectionPath
				) as Partial<SingularView> | undefined
				const facetSingularView = resolvedFacetSingularView == null ? undefined : {
					...resolvedFacetSingularView,
					carousels: resolvedFacetSingularView.carousels?.map((carousel) => ({
						...carousel,
						projectionPath,
					})),
				} satisfies Partial<SingularView>
				if (facetSingularView == null)
					return view

				return combineSingularViewContributions(view, facetSingularView)
			}, normalizedViews.singular)

		return {
			...entity,
			views: {
				...normalizedViews,
				singular: singularView,
			},
		}
	})

	return {
		app: {
			...app,
			schema: {
				...app.schema,
				entities: normalizedEntities,
			},
		},
		entityFacetByPath,
		facetEntries,
		facetAncestorConditionsByPath,
		facetDependencyConditionsByPath,
	}
}

export const validateSourceBindingCompatibility = (compatibilityRows: readonly {
	wireProtocol: WireProtocol
	apiFamilies: readonly ApiFamily[]
	endpointKinds: readonly SourceEndpointKind[]
	operationGroups: true | readonly SourceOperationGroup[]
	artifactKinds: true | readonly SourceArtifactKind[]
}[]) => {
	const protocolFamilyKeys = new Set<string>()
	for (const compatibility of compatibilityRows) {
		if (compatibility.apiFamilies.length === 0)
			throw new Error(`${compatibility.wireProtocol}: compatibility row requires at least one API family`)
		if (compatibility.endpointKinds.length === 0)
			throw new Error(`${compatibility.wireProtocol}: compatibility row requires at least one endpoint kind`)
		if (compatibility.operationGroups !== true && compatibility.operationGroups.length === 0)
			throw new Error(`${compatibility.wireProtocol}: constrained operation groups must be nonempty`)

		for (const [label, values] of [
			['API family', compatibility.apiFamilies],
			['endpoint kind', compatibility.endpointKinds],
			...(compatibility.operationGroups === true ? [] : [['operation group', compatibility.operationGroups] as const]),
			...(compatibility.artifactKinds === true ? [] : [['artifact kind', compatibility.artifactKinds] as const]),
		] as const)
			if (new Set(values).size !== values.length)
				throw new Error(`${compatibility.wireProtocol}: compatibility row contains duplicate ${label}`)

		for (const apiFamily of compatibility.apiFamilies) {
			const protocolFamilyKey = `${compatibility.wireProtocol}/${apiFamily}`
			if (protocolFamilyKeys.has(protocolFamilyKey))
				throw new Error(`Duplicate source binding compatibility pair ${protocolFamilyKey}`)

			protocolFamilyKeys.add(protocolFamilyKey)
		}
	}
}

export const compileApp = (sourceApp: App): CompiledApp => {
	validateSourceBindingCompatibility(sourceBindingCompatibility)

	const sources = Object.freeze([...sourceApp.sources.sources])
	const sourceProviders = Object.freeze([...sourceApp.sources.providers])
	const compiledSourceBindings = Object.freeze(sources
		.flatMap((source) => sourceBindings(source).map((binding) => ({
			provider: source.provider,
			source: source.source,
			binding,
		})))
		.map((sourceBinding, bindingIndex) => ({
			...sourceBinding,
			bindingIndex,
		})))
	for (const { binding, source } of compiledSourceBindings) {
		if (binding.endpoints.length === 0)
			throw new Error(`${source}: source binding requires at least one endpoint`)
		if (binding.operationGroups.length === 0)
			throw new Error(`${source}: source binding requires at least one operation group`)

		const compatibility = sourceBindingCompatibility.find((candidate) => (
			candidate.wireProtocol === binding.wireProtocol
			&& candidate.apiFamilies.some((apiFamily) => apiFamily === binding.apiFamily)
		))
		if (compatibility == null)
			throw new Error(`${source}: ${binding.apiFamily} is incompatible with ${binding.wireProtocol}`)
		if (binding.endpoints.some((endpoint) => !compatibility.endpointKinds.some((endpointKind) => endpointKind === endpoint.endpointKind)))
			throw new Error(`${source}: endpoint kind is incompatible with ${binding.wireProtocol}/${binding.apiFamily}`)
		if (
			compatibility.operationGroups !== true
			&& binding.operationGroups.some((operationGroup) => !compatibility.operationGroups.some((allowedOperationGroup) => allowedOperationGroup === operationGroup))
		)
			throw new Error(`${source}: operation group is incompatible with ${binding.apiFamily}`)
		if (
			compatibility.artifactKinds !== true
			&& binding.artifacts?.some((artifact) => !compatibility.artifactKinds.some((artifactKind) => artifactKind === artifact.kind))
		)
			throw new Error(`${source}: artifact kind is incompatible with ${binding.apiFamily}`)

		if (binding.delivery !== SourceDelivery.HttpProxy)
			continue

		const runtimeSecrets = binding.credentials.filter((credential) => (
			credential.scope === SourceCredentialScope.RuntimeSecret
		))
		if (runtimeSecrets.length > 1)
			throw new Error(`${source}: HttpProxy accepts one runtime secret`)
		for (const runtimeSecret of runtimeSecrets) {
			if (!('envKey' in runtimeSecret) || runtimeSecret.envKey.trim() === '')
				throw new Error(`${source}: HttpProxy runtime secret requires envKey`)
			if (
				'endpointTemplate' in runtimeSecret.injection
				&& !binding.endpoints.some((endpoint) => (
					endpoint.locator.includes(`{${runtimeSecret.injection.endpointTemplate.slot}}`)
				))
			)
				throw new Error(`${source}: HttpProxy runtime secret template slot is absent from its endpoints`)
		}
	}

	const {
		app,
		entityFacetByPath,
		facetEntries,
		facetAncestorConditionsByPath,
		facetDependencyConditionsByPath,
	} = normalizeApp(sourceApp)
	const sourceArtifacts = Object.freeze(compiledSourceBindings.flatMap((sourceBinding) => (
		(sourceBinding.binding.artifacts ?? []).map((artifact, artifactIndex) => ({
			...sourceBinding,
			artifact,
			artifactIndex,
		}))
	)))
	const officialSourceArtifacts = Object.freeze(sourceArtifacts.flatMap((sourceArtifact) => (
		sourceArtifact.artifact.officialUrl == null ? [] : [{
			...sourceArtifact,
			officialUrl: sourceArtifact.artifact.officialUrl,
		}]
	)))
	const sourceProviderPlans = sourceProviders.map((provider) => {
		const providerSources = sources.filter((source) => source.provider === provider.provider)
		const providerBindings = compiledSourceBindings.filter((sourceBinding) => sourceBinding.provider === provider.provider)

		return {
			provider,
			sources: providerSources,
			bindings: providerBindings,
			origins: [...new Map(providerBindings
				.flatMap(({ binding }) => binding.endpoints)
				.flatMap((endpoint) => endpoint.origin == null ? [] : [[
					endpoint.origin,
					{
						origin: endpoint.origin,
						corsEnabled: endpoint.corsEnabled === true,
					},
				] as const])).values()],
		}
	})
	const resolverModules = Object.freeze([...app.resolvers.modules])
	const navigationItems = Object.freeze([...app.navigation.items])
	const activeEntities = Object.freeze([...app.schema.entities]
		.sort((left, right) => appOrderCompare(left.entityType, right.entityType)))
	const entityTypes = Object.freeze(unique(activeEntities.map((entity) => entity.entityType)))
	const entityByType = new Map(activeEntities.map((entity) => [entity.entityType, entity]))
	const valueTypeById = new Map(app.schema.valueTypes.map((valueType) => [valueType.id, valueType]))
	const sourceIds = new Set(sources.map((source) => source.source))
	const allEntityTypes = new Set(entityTypes)
	const facetNames = new Set(facetEntries.map(({ facet }) => facet.name))
	const errors: string[] = []
	for (const entity of activeEntities) {
		const fieldByName = new Map(entity.fields.map((field) => [field.name, field]))
		for (const selector of entity.selectors) {
			if (selector.fields.length === 0)
				errors.push(`${entity.entityType}.${selector.name} selector must contain at least one field`)

			for (const fieldName of selector.fields) {
				const field = fieldByName.get(fieldName)
				if (field == null)
					errors.push(`${entity.entityType}.${selector.name} selector references missing field ${fieldName}`)
				else if (field.type === EntityFieldType.EntitiesReference)
					errors.push(`${entity.entityType}.${selector.name} selector field ${fieldName} must be a primitive or entity reference`)
				else if (
					field.cardinality !== EntityFieldCardinality.One
					&& field.cardinality !== EntityFieldCardinality.ZeroOrOne
				)
					errors.push(`${entity.entityType}.${selector.name} selector field ${fieldName} must be singular, received ${field.cardinality}`)
			}
		}
	}
	if (errors.length > 0)
		throw new Error(errors.join('\n'))

	const routeParamValueTypesByOwner = indexRouteParamValueTypes(app.routes.children, activeEntities)

	const validateRouteNodes = (
		nodes: App['routes']['children'],
		parentPath = '',
		ancestorEntityTypes: readonly string[] = [],
		ancestorParams: readonly string[] = [],
		ancestorValueTypeByParam: ReadonlyMap<string, string> = new Map()
	) => {
		for (const [segment, node] of Object.entries(nodes)) {
			const routePath = [parentPath, segment].filter(Boolean).join('/')
			const valueTypeByParam = new Map(ancestorValueTypeByParam)
			const localRouteParams = routeParamNames(segment)
			for (const param of localRouteParams) {
				const explicitValueTypes = node.params?.[param] ?? []
				const boundValueTypes = routeParamValueTypesByOwner.get(`${routeId(routePath)}\0${param}`) ?? []
				const duplicateValueTypes = explicitValueTypes.filter((valueType) => boundValueTypes.includes(valueType))
				if (duplicateValueTypes.length > 0)
					errors.push(`${routePath} route parameter ${param} duplicates selector-derived schema types ${duplicateValueTypes.join(', ')}`)
				const valueTypes = unique([
					...explicitValueTypes,
					...boundValueTypes,
				])
				if (
					valueTypes.length === 0
					|| valueTypes.some((valueType) => valueTypeById.get(valueType)?.routeParam == null)
				) {
					errors.push(`${routePath} route parameter ${param} has no schema route parameter type`)
					continue
				}
				const valueType = valueTypes[0]
				if (valueTypes.length === 1 && valueType != null)
					valueTypeByParam.set(param, valueType)
			}
			for (const param of Object.keys(node.params ?? {}))
				if (!localRouteParams.includes(param))
					errors.push(`${routePath} defines schema type metadata for non-local parameter ${param}`)
			if (/\[[^\]]+=/.test(segment))
				errors.push(`${routePath} encodes matcher metadata in its semantic segment key`)
			for (const param of routeParamNames(routeId(routePath)))
				if (facetNames.has(param))
					errors.push(`${routePath} route parameter ${param} collides with a facet identifier`)
			const visibleSegments = publicRouteId(routePath)
				.split('/')
				.filter((pathSegment) => pathSegment !== '' && !pathSegment.startsWith('['))
			for (const [index, pathSegment] of visibleSegments.entries()) {
				if (pathSegment === 'by')
					errors.push(`${routePath} uses visible /by route segment`)
				if (pathSegment === visibleSegments[index + 1])
					errors.push(`${routePath} repeats visible route segment ${pathSegment}`)
			}
			const routeParams = new Set([
				...ancestorParams,
				...localRouteParams,
			])
			const localEntityTypes = Object.keys(node.selectors ?? {})
			for (const [entityType, selectors] of Object.entries(node.selectors ?? {})) {
				const entity = entityByType.get(entityType)
				if (entity == null)
					continue

				for (const [selectorName, mapping] of Object.entries(selectors)) {
					const selector = entity.selectors.find((candidate) => candidate.name === selectorName)
					if (selector == null)
						continue

					for (const [param, fieldPath] of Object.entries(mapping.params ?? {})) {
						if (!routeParams.has(param))
							errors.push(`${routePath} selector ${entityType}.${selectorName} binds unknown route param ${param}`)
						const routeValueType = valueTypeByParam.get(param)
						const fieldValueType = entity.fields.find((field) => field.name === fieldPath[0])?.valueType
						if (routeValueType != null && fieldValueType != null && routeValueType !== fieldValueType)
							errors.push(`${routePath} parameter ${param} type ${routeValueType} does not match ${entityType}.${fieldPath.join('.')} type ${fieldValueType}`)
					}

					for (const fieldName of selector.fields) {
						if (
							Object.values(mapping.params ?? {}).some((fieldPath) => fieldPath[0] === fieldName)
							|| Object.hasOwn(mapping.derivations ?? {}, fieldName)
							|| ancestorEntityTypes.includes(entity.fields.find((field) => field.name === fieldName)?.entityType ?? '')
						)
							continue

						errors.push(`${routePath} selector ${entityType}.${selectorName} does not satisfy ${fieldName}`)
					}
				}
			}

			if (node.children != null)
					validateRouteNodes(
					node.children,
					routePath,
					[...ancestorEntityTypes, ...localEntityTypes],
					[...routeParams],
					valueTypeByParam
				)
		}
	}
	validateRouteNodes(app.routes.children)
	if (errors.length > 0)
		throw new Error(errors.join('\n'))

	if (Object.hasOwn(app.schema, 'externalEntityTypes'))
		errors.push('APP schema must not use externalEntityTypes; migrate rows into schema.entities')
	if (Object.hasOwn(app.schema, 'migrationBacklogEntityTypes'))
		errors.push('APP schema must not use migrationBacklogEntityTypes; migrate rows into schema.entities')

	const expectUnique = (label: string, values: readonly string[]) => {
		for (const value of values) {
			if (values.indexOf(value) !== values.lastIndexOf(value))
				errors.push(`Duplicate ${label}: ${value}`)
		}
	}
	const validateFacetDefinitions = (
		entity: Entity,
		facets: readonly EntityFacet[] | undefined,
		availableFieldNames: ReadonlySet<string>,
		parentPath: readonly string[] = []
	) => {
		expectUnique(`${entity.entityType} ${parentPath.join('.') || 'base'} facet`, (facets ?? []).map((facet) => facet.name))
		for (const facet of facets ?? []) {
			const facetPath = [
				...parentPath,
				facet.name,
			]
			if (!/^[A-Z][A-Za-z0-9]*$/.test(facet.name))
				errors.push(`${entity.entityType}.${facetPath.join('.')} facet name must be TitleCase`)
			if (availableFieldNames.has(facet.name))
				errors.push(`${entity.entityType}.${facetPath.join('.')} facet name collides with a field in its projection namespace`)

			validateFacetDefinitions(
				entity,
				facet.facets,
				new Set([
					...availableFieldNames,
					...(facet.fields ?? []).map((field) => field.name),
				]),
				facetPath
			)
		}
	}

	expectUnique('entity type', entityTypes)
	expectUnique('active entity type', activeEntities.map((entity) => entity.entityType))
	expectUnique('value type', app.schema.valueTypes.map((valueType) => valueType.id))
	expectUnique('source', sources.map((source) => source.source))
	expectUnique('source provider', sourceProviders.map((provider) => provider.provider))

	for (const entity of activeEntities) {
		if (entityLabelPlural(entity).trim() === '')
			errors.push(`${entity.entityType} is missing an explicit labels.plural value`)
		expectUnique(`${entity.entityType} selector`, entity.selectors.map((selector) => selector.name))
		for (const selector of entity.selectors) {
			if (!/^[A-Z][A-Za-z0-9]*$/.test(selector.name))
				errors.push(`${entity.entityType} selector ${selector.name} must be TitleCase`)
		}
		expectUnique(`${entity.entityType} field`, entity.fields.map((field) => field.name))
		const fieldNames = new Set(entity.fields.map((field) => field.name))
		validateFacetDefinitions(entity, entity.facets, fieldNames)
		for (const selector of entity.selectors) {
			for (const field of selector.fields) {
				if (!fieldNames.has(field))
					errors.push(`${entity.entityType}.${selector.name} references missing field ${field}`)
			}
		}
		for (const field of entityFields(entity)) {
			if (
				field.type === EntityFieldType.Primitive && field.name.startsWith('$')
				|| field.type === EntityFieldType.EntityReference && !/^\$[^$].+$/.test(field.name)
				|| field.type === EntityFieldType.EntitiesReference && !/^\$\$[^$].+$/.test(field.name)
			)
				errors.push(`${entity.entityType}.${field.name} name does not match ${field.type}`)
			if (field.valueType != null && !valueTypeById.has(field.valueType))
				errors.push(`${entity.entityType}.${field.name} references missing value type ${field.valueType}`)
			if (field.entityType != null && !allEntityTypes.has(field.entityType))
				errors.push(`${entity.entityType}.${field.name} references missing entity type ${field.entityType}`)
			for (const source of field.defaultSources ?? []) {
				if (!sourceIds.has(source))
					errors.push(`${entity.entityType}.${field.name} references missing source ${source}`)
			}
		}
		for (const { facet } of facetEntries.filter((facetEntry) => facetEntry.entityType === entity.entityType)) {
			errors.push(...facetConditionErrors(entity, facet.condition, entityFacetByPath))
			for (const list of facet.singularView?.lists ?? []) {
				if (
					list.field != null
					&& !entityFields(entity).some((field) => field.name === fieldNameForReference(list.field))
				)
					errors.push(`${entity.entityType} facet list references missing field ${list.field}`)
			}
		}
		if (entityPluralView(entity)?.rowHref != null) {
			const selectorFieldNames = new Set(entity.selectors.flatMap((selector) => selector.fields))
			for (const [
				param,
				value,
			] of Object.entries(entityPluralView(entity).rowHref.params)) {
				for (const fieldPath of expressionFieldPaths('expression' in value ? value.expression : value)) {
					const field = fieldPath[0]
					if (field != null && !selectorFieldNames.has(field))
						errors.push(`${entity.entityType} rowHref param ${param} references non-selector field ${field}`)
				}
			}
		}
	}

	const generatedComponents = new Set(activeEntities.flatMap((entity) => [
		singularComponentName(entity.entityType),
		pluralComponentName(entity),
	]))
	if (errors.length > 0)
		throw new Error(errors.join('\n'))

	const compiledRoutes = compileRouteTree(
		app.routes.children,
		activeEntities,
		valueTypeById,
		routeParamValueTypesByOwner
	)
	const indexedRouteNodes = flattenRouteNodes(compiledRoutes.nodes)
	const routeNodeByInternalPath = new Map(indexedRouteNodes.map((node) => [node.internalPath, node]))
	validateNormalizedRouteNodes(indexedRouteNodes)
	const routeEntryList = Object.freeze(lowerEntriesFromRouteNodes(compiledRoutes.nodes, routeNodeByInternalPath))
	validateRouteLowering(routeNodeByInternalPath, routeEntryList)
	const routeNodesByPublicPath = Map.groupBy(indexedRouteNodes, (node) => node.publicPath)
	const routeNodesByPublicShape = Map.groupBy(indexedRouteNodes, (node) => publicRouteShape(node.publicPath))
	const routeMappingsByEntityTypeAndSelector = Map.groupBy(
		indexedRouteNodes.flatMap((node) => node.selectorMappings.map((mapping) => ({
			node,
			mapping,
		}))),
		({ mapping }) => selectorRouteMappingKey(mapping.entityType, mapping.selectorName)
	)
	for (const [key, entries] of routeMappingsByEntityTypeAndSelector)
		if (entries.length > 1)
			throw new Error(`Duplicate route selector mapping ${key}: ${entries.map(({ node }) => node.internalPath).join(', ')}`)

	const routeMappingByEntityTypeAndSelector = new Map([...routeMappingsByEntityTypeAndSelector].flatMap(([key, [entry]]) => (
		entry == null ? [] : [[key, entry.mapping] as const]
	)))
	const routeMappingsByNode = new Map(indexedRouteNodes.map((node) => [
		node.internalPath,
		node.selectorMappings,
	]))
	const routeProbeMappingsByNode = indexRouteProbeMappings(compiledRoutes.nodes)

	for (const entry of routeEntryList) {
		for (const routeFile of entry.files) {
			if (routeFile.layout?.entity != null && !entityByType.has(routeFile.layout.entity))
				errors.push(`${entry.routePath} layout references missing entity ${routeFile.layout.entity}`)

			if (
				routeFile.page?.view?.component != null
				&& routeFile.mappings?.length === 0
				&& (routeFile.collections?.length ?? 0) === 0
				&& !generatedComponents.has(routeFile.page.view.component)
			)
				errors.push(`${entry.routePath} view references missing generated component ${routeFile.page.view.component}`)
		}
	}

	const enumMembersByName = new Map([
		...(app.schema.enums ?? []),
		...activeEntities.flatMap((entity) => entity.enums ?? []),
	].map((appEnum) => [
		appEnum.name,
		appEnum.members.map((member) => member.value),
	]))
	const applicabilityFor = (node: RouteNode, mapping: SelectorRouteMapping | undefined) => routeApplicability(
		node,
		mapping,
		valueTypeById,
		enumMembersByName,
		entityFacetByPath,
		facetAncestorConditionsByPath
	)
	for (const node of indexedRouteNodes)
		for (const [index, left] of node.selectorMappings.entries())
			for (const right of node.selectorMappings.slice(index + 1))
				if (routeApplicabilitySetsOverlap([applicabilityFor(node, left)], [applicabilityFor(node, right)]))
					errors.push(`${node.internalPath} selector mappings ${left.entityType}.${left.selectorName} and ${right.entityType}.${right.selectorName} have overlapping or unknown applicability`)

	for (const indexedEntries of routeNodesByPublicShape.values()) {
		const entries = indexedEntries.filter((node) => node.page != null || node.selectorMappings.length > 0)
		for (const [index, left] of entries.entries())
			for (const right of entries.slice(index + 1)) {
				const leftMappings = routeProbeMappingsByNode.get(left.internalPath)?.mappings ?? []
				const rightMappings = routeProbeMappingsByNode.get(right.internalPath)?.mappings ?? []
				const leftApplicabilities = (leftMappings.length === 0 ? [undefined] : leftMappings).map((mapping) => applicabilityFor(left, mapping))
				const rightApplicabilities = (rightMappings.length === 0 ? [undefined] : rightMappings).map((mapping) => applicabilityFor(right, mapping))
				if (routeApplicabilitySetsOverlap(leftApplicabilities, rightApplicabilities))
					errors.push(`${left.internalPath} and ${right.internalPath} overlap public route shape ${publicRouteShape(left.publicPath)} with overlapping or unknown applicability`)
			}
	}

	for (const snippet of rawSnippetSources(app)) {
		try {
			parseSvelte(snippet.raw)
		} catch (error) {
			errors.push(`Raw Svelte fragment did not parse: ${error instanceof Error ? error.message : String(error)}`)
		}
	}

	const seenRouteFiles = new Set<string>()
	for (const entry of routeEntryList) {
		for (const routeFile of entry.files) {
			const filePath = `src/routes/${entry.routePath}/${routeFileName(routeFile.kind)}`.replaceAll('//', '/')
			if (seenRouteFiles.has(filePath))
				errors.push(`Duplicate generated route file: ${filePath}`)
			seenRouteFiles.add(filePath)
		}
	}

	if (errors.length > 0)
		throw new Error(errors.join('\n'))

	const collectionHrefByEntity = new Map<string, string>()
	const collectionHrefBySourceField = new Map<string, CollectionRouteHref>()
	const entityHrefsByType = new Map<string, EntityHref[]>()
	for (const node of indexedRouteNodes) {
		for (const collection of node.collectionMappings) {
			if (
				node.params.length === 0
				&& (
					collectionHrefByEntity.get(collection.targetEntityType) == null
					|| node.svelteKitPath.length < (collectionHrefByEntity.get(collection.targetEntityType) ?? '').length
				)
			)
				collectionHrefByEntity.set(collection.targetEntityType, node.svelteKitPath)

			const collectionHref = routeHrefFromCollection(node, collection)
			if (collectionHref == null)
				continue

			const key = collectionSourceFieldKey(
				collection.entityType,
				fieldNameForReference(collection.field),
				collection.targetEntityType
			)
			if (
				collectionHrefBySourceField.get(key) == null
				|| collectionHref.href.length < (collectionHrefBySourceField.get(key)?.href.length ?? 0)
			)
				collectionHrefBySourceField.set(key, collectionHref)
		}

		for (const mapping of [
			...node.selectorMappings,
			...(node.selectorVariant == null ? [] : [node.selectorVariant.mapping]),
		]) {
			const entityHrefs = routeHrefsFromMapping(
				node,
				mapping,
				entityFacetByPath,
				facetDependencyConditionsByPath
			)
			const existingEntityHrefs = entityHrefsByType.get(mapping.entityType) ?? []
			if (
				entityHrefs.length > 0
				&& existingEntityHrefs.every((existingHref) => entityHrefs.every((entityHref) => (
					JSON.stringify({
						href: existingHref.href,
						selector: existingHref.selector,
						conditions: existingHref.conditions ?? [],
						params: existingHref.params,
					}) !== JSON.stringify({
						href: entityHref.href,
						selector: entityHref.selector,
						conditions: entityHref.conditions ?? [],
						params: entityHref.params,
					})
					&& (
						existingHref.selector !== entityHref.selector
						|| (existingHref.conditions?.length ?? 0) > 0
						|| (entityHref.conditions?.length ?? 0) > 0
					)
				)))
			)
				entityHrefsByType.set(mapping.entityType, [
					...existingEntityHrefs,
					...entityHrefs,
				])
		}
	}
	for (const node of indexedRouteNodes) {
		for (const mapping of node.selectorMappings) {
			const mappingMetadata = routeFixtureMetadataFromMapping(mapping)
			const projectionPath = mappingMetadata.projectionPath ?? []
			const projectionEntityType = mappingMetadata.projectionEntity
			const facetKey = projectionEntityType == null ? undefined : projectionPathKey(projectionEntityType, projectionPath)
			const facetEntry = projectionPath.length === 0 || facetKey == null ? undefined : entityFacetByPath[facetKey]
			if (projectionPath.length > 0) {
				if (projectionEntityType == null)
					errors.push(`${node.internalPath} mapping ${mappingMetadata.id} must declare projectionEntity for projection [${projectionPath.map(emitTypeScript).join(', ')}]`)
				else if (facetEntry == null)
					errors.push(`${node.internalPath} mapping ${mappingMetadata.id} references missing ${projectionEntityType} projection [${projectionPath.map(emitTypeScript).join(', ')}]`)
			}
		}
	}

	const namedSourceSelections = [...new Map(unique(collectSourceSelections(app))
		.filter((selection) => selection.name != null)
		.map((selection) => [defaultSourcesName(selection), {
			selection,
			defaultSourcesName: defaultSourcesName(selection),
			selectionByKeyName: sourceSelectionByKeyName(selection),
		}] as const)).values()]
	const physicalRouteFiles = compilePhysicalRouteFilePlans(routeEntryList)
	const routeFixturePlans = physicalRouteFiles.flatMap((physicalRouteFile) => {
		if (
			physicalRouteFile.routeFile.kind !== RouteFileKind.Page
			|| routeParamNames(physicalRouteFile.appRoutePath).length === 0
		)
			return []

		const node = routeNodeByInternalPath.get(physicalRouteFile.semanticNodeId)
		if (node == null)
			throw new Error(`${physicalRouteFile.path} has no normalized route node ${physicalRouteFile.semanticNodeId}`)

		const probeMappingEntry = routeProbeMappingsByNode.get(node.internalPath)
		const mappings = (probeMappingEntry?.mappings ?? []).map(routeFixtureMetadataFromMapping)
		if (mappings.length === 0)
			errors.push(`${physicalRouteFile.path} has no selector-owned probe cases`)

		const routeParams = node.params.map(({ name }) => name)
		for (const mapping of mappings) {
			if (mapping.probeCases.length === 0)
				errors.push(`${physicalRouteFile.path} mapping ${mapping.id} has no probe cases`)
			for (const probeCase of mapping.probeCases) {
				const caseParams = Object.keys(probeCase.params)
				for (const missingParam of routeParams.filter((param) => !caseParams.includes(param)))
					errors.push(`${physicalRouteFile.path} mapping ${mapping.id} probe case ${probeCase.id} is missing ${missingParam}`)
				for (const extraParam of caseParams.filter((param) => !routeParams.includes(param)))
					errors.push(`${physicalRouteFile.path} mapping ${mapping.id} probe case ${probeCase.id} has unknown ${extraParam}`)
			}
		}

		return [{
			nodeId: node.internalPath,
			probeOwnerNodeId: probeMappingEntry?.ownerNodeId,
			routeId: node.svelteKitPath,
			publicPath: node.publicPath,
			parameterMatchers: Object.fromEntries(node.params.map((param) => [param.name, param.matchers])),
			mappings,
			boundaryLiveOptional: mappings.some((mapping) => mapping.boundaryLiveOptional),
		}]
	})
		.toSorted((left, right) => left.nodeId.localeCompare(right.nodeId, 'en', {
			sensitivity: 'base',
			numeric: true,
		}))
	if (errors.length > 0)
		throw new Error(errors.join('\n'))

	const compiledApp = {
		activeEntities,
		entityTypes,
		entityViewPlans: activeEntities.map((entity) => ({
			entity,
			singularComponent: singularComponentName(entity.entityType),
			pluralComponent: pluralComponentName(entity),
			namedSourceSelections: collectSourceSelections(entity.views.singular).filter((selection) => selection.name != null),
			rawSnippetComponents: unique(rawSnippetSources(entity).flatMap((snippet) => activeEntities.flatMap((targetEntity) => [
				singularComponentName(targetEntity.entityType),
				pluralComponentName(targetEntity),
			]).filter((component) => (
				component !== singularComponentName(entity.entityType)
				&& snippet.raw.includes(`<${component}`)
			)))),
		})),
		entityByType: nullPrototypeRecord([...entityByType]),
		facetEntries: Object.freeze(facetEntries),
		entityFacetByPath,
		facetAncestorConditionsByPath,
		facetDependencyConditionsByPath,
		valueTypeById: nullPrototypeRecord([...valueTypeById]),
		sources,
		sourceProviders,
		sourceProviderPlans,
		sourceBindings: compiledSourceBindings,
		sourceArtifacts,
		officialSourceArtifacts,
		sourceById: nullPrototypeRecord(sources.map((source) => [source.source, source])),
		resolverModules,
		navigationItems,
		routeNodes: Object.freeze(compiledRoutes.nodes),
		renderEntries: routeEntryList,
		routeNodeByInternalPath: nullPrototypeRecord([...routeNodeByInternalPath]),
		routeNodesByPublicPath: nullPrototypeRecord([...routeNodesByPublicPath]),
		routeNodesByPublicShape: nullPrototypeRecord([...routeNodesByPublicShape]),
		routeMappingByEntityTypeAndSelector: nullPrototypeRecord([...routeMappingByEntityTypeAndSelector]),
		routeMappingsByNode: nullPrototypeRecord([...routeMappingsByNode]),
		routeProbeMappingsByNode: nullPrototypeRecord([...routeProbeMappingsByNode]),
		compositeRouteParams: [...new Map(indexedRouteNodes
			.flatMap((node) => node.params)
			.filter((routeParam) => routeParam.matchers.length > 1)
			.map((routeParam) => [routeParam.matcher, {
				matcher: routeParam.matcher,
				matchers: routeParam.matchers,
			}] as const)).values()],
		routeFixturePlans,
		physicalRouteFiles,
		collectionHrefByEntity: nullPrototypeRecord([...collectionHrefByEntity]),
		collectionHrefBySourceField: nullPrototypeRecord([...collectionHrefBySourceField]),
		entityHrefsByType: nullPrototypeRecord([...entityHrefsByType]),
		generatedComponentByName: nullPrototypeRecord([...generatedComponents].map((component) => [component, true])),
		namedSourceSelections,
		namedRelationshipListViews: namedRelationshipListViews({
			activeEntities,
			entityByType: nullPrototypeRecord([...entityByType]),
			generatedComponentByName: nullPrototypeRecord([...generatedComponents].map((component) => [component, true])),
		}),
	} satisfies CompiledAppFacts

	const duplicatePhysicalPaths = compiledApp.physicalRouteFiles
		.map((routeFile) => routeFile.path)
		.filter((filePath, index, paths) => paths.indexOf(filePath) !== index)
	if (duplicatePhysicalPaths.length > 0)
		throw new Error(`Duplicate physical route file plans:\n${unique(duplicatePhysicalPaths).join('\n')}`)
	for (const plan of compiledApp.physicalRouteFiles) {
		const detailKeys = (plan.routeFile.detailLayout?.details ?? []).map((detail) => selectorRouteMappingKey(
			detail.entityType,
			detail.selectorName
		))
		if (unique(detailKeys).length !== detailKeys.length)
			throw new Error(`${plan.path} has duplicate detail selector plans`)
	}

	const sourcesMarkdown = {
		sourceArtifacts: compiledApp.sourceArtifacts,
		sourceBindings: compiledApp.sourceBindings,
		sourceProviders: compiledApp.sourceProviders,
		sources: compiledApp.sources,
	} satisfies SourcesMarkdownLoweringInput

	const loweringInput = {
		indexes: {
				collectionHrefByEntity: compiledApp.collectionHrefByEntity,
				collectionHrefBySourceField: compiledApp.collectionHrefBySourceField,
				entityByType: compiledApp.entityByType,
				entityFacetByPath: compiledApp.entityFacetByPath,
				entityHrefsByType: compiledApp.entityHrefsByType,
				facetAncestorConditionsByPath: compiledApp.facetAncestorConditionsByPath,
				facetDependencyConditionsByPath: compiledApp.facetDependencyConditionsByPath,
				generatedComponentByName: compiledApp.generatedComponentByName,
				valueTypeById: compiledApp.valueTypeById,
		},
		entityTypes: compiledApp.entityTypes,
		entityViewPlans: compiledApp.entityViewPlans,
		sourcesMarkdown,
		sourceNames: compiledApp.sources.map((source) => source.source),
	sourceProviderNames: compiledApp.sourceProviders.map((provider) => provider.provider),
	sourceProviderPlans: compiledApp.sourceProviderPlans,
	sourceBindings: compiledApp.sourceBindings,
	namedSourceSelections: compiledApp.namedSourceSelections,
		navigationItems: compiledApp.navigationItems,
		officialSourceArtifacts: compiledApp.officialSourceArtifacts,
		resolverModules: compiledApp.resolverModules,
		routeFixturePlans: compiledApp.routeFixturePlans,
		namedRelationshipListViews: compiledApp.namedRelationshipListViews,
		compositeRouteParams: compiledApp.compositeRouteParams,
		physicalRouteFiles: compiledApp.physicalRouteFiles,
	} satisfies AppLoweringInput

	return freezeCompiled({
		generatedFiles: lowerGeneratedFiles(loweringInput),
	})
}

const lowerGeneratedFiles = (loweringInput: AppLoweringInput): GeneratedFile[] => {
	const indexes = loweringInput.indexes
	const files = [
		lowerEntityFieldFile(),
		lowerEntityTypeFile(loweringInput.entityTypes),
		...loweringInput.entityViewPlans.map(({ entity }) => lowerEntitySchemaFile(entity, indexes)),
		lowerSchemaIndexFile(loweringInput.entityTypes),
		lowerSourcesMarkdownFile(loweringInput.sourcesMarkdown),
		lowerSourceFile(loweringInput.sourceNames),
		lowerSourceBindingFile(),
		lowerSourceBindingCompatibilityFile(),
		lowerSourceProviderFile(loweringInput.sourceProviderNames),
		lowerSourceProvidersFile(loweringInput.sourceProviderPlans),
		lowerSourceServerCredentialsFile(loweringInput.sourceBindings),
		lowerSourceSelectionsFile(loweringInput.namedSourceSelections),
		lowerNavigationItemFile(),
		lowerNavigationItemsFile(loweringInput.navigationItems),
		lowerSourcesIndexFile(),
		lowerSourcesServerIndexFile(),
		lowerOfficialArtifactsFile(loweringInput.officialSourceArtifacts),
		lowerResolverIndexFile(loweringInput.resolverModules),
		lowerE2eRouteFixtureMetadataFile(loweringInput.routeFixturePlans),
		...loweringInput.entityViewPlans.flatMap((entityViewPlan) => [
			lowerSingularViewFile(entityViewPlan, indexes),
			lowerPluralViewFile(entityViewPlan.entity, indexes),
		]),
		...loweringInput.namedRelationshipListViews.map((view) => lowerNamedRelationshipListViewFile(view)),
		lowerViewsIndexFile(loweringInput.entityViewPlans.map(({ entity }) => entity)),
		...loweringInput.compositeRouteParams.map((routeParam) => tsFile(
			`src/params/${routeParam.matcher}.ts`,
			{
				imports: routeParam.matchers.map((matcher) => ({
					from: `$/params/${matcher}.ts`,
					names: [{
						name: 'match',
						alias: `match${matcher[0]?.toUpperCase()}${matcher.slice(1)}`,
					}],
				})),
				body: [
					'export const match = (param: string) => (',
					...routeParam.matchers.map((matcher, index) => `\t${index === 0 ? '' : '|| '}match${matcher[0]?.toUpperCase()}${matcher.slice(1)}(param)`),
					')',
				],
			}
		)),
		...loweringInput.physicalRouteFiles.flatMap((plan) => lowerRouteFiles(plan, indexes)),
	]
	const paths = files.map((generatedFile) => generatedFile.path)
	const duplicatePaths = paths.filter((filePath, index) => paths.indexOf(filePath) !== index)
	if (duplicatePaths.length > 0)
		throw new Error(`Duplicate generated output paths:\n${unique(duplicatePaths).join('\n')}`)

	return files
}

const lowerEntityFieldFile = () => tsFile(
	'src/schema/EntityField.ts',
	{
		body: [
			lowerStringEnum('EntityFieldCardinality', Object.values(EntityFieldCardinality)),
			'',
			lowerStringEnum('EntityFieldType', Object.values(EntityFieldType)),
		],
	}
)

const lowerEntityTypeFile = (entityTypes: readonly string[]) => tsFile(
	'src/schema/EntityType.ts',
	{
		body: [
			lowerStringEnum('EntityType', entityTypes),
		],
	}
)

const lowerE2eRouteFixtureMetadataFile = (routeFixturePlans: readonly RouteFixturePlan[]) => {
	const matcherNames = unique(routeFixturePlans.flatMap((plan) => Object.values(plan.parameterMatchers).flat()))
	return tsFile(
	'tests/e2e/_generatedRouteFixtureMetadata.ts',
	{
		imports: [
			...matcherNames.map((matcher) => ({
				from: `$/params/${matcher}.ts`,
				names: [{
					name: 'match',
					alias: `match${matcher[0]?.toUpperCase()}${matcher.slice(1)}`,
				}],
			})),
		],
		body: [
			'export type E2eRouteFixtureParams = Readonly<Partial<Record<string, string>>>',
			'',
			'const requiredE2eRouteParam = (',
			'\tparams: E2eRouteFixtureParams,',
			'\trouteId: string,',
			'\tparamName: string',
			') => {',
			'\tconst value = params[paramName]',
			'\tif (value == null || value === \'\')',
			'\t\tthrow new Error(`${routeId} is missing required route parameter ${paramName}`)',
			'',
			'\treturn value',
			'}',
			'',
			'export const e2eRouteParamMatcherByName = {',
			...matcherNames.map((matcher) => `\t${matcher}: match${matcher[0]?.toUpperCase()}${matcher.slice(1)},`),
			'} as const',
			'',
			'export type E2eRouteProbeCase = {',
			'\tid: string',
			'\tparams: Readonly<Record<string, string>>',
			'}',
			'',
			'export type E2eRouteFixtureMapping = {',
			'\tid: string',
			'\trouteKind: string',
			'\tprojectionEntity?: string',
			'\tprobeCases: readonly E2eRouteProbeCase[]',
			'\tprojectionPath?: readonly [string, ...string[]]',
			'\tboundaryLiveOptional?: true',
			'}',
			'',
			'export type E2eRouteFixtureMetadata = {',
			'\tnodeId: string',
			'\tprobeOwnerNodeId?: string',
			'\trouteId: string',
			'\tpublicPath: string',
			'\tparameterMatchers: Readonly<Record<string, readonly (keyof typeof e2eRouteParamMatcherByName)[]>>',
			'\tmappings: readonly E2eRouteFixtureMapping[]',
			'\tresolve: (params: E2eRouteFixtureParams) => string',
			'\tboundaryLiveOptional?: true',
			'}',
			'',
			`export const e2eRouteFixtureMetadataByNodeId = ${lowerObject(routeFixturePlans
				.map((metadata) => [
					metadata.nodeId,
					lowerObject([
						['nodeId', emitTypeScript(metadata.nodeId)],
						['probeOwnerNodeId', metadata.probeOwnerNodeId == null ? undefined : emitTypeScript(metadata.probeOwnerNodeId)],
						['routeId', emitTypeScript(metadata.routeId)],
						['publicPath', emitTypeScript(metadata.publicPath)],
						['parameterMatchers', lowerObject(Object.entries(metadata.parameterMatchers).map(([param, matchers]) => [
							param,
							lowerArray(matchers.map(emitTypeScript)),
						]))],
						['mappings', lowerArray(metadata.mappings.map((mapping) => lowerObject(routeMappingFixtureMetadataEntries(mapping))))],
						['resolve', `(params) => [${metadata.publicPath
							.split(/(\[\[?(?:\.\.\.)?\w+(?:=\w+)?\]\]?)/g)
							.filter(Boolean)
							.map((segment) => {
								const match = segment.match(/^\[\[?(?:\.\.\.)?(\w+)(?:=\w+)?\]\]?$/)
								return match == null ? emitTypeScript(segment) : `requiredE2eRouteParam(params, ${emitTypeScript(metadata.routeId)}, ${emitTypeScript(match[1])})`
							})
							.join(', ')}].join('')`],
						['boundaryLiveOptional', metadata.boundaryLiveOptional ? 'true' : undefined],
					]),
			]))} as const satisfies Record<string, E2eRouteFixtureMetadata>`,
			'',
			'type E2eRouteProbeAtomFromParams<_Params> = _Params extends Readonly<Record<string, string>> ? _Params[keyof _Params] : never',
			'',
			'export type E2eRouteProbeAtom = E2eRouteProbeAtomFromParams<(typeof e2eRouteFixtureMetadataByNodeId)[keyof typeof e2eRouteFixtureMetadataByNodeId][\'mappings\'][number][\'probeCases\'][number][\'params\']>',
		],
	}
)}

const lowerAppEnum = (appEnum: App['schema']['enums'][number]) => [
	`export enum ${appEnum.name} {`,
	...appEnum.members.map((member) => `\t${member.name} = ${emitTypeScript(member.value)},`),
	'}',
].join('\n')

const lowerValueTypeType = (valueTypeType: ValueTypeType | undefined): string => {
	if (valueTypeType == null)
		return 'type("unknown")'
	if ('primitive' in valueTypeType) {
		const primitiveType = `type(${emitTypeScript(valueTypeType.primitive)})`
		if (valueTypeType.primitive !== 'string')
			return primitiveType

		return [
			primitiveType,
			...(valueTypeType.characters == null ? [] : [`.matching(${emitTypeScript(`^[${valueTypeType.characters.replaceAll(/[-\\\]^]/g, '\\$&')}]+$`)})`]),
			...(valueTypeType.minimumLength == null ? [] : [`.atLeastLength(${valueTypeType.minimumLength})`]),
			...(valueTypeType.maximumLength == null ? [] : [`.atMostLength(${valueTypeType.maximumLength})`]),
		].join('')
	}
	if ('unit' in valueTypeType)
		return `type.unit(${emitTypeScript(valueTypeType.unit)})`
	if ('enum' in valueTypeType)
		return `type.enumerated(...Object.values(${valueTypeType.enum}))`
	if ('array' in valueTypeType)
		return `${lowerValueTypeType(valueTypeType.array)}.array()`
	if ('object' in valueTypeType)
		return `type({ ${valueTypeType.object.map((field) => `${emitTypeScript(field.name)}: ${lowerValueTypeType(field.type)}`).join(', ')} })`

	return formatTsExpression(typeof valueTypeType.raw === 'string' ? valueTypeType.raw : valueTypeType.raw.raw)
}

const valueTypeTypeIsStructured = (valueTypeType: ValueTypeType | undefined): boolean => (
	valueTypeType == null ?
		false
	: 'object' in valueTypeType ?
		true
	: 'array' in valueTypeType ?
		true
	:
		false
)

const lowerEntitySchemaFile = (entity: Entity, indexes: LoweringIndexes) => {
	const facetFields = (facets: Entity['facets']): EntityField[] => (
		facets ?? []
	).flatMap((facet) => [
		...(facet.fields ?? []),
		...facetFields(facet.facets),
	])
	const fields = [
		...entity.fields,
		...facetFields(entity.facets),
	]
	const defaultSources = fields.some((field) => field.defaultSources != null)
	const localEnumNames = new Set((entity.enums ?? []).map((appEnum) => appEnum.name))
	const valueTypeImports = fields.flatMap((field) => (
		field.valueType == null ?
			[]
		:
			lowerImportObject(indexes.valueTypeById[field.valueType]?.imports)
				.filter((importSpec) => (
					importSpec.from !== schemaModulePath(entity.entityType)
					|| [
						...(importSpec.names ?? []),
						...(importSpec.typeNames ?? []),
					].every((name) => !localEnumNames.has(name))
				))
	))
	const imports: ImportSpec[] = [
		{
			from: 'arktype',
			names: ['type'],
		},
		{
			from: '$/schema/$schema.ts',
			names: [
				'entity',
				'facet',
			],
		},
		{
			from: '$/schema/EntityField.ts',
			names: [
				'EntityFieldCardinality',
				'EntityFieldType',
			],
		},
		{
			from: '$/schema/EntityType.ts',
			names: ['EntityType'],
		},
		...(defaultSources ? [{
			from: '$/sources/Source.ts',
			names: ['Source'],
		}] satisfies ImportSpec[] : []),
		...valueTypeImports,
	]
	const selectorEnum = `${entity.entityType}Selector`
	const selectorEnumSource = [
		`export enum ${selectorEnum} {`,
		...entity.selectors.map((selector) => `\t${selectorMemberName(selector)} = ${emitTypeScript(selector.name)},`),
		'}',
	].join('\n')
	const body = [
		...(entity.enums ?? []).map(lowerAppEnum),
		selectorEnumSource,
		`export const ${entity.entityType} = entity({`,
			indent(`entityType: ${enumAccess('EntityType', entity.entityType)},`),
			indent('labels: {'),
			indent(`singular: ${emitTypeScript(entityLabel(entity))},`, 2),
			indent(`plural: ${emitTypeScript(entityLabelPlural(entity))},`, 2),
			indent('},'),
			...(entity.description == null ? [] : [indent(`description: ${emitTypeScript(entity.description)},`)]),
			`})({`,
			...entity.fields.flatMap((fieldDefinition) => lowerSchemaFieldEntry(fieldDefinition, indexes).map((line) => indent(line))),
			`})({`,
			indent('selectors: {'),
			...entity.selectors.flatMap((selector) => [
				indent(`${objectPropertyKey(selectorMemberName(selector))}: [`, 2),
				...selector.fields.map((fieldName) => indent(`${emitTypeScript(fieldName)},`, 3)),
				indent('],', 2),
			]),
			indent('},'),
			...(entity.facets == null || entity.facets.length === 0 ? [] : [
				'',
				indent('facets: {'),
				...entity.facets.flatMap((facetDefinition) => lowerSchemaFacetEntry(facetDefinition, indexes).map((line) => indent(line, 2))),
				indent('},'),
			]),
		`})`,
	]

	return tsFile(
		schemaModulePath(entity.entityType).replace(/^\$\//, 'src/'),
		{
			imports,
			body,
		}
	)
}

const lowerSchemaFieldEntry = (fieldDefinition: EntityField, indexes: LoweringIndexes) => [
	`${objectPropertyKey(fieldDefinition.name)}: {`,
	...lowerObject([
		['label', fieldDefinition.label == null ? undefined : emitTypeScript(fieldDefinition.label)],
		['labelPlural', fieldDefinition.labelPlural == null ? undefined : emitTypeScript(fieldDefinition.labelPlural)],
		['description', fieldDefinition.description == null ? undefined : emitTypeScript(fieldDefinition.description)],
		['type', enumAccess('EntityFieldType', fieldDefinition.type)],
		[
			'primitiveType',
			fieldDefinition.type === EntityFieldType.Primitive ?
				lowerValueTypeType((fieldDefinition.valueType == null ? undefined : indexes.valueTypeById[fieldDefinition.valueType])?.type ?? fieldDefinition.primitiveType)
			:
				undefined,
		],
		[
			'entityType',
			fieldDefinition.entityType == null ?
				undefined
			:
				enumAccess('EntityType', fieldDefinition.entityType),
		],
		['cardinality', enumAccess('EntityFieldCardinality', fieldDefinition.cardinality)],
		['defaultSources', lowerSourceArray(fieldDefinition.defaultSources)],
		['normalize', fieldDefinition.normalize],
	]).split('\n').slice(1, -1),
	'},',
]

const lowerSchemaFacetEntry = (
	facetDefinition: NonNullable<Entity['facets']>[number],
	indexes: LoweringIndexes
) => {
	const fieldStage = (facetDefinition.fields?.length ?? 0) === 0 ? [
		`${objectPropertyKey(facetDefinition.name)}: facet(${lowerFacetCondition(facetDefinition.condition)})({})`,
	] : [
		`${objectPropertyKey(facetDefinition.name)}: facet(${lowerFacetCondition(facetDefinition.condition)})({`,
		...(facetDefinition.fields ?? []).flatMap((fieldDefinition) => lowerSchemaFieldEntry(fieldDefinition, indexes).map((line) => indent(line))),
		'})',
	]
	const finalFieldStageLine = fieldStage[fieldStage.length - 1] ?? ''
	if ((facetDefinition.facets?.length ?? 0) === 0)
		return [
			...fieldStage.slice(0, -1),
			`${finalFieldStageLine},`,
		]

	return [
		...fieldStage.slice(0, -1),
		`${finalFieldStageLine}({`,
		indent('facets: {'),
		...facetDefinition.facets.flatMap((facet) => lowerSchemaFacetEntry(facet, indexes).map((line) => indent(line, 2))),
		indent('},'),
		'}),',
	]
}

const lowerSchemaIndexFile = (entityTypes: readonly string[]) => {
	const chunks = Array.from({
		length: Math.ceil(entityTypes.length / 50),
	}, (_value, index) => entityTypes.slice(index * 50, index * 50 + 50))
	const body = [
		...chunks.flatMap((chunk, index) => [
			`const schemaChunk${index} = [`,
			...chunk.map((entityType) => `\t${entityType}Schema,`),
			'] as const satisfies EntityDefinition[]',
			'',
		]),
		'export const schema = [',
		...chunks.map((_chunk, index) => `\t...schemaChunk${index},`),
		'] as const satisfies Schema',
		'export const schemaMeta = indexSchema(schema)',
		'export const entityDefinitionByType = schemaMeta.entityDefinitionByType',
		'',
		'export interface RegisteredEntityDefinitionByType {',
		...entityTypes.map((entityType) => `\treadonly [EntityType.${entityType}]: typeof ${entityType}Schema`),
		'}',
		'export type RegisteredEntityType = keyof RegisteredEntityDefinitionByType',
		'export type RegisteredSchema = typeof schema',
		'export type EntitySchemaFieldName<_EntityType extends RegisteredEntityType> = EntityFieldDefinitions<RegisteredEntityDefinitionByType[_EntityType]>[\'name\']',
	]

	return tsFile(
		'src/schema/index.ts',
		{
			imports: [
				{
					from: '$/schema/$schema.ts',
					names: ['indexSchema'],
					typeNames: [
						'EntityDefinition',
						'EntityFieldDefinitions',
						'Schema',
					],
				},
				{
					from: '$/schema/EntityType.ts',
					names: ['EntityType'],
				},
				...entityTypes.map((entityType) => ({
					from: schemaModulePath(entityType),
					names: [
						{
							name: entityType,
							alias: `${entityType}Schema`,
						},
					],
				})),
			],
			body,
		}
	)
}

const lowerSourceFile = (sourceNames: readonly string[]) => tsFile(
	'src/sources/Source.ts',
	{
		body: [
			lowerStringEnum('Source', sourceNames),
		],
	}
)

const lowerMarkdownTableCell = (value: string) => value
	.replaceAll('&', '&amp;')
	.replaceAll('|', '&#124;')
	.replaceAll('<', '&lt;')
	.replaceAll('>', '&gt;')
	.replaceAll('\n', '<br>')

const lowerMarkdownTable = (
	headings: readonly string[],
	rows: readonly (readonly string[])[]
) => [
	`| ${headings.join(' | ')} |`,
	`| ${headings.map(() => '---').join(' | ')} |`,
	...rows.map((row) => `| ${row.map(lowerMarkdownTableCell).join(' | ')} |`),
]

const lowerCompiledSourcesMarkdown = (sourcesMarkdown: SourcesMarkdownLoweringInput) => {
	const sourceBindingRows = sourcesMarkdown.sourceBindings.map((sourceBinding) => ({
		...sourceBinding,
		bindingNumber: String(sourceBinding.bindingIndex + 1),
	}))

	return [
		'# Blockhead Sources',
		'',
		'This file is generated from APP compiler-plane source metadata: the canonical provider, source, and binding declarations in `APP.ts`. Active source modules are neither imported nor read during generation.',
		'',
		'Provider/source identity, target, endpoint reality, protocol, API family, operation groups, delivery, credentials, and artifacts remain independent axes. Artifacts and generated clients are binding metadata. CORS is recorded per HTTP endpoint; proxy and live behavior are recorded as delivery.',
		'',
		`${sourcesMarkdown.sourceProviders.length} providers register ${sourcesMarkdown.sources.length} sources and ${sourceBindingRows.length} bindings.`,
		'',
		'## Providers',
		'',
		...lowerMarkdownTable(
			[
				'Provider',
				'Label',
			],
			sourcesMarkdown.sourceProviders.map((provider) => [
				provider.provider,
				provider.label,
			])
		),
		'',
		'## Sources',
		'',
		...lowerMarkdownTable(
			[
				'Source',
				'Provider',
				'Label',
			],
			sourcesMarkdown.sources.map((source) => [
				source.source,
				source.provider,
				source.label,
			])
		),
		'',
		'## Bindings',
		'',
		...lowerMarkdownTable(
			[
				'Binding',
				'Provider',
				'Source',
				'Target kind',
				'Target key',
				'Wire protocol',
				'API family',
				'Operation groups',
				'Delivery',
			],
			sourceBindingRows.map(({ binding, bindingNumber, provider, source }) => [
				bindingNumber,
				provider,
				String(source),
				binding.target.kind,
				binding.target.key,
				binding.wireProtocol,
				binding.apiFamily,
				binding.operationGroups.join(', '),
				binding.delivery,
			])
		),
		'',
		'## Endpoints',
		'',
		...lowerMarkdownTable(
			[
				'Binding',
				'Endpoint',
				'Kind',
				'Locator',
				'Origin',
				'CORS',
			],
			sourceBindingRows.flatMap(({ binding, bindingNumber }) => binding.endpoints.map((endpoint, index) => [
				bindingNumber,
				String(index + 1),
				endpoint.endpointKind,
				endpoint.locator,
				endpoint.origin ?? '',
				endpoint.corsEnabled == null ? '' : String(endpoint.corsEnabled),
			]))
		),
		'',
		'## Credentials',
		'',
		...lowerMarkdownTable(
			[
				'Binding',
				'Credential',
				'Scope',
				'Environment schema',
				'Keys',
			],
			sourceBindingRows.flatMap(({ binding, bindingNumber }) => binding.credentials.map((credential, index) => [
				bindingNumber,
				String(index + 1),
				credential.scope,
				credential.env == null ? 'no' : 'yes',
				(credential.keys ?? []).join(', '),
			]))
		),
		'',
		'## Artifacts',
		'',
		...lowerMarkdownTable(
			[
				'Binding',
				'Artifact',
				'Kind',
				'Path',
				'Generated',
				'Official URL',
				'Reference URL',
			],
			sourcesMarkdown.sourceArtifacts.map(({ artifact, artifactIndex, bindingIndex }) => [
				String(bindingIndex + 1),
				String(artifactIndex + 1),
				artifact.kind,
				artifact.path,
				artifact.generated ? 'yes' : 'no',
				artifact.officialUrl ?? '',
				artifact.referenceUrl ?? '',
			])
		),
	].join('\n')
}

export const renderSourcesMarkdown = ({ generatedFiles }: Pick<CompiledApp, 'generatedFiles'>) => {
	const sourcesMarkdown = generatedFiles.find((generatedFile) => generatedFile.path === 'SOURCES.md')
	if (sourcesMarkdown?.kind !== 'text')
		throw new Error('Compiled APP render IR does not contain SOURCES.md')

	return sourcesMarkdown.body.join('\n')
}

const lowerSourcesMarkdownFile = (sourcesMarkdown: SourcesMarkdownLoweringInput) => textFile('SOURCES.md', lines(lowerCompiledSourcesMarkdown(sourcesMarkdown)))

const lowerSourceBindingFile = () => tsFile(
	'src/sources/SourceBinding.ts',
	{
		imports: [
			{
				from: 'arktype',
				typeNames: ['Type'],
			},
			{
				from: '$/sources/Source.ts',
				typeNames: ['Source'],
			},
			{
				from: '$/sources/SourceProvider.ts',
				typeNames: ['SourceProvider'],
			},
			{
				from: '$/sources/$sources.ts',
				typeNames: ['SourcePublicEnv'],
			},
		],
		body: [
			lowerStringEnum('SourceTargetKind', Object.values(SourceTargetKind)),
			'',
			lowerStringEnum('SourceEndpointKind', Object.values(SourceEndpointKind)),
			'',
			lowerStringEnum('WireProtocol', Object.values(WireProtocol)),
			'',
			lowerStringEnum('ApiFamily', Object.values(ApiFamily)),
			'',
			lowerStringEnum('SourceOperationGroup', Object.values(SourceOperationGroup)),
			'',
			lowerStringEnum('SourceDelivery', Object.values(SourceDelivery)),
			'',
			lowerStringEnum('SourceCredentialScope', Object.values(SourceCredentialScope)),
			'',
			lowerStringEnum('SourceArtifactKind', Object.values(SourceArtifactKind)),
			'',
			...lines(`export type SourceTarget = {
	kind: SourceTargetKind
	key: string
}

export type SourceEndpoint = {
	endpointKind: SourceEndpointKind
	locator: string
	origin?: string
	corsEnabled?: boolean
}

type SourceArtifactBase = {
	kind: SourceArtifactKind
	path: string
	generated: boolean
}

export type SourceArtifact =
	| SourceArtifactBase & {
		kind: SourceArtifactKind.HandwrittenTypes
		referenceUrl?: string
		officialUrl?: never
	}
	| SourceArtifactBase & {
		kind: Exclude<SourceArtifactKind, SourceArtifactKind.HandwrittenTypes>
		officialUrl?: string
		referenceUrl?: never
	}

export type SourceCredentialRequirement = {
	scope: SourceCredentialScope
	env?: Type<SourcePublicEnv>
	keys?: readonly string[]
}

export type SourceServerCredentialInjection =
	| {
		header: {
			name: string
			prefix?: string
		}
		query?: never
		endpointTemplate?: never
	}
	| {
		query: {
			name: string
		}
		header?: never
		endpointTemplate?: never
	}
	| {
		endpointTemplate: {
			slot: string
		}
		header?: never
		query?: never
	}

export type SourceServerCredentialDefinition = {
	envKey: string
	injection: SourceServerCredentialInjection
}

export type SourceBinding = {
	provider: SourceProvider
	source: Source
	target: SourceTarget
	endpoints: readonly SourceEndpoint[]
	wireProtocol: WireProtocol
	apiFamily: ApiFamily
	operationGroups: readonly SourceOperationGroup[]
	delivery: SourceDelivery
	credentials: readonly SourceCredentialRequirement[]
	artifacts?: readonly SourceArtifact[]
	proxyId?: string
	serverCredentialId?: string
}`),
		],
	}
)

const lowerSourceBindingCompatibilityFile = () => tsFile(
	'src/sources/$sourceBindingCompatibility.ts',
	{
		imports: [{
			from: './SourceBinding.ts',
			names: [
				'ApiFamily',
				'SourceArtifactKind',
				'SourceEndpointKind',
				'SourceOperationGroup',
				'WireProtocol',
			],
		}],
		body: [
			'export const sourceBindingCompatibility = [',
			...sourceBindingCompatibility.map((compatibility) => indent(`${lowerObject([
				['wireProtocol', enumAccess('WireProtocol', compatibility.wireProtocol)],
				['apiFamilies', lowerArray(compatibility.apiFamilies.map((apiFamily) => enumAccess('ApiFamily', apiFamily)))],
				['endpointKinds', lowerArray(compatibility.endpointKinds.map((endpointKind) => enumAccess('SourceEndpointKind', endpointKind)))],
				['operationGroups', compatibility.operationGroups === true ? 'true' : lowerArray(compatibility.operationGroups.map((operationGroup) => enumAccess('SourceOperationGroup', operationGroup)))],
				['artifactKinds', compatibility.artifactKinds === true ? 'true' : lowerArray(compatibility.artifactKinds.map((artifactKind) => enumAccess('SourceArtifactKind', artifactKind)))],
			])},`)),
			'] as const',
		],
	}
)

const lowerSourceProviderFile = (sourceProviderNames: readonly string[]) => tsFile(
	'src/sources/SourceProvider.ts',
	{
		imports: [
			{
				from: 'arktype',
				typeNames: ['Type'],
			},
			{
				from: '$/sources/$sources.ts',
				typeNames: [
					'SourceDefinition',
					'SourceProviderDefinition as SourceProviderDefinitionTemplate',
					'SourcePublicEnv',
				],
			},
			{
				from: '$/sources/Source.ts',
				typeNames: ['Source'],
			},
			{
				from: '$/sources/SourceBinding.ts',
				typeNames: ['SourceBinding'],
			},
		],
		body: [
			'export type SourceOrigin = {',
			'\torigin: string',
			'\tcorsEnabled: boolean',
			'}',
			'',
			'export type SourceProviderDefinition = SourceProviderDefinitionTemplate<SourceProvider, Source> & {',
			'\tenv?: Type<SourcePublicEnv>',
			'\tsources: readonly SourceDefinition<SourceProvider, Source>[]',
			'\tbindings: readonly SourceBinding[]',
			'\torigins?: readonly SourceOrigin[]',
			'}',
			'',
			lowerStringEnum('SourceProvider', sourceProviderNames),
		],
	}
)

const lowerEnvSchema = (env: App['sources']['providers'][number]['env']) => (
	env == null ?
		undefined
	: env.keys.length === 0 ?
		`arktype({\n\t'[string]': 'string',\n})`
	:
		`arktype({\n${env.keys.map((key) => `\t${emitTypeScript(key.name)}: ${emitTypeScript(key.type)},`).join('\n')}\n})`
)

const lowerSourceDefinition = (source: Pick<App['sources']['sources'][number], 'provider' | 'source' | 'label' | 'env'>) => lowerObject([
	['provider', enumAccess('SourceProvider', source.provider)],
	['source', enumAccess('Source', source.source)],
	['label', emitTypeScript(source.label)],
	['env', lowerEnvSchema(source.env)],
])

const lowerSourceBinding = (
	provider: string,
	source: string,
	binding: NonNullable<App['sources']['sources'][number]['binding']>,
	bindingIndex: number
) => lowerObject([
	['provider', enumAccess('SourceProvider', provider)],
	['source', enumAccess('Source', source)],
	['target', lowerObject([
		['kind', enumAccess('SourceTargetKind', binding.target.kind)],
		['key', emitTypeScript(binding.target.key)],
	])],
	['endpoints', lowerArray(binding.endpoints.map((endpoint) => lowerObject([
		['endpointKind', enumAccess('SourceEndpointKind', endpoint.endpointKind)],
		['locator', emitTypeScript(endpoint.locator)],
		['origin', endpoint.origin == null ? undefined : emitTypeScript(endpoint.origin)],
		['corsEnabled', endpoint.corsEnabled == null ? undefined : String(endpoint.corsEnabled)],
	])))],
	['wireProtocol', enumAccess('WireProtocol', binding.wireProtocol)],
	['apiFamily', enumAccess('ApiFamily', binding.apiFamily)],
	['operationGroups', lowerArray(binding.operationGroups.map((group) => enumAccess('SourceOperationGroup', group)))],
	['delivery', enumAccess('SourceDelivery', binding.delivery)],
	['credentials', lowerArray(binding.credentials.map((credential) => lowerObject([
		['scope', enumAccess('SourceCredentialScope', credential.scope)],
		['env', 'envKey' in credential ? undefined : lowerEnvSchema(credential.env)],
		['keys', 'envKey' in credential || credential.keys == null ? undefined : lowerArray(credential.keys.map(emitTypeScript))],
	])))],
	['proxyId', binding.delivery === SourceDelivery.HttpProxy ? emitTypeScript(`${source}-${bindingIndex}`) : undefined],
	['serverCredentialId', binding.credentials.some((credential) => (
		credential.scope === SourceCredentialScope.RuntimeSecret
		&& 'envKey' in credential
	)) ? emitTypeScript(`${source}-${bindingIndex}`) : undefined],
	['artifacts', binding.artifacts == null ? undefined : lowerArray(binding.artifacts.map((artifact) => lowerObject([
		['kind', enumAccess('SourceArtifactKind', artifact.kind)],
		['path', emitTypeScript(artifact.path)],
		['generated', String(artifact.generated)],
		['officialUrl', artifact.officialUrl == null ? undefined : emitTypeScript(artifact.officialUrl)],
		['referenceUrl', artifact.referenceUrl == null ? undefined : emitTypeScript(artifact.referenceUrl)],
	])))],
])

const lowerSourceProvidersFile = (sourceProviderPlans: readonly CompiledSourceProviderFacts[]) => tsFile(
	'src/sources/$sourceProviders.ts',
	{
		imports: [
			{
				from: 'arktype',
				names: [{
					name: 'type',
					alias: 'arktype',
				}],
			},
			{
				from: './Source.ts',
				names: ['Source'],
			},
			{
				from: './SourceBinding.ts',
				names: [
					'ApiFamily',
					'SourceArtifactKind',
					'SourceCredentialScope',
					'SourceDelivery',
					'SourceEndpointKind',
					'SourceOperationGroup',
					'SourceTargetKind',
					'WireProtocol',
				],
			},
			{
				from: './SourceProvider.ts',
				names: ['SourceProvider'],
				typeNames: ['SourceProviderDefinition'],
			},
		],
		body: [
			'export const sourceProviderDefinitions: readonly SourceProviderDefinition[] = [',
			...sourceProviderPlans.map(({ provider, sources, bindings, origins }) => {
				return indent(`${lowerObject([
					['provider', enumAccess('SourceProvider', provider.provider)],
					['label', emitTypeScript(provider.label)],
					['env', lowerEnvSchema(provider.env)],
					['sources', lowerArray(sources.map(lowerSourceDefinition))],
					['bindings', lowerArray(bindings.map(({ binding, bindingIndex, provider, source }) => lowerSourceBinding(provider, String(source), binding, bindingIndex)))],
					['origins', provider.origins !== true || origins.length === 0 ? undefined : lowerArray(origins.map((origin) => lowerObject([
						['origin', emitTypeScript(origin.origin)],
						['corsEnabled', String(origin.corsEnabled)],
					])))],
				])},`)
			}),
			']',
			'',
			'export const sourceProviders = sourceProviderDefinitions',
		],
	}
)

const lowerSourceServerCredentialsFile = (
	sourceBindings: readonly SourceBindingEntry[]
) => tsFile(
	'src/sources/$sourceServerCredentials.server.ts',
	{
		imports: [{
			from: '$/sources/SourceBinding.ts',
			typeNames: ['SourceServerCredentialDefinition'],
		}],
		body: [
			'export const sourceServerCredentialsById = {',
			...sourceBindings.flatMap(({ binding, bindingIndex, source }) => {
				const runtimeSecret = binding.credentials.find((credential) => (
					credential.scope === SourceCredentialScope.RuntimeSecret
					&& 'envKey' in credential
				))
				if (runtimeSecret == null)
					return []

				return [indent(`${emitTypeScript(`${source}-${bindingIndex}`)}: ${lowerObject([
					['envKey', emitTypeScript(runtimeSecret.envKey)],
					['injection', emitTypeScript({
						kind: 'value',
						value: runtimeSecret.injection,
					})],
				])},`)]
			}),
			'} as const satisfies Readonly<Record<string, SourceServerCredentialDefinition>>',
		],
	}
)

const lowerSourceSelectionsFile = (sourceSelections: readonly NamedSourceSelectionPlan[]) => tsFile(
	'src/sources/$sourceSelections.ts',
	{
		imports: [
			{
				from: '$/sources/Source.ts',
				names: ['Source'],
			},
		],
		body: sourceSelections.flatMap(({ selection, defaultSourcesName, selectionByKeyName }) => [
				`export const ${defaultSourcesName} = ${lowerSourceArray(selection.default)}`,
				'',
				`export const ${selectionByKeyName}: Record<string, readonly Source[]> = ${lowerSourceSelectionByKey(selection)}`,
				'',
			]),
	}
)

const lowerNavigationItemFile = () => tsFile(
	'src/routes/NavigationItem.ts',
	{
		body: [
			'export type NavigationItem = {',
			'\tid: string',
			'\ttitle: string',
			'\ticon?: string',
			'\taddress?: {',
			'\t\tnetwork?: { chainId: number }',
			'\t\taddress: `0x${string}`',
			'\t}',
			'\thref?: string',
			'\ttag?: string',
			'\ttagIcon?: string',
			'\tdefaultIsOpen?: boolean',
			'\tmanualWatch?: boolean',
			'\tchildren?: NavigationItem[]',
			'\tallChildren?: NavigationItem[]',
			'}',
		],
	}
)

const lowerNavigationItemsFile = (navigationItems: readonly App['navigation']['items'][number][]) => tsFile(
	'src/routes/navigationItems.svelte.ts',
	{
		imports: [
			{
				from: '$/routes/NavigationItem.ts',
				typeNames: ['NavigationItem'],
			},
		],
		body: [
			`export const navigationItems = ${emitTypeScript({
				kind: 'value',
				value: navigationItems,
			})} satisfies NavigationItem[]`,
		],
	}
)

const lowerSourcesIndexFile = () => tsFile(
	'src/sources/index.ts',
	{
		imports: [
			{
				from: '$env/dynamic/public',
				names: ['env as publicEnv'],
			},
			{
				from: '$/sources/Source.ts',
				names: ['Source'],
			},
			{
				from: '$/sources/SourceProvider.ts',
				typeNames: ['SourceProviderDefinition'],
			},
			{
				from: '$/sources/SourceBinding.ts',
				names: [
					'SourceCredentialScope',
					'SourceDelivery',
				],
				typeNames: ['SourceBinding'],
			},
			{
				from: '$/sources/$sourceProviders.ts',
				names: [
					'sourceProviderDefinitions',
					'sourceProviders',
				],
			},
			{
				from: '$/sources/$sources.ts',
				names: [
					'enabledSourcesFromBindings',
					'indexSourceProviders',
				],
				typeNames: ['SourceDefinition as SourceDefinitionTemplate'],
			},
			{
				from: '$/sources/validateSourceBindings.ts',
				names: ['validateSourceBindings'],
			},
		],
		body: [
			'export {',
			'\tSource,',
			'\tsourceProviders,',
			'}',
			'',
			'export type SourceDefinition = SourceDefinitionTemplate<SourceProviderDefinition[\'provider\'], Source>',
			'',
			'export type { SourcePublicEnv } from \'$/sources/$sources.ts\'',
			'',
			'const browserDeliveries = new Set([',
			'\tSourceDelivery.BrowserDirect,',
			'\tSourceDelivery.HttpProxy,',
			'\tSourceDelivery.RemoteQuery,',
			'\tSourceDelivery.RemoteLive,',
			'])',
			'',
			'export const sourceBindings = validateSourceBindings(',
			'\tsourceProviderDefinitions.flatMap((provider) => provider.bindings)',
			'\t\t.filter((binding) => (',
			'\t\t\tbrowserDeliveries.has(binding.delivery)',
			'\t\t\t&& (',
			'\t\t\t\tbinding.delivery === SourceDelivery.RemoteQuery',
			'\t\t\t\t|| binding.delivery === SourceDelivery.RemoteLive',
			'\t\t\t\t|| binding.credentials.every((credential) => (',
			'\t\t\t\t\tcredential.scope === SourceCredentialScope.None',
			'\t\t\t\t\t|| credential.scope === SourceCredentialScope.PublicConfig',
			'\t\t\t\t\t|| credential.scope === SourceCredentialScope.UserDelegated',
			'\t\t\t\t\t|| (',
			'\t\t\t\t\t\tbinding.delivery === SourceDelivery.HttpProxy',
			'\t\t\t\t\t\t&& credential.scope === SourceCredentialScope.RuntimeSecret',
			'\t\t\t\t\t)',
			'\t\t\t\t))',
			'\t\t\t)',
			'\t\t))',
			') satisfies readonly SourceBinding[]',
			'',
			'export const sources = sourceProviderDefinitions.flatMap((provider) => provider.sources)',
			'',
			'export const enabledSources = enabledSourcesFromBindings<Source>(sourceBindings)',
			'',
			'export const {',
			'\tresolverPublicEnvBySource,',
			'} = indexSourceProviders(sourceProviders, publicEnv)',
		],
	}
)

const lowerSourcesServerIndexFile = () => tsFile(
	'src/sources/index.server.ts',
	{
		imports: [
			{
				from: '$env/dynamic/private',
				names: ['env as privateEnv'],
			},
			{
				from: '$/sources/SourceBinding.ts',
				names: [
					'SourceDelivery',
					'SourceEndpointKind',
					'SourceCredentialScope',
				],
				typeNames: ['SourceBinding'],
			},
			{
				from: '$/sources/$sourceServerCredentials.server.ts',
				names: ['sourceServerCredentialsById'],
			},
			{
				from: '$/sources/$sourceProviders.ts',
				names: ['sourceProviderDefinitions'],
			},
			{
				from: '$/sources/validateSourceBindings.ts',
				names: ['validateSourceBindings'],
			},
		],
		body: [
			'export const sourceBindings = validateSourceBindings(',
			'\tsourceProviderDefinitions.flatMap((provider) => provider.bindings)',
			') satisfies readonly SourceBinding[]',
			'',
			'export const enabledSourceBindings = sourceBindings.filter((binding) => (',
			'\tbinding.credentials.every((credential) => (',
			'\t\tcredential.scope === SourceCredentialScope.None',
			'\t\t|| credential.scope === SourceCredentialScope.PublicConfig',
			'\t\t|| credential.scope === SourceCredentialScope.UserDelegated',
			'\t\t|| (',
			'\t\t\tcredential.scope === SourceCredentialScope.RuntimeSecret',
			'\t\t\t&& (',
			'\t\t\t\tbinding.serverCredentialId == null ?',
			'\t\t\t\t\tcredential.keys != null',
			'\t\t\t\t\t&& credential.keys.every((key) => (privateEnv[key]?.trim() ?? \'\') !== \'\')',
			'\t\t\t\t:',
			'\t\t\t\t\tObject.entries(sourceServerCredentialsById).some(([serverCredentialId, definition]) => (',
			'\t\t\t\t\t\tserverCredentialId === binding.serverCredentialId',
			'\t\t\t\t\t\t&& (privateEnv[definition.envKey]?.trim() ?? \'\') !== \'\'',
			'\t\t\t\t\t))',
			'\t\t\t)',
			'\t\t)',
			'\t\t|| (',
			'\t\t\tcredential.scope !== SourceCredentialScope.RuntimeSecret',
			'\t\t\t&& (',
			'\t\t\t\tcredential.keys == null',
			'\t\t\t\t|| credential.keys.every((key) => (privateEnv[key]?.trim() ?? \'\') !== \'\')',
			'\t\t\t)',
			'\t\t)',
			'\t))',
			'))',
			'',
			'export const enabledSources = new Set(',
			'\tenabledSourceBindings.map((binding) => binding.source)',
			')',
			'',
			'export const httpProxyOrigins = new Set(',
			'\tenabledSourceBindings',
			'\t\t.filter((binding) => binding.delivery === SourceDelivery.HttpProxy)',
			'\t\t.flatMap((binding) => binding.endpoints)',
			'\t\t.filter((endpoint) => endpoint.endpointKind === SourceEndpointKind.HttpUrl)',
			'\t\t.flatMap((endpoint) => endpoint.origin == null ? [] : [endpoint.origin])',
			')',
			'',
			'export const httpProxyBindingByProxyId = new Map(',
			'\tenabledSourceBindings',
			'\t\t.filter((binding) => binding.delivery === SourceDelivery.HttpProxy)',
			'\t\t.map((binding) => [binding.proxyId, binding] as const)',
			')',
			'',
			'export const remoteLiveBindings = enabledSourceBindings.filter((binding) => (',
			'\tbinding.delivery === SourceDelivery.RemoteLive',
			'))',
		],
	}
)

const lowerOfficialArtifactsFile = (officialSourceArtifacts: readonly OfficialSourceArtifactEntry[]) => {
	return tsFile(
		'src/sources/officialArtifacts.ts',
		{
			imports: [
				{
					from: '$/sources/Source.ts',
					names: ['Source'],
				},
				{
					from: '$/sources/SourceBinding.ts',
					names: ['SourceArtifactKind'],
				},
			],
			body: [
				`export const officialSourceArtifacts = ${lowerArray(officialSourceArtifacts.map(({ artifact, officialUrl, source }) => lowerObject([
					['source', `Source.${source}`],
					['artifactKind', `SourceArtifactKind.${artifact.kind}`],
					['localPath', emitTypeScript(artifact.path)],
					['officialUrl', emitTypeScript(officialUrl)],
				])))} as const`,
			],
		}
	)
}

const lowerResolverIndexFile = (resolverModules: readonly App['resolvers']['modules'][number][]) => tsFile(
	'src/resolvers/index.ts',
	{
		imports: [
			{
				from: '$/resolvers/$resolvers.ts',
				typeNames: ['SourceResolverModule'],
			},
			{
				from: '$/schema/index.ts',
				typeNames: ['schema'],
			},
			{
				from: '$/sources/Source.ts',
				typeNames: ['Source'],
			},
		],
		body: [
			'const resolverModuleByPath = import.meta.glob<SourceResolverModule<typeof schema, Source>>(',
			'\t[',
			...resolverModules.map((module) => `\t\t${emitTypeScript(module.path.replace(/^src\/resolvers\//, './'))},`),
			'\t],',
			'\t{',
			'\t\teager: true,',
			`\t\timport: 'default',`,
			'\t}',
			')',
			'',
			'export const resolvers = Object.values(resolverModuleByPath)',
		],
	}
)

const viewFieldReferences = (entity: Entity, indexes: LoweringIndexes) => [...new Map([
	...entity.selectors.flatMap((selector) => selector.fields),
	...viewItems(entitySingularView(entity)?.summary?.icon).flatMap((viewEntry) => itemFieldReferences(viewEntry)),
	...viewItems(entitySingularView(entity)?.summary?.title).flatMap((viewEntry) => itemFieldReferences(viewEntry)),
	...viewItems(entitySingularView(entity)?.summary?.value).flatMap((viewEntry) => itemFieldReferences(viewEntry)),
	...viewItems(entitySingularView(entity)?.summary?.titleFallback).flatMap((viewEntry) => itemFieldReferences(viewEntry)),
	...viewItems(entitySingularView(entity)?.summary?.HeadingAfter).flatMap((viewEntry) => itemFieldReferences(viewEntry)),
	...contentDlGroups(entity, indexes).flatMap((viewEntries) => viewEntries.flatMap((viewEntry) => itemFieldReferences(viewEntry))),
	...(singularViewContent(entitySingularView(entity))?.body == null ? [] : [entitySingularView(entity).content.body.field]),
	...(singularViewContent(entitySingularView(entity))?.blocks ?? []).flatMap((viewEntries) => viewEntries.flatMap((viewEntry) => itemFieldReferences(viewEntry))),
	...(singularViewDetails(entitySingularView(entity))?.body == null ? [] : [entitySingularView(entity).details.body.field]),
	...(singularViewDetails(entitySingularView(entity))?.tabs ?? []).flatMap((group) => (group.items ?? []).flatMap((viewEntry) => itemFieldReferences(viewEntry))),
	...(entitySingularView(entity)?.carousels ?? []).flatMap((group) => group.sections.flatMap((section) => (section.items ?? []).flatMap((viewEntry) => itemFieldReferences(viewEntry)))),
].map((fieldReference) => [fieldReferenceKey(fieldReference), fieldReference])).values()]

const entitySelectorFieldNames = (entity: Entity) => new Set(entity.selectors.flatMap((selector) => selector.fields))

const entitySelectorOwnsField = (entity: Entity, fieldReference: FieldReference) => (
	!isProjectionFieldReference(fieldReference)
	&& entity.selectors.every((selector) => selector.fields.includes(fieldReference))
)

const pendingEntityExpression = 'pendingEntity'

const resolvedEntityExpression = 'resolvedEntity'

const pendingEntitySurfaceExpression = '({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched })'

const resolvedEntitySurfaceExpression = `{ ...${pendingEntityExpression}, ...entity }`

const lowerPendingEntityDerived = (entity: Entity) => (
	entitySingularView(entity)?.pending == null ?
		[
			`const ${pendingEntityExpression} = $derived(${pendingEntitySurfaceExpression})`,
		]
	:
		[
			`const ${pendingEntityExpression} = $derived(`,
			...reindentLines(lines(entitySingularView(entity).pending.expression.replace(/^\n/, '').replace(/\n[\t ]*$/, '')), 1),
			')',
		]
)

const pendingFieldExpression = (_entity: Entity, fieldName: string) => (
	fieldExpression(pendingEntityExpression, fieldName)
)

const resolvedFieldExpression = (fieldName: string) => (
	fieldExpression(resolvedEntityExpression, fieldName)
)

const viewFieldExpression = (entity: Entity, entityFieldsExpression: string, fieldName: string) => (
	entityFieldsExpression === pendingEntityExpression ?
		pendingFieldExpression(entity, fieldName)
	: entityFieldsExpression === resolvedEntityExpression ?
		resolvedFieldExpression(fieldName)
	:
		fieldExpression(entityFieldsExpression, fieldName)
)

const viewResolvedFieldReferences = (entity: Entity, indexes: LoweringIndexes) => {
	const selectorFieldNames = entitySelectorFieldNames(entity)

	return viewFieldReferences(entity, indexes).filter((fieldReference) => (
		isProjectionFieldReference(fieldReference) || !selectorFieldNames.has(fieldReference)
	))
}

const viewItems = (viewEntries: _ViewItem[] | _ViewItem | undefined): _ViewItem[] => (
	viewEntries == null ?
		[]
	: isProjectionFieldReference(viewEntries) ?
		[viewEntries]
	: Array.isArray(viewEntries) ?
		viewEntries
	:
		[viewEntries]
)

const itemFieldReferences = (viewEntry: _ViewItem): FieldReference[] => {
	if (typeof viewEntry === 'string')
		return [viewEntry]
	if (isProjectionFieldReference(viewEntry))
		return [viewEntry]
	if ('fields' in viewEntry && viewEntry.fields != null)
		return viewEntry.fields
	if ('field' in viewEntry)
		return [viewEntry.field]

	return []
}

const entityFields = (entity: Entity) => [
	...entity.fields,
	...(() => {
		const facets = [...(entity.facets ?? [])]
		const fields: EntityField[] = []
		for (const facet of facets) {
			fields.push(...(facet.fields ?? []))
			facets.push(...(facet.facets ?? []))
		}

		return fields
	})(),
]

const fieldDefinitionByReference = (
	entity: Entity,
	field: FieldReference,
	indexes?: Pick<LoweringIndexes, 'entityFacetByPath'>
) => {
	if (!isProjectionFieldReference(field))
		return entity.fields.find((fieldDefinition) => fieldDefinition.name === field)
	if (indexes == null)
		throw new Error(`${entity.entityType} projected field ${field.join('.')} requires compiled facet metadata`)

	return indexes.entityFacetByPath[projectionPathKey(entity.entityType, field.slice(0, -1))]?.facet.fields?.find((fieldDefinition) => (
		fieldDefinition.name === field.at(-1)
	))
}

const fieldValueType = (indexes: LoweringIndexes, fieldDefinition: EntityField) => (
	fieldDefinition.valueType == null ? undefined : indexes.valueTypeById[fieldDefinition.valueType]
)

const fieldValueTypeType = (indexes: LoweringIndexes, fieldDefinition: EntityField) => (
	fieldValueType(indexes, fieldDefinition)?.type ?? fieldDefinition.primitiveType
)

const fieldHasDisplayExpression = (indexes: LoweringIndexes, fieldDefinition: EntityField) => (
	fieldValueType(indexes, fieldDefinition)?.displayExpression != null
)

const fieldNeedsExplicitDisplayExpression = (indexes: LoweringIndexes, fieldDefinition: EntityField) => {
	const valueTypeType = fieldValueTypeType(indexes, fieldDefinition)

	return (
		valueTypeTypeIsStructured(valueTypeType)
		|| valueTypeType != null && 'primitive' in valueTypeType && valueTypeType.primitive === 'unknown'
	) && !fieldHasDisplayExpression(indexes, fieldDefinition)
}

const textExpression = (valueExpression: string) => {
	return `String((${valueExpression}) ?? '')`
}

const lowerDisplayExpression = (entity: Entity, indexes: LoweringIndexes, fieldReference: FieldReference, valueExpression: string) => {
	const fieldDefinition = fieldDefinitionByReference(entity, fieldReference, indexes)
	const fieldName = fieldNameForReference(fieldReference)
	const valueType = fieldDefinition == null ? undefined : fieldValueType(indexes, fieldDefinition)
	const expression = valueType?.displayExpression

	if (expression == null) {
		const valueTypeType = fieldDefinition == null ? undefined : fieldValueTypeType(indexes, fieldDefinition)
		if (
			valueTypeTypeIsStructured(valueTypeType)
			|| valueTypeType != null && 'primitive' in valueTypeType && valueTypeType.primitive === 'unknown'
			)
				throw new Error(`${entity.entityType}.${fieldName} needs a valueType displayExpression before it can be rendered`)

			if (fieldDefinition?.cardinality === EntityFieldCardinality.Many || fieldDefinition?.cardinality === EntityFieldCardinality.ZeroOrMany)
				return `${valueExpression}.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')`

			return textExpression(valueExpression)
		}

	if (!/\bvalue\b/.test(expression))
		return textExpression(expression)

	if (fieldDefinition?.cardinality === EntityFieldCardinality.Many || fieldDefinition?.cardinality === EntityFieldCardinality.ZeroOrMany)
		return `${valueExpression}.values.map((value) => ${textExpression(expression)}).filter(Boolean).join(', ')`

	return `${valueExpression} == null ? '' : ${textExpression(expression.replace(/(?<!\.)\bvalue\b/g, `(${valueExpression})`))}`
}

const viewItemFormat = (entity: Entity, indexes: LoweringIndexes, viewEntry: _ViewItem) => {
	const fieldReference = itemFieldReferences(viewEntry)[0]
	if (fieldReference == null)
		return undefined
	if (typeof viewEntry === 'object' && 'format' in viewEntry && viewEntry.format != null)
		return viewEntry.format

	const fieldDefinition = fieldDefinitionByReference(entity, fieldReference, indexes)
	if (fieldDefinition == null)
		return undefined

	const valueTypeFormat = fieldValueType(indexes, fieldDefinition)?.format
	if (valueTypeFormat != null)
		return valueTypeFormat

	if (fieldDefinition.valueType === 'boolean')
		return 'boolean'
	if (/timestampMs$|TimestampMs$/.test(fieldDefinition.name))
		return 'timestamp'
	if (/url|uri/i.test(fieldDefinition.name))
		return 'url'
	if (/address|hash|digest|signature|credential|issuer|account/i.test(fieldDefinition.name))
		return 'truncated'

	return undefined
}

const lowerMappedDisplayExpression = (
	entity: Entity,
	indexes: LoweringIndexes,
	viewEntry: _ViewItem,
	fieldReference: FieldReference,
	valueExpression: string
) => {
	const baseExpression = lowerDisplayExpression(entity, indexes, fieldReference, valueExpression)
	if (typeof viewEntry !== 'object' || !('field' in viewEntry) || viewEntry.enumConstantMap == null)
		return baseExpression

	return textExpression(`${viewEntry.enumConstantMap}[String(${valueExpression})]?.${viewEntry.enumConstantProperty ?? 'label'} ?? (${baseExpression})`)
}

const lowerItemHrefExpression = (viewEntry: _ViewItem, fieldValuesExpression: string) => (
	typeof viewEntry === 'object' && 'link' in viewEntry && viewEntry.link != null ?
		(
			viewEntry.link.href.includes('(') ?
				lowerRouteResolveExpression
			:
				lowerResolveExpression
		)(
			viewEntry.link.href,
			(viewEntry.link.params ?? []).map((param) => [
				param.param,
				viewEntry.link?.href.includes('(') === true ?
					lowerRouteParamValueExpression(param.value, fieldValuesExpression)
				:
					lowerAppExpression(param.value, {
						fields: fieldValuesExpression,
					}),
			])
		)
	:
		undefined
)

const wrapWhen = (viewEntry: _ViewItem, openExpression: string, source: string[]) => {
	const when = typeof viewEntry === 'object' && 'when' in viewEntry ? viewEntry.when : undefined
	if (when == null || when === 'always')
		return source

	return [
		`${'\t'.repeat(source[0]?.match(/^\t*/)?.[0].length ?? 0)}{#if ${when === 'open' ? openExpression : `!${openExpression}`}}`,
		...source.map((line) => indent(line)),
		`${'\t'.repeat(source[0]?.match(/^\t*/)?.[0].length ?? 0)}{/if}`,
	]
}

const lowerValueMarkup = (
	entity: Entity,
	indexes: LoweringIndexes,
	viewEntry: _ViewItem,
	fieldReference: FieldReference,
	valueExpression: string,
	fieldValuesExpression: string,
	level: number
) => {
	const format = viewItemFormat(entity, indexes, viewEntry)
	const displayExpression = lowerMappedDisplayExpression(entity, indexes, viewEntry, fieldReference, valueExpression)
	const hrefExpression = lowerItemHrefExpression(viewEntry, fieldValuesExpression)
	const valueMarkup = (
		format === 'timestamp' || format === 'dateTime' ?
			[
				`${'\t'.repeat(level)}<Timestamp timestamp={Number(${valueExpression})} />`,
			]
		: format === 'number' || format === 'numberValue' ?
			[
				`${'\t'.repeat(level)}<NumberValue value={Number(${valueExpression})} />`,
			]
		: format === 'currency' || format === 'currencyScaled' ?
			[
				`${'\t'.repeat(level)}<NumberValue`,
				`${'\t'.repeat(level + 1)}value={Number(${valueExpression})${format === 'currencyScaled' ? ' / 1e8' : ''}}`,
				`${'\t'.repeat(level + 1)}formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}`,
				`${'\t'.repeat(level)}/>`,
			]
			: format === 'percent' ?
				[
					`${'\t'.repeat(level)}<NumberValue`,
					`${'\t'.repeat(level + 1)}value={Number(${valueExpression})}`,
					`${'\t'.repeat(level + 1)}options={{ style: 'percent' }}`,
					`${'\t'.repeat(level)}/>`,
				]
			: format === 'boolean' ?
				[
					`${'\t'.repeat(level)}{${valueExpression} ? 'Yes' : 'No'}`,
				]
			: format === 'stringList' ?
				[
					`${'\t'.repeat(level)}{${valueExpression}.map((value) => String(value ?? '')).filter(Boolean).join(', ')}`,
				]
		: format === 'truncated' || format === 'namespaceReference' || format === 'address' ?
			[
				`${'\t'.repeat(level)}<TruncatedValue value={${format === 'address' ? `String(${valueExpression})` : displayExpression}} />`,
			]
		: format === 'url' ?
			[
				`${'\t'.repeat(level)}<svelte:element`,
				`${'\t'.repeat(level + 1)}this={'a'}`,
				`${'\t'.repeat(level + 1)}href={String(${valueExpression})}`,
				`${'\t'.repeat(level + 1)}target="_blank"`,
				`${'\t'.repeat(level + 1)}rel="noreferrer noopener"`,
				`${'\t'.repeat(level)}>`,
				`${'\t'.repeat(level + 1)}<TruncatedValue value={String(${valueExpression})} />`,
				`${'\t'.repeat(level)}</svelte:element>`,
			]
		: format === 'markdown' ?
			[
				`${'\t'.repeat(level)}<Markdown content={String(${valueExpression})} />`,
			]
		: format === 'longText' ?
			[
				`${'\t'.repeat(level)}<span data-text="long-text">{${displayExpression}}</span>`,
			]
		: format === 'bodyLongText' ?
			[
				`${'\t'.repeat(level)}<p data-text="long-text">{${displayExpression}}</p>`,
			]
		: format === 'bodyText' ?
			[
				`${'\t'.repeat(level)}<p>{${displayExpression}}</p>`,
			]
		: format === 'code' ?
			[
				`${'\t'.repeat(level)}<code>{${displayExpression}}</code>`,
			]
		:
			[
				`${'\t'.repeat(level)}{${displayExpression}}`,
			]
	)
	const prefixedValueMarkup = [
		...(typeof viewEntry === 'object' && 'field' in viewEntry && viewEntry.prefix != null ? [
			`${'\t'.repeat(level)}<span>${svelteText(viewEntry.prefix)}</span>`,
		] : []),
		...valueMarkup,
		...(typeof viewEntry === 'object' && 'field' in viewEntry && viewEntry.suffix != null ? [
			`${'\t'.repeat(level)}<span>${svelteText(viewEntry.suffix)}</span>`,
		] : []),
	]

	if (hrefExpression == null || format === 'url')
		return prefixedValueMarkup

	return [
		`${'\t'.repeat(level)}<a`,
		lowerSvelteAttribute(level + 1, 'href', hrefExpression),
		`${'\t'.repeat(level)}>`,
		...prefixedValueMarkup.map((line) => indent(line)),
		`${'\t'.repeat(level)}</a>`,
	]
}

const lowerItemExpression = (entity: Entity, indexes: LoweringIndexes, viewEntry: _ViewItem, entityFieldsExpression: string) => {
	if (typeof viewEntry === 'string') {
		if (fieldDefinitionByReference(entity, viewEntry, indexes)?.type === EntityFieldType.EntityReference)
			return emitTypeScript('')

		return lowerDisplayExpression(entity, indexes, viewEntry, viewFieldExpression(entity, entityFieldsExpression, viewEntry))
	}
	if ('kind' in viewEntry && viewEntry.kind === 'Text')
		return emitTypeScript(viewEntry.value ?? viewEntry.label)
	if (!('field' in viewEntry))
		return emitTypeScript('')

	if (fieldDefinitionByReference(entity, viewEntry.field, indexes)?.type === EntityFieldType.EntityReference)
		return emitTypeScript('')

	const fieldValue = viewFieldExpression(entity, entityFieldsExpression, viewEntry.field)
	const displayed = lowerMappedDisplayExpression(entity, indexes, viewEntry, viewEntry.field, fieldValue)
	const value = viewEntry.prefix == null && viewEntry.suffix == null ?
		displayed
	:
		`(${displayed} ? ${[
			viewEntry.prefix == null ? undefined : emitTypeScript(viewEntry.prefix),
			displayed,
			viewEntry.suffix == null ? undefined : emitTypeScript(viewEntry.suffix),
		].filter((part): part is string => part != null).join(' + ')} : '')`
	if (viewEntry.valuePrefix == null)
		return value

	return `[
		${lowerJoinedItemsExpression(entity, indexes, viewEntry.valuePrefix, entityFieldsExpression, '')},
		${value},
	].filter(Boolean).join(${emitTypeScript(viewEntry.valuePrefixSeparator ?? ' ')})`
}

const lowerJoinedItemsExpression = (
	entity: Entity,
	indexes: LoweringIndexes,
	viewEntries: readonly _ViewItem[],
	entityFieldsExpression: string,
	separator = ' '
) => {
	if (viewEntries.length === 0)
		return 'undefined'

	const expressions = viewEntries
		.map((viewEntry) => lowerItemExpression(entity, indexes, viewEntry, entityFieldsExpression))
		.filter((expression) => expression !== emitTypeScript(''))
	if (expressions.length === 0)
		return 'undefined'

	return `[${expressions.join(', ')}].filter(Boolean).join(${emitTypeScript(separator)})`
}

const lowerFirstDeclaredExpression = (expressions: readonly (string | undefined)[]) => {
	const filtered = unique(expressions.filter((expression): expression is string => expression != null && expression !== 'undefined'))
	return filtered.length === 0 ? 'undefined' : filtered.join(' || ')
}

const viewItemTree = (viewEntries: readonly _ViewItem[]): _ViewItem[] => viewEntries.flatMap((viewEntry) => [
	viewEntry,
	...(typeof viewEntry === 'object' && 'field' in viewEntry ? viewItemTree(viewItems(viewEntry.valuePrefix)) : []),
])

const summarySerial = (entity: Entity) => entitySingularView(entity)?.summary?.serial

const summarySerialItems = (entity: Entity) => {
	const serial = summarySerial(entity)
	if (serial == null)
		return []

	return [
		{
			kind: _ViewItemKind.Field,
			field: serial.field,
			format: 'numberValue',
		},
		...viewItems(serial.fallback),
	] satisfies _ViewItem[]
}

const allViewItems = (entity: Entity) => viewItemTree([
	...viewItems(entitySingularView(entity)?.summary?.icon),
	...summarySerialItems(entity),
	...viewItems(entitySingularView(entity)?.summary?.title),
	...viewItems(entitySingularView(entity)?.summary?.value),
	...viewItems(entitySingularView(entity)?.summary?.titleFallback),
	...viewItems(entitySingularView(entity)?.summary?.HeadingAfter),
	...viewItems(entitySingularView(entity)?.closed),
	...(singularViewContent(entitySingularView(entity))?.dl ?? []).flat(),
	...(singularViewContent(entitySingularView(entity))?.blocks ?? []).flat(),
	...(singularViewDetails(entitySingularView(entity))?.blocks ?? []).flat(),
	...(singularViewDetails(entitySingularView(entity))?.tabs ?? []).flatMap((group) => group.items ?? []),
	...(entitySingularView(entity)?.carousels ?? []).flatMap((group) => group.sections.flatMap((section) => section.items ?? [])),
])

const viewItemImports = (entity: Entity, indexes: LoweringIndexes) => {
	const expressionImportMap = new Map<string, Set<string>>()
	const valueTypeImports: ImportSpec[] = []
	for (const viewEntry of allViewItems(entity)) {
		const fieldReference = itemFieldReferences(viewEntry)[0]
		if (fieldReference != null) {
			const fieldDefinition = fieldDefinitionByReference(entity, fieldReference, indexes)
			if (fieldDefinition?.valueType != null) {
				const valueType = indexes.valueTypeById[fieldDefinition.valueType]
				valueTypeImports.push(
					...lowerImportObject(valueType?.imports),
					...lowerImportObject(valueType?.displayImports)
				)
			}
		}
		if (typeof viewEntry === 'object' && 'field' in viewEntry) {
			if (viewEntry.enumConstantFrom != null && viewEntry.enumConstantMap != null) {
				const existing = expressionImportMap.get(viewEntry.enumConstantFrom) ?? new Set<string>()
				existing.add(viewEntry.enumConstantMap)
				expressionImportMap.set(viewEntry.enumConstantFrom, existing)
			}
			for (const param of viewEntry.link?.params ?? [])
				expressionImports(param.value, expressionImportMap)
		}
	}
	for (const section of entitySingularView(entity)?.carousels?.flatMap((carousel) => carousel.sections) ?? []) {
		for (const param of section.href?.params ?? [])
			expressionImports(param.value, expressionImportMap)
	}

	return [
		...valueTypeImports,
		...[...expressionImportMap.entries()].map(([from, names]) => ({
			from,
			names: [...names],
		})),
	]
}

const viewUsesFormat = (entity: Entity, indexes: LoweringIndexes, formats: readonly string[]) => allViewItems(entity)
	.some((viewEntry) => {
		const format = viewItemFormat(entity, indexes, viewEntry)
		return format != null && formats.includes(format)
	})
	|| (
		singularViewContent(entitySingularView(entity))?.body?.format != null
		&& formats.includes(entitySingularView(entity).content.body.format)
	)
	|| (
		singularViewDetails(entitySingularView(entity))?.body?.format != null
		&& formats.includes(entitySingularView(entity).details.body.format)
	)

const declaredSummaryTitleEntries = (entity: Entity) => {
	const configured = entitySingularView(entity)?.summary?.title
	if (configured != null)
		return viewItems(configured)

	return []
}

const declaredSummaryValueEntries = (entity: Entity) => viewItems(entitySingularView(entity)?.summary?.value)

const summaryVisualFieldKeys = (entity: Entity) => new Set([
	...viewItems(entitySingularView(entity)?.summary?.icon).flatMap((viewEntry) => itemFieldReferences(viewEntry)),
	...declaredSummaryTitleEntries(entity).flatMap((viewEntry) => itemFieldReferences(viewEntry)),
	...viewItems(entitySingularView(entity)?.summary?.titleFallback).flatMap((viewEntry) => itemFieldReferences(viewEntry)),
	...declaredSummaryValueEntries(entity).flatMap((viewEntry) => itemFieldReferences(viewEntry)),
	...viewItems(entitySingularView(entity)?.summary?.HeadingAfter).flatMap((viewEntry) => itemFieldReferences(viewEntry)),
].map(fieldReferenceKey))

const defaultContentViewEntry = (indexes: LoweringIndexes, fieldDefinition: EntityField) => {
	if (fieldDefinition.type === EntityFieldType.EntitiesReference)
		return undefined
	if (fieldDefinition.type === EntityFieldType.Primitive && fieldNeedsExplicitDisplayExpression(indexes, fieldDefinition))
		return undefined

	return {
		kind: _ViewItemKind.Field,
		field: fieldDefinition.name,
	} satisfies Exclude<_ViewItem, string>
}

const defaultContentDlGroups = (entity: Entity, indexes: LoweringIndexes) => {
	if (
		(singularViewContent(entitySingularView(entity))?.dl ?? []).length > 0
		|| singularViewContent(entitySingularView(entity))?.body != null
		|| (singularViewContent(entitySingularView(entity))?.blocks ?? []).length > 0
		|| (singularViewLatest(entitySingularView(entity)) ?? []).length > 0
	)
		return []

	const summaryFieldKeys = summaryVisualFieldKeys(entity)
	const entries = entity.fields
		.filter((fieldDefinition) => !summaryFieldKeys.has(fieldDefinition.name))
		.flatMap((fieldDefinition) => {
			const entry = defaultContentViewEntry(indexes, fieldDefinition)
			return entry == null ? [] : [entry]
		})

	return entries.length === 0 ? [] : [entries]
}

const contentDlGroups = (entity: Entity, indexes: LoweringIndexes) => {
	const summaryFieldKeys = summaryVisualFieldKeys(entity)
	const carouselFieldKeys = new Set(
		(entitySingularView(entity)?.carousels ?? [])
			.flatMap((carousel) => carousel.sections)
			.map((section) => fieldReferenceKey(section.field))
	)
	const modeledDlGroups = singularViewContent(entitySingularView(entity))?.dl ?? []
	const effectiveDlGroups = modeledDlGroups
		.map((viewEntries) => viewEntries.filter((viewEntry) => itemFieldReferences(viewEntry).every((field) => !carouselFieldKeys.has(fieldReferenceKey(field)))))
		.filter((viewEntries) => viewEntries.length > 0)
	const openFieldKeys = new Set(effectiveDlGroups.flatMap((viewEntries) => viewEntries.flatMap((viewEntry) => itemFieldReferences(viewEntry).map(fieldReferenceKey))))
	const serialFieldName = summarySerial(entity)?.field
	const closedItems = viewItems(entitySingularView(entity)?.closed)
		.filter((viewEntry) => itemFieldReferences(viewEntry).every((fieldReference) => (
			fieldReferenceKey(fieldReference) !== serialFieldName
			&& !summaryFieldKeys.has(fieldReferenceKey(fieldReference))
			&& !openFieldKeys.has(fieldReferenceKey(fieldReference))
		)))

	return [
		...(closedItems.length === 0 ? [] : [closedItems.map((viewEntry) => (
			typeof viewEntry === 'string' ?
				{
					kind: _ViewItemKind.Field,
					field: viewEntry,
					when: 'closed',
				} satisfies Exclude<_ViewItem, string>
			: 'when' in viewEntry && viewEntry.when == null ?
				{
					...viewEntry,
					when: 'closed',
				}
			:
				viewEntry
			))]),
			...effectiveDlGroups,
			...defaultContentDlGroups(entity, indexes),
	]
}

const contentBlocks = (entity: Entity) => singularViewContent(entitySingularView(entity))?.blocks ?? []

const declaredRelationshipViewSections = (entity: Entity) => {
	const carouselFieldKeys = new Set(
		(entitySingularView(entity)?.carousels ?? [])
			.flatMap((carousel) => carousel.sections)
			.map((section) => fieldReferenceKey(section.field))
	)
	const configuredSections: RelationshipSection[] = [
		...[
			...(singularViewContent(entitySingularView(entity))?.lists ?? []),
			...(entitySingularView(entity)?.lists ?? []),
		].flatMap((list) => (
			list.field == null || carouselFieldKeys.has(fieldReferenceKey(list.field)) ?
				[]
			:
				[{
					id: list.id,
					label: list.title ?? list.label,
					titleField: list.titleField,
					field: list.field,
					component: list.component,
					href: list.href,
					emptyText: list.emptyText,
						selection: list.query,
						list,
						props: list.props,
						conditions: list.conditions,
						}]
		)),
	]

	return configuredSections
}

const declaredRelationshipSectionComponent = (section: RelationshipSection, indexes: LoweringIndexes) => {
	if (section.component != null && Object.hasOwn(indexes.generatedComponentByName, section.component))
		return section.component

	return undefined
}

const lowerSerialBadgeMarkup = (valueExpression: string, level: number) => [
	`${'\t'.repeat(level)}<span data-badge="small">`,
	`${'\t'.repeat(level + 1)}#{${textExpression(valueExpression)}}`,
	`${'\t'.repeat(level)}</span>`,
]

const lowerSerialTextExpression = (
	entity: Entity,
	indexes: LoweringIndexes,
	serial: NonNullable<ReturnType<typeof summarySerial>>,
	entityFieldsExpression: string
) => {
	const fallbackExpression = lowerJoinedItemsExpression(entity, indexes, viewItems(serial.fallback), entityFieldsExpression)
	const serialExpression = textExpression(viewFieldExpression(entity, entityFieldsExpression, serial.field))
	return lowerFirstDeclaredExpression([
		`(${serialExpression} ? ${emitTypeScript(`${serial.label} #`)} + ${serialExpression} : '')`,
		fallbackExpression,
	])
}

const lowerSerialTitleBody = (
	entity: Entity,
	indexes: LoweringIndexes,
	serial: NonNullable<ReturnType<typeof summarySerial>>,
	entityFieldsExpression: string,
	level: number
) => {
	const fallbackExpression = lowerJoinedItemsExpression(entity, indexes, viewItems(serial.fallback), entityFieldsExpression)

	return [
		`${'\t'.repeat(level)}{@const serialValue = ${viewFieldExpression(entity, entityFieldsExpression, serial.field)}}`,
		`${'\t'.repeat(level)}{#if serialValue !== undefined && serialValue !== null}`,
		`${'\t'.repeat(level + 1)}<span data-row="inline align-center gap-2 wrap">`,
		`${'\t'.repeat(level + 2)}<span>${serial.label} </span>`,
		...lowerSerialBadgeMarkup('serialValue', level + 2),
		`${'\t'.repeat(level + 1)}</span>`,
		...(serial.fallback == null ? [] : [
			`${'\t'.repeat(level)}{:else}`,
			`${'\t'.repeat(level + 1)}{${fallbackExpression}}`,
		]),
		`${'\t'.repeat(level)}{/if}`,
	]
}

const lowerSerialValueBody = (
	entity: Entity,
	indexes: LoweringIndexes,
	serial: NonNullable<ReturnType<typeof summarySerial>>,
	entityFieldsExpression: string,
	level: number
) => {
	const fallbackExpression = lowerJoinedItemsExpression(entity, indexes, viewItems(serial.fallback), entityFieldsExpression)

	return [
		`${'\t'.repeat(level)}{@const serialValue = ${viewFieldExpression(entity, entityFieldsExpression, serial.field)}}`,
		`${'\t'.repeat(level)}{#if serialValue !== undefined && serialValue !== null}`,
		...lowerSerialBadgeMarkup('serialValue', level + 1),
		...(serial.fallback == null ? [] : [
			`${'\t'.repeat(level)}{:else}`,
			`${'\t'.repeat(level + 1)}{${fallbackExpression}}`,
		]),
		`${'\t'.repeat(level)}{/if}`,
	]
}

const lowerSerialTitleSnippet = (
	entity: Entity,
	indexes: LoweringIndexes,
	serial: NonNullable<ReturnType<typeof summarySerial>>,
	selectorOwnsSerial: boolean,
	entityName: string
) => selectorOwnsSerial ? [
	...lowerSerialTitleBody(entity, indexes, serial, pendingEntityExpression, 2),
] : [
	`\t\t<ResourceBoundary resource={${entityName}}>`,
	'\t\t\t{#snippet Pending()}',
	...lowerSerialTitleBody(entity, indexes, serial, pendingEntityExpression, 4),
	'\t\t\t{/snippet}',
	'\t\t\t{#snippet children(entity)}',
	`\t\t\t\t{@const ${resolvedEntityExpression} = ${resolvedEntitySurfaceExpression}}`,
	...lowerSerialTitleBody(entity, indexes, serial, resolvedEntityExpression, 4),
	'\t\t\t{/snippet}',
	'\t\t</ResourceBoundary>',
]

const lowerSerialValueSnippet = (
	entity: Entity,
	indexes: LoweringIndexes,
	serial: NonNullable<ReturnType<typeof summarySerial>>,
	selectorOwnsSerial: boolean,
	entityName: string
) => selectorOwnsSerial ? [
	...lowerSerialValueBody(entity, indexes, serial, pendingEntityExpression, 2),
] : [
	`\t\t<ResourceBoundary resource={${entityName}}>`,
	'\t\t\t{#snippet Pending()}',
	...lowerSerialValueBody(entity, indexes, serial, pendingEntityExpression, 4),
	'\t\t\t{/snippet}',
	'\t\t\t{#snippet children(entity)}',
	`\t\t\t\t{@const ${resolvedEntityExpression} = ${resolvedEntitySurfaceExpression}}`,
	...lowerSerialValueBody(entity, indexes, serial, resolvedEntityExpression, 4),
	'\t\t\t{/snippet}',
	'\t\t</ResourceBoundary>',
]

const lowerSingularViewFile = (entityViewPlan: CompiledEntityViewFacts, indexes: LoweringIndexes) => {
	const { entity } = entityViewPlan
	const componentName = singularComponentName(entity.entityType)
	const serial = summarySerial(entity)
	const selectorOwnsSerial = serial != null && entity.selectors.some((selector) => selector.fields.includes(serial.field))
	const configuredSummaryTitleItems = viewItems(entitySingularView(entity)?.summary?.title)
	const rendersSerialTitle = (
		serial != null
		&& (
			configuredSummaryTitleItems.length === 0
			|| configuredSummaryTitleItems.every((item) => itemFieldReferences(item)[0] === serial.field)
		)
	)
	const rendersSerialValue = (
		serial != null
		&& (
			declaredSummaryValueEntries(entity).length === 0
			|| declaredSummaryValueEntries(entity).every((viewEntry) => itemFieldReferences(viewEntry)[0] === serial.field)
		)
	)
	const selectorFieldNames = entitySelectorFieldNames(entity)
	const queryFields = [...new Map([
		...(singularViewQuery(entitySingularView(entity))?.fields ?? []),
		...viewItems(entitySingularView(entity)?.summary?.icon).flatMap((viewEntry) => itemFieldReferences(viewEntry)),
		...summarySerialItems(entity).flatMap((viewEntry) => itemFieldReferences(viewEntry)),
		...viewItems(entitySingularView(entity)?.summary?.title).flatMap((viewEntry) => itemFieldReferences(viewEntry)),
		...viewItems(entitySingularView(entity)?.summary?.value).flatMap((viewEntry) => itemFieldReferences(viewEntry)),
		...viewItems(entitySingularView(entity)?.summary?.titleFallback).flatMap((viewEntry) => itemFieldReferences(viewEntry)),
		...viewItems(entitySingularView(entity)?.summary?.HeadingAfter).flatMap((viewEntry) => itemFieldReferences(viewEntry)),
	].map((fieldReference) => [fieldReferenceKey(fieldReference), fieldReference])).values()].filter((fieldReference) => {
		const fieldDefinition = fieldDefinitionByReference(entity, fieldReference, indexes)
		return (
			fieldDefinition != null
			&& !isProjectionFieldReference(fieldReference)
			&& !selectorFieldNames.has(fieldReference)
			&& fieldDefinition.type !== EntityFieldType.EntityReference
			&& fieldDefinition.type !== EntityFieldType.EntitiesReference
		)
	})
		const sections = declaredRelationshipViewSections(entity)
	const detailsTabs = singularViewDetails(entitySingularView(entity))?.tabs ?? []
	const summaryTitleEntityReferenceItems = (rendersSerialTitle ? [] : declaredSummaryTitleEntries(entity)).flatMap((viewEntry) => {
		const fieldName = itemFieldReferences(viewEntry)[0]
		const fieldDefinition = fieldName == null ? undefined : fieldDefinitionByReference(entity, fieldName, indexes)
		return fieldDefinition?.type === EntityFieldType.EntityReference && fieldDefinition.entityType != null ?
			[fieldDefinition.entityType]
		:
			[]
	})
	const summaryValueEntityReferenceItems = (rendersSerialValue ? [] : declaredSummaryValueEntries(entity)).flatMap((viewEntry) => {
		const fieldName = itemFieldReferences(viewEntry)[0]
		const fieldDefinition = fieldName == null ? undefined : fieldDefinitionByReference(entity, fieldName, indexes)
		return fieldDefinition?.type === EntityFieldType.EntityReference && fieldDefinition.entityType != null ?
			[fieldDefinition.entityType]
		:
			[]
	})
	const summaryAfterEntityReferenceItems = viewItems(entitySingularView(entity)?.summary?.HeadingAfter).flatMap((viewEntry) => {
		const fieldName = itemFieldReferences(viewEntry)[0]
		const fieldDefinition = fieldName == null ? undefined : fieldDefinitionByReference(entity, fieldName, indexes)
		return fieldDefinition?.type === EntityFieldType.EntityReference && fieldDefinition.entityType != null ?
			[fieldDefinition.entityType]
		:
			[]
	})
	const summaryItemsNeedMarkup = (items: readonly _ViewItem[]) => (
		items.some((viewEntry) => {
			const fieldReference = itemFieldReferences(viewEntry)[0]
			return (
				fieldReference != null
				&& (
					isProjectionFieldReference(fieldReference)
					|| fieldDefinitionByReference(entity, fieldReference, indexes)?.type === EntityFieldType.EntityReference
				)
			)
		})
		|| (
			items.length === 1
			&& typeof items[0] === 'object'
			&& 'field' in items[0]
			&& (
				viewItemFormat(entity, indexes, items[0]) != null
				|| items[0].link != null
			)
		)
	)
	const summaryTitleNeedsMarkup = summaryItemsNeedMarkup(declaredSummaryTitleEntries(entity))
	const summaryValueNeedsMarkup = summaryItemsNeedMarkup(declaredSummaryValueEntries(entity))
	const summaryIconFieldName = itemFieldReferences(entitySingularView(entity)?.summary?.icon ?? '')[0]
	const summaryIconFieldDefinition = summaryIconFieldName == null ? undefined : fieldDefinitionByReference(entity, summaryIconFieldName, indexes)
	const summaryIconEntityReferenceComponent = (
		summaryIconFieldDefinition?.type === EntityFieldType.EntityReference
		&& summaryIconFieldDefinition.entityType != null ?
			singularComponentName(summaryIconFieldDefinition.entityType)
		:
			undefined
	)
	const entityReferenceItems = [...contentDlGroups(entity, indexes).flat(), ...contentBlocks(entity).flat(), ...detailsTabs.flatMap((tab) => tab.items ?? [])].flatMap((viewEntry) => {
		const fieldName = itemFieldReferences(viewEntry)[0]
		const fieldDefinition = fieldName == null ? undefined : fieldDefinitionByReference(entity, fieldName, indexes)
		return fieldDefinition?.type === EntityFieldType.EntityReference && fieldDefinition.entityType != null ?
			[fieldDefinition.entityType]
		:
			[]
	})
	const carouselEntityReferenceItems = (entitySingularView(entity)?.carousels ?? []).flatMap((carousel) => carousel.sections.flatMap((section) => {
		const fieldDefinition = section.field == null ? undefined : fieldDefinitionByReference(entity, section.field, indexes)
		return fieldDefinition?.type === EntityFieldType.EntityReference && fieldDefinition.entityType != null ?
			[fieldDefinition.entityType]
		:
			[]
	}))
	const detailsTabSections = detailsTabs.flatMap((tab) => (tab.items ?? []).flatMap((viewEntry) => {
		const field = itemFieldReferences(viewEntry)[0]
		return field == null ? [] : [{
			field,
			viewEntry,
		} satisfies RelationshipSection]
	}))
	const latestItems = singularViewLatest(entitySingularView(entity)) ?? []
	const carousels = entitySingularView(entity)?.carousels ?? []
	const usesSelect = (
		latestItems.length > 0
		|| summaryIconEntityReferenceComponent != null
		|| summaryTitleEntityReferenceItems.length > 0
		|| summaryValueEntityReferenceItems.length > 0
		|| summaryAfterEntityReferenceItems.length > 0
		|| [...contentDlGroups(entity, indexes).flat(), ...contentBlocks(entity).flat()].some((viewEntry) => {
			const fieldReference = itemFieldReferences(viewEntry)[0]
			return fieldReference != null && fieldDefinitionByReference(entity, fieldReference, indexes)?.type === EntityFieldType.EntityReference
		})
		|| sections.some((section) => fieldDefinitionByReference(entity, section.field, indexes)?.type === EntityFieldType.EntityReference)
		|| detailsTabSections.some((section) => fieldDefinitionByReference(entity, section.field, indexes)?.type === EntityFieldType.EntityReference)
		|| carousels.some((carousel) => carousel.sections.some((section) => (
			section.field != null
			&& carouselSectionComponent(entity, indexes, section) != null
			&& fieldDefinitionByReference(entity, section.field, indexes)?.type === EntityFieldType.EntityReference
		)))
		|| rawSnippetSources(entity).some((snippet) => snippet.raw.includes('select('))
	)
	const sectionComponents = unique([...sections, ...detailsTabSections].flatMap((section) => {
		const fieldDefinition = fieldDefinitionByReference(entity, section.field, indexes)
			const component = fieldDefinition == null ? undefined : declaredRelationshipSectionComponent(section, indexes)
		return component == null ? [] : [component]
	}).concat(
		entityReferenceItems.flatMap((entityType) => {
			const targetEntity = indexes.entityByType[entityType]
			return targetEntity == null ? [] : [singularComponentName(targetEntity.entityType)]
		}),
		summaryTitleEntityReferenceItems.flatMap((entityType) => {
			const targetEntity = indexes.entityByType[entityType]
			return targetEntity == null ? [] : [singularComponentName(targetEntity.entityType)]
		}),
		summaryValueEntityReferenceItems.flatMap((entityType) => {
			const targetEntity = indexes.entityByType[entityType]
			return targetEntity == null ? [] : [singularComponentName(targetEntity.entityType)]
		}),
		summaryAfterEntityReferenceItems.flatMap((entityType) => {
			const targetEntity = indexes.entityByType[entityType]
			return targetEntity == null ? [] : [singularComponentName(targetEntity.entityType)]
		}),
		latestItems.flatMap((latest) => {
			const component = latestComponentName(entity, indexes, latest)
			return component == null ? [] : [component]
		}),
		(singularViewDetails(entitySingularView(entity))?.tabs ?? []).flatMap((tab) => (
			tab.items.flatMap((item) => item.component == null ? [] : [item.component])
		)),
		carousels.flatMap((carousel) => carousel.sections.flatMap((section) => {
			const component = carouselSectionComponent(entity, indexes, section)
			return component == null ? [] : [component]
		})),
		entityViewPlan.rawSnippetComponents,
		...(summaryIconEntityReferenceComponent == null ? [] : [summaryIconEntityReferenceComponent])
	))
	const viewSourceSelection = singularViewQuery(entitySingularView(entity))?.sources
	const fieldConditionedViewSourcesExpression = lowerFieldConditionedSourceSelectionExpression(
		viewSourceSelection,
		'selection.entitySelector'
	)
	const viewSourcesExpression = fieldConditionedViewSourcesExpression === lowerSourceSelectionExpression(viewSourceSelection) ?
		undefined
	:
		'selectedViewSources'
	const query = lowerQuery(singularViewQuery(entitySingularView(entity)), queryFields, viewSourcesExpression, undefined, selectorFieldNames)
	const sectionQueries = sections.map((section) => lowerQuery(fieldQueryForName(entity, indexes, section.field, section.selection), []))
	const latestQueries = latestItems.map((latest) => lowerQuery(fieldQueryForName(entity, indexes, latest.field, latest.query), latest.fields ?? []))
	const carouselQueries = carousels.flatMap((carousel) => carousel.sections.flatMap((section) => (
		carouselSectionComponent(entity, indexes, section) == null ?
			[]
		:
			[lowerQuery(fieldQueryForName(entity, indexes, section.field, section.selection), [])]
	)))
	const hasEntityReferenceCarouselSections = carousels.some((carousel) => carousel.sections.some((section) => (
		section.field != null
		&& fieldDefinitionByReference(entity, section.field, indexes)?.type === EntityFieldType.EntityReference
		&& carouselSectionComponent(entity, indexes, section) != null
	)))
	const titleExpression = lowerJoinedItemsExpression(entity, indexes, declaredSummaryTitleEntries(entity), resolvedEntityExpression)
	const valueExpression = lowerJoinedItemsExpression(entity, indexes, declaredSummaryValueEntries(entity), resolvedEntityExpression)
	const pendingTitleExpression = lowerJoinedItemsExpression(entity, indexes, declaredSummaryTitleEntries(entity), pendingEntityExpression)
	const pendingValueExpression = lowerJoinedItemsExpression(entity, indexes, declaredSummaryValueEntries(entity), pendingEntityExpression)
	const fallbackTitleExpression = lowerJoinedItemsExpression(
		entity,
		indexes,
		viewItems(entitySingularView(entity)?.summary?.titleFallback),
		pendingEntityExpression
	)
	const serialFallbackTitleExpression = serial == null ? lowerFirstDeclaredExpression([pendingTitleExpression, fallbackTitleExpression]) : lowerSerialTextExpression(entity, indexes, serial, pendingEntityExpression)
	const titleFallbackExpression = lowerFirstDeclaredExpression([serialFallbackTitleExpression, emitTypeScript(displayLabel(entityLabel(entity)))])
	const pendingTitleFallbackExpression = lowerFirstDeclaredExpression([serial == null ? pendingTitleExpression : lowerSerialTextExpression(entity, indexes, serial, pendingEntityExpression), 'title', fallbackTitleExpression, emitTypeScript(displayLabel(entityLabel(entity)))])
	const entityTitleFallbackExpression = lowerFirstDeclaredExpression([titleExpression, 'title', 'titleFallback'])
	const pendingValueFallbackExpression = lowerFirstDeclaredExpression([pendingValueExpression, pendingTitleExpression, 'title', fallbackTitleExpression, emitTypeScript(displayLabel(entityLabel(entity)))])
	const entityValueFallbackExpression = lowerFirstDeclaredExpression([valueExpression, titleExpression, 'titleFallback'])
	const entityHrefs = indexes.entityHrefsByType[entity.entityType] ?? []
	const entityHrefImports = Array.from(
		entityHrefs
			.flatMap((href) => href.params)
			.reduce((imports, param) => expressionImports(param.value, imports), new Map<string, Set<string>>())
			.entries()
	)
	const entityReferenceHrefEntityTypes = unique([
		...entityReferenceItems,
		...summaryTitleEntityReferenceItems,
		...summaryValueEntityReferenceItems,
		...summaryAfterEntityReferenceItems,
		...latestItems.flatMap((latest) => {
			const entityType = latestTargetEntityType(entity, indexes, latest)
			return entityType == null ? [] : [entityType]
		}),
		...carouselEntityReferenceItems,
		...sections.flatMap((section) => {
			const fieldDefinition = fieldDefinitionByReference(entity, section.field, indexes)
			return fieldDefinition?.type === EntityFieldType.EntityReference && fieldDefinition.entityType != null ? [fieldDefinition.entityType] : []
		}),
	])
	const entityReferenceHrefImports = Array.from(
		entityReferenceHrefEntityTypes
			.flatMap((entityType) => indexes.entityHrefsByType[entityType] ?? [])
			.flatMap((href) => href.params)
			.reduce((imports, param) => expressionImports(param.value, imports), new Map<string, Set<string>>())
			.entries()
	)
	const entityHrefExpression = lowerEntityHrefExpression(
		indexes,
		entity.entityType,
		pendingEntityExpression,
		pendingEntityExpression,
		true
	)
	const importedViewItems = viewItemImports(entity, indexes)
	const rawSnippets = rawSnippetSources(entity)
	const entityName = camel(entity.entityType)
	const iconMarkup = (
		entitySingularView(entity)?.summary?.Icon != null
		|| entitySingularView(entity)?.summary?.icon != null
	) ? lowerIconSnippet(entity, indexes, entityName) : []
	const expressionImportSpecs = mergeImports([
		...(entitySingularView(entity)?.imports ?? []).map((importSpec) => ({
			from: importSpec.from,
			defaultName: importSpec.default,
			names: importSpec.names,
			typeNames: importSpec.typeNames,
		})),
		...(entitySingularView(entity)?.pending?.imports ?? []).map((importSpec) => ({
			from: importSpec.from,
			defaultName: importSpec.default,
			names: importSpec.names,
			typeNames: importSpec.typeNames,
		})),
		...entityHrefImports.map(([from, names]) => ({
			from,
			names: [...names],
		})),
		...entityReferenceHrefImports.map(([from, names]) => ({
			from,
			names: [...names],
		})),
		...importedViewItems,
	])
	const usesTimestamp = viewUsesFormat(entity, indexes, ['timestamp', 'dateTime'])
	const usesNumberValue = serial != null || viewUsesFormat(entity, indexes, ['currency', 'currencyScaled', 'number', 'numberValue', 'percent']) || rawSnippets.some((snippet) => snippet.raw.includes('<NumberValue'))
	const contentRows = contentDlGroups(entity, indexes)
	const usesTruncatedValue = (
		viewUsesFormat(entity, indexes, ['truncated', 'namespaceReference', 'url'])
		|| contentRows.some((group) => group.some((item) => ['truncated', 'namespaceReference', 'url'].includes(viewItemFormat(entity, indexes, item) ?? '')))
		|| rawSnippets.some((snippet) => snippet.raw.includes('<TruncatedValue'))
	)
	const usesUrl = viewUsesFormat(entity, indexes, ['url'])
	const usesMarkdown = viewUsesFormat(entity, indexes, ['markdown'])
	const usesTooltip = (
		carousels.some((carousel) => carousel.description != null)
		|| rawSnippets.some((snippet) => snippet.raw.includes('<Tooltip'))
	)
	const usesCollectionHrefs = (
		sections.some((section) => {
			const fieldDefinition = fieldDefinitionByReference(entity, section.field, indexes)
			return (
				section.href?.includes('(') === true
				|| fieldDefinition?.entityType != null && hasCollectionHref(entity, indexes, section.field, fieldDefinition.entityType)
			)
		})
		|| carousels.some((carousel) => carousel.sections.some((section) => {
			if (section.field == null)
				return false

			const fieldDefinition = fieldDefinitionByReference(entity, section.field, indexes)
			return fieldDefinition?.entityType != null && hasCollectionHref(entity, indexes, section.field, fieldDefinition.entityType)
		}))
	)
	const usesEntityReferenceHrefs = entityReferenceHrefEntityTypes.some((entityType) => (indexes.entityHrefsByType[entityType]?.length ?? 0) > 0)
	const usesResolve = entityHrefExpression != null || allViewItems(entity).some((item) => typeof item === 'object' && 'link' in item && item.link != null) || usesCollectionHrefs || usesEntityReferenceHrefs
	const relationshipMarkup = lowerRelationshipSections(entity, indexes, sections, entityName)
	const declaredDetailsTabs = singularViewDetails(entitySingularView(entity))?.tabs ?? []
	const detailTabsMarkup = declaredDetailsTabs.length === 0 ? [] : lowerDetailsTabs(entity, indexes, entityName, declaredDetailsTabs)
	const carouselMarkup = carousels.flatMap((carousel) => lowerCarousel(entity, indexes, carousel))
	const detailBlockMarkup = (singularViewDetails(entitySingularView(entity))?.blocks ?? []).flatMap((viewEntries) => viewEntries.flatMap((viewEntry) => lowerContentBlock(
		entity,
		indexes,
		typeof viewEntry === 'object' && 'when' in viewEntry ? { ...viewEntry, when: 'always' } : viewEntry,
		'detailsOpen',
		3
	)))
	const latestMarkup = latestItems.flatMap((latest) => lowerLatestContentItem(entity, indexes, latest, 3))
	const contentDlViewEntries = (viewEntries: readonly _ViewItem[]) => viewEntries.filter((viewEntry) => {
		const fieldName = itemFieldReferences(viewEntry)[0]
		const fieldDefinition = fieldName == null ? undefined : fieldDefinitionByReference(entity, fieldName, indexes)
		return fieldDefinition?.type !== EntityFieldType.EntitiesReference
	})
	const relationshipFieldKeys = new Set(sections.map((section) => fieldReferenceKey(section.field)))
	const carouselFieldKeys = new Set(
		(entitySingularView(entity)?.carousels ?? [])
			.flatMap((carousel) => carousel.sections)
			.map((section) => fieldReferenceKey(section.field))
	)
	const contentListSectionsFromDl = contentRows.flatMap((viewEntries) => viewEntries.flatMap((viewEntry) => {
		const field = itemFieldReferences(viewEntry)[0]
		if (field == null)
			return ([] satisfies string[])

		const fieldDefinition = fieldDefinitionByReference(entity, field, indexes)
		if (fieldDefinition?.type !== EntityFieldType.EntitiesReference)
			return ([] satisfies string[])

		const fieldKey = fieldReferenceKey(field)
		// Already executed via singularView.lists or carousels.
		if (relationshipFieldKeys.has(fieldKey) || carouselFieldKeys.has(fieldKey))
			return ([] satisfies string[])

		return lowerRelationshipSection(entity, indexes, {
			field,
			viewEntry,
		}).map((line) => line.replace(/^\t\t\t\t/, '\t\t'))
	}))
	const contentRowMarkupGroups = contentRows.map((viewEntries) => lowerContentItems(
		entity,
		indexes,
		contentDlViewEntries(viewEntries),
		'contentOpen',
		3,
		viewSourcesExpression
	))
		.filter((group) => group.length > 0)
	const contentBody = singularViewContent(entitySingularView(entity))?.body
	const contentBodyMarkup = contentBody == null ? [] : lowerBodySection(entity, indexes, contentBody, 'contentOpen', 2, viewSourcesExpression)
	const contentBlockMarkup = contentBlocks(entity).flatMap((viewEntries) => viewEntries.flatMap((viewEntry) => lowerContentBlock(entity, indexes, viewEntry, 'contentOpen', 2)))
	const usesViewDomId = true
	const lowerSummaryItemMarkup = (viewEntry: _ViewItem, viewEntryIndex: number, entityFieldsExpression: string, entityHrefFieldsExpression: string, refLayout: 'Title' | 'Value') => {
		if (typeof viewEntry === 'object' && 'kind' in viewEntry && viewEntry.kind === _ViewItemKind.Text)
			return [
				`${'\t'.repeat(4)}{${emitTypeScript(displayLabel(viewEntry.value ?? viewEntry.label))}}`,
			]
		if (typeof viewEntry === 'object' && 'text' in viewEntry && viewEntry.text != null)
			return [
				`${'\t'.repeat(4)}{${emitTypeScript(displayLabel(viewEntry.text))}}`,
			]

		const fieldReference = itemFieldReferences(viewEntry)[0]
		const fieldName = fieldReference == null ? undefined : fieldNameForReference(fieldReference)
		if (fieldName == null)
			throw new Error(`${entity.entityType} summary item is missing a field reference`)

		const fieldValueName = `${localIdentifier(fieldName)}${viewEntryIndex}`
		const fieldDefinition = fieldDefinitionByReference(entity, fieldReference, indexes)
		if (isProjectionFieldReference(fieldReference) && fieldDefinition?.type === EntityFieldType.Primitive) {
			const query = lowerQuery(fieldQuery(fieldDefinition, undefined), [fieldName])
			return [
				'\t\t\t\t<ProjectionBoundary',
				lowerSvelteAttribute(5, 'resource', fieldResourceBaseExpression('selection', fieldReference)),
				'\t\t\t\t>',
				'\t\t\t\t\t{#snippet Applicable(projection)}',
				'\t\t\t\t\t\t<ResourceBoundary',
				lowerSvelteAttribute(7, 'resource', fieldProxyResourceExpression('projection', fieldName, query)),
				'\t\t\t\t\t\t>',
				`\t\t\t\t\t\t\t{#snippet children(${fieldValueName})}`,
				`\t\t\t\t\t\t\t\t{#if ${fieldValueName} !== undefined && ${fieldValueName} !== null}`,
				...lowerValueMarkup(entity, indexes, viewEntry, fieldReference, fieldValueName, `({ value: ${fieldValueName} })`, 9),
				'\t\t\t\t\t\t\t\t{/if}',
				'\t\t\t\t\t\t\t{/snippet}',
				'\t\t\t\t\t\t</ResourceBoundary>',
				'\t\t\t\t\t{/snippet}',
				'\t\t\t\t</ProjectionBoundary>',
			]
		}
		if (fieldDefinition?.type === EntityFieldType.EntityReference && fieldDefinition.entityType != null) {
			const targetEntity = indexes.entityByType[fieldDefinition.entityType]
			if (targetEntity == null)
				throw new Error(`${entity.entityType}.${fieldName} summary EntityReference targets missing entity type ${fieldDefinition.entityType}`)

			const component = singularComponentName(targetEntity.entityType)
			const targetEntityName = camel(targetEntity.entityType)
			const referenceLevel = fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne ? 7 : 6
			if (entitySelectorOwnsField(entity, fieldName)) {
				const selectorExpression = fieldExpression('selection.entitySelector', fieldName)
				const hrefExpression = lowerEntityHrefExpression(indexes, targetEntity.entityType, selectorExpression, selectorExpression, true)

				return [
					`${'\t'.repeat(4)}<${componentIdentifier(component)}`,
					lowerSvelteAttribute(5, 'selection', `select(EntityType.${targetEntity.entityType}, ${selectorExpression})`),
					...(hrefExpression == null ? [] : [lowerSvelteAttribute(5, 'href', hrefExpression)]),
					`${'\t'.repeat(5)}layout={EntityLayout.${refLayout}}`,
					`${'\t'.repeat(5)}open={false}`,
					`${'\t'.repeat(4)}/>`,
				]
			}
			const hrefExpression = lowerEntityHrefExpression(indexes, targetEntity.entityType, `${targetEntityName}[EntityMetaKey.Selector]`, `${targetEntityName}[EntityMetaKey.Selector]`, true)

			return [
				`${'\t'.repeat(4)}<ResourceBoundary`,
				lowerSvelteAttribute(5, 'resource', fieldProxyResourceExpression('selection', fieldName, lowerQuery(fieldQuery(fieldDefinition, undefined)))),
				`${'\t'.repeat(4)}>`,
				`${'\t'.repeat(5)}{#snippet children(${targetEntityName})}`,
				...(fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne ? [
					`${'\t'.repeat(6)}{#if ${targetEntityName} != null && ${targetEntityName}[EntityMetaKey.Selector] != null}`,
				] : []),
				`${'\t'.repeat(referenceLevel)}<${componentIdentifier(component)}`,
				lowerSvelteAttribute(referenceLevel + 1, 'selection', `select(EntityType.${targetEntity.entityType}, ${targetEntityName}[EntityMetaKey.Selector])`),
				`${'\t'.repeat(referenceLevel + 1)}prefetched={${targetEntityName}}`,
				...(hrefExpression == null ? [] : [lowerSvelteAttribute(referenceLevel + 1, 'href', hrefExpression)]),
				`${'\t'.repeat(referenceLevel + 1)}layout={EntityLayout.${refLayout}}`,
				`${'\t'.repeat(referenceLevel + 1)}open={false}`,
				`${'\t'.repeat(referenceLevel)}/>`,
				...(fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne ? [
					`${'\t'.repeat(6)}{/if}`,
				] : []),
				`${'\t'.repeat(5)}{/snippet}`,
				`${'\t'.repeat(4)}</ResourceBoundary>`,
			]
		}

		const fieldValueExpression = entityFieldsExpression === resolvedEntityExpression ?
			resolvedFieldExpression(fieldName)
		: entityFieldsExpression === pendingEntityExpression ?
			pendingFieldExpression(entity, fieldName)
		:
			fieldExpression(entityFieldsExpression, fieldName)

		return [
			`${'\t'.repeat(4)}{@const ${fieldValueName} = ${fieldValueExpression}}`,
			`${'\t'.repeat(4)}{#if ${fieldValueName} !== undefined && ${fieldValueName} !== null}`,
			...lowerValueMarkup(entity, indexes, viewEntry, fieldName, fieldValueName, entityHrefFieldsExpression, 5),
			`${'\t'.repeat(4)}{/if}`,
		]
	}
	const pendingSummaryFieldsExpression = pendingEntityExpression
	const entitySummaryFieldsExpression = resolvedEntityExpression
	const pendingSummaryTitleMarkup = summaryTitleNeedsMarkup ? declaredSummaryTitleEntries(entity).flatMap((viewEntry, viewEntryIndex) => lowerSummaryItemMarkup(viewEntry, viewEntryIndex, pendingSummaryFieldsExpression, pendingSummaryFieldsExpression, 'Title')) : []
	const entitySummaryTitleMarkup = summaryTitleNeedsMarkup ? declaredSummaryTitleEntries(entity).flatMap((viewEntry, viewEntryIndex) => lowerSummaryItemMarkup(viewEntry, viewEntryIndex, entitySummaryFieldsExpression, entitySummaryFieldsExpression, 'Title')) : []
	const pendingSummaryValueMarkup = summaryValueNeedsMarkup ? declaredSummaryValueEntries(entity).flatMap((viewEntry, viewEntryIndex) => lowerSummaryItemMarkup(viewEntry, viewEntryIndex, pendingSummaryFieldsExpression, pendingSummaryFieldsExpression, 'Value')) : []
	const entitySummaryValueMarkup = summaryValueNeedsMarkup ? declaredSummaryValueEntries(entity).flatMap((viewEntry, viewEntryIndex) => lowerSummaryItemMarkup(viewEntry, viewEntryIndex, entitySummaryFieldsExpression, entitySummaryFieldsExpression, 'Value')) : []
	const detailBody = singularViewDetails(entitySingularView(entity))?.body
	const detailBodyMarkup = detailBody == null ? [] : lowerBodySection(entity, indexes, detailBody, 'detailsOpen', 3)
	const detailsMarkup = [
		...relationshipMarkup,
		...detailTabsMarkup,
		...carouselMarkup,
		...detailBodyMarkup,
		...detailBlockMarkup,
	]
	const usesEntityProxyField = [
		...iconMarkup,
		...pendingSummaryTitleMarkup,
		...entitySummaryTitleMarkup,
		...pendingSummaryValueMarkup,
		...entitySummaryValueMarkup,
		...latestMarkup,
		...contentRowMarkupGroups.flat(),
		...contentListSectionsFromDl,
		...contentBodyMarkup,
		...contentBlockMarkup,
		...detailsMarkup,
	].some((line) => line.includes('EntityProxyField'))
	const usesProjectionBoundary = [
		...pendingSummaryTitleMarkup,
		...entitySummaryTitleMarkup,
		...pendingSummaryValueMarkup,
		...entitySummaryValueMarkup,
		...contentRowMarkupGroups.flat(),
		...contentListSectionsFromDl,
		...contentBodyMarkup,
		...contentBlockMarkup,
		...detailsMarkup,
	].some((line) => line.includes('ProjectionBoundary'))
	const usesSource = [
		...iconMarkup,
		...pendingSummaryTitleMarkup,
		...entitySummaryTitleMarkup,
		...pendingSummaryValueMarkup,
		...entitySummaryValueMarkup,
		...latestMarkup,
		...contentRowMarkupGroups.flat(),
		...contentListSectionsFromDl,
		...contentBodyMarkup,
		...contentBlockMarkup,
		...detailsMarkup,
	].some((line) => line.includes('Source.'))
	const usesIconComponent = iconMarkup.some((line) => line.includes('<IconComponent'))
	const typeAnnotationTooltipMarkup = (
		entitySingularView(entity)?.TypeAnnotationTooltip != null ?
			lowerRawLines(entitySingularView(entity).TypeAnnotationTooltip.raw, 2)
		: entity.description != null ?
			lowerTooltipParagraphs([entity.description], 2)
		:
			[]
	)
	const script = [
		'// Types/constants',
		'import type { ComponentProps } from \'svelte\'',
		...(usesResolve || rawSnippets.some((snippet) => snippet.raw.includes('resolve(')) ? ['import { resolve } from \'$app/paths\''] : []),
		'import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from \'$/client/$proxy.svelte.ts\'',
		'import type { WithRest } from \'$/typescript/WithRest.ts\'',
		...(usesEntityProxyField ? ['import { EntityProxyField } from \'$/client/$proxy.svelte.ts\''] : []),
		...(usesProjectionBoundary ? ['import ProjectionBoundary from \'$/components/ProjectionBoundary.svelte\''] : []),
		'import EntityView, { EntityLayout } from \'$/components/EntityView.svelte\'',
		'import { EntityMetaKey } from \'$/schema/$schema.ts\'',
		'import { EntityType } from \'$/schema/EntityType.ts\'',
		...(isFieldConditionedSourceSelection(viewSourceSelection) ? [
			`import { ${defaultSourcesName(viewSourceSelection)}, ${sourceSelectionByKeyName(viewSourceSelection)} } from '$/sources/$sourceSelections.ts'`,
		] : []),
		...expressionImportSpecs.map(lowerImport),
		...((
			usesSource
			|| query.includes('Source.')
			|| sectionQueries.some((sectionQuery) => sectionQuery.includes('Source.'))
			|| latestQueries.some((latestQuery) => latestQuery.includes('Source.'))
			|| carouselQueries.some((carouselQuery) => carouselQuery.includes('Source.'))
		) ? ['import { Source } from \'$/sources/Source.ts\''] : []),
		'',
		'',
		...(!usesSelect ? [] : [
			'// Context',
			'import { select } from \'$/routes/+layout.svelte\'',
			'',
			'',
		]),
		'// State',
		'let {',
		'\tselection,',
		'\tprefetched = {},',
		'\ttitle,',
		'\thref,',
		'\tlayout = EntityLayout.SummaryDetails,',
		'\topen = $bindable(layout === EntityLayout.SummaryDetails),',
		'\t...EntityViewProps',
		'}: WithRest<',
		'\t{',
		`\t\tselection: RegisteredEntityProxyResource<EntityType.${entity.entityType}>`,
		`\t\tprefetched?: Partial<RegisteredEntityProxyData<EntityType.${entity.entityType}>>`,
		'\t\ttitle?: string',
		'\t\thref?: string',
		'\t\tlayout?: EntityLayout',
		'\t\topen?: boolean',
		'\t},',
		'\tPick<',
		'\t\tComponentProps<typeof EntityView>,',
		'\t\t| \'collapsible\'',
		'\t\t| \'showTypeAnnotation\'',
		'\t>',
		'> = $props()',
		...(viewSourcesExpression == null || fieldConditionedViewSourcesExpression == null ? [] : [
			'',
			`const selectedViewSources = $derived(${fieldConditionedViewSourcesExpression})`,
		]),
		'',
		...lowerPendingEntityDerived(entity),
		`const ${entityName} = $derived(selection(${query}))`,
		`const titleFallback = $derived(${titleFallbackExpression})`,
		...(usesViewDomId ? [
			`const viewDomId = $derived(${emitTypeScript(`${entity.entityType
				.replace(/([a-z])([A-Z])/g, '$1-$2')
				.replace(/[_\s]+/g, '-')
				.toLowerCase()}-`)} + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))`,
		] : []),
		'',
		'',
		'// Components',
		...(carouselMarkup.length === 0 && detailTabsMarkup.length === 0 ? [] : ['import CollapsibleTabs from \'$/components/CollapsibleTabs.svelte\'']),
		...(hasEntityReferenceCarouselSections ? ['import EntitiesList from \'$/components/EntitiesList.svelte\''] : []),
		...(carouselMarkup.length === 0 ? [] : ['import HeadingComponent from \'$/components/Heading.svelte\'']),
		...(usesIconComponent ? ['import IconComponent from \'$/components/Icon.svelte\''] : []),
		...(usesMarkdown ? ['import Markdown from \'$/components/Markdown.svelte\''] : []),
		...(usesNumberValue ? ['import NumberValue from \'$/components/NumberValue.svelte\''] : []),
		'import ResourceBoundary from \'$/components/ResourceBoundary.svelte\'',
		...(usesTimestamp ? ['import Timestamp from \'$/components/Timestamp.svelte\''] : []),
		...(usesTooltip ? ['import Tooltip from \'$/components/Tooltip.svelte\''] : []),
		...(usesTruncatedValue ? ['import TruncatedValue from \'$/components/TruncatedValue.svelte\''] : []),
		...sectionComponents.map((component) => `import ${componentIdentifier(component)} from '$/views/${component}.svelte'`),
	]
	const markup = [
		'<EntityView',
		`\tentityType={EntityType.${entity.entityType}}`,
		'\tentitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}',
		'\tid={viewDomId}',
		lowerSvelteAttribute(1, 'title', 'title ?? titleFallback'),
		...(serial == null ? [] : [
			lowerSvelteAttribute(1, 'idDragPlainText', `String(${pendingFieldExpression(entity, serial.field)} ?? '')`),
		]),
		entityHrefExpression == null ? '\t{href}' : lowerSvelteAttribute(1, 'href', `href ?? ${entityHrefExpression}`),
		'\t{layout}',
		'\tbind:open',
		'\t{...EntityViewProps}',
		'>',
		...iconMarkup,
		...(iconMarkup.length === 0 ? [] : ['']),
		'\t{#snippet Title()}',
		...(entitySingularView(entity)?.summary?.Title == null && rendersSerialTitle ? lowerSerialTitleSnippet(entity, indexes, serial, selectorOwnsSerial, entityName) : entitySingularView(entity)?.summary?.Title == null ? [
		`\t\t<ResourceBoundary resource={${entityName}}>`,
		'\t\t\t{#snippet Pending()}',
		...(pendingSummaryTitleMarkup.length === 0 ? [
			`\t\t\t\t{${pendingTitleFallbackExpression}}`,
		] : pendingSummaryTitleMarkup),
		'\t\t\t{/snippet}',
		'\t\t\t{#snippet children(entity)}',
		`\t\t\t\t{@const ${resolvedEntityExpression} = ${resolvedEntitySurfaceExpression}}`,
		...(entitySummaryTitleMarkup.length === 0 ? [
			`\t\t\t\t{${entityTitleFallbackExpression}}`,
		] : entitySummaryTitleMarkup),
		'\t\t\t{/snippet}',
		'\t\t</ResourceBoundary>',
		] : lowerRawLines(entitySingularView(entity).summary.Title.raw, 2)),
		'\t{/snippet}',
		...(entitySingularView(entity)?.summary?.Value == null && !rendersSerialValue && declaredSummaryValueEntries(entity).length === 0 ? [] : [
			'',
			'\t{#snippet Value()}',
			...(entitySingularView(entity)?.summary?.Value == null && serial != null && rendersSerialValue ? lowerSerialValueSnippet(entity, indexes, serial, selectorOwnsSerial, entityName) : entitySingularView(entity)?.summary?.Value == null ? [
				`\t\t<ResourceBoundary resource={${entityName}}>`,
				'\t\t\t{#snippet Pending()}',
				...(pendingSummaryValueMarkup.length === 0 ? [
					`\t\t\t\t{${pendingValueFallbackExpression}}`,
				] : pendingSummaryValueMarkup),
				'\t\t\t{/snippet}',
				'\t\t\t{#snippet children(entity)}',
				`\t\t\t\t{@const ${resolvedEntityExpression} = ${resolvedEntitySurfaceExpression}}`,
				...(entitySummaryValueMarkup.length === 0 ? [
					`\t\t\t\t{${entityValueFallbackExpression}}`,
				] : entitySummaryValueMarkup),
				'\t\t\t{/snippet}',
				'\t\t</ResourceBoundary>',
			] : lowerRawLines(entitySingularView(entity).summary.Value.raw, 2)),
			'\t{/snippet}',
		]),
		...(
			viewItems(entitySingularView(entity)?.summary?.HeadingAfter).length === 0 ? []
			: lowerSummaryAfter(entity, indexes, entityName, viewItems(entitySingularView(entity)?.summary?.HeadingAfter))
		),
		...(typeAnnotationTooltipMarkup.length === 0 ? [] : [
			'',
			'\t{#snippet TypeAnnotationTooltip()}',
			...typeAnnotationTooltipMarkup,
			'\t{/snippet}',
		]),
		...(latestMarkup.length === 0 && contentRowMarkupGroups.length === 0 && contentListSectionsFromDl.length === 0 && contentBodyMarkup.length === 0 && contentBlockMarkup.length === 0 ? [] : [
			'',
			'\t{#snippet Content({ open: contentOpen })}',
			...(latestMarkup.length === 0 ? [] : [
			`\t\t<dl${entitySingularView(entity)?.latestDlClassName == null ? '' : ` class=${emitTypeScript(entitySingularView(entity).latestDlClassName)}`} data-column-item="center">`,
			...latestMarkup,
			'\t\t</dl>',
			]),
			...contentRowMarkupGroups.flatMap((contentRowMarkup) => [
				'\t\t<dl data-column-item="center">',
				...contentRowMarkup,
				'\t\t</dl>',
			]),
			...contentListSectionsFromDl,
			...contentBodyMarkup,
			...contentBlockMarkup,
			'\t{/snippet}',
		]),
		...(detailsMarkup.length === 0 ? [] : [
			'',
			'\t{#snippet Details({ open: detailsOpen })}',
			'\t\t{#if detailsOpen}',
			...detailsMarkup,
			'\t\t{/if}',
			'\t{/snippet}',
		]),
		'</EntityView>',
	]

	return svelteFile(
		viewModulePath(componentName).replace(/^\$\//, 'src/'),
		{
			script,
			markup,
		}
	)
}

const lowerContentBlock = (
	entity: Entity,
	indexes: LoweringIndexes,
	viewEntry: _ViewItem,
	openExpression: string,
	level: number
) => {
	if (typeof viewEntry === 'object' && 'kind' in viewEntry && viewEntry.kind === _ViewItemKind.Block)
		return wrapWhen(viewEntry, openExpression, [
			`${'\t'.repeat(level)}<section data-column="gap-2">`,
			...(viewEntry.label == null ? [] : [`${'\t'.repeat(level + 1)}<h3>${viewEntry.label}</h3>`]),
			...lowerRawBlock(viewEntry, level + 1),
			`${'\t'.repeat(level)}</section>`,
		])

	const fieldName = itemFieldReferences(viewEntry)[0]
	const fieldDefinition = fieldName == null ? undefined : fieldDefinitionByReference(entity, fieldName, indexes)
	if (fieldDefinition?.type === EntityFieldType.EntitiesReference || fieldDefinition?.type === EntityFieldType.EntityReference)
		return wrapWhen(viewEntry, openExpression, lowerRelationshipSection(entity, indexes, {
			field: fieldName,
			viewEntry,
		}).map((line) => line.replace(/^\t\t\t\t/, `${'\t'.repeat(level)}`)))

	throw new Error(`${entity.entityType} content block is not a Block or entity relationship item`)
}

const lowerRawBlock = (
	viewEntry: Exclude<_ViewItem, string> & { kind: _ViewItemKind.Block },
	level: number
) => {
	if (viewEntry.fields == null || viewEntry.fields.length === 0)
		return lowerRawLines(viewEntry.Content.raw, level)

	return [
		`${'\t'.repeat(level)}<ResourceBoundary`,
		lowerSvelteAttribute(level + 1, 'resource', `selection(${lowerQuery(undefined, viewEntry.fields)})`),
		`${'\t'.repeat(level)}>`,
		`${'\t'.repeat(level + 1)}{#snippet children(entity)}`,
		...lowerRawLines(viewEntry.Content.raw, level + 2),
		`${'\t'.repeat(level + 1)}{/snippet}`,
		`${'\t'.repeat(level)}</ResourceBoundary>`,
	]
}

const lowerBodySection = (
	entity: Entity,
	indexes: LoweringIndexes,
	body: NonNullable<SingularView['content']['body']>,
	openExpression: string,
	level: number,
	sourcesExpression?: string
) => {
	const bodyViewEntry = {
		field: body.field,
		format: (
			body.format === 'longText' ?
				'bodyLongText'
			: body.format === 'text' ?
				'bodyText'
			:
				body.format
		),
		when: body.when,
	} satisfies Exclude<_ViewItem, string>
	const query = lowerQuery(fieldQueryForName(entity, indexes, body.field, undefined), [body.field], sourcesExpression)
	const bodyFieldValue = resolvedFieldExpression(body.field)
	const bodyMarkup = [
		`${'\t'.repeat(level + (body.id == null && body.label == null ? 0 : 1))}<ResourceBoundary`,
		lowerSvelteAttribute(level + (body.id == null && body.label == null ? 1 : 2), 'resource', `selection(${query})`),
		`${'\t'.repeat(level + (body.id == null && body.label == null ? 0 : 1))}>`,
		`${'\t'.repeat(level + (body.id == null && body.label == null ? 1 : 2))}{#snippet children(entity)}`,
		`${'\t'.repeat(level + (body.id == null && body.label == null ? 2 : 3))}{@const ${resolvedEntityExpression} = ${resolvedEntitySurfaceExpression}}`,
		`${'\t'.repeat(level + (body.id == null && body.label == null ? 2 : 3))}{@const ${localIdentifier(body.field)} = ${bodyFieldValue}}`,
		`${'\t'.repeat(level + (body.id == null && body.label == null ? 2 : 3))}{#if ${localIdentifier(body.field)} !== undefined && ${localIdentifier(body.field)} !== null && ${localIdentifier(body.field)} !== ''}`,
		...lowerValueMarkup(entity, indexes, bodyViewEntry, body.field, localIdentifier(body.field), resolvedEntityExpression, level + (body.id == null && body.label == null ? 3 : 4)),
		...(body.emptyText == null ? [] : [
			`${'\t'.repeat(level + (body.id == null && body.label == null ? 2 : 3))}{:else}`,
			`${'\t'.repeat(level + (body.id == null && body.label == null ? 3 : 4))}<p data-text="muted">${body.emptyText}</p>`,
		]),
		`${'\t'.repeat(level + (body.id == null && body.label == null ? 2 : 3))}{/if}`,
		`${'\t'.repeat(level + (body.id == null && body.label == null ? 1 : 2))}{/snippet}`,
		`${'\t'.repeat(level + (body.id == null && body.label == null ? 0 : 1))}</ResourceBoundary>`,
	]

	return wrapWhen(bodyViewEntry, openExpression, body.id == null && body.label == null ? bodyMarkup : [
		`${'\t'.repeat(level)}<section`,
		...(body.id == null ? [] : [`${'\t'.repeat(level + 1)}id={viewDomId + ${emitTypeScript(`-${body.id}`)}}`]),
		...(body.label == null ? [] : [`${'\t'.repeat(level + 1)}data-scroll-marker-label=${emitTypeScript(body.label)}`]),
		`${'\t'.repeat(level)}>`,
		...(body.label == null ? [] : [
			`${'\t'.repeat(level + 1)}<h3>${body.label}</h3>`,
		]),
		...bodyMarkup,
		`${'\t'.repeat(level)}</section>`,
	])
}

const lowerSummaryAfterItem = (
	entity: Entity,
	indexes: LoweringIndexes,
	viewEntry: _ViewItem,
	entityFieldsExpression: string,
	viewEntryIndex: number,
	level: number
) => {
	if (typeof viewEntry === 'object' && 'kind' in viewEntry && viewEntry.kind === _ViewItemKind.Text)
		return [
			`${'\t'.repeat(level)}<span data-text="muted">${svelteText(viewEntry.value ?? viewEntry.label)}</span>`,
		]

	const fieldReference = itemFieldReferences(viewEntry)[0]
	const fieldName = fieldReference == null ? undefined : fieldNameForReference(fieldReference)
	if (fieldName == null)
		throw new Error(`${entity.entityType} HeadingAfter item is missing a field reference`)

	const fieldValueName = `${localIdentifier(fieldName)}${viewEntryIndex}`
	const fieldValue = entityFieldsExpression === 'entity' ?
		resolvedFieldExpression(fieldName)
	:
		viewFieldExpression(entity, entityFieldsExpression, fieldName)
	const fieldDefinition = fieldDefinitionByReference(entity, fieldReference, indexes)
	if (fieldDefinition?.type === EntityFieldType.EntityReference && fieldDefinition.entityType != null) {
		const targetEntity = indexes.entityByType[fieldDefinition.entityType]
		if (targetEntity != null) {
			const component = singularComponentName(targetEntity.entityType)
			const targetEntityName = camel(targetEntity.entityType)
			const referenceLevel = fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne ? level + 3 : level + 2
			if (entitySelectorOwnsField(entity, fieldName)) {
				const selectorExpression = fieldExpression('selection.entitySelector', fieldName)
				const hrefExpression = lowerEntityHrefExpression(indexes, targetEntity.entityType, selectorExpression, selectorExpression, true)

				return [
					`${'\t'.repeat(level)}<span data-text="muted">`,
					`${'\t'.repeat(level + 1)}<${componentIdentifier(component)}`,
					lowerSvelteAttribute(level + 2, 'selection', `select(EntityType.${targetEntity.entityType}, ${selectorExpression})`),
					...(hrefExpression == null ? [] : [lowerSvelteAttribute(level + 2, 'href', hrefExpression)]),
					`${'\t'.repeat(level + 2)}layout={EntityLayout.Title}`,
					`${'\t'.repeat(level + 2)}open={false}`,
					`${'\t'.repeat(level + 1)}/>`,
					`${'\t'.repeat(level)}</span>`,
				]
			}
			const hrefExpression = lowerEntityHrefExpression(indexes, targetEntity.entityType, `${targetEntityName}[EntityMetaKey.Selector]`, `${targetEntityName}[EntityMetaKey.Selector]`, true)

			return [
				`${'\t'.repeat(level)}<ResourceBoundary`,
				lowerSvelteAttribute(level + 1, 'resource', fieldProxyResourceExpression('selection', fieldReference, lowerQuery(fieldQuery(fieldDefinition, undefined)))),
				`${'\t'.repeat(level)}>`,
				`${'\t'.repeat(level + 1)}{#snippet children(${targetEntityName})}`,
				...(fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne ? [
					`${'\t'.repeat(level + 2)}{#if ${targetEntityName} != null && ${targetEntityName}[EntityMetaKey.Selector] != null}`,
				] : []),
				`${'\t'.repeat(referenceLevel)}<span data-text="muted">`,
				`${'\t'.repeat(referenceLevel + 1)}<${componentIdentifier(component)}`,
				lowerSvelteAttribute(referenceLevel + 2, 'selection', `select(EntityType.${targetEntity.entityType}, ${targetEntityName}[EntityMetaKey.Selector])`),
				`${'\t'.repeat(referenceLevel + 2)}prefetched={${targetEntityName}}`,
				...(hrefExpression == null ? [] : [lowerSvelteAttribute(referenceLevel + 2, 'href', hrefExpression)]),
				`${'\t'.repeat(referenceLevel + 2)}layout={EntityLayout.Title}`,
				`${'\t'.repeat(referenceLevel + 2)}open={false}`,
				`${'\t'.repeat(referenceLevel + 1)}/>`,
				`${'\t'.repeat(referenceLevel)}</span>`,
				...(fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne ? [
					`${'\t'.repeat(level + 2)}{/if}`,
				] : []),
				`${'\t'.repeat(level + 1)}{/snippet}`,
				`${'\t'.repeat(level)}</ResourceBoundary>`,
			]
		}

		throw new Error(`${entity.entityType}.${fieldName} HeadingAfter EntityReference targets missing entity type ${fieldDefinition.entityType}`)
	}

	const fieldValuesExpression = `({ value: ${fieldValueName}, ...${entityFieldsExpression === 'entity' ? resolvedEntityExpression : entityFieldsExpression} })`
	return [
		`${'\t'.repeat(level)}{@const ${fieldValueName} = ${fieldValue}}`,
		`${'\t'.repeat(level)}{#if ${fieldValueName} !== undefined && ${fieldValueName} !== null}`,
		`${'\t'.repeat(level + 1)}<span data-text="muted">`,
		...lowerValueMarkup(entity, indexes, viewEntry, fieldName, fieldValueName, fieldValuesExpression, level + 2),
		`${'\t'.repeat(level + 1)}</span>`,
		`${'\t'.repeat(level)}{/if}`,
	]
}

const lowerSummaryAfter = (entity: Entity, indexes: LoweringIndexes, entityName: string, viewEntries: readonly _ViewItem[]) => {
	return [
		'',
		'\t{#snippet HeadingAfter()}',
		`\t\t<ResourceBoundary resource={${entityName}}>`,
		'\t\t\t{#snippet Pending()}',
		...viewEntries.flatMap((viewEntry, viewEntryIndex) => lowerSummaryAfterItem(entity, indexes, viewEntry, pendingEntityExpression, viewEntryIndex, 4)),
		'\t\t\t{/snippet}',
		'\t\t\t{#snippet children(entity)}',
		`\t\t\t\t{@const ${resolvedEntityExpression} = ${resolvedEntitySurfaceExpression}}`,
		...viewEntries.flatMap((viewEntry, viewEntryIndex) => lowerSummaryAfterItem(entity, indexes, viewEntry, 'entity', viewEntryIndex, 4)),
		'\t\t\t{/snippet}',
		'\t\t</ResourceBoundary>',
		'\t{/snippet}',
	]
}

const lowerIconSnippet = (entity: Entity, indexes: LoweringIndexes, entityName: string) => {
	if (entitySingularView(entity)?.summary?.Icon != null)
		return [
			'',
			'\t{#snippet Icon()}',
			...lowerRawLines(entitySingularView(entity).summary.Icon.raw, 2),
			'\t{/snippet}',
		]

	const icon = entitySingularView(entity)?.summary?.icon
	if (icon == null)
		throw new Error(`${entity.entityType} Icon snippet was invoked without summary.icon metadata`)

	const iconField = itemFieldReferences(icon)[0]
	const iconFieldDefinition = iconField == null ? undefined : fieldDefinitionByReference(entity, iconField, indexes)
	if (
		iconFieldDefinition?.type === EntityFieldType.EntityReference
		&& iconFieldDefinition.entityType != null
	) {
		const component = singularComponentName(iconFieldDefinition.entityType)
		const referenceCondition = iconFieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne ?
			'reference?.[EntityMetaKey.Selector] !== undefined'
		:
			'reference[EntityMetaKey.Selector] !== undefined'

		return [
			'',
			'\t{#snippet Icon()}',
			`\t\t<ResourceBoundary resource={${entityName}}>`,
			'\t\t\t{#snippet Pending()}',
			'\t\t\t\t<IconComponent />',
			'\t\t\t{/snippet}',
			'',
			'\t\t\t{#snippet children(entity)}',
			`\t\t\t\t{@const reference = ${fieldExpression('entity', iconField)}}`,
			`\t\t\t\t{#if ${referenceCondition}}`,
			`\t\t\t\t\t<${componentIdentifier(component)}`,
			`\t\t\t\t\t\tselection={select(EntityType.${iconFieldDefinition.entityType}, reference[EntityMetaKey.Selector])}`,
			'\t\t\t\t\t\tprefetched={reference}',
			'\t\t\t\t\t\tlayout={EntityLayout.Value}',
			'\t\t\t\t\t\topen={false}',
			'\t\t\t\t\t/>',
			'\t\t\t\t{/if}',
			'\t\t\t{/snippet}',
			'\t\t</ResourceBoundary>',
			'\t{/snippet}',
		]
	}

	const iconExpression = iconField == null ? undefined : textExpression(fieldExpression('entity', iconField))
	const fallbackAttribute = iconExpression == null ?
		''
	:
		` icon={${iconExpression}}`

	return [
		'',
		'\t{#snippet Icon()}',
		`\t\t<ResourceBoundary resource={${entityName}}>`,
		'\t\t\t{#snippet Pending()}',
		'\t\t\t\t<IconComponent />',
		'\t\t\t{/snippet}',
		'\t\t\t{#snippet children(entity)}',
		`\t\t\t\t<IconComponent${fallbackAttribute} />`,
		'\t\t\t{/snippet}',
		'\t\t</ResourceBoundary>',
		'\t{/snippet}',
	]
}

const lowerEntityReferenceDlItem = (
	entity: Entity,
	indexes: LoweringIndexes,
	viewEntry: _ViewItem,
	fieldDefinition: EntityField,
	fieldReference: FieldReference,
	label: string,
	openExpression: string,
	level: number
) => {
	const fieldName = fieldNameForReference(fieldReference)
	if (fieldDefinition.entityType == null)
		throw new Error(`${entity.entityType}.${fieldName} EntityReference field is missing entityType`)

	const targetEntity = indexes.entityByType[fieldDefinition.entityType]
	if (targetEntity == null)
		throw new Error(`${entity.entityType}.${fieldName} references missing entity type ${fieldDefinition.entityType}`)

	const component = singularComponentIdentifier(targetEntity.entityType)
	const itemSelection = typeof viewEntry === 'object' && 'selection' in viewEntry ? viewEntry.selection : undefined
	const query = lowerQuery(fieldQuery(fieldDefinition, itemSelection), [])
	if (entitySelectorOwnsField(entity, fieldName)) {
		const selectorExpression = fieldExpression('selection.entitySelector', fieldName)
		const hrefExpression = lowerEntityHrefExpression(indexes, fieldDefinition.entityType, selectorExpression, selectorExpression, true)

		return wrapWhen(viewEntry, openExpression, [
			`${'\t'.repeat(level)}<div>`,
			`${'\t'.repeat(level + 1)}<dt>${label}</dt>`,
			`${'\t'.repeat(level + 1)}<dd>`,
			`${'\t'.repeat(level + 2)}<${component}`,
			lowerSvelteAttribute(level + 3, 'selection', `select(EntityType.${fieldDefinition.entityType}, ${selectorExpression}, ${query})`),
			...(hrefExpression == null ? [] : [
				lowerSvelteAttribute(level + 3, 'href', hrefExpression),
			]),
			`${'\t'.repeat(level + 3)}layout={EntityLayout.Value}`,
			`${'\t'.repeat(level + 3)}open={false}`,
			`${'\t'.repeat(level + 2)}/>`,
			`${'\t'.repeat(level + 1)}</dd>`,
			`${'\t'.repeat(level)}</div>`,
		])
	}

	const targetEntityName = camel(targetEntity.entityType)
	const hrefExpression = lowerEntityHrefExpression(
		indexes,
		fieldDefinition.entityType,
		`${targetEntityName}[EntityMetaKey.Selector]`,
		`${targetEntityName}[EntityMetaKey.Selector]`,
		true
	)
	const entityViewLines = [
		`${'\t'.repeat(level + 2)}<${component}`,
		lowerSvelteAttribute(level + 3, 'selection', `select(EntityType.${fieldDefinition.entityType}, ${targetEntityName}[EntityMetaKey.Selector])`),
		`${'\t'.repeat(level + 3)}prefetched={${targetEntityName}}`,
		...(hrefExpression == null ? [] : [
			lowerSvelteAttribute(level + 3, 'href', hrefExpression),
		]),
		`${'\t'.repeat(level + 3)}layout={EntityLayout.Value}`,
		`${'\t'.repeat(level + 3)}open={false}`,
		`${'\t'.repeat(level + 2)}/>`,
	]

		if (fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne)
			return wrapWhen(viewEntry, openExpression, [
				`${'\t'.repeat(level)}<ResourceBoundary`,
				lowerSvelteAttribute(level + 1, 'resource', fieldProxyResourceExpression('selection', fieldReference, query)),
				`${'\t'.repeat(level)}>`,
			`${'\t'.repeat(level + 1)}{#snippet Pending()}{/snippet}`,
			'',
			`${'\t'.repeat(level + 1)}{#snippet children(${targetEntityName})}`,
			`${'\t'.repeat(level + 2)}{#if ${targetEntityName} != null && ${targetEntityName}[EntityMetaKey.Selector] != null}`,
			`${'\t'.repeat(level + 3)}<div>`,
			`${'\t'.repeat(level + 4)}<dt>${label}</dt>`,
			`${'\t'.repeat(level + 4)}<dd>`,
			...entityViewLines.map((line) => indent(line, 3)),
			`${'\t'.repeat(level + 4)}</dd>`,
			`${'\t'.repeat(level + 3)}</div>`,
			`${'\t'.repeat(level + 2)}{/if}`,
			`${'\t'.repeat(level + 1)}{/snippet}`,
			`${'\t'.repeat(level)}</ResourceBoundary>`,
		])

	return wrapWhen(viewEntry, openExpression, [
		`${'\t'.repeat(level)}<div>`,
		`${'\t'.repeat(level + 1)}<dt>${label}</dt>`,
			`${'\t'.repeat(level + 1)}<dd>`,
			`${'\t'.repeat(level + 2)}<ResourceBoundary`,
			lowerSvelteAttribute(level + 3, 'resource', fieldProxyResourceExpression('selection', fieldReference, query)),
			`${'\t'.repeat(level + 2)}>`,
		`${'\t'.repeat(level + 3)}{#snippet children(${targetEntityName})}`,
		`${'\t'.repeat(level + 4)}{#if ${targetEntityName} != null && ${targetEntityName}[EntityMetaKey.Selector] != null}`,
		...entityViewLines.map((line) => indent(line, 3)),
		`${'\t'.repeat(level + 4)}{/if}`,
		`${'\t'.repeat(level + 3)}{/snippet}`,
		`${'\t'.repeat(level + 2)}</ResourceBoundary>`,
		`${'\t'.repeat(level + 1)}</dd>`,
		`${'\t'.repeat(level)}</div>`,
	])
}

const lowerContentItem = (
	entity: Entity,
	indexes: LoweringIndexes,
	viewEntry: _ViewItem,
	openExpression: string,
	level: number,
	sourcesExpression?: string,
	projectionBoundary = true
) => {
	const lowerWithinProjection = (fieldReference: FieldReference, lines: string[]) => (
		projectionBoundary ? lowerProjectionBoundaryLines(fieldReference, lines, level) : lines
	)

	if (typeof viewEntry === 'object' && 'kind' in viewEntry && viewEntry.kind === _ViewItemKind.Text)
		return wrapWhen(viewEntry, openExpression, [
			`${'\t'.repeat(level)}<div>`,
			`${'\t'.repeat(level + 1)}<dt>${viewEntry.label}</dt>`,
			`${'\t'.repeat(level + 1)}<dd>`,
			`${'\t'.repeat(level + 2)}{${emitTypeScript(viewEntry.value ?? viewEntry.label)}}`,
			...(viewEntry.description == null ? [] : [
				`${'\t'.repeat(level + 2)}<p data-text="muted">{${emitTypeScript(viewEntry.description)}}</p>`,
			]),
			`${'\t'.repeat(level + 1)}</dd>`,
			`${'\t'.repeat(level)}</div>`,
		])
	if (typeof viewEntry === 'object' && 'kind' in viewEntry && viewEntry.kind === _ViewItemKind.Block)
		return wrapWhen(viewEntry, openExpression, lowerRawBlock(viewEntry, level))

	const fieldReference = itemFieldReferences(viewEntry)[0]
	const fieldName = fieldReference == null ? undefined : fieldNameForReference(fieldReference)
	if (fieldName == null)
		throw new Error(`${entity.entityType} content item ${String(viewEntry)} is missing a field reference`)
	const fieldDefinition = fieldDefinitionByReference(entity, fieldReference, indexes)
	if (fieldDefinition == null)
		throw new Error(`${entity.entityType}.${fieldName} content item references an unknown field`)
	if (fieldDefinition.type === EntityFieldType.EntitiesReference)
		throw new Error(`${entity.entityType}.${fieldName} EntitiesReference cannot render as a content <dl> item`)
	const label = typeof viewEntry === 'object' && 'label' in viewEntry && viewEntry.label != null ? viewEntry.label : labelForField(fieldDefinition)

	if (fieldDefinition.type === EntityFieldType.EntityReference)
		return lowerWithinProjection(
			fieldReference,
			lowerEntityReferenceDlItem(entity, indexes, viewEntry, fieldDefinition, fieldReference, label, openExpression, level)
		)

	const valueExpression = resolvedFieldExpression(fieldName)
	const pendingValueExpression = pendingFieldExpression(entity, fieldName)
	const fieldValueName = localIdentifier(fieldName)
	const query = lowerQuery(fieldQuery(fieldDefinition, undefined), [fieldName], sourcesExpression)
	const projectionFieldResource = isProjectionFieldReference(fieldReference) ? fieldProxyResourceExpression('selection', fieldReference, query) : undefined
	const valueContextExpression = projectionFieldResource == null ?
		`({ value: ${fieldValueName}, ...${resolvedEntityExpression} })`
	:
		`({ value: ${fieldValueName} })`
	const valueMarkup = [
		`${'\t'.repeat(level)}<div>`,
		`${'\t'.repeat(level + 1)}<dt>${label}</dt>`,
		`${'\t'.repeat(level + 1)}<dd>`,
		...lowerValueMarkup(entity, indexes, viewEntry, fieldReference, fieldValueName, valueContextExpression, level + 2),
		`${'\t'.repeat(level + 1)}</dd>`,
		`${'\t'.repeat(level)}</div>`,
	]
	const pendingValueMarkup = [
		`${'\t'.repeat(level)}<div>`,
		`${'\t'.repeat(level + 1)}<dt>${label}</dt>`,
		`${'\t'.repeat(level + 1)}<dd>`,
		...lowerValueMarkup(entity, indexes, viewEntry, fieldReference, fieldValueName, `({ value: ${fieldValueName}, ...${pendingEntityExpression} })`, level + 2),
		`${'\t'.repeat(level + 1)}</dd>`,
		`${'\t'.repeat(level)}</div>`,
	]

	if (fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne)
		return lowerWithinProjection(fieldReference, wrapWhen(viewEntry, openExpression, [
			`${'\t'.repeat(level)}<ResourceBoundary`,
			lowerSvelteAttribute(level + 1, 'resource', projectionFieldResource ?? `selection(${query})`),
			`${'\t'.repeat(level)}>`,
			...(projectionFieldResource == null ? [
				`${'\t'.repeat(level + 1)}{#snippet Pending()}`,
				`${'\t'.repeat(level + 2)}{@const ${fieldValueName} = ${pendingValueExpression}}`,
				`${'\t'.repeat(level + 2)}{#if ${fieldValueName} !== undefined && ${fieldValueName} !== null}`,
				...pendingValueMarkup.map((line) => indent(line, 3)),
				`${'\t'.repeat(level + 2)}{/if}`,
				`${'\t'.repeat(level + 1)}{/snippet}`,
			] : [
				`${'\t'.repeat(level + 1)}{#snippet Pending()}{/snippet}`,
			]),
			`${'\t'.repeat(level + 1)}{#snippet children(${projectionFieldResource == null ? 'entity' : fieldValueName})}`,
			...(projectionFieldResource == null ? [
				`${'\t'.repeat(level + 2)}{@const ${resolvedEntityExpression} = ${resolvedEntitySurfaceExpression}}`,
				`${'\t'.repeat(level + 2)}{@const ${fieldValueName} = ${valueExpression}}`,
			] : []),
			`${'\t'.repeat(level + 2)}{#if ${fieldValueName} !== undefined && ${fieldValueName} !== null}`,
			...valueMarkup.map((line) => indent(line, 3)),
			`${'\t'.repeat(level + 2)}{/if}`,
			`${'\t'.repeat(level + 1)}{/snippet}`,
			`${'\t'.repeat(level)}</ResourceBoundary>`,
		]))

		return lowerWithinProjection(fieldReference, wrapWhen(viewEntry, openExpression, [
			`${'\t'.repeat(level)}<div>`,
			`${'\t'.repeat(level + 1)}<dt>${label}</dt>`,
			`${'\t'.repeat(level + 1)}<dd>`,
			`${'\t'.repeat(level + 2)}<ResourceBoundary`,
			lowerSvelteAttribute(level + 3, 'resource', projectionFieldResource ?? `selection(${query})`),
			`${'\t'.repeat(level + 2)}>`,
			...(projectionFieldResource == null ? [
				`${'\t'.repeat(level + 3)}{#snippet Pending()}`,
				`${'\t'.repeat(level + 4)}{@const ${fieldValueName} = ${pendingValueExpression}}`,
				`${'\t'.repeat(level + 4)}{#if ${fieldValueName} !== undefined && ${fieldValueName} !== null}`,
				...lowerValueMarkup(entity, indexes, viewEntry, fieldName, fieldValueName, `({ value: ${fieldValueName}, ...${pendingEntityExpression} })`, level + 5),
				`${'\t'.repeat(level + 4)}{/if}`,
				`${'\t'.repeat(level + 3)}{/snippet}`,
			] : [
				`${'\t'.repeat(level + 3)}{#snippet Pending()}{/snippet}`,
			]),
			`${'\t'.repeat(level + 3)}{#snippet children(${projectionFieldResource == null ? 'entity' : fieldValueName})}`,
			...(projectionFieldResource == null ? [
				`${'\t'.repeat(level + 4)}{@const ${resolvedEntityExpression} = ${resolvedEntitySurfaceExpression}}`,
				`${'\t'.repeat(level + 4)}{@const ${fieldValueName} = ${valueExpression}}`,
			] : []),
			`${'\t'.repeat(level + 4)}{#if ${fieldValueName} !== undefined && ${fieldValueName} !== null}`,
		...lowerValueMarkup(entity, indexes, viewEntry, fieldName, fieldValueName, `({ value: ${fieldValueName}, ...${resolvedEntityExpression} })`, level + 5),
		`${'\t'.repeat(level + 4)}{/if}`,
		`${'\t'.repeat(level + 3)}{/snippet}`,
		`${'\t'.repeat(level + 2)}</ResourceBoundary>`,
		`${'\t'.repeat(level + 1)}</dd>`,
		`${'\t'.repeat(level)}</div>`,
	]))
}

const lowerContentItems = (
	entity: Entity,
	indexes: LoweringIndexes,
	viewEntries: readonly _ViewItem[],
	openExpression: string,
	level: number,
	sourcesExpression?: string
) => viewEntries.reduce<{
	projectionFieldReference?: FieldReference
	viewEntries: _ViewItem[]
}[]>((groups, viewEntry) => {
	const fieldReference = itemFieldReferences(viewEntry)[0]
	const projectionFieldReference = fieldReference != null && isProjectionFieldReference(fieldReference) ? fieldReference : undefined
	const projectionKey = projectionFieldReference?.slice(0, -1).join('.') ?? ''
	const previousGroup = groups.at(-1)
	const previousProjectionKey = previousGroup?.projectionFieldReference?.slice(0, -1).join('.') ?? ''

	if (previousGroup != null && previousProjectionKey === projectionKey)
		previousGroup.viewEntries.push(viewEntry)
	else
		groups.push({
			projectionFieldReference,
			viewEntries: [viewEntry],
		})

	return groups
}, []).flatMap(({ projectionFieldReference, viewEntries: projectionViewEntries }) => {
	const lines = projectionViewEntries.flatMap((viewEntry) => lowerContentItem(
		entity,
		indexes,
		viewEntry,
		openExpression,
		level,
		sourcesExpression,
		false
	))

	return projectionFieldReference == null ? lines : lowerProjectionBoundaryLines(projectionFieldReference, lines, level)
})

const latestTargetEntityType = (
	entity: Entity,
	indexes: LoweringIndexes,
	latest: EntityLatest
) => fieldDefinitionByReference(entity, latest.field, indexes)?.entityType

const latestComponentName = (
	entity: Entity,
	indexes: LoweringIndexes,
	latest: EntityLatest
) => {
	const entityType = latestTargetEntityType(entity, indexes, latest)
	return latest.view ?? (entityType == null ? undefined : singularComponentName(entityType))
}

const lowerLatestContentItem = (
	entity: Entity,
	indexes: LoweringIndexes,
	latest: EntityLatest,
	level: number
) => {
	const latestFieldDefinition = fieldDefinitionByReference(entity, latest.field, indexes)
	const entityType = latestTargetEntityType(entity, indexes, latest)
	const fieldEntityType = latestFieldDefinition?.entityType
	const component = latestComponentName(entity, indexes, latest)
	if (entityType == null || fieldEntityType == null || component == null)
		throw new Error(`${entity.entityType}.${latest.field} latest reference is missing target entity/component metadata`)
	const latestEntityName = camel(entityType)
	const latestEntitiesName = `${latestEntityName}s`
	const latestSelectorName = `${latestEntityName}Selector`
	const latestEntity = indexes.entityByType[entityType]
	const latestSelectorFieldNames = latestEntity == null ? new Set<string>() : entitySelectorFieldNames(latestEntity)
	const latestOrderBy = latest.query?.orderBy ?? (latest.sort == null ? undefined : [
		{
			field: latest.sort,
			direction: latest.direction ?? 'desc',
		},
	])
	const latestQueryFields = unique([
		...(latest.fields ?? []),
		...[
			...(latestOrderBy ?? []).map((order) => order.field),
			...(indexes.entityHrefsByType[entityType] ?? [])
				.flatMap((entityHref) => entityHref.params.flatMap((param) => expressionFieldPaths(param.value)))
				.map((fieldPath) => fieldPath[0])
				.filter((fieldName): fieldName is string => fieldName != null),
		].filter((fieldName) => !latestSelectorFieldNames.has(fieldName)),
	].filter((fieldName) => latestEntity == null || fieldDefinitionByReference(latestEntity, fieldName) != null))

	const query = lowerQuery(
		latestFieldDefinition == null ? {
			...latest.query,
			limit: 1,
			orderBy: latestOrderBy,
		} : fieldQuery(latestFieldDefinition, {
			...latest.query,
			limit: 1,
			orderBy: latestOrderBy,
		}),
		latestQueryFields,
		undefined,
		undefined,
		undefined,
		latestEntity
	)
	const latestSelectionQuery = lowerQuery(
		latest.query == null ?
			undefined
		:
			{
				sources: latest.query.sources,
			},
		[]
	)
	const latestSelectionSuffix = latestSelectionQuery === '{}' ? '' : `, ${latestSelectionQuery}`
	const selectorExpression = `${latestEntityName}[EntityMetaKey.Selector]`
	const latestHrefExpression = lowerEntityHrefExpression(
		indexes,
		entityType,
		selectorExpression,
		`${latestEntityName}[EntityMetaKey.Selector]`,
		true
	)
	const latestLabel = latest.label ?? latest.field
	const latestConditions = [
		...(isProjectionFieldReference(latest.field) ? [] : facetFieldReferenceConditions(entity, latest.field, indexes.facetDependencyConditionsByPath)),
		...(latest.conditions ?? latest.when ?? []),
	]

	const latestBodyLines = [
		`${'\t'.repeat(level + 4)}{#if ${latestEntityName} != null}`,
		lowerSvelteConst(level + 5, latestSelectorName, selectorExpression),
		`${'\t'.repeat(level + 5)}<${componentIdentifier(component)}`,
		lowerSvelteAttribute(level + 6, 'selection', `select(EntityType.${entityType}, ${latestSelectorName}${latestSelectionSuffix})`),
		...(latestHrefExpression == null ? [] : [lowerSvelteAttribute(level + 6, 'href', latestHrefExpression)]),
		`${'\t'.repeat(level + 6)}prefetched={{ ...${latestSelectorName}, ...${latestEntityName} }}`,
		`${'\t'.repeat(level + 6)}layout={EntityLayout.Value}`,
		`${'\t'.repeat(level + 6)}open={false}`,
		`${'\t'.repeat(level + 5)}/>`,
		`${'\t'.repeat(level + 4)}{/if}`,
	]

	const lines = [
		`${'\t'.repeat(level)}<div>`,
		`${'\t'.repeat(level + 1)}<dt>${latestLabel}</dt>`,
		`${'\t'.repeat(level + 1)}<dd>`,
		`${'\t'.repeat(level + 2)}<ResourceBoundary`,
			lowerSvelteAttribute(level + 3, 'resource', fieldProxyResourceExpression('selection', latest.field, query)),
		`${'\t'.repeat(level + 2)}>`,
		...(
			// Constants-backed latest rows can hang the settle probe on default Loading while the list resolves;
			// emit empty Pending so catalog upgrades (etc.) do not leave `.loading` markers.
			latest.query?.sources?.length === 1 && latest.query.sources[0] === 'Constants_Internal' ?
				[
					`${'\t'.repeat(level + 3)}{#snippet Pending()}{/snippet}`,
					'',
				]
			:
				[]
		),
		`${'\t'.repeat(level + 3)}{#snippet children(${latestEntitiesName})}`,
		`${'\t'.repeat(level + 4)}{@const ${latestEntityName} = ${latestEntitiesName}.values[0]}`,
		...latestBodyLines,
		`${'\t'.repeat(level + 3)}{/snippet}`,
		`${'\t'.repeat(level + 2)}</ResourceBoundary>`,
		`${'\t'.repeat(level + 1)}</dd>`,
		`${'\t'.repeat(level)}</div>`,
	]

	return lowerProjectionBoundaryLines(
		latest.field,
		lowerConditionedEntityLines(entity, indexes, latestConditions, level, lines),
		level
	)
}

const lowerRelationshipSections = (
	entity: Entity,
	indexes: LoweringIndexes,
	sections: RelationshipSection[],
	entityName: string
) => {
	const groups = unique(sections.map((section) => section.group))

	return groups.flatMap((group) => {
		const groupSections = sections.filter((section) => section.group === group)
		const primitiveSections = groupSections.filter((section) => {
			const fieldDefinition = fieldDefinitionByReference(entity, section.field, indexes)
			return fieldDefinition?.type === EntityFieldType.Primitive
		})
		const referenceSections = groupSections.filter((section) => {
			const fieldDefinition = fieldDefinitionByReference(entity, section.field, indexes)
			return fieldDefinition?.type !== EntityFieldType.Primitive
		})
		const level = group == null ? 3 : 4
		const children = [
			...(primitiveSections.length === 0 ? [] : [
				`${'\t'.repeat(level)}<dl data-column-item="center">`,
				...primitiveSections.flatMap((section) => lowerContentItem(
					entity,
					indexes,
					section.field,
					'detailsOpen',
					level + 1
				)),
				`${'\t'.repeat(level)}</dl>`,
			]),
			...referenceSections.flatMap((section) => lowerRelationshipSection(entity, indexes, section))
				.map((line) => group == null ? line.replace(/^\t/, '') : line),
		]

		if (group == null)
			return children

		return [
			`\t\t\t<section data-column="gap-3">`,
			`\t\t\t\t<h2>${group}</h2>`,
			...children,
			'\t\t\t</section>',
		]
	})
}

const lowerRelationshipSection = (entity: Entity, indexes: LoweringIndexes, section: RelationshipSection) => {
	const fieldDefinition = fieldDefinitionByReference(entity, section.field, indexes)
	if (fieldDefinition == null)
		throw new Error(`${entity.entityType}.${section.field} relationship section references an unknown field`)
	const sectionConditions = isProjectionFieldReference(section.field) ? [] : [
		...facetFieldReferenceConditions(entity, section.field, indexes.facetDependencyConditionsByPath),
		...(section.conditions ?? []),
	]

	const component = declaredRelationshipSectionComponent(section, indexes)
	if (component == null)
		throw new Error(`${entity.entityType}.${section.field} relationship section must declare a generated component`)

	if (fieldDefinition.entityType == null)
		throw new Error(`${entity.entityType}.${section.field} relationship section field must reference an entity`)

	if (fieldDefinition.type === EntityFieldType.EntityReference && component != null)
		return lowerConditionedEntityLines(
			entity,
			indexes,
			sectionConditions,
			4,
			lowerProjectionBoundaryLines(
				section.field,
				lowerEntityReferenceSection(entity, indexes, section, fieldDefinition, component),
				4
			)
		)
	if (fieldDefinition.type === EntityFieldType.EntitiesReference && component != null)
		return lowerConditionedEntityLines(
			entity,
			indexes,
			sectionConditions,
			4,
			lowerProjectionBoundaryLines(
				section.field,
				lowerEntitiesReferenceSection(entity, indexes, section, fieldDefinition, component),
				4
			)
		)

	throw new Error(`${entity.entityType}.${section.field} relationship section has unsupported cardinality`)
}

const detailTabId = (
	tab: SingularView['details']['tabs'][number]
) => tab.id ?? (
	tab.label
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '')
	|| 'tab'
)

const detailTabSnippetName = (
	tab: SingularView['details']['tabs'][number]
) => {
	const name = detailTabId(tab)
		.replace(/^[$_]+/, '')
		.split(/[^a-zA-Z0-9]+/)
		.filter(Boolean)
		.map((part) => `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}`)
		.join('')

	return `Section${/^[0-9]/.test(name) ? `Tab${name}` : name}`
}

const detailTabConditionExpression = (
	tab: SingularView['details']['tabs'][number]
) => (
	tab.conditions == null || tab.conditions.length === 0 ?
		undefined
	:
		tab.conditions.map((condition) => [
			condition.equals == null ? undefined : `${fieldExpression('selection.entitySelector', fieldNameForReference(condition.field))} === ${emitTypeScript(condition.equals)}`,
			condition.notEquals == null ? undefined : `${fieldExpression('selection.entitySelector', fieldNameForReference(condition.field))} !== ${emitTypeScript(condition.notEquals)}`,
		].filter(Boolean).join(' && ')).join(' && ')
)

const lowerDetailTab = (
	entity: Entity,
	indexes: LoweringIndexes,
	tab: SingularView['details']['tabs'][number],
	entityName: string
) => {
	const viewEntries = tab.items ?? []
	const dlViewEntries = viewEntries.filter((viewEntry) => {
		const fieldName = itemFieldReferences(viewEntry)[0]
		const fieldDefinition = fieldName == null ? undefined : fieldDefinitionByReference(entity, fieldName, indexes)
		return fieldDefinition?.type === EntityFieldType.Primitive || fieldDefinition?.type === EntityFieldType.EntityReference
	})
	const referenceSections = viewEntries.flatMap((viewEntry) => {
		const field = itemFieldReferences(viewEntry)[0]
		if (field == null)
			return ([] satisfies RelationshipSection[])

		const fieldDefinition = fieldDefinitionByReference(entity, field, indexes)
		return fieldDefinition == null || fieldDefinition.type !== EntityFieldType.EntitiesReference ?
			([] satisfies RelationshipSection[])
		:
			[{
				idExpression: `\`\${id}-${detailTabId(tab)}-list\``,
				label: typeof viewEntry === 'object' && 'label' in viewEntry ? viewEntry.label : undefined,
				field,
				component: typeof viewEntry === 'object' && 'component' in viewEntry ? viewEntry.component : undefined,
				selection: typeof viewEntry === 'object' && 'selection' in viewEntry ? viewEntry.selection : undefined,
				href: typeof viewEntry === 'object' && 'link' in viewEntry ? viewEntry.link?.href : undefined,
				viewEntry,
			} satisfies RelationshipSection]
	})
	const content = [
		...(tab.Content == null ? [] : lowerRawLines(tab.Content.raw, 5)),
		...(dlViewEntries.length === 0 ? [] : [
			'\t\t\t\t\t<dl data-column-item="center">',
			...dlViewEntries.flatMap((viewEntry) => lowerContentItem(entity, indexes, viewEntry, 'detailsOpen', 6)),
			'\t\t\t\t\t</dl>',
		]),
		...reindentLines(
			referenceSections.flatMap((section) => lowerRelationshipSection(entity, indexes, section)),
			5
		),
	]
	if (content.length === 0)
		throw new Error(`${entity.entityType} details tab ${detailTabId(tab)} has no renderable content`)

	const lines = [
		`\t\t\t\t{#snippet ${detailTabSnippetName(tab)}({ id, label })}`,
		...content,
		'\t\t\t\t{/snippet}',
	]
	const conditionExpression = detailTabConditionExpression(tab)
	if (conditionExpression == null)
		return lines

	return [
		`\t\t\t\t{#snippet ${detailTabSnippetName(tab)}({ id, label })}`,
		`\t\t\t\t\t{#if ${conditionExpression}}`,
		...content.map((line) => indent(line)),
		'\t\t\t\t\t{/if}',
		'\t\t\t\t{/snippet}',
	]
}

const lowerDetailsTabs = (entity: Entity, indexes: LoweringIndexes, entityName: string, tabs: SingularView['details']['tabs']) => {
	return [
		'\t\t\t<CollapsibleTabs',
		'\t\t\t\tid={viewDomId + \'-details-tabs\'}',
		'\t\t\t\tsectionIdPrefix={viewDomId}',
		lowerSvelteAttribute(4, 'sections', [
			'[',
			...tabs.map((tab) => {
				const sectionExpression = `${lowerObject([
					['id', emitTypeScript(detailTabId(tab))],
					['label', emitTypeScript(tab.label)],
				])},`
				const conditionExpression = detailTabConditionExpression(tab)

				return conditionExpression == null ?
					indent(sectionExpression)
				:
					`${indent(`...(${conditionExpression} ? [`)}\n${indent(sectionExpression, 2)}\n${indent('] : []),')}`
			}),
			']',
		].join('\n')),
		'\t\t\t\tdata-card',
		'\t\t\t>',
		...tabs.flatMap((tab) => lowerDetailTab(entity, indexes, tab, entityName)),
		'\t\t\t</CollapsibleTabs>',
	]
}

const carouselSectionId = (section: EntityCarouselSection) => (
	section.id ?? (section.field == null ? undefined : routeCollectionIdForFieldReference(section.field)) ?? 'section'
)

const routeCollectionId = (field: string) => field.replace(/^\$\$?/, '').replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)

const routeCollectionIdForFieldReference = (field: FieldReference) => routeCollectionId(fieldNameForReference(field))

const carouselSectionComponent = (entity: Entity, indexes: LoweringIndexes, section: EntityCarouselSection) => {
	if (section.field == null)
		return undefined

	const fieldDefinition = fieldDefinitionByReference(entity, section.field, indexes)
	if (fieldDefinition == null || fieldDefinition.entityType == null)
		return undefined

	if (section.List != null)
		return section.List

	return undefined
}

const carouselSectionIsPrimitiveList = (entity: Entity, indexes: LoweringIndexes, section: EntityCarouselSection) => {
	if (section.field == null || section.items == null || section.items.length === 0)
		return false

	const fieldDefinition = fieldDefinitionByReference(entity, section.field, indexes)
	return fieldDefinition?.type === EntityFieldType.Primitive && (
		fieldDefinition.cardinality === EntityFieldCardinality.Many
		|| fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrMany
	)
}

const lowerRouteParamValueExpression = (
	expression: _Expression,
	fieldsExpression: string,
	decode?: _ExpressionDecode,
	optional = false
): string => {
	if (expression.kind === 'field')
		return (
			decode === _ExpressionDecode.DecodeURIComponent ?
				routeParamStringExpression(fieldExpression(fieldsExpression, expression.name), decode)
			:
				fieldExpression(fieldsExpression, expression.name)
		)
	if (expression.kind === 'property')
		return (
			decode === _ExpressionDecode.DecodeURIComponent ?
				routeParamStringExpression(`${lowerRouteParamValueExpression(expression.value, fieldsExpression, undefined, optional)}${propertyAccess(expression.property)}`, decode)
			:
				`${lowerRouteParamValueExpression(expression.value, fieldsExpression, undefined, optional)}${propertyAccess(expression.property)}`
		)
	if (expression.kind === 'template') {
		const templateExpression = `\`${expression.parts.map((part) => (
			typeof part === 'string' ?
				templateStringText(part)
			:
				`\${${routeParamStringExpression(lowerRouteParamValueExpression(part, fieldsExpression, undefined, optional))}}`
		)).join('')}\``
		return (
			decode === _ExpressionDecode.DecodeURIComponent ?
				`encodeURIComponent(${templateExpression})`
			:
				templateExpression
		)
	}
	if (expression.kind === 'catalogIndex')
		return routeParamStringExpression(lowerAppExpression(expression, {
			fields: fieldsExpression,
		}))

	return lowerAppExpression(expression, {
		fields: fieldsExpression,
	})
}

const lowerCollectionHrefExpression = (
	entity: Entity,
	indexes: LoweringIndexes,
	field: string,
	targetEntity: string,
	fieldsExpression = 'selection.entitySelector'
) => {
	const childHref = indexes.collectionHrefBySourceField[collectionSourceFieldKey(entity.entityType, field, targetEntity)]
	if (childHref != null) {
		const hrefExpression = lowerRouteResolveExpression(
			childHref.href,
			childHref.params.map((param) => [
				param.param,
				lowerRouteParamValueExpression(param.value, fieldsExpression, param.decode),
			])
		)
		const condition = unique(childHref.params
			.flatMap((param) => routeExpressionConditions(fieldsExpression, param.value)))
			.join(' && ')
		return condition === '' ? hrefExpression : `(${condition} ? ${hrefExpression} : undefined)`
	}

	const collectionHref = indexes.collectionHrefByEntity[targetEntity]
	return collectionHref == null ? undefined : collectionHref.includes('(') ? lowerRouteResolveExpression(collectionHref) : lowerResolveExpression(collectionHref)
}

const collectionHrefFieldNames = (
	entity: Entity,
	indexes: LoweringIndexes,
	field: string,
	targetEntity: string
) => {
	const childHref = indexes.collectionHrefBySourceField[collectionSourceFieldKey(entity.entityType, field, targetEntity)]
	return childHref == null ?
		[]
	:
		unique(childHref.params.flatMap((param) => expressionFieldPaths(param.value).flatMap((fieldPath) => fieldPath[0] == null ? [] : [fieldPath[0]])))
}

const lowerEntityHrefExpression = (
	indexes: LoweringIndexes,
	entityType: string,
	fieldsExpression: string,
	routeFieldsExpression: string,
	partial = false
) => {
	const entityHrefs = indexes.entityHrefsByType[entityType] ?? []
	if (entityHrefs.length === 0)
		return undefined

	const candidates = entityHrefs.map((entityHref) => {
		const hrefExpression = lowerRouteResolveExpression(
			entityHref.href,
			entityHref.params.map((param) => [
				param.param,
				lowerRouteParamExpression(param.value, {
					fields: routeFieldsExpression,
				}, param.decode),
			])
		)
		const condition = (entityHref.conditions ?? [])
			.map((condition) => conditionExpression([condition], fieldsExpression, indexes.entityByType[entityType], partial))
			.join(' && ')
		const routeFieldCondition = unique(entityHref.params
			.flatMap((param) => routeExpressionConditions(routeFieldsExpression, param.value)))
			.join(' && ')

		return {
			condition: [
				condition,
				routeFieldCondition,
			].filter(Boolean).join(' && '),
			hrefExpression,
			specificity: entityHref.conditions?.length ?? 0,
		}
	}).toSorted((left, right) => right.specificity - left.specificity)

	if (candidates.length > 1 && candidates.some((candidate) => candidate.condition === ''))
		throw new Error(`${entityType} has multiple unconditional entity hrefs`)

	if (candidates.length === 1)
		return candidates[0].condition === '' ?
			candidates[0].hrefExpression
		:
			`(${candidates[0].condition} ? ${candidates[0].hrefExpression} : undefined)`

	return `(${candidates
		.map((candidate) => `${candidate.condition === '' ? 'true' : candidate.condition} ? ${candidate.hrefExpression}`)
		.join(' : ')} : undefined)`
}

const lowerEntityPageSelection = (
	indexes: LoweringIndexes,
	entity: Entity | undefined,
	entityType: string,
	selectorExpression: string,
	selectorName?: string,
	sourceSelection?: readonly string[] | _SourceSelection
) => {
	if (entity == null)
		return `select(EntityType.${entityType}, ${selectorExpression})`

	const selector = entity.selectors.find((item) => item.name === selectorName)
	const sourceSelectorField = selector?.fields.includes('source') === true
	const fields = viewResolvedFieldReferences(entity, indexes)
		.filter((fieldReference) => {
			const fieldDefinition = fieldDefinitionByReference(entity, fieldReference, indexes)
			return (
				fieldDefinition != null
				&& fieldDefinition.type !== EntityFieldType.EntitiesReference
			)
		})
	const fieldDefaultSources = pageSelectionFieldDefaultSources(entity, indexes, fields)

	if (fields.length === 0 && !sourceSelectorField && sourceSelection == null && fieldDefaultSources == null)
		return `select(EntityType.${entityType}, ${selectorExpression})`

	const selectorSourceExpression = selectorExpression.includes('\n') ?
		`(${selectorExpression}).source`
	:
		`${selectorExpression}.source`
	const selectionSourcesExpression = lowerFieldConditionedSourceSelectionExpression(
		sourceSelection ?? fieldDefaultSources,
		selectorExpression
	)

	return [
		`select(EntityType.${entityType}, ${selectorExpression}, {`,
		...(sourceSelectorField ? [
			`\tsources: [${selectorSourceExpression}],`,
		] : selectionSourcesExpression == null ? [] : [
			...indent(`sources: ${selectionSourcesExpression},`).split('\n'),
		]),
		...(fields.length === 0 ? [] : [
			'\tfields: {',
			...fields.map((field) => `\t\t${field}: true,`),
			'\t},',
		]),
		'})',
	].join('\n')
}

const pageSelectionFieldDefaultSources = (
	entity: Entity,
	indexes: LoweringIndexes,
	fields: readonly FieldReference[]
) => {
	const sourceSets = fields
		.map((field) => fieldDefinitionByReference(entity, field, indexes)?.defaultSources)
		.filter((sources) => sources != null)
	if (sourceSets.length !== fields.length)
		return undefined
	const [firstSources] = sourceSets
	if (firstSources == null)
		return undefined
	return sourceSets.every((sources) => sources.length === firstSources.length && sources.every((source, index) => source === firstSources[index])) ?
		firstSources
	:
		undefined
}

const hasCollectionHref = (entity: Entity, indexes: LoweringIndexes, field: string, targetEntity: string) => (
	Object.hasOwn(indexes.collectionHrefBySourceField, collectionSourceFieldKey(entity.entityType, field, targetEntity))
	|| Object.hasOwn(indexes.collectionHrefByEntity, targetEntity)
)

const lowerCarousel = (
	entity: Entity,
	indexes: LoweringIndexes,
	carousel: EntityCarousel
) => {
	const sections = carousel.sections
	if (sections.length === 0)
		throw new Error(`${entity.entityType} carousel ${carousel.id ?? carousel.label ?? 'unnamed'} has no sections`)

	const sectionExpression = (section: EntityCarouselSection) => lowerObject([
		['id', emitTypeScript(carouselSectionId(section))],
		['label', emitTypeScript(section.label ?? section.field ?? 'Section')],
		['description', section.description == null ? undefined : emitTypeScript(section.description)],
	])
	const sectionsExpression = lowerArray(sections.map(sectionExpression))
	const tabsLines = [
		'\t\t\t<CollapsibleTabs',
		`\t\t\t\tid={viewDomId + ${emitTypeScript(`-carousel-${carousel.id ?? pascal(carousel.label)}`)}}`,
		'\t\t\t\tsectionIdPrefix={viewDomId}',
		lowerSvelteAttribute(4, 'sections', sectionsExpression),
		'\t\t\t\tdata-card',
			...(carousel.className == null ? [] : [
				`\t\t\t\tclass=${emitTypeScript(carousel.className)}`,
			]),
			'\t\t\t\tscrollContainerProps={{',
		`\t\t\t\t\t'data-row': 'start align-start',`,
		...(carousel.scrollContainerClassName == null ? [] : [
			`\t\t\t\t\tclass: ${emitTypeScript(carousel.scrollContainerClassName)},`,
		]),
		'\t\t\t\t}}',
		'\t\t\t>',
		'\t\t\t\t{#snippet Summary({})}',
		'\t\t\t\t\t<header data-row-item="flexible" data-row="wrap gap-4">',
		`\t\t\t\t\t\t<HeadingComponent>${carousel.label}</HeadingComponent>`,
		...(carousel.description == null ? [] : [
			'\t\t\t\t\t\t<Tooltip contentProps={{ side: \'top\' }}>',
			'\t\t\t\t\t\t\t{#snippet Content()}',
			'\t\t\t\t\t\t\t\t<p>',
			`\t\t\t\t\t\t\t\t\t${svelteText(carousel.description)}`,
			'\t\t\t\t\t\t\t\t</p>',
			'\t\t\t\t\t\t\t{/snippet}',
			'\t\t\t\t\t\t\t<abbr',
			'\t\t\t\t\t\t\t\tclass="entity-heading-tip"',
			`\t\t\t\t\t\t\t\taria-label=${emitTypeScript(`${carousel.label} help`)}`,
			'\t\t\t\t\t\t\t>ⓘ</abbr>',
			'\t\t\t\t\t\t</Tooltip>',
		]),
		'\t\t\t\t\t</header>',
		'\t\t\t\t{/snippet}',
		'',
		...sections.flatMap((section) => lowerCarouselSection(entity, indexes, section, carousel.projectionPath)),
		'\t\t\t</CollapsibleTabs>',
	]

	const carouselLines = carousel.projectionPath == null ?
		lowerConditionedEntityLines(entity, indexes, carousel.conditions, 3, tabsLines)
	:
		lowerProjectionConditionedLines(entity, indexes, carousel.projectionPath, carousel.conditions, 5, tabsLines)
	if (carousel.projectionPath == null)
		return carouselLines

	return [
		'			<ProjectionBoundary',
		lowerSvelteAttribute(
			4,
			'resource',
			carousel.projectionPath.reduce(
				(expression, facetName) => `${expression}${propertyAccess(facetName)}`,
				'selection'
			)
		),
		'			>',
		'				{#snippet Applicable(projection)}',
		...reindentLines(carouselLines, 5),
		'				{/snippet}',
		'			</ProjectionBoundary>',
	]
}

const lowerCarouselSection = (
	entity: Entity,
	indexes: LoweringIndexes,
	section: EntityCarouselSection,
	projectionPath?: readonly [string, ...string[]]
) => {
	if (section.Content != null)
		return [
			`\t\t\t\t{#snippet Section${pascal(carouselSectionId(section))}({ id, label, open })}`,
			...lowerRawLines(section.Content.raw, 5),
			'\t\t\t\t{/snippet}',
			'',
		]

	if (section.field == null)
		throw new Error(`${entity.entityType} carousel section ${carouselSectionId(section)} needs Content or field`)

	const fieldDefinition = fieldDefinitionByReference(entity, section.field, indexes)
	if (fieldDefinition == null)
		throw new Error(`${entity.entityType} carousel section ${carouselSectionId(section)} references unknown field ${section.field}`)

	if (carouselSectionIsPrimitiveList(entity, indexes, section))
		return lowerPrimitiveCarouselSection(entity, indexes, section, projectionPath)

	if (fieldDefinition.entityType == null)
		throw new Error(`${entity.entityType} carousel section ${carouselSectionId(section)} field ${section.field} is not an entity reference or primitive list`)

	const component = carouselSectionComponent(entity, indexes, section)
	if (component == null)
		throw new Error(`${entity.entityType} carousel section ${carouselSectionId(section)} has no renderable relationship component for ${section.field}`)

	const query = lowerQuery(fieldQuery(fieldDefinition, section.selection), [], undefined, undefined, undefined, undefined, true)
	const fieldBelongsToProjection = (
		projectionPath != null
		&& isProjectionFieldReference(section.field)
		&& section.field.length === projectionPath.length + 1
		&& projectionPath.every((facetName, index) => section.field[index] === facetName)
	)
	const fieldBase = fieldBelongsToProjection ? 'projection' : 'selection'
	const fieldReference = fieldBelongsToProjection ? fieldNameForReference(section.field) : section.field
	const sectionId = carouselSectionId(section)
	const snippetName = `Section${pascal(sectionId)}`
	// Parent carousel/branch already gates facet visibility. resolveFieldReferences
	// still injects facetFieldReferenceConditions onto section.conditions; nesting
	// another executionModels ResourceBoundary can settle empty before sync and omit
	// section title hrefs from the DOM.
	const autoFacetConditions = facetFieldReferenceConditions(entity, section.field, indexes.facetDependencyConditionsByPath)
	const sectionConditions = isProjectionFieldReference(section.field) ? [] : (section.conditions ?? []).filter((condition) => (
		!autoFacetConditions.some((autoCondition) => (
			autoCondition.field === condition.field
			&& autoCondition.equals === condition.equals
			&& autoCondition.contains === condition.contains
		))
	))
	const targetEntity = fieldDefinition.entityType
	const targetEntityName = camel(targetEntity)
	const itemLayout = `EntityLayout.${section.layout ?? 'Summary'}`
	const sectionSelectSources = lowerSourceSelectionExpression(section.selection?.sources)
	const sectionSelectSourcesExpression = sectionSelectSources ?? `${fieldBase}.sources`
	const referenceHrefExpression = lowerEntityHrefExpression(
		indexes,
		targetEntity,
		`${targetEntityName}[EntityMetaKey.Selector]`,
		`${targetEntityName}[EntityMetaKey.Selector]`,
		true
	)
	const hrefExpression = section.link == null ?
		lowerCollectionHrefExpression(entity, indexes, section.field, targetEntity)
	:
		lowerRouteResolveExpression(
			publicRouteId(section.link.route),
			(section.link.params ?? []).map((param) => [
				param.param,
				lowerRouteParamValueExpression(param.value, 'selection.entitySelector'),
			])
		)

	const sectionBodyLines = fieldDefinition.type === EntityFieldType.EntityReference ? [
			'\t\t\t\t\t<ResourceBoundary',
			lowerSvelteAttribute(6, 'resource', fieldProxyResourceExpression(fieldBase, fieldReference, query)),
			'\t\t\t\t\t>',
			...(fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne ? [
				'\t\t\t\t\t\t{#snippet Pending()}{/snippet}',
				'',
			] : []),
			`\t\t\t\t\t\t{#snippet children(${targetEntityName})}`,
			...(fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne ? [
				...(section.emptyText == null ? [
					`\t\t\t\t\t\t\t{#if ${targetEntityName} != null && ${targetEntityName}[EntityMetaKey.Selector] != null}`,
				] : [
					`\t\t\t\t\t\t\t{#if ${targetEntityName} == null || ${targetEntityName}[EntityMetaKey.Selector] == null}`,
					`\t\t\t\t\t\t\t\t<p data-text="muted">${svelteText(section.emptyText)}</p>`,
					'\t\t\t\t\t\t\t{:else}',
				]),
				`\t\t\t\t\t\t\t\t<${componentIdentifier(component)}`,
				`\t\t\t\t\t\t\t\t\tselection={select(EntityType.${targetEntity}, ${targetEntityName}[EntityMetaKey.Selector], { sources: ${sectionSelectSourcesExpression} })}`,
				`\t\t\t\t\t\t\t\t\tprefetched={${targetEntityName}}`,
				...(referenceHrefExpression == null ? [] : [lowerSvelteAttribute(9, 'href', referenceHrefExpression)]),
				`\t\t\t\t\t\t\t\t\tlayout={${itemLayout}}`,
				'\t\t\t\t\t\t\t\t\topen={false}',
				'\t\t\t\t\t\t\t\t/>',
				'\t\t\t\t\t\t\t{/if}',
			] : [
				'\t\t\t\t\t\t\t<EntitiesList',
				`\t\t\t\t\t\t\t\tentityType={EntityType.${targetEntity}}`,
				'\t\t\t\t\t\t\t\tid={`${id}-list`}',
				'\t\t\t\t\t\t\t\ttitle={label}',
				'\t\t\t\t\t\t\t\tcollapsible={false}',
				`\t\t\t\t\t\t\t\titems={[${targetEntityName}]}`,
				`\t\t\t\t\t\t\t\tgetKey={(${targetEntityName}) => ${targetEntityName}[EntityMetaKey.SelectorKey]}`,
				'\t\t\t\t\t\t\t>',
				`\t\t\t\t\t\t\t\t{#snippet Item({ item: ${targetEntityName} })}`,
				`\t\t\t\t\t\t\t\t\t<${componentIdentifier(component)}`,
				`\t\t\t\t\t\t\t\t\t\tselection={select(EntityType.${targetEntity}, ${targetEntityName}[EntityMetaKey.Selector], { sources: ${sectionSelectSourcesExpression} })}`,
				`\t\t\t\t\t\t\t\t\t\tprefetched={${targetEntityName}}`,
				...(referenceHrefExpression == null ? [] : [lowerSvelteAttribute(10, 'href', referenceHrefExpression)]),
				`\t\t\t\t\t\t\t\t\t\tlayout={${itemLayout}}`,
				'\t\t\t\t\t\t\t\t\t\topen={false}',
				'\t\t\t\t\t\t\t\t\t/>',
				'\t\t\t\t\t\t\t\t{/snippet}',
				...(section.emptyText == null ? [] : [
				'',
					'\t\t\t\t\t\t\t\t{#snippet Empty()}',
					`\t\t\t\t\t\t\t\t\t<p data-text="muted">${svelteText(section.emptyText)}</p>`,
					'\t\t\t\t\t\t\t\t{/snippet}',
				]),
				'\t\t\t\t\t\t\t</EntitiesList>',
			]),
			'\t\t\t\t\t\t{/snippet}',
			'\t\t\t\t\t</ResourceBoundary>',
		] : [
			`\t\t\t\t\t<${componentIdentifier(component)}`,
			lowerSvelteAttribute(6, 'selection', fieldProxyResourceExpression(fieldBase, fieldReference, query)),
			...(hrefExpression == null ? [] : [lowerSvelteAttribute(6, 'href', hrefExpression)]),
			'\t\t\t\t\t\tCollapsibleProps={{ canToggle: false }}',
			...(section.emptyText == null ? [] : [`\t\t\t\t\t\temptyText=${emitTypeScript(section.emptyText)}`]),
			'\t\t\t\t\t\topen={open}',
			'\t\t\t\t\t\ttitle={label}',
			'\t\t\t\t\t\tid={`${id}-list`}',
			'\t\t\t\t\t/>',
		]

	return [
		`\t\t\t\t{#snippet ${snippetName}({ id, label, open })}`,
		...(
			fieldBelongsToProjection ?
				lowerConditionedEntityLines(entity, indexes, sectionConditions, 5, sectionBodyLines)
			:
				lowerProjectionBoundaryLines(
					section.field,
					lowerConditionedEntityLines(entity, indexes, sectionConditions, 5, sectionBodyLines),
					5
				)
		),
		'\t\t\t\t{/snippet}',
		'',
	]
}

const lowerPrimitiveCarouselSection = (
	entity: Entity,
	indexes: LoweringIndexes,
	section: EntityCarouselSection,
	projectionPath?: readonly [string, ...string[]]
) => {
	const sectionId = carouselSectionId(section)
	const snippetName = `Section${pascal(sectionId)}`
	const fieldName = section.field == null ? undefined : fieldNameForReference(section.field)
	const fieldBelongsToProjection = (
		projectionPath != null
		&& section.field != null
		&& isProjectionFieldReference(section.field)
		&& section.field.length === projectionPath.length + 1
		&& projectionPath.every((facetName, index) => section.field[index] === facetName)
	)
	const fieldIsProjected = section.field != null && isProjectionFieldReference(section.field)
	const query = lowerQuery(
		fieldQueryForName(entity, indexes, section.field, section.selection),
		fieldBelongsToProjection || section.field == null ? [] : [section.field]
	)
	const fieldDefinition = fieldName == null ? undefined : fieldDefinitionByReference(entity, section.field ?? '', indexes)
	const primitiveValuesName = camel(fieldName ?? 'values')
	const primitiveValueName = camel((fieldDefinition?.label ?? fieldName ?? 'value').replace(/s$/, ''))
	const primitiveValueIndexName = `${primitiveValueName}Index`
	const autoFacetConditions = facetFieldReferenceConditions(entity, section.field, indexes.facetDependencyConditionsByPath)
	const sectionConditions = (section.conditions ?? []).filter((condition) => (
		!autoFacetConditions.some((autoCondition) => (
			autoCondition.field === condition.field
			&& autoCondition.equals === condition.equals
			&& autoCondition.contains === condition.contains
		))
	))
	const sectionBodyLines = [
		'\t\t\t\t\t<ResourceBoundary',
		lowerSvelteAttribute(
			6,
			'resource',
			fieldBelongsToProjection ?
				fieldProxyResourceExpression('projection', fieldName ?? '', query)
			: fieldIsProjected ?
				fieldProxyResourceExpression('selection', section.field ?? '', query)
			:
				`selection(${query})`
		),
		'\t\t\t\t\t>',
		`\t\t\t\t\t\t{#snippet children(${fieldBelongsToProjection || fieldIsProjected ? primitiveValuesName : 'entity'})}`,
		...(fieldBelongsToProjection || fieldIsProjected ? [] : [
			`\t\t\t\t\t\t\t{@const ${primitiveValuesName} = ${fieldExpression('entity', fieldName ?? '')}.values}`,
		]),
		`\t\t\t\t\t\t\t{#if ${primitiveValuesName}.length > 0}`,
		'\t\t\t\t\t\t\t\t<ul data-column="gap-2">',
		`\t\t\t\t\t\t\t\t\t{#each ${primitiveValuesName} as ${primitiveValueName}, ${primitiveValueIndexName} (${primitiveValueIndexName})}`,
		...(section.items ?? []).flatMap((viewEntry) => {
			const fieldReference = itemFieldReferences(viewEntry)[0]
			if (fieldReference == null)
				throw new Error(`${entity.entityType} primitive carousel section ${carouselSectionId(section)} item is missing a field reference`)
			const fieldName = fieldNameForReference(fieldReference)

			return [
				`${'\t'.repeat(10)}{@const ${primitiveCarouselRowValueName(fieldName)} = ${fieldExpression(primitiveValueName, fieldName)}}`,
			]
		}),
		'\t\t\t\t\t\t\t\t\t\t<li>',
		'\t\t\t\t\t\t\t\t\t\t\t<dl data-column-item="center">',
		...(section.items ?? []).flatMap((viewEntry) => lowerPrimitiveCarouselRowItem(entity, indexes, viewEntry, primitiveValueName, 12)),
		'\t\t\t\t\t\t\t\t\t\t\t</dl>',
		'\t\t\t\t\t\t\t\t\t\t</li>',
			'\t\t\t\t\t\t\t\t\t{/each}',
			'\t\t\t\t\t\t\t\t</ul>',
			...(section.emptyText == null ? [
				'\t\t\t\t\t\t\t{/if}',
			] : [
				'\t\t\t\t\t\t\t{:else}',
				`\t\t\t\t\t\t\t\t<p data-text="muted">${section.emptyText}</p>`,
				'\t\t\t\t\t\t\t{/if}',
			]),
		'\t\t\t\t\t\t{/snippet}',
		'\t\t\t\t\t</ResourceBoundary>',
	]

	return [
		`\t\t\t\t{#snippet ${snippetName}({ id, label, open })}`,
		...(
			fieldBelongsToProjection ?
				lowerConditionedEntityLines(entity, indexes, sectionConditions, 5, sectionBodyLines)
			:
				lowerProjectionBoundaryLines(
					section.field ?? '',
					lowerConditionedEntityLines(entity, indexes, sectionConditions, 5, sectionBodyLines),
					5
				)
		),
		'\t\t\t\t{/snippet}',
		'',
	]
}

const primitiveCarouselRowValueName = (fieldName: string) => `${pascal(fieldName)[0]?.toLowerCase() ?? ''}${pascal(fieldName).slice(1)}Value`

const lowerPrimitiveCarouselRowItem = (
	entity: Entity,
	indexes: LoweringIndexes,
	viewEntry: _ViewItem,
	primitiveFieldsExpression: string,
	level: number
) => {
	if (typeof viewEntry === 'object' && 'kind' in viewEntry)
		throw new Error(`${entity.entityType} primitive carousel row item cannot use kinded view metadata`)

	const fieldReference = itemFieldReferences(viewEntry)[0]
	if (fieldReference == null)
		throw new Error(`${entity.entityType} primitive carousel row item is missing a field reference`)
	const fieldName = fieldNameForReference(fieldReference)

	const label = typeof viewEntry === 'object' && 'label' in viewEntry && viewEntry.label != null ? viewEntry.label : fieldName
	const valueName = primitiveCarouselRowValueName(fieldName)

	return [
		`${'\t'.repeat(level)}<div>`,
		`${'\t'.repeat(level + 1)}<dt>${label}</dt>`,
		`${'\t'.repeat(level + 1)}<dd>`,
		`${'\t'.repeat(level + 2)}{#if ${valueName} !== undefined && ${valueName} !== null}`,
		...lowerValueMarkup(entity, indexes, viewEntry, fieldName, valueName, primitiveFieldsExpression, level + 3),
		`${'\t'.repeat(level + 2)}{/if}`,
		`${'\t'.repeat(level + 1)}</dd>`,
		`${'\t'.repeat(level)}</div>`,
	]
}

const lowerEntityReferenceSection = (
	entity: Entity,
	indexes: LoweringIndexes,
	section: RelationshipSection,
	fieldDefinition: EntityField,
	component: string
) => {
	const query = lowerQuery(fieldQuery(fieldDefinition, section.selection), [])
	const targetEntity = fieldDefinition.entityType
	if (targetEntity == null)
		throw new Error(`${entity.entityType}.${section.field} EntityReference section is missing entityType`)
	const targetEntityName = camel(targetEntity)
	if (entitySelectorOwnsField(entity, section.field)) {
		const selectorExpression = fieldExpression('selection.entitySelector', section.field)
		const hrefExpression = lowerEntityHrefExpression(indexes, targetEntity, selectorExpression, selectorExpression, true)

		return [
			'\t\t\t\t<section data-column="gap-2">',
			`\t\t\t\t\t<h3>${section.label ?? labelForField(fieldDefinition)}</h3>`,
			`\t\t\t\t\t<${componentIdentifier(component)}`,
			lowerSvelteAttribute(6, 'selection', `select(EntityType.${targetEntity}, ${selectorExpression})`),
			...(hrefExpression == null ? [] : [lowerSvelteAttribute(6, 'href', hrefExpression)]),
			'\t\t\t\t\t\tlayout={EntityLayout.Summary}',
			'\t\t\t\t\t\topen={false}',
			'\t\t\t\t\t/>',
			'\t\t\t\t</section>',
		]
	}
	const hrefExpression = lowerEntityHrefExpression(
		indexes,
		targetEntity,
		`${targetEntityName}[EntityMetaKey.Selector]`,
		`${targetEntityName}[EntityMetaKey.Selector]`,
		true
	)
	const referenceLevel = fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne ? 8 : 7

	return [
		'\t\t\t\t<section data-column="gap-2">',
		`\t\t\t\t\t<h3>${section.label ?? labelForField(fieldDefinition)}</h3>`,
		'\t\t\t\t\t<ResourceBoundary',
		lowerSvelteAttribute(6, 'resource', fieldProxyResourceExpression('selection', section.field, query)),
		'\t\t\t\t\t>',
		`\t\t\t\t\t\t{#snippet children(${targetEntityName})}`,
		...(fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne ? [
			`\t\t\t\t\t\t\t{#if ${targetEntityName} != null}`,
		] : []),
		`${'\t'.repeat(referenceLevel)}<${componentIdentifier(component)}`,
		`${'\t'.repeat(referenceLevel + 1)}selection={select(EntityType.${targetEntity}, ${targetEntityName}[EntityMetaKey.Selector], { sources: selection.sources })}`,
		`${'\t'.repeat(referenceLevel + 1)}prefetched={${targetEntityName}}`,
		...(hrefExpression == null ? [] : [lowerSvelteAttribute(referenceLevel + 1, 'href', hrefExpression)]),
		`${'\t'.repeat(referenceLevel + 1)}layout={EntityLayout.Summary}`,
		`${'\t'.repeat(referenceLevel + 1)}open={false}`,
		`${'\t'.repeat(referenceLevel)}/>`,
		...(fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne ? [
			'\t\t\t\t\t\t\t{/if}',
		] : []),
		'\t\t\t\t\t\t{/snippet}',
		'\t\t\t\t\t</ResourceBoundary>',
		'\t\t\t\t</section>',
	]
}

const lowerEntitiesReferenceSection = (
	entity: Entity,
	indexes: LoweringIndexes,
	section: RelationshipSection,
	fieldDefinition: EntityField,
	component: string
) => {
	const query = lowerQuery(fieldQuery(fieldDefinition, section.selection), [], undefined, undefined, undefined, undefined, true)
	const targetEntity = fieldDefinition.entityType
	if (targetEntity == null)
		throw new Error(`${entity.entityType}.${section.field} EntitiesReference section is missing entityType`)
	const hrefFieldNames = collectionHrefFieldNames(entity, indexes, section.field, targetEntity)
	const hrefNeedsResolvedEntity = hrefFieldNames.some((fieldName) => !entitySelectorOwnsField(entity, fieldName))
	const hrefExpression = lowerCollectionHrefExpression(
		entity,
		indexes,
		section.field,
		targetEntity,
		hrefNeedsResolvedEntity ? 'entity' : 'selection.entitySelector'
	)
	const titleLabel = section.label ?? labelForField(fieldDefinition)
	const titleExpression = section.titleField == null ?
		undefined
	:
		`String(${fieldExpression('entity', fieldNameForReference(section.titleField))} ?? ${emitTypeScript(titleLabel)})`
	const sectionLines = () => [
		`\t\t\t\t<${componentIdentifier(component)}`,
		lowerSvelteAttribute(5, 'selection', fieldProxyResourceExpression('selection', section.field, query)),
		titleExpression == null ? `\t\t\t\t\ttitle=${emitTypeScript(titleLabel)}` : lowerSvelteAttribute(5, 'title', titleExpression),
		...(section.href != null ? [
			section.href.includes('(') ?
				lowerSvelteAttribute(5, 'href', lowerResolveExpression(publicRouteId(section.href)))
			:
				`\t\t\t\t\thref=${emitTypeScript(publicRouteId(section.href))}`,
		] : hrefExpression == null ? [] : [lowerSvelteAttribute(5, 'href', hrefExpression)]),
			...(section.emptyText == null ? [] : [`\t\t\t\t\temptyText=${emitTypeScript(section.emptyText)}`]),
		...(section.list?.placeholderText == null ? [] : [`\t\t\t\t\tplaceholderText=${emitTypeScript(section.list.placeholderText)}`]),
		...(section.props ?? []).map((prop) => `\t\t\t\t\t${prop.name}={${lowerExpression(prop.value, {
			fields: 'selection.entitySelector',
		})}}`),
		section.idExpression == null ?
			(
				section.id == null ?
					`\t\t\t\t\tid=${emitTypeScript(`${component}-${routeCollectionIdForFieldReference(section.field)}`)}`
				:
					`\t\t\t\t\tid=${emitTypeScript(section.id)}`
			)
		:
			lowerSvelteAttribute(5, 'id', section.idExpression),
		'\t\t\t\t/>',
	]

	if (section.titleField == null && !hrefNeedsResolvedEntity)
		return sectionLines()

	return [
		'\t\t\t\t<ResourceBoundary',
		lowerSvelteAttribute(5, 'resource', `selection(${lowerQuery(undefined, unique([
			...(section.titleField == null ? [] : [section.titleField]),
			...hrefFieldNames,
		]))})`),
		'\t\t\t\t>',
		'\t\t\t\t\t{#snippet children(entity)}',
		`\t\t\t\t\t\t{@const ${resolvedEntityExpression} = ${resolvedEntitySurfaceExpression}}`,
		...sectionLines().map((line) => indent(line, 2)),
		'\t\t\t\t\t{/snippet}',
		'\t\t\t\t</ResourceBoundary>',
	]
}

const lowerFilterCondition = (
	filter: NonNullable<_ListView['filters']>[number],
	entityValueName: string
) => {
	const value = filter.selectorPath
		.split('.')
		.reduce((expression, part) => `${expression}${propertyAccess(part)}`, `${entityValueName}[EntityMetaKey.Selector]`)
	if (filter.compare === 'timeInterval')
		return `(${filter.prop} == null || (${value}.unit === ${filter.prop}.unit && ${value}.value === ${filter.prop}.value))`

	return `(${filter.prop} == null || ${value} === ${filter.prop})`
}

const namedRelationshipListViews = (indexes: Pick<
	CompiledAppFacts,
	'activeEntities' | 'entityByType' | 'entityFacetByPath' | 'generatedComponentByName'
>) => [...new Map(indexes.activeEntities.flatMap((sourceEntity) => (sourceEntity.singularView?.carousels ?? []).flatMap((carousel) => carousel.sections.flatMap((section) => {
		if (section.List == null || section.field == null || Object.hasOwn(indexes.generatedComponentByName, section.List))
			return []

		const field = fieldDefinitionByReference(sourceEntity, section.field, indexes)
		if (field == null || field.entityType == null)
			return []

		const entity = indexes.entityByType[field.entityType]
		return entity == null ? [] : [{
			component: section.List,
			entity,
			sourceEntity,
			section,
			field,
		} satisfies NamedRelationshipListView]
	}))).map((view) => [view.component, view])).values()]

const lowerNamedRelationshipListViewFile = (view: NamedRelationshipListView) => {
	const targetComponent = pluralComponentName(view.entity)
	const targetIdentifier = pluralComponentIdentifier(view.entity)
	const typeAnnotationParagraphs = view.section.description == null ? '[]' : `[${emitTypeScript(view.section.description)}]`
	const emptyText = view.section.emptyText == null ? 'undefined' : emitTypeScript(view.section.emptyText)

	return svelteFile(
		viewModulePath(view.component).replace(/^\$\//, 'src/'),
		{
			script: [
				'// Types/constants',
				'import type { ComponentProps } from \'svelte\'',
				'import type { RegisteredEntityProxyEntitiesResource } from \'$/client/$proxy.svelte.ts\'',
				'import type { WithRest } from \'$/typescript/WithRest.ts\'',
				'import { EntityType } from \'$/schema/EntityType.ts\'',
				'',
				'',
				'// State',
				'let {',
				'\tselection,',
				`\ttitle = ${emitTypeScript(view.section.label ?? view.field.label)},`,
				`\ttypeAnnotationParagraphs = ${typeAnnotationParagraphs},`,
				`\temptyText = ${emptyText},`,
				'\thref,',
				'\topen = $bindable(true),',
				'\tcollapsible = true,',
				`\tid = ${emitTypeScript(`${view.component.replace(/View$/, '')}-list`)},`,
				`\t...${targetIdentifier}Props`,
				'}: WithRest<',
				'\t{',
				`\t\tselection: RegisteredEntityProxyEntitiesResource<EntityType.${view.entity.entityType}>`,
				'\t\ttitle?: string',
				'\t\ttypeAnnotationParagraphs?: string[]',
				'\t\temptyText?: string',
				'\t\thref?: string',
				'\t\topen?: boolean',
				'\t\tcollapsible?: boolean',
				'\t\tid?: string',
				'\t},',
				`\tComponentProps<typeof ${targetIdentifier}>`,
				'> = $props()',
				'',
				'',
				'// Components',
				`import ${targetIdentifier} from '${viewModulePath(targetComponent)}'`,
			],
			markup: [
				`<${targetIdentifier}`,
				`\t{...${targetIdentifier}Props}`,
				'\t{selection}',
				'\t{title}',
				'\t{typeAnnotationParagraphs}',
				'\t{emptyText}',
				'\t{href}',
				'\tbind:open',
				'\t{collapsible}',
				'\t{id}',
				'/>',
			],
		}
	)
}

const lowerPluralViewFile = (entity: Entity, indexes: LoweringIndexes) => {
	const componentName = pluralComponentName(entity)
	const entityValueName = camel(entity.entityType)
	const entityValuesName = camel(componentName.replace(/View$/, ''))
	const uniqueEntityValuesName = `unique${pascal(entityValuesName)}`
	const pluralView = entityPluralView(entity)
	const row = pluralView?.row
	const usesCustomRow = row != null
	const serial = summarySerial(entity)
	const rowTitleItems = usesCustomRow ? viewItems(row.title) : declaredSummaryTitleEntries(entity)
	const rowValueItems = usesCustomRow ? viewItems(row.value) : declaredSummaryValueEntries(entity)
	const rowAfterItems = usesCustomRow ? viewItems(row.HeadingAfter) : viewItems(entitySingularView(entity)?.summary?.HeadingAfter)
	const rowItems = [
		...(usesCustomRow ? [] : summarySerialItems(entity)),
		...rowTitleItems,
		...rowValueItems,
		...(usesCustomRow ? [] : viewItems(entitySingularView(entity)?.summary?.titleFallback)),
		...rowAfterItems,
	]
	const itemLayout = (
		pluralView?.entityRow === _ListEntityRow.Title ?
			'EntityLayout.Title'
		: pluralView?.entityRow === _ListEntityRow.Value ?
			'EntityLayout.Value'
		:
			'EntityLayout.Summary'
	)
	const entityHrefs = indexes.entityHrefsByType[entity.entityType] ?? []
	const rowHrefFields = unique([
		...(pluralView?.rowHref == null ?
			[]
		:
			Object.values(pluralView.rowHref.params).flatMap((value) => routeExpressionQueryFields('expression' in value ? value.expression : value))
		),
		...(pluralView?.rowHref == null ?
			entityHrefs.flatMap((href) => [
				...(href.conditions ?? []).map((condition) => condition.field),
				...href.params.flatMap((param) => routeExpressionQueryFields(param.value)),
			])
		:
			[]
		),
	])
	const rowQueryFields = [...new Map([
		...(usesCustomRow ? [] : viewItems(entitySingularView(entity)?.summary?.icon)),
		...rowItems,
	].flatMap((item) => itemFieldReferences(item)).concat(rowHrefFields).map((fieldReference) => [
		fieldReferenceKey(fieldReference),
		fieldReference,
	])).values()]
	const rowProjectionPaths = [...new Map(rowQueryFields.flatMap((fieldReference) => (
		isProjectionFieldReference(fieldReference) ? [[
			fieldReference.slice(0, -1).join('.'),
			fieldReference.slice(0, -1),
		] as const] : []
	))).values()]
	const query = lowerQuery(
		pluralView?.query?.selection ?? pluralView?.query,
		rowQueryFields.filter((fieldReference) => !isProjectionFieldReference(fieldReference))
	)
	const filters = pluralView?.filters ?? []
	const filterCondition = filters.length === 0 ?
		'true'
	:
		filters.map((filter) => lowerFilterCondition(filter, entityValueName)).join(' && ')
	const filteredEntityValuesExpression = filters.length === 0 ?
		`${entityValuesName}.values`
	:
		`${entityValuesName}.values.filter((${entityValueName}) => ${filterCondition})`
	const sourceSelection = pluralView?.query?.sources
	const rawSnippets = rawSnippetSources(pluralView)
	const modelTypeAnnotationTooltipMarkup = (
		pluralView?.TypeAnnotationTooltip != null ?
			lowerRawLines(pluralView.TypeAnnotationTooltip.raw, 1)
		:
			[]
	)
	const defaultTypeAnnotationParagraphs = (
		pluralView?.TypeAnnotationTooltip == null && entity.description != null ?
			`[${emitTypeScript(entity.description)}]`
		:
			'[]'
	)
	const selectedSources = !Array.isArray(sourceSelection) && sourceSelection?.name != null && filters.length > 0 ?
		[
			`const selectedSources = $derived(${lowerSourceSelectionByKey(sourceSelection)}[[${filters.map((filter) => `String(${filter.prop})`).join(', ')}].join(':')] ?? ${lowerSourceArray(sourceSelection.default)})`,
		]
	:
		[]
	const renderedQuery = selectedSources.length === 0 ? query : lowerObject([
		['sources', 'selectedSources'],
		['count', 'true'],
	])
	const itemFieldsName = `${entityValueName}Fields`
	const itemFieldsExpression = itemFieldsName
	const itemHrefFieldsName = `${entityValueName}HrefFields`
	const itemHrefFieldsExpression = itemHrefFieldsName
	const itemPrefetchedFieldOverrides = rowQueryFields.flatMap((fieldReference) => {
		if (isProjectionFieldReference(fieldReference))
			return []

		const fieldDefinition = fieldDefinitionByReference(entity, fieldReference, indexes)
		if (
			fieldDefinition?.cardinality !== EntityFieldCardinality.Many
			&& fieldDefinition?.cardinality !== EntityFieldCardinality.ZeroOrMany
		)
			return []

		return `${fieldReference}: ${entityValueName}${propertyAccess(fieldReference)}`
	})
	const rowHrefExpression = pluralView?.rowHref == null ?
		undefined
	:
		lowerRouteResolveExpression(
			pluralView.rowHref.route,
			Object.entries(pluralView.rowHref.params).map(([param, value]) => [
				param,
				lowerRouteParamExpression('expression' in value ? value.expression : value, {
					fields: itemHrefFieldsExpression,
				}, 'expression' in value ? value.decode : undefined),
			])
		)
	const rowHrefImports = pluralView?.rowHref == null ? [] : Array.from(
		Object.values(pluralView.rowHref.params)
			.reduce((imports, value) => expressionImports('expression' in value ? value.expression : value, imports), new Map<string, Set<string>>())
			.entries()
	)
	const entityHrefImports = rowHrefExpression != null ? [] : Array.from(
		entityHrefs
			.flatMap((href) => href.params)
			.reduce((imports, param) => expressionImports(param.value, imports), new Map<string, Set<string>>())
			.entries()
	)
	const entityHrefExpression = rowHrefExpression ?? lowerEntityHrefExpression(
		indexes,
		entity.entityType,
		`${entityValueName}[EntityMetaKey.Selector]`,
		itemHrefFieldsExpression,
		true
	)
	const itemSelectionName = 'selection'
	const singularRowMarkup = (level: number) => [
		`${'\t'.repeat(level)}<${singularComponentIdentifier(entity.entityType)}`,
		`${'\t'.repeat(level + 1)}selection={${itemSelectionName}}`,
		`${'\t'.repeat(level + 1)}prefetched={${itemFieldsName}}`,
		...(entityHrefExpression == null ? [] : [
			lowerSvelteAttribute(level + 1, 'href', entityHrefExpression),
		]),
		`${'\t'.repeat(level + 1)}layout={${itemLayout}}`,
		`${'\t'.repeat(level + 1)}open={false}`,
		`${'\t'.repeat(level)}/>`,
	]
	const script = [
		'// Types/constants',
		'import type { ComponentProps } from \'svelte\'',
		...((entityHrefExpression != null || rowHrefExpression != null) || rawSnippets.some((snippet) => snippet.raw.includes('resolve(')) ? ['import { resolve } from \'$app/paths\''] : []),
		'import type { RegisteredEntityProxyEntitiesResource } from \'$/client/$proxy.svelte.ts\'',
		'import type { WithRest } from \'$/typescript/WithRest.ts\'',
		'import { EntityMetaKey } from \'$/schema/$schema.ts\'',
		'import { EntityType } from \'$/schema/EntityType.ts\'',
		...rowHrefImports.map(([from, names]) => lowerImport({
			from,
			names: [...names],
		})),
		...entityHrefImports.map(([from, names]) => lowerImport({
			from,
			names: [...names],
		})),
		...(renderedQuery.includes('Source.') || selectedSources.length > 0 ? ['import { Source } from \'$/sources/Source.ts\''] : []),
		...lowerImportObject(pluralView?.imports).map((spec) => lowerImport(spec)),
		'',
		'',
		'// Context',
		'import { select } from \'$/routes/+layout.svelte\'',
		'',
		'',
		'// State',
		'let {',
		'\tselection,',
		`\ttitle = ${emitTypeScript(pluralView?.title ?? sentenceStart(entityLabelPlural(entity)))},`,
		`\ttypeAnnotationParagraphs = ${defaultTypeAnnotationParagraphs},`,
		`\tplaceholderText = ${pluralView?.placeholderText == null ? 'undefined' : emitTypeScript(pluralView.placeholderText)},`,
		`\temptyText = ${pluralView?.emptyText == null ? 'undefined' : emitTypeScript(pluralView.emptyText)},`,
		'\topen = $bindable(true),',
		'\tcollapsible = true,',
		'\tshowTypeAnnotation = true,',
		`\tid = ${emitTypeScript(`${pluralViewName(entity)}-list`)},`,
		...filters.map((filter) => `\t${filter.prop},`),
		'\t...EntitiesListProps',
		'}: WithRest<',
		'\t{',
		`\t\tselection: RegisteredEntityProxyEntitiesResource<EntityType.${entity.entityType}>`,
		'\t\ttitle?: string',
		'\t\ttypeAnnotationParagraphs?: string[]',
		'\t\tplaceholderText?: string',
		'\t\temptyText?: string',
		'\t\topen?: boolean',
		'\t\tcollapsible?: boolean',
		'\t\tshowTypeAnnotation?: boolean',
		'\t\tid?: string',
		...filters.map((filter) => `\t\t${filter.prop}?: unknown`),
		'\t},',
		'\tPick<',
		'\t\tComponentProps<typeof EntitiesList>,',
		'\t\t| \'href\'',
		'\t\t| \'CollapsibleProps\'',
		'\t>',
		'> = $props()',
		...selectedSources,
		'',
		'const collectionSelection = $derived(selection)',
		'',
		'',
		'// Components',
		'import EntitiesList from \'$/components/EntitiesList.svelte\'',
		...(rowProjectionPaths.length === 0 ? [] : ['import ProjectionBoundary from \'$/components/ProjectionBoundary.svelte\'']),
		'import ResourceBoundary from \'$/components/ResourceBoundary.svelte\'',
		'import { EntityLayout } from \'$/components/EntityView.svelte\'',
		`import ${singularComponentIdentifier(entity.entityType)} from '${viewModulePath(singularComponentName(entity.entityType))}'`,
	]
	const markup = [
		'{#snippet TypeAnnotationParagraphs()}',
		'\t{#each typeAnnotationParagraphs as paragraph (paragraph)}',
		'\t\t<p>{paragraph}</p>',
		'\t{/each}',
		'{/snippet}',
		...(modelTypeAnnotationTooltipMarkup.length === 0 ? [] : [
			'',
			'{#snippet ModelTypeAnnotationTooltip()}',
			...modelTypeAnnotationTooltipMarkup,
			'{/snippet}',
		]),
		'',
		'{#if open}',
		'\t<ResourceBoundary',
			lowerSvelteAttribute(
				2,
				'resource',
				renderedQuery === '{}' ?
					'selection'
				:
					`selection(${renderedQuery})`
			),
			'\t\t{placeholderText}',
			'\t>',
			'\t\t{#snippet Pending()}',
			'\t\t\t<EntitiesList',
			'\t\t\t\t{...EntitiesListProps}',
			`\t\t\t\tentityType={EntityType.${entity.entityType}}`,
			'\t\t\t\t{id}',
			'\t\t\t\t{title}',
			'\t\t\t\tbind:open',
			'\t\t\t\t{collapsible}',
			'\t\t\t\t{showTypeAnnotation}',
			lowerSvelteAttribute(
				4,
				'TypeAnnotationTooltip',
				modelTypeAnnotationTooltipMarkup.length === 0 ?
					'typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined'
				:
					'typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip'
			),
			'\t\t\t\tplaceholderText={placeholderText}',
			'\t\t\t/>',
			'\t\t{/snippet}',
			'',
			`\t\t{#snippet children(${entityValuesName})}`,
			`\t\t\t{@const ${uniqueEntityValuesName} = [...new Map(${filteredEntityValuesExpression}.map((${entityValueName}) => [${entityValueName}[EntityMetaKey.SelectorKey], ${entityValueName}])).values()]}`,
			'\t\t\t<EntitiesList',
			'\t\t\t\t{...EntitiesListProps}',
			`\t\t\t\tentityType={EntityType.${entity.entityType}}`,
			'\t\t\t\t{id}',
			'\t\t\t\t{title}',
			'\t\t\t\tbind:open',
			'\t\t\t\t{collapsible}',
			'\t\t\t\t{showTypeAnnotation}',
			lowerSvelteAttribute(
				4,
				'TypeAnnotationTooltip',
				modelTypeAnnotationTooltipMarkup.length === 0 ?
					'typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined'
				:
					'typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip'
			),
			`\t\t\t\ttotalCount={${entityValuesName}.totalCount}`,
			`\t\t\t\tgetKey={(${entityValueName}) => ${entityValueName}[EntityMetaKey.SelectorKey]}`,
			`\t\t\t\titems={${uniqueEntityValuesName}}`,
			'\t\t\t>',
			'\t\t\t\t{#snippet Empty()}',
			'\t\t\t\t\t{#if emptyText != null}',
			'\t\t\t\t\t\t<p data-text="muted">{emptyText}</p>',
			'\t\t\t\t\t{:else}',
				`\t\t\t\t\t\t<p data-text="muted">No ${svelteText(sentenceStart(entityLabelPlural(entity)))} yet.</p>`,
			'\t\t\t\t\t{/if}',
			'\t\t\t\t{/snippet}',
			'',
			`\t\t\t\t{#snippet Item({ item: ${entityValueName} })}`,
			`\t\t\t\t\t{@const ${itemFieldsName} = { ...${entityValueName}[EntityMetaKey.Selector], ...${entityValueName}${itemPrefetchedFieldOverrides.length === 0 ? '' : `, ${itemPrefetchedFieldOverrides.join(', ')}`} }}`,
			`\t\t\t\t\t{@const ${itemSelectionName} = select(EntityType.${entity.entityType}, ${entityValueName}[EntityMetaKey.Selector], { sources: collectionSelection.sources })}`,
			...(entityHrefExpression == null ? [] : [
				`\t\t\t\t\t{@const ${itemHrefFieldsName} = { ...${entityValueName}${itemPrefetchedFieldOverrides.length === 0 ? '' : `, ${itemPrefetchedFieldOverrides.join(', ')}`}, ...${entityValueName}[EntityMetaKey.Selector] }}`,
			]),
			...(rowProjectionPaths.length === 0 ? singularRowMarkup(5) : rowProjectionPaths.flatMap((projectionPath) => [
				'\t\t\t\t\t<ProjectionBoundary',
				lowerSvelteAttribute(6, 'resource', `${itemSelectionName}${projectionPath.map(propertyAccess).join('')}`),
				'\t\t\t\t\t>',
				'\t\t\t\t\t\t{#snippet Applicable()}',
				...singularRowMarkup(7),
				'\t\t\t\t\t\t{/snippet}',
				'\t\t\t\t\t</ProjectionBoundary>',
			])),
			'\t\t\t\t{/snippet}',
			'\t\t\t</EntitiesList>',
			'\t\t{/snippet}',
			'\t</ResourceBoundary>',
			'{:else}',
			'\t<EntitiesList',
			'\t\t{...EntitiesListProps}',
			`\t\tentityType={EntityType.${entity.entityType}}`,
			'\t\t{id}',
			'\t\t{title}',
			'\t\tbind:open',
			'\t\t{collapsible}',
			'\t\t{showTypeAnnotation}',
			lowerSvelteAttribute(
				2,
				'TypeAnnotationTooltip',
				modelTypeAnnotationTooltipMarkup.length === 0 ?
					'typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined'
				:
					'typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip'
			),
		'\t/>',
		'{/if}',
		...(pluralView?.content == null ? [] : [
			'',
			...lowerRawLines(pluralView.content.raw, 0),
		]),
	]

	return svelteFile(
		viewModulePath(componentName).replace(/^\$\//, 'src/'),
		{
			script,
			markup,
		}
	)
}

const lowerViewsIndexFile = (entities: readonly Entity[]) => tsFile(
	'src/views/index.ts',
	{
		imports: [
			{
				from: 'svelte',
				typeNames: ['Component'],
			},
			{
				from: '$/schema/EntityType.ts',
				names: ['EntityType'],
			},
			...entities.flatMap((entity) => [
			{
					from: viewModulePath(singularComponentName(entity.entityType)),
				defaultName: singularComponentIdentifier(entity.entityType),
			},
			{
					from: viewModulePath(pluralComponentName(entity)),
				defaultName: pluralComponentIdentifier(entity),
			},
		]),
		],
		body: [
			'type EntityViewComponent = Component<any>',
			'',
			'export const View = {',
			...entities.flatMap((entity) => [
				`\t${entity.entityType}: ${singularComponentIdentifier(entity.entityType)},`,
				`\t${pluralViewName(entity)}: ${pluralComponentIdentifier(entity)},`,
			]),
			'} as const',
			'',
			'export const entityViewComponentByType = {',
			...entities.map((entity) => `\t[EntityType.${entity.entityType}]: View.${entity.entityType},`),
			'} as const satisfies Partial<Record<EntityType, EntityViewComponent>>',
		],
	}
)

const compilePhysicalRouteFilePlans = (renderEntries: readonly RouteRenderEntry[]) => renderEntries.flatMap((entry) => entry.files.flatMap((routeFile) => {
	const routePath = `src/routes/${entry.routePath}/${routeFileName(routeFile.kind)}`.replaceAll('//', '/')
	if (routeFile.kind === RouteFileKind.PageModule) {
		if (routeFile.sharedLayout === true)
			return [{
				path: `src/routes/${entry.routePath}/+layout.ts`.replaceAll('//', '/'),
				appRoutePath: entry.routePath,
				semanticNodeId: entry.internalPath,
				placement: 'layout' as const,
				routeFile,
				inheritedMappings: false,
				projectionOwnedByAncestor: false,
				pageModuleOwnership: 'layout' as const,
			}]
		if ((routeFile.mappings?.length ?? 0) > 1 || routeNeedsPageModule(routePath, routeFile, renderEntries))
			return [{
				path: routePath,
				appRoutePath: entry.routePath,
				semanticNodeId: entry.internalPath,
				placement: 'page' as const,
				routeFile,
				inheritedMappings: false,
				projectionOwnedByAncestor: false,
				pageModuleOwnership: 'page' as const,
			}]

		return []
	}
	if (routeFile.kind === RouteFileKind.Page) {
		const pageModule = entry.files.find((file) => file.kind === RouteFileKind.PageModule)
		const inheritedMappings = (routeFile.mappings?.length ?? 0) === 0 && (pageModule?.mappings?.length ?? 0) > 0
		const projectionOwnedByAncestor = pageModule != null && routeProjectionOwnedByAncestor(
			routePath.replace(/\+page\.svelte$/, '+page.ts'),
			pageModule,
			renderEntries
		)
		const generatedPageModule = pageModule != null && (
			pageModule.sharedLayout === true
			|| (pageModule.mappings?.length ?? 0) > 1
			|| routeNeedsPageModule(routePath.replace(/\+page\.svelte$/, '+page.ts'), pageModule, renderEntries)
		)
		return [{
			path: routePath,
			appRoutePath: entry.routePath,
			semanticNodeId: entry.internalPath,
			placement: 'page' as const,
			routeFile: inheritedMappings ? {
				...routeFile,
				mappings: pageModule?.mappings,
			} : routeFile,
			inheritedMappings,
			projectionOwnedByAncestor,
			pageModuleOwnership: pageModule == null ? 'none' as const
			: pageModule.sharedLayout === true ? 'layout' as const
			: generatedPageModule ? 'page' as const
			: projectionOwnedByAncestor ? 'ancestor' as const
			: 'inline' as const,
			generatedPageModule,
		}]
	}

	return [{
		path: routePath,
		appRoutePath: entry.routePath,
		semanticNodeId: entry.internalPath,
		placement: 'layout' as const,
		routeFile,
		inheritedMappings: false,
		projectionOwnedByAncestor: false,
		pageModuleOwnership: 'none' as const,
	}]
}))

const lowerRouteFiles = (
	plan: CompiledPhysicalRouteFileFacts,
	indexes: LoweringIndexes
) => (
	plan.routeFile.kind === RouteFileKind.PageModule ?
		[lowerPageModuleFile(plan.path, plan.routeFile, indexes)]
	: plan.routeFile.kind === RouteFileKind.Layout ?
		[lowerLayoutFile(plan.path, plan.routeFile, indexes)]
	:
		[lowerPageFile(
			plan.path,
			plan.appRoutePath,
			plan.routeFile,
			indexes,
			plan.generatedPageModule === true
		)]
)

const routeNeedsPageModule = (
	routePath: string,
	routeFile: RouteFile,
	renderEntries: readonly RouteRenderEntry[]
) => (
	routeFile.mappings?.some((mapping) => mapping.projectionSubject?.routeParam != null) === true
		&& !routeProjectionOwnedByAncestor(routePath, routeFile, renderEntries)
)

const routeInlineSelectorExpression = (routeFile: RouteFile, context: Parameters<typeof lowerExpression>[1]) => {
	const mapping = routeFile.mappings?.[0]
	if (mapping == null)
		return undefined
	return lowerObject(mapping.fields.map((field) => [
		field.field,
		lowerExpression(field.value, context),
	]))
}

const routeInlineSelectorImports = (routeFile: RouteFile) => {
	const mapping = routeFile.mappings?.[0]
	if (mapping == null)
		return []
	const imports = new Map<string, Set<string>>()
	for (const field of mapping.fields)
		for (const [from, names] of expressionImports(field.value))
			for (const name of names)
				(imports.get(from) ?? imports.set(from, new Set()).get(from))?.add(name)

	return [...imports.entries()].map(([from, names]) => ({
		from,
		names: [...names],
	}))
}

const routePathPublicId = (routePath: string) => publicRouteId(routePath
	.replace(/^src\/routes\//, '')
	.replace(/\/\+(?:page|layout)\.ts$/, ''))

const routeProjectionKey = (mapping: SelectorRouteMapping) => (
	`${mapping.projection?.entityType ?? mapping.entityType}\0${(mapping.projection?.facetPath ?? []).join('\0')}`
)

const routeProjectionOwnedByAncestor = (
	routePath: string,
	routeFile: RouteFile,
	renderEntries: readonly RouteRenderEntry[]
) => {
	const mappings = routeFile.mappings?.filter((mapping) => mapping.projection != null) ?? []
	if (mappings.length === 0)
		return false

	const href = routePathPublicId(routePath)
	return mappings.every((mapping) => renderEntries.some((entry) => {
		const entryHref = publicRouteId(entry.routePath)
		return (
			entryHref !== href
			&& href.startsWith(`${entryHref}/`)
			&& entry.files.some((file) => (
				file.kind === RouteFileKind.PageModule
				&& file.mappings?.some((candidate) => routeProjectionKey(candidate) === routeProjectionKey(mapping)) === true
			))
		)
	}))
}

const projectionConditionExpression = (condition: _AppFacetCondition, entityExpression: string): string => {
	if ('all' in condition)
		return `(${condition.all.map((child) => projectionConditionExpression(child, entityExpression)).join(' && ')})`

	const field = fieldExpression(entityExpression, facetConditionField(condition))
	return (
		'is' in condition ?
			`${field} === ${emitTypeScript(condition.is)}`
		: 'isOneOf' in condition ?
			`${lowerArray(condition.isOneOf.map(emitTypeScript))}.includes(${field})`
		:
			`(${field} !== undefined && ${field}.some((value: string | number | boolean | null) => value === ${emitTypeScript(condition.includes)}))`
	)
}

const routeMappingContext = (
	routePath: string,
	indexes: LoweringIndexes,
	mapping: SelectorRouteMapping
) => {
	const networkParam = mapping.projectionSubject?.routeParam
	const fieldsExpression = lowerObject(mapping.fields.map((field) => [
		field.field,
		lowerExpression(field.value, {
			params: 'params',
			pageSelector: 'parentData.selector',
		}),
	]))
	const usesParentSelector = mapping.fields.some((field) => expressionUsesKind(field.value, 'pageSelector'))
	const projectionEntity = mapping.projection == null ? undefined : indexes.entityByType[mapping.projection.entityType]
	if (mapping.projection != null && projectionEntity == null)
		throw new Error(`${routePath} references missing projection entity ${mapping.projection.entityType}`)
	const projectionCondition = (() => {
		const projectionConditions = mapping.projection == null || projectionEntity == null ?
			[]
		:
			(() => {
			const facetKey = projectionPathKey(
				projectionEntity.entityType,
				mapping.projection.facetPath
			)
			const facetCondition = indexes.entityFacetByPath[facetKey]?.facet.condition

			return [
				...(indexes.facetAncestorConditionsByPath[facetKey] ?? []),
				...(facetCondition == null ? [] : [facetCondition]),
			]
		})()
		const conditions = [
			...projectionConditions,
			...(mapping.when == null ? [] : [mapping.when]),
		]

		return conditions.length < 2 ? conditions[0] : { all: conditions }
	})()
	const networkExpression = (
		networkParam != null ?
			`(Object.getOwnPropertyDescriptor(networkByCaip2, decodeURIComponent(params.${networkParam}))?.value ?? Object.getOwnPropertyDescriptor(networkBySlug, params.${networkParam})?.value)`
		:
			undefined
	)
	const guardExpressions = [
		...(networkExpression == null || projectionCondition == null ? [] : [
			projectionConditionExpression(projectionCondition, 'projectionNetwork'),
		]),
		...mapping.routeParamMatchers.map(({ param, matchers }) => (
			matchers.length === 1 ?
				`match${pascal(matchers[0] ?? '')}(params.${param})`
			:
				`(${matchers.map((matcher) => `match${pascal(matcher)}(params.${param})`).join(' || ')})`
		)),
	]

	return {
		mapping,
		moduleType: routePath.endsWith('+layout.ts') ? 'LayoutLoad' : 'PageLoad',
		imports: expressionImports({
			kind: 'object',
			fields: [
				...mapping.fields.map((field) => ({
					name: field.field,
					value: field.value,
				})),
				...(mapping.title == null ? [] : [{
					name: 'title',
					value: mapping.title,
				}]),
			],
		} satisfies _Expression),
		entityType: mapping.entityType,
		entitySchemaName: `${mapping.entityType}Schema`,
		selectorVariableName: `${camel(mapping.entityType)}${mapping.selectorName}Selector`,
		usesParentSelector,
		selectorFieldsExpression: fieldsExpression,
		routeParamMatcherImports: mapping.routeParamMatchers.flatMap(({ matchers }) => matchers.map((matcher) => ({
			from: `$/params/${matcher}.ts`,
			names: [{
				name: 'match',
				alias: `match${pascal(matcher)}`,
			}],
		} satisfies ImportSpec))),
		guardExpression: guardExpressions.length === 0 ? undefined : guardExpressions.join(' && '),
		projection: {
			networkParam,
			networkImports: networkParam == null ? [] : ['networkByCaip2', 'networkBySlug'],
			networkExpression,
			selectorGuardExpression: (mapping.projection?.entityType ?? mapping.entityType) !== mapping.entityType || projectionCondition == null ?
				undefined
			:
				projectionConditionExpression(projectionCondition, `${camel(mapping.entityType)}${mapping.selectorName}Selector`),
		},
	}
}

const lowerPageModuleFile = (routePath: string, routeFile: RouteFile, indexes: LoweringIndexes) => {
	const mappings = routeFile.mappings ?? []
	if (mappings.length === 0)
		throw new Error(`${routePath} page module has no selector mappings`)

	if (mappings.length > 1) {
		const contexts = mappings.map((mapping) => routeMappingContext(
			routePath,
			indexes,
			mapping
		))
		const networkExpression = contexts[0]?.projection.networkExpression
		const usesParentSelector = contexts.some((context) => context.usesParentSelector)

		return tsFile(
			routePath,
			{
				imports: mergeImports([
					{
						from: '@sveltejs/kit',
						names: ['error'],
					},
					...(networkExpression == null ? [] : [{
						from: '$/constants/Network.ts',
						names: contexts[0]?.projection.networkImports ?? [],
					}]),
					{
						from: 'arktype',
						names: ['type as arktype'],
					},
					{
						from: '$/schema/$schema.ts',
						names: ['parseEntitySelector'],
						typeNames: ['EntitySelector'],
					},
					{
						from: '$/schema/EntityType.ts',
						names: ['EntityType'],
					},
					{
						from: '$/schema/index.ts',
						names: ['schema'],
					},
					...contexts.flatMap((context) => [
						...context.routeParamMatcherImports,
						...Array.from(context.imports).map(([from, names]) => ({
							from,
							names: [...names],
						})),
						{
							from: schemaModulePath(context.entityType),
							names: [{
								name: context.entityType,
								alias: context.entitySchemaName,
							}],
						},
					]),
					{
						from: './$types',
						typeNames: [contexts[0]?.moduleType ?? 'PageLoad'],
					},
				]),
				body: [
					`export const load: ${contexts[0]?.moduleType ?? 'PageLoad'} = ${usesParentSelector ? 'async ' : ''}({ params${usesParentSelector ? ', parent' : ''} }) => {`,
					...(usesParentSelector ? [
						'\tconst parentData = await parent()',
						'',
					] : []),
					...(networkExpression == null ? [] : [
						`\tconst projectionNetwork = ${networkExpression}`,
						`\tif (projectionNetwork == null) error(404, 'Network projection context not found')`,
						'',
					]),
					'\tconst selectorMappings: {',
					'\t\tentityType: EntityType',
					'\t\tselectorName: string',
					'\t\tselector: EntitySelector<typeof schema, EntityType>',
					'\t}[] = []',
					'',
					...contexts.flatMap((context) => [
						...(context.guardExpression == null ? [] : [`\tif (${context.guardExpression}) {`]),
						`\t${context.guardExpression == null ? '' : '\t'}const ${context.selectorVariableName} = parseEntitySelector(`,
						`\t${context.guardExpression == null ? '' : '\t'}\tschema,`,
						`\t${context.guardExpression == null ? '' : '\t'}\t${context.entitySchemaName},`,
						indent(context.selectorFieldsExpression, context.guardExpression == null ? 2 : 3),
						`\t${context.guardExpression == null ? '' : '\t'})`,
						`\t${context.guardExpression == null ? '' : '\t'}if (!(${context.selectorVariableName} instanceof arktype.errors)${context.projection.selectorGuardExpression == null ? '' : ` && ${context.projection.selectorGuardExpression}`})`,
						`\t${context.guardExpression == null ? '' : '\t'}\tselectorMappings.push({ entityType: EntityType.${context.entityType}, selectorName: ${emitTypeScript(context.mapping.selectorName)}, selector: ${context.selectorVariableName} })`,
						...(context.guardExpression == null ? [] : ['\t}']),
						'',
					]),
					`\tif (selectorMappings.length === 0) error(404, 'Route selector not applicable')`,
					`\tif (selectorMappings.length > 1) error(500, 'Route selector is ambiguous')`,
					'\tconst selectorMapping = selectorMappings[0]',
					'',
					'\treturn { selector: selectorMapping.selector, selectorMapping, selectorMappings }',
					'}',
				],
			}
		)
	}

	const mapping = mappings[0]
	if (mapping == null)
		throw new Error(`${routePath} page module has no selector mapping`)
	const context = routeMappingContext(routePath, indexes, mapping)
	const returnEntries: [string, string | undefined][] = [
		['selector', context.selectorVariableName],
		[
			'title',
			context.mapping.title == null ?
				undefined
			: context.projection.networkExpression == null ?
				lowerExpression(context.mapping.title, {
					params: 'params',
					fields: context.selectorVariableName,
				})
			:
				lowerExpression(context.mapping.title, {
					params: 'params',
					fields: context.selectorVariableName,
				}).replaceAll(context.projection.networkExpression, 'projectionNetwork'),
		],
	]

	return tsFile(
		routePath,
		{
			imports: [
				{
					from: '@sveltejs/kit',
					names: ['error'],
				},
				...(context.projection.networkExpression == null ? [] : [
					{
						from: '$/constants/Network.ts',
						names: context.projection.networkImports,
					},
				]),
				{
					from: 'arktype',
					names: ['type as arktype'],
				},
				...context.routeParamMatcherImports,
				...Array.from(context.imports).map(([from, names]) => ({
					from,
					names: [...names],
				})),
				{
					from: '$/schema/$schema.ts',
					names: ['parseEntitySelector'],
				},
				{
					from: schemaModulePath(context.entityType),
					names: [{
						name: context.entityType,
						alias: context.entitySchemaName,
					}],
				},
				{
					from: '$/schema/index.ts',
					names: ['schema'],
				},
				{
					from: './$types',
					typeNames: [context.moduleType],
				},
			],
			body: [
				...(context.mapping.projection == null ? [] : [
					`// Projection eligibility: facetPath=[${context.mapping.projection.facetPath.map(emitTypeScript).join(', ')}]`,
				]),
				`export const load: ${context.moduleType} = ${context.usesParentSelector ? 'async ' : ''}({ params${context.usesParentSelector ? ', parent' : ''} }) => {`,
				...(context.usesParentSelector ? [
					'\tconst parentData = await parent()',
					'',
				] : []),
				...(context.projection.networkExpression == null ? [] : [
					`\tconst projectionNetwork = ${context.projection.networkExpression}`,
					`\tif (projectionNetwork == null) error(404, 'Network projection context not found')`,
					'',
				]),
				...(context.guardExpression == null ? [] : [
					`\tif (!(${context.guardExpression})) error(404, 'Route mapping not applicable')`,
					'',
				]),
				`\tconst ${context.selectorVariableName} = parseEntitySelector(`,
				'\t\tschema,',
				`\t\t${context.entitySchemaName},`,
				indent(context.selectorFieldsExpression, 2),
				'\t)',
				`\tif (${context.selectorVariableName} instanceof arktype.errors) error(404, ${emitTypeScript(`Invalid ${context.entityType} selector`)})`,
				...(context.projection.selectorGuardExpression == null ? [] : [
					`\tif (!(${context.projection.selectorGuardExpression})) error(404, 'Route projection not applicable')`,
				]),
				'',
				'\treturn ' + indent(lowerObject(returnEntries)).trimStart(),
				'}',
			],
		}
	)
}

const lowerMultiCollectionPageFile = (
	routePath: string,
	appRoutePath: string,
	routeFile: RouteFile,
	indexes: LoweringIndexes
) => {
	const contexts = (routeFile.collections ?? []).map((collection) => {
		const sourceEntity = indexes.entityByType[collection.source.entity]
		const collectionEntity = indexes.entityByType[collection.entity]
		if (sourceEntity == null || collectionEntity == null)
			throw new Error(`${routePath} collection mapping references a missing entity`)

		const selectionQuery = lowerQuery(fieldQueryForName(
			sourceEntity,
			indexes,
			collection.source.field,
			collection.query
			), [], undefined, undefined, undefined, undefined, true)
		const sourceSelection = `select(EntityType.${collection.source.entity}, ${lowerExpression(collection.source.selector, {
			pageSelector: 'data.selector',
			fields: 'data.selector',
			params: 'params',
		})})`
		const projectionPath = isProjectionFieldReference(collection.source.field) ? collection.source.field.slice(0, -1) : []
		const projectionResource = projectionPath.length === 0 ? undefined : `${sourceSelection}${projectionPath.map(propertyAccess).join('')}`
		return {
			collection,
			componentFile: collection.page?.view?.component ?? pluralComponentName(collectionEntity),
			selectionQuery,
			projectionResource,
			selection: projectionResource == null ?
				fieldResourceExpression(
					sourceSelection,
					collection.source.field,
					collection.entity,
					selectionQuery
				)
			:
				fieldProxyResourceExpression(
					'projection',
					fieldNameForReference(collection.source.field),
					selectionQuery
				),
		}
	})
	const usesData = contexts.some(({ collection }) => expressionUsesKind(collection.source.selector, 'pageSelector'))
	const usesParams = (
		routeParamNames(routeId(appRoutePath)).length > 0
		|| contexts.some(({ collection }) => expressionUsesKind(collection.source.selector, 'param'))
	)
	const pageTitle = unique(contexts.map(({ collection }) => (
		collection.page?.text?.title ?? collection.page?.text?.label ?? ''
	)).filter(Boolean))

	return svelteFile(
		routePath,
		{
			script: [
				'// Types/constants',
				...(usesData || usesParams ? ['import type { PageProps } from \'./$types.ts\''] : []),
				...(contexts.some(({ selection }) => selection.includes('EntityProxyField')) ? [
					'import { EntityProxyField } from \'$/client/$proxy.svelte.ts\'',
				] : []),
				'import { EntityType } from \'$/schema/EntityType.ts\'',
				...mergeImports(contexts.flatMap(({ collection }) => (
					[...expressionImports(collection.source.selector).entries()].map(([from, names]) => ({
						from,
						names: [...names],
					}))
				))).map(lowerImport),
				...(contexts.some(({ selectionQuery }) => selectionQuery.includes('Source.')) ? [
					'import { Source } from \'$/sources/Source.ts\'',
				] : []),
				'',
				'',
				'// Context',
				'import { resolve } from \'$app/paths\'',
				'import { select } from \'$/routes/+layout.svelte\'',
				...(usesData || usesParams ? [
					'',
					'',
					'// State',
					'let {',
					...(usesData ? ['\tdata,'] : []),
					...(usesParams ? ['\tparams,'] : []),
					'}: PageProps = $props()',
				] : []),
				'',
				'',
				'// Components',
				'import Page from \'$/components/Page.svelte\'',
				...(contexts.some(({ projectionResource }) => projectionResource != null) ? [
					'import ProjectionBoundary from \'$/components/ProjectionBoundary.svelte\'',
				] : []),
				...unique(contexts.map(({ componentFile }) => (
					`import ${componentIdentifier(componentFile)} from '${viewModulePath(componentFile)}'`
				))),
			],
			head: [
				`<title>${pageTitle.length === 1 ? pageTitle[0] : routeFile.page?.text?.title ?? 'Collections'} • Blockhead</title>`,
			],
			markup: [
				'<Page>',
				...contexts.flatMap(({ collection, componentFile, selection, projectionResource }, index) => [
					...(index === 0 ? [] : ['']),
					...lowerCollectionPageMarkup(
						routeFile,
						collection,
						componentIdentifier(componentFile),
						routeId(appRoutePath),
						indexes,
						selection,
						projectionResource
					),
				]),
				'</Page>',
			],
		}
	)
}

const lowerPageFile = (
	routePath: string,
	appRoutePath: string,
	routeFile: RouteFile,
	indexes: LoweringIndexes,
	hasGeneratedPageModule = false
) => {
	if ((routeFile.mappings?.length ?? 0) > 1)
		return svelteFile(
			routePath,
			{
				script: [
					'// Types/constants',
					'import type { PageProps } from \'./$types.ts\'',
					'',
					'',
					'// Context',
					'import { resolve } from \'$app/paths\'',
					'import { select } from \'$/routes/+layout.svelte\'',
					'',
					'',
					'// State',
					'let {',
					'\tdata,',
					'\tparams,',
					'}: PageProps = $props()',
					'',
					'// Components',
					'import Page from \'$/components/Page.svelte\'',
					'import { entityViewComponentByType } from \'$/views/index.ts\'',
				],
				markup: [
					'<Page>',
					'\t{@const EntityView = entityViewComponentByType[data.selectorMapping.entityType]}',
					'',
					'\t<EntityView',
					lowerSvelteAttribute(2, 'href', lowerRouteResolveExpression(routeId(appRoutePath), routeParamNames(routeId(appRoutePath)).map((param) => [param, `params.${param}`]))),
					'\t\tselection={select(data.selectorMapping.entityType, data.selectorMapping.selector)}',
					'\t/>',
					'</Page>',
				],
			}
		)

	if ((routeFile.collections?.length ?? 0) > 1)
		return lowerMultiCollectionPageFile(
			routePath,
			appRoutePath,
			routeFile,
			indexes
		)

	const mapping = routeFile.mappings?.[0]
	const collection = routeFile.collections?.[0]
	const view = routeFile.page?.view
	const viewEntity = mapping?.entityType ?? view?.entity
	const viewSelector = mapping?.selectorName ?? view?.selector
	const collectionEntity = collection?.entity
	const collectionEntityDefinition = collectionEntity == null ? undefined : indexes.entityByType[collectionEntity]
	const componentFile = view?.component ?? (viewEntity == null ? undefined : singularComponentName(viewEntity))
	const component = componentFile == null ? undefined : componentIdentifier(componentFile)
	const collectionComponentFile = view?.component ?? (collectionEntityDefinition == null ? undefined : pluralComponentName(collectionEntityDefinition))
	const collectionComponent = collectionComponentFile == null ? undefined : componentIdentifier(collectionComponentFile)
	const collectionExpressionImports = collection == null ?
		[]
	:
		[...expressionImports(collection.source.selector).entries()].map(([from, names]) => ({
			from,
			names: [...names],
		}))
	const pageModuleRequired = hasGeneratedPageModule
	const inlineSelectorExpression = pageModuleRequired ?
		undefined
	:
		routeInlineSelectorExpression(routeFile, {
			params: 'params',
		})
	const componentImports = unique([
		...(component == null || componentFile == null ? [] : [`import ${component} from '${viewModulePath(componentFile)}'`]),
		...(collectionComponent == null || collectionComponentFile == null ? [] : [`import ${collectionComponent} from '${viewModulePath(collectionComponentFile)}'`]),
	])
	const collectionQuery = collection == null ? undefined : lowerQuery(collection.query, [], undefined, undefined, undefined, undefined, true)
	const viewEntityDefinition = viewEntity == null ? undefined : indexes.entityByType[viewEntity]
	const collectionEntityDefinitionForTitle = collectionEntity == null ? undefined : indexes.entityByType[collectionEntity]
	const viewSelectionQuery = lowerQuery(viewEntityDefinition == null ? undefined : singularViewQuery(entitySingularView(viewEntityDefinition)), [])
	const viewSelectionFields = viewEntityDefinition == null ?
		[]
	:
		viewResolvedFieldReferences(viewEntityDefinition, indexes)
			.filter((fieldName) => {
				const fieldDefinition = fieldDefinitionByReference(viewEntityDefinition, fieldName, indexes)
				return (
					fieldDefinition != null
					&& fieldDefinition.type !== EntityFieldType.EntitiesReference
				)
			})
	const viewSelectionFieldDefaultSources = viewEntityDefinition == null ? undefined : pageSelectionFieldDefaultSources(viewEntityDefinition, indexes, viewSelectionFields)
	const collectionHref = collection == null ?
		undefined
	:
		indexes.collectionHrefByEntity[collection.entity] ?? routeId(appRoutePath)
	const collectionUsesParams = (
		expressionUsesKind(collection?.source.selector, 'param')
		|| routeParamNames(collectionHref ?? '').length > 0
		|| routeParamNames(routeId(appRoutePath)).length > 0
	)
	const viewContentUsesParams = view?.Content?.raw.includes('params') === true
	const selectorUsesParams = inlineSelectorExpression?.includes('params.') === true
	const selectorExpression = inlineSelectorExpression ?? 'data.selector'
	const usesData = (
		pageModuleRequired
		|| expressionUsesKind(collection?.source.selector, 'pageSelector')
		|| (
			collection == null
			&& viewEntity != null
			&& selectorExpression.includes('data.')
		)
	)
	const hasPageProps = usesData || collectionUsesParams || viewContentUsesParams || selectorUsesParams
	const isEntityDetailPage = (
		collection == null
		&& viewEntity != null
		&& viewEntityDefinition != null
		&& component != null
		&& view?.Content == null
		&& view?.text == null
	)
	const entityTypeLabel = viewEntityDefinition == null ? undefined : displayLabel(entityLabel(viewEntityDefinition))
	const pageTitleLiteral = routeFile.page?.text?.title ?? routeFile.page?.text?.label ?? (
		isEntityDetailPage ?
			undefined
		: collectionEntityDefinitionForTitle != null ?
			sentenceStart(entityLabelPlural(collectionEntityDefinitionForTitle))
		: viewEntityDefinition != null ?
			displayLabel(entityLabel(viewEntityDefinition))
		:
			'Blockhead'
	)
	const hasFieldConditionedViewSources = isEntityDetailPage && isFieldConditionedSourceSelection(mapping?.sourceSelection)
	const pageSelectionExpression = isEntityDetailPage && viewEntity != null ?
		lowerEntityPageSelection(
			indexes,
			viewEntityDefinition,
			viewEntity,
			hasFieldConditionedViewSources ? 'pageEntitySelector' : selectorExpression,
			viewSelector,
			mapping?.sourceSelection
		)
	:
		undefined
	const pageEntityTitleExpression = (
		isEntityDetailPage && viewEntityDefinition != null && entityTypeLabel != null ?
			(() => {
				const serial = summarySerial(viewEntityDefinition)
				const pendingTitle = lowerJoinedItemsExpression(viewEntityDefinition, indexes, declaredSummaryTitleEntries(viewEntityDefinition), 'pageSelection.entitySelector')
				const pendingFallbackTitle = lowerJoinedItemsExpression(
					viewEntityDefinition,
					indexes,
					viewItems(entitySingularView(viewEntityDefinition)?.summary?.titleFallback),
					'pageSelection.entitySelector'
				)
				const pendingSerialTitle = serial == null ?
					lowerFirstDeclaredExpression([pendingTitle, pendingFallbackTitle])
				:
					lowerSerialTextExpression(viewEntityDefinition, indexes, serial, 'pageSelection.entitySelector')
				const resolvedEntityFieldsExpression = '({ ...pageSelection.entitySelector, ...pageSelection.entity })'
				const resolvedTitle = lowerJoinedItemsExpression(viewEntityDefinition, indexes, declaredSummaryTitleEntries(viewEntityDefinition), resolvedEntityFieldsExpression)
				const resolvedFallbackTitle = lowerJoinedItemsExpression(
					viewEntityDefinition,
					indexes,
					viewItems(entitySingularView(viewEntityDefinition)?.summary?.titleFallback),
					resolvedEntityFieldsExpression
				)
				const resolvedSerialTitle = serial == null ?
					lowerFirstDeclaredExpression([resolvedTitle, resolvedFallbackTitle])
				:
					lowerSerialTextExpression(viewEntityDefinition, indexes, serial, resolvedEntityFieldsExpression)
				return usesData ?
					`(data.title ?? (pageSelection.entity == null ? ${lowerFirstDeclaredExpression([pendingSerialTitle, emitTypeScript(entityTypeLabel)])} : ${lowerFirstDeclaredExpression([resolvedSerialTitle, emitTypeScript(entityTypeLabel)])}))`
				:
					`(pageSelection.entity == null ? ${lowerFirstDeclaredExpression([pendingSerialTitle, emitTypeScript(entityTypeLabel)])} : ${lowerFirstDeclaredExpression([resolvedSerialTitle, emitTypeScript(entityTypeLabel)])})`
			})()
		:
			undefined
	)
	const routeFileUsesResolve = view?.Content == null && (component != null && viewEntity != null || collection != null && collectionComponent != null)
	const collectionSourceEntityDefinition = collection == null ? undefined : indexes.entityByType[collection.source.entity]
	const collectionSelectionQuery = collection == null || collectionSourceEntityDefinition == null ? '' : lowerQuery(fieldQueryForName(
		collectionSourceEntityDefinition,
		indexes,
		collection.source.field,
		collection.query
	), [], undefined, undefined, undefined, undefined, true)
	const collectionSourceSelectionExpression = collection == null ? '' : `select(EntityType.${collection.source.entity}, ${lowerExpression(collection.source.selector, {
		pageSelector: 'data.selector',
		fields: 'data.selector',
		params: 'params',
	})})`
	const collectionProjectionPath = collection == null || !isProjectionFieldReference(collection.source.field) ? [] : collection.source.field.slice(0, -1)
	const collectionProjectionResourceExpression = collectionProjectionPath.length === 0 ? undefined : `${collectionSourceSelectionExpression}${collectionProjectionPath.map(propertyAccess).join('')}`
	const collectionSelectionExpression = collection == null || collectionSourceEntityDefinition == null ?
		''
	: collectionProjectionResourceExpression != null ?
		fieldProxyResourceExpression(
			'projection',
			fieldNameForReference(collection.source.field),
			collectionSelectionQuery
		)
	:
		fieldResourceExpression(
			collectionSourceSelectionExpression,
			collection.source.field,
			collection.entity,
			collectionSelectionQuery
		)

	return svelteFile(
		routePath,
		{
			script: [
				'// Types/constants',
				...(hasPageProps ? ['import type { PageProps } from \'./$types.ts\''] : []),
					...(collectionSelectionExpression.includes('EntityProxyField') ? [
						'import { EntityProxyField } from \'$/client/$proxy.svelte.ts\'',
					] : []),
				'import { EntityType } from \'$/schema/EntityType.ts\'',
				...collectionExpressionImports.map(lowerImport),
				...(
					inlineSelectorExpression == null && !(isEntityDetailPage && viewEntityDefinition != null) ?
						[]
					:
						mergeImports([
							...(inlineSelectorExpression == null ? [] : routeInlineSelectorImports(routeFile)),
							...(isEntityDetailPage && viewEntityDefinition != null ? viewItemImports(viewEntityDefinition, indexes) : []),
						]).map(lowerImport)
				),
				...lowerImportObject(view?.imports).map(lowerImport),
				...(isFieldConditionedSourceSelection(mapping?.sourceSelection) ? [
					`import { ${defaultSourcesName(mapping.sourceSelection)}, ${sourceSelectionByKeyName(mapping.sourceSelection)} } from '$/sources/$sourceSelections.ts'`,
				] : []),
				...(collectionQuery?.includes('Source.') || collectionSelectionQuery.includes('Source.') || viewSelectionQuery?.includes('Source.') || viewSelectionFieldDefaultSources != null || pageSelectionExpression?.includes('Source.') === true ? [
					'import { Source } from \'$/sources/Source.ts\'',
				] : []),
				'',
				'',
				'// Context',
				...(routeFileUsesResolve || view?.Content?.raw.includes('resolve(') === true ? ['import { resolve } from \'$app/paths\''] : []),
				'import { select } from \'$/routes/+layout.svelte\'',
				...(hasPageProps ? [
					'',
					'',
					'// State',
					'let {',
					...(usesData ? ['\tdata,'] : []),
					...(collectionUsesParams || viewContentUsesParams || selectorUsesParams ? ['\tparams,'] : []),
					'}: PageProps = $props()',
				] : []),
				...(pageSelectionExpression == null || pageEntityTitleExpression == null ? [] : [
					'',
					...(hasFieldConditionedViewSources ? [
						`const pageEntitySelector = $derived(${selectorExpression})`,
					] : []),
					`const pageSelection = $derived(${pageSelectionExpression})`,
					`const pageEntityTitle = $derived(${pageEntityTitleExpression})`,
				]),
				...(view?.script == null ? [] : [
					'',
					'',
					...view.script.split('\n'),
				]),
				'',
				'',
				'// Components',
				'import Page from \'$/components/Page.svelte\'',
				...(collectionProjectionResourceExpression == null ? [] : [
					'import ProjectionBoundary from \'$/components/ProjectionBoundary.svelte\'',
				]),
				...componentImports,
			],
			head: (
				pageEntityTitleExpression != null && entityTypeLabel != null ?
					[
						`<title>{pageEntityTitle} • ${entityTypeLabel} • Blockhead</title>`,
					]
				: pageTitleLiteral == null ?
					undefined
				:
					[
						`<title>${pageTitleLiteral} • Blockhead</title>`,
					]
			),
			markup: [
				'<Page>',
				...(collection == null ?
					lowerEntityPageMarkup(routeFile, component, selectorExpression, routeId(appRoutePath), indexes, pageSelectionExpression == null ? undefined : 'pageSelection')
				:
						lowerCollectionPageMarkup(
							routeFile,
							collection,
							collectionComponent,
							routeId(appRoutePath),
							indexes,
							collectionSelectionExpression,
							collectionProjectionResourceExpression
						)
				),
				'</Page>',
			],
			style: view?.style?.split('\n'),
		}
	)
}

const lowerEntityPageMarkup = (
	routeFile: RouteFile,
	component: string | undefined,
	selectorExpression: string,
	href: string,
	indexes: LoweringIndexes,
	selectionBinding?: string
) => {
	const mapping = routeFile.mappings?.[0]
	const view = routeFile.page?.view
	const entityType = mapping?.entityType ?? view?.entity
	const selectorName = mapping?.selectorName ?? view?.selector
	if (view?.Content != null)
		return view.Content.raw
			.split('\n')
			.filter((line) => !/^\s*pageTitle=\{true\}\s*$/.test(line))
			.map((line) => line === '' ? '' : `\t${line}`)
	if (view?.text != null)
		return [
			`\t<h1>${view.text}</h1>`,
		]
	if (component == null || entityType == null)
		return routeFile.page?.text?.title == null ? [] : [`\t<h1>${routeFile.page.text.title}</h1>`]

	return [
		`\t<${component}`,
		lowerSvelteAttribute(2, 'href', lowerRouteResolveExpression(href, routeParamNames(href).map((param) => [param, `params.${param}`]))),
		lowerSvelteAttribute(
			2,
			'selection',
			selectionBinding ?? lowerEntityPageSelection(
				indexes,
				indexes.entityByType[entityType],
				entityType,
				selectorExpression,
				selectorName,
				mapping?.sourceSelection
			)
		),
		'\t/>',
	]
}

const lowerCollectionPageMarkup = (
	routeFile: RouteFile,
	collection: CollectionRouteMapping,
	collectionComponent: string | undefined,
	href: string,
	indexes: LoweringIndexes,
	collectionSelectionExpression: string,
	projectionResourceExpression?: string
) => {
	if (collectionComponent == null)
		return []

	const source = collection.source
	const sourceEntity = indexes.entityByType[source.entity]
	if (sourceEntity == null)
		throw new Error(`${collection.entity} collection references missing source entity ${source.entity}`)

	const collectionEntity = indexes.entityByType[collection.entity]
	if (collectionEntity == null)
		throw new Error(`${collection.entity} collection references missing entity`)

	const componentIndent = projectionResourceExpression == null ? 1 : 3
	const component = [
		`${'\t'.repeat(componentIndent)}<${collectionComponent}`,
		lowerSvelteAttribute(componentIndent + 1, 'href', lowerRouteResolveExpression(href, routeParamNames(href).map((param) => [param, `params.${param}`]))),
		`${'\t'.repeat(componentIndent + 1)}title=${emitTypeScript(collection.page?.text?.title ?? routeFile.page?.text?.title ?? sentenceStart(entityLabelPlural(collectionEntity)))}`,
		lowerSvelteAttribute(componentIndent + 1, 'selection', collectionSelectionExpression),
		`${'\t'.repeat(componentIndent + 1)}id=${emitTypeScript(routeCollectionIdForFieldReference(source.field))}`,
		`${'\t'.repeat(componentIndent)}/>`,
	]
	if (projectionResourceExpression == null)
		return component

	return [
		'\t<ProjectionBoundary',
		lowerSvelteAttribute(2, 'resource', projectionResourceExpression),
		'\t>',
		'\t\t{#snippet Applicable(projection)}',
		...component,
		'\t\t{/snippet}',
		'\t</ProjectionBoundary>',
	]
}

const lowerLayoutFile = (routePath: string, routeFile: RouteFile, indexes: LoweringIndexes) => {
	if (routeFile.detailLayout != null) {
		const {
			components,
			hrefExpression,
			keyExpression,
			detailViewExpression,
			detailSelectionExpression,
		} = routeFile.detailLayout
		const parentPageCollapsibleLines = [
			'<ParentPageCollapsible',
			lowerSvelteAttribute(1, 'href', hrefExpression),
			'>',
			'\t{#snippet Summary()}',
			'\t\t{@const DetailView = ' + detailViewExpression + '}',
			'',
			'\t\t<DetailView',
			`\t\t\tselection={${detailSelectionExpression}}`,
			lowerSvelteAttribute(3, 'href', hrefExpression),
			'\t\t\tlayout={EntityLayout.SummaryInline}',
			'\t\t/>',
			'\t{/snippet}',
			'',
			'\t{@render children()}',
			'</ParentPageCollapsible>',
		]

		return svelteFile(
			routePath,
			{
				script: [
					'// Types/constants',
					'import type { LayoutProps } from \'./$types.ts\'',
					'import { EntityType } from \'$/schema/EntityType.ts\'',
					'',
					'',
					'// Context',
					'import { resolve } from \'$app/paths\'',
					'import { select } from \'$/routes/+layout.svelte\'',
					'',
					'',
					'// State',
					'let {',
					'\tchildren,',
					'\tdata,',
					'\tparams,',
					'}: LayoutProps = $props()',
					'',
					'',
					'// Components',
					'import { EntityLayout } from \'$/components/EntityView.svelte\'',
					'import ParentPageCollapsible from \'$/components/ParentPageCollapsible.svelte\'',
					...components.map((component) => `import ${componentIdentifier(component)} from '${viewModulePath(component)}'`),
				],
				markup: keyExpression == null ?
					parentPageCollapsibleLines
				:
					[
						`{#key ${keyExpression}}`,
						...parentPageCollapsibleLines.map((line) => indent(line)),
						'{/key}',
					],
			}
		)
	}

	if (routeFile.layout == null)
		throw new Error(`${routePath} layout route file is missing layout metadata`)

	if (routeFile.layout.entity != null) {
		const componentFile = routeFile.layout.component ?? singularComponentName(routeFile.layout.entity)
		const component = componentIdentifier(componentFile)
		const selectorExpression = routeFile.layout.selector == null ? undefined : lowerExpression(routeFile.layout.selector, {
			params: 'params',
		})
		const hrefParamNames = routeFile.layout.href == null ? [] : routeParamNames(routeFile.layout.href)
		const hrefExpression = routeFile.layout.href == null ?
			undefined
		:
			lowerRouteResolveExpression(routeFile.layout.href, hrefParamNames.map((param) => [param, `params.${param}`]))
		const keyExpression = (
			hrefParamNames.length === 0 ?
				undefined
			: hrefParamNames.length === 1 ?
				`params.${hrefParamNames[0]}`
			:
				`[${hrefParamNames.map((param) => `params.${param}`).join(', ')}].join(':')`
		)
		const idExpression = routeFile.layout.id == null ?
			undefined
		:
			lowerExpression(routeFile.layout.id, {
				params: 'params',
			})
		const imports = mergeImports([
			...(routeFile.layout.selector == null ? [] : Array.from(expressionImports(routeFile.layout.selector)).map(([from, names]) => ({
				from,
				names: [...names],
			}))),
			...(routeFile.layout.id == null ? [] : Array.from(expressionImports(routeFile.layout.id)).map(([from, names]) => ({
				from,
				names: [...names],
			}))),
		])
		const parentPageCollapsibleLines = [
			'<ParentPageCollapsible',
			...(hrefExpression == null ? [] : [lowerSvelteAttribute(1, 'href', hrefExpression)]),
			...(idExpression == null ? [] : [lowerSvelteAttribute(1, 'id', idExpression)]),
			'>',
			'\t{#snippet Summary()}',
			`\t\t<${component}`,
			lowerSvelteAttribute(3, 'selection', selectorExpression == null ? `select(EntityType.${routeFile.layout.entity}, data.selector)` : `select(EntityType.${routeFile.layout.entity}, ${selectorExpression})`),
			...(hrefExpression == null ? [] : [lowerSvelteAttribute(3, 'href', hrefExpression)]),
			'\t\t\tlayout={EntityLayout.SummaryInline}',
			'\t\t/>',
			'\t{/snippet}',
			'',
			'\t{@render children()}',
			'</ParentPageCollapsible>',
		]

		return svelteFile(
			routePath,
			{
				script: [
					'// Types/constants',
					'import type { LayoutProps } from \'./$types.ts\'',
					'import { EntityType } from \'$/schema/EntityType.ts\'',
					...imports.map(lowerImport),
					'',
					'',
					'// Context',
					...(hrefExpression == null ? [] : ['import { resolve } from \'$app/paths\'']),
					'import { select } from \'$/routes/+layout.svelte\'',
					'',
					'',
					'// State',
					'let {',
					'\tchildren,',
					...(selectorExpression == null ? ['\tdata,'] : []),
					'\tparams,',
					'}: LayoutProps = $props()',
					'',
					'',
					'// Components',
					'import { EntityLayout } from \'$/components/EntityView.svelte\'',
					'import ParentPageCollapsible from \'$/components/ParentPageCollapsible.svelte\'',
					`import ${component} from '${viewModulePath(componentFile)}'`,
				],
				markup: keyExpression == null ?
					parentPageCollapsibleLines
				:
					[
						`{#key ${keyExpression}}`,
						...parentPageCollapsibleLines.map((line) => indent(line)),
						'{/key}',
					],
			}
			)
		}

	const title = routeFile.layout.kind === 'group' ? routeFile.layout.title : undefined
	if (title == null)
		throw new Error(`${routePath} group layout is missing title`)

	const href = routeFile.layout.kind === 'group' ? routeFile.layout.href : undefined
	const hrefParams = href == null ? [] : routeParamNames(href)
	const hrefExpression = href == null ?
		undefined
	:
		lowerResolveExpression(href, hrefParams.map((param) => [param, `params.${param}`]))
	const usesParams = hrefParams.length > 0

	return svelteFile(
		routePath,
		{
			script: [
				...(usesParams ? [
					'// Types/constants',
					'import type { LayoutProps } from \'./$types.ts\'',
					'',
					'',
				] : []),
				...(href == null ? [] : [
					'// Context',
					'import { resolve } from \'$app/paths\'',
					'',
					'',
				]),
				'// State',
				...(usesParams ? [
					'let {',
					'\tchildren,',
					'\tparams,',
					'}: LayoutProps = $props()',
				] : [
					'let { children } = $props()',
				]),
				'',
				'',
				'// Components',
				'import ParentPageCollapsible from \'$/components/ParentPageCollapsible.svelte\'',
			],
			markup: [
				'<ParentPageCollapsible',
				`\ttitle=${emitTypeScript(title)}`,
				...(hrefExpression == null ? [] : [lowerSvelteAttribute(1, 'href', hrefExpression)]),
				'>',
				'\t{@render children()}',
				'</ParentPageCollapsible>',
			],
		}
	)
}

const readText = async (filePath: string) => {
	try {
		return await fs.readFile(filePath, 'utf8')
	} catch (error) {
		if (typeof error === 'object' && error != null && 'code' in error && error.code === 'ENOENT')
			return undefined

		throw error
	}
}
const readDirectory = async (directoryPath: string) => {
	try {
		return await fs.readdir(directoryPath, {
			withFileTypes: true,
		})
	} catch (error) {
		if (typeof error === 'object' && error != null && 'code' in error && error.code === 'ENOENT')
			return []

		throw error
	}
}


const generatedRelative = (absolutePath: string) => path.relative(generatedOutputRoot, absolutePath)

const isGeneratedFile = async (filePath: string) => {
	const source = await readText(path.join(generatedOutputRoot, filePath))
	return source?.startsWith(generatedHeader) === true || source?.startsWith(generatedSvelteHeader) === true
}

const generatedOwnedPaths = async (files: readonly GeneratedFile[]) => {
	const paths: string[] = []
	const walk = async (
		directory: string,
		recursive: boolean
	) => {
		const entries = await readDirectory(directory)
		for (const entry of entries) {
			const absolutePath = path.join(directory, entry.name)
			if (entry.isDirectory()) {
				if (recursive)
					await walk(absolutePath, true)
				continue
			}
			const filePath = generatedRelative(absolutePath)
			if (await isGeneratedFile(filePath))
				paths.push(filePath)
		}
	}

	await walk(routeRoot, true)
	for (const directory of new Set(files.flatMap((generatedFile) => (
		generatedFile.path.startsWith('src/') && !generatedFile.path.startsWith('src/routes/') ?
			[path.dirname(generatedFile.path)]
		:
			[]
	))))
		await walk(path.join(generatedOutputRoot, directory), false)

	return paths
}

const removeEmptyRouteDirectories = async (directory = routeRoot) => {
	const entries = await fs.readdir(directory, {
		withFileTypes: true,
	})
	for (const entry of entries) {
		if (entry.isDirectory())
			await removeEmptyRouteDirectories(path.join(directory, entry.name))
	}
	if (directory === routeRoot)
		return
	const remaining = await fs.readdir(directory)
	if (remaining.length === 0)
		await fs.rmdir(directory)
}

const cleanStaleGeneratedFiles = async (files: readonly GeneratedFile[]) => {
	const expected = new Set(files.map((generatedFile) => generatedFile.path))
	for (const filePath of (await generatedOwnedPaths(files)).filter((filePath) => (
		!expected.has(filePath)
		&& !protectedRouteFiles.has(filePath)
		&& !protectedSchemaFiles.has(filePath)
	)))
		await fs.rm(path.join(generatedOutputRoot, filePath), {
			force: true,
		})

	await removeEmptyRouteDirectories()
}

const checkFiles = async (files: readonly GeneratedFile[]) => {
	const expected = new Set(files.map((generatedFile) => generatedFile.path))
	const stale = (await generatedOwnedPaths(files)).filter((filePath) => (
		!expected.has(filePath)
		&& !protectedRouteFiles.has(filePath)
		&& !protectedSchemaFiles.has(filePath)
	))
	const drift: string[] = []

	for (const generatedFile of files) {
		const existing = await readText(path.join(generatedOutputRoot, generatedFile.path))
		if (existing !== renderGeneratedFile(generatedFile))
			drift.push(generatedFile.path)
	}

	if (drift.length > 0 || stale.length > 0)
		throw new Error([
			...(drift.length === 0 ? [] : [
				'Generated files are stale:',
				...drift.map((filePath) => `  ${filePath}`),
			]),
			...(stale.length === 0 ? [] : [
				'Stale generated files exist:',
				...stale.map((filePath) => `  ${filePath}`),
			]),
		].join('\n'))
}

const writeFiles = async (files: readonly GeneratedFile[]) => {
	for (const generatedFile of [...files].sort((left, right) => left.path.localeCompare(right.path, 'en', {
		sensitivity: 'base',
		numeric: true,
	}))) {
		const absolutePath = path.join(generatedOutputRoot, generatedFile.path)
		const renderedFile = renderGeneratedFile(generatedFile)
		if (await readText(absolutePath) === renderedFile)
			continue

		await fs.mkdir(path.dirname(absolutePath), {
			recursive: true,
		})
		await fs.writeFile(absolutePath, renderedFile)
	}
	await cleanStaleGeneratedFiles(files)
}

const cleanFiles = async (files: readonly GeneratedFile[]) => {
	for (const generatedFile of files)
		await fs.rm(path.join(generatedOutputRoot, generatedFile.path), {
			force: true,
		})
	await removeEmptyRouteDirectories()
}

const checkGeneratedViewImportsResolve = async (files: readonly GeneratedFile[]) => {
	const expected = new Set(files.map((generatedFile) => generatedFile.path))
	const missing: string[] = []
	for (const generatedFile of files) {
		if (generatedFile.kind === 'text')
			continue

		const source = renderGeneratedFile(generatedFile)
		for (const match of source.matchAll(/from ['"]\$\/views\/([^'"]+\.svelte)['"]/g)) {
			const targetPath = `src/views/${match[1]}`
			if (!expected.has(targetPath))
				missing.push(`${generatedFile.path} imports missing ${targetPath}`)
		}
	}
	if (missing.length > 0)
		throw new Error(`Generated view imports do not resolve:\n${missing.join('\n')}`)
}

const main = async () => {
	const command = process.argv[2] ?? 'check'
	const files = compileApp(app).generatedFiles
	await checkGeneratedViewImportsResolve(files)

	if (command === 'check') {
		await checkFiles(files)
		return
	}
	if (command === 'generate') {
		await writeFiles(files)
		return
	}
	if (command === 'clean') {
		await cleanFiles(files)
		return
	}

	throw new Error(`Unknown command: ${command}`)
}

if (process.argv.slice(1).some((argument) => path.resolve(argument) === fileURLToPath(import.meta.url)))
	await main()
