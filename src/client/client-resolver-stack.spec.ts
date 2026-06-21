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
			'$e2eProbe.ts',
			'$e2eTrace.ts',
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

	it('keeps E2E tracing isolated from the production client', () => {
		expect(source('$client.svelte.ts')).not.toMatch(/__blockhead|PersistenceTrace|trace:/)
		expect(source('$subscribe.svelte.ts')).not.toMatch(/__blockhead|PersistenceTrace|trace:/)
		expect(source('$e2eProbe.ts')).toMatch(/__blockheadClientProbe/)
		expect(source('$e2eProbe.ts')).toMatch(/PersistenceTraceEvent/)
		expect(source('$e2eTrace.ts')).toMatch(/traceE2ECollections/)
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
			const nextConst = clientSource.indexOf('\nconst ', start + 1)
			const nextExport = clientSource.indexOf('\nexport const ', start + 1)
			const body = clientSource.slice(
				start,
				Math.min(
					...[
						nextConst,
						nextExport,
					].filter((index) => index >= 0)
				)
			)
			expect(body).not.toMatch(/collection\.toArray|collection\.values|collection\.size|collection\.has/)
		}
	})

	it('keeps undefined snapshot completion gated by schema cardinality', () => {
		const clientSource = source('$client.svelte.ts')
		for (const queryFunction of [
			'loadFieldRows',
			'loadCountRows',
		]) {
			const start = clientSource.indexOf(`const ${queryFunction}`)
			expect(start).toBeGreaterThanOrEqual(0)
			const nextConst = clientSource.indexOf('\nconst ', start + 1)
			const body = clientSource.slice(
				start,
				nextConst
			)
			expect(body).toMatch(/if \(snapshot === undefined\)[\s\S]*fieldCanCompleteEmpty/)
			expect(body).not.toMatch(/snapshot (?:==|===) null/)
		}
	})

	it('validates resolver field value shape before writing persisted field rows', () => {
		const clientSource = source('$client.svelte.ts')
		expect(clientSource).toMatch(/returned non-array value for multiple-cardinality field/)
		expect(clientSource).toMatch(/returned array value for single-cardinality field/)
		expect(clientSource).toMatch(/entityFieldPrimitiveValueIsValid/)
		expect(clientSource).toMatch(/validateEntitySelector\(/)
		expect(clientSource).not.toMatch(/Array\.isArray\(value\) \?[\s\S]*:\s*\[value\]/)
	})

	it('keeps conditional fields pending until discriminator state is known', () => {
		for (const fileName of [
			'$client.svelte.ts',
			'$subscribe.svelte.ts',
		]) {
			const clientSource = source(fileName)
			expect(clientSource).toMatch(/enum FieldConditionState/)
			expect(clientSource).toMatch(/FieldConditionState\.Unknown/)
			expect(clientSource).toMatch(/conditionState !== FieldConditionState\.Unknown/)
			expect(clientSource).not.toMatch(/conditionState === false/)
		}
	})

	it('keeps view-facing reads behind the proxy and subscribe files', () => {
		expect(source('$proxy.svelte.ts')).not.toMatch(/entityCollections|entityFieldCollections|queryCollectionOptions/)
		expect(source('$subscribe.svelte.ts')).not.toMatch(/queryCollectionOptions|persistedCollectionOptions/)
	})
})
