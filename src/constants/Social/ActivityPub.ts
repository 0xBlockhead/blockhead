import { fediInstanceBySlug } from '$/constants/Fedi.ts'
import { mastodonInstanceByKey } from '$/constants/Mastodon.ts'


// Constants
export const activityPubNetworkSeedActors = [
	{
		instanceOrigin: mastodonInstanceByKey.mastodon_social.origin,
		acct: 'Gargron@mastodon.social',
	},
	{
		instanceOrigin: mastodonInstanceByKey.mastodon_social.origin,
		acct: 'mastodon@mastodon.social',
	},
	{
		instanceOrigin: fediInstanceBySlug.fosstodon.origin,
		acct: 'fosstodon@fosstodon.org',
	},
	{
		instanceOrigin: fediInstanceBySlug.fosstodon.origin,
		acct: 'matt@fosstodon.org',
	},
] as const satisfies readonly {
	instanceOrigin: string
	acct: string
}[]
