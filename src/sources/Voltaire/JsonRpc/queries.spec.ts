import { describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Voltaire/bindings.ts'
import { Source } from '$/sources/Source.ts'

const jsonRpc2 = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/JsonRpc2/client.ts', () => ({
	jsonRpc2,
}))

const { voltaireJsonRpcTransportsForBinding } = await import('$/sources/Voltaire/JsonRpc/queries.ts')

describe('Voltaire binding-owned transports', () => {
	it('derives candidates only from the selected binding and preserves it through execution', async () => {
		const dateNow = vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_123)
		jsonRpc2.mockImplementation((_binding, method) => {
			if (method === 'eth_getBlockByNumber') {
				return Promise.resolve({
					number: '0x1',
					hash: '0xhash',
					parentHash: '0xparent',
					miner: '0xminer',
					gasUsed: '0x0',
					gasLimit: '0x0',
					timestamp: '0x65a8',
					transactions: [],
				})
			}
			return Promise.resolve('0x1')
		})
		const binding = bindings[Source.Voltaire_JsonRpc][0]
		const rows = voltaireJsonRpcTransportsForBinding(binding)

		expect(rows.map(({ transport }) => transport.origin)).toEqual(
			binding.endpoints.map(({ locator }) => locator)
		)
		expect(rows.map(({ transport }) => transport.endpointKind)).toEqual(
			binding.endpoints.map(({ endpointKind }) => endpointKind)
		)
		await expect(rows[0].transport.getBlockNumber()).resolves.toBe(1n)
		await expect(rows[0].transport.getPeerCountObservation()).resolves.toEqual({
			peerCount: 1,
			providerClockMs: 26_024_000,
			fetchedAtMs: 1_700_000_000_123,
		})
		expect(jsonRpc2.mock.calls).toEqual([
			[
				binding,
				'eth_blockNumber',
				undefined,
				binding.endpoints[0],
			],
			[
				binding,
				'eth_getBlockByNumber',
				['latest', false],
				binding.endpoints[0],
			],
			[
				binding,
				'net_peerCount',
				undefined,
				binding.endpoints[0],
			],
		])
		dateNow.mockRestore()
	})
})
