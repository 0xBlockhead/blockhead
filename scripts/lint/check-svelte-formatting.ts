import { readFileSync, writeFileSync } from 'node:fs'
import { readdir, stat } from 'node:fs/promises'
import { join, relative, resolve } from 'node:path'
import { type AST, parse } from 'svelte/compiler'
import ts from 'typescript'

type Edit = {
	start: number
	end: number
	replacement: string
}

type Failure = {
	file: string
	position: number
	message: string
}

const shouldFix = process.argv.includes('--fix')
const shouldSelfTest = process.argv.includes('--self-test')
const shouldCheckShorthandAttributes = shouldSelfTest || process.argv.includes('--shorthand-attributes')
const shouldCheckTopLevelSpacing = true
const shouldCheckSectionOrder = process.argv.includes('--section-order')
const shouldCheckConstPlacement = true
const shouldCheckScriptTrailingCommas = shouldSelfTest || process.argv.includes('--script-trailing-commas')
const root = process.cwd()

const parseTypeScript = (fileName: string, source: string) => {
	const absoluteFileName = resolve(fileName)
	const sourceFile = ts.createSourceFile(absoluteFileName, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
	const options = {
		noLib: true,
		noResolve: true,
		target: ts.ScriptTarget.Latest,
	}
	const program = ts.createProgram([absoluteFileName], options, {
		...ts.createCompilerHost(options),
		getSourceFile: (candidate) => candidate === absoluteFileName ? sourceFile : undefined,
	})

	return {
		diagnostics: program.getSyntacticDiagnostics(sourceFile),
		sourceFile,
	}
}

const allowedConstParents = new Set([
	'SnippetBlock',
	'IfBlock',
	'ElseBlock',
	'EachBlock',
	'ThenBlock',
	'CatchBlock',
	'SvelteFragment',
	'SvelteBoundary',
	'Component',
])

const sectionOrder = [
	'Polyfills',
	'Styles',
	'View transitions',
	'Types/constants',
	'Context',
	'State',
	'Inner context',
	'Functions',
	'Components',
	'Transitions/animations',
]

const layoutOnlySections = new Set([
	'Polyfills',
	'Styles',
	'View transitions',
])

const lineAndColumn = (text: string, position: number) => {
	const prefix = text.slice(0, position)
	const lines = prefix.split('\n')
	return {
		line: lines.length,
		column: lines[lines.length - 1].length + 1,
	}
}

const formatFailure = (failure: Failure, text: string) => {
	const position = lineAndColumn(text, failure.position)
	return `${failure.file}:${position.line}:${position.column} ${failure.message}`
}

const walk = (
	node: unknown,
	visit: (node: Record<string, unknown>, ancestors: Record<string, unknown>[]) => void,
	ancestors: Record<string, unknown>[] = []
) => {
	if (!node || typeof node !== 'object')
		return

	const record = node as Record<string, unknown>
	visit(record, ancestors)

	for (const value of Object.values(record)) {
		if (Array.isArray(value)) {
			for (const child of value)
				walk(child, visit, [...ancestors, record])
		} else if (value && typeof value === 'object') {
			walk(value, visit, [...ancestors, record])
		}
	}
}

const collectSvelteFiles = async (path: string): Promise<string[]> => {
	const entries = await readdir(path, { withFileTypes: true })
	const files: string[] = []

	for (const entry of entries) {
		if (entry.name === 'node_modules' || entry.name === '.svelte-kit')
			continue
		if (entry.name.endsWith('_') || entry.name.endsWith('__'))
			continue

		const childPath = join(path, entry.name)
		if (entry.isDirectory())
			files.push(...await collectSvelteFiles(childPath))
		else if (entry.isFile() && entry.name.endsWith('.svelte'))
			files.push(childPath)
	}

	return files.sort()
}

const applyEdits = (text: string, edits: Edit[]) => {
	let output = text
	for (const edit of edits.sort((a, b) => b.start - a.start))
		output = output.slice(0, edit.start) + edit.replacement + output.slice(edit.end)
	return output
}

const reportTypeScriptNode = (
	file: string,
	sourceFile: ts.SourceFile,
	offset: number,
	node: ts.Node,
	message: string,
	failures: Failure[]
) => {
	failures.push({
		file,
		position: offset + node.getStart(sourceFile),
		message,
	})
}

const removeTypeScriptTrailingComma = (edits: Edit[], offset: number, nodeArray: ts.NodeArray<ts.Node>) => {
	if (!nodeArray.hasTrailingComma || !nodeArray.length)
		return

	edits.push({
		start: offset + nodeArray.end - 1,
		end: offset + nodeArray.end,
		replacement: '',
	})
}

const checkTypeScriptNode = (
	file: string,
	sourceFile: ts.SourceFile,
	offset: number,
	node: ts.Node,
	failures: Failure[],
	edits: Edit[]
) => {
	if (
		ts.isCallExpression(node)
		&& node.arguments.hasTrailingComma
	) {
		reportTypeScriptNode(file, sourceFile, offset, node, 'Remove trailing comma from call arguments.', failures)
		removeTypeScriptTrailingComma(edits, offset, node.arguments)
	}

	if (
		ts.isNewExpression(node)
		&& node.arguments?.hasTrailingComma
	) {
		reportTypeScriptNode(file, sourceFile, offset, node, 'Remove trailing comma from constructor arguments.', failures)
		removeTypeScriptTrailingComma(edits, offset, node.arguments)
	}

	if (
		ts.isFunctionLike(node)
		&& node.parameters.hasTrailingComma
	) {
		reportTypeScriptNode(file, sourceFile, offset, node, 'Remove trailing comma from function parameters.', failures)
		removeTypeScriptTrailingComma(edits, offset, node.parameters)
	}

	if (
		(
			ts.isCallExpression(node)
			|| ts.isNewExpression(node)
			|| ts.isTaggedTemplateExpression(node)
			|| ts.isTypeReferenceNode(node)
			|| ts.isTypeQueryNode(node)
			|| ts.isImportTypeNode(node)
			|| ts.isExpressionWithTypeArguments(node)
		)
		&& node.typeArguments?.hasTrailingComma
	) {
		reportTypeScriptNode(file, sourceFile, offset, node, 'Remove trailing comma from type arguments.', failures)
		removeTypeScriptTrailingComma(edits, offset, node.typeArguments)
	}

	node.forEachChild((child) => checkTypeScriptNode(file, sourceFile, offset, child, failures, edits))
}

const checkScriptTypeScript = (file: string, text: string, failures: Failure[], edits: Edit[]) => {
	for (const match of text.matchAll(/<script\b[^>]*\blang=(['"])ts\1[^>]*>([\s\S]*?)<\/script>/g)) {
		const script = match[2]
		const offset = match.index + match[0].indexOf(script)
		const parsed = parseTypeScript(`${file}.${offset}.ts`, script)
		const sourceFile = parsed.sourceFile

		for (const diagnostic of parsed.diagnostics)
			failures.push({
				file,
				position: offset + (diagnostic.start ?? 0),
				message: ts.flattenDiagnosticMessageText(diagnostic.messageText, ' '),
			})

		checkTypeScriptNode(file, sourceFile, offset, sourceFile, failures, edits)
	}
}

const checkWhitespace = (file: string, text: string, failures: Failure[], edits: Edit[]) => {
	if (!text.endsWith('\n')) {
		failures.push({
			file,
			position: text.length,
			message: 'End file with a single line break.',
		})
		edits.push({
			start: text.length,
			end: text.length,
			replacement: '\n',
		})
	} else if (text.endsWith('\n\n')) {
		failures.push({
			file,
			position: text.length - 1,
			message: 'End file with a single line break.',
		})
		const finalBreaks = /\n+$/.exec(text)
		if (finalBreaks)
			edits.push({
				start: text.length - finalBreaks[0].length + 1,
				end: text.length,
				replacement: '',
			})
	}

	for (const match of text.matchAll(/[ \t]+$/gm)) {
		failures.push({
			file,
			position: match.index,
			message: 'Remove trailing whitespace.',
		})
		edits.push({
			start: match.index,
			end: match.index + match[0].length,
			replacement: '',
		})
	}

	for (const match of text.matchAll(/\n{4,}/g)) {
		failures.push({
			file,
			position: match.index,
			message: 'Use at most 3 consecutive line breaks.',
		})
		edits.push({
			start: match.index,
			end: match.index + match[0].length,
			replacement: '\n\n\n',
		})
	}
}

const checkScriptTagShape = (file: string, text: string, failures: Failure[], edits: Edit[]) => {
	for (const match of text.matchAll(/<script\b[^>]*>/g)) {
		const tag = match[0]
		if (
			/\bmodule\b/.test(tag)
			&& /\blang=(['"])ts\1/.test(tag)
			&& tag !== '<script module lang="ts">'
		) {
			failures.push({
				file,
				position: match.index,
				message: 'Use `<script module lang="ts">` for module scripts.',
			})
			edits.push({
				start: match.index,
				end: match.index + tag.length,
				replacement: '<script module lang="ts">',
			})
		}

		if (tag === "<script lang='ts'>") {
			failures.push({
				file,
				position: match.index,
				message: 'Use double quotes in `<script lang="ts">`.',
			})
			edits.push({
				start: match.index,
				end: match.index + tag.length,
				replacement: '<script lang="ts">',
			})
		}
	}
}

const checkTopLevelSpacing = (
	file: string,
	text: string,
	ast: AST.Root,
	failures: Failure[],
	edits: Edit[]
) => {
	const blocks = [
		...(ast.module ? [{
			name: '<script module lang="ts">',
			start: ast.module.start,
			end: ast.module.end,
		}] : []),
		...(ast.instance ? [{
			name: '<script lang="ts">',
			start: ast.instance.start,
			end: ast.instance.end,
		}] : []),
		...ast.fragment.nodes
			.filter((node) => !(
				node.type === 'Text'
				&& !node.data.trim()
			)),
		...(ast.css ? [{
			name: '<style>',
			start: ast.css.start,
			end: ast.css.end,
		}] : []),
	]
		.map((block) => ({
			name: 'name' in block ? block.name : block.type,
			start: block.start,
			end: block.end,
		}))
		.sort((a, b) => a.start - b.start)

	for (let index = 0; index < blocks.length - 1; index++) {
		const current = blocks[index]
		const next = blocks[index + 1]
		if (
			![
				'<script module lang="ts">',
				'<script lang="ts">',
				'Head',
				'<style>',
			].includes(current.name)
		) continue

		const between = text.slice(current.end, next.start)
		if (between !== '\n\n\n') {
			failures.push({
				file,
				position: current.end,
				message: `Use two blank lines after ${current.name}.`,
			})
			if (/^[\s]*$/.test(between))
				edits.push({
					start: current.end,
					end: next.start,
					replacement: '\n\n\n',
				})
		}
	}
}

const checkScriptSections = (
	file: string,
	text: string,
	ast: AST.Root,
	failures: Failure[]
) => {
	const body = ast.instance?.content.body
	if (!body)
		return

	const sectionComments = ast.comments
		.filter((comment) => text.slice(comment.start, comment.end).startsWith('// '))
		.filter((comment) => {
			const before = text.slice(0, comment.start)
			return before.lastIndexOf('<script') > before.lastIndexOf('</script>')
		})
		.map((comment) => ({
			name: comment.value.trim(),
			start: comment.start,
		}))
		.filter((comment) => sectionOrder.includes(comment.name))

	let lastIndex = -1
	for (const comment of sectionComments) {
		const index = sectionOrder.indexOf(comment.name)
		if (index < lastIndex)
			failures.push({
				file,
				position: comment.start,
				message: `Move // ${comment.name} earlier in <script lang="ts"> section order.`,
			})
		lastIndex = Math.max(lastIndex, index)

		if (
			layoutOnlySections.has(comment.name)
			&& !file.endsWith('/+layout.svelte')
		)
			failures.push({
				file,
				position: comment.start,
				message: `// ${comment.name} is only allowed in +layout.svelte.`,
			})
	}
}

const checkSvelteAst = (file: string, text: string, failures: Failure[], edits: Edit[]) => {
	let ast: AST.Root
	let skippedScriptAst = false
	try {
		ast = parse(text, {
			modern: true,
			filename: file,
		})
	} catch (error) {
		const masked = text.replace(
			/(<script\b[^>]*>)([\s\S]*?)(<\/script>)/g,
			(_match, open: string, body: string, close: string) => (
				open
				+ body.replace(/[^\n]/g, ' ')
				+ close
			)
		)

		try {
			ast = parse(masked, {
				modern: true,
				filename: file,
			})
			skippedScriptAst = true
		} catch {
			failures.push({
				file,
				position: 0,
				message: error instanceof Error ? error.message : String(error),
			})
			return
		}
	}

	if (shouldCheckTopLevelSpacing)
		checkTopLevelSpacing(file, text, ast, failures, edits)
	if (shouldCheckSectionOrder && !skippedScriptAst)
		checkScriptSections(file, text, ast, failures)

	walk(ast, (node, ancestors) => {
		if (
			shouldCheckShorthandAttributes
			&&
			node.type === 'Attribute'
			&& typeof node.name === 'string'
			&& /^[A-Za-z_$][\w$]*$/.test(node.name)
			&& (node.value as Record<string, unknown> | undefined)?.type === 'ExpressionTag'
			&& ((node.value as Record<string, unknown>).expression as Record<string, unknown> | undefined)?.type === 'Identifier'
			&& ((node.value as Record<string, unknown>).expression as Record<string, unknown>).name === node.name
			&& typeof node.start === 'number'
			&& typeof node.end === 'number'
			&& !text.slice(node.start, node.end).startsWith('{')
		) {
			failures.push({
				file,
				position: node.start,
				message: `Use shorthand attribute {${node.name}}.`,
			})
			edits.push({
				start: node.start,
				end: node.end,
				replacement: `{${node.name}}`,
			})
		}

		const parent = ancestors.at(-1)
		const grandparent = ancestors.at(-2)
		if (
			shouldCheckConstPlacement
			&&
			node.type === 'ConstTag'
			&& parent
			&& typeof node.start === 'number'
			&& !allowedConstParents.has(String(parent.type))
			&& !(
				parent.type === 'Fragment'
				&& grandparent
				&& allowedConstParents.has(String(grandparent.type))
			)
		)
			failures.push({
				file,
				position: node.start,
				message: '{@const} must be an immediate child of an allowed Svelte block or component.',
			})

		if (
			!skippedScriptAst
			&&
			node.type === 'LabeledStatement'
			&& (node.label as Record<string, unknown> | undefined)?.name === '$'
			&& typeof node.start === 'number'
		)
			failures.push({
				file,
				position: node.start,
				message: 'Use Svelte 5 runes instead of legacy `$:` reactive statements.',
			})

		if (
			!skippedScriptAst
			&&
			node.type === 'ImportDeclaration'
			&& (node.source as Record<string, unknown> | undefined)?.value === 'svelte'
			&& typeof node.start === 'number'
			&& (node.specifiers as Record<string, unknown>[] | undefined)?.some((specifier) => (
				(specifier.imported as Record<string, unknown> | undefined)?.name === 'onMount'
			))
		)
			failures.push({
				file,
				position: node.start,
				message: 'Use Svelte 5 runes instead of onMount.',
			})

		if (
			!skippedScriptAst
			&&
			node.type === 'ImportDeclaration'
			&& (node.source as Record<string, unknown> | undefined)?.value === 'svelte/store'
			&& typeof node.start === 'number'
			&& (node.specifiers as Record<string, unknown>[] | undefined)?.some((specifier) => (
				(specifier.imported as Record<string, unknown> | undefined)?.name === 'writable'
			))
		)
			failures.push({
				file,
				position: node.start,
				message: 'Use Svelte 5 runes instead of writable stores.',
			})
	})
}

const checkFile = (file: string) => {
	const text = readFileSync(file, 'utf8')
	const failures: Failure[] = []
	const edits: Edit[] = []

	checkWhitespace(file, text, failures, edits)
	checkScriptTagShape(file, text, failures, edits)
	if (shouldCheckScriptTrailingCommas)
		checkScriptTypeScript(file, text, failures, edits)
	checkSvelteAst(file, text, failures, edits)

	if (shouldFix && edits.length)
		writeFileSync(file, applyEdits(text, edits))

	return {
		text,
		failures,
	}
}

const selfTest = () => {
	if (parseTypeScript('invalid.ts', 'const value =').diagnostics.length === 0)
		throw new Error('Missing embedded TypeScript syntax diagnostic')

	const cases = [
		{
			name: 'script trailing commas',
			input: '<script lang="ts">\nconst f = (x: number,) => x\nf(1,)\nnew Map([],)\nf<number,>(1)\n</script>\n',
			output: '<script lang="ts">\nconst f = (x: number) => x\nf(1)\nnew Map([])\nf<number>(1)\n</script>\n',
		},
		{
			name: 'shorthand attribute',
			input: '<script lang="ts">let foo = 1</script>\n\n\n<A foo={foo} />\n',
			output: '<script lang="ts">let foo = 1</script>\n\n\n<A {foo} />\n',
		},
		{
			name: 'top-level spacing',
			input: '<script lang="ts">let foo = 1</script>\n<A />\n',
			output: '<script lang="ts">let foo = 1</script>\n\n\n<A />\n',
		},
		{
			name: 'max line breaks',
			input: '<A />\n\n\n\n<B />\n',
			output: '<A />\n\n\n<B />\n',
		},
		{
			name: 'module script tag shape',
			input: '<script lang="ts" module>export const x = 1</script>\n',
			output: '<script module lang="ts">export const x = 1</script>\n',
		},
	]

	for (const testCase of cases) {
		const file = `<${testCase.name}>`
		const failures: Failure[] = []
		const edits: Edit[] = []
		checkWhitespace(file, testCase.input, failures, edits)
		checkScriptTagShape(file, testCase.input, failures, edits)
		if (shouldCheckScriptTrailingCommas)
			checkScriptTypeScript(file, testCase.input, failures, edits)
		checkSvelteAst(file, testCase.input, failures, edits)
		const output = applyEdits(testCase.input, edits)
		if (output !== testCase.output) {
			console.error(testCase.name)
			console.error(JSON.stringify(output))
			console.error(JSON.stringify(testCase.output))
			process.exit(1)
		}
	}
}

if (shouldSelfTest) {
	selfTest()
	process.exit(0)
}

const inputPaths = process.argv
	.slice(2)
	.filter((argument) => !argument.startsWith('--'))

const files = inputPaths.length ?
	(
		await Promise.all(inputPaths.map(async (inputPath) => {
			const path = inputPath.startsWith('/') ? inputPath : join(root, inputPath)
			const pathStat = await stat(path)
			if (pathStat.isDirectory())
				return collectSvelteFiles(path)
			return path.endsWith('.svelte') ? [path] : []
		}))
	).flat()
	:
	await collectSvelteFiles(join(root, 'src'))

const allFailures: string[] = []
for (const file of files) {
	const result = checkFile(file)
	for (const failure of result.failures)
		allFailures.push(formatFailure(
			{
				...failure,
				file: relative(root, failure.file),
			},
			result.text
		))
}

if (allFailures.length) {
	console.error(allFailures.join('\n'))
	if (!shouldFix)
		process.exit(1)
}
