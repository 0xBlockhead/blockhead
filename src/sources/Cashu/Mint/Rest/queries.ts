/**
 * Cashu mint REST read queries (fail-closed arktype envelopes).
 * @see https://github.com/cashubtc/nuts/blob/main/06.md
 * @see https://github.com/cashubtc/nuts/blob/main/02.md
 */

import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/Cashu/bindings.ts'
import {
	cashuMintInfoWire,
	cashuMintKeysWire,
	cashuMintKeysetsWire,
	type CashuMintInfoWire,
	type CashuMintKeysWire,
	type CashuMintKeysetsWire,
} from '$/sources/Cashu/Mint/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const bindingByMintUrl = Object.fromEntries(
	bindings[Source.CashuMint_Rest].map((binding) => [binding.target.key, binding])
)

const getMintJson = (
	mintUrl: string,
	path: string
) => {
	const binding = bindingByMintUrl[mintUrl]
	if (binding == null)
		throw new Error(`CashuMint_Rest: no binding for mint ${mintUrl}`)

	return sourceGetJson(
		binding,
		`${firstHttpUrlForBinding(binding).replace(/\/$/, '')}${path}`
	)
}

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
			await getMintJson(mintUrl, '/v1/info')
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
		await getMintJson(mintUrl, '/v1/keysets')
	)
)

export const getMintKeys = async (
	mintUrl: string
): Promise<CashuMintKeysWire> => (
	assertEnvelope(
		mintUrl,
		'mint keys',
		cashuMintKeysWire,
		await getMintJson(mintUrl, '/v1/keys')
	)
)

export const getMintKeysForKeyset = async (
	mintUrl: string,
	{
		keysetId,
	}: {
		keysetId: string
	}
): Promise<CashuMintKeysWire> => (
	assertEnvelope(
		mintUrl,
		'mint keys',
		cashuMintKeysWire,
		await getMintJson(mintUrl, `/v1/keys/${encodeURIComponent(keysetId)}`)
	)
)
