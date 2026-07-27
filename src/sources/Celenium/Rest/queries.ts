import { type as arktype } from 'arktype'

import { sourceGetJson } from '$/sources/_runtime/http.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'
import type {
	CeleniumAddress,
	CeleniumBlobMetadata,
	CeleniumBlock,
	CeleniumHead,
	CeleniumNamespace,
	CeleniumTransaction,
} from '$/sources/Celenium/Rest/types.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const celeniumHash = /^[0-9a-fA-F]{64}$/
const celeniumAddress = /^celestia1[02-9ac-hj-np-z]{38}$/
const namespaceIdPattern = /^[0-9a-fA-F]{56}$/
const namespaceHashPattern = /^[A-Za-z0-9+/]{39}=$/
const commitmentPattern = /^[A-Za-z0-9+/]{43}=$/
const unsignedDecimal = /^(0|[1-9][0-9]*)$/

const headWire = arktype({
	chain_id: 'string',
	last_height: 'number.integer >= 0',
	hash: 'string',
	last_time: 'string',
	total_tx: 'number.integer >= 0',
	total_accounts: 'number.integer >= 0',
	total_fee: 'string',
	total_blobs_size: 'number.integer >= 0',
	total_supply: 'string',
	synced: 'boolean',
})

const blockWire = arktype({
	height: 'number.integer >= 0',
	hash: 'string',
	parent_hash: 'string',
	app_hash: 'string',
	data_hash: 'string',
	time: 'string',
	proposer: {
		cons_address: 'string',
	},
	stats: {
		tx_count: 'number.integer >= 0',
		blobs_count: 'number.integer >= 0',
		blobs_size: 'number.integer >= 0',
		fee: 'string',
		bytes_in_block: 'number.integer >= 0',
	},
})

const namespaceWire = arktype({
	size: 'number.integer >= 0',
	blobs_count: 'number.integer >= 0',
	version: 'number.integer >= 0',
	namespace_id: 'string',
	hash: 'string',
	last_height: 'number.integer >= 0',
	'name?': 'string',
	reserved: 'boolean',
})

const blobMetadataWire = arktype({
	commitment: 'string',
	size: 'number.integer >= 0',
	share_version: 'number.integer >= 0',
	height: 'number.integer >= 0',
	time: 'string',
	content_type: 'string',
	namespace: 'string',
	tx_hash: 'string',
	signer: {
		hash: 'string',
	},
})

const addressWire = arktype({
	first_height: 'number.integer >= 0',
	last_height: 'number.integer >= 0',
	hash: 'string',
	balance: {
		currency: 'string',
		spendable: 'string',
		delegated: 'string',
		unbonding: 'string',
	},
})

const transactionWire = arktype({
	height: 'number.integer >= 0',
	position: 'number.integer >= 0',
	gas_wanted: 'number.integer >= 0',
	gas_used: 'number.integer >= 0',
	hash: 'string',
	fee: 'string',
	time: 'string',
	status: 'string',
	signers: arktype({
		hash: 'string',
	}).array(),
	message_types: 'string[]',
})

const assertSafeInteger = (
	value: number,
	label: string
) => {
	if (!Number.isSafeInteger(value))
		throw new Error(`Celenium_Rest: ${label} exceeds lossless JSON integer range`)
}

const assertDecimal = (
	value: string,
	label: string
) => {
	if (!unsignedDecimal.test(value))
		throw new Error(`Celenium_Rest: invalid ${label}`)
}

const assertHash = (
	value: string,
	label: string
) => {
	if (!celeniumHash.test(value))
		throw new Error(`Celenium_Rest: invalid ${label}`)
}

const assertAddress = (value: string) => {
	if (!celeniumAddress.test(value))
		throw new Error('Celenium_Rest: invalid Celestia account address')
}

const assertPage = ({
	limit,
	offset,
}: {
	limit: number
	offset: number
}) => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100)
		throw new Error('Celenium_Rest: page limit must be from 1 through 100')
	if (!Number.isSafeInteger(offset) || offset < 0 || offset > 1_000_000)
		throw new Error('Celenium_Rest: page offset must be from 0 through 1000000')
}

export const query = (
	binding: SourceBinding,
	path: string
) => {
	return sourceGetJson<JsonValue>(binding, httpUrl(binding, path))
}

