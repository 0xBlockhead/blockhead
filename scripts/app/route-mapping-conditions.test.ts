import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import test from 'node:test'

test('checks route applicability paths and operators against the schema at compile time', () => {
	const root = process.cwd()
	const fixturePath = path.join(root, 'scripts/app/route-mapping-conditions.types.ts')
	const result = spawnSync(
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
			fixturePath,
		],
		{
			cwd: root,
			encoding: 'utf8',
		}
	)

	assert.equal(result.status, 0, result.stderr || result.stdout)
	const listedFiles = result.stdout.split('\n')
	assert.equal(listedFiles.includes(path.join(root, 'APP.ts')), false)
	assert.equal(listedFiles.includes(fixturePath), true)
})
