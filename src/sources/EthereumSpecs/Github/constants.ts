/** Raw GitHub content for Ethereum consensus + client fork metadata. */
import { rawOrigin } from '$/sources/Github/Rest/constants.ts'

export { rawOrigin as ethereumSpecsGithubRawOrigin }

export const consensusSpecsConfigsRef = 'master'

export const goEthereumParamsRef = 'master'

export const executionSpecsLegacyUpgradeTreeRef = '8dbde99b132ff8d8fcc9cfb015a9947ccc8b12d6'

/** Consensus layer fork activation epochs + versions (`ethereum/consensus-specs`). */
export const consensusMainnetYamlUrl = (
	`${rawOrigin}/ethereum/consensus-specs/${consensusSpecsConfigsRef}/configs/mainnet.yaml`
)

export const consensusSepoliaYamlUrl = (
	`${rawOrigin}/ethereum/consensus-specs/${consensusSpecsConfigsRef}/configs/sepolia.yaml`
)

export const consensusHoleskyYamlUrl = (
	`${rawOrigin}/ethereum/consensus-specs/${consensusSpecsConfigsRef}/configs/holesky.yaml`
)

/** Execution layer client fork schedule (`ethereum/go-ethereum`). */
export const goEthereumParamsConfigGoUrl = (
	`${rawOrigin}/ethereum/go-ethereum/${goEthereumParamsRef}/params/config.go`
)

/**
 * Historical EL network upgrade specs (folder since removed on default branch; pin is content-addressed).
 * @see https://github.com/ethereum/execution-specs
 */
export const executionSpecsMainnetUpgradeMarkdownUrl = (
	filename: string,
) => (
	`${rawOrigin}/ethereum/execution-specs/${executionSpecsLegacyUpgradeTreeRef}/network-upgrades/mainnet-upgrades/${filename}`
)
