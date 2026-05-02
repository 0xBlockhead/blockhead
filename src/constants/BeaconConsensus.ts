/**
 * Consensus (beacon) layer pairing with execution `chainId` — REST bases for standard beacon-API
 * and beaconcha.in explorer links (informed by ethglobal consensus-networks + public beacon endpoints).
 */

import { ChainId } from '$/constants/ChainId.ts'

export const slotsPerEpoch = 32

/** Beacon node REST (`/eth/v1/...`); browser uses `proxyFetch` + hooks allow-list. */
export const beaconRestBaseByExecutionChainId: Readonly<Record<number, string>> = {
	[ChainId.Ethereum]: 'https://ethereum-beacon-api.publicnode.com',
	[ChainId.EthereumSepolia]: 'https://ethereum-sepolia-beacon-api.publicnode.com',
	/** Holesky execution L1 (EIP-6969). */
	17000: 'https://ethereum-holesky-beacon-api.publicnode.com',
}

const beaconChaInOriginByExecutionChainId: Readonly<Record<number, string>> = {
	[ChainId.Ethereum]: 'https://beaconcha.in',
	[ChainId.EthereumSepolia]: 'https://sepolia.beaconcha.in',
	17000: 'https://holesky.beaconcha.in',
}

export const hasBeaconDataForChainId = (chainId: number): boolean => (
	beaconRestBaseByExecutionChainId[chainId] != null
)

export const beaconChaInEpochUrl = (chainId: number, epoch: number): string | undefined => {
	const o = beaconChaInOriginByExecutionChainId[chainId]
	return o == null ? undefined : `${o}/epoch/${String(epoch)}`
}

export const beaconChaInSlotUrl = (chainId: number, slot: number): string | undefined => {
	const o = beaconChaInOriginByExecutionChainId[chainId]
	return o == null ? undefined : `${o}/slot/${String(slot)}`
}
