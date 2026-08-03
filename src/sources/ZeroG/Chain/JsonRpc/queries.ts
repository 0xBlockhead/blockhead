import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/ZeroG/bindings.ts'
import {
	getBlockByNumber as getEvmBlockByNumber,
	getBlockNumber as getEvmBlockNumber,
	getCode as getEvmCode,
	getTransactionByHash as getEvmTransactionByHash,
	getTransactionReceipt as getEvmTransactionReceipt,
} from '$/sources/_shared/interfaces/EvmExecutionJsonRpc/queries.ts'

const binding = bindings[Source.ZeroGChain_JsonRpc][0]

export const getBlockNumber = () => getEvmBlockNumber(binding)

export const getBlockByNumber = (blockNumber: bigint) => getEvmBlockByNumber({
	binding,
	blockNumber,
	txObjects: false,
})

export const getBlockWithTransactionsByNumber = (blockNumber: bigint) => getEvmBlockByNumber({
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

export const getCode = (address: `0x${string}`) => getEvmCode({
	binding,
	address,
})
