import fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

import { parse as parseSvelte } from 'svelte/compiler'
import ts from 'typescript'

import {
	emitTypeScript,
	generatedHeader,
	generatedImportSpecFrom,
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
	SourceArtifactKind,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	sourceBindingCompatibility,
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
} from '../../APP.ts'

import { networks } from '../../src/constants/Network.ts'


// Compiler model: these types describe the validated facts retained from APP.ts.
// They are not runtime application contracts and never ship to the browser.
type Entity = App['schema']['entities'][number]
type EntityField = Entity['fields'][number]
type EntityFacet = NonNullable<Entity['facets']>[number]
type EntityFacetEntry = {
	entityType: string
	facet: EntityFacet
	projectionPath: readonly [string, ...string[]]
}
type EntitySelector = Entity['selectors'][number]
type ValueType = App['schema']['valueTypes'][number]
type ValueTypeType = App['schema']['valueTypes'][number]['type']
type SingularView = NonNullable<Entity['views']['singular']>
type EntityLatest = NonNullable<SingularView['latest']>[number]
type EntityCarousel = NonNullable<SingularView['carousels']>[number] & {
	projectionPath?: readonly [string, ...string[]]
}
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
	explicitValueTypes: readonly string[]
	valueTypes: readonly string[]
	decode?: _ExpressionDecode | _RouteParamTransform
	encoding?: _RouteParamEncoding
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
	probeCaseId?: string
	probeAtoms: readonly string[]
	boundaryLiveOptional?: true
	href?: {
		entityHref?: false
		canonicalize?: true
		conditions?: EntityRouteLink['conditions']
		params: RouteLink['params']
	}
	routeParamAlternatives: readonly RouteLink['params'][]
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
	params: {
		param: string
		value: _Expression
		decode?: _ExpressionDecode
	}[]
}
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
	readonly provider: SourceDefinition['provider']
	readonly source: SourceDefinition['source']
	readonly binding: SourceBinding
	readonly bindingIndex: number
}
type SourceArtifactEntry = SourceBindingEntry & {
	readonly artifact: NonNullable<SourceBinding['artifacts']>[number]
	readonly artifactIndex: number
}
type RouteFixtureMetadata = {
	id: string
	projectionEntity?: EntityType
	projectionPath?: readonly [string, ...string[]]
	probeCaseId?: string
	probeAtoms: readonly string[]
	boundaryLiveOptional?: true
}
type CompiledSourceProviderFacts = {
	provider: SourceProviderDefinition
	sources: readonly SourceDefinition[]
	bindings: readonly SourceBindingEntry[]
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
	placement: 'layout' | 'page'
	routeFile: RouteFile
	inheritedMappings: boolean
	projectionOwnedByAncestor: boolean
	pageModuleOwnership: 'layout' | 'page' | 'ancestor' | 'inline' | 'none'
	generatedPageModule?: boolean
}
type CompiledAppFacts = Readonly<{
	activeEntities: readonly Entity[]
	entityByType: Readonly<Record<string, Entity>>
	entityFacetByPath: Readonly<Record<string, EntityFacetEntry>>
	facetAncestorConditionsByPath: Readonly<Record<string, readonly _AppFacetCondition[]>>
	facetDependencyConditionsByPath: Readonly<Record<string, NonNullable<EntityRouteLink['conditions']>>>
	valueTypeById: Readonly<Record<string, App['schema']['valueTypes'][number]>>
	sources: readonly SourceDefinition[]
	sourceProviderPlans: readonly CompiledSourceProviderFacts[]
	sourceBindings: readonly SourceBindingEntry[]
	resolverModules: readonly App['resolvers']['modules'][number][]
	navigationItems: readonly App['navigation']['items'][number][]
	routeNodesByPublicPath: Readonly<Record<string, readonly RouteNode[]>>
	compositeRouteParams: readonly CompositeRouteParamPlan[]
	routeFixturePlans: readonly RouteFixturePlan[]
	physicalRouteFiles: readonly CompiledPhysicalRouteFileFacts[]
	collectionRouteByEntity: Readonly<Record<string, string>>
	collectionRouteBySourceField: Readonly<Record<string, RouteLink>>
	entityRouteLinksByType: Readonly<Partial<Record<string, readonly EntityRouteLink[]>>>
}>

type GenerationIndexes = Readonly<Pick<
	CompiledAppFacts,
	| 'collectionRouteByEntity'
	| 'collectionRouteBySourceField'
	| 'entityByType'
	| 'entityFacetByPath'
	| 'entityRouteLinksByType'
	| 'facetAncestorConditionsByPath'
	| 'facetDependencyConditionsByPath'
	| 'routeNodesByPublicPath'
	| 'sourceBindings'
	| 'valueTypeById'
