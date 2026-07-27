import { Source } from '$/sources/Source.ts'
import { getText } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/EthereumSpecs/bindings.ts'
import type { ConsensusSpecsNetworkPreset } from '$/sources/EthereumSpecs/Github/types.ts'

const consensusSpecsConfigYamlFilenameByPreset = {
	mainnet: 'mainnet.yaml',
	sepolia: 'sepolia.yaml',
	holesky: 'holesky.yaml',
} satisfies Record<ConsensusSpecsNetworkPreset, string>

const binding = bindings[Source.EthereumSpecs_Github][2]

export const fetchConsensusSpecsConfigYaml = async ({
	preset,
}: {
	preset: ConsensusSpecsNetworkPreset
}) => (
	getText(binding, consensusSpecsConfigYamlFilenameByPreset[preset])
)

export const fetchGoEthereumParamsConfigGo = async () => (
	getText(binding)
)

export const fetchExecutionSpecsMainnetUpgradeMarkdown = async ({
	filename,
}: {
	filename: string
}) => (
	getText(binding, filename)
)
