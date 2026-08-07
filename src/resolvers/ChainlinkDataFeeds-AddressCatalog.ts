import { networks } from '$/constants/Network.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'


type NetworkId = EntitySelector<typeof schema, EntityType.Network>


const chainIdFromNetwork = (
	network: NetworkId
) => {
	const caip2 = (
		'caip2' in network ?
			network.caip2
		:
			((networkRow) => (
				networkRow != null && 'caip2' in networkRow ?
					networkRow.caip2
				:
					undefined
			))(networks.find(({ slug }) => slug === network.slug))
	)
	if (caip2?.namespace !== 'eip155')
		throw new Error('ChainlinkDataFeeds_AddressCatalog: network selector does not identify an EIP-155 network')

	const chainId = Number(caip2.reference)
	if (!Number.isSafeInteger(chainId) || chainId < 0)
		throw new Error(`ChainlinkDataFeeds_AddressCatalog: invalid EIP-155 chain id ${caip2.reference}`)

	return chainId
}


const networkRef = (
	chainId: number
) => ({
	[EntityMetaKey.Selector]: {
		caip2: {
			namespace: 'eip155' as const,
			reference: String(chainId),
		},
	},
})


export default {
	source: Source.ChainlinkDataFeeds_AddressCatalog,

	resolvers: [
		defineResolver({
			entityType: EntityType.OracleFeed,
			resolve: {
				EvmNetworkAddress: {
					resolve: async ({
						$network,
						address,
					}) => {
						const {
							getPriceFeed,
						} = await import('$/sources/ChainlinkDataFeeds/AddressCatalog/queries.ts')

						const chainId = chainIdFromNetwork($network)
						const feed = getPriceFeed({
							chainId,
							proxyAddress: address,
						})

						return {
							$network: networkRef(feed.chainId),
							address: feed.proxyAddress,
							label: feed.label,
							feedKind: feed.feedKind,
						}
					},
				},
			},
		})({
			$network: (entity) => entity.$network,
			address: (entity) => entity.address,
			label: (entity) => entity.label,
			feedKind: (entity) => entity.feedKind,
		}),
	],
} satisfies RegisteredSourceResolverModule
