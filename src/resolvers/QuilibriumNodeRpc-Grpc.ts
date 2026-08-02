import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import { Source } from '$/sources/Source.ts'
import { EntityType } from '$/schema/EntityType.ts'

export default {
	source: Source.QuilibriumNodeRpc_Grpc,

	resolvers: [
		defineResolver({
			entityType: EntityType.QuilibriumAccount,
			resolve: {
				NetworkAccountAddress: {
					resolve: async ({ $network, accountAddress }) => {
						if (!('slug' in $network) || $network.slug !== 'quilibrium')
							throw new Error('QuilibriumNodeRpc_Grpc: unsupported network')

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
} satisfies RegisteredSourceResolverModule
