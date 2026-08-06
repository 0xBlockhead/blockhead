import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Osmosis/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceDelivery,
	SourceEndpointKind,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))

const {
	getBlock,
	getConcentratedLiquidityPools,
	getDenomTrace,
	getLatestBlock,
	getLiquidityPerTickRange,
	getNodeInfo,
	getPool,
	getPools,
	getSpotPrice,
	getStakingPool,
	getSyncing,
	getValidators,
} = await import('$/sources/Osmosis/Rest/queries.ts')

const binding = bindings[Source.Osmosis_LCD_Rest][0]
const osmosisLcdRestUrl = binding.endpoints[0].locator

describe('Osmosis LCD binding', () => {
	it('targets cosmos:osmosis-1 over cosmoshub-4', () => {
		expect(binding.target).toEqual({
			kind: SourceTargetKind.Caip2Network,
			key: 'cosmos:osmosis-1',
		})
		expect(binding.target.key).not.toBe('cosmos:cosmoshub-4')
		expect(binding.source).toBe(Source.Osmosis_LCD_Rest)
		expect(binding.apiFamily).toBe(ApiFamily.CosmosLcdApi)
		expect(binding.wireProtocol).toBe(WireProtocol.HttpRest)
		expect(binding.delivery).toBe(SourceDelivery.BrowserDirect)
		expect(binding.endpoints).toEqual([
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: osmosisLcdRestUrl,
				corsEnabled: true,
			},
		])
	})
})

