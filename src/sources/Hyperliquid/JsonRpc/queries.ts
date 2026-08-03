import { TransportType } from '$/constants/TransportType.ts'
import bindings from '$/sources/Hyperliquid/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { ApiFamily } from '$/sources/SourceBinding.ts'
import {
	getBlockByNumber as getEvmBlockByNumber,
	getBlockNumber as getEvmBlockNumber,
	getTransactionByHash as getEvmTransactionByHash,
	getTransactionReceipt as getEvmTransactionReceipt,
} from '$/sources/_shared/interfaces/EvmExecutionJsonRpc/queries.ts'

const binding = bindings[Source.Hyperliquid].find(
	({ apiFamily }) => apiFamily === ApiFamily.EvmExecutionJsonRpc
)

if (binding == null)
	throw new Error('Hyperliquid EVM binding is missing')

export const getBlockNumber = () => getEvmBlockNumber(binding)

export const getBlockByNumber = (blockNumber: bigint) => getEvmBlockByNumber({
	binding,
	blockNumber,
	txObjects: true,
})

export const getTransactionByHash = (txHash: string) => getEvmTransactionByHash({
	binding,
	txHash,
})

export const getTransactionReceipt = (txHash: string) => getEvmTransactionReceipt({
	binding,
	txHash,
})

export const hyperliquidJsonRpcEndpoints = binding.endpoints.map((endpoint) => ({
	url: endpoint.locator,
	transportType: TransportType.Http,
	providerName: 'Hyperliquid',
}))
