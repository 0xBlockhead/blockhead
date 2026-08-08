import { expect, it, vi } from 'vitest'

import bindings from '$/sources/AtprotoBsky/bindings.ts'
import { Source } from '$/sources/Source.ts'

const bskyAppViewXrpc = vi.hoisted(() => vi.fn(() => ({
	resolveHandle: vi.fn().mockResolvedValue({ did: 'did:plc:test' }),
})))

vi.mock('$/sources/_shared/interfaces/BskyAppViewXrpc/queries.ts', () => ({
	bskyAppViewXrpc,
}))

const { resolveHandle } = await import('$/sources/AtprotoBsky/Rest/queries.ts')
const binding = bindings[Source.Atproto_Xrpc][0]

it('passes only the caller-provided noncanonical binding to the XRPC transport', async () => {
	const modifiedBinding = {
		...binding,
		endpoints: binding.endpoints.map((endpoint) => ({
			...endpoint,
			locator: 'https://noncanonical.example/bsky',
		})),
	}

	await resolveHandle(modifiedBinding, 'alice.example')

	expect(bskyAppViewXrpc).toHaveBeenCalledOnce()
	expect(bskyAppViewXrpc.mock.calls[0][0]).toBe(modifiedBinding)
})
