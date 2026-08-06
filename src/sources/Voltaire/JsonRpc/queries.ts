import type {
	BlockInclude,
	BlockStreamEvent,
	RetryOptions,
} from '@tevm/voltaire/block'

import { Source } from '$/sources/Source.ts'
import {
	SourceEndpointKind,
	SourceOperationGroup,
	sourceBindingId,
	type SourceBinding,
	type SourceEndpoint,
} from '$/sources/SourceBinding.ts'
import bindings from '$/sources/Voltaire/bindings.ts'
import { parseVoltaireCallTraceRpc } from '$/sources/Voltaire/JsonRpc/CallTrace.ts'
import { ens } from '$/sources/Voltaire/JsonRpc/ens.ts'
import { evmExecutionJsonRpc } from '$/sources/_shared/interfaces/EvmExecutionJsonRpc/queries.ts'
import { narrowRpcLog } from '$/sources/_shared/interfaces/EvmExecutionJsonRpc/types.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import {
	isJsonArray,
	isJsonObject,
	type JsonValue,
} from '$/typescript/JsonValue.ts'

type Provider = {
	request: (request: {
		method: string
		params?: JsonValue[]
	}) => Promise<unknown>
}

type BlockStreamOptions = {
	include?: BlockInclude
	signal?: AbortSignal
	fromBlock?: bigint
	maxQueuedBlocks?: number
	pollingInterval?: number
	retry?: RetryOptions
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

const providerForExecutionEndpoint = async (
	binding: SourceBinding<Source.Voltaire_JsonRpc>,
	endpoint: SourceEndpoint
): Promise<Provider> => {
	if (
		endpoint.endpointKind !== SourceEndpointKind.HttpUrl
		&& endpoint.endpointKind !== SourceEndpointKind.WebSocketUrl
	)
		throw new Error('Voltaire_JsonRpc: execution endpoint must be HTTP or WebSocket')

	return (
		endpoint.endpointKind === SourceEndpointKind.WebSocketUrl ?
			typeof window === 'undefined' ?
				import('@tevm/voltaire/provider').then(({ WebSocketProvider }) => new WebSocketProvider(endpoint.locator))
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

const executionTransport = (
	binding: SourceBinding<Source.Voltaire_JsonRpc>,
	endpoint: SourceEndpoint
) => {
	const provider = () => providerForExecutionEndpoint(binding, endpoint)
	const request: Provider['request'] = ({
		method,
		params,
	}) => (
		endpoint.endpointKind === SourceEndpointKind.HttpUrl ?
			jsonRpc2<JsonValue>(
				binding,
				method,
				params,
				endpoint
			)
		:
			provider().then((executionProvider) => executionProvider.request({
				method,
				params,
			}))
	)
	const jsonRpc = evmExecutionJsonRpc({
		binding,
		endpoint,
		request: (method, params) => jsonValueFromProviderRequest(request({
			method,
			params,
		})),
	})

	return {
		diagnosticLabel: `${sourceBindingId(binding)} ${endpoint.endpointKind} ${endpoint.locator}`,
		origin: endpoint.locator,
		...jsonRpc,
		getLogs: async ({
			address,
			topic0,
		}: {
			address: `0x${string}`
			topic0: `0x${string}`
		}) => {
			const result = await jsonValueFromProviderRequest(request({
				method: 'eth_getLogs',
				params: [{
					address,
					topics: [[topic0]],
					fromBlock: '0x0',
					toBlock: 'latest',
				}],
			}))
			if (!isJsonArray(result))
				throw new Error('Voltaire_JsonRpc: eth_getLogs returned a malformed result')

			const logs = result.map(narrowRpcLog)
			if (logs.some((log) => log == null))
				throw new Error('Voltaire_JsonRpc: eth_getLogs returned a malformed log')

			return logs
		},
		...ens({ request }),
		getRecentBlockWires: async ({
			recentBlockDepth,
		}: {
			recentBlockDepth: number
		}) => {
			const head = await jsonRpc.getBlockNumber()
			const blockNumbers = Array.from(
				{ length: recentBlockDepth },
				(_value, index) => head - BigInt(index)
			).filter((blockNumber) => blockNumber >= 0n)

			return {
				head,
				blockNumbers,
				wires: await Promise.all(
					blockNumbers.map((blockNumber) => jsonRpc.getBlockByNumber({
						blockNumber,
						txObjects: false,
					}))
				),
			}
		},
		debugTraceTransaction: async ({
			txHash,
		}: {
			txHash: `0x${string}`
		}) => {
			try {
				const traceJson = await jsonValueFromProviderRequest(request({
					method: 'debug_traceTransaction',
					params: [
						txHash,
						{ tracer: 'callTracer' },
					],
				}))
				return isJsonObject(traceJson) ? parseVoltaireCallTraceRpc(traceJson) : null
			} catch {
				return null
			}
		},
		iterateBlockStreamEvents: async function* (options: BlockStreamOptions) {
			yield* blockStreamEvents({
				provider: await provider(),
				...options,
			})
		},
	}
}

type ExecutionTransport = ReturnType<typeof executionTransport>

const transportRows = bindings[Source.Voltaire_JsonRpc].flatMap((binding) => (
	binding.endpoints.map((endpoint) => ({
		chainId: Number(binding.target.key),
		endpointKind: endpoint.endpointKind,
		operationGroups: binding.operationGroups,
		transport: executionTransport(binding, endpoint),
	}))
))

const transportsByChainId = (
	rows: typeof transportRows
): Partial<Record<number, ExecutionTransport[]>> => Object.fromEntries(
	Object.entries(Object.groupBy(rows, (row) => row.chainId)).map(([chainId, chainRows]) => [
		chainId,
		chainRows.map((row) => row.transport),
	])
)

export const voltaireJsonRpcTransports = {
	transportsByChainId: transportsByChainId(transportRows),
	httpTransportsByChainId: transportsByChainId(
		transportRows.filter((row) => row.endpointKind === SourceEndpointKind.HttpUrl)
	),
	providerTransportsByChainId: transportsByChainId(
		transportRows.filter((row) => (
			typeof window === 'undefined'
			|| row.endpointKind !== SourceEndpointKind.WebSocketUrl
		))
	),
	txpoolTransportsByChainId: transportsByChainId(
		transportRows.filter((row) => (
			row.endpointKind === SourceEndpointKind.HttpUrl
			&& row.operationGroups.some(
				(operationGroup) => operationGroup === SourceOperationGroup.EvmRpcTxpool
			)
		))
	),
}

const createLiveBlockStream = (provider: Provider) => (
	import('@tevm/voltaire/block').then(({ BlockStream }) => (
		// @ts-expect-error Provider is structurally compatible at runtime for JSON-RPC block streaming
		BlockStream({ provider })
	))
)

const blockStreamEvents = async function* ({
	provider,
	include = 'header',
	signal,
	fromBlock,
	maxQueuedBlocks,
	pollingInterval,
	retry,
}: BlockStreamOptions & {
	provider: Provider
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
