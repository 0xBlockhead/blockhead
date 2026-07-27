import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/ZeroG/bindings.ts'
import {
	getBlockByNumber as getEvmBlockByNumber,
	getBlockNumber as getEvmBlockNumber,
	getCode as getEvmCode,
	getTransactionByHash as getEvmTransactionByHash,
	getTransactionReceipt as getEvmTransactionReceipt,
} from '$/sources/_shared/interfaces/EvmExecutionJsonRpc/queries.ts'

const binding = bindings[Source.ZeroGChain_JsonRpc]

export const getBlockNumber = async (): Promise<`0x${string}`> => (
	`0x${(await getEvmBlockNumber(binding)).toString(16)}`
)

export const getBlockByNumber = ({
	blockNumber,
	txObjects,
}: {
	blockNumber: bigint | 'latest'
	txObjects: boolean
}) => (
	getEvmBlockByNumber({
		binding,
		blockNumber,
		txObjects,
	})
)

export const getTransactionByHash = ({
	txHash,
}: {
	txHash: `0x${string}`
}) => (
	getEvmTransactionByHash({
		binding,
		txHash,
	})
)

export const getTransactionReceipt = ({
	txHash,
}: {
	txHash: `0x${string}`
}) => (
	getEvmTransactionReceipt({
		binding,
		txHash,
	})
)

export const getCode = ({
	address,
	blockNumber = 'latest',
}: {
	address: `0x${string}`
	blockNumber?: bigint | 'latest'
}) => (
	getEvmCode({
		binding,
		address,
		blockTag: (
			blockNumber === 'latest' ?
				blockNumber
			:
				`0x${blockNumber.toString(16)}`
		),
	})
)
