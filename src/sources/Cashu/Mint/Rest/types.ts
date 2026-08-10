/**
 * Cashu mint REST envelopes (fail-closed arktype).
 * @see https://github.com/cashubtc/nuts/blob/main/00.md — common protocol models
 * @see https://github.com/cashubtc/nuts/blob/main/03.md — swaps
 * @see https://github.com/cashubtc/nuts/blob/main/04.md — minting
 * @see https://github.com/cashubtc/nuts/blob/main/05.md — melting
 * @see https://github.com/cashubtc/nuts/blob/main/06.md — NUT-06 mint info
 * @see https://github.com/cashubtc/nuts/blob/main/07.md — proof state
 * @see https://github.com/cashubtc/nuts/blob/main/09.md — signature restoration
 * @see https://github.com/cashubtc/nuts/blob/main/23.md — BOLT11
 * @see https://github.com/cashubtc/nuts/blob/main/02.md — NUT-02 keysets / keys
 */

import { type as arktype } from 'arktype'


const nonEmptyString = arktype('string > 0')
const nonNegativeInteger = arktype('number.integer >= 0')
const finiteNumber = arktype('number')

export const cashuMintErrorWire = arktype({
	detail: nonEmptyString,
	code: 'number.integer',
}).onUndeclaredKey('delete')

export type CashuMintErrorWire = typeof cashuMintErrorWire.infer

export const cashuBlindedMessageWire = arktype({
	amount: nonNegativeInteger,
	id: nonEmptyString,
	B_: nonEmptyString,
	'witness?': nonEmptyString,
}).onUndeclaredKey('delete')

export type CashuBlindedMessageWire = typeof cashuBlindedMessageWire.infer

export const cashuBlindSignatureWire = arktype({
	amount: nonNegativeInteger,
	id: nonEmptyString,
	C_: nonEmptyString,
	'dleq?': {
		e: nonEmptyString,
		s: nonEmptyString,
	},
}).onUndeclaredKey('delete')

export type CashuBlindSignatureWire = typeof cashuBlindSignatureWire.infer

export const cashuProofWire = arktype({
	amount: nonNegativeInteger,
	id: nonEmptyString,
	secret: nonEmptyString,
	C: nonEmptyString,
	'witness?': nonEmptyString,
	'dleq?': {
		e: nonEmptyString,
		s: nonEmptyString,
		r: nonEmptyString,
	},
}).onUndeclaredKey('delete')

export type CashuProofWire = typeof cashuProofWire.infer

export const cashuMintMethodWire = arktype({
	method: nonEmptyString,
	unit: nonEmptyString,
	'method_name?': nonEmptyString,
	'min_amount?': nonNegativeInteger,
	'max_amount?': nonNegativeInteger,
	'options?': 'Record<string, unknown>',
}).onUndeclaredKey('delete')

export type CashuMintMethodWire = typeof cashuMintMethodWire.infer

export const cashuNutSettingsWire = arktype({
	'disabled?': 'boolean',
	'methods?': cashuMintMethodWire.array(),
	'supported?': 'unknown',
	'options?': 'Record<string, unknown>',
}).onUndeclaredKey('delete')

export type CashuNutSettingsWire = typeof cashuNutSettingsWire.infer

export const cashuMintContactWire = arktype({
	method: nonEmptyString,
	info: nonEmptyString,
}).onUndeclaredKey('delete')

export const cashuMintInfoWire = arktype({
	'name?': nonEmptyString,
	'pubkey?': nonEmptyString,
	'version?': nonEmptyString,
	'description?': 'string',
	'description_long?': 'string',
	'contact?': cashuMintContactWire.array(),
	'motd?': 'string',
	'icon_url?': nonEmptyString,
	'urls?': nonEmptyString.array(),
	'tos_url?': nonEmptyString,
	'time?': finiteNumber,
	'nuts?': arktype({
		'[string]': cashuNutSettingsWire,
	}),
}).onUndeclaredKey('delete')

export type CashuMintInfoWire = typeof cashuMintInfoWire.infer

export const cashuMintKeysetWire = arktype({
	id: nonEmptyString,
	unit: nonEmptyString,
	active: 'boolean',
	'input_fee_ppk?': nonNegativeInteger,
	'final_expiry?': finiteNumber.or(arktype('null')),
}).onUndeclaredKey('delete')

export type CashuMintKeysetWire = typeof cashuMintKeysetWire.infer

export const cashuMintKeysetsWire = arktype({
	keysets: cashuMintKeysetWire.array(),
}).onUndeclaredKey('delete')

export type CashuMintKeysetsWire = typeof cashuMintKeysetsWire.infer

