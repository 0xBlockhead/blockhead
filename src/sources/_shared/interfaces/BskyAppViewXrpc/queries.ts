import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { firstHttpUrlForBinding, sourceGetJson } from '$/sources/_runtime/http.ts'
import type {
	AtprotoIdentityResolveHandleResponse,
	BskyAppViewGetAuthorFeedResponse,
	BskyAppViewActorListResponse,
	BskyAppViewGetFeedGeneratorResponse,
	BskyAppViewGetListResponse,
	BskyAppViewGetStarterPackResponse,
	BskyAppViewGetLikesResponse,
	BskyAppViewGetPostThreadResponse,
	BskyAppViewGetPostsResponse,
	BskyAppViewGetRepostedByResponse,
	BskyAppViewProfile,
	BskyAppViewSearchActorsResponse,
	BskyAppViewSearchActorsTypeaheadResponse,
	BskyAppViewSearchPostsResponse,
} from '$/sources/_shared/interfaces/BskyAppViewXrpc/types.ts'
import {
	atprotoIdentityResolveHandleResponseWire,
	bskyAppViewGetAuthorFeedResponseWire,
	bskyAppViewGetFeedGeneratorResponseWire,
	bskyAppViewGetListResponseWire,
	bskyAppViewGetStarterPackResponseWire,
	bskyAppViewFollowersResponseWire,
	bskyAppViewFollowsResponseWire,
	bskyAppViewGetLikesResponseWire,
	bskyAppViewGetPostThreadResponseWire,
	bskyAppViewGetPostsResponseWire,
	bskyAppViewGetRepostedByResponseWire,
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
		getFeedGenerator: async (feed: string) => {
			const response = assertEnvelope(
				'feed-generator',
				bskyAppViewGetFeedGeneratorResponseWire,
				await get<BskyAppViewGetFeedGeneratorResponse>(
					'/app.bsky.feed.getFeedGenerator',
					[['feed', feed]]
				)
			)
			if (response.view.uri !== feed)
				throw new Error('BskyAppView_Xrpc: feed-generator response subject mismatch')

			return response
		},
		getList: async (list: string) => {
			const response = assertEnvelope('graph-list', bskyAppViewGetListResponseWire, await get<BskyAppViewGetListResponse>('/app.bsky.graph.getList', [['list', list]]))
			if (response.list.uri !== list)
				throw new Error('BskyAppView_Xrpc: graph-list response subject mismatch')
			return response
		},
		getStarterPack: async (starterPack: string) => {
			const response = assertEnvelope('starter-pack', bskyAppViewGetStarterPackResponseWire, await get<BskyAppViewGetStarterPackResponse>('/app.bsky.graph.getStarterPack', [['starterPack', starterPack]]))
			if (response.starterPack.uri !== starterPack)
				throw new Error('BskyAppView_Xrpc: starter-pack response subject mismatch')
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
		getFollowers: async ({
			actor,
			limit = 50,
			cursor,
		}: {
			actor: string
			limit?: number
			cursor?: string
		}) => {
			const response = assertEnvelope(
				'followers',
				bskyAppViewFollowersResponseWire,
				await get<BskyAppViewActorListResponse>(
					'/app.bsky.graph.getFollowers',
					[
						['actor', actor],
						['limit', limit],
						['cursor', cursor == null || cursor === '' ? undefined : cursor],
					]
				)
			)
			if (actor.startsWith('did:') && response.subject.did !== actor)
				throw new Error('BskyAppView_Xrpc: followers response subject mismatch')

			return response
		},
		getFollows: async ({
			actor,
			limit = 50,
			cursor,
		}: {
			actor: string
			limit?: number
			cursor?: string
		}) => {
			const response = assertEnvelope(
				'follows',
				bskyAppViewFollowsResponseWire,
				await get<BskyAppViewActorListResponse>(
					'/app.bsky.graph.getFollows',
					[
						['actor', actor],
						['limit', limit],
						['cursor', cursor == null || cursor === '' ? undefined : cursor],
					]
				)
			)
			if (actor.startsWith('did:') && response.subject.did !== actor)
				throw new Error('BskyAppView_Xrpc: follows response subject mismatch')

			return response
		},
		getLikes: async ({
			uri,
			cid,
			limit = 50,
			cursor,
		}: {
			uri: string
			cid?: string
			limit?: number
			cursor?: string
		}) => {
			const response = assertEnvelope(
				'likes',
				bskyAppViewGetLikesResponseWire,
				await get<BskyAppViewGetLikesResponse>(
					'/app.bsky.feed.getLikes',
					[
						['uri', uri],
						['cid', cid],
						['limit', limit],
						['cursor', cursor == null || cursor === '' ? undefined : cursor],
					]
				)
			)
			if (response.uri !== uri || (cid != null && response.cid !== cid))
				throw new Error('BskyAppView_Xrpc: likes response subject mismatch')

			return response
		},
		getRepostedBy: async ({
			uri,
			cid,
			limit = 50,
			cursor,
		}: {
			uri: string
			cid?: string
			limit?: number
			cursor?: string
		}) => {
			const response = assertEnvelope(
				'reposted-by',
				bskyAppViewGetRepostedByResponseWire,
				await get<BskyAppViewGetRepostedByResponse>(
					'/app.bsky.feed.getRepostedBy',
					[
						['uri', uri],
						['cid', cid],
						['limit', limit],
						['cursor', cursor == null || cursor === '' ? undefined : cursor],
					]
				)
			)
			if (response.uri !== uri || (cid != null && response.cid !== cid))
				throw new Error('BskyAppView_Xrpc: reposted-by response subject mismatch')

			return response
		},
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
