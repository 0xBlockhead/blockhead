import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

const xQueries = vi.hoisted(() => ({
	getTweet: vi.fn(),
	getUser: vi.fn(),
	getUserByUsername: vi.fn(),
	listUserTweets: vi.fn(),
	searchRecentTweets: vi.fn(),
}))

vi.mock('$/sources/X/Rest/queries.ts', () => xQueries)

const { default: xResolvers } = await import('$/resolvers/X-Rest.ts')

const networkResolver = xResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.XNetwork
	&& '$$xPosts' in resolver.projections
))
const globalNetworkResolver = xResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType._GlobalXNetwork
	&& '$$observedPosts' in resolver.projections
))

if (networkResolver == null || globalNetworkResolver == null)
	throw new Error('X Rest spec missing network observation resolvers')

const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {
		PUBLIC_X_API_BEARER: 'fixture',
	},
	limit: 10,
	providerContinuationToken: 'opaque/+%',
}

beforeEach(() => {
	for (const query of Object.values(xQueries))
		query.mockReset()
})

describe('X Rest network search projections', () => {
	it('projects recent search onto XNetwork and _GlobalXNetwork with continuation', async () => {
		xQueries.searchRecentTweets.mockResolvedValue({
			data: [{
				id: '1890000000000000000',
				text: 'Search hit',
				author_id: '44196397',
				created_at: '2026-01-15T00:00:00.000Z',
			}],
			includes: {
				users: [{
					id: '44196397',
					username: 'fixture_reader',
					name: 'Fixture Reader',
				}],
			},
			meta: {
				next_token: 'next/+%',
			},
		})

		const page = await networkResolver.resolve.Scope.resolve(
			{ scope: 'XNetwork' },
			context
		)
		const xPosts = networkResolver.projections.$$xPosts
		const observedPosts = globalNetworkResolver.projections.$$observedPosts
		if (typeof xPosts === 'function' || typeof observedPosts === 'function')
			throw new Error('X Rest network projections missing continuation')

		expect(xPosts.select?.(page, { scope: 'XNetwork' }, context)).toEqual([{
			[EntityMetaKey.Selector]: { id: '1890000000000000000' },
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.XPost, [], 'text')]: 'Search hit',
				[entityFieldAddressKey(EntityType.XPost, [], 'createdAt')]: 1_768_435_200_000,
				[entityFieldAddressKey(EntityType.XPost, [], '$author')]: {
					[EntityMetaKey.Selector]: { id: '44196397' },
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.XUser, [], 'username')]:
							'fixture_reader',
						[entityFieldAddressKey(EntityType.XUser, [], 'name')]:
							'Fixture Reader',
					},
				},
			},
		}])
		expect(xPosts.continuation?.(page, { scope: 'XNetwork' }, context)).toEqual({
			operation: 'tweets/search/recent',
			target: 'api-v2',
			terminal: false,
			token: 'next/+%',
		})

		const globalPage = await globalNetworkResolver.resolve.Scope.resolve(
			{ scope: EntityType._GlobalXNetwork },
			context
		)
		expect(observedPosts.select?.(
			globalPage,
			{ scope: EntityType._GlobalXNetwork },
			context
		)).toHaveLength(1)
		expect(xQueries.searchRecentTweets).toHaveBeenCalledWith(
			context.publicEnv,
			expect.any(Number),
			'opaque/+%'
		)
	})

	it('converges Username lookup onto provider-owned id and current username', async () => {
		xQueries.getUserByUsername.mockResolvedValue({
			data: {
				id: '44196397',
				username: 'current_reader',
				name: 'Current',
			},
		})

		await expect(xResolvers.resolvers[0].resolve.Username.resolve(
			{ username: 'former_reader' },
			context
		)).resolves.toMatchObject({
			id: '44196397',
			username: 'current_reader',
			name: 'Current',
		})
		expect(xQueries.getUserByUsername).toHaveBeenCalledWith(
			context.publicEnv,
			'former_reader'
		)
	})
})
