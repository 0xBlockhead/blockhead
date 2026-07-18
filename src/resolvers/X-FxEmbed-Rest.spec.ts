import { describe, expect, it, vi } from 'vitest'

import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { XNetworkSelector } from '$/schema/XNetwork.ts'
import { XUserSelector } from '$/schema/XUser.ts'

const fxEmbedQueries = vi.hoisted(() => ({
	getStatus: vi.fn(),
	getUser: vi.fn(),
	getUserStatuses: vi.fn(),
	searchStatuses: vi.fn(),
}))

vi.mock('$/sources/FxEmbed/Rest/queries.ts', () => fxEmbedQueries)

const { default: fxEmbedResolvers } = await import('$/resolvers/X-FxEmbed-Rest.ts')

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
	limit: 10,
}

describe('X FxEmbed reading materialization', () => {
	it('prefills readable users and posts from network search results', async () => {
		fxEmbedQueries.searchStatuses.mockResolvedValue({
			results: [{
				type: 'status',
				id: 'post-1',
				text: 'Readable fixture post',
				created_timestamp: 1_768_435_200,
				author: {
					id: 'user-1',
					screen_name: 'reader',
					name: 'Fixture Reader',
				},
			}],
		})

		const users = await fxEmbedResolvers.resolvers[4].resolve[XNetworkSelector.Scope].resolve(
			{ scope: 'XNetwork' },
			resolverContext
		)
		const posts = await fxEmbedResolvers.resolvers[5].resolve[XNetworkSelector.Scope].resolve(
			{ scope: 'XNetwork' },
			resolverContext
		)

		expect(users).toEqual([{
			[EntityMetaKey.Selector]: { id: 'user-1' },
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.XUser, [], 'username')]: 'reader',
				[entityFieldAddressKey(EntityType.XUser, [], 'name')]: 'Fixture Reader',
			},
		}])
		expect(posts).toEqual([{
			[EntityMetaKey.Selector]: { id: 'post-1' },
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.XPost, [], 'text')]: 'Readable fixture post',
				[entityFieldAddressKey(EntityType.XPost, [], 'createdAt')]: 1_768_435_200_000,
				[entityFieldAddressKey(EntityType.XPost, [], 'postUrl')]:
					'https://x.com/i/web/status/post-1',
				[entityFieldAddressKey(EntityType.XPost, [], '$author')]: {
					[EntityMetaKey.Selector]: { id: 'user-1' },
				},
			},
		}])
	})

	it('prefills profile posts without leaking tombstones into the reading list', async () => {
		fxEmbedQueries.getUserStatuses.mockResolvedValue({
			results: [
				{
					type: 'status',
					id: 'post-2',
					text: 'Profile fixture post',
					created_timestamp: 1_768_435_201,
				},
				{
					type: 'tombstone',
					id: 'removed-post',
				},
			],
		})

		const posts = await fxEmbedResolvers.resolvers[8].resolve[XUserSelector.Id].resolve(
			{ id: 'user-1' },
			resolverContext
		)

		expect(posts).toEqual([{
			[EntityMetaKey.Selector]: { id: 'post-2' },
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.XPost, [], 'text')]: 'Profile fixture post',
				[entityFieldAddressKey(EntityType.XPost, [], 'createdAt')]: 1_768_435_201_000,
				[entityFieldAddressKey(EntityType.XPost, [], 'postUrl')]:
					'https://x.com/i/web/status/post-2',
			},
		}])
	})
})
