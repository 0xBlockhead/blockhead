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
import type { MorphoGraphqlVault } from '$/sources/Morpho/Graphql/types.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>
type MorphoVaultId = EntitySelector<typeof schema, EntityType.MorphoVault>

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

export default {
	source: Source.Morpho_Graphql,

	resolvers: [
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
