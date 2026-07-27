import { TransportType } from '$/constants/TransportType.ts'
import {
	SourceEndpointKind,
	SourceOperationGroup,
	type SourceEndpoint,
} from '$/sources/SourceBinding.ts'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/Voltaire/bindings.ts'
import {
	getBlockByHash as getEvmBlockByHash,
	getBlockByNumber as getEvmBlockByNumber,
	getTransactionByHash as getEvmTransactionByHash,
	getTransactionReceipt as getEvmTransactionReceipt,
	getBlockNumber,
	getCode as getEvmCode,
	getFeeHistory as getEvmFeeHistory,
	getGasPrice as getEvmGasPrice,
	getMaxPriorityFeePerGas as getEvmMaxPriorityFeePerGas,
	getStorageAt as getEvmStorageAt,
	getTxpoolStatus as getEvmTxpoolStatus,
} from '$/sources/_shared/interfaces/EvmExecutionJsonRpc/queries.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
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

const bindingByEndpoint = new Map(
	bindings[Source.Voltaire_JsonRpc].flatMap((binding) => (
		binding.endpoints.map((endpoint) => [
			endpoint.locator,
			binding,
		])
	))
)

const bindingForEndpoint = (endpoint: SourceEndpoint) => {
	const binding = bindingByEndpoint.get(endpoint.locator)
	if (binding == null)
		throw new Error(`Voltaire_JsonRpc: undeclared execution endpoint ${endpoint.locator}`)

	return binding
}

export const voltaireJsonRpcTransports = (() => {
	const transportsByChainId = Object.groupBy(
		bindings[Source.Voltaire_JsonRpc].flatMap((binding) => (
			binding.endpoints.map((endpoint) => ({
				chainId: Number(binding.target.key),
				endpoint,
				transportType: (
					endpoint.endpointKind === SourceEndpointKind.HttpUrl ?
						TransportType.Http
					:
						TransportType.WebSocket
				),
				supportsTxpool: binding.operationGroups.includes(SourceOperationGroup.EvmRpcTxpool),
			}))
		)),
		(transport) => transport.chainId
	)

	return {
		transportsByChainId,
		transportByChainId: Object.fromEntries(
			Object.entries(transportsByChainId)
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
		),
	}
})()

export type ExecutionTransport = {
	endpoint: SourceEndpoint
	transportType: TransportType
	supportsTxpool: boolean
}

export const getFeeHistoryForEndpoint = ({
	endpoint,
	blockCount,
	newestBlock,
	rewardPercentiles,
}: ExecutionTransport & {
	blockCount: number
	newestBlock: bigint | 'latest'
	rewardPercentiles?: readonly number[]
}) => (
	getEvmFeeHistory({
		binding: bindingForEndpoint(endpoint),
		endpoint,
		blockCount,
		newestBlock,
		rewardPercentiles,
	})
)

export const getGasPriceForEndpoint = ({ endpoint }: ExecutionTransport) => (
	getEvmGasPrice(bindingForEndpoint(endpoint), endpoint)
)

export const getMaxPriorityFeePerGasForEndpoint = ({ endpoint }: ExecutionTransport) => (
	getEvmMaxPriorityFeePerGas(bindingForEndpoint(endpoint), endpoint)
)

export const getTxpoolStatusForEndpoint = ({ endpoint }: ExecutionTransport) => (
	getEvmTxpoolStatus({
		binding: bindingForEndpoint(endpoint),
		endpoint,
	})
)

export const getStorageAtForEndpoint = ({
	endpoint,
	address,
	slotQuantityHex,
	blockTag,
}: ExecutionTransport & {
	address: `0x${string}`
	slotQuantityHex: `0x${string}`
	blockTag?: `0x${string}` | 'latest' | 'pending' | 'safe' | 'finalized'
}) => (
	getEvmStorageAt({
		binding: bindingForEndpoint(endpoint),
		endpoint,
		address,
		slotQuantityHex,
		blockTag,
	})
)

