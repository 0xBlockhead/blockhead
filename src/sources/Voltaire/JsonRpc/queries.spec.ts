import { describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Voltaire/bindings.ts'
import { Source } from '$/sources/Source.ts'

const jsonRpc2 = vi.hoisted(() => vi.fn().mockResolvedValue('0x1'))

vi.mock('$/sources/_shared/wire/JsonRpc2/client.ts', () => ({
	jsonRpc2,
}))

const { voltaireJsonRpcTransportsForBinding } = await import('$/sources/Voltaire/JsonRpc/queries.ts')

describe('Voltaire binding-owned transports', () => {
	it('derives candidates only from the selected binding and preserves it through execution', async () => {
		const binding = bindings[Source.Voltaire_JsonRpc][0]
		const rows = voltaireJsonRpcTransportsForBinding(binding)

		expect(rows.map(({ transport }) => transport.origin)).toEqual(
			binding.endpoints.map(({ locator }) => locator)
		)
		await expect(rows[0].transport.getBlockNumber()).resolves.toBe(1n)
		expect(jsonRpc2).toHaveBeenCalledWith(
			binding,
			'eth_blockNumber',
			undefined,
			binding.endpoints[0]
		)
	})
})
