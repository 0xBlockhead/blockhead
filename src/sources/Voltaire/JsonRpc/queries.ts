import { TransportType } from '$/constants/TransportType.ts'
import { jsonRpc } from '$/sources/Evm/JsonRpc/client.ts'
import {
	SourceEndpointKind,
	SourceOperationGroup,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { sourceProviders } from '$/sources/$sourceProviders.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import {
	getBlockByHash as getEvmBlockByHash,
	getBlockByNumber as getEvmBlockByNumber,
	getBlockNumber as getEvmBlockNumber,
	getTransactionByHash as getEvmTransactionByHash,
	getTransactionReceipt as getEvmTransactionReceipt,
} from '$/sources/Evm/JsonRpc/queries.ts'
import {
	getBlockNumber,
	getGasPrice,
	getMaxPriorityFeePerGas,
} from '$/sources/_shared/interfaces/EvmExecutionJsonRpc/queries.ts'
import type { SourceOrigin } from '$/sources/SourceProvider.ts'
import { isJsonObject, type JsonValue } from '$/typescript/JsonValue.ts'
import {
	narrowBlockRpc,
	narrowTxRpc,
	narrowVoltaireReceiptRpc,
	parseVoltaireCallTraceRpc,
	type VoltaireBlockRpc,
	type VoltaireReceiptRpc,
	type VoltaireTxRpc,
} from '$/sources/Voltaire/JsonRpc/types.ts'

import {
	voltaireJsonRpcOriginsByChainId,
	voltaireJsonRpcTransportCandidates,
} from '$/sources/Voltaire/JsonRpc/executionEndpoints.ts'

const voltaireJsonRpcTransportCandidatesByChainId = Object.groupBy(
	voltaireJsonRpcTransportCandidates,
	(voltaireJsonRpcTransportCandidate) => voltaireJsonRpcTransportCandidate.chainId
)

const voltaireBindings = sourceProviders
	.filter((sourceProvider) => sourceProvider.provider === SourceProvider.Voltaire)
	.flatMap((sourceProvider) => sourceProvider.bindings)

export const voltaireJsonRpcTransportsWithOriginsByChainId = Object.fromEntries(
	Object.entries(voltaireJsonRpcTransportCandidatesByChainId)
		.map(([chainId, entries]) => [
			Number(chainId),
			entries.flatMap((entry) => {
				const binding = voltaireBindings.find((candidate) => (
					candidate.target.key === chainId
					&& candidate.endpoints.some((endpoint) => (
						endpoint.locator === entry.rpcUrl
						&& (
							(entry.transportType === TransportType.Http
								&& endpoint.endpointKind === SourceEndpointKind.HttpUrl)
							|| (entry.transportType === TransportType.WebSocket
								&& endpoint.endpointKind === SourceEndpointKind.WebSocketUrl)
						)
					))
				))
				return binding == null ?
					[]
				:
					[{
						...entry,
						binding,
						origins: voltaireJsonRpcOriginsByChainId[Number(chainId)],
					}]
			}),
		])
)

export const voltaireJsonRpcTransportWithOriginsByChainId = Object.fromEntries(
	Object.entries(voltaireJsonRpcTransportsWithOriginsByChainId)
		.flatMap(([chainId, entries]) => {
			const httpExecutionEndpoint = entries.find((entry) => entry.transportType === TransportType.Http)
			const executionEndpoint = httpExecutionEndpoint ?? entries.at(0)
			return executionEndpoint == null ?
				[]
			:
				[[
					Number(chainId),
					executionEndpoint,
				]]
		})
)

export type Provider = {
	request: (request: {
		method: string
		params?: JsonValue[]
	}) => Promise<unknown>
}

export type BlockInclude = 'header' | 'transactions' | 'receipts'

export type BlocksEvent<_BlockInclude extends BlockInclude> = {
	type: 'blocks'
	blocks: readonly unknown[]
	metadata: {
		chainHead: bigint
	}
}

export type BlockStreamEvent<_BlockInclude extends BlockInclude> =
	| BlocksEvent<_BlockInclude>
	| {
		type: 'reorg'
		metadata: {
			chainHead: bigint
		}
	}

export type RetryOptions = {
	maxRetries?: number
	initialDelay?: number
	maxDelay?: number
}

const getVoltaireProviderRuntime = () => import('@tevm/voltaire/provider')

const getVoltaireBlockRuntime = () => import('@tevm/voltaire/block')

const evmExecutionJsonRpcBindingKey = (
	chainId: number | string,
	operationGroup: SourceOperationGroup
) => `${String(chainId)}:${operationGroup}`

const evmExecutionJsonRpcBindingByChainIdAndOperationGroup: Partial<Record<string, SourceBinding>> = Object.fromEntries(
	voltaireBindings.flatMap((binding) => (
		binding.operationGroups.map((operationGroup) => [
			evmExecutionJsonRpcBindingKey(
				binding.target.key,
				operationGroup
			),
			binding,
		])
	))
)

