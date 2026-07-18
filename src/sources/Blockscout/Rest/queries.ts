/**
	* Blockscout REST v2 reads. `queries.ts` is the entry resolvers use; it composes
	* `$/sources/Blockscout/Rest/client.ts` and wire normalization.
	* @see https://docs.blockscout.com/devs/apis/rest
	*/

import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { getJson } from '$/sources/Blockscout/Rest/client.ts'
import {
	blockscoutV2ItemsCountMax,
	restPath,
} from '$/sources/Blockscout/Rest/constants.ts'
import { type Type, type as arktype } from 'arktype'

import type {
	BlockscoutErrorEnvelope,
	BlockscoutErc4337RegistryEntry,
	BlockscoutAddressCounters,
	BlockscoutAddressDetails,
	BlockscoutBlock,
	BlockscoutInternalTransaction,
	BlockscoutPaginated,
	BlockscoutSmartContractForList,
	BlockscoutStats,
	BlockscoutTokenTransfer,
	BlockscoutTransactionLog,
	BlockscoutTransaction,
	BlockscoutUserOperationDetail,
	BlockscoutUserOperationListItem,
} from '$/sources/Blockscout/Rest/types.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const blockscoutStatsWireSchema = arktype({
	'average_block_time?': 'number',
	'coin_price?': 'string',
	'coin_price_change_percentage?': 'number',
	'gas_price_updated_at?': 'string',
	'gas_prices?': {
		'slow?': 'number',
		'average?': 'number',
		'fast?': 'number',
	},
	'gas_used_today?': 'string',
	'market_cap?': 'string',
	'network_utilization_percentage?': 'number',
	'total_addresses?': 'string',
	'total_blocks?': 'string',
	'total_transactions?': 'string',
	'transactions_today?': 'string',
}) satisfies Type<BlockscoutStats>
import type {
	RpcBlockHeader,
	RpcLog,
	RpcReceipt,
	RpcTransaction,
} from '$/sources/Evm/JsonRpc/types.ts'

const quantityHex = (value: string | number | bigint | undefined) => (
	value != null && `${value}` !== '' ?
		`0x${BigInt(value).toString(16)}`
	:
		undefined
)

const timestampHex = (timestamp: string | undefined) => {
	if (timestamp == null) return undefined
	const ts = Math.floor(new Date(timestamp).getTime() / 1000)
	return Number.isFinite(ts) ? `0x${BigInt(ts).toString(16)}` : undefined
}

const blockscoutItemsCount = (limit: number) => (
	Math.min(
		Math.max(Number.isFinite(limit) ? limit : 0, 0),
		blockscoutV2ItemsCountMax
	)
)

const addressHash = (
	wire: string | BlockscoutBlock['miner']   | BlockscoutTransaction['to']   | BlockscoutTransactionLog['address_hash'] | BlockscoutSmartContractForList['address_hash'] | undefined
) => (
	typeof wire === 'string' ?
		wire
	:
		wire?.hash
)

const blockscoutBlockWireAsRpcBlockHeader = (
	wire: BlockscoutBlock
): RpcBlockHeader => ({
	number: `0x${wire.height.toString(16)}`,
	hash: wire.hash,
	parentHash: wire.parent_hash,
	timestamp: timestampHex(wire.timestamp),
	gasUsed: quantityHex(wire.gas_used),
	gasLimit: quantityHex(wire.gas_limit),
	baseFeePerGas: quantityHex(wire.base_fee_per_gas),
	miner: addressHash(wire.miner),
	transactions: new Array(wire.transactions_count ?? 0),
	...(wire.blob_gas_used != null && { blobGasUsed: quantityHex(wire.blob_gas_used) }),
	...(wire.excess_blob_gas != null && { excessBlobGas: quantityHex(wire.excess_blob_gas) }),
})

