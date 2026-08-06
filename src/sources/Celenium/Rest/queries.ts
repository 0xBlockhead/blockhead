import { type as arktype } from 'arktype'

import {
	sourceFetch,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/Celenium/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Celenium_Rest][0]
const celeniumHash = /^[0-9a-fA-F]{64}$/
const celeniumAddress = /^celestia1[02-9ac-hj-np-z]{38}$/
const namespaceIdPattern = /^[0-9a-fA-F]{56}$/
const namespaceHashPattern = /^[A-Za-z0-9+/]{39}=$/
const commitmentPattern = /^[A-Za-z0-9+/]{43}=$/
const unsignedDecimal = /^(0|[1-9][0-9]*)$/
const unsignedSafe = arktype(`number.integer >= 0 <= ${Number.MAX_SAFE_INTEGER}`)


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
	'total_namespaces?': 'number.integer >= 0',
}).onUndeclaredKey('delete')

const blockWire = arktype({
	height: 'number.integer >= 0',
	hash: 'string',
	parent_hash: 'string',
	app_hash: 'string',
	data_hash: 'string',
	time: 'string',
	proposer: arktype({
		cons_address: 'string',
	}).onUndeclaredKey('delete'),
	stats: arktype({
		tx_count: 'number.integer >= 0',
		blobs_count: 'number.integer >= 0',
		blobs_size: 'number.integer >= 0',
		fee: 'string',
		bytes_in_block: 'number.integer >= 0',
		'events_count?': 'number.integer >= 0',
		'gas_limit?': 'number.integer >= 0',
		'gas_used?': 'number.integer >= 0',
		'square_size?': 'number.integer >= 0',
		'block_time?': 'number.integer >= 0',
		'fill_rate?': 'string | number',
	}).onUndeclaredKey('delete'),
	'message_types?': 'string[]',
	'version_block?': 'number.integer >= 0',
	'version_app?': 'number.integer >= 0',
}).onUndeclaredKey('delete')

const namespaceWire = arktype({
	size: 'number.integer >= 0',
	blobs_count: 'number.integer >= 0',
	version: 'number.integer >= 0',
	namespace_id: 'string',
	hash: 'string',
	last_height: 'number.integer >= 0',
	'name?': 'string',
	reserved: 'boolean',
	'pfb_count?': 'number.integer >= 0',
	'last_message_time?': 'string',
}).onUndeclaredKey('delete')

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
}).onUndeclaredKey('delete')

const nestedNamespaceWire = arktype({
	version: 'number.integer >= 0',
	namespace_id: 'string',
	hash: 'string',
}).onUndeclaredKey('delete')

const blockBlobWire = arktype({
	commitment: 'string',
	size: 'number.integer >= 0',
	share_version: 'number.integer >= 0',
	height: 'number.integer >= 0',
	time: 'string',
	content_type: 'string',
	namespace: nestedNamespaceWire,
	'tx?': arktype({
		hash: 'string',
	}).onUndeclaredKey('delete'),
	'tx_hash?': 'string',
	signer: {
		hash: 'string',
	},
}).onUndeclaredKey('delete')

const namespaceBlobWire = arktype({
	commitment: 'string',
	size: 'number.integer >= 0',
	share_version: 'number.integer >= 0',
	height: 'number.integer >= 0',
	time: 'string',
	content_type: 'string',
	'tx?': arktype({
		hash: 'string',
	}).onUndeclaredKey('delete'),
	'tx_hash?': 'string',
	signer: {
		hash: 'string',
	},
}).onUndeclaredKey('delete')

const blobMetadataDetailWire = arktype({
	commitment: 'string',
	size: 'number.integer >= 0',
	share_version: 'number.integer >= 0',
	height: 'number.integer >= 0',
	time: 'string',
	content_type: 'string',
	namespace: nestedNamespaceWire,
	'tx?': arktype({
		hash: 'string',
	}).onUndeclaredKey('delete'),
	'tx_hash?': 'string',
	signer: {
		hash: 'string',
	},
}).onUndeclaredKey('delete')

const searchBlockWire = arktype({
	type: "'block'",
	result: arktype({
		height: 'number.integer >= 0',
		hash: 'string',
	}).onUndeclaredKey('delete'),
}).onUndeclaredKey('delete')

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
}).onUndeclaredKey('delete')

const transactionWire = arktype({
	height: 'number.integer >= 0',
	position: 'number.integer >= 0',
	gas_wanted: 'number.integer >= 0',
	gas_used: 'number.integer >= 0',
	hash: 'string',
	fee: 'string',
	time: 'string',
	status: 'string',
	timeout_height: 'number.integer >= 0',
	signers: arktype({
		hash: 'string',
	}).array(),
	message_types: 'string[]',
	'memo?': 'string',
	'codespace?': 'string',
	'error?': 'string',
	'events_count?': 'number.integer >= 0',
	'messages_count?': 'number.integer >= 0',
}).onUndeclaredKey('delete')


