/**
 * Allium wallet balances and token metadata endpoints (fail-closed arktype).
 * @see https://docs.allium.so/api/developer/wallets/latest-token-balances.md
 * @see https://docs.allium.so/api/developer/tokens/get-tokens-by-chain-address.md
 */

import { type as arktype } from 'arktype'


const nonEmptyString = arktype('string > 0')
const nonNegativeInteger = arktype('number.integer >= 0')
const unsignedIntegerString = arktype(/^(0|[1-9][0-9]*)$/)
const decimals = arktype('0 <= number.integer <= 255')

export const alliumTokenInfoWire = arktype({
	name: nonEmptyString,
	symbol: nonEmptyString,
}).onUndeclaredKey('delete')

export const alliumTokenAttributesWire = arktype({
	'image_url?': 'string | null',
	'total_liquidity_usd?': arktype({
		'amount?': 'number | null',
		'details?': 'string | null',
	}).or(arktype.null),
}).onUndeclaredKey('delete')

export const alliumTokenWire = arktype({
	chain: nonEmptyString,
	address: nonEmptyString,
	'type?': 'string | null',
	'price?': 'number | null',
	'decimals?': decimals.or(arktype.null),
	'info?': alliumTokenInfoWire.or(arktype.null),
	'attributes?': alliumTokenAttributesWire.or(arktype.null),
}).onUndeclaredKey('delete')

export type AlliumToken = typeof alliumTokenWire.infer

export const alliumWalletBalanceWire = arktype({
	chain: nonEmptyString,
	address: nonEmptyString,
	'token?': alliumTokenWire,
	'raw_balance?': 'number',
	'raw_balance_str?': unsignedIntegerString,
	'block_timestamp?': 'string',
	'block_number?': nonNegativeInteger.or(arktype.null),
	'block_hash?': 'string | null',
}).onUndeclaredKey('delete')

export type AlliumWalletBalance = typeof alliumWalletBalanceWire.infer

export const alliumLatestWalletBalancesEnvelopeWire = arktype({
	items: alliumWalletBalanceWire.array().atMostLength(5_000),
	'cursor?': nonEmptyString.or(arktype.null),
}).onUndeclaredKey('delete')

export type AlliumLatestWalletBalancesEnvelope = typeof alliumLatestWalletBalancesEnvelopeWire.infer

/** Loose error row — empty `error` is rejected in queries after discriminant match. */
export const alliumTokenLookupErrorWire = arktype({
	error: 'string',
	address: nonEmptyString,
	chain: nonEmptyString,
}).onUndeclaredKey('delete')

export type AlliumTokenLookupError = typeof alliumTokenLookupErrorWire.infer

export type AlliumTokensByChainAddress = (
	| AlliumToken
	| AlliumTokenLookupError
)[]
