import { throwHttpError } from '$/lib/http.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/Blobscan/bindings.ts'
import type {
	BlobscanBlobDetail,
	BlobscanTransaction,
} from '$/sources/Blobscan/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const bindingByChainId = Object.fromEntries(
	bindings[Source.Blobscan_Rest].map((binding) => [binding.target.key, binding])
)

const getOptional = async <_Response>(binding: (typeof bindings[Source.Blobscan_Rest])[number], url: string) => {
	const response = await sourceFetch(binding, url)
	if (response.status === 404)
		return undefined
	if (!response.ok)
		await throwHttpError('Blobscan_Rest', response)

	return response.json<_Response>()
}

export const getTransaction = async (chainId: string, {
	txHash,
}: {
	txHash: string
}) => {
	const binding = bindingByChainId[chainId]
	if (binding == null)
		throw new Error(`Blobscan_Rest: no binding for chain ${chainId}`)

	return getOptional<BlobscanTransaction>(
		binding,
		httpUrl(binding, `/transactions/${encodeURIComponent(txHash)}`)
	)
}

export const getBlobDetail = async (chainId: string, {
	txHash,
	blobIndex,
}: {
	txHash: string
	blobIndex: number
}) => {
	const binding = bindingByChainId[chainId]
	if (binding == null)
		throw new Error(`Blobscan_Rest: no binding for chain ${chainId}`)

	const blobs = (await getTransaction(chainId, {
		txHash,
	}))?.blobs
	if (blobs == null) return undefined
	const row = blobs.at(blobIndex)
	if (row == null) return undefined
	const versionedHash = row.versionedHash
	if (versionedHash == null || versionedHash === '') return undefined

	return getOptional<BlobscanBlobDetail>(
		binding,
		httpUrl(binding, `/blobs/${encodeURIComponent(versionedHash)}`)
	)
}