describe('Osmosis LCD named operations', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
	})

	it('reads node info from the Osmosis LCD', async () => {
		sourceGetJson.mockResolvedValueOnce({
			default_node_info: {
				network: 'osmosis-1',
			},
		})
		await expect(getNodeInfo()).resolves.toMatchObject({
			default_node_info: {
				network: 'osmosis-1',
			},
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			httpUrl(binding, '/cosmos/base/tendermint/v1beta1/node_info')
		)
	})

	it('reads the latest block', async () => {
		sourceGetJson.mockResolvedValueOnce({
			block: {
				header: {
					height: '1',
					time: '2026-08-04T00:00:00Z',
					chain_id: 'osmosis-1',
					proposer_address: 'proposer',
				},
				data: {
					txs: [],
				},
			},
			block_id: {
				hash: 'abcd',
			},
		})
		await expect(getLatestBlock()).resolves.toMatchObject({
			block: {
				header: {
					chain_id: 'osmosis-1',
				},
			},
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			httpUrl(binding, '/cosmos/base/tendermint/v1beta1/blocks/latest')
		)
	})

	it('reads a block by height', async () => {
		sourceGetJson.mockResolvedValueOnce({
			block_id: {
				hash: 'height-hash',
			},
			block: {
				header: {
					height: '9',
					time: '2026-08-04T00:00:00Z',
					chain_id: 'osmosis-1',
					proposer_address: 'proposer',
				},
				data: {
					txs: [
						'tx',
					],
				},
			},
		})
		await expect(getBlock({
			height: 9n,
		})).resolves.toMatchObject({
			block_id: {
				hash: 'height-hash',
			},
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			httpUrl(binding, '/cosmos/base/tendermint/v1beta1/blocks/9')
		)
	})

	it('rejects a negative block height before transport', () => {
		expect(() => getBlock({
			height: -1n,
		})).toThrow(`${Source.Osmosis_LCD_Rest}: invalid block height`)
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('reads syncing status', async () => {
		sourceGetJson.mockResolvedValueOnce({
			syncing: false,
		})
		await expect(getSyncing()).resolves.toEqual({
			syncing: false,
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			httpUrl(binding, '/cosmos/base/tendermint/v1beta1/syncing')
		)
	})

	it('reads the staking pool', async () => {
		sourceGetJson.mockResolvedValueOnce({
			pool: {
				bonded_tokens: '1',
				not_bonded_tokens: '2',
			},
		})
		await expect(getStakingPool()).resolves.toEqual({
			pool: {
				bonded_tokens: '1',
				not_bonded_tokens: '2',
			},
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			httpUrl(binding, '/cosmos/staking/v1beta1/pool')
		)
	})

	it('lists bonded validators with count_total', async () => {
		sourceGetJson.mockResolvedValueOnce({
			validators: [],
			pagination: {
				total: '0',
			},
		})
		await expect(getValidators({
			limit: 1,
			status: 'BOND_STATUS_BONDED',
		})).resolves.toMatchObject({
			pagination: {
				total: '0',
			},
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			httpUrl(binding, '/cosmos/staking/v1beta1/validators?pagination.limit=1&pagination.count_total=true&status=BOND_STATUS_BONDED')
		)
	})

	it('reads a pool by id through poolmanager', async () => {
		sourceGetJson.mockResolvedValueOnce({
			pool: {
				id: '1',
				'@type': '/osmosis.gamm.v1beta1.Pool',
			},
		})
		await expect(getPool('1')).resolves.toMatchObject({
			pool: {
				id: '1',
			},
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			httpUrl(binding, '/osmosis/poolmanager/v1beta1/pools/1')
		)
	})

	it('rejects a pool envelope with a mismatched id', async () => {
		sourceGetJson.mockResolvedValueOnce({
			pool: {
				id: '2',
			},
		})

		await expect(getPool('1')).rejects.toThrow(`${Source.Osmosis_LCD_Rest}: pool id mismatch 2 !== 1`)
	})

	it('rejects a malformed pool envelope instead of yielding a partial detail', async () => {
		sourceGetJson.mockResolvedValueOnce({
			pool: {
				id: 'not-an-id',
			},
		})

		await expect(getPool('1')).rejects.toThrow(`${Source.Osmosis_LCD_Rest}: invalid pool response envelope`)
	})

	it('rejects a pool detail without an identity', async () => {
		sourceGetJson.mockResolvedValueOnce({
			pool: {},
		})

		await expect(getPool('1')).rejects.toThrow(`${Source.Osmosis_LCD_Rest}: invalid pool response envelope`)
	})

	it('rejects a non-integer pool id before transport', () => {
		expect(() => getPool('1.5')).toThrow(`${Source.Osmosis_LCD_Rest}: invalid pool id`)
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('lists all pools from the documented poolmanager endpoint', async () => {
		sourceGetJson.mockResolvedValueOnce({
			pools: [],
		})
		await expect(getPools()).resolves.toEqual({
			pools: [],
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			httpUrl(binding, '/osmosis/poolmanager/v1beta1/all-pools')
		)
	})

	it('does not invent the unimplemented paginated pools list path', async () => {
		sourceGetJson.mockResolvedValueOnce({
			pools: [],
		})
		await getPools()
		expect(sourceGetJson.mock.calls[0][1]).not.toContain('/osmosis/poolmanager/v1beta1/pools?')
		expect(sourceGetJson.mock.calls[0][1]).toContain('/osmosis/poolmanager/v1beta1/all-pools')
	})

	it('rejects a malformed pools envelope instead of treating it as empty', async () => {
		sourceGetJson.mockResolvedValueOnce({})

		await expect(getPools()).rejects.toThrow(`${Source.Osmosis_LCD_Rest}: invalid pools response envelope`)
	})

	it('rejects a pool list containing an invalid pool identity', async () => {
		sourceGetJson.mockResolvedValueOnce({
			pools: [
				{
					id: '01',
				},
			],
		})

		await expect(getPools()).rejects.toThrow(`${Source.Osmosis_LCD_Rest}: invalid pools response envelope`)
	})

	it('rejects duplicate pool ids in the all-pools response', async () => {
		sourceGetJson.mockResolvedValueOnce({
			pools: [
				{
					id: '1',
				},
				{
					id: '1',
				},
			],
		})
		await expect(getPools()).rejects.toThrow(`${Source.Osmosis_LCD_Rest}: all-pools response contains duplicate pool ids`)
	})

	it('reads concentrated liquidity pools with pagination', async () => {
		sourceGetJson.mockResolvedValueOnce({
			pools: [
				{
					id: '1066',
					'@type': '/osmosis.concentratedliquidity.v1beta1.Pool',
					token0: 'uosmo',
					token1: 'uion',
					current_tick: '91850677',
				},
			],
			pagination: {
				next_key: 'MTA3Ng==',
				total: '42',
			},
		})
		await expect(getConcentratedLiquidityPools({
			limit: 1,
			offset: 0,
		})).resolves.toMatchObject({
			pools: [
				{
					id: '1066',
					token0: 'uosmo',
				},
			],
			pagination: {
				total: '42',
			},
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			httpUrl(binding, '/osmosis/concentratedliquidity/v1beta1/pools?pagination.limit=1&pagination.offset=0&pagination.count_total=true')
		)
	})

	it('rejects non-CL pools in the concentrated liquidity list', async () => {
		sourceGetJson.mockResolvedValueOnce({
			pools: [
				{
					id: '1',
					'@type': '/osmosis.gamm.v1beta1.Pool',
				},
			],
		})
		await expect(getConcentratedLiquidityPools()).rejects.toThrow(`${Source.Osmosis_LCD_Rest}: non-CL pool in concentrated liquidity list 1`)
	})

	it('reads liquidity per tick range for a CL pool', async () => {
		sourceGetJson.mockResolvedValueOnce({
			liquidity: [
				{
					liquidity_amount: '1.5',
					lower_tick: '-100',
					upper_tick: '100',
				},
			],
		})
		await expect(getLiquidityPerTickRange({
			poolId: '1066',
		})).resolves.toEqual({
			liquidity: [
				{
					liquidity_amount: '1.5',
					lower_tick: '-100',
					upper_tick: '100',
				},
			],
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			httpUrl(binding, '/osmosis/concentratedliquidity/v1beta1/liquidity_per_tick_range?pool_id=1066')
		)
	})

	it('reads a spot price for a pool', async () => {
		sourceGetJson.mockResolvedValueOnce({
			spot_price: '1.25',
		})
		await expect(getSpotPrice({
			poolId: '1',
			baseAssetDenom: 'uosmo',
			quoteAssetDenom: 'uion',
		})).resolves.toEqual({
			spot_price: '1.25',
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			httpUrl(binding, '/osmosis/poolmanager/v1beta1/pools/1/prices?base_asset_denom=uosmo&quote_asset_denom=uion')
		)
	})

	it('fetches an ICS-20 denom trace by hash', async () => {
		const hash = 'a'.repeat(64)
		sourceGetJson.mockResolvedValueOnce({
			denom_trace: {
				path: 'transfer/channel-0',
				base_denom: 'uatom',
			},
		})
		await expect(getDenomTrace(hash)).resolves.toEqual({
			denom_trace: {
				path: 'transfer/channel-0',
				base_denom: 'uatom',
			},
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			httpUrl(binding, `/ibc/apps/transfer/v1/denom_traces/${hash}`)
		)
	})

	it('parses a path/base-denom trace key without transport', async () => {
		await expect(getDenomTrace('trace:transfer/channel-0/uatom')).resolves.toEqual({
			denom_trace: {
				path: 'transfer/channel-0',
				base_denom: 'uatom',
			},
		})
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('rejects an empty denom trace key', () => {
		expect(() => getDenomTrace('')).toThrow(`${Source.Osmosis_LCD_Rest}: invalid denom trace key`)
		expect(sourceGetJson).not.toHaveBeenCalled()
	})
})
