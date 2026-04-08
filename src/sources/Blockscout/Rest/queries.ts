import { getJson } from '$/sources/Blockscout/Rest/client.ts'
import type {
	BlockscoutBlockWire,
	BlockscoutPaginatedWire,
	BlockscoutTransactionLogWire,
	BlockscoutTransactionWire,
} from '$/sources/Blockscout/Rest/types.ts'
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

const addressHash = (wire: string | BlockscoutBlockWire['miner'] | BlockscoutTransactionWire['from'] | BlockscoutTransactionWire['to'] | BlockscoutTransactionWire['created_contract'] | BlockscoutTransactionLogWire['address_hash'] | undefined) => (
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
	input: wire.raw_input,
	nonce: wire.nonce != null ? `0x${wire.nonce.toString(16)}` : undefined,
	transactionIndex: wire.position != null ? `0x${wire.position.toString(16)}` : undefined,
	type: wire.type != null ? `0x${wire.type.toString(16)}` : undefined,
	value: wire.value,
})

const blockscoutTransactionLogWiresAsRpcReceiptLogs = (
	logs: BlockscoutTransactionLogWire[],
): RpcLogWire[] => (
	logs.map((log) => ({
		...(addressHash(log.address_hash) != null ? { address: addressHash(log.address_hash) } : {}),
		...(log.topics != null ? { topics: log.topics } : {}),
		...(log.data != null ? { data: log.data } : {}),
		...(log.block_number != null ? { blockNumber: `0x${log.block_number.toString(16)}` } : {}),
		...(log.transaction_hash != null ? { transactionHash: log.transaction_hash } : {}),
		...(log.index != null ? { logIndex: `0x${log.index.toString(16)}` } : {}),
	}))
)

export const getBlockByNumberBlockscout = async ({
	explorerOrigin,
	blockNumber,
}: {
	explorerOrigin: string
	blockNumber: bigint
}): Promise<RpcBlockHeaderWire | null> => {
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
	const wire = await getJson<BlockscoutPaginatedWire<BlockscoutBlockWire>>({
		explorerOrigin,
		path: '/blocks',
		searchParams: {
			items_count: limit,
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
	const wire = await getJson<BlockscoutPaginatedWire<BlockscoutTransactionWire>>({
		explorerOrigin,
		path: `/blocks/${blockNumber}/transactions`,
		searchParams: {
			items_count: limit,
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
	const wire = await getJson<BlockscoutPaginatedWire<BlockscoutTransactionWire>>({
		explorerOrigin,
		path: '/transactions',
		searchParams: {
			items_count: limit,
		},
	})
	return wire.items.map(blockscoutTransactionWireAsRpcTxWire)
}

const getTransactionLogsPageBlockscout = async ({
	explorerOrigin,
	txHash,
	nextPageParams,
}: {
	explorerOrigin: string
	txHash: `0x${string}`
	nextPageParams?: Record<string, string | number>
}) => getJson<BlockscoutPaginatedWire<BlockscoutTransactionLogWire>>({
	explorerOrigin,
	path: `/transactions/${txHash}/logs`,
	searchParams: nextPageParams,
})

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
		const wire = await getTransactionLogsPageBlockscout({
			explorerOrigin,
			txHash,
			nextPageParams,
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
	const [tx, logs] = await Promise.all([
		getJson<BlockscoutTransactionWire | null>({
			explorerOrigin,
			path: `/transactions/${txHash}`,
		}),
		getTransactionLogsBlockscout({
			explorerOrigin,
			txHash,
		}),
	])
	if (tx == null) return null
	return {
		status: tx.status === 'ok' ? '0x1' : tx.status === 'error' ? '0x0' : undefined,
		gasUsed: quantityHex(tx.gas_used),
		effectiveGasPrice: quantityHex(tx.gas_price),
		logs,
		contractAddress: addressHash(tx.created_contract),
	}
}