export const blockscoutTransactionWireAsRpcTransaction = (
	wire: BlockscoutTransaction
): RpcTransaction => ({
	blockHash: wire.block_hash,
	blockNumber: wire.block_number != null ? `0x${wire.block_number.toString(16)}` : undefined,
	hash: wire.hash,
	from: addressHash(wire.from),
	to: addressHash(wire.to) ?? null,
	gas: quantityHex(wire.gas_limit),
	gasPrice: quantityHex(wire.gas_price),
	maxFeePerGas: quantityHex(wire.max_fee_per_gas),
	maxPriorityFeePerGas: quantityHex(wire.max_priority_fee_per_gas),
	input: wire.raw_input,
	nonce: wire.nonce != null ? `0x${wire.nonce.toString(16)}` : undefined,
	transactionIndex: wire.position != null ? `0x${wire.position.toString(16)}` : undefined,
	type: wire.type != null ? `0x${wire.type.toString(16)}` : undefined,
	value: wire.value,
})

export const blockscoutTransactionWireAsRpcReceipt = (
	tx: BlockscoutTransaction,
	logs: NonNullable<RpcReceipt['logs']>
): RpcReceipt => ({
	status: tx.status === 'ok' ? '0x1' : tx.status === 'error' ? '0x0' : undefined,
	gasUsed: quantityHex(tx.gas_used),
	effectiveGasPrice: quantityHex(tx.gas_price),
	logs,
	contractAddress: addressHash(tx.created_contract),
	cumulativeGasUsed: quantityHex(tx.cumulative_gas_used),
})

const blockscoutTransactionLogWiresAsRpcReceiptLogs = (
	logs: BlockscoutTransactionLog[]
): RpcLog[] => (
	logs.map((log) => {
		const logAddress = addressHash(log.address_hash)
		return {
			...(logAddress != null && { address: logAddress }),
			...(log.topics != null && { topics: log.topics.flatMap((topic) => topic == null ? [] : [topic]) }),
			...(log.data != null && { data: log.data }),
			...(log.block_number != null && { blockNumber: `0x${log.block_number.toString(16)}` }),
			...(log.transaction_hash != null && { transactionHash: log.transaction_hash }),
			...(log.index != null && { logIndex: `0x${log.index.toString(16)}` }),
		}
	})
)

/**
	* Blockscout REST **`GET …/api/v2/stats`** — aggregated UI/market stats when enabled on the instance.
	* Not every deployment exposes this route; callers treat failures as optional enrichment.
	*
	* @see https://docs.blockscout.com/devs/apis/rest/stats-api
	*/
export const getStats = async ({
	explorerOrigin,
}: {
	explorerOrigin: string
}): Promise<BlockscoutStats | null> => {
	try {
		const validated = blockscoutStatsWireSchema(await getJson({
			explorerOrigin,
			path: '/stats',
		}))
		return validated instanceof arktype.errors ?
			null
		:
			validated
	} catch {
		return null
	}
}

export const getBlockByNumber = async ({
	explorerOrigin,
	blockNumber,
}: {
	explorerOrigin: string
	blockNumber: bigint
}): Promise<RpcBlockHeader | null> => {
	const wire = await getJson<BlockscoutBlock | null>({
		explorerOrigin,
		path: `/blocks/${blockNumber}`,
	})
	return wire != null ? blockscoutBlockWireAsRpcBlockHeader(wire) : null
}

export const getBlocks = async ({
	explorerOrigin,
	limit,
}: {
	explorerOrigin: string
	limit: number
}): Promise<RpcBlockHeader[]> => {
	if (limit <= 0) return []
	const wire = await getJson<BlockscoutPaginated<BlockscoutBlock>>({
		explorerOrigin,
		path: '/blocks',
		searchParams: {
			items_count: blockscoutItemsCount(limit),
		},
	})
	return wire.items.map(blockscoutBlockWireAsRpcBlockHeader)
}

export const getBlockTransactions = async ({
	explorerOrigin,
	blockNumber,
	limit,
}: {
	explorerOrigin: string
	blockNumber: bigint
	limit: number
}): Promise<RpcTransaction[]> => {
	if (limit <= 0) return []
	const wire = await getJson<BlockscoutPaginated<BlockscoutTransaction>>({
		explorerOrigin,
		path: `/blocks/${blockNumber}/transactions`,
		searchParams: {
			items_count: blockscoutItemsCount(limit),
		},
	})
	return wire.items.map(blockscoutTransactionWireAsRpcTransaction)
}