export const cashuMintKeysKeysetWire = arktype({
	id: nonEmptyString,
	unit: nonEmptyString,
	active: 'boolean',
	'input_fee_ppk?': nonNegativeInteger,
	'final_expiry?': finiteNumber.or(arktype('null')),
	keys: arktype({
		'[string]': nonEmptyString,
	}),
}).onUndeclaredKey('delete')

export const cashuMintKeysWire = arktype({
	keysets: cashuMintKeysKeysetWire.array(),
}).onUndeclaredKey('delete')

export type CashuMintKeysWire = typeof cashuMintKeysWire.infer

export const cashuMintQuoteBolt11RequestWire = arktype({
	amount: nonNegativeInteger,
	unit: nonEmptyString,
	'description?': 'string',
}).onUndeclaredKey('reject')

export type CashuMintQuoteBolt11RequestWire = typeof cashuMintQuoteBolt11RequestWire.infer

export const cashuMintQuoteBolt11Wire = arktype({
	quote: nonEmptyString,
	request: nonEmptyString,
	amount: nonNegativeInteger,
	unit: nonEmptyString,
	method: "'bolt11'",
	amount_paid: nonNegativeInteger,
	amount_issued: nonNegativeInteger,
	updated_at: nonNegativeInteger,
	'state?': "'UNPAID' | 'PAID' | 'ISSUED'",
	expiry: nonNegativeInteger.or(arktype('null')),
}).onUndeclaredKey('delete')

export type CashuMintQuoteBolt11Wire = typeof cashuMintQuoteBolt11Wire.infer

export const cashuMintBolt11RequestWire = arktype({
	quote: nonEmptyString,
	outputs: cashuBlindedMessageWire.array(),
}).onUndeclaredKey('reject')

export type CashuMintBolt11RequestWire = typeof cashuMintBolt11RequestWire.infer

export const cashuBlindSignaturesWire = arktype({
	signatures: cashuBlindSignatureWire.array(),
}).onUndeclaredKey('delete')

export type CashuBlindSignaturesWire = typeof cashuBlindSignaturesWire.infer

export const cashuSwapRequestWire = arktype({
	inputs: cashuProofWire.array(),
	outputs: cashuBlindedMessageWire.array(),
}).onUndeclaredKey('reject')

export type CashuSwapRequestWire = typeof cashuSwapRequestWire.infer

export const cashuMeltQuoteBolt11RequestWire = arktype({
	request: nonEmptyString,
	unit: nonEmptyString,
	'options?': {
		amountless: {
			amount_msat: nonNegativeInteger,
		},
	},
}).onUndeclaredKey('reject')

export type CashuMeltQuoteBolt11RequestWire = typeof cashuMeltQuoteBolt11RequestWire.infer

export const cashuMeltQuoteBolt11Wire = arktype({
	quote: nonEmptyString,
	request: nonEmptyString,
	amount: nonNegativeInteger,
	unit: nonEmptyString,
	method: "'bolt11'",
	fee_reserve: nonNegativeInteger,
	state: "'UNPAID' | 'PENDING' | 'PAID'",
	expiry: nonNegativeInteger,
	'payment_preimage?': nonEmptyString.or(arktype('null')),
	'change?': cashuBlindSignatureWire.array(),
}).onUndeclaredKey('delete')

export type CashuMeltQuoteBolt11Wire = typeof cashuMeltQuoteBolt11Wire.infer

export const cashuMeltBolt11RequestWire = arktype({
	quote: nonEmptyString,
	inputs: cashuProofWire.array(),
	'outputs?': cashuBlindedMessageWire.array(),
	'prefer_async?': 'boolean',
}).onUndeclaredKey('reject')

export type CashuMeltBolt11RequestWire = typeof cashuMeltBolt11RequestWire.infer

export const cashuCheckProofStatesRequestWire = arktype({
	Ys: nonEmptyString.array(),
}).onUndeclaredKey('reject')

export type CashuCheckProofStatesRequestWire = typeof cashuCheckProofStatesRequestWire.infer

export const cashuProofStatesWire = arktype({
	states: arktype({
		Y: nonEmptyString,
		state: "'UNSPENT' | 'PENDING' | 'SPENT'",
		'witness?': nonEmptyString.or(arktype('null')),
	}).onUndeclaredKey('delete').array(),
}).onUndeclaredKey('delete')

export type CashuProofStatesWire = typeof cashuProofStatesWire.infer

export const cashuRestoreSignaturesRequestWire = arktype({
	outputs: cashuBlindedMessageWire.array(),
}).onUndeclaredKey('reject')

export type CashuRestoreSignaturesRequestWire = typeof cashuRestoreSignaturesRequestWire.infer

export const cashuRestoredSignaturesWire = arktype({
	outputs: cashuBlindedMessageWire.array(),
	signatures: cashuBlindSignatureWire.array(),
}).onUndeclaredKey('delete')

export type CashuRestoredSignaturesWire = typeof cashuRestoredSignaturesWire.infer
