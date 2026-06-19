// Constants
/** Subreddit `name` matches Reddit’s canonical id: lowercase, no `r/` prefix. */
export const redditNetworkSeedSubreddits = [
	{ name: 'askreddit' },
	{ name: 'ethereum' },
	{ name: 'sveltejs' },
] as const satisfies readonly {
	name: string
}[]

/** Link `fullname` is Reddit's canonical `t3_` thing id. */
export const redditNetworkSeedLinks = [
	{
		fullname: 't3_1u8x2f8',
		title: 'Daily General Discussion June 18, 2026',
		permalink: '/r/ethereum/comments/1u8x2f8/daily_general_discussion_june_18_2026/',
		author: '/u/EthereumDailyThread',
		createdAt: 1781758884000,
		subredditName: 'ethereum',
	},
] as const satisfies readonly {
	fullname: string
	title: string
	permalink: string
	author: string
	createdAt: number
	subredditName: string
}[]

/** Comment `fullname` is Reddit's canonical `t1_` thing id. */
export const redditNetworkSeedComments = [
	{
		fullname: 't1_osbo75d',
		body: 'Ethereum!',
		author: '/u/Mysterious_Town6196',
		createdAt: 1781758895000,
		linkFullname: 't3_1u8x2f8',
	},
] as const satisfies readonly {
	fullname: string
	body: string
	author: string
	createdAt: number
	linkFullname: string
}[]
