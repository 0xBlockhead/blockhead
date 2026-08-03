import bindings from '$/sources/LitecoinCore/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { bitcoinCoreJsonRpc } from '$/sources/_shared/interfaces/BitcoinCoreJsonRpc/queries.ts'

export const {
	getBlock,
	getRawTransaction,
} = bitcoinCoreJsonRpc(bindings[Source.LitecoinCore_JsonRpc][0], true)
