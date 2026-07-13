// Generated from APP.ts. Do not edit by hand.

import { match as matchNetworkCaip2 } from '$/params/networkCaip2.ts'
import { match as matchNetworkSlug } from '$/params/networkSlug.ts'

export const match = (param: string) => (
	matchNetworkCaip2(param)
	|| matchNetworkSlug(param)
)
