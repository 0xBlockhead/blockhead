import { stringify } from 'devalue'
import { expect, test } from '@playwright/test'

import {
	assertLoadedValue,
	materializeResolverOutput,
	ResolverOutputMaterialization,
} from '$/collections/assertLoadedCollectionRows.ts'
import {
	assertLoadedResolverProbeCategories,
} from '$/routes/api/e2e/assert-loaded-resolvers/_fixtures.ts'
import type { AssertLoadedResolverProbeResult } from '$/routes/api/e2e/assert-loaded-resolvers/_runProbes.ts'
import RedditPublicJson from '$/resolvers/Reddit-PublicJson.ts'
import RedditRest from '$/resolvers/Reddit-Rest.ts'
import YoutubeRest from '$/resolvers/Youtube-Rest.ts'
import {
	EntityMetaKey,
	entityFieldDefinitions,
	indexSchema,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { entityDefinitionByType } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'


const resolverHasCountSelector = (
	fields: object,
	fieldName: string
) => {
	const fieldSelector = Object.getOwnPropertyDescriptor(fields, fieldName)?.value
	return (
		fieldSelector != null
		&& typeof fieldSelector === 'object'
		&& 'resolveCount' in fieldSelector
	)
}

/**
 * Confirms the assert-loaded machinery (not domain correctness of resolver payloads):
 * synthetic bad shapes throw; the probe endpoint runs one case per resolver and returns consistent metadata.
 */
test.describe('assertLoaded verification', () => {
	test('assertLoadedValue rejects invalid entity-row __source', () => {
		expect(() => assertLoadedValue({
			[EntityMetaKey.Selector]: { chainId: 1 },
			[EntityMetaKey.SelectorKey]: '{"chainId":1}',
			[EntityMetaKey.Source]: 'NotARealSource',
		})).toThrow()
	})

	test('assertLoadedValue rejects invalid nested compact ref __selector', () => {
		expect(() => assertLoadedValue({
			x: {
				[EntityMetaKey.Selector]: null,
				[EntityMetaKey.SelectorKey]: 'k',
			},
		})).toThrow()
	})

	test('resolver materialization accepts an exact Global selector then rejects a stale key', () => {
		const definition = entityDefinitionByType[EntityType._Global]
		expect(definition).toBeDefined()
		const schemaIndex = indexSchema([definition])

		expect(() => materializeResolverOutput({
			kind: ResolverOutputMaterialization.Entity,
			schema: [definition],
			schemaIndex,
			entityDefinition: definition,
			selector: { scope: 'e2e' },
			selectorKey: stringify({ scope: 'e2e' }),
			source: Source.Constants_Internal,
			snapshot: {},
		})).not.toThrow()

		expect(() => materializeResolverOutput({
			kind: ResolverOutputMaterialization.Entity,
			schema: [definition],
			schemaIndex,
			entityDefinition: definition,
			selector: { scope: 'e2e' },
			selectorKey: 'stale',
			source: Source.Constants_Internal,
			snapshot: {},
		})).toThrow(/selector key/)
	})

	test('schema exposes scalar and array-item conditional fields', () => {
		expect(entityDefinitionByType[EntityType.EvmTokenTransfer].facets?.[0]).toMatchObject({
			name: 'Nft',
			condition: {
				path: ['standard'],
				isOneOf: [
					'ERC-721',
					'ERC-1155',
				],
			},
			fields: [{ name: 'tokenId' }],
		})
	})

	test('YouTube list fields expose provider totals through count selectors', () => {
		expect(YoutubeRest.resolvers.some((resolver) => (
			resolver.entityType === EntityType.YoutubeChannel
			&& resolverHasCountSelector(resolver.projections, '$$videos')
		))).toBe(true)
		expect(YoutubeRest.resolvers.some((resolver) => (
			resolver.entityType === EntityType.YoutubePlaylist
			&& resolverHasCountSelector(resolver.projections, '$$videos')
		))).toBe(true)
		expect(YoutubeRest.resolvers.some((resolver) => (
			resolver.entityType === EntityType.YoutubeVideo
			&& resolverHasCountSelector(resolver.projections, '$$comments')
		))).toBe(true)
		expect(YoutubeRest.resolvers.some((resolver) => (
			resolver.entityType === EntityType.YoutubeComment
			&& resolverHasCountSelector(resolver.projections, '$$replies')
		))).toBe(true)
	})

	test('Reddit link comments expose provider totals through count selectors', () => {
		for (const sourceResolvers of [
			RedditPublicJson,
			RedditRest,
		]) {
			expect(sourceResolvers.resolvers.some((resolver) => (
				resolver.entityType === EntityType.RedditLink
				&& resolverHasCountSelector(resolver.projections, '$$comments')
			))).toBe(true)
		}
	})

	test('GET /api/e2e/assert-loaded-resolvers: probe covers every resolver with consistent case metadata', async ({
		request,
	}) => {
		test.setTimeout(900_000)

		const res = await request.get('/api/e2e/assert-loaded-resolvers', { timeout: 900_000 })
		const text = await res.text()
		expect(res.status(), text).toBe(200)

		const body: AssertLoadedResolverProbeResult = JSON.parse(text)

		const {
			cases,
			resolverDefinitionCount,
			resolverValuePartCount,
			countResolverPartCount,
		} = body

		expect(
			resolverDefinitionCount,
			'probe runner must report resolverDefinitionCount'
		).toBeGreaterThan(0)

		expect(
			resolverValuePartCount,
			'probe runner must report resolverValuePartCount'
		).toBeGreaterThan(0)

		expect(body.countResolverPartCount).toBeGreaterThan(0)
		expect(body.countResolverFields).toEqual(expect.arrayContaining([
			'EvmBlock.$$transactions',
			'Network.Evm.$$blocks',
			'Network.Evm.$$transactions',
			'EvmNetworkAccount.$$tokenTransfers',
			'EvmNetworkAccount.$$transactions',
			'RedditLink.$$comments',
		]))
		expect(body.rootLiveResolverCount).toBeGreaterThan(0)

		expect(
			cases.length,
			'one case per entity, field-value, and field-count resolver'
		).toBe(resolverDefinitionCount + resolverValuePartCount + countResolverPartCount)

		const entityCases = cases.filter((c) => c.kind === 'entity')
		const fieldCases = cases.filter((c) => c.kind === 'field')
		const countCases = cases.filter((c) => c.kind === 'count')

		expect(entityCases.length, 'entity case count').toBe(resolverDefinitionCount)
		expect(fieldCases.length, 'field case count').toBe(resolverValuePartCount)
		expect(countCases.length, 'count case count').toBe(countResolverPartCount)

		expect(
			new Set(cases.map((c) => c.key)).size,
			'case keys must be unique (one resolver per key)'
		).toBe(cases.length)

		for (const c of cases) {
			expect(typeof c.key === 'string' && c.key.length > 0).toBe(true)
			expect(assertLoadedResolverProbeCategories.includes(c.category)).toBe(true)
			expect(typeof c.resolveRejected).toBe('boolean')
			expect(typeof c.assertThrew).toBe('boolean')
			if (c.resolveRejected) {
				expect(typeof c.resolveError === 'string' && c.resolveError.length > 0).toBe(true)
			}
			if (c.assertThrew) {
				expect(typeof c.assertError === 'string' && c.assertError.length > 0).toBe(true)
			}
		}

		const failedAfterResolve = cases.filter((c) => (
			!c.resolveRejected
			&& c.assertThrew
		))
		expect(body.fulfilledButAssertFailed).toEqual(failedAfterResolve)

		for (const category of assertLoadedResolverProbeCategories) {
			expect(body.categorySummary[category]).toBeDefined()
		}
	})
})
