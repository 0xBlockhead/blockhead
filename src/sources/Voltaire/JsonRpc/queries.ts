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
import type { EIP1193Provider, Provider } from '@tevm/voltaire/provider'

import type { ExecutionEndpoint } from '$/constants/ExecutionEndpoints.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { getHttpProvider, getWebsocketProvider } from '$/lib/voltaire.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'

import { ethBlockNumber } from '$/sources/Evm/JsonRpc/queries.ts'
import type { RpcBlockHeaderWire, RpcReceiptWire, RpcTxWire } from '$/sources/Evm/JsonRpc/types.ts'

import type { VoltaireBlockRpc, VoltaireReceiptRpc, VoltaireTxRpc } from './types.ts'


export const streamBlockToVoltaireBlockRpcWire = (
	block: StreamBlock<'header'>,
): VoltaireBlockRpc => ({
	number: String(Hex.fromBigInt(block.header.number)),
	hash: String(Hex.fromBytes(block.hash)),
	parentHash: String(Hex.fromBytes(block.header.parentHash)),
	timestamp: String(Hex.fromBigInt(block.header.timestamp)),
	miner: String(Hex.fromBytes(block.header.beneficiary)),
	gasUsed: String(Hex.fromBigInt(block.header.gasUsed)),
	gasLimit: String(Hex.fromBigInt(block.header.gasLimit)),
	...(block.header.baseFeePerGas != null ?
		{ baseFeePerGas: String(Hex.fromBigInt(block.header.baseFeePerGas)) }
	:
		{}),
	transactions: [...block.body.transactions] as readonly string[],
})

export const toBlockSpec = (n: number | bigint | 'latest'): 'latest' | `0x${string}` => (
	n === 'latest' ? 'latest' : (Hex.fromBigInt(BigInt(n)) as `0x${string}`)
)

export const getVoltaireProviderForExecutionUrl = ({
	url,
	transportType,
}: {
	url: string
	transportType: TransportType
}): Provider => (
	transportType === TransportType.WebSocket ?
		getWebsocketProvider(url)
	:	getHttpProvider(url)
)