>>
type SourcesMarkdownInput = Readonly<{
	sourceArtifacts: readonly SourceArtifactEntry[]
	sourceBindings: readonly SourceBindingEntry[]
	sourceProviders: readonly SourceProviderDefinition[]
	sources: readonly SourceDefinition[]
}>
type GenerationInput = Readonly<{
	indexes: GenerationIndexes
	entities: readonly Entity[]
	sources: readonly SourceDefinition[]
	sourceProviderPlans: readonly CompiledSourceProviderFacts[]
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

const svelteComponentNames = (source: string) => (
	[...source.matchAll(/<([A-Z][A-Za-z0-9_$]*)\b/g)]
		.flatMap((match) => match[1] == null ? [] : [match[1]])
)

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

const trimBlankLineEdges = (source: string[]) => source.slice(
	source.findIndex((line) => line.trim() !== ''),
	source.findLastIndex((line) => line.trim() !== '') + 1
)

const lines = (source: string) => source.split('\n')

const renderRawLines = (source: string, level: number) => lines(source)
	.map((line) => line.trim() === '' ? '' : `${'\t'.repeat(level)}${line}`)

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

const typeScriptExpressionReferencesBinding = (
	source: string,
	binding: string
) => {
	if (source.trim() === '')
		return false

	let referencesBinding = false
	const visit = (node: ts.Node) => {
		if (
			ts.isIdentifier(node)
			&& node.text === binding
			&& !(ts.isPropertyAccessExpression(node.parent) && node.parent.name === node)
			&& !(ts.isPropertyAssignment(node.parent) && node.parent.name === node)
		)
			referencesBinding = true
		else if (!referencesBinding)
			ts.forEachChild(node, visit)
	}
	visit(parseTypeScriptExpression(source).expression)
	return referencesBinding
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
				if (
					ts.isIdentifier(node)
					&& node.text === identifier
					&& !(ts.isPropertyAccessExpression(node.parent) && node.parent.name === node)
				)
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

// Generated fragments can contain either TypeScript statements or Svelte
// markup, so a TypeScript scanner is the common syntax boundary for inlining a
// binding without rewriting matching text inside strings or comments.
const replaceGeneratedIdentifier = (
	source: string,
	identifier: string,
	replacement: string
) => {
	const scanner = ts.createScanner(
		ts.ScriptTarget.Latest,
		false,
		ts.LanguageVariant.Standard,
		source
	)
	const parts: string[] = []
	let offset = 0
	for (let token = scanner.scan(); token !== ts.SyntaxKind.EndOfFileToken; token = scanner.scan()) {
		if (token !== ts.SyntaxKind.Identifier || scanner.getTokenText() !== identifier)
			continue

		parts.push(
			source.slice(offset, scanner.getTokenPos()),
			replacement
		)
		offset = scanner.getTextPos()
	}
	parts.push(source.slice(offset))
	return parts.join('')
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

const componentIdentifier = (componentName: string) => componentName.replace(/^_+/, '')

const schemaModulePath = (entityType: string) => `$/schema/${entityType}.ts`
const schemaEnumModulePath = (enumName: string) => `$/schema/${enumName}.ts`

const viewModulePath = (componentName: string) => `$/views/${componentName}.svelte`

const pluralViewName = (entity: Entity) => componentIdentifier(pluralComponentName(entity)).replace(/View$/, '')

const singularComponentIdentifier = (entityType: string) => componentIdentifier(singularComponentName(entityType))

const propertyAccess = (property: string) => /^[A-Za-z_$][\w$]*$/.test(property) ? `.${property}` : `[${emitTypeScript(property)}]`

const optionalPropertyAccess = (property: string) => {
	const access = propertyAccess(property)
	return access.startsWith('.') ? `?.${access.slice(1)}` : `?.${access}`
}

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
		&& projectionPath.every((facetName, index) => fieldFacetPath[index] === facetName)
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

	const projectionResourceExpression = fieldResourceBaseExpression('selection', field)
	const boundaryLines = [
		`${'\t'.repeat(level)}<ProjectionBoundary`,
		renderSvelteAttribute(level + 1, 'resource', projectionResourceExpression),
		`${'\t'.repeat(level)}>`,
		`${'\t'.repeat(level + 1)}{#snippet Applicable(projection)}`,
		...reindentLines(renderContent('projection', fieldNameForReference(field)), level + 2),
		`${'\t'.repeat(level + 1)}{/snippet}`,
		`${'\t'.repeat(level)}</ProjectionBoundary>`,
	]
	const facetKey = projectionPathKey(entity.entityType, field.slice(0, -1))
	const facetCondition = indexes.entityFacetByPath[facetKey]?.facet.condition
	const conditions = [
		...(indexes.facetAncestorConditionsByPath[facetKey] ?? []),
		...(facetCondition == null ? [] : [facetCondition]),
	].flatMap(viewConditionFromFacetCondition)
	if (
		conditions.length === 0
		|| !conditions.every(({ field }) => entitySelectorOwnsField(entity, field))
	) {
		if (conditions.length === 0 || entitySingularView(entity)?.pending == null)
			return boundaryLines

		return [
			`${'\t'.repeat(level)}{#if ${conditionExpression(
				conditions,
				pendingEntityExpression,
				entity,
				indexes,
				true,
				true
			)}}`,
			...content.map((line) => indent(line)),
			`${'\t'.repeat(level)}{/if}`,
		]
	}

	return [
		`${'\t'.repeat(level)}{#if ${conditionExpression(conditions, 'selection.entitySelector', entity, indexes)}}`,
		...boundaryLines.map((line) => indent(line)),
		`${'\t'.repeat(level)}{/if}`,
	]
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
	optional?: boolean
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
			optional: false,
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
		const valueExpression = renderExpression(expression, {
			...context,
			optional: false,
		})
		const parsedValueExpression = parseTypeScriptExpression(valueExpression)
		const routeValueExpression = unwrapParenthesizedExpression(parsedValueExpression.expression)
			.getText(parsedValueExpression.sourceFile)
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

	const looseExpression = renderExpression(expression, {
		...context,
		optional: false,
	})
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

const emitObject = (entries: readonly [string, string | undefined][]) => emitTypeScript({
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
) => [
	'(',
	...cases.flatMap(({ condition, value }) => [
		`\t${condition} ?`,
		indent(value, 2),
		'\t:',
	]),
	indent(fallback, 2),
	')',
].join('\n')

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
	indexes?: GenerationIndexes,
	partial = false,
	partialBasePresent = false,
	fieldExpressionByName?: Readonly<Record<string, string>>
) => unique(conditions.map((condition) => {
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
			!('oneOf' in condition) ? undefined : `${emitArray(condition.oneOf.map(emitTypeScript))}.includes(${conditionValueExpression})`,
		].filter(Boolean).join(' && ')
		return (
			partial ?
				`${fieldPathsPresenceExpressions(
					entityExpression,
					[fieldReferenceKey(condition.field).split('.').filter(Boolean)],
					partialBasePresent
				).join(' && ')} && ${expression}`
			:
				expression
		)
	})).join(' && ')

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

const routeExpressionConditions = (
	context: ExpressionContext,
	expression: _Expression,
	fieldPathConditions: (fieldPaths: readonly string[][]) => string[]
): string[] => {
	if (typeof expression === 'string' || 'raw' in expression)
		return []

	if (expression.kind === 'case') {
		const valueCondition = routeExpressionConditions(context, expression.value, fieldPathConditions).join(' && ')
		const valueExpression = renderExpression(expression.value, context)
		const cases = expression.cases.map((item) => ({
			condition: `${valueExpression} === ${emitTypeScript(item.equals)}`,
			inverseCondition: `${valueExpression} !== ${emitTypeScript(item.equals)}`,
			requirement: routeExpressionConditions(context, item.value, fieldPathConditions).join(' && ') || 'true',
		}))
		const exhaustive = appCaseIsExhaustive(expression, context)
		const conditionalCases = exhaustive ? cases.slice(0, -1) : cases
		const fallbackRequirement = exhaustive ?
			cases.at(-1)?.requirement ?? 'true'
		:
			routeExpressionConditions(context, expression.default, fieldPathConditions).join(' && ') || 'true'
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

		return [valueCondition === '' ? caseCondition : `(${valueCondition} && ${caseCondition})`]
	}

	return fieldPathConditions(uniqueFieldPaths(expressionFieldPaths(expression)))
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
	context: ExpressionContext
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
		return context.fieldExpressionByName?.[expression.name] ?? (
			context.optional === true ?
				optionalFieldExpression(context.fields ?? 'selector', expression.name)
			:
				fieldExpression(context.fields ?? 'selector', expression.name)
		)
	if (expression.kind === 'property')
		return `${renderExpression(expression.value, context)}${
			context.optional === true ?
				optionalPropertyAccess(expression.property)
			:
				propertyAccess(expression.property)
		}`
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
				context.fieldExpressionByName?.[expression.field] ?? (
					context.optional === true ?
						optionalFieldExpression(context.fields ?? 'selector', expression.field)
					:
						fieldExpression(context.fields ?? 'selector', expression.field)
				)
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
		const inlineExpression = `(${conditionalCases.map((item) => `${valueExpression} === ${item.equals} ? ${item.value}`).join(' : ')} : ${fallbackExpression})`
		if (!inlineExpression.includes('\n'))
			return inlineExpression

		return [
			'(',
			...conditionalCases.flatMap((item) => [
				...indent(`${valueExpression} === ${item.equals} ?`).split('\n'),
				...indent(item.value, 2).split('\n'),
				'\t:',
			]),
			indent(fallbackExpression, 2),
			')',
		].join('\n')
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

const entityRawSnippets = (entity: Entity) => {
	const singularView = entitySingularView(entity)
	const pluralView = entityPluralView(entity)

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
		...rawSnippet(pluralView?.TypeAnnotationTooltip),
		...declaredViewItems(entity).flatMap((viewItem) => (
			typeof viewItem === 'object' && 'Content' in viewItem ?
				rawSnippet(viewItem.Content)
			:
				[]
		)),
	]
}

type RouteDetail = {
	entityType: EntityType
	selectorName: string
	selector: _Expression
	component: string
	href: string
	sourceSelection?: readonly string[] | _SourceSelection
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
	routeParamAlternatives: readonly Readonly<Record<string, _Expression>>[]
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
	ownRouteParams: Readonly<Record<string, _Expression>>,
	bindingGroups: readonly {
		field: string
		alternatives: readonly Readonly<Record<string, _Expression>>[]
	}[],
	maximumAlternatives = 256
) => {
	const routeParamsKey = (routeParams: Readonly<Record<string, _Expression>>) => JSON.stringify(
		Object.entries(routeParams).toSorted(([leftParam], [rightParam]) => leftParam.localeCompare(rightParam))
	)
	let routeParamAlternatives = [ownRouteParams]
	for (const bindingGroup of bindingGroups) {
		if (bindingGroup.alternatives.length === 0)
			throw new Error(`${routeMappingId} inherited field ${bindingGroup.field} has no applicable ancestor route parameter alternatives`)

		const bindingRouteAlternatives = [...new Map(bindingGroup.alternatives.map((alternative) => [
			routeParamsKey(alternative),
			alternative,
		])).values()]
		const composedAlternatives = new Map<string, Readonly<Record<string, _Expression>>>()
		for (const routeParams of routeParamAlternatives)
			for (const bindingRouteParams of bindingRouteAlternatives) {
				const conflictingParam = Object.keys(bindingRouteParams).find((param) => (
					routeParams[param] != null
					&& JSON.stringify(routeParams[param]) !== JSON.stringify(bindingRouteParams[param])
				))
				if (conflictingParam != null)
					throw new Error(`${routeMappingId} inherited field groups ambiguously bind route parameter ${conflictingParam}`)

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
		valueTypeById: ReadonlyMap<string | undefined, App['schema']['valueTypes'][number]>
		routeParamValueTypesByOwner: ReadonlyMap<string, readonly string[]>
	},
	parentPath = '',
	ancestorSelectors: readonly RouteAncestorSelector[] = [],
	ancestorRouteParams: readonly RouteParam[] = [],
	parentSvelteKitPath = ''
): {
	nodes: RouteNode[]
} => {
	const {
		entityByType,
		valueTypeById,
	} = indexes
	const compiledNodes = Object.entries(nodes).map(([segment, node]) => {
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
			...routeParamNames(segment).map((name) => {
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
			const encodeRouteParamField = (field: EntityField, value: _Expression): _Expression => {
				const encode = valueTypeById.get(field.valueType)?.routeParam?.encode
				return encode == null ? value : {
					kind: 'call',
					from: encode.from,
					name: encode.name,
					args: [value],
				}
			}
			const ownRouteParams = {
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
				...Object.fromEntries(derivationRouteParams),
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
					canonicalize: mapping.href.canonicalize,
					conditions: mapping.href.conditions,
					params: mapping.href.params ?? [],
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
							Object.entries(ancestorRouteParams).map(([param, value]) => [
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
				paramBindings: mapping.params ?? {},
				routeParamMatchers,
				ancestorBindings,
				...routeProbeMetadata(
					routePath,
					`${entityType}.${selectorName}`,
					Object.keys(routeParamAlternatives[0] ?? {}),
					mapping.probeCount ?? 1
				),
				...(mapping.boundaryLiveOptional == null ? {} : { boundaryLiveOptional: mapping.boundaryLiveOptional }),
				...(href == null ? {} : { href }),
				routeParamAlternatives: routeParamAlternatives.map((routeParamValues) => Object.entries(routeParamValues).map(([param, value]) => {
					const decode = routeParams.find((routeParam) => routeParam.name === param)?.decode
					return {
						param,
						value,
						...(typeof decode !== 'string' ? {} : { decode }),
					}
				})),
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
			const variantRouteParams = {
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
					routeParamValuesFromExpression(
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
			const routeParamAlternatives = owner.mapping.routeParamAlternatives.map((alternative) => ({
				...Object.fromEntries(alternative.map(({ param, value }) => [param, value])),
				...variantRouteParams,
			}))
			const variantId = routePath
				.split('/')
				.findLast((segment) => segment !== '' && !segment.startsWith('(') && !segment.startsWith('['))
			if (variantId == null)
				throw new Error(`${routeId(routePath)} selector variant has no stable route segment`)

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
					...routeProbeMetadata(
						routePath,
						`${owner.entityType}.${owner.selectorName}`,
						Object.keys(routeParamAlternatives[0] ?? {}),
						1,
						variantId,
						Object.fromEntries((owner.mapping.routeParamAlternatives[0] ?? []).map(({ param }, index) => [
							param,
							owner.mapping.probeAtoms[index],
						]))
					),
					...(node.selectorVariant.boundaryLiveOptional == null ? {} : { boundaryLiveOptional: node.selectorVariant.boundaryLiveOptional }),
					href: {
						...owner.mapping.href,
						...node.selectorVariant.href,
						params: node.selectorVariant.href?.params ?? [],
					},
					routeParamAlternatives: routeParamAlternatives.map((alternative) => Object.entries(alternative).map(([param, value]) => {
						const decode = routeParams.find((routeParam) => routeParam.name === param)?.decode
						return {
							param,
							value,
							...(typeof decode !== 'string' ? {} : { decode }),
						}
					})),
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
				routeParamAlternatives: normalizedMapping.routeParamAlternatives.map((alternative) => Object.fromEntries(alternative.map(({ param, value }) => [
					param,
					value,
				]))),
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
			node: {
				internalPath: routeId(routePath),
				svelteKitPath,
				publicPath: publicRouteId(routePath),
				params: routeParams,
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
) => node.selectorVariant?.mapping === mapping || node.detail?.mappings.some((detail) => (
	detail.entityType === mapping.entityType
	&& detail.selectorName === mapping.selectorName
)) === true

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
		params: [...params],
	}))
}

const entityRouteLinkKey = (routeLink: EntityRouteLink) => JSON.stringify({
	...routeLink,
	conditions: routeLink.conditions ?? [],
})

const routeLinkFromCollection = (
	node: RouteNode,
	collection: RouteNode['collectionMappings'][number]
): RouteLink | undefined => {
	const path = node.svelteKitPath
	const selector = collection.selector
	if (selector.kind === 'object') {
		const params: RouteLink['params'] = []
		for (const param of routeParamNames(path)) {
			const selectorField = selector.fields.find(({ value }) => (
				typeof value !== 'string'
				&& !('raw' in value)
				&& value.kind === 'param'
				&& value.name === param
			))
			if (selectorField == null)
				return undefined

			const decode = node.params.find((routeParam) => routeParam.name === param)?.decode
			params.push({
				param,
				value: {
					kind: 'field',
					name: selectorField.name,
				},
				...(typeof decode !== 'string' ? {} : { decode }),
			})
		}

		return {
			path,
			params,
		}
	}
	if (selector.kind !== 'selector')
		return routeParamNames(path).length === 0 ?
			{
				path,
				params: [],
			}
		:
			undefined

	const params: RouteLink['params'] = []
	for (const param of routeParamNames(path)) {
		const selectorParam = selector.params.find((item) => item.param === param)
		if (selectorParam == null)
			return undefined

		params.push({
			param,
			value: (
				'hrefValue' in selectorParam && selectorParam.hrefValue != null ?
					selectorParam.hrefValue
				: 'value' in selectorParam ?
					selectorParam.value
				:
					{
						kind: 'field',
						name: selectorParam.field,
					}
			),
			decode: selectorParam.decode,
		})
	}

	return {
		path,
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
	ancestorMappings?: readonly SelectorRouteMapping[],
	mappingsByNode = new Map<string, readonly SelectorRouteMapping[] | undefined>()
) => {
	for (const node of nodes) {
		const mappings = node.selectorVariant != null ?
			[node.selectorVariant.mapping]
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
			...(mapping.sourceSelection == null ? {} : { sourceSelection: mapping.sourceSelection }),
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

		const detailEntityTypes = unique(ownDetails.map((detail) => detail.entityType))
		for (const detailIdentity of detailEntityTypes) {
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
		const detailSourcesExpression = renderDispatchedSourceSelectionExpression(dispatchDetails)
		return {
			details: ownDetails,
			components: unique(ownDetails.map((detail) => detail.component)),
			hrefExpression: renderResolveExpression(href, hrefParamNames.map((param) => [param, `params.${param}`])),
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
					`data.entityType === EntityType.${detail.entityType} && data.selectorName === ${emitTypeScript(detail.selectorName)} ? ${componentIdentifier(detail.component)} : ${alternate}`
			), ''),
			detailSelectionExpression: `${detailEntityTypes.length === 1 ?
				`select(EntityType.${detailEntityTypes[0]}, data.selector`
			:
				'select(data.entityType, data.selector'}${detailSourcesExpression == null ? ')' : `, { sources: ${detailSourcesExpression} })`}`,
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
		...(node.detail == null || ownDetails.length === 0 || node.children.length === 0 ? [] : [{
			internalPath: node.internalPath,
			routePath: `${node.svelteKitPath.replace(/^\//, '')}/(${node.detail.group})`,
			files: [{
				kind: RouteFileKind.Layout,
				detailLayout,
			}],
		}]),
		...compileRouteEntries(node.children, routeNodeByInternalPath),
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
			...(!selectorMappingOwnsDetailPage(node, mapping) || mapping.href?.entityHref === false ? [] : mapping.routeParamAlternatives.flatMap((routeParams) => node.params.flatMap(({ name }) => (
				routeParams.some(({ param }) => param === name) ?
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
			...node.selectorVariant.mapping.routeParamAlternatives.flatMap((routeParams) => node.params.flatMap(({ name }) => (
				routeParams.some(({ param }) => param === name) ?
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

const validateCompiledRoutes = (
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
				[`${node.internalPath} normalized route node did not produce a route entry`]
		)),
	]
	if (errors.length > 0)
		throw new Error(errors.join('\n'))
}

const sourceBindings = (source: App['sources']['sources'][number]) => [
	...(source.binding == null ? [] : [source.binding]),
	...(source.bindings ?? []),
]

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

// Compilation is the only phase that interprets APP.ts. It validates and indexes
// domain facts first, then hands a closed set of facts to deterministic emitters.
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

		for (const endpoint of binding.endpoints) {
			if (endpoint.endpointKind !== SourceEndpointKind.HttpUrl && endpoint.corsEnabled != null)
				throw new Error(`${source}: corsEnabled is only valid on HTTP endpoints`)
			if (endpoint.endpointKind !== SourceEndpointKind.HttpUrl && binding.delivery === SourceDelivery.HttpProxy)
				throw new Error(`${source}: HttpProxy requires HTTP endpoints`)
			if (
				endpoint.endpointKind === SourceEndpointKind.HttpUrl
				&& binding.delivery === SourceDelivery.BrowserDirect
				&& endpoint.corsEnabled !== true
			)
				throw new Error(`${source}: BrowserDirect HTTP endpoint requires corsEnabled true`)
			if (
				endpoint.endpointKind === SourceEndpointKind.HttpUrl
				&& binding.delivery === SourceDelivery.HttpProxy
				&& endpoint.origin == null
			)
				throw new Error(`${source}: HttpProxy HTTP endpoint requires an origin`)
			if (
				endpoint.endpointKind === SourceEndpointKind.HttpUrl
				&& binding.delivery === SourceDelivery.HttpProxy
				&& endpoint.origin?.includes('{') === true
			)
				throw new Error(`${source}: HttpProxy requires concrete HTTP origins`)
			if (
				endpoint.endpointKind === SourceEndpointKind.HttpUrl
				&& endpoint.origin != null
				&& !endpoint.origin.includes('{')
				&& new URL(endpoint.origin).origin !== endpoint.origin
			)
				throw new Error(`${source}: HTTP endpoint origin must be canonical`)
		}

		if (
			binding.delivery === SourceDelivery.RemoteLive
			&& binding.wireProtocol === WireProtocol.Grpc
			&& (
				binding.apiFamily !== ApiFamily.GrpcService
				|| binding.endpoints.some((endpoint) => endpoint.endpointKind !== SourceEndpointKind.HttpUrl)
			)
		)
			throw new Error(`${source}: managed RemoteLive gRPC requires GrpcService over HTTP endpoints`)
		if (
			binding.delivery === SourceDelivery.RemoteLive
			&& binding.wireProtocol !== WireProtocol.Grpc
			&& !(
				binding.endpoints.every((endpoint) => endpoint.endpointKind === SourceEndpointKind.WebSocketUrl)
				|| (
					binding.endpoints.length >= 2
					&& binding.endpoints[0]?.endpointKind === SourceEndpointKind.HttpUrl
					&& binding.endpoints.slice(1).every((endpoint) => endpoint.endpointKind === SourceEndpointKind.WebSocketUrl)
				)
			)
		)
			throw new Error(`${source}: RemoteLive requires WebSocket endpoints with at most one leading HTTP endpoint`)
		if (
			binding.delivery === SourceDelivery.BrowserDirect
			&& binding.credentials.some((credential) => (
				credential.scope === SourceCredentialScope.RuntimeSecret
				|| credential.scope === SourceCredentialScope.LocalSecret
			))
		)
			throw new Error(`${source}: browser delivery cannot require runtime/local secrets`)
		if (
			binding.delivery === SourceDelivery.HttpProxy
			&& binding.credentials.some((credential) => credential.scope === SourceCredentialScope.LocalSecret)
		)
			throw new Error(`${source}: HttpProxy cannot require local secrets`)

		const runtimeSecrets = binding.credentials.filter((credential) => (
			credential.scope === SourceCredentialScope.RuntimeSecret
		))
		if (binding.delivery === SourceDelivery.HttpProxy && runtimeSecrets.length > 1)
			throw new Error(`${source}: HttpProxy accepts one runtime secret`)
		for (const runtimeSecret of binding.delivery === SourceDelivery.HttpProxy ? runtimeSecrets : []) {
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
	const sourceProviderPlans = sourceProviders.map((provider) => {
		const providerSources = sources.filter((source) => source.provider === provider.provider)
		const providerBindings = compiledSourceBindings.filter((sourceBinding) => sourceBinding.provider === provider.provider)

		return {
			provider,
			sources: providerSources,
			bindings: providerBindings,
		}
	})
	const resolverModules = Object.freeze([...app.resolvers.modules])
	const navigationItems = Object.freeze([...app.navigation.items])
	const activeEntities = Object.freeze([...app.schema.entities]
		.sort((left, right) => left.entityType.localeCompare(right.entityType, 'en', {
			sensitivity: 'base',
			numeric: true,
		})))
	const entityTypes = Object.freeze(unique(activeEntities.map((entity) => entity.entityType)))
	const entityByType = new Map(activeEntities.map((entity) => [entity.entityType, entity]))
	const compiledEntityByType = nullPrototypeRecord([...entityByType])
	const valueTypeById = new Map(app.schema.valueTypes.map((valueType) => [valueType.id, valueType]))
	const sourceIds = new Set(sources.map((source) => source.source))
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

	const compiledRoutes = compileRouteTree(
		app.routes.children,
		{
			entityByType,
			compiledEntityByType,
			entityFacetByPath,
			valueTypeById,
			routeParamValueTypesByOwner,
		}
	)
	const indexedRouteNodes = flattenRouteNodes(compiledRoutes.nodes)
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
	validateNormalizedRouteNodes(indexedRouteNodes)
	const routeEntryList = Object.freeze(compileRouteEntries(compiledRoutes.nodes, routeNodeByInternalPath))
	validateCompiledRoutes(routeNodeByInternalPath, routeEntryList)
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
	for (const { node, mapping } of indexedRouteNodes.flatMap((node) => node.selectorMappings.map((mapping) => ({
		node,
		mapping,
	}))))
		if (
			mapping.href?.entityHref === false
			&& !indexedRouteNodes.some((candidateNode) => candidateNode.selectorMappings.some((candidateMapping) => (
				candidateMapping.entityType === mapping.entityType
				&& candidateMapping.href?.entityHref !== false
				&& selectorMappingOwnsDetailPage(candidateNode, candidateMapping)
			))))
			throw new Error(`${node.internalPath} ${mapping.entityType}.${mapping.selectorName} suppresses its entity href without a canonical entity route`)
	for (const { node, mapping } of indexedRouteNodes.flatMap((node) => node.selectorMappings.map((mapping) => ({
		node,
		mapping,
	}))))
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
	const collectionRouteBySourceField = new Map<string, RouteLink>()
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
			if (
				collectionRouteBySourceField.get(key) == null
				|| collectionRouteLink.path.length < (collectionRouteBySourceField.get(key)?.path.length ?? 0)
			)
				collectionRouteBySourceField.set(key, collectionRouteLink)
		}

		for (const mapping of [
			...node.selectorMappings,
			...(node.selectorVariant == null ? [] : [node.selectorVariant.mapping]),
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
		sources,
		sourceProviderPlans,
		sourceBindings: compiledSourceBindings,
		resolverModules,
		navigationItems,
		routeNodesByPublicPath: nullPrototypeRecord([...routeNodesByPublicPath]),
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
		collectionRouteBySourceField: nullPrototypeRecord([...collectionRouteBySourceField]),
		entityRouteLinksByType: nullPrototypeRecord([...entityRouteLinksByType]),
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

	// Emitters receive only the indexes and ordered plans they consume. APP.ts is
	// deliberately not available below this boundary.
	const generationInput = {
		indexes: {
			collectionRouteByEntity: compiledApp.collectionRouteByEntity,
			collectionRouteBySourceField: compiledApp.collectionRouteBySourceField,
			entityByType: compiledApp.entityByType,
			entityFacetByPath: compiledApp.entityFacetByPath,
			entityRouteLinksByType: compiledApp.entityRouteLinksByType,
			facetAncestorConditionsByPath: compiledApp.facetAncestorConditionsByPath,
			facetDependencyConditionsByPath: compiledApp.facetDependencyConditionsByPath,
			routeNodesByPublicPath: compiledApp.routeNodesByPublicPath,
			sourceBindings: compiledApp.sourceBindings,
			valueTypeById: compiledApp.valueTypeById,
		},
		entities: compiledApp.activeEntities,
		sources: compiledApp.sources,
		sourceProviderPlans: compiledApp.sourceProviderPlans,
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
	const sourceProviders = generationInput.sourceProviderPlans.map(({ provider }) => provider)
	const sourceProviderNames = sourceProviders.map(({ provider }) => provider)
	const sourceArtifacts = indexes.sourceBindings.flatMap((sourceBinding) => (
		(sourceBinding.binding.artifacts ?? []).map((artifact, artifactIndex) => ({
			...sourceBinding,
			artifact,
			artifactIndex,
		}))
	))
	const namedSourceSelections = [...new Map(unique(generationInput.entities.flatMap(entityNamedSourceSelections))
		.map((selection) => [sourceSelectionFunctionName(selection), {
			selection,
			functionName: sourceSelectionFunctionName(selection),
		}] as const)).values()]
	const entityViewFiles = [
		...generationInput.entities.flatMap((entity) => [
			generateSingularViewFile(entity, indexes),
			generatePluralViewFile(entity, indexes),
		]),
	]
	const routeFiles = generationInput.physicalRouteFiles.flatMap((plan) => generateRouteFiles(plan, indexes))
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
				sourceArtifacts,
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
		...generationInput.sourceProviderPlans.flatMap((sourceProviderPlan) => [
			generateSourceProviderBindingsFile(sourceProviderPlan),
			generateSourceProviderDefinitionFile(sourceProviderPlan),
		]),
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

const generateEntitySchemaFile = (entity: Entity, indexes: GenerationIndexes) => {
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
			emitImportObject(indexes.valueTypeById[field.valueType]?.imports)
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
				...(entity.facets == null || entity.facets.length === 0 ? [] : ['facet']),
			],
		},
		{
			from: '$/schema/EntityFieldCardinality.ts',
			names: ['EntityFieldCardinality'],
		},
		{
			from: '$/schema/EntityFieldType.ts',
			names: ['EntityFieldType'],
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
		['label', fieldDefinition.label == null ? undefined : emitTypeScript(fieldDefinition.label)],
		['labelPlural', fieldDefinition.labelPlural == null ? undefined : emitTypeScript(fieldDefinition.labelPlural)],
		['description', fieldDefinition.description == null ? undefined : emitTypeScript(fieldDefinition.description)],
		['type', enumAccess('EntityFieldType', fieldDefinition.type)],
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
		'export interface RegisteredEntityDefinitionByType {',
		...entityTypes.map((entityType) => `\treadonly [EntityType.${entityType}]: typeof ${entityType}Schema`),
		'}',
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
				{
					from: '$/schema/EntityType.ts',
					names: ['EntityType'],
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
		...emitMarkdownTable(
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
		...emitMarkdownTable(
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
		...emitMarkdownTable(
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
		...emitMarkdownTable(
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
		...emitMarkdownTable(
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
		...emitMarkdownTable(
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
			...lines(`export type SourceTarget =
	| {
		kind: SourceTargetKind.Caip2Network
		key: Caip2NetworkKey
	}
	| {
		kind: SourceTargetKind.NetworkSlug
		key: NetworkSlug
	}
	| {
		kind: Exclude<SourceTargetKind, SourceTargetKind.Caip2Network | SourceTargetKind.NetworkSlug>
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

export type SourceBinding<
	_Source extends Source = Source,
> = {
	source: _Source
	target: SourceTarget
	endpoints: readonly SourceEndpoint[]
	wireProtocol: WireProtocol
	apiFamily: ApiFamily
	operationGroups: readonly SourceOperationGroup[]
	delivery: SourceDelivery
	credentials: readonly SourceCredentialRequirement[]
	artifacts?: readonly SourceArtifact[]
}

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
	source,
	target.kind,
	target.key,
	delivery,
	apiFamily,
])

export type SourceBindingIndex = {
	readonly [_Source in Source]?:
		| SourceBinding<_Source>
		| readonly SourceBinding<_Source>[]
}

export const indexSourceBindings = <
	_Index extends SourceBindingIndex,
>(
	bindings: readonly SourceBinding[]
) => Object.fromEntries(
	Object.entries(Object.groupBy(bindings, ({ source }) => source))
		.map(([source, sourceBindings]) => [
			source,
			sourceBindings.length === 1 ? sourceBindings[0] : sourceBindings,
		])
) as _Index`),
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

export const sourceBindingId = ({
	source,
	target,
	delivery,
	apiFamily,
}: {
	source: string
	target: {
		kind: string
		key: string
	}
	delivery: string
	apiFamily: string
}) => JSON.stringify([
	source,
	target.kind,
	target.key,
	delivery,
	apiFamily,
])

const emitSourceBinding = (
	source: string,
	binding: NonNullable<App['sources']['sources'][number]['binding']>,
	expressions: {
		endpoints: string
		operationGroups: string
		credentials: string
		artifacts?: string
	}
) => emitObject([
	['source', enumAccess('Source', source)],
	['target', emitObject([
		['kind', enumAccess('SourceTargetKind', binding.target.kind)],
		['key', emitTypeScript(binding.target.key)],
	])],
	['endpoints', expressions.endpoints],
	['wireProtocol', enumAccess('WireProtocol', binding.wireProtocol)],
	['apiFamily', enumAccess('ApiFamily', binding.apiFamily)],
	['operationGroups', expressions.operationGroups],
	['delivery', enumAccess('SourceDelivery', binding.delivery)],
	['credentials', expressions.credentials],
	['artifacts', expressions.artifacts],
])

// Repeated array-valued binding properties become source-local constants.
// Every returned declaration therefore has at least two direct binding users.
const planSharedBindingValues = (
	source: string,
	expressions: readonly (string | undefined)[],
	valueNames: readonly string[]
) => {
	const sharedExpressions = unique(expressions.filter((expression): expression is string => (
		expression != null
		&& expressions.filter((candidate) => candidate === expression).length > 1
	)))
	const sharedValueNames = sharedExpressions.map((expression) => valueNames[expressions.indexOf(expression)])
	const nameByExpression = new Map(sharedExpressions.map((expression, index) => [
		expression,
		`${camel(source)}${sharedValueNames[index]}${sharedValueNames.filter((valueName) => valueName === sharedValueNames[index]).length === 1 ? '' : index + 1}`,
	]))

	return {
		declarations: sharedExpressions.map((expression) => `const ${nameByExpression.get(expression)} = ${expression} as const`),
		expressions: expressions.map((expression) => (
			nameByExpression.get(expression ?? '') ?? expression
		)),
	}
}

const generateSourceProviderBindingsFile = ({
	provider,
	bindings,
}: CompiledSourceProviderFacts) => {
	const bindingsBySource = Object.groupBy(bindings, ({ source }) => source)

	// Binding rows keep scalar executable axes inline. Exact array values repeated
	// by one source are emitted once above the default export.
	const sourcePlans = Object.entries(bindingsBySource).map(([source, sourceBindings]) => {
		const properties = {
			endpoints: planSharedBindingValues(
				source,
				sourceBindings.map(({ binding }) => emitArray(binding.endpoints.map((endpoint) => emitObject([
					['endpointKind', enumAccess('SourceEndpointKind', endpoint.endpointKind)],
					['locator', emitTypeScript(endpoint.locator)],
					['origin', endpoint.origin == null ? undefined : emitTypeScript(endpoint.origin)],
					['corsEnabled', endpoint.corsEnabled == null ? undefined : String(endpoint.corsEnabled)],
				])))),
				sourceBindings.map(({ binding }) => `${binding.target.kind}${pascal(generatedIdentifier(binding.target.key))}Endpoints`)
			),
			operationGroups: planSharedBindingValues(
				source,
				sourceBindings.map(({ binding }) => emitArray(binding.operationGroups.map((group) => enumAccess('SourceOperationGroup', group)))),
				sourceBindings.map(({ binding }) => `${binding.operationGroups.join('')}OperationGroups`)
			),
			credentials: planSharedBindingValues(
				source,
				sourceBindings.map(({ binding }) => emitArray(binding.credentials.map((credential) => emitObject([
					['scope', enumAccess('SourceCredentialScope', credential.scope)],
					['env', 'envKey' in credential ? undefined : emitEnvSchema(credential.env)],
					['keys', 'envKey' in credential || credential.keys == null ? undefined : emitArray(credential.keys.map(emitTypeScript))],
				])))),
				sourceBindings.map(() => 'Credentials')
			),
			artifacts: planSharedBindingValues(
				source,
				sourceBindings.map(({ binding }) => (
					binding.artifacts == null ?
						undefined
					:
						emitArray(binding.artifacts.map((artifact) => emitObject([
							['kind', enumAccess('SourceArtifactKind', artifact.kind)],
							['path', emitTypeScript(artifact.path)],
							['generated', String(artifact.generated)],
							['officialUrl', artifact.officialUrl == null ? undefined : emitTypeScript(artifact.officialUrl)],
							['referenceUrl', artifact.referenceUrl == null ? undefined : emitTypeScript(artifact.referenceUrl)],
						])))
				)),
				sourceBindings.map(() => 'Artifacts')
			),
		}

		return {
			source,
			declarations: Object.values(properties).flatMap(({ declarations }) => declarations),
			bindings: sourceBindings.map(({ binding }, index) => emitSourceBinding(source, binding, {
				endpoints: properties.endpoints.expressions[index] ?? '[]',
				operationGroups: properties.operationGroups.expressions[index] ?? '[]',
				credentials: properties.credentials.expressions[index] ?? '[]',
				artifacts: properties.artifacts.expressions[index],
			})),
		}
	})
	const indexedBindings = sourcePlans.flatMap(({ source, bindings }) => bindings.map((binding) => ({
		source,
		binding,
	})))
	const bindingTypeBySource = sourcePlans.map(({ source, bindings: sourceBindings }) => {
		const bindingTypes = indexedBindings.flatMap(({ source: bindingSource }, index) => (
			bindingSource === source ? [`typeof bindings[${index}]`] : []
		))
		return [
			`readonly [Source.${source}]: `,
			sourceBindings.length === 1 ?
				bindingTypes[0]
			:
				`readonly [${bindingTypes.join(', ')}]`,
		].join('')
	})
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
				...sourcePlans.flatMap(({ declarations }) => (
					declarations.length === 0 ? [] : [...declarations, '']
				)),
				'const bindings = [',
				...indexedBindings.map(({ binding }) => `${indent(binding)},`),
				'] as const satisfies readonly SourceBinding[]',
				'',
				...(
					bindingTypeBySource.length === 1 ?
						[`export default indexSourceBindings<{ ${bindingTypeBySource[0]} }>(bindings)`]
					:
						[
							'export default indexSourceBindings<{',
							...bindingTypeBySource.map((bindingType) => `\t${bindingType}`),
							'}>(bindings)',
						]
				),
			],
		}
	)
}

const generateSourceProviderDefinitionFile = ({
	provider,
	sources,
	bindings,
}: CompiledSourceProviderFacts) => tsFile(
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
) => tsFile(
	'src/sources/$sourceServerCredentials.server.ts',
	{
		imports: [{
			from: '$/sources/SourceBinding.ts',
			typeNames: ['SourceServerCredentialDefinition'],
		}],
		body: [
			'export default new Map<',
			'\tstring,',
			'\tSourceServerCredentialDefinition',
			`>(${emitArray(sourceBindings.flatMap(({ binding, source }) => {
				const runtimeSecret = binding.credentials.find((credential) => (
					credential.scope === SourceCredentialScope.RuntimeSecret
					&& 'envKey' in credential
				))
				if (runtimeSecret == null)
					return []

				return [emitArray([
					emitTypeScript(sourceBindingId({
						source: String(source),
						target: binding.target,
						delivery: binding.delivery,
						apiFamily: binding.apiFamily,
					})),
					emitObject([
						['envKey', emitTypeScript(runtimeSecret.envKey)],
						['injection', emitTypeScript({
							kind: 'value',
							value: runtimeSecret.injection,
						})],
					]),
				])]
			}))})`,
		],
	}
)

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
				from: '$/resolvers/$resolvers.ts',
				typeNames: ['SourceResolverModule'],
			},
			{
				from: '$/schema/index.ts',
				typeNames: ['schema'],
			},
				{
					from: '$/sources/Source.ts',
					names: ['Source'],
				},
		],
		body: [
			'const resolverLoaderEntries = [',
			...resolverModules.map((module) => (
				`\t[Source.${module.source}, () => import(${emitTypeScript(module.path.replace(/^src\/resolvers\//, './'))})],`
			)),
			'] as const satisfies readonly (readonly [Source, () => Promise<{ default: SourceResolverModule<typeof schema, Source> }>])[]',
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
			if (
				field.cardinality !== EntityFieldCardinality.Many
				&& field.cardinality !== EntityFieldCardinality.ZeroOrMany
			)
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
		valueTypeTypeIsStructured(valueTypeType)
		|| valueTypeType != null && 'primitive' in valueTypeType && valueTypeType.primitive === 'unknown'
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
			if (
				valueTypeTypeIsStructured(valueTypeType)
				|| valueTypeType != null && 'primitive' in valueTypeType && valueTypeType.primitive === 'unknown'
			)
				throw new Error(`${entity.entityType}.${fieldName} needs a valueType displayExpression before it can be rendered`)

			if (fieldDefinition?.cardinality === EntityFieldCardinality.Many || fieldDefinition?.cardinality === EntityFieldCardinality.ZeroOrMany)
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

	if (!/\bvalue\b/.test(expression))
		return parenthesizedNullishExpression(expression)

	if (fieldDefinition?.cardinality === EntityFieldCardinality.Many || fieldDefinition?.cardinality === EntityFieldCardinality.ZeroOrMany)
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
			[
				`${'\t'.repeat(level)}<NumberValue`,
				`${'\t'.repeat(level + 1)}value={${valueExpression}}`,
				...(decimalPlacesExpression == null ? [] : [
					`${'\t'.repeat(level + 1)}decimalPlaces={${decimalPlacesExpression}}`,
				]),
				`${'\t'.repeat(level)}/>`,
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
					`${'\t'.repeat(level)}{${valueExpression}.join(', ')}`,
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
				&& entitySelectorOwnsField(entity, fieldNameForReference(fieldReference))
		)
	)
	if (typeof viewEntry === 'string' || isProjectionFieldReference(viewEntry as FieldReference)) {
		// A pending root entity cannot contain projection rows. Plural summaries
		// provide an explicit field expression after their ProjectionBoundary.
		if (isProjectionFieldReference(viewEntry as FieldReference) && itemFieldExpression == null)
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
	const affixed = [
			viewEntry.prefix == null ?
				undefined
			: typeof viewEntry.prefix === 'string' ?
				emitTypeScript(viewEntry.prefix)
			:
				renderExpression(viewEntry.prefix, {
					fields: viewEntryFieldsExpression,
					...(itemFieldExpression == null ? {} : {
						fieldExpressionByName: Object.fromEntries(entity.fields.map((field) => [
							field.name,
							renderFieldExpression(field.name),
						])),
					}),
				}),
			displayed,
			viewEntry.suffix == null ?
				undefined
			: typeof viewEntry.suffix === 'string' ?
				emitTypeScript(viewEntry.suffix)
			:
				renderExpression(viewEntry.suffix, {
					fields: viewEntryFieldsExpression,
					...(itemFieldExpression == null ? {} : {
						fieldExpressionByName: Object.fromEntries(entity.fields.map((field) => [
							field.name,
							renderFieldExpression(field.name),
						])),
					}),
				}),
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

const declarativeSummaryViewEntries = (entity: Entity) => {
	const summary = entitySingularView(entity)?.summary
	return [
		...viewItems(summary?.icon),
		...summarySerialItems(entity),
		...viewItems(summary?.title),
		...viewItems(summary?.value),
		...viewItems(summary?.titleFallback),
		...viewItems(summary?.HeadingAfter),
	]
}

const declarativeSummaryQueryFieldReferences = (
	entity: Entity,
	indexes: GenerationIndexes,
	visitedEntityTypes = new Set<EntityType>()
): FieldReference[] | undefined => {
	if (
		entitySingularView(entity)?.summary?.Icon != null
		|| entitySingularView(entity)?.summary?.Title != null
		|| entitySingularView(entity)?.summary?.Value != null
		|| visitedEntityTypes.has(entity.entityType)
	)
		return undefined

	const nestedVisitedEntityTypes = new Set([
		...visitedEntityTypes,
		entity.entityType,
	])
	const fields: FieldReference[] = []
	for (const fieldReference of declarativeSummaryViewEntries(entity).flatMap((viewEntry) => [
			...itemFieldReferences(viewEntry),
			...viewItemDisplayFieldReferences(viewEntry),
		])) {
		if (isProjectionFieldReference(fieldReference))
			return undefined

		const fieldDefinition = fieldDefinitionByReference(entity, fieldReference, indexes)
		if (fieldDefinition == null || fieldDefinition.type === EntityFieldType.EntitiesReference)
			return undefined
		if (fieldDefinition.type !== EntityFieldType.EntityReference) {
			if (!entitySelectorOwnsField(entity, fieldNameForReference(fieldReference)))
				fields.push(fieldReference)
			continue
		}
		if (
			fieldDefinition.entityType == null
			|| fieldDefinition.cardinality !== EntityFieldCardinality.One
		)
			return undefined

		const targetEntity = indexes.entityByType[fieldDefinition.entityType]
		if (targetEntity == null)
			return undefined

		const targetSummaryFields = declarativeSummaryQueryFieldReferences(
			targetEntity,
			indexes,
			nestedVisitedEntityTypes
		)
		if (targetSummaryFields == null)
			return undefined
		if (targetSummaryFields.length === 0)
			fields.push(fieldReference)
		else
			fields.push(...targetSummaryFields.map((targetFieldReference) => (
				`${fieldReference}.${fieldReferenceKey(targetFieldReference)}`
			)))
	}

	return unique(fields)
}

const allViewItems = (entity: Entity, indexes: GenerationIndexes) => {
	const singularView = entitySingularView(entity)
	const content = singularView?.content
	const details = singularView?.details

	return viewItemTree([
		...declarativeSummaryViewEntries(entity),
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
		...[...expressionImportMap.entries()].map(([from, names]) => ({
			from,
			names: [...names],
		})),
	]
}

const viewUsesFormat = (entity: Entity, indexes: GenerationIndexes, formats: readonly string[]) => (
	allViewItems(entity, indexes).some((viewEntry) => {
		const format = viewItemFormat(entity, indexes, viewEntry)
		return format != null && formats.includes(format)
	})
)

const declaredSummaryTitleEntries = (entity: Entity) => viewItems(entitySingularView(entity)?.summary?.title)
const declaredSummaryValueEntries = (entity: Entity) => viewItems(entitySingularView(entity)?.summary?.value)

const summaryVisualFieldKeys = (entity: Entity) => new Set(
	declarativeSummaryViewEntries(entity)
		.flatMap(itemFieldReferences)
		.map(fieldReferenceKey)
)

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

	const summaryFieldKeys = summaryVisualFieldKeys(entity)
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
	const summaryFieldKeys = summaryVisualFieldKeys(entity)
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

	const body = renderSerialBody(entity, indexes, serial, 'entity', 4, label, (viewEntry) => {
		const fieldReferences = [
			...itemFieldReferences(viewEntry),
			...viewItemDisplayFieldReferences(viewEntry),
		]
		const usesSelectorFields = fieldReferences.some((fieldReference) => (
			!isProjectionFieldReference(fieldReference)
			&& entitySelectorOwnsField(entity, fieldNameForReference(fieldReference))
		))
		const usesResolvedFields = fieldReferences.some((fieldReference) => (
			isProjectionFieldReference(fieldReference)
			|| !entitySelectorOwnsField(entity, fieldNameForReference(fieldReference))
		))
		if (usesSelectorFields && usesResolvedFields)
			throw new Error(`${entity.entityType} serial fallback item mixes selector and resolved fields`)

		return usesSelectorFields ? 'selection.entitySelector' : 'entity'
	})
	return [
		`\t\t<ResourceBoundary resource={${entityName}}>`,
		'\t\t\t{#snippet children(entity)}',
		...body,
		'\t\t\t{/snippet}',
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

const generateSingularViewFile = (entity: Entity, indexes: GenerationIndexes) => {
	const singularView = entitySingularView(entity)
	const viewQuery = singularView?.query
	const content = singularView?.content
	const details = singularView?.details
	const componentName = singularComponentName(entity.entityType)
	const contentWarning = singularView?.contentWarning
	const serial = summarySerial(entity)
	const everySelectorOwnsSerial = serial != null && entitySelectorOwnsField(entity, serial.field)
	const summaryTitleEntries = declaredSummaryTitleEntries(entity)
	const summaryValueEntries = declaredSummaryValueEntries(entity)
	const summaryAfterEntries = viewItems(singularView?.summary?.HeadingAfter)
	for (const viewEntry of declarativeSummaryViewEntries(entity)) {
		const fieldReference = itemFieldReferences(viewEntry)[0]
		if (
			fieldReference != null
			&& fieldDefinitionByReference(entity, fieldReference, indexes)?.type === EntityFieldType.EntitiesReference
		)
			throw new Error(`${entity.entityType}.${fieldNameForReference(fieldReference)} cannot render an entity list in a scalar summary`)
	}
	const configuredSummaryTitleItems = viewItems(singularView?.summary?.title)
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
			summaryValueEntries.length === 0
			|| summaryValueEntries.every((viewEntry) => itemFieldReferences(viewEntry)[0] === serial.field)
		)
	)
	const universalSelectorFieldNames = new Set(
		[...entitySelectorFieldNames(entity)]
			.filter((fieldName) => entitySelectorOwnsField(entity, fieldName))
	)
	const summaryViewEntries = declarativeSummaryViewEntries(entity)
	const summaryDisplayFieldKeys = new Set(
		summaryViewEntries
			.flatMap(viewItemDisplayFieldReferences)
			.map(fieldReferenceKey)
	)
	const queryFields = [...new Map([
		...(viewQuery?.fields ?? []),
		...(contentWarning == null ? [] : [
			contentWarning.sensitiveField,
			contentWarning.textField,
		]),
		...summaryViewEntries.flatMap((viewEntry) => [
			...itemFieldReferences(viewEntry),
			...viewItemDisplayFieldReferences(viewEntry),
		]),
	].map((fieldReference) => [fieldReferenceKey(fieldReference), fieldReference])).values()].filter((fieldReference) => {
		const fieldDefinition = fieldDefinitionByReference(entity, fieldReference, indexes)
		return (
			summaryDisplayFieldKeys.has(fieldReferenceKey(fieldReference))
			|| fieldDefinition != null
			&& !isProjectionFieldReference(fieldReference)
			&& !universalSelectorFieldNames.has(fieldReference)
			&& fieldDefinition.type !== EntityFieldType.EntityReference
			&& fieldDefinition.type !== EntityFieldType.EntitiesReference
		)
	})
	const sections = declaredRelationshipViewSections(entity)
	const detailsTabs = details?.tabs ?? []
	const entityReferenceTypes = (viewEntries: readonly _ViewItem[]) => viewEntries.flatMap((viewEntry) => {
		const fieldName = itemFieldReferences(viewEntry)[0]
		const fieldDefinition = fieldName == null ? undefined : fieldDefinitionByReference(entity, fieldName, indexes)
		return fieldDefinition?.type === EntityFieldType.EntityReference && fieldDefinition.entityType != null ?
			[fieldDefinition.entityType]
		:
			[]
	})
	const summaryTitleEntityReferenceItems = entityReferenceTypes(rendersSerialTitle ? [] : summaryTitleEntries)
	const summaryValueEntityReferenceItems = entityReferenceTypes(rendersSerialValue ? [] : summaryValueEntries)
	const summaryAfterEntityReferenceItems = entityReferenceTypes(summaryAfterEntries)
	const summaryEntityReferenceItems = [
		...summaryTitleEntityReferenceItems,
		...summaryValueEntityReferenceItems,
		...summaryAfterEntityReferenceItems,
	]
	const summaryItemsNeedMarkup = (items: readonly _ViewItem[]) => (
		items.some((viewEntry) => {
			const fieldReference = itemFieldReferences(viewEntry)[0]
			return (
				fieldReference != null
				&& (
					isProjectionFieldReference(fieldReference)
					|| fieldDefinitionByReference(entity, fieldReference, indexes)?.type === EntityFieldType.EntityReference
					|| viewItemDisplayExpressions(viewEntry).length > 0
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
	const summaryTitleNeedsMarkup = contentWarning == null && summaryItemsNeedMarkup(summaryTitleEntries)
	const summaryValueNeedsMarkup = contentWarning == null && summaryItemsNeedMarkup(summaryValueEntries)
	const summaryIconFieldName = itemFieldReferences(singularView?.summary?.icon ?? '')[0]
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
	const entityReferenceItems = entityReferenceTypes([
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
	const rawSnippets = entityRawSnippets(entity)
	const rawSnippetComponentNames = new Set(
		rawSnippets.flatMap((snippet) => svelteComponentNames(snippet.raw))
	)
	const usesSelect = (
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
		|| rawSnippets.some((snippet) => snippet.raw.includes('select('))
	)
	const sectionComponents = unique([...sections, ...detailsTabSections].flatMap((section) => {
		const fieldDefinition = fieldDefinitionByReference(entity, section.field, indexes)
		const component = fieldDefinition == null ? undefined : declaredRelationshipSectionComponent(section, indexes)
		return component == null ? [] : [component]
	}).concat(
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
		carouselsToRender.flatMap((carousel) => carousel.sections.flatMap((section) => {
			const component = carouselSectionComponent(entity, indexes, section)
			return component == null ? [] : [component]
		})),
		Object.values(indexes.entityByType).flatMap((candidate) => [
			singularComponentName(candidate.entityType),
			pluralComponentName(candidate),
		].filter((component) => (
			component !== singularComponentName(entity.entityType)
			&& rawSnippetComponentNames.has(component)
		))),
		...(summaryIconEntityReferenceComponent == null ? [] : [summaryIconEntityReferenceComponent])
	))
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
		|| [
			singularView?.summary?.Icon?.raw,
			singularView?.summary?.Title?.raw,
			singularView?.summary?.Value?.raw,
		].some((raw) => raw?.includes(`resource={${camel(entity.entityType)}}`))
	)
	const sectionQueries = sections.map((section) => renderQuery(section.selection, []))
	const latestQueries = latestItems.map((latest) => renderQuery(latest.query, latest.fields ?? []))
	const carouselQueries = carouselsToRender.flatMap((carousel) => carousel.sections.flatMap((section) => (
		carouselSectionComponent(entity, indexes, section) == null ?
			[]
		:
			[renderQuery(section.selection, [])]
	)))
	const summaryItemEntityFieldsExpression = (viewEntry: _ViewItem) => {
		const fieldReferences = [
			...itemFieldReferences(viewEntry),
			...viewItemDisplayFieldReferences(viewEntry),
		]
		const usesSelectorFields = fieldReferences.some((fieldReference) => (
			!isProjectionFieldReference(fieldReference)
			&& entitySelectorOwnsField(entity, fieldNameForReference(fieldReference))
		))
		const usesResolvedFields = fieldReferences.some((fieldReference) => (
			isProjectionFieldReference(fieldReference)
			|| !entitySelectorOwnsField(entity, fieldNameForReference(fieldReference))
		))
		if (usesSelectorFields && usesResolvedFields)
			throw new Error(`${entity.entityType} summary item mixes selector and resolved fields`)

		return usesSelectorFields ? 'selection.entitySelector' : 'entity'
	}
	// Selector-owned summary values read the canonical selector directly. The
	// prefetched row directly owns unresolved fields. A merged pending object is
	// reserved for expressions that genuinely combine both shapes.
	const pendingSummaryItemFieldsExpression = (viewEntry: _ViewItem) => {
		const fieldReferences = [
			...itemFieldReferences(viewEntry),
			...viewItemDisplayFieldReferences(viewEntry),
		]
		const selectorOwned = fieldReferences.filter((fieldReference) => (
			!isProjectionFieldReference(fieldReference)
			&& entitySelectorOwnsField(entity, fieldNameForReference(fieldReference))
		)).length
		if (selectorOwned === fieldReferences.length)
			return 'selection.entitySelector'
		if (selectorOwned === 0 && entitySingularView(entity)?.pending == null)
			return 'prefetched'

		return pendingEntityExpression
	}
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
		viewItems(singularView?.summary?.titleFallback),
		pendingSummaryItemFieldsExpression
	)
	const fallbackTitleEntries = viewItems(singularView?.summary?.titleFallback)
	const pendingTitleIsRequiredScalar = (
		viewEntriesRenderRequiredScalar(entity, indexes, summaryTitleEntries)
		&& summaryTitleEntries[0] != null
		&& pendingSummaryItemFieldsExpression(summaryTitleEntries[0]) === 'selection.entitySelector'
	)
	const fallbackTitleIsRequiredScalar = (
		viewEntriesRenderRequiredScalar(entity, indexes, fallbackTitleEntries)
		&& fallbackTitleEntries[0] != null
		&& pendingSummaryItemFieldsExpression(fallbackTitleEntries[0]) === 'selection.entitySelector'
	)
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
	const titleFallbackExpression = contentWarning == null ?
		renderFirstDeclaredExpression([
			serialFallbackTitleExpression,
			...(serialFallbackTitleIsRequiredScalar ? [] : [emitTypeScript(displayLabel(entityLabel(entity)))]),
		])
	:
		renderConditionalExpression(
			[{
				condition: warningConditionExpression(pendingEntityExpression),
				value: warningSummaryExpression(pendingEntityExpression),
			}],
			renderFirstDeclaredExpression([
				serialFallbackTitleExpression,
				...(serialFallbackTitleIsRequiredScalar ? [] : [emitTypeScript(displayLabel(entityLabel(entity)))]),
			])
		)
	const entityTitleFallbackExpression = contentWarning == null ?
		renderFirstDeclaredExpression([
			titleExpression,
			'title',
			...(titleExpression === titleFallbackExpression ? [] : ['titleFallback']),
		])
	:
		renderConditionalExpression(
			[{
				condition: resolvedWarningConditionExpression,
				value: resolvedWarningSummaryExpression,
			}],
			renderFirstDeclaredExpression([
				titleExpression,
				'title',
				...(titleExpression === titleFallbackExpression ? [] : ['titleFallback']),
			])
		)
	const entityValueFallbackExpression = contentWarning == null ?
		renderFirstDeclaredExpression([
			valueExpression,
			titleExpression,
			...([valueExpression, titleExpression].includes(titleFallbackExpression) ? [] : ['titleFallback']),
		])
	:
		renderConditionalExpression(
			[{
				condition: resolvedWarningConditionExpression,
				value: resolvedWarningSummaryExpression,
			}],
			renderFirstDeclaredExpression([
				valueExpression,
				titleExpression,
				...([valueExpression, titleExpression].includes(titleFallbackExpression) ? [] : ['titleFallback']),
			])
		)
	const pendingValueFallbackExpression = contentWarning == null ?
		renderFirstDeclaredExpression([
			pendingValueExpression,
			pendingTitleExpression,
			...([pendingValueExpression, pendingTitleExpression].includes(titleFallbackExpression) ? [] : ['titleFallback']),
		])
	:
		renderConditionalExpression(
			[{
				condition: warningConditionExpression(pendingEntityExpression),
				value: warningSummaryExpression(pendingEntityExpression),
			}],
			renderFirstDeclaredExpression([
				pendingValueExpression,
				pendingTitleExpression,
				...([pendingValueExpression, pendingTitleExpression].includes(titleFallbackExpression) ? [] : ['titleFallback']),
			])
		)
	const entityRouteLinks = indexes.entityRouteLinksByType[entity.entityType] ?? []
	const unfactoredEntityHrefExpression = (
		entityRouteLinks.length === 0 ?
			undefined
		:
			renderEntityRouteLinkExpression(
				indexes,
				entity.entityType,
				'selection.entitySelector'
			)
	)
	const hrefFieldBindings = entityRouteFieldBindings(
		entity,
		unfactoredEntityHrefExpression,
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
	const entityHrefExpression = (
		unfactoredEntityHrefExpression == null ?
			undefined
		: hrefFieldBindings.length === 0 ?
			unfactoredEntityHrefExpression
		:
			renderEntityRouteLinkExpression(
				indexes,
				entity.entityType,
				'selection.entitySelector',
				undefined,
				false,
				Object.fromEntries(hrefFieldBindings.map(({ fieldName, name }) => [
					fieldName,
					name,
				]))
			)
	)
	const importedViewItems = viewItemImports(entity, indexes)
	const entityName = camel(entity.entityType)
	const iconMarkup = (
		singularView?.summary?.Icon != null
		|| singularView?.summary?.icon != null
	) ? renderIconSnippet(entity, indexes, entityName) : []
	const declaredExpressionImportSpecs = [
		...(entityHrefExpression == null ? [] : entityRouteImportSpecs(indexes, entity.entityType)),
		...(singularView?.imports ?? []).map((importSpec) => ({
			from: importSpec.from,
			defaultName: importSpec.default,
			names: importSpec.names,
			typeNames: importSpec.typeNames,
		})),
		...(singularView?.pending?.imports ?? []).map((importSpec) => ({
			from: importSpec.from,
			defaultName: importSpec.default,
			names: importSpec.names,
			typeNames: importSpec.typeNames,
		})),
		...importedViewItems,
	]
	const usesTruncatedValue = (
		viewUsesFormat(entity, indexes, ['truncated', 'namespaceReference', 'url'])
		|| contentRows.some((group) => group.some((item) => ['truncated', 'namespaceReference', 'url'].includes(viewItemFormat(entity, indexes, item) ?? '')))
		|| rawSnippetComponentNames.has('TruncatedValue')
	)
	const expressionImportSpecs = mergeImports([
		...declaredExpressionImportSpecs,
		...(
			usesTruncatedValue
			&& declaredExpressionImportSpecs.some((importSpec) => importSpec.from === '$/components/TruncatedValue.svelte') ?
				[{
					from: '$/components/TruncatedValue.svelte',
					defaultName: 'TruncatedValue',
				}]
			:
				[]
		),
	])
	const relationshipMarkup = renderRelationshipSections(entity, indexes, sections)
	const detailTabsMarkup = detailsTabs.length === 0 ? [] : renderDetailsTabs(entity, indexes, detailsTabs)
	const carouselMarkup = carousels.flatMap((carousel) => renderCarousel(
		entity,
		indexes,
		carousel,
		networkSourceApplicability?.sharedSourceSelectionNames
	))
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
	const latestMarkup = latestItems.flatMap((latest) => renderLatestContentItem(entity, indexes, latest, 3))
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

		return renderRelationshipSection(entity, indexes, {
			field,
			viewEntry,
		}, 2)
	}))
	const contentRowMarkupGroups = contentRows.map((viewEntries) => renderContentItems(
		entity,
		indexes,
		contentDlViewEntries(viewEntries),
		'contentOpen',
		3,
		viewSelectionExpression,
		entityName,
		new Set(queryFields.map(fieldReferenceKey))
	))
		.filter((group) => group.length > 0)
	const contentBody = content?.body
	const contentBodyMarkup = contentBody == null || contentWarning != null ? [] : renderBodySection(
		entity,
		indexes,
		contentBody,
		'contentOpen',
		2,
		viewSelectionExpression,
		entityName,
		new Set(queryFields.map(fieldReferenceKey))
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
	const contentWarningMarkup = contentWarning == null || contentBody == null ? [] : [
		'		<ResourceBoundary',
		renderSvelteAttribute(3, 'resource', `${viewSelectionExpression}(${renderQuery(undefined, [
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
	]
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
			if (entitySelectorOwnsField(entity, fieldName)) {
				const selectorExpression = fieldExpression('selection.entitySelector', fieldName)

				return [
					`${'\t'.repeat(level)}<${componentIdentifier(component)}`,
					renderSvelteAttribute(level + 1, 'selection', `select(EntityType.${targetEntity.entityType}, ${selectorExpression})`),
					...(targetHasHref ? [`${'\t'.repeat(level + 1)}href={null}`] : []),
					`${'\t'.repeat(level + 1)}layout={EntityLayout.${refLayout}}`,
					`${'\t'.repeat(level + 1)}open={false}`,
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
				`${'\t'.repeat(referenceLevel + 1)}prefetched={${targetEntityName}}`,
				...(targetHasHref ? [`${'\t'.repeat(referenceLevel + 1)}href={null}`] : []),
				`${'\t'.repeat(referenceLevel + 1)}layout={EntityLayout.${refLayout}}`,
				`${'\t'.repeat(referenceLevel + 1)}open={false}`,
				`${'\t'.repeat(referenceLevel)}/>`,
				...(optional ? [`${'\t'.repeat(level + 2)}{/if}`] : []),
				`${'\t'.repeat(level + 1)}{/snippet}`,
				`${'\t'.repeat(level)}</ResourceBoundary>`,
			]
		}

		const selectorOwnsField = entitySelectorOwnsField(entity, fieldName)
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
	const entitySummaryTitleMarkup = summaryTitleNeedsMarkup ? renderSummaryItemsMarkup(summaryTitleEntries, 'Title', 4) : []
	const entitySummaryValueMarkup = summaryValueNeedsMarkup ? renderSummaryItemsMarkup(summaryValueEntries, 'Value', 4) : []
	const summaryItemsResolveEntity = (viewEntries: readonly _ViewItem[]) => viewEntries.some((viewEntry) => (
		[
			...itemFieldReferences(viewEntry),
			...viewItemDisplayFieldReferences(viewEntry),
		].some((fieldReference) => {
			const fieldDefinition = fieldDefinitionByReference(entity, fieldReference, indexes)
			return (
				fieldDefinition != null
				&& fieldDefinition.type === EntityFieldType.Primitive
				&& !isProjectionFieldReference(fieldReference)
				&& !entitySelectorOwnsField(entity, fieldNameForReference(fieldReference))
			)
		})
	))
	const summaryTitleResolvesEntity = contentWarning != null || summaryItemsResolveEntity(summaryTitleEntries)
	const summaryValueResolvesEntity = contentWarning != null || summaryItemsResolveEntity(summaryValueEntries)
	const summaryAfterResolvesEntity = summaryItemsResolveEntity(summaryAfterEntries)
	const summaryAfterMarkup = (
		summaryAfterEntries.length === 0 ?
			[]
		:
			renderSummaryAfter(entity, indexes, summaryAfterResolvesEntity ? entityName : undefined, summaryAfterEntries)
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
	const viewMarkupLines = [
		...iconMarkup,
		...entitySummaryTitleMarkup,
		...entitySummaryValueMarkup,
		...summaryAfterMarkup,
		...latestMarkup,
		...contentRowMarkupGroups.flat(),
		...contentListSectionsFromDl,
		...contentBodyMarkup,
		...contentBlockMarkup,
		...detailsMarkup,
	]
	const viewComponentNames = new Set([
		...svelteComponentNames(viewMarkupLines.join('\n')),
		...rawSnippetComponentNames,
	])
	const usesViewSelection = (
		resolvesEntity && viewSelectionExpression === 'viewSelection'
		|| [
			...viewMarkupLines,
			...contentWarningContentMarkup,
			...contentWarningMarkup,
		].some((line) => line.includes('viewSelection'))
	)
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
	const collectionRouteImports = mergeImports(Object.entries(indexes.collectionRouteBySourceField)
		.filter(([key]) => key.startsWith(`${entity.entityType}:`))
		.flatMap(([, href]) => [...href.params
			.reduce((imports, param) => expressionImports(param.value, imports), new Map<string, Set<string>>())
			.entries()]
			.map(([from, names]) => ({
				from,
				names: [...names],
			}))))
		.filter((importSpec) => (importSpec.names ?? []).some((name) => (
			viewMarkupLines.some((line) => line.includes(typeof name === 'string' ? name : name.alias))
		)))
	const typeAnnotationTooltipMarkup = (
		singularView?.TypeAnnotationTooltip != null ?
			renderRawLines(singularView.TypeAnnotationTooltip.raw, 2)
		: entity.description != null ?
			[
				'\t\t<p>',
				`\t\t\t${svelteText(entity.description)}`,
				'\t\t</p>',
			]
		:
			[]
	)
	const scriptBeforePendingEntity = [
		'// Types/constants',
		...((
			entityHrefExpression != null
			|| allViewItems(entity, indexes).some((item) => typeof item === 'object' && 'link' in item && item.link != null)
			|| sections.some((section) => {
				const fieldDefinition = fieldDefinitionByReference(entity, section.field, indexes)
				return (
					section.href != null
					|| fieldDefinition?.entityType != null && hasCollectionRoute(entity, indexes, section.field, fieldDefinition.entityType)
				)
			})
			|| carouselsToRender.some((carousel) => carousel.sections.some((section) => {
				if (section.field == null)
					return false

				const fieldDefinition = fieldDefinitionByReference(entity, section.field, indexes)
				return fieldDefinition?.entityType != null && hasCollectionRoute(entity, indexes, section.field, fieldDefinition.entityType)
			}))
		) ? [
			'import { resolve } from \'$app/paths\'',
		] : []),
		...(viewMarkupLines.some((line) => line.includes('EntityProxyField')) ? ['import { EntityProxyField } from \'$/client/$proxy.svelte.ts\''] : []),
		...(viewComponentNames.has('Projection') ? ['import Projection from \'$/components/Projection.svelte\''] : []),
		...(viewComponentNames.has('ProjectionBoundary') ? ['import ProjectionBoundary from \'$/components/ProjectionBoundary.svelte\''] : []),
		'import EntityView, { EntityLayout, type EntitySelectionViewProps } from \'$/components/EntityView.svelte\'',
		...(
			viewMarkupLines.some((line) => line.includes('EntityMetaKey.'))
			|| rawSnippets.some((snippet) => snippet.raw.includes('EntityMetaKey.')) ?
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
				viewMarkupLines.some((line) => line.includes('Source.'))
				|| usesViewSelection && declaredViewSourcesExpression != null && typeScriptExpressionReferencesBinding(declaredViewSourcesExpression, 'Source')
				|| typeScriptExpressionReferencesBinding(query, 'Source')
				|| sectionQueries.some((sectionQuery) => typeScriptExpressionReferencesBinding(sectionQuery, 'Source'))
				|| latestQueries.some((latestQuery) => typeScriptExpressionReferencesBinding(latestQuery, 'Source'))
				|| carouselQueries.some((carouselQuery) => typeScriptExpressionReferencesBinding(carouselQuery, 'Source'))
			)
			&& !expressionImportSpecs.some((importSpec) => (
				importSpec.from === '$/sources/Source.ts'
				&& (
					importSpec.defaultName === 'Source'
					|| (importSpec.names ?? []).some((name) => importNameKey(name) === 'Source')
				)
			))
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
		...(entityHrefExpression == null ? [] : ['\thref,']),
		'\tlayout = EntityLayout.SummaryDetails,',
		'\topen = $bindable(layout === EntityLayout.SummaryDetails),',
		'\t...EntityViewProps',
		`}: EntitySelectionViewProps<EntityType.${entity.entityType}> = $props()`,
		'',
	]
	const scriptAfterPendingEntity = [
		...hrefFieldBindings.map(({ expression, name }) => `const ${name} = $derived(${expression})`),
		...(contentWarning == null ? [] : [
			'let revealedContentWarningSelectorKey = $state<string>()',
			'const contentWarningSelectorKey = $derived(stringify(selection.entitySelector))',
		]),
		...(networkSourceApplicability == null ? [] : [
			...networkSourceApplicability.lines,
			'',
		]),
		...(declaredViewSourcesExpression == null || !usesViewSelection ? [] : [
			`const viewSelection = $derived(${viewSelectionValueExpression})`,
		]),
		...(resolvesEntity ? [
			`const ${entityName} = $derived(${query === '{}' ? viewSelectionExpression : `${viewSelectionExpression}(${query})`})`,
		] : []),
		`const titleFallback = ${typeScriptStringValue(titleFallbackExpression) != null ? titleFallbackExpression : `$derived(${titleFallbackExpression})`}`,
		...(usesViewDomId ? [
			`const viewDomId = $derived(${emitTypeScript(`${entity.entityType
				.replace(/([a-z])([A-Z])/g, '$1-$2')
				.replace(/[_\s]+/g, '-')
				.toLowerCase()}-`)} + encodeURIComponent(stringify(selection.entitySelector)))`,
		] : []),
		'',
		'',
		'// Components',
		...(contentWarning == null ? [] : ['import Collapsible from \'$/components/Collapsible.svelte\'']),
		...(carouselMarkup.length === 0 && detailTabsMarkup.length === 0 ? [] : ['import CollapsibleTabs from \'$/components/CollapsibleTabs.svelte\'']),
		...(carouselsToRender.some((carousel) => carousel.sections.some((section) => (
			section.field != null
			&& fieldDefinitionByReference(entity, section.field, indexes)?.type === EntityFieldType.EntityReference
			&& carouselSectionComponent(entity, indexes, section) != null
		))) ? ['import EntitiesList from \'$/components/EntitiesList.svelte\''] : []),
		...(carouselMarkup.length === 0 ? [] : ['import HeadingComponent from \'$/components/Heading.svelte\'']),
		...(
			viewComponentNames.has('IconComponent')
			&& !expressionImportSpecs.some((importSpec) => (
				importSpec.from === '$/components/Icon.svelte'
				&& importSpec.defaultName === 'IconComponent'
			)) ?
				['import IconComponent from \'$/components/Icon.svelte\'']
			:
				[]
		),
		...(viewUsesFormat(entity, indexes, ['markdown', 'syndicationHtml']) ? ['import Markdown from \'$/components/Markdown.svelte\''] : []),
		...(
			serial != null
			|| viewUsesFormat(entity, indexes, ['currency', 'currencyScaled', 'number', 'numberValue', 'percent'])
			|| viewComponentNames.has('NumberValue') ?
				['import NumberValue from \'$/components/NumberValue.svelte\'']
			:
				[]
		),
		'import ResourceBoundary from \'$/components/ResourceBoundary.svelte\'',
		...(
			viewUsesFormat(entity, indexes, ['timestamp', 'dateTime'])
			|| contentRows.some((group) => group.some((item) => ['timestamp', 'dateTime'].includes(viewItemFormat(entity, indexes, item) ?? ''))) ?
				['import Timestamp from \'$/components/Timestamp.svelte\'']
			:
				[]
		),
		...(
			carouselsToRender.some((carousel) => carousel.description != null)
			|| viewComponentNames.has('Tooltip') ?
				['import Tooltip from \'$/components/Tooltip.svelte\'']
			:
				[]
		),
		...(
			usesTruncatedValue
			&& !expressionImportSpecs.some((importSpec) => (
				importSpec.from === '$/components/TruncatedValue.svelte'
				&& importSpec.defaultName === 'TruncatedValue'
			)) ?
				['import TruncatedValue from \'$/components/TruncatedValue.svelte\'']
			:
				[]
		),
		...sectionComponents
			.filter((component) => !expressionImportSpecs.some((importSpec) => (
				importSpec.from === `$/views/${component}.svelte`
				&& importSpec.defaultName === componentIdentifier(component)
			)))
			.map((component) => `import ${componentIdentifier(component)} from '$/views/${component}.svelte'`),
	]
	const renderSummarySnippet = (name: 'Title' | 'Value') => {
		const summary = name === 'Title' ? {
			raw: singularView?.summary?.Title?.raw,
			rendersSerial: rendersSerialTitle,
			resolvesEntity: summaryTitleResolvesEntity,
			entries: summaryTitleEntries,
			itemMarkup: entitySummaryTitleMarkup,
			pendingFallbackExpression: titleFallbackExpression,
			resolvedFallbackExpression: entityTitleFallbackExpression,
			serialLabel: serial?.label,
		} : {
			raw: singularView?.summary?.Value?.raw,
			rendersSerial: rendersSerialValue,
			resolvesEntity: summaryValueResolvesEntity,
			entries: summaryValueEntries,
			itemMarkup: entitySummaryValueMarkup,
			pendingFallbackExpression: pendingValueFallbackExpression,
			resolvedFallbackExpression: entityValueFallbackExpression,
			serialLabel: undefined,
		}

		return [
			`\t{#snippet ${name}()}`,
			...(
				summary.raw != null ?
					renderRawLines(summary.raw, 2)
				: serial != null && summary.rendersSerial ?
					renderSerialSnippet(entity, indexes, serial, everySelectorOwnsSerial, entityName, summary.serialLabel)
				: !summary.resolvesEntity ?
					summary.itemMarkup.length === 0 ?
						[renderSvelteTextOrExpression(2, summary.pendingFallbackExpression)]
					:
						renderSummaryItemsMarkup(summary.entries, name, 2)
				:
					[
						`\t\t<ResourceBoundary resource={${entityName}}>`,
						'\t\t\t{#snippet children(entity)}',
						...(summary.itemMarkup.length === 0 ? [
							renderSvelteTextOrExpression(4, summary.resolvedFallbackExpression),
						] : summary.itemMarkup),
						'\t\t\t{/snippet}',
						'\t\t</ResourceBoundary>',
					]
			),
			'\t{/snippet}',
		]
	}
	const markupWithTitleFallback = [
		'<EntityView',
		`\tentityType={EntityType.${entity.entityType}}`,
		'\tentitySelector={selection.entitySelector}',
		...(usesViewDomId ? ['\tid={viewDomId}'] : []),
		renderSvelteAttribute(1, 'title', 'title ?? titleFallback'),
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
		...iconMarkup,
		...(iconMarkup.length === 0 ? [] : ['']),
		...renderSummarySnippet('Title'),
		...(singularView?.summary?.Value == null && !rendersSerialValue && summaryValueEntries.length === 0 ? [] : [
			'',
			...renderSummarySnippet('Value'),
		]),
		...summaryAfterMarkup,
		...(typeAnnotationTooltipMarkup.length === 0 ? [] : [
			'',
			'\t{#snippet TypeAnnotationTooltip()}',
			...typeAnnotationTooltipMarkup,
			'\t{/snippet}',
		]),
		...contentWarningContentMarkup,
		...(latestMarkup.length === 0 && contentRowMarkupGroups.length === 0 && contentListSectionsFromDl.length === 0 && contentBodyMarkup.length === 0 && contentWarningMarkup.length === 0 && contentBlockMarkup.length === 0 ? [] : [
			'',
			'\t{#snippet Content({ open: contentOpen })}',
			...(latestMarkup.length === 0 ? [] : [
			`\t\t<dl${singularView?.latestDlClassName == null ? '' : ` class=${emitTypeScript(singularView.latestDlClassName)}`} data-column-item="center">`,
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
			...contentWarningMarkup,
			...contentBlockMarkup,
			'\t{/snippet}',
		]),
		...(detailsMarkup.length === 0 ? [] : [
			'',
			'\t{#snippet Details({ open: detailsOpen })}',
			...reindentLines(detailsMarkup, 2),
			'\t{/snippet}',
		]),
		'</EntityView>',
	]
	// Plain display fallbacks do not own state. When the title attribute is their
	// only consumer, emit the expression there instead of a one-use rune.
	const inlineTitleFallback = (
		markupWithTitleFallback.join('\n').match(/\btitleFallback\b/g)?.length ?? 0
	) === 1
	const markup = inlineTitleFallback ?
		markupWithTitleFallback.map((line) => (
			line === renderSvelteAttribute(1, 'title', 'title ?? titleFallback') ?
				renderSvelteAttribute(1, 'title', renderNullishExpression('title', titleFallbackExpression))
			:
				line
		))
	:
		markupWithTitleFallback
	const scriptAfterTitleFallback = scriptAfterPendingEntity.filter((line) => (
		!inlineTitleFallback || !line.startsWith('const titleFallback = ')
	))
	// A source-scoped selection used only to create one durable resource can be
	// composed into that resource's $derived initializer. Direct markup resource
	// consumers retain the named derived selection so its identity stays stable.
	const viewSelectionConsumers = scriptAfterTitleFallback.filter((line) => (
		!line.startsWith('const viewSelection = ')
		&& /\bviewSelection\b/.test(line)
	))
	const inlineViewSelection = (
		viewSelectionExpression === 'viewSelection'
		&& viewSelectionConsumers.length === 1
		&& viewSelectionConsumers[0]?.startsWith('const ') === true
		&& viewSelectionConsumers[0]?.includes(' = $derived(') === true
		&& !markup.some((line) => /\bviewSelection\b/.test(line))
	)
	const scriptAfterViewSelection = scriptAfterTitleFallback
		.filter((line) => !inlineViewSelection || !line.startsWith('const viewSelection = '))
		.map((line) => (
			inlineViewSelection ?
				replaceGeneratedIdentifier(line, 'viewSelection', viewSelectionValueExpression)
			:
				line
		))
	const pendingEntityReferenceCount = [
		...scriptBeforePendingEntity,
		...scriptAfterViewSelection,
		...markup,
	].join('\n').match(/\bpendingEntity\b/g)?.length ?? 0
	// The default pending value is only a selector/prefetch merge. Inline a sole
	// read; custom pending expressions retain their explicit reactive boundary.
	const inlinePendingEntity = (
		entitySingularView(entity)?.pending == null
		&& pendingEntityReferenceCount === 1
	)
	const inlinePendingEntityReference = (line: string) => (
		inlinePendingEntity ?
			replaceGeneratedIdentifier(
				line,
				pendingEntityExpression,
				'({ ...selection.entitySelector, ...prefetched })'
			)
		:
			line
	)

	return svelteFile(
		viewModulePath(componentName).replace(/^\$\//, 'src/'),
		{
			script: [
				...scriptBeforePendingEntity,
				...(pendingEntityReferenceCount > 0 && !inlinePendingEntity ? renderPendingEntityDerived(entity) : []),
				...scriptAfterViewSelection.map(inlinePendingEntityReference),
			],
			markup: markup.map(inlinePendingEntityReference),
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
		`${'\t'.repeat(level + 1)}{#snippet children(entity)}`,
		...renderRawLines(viewEntry.Content.raw, level + 2),
		`${'\t'.repeat(level + 1)}{/snippet}`,
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
	const bodyMarkup = [
		`${'\t'.repeat(level + (body.id == null && body.label == null ? 0 : 1))}<ResourceBoundary`,
		renderSvelteAttribute(level + (body.id == null && body.label == null ? 1 : 2), 'resource', resourceExpression),
		`${'\t'.repeat(level + (body.id == null && body.label == null ? 0 : 1))}>`,
		`${'\t'.repeat(level + (body.id == null && body.label == null ? 1 : 2))}{#snippet children(entity)}`,
		`${'\t'.repeat(level + (body.id == null && body.label == null ? 2 : 3))}{@const ${localIdentifier(body.field)} = ${bodyFieldValue}}`,
		`${'\t'.repeat(level + (body.id == null && body.label == null ? 2 : 3))}{#if ${localIdentifier(body.field)} != null && ${localIdentifier(body.field)} !== ''}`,
		...renderValueMarkup(entity, indexes, bodyViewEntry, body.field, localIdentifier(body.field), `({ value: ${localIdentifier(body.field)} })`, level + (body.id == null && body.label == null ? 3 : 4)),
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

	const selectorOwnsField = entitySelectorOwnsField(entity, fieldName)
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
				const selectorExpression = fieldExpression('selection.entitySelector', fieldName)

				return [
					`${'\t'.repeat(level)}<span data-text="muted">`,
					`${'\t'.repeat(level + 1)}<${componentIdentifier(component)}`,
					renderSvelteAttribute(level + 2, 'selection', `select(EntityType.${targetEntity.entityType}, ${selectorExpression})`),
					`${'\t'.repeat(level + 2)}layout={EntityLayout.Title}`,
					`${'\t'.repeat(level + 2)}open={false}`,
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
				`${'\t'.repeat(referenceLevel + 2)}prefetched={${targetEntityName}}`,
				`${'\t'.repeat(referenceLevel + 2)}layout={EntityLayout.Title}`,
				`${'\t'.repeat(referenceLevel + 2)}open={false}`,
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
			'\t{#snippet HeadingAfter()}',
			...viewEntries.flatMap((viewEntry, viewEntryIndex) => renderSummaryAfterItem(
				entity,
				indexes,
				viewEntry,
				fieldValueNames[viewEntryIndex] ?? 'value',
				2
			)),
			'\t{/snippet}',
		]

	return [
		'',
		'\t{#snippet HeadingAfter()}',
		`\t\t<ResourceBoundary resource={${entityName}}>`,
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
	entityName: string
) => {
	const singularView = entitySingularView(entity)
	if (singularView?.summary?.Icon != null)
		return [
			'',
			'\t{#snippet Icon()}',
			...renderRawLines(singularView.summary.Icon.raw, 2),
			'\t{/snippet}',
		]

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
		const selectorOwnsIcon = entitySelectorOwnsField(entity, fieldNameForReference(iconField))
		const referenceSelectorExpression = selectorOwnsIcon ?
			fieldExpression('selection.entitySelector', fieldNameForReference(iconField))
		:
			'reference[EntityMetaKey.Selector]'
		const optional = iconFieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne
		const resolvedReferenceLevel = optional ? 5 : 4

		if (selectorOwnsIcon)
			return [
				'',
				'\t{#snippet Icon()}',
				`\t\t<${componentIdentifier(component)}`,
				`${'\t'.repeat(3)}selection={select(EntityType.${iconFieldDefinition.entityType}, ${referenceSelectorExpression})}`,
				'\t\t\tlayout={EntityLayout.Value}',
				'\t\t\topen={false}',
				'\t\t/>',
				'\t{/snippet}',
			]

		return [
			'',
			'\t{#snippet Icon()}',
			`\t\t<ResourceBoundary resource={${entityName}}>`,
			'\t\t\t{#snippet children(entity)}',
			`\t\t\t\t{@const reference = ${fieldExpression('entity', iconField)}}`,
			...(optional ? ['\t\t\t\t{#if reference != null}'] : []),
			`${'\t'.repeat(resolvedReferenceLevel)}<${componentIdentifier(component)}`,
			`${'\t'.repeat(resolvedReferenceLevel + 1)}selection={select(EntityType.${iconFieldDefinition.entityType}, ${referenceSelectorExpression})}`,
			`${'\t'.repeat(resolvedReferenceLevel + 1)}prefetched={reference}`,
			`${'\t'.repeat(resolvedReferenceLevel + 1)}layout={EntityLayout.Value}`,
			`${'\t'.repeat(resolvedReferenceLevel + 1)}open={false}`,
			`${'\t'.repeat(resolvedReferenceLevel)}/>`,
			...(optional ? ['\t\t\t\t{/if}'] : []),
			'\t\t\t{/snippet}',
			'\t\t</ResourceBoundary>',
			'\t{/snippet}',
		]
	}

	const resolvedIconExpression = iconField == null ? undefined : textExpression(fieldExpression('entity', iconField))
	if (resolvedIconExpression == null)
		return [
			'',
			'\t{#snippet Icon()}',
			'\t\t<IconComponent />',
			'\t{/snippet}',
		]

	if (entitySelectorOwnsField(entity, fieldNameForReference(iconField)))
		return [
			'',
			'\t{#snippet Icon()}',
			`\t\t<IconComponent icon={${renderDisplayExpression(
				entity,
				indexes,
				iconField,
				fieldExpression('selection.entitySelector', iconField),
				true
			)}} />`,
			'\t{/snippet}',
		]

	return [
		'',
		'\t{#snippet Icon()}',
		`\t\t<ResourceBoundary resource={${entityName}}>`,
		'\t\t\t{#snippet children(entity)}',
		`\t\t\t\t<IconComponent icon={${resolvedIconExpression}} />`,
		'\t\t\t{/snippet}',
		'\t\t</ResourceBoundary>',
		'\t{/snippet}',
	]
}

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
	if (entitySelectorOwnsField(entity, fieldName)) {
		const selectorExpression = fieldExpression('selection.entitySelector', fieldName)

		return wrapWhen(viewEntry, openExpression, [
			`${'\t'.repeat(level)}<div>`,
			`${'\t'.repeat(level + 1)}<dt>${label}</dt>`,
			`${'\t'.repeat(level + 1)}<dd>`,
			`${'\t'.repeat(level + 2)}<${component}`,
			renderSvelteAttribute(level + 3, 'selection', `select(EntityType.${fieldDefinition.entityType}, ${selectorExpression})`),
			`${'\t'.repeat(level + 3)}layout={EntityLayout.Value}`,
			`${'\t'.repeat(level + 3)}open={false}`,
			`${'\t'.repeat(level + 2)}/>`,
			`${'\t'.repeat(level + 1)}</dd>`,
			`${'\t'.repeat(level)}</div>`,
		])
	}

	const targetEntityName = camel(targetEntity.entityType)
	const entityViewLines = [
		`${'\t'.repeat(level + 2)}<${component}`,
		renderSvelteAttribute(level + 3, 'selection', `select(EntityType.${fieldDefinition.entityType}, ${targetEntityName}[EntityMetaKey.Selector])`),
		`${'\t'.repeat(level + 3)}prefetched={${targetEntityName}}`,
		`${'\t'.repeat(level + 3)}layout={EntityLayout.Value}`,
		`${'\t'.repeat(level + 3)}open={false}`,
		`${'\t'.repeat(level + 2)}/>`,
	]

	if (fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne)
		return wrapWhen(viewEntry, openExpression, [
			`${'\t'.repeat(level)}<ResourceBoundary`,
			renderSvelteAttribute(level + 1, 'resource', fieldProxyResourceExpression(fieldResourceBase, fieldReference, query)),
			`${'\t'.repeat(level)}>`,
			`${'\t'.repeat(level + 1)}{#snippet children(${targetEntityName})}`,
			`${'\t'.repeat(level + 2)}{#if ${targetEntityName} != null}`,
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
			renderSvelteAttribute(level + 3, 'resource', fieldProxyResourceExpression(fieldResourceBase, fieldReference, query)),
			`${'\t'.repeat(level + 2)}>`,
		`${'\t'.repeat(level + 3)}{#snippet children(${targetEntityName})}`,
		...entityViewLines.map((line) => indent(line, 2)),
		`${'\t'.repeat(level + 3)}{/snippet}`,
		`${'\t'.repeat(level + 2)}</ResourceBoundary>`,
		`${'\t'.repeat(level + 1)}</dd>`,
		`${'\t'.repeat(level)}</div>`,
	])
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
		return wrapWhen(viewEntry, openExpression, [
			`${'\t'.repeat(level)}<div>`,
			`${'\t'.repeat(level + 1)}<dt>${viewEntry.label}</dt>`,
			`${'\t'.repeat(level + 1)}<dd>`,
			renderSvelteTextOrExpression(level + 2, emitTypeScript(viewEntry.value ?? viewEntry.label)),
			...(viewEntry.description == null ? [] : [
				`${'\t'.repeat(level + 2)}<p data-text="muted">`,
				renderSvelteTextOrExpression(level + 3, emitTypeScript(viewEntry.description)),
				`${'\t'.repeat(level + 2)}</p>`,
			]),
			`${'\t'.repeat(level + 1)}</dd>`,
			`${'\t'.repeat(level)}</div>`,
		])
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
	const label = typeof viewEntry === 'object' && 'label' in viewEntry && viewEntry.label != null ? viewEntry.label : labelForField(fieldDefinition)
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

	if (!isProjectionFieldReference(fieldReference) && entitySelectorOwnsField(entity, fieldName)) {
		const fieldValueExpression = fieldExpression('selection.entitySelector', fieldReference)
		const valueMarkup = [
			`${'\t'.repeat(level)}<div>`,
			`${'\t'.repeat(level + 1)}<dt>${label}</dt>`,
			`${'\t'.repeat(level + 1)}<dd>`,
			...renderValueMarkup(
				entity,
				indexes,
				viewEntry,
				fieldReference,
				fieldValueExpression,
				viewItemContextExpression(entity, viewEntry),
				level + 2
			),
			`${'\t'.repeat(level + 1)}</dd>`,
			`${'\t'.repeat(level)}</div>`,
		]

		return wrapWhen(viewEntry, openExpression, valueMarkup)
	}

	const fieldValueName = localIdentifier(fieldName)
	const projectionFieldResource = isProjectionFieldReference(fieldReference)
	const itemQueryFields = [
		...itemFieldReferences(viewEntry),
		...viewItemDisplayFieldReferences(viewEntry),
	]
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
	const valueMarkup = [
		`${'\t'.repeat(level)}<div>`,
		`${'\t'.repeat(level + 1)}<dt>${label}</dt>`,
		`${'\t'.repeat(level + 1)}<dd>`,
		...renderValueMarkup(
			entity,
			indexes,
			viewEntry,
			fieldReference,
			fieldValueExpression,
			valueContextExpression,
			level + 2
		),
		`${'\t'.repeat(level + 1)}</dd>`,
		`${'\t'.repeat(level)}</div>`,
	]
	if (fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne)
		return wrapWhen(viewEntry, openExpression, [
			`${'\t'.repeat(level)}<ResourceBoundary`,
			renderSvelteAttribute(level + 1, 'resource', resourceExpression),
			`${'\t'.repeat(level)}>`,
			`${'\t'.repeat(level + 1)}{#snippet children(${projectionFieldResourceExpression == null ? 'entity' : fieldValueName})}`,
			...(projectionFieldResourceExpression == null ? [
				`${'\t'.repeat(level + 2)}{@const ${fieldValueName} = ${directFieldValueExpression}}`,
			] : []),
			`${'\t'.repeat(level + 2)}{#if ${fieldValueName} != null}`,
			...valueMarkup.map((line) => indent(line, 3)),
			`${'\t'.repeat(level + 2)}{/if}`,
			`${'\t'.repeat(level + 1)}{/snippet}`,
			`${'\t'.repeat(level)}</ResourceBoundary>`,
		])

	return wrapWhen(viewEntry, openExpression, [
		`${'\t'.repeat(level)}<div>`,
		`${'\t'.repeat(level + 1)}<dt>${label}</dt>`,
		`${'\t'.repeat(level + 1)}<dd>`,
		`${'\t'.repeat(level + 2)}<ResourceBoundary`,
		renderSvelteAttribute(level + 3, 'resource', resourceExpression),
		`${'\t'.repeat(level + 2)}>`,
		`${'\t'.repeat(level + 3)}{#snippet children(${projectionFieldResourceExpression == null ? 'entity' : fieldValueName})}`,
		...renderValueMarkup(
			entity,
			indexes,
			viewEntry,
			fieldReference,
			fieldValueExpression,
			valueContextExpression,
			level + 4
		),
		`${'\t'.repeat(level + 3)}{/snippet}`,
		`${'\t'.repeat(level + 2)}</ResourceBoundary>`,
		`${'\t'.repeat(level + 1)}</dd>`,
		`${'\t'.repeat(level)}</div>`,
	])
}

const renderContentItems = (
	entity: Entity,
	indexes: GenerationIndexes,
	viewEntries: readonly _ViewItem[],
	openExpression: string,
	level: number,
	querySelectionExpression = 'selection',
	entityResourceExpression?: string,
	entityResourceFieldKeys?: ReadonlySet<string>
) => groupAdjacentBy(
	viewEntries.map((viewEntry) => {
		const fieldReference = itemFieldReferences(viewEntry)[0]
		return {
			viewEntry,
			projectionFieldReference: (
				fieldReference != null && isProjectionFieldReference(fieldReference) ?
					fieldReference
				:
					undefined
			),
		}
	}),
	({ projectionFieldReference }) => projectionFieldReference?.slice(0, -1).join('.') ?? ''
).flatMap((group) => {
	const projectionFieldReference = group[0].projectionFieldReference
	const projectionViewEntries = group.map(({ viewEntry }) => viewEntry)
	return projectionFieldReference == null ?
		projectionViewEntries.flatMap((viewEntry) => renderContentItem(
			entity,
			indexes,
			viewEntry,
			openExpression,
			level,
			querySelectionExpression,
			false,
			entityResourceExpression,
			entityResourceFieldKeys
		))
	:
		renderProjectionBoundaryLines(
			entity,
			indexes,
			projectionFieldReference,
			(fieldResourceBase) => projectionViewEntries.flatMap((viewEntry) => renderContentItem(
				entity,
				indexes,
				viewEntry,
				openExpression,
				level,
				'selection',
				false,
				entityResourceExpression,
				entityResourceFieldKeys,
				fieldResourceBase
			)),
			level
		)
})

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
	level: number
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
				.flatMap((entityRouteLink) => entityRouteLink.params.flatMap((param) => expressionFieldPaths(param.value)))
				.map((fieldPath) => fieldPath[0])
				.filter((fieldName): fieldName is string => fieldName != null),
		].filter((fieldName) => !latestSelectorFieldNames.has(fieldName)),
	].filter((fieldName) => latestEntity == null || fieldDefinitionByReference(latestEntity, fieldName) != null))

	const query = renderQuery(
		{
			...latest.query,
			limit: 1,
			orderBy: latestOrderBy,
		},
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

	const latestBodyLines = [
		`${'\t'.repeat(level + 4)}{#if ${latestEntityName} != null}`,
		renderSvelteConst(level + 5, latestSelectorName, selectorExpression),
		`${'\t'.repeat(level + 5)}<${componentIdentifier(component)}`,
		renderSvelteAttribute(level + 6, 'selection', `select(EntityType.${entityType}, ${latestSelectorName}${latestSelectionSuffix})`),
		`${'\t'.repeat(level + 6)}prefetched={{ ...${latestSelectorName}, ...${latestEntityName} }}`,
		`${'\t'.repeat(level + 6)}layout={EntityLayout.Value}`,
		`${'\t'.repeat(level + 6)}open={false}`,
		`${'\t'.repeat(level + 5)}/>`,
		`${'\t'.repeat(level + 4)}{:else}`,
		`${'\t'.repeat(level + 5)}<p data-text="muted" data-section-state="resolved-empty">No ${svelteText(latestLabel.toLowerCase())} available.</p>`,
		`${'\t'.repeat(level + 4)}{/if}`,
	]

	const renderLines = (
		fieldResourceBase: string,
		fieldReference: FieldReference
	) => [
		`${'\t'.repeat(level)}<div>`,
		`${'\t'.repeat(level + 1)}<dt>${latestLabel}</dt>`,
		`${'\t'.repeat(level + 1)}<dd>`,
		`${'\t'.repeat(level + 2)}<ResourceBoundary`,
			renderSvelteAttribute(level + 3, 'resource', fieldProxyResourceExpression(fieldResourceBase, fieldReference, query)),
		`${'\t'.repeat(level + 2)}>`,
		`${'\t'.repeat(level + 3)}{#snippet children(${latestEntitiesName})}`,
		`${'\t'.repeat(level + 4)}{@const ${latestEntityName} = ${latestEntitiesName}.values[0]}`,
		...latestBodyLines,
		`${'\t'.repeat(level + 3)}{/snippet}`,
		`${'\t'.repeat(level + 2)}</ResourceBoundary>`,
		`${'\t'.repeat(level + 1)}</dd>`,
		`${'\t'.repeat(level)}</div>`,
	]

	return renderProjectionBoundaryLines(
		entity,
		indexes,
		latest.field,
		(fieldResourceBase, fieldReference) => renderConditionedEntityLines(
			entity,
			indexes,
			latestConditions,
			level,
			renderLines(fieldResourceBase, fieldReference)
		),
		level
	)
}

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
			...referenceSections.flatMap((section) => renderRelationshipSection(
				entity,
				indexes,
				section,
				level
			)),
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
	level: number
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

	if (fieldDefinition.entityType == null)
		throw new Error(`${entity.entityType}.${section.field} relationship section field must reference an entity`)

	if (fieldDefinition.type === EntityFieldType.EntityReference && component != null)
		return renderConditionedEntityLines(
			entity,
			indexes,
			sectionConditions,
			level,
			renderProjectionBoundaryLines(
				entity,
				indexes,
				section.field,
				(fieldResourceBase, fieldReference) => renderEntityReferenceSection(
					entity,
					section,
					fieldDefinition,
					component,
					level,
					fieldResourceBase,
					fieldReference
				),
				level
			)
		)
	if (fieldDefinition.type === EntityFieldType.EntitiesReference && component != null)
		return renderConditionedEntityLines(
			entity,
			indexes,
			sectionConditions,
			level,
			renderProjectionBoundaryLines(
				entity,
				indexes,
				section.field,
				(fieldResourceBase, fieldReference) => renderEntitiesReferenceSection(
					entity,
					indexes,
					section,
					fieldDefinition,
					component,
					level,
					fieldResourceBase,
					fieldReference
				),
				level
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
) => [...(indexes.entityRouteLinksByType[entityType] ?? [])
	.flatMap((href) => href.params)
	.reduce((imports, param) => expressionImports(param.value, imports), new Map<string, Set<string>>())
	.entries()]
	.map(([from, names]) => ({
		from,
		names: [...names],
	}))

// Repeated relationship-selector roots are named once beside the view state.
// The route stays a direct resolve() expression; this only removes duplicated
// deep selector access from its conditions and parameter values.
const entityRouteFieldBindings = (
	entity: Entity,
	hrefExpression: string | undefined,
	fieldsExpression: string,
	declaration: 'derived' | 'svelteConst',
	reservedNames: readonly string[]
) => {
	const names = new Set(reservedNames)

	return entity.fields.flatMap((field) => {
		const expression = fieldExpression(fieldsExpression, field.name)
		const occurrenceCount = hrefExpression?.split(expression).length ?? 0
		if (
			field.entityType == null
			|| hrefExpression == null
			|| occurrenceCount < 3
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
		if (occurrenceCount * (expression.length - name.length) <= declarationLength)
			return []

		names.add(name)

		return [{
			expression,
			fieldName: field.name,
			name,
		}]
	})
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
	const collectionRoute = indexes.collectionRouteBySourceField[collectionSourceFieldKey(entity.entityType, field, targetEntity)]
	if (collectionRoute == null)
		return undefined

	const selectorFieldsOnly = unique(collectionRoute.params
		.flatMap((param) => expressionFieldPaths(param.value))
		.flatMap((fieldPath) => fieldPath[0] == null ? [] : [fieldPath[0]]))
		.every((fieldName) => entitySelectorOwnsField(entity, fieldName))
	const hrefExpression = renderResolveExpression(
		collectionRoute.path,
		collectionRoute.params.map((param) => [
			param.param,
			renderPresentRouteParamExpression(param.value, {
				fields: fieldsExpression,
				entity,
				indexes,
			}, param.decode),
		])
	)
	// Selector-only routes need guards solely for selector-union variants. Routes
	// using resolved fields retain value-presence guards until resolution fills them.
	// Case expressions keep each branch's requirements inside that branch.
	const condition = unique(collectionRoute.params.flatMap((param) => routeExpressionConditions(
		{
			fields: fieldsExpression,
			entity,
			indexes,
		},
		param.value,
		(fieldPaths) => (
			selectorFieldsOnly ?
				entitySelectorPathConditions(indexes, entity.entityType, fieldsExpression, fieldPaths)
			:
				fieldPathsPresenceExpressions(fieldsExpression, fieldPaths, true)
		)
	))).join(' && ')
	return condition === '' ? hrefExpression : `(${condition} ? ${hrefExpression} : undefined)`
}

// Route inputs are selectors. Only selector variants that can omit a field, or
// schema fields whose values can be absent, need runtime presence conditions.
const entitySelectorPathConditions = (
	indexes: GenerationIndexes,
	entityType: string,
	fieldsExpression: string,
	fieldPaths: readonly string[][],
	fieldExpressionByName?: Readonly<Record<string, string>>
) => unique(fieldPaths.flatMap((fieldPath) => {
	let entity = indexes.entityByType[entityType]
	const conditions: string[] = []

	for (const [index, fieldName] of fieldPath.entries()) {
		// Properties inside a primitive/object value type are required by that
		// value type; only entity-selector boundaries need variant checks.
		if (entity == null)
			break

		const field = entity.fields.find((candidate) => candidate.name === fieldName)
		// Unknown paths are not assumed safe: preserve the generic presence chain
		// so malformed or external expressions cannot produce unsafe access.
		if (field == null)
			return fieldPathsPresenceExpressions(fieldsExpression, [fieldPath], true)

		const parentExpression = index === 0 ?
			fieldsExpression
		:
			fieldPath.slice(1, index).reduce(
				(expression, pathPart) => `${expression}${propertyAccess(pathPart)}`,
				fieldExpressionByName?.[fieldPath[0] ?? ''] ?? fieldExpression(fieldsExpression, fieldPath[0] ?? '')
			)
		if (!entity.selectors.every((selector) => selector.fields.includes(fieldName)))
			conditions.push(`${emitTypeScript(fieldName)} in ${parentExpression}`)

		entity = field.entityType == null ? undefined : indexes.entityByType[field.entityType]
	}

	return conditions
}))

const resolvedEntityPathConditions = (
	indexes: GenerationIndexes,
	entityType: string,
	fieldsExpression: string,
	fieldPaths: readonly string[][],
	fieldExpressionByName?: Readonly<Record<string, string>>
) => unique(fieldPaths.flatMap((fieldPath) => {
	let entity = indexes.entityByType[entityType]
	const conditions: string[] = []

	for (const [index, fieldName] of fieldPath.entries()) {
		// Properties inside a primitive/object value type are governed by that
		// value type. Entity cardinality checks end at that boundary.
		if (entity == null)
			break

		const field = entity.fields.find((candidate) => candidate.name === fieldName)
		if (field == null)
			return fieldPathsPresenceExpressions(fieldsExpression, [fieldPath], true)
		if (field.cardinality === EntityFieldCardinality.ZeroOrOne)
			conditions.push(`${fieldPath.slice(1, index + 1).reduce(
				(expression, pathPart) => `${expression}${propertyAccess(pathPart)}`,
				fieldExpressionByName?.[fieldPath[0] ?? ''] ?? fieldExpression(fieldsExpression, fieldPath[0] ?? '')
			)} != null`)

		entity = field.entityType == null ? undefined : indexes.entityByType[field.entityType]
	}

	return conditions
}))

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
	fieldExpressionByName?: Readonly<Record<string, string>>
) => {
	const renderHrefCondition = (conditionTerms: readonly string[]) => {
		const flattenedConditionTerms = unique(conditionTerms.flatMap((condition) => {
			const parsed = parseTypeScriptExpression(condition)
			const conjunctionTerms = (expression: ts.Expression): string[] => {
				const value = unwrapParenthesizedExpression(expression)
				return (
					ts.isBinaryExpression(value)
					&& value.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken ?
						[
							...conjunctionTerms(value.left),
							...conjunctionTerms(value.right),
						]
					:
						[expression.getText(parsed.sourceFile)]
				)
			}

			return conjunctionTerms(parsed.expression)
		}))
		const uniqueConditionTerms = flattenedConditionTerms.filter((condition) => (
			!condition.endsWith(' != null')
			|| !flattenedConditionTerms.some((candidate) => (
				candidate.startsWith(`${condition.slice(0, -' != null'.length)} === `)
			))
		))

		return uniqueConditionTerms.length <= 1 ?
			uniqueConditionTerms[0] ?? 'true'
		:
			uniqueConditionTerms.join('\n&& ')
	}
	const entityRouteLinks = (indexes.entityRouteLinksByType[entityType] ?? [])
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
		const paramFieldPaths = uniqueFieldPaths(entityRouteLink.params.flatMap((param) => (
			expressionFieldPaths(param.value)
		)))
		const params = entityRouteLink.params.map((param) => ({
			param: param.param,
			value: renderPresentRouteParamExpression(param.value, {
					fields: fieldsExpression,
					fieldExpressionByName,
					entity: indexes.entityByType[entityType],
					indexes,
				}, param.decode),
		}))
		const entityCondition = (entityRouteLink.conditions ?? [])
			.filter((condition) => !entitySelectorConditionIsGuaranteed(indexes, entityType, condition))
			.map((condition) => [
				...(resolvedFields ?
					resolvedEntityPathConditions(indexes, entityType, fieldsExpression, [[condition.field]], fieldExpressionByName)
					:
					entitySelectorPathConditions(indexes, entityType, fieldsExpression, [[condition.field]], fieldExpressionByName)
				),
				conditionExpression(
					[condition],
					fieldsExpression,
					indexes.entityByType[entityType],
					indexes,
					false,
					false,
					fieldExpressionByName
				),
			].join(' && '))
			.join(' && ')
		const paramConditionTerms = selectorName == null ? entityRouteLink.params.flatMap((param) => routeExpressionConditions(
			{
				fields: fieldsExpression,
				entity: indexes.entityByType[entityType],
				indexes,
			},
			param.value,
			(fieldPaths) => (
				resolvedFields ?
					resolvedEntityPathConditions(indexes, entityType, fieldsExpression, fieldPaths, fieldExpressionByName)
				:
					entitySelectorPathConditions(indexes, entityType, fieldsExpression, fieldPaths, fieldExpressionByName)
			)
		)) : []
		const conditionTerms = unique([
			entityCondition,
			...paramConditionTerms,
		].filter(Boolean))

		return {
			conditionTerms,
			hasParamCondition: paramConditionTerms.length > 0,
			hasRouteCondition: entityCondition !== '',
			path: entityRouteLink.path,
			params,
			selectorVariantCoordinates: selectorVariantCoordinates(paramFieldPaths),
			selector: entityRouteLink.selector,
			specificity: conditionTerms.length,
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
	if (routeCandidates.length > 1 && routeCandidates.some((candidate) => candidate.conditionTerms.length === 0))
		throw new Error(`${entityType} has multiple unconditional entity hrefs`)

	// Alternatives for the same physical route differ only in selector-derived
	// parameter values. Keep one route and one parameter object, and branch only
	// at the values that actually differ.
	const routeCandidateGroups = new Map<string, typeof routeCandidates>()
	for (const candidate of routeCandidates) {
		const key = JSON.stringify([
			candidate.path,
			candidate.params.map(({ param }) => param).toSorted(),
		])
		routeCandidateGroups.set(key, [
			...(routeCandidateGroups.get(key) ?? []),
			candidate,
		])
	}
	const candidates = [...routeCandidateGroups.values()].map((group) => {
		const first = group[0]
		if (first == null)
			throw new Error(`${entityType} has an empty entity href candidate group`)

		const sharedConditionTerms = first.conditionTerms.filter((condition) => (
			group.every((candidate) => candidate.conditionTerms.includes(condition))
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
		const variantConditionTerms = group.map((candidate) => candidate.conditionTerms.filter((condition) => (
			!sharedConditionTerms.includes(condition)
		)))
		if (group.length > 1 && variantConditionTerms.some((conditions) => conditions.length === 0))
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
								condition: renderHrefCondition(variantConditionTerms[candidateIndex] ?? candidate.conditionTerms),
								value: values[candidateIndex] ?? fallback,
							})),
							fallback
						),
				}
			})
		return {
			conditionTerms: group.length === 1 ?
				first.conditionTerms
			: groupCoversEverySelector ?
				sharedConditionTerms
			:
				[
					...sharedConditionTerms,
					`(\n${indent(variantConditionTerms.map((conditions) => {
						const condition = renderHrefCondition(conditions)
						const expression = unwrapParenthesizedExpression(parseTypeScriptExpression(condition).expression)
						return (
							ts.isBinaryExpression(expression)
							&& (
								expression.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken
								|| expression.operatorToken.kind === ts.SyntaxKind.BarBarToken
							)
						) ?
							`(\n${indent(condition, 1)}\n)`
						:
							condition
					}).join('\n|| '), 1)}\n)`,
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
		return candidate.conditionTerms.length === 0 ?
			candidates[0].hrefExpression
		:
			`(\n${indent(renderHrefCondition(candidates[0].conditionTerms), 1)} ?\n${indent(candidates[0].hrefExpression, 2)}\n\t:\n\t\tundefined\n)`
	}

	// Factor conditions common to every candidate once around the decision tree.
	const sharedConditionTerms = candidates[0].conditionTerms.reduce<string[]>(
		(sharedConditions, condition, index) => (
			sharedConditions.length === index
			&& candidates.every((candidate) => candidate.conditionTerms[index] === condition) ?
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
		if (candidate.conditionTerms.length === 0) {
			if (candidateIndex !== candidates.length - 1)
				throw new Error(`${entityType} has an unconditional entity href before another candidate`)

			return indent(candidate.hrefExpression, level)
		}
		// Exhaustive selector partitions use their final route as the else arm.
		if (routesCoverEverySelector && candidateIndex === candidates.length - 1)
			return indent(candidate.hrefExpression, level)

		const conditionTerms = candidate.conditionTerms.slice(sharedConditionTerms.length)
		return [
			`${indent(renderHrefCondition(conditionTerms), level)} ?`,
			indent(candidate.hrefExpression, level + 1),
			`${'\t'.repeat(level)}:`,
			renderCandidateExpression(candidateIndex + 1, level + 1),
		].join('\n')
	}
	const candidateExpression = renderCandidateExpression(
		0,
		sharedConditionTerms.length === 0 ? 1 : 2
	)

	return sharedConditionTerms.length === 0 ?
		`(\n${candidateExpression}\n)`
	:
		`(\n${indent(renderHrefCondition(sharedConditionTerms), 1)} ?\n${candidateExpression}\n\t:\n\t\tundefined\n)`
}

const renderEntityPageSelection = (
	indexes: GenerationIndexes,
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
	const fields = viewResolvedFieldReferences(entity, indexes, selectorName)
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
	const selectionSourcesExpression = renderFieldConditionedSourceSelectionExpression(
		sourceSelection ?? fieldDefaultSources,
		selectorExpression
	)
	const query = renderQuery(
		undefined,
		fields,
		sourceSelectorField ? `[${selectorSourceExpression}]` : selectionSourcesExpression
	)

	return query === '{}' ?
		`select(EntityType.${entityType}, ${selectorExpression})`
	:
		`select(EntityType.${entityType}, ${selectorExpression}, ${query})`
}

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

const hasCollectionRoute = (entity: Entity, indexes: GenerationIndexes, field: string, targetEntity: string) => (
	Object.hasOwn(indexes.collectionRouteBySourceField, collectionSourceFieldKey(entity.entityType, field, targetEntity))
	|| Object.hasOwn(indexes.collectionRouteByEntity, targetEntity)
)

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

	if (carousel.projectionPath == null)
		return tabsLines

	return [
		'\t\t\t<ProjectionBoundary',
		renderSvelteAttribute(
			4,
			'resource',
			carousel.projectionPath.reduce(
				(expression, facetName) => `${expression}${propertyAccess(facetName)}`,
				'selection'
			)
		),
		'\t\t\t>',
		'\t\t\t\t{#snippet Applicable(projection)}',
		...reindentLines(tabsLines, 5),
		'\t\t\t\t{/snippet}',
		'\t\t\t</ProjectionBoundary>',
	]
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
		`\t\t\t\t{#snippet Marker${pascal(sectionId)}(_context, Content)}`,
		...boundaryLines,
		'\t\t\t\t{/snippet}',
		'',
	]
}

const renderCarouselSectionSnippet = (
	sectionId: string,
	resourceName: string,
	resolvedName: string,
	sectionBodyLines: string[],
	omitWhenResolvedEmpty = false,
	contentOwnsResourceState = false
) => {
	if (contentOwnsResourceState) {
		return [
			`\t\t\t\t{#snippet Section${pascal(sectionId)}({ id, label, open })}`,
			...reindentLines(sectionBodyLines, 5),
			'\t\t\t\t{/snippet}',
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
		`\t\t\t\t{#snippet Section${pascal(sectionId)}({ id, label, open, active })}`,
		...boundaryLines,
		'\t\t\t\t{/snippet}',
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

const renderCarouselSection = (
	entity: Entity,
	indexes: GenerationIndexes,
	section: EntityCarouselSection,
	projectionPath?: readonly [string, ...string[]],
	carouselId?: string,
	sharedSourceSelectionNames?: ReadonlyMap<string, string>
) => {
	if (section.Content != null) {
		const contentLines = lines(section.Content.raw)
		const firstNonConstLineIndex = contentLines.findIndex((line) => !line.trimStart().startsWith('{@const '))
		const leadingConstLines = firstNonConstLineIndex === -1 ? contentLines : contentLines.slice(0, firstNonConstLineIndex)
		const articleContentLines = firstNonConstLineIndex === -1 ? [] : contentLines.slice(firstNonConstLineIndex)

		return {
			availability: undefined,
			ownsSection: false,
			resourceDeclaration: [],
			markup: [
				`\t\t\t\t{#snippet Section${pascal(carouselSectionId(section))}({ id, label, open })}`,
				...leadingConstLines.map((line) => `${'\t'.repeat(5)}${line}`),
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

	if (
		section.items != null
		&& section.items.length > 0
		&& fieldDefinition.type === EntityFieldType.Primitive
		&& (
			fieldDefinition.cardinality === EntityFieldCardinality.Many
			|| fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrMany
		)
	)
		return renderPrimitiveCarouselSection(
			entity,
			indexes,
			section,
			projectionPath,
			carouselId,
			sharedSourceSelectionNames
		)

	if (fieldDefinition.entityType == null)
		throw new Error(`${entity.entityType} carousel section ${carouselSectionId(section)} field ${section.field} is not an entity reference or primitive list`)

	const component = carouselSectionComponent(entity, indexes, section)
	if (component == null)
		throw new Error(`${entity.entityType} carousel section ${carouselSectionId(section)} has no renderable relationship component for ${section.field}`)

	const sectionQuery = section.selection
	const sectionId = carouselSectionId(section)
	const resourceName = generatedIdentifier(`${carouselId ?? 'carousel'}-${sectionId.startsWith(`${carouselId ?? ''}-`) ? sectionId.slice((carouselId?.length ?? 0) + 1) : sectionId}-resource`)
	const applicableSources = carouselApplicableSources(
		entity,
		indexes,
		sectionQuery?.sources ?? fieldDefinition.defaultSources,
		resourceName,
		sharedSourceSelectionNames
	)
	const query = renderQuery(
		sectionQuery,
		[],
		applicableSources.applicable ? applicableSources.name : undefined,
		undefined,
		undefined,
		undefined,
		false
	)
	const fieldProjectionAccess = carouselFieldProjectionAccess(section.field, projectionPath)
	const targetEntity = fieldDefinition.entityType
	const targetEntityName = camel(targetEntity)
	const resourceExpression = fieldProxyResourceExpression(
		fieldProjectionAccess.fieldBase,
		fieldProjectionAccess.fieldReference ?? '',
		query
	)
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
			`\t\t\t\t\t\t\t\tprefetched={${targetEntityName}}`,
			'\t\t\t\t\t\t\t\tlayout={EntityLayout.SummaryInline}',
			'\t\t\t\t\t\t\t\topen={false}',
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
			`\t\t\t\t\t\t\t\tprefetched={${targetEntityName}}`,
			'\t\t\t\t\t\t\t\tlayout={EntityLayout.Summary}',
			'\t\t\t\t\t\t\t\topen={false}',
			'\t\t\t\t\t\t\t/>',
			'\t\t\t\t\t\t{/snippet}',
			'\t\t\t\t\t</EntitiesList>',
		]
	) : [
			`\t\t\t\t\t<${componentIdentifier(component)}`,
			renderSvelteAttribute(6, 'selection', resourceReference),
			...(hrefExpression == null ? [] : [renderSvelteAttribute(6, 'href', hrefExpression)]),
			'\t\t\t\t\t\tCollapsibleProps={{ canToggle: false }}',
			'\t\t\t\t\t\tcollapsible={false}',
			'\t\t\t\t\t\tdata-column-item="flexible"',
			'\t\t\t\t\t\tdata-card',
			'\t\t\t\t\t\tdata-scroll-container',
			'\t\t\t\t\t\topen={open}',
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
		resourceDeclaration: omitWhenResolvedEmpty ?
			[
				...renderCarouselApplicableSourceDeclaration(applicableSources),
				renderSvelteConst(3, resourceName, resourceExpression),
				'',
			]
		:
			renderCarouselApplicableSourceDeclaration(applicableSources),
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
	projectionPath?: readonly [string, ...string[]],
	carouselId?: string,
	sharedSourceSelectionNames?: ReadonlyMap<string, string>
) => {
	const sectionId = carouselSectionId(section)
	const resourceName = generatedIdentifier(`${carouselId ?? 'carousel'}-${sectionId.startsWith(`${carouselId ?? ''}-`) ? sectionId.slice((carouselId?.length ?? 0) + 1) : sectionId}-resource`)
	const fieldName = section.field == null ? undefined : fieldNameForReference(section.field)
	const fieldProjectionAccess = carouselFieldProjectionAccess(section.field, projectionPath)
	const sectionQuery = section.selection
	const fieldDefinition = fieldName == null ? undefined : fieldDefinitionByReference(entity, section.field ?? '', indexes)
	const applicableSources = carouselApplicableSources(
		entity,
		indexes,
		sectionQuery?.sources ?? fieldDefinition?.defaultSources,
		resourceName,
		sharedSourceSelectionNames
	)
	const query = renderQuery(
		sectionQuery,
		[],
		applicableSources.applicable ? applicableSources.name : undefined
	)
	const primitiveValuesName = camel(fieldName ?? 'values')
	const primitiveValuesFieldName = `${primitiveValuesName}Field`
	const primitiveValueName = camel((fieldDefinition?.label ?? fieldName ?? 'value').replace(/s$/, ''))
	const primitiveValueIndexName = `${primitiveValueName}Index`
	const primitiveValueType = fieldDefinition == null ? undefined : fieldValueTypeType(indexes, fieldDefinition)
	const resourceExpression = section.field == null ?
		`selection(${query})`
	:
		fieldProxyResourceExpression(
			fieldProjectionAccess.fieldBase,
			fieldProjectionAccess.fieldReference ?? '',
			query
		)
	const resolvedName = section.field == null ? 'entity' : primitiveValuesFieldName
	const primitiveValuesExpression = (
		section.field == null ?
			`${fieldExpression('entity', fieldName ?? '')}.values`
		:
			`${primitiveValuesFieldName}.values`
	)
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
				resolvedName,
				sectionBodyLines
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

	return [
		`${'\t'.repeat(level)}<div>`,
		`${'\t'.repeat(level + 1)}<dt>${label}</dt>`,
		`${'\t'.repeat(level + 1)}<dd>`,
		...(valueIsOptional ? [
			`${'\t'.repeat(level + 2)}{#if ${valueExpression} != null}`,
			...valueMarkup,
			`${'\t'.repeat(level + 2)}{/if}`,
		] : valueMarkup),
		`${'\t'.repeat(level + 1)}</dd>`,
		`${'\t'.repeat(level)}</div>`,
	]
}

const renderEntityReferenceSection = (
	entity: Entity,
	section: RelationshipSection,
	fieldDefinition: EntityField,
	component: string,
	level: number,
	fieldResourceBase: string,
	fieldReference: FieldReference
) => {
	const selectionQuery = section.selection
	const query = renderQuery(
		selectionQuery,
		[],
		renderFieldConditionedSourceSelectionExpression(selectionQuery?.sources, 'pendingEntity')
	)
	const targetEntity = fieldDefinition.entityType
	if (targetEntity == null)
		throw new Error(`${entity.entityType}.${section.field} EntityReference section is missing entityType`)
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
			`${'\t'.repeat(level + 5)}prefetched={${targetEntityName}}`,
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
		`${'\t'.repeat(referenceLevel + 1)}prefetched={${targetEntityName}}`,
		`${'\t'.repeat(referenceLevel + 1)}layout={EntityLayout.Summary}`,
		`${'\t'.repeat(referenceLevel + 1)}open={false}`,
		`${'\t'.repeat(referenceLevel)}/>`,
		`${'\t'.repeat(level + 2)}{/snippet}`,
		`${'\t'.repeat(level + 1)}</ResourceBoundary>`,
		`${'\t'.repeat(level)}</section>`,
	]
}

const renderEntitiesReferenceSection = (
	entity: Entity,
	indexes: GenerationIndexes,
	section: RelationshipSection,
	fieldDefinition: EntityField,
	component: string,
	level: number,
	fieldResourceBase: string,
	fieldReference: FieldReference
) => {
	const selectionQuery = section.selection
	const query = renderQuery(
		selectionQuery,
		[],
		renderFieldConditionedSourceSelectionExpression(selectionQuery?.sources, 'pendingEntity')
	)
	const targetEntity = fieldDefinition.entityType
	if (targetEntity == null)
		throw new Error(`${entity.entityType}.${section.field} EntitiesReference section is missing entityType`)
	const hrefFieldNames = unique((
		indexes.collectionRouteBySourceField[
			collectionSourceFieldKey(entity.entityType, section.field, targetEntity)
		]?.params ?? []
	).flatMap((param) => expressionFieldPaths(param.value).flatMap((fieldPath) => (
		fieldPath[0] == null ? [] : [fieldPath[0]]
	))))
	const hrefNeedsResolvedEntity = hrefFieldNames.some((fieldName) => !entitySelectorOwnsField(entity, fieldName))
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
	const sectionLines = () => [
		`${'\t'.repeat(level)}<${componentIdentifier(component)}`,
		renderSvelteAttribute(level + 1, 'selection', resourceName),
		renderSvelteAttribute(level + 1, 'countResource', `${resourceName}.count`),
		titleExpression == null ? `${'\t'.repeat(level + 1)}title=${emitTypeScript(titleLabel)}` : renderSvelteAttribute(level + 1, 'title', titleExpression),
		...(section.href != null ? [
			renderSvelteAttribute(level + 1, 'href', renderResolveExpression(section.href)),
		] : hrefExpression == null ? [] : [renderSvelteAttribute(level + 1, 'href', hrefExpression)]),
		...(section.list?.placeholderText == null ? [] : [`${'\t'.repeat(level + 1)}placeholderText=${emitTypeScript(section.list.placeholderText)}`]),
		...(section.props ?? []).map((prop) => `${'\t'.repeat(level + 1)}${prop.name}={${renderExpression(prop.value, {
			fields: 'selection.entitySelector',
		})}}`),
		section.idExpression == null ?
			(
				section.id == null ?
					`${'\t'.repeat(level + 1)}id=${emitTypeScript(routeCollectionIdForFieldReference(section.field))}`
				:
					`${'\t'.repeat(level + 1)}id=${emitTypeScript(section.id)}`
			)
		:
			renderSvelteAttribute(level + 1, 'id', section.idExpression),
		`${'\t'.repeat(level)}/>`,
	].flatMap(lines)

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

const generatePluralViewFile = (entity: Entity, indexes: GenerationIndexes) => {
	const singularView = entitySingularView(entity)
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
	const rowTitleItems = usesCustomRow ? viewItems(row.title) : declaredSummaryTitleEntries(entity)
	const rowValueItems = usesCustomRow ? viewItems(row.value) : declaredSummaryValueEntries(entity)
	const rowAfterItems = usesCustomRow ? viewItems(row.HeadingAfter) : viewItems(singularView?.summary?.HeadingAfter)
	const entityRoutes = indexes.entityRouteLinksByType[entity.entityType] ?? []
	const entityRouteFieldNames = unique(entityRoutes.flatMap((route) => [
		...(route.conditions ?? []).map(({ field }) => field),
		...route.params.flatMap(({ value }) => expressionFieldPaths(value).flatMap(([field]) => field == null ? [] : [field])),
	]))
	const resolvedEntityRouteFieldNames = entityRoutes.length === 1 ?
		entityRouteFieldNames.filter((fieldName) => !entitySelectorOwnsField(entity, fieldName))
	:
		[]
	const usesResolvedEntityHref = resolvedEntityRouteFieldNames.length > 0
	const rowItems = [
		...(usesCustomRow ? [] : summarySerialItems(entity)),
		...rowTitleItems,
		...rowValueItems,
		...(usesCustomRow ? [] : viewItems(singularView?.summary?.titleFallback)),
		...rowAfterItems,
	]
	const rowQueryFields = [...new Map([
		...resolvedEntityRouteFieldNames,
		...(usesCustomRow ? [] : viewItems(singularView?.summary?.icon)),
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
	const defaultTypeAnnotationParagraphs = (
		pluralView?.TypeAnnotationTooltip == null && entity.description != null ?
			`[${emitTypeScript(entity.description)}]`
		:
			'[]'
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
	const rowHrefCondition = entitySelectorPathConditions(
		indexes,
		entity.entityType,
		itemSelectorName,
		rowHrefFieldPaths
	).join(' && ')
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
	const unfactoredEntityHrefExpression = rowHrefExpression ?? (
		(indexes.entityRouteLinksByType[entity.entityType]?.length ?? 0) === 0 ?
			undefined
		:
			renderEntityRouteLinkExpression(
				indexes,
				entity.entityType,
				usesResolvedEntityHref ? entityValueName : itemSelectorName,
				undefined,
				usesResolvedEntityHref
			)
	)
	const itemHrefName = `${entityValueName}Href`
	const hrefFieldBindings = pluralView?.rowHref != null ? [] : entityRouteFieldBindings(
		entity,
		unfactoredEntityHrefExpression,
		usesResolvedEntityHref ? entityValueName : itemSelectorName,
		'svelteConst',
		[
			entityValueName,
			itemFieldsName,
			itemHrefName,
			itemSelectorName,
			'selection',
		]
	)
	const entityHrefExpression = (
		unfactoredEntityHrefExpression == null ?
			undefined
		: hrefFieldBindings.length === 0 ?
			unfactoredEntityHrefExpression
		:
			renderEntityRouteLinkExpression(
				indexes,
				entity.entityType,
				usesResolvedEntityHref ? entityValueName : itemSelectorName,
				undefined,
				usesResolvedEntityHref,
				Object.fromEntries(hrefFieldBindings.map(({ fieldName, name }) => [
					fieldName,
					name,
				]))
			)
	)
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
		const directSummarySerial = summarySerial(summaryEntity)
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
				declaredSummaryTitleEntries(summaryEntity),
				entityFieldsExpression,
				visitedEntityTypes,
				entitySelectorExpression
			),
			renderDirectSummaryItemsExpression(
				summaryEntity,
				viewItems(entitySingularView(summaryEntity)?.summary?.titleFallback),
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
		const directSummarySerial = summarySerial(entity)
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
						entriesForProjection(viewItems(singularView?.summary?.titleFallback)),
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

		return [
			`${'\t'.repeat(level)}<EntityView`,
			`${'\t'.repeat(level + 1)}entityType={EntityType.${entity.entityType}}`,
			`${'\t'.repeat(level + 1)}entitySelector={${entitySelectorExpression}}`,
			...(entityHrefExpression == null ? [] : [
				renderSvelteAttribute(level + 1, 'href', itemHrefIsShared ? itemHrefName : entityHrefExpression),
			]),
			`${'\t'.repeat(level)}>`,
			`${'\t'.repeat(level + 1)}{#snippet Title()}`,
			renderSvelteTextOrExpression(level + 2, directSummaryTitleExpression),
			`${'\t'.repeat(level + 1)}{/snippet}`,
			...(directSummaryValueExpression === 'undefined' ? [] : [
				'',
				`${'\t'.repeat(level + 1)}{#snippet Value()}`,
				renderSvelteTextOrExpression(level + 2, directSummaryValueExpression),
				`${'\t'.repeat(level + 1)}{/snippet}`,
			]),
			...directSummaryAfterMarkup,
			`${'\t'.repeat(level)}</EntityView>`,
		]
	}
	const directSummaryRowLines = directSummaryRowMarkup(2)
	const directSummarySelectorReferenceCount = (
		directSummaryRowLines.join('\n').match(new RegExp(`\\b${itemSelectorName}\\b`, 'g'))?.length ?? 0
	)
	const directSummaryRenderedLines = (
		directSummarySelectorReferenceCount === 1 ?
			directSummaryRowMarkup(
				2,
				undefined,
				itemFieldsExpression,
				new Map(),
				`${entityValueName}[EntityMetaKey.Selector]`
			)
		:
			directSummaryRowLines
	)
	const script = [
		'// Types/constants',
		...(entityHrefExpression != null ? [
			`import { resolve } from '$app/paths'`,
		] : []),
		'import EntitiesList, { type EntityListViewProps } from \'$/components/EntitiesList.svelte\'',
		'import { EntityMetaKey } from \'$/schema/$schema.ts\'',
		'import { EntityType } from \'$/schema/EntityType.ts\'',
		...(filters.length === 0 ? [] : ['import type { RegisteredEntitySelector } from \'$/schema/index.ts\'']),
		...mergeImports([
			...rowHrefImports.map(([from, names]) => ({
				from,
				names: [...names],
			})),
				...rowDisplayImports,
			...emitImportObject(pluralView?.imports),
		]).map(emitImport),
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
		...(defaultTypeAnnotationParagraphs === '[]' ? [] : [
			`\ttypeAnnotationParagraphs = ${defaultTypeAnnotationParagraphs},`,
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
			'{#snippet ModelTypeAnnotationTooltip()}',
			...modelTypeAnnotationTooltipMarkup,
			'{/snippet}',
			'',
		]),
		'<EntitiesList',
		'\t{...EntitiesListProps}',
		`\tentityType={EntityType.${entity.entityType}}`,
		...(usesCustomPluralId ? ['\t{id}'] : []),
		...(customPluralTitle == null ? [] : ['\t{title}']),
		'\tbind:open',
		...(defaultTypeAnnotationParagraphs === '[]' ? [] : ['\t{typeAnnotationParagraphs}']),
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
		...(rowProjectionPaths.length > 0 || directSummarySelectorReferenceCount > 1 || hrefFieldBindings.some(({ expression }) => expression.includes(itemSelectorName)) ? [
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
				)
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

	return svelteFile(
		viewModulePath(componentName).replace(/^\$\//, 'src/'),
		{
			script,
			markup,
		}
	)
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
	routeFile.mappings?.some((mapping) => mapping.projectionSubject?.routeParam != null) === true
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
	const networkParam = mapping.projectionSubject?.routeParam
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
						...[...context.imports].map(([from, names]) => ({
							from,
							names: [...names],
						})),
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
						const selectorFields = indexes.entityByType[context.entityType]?.selectors.find(
							(selector) => selector.name === context.mapping.selectorName
						)?.fields
						if (selectorFields == null)
							throw new Error(`${routePath} references missing selector ${context.entityType}.${context.mapping.selectorName}`)
						const selectorCondition = logicalExpression([
							`!(${context.selectorVariableName} instanceof arktype.errors)`,
							...selectorFields.map((field) => `${emitTypeScript(field)} in ${context.selectorVariableName}`),
							...(context.projection.selectorGuardExpression == null ? [] : [context.projection.selectorGuardExpression]),
						], '&&')

						return [
						...(context.guardExpression == null ? [] : [indent(`if ${context.guardExpression} {`)]),
						`\t${context.guardExpression == null ? '' : '\t'}const ${context.selectorVariableName} = parseEntitySelector(`,
						`\t${context.guardExpression == null ? '' : '\t'}\tschema,`,
						`\t${context.guardExpression == null ? '' : '\t'}\t${context.entitySchemaName},`,
						indent(context.selectorFieldsExpression, context.guardExpression == null ? 2 : 3),
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
				...[...context.imports].map(([from, names]) => ({
					from,
					names: [...names],
				})),
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
				indent(context.selectorFieldsExpression, 2),
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
	const rootSelection = fieldResourceExpression(
		sourceSelection,
		rootFieldReference,
		stepQueries[0]
	)
	const selection = pathSteps.slice(1).reduce(
		(expression, step, index) => fieldResourceExpression(
			expression,
			step.projectionPath.length === 0 ?
				step.field.name
			:
				[
					...step.projectionPath,
					step.field.name,
				],
			stepQueries[index + 1]
		),
		rootSelection
	)
	const projectionStepIndex = pathSteps.findIndex((step) => step.projectionPath.length > 0)
	const sharedRootSteps = projectionStepIndex < 0 ? [rootStep] : pathSteps.slice(0, projectionStepIndex)
	const selectionFromSharedRoot = (sharedRoot: string) => pathSteps.slice(sharedRootSteps.length).reduce(
		(expression, step, index) => fieldResourceExpression(
			expression,
			step.projectionPath.length === 0 ?
				step.field.name
			:
				[
					...step.projectionPath,
					step.field.name,
				],
			stepQueries[sharedRootSteps.length + index]
		),
		sharedRoot
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
		return {
			collection,
			componentFile: collection.page?.view?.component
				?? pluralComponentName(collectionEntity),
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
	const sharedRootBindingBySelection = new Map<string, string>()
	for (const { sharedRootSelection } of unboundContexts) {
		if (unboundContexts.filter((context) => context.sharedRootSelection === sharedRootSelection).length < 2)
			continue

		if (!sharedRootBindingBySelection.has(sharedRootSelection))
			sharedRootBindingBySelection.set(sharedRootSelection, `collectionRoot${sharedRootBindingBySelection.size}Selection`)
	}
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
				...(contexts.some(({ selection }) => typeScriptExpressionReferencesBinding(selection, 'EntityProxyField')) ? [
					'import { EntityProxyField } from \'$/client/$proxy.svelte.ts\'',
				] : []),
				'import { EntityType } from \'$/schema/EntityType.ts\'',
				...mergeImports(contexts.flatMap(({ collection }) => (
					[...expressionImports(collection.source.selector).entries()].map(([from, names]) => ({
						from,
						names: [...names],
					}))
				))).map(emitImport),
				...(contexts.some(({ selection }) => typeScriptExpressionReferencesBinding(selection, 'Source')) ? [
					'import { Source } from \'$/sources/Source.ts\'',
				] : []),
				'',
				'',
				'// Context',
				'import { resolve } from \'$app/paths\'',
				'import { select } from \'$/routes/+layout.svelte\'',
				'',
				'',
				'// State',
				...(usesData || usesParams ? [
					'let {',
					...(usesData ? ['\tdata,'] : []),
					...(usesParams ? ['\tparams,'] : []),
					'}: PageProps = $props()',
				] : []),
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
				'',
				'',
				'// Components',
				'import Page from \'$/components/Page.svelte\'',
				...(contexts.some(({ isRelationshipPath }) => isRelationshipPath) ? [
					'import ResourceBoundary from \'$/components/ResourceBoundary.svelte\'',
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
						dispatchCondition
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
	const serial = summarySerial(entity)
	const singularView = entitySingularView(entity)
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
		!isProjectionFieldReference(fieldReference)
		&& (
			pendingSelectorFields == null ?
				entitySelectorOwnsField(entity, fieldNameForReference(fieldReference))
			:
				pendingSelectorFields.has(fieldReferenceKey(fieldReference))
		)
	)
	const titleItemFieldReferences = (viewEntry: _ViewItem) => [
		...itemFieldReferences(viewEntry),
		...viewItemDisplayFieldReferences(viewEntry),
	]
	const itemUsesResolvedFields = (viewEntry: _ViewItem) => titleItemFieldReferences(viewEntry)
		.some((fieldReference) => !pendingOwnsField(fieldReference))
	const resolvedTitleUsesEntity = (
		viewItemTree([
			...declaredSummaryTitleEntries(entity),
			...viewItems(singularView?.summary?.titleFallback),
			...viewItems(serial?.fallback),
		]).some(itemUsesResolvedFields)
		|| serial != null && !pendingOwnsField(serial.field)
	)
	const itemFieldsExpression = (viewEntry: _ViewItem) => {
		const fieldReferences = titleItemFieldReferences(viewEntry)
		const usesPendingFields = fieldReferences.some(pendingOwnsField)
		const usesResolvedFields = itemUsesResolvedFields(viewEntry)
		if (usesPendingFields && usesResolvedFields)
			throw new Error(`${entity.entityType} page title item mixes selector and resolved fields`)

		return usesPendingFields ? pendingFieldsExpression : `${selectionExpression}.entity`
	}
	const pendingTitle = renderJoinedItemsExpression(entity, indexes, pendingItems(declaredSummaryTitleEntries(entity)), pendingFieldsExpression)
	const pendingFallbackTitle = renderJoinedItemsExpression(
		entity,
		indexes,
		pendingItems(viewItems(singularView?.summary?.titleFallback)),
		pendingFieldsExpression
	)
	const pendingSerialTitle = serial == null || (
		pendingSelectorFields != null
		&& !pendingSelectorFields.has(serial.field)
	) ?
		renderFirstDeclaredExpression([pendingTitle, pendingFallbackTitle])
	:
		renderSerialTextExpression(entity, indexes, serial, pendingFieldsExpression)
	const resolvedTitle = renderJoinedItemsExpression(entity, indexes, declaredSummaryTitleEntries(entity), itemFieldsExpression, ' ', true)
	const resolvedFallbackTitle = renderJoinedItemsExpression(
		entity,
		indexes,
		viewItems(singularView?.summary?.titleFallback),
		itemFieldsExpression,
		' ',
		true
	)
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
	const titleExpression = (
		resolvedTitleUsesEntity ?
			(
				`${selectionExpression}.entity == null ? `
				+ renderFirstDeclaredExpression([pendingSerialTitle, entityTypeLabel])
				+ ' : '
				+ renderFirstDeclaredExpression([resolvedSerialTitle, entityTypeLabel])
			)
		:
			renderFirstDeclaredExpression([resolvedSerialTitle, entityTypeLabel])
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
		const finalMapping = mappings.at(-1)
		if (finalMapping == null)
			throw new Error(`${routePath} has no final selector mapping`)
		const finalEntity = indexes.entityByType[finalMapping.entityType]
		if (finalEntity == null)
			throw new Error(`${routePath} references missing entity ${finalMapping.entityType}`)
		const mappedEntityTypes = [...new Set(mappings.map(({ entityType }) => entityType))]
		const singleMappedEntityType = mappedEntityTypes.length === 1 ? mappedEntityTypes[0] : undefined
		const singleMappedEntity = singleMappedEntityType == null ? undefined : indexes.entityByType[singleMappedEntityType]
		const pageSelectionExpression = renderConditionalExpression(
			mappings.slice(0, -1).map((mapping) => {
				const entity = indexes.entityByType[mapping.entityType]
				if (entity == null)
					throw new Error(`${routePath} references missing entity ${mapping.entityType}`)

				return {
					condition: (
						`data.entityType === EntityType.${mapping.entityType} `
						+ `&& data.selectorName === ${emitTypeScript(mapping.selectorName)}`
					),
					value: renderEntityPageSelection(
						indexes,
						entity,
						mapping.entityType,
						'data.selector',
						mapping.selectorName,
						mapping.sourceSelection
					),
				}
			}),
			renderEntityPageSelection(
				indexes,
				finalEntity,
				finalMapping.entityType,
				'data.selector',
				finalMapping.selectorName,
				finalMapping.sourceSelection
			)
		)
		const pageTitleExpression = renderConditionalExpression(
			mappings.slice(0, -1).map((mapping) => {
				const entity = indexes.entityByType[mapping.entityType]
				if (entity == null)
					throw new Error(`${routePath} references missing entity ${mapping.entityType}`)

				return {
					condition: (
						`data.entityType === EntityType.${mapping.entityType} `
						+ `&& data.selectorName === ${emitTypeScript(mapping.selectorName)}`
					),
					value: renderPageEntityTitleExpression(
						entity,
						indexes,
						'pageSelection',
						undefined,
						'data.selector',
						mapping.selectorName
					),
				}
			}),
			renderPageEntityTitleExpression(
				finalEntity,
				indexes,
				'pageSelection',
				undefined,
				'data.selector',
				finalMapping.selectorName
			)
		)
		const pageSelectionImports = mergeImports(
			mappings.flatMap((mapping) => {
				const entity = indexes.entityByType[mapping.entityType]
				return entity == null ? [] : viewItemImports(entity, indexes)
			})
		).map(emitImport)

		return svelteFile(
			routePath,
			{
				script: [
					'// Types/constants',
					'import type { PageProps } from \'./$types.ts\'',
					'import { EntityType } from \'$/schema/EntityType.ts\'',
					...(singleMappedEntityType == null ? ['import { entityDefinitionByType } from \'$/schema/index.ts\''] : []),
					...pageSelectionImports,
					...(typeScriptExpressionReferencesBinding(pageSelectionExpression, 'Source') ? ['import { Source } from \'$/sources/Source.ts\''] : []),
					'',
					'',
					'// Context',
					'import { select } from \'$/routes/+layout.svelte\'',
					'',
					'',
					'// State',
					'let {',
					'\tdata,',
					'}: PageProps = $props()',
					'',
					'const pageSelection = $derived(',
					indent(pageSelectionExpression, 1),
					')',
					'const pageTitle = $derived(',
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
						'<title>{pageTitle} • {entityDefinitionByType[data.entityType].labels.singular} • Blockhead</title>'
					:
						`<title>{pageTitle} • ${svelteText(displayLabel(entityLabel(singleMappedEntity)))} • Blockhead</title>`,
				],
				markup: singleMappedEntityType == null ?
					[
						'<Page>',
						'\t{@const EntityView = entityViewByType[data.entityType]}',
						'',
						'\t<EntityView',
						'\t\tselection={pageSelection}',
						'\t/>',
						'</Page>',
					]
				:
					[
						'<Page>',
						`\t<${singularComponentIdentifier(singleMappedEntityType)}`,
						'\t\tselection={pageSelection}',
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
		...(collectionComponent == null || collectionComponentFile == null ? [] : [`import ${collectionComponent} from '${viewModulePath(collectionComponentFile)}'`]),
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
	const viewContentUsesParams = view?.Content?.raw.includes('params') === true
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
					'',
					'',
					'// Context',
					`import { select } from '$/routes/+layout.svelte'`,
					'',
					'',
					'// State',
					'let {',
					'\tparams,',
					'}: PageProps = $props()',
					'',
					`const pageSelection = $derived(${pageSelectionExpression})`,
					'',
					'',
					'// Components',
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
				...(appPathImports.length === 0 ? [] : [
					`import { ${appPathImports.join(', ')} } from '$app/paths'`,
				]),
				'import { EntityType } from \'$/schema/EntityType.ts\'',
				...(collection == null ? [] : [...expressionImports(collection.source.selector).entries()].map(([from, names]) => emitImport({
					from,
					names: [...names],
				}))),
				...(
					inlineSelectorExpression == null && !(isEntityDetailPage && viewEntityDefinition != null) ?
						[]
					:
						mergeImports([
							...(inlineSelectorExpression == null ? [] : (mapping?.fields ?? []).flatMap((field) => (
								[...expressionImports(field.value)].map(([from, names]) => ({
									from,
									names: [...names],
								}))
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
				'',
				'',
				'// Context',
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
						[]
					:
						[
							'',
							'',
						]
				),
				'// Components',
				'import Page from \'$/components/Page.svelte\'',
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
						pageSelectionExpression == null ? selectorExpression : 'pageSelection.entitySelector',
						routeId(appRoutePath),
						indexes,
						pageSelectionExpression == null ? undefined : 'pageSelection'
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
			.filter((line) => !/^\s*pageTitle=\{true\}\s*$/.test(line))
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
	conditionExpression?: string
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
	const component = [
		`${'\t'.repeat(componentIndent)}<${collectionComponent}`,
		renderSvelteAttribute(componentIndent + 1, 'href', renderResolveExpression(href, routeParamNames(href).map((param) => [param, `params.${param}`]))),
		`${'\t'.repeat(componentIndent + 1)}title=${emitTypeScript(collection.page?.text?.title ?? routeFile.page?.text?.title ?? sentenceStart(entityLabelPlural(collectionEntity)))}`,
		renderSvelteAttribute(componentIndent + 1, 'selection', selectionExpression),
		...(source.path.length === 1 ? [
			renderSvelteAttribute(componentIndent + 1, 'countResource', `${selectionExpression}.count`),
		] : []),
		`${'\t'.repeat(componentIndent + 1)}id=${emitTypeScript(
			href.startsWith('/~/accounts/') ?
				`account-${routeCollectionId(camel(collection.entity))}`
			:
				routeCollectionIdForFieldReference(source.field)
		)}`,
		`${'\t'.repeat(componentIndent + 1)}data-column-item="flexible"`,
		`${'\t'.repeat(componentIndent + 1)}data-card`,
		`${'\t'.repeat(componentIndent + 1)}data-scroll-container`,
		`${'\t'.repeat(componentIndent)}/>`,
	]
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

const generateLayoutFile = (routePath: string, routeFile: RouteFile) => {
	if (routeFile.detailLayout != null) {
		const {
			components,
			hrefExpression,
			keyExpression,
			detailViewExpression,
			detailSelectionExpression,
		} = routeFile.detailLayout
		const detailView = components.length === 1 ?
			componentIdentifier(components[0]!)
		:
			'DetailView'
		const parentPageCollapsibleLines = [
			'<ParentPageCollapsible',
			renderSvelteAttribute(1, 'href', hrefExpression),
			'>',
			'\t{#snippet Summary()}',
			...(components.length === 1 ? [] : [
				'\t\t{@const DetailView = ' + detailViewExpression + '}',
				'',
			]),
			`\t\t<${detailView}`,
			renderSvelteAttribute(3, 'selection', detailSelectionExpression),
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
					...(typeScriptExpressionReferencesBinding(detailSelectionExpression, 'Source') ? ['import { Source } from \'$/sources/Source.ts\''] : []),
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
		const selectorExpression = routeFile.layout.selector == null ? undefined : renderExpression(routeFile.layout.selector, {
			params: 'params',
		})
		const hrefParamNames = routeFile.layout.href == null ? [] : routeParamNames(routeFile.layout.href)
		const hrefExpression = routeFile.layout.href == null ?
			undefined
		:
			renderResolveExpression(routeFile.layout.href, hrefParamNames.map((param) => [param, `params.${param}`]))
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
			...(routeFile.layout.selector == null ? [] : [...expressionImports(routeFile.layout.selector)].map(([from, names]) => ({
				from,
				names: [...names],
			}))),
			...(routeFile.layout.id == null ? [] : [...expressionImports(routeFile.layout.id)].map(([from, names]) => ({
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
					...imports.map(emitImport),
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

		const epochPath = path.join(generatedOutputRoot, '.blockhead-generator-epoch')
		const stagedEpochPath = path.join(transactionRoot, 'epoch')
		await fs.writeFile(stagedEpochPath, `${JSON.stringify({
			changed: changed.map(({ filePath }) => filePath),
			completedAt: new Date().toISOString(),
			removed: stale,
			transactionId,
		})}\n`)
		await fs.rename(stagedEpochPath, epochPath)
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
				(generatedFile.ast.imports ?? []).map(generatedImportSpecFrom)
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
