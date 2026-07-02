import fs from 'node:fs/promises'
import path from 'node:path'

import { parse as parseSvelte } from 'svelte/compiler'
import ts from 'typescript'

import {
	EntityFieldCardinality,
	EntityFieldType,
	EntityType,
	_RouteFileKind,
	_ExpressionDecode,
	_ViewItemKind,
	type _Expression,
	type _Import,
	type _ListView,
	type _RawSnippet,
	type _SourceSelection,
	type _ViewItem,
	type _ViewListSection,
	type _ViewQuery,
	type App,
	app,
} from '../APP.ts'


type Entity = App['schema']['entities'][number]
type EntityField = Entity['fields'][number]
type EntitySelector = Entity['selectors'][number]
type ValueTypeType = App['schema']['valueTypes'][number]['type']
type SingularView = NonNullable<Entity['singularView']>
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
type ImportSpec = {
	from: string
	defaultName?: string
	names?: string[]
	typeNames?: string[]
}
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
}
type EntityHref = {
	href: string
	selector: string
	params: {
		param: string
		value: _Expression
		decode?: _ExpressionDecode
	}[]
}
type CollectionRouteHref = EntityHref
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
	generatedComponents: Set<string>
	sourceSelections: _SourceSelection[]
}

const repoRoot = process.cwd()
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

const singularComponentName = (entityType: string) => `${entityType}View`

const pluralComponentName = (entity: Entity) => entity.pluralView?.component ?? `${entity.entityType}sView`

const componentIdentifier = (componentName: string) => componentName.replace(/^_+/, '')

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
		`encodeURIComponent(String(${expression}))`
	:
		`String(${expression})`
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
				ts.factory.createStringLiteral(spec.from, true)
			),
			ts.createSourceFile('generated.ts', '', ts.ScriptTarget.ESNext)
		)
		.replace(/;$/, '')
}

const mergeImports = (imports: readonly ImportSpec[]) => {
	const merged = new Map<string, ImportSpec>()
	for (const spec of imports) {
		const existing = merged.get(spec.from)
		if (existing == null) {
			merged.set(spec.from, {
				...spec,
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

const dedupeScriptImports = (script: readonly string[]) => {
	const imports = new Set<string>()
	return script.filter((line) => {
		if (!line.startsWith('import '))
			return true
		if (imports.has(line))
			return false
		imports.add(line)
		return true
	})
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
		:
			renderSvelteFile(generatedFile.ast)
	)

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
		from: importSpec.from,
		defaultName: importSpec.default,
		names: importSpec.names,
		typeNames: importSpec.typeNames,
	}))

const renderSourceArray = (sources: readonly string[] | undefined) => (
	sources == null ?
		undefined
	:
		renderArray(sources.map((source) => enumAccess('Source', source)))
)

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

const renderQuery = (
	query: _ViewQuery | _ListView['query'] | undefined,
	fields: readonly string[] = [],
	sourcesExpression?: string,
	openExpression?: string,
	excludedFields?: ReadonlySet<string>
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
			renderArray(query.orderBy.map((order) => `[({ fieldRow }) => fieldRow.entitySelector${propertyAccess(order.field)} ?? fieldRow${propertyAccess(order.field)}, ${q(order.direction)}]`))
		:
			undefined,
	])

	return renderObject(queryEntries)
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

		return `${expression.map}[${key}]${propertyAccess(expression.property)}`
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

		return `${expression.map}[String(${key})]${propertyAccess(expression.property)}`
	}
	if (expression.kind === 'call')
		return `${expression.name}(${expression.args.map((argument) => renderAppExpression(argument, context)).join(', ')})`
	if (expression.kind === 'template')
		return expression.parts
			.map((part) => typeof part === 'string' ? q(part) : `String(${renderAppExpression(part, context)})`)
			.join(' + ')
	if (expression.kind === 'case')
		return [
			'(',
			...expression.cases.flatMap((item) => [
				...indent(`${renderAppExpression(expression.value, context)} === ${renderLiteral(item.equals)} ?`).split('\n'),
				...indent(renderAppExpression(item.value, context), 2).split('\n'),
				'\t:',
			]),
			indent(renderAppExpression(expression.default, context), 2),
			')',
		].join('\n')

	return renderExpression(expression, context)
}

const labelForField = (field: EntityField) => (
	field.label
	?? field.name
		.replace(/^\$\$?/, '')
		.replace(/([a-z])([A-Z])/g, '$1 $2')
		.replace(/^./, (letter) => letter.toUpperCase())
)

const sentenceStart = (value: string) => value.replace(/^./, (letter) => letter.toUpperCase())

const sentenceMiddle = (value: string) => value.replace(/^([A-Z])([a-z])/, (letters) => letters.toLowerCase())

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

const routeEntries = (nodes: App['routes']['tree'], parentPath = ''): RouteEntry[] => nodes.flatMap((node) => {
	const routePath = [parentPath, node.segment].filter(Boolean).join('/')
	return [
		...(node.files == null ? [] : [{
			routePath,
			files: node.files,
		}]),
		...(node.children == null ? [] : routeEntries(node.children, routePath)),
	]
})

const routeHrefFromLoad = (entry: RouteEntry, routeFile: RouteFile): EntityHref | undefined => {
	if (routeFile.load == null || routeFile.load.href == null)
		return undefined

	const href = routeId(entry.routePath)
	return {
		href,
		selector: routeFile.load.selector,
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

const validateAndIndex = (app: App): AppIndexes => {
	const activeEntities = app.schema.entities
	const entityTypes = unique([
		...app.schema.externalEntityTypes,
		...activeEntities.map((entity) => entity.entityType),
	])
	const entityByType = new Map(activeEntities.map((entity) => [entity.entityType, entity]))
	const valueTypeById = new Map(app.schema.valueTypes.map((valueType) => [valueType.id, valueType]))
	const sourceIds = new Set(app.sources.sources.map((source) => source.source))
	const sourceProviderIds = new Set(app.sources.providers.map((provider) => provider.provider))
	const routeEntryList = routeEntries(app.routes.tree)
	const allEntityTypes = new Set(entityTypes)
	const errors: string[] = []

	const expectUnique = (label: string, values: readonly string[]) => {
		for (const value of values) {
			if (values.indexOf(value) !== values.lastIndexOf(value))
				errors.push(`Duplicate ${label}: ${value}`)
		}
	}

	expectUnique('entity type', entityTypes)
	expectUnique('active entity type', activeEntities.map((entity) => entity.entityType))
	expectUnique('value type', app.schema.valueTypes.map((valueType) => valueType.id))
	expectUnique('source', app.sources.sources.map((source) => source.source))
	expectUnique('source provider', app.sources.providers.map((provider) => provider.provider))

	for (const entity of activeEntities) {
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
		for (const list of entity.singularView?.lists ?? []) {
			if (list.field != null && !fieldNames.has(list.field))
				errors.push(`${entity.entityType} list references missing field ${list.field}`)
		}
		if (entity.pluralView?.itemLink != null) {
			const selectorFieldNames = new Set(entity.selectors.flatMap((selector) => selector.fields))
			for (const [
				param,
				value,
			] of Object.entries(entity.pluralView.itemLink.params)) {
				for (const match of value.matchAll(/\bitem\.entitySelector\.([A-Za-z_$][\w$]*)/g)) {
					const field = match[1]
					if (!selectorFieldNames.has(field))
						errors.push(`${entity.entityType} itemLink param ${param} references non-selector field ${field}`)
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

	for (const entry of routeEntryList) {
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
	for (const entry of routeEntryList) {
		for (const routeFile of entry.files) {
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

			const entityHref = routeHrefFromLoad(entry, routeFile)
			if (routeFile.load != null && entityHref != null)
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
		generatedComponents,
		sourceSelections: unique(collectSourceSelections(app)),
	}
}

const deriveFiles = (app: App, indexes: AppIndexes): GeneratedFile[] => {
	const files = [
		renderEntityTypeFile(indexes.entityTypes),
		...indexes.activeEntities.map((entity) => renderEntitySchemaFile(entity, indexes)),
		renderSchemaIndexFile(indexes),
		renderSourceFile(app),
		renderSourceProviderFile(app),
		renderSourceProvidersFile(app),
		renderSourceSelectionsFile(indexes.sourceSelections),
		renderNavigationItemsFile(app),
		renderSourcesIndexFile(),
		renderSourcesServerIndexFile(),
		renderOfficialArtifactsFile(app),
		renderResolverIndexFile(app),
		...indexes.activeEntities.flatMap((entity) => [
			renderSingularViewFile(entity, indexes),
			renderPluralViewFile(entity, indexes),
		]),
		...namedRelationshipListViews(indexes).map((view) => renderNamedRelationshipListViewFile(view)),
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
					importSpec.from !== `$/schema/${entity.entityType}.ts`
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
		indent(`label: ${q(entity.label)},`),
		indent(`labelPlural: ${q(entity.labelPlural)},`),
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
		`src/schema/${entity.entityType}.ts`,
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
		['normalize', fieldDefinition.normalize],
	]

	return [
		'{',
		...renderObject(entries).split('\n').slice(1, -1).map((line) => indent(line)),
		'},',
	]
}

const renderSchemaIndexFile = (indexes: AppIndexes) => {
	const entityTypes = indexes.entityTypes
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
					from: `$/schema/${entityType}.ts`,
					defaultName: `${entityType}Schema`,
				})),
			],
			body,
		}
	)
}

const renderSourceFile = (app: App) => tsFile(
	'src/sources/Source.ts',
	{
		body: [
			renderStringEnum('Source', app.sources.sources.map((source) => source.source)),
		],
	}
)

const renderSourceProviderFile = (app: App) => tsFile(
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
			'}',
			'',
			renderStringEnum('SourceProvider', app.sources.providers.map((provider) => provider.provider)),
		],
	}
)

const renderEnvSchema = (env: App['sources']['providers'][number]['env']) => (
	env == null ?
		undefined
	:
		`type({\n${env.keys.map((key) => `\t${q(key.name)}: ${q(key.type)},`).join('\n')}\n})`
)

const renderSourceProvidersFile = (app: App) => {
	const sourcesByProvider = Map.groupBy(app.sources.sources, (source) => source.provider)
	const providerDefinitions = app.sources.providers.map((provider) => {
		const sources = sourcesByProvider.get(provider.provider) ?? []
		return renderObject([
			['provider', enumAccess('SourceProvider', provider.provider)],
			['label', q(provider.label)],
			['env', renderEnvSchema(provider.env)],
			['sources', renderSourceDefinitions(sources)],
			['bindings', renderArray(sources.flatMap((source) => [
				...(source.binding == null ? [] : [renderSourceBinding(provider.provider, source.source, source.binding)]),
				...(source.bindings ?? []).map((binding) => renderSourceBinding(provider.provider, source.source, binding)),
			]))],
		])
	})

	return tsFile(
		'src/sources/$sourceProviders.ts',
		{
			imports: [
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
				']',
				'',
				'export const sourceProviders = sourceProviderDefinitions',
			],
		}
	)
}

const renderSourceDefinitions = (sources: readonly App['sources']['sources'][number][]) => renderArray(sources.map((source) => renderObject([
	['provider', enumAccess('SourceProvider', source.provider)],
	['source', enumAccess('Source', source.source)],
	['label', q(source.label)],
	['env', renderEnvSchema(source.env)],
])))

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
				`export const ${sourceSelectionByKeyName(selection)}: Record<string, readonly Source[]> = ${renderObject((selection.cases ?? []).map((item) => [
					q(item.when.map((condition) => condition.equals).join(':')),
					renderSourceArray(item.sources),
				]))}`,
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
			'\t\tcredential.keys == null',
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

