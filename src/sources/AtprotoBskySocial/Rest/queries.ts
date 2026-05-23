import { getJson } from '$/lib/http.ts'
import { bskySocialXrpcGet } from '$/sources/AtprotoBskySocial/Rest/client.ts'
import AtprotoBskySocial from '$/sources/AtprotoBskySocial/index.ts'
import { bskySocialXrpcBase } from '$/sources/AtprotoBskySocial/Rest/constants.ts'
import type {
	BskyAppViewGetAuthorFeedResponseWire,
	BskyAppViewGetPostThreadResponseWire,
	BskyAppViewGetPostsResponseWire,
	BskyAppViewProfileWire,
} from '$/sources/AtprotoBsky/Rest/types.ts'

export const bskySocialGetProfile = async (actor: string) => (
	bskySocialXrpcGet<BskyAppViewProfileWire>(
		'/app.bsky.actor.getProfile',
		{ actor },
	)
)

export const bskySocialGetPosts = async (uris: string[]) => (
	uris.length === 0 ?
		{ posts: [] } satisfies BskyAppViewGetPostsResponseWire
	:	getJson<BskyAppViewGetPostsResponseWire>(
		`${bskySocialXrpcBase}/app.bsky.feed.getPosts?${(
			new URLSearchParams(uris.map((u) => ['uris', u])).toString()
		)}`,
		{ origins: AtprotoBskySocial.origins ?? [] },
	)
)

export const bskySocialGetPostThread = async (
	uri: string,
	{
		depth = 6,
		parentHeight = 80,
	}: {
		depth?: number
		parentHeight?: number
	} = {},
) => (
	bskySocialXrpcGet<BskyAppViewGetPostThreadResponseWire>(
		'/app.bsky.feed.getPostThread',
		{
			uri,
			depth,
			parentHeight,
		},
	)
)

export const bskySocialGetAuthorFeed = async ({
	actor,
	limit = 30,
	cursor,
}: {
	actor: string
	limit?: number
	cursor?: string
}) => (
	bskySocialXrpcGet<BskyAppViewGetAuthorFeedResponseWire>(
		'/app.bsky.feed.getAuthorFeed',
		{
			actor,
			limit,
			cursor: cursor == null || cursor === '' ? undefined : cursor,
		},
	)
)

export const bskySocialSearchActorsTypeahead = async ({
	limit = 25,
	q,
}: {
	limit?: number
	q: string
}) => (
	bskySocialXrpcGet<{
		actors?: {
			did?: string
		}[]
	}>(
		'/app.bsky.actor.searchActorsTypeahead',
		{
			limit,
			q,
		},
	)
)

export const bskySocialSearchPosts = async ({
	limit = 25,
	q,
}: {
	limit?: number
	q: string
}) => (
	bskySocialXrpcGet<{
		posts?: {
			author?: {
				did?: string
			}
			uri?: string
		}[]
	}>(
		'/app.bsky.feed.searchPosts',
		{
			limit,
			q,
		},
	)
)
