import { singleFlight } from '$/lib/singleFlight.ts'
import {
	defineEntityFieldResolver,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	source: Source.Superchain_Github,

	entityResolvers: [],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$parentLayer',
			resolve: async (entityId) => {
				const { fetchSuperchainNetworks } = await import('$/sources/Superchain/Github/queries.ts')
				const network = (await singleFlight(fetchSuperchainNetworks)()).find((candidate) => candidate.chainId === entityId.chainId)
				return (
					network?.parentChainId == null ?
						undefined
					:	{
							[EntityMetaKey.Id]: {
								chainId: network.parentChainId,
							},
						}
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$childLayers',
			resolve: async (entityId) => {
				const {
					superchainMainnetIdentifier,
					superchainSepoliaIdentifier,
				} = await import('$/sources/Superchain/Github/constants.ts')
				const { fetchSuperchainNetworks } = await import('$/sources/Superchain/Github/queries.ts')
				const networks = await singleFlight(fetchSuperchainNetworks)()
				const namespaceFilter = (
					entityId.chainId === 1 ?
						superchainMainnetIdentifier
					: entityId.chainId === 11155111 ?
						superchainSepoliaIdentifier
					:
						undefined
				)
				return networks.flatMap((network) => (
					network.parentChainId !== entityId.chainId
					|| (
						namespaceFilter != null
						&& network.namespace !== namespaceFilter
					) ?
						[]
					:	[{
							[EntityMetaKey.Id]: {
								chainId: network.chainId,
							},
						}]
				))
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$testnets',
			resolve: async (entityId) => {
				const { superchainMainnetIdentifier } = await import('$/sources/Superchain/Github/constants.ts')
				const { fetchSuperchainNetworks } = await import('$/sources/Superchain/Github/queries.ts')
				const networks = await singleFlight(fetchSuperchainNetworks)()
				const network = networks.find((candidate) => candidate.chainId === entityId.chainId)
				if (network == null || network.namespace !== superchainMainnetIdentifier) {
					throw new Error('Superchain_Github: $$testnets only for Superchain mainnet networks')
				}
				return networks.flatMap((candidate) => (
					candidate.namespace === superchainMainnetIdentifier
					|| candidate.slug !== network.slug ?
						[]
					:	[{
							[EntityMetaKey.Id]: {
								chainId: candidate.chainId,
							},
						}]
				))
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$mainnet',
			resolve: async (entityId) => {
				const { superchainMainnetIdentifier } = await import('$/sources/Superchain/Github/constants.ts')
				const { fetchSuperchainNetworks } = await import('$/sources/Superchain/Github/queries.ts')
				const networks = await singleFlight(fetchSuperchainNetworks)()
				const network = networks.find((candidate) => candidate.chainId === entityId.chainId)
				if (network == null || network.namespace === superchainMainnetIdentifier) return undefined
				const mainnet = networks.find((candidate) => (
					candidate.namespace === superchainMainnetIdentifier
					&& candidate.slug === network.slug
				))
				return (
					mainnet == null ?
						undefined
					:	{
							[EntityMetaKey.Id]: {
								chainId: mainnet.chainId,
							},
						}
				)
			},
		}),
	],
}
