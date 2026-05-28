/**
 * Known Mastodon HTTP API (v1) instances. Wire is always REST; entity layer uses ActivityPub* types.
 * Switch default by changing `mastodonDefaultInstanceKey` (or add keys and map in code), not per-instance env.
 */


// Types

export type MastodonInstanceKey = 'mastodon_social'


// Constants

const mastodonInstances = [
	{
		key: 'mastodon_social',
		origin: 'https://mastodon.social',
	},
] as const satisfies readonly {
	key: MastodonInstanceKey
	origin: `https://${string}`
}[]

export const mastodonDefaultInstanceKey: MastodonInstanceKey = 'mastodon_social'


// Lookups

export const mastodonInstanceByKey = Object.fromEntries(
	mastodonInstances.map((row) => [
		row.key,
		row,
	]),
)

export const mastodonDefaultInstanceOrigin = mastodonInstanceByKey[mastodonDefaultInstanceKey].origin
