// Types
import { mastodonDefaultInstanceOrigin } from '$/constants/Mastodon.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { schema } from '$/schema/index.ts'


// Constants
export const activityPubNetworkFieldValues = {
	docsUrl: 'https://w3c.github.io/activitypub/',
	homeUrl: 'https://www.w3.org/TR/activitypub/',
	protocolName: 'ActivityPub (federated)',
	registryLabel: 'Configured Mastodon instance + curated seed actors',
	topology: 'network -> actors -> notes -> thread',
} as const

export const activityPubNetworkSeedActors: readonly EntityId<typeof schema, EntityType.ActivityPubActor>[] = [
	{
		instanceOrigin: mastodonDefaultInstanceOrigin,
		localAccountId: 'Gargron@mastodon.social',
	},
	{
		instanceOrigin: mastodonDefaultInstanceOrigin,
		localAccountId: 'mastodon@mastodon.social',
	},
]
