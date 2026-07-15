/** Official aggregate from [ethereum-lists/chains](https://github.com/ethereum-lists/chains) on GitHub Pages. */
export const origin = 'https://chainid.network'

export const githubApiOrigin = 'https://api.github.com'

export const ethereumListsOrigins = [
	{
		origin,
		corsEnabled: true,
	},
	{
		origin: githubApiOrigin,
		corsEnabled: true,
	},
] as const

export const chainsJsonPath = '/chains.json'
