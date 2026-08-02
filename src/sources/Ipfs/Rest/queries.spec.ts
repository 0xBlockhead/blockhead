import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Ipfs/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceFetch = vi.fn()

vi.mock('$/sources/_runtime/http.ts', () => ({
	sourceFetch,
}))

const { fetchBrowseResult } = await import('$/sources/Ipfs/Rest/queries.ts')
const binding = bindings[Source.Ipfs_Rest][0]

describe('IPFS gateway binding transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('uses the ordered HTTP endpoints from the canonical binding', async () => {
		sourceFetch.mockResolvedValue(new Response('hello', {
			status: 200,
			headers: {
				'content-type': 'text/plain',
			},
		}))

		await expect(fetchBrowseResult({
			namespace: 'ipfs',
			target: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3fte7awh5x5fkdg4wq5rjlk4a',
		})).resolves.toMatchObject({
			gatewayOrigin: new URL(binding.endpoints[0].locator).origin,
			text: 'hello',
		})
		expect(sourceFetch).toHaveBeenCalledOnce()
		expect(sourceFetch.mock.calls[0][0]).toBe(binding)
		expect(sourceFetch.mock.calls[0][1]).toBe(
			`${binding.endpoints[0].locator}/ipfs/bafybeigdyrzt5sfp7udm7hu76uh7y26nf3fte7awh5x5fkdg4wq5rjlk4a`
		)
	})
})
