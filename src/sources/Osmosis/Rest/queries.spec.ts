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
	getDenomTrace,
	getLatestBlock,
	getNodeInfo,
	getPool,
	getPools,
	getSpotPrice,
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
		expect(binding.delivery).toBe(SourceDelivery.HttpProxy)
		expect(binding.endpoints).toEqual([
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: osmosisLcdRestUrl,
				corsEnabled: false,
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

	it('rejects a non-integer pool id before transport', () => {
		expect(() => getPool('1.5')).toThrow(`${Source.Osmosis_LCD_Rest}: invalid pool id`)
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('lists pools with a bounded pagination limit', async () => {
		sourceGetJson.mockResolvedValueOnce({
			pools: [],
		})
		await expect(getPools({
			limit: 10,
		})).resolves.toEqual({
			pools: [],
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			httpUrl(binding, '/osmosis/poolmanager/v1beta1/pools?pagination.limit=10')
		)
	})

	it('rejects an out-of-range pools limit', () => {
		expect(() => getPools({
			limit: 0,
		})).toThrow(`${Source.Osmosis_LCD_Rest}: invalid pools limit`)
		expect(sourceGetJson).not.toHaveBeenCalled()
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
