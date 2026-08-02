import fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

import { parse as parseSvelte } from 'svelte/compiler'
import ts from 'typescript'

import {
	emitTypeScript,
	generatedHeader,
	generatedSvelteHeader,
	importNameKey,
	indent,
	mergeImports,
	renderImport as emitImport,
	renderGeneratedFile,
	type GeneratedFile,
	type ImportPlan as ImportSpec,
	type SvelteFilePlan,
	type TypeScriptEmission,
	type TypeScriptFilePlan,
} from './render.ts'

import {
	ApiFamily,
	EntityFieldCardinality,
	EntityFieldType,
	EntityType,
	Source,
	SourceArtifactKind,
	SourceBindingDeliveryCredentialLayout,
	SourceBindingDeliveryEndpointLayout,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceProvider,
	SourceTargetKind,
	WireProtocol,
	sourceBindingCompatibility,
	sourceBindingDeliveryCompatibility,
	_ExpressionDecode,
	_RouteParamEncoding,
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
	rawSnippetReference,
} from '../../APP.ts'

import { networks } from '../../src/constants/Network.ts'


// Compiler model: these types describe the validated facts retained from APP.ts.
// They are not runtime application contracts and never ship to the browser.
type AppEntity = App['schema']['entities'][number]
type AppSingularView = NonNullable<AppEntity['views']['singular']>
type EntityLatest = NonNullable<AppSingularView['latest']>[number] & {
	projectionPath?: readonly [string, ...string[]]
}
type EntityCarousel = NonNullable<AppSingularView['carousels']>[number] & {
	projectionPath?: readonly [string, ...string[]]
}
type SingularView = AppSingularView & {
	latest?: EntityLatest[]
	carousels?: EntityCarousel[]
}
type Entity = AppEntity & {
	views: AppEntity['views'] & {
		singular?: SingularView
	}
}
type EntityField = Entity['fields'][number]
type EntityFacet = NonNullable<Entity['facets']>[number]
type EntityFacetEntry = {
	entityType: string
	facet: EntityFacet
	projectionPath: readonly [string, ...string[]]
}
type EntitySelector = Entity['selectors'][number]
type EntityEnum = NonNullable<Entity['enums']>[number]
type ValueType =
	| App['schema']['valueTypes'][number]
	| {
		id: EntityEnum['name']
		imports: readonly _Import[]
		routeParam?: EntityEnum['routeParam']
		type: {
			enum: EntityEnum['name']
		}
	}
type ValueTypeType = App['schema']['valueTypes'][number]['type']
type EntityCarouselSection = EntityCarousel['sections'][number]
type PluralView = NonNullable<Entity['views']['plural']>
type ReferencePathStep = {
	entity: Entity
	projectionPath: readonly string[]
	field: EntityField
}
type ReferencePathPlan = {
	steps: readonly ReferencePathStep[]
	terminalEntity: Entity
	terminalProjectionPath: readonly string[]
	terminalField: EntityField
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
		path: readonly string[]
		routeEntityType?: EntityType
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
	valueTypes: readonly string[]
	decode?: _ExpressionDecode | _RouteParamTransform
	encoding?: _RouteParamEncoding
}
type RouteParamCompilationContext = RouteParam & {
	explicitValueTypes: readonly string[]
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
	routeParamMatchers: readonly {
		param: string
		matchers: readonly string[]
		valueTypes: readonly string[]
	}[]
	probeCaseId?: string
	probeAtoms: readonly string[]
	boundaryLiveOptional?: true
	href?: {
		entityHref?: false
		canonicalize?: true
		conditions?: EntityRouteLink['conditions']
	}
	routeParamAlternatives: readonly RouteParamValues[]
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
	projectionRouteParam?: string
	page?: NonNullable<NonNullable<App['routes']['children'][string]['selectors']>[string]>[string]['page']
}
type SelectorOutcome =
	| {
		kind: 'VisibleRoute'
		nodeId: string
	}
	| {
		kind: 'CuratedParent'
		target: {
			entityType: string
			selectorName: string
		}
	}
	| {
		kind: 'Facet'
		target: {
			entityType: string
			selectorName: string
		}
		facetPath: readonly [string, ...string[]]
	}
	| {
		kind: 'Hub' | 'Internal'
		nodeId: string
	}
	| {
		kind: 'Alias'
		target: {
			entityType: string
			selectorName: string
		}
	}
	| {
		kind: 'Research' | 'Blocked'
		decision: string
		evidence: string
	}
type RouteNode = {
	internalPath: string
	svelteKitPath: string
	publicPath: string
	params: readonly RouteParam[]
	collectionMappings: readonly {
		entityType: EntityType
		field: FieldReference
		path: readonly string[]
		targetEntityType: EntityType
		selector: _Expression
		routeEntityType?: EntityType
		query?: _ViewQuery
		page?: NonNullable<App['routes']['children'][string]['collections']>[number]['page']
	}[]
	selectorMappings: readonly SelectorRouteMapping[]
	selectorVariant?: SelectorRouteMapping
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
	href?: _ViewListSection['href']
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
type RouteLink = {
	path: string
	params: RouteParamValues
}
type RouteParamValues = Readonly<Record<string, {
	value: _Expression
	decode?: _ExpressionDecode
}>>
type EntityRouteLink = RouteLink & {
	selector: string
	conditions?: {
		field: string
		equals?: _Literal
		notEquals?: _Literal
		contains?: _Literal
		oneOf?: readonly _Literal[]
	}[]
}
type FieldReference = _FieldReference
type SourceDefinition = App['sources']['sources'][number]
type SourceProviderDefinition = App['sources']['providers'][number]
type SourceBinding = NonNullable<SourceDefinition['binding']>
type SourceBindingEntry = {
	readonly source: SourceDefinition['source']
	readonly binding: SourceBinding
}
type RouteFixtureMetadata = {
	id: string
	projectionEntity?: EntityType
	projectionPath?: readonly [string, ...string[]]
	probeCaseId?: string
	probeAtoms: readonly string[]
	boundaryLiveOptional?: true
}
type NamedSourceSelectionPlan = {
	selection: _SourceSelection
	functionName: string
}
type CompositeRouteParamPlan = {
	matcher: string
	matchers: readonly string[]
}
type RouteFixturePlan = {
	nodeId: string
	routeId: string
	parameterMatcherNames: readonly string[]
	parameterEncodingByName: Readonly<Partial<Record<string, _RouteParamEncoding>>>
	mappings: readonly RouteFixtureMetadata[]
	boundaryLiveOptional: boolean
}
type CompiledPhysicalRouteFileFacts = {
	path: string
	appRoutePath: string
	semanticNodeId: string
	routeFile: RouteFile
	generatedPageModule?: boolean
}
type CompiledAppFacts = Readonly<{
	activeEntities: readonly Entity[]
	entityByType: Readonly<Record<string, Entity>>
	entityFacetByPath: Readonly<Record<string, EntityFacetEntry>>
	facetAncestorConditionsByPath: Readonly<Record<string, readonly _AppFacetCondition[]>>
	facetDependencyConditionsByPath: Readonly<Record<string, NonNullable<EntityRouteLink['conditions']>>>
	valueTypeById: Readonly<Record<string, ValueType>>
	sourceProviders: readonly SourceProviderDefinition[]
	sources: readonly SourceDefinition[]
	sourceBindings: readonly SourceBindingEntry[]
	resolverModules: readonly App['resolvers']['modules'][number][]
	navigationItems: readonly App['navigation']['items'][number][]
	compositeRouteParams: readonly CompositeRouteParamPlan[]
	routeFixturePlans: readonly RouteFixturePlan[]
	physicalRouteFiles: readonly CompiledPhysicalRouteFileFacts[]
	collectionRouteByEntity: Readonly<Record<string, string>>
	collectionRoutesBySourceField: Readonly<Record<string, readonly EntityRouteLink[]>>
	entityRouteLinksByType: Readonly<Partial<Record<string, readonly EntityRouteLink[]>>>
}>

type GenerationIndexes = Readonly<
	& Pick<
		CompiledAppFacts,
		| 'collectionRouteByEntity'
		| 'collectionRoutesBySourceField'
		| 'entityByType'
		| 'entityFacetByPath'
		| 'entityRouteLinksByType'
		| 'facetAncestorConditionsByPath'
		| 'facetDependencyConditionsByPath'
		| 'sourceBindings'
		| 'valueTypeById'
	>
	& {
		defaultPluralViewEntityTypes?: ReadonlySet<string>
		prefetchedSingularViewEntityTypes?: ReadonlySet<string>
		summaryPlanByEntityType?: ReadonlyMap<string, ReturnType<typeof compileSummaryPlan>>
	}
>
type SourcesMarkdownInput = Readonly<{
	sourceBindings: readonly SourceBindingEntry[]
	sourceProviders: readonly SourceProviderDefinition[]
	sources: readonly SourceDefinition[]
}>
type GenerationInput = Readonly<{
	indexes: GenerationIndexes
	entities: readonly Entity[]
	sourceProviders: readonly SourceProviderDefinition[]
	sources: readonly SourceDefinition[]
	navigationItems: readonly App['navigation']['items'][number][]
	resolverModules: readonly App['resolvers']['modules'][number][]
	routeFixturePlans: readonly RouteFixturePlan[]
	compositeRouteParams: readonly CompositeRouteParamPlan[]
	physicalRouteFiles: readonly CompiledPhysicalRouteFileFacts[]
}>
export type CompiledApp = Readonly<{
	generatedFiles: readonly GeneratedFile[]
}>

const repoRoot = process.cwd()
const caip2NetworkKeys = new Set(networks.flatMap((network) => (
	'caip2' in network ? [`${network.caip2.namespace}:${network.caip2.reference}`] : []
)))
const networkSlugs = new Set(networks.map((network) => network.slug))
const generatedOutputRoot = path.resolve(process.env.APP_GENERATED_OUTPUT_ROOT ?? repoRoot)
const routeRoot = path.join(generatedOutputRoot, 'src/routes')
const protectedRouteFiles = new Set([
	'src/routes/+layout.svelte',
	'src/routes/+layout.ts',
	'src/routes/+page.svelte',
	'src/routes/+page.ts',
])
const protectedSchemaFiles = new Set([
	'src/schema/$schema.ts',
])
const unique = <_Value>(values: readonly _Value[]) => [...new Set(values)]
// Adjacent groups preserve APP.ts ordering while allowing one generated owner
// to render consecutive entries that share it.
const groupAdjacentBy = <_Value>(
	values: readonly _Value[],
	keyForValue: (value: _Value, index: number) => string
) => values.reduce<{
	key: string
	values: _Value[]
}[]>((groups, value, index) => {
	const key = keyForValue(value, index)
	const previousGroup = groups.at(-1)
	if (previousGroup?.key === key)
		previousGroup.values.push(value)
	else
		groups.push({
			key,
			values: [value],
		})

	return groups
}, []).map(({ values }) => values)

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

const commaTerminatedExpressionLines = (expression: string, level = 1) => {
	const expressionLines = indent(expression, level).split('\n')
	expressionLines[expressionLines.length - 1] += ','
	return expressionLines
}

const reindentLines = (source: string[], level: number) => {
	const sourceLines = source.flatMap((line) => line.split('\n'))
	const indentedLines = sourceLines.filter((line) => line.trim() !== '')
	const indentLevel = indentedLines.length === 0 ? 0 : Math.min(...indentedLines
		.map((line) => line.match(/^\t*/)?.[0].length ?? 0)
	)

	return sourceLines.map((line) => line.trim() === '' ? '' : `${'\t'.repeat(level)}${line.slice(indentLevel)}`)
}

const renderSvelteSnippet = (level: number, declaration: string, body: string[]) => [
	`${'\t'.repeat(level)}{#snippet ${declaration}}`,
	...reindentLines(body, level + 1),
	`${'\t'.repeat(level)}{/snippet}`,
]

const trimBlankLineEdges = (source: string[]) => source.slice(
	source.findIndex((line) => line.trim() !== ''),
	source.findLastIndex((line) => line.trim() !== '') + 1
)

const lines = (source: string) => source.split('\n')

const renderRawLines = (source: string, level: number) => lines(source)
	.map((line) => line.trim() === '' ? '' : `${'\t'.repeat(level)}${line}`)

// Raw snippets opt into generator-owned bindings with collision-proof tokens.
// Substitution expands declared metadata and never interprets the markup.
const renderEntityRawLines = (
	source: string,
	level: number,
	resolvedEntityExpression: string
) => {
	const token = rawSnippetReference.resolvedEntity.source
	const attribute = `resource={${token}}`
	return lines(source).flatMap((line) => {
		if (!line.includes(token))
			return [line]

		const lineLevel = line.match(/^\t*/)?.[0].length ?? 0
		if (line.trim() === attribute)
			return lines(renderSvelteAttribute(
				lineLevel,
				'resource',
				resolvedEntityExpression
			))
		if (line.trim() === `<ResourceBoundary ${attribute}>`) {
			if (!resolvedEntityExpression.includes('\n'))
				return [
					`${'\t'.repeat(lineLevel)}<ResourceBoundary resource={${resolvedEntityExpression}}>`,
				]

			return [
				`${'\t'.repeat(lineLevel)}<ResourceBoundary`,
				...lines(renderSvelteAttribute(
					lineLevel + 1,
					'resource',
					resolvedEntityExpression
				)),
				`${'\t'.repeat(lineLevel)}>`,
			]
		}

		throw new Error('Resolved-entity snippet reference must own a ResourceBoundary resource attribute')
	}).map((line) => line.trim() === '' ? '' : `${'\t'.repeat(level)}${line}`)
}

const renderSvelteAttribute = (level: number, name: string, expression: string) => {
	const attributeIndent = '\t'.repeat(level)
	if (!expression.includes('\n'))
		return `${attributeIndent}${name}={${expression}}`

	const [firstExpressionLine, ...continuationExpressionLines] = typeScriptExpressionWithoutOuterParentheses(expression).split('\n')
	return [
		`${attributeIndent}${name}={`,
		`${'\t'.repeat(level + 1)}${firstExpressionLine}`,
		...reindentLines(continuationExpressionLines, level + 1),
		`${attributeIndent}}`,
	].join('\n')
}

const renderResourceBoundaryOpen = (
	level: number,
	resourceExpression: string
) => (
	resourceExpression.includes('\n') ? [
		`${'\t'.repeat(level)}<ResourceBoundary`,
		renderSvelteAttribute(level + 1, 'resource', resourceExpression),
		`${'\t'.repeat(level)}>`,
	] : [
		`${'\t'.repeat(level)}<ResourceBoundary resource={${resourceExpression}}>`,
	]
)

const renderSvelteConst = (level: number, name: string, expression: string) => {
	const constIndent = '\t'.repeat(level)
	const renderedExpression = typeScriptExpressionWithoutOuterParentheses(expression)
	if (!renderedExpression.includes('\n'))
		return `${constIndent}{@const ${name} = ${renderedExpression}}`

	const [firstLine, ...restLines] = renderedExpression.split('\n')
	const indentedRestLines = reindentLines(restLines, level + 1)
	indentedRestLines[indentedRestLines.length - 1] += '}'

	return [
		`${constIndent}{@const ${name} = ${firstLine}`,
		...indentedRestLines,
	].join('\n')
}

// Parse generated expression fragments through TypeScript itself so wrapper
// removal never depends on text slicing.
const parseTypeScriptExpression = (expression: string) => {
	const sourceFile = ts.createSourceFile(
		'generated-expression.ts',
		`const value = ${expression}`,
		ts.ScriptTarget.Latest,
		true,
		ts.ScriptKind.TS
	)
	const statement = sourceFile.statements[0]
	const initializer = ts.isVariableStatement(statement) ?
		statement.declarationList.declarations[0]?.initializer
	:
		undefined
	if (initializer == null || sourceFile.parseDiagnostics.length > 0)
		throw new Error(`Cannot parse TypeScript expression: ${expression}`)

	return {
		sourceFile,
		expression: initializer,
	}
}

const unwrapParenthesizedExpression = (expression: ts.Expression) => (
	ts.isParenthesizedExpression(expression) ?
		unwrapParenthesizedExpression(expression.expression)
	:
	expression
)

const typeScriptExpressionWithoutOuterParentheses = (expression: string) => {
	const parsed = parseTypeScriptExpression(expression)
	return unwrapParenthesizedExpression(parsed.expression).getText(parsed.sourceFile)
}

const isTypeScriptBindingReference = (
	node: ts.Node,
	binding: string
) => (
	ts.isIdentifier(node)
	&& node.text === binding
	&& !(ts.isPropertyAccessExpression(node.parent) && node.parent.name === node)
	&& !(ts.isPropertyAssignment(node.parent) && node.parent.name === node)
)

const typeScriptNodeReferenceCount = (
	root: ts.Node,
	binding: string
) => {
	let referenceCount = 0
	const visit = (node: ts.Node) => {
		if (isTypeScriptBindingReference(node, binding))
			referenceCount += 1
		else
			ts.forEachChild(node, visit)
	}
	visit(root)
	return referenceCount
}

const typeScriptExpressionReferenceCount = (
	source: string,
	binding: string
) => {
	if (source.trim() === '')
		return 0

	return typeScriptNodeReferenceCount(parseTypeScriptExpression(source).expression, binding)
}

const typeScriptExpressionReferencesBinding = (
	source: string,
	binding: string
) => typeScriptExpressionReferenceCount(source, binding) > 0

// Authored route scripts are complete TypeScript programs, so references are
// discovered from the TypeScript tree without interpreting strings or comments.
const typeScriptSourceReferencesBinding = (
	source: string,
	binding: string
) => {
	if (source.trim() === '')
		return false

	const sourceFile = ts.createSourceFile(
		'authored-script.ts',
		source,
		ts.ScriptTarget.Latest,
		true,
		ts.ScriptKind.TS
	)
	if (sourceFile.parseDiagnostics.length > 0)
		throw new Error('Cannot parse authored TypeScript script')

	return typeScriptNodeReferenceCount(sourceFile, binding) > 0
}

const replaceTypeScriptIdentifier = (
	expression: string,
	identifier: string,
	replacement: string
) => {
	const parsed = parseTypeScriptExpression(expression)
	const parsedReplacement = parseTypeScriptExpression(replacement).expression
	const replacementExpression = unwrapParenthesizedExpression(parsedReplacement)

	const transformed = ts.transform(parsed.expression, [
		(context) => {
			const visit = (node: ts.Node): ts.Node => {
				if (isTypeScriptBindingReference(node, identifier))
					return replacementExpression

				return ts.visitEachChild(node, visit, context)
			}

			return (root) => {
				const result = visit(root)
				if (!ts.isExpression(result))
					throw new Error(`TypeScript expression transform produced ${ts.SyntaxKind[result.kind]}`)

				return result
			}
		},
	])
	try {
		const result = transformed.transformed[0]
		if (result == null)
			throw new Error(`TypeScript expression transform produced no output: ${expression}`)

		return ts.createPrinter().printNode(ts.EmitHint.Expression, result, parsed.sourceFile)
	} finally {
		transformed.dispose()
	}
}

// Literal expressions become output text; only genuinely dynamic expressions
// survive as Svelte mustaches or template interpolations.
const typeScriptStringValue = (expression: string) => {
	const parsedExpression = parseTypeScriptExpression(expression).expression
	const value = unwrapParenthesizedExpression(parsedExpression)

	return ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value) ?
		value.text
	:
		undefined
}

// Template interpolation already stringifies its value. Remove only a
// parser-proven outer coercion; nested lookup coercions remain meaningful.
const templateInterpolationExpression = (expression: string) => {
	const {
		sourceFile,
		expression: parsedExpression,
	} = parseTypeScriptExpression(expression)
	if (
		ts.isCallExpression(parsedExpression)
		&& ts.isIdentifier(parsedExpression.expression)
		&& parsedExpression.expression.text === 'String'
		&& parsedExpression.arguments.length === 1
	)
		return parsedExpression.arguments[0]?.getText(sourceFile) ?? expression
	if (
		ts.isCallExpression(parsedExpression)
		&& ts.isIdentifier(parsedExpression.expression)
		&& parsedExpression.expression.text === 'encodeURIComponent'
		&& parsedExpression.arguments.length === 1
		&& ts.isCallExpression(parsedExpression.arguments[0])
		&& ts.isIdentifier(parsedExpression.arguments[0].expression)
		&& parsedExpression.arguments[0].expression.text === 'String'
		&& parsedExpression.arguments[0].arguments.length === 1
	)
		return `encodeURIComponent(${parsedExpression.arguments[0].arguments[0]?.getText(sourceFile) ?? expression})`

	return expression
}

const renderSvelteTextOrExpression = (level: number, expression: string) => {
	const literalValue = typeScriptStringValue(expression)
	if (literalValue != null)
		return `${'\t'.repeat(level)}${svelteText(literalValue)}`

	const renderedExpression = typeScriptExpressionWithoutOuterParentheses(expression)
	if (!renderedExpression.includes('\n'))
		return `${'\t'.repeat(level)}{${renderedExpression}}`

	return [
		`${'\t'.repeat(level)}{`,
		...reindentLines(renderedExpression.split('\n'), level + 1),
		`${'\t'.repeat(level)}}`,
	].join('\n')
}

// Output primitives: all generated text passes through render.ts so indentation,
// imports, and file endings have one deterministic implementation.
const tsFile = (relativePath: string, plan: TypeScriptFilePlan): GeneratedFile => ({
	path: relativePath,
	kind: 'ts',
	ast: plan,
})

const svelteFile = (relativePath: string, plan: SvelteFilePlan): GeneratedFile => ({
	path: relativePath,
	kind: 'svelte',
	ast: plan,
})

// Import-dependent generation reads the file plan or its TypeScript syntax tree;
// it never renders a file and regexes semantic facts back out of the text.
const typeScriptImportPaths = (source: readonly string[]) => ts.createSourceFile(
	'generated-script.ts',
	source.join('\n'),
	ts.ScriptTarget.Latest,
	false,
	ts.ScriptKind.TS
).statements.flatMap((statement) => (
	ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier) ?
		[statement.moduleSpecifier.text]
	:
		[]
))

const pascal = (value: string) => value
	.replace(/^_+/, '')
	.split(/[_\-\s]+|(?=[A-Z])/)
	.filter(Boolean)
	.map((part) => `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}`)
	.join('')

const camel = (value: string) => pascal(value)
	.replace(/^[A-Z]+(?=[A-Z][a-z]|\d|$)/, (acronym) => acronym.toLowerCase())
	.replace(/^[A-Z]/, (letter) => letter.toLowerCase())

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

const generatedIdentifier = (name: string) => localIdentifier(name.replaceAll(/[^A-Za-z0-9_-]+/g, '-'))

const singularComponentName = (entityType: string) => `${entityType}View`

const pluralComponentName = (entity: Entity) => {
	if (entityPluralView(entity)?.component == null)
		throw new Error(`${entity.entityType} is missing pluralView.component`)

	return entityPluralView(entity).component
}

const isDefaultPluralViewComponent = (
	indexes: GenerationIndexes,
	entityType: string,
	component: string
) => (
	indexes.defaultPluralViewEntityTypes?.has(entityType) === true
	&& component === pluralComponentName(indexes.entityByType[entityType])
)

const compileSectionComponentPlan = (
	indexes: GenerationIndexes,
	fieldDefinition: EntityField | undefined,
	component: string | undefined
) => ({
	component,
	fieldDefinition,
	rendersDefaultEntitiesList: (
		component != null
		&& fieldDefinition?.type === EntityFieldType.EntitiesReference
		&& fieldDefinition.entityType != null
		&& isDefaultPluralViewComponent(indexes, fieldDefinition.entityType, component)
	),
})

const componentIdentifier = (componentName: string) => componentName.replace(/^_+/, '')

const schemaModulePath = (entityType: string) => `$/schema/${entityType}.ts`
const schemaEnumModulePath = (enumName: string) => `$/schema/${enumName}.ts`

const viewModulePath = (componentName: string) => `$/views/${componentName}.svelte`

const pluralViewName = (entity: Entity) => componentIdentifier(pluralComponentName(entity)).replace(/View$/, '')

const singularComponentIdentifier = (entityType: string) => componentIdentifier(singularComponentName(entityType))

const viewComponentAcceptsPrefetched = (
	indexes: GenerationIndexes,
	entityType: string,
	component: string
) => (
	indexes.prefetchedSingularViewEntityTypes == null
	|| componentIdentifier(component) !== singularComponentIdentifier(entityType)
	|| indexes.prefetchedSingularViewEntityTypes.has(entityType)
)

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
const fieldPathsPresenceExpressions = (
	base: string,
	fieldPaths: readonly string[][],
	basePresent = false
) => (
	basePresent ?
		unique(fieldPaths.flatMap((fieldPath) => fieldPath.map((_part, index) => (
			`${fieldExpression(base, fieldPath.slice(0, index + 1).join('.'))} != null`
		))))
	:
	unique(fieldPaths.flatMap((fieldPath) => [
		...fieldPath.map((part, index) => {
			const parent = fieldExpression(base, fieldPath.slice(0, index).join('.'))
			return `${parent} != null && ${emitTypeScript(part)} in ${parent}`
		}),
		`${fieldExpression(base, fieldPath.join('.'))} != null`,
	]))
)

const typeScriptExpressionProducesString = (expression: ts.Expression): boolean => {
	if (ts.isParenthesizedExpression(expression))
		return typeScriptExpressionProducesString(expression.expression)
	if (
		ts.isStringLiteral(expression)
		|| ts.isNoSubstitutionTemplateLiteral(expression)
		|| ts.isTemplateExpression(expression)
	)
		return true
	if (ts.isBinaryExpression(expression) && expression.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken)
		return typeScriptExpressionProducesString(expression.right)
	if (ts.isConditionalExpression(expression))
		return (
			typeScriptExpressionProducesString(expression.whenTrue)
			&& typeScriptExpressionProducesString(expression.whenFalse)
		)
	if (!ts.isCallExpression(expression))
		return false
	if (ts.isIdentifier(expression.expression))
		return (
			expression.expression.text === 'String'
			|| expression.expression.text === 'encodeURIComponent'
		)

	return (
		ts.isPropertyAccessExpression(expression.expression)
		&& expression.expression.name.text === 'join'
	)
}

const typeScriptExpressionIsDefinitelyTruthy = (expression: ts.Expression): boolean => {
	const value = unwrapParenthesizedExpression(expression)
	if (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value))
		return value.text !== ''
	if (ts.isTemplateExpression(value))
		return value.head.text !== ''

	return (
		ts.isBinaryExpression(value)
		&& (
			value.operatorToken.kind === ts.SyntaxKind.BarBarToken
			&& typeScriptExpressionIsDefinitelyTruthy(value.right)
			|| value.operatorToken.kind === ts.SyntaxKind.PlusToken
			&& typeScriptExpressionIsDefinitelyTruthy(value.left)
		)
	)
}

const expressionProducesString = (expression: string) => {
	const parsedExpression = parseTypeScriptExpression(expression).expression
	return typeScriptExpressionProducesString(parsedExpression)
}

const valueTypeProducesString = (
	valueType: ValueTypeType | undefined,
	valueTypeDefinition: ValueType | undefined
) => (
	valueType != null
	&& (
		'primitive' in valueType
			&& valueType.primitive === 'string'
		|| 'unit' in valueType
			&& typeof valueType.unit === 'string'
		|| 'enum' in valueType
		|| 'raw' in valueType
			&& valueTypeDefinition != null
			&& (
				valueTypeDefinition.routeParam?.decode == null
				|| valueTypeDefinition.routeParam.decode === _ExpressionDecode.DecodeURIComponent
			)
	)
)

const appExpressionProducesString = (
	expression: _Expression,
	context: ExpressionContext
) => {
	if (typeof expression === 'string' || 'raw' in expression)
		return false
	if (expression.kind === 'literal')
		return typeof expression.value === 'string'
	if (expression.kind === 'template')
		return true
	if (expression.kind === 'catalogIndex')
		return true
	if (expression.kind === 'case')
		return (
			expression.cases.every((item) => appExpressionProducesString(item.value, context))
			&& appExpressionProducesString(expression.default, context)
		)
	if (expression.kind === 'call')
		return (
			context.indexes != null
			&& Object.values(context.indexes.valueTypeById).some((valueType) => (
				valueType.routeParam?.encode?.from === expression.from
				&& valueType.routeParam.encode.name === expression.name
			))
		)
	if (expression.kind !== 'field' && expression.kind !== 'property')
		return false
	if (context.entity == null || context.indexes == null)
		return false

	const fieldPath = expressionFieldPaths(expression)
	if (fieldPath.length !== 1)
		return false

	let entity: Entity | undefined = context.entity
	let valueType: ValueTypeType | undefined
	let valueTypeDefinition: ValueType | undefined
	for (const part of fieldPath[0]) {
		if (entity != null) {
			const field = entity.fields.find((candidate) => candidate.name === part)
			if (field == null)
				return false

			entity = field.entityType == null ? undefined : context.indexes.entityByType[field.entityType]
			valueTypeDefinition = field.valueType == null ? undefined : context.indexes.valueTypeById[field.valueType]
			valueType = valueTypeDefinition?.type ?? field.primitiveType
			continue
		}

		if (valueType == null || !('object' in valueType))
			return false

		valueType = valueType.object.find((field) => field.name === part)?.type
		valueTypeDefinition = undefined
	}

	return valueTypeProducesString(valueType, valueTypeDefinition)
}

const routeParamStringExpression = (
	expression: string,
	decode?: _ExpressionDecode,
	knownPresent = false
) => (
	decode === _ExpressionDecode.DecodeURIComponent ?
		`encodeURIComponent(${expressionProducesString(expression) ? expression : `String(${expression}${knownPresent ? '' : ' ?? \'\''})`})`
	: expressionProducesString(expression) ?
		expression
	:
		`String(${expression}${knownPresent ? '' : ' ?? \'\''})`
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

const carouselFieldProjectionAccess = (
	field: FieldReference | undefined,
	projectionPath?: readonly [string, ...string[]]
) => {
	if (!isProjectionFieldReference(field ?? ''))
		return {
			fieldBase: 'selection',
			fieldReference: field,
		}

	if (projectionPath == null)
		throw new Error(`Projection carousel field ${field.join('.')} has no owning facet`)

	const fieldFacetPath = field.slice(0, -1)
	if (
		fieldFacetPath.length === projectionPath.length
		&& fieldFacetPath.every((facetName, index) => projectionPath[index] === facetName)
	) return {
		fieldBase: 'projection',
		fieldReference: field.at(-1) ?? '',
	}

	if (
		fieldFacetPath.length < projectionPath.length
		&& fieldFacetPath.every((facetName, index) => projectionPath[index] === facetName)
	) return {
		fieldBase: 'selection',
		fieldReference: field,
	}

	throw new Error(`Projection carousel field ${field.join('.')} is not owned by ${projectionPath.join('.')}`)
}

const projectionFacetConditions = (
	entity: Entity,
	indexes: GenerationIndexes,
	projectionPath: readonly string[]
) => {
	const facetKey = projectionPathKey(entity.entityType, projectionPath)
	const facetCondition = indexes.entityFacetByPath[facetKey]?.facet.condition
	return [
		...(indexes.facetAncestorConditionsByPath[facetKey] ?? []),
		...(facetCondition == null ? [] : [facetCondition]),
	]
}

const projectionViewConditions = (
	entity: Entity,
	indexes: GenerationIndexes,
	projectionPath: readonly string[]
) => projectionFacetConditions(entity, indexes, projectionPath)
	.flatMap(viewConditionFromFacetCondition)

const renderProjectionPathBoundaryLines = (
	entity: Entity,
	indexes: GenerationIndexes,
	projectionPath: readonly string[],
	resourceExpression: string,
	projectionName: string,
	renderContent: () => string[],
	level: number,
	parentProjectionPath: readonly string[] = []
) => {
	const boundaryLines = [
		`${'\t'.repeat(level)}<ProjectionBoundary`,
		renderSvelteAttribute(level + 1, 'resource', resourceExpression),
		`${'\t'.repeat(level)}>`,
		...renderSvelteSnippet(level + 1, `Applicable(${projectionName})`, renderContent()),
		`${'\t'.repeat(level)}</ProjectionBoundary>`,
	]
	const parentConditions = parentProjectionPath.length === 0 ?
		[]
		:
		projectionViewConditions(
			entity,
			indexes,
			parentProjectionPath
		)
	const conditions = projectionViewConditions(entity, indexes, projectionPath)
		.slice(parentConditions.length)
	if (conditions.length === 0 || !conditions.every(({ field }) => entitySelectorOwnsField(entity, field))) {
		if (conditions.length === 0 || entitySingularView(entity)?.pending == null)
			return boundaryLines

		return [
			`${'\t'.repeat(level)}{#if ${conditionExpression(conditions, pendingEntityExpression, entity, indexes, true, true)}}`,
			...boundaryLines.map((line) => indent(line)),
			`${'\t'.repeat(level)}{/if}`,
		]
	}

	return [
		`${'\t'.repeat(level)}{#if ${conditionExpression(conditions, 'selection.entitySelector', entity, indexes)}}`,
		...boundaryLines.map((line) => indent(line)),
		`${'\t'.repeat(level)}{/if}`,
	]
}

const renderProjectionBoundaryLines = (
	entity: Entity,
	indexes: GenerationIndexes,
	field: FieldReference,
	renderContent: (
		fieldResourceBase: string,
		fieldReference: FieldReference
	) => string[],
	level: number
) => {
	const content = renderContent('selection', field)
	if (!isProjectionFieldReference(field))
		return content

	return renderProjectionPathBoundaryLines(
		entity,
		indexes,
		field.slice(0, -1),
		fieldResourceBaseExpression('selection', field),
		'projection',
		() => renderContent('projection', fieldNameForReference(field)),
		level
	)
}

const renderProjectionPathTree = <_Value>(
	entity: Entity,
	indexes: GenerationIndexes,
	values: readonly _Value[],
	projectionPathForValue: (value: _Value) => readonly string[],
	renderValue: (value: _Value) => string[],
	level: number
) => {
	const renderProjectionLevel = (
		levelValues: readonly _Value[],
		parentProjectionPath: readonly string[]
	): string[] => groupAdjacentBy(levelValues.map((value, index) => {
		const projectionPath = projectionPathForValue(value)
		return {
			childFacetName: projectionPath.length > parentProjectionPath.length ?
				projectionPath[parentProjectionPath.length]
				:
				undefined,
			index,
			value,
		}
	}), ({
		childFacetName,
		index,
	}) => childFacetName ?? `value:${index}`).flatMap((group) => {
		const childFacetName = group[0]?.childFacetName
		if (childFacetName == null)
			return group.flatMap(({ value }) => renderValue(value))

		const projectionPath = [
			...parentProjectionPath,
			childFacetName,
		]
		return renderProjectionPathBoundaryLines(
			entity,
			indexes,
			projectionPath,
			`${parentProjectionPath.length === 0 ? 'selection' : 'projection'}${propertyAccess(childFacetName)}`,
			'projection',
			() => renderProjectionLevel(
				group.map(({ value }) => value),
				projectionPath
			),
			level,
			parentProjectionPath
		)
	})

	return renderProjectionLevel(values, [])
}

const renderProjectionOwnedGroups = <_Value>(
	entity: Entity,
	indexes: GenerationIndexes,
	values: readonly _Value[],
	fieldReferencesForValue: (value: _Value) => readonly FieldReference[],
	renderValue: (
		value: _Value,
		projectionFieldResourceBase?: string
	) => string[],
	level: number,
	minimumGroupSize = 1
) => {
	const projectedGroups = groupAdjacentBy(values.map((value) => {
		const fieldReferences = fieldReferencesForValue(value)
		const firstFieldReference = fieldReferences[0]
		return {
			projectionFieldReference: (
				firstFieldReference != null
				&& isProjectionFieldReference(firstFieldReference)
				&& fieldReferences.every((fieldReference) => (
					isProjectionFieldReference(fieldReference)
					&& fieldReference.slice(0, -1).join('.') === firstFieldReference.slice(0, -1).join('.')
				)) ?
					firstFieldReference
				:
					undefined
			),
			value,
		}
	}),
	({ projectionFieldReference }, index) => (
		projectionFieldReference == null ?
				`value:${index}`
			:
				projectionFieldReference.slice(0, -1).join('.')
		)
	).map((group) => {
		const projectionFieldReference = group[0]?.projectionFieldReference
		const render = (fieldResourceBase?: string) => group.flatMap(({ value }, index) => [
			...(index === 0 ? [] : ['']),
			...renderValue(value, fieldResourceBase),
		])

		return {
			projectionFieldReference,
			render,
			sharedContentKey: projectionFieldReference == null || group.length < minimumGroupSize ?
				undefined
			:
				render('projection').join('\n'),
		}
	})

	return groupAdjacentBy(projectedGroups, ({ sharedContentKey }, index) => sharedContentKey ?? `group:${index}`).flatMap((matchingGroups) => {
		const projectionFieldReferences = matchingGroups.flatMap(({ projectionFieldReference }) => projectionFieldReference == null ? [] : [projectionFieldReference])
		if (projectionFieldReferences.length !== matchingGroups.length)
			return matchingGroups.flatMap(({ render }) => render())
		if (matchingGroups.length === 1)
			return renderProjectionBoundaryLines(entity, indexes, projectionFieldReferences[0]!, () => matchingGroups[0]!.render('projection'), level)

		const equalityConditions = projectionFieldReferences.map((fieldReference) => {
			const conditions = projectionViewConditions(entity, indexes, fieldReference.slice(0, -1))
			return conditions.length === 1 && conditions[0]?.equals != null ? conditions[0] : undefined
		})
		if (
			equalityConditions.some((condition) => condition == null || !entitySelectorOwnsField(entity, condition.field))
			|| new Set(equalityConditions.map((condition) => condition?.field)).size !== 1
			|| new Set(equalityConditions.map((condition) => condition?.equals)).size !== equalityConditions.length
		)
			return matchingGroups.flatMap(({ projectionFieldReference, render }) => renderProjectionBoundaryLines(entity, indexes, projectionFieldReference!, () => render('projection'), level))

		return [
			`${'\t'.repeat(level)}<ProjectionBoundary`,
			renderSvelteAttribute(level + 1, 'resource', renderConditionalExpression(projectionFieldReferences.slice(0, -1).map((fieldReference, index) => ({
				condition: conditionExpression([equalityConditions[index]!], 'selection.entitySelector', entity, indexes),
				value: fieldResourceBaseExpression('selection', fieldReference),
			})), fieldResourceBaseExpression('selection', projectionFieldReferences.at(-1)!))),
			`${'\t'.repeat(level)}>`,
			...renderSvelteSnippet(level + 1, 'Applicable(projection)', matchingGroups[0]!.render('projection')),
			`${'\t'.repeat(level)}</ProjectionBoundary>`,
		]
	})
}

const fieldResourceExpression = (base: string, field: FieldReference, query?: string) => {
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

	return `${fieldResourceBaseExpression(base, field)}
	${propertyAccess(fieldNameForReference(field))}(${indent(query, 1).trimStart()})`
}

const routeId = (routePath: string) => routePath.startsWith('/') ? routePath : `/${routePath}`

const publicRouteId = (routePath: string) => `/${routePath
	.split('/')
	.filter((segment) => segment !== '' && !/^\(.+\)$/.test(segment))
	.map((segment) => segment.replaceAll(/\[((?:\.\.\.)?[^=\]]+)=[^\]]+\]/g, '[$1]'))
	.join('/')}`

// E2E probe atoms identify compiled route alternatives; they are derived test
// coordinates, not APP authoring data.
const routeProbeMetadata = (
	routePath: string,
	mappingId: string,
	routeParams: readonly string[],
	count: number,
	variantId?: string,
	inheritedParams?: Readonly<Record<string, string>>
) => ({
	...(variantId == null ? {} : { probeCaseId: variantId }),
	probeAtoms: Array.from({ length: count }, (_, index) => routeParams.map((param) => (
		inheritedParams?.[param] ?? `${publicRouteId(routePath)}:${mappingId}${variantId == null ? '' : `.${variantId}`}.${index + 1}.${param}`
	))).flat(),
})

type ExpressionContext = {
	params?: string
	fields?: string
	fieldExpressionByName?: Readonly<Record<string, string>>
	pageSelector?: string
	entity?: Entity
	indexes?: GenerationIndexes
}

const routeParamNames = (path: string) => unique(
	[...path.matchAll(/\[(?:\.\.\.)?([^=\]]+)(?:=[^\]]+)?\]/g)]
		.map((match) => match[1])
		.filter((param): param is string => param != null)
)

const renderResolveExpression = (path: string, params: readonly [string, string][] = []) => {
	if (params.length === 0)
		return `resolve(${emitTypeScript(routeId(path))})`

	return [
		'resolve(',
		`\t${emitTypeScript(routeId(path))},`,
		indent(emitObject(params.toSorted(([leftParam], [rightParam]) => (
			routeParamNames(path).indexOf(leftParam) - routeParamNames(path).indexOf(rightParam)
		)).map(([param, value]) => [
			param,
			value,
		]))),
		')',
	].join('\n')
}

const renderRouteParamExpression = (
	expression: _Expression,
	context: ExpressionContext,
	decode?: _ExpressionDecode,
	knownPresent = false
): string => {
	if (typeof expression === 'string')
		return expression
	if ('raw' in expression)
		return expression.raw
	if (expression.kind === 'field' || expression.kind === 'property') {
		const renderedExpression = renderExpression(expression, {
			...context,
			fields: context.fields ?? 'selector',
		})
		if (appExpressionProducesString(expression, context))
			return decode === _ExpressionDecode.DecodeURIComponent ?
				`encodeURIComponent(${renderedExpression})`
			:
				renderedExpression

		return routeParamStringExpression(
			renderedExpression,
			decode,
			knownPresent
		)
	}

	if (expression.kind === 'template')
		return `\`${expression.parts.map((part) => (
			typeof part === 'string' ?
				templateStringText(part)
			:
				`\${${templateInterpolationExpression(renderRouteParamExpression(part, context, decode, knownPresent))}}`
		)).join('')}\``

	if (expression.kind === 'case') {
		const routeValueExpression = renderExpression(expression, context, 'omit')
		if (appExpressionProducesString(expression, context))
			return decode === _ExpressionDecode.DecodeURIComponent ?
				`encodeURIComponent(${routeValueExpression})`
			:
				routeValueExpression

		return routeValueExpression.includes('\n') ?
			[
				'String(',
				indent(routeValueExpression),
				')',
			].join('\n')
		:
			`String(${routeValueExpression})`
	}

	const looseExpression = renderExpression(expression, context)
	if (appExpressionProducesString(expression, context))
		return decode === _ExpressionDecode.DecodeURIComponent ?
			`encodeURIComponent(${looseExpression})`
		:
			looseExpression

	return routeParamStringExpression(looseExpression, decode, knownPresent)
}

const renderPresentRouteParamExpression = (
	expression: _Expression,
	context: ExpressionContext,
	decode?: _ExpressionDecode
) => (
	renderRouteParamExpression(
		expression,
		context,
		decode,
		true
	)
)

const routeFileName = (kind: RouteFile['kind']) => {
	if (kind === RouteFileKind.Page)
		return '+page.svelte'
	if (kind === RouteFileKind.PageModule)
		return '+page.ts'
	if (kind === RouteFileKind.Layout)
		return '+layout.svelte'

	throw new Error(`Unsupported route file kind: ${kind}`)
}

const emitFacetCondition = (condition: _AppFacetCondition): string => (
	'all' in condition ?
		emitObject([
			['all', emitArray(condition.all.map(emitFacetCondition))],
		])
	: 'is' in condition ?
		emitObject([
			['path', emitArray(condition.path.map((part) => typeof part === 'string' ? emitTypeScript(part) : String(part)))],
			['is', emitTypeScript(condition.is)],
		])
	: 'isOneOf' in condition ?
		emitObject([
			['path', emitArray(condition.path.map((part) => typeof part === 'string' ? emitTypeScript(part) : String(part)))],
			['isOneOf', emitArray(condition.isOneOf.map(emitTypeScript))],
		])
	:
		emitObject([
			['path', emitArray(condition.path.map((part) => typeof part === 'string' ? emitTypeScript(part) : String(part)))],
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

const fieldCardinalityIsMany = (field: EntityField) => (
	field.cardinality === EntityFieldCardinality.Many
	|| field.cardinality === EntityFieldCardinality.ZeroOrMany
)

const fieldIsManyPrimitive = (field: EntityField) => (
	field.type === EntityFieldType.Primitive
	&& (
		fieldCardinalityIsMany(field)
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

const emitStringEnum = (
	name: string,
	members: readonly string[],
	exported = true
) => [
	`${exported ? 'export ' : ''}enum ${name} {`,
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

const emitArray = (values: readonly string[]) => emitTypeScript({
	kind: 'array',
	values: values.map((source) => ({
		kind: 'raw',
		source,
	})),
	multiline: values.length > 0,
})

const emitObject = (entries: readonly (
	| readonly [string, string | undefined]
	| {
		spread: string
	}
)[]) => emitTypeScript({
	kind: 'object',
	entries: entries.map((entry) => (
		'spread' in entry ?
			{
				kind: 'spread',
				value: {
					kind: 'raw',
					source: entry.spread,
				},
			}
		:
			[
				entry[0],
				entry[1] == null ? undefined : {
					kind: 'raw',
					source: entry[1],
				},
			]
	)),
	multiline: entries.some((entry) => 'spread' in entry || entry[1] !== undefined),
})

const renderQueryFields = (
	fields: readonly FieldReference[],
	openFields: readonly FieldReference[] | undefined,
	openExpression: string | undefined,
	emitEmptyFields = false
) => {
	const renderFieldSelection = (references: readonly FieldReference[]) => {
		const root = new Map<string, Map<string, unknown> | true>()
		for (const reference of references) {
			const path = isProjectionFieldReference(reference) ? reference : reference.split('.')
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

		const renderEntries = (entries: Map<string, Map<string, unknown> | true>) => emitObject([...entries].map(([key, value]) => [
			key,
			value === true ? 'true' : emitObject([['fields', renderEntries(value)]]),
		]))

		return renderEntries(root)
	}
	const fieldEntries = renderFieldSelection(fields)
	if (openExpression == null || openFields == null || openFields.length === 0)
		return fields.length === 0 && !emitEmptyFields ? undefined : fieldEntries

	return [
		'{',
		indent(`...${fieldEntries},`),
		indent(`...(${openExpression} && ${renderFieldSelection(openFields)}),`),
		'}',
	].join('\n')
}

const emitImportObject = (imports: readonly _Import[] | undefined): ImportSpec[] => (imports ?? [])
	.map((importSpec) => ({
		from: importSpec.from,
		defaultName: importSpec.default,
		names: importSpec.names,
		typeNames: importSpec.typeNames,
	}))

const emitSourceArray = (sources: readonly string[] | undefined) => {
	if (sources == null)
		return undefined
	for (const source of sources)
		if (source == null)
			throw new Error(`Source selection contains undefined: ${sources.join(', ')}`)

	return emitArray(sources.map((source) => enumAccess('Source', source)))
}

const sourceSelectionKey = (sources: readonly string[]) => sources.join('\0')

const sharedSourceSelectionName = (sources: readonly string[]) => (
	`${generatedIdentifier(sources.join('-and-'))}Sources`
)

const renderNetworkApplicableSourceArray = (
	sources: readonly string[]
) => `networkApplicableSources(${emitSourceArray(sources)}, pendingEntity)`

const renderNetworkSourceApplicabilityDeclarations = (
	sourceSelections: readonly (readonly string[])[]
) => {
	const selectionCounts = Map.groupBy(sourceSelections, sourceSelectionKey)
	const sharedSelections = [...selectionCounts]
		.filter(([, selections]) => selections.length > 1)
		.map(([, [sources]]) => sources)
		.filter((sources) => sources != null)
	const sharedSourceSelectionNames = new Map(sharedSelections.map((sources) => [
		sourceSelectionKey(sources),
		sharedSourceSelectionName(sources),
	]))

	return {
		imports: [{
			from: '$/sources/index.ts',
			names: ['networkApplicableSources'],
		}],
		lines: sharedSelections.flatMap((sources) => [
			`const ${sharedSourceSelectionName(sources)} = $derived(
${indent(renderNetworkApplicableSourceArray(sources), 1)}
)`,
			'',
		]),
		sharedSourceSelectionNames,
	}
}

const renderDispatchedSourceSelectionExpression = (mappings: readonly {
	entityType: string
	selectorName: string
	sourceSelection?: readonly string[] | _SourceSelection
}[]) => {
	const sourceExpressions = mappings.map((mapping) => (
		Array.isArray(mapping.sourceSelection) ? emitSourceArray(mapping.sourceSelection) : undefined
	))
	if (sourceExpressions.some((sources) => sources == null))
		return undefined
	if (unique(sourceExpressions).length === 1)
		return sourceExpressions[0]

	return mappings.reduceRight((alternate, mapping, index) => (
		index === mappings.length - 1 ?
			sourceExpressions[index] ?? 'undefined'
		:
			`data.entityType === EntityType.${mapping.entityType} && data.selectorName === ${emitTypeScript(mapping.selectorName)} ? ${sourceExpressions[index] ?? 'undefined'} : ${alternate}`
	), '')
}

const renderConditionalExpression = (
	cases: readonly {
		condition: string
		value: string
	}[],
	fallback: string
) => (
	cases.every(({ value }) => value === fallback) ?
		fallback
	:
		[
			'(',
			...cases.flatMap(({ condition, value }) => [
				`\t${condition} ?`,
				indent(value, 2),
				'\t:',
			]),
			indent(fallback, 2),
			')',
		].join('\n')
)

const sourceSelectionName = (selection: _SourceSelection) => selection.name ?? 'anonymousSources'

const sourceSelectionFunctionName = (selection: _SourceSelection) => `${sourceSelectionName(selection)}Sources`

const sourceSelectionModulePath = (selection: _SourceSelection) => `$/sources/${sourceSelectionFunctionName(selection)}.ts`

const sourceSelectionConditionFields = (
	selection: _SourceSelection
) => {
	const fields = selection.cases?.[0]?.when.map((condition) => condition.field)
	if (
		fields == null
		|| fields.some((field) => field == null)
		|| selection.cases?.some((item) => (
			item.when.length !== fields.length
			|| item.when.some((condition, index) => condition.field !== fields[index])
		)) === true
	)
		throw new Error(`Field-conditioned source selection ${selection.name} must use the same ordered fields in every case`)

	return fields
}

const renderSourceSelectionExpression = (selection: readonly string[] | _SourceSelection | undefined) => {
	if (selection == null)
		return undefined
	if (Array.isArray(selection))
		return emitSourceArray(selection)
	if (selection.name != null)
		return `${sourceSelectionFunctionName(selection)}({})`

	return emitSourceArray(selection.default)
}

const isFieldConditionedSourceSelection = (
	selection: readonly string[] | _SourceSelection | undefined
): selection is _SourceSelection & { cases: NonNullable<_SourceSelection['cases']> } => (
	selection != null
	&& !Array.isArray(selection)
	&& selection.name != null
	&& selection.cases != null
	&& selection.cases.length > 0
)

const renderFieldConditionedSourceSelectionExpression = (
	selection: readonly string[] | _SourceSelection | undefined,
	entityExpression: string
) => {
	if (!isFieldConditionedSourceSelection(selection))
		return renderSourceSelectionExpression(selection)

	return `${sourceSelectionFunctionName(selection)}(${emitObject(sourceSelectionConditionFields(selection).map((field) => [
		field ?? '',
		fieldExpression(entityExpression, field ?? ''),
	]))})`
}

const fieldSourceOverride = (
	fieldDefinition: EntityField,
	sources: readonly string[] | _SourceSelection | undefined
) => (
	Array.isArray(sources)
	&& fieldDefinition.defaultSources != null
	&& sources.length === fieldDefinition.defaultSources.length
	&& sources.every((source, index) => source === fieldDefinition.defaultSources[index]) ?
		undefined
	:
		sources
)

const fieldQuery = (
	fieldDefinition: EntityField | undefined,
	query: _ViewQuery | undefined
) => fieldDefinition == null || query == null ? query : {
	...query,
	sources: fieldSourceOverride(fieldDefinition, query.sources),
}

const renderQuery = (
	query: _ViewQuery | _ListView['query'] | undefined,
	fields?: readonly FieldReference[],
	sourcesExpression?: string,
	openExpression?: string,
	excludedFields?: ReadonlySet<string>,
	orderEntity?: Entity,
	emitEmptyFields = false
) => {
	const sources = query == null ? undefined : 'sources' in query ? query.sources : undefined
	const openSources = query == null ? undefined : 'openSources' in query ? query.openSources : undefined
	const openFields = query == null ? undefined : 'openFields' in query ? query.openFields : undefined
	const limit = query == null ? undefined : 'limit' in query ? query.limit : undefined
	const queryFields = unique(
		fields ?? (query != null && 'fields' in query ? query.fields ?? [] : [])
	).filter((field) => !excludedFields?.has(fieldNameForReference(field)))

	return emitObject([
		[
			'sources',
			openExpression != null && openSources != null ?
				`${openExpression} ? ${emitSourceArray(openSources)} : ${sourcesExpression ?? renderSourceSelectionExpression(sources) ?? 'undefined'}`
			:
				sourcesExpression ?? renderSourceSelectionExpression(sources),
		],
		[
			'fields',
			renderQueryFields(queryFields, openFields, openExpression, emitEmptyFields),
		],
		[
			'limit',
			typeof limit === 'number' ? String(limit) : limit?.default == null ? undefined : String(limit.default),
		],
		[
			'orderBy',
			query != null && 'orderBy' in query && query.orderBy != null ?
				emitArray(query.orderBy.map((order) => `[({ fieldRow }) => ${
					order.field === 'sourceOrder' ?
						'fieldRow.valueIndex'
					: orderEntity != null && entitySelectorFieldNames(orderEntity).has(order.field) ?
						`fieldRow[EntityMetaKey.Value][EntityMetaKey.Selector]${propertyAccess(order.field)}`
					:
						`fieldRow[EntityMetaKey.Value]${propertyAccess(order.field)}`
				} ?? ${order.direction === 'desc' ? 'Number.NEGATIVE_INFINITY' : 'Number.POSITIVE_INFINITY'}, ${emitTypeScript(order.direction)}]`))
			:
				undefined,
		],
	])
}

type ConditionTerm = {
	expression: string
	// Matching paths make equality's presence implication explicit.
	presencePath?: string
	equalityPath?: string
	// A lone logical expression needs grouping when joined as an OR alternative.
	logical?: true
}

const conditionTerms = (
	condition: {
		field: FieldReference
		equals?: _Literal
		notEquals?: _Literal
		contains?: _Literal
		oneOf?: readonly _Literal[]
	},
	entityExpression: string,
	entity?: Entity,
	indexes?: GenerationIndexes,
	partial = false,
	partialBasePresent = false,
	fieldExpressionByName?: Readonly<Record<string, string>>
): ConditionTerm[] => {
	if (isProjectionFieldReference(condition.field))
		throw new Error(`Projection condition ${condition.field.join('.')} must be rendered inside its ProjectionBoundary`)

	const fieldDefinition = entity == null ? undefined : fieldDefinitionByReference(entity, condition.field, indexes)
	const [fieldName, ...propertyPath] = condition.field.split('.')
	const mappedFieldExpression = fieldExpressionByName?.[fieldName ?? '']
	const valueExpression = fieldExpression(
		mappedFieldExpression ?? entityExpression,
		mappedFieldExpression == null ? condition.field : propertyPath.join('.')
	)
	const conditionValueExpression = (
		fieldDefinition != null && fieldCardinalityIsMany(fieldDefinition) ?
			`${valueExpression}.values`
		:
			valueExpression
	)
	return [
		...(partial ?
			fieldPathsPresenceExpressions(
					entityExpression,
					[(
						'notEquals' in condition
						|| 'contains' in condition ?
							fieldReferenceKey(condition.field).split('.').filter(Boolean)
						:
							fieldReferenceKey(condition.field).split('.').filter(Boolean).slice(0, -1)
					)],
					partialBasePresent
				).map((expression) => ({ expression }))
		:
			[]),
		...(!('equals' in condition) ? [] : [{
			expression: `${conditionValueExpression} === ${emitTypeScript(condition.equals)}`,
			equalityPath: conditionValueExpression,
		}]),
		...(!('notEquals' in condition) ? [] : [{
			expression: `${conditionValueExpression} !== ${emitTypeScript(condition.notEquals)}`,
		}]),
		...(!('contains' in condition) ? [] : [{
			expression: `${conditionValueExpression}.includes(${emitTypeScript(condition.contains)})`,
		}]),
		...(!('oneOf' in condition) ? [] : [{
			expression: `${emitArray(condition.oneOf.map(emitTypeScript))}.includes(${conditionValueExpression})`,
		}]),
	]
}

const conditionExpression = (
	conditions: readonly Parameters<typeof conditionTerms>[0][],
	entityExpression: string,
	entity?: Entity,
	indexes?: GenerationIndexes,
	partial = false,
	partialBasePresent = false,
	fieldExpressionByName?: Readonly<Record<string, string>>
) => unique(conditions.map((condition) => conditionTerms(
	condition,
	entityExpression,
	entity,
	indexes,
	partial,
	partialBasePresent,
	fieldExpressionByName
).map((term) => term.expression).join(' && '))).join(' && ')

const renderConditionedEntityLines = (
	entity: Entity,
	indexes: GenerationIndexes,
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

	const conditionFieldReferences = [...new Map(
		conditions.map((condition) => [fieldReferenceKey(condition.field), condition.field])
	).values()]
	const conditionSources = unique(
		conditionFieldReferences.flatMap((fieldReference) => (
			fieldDefinitionByReference(entity, fieldReference, indexes)?.defaultSources ?? []
		))
	)
	const conditionQuery = renderQuery(
		conditionSources.length === 0 ? undefined : {
			sources: conditionSources,
		},
		conditionFieldReferences
	)

	return [
		`${'\t'.repeat(level)}<ResourceBoundary`,
		renderSvelteAttribute(level + 1, 'resource', `selection(${conditionQuery})`),
		`${'\t'.repeat(level)}>`,
		`${'\t'.repeat(level + 1)}{#snippet children(entity)}`,
		`${'\t'.repeat(level + 2)}{#if ${conditionExpression(conditions, 'entity', entity, indexes)}}`,
		...bodyLines.map((line) => indent(line, 3)),
		`${'\t'.repeat(level + 2)}{/if}`,
		`${'\t'.repeat(level + 1)}{/snippet}`,
		`${'\t'.repeat(level)}</ResourceBoundary>`,
	]
}

const expressionChildren = (expression: _Expression): readonly _Expression[] => {
	if (typeof expression === 'string' || 'raw' in expression)
		return []
	if (expression.kind === 'object')
		return expression.fields.map((field) => field.value)
	if (expression.kind === 'selector')
		return expression.params.flatMap((param) => (
			'value' in param ?
				[
					param.value,
					...(param.hrefValue == null ? [] : [param.hrefValue]),
				]
			:
				[]
		))
	if (expression.kind === 'property')
		return [expression.value]
	if (expression.kind === 'catalogIndex')
		return expression.key == null ? [] : [expression.key]
	if (expression.kind === 'call')
		return expression.args
	if (expression.kind === 'template')
		return expression.parts.filter((part): part is _Expression => typeof part !== 'string')
	if (expression.kind === 'case')
		return [
			expression.value,
			...expression.cases.map((item) => item.value),
			expression.default,
		]

	return []
}

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

	for (const child of expressionChildren(expression))
		expressionImports(child, imports)

	return imports
}

const importSpecsFromMap = (imports: ReadonlyMap<string, ReadonlySet<string>>): ImportSpec[] => (
	[...imports].map(([from, names]) => ({
		from,
		names: [...names],
	}))
)

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

// Groups retain route-candidate identity and specificity while their terms
// retain the atomic logic needed for rendering without reparsing TypeScript.
type HrefConditionGroup = {
	terms: readonly ConditionTerm[]
	parenthesized?: true
}

const hrefConditionGroupExpression = (group: HrefConditionGroup) => {
	const expression = group.terms.map((term) => term.expression).join(' && ')
	return group.parenthesized === true ? `(${expression})` : expression
}

const hrefConditionGroupsExpression = (groups: readonly HrefConditionGroup[]) => (
	groups.map(hrefConditionGroupExpression).join(' && ')
)

const uniqueHrefConditionGroups = (groups: readonly HrefConditionGroup[]) => [...new Map(
	groups.map((group) => [hrefConditionGroupExpression(group), group])
).values()]

const hrefConditionPlan = (groups: readonly HrefConditionGroup[]) => {
	const terms = [...new Map(
		groups.flatMap((group) => group.terms).map((term) => [term.expression, term])
	).values()]
	const applicableTerms = terms.filter((term) => (
		term.presencePath == null
		|| !terms.some((candidate) => candidate.equalityPath === term.presencePath)
	))

	return {
		expression: applicableTerms.length <= 1 ?
			applicableTerms[0]?.expression ?? 'true'
		:
			applicableTerms.map((term) => term.expression).join('\n&& '),
		logical: applicableTerms.length > 1 || applicableTerms[0]?.logical === true,
	}
}

const routeExpressionConditions = (
	context: ExpressionContext,
	expression: _Expression,
	fieldPathConditions: (fieldPaths: readonly string[][]) => ConditionTerm[]
): HrefConditionGroup[] => {
	if (typeof expression === 'string' || 'raw' in expression)
		return []

	if (expression.kind === 'case') {
		const valueConditionGroups = routeExpressionConditions(context, expression.value, fieldPathConditions)
		const valueCondition = hrefConditionGroupsExpression(valueConditionGroups)
		const valueExpression = renderExpression(expression.value, context)
		const cases = expression.cases.map((item) => {
			const requirementGroups = routeExpressionConditions(context, item.value, fieldPathConditions)
			return {
				condition: `${valueExpression} === ${emitTypeScript(item.equals)}`,
				inverseCondition: `${valueExpression} !== ${emitTypeScript(item.equals)}`,
				requirementGroups,
				requirement: hrefConditionGroupsExpression(requirementGroups) || 'true',
			}
		})
		const exhaustive = appCaseIsExhaustive(expression, context)
		const conditionalCases = exhaustive ? cases.slice(0, -1) : cases
		const fallbackRequirementGroups = exhaustive ?
			cases.at(-1)?.requirementGroups ?? []
		:
			routeExpressionConditions(context, expression.default, fieldPathConditions)
		const fallbackRequirement = hrefConditionGroupsExpression(fallbackRequirementGroups) || 'true'
		const caseCondition = conditionalCases.length === 0 ?
			fallbackRequirement
		: conditionalCases.length === 1 && conditionalCases[0]?.requirement === 'true' && fallbackRequirement === 'true' ?
			'true'
		: conditionalCases.length === 1 && conditionalCases[0]?.requirement === 'true' ?
			`(${conditionalCases[0].condition} || ${fallbackRequirement})`
		: conditionalCases.length === 1 && fallbackRequirement === 'true' ?
			`(${conditionalCases[0].inverseCondition} || ${conditionalCases[0].requirement})`
		:
			`(${conditionalCases
				.map(({ condition, requirement }) => `${condition} ? ${requirement}`)
				.join(' : ')} : ${fallbackRequirement})`

		const caseTerms = conditionalCases.length === 0 ?
			fallbackRequirementGroups.flatMap((group) => group.terms)
		:
			[{
				expression: caseCondition,
				...(conditionalCases.length === 1 && caseCondition !== 'true' ? { logical: true as const } : {}),
			}]

		return [{
			terms: [
				...valueConditionGroups.flatMap((group) => group.terms),
				...caseTerms,
			],
			...(valueCondition === '' ? {} : { parenthesized: true as const }),
		}]
	}

	return fieldPathConditions(uniqueFieldPaths(expressionFieldPaths(expression))).map((term) => ({
		terms: [term],
	}))
}

const expressionUsesKind = (expression: _Expression | undefined, kind: _Expression['kind']): boolean => {
	if (expression == null)
		return false
	if (typeof expression === 'string' || 'raw' in expression)
		return false
	if (expression.kind === kind)
		return true

	return expressionChildren(expression).some((child) => expressionUsesKind(child, kind))
}

const renderExpression = (
	expression: _Expression,
	context: ExpressionContext,
	caseParentheses: 'include' | 'omit' = 'include'
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
		return context.fieldExpressionByName?.[expression.name] ?? fieldExpression(context.fields ?? 'selector', expression.name)
	if (expression.kind === 'property')
		return `${renderExpression(expression.value, context)}${propertyAccess(expression.property)}`
	if (expression.kind === 'pageSelector')
		return context.pageSelector ?? 'data.selector'
	if (expression.kind === 'object')
		return emitObject(expression.fields.map((field) => [
			field.name,
			renderExpression(field.value, context),
		]))
	if (expression.kind === 'selector')
		return emitObject(expression.params.map((param) => [
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
				context.fieldExpressionByName?.[expression.field] ?? fieldExpression(context.fields ?? 'selector', expression.field)
			:
				'undefined'
		)

		return `${expression.map}[${key}]${expression.property == null ? '' : propertyAccess(expression.property)}`
	}
	if (expression.kind === 'call')
		return `${expression.name}(${expression.args.map((argument) => renderExpression(argument, context)).join(', ')})`
	if (expression.kind === 'template')
		return expression.parts
			.map((part) => (
				typeof part === 'string' ?
					emitTypeScript(part)
				: appExpressionProducesString(part, context) ?
					renderExpression(part, context)
				:
					`String(${renderExpression(part, context)})`
			))
			.join(' + ')
	if (expression.kind === 'case')
	{
		const valueExpression = renderExpression(expression.value, context)
		const caseExpressions = expression.cases.map((item) => ({
			equals: emitTypeScript(item.equals),
			value: renderExpression(item.value, context),
		}))
		const defaultExpression = renderExpression(expression.default, context)
		const exhaustive = appCaseIsExhaustive(expression, context)
		const conditionalCases = exhaustive ? caseExpressions.slice(0, -1) : caseExpressions
		const fallbackExpression = exhaustive ? caseExpressions.at(-1)?.value ?? defaultExpression : defaultExpression
		const inlineExpression = `${conditionalCases.map((item) => `${valueExpression} === ${item.equals} ? ${item.value}`).join(' : ')} : ${fallbackExpression}`
		if (!inlineExpression.includes('\n'))
			return caseParentheses === 'include' ? `(${inlineExpression})` : inlineExpression

		const expressionLines = [
			...conditionalCases.flatMap((item) => [
				...indent(`${valueExpression} === ${item.equals} ?`).split('\n'),
				...indent(item.value, 2).split('\n'),
				'\t:',
			]),
			indent(fallbackExpression, 2),
		]
		return (caseParentheses === 'include' ? [
			'(',
			...expressionLines,
			')',
		] : [
			expressionLines[0]?.trimStart() ?? '',
			...expressionLines.slice(1),
		]).join('\n')
	}

	throw new Error(`Unsupported expression kind: ${(expression as { kind: string }).kind}`)
}

const appCaseIsExhaustive = (
	expression: Extract<_Expression, { kind: 'case' }>,
	context: ExpressionContext
) => {
	if (context.entity == null || context.indexes == null)
		return false

	const fieldPaths = expressionFieldPaths(expression.value)
	if (fieldPaths.length !== 1)
		return false

	let entity: Entity | undefined = context.entity
	let fieldOwner: Entity | undefined
	let field: EntityField | undefined
	for (const fieldName of fieldPaths[0]) {
		fieldOwner = entity
		field = entity?.fields.find((candidate) => candidate.name === fieldName)
		if (field == null)
			return false
		entity = field.entityType == null ? undefined : context.indexes.entityByType[field.entityType]
	}

	const valueType = field.valueType == null ?
		field.primitiveType
	:
		context.indexes.valueTypeById[field.valueType]?.type
	if (valueType == null || !('enum' in valueType))
		return false

	const members = fieldOwner?.enums?.find((appEnum) => appEnum.name === valueType.enum)?.members
	return members != null && members.every((member) => (
		expression.cases.some((item) => item.equals === member.value)
	))
}

const labelForField = (field: EntityField) => displayLabel(
	field.label
	?? field.name
		.replace(/^\$\$?/, '')
		.replace(/([a-z])([A-Z])/g, '$1 $2')
		.replace(/^./, (letter) => letter.toUpperCase())
)

const sentenceStart = (value: string) => displayLabel(value).replace(/^./, (letter) => letter.toUpperCase())

const namedSourceSelectionFromQuery = (
	query: {
		sources?: readonly string[] | _SourceSelection
	} | undefined
) => (
	query?.sources == null
	|| Array.isArray(query.sources)
	|| query.sources.name == null ?
		[]
	:
	[query.sources]
)

const declaredViewItems = (entity: Entity) => {
	const singularView = entitySingularView(entity)
	const pluralView = entityPluralView(entity)

	return [
		singularView?.summary?.icon,
		...(singularView?.summary?.serial?.fallback ?? []),
		...(singularView?.summary?.value ?? []),
		...(singularView?.summary?.title ?? []),
		...(singularView?.summary?.titleFallback ?? []),
		...(singularView?.summary?.HeadingAfter ?? []),
		...(singularView?.closed ?? []),
		...(singularView?.content?.dl?.flat() ?? []),
		...(singularView?.content?.body == null ? [] : [singularView.content.body]),
		...(singularView?.content?.blocks?.flat() ?? []),
		...(singularView?.carousels?.flatMap((carousel) => carousel.sections.flatMap((section) => section.items ?? [])) ?? []),
		...(singularView?.details?.body == null ? [] : [singularView.details.body]),
		...(singularView?.details?.blocks?.flat() ?? []),
		...(singularView?.details?.tabs?.flatMap((tab) => tab.items ?? []) ?? []),
		...(pluralView?.row?.value ?? []),
		...(pluralView?.row?.title ?? []),
		...(pluralView?.row?.titleFallback ?? []),
		...(pluralView?.row?.HeadingAfter ?? []),
	].filter((viewItem) => viewItem != null)
}

const entityNamedSourceSelections = (entity: Entity) => {
	const singularView = entitySingularView(entity)
	const pluralView = entityPluralView(entity)
	return [
		...namedSourceSelectionFromQuery(singularView?.query),
		...(singularView?.latest ?? []).flatMap((latest) => namedSourceSelectionFromQuery(latest.query)),
		...(singularView?.content?.lists ?? []).flatMap((list) => namedSourceSelectionFromQuery(list.query)),
		...(singularView?.carousels ?? []).flatMap((carousel) => (
			carousel.sections.flatMap((section) => namedSourceSelectionFromQuery(section.selection))
		)),
		...(singularView?.lists ?? []).flatMap((list) => namedSourceSelectionFromQuery(list.query)),
		...namedSourceSelectionFromQuery(pluralView?.query),
		...declaredViewItems(entity).flatMap((viewItem) => (
			typeof viewItem === 'object' && 'selection' in viewItem ?
				namedSourceSelectionFromQuery(viewItem.selection)
			:
				[]
		)),
	]
}

const rawSnippet = (snippet: _RawSnippet | undefined) => (
	snippet == null || typeof snippet === 'string' ? [] : [snippet]
)

const singularViewRawSnippets = (entity: Entity) => {
	const singularView = entitySingularView(entity)

	return [
		...rawSnippet(singularView?.TypeAnnotationTooltip),
		...rawSnippet(singularView?.summary?.Icon),
		...rawSnippet(singularView?.summary?.Value),
		...rawSnippet(singularView?.summary?.Title),
		...(singularView?.latest ?? []).flatMap((latest) => rawSnippet(latest.Content)),
		...(singularView?.carousels ?? []).flatMap((carousel) => (
			carousel.sections.flatMap((section) => rawSnippet(section.Content))
		)),
		...(singularView?.details?.tabs ?? []).flatMap((tab) => rawSnippet(tab.Content)),
	]
}

const entityRawSnippets = (entity: Entity) => {
	const pluralView = entityPluralView(entity)

	return [
		...singularViewRawSnippets(entity),
		...rawSnippet(pluralView?.TypeAnnotationTooltip),
		...declaredViewItems(entity).flatMap((viewItem) => (
			typeof viewItem === 'object' && 'Content' in viewItem ?
				rawSnippet(viewItem.Content)
			:
				[]
		)),
	]
}

type RouteDetailLayoutPlan = {
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
	routeParamAlternatives: readonly RouteParamValues[]
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

export const composeSelectorRouteParamAlternatives = (
	routeMappingId: string,
	ownRouteParams: RouteParamValues,
	bindingGroups: readonly {
		field: string
		alternatives: readonly RouteParamValues[]
	}[],
	maximumAlternatives = 256
) => {
	const routeParamsKey = (routeParams: RouteParamValues) => JSON.stringify(
		Object.entries(routeParams)
			.toSorted(([leftParam], [rightParam]) => leftParam.localeCompare(rightParam))
			.map(([param, { value }]) => [param, value])
	)
	let routeParamAlternatives = [ownRouteParams]
	for (const bindingGroup of bindingGroups) {
		if (bindingGroup.alternatives.length === 0)
			throw new Error(`${routeMappingId} inherited field ${bindingGroup.field} has no applicable ancestor route parameter alternatives`)

		const bindingRouteAlternativeByKey = new Map<string, RouteParamValues>()
		for (const alternative of bindingGroup.alternatives) {
			const alternativeKey = routeParamsKey(alternative)
			const existingAlternative = bindingRouteAlternativeByKey.get(alternativeKey)
			if (existingAlternative == null) {
				bindingRouteAlternativeByKey.set(alternativeKey, alternative)
				continue
			}

			const conflictingDecoderParam = Object.keys(alternative).find((param) => (
				existingAlternative[param]?.decode !== alternative[param]?.decode
			))
			if (conflictingDecoderParam != null)
				throw new Error(`${routeMappingId} inherited field ${bindingGroup.field} alternatives disagree on decoder for route parameter ${conflictingDecoderParam}`)
		}
		const bindingRouteAlternatives = [...bindingRouteAlternativeByKey.values()]
		const composedAlternatives = new Map<string, RouteParamValues>()
		for (const routeParams of routeParamAlternatives)
			for (const bindingRouteParams of bindingRouteAlternatives) {
				const conflictingParam = Object.keys(bindingRouteParams).find((param) => (
					routeParams[param] != null
					&& JSON.stringify(routeParams[param].value) !== JSON.stringify(bindingRouteParams[param].value)
				))
				if (conflictingParam != null)
					throw new Error(`${routeMappingId} inherited field groups ambiguously bind route parameter ${conflictingParam}`)

				const conflictingDecoderParam = Object.keys(bindingRouteParams).find((param) => (
					routeParams[param] != null
					&& routeParams[param].decode !== bindingRouteParams[param].decode
				))
				if (conflictingDecoderParam != null)
					throw new Error(`${routeMappingId} inherited field groups disagree on decoder for route parameter ${conflictingDecoderParam}`)

				const composedRouteParams = {
					...routeParams,
					...bindingRouteParams,
				}
				composedAlternatives.set(routeParamsKey(composedRouteParams), composedRouteParams)
				if (composedAlternatives.size > maximumAlternatives)
					throw new Error(`${routeMappingId} produces more than ${maximumAlternatives} structurally distinct route parameter alternatives`)
			}
		routeParamAlternatives = [...composedAlternatives.values()]
	}

	return routeParamAlternatives
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
	if (expression.kind === 'catalogIndex')
		return {
			...expression,
			...(expression.key == null ? {} : {
				key: routeExpressionThroughReference(expression.key, referenceField),
			}),
		}
	if (expression.kind === 'object')
		return {
			...expression,
			fields: expression.fields.map((field) => ({
				...field,
				value: routeExpressionThroughReference(field.value, referenceField),
			})),
		}
	if (expression.kind === 'selector')
		return {
			...expression,
			params: expression.params.map((param) => (
				'value' in param ? {
					...param,
					value: routeExpressionThroughReference(param.value, referenceField),
				} : param
			)),
		}
	if (expression.kind === 'case')
		return {
			...expression,
			value: routeExpressionThroughReference(expression.value, referenceField),
			cases: expression.cases.map((item) => ({
				...item,
				value: routeExpressionThroughReference(item.value, referenceField),
			})),
			default: routeExpressionThroughReference(expression.default, referenceField),
		}

	return expression
}

const routeParamValuesFromExpression = (
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
		return expression.fields.flatMap((field) => routeParamValuesFromExpression(field.value, {
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
				const directValues = routeParamValuesFromExpression(
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
		const routeParams = expression.args.flatMap((argument) => routeParamValuesFromExpression(
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

const normalizeRouteParamDecodes = (
	expression: _Expression,
	decodeByParam: ReadonlyMap<string, _ExpressionDecode | _RouteParamTransform | undefined>,
	owner: string,
	entityByType?: ReadonlyMap<string, Entity>,
	valueTypeById?: ReadonlyMap<string, ValueType>,
	expectedField?: EntityField
): _Expression => {
	if (typeof expression === 'string' || 'raw' in expression)
		return expression
	if (expression.kind === 'param') {
		const decode = expectedField?.type === EntityFieldType.Primitive && expectedField.valueType != null ?
			valueTypeById?.get(expectedField.valueType)?.routeParam?.decode
		:
			decodeByParam.get(expression.name)
		if (
			expression.decode != null
			&& (
				decode == null
				|| typeof expression.decode !== typeof decode
				|| (
					typeof expression.decode === 'string'
					&& expression.decode !== decode
				)
				|| (
					typeof expression.decode !== 'string'
					&& typeof decode !== 'string'
					&& (expression.decode.from !== decode.from || expression.decode.name !== decode.name)
				)
			)
		)
			throw new Error(`${owner} parameter ${expression.name} decoder disagrees with normalized route metadata`)

		return decode == null ? expression : {
			...expression,
			decode,
		}
	}
	if (expression.kind === 'object') {
		const referencedEntity = expectedField?.type === EntityFieldType.EntityReference && expectedField.entityType != null ?
			entityByType?.get(expectedField.entityType)
		:
			undefined
		const objectDecodeByParam = expectedField?.type === EntityFieldType.Primitive ?
			new Map<string, _ExpressionDecode | _RouteParamTransform | undefined>(
				routeParamNamesFromExpression(expression).map((name) => [name, undefined])
			)
		:
			decodeByParam

		return {
			...expression,
			fields: expression.fields.map((field) => ({
				...field,
				value: normalizeRouteParamDecodes(
					field.value,
					objectDecodeByParam,
					owner,
					entityByType,
					valueTypeById,
					referencedEntity?.fields.find((candidate) => candidate.name === field.name)
				),
			})),
		}
	}
	if (expression.kind === 'selector')
		return {
			...expression,
			params: expression.params.map((param) => {
				const selectorField = entityByType
					?.get(expression.entity)
					?.fields.find((field) => field.name === param.field)
				if ('value' in param) {
					return {
						...param,
						value: normalizeRouteParamDecodes(
							param.value,
							decodeByParam,
							owner,
							entityByType,
							valueTypeById,
							selectorField
						),
						...(param.hrefValue == null ? {} : {
							hrefValue: normalizeRouteParamDecodes(
								param.hrefValue,
								decodeByParam,
								owner,
								entityByType,
								valueTypeById
							),
						}),
					}
				}
				const decode = selectorField?.type === EntityFieldType.Primitive && selectorField.valueType != null ?
					valueTypeById?.get(selectorField.valueType)?.routeParam?.decode
				:
					decodeByParam.get(param.param)
				if (
					param.decode != null
					&& (
						decode == null
						|| typeof param.decode !== typeof decode
						|| (
							typeof param.decode === 'string'
							&& param.decode !== decode
						)
						|| (
							typeof param.decode !== 'string'
							&& typeof decode !== 'string'
							&& (param.decode.from !== decode.from || param.decode.name !== decode.name)
						)
					)
				)
					throw new Error(`${owner} parameter ${param.param} decoder disagrees with normalized route metadata`)

				return decode == null ? param : {
					...param,
					decode,
				}
			}),
		}
	if (expression.kind === 'property')
		return {
			...expression,
			value: normalizeRouteParamDecodes(expression.value, decodeByParam, owner, entityByType, valueTypeById),
		}
	if (expression.kind === 'catalogIndex') {
		const param = expression.param
		return {
			...expression,
			...(param == null ? {} : { param: undefined }),
			...(param == null && expression.key == null ? {} : {
				key: normalizeRouteParamDecodes(
					expression.key ?? {
						kind: 'param',
						name: param ?? '',
					},
					decodeByParam,
					owner,
					entityByType,
					valueTypeById
				),
			}),
		}
	}
	if (expression.kind === 'call')
		return {
			...expression,
			args: expression.args.map((argument) => normalizeRouteParamDecodes(argument, decodeByParam, owner, entityByType, valueTypeById)),
		}
	if (expression.kind === 'template')
		return {
			...expression,
			parts: expression.parts.map((part) => typeof part === 'string' ? part : normalizeRouteParamDecodes(part, decodeByParam, owner, entityByType, valueTypeById)),
		}
	if (expression.kind === 'case')
		return {
			...expression,
			value: normalizeRouteParamDecodes(expression.value, decodeByParam, owner, entityByType, valueTypeById),
			cases: expression.cases.map((item) => ({
				...item,
				value: normalizeRouteParamDecodes(item.value, decodeByParam, owner, entityByType, valueTypeById, expectedField),
			})),
			default: normalizeRouteParamDecodes(expression.default, decodeByParam, owner, entityByType, valueTypeById, expectedField),
		}

	return expression
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

// Route compilation turns the nested APP.ts route declaration into normalized
// route facts. Rendering does not rediscover selector or route relationships.
const compileRouteTree = (
	nodes: App['routes']['children'],
	indexes: {
		entityByType: ReadonlyMap<string, Entity>
		compiledEntityByType: Readonly<Record<string, Entity>>
		entityFacetByPath: Readonly<Record<string, EntityFacetEntry>>
		valueTypeById: ReadonlyMap<string | undefined, ValueType>
		routeParamValueTypesByOwner: ReadonlyMap<string, readonly string[]>
	},
	parentPath = '',
	ancestorSelectors: readonly RouteAncestorSelector[] = [],
	ancestorRouteParams: readonly RouteParamCompilationContext[] = [],
	parentSvelteKitPath = ''
): RouteNode[] => {
	const {
		entityByType,
		valueTypeById,
	} = indexes
	const encodedRouteParamValue = (
		value: _Expression,
		routeParam: App['schema']['valueTypes'][number]['routeParam']
	): _Expression => {
		const encode = routeParam?.encode
		return encode == null ? value : {
			kind: 'call',
			from: encode.from,
			name: encode.name,
			args: [value],
		}
	}
	const decodedRouteParamValue = (
		param: string,
		routeParam: App['schema']['valueTypes'][number]['routeParam']
	): _Expression => (
		typeof routeParam?.decode === 'object' ? {
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
			...(routeParam?.decode == null ? {} : { decode: routeParam.decode }),
		}
	)
	return Object.entries(nodes).map(([segment, node]) => {
		const routePath = [parentPath, segment].filter(Boolean).join('/')
		const selectorMappings = Object.entries(node.selectors ?? {}).flatMap(([entityType, selectors]) => (
			Object.entries(selectors).map(([selectorName, mapping]) => ({
				entityType,
				selectorName,
				mapping,
			}))
		))
		const routeParams = [
			...ancestorRouteParams,
			...routeParamNames(segment).map((name): RouteParamCompilationContext => {
				const explicitValueTypes = node.params?.[name] ?? []
				const boundValueTypes = indexes.routeParamValueTypesByOwner.get(`${routeId(routePath)}\0${name}`) ?? []
				const valueTypes = unique([
					...explicitValueTypes,
					...boundValueTypes,
				])
				const routeParamDefinitions = valueTypes.flatMap((valueType) => {
					const routeParam = indexes.valueTypeById.get(valueType)?.routeParam
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
				const encodings = unique(routeParamDefinitions.flatMap((routeParam) => (
					routeParam.encoding == null ? [] : [routeParam.encoding]
				)))
				if (encodings.length > 1)
					throw new Error(`${routeId(routePath)} parameter ${name} has incompatible schema encodings`)

				return {
					name,
					matcher,
					matchers,
					explicitValueTypes,
					valueTypes,
					...(decodes[0] == null ? {} : { decode: decodes[0] }),
					...(encodings[0] == null ? {} : { encoding: encodings[0] }),
				}
			}),
		]
		const routeParamByName = new Map(routeParams.map((routeParam) => [routeParam.name, routeParam]))
		const compileRouteParamValue = (
			param: string,
			value: _Expression
		): RouteParamValues[string] => {
			const decode = routeParamByName.get(param)?.decode
			return {
				value,
				...(typeof decode !== 'string' ? {} : { decode }),
			}
		}
		const normalizeExpression = (
			owner: string,
			expression: _Expression,
			expectedField?: EntityField
		) => normalizeRouteParamDecodes(
			expression,
			new Map(routeParams.map((routeParam) => [routeParam.name, routeParam.decode])),
			`${routeId(routePath)} ${owner}`,
			entityByType,
			valueTypeById,
			expectedField
		)
		const ancestorSelectorsAtNode = ancestorSelectors.map((ancestor) => ({
			...ancestor,
			descendantSvelteKitPath: routeId([
				ancestor.descendantSvelteKitPath,
				svelteKitRoutePath(segment, routeParams),
			].filter(Boolean).join('/')),
		}))
		const compiledSelectorMappings = selectorMappings.map(({ entityType, selectorName, mapping: sourceMapping }) => {
			const entity = entityByType.get(entityType)
			const selector = entity?.selectors.find((candidate) => candidate.name === selectorName)
			if (entity == null || selector == null)
				throw new Error(`${routeId(routePath)} references missing selector ${entityType}.${selectorName}`)

			const mapping = {
				...sourceMapping,
				...(sourceMapping.derivations == null ? {} : {
					derivations: Object.fromEntries(Object.entries(sourceMapping.derivations).map(([fieldName, expression]) => {
						const field = entity.fields.find((candidate) => candidate.name === fieldName)
						if (field == null)
							throw new Error(`${routeId(routePath)} ${entityType}.${selectorName} derives missing field ${fieldName}`)

						return [
							fieldName,
							normalizeExpression(`${entityType}.${selectorName}`, expression, field),
						]
					})),
				}),
				...(sourceMapping.href == null ? {} : {
					href: {
						...sourceMapping.href,
						params: (sourceMapping.href.params ?? []).map((param) => ({
							...param,
							value: normalizeExpression(`${entityType}.${selectorName}`, param.value),
						})),
					},
				}),
			}

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
			const derivationRouteParams = Object.entries(mapping.derivations ?? {}).flatMap(([fieldName, expression]) => (
				routeParamValuesFromExpression(
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
				if (routeParamValueTypes.has(param) && !derivationRouteParams.some(([derivationParam]) => derivationParam === param))
					throw new Error(`${routeId(routePath)} ${entityType}.${selectorName} binds route parameter ${param} more than once`)
				if (routeParamValueTypes.has(param))
					continue
				const explicitValueTypes = routeParams.toReversed().find((routeParam) => routeParam.name === param)?.explicitValueTypes ?? []
				if (explicitValueTypes.length === 0)
					throw new Error(`${routeId(routePath)} ${entityType}.${selectorName} href parameter ${param} has no explicit schema route parameter type`)

				routeParamValueTypes.set(param, explicitValueTypes)
			}
			const ownRouteParams = {
				...Object.fromEntries(paramBindings.map(({ param, fieldPath, terminalField }) => {
					const fieldName = fieldPath[0]
					if (fieldName == null)
						throw new Error(`${routeId(routePath)} ${entityType}.${selectorName} parameter ${param} has an empty field path`)

					return [
						param,
						compileRouteParamValue(
							param,
							encodedRouteParamValue(
								fieldPath.slice(1).reduce<_Expression>((value, property) => ({
									kind: 'property',
									value,
									property,
								}), {
									kind: 'field',
									name: fieldName,
								}),
								valueTypeById.get(terminalField.valueType)?.routeParam
							)
						),
					]
				})),
				...Object.fromEntries(derivationRouteParams.map(([param, value]) => [
					param,
					compileRouteParamValue(param, value),
				])),
				...Object.fromEntries((mapping.href?.params ?? []).map(({ param, value }) => [
					param,
					compileRouteParamValue(param, value),
				])),
			}
			const decodedParamValue = (param: string, field: EntityField): _Expression => {
				const routeParam = valueTypeById.get(field.valueType)?.routeParam
				if (routeParam == null)
					throw new Error(`${routeId(routePath)} ${entityType}.${selectorName} parameter ${param} has no schema route parameter field`)

				return decodedRouteParamValue(param, routeParam)
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
					canonicalize: mapping.href.canonicalize,
					conditions: mapping.href.conditions,
				},
				ownRouteParams,
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
		const nearestAncestorSelectorMappings = ancestorSelectorsAtNode.filter(({ depth }) => (
			depth === Math.max(...ancestorSelectorsAtNode.map((ancestor) => ancestor.depth))
		))
		const collectionMappings = (node.collections ?? []).map((collection) => {
			const derivations = Object.fromEntries(Object.entries(collection.derivations ?? {}).map(([field, expression]) => [
				field,
				normalizeExpression(`${collection.field[0]} collection`, expression),
			]))
			const selector = Object.keys(derivations).length > 0 ? {
				kind: 'object' as const,
				fields: Object.entries(derivations).map(([name, value]) => ({
					name,
					value,
				})),
			} : {
				kind: 'pageSelector' as const,
			}
			const sourceEntity = indexes.entityByType.get(collection.field[0])
			if (sourceEntity == null)
				throw new Error(`${routeId(routePath)} collection references missing source entity ${collection.field[0]}`)

			const path = [
				...(isProjectionFieldReference(collection.field[1]) ?
					collection.field[1]
				:
					[collection.field[1]]
				),
				...collection.field.slice(2),
			]
			const plan = collectionReferencePathPlan(
				sourceEntity,
				{
					entityByType: indexes.compiledEntityByType,
					entityFacetByPath: indexes.entityFacetByPath,
				},
				path,
				`${routeId(routePath)} collection`
			)
			const field = plan.steps[0]?.field ?? plan.terminalField
			const fieldProjectionPath = plan.steps[0]?.projectionPath ?? plan.terminalProjectionPath
			if (field.entityType == null)
				throw new Error(`${routeId(routePath)} collection references non-entity field ${sourceEntity.entityType}.${field.name}`)
			if (plan.terminalField.entityType == null)
				throw new Error(`${routeId(routePath)} collection terminal ${plan.terminalEntity.entityType}.${plan.terminalField.name} is missing its target entity`)

			return {
				entity: plan.terminalField.entityType,
				source: {
					entity: sourceEntity.entityType,
					selector,
					field: fieldProjectionPath.length === 0 ? field.name : [
						...fieldProjectionPath,
						field.name,
					],
					path,
					...(
						expressionUsesKind(selector, 'pageSelector')
						&& nearestAncestorSelectorMappings.length > 1
						&& unique(nearestAncestorSelectorMappings.map(({ entityType }) => entityType)).length > 1
						&& nearestAncestorSelectorMappings.some(({ entityType }) => entityType === sourceEntity.entityType) ?
							{ routeEntityType: sourceEntity.entityType }
						:
							{}
					),
				},
				query: collection.query,
				page: collection.page,
			}
		})
		const ownDetailEntityTypes = unique(compiledSelectorMappings.flatMap(({ mapping, selector }) => (
			selector.params.length > 0
			&& (
				mapping.page != null
				|| selector.entityType === node.page?.view?.entity
			) ?
				[selector.entityType]
			:
				[]
		)))
		const ownDetailGroup = (
			ownDetailEntityTypes.length === 0 ?
				undefined
			: ownDetailEntityTypes.length === 1 ?
				camel(ownDetailEntityTypes[0] ?? '')
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
			ownRouteParams,
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
			const routeParamAlternatives = composeSelectorRouteParamAlternatives(
				`${routeId(routePath)} ${entityType}.${selectorName}`,
				ownRouteParams,
				ancestorBindings.map((binding) => ({
					field: binding.field,
					alternatives: binding.alternatives.flatMap((alternative) => {
						const ancestor = ancestorSelectorsAtNode.find((candidate) => (
							candidate.ancestorNodeId === alternative.ancestorNodeId
							&& candidate.entityType === alternative.entityType
							&& candidate.selectorName === alternative.selectorName
						))
						return ancestor == null ? [] : ancestor.routeParamAlternatives.map((ancestorRouteParams) => Object.fromEntries(
							Object.entries(ancestorRouteParams).map(([param, routeParamValue]) => [
								param,
								{
									...routeParamValue,
									value: alternative.referencePath.reduceRight<_Expression>((expression, referenceField) => (
										routeExpressionThroughReference(expression, referenceField)
									), routeParamValue.value),
								},
							])
						))
						}),
					}))
			)

			if (
				mapping.projection != null
				&& mapping.projection.entityType !== entityType
				&& routePageSelectorExpression(
					entityByType,
					ancestorSelectorsAtNode,
					mapping.projection.entityType
				) == null
			)
				throw new Error(`${routeId(routePath)} ${entityType}.${selectorName} cannot derive projection subject ${mapping.projection.entityType}`)

			const projectionRouteParams = mapping.projection == null ? [] : unique(ancestorSelectorsAtNode
				.filter((ancestor) => ancestor.entityType === mapping.projection?.entityType)
				.flatMap((ancestor) => ancestor.routeParamAlternatives.flatMap((routeParams) => Object.keys(routeParams)))
				.filter((param) => routeParams.some(({ name }) => name === param)))
			if (projectionRouteParams.length > 1)
				throw new Error(`${routeId(routePath)} ${entityType}.${selectorName} projection subject ${mapping.projection?.entityType} has ambiguous route parameters ${projectionRouteParams.join(', ')}`)
			const sourceSelection = entitySingularView(normalizedEntity)?.query?.sources

			return {
				entityType,
				selectorName,
				...(sourceSelection == null ? {} : {
					sourceSelection,
				}),
				routeParamMatchers,
				...routeProbeMetadata(
					routePath,
					`${entityType}.${selectorName}`,
					Object.keys(routeParamAlternatives[0] ?? {}),
					mapping.probeCount ?? 1
				),
				...(mapping.boundaryLiveOptional == null ? {} : { boundaryLiveOptional: mapping.boundaryLiveOptional }),
				...(href == null ? {} : { href }),
				routeParamAlternatives,
				fields,
				title,
				...(mapping.when == null ? {} : { when: mapping.when }),
				...(mapping.projection == null ? {} : {
					projection: mapping.projection,
					...(projectionRouteParams[0] == null ? {} : { projectionRouteParam: projectionRouteParams[0] }),
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
				if (derivation != null) {
					const destinationField = entity.fields.find((candidate) => candidate.name === field)
					if (destinationField == null)
						throw new Error(`${routeId(routePath)} ${owner.entityType}.${owner.selectorName} selector variant derives missing field ${field}`)

					return {
						field,
						value: normalizeExpression(
							`${owner.entityType}.${owner.selectorName} selector variant`,
							derivation,
							destinationField
						),
					}
				}
				const binding = paramBindings.find(({ fieldPath }) => fieldPath[0] === field)
				if (binding == null)
					return {
						field,
						value,
					}

				return {
					field,
					value: decodedRouteParamValue(
						binding.param,
						valueTypeById.get(binding.terminalField.valueType)?.routeParam
					),
				}
			})
			const variantRouteParams = {
				...Object.fromEntries(paramBindings.map(({ param, terminalField, fieldPath }) => {
					const value = {
						kind: 'field' as const,
						name: fieldPath[0] ?? '',
					}

					return [
						param,
						compileRouteParamValue(
							param,
							encodedRouteParamValue(
								value,
								valueTypeById.get(terminalField.valueType)?.routeParam
							)
						),
					]
				})),
				...Object.fromEntries(Object.entries(node.selectorVariant.derivations ?? {}).flatMap(([fieldName, expression]) => (
					routeParamValuesFromExpression(
						expression,
						{
							kind: 'field',
							name: fieldName,
						},
						entityByType,
						new Map(routeParams.map((routeParam) => [routeParam.name, routeParam.valueTypes]))
					)
				)).map(([param, value]) => [
					param,
					compileRouteParamValue(param, value),
				])),
				...Object.fromEntries((node.selectorVariant.href?.params ?? []).map(({ param, value }) => [
					param,
					compileRouteParamValue(param, value),
				])),
			}
			const routeParamAlternatives = owner.mapping.routeParamAlternatives.map((alternative) => ({
				...alternative,
				...variantRouteParams,
			}))
			const variantId = routePath
				.split('/')
				.findLast((segment) => segment !== '' && !segment.startsWith('(') && !segment.startsWith('['))
			if (variantId == null)
				throw new Error(`${routeId(routePath)} selector variant has no stable route segment`)

			return {
				svelteKitPath: owner.descendantSvelteKitPath,
				mapping: {
					...owner.mapping,
					routeParamMatchers: [...new Map([
						...owner.mapping.routeParamMatchers,
						...paramBindings.map(({ param, terminalField }) => ({
							param,
							valueTypes: [terminalField.valueType],
							matchers: routeParams.find((routeParam) => routeParam.name === param)?.matchers ?? [],
						})),
					].map((routeParamMatcher) => [routeParamMatcher.param, routeParamMatcher])).values()],
					...routeProbeMetadata(
						routePath,
						`${owner.entityType}.${owner.selectorName}`,
						Object.keys(routeParamAlternatives[0] ?? {}),
						1,
						variantId,
						Object.fromEntries(Object.keys(owner.mapping.routeParamAlternatives[0] ?? {}).map((param, index) => [
							param,
							owner.mapping.probeAtoms[index],
						]))
					),
					...(node.selectorVariant.boundaryLiveOptional == null ? {} : { boundaryLiveOptional: node.selectorVariant.boundaryLiveOptional }),
					href: {
						entityHref: node.selectorVariant.href?.entityHref ?? owner.mapping.href?.entityHref,
						canonicalize: node.selectorVariant.href?.canonicalize ?? owner.mapping.href?.canonicalize,
						conditions: node.selectorVariant.href?.conditions ?? owner.mapping.href?.conditions,
					},
					routeParamAlternatives,
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
				routeParamAlternatives: normalizedMapping.routeParamAlternatives,
				mapping: normalizedMapping,
				depth: routePath.split('/').length,
			})),
		]
		const children = compileRouteTree(
			node.children ?? {},
			indexes,
			routePath,
			descendantSelectors,
			routeParams,
			ownDetailGroup == null ? svelteKitPath : `${svelteKitPath}/(${ownDetailGroup})`
		)

		return {
			internalPath: routeId(routePath),
			svelteKitPath,
			publicPath: publicRouteId(routePath),
			params: routeParams.map(({
				explicitValueTypes: _explicitValueTypes,
				...routeParam
			}) => routeParam),
			collectionMappings: collectionMappings.map((collection) => ({
				entityType: collection.source.entity,
				field: collection.source.field,
				path: collection.source.path,
				targetEntityType: collection.entity,
				selector: collection.source.selector,
				...(collection.source.routeEntityType == null ? {} : {
					routeEntityType: collection.source.routeEntityType,
				}),
				query: collection.query,
				page: collection.page,
			})),
			selectorMappings: normalizedSelectorMappings,
			...(selectorVariant == null ? {} : {
				selectorVariant: selectorVariant.mapping,
			}),
			...(node.page == null ? {} : { page: node.page }),
			...(node.layout == null ? {} : { layout: node.layout }),
			children,
		}
	})
}

const viewConditionFromFacetCondition = (
	condition: _AppFacetCondition
): EntityRouteLink['conditions'] => {
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
) => node.selectorVariant === mapping || (
	mapping.fields.length > 0
	&& (
		mapping.page != null
		|| mapping.entityType === node.page?.view?.entity
	)
)

const routeLinksFromMapping = (
	node: RouteNode,
	mapping: SelectorRouteMapping,
	entityFacetByPath: Readonly<Record<string, EntityFacetEntry>>,
	facetDependencyConditionsByPath: Readonly<Record<string, NonNullable<EntityRouteLink['conditions']>>>
): EntityRouteLink[] => {
	return !selectorMappingOwnsDetailPage(node, mapping) || mapping.href?.entityHref === false ? [] : mapping.routeParamAlternatives.map((params) => ({
		path: node.svelteKitPath,
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
		params,
	}))
}

const entityRouteLinkKey = (routeLink: EntityRouteLink) => JSON.stringify({
	...routeLink,
	conditions: routeLink.conditions ?? [],
})

const routeLinkFromCollection = (
	node: RouteNode,
	collection: RouteNode['collectionMappings'][number]
): EntityRouteLink | undefined => {
	const path = node.svelteKitPath
	const selector = collection.selector
	if (selector.kind === 'object') {
		const routeParams = routeParamNames(path)
		const params = Object.fromEntries(routeParams.flatMap((param) => {
			const selectorField = selector.fields.find(({ value }) => (
				typeof value !== 'string'
					&& !('raw' in value)
				&& value.kind === 'param'
					&& value.name === param
			))
			if (selectorField == null)
				return []

			const decode = node.params.find((routeParam) => routeParam.name === param)?.decode
			return [[
				param,
				{
					value: {
						kind: 'field' as const,
						name: selectorField.name,
					},
					...(typeof decode !== 'string' ? {} : { decode }),
				},
			] as const]
		}))
		if (Object.keys(params).length !== routeParams.length)
			return undefined

		return {
			path,
			params,
			selector: '',
			conditions: selector.fields.flatMap(({ name, value }) => (
				typeof value !== 'string'
				&& !('raw' in value)
				&& value.kind === 'literal' ?
					[{
						field: name,
						equals: value.value,
					}]
				:
					[]
			)),
		}
	}
	if (selector.kind !== 'selector')
		return routeParamNames(path).length === 0 ?
			{
				path,
				params: {},
				selector: '',
			}
		:
			undefined

	const routeParams = routeParamNames(path)
	const params = Object.fromEntries(routeParams.flatMap((param) => {
		const selectorParam = selector.params.find((item) => item.param === param)
		if (selectorParam == null)
			return []

		return [[
			param,
			{
				value: (
					'hrefValue' in selectorParam && selectorParam.hrefValue != null ?
						selectorParam.hrefValue
					: 'value' in selectorParam ?
						selectorParam.value
					:
						{
							kind: 'field' as const,
							name: selectorParam.field,
						}
				),
				decode: selectorParam.decode,
			},
		] as const]
	}))
	if (Object.keys(params).length !== routeParams.length)
		return undefined

	return {
		path,
		params,
		selector: selector.selector,
		conditions: selector.params.flatMap((selectorParam) => (
			'value' in selectorParam
			&& typeof selectorParam.value !== 'string'
			&& !('raw' in selectorParam.value)
			&& selectorParam.value.kind === 'literal' ?
				[{
					field: selectorParam.field,
					equals: selectorParam.value.value,
				}]
			:
				[]
		)),
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
		&& valueType.type.object[0]?.name === 'namespace'
		&& valueType.type.object[1]?.name === 'reference'
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
		&& (
			(
				valueType.type.raw === 'EvmAddress'
				&& valueType.routeParam?.matcher === 'evmAddress'
			)
			|| (
				valueType.type.raw === 'EvmTopicHash'
				&& valueType.routeParam?.matcher === 'evmTopicHash'
			)
		)
	)
		return {
			minimumLength: valueType.type.raw === 'EvmAddress' ? 42 : 66,
			maximumLength: valueType.type.raw === 'EvmAddress' ? 42 : 66,
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
	valueTypeById: ReadonlyMap<string | undefined, ValueType>,
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
	ancestorMappings?: readonly SelectorRouteMapping[],
	mappingsByNode = new Map<string, readonly SelectorRouteMapping[] | undefined>()
) => {
	for (const node of nodes) {
		const mappings = node.selectorVariant != null ?
			[node.selectorVariant]
		: node.selectorMappings.length === 0 ?
			ancestorMappings
		:
			node.selectorMappings
		mappingsByNode.set(node.internalPath, mappings)
		indexRouteProbeMappings(node.children, mappings, mappingsByNode)
	}

	return mappingsByNode
}

const routeFixtureMetadataFromMapping = (mapping: SelectorRouteMapping): RouteFixtureMetadata => ({
	id: `${mapping.entityType}.${mapping.selectorName}`,
	projectionEntity: mapping.projection?.entityType,
	projectionPath: mapping.projection?.facetPath,
	probeCaseId: mapping.probeCaseId,
	probeAtoms: mapping.probeAtoms,
	boundaryLiveOptional: mapping.boundaryLiveOptional,
})

const compileRouteEntries = (
	nodes: readonly RouteNode[],
	routeNodeByInternalPath: ReadonlyMap<string, RouteNode>
): RouteRenderEntry[] => nodes.flatMap((node) => {
	const renderMappings = [
		...node.selectorMappings,
		...(node.selectorVariant == null ? [] : [node.selectorVariant]),
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
	const ownDetails = node.selectorMappings.flatMap((mapping) => (
		selectorMappingOwnsDetailPage(node, mapping) ?
			[{
				entityType: mapping.entityType,
				selectorName: mapping.selectorName,
				component: mapping.page?.view?.component ?? node.page?.view?.component ?? singularComponentName(mapping.entityType),
				...(mapping.sourceSelection == null ? {} : { sourceSelection: mapping.sourceSelection }),
			}]
		:
			[]
	))
	const detailEntityTypes = unique(ownDetails.map((detail) => detail.entityType))
	const detailLayout = ownDetails.length === 0 ? undefined : (() => {
		for (const detailIdentity of detailEntityTypes) {
			const entityDetails = ownDetails.filter((detail) => detail.entityType === detailIdentity)
			if (unique(entityDetails.map((detail) => detail.component)).length > 1)
				throw new Error(`${node.internalPath} detail layout assigns ambiguous components to ${detailIdentity}`)
		}
		const dispatchDetails = ownDetails.filter((detail, index) => (
			ownDetails.findIndex((candidate) => (
				candidate.entityType === detail.entityType
				&& candidate.selectorName === detail.selectorName
			)) === index
		))
		const componentDetails = dispatchDetails.filter((detail, index) => (
			dispatchDetails.findIndex((candidate) => candidate.entityType === detail.entityType) === index
		))

		const hrefParamNames = routeParamNames(node.svelteKitPath)
		const detailSourcesExpression = renderDispatchedSourceSelectionExpression(dispatchDetails)
		return {
			components: unique(ownDetails.map((detail) => detail.component)),
			hrefExpression: renderResolveExpression(node.svelteKitPath, hrefParamNames.map((param) => [param, `params.${param}`])),
			...(hrefParamNames.length === 0 ? {} : {
				keyExpression: hrefParamNames.length === 1 ?
					`params.${hrefParamNames[0]}`
				:
					`[${hrefParamNames.map((param) => `params.${param}`).join(', ')}].join(':')`,
			}),
			detailViewExpression: componentDetails.reduceRight((alternate, detail, index) => (
				index === componentDetails.length - 1 ?
					componentIdentifier(detail.component)
				:
					`data.entityType === EntityType.${detail.entityType} ? ${componentIdentifier(detail.component)} : ${alternate}`
			), ''),
			detailSelectionExpression: emitTypeScript({
				kind: 'call',
				callee: {
					kind: 'raw',
					source: 'select',
				},
				arguments: [
					{
						kind: 'raw',
						source: detailEntityTypes.length === 1 ?
							`EntityType.${detailEntityTypes[0]}`
						:
							'data.entityType',
					},
					{
						kind: 'raw',
						source: 'data.selector',
					},
					...(detailSourcesExpression == null ? [] : [{
						kind: 'object' as const,
						entries: [[
							'sources',
							{
								kind: 'raw' as const,
								source: detailSourcesExpression,
							},
						]],
					}]),
				],
			}),
		}
	})()
	const collections = node.collectionMappings.map((collection) => ({
		entity: collection.targetEntityType,
		source: {
			entity: collection.entityType,
			selector: collection.selector,
			field: collection.field,
			path: collection.path,
			...(collection.routeEntityType == null ? {} : {
				routeEntityType: collection.routeEntityType,
			}),
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
		...(detailLayout == null || node.children.length === 0 ? [] : [{
			internalPath: node.internalPath,
			routePath: `${node.svelteKitPath.replace(/^\//, '')}/(${detailEntityTypes.length === 1 ? camel(detailEntityTypes[0] ?? '') : 'selection'})`,
			files: [{
				kind: RouteFileKind.Layout,
				detailLayout,
			}],
		}]),
		...compileRouteEntries(node.children, routeNodeByInternalPath),
	]
})

const validateRouteParamAlternativeCoverage = (indexedNodes: readonly RouteNode[]) => {
	const errors = [
		...indexedNodes.flatMap((node) => node.selectorMappings.flatMap((mapping) => [
			...(!selectorMappingOwnsDetailPage(node, mapping) || mapping.href?.entityHref === false ? [] : mapping.routeParamAlternatives.flatMap((routeParams) => node.params.flatMap(({ name }) => (
				Object.hasOwn(routeParams, name) ?
					[]
				:
					[`${node.internalPath} ${mapping.entityType}.${mapping.selectorName} href is missing route parameter ${name}`]
			)))),
		])),
		...indexedNodes.flatMap((node) => node.selectorVariant == null ? [] : [
			...node.selectorVariant.routeParamAlternatives.flatMap((routeParams) => node.params.flatMap(({ name }) => (
				Object.hasOwn(routeParams, name) ?
					[]
				:
					[`${node.internalPath} ${node.selectorVariant.entityType}.${node.selectorVariant.selectorName} selector variant href is missing route parameter ${name}`]
			))),
		]),
	]
	if (errors.length > 0)
		throw new Error(errors.join('\n'))
}

const sourceBindings = (source: App['sources']['sources'][number]) => [
	...(source.binding == null ? [] : [source.binding]),
	...(source.bindings ?? []),
]

// A source names provenance, not an operation group. Two source names cannot
// partition one provider transport unless an external provenance axis differs.
const sourceIdentityTransportKey = ({
	provider,
	binding,
}: {
	provider: SourceDefinition['provider']
	binding: SourceBinding
}) => JSON.stringify([
	provider,
	[...binding.endpoints]
		.map(({ endpointKind, locator, corsEnabled }) => JSON.stringify([
			endpointKind,
			locator,
			corsEnabled ?? null,
		]))
		.sort(),
	binding.wireProtocol,
	binding.apiFamily,
	binding.delivery,
	[...binding.credentials]
		.map((credential) => JSON.stringify(
			'envKey' in credential ?
				[
					credential.scope,
					credential.envKey,
					'header' in credential.injection ?
						[
							'header',
							credential.injection.header.name,
							credential.injection.header.prefix ?? null,
						]
					: 'query' in credential.injection ?
						[
							'query',
							credential.injection.query.name,
						]
					:
						[
							'endpointTemplate',
							credential.injection.endpointTemplate.slot,
						],
				]
			:
				[
					credential.scope,
					[...(credential.keys ?? [])].sort(),
					[...(credential.env?.keys ?? [])]
						.map(({ name, type }) => JSON.stringify([
							name,
							type,
						]))
						.sort(),
				]
		))
		.sort(),
	binding.target.kind === SourceTargetKind.GitRepository ?
		[
			binding.target.kind,
			binding.target.key,
		]
	:
		null,
	[...new Set((binding.artifacts ?? []).flatMap((artifact) => (
		'officialUrl' in artifact ?
			artifact.officialUrl == null ? [] : [artifact.officialUrl]
		:
			artifact.referenceUrl == null ? [] : [artifact.referenceUrl]
	)))].sort(),
])

const routeMappingFixtureMetadataEntries = (
	metadata: RouteFixtureMetadata,
	parameterCount: number
) => {
	if (metadata.probeAtoms.length % parameterCount !== 0)
		throw new Error(`${metadata.id} has incomplete route fixture probe cases`)

	const probeAtomPrefixes = unique(metadata.probeAtoms.map((probeAtom) => (
		probeAtom.slice(0, probeAtom.lastIndexOf('.', probeAtom.lastIndexOf('.') - 1))
	)))
	const probeCases = Array.from(
		{ length: metadata.probeAtoms.length / parameterCount },
		(_, index) => [...Map.groupBy(
				metadata.probeAtoms
					.slice(index * parameterCount, (index + 1) * parameterCount)
					.map((probeAtom) => {
						const fieldSeparator = probeAtom.lastIndexOf('.')
						const caseSeparator = probeAtom.lastIndexOf('.', fieldSeparator - 1)

						return {
							prefixIndex: probeAtomPrefixes.indexOf(probeAtom.slice(0, caseSeparator)),
							caseNumber: probeAtom.slice(caseSeparator + 1, fieldSeparator),
							field: probeAtom.slice(fieldSeparator + 1),
						}
				}),
			({ prefixIndex, caseNumber }) => `${prefixIndex}\0${caseNumber}`
		).values()].map((references) => {
			const reference = references[0]
			if (reference == null)
				throw new Error(`${metadata.id} produced an empty route fixture ownership group`)

			return `[${[
				String(reference.prefixIndex),
				emitTypeScript(reference.caseNumber),
				`[${references.map(({ field }) => emitTypeScript(field)).join(', ')}]`,
			].join(', ')}]`
		})
	)

	return [
		['id', emitTypeScript(metadata.id)],
		['projectionEntity', metadata.projectionEntity == null ? undefined : emitTypeScript(metadata.projectionEntity)],
		['probeCaseId', metadata.probeCaseId == null ? undefined : emitTypeScript(metadata.probeCaseId)],
		['probeAtomPrefixes', `[${probeAtomPrefixes.map(emitTypeScript).join(', ')}]`],
		['probeCases', `[${probeCases.map((probeCase) => `[${probeCase.join(', ')}]`).join(', ')}]`],
		['projectionPath', metadata.projectionPath == null ? undefined : emitArray(metadata.projectionPath.map(emitTypeScript))],
		['boundaryLiveOptional', metadata.boundaryLiveOptional == null ? undefined : 'true'],
	] as const
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

	const projectionPath = field.slice(0, -1)
	const facet = entityFacetByPath[projectionPathKey(entity.entityType, projectionPath)]?.facet
	if (facet == null)
		throw new Error(`${entity.entityType} references missing projection ${projectionPath.join('.')}`)
	if (!facet.fields?.some((facetField) => facetField.name === field.at(-1)))
		throw new Error(`${entity.entityType} projection ${projectionPath.join('.')} references missing field ${field.at(-1)}`)
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
				typeof item === 'string' || isProjectionFieldReference(item) ?
					(
						validateFieldReference(entity, item, entityFacetByPath, currentFacetPath),
						fieldReferenceInProjection(entity, item, entityFacetByPath, currentFacetPath)
					)
				:
					resolveFieldReferences(entity, item, entityFacetByPath, currentFacetPath)
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

			return resolveFieldReferences(entity, item, entityFacetByPath, currentFacetPath, key)
		})
	}

	if (value == null || typeof value !== 'object')
		return value

	if ('field' in value && (typeof value.field === 'string' || isProjectionFieldReference(value.field))) {
		const field = fieldReferenceInProjection(
			entity,
			value.field,
			entityFacetByPath,
			currentFacetPath
		)
		validateFieldReference(entity, field, entityFacetByPath, currentFacetPath)

		return Object.fromEntries(Object.entries({
			...value,
			field,
		}).map(([entryKey, entryValue]) => [
			entryKey,
				entryKey === 'titleField' ?
					entryValue
				:
					resolveFieldReferences(entity, entryValue, entityFacetByPath, currentFacetPath, entryKey),
			]))
	}

	return Object.fromEntries(Object.entries(value).map(([entryKey, entryValue]) => {
		if (
			(entryKey === 'field' || entryKey === 'titleField')
			&& (typeof entryValue === 'string' || isProjectionFieldReference(entryValue))
		)
			return [
				entryKey,
				fieldReferenceInProjection(entity, entryValue, entityFacetByPath, currentFacetPath),
			]

		return [
			entryKey,
			resolveFieldReferences(entity, entryValue, entityFacetByPath, currentFacetPath, entryKey),
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
	carousels: (facet.carousels ?? []).reduce((carousels, carousel) => {
		if (carousel.after == null)
			return [
				...carousels,
				carousel,
			]

		const anchorIndex = carousels.findIndex((candidate) => candidate.id === carousel.after)
		if (anchorIndex === -1)
			throw new Error(`Carousel ${carousel.id ?? carousel.label} references missing insertion anchor ${carousel.after}`)

		return [
			...carousels.slice(0, anchorIndex + 1),
			carousel,
			...carousels.slice(anchorIndex + 1),
		]
	}, [...(base?.carousels ?? [])]),
})

const facetEntriesForEntity = (
	entityType: string,
	facets: readonly EntityFacet[] | undefined
) => {
	// Facet contributions are breadth-first: every declaration at one projection
	// depth contributes before nested facets refine the assembled entity view.
	const facetEntries: EntityFacetEntry[] = (facets ?? []).map((facet) => ({
		entityType,
		facet,
		projectionPath: [facet.name],
	}))
	for (const facetEntry of facetEntries) {
		facetEntries.push(...(facetEntry.facet.facets ?? []).map((facet) => ({
			entityType,
			facet,
			projectionPath: [
				...facetEntry.projectionPath,
				facet.name,
			],
		})))
	}

	return facetEntries
}

const normalizeApp = (app: App) => {
	const entities = app.schema.entities.map((entity) => ({
		...entity,
		facets: entity.facets?.map((facet) => ({ ...facet })),
	}))
	const facetEntries = entities.flatMap((entity) => facetEntriesForEntity(entity.entityType, entity.facets))
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

		const normalizedViews = resolveFieldReferences(entity, entity.views, entityFacetByPath) as Entity['views']
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
					projectionPath
				) as Partial<SingularView> | undefined
				const facetSingularView = resolvedFacetSingularView == null ? undefined : {
					...resolvedFacetSingularView,
					latest: resolvedFacetSingularView.latest?.map((latest) => ({
						...latest,
						projectionPath,
					})),
					carousels: resolvedFacetSingularView.carousels?.map((carousel) => ({
						...carousel,
						projectionPath,
					})),
				} satisfies Partial<SingularView>
				if (facetSingularView == null)
					return view

				return combineSingularViewContributions(view, facetSingularView)
			}, normalizedViews.singular)
		for (const carousel of singularView?.carousels ?? []) {
			const carouselProjectionPath = carousel.projectionPath ?? []
			for (const section of carousel.sections) {
				if (!isProjectionFieldReference(section.field ?? ''))
					continue

				const fieldProjectionPath = section.field.slice(0, -1)
				if (
					fieldProjectionPath.length <= carouselProjectionPath.length
					&& fieldProjectionPath.every((facetName, index) => carouselProjectionPath[index] === facetName)
				)
					continue

				throw new Error(`${entity.entityType} carousel ${carousel.id ?? carousel.label ?? 'unnamed'} section ${section.id ?? section.label} field ${section.field.join('.')} is not owned by carousel facet ${carouselProjectionPath.join('.') || '(base)'}`)
			}
		}

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

type SourceBindingDeliveryCompatibility = {
	deliveries: readonly SourceDelivery[]
	wireProtocols:
		| true
		| {
			include: readonly WireProtocol[]
			exclude?: never
		}
		| {
			exclude: readonly WireProtocol[]
			include?: never
		}
	apiFamilies: true | readonly ApiFamily[]
	endpointLayout: SourceBindingDeliveryEndpointLayout
	credentialLayout: SourceBindingDeliveryCredentialLayout
}

const sourceBindingMatchesDeliveryCompatibility = (
	binding: {
		delivery: SourceDelivery
		wireProtocol: WireProtocol
		apiFamily: ApiFamily
	},
	compatibility: SourceBindingDeliveryCompatibility
) => (
	compatibility.deliveries.some((delivery) => delivery === binding.delivery)
	&& (
		compatibility.wireProtocols === true
		|| (
			'include' in compatibility.wireProtocols ?
				compatibility.wireProtocols.include.some((wireProtocol) => wireProtocol === binding.wireProtocol)
			:
				compatibility.wireProtocols.exclude.every((wireProtocol) => wireProtocol !== binding.wireProtocol)
		)
	)
	&& (
		compatibility.apiFamilies === true
		|| compatibility.apiFamilies.some((apiFamily) => apiFamily === binding.apiFamily)
	)
)

export const validateSourceBindingDeliveryCompatibility = (
	compatibilityRows: readonly SourceBindingDeliveryCompatibility[]
) => {
	const rowKeys = new Set<string>()
	for (const compatibility of compatibilityRows) {
		if (compatibility.deliveries.length === 0)
			throw new Error('Delivery compatibility row requires at least one delivery')
		if (compatibility.wireProtocols !== true) {
			if ('include' in compatibility.wireProtocols && 'exclude' in compatibility.wireProtocols)
				throw new Error('Delivery compatibility wire protocols cannot include and exclude simultaneously')
			const wireProtocols = 'include' in compatibility.wireProtocols ?
				compatibility.wireProtocols.include
			:
				compatibility.wireProtocols.exclude
			if (wireProtocols.length === 0)
				throw new Error('Constrained delivery wire protocols must be nonempty')
			if (new Set(wireProtocols).size !== wireProtocols.length)
				throw new Error('Delivery compatibility row contains duplicate wire protocol')
		}
		if (compatibility.apiFamilies !== true && compatibility.apiFamilies.length === 0)
			throw new Error('Constrained delivery API families must be nonempty')

		for (const [label, values] of [
			['delivery', compatibility.deliveries],
			...(compatibility.apiFamilies === true ? [] : [['API family', compatibility.apiFamilies] as const]),
		] as const)
			if (new Set(values).size !== values.length)
				throw new Error(`Delivery compatibility row contains duplicate ${label}`)

		const rowKey = JSON.stringify(compatibility)
		if (rowKeys.has(rowKey))
			throw new Error(`Duplicate source binding delivery compatibility row ${rowKey}`)

		rowKeys.add(rowKey)
	}

	for (const delivery of Object.values(SourceDelivery))
		if (!compatibilityRows.some((compatibility) => compatibility.deliveries.some((candidate) => candidate === delivery)))
			throw new Error(`Source delivery ${delivery} has no compatibility row`)

	const deliveryProtocolApiFamilies = Object.values(SourceDelivery).flatMap((delivery) => (
		Object.values(WireProtocol).flatMap((wireProtocol) => (
			Object.values(ApiFamily).map((apiFamily) => ({
				delivery,
				wireProtocol,
				apiFamily,
			}))
		))
	))
	for (const [compatibilityIndex, compatibility] of compatibilityRows.entries())
		if (!deliveryProtocolApiFamilies.some((binding) => (
			sourceBindingMatchesDeliveryCompatibility(binding, compatibility)
		)))
			throw new Error(`Source binding delivery compatibility row ${compatibilityIndex} matches no protocol/API combination`)
	for (const binding of deliveryProtocolApiFamilies)
		if (compatibilityRows.filter((compatibility) => (
			sourceBindingMatchesDeliveryCompatibility(binding, compatibility)
		)).length > 1)
			throw new Error(`Ambiguous source binding delivery compatibility for ${binding.delivery}/${binding.wireProtocol}/${binding.apiFamily}`)
}

// HTTP endpoint locators own their authority. Paths and templates never need a
// second origin field in APP.ts or generated bindings.
const httpOriginFromLocator = (locator: string) => (
	!locator.startsWith('env:')
	&& URL.canParse(locator) ?
		new URL(locator).origin
	:
		undefined
)

// Compilation is the only phase that interprets APP.ts. It validates and indexes
// domain facts first, then hands a closed set of facts to deterministic emitters.
export const compileApp = (sourceApp: App): CompiledApp => {
	validateSourceBindingCompatibility(sourceBindingCompatibility)
	validateSourceBindingDeliveryCompatibility(sourceBindingDeliveryCompatibility)

	const sources = Object.freeze([...sourceApp.sources.sources])
	const sourceProviders = Object.freeze([...sourceApp.sources.providers])
	const sourceIds = new Set(sources.map((source) => source.source))
	const sourceProviderIds = new Set(sourceProviders.map((provider) => provider.provider))
	for (const source of Object.values(Source))
		if (!sourceIds.has(source))
			throw new Error(`Source enum ${source} has no source definition`)
	for (const sourceProvider of Object.values(SourceProvider))
		if (!sourceProviderIds.has(sourceProvider))
			throw new Error(`SourceProvider enum ${sourceProvider} has no provider definition`)
	for (const source of sources)
		if (!sourceProviderIds.has(source.provider))
			throw new Error(`${source.source}: unknown source provider ${source.provider}`)
	const compiledSourceBindings = Object.freeze(sources.flatMap((source) => sourceBindings(source).map((binding) => ({
		source: source.source,
		binding,
	}))))
	const sourceBindingIds = new Set<string>()
	for (const { binding, source } of compiledSourceBindings) {
		const bindingId = sourceBindingId({
			source,
			target: binding.target,
			delivery: binding.delivery,
			apiFamily: binding.apiFamily,
		})
		if (sourceBindingIds.has(bindingId))
			throw new Error(`Duplicate source binding identity ${bindingId}`)

		sourceBindingIds.add(bindingId)
		if (binding.target.kind === SourceTargetKind.Caip2Network && !caip2NetworkKeys.has(binding.target.key))
			throw new Error(`${source}: unknown Caip2Network target ${binding.target.key}`)
		if (binding.target.kind === SourceTargetKind.NetworkSlug && !networkSlugs.has(binding.target.key))
			throw new Error(`${source}: unknown NetworkSlug target ${binding.target.key}`)
		if (binding.target.kind === SourceTargetKind.Eip155Chain && !/^[1-9]\d*$/.test(binding.target.key))
			throw new Error(`${source}: invalid Eip155Chain target ${binding.target.key}`)
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

		const deliveryCompatibilities = sourceBindingDeliveryCompatibility.filter((deliveryCompatibility) => (
			sourceBindingMatchesDeliveryCompatibility(binding, deliveryCompatibility)
		))
		if (deliveryCompatibilities.length !== 1)
			throw new Error(`${source}: binding must match exactly one delivery compatibility row`)

		const deliveryCompatibility = deliveryCompatibilities[0]

		for (const endpoint of binding.endpoints) {
			if (endpoint.endpointKind !== SourceEndpointKind.HttpUrl && endpoint.corsEnabled != null)
				throw new Error(`${source}: corsEnabled is only valid on HTTP endpoints`)
			if (
				endpoint.endpointKind === SourceEndpointKind.HttpUrl
				&& !endpoint.locator.startsWith('env:')
				&& !endpoint.locator.startsWith('http://')
				&& !endpoint.locator.startsWith('https://')
			)
				throw new Error(`${source}: HTTP endpoint locator requires an HTTP protocol`)
			if (
				endpoint.endpointKind === SourceEndpointKind.HttpUrl
				&& binding.delivery === SourceDelivery.HttpProxy
				&& (
					httpOriginFromLocator(endpoint.locator) == null
					|| httpOriginFromLocator(endpoint.locator)?.includes('{') === true
				)
			)
				throw new Error(`${source}: HttpProxy requires a concrete HTTP origin`)
		}

		if (deliveryCompatibility.endpointLayout === SourceBindingDeliveryEndpointLayout.BrowserDirect) {
			if (binding.endpoints.some((endpoint) => (
				endpoint.endpointKind !== SourceEndpointKind.HttpUrl
				&& endpoint.endpointKind !== SourceEndpointKind.BrowserWalletProvider
				&& endpoint.endpointKind !== SourceEndpointKind.InProcess
			)))
				throw new Error(`${source}: BrowserDirect requires browser-addressable endpoints`)
			if (binding.endpoints.some((endpoint) => (
				endpoint.endpointKind === SourceEndpointKind.HttpUrl
				&& endpoint.corsEnabled !== true
			)))
				throw new Error(`${source}: BrowserDirect HTTP endpoint requires corsEnabled true`)
		}
		if (
			deliveryCompatibility.endpointLayout === SourceBindingDeliveryEndpointLayout.HttpOnly
			&& binding.endpoints.some((endpoint) => endpoint.endpointKind !== SourceEndpointKind.HttpUrl)
		)
			throw new Error(`${source}: ${binding.delivery} requires HTTP endpoints`)
		if (deliveryCompatibility.endpointLayout === SourceBindingDeliveryEndpointLayout.RemoteLiveWebSocket) {
			const [firstEndpoint, ...remainingEndpoints] = binding.endpoints
			if (
				(
					firstEndpoint?.endpointKind !== SourceEndpointKind.WebSocketUrl
					&& firstEndpoint?.endpointKind !== SourceEndpointKind.HttpUrl
				)
				|| (
					firstEndpoint.endpointKind === SourceEndpointKind.HttpUrl
					&& remainingEndpoints.length === 0
				)
				|| remainingEndpoints.some((endpoint) => endpoint.endpointKind !== SourceEndpointKind.WebSocketUrl)
			)
				throw new Error(`${source}: RemoteLive requires WebSocket endpoints with at most one leading HTTP endpoint`)
		}

		if (
			deliveryCompatibility.credentialLayout === SourceBindingDeliveryCredentialLayout.PublicOrUser
			&& binding.credentials.some((credential) => (
				credential.scope !== SourceCredentialScope.PublicConfig
				&& credential.scope !== SourceCredentialScope.UserDelegated
			))
		)
			throw new Error(`${source}: ${binding.delivery} accepts only public/user credentials`)
		for (const credential of binding.credentials) {
			if (
				credential.scope === SourceCredentialScope.PublicConfig
				&& 'keys' in credential
			)
				throw new Error(`${source}: PublicConfig credentials derive keys from env and cannot declare keys`)
			if (
				(
					deliveryCompatibility.credentialLayout !== SourceBindingDeliveryCredentialLayout.PublicOrUserWithOptionalRuntimeSecret
					|| credential.scope !== SourceCredentialScope.RuntimeSecret
				)
				&& ('envKey' in credential || 'injection' in credential)
			)
				throw new Error(`${source}: credential requirements cannot declare server-secret injection`)
		}

		const runtimeSecrets = binding.credentials.filter((credential) => (
			credential.scope === SourceCredentialScope.RuntimeSecret
		))
		if (deliveryCompatibility.credentialLayout === SourceBindingDeliveryCredentialLayout.PublicOrUserWithOptionalRuntimeSecret) {
			if (binding.credentials.some((credential) => (
				credential.scope !== SourceCredentialScope.PublicConfig
				&& credential.scope !== SourceCredentialScope.UserDelegated
				&& credential.scope !== SourceCredentialScope.RuntimeSecret
			)))
				throw new Error(`${source}: ${binding.delivery} cannot require local secrets`)
			if (
				runtimeSecrets.length > 1
				|| (
					runtimeSecrets.length === 1
					&& binding.credentials.at(-1)?.scope !== SourceCredentialScope.RuntimeSecret
				)
			)
				throw new Error(`${source}: ${binding.delivery} accepts at most one trailing runtime secret`)
		}
		for (const runtimeSecret of (
			deliveryCompatibility.credentialLayout === SourceBindingDeliveryCredentialLayout.PublicOrUserWithOptionalRuntimeSecret ?
				runtimeSecrets
			:
				[]
		)) {
			if ('env' in runtimeSecret || 'keys' in runtimeSecret)
				throw new Error(`${source}: managed runtime secrets cannot declare env or keys`)
			if (!('envKey' in runtimeSecret) || runtimeSecret.envKey.trim() === '')
				throw new Error(`${source}: ${binding.delivery} runtime secret requires envKey`)
			if (!('injection' in runtimeSecret))
				throw new Error(`${source}: ${binding.delivery} runtime secret requires injection`)
			if (
				'endpointTemplate' in runtimeSecret.injection
				&& !binding.endpoints.some((endpoint) => (
					endpoint.locator.includes(`{${runtimeSecret.injection.endpointTemplate.slot}}`)
					))
			)
				throw new Error(`${source}: ${binding.delivery} runtime secret template slot is absent from its endpoints`)
		}
	}
	for (const [source, definitions] of Map.groupBy(sources, (definition) => definition.source))
		if (definitions.length > 1)
			throw new Error(`Duplicate source: ${source}`)

	const sourceDefinitionById = nullPrototypeRecord(sources.map((source) => [
		String(source.source),
		source,
	]))

	for (const indistinguishableBindings of Map.groupBy(
		compiledSourceBindings,
		({ source, binding }) => sourceIdentityTransportKey({
			provider: sourceDefinitionById[source].provider,
			binding,
		})
	).values()) {
		const indistinguishableSources = unique(indistinguishableBindings.map(({ source }) => source))
		if (indistinguishableSources.length > 1)
			throw new Error(`${sourceDefinitionById[indistinguishableBindings[0]?.source ?? ''].provider}: source identities ${indistinguishableSources.join(', ')} share one transport and provenance; combine their operation groups on one source binding`)
	}

	const {
		app,
		entityFacetByPath,
		facetEntries,
		facetAncestorConditionsByPath,
		facetDependencyConditionsByPath,
	} = normalizeApp(sourceApp)
	const resolverModules = Object.freeze([...app.resolvers.modules])
	const navigationItems = Object.freeze([...app.navigation.items])
	const activeEntities = Object.freeze([...app.schema.entities]
		.sort((left, right) => left.entityType.localeCompare(right.entityType, 'en', {
			sensitivity: 'base',
			numeric: true,
		})))
	const entityTypes = Object.freeze(activeEntities.map((entity) => entity.entityType))
	const entityByType = new Map(activeEntities.map((entity) => [entity.entityType, entity]))
	const compiledEntityByType = nullPrototypeRecord([...entityByType])
	const valueTypeById = new Map([
		...app.schema.valueTypes.map((valueType) => [valueType.id, valueType] as const),
		...activeEntities.flatMap((entity) => (entity.enums ?? []).map((appEnum) => [
			appEnum.name,
			{
				id: appEnum.name,
				imports: [{
					from: schemaModulePath(appEnum.name),
					names: [appEnum.name],
				}],
				routeParam: appEnum.routeParam,
				type: {
					enum: appEnum.name,
				},
			},
		] as const)),
	])
	const allEntityTypes = new Set(entityTypes)
	const facetNames = new Set(facetEntries.map(({ facet }) => facet.name))
	const errors: string[] = []
	const resolverModuleSourceIds = new Set<Source>()
	const resolverModulePaths = new Set<string>()
	for (const resolverModule of resolverModules) {
		if (!sourceIds.has(resolverModule.source))
			errors.push(`resolver module ${resolverModule.path} references missing source ${resolverModule.source}`)
		if (resolverModuleSourceIds.has(resolverModule.source))
			errors.push(`duplicate resolver module source ${resolverModule.source}`)
		if (resolverModulePaths.has(resolverModule.path))
			errors.push(`duplicate resolver module path ${resolverModule.path}`)

		resolverModuleSourceIds.add(resolverModule.source)
		resolverModulePaths.add(resolverModule.path)
	}
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
	expectUnique('entity type', entityTypes)
	expectUnique('value type', app.schema.valueTypes.map((valueType) => valueType.id))
	expectUnique('source provider', sourceProviders.map((provider) => provider.provider))

	for (const entity of activeEntities) {
		const singularView = entitySingularView(entity)
		if (entityLabelPlural(entity).trim() === '')
			errors.push(`${entity.entityType} is missing an explicit labels.plural value`)
		expectUnique(`${entity.entityType} selector`, entity.selectors.map((selector) => selector.name))
		for (const selector of entity.selectors) {
			if (!/^[A-Z][A-Za-z0-9]*$/.test(selector.name))
				errors.push(`${entity.entityType} selector ${selector.name} must be TitleCase`)
		}
		expectUnique(`${entity.entityType} field`, entity.fields.map((field) => field.name))
		const fieldNames = new Set(entity.fields.map((field) => field.name))
		const entityFacetEntries = facetEntries.filter((facetEntry) => facetEntry.entityType === entity.entityType)
		const allFields = [
			...entity.fields,
			...entityFacetEntries.flatMap(({ facet }) => facet.fields ?? []),
		]
		const allFieldNames = new Set(allFields.map((field) => field.name))
		for (const siblingFacetEntries of Object.values(Object.groupBy(
			entityFacetEntries,
			({ projectionPath }) => JSON.stringify(projectionPath.slice(0, -1))
		))) {
			const parentPath = siblingFacetEntries[0]?.projectionPath.slice(0, -1) ?? []
			expectUnique(
				`${entity.entityType} ${parentPath.join('.') || 'base'} facet`,
				siblingFacetEntries.map(({ facet }) => facet.name)
			)
		}
		for (const facetEntry of entityFacetEntries) {
			if (!/^[A-Z][A-Za-z0-9]*$/.test(facetEntry.facet.name))
				errors.push(`${entity.entityType}.${facetEntry.projectionPath.join('.')} facet name must be TitleCase`)
			if ([
				...fieldNames,
				...facetEntry.projectionPath.slice(0, -1).flatMap((_, index) => (
					entityFacetByPath[projectionPathKey(
						entity.entityType,
						facetEntry.projectionPath.slice(0, index + 1)
					)]?.facet.fields?.map((field) => field.name) ?? []
				)),
			].includes(facetEntry.facet.name))
				errors.push(`${entity.entityType}.${facetEntry.projectionPath.join('.')} facet name collides with a field in its projection namespace`)
		}
		for (const field of allFields) {
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
		const contentWarning = singularView?.contentWarning
		if (contentWarning != null) {
			if (singularView?.content?.body == null)
				errors.push(`${entity.entityType} contentWarning requires content.body`)
			for (const [
				role,
				fieldReference,
				expectedPrimitive,
			] of [
				['sensitive', contentWarning.sensitiveField, 'boolean'],
				['text', contentWarning.textField, 'string'],
			] as const) {
				const field = fieldDefinitionByReference(entity, fieldReference, { entityFacetByPath })
				const valueType = field?.valueType == null ? undefined : valueTypeById.get(field.valueType)
				const primitiveType = valueType?.type ?? field?.primitiveType
				if (field == null)
					errors.push(`${entity.entityType} contentWarning ${role} field references missing field ${fieldReference}`)
				else if (field.type !== EntityFieldType.Primitive)
					errors.push(`${entity.entityType} contentWarning ${role} field must be primitive`)
				else if (field.cardinality !== EntityFieldCardinality.ZeroOrOne)
					errors.push(`${entity.entityType} contentWarning ${role} field must be ZeroOrOne`)
				else if (primitiveType == null || !('primitive' in primitiveType) || primitiveType.primitive !== expectedPrimitive)
					errors.push(`${entity.entityType} contentWarning ${role} field must be ${expectedPrimitive}`)
			}
			if (contentWarning.fallbackText.trim() === '')
				errors.push(`${entity.entityType} contentWarning fallbackText must be nonblank`)
		}
		for (const { facet } of entityFacetEntries) {
			errors.push(...facetConditionErrors(entity, facet.condition, entityFacetByPath))
			for (const list of facet.singularView?.lists ?? []) {
				if (
					list.field != null
					&& !allFieldNames.has(fieldNameForReference(list.field))
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
				for (const fieldPath of expressionFieldPaths(value)) {
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

	const compiledRouteNodes = compileRouteTree(
		app.routes.children,
		{
			entityByType,
			compiledEntityByType,
			entityFacetByPath,
			valueTypeById,
			routeParamValueTypesByOwner,
		}
	)
	const indexedRouteNodes = flattenRouteNodes(compiledRouteNodes)
	const routeNodeByInternalPath = new Map(indexedRouteNodes.map((node) => [node.internalPath, node]))
	for (const entity of activeEntities) {
		const singularView = entitySingularView(entity)
		for (const list of [
			...(singularView?.content?.lists ?? []),
			...(singularView?.lists ?? []),
		])
			if (list.href != null && !routeNodeByInternalPath.has(routeId(list.href)))
				throw new Error(`${entity.entityType}.${list.field} list references missing internal route ${list.href}`)
	}
	validateRouteParamAlternativeCoverage(indexedRouteNodes)
	const routeEntryList = Object.freeze(compileRouteEntries(compiledRouteNodes, routeNodeByInternalPath))
	const routeNodesByPublicShape = Map.groupBy(indexedRouteNodes, (node) => publicRouteShape(node.publicPath))
	const selectorMappingEntries = indexedRouteNodes.flatMap((node) => node.selectorMappings.map((mapping) => ({
		node,
		mapping,
	})))
	const routeMappingsByEntityTypeAndSelector = Map.groupBy(
		selectorMappingEntries,
		({ mapping }) => selectorRouteMappingKey(mapping.entityType, mapping.selectorName)
	)
	for (const [key, entries] of routeMappingsByEntityTypeAndSelector)
		if (entries.length > 1)
			throw new Error(`Duplicate route selector mapping ${key}: ${entries.map(({ node }) => node.internalPath).join(', ')}`)
	for (const { node, mapping } of selectorMappingEntries)
		if (
			mapping.href?.entityHref === false
			&& !indexedRouteNodes.some((candidateNode) => candidateNode.selectorMappings.some((candidateMapping) => (
				candidateMapping.entityType === mapping.entityType
				&& candidateMapping.href?.entityHref !== false
				&& selectorMappingOwnsDetailPage(candidateNode, candidateMapping)
			))))
			throw new Error(`${node.internalPath} ${mapping.entityType}.${mapping.selectorName} suppresses its entity href without a canonical entity route`)
	for (const { node, mapping } of selectorMappingEntries)
		if (
			mapping.href?.canonicalize === true
			&& mapping.href.entityHref !== false
		)
			throw new Error(`${node.internalPath} ${mapping.entityType}.${mapping.selectorName} canonicalizes without suppressing its alias entity href`)

	const selectorOutcomeByEntityTypeAndSelector = new Map<string, SelectorOutcome>([...routeMappingsByEntityTypeAndSelector].flatMap(([key, [entry]]) => (
		entry == null ? [] : [[key, {
			kind: 'VisibleRoute',
			nodeId: entry.node.internalPath,
		} satisfies SelectorOutcome] as const]
	)))
	const schemaSelectorKeys = new Set(activeEntities.flatMap((entity) => entity.selectors.map((selector) => (
		selectorRouteMappingKey(entity.entityType, selector.name)
	))))
	for (const [
		entityType,
		outcomes,
	] of Object.entries(sourceApp.routes.outcomes ?? {}))
		for (const [
			selectorName,
			outcome,
		] of Object.entries(outcomes)) {
			const key = selectorRouteMappingKey(entityType, selectorName)
			if (!schemaSelectorKeys.has(key)) {
				errors.push(`${key} route outcome references an unknown selector`)
				continue
			}
			if (selectorOutcomeByEntityTypeAndSelector.has(key)) {
				errors.push(`${key} has both a visible route mapping and ${outcome.kind} outcome`)
				continue
			}

			selectorOutcomeByEntityTypeAndSelector.set(key, outcome)
		}

	if (sourceApp.routes.outcomes != null)
		for (const key of schemaSelectorKeys)
			if (!selectorOutcomeByEntityTypeAndSelector.has(key))
				errors.push(`${key} is missing an explicit route outcome`)

	for (const [
		key,
		outcome,
	] of selectorOutcomeByEntityTypeAndSelector) {
		if (outcome.kind === 'VisibleRoute')
			continue

		if (outcome.kind === 'Hub' || outcome.kind === 'Internal') {
			if (!routeNodeByInternalPath.has(outcome.nodeId))
				errors.push(`${key} ${outcome.kind} outcome references missing route node ${outcome.nodeId}`)
			continue
		}

		if (outcome.kind === 'Research' || outcome.kind === 'Blocked') {
			if (outcome.decision.trim() === '' || outcome.evidence.trim() === '')
				errors.push(`${key} ${outcome.kind} outcome requires a decision and evidence`)
			continue
		}

		const targetKey = selectorRouteMappingKey(outcome.target.entityType, outcome.target.selectorName)
		if (!schemaSelectorKeys.has(targetKey))
			errors.push(`${key} ${outcome.kind} outcome references unknown selector ${targetKey}`)
		if (
			outcome.kind === 'Facet'
			&& entityFacetByPath[projectionPathKey(outcome.target.entityType, outcome.facetPath)] == null
		)
			errors.push(`${key} Facet outcome references missing ${outcome.target.entityType}.${outcome.facetPath.join('.')}`)
	}

	for (const [
		key,
		outcome,
	] of selectorOutcomeByEntityTypeAndSelector) {
		if (outcome.kind !== 'Alias')
			continue

		const visited = new Set([key])
		let targetKey = selectorRouteMappingKey(outcome.target.entityType, outcome.target.selectorName)
		while (selectorOutcomeByEntityTypeAndSelector.get(targetKey)?.kind === 'Alias') {
			if (visited.has(targetKey)) {
				errors.push(`${key} Alias outcome contains a cycle through ${targetKey}`)
				targetKey = ''
				break
			}

			visited.add(targetKey)
			const target = selectorOutcomeByEntityTypeAndSelector.get(targetKey)
			if (target?.kind !== 'Alias')
				break
			targetKey = selectorRouteMappingKey(target.target.entityType, target.target.selectorName)
		}
		if (targetKey !== '' && selectorOutcomeByEntityTypeAndSelector.get(targetKey)?.kind !== 'VisibleRoute')
			errors.push(`${key} Alias outcome must resolve to one visible route`)
	}
	const routeProbeMappingsByNode = indexRouteProbeMappings(compiledRouteNodes)

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
				const leftMappings = routeProbeMappingsByNode.get(left.internalPath) ?? []
				const rightMappings = routeProbeMappingsByNode.get(right.internalPath) ?? []
				const leftApplicabilities = (leftMappings.length === 0 ? [undefined] : leftMappings).map((mapping) => applicabilityFor(left, mapping))
				const rightApplicabilities = (rightMappings.length === 0 ? [undefined] : rightMappings).map((mapping) => applicabilityFor(right, mapping))
				if (routeApplicabilitySetsOverlap(leftApplicabilities, rightApplicabilities))
					errors.push(`${left.internalPath} and ${right.internalPath} overlap public route shape ${publicRouteShape(left.publicPath)} with overlapping or unknown applicability`)
			}
	}

	for (const [snippetIndex, snippet] of activeEntities.flatMap(entityRawSnippets).entries()) {
		try {
			parseSvelte(snippet.raw)
		} catch (error) {
			errors.push(`Raw Svelte fragment ${snippetIndex.toString()} did not parse: ${error instanceof Error ? error.message : String(error)}`)
		}
	}

	const seenRouteFiles = new Set<string>()
	for (const entry of routeEntryList) {
		for (const routeFile of entry.files) {
			const filePath = `${entry.routePath === '' ? 'src/routes' : `src/routes/${entry.routePath}`}/${routeFileName(routeFile.kind)}`
			if (seenRouteFiles.has(filePath))
				errors.push(`Duplicate generated route file: ${filePath}`)
			seenRouteFiles.add(filePath)
		}
	}

	if (errors.length > 0)
		throw new Error(errors.join('\n'))

	const collectionRouteByEntity = new Map<string, string>()
	const collectionRoutesBySourceField = new Map<string, EntityRouteLink[]>()
	const entityRouteLinksByType = new Map<string, EntityRouteLink[]>()
	for (const node of indexedRouteNodes) {
		for (const collection of node.collectionMappings) {
			if (
				node.params.length === 0
				&& (
					collectionRouteByEntity.get(collection.targetEntityType) == null
					|| node.svelteKitPath.length < (collectionRouteByEntity.get(collection.targetEntityType) ?? '').length
				)
			)
				collectionRouteByEntity.set(collection.targetEntityType, node.svelteKitPath)

			const collectionRouteLink = routeLinkFromCollection(node, collection)
			if (collectionRouteLink == null)
				continue

			const key = collectionSourceFieldKey(
				collection.entityType,
				fieldNameForReference(collection.field),
				collection.targetEntityType
			)
			const collectionRoutes = collectionRoutesBySourceField.get(key) ?? []
			if (collectionRoutes.every((routeLink) => entityRouteLinkKey(routeLink) !== entityRouteLinkKey(collectionRouteLink)))
				collectionRoutesBySourceField.set(key, [
					...collectionRoutes,
					collectionRouteLink,
				])
		}

		for (const mapping of [
			...node.selectorMappings,
			...(node.selectorVariant == null ? [] : [node.selectorVariant]),
		]) {
			const entityRouteLinks = routeLinksFromMapping(
				node,
				mapping,
				entityFacetByPath,
				facetDependencyConditionsByPath
			)
			const existingEntityRouteLinks = entityRouteLinksByType.get(mapping.entityType) ?? []
			const newEntityRouteLinks = entityRouteLinks.filter((entityRouteLink) => (
				existingEntityRouteLinks.every((existingLink) => (
					entityRouteLinkKey(existingLink) !== entityRouteLinkKey(entityRouteLink)
					&& (
						existingLink.selector !== entityRouteLink.selector
						|| (existingLink.conditions?.length ?? 0) > 0
						|| (entityRouteLink.conditions?.length ?? 0) > 0
					)
				))
			))
			if (newEntityRouteLinks.length > 0)
				entityRouteLinksByType.set(mapping.entityType, [
					...existingEntityRouteLinks,
					...newEntityRouteLinks,
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

		const mappings = (routeProbeMappingsByNode.get(node.internalPath) ?? []).map(routeFixtureMetadataFromMapping)
		if (mappings.length === 0)
			errors.push(`${physicalRouteFile.path} has no selector-owned probe cases`)

		const routeParams = node.params.map(({ name }) => name)
		for (const mapping of mappings) {
			if (mapping.probeAtoms.length === 0)
				errors.push(`${physicalRouteFile.path} mapping ${mapping.id} has no probe cases`)
			if (mapping.probeAtoms.length % routeParams.length !== 0)
				errors.push(`${physicalRouteFile.path} mapping ${mapping.id} probe atoms do not form complete cases`)
			for (let index = 0; index < mapping.probeAtoms.length; index += routeParams.length) {
				const caseParams = mapping.probeAtoms.slice(index, index + routeParams.length).map((atom) => (
					atom.slice(atom.lastIndexOf('.') + 1)
				))
				if (
					routeParams.some((param) => !caseParams.includes(param))
					|| caseParams.some((param) => !routeParams.includes(param))
				)
					errors.push(`${physicalRouteFile.path} mapping ${mapping.id} probe case parameters do not match the route`)
			}
		}

		return [{
			nodeId: node.internalPath,
			routeId: node.svelteKitPath,
			parameterMatcherNames: node.params.map((param) => param.matcher),
			parameterEncodingByName: Object.fromEntries(node.params.flatMap((param) => (
				param.encoding == null ? [] : [[param.name, param.encoding]]
			))),
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
		entityByType: compiledEntityByType,
		entityFacetByPath,
		facetAncestorConditionsByPath,
		facetDependencyConditionsByPath,
		valueTypeById: nullPrototypeRecord([...valueTypeById]),
		sourceProviders,
		sources,
		sourceBindings: compiledSourceBindings,
		resolverModules,
		navigationItems,
		compositeRouteParams: [...new Map(indexedRouteNodes
			.flatMap((node) => node.params)
			.filter((routeParam) => routeParam.matchers.length > 1)
			.map((routeParam) => [routeParam.matcher, {
				matcher: routeParam.matcher,
				matchers: routeParam.matchers,
			}] as const)).values()],
		routeFixturePlans,
		physicalRouteFiles,
		collectionRouteByEntity: nullPrototypeRecord([...collectionRouteByEntity]),
		collectionRoutesBySourceField: nullPrototypeRecord([...collectionRoutesBySourceField]),
		entityRouteLinksByType: nullPrototypeRecord([...entityRouteLinksByType]),
	} satisfies CompiledAppFacts

	const duplicatePhysicalPaths = compiledApp.physicalRouteFiles
		.map((routeFile) => routeFile.path)
		.filter((filePath, index, paths) => paths.indexOf(filePath) !== index)
	if (duplicatePhysicalPaths.length > 0)
		throw new Error(`Duplicate physical route file plans:\n${unique(duplicatePhysicalPaths).join('\n')}`)

	// Emitters receive only the indexes and ordered plans they consume. APP.ts is
	// deliberately not available below this boundary.
	const generationInput = {
		indexes: {
			collectionRouteByEntity: compiledApp.collectionRouteByEntity,
			collectionRoutesBySourceField: compiledApp.collectionRoutesBySourceField,
			entityByType: compiledApp.entityByType,
			entityFacetByPath: compiledApp.entityFacetByPath,
			entityRouteLinksByType: compiledApp.entityRouteLinksByType,
			facetAncestorConditionsByPath: compiledApp.facetAncestorConditionsByPath,
			facetDependencyConditionsByPath: compiledApp.facetDependencyConditionsByPath,
			sourceBindings: compiledApp.sourceBindings,
			valueTypeById: compiledApp.valueTypeById,
		},
		entities: compiledApp.activeEntities,
		sourceProviders: compiledApp.sourceProviders,
		sources: compiledApp.sources,
		navigationItems: compiledApp.navigationItems,
		resolverModules: compiledApp.resolverModules,
		routeFixturePlans: compiledApp.routeFixturePlans,
		compositeRouteParams: compiledApp.compositeRouteParams,
		physicalRouteFiles: compiledApp.physicalRouteFiles,
	} satisfies GenerationInput

	return freezeCompiled({
		generatedFiles: generateFiles(generationInput),
	})
}

// The manifest below is the complete generated product. Its ordering is stable,
// and publication removes generated files that are no longer in this manifest.
const generateFiles = (generationInput: GenerationInput): GeneratedFile[] => {
	const indexes = generationInput.indexes
	const entityTypes = generationInput.entities.map(({ entityType }) => entityType)
	const sourceProviders = generationInput.sourceProviders
	const sourceProviderNames = sourceProviders.map(({ provider }) => provider)
	const sourceDefinitionById = nullPrototypeRecord(generationInput.sources.map((source) => [
		String(source.source),
		source,
	]))
	const namedSourceSelections = [...new Map(unique(generationInput.entities.flatMap(entityNamedSourceSelections))
		.map((selection) => [sourceSelectionFunctionName(selection), {
			selection,
			functionName: sourceSelectionFunctionName(selection),
		}] as const)).values()]
	const summaryPlanByEntityType = new Map(generationInput.entities.map((entity) => [
		entity.entityType,
		compileSummaryPlan(entity, indexes),
	]))
	const summaryPlanningIndexes = {
		...indexes,
		summaryPlanByEntityType,
	}
	// Nested singular views need the target component's exact prefetched prop
	// contract, so compile that contract before rendering any view file.
	const singularViewPlans = generationInput.entities.map((entity) => ({
		entity,
		plan: compileSingularViewPlan(entity, summaryPlanningIndexes),
	}))
	const prefetchedSingularViewEntityTypes = new Set(singularViewPlans.flatMap(({ entity, plan }) => (
		plan.consumesPrefetched ?
			[entity.entityType]
			:
			[]
	)))
	const pluralViewPlanByEntityType = new Map(generationInput.entities.map((entity) => [
		entity.entityType,
		generatePluralViewPlan(entity, summaryPlanningIndexes),
	]))
	const defaultPluralViewEntityTypes = new Set(generationInput.entities.flatMap((entity) => (
		pluralViewPlanByEntityType.get(entity.entityType)?.isExactDefault === true ?
			[entity.entityType]
		:
			[]
	)))
	const renderingIndexes = {
		...summaryPlanningIndexes,
		defaultPluralViewEntityTypes,
		prefetchedSingularViewEntityTypes,
	}
	const entityViewFiles = singularViewPlans.flatMap(({ entity, plan }) => [
		generateSingularViewFile(entity, renderingIndexes, plan),
		...(defaultPluralViewEntityTypes.has(entity.entityType) ? [] : [
			pluralViewPlanByEntityType.get(entity.entityType)?.file,
		]),
	]).filter((file) => file != null)
	const routeFiles = generationInput.physicalRouteFiles.flatMap((plan) => generateRouteFiles(plan, renderingIndexes))
	const files = [
		// Schema contracts.
		...([
			['EntityFieldCardinality', Object.values(EntityFieldCardinality)],
			['EntityFieldType', Object.values(EntityFieldType)],
		] as const).map(([name, members]) => tsFile(
			`src/schema/${name}.ts`,
			{
				body: [
					emitStringEnum(name, members),
				],
			}
		)),
		tsFile(
			'src/schema/EntityType.ts',
			{
				body: [
					emitStringEnum('EntityType', entityTypes),
				],
			}
		),
		...generationInput.entities.flatMap(generateEntityEnumFiles),
		...generationInput.entities.map((entity) => generateEntitySchemaFile(entity, indexes)),
		// Source registry, bindings, credentials, documentation, and resolver index.
		generateSchemaIndexFile(entityTypes),
		{
			path: 'SOURCES.md',
			kind: 'text',
			body: lines(emitCompiledSourcesMarkdown({
				sourceBindings: indexes.sourceBindings,
				sourceProviders,
				sources: generationInput.sources,
			})),
		},
		tsFile(
			'src/sources/Source.ts',
			{
				body: [
					emitStringEnum('Source', generationInput.sources.map(({ source }) => source)),
				],
			}
		),
		generateSourceBindingFile(),
		generateSourceProviderEnumFile(sourceProviderNames),
		...sourceProviders.flatMap((provider) => {
			const providerBindings = indexes.sourceBindings.filter((sourceBinding) => (
				sourceDefinitionById[sourceBinding.source].provider === provider.provider
			))
			return [
				generateSourceProviderBindingsFile(provider, providerBindings),
				generateSourceProviderDefinitionFile(
					provider,
					generationInput.sources.filter((source) => source.provider === provider.provider),
					providerBindings
				),
			]
		}),
		generateSourceProvidersFile(sourceProviderNames),
		generateSourceServerCredentialsFile(indexes.sourceBindings),
		...generateSourceSelectionFiles(namedSourceSelections),
		generateNavigationItemsFile(generationInput.navigationItems),
		generateResolverIndexFile(generationInput.resolverModules),
		generateE2eRouteFixtureMetadataFile(generationInput.routeFixturePlans),
		// Product views, route matchers, and physical SvelteKit route files.
		...entityViewFiles,
		...generationInput.compositeRouteParams.map((routeParam) => tsFile(
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
		...routeFiles,
	]
	const paths = files.map((generatedFile) => generatedFile.path)
	const duplicatePaths = paths.filter((filePath, index) => paths.indexOf(filePath) !== index)
	if (duplicatePaths.length > 0)
		throw new Error(`Duplicate generated output paths:\n${unique(duplicatePaths).join('\n')}`)

	return files
}

// Schema output
//
// These emitters translate compiled entity/value/facet facts directly into the
// runtime schema modules. They do not infer product behavior from generated code.
const generateE2eRouteFixtureMetadataFile = (routeFixturePlans: readonly RouteFixturePlan[]) => {
	const matcherNames = unique(routeFixturePlans.flatMap((plan) => plan.parameterMatcherNames))
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
			'export const matchE2eRouteParam = (matcher: string, value: string) => {',
			'\tswitch (matcher) {',
			...matcherNames.map((matcher) => `\t\tcase ${emitTypeScript(matcher)}: return match${matcher[0]?.toUpperCase()}${matcher.slice(1)}(value)`),
			'\t\tdefault: throw new Error(`Missing generated route matcher ${matcher}`)',
			'\t}',
			'}',
			'',
			'export type E2eRouteFixtureMapping = {',
			'\tid: string',
			'\tprojectionEntity?: string',
			'\tprobeCaseId?: string',
			'\tprobeAtomPrefixes: readonly string[]',
			'\tprobeCases: readonly (readonly (readonly [prefixIndex: number, caseNumber: string, fields: readonly string[]])[])[]',
			'\tprojectionPath?: readonly [string, ...string[]]',
			'\tboundaryLiveOptional?: true',
			'}',
			'',
			'export type E2eRouteFixtureMetadata = {',
			'\trouteId: string',
			'\tparameterEncodingByName?: Readonly<Record<string, \'Opaque\' | \'Path\'>>',
			'\tmappings: readonly E2eRouteFixtureMapping[]',
			'\tboundaryLiveOptional?: true',
			'}',
			'',
			`export const e2eRouteFixtureMetadataByNodeId = ${emitObject(routeFixturePlans
				.map((metadata) => [
					metadata.nodeId,
					emitObject([
						['routeId', emitTypeScript(metadata.routeId)],
						['parameterEncodingByName', Object.keys(metadata.parameterEncodingByName).length === 0 ?
							undefined
						:
							emitObject(Object.entries(metadata.parameterEncodingByName).map(([param, encoding]) => [
								param,
								emitTypeScript(encoding),
							]))],
						['mappings', emitArray(metadata.mappings.map((mapping) => emitObject(routeMappingFixtureMetadataEntries(
							mapping,
							metadata.parameterMatcherNames.length
						))))],
						['boundaryLiveOptional', metadata.boundaryLiveOptional ? 'true' : undefined],
					]),
			]))} as const satisfies Record<string, E2eRouteFixtureMetadata>`,
			'',
			'type E2eRouteProbeAtomForReference<',
			'\t_Prefixes extends readonly string[],',
			'\t_Reference',
			'> = _Reference extends readonly [',
			'\tprefixIndex: infer _PrefixIndex extends number,',
			'\tcaseNumber: infer _CaseNumber extends string,',
			'\tfields: infer _Fields extends readonly string[],',
			'] ? `${_Prefixes[_PrefixIndex]}.${_CaseNumber}.${_Fields[number]}` : never',
			'',
			'type E2eRouteProbeAtomForMapping<_Mapping> = _Mapping extends {',
			'\tprobeAtomPrefixes: infer _Prefixes extends readonly string[]',
			'\tprobeCases: infer _Cases extends readonly (readonly (readonly [number, string, readonly string[]])[])[]',
			'} ? {',
			'\t[_Case in keyof _Cases]: E2eRouteProbeAtomForReference<_Prefixes, _Cases[_Case][number]>',
			'}[number] : never',
			'',
			'export type E2eRouteProbeAtom = E2eRouteProbeAtomForMapping<',
			'\t(typeof e2eRouteFixtureMetadataByNodeId)[keyof typeof e2eRouteFixtureMetadataByNodeId][\'mappings\'][number]',
			'>',
		],
	}
)}

const emitValueTypeType = (valueTypeType: ValueTypeType | undefined): string => {
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
		return `${emitValueTypeType(valueTypeType.array)}.array()`
	if ('object' in valueTypeType)
		return `type(${emitObject(valueTypeType.object.map((field) => [
			field.name,
			emitValueTypeType(field.type),
		]))})`

	return typeof valueTypeType.raw === 'string' ? valueTypeType.raw : valueTypeType.raw.raw
}

const valueTypeTypeRequiresDisplayExpression = (valueTypeType: ValueTypeType | undefined) => (
	valueTypeType != null
	&& (
		'object' in valueTypeType
		|| 'array' in valueTypeType
		|| 'primitive' in valueTypeType && valueTypeType.primitive === 'unknown'
	)
)

const valueTypeEnumNames = (valueTypeType: ValueTypeType | undefined): string[] => {
	if (valueTypeType == null)
		return []
	if ('enum' in valueTypeType)
		return [valueTypeType.enum]
	if ('array' in valueTypeType)
		return valueTypeEnumNames(valueTypeType.array)
	if ('object' in valueTypeType)
		return valueTypeType.object.flatMap((field) => valueTypeEnumNames(field.type))

	return []
}

const generateEntitySchemaFile = (entity: Entity, indexes: GenerationIndexes) => {
	// Schema field discovery remains depth-first to mirror the nested schema
	// syntax emitted by emitSchemaFacetEntry; contribution precedence is separate.
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
	const valueTypeImports = fields.flatMap((field) => {
		const valueType = field.valueType == null ? undefined : indexes.valueTypeById[field.valueType]
		return [
			...emitImportObject(valueType?.imports),
			...valueTypeEnumNames(valueType?.type).flatMap((enumName) => (
				emitImportObject(indexes.valueTypeById[enumName]?.imports)
			)),
		]
				.filter((importSpec) => (
					importSpec.from !== schemaModulePath(entity.entityType)
					|| [
						...(importSpec.names ?? []),
						...(importSpec.typeNames ?? []),
					].every((name) => !localEnumNames.has(name))
				))
	})
	const body = [
		'export default entity({',
			indent(`entityType: ${enumAccess('EntityType', entity.entityType)},`),
			indent('labels: {'),
			indent(`singular: ${emitTypeScript(entityLabel(entity))},`, 2),
			indent(`plural: ${emitTypeScript(entityLabelPlural(entity))},`, 2),
			indent('},'),
			...(entity.description == null ? [] : [indent(`description: ${emitTypeScript(entity.description)},`)]),
			`})({`,
			...entity.fields.flatMap((fieldDefinition) => emitSchemaFieldEntry(fieldDefinition, indexes).map((line) => indent(line))),
			`})({`,
			indent('selectors: {'),
			...entity.selectors.flatMap((selector) => [
				indent(`${objectPropertyKey(selector.name)}: [`, 2),
				...selector.fields.map((fieldName) => indent(`${emitTypeScript(fieldName)},`, 3)),
				indent('],', 2),
			]),
			indent('},'),
			...(entity.facets == null || entity.facets.length === 0 ? [] : [
				'',
				indent('facets: {'),
				...entity.facets.flatMap((facetDefinition) => emitSchemaFacetEntry(facetDefinition, indexes).map((line) => indent(line, 2))),
				indent('},'),
			]),
		`})`,
	]
	const imports: ImportSpec[] = [
		...(typeScriptSourceReferencesBinding(body.join('\n'), 'type') ? [{
			from: 'arktype',
			names: ['type'],
		}] satisfies ImportSpec[] : []),
		{
			from: '$/schema/$schema.ts',
			names: [
				'entity',
				...(entity.facets == null || entity.facets.length === 0 ? [] : ['facet']),
			],
		},
		{
			from: '$/schema/EntityFieldCardinality.ts',
			names: ['EntityFieldCardinality'],
		},
		{
			from: '$/schema/EntityType.ts',
			names: ['EntityType'],
		},
		...(defaultSources ? [{
			from: '$/sources/Source.ts',
			names: ['Source'],
		}] satisfies ImportSpec[] : []),
		...(entity.enums ?? []).map((appEnum) => ({
			from: schemaEnumModulePath(appEnum.name),
			names: [appEnum.name],
		})),
		...valueTypeImports,
	]

	return tsFile(
		schemaModulePath(entity.entityType).replace(/^\$\//, 'src/'),
		{
			imports,
			body,
		}
	)
}

const generateEntityEnumFiles = (entity: Entity) => (entity.enums ?? []).map((appEnum) => tsFile(
	schemaEnumModulePath(appEnum.name).replace(/^\$\//, 'src/'),
	{
		body: [[
			`export enum ${appEnum.name} {`,
			...appEnum.members.map((member) => `\t${member.name} = ${emitTypeScript(member.value)},`),
			'}',
		].join('\n')],
	}
))

const emitSchemaFieldEntry = (fieldDefinition: EntityField, indexes: GenerationIndexes) => [
	`${objectPropertyKey(fieldDefinition.name)}: {`,
	...emitObject([
		[
			'primitiveType',
			fieldDefinition.type === EntityFieldType.Primitive ?
				emitValueTypeType((fieldDefinition.valueType == null ? undefined : indexes.valueTypeById[fieldDefinition.valueType])?.type ?? fieldDefinition.primitiveType)
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
		['defaultSources', emitSourceArray(fieldDefinition.defaultSources)],
		['normalize', fieldDefinition.normalize],
	]).split('\n').slice(1, -1),
	'},',
]

const emitSchemaFacetEntry = (
	facetDefinition: NonNullable<Entity['facets']>[number],
	indexes: GenerationIndexes
) => {
	const fieldStage = (facetDefinition.fields?.length ?? 0) === 0 ? [
		`${objectPropertyKey(facetDefinition.name)}: facet(${emitFacetCondition(facetDefinition.condition)})({})`,
	] : [
		`${objectPropertyKey(facetDefinition.name)}: facet(${emitFacetCondition(facetDefinition.condition)})({`,
		...(facetDefinition.fields ?? []).flatMap((fieldDefinition) => emitSchemaFieldEntry(fieldDefinition, indexes).map((line) => indent(line))),
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
		...facetDefinition.facets.flatMap((facet) => emitSchemaFacetEntry(facet, indexes).map((line) => indent(line, 2))),
		indent('},'),
		'}),',
	]
}

const generateSchemaIndexFile = (entityTypes: readonly string[]) => {
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
		'export type RegisteredEntityDefinitionByType = typeof entityDefinitionByType',
		'export type RegisteredEntityType = keyof RegisteredEntityDefinitionByType',
		'export type RegisteredSchema = typeof schema & {',
		'\treadonly entityDefinitionByType: RegisteredEntityDefinitionByType',
		'}',
		'export type RegisteredEntitySelector<_EntityType extends RegisteredEntityType> = EntitySelector<RegisteredSchema, _EntityType>',
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
						'EntitySelector',
						'Schema',
					],
				},
				...entityTypes.map((entityType) => ({
					from: schemaModulePath(entityType),
					defaultName: `${entityType}Schema`,
				})),
			],
			body,
		}
	)
}

// Source output
//
// Provider definitions own static binding facts. Runtime clients consume those
// generated definitions instead of accepting copies of binding axes everywhere.
// Each provider index remains a standalone extension boundary so a source can be
// added or edited without depending on the APP compiler or a monolithic registry.
const emitMarkdownTable = (
	headings: readonly string[],
	rows: readonly (readonly string[])[]
) => [
	`| ${headings.join(' | ')} |`,
	`| ${headings.map(() => '---').join(' | ')} |`,
	...rows.map((row) => `| ${row.map((value) => value
		.replaceAll('&', '&amp;')
		.replaceAll('|', '&#124;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('\n', '<br>')).join(' | ')} |`),
]

const emitCompiledSourcesMarkdown = (sourcesMarkdown: SourcesMarkdownInput) => {
	const sourceDefinitionById = nullPrototypeRecord(sourcesMarkdown.sources.map((source) => [
		String(source.source),
		source,
	]))
	const sourceBindingRows = sourcesMarkdown.sourceBindings.map((sourceBinding, bindingIndex) => ({
		...sourceBinding,
		bindingNumber: String(bindingIndex + 1),
	}))
	const sections = Object.entries({
		Providers: emitMarkdownTable(
			[
				'Provider',
				'Label',
			],
			sourcesMarkdown.sourceProviders.map((provider) => [
				provider.provider,
				provider.label,
			])
		),
		Sources: emitMarkdownTable(
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
		Bindings: emitMarkdownTable(
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
			sourceBindingRows.map(({ binding, bindingNumber, source }) => [
				bindingNumber,
				sourceDefinitionById[source].provider,
				String(source),
				binding.target.kind,
				binding.target.key,
				binding.wireProtocol,
				binding.apiFamily,
				binding.operationGroups.join(', '),
				binding.delivery,
			])
		),
		Endpoints: emitMarkdownTable(
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
				endpoint.endpointKind === SourceEndpointKind.HttpUrl
				&& !endpoint.locator.startsWith('env:') ?
					httpOriginFromLocator(endpoint.locator) ?? ''
				:
					'',
				endpoint.corsEnabled == null ? '' : String(endpoint.corsEnabled),
			]))
		),
		Credentials: emitMarkdownTable(
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
				(
					(
						credential.scope === SourceCredentialScope.PublicConfig ?
							credential.env?.keys.map(({ name }) => name)
						:
							credential.keys
					)
					?? []
				).join(', '),
			]))
		),
		Artifacts: emitMarkdownTable(
			[
				'Binding',
				'Artifact',
				'Kind',
				'Path',
				'Generated',
				'Official URL',
				'Reference URL',
			],
			sourceBindingRows.flatMap(({ binding, bindingNumber }) => (binding.artifacts ?? []).map((artifact, artifactIndex) => [
				bindingNumber,
				String(artifactIndex + 1),
				artifact.kind,
				artifact.path,
				artifact.generated ? 'yes' : 'no',
				artifact.officialUrl ?? '',
				artifact.referenceUrl ?? '',
			]))
		),
	})

	return [
		'# Blockhead Sources',
		'',
		'This file is generated from APP compiler-plane source metadata: the canonical provider, source, and binding declarations in `APP.ts`. Active source modules are neither imported nor read during generation.',
		'',
		'Provider/source identity, target, endpoint reality, protocol, API family, operation groups, delivery, credentials, and artifacts remain independent axes. Artifacts and generated clients are binding metadata. CORS is recorded per HTTP endpoint; proxy and live behavior are recorded as delivery.',
		'',
		`${sourcesMarkdown.sourceProviders.length} providers register ${sourcesMarkdown.sources.length} sources and ${sourceBindingRows.length} bindings.`,
		'',
		...sections.flatMap(([title, table], index) => [
			...(index === 0 ? [] : ['']),
			`## ${title}`,
			'',
			...table,
		]),
	].join('\n')
}

export const renderSourcesMarkdown = ({ generatedFiles }: Pick<CompiledApp, 'generatedFiles'>) => {
	const sourcesMarkdown = generatedFiles.find((generatedFile) => generatedFile.path === 'SOURCES.md')
	if (sourcesMarkdown?.kind !== 'text')
		throw new Error('Compiled APP render IR does not contain SOURCES.md')

	return sourcesMarkdown.body.join('\n')
}

type SourceBindingIdentityInput = Pick<
	SourceBinding,
	| 'target'
	| 'delivery'
	| 'apiFamily'
> & {
	source: string
}

// One ordered descriptor drives both compiler IDs and the emitted runtime ID.
const sourceBindingIdentityAxes = [
	['source', ({ source }) => source],
	['target.kind', ({ target }) => target.kind],
	['target.key', ({ target }) => target.key],
	['delivery', ({ delivery }) => delivery],
	['apiFamily', ({ apiFamily }) => apiFamily],
] satisfies readonly (readonly [
	string,
	(binding: SourceBindingIdentityInput) => string,
])[]

export const sourceBindingId = (binding: SourceBindingIdentityInput) => JSON.stringify(
	sourceBindingIdentityAxes.map(([, value]) => value(binding))
)

const generateSourceBindingFile = () => tsFile(
	'src/sources/SourceBinding.ts',
	{
		imports: [
			{
				from: '$/constants/Network.ts',
				typeNames: [
					'Caip2NetworkKey',
					'NetworkSlug',
				],
			},
			{
				from: 'arktype',
				typeNames: ['Type'],
			},
			{
				from: '$/sources/Source.ts',
				names: ['Source'],
			},
			{
				from: '$/sources/$sources.ts',
				typeNames: ['SourcePublicEnv'],
			},
		],
		body: [
			emitStringEnum('SourceTargetKind', Object.values(SourceTargetKind)),
			'',
			emitStringEnum('SourceEndpointKind', Object.values(SourceEndpointKind)),
			'',
			emitStringEnum('WireProtocol', Object.values(WireProtocol)),
			'',
			emitStringEnum('ApiFamily', Object.values(ApiFamily)),
			'',
			emitStringEnum('SourceOperationGroup', Object.values(SourceOperationGroup)),
			'',
			emitStringEnum('SourceDelivery', Object.values(SourceDelivery)),
			'',
			emitStringEnum('SourceCredentialScope', Object.values(SourceCredentialScope)),
			'',
			emitStringEnum('SourceArtifactKind', Object.values(SourceArtifactKind)),
			'',
			...lines(`type NonZeroDecimalDigit = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
type Eip155ChainKey = \`${'${NonZeroDecimalDigit}'}${'${string}'}\` & \`${'${bigint}'}\`

export type SourceTarget =
	| {
		kind: SourceTargetKind.Caip2Network
		key: Caip2NetworkKey
	}
	| {
		kind: SourceTargetKind.NetworkSlug
		key: NetworkSlug
	}
	| {
		kind: SourceTargetKind.Eip155Chain
		key: Eip155ChainKey
	}
	| {
		kind: Exclude<SourceTargetKind, SourceTargetKind.Caip2Network | SourceTargetKind.NetworkSlug | SourceTargetKind.Eip155Chain>
		key: string
	}

export type SourceEndpoint<
	_Kind extends SourceEndpointKind = SourceEndpointKind,
> = _Kind extends SourceEndpointKind ? {
	endpointKind: _Kind
	locator: string
} & (
	_Kind extends SourceEndpointKind.HttpUrl ? {
		corsEnabled?: boolean
	} : {
		corsEnabled?: never
	}
) : never

export const sourceEndpointOrigin = ({
	endpointKind,
	locator,
}: SourceEndpoint) => (
	endpointKind === SourceEndpointKind.HttpUrl
	&& !locator.startsWith('env:')
	&& URL.canParse(locator) ?
		new URL(locator).origin
	:
		undefined
)

export type SourceArtifact<
	_Kind extends SourceArtifactKind = SourceArtifactKind,
> = _Kind extends SourceArtifactKind ? {
	kind: _Kind
	path: string
	generated?: true
} & (
	_Kind extends SourceArtifactKind.HandwrittenTypes ? {
		referenceUrl?: string
		officialUrl?: never
	} : {
		officialUrl?: string
		referenceUrl?: never
	}
) : never

export type SourceCredentialRequirement<
	_Scope extends SourceCredentialScope = SourceCredentialScope,
> = _Scope extends SourceCredentialScope ? {
	scope: _Scope
	env?: Type<SourcePublicEnv>
} & (
	_Scope extends SourceCredentialScope.PublicConfig ? {
		keys?: never
	} : {
		keys?: readonly string[]
	}
) : never

type SourceBindingCompatibilityRow<
	_WireProtocol extends WireProtocol,
	_ApiFamily extends ApiFamily,
	_EndpointKind extends SourceEndpointKind,
	_OperationGroup extends SourceOperationGroup,
	_ArtifactKind extends SourceArtifactKind,
> = {
	wireProtocol: _WireProtocol
	apiFamily: _ApiFamily
	endpoints: readonly [
		SourceEndpoint<_EndpointKind>,
		...SourceEndpoint<_EndpointKind>[],
	]
	operationGroups: readonly [
		_OperationGroup,
		..._OperationGroup[],
	]
	artifacts?: [_ArtifactKind] extends [never] ?
		never
	:
		readonly SourceArtifact<_ArtifactKind>[]
}

type SourceBindingCompatibility =
${sourceBindingCompatibility.map((compatibility) => `\t| SourceBindingCompatibilityRow<${enumAccess('WireProtocol', compatibility.wireProtocol)}, ${compatibility.apiFamilies.map((apiFamily) => enumAccess('ApiFamily', apiFamily)).join(' | ')}, ${compatibility.endpointKinds.map((endpointKind) => enumAccess('SourceEndpointKind', endpointKind)).join(' | ')}, ${compatibility.operationGroups === true ? 'SourceOperationGroup' : compatibility.operationGroups.map((operationGroup) => enumAccess('SourceOperationGroup', operationGroup)).join(' | ')}, ${
			compatibility.artifactKinds === true ?
				'SourceArtifactKind'
			: compatibility.artifactKinds.length === 0 ?
				'never'
			:
				compatibility.artifactKinds.map((artifactKind) => enumAccess('SourceArtifactKind', artifactKind)).join(' | ')
		}>`).join('\n')}

type SourcePublicOrUserCredential = SourceCredentialRequirement<
	| SourceCredentialScope.PublicConfig
	| SourceCredentialScope.UserDelegated
>

type SourceRuntimeSecretRequirement = {
	scope: SourceCredentialScope.RuntimeSecret
	env?: never
	keys?: never
}

type SourcePublicOrUserWithOptionalRuntimeSecret =
	| readonly SourcePublicOrUserCredential[]
	| readonly [
		...SourcePublicOrUserCredential[],
		SourceRuntimeSecretRequirement,
	]

type SourceBindingDelivery =
${sourceBindingDeliveryCompatibility.map((compatibility) => [
	'\t| {',
	`\t\tdelivery: ${compatibility.deliveries.map((delivery) => enumAccess('SourceDelivery', delivery)).join(' | ')}`,
	...(compatibility.wireProtocols === true ? [] : [
		`\t\twireProtocol: ${
			'include' in compatibility.wireProtocols ?
				compatibility.wireProtocols.include.map((wireProtocol) => enumAccess('WireProtocol', wireProtocol)).join(' | ')
			:
				`Exclude<WireProtocol, ${compatibility.wireProtocols.exclude.map((wireProtocol) => enumAccess('WireProtocol', wireProtocol)).join(' | ')}>`
		}`,
	]),
	...(compatibility.apiFamilies === true ? [] : [
		`\t\tapiFamily: ${compatibility.apiFamilies.map((apiFamily) => enumAccess('ApiFamily', apiFamily)).join(' | ')}`,
	]),
	...(compatibility.endpointLayout === SourceBindingDeliveryEndpointLayout.Compatible ? [] :
	compatibility.endpointLayout === SourceBindingDeliveryEndpointLayout.BrowserDirect ? [
		'\t\tendpoints: readonly (',
		'\t\t\t| (SourceEndpoint<SourceEndpointKind.HttpUrl> & { corsEnabled: true })',
		'\t\t\t| SourceEndpoint<SourceEndpointKind.BrowserWalletProvider | SourceEndpointKind.InProcess>',
		'\t\t)[]',
	] : compatibility.endpointLayout === SourceBindingDeliveryEndpointLayout.HttpOnly ? [
		'\t\tendpoints: readonly SourceEndpoint<SourceEndpointKind.HttpUrl>[]',
	] : [
		'\t\tendpoints:',
		'\t\t\t| readonly [',
		'\t\t\t\tSourceEndpoint<SourceEndpointKind.WebSocketUrl>,',
		'\t\t\t\t...SourceEndpoint<SourceEndpointKind.WebSocketUrl>[],',
		'\t\t\t]',
		'\t\t\t| readonly [',
		'\t\t\t\tSourceEndpoint<SourceEndpointKind.HttpUrl>,',
		'\t\t\t\tSourceEndpoint<SourceEndpointKind.WebSocketUrl>,',
		'\t\t\t\t...SourceEndpoint<SourceEndpointKind.WebSocketUrl>[],',
		'\t\t\t]',
	]),
	`\t\tcredentials: ${
		compatibility.credentialLayout === SourceBindingDeliveryCredentialLayout.PublicOrUser ?
			'readonly SourcePublicOrUserCredential[]'
		: compatibility.credentialLayout === SourceBindingDeliveryCredentialLayout.PublicOrUserWithOptionalRuntimeSecret ?
			'SourcePublicOrUserWithOptionalRuntimeSecret'
		:
			'readonly SourceCredentialRequirement[]'
	}`,
	'\t}',
].join('\n')).join('\n')}

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

export type SourceBinding<
	_Source extends Source = Source,
> = {
	source: _Source
	target: SourceTarget
} & SourceBindingCompatibility & SourceBindingDelivery

export const sourceBindingId = ({
	source,
	target,
	delivery,
	apiFamily,
}: Pick<
	SourceBinding,
	| 'source'
	| 'target'
	| 'delivery'
	| 'apiFamily'
>) => JSON.stringify([
${sourceBindingIdentityAxes.map(([expression]) => `\t${expression},`).join('\n')}
])

export type SourceBindingIndex = {
	readonly [_Source in Source]?:
		| SourceBinding<_Source>
		| readonly SourceBinding<_Source>[]
}

type SourceBindingsFor<
	_Bindings extends readonly SourceBinding[],
	_Source extends Source,
	_Matches extends readonly SourceBinding[] = [],
> = number extends _Bindings['length'] ?
	readonly Extract<_Bindings[number], SourceBinding<_Source>>[]
: _Bindings extends readonly [
	infer _Binding extends SourceBinding,
	...infer _Remaining extends readonly SourceBinding[],
] ?
	SourceBindingsFor<
		_Remaining,
		_Source,
		_Binding['source'] extends _Source ?
			readonly [..._Matches, _Binding]
		:
			_Matches
	>
:
	_Matches extends readonly [infer _Binding extends SourceBinding] ?
		_Binding
	:
		_Matches

type SourceBindingIndexFrom<
	_Bindings extends readonly SourceBinding[],
> = {
	readonly [_Source in _Bindings[number]['source']]:
		SourceBindingsFor<_Bindings, _Source>
}

export function indexSourceBindings<
	const _Bindings extends readonly SourceBinding[],
>(
	bindings: _Bindings
): SourceBindingIndexFrom<_Bindings>
export function indexSourceBindings(
	bindings: readonly SourceBinding[]
): SourceBindingIndex {
	return Object.fromEntries(
		Object.entries(Object.groupBy(bindings, ({ source }) => source))
			.map(([source, sourceBindings]) => [
				source,
				sourceBindings.length === 1 ? sourceBindings[0] : sourceBindings,
			])
	)
}`),
		],
	}
)

const generateSourceProviderEnumFile = (sourceProviderNames: readonly string[]) => tsFile(
	'src/sources/SourceProvider.ts',
	{
		body: [
			emitStringEnum('SourceProvider', sourceProviderNames),
		],
	}
)

const emitEnvSchema = (env: App['sources']['providers'][number]['env']) => (
	env == null ?
		undefined
	: env.keys.length === 0 ?
		`arktype({\n\t'[string]': 'string',\n})`
	:
		`arktype({\n${env.keys.map((key) => `\t${emitTypeScript(key.name)}: ${emitTypeScript(key.type)},`).join('\n')}\n})`
)

const emitSourceBinding = (
	source: string,
	binding: NonNullable<App['sources']['sources'][number]['binding']>,
	expressions: {
		endpoints: string
		operationGroups: string
		credentials: string
		artifacts?: string
	},
	base?: string
) => emitObject([
	...(base == null ? [
		['source', enumAccess('Source', source)],
	] as const : [{
		spread: base,
	}]),
	['target', emitObject([
		['kind', enumAccess('SourceTargetKind', binding.target.kind)],
		['key', emitTypeScript(binding.target.key)],
	])],
	['endpoints', expressions.endpoints],
	...(base == null ? [
		['wireProtocol', enumAccess('WireProtocol', binding.wireProtocol)],
		['apiFamily', enumAccess('ApiFamily', binding.apiFamily)],
		['operationGroups', expressions.operationGroups],
		['delivery', enumAccess('SourceDelivery', binding.delivery)],
		['credentials', expressions.credentials],
		['artifacts', expressions.artifacts],
	] as const : []),
])

const emitSourceBindingBase = (
	source: string,
	binding: NonNullable<App['sources']['sources'][number]['binding']>,
	expressions: {
		operationGroups: string
		credentials: string
		artifacts?: string
	}
) => emitObject([
	['source', enumAccess('Source', source)],
	['wireProtocol', enumAccess('WireProtocol', binding.wireProtocol)],
	['apiFamily', enumAccess('ApiFamily', binding.apiFamily)],
	['operationGroups', expressions.operationGroups],
	['delivery', enumAccess('SourceDelivery', binding.delivery)],
	['credentials', expressions.credentials],
	['artifacts', expressions.artifacts],
])

// Repeated binding values are declared once beside the rows that consume them.
type RepeatedBindingValue = {
	identity: string
	expression?: string
	valueName: string
}

const planRepeatedBindingValues = (
	scope: string,
	fallbackValueName: string,
	rows: readonly RepeatedBindingValue[]
) => {
	const sharedRows = [...Map.groupBy(rows, ({ identity }) => identity).values()]
		.flatMap((matchingRows) => {
			const row = matchingRows[0]
			return matchingRows.length > 1 && row?.expression != null ?
				[{
					identity: row.identity,
					expression: row.expression,
					valueName: matchingRows.every(({ valueName }) => valueName === row.valueName) ?
						row.valueName
					:
						fallbackValueName,
				}]
			:
				[]
		})
	if (sharedRows.length === 0)
		return

	const scopeName = pascal(scope)
	const scopedSharedRows = sharedRows.map((row) => ({
		...row,
		valueName: row.valueName.startsWith(scopeName) ?
			row.valueName.length === scopeName.length ?
				fallbackValueName
			:
				row.valueName.slice(scopeName.length)
		:
			row.valueName,
	}))
	const nameByIdentity = new Map(
		[...Map.groupBy(scopedSharedRows, ({ valueName }) => valueName).values()]
			.flatMap((matchingRows) => matchingRows.map(({ identity, valueName }, index) => [
				identity,
				`${camel(scope)}${valueName}${matchingRows.length === 1 ? '' : index + 1}`,
			] as const))
	)

	return {
		declarations: sharedRows.map(({ identity, expression }) => `const ${nameByIdentity.get(identity)} = ${expression} as const`),
		nameByIdentity,
	}
}

const bindingValueReference = (
	plan: ReturnType<typeof planRepeatedBindingValues>,
	{ identity, expression }: RepeatedBindingValue
) => plan?.nameByIdentity.get(identity) ?? expression

const generateSourceProviderBindingsFile = (
	provider: SourceProviderDefinition,
	bindings: readonly SourceBindingEntry[]
) => {
	// Binding rows keep scalars inline and share repeated arrays across the
	// provider file, including when sibling sources use the same endpoint or
	// credential catalog.
	const providerName = pascal(provider.provider)
	const providerHasMultipleSources = new Set(bindings.map(({ source }) => source)).size > 1
	const bindingRows = bindings.map(({ binding, source }) => {
		const sourceName = pascal(String(source))
		const targetName = pascal(binding.target.key.replace(/[^A-Za-z0-9]+/g, '-'))
		const sourceSuffix = sourceName.startsWith(providerName) ? sourceName.slice(providerName.length) : sourceName
		const targetSuffix = targetName.startsWith(providerName) ? targetName.slice(providerName.length) : targetName
		const publicCredentials = binding.credentials.map((credential) => ({
			scope: credential.scope,
			...(!('envKey' in credential) && credential.env != null && {
				env: credential.env,
			}),
			...(
				!('envKey' in credential)
				&& credential.scope !== SourceCredentialScope.PublicConfig
				&& credential.keys != null
				&& {
					keys: credential.keys,
				}
			),
		}))
		return {
			binding,
			source: String(source),
			endpoints: {
				identity: JSON.stringify(binding.endpoints),
				expression: emitArray(binding.endpoints.map((endpoint) => emitObject([
					['endpointKind', enumAccess('SourceEndpointKind', endpoint.endpointKind)],
					['locator', emitTypeScript(endpoint.locator)],
					['corsEnabled', endpoint.corsEnabled == null ? undefined : String(endpoint.corsEnabled)],
				]))),
				valueName: providerHasMultipleSources ? `${targetSuffix}Endpoints` : 'Endpoints',
			},
			operationGroups: {
				identity: JSON.stringify(binding.operationGroups),
				expression: emitArray(binding.operationGroups.map((group) => enumAccess('SourceOperationGroup', group))),
				valueName: `${binding.operationGroups.join('')}OperationGroups`,
			},
			credentials: {
				identity: JSON.stringify(publicCredentials),
				expression: publicCredentials.length === 0 ? undefined : emitArray(publicCredentials.map((credential) => emitObject([
					['scope', enumAccess('SourceCredentialScope', credential.scope)],
					['env', emitEnvSchema(credential.env)],
					['keys', credential.keys == null ? undefined : emitArray(credential.keys.map(emitTypeScript))],
				]))),
				valueName: providerHasMultipleSources ? `${targetSuffix}Credentials` : 'Credentials',
			},
			artifacts: {
				identity: JSON.stringify(binding.artifacts ?? null),
				expression: (
					binding.artifacts == null ?
						undefined
					:
						emitArray(binding.artifacts.map((artifact) => emitObject([
							['kind', enumAccess('SourceArtifactKind', artifact.kind)],
							['path', emitTypeScript(artifact.path)],
							['generated', artifact.generated === true ? 'true' : undefined],
							['officialUrl', artifact.officialUrl == null ? undefined : emitTypeScript(artifact.officialUrl)],
							['referenceUrl', artifact.referenceUrl == null ? undefined : emitTypeScript(artifact.referenceUrl)],
						])))
				),
				valueName: providerHasMultipleSources ? `${sourceSuffix}Artifacts` : 'Artifacts',
			},
		}
	})
	const sourcePlans = Object.entries(
		Object.groupBy(bindingRows, ({ source }) => source)
	).map(([source, sourceBindingRows]) => {
		const sourceTypeName = pascal(source)
		const bindingGroups = [...Map.groupBy(sourceBindingRows, ({ binding }) => (
			JSON.stringify([
				binding.wireProtocol,
				binding.apiFamily,
				binding.operationGroups,
				binding.delivery,
				binding.credentials,
				binding.artifacts ?? null,
			])
		)).values()]
		const repeatedBindingGroups = bindingGroups.filter((group) => group.length > 1)
		// One repeated group needs only its source name. Multiple groups append the
		// shortest existing binding axis that distinguishes every emitted object.
		const bindingBaseDiscriminator = (
			repeatedBindingGroups.length < 2 ?
				undefined
			: new Set(repeatedBindingGroups.map((group) => group[0]?.binding.delivery)).size === repeatedBindingGroups.length ?
				'delivery'
			: new Set(repeatedBindingGroups.map((group) => group[0]?.binding.apiFamily)).size === repeatedBindingGroups.length ?
				'apiFamily'
			:
				null
		)
		if (bindingBaseDiscriminator === null)
			throw new Error(`${source}: repeated binding groups need a unique delivery or API-family discriminator`)

		const bindingBaseNames = bindingGroups.map((group) => {
			const binding = group[0]?.binding
			return binding == null || group.length < 2 ?
				undefined
			:
				`${camel(source)}${
					bindingBaseDiscriminator === 'delivery' ?
						binding.delivery
					: bindingBaseDiscriminator === 'apiFamily' ?
						binding.apiFamily.startsWith(sourceTypeName) ?
							binding.apiFamily.slice(sourceTypeName.length)
						:
							binding.apiFamily
					:
						''
				}BindingAxes`
		})
		const bindingBaseNameByBinding = new Map(bindingGroups.flatMap((group, groupIndex) => {
			const bindingBaseName = bindingBaseNames[groupIndex]
			return bindingBaseName == null ?
				[]
			:
				group.map(({ binding }) => [binding, bindingBaseName] as const)
		}))
		return {
			source,
			sourceBindingRows,
			bindingGroups,
			bindingBaseNameByBinding,
			bindingBaseNames,
		}
	})
	const sharedValueScope = providerHasMultipleSources ?
		provider.provider
	:
		bindingRows[0]?.source ?? provider.provider
	// A shared binding-axis object is one emitted consumer. Planning repeated
	// values from those final consumers prevents aliases used only by that object.
	const bindingAxisRows = sourcePlans.flatMap(({ bindingGroups, bindingBaseNames }) => (
		bindingGroups.flatMap((group, groupIndex) => (
			bindingBaseNames[groupIndex] == null ? group : group.slice(0, 1)
		))
	))
	const properties = {
		endpoints: planRepeatedBindingValues(sharedValueScope, 'Endpoints', bindingRows.map(({ endpoints }) => endpoints)),
		operationGroups: planRepeatedBindingValues(sharedValueScope, 'OperationGroups', bindingAxisRows.map(({ operationGroups }) => operationGroups)),
		credentials: planRepeatedBindingValues(sharedValueScope, 'Credentials', bindingAxisRows.map(({ credentials }) => credentials)),
		artifacts: planRepeatedBindingValues(sharedValueScope, 'Artifacts', bindingAxisRows.map(({ artifacts }) => artifacts)),
	}
	const renderedSourcePlans = sourcePlans.map(({
		source,
		sourceBindingRows,
		bindingGroups,
		bindingBaseNameByBinding,
		bindingBaseNames,
	}) => ({
		source,
		declarations: bindingGroups.flatMap((group, groupIndex) => {
			const binding = group[0]?.binding
			const baseIdentifier = bindingBaseNames[groupIndex]
			if (binding == null || baseIdentifier == null)
				return []
			return [`const ${baseIdentifier} = ${emitSourceBindingBase(source, binding, {
				operationGroups: bindingValueReference(properties.operationGroups, group[0].operationGroups) ?? '[]',
				credentials: bindingValueReference(properties.credentials, group[0].credentials) ?? '[]',
				artifacts: bindingValueReference(properties.artifacts, group[0].artifacts),
			})} as const`]
		}),
		bindings: sourceBindingRows.map(({
			binding,
			endpoints,
			operationGroups,
			credentials,
			artifacts,
		}) => emitSourceBinding(source, binding, {
				endpoints: bindingValueReference(properties.endpoints, endpoints) ?? '[]',
				operationGroups: bindingValueReference(properties.operationGroups, operationGroups) ?? '[]',
				credentials: bindingValueReference(properties.credentials, credentials) ?? '[]',
				artifacts: bindingValueReference(properties.artifacts, artifacts),
			}, bindingBaseNameByBinding.get(binding))),
	}))
	// A source matrix is compact only when it reconstructs the authored binding
	// order exactly. Uniform target kinds keep the target key type correlated;
	// mixed target domains remain explicit rows.
	const bindingMatrices = new Map(sourcePlans.flatMap((sourcePlan) => {
		const firstBindingGroup = sourcePlan.bindingGroups[0]
		if (
			firstBindingGroup == null
			|| firstBindingGroup.length < 2
			|| sourcePlan.bindingGroups.some((group) => group.length !== firstBindingGroup.length)
			|| sourcePlan.bindingGroups.some((group) => group.some(({ binding }) => binding.endpoints.length !== 1))
			|| new Set(firstBindingGroup.map(({ binding }) => binding.target.kind)).size !== 1
		)
			return []

		const targetIdentity = ({ binding }: typeof firstBindingGroup[number]) => JSON.stringify([
			binding.target.kind,
			binding.target.key,
		])
		const targetIdentities = firstBindingGroup.map(targetIdentity)
		if (
			new Set(targetIdentities).size !== targetIdentities.length
			|| sourcePlan.bindingGroups.some((group) => (
				JSON.stringify(group.map(targetIdentity).sort()) !== JSON.stringify([...targetIdentities].sort())
			))
		)
			return []

		const orderedMatrixRows = firstBindingGroup.flatMap((targetRow) => (
			sourcePlan.bindingGroups.map((group) => group.find((candidate) => (
				targetIdentity(candidate) === targetIdentity(targetRow)
			)))
		))
		if (orderedMatrixRows.some((row, index) => (
			row !== sourcePlan.sourceBindingRows[index]
		)))
			return []

		const locatorSuffixes = sourcePlan.bindingGroups.map((group) => {
			const endpoint = group[0]?.binding.endpoints[0]
			if (endpoint == null || group.some(({ binding }) => (
				binding.endpoints[0]?.endpointKind !== endpoint.endpointKind
				|| binding.endpoints[0].corsEnabled !== endpoint.corsEnabled
			)))
				return undefined

			const suffixes = firstBindingGroup.map((targetRow) => {
				const bindingRow = group.find((candidate) => targetIdentity(candidate) === targetIdentity(targetRow))
				const baseLocator = targetRow.binding.endpoints[0]?.locator
				const locator = bindingRow?.binding.endpoints[0]?.locator
				return baseLocator != null && locator?.startsWith(baseLocator) === true ?
					locator.slice(baseLocator.length)
				:
					undefined
			})
			return suffixes[0] != null && suffixes.every((suffix) => suffix === suffixes[0]) ?
				suffixes[0]
			:
				undefined
		})
		if (locatorSuffixes.some((suffix) => suffix == null))
			return []

		return [[sourcePlan.source, {
			name: `${camel(sourcePlan.source)}Targets`,
			rows: firstBindingGroup.map((targetRow) => ({
				key: targetRow.binding.target.key,
				locator: targetRow.binding.endpoints[0].locator,
			})),
			variants: sourcePlan.bindingGroups.map((group, groupIndex) => {
				const binding = group[0]?.binding
				const endpoint = binding?.endpoints[0]
				const baseIdentifier = sourcePlan.bindingBaseNames[groupIndex]
				const locatorSuffix = locatorSuffixes[groupIndex]
				if (binding == null || endpoint == null || baseIdentifier == null || locatorSuffix == null)
					throw new Error(`${sourcePlan.source}: incomplete binding matrix axis ${groupIndex}`)

				return emitObject([
					{
						spread: baseIdentifier,
					},
					['target', `{
	kind: ${enumAccess('SourceTargetKind', binding.target.kind)},
	key,
}`],
					['endpoints', emitArray([`{
	endpointKind: ${enumAccess('SourceEndpointKind', endpoint.endpointKind)},
	${locatorSuffix === '' ? 'locator' : `locator: \`\${locator}${locatorSuffix}\``},${endpoint.corsEnabled == null ? '' : `
	corsEnabled: ${String(endpoint.corsEnabled)},`}
}`])],
				])
			}),
		}] as const]
	}))
	const renderBindingMatrix = (
		bindingName: string,
		matrix: NonNullable<ReturnType<typeof bindingMatrices.get>>
	) => {
		const variant = lines(matrix.variants[0] ?? '')
		return [
			`const ${matrix.name} = ${emitArray(matrix.rows.map(({ key, locator }) => emitObject([
				['key', emitTypeScript(key)],
				['locator', emitTypeScript(locator)],
			])))} as const`,
			'',
			`const ${bindingName} = ${matrix.name}.${matrix.variants.length === 1 ? 'map' : 'flatMap'}(({`,
			'\tkey,',
			'\tlocator,',
			...(matrix.variants.length === 1 ? [
				'}) => ({',
				...variant.slice(1, -1).map((line) => indent(line)),
				'} satisfies SourceBinding))',
			] : [
				'}) => ([',
				...matrix.variants.map((binding) => `${indent(binding)},`),
				'] satisfies readonly SourceBinding[]))',
			]),
		]
	}
	const renderedBindingBody = (() => {
		const direct = [
			'const bindings = [',
			...renderedSourcePlans.flatMap(({ bindings }) => bindings.map((binding) => `${indent(binding)},`)),
			'] as const satisfies readonly SourceBinding[]',
		]
		if (renderedSourcePlans.length === 1) {
			const sourcePlan = renderedSourcePlans[0]
			const matrix = sourcePlan == null ? undefined : bindingMatrices.get(sourcePlan.source)
			if (matrix == null)
				return direct

			const compact = renderBindingMatrix('bindings', matrix)
			return compact.join('\n').length < direct.join('\n').length ? compact : direct
		}

		const compactSources = new Map(renderedSourcePlans.flatMap((sourcePlan) => {
			const matrix = bindingMatrices.get(sourcePlan.source)
			return matrix == null ? [] : [[sourcePlan.source, {
				bindingName: `${camel(sourcePlan.source)}Bindings`,
				matrix,
			}] as const]
		}))
		if (compactSources.size === 0)
			return direct

		const compactDeclarations = renderedSourcePlans.flatMap(({ source }) => {
			const compactSource = compactSources.get(source)
			return compactSource == null ? [] : [
				...renderBindingMatrix(compactSource.bindingName, compactSource.matrix),
				'',
			]
		})
		const compact = [
			...compactDeclarations,
			'const bindings = [',
			...renderedSourcePlans.flatMap((sourcePlan) => {
				const compactSource = compactSources.get(sourcePlan.source)
				return compactSource == null ?
					sourcePlan.bindings.map((binding) => `${indent(binding)},`)
				:
					[`\t...${compactSource.bindingName},`]
			}),
			'] satisfies readonly SourceBinding[]',
		]
		return compact.join('\n').length < direct.join('\n').length ? compact : direct
	})()
	const enumNames = [
		'ApiFamily',
		'SourceDelivery',
		'SourceTargetKind',
		'WireProtocol',
		...(bindings.some(({ binding }) => binding.artifacts?.length) ? ['SourceArtifactKind'] : []),
		...(bindings.some(({ binding }) => binding.credentials.length > 0) ? ['SourceCredentialScope'] : []),
		...(bindings.some(({ binding }) => binding.endpoints.length > 0) ? ['SourceEndpointKind'] : []),
		...(bindings.some(({ binding }) => binding.operationGroups.length > 0) ? ['SourceOperationGroup'] : []),
	]

	return tsFile(
		`src/sources/${provider.provider}/bindings.ts`,
		{
			imports: [
				{
					from: '$/sources/Source.ts',
					names: ['Source'],
				},
				{
					from: '$/sources/SourceBinding.ts',
					names: [
						...enumNames,
						'indexSourceBindings',
					],
					typeNames: ['SourceBinding'],
				},
				...(bindings.some(({ binding }) => binding.credentials.some((credential) => (
					!('envKey' in credential)
					&& credential.env != null
				))) ? [{
					from: 'arktype',
					names: [{
						name: 'type',
						alias: 'arktype',
					}],
				}] satisfies ImportSpec[] : []),
			],
			body: [
				...Object.values(properties).flatMap((property) => property?.declarations ?? []),
				...(Object.values(properties).some((property) => property != null) ? [''] : []),
				...renderedSourcePlans.flatMap(({ declarations }) => (
					declarations.length === 0 ? [] : [...declarations, '']
				)),
				...renderedBindingBody,
				'',
				'export default indexSourceBindings(bindings)',
			],
		}
	)
}

const generateSourceProviderDefinitionFile = (
	provider: SourceProviderDefinition,
	sources: readonly SourceDefinition[],
	bindings: readonly SourceBindingEntry[]
) => tsFile(
		`src/sources/${provider.provider}/index.ts`,
		{
			imports: [
				...(bindings.length === 0 ? [] : [{
					from: `$/sources/${provider.provider}/bindings.ts`,
					defaultName: 'bindings',
				}] satisfies ImportSpec[]),
				{
					from: '$/sources/Source.ts',
					names: ['Source'],
				},
				{
					from: '$/sources/SourceProvider.ts',
					names: ['SourceProvider'],
				},
				{
					from: '$/sources/SourceProviderDefinition.ts',
					typeNames: ['SourceProviderDefinition'],
				},
				...(provider.env == null ? [] : [{
					from: 'arktype',
					names: [{
						name: 'type',
						alias: 'arktype',
					}],
				}]),
			],
			body: [
				'export default {',
				indent(`provider: ${enumAccess('SourceProvider', provider.provider)},`),
				indent(`label: ${emitTypeScript(provider.label)},`),
				...(provider.env == null ? [] : [indent(`env: ${emitEnvSchema(provider.env)},`)]),
				indent('sources: ['),
				...sources.map((source) => indent(`${emitObject([
					['source', enumAccess('Source', source.source)],
					['label', emitTypeScript(source.label)],
					['env', emitEnvSchema(source.env)],
				])},`, 2)),
				indent('],'),
				indent(bindings.length === 0 ? 'bindings: [],' : 'bindings: Object.values(bindings).flat(),'),
				'} satisfies SourceProviderDefinition',
			],
		}
	)

const generateSourceProvidersFile = (sourceProviderNames: readonly string[]) => tsFile(
	'src/sources/$sourceProviders.ts',
	{
		imports: [
			...sourceProviderNames.map((provider) => ({
				from: `./${provider}/index.ts`,
				defaultName: `${camel(provider)}SourceProvider`,
			})),
			{
				from: './SourceProviderDefinition.ts',
				typeNames: ['SourceProviderDefinition'],
			},
		],
		body: [
			'export default [',
			...sourceProviderNames.map((provider) => `\t${camel(provider)}SourceProvider,`),
			'] satisfies readonly SourceProviderDefinition[]',
		],
	}
)

const generateSourceServerCredentialsFile = (
	sourceBindings: readonly SourceBindingEntry[]
) => {
	const runtimeSecretBindings = sourceBindings.flatMap((sourceBinding) => {
		const runtimeSecret = sourceBinding.binding.credentials.find((credential) => (
			credential.scope === SourceCredentialScope.RuntimeSecret
			&& 'envKey' in credential
		))
		return runtimeSecret == null ? [] : [{
			...sourceBinding,
			runtimeSecret,
		}]
	})
	const bindingSelectorExpressions = ({ source, binding }: SourceBindingEntry) => {
		const sourceRuntimeSecretBindings = runtimeSecretBindings.filter((candidate) => candidate.source === source)
		const targetKey = sourceRuntimeSecretBindings.length === 1 ? undefined : binding.target.key
		if (sourceRuntimeSecretBindings.filter((candidate) => (
			targetKey === undefined
			|| candidate.binding.target.key === targetKey
		)).length !== 1)
			throw new Error(`${source}: target ${binding.target.key} must identify exactly one runtime-secret binding`)

		return [
			enumAccess('Source', source),
			targetKey === undefined ? 'undefined' : emitTypeScript(targetKey),
		]
	}

	return tsFile(
		'src/sources/$sourceServerCredentials.server.ts',
		{
			imports: [
				{
					from: '$/sources/$sourceProviders.ts',
					defaultName: 'sourceProviders',
				},
				{
					from: '$/sources/Source.ts',
					names: ['Source'],
				},
				{
					from: '$/sources/SourceBinding.ts',
					names: [
						'sourceBindingId',
						'SourceCredentialScope',
					],
					typeNames: [
						'SourceBinding',
						'SourceServerCredentialDefinition',
					],
				},
			],
			body: [
				'const runtimeSecretBindingCandidates = sourceProviders',
				'\t.flatMap<SourceBinding>(({ bindings }) => bindings)',
				'\t.filter(({ credentials }) => credentials.some(({ scope, keys }) => (',
				'\t\tscope === SourceCredentialScope.RuntimeSecret',
				'\t\t&& keys == null',
				'\t)))',
				'',
				'const runtimeSecretBinding = (',
				'\tsource: Source,',
				'\ttargetKey?: string',
				') => {',
				'\tconst bindings = runtimeSecretBindingCandidates.filter((candidate) => (',
				'\t\tcandidate.source === source',
				'\t\t&& (targetKey === undefined || candidate.target.key === targetKey)',
				'\t))',
				'\tconst binding = bindings.at(0)',
				'\tif (binding == null || bindings.length > 1)',
				"\t\tthrow new Error(`Expected one runtime-secret binding for ${source}${targetKey === undefined ? '' : ` target ${targetKey}`}`)",
				'',
				'\treturn binding',
				'}',
				'',
				`const runtimeSecretCredentials = ${emitArray(runtimeSecretBindings.map((sourceBinding) => emitArray([
					...bindingSelectorExpressions(sourceBinding),
					emitTypeScript(sourceBinding.runtimeSecret.envKey),
					emitTypeScript({
						kind: 'value',
						value: sourceBinding.runtimeSecret.injection,
					}),
				])))} as const satisfies readonly (readonly [`,
				'	source: Source,',
				'	targetKey: string | undefined,',
				'	envKey: string,',
				"\tinjection: SourceServerCredentialDefinition['injection'],",
				'])[]',
				'',
				'export default new Map<',
				'\tstring,',
				'\tSourceServerCredentialDefinition',
				'>(runtimeSecretCredentials.map(([',
				'\tsource,',
				'\ttargetKey,',
				'\tenvKey,',
				'\tinjection,',
				']) => [',
				'\tsourceBindingId(runtimeSecretBinding(source, targetKey)),',
				'\t{',
				'\t\tenvKey,',
				'\t\tinjection,',
				'\t},',
				'] satisfies readonly [string, SourceServerCredentialDefinition]))',
			],
		}
	)
}

const generateSourceSelectionFiles = (sourceSelections: readonly NamedSourceSelectionPlan[]) => sourceSelections.map(({
	selection,
	functionName,
}) => tsFile(
	`src/sources/${functionName}.ts`,
	{
		imports: [
			{
				from: '$/sources/Source.ts',
				names: ['Source'],
			},
		],
		body: (() => {
			const fields = sourceSelectionConditionFields(selection)
			const [firstField, secondField] = fields
			const cases = selection.cases ?? []
			// A case table is lossless only when every row selects one source and its
			// grouped source order is exactly the authored fallback order.
			const tableRows = fields.length === 2 && cases.every((item) => item.sources.length === 1) ?
				[...Map.groupBy(cases, (item) => JSON.stringify([
					item.when[0]?.equals,
					item.sources[0],
				])).values()].flatMap((matchingCases) => {
					const firstCase = matchingCases[0]
					const firstCondition = firstCase?.when[0]
					const source = firstCase?.sources[0]
					const secondFieldValues = matchingCases.flatMap((item) => (
						item.when[1] == null ? [] : [item.when[1].equals]
					))
					return (
						firstCondition == null
						|| source == null
						|| secondFieldValues.length !== matchingCases.length ?
							[]
						:
							[{
								firstFieldValue: firstCondition.equals,
								secondFieldValues,
								source,
							}]
					)
				})
			:
				undefined
			if (
				firstField != null
				&& secondField != null
				&& tableRows != null
				&& tableRows.length > 0
				&& tableRows.length === selection.default.length
				&& tableRows.every((row, index) => row.source === selection.default[index])
			)
				return [
					`const cases = ${emitArray(tableRows.map((row) => emitArray([
						emitTypeScript(row.firstFieldValue),
						emitArray(row.secondFieldValues.map(emitTypeScript)),
						enumAccess('Source', row.source),
					])))} as const`,
					'type Case = typeof cases[number]',
					'',
					'const defaultSources = cases.map(([, , source]) => source)',
					'',
					'export default ({',
					`\t${firstField},`,
					`\t${secondField},`,
					'}: {',
					`\t${firstField}?: Case[0]`,
					`\t${secondField}?: Case[1][number]`,
					'}) => {',
					'\tconst matchedSource = cases.find(([firstFieldValue, secondFieldValues]) => (',
					`\t\tfirstFieldValue === ${firstField}`,
					`\t\t&& secondFieldValues.some((secondFieldValue) => secondFieldValue === ${secondField})`,
					'\t))?.[2]',
					'',
					'\treturn matchedSource == null ? [...defaultSources] : [matchedSource]',
					'}',
				]

			return [
				'export default ({',
				...fields.map((field) => `\t${field},`),
				'}: {',
				...fields.map((field, fieldIndex) => `\t${field}?: ${unique(
					(selection.cases ?? []).map(({ when }) => emitTypeScript(when[fieldIndex].equals))
				).join(' | ')}`),
				'}) => {',
				...(selection.cases ?? []).flatMap(({ when, sources }) => [
					`\tif (${when.map(({ field, equals }) => `${field} === ${emitTypeScript(equals)}`).join(' && ')})`,
					indent(`return ${sources.length === 1 ? `[Source.${sources[0]}]` : emitSourceArray(sources)}`, 2),
					'',
				]),
				indent(`return ${emitSourceArray(selection.default)}`, 1),
				'}',
			]
		})(),
	}
))

const generateNavigationItemsFile = (navigationItems: readonly App['navigation']['items'][number][]) => tsFile(
	'src/routes/navigationItems.svelte.ts',
	{
		imports: [
			{
				from: '$/routes/NavigationItem.ts',
				typeNames: ['NavigationItem'],
			},
		],
		body: [
			`export default ${emitTypeScript({
				kind: 'value',
				value: navigationItems,
			})} satisfies NavigationItem[]`,
		],
	}
)

const generateResolverIndexFile = (resolverModules: readonly App['resolvers']['modules'][number][]) => tsFile(
	'src/resolvers/index.ts',
	{
		imports: [
			{
				from: '$/resolvers/defineResolver.ts',
				typeNames: ['RegisteredSourceResolverModule'],
			},
				{
					from: '$/sources/Source.ts',
					names: ['Source'],
				},
		],
		body: [
			'type ResolverLoaderEntry = {',
			'\t[_Source in Source]: readonly [',
			'\t\t_Source,',
			'\t\t() => Promise<{',
			'\t\t\tdefault: RegisteredSourceResolverModule<_Source>',
			'\t\t}>,',
			'\t]',
			'}[Source]',
			'',
			'const resolverLoaderEntries = [',
			...resolverModules.map((module) => (
				`\t[Source.${module.source}, () => import(${emitTypeScript(module.path.replace(/^src\/resolvers\//, './'))})],`
			)),
			'] as const satisfies readonly ResolverLoaderEntry[]',
			'',
			'export const loadResolvers = async (enabledSources: ReadonlySet<Source> = new Set(Object.values(Source))) => Promise.all(',
			'\tresolverLoaderEntries',
			'\t\t.filter(([source]) => enabledSources.has(source))',
			'\t\t.map(async ([source, load]) => {',
			'\t\t\tconst resolverModule = (await load()).default',
			'\t\t\tif (resolverModule.source !== source)',
			'\t\t\t\tthrow new Error(`Resolver module source mismatch: expected ${source}, received ${resolverModule.source}`)',
			'',
			'\t\t\treturn resolverModule',
			'\t\t})',
			')',
		],
	}
)

// View output
//
// Views render schema cardinality and compiled presentation declarations. Links
// are compiled directly into the consuming view from normalized route facts.
const entitySelectorFieldNames = (entity: Entity) => new Set(entity.selectors.flatMap((selector) => selector.fields))

const entitySelectorOwnsField = (entity: Entity, fieldReference: FieldReference) => (
	!isProjectionFieldReference(fieldReference)
	&& entity.selectors.every((selector) => selector.fields.includes(fieldReference))
)

const pendingEntityExpression = 'pendingEntity'

const renderPendingEntityDerived = (entity: Entity) => {
	const pending = entitySingularView(entity)?.pending

	return pending == null ?
		[
			`const ${pendingEntityExpression} = $derived({ ...selection.entitySelector, ...prefetched })`,
		]
	:
		[
			`const ${pendingEntityExpression} = $derived(`,
			...reindentLines(trimBlankLineEdges(lines(pending.expression)), 1),
			')',
		]
}

const viewResolvedFieldReferences = (
	entity: Entity,
	indexes: GenerationIndexes,
	selectorName?: string
) => {
	const selectorFieldNames = (
		selectorName == null ?
			entitySelectorFieldNames(entity)
		:
			new Set(entity.selectors.find((selector) => selector.name === selectorName)?.fields ?? [])
	)

	return [...new Map(
		allViewItems(entity, indexes)
			.flatMap(itemFieldReferences)
			.map((fieldReference) => [fieldReferenceKey(fieldReference), fieldReference])
	).values()].filter((fieldReference) => (
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

const viewItemDisplayExpressions = (viewEntry: _ViewItem) => (
	typeof viewEntry !== 'object'
	|| isProjectionFieldReference(viewEntry)
	|| !('field' in viewEntry) ?
		[]
	:
		[
			viewEntry.decimalPlaces,
			typeof viewEntry.prefix === 'string' ? undefined : viewEntry.prefix,
			typeof viewEntry.suffix === 'string' ? undefined : viewEntry.suffix,
		].filter((expression) => expression != null)
)

const viewItemDisplayFieldReferences = (viewEntry: _ViewItem): FieldReference[] => (
	viewItemDisplayExpressions(viewEntry)
		.flatMap(expressionFieldPaths)
		.map((fieldPath) => fieldPath.join('.'))
)

const viewItemFieldReferences = (viewEntry: _ViewItem) => [
	...itemFieldReferences(viewEntry),
	...viewItemDisplayFieldReferences(viewEntry),
]

const viewItemEntityFieldsExpression = (
	entity: Entity,
	viewEntry: _ViewItem,
	context: string
) => {
	const fieldReferences = viewItemFieldReferences(viewEntry)
	const usesSelectorFields = fieldReferences.some((fieldReference) => (
		entitySelectorOwnsField(entity, fieldReference)
	))
	const usesResolvedFields = fieldReferences.some((fieldReference) => (
		!entitySelectorOwnsField(entity, fieldReference)
	))
	if (usesSelectorFields && usesResolvedFields)
		throw new Error(`${entity.entityType} ${context} mixes selector and resolved fields`)

	return usesSelectorFields ? 'selection.entitySelector' : 'entity'
}

const fieldDefinitionByReference = (
	entity: Entity,
	field: FieldReference,
	indexes?: Pick<GenerationIndexes, 'entityFacetByPath'>
) => {
	if (!isProjectionFieldReference(field))
		return entity.fields.find((fieldDefinition) => fieldDefinition.name === field)
	if (indexes == null)
		throw new Error(`${entity.entityType} projected field ${field.join('.')} requires compiled facet metadata`)

	return indexes.entityFacetByPath[projectionPathKey(entity.entityType, field.slice(0, -1))]?.facet.fields?.find((fieldDefinition) => (
		fieldDefinition.name === field.at(-1)
	))
}

const collectionReferencePathPlan = (
	entity: Entity,
	indexes: Pick<GenerationIndexes, 'entityByType' | 'entityFacetByPath'>,
	path: readonly string[],
	owner: string
): ReferencePathPlan => {
	let currentEntity = entity
	let projectionPath: string[] = []
	const steps: ReferencePathStep[] = []

	for (const [index, segment] of path.entries()) {
		const nextProjectionPath = [
			...projectionPath,
			segment,
		]
		if (indexes.entityFacetByPath[projectionPathKey(currentEntity.entityType, nextProjectionPath)] != null) {
			projectionPath = nextProjectionPath
			continue
		}

		const field = fieldDefinitionByReference(
			currentEntity,
			projectionPath.length === 0 ? segment : [
				...projectionPath,
				segment,
			],
			indexes
		)
		if (field == null)
			throw new Error(`${owner} references missing ${currentEntity.entityType}.${[...projectionPath, segment].join('.')}`)

		if (index === path.length - 1) {
			if (field.type !== EntityFieldType.EntitiesReference)
				throw new Error(`${owner} must end in an EntitiesReference`)
			if (!fieldCardinalityIsMany(field))
				throw new Error(`${owner} terminal field must be Many or ZeroOrMany`)

			return {
				steps,
				terminalEntity: currentEntity,
				terminalProjectionPath: projectionPath,
				terminalField: field,
			}
		}

		if (
			field.type !== EntityFieldType.EntityReference
			&& field.type !== EntityFieldType.EntitiesReference
		)
			throw new Error(`${owner} must traverse entity-reference fields before its terminal list`)
		if (field.entityType == null || indexes.entityByType[field.entityType] == null)
			throw new Error(`${owner} references missing target entity ${field.entityType ?? ''}`)

		steps.push({
			entity: currentEntity,
			projectionPath,
			field,
		})
		currentEntity = indexes.entityByType[field.entityType]
		projectionPath = []
	}

	throw new Error(`${owner} requires a terminal EntitiesReference`)
}

const fieldValueType = (indexes: GenerationIndexes, fieldDefinition: EntityField) => (
	fieldDefinition.valueType == null ? undefined : indexes.valueTypeById[fieldDefinition.valueType]
)

const fieldValueTypeType = (indexes: GenerationIndexes, fieldDefinition: EntityField) => (
	fieldValueType(indexes, fieldDefinition)?.type ?? fieldDefinition.primitiveType
)

const fieldNeedsExplicitDisplayExpression = (indexes: GenerationIndexes, fieldDefinition: EntityField) => {
	const valueTypeType = fieldValueTypeType(indexes, fieldDefinition)

	return (
		valueTypeTypeRequiresDisplayExpression(valueTypeType)
	) && fieldValueType(indexes, fieldDefinition)?.displayExpression == null
}

const renderNullishExpression = (
	valueExpression: string,
	fallbackExpression: string
) => {
	const parsed = parseTypeScriptExpression(`(${valueExpression}) ?? (${fallbackExpression})`)
	if (
		!ts.isBinaryExpression(parsed.expression)
		|| parsed.expression.operatorToken.kind !== ts.SyntaxKind.QuestionQuestionToken
	)
		throw new Error(`Cannot render invalid nullish expression: ${valueExpression} ?? ${fallbackExpression}`)

	const nullishOperands = (expression: ts.Expression): ts.Expression[] => {
		const value = unwrapParenthesizedExpression(expression)
		return (
			ts.isBinaryExpression(value)
			&& value.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken ?
				[
					...nullishOperands(value.left),
					...nullishOperands(value.right),
				]
			:
				[value]
		)
	}
	const [firstOperand, ...remainingOperands] = nullishOperands(parsed.expression)
	if (firstOperand == null)
		throw new Error(`Cannot render empty nullish expression: ${valueExpression} ?? ${fallbackExpression}`)

	return ts.createPrinter().printNode(
		ts.EmitHint.Expression,
		remainingOperands.reduce((left, right) => ts.factory.createBinaryExpression(
			left,
			ts.factory.createToken(ts.SyntaxKind.QuestionQuestionToken),
			right
		), firstOperand),
		parsed.sourceFile
	)
}

const parenthesizedNullishExpression = (valueExpression: string) => {
	const parsedValueExpression = parseTypeScriptExpression(valueExpression)
	return (
		ts.isBinaryExpression(parsedValueExpression.expression)
		&& parsedValueExpression.expression.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken ?
			`(${renderNullishExpression(
				parsedValueExpression.expression.left.getText(parsedValueExpression.sourceFile),
				parsedValueExpression.expression.right.getText(parsedValueExpression.sourceFile)
			)})`
		:
			valueExpression
	)
}

const textExpression = (valueExpression: string) => {
	const parsedValueExpression = parseTypeScriptExpression(valueExpression)
	if (typeScriptExpressionProducesString(parsedValueExpression.expression))
		return parenthesizedNullishExpression(valueExpression)

	return `String(${renderNullishExpression(valueExpression, '\'\'')})`
}

const renderDisplayExpression = (
	entity: Entity,
	indexes: GenerationIndexes,
	fieldReference: FieldReference,
	valueExpression: string,
	valueIsPresent = false,
	valueTypeTypeOverride?: ValueTypeType,
	coercePrimitive = true
) => {
	const fieldDefinition = fieldDefinitionByReference(entity, fieldReference, indexes)
	const fieldName = fieldNameForReference(fieldReference)
	const valueType = fieldDefinition == null ? undefined : fieldValueType(indexes, fieldDefinition)
	const expression = valueType?.displayExpression

	if (expression == null) {
		const valueTypeType = valueTypeTypeOverride ?? (fieldDefinition == null ? undefined : fieldValueTypeType(indexes, fieldDefinition))
		// Titles and joins require strings; Svelte markup renders typed scalars
		// directly and must not grow fallback String(...) assertions.
		if (valueTypeTypeRequiresDisplayExpression(valueTypeType))
			throw new Error(`${entity.entityType}.${fieldName} needs a valueType displayExpression before it can be rendered`)

		if (fieldDefinition != null && fieldCardinalityIsMany(fieldDefinition))
			return `${valueExpression}.values.join(', ')`
		if (
			valueTypeProducesString(valueTypeType, valueType)
			|| !coercePrimitive
				&& valueTypeType != null
				&& (
					'primitive' in valueTypeType
					&& valueTypeType.primitive !== 'unknown'
					|| 'unit' in valueTypeType
					|| 'enum' in valueTypeType
					|| 'raw' in valueTypeType
					&& (
						valueType?.routeParam?.decode === _ExpressionDecode.Number
						|| valueType?.routeParam?.decode === _ExpressionDecode.BigInt
					)
				)
		)
			return valueIsPresent ? valueExpression : `(${valueExpression} ?? '')`

		return `String(${valueExpression}${valueIsPresent ? '' : ' ?? \'\''})`
	}

	if (!typeScriptExpressionReferencesBinding(expression, 'value'))
		return parenthesizedNullishExpression(expression)

	if (fieldDefinition != null && fieldCardinalityIsMany(fieldDefinition))
		return `${valueExpression}.values.map((value) => ${expression}).join(', ')`

	return valueIsPresent ?
		parenthesizedNullishExpression(replaceTypeScriptIdentifier(expression, 'value', valueExpression))
	:
		`${valueExpression} == null ? '' : ${parenthesizedNullishExpression(replaceTypeScriptIdentifier(expression, 'value', valueExpression))}`
}

const viewItemFormat = (
	entity: Entity,
	indexes: GenerationIndexes,
	viewEntry: _ViewItem,
	valueTypeTypeOverride?: ValueTypeType
) => {
	const fieldReference = itemFieldReferences(viewEntry)[0]
	if (fieldReference == null)
		return undefined
	if (typeof viewEntry === 'object' && 'format' in viewEntry && viewEntry.format != null)
		return viewEntry.format

	const fieldDefinition = fieldDefinitionByReference(entity, fieldReference, indexes)
	const valueTypeFormat = fieldDefinition == null ? undefined : fieldValueType(indexes, fieldDefinition)?.format
	if (valueTypeFormat != null)
		return valueTypeFormat
	if (fieldDefinition != null && fieldDefinition.type !== EntityFieldType.Primitive)
		return undefined

	if (
		fieldDefinition?.valueType === 'boolean'
		|| valueTypeTypeOverride != null
			&& 'primitive' in valueTypeTypeOverride
			&& valueTypeTypeOverride.primitive === 'boolean'
	)
		return 'boolean'
	const fieldName = fieldDefinition?.name ?? fieldNameForReference(fieldReference)
	if (/timestampMs$|TimestampMs$/.test(fieldName))
		return 'timestamp'
	if (/(?:url|uri)$/i.test(fieldName))
		return 'url'
	if (/(?:address|hash|digest|signature|credential|issuer|account)(?:id)?$/i.test(fieldName))
		return 'truncated'

	return undefined
}

const renderMappedDisplayExpression = (
	entity: Entity,
	indexes: GenerationIndexes,
	viewEntry: _ViewItem,
	fieldReference: FieldReference,
	valueExpression: string,
	valueIsPresent = false,
	valueTypeTypeOverride?: ValueTypeType,
	coercePrimitive = true
) => {
	const baseExpression = renderDisplayExpression(
		entity,
		indexes,
		fieldReference,
		valueExpression,
		valueIsPresent,
		valueTypeTypeOverride,
		coercePrimitive
	)
	if (typeof viewEntry !== 'object' || !('field' in viewEntry) || viewEntry.enumConstantMap == null)
		return baseExpression

	return parenthesizedNullishExpression(renderNullishExpression(
		`${viewEntry.enumConstantMap}[${valueExpression}]?.${viewEntry.enumConstantProperty ?? 'label'}`,
		baseExpression
	))
}

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

// Modeled visibility and declared raw dependencies are the complete inputs to
// snippet arity; rendered Svelte text never feeds back into compilation.
const viewItemUsesOpen = (viewEntry: _ViewItem) => viewItemTree([viewEntry]).some((entry) => (
	typeof entry === 'object'
	&& (
		'when' in entry
			&& (entry.when === 'open' || entry.when === 'closed')
		|| 'Content' in entry
			&& entry.Content.references?.includes('open') === true
	)
))

const renderValueMarkup = (
	entity: Entity,
	indexes: GenerationIndexes,
	viewEntry: _ViewItem,
	fieldReference: FieldReference,
	valueExpression: string,
	fieldValuesExpression: string,
	level: number,
	valueTypeTypeOverride?: ValueTypeType
) => {
	const format = viewItemFormat(entity, indexes, viewEntry, valueTypeTypeOverride)
	const fieldDefinition = fieldDefinitionByReference(entity, fieldReference, indexes)
	const valueType = fieldDefinition == null ? undefined : fieldValueType(indexes, fieldDefinition)
	const valueTypeType = valueTypeTypeOverride ?? (fieldDefinition == null ? undefined : fieldValueTypeType(indexes, fieldDefinition))
	const displayExpression = renderMappedDisplayExpression(
		entity,
		indexes,
		viewEntry,
		fieldReference,
		valueExpression,
		true,
		valueTypeTypeOverride,
		false
	)
	const fieldExpressionByName = {
		value: valueExpression,
	}
	const hrefExpression = (
		typeof viewEntry === 'object' && 'link' in viewEntry && viewEntry.link != null ?
			renderResolveExpression(
				viewEntry.link.href,
				(viewEntry.link.params ?? []).map((param) => [
					param.param,
					renderRouteParamValueExpression(
						param.value,
						fieldValuesExpression,
						undefined,
						false,
						{
							value: valueExpression,
						}
					),
				])
			)
		:
			undefined
	)
	const decimalPlacesExpression = (
		typeof viewEntry === 'object'
		&& !isProjectionFieldReference(viewEntry)
		&& 'field' in viewEntry
		&& viewEntry.decimalPlaces != null ?
			renderExpression(viewEntry.decimalPlaces, {
				fields: fieldValuesExpression,
				fieldExpressionByName,
			})
		:
			undefined
	)
	const renderNumberValueMarkup = (attributes: string[]) => [
		`${'\t'.repeat(level)}<NumberValue`,
		...attributes.map((attribute) => `${'\t'.repeat(level + 1)}${attribute}`),
		`${'\t'.repeat(level)}/>`,
	]
	const valueMarkup = (
		format === 'timestamp' || format === 'dateTime' ?
			[
				`${'\t'.repeat(level)}<Timestamp timestamp={${
					valueTypeType != null
					&& (
						'primitive' in valueTypeType
						&& valueTypeType.primitive === 'number'
						|| 'raw' in valueTypeType
						&& valueType?.routeParam?.decode === _ExpressionDecode.Number
					) ?
						valueExpression
					:
						`Number(${valueExpression})`
				}} />`,
			]
		: format === 'number' || format === 'numberValue' ?
			renderNumberValueMarkup([
				`value={${valueExpression}}`,
				...(decimalPlacesExpression == null ? [] : [
					`decimalPlaces={${decimalPlacesExpression}}`,
				]),
			])
		: format === 'currency' || format === 'currencyScaled' ?
			renderNumberValueMarkup([
				`value={Number(${valueExpression})${format === 'currencyScaled' ? ' / 1e8' : ''}}`,
				`formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}`,
			])
		: format === 'percent' ?
			renderNumberValueMarkup([
				`value={Number(${valueExpression})}`,
				`options={{ style: 'percent' }}`,
			])
		: format === 'boolean' ?
			[
				`${'\t'.repeat(level)}{${valueExpression} ? 'Yes' : 'No'}`,
			]
		: format === 'stringList' ?
			[
				`${'\t'.repeat(level)}{${valueExpression}.join(', ')}`,
			]
		: format === 'monospace' ?
			[
				`${'\t'.repeat(level)}<span data-text="font-monospace">{${displayExpression}}</span>`,
			]
		: format === 'truncated' || format === 'namespaceReference' || format === 'address' ?
			[
				`${'\t'.repeat(level)}<TruncatedValue value={${displayExpression}} />`,
			]
		: format === 'url' ?
			[
				`${'\t'.repeat(level)}<a`,
				`${'\t'.repeat(level + 1)}href={${displayExpression}}`,
				`${'\t'.repeat(level + 1)}target="_blank"`,
				`${'\t'.repeat(level + 1)}rel="noreferrer noopener"`,
				`${'\t'.repeat(level)}>`,
				`${'\t'.repeat(level + 1)}<TruncatedValue value={${displayExpression}} />`,
				`${'\t'.repeat(level)}</a>`,
			]
		: format === 'markdown' ?
			[
				`${'\t'.repeat(level)}<Markdown content={${displayExpression}} />`,
			]
		: format === 'syndicationHtml' ?
			[
				`${'\t'.repeat(level)}<Markdown content={${displayExpression}} mode="syndication" />`,
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
				renderSvelteTextOrExpression(level, displayExpression),
			]
	)
	const renderAffixMarkup = (
		affix: string | Exclude<_Expression, string> | undefined,
		position: 'prefix' | 'suffix'
	) => {
		if (affix == null)
			return []
		if (typeof affix === 'string')
			return [
				`${'\t'.repeat(level)}<span>${svelteText(affix)}</span>`,
			]

		const affixExpression = renderExpression(affix, {
			fields: fieldValuesExpression,
			fieldExpressionByName,
		})
		return [
			`${'\t'.repeat(level)}<span>{${affixExpression} == null ? '' : \`${position === 'suffix' ? ' ' : ''}\${${affixExpression}}\`}</span>`,
		]
	}
	const prefixedValueMarkup = [
		...(
			typeof viewEntry === 'object'
			&& !isProjectionFieldReference(viewEntry)
			&& 'field' in viewEntry ?
				renderAffixMarkup(viewEntry.prefix, 'prefix')
			:
				[]
		),
		...valueMarkup,
		...(
			typeof viewEntry === 'object'
			&& !isProjectionFieldReference(viewEntry)
			&& 'field' in viewEntry ?
				renderAffixMarkup(viewEntry.suffix, 'suffix')
			:
				[]
		),
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

type EntityReferenceExpression = (
	fieldDefinition: EntityField,
	referenceExpression: string
) => string | undefined
type ItemFieldExpression = (
	fieldReference: FieldReference,
	entityFieldsExpression: string
) => string

const renderItemExpression = (
	entity: Entity,
	indexes: GenerationIndexes,
	viewEntry: _ViewItem,
	entityFieldsExpression: string | ((viewEntry: _ViewItem) => string),
	fieldsAreComplete = false,
	entityReferenceExpression?: EntityReferenceExpression,
	itemFieldExpression?: ItemFieldExpression,
	coercePrimitive = true
) => {
	const viewEntryFieldsExpression = (
		typeof entityFieldsExpression === 'string' ?
			entityFieldsExpression
		:
			entityFieldsExpression(viewEntry)
	)
	const renderFieldExpression = (fieldReference: FieldReference) => (
		itemFieldExpression?.(fieldReference, viewEntryFieldsExpression)
		?? fieldExpression(viewEntryFieldsExpression, fieldReferenceKey(fieldReference))
	)
	// A field shared by every selector variant is already present at the typed
	// selector boundary; only resolved/prefetched fields need nullish display.
	const fieldValueIsPresent = (
		fieldReference: FieldReference,
		fieldDefinition: EntityField | undefined
	) => (
		fieldDefinition?.cardinality === EntityFieldCardinality.One
		&& (
			fieldsAreComplete
			|| viewEntryFieldsExpression === 'selection.entitySelector'
				&& entitySelectorOwnsField(entity, fieldReference)
		)
	)
	if (typeof viewEntry === 'string' || isProjectionFieldReference(viewEntry)) {
		// A pending root entity cannot contain projection rows. Plural summaries
		// provide an explicit field expression after their ProjectionBoundary.
		if (isProjectionFieldReference(viewEntry) && itemFieldExpression == null)
			return emitTypeScript('')

		const fieldDefinition = fieldDefinitionByReference(entity, viewEntry, indexes)
		if (fieldDefinition?.type === EntityFieldType.EntityReference)
			return entityReferenceExpression?.(
				fieldDefinition,
				fieldExpression(viewEntryFieldsExpression, viewEntry)
			) ?? emitTypeScript('')

		return renderDisplayExpression(
			entity,
			indexes,
			viewEntry,
			renderFieldExpression(viewEntry),
			fieldValueIsPresent(viewEntry, fieldDefinition),
			undefined,
			coercePrimitive
		)
	}
	if ('kind' in viewEntry && viewEntry.kind === 'Text')
		return emitTypeScript(viewEntry.value ?? viewEntry.label)
	if ('text' in viewEntry && viewEntry.text != null)
		return emitTypeScript(displayLabel(viewEntry.text))
	if (!('field' in viewEntry))
		return emitTypeScript('')

	const fieldDefinition = fieldDefinitionByReference(entity, viewEntry.field, indexes)
	const fieldValue = fieldDefinition?.type === EntityFieldType.EntityReference ?
		fieldExpression(viewEntryFieldsExpression, viewEntry.field)
	:
		renderFieldExpression(viewEntry.field)
	if (fieldDefinition?.type === EntityFieldType.EntityReference)
		return entityReferenceExpression?.(fieldDefinition, fieldValue) ?? emitTypeScript('')

	const displayed = renderMappedDisplayExpression(
		entity,
		indexes,
		viewEntry,
		viewEntry.field,
		fieldValue,
		fieldValueIsPresent(viewEntry.field, fieldDefinition)
			|| (
				(viewEntry.prefix != null || viewEntry.suffix != null)
				&& fieldDefinition?.cardinality !== EntityFieldCardinality.One
			),
		undefined,
		coercePrimitive
	)
	const renderAffixExpression = (affix: typeof viewEntry.prefix) => (
		affix == null ?
			undefined
		: typeof affix === 'string' ?
			emitTypeScript(affix)
		:
			renderExpression(affix, {
				fields: viewEntryFieldsExpression,
				...(itemFieldExpression == null ? {} : {
					fieldExpressionByName: Object.fromEntries(entity.fields.map((field) => [
						field.name,
						renderFieldExpression(field.name),
					])),
				}),
			})
	)
	const affixed = [
			renderAffixExpression(viewEntry.prefix),
			displayed,
			renderAffixExpression(viewEntry.suffix),
		].filter((part): part is string => part != null).join(' + ')
	const value = viewEntry.prefix == null && viewEntry.suffix == null ?
		displayed
	: fieldDefinition?.cardinality === EntityFieldCardinality.One ?
		affixed
	:
		`(${
			valueTypeProducesString(
				fieldDefinition == null ? undefined : fieldValueTypeType(indexes, fieldDefinition),
				fieldDefinition == null ? undefined : fieldValueType(indexes, fieldDefinition)
			) ?
				fieldValue
			:
				`${fieldValue} != null`
		} ? ${affixed} : '')`
	if (viewEntry.valuePrefix == null)
		return value

	return [
		'[',
		...commaTerminatedExpressionLines(renderJoinedItemsExpression(
			entity,
			indexes,
			viewEntry.valuePrefix,
			entityFieldsExpression,
			'',
			fieldsAreComplete,
			entityReferenceExpression,
			itemFieldExpression
		)),
		...commaTerminatedExpressionLines(value),
		']',
		'\t.filter(Boolean)',
		`\t.join(${emitTypeScript(viewEntry.valuePrefixSeparator ?? ' ')})`,
	].join('\n')
}

const renderJoinedItemsExpression = (
	entity: Entity,
	indexes: GenerationIndexes,
	viewEntries: readonly _ViewItem[],
	entityFieldsExpression: string | ((viewEntry: _ViewItem) => string),
	separator = ' ',
	fieldsAreComplete = false,
	entityReferenceExpression?: EntityReferenceExpression,
	itemFieldExpression?: ItemFieldExpression,
	coercePrimitive = true
) => {
	if (viewEntries.length === 0)
		return 'undefined'

	const expressions = viewEntries
		.map((viewEntry) => renderItemExpression(
			entity,
			indexes,
			viewEntry,
			entityFieldsExpression,
			fieldsAreComplete,
			entityReferenceExpression,
			itemFieldExpression,
			coercePrimitive
		))
		.filter((expression) => expression !== emitTypeScript('') && expression !== 'undefined')
	if (expressions.length === 0)
		return 'undefined'
	if (expressions.length === 1)
		return expressions[0]

	return `[${expressions.join(', ')}].filter(Boolean).join(${emitTypeScript(separator)})`
}

const viewEntriesRenderRequiredScalar = (
	entity: Entity,
	indexes: GenerationIndexes,
	viewEntries: readonly _ViewItem[]
) => {
	const fieldReferences = viewEntries.length === 1 ? itemFieldReferences(viewEntries[0]) : []
	const fieldDefinition = fieldReferences.length === 1 ?
		fieldDefinitionByReference(entity, fieldReferences[0], indexes)
	:
		undefined
	const valueType = fieldDefinition == null ? undefined : fieldValueType(indexes, fieldDefinition)
	const valueTypeType = fieldDefinition == null ? undefined : fieldValueTypeType(indexes, fieldDefinition)

	return (
		fieldDefinition?.cardinality === EntityFieldCardinality.One
		&& (
			valueTypeType != null
			&& 'primitive' in valueTypeType
			&& [
				'bigint',
				'boolean',
				'number',
			].includes(valueTypeType.primitive)
			|| valueTypeType != null && 'unit' in valueTypeType && valueTypeType.unit !== ''
			|| valueTypeType != null
			&& 'raw' in valueTypeType
			&& (
				valueType?.routeParam?.decode === _ExpressionDecode.BigInt
				|| valueType?.routeParam?.decode === _ExpressionDecode.Number
			)
		)
	)
}

const renderFirstDeclaredExpression = (expressions: readonly (string | undefined)[]) => {
	const filtered = unique(expressions.filter((expression): expression is string => expression != null && expression !== 'undefined'))
		.map((source) => {
			const parsed = parseTypeScriptExpression(source).expression
			return {
				source,
				expression: unwrapParenthesizedExpression(parsed),
				parenthesized: ts.isParenthesizedExpression(parsed),
			}
		})
	const definitelyTruthyIndex = filtered.findIndex(({ expression }) => (
		typeScriptExpressionIsDefinitelyTruthy(expression)
	))
	if (definitelyTruthyIndex !== -1)
		filtered.splice(definitelyTruthyIndex + 1)

	if (filtered.length === 0)
		return 'undefined'

	const sources = filtered.map(({
		source,
		expression,
		parenthesized,
	}) => (
		ts.isConditionalExpression(expression) && !parenthesized ?
			`(${source})`
		:
			source
	))
	if (!sources.some((source) => source.includes('\n')))
		return sources.join(' || ')

	return [
		'(',
		...sources.map((source, index) => (
			indent(source).replace(/^\t/, index === 0 ? '\t' : '\t|| ')
		)),
		')',
	].join('\n')
}

const viewItemTree = (viewEntries: readonly _ViewItem[]): _ViewItem[] => viewEntries.flatMap((viewEntry) => [
	viewEntry,
	...(typeof viewEntry === 'object' && 'field' in viewEntry ? viewItemTree(viewItems(viewEntry.valuePrefix)) : []),
])

const viewItemContextFieldPaths = (viewEntry: _ViewItem): string[][] => (
	typeof viewEntry !== 'object'
	|| isProjectionFieldReference(viewEntry)
	|| !('field' in viewEntry) ?
		[]
	:
		uniqueFieldPaths([
			...viewItemDisplayExpressions(viewEntry).flatMap(expressionFieldPaths),
			...(viewEntry.link?.params ?? []).flatMap((param) => expressionFieldPaths(param.value)),
			...viewItemTree(viewItems(viewEntry.valuePrefix)).flatMap(viewItemContextFieldPaths),
		])
)

const viewItemContextExpression = (
	entity: Entity,
	viewEntry: _ViewItem
) => {
	const fieldPaths = viewItemContextFieldPaths(viewEntry)
	const entityFieldNames = fieldPaths.flatMap(([fieldName]) => fieldName === 'value' || fieldName == null ? [] : [fieldName])
	const usesSelectorFields = entityFieldNames.some((fieldName) => entitySelectorOwnsField(entity, fieldName))
	const usesResolvedFields = entityFieldNames.some((fieldName) => !entitySelectorOwnsField(entity, fieldName))
	if (usesSelectorFields && usesResolvedFields)
		throw new Error('View item expression mixes selector and resolved fields')

	const entityFieldsExpression = usesSelectorFields ? 'selection.entitySelector' : 'entity'

	return entityFieldsExpression
}

const summarySerial = (entity: Entity) => entitySingularView(entity)?.summary?.serial

const declarativeSummaryQueryFieldReferences = (entity: Entity, indexes: GenerationIndexes, visitedEntityTypes = new Set<EntityType>()): FieldReference[] | undefined => {
	const summaryPlan = summaryPlanFor(entity, indexes)
	if (
		[
			summaryPlan.icon,
			summaryPlan.title,
			summaryPlan.value,
		].some(({ raw }) => raw != null)
		|| visitedEntityTypes.has(entity.entityType)
	)
		return undefined

	const fields: FieldReference[] = []
	for (const fieldReference of summaryPlan.allEntries.flatMap(viewItemFieldReferences)) {
		if (isProjectionFieldReference(fieldReference))
			return undefined

		const fieldDefinition = fieldDefinitionByReference(entity, fieldReference, indexes)
		if (fieldDefinition == null || fieldDefinition.type === EntityFieldType.EntitiesReference)
			return undefined
		if (fieldDefinition.type === EntityFieldType.Primitive) {
			if (!entitySelectorOwnsField(entity, fieldReference))
				fields.push(fieldReference)
			continue
		}
		const targetEntity = fieldDefinition.entityType == null ? undefined : indexes.entityByType[fieldDefinition.entityType]
		const targetSummaryFields = targetEntity == null || fieldDefinition.cardinality !== EntityFieldCardinality.One ?
			undefined
		:
			declarativeSummaryQueryFieldReferences(
				targetEntity,
				indexes,
				new Set([
					...visitedEntityTypes,
					entity.entityType,
				])
			)
		if (targetSummaryFields == null)
			return undefined
		fields.push(...(
			targetSummaryFields.length === 0 ?
				[fieldReference]
			:
				targetSummaryFields.map((targetFieldReference) => `${fieldReference}.${fieldReferenceKey(targetFieldReference)}`)
		))
	}

	return unique(fields)
}

const allViewItems = (entity: Entity, indexes: GenerationIndexes) => {
	const singularView = entitySingularView(entity)
	const content = singularView?.content
	const details = singularView?.details

	return viewItemTree([
		...summaryPlanFor(entity, indexes).allEntries,
		...contentDlGroups(entity, indexes).flat(),
		...(content?.body == null ? [] : [content.body]),
		...(content?.blocks ?? []).flat(),
		...(details?.body == null ? [] : [details.body]),
		...(details?.blocks ?? []).flat(),
		...(details?.tabs ?? []).flatMap((group) => group.items ?? []),
		...(singularView?.carousels ?? []).flatMap((group) => group.sections.flatMap((section) => section.items ?? [])),
	])
}

const viewItemImports = (entity: Entity, indexes: GenerationIndexes) => {
	const expressionImportMap = new Map<string, Set<string>>()
	const displayImports: ImportSpec[] = []
	for (const viewEntry of allViewItems(entity, indexes)) {
		const fieldReference = itemFieldReferences(viewEntry)[0]
		if (fieldReference != null) {
			const fieldDefinition = fieldDefinitionByReference(entity, fieldReference, indexes)
			if (fieldDefinition?.valueType != null) {
				const valueType = indexes.valueTypeById[fieldDefinition.valueType]
				displayImports.push(...emitImportObject(valueType?.displayImports))
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
			for (const expression of viewItemDisplayExpressions(viewEntry))
				expressionImports(expression, expressionImportMap)
		}
	}
	return [
		...displayImports,
		...importSpecsFromMap(expressionImportMap),
	]
}

const viewUsesFormat = (entity: Entity, indexes: GenerationIndexes, formats: readonly string[]) => (
	allViewItems(entity, indexes).some((viewEntry) => {
		const format = viewItemFormat(entity, indexes, viewEntry)
		return format != null && formats.includes(format)
	})
)

const viewEntryEntityReferenceTypes = (entity: Entity, indexes: GenerationIndexes, entries: readonly _ViewItem[]) => entries.flatMap((viewEntry) => {
	const fieldDefinition = fieldDefinitionByReference(entity, itemFieldReferences(viewEntry)[0] ?? '', indexes)
	return fieldDefinition?.type === EntityFieldType.EntityReference && fieldDefinition.entityType != null ?
		[fieldDefinition.entityType]
		:
		[]
})

const compileSummaryPlan = (entity: Entity, indexes: GenerationIndexes) => {
	const singularView = entitySingularView(entity)
	const summary = singularView?.summary
	const contentWarning = singularView?.contentWarning
	const serial = summary?.serial
	const everySelectorOwnsSerial = serial != null && entitySelectorOwnsField(entity, serial.field)
	const entries = {
		icon: viewItems(summary?.icon),
		serial: serial == null ? [] : [{
			kind: _ViewItemKind.Field,
			field: serial.field,
			format: 'numberValue',
		}, ...viewItems(serial.fallback)] satisfies _ViewItem[],
		title: viewItems(summary?.title),
		value: viewItems(summary?.value),
		titleFallback: viewItems(summary?.titleFallback),
		headingAfter: viewItems(summary?.HeadingAfter),
	}
	const allEntries = Object.values(entries).flat()
	const needsMarkup = (entries: readonly _ViewItem[]) => (
		entries.some((viewEntry) => {
			const fieldReference = itemFieldReferences(viewEntry)[0]
			return (
				fieldReference != null
				&& (
					isProjectionFieldReference(fieldReference)
					|| fieldDefinitionByReference(entity, fieldReference, indexes)?.type === EntityFieldType.EntityReference
					|| viewItemDisplayExpressions(viewEntry).length > 0
				)
				|| entries.length === 1
					&& typeof viewEntry === 'object'
					&& 'field' in viewEntry
					&& (viewItemFormat(entity, indexes, viewEntry) != null || viewEntry.link != null)
			)
		})
	)
	const resolvesEntity = (entries: readonly _ViewItem[]) => entries.some((viewEntry) => (
		viewItemFieldReferences(viewEntry).some((fieldReference) => (
			fieldDefinitionByReference(entity, fieldReference, indexes)?.type === EntityFieldType.Primitive
				&& !isProjectionFieldReference(fieldReference)
				&& !entitySelectorOwnsField(entity, fieldReference)
		))
	))
	const slot = (entries: readonly _ViewItem[], raw: string | undefined, rendersSerial = false, contentWarningAware = false) => ({
		entries,
		raw,
		rendersSerial,
		entityReferenceTypes: viewEntryEntityReferenceTypes(entity, indexes, rendersSerial ? [] : entries),
		needsMarkup: !contentWarningAware || contentWarning == null ? needsMarkup(entries) : false,
		resolvesEntity: contentWarningAware && contentWarning != null || resolvesEntity(entries),
		requiredScalar: viewEntriesRenderRequiredScalar(entity, indexes, entries),
	})
	const summaryDisplayFieldKeys = new Set(
		allEntries
			.flatMap(viewItemDisplayFieldReferences)
			.map(fieldReferenceKey)
	)

	return {
		allEntries,
		icon: {
			...slot(entries.icon, summary?.Icon?.raw),
			fieldReference: itemFieldReferences(summary?.icon ?? '')[0],
		},
		serial: serial == null ? undefined : {
			...serial,
			entries: entries.serial,
		},
		everySelectorOwnsSerial,
		title: slot(entries.title, summary?.Title?.raw, serial != null && (entries.title.length === 0 || entries.title.every((item) => itemFieldReferences(item)[0] === serial.field)), true),
		value: slot(entries.value, summary?.Value?.raw, serial != null && (entries.value.length === 0 || entries.value.every((item) => itemFieldReferences(item)[0] === serial.field)), true),
		headingAfter: slot(entries.headingAfter, undefined),
		titleFallback: slot(entries.titleFallback, undefined),
		fieldKeys: new Set(allEntries.flatMap(itemFieldReferences).map(fieldReferenceKey)),
		queryFields: [...new Map([
			...(singularView?.query?.fields ?? []),
			...(contentWarning == null ? [] : [
				contentWarning.sensitiveField,
				contentWarning.textField,
			]),
			...allEntries.flatMap(viewItemFieldReferences),
		].map((fieldReference) => [fieldReferenceKey(fieldReference), fieldReference])).values()].filter((fieldReference) => {
			const fieldDefinition = fieldDefinitionByReference(entity, fieldReference, indexes)
			return (
				summaryDisplayFieldKeys.has(fieldReferenceKey(fieldReference))
				|| fieldDefinition?.type === EntityFieldType.Primitive
				&& !isProjectionFieldReference(fieldReference)
				&& !entitySelectorOwnsField(entity, fieldReference)
			)
		}),
	}
}

const summaryPlanFor = (entity: Entity, indexes: GenerationIndexes) => (
	indexes.summaryPlanByEntityType?.get(entity.entityType) ?? compileSummaryPlan(entity, indexes)
)

const compileSingularViewPlan = (entity: Entity, indexes: GenerationIndexes) => {
	const singularView = entitySingularView(entity)
	const contentWarning = singularView?.contentWarning
	const summaryPlan = summaryPlanFor(entity, indexes)
	const {
		serial,
		everySelectorOwnsSerial,
	} = summaryPlan
	const summaryTitleEntries = summaryPlan.title.entries
	const summaryValueEntries = summaryPlan.value.entries
	// Selector-owned summary values read the canonical selector directly. The
	// prefetched row owns unresolved fields; only mixed expressions need the
	// merged pending entity.
	const pendingSummaryItemFieldsExpression = (viewEntry: _ViewItem) => {
		const fieldReferences = viewItemFieldReferences(viewEntry)
		const selectorOwned = fieldReferences.filter((fieldReference) => (
			entitySelectorOwnsField(entity, fieldReference)
		)).length
		if (selectorOwned === fieldReferences.length)
			return 'selection.entitySelector'
		if (selectorOwned === 0 && singularView?.pending == null)
			return 'prefetched'

		return pendingEntityExpression
	}
	const summaryItemEntityFieldsExpression = (viewEntry: _ViewItem) => (
		viewItemEntityFieldsExpression(entity, viewEntry, 'summary item')
	)
	const titleExpression = renderJoinedItemsExpression(
		entity,
		indexes,
		summaryTitleEntries,
		summaryItemEntityFieldsExpression,
		' ',
		true
	)
	const valueExpression = renderJoinedItemsExpression(
		entity,
		indexes,
		summaryValueEntries,
		summaryItemEntityFieldsExpression,
		' ',
		true
	)
	const pendingTitleExpression = renderJoinedItemsExpression(entity, indexes, summaryTitleEntries, pendingSummaryItemFieldsExpression)
	const pendingValueExpression = renderJoinedItemsExpression(entity, indexes, summaryValueEntries, pendingSummaryItemFieldsExpression)
	const warningTextExpression = (entityFieldsExpression: string) => contentWarning == null ? emitTypeScript('') : `(${fieldExpression(entityFieldsExpression, contentWarning.textField)} ?? '').trim()`
	const warningConditionExpression = (entityFieldsExpression: string) => contentWarning == null ? 'false' : `${fieldExpression(entityFieldsExpression, contentWarning.sensitiveField)} === true || ${warningTextExpression(entityFieldsExpression)} !== ''`
	const warningIdentityExpression = (entityFieldsExpression: string) => renderJoinedItemsExpression(
		entity,
		indexes,
		entity.selectors[0]?.fields ?? [],
		entityFieldsExpression
	)
	const warningSummaryExpression = (entityFieldsExpression: string) => contentWarning == null ? emitTypeScript('') : `[${warningTextExpression(entityFieldsExpression)} || ${emitTypeScript(contentWarning.fallbackText)}, ${warningIdentityExpression(entityFieldsExpression)}].filter(Boolean).join(' ')`
	const resolvedWarningTextExpression = warningTextExpression('entity')
	const resolvedWarningConditionExpression = contentWarning == null ? 'false' : `${fieldExpression('entity', contentWarning.sensitiveField)} === true || ${resolvedWarningTextExpression} !== ''`
	const resolvedWarningSummaryExpression = contentWarning == null ? emitTypeScript('') : `[${resolvedWarningTextExpression} || ${emitTypeScript(contentWarning.fallbackText)}, ${warningIdentityExpression(pendingEntityExpression)}].filter(Boolean).join(' ')`
	const fallbackTitleExpression = renderJoinedItemsExpression(
		entity,
		indexes,
		summaryPlan.titleFallback.entries,
		pendingSummaryItemFieldsExpression
	)
	const fallbackTitleEntries = summaryPlan.titleFallback.entries
	const pendingTitleIsRequiredScalar = (
		summaryPlan.title.requiredScalar
		&& summaryTitleEntries[0] != null
		&& pendingSummaryItemFieldsExpression(summaryTitleEntries[0]) === 'selection.entitySelector'
	)
	const fallbackTitleIsRequiredScalar = (
		summaryPlan.titleFallback.requiredScalar
		&& fallbackTitleEntries[0] != null
		&& pendingSummaryItemFieldsExpression(fallbackTitleEntries[0]) === 'selection.entitySelector'
	)
	const summaryValueIsRequiredScalar = summaryPlan.value.requiredScalar
	const serialIsRequiredScalar = (
		serial != null
		&& everySelectorOwnsSerial
		&& viewEntriesRenderRequiredScalar(entity, indexes, [serial.field])
	)
	const serialFallbackTitleExpression = serial == null ?
		pendingTitleIsRequiredScalar ?
			pendingTitleExpression
		: pendingTitleExpression === 'undefined' && fallbackTitleIsRequiredScalar ?
			fallbackTitleExpression
		:
			renderFirstDeclaredExpression([pendingTitleExpression, fallbackTitleExpression])
	:
		renderSerialTextExpression(
			entity,
			indexes,
			serial,
			everySelectorOwnsSerial ? 'selection.entitySelector' : pendingEntityExpression
		)
	const serialFallbackTitleIsRequiredScalar = (
		serialIsRequiredScalar
		|| serial == null
			&& (
				pendingTitleIsRequiredScalar
				|| pendingTitleExpression === 'undefined' && fallbackTitleIsRequiredScalar
			)
	)
	const renderWarningFallbackExpression = (
		expressions: readonly (string | undefined)[],
		condition: string,
		warningExpression: string
	) => {
		const fallbackExpression = renderFirstDeclaredExpression(expressions)
		return contentWarning == null ?
			fallbackExpression
			:
			renderConditionalExpression(
				[{
					condition,
					value: warningExpression,
				}],
				fallbackExpression
			)
	}
	const titleFallbackExpression = renderWarningFallbackExpression(
		[
			serialFallbackTitleExpression,
			...(serialFallbackTitleIsRequiredScalar ? [] : [emitTypeScript(displayLabel(entityLabel(entity)))]),
		],
		warningConditionExpression(pendingEntityExpression),
		warningSummaryExpression(pendingEntityExpression)
	)
	const entityTitleFallbackExpression = renderWarningFallbackExpression(
		[
			titleExpression,
			'title',
			...(titleExpression === titleFallbackExpression ? [] : ['titleFallback']),
		],
		resolvedWarningConditionExpression,
		resolvedWarningSummaryExpression
	)
	const entityValueFallbackExpression = renderWarningFallbackExpression(
		summaryValueIsRequiredScalar ? [valueExpression] : [
			valueExpression,
			titleExpression,
			...([valueExpression, titleExpression].includes(titleFallbackExpression) ? [] : ['titleFallback']),
		],
		resolvedWarningConditionExpression,
		resolvedWarningSummaryExpression
	)
	const pendingValueFallbackExpression = renderWarningFallbackExpression(
		summaryValueIsRequiredScalar && summaryValueEntries[0] != null && pendingSummaryItemFieldsExpression(summaryValueEntries[0]) === 'selection.entitySelector' ? [pendingValueExpression] : [
			pendingValueExpression,
			pendingTitleExpression,
			...([pendingValueExpression, pendingTitleExpression].includes(titleFallbackExpression) ? [] : ['titleFallback']),
		],
		warningConditionExpression(pendingEntityExpression),
		warningSummaryExpression(pendingEntityExpression)
	)
	const rawSnippetReferences = new Set(singularViewRawSnippets(entity).flatMap((snippet) => snippet.references ?? []))
	const usesPendingEntity = (
		singularView?.pending != null
		|| rawSnippetReferences.has('pendingEntity')
		|| declaredRelationshipViewSections(entity).some((section) => isFieldConditionedSourceSelection(section.selection?.sources))
		|| serial != null && !everySelectorOwnsSerial
		|| typeScriptExpressionReferencesBinding(titleFallbackExpression, pendingEntityExpression)
		|| typeScriptExpressionReferencesBinding(entityTitleFallbackExpression, pendingEntityExpression)
		|| typeScriptExpressionReferencesBinding(entityValueFallbackExpression, pendingEntityExpression)
		|| typeScriptExpressionReferencesBinding(pendingValueFallbackExpression, pendingEntityExpression)
	)

	return {
		consumesPrefetched: (
			rawSnippetReferences.has('prefetched')
			|| typeScriptExpressionReferencesBinding(titleFallbackExpression, 'prefetched')
			|| usesPendingEntity
				&& (
					singularView?.pending == null
					|| typeScriptExpressionReferencesBinding(singularView.pending.expression, 'prefetched')
				)
		),
		entityTitleFallbackExpression,
		entityValueFallbackExpression,
		pendingValueFallbackExpression,
		resolvedWarningTextExpression,
		summaryPlan,
		titleFallbackExpression,
		usesPendingEntity,
	}
}

const defaultContentDlGroups = (entity: Entity, indexes: GenerationIndexes) => {
	const singularView = entitySingularView(entity)
	const content = singularView?.content
	if (
		(content?.dl ?? []).length > 0
		|| content?.body != null
		|| (content?.blocks ?? []).length > 0
		|| (singularView?.latest ?? []).length > 0
	)
		return []

	const summaryFieldKeys = summaryPlanFor(entity, indexes).fieldKeys
	const entries = entity.fields
		.filter((fieldDefinition) => !summaryFieldKeys.has(fieldDefinition.name))
		.flatMap((fieldDefinition) => (
			fieldDefinition.type === EntityFieldType.EntitiesReference
			|| fieldDefinition.type === EntityFieldType.Primitive
				&& fieldNeedsExplicitDisplayExpression(indexes, fieldDefinition) ?
				[]
			:
				[{
					kind: _ViewItemKind.Field,
					field: fieldDefinition.name,
				} satisfies Exclude<_ViewItem, string>]
		))

	return entries.length === 0 ? [] : [entries]
}

const contentDlGroups = (entity: Entity, indexes: GenerationIndexes) => {
	const singularView = entitySingularView(entity)
	const summaryFieldKeys = summaryPlanFor(entity, indexes).fieldKeys
	const modeledDlGroups = singularView?.content?.dl ?? []
	const openFieldKeys = new Set(modeledDlGroups.flatMap((viewEntries) => viewEntries.flatMap((viewEntry) => itemFieldReferences(viewEntry).map(fieldReferenceKey))))
	const serialFieldName = summarySerial(entity)?.field
	const closedItems = viewItems(singularView?.closed)
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
		...modeledDlGroups,
		...defaultContentDlGroups(entity, indexes),
	]
}

const declaredRelationshipViewSections = (entity: Entity) => {
	const singularView = entitySingularView(entity)
	const carouselFieldKeys = new Set(
		(singularView?.carousels ?? [])
			.flatMap((carousel) => carousel.sections)
			.map((section) => fieldReferenceKey(section.field))
	)
	const configuredSections: RelationshipSection[] = [
		...[
			...(singularView?.content?.lists ?? []),
			...(singularView?.lists ?? []),
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

const declaredRelationshipSectionComponent = (section: RelationshipSection, indexes: GenerationIndexes) => {
	if (
		section.component != null
		&& Object.values(indexes.entityByType).some((entity) => (
			section.component === singularComponentName(entity.entityType)
			|| section.component === pluralComponentName(entity)
		))
	)
		return section.component

	return undefined
}

const renderSerialBadgeMarkup = (valueExpression: string, level: number) => [
	`${'\t'.repeat(level)}<span data-badge="small">`,
	`${'\t'.repeat(level + 1)}#{${valueExpression}}`,
	`${'\t'.repeat(level)}</span>`,
]

const renderSerialTextExpression = (
	entity: Entity,
	indexes: GenerationIndexes,
	serial: NonNullable<ReturnType<typeof summarySerial>>,
	entityFieldsExpression: string,
	itemFieldExpression?: ItemFieldExpression
) => {
	const fallbackExpression = renderJoinedItemsExpression(
		entity,
		indexes,
		viewItems(serial.fallback),
		entityFieldsExpression,
		' ',
		false,
		undefined,
		itemFieldExpression
	)
	const fieldDefinition = fieldDefinitionByReference(entity, serial.field, indexes)
	if (fieldDefinition == null)
		throw new Error(`${entity.entityType}.${serial.field} serial references an unknown field`)
	const serialValueExpression = (
		itemFieldExpression?.(serial.field, entityFieldsExpression)
		?? fieldExpression(entityFieldsExpression, serial.field)
	)
	const serialExpression = renderDisplayExpression(
		entity,
		indexes,
		serial.field,
		serialValueExpression,
		fieldDefinition.cardinality === EntityFieldCardinality.One
	)
	const labeledSerialExpression = `\`${templateStringText(`${serial.label} #`)}\${${templateInterpolationExpression(serialExpression)}}\``
	return renderFirstDeclaredExpression([
		fieldDefinition.cardinality === EntityFieldCardinality.One ?
			labeledSerialExpression
		:
			`(${
				valueTypeProducesString(
					fieldValueTypeType(indexes, fieldDefinition),
					fieldValueType(indexes, fieldDefinition)
				) ?
					serialValueExpression
				:
					`${serialValueExpression} != null`
			} ? ${labeledSerialExpression} : '')`,
		fallbackExpression,
	])
}

const renderSerialBody = (
	entity: Entity,
	indexes: GenerationIndexes,
	serial: NonNullable<ReturnType<typeof summarySerial>>,
	entityFieldsExpression: string,
	level: number,
	label?: string,
	fallbackEntityFieldsExpression: string | ((viewEntry: _ViewItem) => string) = entityFieldsExpression
) => {
	const fallbackExpression = renderJoinedItemsExpression(entity, indexes, viewItems(serial.fallback), fallbackEntityFieldsExpression)
	const fieldDefinition = fieldDefinitionByReference(entity, serial.field, indexes)
	if (fieldDefinition == null)
		throw new Error(`${entity.entityType}.${serial.field} serial references an unknown field`)
	const optional = fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne
	const valueLevel = optional ? level + 1 : level
	const valueExpression = optional ?
		'serialValue'
		:
		fieldExpression(entityFieldsExpression, serial.field)

	return [
		...(optional ? [`${'\t'.repeat(level)}{@const serialValue = ${fieldExpression(entityFieldsExpression, serial.field)}}`] : []),
		...(optional ? [`${'\t'.repeat(level)}{#if serialValue != null}`] : []),
		...(label == null ?
			renderSerialBadgeMarkup(valueExpression, valueLevel)
			:
			[
				`${'\t'.repeat(valueLevel)}<span data-row="inline align-center gap-2 wrap">`,
				`${'\t'.repeat(valueLevel + 1)}<span>${label} </span>`,
				...renderSerialBadgeMarkup(valueExpression, valueLevel + 1),
				`${'\t'.repeat(valueLevel)}</span>`,
			]
		),
		...(optional && serial.fallback != null ? [
			`${'\t'.repeat(level)}{:else}`,
			`${'\t'.repeat(level + 1)}{${fallbackExpression}}`,
		] : []),
		...(optional ? [`${'\t'.repeat(level)}{/if}`] : []),
	]
}

const renderSerialSnippet = (
	entity: Entity,
	indexes: GenerationIndexes,
	serial: NonNullable<ReturnType<typeof summarySerial>>,
	everySelectorOwnsSerial: boolean,
	entityName: string,
	label?: string
) => {
	if (everySelectorOwnsSerial)
		return renderSerialBody(entity, indexes, serial, 'selection.entitySelector', 2, label)

	const body = renderSerialBody(
		entity,
		indexes,
		serial,
		'entity',
		4,
		label,
		(viewEntry) => viewItemEntityFieldsExpression(entity, viewEntry, 'serial fallback item')
	)
	return [
		...renderResourceBoundaryOpen(2, entityName),
		...renderSvelteSnippet(3, 'children(entity)', body),
		'\t\t</ResourceBoundary>',
	]
}

const fieldValueNamesForViewEntries = (viewEntries: readonly _ViewItem[]) => {
	const bases = viewEntries.map((viewEntry) => {
		const fieldReference = itemFieldReferences(viewEntry)[0]
		return fieldReference == null ? 'value' : localIdentifier(fieldNameForReference(fieldReference))
	})

	return bases.map((base, index) => (
		base !== 'entity'
		&& bases.filter((candidate) => candidate === base).length === 1 ?
			base
		:
			`${base}${index + 1}`
	))
}

const generateSingularViewFile = (
	entity: Entity,
	indexes: GenerationIndexes,
	plan: ReturnType<typeof compileSingularViewPlan>
) => {
	const singularView = entitySingularView(entity)
	const viewQuery = singularView?.query
	const content = singularView?.content
	const details = singularView?.details
	const componentName = singularComponentName(entity.entityType)
	const entityName = camel(entity.entityType)
	const contentWarning = singularView?.contentWarning
	const {
		consumesPrefetched,
		entityTitleFallbackExpression,
		entityValueFallbackExpression,
		pendingValueFallbackExpression,
		resolvedWarningTextExpression,
		summaryPlan,
		titleFallbackExpression,
		usesPendingEntity,
	} = plan
	const {
		serial,
		everySelectorOwnsSerial,
	} = summaryPlan
	const summaryTitleEntries = summaryPlan.title.entries
	const summaryValueEntries = summaryPlan.value.entries
	const summaryAfterEntries = summaryPlan.headingAfter.entries
	const rendersSerialTitle = summaryPlan.title.rendersSerial
	const rendersSerialValue = summaryPlan.value.rendersSerial
	for (const viewEntry of summaryPlan.allEntries) {
		const fieldReference = itemFieldReferences(viewEntry)[0]
		if (
			fieldReference != null
			&& fieldDefinitionByReference(entity, fieldReference, indexes)?.type === EntityFieldType.EntitiesReference
		)
			throw new Error(`${entity.entityType}.${fieldNameForReference(fieldReference)} cannot render an entity list in a scalar summary`)
	}
	const universalSelectorFieldNames = new Set(
		[...entitySelectorFieldNames(entity)]
			.filter((fieldName) => entitySelectorOwnsField(entity, fieldName))
	)
	const queryFields = summaryPlan.queryFields
	const queryFieldKeys = new Set(queryFields.map(fieldReferenceKey))
	const sections = declaredRelationshipViewSections(entity)
	const detailsTabs = details?.tabs ?? []
	const summaryEntityReferenceItems = [
		...summaryPlan.title.entityReferenceTypes,
		...summaryPlan.value.entityReferenceTypes,
		...summaryPlan.headingAfter.entityReferenceTypes,
	]
	const summaryIconFieldName = summaryPlan.icon.fieldReference
	const summaryIconFieldDefinition = summaryIconFieldName == null ? undefined : fieldDefinitionByReference(entity, summaryIconFieldName, indexes)
	const summaryIconEntityReferenceComponent = (
		summaryIconFieldDefinition?.type === EntityFieldType.EntityReference
		&& summaryIconFieldDefinition.entityType != null ?
			singularComponentName(summaryIconFieldDefinition.entityType)
		:
			undefined
	)
	const contentRows = contentDlGroups(entity, indexes)
	const contentBlockEntries = (singularView?.content?.blocks ?? []).flat()
	const entityReferenceItems = viewEntryEntityReferenceTypes(entity, indexes, [
		...contentRows.flat(),
		...contentBlockEntries,
		...detailsTabs.flatMap((tab) => tab.items ?? []),
	])
	const detailsTabSections = detailsTabs.flatMap((tab) => (tab.items ?? []).flatMap((viewEntry) => {
		const field = itemFieldReferences(viewEntry)[0]
		return field == null ? [] : [{
			field,
			viewEntry,
		} satisfies RelationshipSection]
	}))
	const latestItems = singularView?.latest ?? []
	const declaredCarousels = singularView?.carousels ?? []
	const contentWarningMediaCarousels = contentWarning == null ? [] : declaredCarousels
		.map((carousel) => ({
			...carousel,
			id: `${carousel.id}-sensitive-media`,
			sections: carousel.sections
				.filter((section) => (
					section.field != null
					&& fieldDefinitionByReference(entity, section.field, indexes)?.entityType === EntityType.Media
				))
				.map((section) => ({
					...section,
					id: `${section.id}-sensitive-media`,
				})),
		}))
		.filter((carousel) => carousel.sections.length > 0)
	const carousels = contentWarning == null ? declaredCarousels : declaredCarousels
		.map((carousel) => ({
			...carousel,
			sections: carousel.sections.filter((section) => (
				section.field == null
				|| fieldDefinitionByReference(entity, section.field, indexes)?.entityType !== EntityType.Media
			)),
		}))
		.filter((carousel) => carousel.sections.length > 0)
	const carouselsToRender = [...carousels, ...contentWarningMediaCarousels]
	const carouselSourceSelections = carouselsToRender.flatMap((carousel) => carousel.sections.flatMap((section) => {
		const fieldDefinition = section.field == null ?
			undefined
			:
			fieldDefinitionByReference(entity, section.field, indexes)
		const sources = section.selection?.sources ?? fieldDefinition?.defaultSources
		return (
			sources == null
			|| !networkSourceSelectionNeedsFiltering(indexes, sources) ?
				[]
			:
				[sources]
		)
	}))
	const networkSourceApplicability = (
		entity.entityType === EntityType.Network ?
			renderNetworkSourceApplicabilityDeclarations(carouselSourceSelections)
			:
			undefined
	)
	const rawSnippets = singularViewRawSnippets(entity)
	const rawSnippetReferences = new Set(rawSnippets.flatMap((snippet) => snippet.references ?? []))
	const generatedUsesSelect = (
		latestItems.length > 0
		|| summaryIconEntityReferenceComponent != null
		|| summaryEntityReferenceItems.length > 0
		|| entityReferenceItems.length > 0
		|| sections.some((section) => fieldDefinitionByReference(entity, section.field, indexes)?.type === EntityFieldType.EntityReference)
		|| carouselsToRender.some((carousel) => carousel.sections.some((section) => (
			section.field != null
			&& carouselSectionComponent(entity, indexes, section) != null
			&& fieldDefinitionByReference(entity, section.field, indexes)?.type === EntityFieldType.EntityReference
		)))
	)
	const declaredViewSourcesExpression = renderSourceSelectionExpression(viewQuery?.sources)
	const viewSelectionExpression = (
		declaredViewSourcesExpression == null ?
			'selection'
			:
			'viewSelection'
	)
	const viewSelectionValueExpression = declaredViewSourcesExpression == null ?
		'selection'
	:
		`selection({
	sources: selection.sources ?? ${indent(declaredViewSourcesExpression, 1).trimStart()},
})`
	const query = renderQuery(
		declaredViewSourcesExpression == null || viewQuery == null ?
			viewQuery
		:
			{
				...viewQuery,
				sources: undefined,
			},
		queryFields,
		undefined,
		undefined,
		universalSelectorFieldNames
	)
	const resolvesEntity = (
		queryFields.length > 0
		|| serial != null
			&& !everySelectorOwnsSerial
			&& (rendersSerialTitle || rendersSerialValue)
		|| singularView?.summary?.icon != null
			&& summaryIconFieldName != null
			&& !entitySelectorOwnsField(entity, summaryIconFieldName)
		|| rawSnippetReferences.has('resolvedEntity')
	)
	// Every branch that consumes the shared entity query declares one reference.
	// A single consumer receives the query expression directly; multiple consumers
	// share one durable derived resource.
	const entityResourceReferenceCount = (
		rawSnippets.filter((snippet) => snippet.references?.includes('resolvedEntity') === true).length
		+ (
			singularView?.summary?.Icon == null
			&& singularView?.summary?.icon != null
			&& summaryIconFieldName != null
			&& !entitySelectorOwnsField(entity, summaryIconFieldName) ?
				1
			:
				0
		)
		+ (
			summaryPlan.title.raw == null
			&& (
				serial != null && summaryPlan.title.rendersSerial && !everySelectorOwnsSerial
				|| summaryPlan.title.resolvesEntity
			) ?
				1
			:
				0
		)
		+ (
			summaryPlan.value.raw == null
			&& (
				serial != null && summaryPlan.value.rendersSerial && !everySelectorOwnsSerial
				|| summaryPlan.value.resolvesEntity
			) ?
				1
			:
				0
		)
		+ (
			summaryAfterEntries.length > 0
			&& summaryPlan.headingAfter.resolvesEntity ?
				1
			:
				0
		)
		+ contentRows
			.flat()
			.filter((viewEntry) => {
				if (
					typeof viewEntry === 'object'
					&& (
						'kind' in viewEntry
						|| 'primitiveList' in viewEntry && viewEntry.primitiveList != null
					)
				)
					return false

				const fieldReference = itemFieldReferences(viewEntry)[0]
				return (
					fieldReference != null
					&& !isProjectionFieldReference(fieldReference)
					&& fieldDefinitionByReference(entity, fieldReference, indexes)?.type === EntityFieldType.Primitive
					&& !entitySelectorOwnsField(entity, fieldReference)
					&& viewItemFieldReferences(viewEntry).every((field) => queryFieldKeys.has(fieldReferenceKey(field)))
				)
			})
			.length
		+ (
			content?.body != null
			&& queryFieldKeys.has(fieldReferenceKey(content.body.field)) ?
				1
			:
				0
		)
	)
	const inlineEntityResource = resolvesEntity && entityResourceReferenceCount === 1
	const entityResourceExpression = !inlineEntityResource ?
		entityName
	: query === '{}' ?
		viewSelectionValueExpression
	:
		`${viewSelectionValueExpression}(${query})`
	const sectionQueries = sections.map((section) => renderQuery(fieldQuery(
		fieldDefinitionByReference(entity, section.field, indexes),
		section.selection
	), []))
	const latestQueries = latestItems.map((latest) => renderQuery(latest.query, latest.fields ?? []))
	const carouselQueries = carouselsToRender.flatMap((carousel) => carousel.sections.flatMap((section) => {
		if (carouselSectionComponent(entity, indexes, section) == null)
			return []

		const fieldDefinition = section.field == null ? undefined : fieldDefinitionByReference(entity, section.field, indexes)
		const sources = section.selection?.sources ?? fieldDefinition?.defaultSources

		return [renderQuery(
			fieldDefinition?.type === EntityFieldType.EntityReference
			|| entity.entityType === EntityType.Network
				&& sources != null
				&& networkSourceSelectionNeedsFiltering(indexes, sources) ?
				section.selection
			:
				fieldQuery(fieldDefinition, section.selection),
			[]
		)]
	}))
	const {
		expression: entityHrefExpression,
		fieldBindings: hrefFieldBindings,
	} = entityRouteHrefPlan(
		indexes,
		entity,
		'selection.entitySelector',
		'derived',
		[
			camel(entity.entityType),
			'contentWarningSelectorKey',
			'href',
			'layout',
			'open',
			'pendingEntity',
			'prefetched',
			'revealedContentWarningSelectorKey',
			'selection',
			'title',
			'titleFallback',
			'viewSelection',
		]
	)
	const iconMarkup = (
		singularView?.summary?.Icon != null
		|| singularView?.summary?.icon != null
	) ? renderIconSnippet(entity, indexes, entityResourceExpression) : []
	const declaredImportSpecs = mergeImports([
		...(entityHrefExpression == null ? [] : entityRouteImportSpecs(indexes, entity.entityType)),
		...emitImportObject(singularView?.imports),
		...emitImportObject(singularView?.pending?.imports),
		...rawSnippets.flatMap((snippet) => emitImportObject(snippet.imports)),
		...viewItemImports(entity, indexes),
	])
	const declaredComponentImportSpecs = declaredImportSpecs.filter((importSpec) => (
		importSpec.from.endsWith('.svelte')
		&& importSpec.from !== '$/routes/+layout.svelte'
	))
	const declaredContextImportSpecs = declaredImportSpecs.filter((importSpec) => importSpec.from === '$/routes/+layout.svelte')
	const expressionImportSpecs = declaredImportSpecs.filter((importSpec) => (
		!importSpec.from.endsWith('.svelte')
		&& importSpec.from !== '$/routes/+layout.svelte'
	))
	const usesTruncatedValue = viewUsesFormat(entity, indexes, ['truncated', 'namespaceReference', 'url'])
	const contextImportSpecs = mergeImports([
		...declaredContextImportSpecs,
		...(generatedUsesSelect ? [{
			from: '$/routes/+layout.svelte',
			names: ['select'],
		}] : []),
	])
	const relationshipMarkup = renderRelationshipSections(entity, indexes, sections)
	const detailTabsMarkup = detailsTabs.length === 0 ? [] : renderDetailsTabs(entity, indexes, detailsTabs)
	const carouselMarkup = renderProjectionPathTree(
		entity,
		indexes,
		carousels,
		(carousel) => carousel.projectionPath ?? [],
		(carousel) => renderCarousel(
			entity,
			indexes,
			carousel,
			networkSourceApplicability?.sharedSourceSelectionNames
		),
		3
	)
	const contentWarningMediaMarkup = contentWarningMediaCarousels.flatMap((carousel) => renderCarousel(
		entity,
		indexes,
		carousel,
		networkSourceApplicability?.sharedSourceSelectionNames
	))
	const detailBlockMarkup = (details?.blocks ?? []).flatMap((viewEntries) => viewEntries.flatMap((viewEntry) => renderContentBlock(
		entity,
		indexes,
		typeof viewEntry === 'object' && 'when' in viewEntry ? { ...viewEntry, when: 'always' } : viewEntry,
		'detailsOpen',
		3
	)))
	const latestMarkup = renderLatestContentItems(entity, indexes, latestItems, 3)
	const contentDlViewEntries = (viewEntries: readonly _ViewItem[]) => viewEntries.filter((viewEntry) => {
		const fieldName = itemFieldReferences(viewEntry)[0]
		const fieldDefinition = fieldName == null ? undefined : fieldDefinitionByReference(entity, fieldName, indexes)
		return fieldDefinition?.type !== EntityFieldType.EntitiesReference
	})
	const relationshipFieldKeys = new Set(sections.map((section) => fieldReferenceKey(section.field)))
	const carouselFieldKeys = new Set(
		declaredCarousels
			.flatMap((carousel) => carousel.sections)
			.map((section) => fieldReferenceKey(section.field))
	)
	const contentListRelationshipSections = contentRows.flatMap((viewEntries) => viewEntries.flatMap((viewEntry) => {
		const field = itemFieldReferences(viewEntry)[0]
		if (field == null)
			return ([] satisfies RelationshipSection[])

		const fieldDefinition = fieldDefinitionByReference(entity, field, indexes)
		if (fieldDefinition?.type !== EntityFieldType.EntitiesReference)
			return ([] satisfies RelationshipSection[])

		const fieldKey = fieldReferenceKey(field)
		// Already executed via singularView.lists or carousels.
		if (relationshipFieldKeys.has(fieldKey) || carouselFieldKeys.has(fieldKey))
			return ([] satisfies RelationshipSection[])

		return [{
			field,
			viewEntry,
		}]
	}))
	const contentListSectionsFromDl = contentListRelationshipSections.flatMap((section) => (
		renderRelationshipSection(entity, indexes, section, 2)
	))
	const sectionComponentPlans = [
		...[...sections, ...detailsTabSections].map((section) => ({
			kind: 'relationship' as const,
			field: section.field,
			component: declaredRelationshipSectionComponent(section, indexes),
		})),
		...contentListRelationshipSections.map((section) => ({
			kind: 'contentList' as const,
			field: section.field,
			component: declaredRelationshipSectionComponent(section, indexes),
		})),
		...carouselsToRender.flatMap((carousel) => carousel.sections.map((section) => ({
			kind: 'carousel' as const,
			field: section.field,
			component: carouselSectionComponent(entity, indexes, section),
		}))),
	].map((plan) => ({
		...plan,
		...compileSectionComponentPlan(
			indexes,
			plan.field == null ? undefined : fieldDefinitionByReference(entity, plan.field, indexes),
			plan.component
		),
	}))
	const sectionComponents = unique(sectionComponentPlans.flatMap((plan) => (
		plan.kind !== 'relationship'
		|| plan.component == null
		|| plan.rendersDefaultEntitiesList ?
			[]
		:
			[plan.component]
	)).concat(
		[...entityReferenceItems, ...summaryEntityReferenceItems].flatMap((entityType) => {
			const targetEntity = indexes.entityByType[entityType]
			return targetEntity == null ? [] : [singularComponentName(targetEntity.entityType)]
		}),
		latestItems.flatMap((latest) => {
			const component = latestComponentName(entity, indexes, latest)
			return component == null ? [] : [component]
		}),
		detailsTabs.flatMap((tab) => (
			tab.items.flatMap((item) => item.component == null ? [] : [item.component])
		)),
		sectionComponentPlans.flatMap((plan) => (
			plan.kind !== 'carousel'
			|| plan.component == null
			|| plan.rendersDefaultEntitiesList ?
				[]
			:
				[plan.component]
		)),
		...(summaryIconEntityReferenceComponent == null ? [] : [summaryIconEntityReferenceComponent])
	))
	// Only generated default collection branches introduce the shared list component.
	// Authored raw snippets own their imports through the declared view import contract.
	const usesGeneratedEntitiesList = sectionComponentPlans.some((plan) => (
		plan.rendersDefaultEntitiesList
		|| plan.kind === 'carousel'
			&& plan.fieldDefinition?.type === EntityFieldType.EntityReference
			&& plan.fieldDefinition.cardinality === EntityFieldCardinality.Many
	))
	const contentRowsToRender = contentRows
		.map((viewEntries) => contentDlViewEntries(viewEntries))
		.filter((viewEntries) => viewEntries.length > 0)
	const contentBody = content?.body
	const contentUsesOpen = (
		contentRowsToRender.flat().some(viewItemUsesOpen)
		|| contentBlockEntries.some(viewItemUsesOpen)
		|| (
			contentWarning == null
			&& (contentBody?.when === 'open' || contentBody?.when === 'closed')
		)
	)
	const contentWarningBodyMarkup = contentBody == null || contentWarning == null ? [] : renderValueMarkup(
		entity,
		indexes,
		{
			field: contentBody.field,
			format: contentBody.format === 'longText' ? 'bodyLongText' : contentBody.format === 'text' ? 'bodyText' : contentBody.format,
		},
		contentBody.field,
		localIdentifier(contentBody.field),
		'entity',
		3
	)
	const contentBlockMarkup = contentBlockEntries.flatMap((viewEntry) => renderContentBlock(entity, indexes, viewEntry, 'contentOpen', 2))
	const contentWarningContentMarkup = contentWarning == null || contentBody == null ? [] : [
		'	{#snippet ContentWarningContent(content)}',
		'		{#if content != null && content !== \'\'}',
		...contentWarningBodyMarkup,
		'		{/if}',
		...reindentLines(contentWarningMediaMarkup, 2),
		'	{/snippet}',
	]
	// Only unresolved primitive content queries consume the view-owned source
	// selection. Selector fields, projection fields, and relationship resources
	// use their own explicit resource bases.
	const viewSelectionOwnedReferenceCount = (
		contentRowsToRender
			.flat()
			.filter((viewEntry) => {
				if (
					typeof viewEntry === 'object'
					&& (
						'kind' in viewEntry
						|| 'primitiveList' in viewEntry && viewEntry.primitiveList != null
					)
				)
					return false

				const fieldReference = itemFieldReferences(viewEntry)[0]
				const fieldDefinition = fieldReference == null ? undefined : fieldDefinitionByReference(entity, fieldReference, indexes)
				return (
					fieldReference != null
					&& !isProjectionFieldReference(fieldReference)
					&& fieldDefinition?.type === EntityFieldType.Primitive
					&& !entitySelectorOwnsField(entity, fieldReference)
					&& !viewItemFieldReferences(viewEntry).every((field) => queryFieldKeys.has(fieldReferenceKey(field)))
				)
			})
			.length
		+ (
			contentBody != null
			&& contentWarning == null
			&& !queryFieldKeys.has(fieldReferenceKey(contentBody.field)) ?
				1
			:
				0
		)
		+ (contentWarning != null && contentBody != null ? 1 : 0)
	)
	const rawViewSelectionReferenceCount = rawSnippets
		.filter((snippet) => snippet.references?.includes('viewSelection') === true)
		.length
	const viewSelectionReferenceCount = (
		(resolvesEntity && !inlineEntityResource ? 1 : 0)
		+ viewSelectionOwnedReferenceCount
		+ rawViewSelectionReferenceCount
	)
	const renderViewSelectionOwnedMarkup = (selectionExpression: string) => ({
		contentRowMarkup: renderProjectionOwnedGroups(
			entity,
			indexes,
			contentRowsToRender,
			(viewEntries) => viewEntries.flatMap(viewItemFieldReferences),
			(viewEntries, projectionFieldResourceBase) => [
				'\t\t<dl data-column-item="center">',
				...(
					projectionFieldResourceBase == null ?
						renderProjectionOwnedGroups(
							entity,
							indexes,
							viewEntries,
							viewItemFieldReferences,
							(viewEntry, fieldResourceBase) => renderContentItem(
								entity,
								indexes,
								viewEntry,
								'contentOpen',
								3,
								selectionExpression,
								false,
								entityResourceExpression,
								queryFieldKeys,
								fieldResourceBase ?? 'selection'
							),
							3
						)
					:
						viewEntries.flatMap((viewEntry) => renderContentItem(
							entity,
							indexes,
							viewEntry,
							'contentOpen',
							3,
							selectionExpression,
							false,
							entityResourceExpression,
							queryFieldKeys,
							projectionFieldResourceBase
						))
				),
				'\t\t</dl>',
			],
			2,
			2
		),
		contentBodyMarkup: contentBody == null || contentWarning != null ? [] : renderBodySection(
			entity,
			indexes,
			contentBody,
			'contentOpen',
			2,
			selectionExpression,
			entityResourceExpression,
			queryFieldKeys
		),
		contentWarningMarkup: contentWarning == null || contentBody == null ? [] : [
			'		<ResourceBoundary',
			renderSvelteAttribute(3, 'resource', `${selectionExpression}(${renderQuery(undefined, [
				contentBody.field,
				contentWarning.sensitiveField,
				contentWarning.textField,
			])})`),
			'		>',
			'			{#snippet children(entity)}',
			`				{@const ${localIdentifier(contentBody.field)} = ${fieldExpression('entity', contentBody.field)}}`,
			`				{@const contentWarningText = ${resolvedWarningTextExpression}}`,
			`				{#if ${fieldExpression('entity', contentWarning.sensitiveField)} === true || contentWarningText !== ''}`,
			'					<Collapsible',
			'						open={revealedContentWarningSelectorKey === contentWarningSelectorKey}',
			'						ontoggle={(event) => {',
			'							revealedContentWarningSelectorKey = event.currentTarget.open ? contentWarningSelectorKey : undefined',
			'						}}',
			'					>',
			'						{#snippet Summary()}',
			'							<header data-row="align-center gap-3 wrap">',
			`								<strong>{contentWarningText || ${emitTypeScript(contentWarning.fallbackText)}}</strong>`,
			'								<span data-text="annotation">Show content</span>',
			'							</header>',
			'						{/snippet}',
			'						{#if revealedContentWarningSelectorKey === contentWarningSelectorKey}',
			`							{@render ContentWarningContent(${localIdentifier(contentBody.field)})}`,
			'						{/if}',
			'					</Collapsible>',
			'				{:else}',
			`					{@render ContentWarningContent(${localIdentifier(contentBody.field)})}`,
			'				{/if}',
			'			{/snippet}',
			'		</ResourceBoundary>',
		],
	})
	const renderedViewSelectionExpression = (
		declaredViewSourcesExpression != null
		&& viewSelectionReferenceCount === 1
		&& rawViewSelectionReferenceCount === 0 ?
			viewSelectionValueExpression
		:
			viewSelectionExpression
	)
	const {
		contentRowMarkup,
		contentBodyMarkup,
		contentWarningMarkup,
	} = renderViewSelectionOwnedMarkup(renderedViewSelectionExpression)
	const renderSummaryItemMarkup = (
		viewEntry: _ViewItem,
		fieldValueName: string,
		refLayout: 'Title' | 'Value',
		level: number
	) => {
		if (typeof viewEntry === 'object' && 'kind' in viewEntry && viewEntry.kind === _ViewItemKind.Text)
			return [
				renderSvelteTextOrExpression(level, emitTypeScript(displayLabel(viewEntry.value ?? viewEntry.label))),
			]
		if (typeof viewEntry === 'object' && 'text' in viewEntry && viewEntry.text != null)
			return [
				renderSvelteTextOrExpression(level, emitTypeScript(displayLabel(viewEntry.text))),
			]

		const fieldReference = itemFieldReferences(viewEntry)[0]
		const fieldName = fieldReference == null ? undefined : fieldNameForReference(fieldReference)
		if (fieldName == null)
			throw new Error(`${entity.entityType} summary item is missing a field reference`)

		const fieldDefinition = fieldDefinitionByReference(entity, fieldReference, indexes)
		if (isProjectionFieldReference(fieldReference) && fieldDefinition?.type === EntityFieldType.Primitive) {
			const optional = fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne
			return [
				`${'\t'.repeat(level)}<ResourceBoundary`,
				renderSvelteAttribute(level + 1, 'resource', fieldProxyResourceExpression('projection', fieldName)),
				`${'\t'.repeat(level)}>`,
				`${'\t'.repeat(level + 1)}{#snippet children(${fieldValueName})}`,
				...(optional ? [`${'\t'.repeat(level + 2)}{#if ${fieldValueName} != null}`] : []),
				...renderValueMarkup(entity, indexes, viewEntry, fieldReference, fieldValueName, `({ value: ${fieldValueName} })`, optional ? level + 3 : level + 2),
				...(optional ? [`${'\t'.repeat(level + 2)}{/if}`] : []),
				`${'\t'.repeat(level + 1)}{/snippet}`,
				`${'\t'.repeat(level)}</ResourceBoundary>`,
			]
		}
		if (fieldDefinition?.type === EntityFieldType.EntityReference && fieldDefinition.entityType != null) {
			const targetEntity = indexes.entityByType[fieldDefinition.entityType]
			if (targetEntity == null)
				throw new Error(`${entity.entityType}.${fieldName} summary EntityReference targets missing entity type ${fieldDefinition.entityType}`)

			const component = singularComponentName(targetEntity.entityType)
			const targetEntityName = camel(targetEntity.entityType)
			const optional = fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne
			const referenceLevel = level + (optional ? 3 : 2)
			const targetHasHref = (indexes.entityRouteLinksByType[targetEntity.entityType]?.length ?? 0) > 0
			if (entitySelectorOwnsField(entity, fieldReference)) {
				const selectorExpression = fieldExpression('selection.entitySelector', fieldReference)

				return [
					`${'\t'.repeat(level)}<${componentIdentifier(component)}`,
					renderSvelteAttribute(level + 1, 'selection', `select(EntityType.${targetEntity.entityType}, ${selectorExpression})`),
					...(targetHasHref ? [`${'\t'.repeat(level + 1)}href={null}`] : []),
					`${'\t'.repeat(level + 1)}layout={EntityLayout.${refLayout}}`,
					`${'\t'.repeat(level)}/>`,
				]
			}

			return [
				`${'\t'.repeat(level)}<ResourceBoundary`,
				renderSvelteAttribute(level + 1, 'resource', fieldProxyResourceExpression('selection', fieldName)),
				`${'\t'.repeat(level)}>`,
				`${'\t'.repeat(level + 1)}{#snippet children(${targetEntityName})}`,
				...(optional ? [`${'\t'.repeat(level + 2)}{#if ${targetEntityName} != null}`] : []),
				`${'\t'.repeat(referenceLevel)}<${componentIdentifier(component)}`,
				renderSvelteAttribute(referenceLevel + 1, 'selection', `select(EntityType.${targetEntity.entityType}, ${targetEntityName}[EntityMetaKey.Selector])`),
				...(viewComponentAcceptsPrefetched(indexes, targetEntity.entityType, component) ? [
					`${'\t'.repeat(referenceLevel + 1)}prefetched={${targetEntityName}}`,
				] : []),
				...(targetHasHref ? [`${'\t'.repeat(referenceLevel + 1)}href={null}`] : []),
				`${'\t'.repeat(referenceLevel + 1)}layout={EntityLayout.${refLayout}}`,
				`${'\t'.repeat(referenceLevel)}/>`,
				...(optional ? [`${'\t'.repeat(level + 2)}{/if}`] : []),
				`${'\t'.repeat(level + 1)}{/snippet}`,
				`${'\t'.repeat(level)}</ResourceBoundary>`,
			]
		}

		const selectorOwnsField = entitySelectorOwnsField(entity, fieldReference)
		const fieldValueExpression = selectorOwnsField ?
			fieldExpression('selection.entitySelector', fieldReference)
			:
			fieldExpression('entity', fieldName)
		const optional = !selectorOwnsField && fieldDefinition?.cardinality === EntityFieldCardinality.ZeroOrOne
		const valueExpression = optional ? fieldValueName : fieldValueExpression
		return [
			...(optional ? [`${'\t'.repeat(level)}{@const ${fieldValueName} = ${fieldValueExpression}}`] : []),
			...(optional ? [`${'\t'.repeat(level)}{#if ${fieldValueName} != null}`] : []),
			...renderValueMarkup(
				entity,
				indexes,
				viewEntry,
				fieldName,
				valueExpression,
				viewItemContextExpression(entity, viewEntry),
				optional ? level + 1 : level
			),
			...(optional ? [`${'\t'.repeat(level)}{/if}`] : []),
		]
	}
	const renderSummaryItemsMarkup = (
		viewEntries: readonly _ViewItem[],
		refLayout: 'Title' | 'Value',
		level: number
	) => {
		const fieldValueNames = fieldValueNamesForViewEntries(viewEntries)

		return groupAdjacentBy(
			viewEntries.map((viewEntry, viewEntryIndex) => {
				const fieldReference = itemFieldReferences(viewEntry)[0]
				const fieldDefinition = fieldReference == null ? undefined : fieldDefinitionByReference(entity, fieldReference, indexes)
				return {
					projectionPath: (
						fieldReference != null
						&& isProjectionFieldReference(fieldReference)
						&& fieldDefinition?.type === EntityFieldType.Primitive ?
							fieldReference.slice(0, -1)
						:
							undefined
					),
					viewEntry,
					viewEntryIndex,
				}
			}),
			({ projectionPath }, index) => projectionPath == null ?
				`item:${index}`
			:
				projectionPathKey(entity.entityType, projectionPath)
		).flatMap((group) => {
			const projectionPath = group[0].projectionPath
			if (projectionPath == null)
				return group.flatMap(({ viewEntry, viewEntryIndex }) => (
					renderSummaryItemMarkup(viewEntry, fieldValueNames[viewEntryIndex] ?? 'value', refLayout, level)
				))

			return [
				`${'\t'.repeat(level)}<ProjectionBoundary`,
				renderSvelteAttribute(level + 1, 'resource', projectionPath.reduce(
					(expression, facetName) => `${expression}${propertyAccess(facetName)}`,
					'selection'
				)),
				`${'\t'.repeat(level)}>`,
				`${'\t'.repeat(level + 1)}{#snippet Applicable(projection)}`,
				...group.flatMap(({ viewEntry, viewEntryIndex }) => (
					renderSummaryItemMarkup(viewEntry, fieldValueNames[viewEntryIndex] ?? 'value', refLayout, level + 2)
				)),
				`${'\t'.repeat(level + 1)}{/snippet}`,
				`${'\t'.repeat(level)}</ProjectionBoundary>`,
			]
		})
	}
	const entitySummaryTitleMarkup = summaryPlan.title.needsMarkup ? renderSummaryItemsMarkup(summaryTitleEntries, 'Title', 4) : []
	const entitySummaryValueMarkup = summaryPlan.value.needsMarkup ? renderSummaryItemsMarkup(summaryValueEntries, 'Value', 4) : []
	const summaryTitleResolvesEntity = summaryPlan.title.resolvesEntity
	const summaryValueResolvesEntity = summaryPlan.value.resolvesEntity
	const entityViewOwnsTitleFallback = (
		typeScriptStringValue(titleFallbackExpression) === entity.labels.singular
		&& rawSnippets.length === 0
		&& !(serial != null && rendersSerialTitle)
		&& !summaryTitleResolvesEntity
		&& entitySummaryTitleMarkup.length === 0
	)
	const usesTitleFallbackBinding = (
		rawSnippetReferences.has('titleFallback')
		|| singularView?.summary?.Title == null && !(serial != null && rendersSerialTitle) && summaryTitleResolvesEntity && entitySummaryTitleMarkup.length === 0 && typeScriptExpressionReferencesBinding(entityTitleFallbackExpression, 'titleFallback')
		|| (singularView?.summary?.Value != null || rendersSerialValue || summaryValueEntries.length > 0) && singularView?.summary?.Value == null && !(serial != null && rendersSerialValue) && entitySummaryValueMarkup.length === 0 && typeScriptExpressionReferencesBinding(summaryValueResolvesEntity ? entityValueFallbackExpression : pendingValueFallbackExpression, 'titleFallback')
	)
	const summaryAfterMarkup = (
		summaryAfterEntries.length === 0 ?
			[]
		:
			renderSummaryAfter(entity, indexes, summaryPlan.headingAfter.resolvesEntity ? entityResourceExpression : undefined, summaryAfterEntries)
	)
	const detailBody = details?.body
	const detailBodyMarkup = detailBody == null ? [] : renderBodySection(entity, indexes, detailBody, 'detailsOpen', 3)
	const detailsMarkup = [
		...relationshipMarkup,
		...detailTabsMarkup,
		...carouselMarkup,
		...detailBodyMarkup,
		...detailBlockMarkup,
	]
	const generatedUsesProjectionBoundary = (
		allViewItems(entity, indexes).some((viewEntry) => itemFieldReferences(viewEntry).some(isProjectionFieldReference))
		|| sections.some((section) => isProjectionFieldReference(section.field))
		|| latestItems.some((latest) => isProjectionFieldReference(latest.field))
		|| carouselsToRender.some((carousel) => (
			carousel.projectionPath != null
			|| carousel.sections.some((section) => (
				section.field != null
				&& isProjectionFieldReference(section.field)
			))
		))
	)
	const generatedUsesIconComponent = (
		singularView?.summary?.Icon == null
		&& singularView?.summary?.icon != null
		&& summaryIconFieldDefinition?.type !== EntityFieldType.EntityReference
	)
	const generatedUsesTooltip = carouselsToRender.some((carousel) => carousel.description != null)
	const generatedUsesEntityMetaKey = (
		usesGeneratedEntitiesList
		|| latestItems.length > 0
		|| [
			...summaryPlan.allEntries,
			...contentRows.flat(),
			...detailsTabs.flatMap((tab) => tab.items ?? []),
		].some((viewEntry) => {
			const fieldReference = itemFieldReferences(viewEntry)[0]
			return (
				fieldReference != null
				&& fieldDefinitionByReference(entity, fieldReference, indexes)?.type === EntityFieldType.EntityReference
				&& !entitySelectorOwnsField(entity, fieldReference)
			)
		})
		|| summaryIconFieldDefinition?.type === EntityFieldType.EntityReference
			&& summaryIconFieldName != null
			&& !entitySelectorOwnsField(entity, summaryIconFieldName)
		|| [
			...sections,
			...detailsTabSections,
			...contentListRelationshipSections,
		].some((section) => (
			fieldDefinitionByReference(entity, section.field, indexes)?.type === EntityFieldType.EntityReference
			&& !entitySelectorOwnsField(entity, section.field)
		))
		|| carouselsToRender.some((carousel) => carousel.sections.some((section) => (
			section.field != null
			&& fieldDefinitionByReference(entity, section.field, indexes)?.type === EntityFieldType.EntityReference
		)))
	)
	const generatedUsesResourceBoundary = (
		contentWarning != null
		|| latestItems.length > 0
		|| singularView?.summary?.icon != null
			&& summaryPlan.icon.raw == null
			&& summaryIconFieldName != null
			&& !entitySelectorOwnsField(entity, summaryIconFieldName)
		|| summaryPlan.title.raw == null && summaryPlan.title.resolvesEntity
		|| summaryPlan.value.raw == null && summaryPlan.value.resolvesEntity
		|| [
			...sections,
			...detailsTabSections,
			...contentListRelationshipSections,
		].some((section) => {
			const fieldDefinition = fieldDefinitionByReference(entity, section.field, indexes)
			return (
				fieldDefinition?.type === EntityFieldType.EntitiesReference
				|| fieldDefinition?.type === EntityFieldType.EntityReference
					&& !entitySelectorOwnsField(entity, section.field)
			)
		})
		|| carouselsToRender.some((carousel) => carousel.sections.some((section) => {
			if (section.field == null)
				return false

			const fieldDefinition = fieldDefinitionByReference(entity, section.field, indexes)
			return (
				fieldDefinition?.type === EntityFieldType.Primitive
				|| fieldDefinition?.type === EntityFieldType.EntityReference
					&& fieldDefinition.cardinality !== EntityFieldCardinality.Many
			)
		}))
		|| allViewItems(entity, indexes).some((viewEntry) => {
			if (typeof viewEntry === 'object' && 'kind' in viewEntry && viewEntry.kind === _ViewItemKind.Text)
				return false
			if (typeof viewEntry === 'object' && 'kind' in viewEntry && viewEntry.kind === _ViewItemKind.Block)
				return (
					viewEntry.fields != null
					&& viewEntry.fields.length > 0
				)

			const fieldReference = itemFieldReferences(viewEntry)[0]
			const fieldDefinition = fieldReference == null ? undefined : fieldDefinitionByReference(entity, fieldReference, indexes)
			return (
				fieldReference != null
				&& fieldDefinition?.type !== EntityFieldType.EntitiesReference
				&& !entitySelectorOwnsField(entity, fieldReference)
			)
		})
	)
	const usesViewSelection = (
		declaredViewSourcesExpression != null
		&& (
			viewSelectionReferenceCount > 1
			|| rawViewSelectionReferenceCount > 0
		)
	)
	const viewBindings = {
		titleFallback: usesTitleFallbackBinding ? 'titleFallback' : titleFallbackExpression,
		viewSelection: declaredViewSourcesExpression != null && !usesViewSelection ? viewSelectionValueExpression : viewSelectionExpression,
		pendingEntity: pendingEntityExpression,
	}
	const usesViewDomId = (
		carouselsToRender.length > 0
		|| detailsTabs.length > 0
		|| content?.body?.id != null
		|| details?.body?.id != null
	)
	const relationshipSourceSelections = [...new Map(sections.flatMap((section) => (
		isFieldConditionedSourceSelection(section.selection?.sources) ? [[
			sourceSelectionName(section.selection.sources),
			section.selection.sources,
		] as const] : []
	))).values()]
	// Canonical collection hrefs are TypeScript expressions. Their declared
	// expression imports are selected from those expressions, never from markup.
	const renderedCollectionRouteExpressions = [
		...[
			...sections,
			...detailsTabSections,
			...contentListRelationshipSections,
		].flatMap((section) => {
			const fieldDefinition = fieldDefinitionByReference(entity, section.field, indexes)
			if (
				section.href != null
				|| fieldDefinition?.type !== EntityFieldType.EntitiesReference
				|| fieldDefinition.entityType == null
			)
				return []

			const expression = renderCollectionRouteValueExpression(
				entity,
				indexes,
				section.field,
				fieldDefinition.entityType,
				'selection.entitySelector'
			)
			return expression == null ? [] : [expression]
		}),
		...carouselsToRender.flatMap((carousel) => carousel.sections.flatMap((section) => {
			if (section.field == null || section.link != null)
				return []

			const fieldDefinition = fieldDefinitionByReference(entity, section.field, indexes)
			if (fieldDefinition?.type !== EntityFieldType.EntitiesReference || fieldDefinition.entityType == null)
				return []

			const expression = renderCollectionRouteValueExpression(
				entity,
				indexes,
				section.field,
				fieldDefinition.entityType,
				'selection.entitySelector'
			)
			return expression == null ? [] : [expression]
		})),
	]
	const collectionRouteImports = mergeImports(
		Object.entries(indexes.collectionRoutesBySourceField)
			.filter(([key]) => key.startsWith(`${entity.entityType}:`))
			.flatMap(([, hrefs]) => hrefs.flatMap((href) => importSpecsFromMap(
				Object.values(href.params).reduce((imports, param) => expressionImports(param.value, imports), new Map<string, Set<string>>())
			)))
	)
		.filter((importSpec) => (importSpec.names ?? []).some((name) => (
			renderedCollectionRouteExpressions.some((expression) => (
				typeScriptExpressionReferencesBinding(
					expression,
					typeof name === 'string' ? name : name.alias
				)
			))
		)))
	const typeAnnotationTooltipMarkup = (
		singularView?.TypeAnnotationTooltip != null ?
			renderRawLines(singularView.TypeAnnotationTooltip.raw, 2)
		:
			[]
	)
	const scriptBeforePendingEntity = [
		'// Types/constants',
		...((
			entityHrefExpression != null
			|| allViewItems(entity, indexes).some((item) => typeof item === 'object' && 'link' in item && item.link != null)
			|| renderedCollectionRouteExpressions.length > 0
			|| sections.some((section) => {
				const fieldDefinition = fieldDefinitionByReference(entity, section.field, indexes)
				return (
					fieldDefinition?.type === EntityFieldType.EntitiesReference
					&& section.href != null
				)
			})
			|| carouselsToRender.some((carousel) => carousel.sections.some((section) => {
				if (section.field == null)
					return false

				const fieldDefinition = fieldDefinitionByReference(entity, section.field, indexes)
				return (
					fieldDefinition?.type === EntityFieldType.EntitiesReference
					&& fieldDefinition.entityType != null
					&& section.link != null
				)
			}))
		) ? [
			'import { resolve } from \'$app/paths\'',
		] : []),
		...(generatedUsesProjectionBoundary && !declaredImportSpecs.some((importSpec) => (
			importSpec.from === '$/components/ProjectionBoundary.svelte'
			&& importSpec.defaultName === 'ProjectionBoundary'
		)) ? ['import ProjectionBoundary from \'$/components/ProjectionBoundary.svelte\''] : []),
		'import EntityView, { EntityLayout, type EntitySelectionViewProps } from \'$/components/EntityView.svelte\'',
		...(
			generatedUsesEntityMetaKey
			&& !declaredImportSpecs.some((importSpec) => (
				importSpec.from === '$/schema/$schema.ts'
				&& (importSpec.names ?? []).some((name) => importNameKey(name) === 'EntityMetaKey')
			)) ?
				['import { EntityMetaKey } from \'$/schema/$schema.ts\'']
			:
				[]
		),
		'import { EntityType } from \'$/schema/EntityType.ts\'',
		...(contentWarning != null || usesViewDomId ? ['import { stringify } from \'devalue\''] : []),
		...collectionRouteImports.map(emitImport),
		...emitImportObject(networkSourceApplicability?.imports).map(emitImport),
		...expressionImportSpecs.map(emitImport),
		...[...new Map(relationshipSourceSelections.map((selection) => [
			sourceSelectionFunctionName(selection),
			selection,
		])).values()].map((selection) => `import ${sourceSelectionFunctionName(selection)} from '${sourceSelectionModulePath(selection)}'`),
		...((
			(
				declaredViewSourcesExpression != null
				&& (viewSelectionReferenceCount > 0 || resolvesEntity)
				&& typeScriptExpressionReferencesBinding(declaredViewSourcesExpression, 'Source')
				|| typeScriptExpressionReferencesBinding(query, 'Source')
				|| sectionQueries.some((sectionQuery) => typeScriptExpressionReferencesBinding(sectionQuery, 'Source'))
				|| latestQueries.some((latestQuery) => typeScriptExpressionReferencesBinding(latestQuery, 'Source'))
				|| carouselQueries.some((carouselQuery) => typeScriptExpressionReferencesBinding(carouselQuery, 'Source'))
			)
			&& !declaredImportSpecs.some((importSpec) => (
				importSpec.from === '$/sources/Source.ts'
				&& (
					importSpec.defaultName === 'Source'
					|| (importSpec.names ?? []).some((name) => importNameKey(name) === 'Source')
				)
			))
		) ? ['import { Source } from \'$/sources/Source.ts\''] : []),
		'',
		'',
		...(contextImportSpecs.length === 0 ? [] : [
			'// Context',
			...contextImportSpecs.map(emitImport),
			'',
			'',
		]),
		'// State',
		'let {',
		'\tselection,',
		...(consumesPrefetched ? ['\tprefetched = {},'] : []),
		...(entityViewOwnsTitleFallback ? [] : ['\ttitle,']),
		...(entityHrefExpression == null ? [] : ['\thref,']),
		'\tlayout = EntityLayout.SummaryDetails,',
		'\topen = $bindable(layout === EntityLayout.SummaryDetails),',
		'\t...EntityViewProps',
		`}: ${consumesPrefetched ? '' : 'Omit<'}EntitySelectionViewProps<EntityType.${entity.entityType}>${consumesPrefetched ? '' : ', \'prefetched\'>'} = $props()`,
		'',
	]
	const renderScriptAfterPendingEntity = (inlineEntityResource: boolean) => [
		...hrefFieldBindings.map(({ expression, name }) => `const ${name} = $derived(${expression})`),
		...(contentWarning == null ? [] : [
			'let revealedContentWarningSelectorKey = $state<string>()',
			'const contentWarningSelectorKey = $derived(stringify(selection.entitySelector))',
		]),
		...(networkSourceApplicability == null ? [] : [
			...networkSourceApplicability.lines,
			'',
		]),
		...(!usesViewSelection ? [] : [
			`const viewSelection = $derived(${viewSelectionValueExpression})`,
		]),
		...(resolvesEntity && !inlineEntityResource ? [
			`const ${entityName} = $derived(${query === '{}' ? viewBindings.viewSelection : `${viewBindings.viewSelection}(${query})`})`,
		] : []),
		...(usesTitleFallbackBinding ? [
			`const titleFallback = ${typeScriptStringValue(titleFallbackExpression) != null ? titleFallbackExpression : `$derived(${titleFallbackExpression})`}`,
		] : []),
		...(usesViewDomId ? [
			`const viewDomId = $derived(${emitTypeScript(`${entity.entityType
				.replace(/([a-z])([A-Z])/g, '$1-$2')
				.replace(/[_\s]+/g, '-')
				.toLowerCase()}-`)} + encodeURIComponent(stringify(selection.entitySelector)))`,
		] : []),
		'',
		'',
		'// Components',
		...declaredComponentImportSpecs.map(emitImport),
		...(contentWarning == null ? [] : ['import Collapsible from \'$/components/Collapsible.svelte\'']),
		...(carouselMarkup.length === 0 && detailTabsMarkup.length === 0 ? [] : ['import CollapsibleTabs from \'$/components/CollapsibleTabs.svelte\'']),
		...(usesGeneratedEntitiesList ? [
			'import EntitiesList from \'$/components/EntitiesList.svelte\'',
		] : []),
		...(carouselMarkup.length === 0 ? [] : ['import HeadingComponent from \'$/components/Heading.svelte\'']),
		...(
			generatedUsesIconComponent
			&& !declaredImportSpecs.some((importSpec) => (
				importSpec.from === '$/components/Icon.svelte'
				&& importSpec.defaultName === 'IconComponent'
			)) ?
				['import IconComponent from \'$/components/Icon.svelte\'']
			:
				[]
		),
		...(viewUsesFormat(entity, indexes, ['markdown', 'syndicationHtml']) ? ['import Markdown from \'$/components/Markdown.svelte\''] : []),
		...(
			(
				serial != null
				|| viewUsesFormat(entity, indexes, ['currency', 'currencyScaled', 'number', 'numberValue', 'percent'])
			)
			&& !declaredImportSpecs.some((importSpec) => (
				importSpec.from === '$/components/NumberValue.svelte'
				&& importSpec.defaultName === 'NumberValue'
			)) ?
				['import NumberValue from \'$/components/NumberValue.svelte\'']
			:
				[]
		),
		...(generatedUsesResourceBoundary && !declaredImportSpecs.some((importSpec) => (
			importSpec.from === '$/components/ResourceBoundary.svelte'
			&& importSpec.defaultName === 'ResourceBoundary'
		)) ? [
			'import ResourceBoundary from \'$/components/ResourceBoundary.svelte\'',
		] : []),
		...(viewUsesFormat(entity, indexes, ['timestamp', 'dateTime']) ? ['import Timestamp from \'$/components/Timestamp.svelte\''] : []),
		...(
			generatedUsesTooltip
			&& !declaredImportSpecs.some((importSpec) => (
				importSpec.from === '$/components/Tooltip.svelte'
				&& importSpec.defaultName === 'Tooltip'
			)) ?
				['import Tooltip from \'$/components/Tooltip.svelte\'']
			:
				[]
		),
		...(
			usesTruncatedValue
			&& !declaredImportSpecs.some((importSpec) => (
				importSpec.from === '$/components/TruncatedValue.svelte'
				&& importSpec.defaultName === 'TruncatedValue'
			)) ?
				['import TruncatedValue from \'$/components/TruncatedValue.svelte\'']
			:
				[]
		),
		...sectionComponents
			.filter((component) => !declaredImportSpecs.some((importSpec) => (
				importSpec.from === `$/views/${component}.svelte`
				&& importSpec.defaultName === componentIdentifier(component)
			)))
			.map((component) => `import ${componentIdentifier(component)} from '$/views/${component}.svelte'`),
	]
	const renderSummarySnippet = (name: 'Title' | 'Value') => {
		const summary = name === 'Title' ? summaryPlan.title : summaryPlan.value
		const itemMarkup = name === 'Title' ? entitySummaryTitleMarkup : entitySummaryValueMarkup
		const pendingFallbackExpression = name === 'Title' ? titleFallbackExpression : pendingValueFallbackExpression
		const resolvedFallbackExpression = name === 'Title' ? entityTitleFallbackExpression : entityValueFallbackExpression

		return renderSvelteSnippet(1, `${name}()`, (
				summary.raw != null ?
					renderEntityRawLines(summary.raw, 2, entityResourceExpression)
				: serial != null && summary.rendersSerial ?
					renderSerialSnippet(entity, indexes, serial, everySelectorOwnsSerial, entityResourceExpression, name === 'Title' ? serial.label : undefined)
				: !summary.resolvesEntity ?
					itemMarkup.length === 0 ?
						[renderSvelteTextOrExpression(2, pendingFallbackExpression)]
					:
						renderSummaryItemsMarkup(summary.entries, name, 2)
				:
					[
						...renderResourceBoundaryOpen(2, entityResourceExpression),
						'\t\t\t{#snippet children(entity)}',
						...(itemMarkup.length === 0 ? [
							renderSvelteTextOrExpression(4, resolvedFallbackExpression),
						] : itemMarkup),
						'\t\t\t{/snippet}',
						'\t\t</ResourceBoundary>',
					]
			))
	}
	const titleSnippetMarkup = renderSummarySnippet('Title')
	const renderedTitleSnippetMarkup = (
		titleSnippetMarkup.join('\n') === renderSvelteSnippet(
			1,
			'Title()',
			[renderSvelteTextOrExpression(2, titleFallbackExpression)]
		).join('\n') ?
			[]
		:
			titleSnippetMarkup
	)
	const contentMarkup = [
		...(latestMarkup.length === 0 ? [] : [
			`\t\t<dl${singularView?.latestDlClassName == null ? '' : ` class=${emitTypeScript(singularView.latestDlClassName)}`} data-column-item="center">`,
			...latestMarkup,
			'\t\t</dl>',
		]),
		...contentRowMarkup,
		...contentListSectionsFromDl,
		...contentBodyMarkup,
		...contentWarningMarkup,
		...contentBlockMarkup,
	]
	const markup = [
		'<EntityView',
		`\tentityType={EntityType.${entity.entityType}}`,
		'\tentitySelector={selection.entitySelector}',
		...(usesViewDomId ? ['\tid={viewDomId}'] : []),
		...(entityViewOwnsTitleFallback ? [] : [renderSvelteAttribute(1, 'title', renderNullishExpression('title', viewBindings.titleFallback))]),
		...(serial == null ? [] : [
			renderSvelteAttribute(
				1,
				'idDragPlainText',
				everySelectorOwnsSerial ?
					`String(${fieldExpression('selection.entitySelector', serial.field)})`
				:
					`String(${fieldExpression(pendingEntityExpression, serial.field)} ?? '')`
			),
		]),
		...(entityHrefExpression == null ? [] : [
			renderSvelteAttribute(1, 'href', renderConditionalExpression(
				[{
					condition: 'href === undefined',
					value: entityHrefExpression,
				}],
				'href ?? undefined'
			)),
		]),
		'\t{layout}',
		'\tbind:open',
		'\t{...EntityViewProps}',
		'>',
		...trimBlankLineEdges([
			...iconMarkup,
			...(iconMarkup.length === 0 || renderedTitleSnippetMarkup.length === 0 ? [] : ['']),
			...renderedTitleSnippetMarkup,
			...(singularView?.summary?.Value == null && !rendersSerialValue && summaryValueEntries.length === 0 ? [] : [
				'',
				...renderSummarySnippet('Value'),
			]),
			...summaryAfterMarkup,
			...(typeAnnotationTooltipMarkup.length === 0 ? [] : [
				'',
				...renderSvelteSnippet(1, 'TypeAnnotationTooltip()', typeAnnotationTooltipMarkup),
			]),
			...contentWarningContentMarkup,
			...(contentMarkup.length === 0 ? [] : [
				'',
				...renderSvelteSnippet(
					1,
					contentUsesOpen ? 'Content({ open: contentOpen })' : 'Content()',
					contentMarkup
				),
			]),
			...(detailsMarkup.length === 0 ? [] : [
				'',
				...renderSvelteSnippet(1, 'Details()', detailsMarkup),
			]),
		]),
		'</EntityView>',
	]

	return svelteFile(
		viewModulePath(componentName).replace(/^\$\//, 'src/'),
		{
			script: [
				...scriptBeforePendingEntity,
				...(usesPendingEntity ? renderPendingEntityDerived(entity) : []),
				...renderScriptAfterPendingEntity(inlineEntityResource),
			],
			markup,
		}
	)
}

const renderContentBlock = (
	entity: Entity,
	indexes: GenerationIndexes,
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

	const fieldName = itemFieldReferences(viewEntry)[0]
	const fieldDefinition = fieldName == null ? undefined : fieldDefinitionByReference(entity, fieldName, indexes)
	if (fieldDefinition?.type === EntityFieldType.EntitiesReference || fieldDefinition?.type === EntityFieldType.EntityReference)
		return wrapWhen(viewEntry, openExpression, renderRelationshipSection(entity, indexes, {
			field: fieldName,
			viewEntry,
		}, level))

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
		...renderSvelteSnippet(level + 1, 'children(entity)', renderRawLines(viewEntry.Content.raw, 0)),
		`${'\t'.repeat(level)}</ResourceBoundary>`,
	]
}

const renderBodySection = (
	entity: Entity,
	indexes: GenerationIndexes,
	body: NonNullable<SingularView['content']['body']>,
	openExpression: string,
	level: number,
	querySelectionExpression = 'selection',
	entityResourceExpression?: string,
	entityResourceFieldKeys?: ReadonlySet<string>
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
	const query = renderQuery(undefined, [body.field])
	const resourceExpression = (
		entityResourceExpression != null
		&& entityResourceFieldKeys?.has(fieldReferenceKey(body.field)) ?
			entityResourceExpression
		:
			`${querySelectionExpression}(${query})`
	)
	const bodyFieldValue = fieldExpression('entity', body.field)
	const bodyFieldDefinition = fieldDefinitionByReference(entity, body.field, indexes)
	if (bodyFieldDefinition == null)
		throw new Error(`${entity.entityType}.${body.field} body references an unknown field`)
	const hasBodySection = body.id != null || body.label != null
	const resourceLevel = level + (hasBodySection ? 1 : 0)
	const bodyMarkup = [
		`${'\t'.repeat(resourceLevel)}<ResourceBoundary`,
		renderSvelteAttribute(resourceLevel + 1, 'resource', resourceExpression),
		`${'\t'.repeat(resourceLevel)}>`,
		`${'\t'.repeat(resourceLevel + 1)}{#snippet children(entity)}`,
		`${'\t'.repeat(resourceLevel + 2)}{@const ${localIdentifier(body.field)} = ${bodyFieldValue}}`,
		`${'\t'.repeat(resourceLevel + 2)}{#if ${bodyFieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne ? `${localIdentifier(body.field)} != null && ` : ''}${localIdentifier(body.field)} !== ''}`,
		...renderValueMarkup(entity, indexes, bodyViewEntry, body.field, localIdentifier(body.field), `({ value: ${localIdentifier(body.field)} })`, resourceLevel + 3),
		...(body.emptyText == null ? [] : [
			`${'\t'.repeat(resourceLevel + 2)}{:else}`,
			`${'\t'.repeat(resourceLevel + 3)}<p data-text="muted">${body.emptyText}</p>`,
		]),
		`${'\t'.repeat(resourceLevel + 2)}{/if}`,
		`${'\t'.repeat(resourceLevel + 1)}{/snippet}`,
		`${'\t'.repeat(resourceLevel)}</ResourceBoundary>`,
	]

	return wrapWhen(bodyViewEntry, openExpression, !hasBodySection ? bodyMarkup : [
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

const renderSummaryAfterItem = (
	entity: Entity,
	indexes: GenerationIndexes,
	viewEntry: _ViewItem,
	fieldValueName: string,
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

	const selectorOwnsField = entitySelectorOwnsField(entity, fieldReference)
	const fieldValue = selectorOwnsField ?
		fieldExpression('selection.entitySelector', fieldReference)
		:
		fieldExpression('entity', fieldName)
	const fieldDefinition = fieldDefinitionByReference(entity, fieldReference, indexes)
	if (fieldDefinition?.type === EntityFieldType.EntityReference && fieldDefinition.entityType != null) {
		const targetEntity = indexes.entityByType[fieldDefinition.entityType]
		if (targetEntity != null) {
			const component = singularComponentName(targetEntity.entityType)
			const targetEntityName = camel(targetEntity.entityType)
			const optional = !selectorOwnsField && fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne
			const referenceLevel = optional ? level + 3 : level + 2
			if (selectorOwnsField) {
				const selectorExpression = fieldExpression('selection.entitySelector', fieldReference)

				return [
					`${'\t'.repeat(level)}<span data-text="muted">`,
					`${'\t'.repeat(level + 1)}<${componentIdentifier(component)}`,
					renderSvelteAttribute(level + 2, 'selection', `select(EntityType.${targetEntity.entityType}, ${selectorExpression})`),
					`${'\t'.repeat(level + 2)}layout={EntityLayout.Title}`,
					`${'\t'.repeat(level + 1)}/>`,
					`${'\t'.repeat(level)}</span>`,
				]
			}

			return [
				`${'\t'.repeat(level)}<ResourceBoundary`,
				renderSvelteAttribute(level + 1, 'resource', fieldProxyResourceExpression('selection', fieldReference)),
				`${'\t'.repeat(level)}>`,
				`${'\t'.repeat(level + 1)}{#snippet children(${targetEntityName})}`,
				...(optional ? [`${'\t'.repeat(level + 2)}{#if ${targetEntityName} != null}`] : []),
				`${'\t'.repeat(referenceLevel)}<span data-text="muted">`,
				`${'\t'.repeat(referenceLevel + 1)}<${componentIdentifier(component)}`,
				renderSvelteAttribute(referenceLevel + 2, 'selection', `select(EntityType.${targetEntity.entityType}, ${targetEntityName}[EntityMetaKey.Selector])`),
				...(viewComponentAcceptsPrefetched(indexes, targetEntity.entityType, component) ? [
					`${'\t'.repeat(referenceLevel + 2)}prefetched={${targetEntityName}}`,
				] : []),
				`${'\t'.repeat(referenceLevel + 2)}layout={EntityLayout.Title}`,
				`${'\t'.repeat(referenceLevel + 1)}/>`,
				`${'\t'.repeat(referenceLevel)}</span>`,
				...(optional ? [`${'\t'.repeat(level + 2)}{/if}`] : []),
				`${'\t'.repeat(level + 1)}{/snippet}`,
				`${'\t'.repeat(level)}</ResourceBoundary>`,
			]
		}

		throw new Error(`${entity.entityType}.${fieldName} HeadingAfter EntityReference targets missing entity type ${fieldDefinition.entityType}`)
	}

	const optional = !selectorOwnsField && fieldDefinition?.cardinality === EntityFieldCardinality.ZeroOrOne
	const valueExpression = optional ? fieldValueName : fieldValue
	return [
		...(optional ? [`${'\t'.repeat(level)}{@const ${fieldValueName} = ${fieldValue}}`] : []),
		...(optional ? [`${'\t'.repeat(level)}{#if ${fieldValueName} != null}`] : []),
		`${'\t'.repeat(optional ? level + 1 : level)}<span data-text="muted">`,
		...renderValueMarkup(
			entity,
			indexes,
			viewEntry,
			fieldName,
			valueExpression,
			viewItemContextExpression(entity, viewEntry),
			optional ? level + 2 : level + 1
		),
		`${'\t'.repeat(optional ? level + 1 : level)}</span>`,
		...(optional ? [`${'\t'.repeat(level)}{/if}`] : []),
	]
}

const renderSummaryAfter = (
	entity: Entity,
	indexes: GenerationIndexes,
	entityName: string | undefined,
	viewEntries: readonly _ViewItem[]
) => {
	const fieldValueNames = fieldValueNamesForViewEntries(viewEntries)
	if (entityName == null)
		return [
			'',
			...renderSvelteSnippet(1, 'HeadingAfter()', viewEntries.flatMap((viewEntry, viewEntryIndex) => renderSummaryAfterItem(
				entity,
				indexes,
				viewEntry,
				fieldValueNames[viewEntryIndex] ?? 'value',
				2
			))),
		]

	return [
		'',
		'\t{#snippet HeadingAfter()}',
		...renderResourceBoundaryOpen(2, entityName),
		'\t\t\t{#snippet children(entity)}',
		...viewEntries.flatMap((viewEntry, viewEntryIndex) => renderSummaryAfterItem(
			entity,
			indexes,
			viewEntry,
			fieldValueNames[viewEntryIndex] ?? 'value',
			4
		)),
		'\t\t\t{/snippet}',
		'\t\t</ResourceBoundary>',
		'\t{/snippet}',
	]
}

const renderIconSnippet = (
	entity: Entity,
	indexes: GenerationIndexes,
	entityResourceExpression: string
) => {
	const singularView = entitySingularView(entity)
	const renderIcon = (body: string[]) => [
		'',
		...renderSvelteSnippet(1, 'Icon()', body),
	]
	const renderResolvedIcon = (body: string[]) => renderIcon([
		...renderResourceBoundaryOpen(0, entityResourceExpression),
		...renderSvelteSnippet(1, 'children(entity)', body),
		'</ResourceBoundary>',
	])
	if (singularView?.summary?.Icon != null)
		return renderIcon(renderEntityRawLines(
			singularView.summary.Icon.raw,
			0,
			entityResourceExpression
		))

	const icon = singularView?.summary?.icon
	if (icon == null)
		throw new Error(`${entity.entityType} Icon snippet was invoked without summary.icon metadata`)

	const iconField = itemFieldReferences(icon)[0]
	const iconFieldDefinition = iconField == null ? undefined : fieldDefinitionByReference(entity, iconField, indexes)
	if (
		iconFieldDefinition?.type === EntityFieldType.EntityReference
		&& iconFieldDefinition.entityType != null
	) {
		const component = singularComponentName(iconFieldDefinition.entityType)
		const selectorOwnsIcon = entitySelectorOwnsField(entity, iconField)
		const referenceSelectorExpression = selectorOwnsIcon ?
			fieldExpression('selection.entitySelector', fieldNameForReference(iconField))
		:
			'reference[EntityMetaKey.Selector]'
		const optional = iconFieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne

		// Selector-owned references render immediately; other references await the entity resource.
		if (selectorOwnsIcon)
			return renderIcon([
				`<${componentIdentifier(component)}`,
				`\tselection={select(EntityType.${iconFieldDefinition.entityType}, ${referenceSelectorExpression})}`,
				'\tlayout={EntityLayout.Value}',
				'/>',
			])

		const referenceLevel = optional ? 1 : 0
		return renderResolvedIcon([
			`{@const reference = ${fieldExpression('entity', iconField)}}`,
			...(optional ? ['{#if reference != null}'] : []),
			`${'\t'.repeat(referenceLevel)}<${componentIdentifier(component)}`,
			`${'\t'.repeat(referenceLevel + 1)}selection={select(EntityType.${iconFieldDefinition.entityType}, ${referenceSelectorExpression})}`,
			...(viewComponentAcceptsPrefetched(indexes, iconFieldDefinition.entityType, component) ? [
				`${'\t'.repeat(referenceLevel + 1)}prefetched={reference}`,
			] : []),
			`${'\t'.repeat(referenceLevel + 1)}layout={EntityLayout.Value}`,
			`${'\t'.repeat(referenceLevel)}/>`,
			...(optional ? ['{/if}'] : []),
		])
	}

	const resolvedIconExpression = iconField == null ? undefined : textExpression(fieldExpression('entity', iconField))
	if (resolvedIconExpression == null)
		return renderIcon(['<IconComponent />'])

	if (entitySelectorOwnsField(entity, iconField))
		return renderIcon([
			`<IconComponent icon={${renderDisplayExpression(
				entity,
				indexes,
				iconField,
				fieldExpression('selection.entitySelector', iconField),
				true
			)}} />`,
		])

	return renderResolvedIcon([`<IconComponent icon={${resolvedIconExpression}} />`])
}

const renderDefinitionListItem = (
	level: number,
	label: string,
	valueLines: readonly string[]
) => [
	`${'\t'.repeat(level)}<div>`,
	`${'\t'.repeat(level + 1)}<dt>${label}</dt>`,
	`${'\t'.repeat(level + 1)}<dd>`,
	...valueLines,
	`${'\t'.repeat(level + 1)}</dd>`,
	`${'\t'.repeat(level)}</div>`,
]

const renderFieldResourceBoundary = (
	level: number,
	resourceExpression: string,
	valueName: string,
	body: string[]
) => [
	`${'\t'.repeat(level)}<ResourceBoundary`,
	renderSvelteAttribute(level + 1, 'resource', resourceExpression),
	`${'\t'.repeat(level)}>`,
	...renderSvelteSnippet(level + 1, `children(${valueName})`, body),
	`${'\t'.repeat(level)}</ResourceBoundary>`,
]

const renderEntityReferenceDlItem = (
	entity: Entity,
	indexes: GenerationIndexes,
	viewEntry: _ViewItem,
	fieldDefinition: EntityField,
	fieldReference: FieldReference,
	label: string,
	openExpression: string,
	level: number,
	fieldResourceBase: string
) => {
	const fieldName = fieldNameForReference(fieldReference)
	if (fieldDefinition.entityType == null)
		throw new Error(`${entity.entityType}.${fieldName} EntityReference field is missing entityType`)

	const targetEntity = indexes.entityByType[fieldDefinition.entityType]
	if (targetEntity == null)
		throw new Error(`${entity.entityType}.${fieldName} references missing entity type ${fieldDefinition.entityType}`)

	const component = singularComponentIdentifier(targetEntity.entityType)
	const itemSelection = typeof viewEntry === 'object' && 'selection' in viewEntry ? viewEntry.selection : undefined
	const query = renderQuery(itemSelection, [])
	if (entitySelectorOwnsField(entity, fieldReference)) {
		const selectorExpression = fieldExpression('selection.entitySelector', fieldReference)

		return wrapWhen(viewEntry, openExpression, renderDefinitionListItem(level, label, [
			`${'\t'.repeat(level + 2)}<${component}`,
			renderSvelteAttribute(level + 3, 'selection', `select(EntityType.${fieldDefinition.entityType}, ${selectorExpression})`),
			`${'\t'.repeat(level + 3)}layout={EntityLayout.Value}`,
			`${'\t'.repeat(level + 2)}/>`,
		]))
	}

	const targetEntityName = camel(targetEntity.entityType)
	const entityViewLines = [
		`${'\t'.repeat(level + 2)}<${component}`,
		renderSvelteAttribute(level + 3, 'selection', `select(EntityType.${fieldDefinition.entityType}, ${targetEntityName}[EntityMetaKey.Selector])`),
		...(viewComponentAcceptsPrefetched(indexes, fieldDefinition.entityType, component) ? [
			`${'\t'.repeat(level + 3)}prefetched={${targetEntityName}}`,
		] : []),
		`${'\t'.repeat(level + 3)}layout={EntityLayout.Value}`,
		`${'\t'.repeat(level + 2)}/>`,
	]

	if (fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne)
		return wrapWhen(viewEntry, openExpression, renderFieldResourceBoundary(
			level,
			fieldProxyResourceExpression(fieldResourceBase, fieldReference, query),
			targetEntityName,
			[
				`${'\t'.repeat(level + 2)}{#if ${targetEntityName} != null}`,
				...renderDefinitionListItem(level + 3, label, entityViewLines.map((line) => indent(line, 3))),
				`${'\t'.repeat(level + 2)}{/if}`,
			]
		))

	return wrapWhen(viewEntry, openExpression, renderDefinitionListItem(level, label, [
		...renderFieldResourceBoundary(
			level + 2,
			fieldProxyResourceExpression(fieldResourceBase, fieldReference, query),
			targetEntityName,
			entityViewLines.map((line) => indent(line, 2))
		),
	]))
}

const renderContentItem = (
	entity: Entity,
	indexes: GenerationIndexes,
	viewEntry: _ViewItem,
	openExpression: string,
	level: number,
	querySelectionExpression = 'selection',
	projectionBoundary = true,
	entityResourceExpression?: string,
	entityResourceFieldKeys?: ReadonlySet<string>,
	fieldResourceBase = 'selection'
) => {
	if (typeof viewEntry === 'object' && 'kind' in viewEntry && viewEntry.kind === _ViewItemKind.Text)
		return wrapWhen(viewEntry, openExpression, renderDefinitionListItem(level, viewEntry.label, [
			renderSvelteTextOrExpression(level + 2, emitTypeScript(viewEntry.value ?? viewEntry.label)),
			...(viewEntry.description == null ? [] : [
				`${'\t'.repeat(level + 2)}<p data-text="muted">`,
				renderSvelteTextOrExpression(level + 3, emitTypeScript(viewEntry.description)),
				`${'\t'.repeat(level + 2)}</p>`,
			]),
		]))
	if (typeof viewEntry === 'object' && 'kind' in viewEntry && viewEntry.kind === _ViewItemKind.Block)
		return wrapWhen(viewEntry, openExpression, renderRawBlock(viewEntry, level))

	const fieldReference = itemFieldReferences(viewEntry)[0]
	const fieldName = fieldReference == null ? undefined : fieldNameForReference(fieldReference)
	if (fieldName == null)
		throw new Error(`${entity.entityType} content item ${String(viewEntry)} is missing a field reference`)
	const fieldDefinition = fieldDefinitionByReference(entity, fieldReference, indexes)
	if (fieldDefinition == null)
		throw new Error(`${entity.entityType}.${fieldName} content item references an unknown field`)
	if (fieldDefinition.type === EntityFieldType.EntitiesReference)
		throw new Error(`${entity.entityType}.${fieldName} EntitiesReference cannot render as a content <dl> item`)
	const primitiveList = (
		typeof viewEntry === 'object'
		&& !isProjectionFieldReference(viewEntry)
		&& 'primitiveList' in viewEntry ?
			viewEntry.primitiveList
		:
			undefined
	)
	if (
		primitiveList != null
		&& (
			fieldDefinition.type !== EntityFieldType.Primitive
			|| !fieldCardinalityIsMany(fieldDefinition)
		)
	)
		throw new Error(`${entity.entityType}.${fieldName} primitive list requires a Many or ZeroOrMany primitive field`)
	const label = typeof viewEntry === 'object' && 'label' in viewEntry && viewEntry.label != null ? viewEntry.label : labelForField(fieldDefinition)
	if (primitiveList != null && typeof viewEntry === 'object' && 'label' in viewEntry && viewEntry.label != null)
		throw new Error(`${entity.entityType}.${fieldName} primitive list label comes from the schema field`)
	if (projectionBoundary && isProjectionFieldReference(fieldReference))
		return renderProjectionBoundaryLines(
			entity,
			indexes,
			fieldReference,
			(projectionFieldResourceBase) => renderContentItem(
				entity,
				indexes,
				viewEntry,
				openExpression,
				level,
				querySelectionExpression,
				false,
				entityResourceExpression,
				entityResourceFieldKeys,
				projectionFieldResourceBase
			),
			level
		)
	const renderedFieldReference = fieldResourceBase === 'projection' ?
		fieldName
	:
		fieldReference

	if (fieldDefinition.type === EntityFieldType.EntityReference)
		return renderEntityReferenceDlItem(
			entity,
			indexes,
			viewEntry,
			fieldDefinition,
			renderedFieldReference,
			label,
			openExpression,
			level,
			fieldResourceBase
		)

	if (entitySelectorOwnsField(entity, fieldReference)) {
		const fieldValueExpression = fieldExpression('selection.entitySelector', fieldReference)
		const valueMarkup = renderDefinitionListItem(level, label, [
			...renderValueMarkup(
				entity,
				indexes,
				viewEntry,
				fieldReference,
				fieldValueExpression,
				viewItemContextExpression(entity, viewEntry),
				level + 2
			),
		])

		return wrapWhen(viewEntry, openExpression, valueMarkup)
	}

	const fieldValueName = localIdentifier(fieldName)
	const projectionFieldResource = isProjectionFieldReference(fieldReference)
	const itemQueryFields = viewItemFieldReferences(viewEntry)
	const query = renderQuery(
		undefined,
		projectionFieldResource ? [] : itemQueryFields
	)
	const projectionFieldResourceExpression = projectionFieldResource ? fieldProxyResourceExpression(fieldResourceBase, renderedFieldReference, query) : undefined
	const resourceExpression = (
		projectionFieldResourceExpression
		?? (
			entityResourceExpression != null
			&& itemQueryFields.every((field) => entityResourceFieldKeys?.has(fieldReferenceKey(field))) ?
				entityResourceExpression
			:
				`${querySelectionExpression}(${query})`
		)
	)
	if (primitiveList != null) {
		const valueName = camel(label.replace(/s$/, ''))
		const valueExpression = fieldExpression('entity', fieldName)

		return wrapWhen(viewEntry, openExpression, renderFieldResourceBoundary(
			level,
			projectionFieldResourceExpression ?? `selection(${query})`,
			'entity',
			renderDefinitionListItem(level + 2, label, [
				`${'\t'.repeat(level + 4)}{#if ${valueExpression}.values.length}`,
				`${'\t'.repeat(level + 5)}<ul>`,
				`${'\t'.repeat(level + 6)}{#each ${valueExpression}.values as ${valueName} (${valueName})}`,
				`${'\t'.repeat(level + 7)}<li><code>{${valueName}}</code></li>`,
				`${'\t'.repeat(level + 6)}{/each}`,
				`${'\t'.repeat(level + 5)}</ul>`,
				`${'\t'.repeat(level + 4)}{:else}`,
				`${'\t'.repeat(level + 5)}<p data-text="muted">${svelteText(primitiveList)}</p>`,
				`${'\t'.repeat(level + 4)}{/if}`,
			])
		))
	}
	const directFieldValueExpression = fieldExpression('entity', fieldName)
	const fieldValueExpression = projectionFieldResourceExpression != null ?
		fieldValueName
	: fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne ?
		fieldValueName
	:
		directFieldValueExpression
	const valueContextExpression = projectionFieldResourceExpression == null ?
		viewItemContextExpression(entity, viewEntry)
	:
		`({ value: ${fieldValueName} })`
	const valueMarkup = renderDefinitionListItem(level, label, [
		...renderValueMarkup(
			entity,
			indexes,
			viewEntry,
			fieldReference,
			fieldValueExpression,
			valueContextExpression,
			level + 2
		),
	])
	if (fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne)
		return wrapWhen(viewEntry, openExpression, renderFieldResourceBoundary(
			level,
			resourceExpression,
			projectionFieldResourceExpression == null ? 'entity' : fieldValueName,
			[
				...(projectionFieldResourceExpression == null ? [
					`${'\t'.repeat(level + 2)}{@const ${fieldValueName} = ${directFieldValueExpression}}`,
				] : []),
				`${'\t'.repeat(level + 2)}{#if ${fieldValueName} != null}`,
				...valueMarkup.map((line) => indent(line, 3)),
				`${'\t'.repeat(level + 2)}{/if}`,
			]
		))

	return wrapWhen(viewEntry, openExpression, renderDefinitionListItem(level, label, [
		...renderFieldResourceBoundary(
			level + 2,
			resourceExpression,
			projectionFieldResourceExpression == null ? 'entity' : fieldValueName,
			renderValueMarkup(
				entity,
				indexes,
				viewEntry,
				fieldReference,
				fieldValueExpression,
				valueContextExpression,
				level + 4
			)
		),
	]))
}

const latestTargetEntityType = (
	entity: Entity,
	indexes: GenerationIndexes,
	latest: EntityLatest
) => fieldDefinitionByReference(entity, latest.field, indexes)?.entityType

const latestComponentName = (
	entity: Entity,
	indexes: GenerationIndexes,
	latest: EntityLatest
) => {
	const entityType = latestTargetEntityType(entity, indexes, latest)
	return latest.view ?? (entityType == null ? undefined : singularComponentName(entityType))
}

const renderLatestContentItem = (
	entity: Entity,
	indexes: GenerationIndexes,
	latest: EntityLatest,
	level: number,
	fieldResource?: {
		base: string
		field: FieldReference
	}
) => {
	const latestFieldDefinition = fieldDefinitionByReference(entity, latest.field, indexes)
	const entityType = latestTargetEntityType(entity, indexes, latest)
	const fieldEntityType = latestFieldDefinition?.entityType
	const component = latestComponentName(entity, indexes, latest)
	if (latestFieldDefinition == null || entityType == null || fieldEntityType == null || component == null)
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
			...(indexes.entityRouteLinksByType[entityType] ?? [])
				.flatMap((entityRouteLink) => Object.values(entityRouteLink.params).flatMap(({ value }) => expressionFieldPaths(value)))
				.map((fieldPath) => fieldPath[0])
				.filter((fieldName): fieldName is string => fieldName != null),
		].filter((fieldName) => !latestSelectorFieldNames.has(fieldName)),
	].filter((fieldName) => latestEntity == null || fieldDefinitionByReference(latestEntity, fieldName) != null))

	const query = renderQuery(
		fieldQuery(latestFieldDefinition, {
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
	const latestLabel = latest.label ?? latest.field
	const latestConditions = latest.conditions ?? latest.when ?? []
	const targetAcceptsPrefetched = viewComponentAcceptsPrefetched(indexes, entityType, component)

	const latestBodyLines = [
		`${'\t'.repeat(level + 4)}{#if ${latestEntityName} != null}`,
		...(targetAcceptsPrefetched ? [renderSvelteConst(level + 5, latestSelectorName, selectorExpression)] : []),
		`${'\t'.repeat(level + 5)}<${componentIdentifier(component)}`,
		renderSvelteAttribute(level + 6, 'selection', `select(EntityType.${entityType}, ${targetAcceptsPrefetched ? latestSelectorName : selectorExpression}${latestSelectionSuffix})`),
		...(targetAcceptsPrefetched ? [
			`${'\t'.repeat(level + 6)}prefetched={{ ...${latestSelectorName}, ...${latestEntityName} }}`,
		] : []),
		`${'\t'.repeat(level + 6)}layout={EntityLayout.Value}`,
		`${'\t'.repeat(level + 5)}/>`,
		`${'\t'.repeat(level + 4)}{:else}`,
		`${'\t'.repeat(level + 5)}<p data-text="muted" data-section-state="resolved-empty">No ${svelteText(latestLabel.toLowerCase())} available.</p>`,
		`${'\t'.repeat(level + 4)}{/if}`,
	]

	const renderLines = (
		fieldResourceBase: string,
		fieldReference: FieldReference
	) => renderDefinitionListItem(level, latestLabel, [
		`${'\t'.repeat(level + 2)}<ResourceBoundary`,
			renderSvelteAttribute(level + 3, 'resource', fieldProxyResourceExpression(fieldResourceBase, fieldReference, query)),
		`${'\t'.repeat(level + 2)}>`,
		`${'\t'.repeat(level + 3)}{#snippet children(${latestEntitiesName})}`,
		`${'\t'.repeat(level + 4)}{@const ${latestEntityName} = ${latestEntitiesName}.values[0]}`,
		...latestBodyLines,
		`${'\t'.repeat(level + 3)}{/snippet}`,
		`${'\t'.repeat(level + 2)}</ResourceBoundary>`,
	])

	const renderConditionedLines = (
		fieldResourceBase: string,
		fieldReference: FieldReference
	) => renderConditionedEntityLines(
		entity,
		indexes,
		latestConditions,
		level,
		renderLines(fieldResourceBase, fieldReference)
	)
	if (fieldResource != null)
		return renderConditionedLines(fieldResource.base, fieldResource.field)

	return renderProjectionBoundaryLines(
		entity,
		indexes,
		latest.field,
		renderConditionedLines,
		level
	)
}

// Latest cards retain the facet that declared them separately from the facet
// that owns their field. The tree installs each applicability boundary once;
// every card still renders its own query ResourceBoundary below that tree.
const renderLatestContentItems = (
	entity: Entity,
	indexes: GenerationIndexes,
	latestItems: readonly EntityLatest[],
	level: number
) => renderProjectionPathTree(
	entity,
	indexes,
	latestItems,
	(latest) => latest.projectionPath ?? [],
	(latest) => {
		if (!isProjectionFieldReference(latest.field))
			return renderLatestContentItem(entity, indexes, latest, level)

		const fieldProjectionPath = latest.field.slice(0, -1)
		const declaredAtFieldProjection = (
			fieldProjectionPath.length === latest.projectionPath?.length
			&& fieldProjectionPath.every((facetName, index) => latest.projectionPath?.[index] === facetName)
		)
		return renderLatestContentItem(entity, indexes, latest, level, declaredAtFieldProjection ? {
			base: 'projection',
			field: fieldNameForReference(latest.field),
		} : {
			base: 'selection',
			field: latest.field,
		})
	},
	level
)

const renderRelationshipSections = (
	entity: Entity,
	indexes: GenerationIndexes,
	sections: RelationshipSection[]
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
		const referenceMarkup = renderProjectionOwnedGroups(
			entity,
			indexes,
			referenceSections,
			(section) => [section.field],
			(section, projectionFieldResourceBase) => renderRelationshipSection(
				entity,
				indexes,
				section,
				level,
				projectionFieldResourceBase
			),
			level,
			2
		)
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
			...referenceMarkup,
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

const renderRelationshipSection = (
	entity: Entity,
	indexes: GenerationIndexes,
	section: RelationshipSection,
	level: number,
	projectionFieldResourceBase?: string
) => {
	const fieldDefinition = fieldDefinitionByReference(entity, section.field, indexes)
	if (fieldDefinition == null)
		throw new Error(`${entity.entityType}.${section.field} relationship section references an unknown field`)
	const sectionConditions = (
		isProjectionFieldReference(section.field) ?
			[]
		:
			section.conditions ?? []
	)

	const component = declaredRelationshipSectionComponent(section, indexes)
	if (component == null)
		throw new Error(`${entity.entityType}.${section.field} relationship section must declare a generated component`)

	const targetEntity = fieldDefinition.entityType
	if (targetEntity == null)
		throw new Error(`${entity.entityType}.${section.field} relationship section field must reference an entity`)
	const parentFieldQuery = fieldQuery(fieldDefinition, section.selection)
	const query = renderQuery(
		parentFieldQuery,
		[],
		renderFieldConditionedSourceSelectionExpression(parentFieldQuery?.sources, 'pendingEntity')
	)

	const renderSection = (
		fieldResourceBase: string,
		fieldReference: FieldReference
	) => {
		if (fieldDefinition.type === EntityFieldType.EntityReference)
			return renderEntityReferenceSection(
				entity,
				section,
				fieldDefinition,
				targetEntity,
				query,
				component,
				level,
				fieldResourceBase,
				fieldReference
			)
		if (fieldDefinition.type === EntityFieldType.EntitiesReference)
			return renderEntitiesReferenceSection(
				entity,
				indexes,
				section,
				fieldDefinition,
				targetEntity,
				query,
				component,
				level,
				fieldResourceBase,
				fieldReference
			)

		throw new Error(`${entity.entityType}.${section.field} relationship section has unsupported cardinality`)
	}

	return renderConditionedEntityLines(
		entity,
		indexes,
		sectionConditions,
		level,
		projectionFieldResourceBase == null ?
			renderProjectionBoundaryLines(
				entity,
				indexes,
				section.field,
				renderSection,
				level
			)
		:
			renderSection(
				projectionFieldResourceBase,
				projectionFieldResourceBase === 'projection' ?
					fieldNameForReference(section.field)
				:
					section.field
			)
		)
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

const renderDetailTab = (
	entity: Entity,
	indexes: GenerationIndexes,
	tab: SingularView['details']['tabs'][number]
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
		...(tab.Content == null && dlViewEntries.length === 0 ? [] : [
			`\t\t\t\t\t<article id={\`\${id}-${detailTabId(tab)}-fields\`} data-column-item="flexible" data-card data-scroll-container>`,
			...(tab.Content == null ? [] : renderRawLines(tab.Content.raw, 6)),
			...(dlViewEntries.length === 0 ? [] : [
				'\t\t\t\t\t\t<dl data-column-item="center">',
				...dlViewEntries.flatMap((viewEntry) => renderContentItem(entity, indexes, viewEntry, 'detailsOpen', 7)),
				'\t\t\t\t\t\t</dl>',
			]),
			'\t\t\t\t\t</article>',
		]),
		...reindentLines(
			referenceSections.flatMap((section) => renderRelationshipSection(entity, indexes, section)),
			5
		),
	]
	if (content.length === 0)
		throw new Error(`${entity.entityType} details tab ${detailTabId(tab)} has no renderable content`)

	const lines = renderSvelteSnippet(4, `${detailTabSnippetName(tab)}({ id, label })`, content)
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

const renderDetailsTabs = (entity: Entity, indexes: GenerationIndexes, tabs: SingularView['details']['tabs']) => {
	return [
		'\t\t\t<CollapsibleTabs',
		'\t\t\t\tid={viewDomId + \'-details-tabs\'}',
		'\t\t\t\tsectionIdPrefix={viewDomId}',
		renderSvelteAttribute(4, 'sections', [
			'[',
			...tabs.map((tab) => {
				const sectionExpression = `${emitObject([
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
		...tabs.flatMap((tab) => renderDetailTab(entity, indexes, tab)),
		'\t\t\t</CollapsibleTabs>',
	]
}

const carouselSectionId = (section: EntityCarouselSection) => (
	section.id ?? (section.field == null ? undefined : routeCollectionIdForFieldReference(section.field)) ?? 'section'
)

const routeCollectionId = (field: string) => field.replace(/^\$\$?/, '').replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)

const routeCollectionIdForFieldReference = (field: FieldReference) => routeCollectionId(fieldNameForReference(field))

const carouselSectionComponent = (entity: Entity, indexes: GenerationIndexes, section: EntityCarouselSection) => {
	if (section.field == null)
		return undefined

	const fieldDefinition = fieldDefinitionByReference(entity, section.field, indexes)
	if (fieldDefinition == null || fieldDefinition.entityType == null)
		return undefined

	if (section.List != null)
		return section.List

	return undefined
}

// Route-link output
//
// Routes remain compiler facts. Consumers receive direct SvelteKit `resolve()`
// expressions; hrefs are not emitted as a parallel generated file family.
const entityRouteImportSpecs = (
	indexes: GenerationIndexes,
	entityType: string
) => importSpecsFromMap(
	(indexes.entityRouteLinksByType[entityType] ?? [])
		.flatMap((href) => Object.values(href.params))
		.reduce((imports, param) => expressionImports(param.value, imports), new Map<string, Set<string>>())
)

// Repeated relationship-selector roots are named once beside the view state.
// The route stays a direct resolve() expression; this only removes duplicated
// deep selector access from its conditions and parameter values.
const entityRouteFieldBindings = (
	entity: Entity,
	referenceCountByField: ReadonlyMap<string, number>,
	fieldsExpression: string,
	declaration: 'derived' | 'svelteConst',
	reservedNames: readonly string[]
) => {
	const names = new Set(reservedNames)

	return entity.fields.flatMap((field) => {
		const actualOccurrenceCount = referenceCountByField.get(field.name) ?? 0
		const expression = fieldExpression(fieldsExpression, field.name)
		if (
			field.entityType == null
			|| actualOccurrenceCount < 2
		)
			return []

		const fieldName = generatedIdentifier(field.name)
		const name = names.has(fieldName) ? `${fieldName}Selector` : fieldName
		const declarationLength = (
			declaration === 'derived' ?
				`\tconst ${name} = $derived(${expression})\n`
			:
				`\t\t{@const ${name} = ${expression}}\n`
		).length
		// Preserve the historical split-length cost threshold: split length was one
		// greater than the number of emitted references.
		if ((actualOccurrenceCount + 1) * (expression.length - name.length) <= declarationLength)
			return []

		names.add(name)

		return [{
			expression,
			fieldName: field.name,
			name,
		}]
	})
}

const entityRouteHrefPlan = (
	indexes: GenerationIndexes,
	entity: Entity,
	fieldsExpression: string,
	declaration: 'derived' | 'svelteConst',
	reservedNames: readonly string[],
	usesResolvedEntity = false
) => {
	const markerEntries = entity.fields.flatMap((field, index) => field.entityType == null ? [] : [{
		fieldName: field.name,
		marker: `__BLOCKHEAD_COMPILED_HREF_FIELD_${index}__`,
		expression: fieldExpression(fieldsExpression, field.name),
	}])
	const markerEntryByMarker = new Map(markerEntries.map((entry) => [entry.marker, entry]))
	const markedExpression = (
		(indexes.entityRouteLinksByType[entity.entityType]?.length ?? 0) === 0 ?
			undefined
		:
			renderEntityRouteLinkExpression(
				indexes,
				entity.entityType,
				fieldsExpression,
				undefined,
				usesResolvedEntity,
				Object.fromEntries(markerEntries.map(({ fieldName, marker }) => [fieldName, marker]))
			)
	)
	const expressionParts = markedExpression?.split(/(__BLOCKHEAD_COMPILED_HREF_FIELD_\d+__)/g) ?? []
	const referenceCountByField = new Map<string, number>()
	for (const part of expressionParts) {
		const fieldName = markerEntryByMarker.get(part)?.fieldName
		if (fieldName != null)
			referenceCountByField.set(fieldName, (referenceCountByField.get(fieldName) ?? 0) + 1)
	}
	const fieldBindings = entityRouteFieldBindings(entity, referenceCountByField, fieldsExpression, declaration, reservedNames)
	const bindingNameByField = new Map(fieldBindings.map(({ fieldName, name }) => [fieldName, name]))
	const renderExpressionParts = (factored: boolean) => markedExpression == null ? undefined : expressionParts.map((part) => {
		const markerEntry = markerEntryByMarker.get(part)
		return markerEntry == null ? part : factored ? bindingNameByField.get(markerEntry.fieldName) ?? markerEntry.expression : markerEntry.expression
	}).join('')

	return {
		expression: renderExpressionParts(fieldBindings.length > 0),
		fieldBindings,
	}
}

// Relationship routes normally consume selectors. A route may read resolved
// fields only when its compiled parameter expressions require non-selector data.
const renderRouteParamValueExpression = (
	expression: _Expression,
	fieldsExpression: string,
	decode?: _ExpressionDecode,
	optional = false,
	fieldExpressionByName?: Readonly<Record<string, string>>
): string => renderRouteParamExpression(
	expression,
	{
		fields: fieldsExpression,
		fieldExpressionByName,
		optional,
	},
	decode
)

const renderCollectionRouteValueExpression = (
	entity: Entity,
	indexes: GenerationIndexes,
	field: string,
	targetEntity: string,
	fieldsExpression: string
) => {
	const collectionRoutes = indexes.collectionRoutesBySourceField[collectionSourceFieldKey(entity.entityType, field, targetEntity)]
	if (collectionRoutes == null)
		return undefined

	return renderEntityRouteLinkExpression(
		indexes,
		entity.entityType,
		fieldsExpression,
		undefined,
		false,
		undefined,
		collectionRoutes
	)
}

// Selector paths guard variant-owned properties; resolved paths guard
// schema-optional values. Both stop once a primitive/object value begins.
const entityPathConditions = (
	indexes: GenerationIndexes,
	entityType: string,
	fieldsExpression: string,
	mode: 'selector' | 'resolved',
	fieldPaths: readonly string[][],
	fieldExpressionByName?: Readonly<Record<string, string>>
) => [...new Map(fieldPaths.flatMap((fieldPath) => {
	let entity = indexes.entityByType[entityType]
	const conditions: ConditionTerm[] = []

	for (const [index, fieldName] of fieldPath.entries()) {
		if (entity == null)
			break

		const field = entity.fields.find((candidate) => candidate.name === fieldName)
		// Unknown paths are not assumed safe: preserve the generic presence chain
		// so malformed or external expressions cannot produce unsafe access.
		if (field == null)
			return fieldPath.map((_part, fieldIndex) => {
				const presencePath = fieldExpression(fieldsExpression, fieldPath.slice(0, fieldIndex + 1).join('.'))
				return {
					expression: `${presencePath} != null`,
					presencePath,
				}
			})

		const pathExpression = mode === 'selector' && index === 0 ?
			fieldsExpression
		:
			fieldPath.slice(1, index + (mode === 'resolved' ? 1 : 0)).reduce(
				(expression, pathPart) => `${expression}${propertyAccess(pathPart)}`,
				fieldExpressionByName?.[fieldPath[0] ?? ''] ?? fieldExpression(fieldsExpression, fieldPath[0] ?? '')
			)
		const condition = mode === 'selector' ?
			(
				entity.selectors.every((selector) => selector.fields.includes(fieldName)) ?
					undefined
				:
					`${emitTypeScript(fieldName)} in ${pathExpression}`
			)
		: field.cardinality === EntityFieldCardinality.ZeroOrOne ?
			`${pathExpression} != null`
		:
			undefined
		if (condition != null)
			conditions.push({
				expression: condition,
				...(mode === 'resolved' ? { presencePath: pathExpression } : {}),
			})

		entity = field.entityType == null ? undefined : indexes.entityByType[field.entityType]
	}

	return conditions
}).map((term) => [term.expression, term])).values()]

// A unit-typed selector field already proves its only possible equality.
// Keeping that comparison in generated code adds an unreachable undefined arm.
const entitySelectorConditionIsGuaranteed = (
	indexes: GenerationIndexes,
	entityType: string,
	condition: {
		field: string
		equals?: _Literal
	}
) => {
	if (!('equals' in condition))
		return false

	const field = indexes.entityByType[entityType]?.fields.find((candidate) => candidate.name === condition.field)
	const valueType = field?.valueType == null ?
		field?.primitiveType
	:
		indexes.valueTypeById[field.valueType]?.type
	return valueType != null && 'unit' in valueType && valueType.unit === condition.equals
}

const renderEntityRouteLinkExpression = (
	indexes: GenerationIndexes,
	entityType: string,
	fieldsExpression: string,
	selectorName?: string,
	resolvedFields = false,
	fieldExpressionByName?: Readonly<Record<string, string>>,
	routeLinks: readonly EntityRouteLink[] = indexes.entityRouteLinksByType[entityType] ?? []
) => {
	const renderHrefCondition = (conditionGroups: readonly HrefConditionGroup[]) => (
		hrefConditionPlan(conditionGroups).expression
	)
	const entityRouteLinks = routeLinks
		.filter((entityRouteLink) => selectorName == null || entityRouteLink.selector === selectorName)
	// Entities without a visible route intentionally produce no link expression.
	if (entityRouteLinks.length === 0)
		return undefined

	const selectorVariantCoordinateKey = (
		coordinate: {
			entityType: string
			field: string
			parentPath: string
		}
	) => `${coordinate.entityType}\0${coordinate.parentPath}\0${coordinate.field}`
	const selectorVariantCoordinates = (fieldPaths: readonly string[][]) => fieldPaths.flatMap((fieldPath) => {
		let entity = indexes.entityByType[entityType]
		return fieldPath.flatMap((fieldName, index) => {
			if (entity == null)
				return []

			const field = entity.fields.find((candidate) => candidate.name === fieldName)
			if (field == null)
				return []

			const coordinate = entity.selectors.every((selector) => selector.fields.includes(fieldName)) ?
				[]
			:
				[{
					entityType: entity.entityType,
					field: fieldName,
					parentPath: fieldPath.slice(0, index).join('.'),
				}]
			entity = field.entityType == null ? undefined : indexes.entityByType[field.entityType]
			return coordinate
		})
	})
	const routeCandidates = entityRouteLinks.map((entityRouteLink) => {
		const paramFieldPaths = uniqueFieldPaths(Object.values(entityRouteLink.params).flatMap(({ value }) => (
			expressionFieldPaths(value)
		)))
		const params = Object.entries(entityRouteLink.params).map(([param, routeParamValue]) => ({
			param,
			value: renderPresentRouteParamExpression(routeParamValue.value, {
				fields: fieldsExpression,
				fieldExpressionByName,
				entity: indexes.entityByType[entityType],
				indexes,
			}, routeParamValue.decode),
		}))
		const entityConditionTerms = (entityRouteLink.conditions ?? [])
			.filter((condition) => !entitySelectorConditionIsGuaranteed(indexes, entityType, condition))
			.flatMap((condition) => [
				...entityPathConditions(
					indexes,
					entityType,
					fieldsExpression,
					resolvedFields ? 'resolved' : 'selector',
					[[condition.field]],
					fieldExpressionByName
				),
				...conditionTerms(
					condition,
					fieldsExpression,
					indexes.entityByType[entityType],
					indexes,
					false,
					false,
					fieldExpressionByName
				),
			])
		const entityConditionGroup = entityConditionTerms.length === 0 ? undefined : {
			terms: entityConditionTerms,
		}
		const paramConditionGroups = selectorName == null ? Object.values(entityRouteLink.params).flatMap(({ value }) => routeExpressionConditions(
			{
				fields: fieldsExpression,
				entity: indexes.entityByType[entityType],
				indexes,
			},
			value,
			(fieldPaths) => (
				entityPathConditions(
					indexes,
					entityType,
					fieldsExpression,
					resolvedFields ? 'resolved' : 'selector',
					fieldPaths,
					fieldExpressionByName
				)
			)
		)) : []
		const conditionGroups = uniqueHrefConditionGroups([
			...(entityConditionGroup == null ? [] : [entityConditionGroup]),
			...paramConditionGroups,
		])

		return {
			conditionGroups,
			hasParamCondition: paramConditionGroups.length > 0,
			hasRouteCondition: entityConditionGroup != null,
			path: entityRouteLink.path,
			params,
			selectorVariantCoordinates: selectorVariantCoordinates(paramFieldPaths),
			selector: entityRouteLink.selector,
			specificity: conditionGroups.length,
		}
	})
	const routeConditionsAreComplements = (
		leftConditions: NonNullable<EntityRouteLink['conditions']>,
		rightConditions: NonNullable<EntityRouteLink['conditions']>
	) => {
		const left = leftConditions.length === 1 ? leftConditions[0] : undefined
		const right = rightConditions.length === 1 ? rightConditions[0] : undefined
		return (
			left != null
			&& right != null
			&& left.field === right.field
			&& (
				'equals' in left
				&& 'notEquals' in right
				&& left.equals === right.notEquals
				|| 'notEquals' in left
				&& 'equals' in right
				&& left.notEquals === right.equals
			)
		)
	}
	// A required selector is always linkable when every selector either has an
	// unconditional route or partitions one field into complementary branches.
	const routesCoverEverySelector = (
		selectorName == null
		&& routeCandidates.every((candidate) => !candidate.hasParamCondition)
		&& indexes.entityByType[entityType]?.selectors.every((selector) => {
			const selectorLinks = entityRouteLinks.filter((entityRouteLink) => entityRouteLink.selector === selector.name)
			const effectiveConditions = selectorLinks.map((entityRouteLink) => (
				(entityRouteLink.conditions ?? []).filter((condition) => (
					!entitySelectorConditionIsGuaranteed(indexes, entityType, condition)
				))
			))
			if (effectiveConditions.some((conditions) => conditions.length === 0))
				return true

			return effectiveConditions.some((conditions, index) => (
				effectiveConditions.slice(index + 1).some((otherConditions) => (
					routeConditionsAreComplements(conditions, otherConditions)
				))
			))
		}) === true
	)

	// Multiple candidates must all discriminate themselves; otherwise route
	// selection would depend on declaration order.
	if (routeCandidates.length > 1 && routeCandidates.some((candidate) => candidate.conditionGroups.length === 0))
		throw new Error(`${entityType} has multiple unconditional entity hrefs`)

	// Alternatives for the same physical route differ only in selector-derived
	// parameter values. Keep one route and one parameter object, and branch only
	// at the values that actually differ.
	const candidates = [...Map.groupBy(routeCandidates, (candidate) => JSON.stringify([
		candidate.path,
		candidate.params.map(({ param }) => param).toSorted(),
	])).values()].map((group) => {
		const first = group[0]
		if (first == null)
			throw new Error(`${entityType} has an empty entity href candidate group`)

		const sharedConditionGroups = first.conditionGroups.filter((conditionGroup) => (
			group.every((candidate) => candidate.conditionGroups.some((candidateConditionGroup) => (
				hrefConditionGroupExpression(candidateConditionGroup) === hrefConditionGroupExpression(conditionGroup)
			)))
		))
		const sharedSelectorVariantCoordinateKeys = first.selectorVariantCoordinates
			.map(selectorVariantCoordinateKey)
			.filter((coordinateKey) => group.every((candidate) => (
				candidate.selectorVariantCoordinates.some((coordinate) => selectorVariantCoordinateKey(coordinate) === coordinateKey)
			)))
		const alternativeSelectorVariantCoordinates = group.map((candidate) => (
			candidate.selectorVariantCoordinates.filter((coordinate) => (
				!sharedSelectorVariantCoordinateKeys.includes(selectorVariantCoordinateKey(coordinate))
			))
		))
		const variantConditionGroups = group.map((candidate) => candidate.conditionGroups.filter((conditionGroup) => (
			!sharedConditionGroups.some((sharedConditionGroup) => (
				hrefConditionGroupExpression(sharedConditionGroup) === hrefConditionGroupExpression(conditionGroup)
			))
		)))
		if (group.length > 1 && variantConditionGroups.some((conditions) => conditions.length === 0))
			throw new Error(`${entityType} same-route entity href candidates are not distinguishable`)
		const parameterVariantsCoverSelector = (
			alternativeSelectorVariantCoordinates.every((coordinates) => coordinates.length === 1)
			&& new Set(alternativeSelectorVariantCoordinates.flatMap((coordinates) => (
				coordinates.map(({ entityType: coordinateEntityType, parentPath }) => (
					`${coordinateEntityType}\0${parentPath}`
				))
			))).size === 1
			&& indexes.entityByType[alternativeSelectorVariantCoordinates[0]?.[0]?.entityType ?? '']?.selectors.every((selector) => (
				alternativeSelectorVariantCoordinates.some((coordinates) => (
					coordinates[0] != null
					&& selector.fields.includes(coordinates[0].field)
				))
			)) === true
		)
		const groupCoversEverySelector = (
			selectorName == null
			&& (
				parameterVariantsCoverSelector
				|| (
					group.every((candidate) => !candidate.hasRouteCondition)
					&& indexes.entityByType[entityType]?.selectors.every((selector) => (
						group.some((candidate) => candidate.selector === selector.name)
					)) === true
				)
			)
		)

		const params = first.params
			.toSorted((left, right) => (
				routeParamNames(first.path).indexOf(left.param) - routeParamNames(first.path).indexOf(right.param)
			))
			.map(({ param }) => {
				const values = group.map((candidate) => {
					const candidateParam = candidate.params.find((item) => item.param === param)
					if (candidateParam == null)
						throw new Error(`${entityType} entity href candidates disagree on route parameters`)

					return candidateParam.value
				})
				const fallback = values.at(-1)
				if (fallback == null)
					throw new Error(`${entityType} entity href parameter ${param} has no value`)

				return {
					param,
					value: unique(values).length === 1 ?
						fallback
					:
						renderConditionalExpression(
							group.slice(0, -1).map((candidate, candidateIndex) => ({
								condition: renderHrefCondition(variantConditionGroups[candidateIndex] ?? candidate.conditionGroups),
								value: values[candidateIndex] ?? fallback,
							})),
							fallback
						),
				}
			})
		return {
			conditionGroups: group.length === 1 ?
				first.conditionGroups
			: groupCoversEverySelector ?
				sharedConditionGroups
			:
				[
					...sharedConditionGroups,
					{
						terms: [{
							expression: `(\n${indent(variantConditionGroups.map((conditionGroups) => {
								const condition = hrefConditionPlan(conditionGroups)
								return condition.logical ?
									`(\n${indent(condition.expression, 1)}\n)`
								:
									condition.expression
							}).join('\n|| '), 1)}\n)`,
							logical: true,
						}],
					},
				],
			hrefExpression: renderResolveExpression(
				first.path,
				params.map(({ param, value }): [string, string] => [
					param,
					value,
				])
			),
			specificity: Math.max(...group.map((candidate) => candidate.specificity)),
		}
	}).toSorted((left, right) => right.specificity - left.specificity)

	// A single route emits directly unless it has a real applicability condition.
	if (candidates.length === 1) {
		const candidate = candidates[0]
		return candidate.conditionGroups.length === 0 ?
			candidates[0].hrefExpression
		:
			`(\n${indent(renderHrefCondition(candidates[0].conditionGroups), 1)} ?\n${indent(candidates[0].hrefExpression, 2)}\n\t:\n\t\tundefined\n)`
	}

	// Factor conditions common to every candidate once around the decision tree.
	const sharedConditionGroups = candidates[0].conditionGroups.reduce<HrefConditionGroup[]>(
		(sharedConditions, condition, index) => (
			sharedConditions.length === index
			&& candidates.every((candidate) => (
				hrefConditionGroupExpression(candidate.conditionGroups[index] ?? { terms: [] }) === hrefConditionGroupExpression(condition)
			)) ?
				[
					...sharedConditions,
					condition,
				]
			:
				sharedConditions
		),
		[]
	)
	const renderCandidateExpression = (
		candidateIndex: number,
		level: number
	): string => {
		const candidate = candidates[candidateIndex]
		// The exhausted decision tree has no canonical route.
		if (candidate == null)
			return `${'\t'.repeat(level)}undefined`
		// Grouping selector variants can prove a route unconditional even when
		// each input candidate needed its own selector-presence condition.
		if (candidate.conditionGroups.length === 0) {
			if (candidateIndex !== candidates.length - 1)
				throw new Error(`${entityType} has an unconditional entity href before another candidate`)

			return indent(candidate.hrefExpression, level)
		}
		// Exhaustive selector partitions use their final route as the else arm.
		if (routesCoverEverySelector && candidateIndex === candidates.length - 1)
			return indent(candidate.hrefExpression, level)

		const conditionGroups = candidate.conditionGroups.slice(sharedConditionGroups.length)
		return [
			`${indent(renderHrefCondition(conditionGroups), level)} ?`,
			indent(candidate.hrefExpression, level + 1),
			`${'\t'.repeat(level)}:`,
			renderCandidateExpression(candidateIndex + 1, level + 1),
		].join('\n')
	}
	const candidateExpression = renderCandidateExpression(
		0,
		sharedConditionGroups.length === 0 ? 1 : 2
	)

	return sharedConditionGroups.length === 0 ?
		`(\n${candidateExpression}\n)`
	:
		`(\n${indent(renderHrefCondition(sharedConditionGroups), 1)} ?\n${candidateExpression}\n\t:\n\t\tundefined\n)`
}

const compileEntityPageSelection = (
	indexes: GenerationIndexes,
	entity: Entity | undefined,
	entityType: string,
	selectorExpression: string,
	selectorName?: string,
	sourceSelection?: readonly string[] | _SourceSelection
) => {
	if (entity == null)
		return {
			entityType,
			fields: [],
			selectorExpression,
			sourcesExpression: undefined,
		}

	const selector = entity.selectors.find((item) => item.name === selectorName)
	const sourceSelectorField = selector?.fields.includes('source') === true
	const fields = viewResolvedFieldReferences(entity, indexes, selectorName)
		.filter((fieldReference) => {
			const fieldDefinition = fieldDefinitionByReference(entity, fieldReference, indexes)
			return (
				fieldDefinition != null
				&& fieldDefinition.type !== EntityFieldType.EntitiesReference
			)
		})
	const fieldDefaultSources = pageSelectionFieldDefaultSources(entity, indexes, fields)
	const selectorSourceExpression = selectorExpression.includes('\n') ?
		`(${selectorExpression}).source`
	:
		`${selectorExpression}.source`

	return {
		entityType,
		fields,
		selectorExpression,
		sourcesExpression: sourceSelectorField ?
			`[${selectorSourceExpression}]`
		:
			renderFieldConditionedSourceSelectionExpression(
				sourceSelection ?? fieldDefaultSources,
				selectorExpression
			),
	}
}

const renderCompiledEntityPageSelection = (
	selection: ReturnType<typeof compileEntityPageSelection>
) => {
	const query = renderQuery(undefined, selection.fields, selection.sourcesExpression)
	return query === '{}' ?
		`select(EntityType.${selection.entityType}, ${selection.selectorExpression})`
	:
		`select(EntityType.${selection.entityType}, ${selection.selectorExpression}, ${query})`
}

const renderEntityPageSelection = (
	indexes: GenerationIndexes,
	entity: Entity | undefined,
	entityType: string,
	selectorExpression: string,
	selectorName?: string,
	sourceSelection?: readonly string[] | _SourceSelection
) => renderCompiledEntityPageSelection(compileEntityPageSelection(
	indexes,
	entity,
	entityType,
	selectorExpression,
	selectorName,
	sourceSelection
))

const pageSelectionFieldDefaultSources = (
	entity: Entity,
	indexes: GenerationIndexes,
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

const renderCarousel = (
	entity: Entity,
	indexes: GenerationIndexes,
	carousel: EntityCarousel,
	sharedSourceSelectionNames?: ReadonlyMap<string, string>
) => {
	const sections = carousel.sections
	if (sections.length === 0)
		throw new Error(`${entity.entityType} carousel ${carousel.id ?? carousel.label ?? 'unnamed'} has no sections`)

	const renderedSections = sections.map((section) => renderCarouselSection(
		entity,
		indexes,
		section,
		carousel.projectionPath,
		carousel.id ?? carousel.label,
		sharedSourceSelectionNames
	))
	const sectionExpression = (section: EntityCarouselSection, index: number): TypeScriptEmission => {
		const expression = {
			kind: 'object',
			entries: [
				['id', carouselSectionId(section)],
				['label', section.label ?? section.field ?? 'Section'],
				['description', section.description],
				['ownsSection', renderedSections[index]?.ownsSection ? true : undefined],
			],
			multiline: true,
		} as const satisfies TypeScriptEmission
		const availability = renderedSections[index]?.availability
		return availability == null ?
			expression
		:
			{
				kind: 'spread',
				value: {
					kind: 'raw',
					source: [
						'(',
						`\t${availability} ?`,
						indent(emitTypeScript({
							kind: 'array',
							values: [expression],
							multiline: true,
						}), 2),
						'\t:',
						'\t\t[]',
						')',
					].join('\n'),
				},
			}
	}
	const sectionsExpression = emitTypeScript({
		kind: 'array',
		values: sections.map(sectionExpression),
		multiline: true,
	})
	const dynamicSectionsName = renderedSections.some(({ availability }) => availability != null) ?
		generatedIdentifier(`${carousel.id ?? carousel.label}-sections`)
	:
		undefined
	const componentLines = [
		'\t\t\t<CollapsibleTabs',
		`\t\t\t\tid={viewDomId + ${emitTypeScript(`-carousel-${carousel.id ?? pascal(carousel.label)}`)}}`,
		'\t\t\t\tsectionIdPrefix={viewDomId}',
		renderSvelteAttribute(4, 'sections', dynamicSectionsName ?? sectionsExpression),
		'\t\t\t\tdata-card',
		...(carousel.className == null ? [] : [
			`\t\t\t\tclass=${emitTypeScript(carousel.className)}`,
		]),
		'\t\t\t>',
		'\t\t\t\t{#snippet Summary()}',
		'\t\t\t\t\t<header data-row-item="flexible" data-row="wrap gap-4">',
		`\t\t\t\t\t\t<HeadingComponent>${carousel.label}</HeadingComponent>`,
		...(carousel.description == null ? [] : [
			'\t\t\t\t\t\t<Tooltip>',
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
		...renderedSections.flatMap(({ markup }) => markup),
		'\t\t\t</CollapsibleTabs>',
	]
	const tabsLines = [
		...renderedSections.flatMap(({ resourceDeclaration }) => resourceDeclaration),
		...(dynamicSectionsName == null ? componentLines : [
			renderSvelteConst(3, dynamicSectionsName, sectionsExpression),
			'',
			`\t\t\t{#if ${dynamicSectionsName}.length > 0}`,
			...componentLines.map((line) => indent(line)),
			'\t\t\t{/if}',
		]),
	]

	return tabsLines
}

const renderCarouselMarkerSnippet = (
	sectionId: string,
	resourceName: string,
	omitWhenResolvedEmpty = false
) => {
	if (!omitWhenResolvedEmpty)
		return []

	const boundaryLines = [
		'\t\t\t\t\t<ResourceBoundary',
		renderSvelteAttribute(6, 'resource', resourceName),
		'\t\t\t\t\t>',
		'\t\t\t\t\t\t{#snippet children(_resolved)}',
		'\t\t\t\t\t\t\t{#if _resolved != null}',
		'\t\t\t\t\t\t\t{@render Content()}',
		'\t\t\t\t\t\t\t{/if}',
		'\t\t\t\t\t\t{/snippet}',
		'',
		'\t\t\t\t\t\t{#snippet PendingContent()}',
		'\t\t\t\t\t\t\t{@render Content()}',
		'\t\t\t\t\t\t{/snippet}',
		'',
		'\t\t\t\t\t\t{#snippet FailedContent(_error, _retry)}',
		'\t\t\t\t\t\t\t{@render Content()}',
		'\t\t\t\t\t\t{/snippet}',
		'\t\t\t\t\t</ResourceBoundary>',
	]

	return [
		...renderSvelteSnippet(4, `Marker${pascal(sectionId)}(_context, Content)`, boundaryLines),
		'',
	]
}

const renderCarouselSectionSnippet = (
	sectionId: string,
	resourceName: string,
	resolvedName: string,
	sectionBodyLines: string[],
	usesOpen: boolean,
	omitWhenResolvedEmpty = false,
	contentOwnsResourceState = false
) => {
	if (contentOwnsResourceState) {
		return [
			...renderSvelteSnippet(
				4,
				`Section${pascal(sectionId)}({ id, label${usesOpen ? ', open' : ''} })`,
				sectionBodyLines
			),
			'',
		]
	}

	const sectionLevel = omitWhenResolvedEmpty ? 8 : 7
	const boundaryLines = [
		'\t\t\t\t\t<ResourceBoundary',
		renderSvelteAttribute(6, 'resource', resourceName),
		'\t\t\t\t\t>',
		`\t\t\t\t\t\t{#snippet children(${resolvedName})}`,
		...(omitWhenResolvedEmpty ? [
			`\t\t\t\t\t\t\t{#if ${resolvedName} != null}`,
		] : []),
		`${'\t'.repeat(sectionLevel)}<section`,
		`${'\t'.repeat(sectionLevel + 1)}id={id}`,
		'\t'.repeat(sectionLevel + 1) + 'aria-labelledby={`${id}:marker`}',
		`${'\t'.repeat(sectionLevel + 1)}data-scroll-marker-label={label}`,
		`${'\t'.repeat(sectionLevel + 1)}data-column-item="flexible"`,
		`${'\t'.repeat(sectionLevel + 1)}data-column`,
		`${'\t'.repeat(sectionLevel + 1)}data-active={active}`,
		`${'\t'.repeat(sectionLevel)}>`,
		...reindentLines(sectionBodyLines, sectionLevel + 1),
		`${'\t'.repeat(sectionLevel)}</section>`,
		...(omitWhenResolvedEmpty ? [
			'\t\t\t\t\t\t\t{/if}',
		] : []),
		'\t\t\t\t\t\t{/snippet}',
		'',
		'\t\t\t\t\t\t{#snippet Pending()}',
		'\t\t\t\t\t\t\t<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>',
		'\t\t\t\t\t\t\t\t<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>',
		'\t\t\t\t\t\t\t\t\t<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>',
		'\t\t\t\t\t\t\t\t</article>',
		'\t\t\t\t\t\t\t</section>',
		'\t\t\t\t\t\t{/snippet}',
		'',
		'\t\t\t\t\t\t{#snippet Failed(_error, _retry)}',
		'\t\t\t\t\t\t\t<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>',
		'\t\t\t\t\t\t\t\t<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>',
		'\t\t\t\t\t\t\t\t\t<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>',
		'\t\t\t\t\t\t\t\t</article>',
		'\t\t\t\t\t\t\t</section>',
		'\t\t\t\t\t\t{/snippet}',
		'\t\t\t\t\t</ResourceBoundary>',
	]

	return [
		...renderSvelteSnippet(
			4,
			`Section${pascal(sectionId)}({ id, label${usesOpen ? ', open' : ''}, active })`,
			boundaryLines
		),
		'',
	]
}

// Global and mixed-target sources already apply to every network. Only a source
// whose complete binding set is network-targeted needs runtime network filtering.
const networkSourceSelectionNeedsFiltering = (
	indexes: GenerationIndexes,
	sourceSelection: readonly string[]
) => sourceSelection.some((source) => {
	const sourceBindings = indexes.sourceBindings.filter((entry) => entry.source === source)
	return (
		sourceBindings.length > 0
		&& sourceBindings.every(({ binding }) => (
			binding.target.kind === SourceTargetKind.Caip2Network
			|| binding.target.kind === SourceTargetKind.NetworkSlug
			|| binding.target.kind === SourceTargetKind.Eip155Chain
		))
	)
})

// Network-specific carousel sources are filtered once and reused by both
// applicability and the resource query.
const carouselApplicableSources = (
	entity: Entity,
	indexes: GenerationIndexes,
	sourceSelection: readonly string[] | undefined,
	resourceName: string,
	sharedSourceSelectionNames?: ReadonlyMap<string, string>
) => {
	if (
		entity.entityType !== EntityType.Network
		|| sourceSelection == null
		|| !networkSourceSelectionNeedsFiltering(indexes, sourceSelection)
	)
		return {
			applicable: false,
		} as const

	const sharedSourcesName = sharedSourceSelectionNames?.get(sourceSelectionKey(sourceSelection))
	return sharedSourcesName == null ?
		{
			applicable: true,
			expression: renderNetworkApplicableSourceArray(sourceSelection),
			name: resourceName.replace(/Resource$/, 'Sources'),
		} as const
	:
		{
			applicable: true,
			name: sharedSourcesName,
		} as const
}

const renderCarouselApplicableSourceDeclaration = (
	applicableSources: ReturnType<typeof carouselApplicableSources>
) => (
	applicableSources.applicable && 'expression' in applicableSources ? [
		renderSvelteConst(3, applicableSources.name, applicableSources.expression),
		'',
	] : []
)

type CarouselSectionResourcePlan = {
	applicableSources: ReturnType<typeof carouselApplicableSources>
	field: FieldReference
	resourceExpression: string
	resourceName: string
	sectionId: string
}

const renderCarouselSection = (
	entity: Entity,
	indexes: GenerationIndexes,
	section: EntityCarouselSection,
	projectionPath?: readonly [string, ...string[]],
	carouselId?: string,
	sharedSourceSelectionNames?: ReadonlyMap<string, string>
) => {
	if (section.Content != null) {
		// ConstTags must remain direct snippet children. Trivia moves with a leading
		// ConstTag, but otherwise stays inside the generator-owned article.
		const contentFragmentNodes = parseSvelte(section.Content.raw, { modern: true }).fragment.nodes
		const firstContentNodeIndex = contentFragmentNodes.findIndex((node) => (
			node.type !== 'ConstTag'
			&& node.type !== 'Comment'
			&& (node.type !== 'Text' || node.data.trim() !== '')
		))
		const leadingNodes = (
			firstContentNodeIndex === -1 ?
				contentFragmentNodes
			:
				contentFragmentNodes.slice(0, firstContentNodeIndex)
		)
		if (contentFragmentNodes
			.slice(firstContentNodeIndex === -1 ? contentFragmentNodes.length : firstContentNodeIndex)
			.some((node) => node.type === 'ConstTag')
		)
			throw new Error(`${entity.entityType} carousel section ${carouselSectionId(section)} raw Content has a top-level {@const} after rendered content`)

		const leadingContentEnd = (
			leadingNodes.some((node) => node.type === 'ConstTag') ?
				leadingNodes.at(-1)?.end ?? 0
			:
				0
		)
		const leadingContentLines = leadingContentEnd === 0 ? [] : lines(section.Content.raw.slice(0, leadingContentEnd))
		const articleContent = section.Content.raw.slice(leadingContentEnd)
		const articleContentLines = articleContent === '' ? [] : lines(articleContent)

		return {
			availability: undefined,
			ownsSection: false,
			resourceDeclaration: [],
			markup: [
				`\t\t\t\t{#snippet Section${pascal(carouselSectionId(section))}({ id, label${section.Content.references?.includes('open') === true ? ', open' : ''} })}`,
				...leadingContentLines.map((line) => `${'\t'.repeat(5)}${line}`),
				'\t\t\t\t\t<article',
				'\t\t\t\t\t\tid={`${id}-list`}',
				'\t\t\t\t\t\tdata-column-item="flexible"',
				'\t\t\t\t\t\tdata-card',
				'\t\t\t\t\t\tdata-scroll-container',
				'\t\t\t\t\t>',
				...articleContentLines.map((line) => line.trim() === '' ? '' : `${'\t'.repeat(6)}${line}`),
				'\t\t\t\t\t</article>',
				'\t\t\t\t{/snippet}',
				'',
			],
		}
	}

	if (section.field == null)
		throw new Error(`${entity.entityType} carousel section ${carouselSectionId(section)} needs Content or field`)

	const fieldDefinition = fieldDefinitionByReference(entity, section.field, indexes)
	if (fieldDefinition == null)
		throw new Error(`${entity.entityType} carousel section ${carouselSectionId(section)} references unknown field ${section.field}`)

	const sectionId = carouselSectionId(section)
	const resourceName = generatedIdentifier(`${carouselId ?? 'carousel'}-${sectionId.startsWith(`${carouselId ?? ''}-`) ? sectionId.slice((carouselId?.length ?? 0) + 1) : sectionId}-resource`)
	const applicableSources = carouselApplicableSources(
		entity,
		indexes,
		section.selection?.sources ?? fieldDefinition.defaultSources,
		resourceName,
		sharedSourceSelectionNames
	)
	const fieldProjectionAccess = carouselFieldProjectionAccess(section.field, projectionPath)
	const resourceExpression = fieldProxyResourceExpression(
		fieldProjectionAccess.fieldBase,
		fieldProjectionAccess.fieldReference ?? '',
		renderQuery(
			fieldQuery(fieldDefinition, section.selection),
			[],
			applicableSources.applicable ? applicableSources.name : undefined
		)
	)
	const resourcePlan = {
		applicableSources,
		field: section.field,
		resourceExpression,
		resourceName,
		sectionId,
	}
	if (
		section.items != null
		&& section.items.length > 0
		&& fieldDefinition.type === EntityFieldType.Primitive
		&& fieldCardinalityIsMany(fieldDefinition)
	)
		return renderPrimitiveCarouselSection(
			entity,
			indexes,
			section,
			fieldDefinition,
			resourcePlan
		)

	if (fieldDefinition.entityType == null)
		throw new Error(`${entity.entityType} carousel section ${carouselSectionId(section)} field ${section.field} is not an entity reference or primitive list`)

	const component = carouselSectionComponent(entity, indexes, section)
	if (component == null)
		throw new Error(`${entity.entityType} carousel section ${carouselSectionId(section)} has no renderable relationship component for ${section.field}`)

	const targetEntity = fieldDefinition.entityType
	const targetEntityName = camel(targetEntity)
	const sectionSelectSourcesExpression = (
		applicableSources.applicable ?
			applicableSources.name
		:
			renderSourceSelectionExpression(section.selection?.sources) ?? 'selection.sources'
	)
	const targetSelectionExpression = `select(EntityType.${targetEntity}, ${targetEntityName}[EntityMetaKey.Selector], ${emitObject([
		['sources', sectionSelectSourcesExpression],
	])})`
	const hrefExpression = section.link == null ?
		renderCollectionRouteValueExpression(
			entity,
			indexes,
			section.field,
			targetEntity,
			'selection.entitySelector'
		)
	:
		renderResolveExpression(
			section.link.route,
			(section.link.params ?? []).map((param) => [
				param.param,
				renderRouteParamValueExpression(param.value, 'selection.entitySelector'),
			])
		)
	const contentOwnsResourceState = (
		fieldDefinition.type === EntityFieldType.EntitiesReference
		|| (
			fieldDefinition.type === EntityFieldType.EntityReference
			&& fieldDefinition.cardinality === EntityFieldCardinality.Many
		)
	)
	const omitWhenResolvedEmpty = (
		fieldDefinition.type === EntityFieldType.EntityReference
		&& fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne
	)
	const resourceReference = omitWhenResolvedEmpty ?
		resourceName
	:
		resourceExpression

	const sectionBodyLines = fieldDefinition.type === EntityFieldType.EntityReference ? (
		fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne
		|| fieldDefinition.cardinality === EntityFieldCardinality.One ? [
			'\t\t\t\t\t\t<article',
			'\t\t\t\t\t\t\tid={`${id}-list`}',
			'\t\t\t\t\t\t\tdata-column-item="flexible"',
			'\t\t\t\t\t\t\tdata-card',
			'\t\t\t\t\t\t\tdata-scroll-container',
			'\t\t\t\t\t\t>',
			`\t\t\t\t\t\t\t<${componentIdentifier(component)}`,
			renderSvelteAttribute(
				8,
				'selection',
				targetSelectionExpression
			),
			...(viewComponentAcceptsPrefetched(indexes, targetEntity, component) ? [
				`\t\t\t\t\t\t\t\tprefetched={${targetEntityName}}`,
			] : []),
			'\t\t\t\t\t\t\t\tlayout={EntityLayout.SummaryInline}',
			'\t\t\t\t\t\t\t/>',
			'\t\t\t\t\t\t</article>',
		] : [
			'\t\t\t\t\t<EntitiesList',
			`\t\t\t\t\t\tentityType={EntityType.${targetEntity}}`,
			'\t\t\t\t\t\tid={`${id}-list`}',
			'\t\t\t\t\t\ttitle={label}',
			'\t\t\t\t\t\tcollapsible={false}',
			'\t\t\t\t\t\tdata-column-item="flexible"',
			'\t\t\t\t\t\tdata-card',
			'\t\t\t\t\t\tdata-scroll-container',
			renderSvelteAttribute(6, 'resource', resourceReference),
			...(section.emptyText == null ? [] : [
				`\t\t\t\t\t\temptyText=${emitTypeScript(section.emptyText)}`,
			]),
			'\t\t\t\t\t>',
			`\t\t\t\t\t\t{#snippet Item({ item: ${targetEntityName} })}`,
			`\t\t\t\t\t\t\t<${componentIdentifier(component)}`,
			renderSvelteAttribute(
				8,
				'selection',
				targetSelectionExpression
			),
			...(viewComponentAcceptsPrefetched(indexes, targetEntity, component) ? [
				`\t\t\t\t\t\t\t\tprefetched={${targetEntityName}}`,
			] : []),
			'\t\t\t\t\t\t\t\tlayout={EntityLayout.Summary}',
			'\t\t\t\t\t\t\t\topen={false}',
			'\t\t\t\t\t\t\t/>',
			'\t\t\t\t\t\t{/snippet}',
			'\t\t\t\t\t</EntitiesList>',
		]
	) : isDefaultPluralViewComponent(indexes, targetEntity, component) ?
		renderDefaultEntitiesList(
			targetEntity,
			resourceReference,
			[
				...(hrefExpression == null ? [] : [renderSvelteAttribute(6, 'href', hrefExpression)]),
				'\t\t\t\t\t\tcollapsible={false}',
				'\t\t\t\t\t\ttitle={label}',
				...(section.emptyText == null ? [] : [
					`\t\t\t\t\t\temptyText=${emitTypeScript(section.emptyText)}`,
				]),
				'\t\t\t\t\t\topen={true}',
				'\t\t\t\t\t\tid={`${id}-list`}',
			],
			5
		)
	:
		[
			`\t\t\t\t\t<${componentIdentifier(component)}`,
			renderSvelteAttribute(6, 'selection', resourceReference),
			...(hrefExpression == null ? [] : [renderSvelteAttribute(6, 'href', hrefExpression)]),
			'\t\t\t\t\t\tcollapsible={false}',
			...(component === indexes.entityByType[targetEntity]?.views.plural?.component ? [] : [
				'\t\t\t\t\t\tdata-column-item="flexible"',
				'\t\t\t\t\t\tdata-card',
				'\t\t\t\t\t\tdata-scroll-container',
			]),
			'\t\t\t\t\t\ttitle={label}',
			...(section.emptyText == null ? [] : [
				`\t\t\t\t\t\temptyText=${emitTypeScript(section.emptyText)}`,
			]),
			'\t\t\t\t\t\tid={`${id}-list`}',
			'\t\t\t\t\t/>',
		]
	return {
		availability: applicableSources.applicable ? `${applicableSources.name}.length > 0` : undefined,
		ownsSection: !contentOwnsResourceState,
		resourceDeclaration: [
			...renderCarouselApplicableSourceDeclaration(applicableSources),
			...(omitWhenResolvedEmpty ? [renderSvelteConst(3, resourceName, resourceExpression), ''] : []),
		],
		markup: [
			...renderCarouselMarkerSnippet(
				sectionId,
				resourceName,
				omitWhenResolvedEmpty
			),
			...renderCarouselSectionSnippet(
				sectionId,
				resourceReference,
				targetEntityName,
				sectionBodyLines,
				section.items?.some(viewItemUsesOpen) ?? false,
				omitWhenResolvedEmpty,
				contentOwnsResourceState
			),
		],
	}
}

const renderPrimitiveCarouselSection = (
	entity: Entity,
	indexes: GenerationIndexes,
	section: EntityCarouselSection,
	fieldDefinition: EntityField,
	resourcePlan: CarouselSectionResourcePlan
) => {
	const {
		applicableSources,
		field,
		resourceExpression,
		resourceName,
		sectionId,
	} = resourcePlan
	const fieldName = fieldNameForReference(field)
	const primitiveValuesName = camel(fieldName)
	const primitiveValuesFieldName = `${primitiveValuesName}Field`
	const primitiveValueName = camel((fieldDefinition.label ?? fieldName).replace(/s$/, ''))
	const primitiveValueIndexName = `${primitiveValueName}Index`
	const primitiveValueType = fieldValueTypeType(indexes, fieldDefinition)
	const primitiveValuesExpression = `${primitiveValuesFieldName}.values`
	const sectionBodyLines = [
		'\t\t\t\t\t<article',
		'\t\t\t\t\t\tid={`${id}-list`}',
		'\t\t\t\t\t\tdata-column-item="flexible"',
		'\t\t\t\t\t\tdata-card',
		'\t\t\t\t\t\tdata-scroll-container',
		'\t\t\t\t\t>',
		...(section.emptyText == null ? [] : [
			`\t\t\t\t\t\t{#if ${primitiveValuesExpression}.length === 0}`,
			`\t\t\t\t\t\t\t<p data-text="muted">${section.emptyText}</p>`,
			'\t\t\t\t\t\t{/if}',
		]),
		'\t\t\t\t\t\t<ul data-column="gap-2" data-section-state="resolved-nonempty">',
		`\t\t\t\t\t\t\t{#each ${primitiveValuesExpression} as ${primitiveValueName}, ${primitiveValueIndexName} (${primitiveValueIndexName})}`,
		'\t\t\t\t\t\t\t\t<li>',
		'\t\t\t\t\t\t\t\t\t<dl data-column-item="center">',
		...(section.items ?? []).flatMap((viewEntry) => {
			const fieldReference = itemFieldReferences(viewEntry)[0]
			const fieldName = fieldReference == null ? undefined : fieldNameForReference(fieldReference)
			const valueTypeField = (
				primitiveValueType != null
				&& 'object' in primitiveValueType
				&& fieldName != null ?
					primitiveValueType.object.find((field) => field.name.replace(/\?$/, '') === fieldName)
				:
					undefined
			)
			return renderPrimitiveCarouselRowItem(
				entity,
				indexes,
				viewEntry,
				primitiveValueName,
				10,
				valueTypeField?.type,
				valueTypeField?.name.endsWith('?') ?? true
			)
		}),
		'\t\t\t\t\t\t\t\t\t</dl>',
		'\t\t\t\t\t\t\t\t</li>',
		'\t\t\t\t\t\t\t{/each}',
		'\t\t\t\t\t\t</ul>',
		'\t\t\t\t\t</article>',
	]

	return {
		availability: applicableSources.applicable ? `${applicableSources.name}.length > 0` : undefined,
		ownsSection: true,
		resourceDeclaration: renderCarouselApplicableSourceDeclaration(applicableSources),
		markup: [
			...renderCarouselMarkerSnippet(
				sectionId,
				resourceName
			),
			...renderCarouselSectionSnippet(
				sectionId,
				resourceExpression,
				primitiveValuesFieldName,
				sectionBodyLines,
				section.items?.some(viewItemUsesOpen) ?? false
			),
		],
	}
}

const renderPrimitiveCarouselRowItem = (
	entity: Entity,
	indexes: GenerationIndexes,
	viewEntry: _ViewItem,
	primitiveFieldsExpression: string,
	level: number,
	valueTypeType?: ValueTypeType,
	valueIsOptional = true
) => {
	if (typeof viewEntry === 'object' && 'kind' in viewEntry)
		throw new Error(`${entity.entityType} primitive carousel row item cannot use kinded view metadata`)

	const fieldReference = itemFieldReferences(viewEntry)[0]
	if (fieldReference == null)
		throw new Error(`${entity.entityType} primitive carousel row item is missing a field reference`)
	const fieldName = fieldNameForReference(fieldReference)

	const label = typeof viewEntry === 'object' && 'label' in viewEntry && viewEntry.label != null ? viewEntry.label : fieldName
	const valueExpression = fieldExpression(primitiveFieldsExpression, fieldName)
	const valueMarkup = renderValueMarkup(entity, indexes, viewEntry, fieldName, valueExpression, primitiveFieldsExpression, level + (valueIsOptional ? 3 : 2), valueTypeType)

	return renderDefinitionListItem(level, label, [
		...(valueIsOptional ? [
			`${'\t'.repeat(level + 2)}{#if ${valueExpression} != null}`,
			...valueMarkup,
			`${'\t'.repeat(level + 2)}{/if}`,
		] : valueMarkup),
	])
}

const renderEntityReferenceSection = (
	entity: Entity,
	section: RelationshipSection,
	fieldDefinition: EntityField,
	targetEntity: EntityType,
	query: string,
	component: string,
	level: number,
	fieldResourceBase: string,
	fieldReference: FieldReference
) => {
	const targetEntityName = camel(targetEntity)
	if (entitySelectorOwnsField(entity, section.field)) {
		const selectorExpression = fieldExpression('selection.entitySelector', section.field)

		return [
			`${'\t'.repeat(level)}<section data-column="gap-2">`,
			`${'\t'.repeat(level + 1)}<h3>${section.label ?? labelForField(fieldDefinition)}</h3>`,
			`${'\t'.repeat(level + 1)}<${componentIdentifier(component)}`,
			renderSvelteAttribute(level + 2, 'selection', `select(EntityType.${targetEntity}, ${selectorExpression})`),
			`${'\t'.repeat(level + 2)}layout={EntityLayout.Summary}`,
			`${'\t'.repeat(level + 2)}open={false}`,
			`${'\t'.repeat(level + 1)}/>`,
			`${'\t'.repeat(level)}</section>`,
		]
	}
	if (fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne)
		return [
			`${'\t'.repeat(level)}<ResourceBoundary`,
			renderSvelteAttribute(level + 1, 'resource', fieldProxyResourceExpression(fieldResourceBase, fieldReference, query)),
			`${'\t'.repeat(level)}>`,
			`${'\t'.repeat(level + 1)}{#snippet children(${targetEntityName})}`,
			`${'\t'.repeat(level + 2)}{#if ${targetEntityName} != null}`,
			`${'\t'.repeat(level + 3)}<section data-column="gap-2">`,
			`${'\t'.repeat(level + 4)}<h3>${section.label ?? labelForField(fieldDefinition)}</h3>`,
			`${'\t'.repeat(level + 4)}<${componentIdentifier(component)}`,
			`${'\t'.repeat(level + 5)}selection={select(EntityType.${targetEntity}, ${targetEntityName}[EntityMetaKey.Selector])}`,
			...(viewComponentAcceptsPrefetched(indexes, targetEntity, component) ? [
				`${'\t'.repeat(level + 5)}prefetched={${targetEntityName}}`,
			] : []),
			`${'\t'.repeat(level + 5)}layout={EntityLayout.Summary}`,
			`${'\t'.repeat(level + 5)}open={false}`,
			`${'\t'.repeat(level + 4)}/>`,
			`${'\t'.repeat(level + 3)}</section>`,
			`${'\t'.repeat(level + 2)}{/if}`,
			`${'\t'.repeat(level + 1)}{/snippet}`,
			`${'\t'.repeat(level)}</ResourceBoundary>`,
		]
	const referenceLevel = level + 3

	return [
		`${'\t'.repeat(level)}<section data-column="gap-2">`,
		`${'\t'.repeat(level + 1)}<h3>${section.label ?? labelForField(fieldDefinition)}</h3>`,
		`${'\t'.repeat(level + 1)}<ResourceBoundary`,
		renderSvelteAttribute(level + 2, 'resource', fieldProxyResourceExpression(fieldResourceBase, fieldReference, query)),
		`${'\t'.repeat(level + 1)}>`,
		`${'\t'.repeat(level + 2)}{#snippet children(${targetEntityName})}`,
		`${'\t'.repeat(referenceLevel)}<${componentIdentifier(component)}`,
		`${'\t'.repeat(referenceLevel + 1)}selection={select(EntityType.${targetEntity}, ${targetEntityName}[EntityMetaKey.Selector])}`,
		...(viewComponentAcceptsPrefetched(indexes, targetEntity, component) ? [
			`${'\t'.repeat(referenceLevel + 1)}prefetched={${targetEntityName}}`,
		] : []),
		`${'\t'.repeat(referenceLevel + 1)}layout={EntityLayout.Summary}`,
		`${'\t'.repeat(referenceLevel + 1)}open={false}`,
		`${'\t'.repeat(referenceLevel)}/>`,
		`${'\t'.repeat(level + 2)}{/snippet}`,
		`${'\t'.repeat(level + 1)}</ResourceBoundary>`,
		`${'\t'.repeat(level)}</section>`,
	]
}

const renderDefaultEntitiesList = (
	entityType: EntityType,
	selectionExpression: string,
	attributes: readonly string[],
	level: number
) => {
	const entityValueName = camel(entityType)

	return [
		`${'\t'.repeat(level)}<EntitiesList`,
		`${'\t'.repeat(level + 1)}entityType={EntityType.${entityType}}`,
		...attributes,
		renderSvelteAttribute(level + 1, 'resource', `${selectionExpression}()`),
		`${'\t'.repeat(level)}>`,
		`${'\t'.repeat(level + 1)}{#snippet Item({ item: ${entityValueName} })}`,
		`${'\t'.repeat(level + 2)}<EntityView`,
		`${'\t'.repeat(level + 3)}entityType={EntityType.${entityType}}`,
		`${'\t'.repeat(level + 3)}entitySelector={${entityValueName}[EntityMetaKey.Selector]}`,
		`${'\t'.repeat(level + 2)}/>`,
		`${'\t'.repeat(level + 1)}{/snippet}`,
		`${'\t'.repeat(level)}</EntitiesList>`,
	]
}

const renderEntitiesReferenceSection = (
	entity: Entity,
	indexes: GenerationIndexes,
	section: RelationshipSection,
	fieldDefinition: EntityField,
	targetEntity: EntityType,
	query: string,
	component: string,
	level: number,
	fieldResourceBase: string,
	fieldReference: FieldReference
) => {
	const hrefFieldNames = unique((
		indexes.collectionRoutesBySourceField[
			collectionSourceFieldKey(entity.entityType, section.field, targetEntity)
		] ?? []
	).flatMap(({ params }) => Object.values(params)).flatMap((param) => expressionFieldPaths(param.value).flatMap((fieldPath) => (
		fieldPath[0] == null ? [] : [fieldPath[0]]
	))))
	const hrefNeedsResolvedEntity = hrefFieldNames.some((fieldName) => (
		!entity.selectors.some((selector) => selector.fields.includes(fieldName))
	))
	const hrefExpression = renderCollectionRouteValueExpression(
		entity,
		indexes,
		section.field,
		targetEntity,
		hrefNeedsResolvedEntity ? 'entity' : 'selection.entitySelector'
	)
	const titleLabel = section.label ?? labelForField(fieldDefinition)
	const resourceName = generatedIdentifier(`${section.id ?? routeCollectionIdForFieldReference(section.field)}-resource`)
	const resourceExpression = fieldProxyResourceExpression(fieldResourceBase, fieldReference, query)
	const titleExpression = section.titleField == null ?
		undefined
	:
		`String(${fieldExpression('entity', fieldNameForReference(section.titleField))} ?? ${emitTypeScript(titleLabel)})`
	const sectionAttributes = [
		renderSvelteAttribute(level + 1, 'countResource', `${resourceName}.count`),
		titleExpression == null ? `${'\t'.repeat(level + 1)}title=${emitTypeScript(titleLabel)}` : renderSvelteAttribute(level + 1, 'title', titleExpression),
		...(section.href != null ? [
			renderSvelteAttribute(level + 1, 'href', renderResolveExpression(section.href)),
		] : hrefExpression == null ? [] : [renderSvelteAttribute(level + 1, 'href', hrefExpression)]),
		...(section.list?.placeholderText == null ? [] : [`${'\t'.repeat(level + 1)}placeholderText=${emitTypeScript(section.list.placeholderText)}`]),
		...(section.props ?? []).map((prop) => `${'\t'.repeat(level + 1)}${prop.name}={${renderExpression(prop.value, {
			fields: 'selection.entitySelector',
		})}}`),
	].flatMap(lines)
	const sectionIdAttribute = lines(
		section.idExpression == null ?
			(
				section.id == null ?
					`${'\t'.repeat(level + 1)}id=${emitTypeScript(routeCollectionIdForFieldReference(section.field))}`
				:
					`${'\t'.repeat(level + 1)}id=${emitTypeScript(section.id)}`
			)
		:
			renderSvelteAttribute(level + 1, 'id', section.idExpression)
	)
	const defaultListAttributes = [
		...sectionAttributes,
		...((section.props ?? []).some(({ name }) => name === 'open') ? [] : [
			`${'\t'.repeat(level + 1)}open={true}`,
		]),
		...sectionIdAttribute,
	]
	const sectionLines = () => (
		isDefaultPluralViewComponent(indexes, targetEntity, component) ?
			renderDefaultEntitiesList(
				targetEntity,
				resourceName,
				defaultListAttributes,
				level
			)
		:
			[
				`${'\t'.repeat(level)}<${componentIdentifier(component)}`,
				renderSvelteAttribute(level + 1, 'selection', resourceName),
				...sectionAttributes,
				...sectionIdAttribute,
				`${'\t'.repeat(level)}/>`,
			].flatMap(lines)
	)

	const renderedSectionLines = section.titleField == null && !hrefNeedsResolvedEntity ?
		sectionLines().map((line) => indent(line, 3))
	:
		[
			`${'\t'.repeat(level + 3)}<ResourceBoundary`,
			...lines(renderSvelteAttribute(level + 4, 'resource', `selection(${renderQuery(undefined, unique([
				...(section.titleField == null ? [] : [section.titleField]),
				...hrefFieldNames,
			]))})`)),
			`${'\t'.repeat(level + 3)}>`,
			`${'\t'.repeat(level + 4)}{#snippet children(entity)}`,
			...sectionLines().map((line) => indent(line, 5)),
			`${'\t'.repeat(level + 4)}{/snippet}`,
			`${'\t'.repeat(level + 3)}</ResourceBoundary>`,
		]

	return [
		renderSvelteConst(level, resourceName, resourceExpression),
		`${'\t'.repeat(level)}<ResourceBoundary`,
		renderSvelteAttribute(level + 1, 'resource', resourceName),
		`${'\t'.repeat(level)}>`,
		`${'\t'.repeat(level + 1)}{#snippet children(entities)}`,
		`${'\t'.repeat(level + 2)}{#if entities.values.length > 0}`,
		...renderedSectionLines,
		`${'\t'.repeat(level + 2)}{/if}`,
		`${'\t'.repeat(level + 1)}{/snippet}`,
		`${'\t'.repeat(level)}</ResourceBoundary>`,
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
		return logicalExpression([
			`${filter.prop} == null`,
			logicalExpression([
				`${value}.unit === ${filter.prop}.unit`,
				`${value}.value === ${filter.prop}.value`,
			], '&&'),
		], '||')

	return logicalExpression([
		`${filter.prop} == null`,
		`${value} === ${filter.prop}`,
	], '||')
}

const generatePluralViewPlan = (entity: Entity, indexes: GenerationIndexes) => {
	const singularView = entitySingularView(entity)
	const summaryPlan = summaryPlanFor(entity, indexes)
	const pluralView: PluralView | undefined = entityPluralView(entity)
	const componentName = pluralComponentName(entity)
	const contentWarning = singularView?.contentWarning
	const entityValueName = camel(entity.entityType)
	const usesCustomPluralId = pluralViewName(entity) !== `${entity.entityType}s`
	const customPluralTitle = (
		pluralView?.title === sentenceStart(entityLabelPlural(entity)) ?
			undefined
		:
			pluralView?.title
	)
	const entityValuesName = camel(componentName.replace(/View$/, ''))
	const row = pluralView?.row
	const usesCustomRow = row != null
	const rowTitleItems = usesCustomRow ? viewItems(row.title) : summaryPlan.title.entries
	const rowValueItems = usesCustomRow ? viewItems(row.value) : summaryPlan.value.entries
	const rowAfterItems = usesCustomRow ? viewItems(row.HeadingAfter) : summaryPlan.headingAfter.entries
	const entityRoutes = indexes.entityRouteLinksByType[entity.entityType] ?? []
	const entityRouteFieldNames = unique(entityRoutes.flatMap((route) => [
		...(route.conditions ?? []).map(({ field }) => field),
		...Object.values(route.params).flatMap(({ value }) => expressionFieldPaths(value).flatMap(([field]) => field == null ? [] : [field])),
	]))
	const resolvedEntityRouteFieldNames = entityRoutes.length === 1 ?
		entityRouteFieldNames.filter((fieldName) => !entitySelectorOwnsField(entity, fieldName))
	:
		[]
	const usesResolvedEntityHref = resolvedEntityRouteFieldNames.length > 0
	const rowItems = usesCustomRow ?
		[
			...rowTitleItems,
			...rowValueItems,
			...rowAfterItems,
		]
	:
		summaryPlan.allEntries
	const rowQueryFields = [...new Map([
		...resolvedEntityRouteFieldNames,
		...rowItems,
	].flatMap((item) => itemFieldReferences(item)).concat(
		usesCustomRow ? [] : declarativeSummaryQueryFieldReferences(entity, indexes) ?? [],
		contentWarning == null ? [] : [
			contentWarning.sensitiveField,
			contentWarning.textField,
		]
	).map((fieldReference) => [
		fieldReferenceKey(fieldReference),
		fieldReference,
	])).values()]
	const rowProjectionPaths = [...new Map(rowQueryFields.flatMap((fieldReference) => (
		isProjectionFieldReference(fieldReference) ? [[
			fieldReference.slice(0, -1).join('.'),
			fieldReference.slice(0, -1),
		] as const] : []
	))).values()]
	const rowDisplayImports = mergeImports(rowQueryFields.flatMap((fieldReference) => {
		let fieldEntity = entity
		let fieldDefinition: EntityField | undefined
		const fieldPath = (
			isProjectionFieldReference(fieldReference) ?
				[fieldReference]
			:
				fieldReference.split('.')
		)
		for (const [index, fieldName] of fieldPath.entries()) {
			fieldDefinition = fieldDefinitionByReference(fieldEntity, fieldName, indexes)
			if (index === fieldPath.length - 1 || fieldDefinition?.entityType == null)
				break

			fieldEntity = indexes.entityByType[fieldDefinition.entityType]
		}
		const valueType = indexes.valueTypeById[fieldDefinition?.valueType ?? '']
		return emitImportObject(valueType?.displayImports)
	}))
	const sourceSelection = pluralView?.query?.sources
	const query = renderQuery(
		pluralView?.query?.selection ?? pluralView?.query,
		rowQueryFields.filter((fieldReference) => !isProjectionFieldReference(fieldReference)),
		sourceSelection == null ?
			undefined
		:
			`selection.sources ?? ${renderSourceSelectionExpression(sourceSelection)}`
	)
	const filters = pluralView?.filters ?? []
	const filterCondition = filters.length === 0 ?
		'true'
	: filters.length === 1 ?
		renderFilterCondition(filters[0], entityValueName)
	:
		logicalExpression(
			filters.map((filter) => renderFilterCondition(filter, entityValueName)),
			'&&'
		)
	const filteredEntityValuesExpression = filters.length === 0 ?
		`${entityValuesName}.values`
	:
		[
			`${entityValuesName}.values.filter(`,
			indent(`(${entityValueName}) => ${filterCondition}`),
			')',
		].join('\n')
	const modelTypeAnnotationTooltipMarkup = (
		pluralView?.TypeAnnotationTooltip != null ?
			renderRawLines(pluralView.TypeAnnotationTooltip.raw, 1)
		:
			[]
	)
	const selectedSourcesExpression = !Array.isArray(sourceSelection) && sourceSelection?.name != null && filters.length > 0 ?
		`${sourceSelectionFunctionName(sourceSelection)}(${emitObject(sourceSelectionConditionFields(sourceSelection).map((field, index) => [
			field ?? '',
			filters[index]?.prop ?? 'undefined',
		]))})`
		:
		undefined
	const renderedQuery = selectedSourcesExpression == null ? query : emitObject([
		['sources', selectedSourcesExpression],
	])
	const itemSelectorName = `${entityValueName}Selector`
	const itemFieldsName = `${entityValueName}Fields`
	const itemFieldsExpression = rowProjectionPaths.length === 0 ? entityValueName : itemFieldsName
	const rowHrefFieldPaths = pluralView?.rowHref == null ? [] : uniqueFieldPaths(
		Object.values(pluralView.rowHref.params).flatMap((value) => (
			expressionFieldPaths(value)
		))
	)
	const rowHrefCondition = entityPathConditions(
			indexes,
			entity.entityType,
			itemSelectorName,
			'selector',
			rowHrefFieldPaths
		).map((term) => term.expression).join(' && ')
	const rowHrefValueExpression = pluralView?.rowHref == null ?
		undefined
	:
		renderResolveExpression(
			pluralView.rowHref.route,
			Object.entries(pluralView.rowHref.params).map(([param, value]) => [
				param,
				renderPresentRouteParamExpression(value, {
					fields: itemSelectorName,
					entity,
					indexes,
				}),
			])
		)
	const rowHrefExpression = rowHrefValueExpression == null || rowHrefCondition === '' ?
		rowHrefValueExpression
	:
		`(\n\t${rowHrefCondition} ?\n\t\t${rowHrefValueExpression}\n\t:\n\t\tundefined\n)`
	const rowHrefImports = pluralView?.rowHref == null ?
		entityRouteImportSpecs(indexes, entity.entityType).map(({ from, names }) => [
			from,
			new Set(names),
		] as const)
	:
		[
			...Object.values(pluralView.rowHref.params)
				.reduce((imports, value) => expressionImports(value, imports), new Map<string, Set<string>>())
				.entries(),
		]
	const itemHrefName = `${entityValueName}Href`
	const routeHrefPlan = (
		pluralView?.rowHref == null ?
			entityRouteHrefPlan(
				indexes,
				entity,
				usesResolvedEntityHref ? entityValueName : itemSelectorName,
				'svelteConst',
				[
					entityValueName,
					itemFieldsName,
					itemHrefName,
					itemSelectorName,
					'selection',
				],
				usesResolvedEntityHref
			)
		:
			undefined
	)
	const hrefFieldBindings = routeHrefPlan?.fieldBindings ?? []
	const entityHrefExpression = rowHrefExpression ?? routeHrefPlan?.expression
	const itemHrefIsShared = entityHrefExpression != null && rowProjectionPaths.length > 1
	const directSummaryFieldExpression = (
		summaryEntity: Entity,
		fieldReference: string,
		resolvedFieldsExpression: string,
		entitySelectorExpression?: string,
		projectedFieldExpressionByReference = new Map<string, string>()
	) => projectedFieldExpressionByReference.get(fieldReference) ?? (
		entitySelectorExpression == null
		|| !entitySelectorFieldNames(summaryEntity).has(fieldReference) ?
			fieldExpression(resolvedFieldsExpression, fieldReference)
		:
			fieldExpression(entitySelectorExpression, fieldReference)
	)
	const renderDirectSummaryItemsExpression = (
		summaryEntity: Entity,
		viewEntries: readonly _ViewItem[],
		entityFieldsExpression: string,
		visitedEntityTypes = new Set<EntityType>(),
		entitySelectorExpression?: string,
		projectedFieldExpressionByReference = new Map<string, string>(),
		coercePrimitive = true
	) => renderJoinedItemsExpression(
			summaryEntity,
			indexes,
			viewEntries,
			entityFieldsExpression,
			' ',
			true,
			(fieldDefinition, referenceExpression) => {
				if (
					fieldDefinition.entityType == null
					|| visitedEntityTypes.has(fieldDefinition.entityType)
				)
					return undefined

				const targetEntity = indexes.entityByType[fieldDefinition.entityType]
				if (targetEntity == null)
					throw new Error(`${summaryEntity.entityType}.${fieldDefinition.name} summary target is missing ${fieldDefinition.entityType}`)

				const summaryExpression = renderDirectSummaryTitleExpression(
					targetEntity,
					referenceExpression,
					new Set([...visitedEntityTypes, summaryEntity.entityType]),
					entitySelectorExpression != null && entitySelectorOwnsField(summaryEntity, fieldDefinition.name) ?
						fieldExpression(entitySelectorExpression, fieldDefinition.name)
					:
						undefined
				)
				return fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne ?
					`${referenceExpression} == null ? '' : ${summaryExpression}`
				:
					summaryExpression
			},
			(fieldReference, resolvedFieldsExpression) => directSummaryFieldExpression(
				summaryEntity,
				fieldReferenceKey(fieldReference),
				resolvedFieldsExpression,
				entitySelectorExpression,
				projectedFieldExpressionByReference
			),
			coercePrimitive
		)
	const renderDirectSummaryTitleExpression = (
		summaryEntity: Entity,
		entityFieldsExpression: string,
		visitedEntityTypes = new Set<EntityType>(),
		entitySelectorExpression?: string
	) => {
		const directSummaryPlan = summaryPlanFor(summaryEntity, indexes)
		const directSummarySerial = directSummaryPlan.serial
		return renderFirstDeclaredExpression([
			directSummarySerial == null ? undefined : renderSerialTextExpression(
				summaryEntity,
				indexes,
				directSummarySerial,
				entityFieldsExpression,
				(fieldReference, resolvedFieldsExpression) => directSummaryFieldExpression(
					summaryEntity,
					fieldReferenceKey(fieldReference),
					resolvedFieldsExpression,
					entitySelectorExpression
				)
			),
			renderDirectSummaryItemsExpression(
				summaryEntity,
				directSummaryPlan.title.entries,
				entityFieldsExpression,
				visitedEntityTypes,
				entitySelectorExpression
			),
			renderDirectSummaryItemsExpression(
				summaryEntity,
				directSummaryPlan.titleFallback.entries,
				entityFieldsExpression,
				visitedEntityTypes,
				entitySelectorExpression
			),
			emitTypeScript(displayLabel(entityLabel(summaryEntity))),
		])
	}
	const itemSelectionName = 'selection'
	const directSummaryRowMarkup = (
		level: number,
		projectionPath?: readonly string[],
		fieldsExpression = itemFieldsExpression,
		projectedFieldExpressionByReference = new Map<string, string>(),
		entitySelectorExpression = itemSelectorName
	) => {
		const entriesForProjection = (viewEntries: readonly _ViewItem[]) => (
			projectionPath == null ?
				viewEntries
			:
				viewEntries.filter((viewEntry) => itemFieldReferences(viewEntry).every((fieldReference) => (
					!isProjectionFieldReference(fieldReference)
					|| (
						fieldReference.length === projectionPath.length + 1
						&& projectionPath.every((facetName, index) => fieldReference[index] === facetName)
					)
				)))
		)
		const directSummarySerial = summaryPlan.serial
		const directSummaryTitleEntries = entriesForProjection(rowTitleItems)
		const directSummaryValueEntries = entriesForProjection(rowValueItems)
		const directSummaryAfterEntries = entriesForProjection(rowAfterItems)
		const directSummaryTitleItemExpression = renderDirectSummaryItemsExpression(
			entity,
			directSummaryTitleEntries,
			fieldsExpression,
			new Set(),
			entitySelectorExpression,
			projectedFieldExpressionByReference,
			!viewEntriesRenderRequiredScalar(entity, indexes, directSummaryTitleEntries)
		)
		const directSummaryTitleExpression = (
			directSummarySerial == null
			&& viewEntriesRenderRequiredScalar(entity, indexes, directSummaryTitleEntries) ?
				directSummaryTitleItemExpression
			:
				renderFirstDeclaredExpression([
					directSummarySerial == null ? undefined : renderSerialTextExpression(
						entity,
						indexes,
						directSummarySerial,
						fieldsExpression,
						(fieldReference, resolvedFieldsExpression) => directSummaryFieldExpression(
							entity,
							fieldReferenceKey(fieldReference),
							resolvedFieldsExpression,
							entitySelectorExpression,
							projectedFieldExpressionByReference
						)
					),
					directSummaryTitleItemExpression,
					renderDirectSummaryItemsExpression(
						entity,
						entriesForProjection(summaryPlan.titleFallback.entries),
						fieldsExpression,
						new Set(),
						entitySelectorExpression,
						projectedFieldExpressionByReference
					),
					emitTypeScript(displayLabel(entityLabel(entity))),
				])
		)
		const directSummaryValueExpression = renderDirectSummaryItemsExpression(
			entity,
			directSummaryValueEntries,
			fieldsExpression,
			new Set(),
			entitySelectorExpression,
			projectedFieldExpressionByReference,
			directSummaryValueEntries.length !== 1
		)
		const directSummaryAfterExpression = renderDirectSummaryItemsExpression(
			entity,
			directSummaryAfterEntries,
			fieldsExpression,
			new Set(),
			entitySelectorExpression,
			projectedFieldExpressionByReference,
			directSummaryAfterEntries.length !== 1
		)
		const directSummaryAfterMarkup = directSummaryAfterExpression === 'undefined' ?
			[]
		: directSummaryAfterExpression.includes('\n') ?
			[
				'',
				`${'\t'.repeat(level + 1)}{#snippet HeadingAfter()}`,
				`${'\t'.repeat(level + 2)}<span data-text="annotation">`,
				renderSvelteTextOrExpression(level + 3, directSummaryAfterExpression),
				`${'\t'.repeat(level + 2)}</span>`,
				`${'\t'.repeat(level + 1)}{/snippet}`,
			]
		:
			[
				'',
				`${'\t'.repeat(level + 1)}{#snippet HeadingAfter()}`,
				`${'\t'.repeat(level + 2)}<span data-text="annotation">${renderSvelteTextOrExpression(0, directSummaryAfterExpression)}</span>`,
				`${'\t'.repeat(level + 1)}{/snippet}`,
			]
		const directSummaryChildMarkup = trimBlankLineEdges([
			...(directSummaryTitleExpression === emitTypeScript(entityLabel(entity)) ?
				[]
			:
				renderSvelteSnippet(level + 1, 'Title()', [renderSvelteTextOrExpression(0, directSummaryTitleExpression)])),
			...(directSummaryValueExpression === 'undefined' ? [] : [
				'',
				...renderSvelteSnippet(level + 1, 'Value()', [renderSvelteTextOrExpression(0, directSummaryValueExpression)]),
			]),
			...directSummaryAfterMarkup,
		])

		const lines = [
			`${'\t'.repeat(level)}<EntityView`,
			`${'\t'.repeat(level + 1)}entityType={EntityType.${entity.entityType}}`,
			`${'\t'.repeat(level + 1)}entitySelector={${entitySelectorExpression}}`,
			...(entityHrefExpression == null ? [] : [
				renderSvelteAttribute(level + 1, 'href', itemHrefIsShared ? itemHrefName : entityHrefExpression),
			]),
			...(directSummaryChildMarkup.length === 0 ?
				[`${'\t'.repeat(level)}/>`]
			:
				[
					`${'\t'.repeat(level)}>`,
					...directSummaryChildMarkup,
					`${'\t'.repeat(level)}</EntityView>`,
				]),
		]
		return {
			lines,
			hasCustomContent: directSummaryChildMarkup.length > 0,
			selectorReferenceCount: [
				entitySelectorExpression,
				...(entityHrefExpression == null || itemHrefIsShared ? [] : [entityHrefExpression]),
				...(directSummaryTitleExpression === emitTypeScript(entityLabel(entity)) ? [] : [directSummaryTitleExpression]),
				...(directSummaryValueExpression === 'undefined' ? [] : [directSummaryValueExpression]),
				...(directSummaryAfterExpression === 'undefined' ? [] : [directSummaryAfterExpression]),
			].reduce((count, expression) => (
				count + typeScriptExpressionReferenceCount(expression, itemSelectorName)
			), 0),
		}
	}
	const directSummaryRow = directSummaryRowMarkup(2)
	const directSummarySelectorReferenceCount = directSummaryRow.selectorReferenceCount
	const directSummaryRenderedLines = (
		directSummarySelectorReferenceCount === 1 ?
			directSummaryRowMarkup(
				2,
				undefined,
				itemFieldsExpression,
				new Map(),
				`${entityValueName}[EntityMetaKey.Selector]`
			).lines
		:
			directSummaryRow.lines
	)
	const imports = mergeImports([
		...rowHrefImports.map(([from, names]) => ({
			from,
			names: [...names],
		})),
		...rowDisplayImports,
		...emitImportObject(pluralView?.imports),
	])
	const script = [
		'// Types/constants',
		...(entityHrefExpression != null ? [
			`import { resolve } from '$app/paths'`,
		] : []),
		'import EntitiesList, { type EntityListViewProps } from \'$/components/EntitiesList.svelte\'',
		'import { EntityMetaKey } from \'$/schema/$schema.ts\'',
		'import { EntityType } from \'$/schema/EntityType.ts\'',
		...(filters.length === 0 ? [] : ['import type { RegisteredEntitySelector } from \'$/schema/index.ts\'']),
		...imports.map(emitImport),
		...(!Array.isArray(sourceSelection) && sourceSelection?.name != null && selectedSourcesExpression != null ? [
			`import ${sourceSelectionFunctionName(sourceSelection)} from '${sourceSelectionModulePath(sourceSelection)}'`,
		] : []),
		...(typeScriptExpressionReferencesBinding(renderedQuery, 'Source') ? ['import { Source } from \'$/sources/Source.ts\''] : []),
		'',
		'',
		...(rowProjectionPaths.length === 0 ? [] : [
			'// Context',
			'import { select } from \'$/routes/+layout.svelte\'',
			'',
			'',
		]),
		'// State',
		'let {',
		'\tselection,',
		...(customPluralTitle == null ? [] : [
			`\ttitle = ${emitTypeScript(customPluralTitle)},`,
		]),
		...(pluralView?.placeholderText == null ? [] : [
			`\tplaceholderText = ${emitTypeScript(pluralView.placeholderText)},`,
		]),
		...(pluralView?.emptyText == null ? [] : [
			`\temptyText = ${emitTypeScript(pluralView.emptyText)},`,
		]),
		'\topen = $bindable(true),',
		...(usesCustomPluralId ? [
			`\tid = ${emitTypeScript(`${pluralViewName(entity)}-list`)},`,
		] : []),
		...filters.map((filter) => `\t${filter.prop},`),
		'\t...EntitiesListProps',
		...(filters.length === 0 ? [
			`}: EntityListViewProps<EntityType.${entity.entityType}> = $props()`,
		] : [
			'}: EntityListViewProps<',
			`\tEntityType.${entity.entityType},`,
			'\t{',
			...filters.map((filter) => (
				`\t\t${filter.prop}?: RegisteredEntitySelector<EntityType.${entity.entityType}>${filter.selectorPath
					.split('.')
					.map((fieldName) => `[${emitTypeScript(fieldName)}]`)
					.join('')}`
			)),
			'\t}',
			'> = $props()',
		]),
		'',
		'',
		'// Components',
		...(rowProjectionPaths.length === 0 ? [] : ['import ProjectionBoundary from \'$/components/ProjectionBoundary.svelte\'']),
		...(rowProjectionPaths.length === 0 ? [] : ['import ResourceBoundary from \'$/components/ResourceBoundary.svelte\'']),
		'import EntityView from \'$/components/EntityView.svelte\'',
	]
	const markup = [
		...(modelTypeAnnotationTooltipMarkup.length === 0 ? [] : [
			...renderSvelteSnippet(0, 'ModelTypeAnnotationTooltip()', modelTypeAnnotationTooltipMarkup),
			'',
		]),
		'<EntitiesList',
		'\t{...EntitiesListProps}',
		`\tentityType={EntityType.${entity.entityType}}`,
		...(usesCustomPluralId ? ['\t{id}'] : []),
		...(customPluralTitle == null ? [] : ['\t{title}']),
		'\tbind:open',
		...(modelTypeAnnotationTooltipMarkup.length === 0 ? [] : [
			'\tTypeAnnotationTooltip={ModelTypeAnnotationTooltip}',
		]),
		renderSvelteAttribute(
			1,
			'resource',
			renderedQuery === '{}' ?
				'selection()'
			:
				`selection(${renderedQuery})`
		),
		...(filters.length === 0 ? [] : [
			renderSvelteAttribute(1, 'getResourceItems', `(${entityValuesName}) => ${filteredEntityValuesExpression}`),
		]),
		...(pluralView?.placeholderText == null ? [] : ['\t{placeholderText}']),
		...(pluralView?.emptyText == null ? [] : ['\t{emptyText}']),
		'>',
		`\t{#snippet Item({ item: ${entityValueName} })}`,
		...(rowProjectionPaths.length > 0 || directSummarySelectorReferenceCount > 1 || hrefFieldBindings.some(({ expression }) => typeScriptExpressionReferencesBinding(expression, itemSelectorName)) ? [
			`\t\t{@const ${itemSelectorName} = ${entityValueName}[EntityMetaKey.Selector]}`,
		] : []),
		...hrefFieldBindings.map(({ expression, name }) => (
			renderSvelteConst(2, name, expression)
		)),
		...(itemHrefIsShared ? [
			renderSvelteConst(2, itemHrefName, entityHrefExpression),
		] : []),
		...(rowProjectionPaths.length === 0 ? [
			...directSummaryRenderedLines,
		] : [
			`\t\t{@const ${itemSelectionName} = select(EntityType.${entity.entityType}, ${itemSelectorName})}`,
			...rowProjectionPaths.flatMap((projectionPath, projectionIndex) => {
				const projectionName = `${entityValueName}Projection${projectionIndex}`
				const projectionFieldReferences = rowQueryFields.filter((fieldReference) => (
					isProjectionFieldReference(fieldReference)
					&& fieldReference.length === projectionPath.length + 1
					&& projectionPath.every((facetName, index) => fieldReference[index] === facetName)
				))
				const projectedFieldExpressionByReference = new Map(projectionFieldReferences.map((
					fieldReference,
					fieldIndex
				) => [
					fieldReferenceKey(fieldReference),
					`${camel(projectionPath.join('-'))}${pascal(fieldReference[fieldReference.length - 1] ?? '')}${fieldIndex}`,
				]))
				const projectionSelectionExpression = `${itemSelectionName}${projectionPath.map(propertyAccess).join('')}`
				const summaryLines = directSummaryRowMarkup(
					4 + projectionFieldReferences.length * 2,
					projectionPath,
					entityValueName,
					projectedFieldExpressionByReference
				).lines
				const projectionContentLines = projectionFieldReferences.reduceRight((
					contentLines,
					fieldReference,
					fieldIndex
				) => {
					const level = 4 + fieldIndex * 2
					const fieldName = fieldReference[fieldReference.length - 1] ?? ''
					return [
						`${'\t'.repeat(level)}<ResourceBoundary`,
						renderSvelteAttribute(level + 1, 'resource', `${projectionName}${propertyAccess(fieldName)}`),
						`${'\t'.repeat(level)}>`,
						`${'\t'.repeat(level + 1)}{#snippet children(${projectedFieldExpressionByReference.get(fieldReferenceKey(fieldReference))})}`,
						...contentLines,
						`${'\t'.repeat(level + 1)}{/snippet}`,
						`${'\t'.repeat(level)}</ResourceBoundary>`,
					]
				}, summaryLines)
				return [
					'\t\t<ProjectionBoundary',
					renderSvelteAttribute(3, 'resource', projectionSelectionExpression),
					'\t\t>',
					`\t\t\t{#snippet Applicable(${projectionName})}`,
					...projectionContentLines,
					'\t\t\t{/snippet}',
					'\t\t</ProjectionBoundary>',
				]
			}),
		]),
		'\t{/snippet}',
		'</EntitiesList>',
	]
	// Consumers inline only the semantic zero-customization wrapper. This fact is
	// computed from the same plan that emits the file, without rendering/parsing a
	// second copy of every plural view merely to compare formatted output.
	const isExactDefault = (
		entityHrefExpression == null
		&& renderedQuery === '{}'
		&& filters.length === 0
		&& modelTypeAnnotationTooltipMarkup.length === 0
		&& !usesCustomPluralId
		&& customPluralTitle == null
		&& pluralView?.placeholderText == null
		&& pluralView?.emptyText == null
		&& rowProjectionPaths.length === 0
		&& imports.length === 0
		&& hrefFieldBindings.length === 0
		&& !directSummaryRow.hasCustomContent
	)

	return {
		file: svelteFile(
			viewModulePath(componentName).replace(/^\$\//, 'src/'),
			{
				script,
				markup,
			}
		),
		isExactDefault,
	}
}

// SvelteKit route output
//
// Physical file plans are compiled before rendering so route emitters only format
// already-validated mappings, selections, layouts, and collection pages.
const compilePhysicalRouteFilePlans = (renderEntries: readonly RouteRenderEntry[]) => renderEntries.flatMap((entry) => entry.files.flatMap((routeFile) => {
	const routeDirectory = entry.routePath === '' ? 'src/routes' : `src/routes/${entry.routePath}`
	const routePath = `${routeDirectory}/${routeFileName(routeFile.kind)}`
	if (routeFile.kind === RouteFileKind.PageModule) {
		if (routeFile.sharedLayout === true)
			return [{
				path: `${routeDirectory}/+layout.ts`,
				appRoutePath: entry.routePath,
				semanticNodeId: entry.internalPath,
				routeFile,
			}]
		if ((routeFile.mappings?.length ?? 0) > 1 || routeNeedsPageModule(routePath, routeFile, renderEntries))
			return [{
				path: routePath,
				appRoutePath: entry.routePath,
				semanticNodeId: entry.internalPath,
				routeFile,
			}]

		return []
	}
	if (routeFile.kind === RouteFileKind.Page) {
		const pageModule = entry.files.find((file) => file.kind === RouteFileKind.PageModule)
		const inheritedMappings = (routeFile.mappings?.length ?? 0) === 0 && (pageModule?.mappings?.length ?? 0) > 0
		const generatedPageModule = pageModule != null && (
			pageModule.sharedLayout === true
			|| (pageModule.mappings?.length ?? 0) > 1
			|| routeNeedsPageModule(routePath.replace(/\+page\.svelte$/, '+page.ts'), pageModule, renderEntries)
		)
		return [{
			path: routePath,
			appRoutePath: entry.routePath,
			semanticNodeId: entry.internalPath,
			routeFile: inheritedMappings ? {
				...routeFile,
				mappings: pageModule?.mappings,
			} : routeFile,
			generatedPageModule,
		}]
	}

	return [{
		path: routePath,
		appRoutePath: entry.routePath,
		semanticNodeId: entry.internalPath,
		routeFile,
	}]
}))

const generateRouteFiles = (
	plan: CompiledPhysicalRouteFileFacts,
	indexes: GenerationIndexes
) => (
		plan.routeFile.kind === RouteFileKind.PageModule ?
			[generatePageModuleFile(plan.path, plan.routeFile, indexes)]
		: plan.routeFile.kind === RouteFileKind.Layout ?
			[generateLayoutFile(plan.path, plan.routeFile)]
	:
		[generatePageFile(
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
	routeFile.mappings?.some((mapping) => mapping.projectionRouteParam != null) === true
		&& !routeProjectionOwnedByAncestor(routePath, routeFile, renderEntries)
)

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

	const href = publicRouteId(routePath
		.replace(/^src\/routes\//, '')
		.replace(/\/\+(?:page|layout)\.ts$/, ''))
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

const logicalExpression = (
	expressions: readonly string[],
	operator: '&&' | '||'
) => {
	const inlineExpression = expressions.join(` ${operator} `)
	if (inlineExpression.length <= 120 && !inlineExpression.includes('\n'))
		return `(${inlineExpression})`

	return `(\n${expressions.map((expression, index) => (
		indent(expression).replace(/^\t/, index === 0 ? '\t' : `\t${operator} `)
	)).join('\n')}\n)`
}

const projectionConditionExpression = (condition: _AppFacetCondition, entityExpression: string): string => {
	if ('all' in condition)
		return logicalExpression(
			condition.all.map((child) => projectionConditionExpression(child, entityExpression)),
			'&&'
		)

	const field = fieldExpression(entityExpression, facetConditionField(condition))
	if ('is' in condition)
		return `${field} === ${emitTypeScript(condition.is)}`
	if ('isOneOf' in condition)
		return `${emitArray(condition.isOneOf.map(emitTypeScript))}.includes(${field})`

	return logicalExpression([
		`${field} !== undefined`,
		`${field}.some((value: string | number | boolean | null) => value === ${emitTypeScript(condition.includes)})`,
	], '&&')
}

const routeMappingContext = (
	routePath: string,
	indexes: GenerationIndexes,
	mapping: SelectorRouteMapping
) => {
	const networkParam = mapping.projectionRouteParam
	const fieldsExpression = emitObject(mapping.fields.map((field) => [
		field.field,
		renderExpression(field.value, {
			params: 'params',
			pageSelector: 'parentData.selector',
		}),
	]))
	const usesParentSelector = mapping.fields.some((field) => expressionUsesKind(field.value, 'pageSelector'))
	if (networkParam != null && !usesParentSelector)
		throw new Error(`${routePath} projects a network facet without inheriting its network selector`)
	const projectionEntity = mapping.projection == null ? undefined : indexes.entityByType[mapping.projection.entityType]
	if (mapping.projection != null && projectionEntity == null)
		throw new Error(`${routePath} references missing projection entity ${mapping.projection.entityType}`)
	const projectionCondition = (() => {
		const projectionConditions = mapping.projection == null || projectionEntity == null ?
			[]
		:
			projectionFacetConditions(
				projectionEntity,
				indexes,
				mapping.projection.facetPath
			)
		const conditions = [
			...projectionConditions,
			...(mapping.when == null ? [] : [mapping.when]),
		]
		const uniqueConditions = [...new Map(
			conditions.map((condition) => [JSON.stringify(condition), condition])
		).values()]

		return uniqueConditions.length < 2 ? uniqueConditions[0] : { all: uniqueConditions }
	})()
	const guardExpressions = [
		...(networkParam == null || projectionCondition == null ? [] : [
			projectionConditionExpression(projectionCondition, 'parentData.projectionNetwork'),
		]),
		...mapping.routeParamMatchers.map(({ param, matchers }) => (
			matchers.length === 1 ?
				`match${pascal(matchers[0] ?? '')}(params.${param})`
			:
				logicalExpression(
					matchers.map((matcher) => `match${pascal(matcher)}(params.${param})`),
					'||'
				)
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
		guardExpression: guardExpressions.length === 0 ? undefined : logicalExpression(guardExpressions, '&&'),
		projection: {
			selectorGuardExpression: (mapping.projection?.entityType ?? mapping.entityType) !== mapping.entityType || projectionCondition == null ?
				undefined
			:
				projectionConditionExpression(projectionCondition, `${camel(mapping.entityType)}${mapping.selectorName}Selector`),
		},
	}
}

const generatePageModuleFile = (routePath: string, routeFile: RouteFile, indexes: GenerationIndexes) => {
	const mappings = routeFile.mappings ?? []
	if (mappings.length === 0)
		throw new Error(`${routePath} page module has no selector mappings`)

	if (mappings.length > 1) {
		const contexts = mappings.map((mapping) => routeMappingContext(
			routePath,
			indexes,
			mapping
		))
		const usesParentSelector = contexts.some((context) => context.usesParentSelector)
		const routeParams = routeParamNames(routeId(routePath))
		const projectionNetworkParam = (
			contexts.length === 2
			&& contexts.every((context) => context.entityType === EntityType.Network)
			&& contexts.some((context) => context.mapping.selectorName === 'Caip2')
			&& contexts.some((context) => context.mapping.selectorName === 'Slug')
			&& routeParams.length === 1 ?
				routeParams[0]
			:
				undefined
		)

		return tsFile(
			routePath,
			{
				imports: mergeImports([
					{
						from: '@sveltejs/kit',
						names: ['error'],
					},
					...(projectionNetworkParam == null ? [] : [{
						from: '$/constants/Network.ts',
						names: ['networkByCaip2', 'networkBySlug'],
					}]),
					{
						from: 'arktype',
						names: ['type as arktype'],
					},
					{
						from: '$/schema/$schema.ts',
						names: ['parseEntitySelector'],
						typeNames: ['EntitySelectorForSelectorName'],
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
						...importSpecsFromMap(context.imports),
						{
							from: schemaModulePath(context.entityType),
							defaultName: context.entitySchemaName,
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
					'\tconst routeCandidates: (',
					...contexts.flatMap((context) => [
						'\t\t| {',
						`\t\t\treadonly entityType: EntityType.${context.entityType}`,
						`\t\t\treadonly selectorName: ${emitTypeScript(context.mapping.selectorName)}`,
						'\t\t\treadonly selector: EntitySelectorForSelectorName<',
						'\t\t\t\ttypeof schema,',
						`\t\t\t\tEntityType.${context.entityType},`,
						`\t\t\t\t${emitTypeScript(context.mapping.selectorName)}`,
						'\t\t\t>',
						'\t\t}',
					]),
					'\t)[] = []',
					'',
					...contexts.flatMap((context) => {
						const selectorCondition = logicalExpression([
							`!(${context.selectorVariableName} instanceof arktype.errors)`,
							...(context.projection.selectorGuardExpression == null ? [] : [context.projection.selectorGuardExpression]),
						], '&&')

						return [
						...(context.guardExpression == null ? [] : [indent(`if ${context.guardExpression} {`)]),
						`\t${context.guardExpression == null ? '' : '\t'}const ${context.selectorVariableName} = parseEntitySelector(`,
						`\t${context.guardExpression == null ? '' : '\t'}\tschema,`,
						`\t${context.guardExpression == null ? '' : '\t'}\t${context.entitySchemaName},`,
						...commaTerminatedExpressionLines(context.selectorFieldsExpression, context.guardExpression == null ? 2 : 3),
						`\t${context.guardExpression == null ? '' : '\t'}\t${emitTypeScript(context.mapping.selectorName)}`,
						`\t${context.guardExpression == null ? '' : '\t'})`,
						indent(`if ${selectorCondition}`, context.guardExpression == null ? 1 : 2),
						indent(`routeCandidates.push(${emitObject([
							['entityType', `EntityType.${context.entityType}`],
							['selectorName', emitTypeScript(context.mapping.selectorName)],
							['selector', context.selectorVariableName],
						])})`, context.guardExpression == null ? 2 : 3),
						...(context.guardExpression == null ? [] : ['\t}']),
						'',
						]
					}),
					'\tif (routeCandidates.length === 0)',
					`\t\terror(404, 'Route selector not applicable')`,
					'',
					'\tif (routeCandidates.length > 1)',
					`\t\terror(500, 'Route selector is ambiguous')`,
					'',
					...(projectionNetworkParam == null ? [] : [
						'\tconst projectionNetwork = (',
						`\t\tObject.getOwnPropertyDescriptor(networkByCaip2, decodeURIComponent(params.${projectionNetworkParam}))?.value`,
						`\t\t?? Object.getOwnPropertyDescriptor(networkBySlug, params.${projectionNetworkParam})?.value`,
						'\t)',
						'\tif (projectionNetwork == null)',
						`\t\terror(404, 'Network projection context not found')`,
						'',
					]),
					`\treturn ${projectionNetworkParam == null ? 'routeCandidates[0]' : '{ ...routeCandidates[0], projectionNetwork }'}`,
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
			:
				renderExpression(context.mapping.title, {
					params: 'params',
					fields: context.selectorVariableName,
				}),
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
				{
					from: 'arktype',
					names: ['type as arktype'],
				},
				...context.routeParamMatcherImports,
				...importSpecsFromMap(context.imports),
				{
					from: '$/schema/$schema.ts',
					names: ['parseEntitySelector'],
				},
				{
					from: schemaModulePath(context.entityType),
					defaultName: context.entitySchemaName,
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
				...(context.guardExpression == null ? [] : [
					indent(`if (!${context.guardExpression})`),
					`\t\terror(404, 'Route mapping not applicable')`,
					'',
				]),
				`\tconst ${context.selectorVariableName} = parseEntitySelector(`,
				'\t\tschema,',
				`\t\t${context.entitySchemaName},`,
				...commaTerminatedExpressionLines(context.selectorFieldsExpression, 2),
				`\t\t${emitTypeScript(context.mapping.selectorName)}`,
				'\t)',
				`\tif (${context.selectorVariableName} instanceof arktype.errors)`,
				`\t\terror(404, ${emitTypeScript(`Invalid ${context.entityType} selector`)})`,
				...(context.projection.selectorGuardExpression == null ? [] : [
					'',
					indent(`if (!${logicalExpression([context.projection.selectorGuardExpression], '&&')})`),
					`\t\terror(404, 'Route projection not applicable')`,
				]),
				'',
				'\treturn ' + indent(emitObject(returnEntries)).trimStart(),
				'}',
			],
		}
	)
}

type CollectionMapping = NonNullable<RouteFile['collections']>[number]

const collectionSelectionPlan = (
	routePath: string,
	indexes: GenerationIndexes,
	collection: CollectionMapping,
	sourceEntity: Entity,
	sourceSelection: string
) => {
	const pathPlan = collectionReferencePathPlan(
		sourceEntity,
		indexes,
		collection.source.path,
		`${routePath} collection`
	)
	const pathSteps = [
		...pathPlan.steps,
		{
			entity: pathPlan.terminalEntity,
			projectionPath: pathPlan.terminalProjectionPath,
			field: pathPlan.terminalField,
		},
	]
	const rootStep = pathSteps[0]
	if (rootStep == null)
		throw new Error(`${routePath} collection has no reference path`)

	const rootFieldName = collection.source.path[rootStep.projectionPath.length] ?? rootStep.field.name
	const rootFieldReference: FieldReference = rootStep.projectionPath.length === 0 ?
		rootFieldName
		:
		[
			...rootStep.projectionPath,
			rootFieldName,
		]
	const stepQueries = pathSteps.map((_step, index) => renderQuery(
		index === pathSteps.length - 1 ? collection.query : undefined,
		[]
	))
	const selectionFrom = (root: string, steps: typeof pathSteps, queries: typeof stepQueries) => steps.reduce(
		(expression, step, index) => fieldResourceExpression(
			expression,
			step.projectionPath.length === 0 ?
				step.field.name
			:
				[
					...step.projectionPath,
					step.field.name,
				],
			queries[index]
		),
		root
	)
	const rootSelection = fieldResourceExpression(
		sourceSelection,
		rootFieldReference,
		stepQueries[0]
	)
	const selection = selectionFrom(rootSelection, pathSteps.slice(1), stepQueries.slice(1))
	const projectionStepIndex = pathSteps.findIndex((step) => step.projectionPath.length > 0)
	const sharedRootSteps = projectionStepIndex < 0 ? [rootStep] : pathSteps.slice(0, projectionStepIndex)
	const selectionFromSharedRoot = (sharedRoot: string) => selectionFrom(
		sharedRoot, pathSteps.slice(sharedRootSteps.length), stepQueries.slice(sharedRootSteps.length)
	)

	return {
		isRelationshipPath: pathSteps.length > 1,
		selection,
		sharedRootSelection: sharedRootSteps.slice(1).reduce(
			(expression, step) => fieldResourceExpression(
				expression,
				step.field.name
			),
			rootSelection
		),
		selectionFromSharedRoot,
	}
}

const pageContextSection = ['', '', '// Context'] as const
const pageStateSection = ['', '', '// State'] as const
const pageComponentsSection = ['', '', '// Components'] as const
const renderPagePropsState = (props: readonly string[]) => [
	'let {',
	...props.map((prop) => `\t${prop},`),
	'}: PageProps = $props()',
]

const generateMultiCollectionPageFile = (
	routePath: string,
	appRoutePath: string,
	routeFile: RouteFile,
	indexes: GenerationIndexes
) => {
	const unboundContexts = (routeFile.collections ?? []).map((collection, index) => {
		const sourceEntity = indexes.entityByType[collection.source.entity]
		const collectionEntity = indexes.entityByType[collection.entity]
		if (sourceEntity == null || collectionEntity == null)
			throw new Error(`${routePath} collection mapping references a missing entity`)

		const sourceSelection = `select(EntityType.${collection.source.entity}, ${renderExpression(collection.source.selector, {
			pageSelector: 'data.selector',
			fields: 'data.selector',
			params: 'params',
		})})`
		const {
			isRelationshipPath,
			selection,
			sharedRootSelection,
			selectionFromSharedRoot,
		} = collectionSelectionPlan(
			routePath,
			indexes,
			collection,
			sourceEntity,
			sourceSelection
		)
		const componentFile = collection.page?.view?.component
			?? pluralComponentName(collectionEntity)
		return {
			collection,
			componentFile,
			inlinesDefaultCollectionView: isDefaultPluralViewComponent(
				indexes,
				collection.entity,
				componentFile
			),
			sharedRootSelection,
			selection,
			selectionFromSharedRoot,
			selectionBinding: `collection${index}Selection`,
			isRelationshipPath,
			dispatchCondition: collection.source.routeEntityType == null ?
				undefined
			:
				`data.entityType === EntityType.${collection.source.routeEntityType}`,
		}
	})
	const sharedRootBindingBySelection = new Map(
		[...Map.groupBy(unboundContexts, ({ sharedRootSelection }) => sharedRootSelection)]
			.filter(([, contexts]) => contexts.length > 1)
			.map(([sharedRootSelection], index) => [sharedRootSelection, `collectionRoot${index}Selection`])
	)
	const contexts = unboundContexts.map((context) => {
		const sharedRootBinding = sharedRootBindingBySelection.get(context.sharedRootSelection)
		if (sharedRootBinding == null)
			return context

		return {
			...context,
			selection: context.selectionFromSharedRoot(sharedRootBinding),
		}
	})
	const usesData = contexts.some(({ collection }) => expressionUsesKind(collection.source.selector, 'pageSelector'))
	const pageRouteParams = routeParamNames(routeId(appRoutePath))
	const usesParams = (
		pageRouteParams.length > 0
		|| contexts.some(({ collection }) => expressionUsesKind(collection.source.selector, 'param'))
	)
	const collectionHrefExpression = renderResolveExpression(
		routeId(appRoutePath),
		pageRouteParams.map((param) => [param, `params.${param}`])
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
				...(contexts.some(({ selection }) => typeScriptExpressionReferencesBinding(selection, 'EntityProxyField')) ? [
					'import { EntityProxyField } from \'$/client/$proxy.svelte.ts\'',
				] : []),
				...(contexts.some(({ inlinesDefaultCollectionView }) => inlinesDefaultCollectionView) ? [
					'import { EntityMetaKey } from \'$/schema/$schema.ts\'',
				] : []),
				'import { EntityType } from \'$/schema/EntityType.ts\'',
				...mergeImports(contexts.flatMap(({ collection }) => (
					importSpecsFromMap(expressionImports(collection.source.selector))
				))).map(emitImport),
				...(contexts.some(({ selection }) => typeScriptExpressionReferencesBinding(selection, 'Source')) ? [
					'import { Source } from \'$/sources/Source.ts\'',
				] : []),
				...pageContextSection,
				'import { resolve } from \'$app/paths\'',
				'import { select } from \'$/routes/+layout.svelte\'',
				...pageStateSection,
				...(usesData || usesParams ? renderPagePropsState([
					...(usesData ? ['data'] : []),
					...(usesParams ? ['params'] : []),
				]) : []),
				...(pageRouteParams.length === 0 ? [
					`const collectionHref = ${collectionHrefExpression}`,
				] : [
					'const collectionHref = $derived(',
					indent(collectionHrefExpression, 1),
					')',
				]),
				...[...sharedRootBindingBySelection].map(([selection, binding]) => `const ${binding} = $derived(${selection})`),
				...contexts.flatMap(({
					dispatchCondition,
					selection,
					selectionBinding,
				}) => (
					dispatchCondition == null ?
						[`const ${selectionBinding} = $derived(${selection})`]
					:
						[]
				)),
				...pageComponentsSection,
				'import Page from \'$/components/Page.svelte\'',
				...(contexts.some(({ inlinesDefaultCollectionView }) => inlinesDefaultCollectionView) ? [
					'import EntitiesList from \'$/components/EntitiesList.svelte\'',
					'import EntityView from \'$/components/EntityView.svelte\'',
				] : []),
				...(contexts.some(({ isRelationshipPath }) => isRelationshipPath) ? [
					'import ResourceBoundary from \'$/components/ResourceBoundary.svelte\'',
				] : []),
				...unique(contexts.flatMap(({
					componentFile,
					inlinesDefaultCollectionView,
				}) => inlinesDefaultCollectionView ? [] : [
					`import ${componentIdentifier(componentFile)} from '${viewModulePath(componentFile)}'`
				])),
			],
			head: [
				`<title>${pageTitle.length === 1 ? pageTitle[0] : routeFile.page?.text?.title ?? 'Collections'} • Blockhead</title>`,
			],
			markup: [
				'<Page>',
				...contexts.flatMap(({
					collection,
					componentFile,
					dispatchCondition,
					isRelationshipPath,
					selection,
					selectionBinding,
				}, index) => [
					...(index === 0 ? [] : ['']),
					...renderCollectionPageMarkup(
						routeFile,
						collection,
						componentIdentifier(componentFile),
						routeId(appRoutePath),
						indexes,
						selectionBinding,
						isRelationshipPath,
						dispatchCondition == null ? undefined : selection,
						dispatchCondition,
						'collectionHref'
					),
				]),
				'</Page>',
			],
		}
	)
}

const renderPageEntityTitleExpression = (
	entity: Entity,
	indexes: GenerationIndexes,
	selectionExpression: string,
	dataTitleExpression?: string,
	pendingFieldsExpression = `${selectionExpression}.entitySelector`,
	pendingSelectorName?: string
) => {
	const summaryPlan = summaryPlanFor(entity, indexes)
	const serial = summaryPlan.serial
	const pendingSelectorFields = (
		pendingSelectorName == null ?
			undefined
		:
			new Set(entity.selectors.find((selector) => selector.name === pendingSelectorName)?.fields ?? [])
	)
	const pendingItems = (items: readonly _ViewItem[]) => (
		pendingSelectorFields == null ?
			items
			:
			items.filter((item) => itemFieldReferences(item).every((fieldReference) => (
				!isProjectionFieldReference(fieldReference)
				&& pendingSelectorFields.has(fieldReferenceKey(fieldReference))
			)))
	)
	const pendingOwnsField = (fieldReference: FieldReference) => (
		pendingSelectorFields == null ?
			entitySelectorOwnsField(entity, fieldReference)
		:
			!isProjectionFieldReference(fieldReference)
			&& pendingSelectorFields.has(fieldReferenceKey(fieldReference))
	)
	const itemUsesResolvedFields = (viewEntry: _ViewItem) => viewItemFieldReferences(viewEntry)
		.some((fieldReference) => !pendingOwnsField(fieldReference))
	const resolvedTitleUsesEntity = (
		viewItemTree([
			...summaryPlan.title.entries,
			...summaryPlan.titleFallback.entries,
			...viewItems(serial?.fallback),
		]).some(itemUsesResolvedFields)
		|| serial != null && !pendingOwnsField(serial.field)
	)
	const itemFieldsExpression = (viewEntry: _ViewItem) => {
		const fieldReferences = viewItemFieldReferences(viewEntry)
		const usesPendingFields = fieldReferences.some(pendingOwnsField)
		const usesResolvedFields = itemUsesResolvedFields(viewEntry)
		if (usesPendingFields && usesResolvedFields)
			throw new Error(`${entity.entityType} page title item mixes selector and resolved fields`)

		return usesPendingFields ? pendingFieldsExpression : `${selectionExpression}.entity`
	}
	const renderTitleItems = (entries: readonly _ViewItem[], fieldsExpression: string | ((viewEntry: _ViewItem) => string), fieldsAreComplete = false) => (
		renderJoinedItemsExpression(entity, indexes, entries, fieldsExpression, ' ', fieldsAreComplete)
	)
	const pendingTitle = renderTitleItems(pendingItems(summaryPlan.title.entries), pendingFieldsExpression)
	const pendingFallbackTitle = renderTitleItems(pendingItems(summaryPlan.titleFallback.entries), pendingFieldsExpression)
	const pendingSerialTitle = serial == null || (
		pendingSelectorFields != null
		&& !pendingSelectorFields.has(serial.field)
	) ?
		renderFirstDeclaredExpression([pendingTitle, pendingFallbackTitle])
	:
		renderSerialTextExpression(entity, indexes, serial, pendingFieldsExpression)
	const resolvedTitle = renderTitleItems(summaryPlan.title.entries, itemFieldsExpression, true)
	const resolvedFallbackTitle = renderTitleItems(summaryPlan.titleFallback.entries, itemFieldsExpression, true)
	const resolvedSerialFieldsExpression = serial == null || pendingOwnsField(serial.field) ?
		pendingFieldsExpression
		:
		`${selectionExpression}.entity`
	const resolvedSerialTitle = serial == null ?
		renderFirstDeclaredExpression([resolvedTitle, resolvedFallbackTitle])
	:
		renderFirstDeclaredExpression([
			`(${textExpression(fieldExpression(
				resolvedSerialFieldsExpression,
				serial.field
			))} ? ${emitTypeScript(`${serial.label} #`)} + ${textExpression(fieldExpression(
				resolvedSerialFieldsExpression,
				serial.field
			))} : '')`,
			renderJoinedItemsExpression(entity, indexes, viewItems(serial.fallback), itemFieldsExpression),
		])
	const entityTypeLabel = emitTypeScript(displayLabel(entityLabel(entity)))
	const pendingTitleExpression = renderFirstDeclaredExpression([pendingSerialTitle, entityTypeLabel])
	const resolvedTitleExpression = renderFirstDeclaredExpression([resolvedSerialTitle, entityTypeLabel])
	const titleExpression = (
		resolvedTitleUsesEntity && pendingTitleExpression !== resolvedTitleExpression ?
			(
				`${selectionExpression}.entity == null ? `
				+ pendingTitleExpression
				+ ' : '
				+ resolvedTitleExpression
			)
		:
			resolvedTitleExpression
	)

	return dataTitleExpression == null ?
		titleExpression
	:
		renderNullishExpression(dataTitleExpression, titleExpression)
}

const generatePageFile = (
	routePath: string,
	appRoutePath: string,
	routeFile: RouteFile,
	indexes: GenerationIndexes,
	hasGeneratedPageModule = false
) => {
	if ((routeFile.mappings?.length ?? 0) > 1) {
		const mappings = routeFile.mappings ?? []
		const mappingsByEntityType = Object.groupBy(mappings, ({ entityType }) => entityType)
		const mappingContexts = mappings.map((mapping) => {
			const entity = indexes.entityByType[mapping.entityType]
			if (entity == null)
				throw new Error(`${routePath} references missing entity ${mapping.entityType}`)

			return {
				mapping,
				entity,
				condition: mappingsByEntityType[mapping.entityType]?.length === 1 ?
					`data.entityType === EntityType.${mapping.entityType}`
				:
					(
						`data.entityType === EntityType.${mapping.entityType} `
						+ `&& data.selectorName === ${emitTypeScript(mapping.selectorName)}`
					),
				selection: compileEntityPageSelection(
					indexes,
					entity,
					mapping.entityType,
					'data.selector',
					mapping.selectorName,
					mapping.sourceSelection
				),
				title: renderPageEntityTitleExpression(
					entity,
					indexes,
					'pageSelection',
					undefined,
					'data.selector',
					mapping.selectorName
				),
			}
		})
		const finalContext = mappingContexts.at(-1)
		if (finalContext == null)
			throw new Error(`${routePath} has no final selector mapping`)
		const mappedEntityTypes = [...new Set(mappingContexts.map(({ mapping }) => mapping.entityType))]
		const singleMappedEntityType = mappedEntityTypes.length === 1 ? mappedEntityTypes[0] : undefined
		const singleMappedEntity = singleMappedEntityType == null ? undefined : indexes.entityByType[singleMappedEntityType]
		const sharedSourcesExpression = finalContext.selection.sourcesExpression
		// Selector variants with one source contract can request their combined
		// view fields through one selection; other contracts retain exact dispatch.
		const composableSelection = (
			singleMappedEntityType != null
			&& mappingContexts.every(({ selection }) => (
				selection.selectorExpression === 'data.selector'
				&& selection.sourcesExpression === sharedSourcesExpression
			))
		)
		const pageSelectionExpression = composableSelection ?
			renderCompiledEntityPageSelection({
				entityType: singleMappedEntityType,
				fields: [...new Map(mappingContexts.flatMap(({ selection }) => selection.fields)
					.map((field) => [fieldReferenceKey(field), field])).values()],
				selectorExpression: 'data.selector',
				sourcesExpression: sharedSourcesExpression,
			})
		:
			renderConditionalExpression(
				mappingContexts.slice(0, -1).map(({ condition, selection }) => ({
					condition,
					value: renderCompiledEntityPageSelection(selection),
				})),
				renderCompiledEntityPageSelection(finalContext.selection)
			)
		const pageTitleExpression = renderConditionalExpression(
			mappingContexts.slice(0, -1).map(({
				condition,
				entity,
				title,
			}) => ({
				condition,
				value: (
					singleMappedEntityType == null ?
						`(${title}) + ${emitTypeScript(` • ${displayLabel(entityLabel(entity))} • Blockhead`)}`
					:
						title
				),
			})),
			(
				singleMappedEntityType == null ?
					`(${finalContext.title}) + ${emitTypeScript(` • ${displayLabel(entityLabel(finalContext.entity))} • Blockhead`)}`
				:
					finalContext.title
			)
		)
		const pageSelectionReference = (
			typeScriptExpressionReferencesBinding(pageTitleExpression, 'pageSelection') ?
				'pageSelection'
			:
				pageSelectionExpression
		)
		const pageSelectionImports = mergeImports(
			mappingContexts.flatMap(({ entity }) => viewItemImports(entity, indexes))
		).map(emitImport)

		return svelteFile(
			routePath,
			{
				script: [
					'// Types/constants',
					'import type { PageProps } from \'./$types.ts\'',
					'import { EntityType } from \'$/schema/EntityType.ts\'',
					...pageSelectionImports,
					...(typeScriptExpressionReferencesBinding(pageSelectionExpression, 'Source') ? ['import { Source } from \'$/sources/Source.ts\''] : []),
					...pageContextSection,
					'import { select } from \'$/routes/+layout.svelte\'',
					...pageStateSection,
					...renderPagePropsState(['data']),
					'',
					...(pageSelectionReference === 'pageSelection' ? [
						'const pageSelection = $derived(',
						indent(pageSelectionExpression, 1),
						')',
					] : []),
					`const ${singleMappedEntityType == null ? 'documentTitle' : 'pageTitle'} = $derived(`,
					indent(pageTitleExpression, 1),
					')',
					...(singleMappedEntityType == null ? [
						'const entityViewByType = {',
						...mappedEntityTypes.flatMap((entityType) => {
							const entity = indexes.entityByType[entityType]
							if (entity == null)
								throw new Error(`${routePath} references missing entity ${entityType}`)

							return [
								`\t[EntityType.${entityType}]: ${singularComponentIdentifier(entityType)},`,
							]
						}),
						'}',
					] : []),
					'',
					'// Components',
					'import Page from \'$/components/Page.svelte\'',
					...mappedEntityTypes.map((entityType) => (
						`import ${singularComponentIdentifier(entityType)} from '${viewModulePath(singularComponentName(entityType))}'`
					)),
				],
				head: [
					singleMappedEntity == null ?
						'<title>{documentTitle}</title>'
					:
						`<title>{pageTitle} • ${svelteText(displayLabel(entityLabel(singleMappedEntity)))} • Blockhead</title>`,
				],
				markup: singleMappedEntityType == null ?
					[
						'<Page>',
						'\t{@const EntityView = entityViewByType[data.entityType]}',
						'',
						'\t<EntityView',
						renderSvelteAttribute(2, 'selection', pageSelectionReference),
						'\t/>',
						'</Page>',
					]
				:
					[
						'<Page>',
						`\t<${singularComponentIdentifier(singleMappedEntityType)}`,
						renderSvelteAttribute(2, 'selection', pageSelectionReference),
						'\t/>',
						'</Page>',
					],
			}
		)
	}

	if ((routeFile.collections?.length ?? 0) > 1)
		return generateMultiCollectionPageFile(
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
	const componentFile = view?.component ?? (
		collection == null && viewEntity != null ?
			singularComponentName(viewEntity)
		:
			undefined
	)
	const component = componentFile == null ? undefined : componentIdentifier(componentFile)
	const collectionComponentFile = view?.component ?? (collectionEntityDefinition == null ? undefined : (
		pluralComponentName(collectionEntityDefinition)
	))
	const collectionComponent = collectionComponentFile == null ? undefined : componentIdentifier(collectionComponentFile)
	const inlinesDefaultCollectionView = (
		collectionEntity != null
		&& collectionComponentFile != null
		&& isDefaultPluralViewComponent(indexes, collectionEntity, collectionComponentFile)
	)
	const inlineSelectorExpression = hasGeneratedPageModule ?
		undefined
	: mapping == null ?
		undefined
	:
		emitObject(mapping.fields.map((field) => [
			field.field,
			renderExpression(field.value, {
				params: 'params',
			}),
		]))
	const componentImports = unique([
		...(component == null || componentFile == null ? [] : [`import ${component} from '${viewModulePath(componentFile)}'`]),
		...(collectionComponent == null || collectionComponentFile == null || inlinesDefaultCollectionView ? [] : [
			`import ${collectionComponent} from '${viewModulePath(collectionComponentFile)}'`,
		]),
	])
	const viewEntityDefinition = viewEntity == null ? undefined : indexes.entityByType[viewEntity]
	const viewSelectionFields = viewEntityDefinition == null ?
		[]
	:
		viewResolvedFieldReferences(viewEntityDefinition, indexes, viewSelector)
			.filter((fieldName) => {
				const fieldDefinition = fieldDefinitionByReference(viewEntityDefinition, fieldName, indexes)
				return (
					fieldDefinition != null
					&& fieldDefinition.type !== EntityFieldType.EntitiesReference
				)
			})
	const collectionRoute = collection == null ?
		undefined
	:
		indexes.collectionRouteByEntity[collection.entity] ?? routeId(appRoutePath)
	const collectionUsesParams = (
		collection != null
		&& (
			expressionUsesKind(collection.source.selector, 'param')
			|| routeParamNames(collectionRoute ?? '').length > 0
			|| routeParamNames(routeId(appRoutePath)).length > 0
		)
	)
	const viewContentUsesParams = (
		view?.Content != null
		&& typeof view.Content !== 'string'
		&& view.Content.references?.includes('params') === true
	)
	const selectorUsesParams = inlineSelectorExpression != null && typeScriptExpressionReferencesBinding(inlineSelectorExpression, 'params')
	const selectorExpression = inlineSelectorExpression ?? 'data.selector'
	const usesData = (
		hasGeneratedPageModule
		|| expressionUsesKind(collection?.source.selector, 'pageSelector')
		|| (
			collection == null
			&& viewEntity != null
			&& typeScriptExpressionReferencesBinding(selectorExpression, 'data')
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
	// Generated detail and collection markup owns selection imports; raw page content declares its own.
	const usesGeneratedSelection = collection != null || isEntityDetailPage
	const entityTypeLabel = viewEntityDefinition == null ? undefined : displayLabel(entityLabel(viewEntityDefinition))
	const pageTitleLiteral = routeFile.page?.text?.title ?? routeFile.page?.text?.label ?? (
		isEntityDetailPage ?
			undefined
		: collectionEntity != null && indexes.entityByType[collectionEntity] != null ?
			sentenceStart(entityLabelPlural(indexes.entityByType[collectionEntity]))
		: viewEntityDefinition != null ?
			displayLabel(entityLabel(viewEntityDefinition))
		:
			'Blockhead'
	)
	const hasFieldConditionedViewSources = isEntityDetailPage && isFieldConditionedSourceSelection(mapping?.sourceSelection)
	const pageSelectionExpression = isEntityDetailPage && viewEntity != null ?
		renderEntityPageSelection(
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
			renderPageEntityTitleExpression(
				viewEntityDefinition,
				indexes,
				'pageSelection',
				usesData ? 'data.title' : undefined,
				'pageSelection.entitySelector',
				viewSelector
			)
		:
			undefined
	)
	const pageSelectionReference = (
		pageSelectionExpression == null ?
			undefined
		: pageEntityTitleExpression != null
			&& typeScriptExpressionReferencesBinding(pageEntityTitleExpression, 'pageSelection')
			|| typeScriptSourceReferencesBinding(view?.script ?? '', 'pageSelection') ?
			'pageSelection'
		:
			pageSelectionExpression
	)
	if (
		mapping?.href?.canonicalize === true
		&& viewEntity != null
		&& viewEntityDefinition != null
		&& pageSelectionExpression != null
		&& pageEntityTitleExpression != null
		&& entityTypeLabel != null
	) {
		const canonicalFieldName = viewSelectionFields.length === 1 && !isProjectionFieldReference(viewSelectionFields[0]) ?
			viewSelectionFields[0]
		:
			undefined
		if (canonicalFieldName == null)
			throw new Error(`${routePath} canonical alias must resolve exactly one canonical field`)
		if ((indexes.entityRouteLinksByType[viewEntity]?.length ?? 0) === 0)
			throw new Error(`${routePath} canonical alias has no canonical entity href`)
		const canonicalSelectorName = viewEntityDefinition.selectors.find((selector) => (
			selector.fields.length === 1
			&& selector.fields[0] === canonicalFieldName
		))?.name
		if (canonicalSelectorName == null)
			throw new Error(`${routePath} canonical alias field ${canonicalFieldName} is not a single-field selector`)
		const canonicalEntityHrefExpression = renderEntityRouteLinkExpression(
			indexes,
			viewEntity,
			`{ ...pageSelection.entitySelector, ${canonicalFieldName}: resolvedField }`,
			canonicalSelectorName
		)
		if (canonicalEntityHrefExpression == null)
			throw new Error(`${routePath} canonical alias has no renderable canonical entity href`)

		return svelteFile(
			routePath,
			{
				script: [
					'// Types/constants',
					'import type { PageProps } from \'./$types.ts\'',
					'import { resolve } from \'$app/paths\'',
					`import { EntityType } from '$/schema/EntityType.ts'`,
					...entityRouteImportSpecs(indexes, viewEntity).map(emitImport),
					...(typeScriptExpressionReferencesBinding(pageSelectionExpression, 'Source') ? [
						`import { Source } from '$/sources/Source.ts'`,
					] : []),
					...pageContextSection,
					`import { select } from '$/routes/+layout.svelte'`,
					...pageStateSection,
					...renderPagePropsState(['params']),
					'',
					`const pageSelection = $derived(${pageSelectionExpression})`,
					...pageComponentsSection,
					`import Page from '$/components/Page.svelte'`,
					`import ResourceBoundary from '$/components/ResourceBoundary.svelte'`,
				],
				head: [
					`<title>${entityTypeLabel} • Blockhead</title>`,
				],
				markup: [
					'<Page>',
					`\t<ResourceBoundary resource={pageSelection.${canonicalFieldName}}>`,
					'\t\t{#snippet children(resolvedField)}',
					'\t\t\t{#if typeof window !== \'undefined\'}',
					renderSvelteConst(4, 'canonicalEntityHref', canonicalEntityHrefExpression),
					'\t\t\t\t{#if canonicalEntityHref != null}',
					'\t\t\t\t\t{globalThis.location.replace(canonicalEntityHref)}',
					'\t\t\t\t{/if}',
					'\t\t\t{/if}',
					'\t\t{/snippet}',
					'\t</ResourceBoundary>',
					'</Page>',
				],
			}
		)
	}
	const appPathImports = (
		(
			view?.Content == null
			&& collection != null
			&& collectionComponent != null
		)
		|| (
			isEntityDetailPage
			&& mapping?.href?.entityHref !== false
			&& (indexes.entityRouteLinksByType[viewEntity ?? '']?.length ?? 0) === 0
		) ?
			['resolve']
		:
			[]
	)
	const collectionSourceEntityDefinition = collection == null ? undefined : indexes.entityByType[collection.source.entity]
	const collectionSourceSelectionExpression = collection == null ? '' : `select(EntityType.${collection.source.entity}, ${renderExpression(collection.source.selector, {
		pageSelector: 'data.selector',
		fields: 'data.selector',
		params: 'params',
	})})`
	const collectionSelection = collection == null || collectionSourceEntityDefinition == null ?
		undefined
	:
		collectionSelectionPlan(
			routePath,
			indexes,
			collection,
			collectionSourceEntityDefinition,
			collectionSourceSelectionExpression
		)
	const collectionSelectionExpression = collectionSelection?.selection ?? ''
	return svelteFile(
		routePath,
		{
			script: [
				'// Types/constants',
				...(hasPageProps ? ['import type { PageProps } from \'./$types.ts\''] : []),
				...(typeScriptExpressionReferencesBinding(collectionSelectionExpression, 'EntityProxyField') ? [
					'import { EntityProxyField } from \'$/client/$proxy.svelte.ts\'',
				] : []),
				...(inlinesDefaultCollectionView ? [
					'import { EntityMetaKey } from \'$/schema/$schema.ts\'',
				] : []),
				...(appPathImports.length === 0 ? [] : [
					`import { ${appPathImports.join(', ')} } from '$app/paths'`,
				]),
				...(usesGeneratedSelection ? ['import { EntityType } from \'$/schema/EntityType.ts\''] : []),
				...(collection == null ? [] : importSpecsFromMap(expressionImports(collection.source.selector)).map(emitImport)),
				...(
					inlineSelectorExpression == null && !(isEntityDetailPage && viewEntityDefinition != null) ?
						[]
					:
						mergeImports([
							...(inlineSelectorExpression == null ? [] : (mapping?.fields ?? []).flatMap((field) => (
								importSpecsFromMap(expressionImports(field.value))
							))),
							...(isEntityDetailPage && viewEntityDefinition != null ? viewItemImports(viewEntityDefinition, indexes) : []),
						]).map(emitImport)
				),
				...emitImportObject(view?.imports).map(emitImport),
				...(isFieldConditionedSourceSelection(mapping?.sourceSelection) ? [
					`import ${sourceSelectionFunctionName(mapping.sourceSelection)} from '${sourceSelectionModulePath(mapping.sourceSelection)}'`,
				] : []),
				...(typeScriptExpressionReferencesBinding(collectionSelectionExpression, 'Source') || pageSelectionExpression != null && typeScriptExpressionReferencesBinding(pageSelectionExpression, 'Source') ? [
					'import { Source } from \'$/sources/Source.ts\'',
				] : []),
				...(usesGeneratedSelection ? [
					...pageContextSection,
					'import { select } from \'$/routes/+layout.svelte\'',
				] : []),
				...(hasPageProps ? [
					...pageStateSection,
					...renderPagePropsState([
						...(usesData ? ['data'] : []),
						...(collectionUsesParams || viewContentUsesParams || selectorUsesParams ? ['params'] : []),
					]),
				] : []),
				...(pageSelectionExpression == null || pageEntityTitleExpression == null ? [] : [
					'',
					...(hasFieldConditionedViewSources ? [
						`const pageEntitySelector = $derived(${selectorExpression})`,
					] : []),
					...(pageSelectionReference === 'pageSelection' ? [
						`const pageSelection = $derived(${pageSelectionExpression})`,
					] : []),
				]),
				...((view?.script ?? '').trim() === '' ? [] : [
					'',
					'',
					...trimBlankLineEdges(reindentLines(lines(view.script), 0)),
				]),
				...(
					hasPageProps
					&& (pageSelectionExpression == null || pageEntityTitleExpression == null)
					&& (view?.script ?? '').trim() === '' ?
						['// Components']
					:
						pageComponentsSection
				),
				'import Page from \'$/components/Page.svelte\'',
				...(inlinesDefaultCollectionView ? [
					'import EntitiesList from \'$/components/EntitiesList.svelte\'',
					'import EntityView from \'$/components/EntityView.svelte\'',
				] : []),
				...(collectionSelection?.isRelationshipPath === true ? [
					'import ResourceBoundary from \'$/components/ResourceBoundary.svelte\'',
				] : []),
				...componentImports,
			],
			head: (
				pageEntityTitleExpression != null && entityTypeLabel != null ?
					[
						`<title>{${pageEntityTitleExpression}} • ${entityTypeLabel} • Blockhead</title>`,
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
					renderEntityPageMarkup(
						routeFile,
						component,
						pageSelectionReference == null || pageSelectionReference === 'pageSelection' ?
							pageSelectionExpression == null ? selectorExpression : 'pageSelection.entitySelector'
						:
							selectorExpression,
						routeId(appRoutePath),
						indexes,
						pageSelectionReference
					)
				:
						renderCollectionPageMarkup(
							routeFile,
							collection,
							collectionComponent,
							routeId(appRoutePath),
							indexes,
							'collectionSelection',
							collectionSelection?.isRelationshipPath === true,
							collectionSelectionExpression
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
	currentRouteId: string,
	indexes: GenerationIndexes,
	selectionBinding?: string
) => {
	const mapping = routeFile.mappings?.[0]
	const view = routeFile.page?.view
	const entityType = mapping?.entityType ?? view?.entity
	const selectorName = mapping?.selectorName ?? view?.selector
	if (view?.Content != null)
		return reindentLines(lines(view.Content.raw), 1)
	if (view?.text != null)
		return [
			`\t<h1>${view.text}</h1>`,
		]
	if (component == null || entityType == null)
		return routeFile.page?.text?.title == null ? [] : [`\t<h1>${routeFile.page.text.title}</h1>`]

	return [
		`\t<${component}`,
		...(
			mapping?.href?.entityHref === false
			|| (indexes.entityRouteLinksByType[entityType]?.length ?? 0) > 0 ?
				[]
			:
				[
			renderSvelteAttribute(
				2,
				'href',
				renderResolveExpression(currentRouteId, routeParamNames(currentRouteId).map((param) => [param, `params.${param}`]))
			),
				]
		),
		renderSvelteAttribute(
			2,
			'selection',
			selectionBinding ?? renderEntityPageSelection(
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

const renderCollectionPageMarkup = (
	routeFile: RouteFile,
	collection: CollectionRouteMapping,
	collectionComponent: string | undefined,
	href: string,
	indexes: GenerationIndexes,
	collectionSelectionExpression: string,
	hideWhenEmpty = false,
	inlineSelectionExpression?: string,
	conditionExpression?: string,
	hrefExpression = renderResolveExpression(href, routeParamNames(href).map((param) => [param, `params.${param}`]))
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

	const outerIndent = conditionExpression == null ? 1 : 2
	const bodyIndent = outerIndent
	const componentIndent = bodyIndent + (hideWhenEmpty ? 3 : 0)
	const needsSelectionBinding = hideWhenEmpty || source.path.length === 1
	const inlineSelection = inlineSelectionExpression ?? collectionSelectionExpression
	const selectionExpression = needsSelectionBinding ?
		collectionSelectionExpression
	:
		inlineSelection
	const collectionTitle = (
		collection.page?.text?.title
		?? routeFile.page?.text?.title
		?? sentenceStart(entityLabelPlural(collectionEntity))
	)
	const collectionUsesDefaultTitle = collectionTitle === (
		entityPluralView(collectionEntity)?.title
		?? sentenceStart(entityLabelPlural(collectionEntity))
	)
	const defaultPluralComponent = pluralComponentName(collectionEntity)
	const rendersDefaultEntitiesList = (
		isDefaultPluralViewComponent(indexes, collection.entity, defaultPluralComponent)
		&& collectionComponent === componentIdentifier(defaultPluralComponent)
	)
	const componentAttributes = [
		renderSvelteAttribute(componentIndent + 1, 'href', hrefExpression),
		...(collectionUsesDefaultTitle ? [] : [
			`${'\t'.repeat(componentIndent + 1)}title=${emitTypeScript(collectionTitle)}`,
		]),
		...(rendersDefaultEntitiesList ? [] : [
			renderSvelteAttribute(componentIndent + 1, 'selection', selectionExpression),
		]),
		...(source.path.length === 1 ? [
			renderSvelteAttribute(componentIndent + 1, 'countResource', `${selectionExpression}.count`),
		] : []),
		...(rendersDefaultEntitiesList ? [
			`${'\t'.repeat(componentIndent + 1)}open={true}`,
		] : []),
		`${'\t'.repeat(componentIndent + 1)}id=${emitTypeScript(
			href.startsWith('/~/accounts/') ?
				`account-${routeCollectionId(camel(collection.entity))}`
			:
				routeCollectionIdForFieldReference(source.field)
		)}`,
	]
	const component = (
		rendersDefaultEntitiesList ?
			renderDefaultEntitiesList(
				collection.entity,
				selectionExpression,
				componentAttributes,
				componentIndent
			)
		:
			[
				`${'\t'.repeat(componentIndent)}<${collectionComponent}`,
				...componentAttributes,
				`${'\t'.repeat(componentIndent)}/>`,
			]
	)
	const body = [
		...(!needsSelectionBinding || inlineSelectionExpression == null ? [] : [
			`${'\t'.repeat(bodyIndent)}{@const ${collectionSelectionExpression} = ${indent(inlineSelectionExpression, bodyIndent).trimStart()}}`,
			'',
		]),
		...(hideWhenEmpty ? [
			`${'\t'.repeat(bodyIndent)}<ResourceBoundary resource={${collectionSelectionExpression}}>`,
			`${'\t'.repeat(bodyIndent + 1)}{#snippet children(entities)}`,
			`${'\t'.repeat(bodyIndent + 2)}{#if entities.values.length > 0}`,
			...component,
			`${'\t'.repeat(bodyIndent + 2)}{/if}`,
			`${'\t'.repeat(bodyIndent + 1)}{/snippet}`,
			`${'\t'.repeat(bodyIndent)}</ResourceBoundary>`,
		] : component),
	]
	if (conditionExpression == null)
		return body

	return [
		`\t{#if ${conditionExpression}}`,
		...body,
		'\t{/if}',
	]
}

const renderKeyedSvelteMarkup = (keyExpression: string | undefined, markup: string[]) => (
	keyExpression == null ?
		markup
	:
		[
			`{#key ${keyExpression}}`,
			...reindentLines(markup, 1),
			'{/key}',
		]
)

const renderDetailHrefBinding = (hrefExpression: string, reactive: boolean) => (
	reactive ?
		[
			'const detailHref = $derived(',
			indent(hrefExpression, 1),
			')',
		]
	:
		[`const detailHref = ${hrefExpression}`]
)

const generateLayoutFile = (routePath: string, routeFile: RouteFile) => {
	if (routeFile.layout == null && routeFile.detailLayout == null)
		throw new Error(`${routePath} layout route file is missing layout metadata`)

	const modeledEntityLayout = routeFile.layout?.entity == null ? undefined : routeFile.layout
	const componentFile = modeledEntityLayout == null ?
		undefined
	:
		modeledEntityLayout.component ?? singularComponentName(modeledEntityLayout.entity)
	const selectorExpression = modeledEntityLayout?.selector == null ?
		undefined
	:
		renderExpression(modeledEntityLayout.selector, {
			params: 'params',
		})
	const hrefParamNames = modeledEntityLayout?.href == null ? [] : routeParamNames(modeledEntityLayout.href)
	const componentFiles = routeFile.detailLayout?.components ?? (componentFile == null ? [] : [componentFile])
	const componentDeclaration = componentFiles.length > 1 ? routeFile.detailLayout?.detailViewExpression : undefined
	const constantImports = routeFile.detailLayout != null ?
		(
			typeScriptExpressionReferencesBinding(routeFile.detailLayout.detailSelectionExpression, 'Source') ?
				['import { Source } from \'$/sources/Source.ts\'']
			:
				[]
		)
	:
		mergeImports([
			...[
				modeledEntityLayout?.selector,
				modeledEntityLayout?.id,
			].flatMap((expression) => expression == null ? [] : importSpecsFromMap(expressionImports(expression))),
		]).map(emitImport)
	const entityHrefExpression = routeFile.detailLayout?.hrefExpression ?? (
		modeledEntityLayout?.href == null ?
			undefined
		:
			renderResolveExpression(modeledEntityLayout.href, hrefParamNames.map((param) => [param, `params.${param}`]))
	)
	const idExpression = modeledEntityLayout?.id == null ?
		undefined
	:
		renderExpression(modeledEntityLayout.id, {
			params: 'params',
		})
	const keyExpression = routeFile.detailLayout?.keyExpression ?? (
		hrefParamNames.length === 0 ?
			undefined
		: hrefParamNames.length === 1 ?
			`params.${hrefParamNames[0]}`
		:
			`[${hrefParamNames.map((param) => `params.${param}`).join(', ')}].join(':')`
	)
	const selectionExpression = routeFile.detailLayout?.detailSelectionExpression ?? (
		modeledEntityLayout == null ?
			undefined
		: selectorExpression == null ?
			`select(EntityType.${modeledEntityLayout.entity}, data.selector)`
		:
			`select(EntityType.${modeledEntityLayout.entity}, ${selectorExpression})`
	)
	if (componentFiles.length > 0 && selectionExpression != null) {
		const component = routeFile.detailLayout != null && componentFiles.length > 1 ?
			'DetailView'
		:
			componentIdentifier(componentFiles[0]!)
		const parentPageCollapsibleLines = [
			'<ParentPageCollapsible',
			...(entityHrefExpression == null ? [] : [renderSvelteAttribute(1, 'href', 'detailHref')]),
			...(idExpression == null ? [] : [renderSvelteAttribute(1, 'id', idExpression)]),
			'>',
			'\t{#snippet Summary()}',
			...(componentDeclaration == null ? [] : [
				'\t\t{@const DetailView = ' + componentDeclaration + '}',
				'',
			]),
			`\t\t<${component}`,
			renderSvelteAttribute(3, 'selection', selectionExpression),
			...(entityHrefExpression == null ? [] : [renderSvelteAttribute(3, 'href', 'detailHref')]),
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
					...constantImports,
					'',
					'',
					'// Context',
					...(entityHrefExpression == null ? [] : ['import { resolve } from \'$app/paths\'']),
					'import { select } from \'$/routes/+layout.svelte\'',
					'',
					'',
					'// State',
					'let {',
					'\tchildren,',
					...(routeFile.detailLayout != null || selectorExpression == null ? ['\tdata,'] : []),
					'\tparams,',
					'}: LayoutProps = $props()',
					...(entityHrefExpression == null ? [] : [
						'',
						...renderDetailHrefBinding(entityHrefExpression, keyExpression != null),
					]),
					'',
					'',
					'// Components',
					'import { EntityLayout } from \'$/components/EntityView.svelte\'',
					'import ParentPageCollapsible from \'$/components/ParentPageCollapsible.svelte\'',
					...componentFiles.map((component) => `import ${componentIdentifier(component)} from '${viewModulePath(component)}'`),
				],
				markup: renderKeyedSvelteMarkup(keyExpression, parentPageCollapsibleLines),
			}
		)
	}

	const title = routeFile.layout?.kind === 'group' ? routeFile.layout.title : undefined
	if (title == null)
		throw new Error(`${routePath} group layout is missing title`)

	const href = routeFile.layout?.kind === 'group' ? routeFile.layout.href : undefined
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
				`\ttitle=${emitTypeScript(title)}`,
				...(hrefExpression == null ? [] : [renderSvelteAttribute(1, 'href', hrefExpression)]),
				'>',
				'\t{@render children()}',
				'</ParentPageCollapsible>',
			],
		}
	)
}

// Publication
//
// Generation is transactional: render first, publish changed files under a lock,
// remove obsolete generated artifacts, and roll back the entire publication on
// failure. Hand-written files are protected by the generated-file header check.
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
			const source = await readText(absolutePath)
			if (source?.startsWith(generatedHeader) === true || source?.startsWith(generatedSvelteHeader) === true)
				paths.push(path.relative(generatedOutputRoot, absolutePath))
		}
	}

	await walk(routeRoot, true)
	for (const directory of new Set(files.flatMap((generatedFile) => (
		generatedFile.path.startsWith('src/') && !generatedFile.path.startsWith('src/routes/') ?
			[path.dirname(generatedFile.path)]
		:
			[]
	))))
		// Views may contain generated subdirectories from an earlier manifest.
		// Recursive header-filtered discovery removes an obsolete artifact family
		// without granting the generator authority over handwritten files.
		await walk(path.join(generatedOutputRoot, directory), directory === 'src/views')

	return paths
}

const removeEmptyRouteDirectories = async (directory = routeRoot) => {
	const entries = await readDirectory(directory)
	if (entries.length === 0 && directory === routeRoot)
		return
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

export const writeFiles = async (files: readonly GeneratedFile[]) => {
	const lockPath = path.join(generatedOutputRoot, '.blockhead-generator.lock')
	const transactionId = `${process.pid}-${randomUUID()}`
	const transactionRoot = path.join(generatedOutputRoot, `.blockhead-generator-${transactionId}`)
	const stagedRoot = path.join(transactionRoot, 'staged')
	const backupRoot = path.join(transactionRoot, 'backup')
	const expected = new Set(files.map((generatedFile) => generatedFile.path))
	let stale: string[] = []
	const changed: {
		absolutePath: string
		filePath: string
		renderedFile: string
	}[] = []

	for (let attempt = 0; ; attempt += 1) {
		try {
			await fs.mkdir(lockPath)
			break
		} catch (error) {
			if (!(typeof error === 'object' && error != null && 'code' in error && error.code === 'EEXIST'))
				throw error
			if (attempt === 600)
				throw new Error(`Timed out waiting for generator publication lock: ${lockPath}`)

			await new Promise((resolve) => setTimeout(resolve, 100))
		}
	}

	await fs.writeFile(path.join(lockPath, 'owner.json'), `${JSON.stringify({
		pid: process.pid,
		startedAt: new Date().toISOString(),
		transactionId,
	})}\n`)

	const published: {
		absolutePath: string
		backupPath: string
		hadExistingFile: boolean
	}[] = []
	let vitePaused = false
	try {
		stale = (await generatedOwnedPaths(files)).filter((filePath) => (
			!expected.has(filePath)
			&& !protectedRouteFiles.has(filePath)
			&& !protectedSchemaFiles.has(filePath)
		)).sort()
		for (const generatedFile of [...files].sort((left, right) => left.path.localeCompare(right.path, 'en', {
			sensitivity: 'base',
			numeric: true,
		}))) {
			const absolutePath = path.join(generatedOutputRoot, generatedFile.path)
			const renderedFile = renderGeneratedFile(generatedFile)
			if (await readText(absolutePath) === renderedFile)
				continue

			changed.push({
				absolutePath,
				filePath: generatedFile.path,
				renderedFile,
			})
		}

		if (changed.length === 0 && stale.length === 0)
			return

		if (process.env.APP_GENERATOR_VITE_HANDSHAKE_URL != null) {
			const response = await fetch(`${process.env.APP_GENERATOR_VITE_HANDSHAKE_URL}/__blockhead-generator/pause`, {
				method: 'POST',
			})
			if (!response.ok)
				throw new Error(`Vite generator pause failed: ${response.status} ${await response.text()}`)
			vitePaused = true
		}

		for (const changedFile of changed) {
			const stagedPath = path.join(stagedRoot, changedFile.filePath)
			await fs.mkdir(path.dirname(stagedPath), {
				recursive: true,
			})
			await fs.writeFile(stagedPath, changedFile.renderedFile)
			const existingStat = await fs.stat(changedFile.absolutePath).catch(() => undefined)
			if (existingStat != null)
				await fs.chmod(stagedPath, existingStat.mode)
		}

		for (const changedFile of changed) {
			const stagedPath = path.join(stagedRoot, changedFile.filePath)
			const backupPath = path.join(backupRoot, changedFile.filePath)
			const hadExistingFile = await readText(changedFile.absolutePath) !== undefined
			await fs.mkdir(path.dirname(changedFile.absolutePath), {
				recursive: true,
			})
			if (hadExistingFile) {
				await fs.mkdir(path.dirname(backupPath), {
					recursive: true,
				})
				await fs.copyFile(changedFile.absolutePath, backupPath)
			}
			await fs.rename(stagedPath, changedFile.absolutePath)
			published.push({
				absolutePath: changedFile.absolutePath,
				backupPath,
				hadExistingFile,
			})

			if (Number(process.env.APP_GENERATOR_FAIL_AFTER_PUBLICATION ?? '-1') === published.length)
				throw new Error(`Injected generator publication failure after ${published.length} files`)
		}

		for (const filePath of stale) {
			const absolutePath = path.join(generatedOutputRoot, filePath)
			const backupPath = path.join(backupRoot, filePath)
			await fs.mkdir(path.dirname(backupPath), {
				recursive: true,
			})
			await fs.rename(absolutePath, backupPath)
			published.push({
				absolutePath,
				backupPath,
				hadExistingFile: true,
			})

			if (Number(process.env.APP_GENERATOR_FAIL_AFTER_PUBLICATION ?? '-1') === published.length)
				throw new Error(`Injected generator publication failure after ${published.length} files`)
		}

		await removeEmptyRouteDirectories()
	} catch (error) {
		for (const publishedFile of published.reverse()) {
			await fs.rm(publishedFile.absolutePath, {
				force: true,
			})
			if (publishedFile.hadExistingFile) {
				await fs.mkdir(path.dirname(publishedFile.absolutePath), {
					recursive: true,
				})
				await fs.rename(publishedFile.backupPath, publishedFile.absolutePath)
			}
		}
		throw error
	} finally {
		let viteResumeError: Error | undefined
		if (vitePaused)
			try {
				const response = await fetch(`${process.env.APP_GENERATOR_VITE_HANDSHAKE_URL}/__blockhead-generator/resume`, {
					method: 'POST',
				})
				if (!response.ok)
					viteResumeError = new Error(`Vite generator resume failed: ${response.status} ${await response.text()}`)
			} catch (error) {
				viteResumeError = error instanceof Error ? error : new Error(String(error))
			}
		await fs.rm(transactionRoot, {
			force: true,
			recursive: true,
		})
		await fs.rm(lockPath, {
			force: true,
			recursive: true,
		})
		if (viteResumeError != null)
			throw viteResumeError
	}
}

const checkGeneratedViewImportsResolve = async (files: readonly GeneratedFile[]) => {
	const expected = new Set(files.map((generatedFile) => generatedFile.path))
	const missing: string[] = []
	for (const generatedFile of files) {
		if (generatedFile.kind === 'text')
			continue

		for (const importPath of (
			generatedFile.kind === 'ts' ?
				(generatedFile.ast.imports ?? []).map(({ from }) => from)
			: generatedFile.kind === 'svelte' ?
				[
					...typeScriptImportPaths(generatedFile.ast.moduleScript ?? []),
					...typeScriptImportPaths(generatedFile.ast.script ?? []),
				]
			:
				[]
		)) {
			if (!importPath.startsWith('$/views/') || !importPath.endsWith('.svelte'))
				continue

			const targetPath = `src/views/${importPath.slice('$/views/'.length)}`
			if (expected.has(targetPath))
				continue

			try {
				await fs.access(path.join(generatedOutputRoot, targetPath))
			} catch {
				try {
					await fs.access(path.join(repoRoot, targetPath))
				} catch {
					missing.push(`${generatedFile.path} imports missing ${targetPath}`)
				}
			}
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
		for (const generatedFile of files)
			await fs.rm(path.join(generatedOutputRoot, generatedFile.path), {
				force: true,
			})
		await removeEmptyRouteDirectories()
		return
	}

	throw new Error(`Unknown command: ${command}`)
}

if (process.argv[1]?.endsWith(`${path.sep}scripts${path.sep}app${path.sep}generate.ts`) === true)
	await main()
