// Generated from APP.ts.

import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { match as matchPolkadotAccountId } from '$/params/polkadotAccountId.ts'
import { match as matchSolanaPubkey } from '$/params/solanaPubkey.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'

export const match = (param: string) => (
	matchPolkadotAccountId(param)
	|| matchStringSegment(param)
	|| matchEvmAddress(param)
	|| matchSolanaPubkey(param)
)
