import bindings from '$/sources/LitecoinCore/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { bitcoinCoreJsonRpc } from '$/sources/_shared/interfaces/BitcoinCoreJsonRpc/queries.ts'

const binding = bindings[Source.LitecoinCore_JsonRpc][0]

export const {
	getBlock,
	getRawTransaction,
} = bitcoinCoreJsonRpc(binding, true)
