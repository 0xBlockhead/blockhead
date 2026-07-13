import { execFile } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

import { parse as parseSvelte } from 'svelte/compiler'

import {
	EntityFieldCardinality,
	EntityFieldType,
	EntityType,
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
	details?: readonly RouteDetail[]
	page?: RoutePage
	mappings?: readonly SelectorRouteMapping[]
	collections?: readonly CollectionRouteMapping[]
}
type RouteProjectionNetwork = App['routes']['fixtureNetworks'][number]
type ImportName = string | {
	name: string
	alias: string
}

const projectionPathKey = (
	entityType: string,
	path: readonly string[]
) => `${entityType}${path.join('')}`

const facetByEntityTypeAndPath = new Map<string, EntityFacet>()
const facetsByEntityType = new Map<string, EntityFacet[]>()
for (const entity of app.schema.entities) {
	const facets = (entity.facets ?? []).map((facet) => ({
		facet,
		path: [facet.name],
	}))
	for (const {
		facet,
		path,
	} of facets) {
		facetByEntityTypeAndPath.set(projectionPathKey(entity.entityType, path), facet)
		facetsByEntityType.set(entity.entityType, [
			...(facetsByEntityType.get(entity.entityType) ?? []),
			facet,
		])
		for (const childFacet of facet.facets ?? [])
			facets.push({
				facet: childFacet,
				path: [
					...path,
					childFacet.name,
				],
			})
	}
}

type ImportSpec = {
	from: string
	defaultName?: string
	names?: ImportName[]
	typeNames?: ImportName[]
}

