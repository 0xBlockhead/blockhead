import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'

const projectRoot = path.resolve(import.meta.dirname, '../..')
const checker = path.join(projectRoot, 'scripts/lint/check-svelte-formatting.ts')

const checkFixture = (fixturePath, flags = []) => spawnSync(
	process.execPath,
	[
		'--import',
		'tsx',
		checker,
		...flags,
		fixturePath,
	],
	{
		cwd: projectRoot,
		encoding: 'utf8',
	}
)

test('embedded TypeScript checks preserve quoted generic constraints and find real trailing commas', async () => {
	const fixtureDir = await mkdtemp(path.join(tmpdir(), 'blockhead-svelte-formatting-'))
	try {
		const fixturePath = path.join(fixtureDir, 'Generic.svelte')
		await writeFile(fixturePath, `<script
	lang="ts"
	generics="
		_Item extends { value: string }
	"
>
	const read = (item: _Item) => item.value
	read({ value: 'ok' },)
</script>
`)
		const result = checkFixture(fixturePath, ['--script-trailing-commas'])
		assert.notEqual(result.status, 0)
		assert.match(result.stderr, /Remove trailing comma from call arguments/)
		assert.doesNotMatch(result.stderr, /Expression expected|Declaration or statement expected|Unterminated/)
	} finally {
		await rm(fixtureDir, { recursive: true, force: true })
	}
})

test('section ordering remains opt-in and rejects only selected section-order contracts', async () => {
	const fixtureDir = await mkdtemp(path.join(tmpdir(), 'blockhead-svelte-sections-'))
	try {
		const fixturePath = path.join(fixtureDir, 'Component.svelte')
		await writeFile(fixturePath, `<script lang="ts">
	// Functions
	const read = () => state


	// State
	let state = $state(0)
</script>
`)
		const ordinary = checkFixture(fixturePath)
		assert.equal(ordinary.status, 0, ordinary.stdout + ordinary.stderr)

		const selected = checkFixture(fixturePath, ['--section-order'])
		assert.notEqual(selected.status, 0)
		assert.match(selected.stderr, /Move \/\/ State earlier/)
	} finally {
		await rm(fixtureDir, { recursive: true, force: true })
	}
})
