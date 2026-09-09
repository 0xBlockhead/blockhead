import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { materializeField } from '../../tests/materializeField.ts'

import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { MediaTransport } from '$/schema/MediaTransport.ts'
import { MediaType } from '$/schema/MediaType.ts'
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
			[EntityMetaKey.Selector]: { url: sourceFetch.mock.calls[0][1] },
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.Media, [], 'type')]: MediaType.Image,
				[entityFieldAddressKey(EntityType.Media, [], 'transport')]: MediaTransport.Ipfs,
			},
		})
		const timestamp = snapshot.$$timestamps[0]
		const materialized = materializeField(
			EntityType.IpfsResource_Timestamp,
			timestamp[EntityMetaKey.Selector],
			'$media',
			fields[entityFieldAddressKey(EntityType.IpfsResource_Timestamp, [], '$media')],
			Source.Ipfs_Rest
		)
		expect(materialized).toHaveLength(1)
	})
})

describe('IPFS gateway endpoint content classes', () => {
	beforeEach(() => vi.clearAllMocks())
	afterEach(() => vi.restoreAllMocks())

	it.each([
		{ endpointIndex: 0, media: false },
		{ endpointIndex: 0, media: true },
		{ endpointIndex: 1, media: false },
		{ endpointIndex: 1, media: true },
	])('captures endpoint $endpointIndex with media=$media', async ({ endpointIndex, media }) => {
		vi.spyOn(Date, 'now').mockReturnValue(6000)
		const text = 'endpoint text'
		const contentType = media ? 'image/png' : 'text/plain'
		const contentLength = media ? 3 : new TextEncoder().encode(text).byteLength
		if (endpointIndex === 1)
			sourceFetch.mockRejectedValueOnce(new Error('first gateway unavailable'))

		sourceFetch.mockResolvedValueOnce(new Response(media ? new Uint8Array([1, 2, 3]) : text, {
			status: 200,
			headers: {
				'content-type': contentType,
				'content-length': String(contentLength),
			},
		}))
		const snapshot = await resolveResource(resource)
		const capture = snapshot.$$timestamps[0]
		const fields = capture[EntityMetaKey.Fields]
		const timestampType = EntityType.IpfsResource_Timestamp
		const gatewayUrl = `${binding.endpoints[endpointIndex].locator}/ipfs/${ipfsGatewaySampleCid}/readme.txt`
		expect(capture[EntityMetaKey.Selector]).toEqual({
			$resource: { ...resource, target: canonicalIpfsCidString(resource.target) },
			timestampMs: 6000,
			source: Source.Ipfs_Rest,
		})
		expect(fields).toMatchObject({
			[entityFieldAddressKey(timestampType, [], 'gatewayOrigin')]: new URL(gatewayUrl).origin,
			[entityFieldAddressKey(timestampType, [], 'gatewayUrl')]: gatewayUrl,
			[entityFieldAddressKey(timestampType, [], 'fileName')]: 'readme.txt',
			[entityFieldAddressKey(timestampType, [], 'extension')]: undefined,
			[entityFieldAddressKey(timestampType, [], 'contentType')]: contentType,
			[entityFieldAddressKey(timestampType, [], 'contentLength')]: contentLength,
			[entityFieldAddressKey(timestampType, [], 'displayType')]: media ? 'image' : 'text',
			[entityFieldAddressKey(timestampType, [], 'isContentTypeInferred')]: false,
		})
		if (media) {
			expect(fields[entityFieldAddressKey(timestampType, [], 'text')]).toBeUndefined()
			expect(fields[entityFieldAddressKey(timestampType, [], '$media')]).toMatchObject({
				[EntityMetaKey.Selector]: { url: gatewayUrl },
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.Media, [], 'type')]: MediaType.Image,
					[entityFieldAddressKey(EntityType.Media, [], 'transport')]: endpointIndex === 0 ? MediaTransport.Ipfs : MediaTransport.Http,
				},
			})
		} else {
			expect(fields[entityFieldAddressKey(timestampType, [], 'text')]).toBe(text)
			expect(fields[entityFieldAddressKey(timestampType, [], '$media')]).toBeUndefined()
		}
		expect(sourceFetch.mock.calls.map(([, url]) => url)).toEqual(
			endpointIndex === 0 ? [gatewayUrl] : [
				`${binding.endpoints[0].locator}/ipfs/${ipfsGatewaySampleCid}/readme.txt`,
				gatewayUrl,
			]
		)
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
