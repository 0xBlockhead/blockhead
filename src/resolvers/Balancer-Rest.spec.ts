import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const graphql = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/Graphql/client.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_shared/wire/Graphql/client.ts')>(),
	graphql,
}))

const { default: balancerRest } = await import('$/resolvers/Balancer-Rest.ts')

const ethereumNetwork = {
	caip2: {
		namespace: 'eip155',
		reference: '1',
	},
}

const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 16,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const balancerPoolResolver = balancerRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BalancerPool
))

const networkBalancerPoolsResolver = balancerRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Evm' in resolver.projections
	&& '$$balancerPools' in resolver.projections.Evm
))

const evmNetworkAccountResolver = balancerRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.EvmNetworkAccount
	&& '$$balancerPoolBalances' in resolver.projections
))

const weightedV2PoolId = '0x3de27efa2f1aa663ae5d458857e731c129069f29000200000000000000000588'

const weightedV2Pool = {
	id: weightedV2PoolId,
	address: '0x3de27efa2f1aa663ae5d458857e731c129069f29',
	name: '20wstETH-80AAVE',
	type: 'WEIGHTED',
	version: 4,
	protocolVersion: 2,
	chain: 'MAINNET',
	poolTokens: [
		{
			address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
			symbol: 'wstETH',
			balance: '981.9501443290337',
			decimals: 18,
			weight: '0.2',
		},
		{
			address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
			symbol: 'AAVE',
			balance: '101175.36320855851',
			decimals: 18,
			weight: '0.8',
		},
	],
	dynamicData: {
		totalLiquidity: '11356688.22',
		totalShares: '78351.308448723247365152',
		swapFee: '0.00292',
	},
} as const

