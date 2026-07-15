import assert from 'node:assert/strict'
import {
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

test('checks route applicability paths and operators against the schema at compile time', () => {
	const root = process.cwd()
	const typeTestRoot = mkdtempSync(path.join(tmpdir(), 'blockhead-route-condition-types-test-'))
	const appSource = readFileSync(path.join(root, 'APP.ts'), 'utf8')
	const appSourceFile = ts.createSourceFile('APP.ts', appSource, ts.ScriptTarget.Latest, true)
	const defineRoutesStatement = appSourceFile.statements.find((statement) => (
		ts.isVariableStatement(statement)
		&& statement.declarationList.declarations.some((declaration) => (
			ts.isIdentifier(declaration.name)
			&& declaration.name.text === 'defineRoutes'
		))
	))

	assert.ok(defineRoutesStatement)

	try {
		const typeTestPath = path.join(typeTestRoot, 'route-mapping-conditions.types.ts')
		writeFileSync(typeTestPath, `${appSource.slice(0, defineRoutesStatement.end)}\n${readFileSync(path.join(root, 'scripts/app/route-mapping-conditions.types.ts'), 'utf8')}`)
		const result = spawnSync(
			process.execPath,
			[
				'--max-old-space-size=1024',
				path.join(root, 'node_modules/typescript/bin/tsc'),
				'--noEmit',
				'--ignoreConfig',
				'--allowImportingTsExtensions',
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

		assert.equal(result.status, 0, result.stderr || result.stdout)
	} finally {
		rmSync(typeTestRoot, {
			force: true,
			recursive: true,
		})
	}
})
