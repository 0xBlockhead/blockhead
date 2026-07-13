import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'

const typeScript = (await import('typescript')).default
const usesLegacyCompilerApi = Number(typeScript.versionMajorMinor.split('.')[0]) < 7
const typeScriptAst = usesLegacyCompilerApi ? typeScript : await import('typescript/unstable/ast')

const files = execFileSync(
	'rg',
	[
		'--files',
		'-g',
		'*.ts',
		'-g',
		'*.svelte.ts',
	],
	{ encoding: 'utf8' },
)
	.trim()
	.split('\n')
	.filter((file) => (
		file
		&& !file.split('/').some((part) => part.endsWith('_') || part.endsWith('__'))
	))

const failures = []
const shouldFix = process.argv.includes('--fix')
const api = usesLegacyCompilerApi ? undefined : new (await import('typescript/unstable/sync')).API()
const snapshot = api?.updateSnapshot({
	openFiles: files,
})

const report = (file, lineAndCharacter, message) => {
	failures.push(`${file}:${lineAndCharacter.line + 1}:${lineAndCharacter.character + 1} ${message}`)
}

const reportNode = (file, sourceFile, node, message) => {
	report(file, sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)), message)
}

const getLineAndCharacterOfPosition = (text, position) => {
	const lines = text.slice(0, position).split('\n')

	return {
		line: lines.length - 1,
		character: lines.at(-1).length,
	}
}

const removeTrailingComma = (edits, nodeArray) => {
	if (!nodeArray.hasTrailingComma || !nodeArray.length) return

	edits.push({
		start: nodeArray.end - 1,
		end: nodeArray.end,
		replacement: '',
	})
}

const checkNode = (file, sourceFile, node) => {
	const edits = editsByFile.get(file)
	if (
		typeScriptAst.isCallExpression(node)
		&& node.arguments.hasTrailingComma
	) {
		reportNode(file, sourceFile, node, 'Remove trailing comma from call arguments.')
		if (edits) removeTrailingComma(edits, node.arguments)
	}

	if (
		typeScriptAst.isNewExpression(node)
		&& node.arguments?.hasTrailingComma
	) {
		reportNode(file, sourceFile, node, 'Remove trailing comma from constructor arguments.')
		if (edits) removeTrailingComma(edits, node.arguments)
	}

	if (
		'parameters' in node
		&& node.parameters?.hasTrailingComma
	) {
		reportNode(file, sourceFile, node, 'Remove trailing comma from function parameters.')
		if (edits) removeTrailingComma(edits, node.parameters)
	}

	if (
		'typeArguments' in node
		&& node.typeArguments?.hasTrailingComma
	) {
		reportNode(file, sourceFile, node, 'Remove trailing comma from type arguments.')
		if (edits) removeTrailingComma(edits, node.typeArguments)
	}

	node.forEachChild((child) => checkNode(file, sourceFile, child))
}

const editsByFile = new Map()

for (const file of files) {
	let text
	try {
		text = readFileSync(file, 'utf8')
	} catch {
		failures.push(`${file}:1:1 Unable to read file.`)
		continue
	}
	const edits = []
	if (shouldFix) editsByFile.set(file, edits)

	if (!text.endsWith('\n')) {
		failures.push(`${file}:1:1 End file with a single line break.`)
		if (shouldFix) edits.push({
			start: text.length,
			end: text.length,
			replacement: '\n',
		})
	} else if (text.endsWith('\n\n')) {
		failures.push(`${file}:1:1 End file with a single line break.`)
		if (shouldFix) {
			const match = /\n+$/.exec(text)
			edits.push({
				start: text.length - match[0].length + 1,
				end: text.length,
				replacement: '',
			})
		}
	}

	const excessiveLineBreaks = /\n{4,}/.exec(text)
	if (excessiveLineBreaks) {
		report(file, getLineAndCharacterOfPosition(text, excessiveLineBreaks.index), 'Use at most 3 consecutive line breaks.')
		if (shouldFix) {
			for (const match of text.matchAll(/\n{4,}/g))
				edits.push({
					start: match.index,
					end: match.index + match[0].length,
					replacement: '\n\n\n',
				})
		}
	}

	for (const match of text.matchAll(/[ \t]+$/gm)) {
		report(file, getLineAndCharacterOfPosition(text, match.index), 'Remove trailing whitespace.')
		if (shouldFix) edits.push({
			start: match.index,
			end: match.index + match[0].length,
			replacement: '',
		})
	}

	const project = snapshot?.getDefaultProjectForFile(file)
	const sourceFile = usesLegacyCompilerApi ?
		typeScript.createSourceFile(
			file,
			text,
			typeScript.ScriptTarget.Latest,
			true,
			typeScript.ScriptKind.TS,
		)
		:
		project?.program.getSourceFile(file)
	if (!sourceFile) {
		failures.push(`${file}:1:1 Unable to parse file.`)
		continue
	}

	if (usesLegacyCompilerApi) {
		for (const diagnostic of sourceFile.parseDiagnostics)
			report(
				file,
				sourceFile.getLineAndCharacterOfPosition(diagnostic.start ?? 0),
				typeScript.flattenDiagnosticMessageText(diagnostic.messageText, ' '),
			)
	} else {
		for (const diagnostic of project.program.getSyntacticDiagnostics(file))
			report(file, sourceFile.getLineAndCharacterOfPosition(diagnostic.pos), diagnostic.text)
	}

	checkNode(file, sourceFile, sourceFile)

	if (shouldFix && edits.length) {
		let fixedText = text
		for (const edit of edits.sort((a, b) => b.start - a.start))
			fixedText = fixedText.slice(0, edit.start) + edit.replacement + fixedText.slice(edit.end)

		writeFileSync(file, fixedText)
	}
}

snapshot?.dispose()
api?.close()

if (failures.length) {
	console.error(failures.join('\n'))
	if (!shouldFix) process.exitCode = 1
}