export const getCodeForEndpoint = ({
	endpoint,
	address,
	blockTag,
}: ExecutionTransport & {
	address: `0x${string}`
	blockTag?: `0x${string}` | 'latest' | 'pending' | 'safe' | 'finalized'
}) => (
	getEvmCode({
		binding: bindingForEndpoint(endpoint),
		endpoint,
		address,
		blockTag,
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

export const getProviderForExecutionUrl = async ({
	endpoint,
	transportType,
}: {
	endpoint: SourceEndpoint
	transportType: TransportType
}): Promise<Provider> => {
	if (
		(
			transportType === TransportType.Http
			&& endpoint.endpointKind !== SourceEndpointKind.HttpUrl
		)
		|| (
			transportType === TransportType.WebSocket
			&& endpoint.endpointKind !== SourceEndpointKind.WebSocketUrl
		)
	)
		throw new Error('Voltaire_JsonRpc: transport type does not match its endpoint')

	const binding = bindingForEndpoint(endpoint)

	return (
		transportType === TransportType.WebSocket ?
			typeof window === 'undefined' ?
				getVoltaireProviderRuntime().then(({ WebSocketProvider }) => new WebSocketProvider(endpoint.locator))
			:
				Promise.reject(new Error('Voltaire_JsonRpc: RemoteLive WebSocket is unavailable directly in the browser'))
		:
			Promise.resolve({
				request: ({ method, params }) => jsonRpc2<JsonValue>(
					binding,
					method,
					params ?? [],
					endpoint
				),
			})
	)
}

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

export const getChainHeadNumberForEndpoint = async ({
	endpoint,
	transportType,
}: {
	endpoint: SourceEndpoint
	transportType: TransportType
}): Promise<bigint> => {
	if (transportType === TransportType.Http)
		return BigInt(await getBlockNumber(bindingForEndpoint(endpoint), endpoint))

	const provider = await getProviderForExecutionUrl({
		endpoint,
		transportType,
	})
	const hexUnknown = await provider.request({
		method: 'eth_blockNumber',
		params: [],
	})
	if (typeof hexUnknown !== 'string')
		throw new Error('eth_blockNumber: expected hex string')
	return BigInt(hexUnknown)
}

export const getBlockByNumberForEndpoint = async ({
	endpoint,
	transportType,
	blockNumber,
	fullTransactions = false,
}: {
	endpoint: SourceEndpoint
	transportType: TransportType
	blockNumber: bigint | 'latest'
	fullTransactions?: boolean
}): Promise<VoltaireBlockRpc | null> => {
	if (transportType === TransportType.Http) {
		const block = await getEvmBlockByNumber({
			binding: bindingForEndpoint(endpoint),
			endpoint,
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
				endpoint,
				transportType,
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

export const getBlockByHashForEndpoint = async ({
	endpoint,
	transportType,
	blockHash,
	fullTransactions = false,
}: {
	endpoint: SourceEndpoint
	transportType: TransportType
	blockHash: `0x${string}`
	fullTransactions?: boolean
}): Promise<VoltaireBlockRpc | null> => {
	if (transportType === TransportType.Http) {
		const block = await getEvmBlockByHash({
			binding: bindingForEndpoint(endpoint),
			endpoint,
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
				endpoint,
				transportType,
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

export const getRecentBlockWiresForEndpoint = async ({
	endpoint,
	transportType,
	recentBlockDepth,
}: {
	endpoint: SourceEndpoint
	transportType: TransportType
	recentBlockDepth: number
}): Promise<{
	blockNumbers: bigint[]
	wires: (VoltaireBlockRpc | null)[]
}> => {
	const head = await getChainHeadNumberForEndpoint({
		endpoint,
		transportType,
		binding: bindingForEndpoint(endpoint),
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
					getBlockByNumberForEndpoint({
						endpoint,
						transportType,
						binding: bindingForEndpoint(endpoint),
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

export const getTransactionByHashForEndpoint = async ({
	endpoint,
	transportType,
	txHash,
}: {
	endpoint: SourceEndpoint
	transportType: TransportType
	txHash: `0x${string}`
}): Promise<VoltaireTxRpc | null> => {
	if (transportType === TransportType.Http)
		return getEvmTransactionByHash({
			binding: bindingForEndpoint(endpoint),
			endpoint,
			txHash,
		})

	return narrowTxRpc(
		await jsonValueFromProviderRequest(
			(await getProviderForExecutionUrl({
				endpoint,
				transportType,
			})).request({
				method: 'eth_getTransactionByHash',
				params: [txHash],
			})
		)
	)
}

export const getTransactionReceiptForEndpoint = async ({
	endpoint,
	transportType,
	txHash,
}: {
	endpoint: SourceEndpoint
	transportType: TransportType
	txHash: `0x${string}`
}): Promise<VoltaireReceiptRpc | null> => {
	if (transportType === TransportType.Http)
		return getEvmTransactionReceipt({
			binding: bindingForEndpoint(endpoint),
			endpoint,
			txHash,
		})

	return narrowVoltaireReceiptRpc(
		await jsonValueFromProviderRequest(
			(await getProviderForExecutionUrl({
				endpoint,
				transportType,
			})).request({
				method: 'eth_getTransactionReceipt',
				params: [txHash],
			})
		)
	)
}

export const debugTraceTransactionForEndpoint = async ({
	endpoint,
	transportType,
	txHash,
}: {
	endpoint: SourceEndpoint
	transportType: TransportType
	txHash: `0x${string}`
}) => {
	if (transportType === TransportType.Http) {
		try {
			const traceJson = await jsonRpc2<JsonValue>(
				bindingForEndpoint(endpoint),
				'debug_traceTransaction',
				[
					txHash,
					{ tracer: 'callTracer' },
				],
				endpoint
			)
			return isJsonObject(traceJson) ? parseVoltaireCallTraceRpc(traceJson) : null
		} catch {
			return null
		}
	}

	try {
		const traceJson = await jsonValueFromProviderRequest(
			(await getProviderForExecutionUrl({
				endpoint,
				transportType,
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
