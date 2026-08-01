import { fxEmbedGet } from '$/sources/FxEmbed/Rest/client.ts'
import type {
	FxEmbedSearchResults,
	FxEmbedSocialThread,
	FxEmbedUserResponse,
} from '$/sources/FxEmbed/Rest/types.ts'

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
	count: number
) => (
	fxEmbedGet<FxEmbedSearchResults>(
		'/search',
		{
			q: 'lang:en -is:retweet',
			feed: 'latest',
			count: clampFxEmbedCount(count),
		}
	)
)

/**
 * GET /2/profile/{handle}/statuses — numeric id as `id:{snowflake}` or username without @.
 */
export const getUserStatuses = (
	idOrUsername: string,
	count: number
) => (
	fxEmbedGet<FxEmbedSearchResults>(
		`/profile/${encodeURIComponent(profileHandleParam(idOrUsername))}/statuses`,
		{
			count: clampFxEmbedCount(count),
		}
	)
)
