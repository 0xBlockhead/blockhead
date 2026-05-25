import type { JsonObject } from '$/typescript/JsonValue.ts'

export type BlobscanTransactionBlob = {
	versionedHash?: string
}

export type BlobscanTransaction = {
	blobs?: BlobscanTransactionBlob[]
}

export type BlobscanBlobDetail = JsonObject
