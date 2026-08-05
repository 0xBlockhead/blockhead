export type BalancerPoolTokenWire = {
	address: string
	symbol: string
	balance: string
	decimals: number
	weight: string | null
}

export type BalancerPoolDynamicDataWire = {
	totalLiquidity: string
	totalShares: string
	swapFee: string
}

export type BalancerPoolWire = {
	id: string
	address: string
	name: string
	type: string
	version: number
	protocolVersion: number
	chain: string
	poolTokens: BalancerPoolTokenWire[]
	dynamicData: BalancerPoolDynamicDataWire
}

export type BalancerPoolData = {
	poolGetPool?: BalancerPoolWire | null
}

export type BalancerPoolsData = {
	poolGetPools?: BalancerPoolWire[]
}

export type BalancerPool = {
	id: `0x${string}`
	address: `0x${string}`
	name: string
	type: string
	version: number
	protocolVersion: number
	chainId: number
	vaultAddress: `0x${string}`
	swapFee: string
	totalLiquidity: string
	totalShares: string
	poolTokens: {
		address: `0x${string}`
		symbol: string
		balance: string
		decimals: number
		weight?: string
	}[]
}
