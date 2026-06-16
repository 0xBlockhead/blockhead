// Constants
export const rssNetworkSeedFeeds = [
	{ feedUrl: 'https://hnrss.org/frontpage' },
	{ feedUrl: 'https://feeds.bbci.co.uk/news/rss.xml' },
] as const satisfies readonly {
	feedUrl: string
}[]
