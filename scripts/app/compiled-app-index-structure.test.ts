import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'

import ts from 'typescript'


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
	'sourceProviders',
	'sources',
])
const compilerOptions = {
	module: ts.ModuleKind.ESNext,
	noResolve: true,
	skipLibCheck: true,
	strict: true,
	target: ts.ScriptTarget.ESNext,
	types: [],
} as const satisfies ts.CompilerOptions
const syntheticSvelteFileName = path.join(process.cwd(), 'scripts/app/svelte-compiler.generated.d.ts')
const syntheticSvelteSource = `
	declare module 'svelte/compiler' {
		export const parse: (source: string) => unknown
	}
`
const sharedCompilerSourceFiles = new Map<string, ts.SourceFile>()

assert.ok(
	mode === 'self-test' || mode === 'product',
	'COMPILED_APP_INDEX_STRUCTURE_MODE must be self-test or product'
)

const analyzeRenderModule = (source: string, fileName = path.join(process.cwd(), 'scripts/app/render-fixture.ts')) => {
	const normalizedFileName = path.resolve(fileName)
	const compilerHost = ts.createCompilerHost(compilerOptions)
	const getSourceFile = compilerHost.getSourceFile.bind(compilerHost)
	compilerHost.fileExists = (candidate) => (
		path.resolve(candidate) === normalizedFileName
		|| path.resolve(candidate) === syntheticSvelteFileName
		|| ts.sys.fileExists(candidate)
	)
	compilerHost.readFile = (candidate) => (
		path.resolve(candidate) === normalizedFileName ?
			source
		: path.resolve(candidate) === syntheticSvelteFileName ?
			syntheticSvelteSource
		:
			ts.sys.readFile(candidate)
	)
	compilerHost.getSourceFile = (candidate, languageVersion, onError, shouldCreateNewSourceFile) => {
		if (path.resolve(candidate) === normalizedFileName)
			return ts.createSourceFile(candidate, source, languageVersion, true, ts.ScriptKind.TS)
		if (path.resolve(candidate) === syntheticSvelteFileName)
			return ts.createSourceFile(candidate, syntheticSvelteSource, languageVersion, true, ts.ScriptKind.TS)

		const cached = sharedCompilerSourceFiles.get(candidate)
		if (cached != null)
			return cached

		const loaded = getSourceFile(candidate, languageVersion, onError, shouldCreateNewSourceFile)
		if (loaded != null)
			sharedCompilerSourceFiles.set(candidate, loaded)

		return loaded
	}
	const program = ts.createProgram([
		normalizedFileName,
		syntheticSvelteFileName,
	], compilerOptions, compilerHost)
	const sourceFile = program.getSourceFile(normalizedFileName)
	assert.ok(sourceFile)
	const checker = program.getTypeChecker()
	const findings: Finding[] = []
	const addFinding = (node: ts.Node, reason: string) => {
		findings.push({
			line: sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1,
			reason,
		})
	}
	const isExported = (node: ts.Node) => ts.canHaveModifiers(node)
		&& ts.getModifiers(node)?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword) === true
	const unwrapExpression = (expression: ts.Expression): ts.Expression => {
		if (
			ts.isParenthesizedExpression(expression)
			|| ts.isAsExpression(expression)
			|| ts.isSatisfiesExpression(expression)
			|| ts.isNonNullExpression(expression)
			|| ts.isTypeAssertionExpression(expression)
		)
			return unwrapExpression(expression.expression)

		return expression
	}
	const constantString = (expression: ts.Expression, seen = new Set<ts.Symbol>()): string | undefined => {
		const unwrapped = unwrapExpression(expression)
		if (ts.isStringLiteralLike(unwrapped))
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
			const declaration = symbol.valueDeclaration
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
			if (!(
				ts.isStringLiteral(node.moduleSpecifier)
				&& node.moduleSpecifier.text === 'svelte/compiler'
				&& importClause?.isTypeOnly === false
				&& importClause.name == null
				&& namedBindings != null
				&& ts.isNamedImports(namedBindings)
				&& namedBindings.elements.length === 1
				&& namedBindings.elements[0]?.propertyName?.text === 'parse'
				&& namedBindings.elements[0].name.text === 'parseSvelte'
			))
				addFinding(node, 'renderer import is outside the explicit parseSvelte allowlist')
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

		ts.forEachChild(node, visitCapabilities)
	}
	visitCapabilities(sourceFile)

	const imports = sourceFile.statements.filter(ts.isImportDeclaration)
	if (imports.length !== 1)
		addFinding(sourceFile, 'renderer must have exactly one static import')

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
					&& declaration.name.text === 'renderGeneratedFile'
					&& declaration.initializer != null
					&& (ts.isArrowFunction(declaration.initializer) || ts.isFunctionExpression(declaration.initializer))
				)
					runtimeExports.push({
						declaration: declaration.initializer,
						name: declaration.name,
					})
				else
					addFinding(declaration, 'renderer exports a runtime value other than renderGeneratedFile')
			}
	}
	if (runtimeExports.length !== 1)
		addFinding(sourceFile, 'renderer must export exactly one renderGeneratedFile runtime value')
	if (JSON.stringify(exportedTypeNames.toSorted()) !== JSON.stringify([...rendererTypeNames].toSorted()))
		addFinding(sourceFile, 'renderer must explicitly export only the generated-file IR type aliases')

	const visitedIrAliases = new Set<ts.TypeAliasDeclaration>()
	const visitIrType = (node: ts.Node, ownerName: string) => {
		if (
			ts.isPropertySignature(node)
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
			const declaration = symbol?.declarations?.find(ts.isTypeAliasDeclaration)
			if (declaration != null) {
				if (!rendererTypeNames.has(declaration.name.text))
					addFinding(node, `${ownerName} reaches non-IR alias ${declaration.name.text}`)
				if (!visitedIrAliases.has(declaration)) {
					visitedIrAliases.add(declaration)
					visitIrType(declaration.type, declaration.name.text)
				}
			}
		}

		ts.forEachChild(node, (child) => visitIrType(child, ownerName))
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
		const variants = declaredType.isUnion() ? declaredType.types : [declaredType]
		const actualVariants = variants.map((variant) => (
			(variant.flags & ts.TypeFlags.StringLike) !== 0 ?
				[]
			:
				checker.getPropertiesOfType(variant)
					.map((property) => property.name)
					.toSorted()
		))
		if (JSON.stringify(actualVariants) !== JSON.stringify(expectedVariants))
			addFinding(declaration, `${typeName} does not match the purpose-lowered IR shape`)
	}

	const generatedFileDeclaration = localTypeAliases.get('GeneratedFile')
	const generatedFileSymbol = generatedFileDeclaration == null ? undefined : checker.getSymbolAtLocation(generatedFileDeclaration.name)
	for (const runtimeExport of runtimeExports) {
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
		if (signature == null || (checker.getReturnTypeOfSignature(signature).flags & ts.TypeFlags.StringLike) === 0)
			addFinding(runtimeExport.declaration, 'renderer must return only serialized text')
	}

	const functionBySymbol = new Map<ts.Symbol, ts.FunctionLikeDeclaration>()
	const variableBySymbol = new Map<ts.Symbol, ts.VariableDeclaration>()
	const collectDeclarations = (node: ts.Node) => {
		if (
			(ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isArrowFunction(node))
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

		ts.forEachChild(node, collectDeclarations)
	}
	collectDeclarations(sourceFile)
	const resolveObjectLiteral = (
		expression: ts.Expression,
		seen = new Set<ts.Symbol>()
	): ts.ObjectLiteralExpression | undefined => {
		const unwrapped = unwrapExpression(expression)
		if (ts.isObjectLiteralExpression(unwrapped))
			return unwrapped
		if (ts.isIdentifier(unwrapped)) {
			const symbol = checker.getSymbolAtLocation(unwrapped)
			if (symbol == null || seen.has(symbol))
				return undefined

			seen.add(symbol)
			const declaration = symbol.valueDeclaration
			return declaration != null && ts.isVariableDeclaration(declaration) && declaration.initializer != null ?
				resolveObjectLiteral(declaration.initializer, seen)
			:
				undefined
		}

		return undefined
	}
	const resolveFunction = (expression: ts.Expression, seen = new Set<ts.Symbol>()): ts.FunctionLikeDeclaration | undefined => {
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
				const candidateName = ts.isComputedPropertyName(candidate.name) ?
					constantString(candidate.name.expression)
				: ts.isIdentifier(candidate.name) || ts.isStringLiteralLike(candidate.name) ?
					candidate.name.text
				:
					undefined
				return candidateName === propertyName
			})
			if (property != null && ts.isMethodDeclaration(property))
				return property
			if (property != null && ts.isPropertyAssignment(property))
				return resolveFunction(property.initializer, seen)
			if (property != null && ts.isShorthandPropertyAssignment(property))
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
			const declaration = symbol.valueDeclaration
			if (declaration != null && ts.isBindingElement(declaration)) {
				const variableDeclaration = declaration.parent.parent
				if (ts.isVariableDeclaration(variableDeclaration) && variableDeclaration.initializer != null) {
					const propertyName = declaration.propertyName == null ?
						(ts.isIdentifier(declaration.name) ? declaration.name.text : undefined)
					: ts.isIdentifier(declaration.propertyName) || ts.isStringLiteralLike(declaration.propertyName) ?
						declaration.propertyName.text
					:
						undefined
					const objectLiteral = resolveObjectLiteral(variableDeclaration.initializer)
					const property = propertyName == null ? undefined : objectLiteral?.properties.find((candidate) => (
						(ts.isIdentifier(candidate.name) || ts.isStringLiteralLike(candidate.name))
						&& candidate.name.text === propertyName
					))
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
				const declaration = checker.getSymbolAtLocation(node.typeName)?.declarations?.find(ts.isTypeAliasDeclaration)
				if (declaration != null && !rendererTypeNames.has(declaration.name.text))
					addFinding(node, `renderer call graph reaches semantic alias ${declaration.name.text}`)
			}
			if (ts.isComputedPropertyName(node))
				addFinding(node, 'renderer call graph constructs a computed-key aggregate')
			if (
				(ts.isPropertyAssignment(node) || ts.isShorthandPropertyAssignment(node))
				&& semanticPropertyNames.has(node.name.getText(sourceFile).replaceAll(/['"]/g, ''))
			)
				addFinding(node, `renderer call graph reconstructs semantic property ${node.name.getText(sourceFile)}`)

			ts.forEachChild(node, visitReachable)
		}
		visitReachable(reachableFunction)
	}

	return [...new Map(findings.map((finding) => [`${finding.line}:${finding.reason}`, finding])).values()]
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

test('rejects all seven renderer capability bypass classes', {
	skip: mode !== 'self-test',
}, () => {
	const rejectedFixtures = [
		{
			source: `${validIr}\nexport const semanticIndex = new Map()\nexport const renderGeneratedFile = (file: GeneratedFile) => file.path`,
			reasons: [/runtime value other than renderGeneratedFile/],
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
		const helpers = {
			serialize(file: GeneratedFile) {
				return [file].map((item) => item.path).join('')
			},
		}
		const { serialize: alias } = helpers
		export const renderGeneratedFile = (file: GeneratedFile) => alias(file) + String(parseSvelte)
	`), [])
})

test('product compiler exports only generated-file IR and renderer has no semantic capability', {
	skip: mode !== 'product',
}, () => {
	const rendererPath = path.join(process.cwd(), 'scripts/app/render.ts')
	const generatorPath = path.join(process.cwd(), 'scripts/app/generate.ts')
	const generator = readFileSync(generatorPath, 'utf8')
	const generatorSourceFile = ts.createSourceFile(generatorPath, generator, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
	const compiledAppDeclaration = generatorSourceFile.statements.find((statement): statement is ts.TypeAliasDeclaration => (
		ts.isTypeAliasDeclaration(statement) && statement.name.text === 'CompiledApp'
	))

	assert.deepEqual(
		analyzeRenderModule(readFileSync(rendererPath, 'utf8'), rendererPath),
		[],
		'Renderer module exceeds the generated-file serialization capability'
	)
	assert.ok(compiledAppDeclaration)
	assert.doesNotMatch(compiledAppDeclaration.type.getText(generatorSourceFile), /CompiledAppFacts|Entity|Route|Source|Provider|Binding|Index/)
	const compiledAppType = ts.isTypeReferenceNode(compiledAppDeclaration.type)
		&& compiledAppDeclaration.type.typeArguments?.length === 1 ?
		compiledAppDeclaration.type.typeArguments[0]
	:
		compiledAppDeclaration.type
	assert.ok(ts.isTypeLiteralNode(compiledAppType))
	assert.deepEqual(
		[...compiledAppType.members]
			.filter(ts.isPropertySignature)
			.map((property) => property.name.getText(generatorSourceFile)),
		['generatedFiles']
	)
	assert.match(generator, /from '\.\/render\.ts'/)
	assert.match(generator, /generatedFiles: lowerGeneratedFiles\(loweringInput\)/)
	assert.match(generator, /const files = compileApp\(app\)\.generatedFiles/)
	assert.doesNotMatch(generator, /compileApp\(app\)\.renderPlan/)
})
