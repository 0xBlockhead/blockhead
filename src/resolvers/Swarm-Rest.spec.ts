import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
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
const accessTimestampResolver = resolverModule.resolvers.find((resolver) => (
	resolver.entityType === EntityType._GlobalSwarmAccess_Timestamp
))

if (accessHubResolver == null || accessTimestampResolver == null)
	throw new Error('Swarm source binding or access resolvers are not registered')

const resolveAccessHub = accessHubResolver.resolve[
	'Scope'
].resolve
const resolveAccessTimestamp = accessTimestampResolver.resolve[
	'HubTimestampMsSource'
].resolve

describe('Swarm access hub + timestamp resolvers', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('emits a tip $$timestamps row with seeded counts and observed resources', async () => {
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
			},
		})
		expect(typeof snapshot.$$timestamps[0][EntityMetaKey.Selector].timestampMs).toBe('number')
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

	it('reports all declared gateways and preserves observation identity', async () => {
		for (const _endpoint of binding.endpoints)
			sourceFetch.mockResolvedValueOnce({ ok: true })

		const snapshot = await resolveAccessTimestamp({
			$hub: {
				scope: '_GlobalSwarmAccess',
			},
			timestampMs: 1_750_000_000_000,
			source: Source.Swarm_Rest,
		})
		expect(snapshot).toEqual({
			$hub: {
				scope: '_GlobalSwarmAccess',
			},
			timestampMs: 1_750_000_000_000,
			source: Source.Swarm_Rest,
			declaredAccessEndpointCount: binding.endpoints.length,
			reachableAccessEndpointCount: binding.endpoints.length,
			reachable: true,
			observedResourceCount: 1,
			seededExampleCount: 1,
		})
		expect(accessTimestampResolver.projections.$hub(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				scope: '_GlobalSwarmAccess',
			},
		})
		expect(accessTimestampResolver.projections.observedResourceCount(snapshot)).toBe(1)
		expect(accessTimestampResolver.projections.seededExampleCount(snapshot)).toBe(1)
		expect(sourceFetch).toHaveBeenCalledTimes(binding.endpoints.length)
		expect(sourceFetch.mock.calls.map(([, url]) => url)).toEqual(
			binding.endpoints.map((endpoint) => endpoint.locator)
		)
	})

	it('counts partial and total gateway failure without inventing reachability', async () => {
		sourceFetch
			.mockResolvedValueOnce({ ok: false, status: 500 })
			.mockRejectedValueOnce(new Error('offline'))
			.mockRejectedValueOnce(new Error('offline get'))

		await expect(resolveAccessTimestamp({
			$hub: {
				scope: '_GlobalSwarmAccess',
			},
			timestampMs: 1_750_000_000_001,
			source: Source.Swarm_Rest,
		})).resolves.toMatchObject({
			declaredAccessEndpointCount: 2,
			reachableAccessEndpointCount: 0,
			reachable: false,
			observedResourceCount: 1,
			seededExampleCount: 1,
		})
	})

	it('rejects unrelated source identity before transport', async () => {
		await expect(resolveAccessTimestamp({
			$hub: {
				scope: '_GlobalSwarmAccess',
			},
			timestampMs: 1_750_000_000_002,
			source: Source.Constants_Internal,
		})).rejects.toThrow('unsupported source')

		expect(sourceFetch).not.toHaveBeenCalled()
	})
})
