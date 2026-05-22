// Types
import type { EntityId } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { schema } from '$/schema/index.ts'


// Constants
export const rssNetworkFieldValues = {
	docsUrl: 'https://www.rssboard.org/rss-specification',
	homeUrl: 'https://www.rssboard.org',
	protocolName: 'RSS / Atom syndication',
	registryLabel: 'Constants feedUrl seeds + live item streams',
	topology: 'Constants feedUrl seeds + Rss_Rest XML / Rss2Json proxy -> network -> feeds -> items',
} as const

export const rssNetworkSeedFeeds: readonly EntityId<typeof schema, EntityType.RssFeed>[] = [
	{ feedUrl: 'https://blog.svelte.dev/feed.xml' },
	{ feedUrl: 'https://hnrss.org/frontpage' },
	{ feedUrl: 'https://feeds.bbci.co.uk/news/rss.xml' },
]
