import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const eip155ChainId = (network: NetworkId) => {
	if (!('caip2' in network) || network.caip2.namespace !== 'eip155')
		throw new Error(`${Source.Morpho_Graphql}: network must use the eip155 CAIP-2 namespace`)

	const chainId = Number(network.caip2.reference)
	if (!Number.isSafeInteger(chainId) || chainId < 1)
		throw new Error(`${Source.Morpho_Graphql}: invalid eip155 chain id ${network.caip2.reference}`)

	return chainId
}

export default {
	source: Source.Morpho_Graphql,

	resolvers: [
		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (network, context) => {
						const chainId = eip155ChainId(network)
						const { listMarkets } = await import('$/sources/Morpho/Graphql/queries.ts')
						return (await listMarkets({
							chainIds: [
								chainId,
							],
							limit: resolverContextRowLimit(context),
						}))
							.map((market) => ({
								[EntityMetaKey.Selector]: {
									$network: network,
									marketId: market.marketId,
								},
							}))
					},
				},
			},
		})({
			Evm: {
				$$morphoMarkets: (markets) => markets,
			},
		}),
	],
}
