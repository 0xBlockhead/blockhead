import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import {
	cpSync,
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import test from 'node:test'
import * as ts from '@typescript/native/unstable/ast'
import { API } from '@typescript/native/unstable/sync'

const runTypeScript = (entryFile: string, listFiles = false) => spawnSync(
	process.execPath,
	[
		'--max-old-space-size=1024',
		process.env.TSC_PATH ?? join(process.cwd(), 'node_modules/@typescript/native/bin/tsc'),
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
const typeScriptApi = new API()
const typeScriptSnapshot = typeScriptApi.updateSnapshot({
	openFiles: ['APP.ts'],
})
const appSourceFile = typeScriptSnapshot
	.getDefaultProjectForFile('APP.ts')
	?.program.getSourceFile('APP.ts')
assert.ok(appSourceFile)
test.after(() => {
	typeScriptSnapshot.dispose()
	typeScriptApi.close()
})
test('rejects incompatible source binding declarations at compile time', () => {
	const fixturePath = join(process.cwd(), 'scripts/app/source-binding-types.types.ts')
	const result = runTypeScript(fixturePath, true)

	assert.equal(result.status, 0, result.stderr || result.stdout)
	const listedFiles = result.stdout.split('\n')
	assert.equal(listedFiles.includes(join(process.cwd(), 'APP.ts')), false)
	assert.equal(listedFiles.includes(join(process.cwd(), 'APP.sources.ts')), false)
	assert.equal(listedFiles.includes(fixturePath), true)
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

		node.forEachChild(visit)
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
		mkdirSync(join(temporaryDirectory, 'scripts/app/inputs'), {
			recursive: true,
		})
		mkdirSync(join(temporaryDirectory, 'src/constants'), {
			recursive: true,
		})
		cpSync(
			join(process.cwd(), 'scripts/app/source.ts'),
			join(temporaryDirectory, 'scripts/app/source.ts')
		)
		cpSync(
			join(process.cwd(), 'scripts/app/inputs/source-target.ts'),
			join(temporaryDirectory, 'scripts/app/inputs/source-target.ts')
		)
		cpSync(
			join(process.cwd(), 'src/constants/Network.ts'),
			join(temporaryDirectory, 'src/constants/Network.ts')
		)
		writeFileSync(fixturePath, `import {
	ApiFamily,
	SourceArtifactKind,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	defineSources,
} from './scripts/app/source.ts'

enum Source {
	EnvioHyperRpc_JsonRpc = 'EnvioHyperRpc_JsonRpc',
	GetBlockRpc_JsonRpc = 'GetBlockRpc_JsonRpc',
	GetBlockYellowstone_Grpc = 'GetBlockYellowstone_Grpc',
}

enum SourceProvider {
	Envio = 'Envio',
	GetBlock = 'GetBlock',
}

defineSources<Source>()([
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
