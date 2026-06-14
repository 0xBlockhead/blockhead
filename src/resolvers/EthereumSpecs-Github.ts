import { singleFlight } from '$/lib/singleFlight.ts'
import { ethereumReferenceForkMetadataChainIds } from '$/constants/EthereumSpecs.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { EvmNetworkSelector } from '$/schema/EvmNetwork.ts'
import { EthereumExecutionUpgradeSelector } from '$/schema/EthereumExecutionUpgrade.ts'


export default {
	source: Source.EthereumSpecs_Github,

	resolvers: [
		defineResolver(Source.EthereumSpecs_Github, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async ({ caip2 }) => {
				const preset = (
					Number(caip2.reference) === 1 ?
						'mainnet'
					: Number(caip2.reference) === 11_155_111 ?
						'sepolia'
					: Number(caip2.reference) === 17_000 ?
						'holesky'
					:
						undefined
				)
				if (preset == null) {
					throw new Error(
						`EthereumSpecs_Github: no consensus preset for chain ${String(Number(caip2.reference))}`,
					)
				}
				const { fetchConsensusSpecsConfigYaml } = await import('$/sources/EthereumSpecs/Github/queries.ts')
				return singleFlight(fetchConsensusSpecsConfigYaml)({ preset })
			}
			}
		})({
				fields: {
			consensusSpecsConfigYaml: (snapshot) => snapshot,
		},
			}),

		defineResolver(Source.EthereumSpecs_Github, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async ({ caip2 }) => {
				if (!ethereumReferenceForkMetadataChainIds.some((chainId) => chainId === Number(entitySelector.caip2.reference))) {
					throw new Error(
						`EthereumSpecs_Github: go-ethereum params unsupported for chain ${String(Number(caip2.reference))}`,
					)
				}
				const { fetchGoEthereumParamsConfigGo } = await import('$/sources/EthereumSpecs/Github/queries.ts')
				return singleFlight(fetchGoEthereumParamsConfigGo)()
			}
			}
		})({
				fields: {
			goEthereumParamsConfigGo: (snapshot) => snapshot,
		},
			}),

		defineResolver(Source.EthereumSpecs_Github, {
			entityType: EntityType.EthereumExecutionUpgrade,
			resolve: {
				[EthereumExecutionUpgradeSelector.EvmNetworkUpgradeId]: async ({ $network, upgradeId }) => {
				const { networkExecutionUpgradeByChainIdAndUpgradeId } = await import('$/constants/EthereumNetworkUpgrades.ts')
				const networkUpgrade = networkExecutionUpgradeByChainIdAndUpgradeId[
					`${Number($network.caip2.reference)}:${upgradeId}`
				]
				const filename = networkUpgrade.executionSpecsPinnedMarkdownFilename
				if (filename == null) return undefined
				const { fetchExecutionSpecsMainnetUpgradeMarkdown } = await import('$/sources/EthereumSpecs/Github/queries.ts')
				return singleFlight(fetchExecutionSpecsMainnetUpgradeMarkdown)({ filename })
			}
			}
		})({
				fields: {
			executionSpecsMainnetUpgradeMarkdown: (snapshot) => snapshot,
		},
			}),
	],
}
