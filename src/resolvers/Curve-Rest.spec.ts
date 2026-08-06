import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))

const { default: curveRest } = await import('$/resolvers/Curve-Rest.ts')

const baseNetwork = {
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

const curvePoolResolver = curveRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CurvePool
))
const curvePoolCoinResolver = curveRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CurvePoolCoin
))
const curveGaugeResolver = curveRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CurveGauge
))

const networkCurvePoolsResolver = curveRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Evm' in resolver.projections
	&& '$$curvePools' in resolver.projections.Evm
))

const threePoolAddress = '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7'
const threePoolGaugeAddress = '0xbfcf63294ad7105dea65aa58f8ae5be2d9d0952a'
const threePoolCoins = [
	{
		address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
		decimals: '18',
		symbol: 'DAI',
		name: 'Dai Stablecoin',
		poolBalance: '25837415992433535654889714',
		usdPrice: 1.0000718888448834,
		isBasePoolLpToken: false,
	},
	{
		address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
		decimals: '6',
		symbol: 'USDC',
		name: 'USD Coin',
		poolBalance: '25837112339039',
		usdPrice: 1,
		isBasePoolLpToken: false,
	},
	{
		address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
		decimals: '6',
		symbol: 'USDT',
		name: 'Tether USD',
		poolBalance: '107913050980945',
		usdPrice: 0.9992896649355829,
		isBasePoolLpToken: false,
	},
] as const
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
	],
	decimals: [
		'18',
		'6',
		'6',
	],
	coins: [
		...threePoolCoins,
	],
	virtualPrice: '1039823717342561370',
	amplificationCoefficient: '4000',
	totalSupply: '153873339037508580484005791',
	usdTotal: 159936280.19153345,
	isMetaPool: false,
	gaugeAddress: threePoolGaugeAddress,
	assetTypeName: 'usd',
	creationBlockNumber: 10809473,
	creationTs: 1599422178,
} as const

