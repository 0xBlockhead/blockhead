import { throwHttpError } from '$/lib/http.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/Blobscan/bindings.ts'
import type {
	BlobscanBlobDetail,
	BlobscanBlobList,
	BlobscanTransaction,
} from '$/sources/Blobscan/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const bindingByChainId = Object.fromEntries(
	bindings[Source.Blobscan_Rest].map((binding) => [binding.target.key, binding])
)

const bindingForChain = (chainId: string) => {
	const binding = bindingByChainId[chainId]
	if (binding == null)
		throw new Error(`Blobscan_Rest: no binding for chain ${chainId}`)

	return binding
}

const getOptional = async <_Response>(
	binding: (typeof bindings[Source.Blobscan_Rest])[number],
	url: string
) => {
	const response = await sourceFetch(binding, url)
	if (response.status === 404)
		return undefined
	if (!response.ok)
		await throwHttpError('Blobscan_Rest', response)

	return response.json<_Response>()
}

const getRequired = async <_Response>(
	binding: (typeof bindings[Source.Blobscan_Rest])[number],
	url: string
) => {
	const response = await sourceFetch(binding, url)
	if (!response.ok)
		await throwHttpError('Blobscan_Rest', response)

	return response.json<_Response>()
}

export const getTransaction = async (
	chainId: string,
	{
		txHash,
	}: {
		txHash: string
	}
) => {
	const binding = bindingForChain(chainId)
	return getOptional<BlobscanTransaction>(
		binding,
		httpUrl(binding, `/transactions/${encodeURIComponent(txHash)}`)
	)
}

export const getBlob = async (
	chainId: string,
	{
		versionedHash,
	}: {
		versionedHash: string
	}
) => {
	const binding = bindingForChain(chainId)
	return getOptional<BlobscanBlobDetail>(
		binding,
		httpUrl(binding, `/blobs/${encodeURIComponent(versionedHash)}`)
	)
}

export const listBlobs = async (
	chainId: string,
	{
		limit,
		offset = 0,
	}: {
		limit: number
		offset?: number
	}
) => {
	const binding = bindingForChain(chainId)
	const pageSize = Math.max(1, limit)
	const page = Math.floor(Math.max(0, offset) / pageSize) + 1
	const body = await getRequired<BlobscanBlobList>(
		binding,
		httpUrl(binding, '/blobs', {
			ps: pageSize,
			p: page,
		})
	)

	return body.blobs ?? []
}

export const getBlobDetail = async (
	chainId: string,
	{
		txHash,
		blobIndex,
	}: {
		txHash: string
		blobIndex: number
	}
) => {
	const transaction = await getTransaction(chainId, {
		txHash,
	})
	if (transaction == null)
		return undefined

	const row = transaction.blobs?.[blobIndex]
	if (row == null)
		throw new Error(`Blobscan_Rest: blob index ${blobIndex} missing on transaction ${txHash}`)

	const versionedHash = row.versionedHash
	if (versionedHash == null || versionedHash === '')
		throw new Error(`Blobscan_Rest: blob versioned hash missing at index ${blobIndex}`)

	return getBlob(chainId, {
		versionedHash,
	})
}
