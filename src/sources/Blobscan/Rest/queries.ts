import { getJson } from '$/lib/http.ts'
import Blobscan from '$/sources/Blobscan/index.ts'
import { blobscanRestApiOriginForChainId } from '$/sources/Blobscan/Rest/constants.ts'


import type {
	BlobscanBlobDetail,
	BlobscanTransaction,
} from '$/sources/Blobscan/Rest/types.ts'


export const getBlobscanBlobJsonString = async ({
	chainId,
	txHash,
	blobIndex,
}: {
	chainId: number
	txHash: string
	blobIndex: number
}): Promise<string | undefined> => {
	const apiOrigin = blobscanRestApiOriginForChainId(chainId)
	if (apiOrigin == null) return undefined

	const txUrl = `${apiOrigin}/transactions/${encodeURIComponent(txHash)}`
	let tx: BlobscanTransaction
	try {
		tx = await getJson<BlobscanTransaction>(
			txUrl,
			{ origins: Blobscan.origins ?? [] },
		)
	}
	catch {
		return undefined
	}

	const blobs = tx.blobs
	if (!Array.isArray(blobs)) return undefined
	const row = blobs[blobIndex]
	const versionedHash = row?.versionedHash
	if (versionedHash == null || versionedHash === '') return undefined

	const blobUrl = `${apiOrigin}/blobs/${encodeURIComponent(versionedHash)}`
	let detail: BlobscanBlobDetail
	try {
		detail = await getJson<BlobscanBlobDetail>(
			blobUrl,
			{ origins: Blobscan.origins ?? [] },
		)
	}
	catch {
		return undefined
	}

	return JSON.stringify(detail)
}


