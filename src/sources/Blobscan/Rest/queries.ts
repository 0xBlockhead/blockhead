import { getJson } from '$/lib/http.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import {
	blobscanRestApiOriginForChainId,
	blobscanRestOrigins,
} from '$/sources/Blobscan/Rest/constants.ts'


import type { JsonObject } from '$/typescript/JsonValue.ts'


type BlobscanTransactionBlobRow = {
	versionedHash?: string
}


type BlobscanTransactionWire = {
	blobs?: BlobscanTransactionBlobRow[]
}


type BlobscanBlobDetailWire = JsonObject


const getBlobscanBlobJsonStringInner = async ({
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
	let tx: BlobscanTransactionWire
	try {
		tx = await getJson<BlobscanTransactionWire>(
			txUrl,
			{ origins: blobscanRestOrigins },
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
	let detail: BlobscanBlobDetailWire
	try {
		detail = await getJson<BlobscanBlobDetailWire>(
			blobUrl,
			{ origins: blobscanRestOrigins },
		)
	}
	catch {
		return undefined
	}

	return JSON.stringify(detail)
}


export const getBlobscanBlobJsonString = singleFlight(getBlobscanBlobJsonStringInner)
