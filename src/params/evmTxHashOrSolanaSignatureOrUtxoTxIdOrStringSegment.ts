// Generated from APP.ts.

import { match as matchEvmTxHash } from '$/params/evmTxHash.ts'
import { match as matchSolanaSignature } from '$/params/solanaSignature.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { match as matchUtxoTxId } from '$/params/utxoTxId.ts'

export const match = (param: string) => (
	matchEvmTxHash(param)
	|| matchSolanaSignature(param)
	|| matchUtxoTxId(param)
	|| matchStringSegment(param)
)
