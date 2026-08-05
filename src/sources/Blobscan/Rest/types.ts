import { type as arktype } from 'arktype'

const blobDataStorageReferenceEnvelope = arktype({
	storage: 'string',
	'reference?': 'string',
	'url?': 'string',
})

const transactionBlobEnvelope = arktype({
	versionedHash: 'string',
	'dataStorageReferences?': blobDataStorageReferenceEnvelope.array(),
})

export const blobscanTransactionEnvelope = arktype({
	hash: 'string',
	blockNumber: 'number',
	blobs: transactionBlobEnvelope.array(),
})

export const blobscanBlobDetailEnvelope = arktype({
	versionedHash: 'string',
	commitment: 'string',
	'size?': 'number',
	'usageSize?': 'number',
	'blockNumber?': 'number',
	'txHash?': 'string',
	'index?': 'number',
	'dataStorageReferences?': blobDataStorageReferenceEnvelope.array(),
	'transactions?': arktype({
		txHash: 'string',
		'index?': 'number',
		'blockNumber?': 'number',
	}).array(),
})

export const blobscanBlobListItemEnvelope = arktype({
	versionedHash: 'string',
	'txHash?': 'string',
	'index?': 'number',
	'blockNumber?': 'number',
	'blockHash?': 'string',
	'commitment?': 'string',
	'size?': 'number',
	'usageSize?': 'number',
	'txIndex?': 'number',
	'dataStorageReferences?': blobDataStorageReferenceEnvelope.array(),
})

export const blobscanBlobListEnvelope = arktype({
	blobs: blobscanBlobListItemEnvelope.array(),
})

const blockTransactionEnvelope = arktype({
	hash: 'string',
	blobs: transactionBlobEnvelope.array(),
})

export const blobscanBlockDetailEnvelope = arktype({
	hash: 'string',
	number: 'number',
	timestamp: 'string',
	'slot?': 'number',
	'epoch?': 'number',
	'blobGasUsed?': 'string',
	'excessBlobGas?': 'string',
	'blobGasPrice?': 'string',
	transactions: blockTransactionEnvelope.array(),
})

export const blobscanBlockListItemEnvelope = arktype({
	hash: 'string',
	number: 'number',
	timestamp: 'string',
	'slot?': 'number',
	'epoch?': 'number',
	'blobGasUsed?': 'string',
	'excessBlobGas?': 'string',
	'blobGasPrice?': 'string',
	'transactions?': blockTransactionEnvelope.array(),
})

export const blobscanBlockListEnvelope = arktype({
	blocks: blobscanBlockListItemEnvelope.array(),
})

export type BlobscanBlobDataStorageReference = typeof blobDataStorageReferenceEnvelope.infer
export type BlobscanTransactionBlob = typeof transactionBlobEnvelope.infer
export type BlobscanTransaction = typeof blobscanTransactionEnvelope.infer
export type BlobscanBlobDetail = typeof blobscanBlobDetailEnvelope.infer
export type BlobscanBlobListItem = typeof blobscanBlobListItemEnvelope.infer
export type BlobscanBlobList = typeof blobscanBlobListEnvelope.infer
export type BlobscanBlockDetail = typeof blobscanBlockDetailEnvelope.infer
export type BlobscanBlockListItem = typeof blobscanBlockListItemEnvelope.infer
export type BlobscanBlockList = typeof blobscanBlockListEnvelope.infer
