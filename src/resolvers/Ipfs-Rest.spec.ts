import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import bindings from '$/sources/Ipfs/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	sourceFetch,
}))

const resolverModule = (await import('$/resolvers/Ipfs-Rest.ts')).default
const binding = bindings[Source.Ipfs_Rest][0]
const accessTimestampResolver = resolverModule.resolvers.find((resolver) => (
	resolver.entityType === EntityType._GlobalIpfsAccess_Timestamp
))

if (accessTimestampResolver == null)
	throw new Error('Ipfs source binding or access timestamp resolver is not registered')

const resolveAccessTimestamp = accessTimestampResolver.resolve[
	'HubTimestampMsSource'
].resolve

describe('Ipfs access timestamp resolver', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('reports all declared gateways and preserves observation identity', async () => {
		for (const _endpoint of binding.endpoints)
			sourceFetch.mockResolvedValueOnce({ ok: true })

		const snapshot = await resolveAccessTimestamp({
			$hub: {
				scope: '_GlobalIpfsAccess',
			},
			timestampMs: 1_750_000_000_000,
			source: Source.Ipfs_Rest,
		})
		expect(snapshot).toEqual({
			$hub: {
				scope: '_GlobalIpfsAccess',
			},
			timestampMs: 1_750_000_000_000,
			source: Source.Ipfs_Rest,
			declaredAccessEndpointCount: binding.endpoints.length,
			reachableAccessEndpointCount: binding.endpoints.length,
			reachable: true,
		})
		expect(accessTimestampResolver.projections.$hub(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				scope: '_GlobalIpfsAccess',
			},
		})
		expect(sourceFetch).toHaveBeenCalledTimes(binding.endpoints.length)
		expect(sourceFetch.mock.calls.map(([, url]) => url)).toEqual(
			binding.endpoints.map((endpoint) => endpoint.locator)
		)
	})

	it('counts partial and total gateway failure without inventing reachability', async () => {
		sourceFetch
			.mockResolvedValueOnce({ ok: false })
		for (let index = 1; index < binding.endpoints.length; index += 1)
			sourceFetch.mockRejectedValueOnce(new Error('offline'))

		await expect(resolveAccessTimestamp({
			$hub: {
				scope: '_GlobalIpfsAccess',
			},
			timestampMs: 1_750_000_000_001,
			source: Source.Ipfs_Rest,
		})).resolves.toMatchObject({
			declaredAccessEndpointCount: binding.endpoints.length,
			reachableAccessEndpointCount: 0,
			reachable: false,
		})
	})

	it('rejects unrelated source identity before transport', async () => {
		await expect(resolveAccessTimestamp({
			$hub: {
				scope: '_GlobalIpfsAccess',
			},
			timestampMs: 1_750_000_000_002,
			source: Source.Constants_Internal,
		})).rejects.toThrow('unsupported source')

		expect(sourceFetch).not.toHaveBeenCalled()
	})
})
