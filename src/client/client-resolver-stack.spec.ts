import {
	describe,
	expect,
	it,
} from 'vitest'
import {
	readdirSync,
	readFileSync,
} from 'node:fs'
import { resolve } from 'node:path'


const clientDirectory = resolve(
	process.cwd(),
	'src/client'
)

const source = (
	fileName: string
) => readFileSync(
	resolve(
		clientDirectory,
		fileName
	),
	'utf8'
)


describe('client resolver stack architecture', () => {
	it('keeps the client implementation in the original files', () => {
		expect(readdirSync(clientDirectory).toSorted()).toEqual([
			'$client.svelte.ts',
			'$proxy.svelte.ts',
			'$subscribe.svelte.ts',
			'client-resolver-stack.spec.ts',
		])
	})

	it('keeps loaded-subset completion owned by the persisted collection', () => {
		expect(source('$client.svelte.ts')).toMatch(/PersistedCollectionLoadedSubset/)
		expect(source('$client.svelte.ts')).toMatch(/metadata\?\.collection\.set/)
		expect(source('$client.svelte.ts')).not.toMatch(/sourceExecutions|SourceExecution|localOnlyCollectionOptions|queryCollectionOptions/)
		expect(source('$subscribe.svelte.ts')).not.toMatch(/LoadedSubset|loadedSubsets|rowCount|sourceRowCounts|metadata\.collection|persistedCollectionOptions|queryCollectionOptions/)
	})

	it('keeps Persisted collection query functions from using hydrated rows for the persistence gate', () => {
		const clientSource = source('$client.svelte.ts')
		for (const queryFunction of [
			'loadEntityRows',
			'loadFieldRows',
			'loadCountRows',
		]) {
			const start = clientSource.indexOf(`const ${queryFunction}`)
			expect(start).toBeGreaterThanOrEqual(0)
			const body = clientSource.slice(
				start,
				clientSource.indexOf('\nconst ', start + 1)
			)
			expect(body).not.toMatch(/collection\.toArray|collection\.values|collection\.size|collection\.has/)
		}
	})

	it('keeps view-facing reads behind the proxy and subscribe files', () => {
		expect(source('$proxy.svelte.ts')).not.toMatch(/entityCollections|entityFieldCollections|queryCollectionOptions/)
		expect(source('$subscribe.svelte.ts')).not.toMatch(/queryCollectionOptions|persistedCollectionOptions/)
	})
})
