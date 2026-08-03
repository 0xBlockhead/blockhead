import type {
	SourceBinding,
	SourceEndpoint,
} from '$/sources/SourceBinding.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import {
	narrowRpcBlock,
	narrowRpcReceipt,
	narrowRpcTransaction,
	type RpcBlockWire,
	type RpcFeeHistory,
	type RpcTxpoolStatus,
	type RpcTransactionWire,
} from '$/sources/_shared/interfaces/EvmExecutionJsonRpc/types.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const blockParam = (blockNumber: bigint | 'latest') => (
	blockNumber === 'latest' ?
		'latest'
	:
		`0x${blockNumber.toString(16)}`
)

const quantityHex = (value: bigint) => (
	`0x${value.toString(16)}`
)

type EvmExecutionJsonRpcRequest = {
	binding: SourceBinding
	endpoint?: SourceEndpoint
}

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

export const getBlockNumber = async (
	binding: SourceBinding,
	endpoint?: SourceEndpoint
) => Number.parseInt(
	await jsonRpc2<`0x${string}`>(
		binding,
		'eth_blockNumber',
		undefined,
		endpoint
	),
	16
)

export const getGasPrice = (
	binding: SourceBinding,
	endpoint?: SourceEndpoint
) => (
	jsonRpc2<`0x${string}`>(
		binding,
		'eth_gasPrice',
		undefined,
		endpoint
	)
)

export const getMaxPriorityFeePerGas = (
	binding: SourceBinding,
	endpoint?: SourceEndpoint
) => (
	jsonRpc2<`0x${string}`>(
		binding,
		'eth_maxPriorityFeePerGas',
		undefined,
		endpoint
	)
)

type EvmExecutionBlockByNumberRequest<_TxObjects extends boolean> = {
	blockNumber: bigint | 'latest'
	txObjects: _TxObjects
} & EvmExecutionJsonRpcRequest

type RpcBlockWithTransactionObjects = Omit<RpcBlockWire, 'transactions'> & {
	transactions: RpcTransactionWire[]
}

type RpcBlockWithTransactionHashes = Omit<RpcBlockWire, 'transactions'> & {
	transactions: string[]
}

type EvmExecutionBlockByHashRequest<_TxObjects extends boolean> = {
	blockHash: string
	txObjects: _TxObjects
} & EvmExecutionJsonRpcRequest

export function getBlockByNumber(
	request: EvmExecutionBlockByNumberRequest<true>
): Promise<RpcBlockWithTransactionObjects | null>
export function getBlockByNumber(
	request: EvmExecutionBlockByNumberRequest<false>
): Promise<RpcBlockWithTransactionHashes | null>
export function getBlockByNumber(
	request: EvmExecutionBlockByNumberRequest<boolean>
): Promise<RpcBlockWire | null>
export function getBlockByNumber({
	binding,
	endpoint,
	blockNumber,
	txObjects,
}: EvmExecutionBlockByNumberRequest<boolean>) {
	return jsonRpc2<JsonValue>(
		binding,
		'eth_getBlockByNumber',
		[blockParam(blockNumber), txObjects],
		endpoint
	).then((result) => {
		const block = narrowNullableResult(
			result,
			'eth_getBlockByNumber',
			narrowRpcBlock
		)
		if (block?.transactions.some((transaction) => (
			txObjects ? typeof transaction === 'string' : typeof transaction !== 'string'
		)) === true)
			throw new Error('EVM execution JSON-RPC eth_getBlockByNumber: malformed transaction representation')

		return block
	})
}

export function getBlockByHash(
	request: EvmExecutionBlockByHashRequest<true>
): Promise<RpcBlockWithTransactionObjects | null>
export function getBlockByHash(
	request: EvmExecutionBlockByHashRequest<false>
): Promise<RpcBlockWithTransactionHashes | null>
export function getBlockByHash(
	request: EvmExecutionBlockByHashRequest<boolean>
): Promise<RpcBlockWire | null>
export function getBlockByHash({
	binding,
	endpoint,
	blockHash,
	txObjects,
}: EvmExecutionBlockByHashRequest<boolean>) {
	return jsonRpc2<JsonValue>(
		binding,
		'eth_getBlockByHash',
		[blockHash, txObjects],
		endpoint
	).then((result) => {
		const block = narrowNullableResult(
			result,
			'eth_getBlockByHash',
			narrowRpcBlock
		)
		if (block?.transactions.some((transaction) => (
			txObjects ? typeof transaction === 'string' : typeof transaction !== 'string'
		)) === true)
			throw new Error('EVM execution JSON-RPC eth_getBlockByHash: malformed transaction representation')

		return block
	})
}

