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
	getPool,
	listPools,
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
			chainId: 999999,
			poolId: weightedV2PoolId,
		})).rejects.toThrow(`${Source.Balancer_Rest}: unsupported chain id 999999`)
		expect(graphql).not.toHaveBeenCalled()
	})

	it('rejects an invalid pool id before transport', async () => {
		await expect(getPool({
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
			chainId: 1,
			poolId: weightedV2PoolId,
		})).rejects.toThrow(`${Source.Balancer_Rest}: pool not found ${weightedV2PoolId} on chain 1`)
	})

	it('fails closed when the pool detail operation is missing', async () => {
		graphql.mockResolvedValueOnce({})

		await expect(getPool({
			chainId: 1,
			poolId: weightedV2PoolId,
		})).rejects.toThrow(`${Source.Balancer_Rest}: pool response missing poolGetPool`)
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
			chainId: 1,
		})).resolves.toEqual([])
	})

	it('rejects invalid limits before transport', async () => {
		await expect(listPools({
			chainId: 1,
			limit: 0,
		})).rejects.toThrow(`${Source.Balancer_Rest}: limit must be 1..100`)
		expect(graphql).not.toHaveBeenCalled()
	})

	it('fails closed when the pool list response has no data', async () => {
		graphql.mockResolvedValueOnce(undefined)

		await expect(listPools({
			chainId: 1,
		})).rejects.toThrow(`${Source.Balancer_Rest}: pool list response missing data`)
	})

	it('fails closed when the pool list operation is absent or malformed', async () => {
		graphql.mockResolvedValueOnce({})

		await expect(listPools({
			chainId: 1,
		})).rejects.toThrow(`${Source.Balancer_Rest}: pool list response poolGetPools is not an array`)

		graphql.mockResolvedValueOnce({
			poolGetPools: null,
		})

		await expect(listPools({
			chainId: 1,
		})).rejects.toThrow(`${Source.Balancer_Rest}: pool list response poolGetPools is not an array`)
	})

	it('fails closed when the pool list exceeds its requested limit', async () => {
		graphql.mockResolvedValueOnce({
			poolGetPools: [
				weightedV2Pool,
				stableV3Pool,
			],
		})

		await expect(listPools({
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
			chainId: 1,
			limit: 2,
		})).rejects.toThrow(`${Source.Balancer_Rest}: pool list response contains duplicate pool ids`)
	})
})
