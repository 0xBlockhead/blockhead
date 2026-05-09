import { resolve } from '$app/paths'

import type { CastHash } from '$/schema/FarcasterCast.ts'
import { getCastByUsernameAndHashPrefix } from '$/sources/Farcaster/Rest/queries.ts'
import { getCastByClientUrl } from '$/sources/Neynar/Rest/queries.ts'
import type { Source } from '$/sources/$Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { isJsonObject, type JsonValue } from '$/typescript/JsonValue.ts'

const normalizeFarcasterCastHash = (hash: string): CastHash => {
	const t = hash.trim()
	const hex = (
		t.startsWith('0x')
		|| t.startsWith('0X') ?
			t.slice(2)
		:
			t
	)
	return `0x${hex.toLowerCase()}`
}

/**
 * Resolves Farcaster / Warpcast web URLs to the app’s canonical cast path via Neynar.
 */
const usernameAndCastHashPrefixFromUrl = (clientUrl: string) => {
	const url = (() => {
		try {
			return new URL(clientUrl)
		} catch {
			return undefined
		}
	})()
	if (url == null) return undefined
	const [username, castHashPrefix] = url.pathname.split('/').filter((x) => x.length > 0)
	return (
		username != null
		&& castHashPrefix != null
		&& castHashPrefix.startsWith('0x') ?
			{
				username,
				castHashPrefix,
			}
		:	undefined
	)
}

const canonicalCastPath = ({
	fid,
	hash,
}: {
	fid: number
	hash: string
}) => (
	resolve(
		'/(social)/(farcaster)/farcaster/(feed)/cast/[fid]/[hash]',
		{
			fid: String(fid),
			hash: normalizeFarcasterCastHash(hash),
		},
	)
)

const castRefFromWire = (value: JsonValue) => {
	if (!isJsonObject(value)) return undefined
	const hash = typeof value.hash === 'string' ? value.hash : undefined
	const author = value.author
	const fid = (
		isJsonObject(author) && typeof author.fid === 'number' ?
			author.fid
		:	undefined
	)
	return hash != null && fid != null ?
		{ hash, fid }
	:	undefined
}

const castRefFromHaatzCastEndpoint = async (clientUrl: string) => {
	const url = (() => {
		try {
			return new URL(clientUrl)
		} catch {
			return undefined
		}
	})()
	if (url == null) return undefined
	if (url.hostname !== 'haatz.quilibrium.com') return undefined
	if (!url.pathname.startsWith('/v2/farcaster/cast')) return undefined

	const response = await fetch(url.toString())
	if (!response.ok) return undefined
	const payload = await response.json<JsonValue>()
	if (!isJsonObject(payload)) return undefined
	const result = payload.result
	const nestedCast = isJsonObject(result) ? result.cast : undefined
	return castRefFromWire(payload.cast) ?? (nestedCast == null ? undefined : castRefFromWire(nestedCast))
}

export const getCanonicalCastPathFromClientUrls = async (
	publicEnv: SourcePublicEnvFor<Source.Neynar_Rest>,
	clientUrls: string[],
): Promise<string | undefined> => {
	for (const clientUrl of clientUrls) {
		const cast = await getCastByClientUrl(publicEnv, clientUrl)
		if (cast?.author?.fid != null && cast.hash != null) {
			return canonicalCastPath({
				fid: cast.author.fid,
				hash: cast.hash,
			})
		}

		const castFromHaatz = await castRefFromHaatzCastEndpoint(clientUrl)
		if (castFromHaatz != null) {
			return canonicalCastPath(castFromHaatz)
		}

		const fallback = usernameAndCastHashPrefixFromUrl(clientUrl)
		if (fallback == null) continue
		const castFromWebApi = await getCastByUsernameAndHashPrefix(fallback)
		if (castFromWebApi?.author?.fid != null && castFromWebApi.hash != null) {
			return canonicalCastPath({
				fid: castFromWebApi.author.fid,
				hash: castFromWebApi.hash,
			})
		}
	}
	return undefined
}
