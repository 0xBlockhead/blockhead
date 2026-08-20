import { fxEmbedGet } from '$/sources/FxEmbed/Rest/client.ts'
import type { components } from '$/sources/FxEmbed/OpenApi/openapi.d.ts'

export type FxEmbedUser = components['schemas']['APIUser']
export type FxEmbedTwitterStatus = Omit<
	components['schemas']['APITwitterStatus'],
	'quote' | 'media'
> & {
	media?: components['schemas']['APITwitterStatus']['media']
	quote?:
		| FxEmbedTwitterStatus
		| components['schemas']['APIStatusTombstone']
}
type FxEmbedSearchResults = Omit<
	components['schemas']['APISearchResults'],
	'results'
> & {
	results: FxEmbedTwitterStatus[]
}
type FxEmbedSocialThread = {
	code: number
	status:
		| FxEmbedTwitterStatus
		| components['schemas']['APIStatusTombstone']
		| null
	thread: (
		| FxEmbedTwitterStatus
		| components['schemas']['APIStatusTombstone']
	)[] | null
	author: FxEmbedUser | null
}
type FxEmbedUserResponse = components['schemas']['UserAPIResponse']

const clampFxEmbedCount = (count: number) => (
	Math.min(100, Math.max(1, count))
)

const profileHandleParam = (idOrUsername: string) => {
	return (
		/^\d+$/.test(idOrUsername) ?
			`id:${idOrUsername}`
		:
			idOrUsername
	)
}

/**
 * GET /2/profile/{handle} — numeric id as `id:{snowflake}` or username without @.
 */
export const getUser = (
	idOrUsername: string
) => (
	fxEmbedGet<FxEmbedUserResponse>(
		`/profile/${encodeURIComponent(profileHandleParam(idOrUsername))}`
	)
)

/**
 * GET /2/status/{id} — tweet/post snowflake id.
 */
export const getStatus = (
	id: string
) => (
	fxEmbedGet<FxEmbedSocialThread>(
		`/status/${encodeURIComponent(id)}`
	)
)

/**
 * GET /2/search
 */
export const searchStatuses = (
	count: number,
	cursor?: string
) => (
	fxEmbedGet<FxEmbedSearchResults>(
		'/search',
		{
			q: 'lang:en -is:retweet',
			feed: 'latest',
			count: clampFxEmbedCount(count),
			cursor,
		},
		[404]
	)
)

/**
 * GET /2/profile/{handle}/statuses — numeric id as `id:{snowflake}` or username without @.
 */
export const getUserStatuses = (
	idOrUsername: string,
	count: number,
	cursor?: string
) => (
	fxEmbedGet<FxEmbedSearchResults>(
		`/profile/${encodeURIComponent(profileHandleParam(idOrUsername))}/statuses`,
		{
			count: clampFxEmbedCount(count),
			cursor,
		}
	)
)