const mockPoolDetail = () => {
	sourceGetJson.mockResolvedValueOnce({
		success: true,
		data: {
			poolList: [
				{
					type: 'main',
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
}

describe('Curve Rest resolver module', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
	})

	it('registers under Curve_Rest for CurvePool', () => {
		expect(curveRest.source).toBe(Source.Curve_Rest)
		expect(curvePoolResolver).toBeDefined()
	})

	it('rejects non-eip155 networks before transport', async () => {
		if (curvePoolResolver == null)
			throw new Error('missing CurvePool resolver')

		await expect(
			curvePoolResolver.resolve.NetworkPoolAddress.resolve({
				$network: {
					caip2: {
						namespace: 'bip122',
						reference: '000000000019d6689c085ae165831e93',
					},
				},
				poolAddress: threePoolAddress,
			}, context)
		).rejects.toThrow(`${Source.Curve_Rest}: network must use the eip155 CAIP-2 namespace`)
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('rejects unsupported Curve chains on CurvePool before transport', async () => {
		if (curvePoolResolver == null)
			throw new Error('missing CurvePool resolver')

		await expect(
			curvePoolResolver.resolve.NetworkPoolAddress.resolve({
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '999999',
					},
				},
				poolAddress: threePoolAddress,
			}, context)
		).rejects.toThrow(`${Source.Curve_Rest}: unsupported chain id 999999`)
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('rejects unsupported Curve chains on Network $$curvePools before transport', async () => {
		if (networkCurvePoolsResolver == null)
			throw new Error('missing Network $$curvePools resolver')

		await expect(
			networkCurvePoolsResolver.resolve.Caip2.resolve({
				caip2: {
					namespace: 'eip155',
					reference: '999999',
				},
			}, context)
		).rejects.toThrow(`${Source.Curve_Rest}: unsupported chain id 999999`)
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('maps a Curve pool snapshot from getPools with $gauge and $$coins', async () => {
		if (curvePoolResolver == null)
			throw new Error('missing CurvePool resolver')

		mockPoolDetail()

		const poolSelector = {
			$network: baseNetwork,
			poolAddress: threePoolAddress,
		}
		const snapshot = await curvePoolResolver.resolve.NetworkPoolAddress.resolve(poolSelector, context)

		expect(snapshot).toMatchObject({
			$network: {
				[EntityMetaKey.Selector]: baseNetwork,
			},
			poolAddress: '0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7',
			name: 'Curve.fi DAI/USDC/USDT',
			symbol: '3Crv',
			registryId: 'main',
			lpTokenAddress: '0x6c3f90f043a72fa612cbac8115ee7e52bde6e490',
			virtualPrice: '1039823717342561370',
			amplificationCoefficient: '4000',
			usdTotal: 159936280.19153345,
			isMetaPool: false,
			$gauge: {
				[EntityMetaKey.Selector]: {
					$network: baseNetwork,
					gaugeAddress: '0xbfcf63294ad7105dea65aa58f8ae5be2d9d0952a',
				},
			},
		})
		expect(curvePoolResolver.projections.name(snapshot)).toBe('Curve.fi DAI/USDC/USDT')
		expect(curvePoolResolver.projections.symbol(snapshot)).toBe('3Crv')
		expect(curvePoolResolver.projections.$gauge(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: baseNetwork,
				gaugeAddress: '0xbfcf63294ad7105dea65aa58f8ae5be2d9d0952a',
			},
		})
		expect(curvePoolResolver.projections.$$coins(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$pool: {
						$network: baseNetwork,
						poolAddress: '0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7',
					},
					coinAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$pool: {
						$network: baseNetwork,
						poolAddress: '0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7',
					},
					coinAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$pool: {
						$network: baseNetwork,
						poolAddress: '0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7',
					},
					coinAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
				},
			},
		])
	})

	it('resolves CurvePoolCoin legs from the parent pool snapshot', async () => {
		if (curvePoolCoinResolver == null)
			throw new Error('missing CurvePoolCoin resolver')

		mockPoolDetail()

		const snapshot = await curvePoolCoinResolver.resolve.PoolCoinAddress.resolve({
			$pool: {
				$network: baseNetwork,
				poolAddress: threePoolAddress,
			},
			coinAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
		}, context)

		expect(curvePoolCoinResolver.projections.symbol(snapshot)).toBe('DAI')
		expect(curvePoolCoinResolver.projections.name(snapshot)).toBe('Dai Stablecoin')
		expect(curvePoolCoinResolver.projections.decimals(snapshot)).toBe('18')
		expect(curvePoolCoinResolver.projections.poolBalance(snapshot)).toBe('25837415992433535654889714')
		expect(curvePoolCoinResolver.projections.usdPrice(snapshot)).toBe(1.0000718888448834)
		expect(curvePoolCoinResolver.projections.coinAddress(snapshot)).toBe('0x6b175474e89094c44da98b954eedeac495271d0f')
	})

	it('resolves CurveGauge from getAllGauges', async () => {
		if (curveGaugeResolver == null)
			throw new Error('missing CurveGauge resolver')

		sourceGetJson.mockResolvedValueOnce({
			success: true,
			data: {
				'3pool': {
					name: '3pool',
					shortName: '3pool',
					isPool: true,
					blockchainId: 'ethereum',
					gauge: threePoolGaugeAddress,
					poolAddress: threePoolAddress,
					is_killed: false,
					hasNoCrv: false,
					gauge_data: {
						inflation_rate: '7327853447857530670',
						working_supply: '1000',
					},
					gauge_controller: {
						gauge_relative_weight: '0.1',
					},
					gaugeCrvApy: [
						1.5,
						3.75,
					],
				},
			},
		})

		const snapshot = await curveGaugeResolver.resolve.NetworkGaugeAddress.resolve({
			$network: baseNetwork,
			gaugeAddress: threePoolGaugeAddress,
		}, context)

		expect(curveGaugeResolver.projections.name(snapshot)).toBe('3pool')
		expect(curveGaugeResolver.projections.isKilled(snapshot)).toBe(false)
		expect(curveGaugeResolver.projections.hasNoCrv(snapshot)).toBe(false)
		expect(curveGaugeResolver.projections.relativeWeight(snapshot)).toBe('0.1')
		expect(curveGaugeResolver.projections.workingSupply(snapshot)).toBe('1000')
		expect(curveGaugeResolver.projections.inflationRate(snapshot)).toBe('7327853447857530670')
		expect(curveGaugeResolver.projections.gaugeCrvApyMin(snapshot)).toBe(1.5)
		expect(curveGaugeResolver.projections.gaugeCrvApyMax(snapshot)).toBe(3.75)
		expect(curveGaugeResolver.projections.$pool(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: baseNetwork,
				poolAddress: '0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7',
			},
		})
	})

	it('propagates malformed pool list envelopes instead of resolving an empty detail', async () => {
		if (curvePoolResolver == null)
			throw new Error('missing CurvePool resolver')

		sourceGetJson.mockResolvedValueOnce({
			success: false,
			data: {
				poolList: [],
			},
		})

		await expect(curvePoolResolver.resolve.NetworkPoolAddress.resolve({
			$network: baseNetwork,
			poolAddress: threePoolAddress,
		}, context)).rejects.toThrow(`${Source.Curve_Rest}: invalid pool list response envelope`)
	})

	it('propagates malformed pool detail envelopes instead of resolving a partial pool', async () => {
		if (curvePoolResolver == null)
			throw new Error('missing CurvePool resolver')

		sourceGetJson
			.mockResolvedValueOnce({
				success: true,
				data: {
					poolList: [
						{
							type: 'main',
							address: threePoolAddress,
						},
					],
				},
			})
			.mockResolvedValueOnce({
				success: false,
				data: {
					poolData: [],
				},
			})

		await expect(curvePoolResolver.resolve.NetworkPoolAddress.resolve({
			$network: baseNetwork,
			poolAddress: threePoolAddress,
		}, context)).rejects.toThrow(`${Source.Curve_Rest}: invalid pools response envelope`)
	})

	it('lists Network $$curvePools with authoritative resolveCount from the full pool list', async () => {
		if (networkCurvePoolsResolver == null)
			throw new Error('missing Network $$curvePools resolver')

		const secondPoolAddress = '0xDC24316b9AE028F1497c275EB9192a3Ea0f67022'
		sourceGetJson.mockResolvedValueOnce({
			success: true,
			data: {
				poolList: [
					{
						type: 'main',
						address: threePoolAddress,
					},
					{
						type: 'main',
						address: secondPoolAddress,
					},
				],
			},
		})

		const snapshot = await networkCurvePoolsResolver.resolve.Caip2.resolve(
			baseNetwork,
			{
				...context,
				pagination: {
					limit: 1,
				},
			}
		)

		expect(networkCurvePoolsResolver.projections.Evm.$$curvePools.select(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: baseNetwork,
					poolAddress: '0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7',
				},
			},
		])
		expect(networkCurvePoolsResolver.projections.Evm.$$curvePools.resolveCount(snapshot)).toBe(2)
	})
})
