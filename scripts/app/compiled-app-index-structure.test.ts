import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'

import * as ts from '@typescript/native/unstable/ast'
import { API, TypeFlags, type Symbol } from '@typescript/native/unstable/sync'


type Finding = {
	line: number
	reason: string
}

const mode = process.env.COMPILED_APP_INDEX_STRUCTURE_MODE ?? 'self-test'
const rendererTypeProperties = {
	GeneratedFile: [
		['ast', 'kind', 'path'],
		['ast', 'kind', 'path'],
		['body', 'kind', 'path'],
	],
	ImportName: [
		[],
		['alias', 'name'],
	],
	ImportPlan: [['defaultName', 'from', 'names', 'typeNames']],
	SvelteFilePlan: [['head', 'markup', 'moduleScript', 'script', 'style']],
	TypeScriptFilePlan: [['body', 'imports']],
} as const
const rendererTypeNames = new Set(Object.keys(rendererTypeProperties))
// These recursive values describe syntax to print, not compiled application facts.
const serializationTypeNames = new Set([
	...rendererTypeNames,
	'GeneratedTypeScriptValue',
	'TypeScriptEmission',
])
const semanticPropertyNames = new Set([
	'activeEntities',
	'bindings',
	'entities',
	'entityByType',
	'indexes',
	'providers',
	'routeNodes',
	'routes',
	'sourceBindings',
	'sourceClaims',
	'sourceAccountability',
	'sourceProviders',
	'sources',
])
const syntheticSvelteFileName = path.join(process.cwd(), 'scripts/app/svelte-compiler.generated.d.ts')
const syntheticSvelteSource = `
	declare module 'svelte/compiler' {
		export const parse: (source: string) => unknown
	}
`
// Analyze local contracts without loading APP.ts and the entire generated application.
const structuralConfigPath = path.join(process.cwd(), 'scripts/app/tsconfig.json')
const structuralConfig = (files: string[]) => JSON.stringify({
	compilerOptions: {
		target: 'ESNext',
		noResolve: true,
	},
	files,
})
assert.ok(
	mode === 'self-test' || mode === 'product',
	'COMPILED_APP_INDEX_STRUCTURE_MODE must be self-test or product'
)

