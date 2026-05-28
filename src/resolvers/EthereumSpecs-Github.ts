import { singleFlight } from '$/lib/singleFlight.ts'
import { defineEntityFieldResolver } from '$/resolvers/$resolvers.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'


const ethereumReferenceForkMetadataChainIds = new Set([
	1,
	11_155_111,
	17_000,
])

export default {
	source: Source.EthereumSpecs_Github,

	entityResolvers: [],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: 'consensusSpecsConfigYaml',
			resolve: async (entityId) => {
				const preset = (
					entityId.chainId === 1 ?
						'mainnet'
					: entityId.chainId === 11_155_111 ?
						'sepolia'
					: entityId.chainId === 17_000 ?
						'holesky'
					:
						undefined
				)
				if (preset == null) {
					throw new Error(
						`EthereumSpecs_Github: no consensus preset for chain ${String(entityId.chainId)}`,
					)
				}
				const { fetchConsensusSpecsConfigYaml } = await import('$/sources/EthereumSpecs/Github/queries.ts')
				return singleFlight(fetchConsensusSpecsConfigYaml)({ preset })
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: 'goEthereumParamsConfigGo',
			resolve: async (entityId) => {
				if (!ethereumReferenceForkMetadataChainIds.has(entityId.chainId)) {
					throw new Error(
						`EthereumSpecs_Github: go-ethereum params unsupported for chain ${String(entityId.chainId)}`,
					)
				}
				const { fetchGoEthereumParamsConfigGo } = await import('$/sources/EthereumSpecs/Github/queries.ts')
				return singleFlight(fetchGoEthereumParamsConfigGo)()
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EthereumExecutionUpgrade,
			fieldName: 'executionSpecsMainnetUpgradeMarkdown',
			resolve: async (entityId) => {
				const { networkExecutionUpgradeByChainIdAndUpgradeId } = await import('$/constants/EthereumNetworkUpgrades.ts')
				const row = networkExecutionUpgradeByChainIdAndUpgradeId[
					`${entityId.$network.chainId}:${entityId.upgradeId}`
				]
				const filename = row?.executionSpecsPinnedMarkdownFilename
				if (filename == null) return undefined
				const { fetchExecutionSpecsMainnetUpgradeMarkdown } = await import('$/sources/EthereumSpecs/Github/queries.ts')
				return singleFlight(fetchExecutionSpecsMainnetUpgradeMarkdown)({ filename })
			},
		}),
	],
}
