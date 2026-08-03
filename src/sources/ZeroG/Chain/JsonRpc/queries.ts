import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/ZeroG/bindings.ts'
import { evmExecutionJsonRpc } from '$/sources/_shared/interfaces/EvmExecutionJsonRpc/queries.ts'

const jsonRpc = evmExecutionJsonRpc({
	binding: bindings[Source.ZeroGChain_JsonRpc][0],
})

export const {
	getBlockNumber,
	getCode,
	getTransactionByHash,
	getTransactionReceipt,
} = jsonRpc

export const getBlockByNumber = (blockNumber: bigint) => jsonRpc.getBlockByNumber({
	blockNumber,
	txObjects: false,
})

export const getBlockWithTransactionsByNumber = (blockNumber: bigint) => jsonRpc.getBlockByNumber({
	blockNumber,
	txObjects: true,
})