const analyzeRenderModule = (source: string, fileName = path.join(process.cwd(), 'scripts/app/render-fixture.ts')) => {
	const normalizedFileName = path.resolve(fileName)
	const virtualSources = new Map([
		[normalizedFileName, source],
		[syntheticSvelteFileName, syntheticSvelteSource],
		[structuralConfigPath, structuralConfig([normalizedFileName, syntheticSvelteFileName])],
	])
	const api = new API({
		fs: {
			fileExists: (candidate) => virtualSources.has(path.resolve(candidate)) ? true : undefined,
			readFile: (candidate) => virtualSources.get(path.resolve(candidate)),
		},
	})
	const snapshot = api.updateSnapshot({
		openFiles: [normalizedFileName, syntheticSvelteFileName],
	})
	const project = snapshot.getDefaultProjectForFile(normalizedFileName)
	const sourceFile = project?.program.getSourceFile(normalizedFileName)
	assert.ok(sourceFile)
	assert.ok(project)
	const checker = project.checker
	const findings: Finding[] = []
	const addFinding = (node: ts.Node, reason: string) => {
		findings.push({
			line: sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1,
			reason,
		})
	}
	const isExported = (node: ts.Node) => (ts.isTypeAliasDeclaration(node) || ts.isVariableStatement(node))
		&& node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword) === true
	const unwrapExpression = (expression: ts.Expression): ts.Expression => {
		if (
			ts.isParenthesizedExpression(expression)
			|| ts.isAsExpression(expression)
			|| ts.isSatisfiesExpression(expression)
			|| ts.isNonNullExpression(expression)
			|| ts.isTypeAssertion(expression)
		)
			return unwrapExpression(expression.expression)

		return expression
	}
	const constantString = (expression: ts.Expression, seen = new Set<Symbol>()): string | undefined => {
		const unwrapped = unwrapExpression(expression)
		if (ts.isStringLiteralLikeNode(unwrapped))
			return unwrapped.text
		if (
			ts.isBinaryExpression(unwrapped)
			&& unwrapped.operatorToken.kind === ts.SyntaxKind.PlusToken
		) {
			const left = constantString(unwrapped.left, seen)
			const right = constantString(unwrapped.right, seen)
			return left == null || right == null ? undefined : left + right
		}
		if (ts.isIdentifier(unwrapped)) {
			const symbol = checker.getSymbolAtLocation(unwrapped)
			if (symbol == null || seen.has(symbol))
				return undefined

			seen.add(symbol)
			const declaration = symbol.valueDeclaration?.resolve(project)
			return declaration != null && ts.isVariableDeclaration(declaration) && declaration.initializer != null ?
				constantString(declaration.initializer, seen)
			:
				undefined
		}

		return undefined
	}
	const visitCapabilities = (node: ts.Node) => {
		if (ts.isImportDeclaration(node)) {
			const importClause = node.importClause
			const namedBindings = importClause?.namedBindings
			const isSvelteParserImport = (
				ts.isStringLiteral(node.moduleSpecifier)
				&& node.moduleSpecifier.text === 'svelte/compiler'
				&& importClause != null
				&& importClause.phaseModifier == null
				&& importClause.name == null
				&& namedBindings != null
				&& ts.isNamedImports(namedBindings)
				&& namedBindings.elements.length === 1
				&& namedBindings.elements[0]?.propertyName?.text === 'parse'
				&& namedBindings.elements[0].name.text === 'parseSvelte'
			)
			const isTypeScriptCompilerImport = ts.isStringLiteral(node.moduleSpecifier)
				&& node.moduleSpecifier.text === 'typescript'
			if (!isSvelteParserImport && !isTypeScriptCompilerImport)
				addFinding(node, 'renderer import is outside the syntax-parser/printer allowlist')
		}
		if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword)
			addFinding(node, 'renderer cannot use dynamic import')
		if (ts.isImportTypeNode(node))
			addFinding(node, 'renderer cannot use import types')
		if (ts.isImportEqualsDeclaration(node))
			addFinding(node, 'renderer cannot use import-equals')
		if (ts.isIdentifier(node) && ['Function', 'eval', 'require'].includes(node.text))
			addFinding(node, `renderer cannot reference ${node.text}`)
		if (
			ts.isPropertyAccessExpression(node)
			&& ['Function', 'eval', 'require'].includes(node.name.text)
		)
			addFinding(node, `renderer cannot access ${node.name.text}`)
		if (ts.isElementAccessExpression(node) && node.argumentExpression != null) {
			const capability = constantString(node.argumentExpression)
			if (capability != null && ['Function', 'eval', 'require'].includes(capability))
				addFinding(node, `renderer cannot access computed ${capability}`)
		}

		node.forEachChild(visitCapabilities)
	}
	visitCapabilities(sourceFile)

	const imports = sourceFile.statements.filter(ts.isImportDeclaration)
	if (imports.length < 1 || imports.length > 4)
		addFinding(sourceFile, 'renderer must have one to four allowlisted static imports')

	const localTypeAliases = new Map(
		sourceFile.statements
			.filter(ts.isTypeAliasDeclaration)
			.map((declaration) => [declaration.name.text, declaration])
	)
	const exportedTypeNames: string[] = []
	const runtimeExports: {
		declaration: ts.FunctionLikeDeclaration
		name: ts.Identifier
	}[] = []
	for (const statement of sourceFile.statements) {
		if (ts.isExportDeclaration(statement) || ts.isExportAssignment(statement))
			addFinding(statement, 'renderer cannot use export declarations or assignments')
		if (ts.isTypeAliasDeclaration(statement) && isExported(statement))
			exportedTypeNames.push(statement.name.text)
		if (
			isExported(statement)
			&& !ts.isTypeAliasDeclaration(statement)
			&& !ts.isVariableStatement(statement)
		)
			addFinding(statement, 'renderer exports a non-allowlisted declaration')
		if (ts.isVariableStatement(statement) && isExported(statement))
			for (const declaration of statement.declarationList.declarations) {
				if (
					ts.isIdentifier(declaration.name)
					&& declaration.initializer != null
					&& (ts.isArrowFunction(declaration.initializer) || ts.isFunctionExpression(declaration.initializer))
				)
					runtimeExports.push({
						declaration: declaration.initializer,
						name: declaration.name,
					})
				else if (declaration.initializer == null || !ts.isStringLiteralLikeNode(declaration.initializer))
					addFinding(declaration, 'renderer exports state instead of a serialization helper or literal header')
			}
	}
	if (runtimeExports.filter(({ name }) => name.text === 'renderGeneratedFile').length !== 1)
		addFinding(sourceFile, 'renderer must export exactly one renderGeneratedFile runtime value')
	if (exportedTypeNames.some((name) => !serializationTypeNames.has(name)))
		addFinding(sourceFile, 'renderer must export only serialization IR type aliases')

	const visitedIrAliases = new Set<ts.TypeAliasDeclaration>()
	const visitIrType = (node: ts.Node, ownerName: string) => {
		if (
			ts.isPropertySignatureDeclaration(node)
			&& node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ReadonlyKeyword) !== true
		)
			addFinding(node, `${ownerName} exposes a mutable property`)
		if (
			ts.isArrayTypeNode(node)
			&& (!ts.isTypeOperatorNode(node.parent) || node.parent.operator !== ts.SyntaxKind.ReadonlyKeyword)
		)
			addFinding(node, `${ownerName} exposes a mutable array`)
		if (ts.isTypeReferenceNode(node) && ts.isIdentifier(node.typeName)) {
			const symbol = checker.getSymbolAtLocation(node.typeName)
			const declaration = symbol?.declarations
				.map((candidate) => candidate.resolve(project))
				.find((candidate): candidate is ts.TypeAliasDeclaration => candidate != null && ts.isTypeAliasDeclaration(candidate))
			if (declaration != null) {
				if (!rendererTypeNames.has(declaration.name.text))
					addFinding(node, `${ownerName} reaches non-IR alias ${declaration.name.text}`)
				if (!visitedIrAliases.has(declaration)) {
					visitedIrAliases.add(declaration)
					visitIrType(declaration.type, declaration.name.text)
				}
			}
		}

		node.forEachChild((child) => visitIrType(child, ownerName))
	}
	for (const [typeName, expectedVariants] of Object.entries(rendererTypeProperties)) {
		const declaration = localTypeAliases.get(typeName)
		if (declaration == null) {
			addFinding(sourceFile, `renderer is missing local ${typeName} IR`)
			continue
		}

		visitIrType(declaration.type, typeName)
		const symbol = checker.getSymbolAtLocation(declaration.name)
		assert.ok(symbol)
		const declaredType = checker.getDeclaredTypeOfSymbol(symbol)
		const variants = declaredType.isUnionType() ? declaredType.getTypes() : [declaredType]
		const actualVariants = variants.map((variant) => (
			(variant.flags & TypeFlags.StringLike) !== 0 ?
				[]
			:
				checker.getPropertiesOfType(variant)
					.map((property) => property.name)
					.toSorted()
		))
		if (JSON.stringify(actualVariants) !== JSON.stringify(expectedVariants))
			addFinding(declaration, `${typeName} does not match the serialization-only IR shape`)
	}

	const generatedFileDeclaration = localTypeAliases.get('GeneratedFile')
	const generatedFileSymbol = generatedFileDeclaration == null ? undefined : checker.getSymbolAtLocation(generatedFileDeclaration.name)
	for (const runtimeExport of runtimeExports) {
		if (runtimeExport.name.text !== 'renderGeneratedFile')
			continue

		const parameter = runtimeExport.declaration.parameters[0]
		const parameterType = parameter?.type
		const parameterSymbol = parameterType != null && ts.isTypeReferenceNode(parameterType) && ts.isIdentifier(parameterType.typeName) ?
			checker.getSymbolAtLocation(parameterType.typeName)
		:
			undefined
		if (
			runtimeExport.declaration.parameters.length !== 1
			|| parameterType == null
			|| !ts.isTypeReferenceNode(parameterType)
			|| !ts.isIdentifier(parameterType.typeName)
			|| parameterSymbol !== generatedFileSymbol
		)
			addFinding(runtimeExport.declaration, 'renderer input must be the locally owned GeneratedFile IR symbol')

		const signature = checker.getSignatureFromDeclaration(runtimeExport.declaration)
		const returnType = signature == null ? undefined : checker.getReturnTypeOfSignature(signature)
		if (returnType == null || (returnType.flags & TypeFlags.StringLike) === 0)
			addFinding(runtimeExport.declaration, 'renderer must return only serialized text')
	}

	const functionBySymbol = new Map<Symbol, ts.FunctionLikeDeclaration>()
	const variableBySymbol = new Map<Symbol, ts.VariableDeclaration>()
	const collectDeclarations = (node: ts.Node) => {
		if (
			(ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node))
			&& node.name != null
			&& ts.isIdentifier(node.name)
		) {
			const symbol = checker.getSymbolAtLocation(node.name)
			if (symbol != null)
				functionBySymbol.set(symbol, node)
		}
		if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
			const symbol = checker.getSymbolAtLocation(node.name)
			if (symbol != null) {
				variableBySymbol.set(symbol, node)
				if (node.initializer != null && (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer)))
					functionBySymbol.set(symbol, node.initializer)
			}
		}

		node.forEachChild(collectDeclarations)
	}
	collectDeclarations(sourceFile)
	const resolveObjectLiteral = (
		expression: ts.Expression,
		seen = new Set<Symbol>()
	): ts.ObjectLiteralExpression | undefined => {
		const unwrapped = unwrapExpression(expression)
		if (ts.isObjectLiteralExpression(unwrapped))
			return unwrapped
		if (ts.isIdentifier(unwrapped)) {
			const symbol = checker.getSymbolAtLocation(unwrapped)
			if (symbol == null || seen.has(symbol))
				return undefined

			seen.add(symbol)
			const declaration = symbol.valueDeclaration?.resolve(project)
			return declaration != null && ts.isVariableDeclaration(declaration) && declaration.initializer != null ?
				resolveObjectLiteral(declaration.initializer, seen)
			:
				undefined
		}

		return undefined
	}
	const resolveFunction = (expression: ts.Expression, seen = new Set<Symbol>()): ts.FunctionLikeDeclaration | undefined => {
		const unwrapped = unwrapExpression(expression)
		if (ts.isArrowFunction(unwrapped) || ts.isFunctionExpression(unwrapped))
			return unwrapped
		if (
			ts.isPropertyAccessExpression(unwrapped)
			&& ['apply', 'bind', 'call'].includes(unwrapped.name.text)
		)
			return resolveFunction(unwrapped.expression, seen)
		if (ts.isPropertyAccessExpression(unwrapped) || ts.isElementAccessExpression(unwrapped)) {
			const propertyName = ts.isPropertyAccessExpression(unwrapped) ?
				unwrapped.name.text
			: unwrapped.argumentExpression == null ?
				undefined
			:
				constantString(unwrapped.argumentExpression)
			const objectLiteral = resolveObjectLiteral(unwrapped.expression)
			const property = propertyName == null ? undefined : objectLiteral?.properties.find((candidate) => {
				if (!('name' in candidate))
					return false
				const candidateName = ts.isComputedPropertyName(candidate.name) ?
					constantString(candidate.name.expression)
				: ts.isIdentifier(candidate.name) || ts.isStringLiteralLikeNode(candidate.name) ?
					candidate.name.text
				:
					undefined
				return candidateName === propertyName
			})
			if (property != null && ts.isMethodDeclaration(property))
				return property
			if (property != null && ts.isPropertyAssignment(property))
				return resolveFunction(property.initializer, seen)
			if (property != null && ts.isShorthandPropertyAssignment(property) && ts.isIdentifier(property.name))
				return resolveFunction(property.name, seen)
		}
		if (ts.isIdentifier(unwrapped)) {
			const symbol = checker.getSymbolAtLocation(unwrapped)
			if (symbol == null || seen.has(symbol))
				return undefined

			seen.add(symbol)
			const direct = functionBySymbol.get(symbol)
			if (direct != null)
				return direct
			const declaration = symbol.valueDeclaration?.resolve(project)
			if (declaration != null && ts.isBindingElement(declaration)) {
				const variableDeclaration = declaration.parent.parent
				if (ts.isVariableDeclaration(variableDeclaration) && variableDeclaration.initializer != null) {
					const propertyName = declaration.propertyName == null ?
						(declaration.name != null && ts.isIdentifier(declaration.name) ? declaration.name.text : undefined)
					: ts.isIdentifier(declaration.propertyName) || ts.isStringLiteralLikeNode(declaration.propertyName) ?
						declaration.propertyName.text
					:
						undefined
					const objectLiteral = resolveObjectLiteral(variableDeclaration.initializer)
					const property = propertyName == null ? undefined : objectLiteral?.properties.find((candidate) => {
						if (!('name' in candidate))
							return false
						return (ts.isIdentifier(candidate.name) || ts.isStringLiteralLikeNode(candidate.name))
							&& candidate.name.text === propertyName
					})
					if (property != null && ts.isMethodDeclaration(property))
						return property
					if (property != null && ts.isPropertyAssignment(property))
						return resolveFunction(property.initializer, seen)
				}
			}
			const initializer = variableBySymbol.get(symbol)?.initializer
			return initializer == null ? undefined : resolveFunction(initializer, seen)
		}

		return undefined
	}
	const reachableFunctions = new Set<ts.FunctionLikeDeclaration>(runtimeExports.map(({ declaration }) => declaration))
	for (const reachableFunction of reachableFunctions) {
		const visitReachable = (node: ts.Node) => {
			if (
				node !== reachableFunction
				&& (ts.isArrowFunction(node) || ts.isFunctionExpression(node))
			)
				reachableFunctions.add(node)
			if (ts.isCallExpression(node)) {
				const calledFunction = resolveFunction(node.expression)
				if (calledFunction != null)
					reachableFunctions.add(calledFunction)
			}
			if (ts.isTypeReferenceNode(node) && ts.isIdentifier(node.typeName)) {
				const declaration = checker.getSymbolAtLocation(node.typeName)?.declarations
					.map((candidate) => candidate.resolve(project))
					.find((candidate): candidate is ts.TypeAliasDeclaration => candidate != null && ts.isTypeAliasDeclaration(candidate))
				if (declaration != null && !serializationTypeNames.has(declaration.name.text))
					addFinding(node, `renderer call graph reaches semantic alias ${declaration.name.text}`)
			}
			if (ts.isComputedPropertyName(node))
				addFinding(node, 'renderer call graph constructs a computed-key aggregate')
			const accessedProperty = ts.isPropertyAccessExpression(node) ?
				node.name.text
			: ts.isElementAccessExpression(node) && node.argumentExpression != null ?
				constantString(node.argumentExpression)
			:
				undefined
			if (accessedProperty != null && semanticPropertyNames.has(accessedProperty))
				addFinding(node, `renderer call graph reads semantic property ${accessedProperty}`)
			if (
				(ts.isPropertyAssignment(node) || ts.isShorthandPropertyAssignment(node))
				&& semanticPropertyNames.has(node.name.getText(sourceFile).replaceAll(/['"]/g, ''))
			)
				addFinding(node, `renderer call graph reconstructs semantic property ${node.name.getText(sourceFile)}`)

			node.forEachChild(visitReachable)
		}
		visitReachable(reachableFunction)
	}

	const uniqueFindings = [...new Map(findings.map((finding) => [`${finding.line}:${finding.reason}`, finding])).values()]
	snapshot.dispose()
	api.close()
	return uniqueFindings
}

const validIr = `
	import { parse as parseSvelte } from 'svelte/compiler'
	export type ImportName = string | { readonly name: string, readonly alias: string }
	export type ImportPlan = { readonly from: string, readonly defaultName?: string, readonly names?: readonly ImportName[], readonly typeNames?: readonly ImportName[] }
	export type TypeScriptFilePlan = { readonly imports?: readonly ImportPlan[], readonly body: readonly string[] }
	export type SvelteFilePlan = { readonly moduleScript?: readonly string[], readonly script?: readonly string[], readonly head?: readonly string[], readonly markup?: readonly string[], readonly style?: readonly string[] }
	export type GeneratedFile =
		| { readonly path: string, readonly kind: 'ts', readonly ast: TypeScriptFilePlan }
		| { readonly path: string, readonly kind: 'svelte', readonly ast: SvelteFilePlan }
		| { readonly path: string, readonly kind: 'text', readonly body: readonly string[] }
`

test('rejects renderer capability bypasses and semantic-state exports', {
	skip: mode !== 'self-test',
}, () => {
	const rejectedFixtures = [
		{
			source: `${validIr}\nexport const semanticIndex = new Map()\nexport const renderGeneratedFile = (file: GeneratedFile) => file.path`,
			reasons: [/exports state/],
		},
		{
			source: `${validIr}\nexport const build = () => ({ indexes: new Map() })\nexport const renderGeneratedFile = (file: GeneratedFile) => file.path`,
			reasons: [/semantic property indexes/],
		},
		{
			source: `${validIr}\nconst serializer = (file: GeneratedFile) => file.path\nexport { serializer as renderGeneratedFile }`,
			reasons: [/export declarations or assignments/],
		},
		{
			source: `${validIr}\nconst key = 're' + 'quire'\nconst load = globalThis[key]\nexport const renderGeneratedFile = (file: GeneratedFile) => String(load(file.path))`,
			reasons: [/computed require/],
		},
		{
			source: `${validIr}\nconst load = Function('specifier', 'return import(specifier)')\nexport const renderGeneratedFile = (file: GeneratedFile) => String(load(file.path))`,
			reasons: [/reference Function/],
		},
		{
			source: `${validIr}\nconst load = eval\nexport const renderGeneratedFile = (file: GeneratedFile) => String(load(file.path))`,
			reasons: [/reference eval/],
		},
		{
			source: `${validIr.replace('readonly body: readonly string[] }', 'readonly body: HiddenLines }')}\ntype HiddenLines = string[]\nexport const renderGeneratedFile = (file: GeneratedFile) => file.path`,
			reasons: [
				/non-IR alias HiddenLines/,
				/mutable array/,
			],
		},
		{
			source: `${validIr}\ntype SemanticIndex = { readonly entities: readonly string[] }\nconst helpers = { build(file: GeneratedFile) { return [file].map((item) => ({ [Symbol.for('index')]: { entities: [item.path] } } as SemanticIndex))[0] } }\nconst { build: alias } = helpers\nexport const renderGeneratedFile = (file: GeneratedFile) => JSON.stringify(alias.call(undefined, file))`,
			reasons: [
				/semantic alias SemanticIndex/,
				/computed-key aggregate/,
				/semantic property entities/,
			],
		},
	]
	for (const fixture of rejectedFixtures) {
		const reasons = analyzeRenderModule(fixture.source).map((finding) => finding.reason)
		for (const expectedReason of fixture.reasons)
			assert.ok(reasons.some((reason) => expectedReason.test(reason)), `Missing ${expectedReason} for ${fixture.source}`)
	}
})

test('allows serialization-only IR helpers, aliases, and nested callbacks', {
	skip: mode !== 'self-test',
}, () => {
	assert.deepEqual(analyzeRenderModule(`${validIr}
		import ts from 'typescript'
		export const generatedHeader = '// Generated from APP.ts.'
		export const indent = (source: string) => '  ' + source
		const helpers = {
			serialize(file: GeneratedFile) {
				return [file].map((item) => item.path).join('')
			},
		}
		const { serialize: alias } = helpers
		export const renderGeneratedFile = (file: GeneratedFile) => alias(file) + String(parseSvelte)
	`), [])
})

test('product compiler separates source-claim analysis IR from renderer capability', {
	skip: mode !== 'product',
}, () => {
	const rendererPath = path.join(process.cwd(), 'scripts/app/render.ts')
	const generatorPath = path.join(process.cwd(), 'scripts/app/generate.ts')
	const renderer = readFileSync(rendererPath, 'utf8')
	const generator = readFileSync(generatorPath, 'utf8')
	const virtualSources = new Map([
		[rendererPath, renderer],
		[generatorPath, generator],
		[structuralConfigPath, structuralConfig([rendererPath, generatorPath])],
	])
	const api = new API({
		fs: {
			fileExists: (candidate) => virtualSources.has(path.resolve(candidate)) ? true : undefined,
			readFile: (candidate) => virtualSources.get(path.resolve(candidate)),
		},
	})
	const snapshot = api.updateSnapshot({ openFiles: [rendererPath, generatorPath] })
	const rendererSourceFile = snapshot.getDefaultProjectForFile(rendererPath)?.program.getSourceFile(rendererPath)
	const generatorSourceFile = snapshot.getDefaultProjectForFile(generatorPath)?.program.getSourceFile(generatorPath)
	assert.ok(rendererSourceFile)
	assert.ok(generatorSourceFile)
	const renderGeneratedFileDeclaration = rendererSourceFile.statements
		.filter(ts.isVariableStatement)
		.flatMap((statement) => statement.declarationList.declarations)
		.find((declaration) => ts.isIdentifier(declaration.name) && declaration.name.text === 'renderGeneratedFile')
	const compiledAppDeclaration = generatorSourceFile.statements.find((statement): statement is ts.TypeAliasDeclaration => (
		ts.isTypeAliasDeclaration(statement) && statement.name.text === 'CompiledApp'
	))
	const compiledSourceClaimDeclaration = generatorSourceFile.statements.find((statement): statement is ts.TypeAliasDeclaration => (
		ts.isTypeAliasDeclaration(statement) && statement.name.text === 'CompiledSourceClaim'
	))
	const compiledSourceAccountabilityDeclaration = generatorSourceFile.statements.find((statement): statement is ts.TypeAliasDeclaration => (
		ts.isTypeAliasDeclaration(statement) && statement.name.text === 'CompiledSourceAccountability'
	))

	assert.deepEqual(analyzeRenderModule(renderer, rendererPath), [])
	// Exercise the real renderer, not just synthetic fixtures: legitimate compiler
	// imports and extra serializer helpers must not open an application-state seam.
	for (const [addition, expectedReason] of [
		["\nimport { compileApp } from './generate.ts'", /syntax-parser\/printer allowlist/],
		['\nexport const leak = () => ({ indexes: new Map() })', /semantic property indexes/],
		['\nexport const leak = (app) => app["source" + "Claims"]', /reads semantic property sourceClaims/],
	] as const)
		assert.ok(analyzeRenderModule(renderer + addition, rendererPath)
			.some(({ reason }) => expectedReason.test(reason)), `Missing ${expectedReason}`)

	assert.ok(renderGeneratedFileDeclaration?.initializer != null && ts.isArrowFunction(renderGeneratedFileDeclaration.initializer))
	assert.equal(renderGeneratedFileDeclaration.initializer.parameters[0]?.type?.getText(rendererSourceFile), 'GeneratedFile')
	assert.ok(compiledAppDeclaration)
	assert.ok(compiledSourceClaimDeclaration)
	assert.ok(compiledSourceAccountabilityDeclaration)
	assert.doesNotMatch(compiledAppDeclaration.type.getText(generatorSourceFile), /CompiledAppFacts|Entity|Route|Provider|Binding|Index/)
	const compiledAppType = ts.isTypeReferenceNode(compiledAppDeclaration.type)
		&& compiledAppDeclaration.type.typeArguments?.length === 1 ?
		compiledAppDeclaration.type.typeArguments[0]
	:
		compiledAppDeclaration.type
	const compiledSourceClaimType = ts.isTypeReferenceNode(compiledSourceClaimDeclaration.type)
		&& compiledSourceClaimDeclaration.type.typeArguments?.length === 1 ?
		compiledSourceClaimDeclaration.type.typeArguments[0]
	:
		compiledSourceClaimDeclaration.type
	assert.ok(ts.isTypeLiteralNode(compiledAppType))
	assert.ok(ts.isTypeLiteralNode(compiledSourceClaimType))
	const compiledSourceAccountabilityType = ts.isTypeReferenceNode(compiledSourceAccountabilityDeclaration.type)
		&& compiledSourceAccountabilityDeclaration.type.typeArguments?.length === 1 ?
		compiledSourceAccountabilityDeclaration.type.typeArguments[0]
	:
		compiledSourceAccountabilityDeclaration.type
	assert.ok(ts.isTypeLiteralNode(compiledSourceAccountabilityType))
	assert.deepEqual(
		[...compiledAppType.members]
			.filter(ts.isPropertySignatureDeclaration)
			.map((property) => property.name.getText(generatorSourceFile)),
		// Public reporting products are intentional; CompiledAppFacts and its
		// entity/route/provider indexes remain compiler-private (asserted above).
		[
			'generatedFiles',
			'presentationManifest',
			'sourceClaims',
			'sourceAccountability',
			'observationTimeAccountability',
			'observationTimeWriterManifest',
		]
	)
	assert.deepEqual(
		[...compiledSourceClaimType.members]
			.filter(ts.isPropertySignatureDeclaration)
			.map((property) => property.name.getText(generatorSourceFile)),
		[
			'source',
			'entityType',
			'selectorName',
			'facetPath',
			'fieldName',
			'publicRoute',
		]
	)
	assert.deepEqual(
		[...compiledSourceAccountabilityType.members]
			.filter(ts.isPropertySignatureDeclaration)
			.map((property) => property.name.getText(generatorSourceFile)),
		[
			'claims',
			'mappedSelectors',
		]
	)
	assert.doesNotMatch(renderer, /CompiledSourceClaim|sourceClaims/)
	assert.match(generator, /from '\.\/render\.ts'/)
	assert.match(generator, /generatedFiles: generateFiles\(compiledApp\)/)
	assert.match(generator, /const sourceClaims = compileSourceClaims\(/)
	assert.match(generator, /sourceClaims,/)
	assert.match(generator, /const compiledApp = compileApp\(app\)/)
	assert.doesNotMatch(generator, /compileApp\(app\)\.renderPlan/)
	snapshot.dispose()
	api.close()
})
