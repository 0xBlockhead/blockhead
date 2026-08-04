import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Curve/bindings.ts'
import {
	curvePlatformByChainId,
	curvePlatforms,
} from '$/sources/Curve/Rest/constants.ts'
import {
	ApiFamily,
	SourceDelivery,
	SourceEndpointKind,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'
import { Source } from '$/sources/Source.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))

const {
	getPool,
	listPools,
	listPoolsByRegistry,
} = await import('$/sources/Curve/Rest/queries.ts')

const binding = bindings[Source.Curve_Rest][0]

const threePoolAddress = '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7'
const threePoolWire = {
	id: '0',
	address: threePoolAddress,
	name: 'Curve.fi DAI/USDC/USDT',
	symbol: '3Crv',
	lpTokenAddress: '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490',
	coinsAddresses: [
		'0x6B175474E89094C44Da98b954EedeAC495271d0F',
		'0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
		'0xdAC17F958D2ee523a2206206994597C13D831ec7',
		'0x0000000000000000000000000000000000000000',
	],
	decimals: [
		'18',
		'6',
		'6',
		'0',
	],
	coins: [],
	virtualPrice: '1039823717342561370',
	amplificationCoefficient: '4000',
	totalSupply: '153873339037508580484005791',
	usdTotal: 159936280.19153345,
	isMetaPool: false,
	gaugeAddress: '0xbfcf63294ad7105dea65aa58f8ae5be2d9d0952a',
	assetTypeName: 'usd',
	creationBlockNumber: 10809473,
	creationTs: 1599422178,
} as const

describe('Curve REST binding', () => {
	it('targets the official Curve public API', () => {
		expect(binding.target).toEqual({
			kind: SourceTargetKind.Global,
			key: 'curve-api',
		})
		expect(binding.source).toBe(Source.Curve_Rest)
		expect(binding.wireProtocol).toBe(WireProtocol.HttpRest)
		expect(binding.apiFamily).toBe(ApiFamily.RestJson)
		expect(binding.delivery).toBe(SourceDelivery.BrowserDirect)
		expect(binding.endpoints).toEqual([
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.curve.finance',
				corsEnabled: true,
			},
		])
	})

	it('catalogs Curve platforms and their registries from getPlatforms snapshot', () => {
		expect(curvePlatformByChainId[1]).toEqual({
			blockchainId: 'ethereum',
			chainId: 1,
			registries: expect.arrayContaining([
				'main',
				'factory',
				'factory-stable-ng',
			]),
		})
		expect(curvePlatforms.some((platform) => platform.chainId === 42161)).toBe(true)
	})
})

describe('Curve pool operations', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
	})

	it('lists pool addresses via getPoolList and normalizes stable-factory', async () => {
		sourceGetJson.mockResolvedValueOnce({
			success: true,
			data: {
				poolList: [
					{
						type: 'main',
						address: threePoolAddress,
					},
					{
						type: 'stable-factory',
						address: '0xA96A65c051bF88B4095Ee1f2451C2A9d43F53Ae2',
					},
				],
			},
		})

		await expect(listPools({
			chainId: 1,
		})).resolves.toEqual([
			{
				blockchainId: 'ethereum',
				chainId: 1,
				registryId: 'main',
				poolAddress: '0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7',
			},
			{
				blockchainId: 'ethereum',
				chainId: 1,
				registryId: 'factory',
				poolAddress: '0xa96a65c051bf88b4095ee1f2451c2a9d43f53ae2',
			},
		])
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			'https://api.curve.finance/v1/getPoolList/ethereum'
		)
	})

	it('reads registry pool detail via getPools', async () => {
		sourceGetJson.mockResolvedValueOnce({
			success: true,
			data: {
				poolData: [
					threePoolWire,
				],
			},
		})

		await expect(listPoolsByRegistry({
			chainId: 1,
			registryId: 'main',
		})).resolves.toEqual([
			{
				blockchainId: 'ethereum',
				chainId: 1,
				registryId: 'main',
				poolAddress: '0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7',
				name: 'Curve.fi DAI/USDC/USDT',
				symbol: '3Crv',
				lpTokenAddress: '0x6c3f90f043a72fa612cbac8115ee7e52bde6e490',
				coinAddresses: [
					'0x6b175474e89094c44da98b954eedeac495271d0f',
					'0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
					'0xdac17f958d2ee523a2206206994597c13d831ec7',
				],
				virtualPrice: '1039823717342561370',
				amplificationCoefficient: '4000',
				totalSupply: '153873339037508580484005791',
				usdTotal: 159936280.19153345,
				isMetaPool: false,
				gaugeAddress: '0xbfcf63294ad7105dea65aa58f8ae5be2d9d0952a',
				assetTypeName: 'usd',
				creationBlockNumber: 10809473,
				creationTs: 1599422178,
			},
		])
	})

	it('discovers a pool registry before resolving its detail', async () => {
		sourceGetJson.mockResolvedValueOnce({
			success: true,
			data: {
				poolList: [
					{
						type: 'stable-factory',
						address: threePoolAddress,
					},
				],
			},
		})
		sourceGetJson.mockResolvedValueOnce({
			success: true,
			data: {
				poolData: [
					threePoolWire,
				],
			},
		})

		await expect(getPool({
			chainId: 1,
			poolAddress: threePoolAddress,
		})).resolves.toMatchObject({
			poolAddress: '0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7',
			symbol: '3Crv',
			registryId: 'factory',
		})
		expect(sourceGetJson).toHaveBeenCalledTimes(2)
		expect(sourceGetJson).toHaveBeenNthCalledWith(
			1,
			binding,
			'https://api.curve.finance/v1/getPoolList/ethereum'
		)
		expect(sourceGetJson).toHaveBeenNthCalledWith(
			2,
			binding,
			'https://api.curve.finance/v1/getPools/ethereum/factory'
		)
	})

	it('rejects unsupported chains before transport', async () => {
		await expect(listPools({
			chainId: 99999,
		})).rejects.toThrow('Curve_Rest: unsupported chain id 99999')
		expect(sourceGetJson).not.toHaveBeenCalled()
	})
})
