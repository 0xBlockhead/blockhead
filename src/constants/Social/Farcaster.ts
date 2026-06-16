// Types

export type FarcasterFeedVariant = 'trending' | 'byUser' | 'byChannel' | 'following'


export const farcasterPlaceholderIconUrlFragments = [
	'/missing.',
	'missing.png',
	'missing.jpg',
	'missing.jpeg',
	'default-avatar',
	'default_avatar',
	'default_profile',
	'profile_images/default',
	'avatar-default',
	'anonymous.',
	'grey_silhouette',
	'person_blue_generic',
] as const

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
	])
)
