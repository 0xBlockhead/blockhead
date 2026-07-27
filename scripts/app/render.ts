import { parse as parseSvelte } from 'svelte/compiler'
import ts from 'typescript'


export type ImportName = string | {
	readonly name: string
	readonly alias: string
}
export type ImportPlan = {
	readonly from: string
	readonly defaultName?: string
	readonly names?: readonly ImportName[]
	readonly typeNames?: readonly ImportName[]
}
export type TypeScriptFilePlan = {
	readonly imports?: readonly ImportPlan[]
	readonly body: readonly string[]
}
export type SvelteFilePlan = {
	readonly moduleScript?: readonly string[]
	readonly script?: readonly string[]
	readonly head?: readonly string[]
	readonly markup?: readonly string[]
	readonly style?: readonly string[]
}
export type GeneratedFile =
	| {
			readonly path: string
			readonly kind: 'ts'
			readonly ast: TypeScriptFilePlan
		}
	| {
			readonly path: string
			readonly kind: 'svelte'
			readonly ast: SvelteFilePlan
		}
	| {
			readonly path: string
			readonly kind: 'text'
			readonly body: readonly string[]
		}

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

const generatedHeader = '// Generated from APP.ts. Do not edit by hand.'
const generatedSvelteHeader = '<!-- Generated from APP.ts. Do not edit by hand. -->'
const indent = (source: string, level = 1) => source
	.split('\n')
	.map((line) => line === '' ? line : `${'\t'.repeat(level)}${line}`)
	.join('\n')
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
const generatedImportSpecFrom = (spec: ImportPlan) => {
	const schemaMatch = spec.from.match(/^\$\/schema\/([^/]+)\.ts$/)
	if (schemaMatch?.[1] != null && [
		spec.defaultName,
		...(spec.names ?? []).map(importNameKey),
		...(spec.typeNames ?? []).map(importNameKey),
	].some((name) => name?.startsWith(`_${schemaMatch[1]}`)))
		return `$/schema/_${schemaMatch[1]}.ts`

	return spec.from
}
const quote = (value: string) => `'${JSON.stringify(value)
	.slice(1, -1)
	.replaceAll("'", "\\'")
	.replaceAll('\\"', '"')}'`
const renderImport = (spec: ImportPlan) => {
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

	return `import ${typeOnlyImport ? 'type ' : ''}${importClause} from ${quote(generatedImportSpecFrom(spec))}`
}
const mergeImports = (imports: readonly ImportPlan[]) => {
	const merged = new Map<string, {
		from: string
		defaultName?: string
		names: ImportName[]
		typeNames: ImportName[]
	}>()
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

		if (
			existing.defaultName != null
			&& spec.defaultName != null
			&& existing.defaultName !== spec.defaultName
		)
			throw new Error(`${from} has conflicting default imports ${existing.defaultName} and ${spec.defaultName}`)
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
const svelteLineIndent = (line: string) => line.match(/^\t*/)?.[0].length ?? 0
const shouldSeparateSvelteSiblings = (line: string, nextLine: string) => {
	if (line === '' || nextLine === '' || svelteLineIndent(line) !== svelteLineIndent(nextLine))
		return false

	const trimmed = line.trim()
	const nextTrimmed = nextLine.trim()
	if (nextTrimmed.startsWith('{:'))
		return false

	return (
		(trimmed.startsWith('</') || trimmed.startsWith('{/') || trimmed.endsWith('/>'))
		&& (nextTrimmed.startsWith('<') || nextTrimmed.startsWith('{#'))
	)
}
const separateSvelteSiblingLines = (source: readonly string[]) => source.flatMap((line, index) => [
	line,
	...(shouldSeparateSvelteSiblings(line, source[index + 1] ?? '') ? [''] : []),
])

export const renderGeneratedFile = (generatedFile: GeneratedFile) => {
	const content = (
		generatedFile.kind === 'ts' ?
			[
				generatedHeader,
				'',
				...mergeImports(generatedFile.ast.imports ?? []).map(renderImport),
				...(generatedFile.ast.imports == null || generatedFile.ast.imports.length === 0 ? [] : ['']),
				...generatedFile.ast.body,
			].join('\n')
		: generatedFile.kind === 'text' ?
			generatedFile.body.join('\n')
		:
			[
				generatedSvelteHeader,
				'',
				...(generatedFile.ast.moduleScript == null ? [] : [
					'<script module lang="ts">',
					indent(generatedFile.ast.moduleScript.join('\n')),
					'</script>',
					'',
					'',
				]),
				...(generatedFile.ast.script == null ? [] : [
					'<script lang="ts">',
					indent(generatedFile.ast.script.join('\n')),
					'</script>',
					'',
					'',
				]),
				...(generatedFile.ast.head == null ? [] : [
					'<svelte:head>',
					indent(generatedFile.ast.head.join('\n')),
					'</svelte:head>',
					'',
					'',
				]),
				...separateSvelteSiblingLines(generatedFile.ast.markup ?? []),
				...(generatedFile.ast.style == null ? [] : [
					'',
					'',
					'<style>',
					indent(generatedFile.ast.style.join('\n')),
					'</style>',
				]),
			].join('\n')
	)

	if (generatedFile.kind === 'svelte') {
		parseSvelte(content)
		if (/\{@const\s+[^=]+=\s+\(\{\s*\.\.\./.test(content))
			throw new Error(`${generatedFile.path} contains a parenthesized object-spread {@const} expression`)
	}

	return content.endsWith('\n') ? content : `${content}\n`
}
