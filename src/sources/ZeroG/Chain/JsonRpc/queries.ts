import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/ZeroG/bindings.ts'
import { evmExecutionJsonRpc } from '$/sources/_shared/interfaces/EvmExecutionJsonRpc/queries.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import { type as arktype } from 'arktype'

const binding = bindings[Source.ZeroGChain_JsonRpc][0]

const jsonRpc = evmExecutionJsonRpc({
	binding,
})

const quantityHexWire = arktype('/^0x[0-9a-fA-F]+$/')

const assertQuantityHex = (
	label: string,
	value: unknown
) => {
	try {
		return quantityHexWire.assert(value)
	} catch {
		throw new Error(`ZeroGChain_JsonRpc: invalid ${label} quantity`)
	}
}

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

export const getTransactionCount = async ({
	address,
	blockTag = 'latest',
}: {
	address: `0x${string}`
	blockTag?: 'latest' | `0x${string}`
}) => (
	BigInt(assertQuantityHex(
		'eth_getTransactionCount',
		await jsonRpc2<unknown>(
			binding,
			'eth_getTransactionCount',
			[
				address,
				blockTag,
			]
		)
	))
)
