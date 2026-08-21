export type KaspaNodeBlockDagInfo = {
	blockCount: number
	headerCount?: number
	tipHashes: string[]
	difficulty: number
	pastMedianTime: number
	virtualParentHashes: string[]
	pruningPointHash: string
	virtualDaaScore: string
	virtualBlueScore?: string
	sink?: string
}

export type KaspaNodeServerInfo = {
	serverVersion: string
	isSynced: boolean
	networkId: string
	hasUtxoIndex: boolean
}

export type KaspaNodeUtxo = {
	outpoint: {
		transactionId: string
		index: number
	}
	utxoEntry: {
		amount: string
		scriptPublicKey: {
			scriptPublicKey: string
		}
		blockDaaScore: string
		isCoinbase: boolean
	}
}

export type KaspaNodeTransaction = {
	transactionId: string
	version: number
	inputs: unknown[]
	outputs: unknown[]
	lockTime?: string
	subnetworkId?: string
	gas?: string
	payload?: string
	mass?: string
	blockHash?: string
	blockTime?: number
}

export type KaspaNodeBlock = {
	header: {
		version: number
		timestamp: number
		bits: number
		nonce: string
		hashMerkleRoot: string
		acceptedIdMerkleRoot: string
		utxoCommitment: string
		daaScore: string
		blueScore: string
		hash: string
		parents: { parentHashes: string[] }[]
	}
	verboseData: {
		selectedParentHash: string
		mergeSetBluesHashes: string[]
		mergeSetRedsHashes: string[]
	}
	transactions: KaspaNodeTransaction[]
}

export type KaspaNodeVirtualChain = {
	removedChainBlockHashes: string[]
	addedChainBlockHashes: string[]
	acceptedTransactionIds: {
		acceptingBlockHash: string
		acceptedTransactionIds: string[]
	}[]
	minConfirmationCount?: number
	nextCheckpointHash?: string
}
