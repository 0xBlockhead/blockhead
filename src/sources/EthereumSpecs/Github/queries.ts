/**
 * Raw upstream content for fork metadata (`ethereum/consensus-specs`, `ethereum/go-ethereum`,
 * pinned `ethereum/execution-specs` mainnet upgrade tree). OP Stack registry remains
 * `$/sources/Superchain/Github/queries.ts`.
 */
import { getText } from '$/lib/http.ts'
import { singleFlight } from '$/lib/singleFlight.ts'

import EthereumSpecs from '$/sources/EthereumSpecs/index.ts'

import {
	consensusHoleskyYamlUrl,
	consensusMainnetYamlUrl,
	consensusSepoliaYamlUrl,
	executionSpecsMainnetUpgradeMarkdownUrl,
	goEthereumParamsConfigGoUrl,
} from '$/sources/EthereumSpecs/Github/constants.ts'

import type { ConsensusSpecsNetworkPreset } from '$/sources/EthereumSpecs/Github/types.ts'

const consensusSpecsConfigYamlUrlByPreset = {
	mainnet: consensusMainnetYamlUrl,
	sepolia: consensusSepoliaYamlUrl,
	holesky: consensusHoleskyYamlUrl,
} as const satisfies Record<ConsensusSpecsNetworkPreset, string>

const fetchConsensusSpecsConfigYamlForPresetOnce = async ({
	preset,
}: {
	preset: ConsensusSpecsNetworkPreset
}) => (
	getText(
		consensusSpecsConfigYamlUrlByPreset[preset],
		{ origins: EthereumSpecs.origins },
	)
)

export const fetchConsensusSpecsConfigYaml = singleFlight(fetchConsensusSpecsConfigYamlForPresetOnce)

const fetchGoEthereumParamsConfigGoOnce = async () => (
	getText(
		goEthereumParamsConfigGoUrl,
		{ origins: EthereumSpecs.origins },
	)
)

export const fetchGoEthereumParamsConfigGo = singleFlight(fetchGoEthereumParamsConfigGoOnce)

const fetchExecutionSpecsMainnetUpgradeMarkdownOnce = async ({
	filename,
}: {
	filename: string
}) => (
	getText(
		executionSpecsMainnetUpgradeMarkdownUrl(filename),
		{ origins: EthereumSpecs.origins },
	)
)

export const fetchExecutionSpecsMainnetUpgradeMarkdown = singleFlight(
	fetchExecutionSpecsMainnetUpgradeMarkdownOnce,
)
