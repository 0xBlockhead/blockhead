import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import bindings from '$/sources/Ipfs/bindings.ts'
import {
	ipfsDocsIpnsName,
	ipfsGatewaySampleCid,
} from '$/sources/Ipfs/Rest/constants.ts'
import { Source } from '$/sources/Source.ts'
import { canonicalIpfsCidString } from '$/lib/multiformats.ts'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	sourceFetch,
}))

const resolverModule = (await import('$/resolvers/Ipfs-Rest.ts')).default
const binding = bindings[Source.Ipfs_Rest][0]
const accessHubResolver = resolverModule.resolvers.find((resolver) => (
	resolver.entityType === EntityType._GlobalIpfsAccess
))
if (accessHubResolver == null)
	throw new Error('Ipfs source binding or access hub resolver is not registered')

const resolveAccessHub = accessHubResolver.resolve[
	'Scope'
].resolve
const resourceResolver = resolverModule.resolvers.find((resolver) => (
	resolver.entityType === EntityType.IpfsResource
))
if (resourceResolver == null)
	throw new Error('IPFS resource resolver is not registered')

const resolveResource = resourceResolver.resolve.ResourceAddress.resolve
const resource = {
	namespace: 'ipfs' as const,
	target: ipfsGatewaySampleCid,
	contentPath: 'readme.txt',
}

describe('IPFS response captures', () => {
	beforeEach(() => {
		vi.resetAllMocks()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('captures the completed body once, then keeps subsequent captures distinct', async () => {
		expect(EntityType.IpfsResource_Timestamp).toBe('IpfsResource_Timestamp')
		const clock = vi.spyOn(Date, 'now').mockReturnValue(1000)
		const body = new TransformStream<Uint8Array, Uint8Array>()
		const writer = body.writable.getWriter()
		sourceFetch.mockResolvedValueOnce(new Response(body.readable, {
			headers: { 'content-type': 'text/plain', 'content-length': '9' },
		}))
		let settled = false
		const pending = resolveResource({ ...resource, contentPath: '/readme.txt/' }).then((snapshot) => {
			settled = true
			return snapshot
		})
		await vi.waitFor(() => expect(sourceFetch).toHaveBeenCalledTimes(1))
		await writer.write(new TextEncoder().encode('capture A'))
		expect(settled).toBe(false)
		clock.mockReturnValue(2000)
		await writer.close()
		const first = await pending
		expect(first.$$timestamps).toHaveLength(1)
		const capture = first.$$timestamps[0]
		expect(capture[EntityMetaKey.Selector]).toEqual({
			$resource: { ...resource, target: canonicalIpfsCidString(resource.target) },
			timestampMs: 2000,
			source: Source.Ipfs_Rest,
		})
		const fields = capture[EntityMetaKey.Fields]
		expect(fields).toMatchObject({
			[entityFieldAddressKey(EntityType.IpfsResource_Timestamp, [], 'text')]: 'capture A',
			[entityFieldAddressKey(EntityType.IpfsResource_Timestamp, [], 'contentType')]: 'text/plain',
			[entityFieldAddressKey(EntityType.IpfsResource_Timestamp, [], 'contentLength')]: 9,
			[entityFieldAddressKey(EntityType.IpfsResource_Timestamp, [], 'gatewayOrigin')]: new URL(sourceFetch.mock.calls[0][1]).origin,
			[entityFieldAddressKey(EntityType.IpfsResource_Timestamp, [], 'gatewayUrl')]: sourceFetch.mock.calls[0][1],
		})
		for (const field of ['gatewayOrigin', 'gatewayUrl', 'fileName', 'extension', 'contentType', 'contentLength', 'displayType', 'isContentTypeInferred', 'text', '$media'])
			expect(first).not.toHaveProperty(field)

		expect(resourceResolver.projections.$$timestamps.select(first)).toEqual([capture])
		clock.mockReturnValue(3000)
		sourceFetch.mockResolvedValueOnce(new Response('capture B', {
			headers: { 'content-type': 'text/plain', 'content-length': '9' },
		}))
		const second = await resolveResource(resource)
		expect(sourceFetch).toHaveBeenCalledTimes(2)
		expect(second.$$timestamps[0][EntityMetaKey.Selector].timestampMs).toBe(3000)
		expect(second.$$timestamps[0][EntityMetaKey.Fields][entityFieldAddressKey(EntityType.IpfsResource_Timestamp, [], 'text')]).toBe('capture B')
		expect(fields[entityFieldAddressKey(EntityType.IpfsResource_Timestamp, [], 'text')]).toBe('capture A')
	})

	it('rejects an interrupted body instead of materializing a successful capture', async () => {
		const failure = new Error('body interrupted')
		const body = new ReadableStream({
			start(controller) {
				controller.error(failure)
			},
		})
		sourceFetch.mockResolvedValueOnce(new Response(body))
		await expect(resolveResource(resource)).rejects.toThrow('body interrupted')
		expect(sourceFetch).toHaveBeenCalledTimes(1)
	})

	it('rejects exhausted HTTP gateway failures', async () => {
		sourceFetch.mockImplementation(async () => new Response('unavailable', { status: 503 }))
		await expect(resolveResource(resource)).rejects.toThrow()
		expect(sourceFetch).toHaveBeenCalledTimes(binding.endpoints.length)
	})

	it('keeps current IPNS capture identity without inventing an immutable resolved CID', async () => {
		sourceFetch.mockResolvedValueOnce(new Response('current name content', {
			headers: { 'content-type': 'text/plain' },
		}))
		const snapshot = await resolveResource({ ...resource, namespace: 'ipns', target: ipfsDocsIpnsName })
		expect(snapshot.$$timestamps[0][EntityMetaKey.Selector].$resource).toEqual({ ...resource, namespace: 'ipns', target: ipfsDocsIpnsName })
		expect(snapshot.$$timestamps[0][EntityMetaKey.Fields][entityFieldAddressKey(EntityType.IpfsResource_Timestamp, [], 'text')]).toBe('current name content')
		expect(snapshot).not.toHaveProperty('cidVersion')
	})

	it('captures media metadata without claiming persisted media bytes', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(new Uint8Array([1, 2, 3]), {
			headers: { 'content-type': 'image/png', 'content-length': '3' },
		}))
		const snapshot = await resolveResource(resource)
		const fields = snapshot.$$timestamps[0][EntityMetaKey.Fields]
		expect(fields[entityFieldAddressKey(EntityType.IpfsResource_Timestamp, [], 'text')]).toBeUndefined()
		expect(fields[entityFieldAddressKey(EntityType.IpfsResource_Timestamp, [], '$media')]).toMatchObject({
			$original: {
				[EntityMetaKey.Selector]: { url: sourceFetch.mock.calls[0][1] },
				mimeType: 'image/png',
				size: 3,
			},
		})
	})
})

