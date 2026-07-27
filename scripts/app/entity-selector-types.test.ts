import assert from 'node:assert/strict'
import {
	cpSync,
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import test from 'node:test'
import ts from 'typescript'

test('requires nonempty selectors with existing One or ZeroOrOne fields at compile time', () => {
	const root = process.cwd()
	const typeTestRoot = mkdtempSync(path.join(tmpdir(), 'blockhead-app-selector-types-test-'))
	const appSource = readFileSync(path.join(root, 'APP.ts'), 'utf8')
	const appSourceFile = ts.createSourceFile('APP.ts', appSource, ts.ScriptTarget.Latest, true)
	const facetStatement = appSourceFile.statements.find((statement) => (
		ts.isVariableStatement(statement)
		&& statement.declarationList.declarations.some((declaration) => (
			ts.isIdentifier(declaration.name)
			&& declaration.name.text === 'facet'
		))
	))
	const fixtureSource = readFileSync(path.join(root, 'scripts/app/entity-selector-types.types.ts'), 'utf8')
	const fixtureSourceFile = ts.createSourceFile(
		'entity-selector-types.types.ts',
		fixtureSource,
		ts.ScriptTarget.Latest,
		true
	)
	const fixtureImport = fixtureSourceFile.statements.find(ts.isImportDeclaration)

	assert.ok(facetStatement)
	assert.ok(fixtureImport)

	try {
		const typeTestPath = path.join(typeTestRoot, 'entity-selector-types.types.ts')
		mkdirSync(path.join(typeTestRoot, 'scripts/app/inputs'), { recursive: true })
		mkdirSync(path.join(typeTestRoot, 'src/constants'), { recursive: true })
		cpSync(
			path.join(root, 'scripts/app/inputs/source-target.ts'),
			path.join(typeTestRoot, 'scripts/app/inputs/source-target.ts')
		)
		cpSync(
			path.join(root, 'src/constants/Network.ts'),
			path.join(typeTestRoot, 'src/constants/Network.ts')
		)
		writeFileSync(typeTestPath, `${appSource.slice(0, facetStatement.end)}\n${fixtureSource.slice(fixtureImport.end)}`)
		const typeTestResult = spawnSync(
			process.execPath,
			[
				'--max-old-space-size=1024',
				process.env.TSC_PATH ?? path.join(root, 'node_modules/@typescript/native/bin/tsc'),
				'--noEmit',
				'--ignoreConfig',
				'--allowImportingTsExtensions',
				'--listFiles',
				'--skipLibCheck',
				'--module',
				'preserve',
				'--moduleResolution',
				'bundler',
				'--target',
				'esnext',
				typeTestPath,
			],
			{
				cwd: root,
				encoding: 'utf8',
			}
		)

		assert.equal(typeTestResult.status, 0, typeTestResult.stderr || typeTestResult.stdout)
		assert.equal(typeTestResult.stdout.split('\n').includes(path.join(root, 'APP.ts')), false)
		assert.equal(typeTestResult.stdout.split('\n').includes(typeTestPath), true)
	} finally {
		rmSync(typeTestRoot, {
			force: true,
			recursive: true,
		})
	}
})
