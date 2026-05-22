import { fxEmbedGet } from '$/sources/FxEmbed/Rest/client.ts'
import type {
	FxEmbedSearchResultsWire,
	FxEmbedSocialThreadWire,
	FxEmbedUserResponseWire,
} from '$/sources/FxEmbed/Rest/types.ts'

const clampFxEmbedCount = (count: number) => (
	Math.min(100, Math.max(1, count))
)

const profileHandleParam = (idOrUsername: string) => {
	const trimmed = idOrUsername.trim()
	return (
		/^\d+$/.test(trimmed) ?
			`id:${trimmed}`
		:
			trimmed
	)
}

/**
 * GET /2/profile/{handle} — numeric id as `id:{snowflake}` or username without @.
 */
export const fxEmbedGetUser = async (idOrUsername: string) => (
	fxEmbedGet<FxEmbedUserResponseWire>(
		`/profile/${encodeURIComponent(profileHandleParam(idOrUsername))}`,
	)
)

/**
 * GET /2/status/{id} — tweet/post snowflake id.
 */
export const fxEmbedGetStatus = async (id: string) => (
	fxEmbedGet<FxEmbedSocialThreadWire>(
		`/status/${encodeURIComponent(id.trim())}`,
	)
)

/**
 * GET /2/search
 */
export const fxEmbedSearchStatuses = async (count: number) => (
	fxEmbedGet<FxEmbedSearchResultsWire>(
		'/search',
		{
			q: 'lang:en -is:retweet',
			feed: 'latest',
			count: clampFxEmbedCount(count),
		},
	)
)

/**
 * GET /2/profile/{handle}/statuses — numeric id as `id:{snowflake}` or username without @.
 */
export const fxEmbedGetUserStatuses = async (
	idOrUsername: string,
	count: number,
) => (
	fxEmbedGet<FxEmbedSearchResultsWire>(
		`/profile/${encodeURIComponent(profileHandleParam(idOrUsername))}/statuses`,
		{
			count: clampFxEmbedCount(count),
		},
	)
)