const renderOfficialArtifactsFile = (app: App) => {
	const artifacts = app.sources.sources.flatMap((source) => [
		...(source.binding == null ? [] : source.binding.artifacts ?? []),
		...(source.bindings ?? []).flatMap((binding) => binding.artifacts ?? []),
	])
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

const viewFieldNames = (entity: Entity) => unique([
	...entity.selectors.flatMap((selector) => selector.fields),
	...viewItems(entity.singularView?.summary?.icon).flatMap((viewEntry) => itemFieldName(viewEntry)),
	...viewItems(entity.singularView?.summary?.title).flatMap((viewEntry) => itemFieldName(viewEntry)),
	...viewItems(entity.singularView?.summary?.value).flatMap((viewEntry) => itemFieldName(viewEntry)),
	...viewItems(entity.singularView?.summary?.titleFallback).flatMap((viewEntry) => itemFieldName(viewEntry)),
	...viewItems(entity.singularView?.summary?.HeadingAfter).flatMap((viewEntry) => itemFieldName(viewEntry)),
	...contentDlGroups(entity).flatMap((viewEntries) => viewEntries.flatMap((viewEntry) => itemFieldName(viewEntry))),
	...(entity.singularView?.content?.body == null ? [] : [entity.singularView.content.body.field]),
	...(entity.singularView?.content?.blocks ?? []).flatMap((viewEntries) => viewEntries.flatMap((viewEntry) => itemFieldName(viewEntry))),
	...(entity.singularView?.details?.items ?? []).flatMap((group) => group.items.flatMap((viewEntry) => itemFieldName(viewEntry))),
	...(entity.singularView?.details?.body == null ? [] : [entity.singularView.details.body.field]),
	...(entity.singularView?.details?.tabs ?? []).flatMap((group) => (group.items ?? []).flatMap((viewEntry) => itemFieldName(viewEntry))),
	...(entity.singularView?.carousels ?? []).flatMap((group) => group.sections.flatMap((section) => (section.items ?? []).flatMap((viewEntry) => itemFieldName(viewEntry)))),
])

const entitySelectorFieldNames = (entity: Entity) => new Set(entity.selectors.flatMap((selector) => selector.fields))

const entitySelectorOwnsField = (entity: Entity, fieldName: string) => entity.selectors.some((selector) => selector.fields.includes(fieldName))

const viewResolvedFieldNames = (entity: Entity) => {
	const selectorFieldNames = entitySelectorFieldNames(entity)

	return viewFieldNames(entity).filter((fieldName) => !selectorFieldNames.has(fieldName))
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
	if ('field' in viewEntry)
		return [viewEntry.field]

	return []
}

const fieldDefinitionByName = (entity: Entity, fieldName: string) => entity.fields.find((fieldDefinition) => fieldDefinition.name === fieldName)

const textExpression = (valueExpression: string) => {
	const value = `(${valueExpression})`
	return `String(${value} ?? '')`
}

const renderDisplayExpression = (entity: Entity, indexes: AppIndexes, fieldName: string, valueExpression: string) => {
	const fieldDefinition = fieldDefinitionByName(entity, fieldName)
	const valueType = fieldDefinition?.valueType == null ? undefined : indexes.valueTypeById.get(fieldDefinition.valueType)
	const expression = valueType?.displayExpression

	if (expression == null) {
		const valueTypeType = valueType?.type ?? fieldDefinition?.primitiveType
		if (
			valueTypeTypeIsStructured(valueTypeType)
			|| valueTypeType != null && 'primitive' in valueTypeType && valueTypeType.primitive === 'unknown'
		)
			throw new Error(`${entity.entityType}.${fieldName} needs a valueType displayExpression before it can be rendered`)

		return textExpression(valueExpression)
	}

	if (!/\bvalue\b/.test(expression))
		return textExpression(expression)

	if (fieldDefinition?.cardinality === EntityFieldCardinality.Many || fieldDefinition?.cardinality === EntityFieldCardinality.ZeroOrMany)
		return `${valueExpression}.map((value) => ${textExpression(expression)}).filter(Boolean).join(', ')`

	return `${valueExpression} == null ? '' : ${textExpression(expression.replace(/(?<!\.)\bvalue\b/g, `(${valueExpression})`))}`
}

const viewItemFormat = (entity: Entity, indexes: AppIndexes, viewEntry: _ViewItem) => {
	const fieldName = itemFieldName(viewEntry)[0]
	if (fieldName == null)
		return undefined
	if (typeof viewEntry === 'object' && 'format' in viewEntry && viewEntry.format != null)
		return viewEntry.format

	const fieldDefinition = fieldDefinitionByName(entity, fieldName)
	return fieldDefinition?.valueType == null ? undefined : indexes.valueTypeById.get(fieldDefinition.valueType)?.format
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
		: format === 'truncated' || format === 'namespaceReference' ?
			[
				`${'\t'.repeat(level)}<TruncatedValue value={${format === 'namespaceReference' ? displayExpression : `String(${valueExpression})`}} />`,
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

		return renderDisplayExpression(entity, indexes, viewEntry, fieldExpression(entityFieldsExpression, viewEntry))
	}
	if ('kind' in viewEntry && viewEntry.kind === 'Text')
		return q(viewEntry.value ?? viewEntry.label)
	if (!('field' in viewEntry))
		return q('')

	if (fieldDefinitionByName(entity, viewEntry.field)?.type === EntityFieldType.EntityReference)
		return q('')

	const fieldValue = fieldExpression(entityFieldsExpression, viewEntry.field)
	const displayed = renderMappedDisplayExpression(entity, indexes, viewEntry, viewEntry.field, fieldValue)
	const value = [
		viewEntry.prefix == null ? undefined : q(viewEntry.prefix),
		displayed,
		viewEntry.suffix == null ? undefined : q(viewEntry.suffix),
	].filter((part): part is string => part != null).join(' + ')
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

const renderFallbackExpression = (expressions: readonly (string | undefined)[]) => {
	const filtered = expressions.filter((expression): expression is string => expression != null && expression !== 'undefined')
	return filtered.length === 0 ? 'undefined' : filtered.join(' || ')
}

const viewItemTree = (viewEntries: readonly _ViewItem[]): _ViewItem[] => viewEntries.flatMap((viewEntry) => [
	viewEntry,
	...(typeof viewEntry === 'object' && 'field' in viewEntry ? viewItemTree(viewItems(viewEntry.valuePrefix)) : []),
])

const summarySerial = (entity: Entity) => entity.singularView?.summary?.serial

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
	...viewItems(entity.singularView?.summary?.icon),
	...summarySerialItems(entity),
	...viewItems(entity.singularView?.summary?.title),
	...viewItems(entity.singularView?.summary?.value),
	...viewItems(entity.singularView?.summary?.titleFallback),
	...viewItems(entity.singularView?.summary?.HeadingAfter),
	...viewItems(entity.singularView?.closed),
	...(entity.singularView?.content?.dl ?? []).flat(),
	...(entity.singularView?.content?.blocks ?? []).flat(),
	...(entity.singularView?.details?.items ?? []).flatMap((group) => group.items),
	...(entity.singularView?.details?.blocks ?? []).flat(),
	...(entity.singularView?.details?.tabs ?? []).flatMap((group) => group.items ?? []),
	...(entity.singularView?.carousels ?? []).flatMap((group) => group.sections.flatMap((section) => section.items ?? [])),
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
	for (const section of entity.singularView?.carousels?.flatMap((carousel) => carousel.sections) ?? []) {
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
		entity.singularView?.content?.body?.format != null
		&& formats.includes(entity.singularView.content.body.format)
	)
	|| (
		entity.singularView?.details?.body?.format != null
		&& formats.includes(entity.singularView.details.body.format)
	)

const summaryTitleItems = (entity: Entity) => {
	const configured = entity.singularView?.summary?.title
	if (configured != null)
		return viewItems(configured)

	return []
}

const summaryValueItems = (entity: Entity) => viewItems(entity.singularView?.summary?.value)

const summaryVisualFieldNames = (entity: Entity) => new Set([
	...viewItems(entity.singularView?.summary?.icon).flatMap((viewEntry) => itemFieldName(viewEntry)),
	...summaryTitleItems(entity).flatMap((viewEntry) => itemFieldName(viewEntry)),
	...viewItems(entity.singularView?.summary?.titleFallback).flatMap((viewEntry) => itemFieldName(viewEntry)),
	...summaryValueItems(entity).flatMap((viewEntry) => itemFieldName(viewEntry)),
	...viewItems(entity.singularView?.summary?.HeadingAfter).flatMap((viewEntry) => itemFieldName(viewEntry)),
])

const contentDlGroups = (entity: Entity) => {
	const summaryFields = summaryVisualFieldNames(entity)
	const modeledDlGroups = entity.singularView?.content?.dl ?? []
	const effectiveDlGroups = modeledDlGroups
		.map((viewEntries) => viewEntries.filter((viewEntry) => itemFieldName(viewEntry).every((fieldName) => !summaryFields.has(fieldName))))
		.filter((viewEntries) => viewEntries.length > 0)
	const openFieldNames = new Set(effectiveDlGroups.flatMap((viewEntries) => viewEntries.flatMap((viewEntry) => itemFieldName(viewEntry))))
	const serialFieldName = summarySerial(entity)?.field
	const closedItems = viewItems(entity.singularView?.closed)
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
	]
}

const contentBlocks = (entity: Entity) => entity.singularView?.content?.blocks ?? []

const relationshipSections = (entity: Entity, indexes: AppIndexes) => {
	const configuredSections: RelationshipSection[] = [
		...(entity.singularView?.lists ?? []).flatMap((list) => (
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
				}]
		)),
		...(entity.singularView?.details?.items ?? []).flatMap((group) => group.items.flatMap((viewEntry) => {
			const field = itemFieldName(viewEntry)[0]
			return field == null ? [] : [{
				group: group.label,
				label: typeof viewEntry === 'object' && 'label' in viewEntry ? viewEntry.label : undefined,
				field,
				viewEntry,
			}]
		})),
	]

	return configuredSections
}

