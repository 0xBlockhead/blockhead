import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { CoinInstanceRepresentation } from '$/constants/Bridge.ts'
import { CoinId } from '$/constants/Coin.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { CoinInstanceType } from '$/schema/CoinInstanceType.ts'

vi.mock('$/sources/Coingecko/Rest/constants.ts', () => ({
	idByCoinId: {
		[CoinId.ETH]: 'ethereum',
	},
}))

const {
	getAssetPlatforms,
	getCoin,
} = vi.hoisted(() => ({
	getAssetPlatforms: vi.fn(),
	getCoin: vi.fn(),
}))

vi.mock('$/sources/Coingecko/Rest/queries.ts', () => ({
	getAssetPlatforms,
	getCoin,
}))

import {
	fetchCoinInstanceStubsForCoin,
	resolveCanonicalCoinInstanceEntitySelector,
	resolveCoinIdForCoinInstanceEntitySelector,
	resolveCoinInstanceRepresentation,
	type CoinInstanceEntitySelector,
} from '$/resolvers/Coingecko/Rest/coinInstances.ts'

const baseNative = {
	$network: {
		caip2: {
			namespace: 'eip155',
			reference: '8453',
		},
	},
	type: CoinInstanceType.NativeCurrency,
} as const satisfies CoinInstanceEntitySelector
const ethereumContract = {
	$network: {
		caip2: {
			namespace: 'eip155',
			reference: '1',
		},
	},
	type: CoinInstanceType.Erc20Token,
	$contract: {
		$network: {
			caip2: {
				namespace: 'eip155',
				reference: '1',
			},
		},
		address: '0x0000000000000000000000000000000000000001',
	},
} as const satisfies CoinInstanceEntitySelector

describe('CoinGecko coin-instance projection', () => {
	beforeEach(() => {
		getCoin.mockReset()
		getAssetPlatforms.mockReset()
		getCoin.mockResolvedValue({
			id: 'ethereum',
			name: 'Ethereum',
			symbol: 'eth',
			asset_platform_id: 'base',
			platforms: {
				ethereum: ethereumContract.$contract.address,
			},
		})
		getAssetPlatforms.mockResolvedValue([
			{
				id: 'ethereum',
				name: 'Ethereum',
				chain_identifier: 1,
				native_coin_id: 'ethereum',
			},
			{
				id: 'base',
				name: 'Base',
				chain_identifier: 8_453,
				native_coin_id: 'ethereum',
			},
		])
	})

	it('derives and deduplicates native and contract selectors outside the source layer', async () => {
		await expect(fetchCoinInstanceStubsForCoin(
			CoinId.ETH,
			{}
		)).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: baseNative,
				representation: CoinInstanceRepresentation.IssuerNative,
			},
			{
				[EntityMetaKey.Selector]: {
					...baseNative,
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: '1',
						},
					},
				},
				representation: CoinInstanceRepresentation.IssuerNative,
			},
			{
				[EntityMetaKey.Selector]: ethereumContract,
				representation: CoinInstanceRepresentation.CanonicalL2Native,
			},
		])
	})

	it('indexes each fetched catalog once for identity and representation lookups', async () => {
		await expect(resolveCoinIdForCoinInstanceEntitySelector(
			ethereumContract,
			{}
		)).resolves.toBe(CoinId.ETH)
		expect(getCoin).toHaveBeenCalledOnce()
		expect(getAssetPlatforms).toHaveBeenCalledOnce()

		getCoin.mockClear()
		getAssetPlatforms.mockClear()
		await expect(resolveCoinInstanceRepresentation(
			ethereumContract,
			{}
		)).resolves.toBe(CoinInstanceRepresentation.CanonicalL2Native)
		expect(getCoin).toHaveBeenCalledOnce()
		expect(getAssetPlatforms).toHaveBeenCalledOnce()
	})

	it('derives a canonical selector from the same indexed catalog without refetching', async () => {
		await expect(resolveCanonicalCoinInstanceEntitySelector(
			ethereumContract,
			{}
		)).resolves.toEqual(baseNative)
		expect(getCoin).toHaveBeenCalledOnce()
		expect(getAssetPlatforms).toHaveBeenCalledOnce()
	})
})
