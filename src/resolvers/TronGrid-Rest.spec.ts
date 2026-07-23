import { describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { NetworkSelector } from '$/schema/Network.ts'

vi.mock('$/sources/TronGrid/Rest/queries.ts', () => ({
	listWitnesses: vi.fn().mockResolvedValue({
		witnesses: [{
			address: 'TExampleWitness',
			isJobs: true,
			latestBlockNum: 123,
			totalMissed: 2,
			totalProduced: 121,
			url: 'https://witness.example',
			voteCount: 42,
		}],
	}),
}))

const { default: tronGridRest } = await import('$/resolvers/TronGrid-Rest.ts')

describe('TronGrid REST network relationships', () => {
	it('embeds witness observations through canonical field addresses', async () => {
		const resolver = tronGridRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& 'Tron' in candidate.projections
			&& '$$witnesses' in candidate.projections.Tron
			&& typeof candidate.projections.Tron.$$witnesses === 'function'
		))
		if (resolver == null) throw new Error('Tron witness resolver is missing')

		const networkSelector = {
			caip2: networkBySlug.tron.caip2,
		}
		const witnesses = resolver.projections.Tron.$$witnesses(
			await resolver.resolve[NetworkSelector.Caip2].resolve(networkSelector, {
				filters: [],
				sorts: [],
				pagination: {},
				selectorKeys: [],
				parentSelectorKeys: [],
				sources: [],
				publicEnv: {},
			})
		)

		expect(witnesses).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: networkSelector,
				address: 'TExampleWitness',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.TronWitness, [], '$$timestamps')]: [{
					[EntityMetaKey.Selector]: {
						$witness: {
							$network: networkSelector,
							address: 'TExampleWitness',
						},
						timestampMs: expect.any(Number),
						source: 'TronGrid_Rest',
					},
				}],
			},
		}])
		expect(Object.keys(witnesses[0])).toEqual([
			EntityMetaKey.Selector,
			EntityMetaKey.Fields,
		])
	})
})
