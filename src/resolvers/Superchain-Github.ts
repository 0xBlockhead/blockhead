import {
	NetworkEnvironment,
	NetworkNamespace,
	networkBySlug,
} from '$/constants/Network.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import {
	networkChainIdBySuperchainIdentifier,
	superchainMainnetIdentifier,
	superchainSepoliaIdentifier,
} from '$/sources/Superchain/Github/constants.ts'
import { Source } from '$/sources/Source.ts'

const superchainNetworkApplicability = [
	{
		caip2: networkBySlug.base.caip2,
	},
	{
		caip2: networkBySlug.optimism.caip2,
	},
] as const

const networkReference = (chainId: number) => ({
	[EntityMetaKey.Selector]: {
		caip2: {
			namespace: 'eip155',
			reference: String(chainId),
		},
	},
})

export default {
	source: Source.Superchain_Github,

	resolvers: [
		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					appliesTo: superchainNetworkApplicability,
					resolve: async ({ caip2 }) => {
						const { getChainList } = await import('$/sources/Superchain/Github/queries.ts')
						const chains = await getChainList()
						const chain = chains.find((candidate) => candidate.chainId === Number(caip2.reference))
						if (chain == null) return undefined

						const [namespace, slug] = chain.identifier.split('/')
						const chainByIdentifier = new Map(chains.map((candidate) => [
							candidate.identifier,
							candidate,
						]))
						const parentChainId = (() => {
							const parentChain = chain.parent?.chain
							if (parentChain == null) return undefined

							const numericChainId = Number(parentChain)
							if (Number.isSafeInteger(numericChainId) && numericChainId > 0)
								return numericChainId

							if (parentChain === superchainMainnetIdentifier)
								return networkChainIdBySuperchainIdentifier[superchainMainnetIdentifier]

							if (parentChain === superchainSepoliaIdentifier)
								return networkChainIdBySuperchainIdentifier[superchainSepoliaIdentifier]

							return (
								chainByIdentifier.get(`${namespace}/${parentChain}`)?.chainId
								?? chainByIdentifier.get(`${superchainMainnetIdentifier}/${parentChain}`)?.chainId
								?? chainByIdentifier.get(`${superchainSepoliaIdentifier}/${parentChain}`)?.chainId
							)
						})()
						const mainnet = (
							namespace === superchainMainnetIdentifier ?
								undefined
							:
								chains.find((candidate) => (
									candidate.identifier === `${superchainMainnetIdentifier}/${slug}`
								))
						)

						return {
							name: chain.name,
							environment: (
								namespace === superchainMainnetIdentifier ?
									NetworkEnvironment.Mainnet
								:
									NetworkEnvironment.Testnet
							),
							...(parentChainId != null && {
								$parent: networkReference(parentChainId),
							}),
							...(mainnet != null && {
								$mainnet: networkReference(mainnet.chainId),
							}),
							$$testnets: (
								namespace === superchainMainnetIdentifier ?
									chains.flatMap((candidate) => (
										candidate.identifier === `${superchainMainnetIdentifier}/${slug}`
										|| !candidate.identifier.endsWith(`/${slug}`) ?
											[]
										:
											[networkReference(candidate.chainId)]
									))
								:
									[]
							),
						}
					},
				},
			},
		})({
			name: (snapshot) => snapshot.name,
			namespace: () => NetworkNamespace.Evm,
			environment: (snapshot) => snapshot.environment,
			Evm: {
				$parent: (snapshot) => snapshot.$parent,
				$mainnet: (snapshot) => snapshot.$mainnet,
				$$testnets: (snapshot) => snapshot.$$testnets,
			},
		}),
	],
} satisfies RegisteredSourceResolverModule
