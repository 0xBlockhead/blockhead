import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	getCurrentPrices,
	getProtocol,
	getProtocols,
	getYieldPoolChart,
	getYieldPools,
} from '$/sources/Defillama/OpenApi/queries.ts'
import {
	getCurrentPricesJson,
	getProtocolJson,
	getProtocolsJson,
	getYieldPoolChartJson,
	getYieldPoolsJson,
} from '$/sources/Defillama/OpenApi/client.ts'
import { Source } from '$/sources/Source.ts'

vi.mock('$/sources/Defillama/OpenApi/client.ts', () => ({
	getCurrentPricesJson: vi.fn(),
	getProtocolJson: vi.fn(),
	getProtocolsJson: vi.fn(),
	getYieldPoolChartJson: vi.fn(),
	getYieldPoolsJson: vi.fn(),
}))

describe('DefiLlama public protocol and yield observations', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('preserves protocol and chain TVL identities in USD units', async () => {
		vi.mocked(getProtocolsJson).mockResolvedValue([{
			id: '2269',
			name: 'Aave',
			symbol: 'AAVE',
			category: 'Lending',
			chains: [
				'Ethereum',
				'Polygon',
			],
			tvl: 5_200_000_000.125,
			chainTvls: {
				Ethereum: 3_200_000_000.125,
				Polygon: 2_000_000_000,
			},
		}])
		vi.mocked(getProtocolJson).mockResolvedValue({
			id: 'parent#aave',
			name: 'Aave',
			symbol: 'AAVE',
			category: 'Lending',
			chains: ['Ethereum'],
			currentChainTvls: {
				Ethereum: 3_200_000_000.125,
			},
			chainTvls: {
				Ethereum: {
					tvl: [{
						date: 1_725_000_000,
						totalLiquidityUSD: 3_200_000_000.125,
					}],
				},
			},
		})

		await expect(getProtocols()).resolves.toEqual([{
			source: Source.Defillama_OpenApi,
			id: '2269',
			name: 'Aave',
			symbol: 'AAVE',
			category: 'Lending',
			chains: [
				'Ethereum',
				'Polygon',
			],
			tvlUsd: 5_200_000_000.125,
			chainTvlUsd: {
				Ethereum: 3_200_000_000.125,
				Polygon: 2_000_000_000,
			},
		}])
		await expect(getProtocol('aave')).resolves.toMatchObject({
			source: Source.Defillama_OpenApi,
			id: 'parent#aave',
			history: [{
				chainLabel: 'Ethereum',
				timestampMs: 1_725_000_000_000,
				tvlUsd: 3_200_000_000.125,
			}],
		})
	})

	it('keys token price observations by the exact requested public identity', async () => {
		vi.mocked(getCurrentPricesJson).mockResolvedValue({
			coins: {
				'coingecko:ethereum': {
					decimals: 18,
					price: 3_500.125,
					symbol: 'ETH',
					timestamp: 1_725_000_000,
					confidence: 0.99,
				},
			},
		})

		await expect(getCurrentPrices(['coingecko:ethereum'])).resolves.toEqual({
			coins: {
				'coingecko:ethereum': {
					decimals: 18,
					price: 3_500.125,
					symbol: 'ETH',
					timestamp: 1_725_000_000,
					confidence: 0.99,
				},
			},
		})
		await expect(getCurrentPrices([
			'coingecko:ethereum',
			'coingecko:ethereum',
		])).rejects.toThrow('requested coin identities')
	})

	it('preserves APY percentage units, reward identities, and observation time', async () => {
		vi.mocked(getYieldPoolsJson).mockResolvedValue({
			status: 'success',
			data: [{
				pool: 'pool-uuid',
				project: 'aave-v3',
				chain: 'Ethereum',
				symbol: 'USDC',
				tvlUsd: 1_500_000.25,
				apyBase: 3.125,
				apyReward: 0.25,
				apy: 3.375,
				rewardTokens: ['0x1111111111111111111111111111111111111111'],
			}],
		})

		await expect(getYieldPools({ resolvedAtMs: 1_725_000_000_000 })).resolves.toEqual([{
			source: Source.Defillama_OpenApi,
			poolId: 'pool-uuid',
			projectSlug: 'aave-v3',
			chainLabel: 'Ethereum',
			symbol: 'USDC',
			tvlUsd: 1_500_000.25,
			apyBasePercent: 3.125,
			apyRewardPercent: 0.25,
			apyTotalPercent: 3.375,
			rewardTokens: ['0x1111111111111111111111111111111111111111'],
			resolvedAtMs: 1_725_000_000_000,
		}])
	})

	it('preserves ordered pool history timestamps and rejects foreign identities', async () => {
		vi.mocked(getYieldPoolChartJson).mockResolvedValue({
			status: 'success',
			data: [
				{
					timestamp: '2024-01-01T00:00:00.000Z',
					tvlUsd: 1_000,
					apy: 5.2,
				},
				{
					timestamp: '2024-01-02T00:00:00.000Z',
					tvlUsd: 1_100,
					apy: 5.3,
				},
			],
		})
		vi.mocked(getProtocolJson).mockResolvedValue({ id: 'parent#compound' })

		await expect(getYieldPoolChart('pool-uuid')).resolves.toEqual([
			{
				source: Source.Defillama_OpenApi,
				poolId: 'pool-uuid',
				timestampMs: 1_704_067_200_000,
				tvlUsd: 1_000,
				apyTotalPercent: 5.2,
			},
			{
				source: Source.Defillama_OpenApi,
				poolId: 'pool-uuid',
				timestampMs: 1_704_153_600_000,
				tvlUsd: 1_100,
				apyTotalPercent: 5.3,
			},
		])
		await expect(getProtocol('aave')).rejects.toThrow('does not match requested slug')
	})

	it.each([
		[
			'negative TVL',
			{
				status: 'success',
				data: [{
					pool: 'pool',
					project: 'project',
					chain: 'Ethereum',
					symbol: 'ETH',
					tvlUsd: -1,
				}],
			},
		],
		[
			'duplicate pool identity',
			{
				status: 'success',
				data: [
					{
						pool: 'pool',
						project: 'project',
						chain: 'Ethereum',
						symbol: 'ETH',
						tvlUsd: 1,
					},
					{
						pool: 'pool',
						project: 'project',
						chain: 'Ethereum',
						symbol: 'ETH',
						tvlUsd: 2,
					},
				],
			},
		],
	])('rejects %s', async (_label, response) => {
		vi.mocked(getYieldPoolsJson).mockResolvedValue(response)
		await expect(getYieldPools()).rejects.toThrow('Defillama_OpenApi:')
	})
})
