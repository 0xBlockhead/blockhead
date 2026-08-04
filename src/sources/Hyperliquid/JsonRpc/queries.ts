import { TransportType } from '$/constants/TransportType.ts'
import bindings from '$/sources/Hyperliquid/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { ApiFamily } from '$/sources/SourceBinding.ts'
import { evmExecutionJsonRpc } from '$/sources/_shared/interfaces/EvmExecutionJsonRpc/queries.ts'

const binding = bindings[Source.Hyperliquid].find(
	({ apiFamily }) => apiFamily === ApiFamily.EvmExecutionJsonRpc
)

if (binding == null)
	throw new Error('Hyperliquid_JsonRpc: EVM binding is missing')

const jsonRpc = evmExecutionJsonRpc({ binding })

export const getBlockNumber = jsonRpc.getBlockNumber

export const getBlockByNumber = (blockNumber: bigint) => jsonRpc.getBlockByNumber({
	blockNumber,
	txObjects: true,
})

export const {
	getTransactionByHash,
	getTransactionReceipt,
} = jsonRpc

export const hyperliquidJsonRpcEndpoints = binding.endpoints.map((endpoint) => ({
	url: endpoint.locator,
	transportType: TransportType.Http,
	providerName: 'Hyperliquid',
}))
