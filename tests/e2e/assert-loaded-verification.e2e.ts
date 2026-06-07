import { stringify } from 'devalue'
import { expect, test } from '@playwright/test'

import {
	assertLoadedValue,
	assertResolverDefinitionResult,
} from '$/collections/assertLoadedCollectionRows.ts'
import {
	assertLoadedResolverProbeCategories,
	isExpectedAssertLoadedResolverProbeFailure,
} from '$/routes/api/e2e/assert-loaded-resolvers/_fixtures.ts'
import type { AssertLoadedResolverProbeResult } from '$/routes/api/e2e/assert-loaded-resolvers/_runProbes.ts'
import RedditPublicJson from '$/resolvers/Reddit-PublicJson.ts'
import RedditRest from '$/resolvers/Reddit-Rest.ts'
import YoutubeRest from '$/resolvers/Youtube-Rest.ts'
import {
	EntityMetaKey,
	entityFieldConditionKey,
	entityFieldDefinitions,
} from '$/schema/$EntityDefinition.ts'
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

	test('assertResolverDefinitionResult accepts minimal Global row then rejects invalid __id', () => {
		const definition = entityDefinitionByType[EntityType._Global]
		expect(definition).toBeDefined()

		const good = {
			[EntityMetaKey.Id]: { scope: 'e2e' },
			[EntityMetaKey.IdKey]: stringify({ scope: 'e2e' }),
			[EntityMetaKey.Source]: Source.Constants_Internal,
			[EntityMetaKey.Fields]: {},
		}

		expect(() => assertResolverDefinitionResult(definition, good)).not.toThrow()

		expect(() => assertResolverDefinitionResult(definition, {
			...good,
			[EntityMetaKey.Id]: null,
		})).toThrow()
	})

	test('schema exposes scalar and array-item conditional fields', () => {
		const blobGasUsed = entityFieldDefinitions(entityDefinitionByType[EntityType.EvmTransaction])
			.find((field) => field.name === 'blobGasUsed')
		const tokenTransfers = entityFieldDefinitions(entityDefinitionByType[EntityType.EvmLog])
			.find((field) => field.name === '$$tokenTransfers')

		expect(blobGasUsed).toBeDefined()
		expect(tokenTransfers).toBeDefined()
		if (blobGasUsed == null || tokenTransfers == null)
			throw new Error('Missing conditional field definitions')

		expect('when' in blobGasUsed && blobGasUsed.when.fieldName).toBe('envelopeType')
		expect('when' in tokenTransfers && entityFieldConditionKey(tokenTransfers.when)).toBe('topics[0]')
	})

	test('YouTube list fields expose provider totals through count selectors', () => {
		expect(YoutubeRest.resolvers.some((resolver) => (
			resolver.entityType === EntityType.YouTubeChannel
			&& typeof resolver.fields.$$videos === 'object'
			&& 'resolveCount' in resolver.fields.$$videos
		))).toBe(true)
		expect(YoutubeRest.resolvers.some((resolver) => (
			resolver.entityType === EntityType.YouTubePlaylist
			&& typeof resolver.fields.$$videos === 'object'
			&& 'resolveCount' in resolver.fields.$$videos
		))).toBe(true)
		expect(YoutubeRest.resolvers.some((resolver) => (
			resolver.entityType === EntityType.YouTubeVideo
			&& typeof resolver.fields.$$comments === 'object'
			&& 'resolveCount' in resolver.fields.$$comments
		))).toBe(true)
		expect(YoutubeRest.resolvers.some((resolver) => (
			resolver.entityType === EntityType.YouTubeComment
			&& typeof resolver.fields.$$replies === 'object'
			&& 'resolveCount' in resolver.fields.$$replies
		))).toBe(true)
	})

	test('Reddit link comments expose provider totals through count selectors', () => {
		for (const sourceResolvers of [
			RedditPublicJson,
			RedditRest,
		]) {
			expect(sourceResolvers.resolvers.some((resolver) => (
				resolver.entityType === EntityType.RedditLink
				&& typeof resolver.fields.$$comments === 'object'
				&& 'resolveCount' in resolver.fields.$$comments
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

		const { cases, resolverDefinitionCount, resolverValuePartCount } = body

		expect(
			resolverDefinitionCount,
			'probe runner must report resolverDefinitionCount',
		).toBeGreaterThan(0)

		expect(
			resolverValuePartCount,
			'probe runner must report resolverValuePartCount',
		).toBeGreaterThan(0)

		expect(body.conditionalScalarDiscriminatorCount).toBeGreaterThan(0)
		expect(body.conditionalItemDiscriminatorCount).toBeGreaterThan(0)
		expect(body.countResolverPartCount).toBeGreaterThan(0)
		expect(body.countResolverFields).toEqual(expect.arrayContaining([
			'EvmBlock.$$transactions',
			'EvmNetwork.$$blocks',
			'EvmNetwork.$$transactions',
			'EvmNetworkAccount.$$tokenTransfers',
			'EvmNetworkAccount.$$transactions',
			'RedditLink.$$comments',
		]))
		expect(body.rootLiveResolverCount).toBeGreaterThan(0)

		expect(
			cases.length,
			'one case per entity resolver + one per field resolver',
		).toBe(resolverDefinitionCount + resolverValuePartCount)

		const entityCases = cases.filter((c) => c.kind === 'entity')
		const fieldCases = cases.filter((c) => c.kind === 'field')

		expect(entityCases.length, 'entity case count').toBe(resolverDefinitionCount)
		expect(fieldCases.length, 'field case count').toBe(resolverValuePartCount)

		expect(
			new Set(cases.map((c) => c.key)).size,
			'case keys must be unique (one resolver per key)',
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
			&& !isExpectedAssertLoadedResolverProbeFailure(c)
		))
		expect(body.fulfilledButAssertFailed).toEqual(failedAfterResolve)

		for (const category of assertLoadedResolverProbeCategories) {
			expect(body.categorySummary[category]).toBeDefined()
		}
	})
})
