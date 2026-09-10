import { afterEach, expect, it, vi } from 'vitest'
import { materializeField } from '../../tests/materializeField.ts'
import { createResolverContext } from '../../tests/resolverContext.ts'
import { materializeResolverOutput, ResolverOutputMaterialization } from '$/collections/assertLoadedCollectionRows.ts'
import { EntityMetaKey, entityFieldAddressKey, entitySelectorKey } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { entityDefinitionByType, schema, schemaMeta } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import type { rssResolvers } from '$/resolvers/Rss.ts'

const { directFeed, convertedFeed } = vi.hoisted(() => ({
	directFeed: vi.fn(),
	convertedFeed: vi.fn(),
}))

vi.mock('$/sources/Rss/Rest/queries.ts', () => ({
	getFeed: directFeed,
	rssBindingByOrigin: new Map([['https://hnrss.org', { requestOwner: 'rss-materialization' }]]),
}))
vi.mock('$/sources/Rss2Json/Rest/queries.ts', () => ({ getFeed: convertedFeed }))

const { default: rss } = await import('$/resolvers/Rss-Rest.ts')
const { default: rss2Json } = await import('$/resolvers/Rss2Json-Rest.ts')
const feedSelector = { feedUrl: 'https://hnrss.org/frontpage' }
const itemSelector = {
	$feed: feedSelector,
	itemIdentityKind: 'Guid',
	itemIdentity: 'item-1',
} as const
const context = createResolverContext()

const observationReader = <_Source extends Source.Rss_Rest | Source.Rss2Json_Rest>(
	provider: ReturnType<typeof rssResolvers<_Source>>
) => {
	const feedResolver = provider.resolvers.find((resolver) => resolver.entityType === EntityType.RssFeed)
	const itemResolver = provider.resolvers.find((resolver) => resolver.entityType === EntityType.RssItem)
	if (
		feedResolver == null || !('FeedUrl' in feedResolver.resolve)
		|| itemResolver == null || !('FeedIdentity' in itemResolver.resolve)
	)
		throw new Error('missing RSS parent resolver')

	return {
		source: provider.source,
		feed: async () => feedResolver.projections.$$timestamps(
			await feedResolver.resolve.FeedUrl.resolve(feedSelector, context)
		),
		item: async () => itemResolver.projections.$$timestamps(
			await itemResolver.resolve.FeedIdentity.resolve(itemSelector)
		),
	}
}
const providers = [observationReader(rss), observationReader(rss2Json)]

afterEach(() => {
	directFeed.mockReset()
	convertedFeed.mockReset()
	vi.restoreAllMocks()
})

// Explicit scalar contract probe: partial references do not infer omitted fields.
const materializeObservation = (
	entityType: EntityType.RssFeed_Timestamp | EntityType.RssItem_Timestamp,
	fieldName: 'observedItemCount' | 'observed',
	observation: {
		[EntityMetaKey.Selector]: object
		[EntityMetaKey.Fields]: Record<string, unknown>
	},
	source: Source
) => {
	const selector = observation[EntityMetaKey.Selector]
	const value = observation[EntityMetaKey.Fields][entityFieldAddressKey(entityType, [], fieldName)]
	if (value === undefined) {
		const fieldDefinition = schemaMeta.entityFieldDefinitionByEntityTypePathAndName[entityType][
			entityFieldAddressKey(entityType, [], fieldName)
		]
		const entityDefinition = entityDefinitionByType[entityType]
		if (fieldDefinition?.type !== EntityFieldType.Primitive)
			throw new Error(`${entityType}.${fieldName} is not a registered primitive`)

		expect(() => materializeResolverOutput({
			kind: ResolverOutputMaterialization.Field,
			schema,
			schemaIndex: schemaMeta,
			entityDefinition,
			parentSelector: selector,
			parentSelectorKey: entitySelectorKey(schema, entityDefinition, selector),
			fieldDefinition: {
				...fieldDefinition,
				cardinality: EntityFieldCardinality.One,
			},
			value,
			source,
		})).toThrow('required field returned no value')
	}
	return materializeField(entityType, selector, fieldName, value, source)
}

