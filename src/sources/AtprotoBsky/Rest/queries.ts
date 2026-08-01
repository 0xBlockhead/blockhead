import { bskyPublicXrpcGet } from '$/sources/AtprotoBsky/Rest/client.ts'
import type {
	AtprotoIdentityResolveHandleResponse,
	BskyAppViewGetAuthorFeedResponse,
	BskyAppViewGetPostThreadResponse,
	BskyAppViewGetPostsResponse,
	BskyAppViewProfile,
	BskyAppViewSearchActorsTypeaheadResponse,
	BskyAppViewSearchPostsResponse,
} from '$/sources/AtprotoBsky/Rest/types.ts'

export const resolveHandle = (handle: string) => (
	bskyPublicXrpcGet<AtprotoIdentityResolveHandleResponse>(
		'/com.atproto.identity.resolveHandle',
		{ handle }
	)
)

export const getProfile = (actor: string) => (
	bskyPublicXrpcGet<BskyAppViewProfile>(
		'/app.bsky.actor.getProfile',
		{ actor }
	)
)

export const getPosts = async (uris: string[]) => (
	uris.length === 0 ?
		{ posts: [] } satisfies BskyAppViewGetPostsResponse
	:
		bskyPublicXrpcGet<BskyAppViewGetPostsResponse>(
			'/app.bsky.feed.getPosts',
			{ uris }
		)
)

export const getPostThread = (
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

export const getAuthorFeed = ({
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

export const searchActorsTypeahead = ({
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

export const searchPosts = ({
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
		}
	)
)
