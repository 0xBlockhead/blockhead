export type SuperchainParent = {
	type: string
	chain: string
}

export type SuperchainChainListEntry = {
	name: string
	identifier: string
	chainId: number
	parent?: SuperchainParent
}
