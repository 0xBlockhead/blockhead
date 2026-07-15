import { parse as parseSvelte } from 'svelte/compiler'


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
const generatedImportFrom = (from: string) => from
const generatedImportSpecFrom = (spec: ImportPlan) => {
	const schemaMatch = spec.from.match(/^\$\/schema\/([^/]+)\.ts$/)
	if (schemaMatch?.[1] != null && [
		spec.defaultName,
		...(spec.names ?? []).map(importNameKey),
		...(spec.typeNames ?? []).map(importNameKey),
	].some((name) => name?.startsWith(`_${schemaMatch[1]}`)))
		return `$/schema/_${schemaMatch[1]}.ts`

	return generatedImportFrom(spec.from)
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
const parseScriptImport = (line: string): ImportPlan | undefined => {
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
		importSpec: ImportPlan
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
					indent(dedupeScriptImports(generatedFile.ast.script).join('\n')),
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
