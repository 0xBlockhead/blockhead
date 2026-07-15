import { getJson } from '$/lib/http.ts'
import { bskySocialXrpcGet } from '$/sources/AtprotoBskySocial/Rest/client.ts'
import {
	bskySocialOrigins,
	bskySocialXrpcBase,
} from '$/sources/AtprotoBskySocial/Rest/constants.ts'
import type {
	BskyAppViewGetAuthorFeedResponse,
	BskyAppViewGetPostThreadResponse,
	BskyAppViewGetPostsResponse,
	BskyAppViewProfile,
} from '$/sources/AtprotoBsky/Rest/types.ts'
import type {
	BskySocialSearchActorsTypeaheadResponse,
	BskySocialSearchPostsResponse,
} from '$/sources/AtprotoBskySocial/Rest/types.ts'

export const getProfile = async (actor: string) => (
	bskySocialXrpcGet<BskyAppViewProfile>(
		'/app.bsky.actor.getProfile',
		{ actor }
	)
)

export const getPosts = async (uris: string[]) => (
	uris.length === 0 ?
		{ posts: [] } satisfies BskyAppViewGetPostsResponse
	:
		getJson<BskyAppViewGetPostsResponse>(
			`${bskySocialXrpcBase}/app.bsky.feed.getPosts?${(
				new URLSearchParams(uris.map((u) => ['uris', u])).toString()
			)}`,
			{ origins: bskySocialOrigins }
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
	bskySocialXrpcGet<BskyAppViewGetPostThreadResponse>(
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
	bskySocialXrpcGet<BskyAppViewGetAuthorFeedResponse>(
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
	bskySocialXrpcGet<BskySocialSearchActorsTypeaheadResponse>(
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
	bskySocialXrpcGet<BskySocialSearchPostsResponse>(
		'/app.bsky.feed.searchPosts',
		{
			limit,
			q,
		}
	)
)
