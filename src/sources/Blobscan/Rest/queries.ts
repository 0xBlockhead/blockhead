import { sourceGetJson } from '$/sources/_runtime/http.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/Blobscan/bindings.ts'
import type {
	BlobscanBlobDetail,
	BlobscanTransaction,
	BlobscanTransactionBlob,
} from '$/sources/Blobscan/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const bindingByChainId = Object.fromEntries(
	bindings[Source.Blobscan_Rest].map((binding) => [binding.target.key, binding])
)

export const getTransaction = async (chainId: string, {
	txHash,
}: {
	txHash: string
}): Promise<BlobscanTransaction | undefined> => {
	const binding = bindingByChainId[chainId]
	if (binding == null)
		throw new Error(`Blobscan_Rest: no binding for chain ${chainId}`)

	try {
		return await sourceGetJson<BlobscanTransaction>(
			binding,
			httpUrl(binding, `/transactions/${encodeURIComponent(txHash)}`)
		)
	}
	catch {
		return undefined
	}
}

export const getBlobDetail = async (chainId: string, {
	txHash,
	blobIndex,
}: {
	txHash: string
	blobIndex: number
}): Promise<BlobscanBlobDetail | undefined> => {
	const binding = bindingByChainId[chainId]
	if (binding == null)
		throw new Error(`Blobscan_Rest: no binding for chain ${chainId}`)

	const blobs = (await getTransaction(chainId, {
		txHash,
	}))?.blobs
	if (!Array.isArray(blobs)) return undefined
	const row = blobs.at(blobIndex)
	if (row == null) return undefined
	const versionedHash = row.versionedHash
	if (versionedHash == null || versionedHash === '') return undefined

	let detail: BlobscanBlobDetail
	try {
		detail = await sourceGetJson<BlobscanBlobDetail>(
			binding,
			httpUrl(binding, `/blobs/${encodeURIComponent(versionedHash)}`)
		)
	}
	catch {
		return undefined
	}

	return detail
}

export const getTransactionBlob = async (chainId: string, {
	txHash,
	blobIndex,
}: {
	txHash: string
	blobIndex: number
}): Promise<BlobscanTransactionBlob | undefined> => {
	return (await getTransaction(chainId, {
		txHash,
	}))?.blobs?.[blobIndex]
}