export const getTransactionByHash = ({
	binding,
	endpoint,
	txHash,
}: {
	txHash: string
} & EvmExecutionJsonRpcRequest) => (
	jsonRpc2<JsonValue>(
		binding,
		'eth_getTransactionByHash',
		[txHash],
		endpoint
	).then((result) => narrowNullableResult(
		result,
		'eth_getTransactionByHash',
		narrowRpcTransaction
	))
)

export const getTransactionReceipt = ({
	binding,
	endpoint,
	txHash,
}: {
	txHash: string
} & EvmExecutionJsonRpcRequest) => (
	jsonRpc2<JsonValue>(
		binding,
		'eth_getTransactionReceipt',
		[txHash],
		endpoint
	).then((result) => narrowNullableResult(
		result,
		'eth_getTransactionReceipt',
		narrowRpcReceipt
	))
)

/**
 * Historical base fee and priority fee rewards — EIP-1559 fee market.
 * @see https://github.com/ethereum/execution-apis/blob/main/src/eth/fee_market.yaml
 */
export const getFeeHistory = ({
	binding,
	endpoint,
	blockCount,
	newestBlock,
	rewardPercentiles,
}: {
	blockCount: number
	newestBlock: bigint | 'latest'
	rewardPercentiles?: readonly number[]
} & EvmExecutionJsonRpcRequest) => (
	jsonRpc2<RpcFeeHistory>(
		binding,
		'eth_feeHistory',
		[
			quantityHex(BigInt(blockCount)),
			newestBlock === 'latest' ? 'latest' : quantityHex(newestBlock),
			[...(rewardPercentiles ?? [])],
		],
		endpoint
	)
)

/** `eth_getStorageAt` — execution storage slot at `address` for `quantityHex` slot index. */
export const getStorageAt = ({
	binding,
	endpoint,
	address,
	slotQuantityHex,
	blockTag = 'latest',
}: {
	address: `0x${string}`
	slotQuantityHex: `0x${string}`
	blockTag?: `0x${string}` | 'latest' | 'pending' | 'safe' | 'finalized'
} & EvmExecutionJsonRpcRequest) => (
	jsonRpc2<`0x${string}`>(
		binding,
		'eth_getStorageAt',
		[
			address,
			slotQuantityHex,
			blockTag,
		],
		endpoint
	)
)

/** `eth_getCode` — runtime bytecode at `address` for `blockTag`. */
export const getCode = ({
	binding,
	endpoint,
	address,
	blockTag = 'latest',
}: {
	address: `0x${string}`
	blockTag?: `0x${string}` | 'latest' | 'pending' | 'safe' | 'finalized'
} & EvmExecutionJsonRpcRequest) => (
	jsonRpc2<`0x${string}`>(
		binding,
		'eth_getCode',
		[
			address,
			blockTag,
		],
		endpoint
	)
)

export const getCall = ({
	binding,
	endpoint,
	to,
	data,
	blockTag = 'latest',
}: {
	to: `0x${string}`
	data: `0x${string}`
	blockTag?: `0x${string}` | 'latest' | 'pending' | 'safe' | 'finalized'
} & EvmExecutionJsonRpcRequest) => (
	jsonRpc2<`0x${string}`>(
		binding,
		'eth_call',
		[
			{
				to,
				data,
			},
			blockTag,
		],
		endpoint
	)
)

/** Geth-compatible txpool inspection — often disabled on public RPCs. */
export const getTxpoolStatus = ({
	binding,
	endpoint,
}: EvmExecutionJsonRpcRequest) => (
	jsonRpc2<RpcTxpoolStatus>(
		binding,
		'txpool_status',
		[],
		endpoint
	)
)
