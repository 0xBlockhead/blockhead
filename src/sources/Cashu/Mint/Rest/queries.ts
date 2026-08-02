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

const bindingByMintUrl = Object.fromEntries(
	bindings[Source.CashuMint_Rest].map((binding) => [binding.target.key, binding])
)

const getMintJson = <_Wire>(
	mintUrl: string,
	path: string
) => {
	const binding = bindingByMintUrl[mintUrl]
	if (binding == null)
		throw new Error(`CashuMint_Rest: no binding for mint ${mintUrl}`)

	return sourceGetJson<_Wire>(
		binding,
		`${firstHttpUrlForBinding(binding).replace(/\/$/, '')}${path}`
	)
}

export const getMintInfo = (mintUrl: string) => getMintJson<CashuMintInfoWire>(mintUrl, '/v1/info')

export const getMintKeysets = (
	mintUrl: string
) => getMintJson<CashuMintKeysetsWire>(mintUrl, '/v1/keysets')

export const getMintKeys = (
	mintUrl: string
) => getMintJson<CashuMintKeysWire>(mintUrl, '/v1/keys')

export const getMintKeysForKeyset = (
	mintUrl: string,
	{
		keysetId,
	}: {
		keysetId: string
	}
) => getMintJson<CashuMintKeysWire>(mintUrl, `/v1/keys/${encodeURIComponent(keysetId)}`)
