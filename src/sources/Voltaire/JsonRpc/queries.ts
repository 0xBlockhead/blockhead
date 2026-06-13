import {
	BlockStream,
	type BlockInclude,
	type BlocksEvent,
	type BlockStreamEvent,
	type StreamBlock,
	type RetryOptions,
} from '@tevm/voltaire/block'
import { Rpc } from '@tevm/voltaire/jsonrpc'
import { Hex } from '@tevm/voltaire/Hex'
import type { Provider } from '@tevm/voltaire/provider'

import type { ExecutionEndpoint } from '$/constants/ExecutionEndpoints.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { getHttpProvider, getWebsocketProvider } from '$/lib/voltaire.ts'

import {
	getBlockByNumber as getEvmBlockByNumber,
	getBlockNumber as getEvmBlockNumber,
} from '$/sources/Evm/JsonRpc/queries.ts'
import type { RpcBlockHeader, RpcLog, RpcReceipt, RpcTransaction } from '$/sources/Evm/JsonRpc/types.ts'
import { isJsonObject, type JsonValue } from '$/typescript/JsonValue.ts'

import { parseRawCallTrace } from '$/lib/evm-trace.ts'
import type { VoltaireBlockRpc, VoltaireReceiptRpc, VoltaireTxRpc } from './types.ts'

/** Voltaire `Provider.request` is EIP-1193 — JSON-shaped but untyped at the boundary. */
const jsonValueFromProviderRequest = async (
	// oxlint-disable-next-line typescript/no-restricted-types -- EIP-1193 Provider.request return
	requestPromise: Promise<unknown>,
): Promise<JsonValue> => {
	const result = await requestPromise
	// @ts-expect-error EIP-1193 JSON-RPC result is JSON-shaped but untyped on Provider.request
	const json: JsonValue = result
	return json
}


const narrowRpcLog = (entry: JsonValue): RpcLog | null => {
	if (!isJsonObject(entry)) return null
	return {
		address: typeof entry['address'] === 'string' ? entry['address'] : undefined,
		topics: (
			Array.isArray(entry['topics'])
			&& entry['topics'].every((t) => typeof t === 'string') ?
				entry['topics']
			:
				undefined
		),
		data: typeof entry['data'] === 'string' ? entry['data'] : undefined,
		blockNumber: typeof entry['blockNumber'] === 'string' ? entry['blockNumber'] : undefined,
		transactionHash: typeof entry['transactionHash'] === 'string' ? entry['transactionHash'] : undefined,
		logIndex: typeof entry['logIndex'] === 'string' ? entry['logIndex'] : undefined,
	}
}

export const narrowTxRpc = (raw: JsonValue): VoltaireTxRpc | null => {
	if (!isJsonObject(raw)) return null
	const blobRaw = raw['blobVersionedHashes']
	const blobVersionedHashes = (
		Array.isArray(blobRaw) && blobRaw.every((h) => typeof h === 'string') ?
			blobRaw
		:
			undefined
	)
	return {
		hash: typeof raw['hash'] === 'string' ? raw['hash'] : undefined,
		blockNumber: typeof raw['blockNumber'] === 'string' ? raw['blockNumber'] : undefined,
		blockHash: typeof raw['blockHash'] === 'string' ? raw['blockHash'] : undefined,
		transactionIndex: typeof raw['transactionIndex'] === 'string' ? raw['transactionIndex'] : undefined,
		from: typeof raw['from'] === 'string' ? raw['from'] : undefined,
		to: raw['to'] === null ? null : typeof raw['to'] === 'string' ? raw['to'] : undefined,
		value: typeof raw['value'] === 'string' ? raw['value'] : undefined,
		nonce: typeof raw['nonce'] === 'string' ? raw['nonce'] : undefined,
		input: typeof raw['input'] === 'string' ? raw['input'] : undefined,
		gas: typeof raw['gas'] === 'string' ? raw['gas'] : undefined,
		gasPrice: typeof raw['gasPrice'] === 'string' ? raw['gasPrice'] : undefined,
		maxFeePerGas: typeof raw['maxFeePerGas'] === 'string' ? raw['maxFeePerGas'] : undefined,
		maxPriorityFeePerGas: typeof raw['maxPriorityFeePerGas'] === 'string' ? raw['maxPriorityFeePerGas'] : undefined,
		type: typeof raw['type'] === 'string' ? raw['type'] : undefined,
		maxFeePerBlobGas: typeof raw['maxFeePerBlobGas'] === 'string' ? raw['maxFeePerBlobGas'] : undefined,
		...(blobVersionedHashes != null && { blobVersionedHashes }),
	}
}

