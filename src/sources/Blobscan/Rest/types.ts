export type BlobscanBlobDataStorageReference = {
	storage?: string
	reference?: string
	url?: string
}

export type BlobscanTransactionBlob = {
	versionedHash?: string
	dataStorageReferences?: BlobscanBlobDataStorageReference[]
}

export type BlobscanTransaction = {
	hash?: string
	blockNumber?: number
	blobs?: BlobscanTransactionBlob[]
}

export type BlobscanBlobDetail = {
	versionedHash?: string
	commitment?: string
	proof?: string
	size?: number
	usageSize?: number
	blockNumber?: number
	txHash?: string
	index?: number
	dataStorageReferences?: BlobscanBlobDataStorageReference[]
	transactions?: {
		txHash?: string
		index?: number
		blockNumber?: number
	}[]
}

export type BlobscanBlobListItem = {
	versionedHash?: string
	commitment?: string
	proof?: string
	size?: number
	usageSize?: number
	blockNumber?: number
	blockHash?: string
	txHash?: string
	txIndex?: number
	index?: number
	dataStorageReferences?: BlobscanBlobDataStorageReference[]
}

export type BlobscanBlobList = {
	blobs?: BlobscanBlobListItem[]
}
