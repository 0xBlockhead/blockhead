import assert from 'node:assert/strict'
import {
	existsSync,
	mkdtempSync,
	mkdirSync,
	readFileSync,
	readdirSync,
	rmSync,
	statSync,
	writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'

test('publishes generated files transactionally', async () => {
	const generatedOutputRoot = mkdtempSync(path.join(tmpdir(), 'blockhead-atomic-publication-'))
	const generatedFilePath = path.join(generatedOutputRoot, 'src/schema/Fixture.ts')
	const manualFilePath = path.join(generatedOutputRoot, 'src/schema/manual.ts')
	const staleFilePath = path.join(generatedOutputRoot, 'src/routes/stale/+page.svelte')

	try {
		process.env.APP_GENERATED_OUTPUT_ROOT = generatedOutputRoot
		const { writeFiles } = await import('./generate.ts')
		const files = [{
			path: 'src/schema/Fixture.ts',
			kind: 'text',
			body: ['export const fixture = true'],
		}] as const
		await writeFiles(files)
		const generatedSource = readFileSync(generatedFilePath, 'utf8')

		mkdirSync(path.dirname(manualFilePath), {
			recursive: true,
		})
		writeFileSync(manualFilePath, 'export const manual = true\n')
		mkdirSync(path.dirname(staleFilePath), {
			recursive: true,
		})
		writeFileSync(staleFilePath, '<!-- Generated from APP.ts. -->\n<p>stale</p>\n')
		writeFileSync(generatedFilePath, `${generatedSource}\n// incomplete old generation\n`)
		const beforeFailure = new Map([
			[generatedFilePath, readFileSync(generatedFilePath, 'utf8')],
			[manualFilePath, readFileSync(manualFilePath, 'utf8')],
			[staleFilePath, readFileSync(staleFilePath, 'utf8')],
		])

		process.env.APP_GENERATOR_FAIL_AFTER_PUBLICATION = '2'
		await assert.rejects(
			writeFiles(files),
			/Injected generator publication failure/
		)
		delete process.env.APP_GENERATOR_FAIL_AFTER_PUBLICATION
		for (const [filePath, source] of beforeFailure)
			assert.equal(readFileSync(filePath, 'utf8'), source)
		assert.deepEqual(
			readdirSync(generatedOutputRoot).filter((name) => (
				name === '.blockhead-generator.lock'
				|| /^\.blockhead-generator-\d/.test(name)
			)),
			[]
		)

		const observedSources = new Set<string>()
		const publication = writeFiles(files)
		while (true) {
			observedSources.add(readFileSync(generatedFilePath, 'utf8'))
			const outcome = await Promise.race([
				publication.then(() => ({
					done: true as const,
				})),
				new Promise<{ done: false }>((resolve) => setTimeout(() => resolve({
					done: false,
				}), 2)),
			])
			if (outcome.done) {
				break
			}
		}
		observedSources.add(readFileSync(generatedFilePath, 'utf8'))
		assert.deepEqual(
			observedSources,
			new Set([
				beforeFailure.get(generatedFilePath),
				generatedSource,
			])
		)
		assert.equal(readFileSync(manualFilePath, 'utf8'), 'export const manual = true\n')
		assert.equal(existsSync(staleFilePath), false)

		const unchangedMtime = statSync(generatedFilePath).mtimeMs
		await writeFiles(files)
		assert.equal(statSync(generatedFilePath).mtimeMs, unchangedMtime)

		writeFileSync(generatedFilePath, `${generatedSource}\n// serialize writers\n`)
		await Promise.all([
			writeFiles(files),
			writeFiles(files),
		])
		assert.equal(readFileSync(generatedFilePath, 'utf8'), generatedSource)
		assert.deepEqual(
			readdirSync(generatedOutputRoot).filter((name) => (
				name === '.blockhead-generator.lock'
				|| /^\.blockhead-generator-\d/.test(name)
			)),
			[]
		)
	} finally {
		delete process.env.APP_GENERATED_OUTPUT_ROOT
		delete process.env.APP_GENERATOR_FAIL_AFTER_PUBLICATION
		rmSync(generatedOutputRoot, {
			force: true,
			recursive: true,
		})
	}
})