const assertSafeInteger = (
	value: number,
	label: string
) => {
	if (!Number.isSafeInteger(value))
		throw new Error(`Celenium_Rest: ${label} exceeds lossless JSON integer range`)
}

const assertSafeIntegers = (
	values: readonly (readonly [number, string])[]
) => {
	for (const [value, label] of values)
		assertSafeInteger(value, label)
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

export const parseCelestiaNamespaceId = (
	namespaceId: string
) => {
	if (!/^[0-9a-fA-F]{58}$/.test(namespaceId))
		throw new Error('Celenium_Rest: invalid Celestia namespace id')
	const version = Number.parseInt(namespaceId.slice(0, 2), 16)
	const id = namespaceId.slice(2).toLowerCase()
	if (!Number.isSafeInteger(version) || version > 255 || !namespaceIdPattern.test(id))
		throw new Error('Celenium_Rest: invalid Celestia namespace id')
	return {
		version,
		namespaceId: id,
	}
}

export const namespaceHashFromId = (
	namespaceId: string
) => {
	const bytes = Uint8Array.from(
		(namespaceId.match(/.{2}/g) ?? []).map((pair) => Number.parseInt(pair, 16))
	)
	if (bytes.length !== 29)
		throw new Error('Celenium_Rest: invalid Celestia namespace id')
	return globalThis.btoa(String.fromCharCode(...bytes))
}

export const namespaceSelectorId = (
	version: number,
	namespaceId: string
) => (
	version.toString(16).padStart(2, '0')
	+ namespaceId.toLowerCase()
)


export const getHead = async () => {
	const wire = headWire.assert(await sourceGetJson<unknown>(
		binding,
		httpUrl(binding, '/v1/head')
	))
	assertSafeIntegers([
		[wire.last_height, 'head height'],
		[wire.total_tx, 'transaction count'],
		[wire.total_accounts, 'account count'],
		[wire.total_blobs_size, 'total blob bytes'],
		...(wire.total_namespaces != null ?
			[[wire.total_namespaces, 'namespace count'] as const]
		:
			[]
		),
	])
	assertHash(wire.hash, 'head hash')
	assertDecimal(wire.total_fee, 'total fee')
	assertDecimal(wire.total_supply, 'total supply')
	if (wire.chain_id !== 'celestia')
		throw new Error('Celenium_Rest: foreign chain head')
	return wire
}

const validatedBlockWire = (wire: typeof blockWire.infer) => {
	assertSafeIntegers([
		[wire.height, 'block height'],
		[wire.stats.tx_count, 'block transaction count'],
		[wire.stats.blobs_count, 'block blob count'],
		[wire.stats.blobs_size, 'block blob bytes'],
		[wire.stats.bytes_in_block, 'block bytes'],
		...(wire.stats.events_count != null ?
			[[wire.stats.events_count, 'block event count'] as const]
		:
			[]
		),
		...(wire.stats.gas_limit != null ?
			[[wire.stats.gas_limit, 'block gas limit'] as const]
		:
			[]
		),
		...(wire.stats.gas_used != null ?
			[[wire.stats.gas_used, 'block gas used'] as const]
		:
			[]
		),
		...(wire.stats.square_size != null ?
			[[wire.stats.square_size, 'block square size'] as const]
		:
			[]
		),
		...(wire.stats.block_time != null ?
			[[wire.stats.block_time, 'block time ms'] as const]
		:
			[]
		),
		...(wire.version_block != null ?
			[[wire.version_block, 'block version'] as const]
		:
			[]
		),
		...(wire.version_app != null ?
			[[wire.version_app, 'app version'] as const]
		:
			[]
		),
	])
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
	return wire
}

export const getBlock = async (
	height: bigint
) => {
	if (height < 1n)
		throw new Error('Celenium_Rest: block height must be positive')
	const block = validatedBlockWire(blockWire.assert(await sourceGetJson<unknown>(
		binding,
		httpUrl(binding, `/v1/block/${height}?stats=true`)
	)))
	if (BigInt(block.height) !== height)
		throw new Error('Celenium_Rest: block response has mismatched height')
	return block
}

export const getBlockByHash = async (
	hash: string
) => {
	assertHash(hash, 'block hash')
	const hits = arktype('unknown[]').assert(await sourceGetJson<unknown>(
		binding,
		httpUrl(binding, `/v1/search?query=${encodeURIComponent(hash)}`)
	))
	const blockHit = hits.find((hit): hit is typeof searchBlockWire.infer => (
		searchBlockWire.allows(hit)
		&& hit.result.hash.toLowerCase() === hash.toLowerCase()
	))
	if (blockHit == null)
		throw new Error('Celenium_Rest: block hash not found')
	return getBlock(BigInt(blockHit.result.height))
}

export const getBlockCount = async () => {
	const count = unsignedSafe.assert(await sourceGetJson<unknown>(
		binding,
		httpUrl(binding, '/v1/block/count')
	))
	return count
}

export const listBlocks = async ({
	limit,
	offset,
}: {
	limit: number
	offset: number
}) => {
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
	return wires.map(validatedBlockWire)
}

const validatedNamespaceWire = (wire: typeof namespaceWire.infer) => {
	assertSafeIntegers([
		[wire.size, 'namespace bytes'],
		[wire.blobs_count, 'namespace blob count'],
		[wire.last_height, 'namespace last height'],
		...(wire.pfb_count != null ?
			[[wire.pfb_count, 'namespace pay-for-blobs count'] as const]
		:
			[]
		),
	])
	if (wire.version > 255)
		throw new Error('Celenium_Rest: invalid namespace version')
	if (!namespaceIdPattern.test(wire.namespace_id))
		throw new Error('Celenium_Rest: invalid namespace ID')
	if (!namespaceHashPattern.test(wire.hash))
		throw new Error('Celenium_Rest: invalid namespace hash')
	if (
		wire.last_message_time != null
		&& !Number.isFinite(Date.parse(wire.last_message_time))
	)
		throw new Error('Celenium_Rest: invalid namespace last message time')
	return wire
}

export const listNamespaces = async ({
	limit,
	offset,
}: {
	limit: number
	offset: number
}) => {
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
	return wires.map(validatedNamespaceWire)
}

export const getNamespace = async (
	namespaceId: string
) => {
	const {
		version,
		namespaceId: id,
	} = parseCelestiaNamespaceId(namespaceId)
	const wire = validatedNamespaceWire(namespaceWire.assert(await sourceGetJson<unknown>(
		binding,
		httpUrl(binding, `/v1/namespace/${encodeURIComponent(id)}/${version}`)
	)))
	if (
		wire.version !== version
		|| wire.namespace_id.toLowerCase() !== id
	)
		throw new Error('Celenium_Rest: namespace response has mismatched identity')
	return wire
}

export const getNamespaceByHash = async (
	hash: string
) => {
	if (!namespaceHashPattern.test(hash))
		throw new Error('Celenium_Rest: invalid namespace hash')
	const wire = validatedNamespaceWire(namespaceWire.assert(await sourceGetJson<unknown>(
		binding,
		httpUrl(binding, `/v1/namespace_by_hash/${encodeURIComponent(hash)}`)
	)))
	if (wire.hash !== hash)
		throw new Error('Celenium_Rest: namespace response has mismatched identity')
	return wire
}

const validatedBlobMetadataWire = (wire: typeof blobMetadataWire.infer) => {
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
	return wire
}

const txHashFromBlobWire = (
	wire: {
		tx_hash?: string
		tx?: {
			hash: string
		}
	}
) => {
	const txHash = wire.tx_hash ?? wire.tx?.hash
	if (txHash == null)
		throw new Error('Celenium_Rest: blob response missing transaction hash')
	return txHash
}

export const listBlobMetadata = async ({
	limit,
	offset,
}: {
	limit: number
	offset: number
}) => {
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
	return wires.map(validatedBlobMetadataWire)
}

export const listBlockBlobs = async ({
	height,
	limit,
	offset,
}: {
	height: bigint
	limit: number
	offset: number
}) => {
	if (height < 1n)
		throw new Error('Celenium_Rest: block height must be positive')
	assertPage({
		limit,
		offset,
	})
	const wires = blockBlobWire.array().assert(await sourceGetJson<unknown>(
		binding,
		httpUrl(binding, `/v1/block/${height}/blobs?limit=${limit}&offset=${offset}`)
	))
	if (wires.length > limit)
		throw new Error('Celenium_Rest: block blob page exceeds requested limit')
	return wires.map((wire) => {
		assertSafeInteger(wire.height, 'blob height')
		assertSafeInteger(wire.size, 'blob bytes')
		if (BigInt(wire.height) !== height)
			throw new Error('Celenium_Rest: block blob response has mismatched height')
		if (wire.share_version > 255)
			throw new Error('Celenium_Rest: invalid blob share version')
		if (!namespaceIdPattern.test(wire.namespace.namespace_id))
			throw new Error('Celenium_Rest: invalid namespace ID')
		if (!namespaceHashPattern.test(wire.namespace.hash))
			throw new Error('Celenium_Rest: invalid blob namespace hash')
		if (!commitmentPattern.test(wire.commitment))
			throw new Error('Celenium_Rest: invalid blob commitment')
		const txHash = txHashFromBlobWire(wire)
		assertHash(txHash, 'blob transaction hash')
		assertAddress(wire.signer.hash)
		return {
			commitment: wire.commitment,
			size: wire.size,
			share_version: wire.share_version,
			height: wire.height,
			time: wire.time,
			content_type: wire.content_type,
			namespace: wire.namespace.hash,
			namespaceVersion: wire.namespace.version,
			namespaceId: wire.namespace.namespace_id.toLowerCase(),
			tx_hash: txHash,
			signer: wire.signer,
		}
	})
}

export const listNamespaceBlobs = async ({
	namespaceId,
	limit,
	offset,
}: {
	namespaceId: string
	limit: number
	offset: number
}) => {
	const {
		version,
		namespaceId: id,
	} = parseCelestiaNamespaceId(namespaceId)
	assertPage({
		limit,
		offset,
	})
	const wires = namespaceBlobWire.array().assert(await sourceGetJson<unknown>(
		binding,
		httpUrl(binding, `/v1/namespace/${encodeURIComponent(id)}/${version}/blobs?limit=${limit}&offset=${offset}`)
	))
	if (wires.length > limit)
		throw new Error('Celenium_Rest: namespace blob page exceeds requested limit')
	const namespaceHash = namespaceHashFromId(namespaceId)
	return wires.map((wire) => {
		assertSafeInteger(wire.height, 'blob height')
		assertSafeInteger(wire.size, 'blob bytes')
		if (wire.share_version > 255)
			throw new Error('Celenium_Rest: invalid blob share version')
		if (!commitmentPattern.test(wire.commitment))
			throw new Error('Celenium_Rest: invalid blob commitment')
		const txHash = txHashFromBlobWire(wire)
		assertHash(txHash, 'blob transaction hash')
		assertAddress(wire.signer.hash)
		return {
			commitment: wire.commitment,
			size: wire.size,
			share_version: wire.share_version,
			height: wire.height,
			time: wire.time,
			content_type: wire.content_type,
			namespace: namespaceHash,
			namespaceVersion: version,
			namespaceId: id,
			tx_hash: txHash,
			signer: wire.signer,
		}
	})
}

export const getBlobMetadata = async ({
	height,
	namespaceId,
	commitment,
}: {
	height: bigint
	namespaceId: string
	commitment: string
}) => {
	if (height < 1n)
		throw new Error('Celenium_Rest: blob height must be positive')
	if (!commitmentPattern.test(commitment))
		throw new Error('Celenium_Rest: invalid blob commitment')
	const namespaceHash = namespaceHashFromId(namespaceId)
	const response = await sourceFetch(
		binding,
		httpUrl(binding, '/v1/blob/metadata'),
		{
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				commitment,
				hash: namespaceHash,
				height: Number(height),
			}),
		}
	)
	if (!response.ok)
		throw new Error(`Celenium_Rest: blob metadata request failed (${response.status})`)
	const detail = blobMetadataDetailWire.assert(await response.json())
	const wire = validatedBlobMetadataWire({
		commitment: detail.commitment,
		size: detail.size,
		share_version: detail.share_version,
		height: detail.height,
		time: detail.time,
		content_type: detail.content_type,
		namespace: detail.namespace.hash,
		tx_hash: txHashFromBlobWire(detail),
		signer: detail.signer,
	})
	if (BigInt(wire.height) !== height)
		throw new Error('Celenium_Rest: blob response has mismatched height')
	if (wire.commitment !== commitment)
		throw new Error('Celenium_Rest: blob response has mismatched commitment')
	if (wire.namespace !== namespaceHash)
		throw new Error('Celenium_Rest: blob response has mismatched namespace')
	return wire
}

