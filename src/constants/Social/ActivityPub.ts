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
		instanceOrigin: mastodonInstanceByKey.fosstodon.origin,
		acct: 'fosstodon@fosstodon.org',
	},
	{
		instanceOrigin: mastodonInstanceByKey.fosstodon.origin,
		acct: 'matt@fosstodon.org',
	},
] as const satisfies readonly {
	instanceOrigin: string
	acct: string
}[]
