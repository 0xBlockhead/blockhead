// Generated from APP.ts. Do not edit by hand.

import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchSolanaPubkey } from '$/params/solanaPubkey.ts'

export const match = (param: string) => (
	matchNonNegativeInteger(param)
	|| matchSolanaPubkey(param)
)
