import type {
	SourceBinding,
	SourceEndpoint,
} from '$/sources/SourceBinding.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import type {
	RpcBlockHeader,
	RpcFeeHistory,
	RpcReceipt,
	RpcTxpoolStatus,
	RpcTransaction,
} from '$/sources/_shared/interfaces/EvmExecutionJsonRpc/types.ts'

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

export const getBlockByNumber = ({
	binding,
	endpoint,
	blockNumber,
	txObjects,
}: {
	blockNumber: bigint | 'latest'
	txObjects: boolean
} & EvmExecutionJsonRpcRequest) => (
	jsonRpc2<RpcBlockHeader | null>(
		binding,
		'eth_getBlockByNumber',
		[blockParam(blockNumber), txObjects],
		endpoint
	)
)

export const getBlockByHash = ({
	binding,
	endpoint,
	blockHash,
	txObjects,
}: {
	blockHash: `0x${string}`
	txObjects: boolean
} & EvmExecutionJsonRpcRequest) => (
	jsonRpc2<RpcBlockHeader | null>(
		binding,
		'eth_getBlockByHash',
		[blockHash, txObjects],
		endpoint
	)
)

export const getTransactionByHash = ({
	binding,
	endpoint,
	txHash,
}: {
	txHash: `0x${string}`
} & EvmExecutionJsonRpcRequest) => (
	jsonRpc2<RpcTransaction | null>(
		binding,
		'eth_getTransactionByHash',
		[txHash],
		endpoint
	)
)

export const getTransactionReceipt = ({
	binding,
	endpoint,
	txHash,
}: {
	txHash: `0x${string}`
} & EvmExecutionJsonRpcRequest) => (
	jsonRpc2<RpcReceipt | null>(
		binding,
		'eth_getTransactionReceipt',
		[txHash],
		endpoint
	)
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
			} satisfies JsonValue,
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