export const narrowBlockRpc = (raw: JsonValue): VoltaireBlockRpc | null => {
	if (!isJsonObject(raw)) return null
	const number = raw['number']
	const hash = raw['hash']
	const parentHash = raw['parentHash']
	const miner = raw['miner']
	const gasUsed = raw['gasUsed']
	const gasLimit = raw['gasLimit']
	if (
		typeof number !== 'string'
		|| typeof hash !== 'string'
		|| typeof parentHash !== 'string'
		|| typeof miner !== 'string'
		|| typeof gasUsed !== 'string'
		|| typeof gasLimit !== 'string'
	) return null
	const timestampRaw = raw['timestamp']
	if (typeof timestampRaw !== 'string' && typeof timestampRaw !== 'number') return null
	const baseFeePerGas = raw['baseFeePerGas']
	const blobGasUsed = raw['blobGasUsed']
	const excessBlobGas = raw['excessBlobGas']
	const txs = raw['transactions']
	const transactions = (
		!Array.isArray(txs) ?
			undefined
		: txs.length === 0 ?
			[]
		: txs.every((t) => typeof t === 'string') ?
			txs
		: txs.every((t) => typeof t === 'object' && t !== null && !Array.isArray(t)) ?
			txs
				.map((t) => narrowTxRpc(t))
				.filter((t): t is VoltaireTxRpc => t != null)
		:
			undefined
	)
	return {
		number,
		hash,
		parentHash,
		timestamp: timestampRaw,
		miner,
		gasUsed,
		gasLimit,
		...(typeof baseFeePerGas === 'string' && { baseFeePerGas }),
		...(typeof blobGasUsed === 'string' && { blobGasUsed }),
		...(typeof excessBlobGas === 'string' && { excessBlobGas }),
		...(transactions != null && { transactions }),
	}
}

const narrowVoltaireReceiptRpc = (raw: JsonValue): VoltaireReceiptRpc | null => {
	if (!isJsonObject(raw)) return null
	const logsRaw = raw['logs']
	const logs = (
		Array.isArray(logsRaw) ?
			logsRaw.flatMap((entry) => (
				((log) => (
					log == null ? [] : [log]
				))(narrowRpcLog(entry))
			))
		:
			undefined
	)
	const contractAddressRaw = raw['contractAddress']
	const contractAddress = (
		contractAddressRaw === null ?
			null
		: typeof contractAddressRaw === 'string' ?
			contractAddressRaw
		:
			undefined
	)
	return {
		status: typeof raw['status'] === 'string' ? raw['status'] : undefined,
		gasUsed: typeof raw['gasUsed'] === 'string' ? raw['gasUsed'] : undefined,
		cumulativeGasUsed: typeof raw['cumulativeGasUsed'] === 'string' ? raw['cumulativeGasUsed'] : undefined,
		contractAddress,
		effectiveGasPrice: typeof raw['effectiveGasPrice'] === 'string' ? raw['effectiveGasPrice'] : undefined,
		blobGasUsed: typeof raw['blobGasUsed'] === 'string' ? raw['blobGasUsed'] : undefined,
		...(logs != null && { logs }),
	}
}


