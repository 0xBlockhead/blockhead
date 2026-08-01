import { TransportType } from '$/constants/TransportType.ts'
import { Source } from '$/sources/Source.ts'
import { ApiFamily } from '$/sources/SourceBinding.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import type {
	HyperliquidEvmBlock,
	HyperliquidEvmTransaction,
	HyperliquidEvmTransactionReceipt,
} from '$/sources/Hyperliquid/JsonRpc/types.ts'
import bindings from '$/sources/Hyperliquid/bindings.ts'

const binding = bindings[Source.Hyperliquid].find(
	({ apiFamily }) => apiFamily === ApiFamily.EvmExecutionJsonRpc
)

if (binding == null)
	throw new Error('Hyperliquid EVM binding is missing')

export const hyperliquidJsonRpcEndpoints = binding.endpoints.map((endpoint) => ({
	url: endpoint.locator,
	transportType: TransportType.Http,
	providerName: 'Hyperliquid',
}))

export const getBlockByNumber = ({
	height,
	includeTransactions = false,
}: {
	height: bigint
	includeTransactions?: boolean
}) => (
	jsonRpc2<HyperliquidEvmBlock | null>(
		binding,
		'eth_getBlockByNumber',
		[
			`0x${height.toString(16)}`,
			includeTransactions,
		]
	)
)

export const getBlockNumber = () => (
	jsonRpc2<string>(binding, 'eth_blockNumber', [])
)

export const getTransactionByHash = ({
	txHash,
}: {
	txHash: string
}) => (
	jsonRpc2<HyperliquidEvmTransaction | null>(binding, 'eth_getTransactionByHash', [txHash])
)

export const getTransactionReceipt = ({
	txHash,
}: {
	txHash: string
}) => (
	jsonRpc2<HyperliquidEvmTransactionReceipt | null>(binding, 'eth_getTransactionReceipt', [txHash])
)
