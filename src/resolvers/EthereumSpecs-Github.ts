import { singleFlight } from '$/lib/singleFlight.ts'
import { ethereumReferenceForkMetadataChainIds } from '$/constants/EthereumSpecs.ts'
import { defineEntityFieldResolver } from '$/resolvers/$resolvers.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'


export default {
	source: Source.EthereumSpecs_Github,

	entityResolvers: [],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: 'consensusSpecsConfigYaml',
			resolve: async (entityId) => {
				const preset = (
					Number(entityId.caip2.reference) === 1 ?
						'mainnet'
					: Number(entityId.caip2.reference) === 11_155_111 ?
						'sepolia'
					: Number(entityId.caip2.reference) === 17_000 ?
						'holesky'
					:
						undefined
				)
				if (preset == null) {
					throw new Error(
						`EthereumSpecs_Github: no consensus preset for chain ${String(Number(entityId.caip2.reference))}`,
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
				if (!ethereumReferenceForkMetadataChainIds.some((chainId) => chainId === Number(entityId.caip2.reference))) {
					throw new Error(
						`EthereumSpecs_Github: go-ethereum params unsupported for chain ${String(Number(entityId.caip2.reference))}`,
					)
				}
				const { fetchParamsConfigGo } = await import('$/sources/EthereumSpecs/Github/queries.ts')
				return singleFlight(fetchParamsConfigGo)()
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EthereumExecutionUpgrade,
			fieldName: 'executionSpecsMainnetUpgradeMarkdown',
			resolve: async (entityId) => {
				const { networkExecutionUpgradeByChainIdAndUpgradeId } = await import('$/constants/EthereumNetworkUpgrades.ts')
				const networkUpgrade = networkExecutionUpgradeByChainIdAndUpgradeId[
					`${Number(entityId.$network.caip2.reference)}:${entityId.upgradeId}`
				]
				const filename = networkUpgrade?.executionSpecsPinnedMarkdownFilename
				if (filename == null) return undefined
				const { fetchExecutionSpecsMainnetUpgradeMarkdown } = await import('$/sources/EthereumSpecs/Github/queries.ts')
				return singleFlight(fetchExecutionSpecsMainnetUpgradeMarkdown)({ filename })
			},
		}),
	],
}
