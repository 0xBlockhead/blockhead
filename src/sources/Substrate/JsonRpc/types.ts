export type SubstrateRpcHeader = {
	parentHash: string
	number: string
	stateRoot: string
	extrinsicsRoot: string
}

export type SubstrateRpcBlock = {
	block: {
		header: SubstrateRpcHeader
		extrinsics: string[]
	}
}

export type SubstrateRuntimeVersion = {
	specName: string
	implName: string
	authoringVersion: number
	specVersion: number
	implVersion: number
	transactionVersion: number
	stateVersion: number
}

export type SubstrateSystemHealth = {
	peers: number
	isSyncing: boolean
	shouldHavePeers: boolean
}
