/**
 * Blockscout REST v2 reads. `queries.ts` is the entry resolvers use; it composes
 * `$/sources/Blockscout/Rest/client.ts` and wire normalization.
 * @see https://docs.blockscout.com/devs/apis/rest
 */

import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { corsFetch } from '$/lib/http.ts'
import { getJson } from '$/sources/Blockscout/Rest/client.ts'
import {
	blockscoutExplorerOrigins,
	blockscoutV2ItemsCountMax,
	restPath,
} from '$/sources/Blockscout/Rest/constants.ts'
import { type as arktype } from 'arktype'

import type {
	BlockscoutErc4337RegistryEntryWire,
	BlockscoutAddressCountersWire,
	BlockscoutAddressDetailsWire,
	BlockscoutBlockWire,
	BlockscoutInternalTransactionWire,
	BlockscoutPaginatedWire,
	BlockscoutSmartContractForListWire,
	BlockscoutStatsWire,
	BlockscoutTokenTransferWire,
	BlockscoutTransactionLogWire,
	BlockscoutTransactionWire,
	BlockscoutUserOperationDetailWire,
	BlockscoutUserOperationListItemWire,
} from '$/sources/Blockscout/Rest/types.ts'

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
}) satisfies arktype.Type<BlockscoutStatsWire>
import type {
	RpcBlockHeaderWire,
	RpcLogWire,
	RpcReceiptWire,
	RpcTxWire,
} from '$/sources/Evm/JsonRpc/types.ts'

const quantityHex = (value: string | number | bigint | undefined) => (
	value != null && `${value}` !== '' ?
		`0x${BigInt(value).toString(16)}`
	:	undefined
)

const timestampHex = (timestamp: string | undefined) => {
	if (timestamp == null) return undefined
	const ts = Math.floor(new Date(timestamp).getTime() / 1000)
	return Number.isFinite(ts) ? `0x${BigInt(ts).toString(16)}` : undefined
}

const blockscoutItemsCount = (limit: number) => (
	Math.min(
		Math.max(Number.isFinite(limit) ? limit : 0, 0),
		blockscoutV2ItemsCountMax,
	)
)

const addressHash = (
	wire: string | BlockscoutBlockWire['miner']   | BlockscoutTransactionWire['to']   | BlockscoutTransactionLogWire['address_hash'] | BlockscoutSmartContractForListWire['address_hash'] | undefined,
) => (
	typeof wire === 'string' ?
		wire
	:	wire?.hash
)

