import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Gmx/bindings.ts'
import {
	gmxApiByChainId,
	gmxApiDeployments,
} from '$/sources/Gmx/Rest/constants.ts'
import {
	ApiFamily,
	SourceDelivery,
	SourceEndpointKind,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'
import { Source } from '$/sources/Source.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))

const { getMarketsInfo } = await import('$/sources/Gmx/Rest/queries.ts')

const arbitrumBinding = bindings[Source.Gmx_Rest].find((binding) => (
	binding.target.key === '42161'
))
const avalancheBinding = bindings[Source.Gmx_Rest].find((binding) => (
	binding.target.key === '43114'
))
const megaethBinding = bindings[Source.Gmx_Rest].find((binding) => (
	binding.target.key === '4326'
))

const ethMarketTokenAddress = '0x70d95587d40A2caf56bd97485aB3Eec10Bee6336'

const ethMarketInfoWire = {
	name: 'ETH/USD [WETH-USDC]',
	marketTokenAddress: ethMarketTokenAddress,
	indexTokenAddress: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
	longTokenAddress: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
	shortTokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
	isSpotOnly: false,
	isDisabled: false,
	longInterestUsd: '11844876917225365753752459368138129000',
	shortInterestUsd: '15383126719457743771450388674116662232',
	longPoolAmount: '11412900167379942479683',
	shortPoolAmount: '20907313850254',
	fundingFactorPerSecond: '5447368087265348055555',
} as const

describe('GMX API REST binding', () => {
	it('targets official GMX API peer hosts per documented chain', () => {
		expect(arbitrumBinding).toBeDefined()
		expect(arbitrumBinding?.source).toBe(Source.Gmx_Rest)
		expect(arbitrumBinding?.wireProtocol).toBe(WireProtocol.HttpRest)
		expect(arbitrumBinding?.apiFamily).toBe(ApiFamily.RestJson)
		expect(arbitrumBinding?.delivery).toBe(SourceDelivery.BrowserDirect)
		expect(arbitrumBinding?.target).toEqual({
			kind: SourceTargetKind.Eip155Chain,
			key: '42161',
		})
		expect(arbitrumBinding?.endpoints).toEqual([
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://arbitrum.gmxapi.io/v1',
				corsEnabled: true,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://arbitrum.gmxapi.ai/v1',
				corsEnabled: true,
			},
		])
	})

	it('catalogs Arbitrum, Avalanche, and MegaETH deployments', () => {
		expect(gmxApiByChainId[42161]?.slug).toBe('arbitrum')
		expect(gmxApiDeployments.map((deployment) => deployment.chainId)).toEqual([
			42161,
			43114,
			4326,
		])
	})
})

describe('GMX markets/info operation', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
	})

	it('reads market snapshots for a supported chain', async () => {
		sourceGetJson.mockResolvedValueOnce([
			ethMarketInfoWire,
		])

		await expect(
			getMarketsInfo({
				chainId: 42161,
			})
		)
			.resolves
			.toEqual([
				{
					chainId: 42161,
					name: 'ETH/USD [WETH-USDC]',
					marketTokenAddress: '0x70d95587d40a2caf56bd97485ab3eec10bee6336',
					indexTokenAddress: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
					longTokenAddress: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
					shortTokenAddress: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
					isSpotOnly: false,
					isDisabled: false,
					longInterestUsd: '11844876917225365753752459368138129000',
					shortInterestUsd: '15383126719457743771450388674116662232',
					longPoolAmount: '11412900167379942479683',
					shortPoolAmount: '20907313850254',
					fundingFactorPerSecond: '5447368087265348055555',
				},
			])

		expect(sourceGetJson).toHaveBeenCalledWith(
			arbitrumBinding,
			httpUrl(arbitrumBinding!, '/markets/info')
		)
	})

	it.each([
		[
			43114,
			avalancheBinding,
		],
		[
			4326,
			megaethBinding,
		],
	])('reads token legs, OI, pools, and funding for chain %i', async (
		chainId,
		binding
	) => {
		sourceGetJson.mockResolvedValueOnce([
			ethMarketInfoWire,
		])

		await expect(
			getMarketsInfo({
				chainId,
			})
		)
			.resolves
			.toEqual([
				{
					...ethMarketInfoWire,
					chainId,
					marketTokenAddress: '0x70d95587d40a2caf56bd97485ab3eec10bee6336',
					indexTokenAddress: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
					longTokenAddress: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
					shortTokenAddress: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
				},
			])

		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			httpUrl(binding!, '/markets/info')
		)
	})

	it('rejects unsupported chains before transport', async () => {
		await expect(
			getMarketsInfo({
				chainId: 1,
			})
		)
			.rejects
			.toThrow(`${Source.Gmx_Rest}: unsupported chain id 1`)

		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('fails closed when markets/info is not an array', async () => {
		sourceGetJson.mockResolvedValueOnce({
			markets: [],
		})

		await expect(
			getMarketsInfo({
				chainId: 42161,
			})
		)
			.rejects
			.toThrow(`${Source.Gmx_Rest}: markets/info response is not an array`)
	})

	it('fails closed when a market boolean is malformed', async () => {
		sourceGetJson.mockResolvedValueOnce([
			{
				...ethMarketInfoWire,
				isDisabled: null,
			},
		])

		await expect(
			getMarketsInfo({
				chainId: 42161,
			})
		)
			.rejects
			.toThrow(`${Source.Gmx_Rest}: market missing isDisabled`)
	})

	it('fails closed for duplicate market tokens', async () => {
		sourceGetJson.mockResolvedValueOnce([
			ethMarketInfoWire,
			{
				...ethMarketInfoWire,
				name: 'duplicate',
			},
		])

		await expect(
			getMarketsInfo({
				chainId: 42161,
			})
		)
			.rejects
			.toThrow(`${Source.Gmx_Rest}: markets/info response contains duplicate market tokens`)
	})
})
