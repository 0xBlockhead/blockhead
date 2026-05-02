import { getJson } from '$/lib/http.ts'
import { bskyPublicXrpcGet } from '$/sources/AtprotoBsky/Rest/client.ts'
import {
	atprotoBskyOrigins,
	publicAppViewXrpcBase,
} from '$/sources/AtprotoBsky/Rest/constants.ts'
import type {
	BskyAppViewGetAuthorFeedResponseWire,
	BskyAppViewGetPostsResponseWire,
	BskyAppViewProfileWire,
} from '$/sources/AtprotoBsky/Rest/types.ts'

export const bskyGetProfile = async (actor: string) => (
	bskyPublicXrpcGet<BskyAppViewProfileWire>(
		'/app.bsky.actor.getProfile',
		{ actor },
	)
)

export const bskyGetPosts = async (uris: string[]) => (
	uris.length === 0 ?
		{ posts: [] } satisfies BskyAppViewGetPostsResponseWire
	:	getJson<BskyAppViewGetPostsResponseWire>(
		`${publicAppViewXrpcBase}/app.bsky.feed.getPosts?${(
			new URLSearchParams(uris.map((u) => ['uris', u])).toString()
		)}`,
		{ origins: atprotoBskyOrigins },
	)
)

export const bskyGetAuthorFeed = async ({
	actor,
	limit = 30,
	cursor,
}: {
	actor: string
	limit?: number
	cursor?: string
}) => (
	bskyPublicXrpcGet<BskyAppViewGetAuthorFeedResponseWire>(
		'/app.bsky.feed.getAuthorFeed',
		{
			actor,
			limit,
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
	bskyPublicXrpcGet<{
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

export const bskySearchPosts = async ({
	limit = 25,
	q,
}: {
	limit?: number
	q: string
}) => (
	bskyPublicXrpcGet<{
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
