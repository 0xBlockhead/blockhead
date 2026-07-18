import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EntityType } from '$/schema/EntityType.ts'
import { _GlobalSwarmAccess_TimestampSelector } from '$/schema/_GlobalSwarmAccess_Timestamp.ts'
import { Source } from '$/sources/Source.ts'

const corsFetch = vi.fn()

vi.mock('$/lib/http.ts', () => ({
	corsFetch,
	jsonErrorHintFromResponse: vi.fn(),
}))

const resolverModule = (await import('$/resolvers/Swarm-Rest.ts')).default
const accessTimestampResolver = resolverModule.resolvers.find((resolver) => (
	resolver.entityType === EntityType._GlobalSwarmAccess_Timestamp
))

if (accessTimestampResolver == null)
	throw new Error('Swarm access timestamp resolver is not registered')

const resolveAccessTimestamp = accessTimestampResolver.resolve[
	_GlobalSwarmAccess_TimestampSelector.HubTimestampMsSource
].resolve

describe('Swarm access timestamp resolver', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('reports all declared gateways and preserves observation identity', async () => {
		corsFetch
			.mockResolvedValueOnce({ ok: true })
			.mockResolvedValueOnce({ ok: true })

		await expect(resolveAccessTimestamp({
			$hub: {
				scope: '_GlobalSwarmAccess',
			},
			timestampMs: 1_750_000_000_000,
			source: Source.Swarm_Rest,
		}, {})).resolves.toEqual({
			$hub: {
				scope: '_GlobalSwarmAccess',
			},
			timestampMs: 1_750_000_000_000,
			source: Source.Swarm_Rest,
			declaredAccessEndpointCount: 2,
			reachableAccessEndpointCount: 2,
			reachable: true,
		})
		expect(corsFetch).toHaveBeenCalledTimes(2)
	})

	it('counts partial and total gateway failure without inventing reachability', async () => {
		corsFetch
			.mockResolvedValueOnce({ ok: false })
			.mockRejectedValueOnce(new Error('offline'))

		await expect(resolveAccessTimestamp({
			$hub: {
				scope: '_GlobalSwarmAccess',
			},
			timestampMs: 1_750_000_000_001,
			source: Source.Swarm_Rest,
		}, {})).resolves.toMatchObject({
			declaredAccessEndpointCount: 2,
			reachableAccessEndpointCount: 0,
			reachable: false,
		})
	})

	it('rejects unrelated source identity before transport', async () => {
		await expect(resolveAccessTimestamp({
			$hub: {
				scope: '_GlobalSwarmAccess',
			},
			timestampMs: 1_750_000_000_002,
			source: Source.Constants_Internal,
		}, {})).rejects.toThrow('unsupported source')

		expect(corsFetch).not.toHaveBeenCalled()
	})
})
