import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import bindings from '$/sources/AtprotoBsky/bindings.ts'
import { Source } from '$/sources/Source.ts'

const { searchActors, searchPosts } = vi.hoisted(() => ({
	searchActors: vi.fn(),
	searchPosts: vi.fn(),
}))

vi.mock('$/sources/AtprotoBsky/Rest/queries.ts', () => ({
	searchActors,
	searchPosts,
}))

const { bskyAppViewResolvers } = await import('$/resolvers/BskyAppViewXrpc.ts')

const context = {
	filters: [],
	sorts: [],
	pagination: { limit: 4 },
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
	sourceBinding: bindings[Source.Atproto_Xrpc][0],
}

const hubResolver = () => {
	const module = bskyAppViewResolvers(
		Source.Atproto_Xrpc,
		() => import('$/sources/AtprotoBsky/Rest/queries.ts')
	)
	const resolver = module.resolvers.find((candidate) => (
		candidate.entityType === EntityType._GlobalAtprotoNetwork
		&& '$$timestamps' in candidate.projections
	))
	if (resolver == null || !('Scope' in resolver.resolve))
		throw new Error('missing AppView hub timestamp resolver')
	return resolver
}

describe('Bsky AppView hub observations', () => {
	beforeEach(() => {
		searchActors.mockReset()
		searchPosts.mockReset()
	})
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('emits each current source snapshot at its selected timestamp with native fields and provenance', async () => {
		const resolver = hubResolver()
		if (!('Scope' in resolver.resolve))
			throw new Error('missing AppView hub scope resolver')
		const resolve = resolver.resolve.Scope
		const timestamps = resolver.projections.$$timestamps
		const now = vi.spyOn(Date, 'now')
			.mockReturnValueOnce(1_700_000_000_000)
			.mockReturnValueOnce(1_700_000_001_000)
		searchActors
			.mockResolvedValueOnce({ actors: [{ did: 'did:plc:alice', handle: 'alice.test' }] })
			.mockResolvedValueOnce({ actors: [{ did: 'did:plc:alice', handle: 'alice.test' }, { did: 'did:plc:bob', handle: 'bob.test' }] })
		searchPosts
			.mockResolvedValueOnce({ posts: [{ uri: 'at://alice/post/one' }] })
			.mockResolvedValueOnce({ posts: [{ uri: 'at://alice/post/one' }, { uri: 'at://alice/post/two' }, { uri: 'at://alice/post/three' }] })

		const first = await resolve.resolve({ scope: '_GlobalAtprotoNetwork' }, context)
		const second = await resolve.resolve({ scope: '_GlobalAtprotoNetwork' }, context)
		const expectedFirstRows = [{
			[EntityMetaKey.Selector]: { $hub: { scope: '_GlobalAtprotoNetwork' }, timestampMs: 1_700_000_000_000, source: Source.Atproto_Xrpc },
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType._GlobalAtprotoNetwork_Timestamp, [], 'source')]: Source.Atproto_Xrpc,
				[entityFieldAddressKey(EntityType._GlobalAtprotoNetwork_Timestamp, [], 'observedActorCount')]: 1,
				[entityFieldAddressKey(EntityType._GlobalAtprotoNetwork_Timestamp, [], 'observedPostCount')]: 1,
				[entityFieldAddressKey(EntityType._GlobalAtprotoNetwork_Timestamp, [], 'relayHost')]: 'public.api.bsky.app',
				[entityFieldAddressKey(EntityType._GlobalAtprotoNetwork_Timestamp, [], 'reachable')]: true,
			},
		}]
		const expectedSecondRows = [{
			[EntityMetaKey.Selector]: { $hub: { scope: '_GlobalAtprotoNetwork' }, timestampMs: 1_700_000_001_000, source: Source.Atproto_Xrpc },
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType._GlobalAtprotoNetwork_Timestamp, [], 'source')]: Source.Atproto_Xrpc,
				[entityFieldAddressKey(EntityType._GlobalAtprotoNetwork_Timestamp, [], 'observedActorCount')]: 2,
				[entityFieldAddressKey(EntityType._GlobalAtprotoNetwork_Timestamp, [], 'observedPostCount')]: 3,
				[entityFieldAddressKey(EntityType._GlobalAtprotoNetwork_Timestamp, [], 'relayHost')]: 'public.api.bsky.app',
				[entityFieldAddressKey(EntityType._GlobalAtprotoNetwork_Timestamp, [], 'reachable')]: true,
			},
		}]

		expect(first).toMatchObject({ $$timestamps: expectedFirstRows })
		expect(second).toMatchObject({ $$timestamps: expectedSecondRows })
		expect(timestamps.select(first)).toEqual(expectedFirstRows)
		expect(timestamps.select(second)).toEqual(expectedSecondRows)
		expect(timestamps).not.toHaveProperty('resolveCount')
		expect(now).toHaveBeenCalledTimes(2)
	})

	it('preserves actor and post source failures instead of manufacturing an observation', async () => {
		const resolver = hubResolver()
		if (!('Scope' in resolver.resolve))
			throw new Error('missing AppView hub scope resolver')
		const resolve = resolver.resolve.Scope
		searchActors.mockRejectedValueOnce(new Error('actor transport failed'))
		searchPosts.mockResolvedValueOnce({ posts: [] })
		await expect(resolve.resolve({ scope: '_GlobalAtprotoNetwork' }, context)).rejects.toThrow('actor transport failed')

		searchActors.mockResolvedValueOnce({ actors: [] })
		searchPosts.mockRejectedValueOnce(new Error('post transport failed'))
		await expect(resolve.resolve({ scope: '_GlobalAtprotoNetwork' }, context)).rejects.toThrow('post transport failed')
	})
})
