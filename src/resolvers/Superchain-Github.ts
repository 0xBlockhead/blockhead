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
			entityType: EntityType.EvmNetwork,
			fieldName: '$parent',
			resolve: async (entityId) => {
				const { fetchNetworks } = await import('$/sources/Superchain/Github/queries.ts')
				const network = (await singleFlight(fetchNetworks)()).find((candidate) => candidate.chainId === Number(entityId.caip2.reference))
				return (
					network?.parentChainId == null ?
						undefined
					:
						{
							[EntityMetaKey.Id]: {
								caip2: {
									namespace: 'eip155',
									reference: String(network.parentChainId),
								},
							},
						}
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: '$$childLayers',
			resolve: async (entityId) => {
				const {
					superchainMainnetIdentifier,
					superchainSepoliaIdentifier,
				} = await import('$/sources/Superchain/Github/constants.ts')
				const { fetchNetworks } = await import('$/sources/Superchain/Github/queries.ts')
				const networks = await singleFlight(fetchNetworks)()
				const namespaceFilter = (
					Number(entityId.caip2.reference) === 1 ?
						superchainMainnetIdentifier
					: Number(entityId.caip2.reference) === 11155111 ?
						superchainSepoliaIdentifier
					:
						undefined
				)
				return networks.flatMap((network) => (
					network.parentChainId !== Number(entityId.caip2.reference)
					|| (
						namespaceFilter != null
						&& network.namespace !== namespaceFilter
					) ?
						[]
					:
						[{
							[EntityMetaKey.Id]: {
								caip2: {
									namespace: 'eip155',
									reference: String(network.chainId),
								},
							},
						}]
				))
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: '$$testnets',
			resolve: async (entityId) => {
				const { superchainMainnetIdentifier } = await import('$/sources/Superchain/Github/constants.ts')
				const { fetchNetworks } = await import('$/sources/Superchain/Github/queries.ts')
				const networks = await singleFlight(fetchNetworks)()
				const network = networks.find((candidate) => candidate.chainId === Number(entityId.caip2.reference))
				if (network == null || network.namespace !== superchainMainnetIdentifier) {
					throw new Error('Superchain_Github: $$testnets only for Superchain mainnet networks')
				}
				return networks.flatMap((candidate) => (
					candidate.namespace === superchainMainnetIdentifier
					|| candidate.slug !== network.slug ?
						[]
					:
						[{
							[EntityMetaKey.Id]: {
								caip2: {
									namespace: 'eip155',
									reference: String(candidate.chainId),
								},
							},
						}]
				))
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: '$mainnet',
			resolve: async (entityId) => {
				const { superchainMainnetIdentifier } = await import('$/sources/Superchain/Github/constants.ts')
				const { fetchNetworks } = await import('$/sources/Superchain/Github/queries.ts')
				const networks = await singleFlight(fetchNetworks)()
				const network = networks.find((candidate) => candidate.chainId === Number(entityId.caip2.reference))
				if (network == null || network.namespace === superchainMainnetIdentifier) return undefined
				const mainnet = networks.find((candidate) => (
					candidate.namespace === superchainMainnetIdentifier
					&& candidate.slug === network.slug
				))
				return (
					mainnet == null ?
						undefined
					:
						{
							[EntityMetaKey.Id]: {
								caip2: {
									namespace: 'eip155',
									reference: String(mainnet.chainId),
								},
							},
						}
				)
			},
		}),
	],
}
