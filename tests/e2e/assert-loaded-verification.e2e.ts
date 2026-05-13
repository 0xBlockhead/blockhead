import { stringify } from 'devalue'
import { expect, test } from '@playwright/test'

import {
	assertEntityResolverResult,
	assertLoadedValue,
} from '$/collections/assertLoadedCollectionRows.ts'
import type { AssertLoadedResolverProbeResult } from '$/routes/api/e2e/assert-loaded-resolvers/_runProbes.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { entityDefinitionByType } from '$/schema/index.ts'
import { Source } from '$/sources/$Source.ts'


/**
 * Confirms the assert-loaded machinery (not domain correctness of resolver payloads):
 * synthetic bad shapes throw; the probe endpoint runs one case per resolver and returns consistent metadata.
 */
test.describe('assertLoaded verification', () => {
	test('assertLoadedValue rejects invalid entity-row __source', () => {
		expect(() => assertLoadedValue({
			[EntityMetaKey.Id]: { chainId: 1 },
			[EntityMetaKey.IdKey]: '{"chainId":1}',
			[EntityMetaKey.Source]: 'NotARealSource',
			[EntityMetaKey.Fields]: {},
		})).toThrow()
	})

	test('assertLoadedValue rejects invalid nested compact ref __id', () => {
		expect(() => assertLoadedValue({
			x: {
				[EntityMetaKey.Id]: null,
				[EntityMetaKey.IdKey]: 'k',
			},
		})).toThrow()
	})

	test('assertEntityResolverResult accepts minimal Global row then rejects invalid __id', () => {
		const definition = entityDefinitionByType[EntityType._Global]
		expect(definition).toBeDefined()

		const good = {
			[EntityMetaKey.Id]: {},
			[EntityMetaKey.IdKey]: stringify({}),
			[EntityMetaKey.Source]: Source.Constants_Internal,
			[EntityMetaKey.Fields]: {},
		}

		expect(() => assertEntityResolverResult(definition!, good)).not.toThrow()

		expect(() => assertEntityResolverResult(definition!, {
			...good,
			[EntityMetaKey.Id]: null,
		})).toThrow()
	})

	test('GET /api/e2e/assert-loaded-resolvers: probe covers every resolver with consistent case metadata', async ({
		request,
	}) => {
		test.setTimeout(900_000)

		const res = await request.get('/api/e2e/assert-loaded-resolvers', { timeout: 900_000 })
		const text = await res.text()
		expect(res.status(), text).toBe(200)

		const body = JSON.parse(text) as AssertLoadedResolverProbeResult

		const { cases, entityResolverCount, fieldResolverCount } = body

		expect(
			entityResolverCount,
			'probe runner must report entityResolverCount',
		).toBeGreaterThan(0)

		expect(
			fieldResolverCount,
			'probe runner must report fieldResolverCount',
		).toBeGreaterThan(0)

		expect(
			cases.length,
			'one case per entity resolver + one per field resolver',
		).toBe(entityResolverCount + fieldResolverCount)

		const entityCases = cases.filter((c) => c.kind === 'entity')
		const fieldCases = cases.filter((c) => c.kind === 'field')

		expect(entityCases.length, 'entity case count').toBe(entityResolverCount)
		expect(fieldCases.length, 'field case count').toBe(fieldResolverCount)

		expect(
			new Set(cases.map((c) => c.key)).size,
			'case keys must be unique (one resolver per key)',
		).toBe(cases.length)

		for (const c of cases) {
			expect(typeof c.key === 'string' && c.key.length > 0).toBe(true)
			expect(c.resolveRejected === true || c.resolveRejected === false).toBe(true)
			expect(c.assertThrew === true || c.assertThrew === false).toBe(true)
			if (c.assertThrew) {
				expect(typeof c.assertError === 'string' && c.assertError.length > 0).toBe(true)
			}
		}

		const failedAfterResolve = cases.filter((c) => !c.resolveRejected && c.assertThrew)
		expect(body.fulfilledButAssertFailed).toEqual(failedAfterResolve)
	})
})
