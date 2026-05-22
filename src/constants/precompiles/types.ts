/** Per-chain EVM precompile entry (address + name). */
export type PrecompileEntry = {
	address: `0x${string}`
	name: string
}

export type ChainPrecompileSchedule = {
	chainId: number
	precompiles: PrecompileEntry[]
}
