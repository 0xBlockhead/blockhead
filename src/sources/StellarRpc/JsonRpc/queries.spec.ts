import { beforeEach, expect, it, vi } from 'vitest'

import bindings from '$/sources/StellarRpc/bindings.ts'
import { Source } from '$/sources/Source.ts'

const jsonRpc2 = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/JsonRpc2/client.ts', () => ({
	jsonRpc2,
}))

const { getHealth, getLatestLedger } = await import('$/sources/StellarRpc/JsonRpc/queries.ts')
const binding = bindings[Source.StellarRpc_JsonRpc][0]

beforeEach(() => {
	jsonRpc2.mockReset()
})

it('forwards Stellar RPC reads without inventing parameters', async () => {
	jsonRpc2
		.mockResolvedValueOnce({ status: 'healthy' })
		.mockResolvedValueOnce({ sequence: 42 })

	await expect(getHealth(binding)).resolves.toEqual({ status: 'healthy' })
	await expect(getLatestLedger(binding)).resolves.toEqual({ sequence: 42 })
	expect(jsonRpc2.mock.calls).toEqual([
		[binding, 'getHealth', undefined],
		[binding, 'getLatestLedger', undefined],
	])
})

it('propagates Stellar RPC envelope failures', async () => {
	const failure = new Error('invalid getHealth response envelope')
	jsonRpc2.mockRejectedValueOnce(failure)

	await expect(getHealth(binding)).rejects.toBe(failure)
})