export const streamBlockToBlockRpcWire = (
	block: StreamBlock<BlockInclude> | VoltaireBlockRpc,
): VoltaireBlockRpc => {
	const transactions: VoltaireBlockRpc['transactions'] = (
		(
			'header' in block ?
				// oxlint-disable-next-line typescript/no-unnecessary-condition -- Voltaire runtime can omit body despite StreamBlock typing
				'body' in block && block.body != null ?
					block.body.transactions
				:
					[]
			:
				block.transactions
		) ?? []
	).map((transaction) => String(transaction))
	return {
		number: 'header' in block ? String(Hex.fromBigInt(block.header.number)) : block.number,
		hash: 'header' in block ? String(Hex.fromBytes(block.hash)) : block.hash,
		parentHash: 'header' in block ? String(Hex.fromBytes(block.header.parentHash)) : block.parentHash,
		timestamp: 'header' in block ? String(Hex.fromBigInt(block.header.timestamp)) : block.timestamp,
		miner: 'header' in block ? String(Hex.fromBytes(block.header.beneficiary)) : block.miner,
		gasUsed: 'header' in block ? String(Hex.fromBigInt(block.header.gasUsed)) : block.gasUsed,
		gasLimit: 'header' in block ? String(Hex.fromBigInt(block.header.gasLimit)) : block.gasLimit,
		...('header' in block ? block.header.baseFeePerGas != null && { baseFeePerGas: String(Hex.fromBigInt(block.header.baseFeePerGas)) } : block.baseFeePerGas != null && { baseFeePerGas: block.baseFeePerGas }),
		transactions,
	}
}

export const getBlockSpec = (n: number | bigint | 'latest'): 'latest' | `0x${string}` => (
	n === 'latest' ? 'latest' : Hex.fromBigInt(BigInt(n))
)

export const getProviderForExecutionUrl = ({
	url,
	transportType,
}: {
	url: string
	transportType: TransportType
}): Provider => (
	transportType === TransportType.WebSocket ?
		getWebsocketProvider(url)
	:
		getHttpProvider(url)
)

export const getProviderForExecutionEndpoint = (
	endpoint: ExecutionEndpoint,
): Provider => (
	getProviderForExecutionUrl({
		url: endpoint.url,
		transportType: endpoint.transportType,
	})
)

export const getBlockByNumber = async ({
	provider,
	blockNumber,
	fullTransactions = false,
}: {
	provider: Provider
	blockNumber: bigint | 'latest'
	fullTransactions?: boolean
}): Promise<VoltaireBlockRpc | null> => (
	narrowBlockRpc(
		await jsonValueFromProviderRequest(
			provider.request(
				Rpc.Eth.GetBlockByNumberRequest(
					blockNumber === 'latest' ? 'latest' : getBlockSpec(blockNumber),
					fullTransactions,
				),
			),
		),
	)
)

export const getBlockTransactionCountByNumber = async ({
	provider,
	blockNumber,
}: {
	provider: Provider
	blockNumber: bigint | 'latest'
}): Promise<bigint> => {
	const transactionCountHexUnknown = await provider.request(
		Rpc.Eth.GetBlockTransactionCountByNumberRequest(
			blockNumber === 'latest' ? 'latest' : getBlockSpec(blockNumber),
		),
	)
	if (typeof transactionCountHexUnknown !== 'string') {
		throw new Error('eth_getBlockTransactionCountByNumber: expected hex string')
	}
	return BigInt(transactionCountHexUnknown)
}

export const lookupTransactionByHash = async ({
	provider,
	txHash,
}: {
	provider: Provider
	txHash: `0x${string}`
}): Promise<{ tx: VoltaireTxRpc; receipt: VoltaireReceiptRpc | null }> => {
	const hashParam = Hex(txHash)
	const [txUnknown, receiptUnknown] = await Promise.all([
		jsonValueFromProviderRequest(
			provider.request(Rpc.Eth.GetTransactionByHashRequest(hashParam)),
		),
		jsonValueFromProviderRequest(
			provider.request(Rpc.Eth.GetTransactionReceiptRequest(hashParam)),
		),
	])
	const tx = narrowTxRpc(txUnknown)
	const receipt = narrowVoltaireReceiptRpc(receiptUnknown)
	if (tx == null) throw new Error('Transaction not found')
	return { tx, receipt }
}

/** BlockStream for live / reorg-aware blocks; prefer a WebSocket execution URL. */
export const createLiveBlockStream = (provider: Provider) => (
	// Voltaire `Provider.request` is untyped EIP-1193; `@tevm/voltaire/block` expects `TypedProvider` with stricter RPC param typing.
	// @ts-expect-error Provider is structurally compatible at runtime for JSON-RPC block streaming
	BlockStream({ provider })
)

