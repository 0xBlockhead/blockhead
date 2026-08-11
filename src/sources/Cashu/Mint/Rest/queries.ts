/**
 * Cashu mint REST operations (fail-closed arktype envelopes).
 * @see https://github.com/cashubtc/nuts/blob/main/00.md
 * @see https://github.com/cashubtc/nuts/blob/main/03.md
 * @see https://github.com/cashubtc/nuts/blob/main/04.md
 * @see https://github.com/cashubtc/nuts/blob/main/05.md
 * @see https://github.com/cashubtc/nuts/blob/main/06.md
 * @see https://github.com/cashubtc/nuts/blob/main/07.md
 * @see https://github.com/cashubtc/nuts/blob/main/09.md
 * @see https://github.com/cashubtc/nuts/blob/main/23.md
 * @see https://github.com/cashubtc/nuts/blob/main/02.md
 */

import { fetchFailedMessage } from '$/lib/http.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/Cashu/bindings.ts'
import {
	cashuBlindSignaturesWire,
	cashuCheckProofStatesRequestWire,
	cashuMeltBolt11RequestWire,
	cashuMeltQuoteBolt11RequestWire,
	cashuMeltQuoteBolt11Wire,
	cashuMintBolt11RequestWire,
	cashuMintErrorWire,
	cashuMintInfoWire,
	cashuMintKeysWire,
	cashuMintKeysetsWire,
	cashuMintQuoteBolt11RequestWire,
	cashuMintQuoteBolt11Wire,
	cashuProofStatesWire,
	cashuRestoredSignaturesWire,
	cashuRestoreSignaturesRequestWire,
	cashuSwapRequestWire,
	type CashuBlindSignaturesWire,
	type CashuCheckProofStatesRequestWire,
	type CashuMeltBolt11RequestWire,
	type CashuMeltQuoteBolt11RequestWire,
	type CashuMeltQuoteBolt11Wire,
	type CashuMintBolt11RequestWire,
	type CashuMintInfoWire,
	type CashuMintKeysWire,
	type CashuMintKeysetsWire,
	type CashuMintQuoteBolt11RequestWire,
	type CashuMintQuoteBolt11Wire,
	type CashuProofStatesWire,
	type CashuRestoredSignaturesWire,
	type CashuRestoreSignaturesRequestWire,
	type CashuSwapRequestWire,
} from '$/sources/Cashu/Mint/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

type CashuMintRequestOptions = {
	signal?: AbortSignal
}

export class CashuMintProtocolError extends Error {
	readonly mintUrl: string
	readonly status: number
	readonly code: number
	readonly detail: string

	constructor({
		mintUrl,
		status,
		code,
		detail,
	}: {
		mintUrl: string
		status: number
		code: number
		detail: string
	}) {
		super(`CashuMint_Rest: mint ${mintUrl} rejected the request (${code}): ${detail}`)
		this.name = 'CashuMintProtocolError'
		this.mintUrl = mintUrl
		this.status = status
		this.code = code
		this.detail = detail
	}
}

const bindingByMintUrl = Object.fromEntries(
	bindings[Source.CashuMint_Rest].map((binding) => [binding.target.key, binding])
)

const bindingForMint = (mintUrl: string) => {
	const binding = bindingByMintUrl[mintUrl]
	if (binding == null)
		throw new Error(`CashuMint_Rest: no binding for mint ${mintUrl}`)

	return binding
}

const requestMintJson = async (
	mintUrl: string,
	path: string,
	init?: RequestInit
) => {
	const binding = bindingForMint(mintUrl)
	const url = `${firstHttpUrlForBinding(binding).replace(/\/$/, '')}${path}`
	const response = await sourceFetch(binding, url, init)

	if (!response.ok) {
		try {
			const { code, detail } = cashuMintErrorWire.assert(await response.clone().json())
			throw new CashuMintProtocolError({
				mintUrl,
				status: response.status,
				code,
				detail,
			})
		} catch (error) {
			if (error instanceof CashuMintProtocolError)
				throw error

			throw new Error(await fetchFailedMessage(url, response), { cause: error })
		}
	}

	return response.json<unknown>()
}