it.each([Source.Rss_Rest, Source.Rss2Json_Rest])(
	'keeps same-subject successful and failed observations separate when %s succeeds',
	async (successfulSource) => {
		vi.spyOn(Date, 'now').mockReturnValue(1_750_000_000_000)
		const failure = new Error('feed unavailable')
		const items = [{ guid: 'item-1' }]
		if (successfulSource === Source.Rss_Rest) {
			directFeed.mockResolvedValue({ items })
			convertedFeed.mockRejectedValue(failure)
		} else {
			directFeed.mockRejectedValue(failure)
			convertedFeed.mockResolvedValue({
				status: 'ok',
				feed: { url: feedSelector.feedUrl },
				items,
			})
		}
		const feedReferences = []
		const itemReferences = []
		const counts = []
		const observed = []
		for (const provider of providers) {
			const feedObservations = await provider.feed()
			const itemObservations = await provider.item()
			feedReferences.push(...materializeField(EntityType.RssFeed, feedSelector, '$$timestamps', feedObservations, provider.source))
			itemReferences.push(...materializeField(EntityType.RssItem, itemSelector, '$$timestamps', itemObservations, provider.source))
			for (const [entityType, observations] of [
				[EntityType.RssFeed_Timestamp, feedObservations],
				[EntityType.RssItem_Timestamp, itemObservations],
			] as const) {
				const observation: Parameters<typeof materializeObservation>[2] = observations[0]
				expect(observation[EntityMetaKey.Selector]).toMatchObject({
					timestampMs: 1_750_000_000_000,
					source: provider.source,
				})
				expect(materializeField(
					entityType,
					observation[EntityMetaKey.Selector],
					'reachable',
					observation[EntityMetaKey.Fields][entityFieldAddressKey(entityType, [], 'reachable')],
					provider.source
				).map((row) => row[EntityMetaKey.Value])).toEqual([provider.source === successfulSource])
				if (provider.source !== successfulSource)
					expect(materializeField(
						entityType,
						observation[EntityMetaKey.Selector],
						'error',
						observation[EntityMetaKey.Fields][entityFieldAddressKey(entityType, [], 'error')],
						provider.source
					).map((row) => row[EntityMetaKey.Value])).toEqual([failure.message])
			}
			counts.push(...materializeObservation(EntityType.RssFeed_Timestamp, 'observedItemCount', feedObservations[0], provider.source))
			observed.push(...materializeObservation(EntityType.RssItem_Timestamp, 'observed', itemObservations[0], provider.source))
		}
		for (const references of [feedReferences, itemReferences]) {
			expect(references).toHaveLength(2)
			expect(new Set(references.map((row) => row.valueKey)).size).toBe(2)
		}
		for (const [rows, value, subject] of [
			[counts, 1, { $feed: feedSelector }],
			[observed, true, { $item: itemSelector }],
		] as const) {
			expect(rows).toHaveLength(1)
			expect(rows[0]).toMatchObject({
				[EntityMetaKey.ParentSelector]: {
					...subject,
					source: successfulSource,
				},
				[EntityMetaKey.Source]: successfulSource,
				[EntityMetaKey.Value]: value,
			})
		}
		expect(directFeed).toHaveBeenCalledTimes(2)
		expect(convertedFeed).toHaveBeenCalledTimes(2)
	}
)

it('materializes real zero counts from both providers for the same empty feed', async () => {
	directFeed.mockResolvedValue({ items: [] })
	convertedFeed.mockResolvedValue({
		status: 'ok',
		feed: { url: feedSelector.feedUrl },
		items: [],
	})
	for (const provider of providers) {
		const observations = await provider.feed()
		const rows = materializeObservation(EntityType.RssFeed_Timestamp, 'observedItemCount', observations[0], provider.source)
		expect(rows.map((row) => row[EntityMetaKey.Value])).toEqual([0])
	}
})
