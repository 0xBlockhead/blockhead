import { getText } from '$/lib/http.ts'
import {
	consensusHoleskyYamlUrl,
	consensusMainnetYamlUrl,
	consensusSepoliaYamlUrl,
	ethereumSpecsGithubOrigins,
	executionSpecsMainnetUpgradeMarkdownUrl,
	goEthereumParamsConfigGoUrl,
} from '$/sources/EthereumSpecs/Github/constants.ts'
import type { ConsensusSpecsNetworkPreset } from '$/sources/EthereumSpecs/Github/types.ts'

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
		{ origins: ethereumSpecsGithubOrigins }
	)
)

export const fetchGoEthereumParamsConfigGo = async () => (
	getText(
		goEthereumParamsConfigGoUrl,
		{ origins: ethereumSpecsGithubOrigins }
	)
)

export const fetchExecutionSpecsMainnetUpgradeMarkdown = async ({
	filename,
}: {
	filename: string
}) => (
	getText(
		executionSpecsMainnetUpgradeMarkdownUrl(filename),
		{ origins: ethereumSpecsGithubOrigins }
	)
)
