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
	getGatewayUrl,
	getGatewayReachability,
	listDeclaredGatewayOrigins,
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

	it('rejects invalid gateway identities and paths before transport', async () => {
		await expect(fetchBrowseResult({
			namespace: 'ipfs',
			target: 'not-a-cid',
		})).rejects.toThrow('invalid IPFS CID target')

		expect(() => getGatewayUrl({
			namespace: 'ipfs',
			target: 'not-a-cid',
			gatewayOrigin: 'https://ipfs.io',
		})).toThrow('invalid IPFS CID target')

		expect(() => getGatewayUrl({
			namespace: 'ipns',
			target: 'bad\nname',
			gatewayOrigin: 'https://ipfs.io',
		})).toThrow('IPNS target contains URL delimiters')

		await expect(fetchBrowseResult({
			namespace: 'ipfs',
			target: ipfsGatewaySampleCid,
			contentPath: 'nested\nfile',
		})).rejects.toThrow('control characters')

		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('preserves reserved content-path characters as literal path segments', async () => {
		sourceFetch.mockResolvedValueOnce(new Response('literal path', {
			status: 200,
			headers: {
				'content-type': 'text/plain',
			},
		}))

		await fetchBrowseResult({
			namespace: 'ipfs',
			target: ipfsGatewaySampleCid,
			contentPath: 'folder/a b?#%.txt',
		})

		expect(sourceFetch.mock.calls[0][1]).toBe(
			`${binding.endpoints[0].locator}/ipfs/${ipfsGatewaySampleCid}/folder/a%20b%3F%23%25.txt`
		)
	})

	it('fails over after a gateway network error', async () => {
		sourceFetch
			.mockRejectedValueOnce(new Error('offline'))
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
			gatewayOrigin: new URL(binding.endpoints[1].locator).origin,
			text: 'recovered',
		})
		expect(sourceFetch).toHaveBeenCalledTimes(2)
	})

	it('fails over after a non-OK gateway response', async () => {
		sourceFetch
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
			gatewayOrigin: new URL(binding.endpoints[1].locator).origin,
			text: 'recovered',
		})
		expect(sourceFetch).toHaveBeenCalledTimes(2)
	})

	it('refreshes an IPNS browse through the binding on every invocation', async () => {
		sourceFetch
			.mockRejectedValueOnce(new Error('offline'))
			.mockResolvedValueOnce(new Response('current-1', {
				status: 200,
				headers: {
					'content-type': 'text/plain',
				},
			}))
			.mockRejectedValueOnce(new Error('offline'))
			.mockResolvedValueOnce(new Response('current-2', {
				status: 200,
				headers: {
					'content-type': 'text/plain',
				},
			}))

		const request = {
			namespace: 'ipns' as const,
			target: `/${ipfsDocsIpnsName}/`,
		}
		const firstBrowse = await fetchBrowseResult(request)
		const secondBrowse = await fetchBrowseResult(request)

		expect(firstBrowse).toMatchObject({
			namespace: 'ipns',
			target: ipfsDocsIpnsName,
			gatewayOrigin: new URL(binding.endpoints[1].locator).origin,
			gatewayUrl: `${binding.endpoints[1].locator}/ipns/${ipfsDocsIpnsName}`,
			text: 'current-1',
		})
		expect(secondBrowse).toMatchObject({
			namespace: 'ipns',
			target: ipfsDocsIpnsName,
			gatewayOrigin: new URL(binding.endpoints[1].locator).origin,
			gatewayUrl: `${binding.endpoints[1].locator}/ipns/${ipfsDocsIpnsName}`,
			text: 'current-2',
		})
		expect(sourceFetch).toHaveBeenCalledTimes(4)
		expect(sourceFetch.mock.calls.map(([, url]) => url)).toEqual([
			`${binding.endpoints[0].locator}/ipns/${ipfsDocsIpnsName}`,
			`${binding.endpoints[1].locator}/ipns/${ipfsDocsIpnsName}`,
			`${binding.endpoints[0].locator}/ipns/${ipfsDocsIpnsName}`,
			`${binding.endpoints[1].locator}/ipns/${ipfsDocsIpnsName}`,
		])
		for (const [calledBinding] of sourceFetch.mock.calls)
			expect(calledBinding).toBe(binding)
	})

	it('reports declared gateway reachability without inventing endpoints', async () => {
		sourceFetch
			.mockResolvedValueOnce({ ok: true })
			.mockResolvedValueOnce({ ok: false, status: 500 })

		await expect(getGatewayReachability()).resolves.toEqual({
			declaredAccessEndpointCount: 2,
			reachableAccessEndpointCount: 1,
			reachable: true,
		})
	})

	it('lists binding-owned gateway origins', () => {
		expect(listDeclaredGatewayOrigins()).toEqual(
			binding.endpoints.map((endpoint) => new URL(endpoint.locator).origin)
		)
	})

	it('rejects blank and URL-delimiting IPNS targets', () => {
		expect(() => assertIpfsGatewayTarget({
			namespace: 'ipns',
			target: '   ',
		})).toThrow('empty content target')
		for (const target of [
			'bad\nname',
			'name/path',
			'name?query',
			'name#fragment',
			'name\\path',
		])
			expect(() => assertIpfsGatewayTarget({
				namespace: 'ipns',
				target,
			})).toThrow('URL delimiters')
	})
})
