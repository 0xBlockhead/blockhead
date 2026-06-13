import { singleFlight } from '$/lib/singleFlight.ts'
import {
	NetworkEnvironment,
	NetworkNamespace,
} from '$/constants/Network.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export default {
	source: Source.Superchain_Github,

	resolvers: [
		defineResolver(Source.Superchain_Github, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { superchainMainnetIdentifier } = await import('$/sources/Superchain/Github/constants.ts')
				const { fetchNetworks } = await import('$/sources/Superchain/Github/queries.ts')
				const networks = await singleFlight(fetchNetworks)()
				const network = networks.find((candidate) => candidate.chainId === Number(entityId.caip2.reference))
				if (network == null) return {}
				return {
					name: network.name,
					namespace: NetworkNamespace.Evm,
					environment: (
						network.namespace === superchainMainnetIdentifier ?
							NetworkEnvironment.Mainnet
					:
							NetworkEnvironment.Testnet
					),
					...(network.parentChainId != null && {
						$parent: {
							[EntityMetaKey.Id]: {
								caip2: {
									namespace: 'eip155',
									reference: String(network.parentChainId),
								},
							},
						},
					}),
					layerNumber: (() => {
						let layerNumber = 1
						let parentChainId = network.parentChainId
						const visitedChainIds = new Set<number>()
						for (let hop = 0; hop < 256 && parentChainId != null; hop += 1) {
							if (visitedChainIds.has(parentChainId)) return layerNumber
							visitedChainIds.add(parentChainId)
							layerNumber += 1
							parentChainId = networks.find((candidate) => candidate.chainId === parentChainId)?.parentChainId
						}
						return layerNumber
					})(),
					$mainnet: (() => {
						if (network.namespace === superchainMainnetIdentifier) return undefined

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
					})(),
				}
			}
			}
		})({
				fields: {
			name: (snapshot) => snapshot.name,
			namespace: (snapshot) => snapshot.namespace,
			environment: (snapshot) => snapshot.environment,
			$parent: (snapshot) => snapshot.$parent,
			layerNumber: (snapshot) => snapshot.layerNumber,
			$mainnet: (snapshot) => snapshot.$mainnet,
		},
			}),

		defineResolver(Source.Superchain_Github, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
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
			}
			}
		})({
				fields: {
			$$childLayers: (snapshot) => snapshot,
		},
			}),

			defineResolver(Source.Superchain_Github, {
				entityType: EntityType.EvmNetwork,
				resolve: {
					[EntityIdProjection.Identity]: async (entityId) => {
					const { superchainMainnetIdentifier } = await import('$/sources/Superchain/Github/constants.ts')
					const { fetchNetworks } = await import('$/sources/Superchain/Github/queries.ts')
					const networks = await singleFlight(fetchNetworks)()
					const network = networks.find((candidate) => candidate.chainId === Number(entityId.caip2.reference))
					if (network == null || network.namespace !== superchainMainnetIdentifier) return []
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
				}
				}
		})({
				fields: {
				$$testnets: (snapshot) => snapshot,
			},
			}),
	],
}
