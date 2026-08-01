// Generated from APP.ts.

import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { match as matchNativeCurrencySlug } from '$/params/nativeCurrencySlug.ts'

export const match = (param: string) => (
	matchNativeCurrencySlug(param)
	|| matchEvmAddress(param)
)
