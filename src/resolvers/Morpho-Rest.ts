import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import type {
	MorphoBlueMarketConfig,
	MorphoBlueMarketState,
} from '$/sources/Morpho/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>
type MorphoMarketId = EntitySelector<typeof schema, EntityType.MorphoMarket>

const eip155ChainId = (network: NetworkId) => {
	if (!('caip2' in network) || network.caip2.namespace !== 'eip155')
		throw new Error(`${Source.Morpho_Rest}: network must use the eip155 CAIP-2 namespace`)

	const chainId = Number(network.caip2.reference)
	if (!Number.isSafeInteger(chainId) || chainId < 1)
		throw new Error(`${Source.Morpho_Rest}: invalid eip155 chain id ${network.caip2.reference}`)

	return chainId
}

const mapMorphoMarketSnapshot = (
	network: NetworkId,
	config: MorphoBlueMarketConfig,
	state: MorphoBlueMarketState
) => ({
	$network: {
		[EntityMetaKey.Selector]: network,
	},
	marketId: config.marketId,
	loanAssetAddress: config.loanToken,
	collateralAssetAddress: config.collateralToken,
	oracleAddress: config.oracleAddress,
	irmAddress: config.irmAddress,
	lltvWad: config.lltvWad,
	creationBlockNumber: config.creationBlockNumber,
	totalSupplyAssets: state.totalSupplyAssets,
	totalSupplyShares: state.totalSupplyShares,
	totalBorrowAssets: state.totalBorrowAssets,
	totalBorrowShares: state.totalBorrowShares,
	feeWad: state.feeWad,
	lastIndexedBlock: state.lastIndexedBlock,
	lastAccrualTimestamp: state.lastAccrualTimestamp,
})

export default {
	source: Source.Morpho_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.MorphoMarket,
			resolve: {
				NetworkMarketId: {
					resolve: async ({
						$network,
						marketId,
					}: MorphoMarketId) => {
						const chainId = eip155ChainId($network)
						const { morphoBlueByChainId } = await import('$/sources/Morpho/Rest/constants.ts')
						if (morphoBlueByChainId[chainId] == null)
							throw new Error(`${Source.Morpho_Rest}: unsupported chain id ${String(chainId)}`)

						const {
							getMarket,
							getMarketState,
						} = await import('$/sources/Morpho/Rest/queries.ts')
						const [
							config,
							state,
						] = await Promise.all([
							getMarket({
								chainId,
								marketId,
							}),
							getMarketState({
								chainId,
								marketId,
							}),
						])
						return mapMorphoMarketSnapshot(
							$network,
							config,
							state
						)
					},
				},
			},
		})({
			$network: (market) => market.$network,
			marketId: (market) => market.marketId,
			loanAssetAddress: (market) => market.loanAssetAddress,
			collateralAssetAddress: (market) => market.collateralAssetAddress,
			oracleAddress: (market) => market.oracleAddress,
			irmAddress: (market) => market.irmAddress,
			lltvWad: (market) => market.lltvWad,
			creationBlockNumber: (market) => market.creationBlockNumber,
			totalSupplyAssets: (market) => market.totalSupplyAssets,
			totalSupplyShares: (market) => market.totalSupplyShares,
			totalBorrowAssets: (market) => market.totalBorrowAssets,
			totalBorrowShares: (market) => market.totalBorrowShares,
			feeWad: (market) => market.feeWad,
			lastIndexedBlock: (market) => market.lastIndexedBlock,
			lastAccrualTimestamp: (market) => market.lastAccrualTimestamp,
		}),
	],
}