describe('Ipfs access hub + timestamp resolvers', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('emits a tip $$timestamps row and seeded $$observedResources', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1700000000000)
		for (const _endpoint of binding.endpoints)
			sourceFetch.mockResolvedValueOnce({ ok: true })

		const snapshot = await resolveAccessHub({
			scope: '_GlobalIpfsAccess',
		})
		expect(snapshot.scope).toBe('_GlobalIpfsAccess')
		expect(snapshot.$$timestamps).toHaveLength(1)
		expect(snapshot.$$timestamps[0]).toMatchObject({
			[EntityMetaKey.Selector]: {
				$hub: {
					scope: '_GlobalIpfsAccess',
				},
				source: Source.Ipfs_Rest,
				timestampMs: 1700000000000,
			},
		})
		expect(typeof snapshot.$$timestamps[0][EntityMetaKey.Selector].timestampMs).toBe('number')
		expect(snapshot.$$timestamps[0][EntityMetaKey.Fields]).toEqual({
			[entityFieldAddressKey(EntityType._GlobalIpfsAccess_Timestamp, [], 'declaredAccessEndpointCount')]: binding.endpoints.length,
			[entityFieldAddressKey(EntityType._GlobalIpfsAccess_Timestamp, [], 'reachableAccessEndpointCount')]: binding.endpoints.length,
			[entityFieldAddressKey(EntityType._GlobalIpfsAccess_Timestamp, [], 'reachable')]: true,
		})
		expect(accessHubResolver.projections.$$timestamps).not.toHaveProperty('resolveCount')
		expect(accessHubResolver.projections.$$observedResources.select(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					namespace: 'ipfs',
					target: ipfsGatewaySampleCid,
					contentPath: '',
				},
			},
			{
				[EntityMetaKey.Selector]: {
					namespace: 'ipns',
					target: ipfsDocsIpnsName,
					contentPath: '',
				},
			},
		])
		expect(accessHubResolver.projections.$$observedResources.resolveCount(snapshot)).toBe(2)
	})

	it('does not refetch an arbitrary access timestamp', () => {
		expect(resolverModule.resolvers.map((resolver) => resolver.entityType)).not.toContain(EntityType._GlobalIpfsAccess_Timestamp)
	})
})
