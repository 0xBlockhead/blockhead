import { fediInstanceBySlug } from '$/constants/Fedi.ts'
import { mastodonInstanceByKey } from '$/constants/Mastodon.ts'


// Constants
export const activityPubNetworkSeedActors = [
	{
		instanceOrigin: mastodonInstanceByKey.mastodon_social.origin,
		localAccountId: 'Gargron@mastodon.social',
	},
	{
		instanceOrigin: mastodonInstanceByKey.mastodon_social.origin,
		localAccountId: 'mastodon@mastodon.social',
	},
	{
		instanceOrigin: fediInstanceBySlug.fosstodon.origin,
		localAccountId: 'fosstodon@fosstodon.org',
	},
	{
		instanceOrigin: fediInstanceBySlug.fosstodon.origin,
		localAccountId: 'matt@fosstodon.org',
	},
] as const satisfies readonly {
	instanceOrigin: string
	localAccountId: string
}[]
