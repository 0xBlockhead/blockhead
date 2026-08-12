/**
 * Blobscan REST reads for blobs, blob transactions, and blob-carrying blocks.
 * @see https://docs.blobscan.com/docs/api
 * @see https://api.blobscan.com (Swagger UI)
 */
import { throwHttpError } from '$/lib/http.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/Blobscan/bindings.ts'
import {
	blobscanRestHostByChainId,
	blobscanRestPageSizeMax,
} from '$/sources/Blobscan/Rest/constants.ts'
import {
	blobscanBlobDetailEnvelope,
	blobscanBlobListEnvelope,
	blobscanBlockDetailEnvelope,
	blobscanBlockListEnvelope,
	blobscanTransactionEnvelope,
	type BlobscanBlobDetail,
	type BlobscanBlobList,
	type BlobscanBlobListItem,
	type BlobscanBlockDetail,
	type BlobscanBlockList,
	type BlobscanBlockListItem,
	type BlobscanTransaction,
} from '$/sources/Blobscan/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const bindingByChainId = Object.fromEntries(
	bindings[Source.Blobscan_Rest].map((binding) => [
		binding.target.key,
		binding,
	])
)

const bytes32HexPattern = /^0x[0-9a-fA-F]{64}$/
const addressHexPattern = /^0x[0-9a-fA-F]{40}$/
const blobVersionedHashPattern = /^0x01[0-9a-fA-F]{62}$/

const bindingForChain = (chainId: string) => {
	const binding = bindingByChainId[chainId]
	if (binding == null)
		throw new Error(`Blobscan_Rest: no binding for chain ${chainId}`)
	if (blobscanRestHostByChainId[Number(chainId)] == null)
		throw new Error(`Blobscan_Rest: no REST host catalog row for chain ${chainId}`)

	return binding
}

const assertEnvelope = (
	envelope: {
		assert: (value: unknown) => unknown
	},
	value: unknown,
	label: string
) => {
	try {
		envelope.assert(value)
	} catch {
		throw new Error(`Blobscan_Rest: invalid ${label} response envelope`)
	}
}

const assertBytes32Hex = (
	value: string,
	label: string
) => {
	if (!bytes32HexPattern.test(value))
		throw new Error(`Blobscan_Rest: invalid ${label}`)
}

const assertAddressHex = (
	value: string,
	label: string
) => {
	if (!addressHexPattern.test(value))
		throw new Error(`Blobscan_Rest: invalid ${label}`)
}

const assertBlobVersionedHash = (
	value: string,
	label: string
) => {
	if (!blobVersionedHashPattern.test(value))
		throw new Error(`Blobscan_Rest: invalid ${label}`)
}

const assertSafeNonnegativeInteger = (
	value: number,
	label: string
) => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`Blobscan_Rest: invalid ${label}`)
}

const assertSafePositiveInteger = (
	value: number,
	label: string
) => {
	if (!Number.isSafeInteger(value) || value < 1)
		throw new Error(`Blobscan_Rest: invalid ${label}`)
}

const assertPageSize = (
	pageSize: number
) => {
	if (!Number.isSafeInteger(pageSize) || pageSize < 1 || pageSize > blobscanRestPageSizeMax)
		throw new Error(`Blobscan_Rest: page size must be between 1 and ${blobscanRestPageSizeMax}`)
}

const assertTransaction = (
	transaction: BlobscanTransaction,
	txHash?: string
) => {
	assertEnvelope(blobscanTransactionEnvelope, transaction, 'transaction')
	assertBytes32Hex(transaction.hash, 'transaction hash')
	assertSafePositiveInteger(transaction.blockNumber, 'transaction block number')
	if (txHash != null && transaction.hash.toLowerCase() !== txHash.toLowerCase())
		throw new Error(`Blobscan_Rest: mismatched transaction hash ${transaction.hash}`)
	if (transaction.from != null)
		assertAddressHex(transaction.from, 'transaction from')
	if (transaction.to != null)
		assertAddressHex(transaction.to, 'transaction to')
	if (transaction.index != null)
		assertSafeNonnegativeInteger(transaction.index, 'transaction index')
	if (transaction.blobs.length === 0)
		throw new Error('Blobscan_Rest: transaction missing blobs')
	for (const blob of transaction.blobs)
		assertBlobVersionedHash(blob.versionedHash, 'transaction blob versioned hash')
}

