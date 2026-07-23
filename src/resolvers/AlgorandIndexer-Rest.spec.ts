import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { AlgorandAccountSelector } from '$/schema/AlgorandAccount.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'

const {
	getAccount,
	getAccountAssets,
} = vi.hoisted(() => ({
	getAccount: vi.fn(),
	getAccountAssets: vi.fn(),
}))

vi.mock('$/sources/AlgorandIndexer/Rest/queries.ts', () => ({
	getAccount,
	getAccountAssets,
}))

const { default: algorandIndexerResolvers } = await import('$/resolvers/AlgorandIndexer-Rest.ts')

const holdingsResolver = algorandIndexerResolvers.resolvers.find((resolver) => (
	'$$assetHoldingRounds' in resolver.projections
))
const observationsResolver = algorandIndexerResolvers.resolvers.find((resolver) => (
	'$$timestamps' in resolver.projections
))

if (holdingsResolver == null || observationsResolver == null)
	throw new Error('AlgorandIndexer-Rest spec missing account portfolio resolvers')

const binding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((candidate) => (
		candidate.source === Source.Nodely_AlgorandIndexer_Rest
		&& candidate.target.kind === 'NetworkSlug'
		&& candidate.target.key === networkBySlug.algorand.slug
	))

if (binding == null)
	throw new Error('AlgorandIndexer-Rest spec missing canonical Nodely source binding')

const network = {
	$network: {
		slug: networkBySlug.algorand.slug,
	},
}
const account = {
	$network: network,
	address: 'A'.repeat(58),
}
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
	providerContinuationToken: 'opaque-current',
}

describe('Algorand Indexer account portfolio resolver', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('declares the canonical architecture-neutral Algorand selector applicability', () => {
		expect(holdingsResolver.resolve[
			AlgorandAccountSelector.NetworkAddress
		].appliesTo).toEqual([{
			$network: {
				$network: {
					slug: networkBySlug.algorand.slug,
				},
			},
		}])
		expect(algorandIndexerResolvers.source).toBe(Source.Nodely_AlgorandIndexer_Rest)
	})

	it('materializes paginated asset holding observations with exact identity and provenance', async () => {
		getAccountAssets.mockResolvedValueOnce({
			assets: [{
				amount: 123,
				'asset-id': 42,
				deleted: false,
				'is-frozen': true,
				'opted-in-at-round': 80,
			}, {
				amount: 7,
				'asset-id': 8,
				'is-frozen': false,
			}],
			'current-round': 100,
			'next-token': 'opaque-next',
		})

		const page = await holdingsResolver.resolve[
			AlgorandAccountSelector.NetworkAddress
		].resolve(account, resolverContext)
		const projection = holdingsResolver.projections.$$assetHoldingRounds
		if (
			typeof projection === 'function'
			|| projection.select == null
			|| projection.continuation == null
		)
			throw new Error('AlgorandIndexer-Rest spec missing holding pagination')

		const holdings = projection.select(page, account, resolverContext)
		const [holding] = holdings
		expect(getAccountAssets).toHaveBeenCalledWith(
			binding,
			{
				address: account.address,
				limit: 2,
				next: 'opaque-current',
			}
		)
		expect(holding[EntityMetaKey.Selector]).toEqual({
			$account: account,
			$asset: {
				$network: network,
				assetId: 42n,
			},
			round: 100n,
			source: Source.Nodely_AlgorandIndexer_Rest,
		})
		expect(holding[EntityMetaKey.Fields]).toEqual({
			[entityFieldAddressKey(EntityType.AlgorandAssetHolding_Round, [], 'amount')]: 123n,
			[entityFieldAddressKey(EntityType.AlgorandAssetHolding_Round, [], 'frozen')]: true,
			[entityFieldAddressKey(EntityType.AlgorandAssetHolding_Round, [], 'optedInAtRound')]: 80n,
			[entityFieldAddressKey(EntityType.AlgorandAssetHolding_Round, [], 'deleted')]: false,
		})
		expect(holdings.map((item) => item[EntityMetaKey.Selector].$asset.assetId)).toEqual([
			42n,
			8n,
		])
		expect(projection.continuation(page, account, resolverContext)).toEqual({
			operation: 'account-asset-holdings',
			target: account.address,
			terminal: false,
			token: 'opaque-next',
		})
	})

	it('materializes the current account observation and avoids a zero-limit request', async () => {
		getAccount.mockResolvedValueOnce({
			account: {
				address: account.address,
				amount: 9_000_000,
				'pending-rewards': 2,
				'reward-base': 3,
				status: 'Online',
			},
			'current-round': 100,
		})

		const observations = await observationsResolver.resolve[
			AlgorandAccountSelector.NetworkAddress
		].resolve(account, {
			...resolverContext,
			providerContinuationToken: undefined,
		})
		const projection = observationsResolver.projections.$$timestamps
		if (typeof projection !== 'function')
			throw new Error('AlgorandIndexer-Rest spec missing observation projection')
		const [observation] = projection(observations, account, resolverContext)
		expect(observation[EntityMetaKey.Selector]).toEqual({
			$account: account,
			round: 100n,
			source: Source.Nodely_AlgorandIndexer_Rest,
		})
		expect(observation[EntityMetaKey.Fields]).toEqual({
			[entityFieldAddressKey(EntityType.AlgorandAccount_Timestamp, [], 'amount')]: 9_000_000n,
			[entityFieldAddressKey(EntityType.AlgorandAccount_Timestamp, [], 'pendingRewards')]: 2n,
			[entityFieldAddressKey(EntityType.AlgorandAccount_Timestamp, [], 'rewardsBase')]: 3n,
			[entityFieldAddressKey(EntityType.AlgorandAccount_Timestamp, [], 'status')]: 'Online',
		})

		await observationsResolver.resolve[
			AlgorandAccountSelector.NetworkAddress
		].resolve(account, {
			...resolverContext,
			pagination: {
				limit: 0,
			},
		})
		expect(getAccount).toHaveBeenCalledTimes(1)
	})

	it('rejects a foreign network before invoking provider transport', async () => {
		await expect(holdingsResolver.resolve[
			AlgorandAccountSelector.NetworkAddress
		].resolve({
			$network: {
				$network: {
					slug: 'not-algorand',
				},
			},
			address: account.address,
		}, resolverContext)).rejects.toThrow('unsupported network')
		expect(getAccountAssets).not.toHaveBeenCalled()
	})
})
