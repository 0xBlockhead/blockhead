// Constants
/** Subreddit `name` matches Reddit’s canonical id: lowercase, no `r/` prefix. */
export const redditNetworkSeedSubreddits = [
	{ name: 'askreddit' },
	{ name: 'ethereum' },
	{ name: 'sveltejs' },
] as const satisfies readonly {
	name: string
}[]
