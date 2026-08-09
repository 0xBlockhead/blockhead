// Generated from APP.ts.

import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'

export const match = (param: string) => (
	matchEvmAddress(param)
	|| matchStringSegment(param)
)
