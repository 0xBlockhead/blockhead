import { getJson } from '$/lib/http.ts'
import {
	blobscanOrigins,
	blobscanRestApiOriginByChainId,
} from '$/sources/Blobscan/Rest/constants.ts'


import type {
	BlobscanBlobDetail,
	BlobscanTransaction,
	BlobscanTransactionBlob,
} from '$/sources/Blobscan/Rest/types.ts'


export const getTransaction = async ({
	chainId,
	txHash,
}: {
	chainId: number
	txHash: string
}): Promise<BlobscanTransaction | undefined> => {
	const apiOrigin = blobscanRestApiOriginByChainId[chainId]
	if (apiOrigin == null) return undefined

	const txUrl = `${apiOrigin}/transactions/${encodeURIComponent(txHash)}`
	try {
		return await getJson<BlobscanTransaction>(
			txUrl,
			{ origins: blobscanOrigins }
		)
	}
	catch {
		return undefined
	}
}

export const getBlobDetail = async ({
	chainId,
	txHash,
	blobIndex,
}: {
	chainId: number
	txHash: string
	blobIndex: number
}): Promise<BlobscanBlobDetail | undefined> => {
	const apiOrigin = blobscanRestApiOriginByChainId[chainId]
	if (apiOrigin == null) return undefined

	const blobs = (await getTransaction({
		chainId,
		txHash,
	}))?.blobs
	if (!Array.isArray(blobs)) return undefined
	const row = blobs.at(blobIndex)
	if (row == null) return undefined
	const versionedHash = row.versionedHash
	if (versionedHash == null || versionedHash === '') return undefined

	const blobUrl = `${apiOrigin}/blobs/${encodeURIComponent(versionedHash)}`
	let detail: BlobscanBlobDetail
	try {
		detail = await getJson<BlobscanBlobDetail>(
			blobUrl,
			{ origins: blobscanOrigins }
		)
	}
	catch {
		return undefined
	}

	return detail
}

export const getTransactionBlob = async ({
	chainId,
	txHash,
	blobIndex,
}: {
	chainId: number
	txHash: string
	blobIndex: number
}): Promise<BlobscanTransactionBlob | undefined> => {
	return (await getTransaction({
		chainId,
		txHash,
	}))?.blobs?.[blobIndex]
}
