import { type } from 'arktype'

import { UrlString } from '$/schema/UrlString.ts'
import {
	EvmAddress,
	EvmRpcQuantity,
	Hash32,
	ZeroExHex,
} from '$/schema/ZeroExHex.ts'


export const erc1271MagicValue = '0x1626ba7e' as const

const bytes4 = type(
	'/^0x[0-9a-fA-F]{8}$/' as type.cast<`0x${string}`>
)
const nonMagicBytes4 = bytes4.narrow((value) => (
	value.toLowerCase() !== erc1271MagicValue
))
export const evmErc1271ChainId = type('number.integer > 0').narrow(Number.isSafeInteger)
export const evmErc1271SignatureValidation = type({
	standard: "'ERC-1271'",
	dispatchOccurrenceId: 'string > 0',
	authorityRequestId: 'string > 0',
	authorityEnvelopeHash: Hash32,
	chainId: evmErc1271ChainId,
	accountAddress: EvmAddress,
	requestDigest: Hash32,
	signatureHash: Hash32,
	rpcOrigin: UrlString,
	blockTag: EvmRpcQuantity,
	callDataHash: Hash32,
	evaluatedAt: 'number.integer >= 0',
	coverage: "'isValidSignature(bytes32,bytes)-eth_call-only'",
	result: type.or(
		type({
			kind: "'valid'",
			magicValue: "'0x1626ba7e'",
			outputHash: Hash32,
		}).onUndeclaredKey('reject'),
		type({
			kind: "'invalid'",
			magicValue: nonMagicBytes4,
			outputHash: Hash32,
		}).onUndeclaredKey('reject'),
		type({
			kind: "'malformed-return'",
			outputHash: Hash32,
			error: 'string > 0',
		}).onUndeclaredKey('reject'),
		type({
			kind: "'call-failed'",
			error: 'string > 0',
		}).onUndeclaredKey('reject')
	),
}).onUndeclaredKey('reject')

export type EvmErc1271SignatureValidation = typeof evmErc1271SignatureValidation.infer
