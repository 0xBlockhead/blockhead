import { getJson } from '$/lib/http.ts'
import { bskyPublicXrpcGet } from '$/sources/AtprotoBsky/Rest/client.ts'
import AtprotoBsky from '$/sources/AtprotoBsky/index.ts'
import { publicAppViewXrpcBase } from '$/sources/AtprotoBsky/Rest/constants.ts'
import type {
	BskyAppViewGetAuthorFeedResponse,
	BskyAppViewGetPostThreadResponse,
	BskyAppViewGetPostsResponse,
	BskyAppViewProfile,
	BskyAppViewSearchActorsTypeaheadResponse,
	BskyAppViewSearchPostsResponse,
} from '$/sources/AtprotoBsky/Rest/types.ts'

export const bskyGetProfile = async (actor: string) => (
	bskyPublicXrpcGet<BskyAppViewProfile>(
		'/app.bsky.actor.getProfile',
		{ actor },
	)
)

export const bskyGetPosts = async (uris: string[]) => (
	uris.length === 0 ?
		{ posts: [] } satisfies BskyAppViewGetPostsResponse
	:	getJson<BskyAppViewGetPostsResponse>(
		`${publicAppViewXrpcBase}/app.bsky.feed.getPosts?${(
			new URLSearchParams(uris.map((u) => ['uris', u])).toString()
		)}`,
		{ origins: AtprotoBsky.origins ?? [] },
	)
)

export const bskyGetPostThread = async (
	uri: string,
	{
		depth = 6,
		parentHeight = 80,
	}: {
		depth?: number
		parentHeight?: number
	} = {},
) => (
	bskyPublicXrpcGet<BskyAppViewGetPostThreadResponse>(
		'/app.bsky.feed.getPostThread',
		{
			uri,
			depth,
			parentHeight,
		},
	)
)

export const bskyGetAuthorFeed = async ({
	actor,
	limit = 30,
	cursor,
	includePins = true,
}: {
	actor: string
	limit?: number
	cursor?: string
	includePins?: boolean
}) => (
	bskyPublicXrpcGet<BskyAppViewGetAuthorFeedResponse>(
		'/app.bsky.feed.getAuthorFeed',
		{
				actor,
				limit,
				includePins: includePins == null ? undefined : String(includePins),
				cursor: cursor == null || cursor === '' ? undefined : cursor,
			},
	)
)

export const bskySearchActorsTypeahead = async ({
	limit = 25,
	q,
}: {
	limit?: number
	q: string
}) => (
	bskyPublicXrpcGet<BskyAppViewSearchActorsTypeaheadResponse>(
		'/app.bsky.actor.searchActorsTypeahead',
		{
			limit,
			q,
		},
	)
)

export const bskySearchPosts = async ({
	limit = 25,
	q,
}: {
	limit?: number
	q: string
}) => (
	bskyPublicXrpcGet<BskyAppViewSearchPostsResponse>(
		'/app.bsky.feed.searchPosts',
		{
			limit,
			q,
		},
	)
)
