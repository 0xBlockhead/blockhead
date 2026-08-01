import { describe, expect, it, vi } from 'vitest'
import { EntityMetaKey } from '$/schema/$schema.ts'

const fetchScalingSummary = vi.hoisted(() => vi.fn())

vi.mock('$/sources/L2Beat/Rest/queries.ts', () => ({
	fetchScalingSummary,
}))

const { default: l2Beat } = await import('$/resolvers/L2Beat-Rest.ts')

describe('L2Beat resolver', () => {
	it('keeps direct snapshots plain and relationship references compact', async () => {
		fetchScalingSummary.mockResolvedValue({
			projects: {
				arbitrum: {
					id: 'arbitrum',
					name: 'Arbitrum One',
					slug: 'arbitrum',
					type: 'Optimistic Rollup',
					hostChain: 'Ethereum',
				},
			},
		})

		const networkSelector = {
			caip2: {
				namespace: 'eip155' as const,
				reference: '42161',
			},
		}
		expect((await l2Beat.resolvers[0].resolve.Caip2.resolve(networkSelector)).slug).toBe('arbitrum')

		const rollup = await l2Beat.resolvers[1].resolve.EvmNetworkProjectId.resolve({
			$network: networkSelector,
			projectId: 'arbitrum',
		})
		expect(rollup.name).toBe('Arbitrum One')
		expect(rollup.$settlementNetwork[EntityMetaKey.Selector].caip2.reference).toBe('1')
		expect(EntityMetaKey.Fields in rollup).toBe(false)
		expect((await l2Beat.resolvers[3].resolve.Caip2.resolve(networkSelector)).rollup).toEqual({
			[EntityMetaKey.Selector]: {
				$network: networkSelector,
				projectId: 'arbitrum',
			},
		})
	})
})