export async function* iterateBlockStreamEvents({
	provider,
	include = 'header',
	signal,
	fromBlock,
	maxQueuedBlocks,
	pollingInterval,
	retry,
}: {
	provider: Provider
	include?: BlockInclude
	signal?: AbortSignal
	fromBlock?: bigint
	maxQueuedBlocks?: number
	pollingInterval?: number
	retry?: RetryOptions
}): AsyncGenerator<BlockStreamEvent<BlockInclude>, void, void> {
	const stream = createLiveBlockStream(provider)
	for await (const event of stream.watch({
		include,
		signal,
		fromBlock,
		maxQueuedBlocks,
		pollingInterval,
		retry,
	})) {
		yield event
	}
}

export async function* iterateBlockStreamBackfill({
	provider,
	fromBlock,
	toBlock,
	include = 'header',
	signal,
}: {
	provider: Provider
	fromBlock: bigint
	toBlock: bigint
	include?: BlockInclude
	signal?: AbortSignal
}): AsyncGenerator<BlocksEvent<BlockInclude>, void, void> {
	const stream = createLiveBlockStream(provider)
	for await (
		const event of stream.backfill({
			fromBlock,
			toBlock,
			include,
			signal,
		})
	)
		yield event
}

export const getChainHeadNumberForRpcUrl = async ({
	rpcUrl,
	transportType,
}: {
	rpcUrl: string
	transportType: TransportType
}): Promise<bigint> => {
	if (transportType === TransportType.Http) {
		const hex = await getEvmBlockNumber({ rpcUrl })
		return BigInt(hex)
	}
	const provider = getProviderForExecutionUrl({ url: rpcUrl, transportType })
	const hexUnknown = await provider.request(Rpc.Eth.BlockNumberRequest())
	if (typeof hexUnknown !== 'string') {
		throw new Error('eth_blockNumber: expected hex string')
	}
	return BigInt(hexUnknown)
}

export const getBlockByNumberForRpcUrl = async ({
	rpcUrl,
	transportType,
	blockNumber,
	fullTransactions = false,
}: {
	rpcUrl: string
	transportType: TransportType
	blockNumber: bigint | 'latest'
	fullTransactions?: boolean
}): Promise<VoltaireBlockRpc | null> => {
	if (transportType === TransportType.Http) {
		const block = await getEvmBlockByNumber({
			rpcUrl,
			blockNumber,
			txObjects: fullTransactions,
		})
		if (
			block == null
			|| block.number == null
			|| block.hash == null
			|| block.parentHash == null
			|| block.timestamp == null
			|| block.miner == null
			|| block.gasUsed == null
			|| block.gasLimit == null
		)
			return null

		return {
			number: block.number,
			hash: block.hash,
			parentHash: block.parentHash,
			timestamp: block.timestamp,
			miner: block.miner,
			gasUsed: block.gasUsed,
			gasLimit: block.gasLimit,
			...(block.baseFeePerGas != null && { baseFeePerGas: block.baseFeePerGas }),
			...(block.blobGasUsed != null && { blobGasUsed: block.blobGasUsed }),
			...(block.excessBlobGas != null && { excessBlobGas: block.excessBlobGas }),
			...(block.transactions != null && { transactions: block.transactions }),
		}
	}

	const provider = getProviderForExecutionUrl({ url: rpcUrl, transportType })
	return getBlockByNumber({ provider, blockNumber, fullTransactions })
}

export const getRecentBlockWiresForRpcUrl = async ({
	rpcUrl,
	transportType,
	recentBlockDepth,
}: {
	rpcUrl: string
	transportType: TransportType
	recentBlockDepth: number
}): Promise<{
	blockNumbers: bigint[]
	wires: (VoltaireBlockRpc | null)[]
}> => {
	const head = await getChainHeadNumberForRpcUrl({ rpcUrl, transportType })
	const blockNumbers = (
		Array.from(
			{ length: recentBlockDepth },
			(_, index) => head - BigInt(index),
		).filter((n) => n >= 0n)
	)
	const wires = await Promise.all(
		blockNumbers.map((blockNumber) => (
			Promise.race([
				getBlockByNumberForRpcUrl({
					rpcUrl,
					transportType,
					blockNumber,
					fullTransactions: false,
				}),
				new Promise<null>((resolve) => {
					setTimeout(() => resolve(null), 8_000)
				}),
			])
		)),
	)
	return { blockNumbers, wires }
}