const postMintJson = (
	mintUrl: string,
	path: string,
	request: object,
	signal?: AbortSignal
) => requestMintJson(mintUrl, path, {
	method: 'POST',
	headers: {
		'content-type': 'application/json',
	},
	body: JSON.stringify(request),
	signal,
})

const assertEnvelope = <_Value>(
	mintUrl: string,
	label: string,
	wire: {
		assert: (value: unknown) => _Value
	},
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`CashuMint_Rest: invalid ${label} response envelope for mint ${mintUrl}`)
	}
}

const assertMintInfoHasFields = (
	mintUrl: string,
	info: CashuMintInfoWire
) => {
	if (
		info.name === undefined
		&& info.pubkey === undefined
		&& info.version === undefined
		&& info.description === undefined
		&& info.description_long === undefined
		&& info.contact === undefined
		&& info.motd === undefined
		&& info.icon_url === undefined
		&& info.urls === undefined
		&& info.tos_url === undefined
		&& info.time === undefined
		&& info.nuts === undefined
	)
		throw new Error(`CashuMint_Rest: unsupported mint info response for mint ${mintUrl}`)

	return info
}

export const getMintInfo = async (
	mintUrl: string
): Promise<CashuMintInfoWire> => (
	assertMintInfoHasFields(
		mintUrl,
		assertEnvelope(
			mintUrl,
			'mint info',
			cashuMintInfoWire,
			await requestMintJson(mintUrl, '/v1/info')
		)
	)
)

export const getMintKeysets = async (
	mintUrl: string
): Promise<CashuMintKeysetsWire> => (
	assertEnvelope(
		mintUrl,
		'mint keysets',
		cashuMintKeysetsWire,
		await requestMintJson(mintUrl, '/v1/keysets')
	)
)

export const getMintKeys = async (
	mintUrl: string
): Promise<CashuMintKeysWire> => (
	assertEnvelope(
		mintUrl,
		'mint keys',
		cashuMintKeysWire,
		await requestMintJson(mintUrl, '/v1/keys')
	)
)

export const getMintKeysForKeyset = async (
	mintUrl: string,
	{
		keysetId,
	}: {
		keysetId: string
	}
): Promise<CashuMintKeysWire> => {
	const keys = assertEnvelope(
		mintUrl,
		'mint keys',
		cashuMintKeysWire,
		await requestMintJson(mintUrl, `/v1/keys/${encodeURIComponent(keysetId)}`)
	)
	if (!keys.keysets.some((keyset) => keyset.id === keysetId))
		throw new Error(`CashuMint_Rest: mint keys response is missing requested keyset ${keysetId}`)

	return keys
}

export const createMintQuoteBolt11 = async (
	mintUrl: string,
	request: CashuMintQuoteBolt11RequestWire,
	{ signal }: CashuMintRequestOptions = {}
): Promise<CashuMintQuoteBolt11Wire> => (
	assertEnvelope(
		mintUrl,
		'mint quote',
		cashuMintQuoteBolt11Wire,
		await postMintJson(
			mintUrl,
			'/v1/mint/quote/bolt11',
			cashuMintQuoteBolt11RequestWire.assert(request),
			signal
		)
	)
)

export const getMintQuoteBolt11 = async (
	mintUrl: string,
	quoteId: string,
	{ signal }: CashuMintRequestOptions = {}
): Promise<CashuMintQuoteBolt11Wire> => {
	const quote = assertEnvelope(
		mintUrl,
		'mint quote',
		cashuMintQuoteBolt11Wire,
		await requestMintJson(
			mintUrl,
			`/v1/mint/quote/bolt11/${encodeURIComponent(quoteId)}`,
			{ signal }
		)
	)
	if (quote.quote !== quoteId)
		throw new Error(`CashuMint_Rest: mint quote response does not match requested quote ${quoteId}`)

	return quote
}

