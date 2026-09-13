import { Source } from '$/sources/Source.ts'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const sourceFetch = vi.fn()

// Keep the single-endpoint transport contract independent of registry growth.
vi.mock('$/sources/MempoolSpace/bindings.ts', async (importOriginal) => {
	const { default: bindings } = await importOriginal<typeof import('$/sources/MempoolSpace/bindings.ts')>()
	return {
		default: {
			MempoolSpace_Rest: bindings.MempoolSpace_Rest.filter((binding) => (
				binding.target.key === 'bip122:000000000019d6689c085ae165831e93'
			)),
		},
	}
})

vi.mock('$/sources/_runtime/http.ts', () => ({
	sourceFetch,
}))

vi.mock('$/sources/Voltaire/bindings.ts', async (importOriginal) => {
	const { default: bindings } = await importOriginal<typeof import('$/sources/Voltaire/bindings.ts')>()
	return {
		default: {
			Voltaire_JsonRpc: bindings.Voltaire_JsonRpc
				.filter(binding => binding.target.kind === 'Eip155Chain' && binding.target.key === '1')
				.map(binding => ({ ...binding, endpoints: [binding.endpoints[0]] })),
		},
	}
})

const { probeSourceHttpEndpoint } = await import('$/sources/_runtime/probe.ts')

describe('source HTTP endpoint probes', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it.each([
		['matching chain', { jsonrpc: '2.0', id: 'probe', result: '0x1' }, true],
		['wrong chain', { jsonrpc: '2.0', id: 'probe', result: '0x38' }, false],
		['numeric quantity', { jsonrpc: '2.0', id: 'probe', result: 1 }, false],
		['noncanonical quantity', { jsonrpc: '2.0', id: 'probe', result: '0x01' }, false],
		['wrong request identity', { jsonrpc: '2.0', id: 'another', result: '0x1' }, false],
		['wrong protocol', { jsonrpc: '1.0', id: 'probe', result: '0x1' }, false],
		['protocol error', { jsonrpc: '2.0', id: 'probe', error: { code: -32601, message: 'method not found' } }, false],
		['conflicting result and error', { jsonrpc: '2.0', id: 'probe', result: '0x1', error: { code: -32601, message: 'method not found' } }, false],
		['null envelope', null, false],
		['invalid JSON', 'not json', false],
	] as const)('distinguishes reachable from available EVM endpoints: %s', async (_label, payload, available) => {
		sourceFetch.mockResolvedValueOnce(new Response(typeof payload === 'string' ? payload : JSON.stringify(payload), {
			status: 200,
			headers: { 'ratelimit-remaining': '17', 'ratelimit-reset': '2000' },
		}))
		await expect(probeSourceHttpEndpoint(Source.Voltaire_JsonRpc)).resolves.toMatchObject({
			availableEndpointCount: available ? 1 : 0,
			reachableEndpointCount: 1,
			endpointCount: 1,
			endpoints: [{ available, reachable: true, statusCode: 200 }],
			rateLimitRemaining: 17,
			rateLimitResetMs: 2_000_000,
		})
		expect(sourceFetch).toHaveBeenCalledExactlyOnceWith(expect.anything(), expect.any(String), expect.objectContaining({
			method: 'POST',
			body: JSON.stringify({ id: 'probe', jsonrpc: '2.0', method: 'eth_chainId', params: [] }),
		}))
	})

	it('releases rejected EVM response bodies without falling back to HTTP success', async () => {
		const cancel = vi.fn()
		sourceFetch.mockResolvedValueOnce({
			body: { cancel },
			headers: new Headers(),
			ok: false,
			status: 405,
		})
		await expect(probeSourceHttpEndpoint(Source.Voltaire_JsonRpc)).resolves.toMatchObject({
			availableEndpointCount: 0,
			reachableEndpointCount: 1,
			statusCode: 405,
		})
		expect(sourceFetch).toHaveBeenCalledOnce()
		expect(cancel).toHaveBeenCalledOnce()
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
