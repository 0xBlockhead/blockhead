import {
	BlockStream,
	type BlockInclude,
	type BlocksEvent,
	type BlockStreamEvent,
} from '@tevm/voltaire/block'
import { Rpc } from '@tevm/voltaire/jsonrpc'
import { Hex } from '@tevm/voltaire/Hex'
import type { EIP1193Provider, Provider } from '@tevm/voltaire/provider'

import type { ExecutionEndpoint } from '$/constants/ExecutionEndpoints.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { getHttpProvider, getWebsocketProvider } from '$/lib/voltaire.ts'

import type { RpcBlockHeaderWire, RpcReceiptWire, RpcTxWire } from '$/sources/Evm/JsonRpc/types.ts'

import type { VoltaireBlockRpc, VoltaireReceiptRpc, VoltaireTxRpc } from './types.ts'

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
	const hex = await provider.request(
		Rpc.Eth.GetBlockTransactionCountByNumberRequest(
			blockNumber === 'latest' ? 'latest' : toBlockSpec(blockNumber),
		),
	) as string
	return BigInt(hex)
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

export async function* iterateBlockStreamEvents<_Include extends BlockInclude = 'header'>({
	provider,
	include = 'header' as _Include,
	signal,
}: {
	provider: Provider
	include?: _Include
	signal?: AbortSignal
}): AsyncGenerator<BlockStreamEvent<_Include>, void, void> {
	const stream = createLiveBlockStream(provider)
	for await (const event of stream.watch({ include, signal }))
		yield event
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

export const lookupTransactionByHashForRpcUrlOrNull = async ({
	rpcUrl,
	transportType,
	txHash,
}: {
	rpcUrl: string
	transportType: TransportType
	txHash: `0x${string}`
}): Promise<{ tx: VoltaireTxRpc; receipt: VoltaireReceiptRpc | null } | null> => {
	try {
		return await lookupTransactionByHashForRpcUrl({ rpcUrl, transportType, txHash })
	} catch {
		return null
	}
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
