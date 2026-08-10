import {
	ZeroExHex,
	type EvmAddress,
} from '$/schema/ZeroExHex.ts'
import type {
	SourceBinding,
	SourceEndpoint,
} from '$/sources/SourceBinding.ts'
import {
	narrowRpcBlock,
	narrowRpcReceipt,
	narrowRpcTransaction,
	type RpcBlockWire,
	type RpcFeeHistory,
	type RpcTransactionWire,
	type RpcTxpoolStatus,
} from '$/sources/_shared/interfaces/EvmExecutionJsonRpc/types.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import {
	isJsonArray,
	isJsonNumber,
	isJsonObject,
	isJsonString,
	type JsonValue,
} from '$/typescript/JsonValue.ts'

type EvmExecutionJsonRpcRequest = (
	method: string,
	params?: JsonValue[]
) => Promise<JsonValue>

type EvmExecutionBlockTag = `0x${string}` | 'latest' | 'pending' | 'safe' | 'finalized'

type EvmExecutionCall = {
	to: typeof EvmAddress.infer
	input: typeof ZeroExHex.infer
	from?: typeof EvmAddress.infer
	value?: bigint
	blockTag?: EvmExecutionBlockTag
}

type RpcBlockWithTransactionObjects = Omit<RpcBlockWire, 'transactions'> & {
	transactions: RpcTransactionWire[]
}

type RpcBlockWithTransactionHashes = Omit<RpcBlockWire, 'transactions'> & {
	transactions: string[]
}

const blockParam = (blockNumber: bigint | 'latest') => (
	blockNumber === 'latest' ?
		'latest'
	:
		`0x${blockNumber.toString(16)}`
)

const quantityHex = (value: bigint) => (
	`0x${value.toString(16)}`
)

const callTransaction = ({
	to,
	input,
	from,
	value,
}: Omit<EvmExecutionCall, 'blockTag'>) => ({
	to,
	input,
	...(from != null && { from }),
	...(value != null && { value: quantityHex(value) }),
})

const narrowNullableResult = <_Result>(
	result: JsonValue,
	method: string,
	narrow: (result: JsonValue) => _Result | null
) => {
	if (result === null)
		return null

	const narrowed = narrow(result)
	if (narrowed == null)
		throw new Error(`EVM execution JSON-RPC ${method}: malformed result`)

	return narrowed
}

const stringResult = (result: JsonValue, method: string) => {
	if (!isJsonString(result))
		throw new Error(`EVM execution JSON-RPC ${method}: malformed result`)

	return result
}

const stringArray = (value: JsonValue | undefined) => (
	isJsonArray(value) && value.every(isJsonString) ?
		value
	:
		null
)

const numberArray = (value: JsonValue | undefined) => (
	isJsonArray(value) && value.every(isJsonNumber) ?
		value
	:
		null
)

const stringArrays = (value: JsonValue | undefined) => {
	if (!isJsonArray(value))
		return null

	const rows = value.flatMap((row) => {
		const strings = stringArray(row)
		return strings == null ? [] : [[...strings]]
	})
	return rows.length === value.length ? rows : null
}

const feeHistoryResult = (result: JsonValue): RpcFeeHistory => {
	if (!isJsonObject(result))
		throw new Error('EVM execution JSON-RPC eth_feeHistory: malformed result')

	const baseFeePerGas = stringArray(result['baseFeePerGas'])
	const gasUsedRatio = numberArray(result['gasUsedRatio'])
	const baseFeePerBlobGas = result['baseFeePerBlobGas'] == null ? undefined : stringArray(result['baseFeePerBlobGas'])
	const blobGasUsedRatio = result['blobGasUsedRatio'] == null ? undefined : numberArray(result['blobGasUsedRatio'])
	const reward = result['reward'] == null ? undefined : stringArrays(result['reward'])
	if (
		!isJsonString(result['oldestBlock'])
		|| baseFeePerGas == null
		|| gasUsedRatio == null
		|| baseFeePerBlobGas === null
		|| blobGasUsedRatio === null
		|| reward === null
	)
		throw new Error('EVM execution JSON-RPC eth_feeHistory: malformed result')

	return {
		oldestBlock: result['oldestBlock'],
		baseFeePerGas: [...baseFeePerGas],
		gasUsedRatio: [...gasUsedRatio],
		...(baseFeePerBlobGas != null && { baseFeePerBlobGas: [...baseFeePerBlobGas] }),
		...(blobGasUsedRatio != null && { blobGasUsedRatio: [...blobGasUsedRatio] }),
		...(reward != null && { reward }),
	}
}

const txpoolStatusResult = (result: JsonValue): RpcTxpoolStatus => {
	if (
		!isJsonObject(result)
		|| !isJsonString(result['pending'])
		|| !isJsonString(result['queued'])
	)
		throw new Error('EVM execution JSON-RPC txpool_status: malformed result')

	return {
		pending: result['pending'],
		queued: result['queued'],
	}
}

