/**
 * UniSat OpenAPI wire shapes (inscription + runes indexer).
 * @see https://docs.unisat.io/developer-support/open-api-documentation.md
 * @see https://github.com/unisat-wallet/unisat-dev-docs/blob/master/open-api/auto-generated/docs/inscription-indexer.md
 * @see https://github.com/unisat-wallet/unisat-dev-docs/blob/master/open-api/auto-generated/docs/runes-indexer.md
 */
import { type as arktype } from 'arktype'
import { Source } from '$/sources/Source.ts'


const unsignedSafe = arktype(`number.integer >= 0 <= ${Number.MAX_SAFE_INTEGER}`)
const nonEmptyString = arktype('string > 0')
const decimalAmount = arktype('/^\\d+$/')
const nullableUnsigned = unsignedSafe.or(arktype('null'))
const nullableDecimal = decimalAmount.or(arktype('null'))

export const unisatInscriptionUtxoWire = arktype({
	txid: nonEmptyString,
	vout: unsignedSafe,
	'address?': 'string',
	'codeType?': 'number.integer',
	'height?': unsignedSafe,
	'idx?': unsignedSafe,
	'isOpInRBF?': 'boolean',
	'satoshi?': unsignedSafe,
	'scriptPk?': 'string',
	'scriptType?': 'string',
})

export const unisatInscriptionInfoWire = arktype({
	inscriptionId: nonEmptyString,
	'address?': 'string',
	'contentBody?': 'string',
	'contentLength?': unsignedSafe,
	'contentType?': 'string',
	'height?': unsignedSafe,
	'inSatoshi?': unsignedSafe,
	'outSatoshi?': unsignedSafe,
	'inscriptionIndex?': unsignedSafe,
	'inscriptionNumber?': 'number.integer',
	'offset?': unsignedSafe,
	'timestamp?': unsignedSafe,
	'utxo?': unisatInscriptionUtxoWire,
})

export const unisatRuneTermsWire = arktype({
	'amount?': nullableDecimal,
	'cap?': nullableDecimal,
	'heightStart?': nullableUnsigned,
	'heightEnd?': nullableUnsigned,
	'offsetStart?': nullableUnsigned,
	'offsetEnd?': nullableUnsigned,
})

export const unisatRuneInfoWire = arktype({
	runeid: nonEmptyString,
	'rune?': 'string',
	'spacedRune?': 'string',
	'number?': unsignedSafe,
	'height?': unsignedSafe,
	'txidx?': unsignedSafe,
	'timestamp?': unsignedSafe,
	'divisibility?': unsignedSafe,
	'symbol?': 'string',
	'etching?': 'string',
	'premine?': 'string',
	'terms?': unisatRuneTermsWire.or(arktype('null')),
	'mints?': 'string',
	'burned?': 'string',
	'holders?': unsignedSafe,
	'transactions?': unsignedSafe,
	'supply?': 'string',
	'start?': unsignedSafe,
	'end?': unsignedSafe,
	'mintable?': 'boolean',
	'remaining?': 'string',
})

export const unisatRuneBalanceWire = arktype({
	amount: nonEmptyString,
	runeid: nonEmptyString,
	'rune?': 'string',
	'spacedRune?': 'string',
	'symbol?': 'string',
	'divisibility?': unsignedSafe,
})

export const unisatUtxoInscriptionWire = arktype({
	inscriptionId: nonEmptyString,
	'inscriptionNumber?': 'number.integer',
	'offset?': unsignedSafe,
	'moved?': 'boolean',
	'sequence?': unsignedSafe,
	'isCursed?': 'boolean',
	'isVindicate?': 'boolean',
	'isBRC20Ext?': 'boolean',
	'isBRC20?': 'boolean',
})

export const unisatUtxoInfoWire = arktype({
	txid: nonEmptyString,
	vout: unsignedSafe,
	'satoshi?': unsignedSafe,
	'scriptType?': 'string',
	'scriptPk?': 'string',
	'codeType?': 'number.integer',
	'address?': 'string',
	'height?': unsignedSafe,
	'idx?': unsignedSafe,
	'isOpInRBF?': 'boolean',
	'isSpent?': 'boolean',
	'inscriptionsCount?': unsignedSafe,
	'inscriptions?': unisatUtxoInscriptionWire.array(),
})

export const unisatAddressInscriptionDataWire = arktype({
	inscriptionId: nonEmptyString,
	'inscriptionNumber?': 'number.integer',
	'contentType?': 'string',
	'utxo?': unisatInscriptionUtxoWire,
})

export const unisatPagedRuneBalanceWire = arktype({
	total: unsignedSafe,
	start: unsignedSafe,
	detail: unisatRuneBalanceWire.array(),
})

export const unisatPagedAddressInscriptionWire = arktype({
	total: unsignedSafe,
	start: unsignedSafe,
	detail: unisatAddressInscriptionDataWire.array(),
})

export const unisatRuneBalanceListWire = unisatRuneBalanceWire.array()

export const unisatUtxoInfoOrNullWire = unisatUtxoInfoWire.or(arktype('null'))

export const unisatResponseEnvelopeWire = arktype({
	code: 'number.integer',
	msg: 'string',
	data: 'unknown',
})

export const assertUniSatData = <_Value>(
	wire: {
		assert: (value: unknown) => _Value
	},
	data: unknown,
	label: string
): _Value => {
	try {
		return wire.assert(data)
	} catch {
		throw new Error(`${Source.UniSat_Rest}: invalid ${label} envelope`)
	}
}

export type UniSatEnvelope<_Data> = {
	code: number
	msg: string
	data: _Data
}

export type UniSatInscriptionUtxo = typeof unisatInscriptionUtxoWire.infer
export type UniSatInscriptionInfo = typeof unisatInscriptionInfoWire.infer
export type UniSatRuneTerms = typeof unisatRuneTermsWire.infer
export type UniSatRuneInfo = typeof unisatRuneInfoWire.infer
export type UniSatRuneBalance = typeof unisatRuneBalanceWire.infer
export type UniSatUtxoInscription = typeof unisatUtxoInscriptionWire.infer
export type UniSatUtxoInfo = typeof unisatUtxoInfoWire.infer
export type UniSatAddressInscriptionData = typeof unisatAddressInscriptionDataWire.infer
export type UniSatPaged<_Item> = {
	total: number
	start: number
	detail: _Item[]
}
