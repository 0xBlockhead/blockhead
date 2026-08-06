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

const networkCurvePoolsResolver = curveRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Evm' in resolver.projections
	&& '$$curvePools' in resolver.projections.Evm
))

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
	],
	decimals: [
		'18',
		'6',
		'6',
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

	it('maps a Curve pool snapshot from getPools', async () => {
		if (curvePoolResolver == null)
			throw new Error('missing CurvePool resolver')

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

		const snapshot = await curvePoolResolver.resolve.NetworkPoolAddress.resolve({
			$network: baseNetwork,
			poolAddress: threePoolAddress,
		}, context)

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
		})
		expect(curvePoolResolver.projections.name(snapshot)).toBe('Curve.fi DAI/USDC/USDT')
		expect(curvePoolResolver.projections.symbol(snapshot)).toBe('3Crv')
	})
})
