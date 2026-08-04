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

const { default: compoundRest } = await import('$/resolvers/Compound-Rest.ts')

const baseNetwork = {
	caip2: {
		namespace: 'eip155',
		reference: '8453',
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

const compoundCometResolver = compoundRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CompoundComet
))

const baseCometAddress = '0xb125e6687d4313864e53df431d5425969c15eb2f'

const baseConfiguration = {
	name: 'Compound USDC',
	symbol: 'cUSDCv3',
	baseToken: 'USDC',
	baseTokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
	baseTokenPriceFeed: '0x7e860098F58bBFC8648a4311b374B1D669a2bc6B',
	borrowMin: '1e0',
	targetReserves: '5000000e6',
	assets: {
		WETH: {
			address: '0x4200000000000000000000000000000000000006',
			priceFeed: '0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70',
			decimals: '18',
			borrowCF: 0.80,
			liquidateCF: 0.90,
			liquidationFactor: 0.95,
			supplyCap: '11000e18',
		},
		cbETH: {
			address: '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22',
			priceFeed: '0x4687670f5f01716fAA382E2356C103BaD776752C',
			decimals: '18',
			borrowCF: 0.75,
			liquidateCF: 0.8,
			liquidationFactor: 0.85,
			supplyCap: '7500e18',
		},
	},
} as const

const baseRoots = {
	comet: baseCometAddress,
	configurator: '0x316f9708bB98af7dA9c68C1C3b5e79039cD336E3',
	rewards: '0x1B0e765F6224C21223AeA2af16c1C46E38885a40',
} as const

describe('Compound Rest resolver module', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
	})

	it('registers under Compound_Rest for CompoundComet', () => {
		expect(compoundRest.source).toBe(Source.Compound_Rest)
		expect(compoundCometResolver).toBeDefined()
	})

	it('rejects non-eip155 networks before transport', async () => {
		if (compoundCometResolver == null)
			throw new Error('missing CompoundComet resolver')

		await expect(
			compoundCometResolver.resolve.NetworkCometAddress.resolve({
				$network: {
					caip2: {
						namespace: 'cosmos',
						reference: 'osmosis-1',
					},
				},
				cometAddress: baseCometAddress,
			}, context)
		).rejects.toThrow(`${Source.Compound_Rest}: network must use the eip155 CAIP-2 namespace`)
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('rejects unknown comet deployments before transport', async () => {
		if (compoundCometResolver == null)
			throw new Error('missing CompoundComet resolver')

		await expect(
			compoundCometResolver.resolve.NetworkCometAddress.resolve({
				$network: baseNetwork,
				cometAddress: '0x0000000000000000000000000000000000000001',
			}, context)
		).rejects.toThrow(`${Source.Compound_Rest}: unknown comet`)
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('resolves a Compound Comet snapshot by network and comet address', async () => {
		if (compoundCometResolver == null)
			throw new Error('missing CompoundComet resolver')

		sourceGetJson
			.mockResolvedValueOnce(baseConfiguration)
			.mockResolvedValueOnce(baseRoots)

		const snapshot = await compoundCometResolver.resolve.NetworkCometAddress.resolve({
			$network: baseNetwork,
			cometAddress: baseCometAddress,
		}, context)

		expect(compoundCometResolver.projections.cometAddress(snapshot)).toBe(baseCometAddress)
		expect(compoundCometResolver.projections.marketSlug(snapshot)).toBe('usdc')
		expect(compoundCometResolver.projections.name(snapshot)).toBe('Compound USDC')
		expect(compoundCometResolver.projections.baseTokenSymbol(snapshot)).toBe('USDC')
		expect(compoundCometResolver.projections.collateralAssetCount(snapshot)).toBe(2)
		expect(compoundCometResolver.projections.configuratorAddress(snapshot)).toBe(
			'0x316f9708bb98af7da9c68c1c3b5e79039cd336e3'
		)
		expect(compoundCometResolver.projections.$network(snapshot)).toEqual({
			[EntityMetaKey.Selector]: baseNetwork,
		})
		expect(sourceGetJson).toHaveBeenCalledTimes(2)
	})
})
