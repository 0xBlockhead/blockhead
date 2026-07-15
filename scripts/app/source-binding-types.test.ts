import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import {
	mkdtempSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import test from 'node:test'
import ts from 'typescript'

const runTypeScript = (entryFile: string, listFiles = false) => spawnSync(
	process.execPath,
	[
		'--max-old-space-size=1024',
		join(process.cwd(), 'node_modules/typescript/bin/tsc'),
		'--ignoreConfig',
		'--noEmit',
		...(listFiles ? ['--listFiles'] : []),
		'--allowImportingTsExtensions',
		'--skipLibCheck',
		'--module',
		'preserve',
		'--moduleResolution',
		'bundler',
		'--target',
		'esnext',
		entryFile,
	],
	{
		cwd: process.cwd(),
		encoding: 'utf8',
	}
)

const appSource = readFileSync('APP.ts', 'utf8')
const appSourceFile = ts.createSourceFile(
	'APP.ts',
	appSource,
	ts.ScriptTarget.Latest,
	true,
	ts.ScriptKind.TS
)
const defineSourcesStatement = appSourceFile.statements.find((statement) => (
	ts.isVariableStatement(statement)
	&& statement.declarationList.declarations.some((declaration) => (
		ts.isIdentifier(declaration.name)
		&& declaration.name.text === 'defineSources'
	))
))

assert.ok(defineSourcesStatement)

test('rejects incompatible source binding declarations at compile time', () => {
	const temporaryDirectory = mkdtempSync(join(tmpdir(), 'blockhead-source-binding-types-'))
	const fixtureSource = readFileSync('scripts/app/source-binding-types.types.ts', 'utf8')
	const fixtureSourceFile = ts.createSourceFile(
		'source-binding-types.types.ts',
		fixtureSource,
		ts.ScriptTarget.Latest,
		true,
		ts.ScriptKind.TS
	)
	const fixtureImport = fixtureSourceFile.statements.find(ts.isImportDeclaration)

	assert.ok(fixtureImport)

	try {
		const fixturePath = join(temporaryDirectory, 'source-binding-types.types.ts')
		writeFileSync(fixturePath, `${appSource.slice(0, defineSourcesStatement.end)}\n${fixtureSource.slice(fixtureImport.end)}`)
		const result = runTypeScript(fixturePath, true)

		assert.equal(result.status, 0, result.stderr || result.stdout)
		const listedFiles = result.stdout.split('\n')
		assert.equal(listedFiles.includes(join(process.cwd(), 'APP.ts')), false)
		assert.equal(listedFiles.includes(join(process.cwd(), 'APP.sources.ts')), false)
		assert.equal(listedFiles.includes(fixturePath), true)
	} finally {
		rmSync(temporaryDirectory, {
			force: true,
			recursive: true,
		})
	}
})

test('type-checks the actual APP Envio and GetBlock EVM execution rows', () => {
	const sourceDefinitionBySource = new Map<string, ts.ObjectLiteralExpression>()
	const visit = (node: ts.Node) => {
		if (ts.isObjectLiteralExpression(node)) {
			const sourceProperty = node.properties.find((property) => (
				ts.isPropertyAssignment(property)
				&& property.name.getText(appSourceFile) === 'source'
			))
			if (
				sourceProperty != null
				&& ts.isPropertyAssignment(sourceProperty)
				&& ts.isPropertyAccessExpression(sourceProperty.initializer)
				&& (
					sourceProperty.initializer.name.text === 'EnvioHyperRpc_JsonRpc'
					|| sourceProperty.initializer.name.text === 'GetBlockRpc_JsonRpc'
					|| sourceProperty.initializer.name.text === 'GetBlockYellowstone_Grpc'
				)
				&& node.properties.some((property) => (
					ts.isPropertyAssignment(property)
					&& property.name.getText(appSourceFile) === 'binding'
				))
			)
				sourceDefinitionBySource.set(sourceProperty.initializer.name.text, node)
		}

		ts.forEachChild(node, visit)
	}
	visit(appSourceFile)

	assert.deepEqual([...sourceDefinitionBySource.keys()].sort(), [
		'EnvioHyperRpc_JsonRpc',
		'GetBlockRpc_JsonRpc',
		'GetBlockYellowstone_Grpc',
	])

	const temporaryDirectory = mkdtempSync(join(tmpdir(), 'blockhead-source-bindings-'))
	const fixturePath = join(temporaryDirectory, 'actual-app-source-bindings.ts')
	try {
		writeFileSync(fixturePath, `${appSource.slice(0, defineSourcesStatement.end)}

defineSources([
	{
		provider: 'Envio',
		label: 'Envio',
	},
	{
		provider: 'GetBlock',
		label: 'GetBlock',
	},
])([
${sourceDefinitionBySource.get('EnvioHyperRpc_JsonRpc')?.getText(appSourceFile)},
${sourceDefinitionBySource.get('GetBlockRpc_JsonRpc')?.getText(appSourceFile)},
${sourceDefinitionBySource.get('GetBlockYellowstone_Grpc')?.getText(appSourceFile)},
])
`)

		const result = runTypeScript(fixturePath)
		assert.equal(result.status, 0, result.stderr || result.stdout)
		for (const sourceDefinition of [...sourceDefinitionBySource.values()].filter((definition) => !definition.getText(appSourceFile).includes('GetBlockYellowstone_Grpc'))) {
			const sourceDefinitionText = sourceDefinition.getText(appSourceFile)
			assert.doesNotMatch(sourceDefinitionText, /SourceArtifactKind\.HandwrittenTypes/)
			assert.match(sourceDefinitionText, /SourceArtifactKind\.OpenRpcSpec/)
			assert.match(sourceDefinitionText, /SourceArtifactKind\.GenerationManifest/)
			assert.match(sourceDefinitionText, /src\/sources\/_shared\/interfaces\/EvmExecutionJsonRpc\/OpenRpc\/src/)
			assert.match(sourceDefinitionText, /src\/sources\/_shared\/interfaces\/EvmExecutionJsonRpc\/OpenRpc\/schema-source\.ts/)
		}
	} finally {
		rmSync(temporaryDirectory, {
			force: true,
			recursive: true,
		})
	}
})
