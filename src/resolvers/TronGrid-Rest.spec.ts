import { describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

vi.mock('$/sources/TronGrid/Rest/queries.ts', () => ({
	getRestEndpoints: () => [{
		url: 'https://api.trongrid.io',
		transportType: 'Http',
		providerName: 'TronGrid',
	}],
	getAccount: vi.fn().mockResolvedValue({
		latest_opration_time: 1_720_000_000_123,
	}),
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
	it('shares each network projection across exact CAIP-2 and slug applicability', async () => {
		const pairedResolvers = tronGridRest.resolvers.filter((resolver) => (
			resolver.entityType === EntityType.Network
			&& 'Caip2' in resolver.resolve
			&& 'Slug' in resolver.resolve
		))

		expect(pairedResolvers).toHaveLength(4)
		for (const resolver of pairedResolvers) {
			if (!('Caip2' in resolver.resolve) || !('Slug' in resolver.resolve))
				throw new Error('TronGrid paired network resolver is incomplete')

			expect(resolver.resolve.Caip2.resolve).toBe(resolver.resolve.Slug.resolve)
			expect(resolver.resolve.Caip2.appliesTo).toEqual([{
				caip2: networkBySlug.tron.caip2,
			}])
			expect(resolver.resolve.Slug.appliesTo).toEqual([{
				slug: networkBySlug.tron.slug,
			}])
		}

		const endpointResolver = pairedResolvers.find((resolver) => (
			'Tron' in resolver.projections
			&& 'restEndpoints' in resolver.projections.Tron
		))
		if (
			endpointResolver == null
			|| !('Caip2' in endpointResolver.resolve)
			|| !('Slug' in endpointResolver.resolve)
		)
			throw new Error('TronGrid endpoint resolver selector pair is missing')

		const context = {
			filters: [],
			sorts: [],
			pagination: {},
			selectorKeys: [],
			parentSelectorKeys: [],
			sources: [],
			publicEnv: {},
		}
		expect(
			await endpointResolver.resolve.Caip2.resolve({
				caip2: networkBySlug.tron.caip2,
			}, context)
		).toEqual(
			await endpointResolver.resolve.Slug.resolve({
				slug: networkBySlug.tron.slug,
			}, context)
		)
	})

	it('uses the upstream account observation clock', async () => {
		const resolver = tronGridRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.TronAccount
			&& '$$timestamps' in candidate.projections
		))
		if (resolver == null) throw new Error('Tron account resolver is missing')

		const account = {
			$network: {
				caip2: networkBySlug.tron.caip2,
			},
			address: 'TExampleAccount',
		}
		const resolved = await resolver.resolve['NetworkAddress'].resolve(account, {
			filters: [],
			sorts: [],
			pagination: {},
			selectorKeys: [],
			parentSelectorKeys: [],
			sources: [],
			publicEnv: {},
		})

		expect(resolver.projections.$$timestamps(resolved)).toEqual([{
			[EntityMetaKey.Selector]: {
				$account: account,
				timestampMs: 1_720_000_000_123,
				source: 'TronGrid_Rest',
			},
		}])
	})

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
			await resolver.resolve['Caip2'].resolve(networkSelector, {
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
