import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Balancer/bindings.ts'
import {
	balancerChainByChainId,
	balancerChains,
} from '$/sources/Balancer/Rest/constants.ts'
import {
	ApiFamily,
	SourceDelivery,
	SourceEndpointKind,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'
import { Source } from '$/sources/Source.ts'

const graphql = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/Graphql/client.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_shared/wire/Graphql/client.ts')>(),
	graphql,
}))

const {
	getAccountPoolBalances,
	getPool,
	getPoolsCount,
	getVeBalUser,
	getVeBalUserBalance,
	listPoolEvents,
	listPools,
	listVotingGauges,
} = await import('$/sources/Balancer/Rest/queries.ts')

const binding = bindings[Source.Balancer_Rest][0]

const weightedV2PoolId = '0x3de27efa2f1aa663ae5d458857e731c129069f29000200000000000000000588'
const stableV3PoolId = '0x1ea5870f7c037930ce1d5d8d9317c670e89e13e3'

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

const stableV3Pool = {
	id: stableV3PoolId,
	address: '0x1ea5870f7c037930ce1d5d8d9317c670e89e13e3',
	name: 'Balancer rETH - Aave WETH',
	type: 'STABLE',
	version: 2,
	protocolVersion: 3,
	chain: 'MAINNET',
	poolTokens: [
		{
			address: '0x0bfc9d54fc184518a81162f8fb99c2eaca081202',
			symbol: 'waEthWETH',
			balance: '1160.1042245572946',
			decimals: 18,
			weight: null,
		},
		{
			address: '0xae78736cd615f374d3085123a210448e74fc6393',
			symbol: 'rETH',
			balance: '1052.9655660259332',
			decimals: 18,
			weight: null,
		},
	],
	dynamicData: {
		totalLiquidity: '4619508.25',
		totalShares: '2431.597396501431660244',
		swapFee: '0.0004',
	},
} as const

describe('Balancer API binding', () => {
	it('passes only the caller-provided noncanonical binding to GraphQL', async () => {
		const modifiedBinding = {
			...binding,
			endpoints: binding.endpoints.map((endpoint) => ({
				...endpoint,
				locator: 'https://noncanonical.example/balancer',
			})),
		}
		graphql.mockResolvedValueOnce({ poolGetPools: [] })

		await listPools({ binding: modifiedBinding, chainId: 1 })

		expect(graphql).toHaveBeenCalledOnce()
		expect(graphql.mock.calls[0][0].binding).toBe(modifiedBinding)
	})

	it('targets the official Balancer GraphQL API', () => {
		expect(binding.target).toEqual({
			kind: SourceTargetKind.Global,
			key: 'balancer-api-v3',
		})
		expect(binding.source).toBe(Source.Balancer_Rest)
		expect(binding.wireProtocol).toBe(WireProtocol.Graphql)
		expect(binding.apiFamily).toBe(ApiFamily.GraphqlHttp)
		expect(binding.delivery).toBe(SourceDelivery.BrowserDirect)
		expect(binding.endpoints).toEqual([
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api-v3.balancer.fi/',
				corsEnabled: true,
			},
		])
	})

	it('catalogs Vault deployments for documented EIP-155 chains', () => {
		expect(balancerChainByChainId[1]).toEqual({
			chainId: 1,
			name: 'Ethereum',
			gqlChain: 'MAINNET',
			vaultV2: '0xba12222222228d8ba445958a75a0704d566bf2c8',
			vaultV3: '0xba1333333333a1ba1108e8412f11850a5c319ba9',
		})
		expect(balancerChains.some((chain) => chain.chainId === 8453)).toBe(true)
	})
})

