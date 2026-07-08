import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { EthereumExecutionUpgradeSelector } from '$/schema/EthereumExecutionUpgrade.ts'

export default {
	source: Source.EthereumSpecs_Github,

	resolvers: [
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
					return fetchExecutionSpecsMainnetUpgradeMarkdown({ filename })
				},
			},
		})({
				executionSpecsMainnetUpgradeMarkdown: (snapshot) => snapshot,
			}),
	],
}
