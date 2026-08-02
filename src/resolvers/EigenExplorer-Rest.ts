import { networkBySlug } from '$/constants/Network.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const assertEthereumMainnet = (network: NetworkId) => {
	if (
		(
			'caip2' in network
			&& network.caip2.namespace === networkBySlug.ethereum.caip2.namespace
			&& network.caip2.reference === networkBySlug.ethereum.caip2.reference
		)
		|| (
			'slug' in network
			&& network.slug === networkBySlug.ethereum.slug
		)
	)
		return

	throw new Error('EigenExplorer_Rest: unsupported network')
}

export default {
	source: Source.EigenExplorer_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.EigenLayerDelegation_Timestamp,
			resolve: {
				StakerOperatorStrategyTimestampMsSource: {
					appliesTo: [
						{
							$staker: {
								$network: {
									caip2: networkBySlug.ethereum.caip2,
								},
							},
							source: Source.EigenExplorer_Rest,
						},
						{
							$staker: {
								$network: {
									slug: networkBySlug.ethereum.slug,
								},
							},
							source: Source.EigenExplorer_Rest,
						},
					],
					resolve: async ({
						$staker,
						$operator,
						$strategy,
						timestampMs,
						source,
					}) => {
						assertEthereumMainnet($staker.$network)
						assertEthereumMainnet($operator.$network)
						assertEthereumMainnet($strategy.$network)
						if (source !== Source.EigenExplorer_Rest)
							throw new Error('EigenExplorer_Rest: observation source mismatch')

						const { getStaker } = await import('$/sources/EigenExplorer/Rest/queries.ts')
						const staker = await getStaker($staker.$actor.address)
						if (
							staker.operatorAddress == null
							|| staker.operatorAddress.toLowerCase() !== $operator.operatorAddress.toLowerCase()
						)
							throw new Error('EigenExplorer_Rest: delegation operator mismatch')

						if (Date.parse(staker.updatedAt) !== timestampMs)
							throw new Error('EigenExplorer_Rest: delegation timestamp mismatch')

						const strategyShares = staker.shares.find(({ strategyAddress }) => (
							strategyAddress.toLowerCase() === $strategy.strategyAddress.toLowerCase()
						))
						if (strategyShares == null)
							throw new Error('EigenExplorer_Rest: delegation strategy mismatch')

						return {
							delegatedShares: BigInt(strategyShares.shares),
						}
					},
				},
			},
		})({
			delegatedShares: (delegation) => delegation.delegatedShares,
		}),
	],
} satisfies RegisteredSourceResolverModule<Source.EigenExplorer_Rest>