export const getTransactionWireByHash = async ({
	explorerOrigin,
	txHash,
}: {
	explorerOrigin: string
	txHash: `0x${string}`
}): Promise<BlockscoutTransaction | null> => (
	await getJson<BlockscoutTransaction | null>({
		explorerOrigin,
		path: `/transactions/${txHash}`,
	})
)

export const getTransactionByHash = async ({
	explorerOrigin,
	txHash,
}: {
	explorerOrigin: string
	txHash: `0x${string}`
}): Promise<RpcTransaction | null> => {
	const wire = await getTransactionWireByHash({
		explorerOrigin,
		txHash,
	})
	return wire != null ? blockscoutTransactionWireAsRpcTransaction(wire) : null
}

export const getTransactions = async ({
	explorerOrigin,
	limit,
}: {
	explorerOrigin: string
	limit: number
}): Promise<RpcTransaction[]> => {
	if (limit <= 0) return []
	const wire = await getJson<BlockscoutPaginated<BlockscoutTransaction>>({
		explorerOrigin,
		path: '/transactions',
		searchParams: {
			items_count: blockscoutItemsCount(limit),
		},
	})
	return wire.items.map(blockscoutTransactionWireAsRpcTransaction)
}

/** REST v2: transactions where this wallet participates on the configured explorer (`0x`-prefixed **`address`** normalized to 20-byte lower-case hex). */
export const getAddressTransactions = async ({
	explorerOrigin,
	address,
	limit,
}: {
	explorerOrigin: string
	address: `0x${string}`
	limit: number
}): Promise<RpcTransaction[]> => {
	if (limit <= 0) return []
	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null) return []
	let wire: BlockscoutPaginated<BlockscoutTransaction>
	try {
		wire = await getJson<BlockscoutPaginated<BlockscoutTransaction>>({
			explorerOrigin,
			path: `/addresses/${normalized}/transactions`,
			searchParams: {
				items_count: blockscoutItemsCount(limit),
			},
		})
	}
	catch (error) {
		if (String(error).includes('Fetch failed (404 Not Found)')) return []
		throw error
	}
	return wire.items.map(blockscoutTransactionWireAsRpcTransaction)
}

/** Unique normalized tx hashes (`32`-byte lower-case `0x` hex) from transfer/internal wires. */
export const getUniqueTransactionHashesFromWires = (
	items: readonly { transaction_hash?: string | undefined }[]
): `0x${string}`[] => {
	const seen = new Set<string>()
	const out: `0x${string}`[] = []
	for (const item of items) {
		const raw = item.transaction_hash
		if (raw == null || raw === '') continue
		const withPrefix = raw.startsWith('0x') ? raw : `0x${raw}`
		const normalized = hexLowerOfByteSize(withPrefix, 32)
		if (normalized == null || seen.has(normalized)) continue
		seen.add(normalized)
		out.push(normalized)
	}
	return out
}

/** REST v2 **`GET /addresses/{address}`** — normalized **`address`** (`hexLowerOfByteSize`, 20 bytes). */
export const getAddressDetails = async ({
	explorerOrigin,
	address,
}: {
	explorerOrigin: string
	address: `0x${string}`
}): Promise<BlockscoutAddressDetails> => {
	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null)
		throw new Error('Blockscout address detail: invalid address')
	return getJson<BlockscoutAddressDetails>({
		explorerOrigin,
		path: `/addresses/${normalized}`,
	})
}

/** REST v2 **`GET /addresses/{address}/counters`**. */
export const getAddressCounters = async ({
	explorerOrigin,
	address,
}: {
	explorerOrigin: string
	address: `0x${string}`
}): Promise<BlockscoutAddressCounters> => {
	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null)
		throw new Error('Blockscout address counters: invalid address')
	return getJson<BlockscoutAddressCounters>({
		explorerOrigin,
		path: `/addresses/${normalized}/counters`,
	})
}

