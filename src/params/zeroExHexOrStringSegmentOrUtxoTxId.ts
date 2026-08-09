// Generated from APP.ts.

import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { match as matchUtxoTxId } from '$/params/utxoTxId.ts'
import { match as matchZeroExHex } from '$/params/zeroExHex.ts'

export const match = (param: string) => (
	matchZeroExHex(param)
	|| matchStringSegment(param)
	|| matchUtxoTxId(param)
)
