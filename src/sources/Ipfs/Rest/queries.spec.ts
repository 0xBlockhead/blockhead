import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Ipfs/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceFetch = vi.fn()

vi.mock('$/sources/_runtime/http.ts', () => ({
	sourceFetch,
}))

const {
	assertIpfsGatewayTarget,
	fetchBrowseResult,
	getGatewayReachability,
} = await import('$/sources/Ipfs/Rest/queries.ts')
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

	it('fails closed on invalid IPFS CID targets before transport', async () => {
		await expect(fetchBrowseResult({
			namespace: 'ipfs',
			target: 'not-a-cid',
		})).rejects.toThrow('invalid IPFS CID target')

		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('fails over after network errors and non-OK gateway responses', async () => {
		sourceFetch
			.mockRejectedValueOnce(new Error('offline'))
			.mockResolvedValueOnce(new Response('nope', {
				status: 404,
				statusText: 'Not Found',
			}))
			.mockResolvedValueOnce(new Response('recovered', {
				status: 200,
				headers: {
					'content-type': 'text/plain',
				},
			}))

		await expect(fetchBrowseResult({
			namespace: 'ipfs',
			target: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3fte7awh5x5fkdg4wq5rjlk4a',
		})).resolves.toMatchObject({
			gatewayOrigin: new URL(binding.endpoints[2].locator).origin,
			text: 'recovered',
		})
		expect(sourceFetch).toHaveBeenCalledTimes(3)
	})

	it('reports declared gateway reachability without inventing endpoints', async () => {
		sourceFetch
			.mockResolvedValueOnce({ ok: true })
			.mockResolvedValueOnce({ ok: false })
			.mockRejectedValueOnce(new Error('offline'))

		await expect(getGatewayReachability()).resolves.toEqual({
			declaredAccessEndpointCount: 3,
			reachableAccessEndpointCount: 1,
			reachable: true,
		})
	})

	it('rejects blank and control-character IPNS targets', () => {
		expect(() => assertIpfsGatewayTarget({
			namespace: 'ipns',
			target: '   ',
		})).toThrow('empty content target')
		expect(() => assertIpfsGatewayTarget({
			namespace: 'ipns',
			target: 'bad\nname',
		})).toThrow('control characters')
	})
})