describe('Balancer poolGetPool operation', () => {
	beforeEach(() => {
		graphql.mockReset()
	})

	it('reads a v2 weighted pool by chain id and pool id', async () => {
		graphql.mockResolvedValueOnce({
			poolGetPool: weightedV2Pool,
		})
		await expect(getPool({
			binding,
			chainId: 1,
			poolId: weightedV2PoolId,
		})).resolves.toEqual({
			id: weightedV2PoolId,
			address: '0x3de27efa2f1aa663ae5d458857e731c129069f29',
			name: '20wstETH-80AAVE',
			type: 'WEIGHTED',
			version: 4,
			protocolVersion: 2,
			chainId: 1,
			vaultAddress: '0xba12222222228d8ba445958a75a0704d566bf2c8',
			swapFee: '0.00292',
			totalLiquidity: '11356688.22',
			totalShares: '78351.308448723247365152',
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
			aprItems: [],
		})
		expect(graphql).toHaveBeenCalledWith(
			expect.objectContaining({
				binding,
				variables: {
					id: weightedV2PoolId,
					chain: 'MAINNET',
				},
			})
		)
	})

	it('reads a v3 stable pool and selects the v3 Vault', async () => {
		graphql.mockResolvedValueOnce({
			poolGetPool: stableV3Pool,
		})
		await expect(getPool({
			binding,
			chainId: 1,
			poolId: stableV3PoolId,
		})).resolves.toMatchObject({
			id: stableV3PoolId,
			protocolVersion: 3,
			vaultAddress: '0xba1333333333a1ba1108e8412f11850a5c319ba9',
			type: 'STABLE',
		})
	})

	it('rejects an unsupported chain id before transport', async () => {
		await expect(getPool({
			binding,
			chainId: 999999,
			poolId: weightedV2PoolId,
		})).rejects.toThrow(`${Source.Balancer_Rest}: unsupported chain id 999999`)
		expect(graphql).not.toHaveBeenCalled()
	})

	it('rejects an invalid pool id before transport', async () => {
		await expect(getPool({
			binding,
			chainId: 1,
			poolId: 'not-a-pool',
		})).rejects.toThrow(`${Source.Balancer_Rest}: invalid pool id not-a-pool`)
		expect(graphql).not.toHaveBeenCalled()
	})

	it('throws when the API returns a null pool', async () => {
		graphql.mockResolvedValueOnce({
			poolGetPool: null,
		})
		await expect(getPool({
			binding,
			chainId: 1,
			poolId: weightedV2PoolId,
		})).rejects.toThrow(`${Source.Balancer_Rest}: pool not found ${weightedV2PoolId} on chain 1`)
	})

	it('fails closed when the pool detail operation is missing', async () => {
		graphql.mockResolvedValueOnce({})

		await expect(getPool({
			binding,
			chainId: 1,
			poolId: weightedV2PoolId,
		})).rejects.toThrow(`${Source.Balancer_Rest}: pool response missing poolGetPool`)
	})

	it('fails closed when the pool detail envelope is malformed', async () => {
		graphql.mockResolvedValueOnce({
			poolGetPool: {
				id: weightedV2PoolId,
			},
		})

		await expect(getPool({
			binding,
			chainId: 1,
			poolId: weightedV2PoolId,
		})).rejects.toThrow(`${Source.Balancer_Rest}: invalid pool response envelope`)
	})

	it('strips undeclared pool wire keys while keeping enrolled fields', async () => {
		graphql.mockResolvedValueOnce({
			poolGetPool: {
				...weightedV2Pool,
				wireOnlyNoise: true,
				dynamicData: {
					...weightedV2Pool.dynamicData,
					volume24h: '999',
				},
			},
		})

		await expect(getPool({
			binding,
			chainId: 1,
			poolId: weightedV2PoolId,
		})).resolves.toMatchObject({
			id: weightedV2PoolId,
			name: '20wstETH-80AAVE',
			totalLiquidity: '11356688.22',
		})
	})
})

