import { describe, expect, it } from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { TezosNetworkSelector } from '$/schema/TezosNetwork.ts'

import tzktResolvers from '$/resolvers/Tzkt-Rest.ts'

const resolver = tzktResolvers.resolvers.find((candidate) => (
	candidate.entityType === EntityType.TezosNetwork
	&& '$network' in candidate.projections
))

if (resolver == null)
	throw new Error('TzKT REST spec missing TezosNetwork identity resolver')

describe('TzKT Tezos identity contract', () => {
	it.each([
		{ slug: 'tezos' },
		{
			caip2: {
				namespace: 'tezos',
				reference: 'NetXdQprcVkpaWU',
			},
		},
	])('accepts canonical mainnet selector $slug$caip2.reference', async ($network) => {
		await expect(resolver.resolve[TezosNetworkSelector.Network]({
			$network,
		})).resolves.toEqual({
			$network: {
				[EntityMetaKey.Selector]: $network,
			},
		})
	})

	it.each([
		{ slug: 'tezos-ghostnet' },
		{ caip2: { namespace: 'tezos', reference: 'NetXnHfVqm9iesp' } },
		{ caip2: { namespace: 'eip155', reference: 'NetXdQprcVkpaWU' } },
		{ caip2: { namespace: 'tezos', reference: 'mainnet' } },
	])('rejects noncanonical selector $slug$caip2.namespace:$caip2.reference', async ($network) => {
		await expect(resolver.resolve[TezosNetworkSelector.Network]({
			$network,
		})).rejects.toThrow('Tzkt_Rest: unsupported network')
	})
})
