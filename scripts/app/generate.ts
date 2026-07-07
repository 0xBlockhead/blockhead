import { execFile } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'

import { parse as parseSvelte } from 'svelte/compiler'
import ts from 'typescript'

import {
	networkByCaip2,
	networkBySlug,
	type networks,
} from '../../src/constants/Network.ts'
import {
	EntityFieldCardinality,
	EntityFieldType,
	EntityType,
	_ListEntityRow,
	_RouteFileKind,
	_ExpressionDecode,
	_ViewItemKind,
	type _AppFacetPredicate,
	type _Expression,
	type _FieldReference,
	type _Import,
	type _ListView,
	type _RawSnippet,
	type _SourceSelection,
	type _ViewItem,
	type _ViewListSection,
	type _ViewQuery,
	type App,
	app,
} from '../../APP.ts'


type Entity = App['schema']['entities'][number]
type EntityField = Entity['fields'][number]
type EntitySelector = Entity['selectors'][number]
type ValueTypeType = App['schema']['valueTypes'][number]['type']
type SingularView = NonNullable<Entity['views']['singular']>
type EntityLatest = NonNullable<SingularView['latest']>[number]
type EntityCarousel = NonNullable<SingularView['carousels']>[number]
type EntityCarouselSection = EntityCarousel['sections'][number]
type NamedRelationshipListView = {
	component: string
	entity: Entity
	sourceEntity: Entity
	section: EntityCarouselSection
	field: EntityField
}
type RouteFile = NonNullable<App['routes']['tree'][number]['files']>[number]
type RouteSurfaceNetwork = typeof networks[number]
type ImportSpec = {
	from: string
	defaultName?: string
	names?: string[]
	typeNames?: string[]
}

const entityLabel = (entity: Entity) => entity.labels.singular
const entityLabelPlural = (entity: Entity) => entity.labels.plural
const entitySingularView = (entity: Entity) => entity.views.singular
const entityPluralView = (entity: Entity) => entity.views.plural
const isFacetFieldReference = (field: unknown): field is Extract<FieldReference, { facet: string }> => (
	typeof field === 'object'
	&& field != null
	&& Object.hasOwn(field, 'facet')
	&& Object.hasOwn(field, 'field')
)
const facetFieldRuntimeName = (facetId: string, fieldName: string) => (
	fieldName.startsWith('$$') ?
		`$$${camel(facetId)}${pascal(fieldName.slice(2))}`
	: fieldName.startsWith('$') ?
		`$${camel(facetId)}${pascal(fieldName.slice(1))}`
	:
		`${camel(facetId)}${pascal(fieldName)}`
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
type RouteEntry = {
	routePath: string
	files: RouteFile[]
}
type RelationshipSection = {
	id?: string
	idExpression?: string
	group?: string
	label?: string
	titleField?: string
	field: string
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
	}[]
}
type EntityHref = {
	href: string
	selector: string
	conditions?: {
		field: string
		equals?: _Literal
		contains?: _Literal
	}[]
	params: {
		param: string
		value: _Expression
		decode?: _ExpressionDecode
	}[]
}
type CollectionRouteHref = EntityHref
type FieldReference = _FieldReference
type RouteFixtureMetadata = NonNullable<App['routes']['tree'][number]['files'][number]['surface']>
type AppIndexes = {
	entityTypes: string[]
	activeEntities: Entity[]
	entityByType: Map<string, Entity>
	valueTypeById: Map<string, App['schema']['valueTypes'][number]>
	sourceIds: Set<string>
	sourceProviderIds: Set<string>
	routeEntries: RouteEntry[]
	collectionHrefByEntity: Map<string, string>
	collectionHrefBySourceField: Map<string, CollectionRouteHref>
	entityHrefsByType: Map<string, EntityHref[]>
	routeFixtureMetadataByRouteId: Map<string, RouteFixtureMetadata>
	generatedComponents: Set<string>
	sourceSelections: _SourceSelection[]
}
type CheckedInSourceProviderModule = {
	path: string
	importName: string
	provider: string
	label: string
	sources: {
		provider: string
		source: string
		label: string
	}[]
}
type SourceDefinitionModule = {
	path: string
	importName: string
	provider: string
	source: string
	label: string
}

const repoRoot = process.cwd()
const execFileAsync = promisify(execFile)
const generatedRoot = path.join(repoRoot, 'src')
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
		...(spec.names ?? []),
		...(spec.typeNames ?? []),
	].some((name) => name?.startsWith(`_${schemaMatch[1]}`)))
		return schemaModulePath(`_${schemaMatch[1]}`)

	return generatedImportFrom(spec.from)
}

const pluralViewName = (entity: Entity) => componentIdentifier(pluralComponentName(entity)).replace(/View$/, '')

const singularComponentIdentifier = (entityType: string) => componentIdentifier(singularComponentName(entityType))

const pluralComponentIdentifier = (entity: Entity) => componentIdentifier(pluralComponentName(entity))

const selectorMemberName = (selector: EntitySelector) => selector.name

const propertyAccess = (property: string) => /^[A-Za-z_$][\w$]*$/.test(property) ? `.${property}` : `[${q(property)}]`

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

const fieldResourceExpression = (base: string, field: string, entityType: string, query?: string, multiple = true) => {
	const typeParameters = multiple ? `EntityType.${entityType}` : `EntityType.${entityType}, false`
	if (query == null || query === '{}')
		return `${base}[EntityProxyField]<${typeParameters}>(${q(field)})`

	return `${base}[EntityProxyField]<${typeParameters}>(${q(field)}, ${query})`
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
		return `resolve(${q(routeId(href))})`

	return `resolve(${q(routeId(href))}, ${renderObject(params.map(([param, value]) => [param, value]))})`
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
	if (kind === _RouteFileKind.Page)
		return '+page.svelte'
	if (kind === _RouteFileKind.PageModule)
		return '+page.ts'
	if (kind === _RouteFileKind.Layout)
		return '+layout.svelte'
	if (kind === _RouteFileKind.LayoutModule)
		return '+layout.ts'

	throw new Error(`Unsupported route file kind: ${kind}`)
}

const renderImport = (spec: ImportSpec) => {
	const typeOnlyImport = spec.defaultName == null && (spec.names ?? []).length === 0
	const namedImports = [
		...(spec.names ?? []).map((name) => ({ name, isTypeOnly: false })),
		...(spec.typeNames ?? []).map((name) => ({ name, isTypeOnly: !typeOnlyImport })),
	]
	const importClause = ts.factory.createImportClause(
		typeOnlyImport,
		spec.defaultName == null ? undefined : ts.factory.createIdentifier(spec.defaultName),
		namedImports.length === 0 ?
			undefined
		:
			ts.factory.createNamedImports(
				namedImports.map((name) => ts.factory.createImportSpecifier(
					name.isTypeOnly,
					undefined,
					ts.factory.createIdentifier(name.name)
				))
			)
	)

	return ts.createPrinter({
		newLine: ts.NewLineKind.LineFeed,
	})
		.printNode(
			ts.EmitHint.Unspecified,
			ts.factory.createImportDeclaration(
				undefined,
				importClause,
				ts.factory.createStringLiteral(generatedImportSpecFrom(spec), true)
			),
			ts.createSourceFile('generated.ts', '', ts.ScriptTarget.ESNext)
		)
		.replace(/;$/, '')
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
				names: unique(spec.names ?? []).sort(),
				typeNames: unique(spec.typeNames ?? []).sort(),
			})
			continue
		}

		if (spec.defaultName != null)
			existing.defaultName = spec.defaultName
		existing.names = unique([
			...(existing.names ?? []),
			...(spec.names ?? []),
		]).sort()
		existing.typeNames = unique([
			...(existing.typeNames ?? []),
			...(spec.typeNames ?? []),
		]).sort()
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

const formatTsExpression = (source: string) => {
	const sourceFile = ts.createSourceFile(
		'expression.ts',
		`const value = (${source})`,
		ts.ScriptTarget.ESNext,
		true,
		ts.ScriptKind.TS
	)
	const declaration = sourceFile.statements[0]
	if (!ts.isVariableStatement(declaration))
		throw new Error(`Invalid expression: ${source}`)
	const expression = declaration.declarationList.declarations[0]?.initializer
	if (expression == null)
		throw new Error(`Invalid expression: ${source}`)

	return ts.createPrinter({
		newLine: ts.NewLineKind.LineFeed,
	})
		.printNode(ts.EmitHint.Expression, expression, sourceFile)
}

const renderLiteral = (value: string | number | boolean | null) => {
	if (typeof value === 'string')
		return q(value)
	if (value === null)
		return 'null'

	return String(value)
}

const renderFacetPredicate = (predicate: _AppFacetPredicate): string => (
	'all' in predicate ?
		renderObject([
			['all', renderArray(predicate.all.map(renderFacetPredicate))],
		])
	: 'any' in predicate ?
		renderObject([
			['any', renderArray(predicate.any.map(renderFacetPredicate))],
		])
	: 'equals' in predicate ?
		renderObject([
			['field', q(predicate.field)],
			['equals', renderLiteral(predicate.equals)],
		])
	:
		renderObject([
			['field', q(predicate.field)],
			['contains', renderLiteral(predicate.contains)],
		])
)

const facetPredicateFields = (predicate: _AppFacetPredicate): readonly string[] => (
	'all' in predicate ?
		unique(predicate.all.flatMap((child) => facetPredicateFields(child)))
	: 'any' in predicate ?
		unique(predicate.any.flatMap((child) => facetPredicateFields(child)))
	:
		[predicate.field]
)

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
	fields: readonly string[],
	openFields: readonly string[] | undefined,
	openExpression: string | undefined
) => {
	const fieldEntries = fields.map((field) => [field, 'true'] as const)
	if (openExpression == null || openFields == null || openFields.length === 0)
		return fieldEntries.length === 0 ? undefined : renderObject(fieldEntries)

	return [
		'{',
		...fieldEntries.map(([field, value]) => indent(`${field}: ${value},`)),
		indent(`...(${openExpression} && ${renderObject(openFields.map((field) => [field, 'true']))}),`),
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
	fields: readonly string[] = [],
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
	]).filter((field) => !excludedFields?.has(field))

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
	field: string | undefined,
	query: _ViewQuery | undefined
) => {
	const fieldDefinition = field == null ? undefined : fieldDefinitionByName(entity, field)
	return fieldDefinition == null ? query : fieldQuery(fieldDefinition, query)
}

const conditionFields = (
	conditions: readonly { field: string }[] | undefined
) => unique((conditions ?? []).map((condition) => condition.field))

const conditionExpression = (
	conditions: readonly {
		field: string
		equals?: _Literal
		notEquals?: _Literal
		contains?: _Literal
	}[],
	entityExpression: string,
	entity?: Entity,
	partial = false
) => conditions
	.map((condition) => {
		const fieldDefinition = entity == null ? undefined : fieldDefinitionByName(entity, condition.field)
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
			!('equals' in condition) ? undefined : `${conditionValueExpression} === ${renderLiteral(condition.equals)}`,
			!('notEquals' in condition) ? undefined : `${conditionValueExpression} !== ${renderLiteral(condition.notEquals)}`,
			!('contains' in condition) ? undefined : `${conditionValueExpression}.includes(${renderLiteral(condition.contains)})`,
		].filter(Boolean).join(' && ')
		return partial ? `${valueExpression} !== undefined && ${expression}` : expression
	})
	.join(' && ')

