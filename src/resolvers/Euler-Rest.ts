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
	EulerAccountPosition,
	EulerEvkVaultDetail,
} from '$/sources/Euler/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>
type EulerEvkVaultId = EntitySelector<typeof schema, EntityType.EulerEvkVault>
type EulerEvkVaultPositionId = EntitySelector<typeof schema, EntityType.EulerEvkVaultPosition>
type EvmNetworkAccountId = EntitySelector<typeof schema, EntityType.EvmNetworkAccount>

const eip155ChainId = (network: NetworkId) => {
	if (!('caip2' in network) || network.caip2.namespace !== 'eip155')
		throw new Error(`${Source.Euler_Rest}: network must use the eip155 CAIP-2 namespace`)

	const chainId = Number(network.caip2.reference)
	if (!Number.isSafeInteger(chainId) || chainId < 1)
		throw new Error(`${Source.Euler_Rest}: invalid eip155 chain id ${network.caip2.reference}`)

	return chainId
}

const mapEulerEvkVaultSnapshot = (
	network: NetworkId,
	vault: EulerEvkVaultDetail
) => ({
	$network: {
		[EntityMetaKey.Selector]: network,
	},
	vaultAddress: vault.vaultAddress,
	name: vault.name,
	symbol: vault.symbol,
	decimals: vault.decimals,
	assetAddress: vault.assetAddress,
	assetSymbol: vault.assetSymbol,
	totalAssets: vault.totalAssets,
	totalBorrows: vault.totalBorrows,
	totalSupplyUsd: vault.totalSupplyUsd,
	totalBorrowsUsd: vault.totalBorrowsUsd,
	utilization: vault.utilization,
	supplyApy: vault.supplyApy,
	borrowApy: vault.borrowApy,
	createdAt: vault.createdAt,
	...(vault.dTokenAddress != null && {
		dTokenAddress: vault.dTokenAddress,
	}),
	...(vault.oracleAddress != null && {
		oracleAddress: vault.oracleAddress,
	}),
	...(vault.governorAddress != null && {
		governorAddress: vault.governorAddress,
	}),
	...(vault.supplyCap != null && {
		supplyCap: vault.supplyCap,
	}),
	...(vault.borrowCap != null && {
		borrowCap: vault.borrowCap,
	}),
	...(vault.interestFee != null && {
		interestFee: vault.interestFee,
	}),
})

const mapEulerEvkVaultPositionSnapshot = (
	$account: EvmNetworkAccountId,
	position: EulerAccountPosition
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
	vaultType: position.vaultType,
	assetAddress: position.assetAddress,
	shares: position.shares,
	assets: position.assets,
	borrowed: position.borrowed,
	assetsValue: position.assetsValue,
	debtValue: position.debtValue,
	isCollateral: position.isCollateral,
	isController: position.isController,
	balanceForwarderEnabled: position.balanceForwarderEnabled,
})

