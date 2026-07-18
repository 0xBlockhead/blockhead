import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { _GlobalXNetworkSelector } from '$/schema/_GlobalXNetwork.ts'

const fxEmbedQueries = vi.hoisted(() => ({
	getStatus: vi.fn(),
	getUser: vi.fn(),
	getUserStatuses: vi.fn(),
	searchStatuses: vi.fn(),
}))

vi.mock('$/sources/FxEmbed/Rest/queries.ts', () => fxEmbedQueries)

const { default: fxEmbedResolvers } = await import('$/resolvers/X-FxEmbed-Rest.ts')

const globalNetworkResolvers = fxEmbedResolvers.resolvers.filter((resolver) => (
	resolver.entityType === EntityType._GlobalXNetwork
))

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 2,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

describe('X FxEmbed global network', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('materializes typed observed users and posts at the resolver limit', async () => {
		fxEmbedQueries.searchStatuses.mockResolvedValue({
			results: [
				{
					type: 'status',
					id: 'post-1',
					text: 'First post',
					created_timestamp: 1_768_435_200,
					author: {
						id: 'user-1',
						screen_name: 'reader',
						name: 'Fixture Reader',
					},
				},
				{
					type: 'status',
					id: 'post-2',
					author: {
						id: 'user-2',
						screen_name: 'second',
					},
				},
				{
					type: 'tombstone',
					id: 'removed-post',
				},
			],
		})

		const users = await globalNetworkResolvers[0]
			.resolve[_GlobalXNetworkSelector.Scope]
			.resolve(
				{ scope: EntityType._GlobalXNetwork },
				resolverContext
			)
		const posts = await globalNetworkResolvers[1]
			.resolve[_GlobalXNetworkSelector.Scope]
			.resolve(
				{ scope: EntityType._GlobalXNetwork },
				resolverContext
			)

		expect(fxEmbedQueries.searchStatuses).toHaveBeenNthCalledWith(1, 2)
		expect(fxEmbedQueries.searchStatuses).toHaveBeenNthCalledWith(2, 2)
		expect(users).toEqual([
			{
				[EntityMetaKey.Selector]: { id: 'user-1' },
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.XUser, [], 'username')]: 'reader',
					[entityFieldAddressKey(EntityType.XUser, [], 'name')]: 'Fixture Reader',
				},
			},
			{
				[EntityMetaKey.Selector]: { id: 'user-2' },
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.XUser, [], 'username')]: 'second',
				},
			},
		])
		expect(posts).toEqual([
			{
				[EntityMetaKey.Selector]: { id: 'post-1' },
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.XPost, [], 'text')]: 'First post',
					[entityFieldAddressKey(EntityType.XPost, [], 'createdAt')]:
						1_768_435_200_000,
					[entityFieldAddressKey(EntityType.XPost, [], 'postUrl')]:
						'https://x.com/i/web/status/post-1',
					[entityFieldAddressKey(EntityType.XPost, [], '$author')]: {
						[EntityMetaKey.Selector]: { id: 'user-1' },
					},
				},
			},
			{
				[EntityMetaKey.Selector]: { id: 'post-2' },
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.XPost, [], 'postUrl')]:
						'https://x.com/i/web/status/post-2',
					[entityFieldAddressKey(EntityType.XPost, [], '$author')]: {
						[EntityMetaKey.Selector]: { id: 'user-2' },
					},
				},
			},
		])
	})

	it('rejects unrelated scopes before calling the provider', async () => {
		for (const resolver of globalNetworkResolvers)
			await expect(
				resolver.resolve[_GlobalXNetworkSelector.Scope].resolve(
					{ scope: 'youtube' },
					resolverContext
				)
			).rejects.toThrow('unsupported global X scope youtube')

		expect(fxEmbedQueries.searchStatuses).not.toHaveBeenCalled()
	})

	it('drops malformed typed rows instead of fabricating selectors', async () => {
		fxEmbedQueries.searchStatuses.mockResolvedValue({
			results: [
				{
					type: 'status',
					id: 'valid-post',
					author: {
						id: 'missing-handle',
					},
				},
				{
					type: 'tombstone',
					id: 'removed-post',
					author: {
						id: 'removed-user',
						screen_name: 'removed',
					},
				},
			],
		})

		expect(await globalNetworkResolvers[0]
			.resolve[_GlobalXNetworkSelector.Scope]
			.resolve(
				{ scope: EntityType._GlobalXNetwork },
				resolverContext
			)).toEqual([])
		expect(await globalNetworkResolvers[1]
			.resolve[_GlobalXNetworkSelector.Scope]
			.resolve(
				{ scope: EntityType._GlobalXNetwork },
				resolverContext
			)).toEqual([{
			[EntityMetaKey.Selector]: { id: 'valid-post' },
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.XPost, [], 'postUrl')]:
					'https://x.com/i/web/status/valid-post',
				[entityFieldAddressKey(EntityType.XPost, [], '$author')]: {
					[EntityMetaKey.Selector]: { id: 'missing-handle' },
				},
			},
		}])
	})
})
