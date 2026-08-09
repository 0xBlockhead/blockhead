import { expect, it, vi } from 'vitest'
import bindings from '$/sources/Envio/bindings.ts'
import { Source } from '$/sources/Source.ts'

const jsonRpc2 = vi.hoisted(() => vi.fn(async () => '0x2a'))
vi.mock('$/sources/_shared/wire/JsonRpc2/client.ts', () => ({ jsonRpc2 }))

it('executes with the selected Envio binding', async () => {
	const binding = bindings[Source.EnvioHyperRpc_JsonRpc][0]
	const { envioHyperRpc } = await import('./queries.ts')
	await expect(envioHyperRpc(binding).getBlockNumber()).resolves.toBe(42n)
	expect(jsonRpc2.mock.calls[0][0]).toBe(binding)
})