describe('Balancer poolGetPools operation', () => {
	beforeEach(() => {
		graphql.mockReset()
	})

	it('lists pool snapshots for one chain with an explicit bounded page size', async () => {
		graphql.mockResolvedValueOnce({
			poolGetPools: [
				weightedV2Pool,
				stableV3Pool,
			],
		})

		await expect(listPools({
			binding,
			chainId: 1,
			limit: 2,
		})).resolves.toMatchObject([
			{
				id: weightedV2PoolId,
				chainId: 1,
				vaultAddress: '0xba12222222228d8ba445958a75a0704d566bf2c8',
			},
			{
				id: stableV3PoolId,
				chainId: 1,
				vaultAddress: '0xba1333333333a1ba1108e8412f11850a5c319ba9',
			},
		])
		expect(graphql).toHaveBeenCalledWith(expect.objectContaining({
			binding,
			query: expect.stringContaining('chainIn: [$chain]'),
			variables: {
				chain: 'MAINNET',
				first: 2,
			},
		}))
	})

	it('preserves an upstream successful empty pool list', async () => {
		graphql.mockResolvedValueOnce({
			poolGetPools: [],
		})

		await expect(listPools({
			binding,
			chainId: 1,
		})).resolves.toEqual([])
	})

	it('rejects invalid limits before transport', async () => {
		await expect(listPools({
			binding,
			chainId: 1,
			limit: 0,
		})).rejects.toThrow(`${Source.Balancer_Rest}: limit must be 1..100`)
		expect(graphql).not.toHaveBeenCalled()
	})

	it('fails closed when the pool list response has no data', async () => {
		graphql.mockResolvedValueOnce(undefined)

		await expect(listPools({
			binding,
			chainId: 1,
		})).rejects.toThrow(`${Source.Balancer_Rest}: pool list response missing data`)
	})

	it('fails closed when the pool list operation is absent', async () => {
		graphql.mockResolvedValueOnce({})

		await expect(listPools({
			binding,
			chainId: 1,
		})).rejects.toThrow(`${Source.Balancer_Rest}: pool list response poolGetPools is missing`)
	})

	it('fails closed when the pool list envelope is malformed', async () => {
		graphql.mockResolvedValueOnce({
			poolGetPools: [
				{
					id: weightedV2PoolId,
				},
			],
		})

		await expect(listPools({
			binding,
			chainId: 1,
		})).rejects.toThrow(`${Source.Balancer_Rest}: invalid pool list response envelope`)

		graphql.mockResolvedValueOnce({
			poolGetPools: null,
		})

		await expect(listPools({
			binding,
			chainId: 1,
		})).rejects.toThrow(`${Source.Balancer_Rest}: invalid pool list response envelope`)
	})

	it('fails closed when the pool list exceeds its requested limit', async () => {
		graphql.mockResolvedValueOnce({
			poolGetPools: [
				weightedV2Pool,
				stableV3Pool,
			],
		})

		await expect(listPools({
			binding,
			chainId: 1,
			limit: 1,
		})).rejects.toThrow(`${Source.Balancer_Rest}: pool list response exceeds requested limit 1`)
	})

	it('fails closed for duplicate pool ids', async () => {
		graphql.mockResolvedValueOnce({
			poolGetPools: [
				weightedV2Pool,
				{
					...weightedV2Pool,
					name: 'duplicate',
				},
			],
		})

		await expect(listPools({
			binding,
			chainId: 1,
			limit: 2,
		})).rejects.toThrow(`${Source.Balancer_Rest}: pool list response contains duplicate pool ids`)
	})
})

describe('Balancer poolGetPoolsCount operation', () => {
	beforeEach(() => {
		graphql.mockReset()
	})

	it('reads the authoritative pool count for one chain', async () => {
		graphql.mockResolvedValueOnce({
			poolGetPoolsCount: 2355,
		})

		await expect(getPoolsCount({
			binding,
			chainId: 1,
		})).resolves.toBe(2355)
		expect(graphql).toHaveBeenCalledWith(expect.objectContaining({
			binding,
			variables: {
				chain: 'MAINNET',
				userAddress: null,
			},
		}))
		expect(graphql.mock.calls[0][0].query).toContain('userAddress: $userAddress')
	})

	it('reads account-scoped pool count via poolGetPoolsCount(userAddress)', async () => {
		graphql.mockResolvedValueOnce({
			poolGetPoolsCount: 3,
		})

		await expect(getPoolsCount({
			binding,
			chainId: 1,
			userAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
		})).resolves.toBe(3)
		expect(graphql).toHaveBeenCalledWith(expect.objectContaining({
			binding,
			variables: {
				chain: 'MAINNET',
				userAddress: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
			},
		}))
	})

	it('fails closed when the pool count operation is missing', async () => {
		graphql.mockResolvedValueOnce({})

		await expect(getPoolsCount({
			binding,
			chainId: 1,
		})).rejects.toThrow(`${Source.Balancer_Rest}: pool count response poolGetPoolsCount is missing`)
	})

	it('fails closed for a non-integer pool count', async () => {
		graphql.mockResolvedValueOnce({
			poolGetPoolsCount: 1.5,
		})

		await expect(getPoolsCount({
			binding,
			chainId: 1,
		})).rejects.toThrow(`${Source.Balancer_Rest}: invalid pool count`)
	})
})

