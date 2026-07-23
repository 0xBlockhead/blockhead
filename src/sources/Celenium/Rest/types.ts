export type CeleniumHead = {
	chainId: string
	latestHeight: bigint
	latestHash: string
	latestTime: string
	totalTransactions: bigint
	totalAccounts: bigint
	totalFeeUtia: bigint
	totalBlobBytes: bigint
	totalSupplyUtia: bigint
	synced: boolean
}

export type CeleniumBlock = {
	height: bigint
	hash: string
	parentHash: string
	appHash: string
	dataHash: string
	proposerAddress: string
	time: string
	transactionCount: bigint
	blobCount: bigint
	blobBytes: bigint
	feeUtia: bigint
	bytesInBlock: bigint
}

export type CeleniumNamespace = {
	namespaceId: string
	namespaceHash: string
	version: number
	sizeBytes: bigint
	blobCount: bigint
	lastHeight: bigint
	name?: string
	reserved: boolean
}

export type CeleniumBlobMetadata = {
	namespaceHash: string
	height: bigint
	commitment: string
	sizeBytes: bigint
	shareVersion: number
	time: string
	contentType: string
	transactionHash: string
	signer: string
}

export type CeleniumAddress = {
	address: string
	firstHeight: bigint
	lastHeight: bigint
	currency: string
	spendableAmount: bigint
	delegatedAmount: bigint
	unbondingAmount: bigint
}

export type CeleniumTransaction = {
	hash: string
	height: bigint
	position: bigint
	gasWanted: bigint
	gasUsed: bigint
	feeUtia: bigint
	time: string
	status: string
	signers: string[]
	messageTypes: string[]
}
