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

export type SuperchainNetwork = {
	chainId: number
	name: string
	identifier: string
	namespace: string
	slug: string
	parentChainId?: number
	parentType?: string
}
