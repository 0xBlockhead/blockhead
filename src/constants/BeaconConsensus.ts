// Types
import { ChainId } from '$/constants/ChainId.ts'
import { ConsensusProtocol } from '$/schema/NetworkUpgradeProtocols.ts'


// Constants
export const slotsPerEpoch = 32

const ethereumBeaconConsensus = {
	consensusProtocol: ConsensusProtocol.EthereumBeacon,
	slotsPerEpoch,
} as const

/** Execution L1 networks using Ethereum beacon consensus — not L2 rollups or execution-only chains. */
export const beaconConsensusNetworks = [
	{
		chainId: ChainId.Ethereum,
		...ethereumBeaconConsensus,
	},
	{
		chainId: ChainId.EthereumSepolia,
		...ethereumBeaconConsensus,
	},
	{
		/** Holesky execution L1 (EIP-6969). */
		chainId: ChainId.Holesky,
		...ethereumBeaconConsensus,
	},
	{
		/** Hoodi execution L1 — staking / protocol testnet successor to Holesky. */
		chainId: ChainId.Hoodi,
		...ethereumBeaconConsensus,
	},
] as const satisfies readonly {
	chainId: number
	consensusProtocol: ConsensusProtocol
	slotsPerEpoch: number
}[]


// Lookups

export const beaconConsensusByExecutionChainId = Object.fromEntries(
	beaconConsensusNetworks.map((network) => [
		network.chainId,
		network,
	])
)