describe('Balancer account pool balances operation', () => {
	beforeEach(() => {
		graphql.mockReset()
	})

	const account = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'

	it('normalizes wallet and gauge staking balances for one account', async () => {
		graphql.mockResolvedValueOnce({
			poolGetPools: [
				{
					...weightedV2Pool,
					staking: {
						type: 'GAUGE',
						gauge: {
							gaugeAddress: '0xc13a3315806f097cee00e39c4285f5bf250dd8a4',
							version: 1,
						},
					},
					dynamicData: {
						...weightedV2Pool.dynamicData,
						aprItems: [
							{
								title: 'Swap fees',
								type: 'SWAP_FEE',
								apr: 0.012,
							},
						],
					},
					userBalance: {
						totalBalance: '12.5',
						totalBalanceUsd: 100.5,
						walletBalance: '10.5',
						walletBalanceUsd: 84.42,
						stakedBalances: [
							{
								balance: '2.0',
								balanceUsd: 16.08,
								stakingId: '0xc13a3315806f097cee00e39c4285f5bf250dd8a4',
								stakingType: 'GAUGE',
							},
						],
					},
				},
				{
					...stableV3Pool,
					userBalance: {
						totalBalance: '0',
						totalBalanceUsd: 0,
						walletBalance: '0',
						walletBalanceUsd: 0,
						stakedBalances: [],
					},
				},
			],
		})

		await expect(getAccountPoolBalances({
			binding,
			chainId: 1,
			account,
			limit: 2,
		})).resolves.toEqual([
			{
				poolId: weightedV2PoolId,
				poolAddress: '0x3de27efa2f1aa663ae5d458857e731c129069f29',
				chainId: 1,
				totalBalance: '12.5',
				totalBalanceUsd: 100.5,
				walletBalance: '10.5',
				walletBalanceUsd: 84.42,
				stakedBalances: [
					{
						balance: '2.0',
						balanceUsd: 16.08,
						stakingId: '0xc13a3315806f097cee00e39c4285f5bf250dd8a4',
						stakingType: 'GAUGE',
					},
				],
				gaugeAddress: '0xc13a3315806f097cee00e39c4285f5bf250dd8a4',
				gaugeVersion: 1,
				stakingType: 'GAUGE',
			},
		])
		expect(graphql).toHaveBeenCalledWith(expect.objectContaining({
			variables: {
				chain: 'MAINNET',
				userAddress: account,
				first: 2,
			},
		}))
	})

	it('rejects an invalid account before transport', async () => {
		await expect(getAccountPoolBalances({
			binding,
			chainId: 1,
			account: 'not-an-address',
		})).rejects.toThrow(`${Source.Balancer_Rest}: invalid account not-an-address`)
		expect(graphql).not.toHaveBeenCalled()
	})

	it('fails closed when userBalance is absent on a filtered pool row', async () => {
		graphql.mockResolvedValueOnce({
			poolGetPools: [
				weightedV2Pool,
			],
		})

		await expect(getAccountPoolBalances({
			binding,
			chainId: 1,
			account,
		})).rejects.toThrow(`${Source.Balancer_Rest}: account pool balance missing userBalance`)
	})
})