const renderConditionedEntityLines = (
	entity: Entity,
	conditions: readonly {
		field: string
		equals?: _Literal
		notEquals?: _Literal
		contains?: _Literal
	}[] | undefined,
	level: number,
	bodyLines: readonly string[]
) => {
	if (conditions == null || conditions.length === 0)
		return [...bodyLines]

	return [
		`${'\t'.repeat(level)}<ResourceBoundary`,
		renderSvelteAttribute(level + 1, 'resource', `selection(${renderQuery(undefined, conditionFields(conditions))})`),
		`${'\t'.repeat(level)}>`,
		`${'\t'.repeat(level + 1)}{#snippet children(entity)}`,
		`${'\t'.repeat(level + 2)}{@const ${resolvedEntityExpression} = ${resolvedEntitySurfaceExpression}}`,
		`${'\t'.repeat(level + 2)}{#if ${conditionExpression(conditions, resolvedEntityExpression, entity)}}`,
		...bodyLines.map((line) => indent(line, 3)),
		`${'\t'.repeat(level + 2)}{/if}`,
		`${'\t'.repeat(level + 1)}{/snippet}`,
		`${'\t'.repeat(level)}</ResourceBoundary>`,
	]
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

const renderRouteFieldPathCondition = (fieldsExpression: string, fieldPath: readonly string[]) => (
	fieldPath
		.map((_, index) => (
			`${fieldExpression(fieldsExpression, fieldPath[0] ?? '')}${fieldPath.slice(1, index + 1).map(propertyAccess).join('')} !== undefined`
		))
		.join(' && ')
)

const routeExpressionQueryFields = (expression: _Expression) => (
	unique(expressionFieldPaths(expression).map((fieldPath) => fieldPath[0]).filter((fieldName): fieldName is string => fieldName != null))
)

const renderRouteExpressionCondition = (fieldsExpression: string, expression: _Expression): string => {
	if (typeof expression === 'string' || 'raw' in expression)
		return ''

	if (expression.kind === 'case') {
		const valueCondition = renderRouteExpressionCondition(fieldsExpression, expression.value)
		const valueExpression = renderAppExpression(expression.value, {
			fields: fieldsExpression,
		})
		const caseCondition = `(${expression.cases
			.map((item) => `${valueExpression} === ${renderLiteral(item.equals)} ? ${renderRouteExpressionCondition(fieldsExpression, item.value) || 'true'}`)
			.join(' : ')} : ${renderRouteExpressionCondition(fieldsExpression, expression.default) || 'true'})`

		return valueCondition === '' ? caseCondition : `(${valueCondition} && ${caseCondition})`
	}

	return uniqueFieldPaths(expressionFieldPaths(expression))
		.map((fieldPath) => renderRouteFieldPathCondition(fieldsExpression, fieldPath))
		.join(' && ')
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
	if ('default' in value && Array.isArray(value.default)) {
		selections.push(value as _SourceSelection)
		return selections
	}
	for (const nestedValue of Object.values(value))
		collectSourceSelections(nestedValue, selections)

	return selections
}

const routeEntries = (
	nodes: App['routes']['tree'],
	parentPath = '',
	parentSurface?: RouteFile['surface']
): RouteEntry[] => nodes.flatMap((node) => {
	const routePath = [parentPath, node.segment].filter(Boolean).join('/')
	const mergeRouteSurface = (
		surface: RouteFile['surface'] | undefined,
		parent: RouteFile['surface'] | undefined
	): RouteFile['surface'] | undefined => (
		surface == null ?
			parent
		: parent == null ?
			surface
		:
			{
				...surface,
				requiredFacets: unique([
					...(parent.requiredFacets ?? []),
					...(surface.requiredFacets ?? []),
				]),
			}
	)
	const nodeSurface = mergeRouteSurface(
		node.files?.find((file) => file.surface != null)?.surface,
		parentSurface
	)
	return [
		...(node.files == null ? [] : [{
			routePath,
			files: node.files.map((file) => (
				nodeSurface != null ?
					{
						...file,
						surface: mergeRouteSurface(
							file.surface,
							nodeSurface
						),
						surfaceInherited: file.surface == null ? true : undefined,
					}
				:
					file
			)),
		}]),
		...(node.children == null ? [] : routeEntries(node.children, routePath, nodeSurface)),
	]
})

const routeHrefConditionFromFacetPredicate = (
	predicate: _AppFacetPredicate
): EntityHref['conditions'] => {
	if ('field' in predicate)
		return [predicate]

	throw new Error('Entity href facet predicates must be simple field predicates')
}

const routeSurfacePredicateValues = (
	network: RouteSurfaceNetwork,
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

const routeSurfacePredicateApplies = (
	predicate: _AppFacetPredicate,
	network: RouteSurfaceNetwork
): boolean => (
	'all' in predicate ?
		predicate.all.every((child) => routeSurfacePredicateApplies(child, network))
	: 'any' in predicate ?
		predicate.any.some((child) => routeSurfacePredicateApplies(child, network))
	: 'equals' in predicate ?
		routeSurfacePredicateValues(network, predicate.field)?.some((value) => value === predicate.equals) === true
	: 'contains' in predicate ?
		routeSurfacePredicateValues(network, predicate.field)?.some((value) => value === predicate.contains) === true
	:
		false
)

const routeHrefFromLoad = (
	entry: RouteEntry,
	routeFile: RouteFile,
	entityFacetById: ReadonlyMap<string, {
		entityType: string
		facet: NonNullable<App['schema']['entities'][number]['facets']>[number]
	}>
): EntityHref | undefined => {
	if (routeFile.load == null || routeFile.load.href == null || routeFile.load.href.entityHref === false)
		return undefined

	const href = routeId(entry.routePath)
	return {
		href,
		selector: routeFile.load.selector,
		conditions: [
			...(routeFile.surface?.requiredFacets ?? []).flatMap((facetId) => {
				const facetEntry = entityFacetById.get(facetId)
				if (facetEntry == null)
					throw new Error(`${entry.routePath} route href references missing facet ${facetId}`)
				if (routeFile.load?.entity !== facetEntry.entityType)
					return []

				return routeHrefConditionFromFacetPredicate(facetEntry.facet.predicate)
			}),
			...(routeFile.load.href.conditions ?? []),
		],
		params: [...routeFile.load.href.params],
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

const routeHrefFromCollection = (entry: RouteEntry, routeFile: RouteFile): CollectionRouteHref | undefined => {
	if (routeFile.collection == null)
		return undefined

	const href = routeId(entry.routePath)
	const selector = routeFile.collection.source.selector
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

const sourceBindings = (source: App['sources']['sources'][number]) => [
	...(source.binding == null ? [] : [source.binding]),
	...(source.bindings ?? []),
]

const routeSurfaceMetadataEntries = (metadata: RouteFixtureMetadata) => renderObject([
	['id', metadata.id == null ? undefined : q(metadata.id)],
	['label', metadata.label == null ? undefined : q(metadata.label)],
	['routeKind', metadata.routeKind == null ? undefined : q(metadata.routeKind)],
	['fixture', metadata.fixture == null ? undefined : renderObject(Object.entries(metadata.fixture).map(([key, value]) => [key, q(value)]))],
	['variants', metadata.variants == null ? undefined : renderArray(metadata.variants.map((variant) => renderObject(Object.entries(variant).map(([key, value]) => [key, q(value)]))))],
	['requiredFacets', metadata.requiredFacets == null ? undefined : renderArray(metadata.requiredFacets.map(q))],
	['requiredFacetPredicates', metadata.requiredFacetPredicates == null ? undefined : renderArray(metadata.requiredFacetPredicates.map(renderFacetPredicate))],
	['boundaryLiveOptional', metadata.boundaryLiveOptional == null ? undefined : 'true'],
])

const resolveFieldReference = (entity: Entity, field: FieldReference) => {
	if (!isFacetFieldReference(field))
		return field

	const facet = entity.facets?.find((facet) => facet.id === field.facet)
	if (facet == null)
		throw new Error(`${entity.entityType} references missing facet ${field.facet}`)
	if (!facet.fields?.some((facetField) => facetField.name === field.field))
		throw new Error(`${entity.entityType} facet ${field.facet} references missing field ${field.field}`)

	return facetFieldRuntimeName(field.facet, field.field)
}

const facetFieldReferenceConditions = (
	entity: Entity,
	field: unknown
) => {
	if (!isFacetFieldReference(field as FieldReference))
		return []

	const facet = entity.facets?.find((item) => item.id === (field as Extract<FieldReference, { facet: string }>).facet)
	if (facet == null)
		throw new Error(`${entity.entityType} references missing facet ${(field as Extract<FieldReference, { facet: string }>).facet}`)
	if (!('field' in facet.predicate))
		throw new Error(`${entity.entityType} facet ${facet.id} view conditions must use a simple field predicate`)

	return [facet.predicate]
}

const resolveFieldReferences = (entity: Entity, value: unknown, key?: string): unknown => {
	if (Array.isArray(value)) {
		if (key === 'fields' || key === 'openFields')
			return value.map((item) => resolveFieldReference(entity, item as FieldReference))

		return value.map((item) => resolveFieldReferences(entity, item))
	}

	if (value == null || typeof value !== 'object')
		return value

	if (isFacetFieldReference(value as FieldReference))
		return resolveFieldReference(entity, value as FieldReference)

	if ('field' in value && isFacetFieldReference((value as { field?: unknown }).field as FieldReference)) {
		const conditions = facetFieldReferenceConditions(entity, (value as { field?: unknown }).field)
		return Object.fromEntries(Object.entries({
			...value,
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
			entryKey === 'field' || entryKey === 'titleField' ?
				resolveFieldReference(entity, entryValue as FieldReference)
			:
				resolveFieldReferences(entity, entryValue, entryKey),
		]))
	}

	return Object.fromEntries(Object.entries(value).map(([entryKey, entryValue]) => [
		entryKey,
		entryKey === 'field' || entryKey === 'titleField' ?
			resolveFieldReference(entity, entryValue as FieldReference)
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

const singularViewWithFacetConditions = (
	facet: NonNullable<Entity['facets']>[number]
) => {
	if (facet.singularView == null)
		return undefined
	if (!('field' in facet.predicate))
		throw new Error(`${facet.id} facet singular view conditions must use a simple field predicate`)

	return {
		...facet.singularView,
		carousels: facet.singularView.carousels?.map((carousel) => ({
			...carousel,
			conditions: [
				...(carousel.conditions ?? []),
				facet.predicate,
			],
		})),
	} satisfies Partial<SingularView>
}

const resolveRouteFieldReferences = (
	entities: readonly Entity[],
	routeNodes: App['routes']['tree']
): App['routes']['tree'] => {
	const entityByType = new Map(entities.map((entity) => [
		entity.entityType,
		entity,
	]))

	return routeNodes.map((routeNode) => ({
		...routeNode,
		files: routeNode.files?.map((routeFile) => {
			if (routeFile.collection == null)
				return routeFile

			const sourceEntity = entityByType.get(routeFile.collection.source.entity)
			if (sourceEntity == null)
				throw new Error(`${routeFile.collection.source.entity} collection source references missing entity`)

			return {
				...routeFile,
				collection: {
					...routeFile.collection,
					source: {
						...routeFile.collection.source,
						field: resolveFieldReference(sourceEntity, routeFile.collection.source.field),
					},
				},
			}
		}),
		children: routeNode.children == null ? undefined : resolveRouteFieldReferences(entities, routeNode.children),
	}))
}

const normalizeApp = (app: App): App => {
	const hasSourceFacets = app.sources.sources.some((source) => source.facets != null && source.facets.length > 0)
	const hasEntityFacets = app.schema.entities.some((entity) => entity.facets != null && entity.facets.length > 0)
	if (!hasSourceFacets && !hasEntityFacets)
		return app

	return {
		...app,
		schema: {
			...app.schema,
			entities: app.schema.entities.map((entity) => {
				if (entity.facets == null || entity.facets.length === 0)
					return entity

				const facets = entity.facets.map((facet) => ({
					...facet,
					predicateFields: facetPredicateFields(facet.predicate),
				}))
				const facetFieldByName = new Map(facets.flatMap((facet) => (
					(facet.fields ?? []).map((field) => [
						facetFieldRuntimeName(facet.id, field.name),
						{
							...field,
							name: facetFieldRuntimeName(facet.id, field.name),
							facet: {
								id: facet.id,
								predicateFields: facet.predicateFields,
								predicate: facet.predicate,
							},
						},
					])
					)))
					const mergedFieldNames = new Set(entity.fields.map((field) => field.name))
				const singularView = facets.reduce(
					(view, facet) => {
						const facetSingularView = singularViewWithFacetConditions(facet)
						if (facetSingularView == null)
							return view

						return mergeSingularViews(
							view,
							resolveFieldReferences(entity, facetSingularView) as Partial<SingularView>
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
						fields: [
						...entity.fields.map((field) => facetFieldByName.get(field.name) ?? field),
						...[...facetFieldByName.values()].filter((field) => !mergedFieldNames.has(field.name)),
					],
				}
			}),
		},
		routes: {
			...app.routes,
			tree: resolveRouteFieldReferences(app.schema.entities, app.routes.tree),
		},
		sources: {
			...app.sources,
			sources: app.sources.sources.map((source) => (
				source.facets == null || source.facets.length === 0 ?
					source
				:
					{
						...source,
						binding: undefined,
						bindings: [
							...sourceBindings(source),
							...source.facets.flatMap((facet) => [
								...(facet.binding == null ? [] : [facet.binding]),
								...(facet.bindings ?? []),
							]),
						],
						facets: undefined,
					}
			)),
		},
	}
}

const sourceRows = (
	normalizedApp: App,
	checkedInSourceProviderModules: readonly CheckedInSourceProviderModule[]
) => [...new Map([
	...normalizedApp.sources.sources,
	...checkedInSourceProviderModules.flatMap((providerModule) => providerModule.sources),
].map((source) => [
	source.source,
	source,
])).values()]

const sourceProviderRows = (
	normalizedApp: App,
	checkedInSourceProviderModules: readonly CheckedInSourceProviderModule[]
) => [...new Map([
	...normalizedApp.sources.providers,
	...checkedInSourceProviderModules.map((providerModule) => ({
		provider: providerModule.provider,
		label: providerModule.label,
	})),
].map((provider) => [
	provider.provider,
	provider,
])).values()]

const validateAndIndex = (
	app: App,
	checkedInSourceProviderModules: readonly CheckedInSourceProviderModule[]
): AppIndexes => {
	const activeEntities = app.schema.entities
	const entityTypes = unique(activeEntities.map((entity) => entity.entityType))
	const entityByType = new Map(activeEntities.map((entity) => [entity.entityType, entity]))
	const valueTypeById = new Map(app.schema.valueTypes.map((valueType) => [valueType.id, valueType]))
	const sourceIds = new Set(sourceRows(app, checkedInSourceProviderModules).map((source) => source.source))
	const sourceProviderIds = new Set(sourceProviderRows(app, checkedInSourceProviderModules).map((provider) => provider.provider))
	const routeEntryList = routeEntries(app.routes.tree)
	const allEntityTypes = new Set(entityTypes)
	const errors: string[] = []
	const networkBaseResourceFields = new Set([
		'$$blockExplorerUrls',
		'$$faucetUrls',
		'$$nativeAssets',
	])
	const entityFacetById = new Map(activeEntities.flatMap((entity) => (
		(entity.facets ?? []).map((facet) => [
			facet.id,
			{
				entityType: entity.entityType,
				facet,
			},
		])
	)))

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
	expectUnique('active entity type', activeEntities.map((entity) => entity.entityType))
	expectUnique('value type', app.schema.valueTypes.map((valueType) => valueType.id))
	expectUnique('source', sourceRows(app, checkedInSourceProviderModules).map((source) => source.source))
	expectUnique('source provider', sourceProviderRows(app, checkedInSourceProviderModules).map((provider) => provider.provider))

	for (const entity of activeEntities) {
		if (entityLabelPlural(entity).trim() === '')
			errors.push(`${entity.entityType} is missing explicit labelPlural`)
		expectUnique(`${entity.entityType} selector`, entity.selectors.map((selector) => selector.name))
		for (const selector of entity.selectors) {
			if (!/^[A-Z][A-Za-z0-9]*$/.test(selector.name))
				errors.push(`${entity.entityType} selector ${selector.name} must be TitleCase`)
		}
		expectUnique(`${entity.entityType} field`, entity.fields.map((field) => field.name))
		const fieldNames = new Set(entity.fields.map((field) => field.name))
		for (const selector of entity.selectors) {
			if (!/^[A-Z][A-Za-z0-9]*$/.test(selector.name))
				errors.push(`${entity.entityType}.${selector.name} selector name must be TitleCase because it is emitted as an enum member`)
			for (const field of selector.fields) {
				if (!fieldNames.has(field))
					errors.push(`${entity.entityType}.${selector.name} references missing field ${field}`)
			}
		}
		for (const field of entity.fields) {
			if (field.valueType != null && !valueTypeById.has(field.valueType))
				errors.push(`${entity.entityType}.${field.name} references missing value type ${field.valueType}`)
			if (field.entityType != null && !allEntityTypes.has(field.entityType))
				errors.push(`${entity.entityType}.${field.name} references missing entity type ${field.entityType}`)
			for (const source of field.defaultSources ?? []) {
				if (!sourceIds.has(source))
					errors.push(`${entity.entityType}.${field.name} references missing source ${source}`)
			}
		}
		for (const facet of entity.facets ?? []) {
			for (const field of facet.predicateFields) {
				if (!fieldNames.has(field))
					errors.push(`${entity.entityType} facet ${facet.id} predicateFields references missing field ${field}`)
			}
			const actualPredicateFields = facetPredicateFields(facet.predicate)
			for (const field of actualPredicateFields) {
				if (!fieldNames.has(field))
					errors.push(`${entity.entityType} facet ${facet.id} predicate references missing field ${field}`)
				if (!facet.predicateFields.includes(field))
					errors.push(`${entity.entityType} facet ${facet.id} predicateFields omits predicate field ${field}`)
			}
			for (const field of facet.predicateFields) {
				if (!actualPredicateFields.includes(field))
					errors.push(`${entity.entityType} facet ${facet.id} predicateFields includes non-predicate field ${field}`)
			}
		}
		for (const list of entitySingularView(entity)?.lists ?? []) {
			if (list.field != null && !fieldNames.has(list.field))
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

	for (const source of sourceRows(app, checkedInSourceProviderModules)) {
		if (!sourceProviderIds.has(source.provider))
			errors.push(`${source.source} references missing provider ${source.provider}`)
	}

	const generatedComponents = new Set(activeEntities.flatMap((entity) => [
		singularComponentName(entity.entityType),
		pluralComponentName(entity),
	]))

	for (const entry of routeEntryList) {
		const hasPage = entry.files.some((routeFile) => routeFile.kind === _RouteFileKind.Page)
		const visibleSegments = publicRouteId(entry.routePath)
			.split('/')
			.filter((segment) => segment !== '' && !segment.startsWith('['))
		for (const segment of visibleSegments) {
			if (segment === 'by')
				errors.push(`${entry.routePath} uses visible /by route segment`)
		}
		for (const [index, segment] of visibleSegments.entries()) {
			const nextSegment = visibleSegments[index + 1]
			if (nextSegment == null)
				continue
			if (segment === nextSegment)
				errors.push(`${entry.routePath} repeats visible route segment ${segment}`)
		}

		for (const routeFile of entry.files) {
			if (routeFile.kind === _RouteFileKind.PageModule && !hasPage)
				errors.push(`${entry.routePath} page module has no sibling page; use a layout module for route-group state or add an APP-owned page render`)

			if (routeFile.view?.entity != null && !entityByType.has(routeFile.view.entity))
				errors.push(`${entry.routePath} view references missing entity ${routeFile.view.entity}`)

			if (routeFile.load?.entity != null && !entityByType.has(routeFile.load.entity))
				errors.push(`${entry.routePath} load references missing entity ${routeFile.load.entity}`)

			if (routeFile.layout?.entity != null && !entityByType.has(routeFile.layout.entity))
				errors.push(`${entry.routePath} layout references missing entity ${routeFile.layout.entity}`)

			if (routeFile.load?.href != null) {
				const routeParams = routeParamNames(routeId(entry.routePath))
				const hrefParams = routeFile.load.href.params.map((param) => param.param)
				for (const param of routeParams) {
					if (!hrefParams.includes(param))
						errors.push(`${entry.routePath} load href is missing route param ${param}`)
				}
				for (const param of hrefParams) {
					if (!routeParams.includes(param))
						errors.push(`${entry.routePath} load href declares unknown route param ${param}`)
					if (hrefParams.indexOf(param) !== hrefParams.lastIndexOf(param))
						errors.push(`${entry.routePath} load href repeats route param ${param}`)
				}
			}

			if (
				routeFile.view?.component != null
				&& routeFile.view.entity == null
				&& routeFile.collection == null
				&& !generatedComponents.has(routeFile.view.component)
			)
				errors.push(`${entry.routePath} view references missing generated component ${routeFile.view.component}`)

			if (routeFile.collection == null)
				continue

			const collectionEntity = entityByType.get(routeFile.collection.entity)
			const sourceEntity = entityByType.get(routeFile.collection.source.entity)
			if (collectionEntity == null)
				errors.push(`${entry.routePath} collection references missing entity ${routeFile.collection.entity}`)
			if (sourceEntity == null) {
				if (!allEntityTypes.has(routeFile.collection.source.entity))
					errors.push(`${entry.routePath} collection source references missing entity ${routeFile.collection.source.entity}`)
				continue
			}

			if (!sourceEntity.fields.some((field) => field.name === routeFile.collection?.source.field))
				errors.push(`${entry.routePath} collection source references missing field ${routeFile.collection.source.entity}.${routeFile.collection.source.field}`)
			if (
				entry.routePath.startsWith('(explore)/(networks)/network/')
				&& routeFile.collection.source.entity !== EntityType.Network
				&& networkBaseResourceFields.has(routeFile.collection.source.field)
			)
				errors.push(`${entry.routePath} collection source must read ${routeFile.collection.source.field} from Network, not ${routeFile.collection.source.entity}`)
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
	const routeFixtureMetadataByRouteId = new Map<string, NonNullable<RouteFile['surface']>>()
	for (const entry of routeEntryList) {
		for (const routeFile of entry.files) {
			if (routeFile.surface != null) {
				const href = publicRouteId(entry.routePath)
				const routeParams = new Set(routeParamNames(href))
				if (routeFile.surface.id == null)
					errors.push(`${entry.routePath} route surface is missing id`)
					const requiredFacetPredicates = (routeFile.surface.requiredFacets ?? []).map((facetId) => {
						const facetEntry = entityFacetById.get(facetId)
						if (facetEntry == null) {
							errors.push(`${entry.routePath} route surface ${routeFile.surface?.id} references missing facet ${facetId}`)
							return undefined
						}
						return facetEntry.facet.predicate
					}).filter((predicate) => predicate != null)
					for (const param of [
						...Object.keys(routeFile.surface.fixture ?? {}),
						...(routeFile.surface.variants ?? []).flatMap((variant) => Object.keys(variant)),
					])
						if (!routeParams.has(param))
							errors.push(`${entry.routePath} route surface ${routeFile.surface.id} fixture references unknown route param ${param}`)

					for (const routeSurfaceFixture of [
						...(routeFile.surface.fixture == null ? [] : [routeFile.surface.fixture]),
						...(routeFile.surface.variants ?? []),
					]) {
						const routeSurfaceNetwork = (
							routeSurfaceFixture.networkSlug != null ?
								networkBySlug[routeSurfaceFixture.networkSlug]
							: routeSurfaceFixture.caip2 != null ?
								networkByCaip2[routeSurfaceFixture.caip2]
							:
								undefined
						)
						if (routeSurfaceNetwork == null && requiredFacetPredicates.length > 0 && (routeSurfaceFixture.networkSlug != null || routeSurfaceFixture.caip2 != null))
							errors.push(`${entry.routePath} route surface ${routeFile.surface.id} fixture does not resolve to a known Network row`)
						if (
							routeSurfaceNetwork != null
							&& requiredFacetPredicates.some((predicate) => !routeSurfacePredicateApplies(predicate, routeSurfaceNetwork))
						)
							errors.push(`${entry.routePath} route surface ${routeFile.surface.id} fixture ${routeSurfaceNetwork.slug} does not satisfy required facet predicates`)
					}

					routeFixtureMetadataByRouteId.set(href, {
						...routeFile.surface,
						requiredFacetPredicates,
					})
				}

			if (
				routeFile.collection != null
				&& routeParamNames(routeId(entry.routePath)).length === 0
				&& (
					collectionHrefByEntity.get(routeFile.collection.entity) == null
					|| routeId(entry.routePath).length < (collectionHrefByEntity.get(routeFile.collection.entity) ?? '').length
				)
			)
				collectionHrefByEntity.set(routeFile.collection.entity, routeId(entry.routePath))

			const collectionHref = routeHrefFromCollection(entry, routeFile)
			if (routeFile.collection != null && collectionHref != null) {
				const key = collectionSourceFieldKey(
					routeFile.collection.source.entity,
					routeFile.collection.source.field,
					routeFile.collection.entity
				)
				if (
					collectionHrefBySourceField.get(key) == null
					|| collectionHref.href.length < (collectionHrefBySourceField.get(key)?.href.length ?? 0)
				)
					collectionHrefBySourceField.set(key, collectionHref)
			}

				const entityHref = routeHrefFromLoad(entry, routeFile, entityFacetById)
			if (
				routeFile.load != null
				&& entityHref != null
				&& (entityHrefsByType.get(routeFile.load.entity) ?? []).every((href) => JSON.stringify({
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
				entityHrefsByType.set(routeFile.load.entity, [
					...(entityHrefsByType.get(routeFile.load.entity) ?? []),
					entityHref,
				])
		}
	}

	return {
		activeEntities,
		entityTypes,
		entityByType,
		valueTypeById,
		sourceIds,
		sourceProviderIds,
		routeEntries: routeEntryList,
		collectionHrefByEntity,
		collectionHrefBySourceField,
		entityHrefsByType,
		routeFixtureMetadataByRouteId,
		generatedComponents,
		sourceSelections: unique(collectSourceSelections(app)),
	}
}

const deriveFiles = (
	normalizedApp: App,
	indexes: AppIndexes,
	checkedInSourceProviderModules: readonly CheckedInSourceProviderModule[],
	sourceDefinitionModules: readonly SourceDefinitionModule[]
): GeneratedFile[] => {
	const relationshipListViews = namedRelationshipListViews(indexes)
	const files = [
		renderEntityTypeFile(indexes.entityTypes),
		...indexes.activeEntities.map((entity) => renderEntitySchemaFile(entity, indexes)),
		renderSchemaIndexFile(indexes),
		renderSourceFile(normalizedApp, checkedInSourceProviderModules),
		renderSourceProviderFile(normalizedApp, checkedInSourceProviderModules),
		...sourceDefinitionModules.map((module) => renderSourceDefinitionFile(module)),
		renderSourceProvidersFile(normalizedApp, checkedInSourceProviderModules, sourceDefinitionModules),
		renderSourcesMarkdownFile(normalizedApp, checkedInSourceProviderModules),
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
		...indexes.routeEntries.flatMap((entry) => renderRouteFiles(entry, indexes)),
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

const renderE2eRouteFixtureMetadataFile = (indexes: AppIndexes) => tsFile(
	'tests/e2e/_generatedRouteFixtureMetadata.ts',
	{
		body: [
			'export type E2eRouteFacetPredicate =',
			'\t| { readonly field: string, readonly equals: string | number | boolean | null }',
			'\t| { readonly field: string, readonly contains: string | number | boolean | null }',
			'\t| { readonly all: readonly E2eRouteFacetPredicate[] }',
			'\t| { readonly any: readonly E2eRouteFacetPredicate[] }',
			'',
			'export type E2eRouteFixtureMetadata = {',
			'\tid?: string',
			'\tlabel?: string',
			'\trouteKind?: string',
			'\tfixture?: Readonly<Partial<Record<string, string>>>',
			'\tvariants?: readonly Readonly<Partial<Record<string, string>>>[]',
			'\trequiredFacets?: readonly string[]',
			'\trequiredFacetPredicates?: readonly E2eRouteFacetPredicate[]',
			'\tboundaryLiveOptional?: true',
			'}',
			'',
			`export const e2eRouteFixtureMetadataByRouteId = ${renderObject(unique(indexes.routeEntries
				.map((entry) => publicRouteId(entry.routePath))
				.filter((href) => routeParamNames(href).length > 0)
				.sort((left, right) => left.localeCompare(right, 'en', {
					sensitivity: 'base',
					numeric: true,
				})))
				.map((href) => [
					q(href),
					indexes.routeFixtureMetadataByRouteId.get(href) == null ?
						'{}'
					:
						routeSurfaceMetadataEntries(indexes.routeFixtureMetadataByRouteId.get(href)),
				]))} as const satisfies Record<string, E2eRouteFixtureMetadata>`,
		],
	}
)

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
	const defaultSources = entity.fields.some((field) => field.defaultSources != null)
	const localEnumNames = new Set((entity.enums ?? []).map((appEnum) => appEnum.name))
	const valueTypeImports = entity.fields.flatMap((field) => (
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
			],
			typeNames: ['EntityDefinition'],
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
		'export default {',
		indent(`entityType: ${enumAccess('EntityType', entity.entityType)},`),
		indent(`label: ${q(entityLabel(entity))},`),
		indent(`labelPlural: ${q(entityLabelPlural(entity))},`),
		...(entity.description == null ? [] : [indent(`description: ${q(entity.description)},`)]),
		indent('selectors: ['),
		...entity.selectors.flatMap((selector) => [
			indent('{', 2),
			indent(`name: ${selectorEnum}.${selectorMemberName(selector)},`, 3),
			indent('fields: [', 3),
			...selector.fields.map((fieldName) => indent(`${q(fieldName)},`, 4)),
			indent('],', 3),
			indent('},', 2),
		]),
		indent('],'),
		indent('fields: ['),
		...entity.fields.flatMap((fieldDefinition) => renderSchemaField(fieldDefinition, indexes).map((line) => indent(line, 2))),
		indent('],'),
		`} as const satisfies EntityDefinition`,
	]

	return tsFile(
		schemaModulePath(entity.entityType).replace(/^\$\//, 'src/'),
		{
			imports,
			body,
		}
	)
}

const renderSchemaField = (fieldDefinition: EntityField, indexes: AppIndexes) => {
	const valueType = fieldDefinition.valueType == null ? undefined : indexes.valueTypeById.get(fieldDefinition.valueType)
	const entries: [string, string | undefined][] = [
		['name', q(fieldDefinition.name)],
		['label', fieldDefinition.label == null ? undefined : q(fieldDefinition.label)],
		['labelPlural', fieldDefinition.labelPlural == null ? undefined : q(fieldDefinition.labelPlural)],
		['description', fieldDefinition.description == null ? undefined : q(fieldDefinition.description)],
		['type', enumAccess('EntityFieldType', fieldDefinition.type)],
		[
			'primitiveType',
			fieldDefinition.type === EntityFieldType.Primitive ?
				renderValueTypeType(valueType?.type ?? fieldDefinition.primitiveType)
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
		[
			'when',
			fieldDefinition.when == null ?
				undefined
			:
				renderObject([
					['fieldName', q(fieldDefinition.when.fieldName)],
					['values', renderArray(fieldDefinition.when.values.map(renderLiteral))],
					['itemIndex', fieldDefinition.when.itemIndex == null ? undefined : String(fieldDefinition.when.itemIndex)],
				]),
		],
		[
			'facet',
			fieldDefinition.facet == null ?
				undefined
			:
				renderObject([
					['id', q(fieldDefinition.facet.id)],
					['predicateFields', renderArray(fieldDefinition.facet.predicateFields.map(q))],
					['predicate', fieldDefinition.facet.predicate == null ? undefined : renderFacetPredicate(fieldDefinition.facet.predicate)],
				]),
		],
		['normalize', fieldDefinition.normalize],
	]

	return [
		'{',
		...renderObject(entries).split('\n').slice(1, -1),
		'},',
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
					defaultName: `${entityType}Schema`,
				})),
			],
			body,
		}
	)
}

const renderSourceFile = (
	normalizedApp: App,
	checkedInSourceProviderModules: readonly CheckedInSourceProviderModule[]
) => tsFile(
	'src/sources/Source.ts',
	{
		body: [
			renderStringEnum('Source', unique(sourceRows(normalizedApp, checkedInSourceProviderModules).map((source) => source.source))),
		],
	}
)

const renderSourceProviderFile = (
	normalizedApp: App,
	checkedInSourceProviderModules: readonly CheckedInSourceProviderModule[]
) => tsFile(
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
			renderStringEnum('SourceProvider', unique(sourceProviderRows(normalizedApp, checkedInSourceProviderModules).map((provider) => provider.provider))),
		],
	}
)

const renderMarkdownTableRow = (cells: readonly string[]) => (
	`| ${cells.map((cell) => cell.replaceAll('|', '\\|')).join(' | ')} |`
)

const renderSourceCredentialSummary = (binding: SourceBinding) => (
	binding.credentials.map((credential) => (
		credential.keys == null || credential.keys.length === 0 ?
			credential.scope
		:
			`${credential.scope} (${credential.keys.join(', ')})`
	)).join('<br>')
)

const renderSourceEndpointSummary = (binding: SourceBinding) => (
	binding.endpoints.map((endpoint) => (
		[
			endpoint.endpointKind,
			endpoint.locator,
			endpoint.origin == null ? undefined : `origin ${endpoint.origin}`,
			endpoint.corsEnabled == null ? undefined : `CORS ${endpoint.corsEnabled}`,
		]
			.filter((part) => part != null)
			.join('<br>')
	)).join('<br>')
)

const renderSourceArtifactSummary = (binding: SourceBinding) => (
	binding.artifacts == null || binding.artifacts.length === 0 ?
		''
	:
		binding.artifacts.map((artifact) => (
			`${artifact.kind}: ${artifact.path} (${artifact.generated ? 'generated' : 'checked-in'})`
		)).join('<br>')
)

const renderSourceBindingDocRows = (
	source: App['sources']['sources'][number],
	providerLabel: string
) => sourceBindings(source).map((binding) => renderMarkdownTableRow([
	providerLabel,
	String(source.provider),
	String(source.source),
	source.label,
	`${binding.target.kind}:${binding.target.key}`,
	renderSourceEndpointSummary(binding),
	String(binding.wireProtocol),
	String(binding.apiFamily),
	binding.operationGroups.join('<br>'),
	String(binding.delivery),
	renderSourceCredentialSummary(binding),
	renderSourceArtifactSummary(binding),
]))

const renderSourcesMarkdownFile = (
	normalizedApp: App,
	checkedInSourceProviderModules: readonly CheckedInSourceProviderModule[]
) => {
	const providerLabelByProvider = new Map(sourceProviderRows(normalizedApp, checkedInSourceProviderModules).map((provider) => [
		provider.provider,
		provider.label,
	]))

	return textFile('SOURCES.md', [
		'# Blockhead Sources',
		'',
		'This file is generated from `APP.ts` source provider, source, binding, runtime binding, and artifact rows.',
		'',
		'## Source Bindings',
		'',
		renderMarkdownTableRow([
			'Provider label',
			'Provider',
			'Source',
			'Source label',
			'Target',
			'Endpoints',
			'Wire protocol',
			'API family',
			'Operation groups',
			'Delivery',
			'Credentials',
			'Artifacts',
		]),
		renderMarkdownTableRow([
			'---',
			'---',
			'---',
			'---',
			'---',
			'---',
			'---',
			'---',
			'---',
			'---',
			'---',
			'---',
		]),
		...sourceRows(normalizedApp, checkedInSourceProviderModules).flatMap((source) => (
			renderSourceBindingDocRows(source, providerLabelByProvider.get(source.provider) ?? source.provider)
		)),
	])
}

const renderEnvSchema = (env: App['sources']['providers'][number]['env']) => (
	env == null ?
		undefined
	:
		`type({\n${env.keys.map((key) => `\t${q(key.name)}: ${q(key.type)},`).join('\n')}\n})`
)

const renderSourceProvidersFile = (
	normalizedApp: App,
	checkedInSourceProviderModules: readonly CheckedInSourceProviderModule[],
	sourceDefinitionModules: readonly SourceDefinitionModule[]
) => {
	const sourcesByProvider = Map.groupBy(normalizedApp.sources.sources, (source) => source.provider)
	const sourceDefinitionModuleBySource = new Map(sourceDefinitionModules.map((module) => [
		module.source,
		module,
	]))
	const providerDefinitions = normalizedApp.sources.providers.map((provider) => {
		const sources = sourcesByProvider.get(provider.provider) ?? []
		const origins = [
			...new Map(
				sources
					.flatMap(sourceBindings)
					.flatMap((binding) => binding.endpoints)
					.flatMap((endpoint) => (
						endpoint.origin == null ?
							[]
						:
							[[
								endpoint.origin,
								{
									origin: endpoint.origin,
									corsEnabled: endpoint.corsEnabled === true,
								},
							]]
					))
			).values(),
		]
		return renderObject([
			['provider', enumAccess('SourceProvider', provider.provider)],
			['label', q(provider.label)],
			['env', renderEnvSchema(provider.env)],
			['sources', renderArray(sources.map((source) => sourceDefinitionModuleBySource.get(source.source)?.importName ?? renderSourceDefinition(source)))],
			['bindings', renderArray(sources.flatMap((source) => (
				sourceBindings(source).map((binding) => renderSourceBinding(provider.provider, source.source, binding))
			)))],
			['origins', origins.length === 0 ? undefined : renderArray(origins.map((origin) => renderObject([
				['origin', q(origin.origin)],
				['corsEnabled', String(origin.corsEnabled)],
			])))],
		])
	})

	return tsFile(
			'src/sources/$sourceProviders.ts',
			{
				imports: [
					...sourceDefinitionModules.map((module) => ({
						from: `$/sources/${module.path}`,
						defaultName: module.importName,
					})),
					...checkedInSourceProviderModules.map((providerModule) => ({
						from: `$/sources/${providerModule.path}`,
						defaultName: providerModule.importName,
					})),
					{
						from: 'arktype',
						names: ['type'],
				},
				{
					from: '$/sources/SourceProvider.ts',
					names: ['SourceProvider'],
					typeNames: ['SourceProviderDefinition'],
				},
				{
					from: '$/sources/Source.ts',
					names: ['Source'],
				},
				{
					from: '$/sources/SourceBinding.ts',
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
			],
				body: [
					'export const sourceProviderDefinitions: readonly SourceProviderDefinition[] = [',
					...providerDefinitions.map((definition) => indent(`${definition},`)),
					...checkedInSourceProviderModules.map((providerModule) => indent(`${providerModule.importName},`)),
					']',
					'',
					'export const sourceProviders = sourceProviderDefinitions',
			],
		}
	)
}

const renderSourceDefinition = (source: Pick<App['sources']['sources'][number], 'provider' | 'source' | 'label' | 'env'>) => renderObject([
	['provider', enumAccess('SourceProvider', source.provider)],
	['source', enumAccess('Source', source.source)],
	['label', q(source.label)],
	['env', renderEnvSchema(source.env)],
])

const renderSourceDefinitionFile = (module: SourceDefinitionModule) => tsFile(
	`src/sources/${module.path}`,
	{
		imports: [
			{
				from: '$/sources/Source.ts',
				names: ['Source'],
			},
			{
				from: '$/sources/SourceProvider.ts',
				names: ['SourceProvider'],
			},
			{
				from: '$/sources/$sources.ts',
				typeNames: ['SourceDefinition as SourceDefinitionTemplate'],
			},
		],
		body: [
			`const ${module.importName} = ${renderSourceDefinition(module)} satisfies SourceDefinitionTemplate<SourceProvider, Source>`,
			'',
			`export default ${module.importName}`,
		],
	}
)

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

const renderSourceSelectionsFile = (sourceSelections: readonly _SourceSelection[]) => tsFile(
	'src/sources/$sourceSelections.ts',
	{
		imports: [
			{
				from: '$/sources/Source.ts',
				names: ['Source'],
			},
		],
		body: unique(sourceSelections.filter((selection) => selection.name != null))
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
			'\t\t\t&& binding.credentials.every((credential) => (',
			'\t\t\t\tcredential.scope === SourceCredentialScope.None',
			'\t\t\t\t|| credential.scope === SourceCredentialScope.PublicConfig',
			'\t\t\t\t|| credential.scope === SourceCredentialScope.UserDelegated',
			'\t\t\t))',
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
	...(entitySingularView(entity)?.content?.body == null ? [] : [entitySingularView(entity).content.body.field]),
	...(entitySingularView(entity)?.content?.blocks ?? []).flatMap((viewEntries) => viewEntries.flatMap((viewEntry) => itemFieldName(viewEntry))),
	...(entitySingularView(entity)?.details?.items ?? []).flatMap((group) => group.items.flatMap((viewEntry) => itemFieldName(viewEntry))),
	...(entitySingularView(entity)?.details?.body == null ? [] : [entitySingularView(entity).details.body.field]),
	...(entitySingularView(entity)?.details?.tabs ?? []).flatMap((group) => (group.items ?? []).flatMap((viewEntry) => itemFieldName(viewEntry))),
	...(entitySingularView(entity)?.carousels ?? []).flatMap((group) => group.sections.flatMap((section) => (section.items ?? []).flatMap((viewEntry) => itemFieldName(viewEntry)))),
])

const entitySelectorFieldNames = (entity: Entity) => new Set(entity.selectors.flatMap((selector) => selector.fields))

const entitySelectorOwnsField = (entity: Entity, fieldName: string) => entity.selectors.every((selector) => selector.fields.includes(fieldName))

const pendingEntityExpression = 'pendingEntity'

const resolvedEntityExpression = 'resolvedEntity'

const pendingEntitySurfaceExpression = '({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched })'

const resolvedEntitySurfaceExpression = `{ ...${pendingEntityExpression}, ...entity }`

const pendingFieldExpression = (entity: Entity, fieldName: string) => (
	entitySelectorOwnsField(entity, fieldName) ?
		`${fieldExpression('selection.entitySelector', fieldName)} ?? ${fieldExpression('prefetched', fieldName)}`
	:
		fieldExpression('prefetched', fieldName)
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

const itemFieldName = (viewEntry: _ViewItem) => {
	if (typeof viewEntry === 'string')
		return [viewEntry]
	if ('fields' in viewEntry && viewEntry.fields != null)
		return viewEntry.fields
	if ('field' in viewEntry)
		return [viewEntry.field]

	return []
}

const fieldDefinitionByName = (entity: Entity, fieldName: string) => entity.fields.find((fieldDefinition) => fieldDefinition.name === fieldName)

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
	const fieldName = itemFieldName(viewEntry)[0]
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
	...(entitySingularView(entity)?.content?.dl ?? []).flat(),
	...(entitySingularView(entity)?.content?.blocks ?? []).flat(),
	...(entitySingularView(entity)?.details?.items ?? []).flatMap((group) => group.items),
	...(entitySingularView(entity)?.details?.blocks ?? []).flat(),
	...(entitySingularView(entity)?.details?.tabs ?? []).flatMap((group) => group.items ?? []),
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
		entitySingularView(entity)?.content?.body?.format != null
		&& formats.includes(entitySingularView(entity).content.body.format)
	)
	|| (
		entitySingularView(entity)?.details?.body?.format != null
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
		(entitySingularView(entity)?.content?.dl ?? []).length > 0
		|| entitySingularView(entity)?.content?.body != null
		|| (entitySingularView(entity)?.content?.blocks ?? []).length > 0
		|| (entitySingularView(entity)?.latest ?? []).length > 0
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
	const modeledDlGroups = entitySingularView(entity)?.content?.dl ?? []
	const effectiveDlGroups = modeledDlGroups.filter((viewEntries) => viewEntries.length > 0)
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

const contentBlocks = (entity: Entity) => entitySingularView(entity)?.content?.blocks ?? []

const declaredRelationshipViewSections = (entity: Entity) => {
	const configuredSections: RelationshipSection[] = [
		...(entitySingularView(entity)?.lists ?? []).flatMap((list) => (
			list.field == null ?
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
		...(entitySingularView(entity)?.query?.fields ?? []),
		...viewItems(entitySingularView(entity)?.summary?.icon).flatMap((viewEntry) => itemFieldName(viewEntry)),
		...summarySerialItems(entity).flatMap((viewEntry) => itemFieldName(viewEntry)),
		...viewItems(entitySingularView(entity)?.summary?.title).flatMap((viewEntry) => itemFieldName(viewEntry)),
		...viewItems(entitySingularView(entity)?.summary?.value).flatMap((viewEntry) => itemFieldName(viewEntry)),
		...viewItems(entitySingularView(entity)?.summary?.titleFallback).flatMap((viewEntry) => itemFieldName(viewEntry)),
		...viewItems(entitySingularView(entity)?.summary?.HeadingAfter).flatMap((viewEntry) => itemFieldName(viewEntry)),
	]).filter((fieldName) => fieldDefinitionByName(entity, fieldName) != null && !selectorFieldNames.has(fieldName))
		const sections = declaredRelationshipViewSections(entity)
	const detailsTabs = entitySingularView(entity)?.details?.tabs ?? []
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
	const latestItems = entitySingularView(entity)?.latest ?? []
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
		(entitySingularView(entity)?.details?.tabs ?? []).flatMap((tab) => (
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
	const viewSourceSelection = entitySingularView(entity)?.query?.sources
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
	const query = renderQuery(entitySingularView(entity)?.query, queryFields, viewSourcesExpression, undefined, selectorFieldNames)
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
		entitySingularView(entity)?.query?.sources,
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
	const iconMarkup = renderIconSnippet(entity, entityName)
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
	const detailTabsMarkup = renderDetailsTabs(entity, indexes, entityName)
	const carouselMarkup = carousels.flatMap((carousel) => renderCarousel(entity, indexes, carousel))
	const detailBlockMarkup = (entitySingularView(entity)?.details?.blocks ?? []).flatMap((viewEntries) => viewEntries.flatMap((viewEntry) => renderContentBlock(
		entity,
		indexes,
		typeof viewEntry === 'object' && 'when' in viewEntry ? { ...viewEntry, when: 'always' } : viewEntry,
		'detailsOpen',
		3
	)))
	const latestMarkup = latestItems.flatMap((latest) => renderLatestContentItem(entity, indexes, latest, 3))
	const contentRowMarkupGroups = contentRows.map((viewEntries) => viewEntries.flatMap((viewEntry) => renderContentItem(entity, indexes, viewEntry, 'contentOpen', 3)))
		.filter((group) => group.length > 0)
	const contentBodyMarkup = renderBodySection(entity, indexes, entitySingularView(entity)?.content?.body, 'contentOpen', 2)
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

		const fieldName = itemFieldName(viewEntry)[0]
		if (fieldName == null)
			return []

		const fieldValueName = `${localIdentifier(fieldName)}${viewEntryIndex}`
		const fieldDefinition = fieldDefinitionByName(entity, fieldName)
		if (fieldDefinition?.type === EntityFieldType.EntityReference && fieldDefinition.entityType != null) {
			const targetEntity = indexes.entityByType.get(fieldDefinition.entityType)
			if (targetEntity != null) {
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
					renderSvelteAttribute(5, 'resource', fieldResourceExpression('selection', fieldName, fieldDefinition.entityType, renderQuery(fieldQuery(fieldDefinition, undefined)), false)),
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

			return []
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
	const detailBodyMarkup = renderBodySection(entity, indexes, entitySingularView(entity)?.details?.body, 'detailsOpen', 3)
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
		...contentBodyMarkup,
		...contentBlockMarkup,
		...detailsMarkup,
	].some((line) => line.includes('EntityProxyField'))
	const usesSource = [
		...iconMarkup,
		...pendingSummaryTitleMarkup,
		...entitySummaryTitleMarkup,
		...pendingSummaryValueMarkup,
		...entitySummaryValueMarkup,
		...latestMarkup,
		...contentRowMarkupGroups.flat(),
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
		`const ${pendingEntityExpression} = $derived(${pendingEntitySurfaceExpression})`,
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
		...renderSummaryAfter(entity, indexes, entityName),
		...(typeAnnotationTooltipMarkup.length === 0 ? [] : [
			'',
			'\t{#snippet TypeAnnotationTooltip()}',
			...typeAnnotationTooltipMarkup,
			'\t{/snippet}',
		]),
		...(latestMarkup.length === 0 && contentRowMarkupGroups.length === 0 && contentBodyMarkup.length === 0 && contentBlockMarkup.length === 0 ? [] : [
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

	return []
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
	body: SingularView['content']['body'],
	openExpression: string,
	level: number
) => {
	if (body == null)
		return []

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
	const query = renderQuery(fieldQueryForName(entity, body.field, undefined), [body.field])
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

	const fieldName = itemFieldName(viewEntry)[0]
	if (fieldName == null)
		return []

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
				renderSvelteAttribute(level + 1, 'resource', fieldResourceExpression('selection', fieldName, fieldDefinition.entityType, renderQuery(fieldQuery(fieldDefinition, undefined)), false)),
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

		return []
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

const renderSummaryAfter = (entity: Entity, indexes: AppIndexes, entityName: string) => {
	const viewEntries = viewItems(entitySingularView(entity)?.summary?.HeadingAfter)
	if (viewEntries.length === 0)
		return []

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
		return []

	const iconField = icon == null ? undefined : itemFieldName(icon)[0]
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
	fieldName: string,
	label: string,
	openExpression: string,
	level: number
) => {
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
			renderSvelteAttribute(level + 1, 'resource', fieldResourceExpression('selection', fieldName, fieldDefinition.entityType, query, false)),
			`${'\t'.repeat(level)}>`,
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
		renderSvelteAttribute(level + 3, 'resource', fieldResourceExpression('selection', fieldName, fieldDefinition.entityType, query, false)),
		`${'\t'.repeat(level + 2)}>`,
		`${'\t'.repeat(level + 3)}{#snippet children(${targetEntityName})}`,
		`${'\t'.repeat(level + 4)}{#if ${targetEntityName}[EntityMetaKey.Selector] != null}`,
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
	level: number
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

	const fieldName = itemFieldName(viewEntry)[0]
	if (fieldName == null)
		return []
	const fieldDefinition = fieldDefinitionByName(entity, fieldName)
	if (fieldDefinition == null)
		return []
	if (fieldDefinition.type === EntityFieldType.EntitiesReference)
		return []
	const label = typeof viewEntry === 'object' && 'label' in viewEntry && viewEntry.label != null ? viewEntry.label : labelForField(fieldDefinition)

	if (fieldDefinition.type === EntityFieldType.EntityReference)
		return renderEntityReferenceDlItem(entity, indexes, viewEntry, fieldDefinition, fieldName, label, openExpression, level)

	const valueExpression = resolvedFieldExpression(fieldName)
	const pendingValueExpression = pendingFieldExpression(entity, fieldName)
	const fieldValueName = localIdentifier(fieldName)
	const query = renderQuery(fieldQuery(fieldDefinition, undefined), [fieldName])
	const valueMarkup = [
		`${'\t'.repeat(level)}<div>`,
		`${'\t'.repeat(level + 1)}<dt>${label}</dt>`,
		`${'\t'.repeat(level + 1)}<dd>`,
		...renderValueMarkup(entity, indexes, viewEntry, fieldName, fieldValueName, `({ value: ${fieldValueName}, ...${resolvedEntityExpression} })`, level + 2),
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
		return wrapWhen(viewEntry, openExpression, [
			`${'\t'.repeat(level)}<ResourceBoundary`,
			renderSvelteAttribute(level + 1, 'resource', `selection(${query})`),
			`${'\t'.repeat(level)}>`,
			`${'\t'.repeat(level + 1)}{#snippet Pending()}`,
			`${'\t'.repeat(level + 2)}{@const ${fieldValueName} = ${pendingValueExpression}}`,
			`${'\t'.repeat(level + 2)}{#if ${fieldValueName} !== undefined && ${fieldValueName} !== null}`,
			...pendingValueMarkup.map((line) => indent(line, 3)),
			`${'\t'.repeat(level + 2)}{/if}`,
			`${'\t'.repeat(level + 1)}{/snippet}`,
			`${'\t'.repeat(level + 1)}{#snippet children(entity)}`,
			`${'\t'.repeat(level + 2)}{@const ${resolvedEntityExpression} = ${resolvedEntitySurfaceExpression}}`,
			`${'\t'.repeat(level + 2)}{@const ${fieldValueName} = ${valueExpression}}`,
			`${'\t'.repeat(level + 2)}{#if ${fieldValueName} !== undefined && ${fieldValueName} !== null}`,
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
		renderSvelteAttribute(level + 3, 'resource', `selection(${query})`),
		`${'\t'.repeat(level + 2)}>`,
		`${'\t'.repeat(level + 3)}{#snippet Pending()}`,
		`${'\t'.repeat(level + 4)}{@const ${fieldValueName} = ${pendingValueExpression}}`,
		`${'\t'.repeat(level + 4)}{#if ${fieldValueName} !== undefined && ${fieldValueName} !== null}`,
		...renderValueMarkup(entity, indexes, viewEntry, fieldName, fieldValueName, `({ value: ${fieldValueName}, ...${pendingEntityExpression} })`, level + 5),
		`${'\t'.repeat(level + 4)}{/if}`,
		`${'\t'.repeat(level + 3)}{/snippet}`,
		`${'\t'.repeat(level + 3)}{#snippet children(entity)}`,
		`${'\t'.repeat(level + 4)}{@const ${resolvedEntityExpression} = ${resolvedEntitySurfaceExpression}}`,
		`${'\t'.repeat(level + 4)}{@const ${fieldValueName} = ${valueExpression}}`,
		`${'\t'.repeat(level + 4)}{#if ${fieldValueName} !== undefined && ${fieldValueName} !== null}`,
		...renderValueMarkup(entity, indexes, viewEntry, fieldName, fieldValueName, `({ value: ${fieldValueName}, ...${resolvedEntityExpression} })`, level + 5),
		`${'\t'.repeat(level + 4)}{/if}`,
		`${'\t'.repeat(level + 3)}{/snippet}`,
		`${'\t'.repeat(level + 2)}</ResourceBoundary>`,
		`${'\t'.repeat(level + 1)}</dd>`,
		`${'\t'.repeat(level)}</div>`,
	])
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
		renderSvelteAttribute(level + 3, 'resource', fieldResourceExpression('selection', latest.field, fieldEntityType, query)),
		`${'\t'.repeat(level + 2)}>`,
		`${'\t'.repeat(level + 3)}{#snippet children(${latestEntitiesName})}`,
		`${'\t'.repeat(level + 4)}{@const ${latestEntityName} = ${latestEntitiesName}.values[0]}`,
		...latestBodyLines,
		`${'\t'.repeat(level + 3)}{/snippet}`,
		`${'\t'.repeat(level + 2)}</ResourceBoundary>`,
		`${'\t'.repeat(level + 1)}</dd>`,
		`${'\t'.repeat(level)}</div>`,
	]

	return renderConditionedEntityLines(entity, latest.when, level, lines)
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

	const component = declaredRelationshipSectionComponent(section, indexes)
	if (component == null)
		throw new Error(`${entity.entityType}.${section.field} relationship section must declare a generated component`)

	if (fieldDefinition.entityType == null)
		throw new Error(`${entity.entityType}.${section.field} relationship section field must reference an entity`)

	if (fieldDefinition.type === EntityFieldType.EntityReference && component != null)
		return renderConditionedEntityLines(
			entity,
			section.conditions,
			4,
			renderEntityReferenceSection(entity, indexes, section, fieldDefinition, component)
		)
	if (fieldDefinition.type === EntityFieldType.EntitiesReference && component != null)
		return renderConditionedEntityLines(
			entity,
			section.conditions,
			4,
			renderEntitiesReferenceSection(entity, indexes, section, fieldDefinition, component)
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
			condition.equals == null ? undefined : `${fieldExpression('selection.entitySelector', condition.field)} === ${renderLiteral(condition.equals)}`,
			condition.notEquals == null ? undefined : `${fieldExpression('selection.entitySelector', condition.field)} !== ${renderLiteral(condition.notEquals)}`,
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
			return []

		const fieldDefinition = fieldDefinitionByName(entity, field)
		return fieldDefinition == null || fieldDefinition.type !== EntityFieldType.EntitiesReference ?
			[]
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
		return []

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

const renderDetailsTabs = (entity: Entity, indexes: AppIndexes, entityName: string) => {
	const tabs = (entitySingularView(entity)?.details?.tabs ?? []).filter((tab) => renderDetailTab(entity, indexes, tab, entityName).length > 0)
	if (tabs.length === 0)
		return []

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
	section.id ?? section.field?.replace(/^\$\$?/, '').replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`) ?? 'section'
)

const routeCollectionId = (field: string) => field.replace(/^\$\$?/, '').replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)

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
		const condition = childHref.params
			.map((param) => renderRouteExpressionCondition(fieldsExpression, param.value))
			.filter(Boolean)
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
		const routeFieldCondition = entityHref.params
			.map((param) => renderRouteExpressionCondition(routeFieldsExpression, param.value))
			.filter(Boolean)
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
	const viewSourceSelection = entitySingularView(entity)?.query?.sources
	const fields = viewResolvedFieldNames(entity, indexes)
		.filter((fieldName) => {
			const fieldDefinition = fieldDefinitionByName(entity, fieldName)
			return (
				fieldDefinition != null
				&& fieldDefinition.type !== EntityFieldType.EntitiesReference
			)
		})

	if (fields.length === 0 && !sourceSelectorField && viewSourceSelection == null)
		return `select(EntityType.${entityType}, ${selectorExpression})`

	const selectorSourceExpression = selectorExpression.includes('\n') ?
		`(${selectorExpression}).source`
	:
		`${selectorExpression}.source`
	const viewSourceLines = Array.isArray(viewSourceSelection) ? [
		'\tsources: [',
		...viewSourceSelection.map((source) => `\t\t${enumAccess('Source', source)},`),
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
		return []

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
		...sections.flatMap((section) => renderCarouselSection(entity, indexes, section)),
		'\t\t\t</CollapsibleTabs>',
	]

	return renderConditionedEntityLines(entity, carousel.conditions, 3, tabsLines)
}

const renderCarouselSection = (
	entity: Entity,
	indexes: AppIndexes,
	section: EntityCarouselSection
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
		return renderPrimitiveCarouselSection(entity, indexes, section)

	if (fieldDefinition.entityType == null)
		throw new Error(`${entity.entityType} carousel section ${carouselSectionId(section)} field ${section.field} is not an entity reference or primitive list`)

	const component = carouselSectionComponent(entity, indexes, section)
	if (component == null)
		throw new Error(`${entity.entityType} carousel section ${carouselSectionId(section)} has no renderable relationship component for ${section.field}`)

	const query = renderQuery(fieldQuery(fieldDefinition, section.selection), [])
	const sectionId = carouselSectionId(section)
	const snippetName = `Section${pascal(sectionId)}`
	const targetEntity = fieldDefinition.entityType
	const targetEntityName = camel(targetEntity)
	const itemLayout = `EntityLayout.${section.layout ?? 'Summary'}`
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
			section.link.route,
			(section.link.params ?? []).map((param) => [
				param.param,
				renderRouteParamValueExpression(param.value, 'selection.entitySelector'),
			])
		)

	return [
		`\t\t\t\t{#snippet ${snippetName}({ id, label, open })}`,
		...(fieldDefinition.type === EntityFieldType.EntityReference ? [
			'\t\t\t\t\t<ResourceBoundary',
			renderSvelteAttribute(6, 'resource', fieldResourceExpression('selection', section.field, targetEntity, query, false)),
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
				`\t\t\t\t\t\t\t\t\tselection={select(EntityType.${targetEntity}, ${targetEntityName}[EntityMetaKey.Selector], { sources: selection.sources })}`,
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
				`\t\t\t\t\t\t\t\t\t\tselection={select(EntityType.${targetEntity}, ${targetEntityName}[EntityMetaKey.Selector], { sources: selection.sources })}`,
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
			renderSvelteAttribute(6, 'selection', fieldResourceExpression('selection', section.field, targetEntity, query)),
			...(hrefExpression == null ? [] : [renderSvelteAttribute(6, 'href', hrefExpression)]),
			'\t\t\t\t\t\tCollapsibleProps={{ canToggle: false }}',
			...(section.emptyText == null ? [] : [`\t\t\t\t\t\temptyText=${q(section.emptyText)}`]),
			'\t\t\t\t\t\topen={open}',
			'\t\t\t\t\t\ttitle={label}',
			'\t\t\t\t\t\tid={`${id}-list`}',
			'\t\t\t\t\t/>',
		]),
		'\t\t\t\t{/snippet}',
		'',
	]
}

const renderPrimitiveCarouselSection = (
	entity: Entity,
	indexes: AppIndexes,
	section: EntityCarouselSection
) => {
	const sectionId = carouselSectionId(section)
	const snippetName = `Section${pascal(sectionId)}`
	const query = renderQuery(fieldQueryForName(entity, section.field, section.selection), [section.field ?? ''])
	const fieldDefinition = fieldDefinitionByName(entity, section.field ?? '')
	const primitiveValuesName = camel(section.field ?? 'values')
	const primitiveValueName = camel((fieldDefinition?.label ?? section.field ?? 'value').replace(/s$/, ''))
	const primitiveValueIndexName = `${primitiveValueName}Index`
	return [
		`\t\t\t\t{#snippet ${snippetName}({ id, label, open })}`,
		'\t\t\t\t\t<ResourceBoundary',
		renderSvelteAttribute(6, 'resource', `selection(${query})`),
		'\t\t\t\t\t>',
		'\t\t\t\t\t\t{#snippet children(entity)}',
		`\t\t\t\t\t\t\t{@const ${primitiveValuesName} = ${fieldExpression('entity', section.field ?? '')}}`,
		`\t\t\t\t\t\t\t{#if ${primitiveValuesName}.length > 0}`,
		'\t\t\t\t\t\t\t\t<ul data-column="gap-2">',
		`\t\t\t\t\t\t\t\t\t{#each ${primitiveValuesName} as ${primitiveValueName}, ${primitiveValueIndexName} (${primitiveValueIndexName})}`,
		...(section.items ?? []).flatMap((viewEntry) => {
			const fieldName = itemFieldName(viewEntry)[0]
			if (fieldName == null)
				return []

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
		return []

	const fieldName = itemFieldName(viewEntry)[0]
	if (fieldName == null)
		return []

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
		return []
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
		renderSvelteAttribute(6, 'resource', fieldResourceExpression('selection', section.field, targetEntity, query, false)),
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
		return []
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
		`String(${fieldExpression('entity', section.titleField)} ?? ${q(titleLabel)})`
	const sectionLines = () => [
		`\t\t\t\t<${componentIdentifier(component)}`,
		renderSvelteAttribute(5, 'selection', fieldResourceExpression('selection', section.field, targetEntity, query)),
		titleExpression == null ? `\t\t\t\t\ttitle=${q(titleLabel)}` : renderSvelteAttribute(5, 'title', titleExpression),
		...(section.href != null ? [
			section.href.includes('(') ?
				renderSvelteAttribute(5, 'href', renderResolveExpression(section.href))
			:
				`\t\t\t\t\thref=${q(section.href)}`,
		] : hrefExpression == null ? [] : [renderSvelteAttribute(5, 'href', hrefExpression)]),
			...(section.emptyText == null ? [] : [`\t\t\t\t\temptyText=${q(section.emptyText)}`]),
		...(section.list?.placeholderText == null ? [] : [`\t\t\t\t\tplaceholderText=${q(section.list.placeholderText)}`]),
		...(section.props ?? []).map((prop) => `\t\t\t\t\t${prop.name}={${renderExpression(prop.value, {
			fields: 'selection.entitySelector',
		})}}`),
		section.idExpression == null ?
			(
				section.id == null ?
					`\t\t\t\t\tid=${q(`${component}-${section.field}`)}`
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

const renderRouteFiles = (entry: RouteEntry, indexes: AppIndexes) => entry.files.flatMap((routeFile) => {
	const routePath = `src/routes/${entry.routePath}/${routeFileName(routeFile.kind)}`.replaceAll('//', '/')
	const layoutPath = `src/routes/${entry.routePath}/+layout.ts`.replaceAll('//', '/')
	const pageModule = entry.files.find((file) => file.kind === _RouteFileKind.PageModule)
	const pageSelectorDescendant = indexes.routeEntries.some((candidate) => (
		candidate.routePath.startsWith(`${entry.routePath}/`)
		&& candidate.files.some((candidateFile) => expressionUsesKind(candidateFile.collection?.source.selector, 'pageSelector'))
	))
	const surfaceDescendant = (
		routeFile.surface != null
		&& routeFile.surfaceInherited !== true
		&& indexes.routeEntries.some((candidate) => (
			candidate.routePath.startsWith(`${entry.routePath}/`)
			&& candidate.files.some((candidateFile) => candidateFile.surface != null)
		))
	)
	const shouldGenerateLayoutLoad = (
		routeFile.load != null
		&& (pageSelectorDescendant || surfaceDescendant)
		&& !entry.files.some((candidate) => candidate.kind === _RouteFileKind.LayoutModule)
	)
	if (routeFile.kind === _RouteFileKind.PageModule)
		return [
			...(shouldGenerateLayoutLoad ? [renderPageModuleFile(layoutPath, routeFile, indexes)] : []),
			...(!shouldGenerateLayoutLoad && routeNeedsPageModule(routePath, routeFile, indexes) ? [renderPageModuleFile(routePath, routeFile, indexes)] : []),
		]
	if (routeFile.kind === _RouteFileKind.Layout)
		return [renderLayoutFile(routePath, routeFile, indexes)]
	if (routeFile.kind === _RouteFileKind.Page) {
		const hasPageModule = entry.files.some((file) => file.kind === _RouteFileKind.PageModule)
		const pageRouteFile = routeFile.load == null && pageModule?.load != null ?
			{
				...routeFile,
				load: pageModule.load,
			}
		:
			routeFile
		const generatedPageModule = (
			pageModule != null
			&& routeNeedsPageModule(routePath.replace(/\+page\.svelte$/, '+page.ts'), pageModule, indexes)
		)
		const files = [
			...(shouldGenerateLayoutLoad ? [renderPageModuleFile(layoutPath, routeFile, indexes)] : []),
			renderPageFile(
				routePath,
				entry.routePath,
				pageRouteFile,
				indexes,
				generatedPageModule,
				hasPageModule && !generatedPageModule
			),
		]
		if (
			!hasPageModule
			&& !shouldGenerateLayoutLoad
			&& routeNeedsPageModule(routePath.replace(/\+page\.svelte$/, '+page.ts'), pageRouteFile, indexes)
		)
			files.push(renderPageModuleFile(routePath.replace(/\+page\.svelte$/, '+page.ts'), pageRouteFile, indexes))
		return files
	}
	if (routeFile.kind === _RouteFileKind.LayoutModule)
		return [tsFile(routePath, { body: ['export const ssr = false'] })]

	return []
})

const routeNeedsPageModule = (routePath: string, routeFile: RouteFile, indexes: AppIndexes) => (
	routeFile.surface != null
	&& routeFile.surfaceInherited !== true
	&& routeFile.collection == null
	&& routeSurfaceRequiresPageModule(routePath, indexes)
	&& !routeSurfaceOwnedByAncestor(routePath, routeFile, indexes)
)

const routeLoadSelectorExpression = (routeFile: RouteFile, context: Parameters<typeof renderExpression>[1]) => {
	if (routeFile.load == null)
		return undefined
	if (routeFile.load.selectorFields != null)
		return renderExpression(routeFile.load.selectorFields, context)

	return renderObject((routeFile.load.fields ?? []).map((field) => [
		field.field,
		renderExpression(field.value, context),
	]))
}

const routeLoadSelectorImports = (routeFile: RouteFile) => {
	if (routeFile.load == null)
		return []
	if (routeFile.load.selectorFields != null)
		return [...expressionImports(routeFile.load.selectorFields).entries()].map(([from, names]) => ({
			from,
			names: [...names],
		}))

	const imports = new Map<string, Set<string>>()
	for (const field of routeFile.load.fields ?? [])
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

const routeSurfaceNetworkParamName = (routePath: string, indexes: AppIndexes) => {
	if (indexes.routeFixtureMetadataByRouteId.get(routePathPublicId(routePath)) == null)
		return undefined

	const paramNames = routeParamNames(routePathPublicId(routePath))
	return (
		paramNames.includes('networkSlug') ?
			'networkSlug'
		: paramNames.includes('caip2') ?
			'caip2'
		:
			undefined
	)
}

const routeSurfaceRequiresPageModule = (routePath: string, indexes: AppIndexes) => (
	routeSurfaceNetworkParamName(routePath, indexes) != null
)

const routeSurfaceFacetsKey = (surface: NonNullable<RouteFile['surface']>) => (
	(surface.requiredFacets ?? []).join('\0')
)

const routeSurfaceOwnedByAncestor = (routePath: string, routeFile: RouteFile, indexes: AppIndexes) => {
	if (routeFile.surface == null)
		return false

	const href = routePathPublicId(routePath)
	const surfaceFacetsKey = routeSurfaceFacetsKey(routeFile.surface)
	return indexes.routeEntries.some((entry) => {
		const entryHref = publicRouteId(entry.routePath)
		return (
			entryHref !== href
			&& href.startsWith(`${entryHref}/`)
			&& entry.files.some((file) => (
				file.kind === _RouteFileKind.PageModule
				&& file.surface != null
				&& file.surfaceInherited !== true
				&& routeSurfaceFacetsKey(file.surface) === surfaceFacetsKey
			))
		)
	})
}

const routeSurfacePredicateExpression = (predicate: _AppFacetPredicate, entityExpression: string): string => (
	'all' in predicate ?
		`(${predicate.all.map((child) => routeSurfacePredicateExpression(child, entityExpression)).join(' && ')})`
	: 'any' in predicate ?
		`(${predicate.any.map((child) => routeSurfacePredicateExpression(child, entityExpression)).join(' || ')})`
	: 'equals' in predicate ?
		`${fieldExpression(entityExpression, predicate.field)} === ${renderLiteral(predicate.equals)}`
	:
		`${fieldExpression(entityExpression, predicate.field)}.includes(${renderLiteral(predicate.contains)})`
)

const renderPageModuleFile = (routePath: string, routeFile: RouteFile, indexes: AppIndexes) => {
	const routeSurfaceMetadata = routeFile.surface == null ? undefined : indexes.routeFixtureMetadataByRouteId.get(routePathPublicId(routePath))
	const routeSurfaceParamNames = routeParamNames(routePathPublicId(routePath))
	const routeSurfaceNetworkParam = routeSurfaceNetworkParamName(routePath, indexes)
	if (
		routeSurfaceMetadata?.requiredFacetPredicates != null
		&& routeSurfaceMetadata.requiredFacetPredicates.length > 0
		&& routeSurfaceNetworkParam == null
	)
		throw new Error(`${routePath} route surface requires facets but has no networkSlug or caip2 route param`)

	if (routeFile.load == null && routeSurfaceNetworkParam == null)
		throw new Error(`${routePath} page module has no load data or route surface network context`)

	const loadExpression = routeFile.load == null ?
		undefined
	:
		{
		kind: 'object',
		fields: [
			...(routeFile.load.selectorFields == null ? [] : [{
				name: 'selectorFields',
				value: routeFile.load.selectorFields,
			}]),
			...(routeFile.load.fields ?? []).map((field) => ({
				name: field.field,
				value: field.value,
			})),
			...(routeFile.load.title == null ? [] : [{
				name: 'title',
				value: routeFile.load.title,
			}]),
		],
	} satisfies _Expression
	const imports = loadExpression == null ? new Map<string, Set<string>>() : expressionImports(loadExpression)
	const loadType = routePath.endsWith('+layout.ts') ? 'LayoutLoad' : 'PageLoad'
	const fieldsExpression = routeFile.load == null ?
		routeSurfaceNetworkParam === 'networkSlug' ?
			renderObject([
				['slug', 'params.networkSlug'],
			])
		: routeSurfaceNetworkParam === 'caip2' ?
			renderObject([
				['caip2', 'caip2SelectorValueFromString(decodeURIComponent(params.caip2))'],
			])
		:
			undefined
	: routeFile.load.selectorFields == null ?
		renderObject((routeFile.load.fields ?? []).map((field) => [
			field.field,
			renderExpression(field.value, {
				params: 'params',
			}),
		]))
	:
		renderExpression(routeFile.load.selectorFields, {
			params: 'params',
		})
	const loadEntity = routeFile.load?.entity ?? (routeSurfaceNetworkParam == null ? undefined : EntityType.Network)
	const entitySchemaName = loadEntity == null ? undefined : `${loadEntity}Schema`
	const selectorName = loadEntity == null ? undefined : `${camel(loadEntity)}Selector`
	const routeSurfaceNetworkExpression = (
		routeSurfaceNetworkParam === 'networkSlug' ?
			'networkBySlug[params.networkSlug]'
		: routeSurfaceNetworkParam === 'caip2' ?
			'networkByCaip2[decodeURIComponent(params.caip2)]'
		:
			undefined
	)
	const routeSurfaceGuardExpression = (
		routeSurfaceNetworkExpression == null
		|| routeSurfaceMetadata?.requiredFacetPredicates == null
		|| routeSurfaceMetadata.requiredFacetPredicates.length === 0 ?
			undefined
		:
			routeSurfaceMetadata.requiredFacetPredicates
			.map((predicate) => routeSurfacePredicateExpression(predicate, 'routeSurfaceNetwork'))
			.join(' && ')
	)
	const guardedFieldsExpression = (
		fieldsExpression == null || routeSurfaceNetworkExpression == null ?
			fieldsExpression
		:
			fieldsExpression.replaceAll(routeSurfaceNetworkExpression, 'routeSurfaceNetwork')
	)
	if (loadEntity == null || guardedFieldsExpression == null || selectorName == null || entitySchemaName == null)
		throw new Error(`${routePath} page module has no selector parsing responsibility`)

	const returnEntries: [string, string | undefined][] = [
		['selector', selectorName],
		[
			'routeContextSelector',
			routeFile.load == null && routeSurfaceNetworkParam === 'caip2' && selectorName != null ?
				renderObject([
					['$network', selectorName],
				])
			:
				undefined,
		],
		[
			'title',
			routeFile.load?.title == null ?
				routeFile.load == null && routeSurfaceNetworkExpression != null ?
					'routeSurfaceNetwork.name'
				:
					undefined
			: routeSurfaceNetworkExpression == null ?
				renderExpression(routeFile.load.title, {
					params: 'params',
					fields: selectorName,
				})
			:
				renderExpression(routeFile.load.title, {
					params: 'params',
					fields: selectorName,
				}).replaceAll(routeSurfaceNetworkExpression, 'routeSurfaceNetwork'),
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
				...(routeSurfaceNetworkExpression == null ? [] : [
					{
						from: '$/constants/Network.ts',
						names: routeSurfaceNetworkParam === 'networkSlug' ? ['networkBySlug'] : ['networkByCaip2'],
					},
				]),
				...(routeFile.load == null && routeSurfaceNetworkParam === 'caip2' ? [{
					from: '$/lib/caip2.ts',
					names: ['caip2SelectorValueFromString'],
				}] : []),
				...(loadEntity == null ? [] : [{
					from: 'arktype',
					names: ['type as arktype'],
				}]),
				...Array.from(imports).map(([from, names]) => ({
					from,
					names: [...names],
				})),
				...(loadEntity == null ? [] : [{
					from: '$/schema/$schema.ts',
					names: ['parseEntitySelector'],
				},
				{
					from: schemaModulePath(loadEntity),
					defaultName: entitySchemaName,
				},
				{
					from: '$/schema/index.ts',
					names: ['schema'],
				}]),
				{
					from: './$types',
					typeNames: [loadType],
				},
			],
			body: [
				...(routeFile.surface == null ? [] : [
					`// Route surface eligibility: requiredFacets=[${(routeFile.surface.requiredFacets ?? []).map((facet) => q(facet)).join(', ')}]`,
				]),
				`export const load: ${loadType} = ({ params }) => {`,
				...(routeSurfaceNetworkExpression == null ? [] : [
					`\tconst routeSurfaceNetwork = ${routeSurfaceNetworkExpression}`,
					`\tif (routeSurfaceNetwork == null) error(404, 'Network route surface not found')`,
					...(routeSurfaceGuardExpression == null ? [] : [
						`\tif (!(${routeSurfaceGuardExpression})) error(404, 'Network facet not available')`,
					]),
					'',
				]),
				`\tconst ${selectorName} = parseEntitySelector(`,
				'\t\tschema,',
				`\t\t${entitySchemaName},`,
				indent(guardedFieldsExpression, 2),
				'\t)',
				`\tif (${selectorName} instanceof arktype.errors) error(404, ${q(`Invalid ${loadEntity} selector`)})`,
				'',
				'\treturn ' + indent(renderObject(returnEntries)).trimStart(),
				'}',
			],
		}
	)
}

const renderPageFile = (
	routePath: string,
	appRoutePath: string,
	routeFile: RouteFile,
	indexes: AppIndexes,
	hasGeneratedPageModule = false,
	suppressRouteSurfacePageModule = false
) => {
	const viewEntity = routeFile.view?.entity
	const collectionEntity = routeFile.collection?.entity
	const collectionEntityDefinition = collectionEntity == null ? undefined : indexes.entityByType.get(collectionEntity)
	const componentFile = routeFile.view?.component ?? (viewEntity == null ? undefined : singularComponentName(viewEntity))
	const component = componentFile == null ? undefined : componentIdentifier(componentFile)
	const collectionComponentFile = routeFile.view?.component ?? (collectionEntityDefinition == null ? undefined : pluralComponentName(collectionEntityDefinition))
	const collectionComponent = collectionComponentFile == null ? undefined : componentIdentifier(collectionComponentFile)
	const collectionExpressionImports = routeFile.collection == null ?
		[]
	:
		[...expressionImports(routeFile.collection.source.selector).entries()].map(([from, names]) => ({
			from,
			names: [...names],
		}))
	const pageModuleRequired = (
		hasGeneratedPageModule
		|| (
			!suppressRouteSurfacePageModule
			&& routeNeedsPageModule(routePath.replace(/\+page\.svelte$/, '+page.ts'), routeFile, indexes)
		)
	)
	const inlineSelectorExpression = pageModuleRequired ?
		undefined
	:
		routeLoadSelectorExpression(routeFile, {
			params: 'params',
		})
	const componentImports = unique([
		...(component == null || componentFile == null ? [] : [`import ${component} from '${viewModulePath(componentFile)}'`]),
		...(collectionComponent == null || collectionComponentFile == null ? [] : [`import ${collectionComponent} from '${viewModulePath(collectionComponentFile)}'`]),
	])
	const title = routeFile.text?.title ?? routeFile.text?.label ?? (viewEntity == null ? collectionEntity == null ? 'Blockhead' : indexes.entityByType.get(collectionEntity)?.labelPlural : indexes.entityByType.get(viewEntity)?.label)
	const collectionQuery = routeFile.collection == null ? undefined : renderQuery(routeFile.collection.query, [])
	const viewEntityDefinition = viewEntity == null ? undefined : indexes.entityByType.get(viewEntity)
	const viewSelectionQuery = renderQuery(viewEntityDefinition == null ? undefined : entitySingularView(viewEntityDefinition)?.query, [])
	const collectionHref = routeFile.collection == null ?
		undefined
	:
		indexes.collectionHrefByEntity.get(routeFile.collection.entity) ?? routeId(appRoutePath)
	const collectionUsesParams = (
		expressionUsesKind(routeFile.collection?.source.selector, 'param')
		|| routeParamNames(collectionHref ?? '').length > 0
		|| routeParamNames(routeId(appRoutePath)).length > 0
	)
	const usesData = (
		pageModuleRequired
		|| expressionUsesKind(routeFile.collection?.source.selector, 'pageSelector')
	)
	const viewContentUsesParams = routeFile.view?.Content?.raw.includes('params') === true
	const selectorUsesParams = inlineSelectorExpression?.includes('params.') === true
	const hasPageProps = usesData || collectionUsesParams || viewContentUsesParams || selectorUsesParams
	const selectorExpression = inlineSelectorExpression ?? 'data.selector'
	const routeFileUsesResolve = routeFile.view?.Content == null && (component != null && routeFile.view?.entity != null || routeFile.collection != null && collectionComponent != null)
	const collectionSourceEntityDefinition = routeFile.collection == null ? undefined : indexes.entityByType.get(routeFile.collection.source.entity)
	const collectionSelectionQuery = routeFile.collection == null || collectionSourceEntityDefinition == null ? '' : renderQuery(fieldQueryForName(
		collectionSourceEntityDefinition,
		routeFile.collection.source.field,
		routeFile.collection.query
	), [])

	return svelteFile(
		routePath,
		{
			script: [
				'// Types/constants',
				...(hasPageProps ? ['import type { PageProps } from \'./$types.ts\''] : []),
				...(routeFile.collection == null ? [] : [
					'import { EntityProxyField } from \'$/client/$proxy.svelte.ts\'',
				]),
				'import { EntityType } from \'$/schema/EntityType.ts\'',
				...collectionExpressionImports.map(renderImport),
				...(inlineSelectorExpression == null ? [] : routeLoadSelectorImports(routeFile).map(renderImport)),
				...renderImportObject(routeFile.view?.imports).map(renderImport),
				...(collectionQuery?.includes('Source.') || collectionSelectionQuery.includes('Source.') || viewSelectionQuery?.includes('Source.') ? [
					'import { Source } from \'$/sources/Source.ts\'',
				] : []),
				'',
				'',
				'// Context',
				...(routeFileUsesResolve || routeFile.view?.Content?.raw.includes('resolve(') === true ? ['import { resolve } from \'$app/paths\''] : []),
				'import { select } from \'$/routes/+layout.svelte\'',
				...(hasPageProps ? [
					'',
					'',
					'// State',
					'let {',
					...(usesData ? ['\tdata,'] : []),
					...(collectionUsesParams || viewContentUsesParams ? ['\tparams,'] : []),
					'}: PageProps = $props()',
				] : []),
				...(routeFile.view?.script == null ? [] : [
					'',
					'',
					...routeFile.view.script.split('\n'),
				]),
				'',
				'',
				'// Components',
				'import Page from \'$/components/Page.svelte\'',
				...componentImports,
			],
			head: title == null ? undefined : [
				`<title>${title} • Blockhead</title>`,
			],
			markup: [
				'<Page>',
				...(routeFile.collection == null ?
					renderEntityPageMarkup(routeFile, component, selectorExpression, routeId(appRoutePath), indexes)
				:
					renderCollectionPageMarkup(routeFile, collectionComponent, routeId(appRoutePath), indexes)
				),
				'</Page>',
			],
			style: routeFile.view?.style?.split('\n'),
		}
	)
}

const renderEntityPageMarkup = (routeFile: RouteFile, component: string | undefined, selectorExpression: string, href: string, indexes: AppIndexes) => {
	if (routeFile.view?.Content != null)
		return routeFile.view.Content.raw
			.split('\n')
			.filter((line) => !/^\s*pageTitle=\{true\}\s*$/.test(line))
			.map((line) => line === '' ? '' : `\t${line}`)
	if (routeFile.view?.text != null)
		return [
			`\t<h1>${routeFile.view.text}</h1>`,
		]
	if (component == null || routeFile.view?.entity == null)
		return routeFile.text?.title == null ? [] : [`\t<h1>${routeFile.text.title}</h1>`]

	return [
		`\t<${component}`,
		renderSvelteAttribute(2, 'href', renderRouteResolveExpression(href, routeParamNames(href).map((param) => [param, `params.${param}`]))),
		renderSvelteAttribute(2, 'selection', renderEntityPageSelection(indexes, indexes.entityByType.get(routeFile.view.entity), routeFile.view.entity, selectorExpression, routeFile.view.selector)),
		'\t/>',
	]
}

const renderCollectionPageMarkup = (routeFile: RouteFile, collectionComponent: string | undefined, href: string, indexes: AppIndexes) => {
	if (routeFile.collection == null || collectionComponent == null)
		return []

	const selector = renderExpression(routeFile.collection.source.selector, {
		pageSelector: 'data.selector',
		fields: 'data.selector',
		params: 'params',
	})
	const source = routeFile.collection.source
	const sourceEntity = indexes.entityByType.get(source.entity)
	if (sourceEntity == null)
		throw new Error(`${routeFile.collection.entity} collection references missing source entity ${source.entity}`)

	const collectionEntity = indexes.entityByType.get(routeFile.collection.entity)
	if (collectionEntity == null)
		throw new Error(`${routeFile.collection.entity} collection references missing entity`)
	const query = renderQuery(fieldQueryForName(sourceEntity, source.field, routeFile.collection.query), [])

	return [
		`\t<${collectionComponent}`,
		renderSvelteAttribute(2, 'href', renderRouteResolveExpression(href, routeParamNames(href).map((param) => [param, `params.${param}`]))),
		`\t\ttitle=${q(routeFile.text?.title ?? collectionEntity.labelPlural)}`,
		renderSvelteAttribute(2, 'selection', fieldResourceExpression(`select(EntityType.${source.entity}, ${selector})`, source.field, routeFile.collection.entity, query)),
		`\t\tid=${q(routeCollectionId(source.field))}`,
		'\t/>',
	]
}

const renderLayoutFile = (routePath: string, routeFile: RouteFile, indexes: AppIndexes) => {
	if (routeFile.layout == null)
		throw new Error(`${routePath} layout route file is missing layout metadata`)

	if (routeFile.layout.entity != null) {
		if (routeFile.layout.selector == null)
			throw new Error(`${routePath} ${routeFile.layout.entity} layout is missing selector`)

		const componentFile = routeFile.layout.component ?? singularComponentName(routeFile.layout.entity)
		const component = componentIdentifier(componentFile)
		const selectorExpression = renderExpression(routeFile.layout.selector, {
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
			...Array.from(expressionImports(routeFile.layout.selector)).map(([from, names]) => ({
				from,
				names: [...names],
			})),
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
			renderSvelteAttribute(3, 'selection', `select(EntityType.${routeFile.layout.entity}, ${selectorExpression})`),
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

const propertyNameText = (name: ts.PropertyName) => (
	ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name) ?
		name.text
	:
		undefined
)

const objectProperty = (object: ts.ObjectLiteralExpression, name: string) => (
	object.properties.find((property) => (
		ts.isPropertyAssignment(property)
		&& propertyNameText(property.name) === name
	)) as ts.PropertyAssignment | undefined
)

const enumMemberName = (expression: ts.Expression) => (
	ts.isPropertyAccessExpression(expression) && ts.isIdentifier(expression.name) ?
		expression.name.text
	:
		undefined
)

const stringLiteralText = (expression: ts.Expression) => (
	ts.isStringLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression) ?
		expression.text
	:
		undefined
)

const sourceProviderModuleFromText = (
	filePath: string,
	source: string
): CheckedInSourceProviderModule | undefined => {
	const sourceFile = ts.createSourceFile(
		filePath,
		source,
		ts.ScriptTarget.ESNext,
		true,
		ts.ScriptKind.TS
	)
	const exportAssignment = sourceFile.statements.find(ts.isExportAssignment)
	const expression = exportAssignment?.expression
	const object = (
		expression != null && ts.isSatisfiesExpression(expression) && ts.isObjectLiteralExpression(expression.expression) ?
			expression.expression
		:
			undefined
	)
	if (object == null)
		return undefined

	const provider = enumMemberName(objectProperty(object, 'provider')?.initializer ?? object)
	const label = stringLiteralText(objectProperty(object, 'label')?.initializer ?? object)
	const sourcesExpression = objectProperty(object, 'sources')?.initializer
	if (provider == null || label == null || sourcesExpression == null || !ts.isArrayLiteralExpression(sourcesExpression))
		return undefined

	const sources = sourcesExpression.elements.flatMap((element) => {
		if (!ts.isObjectLiteralExpression(element))
			return []

		const sourceProvider = enumMemberName(objectProperty(element, 'provider')?.initializer ?? element)
		const sourceId = enumMemberName(objectProperty(element, 'source')?.initializer ?? element)
		const sourceLabel = stringLiteralText(objectProperty(element, 'label')?.initializer ?? element)
		if (sourceProvider == null || sourceId == null || sourceLabel == null)
			return []

		return [{
			provider: sourceProvider,
			source: sourceId,
			label: sourceLabel,
		}]
	})

	return {
		path: filePath.replace(/^src\/sources\//, ''),
		importName: `checkedIn${provider}SourceProviderDefinition`,
		provider,
		label,
		sources,
	}
}

const sourceDefinitionModuleFromText = (
	filePath: string,
	source: string
): SourceDefinitionModule | undefined => {
	const sourceFile = ts.createSourceFile(
		filePath,
		source,
		ts.ScriptTarget.ESNext,
		true,
		ts.ScriptKind.TS
	)
	const objectLiterals: ts.ObjectLiteralExpression[] = []
	const visit = (node: ts.Node) => {
		if (ts.isObjectLiteralExpression(node))
			objectLiterals.push(node)

		ts.forEachChild(node, visit)
	}
	visit(sourceFile)

	for (const object of objectLiterals) {
		const provider = enumMemberName(objectProperty(object, 'provider')?.initializer ?? object)
		const sourceId = enumMemberName(objectProperty(object, 'source')?.initializer ?? object)
		const label = stringLiteralText(objectProperty(object, 'label')?.initializer ?? object)
		if (provider == null || sourceId == null || label == null)
			continue

		return {
			path: filePath.replace(/^src\/sources\//, ''),
			importName: `${camel(sourceId)}SourceDefinition`,
			provider,
			source: sourceId,
			label,
		}
	}

	return undefined
}

const checkedInSourceProviderModules = async (normalizedApp: App): Promise<CheckedInSourceProviderModule[]> => {
	if (normalizedApp.sources.includeCheckedInSourceProviderModules !== true)
		return []

	const modules: CheckedInSourceProviderModule[] = []
	const walk = async (directory: string) => {
		const entries = (await fs.readdir(directory, {
			withFileTypes: true,
		})).toSorted((left, right) => left.name.localeCompare(right.name))
		for (const entry of entries) {
			const absolutePath = path.join(directory, entry.name)
			if (entry.isDirectory()) {
				await walk(absolutePath)
				continue
			}
			if (entry.name !== 'index.ts')
				continue

			const providerModule = sourceProviderModuleFromText(
				relative(absolutePath),
				await fs.readFile(absolutePath, 'utf8')
			)
			if (providerModule != null)
				modules.push(providerModule)
		}
	}

	await walk(path.join(generatedRoot, 'sources'))
	return modules.filter((module) => !normalizedApp.sources.providers.some((provider) => provider.provider === module.provider))
}

const sourceDefinitionModulePath = (
	source: App['sources']['sources'][number],
	existingModuleBySource: Map<string, SourceDefinitionModule>
) => {
	const existingModule = existingModuleBySource.get(source.source)
	if (existingModule != null)
		return existingModule.path

	const sourceSuffix = String(source.source).startsWith(`${source.provider}_`) ?
		String(source.source).slice(`${source.provider}_`.length)
	:
		String(source.source)
	return `${source.provider}/${sourceSuffix.split('_').map((part) => pascal(part)).join('/')}/index.ts`
}

const trackedSourceIndexPaths = async () => {
	try {
		const { stdout } = await execFileAsync('git', [
			'ls-files',
			'src/sources/**/index.ts',
		], {
			cwd: repoRoot,
		})
		return stdout.trim().length === 0 ? [] : stdout.trim().split('\n')
	}
	catch {
		return []
	}
}

const trackedSourceDefinitionModules = async () => {
	const modules: SourceDefinitionModule[] = []
	for (const filePath of await trackedSourceIndexPaths()) {
		if (filePath === 'src/sources/index.ts')
			continue

		let source: string
		try {
			source = (await execFileAsync('git', [
				'show',
				`HEAD:${filePath}`,
			], {
				cwd: repoRoot,
			})).stdout
		}
		catch {
			continue
		}

		if (sourceProviderModuleFromText(filePath, source) != null)
			continue

		const module = sourceDefinitionModuleFromText(filePath, source)
		if (module != null)
			modules.push(module)
	}

	return modules
}

const sourceDefinitionModules = async (
	sources: readonly Pick<App['sources']['sources'][number], 'provider' | 'source' | 'label'>[]
): Promise<SourceDefinitionModule[]> => {
	const modules: SourceDefinitionModule[] = []
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
			if (entry.name !== 'index.ts' || absolutePath === path.join(generatedRoot, 'sources/index.ts'))
				continue

			const filePath = relative(absolutePath)
			const source = await fs.readFile(absolutePath, 'utf8')
			if (sourceProviderModuleFromText(filePath, source) != null)
				continue

			const module = sourceDefinitionModuleFromText(filePath, source)
			if (module != null)
				modules.push(module)
		}
	}

	await walk(path.join(generatedRoot, 'sources'))
	const existingModuleBySource = new Map<string, SourceDefinitionModule>()
	for (const module of [
		...await trackedSourceDefinitionModules(),
		...modules,
	]) {
		if (!existingModuleBySource.has(module.source))
			existingModuleBySource.set(module.source, module)
	}

	return sources.map((source) => ({
		path: sourceDefinitionModulePath(source, existingModuleBySource),
		importName: `${camel(source.source)}SourceDefinition`,
		provider: source.provider,
		source: source.source,
		label: source.label,
	}))
}

const relative = (absolutePath: string) => path.relative(repoRoot, absolutePath)

const isGeneratedFile = async (filePath: string) => {
	const source = await readText(path.join(repoRoot, filePath))
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
				paths.push(relative(absolutePath))
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

const generatedSourceDefinitionPaths = async () => {
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
			if (
				entry.name === 'definition.ts'
				|| (
					entry.name === 'index.ts'
					&& absolutePath !== path.join(generatedRoot, 'sources/index.ts')
				)
			)
				paths.push(relative(absolutePath))
		}
	}

	await walk(path.join(generatedRoot, 'sources'))
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
	const staleSourceDefinitions = []
	for (const filePath of await generatedSourceDefinitionPaths()) {
		if (!expected.has(filePath) && await isGeneratedFile(filePath))
			staleSourceDefinitions.push(filePath)
	}

	for (const filePath of [
		...staleRouteModules,
		...staleViews,
		...staleSchemas,
		...staleSourceDefinitions,
	])
		await fs.rm(path.join(repoRoot, filePath), {
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
	const staleSourceDefinitions = []
	for (const filePath of await generatedSourceDefinitionPaths()) {
		if (!expected.has(filePath) && await isGeneratedFile(filePath))
			staleSourceDefinitions.push(filePath)
	}
	const stale = [
		...staleRouteModules,
		...staleViews,
		...staleSchemas,
		...staleSourceDefinitions,
	]
	const drift: string[] = []

	for (const generatedFile of files) {
		const existing = await readText(path.join(repoRoot, generatedFile.path))
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
	await cleanStaleGeneratedFiles(files)
	for (const generatedFile of files) {
		if (
			(
				generatedFile.path.startsWith('src/schema/')
				|| generatedFile.path.startsWith('src/views/')
			)
			&& await isGeneratedFile(generatedFile.path)
		)
			await fs.rm(path.join(repoRoot, generatedFile.path), {
				force: true,
			})
	}
	for (const generatedFile of [...files].sort((left, right) => left.path.localeCompare(right.path, 'en', {
		sensitivity: 'base',
		numeric: true,
	}))) {
		const absolutePath = path.join(repoRoot, generatedFile.path)
		await fs.mkdir(path.dirname(absolutePath), {
			recursive: true,
		})
		await fs.writeFile(absolutePath, renderGeneratedFile(generatedFile))
	}
}

const cleanFiles = async (files: readonly GeneratedFile[]) => {
	for (const generatedFile of files)
		await fs.rm(path.join(repoRoot, generatedFile.path), {
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
	const normalizedApp = normalizeApp(app)
	const checkedInSourceProviderModuleDefinitions = await checkedInSourceProviderModules(normalizedApp)
	const sourceDefinitionModuleDefinitions = await sourceDefinitionModules(sourceRows(
		normalizedApp,
		checkedInSourceProviderModuleDefinitions
	))
	const indexes = validateAndIndex(
		normalizedApp,
		checkedInSourceProviderModuleDefinitions
	)
	const files = deriveFiles(
		normalizedApp,
		indexes,
		checkedInSourceProviderModuleDefinitions,
		sourceDefinitionModuleDefinitions
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

await main()
