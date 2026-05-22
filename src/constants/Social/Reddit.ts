// Types
import type { EntityId } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { schema } from '$/schema/index.ts'


// Constants
export const redditNetworkFieldValues = {
	docsUrl: 'https://www.reddit.com/dev/api/',
	homeUrl: 'https://www.reddit.com',
	protocolName: 'Reddit data API',
	registryLabel: 'Curated seed subreddits + live subreddit hot feeds',
	topology: 'Constants seeds + live JSON API -> network -> subreddits -> links -> comments',
} as const

/** Subreddit `name` matches Reddit’s canonical id: lowercase, no `r/` prefix. */
export const redditNetworkSeedSubreddits: readonly EntityId<typeof schema, EntityType.RedditSubreddit>[] = [
	{ name: 'askreddit' },
	{ name: 'ethereum' },
	{ name: 'sveltejs' },
]
