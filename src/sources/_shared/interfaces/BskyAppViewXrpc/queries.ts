import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { firstHttpUrlForBinding, sourceGetJson } from '$/sources/_runtime/http.ts'
import type {
	AtprotoIdentityResolveHandleResponse,
	BskyAppViewGetAuthorFeedResponse,
	BskyAppViewGetPostThreadResponse,
	BskyAppViewGetPostsResponse,
	BskyAppViewProfile,
	BskyAppViewSearchActorsTypeaheadResponse,
	BskyAppViewSearchPostsResponse,
} from '$/sources/_shared/interfaces/BskyAppViewXrpc/types.ts'

export const bskyAppViewXrpc = (binding: SourceBinding) => {
	const get = <_Response>(
		path: `/${string}`,
		params: readonly (readonly [
			name: string,
			value: string | number | undefined,
		])[]
	) => sourceGetJson<_Response>(
		binding,
		`${firstHttpUrlForBinding(binding)}/xrpc${path}${params.length === 0 ? '' : `?${new URLSearchParams(params.flatMap(([name, value]) => (
			value == null ? [] : [[name, String(value)]]
		)))}`}`
	)

	return {
		resolveHandle: (handle: string) => get<AtprotoIdentityResolveHandleResponse>(
			'/com.atproto.identity.resolveHandle',
			[['handle', handle]]
		),
		getProfile: (actor: string) => get<BskyAppViewProfile>(
			'/app.bsky.actor.getProfile',
			[['actor', actor]]
		),
		getPosts: async (uris: string[]) => (
			uris.length === 0 ?
				{ posts: [] }
			:
				get<BskyAppViewGetPostsResponse>(
					'/app.bsky.feed.getPosts',
					uris.map((uri) => ['uris', uri])
				)
		),
		getPostThread: (
			uri: string,
			{
				depth = 6,
				parentHeight = 80,
			}: {
				depth?: number
				parentHeight?: number
			} = {}
		) => get<BskyAppViewGetPostThreadResponse>(
			'/app.bsky.feed.getPostThread',
			[
				['uri', uri],
				['depth', depth],
				['parentHeight', parentHeight],
			]
		),
		getAuthorFeed: ({
			actor,
			limit = 30,
			cursor,
			includePins = true,
		}: {
			actor: string
			limit?: number
			cursor?: string
			includePins?: boolean
		}) => get<BskyAppViewGetAuthorFeedResponse>(
			'/app.bsky.feed.getAuthorFeed',
			[
				['actor', actor],
				['limit', limit],
				['includePins', String(includePins)],
				['cursor', cursor == null || cursor === '' ? undefined : cursor],
			]
		),
		searchActorsTypeahead: ({
			limit = 25,
			q,
		}: {
			limit?: number
			q: string
		}) => get<BskyAppViewSearchActorsTypeaheadResponse>(
			'/app.bsky.actor.searchActorsTypeahead',
			[
				['limit', limit],
				['q', q],
			]
		),
		searchPosts: ({
			limit = 25,
			q,
		}: {
			limit?: number
			q: string
		}) => get<BskyAppViewSearchPostsResponse>(
			'/app.bsky.feed.searchPosts',
			[
				['limit', limit],
				['q', q],
			]
		),
	}
}
