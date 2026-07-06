/**
	* Known Mastodon HTTP API (v1) instances. Wire is always REST; entity layer uses ActivityPub* types.
	*/


// Types

export type MastodonInstanceKey =
	| 'mastodon_social'
	| 'fosstodon'


// Constants

export const mastodonInstances = [
	{
		key: 'mastodon_social',
		origin: 'https://mastodon.social',
	},
	{
		key: 'fosstodon',
		origin: 'https://fosstodon.org',
	},
] as const satisfies readonly {
	key: MastodonInstanceKey
	origin: `https://${string}`
}[]


// Lookups

export const mastodonInstanceByKey = Object.fromEntries(
	mastodonInstances.map((row) => [
		row.key,
		row,
	])
)

export const mastodonInstanceByBaseUrl = Object.fromEntries(
	mastodonInstances.map((row) => [
		row.origin,
		row,
	])
)
