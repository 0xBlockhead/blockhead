import { jsonRpc } from '$/sources/Evm/JsonRpc/client.ts'
import type {
	RpcBlockHeaderWire,
	RpcReceiptWire,
	RpcTxWire,
} from '$/sources/Evm/JsonRpc/types.ts'

const blockParam = (blockNumber: bigint | 'latest') => (
	blockNumber === 'latest' ?
		'latest'
	:	`0x${blockNumber.toString(16)}`
)

export const ethBlockNumber = ({ rpcUrl }: { rpcUrl: string }) => (
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
export const ethGasPrice = ({ rpcUrl }: { rpcUrl: string }) => (
	jsonRpc<string>({
		rpcUrl,
		method: 'eth_gasPrice',
		params: [],
	})
)

export const ethGetBlockByNumber = ({
	rpcUrl,
	blockNumber,
	txObjects,
}: {
	rpcUrl: string
	blockNumber: bigint | 'latest'
	txObjects: boolean
}) => (
	jsonRpc<RpcBlockHeaderWire | null>({
		rpcUrl,
		method: 'eth_getBlockByNumber',
		params: [blockParam(blockNumber), txObjects],
	})
)

export const ethGetTransactionByHash = ({
	rpcUrl,
	txHash,
}: {
	rpcUrl: string
	txHash: `0x${string}`
}) => (
	jsonRpc<RpcTxWire | null>({
		rpcUrl,
		method: 'eth_getTransactionByHash',
		params: [txHash],
	})
)

export const ethGetTransactionReceipt = ({
	rpcUrl,
	txHash,
}: {
	rpcUrl: string
	txHash: `0x${string}`
}) => (
	jsonRpc<RpcReceiptWire | null>({
		rpcUrl,
		method: 'eth_getTransactionReceipt',
		params: [txHash],
	})
)
