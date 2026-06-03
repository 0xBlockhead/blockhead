import type { JsonObject } from '$/typescript/JsonValue.ts'

export type BlobscanTransactionBlob = {
	versionedHash?: string
}

export type BlobscanTransaction = {
	blobs?: BlobscanTransactionBlob[]
}

export type BlobscanBlobDataStorageReference = {
	storage?: string
	reference?: string
}

export type BlobscanBlobDetail = JsonObject & {
	blob?: {
	versionedHash?: string
		commitment?: string
}
	blobDataStorage?: BlobscanBlobDataStorageReference[]
}
