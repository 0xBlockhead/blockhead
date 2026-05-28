// Types

export type FarcasterFeedVariant = 'trending' | 'byUser' | 'byChannel' | 'following'


// Constants

export const farcasterNetworkFieldValues = {
	docsUrl: 'https://docs.farcaster.xyz',
	homeUrl: 'https://www.farcaster.xyz',
	protocolName: 'Farcaster',
	registryLabel: 'Client API registries + Snapchain / Neynar feeds',
	topology: 'live REST hub + indexer -> network -> feeds / channels / users -> casts',
} as const

const farcasterFeedKinds = [
	{
		variant: 'trending',
		label: 'Trending',
	},
	{
		variant: 'byUser',
		label: 'By user',
	},
	{
		variant: 'byChannel',
		label: 'By channel',
	},
	{
		variant: 'following',
		label: 'Following',
	},
] as const satisfies readonly {
	variant: FarcasterFeedVariant
	label: string
}[]


// Lookups

export const farcasterFeedKindByVariant = Object.fromEntries(
	farcasterFeedKinds.map((row) => [
		row.variant,
		row,
	]),
)
