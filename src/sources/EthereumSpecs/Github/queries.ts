import { Source } from '$/sources/Source.ts'
import { getText } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/EthereumSpecs/bindings.ts'
import type { ConsensusSpecsNetworkPreset } from '$/sources/EthereumSpecs/Github/types.ts'

const consensusSpecsConfigYamlFilenameByPreset = {
	mainnet: 'mainnet.yaml',
	sepolia: 'sepolia.yaml',
	holesky: 'holesky.yaml',
} satisfies Record<ConsensusSpecsNetworkPreset, string>

const bindingByTargetKey = Object.fromEntries(
	bindings[Source.EthereumSpecs_Github].map((binding) => ([
		binding.target.key,
		binding,
	] as const))
)

export const fetchConsensusSpecsConfigYaml = ({
	preset,
}: {
	preset: ConsensusSpecsNetworkPreset
}) => (
	getText(
		bindingByTargetKey['ethereum/consensus-specs@master:configs'],
		consensusSpecsConfigYamlFilenameByPreset[preset]
	)
)

export const fetchGoEthereumParamsConfigGo = () => (
	getText(bindingByTargetKey['ethereum/go-ethereum@master:params/config.go'])
)

export const fetchExecutionSpecsMainnetUpgradeMarkdown = ({
	filename,
}: {
	filename: string
}) => {
	if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*\.md$/.test(filename))
		throw new Error('EthereumSpecs_Github: invalid mainnet upgrade Markdown filename')

	return getText(
		bindingByTargetKey['ethereum/execution-specs@8dbde99b65d519ea4c96084d784f85957e9314d0:network-upgrades/mainnet-upgrades'],
		filename
	)
}
