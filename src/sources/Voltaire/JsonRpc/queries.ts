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
import { type Provider, HttpProvider, WebSocketProvider } from '@tevm/voltaire/provider'

import { TransportType } from '$/constants/TransportType.ts'
import type { SourceOrigin } from '$/sources/SourceProvider.ts'
import type { ExecutionEndpoint } from '$/sources/Voltaire/JsonRpc/executionEndpoints.ts'

import {
	getBlockByHash as getEvmBlockByHash,
	getBlockByNumber as getEvmBlockByNumber,
	getBlockNumber as getEvmBlockNumber,
} from '$/sources/Evm/JsonRpc/queries.ts'
import { isJsonObject, type JsonValue } from '$/typescript/JsonValue.ts'

import {
	getRpcHeader,
	getRpcReceipt,
	getRpcTx,
	narrowBlockRpc,
	narrowTxRpc,
	narrowVoltaireReceiptRpc,
	parseVoltaireCallTraceRpc,
	type VoltaireBlockRpc,
	type VoltaireReceiptRpc,
	type VoltaireTxRpc,
} from './types.ts'

/** Voltaire `Provider.request` is EIP-1193 — JSON-shaped but untyped at the boundary. */
const jsonValueFromProviderRequest = async (
	// oxlint-disable-next-line typescript/no-restricted-types -- EIP-1193 Provider.request return
	requestPromise: Promise<unknown>
): Promise<JsonValue> => {
	const result = await requestPromise
	// @ts-expect-error EIP-1193 JSON-RPC result is JSON-shaped but untyped on Provider.request
	const json: JsonValue = result
	return json
}


export const streamBlockToBlockRpcWire = (
	block: StreamBlock<BlockInclude> | VoltaireBlockRpc
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

export const getProviderForExecutionUrl = async ({
	url,
	transportType,
}: {
	url: string
	transportType: TransportType
}): Promise<Provider> => (
	transportType === TransportType.WebSocket ?
		new WebSocketProvider(url)
	:
		new HttpProvider(url)
)

export const getProviderForExecutionEndpoint = (
	endpoint: ExecutionEndpoint
): Promise<Provider> => (
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
					fullTransactions
				)
			)
		)
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
			blockNumber === 'latest' ? 'latest' : getBlockSpec(blockNumber)
		)
	)
	if (typeof transactionCountHexUnknown !== 'string')
		throw new Error('eth_getBlockTransactionCountByNumber: expected hex string')
	return BigInt(transactionCountHexUnknown)
}

export const lookupTransactionByHash = async ({
	provider,
	txHash,
}: {
	provider: Provider
	txHash: `0x${string}`
}): Promise<{
	tx: VoltaireTxRpc
	receipt: VoltaireReceiptRpc | null
}> => {
	const hashParam = Hex(txHash)
	const [txUnknown, receiptUnknown] = await Promise.all([
		jsonValueFromProviderRequest(
			provider.request(Rpc.Eth.GetTransactionByHashRequest(hashParam))
		),
		jsonValueFromProviderRequest(
			provider.request(Rpc.Eth.GetTransactionReceiptRequest(hashParam))
		),
	])
	const tx = narrowTxRpc(txUnknown)
	const receipt = narrowVoltaireReceiptRpc(receiptUnknown)
	if (tx == null) throw new Error('Transaction not found')
	return {
		tx,
		receipt,
	}
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
	origins,
	transportType,
}: {
	rpcUrl: string
	origins: readonly SourceOrigin[]
	transportType: TransportType
}): Promise<bigint> => {
	if (transportType === TransportType.Http) {
		const hex = await getEvmBlockNumber({
			rpcUrl,
			origins,
		})
		return BigInt(hex)
	}
	const provider = await getProviderForExecutionUrl({
		url: rpcUrl,
		transportType,
	})
	const hexUnknown = await provider.request(Rpc.Eth.BlockNumberRequest())
	if (typeof hexUnknown !== 'string')
		throw new Error('eth_blockNumber: expected hex string')
	return BigInt(hexUnknown)
}

