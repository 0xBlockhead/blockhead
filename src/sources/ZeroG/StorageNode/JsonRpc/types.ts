export type ZeroGStorageNodeNetworkProtocolVersion = {
	major: number
	minor: number
	build: number
}

export type ZeroGStorageNodeNetworkIdentity = {
	chainId: number
	flowAddress: string
	p2pProtocolVersion: ZeroGStorageNodeNetworkProtocolVersion
}

export type ZeroGStorageNodeStatus = {
	connectedPeers: number
	logSyncHeight: number
	logSyncBlock: string
	nextTxSeq: number
	networkIdentity: ZeroGStorageNodeNetworkIdentity
}

export type ZeroGStorageNodeTransaction = {
	streamIds: string[]
	data: string
	dataMerkleRoot: string
	startEntryIndex: number
	size: number
	seq: number
}

export type ZeroGStorageNodeFileInfo = {
	tx: ZeroGStorageNodeTransaction
	finalized: boolean
	isCached: boolean
	uploadedSegNum: number
	pruned: boolean
}

export type ZeroGStorageNodeFlowProof = {
	lemma: string[]
	path: boolean[]
}