const assertBlobDetail = (
	blob: BlobscanBlobDetail,
	versionedHash?: string
) => {
	assertEnvelope(blobscanBlobDetailEnvelope, blob, 'blob detail')
	assertBlobVersionedHash(blob.versionedHash, 'blob versioned hash')
	if (blob.commitment === '')
		throw new Error('Blobscan_Rest: blob missing commitment')
	if (versionedHash != null && blob.versionedHash.toLowerCase() !== versionedHash.toLowerCase())
		throw new Error(`Blobscan_Rest: mismatched blob versioned hash ${blob.versionedHash}`)
	if (blob.txHash != null)
		assertBytes32Hex(blob.txHash, 'blob transaction hash')
	if (blob.blockNumber != null)
		assertSafePositiveInteger(blob.blockNumber, 'blob block number')
	if (blob.index != null)
		assertSafeNonnegativeInteger(blob.index, 'blob index')
}

const assertBlobListItem = (
	blob: BlobscanBlobListItem
) => {
	assertBlobVersionedHash(blob.versionedHash, 'blob list versioned hash')
	if (blob.txHash != null)
		assertBytes32Hex(blob.txHash, 'blob list transaction hash')
	if (blob.blockHash != null)
		assertBytes32Hex(blob.blockHash, 'blob list block hash')
	if (blob.blockNumber != null)
		assertSafePositiveInteger(blob.blockNumber, 'blob list block number')
	if (blob.index != null)
		assertSafeNonnegativeInteger(blob.index, 'blob list index')
}

const assertBlockTransactions = (
	transactions: BlobscanBlockDetail['transactions']
) => {
	const transactionHashes = new Set<string>()
	for (const transaction of transactions) {
		assertBytes32Hex(transaction.hash, 'block transaction hash')
		const transactionHash = transaction.hash.toLowerCase()
		if (transactionHashes.has(transactionHash))
			throw new Error('Blobscan_Rest: block contains duplicate transaction identity')
		transactionHashes.add(transactionHash)
		for (const blob of transaction.blobs)
			assertBlobVersionedHash(blob.versionedHash, 'block blob versioned hash')
	}
}

const assertBlockDetail = (
	block: BlobscanBlockDetail,
	blockId?: number | string
) => {
	assertEnvelope(blobscanBlockDetailEnvelope, block, 'block detail')
	assertBytes32Hex(block.hash, 'block hash')
	assertSafePositiveInteger(block.number, 'block number')
	if (block.timestamp === '' || !Number.isFinite(Date.parse(block.timestamp)))
		throw new Error(`Blobscan_Rest: invalid block timestamp ${block.timestamp}`)
	if (
		blockId != null
		&& (
			typeof blockId === 'number' ?
				block.number !== blockId
			:
				block.hash.toLowerCase() !== blockId.toLowerCase()
					&& String(block.number) !== blockId
		)
	)
		throw new Error(`Blobscan_Rest: mismatched block identity ${block.hash}`)
	assertBlockTransactions(block.transactions)
}

