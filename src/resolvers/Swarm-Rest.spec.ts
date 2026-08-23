import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import bindings from '$/sources/Swarm/bindings.ts'
import { swarmDocsLandingReference } from '$/sources/Swarm/Rest/constants.ts'
import { Source } from '$/sources/Source.ts'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	sourceFetch,
}))

const resolverModule = (await import('$/resolvers/Swarm-Rest.ts')).default
const binding = bindings[Source.Swarm_Rest][0]
const accessHubResolver = resolverModule.resolvers.find((resolver) => (
	resolver.entityType === EntityType._GlobalSwarmAccess
))
const resourceResolver = resolverModule.resolvers.find((resolver) => (
	resolver.entityType === EntityType.SwarmResource
	&& 'ResourceAddress' in resolver.resolve
))
if (
	accessHubResolver == null
	|| resourceResolver == null
	|| !('ResourceAddress' in resourceResolver.resolve)
)
	throw new Error('Swarm source binding, access hub, or resource resolver is not registered')

const resolveAccessHub = accessHubResolver.resolve[
	'Scope'
].resolve
describe('Swarm access hub + timestamp resolvers', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('emits a tip $$timestamps row with seeded counts and observed resources', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1700000000000)
		for (const _endpoint of binding.endpoints)
			sourceFetch.mockResolvedValueOnce({ ok: true })

		const snapshot = await resolveAccessHub({
			scope: '_GlobalSwarmAccess',
		})
		expect(snapshot.scope).toBe('_GlobalSwarmAccess')
		expect(snapshot.$$timestamps).toHaveLength(1)
		expect(snapshot.$$timestamps[0]).toMatchObject({
			[EntityMetaKey.Selector]: {
				$hub: {
					scope: '_GlobalSwarmAccess',
				},
				source: Source.Swarm_Rest,
				timestampMs: 1700000000000,
			},
		})
		expect(typeof snapshot.$$timestamps[0][EntityMetaKey.Selector].timestampMs).toBe('number')
		expect(snapshot.$$timestamps[0][EntityMetaKey.Fields]).toEqual({
			[entityFieldAddressKey(EntityType._GlobalSwarmAccess_Timestamp, [], 'declaredAccessEndpointCount')]: binding.endpoints.length,
			[entityFieldAddressKey(EntityType._GlobalSwarmAccess_Timestamp, [], 'reachableAccessEndpointCount')]: binding.endpoints.length,
			[entityFieldAddressKey(EntityType._GlobalSwarmAccess_Timestamp, [], 'reachable')]: true,
			[entityFieldAddressKey(EntityType._GlobalSwarmAccess_Timestamp, [], 'observedResourceCount')]: 1,
			[entityFieldAddressKey(EntityType._GlobalSwarmAccess_Timestamp, [], 'seededExampleCount')]: 1,
		})
		expect(accessHubResolver.projections.$$timestamps.resolveCount(snapshot)).toBe(1)
		expect(accessHubResolver.projections.$$observedResources.select(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					reference: swarmDocsLandingReference,
					contentPath: '',
				},
			},
		])
		expect(accessHubResolver.projections.$$observedResources.resolveCount(snapshot)).toBe(1)
	})

	it('does not refetch an arbitrary access timestamp', () => {
		expect(resolverModule.resolvers.some((resolver) => (
			resolver.entityType === EntityType._GlobalSwarmAccess_Timestamp
		))).toBe(false)
	})
})

describe('Swarm resource gateway reads', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('preserves canonical bzz identity while proving the responding gateway and inspected text', async () => {
		const reference = '8b6ca499eb6f3f7e5ee242f08f1de2e7e6bb1728d7f4ee5ec22091b048f34ff1'
		sourceFetch
			.mockResolvedValueOnce(new Response('unavailable', {
				status: 503,
				statusText: 'Service Unavailable',
			}))
			.mockResolvedValueOnce(new Response('hello swarm', {
				headers: {
					'content-length': '11',
					'content-type': 'text/plain',
				},
			}))

		await expect(resourceResolver.resolve.ResourceAddress.resolve({
			reference,
			contentPath: 'guides/readme.txt',
		}, {})).resolves.toMatchObject({
			reference,
			contentPath: 'guides/readme.txt',
			canonicalUri: `bzz://${reference}/guides/readme.txt`,
			gatewayOrigin: 'https://bzz.link',
			gatewayUrl: `https://bzz.link/bzz/${reference}/guides/readme.txt`,
			fileName: 'readme.txt',
			contentType: 'text/plain',
			contentLength: 11,
			displayType: 'text',
			isContentTypeInferred: false,
			text: 'hello swarm',
		})
		expect(sourceFetch).toHaveBeenCalledTimes(2)
	})
})
