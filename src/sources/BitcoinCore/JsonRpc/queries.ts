import bindings from '$/sources/BitcoinCore/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { bitcoinCoreJsonRpc } from '$/sources/_shared/interfaces/BitcoinCoreJsonRpc/queries.ts'

const binding = bindings[Source.BitcoinCore_JsonRpc][0]

export const {
	getBlock,
	getRawTransaction,
} = bitcoinCoreJsonRpc(binding)
