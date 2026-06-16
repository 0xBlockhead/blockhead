// Types
import { ChainId } from '$/constants/ChainId.ts'
import { ConsensusProtocol } from '$/schema/NetworkUpgradeProtocols.ts'


// Constants
export const slotsPerEpoch = 32

/** Execution L1 networks with a paired beacon (consensus) REST API — not L2 rollups or execution-only chains. */
export const beaconRestBases = [
	{
		chainId: ChainId.Ethereum,
		restBaseUrl: 'https://ethereum-beacon-api.publicnode.com',
		consensusProtocol: ConsensusProtocol.EthereumBeacon,
	},
	{
		chainId: ChainId.EthereumSepolia,
		restBaseUrl: 'https://ethereum-sepolia-beacon-api.publicnode.com',
		consensusProtocol: ConsensusProtocol.EthereumBeacon,
	},
	{
		/** Holesky execution L1 (EIP-6969). */
		chainId: 17_000,
		restBaseUrl: 'https://ethereum-holesky-beacon-api.publicnode.com',
		consensusProtocol: ConsensusProtocol.EthereumBeacon,
	},
] as const satisfies readonly {
	chainId: number
	restBaseUrl: string
	consensusProtocol: ConsensusProtocol
}[]


// Lookups

export const beaconRestBaseByExecutionChainId = Object.fromEntries(
	beaconRestBases.map((beaconRow) => [
		beaconRow.chainId,
		beaconRow,
	])
)
