/**
 * UniSat OpenAPI indexer queries (inscriptions + runes).
 * @see https://docs.unisat.io/developer-support/open-api-documentation.md
 * @see https://docs.unisat.io/developer-support/open-api-documentation/api-for-bitcoin/general/inscriptions/get-inscription-info.md
 * @see https://docs.unisat.io/developer-support/open-api-documentation/api-for-bitcoin/runes/get-runes-info.md
 * @see https://github.com/unisat-wallet/unisat-dev-docs/blob/master/open-api/auto-generated/docs/runes-indexer.md
 */
import { throwHttpError } from '$/lib/http.ts'
import {
	requiredPublicEnvString,
	type SourcePublicEnv,
} from '$/sources/$sources.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/UniSat/bindings.ts'
import {
	assertUniSatData,
	unisatInscriptionInfoWire,
	unisatPagedAddressInscriptionWire,
	unisatPagedRuneBalanceWire,
	unisatResponseEnvelopeWire,
	unisatRuneBalanceListWire,
	unisatRuneInfoWire,
	unisatUtxoInfoOrNullWire,
} from '$/sources/UniSat/Rest/types.ts'
import { Source } from '$/sources/Source.ts'


const binding = bindings[Source.UniSat_Rest][0]

const assertNonEmpty = (
	value: string,
	label: string
) => {
	if (value.length < 1)
		throw new Error(`${Source.UniSat_Rest}: missing ${label}`)
	return value
}

const assertNonNegativeInteger = (
	value: number,
	label: string
) => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`${Source.UniSat_Rest}: invalid ${label} ${String(value)}`)
	return value
}

const unisatGetJson = async <_Data>(
	publicEnv: SourcePublicEnv,
	path: string,
	dataWire: {
		assert: (value: unknown) => _Data
	},
	label: string
) => {
	const url = new URL(
		path,
		`${firstHttpUrlForBinding(binding).replace(/\/$/, '')}/`
	).toString()
	const response = await sourceFetch(binding, url, {
		headers: {
			Authorization: `Bearer ${requiredPublicEnvString(publicEnv, 'PUBLIC_UNISAT_API_KEY')}`,
			accept: 'application/json',
		},
	})
	if (!response.ok)
		await throwHttpError(`${Source.UniSat_Rest} GET ${url}`, response)

	const envelope = assertUniSatData(
		unisatResponseEnvelopeWire,
		await response.json(),
		`${label} response`
	)
	if (envelope.code !== 0)
		throw new Error(`${Source.UniSat_Rest}: ${envelope.msg || `code ${String(envelope.code)}`}`)

	return assertUniSatData(
		dataWire,
		envelope.data,
		label
	)
}

export const getInscriptionInfo = async (
	publicEnv: SourcePublicEnv,
	{
		inscriptionId,
	}: {
		inscriptionId: string
	}
) => {
	assertNonEmpty(inscriptionId, 'inscriptionId')
	const info = await unisatGetJson(
		publicEnv,
		`v1/indexer/inscription/info/${encodeURIComponent(inscriptionId)}`,
		unisatInscriptionInfoWire,
		'inscription info'
	)
	if (info.inscriptionId !== inscriptionId)
		throw new Error(`${Source.UniSat_Rest}: inscriptionId mismatch`)
	return info
}

export const getRuneInfo = async (
	publicEnv: SourcePublicEnv,
	{
		runeId,
	}: {
		runeId: string
	}
) => {
	assertNonEmpty(runeId, 'runeId')
	const info = await unisatGetJson(
		publicEnv,
		`v1/indexer/runes/${encodeURIComponent(runeId)}/info`,
		unisatRuneInfoWire,
		'rune info'
	)
	if (info.runeid !== runeId)
		throw new Error(`${Source.UniSat_Rest}: runeid mismatch`)
	return info
}

export const getUtxoInfo = async (
	publicEnv: SourcePublicEnv,
	{
		txId,
		outputIndex,
	}: {
		txId: string
		outputIndex: number
	}
) => {
	assertNonEmpty(txId, 'txId')
	assertNonNegativeInteger(outputIndex, 'outputIndex')
	const utxo = await unisatGetJson(
		publicEnv,
		`v1/indexer/utxo/${encodeURIComponent(txId)}/${outputIndex}`,
		unisatUtxoInfoOrNullWire,
		'utxo info'
	)
	if (
		utxo != null
		&& (
			utxo.txid !== txId
			|| utxo.vout !== outputIndex
		)
	)
		throw new Error(`${Source.UniSat_Rest}: utxo identity mismatch`)
	return utxo
}

export const getUtxoRuneBalances = async (
	publicEnv: SourcePublicEnv,
	{
		txId,
		outputIndex,
	}: {
		txId: string
		outputIndex: number
	}
) => {
	assertNonEmpty(txId, 'txId')
	assertNonNegativeInteger(outputIndex, 'outputIndex')
	return unisatGetJson(
		publicEnv,
		`v1/indexer/runes/utxo/${encodeURIComponent(txId)}/${outputIndex}/balance`,
		unisatRuneBalanceListWire,
		'utxo rune balances'
	)
}

export const getAddressRuneBalances = async (
	publicEnv: SourcePublicEnv,
	{
		address,
		start = 0,
		limit = 16,
	}: {
		address: string
		start?: number
		limit?: number
	}
) => {
	assertNonEmpty(address, 'address')
	assertNonNegativeInteger(start, 'start')
	assertNonNegativeInteger(limit, 'limit')
	if (limit < 1 || limit > 500)
		throw new Error(`${Source.UniSat_Rest}: limit must be 1..500`)

	return unisatGetJson(
		publicEnv,
		`v1/indexer/address/${encodeURIComponent(address)}/runes/balance-list?start=${start}&limit=${limit}`,
		unisatPagedRuneBalanceWire,
		'address rune balances'
	)
}

export const getAddressInscriptions = async (
	publicEnv: SourcePublicEnv,
	{
		address,
		cursor = 0,
		size = 16,
	}: {
		address: string
		cursor?: number
		size?: number
	}
) => {
	assertNonEmpty(address, 'address')
	assertNonNegativeInteger(cursor, 'cursor')
	assertNonNegativeInteger(size, 'size')
	if (size < 1)
		throw new Error(`${Source.UniSat_Rest}: size must be >= 1`)

	return unisatGetJson(
		publicEnv,
		`v1/indexer/address/${encodeURIComponent(address)}/inscription-data?cursor=${cursor}&size=${size}`,
		unisatPagedAddressInscriptionWire,
		'address inscriptions'
	)
}