export default {
	source: Source.Euler_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.EulerEvkVault,
			resolve: {
				NetworkVaultAddress: {
					resolve: async ({
						$network,
						vaultAddress,
					}: EulerEvkVaultId) => {
						const chainId = eip155ChainId($network)
						const { eulerEvkByChainId } = await import('$/sources/Euler/Rest/constants.ts')
						if (eulerEvkByChainId[chainId] == null)
							throw new Error(`${Source.Euler_Rest}: unsupported chain id ${String(chainId)}`)

						const { getVault } = await import('$/sources/Euler/Rest/queries.ts')
						return mapEulerEvkVaultSnapshot(
							$network,
							await getVault({
								chainId,
								vaultAddress,
							})
						)
					},
				},
			},
		})({
			$network: (vault) => vault.$network,
			vaultAddress: (vault) => vault.vaultAddress,
			name: (vault) => vault.name,
			symbol: (vault) => vault.symbol,
			decimals: (vault) => vault.decimals,
			assetAddress: (vault) => vault.assetAddress,
			assetSymbol: (vault) => vault.assetSymbol,
			totalAssets: (vault) => vault.totalAssets,
			totalBorrows: (vault) => vault.totalBorrows,
			totalSupplyUsd: (vault) => vault.totalSupplyUsd,
			totalBorrowsUsd: (vault) => vault.totalBorrowsUsd,
			utilization: (vault) => vault.utilization,
			supplyApy: (vault) => vault.supplyApy,
			borrowApy: (vault) => vault.borrowApy,
			createdAt: (vault) => vault.createdAt,
			dTokenAddress: (vault) => vault.dTokenAddress,
			oracleAddress: (vault) => vault.oracleAddress,
			governorAddress: (vault) => vault.governorAddress,
			supplyCap: (vault) => vault.supplyCap,
			borrowCap: (vault) => vault.borrowCap,
			interestFee: (vault) => vault.interestFee,
		}),

		defineResolver({
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				EvmNetworkEvmAccount: {
					resolve: async ({ $actor, $network }: EvmNetworkAccountId, context) => {
						const chainId = eip155ChainId($network)
						const { eulerEvkByChainId } = await import('$/sources/Euler/Rest/constants.ts')
						if (eulerEvkByChainId[chainId] == null)
							throw new Error(`${Source.Euler_Rest}: unsupported chain id ${String(chainId)}`)

						const { getAccountPositions } = await import('$/sources/Euler/Rest/queries.ts')
						const $account = {
							$actor,
							$network,
						}
						return (
							(await getAccountPositions({
								chainId,
								account: $actor.address,
							}))
								.slice(0, resolverContextRowLimit(context))
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
			$$eulerEvkVaultPositions: (positions) => positions,
		}),

		defineResolver({
			entityType: EntityType.EulerEvkVaultPosition,
			resolve: {
				AccountVault: {
					resolve: async ({
						$account,
						$vault,
					}: EulerEvkVaultPositionId) => {
						const chainId = eip155ChainId($account.$network)
						const { eulerEvkByChainId } = await import('$/sources/Euler/Rest/constants.ts')
						if (eulerEvkByChainId[chainId] == null)
							throw new Error(`${Source.Euler_Rest}: unsupported chain id ${String(chainId)}`)

						const normalizedVaultAddress = hexLowerOfByteSize($vault.vaultAddress, 20)
						if (normalizedVaultAddress == null)
							throw new Error(`${Source.Euler_Rest}: invalid vault address ${$vault.vaultAddress}`)

						const { getAccountPositions } = await import('$/sources/Euler/Rest/queries.ts')
						const position = (
							await getAccountPositions({
								chainId,
								account: $account.$actor.address,
							})
						)
							.find((candidate) => candidate.vaultAddress === normalizedVaultAddress)
						if (position == null)
							throw new Error(`${Source.Euler_Rest}: vault position not found ${normalizedVaultAddress}`)

						return mapEulerEvkVaultPositionSnapshot(
							$account,
							position
						)
					},
				},
			},
		})({
			$account: (position) => position.$account,
			$vault: (position) => position.$vault,
			vaultType: (position) => position.vaultType,
			assetAddress: (position) => position.assetAddress,
			shares: (position) => position.shares,
			assets: (position) => position.assets,
			borrowed: (position) => position.borrowed,
			assetsValue: (position) => position.assetsValue,
			debtValue: (position) => position.debtValue,
			isCollateral: (position) => position.isCollateral,
			isController: (position) => position.isController,
			balanceForwarderEnabled: (position) => position.balanceForwarderEnabled,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (network, context) => {
						const chainId = eip155ChainId(network)
						const { eulerEvkByChainId } = await import('$/sources/Euler/Rest/constants.ts')
						if (eulerEvkByChainId[chainId] == null)
							throw new Error(`${Source.Euler_Rest}: unsupported chain id ${String(chainId)}`)

						const { listVaults } = await import('$/sources/Euler/Rest/queries.ts')
						return (await listVaults({
							chainId,
							limit: resolverContextRowLimit(context),
						}))
							.map((vault) => ({
								[EntityMetaKey.Selector]: {
									$network: network,
									vaultAddress: vault.vaultAddress,
								},
							}))
					},
				},
			},
		})({
			Evm: {
				$$eulerEvkVaults: (vaults) => vaults,
			},
		}),
	],
}
