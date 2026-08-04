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
import type { EulerEvkVaultDetail } from '$/sources/Euler/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>
type EulerEvkVaultId = EntitySelector<typeof schema, EntityType.EulerEvkVault>

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
						const { getVault } = await import('$/sources/Euler/Rest/queries.ts')
						return mapEulerEvkVaultSnapshot(
							$network,
							await getVault({
								chainId: eip155ChainId($network),
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
	],
} satisfies RegisteredSourceResolverModule<Source.Euler_Rest>
