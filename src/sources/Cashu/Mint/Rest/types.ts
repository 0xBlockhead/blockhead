/**
 * Cashu mint REST envelopes (fail-closed arktype).
 * @see https://github.com/cashubtc/nuts/blob/main/06.md — NUT-06 mint info
 * @see https://github.com/cashubtc/nuts/blob/main/02.md — NUT-02 keysets / keys
 */

import { type as arktype } from 'arktype'


const nonEmptyString = arktype('string > 0')
const nonNegativeNumber = arktype('number >= 0')
const finiteNumber = arktype('number')

export const cashuMintMethodWire = arktype({
	method: nonEmptyString,
	unit: nonEmptyString,
	'method_name?': nonEmptyString,
	'min_amount?': nonNegativeNumber,
	'max_amount?': nonNegativeNumber,
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
	'input_fee_ppk?': nonNegativeNumber,
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
	'input_fee_ppk?': nonNegativeNumber,
	'final_expiry?': finiteNumber.or(arktype('null')),
	keys: arktype({
		'[string]': nonEmptyString,
	}),
}).onUndeclaredKey('delete')

export const cashuMintKeysWire = arktype({
	keysets: cashuMintKeysKeysetWire.array(),
}).onUndeclaredKey('delete')

export type CashuMintKeysWire = typeof cashuMintKeysWire.infer
