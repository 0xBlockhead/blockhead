import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Swarm/bindings.ts'
import { swarmDocsLandingReference } from '$/sources/Swarm/Rest/constants.ts'
import { Source } from '$/sources/Source.ts'

const sourceFetch = vi.fn()

vi.mock('$/sources/_runtime/http.ts', () => ({
	sourceFetch,
}))

const {
	assertSwarmGatewayReference,
	fetchBrowseResult,
	getGatewayReachability,
	listDeclaredGatewayOrigins,
} = await import('$/sources/Swarm/Rest/queries.ts')
const binding = bindings[Source.Swarm_Rest][0]

describe('Swarm gateway binding transport', () => {
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
			reference: `bzz://${swarmDocsLandingReference}`,
		})).resolves.toMatchObject({
			reference: swarmDocsLandingReference,
			gatewayOrigin: new URL(binding.endpoints[0].locator).origin,
			text: 'hello',
		})
		expect(sourceFetch).toHaveBeenCalledOnce()
		expect(sourceFetch.mock.calls[0][1]).toBe(
			`${binding.endpoints[0].locator}/bzz/${swarmDocsLandingReference}`
		)
	})

	it('rejects invalid references and content paths before transport', async () => {
		await expect(fetchBrowseResult({
			reference: 'not-a-swarm-ref',
		})).rejects.toThrow('invalid reference')

		await expect(fetchBrowseResult({
			reference: swarmDocsLandingReference,
			contentPath: 'index\n.html',
		})).rejects.toThrow('control characters')

		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('fails over after network errors instead of aborting the whole browse', async () => {
		sourceFetch
			.mockRejectedValueOnce(new Error('offline'))
			.mockResolvedValueOnce(new Response('recovered', {
				status: 200,
				headers: {
					'content-type': 'text/plain',
				},
			}))

		await expect(fetchBrowseResult({
			reference: swarmDocsLandingReference,
		})).resolves.toMatchObject({
			gatewayOrigin: new URL(binding.endpoints[1].locator).origin,
			text: 'recovered',
		})
		expect(sourceFetch).toHaveBeenCalledTimes(2)
	})

	it('reports declared gateway reachability', async () => {
		sourceFetch
			.mockResolvedValueOnce({ ok: true })
			.mockResolvedValueOnce({ ok: true })

		await expect(getGatewayReachability()).resolves.toEqual({
			declaredAccessEndpointCount: 2,
			reachableAccessEndpointCount: 2,
			reachable: true,
		})
	})

	it('lists binding-owned gateway origins', () => {
		expect(listDeclaredGatewayOrigins()).toEqual(
			binding.endpoints.map((endpoint) => new URL(endpoint.locator).origin)
		)
	})

	it('normalizes 0x / scheme prefixes in assertSwarmGatewayReference', () => {
		expect(assertSwarmGatewayReference(`0x${swarmDocsLandingReference}`)).toBe(
			swarmDocsLandingReference
		)
		expect(assertSwarmGatewayReference(`swarm://${swarmDocsLandingReference}/`)).toBe(
			swarmDocsLandingReference
		)
		expect(assertSwarmGatewayReference(`BZZ://0X${swarmDocsLandingReference.toUpperCase()}`)).toBe(
			swarmDocsLandingReference
		)
	})
})
