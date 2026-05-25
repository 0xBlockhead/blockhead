import { expect, test } from '@playwright/test'

import { assertLoadedValue } from '$/collections/assertLoadedCollectionRows.ts'
import { assertLoadedResolverProbeCategories } from '$/routes/api/e2e/assert-loaded-resolvers/_fixtures.ts'
import type { AssertLoadedResolverProbeResult } from '$/routes/api/e2e/assert-loaded-resolvers/_runProbes.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'


test.describe('assertLoaded resolver probes', () => {
	test('rejects invalid entity-row __source', () => {
		expect(() => assertLoadedValue({
			[EntityMetaKey.Id]: { chainId: 1 },
			[EntityMetaKey.IdKey]: '{"chainId":1}',
			[EntityMetaKey.Source]: 'NotARealSource',
			[EntityMetaKey.Fields]: {},
		})).toThrow()
	})

	test('rejects invalid nested compact ref __id', () => {
		expect(() => assertLoadedValue({
			x: {
				[EntityMetaKey.Id]: null,
				[EntityMetaKey.IdKey]: 'k',
			},
		})).toThrow()
	})

	test('GET /api/e2e/assert-loaded-resolvers: fulfilled resolver rows pass assertLoaded*', async ({
		request,
	}) => {
		test.setTimeout(900_000)

		const res = await request.get('/api/e2e/assert-loaded-resolvers', { timeout: 900_000 })
		const text = await res.text()
		expect(res.status(), text).toBe(200)

		const body: AssertLoadedResolverProbeResult = JSON.parse(text)

		expect(
			body.fulfilledButAssertFailed,
			body.fulfilledButAssertFailed.map((c) => `${c.key}: ${c.assertError}`).join('\n'),
		).toEqual([])

		expect(
			body.assertOk,
			`expected at least one fulfilled resolver to pass assert; got ${body.assertOk}. Check env / network.`,
		).toBeGreaterThan(0)

		for (const category of assertLoadedResolverProbeCategories) {
			expect(body.categorySummary[category]).toBeDefined()
		}

		const categorySummaryLines = assertLoadedResolverProbeCategories.map((category) => {
			const bucket = body.categorySummary[category]
			return (
				`${category}: total ${bucket.total}, resolveRejected ${bucket.resolveRejected}, `
				+ `assertOk ${bucket.assertOk}, fulfilledButAssertFailed ${bucket.fulfilledButAssertFailed}`
			)
		})

		test.info().attach('summary', {
			body: [
				`assert ok ${body.assertOk}/${body.cases.length}; resolve ok ${body.resolveOk}/${body.cases.length}`,
				`fulfilledButAssertFailed ${body.fulfilledButAssertFailed.length}`,
				...categorySummaryLines,
			].join('\n'),
			contentType: 'text/plain',
		})
	})
})