const assertBlockListItem = (
	block: BlobscanBlockListItem
) => {
	assertBytes32Hex(block.hash, 'block list hash')
	assertSafePositiveInteger(block.number, 'block list number')
	if (block.timestamp === '' || !Number.isFinite(Date.parse(block.timestamp)))
		throw new Error(`Blobscan_Rest: invalid block list timestamp ${block.timestamp}`)
	if (block.transactions != null)
		assertBlockTransactions(block.transactions)
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

const listPageParams = ({
	limit,
	offset = 0,
}: {
	limit: number
	offset?: number
}) => {
	assertPageSize(limit)
	assertSafeNonnegativeInteger(offset, 'page offset')
	return {
		ps: limit,
		p: Math.floor(offset / limit) + 1,
	}
}

export const getTransaction = async (
	chainId: string,
	{
		txHash,
	}: {
		txHash: string
	}
) => {
	assertBytes32Hex(txHash, 'transaction hash')
	const binding = bindingForChain(chainId)
	const transaction = await getOptional<BlobscanTransaction>(
		binding,
		httpUrl(binding, `/transactions/${encodeURIComponent(txHash)}`)
	)
	if (transaction == null)
		return undefined

	assertTransaction(transaction, txHash)
	return transaction
}

export const getBlob = async (
	chainId: string,
	{
		versionedHash,
	}: {
		versionedHash: string
	}
) => {
	assertBlobVersionedHash(versionedHash, 'blob versioned hash')
	const binding = bindingForChain(chainId)
	const blob = await getOptional<BlobscanBlobDetail>(
		binding,
		httpUrl(binding, `/blobs/${encodeURIComponent(versionedHash)}`)
	)
	if (blob == null)
		return undefined

	assertBlobDetail(blob, versionedHash)
	return blob
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
	const body = await getRequired<BlobscanBlobList>(
		binding,
		httpUrl(binding, '/blobs', listPageParams({
			limit,
			offset,
		}))
	)
	assertEnvelope(blobscanBlobListEnvelope, body, 'blob list')
	if (body.blobs.length > limit)
		throw new Error('Blobscan_Rest: blob list exceeds requested page size')
	for (const blob of body.blobs)
		assertBlobListItem(blob)
	return body.blobs
}

export const getBlock = async (
	chainId: string,
	{
		blockId,
	}: {
		blockId: string | number
	}
) => {
	if (typeof blockId === 'number')
		assertSafePositiveInteger(blockId, 'block number')
	else if (bytes32HexPattern.test(blockId))
		assertBytes32Hex(blockId, 'block hash')
	else if (!/^(?:0|[1-9]\d*)$/.test(blockId) || !Number.isSafeInteger(Number(blockId)) || Number(blockId) < 1)
		throw new Error(`Blobscan_Rest: invalid block id ${blockId}`)

	const binding = bindingForChain(chainId)
	const block = await getOptional<BlobscanBlockDetail>(
		binding,
		httpUrl(binding, `/blocks/${encodeURIComponent(String(blockId))}`)
	)
	if (block == null)
		return undefined

	assertBlockDetail(block, blockId)
	return block
}

export const listBlocks = async (
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
	const body = await getRequired<BlobscanBlockList>(
		binding,
		httpUrl(binding, '/blocks', listPageParams({
			limit,
			offset,
		}))
	)
	assertEnvelope(blobscanBlockListEnvelope, body, 'block list')
	if (body.blocks.length > limit)
		throw new Error('Blobscan_Rest: block list exceeds requested page size')
	const blockHashes = new Set<string>()
	const blockNumbers = new Set<number>()
	for (const block of body.blocks) {
		assertBlockListItem(block)
		const blockHash = block.hash.toLowerCase()
		if (blockHashes.has(blockHash) || blockNumbers.has(block.number))
			throw new Error('Blobscan_Rest: block list contains duplicate identity')
		blockHashes.add(blockHash)
		blockNumbers.add(block.number)
	}
	return body.blocks
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
	assertSafeNonnegativeInteger(blobIndex, 'blob index')
	const transaction = await getTransaction(chainId, {
		txHash,
	})
	if (transaction == null)
		return undefined

	const row = transaction.blobs[blobIndex]
	// oxlint-disable-next-line typescript/no-unnecessary-condition -- Numeric indexes can exceed the validated nonempty wire array at runtime.
	if (row == null)
		throw new Error(`Blobscan_Rest: blob index ${blobIndex} missing on transaction ${txHash}`)

	const blob = await getBlob(chainId, {
		versionedHash: row.versionedHash,
	})
	if (blob == null)
		throw new Error(`Blobscan_Rest: blob ${row.versionedHash} missing for transaction ${txHash}`)
	if (blob.txHash != null && blob.txHash.toLowerCase() !== transaction.hash.toLowerCase())
		throw new Error(`Blobscan_Rest: blob ${row.versionedHash} belongs to another transaction`)
	if (blob.blockNumber != null && blob.blockNumber !== transaction.blockNumber)
		throw new Error(`Blobscan_Rest: blob ${row.versionedHash} belongs to another block`)
	if (blob.index != null && blob.index !== blobIndex)
		throw new Error(`Blobscan_Rest: blob ${row.versionedHash} has mismatched transaction index`)

	return {
		...blob,
		txHash: transaction.hash,
		blockNumber: transaction.blockNumber,
		index: blobIndex,
	}
}