export const evmExecutionJsonRpc = ({
	binding,
	endpoint,
	request = (method, params) => jsonRpc2<JsonValue>(
		binding,
		method,
		params,
		endpoint
	),
}: {
	binding: SourceBinding
	endpoint?: SourceEndpoint
	request?: EvmExecutionJsonRpcRequest
}) => {
	function getBlockByNumber(requestParameters: {
		blockNumber: bigint | 'latest'
		txObjects: true
	}): Promise<RpcBlockWithTransactionObjects | null>
	function getBlockByNumber(requestParameters: {
		blockNumber: bigint | 'latest'
		txObjects: false
	}): Promise<RpcBlockWithTransactionHashes | null>
	function getBlockByNumber(requestParameters: {
		blockNumber: bigint | 'latest'
		txObjects: boolean
	}): Promise<RpcBlockWire | null>
	function getBlockByNumber({
		blockNumber,
		txObjects,
	}: {
		blockNumber: bigint | 'latest'
		txObjects: boolean
	}) {
		return request(
			'eth_getBlockByNumber',
			[blockParam(blockNumber), txObjects]
		).then((result) => {
			const block = narrowNullableResult(
				result,
				'eth_getBlockByNumber',
				narrowRpcBlock
			)
			if (block?.transactions.some((transaction) => (
				txObjects ? isJsonString(transaction) : !isJsonString(transaction)
			)) === true)
				throw new Error('EVM execution JSON-RPC eth_getBlockByNumber: malformed transaction representation')

			return block
		})
	}

	function getBlockByHash(requestParameters: {
		blockHash: string
		txObjects: true
	}): Promise<RpcBlockWithTransactionObjects | null>
	function getBlockByHash(requestParameters: {
		blockHash: string
		txObjects: false
	}): Promise<RpcBlockWithTransactionHashes | null>
	function getBlockByHash(requestParameters: {
		blockHash: string
		txObjects: boolean
	}): Promise<RpcBlockWire | null>
	function getBlockByHash({
		blockHash,
		txObjects,
	}: {
		blockHash: string
		txObjects: boolean
	}) {
		return request(
			'eth_getBlockByHash',
			[blockHash, txObjects]
		).then((result) => {
			const block = narrowNullableResult(
				result,
				'eth_getBlockByHash',
				narrowRpcBlock
			)
			if (block?.transactions.some((transaction) => (
				txObjects ? isJsonString(transaction) : !isJsonString(transaction)
			)) === true)
				throw new Error('EVM execution JSON-RPC eth_getBlockByHash: malformed transaction representation')

			return block
		})
	}

	return {
		getBlockNumber: () => request('eth_blockNumber')
			.then((result) => BigInt(stringResult(result, 'eth_blockNumber'))),
		getPeerCountObservation: () => request('net_peerCount')
			.then((result) => {
				const quantity = stringResult(result, 'net_peerCount')
				if (!/^0x(?:0|[1-9a-f][0-9a-f]*)$/i.test(quantity))
					throw new Error('EVM execution JSON-RPC net_peerCount: malformed QUANTITY result')

				const peerCount = BigInt(quantity)
				if (peerCount > BigInt(Number.MAX_SAFE_INTEGER))
					throw new Error('EVM execution JSON-RPC net_peerCount: peer count exceeds safe integer range')

				return {
					peerCount: Number(peerCount),
					fetchedAtMs: Date.now(),
				}
			}),
		getGasPrice: () => request('eth_gasPrice')
			.then((result) => stringResult(result, 'eth_gasPrice')),
		getMaxPriorityFeePerGas: () => request('eth_maxPriorityFeePerGas')
			.then((result) => stringResult(result, 'eth_maxPriorityFeePerGas')),
		getBlockByNumber,
		getBlockByHash,
		getTransactionByHash: ({
			txHash,
		}: {
			txHash: string
		}) => request(
			'eth_getTransactionByHash',
			[txHash]
		).then((result) => narrowNullableResult(
			result,
			'eth_getTransactionByHash',
			narrowRpcTransaction
		)),
		getTransactionReceipt: ({
			txHash,
		}: {
			txHash: string
		}) => request(
			'eth_getTransactionReceipt',
			[txHash]
		).then((result) => narrowNullableResult(
			result,
			'eth_getTransactionReceipt',
			narrowRpcReceipt
		)),
		getFeeHistory: ({
			blockCount,
			newestBlock,
			rewardPercentiles,
		}: {
			blockCount: number
			newestBlock: bigint | 'latest'
			rewardPercentiles?: readonly number[]
		}) => request(
			'eth_feeHistory',
			[
				quantityHex(BigInt(blockCount)),
				blockParam(newestBlock),
				[...(rewardPercentiles ?? [])],
			]
		).then(feeHistoryResult),
		getStorageAt: ({
			address,
			slotQuantityHex,
			blockTag = 'latest',
		}: {
			address: `0x${string}`
			slotQuantityHex: `0x${string}`
			blockTag?: EvmExecutionBlockTag
		}) => request(
			'eth_getStorageAt',
			[
				address,
				slotQuantityHex,
				blockTag,
			]
		).then((result) => stringResult(result, 'eth_getStorageAt')),
		getCode: ({
			address,
			blockTag = 'latest',
		}: {
			address: `0x${string}`
			blockTag?: EvmExecutionBlockTag
		}) => request(
			'eth_getCode',
			[
				address,
				blockTag,
			]
		).then((result) => stringResult(result, 'eth_getCode')),
		getCall: ({
			blockTag = 'latest',
			...transaction
		}: EvmExecutionCall) => request(
			'eth_call',
			[
				callTransaction(transaction),
				blockTag,
			]
		).then((result) => {
			if (!ZeroExHex.allows(result))
				throw new Error('EVM execution JSON-RPC eth_call: malformed result')

			return result
		}),
		estimateGas: ({
			blockTag,
			...transaction
		}: EvmExecutionCall) => request(
			'eth_estimateGas',
			[
				callTransaction(transaction),
				...(blockTag == null ? [] : [blockTag]),
			]
		).then((result) => BigInt(stringResult(result, 'eth_estimateGas'))),
		getTxpoolStatus: () => request('txpool_status', [])
			.then(txpoolStatusResult),
	}
}
