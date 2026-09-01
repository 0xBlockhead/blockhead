import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import { runProcess } from './svelte-check.mjs'

const compileFixture = async (root, fixturePath) => {
	const configPath = `${fixturePath}.config.json`
	await fs.writeFile(configPath, `${JSON.stringify({
		extends: path.join(root, 'tsconfig.json'),
		compilerOptions: {
			noEmit: true,
			skipLibCheck: true,
			incremental: false,
		},
		files: [fixturePath],
		include: [],
	}, null, '\t')}\n`)
	const result = await runProcess({
		command: process.env.TSC_PATH ?? path.join(root, 'node_modules/@typescript/native/bin/tsc'),
		args: ['--project', configPath, '--extendedDiagnostics'],
		cwd: root,
		timeoutMs: 90_000,
		label: path.basename(fixturePath),
	})
	assert.equal(result.timedOut, false, result.output)
	assert.equal(result.code, 0, result.output)
	const match = result.output.match(/^Instantiations:\s+(\d+)$/m)
	assert.ok(match, result.output)
	return Number(match[1])
}

test('keeps an indexed entity-definition lookup independent of registry size', async () => {
	const root = process.cwd()
	const temporaryDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'blockhead-indexed-schema-lookup-'))
	const schemaImportPath = path.relative(
		temporaryDirectory,
		path.join(root, 'src/schema/$schema.ts')
	).replaceAll(path.sep, '/')
	const instantiations = async (size, includeLookup) => {
		const fixturePath = path.join(
			temporaryDirectory,
			`${size}-${includeLookup ? 'lookup' : 'baseline'}.ts`
		)
		const definitions = [
			"Definition<'Target'>",
			...Array.from({ length: size - 1 }, (_, index) => `Definition<'Unrelated${index}'>`),
		]
		await fs.writeFile(fixturePath, `import type {
	EntityDefinitionByType,
	EntityDefinitionForEntityType,
	EntityType,
} from './${schemaImportPath}'

type Definition<_EntityType extends string> = {
	readonly entityType: _EntityType
	readonly labels: {
		readonly singular: string
		readonly plural: string
	}
	readonly selectors: readonly []
	readonly fields: readonly []
}

type Definitions = readonly [
	${definitions.join(',\n\t')},
]
type IndexedSchema = Definitions & {
	readonly entityDefinitionByType: EntityDefinitionByType<Definitions>
}
type RegisteredEntityType = (
	& EntityType<IndexedSchema>
	& keyof IndexedSchema['entityDefinitionByType']
)
type RegisteredDefinition = IndexedSchema['entityDefinitionByType'][RegisteredEntityType]
declare const registeredEntityType: RegisteredEntityType
declare const registeredDefinition: RegisteredDefinition
registeredEntityType
registeredDefinition.entityType
${includeLookup ? `
type SelectedDefinition = EntityDefinitionForEntityType<IndexedSchema, 'Target'>
const selectedEntityType: SelectedDefinition['entityType'] = 'Target'
selectedEntityType
` : ''}`)
		return compileFixture(root, fixturePath)
	}

	try {
		const size = 32
		const baseline = await instantiations(size, false)
		const lookup = await instantiations(size, true)
		const doubledBaseline = await instantiations(size * 2, false)
		const doubledLookup = await instantiations(size * 2, true)
		const incrementalLookup = lookup - baseline
		const doubledIncrementalLookup = doubledLookup - doubledBaseline

		assert.ok(incrementalLookup > 0)
		assert.ok(doubledIncrementalLookup > 0)
		assert.ok(
			Math.abs(doubledIncrementalLookup - incrementalLookup) <= 8,
			`Indexed lookup instantiations grew with unrelated registrations: ${incrementalLookup} at ${size}, ${doubledIncrementalLookup} at ${size * 2}`
		)
	} finally {
		await fs.rm(temporaryDirectory, { recursive: true, force: true })
	}
})
