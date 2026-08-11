import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { firstHttpUrlForBinding, sourceGetJson } from '$/sources/_runtime/http.ts'
import type {
	AtprotoIdentityResolveHandleResponse,
	BskyAppViewGetAuthorFeedResponse,
	BskyAppViewGetPostThreadResponse,
	BskyAppViewGetPostsResponse,
	BskyAppViewProfile,
	BskyAppViewSearchActorsResponse,
	BskyAppViewSearchActorsTypeaheadResponse,
	BskyAppViewSearchPostsResponse,
} from '$/sources/_shared/interfaces/BskyAppViewXrpc/types.ts'
import {
	atprotoIdentityResolveHandleResponseWire,
	bskyAppViewGetAuthorFeedResponseWire,
	bskyAppViewGetPostThreadResponseWire,
	bskyAppViewGetPostsResponseWire,
	bskyAppViewProfileWireAssert,
	bskyAppViewSearchActorsResponseWire,
	bskyAppViewSearchActorsTypeaheadResponseWire,
	bskyAppViewSearchPostsResponseWire,
} from '$/sources/_shared/interfaces/BskyAppViewXrpc/types.ts'

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`BskyAppView_Xrpc: invalid ${label} response envelope`)
	}
}

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
		resolveHandle: async (handle: string) => (
			assertEnvelope(
				'resolve-handle',
				atprotoIdentityResolveHandleResponseWire,
				await get<AtprotoIdentityResolveHandleResponse>(
					'/com.atproto.identity.resolveHandle',
					[['handle', handle]]
				)
			)
		),
		getProfile: async (actor: string) => (
			assertEnvelope(
				'profile',
				bskyAppViewProfileWireAssert,
				await get<BskyAppViewProfile>(
					'/app.bsky.actor.getProfile',
					[['actor', actor]]
				)
			)
		),
		getPosts: async (uris: string[]) => {
			if (uris.length === 0)
				return { posts: [] }

			const response = assertEnvelope(
				'posts',
				bskyAppViewGetPostsResponseWire,
				await get<BskyAppViewGetPostsResponse>(
					'/app.bsky.feed.getPosts',
					uris.map((uri) => ['uris', uri])
				)
			)
			const requestedUris = new Set(uris)
			if (response.posts.some(({ uri }) => !requestedUris.has(uri)))
				throw new Error('BskyAppView_Xrpc: posts response subject mismatch')
			if (new Set(response.posts.map(({ uri }) => uri)).size !== response.posts.length)
				throw new Error('BskyAppView_Xrpc: duplicate post URI')

			return response
		},
		getPostThread: async (
			uri: string,
			{
				depth = 6,
				parentHeight = 80,
			}: {
				depth?: number
				parentHeight?: number
			} = {}
		) => (
			assertEnvelope(
				'post-thread',
				bskyAppViewGetPostThreadResponseWire,
				await get<BskyAppViewGetPostThreadResponse>(
					'/app.bsky.feed.getPostThread',
					[
						['uri', uri],
						['depth', depth],
						['parentHeight', parentHeight],
					]
				)
			)
		),
		getAuthorFeed: async ({
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
			assertEnvelope(
				'author-feed',
				bskyAppViewGetAuthorFeedResponseWire,
				await get<BskyAppViewGetAuthorFeedResponse>(
					'/app.bsky.feed.getAuthorFeed',
					[
						['actor', actor],
						['limit', limit],
						['includePins', String(includePins)],
						['cursor', cursor == null || cursor === '' ? undefined : cursor],
					]
				)
			)
		),
		searchActorsTypeahead: async ({
			limit = 25,
			q,
		}: {
			limit?: number
			q: string
		}) => (
			assertEnvelope(
				'search-actors-typeahead',
				bskyAppViewSearchActorsTypeaheadResponseWire,
				await get<BskyAppViewSearchActorsTypeaheadResponse>(
					'/app.bsky.actor.searchActorsTypeahead',
					[
						['limit', limit],
						['q', q],
					]
				)
			)
		),
		searchActors: async ({
			limit = 25,
			q,
			cursor,
		}: {
			limit?: number
			q: string
			cursor?: string
		}) => (
			assertEnvelope(
				'search-actors',
				bskyAppViewSearchActorsResponseWire,
				await get<BskyAppViewSearchActorsResponse>(
					'/app.bsky.actor.searchActors',
					[
						['limit', limit],
						['q', q],
						['cursor', cursor == null || cursor === '' ? undefined : cursor],
					]
				)
			)
		),
		searchPosts: async ({
			limit = 25,
			q,
			cursor,
		}: {
			limit?: number
			q: string
			cursor?: string
		}) => (
			assertEnvelope(
				'search-posts',
				bskyAppViewSearchPostsResponseWire,
				await get<BskyAppViewSearchPostsResponse>(
					'/app.bsky.feed.searchPosts',
					[
						['limit', limit],
						['q', q],
						['cursor', cursor == null || cursor === '' ? undefined : cursor],
					]
				)
			)
		),
	}
}
