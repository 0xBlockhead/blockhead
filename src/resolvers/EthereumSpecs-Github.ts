import { defineEntityFieldResolver } from '$/resolvers/$resolvers.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import type { ConsensusSpecsNetworkPreset } from '$/sources/EthereumSpecs/Github/types.ts'


const consensusSpecsPresetForChainId = (chainId: number): ConsensusSpecsNetworkPreset | undefined => (
	chainId === 1 ?
		'mainnet'
	: 	chainId === 11_155_111 ?
		'sepolia'
	: chainId === 17_000 ?
		'holesky'
	:
		undefined
)

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
			entityType: EntityType.Network,
			fieldName: 'consensusSpecsConfigYaml',
			resolve: async (entityId) => {
				const preset = consensusSpecsPresetForChainId(entityId.chainId)
				if (preset == null) {
					throw new Error(
						`EthereumSpecs_Github: no consensus preset for chain ${String(entityId.chainId)}`,
					)
				}
				const { fetchConsensusSpecsConfigYaml } = await import('$/sources/EthereumSpecs/Github/queries.ts')
				return fetchConsensusSpecsConfigYaml({ preset })
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: 'goEthereumParamsConfigGo',
			resolve: async (entityId) => {
				if (!ethereumReferenceForkMetadataChainIds.has(entityId.chainId)) {
					throw new Error(
						`EthereumSpecs_Github: go-ethereum params unsupported for chain ${String(entityId.chainId)}`,
					)
				}
				const { fetchGoEthereumParamsConfigGo } = await import('$/sources/EthereumSpecs/Github/queries.ts')
				return fetchGoEthereumParamsConfigGo()
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NetworkExecutionUpgrade,
			fieldName: 'executionSpecsMainnetUpgradeMarkdown',
			resolve: async (entityId) => {
				const { networkExecutionUpgradeByChainIdAndUpgradeId } = await import('$/constants/NetworkUpgrades.ts')
				const row = networkExecutionUpgradeByChainIdAndUpgradeId[
					`${entityId.$network.chainId}:${entityId.upgradeId}`
				]
				const filename = row?.executionSpecsPinnedMarkdownFilename
				if (filename == null) return undefined
				const { fetchExecutionSpecsMainnetUpgradeMarkdown } = await import('$/sources/EthereumSpecs/Github/queries.ts')
				return fetchExecutionSpecsMainnetUpgradeMarkdown({ filename })
			},
		}),
	],
}