export const getAddress = async (
	address: string
) => {
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
	return wire
}

export const getTransaction = async (
	hash: string
) => {
	assertHash(hash, 'transaction hash')
	const wire = transactionWire.assert(await sourceGetJson<unknown>(
		binding,
		httpUrl(binding, `/v1/tx/${encodeURIComponent(hash)}`)
	))
	if (wire.hash.toLowerCase() !== hash.toLowerCase())
		throw new Error('Celenium_Rest: transaction response has mismatched identity')
	assertSafeIntegers([
		[wire.height, 'transaction height'],
		[wire.position, 'transaction position'],
		[wire.gas_wanted, 'transaction gas wanted'],
		[wire.gas_used, 'transaction gas used'],
		[wire.timeout_height, 'transaction timeout height'],
		...(wire.events_count != null ?
			[[wire.events_count, 'transaction event count'] as const]
		:
			[]
		),
		...(wire.messages_count != null ?
			[[wire.messages_count, 'transaction message count'] as const]
		:
			[]
		),
	])
	assertDecimal(wire.fee, 'transaction fee')
	if (wire.status !== 'success' && wire.status !== 'failed')
		throw new Error('Celenium_Rest: invalid transaction status')
	for (const signer of wire.signers)
		assertAddress(signer.hash)
	return wire
}
