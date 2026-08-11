import { beforeEach, describe, expect, it, vi } from 'vitest'

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
describe('Ipfs access hub + timestamp resolvers', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('emits a tip $$timestamps row and seeded $$observedResources', async () => {
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
			},
		})
		expect(typeof snapshot.$$timestamps[0][EntityMetaKey.Selector].timestampMs).toBe('number')
		expect(snapshot.$$timestamps[0][EntityMetaKey.Fields]).toEqual({
			[entityFieldAddressKey(EntityType._GlobalIpfsAccess_Timestamp, [], 'declaredAccessEndpointCount')]: binding.endpoints.length,
			[entityFieldAddressKey(EntityType._GlobalIpfsAccess_Timestamp, [], 'reachableAccessEndpointCount')]: binding.endpoints.length,
			[entityFieldAddressKey(EntityType._GlobalIpfsAccess_Timestamp, [], 'reachable')]: true,
		})
		expect(accessHubResolver.projections.$$timestamps.resolveCount(snapshot)).toBe(1)
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
		expect(resolverModule.resolvers.some((resolver) => (
			resolver.entityType === EntityType._GlobalIpfsAccess_Timestamp
		))).toBe(false)
	})
})
