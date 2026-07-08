import {
	NetworkEnvironment,
	NetworkNamespace,
} from '$/constants/Network.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { NetworkSelector } from '$/schema/Network.ts'

export default {
	source: Source.Superchain_Github,

	resolvers: [
		defineResolver(Source.Superchain_Github, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: async ({ caip2 }) => {
				const { superchainMainnetIdentifier } = await import('$/sources/Superchain/Github/constants.ts')
				const { fetchNetworks } = await import('$/sources/Superchain/Github/queries.ts')
				const networks = await fetchNetworks()
				const network = networks.find((candidate) => candidate.chainId === Number(caip2.reference))
				if (network == null) throw new Error(`Superchain_Github: network not found for eip155:${caip2.reference}`)
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
							[EntityMetaKey.Selector]: {
								caip2: {
									namespace: 'eip155',
									reference: String(network.parentChainId),
								},
							},
						},
					}),
				}
			}
			}
		})({
			name: (snapshot) => snapshot.name,
			namespace: () => NetworkNamespace.Evm,
			environment: (snapshot) => snapshot.environment,
			Evm: {
				$parent: (snapshot) => snapshot.$parent,
			},
		}),

		defineResolver(Source.Superchain_Github, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: async ({ caip2 }) => {
				const { superchainMainnetIdentifier } = await import('$/sources/Superchain/Github/constants.ts')
				const { fetchNetworks } = await import('$/sources/Superchain/Github/queries.ts')
				const networks = await fetchNetworks()
				const network = networks.find((candidate) => candidate.chainId === Number(caip2.reference))
				return {
					$parent: (
						network?.parentChainId == null ?
							undefined
						:
							{
								[EntityMetaKey.Selector]: {
									caip2: {
										namespace: 'eip155',
										reference: String(network.parentChainId),
									},
								},
							}
					),
					$mainnet: (() => {
						if (
							network == null
							|| network.namespace === superchainMainnetIdentifier
						)
							return undefined

						const mainnet = networks.find((candidate) => (
							candidate.namespace === superchainMainnetIdentifier
							&& candidate.slug === network.slug
						))
						return (
							mainnet == null ?
								undefined
							:
								{
									[EntityMetaKey.Selector]: {
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
				Evm: {
					$parent: (snapshot) => snapshot.$parent,
					$mainnet: (snapshot) => snapshot.$mainnet
				},
			}),

			defineResolver(Source.Superchain_Github, {
				entityType: EntityType.Network,
				resolve: {
					[NetworkSelector.Caip2]: async ({ caip2 }) => {
				const { superchainMainnetIdentifier } = await import('$/sources/Superchain/Github/constants.ts')
					const { fetchNetworks } = await import('$/sources/Superchain/Github/queries.ts')
					const networks = await fetchNetworks()
					const network = networks.find((candidate) => candidate.chainId === Number(caip2.reference))
					if (network == null || network.namespace !== superchainMainnetIdentifier) return []
					return networks.flatMap((candidate) => (
						candidate.namespace === superchainMainnetIdentifier
						|| candidate.slug !== network.slug ?
							[]
						:
							[{
								[EntityMetaKey.Selector]: {
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
				Evm: {
					$$testnets: (snapshot) => snapshot
				},
			}),
	],
}
