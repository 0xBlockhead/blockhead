import { jsonRpc } from '$/sources/Evm/JsonRpc/client.ts'
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

export const getBlockNumber = ({ rpcUrl }: { rpcUrl: string }) => (
	jsonRpc<string>({
		rpcUrl,
		method: 'eth_blockNumber',
		params: [],
	})
)

/**
 * `eth_gasPrice` returns the current price per gas in wei.
 * @see https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gasprice
 * @see https://github.com/ethereum/execution-apis
 */
export const getGasPrice = ({ rpcUrl }: { rpcUrl: string }) => (
	jsonRpc<string>({
		rpcUrl,
		method: 'eth_gasPrice',
		params: [],
	})
)

export const getBlockByNumber = ({
	rpcUrl,
	blockNumber,
	txObjects,
}: {
	rpcUrl: string
	blockNumber: bigint | 'latest'
	txObjects: boolean
}) => (
	jsonRpc<RpcBlockHeader | null>({
		rpcUrl,
		method: 'eth_getBlockByNumber',
		params: [blockParam(blockNumber), txObjects],
	})
)

export const getTransactionByHash = ({
	rpcUrl,
	txHash,
}: {
	rpcUrl: string
	txHash: `0x${string}`
}) => (
	jsonRpc<RpcTransaction | null>({
		rpcUrl,
		method: 'eth_getTransactionByHash',
		params: [txHash],
	})
)

export const getTransactionReceipt = ({
	rpcUrl,
	txHash,
}: {
	rpcUrl: string
	txHash: `0x${string}`
}) => (
	jsonRpc<RpcReceipt | null>({
		rpcUrl,
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
	blockCount,
	newestBlock,
	rewardPercentiles,
}: {
	rpcUrl: string
	blockCount: number
	newestBlock: bigint | 'latest'
	rewardPercentiles?: readonly number[]
}) => (
	jsonRpc<RpcFeeHistory>({
		rpcUrl,
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
export const getMaxPriorityFeePerGas = ({ rpcUrl }: { rpcUrl: string }) => (
	jsonRpc<string>({
		rpcUrl,
		method: 'eth_maxPriorityFeePerGas',
		params: [],
	})
)

/** `eth_getStorageAt` — execution storage slot at `address` for `quantityHex` slot index. */
export const getStorageAt = ({
	rpcUrl,
	address,
	slotQuantityHex,
	blockTag = 'latest',
}: {
	rpcUrl: string
	address: `0x${string}`
	slotQuantityHex: `0x${string}`
	blockTag?: `0x${string}` | 'latest' | 'pending' | 'safe' | 'finalized'
}) => (
	jsonRpc<`0x${string}`>({
		rpcUrl,
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
	address,
	blockTag = 'latest',
}: {
	rpcUrl: string
	address: `0x${string}`
	blockTag?: `0x${string}` | 'latest' | 'pending' | 'safe' | 'finalized'
}) => (
	jsonRpc<`0x${string}`>({
		rpcUrl,
		method: 'eth_getCode',
		params: [
			address,
			blockTag,
		],
	})
)

export const call = ({
	rpcUrl,
	to,
	data,
	blockTag = 'latest',
}: {
	rpcUrl: string
	to: `0x${string}`
	data: `0x${string}`
	blockTag?: `0x${string}` | 'latest' | 'pending' | 'safe' | 'finalized'
}) => (
	jsonRpc<`0x${string}`>({
		rpcUrl,
		method: 'eth_call',
		params: [
			{
				to,
				data,
			} satisfies JsonValue as JsonValue,
			blockTag,
		],
	})
)

/** Geth-compatible txpool inspection — often disabled on public RPCs. */
export const getTxpoolStatus = ({ rpcUrl }: { rpcUrl: string }) => (
	jsonRpc<RpcTxpoolStatus>({
		rpcUrl,
		method: 'txpool_status',
		params: [],
	})
)