export const getHead = async (binding: SourceBinding): Promise<CeleniumHead> => {
	const wire = headWire.assert(await sourceGetJson<unknown>(
		binding,
		httpUrl(binding, '/v1/head')
	))
	for (const [value, label] of [
		[wire.last_height, 'head height'],
		[wire.total_tx, 'transaction count'],
		[wire.total_accounts, 'account count'],
		[wire.total_blobs_size, 'total blob bytes'],
	])
		assertSafeInteger(value, label)
	assertHash(wire.hash, 'head hash')
	assertDecimal(wire.total_fee, 'total fee')
	assertDecimal(wire.total_supply, 'total supply')
	if (wire.chain_id !== 'celestia')
		throw new Error('Celenium_Rest: foreign chain head')
	return {
		chainId: wire.chain_id,
		latestHeight: BigInt(wire.last_height),
		latestHash: wire.hash.toLowerCase(),
		latestTime: wire.last_time,
		totalTransactions: BigInt(wire.total_tx),
		totalAccounts: BigInt(wire.total_accounts),
		totalFeeUtia: BigInt(wire.total_fee),
		totalBlobBytes: BigInt(wire.total_blobs_size),
		totalSupplyUtia: BigInt(wire.total_supply),
		synced: wire.synced,
	}
}

const blockFromWire = (wire: typeof blockWire.infer): CeleniumBlock => {
	for (const [value, label] of [
		[wire.height, 'block height'],
		[wire.stats.tx_count, 'block transaction count'],
		[wire.stats.blobs_count, 'block blob count'],
		[wire.stats.blobs_size, 'block blob bytes'],
		[wire.stats.bytes_in_block, 'block bytes'],
	])
		assertSafeInteger(value, label)
	for (const [value, label] of [
		[wire.hash, 'block hash'],
		[wire.parent_hash, 'parent block hash'],
		[wire.app_hash, 'application hash'],
		[wire.data_hash, 'data hash'],
	])
		assertHash(value, label)
	if (!/^[0-9a-fA-F]{40}$/.test(wire.proposer.cons_address))
		throw new Error('Celenium_Rest: invalid block proposer address')
	assertDecimal(wire.stats.fee, 'block fee')
	return {
		height: BigInt(wire.height),
		hash: wire.hash.toLowerCase(),
		parentHash: wire.parent_hash.toLowerCase(),
		appHash: wire.app_hash.toLowerCase(),
		dataHash: wire.data_hash.toLowerCase(),
		proposerAddress: wire.proposer.cons_address.toLowerCase(),
		time: wire.time,
		transactionCount: BigInt(wire.stats.tx_count),
		blobCount: BigInt(wire.stats.blobs_count),
		blobBytes: BigInt(wire.stats.blobs_size),
		feeUtia: BigInt(wire.stats.fee),
		bytesInBlock: BigInt(wire.stats.bytes_in_block),
	}
}

export const getBlock = async (
	binding: SourceBinding,
	height: bigint
): Promise<CeleniumBlock> => {
	if (height < 1n)
		throw new Error('Celenium_Rest: block height must be positive')
	const block = blockFromWire(blockWire.assert(await sourceGetJson<unknown>(
		binding,
		httpUrl(binding, `/v1/block/${height}?stats=true`)
	)))
	if (block.height !== height)
		throw new Error('Celenium_Rest: block response has mismatched height')
	return block
}

export const listBlocks = async ({
	binding,
	limit,
	offset,
}: {
	binding: SourceBinding
	limit: number
	offset: number
}): Promise<CeleniumBlock[]> => {
	assertPage({
		limit,
		offset,
	})
	const wires = blockWire.array().assert(await sourceGetJson<unknown>(
		binding,
		httpUrl(binding, `/v1/block?limit=${limit}&offset=${offset}&sort=desc&stats=true`)
	))
	if (wires.length > limit)
		throw new Error('Celenium_Rest: block page exceeds requested limit')
	return wires.map(blockFromWire)
}

const namespaceFromWire = (wire: typeof namespaceWire.infer): CeleniumNamespace => {
	for (const [value, label] of [
		[wire.size, 'namespace bytes'],
		[wire.blobs_count, 'namespace blob count'],
		[wire.last_height, 'namespace last height'],
	])
		assertSafeInteger(value, label)
	if (wire.version > 255)
		throw new Error('Celenium_Rest: invalid namespace version')
	if (!namespaceIdPattern.test(wire.namespace_id))
		throw new Error('Celenium_Rest: invalid namespace ID')
	if (!namespaceHashPattern.test(wire.hash))
		throw new Error('Celenium_Rest: invalid namespace hash')
	return {
		namespaceId: wire.namespace_id.toLowerCase(),
		namespaceHash: wire.hash,
		version: wire.version,
		sizeBytes: BigInt(wire.size),
		blobCount: BigInt(wire.blobs_count),
		lastHeight: BigInt(wire.last_height),
		name: wire.name,
		reserved: wire.reserved,
	}
}

