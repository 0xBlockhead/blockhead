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
const getAccountPositions = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))
const getCometTipRates = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Compound/Contracts/queries.ts', () => ({
	getAccountPositions,
	getCometTipRates,
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

const compoundCometAssetResolver = compoundRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CompoundCometAsset
))
const networkResolver = compoundRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
))
const evmNetworkAccountResolver = compoundRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.EvmNetworkAccount
	&& '$$compoundPositions' in resolver.projections
))
const compoundPositionResolver = compoundRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CompoundPosition
))
const compoundPositionCollateralResolver = compoundRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CompoundPositionCollateral
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
	rates: {
		supplyKink: 0.85,
		supplySlopeLow: 0.048,
		supplySlopeHigh: 1.6,
		supplyBase: 0,
		borrowKink: 0.85,
		borrowSlopeLow: 0.053,
		borrowSlopeHigh: 1.8,
		borrowBase: 0.015,
	},
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
		getAccountPositions.mockReset()
		getCometTipRates.mockReset()
		getCometTipRates.mockResolvedValue({
			chainId: 8453,
			cometAddress: '0xb125e6687d4313864e53df431d5425969c15eb2f',
			blockNumber: 1n,
			utilization: '500000000000000000',
			supplyRatePerSecond: '1000000000',
			borrowRatePerSecond: '2000000000',
		})
	})

	// Account positions intentionally resolve through the Comet EVM contract binding, not deployment REST.
	it('publishes and resolves Compound account positions from the on-chain binding', async () => {
		if (evmNetworkAccountResolver == null || compoundPositionResolver == null)
			throw new Error('missing Compound account position resolvers')

		const accountSelector = {
			$network: baseNetwork,
			$actor: {
				address: '0x0000000000000000000000000000000000000001',
			},
		}
		getAccountPositions.mockResolvedValue({
			blockNumber: 123n,
			positions: [
				{
					protocol: 'Compound III',
					chainId: 8453,
					marketSlug: 'usdc',
					cometAddress: baseCometAddress,
					baseToken: {
						symbol: 'USDC',
						address: baseConfiguration.baseTokenAddress.toLowerCase(),
						suppliedBalance: '1000000',
						borrowedBalance: '0',
					},
					collateral: [
						{
							symbol: 'WETH',
							address: '0x4200000000000000000000000000000000000006',
							balance: '1000',
						},
					],
				},
			],
		})

		const positions = await evmNetworkAccountResolver.resolve.EvmNetworkEvmAccount.resolve(
			accountSelector,
			context
		)
		expect(evmNetworkAccountResolver.projections.$$compoundPositions.select(positions)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$account: accountSelector,
					$comet: {
						$network: baseNetwork,
						cometAddress: baseCometAddress,
					},
				},
			},
		])
		expect(evmNetworkAccountResolver.projections.$$compoundPositions.resolveCount(positions)).toBe(1)
		expect(getAccountPositions).toHaveBeenCalledWith({
			chainId: 8453,
			account: accountSelector.$actor.address,
		})

		const snapshot = await compoundPositionResolver.resolve.AccountComet.resolve({
			$account: accountSelector,
			$comet: {
				$network: baseNetwork,
				cometAddress: baseCometAddress,
			},
		}, context)
		expect(compoundPositionResolver.projections.baseTokenSymbol(snapshot)).toBe('USDC')
		expect(compoundPositionResolver.projections.suppliedBalance(snapshot)).toBe('1000000')
		expect(compoundPositionResolver.projections.borrowedBalance(snapshot)).toBe(undefined)
		expect(compoundPositionResolver.projections.$$collaterals.select(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$position: {
						$account: accountSelector,
						$comet: {
							$network: baseNetwork,
							cometAddress: baseCometAddress,
						},
					},
					$asset: {
						$comet: {
							$network: baseNetwork,
							cometAddress: baseCometAddress,
						},
						symbol: 'WETH',
					},
				},
			},
		])
	})

	it('preserves an empty Compound positions list on $$compoundPositions (confirms soft-empty [] is accurate)', async () => {
		if (evmNetworkAccountResolver == null)
			throw new Error('missing EvmNetworkAccount Compound positions resolver')

		getAccountPositions.mockResolvedValue({
			blockNumber: 456n,
			positions: [],
		})

		const positions = await evmNetworkAccountResolver.resolve.EvmNetworkEvmAccount.resolve({
			$network: baseNetwork,
			$actor: {
				address: '0x0000000000000000000000000000000000000001',
			},
		}, context)

		expect(evmNetworkAccountResolver.projections.$$compoundPositions.select(positions)).toEqual([])
		expect(evmNetworkAccountResolver.projections.$$compoundPositions.resolveCount(positions)).toBe(0)
	})

	it('resolves Compound position collateral balances by PositionAsset', async () => {
		if (compoundPositionCollateralResolver == null)
			throw new Error('missing CompoundPositionCollateral resolver')

		const $position = {
			$account: {
				$network: baseNetwork,
				$actor: {
					address: '0x0000000000000000000000000000000000000001',
				},
			},
			$comet: {
				$network: baseNetwork,
				cometAddress: baseCometAddress,
			},
		}
		getAccountPositions.mockResolvedValue({
			blockNumber: 123n,
			positions: [
				{
					protocol: 'Compound III',
					chainId: 8453,
					marketSlug: 'usdc',
					cometAddress: baseCometAddress,
					baseToken: {
						symbol: 'USDC',
						address: baseConfiguration.baseTokenAddress.toLowerCase(),
						suppliedBalance: '0',
						borrowedBalance: '0',
					},
					collateral: [
						{
							symbol: 'WETH',
							address: '0x4200000000000000000000000000000000000006',
							balance: '1000',
						},
					],
				},
			],
		})

		const snapshot = await compoundPositionCollateralResolver.resolve.PositionAsset.resolve({
			$position,
			$asset: {
				$comet: $position.$comet,
				symbol: 'WETH',
			},
		}, context)
		expect(compoundPositionCollateralResolver.projections.balance(snapshot)).toBe('1000')
	})

	it('registers under Compound_Rest for CompoundComet', () => {
		expect(compoundRest.source).toBe(Source.Compound_Rest)
		expect(compoundCometResolver).toBeDefined()
		expect(compoundCometAssetResolver).toBeDefined()
		expect(networkResolver).toBeDefined()
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

	it('rejects unsupported Compound chains on CompoundComet before transport', async () => {
		if (compoundCometResolver == null)
			throw new Error('missing CompoundComet resolver')

		await expect(
			compoundCometResolver.resolve.NetworkCometAddress.resolve({
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '11155111',
					},
				},
				cometAddress: baseCometAddress,
			}, context)
		).rejects.toThrow(`${Source.Compound_Rest}: unsupported chain id 11155111`)
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('rejects Compound Comet lists for unsupported eip155 networks before transport', async () => {
		if (networkResolver == null)
			throw new Error('missing Network resolver')

		await expect(
			networkResolver.resolve.Caip2.resolve({
				caip2: {
					namespace: 'eip155',
					reference: '11155111',
				},
			}, context)
		).rejects.toThrow(`${Source.Compound_Rest}: unsupported chain id 11155111`)
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('lists cataloged Compound Comets for supported eip155 networks', async () => {
		if (networkResolver == null)
			throw new Error('missing Network resolver')

		const comets = await networkResolver.resolve.Caip2.resolve(baseNetwork, context)

		expect(networkResolver.projections.Evm.$$compoundComets.select(comets)).toContainEqual({
			[EntityMetaKey.Selector]: {
				$network: baseNetwork,
				cometAddress: baseCometAddress,
			},
		})
		expect(networkResolver.projections.Evm.$$compoundComets.resolveCount(comets)).toBe(5)
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
		expect(snapshot.rates).toEqual(baseConfiguration.rates)
		expect(compoundCometResolver.projections.$$assets.select(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$comet: {
						$network: baseNetwork,
						cometAddress: baseCometAddress,
					},
					symbol: 'cbETH',
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$comet: {
						$network: baseNetwork,
						cometAddress: baseCometAddress,
					},
					symbol: 'WETH',
				},
			},
		])
		expect(compoundCometResolver.projections.$$assets.resolveCount(snapshot)).toBe(2)
		expect(compoundCometResolver.projections.configuratorAddress(snapshot)).toBe(
			'0x316f9708bb98af7da9c68c1c3b5e79039cd336e3'
		)
		expect(compoundCometResolver.projections.$network(snapshot)).toEqual({
			[EntityMetaKey.Selector]: baseNetwork,
		})
		expect(sourceGetJson).toHaveBeenCalledTimes(2)
	})

	it('fails closed when Compound configuration omits required rates', async () => {
		if (compoundCometResolver == null)
			throw new Error('missing CompoundComet resolver')

		const {
			rates: _rates,
			...configurationWithoutRates
		} = baseConfiguration
		sourceGetJson
			.mockResolvedValueOnce(configurationWithoutRates)
			.mockResolvedValueOnce(baseRoots)

		await expect(
			compoundCometResolver.resolve.NetworkCometAddress.resolve({
				$network: baseNetwork,
				cometAddress: baseCometAddress,
			}, context)
		).rejects.toThrow(`${Source.Compound_Rest}: invalid configuration response envelope`)
	})

	it('resolves a Compound Comet collateral asset by comet and symbol', async () => {
		if (compoundCometAssetResolver == null)
			throw new Error('missing CompoundCometAsset resolver')

		sourceGetJson
			.mockResolvedValueOnce(baseConfiguration)
			.mockResolvedValueOnce(baseRoots)

		const cometSelector = {
			$network: baseNetwork,
			cometAddress: baseCometAddress,
		}
		const asset = await compoundCometAssetResolver.resolve.CometAssetSymbol.resolve({
			$comet: cometSelector,
			symbol: 'WETH',
		}, context)

		expect(compoundCometAssetResolver.projections.symbol(asset)).toBe('WETH')
		expect(compoundCometAssetResolver.projections.tokenAddress(asset)).toBe(
			'0x4200000000000000000000000000000000000006'
		)
		expect(compoundCometAssetResolver.projections.priceFeedAddress(asset)).toBe(
			'0x71041dddad3595f9ced3dccfbe3d1f4b0a16bb70'
		)
		expect(compoundCometAssetResolver.projections.decimals(asset)).toBe(18)
		expect(compoundCometAssetResolver.projections.borrowCF(asset)).toBe(0.80)
		expect(compoundCometAssetResolver.projections.liquidateCF(asset)).toBe(0.90)
		expect(compoundCometAssetResolver.projections.liquidationFactor(asset)).toBe(0.95)
		expect(compoundCometAssetResolver.projections.supplyCap(asset)).toBe('11000e18')
		expect(compoundCometAssetResolver.projections.$comet(asset)).toEqual({
			[EntityMetaKey.Selector]: cometSelector,
		})
		expect(sourceGetJson).toHaveBeenCalledTimes(2)
	})

	it('rejects unknown collateral symbols on a supported comet', async () => {
		if (compoundCometAssetResolver == null)
			throw new Error('missing CompoundCometAsset resolver')

		sourceGetJson
			.mockResolvedValueOnce(baseConfiguration)
			.mockResolvedValueOnce(baseRoots)

		await expect(
			compoundCometAssetResolver.resolve.CometAssetSymbol.resolve({
				$comet: {
					$network: baseNetwork,
					cometAddress: baseCometAddress,
				},
				symbol: 'DOGE',
			}, context)
		).rejects.toThrow(`${Source.Compound_Rest}: comet ${baseCometAddress} has no collateral asset DOGE`)
	})
})
