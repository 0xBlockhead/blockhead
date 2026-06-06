import { getJson } from '$/lib/http.ts'
import Cashu from '$/sources/Cashu/index.ts'
import type {
	CashuMintInfoWire,
	CashuMintKeysWire,
	CashuMintKeysetsWire,
} from '$/sources/Cashu/Mint/Rest/types.ts'

const base = (mintUrl: string) => mintUrl.replace(/\/$/, '')

export const getMintInfo = ({
	mintUrl,
}: {
	mintUrl: string
}) => (
	getJson<CashuMintInfoWire>(
		`${base(mintUrl)}/v1/info`,
		{ origins: Cashu.origins },
	)
)

export const getMintKeysets = ({
	mintUrl,
}: {
	mintUrl: string
}) => (
	getJson<CashuMintKeysetsWire>(
		`${base(mintUrl)}/v1/keysets`,
		{ origins: Cashu.origins },
	)
)

export const getMintKeys = ({
	mintUrl,
}: {
	mintUrl: string
}) => (
	getJson<CashuMintKeysWire>(
		`${base(mintUrl)}/v1/keys`,
		{ origins: Cashu.origins },
	)
)

export const getMintKeysForKeyset = ({
	mintUrl,
	keysetId,
}: {
	mintUrl: string
	keysetId: string
}) => (
	getJson<CashuMintKeysWire>(
		`${base(mintUrl)}/v1/keys/${encodeURIComponent(keysetId)}`,
		{ origins: Cashu.origins },
	)
)