describe('Balancer veBAL and voting gauge operations', () => {
	beforeEach(() => {
		graphql.mockReset()
	})

	it('lists voting gauges with pool token metadata', async () => {
		graphql.mockResolvedValueOnce({
			veBalGetVotingList: [
				{
					id: weightedV2PoolId,
					address: '0x3de27efa2f1aa663ae5d458857e731c129069f29',
					chain: 'MAINNET',
					type: 'WEIGHTED',
					symbol: '20wstETH-80AAVE',
					protocolVersion: 2,
					gauge: {
						address: '0xc13a3315806f097cee00e39c4285f5bf250dd8a4',
						relativeWeightCap: '0.02',
						isKilled: false,
					},
					tokens: [
						{
							address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
							symbol: 'wstETH',
							logoURI: 'https://example.com/wsteth.png',
						},
					],
				},
			],
		})

		await expect(listVotingGauges({ binding })).resolves.toEqual([
			{
				poolId: weightedV2PoolId,
				poolAddress: '0x3de27efa2f1aa663ae5d458857e731c129069f29',
				chainId: 1,
				poolType: 'WEIGHTED',
				symbol: '20wstETH-80AAVE',
				protocolVersion: 2,
				gaugeAddress: '0xc13a3315806f097cee00e39c4285f5bf250dd8a4',
				isKilled: false,
				relativeWeightCap: '0.02',
				tokens: [
					{
						address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
						symbol: 'wstETH',
						logoURI: 'https://example.com/wsteth.png',
					},
				],
			},
		])
	})

	it('reads veBAL balance and lock snapshot for one account', async () => {
		graphql
			.mockResolvedValueOnce({
				veBalGetUserBalance: '12.5',
			})
			.mockResolvedValueOnce({
				veBalGetUser: {
					balance: '12.5',
					locked: '100.0',
					lockedUsd: '250.00',
					rank: 42,
				},
			})

		const account = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
		await expect(getVeBalUserBalance({
			binding,
			chainId: 1,
			account,
		})).resolves.toBe('12.5')
		await expect(getVeBalUser({
			binding,
			chainId: 1,
			account,
		})).resolves.toEqual({
			chainId: 1,
			account,
			balance: '12.5',
			locked: '100.0',
			lockedUsd: '250.00',
			rank: 42,
		})
	})

	it('fails closed when the voting list envelope is malformed', async () => {
		graphql.mockResolvedValueOnce({
			veBalGetVotingList: [
				{
					id: weightedV2PoolId,
				},
			],
		})

		await expect(listVotingGauges({ binding })).rejects.toThrow(`${Source.Balancer_Rest}: invalid voting list response envelope`)
	})
})

describe('Balancer poolEvents operation', () => {
	beforeEach(() => {
		graphql.mockReset()
	})

	it('lists recent pool events for one chain and optional pool id', async () => {
		graphql.mockResolvedValueOnce({
			poolEvents: [
				{
					id: '0xd80ee5aeb80511d3a4a96503b44ccfa3f2af0c113daa42691bfc0f1baf43961dd4000000',
					type: 'SWAP',
					chain: 'MAINNET',
					poolId: weightedV2PoolId,
					valueUSD: 6.26,
					blockNumber: 25698468,
					blockTimestamp: 1786050083,
					tx: '0xd80ee5aeb80511d3a4a96503b44ccfa3f2af0c113daa42691bfc0f1baf43961d',
					userAddress: '0xa99b2d5cc6847849f9b9c051474964acf1cac543',
				},
			],
		})

		await expect(listPoolEvents({
			binding,
			chainId: 1,
			poolId: weightedV2PoolId,
			limit: 1,
		})).resolves.toEqual([
			{
				id: '0xd80ee5aeb80511d3a4a96503b44ccfa3f2af0c113daa42691bfc0f1baf43961dd4000000',
				type: 'SWAP',
				chainId: 1,
				poolId: weightedV2PoolId,
				valueUsd: 6.26,
				blockNumber: 25698468,
				blockTimestampMs: 1786050083000,
				txHash: '0xd80ee5aeb80511d3a4a96503b44ccfa3f2af0c113daa42691bfc0f1baf43961d',
				userAddress: '0xa99b2d5cc6847849f9b9c051474964acf1cac543',
			},
		])
	})

	it('fails closed when pool events exceed the requested limit', async () => {
		graphql.mockResolvedValueOnce({
			poolEvents: [
				{
					id: 'a',
					type: 'SWAP',
					chain: 'MAINNET',
					poolId: weightedV2PoolId,
					valueUSD: 1,
					blockNumber: 1,
					blockTimestamp: 1,
					tx: '0xd80ee5aeb80511d3a4a96503b44ccfa3f2af0c113daa42691bfc0f1baf43961d',
					userAddress: '0xa99b2d5cc6847849f9b9c051474964acf1cac543',
				},
				{
					id: 'b',
					type: 'SWAP',
					chain: 'MAINNET',
					poolId: weightedV2PoolId,
					valueUSD: 2,
					blockNumber: 2,
					blockTimestamp: 2,
					tx: '0xe9fc04ec2db87aa9841bf8d2dc8b9d583af63a1b309ed425a8baa482ba3af98e',
					userAddress: '0xa99b2d5cc6847849f9b9c051474964acf1cac543',
				},
			],
		})

		await expect(listPoolEvents({
			binding,
			chainId: 1,
			limit: 1,
		})).rejects.toThrow(`${Source.Balancer_Rest}: pool events response exceeds requested limit 1`)
	})
})
