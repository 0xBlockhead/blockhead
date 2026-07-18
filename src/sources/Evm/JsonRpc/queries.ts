import { jsonRpc } from '$/sources/Evm/JsonRpc/client.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { SourceOrigin } from '$/sources/SourceProvider.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import type {
	RpcBlockHeader,
	RpcFeeHistory,
	RpcReceipt,
	RpcTxpoolStatus,
	RpcTransaction,
} from '$/sources/Evm/JsonRpc/types.ts'

const blockParam = (blockNumber: bigint | 'latest') => (
	blockNumber === 'latest' ?
		'latest'
	:
		`0x${blockNumber.toString(16)}`
)

type JsonRpcRequestBase = {
	rpcUrl: string
	origins: readonly SourceOrigin[]
	binding?: SourceBinding
}

export const getBlockNumber = ({ rpcUrl, origins, binding }: JsonRpcRequestBase) => (
	jsonRpc<string>({
		rpcUrl,
		origins,
		binding,
		method: 'eth_blockNumber',
		params: [],
	})
)

/**
 * `eth_gasPrice` returns the current price per gas in wei.
 * @see https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gasprice
 * @see https://github.com/ethereum/execution-apis
 */
export const getGasPrice = ({ rpcUrl, origins, binding }: JsonRpcRequestBase) => (
	jsonRpc<string>({
		rpcUrl,
		origins,
		binding,
		method: 'eth_gasPrice',
		params: [],
	})
)

export const getBlockByNumber = ({
	rpcUrl,
	origins,
	binding,
	blockNumber,
	txObjects,
}: {
	blockNumber: bigint | 'latest'
	txObjects: boolean
} & JsonRpcRequestBase) => (
	jsonRpc<RpcBlockHeader | null>({
		rpcUrl,
		origins,
		binding,
		method: 'eth_getBlockByNumber',
		params: [blockParam(blockNumber), txObjects],
	})
)

export const getBlockByHash = ({
	rpcUrl,
	origins,
	binding,
	blockHash,
	txObjects,
}: {
	blockHash: `0x${string}`
	txObjects: boolean
} & JsonRpcRequestBase) => (
	jsonRpc<RpcBlockHeader | null>({
		rpcUrl,
		origins,
		binding,
		method: 'eth_getBlockByHash',
		params: [blockHash, txObjects],
	})
)

export const getTransactionByHash = ({
	rpcUrl,
	origins,
	binding,
	txHash,
}: {
	txHash: `0x${string}`
} & JsonRpcRequestBase) => (
	jsonRpc<RpcTransaction | null>({
		rpcUrl,
		origins,
		binding,
		method: 'eth_getTransactionByHash',
		params: [txHash],
	})
)

export const getTransactionReceipt = ({
	rpcUrl,
	origins,
	binding,
	txHash,
}: {
	txHash: `0x${string}`
} & JsonRpcRequestBase) => (
	jsonRpc<RpcReceipt | null>({
		rpcUrl,
		origins,
		binding,
		method: 'eth_getTransactionReceipt',
		params: [txHash],
	})
)

const quantityHex = (value: bigint) => (
	`0x${value.toString(16)}`
)

/**
 * Historical base fee and priority fee rewards — EIP-1559 fee market.
 * @see https://github.com/ethereum/execution-apis/blob/main/src/eth/fee_market.yaml
 */
export const getFeeHistory = ({
	rpcUrl,
	origins,
	binding,
	blockCount,
	newestBlock,
	rewardPercentiles,
}: {
	blockCount: number
	newestBlock: bigint | 'latest'
	rewardPercentiles?: readonly number[]
} & JsonRpcRequestBase) => (
	jsonRpc<RpcFeeHistory>({
		rpcUrl,
		origins,
		binding,
		method: 'eth_feeHistory',
		params: [
			quantityHex(BigInt(blockCount)),
			newestBlock === 'latest' ? 'latest' : quantityHex(newestBlock),
			[...(rewardPercentiles ?? [])],
		],
	})
)

/**
 * `@see https://github.com/ethereum/execution-apis/blob/main/src/eth/fee_market.yaml` — not supported on all networks.
 */
export const getMaxPriorityFeePerGas = ({ rpcUrl, origins, binding }: JsonRpcRequestBase) => (
	jsonRpc<string>({
		rpcUrl,
		origins,
		binding,
		method: 'eth_maxPriorityFeePerGas',
		params: [],
	})
)

/** `eth_getStorageAt` — execution storage slot at `address` for `quantityHex` slot index. */
export const getStorageAt = ({
	rpcUrl,
	origins,
	binding,
	address,
	slotQuantityHex,
	blockTag = 'latest',
}: {
	address: `0x${string}`
	slotQuantityHex: `0x${string}`
	blockTag?: `0x${string}` | 'latest' | 'pending' | 'safe' | 'finalized'
} & JsonRpcRequestBase) => (
	jsonRpc<`0x${string}`>({
		rpcUrl,
		origins,
		binding,
		method: 'eth_getStorageAt',
		params: [
			address,
			slotQuantityHex,
			blockTag,
		],
	})
)

/** `eth_getCode` — runtime bytecode at `address` for `blockTag`. */
export const getCode = ({
	rpcUrl,
	origins,
	binding,
	address,
	blockTag = 'latest',
}: {
	address: `0x${string}`
	blockTag?: `0x${string}` | 'latest' | 'pending' | 'safe' | 'finalized'
} & JsonRpcRequestBase) => (
	jsonRpc<`0x${string}`>({
		rpcUrl,
		origins,
		binding,
		method: 'eth_getCode',
		params: [
			address,
			blockTag,
		],
	})
)

export const getCall = ({
	rpcUrl,
	origins,
	binding,
	to,
	data,
	blockTag = 'latest',
}: {
	to: `0x${string}`
	data: `0x${string}`
	blockTag?: `0x${string}` | 'latest' | 'pending' | 'safe' | 'finalized'
} & JsonRpcRequestBase) => (
	jsonRpc<`0x${string}`>({
		rpcUrl,
		origins,
		binding,
		method: 'eth_call',
		params: [
			{
				to,
				data,
			} satisfies JsonValue,
			blockTag,
		],
	})
)

/** Geth-compatible txpool inspection — often disabled on public RPCs. */
export const getTxpoolStatus = ({ rpcUrl, origins, binding }: JsonRpcRequestBase) => (
	jsonRpc<RpcTxpoolStatus>({
		rpcUrl,
		origins,
		binding,
		method: 'txpool_status',
		params: [],
	})
)
