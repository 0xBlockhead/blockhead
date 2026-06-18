import { getJson } from '$/lib/http.ts'
import { atprotoAppViewBySlug } from '$/constants/AtprotoAppView.ts'
import { bskyPublicXrpcGet } from '$/sources/AtprotoBsky/Rest/client.ts'
import AtprotoBsky from '$/sources/AtprotoBsky/index.ts'
import type {
	BskyAppViewGetAuthorFeedResponse,
	BskyAppViewGetPostThreadResponse,
	BskyAppViewGetPostsResponse,
	BskyAppViewProfile,
	BskyAppViewSearchActorsTypeaheadResponse,
	BskyAppViewSearchPostsResponse,
} from '$/sources/AtprotoBsky/Rest/types.ts'

export const getProfile = async (actor: string) => (
	bskyPublicXrpcGet<BskyAppViewProfile>(
		'/app.bsky.actor.getProfile',
		{ actor }
	)
)

export const getPosts = async (uris: string[]) => (
	uris.length === 0 ?
		{ posts: [] } satisfies BskyAppViewGetPostsResponse
	:
		getJson<BskyAppViewGetPostsResponse>(
			`${atprotoAppViewBySlug.bsky_public.origin}${atprotoAppViewBySlug.bsky_public.xrpcPath}/app.bsky.feed.getPosts?${(
			new URLSearchParams(uris.map((u) => [
				'uris',
				u,
			])).toString()
			)}`,
			{ origins: AtprotoBsky.origins  }
	)
)

export const getPostThread = async (
	uri: string,
	{
		depth = 6,
		parentHeight = 80,
	}: {
		depth?: number
		parentHeight?: number
	} = {}
) => (
	bskyPublicXrpcGet<BskyAppViewGetPostThreadResponse>(
		'/app.bsky.feed.getPostThread',
		{
			uri,
			depth,
			parentHeight,
		}
	)
)

export const getAuthorFeed = async ({
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
			includePins: String(includePins),
			cursor: cursor == null || cursor === '' ? undefined : cursor,
		}
	)
)

export const searchActorsTypeahead = async ({
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
		}
	)
)

export const searchPosts = async ({
	limit = 25,
	q,
}: {
	limit?: number
	q: string
}) => (
	getJson<BskyAppViewSearchPostsResponse>(
		`${atprotoAppViewBySlug.bsky_public.origin}${atprotoAppViewBySlug.bsky_public.xrpcPath}/app.bsky.feed.searchPosts?${(
			new URLSearchParams({
				limit: String(limit),
				q,
			}).toString()
		)}`,
		{ origins: AtprotoBsky.origins }
	)
)
