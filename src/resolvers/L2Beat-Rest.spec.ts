import { describe, expect, it, vi } from 'vitest'

const fetchScalingSummary = vi.hoisted(() => vi.fn())

vi.mock('$/sources/L2Beat/Rest/queries.ts', () => ({
	fetchScalingSummary,
}))

const { default: l2Beat } = await import('$/resolvers/L2Beat-Rest.ts')

const networkResolver = l2Beat.resolvers[0]

describe('L2Beat resolver', () => {
	it('maps a network through the scaling summary source query', async () => {
		fetchScalingSummary.mockResolvedValueOnce({
			projects: {
				arbitrum: {
					name: 'Arbitrum One',
					slug: 'arbitrum',
				},
			},
		})

		await networkResolver.resolve['Caip2'].resolve({
			caip2: {
				namespace: 'eip155',
				reference: '42161',
			},
		}, {
			filters: [],
			sorts: [],
			pagination: {},
			selectorKeys: [],
			parentSelectorKeys: [],
			sources: [],
			publicEnv: {},
		})

		expect(fetchScalingSummary).toHaveBeenCalledWith()
	})
})
