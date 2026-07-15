import { networkBySlug } from '$/constants/Network.ts'
import { defineResolver } from '$/resolvers/defineResolver.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { TonAccountSelector } from '$/schema/TonAccount.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'

const tonApiBinding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((binding) => binding.source === Source.TonApi_Rest)

if (tonApiBinding == null)
	throw new Error('TonApi_Rest: source binding is missing')

export default {
	source: Source.TonApi_Rest,

	resolvers: [
		defineResolver(Source.TonApi_Rest, {
			entityType: EntityType.TonAccount,
			resolve: {
				[TonAccountSelector.NetworkAddress]: async ({ $network, address }) => {
					if (
						!(
							'slug' in $network
							&& $network.slug === networkBySlug.ton.slug
						)
						&& !(
							'caip2' in $network
							&& $network.caip2.namespace === networkBySlug.ton.caip2.namespace
							&& $network.caip2.reference === networkBySlug.ton.caip2.reference
						)
					)
						throw new Error('TonApi_Rest: unsupported network')

					const { getAccount } = await import('$/sources/TonApi/Rest/queries.ts')
					const addressParts = /^(-?\d+):([0-9a-fA-F]{64})$/.exec((await getAccount(tonApiBinding, address)).address)
					if (addressParts == null)
						throw new Error('TonApi_Rest: account response has a malformed raw address')

					const workchain = Number(addressParts[1])
					if (!Number.isSafeInteger(workchain))
						throw new Error('TonApi_Rest: account response has a malformed workchain')

					return {
						workchain,
						addressHash: addressParts[2].toLowerCase(),
					}
				},
			},
		})({
			workchain: (account) => account.workchain,
			addressHash: (account) => account.addressHash,
		}),
	],
}
