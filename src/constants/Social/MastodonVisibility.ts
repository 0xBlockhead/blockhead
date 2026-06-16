// Types
export type MastodonVisibility = (typeof mastodonVisibilities)[number]['visibility']


// Constants
export const mastodonVisibilities = [
	{
		visibility: 'public',
		label: 'Public',
	},
	{
		visibility: 'unlisted',
		label: 'Unlisted',
	},
	{
		visibility: 'private',
		label: 'Followers only',
	},
	{
		visibility: 'direct',
		label: 'Direct message',
	},
] as const satisfies readonly {
	visibility: string
	label: string
}[]


// Lookups
export const mastodonVisibilityByVisibility = Object.fromEntries(
	mastodonVisibilities.map((row) => [
		row.visibility,
		row,
	])
)