export const listNamespaces = async ({
	binding,
	limit,
	offset,
}: {
	binding: SourceBinding
	limit: number
	offset: number
}): Promise<CeleniumNamespace[]> => {
	assertPage({
		limit,
		offset,
	})
	const wires = namespaceWire.array().assert(await sourceGetJson<unknown>(
		binding,
		httpUrl(binding, `/v1/namespace?limit=${limit}&offset=${offset}`)
	))
	if (wires.length > limit)
		throw new Error('Celenium_Rest: namespace page exceeds requested limit')
	return wires.map(namespaceFromWire)
}

const blobMetadataFromWire = (wire: typeof blobMetadataWire.infer): CeleniumBlobMetadata => {
	assertSafeInteger(wire.height, 'blob height')
	assertSafeInteger(wire.size, 'blob bytes')
	if (wire.share_version > 255)
		throw new Error('Celenium_Rest: invalid blob share version')
	if (!namespaceHashPattern.test(wire.namespace))
		throw new Error('Celenium_Rest: invalid blob namespace hash')
	if (!commitmentPattern.test(wire.commitment))
		throw new Error('Celenium_Rest: invalid blob commitment')
	assertHash(wire.tx_hash, 'blob transaction hash')
	assertAddress(wire.signer.hash)
	return {
		namespaceHash: wire.namespace,
		height: BigInt(wire.height),
		commitment: wire.commitment,
		sizeBytes: BigInt(wire.size),
		shareVersion: wire.share_version,
		time: wire.time,
		contentType: wire.content_type,
		transactionHash: wire.tx_hash.toLowerCase(),
		signer: wire.signer.hash,
	}
}

export const listBlobMetadata = async ({
	binding,
	limit,
	offset,
}: {
	binding: SourceBinding
	limit: number
	offset: number
}): Promise<CeleniumBlobMetadata[]> => {
	assertPage({
		limit,
		offset,
	})
	const wires = blobMetadataWire.array().assert(await sourceGetJson<unknown>(
		binding,
		httpUrl(binding, `/v1/blob?limit=${limit}&offset=${offset}&sort=desc&joins=true`)
	))
	if (wires.length > limit)
		throw new Error('Celenium_Rest: blob page exceeds requested limit')
	return wires.map(blobMetadataFromWire)
}

export const getAddress = async (
	binding: SourceBinding,
	address: string
): Promise<CeleniumAddress> => {
	assertAddress(address)
	const wire = addressWire.assert(await sourceGetJson<unknown>(
		binding,
		httpUrl(binding, `/v1/address/${encodeURIComponent(address)}`)
	))
	if (wire.hash !== address)
		throw new Error('Celenium_Rest: address response has mismatched identity')
	assertSafeInteger(wire.first_height, 'address first height')
	assertSafeInteger(wire.last_height, 'address last height')
	for (const [value, label] of [
		[wire.balance.spendable, 'spendable balance'],
		[wire.balance.delegated, 'delegated balance'],
		[wire.balance.unbonding, 'unbonding balance'],
	])
		assertDecimal(value, label)
	return {
		address,
		firstHeight: BigInt(wire.first_height),
		lastHeight: BigInt(wire.last_height),
		currency: wire.balance.currency,
		spendableAmount: BigInt(wire.balance.spendable),
		delegatedAmount: BigInt(wire.balance.delegated),
		unbondingAmount: BigInt(wire.balance.unbonding),
	}
}

export const getTransaction = async (
	binding: SourceBinding,
	hash: string
): Promise<CeleniumTransaction> => {
	assertHash(hash, 'transaction hash')
	const wire = transactionWire.assert(await sourceGetJson<unknown>(
		binding,
		httpUrl(binding, `/v1/tx/${encodeURIComponent(hash)}`)
	))
	if (wire.hash.toLowerCase() !== hash.toLowerCase())
		throw new Error('Celenium_Rest: transaction response has mismatched identity')
	for (const [value, label] of [
		[wire.height, 'transaction height'],
		[wire.position, 'transaction position'],
		[wire.gas_wanted, 'transaction gas wanted'],
		[wire.gas_used, 'transaction gas used'],
	])
		assertSafeInteger(value, label)
	assertDecimal(wire.fee, 'transaction fee')
	for (const signer of wire.signers)
		assertAddress(signer.hash)
	return {
		hash: wire.hash.toLowerCase(),
		height: BigInt(wire.height),
		position: BigInt(wire.position),
		gasWanted: BigInt(wire.gas_wanted),
		gasUsed: BigInt(wire.gas_used),
		feeUtia: BigInt(wire.fee),
		time: wire.time,
		status: wire.status,
		signers: wire.signers.map((signer) => signer.hash),
		messageTypes: wire.message_types,
	}
}