export const mintBolt11 = async (
	mintUrl: string,
	request: CashuMintBolt11RequestWire,
	{ signal }: CashuMintRequestOptions = {}
): Promise<CashuBlindSignaturesWire> => (
	assertEnvelope(
		mintUrl,
		'mint',
		cashuBlindSignaturesWire,
		await postMintJson(
			mintUrl,
			'/v1/mint/bolt11',
			cashuMintBolt11RequestWire.assert(request),
			signal
		)
	)
)

export const swap = async (
	mintUrl: string,
	request: CashuSwapRequestWire,
	{ signal }: CashuMintRequestOptions = {}
): Promise<CashuBlindSignaturesWire> => (
	assertEnvelope(
		mintUrl,
		'swap',
		cashuBlindSignaturesWire,
		await postMintJson(
			mintUrl,
			'/v1/swap',
			cashuSwapRequestWire.assert(request),
			signal
		)
	)
)

export const createMeltQuoteBolt11 = async (
	mintUrl: string,
	request: CashuMeltQuoteBolt11RequestWire,
	{ signal }: CashuMintRequestOptions = {}
): Promise<CashuMeltQuoteBolt11Wire> => (
	assertEnvelope(
		mintUrl,
		'melt quote',
		cashuMeltQuoteBolt11Wire,
		await postMintJson(
			mintUrl,
			'/v1/melt/quote/bolt11',
			cashuMeltQuoteBolt11RequestWire.assert(request),
			signal
		)
	)
)

export const getMeltQuoteBolt11 = async (
	mintUrl: string,
	quoteId: string,
	{ signal }: CashuMintRequestOptions = {}
): Promise<CashuMeltQuoteBolt11Wire> => {
	const quote = assertEnvelope(
		mintUrl,
		'melt quote',
		cashuMeltQuoteBolt11Wire,
		await requestMintJson(
			mintUrl,
			`/v1/melt/quote/bolt11/${encodeURIComponent(quoteId)}`,
			{ signal }
		)
	)
	if (quote.quote !== quoteId)
		throw new Error(`CashuMint_Rest: melt quote response does not match requested quote ${quoteId}`)

	return quote
}

export const meltBolt11 = async (
	mintUrl: string,
	request: CashuMeltBolt11RequestWire,
	{ signal }: CashuMintRequestOptions = {}
): Promise<CashuMeltQuoteBolt11Wire> => (
	assertEnvelope(
		mintUrl,
		'melt',
		cashuMeltQuoteBolt11Wire,
		await postMintJson(
			mintUrl,
			'/v1/melt/bolt11',
			cashuMeltBolt11RequestWire.assert(request),
			signal
		)
	)
)

export const checkProofStates = async (
	mintUrl: string,
	request: CashuCheckProofStatesRequestWire,
	{ signal }: CashuMintRequestOptions = {}
): Promise<CashuProofStatesWire> => (
	assertEnvelope(
		mintUrl,
		'proof states',
		cashuProofStatesWire,
		await postMintJson(
			mintUrl,
			'/v1/checkstate',
			cashuCheckProofStatesRequestWire.assert(request),
			signal
		)
	)
)

export const restoreSignatures = async (
	mintUrl: string,
	request: CashuRestoreSignaturesRequestWire,
	{ signal }: CashuMintRequestOptions = {}
): Promise<CashuRestoredSignaturesWire> => (
	assertEnvelope(
		mintUrl,
		'restored signatures',
		cashuRestoredSignaturesWire,
		await postMintJson(
			mintUrl,
			'/v1/restore',
			cashuRestoreSignaturesRequestWire.assert(request),
			signal
		)
	)
)
