import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Ipfs/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { ContentGatewayFamily } from '$/sources/_shared/interfaces/ContentGateway/types.ts'

const sourceFetch = vi.fn()

vi.mock('$/sources/_runtime/http.ts', () => ({
	sourceFetch,
}))

const {
	assertGatewayContentPath,
	getGatewayReachability,
	isGatewayEndpointReachable,
	listDeclaredGatewayOrigins,
} = await import('$/sources/_shared/interfaces/ContentGateway/queries.ts')
const binding = bindings[Source.Ipfs_Rest][0]

describe('ContentGateway shared helpers', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('lists declared gateway origins from the binding endpoints', () => {
		expect(listDeclaredGatewayOrigins(binding)).toEqual(
			binding.endpoints.map((endpoint) => new URL(endpoint.locator).origin)
		)
	})

	it('rejects content paths that contain control characters', () => {
		expect(() => assertGatewayContentPath({
			family: ContentGatewayFamily.Ipfs,
			contentPath: 'ok/path',
		})).not.toThrow()
		expect(() => assertGatewayContentPath({
			family: ContentGatewayFamily.Ipfs,
			contentPath: 'bad\npath',
		})).toThrow('control characters')
	})

	it.each([
		'.',
		'..',
		'nested/../other',
	])('rejects traversal content path %s', (contentPath) => {
		expect(() => assertGatewayContentPath({
			family: ContentGatewayFamily.Ipfs,
			contentPath,
		})).toThrow('traversal segment')
	})

	it('falls back from rejected HEAD to GET when probing reachability', async () => {
		sourceFetch
			.mockResolvedValueOnce({ ok: false, status: 405 })
			.mockResolvedValueOnce({ ok: true, status: 200 })

		await expect(isGatewayEndpointReachable({
			binding,
			endpoint: binding.endpoints[0],
		})).resolves.toBe(true)
		expect(sourceFetch.mock.calls.map(([, , init]) => init?.method)).toEqual([
			'HEAD',
			'GET',
		])
	})

	it('rejects an endpoint not owned by the selected binding before transport', async () => {
		await expect(isGatewayEndpointReachable({
			binding,
			endpoint: {
				...binding.endpoints[0],
				locator: 'https://foreign.example',
			},
		})).rejects.toThrow('endpoint is not owned by the selected binding')
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('falls back to GET after HEAD transport failure', async () => {
		sourceFetch
			.mockRejectedValueOnce(new Error('offline head'))
			.mockResolvedValueOnce({ ok: true, status: 200 })

		await expect(getGatewayReachability({
			binding,
		})).resolves.toMatchObject({
			declaredAccessEndpointCount: binding.endpoints.length,
			reachableAccessEndpointCount: 1,
			reachable: true,
		})
	})
})