/** REST v2 **`GET /addresses/{address}/token-transfers`** — paginated **`items`**. */
export const getAddressTokenTransfers = async ({
	explorerOrigin,
	address,
	limit,
	searchParams,
}: {
	explorerOrigin: string
	address: `0x${string}`
	limit: number
	searchParams?: Record<string, string | number | undefined>
}): Promise<BlockscoutTokenTransfer[]> => {
	if (limit <= 0) return []
	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null) return []
	let wire: BlockscoutPaginated<BlockscoutTokenTransfer>
	try {
		wire = await getJson<BlockscoutPaginated<BlockscoutTokenTransfer>>({
			explorerOrigin,
			path: `/addresses/${normalized}/token-transfers`,
			searchParams: {
				...searchParams,
				items_count: blockscoutItemsCount(limit),
			},
		})
	}
	catch (error) {
		if (String(error).includes('Fetch failed (404 Not Found)')) return []
		throw error
	}
	return wire.items
}

/** REST v2 **`GET /token-transfers`** — latest network token transfers. */
export const getTokenTransfers = async ({
	explorerOrigin,
	limit,
}: {
	explorerOrigin: string
	limit: number
}): Promise<BlockscoutTokenTransfer[]> => {
	if (limit <= 0) return []
	return (
		await getJson<BlockscoutPaginated<BlockscoutTokenTransfer>>({
			explorerOrigin,
			path: '/token-transfers',
		})
	).items.slice(0, limit)
}

/** REST v2 **`GET /transactions/{txHash}/token-transfers`** — paginated **`items`**. */
export const getTransactionTokenTransfers = async ({
	explorerOrigin,
	txHash,
	limit,
}: {
	explorerOrigin: string
	txHash: `0x${string}`
	limit: number
}): Promise<BlockscoutTokenTransfer[]> => {
	if (limit <= 0) return []
	const normalized = hexLowerOfByteSize(txHash, 32)
	if (normalized == null) return []
	let wire: BlockscoutPaginated<BlockscoutTokenTransfer>
	try {
		wire = await getJson<BlockscoutPaginated<BlockscoutTokenTransfer>>({
			explorerOrigin,
			path: `/transactions/${normalized}/token-transfers`,
		})
	} catch (error) {
		if (String(error).includes('422 Unprocessable Entity')) return []
		throw error
	}
	return wire.items
}

/** REST v2 **`GET /transactions/{txHash}/internal-transactions`** — paginated **`items`**. */
export const getTransactionInternalTransactions = async ({
	explorerOrigin,
	txHash,
	limit,
}: {
	explorerOrigin: string
	txHash: `0x${string}`
	limit: number
}): Promise<BlockscoutInternalTransaction[]> => {
	if (limit <= 0) return []
	const normalized = hexLowerOfByteSize(txHash, 32)
	if (normalized == null) return []
	const wire = await getJson<BlockscoutPaginated<BlockscoutInternalTransaction>>({
		explorerOrigin,
		path: `/transactions/${normalized}/internal-transactions`,
		searchParams: {
			items_count: blockscoutItemsCount(limit),
		},
	})
	return wire.items
}

/** REST v2 **`GET /addresses/{address}/internal-transactions`** — paginated **`items`**. */
export const getAddressInternalTransactions = async ({
	explorerOrigin,
	address,
	limit,
	searchParams,
}: {
	explorerOrigin: string
	address: `0x${string}`
	limit: number
	searchParams?: Record<string, string | number | undefined>
}): Promise<BlockscoutInternalTransaction[]> => {
	if (limit <= 0) return []
	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null) return []
	let wire: BlockscoutPaginated<BlockscoutInternalTransaction>
	try {
		wire = await getJson<BlockscoutPaginated<BlockscoutInternalTransaction>>({
			explorerOrigin,
			path: `/addresses/${normalized}/internal-transactions`,
			searchParams: {
				...searchParams,
				items_count: blockscoutItemsCount(limit),
			},
		})
	}
	catch (error) {
		if (String(error).includes('Fetch failed (404 Not Found)')) return []
		throw error
	}
	return wire.items
}

