import { getText } from '$/lib/http.ts'
import { ethereumSpecsBindings } from '$/sources/EthereumSpecs/bindings.ts'
import {
	consensusHoleskyYamlUrl,
	consensusMainnetYamlUrl,
	consensusSepoliaYamlUrl,
	executionSpecsMainnetUpgradeMarkdownUrl,
	goEthereumParamsConfigGoUrl,
} from '$/sources/EthereumSpecs/Github/constants.ts'
import type { ConsensusSpecsNetworkPreset } from '$/sources/EthereumSpecs/Github/types.ts'

const origins = ethereumSpecsBindings[0].endpoints.map((endpoint) => ({
	origin: endpoint.origin,
	corsEnabled: endpoint.corsEnabled,
}))

const consensusSpecsConfigYamlUrlByPreset = {
	mainnet: consensusMainnetYamlUrl,
	sepolia: consensusSepoliaYamlUrl,
	holesky: consensusHoleskyYamlUrl,
} as const satisfies Record<ConsensusSpecsNetworkPreset, string>

export const fetchConsensusSpecsConfigYaml = async ({
	preset,
}: {
	preset: ConsensusSpecsNetworkPreset
}) => (
	getText(
		consensusSpecsConfigYamlUrlByPreset[preset],
		{ origins }
	)
)

export const fetchGoEthereumParamsConfigGo = async () => (
	getText(
		goEthereumParamsConfigGoUrl,
		{ origins }
	)
)

export const fetchExecutionSpecsMainnetUpgradeMarkdown = async ({
	filename,
}: {
	filename: string
}) => (
	getText(
		executionSpecsMainnetUpgradeMarkdownUrl(filename),
		{ origins }
	)
)
