// Types
import { fediDefaultInstanceOrigin } from '$/constants/Fedi.ts'
import { mastodonDefaultInstanceOrigin } from '$/constants/Mastodon.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'


// Constants
export const activityPubNetworkFieldValues = {
	docsUrl: 'https://w3c.github.io/activitypub/',
	homeUrl: 'https://www.w3.org/TR/activitypub/',
	protocolName: 'ActivityPub (federated)',
	registryLabel: 'Configured Mastodon-compatible instances + curated seed actors',
	topology: 'Constants seeds + live REST (multi-instance) -> network -> actors -> notes -> thread',
} as const

export const activityPubNetworkSeedActors: readonly EntitySelector<typeof schema, EntityType.ActivityPubActor>[] = [
	{
		instanceOrigin: mastodonDefaultInstanceOrigin,
		localAccountId: 'Gargron@mastodon.social',
	},
	{
		instanceOrigin: mastodonDefaultInstanceOrigin,
		localAccountId: 'mastodon@mastodon.social',
	},
	{
		instanceOrigin: fediDefaultInstanceOrigin,
		localAccountId: 'fosstodon@fosstodon.org',
	},
	{
		instanceOrigin: fediDefaultInstanceOrigin,
		localAccountId: 'matt@fosstodon.org',
	},
]
