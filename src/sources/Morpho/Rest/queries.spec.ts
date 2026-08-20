import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Morpho/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))

const {
	getMarket,
	getMarketState,
} = await import('$/sources/Morpho/Rest/queries.ts')

const binding = bindings[Source.Morpho_Rest][0]

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

describe('Morpho Blue market operations', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
	})

	it('reads market config by chain id and market id', async () => {
		sourceGetJson.mockResolvedValueOnce({
			data: baseMarketConfig,
		})
		await expect(getMarket({
			chainId: 8453,
			marketId: baseMarketId,
		})).resolves.toEqual({
			chainId: 8453,
			marketId: baseMarketId,
			loanToken: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
			collateralToken: '0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf',
			oracleAddress: '0x663becd10dae6c4a3dcd89f1d76c1174199639b9',
			irmAddress: '0x46415998764c29ab2a25cbea6254146d50d22687',
			lltvWad: '860000000000000000',
			creationBlockNumber: '19326981',
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			httpUrl(binding, `/v0/blue/markets/8453:${baseMarketId}`)
		)
	})

	it('reads market state by chain id and market id', async () => {
		sourceGetJson.mockResolvedValueOnce({
			data: baseMarketState,
		})
		await expect(getMarketState({
			chainId: 8453,
			marketId: baseMarketId,
		})).resolves.toEqual({
			chainId: 8453,
			marketId: baseMarketId,
			lastIndexedBlock: '49535496',
			lastAccrualTimestamp: 1785860339,
			totalSupplyAssets: '1469324386999070',
			totalSupplyShares: '1335597548670035219493',
			totalBorrowAssets: '1309301819369210',
			totalBorrowShares: '1175898795256045502042',
			feeWad: '0',
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			httpUrl(binding, `/v0/blue/markets/8453:${baseMarketId}/state`)
		)
	})

	it.each([
		['unsupported chain', {
			chainId: 999999,
			marketId: baseMarketId,
		}, 'unsupported chain id'],
		['invalid market id', {
			chainId: 8453,
			marketId: '0xdead',
		}, 'invalid market id'],
	])('rejects %s before transport', async (_, options, error) => {
		await expect(getMarket(options)).rejects.toThrow(`${Source.Morpho_Rest}: ${error}`)
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('throws when market config data is missing', async () => {
		sourceGetJson.mockResolvedValueOnce({})
		await expect(getMarket({
			chainId: 8453,
			marketId: baseMarketId,
		})).rejects.toThrow(`${Source.Morpho_Rest}: market response missing data`)
	})

	it('fails closed when market config omits a required address', async () => {
		sourceGetJson.mockResolvedValueOnce({
			data: {
				...baseMarketConfig,
				loan_token: undefined,
			},
		})
		await expect(getMarket({
			chainId: 8453,
			marketId: baseMarketId,
		})).rejects.toThrow(`${Source.Morpho_Rest}: invalid market response envelope`)
	})

	it.each([
		[
			'lltv wad',
			{
				...baseMarketConfig,
				lltv_wad: '0.86',
			},
			'invalid lltv_wad',
		],
		[
			'creation block number',
			{
				...baseMarketConfig,
				creation_block_number: '-1',
			},
			'invalid creation_block_number',
		],
	])('rejects noncanonical %s coordinates', async (_label, data, message) => {
		sourceGetJson.mockResolvedValueOnce({ data })
		await expect(getMarket({
			chainId: 8453,
			marketId: baseMarketId,
		})).rejects.toThrow(`${Source.Morpho_Rest}: ${message}`)
	})

	it('fails closed when market state envelope is malformed', async () => {
		sourceGetJson.mockResolvedValueOnce({
			data: {
				...baseMarketState,
				fee_wad: null,
			},
		})
		await expect(getMarketState({
			chainId: 8453,
			marketId: baseMarketId,
		})).rejects.toThrow(`${Source.Morpho_Rest}: invalid market state response envelope`)
	})

	it('rejects unsafe provider observation clocks', async () => {
		sourceGetJson.mockResolvedValueOnce({
			data: {
				...baseMarketState,
				last_accrual_timestamp: Number.MAX_SAFE_INTEGER + 1,
			},
		})
		await expect(getMarketState({
			chainId: 8453,
			marketId: baseMarketId,
		})).rejects.toThrow(`${Source.Morpho_Rest}: invalid last accrual timestamp`)
	})

	it.each([
		[
			'last indexed block',
			{
				...baseMarketState,
				last_indexed_block: '4.5',
			},
			'invalid last_indexed_block',
		],
		[
			'total supply assets',
			{
				...baseMarketState,
				total_supply_assets: '-1',
			},
			'invalid total_supply_assets',
		],
		[
			'fee wad',
			{
				...baseMarketState,
				fee_wad: 'not-a-number',
			},
			'invalid fee_wad',
		],
	])('rejects noncanonical %s state values', async (_label, data, message) => {
		sourceGetJson.mockResolvedValueOnce({ data })
		await expect(getMarketState({
			chainId: 8453,
			marketId: baseMarketId,
		})).rejects.toThrow(`${Source.Morpho_Rest}: ${message}`)
	})
})