describe('Balancer Rest resolver module', () => {
	beforeEach(() => {
		graphql.mockReset()
	})

	it('registers under Balancer_Rest for BalancerPool', () => {
		expect(balancerRest.source).toBe(Source.Balancer_Rest)
		expect(balancerPoolResolver).toBeDefined()
	})

	it('rejects non-eip155 networks before transport', async () => {
		if (balancerPoolResolver == null)
			throw new Error('missing BalancerPool resolver')

		await expect(
			balancerPoolResolver.resolve.NetworkPoolId.resolve({
				$network: {
					caip2: {
						namespace: 'cosmos',
						reference: 'osmosis-1',
					},
				},
				poolId: weightedV2PoolId,
			}, context)
		).rejects.toThrow(`${Source.Balancer_Rest}: network must use the eip155 CAIP-2 namespace`)
		expect(graphql).not.toHaveBeenCalled()
	})

	it('rejects unsupported Balancer chains on BalancerPool before transport', async () => {
		if (balancerPoolResolver == null)
			throw new Error('missing BalancerPool resolver')

		await expect(
			balancerPoolResolver.resolve.NetworkPoolId.resolve({
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '999999',
					},
				},
				poolId: weightedV2PoolId,
			}, context)
		).rejects.toThrow(`${Source.Balancer_Rest}: unsupported chain id 999999`)
		expect(graphql).not.toHaveBeenCalled()
	})

	it('rejects unsupported Balancer chains on Network $$balancerPools before transport', async () => {
		if (networkBalancerPoolsResolver == null)
			throw new Error('missing Network $$balancerPools resolver')

		await expect(
			networkBalancerPoolsResolver.resolve.Caip2.resolve({
				caip2: {
					namespace: 'eip155',
					reference: '999999',
				},
			}, context)
		).rejects.toThrow(`${Source.Balancer_Rest}: unsupported chain id 999999`)
		expect(graphql).not.toHaveBeenCalled()
	})

	it('resolves a Balancer pool snapshot by network and pool id', async () => {
		if (balancerPoolResolver == null)
			throw new Error('missing BalancerPool resolver')

		graphql.mockResolvedValueOnce({
			poolGetPool: weightedV2Pool,
		})

		await expect(
			balancerPoolResolver.resolve.NetworkPoolId.resolve({
				$network: ethereumNetwork,
				poolId: weightedV2PoolId,
			}, context)
		).resolves.toEqual({
			$network: {
				[EntityMetaKey.Selector]: ethereumNetwork,
			},
			poolId: weightedV2PoolId,
			address: '0x3de27efa2f1aa663ae5d458857e731c129069f29',
			name: '20wstETH-80AAVE',
			poolType: 'WEIGHTED',
			version: 4,
			protocolVersion: 2,
			vaultAddress: '0xba12222222228d8ba445958a75a0704d566bf2c8',
			swapFee: '0.00292',
			totalLiquidity: '11356688.22',
			totalShares: '78351.308448723247365152',
			$$aprItems: [],
		})
	})

	it('fails closed when the pool snapshot payload is malformed', async () => {
		if (balancerPoolResolver == null)
			throw new Error('missing BalancerPool resolver')

		graphql.mockResolvedValueOnce({
			poolGetPool: {
				id: weightedV2PoolId,
			},
		})

		await expect(
			balancerPoolResolver.resolve.NetworkPoolId.resolve({
				$network: ethereumNetwork,
				poolId: weightedV2PoolId,
			}, context)
		).rejects.toThrow(`${Source.Balancer_Rest}: invalid pool response envelope`)
	})

	it('lists Network $$balancerPools with authoritative resolveCount from poolGetPoolsCount', async () => {
		if (networkBalancerPoolsResolver == null)
			throw new Error('missing Network $$balancerPools resolver')

		graphql
			.mockResolvedValueOnce({
				poolGetPools: [
					weightedV2Pool,
				],
			})
			.mockResolvedValueOnce({
				poolGetPoolsCount: 2355,
			})
			.mockResolvedValueOnce({
				veBalGetVotingList: [],
			})

		const snapshot = await networkBalancerPoolsResolver.resolve.Caip2.resolve(ethereumNetwork, context)
		expect(networkBalancerPoolsResolver.projections.Evm.$$balancerPools.select(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: ethereumNetwork,
					poolId: weightedV2PoolId,
				},
			},
		])
		expect(networkBalancerPoolsResolver.projections.Evm.$$balancerPools.resolveCount(snapshot)).toBe(2355)
		expect(networkBalancerPoolsResolver.projections.Evm.$$balancerGauges.select(snapshot)).toEqual([])
		expect(networkBalancerPoolsResolver.projections.Evm.$$balancerGauges.resolveCount(snapshot)).toBe(0)
	})

	it('lists Network $$balancerGauges with resolveCount from complete chain-filtered voting list', async () => {
		if (networkBalancerPoolsResolver == null)
			throw new Error('missing Network $$balancerPools resolver')

		graphql
			.mockResolvedValueOnce({
				poolGetPools: [],
			})
			.mockResolvedValueOnce({
				poolGetPoolsCount: 0,
			})
			.mockResolvedValueOnce({
				veBalGetVotingList: [
					{
						id: weightedV2PoolId,
						address: weightedV2Pool.address,
						chain: 'MAINNET',
						type: 'WEIGHTED',
						symbol: '20wstETH-80AAVE',
						protocolVersion: 2,
						gauge: {
							address: '0x1111111111111111111111111111111111111111',
							isKilled: false,
							relativeWeightCap: '0.1',
						},
						tokens: [
							{
								address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
								symbol: 'wstETH',
							},
						],
					},
					{
						id: '0x2222222222222222222222222222222222222222000200000000000000000002',
						address: '0x2222222222222222222222222222222222222222',
						chain: 'BASE',
						type: 'WEIGHTED',
						symbol: 'base-pool',
						protocolVersion: 2,
						gauge: {
							address: '0x3333333333333333333333333333333333333333',
							isKilled: false,
						},
						tokens: [
							{
								address: '0x4200000000000000000000000000000000000006',
								symbol: 'WETH',
							},
						],
					},
				],
			})

		const snapshot = await networkBalancerPoolsResolver.resolve.Caip2.resolve(ethereumNetwork, context)
		expect(networkBalancerPoolsResolver.projections.Evm.$$balancerGauges.select(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: ethereumNetwork,
					gaugeAddress: '0x1111111111111111111111111111111111111111',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.BalancerGauge, [], '$pool')]: {
						[EntityMetaKey.Selector]: {
							$network: ethereumNetwork,
							poolId: weightedV2PoolId,
						},
					},
					[entityFieldAddressKey(EntityType.BalancerGauge, [], 'isKilled')]: false,
					[entityFieldAddressKey(EntityType.BalancerGauge, [], 'poolSymbol')]: '20wstETH-80AAVE',
					[entityFieldAddressKey(EntityType.BalancerGauge, [], 'poolType')]: 'WEIGHTED',
					[entityFieldAddressKey(EntityType.BalancerGauge, [], 'protocolVersion')]: 2,
					[entityFieldAddressKey(EntityType.BalancerGauge, [], 'relativeWeightCap')]: '0.1',
				},
			},
		])
		expect(networkBalancerPoolsResolver.projections.Evm.$$balancerGauges.resolveCount(snapshot)).toBe(1)
	})

	it('lists account $$balancerPoolBalances with resolveCount from poolGetPoolsCount(userAddress)', async () => {
		if (evmNetworkAccountResolver == null)
			throw new Error('missing EvmNetworkAccount $$balancerPoolBalances resolver')

		const account = {
			$network: ethereumNetwork,
			$actor: {
				address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
			},
		}

		graphql
			.mockResolvedValueOnce({
				poolGetPools: [
					{
						...weightedV2Pool,
						userBalance: {
							totalBalance: '12.5',
							totalBalanceUsd: 100.5,
							walletBalance: '10.5',
							walletBalanceUsd: 84.42,
							stakedBalances: [],
						},
					},
				],
			})
			.mockResolvedValueOnce({
				poolGetPoolsCount: 7,
			})
			.mockResolvedValueOnce({
				veBalGetUser: null,
			})

		const snapshot = await evmNetworkAccountResolver.resolve.EvmNetworkEvmAccount.resolve(account, context)
		expect(evmNetworkAccountResolver.projections.$$balancerPoolBalances.select(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$account: account,
					$pool: {
						$network: ethereumNetwork,
						poolId: weightedV2PoolId,
					},
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.BalancerAccountPoolBalance, [], 'totalBalance')]: '12.5',
					[entityFieldAddressKey(EntityType.BalancerAccountPoolBalance, [], 'totalBalanceUsd')]: 100.5,
					[entityFieldAddressKey(EntityType.BalancerAccountPoolBalance, [], 'walletBalance')]: '10.5',
					[entityFieldAddressKey(EntityType.BalancerAccountPoolBalance, [], 'walletBalanceUsd')]: 84.42,
				},
			},
		])
		expect(evmNetworkAccountResolver.projections.$$balancerPoolBalances.resolveCount(snapshot)).toBe(7)
		expect(graphql.mock.calls[1][0].variables).toEqual({
			chain: 'MAINNET',
			userAddress: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
		})
	})
})
