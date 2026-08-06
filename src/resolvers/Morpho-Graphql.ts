import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
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
import type {
	MorphoGraphqlAccountMarketPosition,
	MorphoGraphqlAccountVaultPosition,
	MorphoGraphqlVault,
} from '$/sources/Morpho/Graphql/types.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>
type MorphoVaultId = EntitySelector<typeof schema, EntityType.MorphoVault>
type MorphoMarketPositionId = EntitySelector<typeof schema, EntityType.MorphoMarketPosition>
type MorphoVaultPositionId = EntitySelector<typeof schema, EntityType.MorphoVaultPosition>
type EvmNetworkAccountId = EntitySelector<typeof schema, EntityType.EvmNetworkAccount>

const eip155ChainId = (network: NetworkId) => {
	if (!('caip2' in network) || network.caip2.namespace !== 'eip155')
		throw new Error(`${Source.Morpho_Graphql}: network must use the eip155 CAIP-2 namespace`)

	const chainId = Number(network.caip2.reference)
	if (!Number.isSafeInteger(chainId) || chainId < 1)
		throw new Error(`${Source.Morpho_Graphql}: invalid eip155 chain id ${network.caip2.reference}`)

	return chainId
}

const mapMorphoVaultSnapshot = (
	network: NetworkId,
	vault: MorphoGraphqlVault,
) => ({
	$network: {
		[EntityMetaKey.Selector]: network,
	},
	vaultAddress: vault.address,
	name: vault.name,
	symbol: vault.symbol,
	listed: vault.listed,
	assetAddress: vault.assetAddress,
	assetDecimals: vault.assetDecimals,
})

const mapMorphoMarketPositionSnapshot = (
	$account: EvmNetworkAccountId,
	position: MorphoGraphqlAccountMarketPosition,
) => ({
	$account: {
		[EntityMetaKey.Selector]: $account,
	},
	$market: {
		[EntityMetaKey.Selector]: {
			$network: $account.$network,
			marketId: position.marketId,
		},
	},
	supplyAssets: position.supplyAssets,
	supplyShares: position.supplyShares,
	borrowAssets: position.borrowAssets,
	borrowShares: position.borrowShares,
	collateral: position.collateral,
	...(position.supplyAssetsUsd != null && {
		supplyAssetsUsd: position.supplyAssetsUsd,
	}),
	...(position.borrowAssetsUsd != null && {
		borrowAssetsUsd: position.borrowAssetsUsd,
	}),
	...(position.collateralUsd != null && {
		collateralUsd: position.collateralUsd,
	}),
})

const mapMorphoVaultPositionSnapshot = (
	$account: EvmNetworkAccountId,
	position: MorphoGraphqlAccountVaultPosition,
) => ({
	$account: {
		[EntityMetaKey.Selector]: $account,
	},
	$vault: {
		[EntityMetaKey.Selector]: {
			$network: $account.$network,
			vaultAddress: position.vaultAddress,
		},
	},
	assets: position.assets,
	shares: position.shares,
	...(position.assetsUsd != null && {
		assetsUsd: position.assetsUsd,
	}),
})

