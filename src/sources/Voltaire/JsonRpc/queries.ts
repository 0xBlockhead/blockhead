import {
	SourceEndpointKind,
	SourceOperationGroup,
	type SourceBinding,
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
} from '$/sources/Voltaire/JsonRpc/types.ts'

export type ExecutionTransport = {
	binding: SourceBinding<Source.Voltaire_JsonRpc>
	endpoint: SourceEndpoint
	diagnosticLabel: string
}

export const voltaireJsonRpcTransports = (() => {
	const transports = bindings[Source.Voltaire_JsonRpc].flatMap((binding) => (
		binding.endpoints.map((endpoint) => ({
			binding,
			endpoint,
			diagnosticLabel: `${endpoint.locator} (${endpoint.endpointKind})`,
		}))
	))
	const transportsByChainId = Object.groupBy(
		transports,
		(transport) => Number(transport.binding.target.key)
	)
	const httpTransportsByChainId = Object.groupBy(
		transports.filter(
			(transport) => transport.endpoint.endpointKind === SourceEndpointKind.HttpUrl
		),
		(transport) => Number(transport.binding.target.key)
	)

	return {
		transportsByChainId,
		httpTransportsByChainId,
		providerTransportsByChainId: Object.groupBy(
			transports.filter((transport) => (
				typeof window === 'undefined'
				|| transport.endpoint.endpointKind !== SourceEndpointKind.WebSocketUrl
			)),
			(transport) => Number(transport.binding.target.key)
		),
		txpoolTransportsByChainId: Object.groupBy(
			transports.filter((transport) => (
				transport.endpoint.endpointKind === SourceEndpointKind.HttpUrl
				&& transport.binding.operationGroups.some(
					(operationGroup) => operationGroup === SourceOperationGroup.EvmRpcTxpool
				)
			)),
			(transport) => Number(transport.binding.target.key)
		),
	}
})()

export const getFeeHistoryForEndpoint = ({
	binding,
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
		binding,
		endpoint,
		blockCount,
		newestBlock,
		rewardPercentiles,
	})
)

export const getGasPriceForEndpoint = ({ binding, endpoint }: ExecutionTransport) => (
	getEvmGasPrice(binding, endpoint)
)

export const getMaxPriorityFeePerGasForEndpoint = ({ binding, endpoint }: ExecutionTransport) => (
	getEvmMaxPriorityFeePerGas(binding, endpoint)
)

export const getTxpoolStatusForEndpoint = ({ binding, endpoint }: ExecutionTransport) => (
	getEvmTxpoolStatus({
		binding,
		endpoint,
	})
)

export const getStorageAtForEndpoint = ({
	binding,
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
		binding,
		endpoint,
		address,
		slotQuantityHex,
		blockTag,
	})
)

export const getCodeForEndpoint = ({
	binding,
	endpoint,
	address,
	blockTag,
}: ExecutionTransport & {
	address: `0x${string}`
	blockTag?: `0x${string}` | 'latest' | 'pending' | 'safe' | 'finalized'
}) => (
	getEvmCode({
		binding,
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
	binding,
	endpoint,
}: ExecutionTransport): Promise<Provider> => {
	if (
		endpoint.endpointKind !== SourceEndpointKind.HttpUrl
		&& endpoint.endpointKind !== SourceEndpointKind.WebSocketUrl
	)
		throw new Error('Voltaire_JsonRpc: execution endpoint must be HTTP or WebSocket')

	return (
		endpoint.endpointKind === SourceEndpointKind.WebSocketUrl ?
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
) => {
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
	binding,
	endpoint,
}: ExecutionTransport) => {
	if (endpoint.endpointKind === SourceEndpointKind.HttpUrl)
		return BigInt(await getBlockNumber(binding, endpoint))

	const provider = await getProviderForExecutionUrl({
		binding,
		endpoint,
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
	binding,
	endpoint,
	blockNumber,
	fullTransactions = false,
}: ExecutionTransport & {
	blockNumber: bigint | 'latest'
	fullTransactions?: boolean
}) => {
	if (endpoint.endpointKind === SourceEndpointKind.HttpUrl) {
		const block = await getEvmBlockByNumber({
			binding,
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
				binding,
				endpoint,
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
	binding,
	endpoint,
	blockHash,
	fullTransactions = false,
}: ExecutionTransport & {
	blockHash: `0x${string}`
	fullTransactions?: boolean
}) => {
	if (endpoint.endpointKind === SourceEndpointKind.HttpUrl) {
		const block = await getEvmBlockByHash({
			binding,
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
				binding,
				endpoint,
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
	binding,
	endpoint,
	recentBlockDepth,
}: ExecutionTransport & {
	recentBlockDepth: number
}) => {
	const head = await getChainHeadNumberForEndpoint({
		binding,
		endpoint,
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
						binding,
						endpoint,
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
	binding,
	endpoint,
	txHash,
}: ExecutionTransport & {
	txHash: `0x${string}`
}) => {
	if (endpoint.endpointKind === SourceEndpointKind.HttpUrl)
		return getEvmTransactionByHash({
			binding,
			endpoint,
			txHash,
		})

	return narrowTxRpc(
		await jsonValueFromProviderRequest(
			(await getProviderForExecutionUrl({
				binding,
				endpoint,
			})).request({
				method: 'eth_getTransactionByHash',
				params: [txHash],
			})
		)
	)
}

export const getTransactionReceiptForEndpoint = async ({
	binding,
	endpoint,
	txHash,
}: ExecutionTransport & {
	txHash: `0x${string}`
}) => {
	if (endpoint.endpointKind === SourceEndpointKind.HttpUrl)
		return getEvmTransactionReceipt({
			binding,
			endpoint,
			txHash,
		})

	return narrowVoltaireReceiptRpc(
		await jsonValueFromProviderRequest(
			(await getProviderForExecutionUrl({
				binding,
				endpoint,
			})).request({
				method: 'eth_getTransactionReceipt',
				params: [txHash],
			})
		)
	)
}

export const debugTraceTransactionForEndpoint = async ({
	binding,
	endpoint,
	txHash,
}: ExecutionTransport & {
	txHash: `0x${string}`
}) => {
	if (endpoint.endpointKind === SourceEndpointKind.HttpUrl) {
		try {
			const traceJson = await jsonRpc2<JsonValue>(
				binding,
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
				binding,
				endpoint,
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
