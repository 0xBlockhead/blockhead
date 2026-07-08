import type { JsonObject } from '$/typescript/JsonValue.ts'

export type BlobscanTransactionBlob = {
	versionedHash?: string
	dataStorageReferences?: BlobscanBlobDataStorageReference[]
}

export type BlobscanTransaction = {
	blockNumber?: number
	blobs?: BlobscanTransactionBlob[]
}

export type BlobscanBlobDataStorageReference = {
	storage?: string
	reference?: string
	url?: string
}

export type BlobscanBlobDetail = JsonObject & {
	versionedHash?: string
	commitment?: string
	dataStorageReferences?: BlobscanBlobDataStorageReference[]
}