export const getBlockByNumberForRpcUrl = async ({
	rpcUrl,
	origins,
	transportType,
	blockNumber,
	fullTransactions = false,
}: {
	rpcUrl: string
	origins: readonly SourceOrigin[]
	transportType: TransportType
	blockNumber: bigint | 'latest'
	fullTransactions?: boolean
}): Promise<VoltaireBlockRpc | null> => {
	if (transportType === TransportType.Http) {
		const block = await getEvmBlockByNumber({
			rpcUrl,
			origins,
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

	const provider = await getProviderForExecutionUrl({
		url: rpcUrl,
		transportType,
	})
	return getBlockByNumber({
		provider,
		blockNumber,
		fullTransactions,
	})
}

export const getBlockByHashForRpcUrl = async ({
	rpcUrl,
	origins,
	transportType,
	blockHash,
	fullTransactions = false,
}: {
	rpcUrl: string
	origins: readonly SourceOrigin[]
	transportType: TransportType
	blockHash: `0x${string}`
	fullTransactions?: boolean
}): Promise<VoltaireBlockRpc | null> => {
	if (transportType === TransportType.Http) {
		const block = await getEvmBlockByHash({
			rpcUrl,
			origins,
			blockHash,
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

	return narrowBlockRpc(
		await jsonValueFromProviderRequest(
			(await getProviderForExecutionUrl({
				url: rpcUrl,
				transportType,
			})).request(
				Rpc.Eth.GetBlockByHashRequest(
					blockHash,
					fullTransactions
				)
			)
		)
	)
}

export const getRecentBlockWiresForRpcUrl = async ({
	rpcUrl,
	origins,
	transportType,
	recentBlockDepth,
}: {
	rpcUrl: string
	origins: readonly SourceOrigin[]
	transportType: TransportType
	recentBlockDepth: number
}): Promise<{
	blockNumbers: bigint[]
	wires: (VoltaireBlockRpc | null)[]
}> => {
	const head = await getChainHeadNumberForRpcUrl({
		rpcUrl,
		origins,
		transportType,
	})
	const blockNumbers = (
		Array.from(
			{ length: recentBlockDepth },
			(_, index) => head - BigInt(index)
			).filter((n) => n >= 0n)
	)
	const wires = await Promise.all(
		blockNumbers.map((blockNumber) => (
			Promise.race([
				getBlockByNumberForRpcUrl({
					rpcUrl,
					origins,
					transportType,
					blockNumber,
					fullTransactions: false,
				}),
				new Promise<null>((resolve) => {
					setTimeout(() => resolve(null), 8_000)
				}),
			])
		))
	)
	return {
		blockNumbers,
		wires,
	}
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
	const provider = await getProviderForExecutionUrl({
		url: rpcUrl,
		transportType,
	})
	return narrowTxRpc(
		await jsonValueFromProviderRequest(
			provider.request(Rpc.Eth.GetTransactionByHashRequest(Hex(txHash)))
		)
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
	const provider = await getProviderForExecutionUrl({
		url: rpcUrl,
		transportType,
	})
	try {
		const traceJson = await jsonValueFromProviderRequest(
			provider.request({
				method: 'debug_traceTransaction',
				params: [
					Hex(txHash),
					{ tracer: 'callTracer' },
				],
			})
		)
		return (
			isJsonObject(traceJson) ?
				parseVoltaireCallTraceRpc(traceJson)
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
}): Promise<VoltaireReceiptRpc | null> => {
	const provider = await getProviderForExecutionUrl({
		url: rpcUrl,
		transportType,
	})
	return narrowVoltaireReceiptRpc(
		await jsonValueFromProviderRequest(
			provider.request(Rpc.Eth.GetTransactionReceiptRequest(Hex(txHash)))
		)
	)
}

export const lookupTransactionByHashForRpcUrl = async ({
	rpcUrl,
	transportType,
	txHash,
}: {
	rpcUrl: string
	transportType: TransportType
	txHash: `0x${string}`
}): Promise<{
	tx: VoltaireTxRpc
	receipt: VoltaireReceiptRpc | null
}> => {
	const provider = await getProviderForExecutionUrl({
		url: rpcUrl,
		transportType,
	})
	return lookupTransactionByHash({
		provider,
		txHash,
	})
}
