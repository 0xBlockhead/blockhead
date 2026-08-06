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
import type {
	UniSatAddressInscriptionData,
	UniSatEnvelope,
	UniSatInscriptionInfo,
	UniSatPaged,
	UniSatRuneBalance,
	UniSatRuneInfo,
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
	path: string
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

	const envelope = await response.json() as UniSatEnvelope<_Data>
	if (envelope.code !== 0)
		throw new Error(`${Source.UniSat_Rest}: ${envelope.msg || `code ${String(envelope.code)}`}`)

	return envelope.data
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
	return unisatGetJson<UniSatInscriptionInfo>(
		publicEnv,
		`v1/indexer/inscription/info/${encodeURIComponent(inscriptionId)}`
	)
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
	return unisatGetJson<UniSatRuneInfo>(
		publicEnv,
		`v1/indexer/runes/${encodeURIComponent(runeId)}/info`
	)
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
	return unisatGetJson<UniSatRuneBalance[]>(
		publicEnv,
		`v1/indexer/runes/utxo/${encodeURIComponent(txId)}/${outputIndex}/balance`
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

	return unisatGetJson<UniSatPaged<UniSatRuneBalance>>(
		publicEnv,
		`v1/indexer/address/${encodeURIComponent(address)}/runes/balance-list?start=${start}&limit=${limit}`
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

	return unisatGetJson<UniSatPaged<UniSatAddressInscriptionData>>(
		publicEnv,
		`v1/indexer/address/${encodeURIComponent(address)}/inscription-data?cursor=${cursor}&size=${size}`
	)
}