export const getTransactionLogs = async ({
	explorerOrigin,
	txHash,
}: {
	explorerOrigin: string
	txHash: `0x${string}`
}): Promise<NonNullable<RpcReceipt['logs']>> => {
	const logs: NonNullable<RpcReceipt['logs']> = []
	let nextPageParams: Record<string, string | number> | undefined
	do {
		const wire = await getJson<BlockscoutPaginated<BlockscoutTransactionLog>>({
			explorerOrigin,
			path: `/transactions/${txHash}/logs`,
			searchParams: nextPageParams,
		})
		logs.push(...blockscoutTransactionLogWiresAsRpcReceiptLogs(wire.items))
		nextPageParams = wire.next_page_params
	} while (nextPageParams != null)
	return logs
}

export const getTransactionReceipt = async ({
	explorerOrigin,
	txHash,
}: {
	explorerOrigin: string
	txHash: `0x${string}`
}): Promise<RpcReceipt | null> => {
	const tx = await getTransactionWireByHash({
		explorerOrigin,
		txHash,
	})
	if (tx == null) return null
	const logs = await getTransactionLogs({
		explorerOrigin,
		txHash,
	})
	return blockscoutTransactionWireAsRpcReceipt(tx, logs)
}

export const normalizeAddressFromContractListWire = (
	w: BlockscoutSmartContractForList
): `0x${string}` | null => {
	const h = addressHash(w.address ?? w.address_hash)
	if (h == null || h === '') return null
	const normalized = h.startsWith('0x') ? h : `0x${h}`
	return hexLowerOfByteSize(normalized, 20) ?? null
}

export const getSmartContracts = async ({
	explorerOrigin,
	limit,
}: {
	explorerOrigin: string
	limit: number
}): Promise<BlockscoutSmartContractForList[]> => {
	if (limit <= 0) return []
	const wire = await getJson<BlockscoutPaginated<BlockscoutSmartContractForList>>({
		explorerOrigin,
		path: '/smart-contracts',
		searchParams: {
			items_count: blockscoutItemsCount(limit),
		},
	})
	return wire.items
}

const blockscoutLegacyAbiFromWire = (
	wire: import('$/sources/Blockscout/Rest/types.ts').BlockscoutLegacyContractStatus
): string | null => {
	if (wire.status === '1' && typeof wire.result === 'string' && wire.result.trim())
		return wire.result
	if (wire.status !== '1' || !Array.isArray(wire.result)) return null
	const row = wire.result[0]
	const abi = row.ABI
	return typeof abi === 'string' && abi.trim() ? abi : null
}

/** Legacy `module=contract` **`getabi`**, fallback **`getsourcecode`**. */
export const getContractAbiJsonString = async ({
	explorerOrigin,
	address,
}: {
	explorerOrigin: string
	address: `0x${string}`
}): Promise<string | null> => {
	const { getBlockscoutLegacyJson } = await import('$/sources/Blockscout/Rest/client.ts')
	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null) return null
	const abiWire = await getBlockscoutLegacyJson<import('$/sources/Blockscout/Rest/types.ts').BlockscoutLegacyContractStatus>({
		explorerOrigin,
		query: {
			module: 'contract',
			action: 'getabi',
			address: normalized,
		},
	})
	const abiFromGetAbi = blockscoutLegacyAbiFromWire(abiWire)
	if (abiFromGetAbi != null) return abiFromGetAbi
	const sourceWire = await getBlockscoutLegacyJson<import('$/sources/Blockscout/Rest/types.ts').BlockscoutLegacyContractStatus>({
		explorerOrigin,
		query: {
			module: 'contract',
			action: 'getsourcecode',
			address: normalized,
		},
	})
	return blockscoutLegacyAbiFromWire(sourceWire)
}

/** Legacy **`getsourcecode`** row (proxy **`Implementation`**, etc.). */
export const getContractSourceCodeRow = async ({
	explorerOrigin,
	address,
}: {
	explorerOrigin: string
	address: `0x${string}`
}): Promise<import('$/sources/Blockscout/Rest/types.ts').BlockscoutLegacyContractSource | null> => {
	const { getBlockscoutLegacyJson } = await import('$/sources/Blockscout/Rest/client.ts')
	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null) return null
	const wire = await getBlockscoutLegacyJson<import('$/sources/Blockscout/Rest/types.ts').BlockscoutLegacyContractStatus>({
		explorerOrigin,
		query: {
			module: 'contract',
			action: 'getsourcecode',
			address: normalized,
		},
	})
	if (wire.status !== '1' || !Array.isArray(wire.result)) return null
	return wire.result[0] ?? null
}

