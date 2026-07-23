export type AvailNetworkIdentity = {
	chainName: string
	genesisHash: string
}

export type AvailHeader = {
	hash?: string
	parentHash: string
	blockNumber: bigint
	stateRoot: string
	extrinsicsRoot: string
	digestLogs: string[]
	finalized: boolean
}

export type AvailRuntimeVersion = {
	specName: string
	implName: string
	authoringVersion: bigint
	specVersion: bigint
	implVersion: bigint
	transactionVersion: bigint
	stateVersion: bigint
}
