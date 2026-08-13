import { Source } from '$/sources/Source.ts'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const sourceFetch = vi.fn()

vi.mock('$/sources/_runtime/http.ts', () => ({
	sourceFetch,
}))

const { probeSourceHttpEndpoint } = await import('$/sources/_runtime/probe.ts')

describe('source HTTP endpoint probes', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('falls back to a bounded GET when an endpoint rejects HEAD', async () => {
		const cancel = vi.fn()
		sourceFetch
			.mockResolvedValueOnce(new Response(null, {
				status: 405,
			}))
			.mockResolvedValueOnce({
				body: {
					cancel,
				},
				headers: new Headers({
					'x-ratelimit-remaining': '17',
				}),
				ok: true,
				status: 206,
			})

		await expect(probeSourceHttpEndpoint(Source.MempoolSpace_Rest)).resolves.toMatchObject({
			availableEndpointCount: 1,
			endpoints: [{
				available: true,
				bindingId: expect.any(String),
				endpointIndex: 0,
				endpointUrl: expect.any(String),
				latencyMs: expect.any(Number),
				rateLimitRemaining: 17,
				reachable: true,
				statusCode: 206,
			}],
			endpointCount: 1,
			rateLimitRemaining: 17,
			reachableEndpointCount: 1,
			statusCode: 206,
		})
		expect(sourceFetch).toHaveBeenNthCalledWith(1, expect.anything(), expect.any(String), expect.objectContaining({
			method: 'HEAD',
		}))
		expect(sourceFetch).toHaveBeenNthCalledWith(2, expect.anything(), expect.any(String), expect.objectContaining({
			headers: {
				range: 'bytes=0-0',
			},
			method: 'GET',
		}))
		expect(cancel).toHaveBeenCalledOnce()
	})

	it('does not retry ordinary endpoint failures', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(null, {
			status: 503,
		}))

		await expect(probeSourceHttpEndpoint(Source.MempoolSpace_Rest)).resolves.toMatchObject({
			availableEndpointCount: 0,
			endpoints: [{
				available: false,
				bindingId: expect.any(String),
				endpointIndex: 0,
				endpointUrl: expect.any(String),
				latencyMs: expect.any(Number),
				reachable: true,
				statusCode: 503,
			}],
			endpointCount: 1,
			reachableEndpointCount: 1,
			statusCode: 503,
		})
		expect(sourceFetch).toHaveBeenCalledOnce()
	})
})
