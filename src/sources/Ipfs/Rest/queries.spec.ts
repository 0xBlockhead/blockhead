import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Ipfs/bindings.ts'
import {
	ipfsDocsIpnsName,
	ipfsGatewaySampleCid,
} from '$/sources/Ipfs/Rest/constants.ts'
import { Source } from '$/sources/Source.ts'

const sourceFetch = vi.fn()

vi.mock('$/sources/_runtime/http.ts', () => ({
	sourceFetch,
}))

const {
	assertIpfsGatewayTarget,
	fetchBrowseResult,
	getGatewayReachability,
	listDeclaredGatewayOrigins,
	listSeededExampleResources,
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
			target: ipfsGatewaySampleCid,
		})).resolves.toMatchObject({
			gatewayOrigin: new URL(binding.endpoints[0].locator).origin,
			text: 'hello',
		})
		expect(sourceFetch).toHaveBeenCalledOnce()
		expect(sourceFetch.mock.calls[0][0]).toBe(binding)
		expect(sourceFetch.mock.calls[0][1]).toBe(
			`${binding.endpoints[0].locator}/ipfs/${ipfsGatewaySampleCid}`
		)
	})

	it('fails closed on invalid IPFS CID targets before transport', async () => {
		await expect(fetchBrowseResult({
			namespace: 'ipfs',
			target: 'not-a-cid',
		})).rejects.toThrow('invalid IPFS CID target')

		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('fails closed on content paths with control characters before transport', async () => {
		await expect(fetchBrowseResult({
			namespace: 'ipfs',
			target: ipfsGatewaySampleCid,
			contentPath: 'nested\nfile',
		})).rejects.toThrow('control characters')

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
			target: ipfsGatewaySampleCid,
		})).resolves.toMatchObject({
			gatewayOrigin: new URL(binding.endpoints[2].locator).origin,
			text: 'recovered',
		})
		expect(sourceFetch).toHaveBeenCalledTimes(3)
	})

	it('reports declared gateway reachability without inventing endpoints', async () => {
		sourceFetch
			.mockResolvedValueOnce({ ok: true })
			.mockResolvedValueOnce({ ok: false, status: 500 })
			.mockRejectedValueOnce(new Error('offline'))
			.mockRejectedValueOnce(new Error('offline get'))

		await expect(getGatewayReachability()).resolves.toEqual({
			declaredAccessEndpointCount: 3,
			reachableAccessEndpointCount: 1,
			reachable: true,
		})
	})

	it('lists binding origins and seeded browse examples', () => {
		expect(listDeclaredGatewayOrigins()).toEqual(
			binding.endpoints.map((endpoint) => new URL(endpoint.locator).origin)
		)
		expect(listSeededExampleResources()).toEqual([
			{
				namespace: 'ipfs',
				target: ipfsGatewaySampleCid,
				contentPath: '',
			},
			{
				namespace: 'ipns',
				target: ipfsDocsIpnsName,
				contentPath: '',
			},
		])
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
