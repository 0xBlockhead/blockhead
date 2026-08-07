import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const readLatestRound = vi.fn()
const readRound = vi.fn()
const getPriceFeed = vi.fn()

vi.mock('$/sources/ChainlinkDataFeeds/Contracts/queries.ts', () => ({
	readLatestRound,
	readRound,
}))

vi.mock('$/sources/ChainlinkDataFeeds/AddressCatalog/queries.ts', async (importOriginal) => ({
	...await importOriginal(),
	getPriceFeed,
}))

vi.mock('$/sources/Voltaire/JsonRpc/queries.ts', () => ({
	voltaireJsonRpcTransports: {
		httpTransportsByChainId: {
			1: [{
				diagnosticLabel: 'voltaire-test',
				getBlockNumber: async () => 0x1234n,
				getCall: async () => '0x',
			}],
		},
	},
}))

const { default: addressCatalog } = await import('$/resolvers/ChainlinkDataFeeds-AddressCatalog.ts')
const { default: contracts } = await import('$/resolvers/ChainlinkDataFeeds-Contracts.ts')

const ethUsd = {
	chainId: 1,
	proxyAddress: '0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419',
	baseAsset: 'ETH',
	quoteAsset: 'USD',
	decimals: 8,
	feedKind: 'price',
	label: 'ETH / USD',
} as const

const latest = {
	network: 'eip155:1' as const,
	feedAddress: ethUsd.proxyAddress,
	aggregatorAddress: '0x2222222222222222222222222222222222222222',
	baseAsset: 'ETH',
	quoteAsset: 'USD',
	description: 'ETH / USD',
	decimals: 8,
	roundId: ((1n << 79n) + 25n).toString(),
	answer: '123',
	startedAtSeconds: '1699999890',
	updatedAtSeconds: '1699999900',
	answeredInRound: ((1n << 79n) + 25n).toString(),
	blockNumber: '4660',
}

describe('ChainlinkDataFeeds resolvers', () => {
	it('projects catalog OracleFeed identity fields', async () => {
		expect(addressCatalog.source).toBe(Source.ChainlinkDataFeeds_AddressCatalog)
		const resolver = addressCatalog.resolvers.find((candidate) => (
			candidate.entityType === EntityType.OracleFeed
		))
		if (resolver == null)
			throw new Error('missing OracleFeed address-catalog resolver')

		getPriceFeed.mockReturnValue(ethUsd)
		await expect(resolver.resolve.EvmNetworkAddress.resolve({
			$network: {
				caip2: {
					namespace: 'eip155',
					reference: '1',
				},
			},
			address: ethUsd.proxyAddress,
		})).resolves.toMatchObject({
			address: ethUsd.proxyAddress,
			label: 'ETH / USD',
			feedKind: 'price',
			$network: {
				[EntityMetaKey.Selector]: {
					caip2: {
						namespace: 'eip155',
						reference: '1',
					},
				},
			},
		})
	})

	it('projects Contracts OracleFeed tip rounds/timestamps and round/timestamp entities', async () => {
		expect(contracts.source).toBe(Source.ChainlinkDataFeeds_Contracts)
		getPriceFeed.mockReturnValue(ethUsd)
		readLatestRound.mockResolvedValue(latest)
		readRound.mockResolvedValue(latest)

		const feedResolver = contracts.resolvers.find((candidate) => (
			candidate.entityType === EntityType.OracleFeed
		))
		const roundResolver = contracts.resolvers.find((candidate) => (
			candidate.entityType === EntityType.OracleFeed_Round
		))
		const timestampResolver = contracts.resolvers.find((candidate) => (
			candidate.entityType === EntityType.OracleFeed_Timestamp
		))
		if (feedResolver == null || roundResolver == null || timestampResolver == null)
			throw new Error('missing Chainlink Contracts oracle resolvers')

		const feed = await feedResolver.resolve.EvmNetworkAddress.resolve({
			$network: {
				caip2: {
					namespace: 'eip155',
					reference: '1',
				},
			},
			address: ethUsd.proxyAddress,
		})
		expect(feed).toMatchObject({
			label: 'ETH / USD',
			feedKind: 'price',
		})
		expect(feed.$$rounds).toHaveLength(1)
		expect(feed.$$timestamps).toHaveLength(1)
		expect(feed.$$timestamps[0][EntityMetaKey.Selector].timestampMs).toBe(1_699_999_900_000)
		expect(feed.$$timestamps[0][EntityMetaKey.Selector].source).toBe(Source.ChainlinkDataFeeds_Contracts)

		await expect(roundResolver.resolve.OracleFeedRoundId.resolve({
			$oracleFeed: {
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '1',
					},
				},
				address: ethUsd.proxyAddress,
			},
			roundId: BigInt(latest.roundId),
		})).resolves.toMatchObject({
			answer: 123n,
			startedAtMs: 1_699_999_890_000,
			updatedAtMs: 1_699_999_900_000,
			blockNumber: 4660n,
		})

		await expect(timestampResolver.resolve.OracleFeedTimestampMsSource.resolve({
			$oracleFeed: {
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '1',
					},
				},
				address: ethUsd.proxyAddress,
			},
			timestampMs: 1_699_999_900_000,
			source: Source.ChainlinkDataFeeds_Contracts,
		})).resolves.toMatchObject({
			decimals: 8,
			description: 'ETH / USD',
			aggregatorAddress: latest.aggregatorAddress,
			latestRoundId: BigInt(latest.roundId),
			latestUpdatedAtMs: 1_699_999_900_000,
		})
	})
})