const relationshipSectionComponent = (section: RelationshipSection, fieldDefinition: EntityField, indexes: AppIndexes) => {
	if (section.component != null && indexes.generatedComponents.has(section.component))
		return section.component
	if (fieldDefinition.entityType == null)
		return undefined
	const targetEntity = indexes.entityByType.get(fieldDefinition.entityType)
	if (targetEntity == null)
		return undefined
	if (fieldDefinition.type === EntityFieldType.EntitiesReference)
		return pluralComponentName(targetEntity)
	if (fieldDefinition.type === EntityFieldType.EntityReference)
		return singularComponentName(targetEntity.entityType)

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
	const serialExpression = textExpression(fieldExpression(entityFieldsExpression, serial.field))
	return renderFallbackExpression([
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
		`${'\t'.repeat(level)}{@const serialValue = ${fieldExpression(entityFieldsExpression, serial.field)}}`,
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
		`${'\t'.repeat(level)}{@const serialValue = ${fieldExpression(entityFieldsExpression, serial.field)}}`,
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
	...renderSerialTitleBody(entity, indexes, serial, '({ ...selection.entitySelector, ...prefetched })', 2),
] : [
	`\t\t<ResourceBoundary resource={${entityName}}>`,
	'\t\t\t{#snippet Pending()}',
	...renderSerialTitleBody(entity, indexes, serial, '({ ...selection.entitySelector, ...prefetched })', 4),
	'\t\t\t{/snippet}',
	'\t\t\t{#snippet children(entity)}',
	...renderSerialTitleBody(entity, indexes, serial, '({ ...selection.entitySelector, ...prefetched, ...entity })', 4),
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
	...renderSerialValueBody(entity, indexes, serial, '({ ...selection.entitySelector, ...prefetched })', 2),
] : [
	`\t\t<ResourceBoundary resource={${entityName}}>`,
	'\t\t\t{#snippet Pending()}',
	...renderSerialValueBody(entity, indexes, serial, '({ ...selection.entitySelector, ...prefetched })', 4),
	'\t\t\t{/snippet}',
	'\t\t\t{#snippet children(entity)}',
	...renderSerialValueBody(entity, indexes, serial, '({ ...selection.entitySelector, ...prefetched, ...entity })', 4),
	'\t\t\t{/snippet}',
	'\t\t</ResourceBoundary>',
]

const renderSingularViewFile = (entity: Entity, indexes: AppIndexes) => {
	const componentName = singularComponentName(entity.entityType)
	const serial = summarySerial(entity)
	const selectorOwnsSerial = serial != null && entity.selectors.some((selector) => selector.fields.includes(serial.field))
	const configuredSummaryTitleItems = viewItems(entity.singularView?.summary?.title)
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
			summaryValueItems(entity).length === 0
			|| summaryValueItems(entity).every((viewEntry) => itemFieldName(viewEntry)[0] === serial.field)
		)
	)
	const openFieldNames = new Set(entity.singularView?.query?.openFields ?? [])
	const selectorFieldNames = entitySelectorFieldNames(entity)
	const fields = viewResolvedFieldNames(entity)
		.filter((fieldName) => !openFieldNames.has(fieldName) && fieldDefinitionByName(entity, fieldName) != null)
	const queryFields = unique([
		...(entity.singularView?.query?.fields ?? []),
		...fields,
		...viewItems(entity.singularView?.summary?.icon).flatMap((viewEntry) => itemFieldName(viewEntry)),
		...summarySerialItems(entity).flatMap((viewEntry) => itemFieldName(viewEntry)),
		...viewItems(entity.singularView?.summary?.title).flatMap((viewEntry) => itemFieldName(viewEntry)),
		...viewItems(entity.singularView?.summary?.value).flatMap((viewEntry) => itemFieldName(viewEntry)),
		...viewItems(entity.singularView?.summary?.titleFallback).flatMap((viewEntry) => itemFieldName(viewEntry)),
		...viewItems(entity.singularView?.summary?.HeadingAfter).flatMap((viewEntry) => itemFieldName(viewEntry)),
		...viewItems(entity.singularView?.closed).flatMap((viewEntry) => itemFieldName(viewEntry)),
	]).filter((fieldName) => fieldDefinitionByName(entity, fieldName) != null && !selectorFieldNames.has(fieldName))
	const sections = relationshipSections(entity, indexes)
	const detailsTabs = entity.singularView?.details?.tabs ?? []
	const summaryTitleEntityReferenceItems = (rendersSerialTitle ? [] : summaryTitleItems(entity)).flatMap((viewEntry) => {
		const fieldName = itemFieldName(viewEntry)[0]
		const fieldDefinition = fieldName == null ? undefined : fieldDefinitionByName(entity, fieldName)
		return fieldDefinition?.type === EntityFieldType.EntityReference && fieldDefinition.entityType != null ?
			[fieldDefinition.entityType]
		:
			[]
	})
	const summaryValueEntityReferenceItems = (rendersSerialValue ? [] : summaryValueItems(entity)).flatMap((viewEntry) => {
		const fieldName = itemFieldName(viewEntry)[0]
		const fieldDefinition = fieldName == null ? undefined : fieldDefinitionByName(entity, fieldName)
		return fieldDefinition?.type === EntityFieldType.EntityReference && fieldDefinition.entityType != null ?
			[fieldDefinition.entityType]
		:
			[]
	})
	const summaryAfterEntityReferenceItems = viewItems(entity.singularView?.summary?.HeadingAfter).flatMap((viewEntry) => {
		const fieldName = itemFieldName(viewEntry)[0]
		const fieldDefinition = fieldName == null ? undefined : fieldDefinitionByName(entity, fieldName)
		return fieldDefinition?.type === EntityFieldType.EntityReference && fieldDefinition.entityType != null ?
			[fieldDefinition.entityType]
		:
			[]
	})
	const summaryItemsNeedMarkup = (items: readonly _ViewItem[], entityReferenceItems: readonly EntityType[]) => (
		entityReferenceItems.length > 0
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
	const summaryTitleNeedsMarkup = summaryItemsNeedMarkup(summaryTitleItems(entity), summaryTitleEntityReferenceItems)
	const summaryValueNeedsMarkup = summaryItemsNeedMarkup(summaryValueItems(entity), summaryValueEntityReferenceItems)
	const summaryIconFieldName = itemFieldName(entity.singularView?.summary?.icon ?? '')[0]
	const summaryIconFieldDefinition = summaryIconFieldName == null ? undefined : fieldDefinitionByName(entity, summaryIconFieldName)
	const summaryIconIsMediaReference = (
		summaryIconFieldDefinition?.type === EntityFieldType.EntityReference
		&& summaryIconFieldDefinition.entityType === EntityType.Media
	)
	const entityReferenceItems = [...contentDlGroups(entity).flat(), ...contentBlocks(entity).flat(), ...detailsTabs.flatMap((tab) => tab.items ?? [])].flatMap((viewEntry) => {
		const fieldName = itemFieldName(viewEntry)[0]
		const fieldDefinition = fieldName == null ? undefined : fieldDefinitionByName(entity, fieldName)
		return fieldDefinition?.type === EntityFieldType.EntityReference && fieldDefinition.entityType != null ?
			[fieldDefinition.entityType]
		:
			[]
	})
	const carouselEntityReferenceItems = (entity.singularView?.carousels ?? []).flatMap((carousel) => carousel.sections.flatMap((section) => {
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
	const latestItems = (entity.singularView?.latest ?? []).filter((latest) => {
		const component = latestComponentName(entity, latest)
		return (
			latest.Content != null
			|| (
				component != null
				&& indexes.generatedComponents.has(component)
				&& fieldDefinitionByName(entity, latest.field)?.entityType != null
			)
		)
	})
	const carousels = entity.singularView?.carousels ?? []
	const usesSelect = (
		latestItems.length > 0
		|| summaryIconIsMediaReference
		|| summaryTitleEntityReferenceItems.length > 0
		|| summaryValueEntityReferenceItems.length > 0
		|| summaryAfterEntityReferenceItems.length > 0
		|| [...contentDlGroups(entity).flat(), ...contentBlocks(entity).flat()].some((viewEntry) => {
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
		const component = fieldDefinition == null ? undefined : relationshipSectionComponent(section, fieldDefinition, indexes)
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
		carousels.flatMap((carousel) => carousel.sections.flatMap((section) => {
			const component = carouselSectionComponent(entity, indexes, section)
			return component == null ? [] : [component]
		})),
		summaryIconIsMediaReference ? ['MediaView'] : [],
		rawSnippetSources(entity).some((snippet) => snippet.raw.includes('<MediaView')) ? ['MediaView'] : []
	))
	const viewSourceSelection = entity.singularView?.query?.sources
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
	const query = renderQuery(entity.singularView?.query, queryFields, viewSourcesExpression, 'open', selectorFieldNames)
	const sectionQueries = sections.map((section) => renderQuery(section.selection, []))
	const latestQueries = latestItems.map((latest) => renderQuery(latest.query, latest.fields ?? []))
	const carouselQueries = carousels.flatMap((carousel) => carousel.sections.flatMap((section) => (
		carouselSectionComponent(entity, indexes, section) == null ?
			[]
		:
			[renderQuery(section.selection, [])]
	)))
	const hasEntityReferenceCarouselSections = carousels.some((carousel) => carousel.sections.some((section) => (
		section.field != null
		&& fieldDefinitionByName(entity, section.field)?.type === EntityFieldType.EntityReference
		&& carouselSectionComponent(entity, indexes, section) != null
	)))
	const namedSourceSelections = unique([
		entity.singularView?.query?.sources,
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
	const titleExpression = renderJoinedItemsExpression(entity, indexes, summaryTitleItems(entity), 'entity')
	const valueExpression = renderJoinedItemsExpression(entity, indexes, summaryValueItems(entity), 'entity')
	const pendingTitleExpression = renderJoinedItemsExpression(entity, indexes, summaryTitleItems(entity), '({ ...selection.entitySelector, ...prefetched })')
	const pendingValueExpression = renderJoinedItemsExpression(entity, indexes, summaryValueItems(entity), '({ ...selection.entitySelector, ...prefetched })')
	const fallbackTitleExpression = renderJoinedItemsExpression(
		entity,
		indexes,
		viewItems(entity.singularView?.summary?.titleFallback),
		'selection.entitySelector'
	)
	const serialFallbackTitleExpression = serial == null ? renderFallbackExpression([pendingTitleExpression, fallbackTitleExpression]) : renderSerialTextExpression(entity, indexes, serial, '({ ...selection.entitySelector, ...prefetched })')
	const titleFallbackExpression = renderFallbackExpression([serialFallbackTitleExpression, q(entity.label)])
	const pendingTitleFallbackExpression = renderFallbackExpression([serial == null ? pendingTitleExpression : renderSerialTextExpression(entity, indexes, serial, '({ ...selection.entitySelector, ...prefetched })'), 'title', fallbackTitleExpression, q(entity.label)])
	const entityTitleFallbackExpression = renderFallbackExpression([titleExpression, 'title', 'titleFallback'])
	const pendingValueFallbackExpression = renderFallbackExpression([pendingValueExpression, pendingTitleExpression, 'title', fallbackTitleExpression, q(entity.label)])
	const entityValueFallbackExpression = renderFallbackExpression([valueExpression, titleExpression, 'titleFallback'])
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
		'({ ...selection.entitySelector, ...prefetched })'
	)
	const importedViewItems = viewItemImports(entity, indexes)
	const rawSnippets = rawSnippetSources(entity)
	const rawSnippetsUseBase = rawSnippets.some((snippet) => snippet.raw.includes('base +'))
	const entityName = camel(entity.entityType)
	const iconMarkup = renderIconSnippet(entity, entityName)
	const expressionImportSpecs = mergeImports([
		...(entity.singularView?.imports ?? []).map((importSpec) => ({
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
	const usesTimestamp = viewUsesFormat(entity, indexes, ['timestamp', 'dateTime']) || rawSnippets.some((snippet) => snippet.raw.includes('<Timestamp'))
	const usesNumberValue = serial != null || viewUsesFormat(entity, indexes, ['currency', 'currencyScaled', 'number', 'numberValue', 'percent']) || rawSnippets.some((snippet) => snippet.raw.includes('<NumberValue'))
	const usesTruncatedValue = viewUsesFormat(entity, indexes, ['truncated', 'namespaceReference', 'url']) || rawSnippets.some((snippet) => snippet.raw.includes('<TruncatedValue'))
	const usesUrl = viewUsesFormat(entity, indexes, ['url'])
	const usesMarkdown = viewUsesFormat(entity, indexes, ['markdown']) || rawSnippets.some((snippet) => snippet.raw.includes('<Markdown'))
	const usesTooltip = rawSnippets.some((snippet) => snippet.raw.includes('<Tooltip')) || carousels.some((carousel) => carousel.description != null)
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
	const detailBlockMarkup = (entity.singularView?.details?.blocks ?? []).flatMap((viewEntries) => viewEntries.flatMap((viewEntry) => renderContentBlock(
		entity,
		indexes,
		typeof viewEntry === 'object' && 'when' in viewEntry ? { ...viewEntry, when: 'always' } : viewEntry,
		'detailsOpen',
		3
	)))
	const contentNeedsEntity = (
		latestItems.some((latest) => latest.when != null && latest.when.length > 0)
	)
	const latestMarkup = latestItems.flatMap((latest) => renderLatestContentItem(entity, indexes, latest, contentNeedsEntity ? 5 : 3))
	const contentRowMarkupGroups = contentDlGroups(entity).map((viewEntries, groupIndex) => viewEntries.flatMap((viewEntry, viewEntryIndex) => renderContentItem(entity, indexes, viewEntry, 'contentOpen', contentNeedsEntity ? 5 : 3, entityName, contentNeedsEntity, `${localIdentifier(itemFieldName(viewEntry)[0] ?? 'fieldValue')}${groupIndex}_${viewEntryIndex}`)))
		.filter((group) => group.length > 0)
	const contentBodyMarkup = renderBodySection(entity, indexes, entity.singularView?.content?.body, 'contentOpen', 2, entityName)
	const contentBlockMarkup = contentBlocks(entity).flatMap((viewEntries) => viewEntries.flatMap((viewEntry) => renderContentBlock(entity, indexes, viewEntry, 'contentOpen', 2)))
	const usesViewDomId = true
	const renderSummaryItemMarkup = (viewEntry: _ViewItem, viewEntryIndex: number, entityFieldsExpression: string, entityHrefFieldsExpression: string, refLayout: 'Title' | 'Value') => {
		if (typeof viewEntry === 'object' && 'kind' in viewEntry && viewEntry.kind === _ViewItemKind.Text)
			return [
				`${'\t'.repeat(4)}{${q(viewEntry.value ?? viewEntry.label)}}`,
			]
		if (typeof viewEntry === 'object' && 'text' in viewEntry && viewEntry.text != null)
			return [
				`${'\t'.repeat(4)}{${q(viewEntry.text)}}`,
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
					const hrefExpression = renderEntityHrefExpression(indexes, targetEntity.entityType, selectorExpression)

					return [
						`${'\t'.repeat(4)}<${componentIdentifier(component)}`,
						renderSvelteAttribute(5, 'selection', `select(EntityType.${targetEntity.entityType}, ${selectorExpression})`),
						...(hrefExpression == null ? [] : [renderSvelteAttribute(5, 'href', hrefExpression)]),
						`${'\t'.repeat(5)}layout={EntityLayout.${refLayout}}`,
						`${'\t'.repeat(5)}open={false}`,
						`${'\t'.repeat(4)}/>`,
					]
				}
				const hrefExpression = renderEntityHrefExpression(indexes, targetEntity.entityType, `${targetEntityName}.entitySelector`)

				return [
					`${'\t'.repeat(4)}<ResourceBoundary`,
					renderSvelteAttribute(5, 'resource', fieldResourceExpression('selection', fieldName, fieldDefinition.entityType, '{}', false)),
					`${'\t'.repeat(4)}>`,
					`${'\t'.repeat(5)}{#snippet children(${targetEntityName})}`,
					...(fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne ? [
						`${'\t'.repeat(6)}{#if ${targetEntityName} != null}`,
					] : []),
					`${'\t'.repeat(referenceLevel)}<${componentIdentifier(component)}`,
					renderSvelteAttribute(referenceLevel + 1, 'selection', `select(EntityType.${targetEntity.entityType}, ${targetEntityName}.entitySelector)`),
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
		}

		return [
			`${'\t'.repeat(4)}{@const ${fieldValueName} = ${fieldExpression(entityFieldsExpression, fieldName)}}`,
			`${'\t'.repeat(4)}{#if ${fieldValueName} !== undefined && ${fieldValueName} !== null}`,
			...renderValueMarkup(entity, indexes, viewEntry, fieldName, fieldValueName, entityHrefFieldsExpression, 5),
			`${'\t'.repeat(4)}{/if}`,
		]
	}
	const pendingSummaryFieldsExpression = '({ ...selection.entitySelector, ...prefetched })'
	const entitySummaryFieldsExpression = '({ ...selection.entitySelector, ...prefetched, ...entity })'
	const pendingSummaryTitleMarkup = summaryTitleNeedsMarkup ? summaryTitleItems(entity).flatMap((viewEntry, viewEntryIndex) => renderSummaryItemMarkup(viewEntry, viewEntryIndex, pendingSummaryFieldsExpression, pendingSummaryFieldsExpression, 'Title')) : []
	const entitySummaryTitleMarkup = summaryTitleNeedsMarkup ? summaryTitleItems(entity).flatMap((viewEntry, viewEntryIndex) => renderSummaryItemMarkup(viewEntry, viewEntryIndex, entitySummaryFieldsExpression, entitySummaryFieldsExpression, 'Title')) : []
	const pendingSummaryValueMarkup = summaryValueNeedsMarkup ? summaryValueItems(entity).flatMap((viewEntry, viewEntryIndex) => renderSummaryItemMarkup(viewEntry, viewEntryIndex, pendingSummaryFieldsExpression, pendingSummaryFieldsExpression, 'Value')) : []
	const entitySummaryValueMarkup = summaryValueNeedsMarkup ? summaryValueItems(entity).flatMap((viewEntry, viewEntryIndex) => renderSummaryItemMarkup(viewEntry, viewEntryIndex, entitySummaryFieldsExpression, entitySummaryFieldsExpression, 'Value')) : []
	const detailBodyMarkup = renderBodySection(entity, indexes, entity.singularView?.details?.body, 'detailsOpen', 3, entityName)
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
	const usesIconComponent = iconMarkup.some((line) => line.includes('<IconComponent'))
	const typeAnnotationTooltipMarkup = (
		entity.singularView?.TypeAnnotationTooltip != null ?
			renderRawLines(entity.singularView.TypeAnnotationTooltip.raw, 2)
		: entity.description != null ?
			renderTooltipParagraphs([entity.description], 2)
		:
			[]
	)
	const detailsNeedsEntity = (
		sections.some((section) => section.titleField != null)
		|| carousels.some((carousel) => carousel.conditions != null && carousel.conditions.length > 0)
	)
	const script = [
		'// Types/constants',
		'import type { ComponentProps } from \'svelte\'',
		...(rawSnippetsUseBase ? ['import { base } from \'$app/paths\''] : []),
		...(usesResolve || rawSnippets.some((snippet) => snippet.raw.includes('resolve(')) ? ['import { resolve } from \'$app/paths\''] : []),
		'import type { EntityProxyData, EntityProxyResource } from \'$/client/$proxy.svelte.ts\'',
		'import type { WithRest } from \'$/typescript/WithRest.ts\'',
		...(usesEntityProxyField ? ['import { EntityProxyField } from \'$/client/$proxy.svelte.ts\''] : []),
		'import { EntityLayout } from \'$/components/EntityView.svelte\'',
		...(entityHrefExpression == null && iconMarkup.length === 0 && summaryTitleEntityReferenceItems.length === 0 && summaryValueEntityReferenceItems.length === 0 && summaryAfterEntityReferenceItems.length === 0 ? [] : ['import { EntityMetaKey } from \'$/schema/$schema.ts\'']),
		'import { EntityType } from \'$/schema/EntityType.ts\'',
		'import { schema } from \'$/schema/index.ts\'',
		...expressionImportSpecs.map(renderImport),
		...((
			query.includes('Source.')
			|| sectionQueries.some((sectionQuery) => sectionQuery.includes('Source.'))
			|| latestQueries.some((latestQuery) => latestQuery.includes('Source.'))
			|| carouselQueries.some((carouselQuery) => carouselQuery.includes('Source.'))
		) ? ['import { Source } from \'$/sources/Source.ts\''] : []),
		...(namedSourceSelections.length === 0 ? [] : [
			`import { ${unique(namedSourceSelections.flatMap((selection) => [
				defaultSourcesName(selection),
				...(selection === viewSourceSelection && viewSourceSelectionKeyExpression != null ? [sourceSelectionByKeyName(selection)] : []),
			])).join(', ')} } from '$/sources/$sourceSelections.ts'`,
		]),
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
			`const selectedViewSources = $derived(${sourceSelectionByKeyName(viewSourceSelection)}[${viewSourceSelectionKeyExpression}] ?? ${defaultSourcesName(viewSourceSelection)})`,
		]),
		'',
		`const ${entityName} = $derived(selection(${query}))`,
		`const titleFallback = $derived(${titleFallbackExpression})`,
		...(usesViewDomId ? [
			`const viewDomId = $derived(${q(`${entity.entityType
				.replace(/([a-z])([A-Z])/g, '$1-$2')
				.replace(/[_\s]+/g, '-')
				.toLowerCase()}-`)} + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))`,
		] : []),
		'// Components',
		'import EntityView from \'$/components/EntityView.svelte\'',
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
		'\tentitySelector={selection.entitySelector}',
		'\tid={viewDomId}',
		renderSvelteAttribute(1, 'title', 'title ?? titleFallback'),
		...(serial == null ? [] : [
			renderSvelteAttribute(1, 'idDragPlainText', `String(${fieldExpression('({ ...selection.entitySelector, ...prefetched })', serial.field)} ?? '')`),
		]),
		entityHrefExpression == null ? '\t{href}' : renderSvelteAttribute(1, 'href', `href ?? ${entityHrefExpression}`),
		'\t{layout}',
		'\tbind:open',
		'\t{...EntityViewProps}',
		'>',
		...iconMarkup,
		...(iconMarkup.length === 0 ? [] : ['']),
		'\t{#snippet Title()}',
		...(entity.singularView?.summary?.Title == null && rendersSerialTitle ? renderSerialTitleSnippet(entity, indexes, serial, selectorOwnsSerial, entityName) : entity.singularView?.summary?.Title == null ? [
		'\t\t{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}',
		...(pendingSummaryTitleMarkup.length === 0 ? [
			`\t\t\t{${pendingTitleFallbackExpression}}`,
		] : pendingSummaryTitleMarkup.map((line) => line.replace(/^\t/, ''))),
		'\t\t{:else}',
		`\t\t\t<ResourceBoundary resource={${entityName}}>`,
		'\t\t\t\t{#snippet Pending()}',
		...(pendingSummaryTitleMarkup.length === 0 ? [
			`\t\t\t\t\t{${pendingTitleFallbackExpression}}`,
		] : pendingSummaryTitleMarkup.map((line) => indent(line, 1))),
		'\t\t\t\t{/snippet}',
		'\t\t\t\t{#snippet children(entity)}',
		...(entitySummaryTitleMarkup.length === 0 ? [
			`\t\t\t\t\t{${entityTitleFallbackExpression}}`,
		] : entitySummaryTitleMarkup.map((line) => indent(line, 1))),
		'\t\t\t\t{/snippet}',
		'\t\t\t</ResourceBoundary>',
		'\t\t{/if}',
		] : renderRawLines(entity.singularView.summary.Title.raw, 2)),
		'\t{/snippet}',
		...(entity.singularView?.summary?.Value == null && !rendersSerialValue && summaryValueItems(entity).length === 0 ? [] : [
			'',
			'\t{#snippet Value()}',
			...(entity.singularView?.summary?.Value == null && serial != null && rendersSerialValue ? renderSerialValueSnippet(entity, indexes, serial, selectorOwnsSerial, entityName) : entity.singularView?.summary?.Value == null ? [
				'\t\t{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}',
				...(pendingSummaryValueMarkup.length === 0 ? [
					`\t\t\t{${pendingValueFallbackExpression}}`,
				] : pendingSummaryValueMarkup.map((line) => line.replace(/^\t/, ''))),
				'\t\t{:else}',
				`\t\t\t<ResourceBoundary resource={${entityName}}>`,
				'\t\t\t\t{#snippet Pending()}',
				...(pendingSummaryValueMarkup.length === 0 ? [
					`\t\t\t\t\t{${pendingValueFallbackExpression}}`,
				] : pendingSummaryValueMarkup.map((line) => indent(line, 1))),
				'\t\t\t\t{/snippet}',
				'\t\t\t\t{#snippet children(entity)}',
				...(entitySummaryValueMarkup.length === 0 ? [
					`\t\t\t\t\t{${entityValueFallbackExpression}}`,
				] : entitySummaryValueMarkup.map((line) => indent(line, 1))),
				'\t\t\t\t{/snippet}',
				'\t\t\t</ResourceBoundary>',
				'\t\t{/if}',
			] : renderRawLines(entity.singularView.summary.Value.raw, 2)),
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
			...(latestMarkup.length === 0 ? [] : contentNeedsEntity ? [
			`\t\t<ResourceBoundary resource={${entityName}}>`,
			'\t\t\t{#snippet children(entity)}',
			`\t\t\t\t<dl${entity.singularView?.latestDlClassName == null ? '' : ` class=${q(entity.singularView.latestDlClassName)}`} data-column-item="center">`,
			...latestMarkup,
			'\t\t\t\t</dl>',
			'\t\t\t{/snippet}',
			'\t\t</ResourceBoundary>',
		] : [
			`\t\t<dl${entity.singularView?.latestDlClassName == null ? '' : ` class=${q(entity.singularView.latestDlClassName)}`} data-column-item="center">`,
			...latestMarkup,
			'\t\t</dl>',
			]),
			...contentRowMarkupGroups.flatMap((contentRowMarkup) => contentNeedsEntity ? [
				`\t\t<ResourceBoundary resource={${entityName}}>`,
				'\t\t\t{#snippet children(entity)}',
				'\t\t\t\t<dl data-column-item="center">',
				...contentRowMarkup,
				'\t\t\t\t</dl>',
				'\t\t\t{/snippet}',
				'\t\t</ResourceBoundary>',
			] : [
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
			...(detailsNeedsEntity ? [
				`\t\t\t<ResourceBoundary resource={${entityName}}>`,
				'\t\t\t\t{#snippet children(entity)}',
			] : []),
			...detailsMarkup.map((line) => detailsNeedsEntity ? indent(line, 2) : line),
			...(detailsNeedsEntity ? [
				'\t\t\t\t{/snippet}',
				'\t\t\t</ResourceBoundary>',
			] : []),
			'\t\t{/if}',
			'\t{/snippet}',
		]),
		'</EntityView>',
	]

	return svelteFile(
		`src/views/${componentName}.svelte`,
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
			...renderRawLines(viewEntry.Content.raw, level + 1),
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

const renderBodySection = (
	entity: Entity,
	indexes: AppIndexes,
	body: NonNullable<Entity['singularView']>['content']['body'],
	openExpression: string,
	level: number,
	entityName: string
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
	const label = body.label ?? fieldDefinitionByName(entity, body.field)?.label ?? body.field
		.replace(/^\$\$?/, '')
		.replace(/([a-z])([A-Z])/g, '$1 $2')
		.replace(/^./, (letter) => letter.toUpperCase())
	const bodyFieldValue = `${fieldExpression('entity', body.field)} ?? ${fieldExpression('selection.entitySelector', body.field)} ?? ${fieldExpression('prefetched', body.field)}`
	const bodyMarkup = [
		`${'\t'.repeat(level + (body.id == null && body.label == null ? 0 : 1))}<ResourceBoundary resource={${entityName}}>`,
		`${'\t'.repeat(level + (body.id == null && body.label == null ? 1 : 2))}{#snippet children(entity)}`,
		`${'\t'.repeat(level + (body.id == null && body.label == null ? 2 : 3))}{@const ${localIdentifier(body.field)} = ${bodyFieldValue}}`,
		`${'\t'.repeat(level + (body.id == null && body.label == null ? 2 : 3))}{#if ${localIdentifier(body.field)} === undefined || ${localIdentifier(body.field)} === null || ${localIdentifier(body.field)} === ''}`,
		`${'\t'.repeat(level + (body.id == null && body.label == null ? 3 : 4))}<p data-text="muted">${body.emptyText ?? `No ${sentenceMiddle(label)} available.`}</p>`,
		`${'\t'.repeat(level + (body.id == null && body.label == null ? 2 : 3))}{:else}`,
		...renderValueMarkup(entity, indexes, bodyViewEntry, body.field, localIdentifier(body.field), 'entity', level + (body.id == null && body.label == null ? 3 : 4)),
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
	const fieldValue = fieldExpression(entityFieldsExpression, fieldName)
	const fieldDefinition = fieldDefinitionByName(entity, fieldName)
	if (fieldDefinition?.type === EntityFieldType.EntityReference && fieldDefinition.entityType != null) {
		const targetEntity = indexes.entityByType.get(fieldDefinition.entityType)
		if (targetEntity != null) {
			const component = singularComponentName(targetEntity.entityType)
			const targetEntityName = camel(targetEntity.entityType)
			const referenceLevel = fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne ? level + 3 : level + 2
			if (entitySelectorOwnsField(entity, fieldName)) {
				const selectorExpression = fieldExpression('selection.entitySelector', fieldName)
				const hrefExpression = renderEntityHrefExpression(indexes, targetEntity.entityType, selectorExpression)

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
			const hrefExpression = renderEntityHrefExpression(indexes, targetEntity.entityType, `${targetEntityName}.entitySelector`)

			return [
				`${'\t'.repeat(level)}<ResourceBoundary`,
				renderSvelteAttribute(level + 1, 'resource', fieldResourceExpression('selection', fieldName, fieldDefinition.entityType, '{}', false)),
				`${'\t'.repeat(level)}>`,
				`${'\t'.repeat(level + 1)}{#snippet children(${targetEntityName})}`,
				...(fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne ? [
					`${'\t'.repeat(level + 2)}{#if ${targetEntityName} != null}`,
				] : []),
				`${'\t'.repeat(referenceLevel)}<span data-text="muted">`,
				`${'\t'.repeat(referenceLevel + 1)}<${componentIdentifier(component)}`,
				renderSvelteAttribute(referenceLevel + 2, 'selection', `select(EntityType.${targetEntity.entityType}, ${targetEntityName}.entitySelector)`),
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
	}

	const fieldValuesExpression = `({ value: ${fieldValueName}, ...selection.entitySelector, ...prefetched${entityFieldsExpression === 'entity' ? ', ...entity' : ''} })`
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
	const viewEntries = viewItems(entity.singularView?.summary?.HeadingAfter)
	if (viewEntries.length === 0)
		return []

	return [
		'',
		'\t{#snippet HeadingAfter()}',
		'\t\t{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}',
		...viewEntries.flatMap((viewEntry, viewEntryIndex) => renderSummaryAfterItem(entity, indexes, viewEntry, 'prefetched', viewEntryIndex, 3)),
		'\t\t{:else}',
		`\t\t\t<ResourceBoundary resource={${entityName}}>`,
		'\t\t\t\t{#snippet Pending()}',
		...viewEntries.flatMap((viewEntry, viewEntryIndex) => renderSummaryAfterItem(entity, indexes, viewEntry, 'prefetched', viewEntryIndex, 5)),
		'\t\t\t\t{/snippet}',
		'\t\t\t\t{#snippet children(entity)}',
		...viewEntries.flatMap((viewEntry, viewEntryIndex) => renderSummaryAfterItem(entity, indexes, viewEntry, 'entity', viewEntryIndex, 5)),
		'\t\t\t\t{/snippet}',
		'\t\t\t</ResourceBoundary>',
		'\t\t{/if}',
		'\t{/snippet}',
	]
}

const renderIconSnippet = (entity: Entity, entityName: string) => {
	if (entity.singularView?.summary?.Icon != null)
		return [
			'',
			'\t{#snippet Icon()}',
			...renderRawLines(entity.singularView.summary.Icon.raw, 2),
			'\t{/snippet}',
		]

	const icon = entity.singularView?.summary?.icon
	if (icon == null)
		return []

	const iconField = icon == null ? undefined : itemFieldName(icon)[0]
	const iconFieldDefinition = iconField == null ? undefined : fieldDefinitionByName(entity, iconField)
	if (
		iconFieldDefinition?.type === EntityFieldType.EntityReference
		&& iconFieldDefinition.entityType === EntityType.Media
	)
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
			'\t\t\t\t{#if reference?.[EntityMetaKey.Selector] !== undefined}',
			'\t\t\t\t\t<MediaView',
			'\t\t\t\t\t\tselection={select(EntityType.Media, reference[EntityMetaKey.Selector])}',
			'\t\t\t\t\t\tprefetched={reference}',
			'\t\t\t\t\t\tlayout={EntityLayout.Value}',
			'\t\t\t\t\t\topen={false}',
			'\t\t\t\t\t/>',
			'\t\t\t\t{/if}',
			'\t\t\t{/snippet}',
			'\t\t</ResourceBoundary>',
			'\t{/snippet}',
		]

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

const renderContentItem = (
	entity: Entity,
	indexes: AppIndexes,
	viewEntry: _ViewItem,
	openExpression: string,
	level: number,
	entityName: string,
	insideEntityBoundary = false,
	directFieldValueName = 'fieldValue'
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
		return wrapWhen(viewEntry, openExpression, renderRawLines(viewEntry.Content.raw, level))

	const fieldName = itemFieldName(viewEntry)[0]
	if (fieldName == null)
		return []
	const fieldDefinition = fieldDefinitionByName(entity, fieldName)
	if (fieldDefinition == null)
		return []
	if (fieldDefinition.type === EntityFieldType.EntitiesReference)
		return []
	const label = typeof viewEntry === 'object' && 'label' in viewEntry && viewEntry.label != null ? viewEntry.label : labelForField(fieldDefinition)

	if (fieldDefinition.type === EntityFieldType.EntityReference) {
		if (fieldDefinition.entityType == null)
			return []

		const targetEntity = indexes.entityByType.get(fieldDefinition.entityType)
		if (targetEntity == null)
			return []

		const targetEntityName = camel(targetEntity.entityType)
		if (entitySelectorOwnsField(entity, fieldName)) {
			const selectorExpression = fieldExpression('selection.entitySelector', fieldName)
			const hrefExpression = renderEntityHrefExpression(indexes, fieldDefinition.entityType, selectorExpression)

			return wrapWhen(viewEntry, openExpression, [
				`${'\t'.repeat(level)}<div>`,
				`${'\t'.repeat(level + 1)}<dt>${label}</dt>`,
				`${'\t'.repeat(level + 1)}<dd>`,
				`${'\t'.repeat(level + 2)}<${singularComponentIdentifier(targetEntity.entityType)}`,
				renderSvelteAttribute(level + 3, 'selection', `select(EntityType.${fieldDefinition.entityType}, ${selectorExpression})`),
				...(hrefExpression == null ? [] : [
					renderSvelteAttribute(level + 3, 'href', hrefExpression),
				]),
				`${'\t'.repeat(level + 3)}layout={EntityLayout.Title}`,
				`${'\t'.repeat(level + 3)}open={false}`,
				`${'\t'.repeat(level + 2)}/>`,
				`${'\t'.repeat(level + 1)}</dd>`,
				`${'\t'.repeat(level)}</div>`,
			])
		}

		const hrefExpression = renderEntityHrefExpression(indexes, fieldDefinition.entityType, `${targetEntityName}.entitySelector`)
		const content = [
			`${'\t'.repeat(level)}<div>`,
			`${'\t'.repeat(level + 1)}<dt>${label}</dt>`,
			`${'\t'.repeat(level + 1)}<dd>`,
			`${'\t'.repeat(level + 2)}<${singularComponentIdentifier(targetEntity.entityType)}`,
			renderSvelteAttribute(level + 3, 'selection', `select(EntityType.${fieldDefinition.entityType}, ${targetEntityName}.entitySelector)`),
			`${'\t'.repeat(level + 3)}prefetched={${targetEntityName}}`,
			...(hrefExpression == null ? [] : [
				renderSvelteAttribute(level + 3, 'href', hrefExpression),
			]),
			`${'\t'.repeat(level + 3)}layout={EntityLayout.Title}`,
			`${'\t'.repeat(level + 3)}open={false}`,
			`${'\t'.repeat(level + 2)}/>`,
			`${'\t'.repeat(level + 1)}</dd>`,
			`${'\t'.repeat(level)}</div>`,
		]

		if (fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne)
			return wrapWhen(viewEntry, openExpression, [
				`${'\t'.repeat(level)}<ResourceBoundary`,
				renderSvelteAttribute(level + 1, 'resource', fieldResourceExpression('selection', fieldName, fieldDefinition.entityType, '{}', false)),
				`${'\t'.repeat(level)}>`,
				`${'\t'.repeat(level + 1)}{#snippet children(${targetEntityName})}`,
				`${'\t'.repeat(level + 2)}{#if ${targetEntityName} != null}`,
				...content.map((line) => indent(line, 3)),
				`${'\t'.repeat(level + 2)}{/if}`,
				`${'\t'.repeat(level + 1)}{/snippet}`,
				`${'\t'.repeat(level)}</ResourceBoundary>`,
			])

		return wrapWhen(viewEntry, openExpression, [
			`${'\t'.repeat(level)}<div>`,
			`${'\t'.repeat(level + 1)}<dt>${label}</dt>`,
			`${'\t'.repeat(level + 1)}<dd>`,
			`${'\t'.repeat(level + 2)}<ResourceBoundary`,
			renderSvelteAttribute(level + 3, 'resource', fieldResourceExpression('selection', fieldName, fieldDefinition.entityType, '{}', false)),
			`${'\t'.repeat(level + 2)}>`,
			`${'\t'.repeat(level + 3)}{#snippet children(${targetEntityName})}`,
			...content.slice(3, -2).map((line) => indent(line, 2)),
			`${'\t'.repeat(level + 3)}{/snippet}`,
			`${'\t'.repeat(level + 2)}</ResourceBoundary>`,
			`${'\t'.repeat(level + 1)}</dd>`,
			`${'\t'.repeat(level)}</div>`,
		])
	}

	const valueExpression = `${fieldExpression('entity', fieldName)} ?? ${fieldExpression('selection.entitySelector', fieldName)} ?? ${fieldExpression('prefetched', fieldName)}`
	const pendingValueExpression = `${fieldExpression('prefetched', fieldName)} ?? ${fieldExpression('selection.entitySelector', fieldName)}`
	const fieldValueName = localIdentifier(fieldName)
	const valueMarkup = [
		`${'\t'.repeat(level)}<div>`,
		`${'\t'.repeat(level + 1)}<dt>${label}</dt>`,
		`${'\t'.repeat(level + 1)}<dd>`,
		...renderValueMarkup(entity, indexes, viewEntry, fieldName, fieldValueName, `({ value: ${fieldValueName}, ...selection.entitySelector, ...prefetched, ...entity })`, level + 2),
		`${'\t'.repeat(level + 1)}</dd>`,
		`${'\t'.repeat(level)}</div>`,
	]
	const pendingValueMarkup = [
		`${'\t'.repeat(level)}<div>`,
		`${'\t'.repeat(level + 1)}<dt>${label}</dt>`,
		`${'\t'.repeat(level + 1)}<dd>`,
		...renderValueMarkup(entity, indexes, viewEntry, fieldName, fieldValueName, `({ value: ${fieldValueName}, ...selection.entitySelector, ...prefetched })`, level + 2),
		`${'\t'.repeat(level + 1)}</dd>`,
		`${'\t'.repeat(level)}</div>`,
	]

	if (insideEntityBoundary)
		return wrapWhen(viewEntry, openExpression, [
			`${'\t'.repeat(level)}{#if true}`,
			`${'\t'.repeat(level + 1)}{@const ${directFieldValueName} = ${valueExpression}}`,
			...(fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne ? [
				`${'\t'.repeat(level + 1)}{#if ${directFieldValueName} !== undefined && ${directFieldValueName} !== null}`,
				`${'\t'.repeat(level + 2)}<div>`,
				`${'\t'.repeat(level + 3)}<dt>${label}</dt>`,
				`${'\t'.repeat(level + 3)}<dd>`,
				...renderValueMarkup(entity, indexes, viewEntry, fieldName, directFieldValueName, `({ value: ${directFieldValueName}, ...selection.entitySelector, ...prefetched, ...entity })`, level + 4),
				`${'\t'.repeat(level + 3)}</dd>`,
				`${'\t'.repeat(level + 2)}</div>`,
				`${'\t'.repeat(level + 1)}{/if}`,
			] : [
				`${'\t'.repeat(level + 1)}<div>`,
				`${'\t'.repeat(level + 2)}<dt>${label}</dt>`,
				`${'\t'.repeat(level + 2)}<dd>`,
				...renderValueMarkup(entity, indexes, viewEntry, fieldName, directFieldValueName, `({ value: ${directFieldValueName}, ...selection.entitySelector, ...prefetched, ...entity })`, level + 3),
				`${'\t'.repeat(level + 2)}</dd>`,
				`${'\t'.repeat(level + 1)}</div>`,
			]),
			`${'\t'.repeat(level)}{/if}`,
		])

	if (fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne)
		return wrapWhen(viewEntry, openExpression, [
			`${'\t'.repeat(level)}<ResourceBoundary resource={${entityName}}>`,
			`${'\t'.repeat(level + 1)}{#snippet Pending()}`,
			`${'\t'.repeat(level + 2)}{@const ${fieldValueName} = ${pendingValueExpression}}`,
			`${'\t'.repeat(level + 2)}{#if ${fieldValueName} !== undefined && ${fieldValueName} !== null}`,
			...pendingValueMarkup.map((line) => indent(line, 3)),
			`${'\t'.repeat(level + 2)}{/if}`,
			`${'\t'.repeat(level + 1)}{/snippet}`,
			`${'\t'.repeat(level + 1)}{#snippet children(entity)}`,
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
		`${'\t'.repeat(level + 2)}<ResourceBoundary resource={${entityName}}>`,
		`${'\t'.repeat(level + 3)}{#snippet Pending()}`,
		`${'\t'.repeat(level + 4)}{@const ${fieldValueName} = ${pendingValueExpression}}`,
		`${'\t'.repeat(level + 4)}{#if ${fieldValueName} !== undefined && ${fieldValueName} !== null}`,
		...renderValueMarkup(entity, indexes, viewEntry, fieldName, fieldValueName, `({ value: ${fieldValueName}, ...selection.entitySelector, ...prefetched })`, level + 5),
		`${'\t'.repeat(level + 4)}{/if}`,
		`${'\t'.repeat(level + 3)}{/snippet}`,
		`${'\t'.repeat(level + 3)}{#snippet children(entity)}`,
		`${'\t'.repeat(level + 4)}{@const ${fieldValueName} = ${valueExpression}}`,
		`${'\t'.repeat(level + 4)}{#if ${fieldValueName} !== undefined && ${fieldValueName} !== null}`,
		...renderValueMarkup(entity, indexes, viewEntry, fieldName, fieldValueName, `({ value: ${fieldValueName}, ...selection.entitySelector, ...prefetched, ...entity })`, level + 5),
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
	if (latest.Content != null) {
		const conditionExpression = latest.when == null || latest.when.length === 0 ?
			undefined
		:
			latest.when
				.map((condition) => `${fieldExpression('entity', condition.field)} === ${renderLiteral(condition.equals)}`)
				.join(' && ')
		const lines = renderRawLines(latest.Content.raw, level)

		if (conditionExpression == null)
			return lines

		return [
			`${'\t'.repeat(level)}{#if ${conditionExpression}}`,
			...lines.map((line) => indent(line)),
			`${'\t'.repeat(level)}{/if}`,
		]
	}

	const entityType = latestTargetEntityType(entity, latest)
	const fieldEntityType = fieldDefinitionByName(entity, latest.field)?.entityType
	const component = latestComponentName(entity, latest)
	if (entityType == null || fieldEntityType == null || component == null)
		return []
	const latestEntityName = camel(entityType)
	const latestSelectorName = `${latestEntityName}Selector`

	const query = renderQuery(
		{
			...latest.query,
			limit: 1,
			orderBy: latest.query?.orderBy ?? (latest.sort == null ? undefined : [
				{
					field: latest.sort,
					direction: latest.direction ?? 'desc',
				},
			]),
		},
		latest.fields ?? []
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
	const selectorExpression = `${latestEntityName}.entitySelector`
	const latestHrefExpression = renderEntityHrefExpression(indexes, entityType, selectorExpression, `({ ...${selectorExpression}, ...${latestEntityName} })`)
	const conditionExpression = latest.when == null || latest.when.length === 0 ?
		undefined
	:
	latest.when
		.map((condition) => `${fieldExpression('entity', condition.field)} === ${renderLiteral(condition.equals)}`)
		.join(' && ')
	const latestLabel = latest.label ?? latest.field
	const placeholderLabel = latestLabel.toLowerCase().startsWith('latest ') ? latestLabel.toLowerCase() : `latest ${latestLabel.toLowerCase()}`

	const latestBodyLines = [
		`${'\t'.repeat(level + 4)}{#if ${latestEntityName} != null}`,
		renderSvelteConst(level + 5, latestSelectorName, selectorExpression),
		`${'\t'.repeat(level + 5)}<${componentIdentifier(component)}`,
		renderSvelteAttribute(level + 6, 'selection', `select(EntityType.${entityType}, ${latestSelectorName}${latestSelectionSuffix})`),
		...(latestHrefExpression == null ? [] : [renderSvelteAttribute(level + 6, 'href', renderEntityHrefExpression(indexes, entityType, latestSelectorName, `({ ...${latestSelectorName}, ...${latestEntityName} })`) ?? latestHrefExpression)]),
		`${'\t'.repeat(level + 6)}prefetched={{ ...${latestSelectorName}, ...${latestEntityName} }}`,
		`${'\t'.repeat(level + 6)}layout={EntityLayout.Value}`,
		`${'\t'.repeat(level + 6)}open={false}`,
		`${'\t'.repeat(level + 5)}/>`,
		`${'\t'.repeat(level + 4)}{:else}`,
		`${'\t'.repeat(level + 5)}<span data-text="muted">-</span>`,
		`${'\t'.repeat(level + 4)}{/if}`,
	]

	const lines = [
		`${'\t'.repeat(level)}<div>`,
		`${'\t'.repeat(level + 1)}<dt>${latestLabel}</dt>`,
		`${'\t'.repeat(level + 1)}<dd>`,
		`${'\t'.repeat(level + 2)}<ResourceBoundary`,
		renderSvelteAttribute(level + 3, 'resource', `${fieldResourceExpression('selection', latest.field, fieldEntityType, query)}.first()`),
		`${'\t'.repeat(level + 3)}placeholderText=${q(`Loading ${placeholderLabel}...`)}`,
		`${'\t'.repeat(level + 2)}>`,
		`${'\t'.repeat(level + 3)}{#snippet Pending()}`,
		`${'\t'.repeat(level + 4)}<span data-text="muted">-</span>`,
		`${'\t'.repeat(level + 3)}{/snippet}`,
		`${'\t'.repeat(level + 3)}{#snippet children(${latestEntityName})}`,
		...latestBodyLines,
		`${'\t'.repeat(level + 3)}{/snippet}`,
		`${'\t'.repeat(level + 2)}</ResourceBoundary>`,
		`${'\t'.repeat(level + 1)}</dd>`,
		`${'\t'.repeat(level)}</div>`,
	]

	if (conditionExpression == null)
		return lines

	return [
		`${'\t'.repeat(level)}{#if ${conditionExpression}}`,
		...lines.map((line) => indent(line)),
		`${'\t'.repeat(level)}{/if}`,
	]
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
					level + 1,
					entityName
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
		return []

	const component = relationshipSectionComponent(section, fieldDefinition, indexes)
	if (fieldDefinition.entityType == null)
		return []

	if (fieldDefinition.type === EntityFieldType.EntityReference && component != null)
		return renderEntityReferenceSection(entity, indexes, section, fieldDefinition, component)
	if (fieldDefinition.type === EntityFieldType.EntitiesReference && component != null)
		return renderEntitiesReferenceSection(entity, indexes, section, fieldDefinition, component)

	return []
}

const detailTabId = (
	tab: NonNullable<Entity['singularView']>['details']['tabs'][number]
) => tab.id ?? (
	tab.label
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '')
	|| 'tab'
)

const detailTabSnippetName = (
	tab: NonNullable<Entity['singularView']>['details']['tabs'][number]
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
	tab: NonNullable<Entity['singularView']>['details']['tabs'][number]
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
	tab: NonNullable<Entity['singularView']>['details']['tabs'][number],
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
			...dlViewEntries.flatMap((viewEntry) => renderContentItem(entity, indexes, viewEntry, 'detailsOpen', 6, entityName)),
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
	const tabs = (entity.singularView?.details?.tabs ?? []).filter((tab) => renderDetailTab(entity, indexes, tab, entityName).length > 0)
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

const carouselSectionComponent = (entity: Entity, indexes: AppIndexes, section: EntityCarouselSection) => {
	if (section.field == null)
		return undefined

	const fieldDefinition = fieldDefinitionByName(entity, section.field)
	if (fieldDefinition == null || fieldDefinition.entityType == null)
		return undefined

	if (section.List != null)
		return section.List

	return relationshipSectionComponent({
		field: section.field,
	}, fieldDefinition, indexes)
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
				routeParamStringExpression(optional ? optionalFieldExpression(fieldsExpression, expression.name) : fieldExpression(fieldsExpression, expression.name), decode)
			:
				optional ? optionalFieldExpression(fieldsExpression, expression.name) : fieldExpression(fieldsExpression, expression.name)
		)
	if (expression.kind === 'property')
		return (
			decode === _ExpressionDecode.DecodeURIComponent ?
				routeParamStringExpression(`${renderRouteParamValueExpression(expression.value, fieldsExpression, undefined, optional)}${optional ? optionalPropertyAccess(expression.property) : propertyAccess(expression.property)}`, decode)
			:
				`${renderRouteParamValueExpression(expression.value, fieldsExpression, undefined, optional)}${optional ? optionalPropertyAccess(expression.property) : propertyAccess(expression.property)}`
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
		return `String(${renderAppExpression(expression, {
			fields: fieldsExpression,
		})})`

	return renderAppExpression(expression, {
		fields: fieldsExpression,
	})
}

const routeParamPresenceConditions = (expression: _Expression, fieldsExpression: string, decode?: _ExpressionDecode): string[] => {
	if (expression.kind === 'field')
		return [`${optionalFieldExpression(fieldsExpression, expression.name)} != null`]
	if (expression.kind === 'property')
		return [`${renderRouteParamValueExpression(expression, fieldsExpression, undefined, true)} != null`]
	if (expression.kind === 'template')
		return expression.parts.flatMap((part) => (
			typeof part === 'string' ?
				[]
			:
				routeParamPresenceConditions(part, fieldsExpression, decode)
		))

	return [`${routeParamStringExpression(renderRouteParamValueExpression(expression, fieldsExpression, decode))} !== ''`]
}

const renderCollectionHrefExpression = (
	entity: Entity,
	indexes: AppIndexes,
	field: string,
	targetEntity: string
) => {
	const childHref = indexes.collectionHrefBySourceField.get(collectionSourceFieldKey(entity.entityType, field, targetEntity))
	if (childHref != null)
		return renderRouteResolveExpression(
			childHref.href,
			childHref.params.map((param) => [
				param.param,
				renderRouteParamValueExpression(param.value, 'selection.entitySelector', param.decode),
			])
		)

	const collectionHref = indexes.collectionHrefByEntity.get(targetEntity)
	return collectionHref == null ? undefined : collectionHref.includes('(') ? renderRouteResolveExpression(collectionHref) : renderResolveExpression(collectionHref)
}

const renderEntityHrefExpression = (
	indexes: AppIndexes,
	entityType: string,
	fieldsExpression: string,
	routeFieldsExpression = fieldsExpression
) => {
	const entityHrefs = indexes.entityHrefsByType.get(entityType) ?? []
	if (entityHrefs.length === 0)
		return undefined

	const entity = indexes.entityByType.get(entityType)
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
		const selector = entity?.selectors.find((item) => item.name === entityHref.selector)
		const condition = unique([
			...(selector?.fields.map((field) => `${optionalFieldExpression(fieldsExpression, field)} != null`) ?? []),
			...entityHref.params.flatMap((param) => routeParamPresenceConditions(param.value, routeFieldsExpression, param.decode)),
		]).join(' && ')

		return {
			condition,
			hrefExpression,
		}
	})

	if (candidates.length === 1)
		return candidates[0].hrefExpression

	return `(${candidates.map((candidate) => `${candidate.condition === '' ? 'true' : candidate.condition} ? ${candidate.hrefExpression}`).join(' : ')} : undefined)`
}

const renderEntityPageSelection = (
	entity: Entity | undefined,
	entityType: string,
	selectorExpression: string
) => {
	if (entity == null)
		return `select(EntityType.${entityType}, ${selectorExpression})`

	const fields = viewResolvedFieldNames(entity)
		.filter((fieldName) => {
			const fieldDefinition = fieldDefinitionByName(entity, fieldName)
			return (
				fieldDefinition != null
				&& fieldDefinition.type !== EntityFieldType.EntitiesReference
			)
		})

	if (fields.length === 0)
		return `select(EntityType.${entityType}, ${selectorExpression})`

	return [
		`select(EntityType.${entityType}, ${selectorExpression}, {`,
		'\tfields: {',
		...fields.map((field) => `\t\t${field}: true,`),
		'\t},',
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
	const sections = carousel.sections.filter((section) => (
		section.Content != null
		|| carouselSectionComponent(entity, indexes, section) != null
		|| carouselSectionIsPrimitiveList(entity, section)
	))
	if (sections.length === 0)
		return []

	const sectionExpression = (section: EntityCarouselSection) => renderObject([
		['id', q(carouselSectionId(section))],
		['label', q(section.label ?? section.field ?? 'Section')],
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

	if (carousel.conditions == null || carousel.conditions.length === 0)
		return tabsLines

	return [
		'\t\t\t{#if ' + carousel.conditions.map((condition) => `${fieldExpression('entity', condition.field)} === ${renderLiteral(condition.equals)}`).join(' && ') + '}',
		...tabsLines.map((line) => indent(line)),
		'\t\t\t{/if}',
	]
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
		return []

	const fieldDefinition = fieldDefinitionByName(entity, section.field)
	if (fieldDefinition == null)
		return []

	if (carouselSectionIsPrimitiveList(entity, section))
		return renderPrimitiveCarouselSection(entity, indexes, section)

	if (fieldDefinition.entityType == null)
		return []

	const component = carouselSectionComponent(entity, indexes, section)
	if (component == null)
		return []

	const query = renderQuery(section.selection, [])
	const sectionId = carouselSectionId(section)
	const snippetName = `Section${pascal(sectionId)}`
	const targetEntity = fieldDefinition.entityType
	const targetEntityName = camel(targetEntity)
	const referenceHrefExpression = renderEntityHrefExpression(indexes, targetEntity, `${targetEntityName}.entitySelector`)
	const referenceItemsExpression = fieldDefinition.cardinality === EntityFieldCardinality.ZeroOrOne ?
		`${targetEntityName} == null ? [] : [${targetEntityName}]`
	:
		`[${targetEntityName}]`
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
			'\t\t\t\t\t\t\t<EntitiesList',
			`\t\t\t\t\t\t\t\tentityType={EntityType.${targetEntity}}`,
			'\t\t\t\t\t\t\t\tid={`${id}-list`}',
			'\t\t\t\t\t\t\t\ttitle={label}',
			'\t\t\t\t\t\t\t\tcollapsible={false}',
			renderSvelteAttribute(8, 'items', referenceItemsExpression),
			`\t\t\t\t\t\t\t\tgetKey={(${targetEntityName}) => ${targetEntityName}[EntityMetaKey.SelectorKey]}`,
			'\t\t\t\t\t\t\t>',
			`\t\t\t\t\t\t\t\t{#snippet Item({ item: ${targetEntityName} })}`,
			`\t\t\t\t\t\t\t\t\t<${componentIdentifier(component)}`,
			`\t\t\t\t\t\t\t\t\t\tselection={select(EntityType.${targetEntity}, ${targetEntityName}.entitySelector)}`,
			`\t\t\t\t\t\t\t\t\t\tprefetched={${targetEntityName}}`,
			...(referenceHrefExpression == null ? [] : [renderSvelteAttribute(10, 'href', referenceHrefExpression)]),
			'\t\t\t\t\t\t\t\t\t\tlayout={EntityLayout.Summary}',
			'\t\t\t\t\t\t\t\t\t\topen={false}',
			'\t\t\t\t\t\t\t\t\t/>',
			'\t\t\t\t\t\t\t\t{/snippet}',
			'\t\t\t\t\t\t\t</EntitiesList>',
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
	const query = renderQuery(section.selection, [section.field ?? ''])
	const fieldDefinition = fieldDefinitionByName(entity, section.field ?? '')
	const primitiveValuesName = camel(section.field ?? 'values')
	const primitiveValueName = camel((fieldDefinition?.label ?? section.field ?? 'value').replace(/s$/, ''))
	const primitiveValueIndexName = `${primitiveValueName}Index`
	const emptyText = section.emptyText == null ?
		`No ${sentenceMiddle(section.label ?? fieldDefinition?.label ?? section.field ?? 'entries')} listed.`
	:
		section.emptyText

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
		'\t\t\t\t\t\t\t{:else}',
		`\t\t\t\t\t\t\t\t<p data-text="muted">${emptyText}</p>`,
		'\t\t\t\t\t\t\t{/if}',
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
	const query = renderQuery(section.selection, [])
	const targetEntity = fieldDefinition.entityType
	if (targetEntity == null)
		return []
	const targetEntityName = camel(targetEntity)
	if (entitySelectorOwnsField(entity, section.field)) {
		const selectorExpression = fieldExpression('selection.entitySelector', section.field)
		const hrefExpression = renderEntityHrefExpression(indexes, targetEntity, selectorExpression)

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
	const hrefExpression = renderEntityHrefExpression(indexes, targetEntity, `${targetEntityName}.entitySelector`)
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
		`${'\t'.repeat(referenceLevel + 1)}selection={select(EntityType.${targetEntity}, ${targetEntityName}.entitySelector)}`,
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
	const query = renderQuery(section.selection, [])
	const targetEntity = fieldDefinition.entityType
	if (targetEntity == null)
		return []
	const hrefExpression = renderCollectionHrefExpression(entity, indexes, section.field, targetEntity)
	const titleLabel = section.label ?? labelForField(fieldDefinition)
	const titleExpression = section.titleField == null ?
		undefined
	:
		`String(${fieldExpression('entity', section.titleField)} ?? ${q(titleLabel)})`

	return [
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
}

const renderItemRawExpression = (source: string, entityValueName = 'item') => source
	.replace(/item\.entitySelector(?:\.[A-Za-z_$][\w$]*)+/g, (selectorPath) => selectorPath
		.slice('item.entitySelector.'.length)
		.split('.')
		.reduce((expression, part) => `${expression}${propertyAccess(part)}`, `${entityValueName}.entitySelector`)
	)
	.replace(/\bitem\b/g, entityValueName)
	.replace(/\b([A-Za-z_$][\w$]*)\[([^\[\]\n]+)\]/g, '$1[String($2)]')

const renderFilterCondition = (
	filter: NonNullable<_ListView['filters']>[number],
	entityValueName: string
) => {
	const value = filter.selectorPath
		.split('.')
		.reduce((expression, part) => `${expression}${propertyAccess(part)}`, `${entityValueName}.entitySelector`)
	if (filter.compare === 'timeInterval')
		return `(${filter.prop} == null || (${value}.unit === ${filter.prop}.unit && ${value}.value === ${filter.prop}.value))`

	return `(${filter.prop} == null || ${value} === ${filter.prop})`
}

const renderPluralRowItems = (
	entity: Entity,
	indexes: AppIndexes,
	viewEntries: readonly _ViewItem[],
	entityFieldsExpression: string,
	level: number
) => viewEntries.flatMap((viewEntry, viewEntryIndex) => {
	if (typeof viewEntry === 'object' && 'kind' in viewEntry && viewEntry.kind === _ViewItemKind.Text)
		return [`${'\t'.repeat(level)}${svelteText(viewEntry.value ?? viewEntry.label)}`]

	const fieldName = itemFieldName(viewEntry)[0]
	if (fieldName == null)
		return []

	const fieldValueName = `${localIdentifier(fieldName)}${viewEntryIndex}`
	const fieldDefinition = fieldDefinitionByName(entity, fieldName)
	if (fieldDefinition?.type === EntityFieldType.EntityReference && fieldDefinition.entityType != null) {
		const targetEntity = indexes.entityByType.get(fieldDefinition.entityType)
		if (targetEntity == null)
			return []

		const hrefExpression = renderEntityHrefExpression(indexes, fieldDefinition.entityType, fieldValueName)
		return [
			`${'\t'.repeat(level)}{@const ${fieldValueName} = ${fieldExpression(entityFieldsExpression, fieldName)}}`,
			`${'\t'.repeat(level)}{#if ${fieldValueName} != null}`,
			`${'\t'.repeat(level + 1)}<${singularComponentIdentifier(fieldDefinition.entityType)}`,
			renderSvelteAttribute(level + 2, 'selection', `select(EntityType.${fieldDefinition.entityType}, ${fieldValueName})`),
			...(hrefExpression == null ? [] : [
				renderSvelteAttribute(level + 2, 'href', hrefExpression),
			]),
			`${'\t'.repeat(level + 2)}layout={EntityLayout.Title}`,
			`${'\t'.repeat(level + 2)}open={false}`,
			`${'\t'.repeat(level + 1)}/>`,
			`${'\t'.repeat(level)}{/if}`,
		]
	}

	return [
		`${'\t'.repeat(level)}{@const ${fieldValueName} = ${fieldExpression(entityFieldsExpression, fieldName)}}`,
		...(typeof viewEntry === 'object' && 'prefix' in viewEntry && viewEntry.prefix != null ? [`${'\t'.repeat(level)}${svelteText(viewEntry.prefix).trimEnd()}`] : []),
		...renderValueMarkup(entity, indexes, viewEntry, fieldName, fieldValueName, entityFieldsExpression, level),
		...(typeof viewEntry === 'object' && 'suffix' in viewEntry && viewEntry.suffix != null ? [`${'\t'.repeat(level)}${svelteText(viewEntry.suffix).trimEnd()}`] : []),
	]
})

const renderPluralRowAfterItems = (
	entity: Entity,
	indexes: AppIndexes,
	viewEntries: readonly _ViewItem[],
	entityFieldsExpression: string,
	level: number
) => viewEntries.flatMap((viewEntry, viewEntryIndex) => {
	const fieldName = itemFieldName(viewEntry)[0]
	if (fieldName == null)
		return []

	const fieldValueName = `${localIdentifier(fieldName)}After${viewEntryIndex}`
	const fieldDefinition = fieldDefinitionByName(entity, fieldName)
	if (fieldDefinition?.type === EntityFieldType.EntityReference && fieldDefinition.entityType != null) {
		const targetEntity = indexes.entityByType.get(fieldDefinition.entityType)
		if (targetEntity == null)
			return []

		const hrefExpression = renderEntityHrefExpression(indexes, fieldDefinition.entityType, fieldValueName)
		return [
			`${'\t'.repeat(level)}{@const ${fieldValueName} = ${fieldExpression(entityFieldsExpression, fieldName)}}`,
			`${'\t'.repeat(level)}{#if ${fieldValueName} != null}`,
			`${'\t'.repeat(level + 1)}<span data-text="muted">`,
			`${'\t'.repeat(level + 2)}<${singularComponentIdentifier(fieldDefinition.entityType)}`,
			renderSvelteAttribute(level + 3, 'selection', `select(EntityType.${fieldDefinition.entityType}, ${fieldValueName})`),
			...(hrefExpression == null ? [] : [
				renderSvelteAttribute(level + 3, 'href', hrefExpression),
			]),
			`${'\t'.repeat(level + 3)}layout={EntityLayout.Title}`,
			`${'\t'.repeat(level + 3)}open={false}`,
			`${'\t'.repeat(level + 2)}/>`,
			`${'\t'.repeat(level + 1)}</span>`,
			`${'\t'.repeat(level)}{/if}`,
		]
	}

	return [
		`${'\t'.repeat(level)}{@const ${fieldValueName} = ${fieldExpression(entityFieldsExpression, fieldName)}}`,
		`${'\t'.repeat(level)}{#if ${fieldValueName} != null}`,
		`${'\t'.repeat(level + 1)}<span data-text="muted">`,
		...(typeof viewEntry === 'object' && 'prefix' in viewEntry && viewEntry.prefix != null ? [`${'\t'.repeat(level + 2)}${svelteText(viewEntry.prefix).trimEnd()}`] : []),
		...renderValueMarkup(entity, indexes, viewEntry, fieldName, fieldValueName, entityFieldsExpression, level + 2),
		...(typeof viewEntry === 'object' && 'suffix' in viewEntry && viewEntry.suffix != null ? [`${'\t'.repeat(level + 2)}${svelteText(viewEntry.suffix).trimEnd()}`] : []),
		`${'\t'.repeat(level + 1)}</span>`,
		`${'\t'.repeat(level)}{/if}`,
	]
})

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
		`src/views/${view.component}.svelte`,
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
				`import ${targetIdentifier} from '$/views/${targetComponent}.svelte'`,
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
	const singularName = singularComponentIdentifier(entity.entityType)
	const entityValueName = camel(entity.entityType)
	const entityValuesName = camel(componentName.replace(/View$/, ''))
	const uniqueEntityValuesName = `unique${pascal(entityValuesName)}`
	const pluralView = entity.pluralView
	const row = pluralView?.row
	const rowTitleItems = viewItems(row?.title)
	const rowValueItems = viewItems(row?.value)
	const rowAfterItems = viewItems(row?.HeadingAfter)
	const rowItems = [
		...rowTitleItems,
		...rowValueItems,
		...rowAfterItems,
	]
	const itemLayout = 'EntityLayout.Summary'
	const rowQueryFields = unique((
		rowItems.length === 0 ?
			[
				...viewItems(entity.singularView?.summary?.icon),
				...summarySerialItems(entity),
				...viewItems(entity.singularView?.summary?.title),
				...viewItems(entity.singularView?.summary?.value),
				...viewItems(entity.singularView?.summary?.titleFallback),
				...viewItems(entity.singularView?.summary?.HeadingAfter),
			]
		:
			rowItems
	).flatMap((item) => itemFieldName(item)))
	const query = renderQuery(pluralView?.query?.selection ?? pluralView?.query, rowQueryFields)
	const filters = pluralView?.filters ?? []
	const showsList = pluralView?.content == null
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
	const rawSnippetsUseBase = rawSnippets.some((snippet) => snippet.raw.includes('base +'))
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
	const usesRowView = row != null
	const usesRawSelect = rawSnippets.some((snippet) => snippet.raw.includes('select('))
	const rowUsesTimestamp = rowItems.some((item) => ['timestamp', 'dateTime'].includes(viewItemFormat(entity, indexes, item) ?? ''))
	const rowUsesNumberValue = rowItems.some((item) => ['currency', 'currencyScaled', 'number', 'numberValue', 'percent'].includes(viewItemFormat(entity, indexes, item) ?? ''))
	const rowUsesTruncatedValue = rowItems.some((item) => ['truncated', 'namespaceReference', 'url'].includes(viewItemFormat(entity, indexes, item) ?? ''))
	const rowUsesMarkdown = rowItems.some((item) => viewItemFormat(entity, indexes, item) === 'markdown')
	const rowReferenceEntityTypes = unique(rowItems.flatMap((item) => {
		const fieldName = itemFieldName(item)[0]
		const fieldDefinition = fieldName == null ? undefined : fieldDefinitionByName(entity, fieldName)
		return fieldDefinition?.type === EntityFieldType.EntityReference && fieldDefinition.entityType != null ?
			[fieldDefinition.entityType]
		:
			[]
	}))
	const sourceSelectionImports = !Array.isArray(sourceSelection) && sourceSelection?.name != null ?
		[
			`import { ${defaultSourcesName(sourceSelection)}, ${sourceSelectionByKeyName(sourceSelection)} } from '$/sources/$sourceSelections.ts'`,
		]
	:
		[]
	const selectedSources = !Array.isArray(sourceSelection) && sourceSelection?.name != null && filters.length > 0 ?
		[
			`const selectedSources = $derived(${sourceSelectionByKeyName(sourceSelection)}[[${filters.map((filter) => `String(${filter.prop})`).join(', ')}].join(':')] ?? ${defaultSourcesName(sourceSelection)})`,
		]
	:
		[]
	const childSelection = `select(EntityType.${entity.entityType}, ${entityValueName}.entitySelector)`
	const renderedQuery = selectedSources.length === 0 ? query : renderObject([
		['sources', 'selectedSources'],
		['count', 'true'],
	])
	const entityHrefs = indexes.entityHrefsByType.get(entity.entityType) ?? []
	const itemLinkHrefExpression = pluralView?.itemLink == null ?
		undefined
	:
		renderRouteResolveExpression(
			pluralView.itemLink.route,
			Object.entries(pluralView.itemLink.params).map(([param, value]) => [
				param,
				`String(${renderItemRawExpression(value.replace(/^encodeURIComponent\((.*)\)$/, '$1'), entityValueName)})`,
			])
		)
	const entityHrefImports = !showsList || itemLinkHrefExpression != null ? [] : Array.from(
		entityHrefs
			.flatMap((href) => href.params)
			.reduce((imports, param) => expressionImports(param.value, imports), new Map<string, Set<string>>())
			.entries()
	)
	const entityHrefExpression = itemLinkHrefExpression ?? renderEntityHrefExpression(indexes, entity.entityType, `({ ...${entityValueName}.entitySelector, ...${entityValueName} })`)
	const script = [
		'// Types/constants',
		'import type { ComponentProps } from \'svelte\'',
		...(rawSnippetsUseBase ? ['import { base } from \'$app/paths\''] : []),
		...((showsList && (entityHrefExpression != null || itemLinkHrefExpression != null)) || rawSnippets.some((snippet) => snippet.raw.includes('resolve(')) ? ['import { resolve } from \'$app/paths\''] : []),
		...(showsList ? ['import type { SubscribeEntityReferenceResult } from \'$/client/$client.svelte.ts\''] : []),
		'import type { EntityProxyEntitiesResource } from \'$/client/$proxy.svelte.ts\'',
		'import type { WithRest } from \'$/typescript/WithRest.ts\'',
		...(rawSnippets.some((snippet) => snippet.raw.includes('stringify(')) ? ['import { stringify } from \'devalue\''] : []),
		...(showsList || rawSnippets.some((snippet) => snippet.raw.includes('EntityMetaKey.')) ? ['import { EntityMetaKey } from \'$/schema/$schema.ts\''] : []),
		'import { EntityType } from \'$/schema/EntityType.ts\'',
		'import { schema } from \'$/schema/index.ts\'',
		...entityHrefImports.map(([from, names]) => renderImport({
			from,
			names: [...names],
		})),
		...(renderedQuery.includes('Source.') || childSelection.includes('Source.') ? ['import { Source } from \'$/sources/Source.ts\''] : []),
		...renderImportObject(pluralView?.imports).map((spec) => renderImport(spec)),
		...sourceSelectionImports,
		'',
		'',
		...(usesRowView ? (usesRawSelect || rowReferenceEntityTypes.length > 0 ? [
			'// Context',
			'import { select } from \'$/routes/+layout.svelte\'',
			'',
			'',
		] : []) : [
			'// Context',
			'import { select } from \'$/routes/+layout.svelte\'',
			'',
			'',
		]),
		'// State',
		'let {',
		'\tselection,',
		`\ttitle = ${q(pluralView?.title ?? sentenceStart(entity.labelPlural))},`,
		`\ttypeAnnotationParagraphs = ${defaultTypeAnnotationParagraphs},`,
		`\tplaceholderText = ${q(`Loading ${sentenceStart(entity.labelPlural)}...`)},`,
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
		...(showsList || rawSnippets.some((snippet) => snippet.raw.includes('<ResourceBoundary')) ? ['import ResourceBoundary from \'$/components/ResourceBoundary.svelte\''] : []),
		...(showsList && rowUsesMarkdown ? ['import Markdown from \'$/components/Markdown.svelte\''] : []),
		...(showsList && rowUsesNumberValue ? ['import NumberValue from \'$/components/NumberValue.svelte\''] : []),
		...(showsList && rowUsesTimestamp ? ['import Timestamp from \'$/components/Timestamp.svelte\''] : []),
		...(showsList && rowUsesTruncatedValue ? ['import TruncatedValue from \'$/components/TruncatedValue.svelte\''] : []),
		...(!showsList ? [] : [
			usesRowView ?
				'import EntityView, { EntityLayout } from \'$/components/EntityView.svelte\''
			:
				'import { EntityLayout } from \'$/components/EntityView.svelte\'',
			...(usesRowView ? [] : [`import ${singularName} from '$/views/${singularComponentName(entity.entityType)}.svelte'`]),
			...rowReferenceEntityTypes.map((entityType) => `import ${singularComponentIdentifier(entityType)} from '$/views/${singularComponentName(entityType)}.svelte'`),
		]),
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
		...(!showsList ? [] : [
			'{#if open}',
			'\t<ResourceBoundary',
			renderSvelteAttribute(
				2,
				'resource',
				renderedQuery === '{}' ?
					'selection'
				:
					`selection.sources == null ? selection(${renderedQuery}) : selection`
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
			`\t\t\t\ttotalCount={${entityValuesName}.values.length === ${uniqueEntityValuesName}.length && ${entityValuesName}.totalCount != null && ${entityValuesName}.totalCount >= ${uniqueEntityValuesName}.length ? ${entityValuesName}.totalCount : ${uniqueEntityValuesName}.length}`,
			`\t\t\t\tgetKey={(${entityValueName}) => ${entityValueName}[EntityMetaKey.SelectorKey]}`,
			`\t\t\t\titems={${uniqueEntityValuesName}}`,
			'\t\t\t>',
			'\t\t\t\t{#snippet Empty()}',
			'\t\t\t\t\t{#if emptyText != null}',
			'\t\t\t\t\t\t<p data-text="muted">{emptyText}</p>',
			'\t\t\t\t\t{:else}',
			`\t\t\t\t\t\t<p data-text="muted">No ${svelteText(entity.labelPlural)} yet.</p>`,
			'\t\t\t\t\t{/if}',
			'\t\t\t\t{/snippet}',
			'',
			`\t\t\t\t{#snippet Item({ item: ${entityValueName} }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.${entity.entityType}> })}`,
			...(pluralView?.itemConstants ?? []).map((itemConstant) => `\t\t\t\t\t{@const ${itemConstant.name} = ${renderItemRawExpression(itemConstant.value, entityValueName)}}`),
			...(usesRowView ? [
				'\t\t\t\t\t<EntityView',
				`\t\t\t\t\t\tentityType={EntityType.${entity.entityType}}`,
				`\t\t\t\t\t\tentitySelector={${entityValueName}.entitySelector}`,
				...(entityHrefExpression == null ? [] : [
					renderSvelteAttribute(6, 'href', entityHrefExpression),
				]),
				`\t\t\t\t\t\tlayout={${itemLayout}}`,
				'\t\t\t\t\t\topen={false}',
				'\t\t\t\t\t>',
				...(rowTitleItems.length === 0 ? [] : [
					'\t\t\t\t\t\t{#snippet Title()}',
				...renderPluralRowItems(entity, indexes, rowTitleItems, `({ ...${entityValueName}.entitySelector, ...${entityValueName} })`, 7),
					'\t\t\t\t\t\t{/snippet}',
				]),
				...(rowValueItems.length === 0 ? [] : [
					'\t\t\t\t\t\t{#snippet Value()}',
				...renderPluralRowItems(entity, indexes, rowValueItems, `({ ...${entityValueName}.entitySelector, ...${entityValueName} })`, 7),
					'\t\t\t\t\t\t{/snippet}',
				]),
				...(rowAfterItems.length === 0 ? [] : [
					'\t\t\t\t\t\t{#snippet HeadingAfter()}',
				...renderPluralRowAfterItems(entity, indexes, rowAfterItems, `({ ...${entityValueName}.entitySelector, ...${entityValueName} })`, 7),
					'\t\t\t\t\t\t{/snippet}',
				]),
				'\t\t\t\t\t</EntityView>',
			] : [
				`\t\t\t\t\t<${singularName}`,
				...(entityHrefExpression == null ? [] : [
					renderSvelteAttribute(6, 'href', entityHrefExpression),
				]),
				renderSvelteAttribute(6, 'selection', childSelection),
				`\t\t\t\t\t\tprefetched={${entityValueName}}`,
				`\t\t\t\t\t\tlayout={${itemLayout}}`,
				'\t\t\t\t\t\topen={false}',
				'\t\t\t\t\t/>',
			]),
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
		]),
		...(pluralView?.content == null ? [] : [
			'',
			...renderRawLines(pluralView.content.raw, 0),
		]),
	]

	return svelteFile(
		`src/views/${componentName}.svelte`,
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
				from: `$/views/${singularComponentName(entity.entityType)}.svelte`,
				defaultName: singularComponentIdentifier(entity.entityType),
			},
			{
				from: `$/views/${pluralComponentName(entity)}.svelte`,
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
	const pageSelectorDescendant = indexes.routeEntries.some((candidate) => (
		candidate.routePath.startsWith(`${entry.routePath}/`)
		&& candidate.files.some((candidateFile) => expressionUsesKind(candidateFile.collection?.source.selector, 'pageSelector'))
	))
	const shouldGenerateLayoutLoad = (
		routeFile.load != null
		&& pageSelectorDescendant
		&& !entry.files.some((candidate) => candidate.kind === _RouteFileKind.LayoutModule)
	)
	if (routeFile.kind === _RouteFileKind.PageModule)
		return [
			...(shouldGenerateLayoutLoad ? [renderPageModuleFile(layoutPath, routeFile, indexes)] : []),
			renderPageModuleFile(routePath, routeFile, indexes),
		]
	if (routeFile.kind === _RouteFileKind.Layout)
		return [renderLayoutFile(routePath, routeFile, indexes)]
	if (routeFile.kind === _RouteFileKind.Page) {
		const files = [
			...(shouldGenerateLayoutLoad ? [renderPageModuleFile(layoutPath, routeFile, indexes)] : []),
			renderPageFile(routePath, entry.routePath, routeFile, indexes),
		]
		if (routeFile.load != null)
			files.push(renderPageModuleFile(routePath.replace(/\+page\.svelte$/, '+page.ts'), routeFile, indexes))
		return files
	}
	if (routeFile.kind === _RouteFileKind.LayoutModule)
		return [tsFile(routePath, { body: ['export const ssr = false'] })]

	return []
})

const renderPageModuleFile = (routePath: string, routeFile: RouteFile, indexes: AppIndexes) => {
	if (routeFile.load == null)
		return tsFile(routePath, { body: ['export const load = () => ({})'] })

	const loadExpression = {
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
	const imports = expressionImports(loadExpression)
	const loadType = routePath.endsWith('+layout.ts') ? 'LayoutLoad' : 'PageLoad'
	const fieldsExpression = routeFile.load.selectorFields == null ?
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
	const entitySchemaName = `${routeFile.load.entity}Schema`
	const selectorName = `${camel(routeFile.load.entity)}Selector`
	const returnEntries: [string, string | undefined][] = [
		['selector', selectorName],
		[
			'title',
			routeFile.load.title == null ?
				undefined
			:
				renderExpression(routeFile.load.title, {
					params: 'params',
					fields: selectorName,
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
				...Array.from(imports).map(([from, names]) => ({
					from,
					names: [...names],
				})),
				{
					from: '$/schema/$schema.ts',
					names: ['parseEntitySelector'],
				},
				{
					from: `$/schema/${routeFile.load.entity}.ts`,
					defaultName: entitySchemaName,
				},
				{
					from: '$/schema/index.ts',
					names: ['schema'],
				},
				{
					from: './$types',
					typeNames: [loadType],
				},
			],
			body: [
				`export const load: ${loadType} = ({ params }) => {`,
				`\tconst ${selectorName} = parseEntitySelector(`,
				'\t\tschema,',
				`\t\t${entitySchemaName},`,
				indent(fieldsExpression, 2),
				'\t)',
				`\tif (${selectorName} instanceof arktype.errors) error(404, ${q(`Invalid ${routeFile.load.entity} selector`)})`,
				'',
				'\treturn ' + indent(renderObject(returnEntries)).trimStart(),
				'}',
			],
		}
	)
}

const renderPageFile = (routePath: string, appRoutePath: string, routeFile: RouteFile, indexes: AppIndexes) => {
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
	const componentImports = unique([
		...(component == null || componentFile == null ? [] : [`import ${component} from '$/views/${componentFile}.svelte'`]),
		...(collectionComponent == null || collectionComponentFile == null ? [] : [`import ${collectionComponent} from '$/views/${collectionComponentFile}.svelte'`]),
	])
	const title = routeFile.text?.title ?? routeFile.text?.label ?? (viewEntity == null ? collectionEntity == null ? 'Blockhead' : indexes.entityByType.get(collectionEntity)?.labelPlural : indexes.entityByType.get(viewEntity)?.label)
	const collectionQuery = routeFile.collection == null ? undefined : renderQuery(routeFile.collection.query, [])
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
		routeFile.load != null
		|| routeFile.view?.entity != null
		|| expressionUsesKind(routeFile.collection?.source.selector, 'pageSelector')
	)
	const viewContentUsesParams = routeFile.view?.Content?.raw.includes('params') === true
	const hasPageProps = usesData || collectionUsesParams || viewContentUsesParams
	const selectorExpression = 'data.selector'
	const routeFileUsesResolve = routeFile.view?.Content == null && (component != null && routeFile.view?.entity != null || routeFile.collection != null && collectionComponent != null)
	const routeFileUsesBase = routeFile.view?.Content?.raw.includes('base +') === true

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
				...renderImportObject(routeFile.view?.imports).map(renderImport),
				...(collectionQuery?.includes('Source.') ? [
					'import { Source } from \'$/sources/Source.ts\'',
				] : []),
				'',
				'',
				'// Context',
				...(routeFileUsesBase ? ['import { base } from \'$app/paths\''] : []),
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
					renderCollectionPageMarkup(routeFile, collectionComponent, collectionQuery ?? '{}', routeId(appRoutePath))
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
		renderSvelteAttribute(2, 'selection', renderEntityPageSelection(indexes.entityByType.get(routeFile.view.entity), routeFile.view.entity, selectorExpression)),
		'\t/>',
	]
}

const renderCollectionPageMarkup = (routeFile: RouteFile, collectionComponent: string | undefined, query: string, href: string) => {
	if (routeFile.collection == null || collectionComponent == null)
		return []

	const selector = renderExpression(routeFile.collection.source.selector, {
		pageSelector: 'data.selector',
		fields: 'data.selector',
		params: 'params',
	})
	const source = routeFile.collection.source

	return [
		`\t<${collectionComponent}`,
		renderSvelteAttribute(2, 'href', renderRouteResolveExpression(href, routeParamNames(href).map((param) => [param, `params.${param}`]))),
		`\t\ttitle=${q(routeFile.text?.title ?? routeFile.collection.text?.labelPlural ?? '')}`,
		renderSvelteAttribute(2, 'selection', fieldResourceExpression(`select(EntityType.${source.entity}, ${selector})`, source.field, routeFile.collection.entity, query)),
		`\t\tid=${q(`${collectionComponent}-page`)}`,
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
		const hrefExpression = routeFile.layout.href == null ?
			undefined
		:
			renderRouteResolveExpression(routeFile.layout.href, routeParamNames(routeFile.layout.href).map((param) => [param, `params.${param}`]))
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
					`import ${component} from '$/views/${componentFile}.svelte'`,
				],
				markup: [
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
	const stale = [
		...staleRouteModules,
		...staleViews,
		...staleSchemas,
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

const main = async () => {
	const command = process.argv[2] ?? 'check'
	const indexes = validateAndIndex(app)
	const files = deriveFiles(app, indexes)

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
