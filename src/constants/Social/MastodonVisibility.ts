// Types


// Constants
export const mastodonVisibilities = [
	'public',
	'unlisted',
	'private',
	'direct',
] as const satisfies readonly string[]

const mastodonVisibilityRows = [
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
	visibility: (typeof mastodonVisibilities)[number]
	label: string
}[]


// Lookups
export const mastodonVisibilityByVisibility = Object.fromEntries(
	mastodonVisibilityRows.map((row) => [
		row.visibility,
		row,
	]),
)