export const getEvmExecutionJsonRpcBinding = ({
	chainId,
	operationGroup,
}: {
	chainId: number
	operationGroup: SourceOperationGroup
}): SourceBinding | undefined => evmExecutionJsonRpcBindingByChainIdAndOperationGroup[
	evmExecutionJsonRpcBindingKey(
		chainId,
		operationGroup
	)
]

export const getProviderForExecutionUrl = async ({
	url,
	transportType,
	binding,
}: {
	url: string
	transportType: TransportType
	binding?: SourceBinding
}): Promise<Provider> => (
	transportType === TransportType.WebSocket ?
		typeof window === 'undefined' ?
			getVoltaireProviderRuntime().then(({ WebSocketProvider }) => new WebSocketProvider(url))
		:
			Promise.reject(new Error('Voltaire_JsonRpc: RemoteLive WebSocket is unavailable directly in the browser'))
	:
		binding == null ?
			getVoltaireProviderRuntime().then(({ HttpProvider }) => new HttpProvider(url))
		:
			Promise.resolve({
				request: ({ method, params }) => jsonRpc<JsonValue>({
					rpcUrl: url,
					origins: [],
					binding,
					method,
					params: params ?? [],
				}),
			})
)

const jsonValueFromProviderRequest = async (
	// oxlint-disable-next-line typescript/no-restricted-types -- EIP-1193 Provider.request return
	requestPromise: Promise<unknown>
): Promise<JsonValue> => {
	const result = await requestPromise
	// @ts-expect-error EIP-1193 JSON-RPC result is JSON-shaped but untyped on Provider.request
	const json: JsonValue = result
	return json
}

const getBlockSpec = (blockNumber: bigint | 'latest'): 'latest' | `0x${string}` => (
	blockNumber === 'latest' ?
		'latest'
	:
		`0x${blockNumber.toString(16)}`
)

export const getChainHeadNumber = async ({
	chainId,
}: {
	chainId: number
}): Promise<number> => {
	const binding = getEvmExecutionJsonRpcBinding({
		chainId,
		operationGroup: SourceOperationGroup.EvmRpcCore,
	})
	if (binding == null)
		throw new Error(`Voltaire_JsonRpc: no EVM JSON-RPC core binding for chain ${chainId}`)

	return getBlockNumber(binding)
}

export const getCurrentGasPrice = async ({
	chainId,
}: {
	chainId: number
}): Promise<`0x${string}`> => {
	const binding = getEvmExecutionJsonRpcBinding({
		chainId,
		operationGroup: SourceOperationGroup.EvmRpcCore,
	})
	if (binding == null)
		throw new Error(`Voltaire_JsonRpc: no EVM JSON-RPC core binding for chain ${chainId}`)

	return getGasPrice(binding)
}

export const getCurrentMaxPriorityFeePerGas = async ({
	chainId,
}: {
	chainId: number
}): Promise<`0x${string}`> => {
	const binding = getEvmExecutionJsonRpcBinding({
		chainId,
		operationGroup: SourceOperationGroup.EvmRpcCore,
	})
	if (binding == null)
		throw new Error(`Voltaire_JsonRpc: no EVM JSON-RPC core binding for chain ${chainId}`)

	return getMaxPriorityFeePerGas(binding)
}

export const getChainHeadNumberForRpcUrl = async ({
	rpcUrl,
	origins,
	transportType,
	binding,
}: {
	rpcUrl: string
	origins: readonly SourceOrigin[]
	transportType: TransportType
	binding: SourceBinding
}): Promise<bigint> => {
	if (transportType === TransportType.Http)
		return BigInt(await getEvmBlockNumber({ rpcUrl, origins, binding }))

	const provider = await getProviderForExecutionUrl({
		url: rpcUrl,
		transportType,
		binding,
	})
	const hexUnknown = await provider.request({
		method: 'eth_blockNumber',
		params: [],
	})
	if (typeof hexUnknown !== 'string')
		throw new Error('eth_blockNumber: expected hex string')
	return BigInt(hexUnknown)
}

export const getBlockByNumberForRpcUrl = async ({
	rpcUrl,
	origins,
	transportType,
	binding,
	blockNumber,
	fullTransactions = false,
}: {
	rpcUrl: string
	origins: readonly SourceOrigin[]
	transportType: TransportType
	binding: SourceBinding
	blockNumber: bigint | 'latest'
	fullTransactions?: boolean
}): Promise<VoltaireBlockRpc | null> => {
	if (transportType === TransportType.Http) {
		const block = await getEvmBlockByNumber({
			rpcUrl,
			origins,
			binding,
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
		) return null

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
				binding,
			})).request({
				method: 'eth_getBlockByNumber',
				params: [
					getBlockSpec(blockNumber),
					fullTransactions,
				],
			})
		)
	)
}

