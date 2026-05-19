/**
 * Known Mastodon HTTP API (v1) instances. Wire is always REST; entity layer uses ActivityPub* types.
 * Switch default by changing `mastodonDefaultInstanceKey` (or add keys and map in code), not per-instance env.
 */


// Types


// Constants
export const mastodonInstanceByKey = {
	mastodon_social: {
		origin: 'https://mastodon.social' as const,
	},
} as const

export type MastodonInstanceKey = keyof typeof mastodonInstanceByKey

export const mastodonDefaultInstanceKey: MastodonInstanceKey = 'mastodon_social'

export const mastodonDefaultInstanceOrigin = (
	mastodonInstanceByKey[mastodonDefaultInstanceKey].origin
)