const entityLabel = (entity: Entity) => entity.labels.singular
const entityLabelPlural = (entity: Entity) => entity.labels.plural
const entitySingularView = (entity: Entity) => entity.views.singular
const singularViewQuery = (singularView: ReturnType<typeof entitySingularView>) => singularView?.query
const singularViewContent = (singularView: ReturnType<typeof entitySingularView>) => singularView?.content
const singularViewDetails = (singularView: ReturnType<typeof entitySingularView>) => singularView?.details
const singularViewLatest = (singularView: ReturnType<typeof entitySingularView>) => singularView?.latest
const singularViewLists = (singularView: ReturnType<typeof entitySingularView>) => singularView?.lists
const entityPluralView = (entity: Entity) => entity.views.plural
const isProjectionFieldReference = (field: FieldReference): field is Extract<FieldReference, readonly string[]> => (
	Array.isArray(field) && field.length > 1 && field.every((part) => typeof part === 'string')
	&& /^[A-Z]/.test(field[0] ?? '')
)
type TsFileAst = {
	imports?: ImportSpec[]
	body: string[]
}
type SvelteFileAst = {
	moduleScript?: string[]
	script?: string[]
	head?: string[]
	markup?: string[]
	style?: string[]
}
type GeneratedFile =
	| {
			path: string
			kind: 'ts'
			ast: TsFileAst
		}
	| {
			path: string
			kind: 'svelte'
			ast: SvelteFileAst
		}
	| {
			path: string
			kind: 'text'
			body: string[]
		}
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
	entityType: string
	selectorName: string
	field: string
}
type SelectorRouteMapping = {
	entityType: string
	selectorName: string
	paramBindings: Readonly<Record<string, readonly string[]>>
	routeParamMatchers: readonly {
		param: string
		matchers: readonly string[]
	}[]
	ancestorBindings: readonly SelectorAncestorBinding[]
	fixture?: Readonly<Partial<Record<string, string>>>
	variants?: readonly Readonly<Partial<Record<string, string>>>[]
	boundaryLiveOptional?: true
	href?: {
		entityHref?: false
		conditions?: EntityHref['conditions']
		params: EntityHref['params']
	}
	fields: readonly {
		field: string
		value: _Expression
	}[]
	title?: _Expression
	projection?: {
		entityType: string
		facetPath: readonly string[]
	}
	projectionSubject?: {
		entityType: string
		selector: _Expression
		routeParam?: string
	}
	page?: NonNullable<NonNullable<App['routes']['children'][string]['selectors']>[string]>[string]['page']
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
type RouteFixtureMetadata = {
	id: string
	label?: string
	routeKind?: 'detail' | 'hub' | 'collection' | 'projection' | 'facet'
	projectionEntity?: EntityType
	projectionPath?: readonly [string, ...string[]]
	fixture?: Readonly<Partial<Record<string, string>>>
	variants?: readonly Readonly<Partial<Record<string, string>>>[]
	boundaryLiveOptional?: true
}
type AppIndexes = {
	entityTypes: string[]
	activeEntities: Entity[]
	entityByType: Map<string, Entity>
	valueTypeById: Map<string, App['schema']['valueTypes'][number]>
	sourceIds: Set<string>
	sourceProviderIds: Set<string>
	routeNodeByInternalPath: Map<string, RouteNode>
	routeNodesByPublicPath: Map<string, RouteNode[]>
	routeNodesByPublicShape: Map<string, RouteNode[]>
	routeMappingByEntityTypeAndSelector: Map<string, SelectorRouteMapping>
	routeMappingsByNode: Map<string, readonly SelectorRouteMapping[]>
	collectionHrefByEntity: Map<string, string>
	collectionHrefBySourceField: Map<string, CollectionRouteHref>
	entityHrefsByType: Map<string, EntityHref[]>
	generatedComponents: Set<string>
	sourceSelections: _SourceSelection[]
}

const repoRoot = process.cwd()
const generatedOutputRoot = path.resolve(process.env.APP_GENERATED_OUTPUT_ROOT ?? repoRoot)
const execFileAsync = promisify(execFile)
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

const q = (value: string) => JSON.stringify(value).replaceAll('"', "'")

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

const renderRawLines = (source: string, level: number) => lines(source)
	.map((line) => line.trim() === '' ? '' : `${'\t'.repeat(level)}${line}`)

const renderTooltipParagraphs = (paragraphs: readonly string[], level: number) => paragraphs.flatMap((paragraph) => [
	`${'\t'.repeat(level)}<p>`,
	`${'\t'.repeat(level + 1)}${svelteText(paragraph)}`,
	`${'\t'.repeat(level)}</p>`,
])

const renderSvelteAttribute = (level: number, name: string, expression: string) => {
	const attributeIndent = '\t'.repeat(level)
	if (!expression.includes('\n'))
		return `${attributeIndent}${name}={${expression}}`

	return [
		`${attributeIndent}${name}={`,
		...reindentLines(expression.split('\n'), level + 1),
		`${attributeIndent}}`,
	].join('\n')
}

const renderSvelteConst = (level: number, name: string, expression: string) => {
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

const propertyAccess = (property: string) => /^[A-Za-z_$][\w$]*$/.test(property) ? `.${property}` : `[${q(property)}]`

const objectPropertyKey = (property: string) => /^[A-Za-z_$][\w$]*$/.test(property) ? property : q(property)

const optionalPropertyAccess = (property: string) => /^[A-Za-z_$][\w$]*$/.test(property) ? `?.${property}` : `?.[${q(property)}]`

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

const optionalFieldExpression = (base: string, field: string) => [
	base,
	...field.split('.'),
]
	.filter(Boolean)
	.reduce((expression, part) => (
		expression === '' ?
			part
		:
			`${expression}${optionalPropertyAccess(part)}`
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

const renderProjectionBoundaryLines = (
	field: FieldReference,
	content: string[],
	level: number
) => {
	if (!isProjectionFieldReference(field))
		return content

	const projectionResourceExpression = fieldResourceBaseExpression('selection', field)
	return [
		`${'\t'.repeat(level)}<ProjectionBoundary`,
		renderSvelteAttribute(level + 1, 'resource', projectionResourceExpression),
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
		return `${fieldBase}[EntityProxyField](${q(fieldName)})`

	return `${fieldBase}[EntityProxyField](${q(fieldName)}, ${query})`
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

const renderResolveExpression = (href: string, params: readonly [string, string][] = []) => {
	if (params.length === 0)
		return `resolve(${q(publicRouteId(href))})`

	return `resolve(${q(publicRouteId(href))}, ${renderObject(params.map(([param, value]) => [param, value]))})`
}

const renderRouteResolveExpression = (href: string, params: readonly [string, string][] = []) => {
	return renderResolveExpression(href, params)
}

const renderRouteParamExpression = (
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
		return routeParamStringExpression(`${renderRouteParamValueExpression(expression.value, context.fields ?? 'selector')}${propertyAccess(expression.property)}`, decode)

	if (expression.kind === 'template')
		return `\`${expression.parts.map((part) => (
			typeof part === 'string' ?
				templateStringText(part)
			:
				`\${${routeParamStringExpression(renderRouteParamValueExpression(part, context.fields ?? 'selector', decode), decode)}}`
		)).join('')}\``

	if (expression.kind === 'case') {
		const valueExpression = renderAppExpression(expression, context)
		return valueExpression.includes('\n') ?
			[
				'String(',
				indent(valueExpression),
				')',
			].join('\n')
		:
			`String(${valueExpression})`
	}

	const looseExpression = renderAppExpression(expression, context)
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

const renderImport = (spec: ImportSpec) => {
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

	return `import ${typeOnlyImport ? 'type ' : ''}${importClause} from ${q(generatedImportSpecFrom(spec))}`
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

const renderTsFile = (ast: TsFileAst) => [
	generatedHeader,
	'',
	...mergeImports(ast.imports ?? []).flatMap((importSpec) => [
		renderImport(importSpec),
	]),
	...(ast.imports == null || ast.imports.length === 0 ? [] : ['']),
	...ast.body,
].join('\n')

const parseScriptImport = (line: string): ImportSpec | undefined => {
	const match = line.match(/^import\s+(type\s+)?(.+)\s+from\s+'([^']+)'$/)
	if (match == null)
		return undefined

	const importType = match[1]
	const importsExpression = match[2]
	const from = match[3]
	const namedImportsMatch = importsExpression.match(/\{([^}]+)\}/)
	const namedImports = namedImportsMatch?.[1]
		.split(',')
		.map((name) => name.trim())
		.filter(Boolean) ?? []
	const defaultName = importsExpression
		.replace(/\{[^}]+\}/, '')
		.replace(',', '')
		.trim()

	return importType == null ? {
		from,
		...(defaultName === '' ? {} : { defaultName }),
		names: namedImports,
	} : {
		from,
		typeNames: [
			...(defaultName === '' ? [] : [defaultName]),
			...namedImports,
		],
	}
}

const dedupeScriptImports = (script: readonly string[]) => {
	const imports = new Map<string, {
		index: number
		importSpec: ImportSpec
	}>()
	const output: string[] = []
	for (const line of script) {
		if (!line.startsWith('import ')) {
			output.push(line)
			continue
		}

		const importSpec = parseScriptImport(line)
		if (importSpec == null) {
			if (!output.includes(line))
				output.push(line)
			continue
		}

		const key = generatedImportSpecFrom(importSpec)
		const existing = imports.get(key)
		if (existing == null) {
			const normalizedImportSpec = {
				...importSpec,
				from: key,
			}
			imports.set(key, {
				index: output.length,
				importSpec: normalizedImportSpec,
			})
			output.push(renderImport(normalizedImportSpec))
			continue
		}

		const mergedImportSpec = mergeImports([
			existing.importSpec,
			importSpec,
		])[0]
		imports.set(key, {
			index: existing.index,
			importSpec: mergedImportSpec,
		})
		output[existing.index] = renderImport(mergedImportSpec)
	}

	return output
}

const svelteLineIndent = (line: string) => line.match(/^\t*/)?.[0].length ?? 0

const shouldSeparateSvelteSiblings = (line: string, nextLine: string) => {
	if (line === '' || nextLine === '')
		return false
	if (svelteLineIndent(line) !== svelteLineIndent(nextLine))
		return false

	const trimmed = line.trim()
	const nextTrimmed = nextLine.trim()
	if (nextTrimmed.startsWith('{:'))
		return false

	return (
		(
			trimmed.startsWith('</')
			|| trimmed.startsWith('{/')
			|| trimmed.endsWith('/>')
		)
		&& (
			nextTrimmed.startsWith('<')
			|| nextTrimmed.startsWith('{#')
		)
	)
}

const separateSvelteSiblingLines = (source: readonly string[]) => source.flatMap((line, index) => [
	line,
	...(shouldSeparateSvelteSiblings(line, source[index + 1] ?? '') ? [''] : []),
])

const renderSvelteFile = (ast: SvelteFileAst) => {
	const rendered = [
		generatedSvelteHeader,
		'',
		...(ast.moduleScript == null ? [] : [
			'<script module lang="ts">',
			indent(ast.moduleScript.join('\n')),
			'</script>',
			'',
			'',
		]),
		...(ast.script == null ? [] : [
			'<script lang="ts">',
			indent(dedupeScriptImports(ast.script).join('\n')),
			'</script>',
			'',
			'',
		]),
		...(ast.head == null ? [] : [
			'<svelte:head>',
			indent(ast.head.join('\n')),
			'</svelte:head>',
			'',
			'',
		]),
		...separateSvelteSiblingLines(ast.markup ?? []),
		...(ast.style == null ? [] : [
			'',
			'',
			'<style>',
			indent(ast.style.join('\n')),
			'</style>',
		]),
	].join('\n')

	parseSvelte(rendered)
	return rendered
}

const renderGeneratedFile = (generatedFile: GeneratedFile) => {
	const content = (
		generatedFile.kind === 'ts' ?
			renderTsFile(generatedFile.ast)
		: generatedFile.kind === 'text' ?
			generatedFile.body.join('\n')
		:
			renderSvelteFile(generatedFile.ast)
	)

	if (
		generatedFile.kind === 'svelte'
		&& /\{@const\s+[^=]+=\s+\(\{\s*\.\.\./.test(content)
	)
		throw new Error(`${generatedFile.path} contains a parenthesized object-spread {@const} expression`)

	return content.endsWith('\n') ? content : `${content}\n`
}

const formatTsExpression = (source: string) => `(${source})`

const renderLiteral = (value: string | number | boolean | null) => {
	if (typeof value === 'string')
		return q(value)
	if (value === null)
		return 'null'

	return String(value)
}

const renderFacetCondition = (condition: _AppFacetCondition): string => (
	'all' in condition ?
		renderObject([
			['all', renderArray(condition.all.map(renderFacetCondition))],
		])
	: 'is' in condition ?
		renderObject([
			['path', renderArray(condition.path.map((part) => typeof part === 'string' ? q(part) : String(part)))],
			['is', renderLiteral(condition.is)],
		])
	: 'isOneOf' in condition ?
		renderObject([
			['path', renderArray(condition.path.map((part) => typeof part === 'string' ? q(part) : String(part)))],
			['isOneOf', renderArray(condition.isOneOf.map(renderLiteral))],
		])
	:
		renderObject([
			['path', renderArray(condition.path.map((part) => typeof part === 'string' ? q(part) : String(part)))],
			['includes', renderLiteral(condition.includes)],
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
	condition: _AppFacetCondition
): readonly string[] => {
	if ('all' in condition)
		return condition.all.flatMap((child) => facetConditionErrors(entity, child))

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

		const facet = facetByEntityTypeAndPath.get(projectionPathKey(entity.entityType, [
			...facetPath,
			segment,
		]))
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

const renderStringEnum = (name: string, members: readonly string[]) => [
	`export enum ${name} {`,
	...members.map((member) => `\t${member} = ${q(member)},`),
	'}',
].join('\n')

const enumAccess = (enumName: string, value: string) => `${enumName}.${value}`

const renderArray = (values: readonly string[]) => (
	values.length === 0 ?
		'[]'
	:
		[
			'[',
			...values.flatMap((value) => `${indent(value)},`.split('\n')),
			']',
		].join('\n')
)

const renderObject = (entries: readonly [string, string | undefined][]) => {
	const presentEntries = entries.filter((entry): entry is [string, string] => entry[1] !== undefined)
	if (presentEntries.length === 0)
		return '{}'

	return [
		'{',
		...presentEntries.flatMap(([key, value]) => indent(`${key}: ${value},`).split('\n')),
		'}',
	].join('\n')
}

const renderQueryFields = (
	fields: readonly FieldReference[],
	openFields: readonly FieldReference[] | undefined,
	openExpression: string | undefined
) => {
	const renderFieldSelection = (references: readonly FieldReference[]) => {
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

		const renderEntries = (entries: Map<string, Map<string, unknown> | true>) => renderObject([...entries].map(([key, value]) => [
			objectPropertyKey(key),
			value === true ? 'true' : renderObject([['fields', renderEntries(value)]]),
		]))

		return renderEntries(root)
	}
	const fieldEntries = renderFieldSelection(fields)
	if (openExpression == null || openFields == null || openFields.length === 0)
		return fields.length === 0 ? undefined : fieldEntries

	return [
		'{',
		indent(`...${fieldEntries},`),
		indent(`...(${openExpression} && ${renderFieldSelection(openFields)}),`),
		'}',
	].join('\n')
}

const renderGeneratedValue = (value: unknown): string => {
	if (value === undefined)
		return 'undefined'
	if (value === null)
		return 'null'
	if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')
		return renderLiteral(value)
	if (Array.isArray(value)) {
		if (value.length === 0)
			return '[]'

		return [
			'[',
			...value.map((item) => indent(`${renderGeneratedValue(item)},`)),
			']',
		].join('\n')
	}
	if (typeof value === 'object') {
		const entries = Object.entries(value)
			.filter((entry) => entry[1] !== undefined)
		if (entries.length === 0)
			return '{}'

		return [
			'{',
			...entries.map(([key, entryValue]) => indent(`${key}: ${renderGeneratedValue(entryValue)},`)),
			'}',
		].join('\n')
	}

	throw new Error(`Unsupported generated value: ${String(value)}`)
}

const renderImportObject = (imports: readonly _Import[] | undefined): ImportSpec[] => (imports ?? [])
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

const renderSourceArray = (sources: readonly string[] | undefined) => {
	if (sources == null)
		return undefined
	for (const source of sources)
		if (source == null)
			throw new Error(`Source selection contains undefined: ${sources.join(', ')}`)

	return renderArray(sources.map((source) => enumAccess('Source', source)))
}

const sourceSelectionName = (selection: _SourceSelection) => selection.name ?? 'anonymousSources'

const defaultSourcesName = (selection: _SourceSelection) => `default${pascal(sourceSelectionName(selection))}Sources`

const sourceSelectionByKeyName = (selection: _SourceSelection) => `${sourceSelectionName(selection)}SourceSelectionByKey`

const renderSourceSelectionExpression = (selection: readonly string[] | _SourceSelection | undefined) => {
	if (selection == null)
		return undefined
	if (Array.isArray(selection))
		return renderSourceArray(selection)
	if (selection.name != null)
		return defaultSourcesName(selection)

	return renderSourceArray(selection.default)
}

const renderSourceSelectionByKey = (selection: _SourceSelection) => renderObject((selection.cases ?? []).map((item) => [
	q(item.when.map((condition) => condition.equals).join(':')),
	renderSourceArray(item.sources),
]))

const renderOrderFieldAccessor = (
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

const renderQuery = (
	query: _ViewQuery | _ListView['query'] | undefined,
	fields: readonly FieldReference[] = [],
	sourcesExpression?: string,
	openExpression?: string,
	excludedFields?: ReadonlySet<string>,
	orderEntity?: Entity
) => {
	const queryEntries: [string, string | undefined][] = []
	const sources = query == null ? undefined : 'sources' in query ? query.sources : undefined
	const openSources = query == null ? undefined : 'openSources' in query ? query.openSources : undefined
	const openFields = query == null ? undefined : 'openFields' in query ? query.openFields : undefined
	const limit = query == null ? undefined : 'limit' in query ? query.limit : undefined
	const queryFields = unique([
		...(query != null && 'fields' in query ? query.fields ?? [] : []),
		...fields,
	]).filter((field) => !excludedFields?.has(fieldNameForReference(field)))

	queryEntries.push([
		'sources',
		openExpression != null && openSources != null ?
			`${openExpression} ? ${renderSourceArray(openSources)} : ${sourcesExpression ?? renderSourceSelectionExpression(sources) ?? 'undefined'}`
		:
			sourcesExpression ?? renderSourceSelectionExpression(sources),
	])
	queryEntries.push([
		'fields',
		renderQueryFields(queryFields, openFields, openExpression),
	])
	queryEntries.push([
		'limit',
		typeof limit === 'number' ? String(limit) : undefined,
	])
	queryEntries.push([
		'count',
		query != null && 'count' in query && query.count === true ? 'true' : undefined,
	])
	queryEntries.push([
		'orderBy',
		query != null && 'orderBy' in query && query.orderBy != null ?
			renderArray(query.orderBy.map((order) => `[({ fieldRow }) => ${renderOrderFieldAccessor(orderEntity, order.field)} ?? ${order.direction === 'desc' ? 'Number.NEGATIVE_INFINITY' : 'Number.POSITIVE_INFINITY'}, ${q(order.direction)}]`))
		:
			undefined,
	])

	return renderObject(queryEntries)
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
	field: FieldReference | undefined,
	query: _ViewQuery | undefined
) => {
	const fieldDefinition = field == null ? undefined : fieldDefinitionByName(entity, resolveFieldReference(entity, field))
	return fieldDefinition == null ? query : fieldQuery(fieldDefinition, query)
}

const viewConditionFields = (
	conditions: readonly { field: string }[] | undefined
) => unique((conditions ?? []).map((condition) => condition.field))

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
	partial = false
) => conditions
	.map((condition) => {
		const fieldDefinition = entity == null ? undefined : fieldDefinitionByName(entity, condition.field)
		const valueExpression = fieldExpression(entityExpression, fieldNameForReference(condition.field))
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
			!('equals' in condition) ? undefined : `${conditionValueExpression} === ${renderLiteral(condition.equals)}`,
			!('notEquals' in condition) ? undefined : `${conditionValueExpression} !== ${renderLiteral(condition.notEquals)}`,
			!('contains' in condition) ? undefined : `${conditionValueExpression}.includes(${renderLiteral(condition.contains)})`,
			!('oneOf' in condition) ? undefined : `${renderArray(condition.oneOf.map(renderLiteral))}.includes(${conditionValueExpression})`,
		].filter(Boolean).join(' && ')
		return partial ? `${valueExpression} !== undefined && ${expression}` : expression
	})
	.join(' && ')

const renderConditionedEntityLines = (
	entity: Entity,
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

	const conditionFieldNames = viewConditionFields(conditions)
	const conditionSources = unique(
		conditionFieldNames.flatMap((fieldName) => (
			fieldDefinitionByName(entity, fieldNameForReference(fieldName))?.defaultSources ?? []
		))
	)
	const conditionQuery = renderQuery(
		conditionSources.length === 0 ? undefined : {
			sources: conditionSources,
		},
		conditionFieldNames
	)
	const pendingReady = conditionExpression(conditions, 'pendingEntity', entity, true)
	const pendingGateUndefined = unique(conditionFieldNames)
		.map((fieldName) => `${fieldExpression(pendingEntityExpression, fieldNameForReference(fieldName))} === undefined`)
		.join(' || ')

	return [
		`${'\t'.repeat(level)}{#if ${pendingReady}}`,
		...bodyLines,
		`${'\t'.repeat(level)}{:else if ${pendingGateUndefined}}`,
		`${'\t'.repeat(level + 1)}<ResourceBoundary`,
		renderSvelteAttribute(level + 2, 'resource', `selection(${conditionQuery})`),
		`${'\t'.repeat(level + 1)}>`,
		`${'\t'.repeat(level + 2)}{#snippet children(entity)}`,
		`${'\t'.repeat(level + 3)}{@const ${resolvedEntityExpression} = ${resolvedEntitySurfaceExpression}}`,
		`${'\t'.repeat(level + 3)}{#if ${conditionExpression(conditions, resolvedEntityExpression, entity)}}`,
		...bodyLines.map((line) => indent(line, 4)),
		`${'\t'.repeat(level + 3)}{/if}`,
		`${'\t'.repeat(level + 2)}{/snippet}`,
		`${'\t'.repeat(level + 1)}</ResourceBoundary>`,
		`${'\t'.repeat(level)}{/if}`,
	]
}

const renderProjectionConditionedLines = (
	entity: Entity,
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
	const fieldDefinition = fieldDefinitionByName(entity, condition.field)
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
		!('equals' in condition) ? undefined : `${valueExpression} === ${renderLiteral(condition.equals)}`,
		!('notEquals' in condition) ? undefined : `${valueExpression} !== ${renderLiteral(condition.notEquals)}`,
		!('contains' in condition) ? undefined : `${valueExpression}.includes(${renderLiteral(condition.contains)})`,
		!('oneOf' in condition) ? undefined : `${renderArray(condition.oneOf.map(renderLiteral))}.includes(${valueExpression})`,
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
		const valueExpression = renderAppExpression(expression.value, {
			fields: fieldsExpression,
		})
		const caseCondition = `(${expression.cases
			.map((item) => `${valueExpression} === ${renderLiteral(item.equals)} ? ${routeExpressionConditions(fieldsExpression, item.value).join(' && ') || 'true'}`)
			.join(' : ')} : ${routeExpressionConditions(fieldsExpression, expression.default).join(' && ') || 'true'})`

		return [valueCondition === '' ? caseCondition : `(${valueCondition} && ${caseCondition})`]
	}

	return uniqueFieldPaths(expressionFieldPaths(expression).flatMap((fieldPath) => (
		fieldPath.map((_, index) => fieldPath.slice(0, index + 1))
	))).map((fieldPath) => (
		`${fieldExpression(fieldsExpression, fieldPath[0] ?? '')}${fieldPath.slice(1).map(propertyAccess).join('')} !== undefined`
	))
}

const renderRouteExpressionCondition = (fieldsExpression: string, expression: _Expression) => (
	routeExpressionConditions(fieldsExpression, expression).join(' && ')
)

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

const renderExpression = (
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
		return renderLiteral(expression.value)
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
		return `${renderExpression(expression.value, context)}.${expression.property}`
	if (expression.kind === 'pageSelector')
		return context.pageSelector ?? 'data.selector'
	if (expression.kind === 'object')
		return renderObject(expression.fields.map((field) => [
			field.name,
			renderExpression(field.value, context),
		]))
	if (expression.kind === 'selector')
		return renderObject(expression.params.map((param) => [
			param.field,
			'value' in param ?
				renderExpression(param.value, context)
			:
				renderExpression({
					kind: 'param',
					name: param.param,
					decode: param.decode,
				}, context),
		]))
	if (expression.kind === 'catalogIndex') {
		const key = (
			expression.key != null ?
				renderExpression(expression.key, context)
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
		return `${expression.name}(${expression.args.map((argument) => renderExpression(argument, context)).join(', ')})`
	if (expression.kind === 'template')
		return expression.parts
			.map((part) => typeof part === 'string' ? q(part) : `String(${renderExpression(part, context)})`)
			.join(' + ')
	if (expression.kind === 'case')
		return [
			'(',
			...expression.cases.map((item) => `${renderExpression(expression.value, context)} === ${renderLiteral(item.equals)} ?\n${indent(renderExpression(item.value, context), 1)}\n:`),
			indent(renderExpression(expression.default, context), 1),
			')',
		].join('\n')

	throw new Error(`Unsupported expression kind: ${(expression as { kind: string }).kind}`)
}

const renderAppExpression = (
	expression: _Expression,
	context: {
		params?: string
		fields?: string
		pageSelector?: string
	}
): string => {
	if (expression.kind === 'literal')
		return renderLiteral(expression.value)
	if (expression.kind === 'param')
		return renderExpression(expression, context)
	if (expression.kind === 'field')
		return fieldExpression(context.fields ?? 'selection.entitySelector', expression.name)
	if (expression.kind === 'property')
		return `${renderAppExpression(expression.value, context)}${propertyAccess(expression.property)}`
	if (expression.kind === 'pageSelector')
		return context.pageSelector ?? 'data.selector'
	if (expression.kind === 'catalogIndex') {
		const key = (
			expression.key != null ?
				renderAppExpression(expression.key, context)
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
		return `${expression.name}(${expression.args.map((argument) => renderAppExpression(argument, context)).join(', ')})`
	if (expression.kind === 'template')
		return expression.parts
			.map((part) => typeof part === 'string' ? q(part) : `String(${renderAppExpression(part, context)})`)
			.join(' + ')
	if (expression.kind === 'case')
	{
		const valueExpression = renderAppExpression(expression.value, context)
		const caseExpressions = expression.cases.map((item) => ({
			equals: renderLiteral(item.equals),
			value: renderAppExpression(item.value, context),
		}))
		const defaultExpression = renderAppExpression(expression.default, context)
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

	return renderExpression(expression, context)
}

const labelForField = (field: EntityField) => displayLabel(
	field.label
	?? field.name
		.replace(/^\$\$?/, '')
		.replace(/([a-z])([A-Z])/g, '$1 $2')
		.replace(/^./, (letter) => letter.toUpperCase())
)

const sentenceStart = (value: string) => displayLabel(value).replace(/^./, (letter) => letter.toUpperCase())

const sentenceMiddle = (value: string) => value

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

type RouteAncestorSelector = {
	entityType: string
	selectorName: string
	depth: number
	hrefParams: Readonly<Record<string, _Expression>>
	params: Extract<_Expression, { kind: 'selector' }>['params']
}

const entitySelectorReferencePaths = (
	entityByType: ReadonlyMap<string, Entity>,
	currentEntityType: string,
	selectorName: string,
	targetEntityType: string,
	path: readonly string[] = [],
	visitedEntityTypes: ReadonlySet<string> = new Set()
): string[][] => {
	if (currentEntityType === targetEntityType)
		return [[...path]]
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
				...path,
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
	const nearestDepth = Math.max(...ancestorSelectors.map(({ depth }) => depth))
	const referencePaths = unique(ancestorSelectors
		.filter(({ depth }) => depth === nearestDepth)
		.flatMap((ancestor) => entitySelectorReferencePaths(
			entityByType,
			ancestor.entityType,
			ancestor.selectorName,
			entityType
		).map((path) => path.join('\0'))))
		.map((path) => path.split('\0').filter(Boolean))
	if (referencePaths.length === 0)
		return undefined
	if (referencePaths.length > 1)
		throw new Error(`Nearest route selectors expose ${entityType} through ambiguous paths: ${referencePaths.map((path) => path.join('.')).join(', ')}`)
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
	fieldValue: _Expression
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
		}))
	if (expression.kind === 'selector')
		return expression.params.flatMap((selectorParam) => {
			const selectorFieldValue = {
				kind: 'property' as const,
				value: fieldValue,
				property: selectorParam.field,
			}
			if ('value' in selectorParam)
				return routeParamHrefValuesFromExpression(selectorParam.value, selectorFieldValue)

			return [[selectorParam.param, selectorFieldValue]]
		})
	if (expression.kind === 'call') {
		const routeParams = expression.args.flatMap((argument) => routeParamHrefValuesFromExpression(argument, fieldValue))
		return new Set(routeParams.map(([param]) => param)).size === 1 ? routeParams.slice(0, 1) : []
	}

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
			const derivationHrefParams = Object.entries(mapping.derivations ?? {}).flatMap(([fieldName, expression]) => (
				routeParamHrefValuesFromExpression(expression, {
					kind: 'field',
					name: fieldName,
				})
			))
			const routeParamValueTypes = new Map(paramBindings.map(({ param, terminalField }) => [
				param,
				[terminalField.valueType],
			]))
			for (const [param] of derivationHrefParams) {
				if (routeParamValueTypes.has(param))
					throw new Error(`${routeId(routePath)} ${entityType}.${selectorName} binds route parameter ${param} more than once`)
				const valueTypes = [...routeParams].reverse().find((routeParam) => routeParam.name === param)?.valueTypes ?? []
				if (valueTypes.length === 0)
					throw new Error(`${routeId(routePath)} ${entityType}.${selectorName} derived parameter ${param} has no schema route parameter type`)

				routeParamValueTypes.set(param, valueTypes)
			}
			for (const { param } of mapping.href?.params ?? []) {
				if (routeParamValueTypes.has(param) && !derivationHrefParams.some(([derivationParam]) => derivationParam === param))
					throw new Error(`${routeId(routePath)} ${entityType}.${selectorName} binds route parameter ${param} more than once`)
				if (routeParamValueTypes.has(param))
					continue
				const explicitValueTypes = [...routeParams].reverse().find((routeParam) => routeParam.name === param)?.explicitValueTypes ?? []
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
			const parentReference = [...ancestorSelectors].reverse().flatMap((ancestor) => {
				const referencePaths = entitySelectorReferencePaths(
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
				))
				if (referencePaths.length > 1)
					throw new Error(`${routeId(routePath)} ${entityType}.${selectorName} references ancestor ${ancestor.entityType}.${ancestor.selectorName} through ambiguous paths ${referencePaths.map((path) => path.join('.')).join(', ')}`)

				const referencePath = referencePaths[0]
				return referencePath == null ? [] : [{
					ancestor,
					referencePath,
				}]
			})[0]
			const hrefParams = {
				...(parentReference == null ? {} : Object.fromEntries(Object.entries(parentReference.ancestor.hrefParams).map(([param, value]) => [
					param,
					parentReference.referencePath.reduceRight<_Expression>((expression, referenceField) => routeExpressionThroughReference(expression, referenceField), value),
				]))),
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
			const ancestorValue = (field: EntityField) => {
				if (field.entityType == null)
					return undefined

				const ancestorSelector = routePageSelectorExpression(entityByType, ancestorSelectors, field.entityType)
				if (ancestorSelector != null)
					return ancestorSelector

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
				}[]
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
						const nestedField = referencedEntity.fields.find((candidate) => candidate.name === nestedFieldName)
						return nestedField != null && ancestorValue(nestedField) != null
					})
				))
				if (nestedSelectors.length !== 1)
					throw new Error(`${routeId(routePath)} ${entityType}.${selectorName} route parameter path ${field.name}.${nestedBindings[0]?.fieldPath.join('.')} resolves ${nestedSelectors.length} nested ${referencedEntity.entityType} selectors`)
				const nestedSelector = nestedSelectors[0]
				if (nestedSelector == null)
					throw new Error(`${routeId(routePath)} ${entityType}.${selectorName} route parameter path does not resolve a nested selector`)

				return selectorValue(referencedEntity, nestedSelector, nestedBindings)
			}
			const selectorValue = (
				selectorEntity: Entity,
				selectorDefinition: EntitySelector,
				bindings: readonly {
					param: string
					fieldPath: readonly string[]
					terminalField: EntityField
				}[]
			): _Expression => ({
				kind: 'object',
				fields: selectorDefinition.fields.map((fieldName) => {
					const field = selectorEntity.fields.find((candidate) => candidate.name === fieldName)
					if (field == null)
						throw new Error(`${routeId(routePath)} ${selectorEntity.entityType}.${selectorDefinition.name} references missing field ${fieldName}`)
					const fieldBindings = bindings.filter(({ fieldPath }) => fieldPath[0] === fieldName)
					if (fieldBindings.length === 0) {
						const value = ancestorValue(field)
						if (value == null)
							throw new Error(`${routeId(routePath)} ${entityType}.${selectorName} does not bind selector field ${selectorEntity.entityType}.${fieldName}`)

						return {
							name: fieldName,
							value,
						}
					}

					return {
						name: fieldName,
						value: fieldValue(selectorEntity, field, fieldBindings),
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
					const value = ancestorValue(field)
					if (value == null)
						throw new Error(`${routeId(routePath)} ${entityType}.${selectorName} does not bind selector field ${fieldName}`)

					return {
						field: fieldName,
						value,
					}
				}

				return {
					field: fieldName,
					value: fieldValue(entity, field, bindings),
				}
			})
			return {
				mapping,
				fields,
				routeParamMatchers: [...routeParamValueTypes].map(([param, valueTypes]) => ({
					param,
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
					params: Object.entries(hrefParams).map(([param, value]) => ({
						param,
						value,
					})),
				},
				selector: {
					entityType,
					selectorName,
					hrefParams,
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

			const fieldName = resolveFieldReference(sourceEntity, collection.field[1])
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
		const svelteKitPath = routeId([
			parentSvelteKitPath,
			svelteKitRoutePath(segment, routeParams),
		].filter(Boolean).join('/'))
		const descendantSelectors = [
			...ancestorSelectors,
			...compiledSelectorMappings.map(({ selector }) => ({
				...selector,
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
		const normalizedSelectorMappings = compiledSelectorMappings.map(({ fields, href, routeParamMatchers, selector: { entityType, selectorName }, mapping, title }): SelectorRouteMapping => {
			const normalizedEntity = entityByType.get(entityType)
			const normalizedSelector = normalizedEntity?.selectors.find((selector) => selector.name === selectorName)
			if (normalizedEntity == null || normalizedSelector == null)
				throw new Error(`${routeId(routePath)} references missing normalized selector ${entityType}.${selectorName}`)

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
				routePageSelectorExpression(entityByType, ancestorSelectors, mapping.projection.entityType)
			if (mapping.projection != null && projectionSelector == null)
				throw new Error(`${routeId(routePath)} ${entityType}.${selectorName} cannot derive projection subject ${mapping.projection.entityType}`)

			const projectionRouteParams = mapping.projection == null ? [] : unique(ancestorSelectors
				.filter((ancestor) => ancestor.entityType === mapping.projection?.entityType)
				.flatMap((ancestor) => Object.keys(ancestor.hrefParams))
				.filter((param) => routeParams.some(({ name }) => name === param)))
			if (projectionRouteParams.length > 1)
				throw new Error(`${routeId(routePath)} ${entityType}.${selectorName} projection subject ${mapping.projection?.entityType} has ambiguous route parameters ${projectionRouteParams.join(', ')}`)

			return {
			entityType,
			selectorName,
			paramBindings: mapping.params ?? {},
			routeParamMatchers,
			ancestorBindings: normalizedSelector.fields.flatMap((fieldName) => {
					if (
						Object.values(mapping.params ?? {}).some((fieldPath) => fieldPath[0] === fieldName)
						|| Object.hasOwn(mapping.derivations ?? {}, fieldName)
					)
						return []
					const field = normalizedEntity.fields.find((candidate) => candidate.name === fieldName)
					const ancestor = [...ancestorSelectors].reverse().find((candidate) => candidate.entityType === field?.entityType)
					return ancestor == null ? [] : [{
						entityType: ancestor.entityType,
						selectorName: ancestor.selectorName,
						field: fieldName,
					}]
				}),
			...(mapping.fixture == null ? {} : { fixture: mapping.fixture }),
			...(mapping.variants == null ? {} : { variants: mapping.variants }),
			...(mapping.boundaryLiveOptional == null ? {} : { boundaryLiveOptional: mapping.boundaryLiveOptional }),
			...(href == null ? {} : { href }),
			fields,
			title,
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

const projectionConditionValues = (
	network: RouteProjectionNetwork,
	field: string
) => (
	field === 'namespace' ?
		[network.namespace]
	: field === 'ledgerModels' ?
		network.ledgerModels
	: field === 'executionModels' ?
		network.executionModels
	:
		undefined
)

const projectionConditionApplies = (
	condition: _AppFacetCondition,
	network: RouteProjectionNetwork
): boolean => (
	'all' in condition ?
		condition.all.every((child) => projectionConditionApplies(child, network))
	: 'is' in condition ?
		projectionConditionValues(network, facetConditionField(condition))?.some((value) => value === condition.is) === true
	: 'isOneOf' in condition ?
		projectionConditionValues(network, facetConditionField(condition))?.some((value) => condition.isOneOf.includes(value)) === true
	: 'includes' in condition ?
		projectionConditionValues(network, facetConditionField(condition))?.some((value) => value === condition.includes) === true
	:
		false
)

const routeHrefFromMapping = (
	node: RouteNode,
	mapping: SelectorRouteMapping,
	entityFacetByPath: ReadonlyMap<string, {
		entityType: string
		facet: NonNullable<App['schema']['entities'][number]['facets']>[number]
	}>
): EntityHref | undefined => {
	if (mapping.href == null || mapping.href.entityHref === false)
		return undefined

	return {
		href: node.svelteKitPath,
		selector: mapping.selectorName,
		conditions: [
			...(mapping.projection == null ? [] : [mapping.projection]).flatMap((projection) => {
				const facetEntry = entityFacetByPath.get(projectionPathKey(projection.entityType, projection.facetPath))
				if (facetEntry == null)
					throw new Error(`${node.internalPath} route href references missing projection [${projection.facetPath.map(q).join(', ')}]`)
				if (mapping.entityType !== facetEntry.entityType)
					return []

				return viewConditionFromFacetCondition(facetEntry.facet.condition)
			}),
			...(mapping.href.conditions ?? []),
		],
		params: [...mapping.href.params],
	}
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

const flattenRouteNodes = (nodes: readonly RouteNode[]): RouteNode[] => nodes.flatMap((node) => [
	node,
	...flattenRouteNodes(node.children),
])

const routeFixtureMetadataFromMapping = (mapping: SelectorRouteMapping) => (
	mapping.projection == null && mapping.fixture == null && mapping.variants == null ?
		undefined
	:
		{
			id: `${mapping.entityType}.${mapping.selectorName}`,
			routeKind: mapping.projection == null ? 'detail' : 'projection',
			projectionEntity: mapping.projection?.entityType,
			projectionPath: mapping.projection?.facetPath,
			fixture: mapping.fixture,
			variants: mapping.variants,
			boundaryLiveOptional: mapping.boundaryLiveOptional,
		}
)

const renderEntriesFromRouteNodes = (
	nodes: readonly RouteNode[],
	routeNodeByInternalPath: ReadonlyMap<string, RouteNode>
): RouteRenderEntry[] => nodes.flatMap((node) => {
	const mappingPages = [
		...node.selectorMappings.flatMap((mapping) => mapping.page == null ? [] : [mapping.page]),
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
		...(node.selectorMappings.length === 0 ? [] : [{
			kind: RouteFileKind.PageModule,
			...(node.children.length === 0 ? {} : { sharedLayout: true as const }),
			mappings: node.selectorMappings,
		} satisfies RouteFile]),
		...(page == null ? [] : [{
			kind: RouteFileKind.Page,
			page,
			mappings: node.selectorMappings,
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
				details: ownDetails,
			}],
		}]),
		...renderEntriesFromRouteNodes(node.children, routeNodeByInternalPath),
	]
})

const validateNormalizedRouteNodes = (nodes: readonly RouteNode[]) => {
	const indexedNodes = flattenRouteNodes(nodes)
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
			...mapping.ancestorBindings.flatMap((binding) => (
				indexedNodes.some((ancestor) => (
					node.internalPath.startsWith(`${ancestor.internalPath}/`)
					&& ancestor.selectorMappings.some((ancestorMapping) => (
						ancestorMapping.entityType === binding.entityType
						&& ancestorMapping.selectorName === binding.selectorName
					))
				)) ?
					[]
				:
					[`${node.internalPath} ${mapping.entityType}.${mapping.selectorName} references missing ancestor ${binding.entityType}.${binding.selectorName}`]
			)),
			...(mapping.href == null || mapping.href.entityHref === false ? [] : node.params.flatMap(({ name }) => (
				mapping.href?.params.some(({ param }) => param === name) === true ?
					[]
				:
					[`${node.internalPath} ${mapping.entityType}.${mapping.selectorName} href is missing route parameter ${name}`]
			))),
		])),
	]
	if (new Set(indexedNodes.map((node) => node.internalPath)).size !== indexedNodes.length)
		errors.push('Normalized route node internal paths are not unique')
	if (errors.length > 0)
		throw new Error(errors.join('\n'))
}

const validateRouteLowering = (
	nodes: readonly RouteNode[],
	entries: readonly RouteRenderEntry[]
) => {
	const nodeByInternalPath = new Map(flattenRouteNodes(nodes).map((node) => [node.internalPath, node]))
	const errors = [
		...entries.flatMap((entry) => {
		const node = nodeByInternalPath.get(entry.internalPath)
		if (node == null)
			return [`${entry.routePath} render entry has no normalized route node`]

		const normalizedMappings = node.selectorMappings.map((mapping) => selectorRouteMappingKey(
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
	['id', metadata.id == null ? undefined : q(metadata.id)],
	['label', metadata.label == null ? undefined : q(metadata.label)],
	['routeKind', metadata.routeKind == null ? undefined : q(metadata.routeKind)],
	['projectionEntity', metadata.projectionEntity == null ? undefined : q(metadata.projectionEntity)],
	['fixture', metadata.fixture == null ? undefined : renderObject(Object.entries(metadata.fixture).map(([key, value]) => [key, q(value)]))],
	['variants', metadata.variants == null ? undefined : renderArray(metadata.variants.map((variant) => renderObject(Object.entries(variant).map(([key, value]) => [key, q(value)]))))],
	['projectionPath', metadata.projectionPath == null ? undefined : renderArray(metadata.projectionPath.map(q))],
	['boundaryLiveOptional', metadata.boundaryLiveOptional == null ? undefined : 'true'],
] as const

const projectionFacetForPath = (
	entity: Entity,
	projectionPath: readonly [string, ...string[]]
) => {
	const facet = facetByEntityTypeAndPath.get(projectionPathKey(entity.entityType, projectionPath))
	if (facet == null)
		throw new Error(`${entity.entityType} references missing projection ${projectionPath.join('.')}`)

	return facet
}

const resolveFieldReference = (entity: Entity, field: FieldReference) => {
	if (!isProjectionFieldReference(field))
		return field

	const fieldName = field.at(-1)
	const projectionPath = field.slice(0, -1)
	if (fieldName == null || projectionPath.length === 0)
		throw new Error(`${entity.entityType} projection field reference must include a projection path and field: ${field.join('.')}`)

	const facet = projectionFacetForPath(entity, projectionPath)
	if (!facet.fields?.some((facetField) => facetField.name === fieldName))
		throw new Error(`${entity.entityType} projection ${projectionPath.join('.')} references missing field ${fieldName}`)

	return fieldName
}

const facetFieldReferenceConditions = (
	entity: Entity,
	field: unknown
) => {
	if (!Array.isArray(field))
		return []

	const projectionPath = field.slice(0, -1)

	return projectionPath.map((_, index) => {
		const facet = projectionFacetForPath(entity, projectionPath.slice(0, index + 1))
		return viewConditionFromFacetCondition(facet.condition)
	}).flat()
}

const resolveFieldReferences = (entity: Entity, value: unknown, key?: string): unknown => {
	if (Array.isArray(value)) {
		if (key === 'fields' || key === 'openFields') {
			if (isProjectionFieldReference(value as FieldReference))
				return (resolveFieldReference(entity, value as FieldReference), value)

			return value.map((item) => (
			typeof item === 'string' || isProjectionFieldReference(item as FieldReference) ?
				(resolveFieldReference(entity, item as FieldReference), item)
			:
				resolveFieldReferences(entity, item)
			))
		}

		return value.map((item) => resolveFieldReferences(entity, item))
	}

	if (value == null || typeof value !== 'object')
		return value

	if ('field' in value && (typeof (value as { field?: unknown }).field === 'string' || Array.isArray((value as { field?: unknown }).field))) {
		const field = (value as { field: FieldReference }).field
		const conditions = facetFieldReferenceConditions(entity, (value as { field?: unknown }).field)
		return Object.fromEntries(Object.entries({
			...value,
			field: (resolveFieldReference(entity, field), field),
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
				resolveFieldReferences(entity, entryValue, entryKey),
		]))
	}

	return Object.fromEntries(Object.entries(value).map(([entryKey, entryValue]) => [
		entryKey,
		entryKey === 'field' || entryKey === 'titleField' ?
			entryValue
		:
			resolveFieldReferences(entity, entryValue, entryKey),
	]))
}

const mergeSingularViews = (
	base: SingularView | undefined,
	facet: Partial<SingularView>
): SingularView => ({
	...(base ?? {}),
	...facet,
	query: {
		...(base?.query ?? {}),
		...(facet.query ?? {}),
		fields: [
			...(base?.query?.fields ?? []),
			...(facet.query?.fields ?? []),
		],
		openFields: [
			...(base?.query?.openFields ?? []),
			...(facet.query?.openFields ?? []),
		],
	},
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
	},
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

const singularViewWithProjection = (
	facet: NonNullable<Entity['facets']>[number],
	projectionPath: readonly [string, ...string[]]
) => {
	if (facet.singularView == null)
		return undefined

	return {
		...facet.singularView,
		carousels: facet.singularView.carousels?.map((carousel) => ({
			...carousel,
			projectionPath,
		})),
	} satisfies Partial<SingularView>
}

const normalizeApp = (app: App): App => {
	const hasEntityFacets = app.schema.entities.some((entity) => entity.facets != null && entity.facets.length > 0)
	if (!hasEntityFacets)
		return app

	return {
		...app,
		schema: {
			...app.schema,
			entities: app.schema.entities.map((entity) => {
				if (entity.facets == null || entity.facets.length === 0)
					return entity

				const facets = entity.facets.map((facet) => ({ ...facet }))
				const facetEntries = (
					facetDefinitions: NonNullable<Entity['facets']>,
					parentPath?: readonly [string, ...string[]]
				): {
					facet: NonNullable<Entity['facets']>[number]
					projectionPath: readonly [string, ...string[]]
				}[] => facetDefinitions.flatMap((facet) => {
					const projectionPath: readonly [string, ...string[]] = parentPath == null ?
						[facet.name]
					:
						[
							...parentPath,
							facet.name,
						]
					return [
						{
							facet,
							projectionPath,
						},
						...(facet.facets == null ? [] : facetEntries(facet.facets, projectionPath)),
					]
				})
				const singularView = facetEntries(facets).reduce(
					(view, { facet, projectionPath }) => {
						const facetSingularView = singularViewWithProjection(facet, projectionPath)
							if (facetSingularView == null)
								return view

							const normalizedFacetSingularView = {
								...facetSingularView,
								carousels: (
									resolveFieldReferences(entity, {
										carousels: facetSingularView.carousels,
									}) as Pick<SingularView, 'carousels'>
								).carousels,
							}

							return mergeSingularViews(
								view,
								normalizedFacetSingularView
							)
						},
					resolveFieldReferences(entity, entity.views.singular) as SingularView | undefined
				)

					return {
						...entity,
						facets,
						views: {
							...(resolveFieldReferences(entity, entity.views) as Entity['views']),
							singular: singularView,
						},
				}
			}),
		},
		routes: app.routes,
	}
}

const compileApp = (app: App) => {
	const activeEntities = app.schema.entities
	const entityTypes = unique(activeEntities.map((entity) => entity.entityType))
	const entityByType = new Map(activeEntities.map((entity) => [entity.entityType, entity]))
	const valueTypeById = new Map(app.schema.valueTypes.map((valueType) => [valueType.id, valueType]))
	const routeParamValueTypesByOwner = indexRouteParamValueTypes(app.routes.children, activeEntities)
	const sourceIds = new Set(app.sources.sources.map((source) => source.source))
	const sourceProviderIds = new Set(app.sources.providers.map((provider) => provider.provider))
	const routeFixtureNetworkBySlug = new Map(app.routes.fixtureNetworks.map((network) => [network.slug, network]))
	const routeFixtureNetworkByCaip2 = new Map(app.routes.fixtureNetworks.flatMap((network) => (
		network.caip2 == null ?
			[]
		:
			[[network.caip2, network] as const]
	)))
	const allEntityTypes = new Set(entityTypes)
	const facetNames = new Set([...facetByEntityTypeAndPath.values()].map((facet) => facet.name))
	const errors: string[] = []
	const entityFacetByPath = new Map(activeEntities.flatMap((entity) => {
		const entries = (
			facets: NonNullable<App['schema']['entities'][number]['facets']> | undefined,
			parentPath: readonly string[] = []
		): [
			string,
			{
				entityType: string
				facet: NonNullable<App['schema']['entities'][number]['facets']>[number]
			},
		][] => (
			facets ?? []
		).flatMap((facet) => {
			const projectionPath = [
				...parentPath,
				facet.name,
			]
			return [
				[
					projectionPathKey(entity.entityType, projectionPath),
					{
						entityType: entity.entityType,
						facet,
					},
				],
				...entries(facet.facets, projectionPath),
			]
		})

		return entries(entity.facets)
	}))
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
				if (entity == null) {
					errors.push(`${routePath} references missing selector entity ${entityType}`)
					continue
				}

				for (const [selectorName, mapping] of Object.entries(selectors)) {
					const selector = entity.selectors.find((candidate) => candidate.name === selectorName)
					if (selector == null) {
						errors.push(`${routePath} references missing selector ${entityType}.${selectorName}`)
						continue
					}

					for (const [param, fieldPath] of Object.entries(mapping.params ?? {})) {
						if (!routeParams.has(param))
							errors.push(`${routePath} selector ${entityType}.${selectorName} binds unknown route param ${param}`)
						if (!selector.fields.includes(fieldPath[0]))
							errors.push(`${routePath} selector ${entityType}.${selectorName} binds non-selector field ${fieldPath[0]}`)
						const routeValueType = valueTypeByParam.get(param)
						const fieldValueType = entity.fields.find((field) => field.name === fieldPath[0])?.valueType
						if (routeValueType != null && fieldValueType != null && routeValueType !== fieldValueType)
							errors.push(`${routePath} parameter ${param} type ${routeValueType} does not match ${entityType}.${fieldPath.join('.')} type ${fieldValueType}`)
					}

					for (const fieldName of Object.keys(mapping.derivations ?? {}))
						if (!selector.fields.includes(fieldName))
							errors.push(`${routePath} selector ${entityType}.${selectorName} derives non-selector field ${fieldName}`)

					for (const fieldName of selector.fields) {
						if (
							Object.values(mapping.params ?? {}).some((fieldPath) => fieldPath[0] === fieldName)
							|| Object.hasOwn(mapping.derivations ?? {}, fieldName)
							|| ancestorEntityTypes.includes(entity.fields.find((field) => field.name === fieldName)?.entityType ?? '')
						)
							continue

						errors.push(`${routePath} selector ${entityType}.${selectorName} does not satisfy ${fieldName}`)
					}

					if (mapping.projection != null && !entityFacetByPath.has(projectionPathKey(
						mapping.projection.entityType,
						mapping.projection.facetPath
					)))
						errors.push(`${routePath} selector ${entityType}.${selectorName} references missing projection ${mapping.projection.entityType}.${mapping.projection.facetPath.join('.')}`)
				}
			}

			for (const collection of node.collections ?? []) {
				const entity = entityByType.get(collection.field[0])
				if (entity == null)
					errors.push(`${routePath} collection references missing entity ${collection.field[0]}`)
				else if (!entityFields(entity).some((field) => field.name === resolveFieldReference(entity, collection.field[1])))
					errors.push(`${routePath} collection references missing field ${collection.field[0]}.${collection.field[1]}`)
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
	for (const valueType of app.schema.valueTypes)
		if (
			valueType.routeParam != null
			&& !existsSync(path.join(repoRoot, 'src', 'params', `${valueType.routeParam.matcher}.ts`))
		)
			errors.push(`Schema value type ${valueType.id} route parameter references missing src/params/${valueType.routeParam.matcher}.ts`)
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
	expectUnique('source', app.sources.sources.map((source) => source.source))
	expectUnique('source provider', app.sources.providers.map((provider) => provider.provider))

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
			if (!/^[A-Z][A-Za-z0-9]*$/.test(selector.name))
				errors.push(`${entity.entityType}.${selector.name} selector name must be TitleCase because it is emitted as an enum member`)
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
		for (const facet of facetsByEntityType.get(entity.entityType) ?? []) {
			errors.push(...facetConditionErrors(entity, facet.condition))
		}
		const addressableFieldNames = new Set(entityFields(entity).map((field) => field.name))
		for (const list of singularViewLists(entitySingularView(entity)) ?? []) {
			if (list.field != null && !addressableFieldNames.has(resolveFieldReference(entity, list.field)))
				errors.push(`${entity.entityType} list references missing field ${list.field}`)
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

	for (const source of app.sources.sources) {
		if (!sourceProviderIds.has(source.provider))
			errors.push(`${source.source} references missing provider ${source.provider}`)
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
	validateNormalizedRouteNodes(compiledRoutes.nodes)
	const indexedRouteNodes = flattenRouteNodes(compiledRoutes.nodes)
	const routeNodeByInternalPath = new Map(indexedRouteNodes.map((node) => [node.internalPath, node]))
	const routeEntryList = renderEntriesFromRouteNodes(compiledRoutes.nodes, routeNodeByInternalPath)
	validateRouteLowering(compiledRoutes.nodes, routeEntryList)
	const routeNodesByPublicPath = Map.groupBy(indexedRouteNodes, (node) => node.publicPath)
	const routeNodesByPublicShape = Map.groupBy(indexedRouteNodes, (node) => publicRouteShape(node.publicPath))
	const routeMappingsByEntityTypeAndSelector = Map.groupBy(
		indexedRouteNodes.flatMap((node) => node.selectorMappings),
		(mapping) => selectorRouteMappingKey(mapping.entityType, mapping.selectorName)
	)
	const routeMappingByEntityTypeAndSelector = new Map([...routeMappingsByEntityTypeAndSelector].flatMap(([key, [mapping]]) => (
		mapping == null ? [] : [[key, mapping] as const]
	)))
	const routeMappingsByNode = new Map(indexedRouteNodes.map((node) => [
		node.internalPath,
		node.selectorMappings,
	]))

	for (const entry of routeEntryList) {
		for (const routeFile of entry.files) {
			for (const mapping of routeFile.mappings ?? []) {
				if (!entityByType.has(mapping.entityType))
					errors.push(`${entry.routePath} mapping references missing entity ${mapping.entityType}`)
				if (mapping.projection != null && !entityByType.has(mapping.projection.entityType))
					errors.push(`${entry.routePath} mapping references missing projection entity ${mapping.projection.entityType}`)
			}

			if (routeFile.layout?.entity != null && !entityByType.has(routeFile.layout.entity))
				errors.push(`${entry.routePath} layout references missing entity ${routeFile.layout.entity}`)

			if (
				routeFile.page?.view?.component != null
				&& routeFile.mappings?.length === 0
				&& (routeFile.collections?.length ?? 0) === 0
				&& !generatedComponents.has(routeFile.page.view.component)
			)
				errors.push(`${entry.routePath} view references missing generated component ${routeFile.page.view.component}`)

			for (const collection of routeFile.collections ?? []) {
				const collectionEntity = entityByType.get(collection.entity)
				const sourceEntity = entityByType.get(collection.source.entity)
				if (collectionEntity == null)
					errors.push(`${entry.routePath} collection references missing entity ${collection.entity}`)
				if (sourceEntity == null) {
					if (!allEntityTypes.has(collection.source.entity))
						errors.push(`${entry.routePath} collection source references missing entity ${collection.source.entity}`)
					continue
				}

				const collectionSourceField = resolveFieldReference(sourceEntity, collection.source.field)
				if (!entityFields(sourceEntity).some((field) => field.name === collectionSourceField))
					errors.push(`${entry.routePath} collection source references missing field ${collection.source.entity}.${collection.source.field}`)
			}
		}
	}

	const routeNodeProjectionKeys = new Map<string, string[]>()
	for (const node of indexedRouteNodes) {
		const localProjectionKeys = unique([
			...node.selectorMappings.flatMap((mapping) => (
				mapping.projection == null ? [] : [projectionPathKey(mapping.projection.entityType, mapping.projection.facetPath)]
			)),
			...node.collectionMappings.flatMap((collection) => !isProjectionFieldReference(collection.field) ? [] : [projectionPathKey(
				collection.entityType,
				collection.field.slice(0, -1)
			)]),
		])
		routeNodeProjectionKeys.set(
			node.internalPath,
			localProjectionKeys.length > 0 ?
				localProjectionKeys
			:
				indexedRouteNodes
					.filter((candidate) => node.internalPath.startsWith(`${candidate.internalPath}/`))
					.sort((left, right) => right.internalPath.length - left.internalPath.length)
					.flatMap((candidate) => routeNodeProjectionKeys.get(candidate.internalPath) ?? [])
		)
	}
	for (const entries of Map.groupBy(indexedRouteNodes.filter((node) => (
		node.page != null || node.selectorMappings.length > 0
	)), (node) => publicRouteShape(node.publicPath)).values()) {
		for (const [index, left] of entries.entries())
			for (const right of entries.slice(index + 1)) {
				const leftMatchers = left.params.map((param) => param.matcher)
				const rightMatchers = right.params.map((param) => param.matcher)
				const matchersAreDisjoint = leftMatchers.some((matcher, matcherIndex) => (
					matcher != null
					&& rightMatchers[matcherIndex] != null
					&& matcher !== rightMatchers[matcherIndex]
				))
				const leftProjections = routeNodeProjectionKeys.get(left.internalPath) ?? []
				const rightProjections = routeNodeProjectionKeys.get(right.internalPath) ?? []
				const projectionsAreDisjoint = (
					leftProjections.length > 0
					&& rightProjections.length > 0
					&& leftProjections.every((projection) => !rightProjections.includes(projection))
				)
				if (!matchersAreDisjoint && !projectionsAreDisjoint)
					errors.push(`${left.internalPath} and ${right.internalPath} overlap public route shape ${publicRouteShape(left.publicPath)} without disjoint matchers or projections`)
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
	for (const selectorKey of activeEntities.flatMap((entity) => entity.selectors.map((selector) => (
		selectorRouteMappingKey(entity.entityType, selector.name)
	)))) {
		const mappingCount = routeMappingsByEntityTypeAndSelector.get(selectorKey)?.length ?? 0
		if (mappingCount !== 1)
			errors.push(`${selectorKey} must have exactly one route mapping; found ${mappingCount}`)
	}
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

		for (const mapping of node.selectorMappings) {
			const entityHref = routeHrefFromMapping(node, mapping, entityFacetByPath)
			if (
				entityHref != null
				&& (entityHrefsByType.get(mapping.entityType) ?? []).every((href) => JSON.stringify({
					href: href.href,
					selector: href.selector,
					conditions: href.conditions ?? [],
					params: href.params,
				}) !== JSON.stringify({
					href: entityHref.href,
					selector: entityHref.selector,
					conditions: entityHref.conditions ?? [],
					params: entityHref.params,
				}) && (
					href.selector !== entityHref.selector
					|| (href.conditions?.length ?? 0) > 0
					|| (entityHref.conditions?.length ?? 0) > 0
				))
			)
				entityHrefsByType.set(mapping.entityType, [
					...(entityHrefsByType.get(mapping.entityType) ?? []),
					entityHref,
				])
		}
	}
	for (const node of indexedRouteNodes) {
		for (const mapping of node.selectorMappings) {
			const mappingMetadata = routeFixtureMetadataFromMapping(mapping)
			if (mappingMetadata != null) {
				const routeParams = new Set(node.params.map(({ name }) => name))
				const projectionPath = mappingMetadata.projectionPath ?? []
				const projectionEntityType = mappingMetadata.projectionEntity
				const facetEntry = projectionPath.length === 0 || projectionEntityType == null ? undefined : entityFacetByPath.get(projectionPathKey(projectionEntityType, projectionPath))
				if (projectionPath.length > 0) {
					if (projectionEntityType == null)
						errors.push(`${node.internalPath} mapping ${mappingMetadata.id} must declare projectionEntity for projection [${projectionPath.map(q).join(', ')}]`)
					else if (facetEntry == null)
						errors.push(`${node.internalPath} mapping ${mappingMetadata.id} references missing ${projectionEntityType} projection [${projectionPath.map(q).join(', ')}]`)
				}
				const projectionCondition = facetEntry?.facet.condition
					for (const param of [
						...Object.keys(mappingMetadata.fixture ?? {}),
						...(mappingMetadata.variants ?? []).flatMap((variant) => Object.keys(variant)),
					])
						if (!routeParams.has(param))
							errors.push(`${node.internalPath} mapping ${mappingMetadata.id} fixture references unknown route param ${param}`)

					for (const mappingFixture of [
						...(mappingMetadata.fixture == null ? [] : [mappingMetadata.fixture]),
						...(mappingMetadata.variants ?? []),
					]) {
						const projectionNetwork = (
							mappingFixture.networkSlug != null ?
								routeFixtureNetworkBySlug.get(mappingFixture.networkSlug)
							: mappingFixture.caip2 != null ?
								routeFixtureNetworkByCaip2.get(mappingFixture.caip2)
							:
								undefined
						)
						if (projectionNetwork == null && projectionCondition != null && (mappingFixture.networkSlug != null || mappingFixture.caip2 != null))
							errors.push(`${node.internalPath} mapping ${mappingMetadata.id} fixture does not resolve to a known Network row`)
						if (
							projectionNetwork != null
							&& projectionCondition != null
							&& !projectionConditionApplies(projectionCondition, projectionNetwork)
						)
							errors.push(`${node.internalPath} mapping ${mappingMetadata.id} fixture ${projectionNetwork.slug} does not satisfy required projection conditions`)
					}

				}
		}
	}

	return {
		indexes: {
		activeEntities,
		entityTypes,
		entityByType,
		valueTypeById,
		sourceIds,
		sourceProviderIds,
		routeNodeByInternalPath,
		routeNodesByPublicPath,
		routeNodesByPublicShape,
		routeMappingByEntityTypeAndSelector,
		routeMappingsByNode,
		collectionHrefByEntity,
		collectionHrefBySourceField,
		entityHrefsByType,
		generatedComponents,
		sourceSelections: unique(collectSourceSelections(app)),
		},
		renderEntries: routeEntryList,
	}
}

const deriveFiles = (
	normalizedApp: App,
	indexes: AppIndexes,
	renderEntries: readonly RouteRenderEntry[]
): GeneratedFile[] => {
	const relationshipListViews = namedRelationshipListViews(indexes)
	const files = [
		renderEntityTypeFile(indexes.entityTypes),
		...indexes.activeEntities.map((entity) => renderEntitySchemaFile(entity, indexes)),
		renderSchemaIndexFile(indexes),
		renderSourcesMarkdownFile(normalizedApp),
		renderSourceFile(normalizedApp),
		renderSourceProviderFile(normalizedApp),
		renderSourceProvidersFile(normalizedApp),
		renderSourceSelectionsFile(indexes.sourceSelections),
		renderNavigationItemsFile(normalizedApp),
		renderSourcesIndexFile(),
		renderSourcesServerIndexFile(),
		renderOfficialArtifactsFile(normalizedApp),
		renderResolverIndexFile(normalizedApp),
		renderE2eRouteFixtureMetadataFile(indexes),
		...indexes.activeEntities.flatMap((entity) => [
			renderSingularViewFile(entity, indexes),
			renderPluralViewFile(entity, indexes),
		]),
		...relationshipListViews.map((view) => renderNamedRelationshipListViewFile(view)),
		renderViewsIndexFile(indexes.activeEntities),
		...[...new Map([...indexes.routeNodeByInternalPath.values()].flatMap((node) => (
			node.params.filter((routeParam) => routeParam.matchers.length > 1)
		)).map((routeParam) => [routeParam.matcher, routeParam])).values()].map((routeParam) => tsFile(
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
		...renderEntries.flatMap((entry) => renderRouteFiles(entry, indexes, renderEntries)),
	]
	const paths = files.map((generatedFile) => generatedFile.path)
	const duplicatePaths = paths.filter((filePath, index) => paths.indexOf(filePath) !== index)
	if (duplicatePaths.length > 0)
		throw new Error(`Duplicate generated output paths:\n${unique(duplicatePaths).join('\n')}`)

	return files
}

const renderEntityTypeFile = (entityTypes: readonly string[]) => tsFile(
	'src/schema/EntityType.ts',
	{
		body: [
			renderStringEnum('EntityType', entityTypes),
		],
	}
)

const renderE2eRouteFixtureMetadataFile = (indexes: AppIndexes) => {
	const routeFixtureMetadataByNodeId = new Map([...indexes.routeNodeByInternalPath.values()].flatMap((node) => {
		const mappings = node.selectorMappings.flatMap((mapping) => {
			const metadata = routeFixtureMetadataFromMapping(mapping)
			return metadata == null ? [] : [metadata]
		})
		return mappings.length === 0 ? [] : [[node.internalPath, {
			nodeId: node.internalPath,
			publicPath: node.publicPath,
			mappings,
			fixture: mappings[0].fixture,
			variants: [...new Map(mappings.flatMap((mapping) => [
				...(mapping.fixture == null ? [] : [mapping.fixture]),
				...(mapping.variants ?? []),
			]).map((variant) => [JSON.stringify(variant), variant])).values()],
			boundaryLiveOptional: mappings.some((mapping) => mapping.boundaryLiveOptional),
		}] as const]
	}))

	return tsFile(
	'tests/e2e/_generatedRouteFixtureMetadata.ts',
	{
		body: [
			'export type E2eRouteFixtureMapping = {',
			'\tid?: string',
			'\tlabel?: string',
			'\trouteKind?: string',
			'\tprojectionEntity?: string',
			'\tfixture?: Readonly<Partial<Record<string, string>>>',
			'\tvariants?: readonly Readonly<Partial<Record<string, string>>>[]',
			'\tprojectionPath?: readonly [string, ...string[]]',
			'\tboundaryLiveOptional?: true',
			'}',
			'',
			'export type E2eRouteFixtureMetadata = {',
			'\tnodeId: string',
			'\tpublicPath: string',
			'\tmappings: readonly E2eRouteFixtureMapping[]',
			'\tfixture?: Readonly<Partial<Record<string, string>>>',
			'\tvariants?: readonly Readonly<Partial<Record<string, string>>>[]',
			'\tboundaryLiveOptional?: true',
			'}',
			'',
			`export const e2eRouteFixtureMetadataByNodeId = ${renderObject([...routeFixtureMetadataByNodeId.entries()]
				.filter(([, metadata]) => routeParamNames(metadata.publicPath).length > 0)
				.sort(([left], [right]) => left.localeCompare(right, 'en', {
					sensitivity: 'base',
					numeric: true,
				}))
				.map(([nodeId, metadata]) => [
					q(nodeId),
					renderObject([
						['nodeId', q(metadata.nodeId)],
						['publicPath', q(metadata.publicPath)],
						['mappings', renderArray(metadata.mappings.map((mapping) => renderObject(routeMappingFixtureMetadataEntries(mapping))))],
						['fixture', metadata.fixture == null ? undefined : renderObject(Object.entries(metadata.fixture).map(([key, value]) => [key, q(value)]))],
						['variants', metadata.variants.length === 0 ? undefined : renderArray(metadata.variants.map((variant) => renderObject(Object.entries(variant).map(([key, value]) => [key, q(value)]))))],
						['boundaryLiveOptional', metadata.boundaryLiveOptional ? 'true' : undefined],
					]),
				]))} as const satisfies Record<string, E2eRouteFixtureMetadata>`,
		],
	}
)}

const renderAppEnum = (appEnum: App['schema']['enums'][number]) => [
	`export enum ${appEnum.name} {`,
	...appEnum.members.map((member) => `\t${member.name} = ${renderLiteral(member.value)},`),
	'}',
].join('\n')

const renderValueTypeType = (valueTypeType: ValueTypeType | undefined): string => {
	if (valueTypeType == null)
		return 'type("unknown")'
	if ('primitive' in valueTypeType)
		return `type(${q(valueTypeType.primitive)})`
	if ('unit' in valueTypeType)
		return `type.unit(${renderLiteral(valueTypeType.unit)})`
	if ('enum' in valueTypeType)
		return `type.enumerated(...Object.values(${valueTypeType.enum}))`
	if ('array' in valueTypeType)
		return `${renderValueTypeType(valueTypeType.array)}.array()`
	if ('object' in valueTypeType)
		return `type({ ${valueTypeType.object.map((field) => `${q(field.name)}: ${renderValueTypeType(field.type)}`).join(', ')} })`

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

const renderEntitySchemaFile = (entity: Entity, indexes: AppIndexes) => {
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
			renderImportObject(indexes.valueTypeById.get(field.valueType)?.imports)
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
					'EntityFieldCardinality',
					'EntityFieldType',
					'entity',
					'facet',
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
		...entity.selectors.map((selector) => `\t${selectorMemberName(selector)} = ${q(selector.name)},`),
		'}',
	].join('\n')
	const body = [
		...(entity.enums ?? []).map(renderAppEnum),
		selectorEnumSource,
		`export const ${entity.entityType} = entity({`,
			indent(`entityType: ${enumAccess('EntityType', entity.entityType)},`),
			indent('labels: {'),
			indent(`singular: ${q(entityLabel(entity))},`, 2),
			indent(`plural: ${q(entityLabelPlural(entity))},`, 2),
			indent('},'),
			...(entity.description == null ? [] : [indent(`description: ${q(entity.description)},`)]),
			`})({`,
			...entity.fields.flatMap((fieldDefinition) => renderSchemaFieldEntry(fieldDefinition, indexes).map((line) => indent(line))),
			`})({`,
			indent('selectors: {'),
			...entity.selectors.flatMap((selector) => [
				indent(`${objectPropertyKey(selectorMemberName(selector))}: [`, 2),
				...selector.fields.map((fieldName) => indent(`${q(fieldName)},`, 3)),
				indent('],', 2),
			]),
			indent('},'),
			...(entity.facets == null || entity.facets.length === 0 ? [] : [
				'',
				indent('facets: {'),
				...entity.facets.flatMap((facetDefinition) => renderSchemaFacetEntry(facetDefinition, indexes).map((line) => indent(line, 2))),
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

const renderSchemaFieldEntry = (fieldDefinition: EntityField, indexes: AppIndexes) => [
	`${objectPropertyKey(fieldDefinition.name)}: {`,
	...renderObject([
		['label', fieldDefinition.label == null ? undefined : q(fieldDefinition.label)],
		['labelPlural', fieldDefinition.labelPlural == null ? undefined : q(fieldDefinition.labelPlural)],
		['description', fieldDefinition.description == null ? undefined : q(fieldDefinition.description)],
		['type', enumAccess('EntityFieldType', fieldDefinition.type)],
		[
			'primitiveType',
			fieldDefinition.type === EntityFieldType.Primitive ?
				renderValueTypeType((fieldDefinition.valueType == null ? undefined : indexes.valueTypeById.get(fieldDefinition.valueType))?.type ?? fieldDefinition.primitiveType)
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
		['defaultSources', renderSourceArray(fieldDefinition.defaultSources)],
		['normalize', fieldDefinition.normalize],
	]).split('\n').slice(1, -1),
	'},',
]

const renderSchemaFacetEntry = (
	facetDefinition: NonNullable<Entity['facets']>[number],
	indexes: AppIndexes
) => {
	const fieldStage = (facetDefinition.fields?.length ?? 0) === 0 ? [
		`${objectPropertyKey(facetDefinition.name)}: facet(${renderFacetCondition(facetDefinition.condition)})({})`,
	] : [
		`${objectPropertyKey(facetDefinition.name)}: facet(${renderFacetCondition(facetDefinition.condition)})({`,
		...(facetDefinition.fields ?? []).flatMap((fieldDefinition) => renderSchemaFieldEntry(fieldDefinition, indexes).map((line) => indent(line))),
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
		...facetDefinition.facets.flatMap((facet) => renderSchemaFacetEntry(facet, indexes).map((line) => indent(line, 2))),
		indent('},'),
		'}),',
	]
}

const renderSchemaIndexFile = (indexes: AppIndexes) => {
	const entityTypes = indexes.activeEntities.map((entity) => entity.entityType)
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
		'export type RegisteredEntityType = (typeof schema)[number][\'entityType\']',
		'export type EntitySchemaFieldName<_EntityType extends RegisteredEntityType> = EntityFieldDefinitions<Extract<(typeof schema)[number], { readonly entityType: _EntityType }>>[\'name\']',
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

const renderSourceFile = (normalizedApp: App) => tsFile(
	'src/sources/Source.ts',
	{
		body: [
			renderStringEnum('Source', normalizedApp.sources.sources.map((source) => source.source)),
		],
	}
)

const renderMarkdownTableCell = (value: string) => value
	.replaceAll('&', '&amp;')
	.replaceAll('|', '&#124;')
	.replaceAll('<', '&lt;')
	.replaceAll('>', '&gt;')
	.replaceAll('\n', '<br>')

const renderMarkdownTable = (
	headings: readonly string[],
	rows: readonly (readonly string[])[]
) => [
	`| ${headings.join(' | ')} |`,
	`| ${headings.map(() => '---').join(' | ')} |`,
	...rows.map((row) => `| ${row.map(renderMarkdownTableCell).join(' | ')} |`),
]

export const renderSourcesMarkdown = (normalizedApp: App) => {
	const sourceBindingRows = normalizedApp.sources.sources
		.flatMap((source) => sourceBindings(source).map((binding) => ({
			binding,
			provider: source.provider,
			source: source.source,
		})))
		.map((sourceBinding, index) => ({
			...sourceBinding,
			bindingNumber: String(index + 1),
		}))

	return [
		'# Blockhead Sources',
		'',
		'This file is generated from the canonical provider, source, and binding metadata in `APP.ts`. Active source modules are neither imported nor read during generation.',
		'',
		'Provider/source identity, target, endpoint reality, protocol, API family, operation groups, delivery, credentials, and artifacts remain independent axes. CORS is recorded per HTTP endpoint; proxy and live behavior are recorded as delivery.',
		'',
		`${normalizedApp.sources.providers.length} providers register ${normalizedApp.sources.sources.length} sources and ${sourceBindingRows.length} bindings.`,
		'',
		'## Providers',
		'',
		...renderMarkdownTable(
			[
				'Provider',
				'Label',
			],
			normalizedApp.sources.providers.map((provider) => [
				provider.provider,
				provider.label,
			])
		),
		'',
		'## Sources',
		'',
		...renderMarkdownTable(
			[
				'Source',
				'Provider',
				'Label',
			],
			normalizedApp.sources.sources.map((source) => [
				source.source,
				source.provider,
				source.label,
			])
		),
		'',
		'## Bindings',
		'',
		...renderMarkdownTable(
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
		...renderMarkdownTable(
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
		...renderMarkdownTable(
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
		...renderMarkdownTable(
			[
				'Binding',
				'Artifact',
				'Kind',
				'Path',
				'Generated',
				'Official URL',
			],
			sourceBindingRows.flatMap(({ binding, bindingNumber }) => (binding.artifacts ?? []).map((artifact, index) => [
				bindingNumber,
				String(index + 1),
				artifact.kind,
				artifact.path,
				artifact.generated ? 'yes' : 'no',
				artifact.officialUrl ?? '',
			]))
		),
	].join('\n')
}

const renderSourcesMarkdownFile = (normalizedApp: App) => textFile('SOURCES.md', lines(renderSourcesMarkdown(normalizedApp)))

const renderSourceProviderFile = (normalizedApp: App) => tsFile(
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
			renderStringEnum('SourceProvider', normalizedApp.sources.providers.map((provider) => provider.provider)),
		],
	}
)

const renderEnvSchema = (env: App['sources']['providers'][number]['env']) => (
	env == null ?
		undefined
	: env.keys.length === 0 ?
		`arktype({\n\t'[string]': 'string',\n})`
	:
		`arktype({\n${env.keys.map((key) => `\t${q(key.name)}: ${q(key.type)},`).join('\n')}\n})`
)

const renderSourceDefinition = (source: Pick<App['sources']['sources'][number], 'provider' | 'source' | 'label' | 'env'>) => renderObject([
	['provider', enumAccess('SourceProvider', source.provider)],
	['source', enumAccess('Source', source.source)],
	['label', q(source.label)],
	['env', renderEnvSchema(source.env)],
])

const renderSourceBinding = (
	provider: string,
	source: string,
	binding: NonNullable<App['sources']['sources'][number]['binding']>
) => renderObject([
	['provider', enumAccess('SourceProvider', provider)],
	['source', enumAccess('Source', source)],
	['target', renderObject([
		['kind', enumAccess('SourceTargetKind', binding.target.kind)],
		['key', q(binding.target.key)],
	])],
	['endpoints', renderArray(binding.endpoints.map((endpoint) => renderObject([
		['endpointKind', enumAccess('SourceEndpointKind', endpoint.endpointKind)],
		['locator', q(endpoint.locator)],
		['origin', endpoint.origin == null ? undefined : q(endpoint.origin)],
		['corsEnabled', endpoint.corsEnabled == null ? undefined : String(endpoint.corsEnabled)],
	])))],
	['wireProtocol', enumAccess('WireProtocol', binding.wireProtocol)],
	['apiFamily', enumAccess('ApiFamily', binding.apiFamily)],
	['operationGroups', renderArray(binding.operationGroups.map((group) => enumAccess('SourceOperationGroup', group)))],
	['delivery', enumAccess('SourceDelivery', binding.delivery)],
	['credentials', renderArray(binding.credentials.map((credential) => renderObject([
		['scope', enumAccess('SourceCredentialScope', credential.scope)],
		['env', renderEnvSchema(credential.env)],
		['keys', credential.keys == null ? undefined : renderArray(credential.keys.map(q))],
	])))],
	['artifacts', binding.artifacts == null ? undefined : renderArray(binding.artifacts.map((artifact) => renderObject([
		['kind', enumAccess('SourceArtifactKind', artifact.kind)],
		['path', q(artifact.path)],
		['generated', String(artifact.generated)],
		['officialUrl', artifact.officialUrl == null ? undefined : q(artifact.officialUrl)],
	])))],
])

const renderSourceProvidersFile = (normalizedApp: App) => tsFile(
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
			...normalizedApp.sources.providers.map((provider) => {
				const sources = normalizedApp.sources.sources.filter((source) => source.provider === provider.provider)
				const bindings = sources.flatMap((source) => sourceBindings(source).map((binding) => ({
					binding,
					source,
				})))
				const origins = [...new Map(bindings
					.flatMap(({ binding }) => binding.endpoints)
					.flatMap((endpoint) => endpoint.origin == null ? [] : [[
						endpoint.origin,
						{
							origin: endpoint.origin,
							corsEnabled: endpoint.corsEnabled === true,
						},
					] as const])).values()]

				return indent(`${renderObject([
					['provider', enumAccess('SourceProvider', provider.provider)],
					['label', q(provider.label)],
					['env', renderEnvSchema(provider.env)],
					['sources', renderArray(sources.map(renderSourceDefinition))],
					['bindings', renderArray(bindings.map(({ binding, source }) => renderSourceBinding(source.provider, String(source.source), binding)))],
					['origins', provider.origins !== true || origins.length === 0 ? undefined : renderArray(origins.map((origin) => renderObject([
						['origin', q(origin.origin)],
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

const renderSourceSelectionsFile = (sourceSelections: readonly _SourceSelection[]) => tsFile(
	'src/sources/$sourceSelections.ts',
	{
		imports: [
			{
				from: '$/sources/Source.ts',
				names: ['Source'],
			},
		],
		body: [...new Map(sourceSelections
			.filter((selection) => selection.name != null)
			.map((selection) => [defaultSourcesName(selection), selection])).values()]
			.flatMap((selection) => [
				`export const ${defaultSourcesName(selection)} = ${renderSourceArray(selection.default)}`,
				'',
				`export const ${sourceSelectionByKeyName(selection)}: Record<string, readonly Source[]> = ${renderSourceSelectionByKey(selection)}`,
				'',
			]),
	}
)

const renderNavigationItemsFile = (app: App) => tsFile(
	'src/routes/navigationItems.svelte.ts',
	{
		imports: [
			{
				from: '$/routes/NavigationItem.ts',
				typeNames: ['NavigationItem'],
			},
		],
		body: [
			`export const navigationItems = ${renderGeneratedValue(app.navigation.items)} satisfies NavigationItem[]`,
		],
	}
)

const renderSourcesIndexFile = () => tsFile(
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

const renderSourcesServerIndexFile = () => tsFile(
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
			'\t\t|| credential.keys == null',
			'\t\t|| credential.keys.every((key) => privateEnv[key]?.trim() !== \'\')',
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
			'export const remoteLiveBindings = enabledSourceBindings.filter((binding) => (',
			'\tbinding.delivery === SourceDelivery.RemoteLive',
			'))',
		],
	}
)

const renderOfficialArtifactsFile = (normalizedApp: App) => {
	const artifacts = normalizedApp.sources.sources
		.flatMap((source) => sourceBindings(source).flatMap((binding) => binding.artifacts ?? []))
		.filter((artifact) => artifact.officialUrl != null)

	return tsFile(
		'src/sources/officialArtifacts.ts',
		{
			body: [
				`export const officialSourceArtifacts = ${renderArray(artifacts.map((artifact) => renderObject([
					['path', q(artifact.path)],
					['officialUrl', artifact.officialUrl == null ? undefined : q(artifact.officialUrl)],
				])))} as const`,
			],
		}
	)
}

const renderResolverIndexFile = (app: App) => tsFile(
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
			...app.resolvers.modules.map((module) => `\t\t${q(module.path.replace(/^src\/resolvers\//, './'))},`),
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

const viewFieldNames = (entity: Entity, indexes: AppIndexes) => unique([
	...entity.selectors.flatMap((selector) => selector.fields),
	...viewItems(entitySingularView(entity)?.summary?.icon).flatMap((viewEntry) => itemFieldName(viewEntry)),
	...viewItems(entitySingularView(entity)?.summary?.title).flatMap((viewEntry) => itemFieldName(viewEntry)),
	...viewItems(entitySingularView(entity)?.summary?.value).flatMap((viewEntry) => itemFieldName(viewEntry)),
	...viewItems(entitySingularView(entity)?.summary?.titleFallback).flatMap((viewEntry) => itemFieldName(viewEntry)),
	...viewItems(entitySingularView(entity)?.summary?.HeadingAfter).flatMap((viewEntry) => itemFieldName(viewEntry)),
	...contentDlGroups(entity, indexes).flatMap((viewEntries) => viewEntries.flatMap((viewEntry) => itemFieldName(viewEntry))),
	...(singularViewContent(entitySingularView(entity))?.body == null ? [] : [entitySingularView(entity).content.body.field]),
	...(singularViewContent(entitySingularView(entity))?.blocks ?? []).flatMap((viewEntries) => viewEntries.flatMap((viewEntry) => itemFieldName(viewEntry))),
	...(singularViewDetails(entitySingularView(entity))?.items ?? []).flatMap((group) => group.items.flatMap((viewEntry) => itemFieldName(viewEntry))),
	...(singularViewDetails(entitySingularView(entity))?.body == null ? [] : [entitySingularView(entity).details.body.field]),
	...(singularViewDetails(entitySingularView(entity))?.tabs ?? []).flatMap((group) => (group.items ?? []).flatMap((viewEntry) => itemFieldName(viewEntry))),
	...(entitySingularView(entity)?.carousels ?? []).flatMap((group) => group.sections.flatMap((section) => (section.items ?? []).flatMap((viewEntry) => itemFieldName(viewEntry)))),
])

const entitySelectorFieldNames = (entity: Entity) => new Set(entity.selectors.flatMap((selector) => selector.fields))

const entitySelectorOwnsField = (entity: Entity, fieldName: string) => entity.selectors.every((selector) => selector.fields.includes(fieldName))

const pendingEntityExpression = 'pendingEntity'

const resolvedEntityExpression = 'resolvedEntity'

const pendingEntitySurfaceExpression = '({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched })'

const resolvedEntitySurfaceExpression = `{ ...${pendingEntityExpression}, ...entity }`

const renderPendingEntityDerived = () => [
	`const ${pendingEntityExpression} = $derived(${pendingEntitySurfaceExpression})`,
]

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

const viewResolvedFieldNames = (entity: Entity, indexes: AppIndexes) => {
	const selectorFieldNames = entitySelectorFieldNames(entity)

	return viewFieldNames(entity, indexes).filter((fieldName) => !selectorFieldNames.has(fieldName))
}

const viewItems = (viewEntries: _ViewItem[] | _ViewItem | undefined): _ViewItem[] => (
	viewEntries == null ?
		[]
	: Array.isArray(viewEntries) ?
		viewEntries
	:
		[viewEntries]
)

const itemFieldReferences = (viewEntry: _ViewItem): FieldReference[] => {
	if (typeof viewEntry === 'string')
		return [viewEntry]
	if ('fields' in viewEntry && viewEntry.fields != null)
		return viewEntry.fields
	if ('field' in viewEntry)
		return [viewEntry.field]

	return []
}

const itemFieldName = (viewEntry: _ViewItem) => itemFieldReferences(viewEntry).map(fieldNameForReference)

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

const fieldDefinitionByName = (entity: Entity, field: FieldReference) => entityFields(entity).find((fieldDefinition) => fieldDefinition.name === resolveFieldReference(entity, field))

const fieldValueType = (indexes: AppIndexes, fieldDefinition: EntityField) => (
	fieldDefinition.valueType == null ? undefined : indexes.valueTypeById.get(fieldDefinition.valueType)
)

const fieldValueTypeType = (indexes: AppIndexes, fieldDefinition: EntityField) => (
	fieldValueType(indexes, fieldDefinition)?.type ?? fieldDefinition.primitiveType
)

const fieldHasDisplayExpression = (indexes: AppIndexes, fieldDefinition: EntityField) => (
	fieldValueType(indexes, fieldDefinition)?.displayExpression != null
)

const fieldNeedsExplicitDisplayExpression = (indexes: AppIndexes, fieldDefinition: EntityField) => {
	const valueTypeType = fieldValueTypeType(indexes, fieldDefinition)

	return (
		valueTypeTypeIsStructured(valueTypeType)
		|| valueTypeType != null && 'primitive' in valueTypeType && valueTypeType.primitive === 'unknown'
	) && !fieldHasDisplayExpression(indexes, fieldDefinition)
}

const textExpression = (valueExpression: string) => {
	return `String((${valueExpression}) ?? '')`
}

const renderDisplayExpression = (entity: Entity, indexes: AppIndexes, fieldName: string, valueExpression: string) => {
	const fieldDefinition = fieldDefinitionByName(entity, fieldName)
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

const viewItemFormat = (entity: Entity, indexes: AppIndexes, viewEntry: _ViewItem) => {
	const fieldReference = itemFieldReferences(viewEntry)[0]
	const fieldName = fieldReference == null ? undefined : fieldNameForReference(fieldReference)
	if (fieldName == null)
		return undefined
	if (typeof viewEntry === 'object' && 'format' in viewEntry && viewEntry.format != null)
		return viewEntry.format

	const fieldDefinition = fieldDefinitionByName(entity, fieldName)
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

const renderMappedDisplayExpression = (
	entity: Entity,
	indexes: AppIndexes,
	viewEntry: _ViewItem,
	fieldName: string,
	valueExpression: string
) => {
	const baseExpression = renderDisplayExpression(entity, indexes, fieldName, valueExpression)
	if (typeof viewEntry !== 'object' || !('field' in viewEntry) || viewEntry.enumConstantMap == null)
		return baseExpression

	return textExpression(`${viewEntry.enumConstantMap}[String(${valueExpression})]?.${viewEntry.enumConstantProperty ?? 'label'} ?? (${baseExpression})`)
}

const renderItemHrefExpression = (viewEntry: _ViewItem, fieldValuesExpression: string) => (
	typeof viewEntry === 'object' && 'link' in viewEntry && viewEntry.link != null ?
		(
			viewEntry.link.href.includes('(') ?
				renderRouteResolveExpression
			:
				renderResolveExpression
		)(
			viewEntry.link.href,
			(viewEntry.link.params ?? []).map((param) => [
				param.param,
				viewEntry.link?.href.includes('(') === true ?
					renderRouteParamValueExpression(param.value, fieldValuesExpression)
				:
					renderAppExpression(param.value, {
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

const renderValueMarkup = (
	entity: Entity,
	indexes: AppIndexes,
	viewEntry: _ViewItem,
	fieldName: string,
	valueExpression: string,
	fieldValuesExpression: string,
	level: number
) => {
	const format = viewItemFormat(entity, indexes, viewEntry)
	const displayExpression = renderMappedDisplayExpression(entity, indexes, viewEntry, fieldName, valueExpression)
	const hrefExpression = renderItemHrefExpression(viewEntry, fieldValuesExpression)
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
		renderSvelteAttribute(level + 1, 'href', hrefExpression),
		`${'\t'.repeat(level)}>`,
		...prefixedValueMarkup.map((line) => indent(line)),
		`${'\t'.repeat(level)}</a>`,
	]
}

const renderItemExpression = (entity: Entity, indexes: AppIndexes, viewEntry: _ViewItem, entityFieldsExpression: string) => {
	if (typeof viewEntry === 'string') {
		if (fieldDefinitionByName(entity, viewEntry)?.type === EntityFieldType.EntityReference)
			return q('')

		return renderDisplayExpression(entity, indexes, viewEntry, viewFieldExpression(entity, entityFieldsExpression, viewEntry))
	}
	if ('kind' in viewEntry && viewEntry.kind === 'Text')
		return q(viewEntry.value ?? viewEntry.label)
	if (!('field' in viewEntry))
		return q('')

	if (fieldDefinitionByName(entity, viewEntry.field)?.type === EntityFieldType.EntityReference)
		return q('')

	const fieldValue = viewFieldExpression(entity, entityFieldsExpression, viewEntry.field)
	const displayed = renderMappedDisplayExpression(entity, indexes, viewEntry, viewEntry.field, fieldValue)
	const value = viewEntry.prefix == null && viewEntry.suffix == null ?
		displayed
	:
		`(${displayed} ? ${[
			viewEntry.prefix == null ? undefined : q(viewEntry.prefix),
			displayed,
			viewEntry.suffix == null ? undefined : q(viewEntry.suffix),
		].filter((part): part is string => part != null).join(' + ')} : '')`
	if (viewEntry.valuePrefix == null)
		return value

	return `[
		${renderJoinedItemsExpression(entity, indexes, viewEntry.valuePrefix, entityFieldsExpression, '')},
		${value},
	].filter(Boolean).join(${q(viewEntry.valuePrefixSeparator ?? ' ')})`
}

const renderJoinedItemsExpression = (
	entity: Entity,
	indexes: AppIndexes,
	viewEntries: readonly _ViewItem[],
	entityFieldsExpression: string,
	separator = ' '
) => {
	if (viewEntries.length === 0)
		return 'undefined'

	const expressions = viewEntries
		.map((viewEntry) => renderItemExpression(entity, indexes, viewEntry, entityFieldsExpression))
		.filter((expression) => expression !== q(''))
	if (expressions.length === 0)
		return 'undefined'

	return `[${expressions.join(', ')}].filter(Boolean).join(${q(separator)})`
}

const renderFirstDeclaredExpression = (expressions: readonly (string | undefined)[]) => {
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
	...(singularViewDetails(entitySingularView(entity))?.items ?? []).flatMap((group) => group.items),
	...(singularViewDetails(entitySingularView(entity))?.blocks ?? []).flat(),
	...(singularViewDetails(entitySingularView(entity))?.tabs ?? []).flatMap((group) => group.items ?? []),
	...(entitySingularView(entity)?.carousels ?? []).flatMap((group) => group.sections.flatMap((section) => section.items ?? [])),
])

const viewItemImports = (entity: Entity, indexes: AppIndexes) => {
	const expressionImportMap = new Map<string, Set<string>>()
	const valueTypeImports: ImportSpec[] = []
	for (const viewEntry of allViewItems(entity)) {
		const fieldName = itemFieldName(viewEntry)[0]
		if (fieldName != null) {
			const fieldDefinition = fieldDefinitionByName(entity, fieldName)
			if (fieldDefinition?.valueType != null) {
				const valueType = indexes.valueTypeById.get(fieldDefinition.valueType)
				valueTypeImports.push(
					...renderImportObject(valueType?.imports),
					...renderImportObject(valueType?.displayImports)
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

const viewUsesFormat = (entity: Entity, indexes: AppIndexes, formats: readonly string[]) => allViewItems(entity)
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

const summaryVisualFieldNames = (entity: Entity) => new Set([
	...viewItems(entitySingularView(entity)?.summary?.icon).flatMap((viewEntry) => itemFieldName(viewEntry)),
	...declaredSummaryTitleEntries(entity).flatMap((viewEntry) => itemFieldName(viewEntry)),
	...viewItems(entitySingularView(entity)?.summary?.titleFallback).flatMap((viewEntry) => itemFieldName(viewEntry)),
	...declaredSummaryValueEntries(entity).flatMap((viewEntry) => itemFieldName(viewEntry)),
	...viewItems(entitySingularView(entity)?.summary?.HeadingAfter).flatMap((viewEntry) => itemFieldName(viewEntry)),
])

const defaultContentViewEntry = (indexes: AppIndexes, fieldDefinition: EntityField) => {
	if (fieldDefinition.type === EntityFieldType.EntitiesReference)
		return undefined
	if (fieldDefinition.type === EntityFieldType.Primitive && fieldNeedsExplicitDisplayExpression(indexes, fieldDefinition))
		return undefined

	return {
		kind: _ViewItemKind.Field,
		field: fieldDefinition.name,
	} satisfies Exclude<_ViewItem, string>
}

const defaultContentDlGroups = (entity: Entity, indexes: AppIndexes) => {
	if (
		(singularViewContent(entitySingularView(entity))?.dl ?? []).length > 0
		|| singularViewContent(entitySingularView(entity))?.body != null
		|| (singularViewContent(entitySingularView(entity))?.blocks ?? []).length > 0
		|| (singularViewLatest(entitySingularView(entity)) ?? []).length > 0
	)
		return []

	const summaryFields = summaryVisualFieldNames(entity)
	const entries = entity.fields
		.filter((fieldDefinition) => !summaryFields.has(fieldDefinition.name))
		.flatMap((fieldDefinition) => {
			const entry = defaultContentViewEntry(indexes, fieldDefinition)
			return entry == null ? [] : [entry]
		})

	return entries.length === 0 ? [] : [entries]
}

const contentDlGroups = (entity: Entity, indexes: AppIndexes) => {
	const summaryFields = summaryVisualFieldNames(entity)
	const carouselFieldKeys = new Set(
		(entitySingularView(entity)?.carousels ?? [])
			.flatMap((carousel) => carousel.sections)
			.map((section) => fieldReferenceKey(section.field))
	)
	const modeledDlGroups = singularViewContent(entitySingularView(entity))?.dl ?? []
	const effectiveDlGroups = modeledDlGroups
		.map((viewEntries) => viewEntries.filter((viewEntry) => itemFieldReferences(viewEntry).every((field) => !carouselFieldKeys.has(fieldReferenceKey(field)))))
		.filter((viewEntries) => viewEntries.length > 0)
	const openFieldNames = new Set(effectiveDlGroups.flatMap((viewEntries) => viewEntries.flatMap((viewEntry) => itemFieldName(viewEntry))))
	const serialFieldName = summarySerial(entity)?.field
	const closedItems = viewItems(entitySingularView(entity)?.closed)
		.filter((viewEntry) => itemFieldName(viewEntry).every((fieldName) => fieldName !== serialFieldName && !summaryFields.has(fieldName) && !openFieldNames.has(fieldName)))

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
		...(singularViewLists(entitySingularView(entity)) ?? []).flatMap((list) => (
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

const declaredRelationshipSectionComponent = (section: RelationshipSection, indexes: AppIndexes) => {
	if (section.component != null && indexes.generatedComponents.has(section.component))
		return section.component

	return undefined
}

const renderSerialBadgeMarkup = (valueExpression: string, level: number) => [
	`${'\t'.repeat(level)}<span data-badge="small">`,
	`${'\t'.repeat(level + 1)}#{${textExpression(valueExpression)}}`,
	`${'\t'.repeat(level)}</span>`,
]

const renderSerialTextExpression = (
	entity: Entity,
	indexes: AppIndexes,
	serial: NonNullable<ReturnType<typeof summarySerial>>,
	entityFieldsExpression: string
) => {
	const fallbackExpression = renderJoinedItemsExpression(entity, indexes, viewItems(serial.fallback), entityFieldsExpression)
	const serialExpression = textExpression(viewFieldExpression(entity, entityFieldsExpression, serial.field))
	return renderFirstDeclaredExpression([
		`(${serialExpression} ? ${q(`${serial.label} #`)} + ${serialExpression} : '')`,
		fallbackExpression,
	])
}

const renderSerialTitleBody = (
	entity: Entity,
	indexes: AppIndexes,
	serial: NonNullable<ReturnType<typeof summarySerial>>,
	entityFieldsExpression: string,
	level: number
) => {
	const fallbackExpression = renderJoinedItemsExpression(entity, indexes, viewItems(serial.fallback), entityFieldsExpression)

	return [
		`${'\t'.repeat(level)}{@const serialValue = ${viewFieldExpression(entity, entityFieldsExpression, serial.field)}}`,
		`${'\t'.repeat(level)}{#if serialValue !== undefined && serialValue !== null}`,
		`${'\t'.repeat(level + 1)}<span data-row="inline align-center gap-2 wrap">`,
		`${'\t'.repeat(level + 2)}<span>${serial.label} </span>`,
		...renderSerialBadgeMarkup('serialValue', level + 2),
		`${'\t'.repeat(level + 1)}</span>`,
		...(serial.fallback == null ? [] : [
			`${'\t'.repeat(level)}{:else}`,
			`${'\t'.repeat(level + 1)}{${fallbackExpression}}`,
		]),
		`${'\t'.repeat(level)}{/if}`,
	]
}

const renderSerialValueBody = (
	entity: Entity,
	indexes: AppIndexes,
	serial: NonNullable<ReturnType<typeof summarySerial>>,
	entityFieldsExpression: string,
	level: number
) => {
	const fallbackExpression = renderJoinedItemsExpression(entity, indexes, viewItems(serial.fallback), entityFieldsExpression)

	return [
		`${'\t'.repeat(level)}{@const serialValue = ${viewFieldExpression(entity, entityFieldsExpression, serial.field)}}`,
		`${'\t'.repeat(level)}{#if serialValue !== undefined && serialValue !== null}`,
		...renderSerialBadgeMarkup('serialValue', level + 1),
		...(serial.fallback == null ? [] : [
			`${'\t'.repeat(level)}{:else}`,
			`${'\t'.repeat(level + 1)}{${fallbackExpression}}`,
		]),
		`${'\t'.repeat(level)}{/if}`,
	]
}

const renderSerialTitleSnippet = (
	entity: Entity,
	indexes: AppIndexes,
	serial: NonNullable<ReturnType<typeof summarySerial>>,
	selectorOwnsSerial: boolean,
	entityName: string
) => selectorOwnsSerial ? [
	...renderSerialTitleBody(entity, indexes, serial, pendingEntityExpression, 2),
] : [
	`\t\t<ResourceBoundary resource={${entityName}}>`,
	'\t\t\t{#snippet Pending()}',
	...renderSerialTitleBody(entity, indexes, serial, pendingEntityExpression, 4),
	'\t\t\t{/snippet}',
	'\t\t\t{#snippet children(entity)}',
	`\t\t\t\t{@const ${resolvedEntityExpression} = ${resolvedEntitySurfaceExpression}}`,
	...renderSerialTitleBody(entity, indexes, serial, resolvedEntityExpression, 4),
	'\t\t\t{/snippet}',
	'\t\t</ResourceBoundary>',
]

const renderSerialValueSnippet = (
	entity: Entity,
	indexes: AppIndexes,
	serial: NonNullable<ReturnType<typeof summarySerial>>,
	selectorOwnsSerial: boolean,
	entityName: string
) => selectorOwnsSerial ? [
	...renderSerialValueBody(entity, indexes, serial, pendingEntityExpression, 2),
] : [
	`\t\t<ResourceBoundary resource={${entityName}}>`,
	'\t\t\t{#snippet Pending()}',
	...renderSerialValueBody(entity, indexes, serial, pendingEntityExpression, 4),
	'\t\t\t{/snippet}',
	'\t\t\t{#snippet children(entity)}',
	`\t\t\t\t{@const ${resolvedEntityExpression} = ${resolvedEntitySurfaceExpression}}`,
	...renderSerialValueBody(entity, indexes, serial, resolvedEntityExpression, 4),
	'\t\t\t{/snippet}',
	'\t\t</ResourceBoundary>',
]

const renderSingularViewFile = (entity: Entity, indexes: AppIndexes) => {
	const componentName = singularComponentName(entity.entityType)
	const serial = summarySerial(entity)
	const selectorOwnsSerial = serial != null && entity.selectors.some((selector) => selector.fields.includes(serial.field))
	const configuredSummaryTitleItems = viewItems(entitySingularView(entity)?.summary?.title)
	const rendersSerialTitle = (
		serial != null
		&& (
			configuredSummaryTitleItems.length === 0
			|| configuredSummaryTitleItems.every((item) => itemFieldName(item)[0] === serial.field)
		)
	)
	const rendersSerialValue = (
		serial != null
		&& (
			declaredSummaryValueEntries(entity).length === 0
			|| declaredSummaryValueEntries(entity).every((viewEntry) => itemFieldName(viewEntry)[0] === serial.field)
		)
	)
	const selectorFieldNames = entitySelectorFieldNames(entity)
	const queryFields = unique([
		...(singularViewQuery(entitySingularView(entity))?.fields ?? []),
		...viewItems(entitySingularView(entity)?.summary?.icon).flatMap((viewEntry) => itemFieldName(viewEntry)),
		...summarySerialItems(entity).flatMap((viewEntry) => itemFieldName(viewEntry)),
		...viewItems(entitySingularView(entity)?.summary?.title).flatMap((viewEntry) => itemFieldName(viewEntry)),
		...viewItems(entitySingularView(entity)?.summary?.value).flatMap((viewEntry) => itemFieldName(viewEntry)),
		...viewItems(entitySingularView(entity)?.summary?.titleFallback).flatMap((viewEntry) => itemFieldName(viewEntry)),
		...viewItems(entitySingularView(entity)?.summary?.HeadingAfter).flatMap((viewEntry) => itemFieldName(viewEntry)),
	]).filter((fieldName) => {
		const fieldDefinition = fieldDefinitionByName(entity, fieldName)
		return (
			fieldDefinition != null
			&& !selectorFieldNames.has(fieldName)
			&& fieldDefinition.type !== EntityFieldType.EntityReference
			&& fieldDefinition.type !== EntityFieldType.EntitiesReference
		)
	})
		const sections = declaredRelationshipViewSections(entity)
	const detailsTabs = singularViewDetails(entitySingularView(entity))?.tabs ?? []
	const summaryTitleEntityReferenceItems = (rendersSerialTitle ? [] : declaredSummaryTitleEntries(entity)).flatMap((viewEntry) => {
		const fieldName = itemFieldName(viewEntry)[0]
		const fieldDefinition = fieldName == null ? undefined : fieldDefinitionByName(entity, fieldName)
		return fieldDefinition?.type === EntityFieldType.EntityReference && fieldDefinition.entityType != null ?
			[fieldDefinition.entityType]
		:
			[]
	})
	const summaryValueEntityReferenceItems = (rendersSerialValue ? [] : declaredSummaryValueEntries(entity)).flatMap((viewEntry) => {
		const fieldName = itemFieldName(viewEntry)[0]
		const fieldDefinition = fieldName == null ? undefined : fieldDefinitionByName(entity, fieldName)
		return fieldDefinition?.type === EntityFieldType.EntityReference && fieldDefinition.entityType != null ?
			[fieldDefinition.entityType]
		:
			[]
	})
	const summaryAfterEntityReferenceItems = viewItems(entitySingularView(entity)?.summary?.HeadingAfter).flatMap((viewEntry) => {
		const fieldName = itemFieldName(viewEntry)[0]
		const fieldDefinition = fieldName == null ? undefined : fieldDefinitionByName(entity, fieldName)
		return fieldDefinition?.type === EntityFieldType.EntityReference && fieldDefinition.entityType != null ?
			[fieldDefinition.entityType]
		:
			[]
	})
	const summaryItemsNeedMarkup = (items: readonly _ViewItem[]) => (
		items.some((viewEntry) => {
			const fieldName = itemFieldName(viewEntry)[0]
			return fieldName != null && fieldDefinitionByName(entity, fieldName)?.type === EntityFieldType.EntityReference
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
	const summaryIconFieldName = itemFieldName(entitySingularView(entity)?.summary?.icon ?? '')[0]
	const summaryIconFieldDefinition = summaryIconFieldName == null ? undefined : fieldDefinitionByName(entity, summaryIconFieldName)
	const summaryIconEntityReferenceComponent = (
		summaryIconFieldDefinition?.type === EntityFieldType.EntityReference
		&& summaryIconFieldDefinition.entityType != null ?
			singularComponentName(summaryIconFieldDefinition.entityType)
		:
			undefined
	)
	const entityReferenceItems = [...contentDlGroups(entity, indexes).flat(), ...contentBlocks(entity).flat(), ...detailsTabs.flatMap((tab) => tab.items ?? [])].flatMap((viewEntry) => {
		const fieldName = itemFieldName(viewEntry)[0]
		const fieldDefinition = fieldName == null ? undefined : fieldDefinitionByName(entity, fieldName)
		return fieldDefinition?.type === EntityFieldType.EntityReference && fieldDefinition.entityType != null ?
			[fieldDefinition.entityType]
		:
			[]
	})
	const carouselEntityReferenceItems = (entitySingularView(entity)?.carousels ?? []).flatMap((carousel) => carousel.sections.flatMap((section) => {
		const fieldDefinition = section.field == null ? undefined : fieldDefinitionByName(entity, section.field)
		return fieldDefinition?.type === EntityFieldType.EntityReference && fieldDefinition.entityType != null ?
			[fieldDefinition.entityType]
		:
			[]
	}))
	const detailsTabSections = detailsTabs.flatMap((tab) => (tab.items ?? []).flatMap((viewEntry) => {
		const field = itemFieldName(viewEntry)[0]
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
			const fieldName = itemFieldName(viewEntry)[0]
			return fieldName != null && fieldDefinitionByName(entity, fieldName)?.type === EntityFieldType.EntityReference
		})
		|| sections.some((section) => fieldDefinitionByName(entity, section.field)?.type === EntityFieldType.EntityReference)
		|| detailsTabSections.some((section) => fieldDefinitionByName(entity, section.field)?.type === EntityFieldType.EntityReference)
		|| carousels.some((carousel) => carousel.sections.some((section) => (
			section.field != null
			&& carouselSectionComponent(entity, indexes, section) != null
			&& fieldDefinitionByName(entity, section.field)?.type === EntityFieldType.EntityReference
		)))
		|| rawSnippetSources(entity).some((snippet) => snippet.raw.includes('select('))
	)
	const sectionComponents = unique([...sections, ...detailsTabSections].flatMap((section) => {
		const fieldDefinition = fieldDefinitionByName(entity, section.field)
			const component = fieldDefinition == null ? undefined : declaredRelationshipSectionComponent(section, indexes)
		return component == null ? [] : [component]
	}).concat(
		entityReferenceItems.flatMap((entityType) => {
			const targetEntity = indexes.entityByType.get(entityType)
			return targetEntity == null ? [] : [singularComponentName(targetEntity.entityType)]
		}),
		summaryTitleEntityReferenceItems.flatMap((entityType) => {
			const targetEntity = indexes.entityByType.get(entityType)
			return targetEntity == null ? [] : [singularComponentName(targetEntity.entityType)]
		}),
		summaryValueEntityReferenceItems.flatMap((entityType) => {
			const targetEntity = indexes.entityByType.get(entityType)
			return targetEntity == null ? [] : [singularComponentName(targetEntity.entityType)]
		}),
		summaryAfterEntityReferenceItems.flatMap((entityType) => {
			const targetEntity = indexes.entityByType.get(entityType)
			return targetEntity == null ? [] : [singularComponentName(targetEntity.entityType)]
		}),
		latestItems.flatMap((latest) => {
			const component = latestComponentName(entity, latest)
			return component == null ? [] : [component]
		}),
		(singularViewDetails(entitySingularView(entity))?.tabs ?? []).flatMap((tab) => (
			tab.items.flatMap((item) => item.component == null ? [] : [item.component])
		)),
		carousels.flatMap((carousel) => carousel.sections.flatMap((section) => {
			const component = carouselSectionComponent(entity, indexes, section)
			return component == null ? [] : [component]
		})),
		rawSnippetSources(entity).flatMap((snippet) => (
			indexes.activeEntities.flatMap((targetEntity) => [
				singularComponentName(targetEntity.entityType),
				pluralComponentName(targetEntity),
			])
				.filter((component) => (
					component !== singularComponentName(entity.entityType)
					&& snippet.raw.includes(`<${component}`)
				))
		)),
		...(summaryIconEntityReferenceComponent == null ? [] : [summaryIconEntityReferenceComponent])
	))
	const viewSourceSelection = singularViewQuery(entitySingularView(entity))?.sources
	const viewSourceSelectionFields = (
		viewSourceSelection != null
		&& !Array.isArray(viewSourceSelection)
		&& viewSourceSelection.name != null ?
			unique((viewSourceSelection.cases ?? []).flatMap((item) => item.when.flatMap((condition) => (
				condition.field == null ? [] : [condition.field]
			))))
		:
			[]
	)
	const viewSourceSelectionKeyExpression = viewSourceSelectionFields.length === 0 ?
		undefined
	:
		`[${viewSourceSelectionFields.map((field) => `String(${fieldExpression('selection.entitySelector', field)})`).join(', ')}].join(':')`
	const viewSourcesExpression = viewSourceSelectionKeyExpression == null || viewSourceSelection == null || Array.isArray(viewSourceSelection) || viewSourceSelection.name == null ?
		undefined
	:
		'selectedViewSources'
	const query = renderQuery(singularViewQuery(entitySingularView(entity)), queryFields, viewSourcesExpression, undefined, selectorFieldNames)
	const sectionQueries = sections.map((section) => renderQuery(fieldQueryForName(entity, section.field, section.selection), []))
	const latestQueries = latestItems.map((latest) => renderQuery(fieldQueryForName(entity, latest.field, latest.query), latest.fields ?? []))
	const carouselQueries = carousels.flatMap((carousel) => carousel.sections.flatMap((section) => (
		carouselSectionComponent(entity, indexes, section) == null ?
			[]
		:
			[renderQuery(fieldQueryForName(entity, section.field, section.selection), [])]
	)))
	const hasEntityReferenceCarouselSections = carousels.some((carousel) => carousel.sections.some((section) => (
		section.field != null
		&& fieldDefinitionByName(entity, section.field)?.type === EntityFieldType.EntityReference
		&& carouselSectionComponent(entity, indexes, section) != null
	)))
	const namedSourceSelections = unique([
		singularViewQuery(entitySingularView(entity))?.sources,
		...sections.map((section) => section.selection?.sources),
		...latestItems.map((latest) => latest.query?.sources),
		...carousels.flatMap((carousel) => carousel.sections.flatMap((section) => (
			carouselSectionComponent(entity, indexes, section) == null ?
				[]
			:
				[section.selection?.sources]
		))),
	].filter((sourceSelection): sourceSelection is _SourceSelection => (
		sourceSelection != null
		&& !Array.isArray(sourceSelection)
		&& sourceSelection.name != null
	)))
	const titleExpression = renderJoinedItemsExpression(entity, indexes, declaredSummaryTitleEntries(entity), resolvedEntityExpression)
	const valueExpression = renderJoinedItemsExpression(entity, indexes, declaredSummaryValueEntries(entity), resolvedEntityExpression)
	const pendingTitleExpression = renderJoinedItemsExpression(entity, indexes, declaredSummaryTitleEntries(entity), pendingEntityExpression)
	const pendingValueExpression = renderJoinedItemsExpression(entity, indexes, declaredSummaryValueEntries(entity), pendingEntityExpression)
	const fallbackTitleExpression = renderJoinedItemsExpression(
		entity,
		indexes,
		viewItems(entitySingularView(entity)?.summary?.titleFallback),
		pendingEntityExpression
	)
	const serialFallbackTitleExpression = serial == null ? renderFirstDeclaredExpression([pendingTitleExpression, fallbackTitleExpression]) : renderSerialTextExpression(entity, indexes, serial, pendingEntityExpression)
	const titleFallbackExpression = renderFirstDeclaredExpression([serialFallbackTitleExpression, q(displayLabel(entityLabel(entity)))])
	const pendingTitleFallbackExpression = renderFirstDeclaredExpression([serial == null ? pendingTitleExpression : renderSerialTextExpression(entity, indexes, serial, pendingEntityExpression), 'title', fallbackTitleExpression, q(displayLabel(entityLabel(entity)))])
	const entityTitleFallbackExpression = renderFirstDeclaredExpression([titleExpression, 'title', 'titleFallback'])
	const pendingValueFallbackExpression = renderFirstDeclaredExpression([pendingValueExpression, pendingTitleExpression, 'title', fallbackTitleExpression, q(displayLabel(entityLabel(entity)))])
	const entityValueFallbackExpression = renderFirstDeclaredExpression([valueExpression, titleExpression, 'titleFallback'])
	const entityHrefs = indexes.entityHrefsByType.get(entity.entityType) ?? []
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
			const entityType = latestTargetEntityType(entity, latest)
			return entityType == null ? [] : [entityType]
		}),
		...carouselEntityReferenceItems,
		...sections.flatMap((section) => {
			const fieldDefinition = fieldDefinitionByName(entity, section.field)
			return fieldDefinition?.type === EntityFieldType.EntityReference && fieldDefinition.entityType != null ? [fieldDefinition.entityType] : []
		}),
	])
	const entityReferenceHrefImports = Array.from(
		entityReferenceHrefEntityTypes
			.flatMap((entityType) => indexes.entityHrefsByType.get(entityType) ?? [])
			.flatMap((href) => href.params)
			.reduce((imports, param) => expressionImports(param.value, imports), new Map<string, Set<string>>())
			.entries()
	)
	const entityHrefExpression = renderEntityHrefExpression(
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
	) ? renderIconSnippet(entity, entityName) : []
	const expressionImportSpecs = mergeImports([
		...(entitySingularView(entity)?.imports ?? []).map((importSpec) => ({
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
			const fieldDefinition = fieldDefinitionByName(entity, section.field)
			return (
				section.href?.includes('(') === true
				|| fieldDefinition?.entityType != null && hasCollectionHref(entity, indexes, section.field, fieldDefinition.entityType)
			)
		})
		|| carousels.some((carousel) => carousel.sections.some((section) => {
			if (section.field == null)
				return false

			const fieldDefinition = fieldDefinitionByName(entity, section.field)
			return fieldDefinition?.entityType != null && hasCollectionHref(entity, indexes, section.field, fieldDefinition.entityType)
		}))
	)
	const usesEntityReferenceHrefs = entityReferenceHrefEntityTypes.some((entityType) => (indexes.entityHrefsByType.get(entityType)?.length ?? 0) > 0)
	const usesResolve = entityHrefExpression != null || allViewItems(entity).some((item) => typeof item === 'object' && 'link' in item && item.link != null) || usesCollectionHrefs || usesEntityReferenceHrefs
	const relationshipMarkup = renderRelationshipSections(entity, indexes, sections, entityName)
	const declaredDetailsTabs = singularViewDetails(entitySingularView(entity))?.tabs ?? []
	const detailTabsMarkup = declaredDetailsTabs.length === 0 ? [] : renderDetailsTabs(entity, indexes, entityName, declaredDetailsTabs)
	const carouselMarkup = carousels.flatMap((carousel) => renderCarousel(entity, indexes, carousel))
	const detailBlockMarkup = (singularViewDetails(entitySingularView(entity))?.blocks ?? []).flatMap((viewEntries) => viewEntries.flatMap((viewEntry) => renderContentBlock(
		entity,
		indexes,
		typeof viewEntry === 'object' && 'when' in viewEntry ? { ...viewEntry, when: 'always' } : viewEntry,
		'detailsOpen',
		3
	)))
	const latestMarkup = latestItems.flatMap((latest) => renderLatestContentItem(entity, indexes, latest, 3))
	const contentDlViewEntries = (viewEntries: readonly _ViewItem[]) => viewEntries.filter((viewEntry) => {
		const fieldName = itemFieldName(viewEntry)[0]
		const fieldDefinition = fieldName == null ? undefined : fieldDefinitionByName(entity, fieldName)
		return fieldDefinition?.type !== EntityFieldType.EntitiesReference
	})
	const relationshipFieldKeys = new Set(sections.map((section) => fieldReferenceKey(section.field)))
	const carouselFieldKeys = new Set(
		(entitySingularView(entity)?.carousels ?? [])
			.flatMap((carousel) => carousel.sections)
			.map((section) => fieldReferenceKey(section.field))
	)
	const contentListSectionsFromDl = contentRows.flatMap((viewEntries) => viewEntries.flatMap((viewEntry) => {
		const field = itemFieldName(viewEntry)[0]
		if (field == null)
			return ([] satisfies string[])

		const fieldDefinition = fieldDefinitionByName(entity, field)
		if (fieldDefinition?.type !== EntityFieldType.EntitiesReference)
			return ([] satisfies string[])

		const fieldKey = fieldReferenceKey(field)
		// Already executed via singularView.lists or carousels.
		if (relationshipFieldKeys.has(fieldKey) || carouselFieldKeys.has(fieldKey))
			return ([] satisfies string[])

		return renderRelationshipSection(entity, indexes, {
			field,
			viewEntry,
		}).map((line) => line.replace(/^\t\t\t\t/, '\t\t'))
	}))
	const contentRowMarkupGroups = contentRows.map((viewEntries) => contentDlViewEntries(viewEntries).flatMap((viewEntry) => renderContentItem(entity, indexes, viewEntry, 'contentOpen', 3, viewSourcesExpression)))
		.filter((group) => group.length > 0)
	const contentBody = singularViewContent(entitySingularView(entity))?.body
	const contentBodyMarkup = contentBody == null ? [] : renderBodySection(entity, indexes, contentBody, 'contentOpen', 2, viewSourcesExpression)
	const contentBlockMarkup = contentBlocks(entity).flatMap((viewEntries) => viewEntries.flatMap((viewEntry) => renderContentBlock(entity, indexes, viewEntry, 'contentOpen', 2)))
	const usesViewDomId = true
	const renderSummaryItemMarkup = (viewEntry: _ViewItem, viewEntryIndex: number, entityFieldsExpression: string, entityHrefFieldsExpression: string, refLayout: 'Title' | 'Value') => {
		if (typeof viewEntry === 'object' && 'kind' in viewEntry && viewEntry.kind === _ViewItemKind.Text)
			return [
				`${'\t'.repeat(4)}{${q(displayLabel(viewEntry.value ?? viewEntry.label))}}`,
			]
		if (typeof viewEntry === 'object' && 'text' in viewEntry && viewEntry.text != null)
			return [
				`${'\t'.repeat(4)}{${q(displayLabel(viewEntry.text))}}`,
			]

		const fieldReference = itemFieldReferences(viewEntry)[0]
		const fieldName = fieldReference == null ? undefined : fieldNameForReference(fieldReference)
		if (fieldName == null)
			throw new Error(`${entity.entityType} summary item is missing a field reference`)

		const fieldValueName = `${localIdentifier(fieldName)}${viewEntryIndex}`
		const fieldDefinition = fieldDefinitionByName(entity, fieldReference)
		if (fieldDefinition?.type === EntityFieldType.EntityReference && fieldDefinition.entityType != null) {
			const targetEntity = indexes.entityByType.get(fieldDefinition.entityType)
			if (targetEntity == null)
				throw new Error(`${entity.entityType}.${fieldName} summary EntityReference targets missing entity type ${fieldDefinition.entityType}`)

			const component = singularComponentName(targetEntity.entityType)
			const targetEntityName = camel(targetEntity.entityType)
			const referenceLevel = fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne ? 7 : 6
			if (entitySelectorOwnsField(entity, fieldName)) {
				const selectorExpression = fieldExpression('selection.entitySelector', fieldName)
				const hrefExpression = renderEntityHrefExpression(indexes, targetEntity.entityType, selectorExpression, selectorExpression, true)

				return [
					`${'\t'.repeat(4)}<${componentIdentifier(component)}`,
					renderSvelteAttribute(5, 'selection', `select(EntityType.${targetEntity.entityType}, ${selectorExpression})`),
					...(hrefExpression == null ? [] : [renderSvelteAttribute(5, 'href', hrefExpression)]),
					`${'\t'.repeat(5)}layout={EntityLayout.${refLayout}}`,
					`${'\t'.repeat(5)}open={false}`,
					`${'\t'.repeat(4)}/>`,
				]
			}
			const hrefExpression = renderEntityHrefExpression(indexes, targetEntity.entityType, `${targetEntityName}[EntityMetaKey.Selector]`, `${targetEntityName}[EntityMetaKey.Selector]`, true)

			return [
				`${'\t'.repeat(4)}<ResourceBoundary`,
				renderSvelteAttribute(5, 'resource', fieldProxyResourceExpression('selection', fieldName, renderQuery(fieldQuery(fieldDefinition, undefined)))),
				`${'\t'.repeat(4)}>`,
				`${'\t'.repeat(5)}{#snippet children(${targetEntityName})}`,
				...(fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne ? [
					`${'\t'.repeat(6)}{#if ${targetEntityName} != null && ${targetEntityName}[EntityMetaKey.Selector] != null}`,
				] : []),
				`${'\t'.repeat(referenceLevel)}<${componentIdentifier(component)}`,
				renderSvelteAttribute(referenceLevel + 1, 'selection', `select(EntityType.${targetEntity.entityType}, ${targetEntityName}[EntityMetaKey.Selector])`),
				`${'\t'.repeat(referenceLevel + 1)}prefetched={${targetEntityName}}`,
				...(hrefExpression == null ? [] : [renderSvelteAttribute(referenceLevel + 1, 'href', hrefExpression)]),
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
			...renderValueMarkup(entity, indexes, viewEntry, fieldName, fieldValueName, entityHrefFieldsExpression, 5),
			`${'\t'.repeat(4)}{/if}`,
		]
	}
	const pendingSummaryFieldsExpression = pendingEntityExpression
	const entitySummaryFieldsExpression = resolvedEntityExpression
	const pendingSummaryTitleMarkup = summaryTitleNeedsMarkup ? declaredSummaryTitleEntries(entity).flatMap((viewEntry, viewEntryIndex) => renderSummaryItemMarkup(viewEntry, viewEntryIndex, pendingSummaryFieldsExpression, pendingSummaryFieldsExpression, 'Title')) : []
	const entitySummaryTitleMarkup = summaryTitleNeedsMarkup ? declaredSummaryTitleEntries(entity).flatMap((viewEntry, viewEntryIndex) => renderSummaryItemMarkup(viewEntry, viewEntryIndex, entitySummaryFieldsExpression, entitySummaryFieldsExpression, 'Title')) : []
	const pendingSummaryValueMarkup = summaryValueNeedsMarkup ? declaredSummaryValueEntries(entity).flatMap((viewEntry, viewEntryIndex) => renderSummaryItemMarkup(viewEntry, viewEntryIndex, pendingSummaryFieldsExpression, pendingSummaryFieldsExpression, 'Value')) : []
	const entitySummaryValueMarkup = summaryValueNeedsMarkup ? declaredSummaryValueEntries(entity).flatMap((viewEntry, viewEntryIndex) => renderSummaryItemMarkup(viewEntry, viewEntryIndex, entitySummaryFieldsExpression, entitySummaryFieldsExpression, 'Value')) : []
	const detailBody = singularViewDetails(entitySingularView(entity))?.body
	const detailBodyMarkup = detailBody == null ? [] : renderBodySection(entity, indexes, detailBody, 'detailsOpen', 3)
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
			renderRawLines(entitySingularView(entity).TypeAnnotationTooltip.raw, 2)
		: entity.description != null ?
			renderTooltipParagraphs([entity.description], 2)
		:
			[]
	)
	const script = [
		'// Types/constants',
		'import type { ComponentProps } from \'svelte\'',
		...(usesResolve || rawSnippets.some((snippet) => snippet.raw.includes('resolve(')) ? ['import { resolve } from \'$app/paths\''] : []),
		'import type { EntityProxyData, EntityProxyResource } from \'$/client/$proxy.svelte.ts\'',
		'import type { WithRest } from \'$/typescript/WithRest.ts\'',
		...(usesEntityProxyField ? ['import { EntityProxyField } from \'$/client/$proxy.svelte.ts\''] : []),
		...(usesProjectionBoundary ? ['import ProjectionBoundary from \'$/components/ProjectionBoundary.svelte\''] : []),
		'import EntityView, { EntityLayout } from \'$/components/EntityView.svelte\'',
		'import { EntityMetaKey } from \'$/schema/$schema.ts\'',
		'import { EntityType } from \'$/schema/EntityType.ts\'',
		'import { schema } from \'$/schema/index.ts\'',
		...expressionImportSpecs.map(renderImport),
		...((
			usesSource
			|| query.includes('Source.')
			|| sectionQueries.some((sectionQuery) => sectionQuery.includes('Source.'))
			|| latestQueries.some((latestQuery) => latestQuery.includes('Source.'))
			|| carouselQueries.some((carouselQuery) => carouselQuery.includes('Source.'))
			|| namedSourceSelections.length > 0
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
		`\t\tselection: EntityProxyResource<typeof schema, EntityType.${entity.entityType}>`,
		`\t\tprefetched?: Partial<EntityProxyData<typeof schema, EntityType.${entity.entityType}>>`,
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
		...(viewSourceSelectionKeyExpression == null || viewSourceSelection == null || Array.isArray(viewSourceSelection) || viewSourceSelection.name == null ? [] : [
			'',
			`const selectedViewSources = $derived(${renderSourceSelectionByKey(viewSourceSelection)}[${viewSourceSelectionKeyExpression}] ?? ${renderSourceArray(viewSourceSelection.default)})`,
		]),
		'',
		...renderPendingEntityDerived(),
		`const ${entityName} = $derived(selection(${query}))`,
		`const titleFallback = $derived(${titleFallbackExpression})`,
		...(usesViewDomId ? [
			`const viewDomId = $derived(${q(`${entity.entityType
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
		renderSvelteAttribute(1, 'title', 'title ?? titleFallback'),
		...(serial == null ? [] : [
			renderSvelteAttribute(1, 'idDragPlainText', `String(${pendingFieldExpression(entity, serial.field)} ?? '')`),
		]),
		entityHrefExpression == null ? '\t{href}' : renderSvelteAttribute(1, 'href', `href ?? ${entityHrefExpression}`),
		'\t{layout}',
		'\tbind:open',
		'\t{...EntityViewProps}',
		'>',
		...iconMarkup,
		...(iconMarkup.length === 0 ? [] : ['']),
		'\t{#snippet Title()}',
		...(entitySingularView(entity)?.summary?.Title == null && rendersSerialTitle ? renderSerialTitleSnippet(entity, indexes, serial, selectorOwnsSerial, entityName) : entitySingularView(entity)?.summary?.Title == null ? [
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
		] : renderRawLines(entitySingularView(entity).summary.Title.raw, 2)),
		'\t{/snippet}',
		...(entitySingularView(entity)?.summary?.Value == null && !rendersSerialValue && declaredSummaryValueEntries(entity).length === 0 ? [] : [
			'',
			'\t{#snippet Value()}',
			...(entitySingularView(entity)?.summary?.Value == null && serial != null && rendersSerialValue ? renderSerialValueSnippet(entity, indexes, serial, selectorOwnsSerial, entityName) : entitySingularView(entity)?.summary?.Value == null ? [
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
			] : renderRawLines(entitySingularView(entity).summary.Value.raw, 2)),
			'\t{/snippet}',
		]),
		...(
			viewItems(entitySingularView(entity)?.summary?.HeadingAfter).length === 0 ? []
			: renderSummaryAfter(entity, indexes, entityName, viewItems(entitySingularView(entity)?.summary?.HeadingAfter))
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
			`\t\t<dl${entitySingularView(entity)?.latestDlClassName == null ? '' : ` class=${q(entitySingularView(entity).latestDlClassName)}`} data-column-item="center">`,
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

const renderContentBlock = (
	entity: Entity,
	indexes: AppIndexes,
	viewEntry: _ViewItem,
	openExpression: string,
	level: number
) => {
	if (typeof viewEntry === 'object' && 'kind' in viewEntry && viewEntry.kind === _ViewItemKind.Block)
		return wrapWhen(viewEntry, openExpression, [
			`${'\t'.repeat(level)}<section data-column="gap-2">`,
			...(viewEntry.label == null ? [] : [`${'\t'.repeat(level + 1)}<h3>${viewEntry.label}</h3>`]),
			...renderRawBlock(viewEntry, level + 1),
			`${'\t'.repeat(level)}</section>`,
		])

	const fieldName = itemFieldName(viewEntry)[0]
	const fieldDefinition = fieldName == null ? undefined : fieldDefinitionByName(entity, fieldName)
	if (fieldDefinition?.type === EntityFieldType.EntitiesReference || fieldDefinition?.type === EntityFieldType.EntityReference)
		return wrapWhen(viewEntry, openExpression, renderRelationshipSection(entity, indexes, {
			field: fieldName,
			viewEntry,
		}).map((line) => line.replace(/^\t\t\t\t/, `${'\t'.repeat(level)}`)))

	throw new Error(`${entity.entityType} content block is not a Block or entity relationship item`)
}

const renderRawBlock = (
	viewEntry: Exclude<_ViewItem, string> & { kind: _ViewItemKind.Block },
	level: number
) => {
	if (viewEntry.fields == null || viewEntry.fields.length === 0)
		return renderRawLines(viewEntry.Content.raw, level)

	return [
		`${'\t'.repeat(level)}<ResourceBoundary`,
		renderSvelteAttribute(level + 1, 'resource', `selection(${renderQuery(undefined, viewEntry.fields)})`),
		`${'\t'.repeat(level)}>`,
		`${'\t'.repeat(level + 1)}{#snippet children(entity)}`,
		...renderRawLines(viewEntry.Content.raw, level + 2),
		`${'\t'.repeat(level + 1)}{/snippet}`,
		`${'\t'.repeat(level)}</ResourceBoundary>`,
	]
}

const renderBodySection = (
	entity: Entity,
	indexes: AppIndexes,
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
	const query = renderQuery(fieldQueryForName(entity, body.field, undefined), [body.field], sourcesExpression)
	const bodyFieldValue = resolvedFieldExpression(body.field)
	const bodyMarkup = [
		`${'\t'.repeat(level + (body.id == null && body.label == null ? 0 : 1))}<ResourceBoundary`,
		renderSvelteAttribute(level + (body.id == null && body.label == null ? 1 : 2), 'resource', `selection(${query})`),
		`${'\t'.repeat(level + (body.id == null && body.label == null ? 0 : 1))}>`,
		`${'\t'.repeat(level + (body.id == null && body.label == null ? 1 : 2))}{#snippet children(entity)}`,
		`${'\t'.repeat(level + (body.id == null && body.label == null ? 2 : 3))}{@const ${resolvedEntityExpression} = ${resolvedEntitySurfaceExpression}}`,
		`${'\t'.repeat(level + (body.id == null && body.label == null ? 2 : 3))}{@const ${localIdentifier(body.field)} = ${bodyFieldValue}}`,
		`${'\t'.repeat(level + (body.id == null && body.label == null ? 2 : 3))}{#if ${localIdentifier(body.field)} !== undefined && ${localIdentifier(body.field)} !== null && ${localIdentifier(body.field)} !== ''}`,
		...renderValueMarkup(entity, indexes, bodyViewEntry, body.field, localIdentifier(body.field), resolvedEntityExpression, level + (body.id == null && body.label == null ? 3 : 4)),
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
		...(body.id == null ? [] : [`${'\t'.repeat(level + 1)}id={viewDomId + ${q(`-${body.id}`)}}`]),
		...(body.label == null ? [] : [`${'\t'.repeat(level + 1)}data-scroll-marker-label=${q(body.label)}`]),
		`${'\t'.repeat(level)}>`,
		...(body.label == null ? [] : [
			`${'\t'.repeat(level + 1)}<h3>${body.label}</h3>`,
		]),
		...bodyMarkup,
		`${'\t'.repeat(level)}</section>`,
	])
}

const renderSummaryAfterItem = (
	entity: Entity,
	indexes: AppIndexes,
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
	const fieldDefinition = fieldDefinitionByName(entity, fieldName)
	if (fieldDefinition?.type === EntityFieldType.EntityReference && fieldDefinition.entityType != null) {
		const targetEntity = indexes.entityByType.get(fieldDefinition.entityType)
		if (targetEntity != null) {
			const component = singularComponentName(targetEntity.entityType)
			const targetEntityName = camel(targetEntity.entityType)
			const referenceLevel = fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne ? level + 3 : level + 2
			if (entitySelectorOwnsField(entity, fieldName)) {
				const selectorExpression = fieldExpression('selection.entitySelector', fieldName)
				const hrefExpression = renderEntityHrefExpression(indexes, targetEntity.entityType, selectorExpression, selectorExpression, true)

				return [
					`${'\t'.repeat(level)}<span data-text="muted">`,
					`${'\t'.repeat(level + 1)}<${componentIdentifier(component)}`,
					renderSvelteAttribute(level + 2, 'selection', `select(EntityType.${targetEntity.entityType}, ${selectorExpression})`),
					...(hrefExpression == null ? [] : [renderSvelteAttribute(level + 2, 'href', hrefExpression)]),
					`${'\t'.repeat(level + 2)}layout={EntityLayout.Title}`,
					`${'\t'.repeat(level + 2)}open={false}`,
					`${'\t'.repeat(level + 1)}/>`,
					`${'\t'.repeat(level)}</span>`,
				]
			}
			const hrefExpression = renderEntityHrefExpression(indexes, targetEntity.entityType, `${targetEntityName}[EntityMetaKey.Selector]`, `${targetEntityName}[EntityMetaKey.Selector]`, true)

			return [
				`${'\t'.repeat(level)}<ResourceBoundary`,
				renderSvelteAttribute(level + 1, 'resource', fieldProxyResourceExpression('selection', fieldName, renderQuery(fieldQuery(fieldDefinition, undefined)))),
				`${'\t'.repeat(level)}>`,
				`${'\t'.repeat(level + 1)}{#snippet children(${targetEntityName})}`,
				...(fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne ? [
					`${'\t'.repeat(level + 2)}{#if ${targetEntityName} != null && ${targetEntityName}[EntityMetaKey.Selector] != null}`,
				] : []),
				`${'\t'.repeat(referenceLevel)}<span data-text="muted">`,
				`${'\t'.repeat(referenceLevel + 1)}<${componentIdentifier(component)}`,
				renderSvelteAttribute(referenceLevel + 2, 'selection', `select(EntityType.${targetEntity.entityType}, ${targetEntityName}[EntityMetaKey.Selector])`),
				`${'\t'.repeat(referenceLevel + 2)}prefetched={${targetEntityName}}`,
				...(hrefExpression == null ? [] : [renderSvelteAttribute(referenceLevel + 2, 'href', hrefExpression)]),
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
		...renderValueMarkup(entity, indexes, viewEntry, fieldName, fieldValueName, fieldValuesExpression, level + 2),
		`${'\t'.repeat(level + 1)}</span>`,
		`${'\t'.repeat(level)}{/if}`,
	]
}

const renderSummaryAfter = (entity: Entity, indexes: AppIndexes, entityName: string, viewEntries: readonly _ViewItem[]) => {
	return [
		'',
		'\t{#snippet HeadingAfter()}',
		`\t\t<ResourceBoundary resource={${entityName}}>`,
		'\t\t\t{#snippet Pending()}',
		...viewEntries.flatMap((viewEntry, viewEntryIndex) => renderSummaryAfterItem(entity, indexes, viewEntry, pendingEntityExpression, viewEntryIndex, 4)),
		'\t\t\t{/snippet}',
		'\t\t\t{#snippet children(entity)}',
		`\t\t\t\t{@const ${resolvedEntityExpression} = ${resolvedEntitySurfaceExpression}}`,
		...viewEntries.flatMap((viewEntry, viewEntryIndex) => renderSummaryAfterItem(entity, indexes, viewEntry, 'entity', viewEntryIndex, 4)),
		'\t\t\t{/snippet}',
		'\t\t</ResourceBoundary>',
		'\t{/snippet}',
	]
}

const renderIconSnippet = (entity: Entity, entityName: string) => {
	if (entitySingularView(entity)?.summary?.Icon != null)
		return [
			'',
			'\t{#snippet Icon()}',
			...renderRawLines(entitySingularView(entity).summary.Icon.raw, 2),
			'\t{/snippet}',
		]

	const icon = entitySingularView(entity)?.summary?.icon
	if (icon == null)
		throw new Error(`${entity.entityType} Icon snippet was invoked without summary.icon metadata`)

	const iconField = itemFieldName(icon)[0]
	const iconFieldDefinition = iconField == null ? undefined : fieldDefinitionByName(entity, iconField)
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

const renderEntityReferenceDlItem = (
	entity: Entity,
	indexes: AppIndexes,
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

	const targetEntity = indexes.entityByType.get(fieldDefinition.entityType)
	if (targetEntity == null)
		throw new Error(`${entity.entityType}.${fieldName} references missing entity type ${fieldDefinition.entityType}`)

	const component = singularComponentIdentifier(targetEntity.entityType)
	const itemSelection = typeof viewEntry === 'object' && 'selection' in viewEntry ? viewEntry.selection : undefined
	const query = renderQuery(fieldQuery(fieldDefinition, itemSelection), [])
	if (entitySelectorOwnsField(entity, fieldName)) {
		const selectorExpression = fieldExpression('selection.entitySelector', fieldName)
		const hrefExpression = renderEntityHrefExpression(indexes, fieldDefinition.entityType, selectorExpression, selectorExpression, true)

		return wrapWhen(viewEntry, openExpression, [
			`${'\t'.repeat(level)}<div>`,
			`${'\t'.repeat(level + 1)}<dt>${label}</dt>`,
			`${'\t'.repeat(level + 1)}<dd>`,
			`${'\t'.repeat(level + 2)}<${component}`,
			renderSvelteAttribute(level + 3, 'selection', `select(EntityType.${fieldDefinition.entityType}, ${selectorExpression}, ${query})`),
			...(hrefExpression == null ? [] : [
				renderSvelteAttribute(level + 3, 'href', hrefExpression),
			]),
			`${'\t'.repeat(level + 3)}layout={EntityLayout.Value}`,
			`${'\t'.repeat(level + 3)}open={false}`,
			`${'\t'.repeat(level + 2)}/>`,
			`${'\t'.repeat(level + 1)}</dd>`,
			`${'\t'.repeat(level)}</div>`,
		])
	}

	const targetEntityName = camel(targetEntity.entityType)
	const hrefExpression = renderEntityHrefExpression(
		indexes,
		fieldDefinition.entityType,
		`${targetEntityName}[EntityMetaKey.Selector]`,
		`${targetEntityName}[EntityMetaKey.Selector]`,
		true
	)
	const entityViewLines = [
		`${'\t'.repeat(level + 2)}<${component}`,
		renderSvelteAttribute(level + 3, 'selection', `select(EntityType.${fieldDefinition.entityType}, ${targetEntityName}[EntityMetaKey.Selector])`),
		`${'\t'.repeat(level + 3)}prefetched={${targetEntityName}}`,
		...(hrefExpression == null ? [] : [
			renderSvelteAttribute(level + 3, 'href', hrefExpression),
		]),
		`${'\t'.repeat(level + 3)}layout={EntityLayout.Value}`,
		`${'\t'.repeat(level + 3)}open={false}`,
		`${'\t'.repeat(level + 2)}/>`,
	]

		if (fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne)
			return wrapWhen(viewEntry, openExpression, [
				`${'\t'.repeat(level)}<ResourceBoundary`,
				renderSvelteAttribute(level + 1, 'resource', fieldProxyResourceExpression('selection', fieldReference, query)),
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
			renderSvelteAttribute(level + 3, 'resource', fieldProxyResourceExpression('selection', fieldReference, query)),
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

const renderContentItem = (
	entity: Entity,
	indexes: AppIndexes,
	viewEntry: _ViewItem,
	openExpression: string,
	level: number,
	sourcesExpression?: string
) => {
	if (typeof viewEntry === 'object' && 'kind' in viewEntry && viewEntry.kind === _ViewItemKind.Text)
		return wrapWhen(viewEntry, openExpression, [
			`${'\t'.repeat(level)}<div>`,
			`${'\t'.repeat(level + 1)}<dt>${viewEntry.label}</dt>`,
			`${'\t'.repeat(level + 1)}<dd>`,
			`${'\t'.repeat(level + 2)}{${q(viewEntry.value ?? viewEntry.label)}}`,
			...(viewEntry.description == null ? [] : [
				`${'\t'.repeat(level + 2)}<p data-text="muted">{${q(viewEntry.description)}}</p>`,
			]),
			`${'\t'.repeat(level + 1)}</dd>`,
			`${'\t'.repeat(level)}</div>`,
		])
	if (typeof viewEntry === 'object' && 'kind' in viewEntry && viewEntry.kind === _ViewItemKind.Block)
		return wrapWhen(viewEntry, openExpression, renderRawBlock(viewEntry, level))

	const fieldReference = itemFieldReferences(viewEntry)[0]
	const fieldName = fieldReference == null ? undefined : fieldNameForReference(fieldReference)
	if (fieldName == null)
		throw new Error(`${entity.entityType} content item is missing a field reference`)
	const fieldDefinition = fieldDefinitionByName(entity, fieldName)
	if (fieldDefinition == null)
		throw new Error(`${entity.entityType}.${fieldName} content item references an unknown field`)
	if (fieldDefinition.type === EntityFieldType.EntitiesReference)
		throw new Error(`${entity.entityType}.${fieldName} EntitiesReference cannot render as a content <dl> item`)
	const label = typeof viewEntry === 'object' && 'label' in viewEntry && viewEntry.label != null ? viewEntry.label : labelForField(fieldDefinition)

	if (fieldDefinition.type === EntityFieldType.EntityReference)
		return renderProjectionBoundaryLines(
			fieldReference,
			renderEntityReferenceDlItem(entity, indexes, viewEntry, fieldDefinition, fieldReference, label, openExpression, level),
			level
		)

	const valueExpression = resolvedFieldExpression(fieldName)
	const pendingValueExpression = pendingFieldExpression(entity, fieldName)
	const fieldValueName = localIdentifier(fieldName)
	const query = renderQuery(fieldQuery(fieldDefinition, undefined), [fieldName], sourcesExpression)
	const projectionFieldResource = isProjectionFieldReference(fieldReference) ? fieldProxyResourceExpression('selection', fieldReference, query) : undefined
	const valueContextExpression = projectionFieldResource == null ?
		`({ value: ${fieldValueName}, ...${resolvedEntityExpression} })`
	:
		`({ value: ${fieldValueName} })`
	const valueMarkup = [
		`${'\t'.repeat(level)}<div>`,
		`${'\t'.repeat(level + 1)}<dt>${label}</dt>`,
		`${'\t'.repeat(level + 1)}<dd>`,
		...renderValueMarkup(entity, indexes, viewEntry, fieldName, fieldValueName, valueContextExpression, level + 2),
		`${'\t'.repeat(level + 1)}</dd>`,
		`${'\t'.repeat(level)}</div>`,
	]
	const pendingValueMarkup = [
		`${'\t'.repeat(level)}<div>`,
		`${'\t'.repeat(level + 1)}<dt>${label}</dt>`,
		`${'\t'.repeat(level + 1)}<dd>`,
		...renderValueMarkup(entity, indexes, viewEntry, fieldName, fieldValueName, `({ value: ${fieldValueName}, ...${pendingEntityExpression} })`, level + 2),
		`${'\t'.repeat(level + 1)}</dd>`,
		`${'\t'.repeat(level)}</div>`,
	]

	if (fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne)
		return renderProjectionBoundaryLines(fieldReference, wrapWhen(viewEntry, openExpression, [
			`${'\t'.repeat(level)}<ResourceBoundary`,
			renderSvelteAttribute(level + 1, 'resource', projectionFieldResource ?? `selection(${query})`),
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
		]), level)

		return renderProjectionBoundaryLines(fieldReference, wrapWhen(viewEntry, openExpression, [
			`${'\t'.repeat(level)}<div>`,
			`${'\t'.repeat(level + 1)}<dt>${label}</dt>`,
			`${'\t'.repeat(level + 1)}<dd>`,
			`${'\t'.repeat(level + 2)}<ResourceBoundary`,
			renderSvelteAttribute(level + 3, 'resource', projectionFieldResource ?? `selection(${query})`),
			`${'\t'.repeat(level + 2)}>`,
			...(projectionFieldResource == null ? [
				`${'\t'.repeat(level + 3)}{#snippet Pending()}`,
				`${'\t'.repeat(level + 4)}{@const ${fieldValueName} = ${pendingValueExpression}}`,
				`${'\t'.repeat(level + 4)}{#if ${fieldValueName} !== undefined && ${fieldValueName} !== null}`,
				...renderValueMarkup(entity, indexes, viewEntry, fieldName, fieldValueName, `({ value: ${fieldValueName}, ...${pendingEntityExpression} })`, level + 5),
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
		...renderValueMarkup(entity, indexes, viewEntry, fieldName, fieldValueName, `({ value: ${fieldValueName}, ...${resolvedEntityExpression} })`, level + 5),
		`${'\t'.repeat(level + 4)}{/if}`,
		`${'\t'.repeat(level + 3)}{/snippet}`,
		`${'\t'.repeat(level + 2)}</ResourceBoundary>`,
		`${'\t'.repeat(level + 1)}</dd>`,
		`${'\t'.repeat(level)}</div>`,
	]), level)
}

const latestTargetEntityType = (
	entity: Entity,
	latest: EntityLatest
) => fieldDefinitionByName(entity, latest.field)?.entityType

const latestComponentName = (
	entity: Entity,
	latest: EntityLatest
) => {
	const entityType = latestTargetEntityType(entity, latest)
	return latest.view ?? (entityType == null ? undefined : singularComponentName(entityType))
}

const renderLatestContentItem = (
	entity: Entity,
	indexes: AppIndexes,
	latest: EntityLatest,
	level: number
) => {
	const latestFieldDefinition = fieldDefinitionByName(entity, latest.field)
	const entityType = latestTargetEntityType(entity, latest)
	const fieldEntityType = latestFieldDefinition?.entityType
	const component = latestComponentName(entity, latest)
	if (entityType == null || fieldEntityType == null || component == null)
		throw new Error(`${entity.entityType}.${latest.field} latest reference is missing target entity/component metadata`)
	const latestEntityName = camel(entityType)
	const latestEntitiesName = `${latestEntityName}s`
	const latestSelectorName = `${latestEntityName}Selector`
	const latestEntity = indexes.entityByType.get(entityType)
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
			...(indexes.entityHrefsByType.get(entityType) ?? [])
				.flatMap((entityHref) => entityHref.params.flatMap((param) => expressionFieldPaths(param.value)))
				.map((fieldPath) => fieldPath[0])
				.filter((fieldName): fieldName is string => fieldName != null),
		].filter((fieldName) => !latestSelectorFieldNames.has(fieldName)),
	].filter((fieldName) => latestEntity == null || fieldDefinitionByName(latestEntity, fieldName) != null))

	const query = renderQuery(
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
	const latestSelectionQuery = renderQuery(
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
	const latestHrefExpression = renderEntityHrefExpression(
		indexes,
		entityType,
		selectorExpression,
		`${latestEntityName}[EntityMetaKey.Selector]`,
		true
	)
	const latestLabel = latest.label ?? latest.field
	const latestConditions = [
		...(isProjectionFieldReference(latest.field) ? [] : facetFieldReferenceConditions(entity, latest.field)),
		...(latest.conditions ?? latest.when ?? []),
	]

	const latestBodyLines = [
		`${'\t'.repeat(level + 4)}{#if ${latestEntityName} != null}`,
		renderSvelteConst(level + 5, latestSelectorName, selectorExpression),
		`${'\t'.repeat(level + 5)}<${componentIdentifier(component)}`,
		renderSvelteAttribute(level + 6, 'selection', `select(EntityType.${entityType}, ${latestSelectorName}${latestSelectionSuffix})`),
		...(latestHrefExpression == null ? [] : [renderSvelteAttribute(level + 6, 'href', latestHrefExpression)]),
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
			renderSvelteAttribute(level + 3, 'resource', fieldProxyResourceExpression('selection', latest.field, query)),
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

	return renderProjectionBoundaryLines(
		latest.field,
		renderConditionedEntityLines(entity, latestConditions, level, lines),
		level
	)
}

const renderRelationshipSections = (
	entity: Entity,
	indexes: AppIndexes,
	sections: RelationshipSection[],
	entityName: string
) => {
	const groups = unique(sections.map((section) => section.group))

	return groups.flatMap((group) => {
		const groupSections = sections.filter((section) => section.group === group)
		const primitiveSections = groupSections.filter((section) => {
			const fieldDefinition = fieldDefinitionByName(entity, section.field)
			return fieldDefinition?.type === EntityFieldType.Primitive
		})
		const referenceSections = groupSections.filter((section) => {
			const fieldDefinition = fieldDefinitionByName(entity, section.field)
			return fieldDefinition?.type !== EntityFieldType.Primitive
		})
		const level = group == null ? 3 : 4
		const children = [
			...(primitiveSections.length === 0 ? [] : [
				`${'\t'.repeat(level)}<dl data-column-item="center">`,
				...primitiveSections.flatMap((section) => renderContentItem(
					entity,
					indexes,
					section.field,
					'detailsOpen',
					level + 1
				)),
				`${'\t'.repeat(level)}</dl>`,
			]),
			...referenceSections.flatMap((section) => renderRelationshipSection(entity, indexes, section))
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

const renderRelationshipSection = (entity: Entity, indexes: AppIndexes, section: RelationshipSection) => {
	const fieldDefinition = fieldDefinitionByName(entity, section.field)
	if (fieldDefinition == null)
		throw new Error(`${entity.entityType}.${section.field} relationship section references an unknown field`)
	const sectionConditions = isProjectionFieldReference(section.field) ? [] : [
		...facetFieldReferenceConditions(entity, section.field),
		...(section.conditions ?? []),
	]

	const component = declaredRelationshipSectionComponent(section, indexes)
	if (component == null)
		throw new Error(`${entity.entityType}.${section.field} relationship section must declare a generated component`)

	if (fieldDefinition.entityType == null)
		throw new Error(`${entity.entityType}.${section.field} relationship section field must reference an entity`)

	if (fieldDefinition.type === EntityFieldType.EntityReference && component != null)
		return renderConditionedEntityLines(
			entity,
			sectionConditions,
			4,
			renderProjectionBoundaryLines(
				section.field,
				renderEntityReferenceSection(entity, indexes, section, fieldDefinition, component),
				4
			)
		)
	if (fieldDefinition.type === EntityFieldType.EntitiesReference && component != null)
		return renderConditionedEntityLines(
			entity,
			sectionConditions,
			4,
			renderProjectionBoundaryLines(
				section.field,
				renderEntitiesReferenceSection(entity, indexes, section, fieldDefinition, component),
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
			condition.equals == null ? undefined : `${fieldExpression('selection.entitySelector', fieldNameForReference(condition.field))} === ${renderLiteral(condition.equals)}`,
			condition.notEquals == null ? undefined : `${fieldExpression('selection.entitySelector', fieldNameForReference(condition.field))} !== ${renderLiteral(condition.notEquals)}`,
		].filter(Boolean).join(' && ')).join(' && ')
)

const renderDetailTab = (
	entity: Entity,
	indexes: AppIndexes,
	tab: SingularView['details']['tabs'][number],
	entityName: string
) => {
	const viewEntries = tab.items ?? []
	const dlViewEntries = viewEntries.filter((viewEntry) => {
		const fieldName = itemFieldName(viewEntry)[0]
		const fieldDefinition = fieldName == null ? undefined : fieldDefinitionByName(entity, fieldName)
		return fieldDefinition?.type === EntityFieldType.Primitive || fieldDefinition?.type === EntityFieldType.EntityReference
	})
	const referenceSections = viewEntries.flatMap((viewEntry) => {
		const field = itemFieldName(viewEntry)[0]
		if (field == null)
			return ([] satisfies RelationshipSection[])

		const fieldDefinition = fieldDefinitionByName(entity, field)
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
		...(tab.Content == null ? [] : renderRawLines(tab.Content.raw, 5)),
		...(dlViewEntries.length === 0 ? [] : [
			'\t\t\t\t\t<dl data-column-item="center">',
			...dlViewEntries.flatMap((viewEntry) => renderContentItem(entity, indexes, viewEntry, 'detailsOpen', 6)),
			'\t\t\t\t\t</dl>',
		]),
		...reindentLines(
			referenceSections.flatMap((section) => renderRelationshipSection(entity, indexes, section)),
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

const renderDetailsTabs = (entity: Entity, indexes: AppIndexes, entityName: string, tabs: SingularView['details']['tabs']) => {
	return [
		'\t\t\t<CollapsibleTabs',
		'\t\t\t\tid={viewDomId + \'-details-tabs\'}',
		'\t\t\t\tsectionIdPrefix={viewDomId}',
		renderSvelteAttribute(4, 'sections', [
			'[',
			...tabs.map((tab) => {
				const sectionExpression = `${renderObject([
					['id', q(detailTabId(tab))],
					['label', q(tab.label)],
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
		...tabs.flatMap((tab) => renderDetailTab(entity, indexes, tab, entityName)),
		'\t\t\t</CollapsibleTabs>',
	]
}

const carouselSectionId = (section: EntityCarouselSection) => (
	section.id ?? (section.field == null ? undefined : routeCollectionIdForFieldReference(section.field)) ?? 'section'
)

const routeCollectionId = (field: string) => field.replace(/^\$\$?/, '').replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)

const routeCollectionIdForFieldReference = (field: FieldReference) => routeCollectionId(fieldNameForReference(field))

const carouselSectionComponent = (entity: Entity, indexes: AppIndexes, section: EntityCarouselSection) => {
	if (section.field == null)
		return undefined

	const fieldDefinition = fieldDefinitionByName(entity, section.field)
	if (fieldDefinition == null || fieldDefinition.entityType == null)
		return undefined

	if (section.List != null)
		return section.List

	return undefined
}

const carouselSectionIsPrimitiveList = (entity: Entity, section: EntityCarouselSection) => {
	if (section.field == null || section.items == null || section.items.length === 0)
		return false

	const fieldDefinition = fieldDefinitionByName(entity, section.field)
	return fieldDefinition?.type === EntityFieldType.Primitive && (
		fieldDefinition.cardinality === EntityFieldCardinality.Many
		|| fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrMany
	)
}

const renderRouteParamValueExpression = (
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
				routeParamStringExpression(`${renderRouteParamValueExpression(expression.value, fieldsExpression, undefined, optional)}${propertyAccess(expression.property)}`, decode)
			:
				`${renderRouteParamValueExpression(expression.value, fieldsExpression, undefined, optional)}${propertyAccess(expression.property)}`
		)
	if (expression.kind === 'template') {
		const templateExpression = `\`${expression.parts.map((part) => (
			typeof part === 'string' ?
				templateStringText(part)
			:
				`\${${routeParamStringExpression(renderRouteParamValueExpression(part, fieldsExpression, undefined, optional))}}`
		)).join('')}\``
		return (
			decode === _ExpressionDecode.DecodeURIComponent ?
				`encodeURIComponent(${templateExpression})`
			:
				templateExpression
		)
	}
	if (expression.kind === 'catalogIndex')
		return routeParamStringExpression(renderAppExpression(expression, {
			fields: fieldsExpression,
		}))

	return renderAppExpression(expression, {
		fields: fieldsExpression,
	})
}

const renderCollectionHrefExpression = (
	entity: Entity,
	indexes: AppIndexes,
	field: string,
	targetEntity: string,
	fieldsExpression = 'selection.entitySelector'
) => {
	const childHref = indexes.collectionHrefBySourceField.get(collectionSourceFieldKey(entity.entityType, field, targetEntity))
	if (childHref != null) {
		const hrefExpression = renderRouteResolveExpression(
			childHref.href,
			childHref.params.map((param) => [
				param.param,
				renderRouteParamValueExpression(param.value, fieldsExpression, param.decode),
			])
		)
		const condition = unique(childHref.params
			.flatMap((param) => routeExpressionConditions(fieldsExpression, param.value)))
			.join(' && ')
		return condition === '' ? hrefExpression : `(${condition} ? ${hrefExpression} : undefined)`
	}

	const collectionHref = indexes.collectionHrefByEntity.get(targetEntity)
	return collectionHref == null ? undefined : collectionHref.includes('(') ? renderRouteResolveExpression(collectionHref) : renderResolveExpression(collectionHref)
}

const collectionHrefFieldNames = (
	entity: Entity,
	indexes: AppIndexes,
	field: string,
	targetEntity: string
) => {
	const childHref = indexes.collectionHrefBySourceField.get(collectionSourceFieldKey(entity.entityType, field, targetEntity))
	return childHref == null ?
		[]
	:
		unique(childHref.params.flatMap((param) => expressionFieldPaths(param.value).flatMap((fieldPath) => fieldPath[0] == null ? [] : [fieldPath[0]])))
}

const renderEntityHrefExpression = (
	indexes: AppIndexes,
	entityType: string,
	fieldsExpression: string,
	routeFieldsExpression: string,
	partial = false
) => {
	const entityHrefs = indexes.entityHrefsByType.get(entityType) ?? []
	if (entityHrefs.length === 0)
		return undefined

	const candidates = entityHrefs.map((entityHref) => {
		const hrefExpression = renderRouteResolveExpression(
			entityHref.href,
			entityHref.params.map((param) => [
				param.param,
				renderRouteParamExpression(param.value, {
					fields: routeFieldsExpression,
				}, param.decode),
			])
		)
		const condition = (entityHref.conditions ?? [])
			.map((condition) => conditionExpression([condition], fieldsExpression, indexes.entityByType.get(entityType), partial))
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

const renderEntityPageSelection = (
	indexes: AppIndexes,
	entity: Entity | undefined,
	entityType: string,
	selectorExpression: string,
	selectorName?: string
) => {
	if (entity == null)
		return `select(EntityType.${entityType}, ${selectorExpression})`

	const selector = entity.selectors.find((item) => item.name === selectorName)
	const sourceSelectorField = selector?.fields.includes('source') === true
	const viewSourceSelection = singularViewQuery(entitySingularView(entity))?.sources
	const fields = viewResolvedFieldNames(entity, indexes)
		.filter((fieldName) => {
			const fieldDefinition = fieldDefinitionByName(entity, fieldName)
			return (
				fieldDefinition != null
				&& fieldDefinition.type !== EntityFieldType.EntitiesReference
			)
		})
	const fieldDefaultSources = pageSelectionFieldDefaultSources(entity, fields)

	if (fields.length === 0 && !sourceSelectorField && viewSourceSelection == null && fieldDefaultSources == null)
		return `select(EntityType.${entityType}, ${selectorExpression})`

	const selectorSourceExpression = selectorExpression.includes('\n') ?
		`(${selectorExpression}).source`
	:
		`${selectorExpression}.source`
	const selectionSources = viewSourceSelection ?? fieldDefaultSources
	const viewSourceLines = Array.isArray(selectionSources) ? [
		'\tsources: [',
		...selectionSources.map((source) => `\t\t${enumAccess('Source', source)},`),
		'\t],',
	] : []

	return [
		`select(EntityType.${entityType}, ${selectorExpression}, {`,
		...(sourceSelectorField ? [
			`\tsources: [${selectorSourceExpression}],`,
		] : viewSourceLines),
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
	fields: readonly string[]
) => {
	const sourceSets = fields
		.map((field) => fieldDefinitionByName(entity, field)?.defaultSources)
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

const hasCollectionHref = (entity: Entity, indexes: AppIndexes, field: string, targetEntity: string) => (
	indexes.collectionHrefBySourceField.has(collectionSourceFieldKey(entity.entityType, field, targetEntity))
	|| indexes.collectionHrefByEntity.has(targetEntity)
)

const renderCarousel = (
	entity: Entity,
	indexes: AppIndexes,
	carousel: EntityCarousel
) => {
	const sections = carousel.sections
	if (sections.length === 0)
		throw new Error(`${entity.entityType} carousel ${carousel.id ?? carousel.label ?? 'unnamed'} has no sections`)

	const sectionExpression = (section: EntityCarouselSection) => renderObject([
		['id', q(carouselSectionId(section))],
		['label', q(section.label ?? section.field ?? 'Section')],
		['description', section.description == null ? undefined : q(section.description)],
	])
	const sectionsExpression = renderArray(sections.map(sectionExpression))
	const tabsLines = [
		'\t\t\t<CollapsibleTabs',
		`\t\t\t\tid={viewDomId + ${q(`-carousel-${carousel.id ?? pascal(carousel.label)}`)}}`,
		'\t\t\t\tsectionIdPrefix={viewDomId}',
		renderSvelteAttribute(4, 'sections', sectionsExpression),
		'\t\t\t\tdata-card',
			...(carousel.className == null ? [] : [
				`\t\t\t\tclass=${q(carousel.className)}`,
			]),
			'\t\t\t\tscrollContainerProps={{',
		`\t\t\t\t\t'data-row': 'start align-start',`,
		...(carousel.scrollContainerClassName == null ? [] : [
			`\t\t\t\t\tclass: ${q(carousel.scrollContainerClassName)},`,
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
			`\t\t\t\t\t\t\t\taria-label=${q(`${carousel.label} help`)}`,
			'\t\t\t\t\t\t\t>ⓘ</abbr>',
			'\t\t\t\t\t\t</Tooltip>',
		]),
		'\t\t\t\t\t</header>',
		'\t\t\t\t{/snippet}',
		'',
		...sections.flatMap((section) => renderCarouselSection(entity, indexes, section, carousel.projectionPath)),
		'\t\t\t</CollapsibleTabs>',
	]

	const carouselLines = carousel.projectionPath == null ?
		renderConditionedEntityLines(entity, carousel.conditions, 3, tabsLines)
	:
		renderProjectionConditionedLines(entity, carousel.projectionPath, carousel.conditions, 5, tabsLines)
	if (carousel.projectionPath == null)
		return carouselLines

	return [
		'			<ProjectionBoundary',
		renderSvelteAttribute(
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

const renderCarouselSection = (
	entity: Entity,
	indexes: AppIndexes,
	section: EntityCarouselSection,
	projectionPath?: readonly [string, ...string[]]
) => {
	if (section.Content != null)
		return [
			`\t\t\t\t{#snippet Section${pascal(carouselSectionId(section))}({ id, label, open })}`,
			...renderRawLines(section.Content.raw, 5),
			'\t\t\t\t{/snippet}',
			'',
		]

	if (section.field == null)
		throw new Error(`${entity.entityType} carousel section ${carouselSectionId(section)} needs Content or field`)

	const fieldDefinition = fieldDefinitionByName(entity, section.field)
	if (fieldDefinition == null)
		throw new Error(`${entity.entityType} carousel section ${carouselSectionId(section)} references unknown field ${section.field}`)

	if (carouselSectionIsPrimitiveList(entity, section))
		return renderPrimitiveCarouselSection(entity, indexes, section, projectionPath)

	if (fieldDefinition.entityType == null)
		throw new Error(`${entity.entityType} carousel section ${carouselSectionId(section)} field ${section.field} is not an entity reference or primitive list`)

	const component = carouselSectionComponent(entity, indexes, section)
	if (component == null)
		throw new Error(`${entity.entityType} carousel section ${carouselSectionId(section)} has no renderable relationship component for ${section.field}`)

	const query = renderQuery(fieldQuery(fieldDefinition, section.selection), [])
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
	const autoFacetConditions = facetFieldReferenceConditions(entity, section.field)
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
	const sectionSelectSources = renderSourceSelectionExpression(section.selection?.sources)
	const sectionSelectSourcesExpression = sectionSelectSources ?? `${fieldBase}.sources`
	const referenceHrefExpression = renderEntityHrefExpression(
		indexes,
		targetEntity,
		`${targetEntityName}[EntityMetaKey.Selector]`,
		`${targetEntityName}[EntityMetaKey.Selector]`,
		true
	)
	const hrefExpression = section.link == null ?
		renderCollectionHrefExpression(entity, indexes, section.field, targetEntity)
	:
		renderRouteResolveExpression(
			publicRouteId(section.link.route),
			(section.link.params ?? []).map((param) => [
				param.param,
				renderRouteParamValueExpression(param.value, 'selection.entitySelector'),
			])
		)

	const sectionBodyLines = fieldDefinition.type === EntityFieldType.EntityReference ? [
			'\t\t\t\t\t<ResourceBoundary',
			renderSvelteAttribute(6, 'resource', fieldProxyResourceExpression(fieldBase, fieldReference, query)),
			'\t\t\t\t\t>',
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
				...(referenceHrefExpression == null ? [] : [renderSvelteAttribute(9, 'href', referenceHrefExpression)]),
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
				...(referenceHrefExpression == null ? [] : [renderSvelteAttribute(10, 'href', referenceHrefExpression)]),
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
			renderSvelteAttribute(6, 'selection', fieldProxyResourceExpression(fieldBase, fieldReference, query)),
			...(hrefExpression == null ? [] : [renderSvelteAttribute(6, 'href', hrefExpression)]),
			'\t\t\t\t\t\tCollapsibleProps={{ canToggle: false }}',
			...(section.emptyText == null ? [] : [`\t\t\t\t\t\temptyText=${q(section.emptyText)}`]),
			'\t\t\t\t\t\topen={open}',
			'\t\t\t\t\t\ttitle={label}',
			'\t\t\t\t\t\tid={`${id}-list`}',
			'\t\t\t\t\t/>',
		]

	return [
		`\t\t\t\t{#snippet ${snippetName}({ id, label, open })}`,
		...(
			fieldBelongsToProjection ?
				renderConditionedEntityLines(entity, sectionConditions, 5, sectionBodyLines)
			:
				renderProjectionBoundaryLines(
					section.field,
					renderConditionedEntityLines(entity, sectionConditions, 5, sectionBodyLines),
					5
				)
		),
		'\t\t\t\t{/snippet}',
		'',
	]
}

const renderPrimitiveCarouselSection = (
	entity: Entity,
	indexes: AppIndexes,
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
	const query = renderQuery(
		fieldQueryForName(entity, section.field, section.selection),
		fieldBelongsToProjection || section.field == null ? [] : [section.field]
	)
	const fieldDefinition = fieldName == null ? undefined : fieldDefinitionByName(entity, section.field ?? '')
	const primitiveValuesName = camel(fieldName ?? 'values')
	const primitiveValueName = camel((fieldDefinition?.label ?? fieldName ?? 'value').replace(/s$/, ''))
	const primitiveValueIndexName = `${primitiveValueName}Index`
	const autoFacetConditions = facetFieldReferenceConditions(entity, section.field)
	const sectionConditions = (section.conditions ?? []).filter((condition) => (
		!autoFacetConditions.some((autoCondition) => (
			autoCondition.field === condition.field
			&& autoCondition.equals === condition.equals
			&& autoCondition.contains === condition.contains
		))
	))
	const sectionBodyLines = [
		'\t\t\t\t\t<ResourceBoundary',
		renderSvelteAttribute(
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
			const fieldName = itemFieldName(viewEntry)[0]
			if (fieldName == null)
				throw new Error(`${entity.entityType} primitive carousel section ${carouselSectionId(section)} item is missing a field reference`)

			return [
				`${'\t'.repeat(10)}{@const ${primitiveCarouselRowValueName(fieldName)} = ${fieldExpression(primitiveValueName, fieldName)}}`,
			]
		}),
		'\t\t\t\t\t\t\t\t\t\t<li>',
		'\t\t\t\t\t\t\t\t\t\t\t<dl data-column-item="center">',
		...(section.items ?? []).flatMap((viewEntry) => renderPrimitiveCarouselRowItem(entity, indexes, viewEntry, primitiveValueName, 12)),
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
				renderConditionedEntityLines(entity, sectionConditions, 5, sectionBodyLines)
			:
				renderProjectionBoundaryLines(
					section.field ?? '',
					renderConditionedEntityLines(entity, sectionConditions, 5, sectionBodyLines),
					5
				)
		),
		'\t\t\t\t{/snippet}',
		'',
	]
}

const primitiveCarouselRowValueName = (fieldName: string) => `${pascal(fieldName)[0]?.toLowerCase() ?? ''}${pascal(fieldName).slice(1)}Value`

const renderPrimitiveCarouselRowItem = (
	entity: Entity,
	indexes: AppIndexes,
	viewEntry: _ViewItem,
	primitiveFieldsExpression: string,
	level: number
) => {
	if (typeof viewEntry === 'object' && 'kind' in viewEntry)
		throw new Error(`${entity.entityType} primitive carousel row item cannot use kinded view metadata`)

	const fieldName = itemFieldName(viewEntry)[0]
	if (fieldName == null)
		throw new Error(`${entity.entityType} primitive carousel row item is missing a field reference`)

	const label = typeof viewEntry === 'object' && 'label' in viewEntry && viewEntry.label != null ? viewEntry.label : fieldName
	const valueName = primitiveCarouselRowValueName(fieldName)

	return [
		`${'\t'.repeat(level)}<div>`,
		`${'\t'.repeat(level + 1)}<dt>${label}</dt>`,
		`${'\t'.repeat(level + 1)}<dd>`,
		`${'\t'.repeat(level + 2)}{#if ${valueName} !== undefined && ${valueName} !== null}`,
		...renderValueMarkup(entity, indexes, viewEntry, fieldName, valueName, primitiveFieldsExpression, level + 3),
		`${'\t'.repeat(level + 2)}{/if}`,
		`${'\t'.repeat(level + 1)}</dd>`,
		`${'\t'.repeat(level)}</div>`,
	]
}

const renderEntityReferenceSection = (
	entity: Entity,
	indexes: AppIndexes,
	section: RelationshipSection,
	fieldDefinition: EntityField,
	component: string
) => {
	const query = renderQuery(fieldQuery(fieldDefinition, section.selection), [])
	const targetEntity = fieldDefinition.entityType
	if (targetEntity == null)
		throw new Error(`${entity.entityType}.${section.field} EntityReference section is missing entityType`)
	const targetEntityName = camel(targetEntity)
	if (entitySelectorOwnsField(entity, section.field)) {
		const selectorExpression = fieldExpression('selection.entitySelector', section.field)
		const hrefExpression = renderEntityHrefExpression(indexes, targetEntity, selectorExpression, selectorExpression, true)

		return [
			'\t\t\t\t<section data-column="gap-2">',
			`\t\t\t\t\t<h3>${section.label ?? labelForField(fieldDefinition)}</h3>`,
			`\t\t\t\t\t<${componentIdentifier(component)}`,
			renderSvelteAttribute(6, 'selection', `select(EntityType.${targetEntity}, ${selectorExpression})`),
			...(hrefExpression == null ? [] : [renderSvelteAttribute(6, 'href', hrefExpression)]),
			'\t\t\t\t\t\tlayout={EntityLayout.Summary}',
			'\t\t\t\t\t\topen={false}',
			'\t\t\t\t\t/>',
			'\t\t\t\t</section>',
		]
	}
	const hrefExpression = renderEntityHrefExpression(
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
		renderSvelteAttribute(6, 'resource', fieldProxyResourceExpression('selection', section.field, query)),
		'\t\t\t\t\t>',
		`\t\t\t\t\t\t{#snippet children(${targetEntityName})}`,
		...(fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne ? [
			`\t\t\t\t\t\t\t{#if ${targetEntityName} != null}`,
		] : []),
		`${'\t'.repeat(referenceLevel)}<${componentIdentifier(component)}`,
		`${'\t'.repeat(referenceLevel + 1)}selection={select(EntityType.${targetEntity}, ${targetEntityName}[EntityMetaKey.Selector], { sources: selection.sources })}`,
		`${'\t'.repeat(referenceLevel + 1)}prefetched={${targetEntityName}}`,
		...(hrefExpression == null ? [] : [renderSvelteAttribute(referenceLevel + 1, 'href', hrefExpression)]),
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

const renderEntitiesReferenceSection = (
	entity: Entity,
	indexes: AppIndexes,
	section: RelationshipSection,
	fieldDefinition: EntityField,
	component: string
) => {
	const query = renderQuery(fieldQuery(fieldDefinition, section.selection), [])
	const targetEntity = fieldDefinition.entityType
	if (targetEntity == null)
		throw new Error(`${entity.entityType}.${section.field} EntitiesReference section is missing entityType`)
	const hrefFieldNames = collectionHrefFieldNames(entity, indexes, section.field, targetEntity)
	const hrefNeedsResolvedEntity = hrefFieldNames.some((fieldName) => !entitySelectorOwnsField(entity, fieldName))
	const hrefExpression = renderCollectionHrefExpression(
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
		`String(${fieldExpression('entity', fieldNameForReference(section.titleField))} ?? ${q(titleLabel)})`
	const sectionLines = () => [
		`\t\t\t\t<${componentIdentifier(component)}`,
		renderSvelteAttribute(5, 'selection', fieldProxyResourceExpression('selection', section.field, query)),
		titleExpression == null ? `\t\t\t\t\ttitle=${q(titleLabel)}` : renderSvelteAttribute(5, 'title', titleExpression),
		...(section.href != null ? [
			section.href.includes('(') ?
				renderSvelteAttribute(5, 'href', renderResolveExpression(publicRouteId(section.href)))
			:
				`\t\t\t\t\thref=${q(publicRouteId(section.href))}`,
		] : hrefExpression == null ? [] : [renderSvelteAttribute(5, 'href', hrefExpression)]),
			...(section.emptyText == null ? [] : [`\t\t\t\t\temptyText=${q(section.emptyText)}`]),
		...(section.list?.placeholderText == null ? [] : [`\t\t\t\t\tplaceholderText=${q(section.list.placeholderText)}`]),
		...(section.props ?? []).map((prop) => `\t\t\t\t\t${prop.name}={${renderExpression(prop.value, {
			fields: 'selection.entitySelector',
		})}}`),
		section.idExpression == null ?
			(
				section.id == null ?
					`\t\t\t\t\tid=${q(`${component}-${routeCollectionIdForFieldReference(section.field)}`)}`
				:
					`\t\t\t\t\tid=${q(section.id)}`
			)
		:
			renderSvelteAttribute(5, 'id', section.idExpression),
		'\t\t\t\t/>',
	]

	if (section.titleField == null && !hrefNeedsResolvedEntity)
		return sectionLines()

	return [
		'\t\t\t\t<ResourceBoundary',
		renderSvelteAttribute(5, 'resource', `selection(${renderQuery(undefined, unique([
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

const renderFilterCondition = (
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

const namedRelationshipListViews = (indexes: AppIndexes) => [...new Map(indexes.activeEntities.flatMap((sourceEntity) => (sourceEntity.singularView?.carousels ?? []).flatMap((carousel) => carousel.sections.flatMap((section) => {
		if (section.List == null || section.field == null || indexes.generatedComponents.has(section.List))
			return []

		const field = fieldDefinitionByName(sourceEntity, section.field)
		if (field == null || field.entityType == null)
			return []

		const entity = indexes.entityByType.get(field.entityType)
		return entity == null ? [] : [{
			component: section.List,
			entity,
			sourceEntity,
			section,
			field,
		} satisfies NamedRelationshipListView]
	}))).map((view) => [view.component, view])).values()]

const renderNamedRelationshipListViewFile = (view: NamedRelationshipListView) => {
	const targetComponent = pluralComponentName(view.entity)
	const targetIdentifier = pluralComponentIdentifier(view.entity)
	const typeAnnotationParagraphs = view.section.description == null ? '[]' : `[${q(view.section.description)}]`
	const emptyText = view.section.emptyText == null ? 'undefined' : q(view.section.emptyText)

	return svelteFile(
		viewModulePath(view.component).replace(/^\$\//, 'src/'),
		{
			script: [
				'// Types/constants',
				'import type { ComponentProps } from \'svelte\'',
				'import type { EntityProxyEntitiesResource } from \'$/client/$proxy.svelte.ts\'',
				'import type { WithRest } from \'$/typescript/WithRest.ts\'',
				'import { EntityType } from \'$/schema/EntityType.ts\'',
				'import { schema } from \'$/schema/index.ts\'',
				'',
				'',
				'// State',
				'let {',
				'\tselection,',
				`\ttitle = ${q(view.section.label ?? view.field.label)},`,
				`\ttypeAnnotationParagraphs = ${typeAnnotationParagraphs},`,
				`\temptyText = ${emptyText},`,
				'\thref,',
				'\topen = $bindable(true),',
				'\tcollapsible = true,',
				`\tid = ${q(`${view.component.replace(/View$/, '')}-list`)},`,
				`\t...${targetIdentifier}Props`,
				'}: WithRest<',
				'\t{',
				`\t\tselection: EntityProxyEntitiesResource<typeof schema, EntityType.${view.entity.entityType}>`,
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

const renderPluralViewFile = (entity: Entity, indexes: AppIndexes) => {
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
	const entityHrefs = indexes.entityHrefsByType.get(entity.entityType) ?? []
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
	const rowQueryFields = unique([
		...(usesCustomRow ? [] : viewItems(entitySingularView(entity)?.summary?.icon)),
		...rowItems,
	].flatMap((item) => itemFieldName(item)).concat(rowHrefFields))
	const query = renderQuery(pluralView?.query?.selection ?? pluralView?.query, rowQueryFields)
	const filters = pluralView?.filters ?? []
	const filterCondition = filters.length === 0 ?
		'true'
	:
		filters.map((filter) => renderFilterCondition(filter, entityValueName)).join(' && ')
	const filteredEntityValuesExpression = filters.length === 0 ?
		`${entityValuesName}.values`
	:
		`${entityValuesName}.values.filter((${entityValueName}) => ${filterCondition})`
	const sourceSelection = pluralView?.query?.sources
	const rawSnippets = rawSnippetSources(pluralView)
	const modelTypeAnnotationTooltipMarkup = (
		pluralView?.TypeAnnotationTooltip != null ?
			renderRawLines(pluralView.TypeAnnotationTooltip.raw, 1)
		:
			[]
	)
	const defaultTypeAnnotationParagraphs = (
		pluralView?.TypeAnnotationTooltip == null && entity.description != null ?
			`[${q(entity.description)}]`
		:
			'[]'
	)
	const selectedSources = !Array.isArray(sourceSelection) && sourceSelection?.name != null && filters.length > 0 ?
		[
			`const selectedSources = $derived(${renderSourceSelectionByKey(sourceSelection)}[[${filters.map((filter) => `String(${filter.prop})`).join(', ')}].join(':')] ?? ${renderSourceArray(sourceSelection.default)})`,
		]
	:
		[]
	const renderedQuery = selectedSources.length === 0 ? query : renderObject([
		['sources', 'selectedSources'],
		['count', 'true'],
	])
	const itemFieldsName = `${entityValueName}Fields`
	const itemFieldsExpression = itemFieldsName
	const itemHrefFieldsName = `${entityValueName}HrefFields`
	const itemHrefFieldsExpression = itemHrefFieldsName
	const itemPrefetchedFieldOverrides = rowQueryFields.flatMap((fieldName) => {
		const fieldDefinition = fieldDefinitionByName(entity, fieldName)
		if (
			fieldDefinition?.cardinality !== EntityFieldCardinality.Many
			&& fieldDefinition?.cardinality !== EntityFieldCardinality.ZeroOrMany
		)
			return []

		return `${fieldName}: ${entityValueName}${propertyAccess(fieldName)}`
	})
	const rowHrefExpression = pluralView?.rowHref == null ?
		undefined
	:
		renderRouteResolveExpression(
			pluralView.rowHref.route,
			Object.entries(pluralView.rowHref.params).map(([param, value]) => [
				param,
				renderRouteParamExpression('expression' in value ? value.expression : value, {
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
	const entityHrefExpression = rowHrefExpression ?? renderEntityHrefExpression(
		indexes,
		entity.entityType,
		`${entityValueName}[EntityMetaKey.Selector]`,
		itemHrefFieldsExpression,
		true
	)
	const script = [
		'// Types/constants',
		'import type { ComponentProps } from \'svelte\'',
		...((entityHrefExpression != null || rowHrefExpression != null) || rawSnippets.some((snippet) => snippet.raw.includes('resolve(')) ? ['import { resolve } from \'$app/paths\''] : []),
		'import type { SubscribeEntityReferenceResult } from \'$/client/$client.svelte.ts\'',
		'import type { EntityProxyEntitiesResource } from \'$/client/$proxy.svelte.ts\'',
		'import type { WithRest } from \'$/typescript/WithRest.ts\'',
		'import { EntityMetaKey } from \'$/schema/$schema.ts\'',
		'import { EntityType } from \'$/schema/EntityType.ts\'',
		'import { schema } from \'$/schema/index.ts\'',
		...rowHrefImports.map(([from, names]) => renderImport({
			from,
			names: [...names],
		})),
		...entityHrefImports.map(([from, names]) => renderImport({
			from,
			names: [...names],
		})),
		...(renderedQuery.includes('Source.') || selectedSources.length > 0 ? ['import { Source } from \'$/sources/Source.ts\''] : []),
		...renderImportObject(pluralView?.imports).map((spec) => renderImport(spec)),
		'',
		'',
		'// Context',
		'import { select } from \'$/routes/+layout.svelte\'',
		'',
		'',
		'// State',
		'let {',
		'\tselection,',
		`\ttitle = ${q(pluralView?.title ?? sentenceStart(entityLabelPlural(entity)))},`,
		`\ttypeAnnotationParagraphs = ${defaultTypeAnnotationParagraphs},`,
		'\tplaceholderText,',
		`\temptyText = ${pluralView?.emptyText == null ? 'undefined' : q(pluralView.emptyText)},`,
		'\topen = $bindable(true),',
		'\tcollapsible = true,',
		'\tshowTypeAnnotation = true,',
		`\tid = ${q(`${pluralViewName(entity)}-list`)},`,
		...filters.map((filter) => `\t${filter.prop},`),
		'\t...EntitiesListProps',
		'}: WithRest<',
		'\t{',
		`\t\tselection: EntityProxyEntitiesResource<typeof schema, EntityType.${entity.entityType}>`,
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
		'',
		'// Components',
		'import EntitiesList from \'$/components/EntitiesList.svelte\'',
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
			renderSvelteAttribute(
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
			renderSvelteAttribute(
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
			renderSvelteAttribute(
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
			`\t\t\t\t{#snippet Item({ item: ${entityValueName} }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.${entity.entityType}> })}`,
			`\t\t\t\t\t{@const ${itemFieldsName} = { ...${entityValueName}[EntityMetaKey.Selector], ...${entityValueName}${itemPrefetchedFieldOverrides.length === 0 ? '' : `, ${itemPrefetchedFieldOverrides.join(', ')}`} }}`,
			...(entityHrefExpression == null ? [] : [
				`\t\t\t\t\t{@const ${itemHrefFieldsName} = { ...${entityValueName}${itemPrefetchedFieldOverrides.length === 0 ? '' : `, ${itemPrefetchedFieldOverrides.join(', ')}`}, ...${entityValueName}[EntityMetaKey.Selector] }}`,
			]),
			`\t\t\t\t\t<${singularComponentIdentifier(entity.entityType)}`,
			`\t\t\t\t\t\tselection={select(EntityType.${entity.entityType}, ${entityValueName}[EntityMetaKey.Selector], { sources: selection.sources })}`,
			`\t\t\t\t\t\tprefetched={${itemFieldsName}}`,
			...(entityHrefExpression == null ? [] : [
				renderSvelteAttribute(6, 'href', entityHrefExpression),
			]),
			`\t\t\t\t\t\tlayout={${itemLayout}}`,
			'\t\t\t\t\t\topen={false}',
			'\t\t\t\t\t/>',
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
			renderSvelteAttribute(
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
			...renderRawLines(pluralView.content.raw, 0),
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

const renderViewsIndexFile = (entities: readonly Entity[]) => tsFile(
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

const renderRouteFiles = (
	entry: RouteRenderEntry,
	indexes: AppIndexes,
	renderEntries: readonly RouteRenderEntry[]
) => entry.files.flatMap((routeFile) => {
	const routePath = `src/routes/${entry.routePath}/${routeFileName(routeFile.kind)}`.replaceAll('//', '/')
	const layoutPath = `src/routes/${entry.routePath}/+layout.ts`.replaceAll('//', '/')
	const pageModule = entry.files.find((file) => file.kind === RouteFileKind.PageModule)
	const shouldGenerateLayoutLoad = routeFile.sharedLayout === true
	if (routeFile.kind === RouteFileKind.PageModule)
		return [
			...(shouldGenerateLayoutLoad ? [renderPageModuleFile(layoutPath, routeFile, indexes)] : []),
			...(!shouldGenerateLayoutLoad && ((routeFile.mappings?.length ?? 0) > 1 || routeNeedsPageModule(routePath, routeFile, renderEntries)) ? [renderPageModuleFile(routePath, routeFile, indexes)] : []),
		]
	if (routeFile.kind === RouteFileKind.Layout)
		return [renderLayoutFile(routePath, routeFile, indexes)]
	if (routeFile.kind === RouteFileKind.Page) {
		const pageRouteFile = (routeFile.mappings?.length ?? 0) === 0 && (pageModule?.mappings?.length ?? 0) > 0 ? {
			...routeFile,
			mappings: pageModule?.mappings,
		} : routeFile
		const generatedPageModule = (
			pageModule != null
			&& (
				pageModule.sharedLayout === true
					|| (pageModule.mappings?.length ?? 0) > 1
				|| routeNeedsPageModule(routePath.replace(/\+page\.svelte$/, '+page.ts'), pageModule, renderEntries)
			)
		)
		return [
			renderPageFile(
				routePath,
				entry.routePath,
				pageRouteFile,
				indexes,
				generatedPageModule
			),
		]
	}
	return []
})

const routeNeedsPageModule = (
	routePath: string,
	routeFile: RouteFile,
	renderEntries: readonly RouteRenderEntry[]
) => (
	routeFile.mappings?.some((mapping) => mapping.projectionSubject?.routeParam != null) === true
		&& !routeProjectionOwnedByAncestor(routePath, routeFile, renderEntries)
)

const routeInlineSelectorExpression = (routeFile: RouteFile, context: Parameters<typeof renderExpression>[1]) => {
	const mapping = routeFile.mappings?.[0]
	if (mapping == null)
		return undefined
	return renderObject(mapping.fields.map((field) => [
		field.field,
		renderExpression(field.value, context),
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
			`${field} === ${renderLiteral(condition.is)}`
		: 'isOneOf' in condition ?
			`${renderArray(condition.isOneOf.map(renderLiteral))}.includes(${field})`
		:
			`(${field} !== undefined && ${field}.some((value: string | number | boolean | null) => value === ${renderLiteral(condition.includes)}))`
	)
}

const routeMappingContext = (
	routePath: string,
	indexes: AppIndexes,
	mapping: SelectorRouteMapping
) => {
	const networkParam = mapping.projection?.entityType === EntityType.Network ? mapping.projectionSubject?.routeParam : undefined
	const fieldsExpression = renderObject(mapping.fields.map((field) => [
		field.field,
		renderExpression(field.value, {
			params: 'params',
			pageSelector: 'parentData.selector',
		}),
	]))
	const usesParentSelector = mapping.fields.some((field) => expressionUsesKind(field.value, 'pageSelector'))
	const projectionEntity = mapping.projection == null ? undefined : indexes.entityByType.get(mapping.projection.entityType)
	if (mapping.projection != null && projectionEntity == null)
		throw new Error(`${routePath} references missing projection entity ${mapping.projection.entityType}`)
	const projectionCondition = mapping.projection == null || projectionEntity == null ?
		undefined
	:
		projectionFacetForPath(projectionEntity, mapping.projection.facetPath).condition
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
			selectorGuardExpression: mapping.projection?.entityType !== mapping.entityType || projectionCondition == null ?
				undefined
			:
				projectionConditionExpression(projectionCondition, `${camel(mapping.entityType)}${mapping.selectorName}Selector`),
		},
	}
}

const renderPageModuleFile = (routePath: string, routeFile: RouteFile, indexes: AppIndexes) => {
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
						`\t${context.guardExpression == null ? '' : '\t'}\tselectorMappings.push({ entityType: EntityType.${context.entityType}, selector: ${context.selectorVariableName} })`,
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
				renderExpression(context.mapping.title, {
					params: 'params',
					fields: context.selectorVariableName,
				})
			:
				renderExpression(context.mapping.title, {
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
					`// Projection eligibility: facetPath=[${context.mapping.projection.facetPath.map(q).join(', ')}]`,
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
				`\tif (${context.selectorVariableName} instanceof arktype.errors) error(404, ${q(`Invalid ${context.entityType} selector`)})`,
				...(context.projection.selectorGuardExpression == null ? [] : [
					`\tif (!(${context.projection.selectorGuardExpression})) error(404, 'Route projection not applicable')`,
				]),
				'',
				'\treturn ' + indent(renderObject(returnEntries)).trimStart(),
				'}',
			],
		}
	)
}

const renderMultiCollectionPageFile = (
	routePath: string,
	appRoutePath: string,
	routeFile: RouteFile,
	indexes: AppIndexes
) => {
	const contexts = (routeFile.collections ?? []).map((collection) => {
		const sourceEntity = indexes.entityByType.get(collection.source.entity)
		const collectionEntity = indexes.entityByType.get(collection.entity)
		if (sourceEntity == null || collectionEntity == null)
			throw new Error(`${routePath} collection mapping references a missing entity`)

		const selectionQuery = renderQuery(fieldQueryForName(
			sourceEntity,
			collection.source.field,
			collection.query
		), [])
		const sourceSelection = `select(EntityType.${collection.source.entity}, ${renderExpression(collection.source.selector, {
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
				))).map(renderImport),
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
					...renderCollectionPageMarkup(
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

const renderPageFile = (
	routePath: string,
	appRoutePath: string,
	routeFile: RouteFile,
	indexes: AppIndexes,
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
					renderSvelteAttribute(2, 'href', renderRouteResolveExpression(routeId(appRoutePath), routeParamNames(routeId(appRoutePath)).map((param) => [param, `params.${param}`]))),
					'\t\tselection={select(data.selectorMapping.entityType, data.selectorMapping.selector)}',
					'\t/>',
					'</Page>',
				],
			}
		)

	if ((routeFile.collections?.length ?? 0) > 1)
		return renderMultiCollectionPageFile(
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
	const collectionEntityDefinition = collectionEntity == null ? undefined : indexes.entityByType.get(collectionEntity)
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
	const collectionQuery = collection == null ? undefined : renderQuery(collection.query, [])
	const viewEntityDefinition = viewEntity == null ? undefined : indexes.entityByType.get(viewEntity)
	const collectionEntityDefinitionForTitle = collectionEntity == null ? undefined : indexes.entityByType.get(collectionEntity)
	const viewSelectionQuery = renderQuery(viewEntityDefinition == null ? undefined : singularViewQuery(entitySingularView(viewEntityDefinition)), [])
	const viewSelectionFields = viewEntityDefinition == null ?
		[]
	:
		viewResolvedFieldNames(viewEntityDefinition, indexes)
			.filter((fieldName) => {
				const fieldDefinition = fieldDefinitionByName(viewEntityDefinition, fieldName)
				return (
					fieldDefinition != null
					&& fieldDefinition.type !== EntityFieldType.EntitiesReference
				)
			})
	const viewSelectionFieldDefaultSources = viewEntityDefinition == null ? undefined : pageSelectionFieldDefaultSources(viewEntityDefinition, viewSelectionFields)
	const collectionHref = collection == null ?
		undefined
	:
		indexes.collectionHrefByEntity.get(collection.entity) ?? routeId(appRoutePath)
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
	const pageSelectionExpression = isEntityDetailPage && viewEntity != null ?
		renderEntityPageSelection(indexes, viewEntityDefinition, viewEntity, selectorExpression, viewSelector)
	:
		undefined
	const pageEntityTitleExpression = (
		isEntityDetailPage && viewEntityDefinition != null && entityTypeLabel != null ?
			(() => {
				const serial = summarySerial(viewEntityDefinition)
				const pendingTitle = renderJoinedItemsExpression(viewEntityDefinition, indexes, declaredSummaryTitleEntries(viewEntityDefinition), 'pageSelection.entitySelector')
				const pendingFallbackTitle = renderJoinedItemsExpression(
					viewEntityDefinition,
					indexes,
					viewItems(entitySingularView(viewEntityDefinition)?.summary?.titleFallback),
					'pageSelection.entitySelector'
				)
				const pendingSerialTitle = serial == null ?
					renderFirstDeclaredExpression([pendingTitle, pendingFallbackTitle])
				:
					renderSerialTextExpression(viewEntityDefinition, indexes, serial, 'pageSelection.entitySelector')
				const resolvedEntityFieldsExpression = '({ ...pageSelection.entitySelector, ...pageSelection.entity })'
				const resolvedTitle = renderJoinedItemsExpression(viewEntityDefinition, indexes, declaredSummaryTitleEntries(viewEntityDefinition), resolvedEntityFieldsExpression)
				const resolvedFallbackTitle = renderJoinedItemsExpression(
					viewEntityDefinition,
					indexes,
					viewItems(entitySingularView(viewEntityDefinition)?.summary?.titleFallback),
					resolvedEntityFieldsExpression
				)
				const resolvedSerialTitle = serial == null ?
					renderFirstDeclaredExpression([resolvedTitle, resolvedFallbackTitle])
				:
					renderSerialTextExpression(viewEntityDefinition, indexes, serial, resolvedEntityFieldsExpression)
				return usesData ?
					`(data.title ?? (pageSelection.entity == null ? ${renderFirstDeclaredExpression([pendingSerialTitle, q(entityTypeLabel)])} : ${renderFirstDeclaredExpression([resolvedSerialTitle, q(entityTypeLabel)])}))`
				:
					`(pageSelection.entity == null ? ${renderFirstDeclaredExpression([pendingSerialTitle, q(entityTypeLabel)])} : ${renderFirstDeclaredExpression([resolvedSerialTitle, q(entityTypeLabel)])})`
			})()
		:
			undefined
	)
	const routeFileUsesResolve = view?.Content == null && (component != null && viewEntity != null || collection != null && collectionComponent != null)
	const collectionSourceEntityDefinition = collection == null ? undefined : indexes.entityByType.get(collection.source.entity)
	const collectionSelectionQuery = collection == null || collectionSourceEntityDefinition == null ? '' : renderQuery(fieldQueryForName(
		collectionSourceEntityDefinition,
		collection.source.field,
		collection.query
	), [])
	const collectionSourceSelectionExpression = collection == null ? '' : `select(EntityType.${collection.source.entity}, ${renderExpression(collection.source.selector, {
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
				...collectionExpressionImports.map(renderImport),
				...(
					inlineSelectorExpression == null && !(isEntityDetailPage && viewEntityDefinition != null) ?
						[]
					:
						mergeImports([
							...(inlineSelectorExpression == null ? [] : routeInlineSelectorImports(routeFile)),
							...(isEntityDetailPage && viewEntityDefinition != null ? viewItemImports(viewEntityDefinition, indexes) : []),
						]).map(renderImport)
				),
				...renderImportObject(view?.imports).map(renderImport),
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
					renderEntityPageMarkup(routeFile, component, selectorExpression, routeId(appRoutePath), indexes, pageSelectionExpression == null ? undefined : 'pageSelection')
				:
						renderCollectionPageMarkup(
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

const renderEntityPageMarkup = (
	routeFile: RouteFile,
	component: string | undefined,
	selectorExpression: string,
	href: string,
	indexes: AppIndexes,
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
		renderSvelteAttribute(2, 'href', renderRouteResolveExpression(href, routeParamNames(href).map((param) => [param, `params.${param}`]))),
		renderSvelteAttribute(
			2,
			'selection',
			selectionBinding ?? renderEntityPageSelection(indexes, indexes.entityByType.get(entityType), entityType, selectorExpression, selectorName)
		),
		'\t/>',
	]
}

const renderCollectionPageMarkup = (
	routeFile: RouteFile,
	collection: CollectionRouteMapping,
	collectionComponent: string | undefined,
	href: string,
	indexes: AppIndexes,
	collectionSelectionExpression: string,
	projectionResourceExpression?: string
) => {
	if (collectionComponent == null)
		return []

	const source = collection.source
	const sourceEntity = indexes.entityByType.get(source.entity)
	if (sourceEntity == null)
		throw new Error(`${collection.entity} collection references missing source entity ${source.entity}`)

	const collectionEntity = indexes.entityByType.get(collection.entity)
	if (collectionEntity == null)
		throw new Error(`${collection.entity} collection references missing entity`)

	const componentIndent = projectionResourceExpression == null ? 1 : 3
	const component = [
		`${'\t'.repeat(componentIndent)}<${collectionComponent}`,
		renderSvelteAttribute(componentIndent + 1, 'href', renderRouteResolveExpression(href, routeParamNames(href).map((param) => [param, `params.${param}`]))),
		`${'\t'.repeat(componentIndent + 1)}title=${q(collection.page?.text?.title ?? routeFile.page?.text?.title ?? sentenceStart(entityLabelPlural(collectionEntity)))}`,
		renderSvelteAttribute(componentIndent + 1, 'selection', collectionSelectionExpression),
		`${'\t'.repeat(componentIndent + 1)}id=${q(routeCollectionIdForFieldReference(source.field))}`,
		`${'\t'.repeat(componentIndent)}/>`,
	]
	if (projectionResourceExpression == null)
		return component

	return [
		'\t<ProjectionBoundary',
		renderSvelteAttribute(2, 'resource', projectionResourceExpression),
		'\t>',
		'\t\t{#snippet Applicable(projection)}',
		...component,
		'\t\t{/snippet}',
		'\t</ProjectionBoundary>',
	]
}

const renderLayoutFile = (routePath: string, routeFile: RouteFile, indexes: AppIndexes) => {
	if ((routeFile.details?.length ?? 0) > 0) {
		const details = routeFile.details ?? []
		const href = details[0]?.href
		if (href == null || details.some((detail) => detail.href !== href))
			throw new Error(`${routePath} detail layout requires one shared href`)

		const detailByEntityType = new Map<EntityType, RouteDetail>()
		for (const detail of details) {
			const existing = detailByEntityType.get(detail.entityType)
			if (existing != null && existing.component !== detail.component)
				throw new Error(`${routePath} detail layout assigns multiple components to ${detail.entityType}`)

			detailByEntityType.set(detail.entityType, detail)
		}
		const uniqueDetails = [...detailByEntityType.values()]
		const hrefParamNames = routeParamNames(href)
		const hrefExpression = renderRouteResolveExpression(href, hrefParamNames.map((param) => [param, `params.${param}`]))
		const keyExpression = (
			hrefParamNames.length === 0 ?
				undefined
			: hrefParamNames.length === 1 ?
				`params.${hrefParamNames[0]}`
			:
				`[${hrefParamNames.map((param) => `params.${param}`).join(', ')}].join(':')`
		)
		const detailViewExpression = uniqueDetails.reduceRight((alternate, detail, index) => (
			index === uniqueDetails.length - 1 ?
				componentIdentifier(detail.component)
			:
				`data.selectorMapping.entityType === EntityType.${detail.entityType} ? ${componentIdentifier(detail.component)} : ${alternate}`
		), '')
		const detailSelectionExpression = (
			uniqueDetails.length === 1 ?
				uniqueDetails.map((detail) => `select(EntityType.${detail.entityType}, data.selector)`).join('')
			:
				'select(data.selectorMapping.entityType, data.selectorMapping.selector)'
		)
		const parentPageCollapsibleLines = [
			'<ParentPageCollapsible',
			renderSvelteAttribute(1, 'href', hrefExpression),
			'>',
			'\t{#snippet Summary()}',
			'\t\t{@const DetailView = ' + detailViewExpression + '}',
			'',
			'\t\t<DetailView',
			`\t\t\tselection={${detailSelectionExpression}}`,
			renderSvelteAttribute(3, 'href', hrefExpression),
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
					...uniqueDetails.map((detail) => `import ${componentIdentifier(detail.component)} from '${viewModulePath(detail.component)}'`),
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
		const selectorExpression = routeFile.layout.selector == null ? undefined : renderExpression(routeFile.layout.selector, {
			params: 'params',
		})
		const hrefParamNames = routeFile.layout.href == null ? [] : routeParamNames(routeFile.layout.href)
		const hrefExpression = routeFile.layout.href == null ?
			undefined
		:
			renderRouteResolveExpression(routeFile.layout.href, hrefParamNames.map((param) => [param, `params.${param}`]))
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
			renderExpression(routeFile.layout.id, {
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
			...(hrefExpression == null ? [] : [renderSvelteAttribute(1, 'href', hrefExpression)]),
			...(idExpression == null ? [] : [renderSvelteAttribute(1, 'id', idExpression)]),
			'>',
			'\t{#snippet Summary()}',
			`\t\t<${component}`,
			renderSvelteAttribute(3, 'selection', selectorExpression == null ? `select(EntityType.${routeFile.layout.entity}, data.selector)` : `select(EntityType.${routeFile.layout.entity}, ${selectorExpression})`),
			...(hrefExpression == null ? [] : [renderSvelteAttribute(3, 'href', hrefExpression)]),
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
					...imports.map(renderImport),
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
		renderResolveExpression(href, hrefParams.map((param) => [param, `params.${param}`]))
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
				`\ttitle=${q(title)}`,
				...(hrefExpression == null ? [] : [renderSvelteAttribute(1, 'href', hrefExpression)]),
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


const generatedRelative = (absolutePath: string) => path.relative(generatedOutputRoot, absolutePath)

const isGeneratedFile = async (filePath: string) => {
	const source = await readText(path.join(generatedOutputRoot, filePath))
	return source?.startsWith(generatedHeader) === true || source?.startsWith(generatedSvelteHeader) === true
}

const generatedRouteModulePaths = async () => {
	const paths: string[] = []
	const walk = async (directory: string) => {
		const entries = await fs.readdir(directory, {
			withFileTypes: true,
		})
		for (const entry of entries) {
			const absolutePath = path.join(directory, entry.name)
			if (entry.isDirectory()) {
				await walk(absolutePath)
				continue
			}
			if (/^\+(page|layout)\.(svelte|ts)$/.test(entry.name))
				paths.push(generatedRelative(absolutePath))
		}
	}

	await walk(routeRoot)
	return paths
}

const generatedViewPaths = async () => {
	const entries = await fs.readdir(path.join(generatedRoot, 'views'), {
		withFileTypes: true,
	})

	return entries
		.filter((entry) => entry.isFile() && /^[_a-zA-Z][\w]*(?:s)?View(?:s)?\.svelte$/.test(entry.name))
		.map((entry) => `src/views/${entry.name}`)
}

const generatedSchemaPaths = async () => {
	const entries = await fs.readdir(path.join(generatedRoot, 'schema'), {
		withFileTypes: true,
	})

	return entries
		.filter((entry) => entry.isFile() && entry.name.endsWith('.ts'))
		.map((entry) => `src/schema/${entry.name}`)
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
	const staleRouteModules = []
	for (const filePath of await generatedRouteModulePaths()) {
		if (!expected.has(filePath) && !protectedRouteFiles.has(filePath) && await isGeneratedFile(filePath))
			staleRouteModules.push(filePath)
	}
	const staleViews = []
	for (const filePath of await generatedViewPaths()) {
		if (!expected.has(filePath) && await isGeneratedFile(filePath))
			staleViews.push(filePath)
	}
	const staleSchemas = []
	for (const filePath of await generatedSchemaPaths()) {
		if (!expected.has(filePath) && !protectedSchemaFiles.has(filePath) && await isGeneratedFile(filePath))
			staleSchemas.push(filePath)
	}
	for (const filePath of [
		...staleRouteModules,
		...staleViews,
		...staleSchemas,
	])
		await fs.rm(path.join(generatedOutputRoot, filePath), {
			force: true,
		})

	await removeEmptyRouteDirectories()
}

const checkFiles = async (files: readonly GeneratedFile[]) => {
	const expected = new Set(files.map((generatedFile) => generatedFile.path))
	const staleRouteModules = []
	for (const filePath of await generatedRouteModulePaths()) {
		if (!expected.has(filePath) && !protectedRouteFiles.has(filePath) && await isGeneratedFile(filePath))
			staleRouteModules.push(filePath)
	}
	const staleViews = []
	for (const filePath of await generatedViewPaths()) {
		if (!expected.has(filePath) && await isGeneratedFile(filePath))
			staleViews.push(filePath)
	}
	const staleSchemas = []
	for (const filePath of await generatedSchemaPaths()) {
		if (!expected.has(filePath) && !protectedSchemaFiles.has(filePath) && await isGeneratedFile(filePath))
			staleSchemas.push(filePath)
	}
	const stale = [
		...staleRouteModules,
		...staleViews,
		...staleSchemas,
	]
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
			if (!expected.has(targetPath) && await readText(path.join(repoRoot, targetPath)) == null)
				missing.push(`${generatedFile.path} imports missing ${targetPath}`)
		}
	}
	if (missing.length > 0)
		throw new Error(`Generated view imports do not resolve:\n${missing.join('\n')}`)
}

const main = async () => {
	const command = process.argv[2] ?? 'check'
	await Promise.all([
		routeRoot,
		path.join(generatedRoot, 'schema'),
		path.join(generatedRoot, 'sources'),
		path.join(generatedRoot, 'views'),
	].map((directory) => fs.mkdir(directory, {
		recursive: true,
	})))
	const normalizedApp = normalizeApp(app)
	const {
		indexes,
		renderEntries,
	} = compileApp(normalizedApp)
	const files = deriveFiles(
		normalizedApp,
		indexes,
		renderEntries
	)
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

if (process.argv[1] != null && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
	await main()
