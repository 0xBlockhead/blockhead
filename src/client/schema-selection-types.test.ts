import assert from 'node:assert/strict'
import {
	mkdtempSync,
	rmSync,
	writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import test from 'node:test'

test('enforces schema-derived projection selections and field addresses', () => {
	const root = process.cwd()
	const typeTestRoot = mkdtempSync(path.join(tmpdir(), 'blockhead-schema-selection-types-test-'))

	try {
		const tsconfigPath = path.join(typeTestRoot, 'tsconfig.json')
		writeFileSync(tsconfigPath, JSON.stringify({
			extends: path.join(root, 'tsconfig.json'),
			compilerOptions: {
				ignoreDeprecations: '6.0',
				noEmit: true,
			},
			files: [path.join(root, 'src/client/schema-selection-types.types.ts')],
			include: [],
		}))
		const result = spawnSync(
			process.execPath,
			[
				'--max-old-space-size=2048',
				path.join(root, 'node_modules/typescript/bin/tsc'),
				'--project',
				tsconfigPath,
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
