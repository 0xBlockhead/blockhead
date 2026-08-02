import bindings from '$/sources/DogecoinCore/bindings.ts'
import type { DogecoinCoreBlock } from '$/sources/DogecoinCore/JsonRpc/types.ts'
import { Source } from '$/sources/Source.ts'
import { bitcoinCoreJsonRpc } from '$/sources/_shared/interfaces/BitcoinCoreJsonRpc/queries.ts'

const binding = bindings[Source.DogecoinCore_JsonRpc][0]

export const {
	getBlock,
	getRawTransaction,
} = bitcoinCoreJsonRpc<DogecoinCoreBlock>(binding)