export const getBlockByHashForRpcUrl = async ({
	rpcUrl,
	origins,
	transportType,
	binding,
	blockHash,
	fullTransactions = false,
}: {
	rpcUrl: string
	origins: readonly SourceOrigin[]
	transportType: TransportType
	binding: SourceBinding
	blockHash: `0x${string}`
	fullTransactions?: boolean
}): Promise<VoltaireBlockRpc | null> => {
	if (transportType === TransportType.Http) {
		const block = await getEvmBlockByHash({
			rpcUrl,
			origins,
			binding,
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
		) return null

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
				binding,
			})).request({
				method: 'eth_getBlockByHash',
				params: [
					blockHash,
					fullTransactions,
				],
			})
		)
	)
}

export const getRecentBlockWiresForRpcUrl = async ({
	rpcUrl,
	origins,
	transportType,
	binding,
	recentBlockDepth,
}: {
	rpcUrl: string
	origins: readonly SourceOrigin[]
	transportType: TransportType
	binding: SourceBinding
	recentBlockDepth: number
}): Promise<{
	blockNumbers: bigint[]
	wires: (VoltaireBlockRpc | null)[]
}> => {
	const head = await getChainHeadNumberForRpcUrl({
		rpcUrl,
		origins,
		transportType,
		binding,
	})
	const blockNumbers = (
		Array.from(
			{ length: recentBlockDepth },
			(_, index) => head - BigInt(index)
		)
			.filter((blockNumber) => blockNumber >= 0n)
	)
	return {
		blockNumbers,
		wires: await Promise.all(
			blockNumbers.map((blockNumber) => (
				Promise.race([
					getBlockByNumberForRpcUrl({
						rpcUrl,
						origins,
						transportType,
						binding,
						blockNumber,
						fullTransactions: false,
					}),
					new Promise<null>((resolve) => {
						setTimeout(() => resolve(null), 8_000)
					}),
				])
			))
		),
	}
}

export const getTransactionByHashForRpcUrl = async ({
	rpcUrl,
	origins,
	transportType,
	binding,
	txHash,
}: {
	rpcUrl: string
	origins: readonly SourceOrigin[]
	transportType: TransportType
	binding: SourceBinding
	txHash: `0x${string}`
}): Promise<VoltaireTxRpc | null> => {
	if (transportType === TransportType.Http)
		return getEvmTransactionByHash({
			rpcUrl,
			origins,
			binding,
			txHash,
		})

	return narrowTxRpc(
		await jsonValueFromProviderRequest(
			(await getProviderForExecutionUrl({
				url: rpcUrl,
				transportType,
				binding,
			})).request({
				method: 'eth_getTransactionByHash',
				params: [txHash],
			})
		)
	)
}

export const getTransactionReceiptForRpcUrl = async ({
	rpcUrl,
	origins,
	transportType,
	binding,
	txHash,
}: {
	rpcUrl: string
	origins: readonly SourceOrigin[]
	transportType: TransportType
	binding: SourceBinding
	txHash: `0x${string}`
}): Promise<VoltaireReceiptRpc | null> => {
	if (transportType === TransportType.Http)
		return getEvmTransactionReceipt({
			rpcUrl,
			origins,
			binding,
			txHash,
		})

	return narrowVoltaireReceiptRpc(
		await jsonValueFromProviderRequest(
			(await getProviderForExecutionUrl({
				url: rpcUrl,
				transportType,
				binding,
			})).request({
				method: 'eth_getTransactionReceipt',
				params: [txHash],
			})
		)
	)
}

export const debugTraceTransactionForRpcUrl = async ({
	rpcUrl,
	origins,
	transportType,
	binding,
	txHash,
}: {
	rpcUrl: string
	origins: readonly SourceOrigin[]
	transportType: TransportType
	binding: SourceBinding
	txHash: `0x${string}`
}) => {
	if (transportType === TransportType.Http) {
		try {
			const traceJson = await jsonRpc<JsonValue>({
				rpcUrl,
				origins,
				binding,
				method: 'debug_traceTransaction',
				params: [
					txHash,
					{ tracer: 'callTracer' },
				],
			})
			return isJsonObject(traceJson) ? parseVoltaireCallTraceRpc(traceJson) : null
		} catch {
			return null
		}
	}

	try {
		const traceJson = await jsonValueFromProviderRequest(
			(await getProviderForExecutionUrl({
				url: rpcUrl,
				transportType,
				binding,
			})).request({
				method: 'debug_traceTransaction',
				params: [
					txHash,
					{ tracer: 'callTracer' },
				],
			})
		)
		return isJsonObject(traceJson) ? parseVoltaireCallTraceRpc(traceJson) : null
	} catch {
		return null
	}
}

const createLiveBlockStream = (provider: Provider) => (
	getVoltaireBlockRuntime().then(({ BlockStream }) => (
		// @ts-expect-error Provider is structurally compatible at runtime for JSON-RPC block streaming
		BlockStream({ provider })
	))
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
	const stream = await createLiveBlockStream(provider)
	for await (const event of stream.watch({
		include,
		signal,
		fromBlock,
		maxQueuedBlocks,
		pollingInterval,
		retry,
	}))
		yield event
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
	const stream = await createLiveBlockStream(provider)
	for await (const event of stream.backfill({
		fromBlock,
		toBlock,
		include,
		signal,
	}))
		yield event
}