const blockscoutBlockWireAsRpcBlockHeaderWire = (
	wire: BlockscoutBlockWire,
): RpcBlockHeaderWire => ({
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

const blockscoutTransactionWireAsRpcTxWire = (
	wire: BlockscoutTransactionWire,
): RpcTxWire => ({
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

const blockscoutTransactionLogWiresAsRpcReceiptLogs = (
	logs: BlockscoutTransactionLogWire[],
): RpcLogWire[] => (
	logs.map((log) => {
		const logAddress = addressHash(log.address_hash)
		return {
			...(logAddress != null && { address: logAddress }),
			...(log.topics != null && { topics: log.topics }),
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
export const getBlockscoutStats = async ({
	explorerOrigin,
}: {
	explorerOrigin: string
}): Promise<BlockscoutStatsWire | null> => {
	try {
		const url = new URL(explorerOrigin)
		url.pathname = `${url.pathname.replace(/\/$/, '')}${restPath}/stats`
		const res = await corsFetch(url.toString(), {
			origins: blockscoutExplorerOrigins,
			init: { headers: { accept: 'application/json' } },
		})
		if (!res.ok) return null
		const validated = blockscoutStatsWireSchema(await res.json())
		return validated instanceof arktype.errors ?
				null
			:	validated
	} catch {
		return null
	}
}

export const getBlockByNumberBlockscout = async ({
	explorerOrigin,
	blockNumber,
}: {
	explorerOrigin: string
	blockNumber: bigint
}): Promise<RpcBlockHeaderWire | null> => {
	if (blockNumber == null || typeof blockNumber !== 'bigint') {
		return null
	}
	const wire = await getJson<BlockscoutBlockWire | null>({
		explorerOrigin,
		path: `/blocks/${blockNumber}`,
	})
	return wire != null ? blockscoutBlockWireAsRpcBlockHeaderWire(wire) : null
}

export const getBlockscoutBlocks = async ({
	explorerOrigin,
	limit,
}: {
	explorerOrigin: string
	limit: number
}): Promise<RpcBlockHeaderWire[]> => {
	if (limit <= 0) return []
	const wire = await getJson<BlockscoutPaginatedWire<BlockscoutBlockWire>>({
		explorerOrigin,
		path: '/blocks',
		searchParams: {
			items_count: blockscoutItemsCount(limit),
		},
	})
	return wire.items.map(blockscoutBlockWireAsRpcBlockHeaderWire)
}

export const getBlockTransactionsBlockscout = async ({
	explorerOrigin,
	blockNumber,
	limit,
}: {
	explorerOrigin: string
	blockNumber: bigint
	limit: number
}): Promise<RpcTxWire[]> => {
	if (limit <= 0) return []
	if (blockNumber == null || typeof blockNumber !== 'bigint') {
		return []
	}
	const wire = await getJson<BlockscoutPaginatedWire<BlockscoutTransactionWire>>({
		explorerOrigin,
		path: `/blocks/${blockNumber}/transactions`,
		searchParams: {
			items_count: blockscoutItemsCount(limit),
		},
	})
	return wire.items.map(blockscoutTransactionWireAsRpcTxWire)
}

export const getTransactionByHashBlockscout = async ({
	explorerOrigin,
	txHash,
}: {
	explorerOrigin: string
	txHash: `0x${string}`
}): Promise<RpcTxWire | null> => {
	const wire = await getJson<BlockscoutTransactionWire | null>({
		explorerOrigin,
		path: `/transactions/${txHash}`,
	})
	return wire != null ? blockscoutTransactionWireAsRpcTxWire(wire) : null
}

export const getBlockscoutTransactions = async ({
	explorerOrigin,
	limit,
}: {
	explorerOrigin: string
	limit: number
}): Promise<RpcTxWire[]> => {
	if (limit <= 0) return []
	const wire = await getJson<BlockscoutPaginatedWire<BlockscoutTransactionWire>>({
		explorerOrigin,
		path: '/transactions',
		searchParams: {
			items_count: blockscoutItemsCount(limit),
		},
	})
	return wire.items.map(blockscoutTransactionWireAsRpcTxWire)
}

/** REST v2: transactions where this wallet participates on the configured explorer (`0x`-prefixed **`address`** normalized to 20-byte lower-case hex). */
export const getBlockscoutAddressTransactions = async ({
	explorerOrigin,
	address,
	limit,
}: {
	explorerOrigin: string
	address: `0x${string}`
	limit: number
}): Promise<RpcTxWire[]> => {
	if (limit <= 0) return []
	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null) return []
	const wire = await getJson<BlockscoutPaginatedWire<BlockscoutTransactionWire>>({
		explorerOrigin,
		path: `/addresses/${normalized}/transactions`,
		searchParams: {
			items_count: blockscoutItemsCount(limit),
		},
	})
	return wire.items.map(blockscoutTransactionWireAsRpcTxWire)
}

/** Unique normalized tx hashes (`32`-byte lower-case `0x` hex) from transfer/internal wires. */
export const uniqueBlockscoutTransactionHashesFromWires = (
	items: readonly { transaction_hash?: string | undefined }[],
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
export const getBlockscoutAddressDetails = async ({
	explorerOrigin,
	address,
}: {
	explorerOrigin: string
	address: `0x${string}`
}): Promise<BlockscoutAddressDetailsWire> => {
	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null) {
		throw new Error('Blockscout address detail: invalid address')
	}
	return getJson<BlockscoutAddressDetailsWire>({
		explorerOrigin,
		path: `/addresses/${normalized}`,
	})
}

/** REST v2 **`GET /addresses/{address}/counters`**. */
export const getBlockscoutAddressCounters = async ({
	explorerOrigin,
	address,
}: {
	explorerOrigin: string
	address: `0x${string}`
}): Promise<BlockscoutAddressCountersWire> => {
	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null) {
		throw new Error('Blockscout address counters: invalid address')
	}
	return getJson<BlockscoutAddressCountersWire>({
		explorerOrigin,
		path: `/addresses/${normalized}/counters`,
	})
}

/** REST v2 **`GET /addresses/{address}/token-transfers`** — paginated **`items`**. */
export const getBlockscoutAddressTokenTransfers = async ({
	explorerOrigin,
	address,
	limit,
	searchParams,
}: {
	explorerOrigin: string
	address: `0x${string}`
	limit: number
	searchParams?: Record<string, string | number | undefined>
}): Promise<BlockscoutTokenTransferWire[]> => {
	if (limit <= 0) return []
	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null) return []
	const wire = await getJson<BlockscoutPaginatedWire<BlockscoutTokenTransferWire>>({
		explorerOrigin,
		path: `/addresses/${normalized}/token-transfers`,
		searchParams: {
			...searchParams,
			items_count: blockscoutItemsCount(limit),
		},
	})
	return wire.items ?? []
}

/** REST v2 **`GET /transactions/{txHash}/token-transfers`** — paginated **`items`**. */
export const getBlockscoutTransactionTokenTransfers = async ({
	explorerOrigin,
	txHash,
	limit,
}: {
	explorerOrigin: string
	txHash: `0x${string}`
	limit: number
}): Promise<BlockscoutTokenTransferWire[]> => {
	if (limit <= 0) return []
	const normalized = hexLowerOfByteSize(txHash, 32)
	if (normalized == null) return []
	const wire = await getJson<BlockscoutPaginatedWire<BlockscoutTokenTransferWire>>({
		explorerOrigin,
		path: `/transactions/${normalized}/token-transfers`,
		searchParams: {
			items_count: blockscoutItemsCount(limit),
		},
	})
	return wire.items ?? []
}

/** REST v2 **`GET /transactions/{txHash}/internal-transactions`** — paginated **`items`**. */
export const getBlockscoutTransactionInternalTransactions = async ({
	explorerOrigin,
	txHash,
	limit,
}: {
	explorerOrigin: string
	txHash: `0x${string}`
	limit: number
}): Promise<BlockscoutInternalTransactionWire[]> => {
	if (limit <= 0) return []
	const normalized = hexLowerOfByteSize(txHash, 32)
	if (normalized == null) return []
	const wire = await getJson<BlockscoutPaginatedWire<BlockscoutInternalTransactionWire>>({
		explorerOrigin,
		path: `/transactions/${normalized}/internal-transactions`,
		searchParams: {
			items_count: blockscoutItemsCount(limit),
		},
	})
	return wire.items ?? []
}

/** REST v2 **`GET /addresses/{address}/internal-transactions`** — paginated **`items`**. */
export const getBlockscoutAddressInternalTransactions = async ({
	explorerOrigin,
	address,
	limit,
	searchParams,
}: {
	explorerOrigin: string
	address: `0x${string}`
	limit: number
	searchParams?: Record<string, string | number | undefined>
}): Promise<BlockscoutInternalTransactionWire[]> => {
	if (limit <= 0) return []
	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null) return []
	const wire = await getJson<BlockscoutPaginatedWire<BlockscoutInternalTransactionWire>>({
		explorerOrigin,
		path: `/addresses/${normalized}/internal-transactions`,
		searchParams: {
			...searchParams,
			items_count: blockscoutItemsCount(limit),
		},
	})
	return wire.items ?? []
}

export const getTransactionLogsBlockscout = async ({
	explorerOrigin,
	txHash,
}: {
	explorerOrigin: string
	txHash: `0x${string}`
}): Promise<RpcReceiptWire['logs']> => {
	const logs: NonNullable<RpcReceiptWire['logs']> = []
	let nextPageParams: Record<string, string | number> | undefined
	do {
		const wire = await getJson<BlockscoutPaginatedWire<BlockscoutTransactionLogWire>>({
			explorerOrigin,
			path: `/transactions/${txHash}/logs`,
			searchParams: nextPageParams,
		})
		logs.push(...blockscoutTransactionLogWiresAsRpcReceiptLogs(wire.items))
		nextPageParams = wire.next_page_params
	} while (nextPageParams != null)
	return logs
}

export const getTransactionReceiptBlockscout = async ({
	explorerOrigin,
	txHash,
}: {
	explorerOrigin: string
	txHash: `0x${string}`
}): Promise<RpcReceiptWire | null> => {
	const tx = await getJson<BlockscoutTransactionWire | null>({
		explorerOrigin,
		path: `/transactions/${txHash}`,
	})
	if (tx == null) return null
	const logs = await getTransactionLogsBlockscout({
		explorerOrigin,
		txHash,
	})
	return {
		status: tx.status === 'ok' ? '0x1' : tx.status === 'error' ? '0x0' : undefined,
		gasUsed: quantityHex(tx.gas_used),
		effectiveGasPrice: quantityHex(tx.gas_price),
		logs,
		contractAddress: addressHash(tx.created_contract),
	}
}

export const evmAddressFromBlockscoutContractListWire = (
	w: BlockscoutSmartContractForListWire,
): `0x${string}` | null => {
	const h = addressHash(w.address ?? w.address_hash)
	if (h == null || h === '') return null
	const normalized = h.startsWith('0x') ? h : `0x${h}`
	return hexLowerOfByteSize(normalized, 20) ?? null
}

export const getBlockscoutSmartContracts = async ({
	explorerOrigin,
	limit,
}: {
	explorerOrigin: string
	limit: number
}): Promise<BlockscoutSmartContractForListWire[]> => {
	if (limit <= 0) return []
	const wire = await getJson<BlockscoutPaginatedWire<BlockscoutSmartContractForListWire>>({
		explorerOrigin,
		path: '/smart-contracts',
		searchParams: {
			items_count: blockscoutItemsCount(limit),
		},
	})
	return wire.items
}

const blockscoutLegacyAbiFromWire = (
	wire: import('$/sources/Blockscout/Rest/types.ts').BlockscoutLegacyContractStatusWire,
): string | null => {
	if (wire.status === '1' && typeof wire.result === 'string' && wire.result.trim()) {
		return wire.result
	}
	if (wire.status !== '1' || !Array.isArray(wire.result)) return null
	const row = wire.result[0]
	const abi = row?.ABI
	return typeof abi === 'string' && abi.trim() ? abi : null
}

/** Legacy `module=contract` **`getabi`**, fallback **`getsourcecode`**. */
export const getBlockscoutContractAbiJsonString = async ({
	explorerOrigin,
	address,
}: {
	explorerOrigin: string
	address: `0x${string}`
}): Promise<string | null> => {
	const { getBlockscoutLegacyJson } = await import('$/sources/Blockscout/Rest/client.ts')
	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null) return null
	const abiWire = await getBlockscoutLegacyJson<import('$/sources/Blockscout/Rest/types.ts').BlockscoutLegacyContractStatusWire>({
		explorerOrigin,
		query: {
			module: 'contract',
			action: 'getabi',
			address: normalized,
		},
	})
	const abiFromGetAbi = blockscoutLegacyAbiFromWire(abiWire)
	if (abiFromGetAbi != null) return abiFromGetAbi
	const sourceWire = await getBlockscoutLegacyJson<import('$/sources/Blockscout/Rest/types.ts').BlockscoutLegacyContractStatusWire>({
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
export const getBlockscoutContractSourceCodeRow = async ({
	explorerOrigin,
	address,
}: {
	explorerOrigin: string
	address: `0x${string}`
}): Promise<import('$/sources/Blockscout/Rest/types.ts').BlockscoutLegacyContractSourceRowWire | null> => {
	const { getBlockscoutLegacyJson } = await import('$/sources/Blockscout/Rest/client.ts')
	const normalized = hexLowerOfByteSize(address, 20)
	if (normalized == null) return null
	const wire = await getBlockscoutLegacyJson<import('$/sources/Blockscout/Rest/types.ts').BlockscoutLegacyContractStatusWire>({
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

export const blockscoutEthGetCode = async ({
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

export const blockscoutEthGetStorageAt = async ({
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

const assertBlockscoutWireNoErrorPayload = (
	wire: unknown,
	debugLabel: string,
) => {
	if (wire !== null && typeof wire === 'object' && 'error' in wire) {
		const rawErr = (wire as { error?: unknown }).error
		if (rawErr != null && rawErr !== false && `${rawErr}`.length > 0) {
			throw new Error(`${debugLabel}: ${String(rawErr)}`)
		}
	}
	if (wire !== null && typeof wire === 'object' && 'errors' in wire) {
		const rawErr = (wire as { errors?: unknown }).errors
		if (rawErr != null && rawErr !== false && `${rawErr}`.length > 0) {
			throw new Error(`${debugLabel}: errors ${JSON.stringify(rawErr)}`)
		}
	}
}

/**
 * ERC-4337 registry on Blockscout (`/proxy/account-abstraction/*`).
 * Detail paths require a `0x`-prefixed hash.
 */
const blockscoutErc4337PathHash = (
	value: `0x${string}`,
	byteSize: 20 | 32,
	label: string,
) => {
	const normalized = hexLowerOfByteSize(value, byteSize)
	if (normalized == null) {
		throw new Error(`${label}: invalid hash`)
	}
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
}): Promise<BlockscoutErc4337RegistryEntryWire[]> => {
	if (limit <= 0) {
		throw new Error(`Blockscout GET ${relativePath}: limit must be positive`)
	}
	const raw = await getJson<
		BlockscoutPaginatedWire<BlockscoutErc4337RegistryEntryWire> & { error?: unknown }
	>({
		explorerOrigin,
		path: relativePath,
		searchParams: {
			page_size: blockscoutItemsCount(limit),
		},
	})
	assertBlockscoutWireNoErrorPayload(raw, `Blockscout GET ${relativePath}`)
	const items = raw.items ?? []
	if (items.length === 0) {
		throw new Error(`Blockscout GET ${relativePath}: empty registry page`)
	}
	return items
}

const getBlockscoutErc4337RegistryDetail = async ({
	explorerOrigin,
	address,
	relativePath,
}: {
	explorerOrigin: string
	address: `0x${string}`
	relativePath: string
}): Promise<BlockscoutErc4337RegistryEntryWire> => {
	const normalized = blockscoutErc4337PathHash(address, 20, 'Blockscout ERC-4337 registry detail')
	const path = `${relativePath}/${normalized}`
	const raw = await getJson<BlockscoutErc4337RegistryEntryWire & { error?: unknown }>({
		explorerOrigin,
		path,
	})
	assertBlockscoutWireNoErrorPayload(raw, `Blockscout GET ${path}`)
	return raw
}

export const getBlockscoutUserOperationsPage = async ({
	explorerOrigin,
	limit,
}: {
	explorerOrigin: string
	limit: number
}): Promise<BlockscoutUserOperationListItemWire[]> => {
	const relativePath = '/proxy/account-abstraction/operations'
	const raw = await getJson<
		BlockscoutPaginatedWire<BlockscoutUserOperationListItemWire> & { error?: unknown }
	>({
		explorerOrigin,
		path: relativePath,
		searchParams: {
			page_size: blockscoutItemsCount(limit),
		},
	})
	assertBlockscoutWireNoErrorPayload(raw, `Blockscout GET ${relativePath}`)
	const items = raw.items ?? []
	if (items.length === 0) {
		throw new Error(`Blockscout GET ${relativePath}: empty user operations page`)
	}
	return items
}

export const getBlockscoutUserOperationDetail = async ({
	explorerOrigin,
	hash,
}: {
	explorerOrigin: string
	hash: `0x${string}`
}): Promise<BlockscoutUserOperationDetailWire> => {
	const normalized = blockscoutErc4337PathHash(hash, 32, 'Blockscout user operation detail')
	const path = `/proxy/account-abstraction/operations/${normalized}`
	const raw = await getJson<
		BlockscoutUserOperationDetailWire & { error?: unknown }
	>({
		explorerOrigin,
		path,
	})
	assertBlockscoutWireNoErrorPayload(raw, `Blockscout GET ${path}`)
	return raw
}

export const getBlockscoutErc4337SmartAccountList = async (args: {
	explorerOrigin: string
	limit: number
}) => (
	getBlockscoutErc4337TopRegistryList({
		...args,
		relativePath: '/proxy/account-abstraction/accounts',
	})
)

export const getBlockscoutErc4337BundlerList = async (args: {
	explorerOrigin: string
	limit: number
}) => (
	getBlockscoutErc4337TopRegistryList({
		...args,
		relativePath: '/proxy/account-abstraction/bundlers',
	})
)

export const getBlockscoutErc4337PaymasterList = async (args: {
	explorerOrigin: string
	limit: number
}) => (
	getBlockscoutErc4337TopRegistryList({
		...args,
		relativePath: '/proxy/account-abstraction/paymasters',
	})
)

export const getBlockscoutErc4337AccountFactoryList = async (args: {
	explorerOrigin: string
	limit: number
}) => (
	getBlockscoutErc4337TopRegistryList({
		...args,
		relativePath: '/proxy/account-abstraction/factories',
	})
)

export const getBlockscoutErc4337SmartAccountDetail = async (args: {
	explorerOrigin: string
	address: `0x${string}`
}) => (
	getBlockscoutErc4337RegistryDetail({
		...args,
		relativePath: '/proxy/account-abstraction/accounts',
	})
)

export const getBlockscoutErc4337BundlerDetail = async (args: {
	explorerOrigin: string
	address: `0x${string}`
}) => (
	getBlockscoutErc4337RegistryDetail({
		...args,
		relativePath: '/proxy/account-abstraction/bundlers',
	})
)

export const getBlockscoutErc4337PaymasterDetail = async (args: {
	explorerOrigin: string
	address: `0x${string}`
}) => (
	getBlockscoutErc4337RegistryDetail({
		...args,
		relativePath: '/proxy/account-abstraction/paymasters',
	})
)

export const getBlockscoutErc4337AccountFactoryDetail = async (args: {
	explorerOrigin: string
	address: `0x${string}`
}) => (
	getBlockscoutErc4337RegistryDetail({
		...args,
		relativePath: '/proxy/account-abstraction/factories',
	})
)
