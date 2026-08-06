import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/CosmosChainRegistry/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))

const {
	getAssetList,
	getChain,
} = await import('$/sources/CosmosChainRegistry/Github/queries.ts')

const binding = bindings[Source.CosmosChainRegistry_Github][0]

describe('Cosmos Chain Registry Github queries', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
	})

	it('loads fail-closed chain and assetlist envelopes for enrolled chain folders', async () => {
		sourceGetJson
			.mockResolvedValueOnce({
				chain_name: 'osmosis',
				chain_id: 'osmosis-1',
				pretty_name: 'Osmosis',
				status: 'live',
				network_type: 'mainnet',
			})
			.mockResolvedValueOnce({
				chain_name: 'osmosis',
				assets: [{
					base: 'uosmo',
					name: 'Osmosis',
					symbol: 'OSMO',
					display: 'osmo',
					type_asset: 'sdk.coin',
					denom_units: [
						{
							denom: 'uosmo',
							exponent: 0,
						},
						{
							denom: 'osmo',
							exponent: 6,
						},
					],
					traces: [{
						type: 'ibc',
						counterparty: {
							chain_name: 'cosmoshub',
							base_denom: 'uatom',
							channel_id: 'channel-141',
						},
						chain: {
							channel_id: 'channel-0',
							path: 'transfer/channel-0/uatom',
						},
					}],
				}],
			})

		await expect(getChain({ chainName: 'osmosis' })).resolves.toMatchObject({
			chain_id: 'osmosis-1',
		})
		await expect(getAssetList({ chainName: 'osmosis' })).resolves.toMatchObject({
			chain_name: 'osmosis',
			assets: [{
				base: 'uosmo',
				traces: [{
					type: 'ibc',
					counterparty: {
						chain_name: 'cosmoshub',
					},
				}],
			}],
		})
		expect(sourceGetJson).toHaveBeenNthCalledWith(
			1,
			binding,
			expect.stringContaining('/cosmos/chain-registry/master/osmosis/chain.json')
		)
		expect(sourceGetJson).toHaveBeenNthCalledWith(
			2,
			binding,
			expect.stringContaining('/cosmos/chain-registry/master/osmosis/assetlist.json')
		)
	})

	it('rejects path traversal and malformed envelopes before returning', async () => {
		await expect(getChain({ chainName: '../etc' })).rejects.toThrow('invalid chain name')
		expect(sourceGetJson).not.toHaveBeenCalled()

		sourceGetJson.mockResolvedValueOnce({
			chain_name: 'wrong',
			chain_id: 'osmosis-1',
		})
		await expect(getChain({ chainName: 'osmosis' })).rejects.toThrow('mismatched chain_name')

		sourceGetJson.mockResolvedValueOnce({
			chain_name: 'osmosis',
		})
		await expect(getAssetList({ chainName: 'osmosis' })).rejects.toThrow(
			'invalid asset list envelope'
		)
	})
})