export const getCode = async ({
	explorerOrigin,
	address,
}: {
	explorerOrigin: string
	address: `0x${string}`
}): Promise<`0x${string}` | null> => {
	const { postBlockscoutEthRpc } = await import('$/sources/Blockscout/Rest/client.ts')
	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null) return null
	const result = await postBlockscoutEthRpc<`0x${string}`>({
		explorerOrigin,
		method: 'eth_getCode',
		params: [
			normalized,
			'latest',
		],
	})
	return result ?? null
}

export const getStorageAt = async ({
	explorerOrigin,
	address,
	slotQuantityHex,
}: {
	explorerOrigin: string
	address: `0x${string}`
	slotQuantityHex: `0x${string}`
}): Promise<`0x${string}` | null> => {
	const { postBlockscoutEthRpc } = await import('$/sources/Blockscout/Rest/client.ts')
	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null) return null
	const result = await postBlockscoutEthRpc<`0x${string}`>({
		explorerOrigin,
		method: 'eth_getStorageAt',
		params: [
			normalized,
			slotQuantityHex,
			'latest',
		],
	})
	return result ?? null
}

const blockscoutErrorText = (error: JsonValue | undefined) => (
	error == null || error === false || String(error).length === 0 ?
		undefined
	:
		typeof error === 'string' ?
			error
		:
			typeof error === 'number' || typeof error === 'bigint' || typeof error === 'boolean' ?
				String(error)
			:
				JSON.stringify(error)
)

const assertBlockscoutWireNoErrorPayload = (wire: BlockscoutErrorEnvelope, debugLabel: string) => {
	const error = blockscoutErrorText(wire.error)
	if (error != null)
		throw new Error(`${debugLabel}: ${error}`)

	const errors = blockscoutErrorText(wire.errors)
	if (errors != null)
		throw new Error(`${debugLabel}: errors ${errors}`)
}

/**
	* ERC-4337 registry on Blockscout (`/proxy/account-abstraction/*`).
	* Detail paths require a `0x`-prefixed hash.
	*/
const blockscoutErc4337PathHash = (
	value: `0x${string}`,
	byteSize: 20 | 32,
	label: string
) => {
	const normalized = hexLowerOfByteSize(value, byteSize)
	if (normalized == null)
		throw new Error(`${label}: invalid hash`)
	return normalized
}

const getBlockscoutErc4337TopRegistryList = async ({
	explorerOrigin,
	limit,
	relativePath,
}: {
	explorerOrigin: string
	limit: number
	relativePath: string
}): Promise<BlockscoutErc4337RegistryEntry[]> => {
	if (limit <= 0)
		throw new Error(`Blockscout GET ${relativePath}: limit must be positive`)
	const raw = await getJson<
		BlockscoutPaginated<BlockscoutErc4337RegistryEntry> & BlockscoutErrorEnvelope
		>({
			explorerOrigin,
			path: relativePath,
			searchParams: {
				page_size: blockscoutItemsCount(limit),
			},
		})
	assertBlockscoutWireNoErrorPayload(raw, `Blockscout GET ${relativePath}`)
	return raw.items
}

const getBlockscoutErc4337RegistryDetail = async ({
	explorerOrigin,
	address,
	relativePath,
}: {
	explorerOrigin: string
	address: `0x${string}`
	relativePath: string
}): Promise<BlockscoutErc4337RegistryEntry> => {
	const normalized = blockscoutErc4337PathHash(address, 20, 'Blockscout ERC-4337 registry detail')
	const path = `${relativePath}/${normalized}`
	const raw = await getJson<BlockscoutErc4337RegistryEntry & BlockscoutErrorEnvelope>({
		explorerOrigin,
		path,
	})
	assertBlockscoutWireNoErrorPayload(raw, `Blockscout GET ${path}`)
	return raw
}

