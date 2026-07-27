import { defineResolver } from '$/resolvers/defineResolver.ts'
import { Source } from '$/sources/Source.ts'
import { EntityType } from '$/schema/EntityType.ts'

const assertQuilibriumNetwork = (
	network: { slug: string } | { caip2: {
		namespace: string
		reference: string
	} }
) => {
	if ('slug' in network && network.slug === 'quilibrium')
		return

	throw new Error('QuilibriumNodeRpc_Grpc: unsupported network')
}

export default {
	source: Source.QuilibriumNodeRpc_Grpc,

	resolvers: [
		defineResolver(Source.QuilibriumNodeRpc_Grpc, {
			entityType: EntityType.QuilibriumAccount,
			resolve: {
				NetworkAccountAddress: {
					resolve: async ({ $network, accountAddress }) => {
						assertQuilibriumNetwork($network)
						const { implicitAccountReference } = await import('$/sources/QuilibriumNodeRpc/Grpc/queries.ts')
						implicitAccountReference(accountAddress)

						return {
							accountKind: 'implicit',
						}
					},
				},
			},
		})({
			accountKind: (account) => account.accountKind,
		}),
	],
}
