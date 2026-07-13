// Generated from APP.ts. Do not edit by hand.

import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { match as matchPolkadotAccountId } from '$/params/polkadotAccountId.ts'
import { match as matchSolanaPubkey } from '$/params/solanaPubkey.ts'

export const match = (param: string) => (
	matchPolkadotAccountId(param)
	|| matchEvmAddress(param)
	|| matchSolanaPubkey(param)
)