export const getUserOperationsPage = async ({
	explorerOrigin,
	limit,
}: {
	explorerOrigin: string
	limit: number
}): Promise<BlockscoutUserOperationListItem[]> => {
	const relativePath = '/proxy/account-abstraction/operations'
	const raw = await getJson<
		BlockscoutPaginated<BlockscoutUserOperationListItem> & BlockscoutErrorEnvelope
		>({
			explorerOrigin,
			path: relativePath,
			searchParams: {
				page_size: blockscoutItemsCount(limit),
			},
		})
	assertBlockscoutWireNoErrorPayload(raw, `Blockscout GET ${relativePath}`)
	return raw.items
}

export const getUserOperationsByTransaction = async ({
	explorerOrigin,
	txHash,
	limit,
}: {
	explorerOrigin: string
	txHash: `0x${string}`
	limit: number
}): Promise<BlockscoutUserOperationListItem[]> => {
	const normalized = blockscoutErc4337PathHash(txHash, 32, 'Blockscout user operations by transaction')
	const relativePath = '/proxy/account-abstraction/operations'
	const raw = await getJson<
		BlockscoutPaginated<BlockscoutUserOperationListItem> & BlockscoutErrorEnvelope
		>({
			explorerOrigin,
			path: relativePath,
			searchParams: {
				page_size: blockscoutItemsCount(limit),
				transaction_hash: normalized,
			},
		})
	assertBlockscoutWireNoErrorPayload(raw, `Blockscout GET ${relativePath}`)
	return raw.items
}

export const getUserOperationDetail = async ({
	explorerOrigin,
	hash,
}: {
	explorerOrigin: string
	hash: `0x${string}`
}): Promise<BlockscoutUserOperationDetail> => {
	const normalized = blockscoutErc4337PathHash(hash, 32, 'Blockscout user operation detail')
	const path = `/proxy/account-abstraction/operations/${normalized}`
	const raw = await getJson<
		BlockscoutUserOperationDetail & BlockscoutErrorEnvelope
		>({
			explorerOrigin,
			path,
		})
	assertBlockscoutWireNoErrorPayload(raw, `Blockscout GET ${path}`)
	return raw
}

export const getErc4337SmartAccountList = async (args: {
	explorerOrigin: string
	limit: number
}) => (
	getBlockscoutErc4337TopRegistryList({
		...args,
		relativePath: '/proxy/account-abstraction/accounts',
	})
)

export const getErc4337BundlerList = async (args: {
	explorerOrigin: string
	limit: number
}) => (
	getBlockscoutErc4337TopRegistryList({
		...args,
		relativePath: '/proxy/account-abstraction/bundlers',
	})
)

export const getErc4337PaymasterList = async (args: {
	explorerOrigin: string
	limit: number
}) => (
	getBlockscoutErc4337TopRegistryList({
		...args,
		relativePath: '/proxy/account-abstraction/paymasters',
	})
)

export const getErc4337AccountFactoryList = async (args: {
	explorerOrigin: string
	limit: number
}) => (
	getBlockscoutErc4337TopRegistryList({
		...args,
		relativePath: '/proxy/account-abstraction/factories',
	})
)

export const getErc4337SmartAccountDetail = async (args: {
	explorerOrigin: string
	address: `0x${string}`
}) => (
	getBlockscoutErc4337RegistryDetail({
		...args,
		relativePath: '/proxy/account-abstraction/accounts',
	})
)

export const getErc4337BundlerDetail = async (args: {
	explorerOrigin: string
	address: `0x${string}`
}) => (
	getBlockscoutErc4337RegistryDetail({
		...args,
		relativePath: '/proxy/account-abstraction/bundlers',
	})
)

export const getErc4337PaymasterDetail = async (args: {
	explorerOrigin: string
	address: `0x${string}`
}) => (
	getBlockscoutErc4337RegistryDetail({
		...args,
		relativePath: '/proxy/account-abstraction/paymasters',
	})
)

export const getErc4337AccountFactoryDetail = async (args: {
	explorerOrigin: string
	address: `0x${string}`
}) => (
	getBlockscoutErc4337RegistryDetail({
		...args,
		relativePath: '/proxy/account-abstraction/factories',
	})
)
