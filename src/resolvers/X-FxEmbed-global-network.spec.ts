import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import bindings from '$/sources/FxEmbed/bindings.ts'
import { Source } from '$/sources/Source.ts'

const fxEmbedBinding = bindings[Source.X_FxEmbed_Rest][0]

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

		const snapshot = await globalNetworkResolvers[0]
			.resolve['Scope']
			.resolve(
				{ scope: EntityType._GlobalXNetwork },
				resolverContext
			)
		const users = globalNetworkResolvers[0].projections.$$observedUsers(snapshot)
		const posts = globalNetworkResolvers[0].projections.$$observedPosts(snapshot)

		expect(fxEmbedQueries.searchStatuses).toHaveBeenCalledOnce()
		expect(fxEmbedQueries.searchStatuses).toHaveBeenCalledWith(2)
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
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.XUser, [], 'username')]: 'reader',
							[entityFieldAddressKey(EntityType.XUser, [], 'name')]: 'Fixture Reader',
						},
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
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.XUser, [], 'username')]: 'second',
						},
					},
				},
			},
		])
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

		const snapshot = await globalNetworkResolvers[0]
			.resolve['Scope']
			.resolve(
				{ scope: EntityType._GlobalXNetwork },
				resolverContext
			)
		expect(globalNetworkResolvers[0].projections.$$observedUsers(snapshot)).toEqual([])
		expect(globalNetworkResolvers[0].projections.$$observedPosts(snapshot)).toEqual([{
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
