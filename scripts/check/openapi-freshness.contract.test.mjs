import assert from 'node:assert/strict'
import {
	mkdir,
	mkdtemp,
	readFile,
	rm,
	writeFile,
} from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import { transferOpenApiSchemaTree } from '../sources/openapi.ts'

test('freshness recursively compares local refs without writing checked-in schemas', async () => {
	const root = await mkdtemp(join(tmpdir(), 'blockhead-openapi-freshness-'))
	try {
		const schemaFile = join(root, 'openapi.yaml')
		const refFile = join(root, 'components', 'model.yaml')
		const rootText = 'openapi: 3.1.0\ncomponents:\n  schemas:\n    Model:\n      $ref: "./components/model.yaml#/Model"\n'
		const refText = 'Model:\n  type: object\n'
		await mkdir(join(root, 'components'))
		await writeFile(schemaFile, rootText)
		await writeFile(refFile, refText)
		const remote = new Map([
			['https://schemas.example/openapi.yaml', rootText],
			['https://schemas.example/components/model.yaml', refText],
		])
		const fetchSchema = async (url) => {
			const text = remote.get(String(url))
			return text == null ? new Response('', { status: 404 }) : new Response(text)
		}

		await transferOpenApiSchemaTree({
			schemaUrl: 'https://schemas.example/openapi.yaml',
			schemaFile,
			mode: 'freshness',
			fetchSchema,
		})
		assert.equal(await readFile(schemaFile, 'utf8'), rootText)
		assert.equal(await readFile(refFile, 'utf8'), refText)

		remote.set('https://schemas.example/components/model.yaml', 'Model:\n  type: string\n')
		await assert.rejects(
			transferOpenApiSchemaTree({
				schemaUrl: 'https://schemas.example/openapi.yaml',
				schemaFile,
				mode: 'freshness',
				fetchSchema,
			}),
			/drifted from checked-in .*model\.yaml/
		)
		assert.equal(await readFile(refFile, 'utf8'), refText)

		remote.delete('https://schemas.example/components/model.yaml')
		await assert.rejects(
			transferOpenApiSchemaTree({
				schemaUrl: 'https://schemas.example/openapi.yaml',
				schemaFile,
				mode: 'freshness',
				fetchSchema,
			}),
			/Failed to download OpenAPI schema: 404/
		)
	} finally {
		await rm(root, { recursive: true, force: true })
	}
})
