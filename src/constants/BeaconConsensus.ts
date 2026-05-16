// Types
import { ChainId } from '$/constants/ChainId.ts'


// Constants
export const slotsPerEpoch = 32

/** Consensus (beacon) layer rows: execution `chainId` → beacon REST `/eth/v1/…` (browser: `proxyFetch` + hooks allow-list). */
export const beaconRestBases = [
	{
		chainId: ChainId.Ethereum,
		restBaseUrl: 'https://ethereum-beacon-api.publicnode.com',
	},
	{
		chainId: ChainId.EthereumSepolia,
		restBaseUrl: 'https://ethereum-sepolia-beacon-api.publicnode.com',
	},
	{
		/** Holesky execution L1 (EIP-6969). */
		chainId: 17_000,
		restBaseUrl: 'https://ethereum-holesky-beacon-api.publicnode.com',
	},
] as const satisfies readonly {
	chainId: number
	restBaseUrl: string
}[]


// Lookups
export const beaconRestBaseByExecutionChainId: Readonly<Record<number, string>> = Object.fromEntries(
	beaconRestBases.map((row) => [
		row.chainId,
		row.restBaseUrl,
	]),
)
