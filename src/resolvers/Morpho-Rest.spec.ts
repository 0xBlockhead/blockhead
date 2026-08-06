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

const { default: morphoRest } = await import('$/resolvers/Morpho-Rest.ts')

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

const morphoMarketResolver = morphoRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.MorphoMarket
))

const baseMarketId = '0x9103c3b4e834476c9a62ea009ba2c884ee42e94e6e314a26f04d312434191836'

const baseMarketConfig = {
	chain_id: 8453,
	market_id: baseMarketId,
	loan_token: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
	collateral_token: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
	oracle_address: '0x663BECd10daE6C4A3Dcd89F1d76c1174199639B9',
	irm_address: '0x46415998764C29aB2a25CbeA6254146D50D22687',
	lltv_wad: '860000000000000000',
	creation_block_number: '19326981',
} as const

const baseMarketState = {
	chain_id: 8453,
	market_id: baseMarketId,
	last_indexed_block: '49535496',
	last_accrual_timestamp: 1785860339,
	total_supply_assets: '1469324386999070',
	total_supply_shares: '1335597548670035219493',
	total_borrow_assets: '1309301819369210',
	total_borrow_shares: '1175898795256045502042',
	fee_wad: '0',
} as const

describe('Morpho Rest resolver module', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
	})

	it('registers under Morpho_Rest for MorphoMarket only', () => {
		expect(morphoRest.source).toBe(Source.Morpho_Rest)
		expect(morphoMarketResolver).toBeDefined()
		expect(morphoRest.resolvers).toHaveLength(1)
		expect(morphoMarketResolver?.resolveLive).toBeUndefined()
	})

	it('rejects non-eip155 networks before transport', async () => {
		if (morphoMarketResolver == null)
			throw new Error('missing MorphoMarket resolver')

		await expect(
			morphoMarketResolver.resolve.NetworkMarketId.resolve({
				$network: {
					caip2: {
						namespace: 'cosmos',
						reference: 'osmosis-1',
					},
				},
				marketId: baseMarketId,
			}, context)
		).rejects.toThrow(`${Source.Morpho_Rest}: network must use the eip155 CAIP-2 namespace`)
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('rejects unsupported Morpho Blue chains before transport', async () => {
		if (morphoMarketResolver == null)
			throw new Error('missing MorphoMarket resolver')

		await expect(
			morphoMarketResolver.resolve.NetworkMarketId.resolve({
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '137',
					},
				},
				marketId: baseMarketId,
			}, context)
		).rejects.toThrow(`${Source.Morpho_Rest}: unsupported chain id 137`)
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('rejects invalid market ids before transport', async () => {
		if (morphoMarketResolver == null)
			throw new Error('missing MorphoMarket resolver')

		await expect(
			morphoMarketResolver.resolve.NetworkMarketId.resolve({
				$network: baseNetwork,
				marketId: '0xdead',
			}, context)
		).rejects.toThrow(`${Source.Morpho_Rest}: invalid market id`)
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('resolves Morpho Blue config + state fields via getMarket and getMarketState', async () => {
		if (morphoMarketResolver == null)
			throw new Error('missing MorphoMarket resolver')

		sourceGetJson
			.mockResolvedValueOnce({
				data: baseMarketConfig,
			})
			.mockResolvedValueOnce({
				data: baseMarketState,
			})

		const snapshot = await morphoMarketResolver.resolve.NetworkMarketId.resolve({
			$network: baseNetwork,
			marketId: baseMarketId,
		}, context)

		expect(morphoMarketResolver.projections.$network(snapshot)).toEqual({
			[EntityMetaKey.Selector]: baseNetwork,
		})
		expect(morphoMarketResolver.projections.marketId(snapshot)).toBe(baseMarketId)
		expect(morphoMarketResolver.projections.loanAssetAddress(snapshot)).toBe(
			'0x833589fcd6edb6e08f4c7c32d4f71b54bda02913'
		)
		expect(morphoMarketResolver.projections.collateralAssetAddress(snapshot)).toBe(
			'0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf'
		)
		expect(morphoMarketResolver.projections.oracleAddress(snapshot)).toBe(
			'0x663becd10dae6c4a3dcd89f1d76c1174199639b9'
		)
		expect(morphoMarketResolver.projections.irmAddress(snapshot)).toBe(
			'0x46415998764c29ab2a25cbea6254146d50d22687'
		)
		expect(morphoMarketResolver.projections.lltvWad(snapshot)).toBe('860000000000000000')
		expect(morphoMarketResolver.projections.creationBlockNumber(snapshot)).toBe('19326981')
		expect(morphoMarketResolver.projections.totalSupplyAssets(snapshot)).toBe(
			'1469324386999070'
		)
		expect(morphoMarketResolver.projections.totalSupplyShares(snapshot)).toBe(
			'1335597548670035219493'
		)
		expect(morphoMarketResolver.projections.totalBorrowAssets(snapshot)).toBe(
			'1309301819369210'
		)
		expect(morphoMarketResolver.projections.totalBorrowShares(snapshot)).toBe(
			'1175898795256045502042'
		)
		expect(morphoMarketResolver.projections.feeWad(snapshot)).toBe('0')
		expect(morphoMarketResolver.projections.lastIndexedBlock(snapshot)).toBe('49535496')
		expect(morphoMarketResolver.projections.lastAccrualTimestamp(snapshot)).toBe(1785860339)
		expect(sourceGetJson).toHaveBeenCalledTimes(2)
		expect(String(sourceGetJson.mock.calls[0]?.[1])).toContain(
			`/v0/blue/markets/8453:${baseMarketId}`
		)
		expect(String(sourceGetJson.mock.calls[1]?.[1])).toContain(
			`/v0/blue/markets/8453:${baseMarketId}/state`
		)
	})

	it('fails closed when market config omits a required address', async () => {
		if (morphoMarketResolver == null)
			throw new Error('missing MorphoMarket resolver')

		sourceGetJson
			.mockResolvedValueOnce({
				data: {
					...baseMarketConfig,
					loan_token: undefined,
				},
			})
			.mockResolvedValueOnce({
				data: baseMarketState,
			})

		await expect(
			morphoMarketResolver.resolve.NetworkMarketId.resolve({
				$network: baseNetwork,
				marketId: baseMarketId,
			}, context)
		).rejects.toThrow(`${Source.Morpho_Rest}: invalid market response envelope`)
	})

	it('fails closed when market state response omits data', async () => {
		if (morphoMarketResolver == null)
			throw new Error('missing MorphoMarket resolver')

		sourceGetJson
			.mockResolvedValueOnce({
				data: baseMarketConfig,
			})
			.mockResolvedValueOnce({})

		await expect(
			morphoMarketResolver.resolve.NetworkMarketId.resolve({
				$network: baseNetwork,
				marketId: baseMarketId,
			}, context)
		).rejects.toThrow(`${Source.Morpho_Rest}: market state response missing data`)
	})

	it('fails closed when market state omits supply assets', async () => {
		if (morphoMarketResolver == null)
			throw new Error('missing MorphoMarket resolver')

		sourceGetJson
			.mockResolvedValueOnce({
				data: baseMarketConfig,
			})
			.mockResolvedValueOnce({
				data: {
					...baseMarketState,
					total_supply_assets: undefined,
				},
			})

		await expect(
			morphoMarketResolver.resolve.NetworkMarketId.resolve({
				$network: baseNetwork,
				marketId: baseMarketId,
			}, context)
		).rejects.toThrow(`${Source.Morpho_Rest}: invalid market state response envelope`)
	})
})