export const getTransactionByHashForRpcUrl = async ({
	rpcUrl,
	transportType,
	txHash,
}: {
	rpcUrl: string
	transportType: TransportType
	txHash: `0x${string}`
}): Promise<VoltaireTxRpc | null> => {
	const provider = getProviderForExecutionUrl({ url: rpcUrl, transportType })
	return narrowTxRpc(
		await jsonValueFromProviderRequest(
			provider.request(Rpc.Eth.GetTransactionByHashRequest(Hex(txHash))),
		),
	)
}

export const debugTraceTransactionForRpcUrl = async ({
	rpcUrl,
	transportType,
	txHash,
}: {
	rpcUrl: string
	transportType: TransportType
	txHash: `0x${string}`
}) => {
	const provider = getProviderForExecutionUrl({ url: rpcUrl, transportType })
	try {
		const traceJson = await jsonValueFromProviderRequest(
			provider.request({
				method: 'debug_traceTransaction',
				params: [
					Hex(txHash),
					{ tracer: 'callTracer' },
				],
			}),
		)
		return (
			isJsonObject(traceJson) ?
				parseRawCallTrace(traceJson)
			:
				null
		)
	} catch {
		return null
	}
}

export const getTransactionReceiptForRpcUrl = async ({
	rpcUrl,
	transportType,
	txHash,
}: {
	rpcUrl: string
	transportType: TransportType
	txHash: `0x${string}`
}): Promise<VoltaireReceiptRpc | null> => (
	narrowVoltaireReceiptRpc(
		await jsonValueFromProviderRequest(
			getProviderForExecutionUrl({ url: rpcUrl, transportType }).request(
				Rpc.Eth.GetTransactionReceiptRequest(Hex(txHash)),
			),
		),
	)
)

export const lookupTransactionByHashForRpcUrl = async ({
	rpcUrl,
	transportType,
	txHash,
}: {
	rpcUrl: string
	transportType: TransportType
	txHash: `0x${string}`
}): Promise<{ tx: VoltaireTxRpc; receipt: VoltaireReceiptRpc | null }> => {
	const provider = getProviderForExecutionUrl({ url: rpcUrl, transportType })
	return lookupTransactionByHash({ provider, txHash })
}

export const getRpcHeader = (
	wire: VoltaireBlockRpc,
): RpcBlockHeader => ({
	number: wire.number,
	hash: wire.hash,
	parentHash: wire.parentHash,
	timestamp: (
		typeof wire.timestamp === 'number' ?
			`0x${BigInt(wire.timestamp).toString(16)}`
		:
			wire.timestamp
	),
	gasUsed: wire.gasUsed,
	gasLimit: wire.gasLimit,
	baseFeePerGas: wire.baseFeePerGas,
	miner: wire.miner,
	transactions: [...(wire.transactions ?? [])],
	...(wire.blobGasUsed != null && { blobGasUsed: wire.blobGasUsed }),
	...(wire.excessBlobGas != null && { excessBlobGas: wire.excessBlobGas }),
})

export const getRpcTx = (
	tx: VoltaireTxRpc,
	txHash: `0x${string}`,
): RpcTransaction => ({
	hash: tx.hash ?? txHash,
	blockHash: tx.blockHash,
	blockNumber: tx.blockNumber,
	from: tx.from,
	to: tx.to,
	gas: tx.gas,
	gasPrice: tx.gasPrice,
	...(tx.maxFeePerGas != null && { maxFeePerGas: tx.maxFeePerGas }),
	...(tx.maxPriorityFeePerGas != null && { maxPriorityFeePerGas: tx.maxPriorityFeePerGas }),
	...(tx.maxFeePerBlobGas != null && { maxFeePerBlobGas: tx.maxFeePerBlobGas }),
	input: tx.input,
	nonce: tx.nonce,
	transactionIndex: tx.transactionIndex,
	type: tx.type,
	value: tx.value,
})

export const getRpcReceipt = (
	receipt: VoltaireReceiptRpc | null,
): RpcReceipt | null => (
	receipt == null ?
		null
	:
		{
			status: receipt.status,
			gasUsed: receipt.gasUsed,
			cumulativeGasUsed: receipt.cumulativeGasUsed,
			effectiveGasPrice: receipt.effectiveGasPrice,
			blobGasUsed: receipt.blobGasUsed,
			logs: receipt.logs,
			contractAddress: receipt.contractAddress,
		}
)