export const getVoltaireProviderForExecutionEndpoint = (
	endpoint: ExecutionEndpoint,
): Provider => (
	getVoltaireProviderForExecutionUrl({
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
	provider.request(
		Rpc.Eth.GetBlockByNumberRequest(
			blockNumber === 'latest' ? 'latest' : toBlockSpec(blockNumber),
			fullTransactions,
		),
	) as Promise<VoltaireBlockRpc | null>
)

export const getBlockTransactionCountByNumber = async ({
	provider,
	blockNumber,
}: {
	provider: Provider
	blockNumber: bigint | 'latest'
}): Promise<bigint> => {
	const transactionCountHex = await provider.request(
		Rpc.Eth.GetBlockTransactionCountByNumberRequest(
			blockNumber === 'latest' ? 'latest' : toBlockSpec(blockNumber),
		),
	) as string
	return BigInt(transactionCountHex)
}

export const lookupTransactionByHash = async ({
	provider,
	txHash,
}: {
	provider: Provider
	txHash: `0x${string}`
}): Promise<{ tx: VoltaireTxRpc; receipt: VoltaireReceiptRpc | null }> => {
	const [tx, receipt] = await Promise.all([
		provider.request(
			Rpc.Eth.GetTransactionByHashRequest(txHash as never),
		) as Promise<VoltaireTxRpc | null>,
		provider.request(
			Rpc.Eth.GetTransactionReceiptRequest(txHash as never),
		) as Promise<VoltaireReceiptRpc | null>,
	])
	if (tx == null) throw new Error('Transaction not found')
	return { tx, receipt }
}

/** BlockStream for live / reorg-aware blocks; prefer a WebSocket execution URL. */
export const createLiveBlockStream = (provider: Provider) => (
	BlockStream({ provider: provider as EIP1193Provider })
)

const logBlockStreamEvent = <_Include extends BlockInclude>(
	chainId: number,
	event: BlockStreamEvent<_Include>,
) => {
	if (event.type === 'blocks') {
		const chainHead = event.metadata.chainHead
		const blockNumbers = event.blocks.map((b) => String(b.header.number))
		console.info(
			`[block stream] chainId=${String(chainId)} type=blocks chainHead=${String(chainHead)} blockNumbers=${blockNumbers.join(',')}`,
		)
	} else {
		console.info(
			`[block stream] chainId=${String(chainId)} type=reorg removed=${String(event.removed.length)} added=${String(event.added.length)} commonAncestor=${String(event.commonAncestor.number)}`,
		)
	}
}

export async function* iterateBlockStreamEvents<_Include extends BlockInclude = 'header'>({
	provider,
	include = 'header' as _Include,
	signal,
	chainId,
	fromBlock,
	maxQueuedBlocks,
	pollingInterval,
	retry,
}: {
	provider: Provider
	include?: _Include
	signal?: AbortSignal
	/** When set, each `blocks` / `reorg` event is logged (E2E / no-events debugging). */
	chainId?: number
	fromBlock?: bigint
	maxQueuedBlocks?: number
	pollingInterval?: number
	retry?: RetryOptions
}): AsyncGenerator<BlockStreamEvent<_Include>, void, void> {
	const stream = createLiveBlockStream(provider)
	for await (const event of stream.watch({
		include,
		signal,
		fromBlock,
		maxQueuedBlocks,
		pollingInterval,
		retry,
	})) {
		if (chainId != null) {
			logBlockStreamEvent(chainId, event)
		}
		yield event
	}
}

export async function* iterateBlockStreamBackfill<_Include extends BlockInclude = 'header'>({
	provider,
	fromBlock,
	toBlock,
	include = 'header' as _Include,
	signal,
}: {
	provider: Provider
	fromBlock: bigint
	toBlock: bigint
	include?: _Include
	signal?: AbortSignal
}): AsyncGenerator<BlocksEvent<_Include>, void, void> {
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
		const hex = await ethBlockNumber({ rpcUrl })
		return BigInt(hex)
	}
	const provider = getVoltaireProviderForExecutionUrl({ url: rpcUrl, transportType })
	const hex = await provider.request(Rpc.Eth.BlockNumberRequest()) as string
	return BigInt(hex)
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
	const provider = getVoltaireProviderForExecutionUrl({ url: rpcUrl, transportType })
	return getBlockByNumber({ provider, blockNumber, fullTransactions })
}

export const getRecentVoltaireBlockWiresForRpcUrl = async ({
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
	const head = await singleFlight(getChainHeadNumberForRpcUrl)({ rpcUrl, transportType })
	const blockNumbers = (
		Array.from(
			{ length: recentBlockDepth },
			(_, index) => head - BigInt(index),
		).filter((n) => n >= 0n)
	)
	const wires = await Promise.all(
		blockNumbers.map((blockNumber) => (
			singleFlight(getBlockByNumberForRpcUrl)({
				rpcUrl,
				transportType,
				blockNumber,
				fullTransactions: false,
			})
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
	const provider = getVoltaireProviderForExecutionUrl({ url: rpcUrl, transportType })
	return provider.request(
		Rpc.Eth.GetTransactionByHashRequest(txHash as never),
	) as Promise<VoltaireTxRpc | null>
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
	getVoltaireProviderForExecutionUrl({ url: rpcUrl, transportType }).request(
		Rpc.Eth.GetTransactionReceiptRequest(txHash as never),
	) as Promise<VoltaireReceiptRpc | null>
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
	const provider = getVoltaireProviderForExecutionUrl({ url: rpcUrl, transportType })
	return lookupTransactionByHash({ provider, txHash })
}

export const voltaireBlockWireAsRpcHeader = (
	wire: VoltaireBlockRpc,
): RpcBlockHeaderWire => ({
	number: wire.number,
	hash: wire.hash,
	parentHash: wire.parentHash,
	timestamp: (
		typeof wire.timestamp === 'number' ?
			`0x${BigInt(wire.timestamp).toString(16)}`
		:	wire.timestamp
	),
	gasUsed: wire.gasUsed,
	gasLimit: wire.gasLimit,
	baseFeePerGas: wire.baseFeePerGas,
	miner: wire.miner,
	transactions: wire.transactions as unknown[],
})

/** Row value for `Network.$$evmBlocks` (Voltaire source); shared by resolver and live writes. */
export const evmBlockNetworkFieldValueFromVoltaireWire = ({
	chainId,
	wire,
}: {
	chainId: number
	wire: VoltaireBlockRpc
}): {
	[EntityMetaKey.Id]: {
		$network: { chainId: number }
		blockNumber: bigint
		hash?: `0x${string}`
	}
	number: bigint
	timestamp?: number
	gasUsed?: bigint
	gasLimit?: bigint
	baseFeePerGas?: bigint
	transactionCount: number
} | null => {
	const blockHeader = voltaireBlockWireAsRpcHeader(wire)
	let blockNumber: bigint
	try {
		blockNumber = BigInt(wire.number)
	} catch {
		return null
	}
	const blockHash = (
		typeof blockHeader.hash === 'string' && Hex.isHex(blockHeader.hash) && Hex.size(blockHeader.hash) === 32 ?
			blockHeader.hash.toLowerCase() as `0x${string}`
		:
			undefined
	)
	const timestampSeconds = (
		typeof blockHeader.timestamp === 'string' ? ((parsed) => (
			Number.isFinite(parsed) && Number.isInteger(parsed) && parsed >= 0 ?
				parsed
			:
				NaN
		))(Number(blockHeader.timestamp)) : NaN
	)
	return {
		[EntityMetaKey.Id]: {
			$network: { chainId },
			blockNumber,
			...(blockHash != null ?
				{ hash: blockHash }
			:	{}),
		},
		number: blockNumber,
		timestamp: ((timestampSeconds) => (
			Number.isFinite(timestampSeconds) ? timestampSeconds * 1000 : undefined
		))(timestampSeconds),
		gasUsed: (
			typeof blockHeader.gasUsed === 'string' ? ((value) => (
				value == null || value < 0n ? undefined : value
			))((() => {
				try {
					return BigInt(blockHeader.gasUsed)
				} catch {
					return undefined
				}
			})()) : undefined
		),
		gasLimit: (
			typeof blockHeader.gasLimit === 'string' ? ((value) => (
				value == null || value < 0n ? undefined : value
			))((() => {
				try {
					return BigInt(blockHeader.gasLimit)
				} catch {
					return undefined
				}
			})()) : undefined
		),
		baseFeePerGas: (
			typeof blockHeader.baseFeePerGas === 'string' ? ((value) => (
				value == null || value < 0n ? undefined : value
			))((() => {
				try {
					return BigInt(blockHeader.baseFeePerGas)
				} catch {
					return undefined
				}
			})()) : undefined
		),
		transactionCount: (blockHeader.transactions ?? []).length,
	}
}

export const voltaireTxWireAsRpcTx = (
	tx: VoltaireTxRpc,
	txHash: `0x${string}`,
): RpcTxWire => ({
	hash: tx.hash ?? txHash,
	blockHash: tx.blockHash,
	blockNumber: tx.blockNumber,
	from: tx.from,
	to: tx.to,
	gas: tx.gas,
	gasPrice: tx.gasPrice,
	input: tx.input,
	nonce: tx.nonce,
	transactionIndex: tx.transactionIndex,
	type: tx.type,
	value: tx.value,
})

export const voltaireReceiptWireAsRpcReceipt = (
	receipt: VoltaireReceiptRpc | null,
): RpcReceiptWire | null => (
	receipt == null ?
		null
	:	{
			status: receipt.status,
			gasUsed: receipt.gasUsed,
			effectiveGasPrice: receipt.effectiveGasPrice,
			logs: receipt.logs as RpcReceiptWire['logs'],
			contractAddress: receipt.contractAddress,
		}
)
