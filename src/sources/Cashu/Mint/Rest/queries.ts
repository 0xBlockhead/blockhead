import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/Cashu/bindings.ts'
import { Source } from '$/sources/Source.ts'
import type {
	CashuMintInfoWire,
	CashuMintKeysWire,
	CashuMintKeysetsWire,
} from '$/sources/Cashu/Mint/Rest/types.ts'

const binding = bindings[Source.CashuMint_Rest]

const assertMintUrl = (mintUrl: string) => {
	if (binding.target.key !== mintUrl)
		throw new Error(`CashuMint_Rest: no binding for mint ${mintUrl}`)
}

export const getMintInfo = (
	mintUrl: string
) => (
	assertMintUrl(mintUrl),
	sourceGetJson<CashuMintInfoWire>(
		binding,
		`${firstHttpUrlForBinding(binding)}/v1/info`
	)
)

export const getMintKeysets = (
	mintUrl: string
) => (
	assertMintUrl(mintUrl),
	sourceGetJson<CashuMintKeysetsWire>(
		binding,
		`${firstHttpUrlForBinding(binding)}/v1/keysets`
	)
)

export const getMintKeys = (
	mintUrl: string
) => (
	assertMintUrl(mintUrl),
	sourceGetJson<CashuMintKeysWire>(
		binding,
		`${firstHttpUrlForBinding(binding)}/v1/keys`
	)
)

export const getMintKeysForKeyset = (
	mintUrl: string,
	{
		keysetId,
	}: {
		keysetId: string
	}
) => (
	assertMintUrl(mintUrl),
	sourceGetJson<CashuMintKeysWire>(
		binding,
		`${firstHttpUrlForBinding(binding)}/v1/keys/${encodeURIComponent(keysetId)}`
	)
)