export default {
	source: Source.Morpho_Graphql,

	resolvers: [
		defineResolver({
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				EvmNetworkEvmAccount: {
					resolve: async ({ $actor, $network }: EvmNetworkAccountId, context) => {
						const chainId = eip155ChainId($network)
						const { morphoGraphqlNetworkByChainId } = await import('$/sources/Morpho/Graphql/constants.ts')
						if (morphoGraphqlNetworkByChainId[chainId] == null)
							throw new Error(`${Source.Morpho_Graphql}: unsupported chain id ${String(chainId)}`)

						const { getAccountPositions } = await import('$/sources/Morpho/Graphql/queries.ts')
						const $account = {
							$actor,
							$network,
						}
						const limit = resolverContextRowLimit(context)
						return (
							(await getAccountPositions({
								chainId,
								account: $actor.address,
							}))
								.filter((position) => position.kind === 'market')
								.slice(0, limit)
								.map((position) => ({
									[EntityMetaKey.Selector]: {
										$account,
										$market: {
											$network,
											marketId: position.marketId,
										},
									},
								}))
						)
					},
				},
			},
		})({
			$$morphoMarketPositions: (positions) => positions,
		}),

		defineResolver({
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				EvmNetworkEvmAccount: {
					resolve: async ({ $actor, $network }: EvmNetworkAccountId, context) => {
						const chainId = eip155ChainId($network)
						const { morphoGraphqlNetworkByChainId } = await import('$/sources/Morpho/Graphql/constants.ts')
						if (morphoGraphqlNetworkByChainId[chainId] == null)
							throw new Error(`${Source.Morpho_Graphql}: unsupported chain id ${String(chainId)}`)

						const { getAccountPositions } = await import('$/sources/Morpho/Graphql/queries.ts')
						const $account = {
							$actor,
							$network,
						}
						const limit = resolverContextRowLimit(context)
						return (
							(await getAccountPositions({
								chainId,
								account: $actor.address,
							}))
								.filter((position) => position.kind === 'vault')
								.slice(0, limit)
								.map((position) => ({
									[EntityMetaKey.Selector]: {
										$account,
										$vault: {
											$network,
											vaultAddress: position.vaultAddress,
										},
									},
								}))
						)
					},
				},
			},
		})({
			$$morphoVaultPositions: (positions) => positions,
		}),

		defineResolver({
			entityType: EntityType.MorphoMarketPosition,
			resolve: {
				AccountMarket: {
					resolve: async ({
						$account,
						$market,
					}: MorphoMarketPositionId) => {
						const chainId = eip155ChainId($account.$network)
						const { morphoGraphqlNetworkByChainId } = await import('$/sources/Morpho/Graphql/constants.ts')
						if (morphoGraphqlNetworkByChainId[chainId] == null)
							throw new Error(`${Source.Morpho_Graphql}: unsupported chain id ${String(chainId)}`)

						const normalizedMarketId = hexLowerOfByteSize($market.marketId, 32)
						if (normalizedMarketId == null)
							throw new Error(`${Source.Morpho_Graphql}: invalid market id ${$market.marketId}`)

						const { getAccountPositions } = await import('$/sources/Morpho/Graphql/queries.ts')
						const position = (
							await getAccountPositions({
								chainId,
								account: $account.$actor.address,
							})
						)
							.find((candidate) => (
								candidate.kind === 'market'
								&& candidate.marketId === normalizedMarketId
							))
						if (position == null || position.kind !== 'market')
							throw new Error(`${Source.Morpho_Graphql}: market position not found ${normalizedMarketId}`)

						return mapMorphoMarketPositionSnapshot(
							$account,
							position
						)
					},
				},
			},
		})({
			$account: (position) => position.$account,
			$market: (position) => position.$market,
			supplyAssets: (position) => position.supplyAssets,
			supplyShares: (position) => position.supplyShares,
			borrowAssets: (position) => position.borrowAssets,
			borrowShares: (position) => position.borrowShares,
			collateral: (position) => position.collateral,
			supplyAssetsUsd: (position) => position.supplyAssetsUsd,
			borrowAssetsUsd: (position) => position.borrowAssetsUsd,
			collateralUsd: (position) => position.collateralUsd,
		}),

		defineResolver({
			entityType: EntityType.MorphoVaultPosition,
			resolve: {
				AccountVault: {
					resolve: async ({
						$account,
						$vault,
					}: MorphoVaultPositionId) => {
						const chainId = eip155ChainId($account.$network)
						const { morphoGraphqlNetworkByChainId } = await import('$/sources/Morpho/Graphql/constants.ts')
						if (morphoGraphqlNetworkByChainId[chainId] == null)
							throw new Error(`${Source.Morpho_Graphql}: unsupported chain id ${String(chainId)}`)

						const normalizedVaultAddress = hexLowerOfByteSize($vault.vaultAddress, 20)
						if (normalizedVaultAddress == null)
							throw new Error(`${Source.Morpho_Graphql}: invalid vault address ${$vault.vaultAddress}`)

						const { getAccountPositions } = await import('$/sources/Morpho/Graphql/queries.ts')
						const position = (
							await getAccountPositions({
								chainId,
								account: $account.$actor.address,
							})
						)
							.find((candidate) => (
								candidate.kind === 'vault'
								&& candidate.vaultAddress === normalizedVaultAddress
							))
						if (position == null || position.kind !== 'vault')
							throw new Error(`${Source.Morpho_Graphql}: vault position not found ${normalizedVaultAddress}`)

						return mapMorphoVaultPositionSnapshot(
							$account,
							position
						)
					},
				},
			},
		})({
			$account: (position) => position.$account,
			$vault: (position) => position.$vault,
			assets: (position) => position.assets,
			shares: (position) => position.shares,
			assetsUsd: (position) => position.assetsUsd,
		}),

		defineResolver({
			entityType: EntityType.MorphoVault,
			resolve: {
				NetworkVaultAddress: {
					resolve: async ({
						$network,
						vaultAddress,
					}: MorphoVaultId) => {
						const chainId = eip155ChainId($network)
						const normalizedVaultAddress = hexLowerOfByteSize(vaultAddress, 20)
						if (normalizedVaultAddress == null)
							throw new Error(`${Source.Morpho_Graphql}: invalid vault address ${vaultAddress}`)

						const { getVault } = await import('$/sources/Morpho/Graphql/queries.ts')
						return mapMorphoVaultSnapshot(
							$network,
							await getVault({
								chainId,
								address: normalizedVaultAddress,
							}),
						)
					},
				},
			},
		})({
			$network: (vault) => vault.$network,
			vaultAddress: (vault) => vault.vaultAddress,
			name: (vault) => vault.name,
			symbol: (vault) => vault.symbol,
			listed: (vault) => vault.listed,
			assetAddress: (vault) => vault.assetAddress,
			assetDecimals: (vault) => vault.assetDecimals,
		}),

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

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (network, context) => {
						const chainId = eip155ChainId(network)
						const { listVaults } = await import('$/sources/Morpho/Graphql/queries.ts')
						return (await listVaults({
							chainIds: [
								chainId,
							],
							limit: resolverContextRowLimit(context),
						}))
							.map((vault) => ({
								[EntityMetaKey.Selector]: {
									$network: network,
									vaultAddress: vault.address,
								},
							}))
					},
				},
			},
		})({
			Evm: {
				$$morphoVaults: (vaults) => vaults,
			},
		}),
	],
}
