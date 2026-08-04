import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
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
import type { AaveMarketWire } from '$/sources/Aave/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>
type AaveMarketId = EntitySelector<typeof schema, EntityType.AaveMarket>

const eip155ChainId = (network: NetworkId) => {
	if (!('caip2' in network) || network.caip2.namespace !== 'eip155')
		throw new Error(`${Source.Aave_Rest}: network must use the eip155 CAIP-2 namespace`)

	const chainId = Number(network.caip2.reference)
	if (!Number.isSafeInteger(chainId) || chainId < 1)
		throw new Error(`${Source.Aave_Rest}: invalid eip155 chain id ${network.caip2.reference}`)

	return chainId
}

const mapAaveMarketSnapshot = (
	network: NetworkId,
	market: AaveMarketWire
) => ({
	$network: {
		[EntityMetaKey.Selector]: network,
	},
	poolAddress: market.address,
	name: market.name,
	icon: market.icon,
	totalMarketSize: market.totalMarketSize,
	totalAvailableLiquidity: market.totalAvailableLiquidity,
})

export default {
	source: Source.Aave_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.AaveMarket,
			resolve: {
				NetworkPoolAddress: {
					resolve: async ({
						$network,
						poolAddress,
					}: AaveMarketId) => {
						const chainId = eip155ChainId($network)
						const { getMarket } = await import('$/sources/Aave/Rest/queries.ts')
						return mapAaveMarketSnapshot(
							$network,
							await getMarket({
								chainId,
								poolAddress,
							})
						)
					},
				},
			},
		})({
			$network: (market) => market.$network,
			poolAddress: (market) => market.poolAddress,
			name: (market) => market.name,
			icon: (market) => market.icon,
			totalMarketSize: (market) => market.totalMarketSize,
			totalAvailableLiquidity: (market) => market.totalAvailableLiquidity,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (network, context) => {
						const chainId = eip155ChainId(network)
						const { listMarkets } = await import('$/sources/Aave/Rest/queries.ts')
						return (await listMarkets({
							chainIds: [
								chainId,
							],
						}))
							.slice(0, resolverContextRowLimit(context))
							.map((market) => ({
								[EntityMetaKey.Selector]: {
									$network: network,
									poolAddress: market.address,
								},
							}))
					},
				},
			},
		})({
			Evm: {
				$$aaveMarkets: (markets) => markets,
			},
		}),
	],
} satisfies RegisteredSourceResolverModule<Source.Aave_Rest>
